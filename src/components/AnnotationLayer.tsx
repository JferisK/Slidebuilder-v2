import * as React from "react";
import {
  BoxSelect,
  Crosshair,
  MousePointerSquareDashed,
  X,
} from "lucide-react";
import type { Placeholder, SlideLayout } from "@/parser/pptxParser";
import { useSlideStore, type AreaRect } from "@/store/slideStore";
import {
  formatElementLabel,
  makeElementId,
  parseElementId,
} from "@/lib/elementId";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tooltip } from "./ui/tooltip";

const SLIDE_W = 1280;
const SLIDE_H = 720;

interface AnnotationLayerProps {
  scale: number;
  layout: SlideLayout;
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
  // Iterate in reverse so later (top-most) placeholders win if overlapping.
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
  area,
  overlapping,
  selectedPlaceholders,
  content,
  themeColors,
  slideId,
  slideOrdinal,
}: {
  masterName: string;
  layoutName: string;
  layoutPlaceholders: Placeholder[];
  relX: number;
  relY: number;
  nearest: Placeholder | null;
  comment: string;
  area?: AreaRect;
  overlapping?: Placeholder[];
  selectedPlaceholders: Placeholder[];
  content: Record<string, string>;
  themeColors: Record<string, string>;
  slideId: string;
  slideOrdinal: number;
}): string {
  const lines: string[] = [
    "Ich arbeite an der Datei src/components/DynamicSlide.tsx in einem React-Projekt (SlideForge).",
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
    `Slide-Größe: 1280×720px (16:9)`,
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
    "## Alle Placeholders in diesem Layout",
  ];

  for (const p of layoutPlaceholders) {
    lines.push(describePlaceholder(p, content, slideId, slideOrdinal));
  }

  lines.push("");

  if (selectedPlaceholders.length > 0) {
    lines.push("## Ziel-Elemente (vom User ausgewählt)");
    lines.push(
      "Der User hat folgende Elemente markiert. Bitte ausschließlich diese ändern und per `id` referenzieren:",
    );
    selectedPlaceholders.forEach((p, i) => {
      lines.push(`  ${i + 1}. ${describePlaceholder(p, content, slideId, slideOrdinal).trimStart()}`);
    });
    lines.push("");
  }

  if (area) {
    const x1 = Math.round(Math.min(area.x1, area.x2) * 100);
    const y1 = Math.round(Math.min(area.y1, area.y2) * 100);
    const x2 = Math.round(Math.max(area.x1, area.x2) * 100);
    const y2 = Math.round(Math.max(area.y1, area.y2) * 100);
    lines.push("## Markierter Bereich");
    lines.push(`  Von (${x1}%, ${y1}%) bis (${x2}%, ${y2}%)`);
    if (overlapping && overlapping.length > 0) {
      lines.push("  Enthaltene Elemente:");
      for (const p of overlapping) {
        lines.push(describePlaceholder(p, content, slideId, slideOrdinal));
      }
    }
    lines.push("");
  } else if (selectedPlaceholders.length === 0) {
    lines.push("## Angeklickte Position");
    lines.push(`  x=${Math.round(relX * 100)}%, y=${Math.round(relY * 100)}%`);
    if (nearest) {
      lines.push("  Nächstliegendes Element:");
      lines.push(describePlaceholder(nearest, content, slideId, slideOrdinal));
    }
    lines.push("");
  }

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
  activeMasterName,
  slideId,
  slideOrdinal,
  slideContent,
  themeColors,
}) => {
  const visible = useSlideStore((s) => s.annotationsVisible);
  const annotations = useSlideStore((s) => s.annotations);
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const addAnnotation = useSlideStore((s) => s.addAnnotation);
  const removeAnnotation = useSlideStore((s) => s.removeAnnotation);
  const showToast = useSlideStore((s) => s.showToast);
  const selectionMode = useSlideStore((s) => s.selectionMode);
  const setSelectionMode = useSlideStore((s) => s.setSelectionMode);
  const selectedElementIds = useSlideStore((s) => s.selectedElementIds);
  const setSelectedElements = useSlideStore((s) => s.setSelectedElements);
  const addElementsToSelection = useSlideStore(
    (s) => s.addElementsToSelection,
  );
  const clearElementSelection = useSlideStore((s) => s.clearElementSelection);

  const [draftPin, setDraftPin] = React.useState<DraftPin | null>(null);
  const [draftArea, setDraftArea] = React.useState<DraftArea | null>(null);
  const [drawingArea, setDrawingArea] = React.useState(false);
  const [draftComment, setDraftComment] = React.useState("");
  const [justAddedId, setJustAddedId] = React.useState<string | null>(null);

  const slidePins = annotations.filter(
    (a) => a.slideIndex === activeSlideIndex,
  );

  const toSlideCoords = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    return {
      xNorm: Math.max(0, Math.min(1, x / SLIDE_W)),
      yNorm: Math.max(0, Math.min(1, y / SLIDE_H)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (selectionMode === "area" || selectionMode === "select") {
      const { xNorm, yNorm } = toSlideCoords(e);
      setDrawingArea(true);
      setDraftArea({
        x1: xNorm,
        y1: yNorm,
        x2: xNorm,
        y2: yNorm,
        additive: e.shiftKey,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingArea || !draftArea) return;
    const { xNorm, yNorm } = toSlideCoords(e);
    setDraftArea((prev) => (prev ? { ...prev, x2: xNorm, y2: yNorm } : prev));
  };

  const handleMouseUp = () => {
    if (!drawingArea || !draftArea) return;
    const dx = Math.abs(draftArea.x2 - draftArea.x1);
    const dy = Math.abs(draftArea.y2 - draftArea.y1);

    if (selectionMode === "select") {
      setDrawingArea(false);
      if (dx < 0.01 && dy < 0.01) {
        // Treat as empty click → clear selection
        if (!draftArea.additive) clearElementSelection();
        setDraftArea(null);
        return;
      }
      const overlap = findOverlappingPlaceholders(layout, {
        x1: draftArea.x1 * 100,
        y1: draftArea.y1 * 100,
        x2: draftArea.x2 * 100,
        y2: draftArea.y2 * 100,
      });
      const ids = overlap.map((p) => makeElementId(slideId, p.idx));
      if (draftArea.additive) addElementsToSelection(ids);
      else setSelectedElements(ids);
      setDraftArea(null);
      return;
    }

    // area mode (comment on region)
    if (dx > 0.01 && dy > 0.01) {
      setDrawingArea(false);
      setDraftComment("");
    } else {
      setDraftArea(null);
      setDrawingArea(false);
    }
  };

  const handleLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (selectionMode === "area") return; // handled by mousedown/up (area draft)

    const { xNorm, yNorm } = toSlideCoords(e);
    const xP = xNorm * 100;
    const yP = yNorm * 100;

    if (selectionMode === "select") {
      const hit = findPlaceholderAtPoint(layout, xP, yP);
      const additive = e.shiftKey || e.metaKey || e.ctrlKey;
      if (!hit) {
        if (!additive) clearElementSelection();
        return;
      }
      const id = makeElementId(slideId, hit.idx);
      if (additive) {
        // Toggle behaviour for modifier+click
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
      return;
    }

    // Pin mode: support modifier-click for element selection as well.
    if (e.shiftKey || e.metaKey || e.ctrlKey) {
      const hit = findPlaceholderAtPoint(layout, xP, yP);
      if (hit) {
        const id = makeElementId(slideId, hit.idx);
        if (selectedElementIds.includes(id)) {
          setSelectedElements(selectedElementIds.filter((x) => x !== id));
        } else {
          addElementsToSelection([id]);
        }
        return;
      }
    }

    setDraftPin({ x: xNorm, y: yNorm });
    setDraftComment("");
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

  const selectionLabels = selectedPlaceholders.map((p) =>
    formatElementLabel(slideOrdinal, p.type, p.idx),
  );

  const submitDraft = async () => {
    const comment = draftComment.trim();
    if (!comment) {
      showToast("Kommentar darf nicht leer sein", "error");
      return;
    }

    const isArea = !!draftArea && !drawingArea;
    const position = isArea
      ? {
          x: (draftArea!.x1 + draftArea!.x2) / 2,
          y: (draftArea!.y1 + draftArea!.y2) / 2,
        }
      : draftPin ?? { x: 0.5, y: 0.5 };

    const relX = position.x;
    const relY = position.y;
    const xPercent = relX * 100;
    const yPercent = relY * 100;
    const nearest = findNearestPlaceholder(layout, xPercent, yPercent);

    let overlapping: Placeholder[] | undefined;
    let area: AreaRect | undefined;
    if (isArea) {
      area = {
        x1: draftArea!.x1,
        y1: draftArea!.y1,
        x2: draftArea!.x2,
        y2: draftArea!.y2,
      };
      overlapping = findOverlappingPlaceholders(layout, {
        x1: area.x1 * 100,
        y1: area.y1 * 100,
        x2: area.x2 * 100,
        y2: area.y2 * 100,
      });
    }

    const prompt = buildCopilotPrompt({
      masterName: activeMasterName,
      layoutName: layout.name,
      layoutPlaceholders: layout.placeholders,
      relX,
      relY,
      nearest,
      comment,
      area,
      overlapping,
      selectedPlaceholders,
      content: slideContent,
      themeColors,
      slideId,
      slideOrdinal,
    });

    try {
      await navigator.clipboard.writeText(prompt);
      showToast("✅ Prompt kopiert — in Copilot Chat einfügen (Strg+V)");
    } catch {
      showToast("⚠️ Clipboard nicht verfügbar", "error");
    }

    const firstSelected = selectedPlaceholders[0];
    addAnnotation({
      slideIndex: activeSlideIndex,
      position,
      area,
      targetPlaceholderIdx:
        selectedPlaceholders.length === 1
          ? firstSelected?.idx
          : nearest?.idx,
      targetPlaceholderType:
        selectedPlaceholders.length === 1
          ? firstSelected?.type
          : nearest?.type,
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

  const selectionHint = () => {
    if (selectionLabels.length === 0) return null;
    if (selectionLabels.length === 1) {
      return (
        <div
          style={{
            fontSize: 10,
            color: "#3b82f6",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Crosshair size={10} />
          Element: {selectionLabels[0]}
        </div>
      );
    }
    const shown = selectionLabels.slice(0, 2).join(", ");
    const rest =
      selectionLabels.length > 2
        ? `, +${selectionLabels.length - 2} mehr`
        : "";
    return (
      <Tooltip content={selectionLabels.join(", ")} side="top">
        <div
          style={{
            fontSize: 10,
            color: "#3b82f6",
            marginBottom: 4,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Crosshair size={10} />
          {selectionLabels.length} Elemente: {shown}
          {rest}
        </div>
      </Tooltip>
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
      {selectionHint()}
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
    const isSelect = selectionMode === "select";
    return {
      position: "absolute",
      left: `${left}%`,
      top: `${top}%`,
      width: `${width}%`,
      height: `${height}%`,
      border: isSelect ? "2px solid #3b82f6" : "2px dashed #3b82f6",
      background: "rgba(59,130,246,0.08)",
      borderRadius: 3,
      pointerEvents: "none",
      zIndex: 14,
    };
  };

  const modeButton = (
    mode: "pin" | "area" | "select",
    label: string,
    icon: React.ReactNode,
  ) => (
    <Tooltip content={label} side="bottom">
      <button
        type="button"
        onClick={() => setSelectionMode(mode)}
        style={{
          width: 26,
          height: 26,
          border: "none",
          borderRadius: 4,
          background:
            selectionMode === mode
              ? "rgba(59,130,246,0.25)"
              : "transparent",
          color: selectionMode === mode ? "#3b82f6" : "#888",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        aria-label={label}
      >
        {icon}
      </button>
    </Tooltip>
  );

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleLayerClick}
      style={{
        position: "absolute",
        inset: 0,
        width: SLIDE_W,
        height: SLIDE_H,
        cursor: "crosshair",
        zIndex: 10,
      }}
    >
      {/* Mode switcher (top right corner) */}
      <div
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          zIndex: 22,
          display: "flex",
          gap: 2,
          background: "rgba(20,20,20,0.85)",
          border: "1px solid #2a2a2a",
          borderRadius: 6,
          padding: 2,
        }}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {modeButton("pin", "Pin-Modus", <Crosshair size={14} />)}
        {modeButton(
          "area",
          "Bereich kommentieren",
          <MousePointerSquareDashed size={14} />,
        )}
        {modeButton(
          "select",
          "Elemente auswählen (Marquee)",
          <BoxSelect size={14} />,
        )}
      </div>

      {/* Selection summary chip */}
      {selectionLabels.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            zIndex: 22,
            background: "rgba(20,20,20,0.92)",
            border: "1px solid #3b82f6",
            borderRadius: 6,
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#e8e8e8",
            fontSize: 11,
            fontFamily: "monospace",
            maxWidth: "70%",
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <span style={{ color: "#3b82f6", fontWeight: 700 }}>
            {selectionLabels.length} ausgewählt:
          </span>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={selectionLabels.join(", ")}
          >
            {selectionLabels.join(", ")}
          </span>
          <button
            type="button"
            onClick={() => clearElementSelection()}
            style={{
              border: "none",
              background: "transparent",
              color: "#aaa",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Auswahl leeren"
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Committed pins */}
      {slidePins.map((a) => (
        <React.Fragment key={a.id}>
          {a.area && <div style={areaRectStyle(a.area)} />}
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

      {/* Draft: area rectangle being drawn */}
      {draftArea && drawingArea && <div style={areaRectStyle(draftArea)} />}

      {/* Draft: completed area → only area mode pops the comment form */}
      {draftArea && !drawingArea && selectionMode === "area" && (
        <>
          <div style={areaRectStyle(draftArea)} />
          {renderPopover(
            (draftArea.x1 + draftArea.x2) / 2,
            (draftArea.y1 + draftArea.y2) / 2,
            commentForm,
          )}
        </>
      )}

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
