---
name: Create Slide
description: Orchestrate the 6-role slide team (Project Manager → Content Strategist → Visual Designer → Illustrator → Brand Guardian → QA Manager) with loop-back on failure. Max 3 loops, then escalate.
argument-hint: What should the slide say?
agent: slide-orchestrator
---

# /create-slide

User brief: ${input:brief:What should the slide say?}

## Canonical spec

Read `docs/skills/create-slide.md` in the workspace. That file is the orchestrator spec — follow it exactly. The role specs are in `docs/roles/*.md` and the Copilot agent adapters are in `.github/agents/`.

## Execution

Use the `slide-orchestrator` custom agent to dispatch the role agents in `.github/agents/`. Each role handoff must preserve the previous structured block verbatim.

1. **Pre-flight**: invoke the `load-template-context` prompt. If no template context is available in the repo yet, stop and tell the user to run the one-time bootstrap from `Settings -> Brand Guide -> Prompt kopieren` for the loaded PPTX.

2. **Phase 1 — Intake**:
   a. Delegate to the `project-manager` agent. Input: the user's brief + template context.
   b. If the PM returns `# Clarifying Questions`, ask them and stop.
   c. Otherwise capture `# Brief Lock`.

3. **Phase 2 — Concept**:
   a. Delegate to the `content-strategist` agent. Input: Brief Lock + template context. Output: `# Narrative Output`.
   b. Delegate to the `visual-designer` agent. Input: Brief Lock + Narrative Output + template context. Output: `# Visual Output`.

4. **Phase 3 — Design**:
   a. Execute the Visual Designer's proposed code changes when edit access is available.
   b. Immediately generate the latest `# Loop Artifacts` block by running the repo's deterministic render/screenshot path when it exists. That block must include `loop_count`, `edited_files`, `render_status`, `screenshot_path`, `fit_status`, `fit_issues`, `open_issues`, and `next_action`.
   c. If the repo cannot yet generate a deterministic screenshot, stop and report the technical blocker instead of pretending the slide is fully verified.
   d. Delegate to the `illustrator` agent. Input: Narrative Output + Visual Output + latest Loop Artifacts + screenshot/render context. Output: `# Illustrator Verdict`.
      - On `reject`: return to `visual-designer` with the visual issues. Increment loop_count.
   e. Delegate to the `brand-guardian` agent. Input: Visual Output + Illustrator updates + latest Loop Artifacts. Output: `# Brand Verdict`.
      - On `reject`: return to `visual-designer` with the violation list. Increment loop_count.
   f. Run a real fit/screenshot check against the mapped PPTX layout when available and refresh the Loop Artifacts block with the result.

5. **Phase 4 — QA**:
   a. Delegate to the `qa-manager` agent. Input: all prior outputs + latest Loop Artifacts + fit/screenshot result + the brief + loop_count. Output: `# QA Verdict`.
   b. On `approve`: present the final slide output, latest screenshot artifact, and a short process summary, then wait for user approval before any finalization beyond the code edit itself.
   c. On `loop_back`: increment loop_count, optionally re-run `project-manager` for strategy re-lock on loop 2+ or thrash, then re-run the named `loop_target` role and all downstream roles.
   d. On `escalate`: present the escalation diagnostic + `[A]`/`[B]`/`[C]` options.

6. **Hard cap**: after loop_count reaches 3, QA or PM must escalate.

## Constraints

- Never merge the 6 roles into one monolithic response. The separation is the value.
- Never fabricate theme values if no PPTX is loaded.
- Never skip a role because the slide looks simple.
- Never approve a slide without checking real placeholder fit when prompt/context provides that geometry.
- Never treat a missing screenshot as "good enough" for QA approval.
