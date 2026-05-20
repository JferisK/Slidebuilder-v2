import * as React from "react";
import { FileDown } from "lucide-react";
import {
  useActiveLayout,
  useActiveSlide,
  useSlideStore,
} from "@/store/slideStore";
import { exportActiveSlideAsPptx } from "@/lib/pptxExporter";
import { Button } from "./ui/button";

export const PptxExportButton: React.FC = () => {
  const showToast = useSlideStore((s) => s.showToast);
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const template = useSlideStore((s) =>
    s.templates.find((t) => t.id === s.activeTemplateId),
  );
  const slide = useActiveSlide();
  const layout = useActiveLayout();
  const [busy, setBusy] = React.useState(false);

  const handleExport = async () => {
    if (!template || !slide || !layout) {
      showToast("⚠️ Keine Folie zum Export bereit", "error");
      return;
    }
    setBusy(true);
    try {
      const blob = await exportActiveSlideAsPptx({ template, slide, layout });
      const url = URL.createObjectURL(blob);
      const filename = `${template.name}-folie-${activeSlideIndex + 1}.pptx`;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`📥 ${filename} wird heruntergeladen`);
    } catch (err) {
      console.error("PPTX export failed:", err);
      showToast("⚠️ PowerPoint-Export fehlgeschlagen", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      variant="default"
      size="md"
      onClick={handleExport}
      disabled={busy || !template || !slide || !layout}
      className="w-full"
    >
      <FileDown size={13} />
      {busy ? "Exportiere…" : "Als PowerPoint exportieren"}
    </Button>
  );
};
