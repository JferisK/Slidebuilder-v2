import * as React from "react";
import { MessageSquare, Send, Sliders, Type } from "lucide-react";
import {
  useActiveLayout,
  useActiveSlide,
  useSlideStore,
} from "@/store/slideStore";
import {
  isContentElementId,
  parseContentElementId,
} from "@/lib/contentElementId";
import { parseElementId } from "@/lib/elementId";
import { ElementStylePanel } from "./ElementStylePanel";
import { buildBatchPrompt } from "./CopilotBatchPanel";

interface ElementRect {
  /** Normalized [0,1] left relative to the slide root. */
  x: number;
  y: number;
  w: number;
  h: number;
}

interface SelectionFloatingToolbarProps {
  /** Scale at which the slide root is rendered (effectiveScale from SlideCanvas). */
  scale: number;
  /** Width of the slide canvas in slide-local pixels (e.g. 1280). */
  slideWidth: number;
  /** Height of the slide canvas in slide-local pixels (e.g. 720). */
  slideHeight: number;
}

export const SelectionFloatingToolbar: React.FC<
  SelectionFloatingToolbarProps
> = ({ scale, slideWidth, slideHeight }) => {
  const selectedElementIds = useSlideStore((s) => s.selectedElementIds);
  const activeSlide = useActiveSlide();
  const activeLayout = useActiveLayout();
  const contentIndex = useSlideStore(
    (s) => s.contentElementIndex[activeSlide?.id ?? ""],
  );
  const elementStyleOverrides = useSlideStore(
    (s) => s.elementStyleOverrides,
  );
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const openCopilotDrawer = useSlideStore((s) => s.openCopilotDrawer);
  const updateSlideContent = useSlideStore((s) => s.updateSlideContent);
  const setAnnotationsVisible = useSlideStore((s) => s.setAnnotationsVisible);
  const annotationsVisible = useSlideStore((s) => s.annotationsVisible);

  const [adjustOpen, setAdjustOpen] = React.useState(false);

  // Close popover when selection clears.
  React.useEffect(() => {
    if (selectedElementIds.length === 0) setAdjustOpen(false);
  }, [selectedElementIds.length]);

  if (
    selectedElementIds.length === 0 ||
    !activeSlide ||
    !activeLayout ||
    scale <= 0
  ) {
    return null;
  }

  // Anchor to the first selected element. Multi-select shows the toolbar over
  // the union bbox top.
  const rect = computeSelectionRect(
    selectedElementIds,
    contentIndex,
    activeLayout,
  );
  if (!rect) return null;

  const flipBelow = rect.y < 0.08;
  // Pixel-space position (slide-local units). The parent slide root is sized at
  // (slideWidth, slideHeight) and scaled via transform: scale(scale).
  const leftPx = rect.x * slideWidth;
  const topPx = flipBelow
    ? (rect.y + rect.h) * slideHeight + 8
    : rect.y * slideHeight - 36;

  const handleText = () => {
    if (selectedElementIds.length !== 1) return;
    const id = selectedElementIds[0];
    if (isContentElementId(id)) {
      const node = document.querySelector<HTMLElement>(
        `[data-content-id="${cssEscape(id)}"]`,
      );
      if (!node) return;
      makeNodeEditable(node);
    } else {
      const ph = parseElementId(id);
      if (!ph) return;
      const node = document.querySelector<HTMLElement>(
        `[data-element-id="${cssEscape(id)}"]`,
      );
      if (!node) return;
      const target =
        node.querySelector<HTMLElement>("p, h1, h2, h3, h4, h5, h6, span") ??
        node;
      makeNodeEditable(target, (newText) => {
        updateSlideContent(activeSlideIndex, String(ph.idx), newText);
      });
    }
  };

  const handleComment = () => {
    if (!annotationsVisible) setAnnotationsVisible(true);
    // The AnnotationLayer already wires up clicks on empty canvas to create
    // pins. We just surface a small hint here by relying on existing behaviour:
    // the user can click an empty area near the element to drop a pin.
    // No-op for now beyond ensuring the layer is visible.
  };

  const handleSend = () => {
    const prompt = buildBatchPrompt({
      slideId: activeSlide.id,
      slideOrdinal: activeSlideIndex + 1,
      layoutName: activeLayout.name,
      includedElementIds: selectedElementIds,
      includedAnnotations: [],
      elementStyleOverrides,
      contentIndex,
      placeholders: activeLayout.placeholders,
      intent: "",
    });
    openCopilotDrawer(prompt);
  };

  const popoverLeftPx = Math.max(0, leftPx);

  return (
    <div
      style={{
        position: "absolute",
        left: popoverLeftPx,
        top: topPx,
        zIndex: 25,
        pointerEvents: "auto",
        // Counter the parent's scale() so the toolbar stays at fixed pixel size.
        transform: `scale(${1 / scale})`,
        transformOrigin: flipBelow ? "top left" : "bottom left",
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="flex items-center gap-1 rounded-xl border border-[var(--app-border)] bg-[var(--app-panel)] p-1 shadow-lg"
        style={{ backdropFilter: "blur(6px)" }}
      >
        <ToolbarBtn
          label="Kommentar"
          onClick={handleComment}
          icon={<MessageSquare size={13} />}
        />
        <ToolbarBtn
          label="Text bearbeiten"
          onClick={handleText}
          icon={<Type size={13} />}
          disabled={selectedElementIds.length !== 1}
        />
        <ToolbarBtn
          label="Anpassen"
          onClick={() => setAdjustOpen((v) => !v)}
          icon={<Sliders size={13} />}
          active={adjustOpen}
        />
        <div className="mx-1 h-4 w-px bg-[var(--app-border)]" />
        <button
          type="button"
          onClick={handleSend}
          className="inline-flex items-center gap-1 rounded-md bg-[var(--app-accent)] px-2 py-1 text-[11px] font-medium text-white hover:bg-[var(--app-accent-hover)]"
        >
          <Send size={11} /> An Copilot
        </button>
      </div>

      {adjustOpen && (
        <div
          className="mt-1 w-[280px] rounded-lg border border-[var(--app-border)] bg-[var(--app-panel)] shadow-xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <ElementStylePanel
            onClose={() => setAdjustOpen(false)}
            title="Anpassen"
          />
        </div>
      )}
    </div>
  );
};

const ToolbarBtn: React.FC<{
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
}> = ({ label, onClick, icon, active, disabled }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    onClick={onClick}
    disabled={disabled}
    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-[var(--app-text)] hover:bg-[var(--app-surface)] disabled:opacity-40"
    style={
      active
        ? { background: "var(--app-surface)", color: "var(--app-accent)" }
        : undefined
    }
  >
    {icon}
  </button>
);

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/(["\\])/g, "\\$1");
}

function makeNodeEditable(node: HTMLElement, onCommit?: (text: string) => void) {
  if (node.isContentEditable) return;
  const original = node.textContent ?? "";
  node.setAttribute("contenteditable", "plaintext-only");
  node.focus();
  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(node);
  selection?.removeAllRanges();
  selection?.addRange(range);
  const cleanup = () => {
    node.removeAttribute("contenteditable");
    node.removeEventListener("blur", onBlur);
    node.removeEventListener("keydown", onKey);
  };
  const onBlur = () => {
    const next = (node.textContent ?? "").trim();
    if (next !== original && onCommit) onCommit(next);
    cleanup();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      node.blur();
    }
    if (e.key === "Escape") {
      node.textContent = original;
      node.blur();
    }
  };
  node.addEventListener("blur", onBlur);
  node.addEventListener("keydown", onKey);
}

function computeSelectionRect(
  ids: string[],
  contentIndex:
    | Record<
        string,
        {
          rect: { x: number; y: number; w: number; h: number };
          placeholderIdx: number;
        }
      >
    | undefined,
  layout: { placeholders: Array<{ idx: number; position: { x: number; y: number; w: number; h: number } }> },
): ElementRect | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let found = false;
  for (const id of ids) {
    if (isContentElementId(id)) {
      const entry = contentIndex?.[id];
      if (!entry) continue;
      const r = entry.rect;
      minX = Math.min(minX, r.x);
      minY = Math.min(minY, r.y);
      maxX = Math.max(maxX, r.x + r.w);
      maxY = Math.max(maxY, r.y + r.h);
      found = true;
    } else {
      const parsed = parseElementId(id);
      if (!parsed) continue;
      const placeholder = layout.placeholders.find((p) => p.idx === parsed.idx);
      if (!placeholder) continue;
      const x = placeholder.position.x / 100;
      const y = placeholder.position.y / 100;
      const w = placeholder.position.w / 100;
      const h = placeholder.position.h / 100;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
      found = true;
    }
  }
  if (!found) return null;
  return {
    x: minX,
    y: minY,
    w: maxX - minX,
    h: maxY - minY,
  };
}
