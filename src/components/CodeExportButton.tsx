import * as React from "react";
import { Code2, Copy, Check } from "lucide-react";
import {
  useActiveLayout,
  useActiveMaster,
  useActiveSlide,
  useSlideStore,
  useActiveProject,
} from "@/store/slideStore";
import {
  generateSlideCode,
  suggestFilePath,
} from "@/lib/codeGenerator";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const CodeExportButton: React.FC = () => {
  const activeMaster = useActiveMaster();
  const activeLayout = useActiveLayout();
  const activeSlide = useActiveSlide();
  const activeProject = useActiveProject();
  const showToast = useSlideStore((s) => s.showToast);
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const saveSlideToProject = useSlideStore((s) => s.saveSlideToProject);

  const [open, setOpen] = React.useState(false);
  const [componentName, setComponentName] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setComponentName(`Slide${activeSlideIndex + 1}`);
  }, [activeSlideIndex]);

  if (!activeMaster || !activeLayout || !activeSlide) return null;

  const code = generateSlideCode({
    componentName: componentName || `Slide${activeSlideIndex + 1}`,
    layout: activeLayout,
    theme: activeMaster.theme,
    content: activeSlide.content,
  });

  const filePath = suggestFilePath(
    activeProject?.name ?? "default",
    "",
    componentName || `Slide${activeSlideIndex + 1}`,
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      showToast("✅ React-Code kopiert");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast("⚠️ Clipboard nicht verfügbar", "error");
    }
  };

  const handleSaveToProject = async () => {
    if (!activeProject) {
      showToast("Kein Projekt ausgewählt", "info");
      return;
    }
    await saveSlideToProject(activeProject.id, {
      folderId: null,
      name: componentName || `Slide${activeSlideIndex + 1}`,
      masterId: activeSlide.masterId,
      layoutId: activeSlide.layoutId,
      content: activeSlide.content,
      reactCode: code,
    });
  };

  if (!open) {
    return (
      <Button
        variant="secondary"
        size="md"
        onClick={() => setOpen(true)}
        className="w-full"
      >
        <Code2 size={13} /> Als React-Komponente
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
          React-Export
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[10px] text-[var(--app-muted)] hover:text-[var(--app-text)]"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] text-[var(--app-muted)]">
          Komponentenname
        </label>
        <Input
          value={componentName}
          onChange={(e) => setComponentName(e.target.value)}
          placeholder="SlideAgenda"
        />
      </div>

      <div
        className="text-[10px] text-[var(--app-muted)]"
        style={{ wordBreak: "break-all" }}
      >
        📁 {filePath}
      </div>

      <pre
        className="max-h-40 overflow-auto rounded bg-[#0a0a0a] p-2 text-[10px] text-[var(--app-text)] scrollbar-thin"
        style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
      >
        {code.slice(0, 800)}
        {code.length > 800 && "\n... (gekürzt)"}
      </pre>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="flex-1"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Kopiert!" : "Code kopieren"}
        </Button>
        {activeProject && (
          <Button
            size="sm"
            onClick={handleSaveToProject}
            className="flex-1"
          >
            Im Projekt speichern
          </Button>
        )}
      </div>
    </div>
  );
};
