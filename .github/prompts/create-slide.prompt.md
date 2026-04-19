---
mode: agent
description: Orchestrate the slide review team (Narrative → Visual → Brand → Visual Stylist → QA) with loop-back on failure. Max 3 loops, then escalate.
---

# /create-slide

User brief: ${input:brief:What should the slide say?}

## Canonical spec

Read `docs/skills/create-slide.md` in the workspace. That file is the orchestrator spec — follow it exactly. The role specs are in `docs/roles/*.md` and the Copilot chatmode adapters are in `.github/chatmodes/`.

## Execution

Copilot does not spawn subagents the way Claude Code does. Run the roles sequentially in one chat session, switching to the matching chatmode for each step:

1. **Pre-flight**: invoke the `load-template-context` prompt. If no template context, stop and tell the user to upload a PPTX.

2. **Loop 1** (loop_count = 1):
   a. Switch to `narrative-director` chatmode. Input: the user's brief + template context. Output: `# Narrative Output`.
   b. Switch to `visual-director` chatmode. Input: Narrative Output. Output: `# Visual Output`.
   c. Switch to `brand-guardian` chatmode. Input: Visual Output. Output: `# Brand Verdict`.
      - On `reject`: return to `visual-director` with the violation list. Increment loop_count. Re-run step (c) after re-emit.
   d. Switch to `visual-stylist` chatmode. Input: Narrative Output + Visual Output + screenshot/render context. Output: `# Visual Stylist Verdict`.
      - On `reject`: return to `visual-director` with the visual issues. Increment loop_count.
   e. Run a real fit/screenshot check against the mapped PPTX layout when available.
   f. Switch to `qa-lead` chatmode. Input: all prior outputs + fit/screenshot result + the brief + loop_count. Output: `# QA Verdict`.

3. **On QA `approve`**: present the final slide output + a short process summary.

4. **On QA `loop_back`**: increment loop_count, re-run the named `loop_target` role, then re-run downstream.

5. **Hard cap**: after loop_count reaches 3, QA must escalate. Present the escalation diagnostic + `[A]`/`[B]`/`[C]` options.

## Constraints

- Never merge the 4 roles into one monolithic response. The separation is the value.
- Never fabricate theme values if no PPTX is loaded.
- Never skip a role because the slide looks simple.
- Never approve a slide without checking real placeholder fit when prompt/context provides that geometry.
