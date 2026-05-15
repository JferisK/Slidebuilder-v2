import * as React from "react";
import { FolderOpen } from "lucide-react";
import { parsePptx } from "./parser/pptxParser";
import { UploadScreen } from "./components/UploadScreen";
import { SlideCanvas } from "./components/SlideCanvas";
import { SettingsPanel } from "./components/SettingsPanel";
import { Toast } from "./components/Toast";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { useSlideStore, type StoredTemplate } from "./store/slideStore";

const App: React.FC = () => {
  const presentation = useSlideStore((s) => s.presentation);
  const onboardingDone = useSlideStore((s) => s.onboardingDone);
  const loadTemplates = useSlideStore((s) => s.loadTemplates);
  const loadProjects = useSlideStore((s) => s.loadProjects);
  const addTemplate = useSlideStore((s) => s.addTemplate);
  const setParsedPresentation = useSlideStore(
    (s) => s.setParsedPresentation,
  );
  const showToast = useSlideStore((s) => s.showToast);
  const templates = useSlideStore((s) => s.templates);

  // Load persisted templates + projects on mount
  React.useEffect(() => {
    void loadTemplates();
    void loadProjects();
  }, [loadTemplates, loadProjects]);

  // Listen for additional upload events from SettingsPanel
  React.useEffect(() => {
    const handler = async (e: Event) => {
      const file = (e as CustomEvent<File>).detail;
      if (!file) return;
      try {
        const [parsed, arrayBuffer] = await Promise.all([
          parsePptx(file),
          file.arrayBuffer(),
        ]);
        const tpl: StoredTemplate = {
          id: Math.random().toString(36).slice(2, 10),
          name: file.name.replace(/\.pptx$/i, ""),
          fileName: file.name,
          uploadedAt: Date.now(),
          pptxData: arrayBuffer,
          parsed,
        };
        await addTemplate(tpl);
        setParsedPresentation(parsed);
        useSlideStore.getState().setActiveTemplate(tpl.id);
        showToast(`✅ "${tpl.name}" hinzugefügt`);
      } catch {
        showToast("⚠️ Import fehlgeschlagen", "error");
      }
    };
    window.addEventListener("slideforge:upload", handler);
    return () => window.removeEventListener("slideforge:upload", handler);
  }, [addTemplate, setParsedPresentation, showToast]);

  // Onboarding overlay
  if (!onboardingDone) {
    return (
      <>
        <OnboardingScreen />
        <Toast />
      </>
    );
  }

  if (!presentation) {
    return (
      <>
        <UploadScreen />
        <Toast />
      </>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-[var(--app-bg)] text-[var(--app-text)]">
      <header className="flex h-10 flex-none items-center gap-2 border-b border-[var(--app-border)] bg-[var(--app-panel)] px-4">
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 9999,
            background: "var(--app-accent)",
            display: "inline-block",
          }}
        />
        <span className="text-xs font-semibold tracking-tight">
          SlideForge
        </span>
        <button
          type="button"
          onClick={() => {
            useSlideStore.setState({ presentation: null });
          }}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-[10px] text-[var(--app-text)] transition-colors hover:border-[var(--app-accent)]"
          title="Andere Kunden-Vorlage wählen oder neue hochladen"
        >
          <FolderOpen size={11} />
          Vorlagen verwalten
          <span className="ml-1 rounded-sm bg-[var(--app-panel)] px-1 text-[9px] text-[var(--app-muted)]">
            {templates.length}
          </span>
        </button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main
          className="flex flex-1 items-center justify-center overflow-auto scrollbar-thin"
          style={{ background: "var(--app-canvas)", padding: 32 }}
        >
          <div style={{ width: "100%", maxWidth: 1280 }}>
            <SlideCanvas />
          </div>
        </main>
        <SettingsPanel />
      </div>
      <Toast />
    </div>
  );
};

export default App;
