import * as React from "react";
import {
  Clipboard,
  FileText,
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
  type StoredTemplate,
} from "@/store/slideStore";
import { Select } from "./ui/select";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ExportButton } from "./ExportButton";
import { PptxExportButton } from "./PptxExportButton";
import { ProjectManager } from "./ProjectManager";
import { MasterPicker } from "./MasterPicker";
import { ElementStylePanel } from "./ElementStylePanel";
import { CopilotBatchPanel } from "./CopilotBatchPanel";
import {
  getRegisteredSlidesForRepoFolder,
  slideTemplates,
  getCodeSlide,
} from "@/slides/registry";
import type { Placeholder, SlideMaster } from "@/parser/pptxParser";

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

const SettingsGroup: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
    <div className="mb-3 text-[10px] font-medium uppercase tracking-wider text-[var(--app-muted)]">
      {title}
    </div>
    <div className="flex flex-col gap-3">{children}</div>
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

function formatAspectRatio(widthEmu: number, heightEmu: number): string {
  const ratio = widthEmu / heightEmu;
  const knownRatios = [
    { label: "16:9", value: 16 / 9 },
    { label: "16:10", value: 16 / 10 },
    { label: "4:3", value: 4 / 3 },
  ];

  const match = knownRatios.find(
    (candidate) => Math.abs(candidate.value - ratio) < 0.02,
  );

  return match ? match.label : `custom ${widthEmu}x${heightEmu}`;
}

function formatPercent(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}

function buildTemplateContextExport({
  presentation,
  master,
  activeLayout,
  templateId,
  brandGuidePath,
  brandGuideExists,
}: {
  presentation: { slideSize: { widthEmu: number; heightEmu: number } };
  master: SlideMaster;
  activeLayout: PlaceholderListProps["placeholders"] extends never ? never : { id: string; name: string; placeholders: Placeholder[] };
  templateId?: string;
  brandGuidePath: string;
  brandGuideExists: boolean;
}): string {
  const { widthEmu, heightEmu } = presentation.slideSize;
  const themeLines = Object.entries(master.theme.cssVars)
    .map(([key, value]) => `  ${key}: ${JSON.stringify(value)}`)
    .join("\n");

  const paletteLines = (master.theme.palette ?? [])
    .filter((family) => !["hlink", "folHlink"].includes(family.key))
    .map((family) => {
      const variantLines = family.variants
        .map(
          (variant) =>
            `      - label: ${JSON.stringify(variant.label)}\n        color: ${JSON.stringify(variant.color)}`,
        )
        .join("\n");

      return [
        `  ${family.key}:`,
        `    label: ${JSON.stringify(family.label)}`,
        `    color: ${JSON.stringify(family.color)}`,
        "    variants:",
        variantLines || '      - label: "(none)"\n        color: ""',
      ].join("\n");
    })
    .join("\n");

  const formatPlaceholders = (placeholders: Placeholder[]) =>
    placeholders
      .map((placeholder) => [
        "    -",
        `      idx: ${placeholder.idx}`,
        `      type: ${JSON.stringify(placeholder.type)}`,
        `      x: ${formatPercent(placeholder.position.x)}`,
        `      y: ${formatPercent(placeholder.position.y)}`,
        `      w: ${formatPercent(placeholder.position.w)}`,
        `      h: ${formatPercent(placeholder.position.h)}`,
        `      source: ${JSON.stringify(placeholder.source ?? "unknown")}`,
      ].join("\n"))
      .join("\n");

  const layoutLines = master.layouts.slice(0, 10).map((layout) => [
    "  -",
    `    id: ${JSON.stringify(layout.id)}`,
    `    name: ${JSON.stringify(layout.name)}`,
    "    placeholders:",
    formatPlaceholders(layout.placeholders) || '    - idx: -1\n      type: "(none)"\n      x: 0\n      y: 0\n      w: 0\n      h: 0\n      source: "unknown"',
  ].join("\n")).join("\n");

  return [
    "# Template Context",
    'source: "settings-panel"',
    'template_context_repo_path: ".slidebuilder/template-context.md"',
    `template_id: ${JSON.stringify(templateId ?? "(unknown)")}`,
    `master_id: ${JSON.stringify(master.id)}`,
    `master_name: ${JSON.stringify(master.name)}`,
    `aspect_ratio: ${JSON.stringify(formatAspectRatio(widthEmu, heightEmu))}`,
    `slide_size_emu: { cx: ${widthEmu}, cy: ${heightEmu} }`,
    "theme:",
    themeLines,
    "powerpoint_palette:",
    paletteLines || "  {}",
    `brand_guide_path: ${JSON.stringify(brandGuidePath)}`,
    `expected_path: ${JSON.stringify(brandGuidePath)}`,
    `brand_guide_status: ${JSON.stringify(brandGuideExists ? "present" : "missing")}`,
    "active_layout:",
    `  id: ${JSON.stringify(activeLayout.id)}`,
    `  name: ${JSON.stringify(activeLayout.name)}`,
    "  placeholders:",
    formatPlaceholders(activeLayout.placeholders) || '    - idx: -1\n      type: "(none)"\n      x: 0\n      y: 0\n      w: 0\n      h: 0\n      source: "unknown"',
    "layouts:",
    layoutLines || "  []",
    "notes:",
    '  - Brand Guide covers theme, fonts and brand rules.',
    '  - Template Context adds slide size and placeholder geometry for fit checks.',
    '  - Use active_layout for one-slide creation or review tasks.',
  ].join("\n");
}

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

function copyablePalette(master: SlideMaster): string {
  const lines: string[] = [];
  for (const family of master.theme.palette ?? []) {
    lines.push(`  ${family.key} (${family.label}): ${family.color}`);
    for (const variant of family.variants) {
      lines.push(
        `    - ${variant.label}: ${variant.color}${variant.derived ? " (derived)" : ""}`,
      );
    }
  }
  return lines.join("\n");
}



function buildBrandGuideInstructions({
  brandGuidePath,
  templateContext,
}: {
  brandGuidePath: string;
  templateContext: string;
}): string {
  return [
    "Ich arbeite im Repo Slidebuilder-v2 und fuehre den einmaligen Template-Bootstrap fuer einen aktiven PPTX-Master aus.",
    "",
    "Arbeite direkt auf Basis dieses Prompts. Starte keinen separaten Slash-Command und verlange keinen zweiten Kontext-Export.",
    "Lies docs/skills/create-brand-guide.md fuer Brand-Guide-Konventionen und docs/skills/load-template-context.md fuer die erwartete Struktur des Template Context.",
    "Erstelle oder aktualisiere alle Repo-Artefakte, die spaetere Slide-Agents fuer create-slide brauchen.",
    "Schreibe oder aktualisiere zuerst .slidebuilder/template-context.md auf Basis des unten eingebetteten Template Context.",
    "Erstelle oder aktualisiere danach genau die Brand-Guide-Datei fuer den Master am unten angegebenen expected_path.",
    "Wenn zusaetzliche CI-Hinweise fehlen, frage genau einmal danach. Wenn keine kommen, leite den Guide aus dem PPTX-Master ab.",
    "Nach diesem Bootstrap sollen spaetere create-slide- und load-template-context-Aufrufe die benoetigten Infos direkt aus dem Repo lesen koennen, ohne erneuten Settings-Paste.",
    "",
    "## Optional CI Notes",
    "Wenn keine zusaetzlichen CI-Vorgaben vorliegen, diesen Block leer lassen oder ignorieren.",
    "- CI Notes: <optional>",
    "",
    "## Required Outputs",
    "1. .slidebuilder/template-context.md",
    `2. ${brandGuidePath}`,
    "",
    `## Brand Guide Target\nexpected_path: ${JSON.stringify(brandGuidePath)}`,
    "",
    templateContext,
  ].join("\n");
}

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

  const activeTemplate = activeTemplateId
    ? templates.find((t) => t.id === activeTemplateId)
    : undefined;

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
  const codeSlotMapping = activeSlide.codeSlotMapping ?? {};
  const repoFolderSlides = React.useMemo(
    () => getRegisteredSlidesForRepoFolder(activeRepoFolder),
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
  const activeSlideSelectionValue = activeProject
    ? activeProjectSlideId ?? activeSlide.codeSlideId
    : activeRepoCodeSlideId;
  const slideSelectionOptions = activeProject
    ? [
        { value: "__none__", label: "— Keine Folie ausgewählt" },
        ...projectSlides.map((slide) => ({
          value: slide.id,
          label: slide.name,
        })),
        ...slideTemplates.map((slide) => ({
          value: slide.id,
          label: `${slide.name} · Vorlage`,
        })),
      ]
    : [
        { value: "__none__", label: "— Keine Repo-Folie" },
        ...repoFolderSlides.map((slide) => ({
          value: slide.id,
          label: slide.kind === "template" ? `${slide.name} · Vorlage` : slide.name,
        })),
      ];

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
  const brandGuidePath = activeTemplate
    ? `.slidebuilder/brand-guides/${activeTemplate.id}/${activeMaster.id}.md`
    : `.slidebuilder/brand-guides/${activeMaster.id}.md`;
  const templateContextPath = ".slidebuilder/template-context.md";
  const [brandGuideExists, setBrandGuideExists] = React.useState(false);
  const [templateContextExists, setTemplateContextExists] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    fetch(`/${brandGuidePath}`, { method: "HEAD" })
      .then((res) => { if (!cancelled) setBrandGuideExists(res.ok); })
      .catch(() => { if (!cancelled) setBrandGuideExists(false); });
    return () => { cancelled = true; };
  }, [brandGuidePath]);
  React.useEffect(() => {
    let cancelled = false;
    fetch(`/${templateContextPath}`, { method: "HEAD" })
      .then((res) => { if (!cancelled) setTemplateContextExists(res.ok); })
      .catch(() => { if (!cancelled) setTemplateContextExists(false); });
    return () => { cancelled = true; };
  }, [templateContextPath]);
  const copyText = async (value: string, success: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast(success);
    } catch {
      showToast("Clipboard nicht verfügbar", "error");
    }
  };

  return (
    <aside
      style={{ width: 300 }}
      className="flex h-full flex-none flex-col border-l border-[var(--app-border)] bg-[var(--app-panel)]"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto scrollbar-thin p-4">
        <ElementStylePanel />
        <CopilotBatchPanel />
        <SettingsGroup title="PowerPoint-Vorlage (Kunde)">
          <div>
            <SectionLabel>PowerPoint-Datei</SectionLabel>
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
                title="Weitere PowerPoint-Datei (Kunden-Vorlage) hochladen"
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
                  title="Aktive Vorlage entfernen"
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
            <div className="mt-1 text-[10px] text-[var(--app-muted)]">
              {templates.length} Vorlage{templates.length === 1 ? "" : "n"} verfügbar · Master/Farben passen sich automatisch an
            </div>
          </div>

          <div>
            <SectionLabel>Folienmaster</SectionLabel>
            <MasterPicker
              masters={presentation.masters}
              activeId={activeMaster.id}
              onChange={(id) => setActiveMaster(id)}
            />
          </div>

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
        </SettingsGroup>

        <SettingsGroup title="Projekt & Folien">
          <div>
            <SectionLabel>Projektordner</SectionLabel>
            <ProjectManager />
          </div>

          <div>
            <SectionLabel>Folienauswahl</SectionLabel>
            <Select
              value={activeSlideSelectionValue ?? "__none__"}
              options={slideSelectionOptions}
              disabled={!activeProject && !activeRepoFolder}
              onValueChange={(v) => {
                if (v === "__none__") {
                  setCodeSlideForSlide(activeSlideIndex, null);
                  return;
                }
                if (activeProject && projectSlides.some((slide) => slide.id === v)) {
                  loadProjectSlideIntoActive(activeProject.id, v);
                  return;
                }
                setCodeSlideForSlide(activeSlideIndex, v);
              }}
            />
            <div className="mt-1 text-[10px] text-[var(--app-muted)]">
              {!activeProject
                ? activeRepoFolder
                  ? repoFolderSlides.length > 0
                    ? `Repo-Ordner "${activeRepoFolder}" liefert ${repoFolderSlides.length} auswählbare Folie(n).`
                    : `Repo-Ordner "${activeRepoFolder}" enthält keine auswählbaren Folien.`
                  : "Bitte zuerst ein Projekt oder einen Repo-Ordner auswählen."
                : activeFolderId
                  ? "Der gewählte Ordner liefert Projekt-Slides; Vorlagen stehen zusätzlich zentral in der Folienauswahl bereit."
                  : "Es werden Projekt-Slides und verfügbare Vorlagen in einer gemeinsamen Auswahl angeboten."}
            </div>
          </div>
        </SettingsGroup>

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

        <CollapsibleSection label="Brand Guide" defaultOpen={true}>
          <div className="flex flex-col gap-2">
            {brandGuideExists && templateContextExists ? (
              <div className="flex flex-col gap-1.5 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] p-2">
                <div className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--app-text)]">
                  <FileText size={11} />
                  Bootstrap aktiv fuer „{activeMaster.name}"
                </div>
                <div className="text-[9px] leading-snug text-[var(--app-muted)]">
                  Brand Guide und Template Context liegen bereits im Repo. Spaetere Slide-Agents koennen CD, Fonts, Farben und Layout-Geometrie direkt daraus lesen.
                </div>
                <div className="rounded border border-[var(--app-border)] bg-[var(--app-panel)] p-1 font-mono text-[8px] leading-snug text-[var(--app-muted)]">
                  {brandGuidePath}
                </div>
                <div className="rounded border border-[var(--app-border)] bg-[var(--app-panel)] p-1 font-mono text-[8px] leading-snug text-[var(--app-muted)]">
                  {templateContextPath}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 rounded-md border border-[var(--app-border)] bg-[var(--app-surface)] p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const templateContext = buildTemplateContextExport({
                      presentation,
                      master: activeMaster,
                      activeLayout: activeLayout ?? activeMaster.layouts[0],
                      templateId: activeTemplateId ?? undefined,
                      brandGuidePath,
                      brandGuideExists,
                    });

                    copyText(
                      buildBrandGuideInstructions({
                        brandGuidePath,
                        templateContext,
                      }),
                      "Brand-Guide-Prompt kopiert",
                    );
                  }}
                >
                  <Clipboard size={12} />
                  Prompt kopieren
                </Button>
                <div className="rounded border border-[var(--app-border)] bg-[var(--app-panel)] p-1.5 font-mono text-[9px] leading-snug text-[var(--app-muted)]">
                  {brandGuidePath}
                </div>
                <div className="rounded border border-[var(--app-border)] bg-[var(--app-panel)] p-1.5 font-mono text-[9px] leading-snug text-[var(--app-muted)]">
                  {templateContextPath}
                </div>
                <div className="text-[9px] leading-snug text-[var(--app-muted)]">
                  Einmal in Copilot einfuegen. Der Prompt soll sowohl den fehlenden Brand Guide als auch .slidebuilder/template-context.md erzeugen oder aktualisieren.
                </div>
              </div>
            )}
          </div>
        </CollapsibleSection>

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
          <PptxExportButton />
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
