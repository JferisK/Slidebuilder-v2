import * as React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  useSlideStore,
  type ContentElementIndex,
} from "@/store/slideStore";
import {
  describeContentElement,
  isContentElementId,
} from "@/lib/contentElementId";

export interface SelectionEditPopoverProps {
  slideId: string;
  slideIndex: number;
  renderSize: { width: number; height: number };
  onSubmit: (intent: string) => Promise<void> | void;
}

/**
 * Union bounding box (normalized 0–1) over the rects of all content-element
 * entries belonging to the given ids. Returns null if no content-element rects
 * are known.
 */
function unionRect(
  index: ContentElementIndex | undefined,
  ids: string[],
): { x: number; y: number; w: number; h: number } | null {
  if (!index) return null;
  let x1 = Infinity;
  let y1 = Infinity;
  let x2 = -Infinity;
  let y2 = -Infinity;
  let found = false;
  for (const id of ids) {
    const entry = index[id];
    if (!entry) continue;
    found = true;
    x1 = Math.min(x1, entry.rect.x);
    y1 = Math.min(y1, entry.rect.y);
    x2 = Math.max(x2, entry.rect.x + entry.rect.w);
    y2 = Math.max(y2, entry.rect.y + entry.rect.h);
  }
  if (!found) return null;
  return { x: x1, y: y1, w: x2 - x1, h: y2 - y1 };
}

export const SelectionEditPopover: React.FC<SelectionEditPopoverProps> = ({
  slideId,
  renderSize,
  onSubmit,
}) => {
  const pending = useSlideStore((s) => s.pendingEditPrompt);
  const selectedElementIds = useSlideStore((s) => s.selectedElementIds);
  const index = useSlideStore((s) => s.contentElementIndex[slideId]);
  const updateText = useSlideStore((s) => s.updateEditPromptText);
  const closePopover = useSlideStore((s) => s.closeEditPopover);
  const clearSelection = useSlideStore((s) => s.clearElementSelection);

  const contentIds = React.useMemo(
    () => selectedElementIds.filter(isContentElementId),
    [selectedElementIds],
  );

  if (!pending || contentIds.length === 0) return null;

  const rect = unionRect(index, contentIds);
  const anchorX = rect ? rect.x + rect.w / 2 : 0.5;
  const anchorY = rect ? rect.y : 0.5;
  const flipDown = anchorY < 0.25;
  const flipLeft = anchorX > 0.6;

  const chips = contentIds.map((id) => {
    const entry = index?.[id];
    const label = entry
      ? describeContentElement(entry.type, entry.textContent)
      : id;
    return { id, label };
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePopover();
      clearSelection();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      void handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const intent = pending.text.trim();
    if (!intent) return;
    await onSubmit(intent);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={handleKeyDown}
      style={{
        position: "absolute",
        left: `${anchorX * 100}%`,
        top: `${anchorY * 100}%`,
        transform: `translate(${flipLeft ? "calc(-100% - 12px)" : "12px"}, ${flipDown ? "12px" : "calc(-100% - 12px)"})`,
        zIndex: 25,
        width: 320,
        maxWidth: Math.min(420, renderSize.width - 32),
        background: "#141414",
        border: "1px solid #3b82f6",
        borderRadius: 8,
        boxShadow: "0 10px 30px rgba(0,0,0,0.65)",
        padding: 12,
        color: "#e8e8e8",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#3b82f6",
            fontWeight: 700,
          }}
        >
          {chips.length === 1
            ? "1 Element ausgewählt"
            : `${chips.length} Elemente ausgewählt`}
        </div>
        <button
          type="button"
          onClick={() => {
            closePopover();
            clearSelection();
          }}
          style={{
            border: "none",
            background: "transparent",
            color: "#888",
            cursor: "pointer",
            padding: 2,
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Schließen"
        >
          <X size={14} />
        </button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          marginBottom: 8,
          maxHeight: 72,
          overflowY: "auto",
        }}
      >
        {chips.map((chip) => (
          <span
            key={chip.id}
            title={chip.id}
            style={{
              fontSize: 10,
              padding: "2px 6px",
              borderRadius: 4,
              background: "rgba(59,130,246,0.15)",
              border: "1px solid rgba(59,130,246,0.4)",
              color: "#cfe0ff",
              fontFamily: "monospace",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 280,
            }}
          >
            {chip.label}
          </span>
        ))}
      </div>
      <Textarea
        autoFocus
        rows={4}
        value={pending.text}
        onChange={(e) => updateText(e.target.value)}
        placeholder="Was möchtest du an den markierten Elementen ändern?"
      />
      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            closePopover();
            clearSelection();
          }}
        >
          ✕ Abbrechen
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={!pending.text.trim()}>
          📋 Prompt kopieren
        </Button>
      </div>
    </div>
  );
};
