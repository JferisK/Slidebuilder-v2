import * as React from "react";
import {
  useActiveLayout,
  useActiveMaster,
  useActiveSlide,
  useSlideStore,
} from "@/store/slideStore";
import { DynamicSlide } from "./DynamicSlide";
import { AnnotationLayer } from "./AnnotationLayer";
import { getCodeSlide } from "@/slides/registry";

const SLIDE_W = 1280;
const SLIDE_H = 720;

export const SlideCanvas: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const viewportRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);

  const activeSlide = useActiveSlide();
  const activeLayout = useActiveLayout();
  const activeMaster = useActiveMaster();
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const selectedElementIds = useSlideStore((s) => s.selectedElementIds);
  const canvasZoom = useSlideStore((s) => s.canvasZoom);
  const setCanvasZoom = useSlideStore((s) => s.setCanvasZoom);
  const resetZoom = useSlideStore((s) => s.resetZoom);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    observer.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const fitScale = width > 0 ? width / SLIDE_W : 1;
  const effectiveScale = fitScale * canvasZoom;
  const fitHeight = width > 0 ? fitScale * SLIDE_H : 0;
  const scaledW = effectiveScale * SLIDE_W;
  const scaledH = effectiveScale * SLIDE_H;

  const handleWheel = React.useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      e.preventDefault();
      const delta = -e.deltaY * 0.0015;
      setCanvasZoom(canvasZoom + delta);
    },
    [canvasZoom, setCanvasZoom],
  );

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "0") {
        e.preventDefault();
        resetZoom();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [resetZoom]);

  if (!activeSlide || !activeLayout || !activeMaster) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[var(--app-muted)]">
        Keine Folie ausgewählt
      </div>
    );
  }

  const codeSlide = getCodeSlide(activeSlide.codeSlideId);
  const mapping = activeSlide.codeSlotMapping;
  const codeSlotsByIdx = React.useMemo(() => {
    if (!codeSlide || !mapping) return undefined;
    const result: Record<string, React.FC> = {};
    for (const slot of codeSlide.slots) {
      const idx = mapping[slot.key];
      if (idx !== undefined) result[String(idx)] = slot.Component;
    }
    return result;
  }, [codeSlide, mapping]);

  const hiddenList = activeSlide.hiddenPlaceholderIdxs;
  const hiddenIdxSet = React.useMemo(() => {
    if (!hiddenList || hiddenList.length === 0) return undefined;
    return new Set(hiddenList);
  }, [hiddenList]);

  const slideId = activeSlide.id;
  const slideOrdinal = activeSlideIndex + 1;

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: fitHeight,
        position: "relative",
        maxWidth: "100%",
      }}
    >
      <div
        ref={viewportRef}
        onWheel={handleWheel}
        style={{
          position: "absolute",
          inset: 0,
          overflow: canvasZoom > 1 ? "auto" : "hidden",
        }}
      >
        <div
          id="slide-canvas-export"
          data-slide-index={activeSlideIndex}
          data-slide-id={slideId}
          data-code-slide-id={activeSlide.codeSlideId ?? ""}
          style={{
            width: scaledW || SLIDE_W,
            height: scaledH || SLIDE_H,
            position: "relative",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              width: SLIDE_W,
              height: SLIDE_H,
              transform: `scale(${effectiveScale})`,
              transformOrigin: "top left",
              position: "relative",
            }}
          >
            <DynamicSlide
              layout={activeLayout}
              theme={activeMaster.theme}
              content={activeSlide.content}
              showPlaceholderOutlines={true}
              slideId={slideId}
              slideOrdinal={slideOrdinal}
              selectedElementIds={selectedElementIds}
              codeSlots={codeSlotsByIdx}
              hiddenPlaceholderIdxs={hiddenIdxSet}
            />
            <AnnotationLayer
              scale={effectiveScale}
              layout={activeLayout}
              activeMasterName={activeMaster.name}
              slideId={slideId}
              slideOrdinal={slideOrdinal}
              slideContent={activeSlide.content}
              themeColors={
                activeMaster.theme.cssVars as unknown as Record<string, string>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};
