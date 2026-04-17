import * as React from "react";
import { Crosshair, MousePointerSquareDashed, X } from "lucide-react";
import type { Placeholder, SlideLayout } from "@/parser/pptxParser";
import { useSlideStore, type AreaRect } from "@/store/slideStore";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tooltip } from "./ui/tooltip";

const SLIDE_W = 1280;
const SLIDE_H = 720;

interface AnnotationLayerProps {
  scale: number;
  layout: SlideLayout;
  activeMasterName: string;
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

function describePlaceholder(p: Placeholder, content: Record<string, string>): string {
  const currentValue = content[String(p.idx)] || "(leer)";
  const pos = p.position;
  return [
    `  - type="${p.type}", idx=${p.idx}`,
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
  selectedPlaceholder,
  content,
  themeColors,
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
  selectedPlaceholder?: { idx: number; type: string } | null;
  content: Record<string, string>;
  themeColors: Record<string, string>;
}): string {
  const lines: string[] = [
    "Ich arbeite an der Datei src/components/DynamicSlide.tsx in einem React-Projekt (SlideForge).",
    "",
    "## Slide-Kontext",
    `Folienmaster: "${masterName}"`,
    `Layout: "${layoutName}"`,
    `Slide-Größe: 1280×720px (16:9)`,
    "",
    "## Theme-Farben",
    `  Hintergrund:  ${themeColors["--slide-bg"] ?? "?"}`,
    `  Primär:       ${themeColors["--slide-primary"] ?? "?"}`,
    `  Sekundär:     ${themeColors["--slide-secondary"] ?? "?"}`,
    `  Akzent:       ${themeColors["--slide-accent"] ?? "?"}`,
    `  Text:         ${themeColors["--slide-text"] ?? "?"}`,
    `  Text gedämpft: ${themeColors["--slide-text-muted"] ?? "?"}`,
    `  Font Heading: ${themeColors["--slide-font-heading"] ?? "?"}`,
    `  Font Body:    ${themeColors["--slide-font-body"] ?? "?"}`,
    "",
    "## Alle Placeholders in diesem Layout",
  ];

  for (const p of layoutPlaceholders) {
    lines.push(describePlaceholder(p, content));
  }

  lines.push("");

  // Specific target info
  if (selectedPlaceholder) {
    const sp = layoutPlaceholders.find(
      (p) => p.idx === selectedPlaceholder.idx,
    );
    lines.push("## Ziel-Element (vom User ausgewählt)");
    if (sp) {
      lines.push(describePlaceholder(sp, content));
    } else {
      lines.push(
        `  type="${selectedPlaceholder.type}", idx=${selectedPlaceholder.idx}`,
      );
    }
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
      lines.push("  Enthaltene Placeholders:");
      for (const p of overlapping) {
        lines.push(describePlaceholder(p, content));
      }
    }
    lines.push("");
  } else if (!selectedPlaceholder) {
    lines.push("## Angeklickte Position");
    lines.push(
      `  x=${Math.round(relX * 100)}%, y=${Math.round(relY * 100)}%`,
    );
    if (nearest) {
      lines.push("  Nächstliegender Placeholder:");
      lines.push(describePlaceholder(nearest, content));
    }
    lines.push("");
  }

  lines.push("## Feedback");
  lines.push(`"${comment}"`);
  lines.push("");
  lines.push(
    "Bitte schlage eine konkrete Änderung an der DynamicSlide-Komponente vor.",
    "Referenziere Placeholders per type und idx.",
    "Zeige den geänderten Code-Abschnitt.",
  );
  return lines.join("\n").trim();
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  scale,
  layout,
  activeMasterName,
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
  const selectedPlaceholderIdx = useSlideStore(
    (s) => s.selectedPlaceholderIdx,
  );

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
    if (selectionMode === "area") {
      const { xNorm, yNorm } = toSlideCoords(e);
      setDrawingArea(true);
      setDraftArea({ x1: xNorm, y1: yNorm, x2: xNorm, y2: yNorm });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drawingArea || !draftArea) return;
    const { xNorm, yNorm } = toSlideCoords(e);
    setDraftArea((prev) => (prev ? { ...prev, x2: xNorm, y2: yNorm } : prev));
  };

  const handleMouseUp = () => {
    if (drawingArea && draftArea) {
      const dx = Math.abs(draftArea.x2 - draftArea.x1);
      const dy = Math.abs(draftArea.y2 - draftArea.y1);
      if (dx > 0.01 && dy > 0.01) {
        // Valid area, show comment popover
        setDrawingArea(false);
        setDraftComment("");
      } else {
        // Too small → treat as click and cancel
        setDraftArea(null);
        setDrawingArea(false);
      }
    }
  };

  const handleLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (selectionMode === "area") return; // handled by mousedown/up
    const { xNorm, yNorm } = toSlideCoords(e);
    setDraftPin({ x: xNorm, y: yNorm });
    setDraftComment("");
  };

  const selectedPh = selectedPlaceholderIdx !== null
    ? layout.placeholders.find((p) => p.idx === selectedPlaceholderIdx)
    : null;

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
      selectedPlaceholder: selectedPh
        ? { idx: selectedPh.idx, type: selectedPh.type }
        : null,
      content: slideContent,
      themeColors,
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
      area,
      targetPlaceholderIdx: selectedPh?.idx ?? nearest?.idx,
      targetPlaceholderType: selectedPh?.type ?? nearest?.type,
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

  // Popover renderer (reused for pin / area)
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
      {selectedPh && (
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
          Placeholder: {selectedPh.type}:{selectedPh.idx}
        </div>
      )}
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

  // Area selection rect (while drawing or after drawn)
  const areaRectStyle = (
    a: DraftArea,
  ): React.CSSProperties => {
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
      border: "2px dashed #3b82f6",
      background: "rgba(59,130,246,0.08)",
      borderRadius: 3,
      pointerEvents: "none",
      zIndex: 14,
    };
  };

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
        cursor: selectionMode === "area" ? "crosshair" : "crosshair",
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
        <Tooltip content="Pin-Modus" side="bottom">
          <button
            type="button"
            onClick={() => setSelectionMode("pin")}
            style={{
              width: 26,
              height: 26,
              border: "none",
              borderRadius: 4,
              background:
                selectionMode === "pin"
                  ? "rgba(59,130,246,0.25)"
                  : "transparent",
              color:
                selectionMode === "pin" ? "#3b82f6" : "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <Crosshair size={14} />
          </button>
        </Tooltip>
        <Tooltip content="Bereich markieren" side="bottom">
          <button
            type="button"
            onClick={() => setSelectionMode("area")}
            style={{
              width: 26,
              height: 26,
              border: "none",
              borderRadius: 4,
              background:
                selectionMode === "area"
                  ? "rgba(59,130,246,0.25)"
                  : "transparent",
              color:
                selectionMode === "area" ? "#3b82f6" : "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <MousePointerSquareDashed size={14} />
          </button>
        </Tooltip>
      </div>

      {/* Committed pins */}
      {slidePins.map((a) => (
        <React.Fragment key={a.id}>
          {/* If annotation has an area, show it */}
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

      {/* Draft: completed area → show comment popover */}
      {draftArea && !drawingArea && (
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
