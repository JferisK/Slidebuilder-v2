import type { CodeSlide } from "./types";
import DoraPamCisoSlide from "./dora-pam/DoraPamCisoSlide";

/**
 * Registry of all React-authored slides. Each entry represents one slide
 * (1:1 with its .tsx file). Slides are theme-agnostic and rely on the
 * active master's `--slide-*` CSS variables for their look.
 */
export const codeSlides: CodeSlide[] = [
  {
    id: "dora-pam-ciso",
    name: "DORA & PAM — CISO-Implikationen",
    description:
      "Was die EU-Verordnung 2022/2554 für privilegierten Zugriff vorschreibt.",
    Component: DoraPamCisoSlide,
  },
];

export function getCodeSlide(id: string | null | undefined) {
  if (!id) return undefined;
  return codeSlides.find((s) => s.id === id);
}
