import * as React from "react";
import { Copy, Plus, Trash2, Code2 } from "lucide-react";
import { useSlideStore } from "@/store/slideStore";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { getCodeSlide } from "@/slides/registry";

export const SlideList: React.FC = () => {
  const slides = useSlideStore((s) => s.slides);
  const presentation = useSlideStore((s) => s.presentation);
  const activeIndex = useSlideStore((s) => s.activeSlideIndex);
  const setActiveSlide = useSlideStore((s) => s.setActiveSlide);
  const addSlide = useSlideStore((s) => s.addSlide);
  const duplicateSlide = useSlideStore((s) => s.duplicateSlide);
  const removeSlide = useSlideStore((s) => s.removeSlide);

  const layoutNameFor = React.useCallback(
    (masterId: string, layoutId: string): string => {
      const master = presentation?.masters.find((m) => m.id === masterId);
      const layout = master?.layouts.find((l) => l.id === layoutId);
      return layout?.name ?? "–";
    },
    [presentation],
  );

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => addSlide()}
        className="w-full"
      >
        <Plus size={12} /> Neue Folie
      </Button>

      <ScrollArea className="max-h-64 pr-1">
        <div className="flex flex-col gap-1">
          {slides.map((slide, i) => {
            const isActive = i === activeIndex;
            return (
              <div
                key={slide.id}
                onClick={() => setActiveSlide(i)}
                className={`group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "bg-[rgba(59,130,246,0.15)] border border-[var(--app-accent)]"
                    : "border border-transparent hover:bg-[var(--app-surface)]"
                }`}
              >
                <div className="flex min-w-0 flex-col">
                  <span
                    className={`flex items-center gap-1 ${
                      isActive
                        ? "font-medium text-[var(--app-accent)]"
                        : "text-[var(--app-text)]"
                    }`}
                  >
                    {slide.codeSlideId && (
                      <Code2
                        size={10}
                        className="flex-none text-[var(--app-accent)]"
                      />
                    )}
                    Folie {i + 1}
                  </span>
                  <span className="truncate text-[10px] text-[var(--app-muted)]">
                    {slide.codeSlideId
                      ? (getCodeSlide(slide.codeSlideId)?.name ?? "Code-Folie")
                      : layoutNameFor(slide.masterId, slide.layoutId)}
                  </span>
                </div>
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    title="Duplizieren"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSlide(i);
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded text-[var(--app-muted)] hover:bg-[var(--app-surface)] hover:text-[var(--app-text)]"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    type="button"
                    title="Löschen"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSlide(i);
                    }}
                    disabled={slides.length <= 1}
                    className="flex h-6 w-6 items-center justify-center rounded text-[var(--app-muted)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--app-destructive)] disabled:opacity-40"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
