import type { SlideSize } from "@/parser/pptxParser";

const FALLBACK_WIDTH_EMU = 9144000;
const FALLBACK_HEIGHT_EMU = 5143500;
const DEFAULT_RENDER_WIDTH = 1280;

function getSafeSlideSize(slideSize?: SlideSize | null): SlideSize {
  if (
    slideSize &&
    slideSize.widthEmu > 0 &&
    slideSize.heightEmu > 0
  ) {
    return slideSize;
  }
  return {
    widthEmu: FALLBACK_WIDTH_EMU,
    heightEmu: FALLBACK_HEIGHT_EMU,
  };
}

export function getRenderSlideSize(slideSize?: SlideSize | null) {
  const safe = getSafeSlideSize(slideSize);
  const width = DEFAULT_RENDER_WIDTH;
  const height = Math.round(
    DEFAULT_RENDER_WIDTH * (safe.heightEmu / safe.widthEmu),
  );
  return {
    width,
    height,
    aspectRatio: safe.widthEmu / safe.heightEmu,
  };
}

export function formatSlideAspect(slideSize?: SlideSize | null): string {
  const safe = getSafeSlideSize(slideSize);
  const ratio = safe.widthEmu / safe.heightEmu;
  if (Math.abs(ratio - 16 / 9) < 0.02) return "16:9";
  if (Math.abs(ratio - 4 / 3) < 0.02) return "4:3";
  const gcd = (a: number, b: number): number =>
    b === 0 ? a : gcd(b, a % b);
  const precision = 1000;
  const w = Math.round(ratio * precision);
  const h = precision;
  const divisor = gcd(w, h);
  return `${w / divisor}:${h / divisor}`;
}
