# Skill: load-template-context

> Canonical skill spec — platform-neutral. Referenced by `.claude/skills/load-template-context/SKILL.md` and `.github/prompts/load-template-context.prompt.md`.

## Purpose
Load the currently active PPTX template's theme, dimensions, layouts, palette variants, and Brand Guide status into the conversation so downstream roles (Content Strategist, Visual Designer, Brand Guardian) can reason over concrete values instead of guessing.

## When to invoke
- Before the Project Manager's Brief Lock in Phase 1 of the `create-slide` orchestrator.
- Whenever the user says "ich habe eine neue PPTX hochgeladen" / "I uploaded a new template" and asks for new slides.
- When a role reports that it is missing theme or layout information.

## Next role
The Project Manager consumes this context as part of its Brief Lock. The Content Strategist then receives the locked brief + this context verbatim.

## Source of truth (in priority order)

1. **`.slidebuilder/template-context.md`** — once Stage 2 lands, this is the canonical file. Read it first; if present and recent, use it verbatim.
2. **`buildCopilotPrompt()` output** (`src/components/AnnotationLayer.tsx`) — embedded in any copy-prompt action from the running app. Contains theme cssVars, Brand Guide status/content, aspect, and placeholder positions.
3. **`src/stores/slideStore.ts`** — the live Zustand store while the app is running. If you have access to runtime state, read `activePresentation.theme.cssVars`, `activeMaster.theme.palette`, template `brandGuides`, and `slides[].layout`.
4. **Fallback**: if none of the above is available, **do not fabricate values**. Respond: "Kein Template-Kontext gefunden. Bitte lade eine PPTX in der App und exportiere den Kontext, oder füge den `buildCopilotPrompt`-Output ein."

## What to extract

Produce a compact summary the next role can use:

```
# Template Context
source: ".slidebuilder/template-context.md" | "buildCopilotPrompt()" | "slideStore"
aspect_ratio: "16:9" | "4:3" | "custom WxH"
slide_size_emu: { cx: <number>, cy: <number> }   # from <p:sldSz> in ppt/presentation.xml
theme:
  --slide-bg: "#..."
  --slide-primary: "#..."
  --slide-secondary: "#..."
  --slide-accent: "#..."
  --slide-text: "#..."
  --slide-text-muted: "#..."
  --slide-font-heading: "<family>"
  --slide-font-body: "<family>"
powerpoint_palette:
  accent1:
    color: "#..."
    variants:
      - label: "Heller 80%"
        color: "#..."
brand_guide_status: "present" | "missing"
brand_guide_markdown: |
  <full guide when present; otherwise empty>
layouts:
  - name: "Title Slide"
    placeholders: ["title", "subtitle"]
  - name: "Content"
    placeholders: ["title", "body", "footer"]
  # ... up to the first 10 layouts
reference_slides:
  - index: 0
    layout: "Title Slide"
    text_summary: "…"
  # ... 3–5 entries
```

## Quality gates

- [ ] Every theme cssVar is present and non-empty. If a var is missing, say so explicitly — do not silently fill with a default.
- [ ] PowerPoint palette (`lt1`, `dk1`, `lt2`, `dk2`, `accent1..6`) is included when available.
- [ ] Brand Guide status is included. Missing guide is allowed, but must be explicit.
- [ ] Aspect ratio matches `slide_size_emu` (cx/cy ratio, not hardcoded).
- [ ] Layout list is non-empty. An empty list almost always means the PPTX failed to parse.
- [ ] Reference slides are real — do not invent content.

## Do not

- Hardcode theme values from memory of prior sessions. The active PPTX is authoritative.
- Cache across sessions. Always re-read on invocation.
- Guess layout names. If the file doesn't name them, label as `Layout #N`.
