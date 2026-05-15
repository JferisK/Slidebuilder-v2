import * as React from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface Props {
  open: boolean;
  initialPrompt: string;
  onClose: () => void;
  onCopied: (value: string) => void;
}

export const CopilotPromptDrawer: React.FC<Props> = ({
  open,
  initialPrompt,
  onClose,
  onCopied,
}) => {
  const [value, setValue] = React.useState(initialPrompt);

  React.useEffect(() => {
    if (open) setValue(initialPrompt);
  }, [open, initialPrompt]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleCopy = () => {
    onCopied(value);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        zIndex: 100,
        display: "flex",
        justifyContent: "flex-end",
      }}
      onMouseDown={onClose}
    >
      <div
        style={{
          width: 560,
          maxWidth: "100%",
          height: "100%",
          background: "#0f0f0f",
          borderLeft: "1px solid #2a2a2a",
          display: "flex",
          flexDirection: "column",
          color: "#e8e8e8",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>
              Copilot-Prompt
            </div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
              Editieren, dann kopieren und in Copilot Chat einfügen.
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <div style={{ flex: 1, padding: 12, overflow: "auto" }}>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              width: "100%",
              minHeight: "100%",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              fontSize: 12,
              lineHeight: 1.5,
              background: "#0a0a0a",
              border: "1px solid #2a2a2a",
              borderRadius: 6,
              padding: 10,
              color: "#e8e8e8",
              resize: "none",
            }}
            rows={28}
          />
        </div>

        <div
          style={{
            padding: 12,
            borderTop: "1px solid #2a2a2a",
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
          }}
        >
          <Button variant="ghost" size="sm" onClick={onClose}>
            Abbrechen
          </Button>
          <Button size="sm" onClick={handleCopy}>
            📋 Kopieren
          </Button>
        </div>
      </div>
    </div>
  );
};
