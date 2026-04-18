import type { Placeholder, SlideLayout } from "@/parser/pptxParser";
import type { CodeSlide, CodeSlideSlot } from "./types";

export type CodeSlotMapping = Record<string, number>;

const AUXILIARY_PLACEHOLDER_TYPES = new Set(["dt", "ftr", "sldNum"]);

function inferSlotIntent(
  slide: CodeSlide,
  slot: CodeSlideSlot,
): "title" | "content" | "generic" {
  const prefs = slide.preferredTypes?.[slot.key] ?? [];
  const haystack = `${slot.key} ${slot.label} ${prefs.join(" ")}`.toLowerCase();
  if (haystack.includes("title") || haystack.includes("titel")) return "title";
  if (
    haystack.includes("content") ||
    haystack.includes("body") ||
    haystack.includes("inhalt") ||
    haystack.includes("text")
  ) {
    return "content";
  }
  return "generic";
}

function findMappedTitleBottom(
  slide: CodeSlide,
  layout: SlideLayout,
  mapping: CodeSlotMapping,
): number | null {
  let bestBottom: number | null = null;
  for (const slot of slide.slots) {
    if (inferSlotIntent(slide, slot) !== "title") continue;
    const idx = mapping[slot.key];
    if (idx === undefined) continue;
    const placeholder = layout.placeholders.find((p) => p.idx === idx);
    if (!placeholder) continue;
    const bottom = placeholder.position.y + placeholder.position.h;
    bestBottom = bestBottom === null ? bottom : Math.max(bestBottom, bottom);
  }
  return bestBottom;
}

function scorePlaceholder(
  slide: CodeSlide,
  slot: CodeSlideSlot,
  layout: SlideLayout,
  placeholder: Placeholder,
  mapping: CodeSlotMapping,
): number {
  const prefs = slide.preferredTypes?.[slot.key] ?? [];
  const intent = inferSlotIntent(slide, slot);
  const pos = placeholder.position;
  const area = pos.w * pos.h;
  const centerX = pos.x + pos.w / 2;
  const centerY = pos.y + pos.h / 2;

  let score = 0;

  if (prefs.includes(placeholder.type)) score += 1200;
  else if (prefs.length > 0) score -= 150;

  if (
    AUXILIARY_PLACEHOLDER_TYPES.has(placeholder.type) &&
    !prefs.includes(placeholder.type)
  ) {
    score -= 1200;
  }

  if (placeholder.source === "layout") score += 40;
  else if (placeholder.source === "master") score += 20;
  else if (placeholder.source === "fallback") score -= 80;

  switch (intent) {
    case "title":
      if (placeholder.type === "title" || placeholder.type === "ctrTitle") {
        score += 400;
      }
      score += pos.w * 4;
      score -= pos.y * 16;
      score -= Math.abs(centerX - 50) * 4;
      if (centerY > 35) score -= 300;
      if (pos.h > 30) score -= (pos.h - 30) * 2;
      break;
    case "content": {
      const titleBottom = findMappedTitleBottom(slide, layout, mapping);
      if (placeholder.type === "body") score += 260;
      score += area * 5;
      score += pos.h * 3;
      score -= Math.abs(centerX - 50) * 2;
      if (pos.y < 12) score -= 250;
      if (pos.w < 25) score -= 220;
      if (pos.h < 12) score -= 220;
      if (centerY > 92) score -= 500;
      if (titleBottom !== null) {
        if (pos.y >= titleBottom - 2) score += 180;
        else score -= 220;
      } else {
        score += Math.min(pos.y, 35) * 4;
      }
      break;
    }
    default:
      score += area * 2;
      if (!AUXILIARY_PLACEHOLDER_TYPES.has(placeholder.type)) score += 20;
      break;
  }

  return score;
}

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
      const stillThere = layout.placeholders.some(
        (p) => p.idx === mapping[slot.key],
      );
      if (stillThere) continue;
      used.delete(mapping[slot.key]);
      delete mapping[slot.key];
    }

    const candidates = layout.placeholders.filter((p) => !used.has(p.idx));
    if (candidates.length === 0) continue;

    const ranked = [...candidates].sort(
      (a, b) =>
        scorePlaceholder(slide, slot, layout, b, mapping) -
        scorePlaceholder(slide, slot, layout, a, mapping),
    );
    const prefs = slide.preferredTypes?.[slot.key] ?? [];
    const preferred = ranked.filter((p) => prefs.includes(p.type));
    const match = (preferred[0] ?? ranked[0]) || null;

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
