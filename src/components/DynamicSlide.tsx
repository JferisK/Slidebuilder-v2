import * as React from "react";
import { Check } from "lucide-react";
import type {
  Placeholder,
  SlideLayout,
  SlideTheme,
} from "@/parser/pptxParser";
import {
  circledNumber,
  formatElementLabel,
  makeElementId,
} from "@/lib/elementId";

export interface DynamicSlideProps {
  layout: SlideLayout;
  theme: SlideTheme;
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
): React.ReactNode {
  const text = getText(placeholder, content);

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

export const DynamicSlide: React.FC<DynamicSlideProps> = ({
  layout,
  theme,
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
  return (
    <div
      style={{
        width: 1280,
        height: 720,
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
        const selectionOrder = elementId
          ? selectedList.indexOf(elementId)
          : -1;
        const isSelected = selectionOrder >= 0;
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
          <div
            key={`${placeholder.idx}-${placeholder.type}`}
            data-placeholder-idx={placeholder.idx}
            data-placeholder-type={placeholder.type}
            data-element-id={elementId}
            data-selection-order={isSelected ? selectionOrder + 1 : undefined}
            data-code-slot={hasSlot ? "true" : undefined}
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
            }}
          >
            {Slot ? (
              <div style={{ width: "100%", height: "100%" }}>
                <Slot />
              </div>
            ) : (
              renderPlaceholderContent(placeholder, content)
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
          </div>
        );
      })}
    </div>
  );
};
