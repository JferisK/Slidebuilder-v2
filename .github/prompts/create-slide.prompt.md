---
mode: agent
description: Orchestrate the 6-role slide team (Project Manager → Content Strategist → Visual Designer → Illustrator → Brand Guardian → QA Manager) with loop-back on failure. Max 3 loops, then escalate.
---

# /create-slide

User brief: ${input:brief:What should the slide say?}

## Canonical spec

Read `docs/skills/create-slide.md` in the workspace. That file is the orchestrator spec — follow it exactly. The role specs are in `docs/roles/*.md` and the Copilot chatmode adapters are in `.github/chatmodes/`.

## Execution

Copilot does not spawn subagents the way Claude Code does. Run the roles sequentially in one chat session, switching to the matching chatmode for each step:

1. **Pre-flight**: invoke the `load-template-context` prompt. If no template context, stop and tell the user to upload a PPTX.

2. **Phase 1 — Intake**:
   a. Switch to `project-manager` chatmode. Input: the user's brief + template context.
   b. If the PM returns `# Clarifying Questions`, ask them and stop.
   c. Otherwise capture `# Brief Lock`.

3. **Phase 2 — Concept**:
   a. Switch to `content-strategist` chatmode. Input: Brief Lock + template context. Output: `# Narrative Output`.
   b. Switch to `visual-designer` chatmode. Input: Brief Lock + Narrative Output + template context. Output: `# Visual Output`.

4. **Phase 3 — Design**:
   a. Switch to `illustrator` chatmode. Input: Narrative Output + Visual Output + screenshot/render context. Output: `# Illustrator Verdict`.
      - On `reject`: return to `visual-designer` with the visual issues. Increment loop_count.
   b. Switch to `brand-guardian` chatmode. Input: Visual Output + Illustrator updates. Output: `# Brand Verdict`.
      - On `reject`: return to `visual-designer` with the violation list. Increment loop_count.
   c. Run a real fit/screenshot check against the mapped PPTX layout when available.

5. **Phase 4 — QA**:
   a. Switch to `qa-manager` chatmode. Input: all prior outputs + fit/screenshot result + the brief + loop_count. Output: `# QA Verdict`.
   b. On `approve`: present the final slide output + a short process summary.
   c. On `loop_back`: increment loop_count, optionally re-run `project-manager` for strategy re-lock on loop 2+ or thrash, then re-run the named `loop_target` role and all downstream roles.
   d. On `escalate`: present the escalation diagnostic + `[A]`/`[B]`/`[C]` options.

6. **Hard cap**: after loop_count reaches 3, QA or PM must escalate.

## Constraints

- Never merge the 6 roles into one monolithic response. The separation is the value.
- Never fabricate theme values if no PPTX is loaded.
- Never skip a role because the slide looks simple.
- Never approve a slide without checking real placeholder fit when prompt/context provides that geometry.
