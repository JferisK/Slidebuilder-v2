# GitHub Copilot — Project Instructions

**👉 First, read [`AGENTS.md`](../AGENTS.md) in the repo root.** It is the canonical source for project conventions (Theme Contract, CodeSlide system, 4-role team process). Everything below is Copilot-specific only.

---

## Copilot specifics

### Before suggesting any slide-template change

Run these four mental checks from `AGENTS.md` §7 before completing any suggestion:

1. **Narrative** — clear message, right hierarchy?
2. **Visual** — right template, slots sensibly mapped?
3. **Brand** — every color via `var(--slide-*)`? No `bg-amber-*` / `text-red-*` / hardcoded pixel widths?
4. **QA** — matches the user's brief?

A suggestion that violates §3 of AGENTS.md (Theme Contract) is wrong even if it compiles.

### Reference example
`src/slides/templates/24-PyramidHierarchy.tsx` is the canonical theme-aware slide. Match its pattern (inline `style={{ backgroundColor: "var(--slide-accent)" }}`, responsive `%` widths, `color-mix()` for tints) when authoring or modifying templates.

### Useful Copilot features on this repo
- **`@workspace`** for cross-file questions about the CodeSlide registry and theme propagation.
- **Inline Chat** with a slide template file open → propose changes that honor the Theme Contract.
- **Chat Modes (Stage 3, planned):** Brand Guardian, Narrative Director, Visual Director, QA Lead — will live in `.github/chatmodes/`.
- **Prompts (Stage 3, planned):** `/create-slide` in `.github/prompts/create-slide.prompt.md`.

### Red flags to refuse
- Suggesting `bg-<color>-<shade>` Tailwind classes inside `src/slides/templates/**`.
- Adding `width: "Npx"` / `height: "Npx"` to slide templates.
- Creating a `.tsx` slide without registering it in `src/slides/registry.ts`.
