import * as React from "react";
import type { Placeholder, SlideLayout } from "@/parser/pptxParser";
import { useSlideStore } from "@/store/slideStore";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface ContentEditorProps {
  layout: SlideLayout;
  slideIndex: number;
  content: Record<string, string>;
  /** Placeholder idx values that are owned by a code slide (hidden from editor). */
  codeSlotIdxs?: Set<string>;
}

const LABELS: Record<string, string> = {
  title: "Titel",
  ctrTitle: "Titel",
  subTitle: "Untertitel",
  body: "Inhalt (eine Zeile pro Bullet)",
};

const EDITABLE_TYPES = new Set(["title", "ctrTitle", "subTitle", "body"]);

function editorFor(
  placeholder: Placeholder,
  value: string,
  onChange: (v: string) => void,
) {
  if (placeholder.type === "body") {
    return (
      <Textarea
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={"- Punkt 1\n- Punkt 2\n- Punkt 3"}
      />
    );
  }
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={LABELS[placeholder.type] ?? "Text"}
    />
  );
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  layout,
  slideIndex,
  content,
  codeSlotIdxs,
}) => {
  const updateSlideContent = useSlideStore((s) => s.updateSlideContent);

  const editablePlaceholders = layout.placeholders.filter(
    (p) =>
      EDITABLE_TYPES.has(p.type) && !codeSlotIdxs?.has(String(p.idx)),
  );

  if (editablePlaceholders.length === 0) {
    return (
      <div className="text-xs text-[var(--app-muted)]">
        {codeSlotIdxs && codeSlotIdxs.size > 0
          ? "Alle Textfelder werden von der React-Folie gefüllt."
          : "Dieses Layout hat keine bearbeitbaren Felder."}
      </div>
    );
  }

  // Deduplicate by idx (some layouts reuse the same idx across shapes)
  const seen = new Set<number>();
  const unique: Placeholder[] = [];
  for (const p of editablePlaceholders) {
    if (seen.has(p.idx)) continue;
    seen.add(p.idx);
    unique.push(p);
  }

  return (
    <div className="flex flex-col gap-3">
      {unique.map((p) => {
        const key = String(p.idx);
        const value = content[key] ?? "";
        return (
          <div key={`${p.idx}-${p.type}`} className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
              {LABELS[p.type] ?? p.type}
            </label>
            {editorFor(p, value, (v) =>
              updateSlideContent(slideIndex, key, v),
            )}
          </div>
        );
      })}
    </div>
  );
};
