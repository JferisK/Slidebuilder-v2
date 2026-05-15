---
mode: agent
description: Create a Brand Guide for the active SlideForge PPTX master from copied Template Context. Output paste-ready Markdown for the app.
---

# /create-brand-guide

Template context: ${input:template_context:Paste the Template Context copied from SlideForge SettingsPanel.}

## Canonical spec

Read `docs/skills/create-brand-guide.md` in the workspace. Follow it exactly.

## Execution

1. Verify the Template Context includes a template id, master id, `--slide-*` vars, and the PowerPoint palette/variants.
2. If the user has not already answered this, ask exactly once:
   `Hast du zusaetzliche CI-/Brand-Vorgaben oder soll ich nur den PPTX-Master nutzen?`
3. If the user provides extra notes, incorporate them. Otherwise derive the Brand Guide from the PPTX master yourself.
4. Return only the Markdown Brand Guide described in the canonical spec.

## Important

- Do not edit files.
- Do not invent colors outside the supplied master/palette.
- The app stores the final Markdown in browser template state after the user pastes it back into SlideForge.
