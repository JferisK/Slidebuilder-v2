---
description: Orchestrate the 6-role slide team (Project Manager → Content Strategist → Visual Designer → Illustrator → Brand Guardian → QA Manager) to produce a slide. Usage: /create-slide <brief>
argument-hint: <brief>
---

# /create-slide

The user's brief:

$ARGUMENTS

## What to do

Follow the canonical orchestrator spec at `docs/skills/create-slide.md`.

## Execution order

1. **Pre-flight**: invoke the `load-template-context` skill. If no template context is available, stop and ask the user to upload a PPTX.

2. **Phase 1 — Intake**:
   a. Dispatch `project-manager` (Task tool, `subagent_type: "project-manager"`) with the brief + template context.
   b. If PM returns `# Clarifying Questions`, ask them and stop.
   c. Otherwise capture `# Brief Lock`.

3. **Phase 2 — Concept**:
   a. Dispatch `content-strategist` with Brief Lock + template context. Capture `# Narrative Output`.
   b. Dispatch `visual-designer` with Brief Lock + Narrative Output + template context. Capture `# Visual Output`.

4. **Phase 3 — Design**:
   a. Dispatch `illustrator` with Narrative + Visual outputs and screenshot/render context. Capture `# Illustrator Verdict`.
      - On `reject`: loop back to `visual-designer` with the visual issues. Increment loop_count.
   b. Dispatch `brand-guardian` with Visual Output + Illustrator updates. Capture `# Brand Verdict`.
      - On `reject`: loop back to `visual-designer` with the violation list. Increment loop_count.
   c. Run a real fit/screenshot check against the mapped PPTX layout when available.

5. **Phase 4 — QA**:
   a. Dispatch `qa-manager` with all prior outputs + fit/screenshot result + the original brief + loop_count. Capture `# QA Verdict`.
   b. On `approve`: present the final slide output + a short process summary to the user. Done.
   c. On `loop_back`: increment loop_count, optionally re-run `project-manager` for strategy re-lock on loop 2+ or thrash, then re-dispatch the named `loop_target` role and all downstream roles.
   d. On `escalate`: present the diagnostic + [A]/[B]/[C] options to the user. Stop.

6. **Hard cap**: after loop_count reaches 3, do not loop further. PM/QA must escalate.

## Output

Never fabricate a "done" slide if the gates didn't pass. Never skip a role because the slide looks simple. The separation is the value.
Never approve a slide without checking the real mapped placeholder fit when that information is available.
