import type { SlideLayout } from "@/parser/pptxParser";
import type { CodeSlide } from "./types";

export type CodeSlotMapping = Record<string, number>;

/**
 * Try to assign each slot to a placeholder in the layout based on the slot's
 * preferred placeholder types. Idx values already used by another slot are
 * skipped so two slots don't collide on the same placeholder.
 */
export function autoMapCodeSlots(
  slide: CodeSlide,
  layout: SlideLayout,
  existing?: CodeSlotMapping,
): CodeSlotMapping {
  const mapping: CodeSlotMapping = { ...(existing ?? {}) };
  const used = new Set<number>(Object.values(mapping));

  for (const slot of slide.slots) {
    if (mapping[slot.key] !== undefined) {
      // Keep existing mapping only if the placeholder still exists.
      const stillThere = layout.placeholders.some(
        (p) => p.idx === mapping[slot.key],
      );
      if (stillThere) continue;
      used.delete(mapping[slot.key]);
      delete mapping[slot.key];
    }

    const prefs = slide.preferredTypes?.[slot.key] ?? [];
    let match = layout.placeholders.find(
      (p) => prefs.includes(p.type) && !used.has(p.idx),
    );
    if (!match) {
      // Fallback: first unused placeholder.
      match = layout.placeholders.find((p) => !used.has(p.idx));
    }
    if (match) {
      mapping[slot.key] = match.idx;
      used.add(match.idx);
    }
  }

  return mapping;
}

/** Inverted view: placeholder idx → slot key (for quick lookup during render). */
export function invertMapping(
  mapping: CodeSlotMapping | undefined,
): Record<string, string> {
  if (!mapping) return {};
  const out: Record<string, string> = {};
  for (const [slotKey, idx] of Object.entries(mapping)) {
    out[String(idx)] = slotKey;
  }
  return out;
}
