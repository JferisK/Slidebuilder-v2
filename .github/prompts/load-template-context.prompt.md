---
mode: agent
description: Load the currently active PPTX's theme, dimensions, and layouts into the conversation. Run before any slide creation or rework.
---

# /load-template-context

## Canonical spec

Read `docs/skills/load-template-context.md` in the workspace. Follow it exactly.

## Copilot lookup order

1. Try to open `.slidebuilder/template-context.md` via the `codebase` tool. If it exists, use it verbatim.
2. Otherwise, open `src/components/AnnotationLayer.tsx` and locate `buildCopilotPrompt` — it produces the same data at runtime. Ask the user to paste a recent prompt export from the running app.
3. Otherwise, open `src/store/slideStore.ts`, inspect the store shape, and ask the user to share the current `theme.cssVars`.
4. If none of the above works: **refuse**. Do not fabricate. Tell the user to upload a PPTX and either export the context or paste the prompt output.

## Output

Produce the `# Template Context` block from the canonical spec. Hand it to the Project Manager as-is.
