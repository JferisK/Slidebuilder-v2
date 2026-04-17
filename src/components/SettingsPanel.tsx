import * as React from "react";
import { Trash2, Upload, HelpCircle } from "lucide-react";
import {
  useActiveLayout,
  useActiveMaster,
  useActiveSlide,
  useSlideStore,
} from "@/store/slideStore";
import { Select } from "./ui/select";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ContentEditor } from "./ContentEditor";
import { SlideList } from "./SlideList";
import { ExportButton } from "./ExportButton";
import { ProjectManager } from "./ProjectManager";

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--app-muted)]">
    {children}
  </div>
);

/** Small color swatch */
const Swatch: React.FC<{ color: string; label: string }> = ({
  color,
  label,
}) => (
  <div className="flex items-center gap-1.5" title={color}>
    <span
      style={{
        width: 14,
        height: 14,
        borderRadius: 3,
        background: color,
        border: "1px solid rgba(255,255,255,0.1)",
        flexShrink: 0,
      }}
    />
    <span className="truncate text-[10px] text-[var(--app-muted)]">
      {label}
    </span>
    <span className="ml-auto font-mono text-[9px] text-[var(--app-muted)]">
      {color}
    </span>
  </div>
);

export const SettingsPanel: React.FC = () => {
  const presentation = useSlideStore((s) => s.presentation);
  const activeMaster = useActiveMaster();
  const activeSlide = useActiveSlide();
  const activeLayout = useActiveLayout();
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const setActiveMaster = useSlideStore((s) => s.setActiveMaster);
  const setLayoutForSlide = useSlideStore((s) => s.setLayoutForSlide);

  const templates = useSlideStore((s) => s.templates);
  const activeTemplateId = useSlideStore((s) => s.activeTemplateId);
  const setActiveTemplate = useSlideStore((s) => s.setActiveTemplate);
  const deleteTemplate = useSlideStore((s) => s.deleteTemplate);
  const showToast = useSlideStore((s) => s.showToast);
  const setOnboardingDone = useSlideStore((s) => s.setOnboardingDone);

  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleUploadMore = () => fileRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pptx")) {
      showToast("Bitte eine .pptx-Datei auswählen", "error");
      return;
    }
    window.dispatchEvent(
      new CustomEvent("slideforge:upload", { detail: file }),
    );
    e.target.value = "";
  };

  if (!presentation || !activeMaster || !activeSlide || !activeLayout) {
    return null;
  }

  const masterOptions = presentation.masters.map((m) => ({
    value: m.id,
    label: m.name,
  }));
  const layoutOptions = activeMaster.layouts.map((l) => ({
    value: l.id,
    label: l.name,
  }));

  const templateOptions = templates.map((t) => ({
    value: t.id,
    label: `${t.name}`,
  }));

  const theme = activeMaster.theme.cssVars;

  return (
    <aside
      style={{ width: 300 }}
      className="flex h-full flex-none flex-col border-l border-[var(--app-border)] bg-[var(--app-panel)]"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-thin p-4">
        {/* Template switcher */}
        {templates.length > 0 && (
          <div>
            <SectionLabel>Vorlage (PPTX)</SectionLabel>
            <div className="flex items-center gap-1">
              <div className="flex-1">
                <Select
                  value={activeTemplateId ?? ""}
                  options={templateOptions}
                  onValueChange={(v) => setActiveTemplate(v)}
                />
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleUploadMore}
                title="Weitere Vorlage hochladen"
              >
                <Upload size={13} />
              </Button>
              {activeTemplateId && templates.length > 1 && (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    if (activeTemplateId) deleteTemplate(activeTemplateId);
                  }}
                  title="Vorlage entfernen"
                >
                  <Trash2 size={13} />
                </Button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pptx"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}

        <Separator />

        <div>
          <SectionLabel>Folienmaster</SectionLabel>
          <Select
            value={activeMaster.id}
            options={masterOptions}
            onValueChange={(v) => setActiveMaster(v)}
          />
        </div>

        {/* Theme colors */}
        <div>
          <SectionLabel>Farben (aus Master)</SectionLabel>
          <div className="flex flex-col gap-1 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] p-2">
            <Swatch color={theme["--slide-bg"]} label="Hintergrund" />
            <Swatch color={theme["--slide-primary"]} label="Primär" />
            <Swatch color={theme["--slide-secondary"]} label="Sekundär" />
            <Swatch color={theme["--slide-accent"]} label="Akzent" />
            <Swatch color={theme["--slide-text"]} label="Text" />
            <Swatch color={theme["--slide-text-muted"]} label="Text (gedämpft)" />
          </div>
          <div className="mt-1 text-[10px] text-[var(--app-muted)]">
            Heading: {theme["--slide-font-heading"]?.split(",")[0]}
            {" · "}Body: {theme["--slide-font-body"]?.split(",")[0]}
          </div>
        </div>

        <Separator />

        <div>
          <SectionLabel>Layout</SectionLabel>
          <Select
            value={activeLayout.id}
            options={layoutOptions}
            onValueChange={(v) => setLayoutForSlide(activeSlideIndex, v)}
          />
          <div className="mt-1 text-[10px] text-[var(--app-muted)]">
            {activeLayout.placeholders.length} Placeholder
            {activeLayout.placeholders.length !== 1 ? "" : ""}
            {activeLayout.placeholders.length > 0 && (
              <>
                :{" "}
                {activeLayout.placeholders
                  .map((p) => `${p.type}:${p.idx}`)
                  .join(", ")}
              </>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <SectionLabel>Inhalte</SectionLabel>
          <ContentEditor
            layout={activeLayout}
            slideIndex={activeSlideIndex}
            content={activeSlide.content}
          />
        </div>

        <Separator />

        <div>
          <SectionLabel>Folien</SectionLabel>
          <SlideList />
        </div>

        <Separator />

        <div>
          <SectionLabel>Projekt & Ordner</SectionLabel>
          <ProjectManager />
        </div>

        <Separator />

        <div>
          <SectionLabel>Export</SectionLabel>
          <ExportButton />
        </div>

        <Separator />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOnboardingDone(false)}
          className="w-full justify-start text-[var(--app-muted)]"
        >
          <HelpCircle size={12} /> Anleitung erneut anzeigen
        </Button>
      </div>
    </aside>
  );
};
