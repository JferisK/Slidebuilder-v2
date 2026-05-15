export type ContentElementId = string;

export const CONTENT_ATTR = "data-content-id";

const CONTENT_TAGS = new Set([
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "P",
  "LI",
  "TD",
  "TH",
  "BLOCKQUOTE",
  "FIGCAPTION",
  "DT",
  "DD",
  "SUMMARY",
]);

const INLINE_TEXT_TAGS = new Set([
  "SPAN",
  "DIV",
  "A",
  "LABEL",
  "STRONG",
  "EM",
  "B",
  "I",
  "U",
  "SMALL",
  "CODE",
]);

export const SELECTABLE_ATTR = "data-selectable";

export function isContentElement(el: Element): boolean {
  if (!(el instanceof HTMLElement)) return false;
  // Opt-in: any element explicitly marked as selectable in a slide template
  // is selectable as long as it carries text. This lets div/section/button
  // primitives inside React slide templates participate in selection without
  // forcing every template to use semantic tags.
  if (el.hasAttribute(SELECTABLE_ATTR)) {
    return (el.textContent ?? "").trim().length > 0;
  }
  const tag = el.tagName;
  if (CONTENT_TAGS.has(tag)) {
    return (el.textContent ?? "").trim().length > 0;
  }
  if (INLINE_TEXT_TAGS.has(tag)) {
    const text = (el.textContent ?? "").trim();
    if (text.length === 0) return false;
    if (el.childElementCount === 0) return true;
    for (const child of Array.from(el.children)) {
      if (CONTENT_TAGS.has(child.tagName)) return false;
      if (INLINE_TEXT_TAGS.has(child.tagName)) continue;
      if (child instanceof HTMLElement && child.hasAttribute(SELECTABLE_ATTR))
        return false;
      return false;
    }
    return true;
  }
  return false;
}

export function computeDomPath(node: Element, root: Element): string {
  if (node === root) return "self";
  const parts: string[] = [];
  let cur: Element | null = node;
  while (cur && cur !== root) {
    const parent: Element | null = cur.parentElement;
    if (!parent) break;
    const tag = cur.tagName.toLowerCase();
    const sameTagSiblings = Array.from(parent.children).filter(
      (c) => c.tagName === cur!.tagName,
    );
    const index = sameTagSiblings.indexOf(cur) + 1;
    parts.unshift(
      sameTagSiblings.length > 1 ? `${tag}:nth-of-type(${index})` : tag,
    );
    cur = parent;
  }
  return parts.join(">");
}

export function makeContentElementId(
  slideId: string,
  placeholderIdx: number,
  domPath: string,
): ContentElementId {
  return `${slideId}::p${placeholderIdx}::${domPath}`;
}

export interface ParsedContentElementId {
  slideId: string;
  placeholderIdx: number;
  domPath: string;
}

export function parseContentElementId(
  id: ContentElementId,
): ParsedContentElementId | null {
  const first = id.indexOf("::");
  if (first < 0) return null;
  const second = id.indexOf("::", first + 2);
  if (second < 0) return null;
  const slideId = id.slice(0, first);
  const placeholderPart = id.slice(first + 2, second);
  const domPath = id.slice(second + 2);
  if (!placeholderPart.startsWith("p")) return null;
  const placeholderIdx = Number(placeholderPart.slice(1));
  if (!slideId || !Number.isFinite(placeholderIdx) || !domPath) return null;
  return { slideId, placeholderIdx, domPath };
}

export function isContentElementId(id: string): boolean {
  return parseContentElementId(id) !== null;
}

export function describeContentElement(
  type: string,
  textContent: string,
): string {
  const map: Record<string, string> = {
    h1: "Überschrift",
    h2: "Überschrift",
    h3: "Überschrift",
    h4: "Überschrift",
    h5: "Überschrift",
    h6: "Überschrift",
    p: "Absatz",
    li: "Listenpunkt",
    td: "Tabellenzelle",
    th: "Tabellen-Kopf",
    blockquote: "Zitat",
    figcaption: "Bildunterschrift",
    dt: "Definitionsterm",
    dd: "Definition",
    summary: "Zusammenfassung",
    span: "Text",
    div: "Block",
    a: "Link",
    label: "Label",
    strong: "Text",
    em: "Text",
    b: "Text",
    i: "Text",
    u: "Text",
    small: "Text",
    code: "Code",
  };
  const label = map[type] ?? type;
  const preview =
    textContent.length > 40 ? `${textContent.slice(0, 40)}…` : textContent;
  return preview ? `${label} ("${preview}")` : label;
}
