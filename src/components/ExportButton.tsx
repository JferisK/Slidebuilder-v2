import * as React from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import { useSlideStore } from "@/store/slideStore";
import { getRenderSlideSize } from "@/lib/slideSize";
import { Button } from "./ui/button";

const COLOR_FUNCTION_NAMES = [
  "color(",
  "color-mix(",
  "oklch(",
  "lch(",
  "lab(",
  "hwb(",
] as const;

let colorNormalizationContext: CanvasRenderingContext2D | null = null;

function getColorNormalizationContext() {
  if (colorNormalizationContext) return colorNormalizationContext;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  colorNormalizationContext = canvas.getContext("2d");
  return colorNormalizationContext;
}

function normalizeColorToken(colorValue: string) {
  const colorFunctionMatch = colorValue
    .trim()
    .match(/^color\(\s*srgb\s+([^\)]+)\)$/i);
  if (colorFunctionMatch) {
    const normalized = normalizeSrgbColorFunction(colorFunctionMatch[1]);
    if (normalized) return normalized;
  }

  const ctx = getColorNormalizationContext();
  if (!ctx) return colorValue;

  const previousFillStyle = ctx.fillStyle;
  try {
    ctx.fillStyle = "#000";
    ctx.fillStyle = colorValue.trim();
    return String(ctx.fillStyle);
  } catch {
    return colorValue;
  } finally {
    ctx.fillStyle = previousFillStyle;
  }
}

function normalizeSrgbChannel(rawValue: string) {
  const value = rawValue.trim();
  if (!value) return 0;
  if (value.endsWith("%")) {
    return Math.round((Number.parseFloat(value) / 100) * 255);
  }
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return 0;
  return numeric <= 1 ? Math.round(numeric * 255) : Math.round(numeric);
}

function normalizeAlphaChannel(rawValue: string) {
  const value = rawValue.trim();
  if (!value) return 1;
  if (value.endsWith("%")) {
    return Math.max(0, Math.min(1, Number.parseFloat(value) / 100));
  }
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return 1;
  return Math.max(0, Math.min(1, numeric));
}

function normalizeSrgbColorFunction(rawChannels: string) {
  const [rgbPart, alphaPart] = rawChannels.split("/");
  if (!rgbPart) return null;

  const channels = rgbPart
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (channels.length < 3) return null;

  const [r, g, b] = channels.slice(0, 3).map(normalizeSrgbChannel);
  const alpha =
    typeof alphaPart === "string" ? normalizeAlphaChannel(alphaPart) : 1;

  return alpha >= 0.999
    ? `rgb(${r}, ${g}, ${b})`
    : `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function normalizeCssColorFunctions(value: string) {
  if (!COLOR_FUNCTION_NAMES.some((name) => value.includes(name))) return value;

  let normalized = "";
  let index = 0;

  while (index < value.length) {
    const nextMatch = COLOR_FUNCTION_NAMES
      .map((name) => ({ name, index: value.indexOf(name, index) }))
      .filter((entry) => entry.index !== -1)
      .sort((a, b) => a.index - b.index)[0];

    if (!nextMatch) {
      normalized += value.slice(index);
      break;
    }

    normalized += value.slice(index, nextMatch.index);

    let depth = 0;
    let end = nextMatch.index;
    for (; end < value.length; end += 1) {
      const char = value[end];
      if (char === "(") depth += 1;
      if (char === ")") {
        depth -= 1;
        if (depth === 0) {
          end += 1;
          break;
        }
      }
    }

    const token = value.slice(nextMatch.index, end);
    normalized += normalizeColorToken(token);
    index = end;
  }

  return normalized;
}

function normalizeExportClone(
  sourceRoot: HTMLElement,
  cloneRoot: HTMLElement | null,
) {
  if (!cloneRoot) return;

  const sourceElements = [sourceRoot, ...Array.from(sourceRoot.querySelectorAll("*"))];
  const cloneElements = [cloneRoot, ...Array.from(cloneRoot.querySelectorAll("*"))];

  for (let i = 0; i < Math.min(sourceElements.length, cloneElements.length); i += 1) {
    const sourceEl = sourceElements[i] as HTMLElement;
    const cloneEl = cloneElements[i] as HTMLElement;
    const computed = window.getComputedStyle(sourceEl);

    for (const propName of Array.from(computed)) {
      const rawValue = computed.getPropertyValue(propName);
      if (!rawValue) continue;
      const normalizedValue = normalizeCssColorFunctions(rawValue);
      if (normalizedValue !== rawValue) {
        cloneEl.style.setProperty(propName, normalizedValue);
      }
    }
  }
}

export const ExportButton: React.FC = () => {
  const showToast = useSlideStore((s) => s.showToast);
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const slideSize = useSlideStore((s) => s.presentation?.slideSize);
  const [busy, setBusy] = React.useState(false);
  const renderSize = React.useMemo(
    () => getRenderSlideSize(slideSize),
    [slideSize],
  );

  const handleExport = async () => {
    const el = document.getElementById(
      "slide-canvas-export",
    ) as HTMLElement | null;
    if (!el) {
      showToast("⚠️ Slide-Element nicht gefunden", "error");
      return;
    }
    setBusy(true);
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    try {
      const canvas = await html2canvas(el, {
        width: renderSize.width,
        height: renderSize.height,
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        onclone: (clonedDocument) => {
          normalizeExportClone(
            el,
            clonedDocument.getElementById("slide-canvas-export") as HTMLElement | null,
          );
        },
      });
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
      if (!blob) {
        throw new Error("toBlob returned null");
      }
      const url = URL.createObjectURL(blob);
      const filename = `slide-${activeSlideIndex + 1}.png`;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`📥 ${filename} wird heruntergeladen`);
    } catch (err) {
      console.error("Export failed:", err);
      showToast("⚠️ Export fehlgeschlagen", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="default"
      size="md"
      onClick={handleExport}
      disabled={busy}
      className="w-full"
    >
      <Download size={13} />
      {busy ? "Exportiere…" : "Als PNG exportieren"}
    </Button>
  );
};
