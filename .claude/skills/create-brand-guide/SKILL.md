---
name: create-brand-guide
description: Creates a paste-ready Brand Guide for an uploaded SlideForge PPTX master from copied Template Context, palette variants, and optional CI notes.
---

# create-brand-guide

Create a Brand Guide for the active SlideForge PPTX master.

## Canonical spec

Read `docs/skills/create-brand-guide.md` in the repo root. Follow it exactly.

## Claude-specific behavior

- Use the Template Context pasted by the user or copied from SlideForge SettingsPanel.
- Ask the one CI-notes question from the canonical spec only if the answer is not already present.
- Return Markdown only, ready to paste into the app's Brand Guide field.
- Do not edit files or create `.slidebuilder/brand-guides` as the primary storage path.
