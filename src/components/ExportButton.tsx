import * as React from "react";
import html2canvas from "html2canvas";
import { Download } from "lucide-react";
import { useSlideStore } from "@/store/slideStore";
import { getRenderSlideSize } from "@/lib/slideSize";
import { Button } from "./ui/button";

export const ExportButton: React.FC = () => {
  const setAnnotationsVisible = useSlideStore((s) => s.setAnnotationsVisible);
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
    setAnnotationsVisible(false);

    const previousTransform = el.style.transform;
    el.style.transform = "none";

    // Give React a tick to commit the visibility change before capture
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    try {
      const canvas = await html2canvas(el, {
        width: renderSize.width,
        height: renderSize.height,
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: null,
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
      el.style.transform = previousTransform;
      setAnnotationsVisible(true);
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
