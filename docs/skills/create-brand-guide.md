# Skill: create-brand-guide

> Canonical skill spec - platform-neutral. Referenced by `.claude/commands/create-brand-guide.md`, `.claude/skills/create-brand-guide/SKILL.md`, and `.github/prompts/create-brand-guide.prompt.md`.

## Purpose

Create a reusable Brand Guide for one uploaded PowerPoint master so slide-authoring agents understand the corporate-design logic behind the extracted colors, not only the raw theme values.

The guide is meant to be pasted back into SlideForge and stored on the uploaded template/master in browser state. A repo file export is optional and never the source of truth.

## When to invoke

- The SettingsPanel says `Brand Guide Status: missing`.
- A user uploaded a new PPTX master and wants Copilot/Claude to create slides from it.
- Brand Guardian or QA reports weak brand interpretation, unclear accent semantics, or inconsistent color use.

## Inputs

- **Template Context** from SlideForge SettingsPanel, including:
  - template id/name/file
  - master id/name
  - `--slide-*` CSS vars
  - full `--ppt-*` palette
  - PowerPoint-style tint/shade variants
  - fonts and layout inventory
- **Optional user CI notes** gathered by asking once:
  - `Hast du zusaetzliche CI-/Brand-Vorgaben oder soll ich nur den PPTX-Master nutzen?`

If the user provides extra CI notes, incorporate them. If not, derive the guide yourself from the PPTX master.

## Process

1. Read the Template Context completely.
2. Ask the one CI-notes question above if the answer is not already present.
3. Interpret the palette:
   - identify likely background, text, heading, primary brand, support surface, accent, warning/risk, success/trust, link, and muted roles
   - use contrast and typical PowerPoint theme semantics (`lt1`, `dk1`, `lt2`, `dk2`, `accent1..6`)
   - use the provided tint/shade variants for soft fills and deep fills
4. Define safe pairings:
   - foreground/background combinations
   - title/body/accent usage
   - tinted fill recipes
   - combinations to avoid
5. Produce Markdown only, ready to paste into SlideForge.

## Color Role Model

When naming reusable roles, reference colors structurally instead of inventing new raw tokens:

```ts
{ kind: "slide", name: "primary" }
{ kind: "slide", name: "accent" }
{ kind: "ppt", name: "accent1" }
{ kind: "ppt", name: "dk1" }
```

In code examples, still use CSS variables:

```tsx
style={{ color: "var(--slide-primary)" }}
style={{ backgroundColor: "color-mix(in srgb, var(--ppt-accent2) 12%, var(--slide-bg))" }}
```

## Output Format

Return exactly one Markdown document:

```md
# Brand Guide: <template/master name>

## Status
- template_id: "<id>"
- master_id: "<id>"
- source: "pptx-master" | "pptx-master-plus-user-notes"
- confidence: "high" | "medium" | "low"

## Palette Interpretation
- <semantic role>: <token reference>, rationale, best use

## Safe Color Pairings
- <foreground> on <background>: use case

## Tint And Shade Recipes
- <recipe name>: `color-mix(...)`, use case

## Slide Recipes
- Title/body slide: ...
- Dense handout slide: ...
- Diagram/process slide: ...
- Risk/attention slide: ...

## Do
- ...

## Don't
- ...

## CSS Cookbook
- ...

## Derivation Notes
- ...
```

## Quality Gates

- [ ] The guide uses only extracted PPTX/theme values and optional user CI notes.
- [ ] No raw, newly invented brand colors.
- [ ] Every semantic role has a token reference and rationale.
- [ ] Safe pairings mention contrast/readability.
- [ ] Recipes are practical for SlideForge templates and AGENTS.md Theme Contract.
- [ ] Output is Markdown only, with no implementation diff.

## Do Not

- Modify repo files as part of this skill.
- Treat `.slidebuilder/brand-guides/*.md` as source of truth.
- Ask repeated brand questions. Ask once, then derive.
- Generate a slide. This skill only creates the Brand Guide.
