import * as React from "react";
import {
  useActiveLayout,
  useActiveMaster,
  useActiveSlide,
  useSlideStore,
} from "@/store/slideStore";
import { DynamicSlide } from "./DynamicSlide";
import { AnnotationLayer } from "./AnnotationLayer";

const SLIDE_W = 1280;
const SLIDE_H = 720;

export const SlideCanvas: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = React.useState(0);

  const activeSlide = useActiveSlide();
  const activeLayout = useActiveLayout();
  const activeMaster = useActiveMaster();
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const selectedPlaceholderIdx = useSlideStore(
    (s) => s.selectedPlaceholderIdx,
  );
  const setSelectedPlaceholder = useSlideStore(
    (s) => s.setSelectedPlaceholder,
  );

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

  const scale = width > 0 ? width / SLIDE_W : 1;
  const scaledHeight = width > 0 ? (width / SLIDE_W) * SLIDE_H : 0;

  if (!activeSlide || !activeLayout || !activeMaster) {
    return (
      <div className="flex h-full w-full items-center justify-center text-[var(--app-muted)]">
        Keine Folie ausgewählt
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: scaledHeight,
        position: "relative",
        maxWidth: "100%",
      }}
    >
      <div
        id="slide-canvas-export"
        data-slide-index={activeSlideIndex}
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          position: "relative",
        }}
      >
        <DynamicSlide
          layout={activeLayout}
          theme={activeMaster.theme}
          content={activeSlide.content}
          showPlaceholderOutlines={true}
          selectedPlaceholderIdx={selectedPlaceholderIdx}
          onPlaceholderClick={(ph) => {
            setSelectedPlaceholder(
              selectedPlaceholderIdx === ph.idx ? null : ph.idx,
            );
          }}
        />
        <AnnotationLayer
          scale={scale}
          layout={activeLayout}
          activeMasterName={activeMaster.name}
        />
      </div>
    </div>
  );
};
