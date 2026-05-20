import * as React from "react";
import { AlignCenter, AlignLeft, AlignRight, RotateCcw, X } from "lucide-react";
import {
  useActiveMaster,
  useSlideStore,
  type ElementStyleOverride,
} from "@/store/slideStore";
import {
  isContentElementId,
  parseContentElementId,
} from "@/lib/contentElementId";
import { parseElementId } from "@/lib/elementId";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const TEXT_TAGS = new Set([
  "p",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "li",
  "td",
  "blockquote",
  "strong",
  "em",
  "label",
  "small",
  "a",
]);

const PLACEHOLDER_TEXT_TYPES = new Set([
  "title",
  "ctrTitle",
  "subTitle",
  "body",
  "dt",
  "ftr",
  "sldNum",
]);

interface ResolvedElement {
  id: string;
  tag: string | null;
  isContent: boolean;
  isText: boolean;
  isContainer: boolean;
  computed: CSSStyleDeclaration | null;
}

function resolveElement(
  id: string,
  contentTagLookup: Record<string, string>,
  placeholderTypeLookup: Record<number, string>,
): ResolvedElement {
  let tag: string | null = null;
  let isContent = false;
  let isText = false;
  let isContainer = false;
  if (isContentElementId(id)) {
    isContent = true;
    tag = contentTagLookup[id] ?? null;
    if (tag && TEXT_TAGS.has(tag.toLowerCase())) isText = true;
    else isContainer = true;
  } else {
    const parsed = parseElementId(id);
    const phType = parsed ? placeholderTypeLookup[parsed.idx] : undefined;
    if (phType && PLACEHOLDER_TEXT_TYPES.has(phType)) isText = true;
    isContainer = true;
  }
  let computed: CSSStyleDeclaration | null = null;
  if (typeof document !== "undefined") {
    const node = document.querySelector<HTMLElement>(
      isContent
        ? `[data-content-id="${cssEscape(id)}"]`
        : `[data-element-id="${cssEscape(id)}"]`,
    );
    if (node) computed = window.getComputedStyle(node);
  }
  return { id, tag, isContent, isText, isContainer, computed };
}

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/(["\\])/g, "\\$1");
}

function rgbToHex(rgb: string): string | null {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  const toHex = (n: string) =>
    Math.max(0, Math.min(255, parseInt(n, 10)))
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(m[1])}${toHex(m[2])}${toHex(m[3])}`;
}

function parsePx(value: string | undefined): number | null {
  if (!value) return null;
  const m = value.match(/^(\d+(?:\.\d+)?)(px)?$/);
  return m ? parseFloat(m[1]) : null;
}

interface MixedNumeric {
  value: number | null;
  mixed: boolean;
}

interface MixedString {
  value: string | null;
  mixed: boolean;
}

function aggregateNumeric(
  resolved: ResolvedElement[],
  overrides: Record<string, ElementStyleOverride>,
  prop: "fontSize" | "borderRadius",
  computedProp: string,
): MixedNumeric {
  const values: number[] = [];
  for (const r of resolved) {
    const ov = overrides[r.id]?.[prop];
    const raw = ov ?? (r.computed ? r.computed.getPropertyValue(computedProp) : null);
    const px = parsePx(raw ?? undefined);
    if (px !== null) values.push(Math.round(px));
  }
  if (values.length === 0) return { value: null, mixed: false };
  const first = values[0];
  const allSame = values.every((v) => v === first);
  return { value: allSame ? first : null, mixed: !allSame };
}

function aggregateColor(
  resolved: ResolvedElement[],
  overrides: Record<string, ElementStyleOverride>,
  prop: "color" | "backgroundColor",
  computedProp: string,
): MixedString {
  const values: string[] = [];
  for (const r of resolved) {
    const ov = overrides[r.id]?.[prop];
    if (ov) {
      values.push(ov);
      continue;
    }
    if (!r.computed) continue;
    const computed = r.computed.getPropertyValue(computedProp);
    const hex = rgbToHex(computed) ?? computed;
    if (hex) values.push(hex);
  }
  if (values.length === 0) return { value: null, mixed: false };
  const first = values[0];
  const allSame = values.every((v) => v === first);
  return { value: allSame ? first : null, mixed: !allSame };
}

function aggregateExact<T extends string | number>(
  resolved: ResolvedElement[],
  overrides: Record<string, ElementStyleOverride>,
  prop: keyof ElementStyleOverride,
): { value: T | null; mixed: boolean } {
  const values: T[] = [];
  for (const r of resolved) {
    const v = overrides[r.id]?.[prop];
    if (v !== undefined) values.push(v as T);
  }
  if (values.length === 0) return { value: null, mixed: false };
  const first = values[0];
  const allSame = values.every((v) => v === first);
  return { value: allSame ? first : null, mixed: !allSame };
}

interface ElementStylePanelProps {
  /** Optional close handler (only shown if provided, e.g. in popover mode). */
  onClose?: () => void;
  /** Title shown in the header. */
  title?: string;
}

export const ElementStylePanel: React.FC<ElementStylePanelProps> = ({
  onClose,
  title = "Stil-Feinschliff",
}) => {
  const selectedElementIds = useSlideStore((s) => s.selectedElementIds);
  const elementStyleOverrides = useSlideStore(
    (s) => s.elementStyleOverrides,
  );
  const setElementStyleForMany = useSlideStore(
    (s) => s.setElementStyleForMany,
  );
  const clearElementStylesForMany = useSlideStore(
    (s) => s.clearElementStylesForMany,
  );
  const activeMaster = useActiveMaster();
  const activeSlideIndex = useSlideStore((s) => s.activeSlideIndex);
  const activeSlideId = useSlideStore(
    (s) => s.slides[s.activeSlideIndex]?.id,
  );
  const contentIndexForSlide = useSlideStore((s) =>
    activeSlideId ? s.contentElementIndex[activeSlideId] : undefined,
  );

  const layoutPlaceholders = useSlideStore((s) => {
    const slide = s.slides[s.activeSlideIndex];
    if (!slide || !s.presentation) return undefined;
    const master = s.presentation.masters.find((m) => m.id === slide.masterId);
    return master?.layouts.find((l) => l.id === slide.layoutId)?.placeholders;
  });

  const contentTagLookup = React.useMemo<Record<string, string>>(() => {
    const out: Record<string, string> = {};
    if (contentIndexForSlide) {
      for (const id of Object.keys(contentIndexForSlide)) {
        out[id] = contentIndexForSlide[id].type;
      }
    }
    return out;
  }, [contentIndexForSlide]);

  const placeholderTypeLookup = React.useMemo<Record<number, string>>(() => {
    const out: Record<number, string> = {};
    if (layoutPlaceholders) {
      for (const p of layoutPlaceholders) out[p.idx] = p.type;
    }
    return out;
  }, [layoutPlaceholders]);

  // Re-resolve on every render so getComputedStyle is fresh after an override
  // takes effect. Cheap because the list is small.
  const resolved = React.useMemo(
    () =>
      selectedElementIds.map((id) =>
        resolveElement(id, contentTagLookup, placeholderTypeLookup),
      ),
    // We deliberately include elementStyleOverrides so a style change triggers
    // a recomputation of the displayed value (slider thumb position etc.).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedElementIds,
      contentTagLookup,
      placeholderTypeLookup,
      elementStyleOverrides,
    ],
  );

  if (selectedElementIds.length === 0) return null;

  const anyTextLike = resolved.some((r) => r.isText);
  const anyContainerLike = resolved.some((r) => r.isContainer);

  // Aggregated values across the selection.
  const color = aggregateColor(resolved, elementStyleOverrides, "color", "color");
  const bg = aggregateColor(
    resolved,
    elementStyleOverrides,
    "backgroundColor",
    "background-color",
  );
  const fontSize = aggregateNumeric(
    resolved,
    elementStyleOverrides,
    "fontSize",
    "font-size",
  );
  const borderRadius = aggregateNumeric(
    resolved,
    elementStyleOverrides,
    "borderRadius",
    "border-radius",
  );
  const fontWeight = aggregateExact<number>(
    resolved,
    elementStyleOverrides,
    "fontWeight",
  );
  const textAlign = aggregateExact<"left" | "center" | "right">(
    resolved,
    elementStyleOverrides,
    "textAlign",
  );

  const themeSwatches = collectThemeSwatches(activeMaster?.theme.cssVars);

  const handlePatch = (patch: Partial<ElementStyleOverride>) => {
    setElementStyleForMany(selectedElementIds, patch);
  };

  const handleReset = () => {
    clearElementStylesForMany(selectedElementIds);
  };

  return (
    <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[10px] font-medium uppercase tracking-wider text-[var(--app-muted)]">
          {title} · {selectedElementIds.length}
          {selectedElementIds.length === 1 ? " Element" : " Elemente"}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-[var(--app-muted)] hover:text-[var(--app-text)]"
            aria-label="Schließen"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {anyTextLike && (
        <Section label="Farbe">
          <ColorRow
            value={color.value}
            mixed={color.mixed}
            swatches={themeSwatches}
            onChange={(v) => handlePatch({ color: v ?? undefined })}
            onClear={() => handlePatch({ color: undefined })}
            slide={activeSlideIndex}
          />
        </Section>
      )}

      {anyContainerLike && (
        <Section label="Hintergrund">
          <ColorRow
            value={bg.value}
            mixed={bg.mixed}
            swatches={themeSwatches}
            onChange={(v) => handlePatch({ backgroundColor: v ?? undefined })}
            onClear={() => handlePatch({ backgroundColor: undefined })}
            slide={activeSlideIndex}
            allowTransparent
          />
        </Section>
      )}

      {anyTextLike && (
        <Section label={`Schriftgröße${fontSize.mixed ? " · —" : fontSize.value !== null ? ` · ${fontSize.value} px` : ""}`}>
          <NumericSlider
            min={8}
            max={72}
            step={1}
            value={fontSize.value}
            mixed={fontSize.mixed}
            unit="px"
            onChange={(n) =>
              handlePatch({
                fontSize: n === null ? undefined : `${n}px`,
              })
            }
          />
        </Section>
      )}

      {anyTextLike && (
        <Section label="Schriftstärke">
          <div className="flex gap-1">
            {[400, 600, 700].map((w) => (
              <Button
                key={w}
                size="sm"
                variant={
                  !fontWeight.mixed && fontWeight.value === w ? "default" : "outline"
                }
                className="flex-1"
                onClick={() => handlePatch({ fontWeight: w })}
              >
                {w}
              </Button>
            ))}
          </div>
        </Section>
      )}

      {anyTextLike && (
        <Section label="Ausrichtung">
          <div className="flex gap-1">
            {(
              [
                { value: "left" as const, Icon: AlignLeft },
                { value: "center" as const, Icon: AlignCenter },
                { value: "right" as const, Icon: AlignRight },
              ]
            ).map(({ value, Icon }) => (
              <Button
                key={value}
                size="icon"
                variant={
                  !textAlign.mixed && textAlign.value === value
                    ? "default"
                    : "outline"
                }
                className="flex-1"
                onClick={() => handlePatch({ textAlign: value })}
              >
                <Icon size={13} />
              </Button>
            ))}
          </div>
        </Section>
      )}

      <Section label={`Ecken-Radius${borderRadius.mixed ? " · —" : borderRadius.value !== null ? ` · ${borderRadius.value} px` : ""}`}>
        <NumericSlider
          min={0}
          max={32}
          step={1}
          value={borderRadius.value}
          mixed={borderRadius.mixed}
          unit="px"
          onChange={(n) =>
            handlePatch({
              borderRadius: n === null ? undefined : `${n}px`,
            })
          }
        />
      </Section>

      <div className="mt-3 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={handleReset}
        >
          <RotateCcw size={11} /> Zurücksetzen
        </Button>
      </div>
    </div>
  );
};

const Section: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className="mb-3 last:mb-0">
    <div className="mb-1.5 text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
      {label}
    </div>
    {children}
  </div>
);

const NumericSlider: React.FC<{
  min: number;
  max: number;
  step: number;
  value: number | null;
  mixed: boolean;
  unit: string;
  onChange: (n: number | null) => void;
}> = ({ min, max, step, value, mixed, unit, onChange }) => {
  const sliderValue = mixed ? min : value ?? min;
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        className="h-1 flex-1 accent-[var(--app-accent)]"
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={mixed ? { opacity: 0.5 } : undefined}
      />
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        value={mixed ? "" : value ?? ""}
        placeholder={mixed ? "—" : ""}
        className="w-16"
        onChange={(e) => {
          const raw = e.target.value;
          if (raw === "") {
            onChange(null);
            return;
          }
          const n = parseInt(raw, 10);
          if (!Number.isNaN(n)) onChange(n);
        }}
      />
      <span className="text-[10px] text-[var(--app-muted)]">{unit}</span>
    </div>
  );
};

const ColorRow: React.FC<{
  value: string | null;
  mixed: boolean;
  swatches: ThemeSwatch[];
  onChange: (hex: string | null) => void;
  onClear: () => void;
  slide: number;
  allowTransparent?: boolean;
}> = ({ value, mixed, swatches, onChange, onClear, slide, allowTransparent }) => {
  const colorInputId = `color-input-${slide}`;
  return (
    <div>
      <div className="mb-2 grid grid-cols-6 gap-1.5">
        {swatches.map((s) => {
          const isActive = !mixed && value && sameColor(value, s.color);
          return (
            <button
              key={s.key}
              type="button"
              title={`${s.label} · ${s.color}`}
              onClick={() => onChange(s.color)}
              className="h-6 w-6 rounded border"
              style={{
                background: s.color,
                borderColor: isActive
                  ? "var(--app-accent)"
                  : "var(--app-border)",
                boxShadow: isActive
                  ? "0 0 0 2px var(--app-accent)"
                  : undefined,
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <label
          htmlFor={colorInputId}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded border border-[var(--app-border)]"
          style={{ background: !mixed && value ? value : "transparent" }}
          title="Eigene Farbe wählen"
        >
          <input
            id={colorInputId}
            type="color"
            value={!mixed && value && value.startsWith("#") ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="h-0 w-0 opacity-0"
          />
        </label>
        <Input
          value={mixed ? "" : value ?? ""}
          placeholder={mixed ? "—" : "#hex"}
          className="flex-1"
          onChange={(e) => {
            const v = e.target.value.trim();
            if (v === "") onChange(null);
            else onChange(v);
          }}
        />
        {allowTransparent && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onClear}
            title="Transparent / kein Hintergrund"
          >
            ✕
          </Button>
        )}
      </div>
    </div>
  );
};

interface ThemeSwatch {
  key: string;
  label: string;
  color: string;
}

function collectThemeSwatches(
  cssVars: Record<string, string> | undefined,
): ThemeSwatch[] {
  if (!cssVars) return [];
  const out: ThemeSwatch[] = [];
  const coreOrder: Array<[string, string]> = [
    ["--slide-primary", "Primär"],
    ["--slide-accent", "Akzent"],
    ["--slide-secondary", "Sekundär"],
    ["--slide-text", "Text"],
    ["--slide-text-muted", "Text gedämpft"],
    ["--slide-bg", "Hintergrund"],
  ];
  for (const [key, label] of coreOrder) {
    const c = cssVars[key];
    if (c) out.push({ key, label, color: c });
  }
  for (let i = 1; i <= 6; i++) {
    const key = `--ppt-accent${i}`;
    const c = cssVars[key];
    if (c) out.push({ key, label: `Akzent ${i}`, color: c });
  }
  return out;
}

function sameColor(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}
