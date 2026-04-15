import * as React from "react";
import { X } from "lucide-react";
import type { Placeholder, SlideLayout } from "@/parser/pptxParser";
import { useSlideStore } from "@/store/slideStore";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Tooltip } from "./ui/tooltip";

const SLIDE_W = 1280;
const SLIDE_H = 720;

interface AnnotationLayerProps {
  scale: number;
  layout: SlideLayout;
  activeMasterName: string;
}

interface DraftPin {
  x: number; // 0-1
  y: number; // 0-1
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

function buildCopilotPrompt({
  masterName,
  layoutName,
  relX,
  relY,
  nearest,
  comment,
}: {
  masterName: string;
  layoutName: string;
  relX: number;
  relY: number;
  nearest: Placeholder | null;
  comment: string;
}): string {
  const nearestDesc = nearest
    ? `"${nearest.type}" (idx: ${nearest.idx})`
    : "keiner";
  return `
Ich arbeite an der Datei src/components/DynamicSlide.tsx in einem React-Projekt.

Kontext:
- Aktiver Folienmaster: "${masterName}"
- Aktives Layout: "${layoutName}"
- Angeklickte Position: x=${Math.round(relX * 100)}%, y=${Math.round(relY * 100)}%
- Nächstliegender Placeholder: ${nearestDesc}

Feedback des Nutzers:
"${comment}"

Bitte analysiere die Komponente und schlage eine konkrete Änderung vor.
Zeige den geänderten Code-Abschnitt.
  `.trim();
}

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  scale,
  layout,
  activeMasterName,
}) => {
  const visible = useSlideStore((s) => s.annotationsVisible);
  const annotations = useSlideStore((s) => s.annotations);
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const addAnnotation = useSlideStore((s) => s.addAnnotation);
  const removeAnnotation = useSlideStore((s) => s.removeAnnotation);
  const showToast = useSlideStore((s) => s.showToast);

  const [draft, setDraft] = React.useState<DraftPin | null>(null);
  const [draftComment, setDraftComment] = React.useState("");
  const [justAddedId, setJustAddedId] = React.useState<string | null>(null);

  const slidePins = annotations.filter(
    (a) => a.slideIndex === activeSlideIndex,
  );

  const handleLayerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const rect = e.currentTarget.getBoundingClientRect();
    // Divide by scale to map from displayed pixels to unscaled 1280×720 space.
    const unscaledX = (e.clientX - rect.left) / scale;
    const unscaledY = (e.clientY - rect.top) / scale;
    const xNorm = Math.max(0, Math.min(1, unscaledX / SLIDE_W));
    const yNorm = Math.max(0, Math.min(1, unscaledY / SLIDE_H));
    setDraft({ x: xNorm, y: yNorm });
    setDraftComment("");
  };

  const submitDraft = async () => {
    if (!draft) return;
    const comment = draftComment.trim();
    if (!comment) {
      showToast("Kommentar darf nicht leer sein", "error");
      return;
    }
    const relX = draft.x;
    const relY = draft.y;
    const xPercent = relX * 100;
    const yPercent = relY * 100;
    const nearest = findNearestPlaceholder(layout, xPercent, yPercent);
    const prompt = buildCopilotPrompt({
      masterName: activeMasterName,
      layoutName: layout.name,
      relX,
      relY,
      nearest,
      comment,
    });

    try {
      await navigator.clipboard.writeText(prompt);
      showToast("✅ Prompt kopiert — in Copilot Chat einfügen (Strg+V)");
    } catch (err) {
      console.warn("Clipboard write failed:", err);
      showToast("⚠️ Clipboard nicht verfügbar", "error");
    }

    const newId = Math.random().toString(36).slice(2, 10);
    addAnnotation({
      slideIndex: activeSlideIndex,
      position: { x: relX, y: relY },
      comment,
    });
    setJustAddedId(newId);
    window.setTimeout(() => setJustAddedId(null), 1200);
    setDraft(null);
    setDraftComment("");
  };

  const cancelDraft = () => {
    setDraft(null);
    setDraftComment("");
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
          width: 260,
          background: "#141414",
          border: "1px solid #2a2a2a",
          borderRadius: 8,
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
          padding: 10,
          color: "#e8e8e8",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    );
  };

  return (
    <div
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
      {slidePins.map((a) => (
        <Tooltip key={a.id} content={a.comment} side="top">
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
            onClick={(e) => {
              e.stopPropagation();
            }}
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
      ))}

      {draft && (
        <>
          <div
            style={{
              position: "absolute",
              left: `calc(${draft.x * 100}% - 6px)`,
              top: `calc(${draft.y * 100}% - 6px)`,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: "var(--app-pin)",
              border: "2px solid #fff",
              animation: "pin-pulse 1.2s ease-out infinite",
              zIndex: 15,
            }}
          />
          {renderPopover(
            draft.x,
            draft.y,
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
            </>,
          )}
        </>
      )}
    </div>
  );
};
