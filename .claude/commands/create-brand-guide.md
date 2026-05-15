# /create-brand-guide

$ARGUMENTS

## What to do

Follow the canonical skill spec at `docs/skills/create-brand-guide.md`.

## Execution

1. Read the Template Context provided in the command arguments or conversation.
2. If the user has not already answered this, ask exactly once:
   `Hast du zusaetzliche CI-/Brand-Vorgaben oder soll ich nur den PPTX-Master nutzen?`
3. If the user provides extra CI/brand notes, incorporate them.
4. Otherwise derive the guide yourself from the PPTX master, full PowerPoint palette, tint/shade variants, fonts, and contrast.
5. Return only paste-ready Markdown. Do not edit files.

## Source of truth

The generated Markdown is meant to be pasted back into SlideForge and stored on the uploaded template/master in browser state. Repo files are optional exports, not the primary source.
