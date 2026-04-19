import * as React from "react";
import {
  type Placeholder,
  type SlideLayout,
  type SlideSize,
  type SlideTheme,
  PPTX_PARSER_VERSION,
  parsePptx,
} from "./parser/pptxParser";
import { UploadScreen } from "./components/UploadScreen";
import { SlideCanvas } from "./components/SlideCanvas";
import { DynamicSlide } from "./components/DynamicSlide";
import { ZoomToolbar } from "./components/ZoomToolbar";
import { SettingsPanel } from "./components/SettingsPanel";
import { Toast } from "./components/Toast";
import { OnboardingScreen } from "./components/OnboardingScreen";
import { useSlideStore, type StoredTemplate } from "./store/slideStore";
import { getCodeSlide } from "./slides/registry";

const PREVIEW_SLIDE_SIZE: SlideSize = {
  widthEmu: 9144000,
  heightEmu: 5143500,
};

const PREVIEW_THEME: SlideTheme = {
  cssVars: {
    "--slide-bg": "#ffffff",
    "--slide-primary": "#1e49e2",
    "--slide-secondary": "#e5e5e5",
    "--slide-accent": "#00338d",
    "--slide-text": "#000000",
    "--slide-text-muted": "#666666",
    "--slide-font-heading": "\"KPMG Bold\", Calibri, sans-serif",
    "--slide-font-body": "Arial, Calibri, sans-serif",
    "--ppt-lt1": "#ffffff",
    "--ppt-dk1": "#000000",
    "--ppt-lt2": "#e5e5e5",
    "--ppt-dk2": "#00338d",
    "--ppt-accent1": "#1e49e2",
    "--ppt-accent2": "#00338d",
    "--ppt-accent3": "#0c233c",
    "--ppt-accent4": "#00b8f5",
    "--ppt-accent5": "#7213ea",
    "--ppt-accent6": "#fd349c",
    "--ppt-hlink": "#00b8f5",
    "--ppt-folHlink": "#098e7e",
  },
  palette: [],
};

const PREVIEW_LAYOUT: SlideLayout = {
  id: "preview-one-column-text",
  name: "One Column Text",
  placeholders: [
    {
      idx: 0,
      type: "title",
      position: { x: 8.2, y: 6.3, w: 83.7, h: 7.8 },
      source: "layout",
    } satisfies Placeholder,
    {
      idx: 10,
      type: "body",
      position: { x: 8.2, y: 19.4, w: 83.7, h: 66.3 },
      source: "layout",
    } satisfies Placeholder,
  ],
};

const PreviewScreen: React.FC<{ slideId: string }> = ({ slideId }) => {
  const codeSlide = getCodeSlide(slideId);
  const codeSlotsByIdx = React.useMemo(() => {
    if (!codeSlide) return undefined;
    const mapping: Record<string, React.FC> = {};
    for (const slot of codeSlide.slots) {
      if (slot.key === "title") mapping["0"] = slot.Component;
      if (slot.key === "content") mapping["10"] = slot.Component;
    }
    return mapping;
  }, [codeSlide]);

  if (!codeSlide) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--app-canvas)] text-[var(--app-text)]">
        Unbekannte Preview-Folie: {slideId}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--app-canvas)",
        padding: 24,
      }}
    >
      <div data-preview-slide-id={slideId}>
        <DynamicSlide
          layout={PREVIEW_LAYOUT}
          theme={PREVIEW_THEME}
          slideSize={PREVIEW_SLIDE_SIZE}
          content={{}}
          slideId={`preview-${slideId}`}
          slideOrdinal={1}
          showPlaceholderOutlines={false}
          codeSlots={codeSlotsByIdx}
        />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const previewSlideId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("preview")
      : null;
  const presentation = useSlideStore((s) => s.presentation);
  const onboardingDone = useSlideStore((s) => s.onboardingDone);
  const loadTemplates = useSlideStore((s) => s.loadTemplates);
  const loadProjects = useSlideStore((s) => s.loadProjects);
  const templates = useSlideStore((s) => s.templates);
  const activeTemplateId = useSlideStore((s) => s.activeTemplateId);
  const projects = useSlideStore((s) => s.projects);
  const activeProjectId = useSlideStore((s) => s.activeProjectId);
  const setActiveTemplate = useSlideStore((s) => s.setActiveTemplate);
  const addTemplate = useSlideStore((s) => s.addTemplate);
  const setParsedPresentation = useSlideStore(
    (s) => s.setParsedPresentation,
  );
  const showToast = useSlideStore((s) => s.showToast);

  if (previewSlideId) {
    return <PreviewScreen slideId={previewSlideId} />;
  }

  // Load persisted templates + projects on mount
  React.useEffect(() => {
    void loadTemplates();
    void loadProjects();
  }, [loadTemplates, loadProjects]);

  React.useEffect(() => {
    const activeProject = projects.find((project) => project.id === activeProjectId);
    if (!activeProject) return;
    if (activeTemplateId === activeProject.templateId) return;
    if (templates.some((template) => template.id === activeProject.templateId)) {
      setActiveTemplate(activeProject.templateId);
    }
  }, [
    activeProjectId,
    activeTemplateId,
    projects,
    setActiveTemplate,
    templates,
  ]);

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
          parserVersion: PPTX_PARSER_VERSION,
          pptxData: arrayBuffer,
          parsed,
          layoutSlotOverrides: {},
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
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main
          className="flex flex-1 flex-col items-center overflow-auto scrollbar-thin"
          style={{ background: "var(--app-canvas)", padding: 32, gap: 12 }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 1280,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <ZoomToolbar />
          </div>
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
