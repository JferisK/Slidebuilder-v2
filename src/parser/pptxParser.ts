import JSZip from "jszip";

// ---------- Types -----------------------------------------------------------

export const PPTX_PARSER_VERSION = 3;

export interface ParsedPresentation {
  masters: SlideMaster[];
  slideSize: SlideSize;
}

export interface SlideMaster {
  id: string;
  name: string;
  theme: SlideTheme;
  layouts: SlideLayout[];
}

export interface SlideTheme {
  cssVars: Record<string, string> & {
    "--slide-bg": string;
    "--slide-primary": string;
    "--slide-secondary": string;
    "--slide-accent": string;
    "--slide-text": string;
    "--slide-text-muted": string;
    "--slide-font-heading": string;
    "--slide-font-body": string;
  };
  palette: ThemeColorFamily[];
}

export interface ThemeColorVariant {
  label: string;
  color: string;
  derived?: boolean;
}

export interface ThemeColorFamily {
  key: string;
  label: string;
  color: string;
  variants: ThemeColorVariant[];
}

export interface SlideSize {
  widthEmu: number;
  heightEmu: number;
}

export interface SlideLayout {
  id: string;
  name: string;
  placeholders: Placeholder[];
}

export type PlaceholderType =
  | "title"
  | "body"
  | "subTitle"
  | "dt"
  | "ftr"
  | "sldNum"
  | string;

export interface Placeholder {
  idx: number;
  type: PlaceholderType;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
  source?: "layout" | "master" | "fallback";
  defaultText?: string;
}

interface ParsedPlaceholderSeed {
  idx: number;
  rawIdx: number | null;
  type: PlaceholderType;
  position: Placeholder["position"] | null;
}

// ---------- Constants -------------------------------------------------------

const FALLBACK_SLIDE_SIZE: SlideSize = {
  widthEmu: 9144000,
  heightEmu: 5143500,
};

const FALLBACK_POSITIONS: Record<string, Placeholder["position"]> = {
  title: { x: 5, y: 5, w: 90, h: 20 },
  ctrTitle: { x: 5, y: 5, w: 90, h: 20 },
  subTitle: { x: 5, y: 55, w: 90, h: 15 },
  body: { x: 5, y: 25, w: 90, h: 65 },
  dt: { x: 0, y: 92, w: 20, h: 6 },
  ftr: { x: 30, y: 92, w: 40, h: 6 },
  sldNum: { x: 80, y: 92, w: 20, h: 6 },
};

const FALLBACK_THEME: SlideTheme = {
  cssVars: {
    "--slide-bg": "#ffffff",
    "--slide-primary": "#1f4e79",
    "--slide-secondary": "#f2f2f2",
    "--slide-accent": "#c00000",
    "--slide-text": "#1a1a1a",
    "--slide-text-muted": "#666666",
    "--slide-font-heading": "Calibri, sans-serif",
    "--slide-font-body": "Calibri, sans-serif",
  },
  palette: [],
};

const THEME_COLOR_ORDER = [
  "lt1",
  "dk1",
  "lt2",
  "dk2",
  "accent1",
  "accent2",
  "accent3",
  "accent4",
  "accent5",
  "accent6",
  "hlink",
  "folHlink",
] as const;

type ThemeColorKey = (typeof THEME_COLOR_ORDER)[number];

const THEME_COLOR_LABELS: Record<ThemeColorKey, string> = {
  lt1: "Hintergrund 1",
  dk1: "Text 1",
  lt2: "Hintergrund 2",
  dk2: "Text 2",
  accent1: "Akzent 1",
  accent2: "Akzent 2",
  accent3: "Akzent 3",
  accent4: "Akzent 4",
  accent5: "Akzent 5",
  accent6: "Akzent 6",
  hlink: "Hyperlink",
  folHlink: "Besuchter Link",
};

const FALLBACK_THEME_COLORS: Record<ThemeColorKey, string> = {
  lt1: "#ffffff",
  dk1: "#1a1a1a",
  lt2: "#f2f2f2",
  dk2: "#666666",
  accent1: "#1f4e79",
  accent2: "#c00000",
  accent3: "#5b9bd5",
  accent4: "#70ad47",
  accent5: "#ed7d31",
  accent6: "#7030a0",
  hlink: "#0563c1",
  folHlink: "#954f72",
};

// ---------- Helpers ---------------------------------------------------------

function hexFromSrgbClr(el: Element | null): string | null {
  if (!el) return null;
  const srgb = el.getElementsByTagNameNS("*", "srgbClr")[0];
  if (srgb) {
    const val = srgb.getAttribute("val");
    if (val) return `#${val.toLowerCase()}`;
  }
  const sys = el.getElementsByTagNameNS("*", "sysClr")[0];
  if (sys) {
    const last = sys.getAttribute("lastClr");
    if (last) return `#${last.toLowerCase()}`;
  }
  return null;
}

function parseHex(hex: string): [number, number, number] | null {
  const clean = hex.replace(/^#/, "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return null;
  return [r, g, b];
}

function toHex(n: number): string {
  return Math.max(0, Math.min(255, Math.round(n)))
    .toString(16)
    .padStart(2, "0");
}

function blendHex(fg: string, bg: string, alpha: number): string {
  const a = parseHex(fg);
  const b = parseHex(bg);
  if (!a || !b) return fg;
  const r = a[0] * alpha + b[0] * (1 - alpha);
  const g = a[1] * alpha + b[1] * (1 - alpha);
  const bl = a[2] * alpha + b[2] * (1 - alpha);
  return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
}

function buildPowerPointVariants(color: string): ThemeColorVariant[] {
  return [
    {
      label: "Heller 80%",
      color: blendHex(color, "#ffffff", 0.2),
      derived: true,
    },
    {
      label: "Heller 60%",
      color: blendHex(color, "#ffffff", 0.4),
      derived: true,
    },
    {
      label: "Heller 40%",
      color: blendHex(color, "#ffffff", 0.6),
      derived: true,
    },
    {
      label: "Dunkler 25%",
      color: blendHex(color, "#000000", 0.75),
      derived: true,
    },
    {
      label: "Dunkler 50%",
      color: blendHex(color, "#000000", 0.5),
      derived: true,
    },
  ];
}

function buildThemePalette(
  colors: Partial<Record<ThemeColorKey, string>>,
): ThemeColorFamily[] {
  return THEME_COLOR_ORDER.map((key) => {
    const color = colors[key] ?? FALLBACK_THEME_COLORS[key];
    return {
      key,
      label: THEME_COLOR_LABELS[key],
      color,
      variants: buildPowerPointVariants(color),
    };
  });
}

FALLBACK_THEME.palette = buildThemePalette(FALLBACK_THEME_COLORS);

function cssVarSuffixFromLabel(label: string): string {
  return label
    .toLowerCase()
    .replace(/%/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function applyPaletteCssVars(theme: SlideTheme) {
  for (const family of theme.palette) {
    theme.cssVars[`--ppt-${family.key}`] = family.color;
    for (const variant of family.variants) {
      const suffix = cssVarSuffixFromLabel(variant.label);
      theme.cssVars[`--ppt-${family.key}-${suffix}`] = variant.color;
    }
  }
}

applyPaletteCssVars(FALLBACK_THEME);

function resolveFont(
  typeface: string | null | undefined,
  fallback = "Calibri, sans-serif",
): string {
  if (!typeface) return fallback;
  if (typeface.startsWith("+mj-") || typeface.startsWith("+mn-"))
    return fallback;
  const needsQuotes = /\s/.test(typeface);
  const primary = needsQuotes ? `"${typeface}"` : typeface;
  return `${primary}, ${fallback}`;
}

async function readXml(zip: JSZip, path: string): Promise<Document | null> {
  try {
    const file = zip.file(path);
    if (!file) return null;
    const text = await file.async("string");
    const doc = new DOMParser().parseFromString(text, "application/xml");
    const errors = doc.getElementsByTagName("parsererror");
    if (errors.length > 0) {
      console.warn(`[pptxParser] XML parse error in ${path}`);
      return null;
    }
    return doc;
  } catch (err) {
    console.warn(`[pptxParser] Failed to read ${path}:`, err);
    return null;
  }
}

// ---------- Theme parsing ---------------------------------------------------

function parseThemeFromDoc(doc: Document): SlideTheme {
  const theme = structuredCloneTheme(FALLBACK_THEME);
  try {
    const clrScheme = doc.getElementsByTagNameNS("*", "clrScheme")[0];
    if (clrScheme) {
      const pickColor = (tag: ThemeColorKey): string | null => {
        const el = clrScheme.getElementsByTagNameNS("*", tag)[0];
        return hexFromSrgbClr(el ?? null);
      };
      const parsedColors = Object.fromEntries(
        THEME_COLOR_ORDER.map((key) => [key, pickColor(key)]),
      ) as Partial<Record<ThemeColorKey, string | null>>;
      const dk1 = parsedColors.dk1 ?? null;
      const lt1 = parsedColors.lt1 ?? null;
      const lt2 = parsedColors.lt2 ?? null;
      const accent1 = parsedColors.accent1 ?? null;
      const accent2 = parsedColors.accent2 ?? null;

      if (dk1) theme.cssVars["--slide-text"] = dk1;
      if (lt1) theme.cssVars["--slide-bg"] = lt1;
      if (lt2) theme.cssVars["--slide-secondary"] = lt2;
      if (accent1) theme.cssVars["--slide-primary"] = accent1;
      if (accent2) theme.cssVars["--slide-accent"] = accent2;

      if (dk1) {
        const bg = lt1 ?? "#ffffff";
        theme.cssVars["--slide-text-muted"] = blendHex(dk1, bg, 0.6);
      }
      theme.palette = buildThemePalette(
        Object.fromEntries(
          THEME_COLOR_ORDER.map((key) => [
            key,
            parsedColors[key] ?? FALLBACK_THEME_COLORS[key],
          ]),
        ) as Partial<Record<ThemeColorKey, string>>,
      );
    } else {
      console.warn("[pptxParser] No clrScheme found in theme");
      theme.palette = buildThemePalette(FALLBACK_THEME_COLORS);
    }

    const fontScheme = doc.getElementsByTagNameNS("*", "fontScheme")[0];
    if (fontScheme) {
      const major = fontScheme.getElementsByTagNameNS("*", "majorFont")[0];
      const minor = fontScheme.getElementsByTagNameNS("*", "minorFont")[0];
      const majorLatin = major?.getElementsByTagNameNS("*", "latin")[0];
      const minorLatin = minor?.getElementsByTagNameNS("*", "latin")[0];
      theme.cssVars["--slide-font-heading"] = resolveFont(
        majorLatin?.getAttribute("typeface"),
      );
      theme.cssVars["--slide-font-body"] = resolveFont(
        minorLatin?.getAttribute("typeface"),
      );
    } else {
      console.warn("[pptxParser] No fontScheme found in theme");
    }
  } catch (err) {
    console.warn("[pptxParser] Theme parse error:", err);
  }
  if (theme.palette.length === 0) {
    theme.palette = buildThemePalette(FALLBACK_THEME_COLORS);
  }
  applyPaletteCssVars(theme);
  return theme;
}

function structuredCloneTheme(t: SlideTheme): SlideTheme {
  return {
    cssVars: { ...t.cssVars },
    palette: t.palette.map((entry) => ({
      ...entry,
      variants: entry.variants.map((variant) => ({ ...variant })),
    })),
  };
}

// ---------- Layout parsing --------------------------------------------------

function parsePlaceholderPosition(
  sp: Element,
  slideSize: SlideSize,
): Placeholder["position"] | null {
  const spPr = sp.getElementsByTagNameNS("*", "spPr")[0];
  const xfrm = spPr?.getElementsByTagNameNS("*", "xfrm")[0];
  if (!xfrm) return null;
  const off = xfrm.getElementsByTagNameNS("*", "off")[0];
  const ext = xfrm.getElementsByTagNameNS("*", "ext")[0];
  if (!off || !ext) return null;

  const x = parseInt(off.getAttribute("x") || "0", 10);
  const y = parseInt(off.getAttribute("y") || "0", 10);
  const cx = parseInt(ext.getAttribute("cx") || "0", 10);
  const cy = parseInt(ext.getAttribute("cy") || "0", 10);
  if (cx <= 0 || cy <= 0) return null;

  return {
    x: (x / slideSize.widthEmu) * 100,
    y: (y / slideSize.heightEmu) * 100,
    w: (cx / slideSize.widthEmu) * 100,
    h: (cy / slideSize.heightEmu) * 100,
  };
}

function parsePlaceholderSeed(
  sp: Element,
  slideSize: SlideSize,
): ParsedPlaceholderSeed | null {
  try {
    const ph = sp.getElementsByTagNameNS("*", "ph")[0];
    if (!ph) return null;
    const idxAttr = ph.getAttribute("idx");
    const typeAttr = ph.getAttribute("type");
    const rawIdx = idxAttr ? parseInt(idxAttr, 10) || 0 : null;
    const idx = rawIdx ?? 0;
    const type = typeAttr ?? "body";
    const position = parsePlaceholderPosition(sp, slideSize);
    return { idx, rawIdx, type, position };
  } catch (err) {
    console.warn("[pptxParser] Placeholder parse error:", err);
    return null;
  }
}

function parsePlaceholderSeeds(
  doc: Document | null,
  slideSize: SlideSize,
  logContext: "layout" | "master",
): ParsedPlaceholderSeed[] {
  if (!doc) return [];
  const placeholders: ParsedPlaceholderSeed[] = [];
  try {
    const shapes = Array.from(doc.getElementsByTagNameNS("*", "sp"));
    for (const sp of shapes) {
      const ph = parsePlaceholderSeed(sp, slideSize);
      if (ph) placeholders.push(ph);
    }
  } catch (err) {
    console.warn(`[pptxParser] ${logContext} shape parse error:`, err);
  }
  return placeholders;
}

function placeholderTypeFamily(type: PlaceholderType): string {
  if (type === "title" || type === "ctrTitle") return "title";
  return type;
}

function placeholderMatchScore(
  layoutPh: ParsedPlaceholderSeed,
  masterPh: ParsedPlaceholderSeed,
): number {
  const sameIdx =
    layoutPh.rawIdx !== null &&
    masterPh.rawIdx !== null &&
    layoutPh.rawIdx === masterPh.rawIdx;
  const exactType = layoutPh.type === masterPh.type;
  const sameFamily =
    placeholderTypeFamily(layoutPh.type) ===
    placeholderTypeFamily(masterPh.type);

  if (sameIdx && exactType) return 100;
  if (sameIdx && sameFamily) return 90;
  if (exactType && layoutPh.rawIdx === null && masterPh.rawIdx === null)
    return 80;
  if (sameFamily && layoutPh.rawIdx === null && masterPh.rawIdx === null)
    return 70;
  if (exactType && (layoutPh.rawIdx === null || masterPh.rawIdx === null))
    return 60;
  if (sameFamily && (layoutPh.rawIdx === null || masterPh.rawIdx === null))
    return 50;
  if (sameIdx) return 40;
  return -1;
}

function resolvePlaceholder(
  placeholder: ParsedPlaceholderSeed,
  masterPlaceholders: ParsedPlaceholderSeed[],
): Placeholder {
  if (placeholder.position) {
    return {
      idx: placeholder.idx,
      type: placeholder.type,
      position: placeholder.position,
      source: "layout",
    };
  }

  let inherited: Placeholder["position"] | null = null;
  let bestScore = -1;
  for (const masterPh of masterPlaceholders) {
    if (!masterPh.position) continue;
    const score = placeholderMatchScore(placeholder, masterPh);
    if (score > bestScore) {
      bestScore = score;
      inherited = masterPh.position;
    }
  }

  if (inherited) {
    return {
      idx: placeholder.idx,
      type: placeholder.type,
      position: inherited,
      source: "master",
    };
  }

  return {
    idx: placeholder.idx,
    type: placeholder.type,
    position:
      FALLBACK_POSITIONS[placeholder.type] ??
      FALLBACK_POSITIONS[placeholder.idx === 0 ? "title" : "body"],
    source: "fallback",
  };
}

async function parseLayout(
  zip: JSZip,
  layoutPath: string,
  layoutId: string,
  fallbackName: string,
  slideSize: SlideSize,
  masterPlaceholders: ParsedPlaceholderSeed[],
): Promise<SlideLayout> {
  const doc = await readXml(zip, layoutPath);
  if (!doc) {
    return { id: layoutId, name: fallbackName, placeholders: [] };
  }

  let name = fallbackName;
  try {
    const cSld = doc.getElementsByTagNameNS("*", "cSld")[0];
    const nameAttr = cSld?.getAttribute("name");
    if (nameAttr) name = nameAttr;
  } catch (err) {
    console.warn("[pptxParser] Layout name parse error:", err);
  }

  const placeholders = parsePlaceholderSeeds(doc, slideSize, "layout").map(
    (ph) => resolvePlaceholder(ph, masterPlaceholders),
  );

  return { id: layoutId, name, placeholders };
}

// ---------- Master parsing --------------------------------------------------

interface MasterRelEntry {
  target: string;
  rid: string;
}

async function parseMasterRels(
  zip: JSZip,
  masterPath: string,
): Promise<MasterRelEntry[]> {
  const relPath = masterPath.replace(
    /slideMasters\/(slideMaster\d+)\.xml$/,
    "slideMasters/_rels/$1.xml.rels",
  );
  const doc = await readXml(zip, relPath);
  if (!doc) return [];
  const entries: MasterRelEntry[] = [];
  try {
    const rels = Array.from(doc.getElementsByTagName("Relationship"));
    for (const r of rels) {
      const type = r.getAttribute("Type") || "";
      if (!type.endsWith("/slideLayout")) continue;
      const target = r.getAttribute("Target") || "";
      const rid = r.getAttribute("Id") || "";
      const resolved = resolveZipPath(masterPath, target);
      entries.push({ target: resolved, rid });
    }
  } catch (err) {
    console.warn("[pptxParser] Master rels parse error:", err);
  }
  return entries;
}

function resolveZipPath(basePath: string, relPath: string): string {
  if (relPath.startsWith("/")) return relPath.replace(/^\/+/, "");
  const baseParts = basePath.split("/");
  baseParts.pop();
  const relParts = relPath.split("/");
  for (const part of relParts) {
    if (part === "..") baseParts.pop();
    else if (part !== ".") baseParts.push(part);
  }
  return baseParts.join("/");
}

async function parseMaster(
  zip: JSZip,
  masterPath: string,
  masterIndex: number,
  theme: SlideTheme,
  slideSize: SlideSize,
): Promise<SlideMaster> {
  const doc = await readXml(zip, masterPath);
  let name = `Folienmaster ${masterIndex + 1}`;
  try {
    if (doc) {
      const cSld = doc.getElementsByTagNameNS("*", "cSld")[0];
      const nameAttr = cSld?.getAttribute("name");
      if (nameAttr && nameAttr.trim()) name = nameAttr.trim();
    }
  } catch (err) {
    console.warn("[pptxParser] Master name parse error:", err);
  }

  const masterPlaceholders = parsePlaceholderSeeds(doc, slideSize, "master");
  const rels = await parseMasterRels(zip, masterPath);
  const layouts: SlideLayout[] = [];
  let i = 0;
  for (const rel of rels) {
    const layoutId = `${masterPath}::${rel.rid}`;
    const fallbackName = `Layout ${++i}`;
    const layout = await parseLayout(
      zip,
      rel.target,
      layoutId,
      fallbackName,
      slideSize,
      masterPlaceholders,
    );
    layouts.push(layout);
  }

  if (layouts.length === 0) {
    layouts.push({
      id: `${masterPath}::fallback`,
      name: "Leeres Layout",
      placeholders: [
        {
          idx: 0,
          type: "title",
          position: FALLBACK_POSITIONS.title,
          source: "fallback",
        },
        {
          idx: 1,
          type: "body",
          position: FALLBACK_POSITIONS.body,
          source: "fallback",
        },
      ],
    });
  }

  return {
    id: masterPath,
    name,
    theme,
    layouts,
  };
}

// ---------- Top-level parser ------------------------------------------------

function makeFallbackPresentation(): ParsedPresentation {
  return {
    slideSize: FALLBACK_SLIDE_SIZE,
    masters: [
      {
        id: "fallback-master",
        name: "Standard",
        theme: FALLBACK_THEME,
        layouts: [
          {
            id: "fallback-layout",
            name: "Titel & Inhalt",
            placeholders: [
              {
                idx: 0,
                type: "title",
                position: FALLBACK_POSITIONS.title,
                source: "fallback",
              },
              {
                idx: 1,
                type: "body",
                position: FALLBACK_POSITIONS.body,
                source: "fallback",
              },
            ],
          },
        ],
      },
    ],
  };
}

function parseSlideSizeFromDoc(doc: Document | null): SlideSize {
  if (!doc) return FALLBACK_SLIDE_SIZE;
  try {
    const sldSz = doc.getElementsByTagNameNS("*", "sldSz")[0];
    const widthEmu = parseInt(
      sldSz?.getAttribute("cx") || `${FALLBACK_SLIDE_SIZE.widthEmu}`,
      10,
    );
    const heightEmu = parseInt(
      sldSz?.getAttribute("cy") || `${FALLBACK_SLIDE_SIZE.heightEmu}`,
      10,
    );
    if (widthEmu > 0 && heightEmu > 0) {
      return { widthEmu, heightEmu };
    }
  } catch (err) {
    console.warn("[pptxParser] Slide size parse error:", err);
  }
  return FALLBACK_SLIDE_SIZE;
}

async function parsePptxSource(
  source: File | ArrayBuffer,
): Promise<ParsedPresentation> {
  const zip = await JSZip.loadAsync(source);

  let theme = FALLBACK_THEME;
  const themeDoc = await readXml(zip, "ppt/theme/theme1.xml");
  if (themeDoc) {
    theme = parseThemeFromDoc(themeDoc);
  } else {
    console.warn("[pptxParser] ppt/theme/theme1.xml missing, using fallback");
  }

  const presentationDoc = await readXml(zip, "ppt/presentation.xml");
  const slideSize = parseSlideSizeFromDoc(presentationDoc);

  const masterPaths: string[] = [];
  const files = Object.keys(zip.files);
  for (const path of files) {
    if (/^ppt\/slideMasters\/slideMaster\d+\.xml$/.test(path)) {
      masterPaths.push(path);
    }
  }
  masterPaths.sort();

  if (masterPaths.length === 0) {
    console.warn("[pptxParser] No slide masters found");
    return makeFallbackPresentation();
  }

  const masters: SlideMaster[] = [];
  for (let i = 0; i < masterPaths.length; i++) {
    const master = await parseMaster(
      zip,
      masterPaths[i],
      i,
      theme,
      slideSize,
    );
    masters.push(master);
  }

  if (masters.length === 0) return makeFallbackPresentation();
  return { masters, slideSize };
}

export async function parsePptx(file: File): Promise<ParsedPresentation> {
  try {
    return await parsePptxSource(file);
  } catch (err) {
    console.warn("[pptxParser] Fatal parse error, returning fallback:", err);
    return makeFallbackPresentation();
  }
}

export async function parsePptxData(
  data: ArrayBuffer,
): Promise<ParsedPresentation> {
  try {
    return await parsePptxSource(data);
  } catch (err) {
    console.warn("[pptxParser] Fatal parse error, returning fallback:", err);
    return makeFallbackPresentation();
  }
}
