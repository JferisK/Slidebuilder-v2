# GitHub Copilot — Project Instructions

**👉 First, read [`AGENTS.md`](../AGENTS.md) in the repo root.** It is the canonical source for project conventions (Theme Contract, CodeSlide system, 6-role team process). Everything below is Copilot-specific only.

---

## Copilot specifics

### Before suggesting any slide-template change

Run these six mental checks from `AGENTS.md` §7 before completing any suggestion:

1. **Project Manager** — is the brief specific enough to lock without guessing?
2. **Content Strategist** — clear message, action title, and right hierarchy?
3. **Visual Designer** — right template, slots sensibly mapped, and placeholder budget respected?
4. **Illustrator** — visible focal point, screenshot readability, and non-generic composition?
5. **Brand Guardian** — every color via `var(--slide-*)`? No `bg-amber-*` / `text-red-*` / hardcoded pixel widths?
6. **QA Manager** — matches the user's brief, the 7-point QA matrix, and real placeholder geometry?

A suggestion that violates §3 of AGENTS.md (Theme Contract) is wrong even if it compiles.

For slides mapped into real PPTX layouts, fit is a hard gate:
- use the real title/body placeholder geometry from prompt/context
- do not assume a free preview equals the real layout
- dense handout slides may carry more text, but they still must fit cleanly
- screenshot-backed review is preferred when available

If the user explicitly rejects a selected intro/summary block, do not recreate it in slightly different words.
- no new generic lead summary
- either remove the block, add real source-backed depth, or replace it with a different information structure
- this rule applies even if the rewritten summary sounds shorter or more polished

### Reference example
`src/slides/templates/24-PyramidHierarchy.tsx` is the canonical theme-aware slide. Match its pattern (inline `style={{ backgroundColor: "var(--slide-accent)" }}`, responsive `%` widths, `color-mix()` for tints) when authoring or modifying templates.

### Useful Copilot features on this repo
- **`@workspace`** for cross-file questions about the CodeSlide registry and theme propagation.
- **Inline Chat** with a slide template file open → propose changes that honor the Theme Contract.
- **Chat Modes:** Project Manager, Content Strategist, Visual Designer, Illustrator, Brand Guardian, QA Manager — live in `.github/chatmodes/`.
- **Prompts:** `/create-slide` and the supporting prompts live in `.github/prompts/`.

Prefer existing repo UI patterns before inventing one-off wrappers:
- `src/components/ui/*`
- CVA-based variants
- shared slide primitives in `_shared.tsx`

### Red flags to refuse
- Suggesting `bg-<color>-<shade>` Tailwind classes inside `src/slides/templates/**`.
- Adding `width: "Npx"` / `height: "Npx"` to slide templates.
- Creating a `.tsx` slide without registering it in `src/slides/registry.ts`.
- Replacing an explicitly rejected summary/intro block with another paraphrased summary/intro block.
