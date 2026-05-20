---
name: Load Template Context
description: Load the currently active PPTX's theme, palette variants, repo Brand Guide status, dimensions, and layouts into the conversation. Run before any slide creation or rework.
agent: agent
tools: [read, search]
---

# /load-template-context

## Canonical spec

Read `docs/skills/load-template-context.md` in the workspace. Follow it exactly.

## Copilot lookup order

1. Try to open `.slidebuilder/template-context.md` via the `codebase` tool. If it exists, use it verbatim.
2. If the Template Context includes a Brand Guide path, read `.slidebuilder/brand-guides/<template_id>/<master_id>.md` when it exists.
3. Otherwise, tell the user to run the one-time bootstrap from `Settings -> Brand Guide -> Prompt kopieren`. That bootstrap should create both `.slidebuilder/template-context.md` and the Brand Guide file.
4. Otherwise, open `src/store/slideStore.ts`, inspect the store shape, and ask the user to share the current template context export or the active theme/layout data only to complete the missing bootstrap.
5. If none of the above works: **refuse**. Do not fabricate. Tell the user to upload a PPTX and run the Brand Guide bootstrap from the Settings menu.

## Output

Produce the `# Template Context` block from the canonical spec. Hand it to the Project Manager as-is.
