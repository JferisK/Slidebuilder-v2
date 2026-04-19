# CLAUDE.md

**👉 First, read [`AGENTS.md`](./AGENTS.md) in the repo root.** It contains the canonical project conventions (Theme Contract, CodeSlide system, team process) that apply to every agent on every platform.

This file only covers Claude Code specifics.

---

## Claude Code specifics

### Slide authoring
When the user asks to create, modify, or review a slide, you are expected to mentally run through the 4-role team process described in `AGENTS.md` §7 before presenting output:

1. **Narrative Director** — is the message clear and well-ordered?
2. **Visual Director** — is the right template picked, slots mapped sensibly?
3. **Brand Guardian** — are all colors from `var(--slide-*)`? No hardcoded Tailwind color classes? No fixed pixels?
4. **QA Lead** — does it meet the brief?

If any check fails, fix before replying. Don't ship a "first draft" that violates §3 of AGENTS.md.

### Reference example
`src/slides/templates/24-PyramidHierarchy.tsx` is the **canonical good example** of a theme-aware slide. When authoring a new template, read it first, then mirror the pattern.

### Commands (Stage 3, planned)
- `/create-slide <brief>` — orchestrates Narrative → Visual → Brand → QA in a review loop.
- Subagents in `.claude/agents/`: `narrative-director`, `visual-director`, `brand-guardian`, `qa-lead`.
- Skills in `.claude/skills/`: `load-template-context`, `validate-against-theme`.

Until Stage 3 lands, spawn subagents manually via the Task tool when a slide task warrants parallel/isolated reasoning (e.g. researching a template before picking it).

### What *not* to do
- Don't invent new CSS variables — the 8 in `theme.cssVars` are the only allowed color/type tokens.
- Don't add a `variant` value to `WireBlock` without updating `_shared.tsx` variantStyles.
- Don't answer slide questions without first checking the uploaded master's theme (available in `buildCopilotPrompt` output or `slideStore.masters[activeMasterId].theme`).
