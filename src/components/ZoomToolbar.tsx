import * as React from "react";
import { Maximize2, Minus, Plus } from "lucide-react";
import { useSlideStore } from "@/store/slideStore";
import { Tooltip } from "./ui/tooltip";

export const ZoomToolbar: React.FC = () => {
  const canvasZoom = useSlideStore((s) => s.canvasZoom);
  const zoomIn = useSlideStore((s) => s.zoomIn);
  const zoomOut = useSlideStore((s) => s.zoomOut);
  const resetZoom = useSlideStore((s) => s.resetZoom);

  const btn: React.CSSProperties = {
    width: 26,
    height: 26,
    border: "none",
    borderRadius: 4,
    background: "transparent",
    color: "#ddd",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        background: "rgba(20,20,20,0.85)",
        border: "1px solid #2a2a2a",
        borderRadius: 6,
        padding: 2,
      }}
    >
      <Tooltip content="Auszoomen" side="bottom">
        <button type="button" onClick={zoomOut} style={btn} aria-label="Auszoomen">
          <Minus size={14} />
        </button>
      </Tooltip>
      <Tooltip content="100 % (Strg/Cmd+0)" side="bottom">
        <button
          type="button"
          onClick={resetZoom}
          style={{
            ...btn,
            width: "auto",
            padding: "0 8px",
            fontSize: 11,
            fontFamily: "monospace",
          }}
          aria-label="Zoom zurücksetzen"
        >
          {Math.round(canvasZoom * 100)}%
        </button>
      </Tooltip>
      <Tooltip content="Reinzoomen" side="bottom">
        <button type="button" onClick={zoomIn} style={btn} aria-label="Reinzoomen">
          <Plus size={14} />
        </button>
      </Tooltip>
      <Tooltip content="An Breite anpassen" side="bottom">
        <button
          type="button"
          onClick={resetZoom}
          style={btn}
          aria-label="An Breite anpassen"
        >
          <Maximize2 size={13} />
        </button>
      </Tooltip>
    </div>
  );
};
