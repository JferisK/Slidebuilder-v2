import * as React from "react";
import type {
  Placeholder,
  SlideLayout,
  SlideSize,
} from "@/parser/pptxParser";
import {
  useSlideStore,
  type ContentElementIndex,
} from "@/store/slideStore";
import {
  makeElementId,
  parseElementId,
} from "@/lib/elementId";
import {
  describeContentElement,
  isContentElementId,
  parseContentElementId,
} from "@/lib/contentElementId";
import { getRenderSlideSize } from "@/lib/slideSize";

const DRAG_THRESHOLD_NORM = 0.01;

interface AnnotationLayerProps {
  scale: number;
  layout: SlideLayout;
  slideSize?: SlideSize;
  slideId: string;
}

interface DraftArea {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Drag started with Shift modifier (additive select). */
  additive?: boolean;
}

/** Placeholder whose bounding box contains a given point (all in %). */
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

/** Content-element ids whose rects are fully enclosed by the area
 *  (PowerPoint marquee semantics — partial overlap is NOT enough). */
function findEnclosedContentElementIds(
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
    if (ex1 >= ax1 && ey1 >= ay1 && ex2 <= ax2 && ey2 <= ay2) out.push(id);
  }
  return out;
}

/** Placeholders whose bounding box is fully enclosed by the area
 *  (PowerPoint marquee semantics, %-coordinates). */
function findEnclosedPlaceholders(
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
    return px1 >= ax1 && py1 >= ay1 && px2 <= ax2 && py2 <= ay2;
  });
}

/** Use document.elementsFromPoint to find a content-element under the cursor,
 *  bypassing the selection overlay that sits on top of the slide. */
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

export const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  scale,
  layout,
  slideSize,
  slideId,
}) => {
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

  const [draftArea, setDraftArea] = React.useState<DraftArea | null>(null);
  const [drawingArea, setDrawingArea] = React.useState(false);
  const renderSize = React.useMemo(
    () => getRenderSlideSize(slideSize),
    [slideSize],
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
      // Click (not drag): hit-test content element first, then placeholder.
      // Empty-space clicks just clear the selection — no pin fallback.
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
      // Empty-space click: clear selection only.
      if (!additive) clearElementSelection();
      setDraftArea(null);
      return;
    }

    // Drag → marquee with PowerPoint-style full-containment semantics.
    const contentIds = findEnclosedContentElementIds(contentIndex, {
      x1: draftArea.x1,
      y1: draftArea.y1,
      x2: draftArea.x2,
      y2: draftArea.y2,
    });
    const placeholderIds = findEnclosedPlaceholders(layout, {
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

      {/* Selection highlight: placeholder rects when an entire placeholder is selected */}
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

      {/* Draft: area rectangle being drawn (marquee) */}
      {draftArea && drawingArea && <div style={areaRectStyle(draftArea)} />}
    </div>
  );
};
