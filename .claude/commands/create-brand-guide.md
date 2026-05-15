# /create-brand-guide

$ARGUMENTS

## What to do

Follow the canonical skill spec at `docs/skills/create-brand-guide.md`.

## Execution

1. Read the Template Context provided in the command arguments or conversation.
2. Resolve the target file from `expected_path`, or use `.slidebuilder/brand-guides/<template_id>/<master_id>.md`.
3. If the user has not already answered this, ask exactly once:
   `Hast du zusaetzliche CI-/Brand-Vorgaben oder soll ich nur den PPTX-Master nutzen?`
4. If the user provides extra CI/brand notes, incorporate them.
5. Otherwise derive the guide yourself from the PPTX master, full PowerPoint palette, tint/shade variants, fonts, and contrast.
6. Create or update the target Markdown file. Do not modify frontend state.

## Source of truth

The generated Markdown file is the source of truth. SlideForge only points users to this command and can copy Template Context; it does not store Brand Guides in browser state.
