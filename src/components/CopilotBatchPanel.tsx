import * as React from "react";
import { Send } from "lucide-react";
import {
  useActiveLayout,
  useActiveSlide,
  useSlideStore,
  type ElementStyleOverrides,
} from "@/store/slideStore";
import {
  parseContentElementId,
  describeContentElement,
} from "@/lib/contentElementId";
import { makeElementId, formatElementLabel, parseElementId } from "@/lib/elementId";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

export const CopilotBatchPanel: React.FC = () => {
  const selectedElementIds = useSlideStore((s) => s.selectedElementIds);
  const elementStyleOverrides = useSlideStore(
    (s) => s.elementStyleOverrides,
  );
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const activeSlide = useActiveSlide();
  const activeLayout = useActiveLayout();
  const contentIndex = useSlideStore(
    (s) => s.contentElementIndex[activeSlide?.id ?? ""],
  );
  const clearElementSelection = useSlideStore((s) => s.clearElementSelection);
  const openCopilotDrawer = useSlideStore((s) => s.openCopilotDrawer);

  const [intent, setIntent] = React.useState("");
  const [excludedElementIds, setExcludedElementIds] = React.useState<
    Set<string>
  >(new Set());
  const [includeOverrides, setIncludeOverrides] = React.useState(true);

  // When selection changes, default-include all newly selected ids.
  React.useEffect(() => {
    setExcludedElementIds((prev) => {
      const next = new Set<string>();
      for (const id of prev) {
        if (selectedElementIds.includes(id)) next.add(id);
      }
      return next;
    });
  }, [selectedElementIds]);

  React.useEffect(() => {
    if (selectedElementIds.length === 0) {
      setIntent("");
    }
  }, [selectedElementIds.length]);

  if (!activeSlide || !activeLayout) return null;

  const slideId = activeSlide.id;
  const slideOrdinal = activeSlideIndex + 1;

  const includedElementIds = selectedElementIds.filter(
    (id) => !excludedElementIds.has(id),
  );
  const overrideIds = Object.keys(elementStyleOverrides);
  const overrideCount = overrideIds.length;

  if (selectedElementIds.length === 0) return null;

  const toggleElement = (id: string) => {
    setExcludedElementIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSend = () => {
    const prompt = buildBatchPrompt({
      slideId,
      slideOrdinal,
      layoutName: activeLayout.name,
      includedElementIds,
      elementStyleOverrides: includeOverrides ? elementStyleOverrides : {},
      contentIndex,
      placeholders: activeLayout.placeholders,
      intent: intent.trim(),
    });
    openCopilotDrawer(prompt);
  };

  return (
    <div className="rounded-lg border border-[#3b82f6] bg-[var(--app-surface)] p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] font-medium uppercase tracking-wider text-[#3b82f6]">
          An Copilot senden
        </div>
        <div className="text-[10px] text-[var(--app-muted)]">
          {includedElementIds.length} El.
          {overrideCount > 0 && includeOverrides
            ? ` · ${overrideCount} Edit${overrideCount === 1 ? "" : "s"}`
            : ""}
        </div>
      </div>

      {selectedElementIds.length > 0 && (
        <Group label="Markierte Elemente">
          <div className="flex flex-col gap-1">
            {selectedElementIds.slice(0, 8).map((id) => {
              const checked = !excludedElementIds.has(id);
              const ph = parseElementId(id);
              const cp = parseContentElementId(id);
              const entry = contentIndex?.[id];
              let label: string;
              if (entry) {
                label = describeContentElement(entry.type, entry.textContent);
              } else if (cp) {
                label = `${cp.domPath}`;
              } else if (ph) {
                const placeholder = activeLayout.placeholders.find(
                  (p) => p.idx === ph.idx,
                );
                label = placeholder
                  ? formatElementLabel(
                      slideOrdinal,
                      placeholder.type,
                      placeholder.idx,
                    )
                  : id;
              } else {
                label = id;
              }
              return (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-2 text-[11px] text-[var(--app-text)]"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleElement(id)}
                    className="h-3 w-3 accent-[var(--app-accent)]"
                  />
                  <span className="truncate">{label}</span>
                </label>
              );
            })}
            {selectedElementIds.length > 8 && (
              <div className="text-[10px] text-[var(--app-muted)]">
                + {selectedElementIds.length - 8} weitere
              </div>
            )}
          </div>
        </Group>
      )}

      {overrideCount > 0 && (
        <Group label="Lokale Stil-Anpassungen">
          <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[var(--app-text)]">
            <input
              type="checkbox"
              checked={includeOverrides}
              onChange={(e) => setIncludeOverrides(e.target.checked)}
              className="h-3 w-3 accent-[var(--app-accent)]"
            />
            <span>
              {overrideCount} Element{overrideCount === 1 ? "" : "e"} mit
              Live-Edits einschließen
            </span>
          </label>
        </Group>
      )}

      <div className="mt-3">
        <Textarea
          rows={3}
          value={intent}
          onChange={(e) => setIntent(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Was soll geändert werden? (optional)"
          className="mb-2"
        />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => clearElementSelection()}
          >
            Auswahl leeren
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleSend}
            disabled={
              includedElementIds.length === 0 &&
              !(includeOverrides && overrideCount > 0)
            }
          >
            <Send size={11} /> An Copilot
          </Button>
        </div>
      </div>
    </div>
  );
};

const Group: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <div className="mt-2">
    <div className="mb-1 text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
      {label}
    </div>
    {children}
  </div>
);

interface BuildBatchPromptArgs {
  slideId: string;
  slideOrdinal: number;
  layoutName: string;
  includedElementIds: string[];
  elementStyleOverrides: ElementStyleOverrides;
  contentIndex: Record<string, { type: string; textContent: string }> | undefined;
  placeholders: Array<{ idx: number; type: string }>;
  intent: string;
}

export function buildBatchPrompt({
  slideId,
  slideOrdinal,
  layoutName,
  includedElementIds,
  elementStyleOverrides,
  contentIndex,
  placeholders,
  intent,
}: BuildBatchPromptArgs): string {
  const lines: string[] = [
    "Ich arbeite an einer SlideForge-Folie (React-Komponenten in src/slides/...).",
    "",
    "## Folien-Kontext",
    `Slide-Id: "${slideId}"`,
    `Slide-Ordinal: ${slideOrdinal}`,
    `Layout: "${layoutName}"`,
    "",
  ];

  if (includedElementIds.length > 0) {
    lines.push("## Markierte Elemente");
    lines.push(
      "Bitte Änderungen ausschließlich an diesen Elementen vornehmen und per id referenzieren.",
    );
    lines.push("");
    includedElementIds.forEach((id, i) => {
      const entry = contentIndex?.[id];
      const cp = parseContentElementId(id);
      const ph = parseElementId(id);
      lines.push(`  ${i + 1}. id="${id}"`);
      if (entry) {
        lines.push(
          `     type=${entry.type} · ${describeContentElement(entry.type, entry.textContent)}`,
        );
        lines.push(`     text="${entry.textContent}"`);
      } else if (cp) {
        lines.push(
          `     placeholderIdx=${cp.placeholderIdx} · domPath=${cp.domPath}`,
        );
      } else if (ph) {
        const placeholder = placeholders.find((p) => p.idx === ph.idx);
        lines.push(
          `     ${placeholder ? formatElementLabel(slideOrdinal, placeholder.type, placeholder.idx) : `idx=${ph.idx}`}`,
        );
      }
    });
    lines.push("");
  }

  const overrideIds = Object.keys(elementStyleOverrides).filter(
    (id) => includedElementIds.includes(id) || includedElementIds.length === 0,
  );
  const filteredOverrides = overrideIds.filter(
    (id) => Object.keys(elementStyleOverrides[id] ?? {}).length > 0,
  );
  if (filteredOverrides.length > 0) {
    lines.push("## Lokale Stil-Anpassungen (Vorschau)");
    lines.push(
      "Der User hat die folgenden CSS-Eigenschaften im Live-Editor geändert.",
    );
    lines.push(
      "Bitte diese Werte beim Aktualisieren der .tsx-Datei dauerhaft als Inline-Style einbauen.",
    );
    lines.push("");
    filteredOverrides.forEach((id, i) => {
      const ov = elementStyleOverrides[id];
      lines.push(`  ${i + 1}. id="${id}"`);
      for (const [k, v] of Object.entries(ov)) {
        lines.push(`     - ${k}: ${v}`);
      }
    });
    lines.push("");
  }

  if (intent) {
    lines.push("## Gewünschte Änderung");
    lines.push(`"${intent}"`);
    lines.push("");
  }

  lines.push(
    "Bitte schlage eine konkrete Änderung an der relevanten Komponente vor.",
    "Referenziere Elemente ausschließlich per `id`.",
    "Zeige den geänderten Code-Abschnitt.",
  );

  // Silence unused-var warning for makeElementId import (kept for future use).
  void makeElementId;

  return lines.join("\n").trim();
}
