import * as React from "react";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
}

/**
 * Lightweight CSS-only tooltip. Parent needs `group` class, but we wrap children
 * in a span that adds it so callers don't need to think about it.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = "top",
}) => {
  const [hovered, setHovered] = React.useState(false);
  const positionStyle: React.CSSProperties = (() => {
    switch (side) {
      case "bottom":
        return {
          top: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(6px)",
        };
      case "left":
        return {
          right: "100%",
          top: "50%",
          transform: "translateY(-50%) translateX(-6px)",
        };
      case "right":
        return {
          left: "100%",
          top: "50%",
          transform: "translateY(-50%) translateX(6px)",
        };
      default:
        return {
          bottom: "100%",
          left: "50%",
          transform: "translateX(-50%) translateY(-6px)",
        };
    }
  })();

  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {hovered && content && (
        <span
          style={{
            position: "absolute",
            ...positionStyle,
            zIndex: 50,
            padding: "4px 8px",
            borderRadius: 4,
            background: "#0a0a0a",
            border: "1px solid #2a2a2a",
            color: "#e8e8e8",
            fontSize: 11,
            whiteSpace: "pre-wrap",
            maxWidth: 220,
            pointerEvents: "none",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          }}
        >
          {content}
        </span>
      )}
    </span>
  );
};
