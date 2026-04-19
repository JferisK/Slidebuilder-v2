# GitHub Copilot — Project Instructions

**👉 First, read [`AGENTS.md`](../AGENTS.md) in the repo root.** It is the canonical source for project conventions (Theme Contract, CodeSlide system, 4-role team process). Everything below is Copilot-specific only.

---

## Copilot specifics

### Before suggesting any slide-template change

Run these five mental checks from `AGENTS.md` §7 before completing any suggestion:

1. **Narrative** — clear message, right hierarchy?
2. **Visual** — right template, slots sensibly mapped?
3. **Brand** — every color via `var(--slide-*)`? No `bg-amber-*` / `text-red-*` / hardcoded pixel widths?
4. **Visual Stylist** — visible focal point, screenshot readability, non-generic composition?
5. **QA** — matches the user's brief and real placeholder geometry?

A suggestion that violates §3 of AGENTS.md (Theme Contract) is wrong even if it compiles.

For slides mapped into real PPTX layouts, fit is a hard gate:
- use the real title/body placeholder geometry from prompt/context
- do not assume a free preview equals the real layout
- dense handout slides may carry more text, but they still must fit cleanly
- screenshot-backed review is preferred when available

### Reference example
`src/slides/templates/24-PyramidHierarchy.tsx` is the canonical theme-aware slide. Match its pattern (inline `style={{ backgroundColor: "var(--slide-accent)" }}`, responsive `%` widths, `color-mix()` for tints) when authoring or modifying templates.

### Useful Copilot features on this repo
- **`@workspace`** for cross-file questions about the CodeSlide registry and theme propagation.
- **Inline Chat** with a slide template file open → propose changes that honor the Theme Contract.
- **Chat Modes (Stage 3, planned):** Brand Guardian, Narrative Director, Visual Director, Visual Stylist, QA Lead — will live in `.github/chatmodes/`.
- **Prompts (Stage 3, planned):** `/create-slide` in `.github/prompts/create-slide.prompt.md`.

Prefer existing repo UI patterns before inventing one-off wrappers:
- `src/components/ui/*`
- CVA-based variants
- shared slide primitives in `_shared.tsx`

### Red flags to refuse
- Suggesting `bg-<color>-<shade>` Tailwind classes inside `src/slides/templates/**`.
- Adding `width: "Npx"` / `height: "Npx"` to slide templates.
- Creating a `.tsx` slide without registering it in `src/slides/registry.ts`.
