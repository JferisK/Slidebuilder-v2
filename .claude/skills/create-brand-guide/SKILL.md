---
name: create-brand-guide
description: Creates or updates the repo Markdown Brand Guide for an uploaded SlideForge PPTX master from copied Template Context, palette variants, and optional CI notes.
---

# create-brand-guide

Create or update the Brand Guide file for the active SlideForge PPTX master.

## Canonical spec

Read `docs/skills/create-brand-guide.md` in the repo root. Follow it exactly.

## Claude-specific behavior

- Use the Template Context pasted by the user or copied from SlideForge SettingsPanel.
- In one-time bootstrap mode, also persist `.slidebuilder/template-context.md` from the supplied Template Context before or alongside the Brand Guide write.
- Ask the one CI-notes question from the canonical spec only if the answer is not already present.
- Resolve the target path from `expected_path`, or use `.slidebuilder/brand-guides/<template_id>/<master_id>.md`.
- Create or update that Markdown file.
- Do not paste back into the app; SlideForge does not store Brand Guides in browser state.
