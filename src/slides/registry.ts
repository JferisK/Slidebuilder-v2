import type { CodeSlide } from "./types";
import DoraPamCisoSlide from "./dora-pam/DoraPamCisoSlide";

/**
 * Registry of all React-authored slides. Each entry provides React slots
 * keyed by placeholder idx; they are rendered into the matching placeholder
 * boxes of the active PPTX layout.
 */
export const codeSlides: CodeSlide[] = [DoraPamCisoSlide];

export function getCodeSlide(id: string | null | undefined) {
  if (!id) return undefined;
  return codeSlides.find((s) => s.id === id);
}
