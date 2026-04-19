---
description: Orchestrate the 4-role team (Narrative → Visual → Brand → QA) to produce a slide. Usage: /create-slide <brief>
argument-hint: <brief>
---

# /create-slide

The user's brief:

$ARGUMENTS

## What to do

Follow the canonical orchestrator spec at `docs/skills/create-slide.md`.

## Execution order

1. **Pre-flight**: invoke the `load-template-context` skill. If no template context is available, stop and ask the user to upload a PPTX.

2. **Loop 1** (loop_count = 1):
   a. Dispatch `narrative-director` (Task tool, `subagent_type: "narrative-director"`) with the brief + template context. Capture the `# Narrative Output`.
   b. Dispatch `visual-director` with the Narrative Output verbatim. Capture the `# Visual Output`.
   c. Dispatch `brand-guardian` with the Visual Output. Capture the `# Brand Verdict`.
      - On `reject`: loop back to `visual-director` with the violation list. Increment loop_count. Re-enter step (c) after visual re-emits.
   d. Run a real fit/screenshot check against the mapped PPTX layout when available.
   e. Dispatch `qa-lead` with all prior outputs + fit/screenshot result + the original brief + loop_count. Capture `# QA Verdict`.

3. **On QA `approve`**: present the final slide output + a short process summary to the user. Done.

4. **On QA `loop_back`**: increment loop_count, re-dispatch the named `loop_target` role, then re-run the downstream chain.

5. **Hard cap**: after loop_count reaches 3, do not loop further. QA must escalate. Present the escalation diagnostic + [A]/[B]/[C] options to the user.

## Output

Never fabricate a "done" slide if the gates didn't pass. Never skip a role because the slide looks simple. The separation is the value.
Never approve a slide without checking the real mapped placeholder fit when that information is available.
