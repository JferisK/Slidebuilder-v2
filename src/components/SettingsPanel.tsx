import * as React from "react";
import {
  Trash2,
  Upload,
  HelpCircle,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import {
  getProjectSlidesForFolder,
  useActiveLayout,
  useActiveMaster,
  useActiveProject,
  useActiveSlide,
  useSlideStore,
} from "@/store/slideStore";
import { Select } from "./ui/select";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ExportButton } from "./ExportButton";
import { ProjectManager } from "./ProjectManager";
import {
  getCodeSlidesForRepoFolder,
  getRegisteredSlidesForRepoFolder,
  slideTemplates,
  getCodeSlide,
  getSlideTemplatesForRepoFolder,
  isTemplateId,
} from "@/slides/registry";
import type { Placeholder } from "@/parser/pptxParser";

const PLACEHOLDER_TYPE_LABELS: Record<string, string> = {
  title: "Titel",
  ctrTitle: "Titel (zentriert)",
  subTitle: "Untertitel",
  body: "Inhalt",
  dt: "Datum",
  ftr: "Fußzeile",
  sldNum: "Seitenzahl",
};

const PLACEHOLDER_SOURCE_LABELS: Record<string, string> = {
  layout: "Layout",
  master: "Master",
  fallback: "Fallback",
};

const SLOT_NONE = "__none__";

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[var(--app-muted)]">
    {children}
  </div>
);

const CollapsibleSection: React.FC<{
  label: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ label, defaultOpen = true, children }) => {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="mb-2 flex w-full items-center justify-between text-[10px] font-medium uppercase tracking-wider text-[var(--app-muted)]"
      >
        {label}
        <ChevronDown
          size={12}
          style={{
            transform: open ? "rotate(180deg)" : undefined,
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && children}
    </div>
  );
};

type PlaceholderListProps = {
  placeholders: Placeholder[];
  codeSlide: ReturnType<typeof getCodeSlide>;
  codeSlotMapping: Record<string, number>;
  hiddenIdxs: number[] | undefined;
  onAssignSlot: (slotKey: string, placeholderIdx: number | null) => void;
  onToggleHidden: (placeholderIdx: number) => void;
};

const PlaceholderList: React.FC<PlaceholderListProps> = ({
  placeholders,
  codeSlide,
  codeSlotMapping,
  hiddenIdxs,
  onAssignSlot,
  onToggleHidden,
}) => {
  const seen = new Set<number>();
  const unique = placeholders.filter((p) => {
    if (seen.has(p.idx)) return false;
    seen.add(p.idx);
    return true;
  });

  if (unique.length === 0) {
    return (
      <div className="text-[11px] text-[var(--app-muted)]">
        Dieses Layout hat keine Placeholder.
      </div>
    );
  }

  const slotOptions = codeSlide
    ? [
        { value: SLOT_NONE, label: "— nicht zugeordnet" },
        ...codeSlide.slots.map((s) => ({
          value: s.key,
          label: s.label,
        })),
      ]
    : null;

  const hidden = new Set(hiddenIdxs ?? []);

  return (
    <div className="flex flex-col gap-1 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] p-2">
      {unique.map((p) => {
        const typeLabel =
          PLACEHOLDER_TYPE_LABELS[p.type] ?? p.type;
        const isHidden = hidden.has(p.idx);
        const assignedSlotKey = codeSlide
          ? codeSlide.slots.find((s) => codeSlotMapping[s.key] === p.idx)?.key
          : undefined;
        const sourceLabel = p.source
          ? PLACEHOLDER_SOURCE_LABELS[p.source] ?? p.source
          : null;
        return (
          <div
            key={`${p.idx}-${p.type}`}
            className="flex items-center gap-1.5"
            style={{ opacity: isHidden ? 0.5 : 1 }}
          >
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] text-[var(--app-text)]">
                {typeLabel}
              </div>
              <div className="font-mono text-[9px] text-[var(--app-muted)]">
                {p.type}:{p.idx}
                {sourceLabel ? ` · ${sourceLabel}` : ""}
              </div>
            </div>
            {slotOptions && (
              <div style={{ width: 120 }}>
                <Select
                  value={assignedSlotKey ?? SLOT_NONE}
                  options={slotOptions}
                  onValueChange={(v) => {
                    if (v === SLOT_NONE) {
                      if (assignedSlotKey) onAssignSlot(assignedSlotKey, null);
                    } else {
                      onAssignSlot(v, p.idx);
                    }
                  }}
                />
              </div>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onToggleHidden(p.idx)}
              title={isHidden ? "Einblenden" : "Ausblenden"}
            >
              {isHidden ? <EyeOff size={13} /> : <Eye size={13} />}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

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

const PaletteFamily: React.FC<{
  label: string;
  color: string;
  variants: Array<{ label: string; color: string }>;
}> = ({ label, color, variants }) => (
  <div className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] p-2">
    <div className="mb-2 flex items-center gap-2">
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          background: color,
          border: "1px solid rgba(255,255,255,0.1)",
          flexShrink: 0,
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[10px] text-[var(--app-text)]">{label}</div>
        <div className="font-mono text-[9px] text-[var(--app-muted)]">{color}</div>
      </div>
    </div>
    <div className="grid grid-cols-5 gap-1">
      {variants.map((variant) => (
        <div key={`${label}-${variant.label}`} title={`${variant.label}: ${variant.color}`}>
          <div
            style={{
              height: 22,
              borderRadius: 4,
              background: variant.color,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
          <div className="mt-1 text-[8px] leading-tight text-[var(--app-muted)]">
            {variant.label}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const SettingsPanel: React.FC = () => {
  const presentation = useSlideStore((s) => s.presentation);
  const activeMaster = useActiveMaster();
  const activeSlide = useActiveSlide();
  const activeLayout = useActiveLayout();
  const activeProject = useActiveProject();
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const setActiveMaster = useSlideStore((s) => s.setActiveMaster);
  const setLayoutForSlide = useSlideStore((s) => s.setLayoutForSlide);

  const templates = useSlideStore((s) => s.templates);
  const activeTemplateId = useSlideStore((s) => s.activeTemplateId);
  const setActiveTemplate = useSlideStore((s) => s.setActiveTemplate);
  const deleteTemplate = useSlideStore((s) => s.deleteTemplate);
  const showToast = useSlideStore((s) => s.showToast);
  const setOnboardingDone = useSlideStore((s) => s.setOnboardingDone);
  const setCodeSlideForSlide = useSlideStore((s) => s.setCodeSlideForSlide);
  const loadProjectSlideIntoActive = useSlideStore(
    (s) => s.loadProjectSlideIntoActive,
  );
  const activeFolderId = useSlideStore((s) => s.activeFolderId);
  const activeRepoFolder = useSlideStore((s) => s.activeRepoFolder);
  const setCodeSlotMapping = useSlideStore((s) => s.setCodeSlotMapping);
  const clearLayoutSlotOverrides = useSlideStore(
    (s) => s.clearLayoutSlotOverrides,
  );
  const togglePlaceholderHidden = useSlideStore(
    (s) => s.togglePlaceholderHidden,
  );

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

  if (!presentation || !activeMaster || !activeSlide) {
    return null;
  }

  const activeCodeSlide = getCodeSlide(activeSlide.codeSlideId);
  const activeIsTemplate = isTemplateId(activeSlide.codeSlideId);
  const codeSlotMapping = activeSlide.codeSlotMapping ?? {};
  const repoCodeSlides = React.useMemo(
    () => getCodeSlidesForRepoFolder(activeRepoFolder),
    [activeRepoFolder],
  );
  const repoFolderSlides = React.useMemo(
    () => getRegisteredSlidesForRepoFolder(activeRepoFolder),
    [activeRepoFolder],
  );
  const repoTemplateSlides = React.useMemo(
    () => getSlideTemplatesForRepoFolder(activeRepoFolder),
    [activeRepoFolder],
  );
  const projectSlides = React.useMemo(
    () => getProjectSlidesForFolder(activeProject, activeFolderId),
    [activeFolderId, activeProject],
  );
  const activeProjectSlideId =
    projectSlides.some((slide) => slide.id === activeSlide.projectSlideId)
      ? activeSlide.projectSlideId
      : undefined;
  const activeRepoCodeSlideId =
    repoFolderSlides.some((slide) => slide.id === activeSlide.codeSlideId)
      ? activeSlide.codeSlideId
      : undefined;
  const projectSlideOptions = activeProject
    ? [
        { value: "__none__", label: "— Keine gespeicherte Folie" },
        ...projectSlides.map((slide) => ({
          value: slide.id,
          label: slide.name,
        })),
      ]
    : [
        { value: "__none__", label: "— Keine Repo-Folie" },
        ...repoFolderSlides.map((slide) => ({
          value: slide.id,
          label: slide.name,
        })),
      ];
  const slideTemplateOptions = [
    { value: "__none__", label: "— Keine Vorlage" },
    ...(activeProject ? slideTemplates : repoTemplateSlides).map((cs) => ({
      value: cs.id,
      label: cs.name,
    })),
  ];

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
  const hasLayoutOverrides = Boolean(
    activeTemplateId &&
      activeLayout &&
      templates.find((t) => t.id === activeTemplateId)?.layoutSlotOverrides?.[
        activeLayout.id
      ],
  );

  const theme = activeMaster.theme.cssVars;
  const palette = activeMaster.theme.palette ?? [];
  const basePalette = palette.filter((entry) =>
    ["lt1", "dk1", "lt2", "dk2"].includes(entry.key),
  );
  const accentPalette = palette.filter((entry) => entry.key.startsWith("accent"));
  const linkPalette = palette.filter((entry) =>
    ["hlink", "folHlink"].includes(entry.key),
  );

  return (
    <aside
      style={{ width: 300 }}
      className="flex h-full flex-none flex-col border-l border-[var(--app-border)] bg-[var(--app-panel)]"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-thin p-4">
        {/* Vorlage */}
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

        {/* Folienmaster */}
        <div>
          <SectionLabel>Folienmaster</SectionLabel>
          <Select
            value={activeMaster.id}
            options={masterOptions}
            onValueChange={(v) => setActiveMaster(v)}
          />
        </div>

        <Separator />

        {/* Layout */}
        {activeLayout && (
          <div>
            <SectionLabel>Layout</SectionLabel>
            <Select
              value={activeLayout.id}
              options={layoutOptions}
              onValueChange={(v) => setLayoutForSlide(activeSlideIndex, v)}
            />
          </div>
        )}

        <Separator />

        {/* Projektordner */}
        <div>
          <SectionLabel>Projektordner</SectionLabel>
          <ProjectManager />
        </div>

        <Separator />

        {/* Folienauswahl */}
        <div>
          <SectionLabel>Folienauswahl</SectionLabel>
          <Select
            value={(activeProject ? activeProjectSlideId : activeRepoCodeSlideId) ?? "__none__"}
            options={projectSlideOptions}
            disabled={!activeProject && !activeRepoFolder}
            onValueChange={(v) => {
              if (v === "__none__") {
                setCodeSlideForSlide(activeSlideIndex, null);
                return;
              }
              if (activeProject) {
                loadProjectSlideIntoActive(activeProject.id, v);
              } else {
                setCodeSlideForSlide(activeSlideIndex, v);
              }
            }}
          />
          <div className="mt-1 text-[10px] text-[var(--app-muted)]">
            {!activeProject
              ? activeRepoFolder
                ? repoFolderSlides.length > 0
                  ? `Repo-Ordner "${activeRepoFolder}" liefert ${repoFolderSlides.length} auswählbare Folie(n).`
                  : `Repo-Ordner "${activeRepoFolder}" enthält keine auswählbaren Folien.`
                : "Bitte zuerst ein Projekt oder einen Repo-Ordner auswählen."
              : projectSlides.length > 0
                ? activeFolderId
                  ? "Es werden nur Slides aus dem gewählten Ordner und seinen Unterordnern angeboten."
                  : "Es werden alle gespeicherten Slides des aktiven Projekts angeboten."
                : "Im aktuellen Filterbereich sind noch keine gespeicherten Slides vorhanden."}
          </div>
        </div>

        <Separator />

        {/* Vorlagen / Ideenvorschläge */}
        <CollapsibleSection
          label="Vorlagen / Ideenvorschläge"
          defaultOpen={false}
        >
          <Select
            value={
              activeIsTemplate ? activeSlide.codeSlideId ?? "__none__" : "__none__"
            }
            options={slideTemplateOptions}
            onValueChange={(v) =>
              setCodeSlideForSlide(
                activeSlideIndex,
                v === "__none__" ? null : v,
              )
            }
          />
          {!activeProject && activeRepoFolder && (
            <div className="mt-1 text-[10px] text-[var(--app-muted)]">
              {repoTemplateSlides.length > 0
                ? `Repo-Ordner "${activeRepoFolder}" liefert ${repoTemplateSlides.length} Vorlagen.`
                : `Repo-Ordner "${activeRepoFolder}" enthält keine Vorlagen.`}
            </div>
          )}
        </CollapsibleSection>

        <Separator />

        {/* Bereiche (einklappbar) */}
        {activeLayout && (
          <CollapsibleSection
            label={`Bereiche (${activeLayout.placeholders.length})`}
          >
            {activeCodeSlide && (
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="text-[10px] text-[var(--app-muted)]">
                  Zuordnungen werden für dieses Layout gespeichert.
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => clearLayoutSlotOverrides(activeSlideIndex)}
                  disabled={!hasLayoutOverrides}
                >
                  Automatik
                </Button>
              </div>
            )}
            <PlaceholderList
              placeholders={activeLayout.placeholders}
              codeSlide={activeCodeSlide}
              codeSlotMapping={codeSlotMapping}
              hiddenIdxs={activeSlide.hiddenPlaceholderIdxs}
              onAssignSlot={(slotKey, idx) =>
                setCodeSlotMapping(activeSlideIndex, slotKey, idx)
              }
              onToggleHidden={(idx) =>
                togglePlaceholderHidden(activeSlideIndex, idx)
              }
            />
            {activeCodeSlide ? (
              <div className="mt-1 text-[10px] text-[var(--app-muted)]">
                Ordne pro Zeile einen React-Slot einem Bereich zu oder blende
                ihn aus. Layout/Master/Fallback zeigen, woher die Geometrie
                kommt.
              </div>
            ) : (
              <div className="mt-1 text-[10px] text-[var(--app-muted)]">
                Blende Bereiche aus (z. B. Seitenzahl, Fußzeile).
              </div>
            )}
          </CollapsibleSection>
        )}

        <Separator />

        {/* Farben (einklappbar) */}
        <CollapsibleSection label="Farben (aus Master)" defaultOpen={false}>
          <div className="flex flex-col gap-2">
            <div className="rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] p-2">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
                Kernfarben
              </div>
              <div className="flex flex-col gap-1">
                <Swatch color={theme["--slide-bg"]} label="Hintergrund" />
                <Swatch color={theme["--slide-primary"]} label="Primär" />
                <Swatch color={theme["--slide-secondary"]} label="Sekundär" />
                <Swatch color={theme["--slide-accent"]} label="Akzent" />
                <Swatch color={theme["--slide-text"]} label="Text" />
                <Swatch
                  color={theme["--slide-text-muted"]}
                  label="Text (gedämpft)"
                />
              </div>
            </div>
            {basePalette.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
                  Theme-Basis
                </div>
                {basePalette.map((entry) => (
                  <PaletteFamily
                    key={entry.key}
                    label={entry.label}
                    color={entry.color}
                    variants={entry.variants}
                  />
                ))}
              </div>
            )}
            {accentPalette.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
                  Akzentfarben
                </div>
                {accentPalette.map((entry) => (
                  <PaletteFamily
                    key={entry.key}
                    label={entry.label}
                    color={entry.color}
                    variants={entry.variants}
                  />
                ))}
              </div>
            )}
            {linkPalette.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
                  Linkfarben
                </div>
                {linkPalette.map((entry) => (
                  <PaletteFamily
                    key={entry.key}
                    label={entry.label}
                    color={entry.color}
                    variants={entry.variants}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="mt-1 text-[10px] text-[var(--app-muted)]">
            Heading: {theme["--slide-font-heading"]?.split(",")[0]}
            {" · "}Body: {theme["--slide-font-body"]?.split(",")[0]}
          </div>
        </CollapsibleSection>

      </div>

      <div className="shrink-0 border-t border-[var(--app-border)] bg-[var(--app-panel)] p-4">
        <SectionLabel>Export</SectionLabel>
        <div className="flex flex-col gap-2">
          <ExportButton />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOnboardingDone(false)}
            className="w-full justify-start text-[var(--app-muted)]"
          >
            <HelpCircle size={12} /> Anleitung erneut anzeigen
          </Button>
        </div>
      </div>
    </aside>
  );
};
