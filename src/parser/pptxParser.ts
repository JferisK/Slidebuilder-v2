import JSZip from "jszip";

// ---------- Types -----------------------------------------------------------

export interface ParsedPresentation {
  masters: SlideMaster[];
}

export interface SlideMaster {
  id: string;
  name: string;
  theme: SlideTheme;
  layouts: SlideLayout[];
}

export interface SlideTheme {
  cssVars: {
    "--slide-bg": string;
    "--slide-primary": string;
    "--slide-secondary": string;
    "--slide-accent": string;
    "--slide-text": string;
    "--slide-text-muted": string;
    "--slide-font-heading": string;
    "--slide-font-body": string;
  };
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
  defaultText?: string;
}

// ---------- Constants -------------------------------------------------------

const SLIDE_W_EMU = 9144000;
const SLIDE_H_EMU = 5143500;

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

function resolveFont(
  typeface: string | null | undefined,
  fallback = "Calibri, sans-serif",
): string {
  if (!typeface) return fallback;
  if (typeface.startsWith("+mj-") || typeface.startsWith("+mn-"))
    return fallback;
  // Wrap in quotes if it contains spaces
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
      const pickColor = (tag: string): string | null => {
        const el = clrScheme.getElementsByTagNameNS("*", tag)[0];
        return hexFromSrgbClr(el ?? null);
      };
      const dk1 = pickColor("dk1");
      const lt1 = pickColor("lt1");
      const lt2 = pickColor("lt2");
      const accent1 = pickColor("accent1");
      const accent2 = pickColor("accent2");

      if (dk1) theme.cssVars["--slide-text"] = dk1;
      if (lt1) theme.cssVars["--slide-bg"] = lt1;
      if (lt2) theme.cssVars["--slide-secondary"] = lt2;
      if (accent1) theme.cssVars["--slide-primary"] = accent1;
      if (accent2) theme.cssVars["--slide-accent"] = accent2;

      // Muted text: dk1 @ 60% over lt1
      if (dk1) {
        const bg = lt1 ?? "#ffffff";
        theme.cssVars["--slide-text-muted"] = blendHex(dk1, bg, 0.6);
      }
    } else {
      console.warn("[pptxParser] No clrScheme found in theme");
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
  return theme;
}

function structuredCloneTheme(t: SlideTheme): SlideTheme {
  return { cssVars: { ...t.cssVars } };
}

// ---------- Layout parsing --------------------------------------------------

function parsePlaceholder(sp: Element): Placeholder | null {
  try {
    const ph = sp.getElementsByTagNameNS("*", "ph")[0];
    if (!ph) return null;
    const idxAttr = ph.getAttribute("idx");
    const typeAttr = ph.getAttribute("type");
    const idx = idxAttr ? parseInt(idxAttr, 10) || 0 : 0;
    const type = typeAttr ?? "body";

    // Geometry: <p:spPr>/<a:xfrm>/<a:off> & <a:ext>
    const spPr = sp.getElementsByTagNameNS("*", "spPr")[0];
    const xfrm = spPr?.getElementsByTagNameNS("*", "xfrm")[0];
    let position: Placeholder["position"] | null = null;
    if (xfrm) {
      const off = xfrm.getElementsByTagNameNS("*", "off")[0];
      const ext = xfrm.getElementsByTagNameNS("*", "ext")[0];
      if (off && ext) {
        const x = parseInt(off.getAttribute("x") || "0", 10);
        const y = parseInt(off.getAttribute("y") || "0", 10);
        const cx = parseInt(ext.getAttribute("cx") || "0", 10);
        const cy = parseInt(ext.getAttribute("cy") || "0", 10);
        if (cx > 0 && cy > 0) {
          position = {
            x: (x / SLIDE_W_EMU) * 100,
            y: (y / SLIDE_H_EMU) * 100,
            w: (cx / SLIDE_W_EMU) * 100,
            h: (cy / SLIDE_H_EMU) * 100,
          };
        }
      }
    }
    if (!position) {
      position =
        FALLBACK_POSITIONS[type] ??
        FALLBACK_POSITIONS[idx === 0 ? "title" : "body"];
    }
    return { idx, type, position };
  } catch (err) {
    console.warn("[pptxParser] Placeholder parse error:", err);
    return null;
  }
}

async function parseLayout(
  zip: JSZip,
  layoutPath: string,
  layoutId: string,
  fallbackName: string,
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

  const placeholders: Placeholder[] = [];
  try {
    const shapes = Array.from(doc.getElementsByTagNameNS("*", "sp"));
    for (const sp of shapes) {
      const ph = parsePlaceholder(sp);
      if (ph) placeholders.push(ph);
    }
  } catch (err) {
    console.warn("[pptxParser] Layout shape parse error:", err);
  }

  return { id: layoutId, name, placeholders };
}

// ---------- Master parsing --------------------------------------------------

interface MasterRelEntry {
  target: string; // normalized absolute zip path
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
      // Resolve relative path (e.g. ../slideLayouts/slideLayout1.xml)
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
  baseParts.pop(); // drop filename
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

  const rels = await parseMasterRels(zip, masterPath);
  const layouts: SlideLayout[] = [];
  let i = 0;
  for (const rel of rels) {
    const layoutId = `${masterPath}::${rel.rid}`;
    const fallbackName = `Layout ${++i}`;
    const layout = await parseLayout(zip, rel.target, layoutId, fallbackName);
    layouts.push(layout);
  }

  if (layouts.length === 0) {
    // Ensure at least one usable layout so the UI can still render.
    layouts.push({
      id: `${masterPath}::fallback`,
      name: "Leeres Layout",
      placeholders: [
        { idx: 0, type: "title", position: FALLBACK_POSITIONS.title },
        { idx: 1, type: "body", position: FALLBACK_POSITIONS.body },
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
              { idx: 0, type: "title", position: FALLBACK_POSITIONS.title },
              { idx: 1, type: "body", position: FALLBACK_POSITIONS.body },
            ],
          },
        ],
      },
    ],
  };
}

export async function parsePptx(file: File): Promise<ParsedPresentation> {
  try {
    const zip = await JSZip.loadAsync(file);

    // Parse shared theme (theme1.xml). Applied to all masters; most decks only
    // have one theme anyway and the spec asks us to focus on theme1.
    let theme = FALLBACK_THEME;
    const themeDoc = await readXml(zip, "ppt/theme/theme1.xml");
    if (themeDoc) {
      theme = parseThemeFromDoc(themeDoc);
    } else {
      console.warn("[pptxParser] ppt/theme/theme1.xml missing, using fallback");
    }

    // Collect master paths
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
      const master = await parseMaster(zip, masterPaths[i], i, theme);
      masters.push(master);
    }

    if (masters.length === 0) return makeFallbackPresentation();
    return { masters };
  } catch (err) {
    console.warn("[pptxParser] Fatal parse error, returning fallback:", err);
    return makeFallbackPresentation();
  }
}
