import type * as React from "react";

/**
 * A code slide provides React content for individual PowerPoint placeholders
 * by their index. The host PPTX layout defines position, size and theming;
 * the code slide defines what goes *into* each placeholder box.
 *
 * Example: a layout with `title:0` and `body:1` gets filled by a code slide
 * that exports slots for `"0"` (title) and `"1"` (body). Any placeholder
 * without a matching slot falls back to the default placeholder rendering.
 *
 * Relationship: 1 React file === 1 slide (provides slots for that slide).
 */
export interface CodeSlide {
  id: string;
  name: string;
  description: string;
  /**
   * Map from placeholder idx (as string, matching `Placeholder.idx`) to a
   * React component that renders the slot's content. The component is
   * mounted inside the placeholder's positioned box and fills it.
   */
  slots: Record<string, React.FC>;
}
