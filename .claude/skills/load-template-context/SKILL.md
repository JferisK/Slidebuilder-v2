---
name: load-template-context
description: Loads the currently active PPTX's theme, dimensions, and layouts into the conversation so roles can reason over concrete values. Use before any slide creation or rework flow.
---

# load-template-context

## Canonical spec

Read `docs/skills/load-template-context.md` in the repo root. Follow it exactly.

## Claude-specific lookup order

1. Try `Read` on `.slidebuilder/template-context.md`. If it exists, use it verbatim.
2. Otherwise, look at `src/components/AnnotationLayer.tsx` — the `buildCopilotPrompt` function produces the same data. Read its output shape and ask the user to paste a recent prompt export if the app is running.
3. Otherwise, `Read` `src/store/slideStore.ts` to understand the store shape, and ask the user to share the `theme.cssVars` for the currently loaded PPTX.
4. If none of the above works: refuse. Do not fabricate. Tell the user to upload a PPTX and either export the context or paste the prompt output.

## Output

Return the `# Template Context` block from the canonical spec. Hand it to the Project Manager as-is.
