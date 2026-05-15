import type * as React from "react";

/**
 * A semantic slot in a code slide — e.g. "title" or "content". The user
 * maps each slot to an actual placeholder idx of the host PPTX layout, so
 * the same React slide works with layouts that use unusual idx values
 * (e.g. body:18 instead of body:1).
 */
export interface CodeSlideSlot {
  /** Machine key, e.g. "title", "content". Stable across layouts. */
  key: string;
  /** Human-readable label for the UI, e.g. "Titel", "Inhalt". */
  label: string;
  /** Optional help text shown under the mapping row. */
  description?: string;
  /** The React component that renders this slot's content. */
  Component: React.FC;
}

/**
 * A React-authored slide. Slots are semantic ("title", "content"); the
 * mapping to concrete placeholder idx values lives on the `Slide` record
 * and can be edited per slide.
 */
export interface CodeSlide {
  id: string;
  name: string;
  description: string;
  slots: CodeSlideSlot[];
  /**
   * Default placeholder types each slot prefers, used to auto-suggest
   * mappings when the slide is assigned or the layout changes.
   * Example: `{ title: ["title", "ctrTitle"], content: ["body"] }`.
   */
  preferredTypes?: Record<string, string[]>;
}
