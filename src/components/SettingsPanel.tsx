import * as React from "react";
import {
  Trash2,
  Upload,
  HelpCircle,
  Code2,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import {
  useActiveLayout,
  useActiveMaster,
  useActiveSlide,
  useSlideStore,
} from "@/store/slideStore";
import { Select } from "./ui/select";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { ExportButton } from "./ExportButton";
import { ProjectManager } from "./ProjectManager";
import { codeSlides, getCodeSlide } from "@/slides/registry";
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
  const setCodeSlideForSlide = useSlideStore((s) => s.setCodeSlideForSlide);
  const setCodeSlotMapping = useSlideStore((s) => s.setCodeSlotMapping);
  const togglePlaceholderHidden = useSlideStore(
    (s) => s.togglePlaceholderHidden,
  );
  const addSlide = useSlideStore((s) => s.addSlide);

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
  const codeSlotMapping = activeSlide.codeSlotMapping ?? {};
  const codeSlideOptions = [
    { value: "__none__", label: "— Keine (nur Platzhalter-Text)" },
    ...codeSlides.map((cs) => ({ value: cs.id, label: cs.name })),
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

  const theme = activeMaster.theme.cssVars;

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
            value={activeSlide.codeSlideId ?? "__none__"}
            options={codeSlideOptions}
            onValueChange={(v) =>
              setCodeSlideForSlide(
                activeSlideIndex,
                v === "__none__" ? null : v,
              )
            }
          />
          <div className="mt-1 text-[10px] text-[var(--app-muted)]">
            {activeCodeSlide
              ? `Slots: ${Object.keys(activeCodeSlide.slots)
                  .map((k) => `:${k}`)
                  .join(", ")} — Layout + Master liefern Position & Theme.`
              : "Eine React-Datei füllt Placeholder (z. B. title:0, body:1) im Layout."}
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              const first = codeSlides[0];
              if (first) addSlide(first.id);
            }}
            className="mt-2 w-full"
          >
            <Code2 size={12} /> Neue Folie mit React-Inhalt
          </Button>
        </div>

        <Separator />

        {/* Bereiche (einklappbar) */}
        {activeLayout && (
          <CollapsibleSection
            label={`Bereiche (${activeLayout.placeholders.length})`}
          >
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
                Ordne pro Zeile einen React-Slot (Titel/Inhalt) einem
                Bereich zu oder blende ihn aus.
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
        </CollapsibleSection>

        <Separator />

        {/* Export */}
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
