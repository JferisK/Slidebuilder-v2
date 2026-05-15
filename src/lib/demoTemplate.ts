/**
 * Built-in demo template with realistic corporate slide masters.
 * Lets users test SlideForge instantly without uploading a PPTX.
 */

import type {
  ParsedPresentation,
  ThemeColorFamily,
} from "@/parser/pptxParser";

function blend(color: string, withColor: string, alpha: number): string {
  const parse = (hex: string) =>
    hex
      .replace(/^#/, "")
      .match(/.{2}/g)
      ?.map((value) => parseInt(value, 16)) ?? [0, 0, 0];
  const [r1, g1, b1] = parse(color);
  const [r2, g2, b2] = parse(withColor);
  const mix = (a: number, b: number) =>
    Math.round(a * alpha + b * (1 - alpha))
      .toString(16)
      .padStart(2, "0");
  return `#${mix(r1, r2)}${mix(g1, g2)}${mix(b1, b2)}`;
}

function buildPalette(colors: Array<{ key: string; label: string; color: string }>): ThemeColorFamily[] {
  return colors.map((entry) => ({
    key: entry.key,
    label: entry.label,
    color: entry.color,
    variants: [
      { label: "Heller 80%", color: blend(entry.color, "#ffffff", 0.2), derived: true },
      { label: "Heller 60%", color: blend(entry.color, "#ffffff", 0.4), derived: true },
      { label: "Heller 40%", color: blend(entry.color, "#ffffff", 0.6), derived: true },
      { label: "Dunkler 25%", color: blend(entry.color, "#000000", 0.75), derived: true },
      { label: "Dunkler 50%", color: blend(entry.color, "#000000", 0.5), derived: true },
    ],
  }));
}

export function createDemoPresentation(): ParsedPresentation {
  return {
    slideSize: {
      widthEmu: 9144000,
      heightEmu: 5143500,
    },
    masters: [
      // ── Master 1: Corporate Blue ────────────────────────────
      {
        id: "demo-master-corporate",
        name: "Corporate Design",
        theme: {
          cssVars: {
            "--slide-bg": "#ffffff",
            "--slide-primary": "#1a5276",
            "--slide-secondary": "#eaf2f8",
            "--slide-accent": "#c0392b",
            "--slide-text": "#1c2833",
            "--slide-text-muted": "#7f8c8d",
            "--slide-font-heading": '"Segoe UI", Calibri, sans-serif',
            "--slide-font-body": '"Segoe UI", Calibri, sans-serif',
          },
          palette: buildPalette([
            { key: "lt1", label: "Hintergrund 1", color: "#ffffff" },
            { key: "dk1", label: "Text 1", color: "#1c2833" },
            { key: "lt2", label: "Hintergrund 2", color: "#eaf2f8" },
            { key: "dk2", label: "Text 2", color: "#7f8c8d" },
            { key: "accent1", label: "Akzent 1", color: "#1a5276" },
            { key: "accent2", label: "Akzent 2", color: "#c0392b" },
            { key: "accent3", label: "Akzent 3", color: "#5dade2" },
            { key: "accent4", label: "Akzent 4", color: "#58d68d" },
            { key: "accent5", label: "Akzent 5", color: "#f5b041" },
            { key: "accent6", label: "Akzent 6", color: "#8e44ad" },
          ]),
        },
        layouts: [
          {
            id: "demo-corp-title",
            name: "Titelfolie",
            placeholders: [
              {
                idx: 0,
                type: "ctrTitle",
                position: { x: 10, y: 25, w: 80, h: 25 },
              },
              {
                idx: 1,
                type: "subTitle",
                position: { x: 15, y: 55, w: 70, h: 12 },
              },
              {
                idx: 10,
                type: "dt",
                position: { x: 3, y: 92, w: 18, h: 5 },
              },
              {
                idx: 11,
                type: "ftr",
                position: { x: 30, y: 92, w: 40, h: 5 },
              },
            ],
          },
          {
            id: "demo-corp-content",
            name: "Titel und Inhalt",
            placeholders: [
              {
                idx: 0,
                type: "title",
                position: { x: 5, y: 4, w: 90, h: 12 },
              },
              {
                idx: 1,
                type: "body",
                position: { x: 5, y: 20, w: 90, h: 68 },
              },
              {
                idx: 10,
                type: "dt",
                position: { x: 3, y: 92, w: 18, h: 5 },
              },
              {
                idx: 11,
                type: "ftr",
                position: { x: 30, y: 92, w: 40, h: 5 },
              },
              {
                idx: 12,
                type: "sldNum",
                position: { x: 80, y: 92, w: 18, h: 5 },
              },
            ],
          },
          {
            id: "demo-corp-two-col",
            name: "Zwei Spalten",
            placeholders: [
              {
                idx: 0,
                type: "title",
                position: { x: 5, y: 4, w: 90, h: 12 },
              },
              {
                idx: 1,
                type: "body",
                position: { x: 5, y: 20, w: 43, h: 68 },
                defaultText: "Linke Spalte",
              },
              {
                idx: 2,
                type: "body",
                position: { x: 52, y: 20, w: 43, h: 68 },
                defaultText: "Rechte Spalte",
              },
              {
                idx: 12,
                type: "sldNum",
                position: { x: 80, y: 92, w: 18, h: 5 },
              },
            ],
          },
          {
            id: "demo-corp-section",
            name: "Abschnittsüberschrift",
            placeholders: [
              {
                idx: 0,
                type: "title",
                position: { x: 8, y: 35, w: 84, h: 18 },
              },
              {
                idx: 1,
                type: "subTitle",
                position: { x: 8, y: 56, w: 84, h: 10 },
              },
            ],
          },
          {
            id: "demo-corp-blank",
            name: "Leer",
            placeholders: [],
          },
        ],
      },

      // ── Master 2: Startup Green ─────────────────────────────
      {
        id: "demo-master-startup",
        name: "Startup Modern",
        theme: {
          cssVars: {
            "--slide-bg": "#f8fffe",
            "--slide-primary": "#0d9488",
            "--slide-secondary": "#ecfdf5",
            "--slide-accent": "#f59e0b",
            "--slide-text": "#0f172a",
            "--slide-text-muted": "#94a3b8",
            "--slide-font-heading": '"Inter", "Helvetica Neue", sans-serif',
            "--slide-font-body": '"Inter", "Helvetica Neue", sans-serif',
          },
          palette: buildPalette([
            { key: "lt1", label: "Hintergrund 1", color: "#f8fffe" },
            { key: "dk1", label: "Text 1", color: "#0f172a" },
            { key: "lt2", label: "Hintergrund 2", color: "#ecfdf5" },
            { key: "dk2", label: "Text 2", color: "#94a3b8" },
            { key: "accent1", label: "Akzent 1", color: "#0d9488" },
            { key: "accent2", label: "Akzent 2", color: "#f59e0b" },
            { key: "accent3", label: "Akzent 3", color: "#14b8a6" },
            { key: "accent4", label: "Akzent 4", color: "#22c55e" },
            { key: "accent5", label: "Akzent 5", color: "#38bdf8" },
            { key: "accent6", label: "Akzent 6", color: "#a855f7" },
          ]),
        },
        layouts: [
          {
            id: "demo-startup-title",
            name: "Titelfolie",
            placeholders: [
              {
                idx: 0,
                type: "ctrTitle",
                position: { x: 8, y: 20, w: 84, h: 28 },
              },
              {
                idx: 1,
                type: "subTitle",
                position: { x: 15, y: 52, w: 70, h: 10 },
              },
            ],
          },
          {
            id: "demo-startup-content",
            name: "Titel und Inhalt",
            placeholders: [
              {
                idx: 0,
                type: "title",
                position: { x: 5, y: 3, w: 90, h: 13 },
              },
              {
                idx: 1,
                type: "body",
                position: { x: 5, y: 19, w: 90, h: 70 },
              },
              {
                idx: 12,
                type: "sldNum",
                position: { x: 82, y: 93, w: 15, h: 5 },
              },
            ],
          },
          {
            id: "demo-startup-comparison",
            name: "Vergleich",
            placeholders: [
              {
                idx: 0,
                type: "title",
                position: { x: 5, y: 3, w: 90, h: 13 },
              },
              {
                idx: 1,
                type: "body",
                position: { x: 5, y: 22, w: 42, h: 30 },
                defaultText: "Vorher / Problem",
              },
              {
                idx: 2,
                type: "body",
                position: { x: 53, y: 22, w: 42, h: 30 },
                defaultText: "Nachher / Lösung",
              },
              {
                idx: 3,
                type: "body",
                position: { x: 5, y: 58, w: 90, h: 30 },
                defaultText: "Fazit / Empfehlung",
              },
            ],
          },
        ],
      },

      // ── Master 3: Dark Executive ────────────────────────────
      {
        id: "demo-master-dark",
        name: "Executive Dark",
        theme: {
          cssVars: {
            "--slide-bg": "#111827",
            "--slide-primary": "#60a5fa",
            "--slide-secondary": "#1e293b",
            "--slide-accent": "#f472b6",
            "--slide-text": "#f1f5f9",
            "--slide-text-muted": "#64748b",
            "--slide-font-heading": '"DM Sans", "Segoe UI", sans-serif',
            "--slide-font-body": '"DM Sans", "Segoe UI", sans-serif',
          },
          palette: buildPalette([
            { key: "lt1", label: "Hintergrund 1", color: "#111827" },
            { key: "dk1", label: "Text 1", color: "#f1f5f9" },
            { key: "lt2", label: "Hintergrund 2", color: "#1e293b" },
            { key: "dk2", label: "Text 2", color: "#64748b" },
            { key: "accent1", label: "Akzent 1", color: "#60a5fa" },
            { key: "accent2", label: "Akzent 2", color: "#f472b6" },
            { key: "accent3", label: "Akzent 3", color: "#22d3ee" },
            { key: "accent4", label: "Akzent 4", color: "#f59e0b" },
            { key: "accent5", label: "Akzent 5", color: "#34d399" },
            { key: "accent6", label: "Akzent 6", color: "#a78bfa" },
          ]),
        },
        layouts: [
          {
            id: "demo-dark-title",
            name: "Titelfolie",
            placeholders: [
              {
                idx: 0,
                type: "ctrTitle",
                position: { x: 10, y: 28, w: 80, h: 22 },
              },
              {
                idx: 1,
                type: "subTitle",
                position: { x: 18, y: 54, w: 64, h: 10 },
              },
            ],
          },
          {
            id: "demo-dark-content",
            name: "Titel und Inhalt",
            placeholders: [
              {
                idx: 0,
                type: "title",
                position: { x: 5, y: 4, w: 90, h: 13 },
              },
              {
                idx: 1,
                type: "body",
                position: { x: 5, y: 20, w: 90, h: 68 },
              },
              {
                idx: 12,
                type: "sldNum",
                position: { x: 82, y: 93, w: 15, h: 5 },
              },
            ],
          },
          {
            id: "demo-dark-kpi",
            name: "KPI Dashboard",
            placeholders: [
              {
                idx: 0,
                type: "title",
                position: { x: 5, y: 3, w: 90, h: 11 },
              },
              {
                idx: 1,
                type: "body",
                position: { x: 3, y: 18, w: 30, h: 36 },
                defaultText: "KPI 1",
              },
              {
                idx: 2,
                type: "body",
                position: { x: 35, y: 18, w: 30, h: 36 },
                defaultText: "KPI 2",
              },
              {
                idx: 3,
                type: "body",
                position: { x: 67, y: 18, w: 30, h: 36 },
                defaultText: "KPI 3",
              },
              {
                idx: 4,
                type: "body",
                position: { x: 3, y: 58, w: 94, h: 32 },
                defaultText: "Zusammenfassung / Kommentar",
              },
            ],
          },
        ],
      },
    ],
  };
}
