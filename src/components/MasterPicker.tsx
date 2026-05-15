import * as React from "react";
import type { SlideMaster } from "@/parser/pptxParser";

interface Props {
  masters: SlideMaster[];
  activeId: string;
  onChange: (id: string) => void;
}

const COLOR_KEYS = [
  "--slide-bg",
  "--slide-primary",
  "--slide-accent",
  "--slide-text",
] as const;

export const MasterPicker: React.FC<Props> = ({
  masters,
  activeId,
  onChange,
}) => {
  if (masters.length === 0) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 6,
      }}
    >
      {masters.map((m) => {
        const isActive = m.id === activeId;
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange(m.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 8px",
              borderRadius: 6,
              background: isActive
                ? "rgba(59,130,246,0.16)"
                : "var(--app-surface)",
              border: `1px solid ${isActive ? "var(--app-accent)" : "var(--app-border)"}`,
              cursor: "pointer",
              textAlign: "left",
              color: "var(--app-text)",
              font: "inherit",
            }}
            title={m.name}
          >
            <div style={{ display: "flex", gap: 2 }}>
              {COLOR_KEYS.map((k) => (
                <span
                  key={k}
                  style={{
                    width: 10,
                    height: 16,
                    background: m.theme.cssVars[k],
                    borderRadius: 2,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontSize: 12,
                flex: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {m.name}
            </span>
            {isActive && (
              <span
                style={{
                  fontSize: 9,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--app-accent)",
                }}
              >
                aktiv
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
