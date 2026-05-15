# Brand Guide: Folienmaster 1

## Status
- template_id: "ppt/slideMasters"
- master_id: "ppt/slideMasters/slideMaster1.xml"
- source: "pptx-master-plus-user-notes"
- confidence: "high"

---

## Palette Interpretation

| Semantic Role | Token Reference | Rationale | Best Use |
|---|---|---|---|
| Background | `--slide-bg` / `lt1` (`#ffffff`) | White canvas; maximum luminance baseline | Slide background, card fill, legend background |
| Text Primary | `--slide-text` / `dk1` (`#000000`) | Maximum contrast on white | All body text, captions, table content |
| Text Muted | `--slide-text-muted` (`#666666`) | Reduced weight, still AA-compliant on white | Footnotes, source lines, secondary labels |
| Surface Secondary | `--slide-secondary` / `lt2` (`#e5e5e5`) | Neutral grey; pairs with both blue families | Panel backgrounds, dividers, inactive tab fills |
| Brand Anchor / Heading | `--slide-accent` / `dk2` / `accent2` (`#00338d`) | KPMG Blue — the identity colour defined in CI | Slide titles, headings, rule lines, logo-adjacent elements |
| Interactive / Key Emphasis | `--slide-primary` / `accent1` (`#1e49e2`) | Cobalt Blue — lighter, higher-energy KPMG shade | CTAs, highlighted data points, active indicators, icon fills |
| Dark Depth | `accent3` (`#0c233c`) | Dark Blue — near-navy; very high contrast | Footer bands, dark-theme backgrounds, strong separator bars |
| Bright Accent / Energy | `accent4` (`#00b8f5`) | Pacific Blue — vivid cyan; draws the eye | Data-viz primary, illustration highlights, single callout icons |
| Expression / Innovation | `accent5` (`#7213ea`) | Purple — bold, reserved for creative themes | Innovation or digital slides only; gradient endpoint |
| Expression / Bold Contrast | `accent6` (`#fd349c`) | Pink (PPT value) — high-saturation, reserved | Bold contrast moments, gradient endpoint; CI brand note below |

> **CI Note — Pink discrepancy**: The brand CI manual specifies RGB 253/82/168 (`#fd52a8`), while the uploaded master uses `#fd349c` (RGB 253/52/156). The PPT file is authoritative for slide output; use `var(--ppt-accent6)` in code. Note the mismatch if the brand team ever reconciles the template.

---

## Safe Color Pairings

| Foreground | Background | Contrast | Use Case |
|---|---|---|---|
| `--slide-text` (`#000`) | `--slide-bg` (`#fff`) | 21 : 1 | Body text, all sizes |
| `--slide-accent` (`#00338d`) | `--slide-bg` (`#fff`) | ~8 : 1 | Headings, titles |
| `--slide-primary` (`#1e49e2`) | `--slide-bg` (`#fff`) | ~4.5 : 1 | CTA labels, callout text (WCAG AA large text) |
| `--slide-text` (`#000`) | `--slide-secondary` (`#e5e5e5`) | ~14 : 1 | Text on panel fill |
| `#ffffff` | `--slide-accent` (`#00338d`) | ~8 : 1 | Reversed headings, dark header bars |
| `#ffffff` | `--slide-primary` (`#1e49e2`) | ~4.5 : 1 | Labels inside cobalt-filled shapes |
| `#ffffff` | `accent3` (`#0c233c`) | >15 : 1 | Footer text on dark band |
| `#000000` | `accent4` (`#00b8f5`) | ~2.6 : 1 | Large/bold labels only on Pacific Blue fill; not for body text |
| `--slide-text` (`#000`) | tinted KPMG Blue 12% | >18 : 1 | Content on soft brand-wash panels |

**Avoid**: white text on `accent4` (Pacific Blue) — fails WCAG at body sizes. Avoid colour-on-colour pairings from the infographic-only palette outside data-viz contexts.

---

## Tint and Shade Recipes

```tsx
// Soft KPMG Blue panel (section intros, callout boxes)
style={{ backgroundColor: "color-mix(in srgb, var(--slide-accent) 12%, var(--slide-bg))" }}

// Medium KPMG Blue fill (table header row, progress bars)
style={{ backgroundColor: "color-mix(in srgb, var(--slide-accent) 30%, var(--slide-bg))" }}

// Soft Cobalt wash (active tab, hover state)
style={{ backgroundColor: "color-mix(in srgb, var(--slide-primary) 12%, var(--slide-bg))" }}

// Dark Blue soft fill (subtle navy tint on white)
style={{ backgroundColor: "color-mix(in srgb, var(--ppt-accent3) 10%, var(--slide-bg))" }}

// Pacific Blue tint (illustration background wash)
style={{ backgroundColor: "color-mix(in srgb, var(--ppt-accent4) 20%, var(--slide-bg))" }}

// Grey muted surface (sidebar, legend background)
style={{ backgroundColor: "color-mix(in srgb, var(--slide-secondary) 60%, var(--slide-bg))" }}
```

---

## Gradients

Only linear gradients at 0°, midpoint at 50%. Two approved combinations:

```tsx
// Purple / Cobalt — innovation, digital transformation themes
background: "linear-gradient(0deg, var(--slide-primary) 0%, var(--ppt-accent5) 100%)"

// Pacific / Light Blue — lightness, openness, data/analytics themes
// Light Blue (#aceaff = RGB 172/234/255) is the CI gradient endpoint; not a standalone fill
background: "linear-gradient(0deg, var(--ppt-accent4) 0%, #aceaff 100%)"
```

> Do **not** create radial gradients or additional gradient combinations. Do not use Light Blue (`#aceaff`) as a solid fill — it is exclusively a gradient endpoint.

---

## Infographic & Chart Color Palette

Use **only** in charts, diagrams, and data visualizations. Not for slide surfaces or text.

| Colour | RGB | Hex | Role |
|---|---|---|---|
| Pacific Blue | 0 / 184 / 245 | `#00b8f5` | Primary data series |
| Blue (chart) | 118 / 210 / 255 | `#76d2ff` | Secondary data series |
| Dark Purple | 81 / 13 / 188 | `#510dbc` | Tertiary / contrast series |
| Light Purple | 180 / 151 / 255 | `#b497ff` | Quaternary series |
| Dark Pink | 171 / 13 / 130 | `#ab0d82` | Fifth series |
| Light Pink | 255 / 163 / 218 | `#ffa3da` | Sixth series |
| Dark Green | 9 / 142 / 126 | `#098e7e` | Seventh series / positive |
| Green | 0 / 192 / 174 | `#00c0ae` | Eighth series |
| Light Green | 99 / 235 / 218 | `#63ebda` | Ninth series |

**Chart colour order**: Start with KPMG Blue → Cobalt Blue → Pacific Blue → Purple → Pink. Mix light, medium, and dark tones within multi-series datasets. Do not stack all blues simultaneously.

### Neutrals (charts and infographics only)

| Name | RGB | Hex |
|---|---|---|
| Grey 1 | 51 / 51 / 51 | `#333333` |
| Grey 2 | 102 / 102 / 102 | `#666666` |
| Grey 3 | 152 / 152 / 152 | `#989898` |
| Grey 4 | 178 / 178 / 178 | `#b2b2b2` |
| Grey 5 | 229 / 229 / 229 | `#e5e5e5` |
| White | 255 / 255 / 255 | `#ffffff` |

---

## Traffic Light Palette

Reserved for RAG indicators, risk matrices, and status dashboards only.

```tsx
const trafficLight = {
  danger:  "#ed2124", // RGB 237/33/36  — Red
  warning: "#f1c44d", // RGB 241/196/77 — Yellow
  success: "#269924", // RGB 38/153/36  — Green
};
```

---

## Slide Recipes

### Title / Section slide
- Heading: `--slide-font-heading`, color `var(--slide-accent)` on `var(--slide-bg)`
- Rule line below title: 2 px, `var(--slide-primary)` (Cobalt Blue)
- Subtitle / deck label: `--slide-text-muted`, `--slide-font-body`

### Dense handout slide
- Body text: `--slide-text`, `--slide-font-body`, 10–11 pt equivalent
- Subheadings: `var(--slide-accent)`, bold, `--slide-font-heading`
- Dividers: `var(--slide-secondary)` 1 px rule
- Background panels (callout boxes): `color-mix(in srgb, var(--slide-accent) 12%, var(--slide-bg))`

### Diagram / process slide
- Primary nodes: `var(--slide-primary)` fill, white label
- Secondary / supporting nodes: `color-mix(in srgb, var(--slide-accent) 30%, var(--slide-bg))` fill, `var(--slide-accent)` label
- Connector arrows: `var(--slide-accent)`
- Optional energy highlight: `var(--ppt-accent4)` (Pacific Blue) — one node maximum

### Risk / attention slide
- Risk matrix cells: traffic light palette only
- Container / wrapper: `var(--slide-accent)` or `accent3` header bar
- White text on coloured cells

### Dark / cover slide
- Background: `accent3` (`#0c233c`) or Purple/Cobalt gradient
- Headline: white, `--slide-font-heading`
- Accent bar: `var(--ppt-accent4)` (Pacific Blue) 4 px bottom rule

---

## Do

- Use `--slide-accent` (KPMG Blue) for all slide titles and first-level headings.
- Use `--slide-primary` (Cobalt Blue) for CTA elements, rule lines, and key callout highlights.
- Restrict infographic/chart palette colours strictly to data-visualization contexts.
- Use only the two approved linear gradient combinations.
- Use `color-mix()` tints from existing tokens for soft fills — never invent new hex values.
- Apply traffic light colours exclusively to risk, status, and RAG indicators.
- Mix light, medium, and dark tones when using multiple series in a chart.
- Prefer KPMG Blue as the starting point in any multi-colour chart series.

---

## Don't

- Don't use more than two blue family variants on a single slide (e.g., avoid KPMG Blue + Cobalt + Pacific + Dark Blue all at once).
- Don't use infographic accent colours (Light Purple, Light Pink, chart Blue, etc.) for slide surface fills, text, or decorative elements.
- Don't create radial gradients or any gradient not listed in this guide.
- Don't use Light Blue (`#aceaff`) as a standalone fill — gradient endpoint only.
- Don't use Pacific Blue (`#00b8f5`) for small body text — fails WCAG AA.
- Don't use traffic light colours for branding or decorative purposes.
- Don't introduce raw hex values in TSX templates; always reference `var(--slide-*)` or `var(--ppt-*)`.
- Don't use Purple (`accent5`) or Pink (`accent6`) on informational / executive slides.

---

## CSS Cookbook

```tsx
// Slide title
<h2 style={{ fontFamily: "var(--slide-font-heading)", color: "var(--slide-accent)", fontWeight: 700 }}>

// Body paragraph
<p style={{ fontFamily: "var(--slide-font-body)", color: "var(--slide-text)" }}>

// Muted caption / footnote
<span style={{ color: "var(--slide-text-muted)", fontSize: "0.75em" }}>

// Primary CTA button / highlight pill
<div style={{ backgroundColor: "var(--slide-primary)", color: "#ffffff" }}>

// Dark header bar (cover, section divider)
<div style={{ backgroundColor: "var(--ppt-accent3)", color: "#ffffff" }}>

// Soft brand-wash panel
<div style={{ backgroundColor: "color-mix(in srgb, var(--slide-accent) 12%, var(--slide-bg))" }}>

// Divider rule
<hr style={{ border: "none", borderTop: "1px solid var(--slide-secondary)" }}>

// Pacific Blue energy icon
<svg style={{ fill: "var(--ppt-accent4)" }}>

// Purple/Cobalt gradient background (innovation)
<div style={{ background: "linear-gradient(0deg, var(--slide-primary) 0%, var(--ppt-accent5) 100%)" }}>

// Pacific/Light Blue gradient background (digital/analytics)
<div style={{ background: "linear-gradient(0deg, var(--ppt-accent4) 0%, #aceaff 100%)" }}>

// RAG status badge
<span style={{ backgroundColor: "#ed2124", color: "#ffffff" }}> // danger
<span style={{ backgroundColor: "#f1c44d", color: "#000000" }}> // warning
<span style={{ backgroundColor: "#269924", color: "#ffffff" }}> // success
```

---

## Derivation Notes

- `--slide-accent` maps to `dk2` and `accent2` — both `#00338d`. This is intentional: KPMG Blue appears in both the semantic "dark secondary" role and the first true accent slot, confirming its brand-anchor status.
- `--slide-primary` maps to `accent1` (`#1e49e2`, Cobalt Blue). Despite the variable name "primary," it is the *interactive/emphasis* colour in KPMG's palette, subordinate to KPMG Blue for headings.
- `accent3` (`#0c233c`, Dark Blue) has no direct CSS variable alias; reference it via `var(--ppt-accent3)`.
- Light Blue (`#aceaff`) appears in CI gradients but is absent from the PPT theme palette — use only as a hardcoded gradient endpoint (`#aceaff`) with a comment, never as a standalone token.
- Pink discrepancy: CI manual (`#fd52a8`) vs. PPT master (`#fd349c`). Use `var(--ppt-accent6)` for slides; flag to brand team for future reconciliation.
- The infographic accent palette (9 colours + neutrals) is explicitly labelled "for Infographics and charts only" in the CI manual and must not leak into slide surface design.
- All gradient angles are 0° (bottom-to-top). Midpoint sits at 50% — apply as CSS `linear-gradient(0deg, <start> 0%, <end> 100%)` with no explicit midpoint stop needed when using equal weight.
