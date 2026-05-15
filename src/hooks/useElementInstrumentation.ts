import * as React from "react";
import {
  CONTENT_ATTR,
  computeDomPath,
  isContentElement,
  makeContentElementId,
} from "@/lib/contentElementId";

export interface ContentElementRect {
  /** Normalized [0,1] left relative to the slide root. */
  x: number;
  /** Normalized [0,1] top relative to the slide root. */
  y: number;
  /** Normalized [0,1] width relative to the slide root. */
  w: number;
  /** Normalized [0,1] height relative to the slide root. */
  h: number;
}

export interface ContentElementMeta {
  id: string;
  placeholderIdx: number;
  domPath: string;
  /** Lowercase tag name of the DOM node (e.g. "li"). */
  type: string;
  /** Trimmed text content, truncated to keep the store small. */
  textContent: string;
  rect: ContentElementRect;
}

export interface UseElementInstrumentationOptions {
  containerRef: React.RefObject<HTMLElement>;
  slideId: string | undefined;
  placeholderIdx: number;
  /** Root that rects are normalized against. Must be the slide's bounding box. */
  slideRootSelector?: string;
  /** Called whenever the set or geometry of content elements changes. */
  onEntries: (entries: ContentElementMeta[]) => void;
  /** Called on unmount so the store can drop entries. */
  onUnmount?: () => void;
  /** Disable the instrumentation (e.g. during export). */
  disabled?: boolean;
}

const TEXT_TRUNCATE = 200;

function findSlideRoot(
  container: HTMLElement,
  selector: string,
): HTMLElement | null {
  const match = container.closest(selector);
  return match instanceof HTMLElement ? match : null;
}

function buildEntries(
  container: HTMLElement,
  slideRoot: HTMLElement,
  slideId: string,
  placeholderIdx: number,
): ContentElementMeta[] {
  const rootRect = slideRoot.getBoundingClientRect();
  if (rootRect.width === 0 || rootRect.height === 0) return [];

  const seenPaths = new Set<string>();
  const entries: ContentElementMeta[] = [];
  const nodes = container.querySelectorAll<HTMLElement>("*");

  nodes.forEach((el) => {
    if (!isContentElement(el)) {
      if (el.hasAttribute(CONTENT_ATTR)) el.removeAttribute(CONTENT_ATTR);
      return;
    }
    const domPath = computeDomPath(el, container);
    if (seenPaths.has(domPath)) return;
    seenPaths.add(domPath);

    const id = makeContentElementId(slideId, placeholderIdx, domPath);
    el.setAttribute(CONTENT_ATTR, id);

    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;

    const x = (r.left - rootRect.left) / rootRect.width;
    const y = (r.top - rootRect.top) / rootRect.height;
    const w = r.width / rootRect.width;
    const h = r.height / rootRect.height;

    if (x < -0.02 || y < -0.02 || x > 1.02 || y > 1.02) return;

    const rawText = (el.textContent ?? "").trim();
    const textContent =
      rawText.length > TEXT_TRUNCATE
        ? `${rawText.slice(0, TEXT_TRUNCATE)}…`
        : rawText;

    entries.push({
      id,
      placeholderIdx,
      domPath,
      type: el.tagName.toLowerCase(),
      textContent,
      rect: {
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
        w: Math.max(0, Math.min(1, w)),
        h: Math.max(0, Math.min(1, h)),
      },
    });
  });

  return entries;
}

function entriesEqual(
  a: ContentElementMeta[],
  b: ContentElementMeta[],
): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (
      x.id !== y.id ||
      x.textContent !== y.textContent ||
      Math.abs(x.rect.x - y.rect.x) > 0.0005 ||
      Math.abs(x.rect.y - y.rect.y) > 0.0005 ||
      Math.abs(x.rect.w - y.rect.w) > 0.0005 ||
      Math.abs(x.rect.h - y.rect.h) > 0.0005
    ) {
      return false;
    }
  }
  return true;
}

export function useElementInstrumentation({
  containerRef,
  slideId,
  placeholderIdx,
  slideRootSelector = '[data-slide-root="true"]',
  onEntries,
  onUnmount,
  disabled = false,
}: UseElementInstrumentationOptions): void {
  const latestRef = React.useRef<ContentElementMeta[]>([]);
  const onEntriesRef = React.useRef(onEntries);
  const onUnmountRef = React.useRef(onUnmount);

  React.useEffect(() => {
    onEntriesRef.current = onEntries;
  }, [onEntries]);

  React.useEffect(() => {
    onUnmountRef.current = onUnmount;
  }, [onUnmount]);

  React.useLayoutEffect(() => {
    if (disabled || !slideId) return;
    const container = containerRef.current;
    if (!container) return;
    const slideRoot = findSlideRoot(container, slideRootSelector);
    if (!slideRoot) return;

    let rafId: number | null = null;
    let cancelled = false;

    const rebuild = () => {
      rafId = null;
      if (cancelled) return;
      const next = buildEntries(container, slideRoot, slideId, placeholderIdx);
      if (entriesEqual(latestRef.current, next)) return;
      latestRef.current = next;
      onEntriesRef.current(next);
    };

    const schedule = () => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(rebuild);
    };

    schedule();
    const mo = new MutationObserver(schedule);
    mo.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    const ro = new ResizeObserver(schedule);
    ro.observe(container);
    ro.observe(slideRoot);

    return () => {
      cancelled = true;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      mo.disconnect();
      ro.disconnect();
      latestRef.current = [];
      onUnmountRef.current?.();
    };
  }, [
    containerRef,
    slideId,
    placeholderIdx,
    slideRootSelector,
    disabled,
  ]);
}
