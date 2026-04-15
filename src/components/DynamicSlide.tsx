import * as React from "react";
import type {
  Placeholder,
  SlideLayout,
  SlideTheme,
} from "@/parser/pptxParser";

interface DynamicSlideProps {
  layout: SlideLayout;
  theme: SlideTheme;
  content: Record<string, string>;
  isExporting?: boolean;
}

const FALLBACK_TEXT: Record<string, string> = {
  title: "Titel eingeben",
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
}) => {
  const themeStyle = theme.cssVars as unknown as React.CSSProperties;
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
      {layout.placeholders.map((placeholder) => (
        <div
          key={`${placeholder.idx}-${placeholder.type}`}
          style={{
            position: "absolute",
            left: `${placeholder.position.x}%`,
            top: `${placeholder.position.y}%`,
            width: `${placeholder.position.w}%`,
            height: `${placeholder.position.h}%`,
            padding: "4px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            overflow: "hidden",
          }}
        >
          {renderPlaceholderContent(placeholder, content)}
        </div>
      ))}
    </div>
  );
};
