import * as React from "react";
import { X } from "lucide-react";
import type {
  Placeholder,
  SlideLayout,
  SlideSize,
} from "@/parser/pptxParser";
import {
  useSlideStore,
  type AreaRect,
  type ContentElementIndex,
} from "@/store/slideStore";
import {
  formatElementLabel,
  makeElementId,
  parseElementId,
} from "@/lib/elementId";
import {
  describeContentElement,
  isContentElementId,
  parseContentElementId,
} from "@/lib/contentElementId";
import {
  formatSlideAspect,
  getRenderSlideSize,
} from "@/lib/slideSize";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tooltip } from "./ui/tooltip";
const DRAG_THRESHOLD_NORM = 0.01;

interface AnnotationLayerProps {
  scale: number;
  layout: SlideLayout;
  slideSize?: SlideSize;
  activeMasterName: string;
  slideId: string;
  slideOrdinal: number;
  slideContent: Record<string, string>;
  themeColors: Record<string, string>;
}

interface DraftPin {
  x: number;
  y: number;
}

interface DraftArea {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Whether the drag started with a Shift modifier (for additive select). */
  additive?: boolean;
}

/** Placeholder whose bounding box contains a given point (all in %) */
function findPlaceholderAtPoint(
  layout: SlideLayout,
  xPercent: number,
  yPercent: number,
): Placeholder | null {
  for (let i = layout.placeholders.length - 1; i >= 0; i--) {
    const p = layout.placeholders[i];
    const { x, y, w, h } = p.position;
    if (
      xPercent >= x &&
      xPercent <= x + w &&
      yPercent >= y &&
      yPercent <= y + h
    ) {
      return p;
    }
  }
  return null;
}

function findNearestPlaceholder(
  layout: SlideLayout,
  xPercent: number,
  yPercent: number,
): Placeholder | null {
  if (layout.placeholders.length === 0) return null;
  let best: Placeholder | null = null;
  let bestDist = Infinity;
  for (const p of layout.placeholders) {
    const cx = p.position.x + p.position.w / 2;
    const cy = p.position.y + p.position.h / 2;
    const dx = cx - xPercent;
    const dy = cy - yPercent;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      best = p;
    }
  }
  return best;
}

/** Content-element ids whose rects overlap the given area (x/y/w/h in 0-1). */
function findOverlappingContentElementIds(
  index: ContentElementIndex | undefined,
  area: { x1: number; y1: number; x2: number; y2: number },
): string[] {
  if (!index) return [];
  const ax1 = Math.min(area.x1, area.x2);
  const ay1 = Math.min(area.y1, area.y2);
  const ax2 = Math.max(area.x1, area.x2);
  const ay2 = Math.max(area.y1, area.y2);
  const out: string[] = [];
  for (const id of Object.keys(index)) {
    const r = index[id].rect;
    const ex1 = r.x;
    const ey1 = r.y;
    const ex2 = r.x + r.w;
    const ey2 = r.y + r.h;
    if (ex1 < ax2 && ex2 > ax1 && ey1 < ay2 && ey2 > ay1) out.push(id);
  }
  return out;
}

/** Use document.elementsFromPoint to find a content-element under the cursor,
 * bypassing the annotation overlay that sits on top of the slide. */
function findContentElementIdAtPoint(
  clientX: number,
  clientY: number,
  overlay: Element | null,
): string | null {
  const els = document.elementsFromPoint(clientX, clientY);
  for (const el of els) {
    if (overlay && overlay.contains(el)) continue;
    const match = (el as Element).closest("[data-content-id]");
    if (match instanceof HTMLElement) {
      const id = match.getAttribute("data-content-id");
      if (id) return id;
    }
  }
  return null;
}

/** Placeholders whose bounding box overlaps a given area rect (all in %) */
function findOverlappingPlaceholders(
  layout: SlideLayout,
  area: { x1: number; y1: number; x2: number; y2: number },
): Placeholder[] {
  const ax1 = Math.min(area.x1, area.x2);
  const ay1 = Math.min(area.y1, area.y2);
  const ax2 = Math.max(area.x1, area.x2);
  const ay2 = Math.max(area.y1, area.y2);
  return layout.placeholders.filter((p) => {
    const px1 = p.position.x;
    const py1 = p.position.y;
    const px2 = p.position.x + p.position.w;
    const py2 = p.position.y + p.position.h;
    return px1 < ax2 && px2 > ax1 && py1 < ay2 && py2 > ay1;
  });
}

function describePlaceholder(
  p: Placeholder,
  content: Record<string, string>,
  slideId: string,
  slideOrdinal: number,
): string {
  const currentValue = content[String(p.idx)] || "(leer)";
  const pos = p.position;
  const id = makeElementId(slideId, p.idx);
  const label = formatElementLabel(slideOrdinal, p.type, p.idx);
  return [
    `  - id="${id}", label="${label}"`,
    `    type="${p.type}", idx=${p.idx}`,
    `    Position: left=${pos.x.toFixed(1)}%, top=${pos.y.toFixed(1)}%, Breite=${pos.w.toFixed(1)}%, Höhe=${pos.h.toFixed(1)}%`,
    `    Aktueller Inhalt: "${currentValue.length > 80 ? currentValue.slice(0, 80) + "…" : currentValue}"`,
  ].join("\n");
}

function buildCopilotPrompt({
  masterName,
  layoutName,
  layoutPlaceholders,
  relX,
  relY,
  nearest,
  comment,
  content,
  themeColors,
  slideId,
  slideOrdinal,
  slideSize,
  codeSlideId,
}: {
  masterName: string;
  layoutName: string;
  layoutPlaceholders: Placeholder[];
  relX: number;
  relY: number;
  nearest: Placeholder | null;
  comment: string;
  content: Record<string, string>;
  themeColors: Record<string, string>;
  slideId: string;
  slideOrdinal: number;
  slideSize?: SlideSize;
  codeSlideId?: string;
}): string {
  const renderSize = getRenderSlideSize(slideSize);
  const lines: string[] = [
    "Ich arbeite an der Datei src/components/DynamicSlide.tsx in einem React-Projekt (SlideForge).",
    "",
    "📖 **Lies zuerst `AGENTS.md` im Repo-Root** (Projekt-Konventionen, Theme-Kontrakt §3, CodeSlide-System, 4-Rollen-Team-Prozess). `CLAUDE.md` / `.github/copilot-instructions.md` sind Plattform-Zeiger darauf.",
    "",
    "## Eindeutige Element-IDs",
    "Jedes Element hat eine eindeutige `id` im Format `<slideId>::<idx>` und ein menschenlesbares",
    "`label` im Format `S<slideOrdinal>·<type>#<idx>`. Bitte bei Änderungen immer per `id` referenzieren,",
    "nicht nur per `idx` (idx ist nur innerhalb des Layouts eindeutig).",
    "",
    "## Slide-Kontext",
    `Folienmaster: "${masterName}"`,
    `Layout: "${layoutName}"`,
    `Slide-Id: "${slideId}"`,
    `Slide-Ordinal: ${slideOrdinal}`,
    `Slide-Größe: ${renderSize.width}×${renderSize.height}px (${formatSlideAspect(slideSize)})`,
    "",
    "## Theme-Farben",
    `  Hintergrund:   ${themeColors["--slide-bg"] ?? "?"}`,
    `  Primär:        ${themeColors["--slide-primary"] ?? "?"}`,
    `  Sekundär:      ${themeColors["--slide-secondary"] ?? "?"}`,
    `  Akzent:        ${themeColors["--slide-accent"] ?? "?"}`,
    `  Text:          ${themeColors["--slide-text"] ?? "?"}`,
    `  Text gedämpft: ${themeColors["--slide-text-muted"] ?? "?"}`,
    `  Font Heading:  ${themeColors["--slide-font-heading"] ?? "?"}`,
    `  Font Body:     ${themeColors["--slide-font-body"] ?? "?"}`,
    "",
    "## Theme-Kontrakt (Pflicht, aus AGENTS.md §3)",
    "Farben AUSSCHLIESSLICH via `var(--slide-*)` in Inline-Styles setzen — keine Tailwind-Farb-Klassen (kein `bg-amber-*`, `text-blue-*`, `border-red-*`).",
    "Tints: `color-mix(in srgb, var(--slide-accent) 20%, transparent)`.",
    "Größen: responsive `%` / Tailwind-Layout-Klassen, keine fixen Pixel.",
    "Kanonisches Beispiel: `src/slides/templates/24-PyramidHierarchy.tsx`.",
    "",
    "## Fit-Kontrakt (Pflicht, aus AGENTS.md §4)",
    "Die Slide muss in die reale PPTX-Placeholder-Geometrie passen, nicht nur in eine freie Preview.",
    "Dense-Handout-Modus: sichtbar mehr Inhalt ist erlaubt, aber nur wenn die Folie ohne Clipping in den gemappten Body-Placeholder passt.",
    "Keine zweite große Titelbühne im Body, wenn der Body dadurch vertikal überläuft.",
    "Screenshot-/Render-Review ist Teil der Freigabe, wenn ein echter Render verfügbar ist.",
    "",
  ];
  if (codeSlideId) {
    lines.push(`## Aktives CodeSlide-Template`);
    lines.push(`codeSlideId: "${codeSlideId}"`);
    lines.push(
      "→ Datei suchen unter `src/slides/templates/` (Dateiname enthält diese id kebab-case).",
    );
    lines.push(
      "→ Muss den Theme-Kontrakt oben einhalten. Falls aktuell hardcoded Tailwind-Farben: refactor auf `var(--slide-*)` wie in Slide 24.",
    );
    lines.push("");
  }
  lines.push("## Alle Placeholders in diesem Layout");

  for (const p of layoutPlaceholders) {
    lines.push(describePlaceholder(p, content, slideId, slideOrdinal));
  }

  lines.push("");
  lines.push("## Aktiver Layout-Budget-Hinweis");
  lines.push(
    "Bitte speziell auf den gemappten Body-Placeholder achten: Inhalt muss in dessen reale Höhe passen.",
  );
  lines.push(
    "Wenn die Folie als dichte Workshop-/Handout-Folie gelesen wird, Inhalt verdichten statt global herunterskalieren.",
  );
  lines.push("");
  lines.push("## Angeklickte Position");
  lines.push(`  x=${Math.round(relX * 100)}%, y=${Math.round(relY * 100)}%`);
  if (nearest) {
    lines.push("  Nächstliegendes Element:");
    lines.push(describePlaceholder(nearest, content, slideId, slideOrdinal));
  }
  lines.push("");

  lines.push("## Feedback");
  lines.push(`"${comment}"`);
  lines.push("");
  lines.push(
    "Bitte schlage eine konkrete Änderung an der DynamicSlide-Komponente vor.",
    "Referenziere Elemente ausschließlich per `id`.",
    "Zeige den geänderten Code-Abschnitt.",
  );
  return lines.join("\n").trim();
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  scale,
  layout,
  slideSize,
  activeMasterName,
  slideId,
  slideOrdinal,
  slideContent,
  themeColors,
}) => {
  const visible = useSlideStore((s) => s.annotationsVisible);
  const annotations = useSlideStore((s) => s.annotations);
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const codeSlideId = useSlideStore(
    (s) => s.slides[s.activeSlideIndex]?.codeSlideId,
  );
  const addAnnotation = useSlideStore((s) => s.addAnnotation);
  const removeAnnotation = useSlideStore((s) => s.removeAnnotation);
  const showToast = useSlideStore((s) => s.showToast);
  const selectedElementIds = useSlideStore((s) => s.selectedElementIds);
  const setSelectedElements = useSlideStore((s) => s.setSelectedElements);
  const addElementsToSelection = useSlideStore(
    (s) => s.addElementsToSelection,
  );
  const clearElementSelection = useSlideStore((s) => s.clearElementSelection);
  const contentIndex = useSlideStore(
    (s) => s.contentElementIndex[slideId],
  );

  const overlayRef = React.useRef<HTMLDivElement | null>(null);

  const [draftPin, setDraftPin] = React.useState<DraftPin | null>(null);
  const [draftArea, setDraftArea] = React.useState<DraftArea | null>(null);
  const [drawingArea, setDrawingArea] = React.useState(false);
  const [draftComment, setDraftComment] = React.useState("");
  const [justAddedId, setJustAddedId] = React.useState<string | null>(null);
  const renderSize = React.useMemo(
    () => getRenderSlideSize(slideSize),
    [slideSize],
  );

  const slidePins = annotations.filter(
    (a) => a.slideIndex === activeSlideIndex,
  );

  const toSlideCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    return {
      xNorm: Math.max(0, Math.min(1, x / renderSize.width)),
      yNorm: Math.max(0, Math.min(1, y / renderSize.height)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const { xNorm, yNorm } = toSlideCoords(e);
    setDrawingArea(true);
    setDraftArea({
      x1: xNorm,
      y1: yNorm,
      x2: xNorm,
      y2: yNorm,
      additive: e.shiftKey,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingArea || !draftArea) return;
    const { xNorm, yNorm } = toSlideCoords(e);
    setDraftArea((prev) => (prev ? { ...prev, x2: xNorm, y2: yNorm } : prev));
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingArea || !draftArea) return;
    const dx = Math.abs(draftArea.x2 - draftArea.x1);
    const dy = Math.abs(draftArea.y2 - draftArea.y1);
    const additive = draftArea.additive;
    setDrawingArea(false);

    if (dx < DRAG_THRESHOLD_NORM && dy < DRAG_THRESHOLD_NORM) {
      // Click (not drag): hit-test content element first, then placeholder,
      // else fall back to pin placement for empty-space clicks.
      const contentId = findContentElementIdAtPoint(
        e.clientX,
        e.clientY,
        overlayRef.current,
      );
      if (contentId) {
        if (additive) {
          if (selectedElementIds.includes(contentId)) {
            setSelectedElements(
              selectedElementIds.filter((x) => x !== contentId),
            );
          } else {
            addElementsToSelection([contentId]);
          }
        } else {
          const onlyThis =
            selectedElementIds.length === 1 &&
            selectedElementIds[0] === contentId;
          setSelectedElements(onlyThis ? [] : [contentId]);
        }
        setDraftArea(null);
        return;
      }
      const { xNorm, yNorm } = { xNorm: draftArea.x1, yNorm: draftArea.y1 };
      const hit = findPlaceholderAtPoint(layout, xNorm * 100, yNorm * 100);
      if (hit) {
        const id = makeElementId(slideId, hit.idx);
        if (additive) {
          if (selectedElementIds.includes(id)) {
            setSelectedElements(selectedElementIds.filter((x) => x !== id));
          } else {
            addElementsToSelection([id]);
          }
        } else {
          const onlyThis =
            selectedElementIds.length === 1 && selectedElementIds[0] === id;
          setSelectedElements(onlyThis ? [] : [id]);
        }
        setDraftArea(null);
        return;
      }
      // Empty-space click: pin fallback
      if (!additive) clearElementSelection();
      setDraftPin({ x: xNorm, y: yNorm });
      setDraftComment("");
      setDraftArea(null);
      return;
    }

    // Drag → marquee over both placeholders and content elements.
    const contentIds = findOverlappingContentElementIds(contentIndex, {
      x1: draftArea.x1,
      y1: draftArea.y1,
      x2: draftArea.x2,
      y2: draftArea.y2,
    });
    const placeholderIds = findOverlappingPlaceholders(layout, {
      x1: draftArea.x1 * 100,
      y1: draftArea.y1 * 100,
      x2: draftArea.x2 * 100,
      y2: draftArea.y2 * 100,
    }).map((p) => makeElementId(slideId, p.idx));
    // Prefer content-level IDs when available; include placeholders only for
    // placeholders that have no content children in the overlap set.
    const coveredPlaceholders = new Set(
      contentIds
        .map((id) => parseContentElementId(id)?.placeholderIdx)
        .filter((v): v is number => typeof v === "number"),
    );
    const filteredPlaceholderIds = placeholderIds.filter((id) => {
      const parsed = parseElementId(id);
      return parsed ? !coveredPlaceholders.has(parsed.idx) : true;
    });
    const ids = [...contentIds, ...filteredPlaceholderIds];
    if (additive) addElementsToSelection(ids);
    else setSelectedElements(ids);
    setDraftArea(null);
  };

  const selectedPlaceholders = React.useMemo<Placeholder[]>(() => {
    const byIdx = new Map(layout.placeholders.map((p) => [p.idx, p]));
    const out: Placeholder[] = [];
    for (const id of selectedElementIds) {
      const parsed = parseElementId(id);
      if (!parsed || parsed.slideId !== slideId) continue;
      const p = byIdx.get(parsed.idx);
      if (p) out.push(p);
    }
    return out;
  }, [selectedElementIds, slideId, layout.placeholders]);

  const submitDraft = async () => {
    const comment = draftComment.trim();
    if (!comment) {
      showToast("Kommentar darf nicht leer sein", "error");
      return;
    }

    const position = draftPin ?? { x: 0.5, y: 0.5 };
    const relX = position.x;
    const relY = position.y;
    const nearest = findNearestPlaceholder(layout, relX * 100, relY * 100);

    const prompt = buildCopilotPrompt({
      masterName: activeMasterName,
      layoutName: layout.name,
      layoutPlaceholders: layout.placeholders,
      relX,
      relY,
      nearest,
      comment,
      content: slideContent,
      themeColors,
      slideId,
      slideOrdinal,
      slideSize,
      codeSlideId,
    });

    try {
      await navigator.clipboard.writeText(prompt);
      showToast("✅ Prompt kopiert — in Copilot Chat einfügen (Strg+V)");
    } catch {
      showToast("⚠️ Clipboard nicht verfügbar", "error");
    }

    addAnnotation({
      slideIndex: activeSlideIndex,
      position,
      targetPlaceholderIdx: nearest?.idx,
      targetPlaceholderType: nearest?.type,
      comment,
    });

    const newId = Math.random().toString(36).slice(2, 10);
    setJustAddedId(newId);
    window.setTimeout(() => setJustAddedId(null), 1200);
    setDraftPin(null);
    setDraftArea(null);
    setDraftComment("");
  };

  const cancelDraft = () => {
    setDraftPin(null);
    setDraftArea(null);
    setDraftComment("");
    setDrawingArea(false);
  };

  if (!visible) return null;

  const renderPopover = (
    pinX: number,
    pinY: number,
    children: React.ReactNode,
  ) => {
    const flipLeft = pinX > 0.6;
    return (
      <div
        style={{
          position: "absolute",
          left: `${pinX * 100}%`,
          top: `${pinY * 100}%`,
          transform: flipLeft
            ? "translate(calc(-100% - 16px), -50%)"
            : "translate(16px, -50%)",
          zIndex: 20,
          width: 280,
          background: "#141414",
          border: "1px solid #2a2a2a",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          padding: 10,
          color: "#e8e8e8",
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    );
  };

  const commentForm = (
    <>
      <div
        style={{
          fontSize: 10,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#888",
          marginBottom: 6,
        }}
      >
        Kommentar für Copilot
      </div>
      <Textarea
        autoFocus
        rows={4}
        value={draftComment}
        onChange={(e) => setDraftComment(e.target.value)}
        placeholder="z.B. Titel sollte größer sein und links ausgerichtet..."
      />
      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        <Button variant="ghost" size="sm" onClick={cancelDraft}>
          ✕ Abbrechen
        </Button>
        <Button size="sm" onClick={submitDraft}>
          📋 An Copilot senden
        </Button>
      </div>
    </>
  );

  const areaRectStyle = (a: DraftArea): React.CSSProperties => {
    const left = Math.min(a.x1, a.x2) * 100;
    const top = Math.min(a.y1, a.y2) * 100;
    const width = Math.abs(a.x2 - a.x1) * 100;
    const height = Math.abs(a.y2 - a.y1) * 100;
    return {
      position: "absolute",
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
      border: "2px solid #3b82f6",
      background: "rgba(59,130,246,0.08)",
      borderRadius: 3,
      pointerEvents: "none",
      zIndex: 14,
    };
  };

  const selectedContentIds = selectedElementIds.filter(isContentElementId);

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{
        position: "absolute",
        inset: 0,
        width: renderSize.width,
        height: renderSize.height,
        cursor: "default",
        zIndex: 10,
      }}
    >
      {/* Selection highlight: blue outline + tint over each selected content element */}
      {selectedContentIds.map((id, i) => {
        const entry = contentIndex?.[id];
        if (!entry) return null;
        const { x, y, w, h } = entry.rect;
        return (
          <div
            key={id}
            style={{
              position: "absolute",
              left: `${x * 100}%`,
              top: `${y * 100}%`,
              width: `${w * 100}%`,
              height: `${h * 100}%`,
              border: "2.5px solid #3b82f6",
              borderRadius: 3,
              background: "rgba(59,130,246,0.12)",
              boxShadow: "0 0 0 3px rgba(59,130,246,0.28)",
              pointerEvents: "none",
              zIndex: 12,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -2,
                left: -2,
                transform: "translateY(-100%)",
                fontSize: 10,
                fontFamily: "monospace",
                padding: "2px 6px",
                background: "#3b82f6",
                color: "#fff",
                borderRadius: "3px 3px 3px 0",
                lineHeight: 1.2,
                fontWeight: 700,
                whiteSpace: "nowrap",
              }}
            >
              {i + 1} · {describeContentElement(entry.type, entry.textContent)}
            </span>
          </div>
        );
      })}

      {/* Selection highlight: placeholder rects (rare; when a whole placeholder is selected directly) */}
      {selectedPlaceholders.map((p) => (
        <div
          key={`ph-${p.idx}`}
          style={{
            position: "absolute",
            left: `${p.position.x}%`,
            top: `${p.position.y}%`,
            width: `${p.position.w}%`,
            height: `${p.position.h}%`,
            border: "2.5px dashed #3b82f6",
            borderRadius: 3,
            background: "rgba(59,130,246,0.06)",
            pointerEvents: "none",
            zIndex: 11,
          }}
        />
      ))}

      {/* Committed pins */}
      {slidePins.map((a) => (
        <React.Fragment key={a.id}>
          {a.area && <div style={areaRectStyle({
            x1: a.area.x1,
            y1: a.area.y1,
            x2: a.area.x2,
            y2: a.area.y2,
          })} />}
          <Tooltip content={a.comment} side="top">
            <div
              style={{
                position: "absolute",
                left: `calc(${a.position.x * 100}% - 6px)`,
                top: `calc(${a.position.y * 100}% - 6px)`,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "var(--app-pin)",
                border: "2px solid #fff",
                cursor: "pointer",
                animation:
                  justAddedId === a.id
                    ? "pin-pulse 1.2s ease-out"
                    : undefined,
                zIndex: 15,
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAnnotation(a.id);
                }}
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: "none",
                  background: "#1c1c1c",
                  color: "#e8e8e8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                }}
                aria-label="Pin löschen"
              >
                <X size={10} />
              </button>
            </div>
          </Tooltip>
        </React.Fragment>
      ))}

      {/* Draft: area rectangle being drawn (marquee) */}
      {draftArea && drawingArea && <div style={areaRectStyle(draftArea)} />}

      {/* Draft: pin */}
      {draftPin && (
        <>
          <div
            style={{
              position: "absolute",
              left: `calc(${draftPin.x * 100}% - 6px)`,
              top: `calc(${draftPin.y * 100}% - 6px)`,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "var(--app-pin)",
              border: "2px solid #fff",
              animation: "pin-pulse 1.2s ease-out infinite",
              zIndex: 15,
            }}
          />
          {renderPopover(draftPin.x, draftPin.y, commentForm)}
        </>
      )}
    </div>
  );
};
