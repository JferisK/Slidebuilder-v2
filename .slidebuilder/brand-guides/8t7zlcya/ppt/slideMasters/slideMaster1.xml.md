# Brand Guide: Folienmaster 1

## Status
- template_id: "8t7zlcya"
- master_id: "ppt/slideMasters/slideMaster1.xml"
- source: "pptx-master"
- confidence: "high"

## Palette Interpretation
- Background canvas: `{ kind: "slide", name: "bg" }` via `var(--slide-bg)`, pure white base for full-slide backgrounds and cards because the master uses `lt1` as a neutral page surface.
- Primary text: `{ kind: "slide", name: "text" }` via `var(--slide-text)`, black body copy for maximum readability on `var(--slide-bg)` and light tints.
- Muted text: `{ kind: "slide", name: "text-muted" }` via `var(--slide-text-muted)` and `var(--ppt-dk1-heller-40)`, secondary labels, notes, and source lines without dropping below a readable neutral.
- Secondary surface: `{ kind: "slide", name: "secondary" }` via `var(--slide-secondary)` and `var(--ppt-lt2)`, neutral panel fill, separators, and soft content containers.
- Brand anchor: `{ kind: "slide", name: "accent" }` via `var(--slide-accent)` and `var(--ppt-dk2)`, dark corporate blue for titles, section headers, connectors, and authoritative highlights.
- Active emphasis: `{ kind: "slide", name: "primary" }` via `var(--slide-primary)` and `var(--ppt-accent1)`, brighter blue for focal metrics, active states, and single-point emphasis beneath the main brand blue.
- Deep support: `{ kind: "ppt", name: "accent3" }` via `var(--ppt-accent3)`, dark navy support color for footer bars, dark shells, or contrast-heavy framing.
- Link / digital highlight: `{ kind: "ppt", name: "accent4" }` via `var(--ppt-accent4)` and `var(--ppt-hlink)`, bright cyan reserved for hyperlinks, data-viz highlights, or one energetic accent per slide.
- Expressive innovation accent: `{ kind: "ppt", name: "accent5" }` via `var(--ppt-accent5)`, limited-use purple for innovation, transformation, or title-slide moments, not for default business-content surfaces.
- Editorial attention accent: `{ kind: "ppt", name: "accent6" }` via `var(--ppt-accent6)`, strong pink for exceptional callouts only; use sparingly and not as a semantic risk/status system.
- Trust / followed-state accent: `{ kind: "ppt", name: "folHlink" }` via `var(--ppt-folHlink)`, blue-green support tone suitable for visited links, trust markers, or subdued positive-state accents.

## Safe Color Pairings
- `var(--slide-text)` on `var(--slide-bg)`: default body copy, captions, and dense handout text. Highest readability.
- `var(--slide-accent)` on `var(--slide-bg)`: titles, section labels, and diagram headings. Strong brand presence without sacrificing contrast.
- `var(--slide-primary)` on `var(--slide-bg)`: metric emphasis, callout keywords, and active markers. Use for short text, not full dense paragraphs.
- `var(--slide-text)` on `color-mix(in srgb, var(--slide-secondary) 70%, var(--slide-bg))`: neutral panels, legends, and note boxes.
- `var(--slide-bg)` on `var(--slide-accent)`: reversed title bars, chapter dividers, and dark process headers.
- `var(--slide-bg)` on `var(--slide-primary)`: compact buttons, pills, or metric chips where the blue fill is the focal point.
- `var(--slide-bg)` on `var(--ppt-accent3)`: dark cover or footer bars with strong contrast.
- `var(--slide-text)` on `color-mix(in srgb, var(--ppt-accent4) 18%, var(--slide-bg))`: bright cyan-tinted callouts where the fill should stay light enough for black text.

## Tint And Shade Recipes
- Soft brand wash: `color-mix(in srgb, var(--slide-accent) 12%, var(--slide-bg))`, use for callout cards, chapter intros, and subtle grouping.
- Strong brand wash: `color-mix(in srgb, var(--slide-accent) 24%, var(--slide-bg))`, use for emphasized panels or diagram containers.
- Active blue wash: `color-mix(in srgb, var(--slide-primary) 14%, var(--slide-bg))`, use for selected states and KPI backplates.
- Neutral grey surface: `color-mix(in srgb, var(--slide-secondary) 72%, var(--slide-bg))`, use for legends, side panels, or low-contrast grouping blocks.
- Deep navy shell: `color-mix(in srgb, var(--ppt-accent3) 88%, var(--slide-bg))`, use for dark footer bands and cover shells with white text.
- Cyan signal tint: `color-mix(in srgb, var(--ppt-accent4) 18%, var(--slide-bg))`, use for digital/data highlights without turning the slide into a bright cyan surface.
- Purple innovation tint: `color-mix(in srgb, var(--ppt-accent5) 16%, var(--slide-bg))`, use sparingly for transformation or future-state emphasis.

## Slide Recipes
- Title/body slide: white background, title in `var(--slide-accent)`, body in `var(--slide-text)`, muted support copy in `var(--slide-text-muted)`, and one `var(--slide-primary)` line or chip for emphasis.
- Dense handout slide: keep the body area mostly white, use `var(--slide-accent)` for subheads, `var(--slide-secondary)` or a 12% brand wash for grouped evidence blocks, and reserve cyan/purple/pink for at most one local emphasis.
- Diagram/process slide: use `var(--slide-accent)` for the structural frame, `var(--slide-primary)` for the key path or selected node, and `var(--ppt-accent4)` only as a single energy highlight where the eye should land first.
- Risk/attention slide: use `var(--slide-accent)` or `var(--ppt-accent3)` for the container frame and `var(--ppt-accent6)` only for editorial attention callouts; the extracted master does not define a full RAG system, so avoid inventing status semantics from these accents.

## Do
- Use `var(--slide-accent)` as the default heading color across business-content slides.
- Use `var(--slide-primary)` as the secondary emphasis layer below the brand anchor.
- Build soft fills from `color-mix(...)` with existing `--slide-*` or `--ppt-*` tokens only.
- Keep most business slides on `var(--slide-bg)` with dark text and limited accent deployment.
- Treat `var(--ppt-accent4)`, `var(--ppt-accent5)`, and `var(--ppt-accent6)` as controlled accents, not general-purpose surfaces.
- Prefer `var(--slide-font-heading)` for titles and `var(--slide-font-body)` for paragraphs, labels, and tabular content.

## Don't
- Don't replace the core blue system with purple or pink on standard executive/content slides.
- Don't use `var(--ppt-accent4)` as a large solid background behind small text.
- Don't turn every diagram node into a different accent color; the palette supports hierarchy, not rainbow coding.
- Don't invent red/yellow/green status tokens that are not present in the extracted master.
- Don't hardcode hex values in templates when an equivalent `var(--slide-*)` or `var(--ppt-*)` token exists.
- Don't use the expressive accents to carry long-form text blocks.

## CSS Cookbook
- Title: `style={{ fontFamily: "var(--slide-font-heading)", color: "var(--slide-accent)" }}`
- Body copy: `style={{ fontFamily: "var(--slide-font-body)", color: "var(--slide-text)" }}`
- Muted label: `style={{ color: "var(--slide-text-muted)" }}`
- Primary emphasis chip: `style={{ backgroundColor: "var(--slide-primary)", color: "var(--slide-bg)" }}`
- Dark header shell: `style={{ backgroundColor: "var(--ppt-accent3)", color: "var(--slide-bg)" }}`
- Soft brand panel: `style={{ backgroundColor: "color-mix(in srgb, var(--slide-accent) 12%, var(--slide-bg))" }}`
- Neutral panel: `style={{ backgroundColor: "color-mix(in srgb, var(--slide-secondary) 72%, var(--slide-bg))" }}`
- Cyan data highlight: `style={{ backgroundColor: "color-mix(in srgb, var(--ppt-accent4) 18%, var(--slide-bg))", color: "var(--slide-text)" }}`
- Innovation highlight: `style={{ borderColor: "var(--ppt-accent5)", color: "var(--ppt-accent5)" }}`

## Derivation Notes
- `var(--slide-accent)` and `var(--ppt-dk2)` share the same value, so the master clearly signals dark corporate blue as the headline/structural anchor.
- `var(--slide-primary)` aligns with `accent1`, which makes the brighter blue the natural second-order emphasis token rather than the main heading color.
- `var(--slide-secondary)` maps to `lt2`, giving the theme a neutral grey support surface instead of a colored background system.
- `var(--ppt-accent4)` also matches the hyperlink token, which is a strong cue to keep cyan for links, digital energy, and chart highlights.
- `var(--ppt-folHlink)` is the only non-blue cool support tone in the extracted theme; use it as a restrained trust/followed-state accent, not as a core brand surface.
- No extra CI notes were supplied in the bootstrap prompt, so this guide is derived only from the PPTX master and its palette variants.