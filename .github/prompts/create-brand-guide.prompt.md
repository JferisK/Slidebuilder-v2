---
mode: agent
description: Create or update the repo Markdown Brand Guide for the active SlideForge PPTX master from copied Template Context.
---

# /create-brand-guide

Template context: ${input:template_context:Paste the Template Context copied from SlideForge SettingsPanel.}

## Canonical spec

Read `docs/skills/create-brand-guide.md` in the workspace. Follow it exactly.

## Execution

1. Verify the Template Context includes a template id, master id, `--slide-*` vars, and the PowerPoint palette/variants.
2. If the user has not already answered this, ask exactly once:
   `Hast du zusaetzliche CI-/Brand-Vorgaben oder soll ich nur den PPTX-Master nutzen?`
3. Resolve the target file from `expected_path`, or create `.slidebuilder/brand-guides/<template_id>/<master_id>.md`.
4. If the user provides extra notes, incorporate them. Otherwise derive the Brand Guide from the PPTX master yourself.
5. Create or update the target Markdown file described in the canonical spec.

## Important

- Edit only the target Brand Guide Markdown file.
- Do not invent colors outside the supplied master/palette.
- The app does not store Brand Guides in browser state; the repo Markdown file is the source of truth.
