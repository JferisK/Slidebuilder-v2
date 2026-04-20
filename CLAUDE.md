# CLAUDE.md

**👉 First, read [`AGENTS.md`](./AGENTS.md) in the repo root.** It contains the canonical project conventions (Theme Contract, CodeSlide system, team process) that apply to every agent on every platform.

This file only covers Claude Code specifics.

---

## Claude Code specifics

### Slide authoring
When the user asks to create, modify, or review a slide, you are expected to mentally run through the 6-role team process described in `AGENTS.md` §7 before presenting output:

1. **Project Manager** — is the brief actually lockable, or are key inputs missing?
2. **Content Strategist** — is the message clear, claim-first, and well-ordered?
3. **Visual Designer** — is the right template picked, slots mapped sensibly, and the placeholder budget respected?
4. **Illustrator** — is there a focal point, visual anchor, and non-generic composition?
5. **Brand Guardian** — are all colors from `var(--slide-*)`? No hardcoded Tailwind color classes? No fixed pixels?
6. **QA Manager** — does it meet the brief, the 7-point QA matrix, and the real PPTX fit constraints?

If any check fails, fix before replying. Don't ship a "first draft" that violates §3 of AGENTS.md.

For slides that map into a real PPTX layout, treat placeholder fit as a hard gate:
- inspect the real body/title placeholder geometry from prompt/context
- do not trust a free preview over the mapped PPTX layout
- prefer screenshot-backed approval when a render can be generated
- dense handout slides must still fit without clipping

If the user explicitly rejects a selected intro/summary block, do not reintroduce it in paraphrased form.
- no replacement with another generic summary
- either remove it, deepen it with real source content, or replace it with a structurally different block
- this applies even if the new wording sounds cleaner

### Reference example
`src/slides/templates/24-PyramidHierarchy.tsx` is the **canonical good example** of a theme-aware slide. When authoring a new template, read it first, then mirror the pattern.

### Commands and adapters
- `/create-slide <brief>` — orchestrates Project Manager → Content Strategist → Visual Designer → Illustrator → Brand Guardian → QA Manager in a review loop.
- Subagents in `.claude/agents/`: `project-manager`, `content-strategist`, `visual-designer`, `illustrator`, `brand-guardian`, `qa-manager`.
- Skills in `.claude/skills/`: `load-template-context`, `validate-against-theme`.

Use the adapter files as the role entrypoints. The PM still runs first, even when it stays silent in fast path.

Prefer existing repo UI patterns before inventing ad hoc slide shells:
- `src/components/ui/*`
- CVA / `class-variance-authority`
- shared slide primitives in `src/slides/**/_shared.tsx`

### What *not* to do
- Don't invent new CSS variables — the 8 in `theme.cssVars` are the only allowed color/type tokens.
- Don't add a `variant` value to `WireBlock` without updating `_shared.tsx` variantStyles.
- Don't answer slide questions without first checking the uploaded master's theme (available in `buildCopilotPrompt` output or `slideStore.masters[activeMasterId].theme`).
- Don't replace an explicitly rejected summary/intro block with a new summary/intro block that says the same thing more elegantly.
