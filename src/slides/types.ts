import type * as React from "react";

/**
 * A "code slide" is a React component that renders a full 1280x720 slide.
 * Unlike placeholder-based slides, content and composition live entirely in
 * the component. Theming (colors, fonts) is inherited from the active
 * slide master via the `--slide-*` CSS custom properties on the wrapper.
 *
 * Relationship: 1 React file === 1 slide.
 */
export interface CodeSlide {
  id: string;
  name: string;
  description: string;
  Component: React.FC;
}
