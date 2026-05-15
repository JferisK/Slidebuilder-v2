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
import { Textarea } from "./ui/textarea";
import { ExportButton } from "./ExportButton";
import { ProjectManager } from "./ProjectManager";
import { MasterPicker } from "./MasterPicker";
import { CopilotPromptDrawer } from "./CopilotPromptDrawer";
import {
  getRegisteredSlidesForRepoFolder,
  slideTemplates,
  getCodeSlide,
} from "@/slides/registry";
import type { Placeholder, SlideMaster } from "@/parser/pptxParser";
import {
  isContentElementId,
  parseContentElementId,
  describeContentElement,
} from "@/lib/contentElementId";
import { makeElementId, formatElementLabel } from "@/lib/elementId";

const ContentEditPanel: React.FC = () => {
  const selectedElementIds = useSlideStore((s) => s.selectedElementIds);
  const activeSlide = useActiveSlide();
  const activeLayout = useActiveLayout();
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const contentIndex = useSlideStore(
    (s) => s.contentElementIndex[activeSlide?.id ?? ""],
  );
  const clearElementSelection = useSlideStore((s) => s.clearElementSelection);
  const showToast = useSlideStore((s) => s.showToast);

  const [text, setText] = React.useState("");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerPrompt, setDrawerPrompt] = React.useState("");

  const contentIds = React.useMemo(
    () => selectedElementIds.filter(isContentElementId),
    [selectedElementIds],
  );

  React.useEffect(() => {
    if (contentIds.length === 0) setText("");
  }, [contentIds.length]);

  const drawer = (
    <CopilotPromptDrawer
      open={drawerOpen}
      initialPrompt={drawerPrompt}
      onClose={() => setDrawerOpen(false)}
      onCopied={async (value) => {
        try {
          await navigator.clipboard.writeText(value);
          showToast("✅ Prompt kopiert — in Copilot Chat einfügen (Strg+V)");
        } catch {
          showToast("⚠️ Clipboard nicht verfügbar", "error");
        }
        setDrawerOpen(false);
        clearElementSelection();
      }}
    />
  );

  if (contentIds.length === 0 || !activeSlide || !activeLayout) return drawer;

  const slideId = activeSlide.id;
  const slideOrdinal = activeSlideIndex + 1;

  const handleSubmit = () => {
    const intent = text.trim();
    if (!intent) return;
    const lines: string[] = [
      "Ich arbeite an der Datei src/components/DynamicSlide.tsx in einem React-Projekt (SlideForge).",
      "",
      "## Content-Element-Auswahl",
      `Slide-Id: "${slideId}"`,
      `Slide-Ordinal: ${slideOrdinal}`,
      `Layout: "${activeLayout.name}"`,
      "",
      "Der User hat auf dem Canvas die folgenden Inhalts-Elemente markiert.",
      "Jede id hat das Format `<slideId>::p<placeholderIdx>::<domPath>`.",
      "Bitte Änderungen ausschließlich an diesen Elementen vornehmen und per id referenzieren.",
      "",
    ];
    contentIds.forEach((id, i) => {
      const entry = contentIndex?.[id];
      const parsed = parseContentElementId(id);
      const ph = parsed
        ? activeLayout.placeholders.find((p) => p.idx === parsed.placeholderIdx)
        : undefined;
      lines.push(`  ${i + 1}. id="${id}"`);
      if (entry) {
        lines.push(
          `     type=${entry.type} · ${describeContentElement(entry.type, entry.textContent)}`,
        );
        lines.push(`     text="${entry.textContent}"`);
        lines.push(
          `     Position (norm): x=${entry.rect.x.toFixed(3)}, y=${entry.rect.y.toFixed(3)}, w=${entry.rect.w.toFixed(3)}, h=${entry.rect.h.toFixed(3)}`,
        );
      }
      if (ph) {
        const phId = makeElementId(slideId, ph.idx);
        lines.push(
          `     Eltern-Platzhalter: id="${phId}", label="${formatElementLabel(slideOrdinal, ph.type, ph.idx)}"`,
        );
      }
    });
    lines.push("");
    lines.push("## Gewünschte Änderung");
    lines.push(`"${intent}"`);
    lines.push("");
    lines.push(
      "Bitte schlage eine konkrete Änderung an der DynamicSlide-Komponente vor.",
      "Referenziere Elemente ausschließlich per `id`.",
      "Zeige den geänderten Code-Abschnitt.",
    );
    setDrawerPrompt(lines.join("\n").trim());
    setDrawerOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border border-[#3b82f6] bg-[var(--app-surface)] p-3">
        <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-[#3b82f6]">
          {contentIds.length === 1
            ? "1 Element ausgewählt"
            : `${contentIds.length} Elemente ausgewählt`}
        </div>
        <div className="mb-3 flex flex-col gap-1">
          {contentIds.slice(0, 5).map((id) => {
            const entry = contentIndex?.[id];
            return (
              <div key={id} className="truncate text-[11px] text-[var(--app-text)]">
                · {entry
                  ? describeContentElement(entry.type, entry.textContent)
                  : id}
              </div>
            );
          })}
          {contentIds.length > 5 && (
            <div className="text-[10px] text-[var(--app-muted)]">
              + {contentIds.length - 5} weitere
            </div>
          )}
        </div>
        <Textarea
          autoFocus
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Was soll geändert werden?"
          className="mb-2"
        />
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1"
            onClick={() => clearElementSelection()}
          >
            Auswahl leeren
          </Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={!text.trim()}
            onClick={handleSubmit}
          >
            Im Drawer öffnen
          </Button>
        </div>
      </div>
      {drawer}
    </>
  );
};

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

type BrandGuideInstructionPlatform = "claude" | "copilot";

const BRAND_GUIDE_PLATFORM_OPTIONS = [
  { value: "claude", label: "Claude Code" },
  { value: "copilot", label: "GitHub Copilot" },
] satisfies Array<{ value: BrandGuideInstructionPlatform; label: string }>;


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
  platform,
  brandGuidePath,
  master,
}: {
  platform: BrandGuideInstructionPlatform;
  brandGuidePath: string;
  master: SlideMaster;
}): string {
  const theme = master.theme.cssVars;
  const coreVars = Object.entries(theme)
    .filter(([key]) => key.startsWith("--slide-"))
    .map(([key, value]) => `  ${key}: ${value}`)
    .join("\n");
  const paletteLines = (master.theme.palette ?? [])
    .filter((e) => !["hlink", "folHlink"].includes(e.key))
    .map((e) => `  ${e.key} (${e.label}): ${e.color}`)
    .join("\n");

  const masterHeader = [
    `master_id: "${master.id}"`,
    `master_name: "${master.name}"`,
    `expected_path: "${brandGuidePath}"`,
  ].join("\n");

  const masterData = [
    "## Kern-CSS-Vars",
    coreVars,
    "",
    "## PowerPoint-Palette",
    paletteLines || "  (keine)",
  ].join("\n");

  if (platform === "claude") {
    return [
      "/create-brand-guide",
      "",
      "Ausführen im Repo-Root. Claude erstellt danach die Brand-Guide-Datei.",
      "",
      masterHeader,
      "",
      masterData,
    ].join("\n");
  }

  return [
    "create-brand-guide.prompt.md",
    "",
    "1. Copilot Chat → Agent Mode öffnen",
    "2. Prompt starten: .github/prompts/create-brand-guide.prompt.md",
    "3. Folgenden Template Context einfügen wenn gefragt:",
    "",
    masterHeader,
    "",
    masterData,
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
  const [brandGuideInstructionPlatform, setBrandGuideInstructionPlatform] =
    React.useState<BrandGuideInstructionPlatform>("claude");

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
  const [brandGuideExists, setBrandGuideExists] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false;
    fetch(`/${brandGuidePath}`, { method: "HEAD" })
      .then((res) => { if (!cancelled) setBrandGuideExists(res.ok); })
      .catch(() => { if (!cancelled) setBrandGuideExists(false); });
    return () => { cancelled = true; };
  }, [brandGuidePath]);
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
