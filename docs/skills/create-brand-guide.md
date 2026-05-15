# Skill: create-brand-guide

> Canonical skill spec - platform-neutral. Referenced by `.claude/commands/create-brand-guide.md`, `.claude/skills/create-brand-guide/SKILL.md`, and `.github/prompts/create-brand-guide.prompt.md`.

## Purpose

Create or update the repo Markdown Brand Guide for one uploaded PowerPoint slide master so slide-authoring agents understand the corporate-design logic behind the extracted colors, not only the raw theme values.

The guide is a file in the workspace, not browser state. SlideForge only shows a reminder and can copy Template Context; it never stores or edits Brand Guides in the frontend.

## Source Of Truth

Store one file per slide master:

```text
.slidebuilder/brand-guides/<template_id>/<master_id>.md
```

Use the exact `template_id` and `master_id` from the Template Context. Create parent folders when missing. If the file already exists, update it in place instead of creating a duplicate.

## When To Invoke

- The SettingsPanel says the Brand Guide is repo-based and points to a missing master guide.
- A user uploaded a new PPTX master and wants Copilot/Claude to create slides from it.
- Brand Guardian or QA reports weak brand interpretation, unclear accent semantics, or inconsistent color use.

## Inputs

- **Template Context** copied from SlideForge SettingsPanel, including:
  - template id/name/file
  - master id/name
  - expected Brand Guide path
  - `--slide-*` CSS vars
  - full `--ppt-*` palette
  - PowerPoint-style tint/shade variants
  - fonts and layout inventory
- **Optional user CI notes** gathered by asking once:
  - `Hast du zusaetzliche CI-/Brand-Vorgaben oder soll ich nur den PPTX-Master nutzen?`

If the user provides extra CI notes, incorporate them. If not, derive the guide yourself from the PPTX master.

## Process

1. Read the Template Context completely.
2. Resolve the target path from `expected_path`, or construct `.slidebuilder/brand-guides/<template_id>/<master_id>.md`.
3. Ask the one CI-notes question above if the answer is not already present.
4. Interpret the palette:
   - identify likely background, text, heading, primary brand, support surface, accent, warning/risk, success/trust, link, and muted roles
   - use contrast and typical PowerPoint theme semantics (`lt1`, `dk1`, `lt2`, `dk2`, `accent1..6`)
   - use the provided tint/shade variants for soft fills and deep fills
5. Define safe pairings, title/body/accent usage, tinted fill recipes, and combinations to avoid.
6. Write the Markdown Brand Guide to the target file.

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

## File Format

Write exactly one Markdown document:

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

- [ ] The file path is `.slidebuilder/brand-guides/<template_id>/<master_id>.md`.
- [ ] The guide uses only extracted PPTX/theme values and optional user CI notes.
- [ ] No raw, newly invented brand colors.
- [ ] Every semantic role has a token reference and rationale.
- [ ] Safe pairings mention contrast/readability.
- [ ] Recipes are practical for SlideForge templates and AGENTS.md Theme Contract.
- [ ] No frontend storage, pasteback, or IndexedDB Brand Guide step is introduced.

## Do Not

- Generate a slide. This skill only creates/updates the Brand Guide file.
- Store the guide in SlideForge browser state.
- Ask repeated brand questions. Ask once, then derive.
