export type ElementId = string;

export function makeElementId(slideId: string, idx: number): ElementId {
  return `${slideId}::${idx}`;
}

export function parseElementId(
  id: ElementId,
): { slideId: string; idx: number } | null {
  const sep = id.indexOf("::");
  if (sep < 0) return null;
  const slideId = id.slice(0, sep);
  const idx = Number(id.slice(sep + 2));
  if (!slideId || !Number.isFinite(idx)) return null;
  return { slideId, idx };
}

export function formatElementLabel(
  slideOrdinal: number,
  type: string,
  idx: number,
): string {
  return `S${slideOrdinal}·${type}#${idx}`;
}

const CIRCLED: Record<number, string> = {
  1: "①",
  2: "②",
  3: "③",
  4: "④",
  5: "⑤",
  6: "⑥",
  7: "⑦",
  8: "⑧",
  9: "⑨",
  10: "⑩",
};

export function circledNumber(n: number): string {
  if (n >= 1 && n <= 10) return CIRCLED[n];
  return `(${n})`;
}
