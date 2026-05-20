import * as React from "react";
import { Check } from "lucide-react";
import type {
  Placeholder,
  SlideLayout,
  SlideSize,
  SlideTheme,
} from "@/parser/pptxParser";
import {
  circledNumber,
  formatElementLabel,
  makeElementId,
} from "@/lib/elementId";
import {
  isContentElementId,
  parseContentElementId,
} from "@/lib/contentElementId";
import { getRenderSlideSize } from "@/lib/slideSize";
import {
  useElementInstrumentation,
  type ContentElementMeta,
} from "@/hooks/useElementInstrumentation";
import {
  useSlideStore,
  ELEMENT_STYLE_KEYS,
  type ElementStyleOverride,
} from "@/store/slideStore";

const STYLE_PROP_NAMES: Record<keyof ElementStyleOverride, string> = {
  color: "color",
  backgroundColor: "background-color",
  fontSize: "font-size",
  fontWeight: "font-weight",
  borderRadius: "border-radius",
  textAlign: "text-align",
};

function applyOverrideToElement(
  el: HTMLElement,
  override: ElementStyleOverride | undefined,
) {
  const prevManaged = el.dataset.styleManaged;
  if (prevManaged) {
    for (const propName of prevManaged.split(",")) {
      if (propName) el.style.removeProperty(propName);
    }
  }
  if (!override) {
    if (prevManaged) delete el.dataset.styleManaged;
    return;
  }
  const applied: string[] = [];
  for (const key of ELEMENT_STYLE_KEYS) {
    const value = override[key];
    if (value === undefined || value === null || value === "") continue;
    const propName = STYLE_PROP_NAMES[key];
    el.style.setProperty(propName, String(value));
    applied.push(propName);
  }
  if (applied.length > 0) {
    el.dataset.styleManaged = applied.join(",");
  } else if (prevManaged) {
    delete el.dataset.styleManaged;
  }
}

const PlaceholderSlot: React.FC<{
  slideId: string | undefined;
  placeholderIdx: number;
  disabled: boolean;
  children: React.ReactNode;
  style: React.CSSProperties;
  extraProps: Record<string, unknown>;
}> = ({ slideId, placeholderIdx, disabled, children, style, extraProps }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const setContentElementsForPlaceholder = useSlideStore(
    (s) => s.setContentElementsForPlaceholder,
  );
  const clearContentElementsForPlaceholder = useSlideStore(
    (s) => s.clearContentElementsForPlaceholder,
  );
  const elementStyleOverrides = useSlideStore((s) => s.elementStyleOverrides);
  const contentIndexForSlide = useSlideStore((s) =>
    slideId ? s.contentElementIndex[slideId] : undefined,
  );

  const onEntries = React.useCallback(
    (entries: ContentElementMeta[]) => {
      if (!slideId) return;
      setContentElementsForPlaceholder(slideId, placeholderIdx, entries);
    },
    [slideId, placeholderIdx, setContentElementsForPlaceholder],
  );

  const onUnmount = React.useCallback(() => {
    if (!slideId) return;
    clearContentElementsForPlaceholder(slideId, placeholderIdx);
  }, [slideId, placeholderIdx, clearContentElementsForPlaceholder]);

  useElementInstrumentation({
    containerRef: ref,
    slideId,
    placeholderIdx,
    disabled,
    onEntries,
    onUnmount,
  });

  React.useEffect(() => {
    const root = ref.current;
    if (!root || disabled) return;
    const nodes = root.querySelectorAll<HTMLElement>("[data-content-id]");
    nodes.forEach((el) => {
      const id = el.getAttribute("data-content-id");
      if (!id) return;
      applyOverrideToElement(el, elementStyleOverrides[id]);
    });
  }, [elementStyleOverrides, contentIndexForSlide, disabled]);

  return (
    <div ref={ref} style={style} {...extraProps}>
      {children}
    </div>
  );
};

export interface DynamicSlideProps {
  layout: SlideLayout;
  theme: SlideTheme;
  slideSize?: SlideSize;
  content: Record<string, string>;
  isExporting?: boolean;
  /** Unique id of the slide that owns these placeholders. */
  slideId?: string;
  /** 1-based ordinal of the slide (for human-readable labels). */
  slideOrdinal?: number;
  /**
   * Element ids currently selected (ordered by selection time). Each entry has
   * the form `${slideId}::${placeholderIdx}`.
   */
  selectedElementIds?: string[];
  /** Show dashed outlines around all placeholders */
  showPlaceholderOutlines?: boolean;
  /**
   * Optional React components keyed by placeholder idx. When a placeholder's
   * idx matches a key here, the component is rendered inside the placeholder
   * box instead of the default text rendering. Comes from a code slide.
   */
  codeSlots?: Record<string, React.FC>;
  /** Placeholder idx values that should be fully skipped for this slide. */
  hiddenPlaceholderIdxs?: Set<number>;
}

const FALLBACK_TEXT: Record<string, string> = {
  title: "Titel eingeben",
  ctrTitle: "Titel eingeben",
  subTitle: "Untertitel eingeben",
  body: "• Punkt 1\n• Punkt 2\n• Punkt 3",
};

function getText(placeholder: Placeholder, content: Record<string, string>) {
  const value = content[String(placeholder.idx)];
  if (value !== undefined && value !== "") return value;
  return FALLBACK_TEXT[placeholder.type] ?? "";
}

function renderPlaceholderContent(
  placeholder: Placeholder,
  content: Record<string, string>,
  isExporting: boolean,
): React.ReactNode {
  const rawValue = content[String(placeholder.idx)];
  const text =
    rawValue !== undefined && rawValue !== ""
      ? rawValue
      : isExporting
        ? ""
        : getText(placeholder, content);
  if (isExporting && text.trim() === "") {
    return null;
  }

  switch (placeholder.type) {
    case "title":
    case "ctrTitle":
      return (
        <p
          style={{
            fontFamily: "var(--slide-font-heading)",
            color: "var(--slide-primary)",
            fontSize: "clamp(20px, 3.2vw, 42px)",
            fontWeight: 700,
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {text}
        </p>
      );
    case "subTitle":
      return (
        <p
          style={{
            fontFamily: "var(--slide-font-body)",
            color: "var(--slide-text-muted)",
            fontSize: "clamp(13px, 1.8vw, 24px)",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {text}
        </p>
      );
    case "body":
      return (
        <div
          style={{
            fontFamily: "var(--slide-font-body)",
            color: "var(--slide-text)",
            fontSize: "clamp(11px, 1.4vw, 18px)",
            lineHeight: 1.6,
            whiteSpace: "pre-line",
          }}
        >
          {text.split("\n").map((line, i) => {
            const isBullet = line.startsWith("-") || line.startsWith("•");
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "4px",
                }}
              >
                {isBullet ? (
                  <>
                    <span style={{ color: "var(--slide-primary)" }}>•</span>
                    <span>{line.replace(/^[-•]\s*/, "")}</span>
                  </>
                ) : (
                  <span>{line}</span>
                )}
              </div>
            );
          })}
        </div>
      );
    case "dt":
    case "ftr":
    case "sldNum":
      return (
        <p
          style={{
            fontFamily: "var(--slide-font-body)",
            color: "var(--slide-text-muted)",
            fontSize: "11px",
            margin: 0,
          }}
        >
          {text}
        </p>
      );
    default:
      return (
        <p
          style={{
            fontFamily: "var(--slide-font-body)",
            color: "var(--slide-text)",
            fontSize: "clamp(11px, 1.4vw, 18px)",
            margin: 0,
          }}
        >
          {text}
        </p>
      );
  }
}

function overrideToCssProperties(
  override: ElementStyleOverride | undefined,
): React.CSSProperties | undefined {
  if (!override) return undefined;
  const out: React.CSSProperties = {};
  for (const key of ELEMENT_STYLE_KEYS) {
    const value = override[key];
    if (value === undefined || value === null || value === "") continue;
    (out as Record<string, unknown>)[key] = value;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

export const DynamicSlide: React.FC<DynamicSlideProps> = ({
  layout,
  theme,
  slideSize,
  content,
  isExporting = false,
  slideId,
  slideOrdinal = 1,
  selectedElementIds,
  showPlaceholderOutlines = true,
  codeSlots,
  hiddenPlaceholderIdxs,
}) => {
  const themeStyle = theme.cssVars as unknown as React.CSSProperties;
  const selectedList = selectedElementIds ?? [];
  const renderSize = getRenderSlideSize(slideSize);
  const elementStyleOverrides = useSlideStore((s) => s.elementStyleOverrides);
  return (
    <div
      data-slide-root="true"
      data-slide-id={slideId}
      style={{
        width: renderSize.width,
        height: renderSize.height,
        position: "relative",
        overflow: "hidden",
        background: "var(--slide-bg)",
        ...themeStyle,
      }}
    >
      {layout.placeholders.map((placeholder) => {
        if (hiddenPlaceholderIdxs?.has(placeholder.idx)) return null;
        const elementId = slideId
          ? makeElementId(slideId, placeholder.idx)
          : undefined;
        const placeholderOverrideStyle = elementId
          ? overrideToCssProperties(elementStyleOverrides[elementId])
          : undefined;
        const selectedContentElementIds = slideId
          ? selectedList.filter((id) => {
              if (!isContentElementId(id)) return false;
              const parsed = parseContentElementId(id);
              return (
                parsed?.slideId === slideId &&
                parsed.placeholderIdx === placeholder.idx
              );
            })
          : [];
        const selectionOrder = elementId
          ? selectedList.indexOf(elementId)
          : -1;
        const isSelected =
          selectionOrder >= 0 || selectedContentElementIds.length > 0;
        const Slot = codeSlots?.[String(placeholder.idx)];
        const hasSlot = Boolean(Slot);
        const label = formatElementLabel(
          slideOrdinal,
          placeholder.type,
          placeholder.idx,
        );
        const outlineStyle: React.CSSProperties =
          !isExporting && showPlaceholderOutlines
            ? {
                border: isSelected
                  ? "2.5px solid #3b82f6"
                  : hasSlot
                    ? "1px dashed rgba(59,130,246,0.55)"
                    : "1px dashed rgba(150,150,150,0.35)",
                borderRadius: 2,
                transition:
                  "border-color 0.15s, box-shadow 0.15s, background 0.15s",
                boxShadow: isSelected
                  ? "0 0 0 3px rgba(59,130,246,0.35)"
                  : undefined,
                background: isSelected
                  ? "rgba(59,130,246,0.08)"
                  : undefined,
              }
            : {};

        return (
          <PlaceholderSlot
            key={`${placeholder.idx}-${placeholder.type}`}
            slideId={slideId}
            placeholderIdx={placeholder.idx}
            disabled={isExporting}
            style={{
              position: "absolute",
              left: `${placeholder.position.x}%`,
              top: `${placeholder.position.y}%`,
              width: `${placeholder.position.w}%`,
              height: `${placeholder.position.h}%`,
              padding: hasSlot ? 0 : "4px",
              display: "flex",
              alignItems: hasSlot ? "stretch" : "flex-start",
              justifyContent: "flex-start",
              overflow: "hidden",
              ...outlineStyle,
              ...placeholderOverrideStyle,
            }}
            extraProps={{
              "data-placeholder-idx": placeholder.idx,
              "data-placeholder-type": placeholder.type,
              "data-element-id": elementId,
              "data-selected-content-element-ids":
                selectedContentElementIds.length > 0
                  ? JSON.stringify(selectedContentElementIds)
                  : undefined,
              "data-selection-order": isSelected ? selectionOrder + 1 : undefined,
              "data-code-slot": hasSlot ? "true" : undefined,
            }}
          >
            {Slot ? (
              <div
                style={{ width: "100%", height: "100%" }}
                data-selected-content-element-ids={
                  selectedContentElementIds.length > 0
                    ? JSON.stringify(selectedContentElementIds)
                    : undefined
                }
              >
                <Slot />
              </div>
            ) : (
              renderPlaceholderContent(placeholder, content, isExporting)
            )}
            {!isExporting && showPlaceholderOutlines && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  fontSize: 8,
                  fontFamily: "monospace",
                  padding: "1px 4px",
                  background: isSelected
                    ? "#3b82f6"
                    : hasSlot
                      ? "rgba(59,130,246,0.55)"
                      : "rgba(0,0,0,0.45)",
                  color: "#fff",
                  borderRadius: "0 2px 0 3px",
                  lineHeight: 1.4,
                  pointerEvents: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontWeight: isSelected ? 700 : 400,
                }}
              >
                {isSelected && (
                  <>
                    <span style={{ fontSize: 9 }}>
                      {circledNumber(selectionOrder + 1)}
                    </span>
                    <Check size={8} strokeWidth={3} />
                  </>
                )}
                <span>{label}</span>
                {hasSlot && !isSelected && <span>· code</span>}
              </span>
            )}
          </PlaceholderSlot>
        );
      })}
    </div>
  );
};
