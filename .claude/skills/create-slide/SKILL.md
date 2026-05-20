---
name: create-slide
description: Orchestrates the 6-role slide team (Project Manager → Content Strategist → Visual Designer → Illustrator → Brand Guardian → QA Manager) with loop-back on failure. Use when user asks to build, create, or rework a slide. Caps at 3 loops then escalates.
---

# create-slide

Orchestrate the full 6-role slide team to produce one slide that answers the user's brief in the visual identity of the loaded PPTX.

## Canonical spec

Read `docs/skills/create-slide.md` in the repo root. It is the source of truth for this skill and describes the loop, dispatch order, handoff formats, and escape conditions.

## Claude-specific dispatch

Each role is a subagent under `.claude/agents/`. Dispatch them in order via the Task tool:

1. `subagent_type: project-manager` → prompt with the user's brief + template context. Wait for `# Brief Lock` or `# Clarifying Questions`.
   - If PM returns clarifying questions: present them to the user and stop.
2. `subagent_type: content-strategist` → prompt with the Brief Lock + template context. Wait for `# Narrative Output`.
3. `subagent_type: visual-designer` → prompt with the Brief Lock + Narrative Output + template context. Wait for `# Visual Output`.
4. `subagent_type: illustrator` → prompt with the Narrative + Visual outputs and screenshot/render context. Wait for `# Illustrator Verdict`.
   - If `reject`: loop back to `visual-designer` with the visual changes. Increment loop counter. Do not proceed to Brand or QA.
5. `subagent_type: brand-guardian` → prompt with the Visual Output + Illustrator updates. Wait for `# Brand Verdict`.
   - If `reject`: loop back to `visual-designer` with the violation list. Increment loop counter. Do not proceed to QA.
6. Run a real fit/screenshot check against the mapped PPTX layout when available. Verify placeholder fit before QA.
7. `subagent_type: qa-manager` → prompt with all prior outputs + fit/screenshot result + the original brief + current loop counter. Wait for `# QA Verdict`.
   - If `approve`: present final output + process summary to the user. Done.
   - If `loop_back`: re-dispatch the named `loop_target` role. Increment loop counter.
   - If `escalate`: present the diagnostic + [A]/[B]/[C] options to the user. Stop.

Track the loop counter yourself. Do not exceed 3. After loop 3, you must escalate even if QA says loop_back.

On loop 2+ or when QA flags thrash, re-dispatch `project-manager` in strategy re-lock mode before continuing downstream.

Dense workshop slides should also prefer existing repo UI patterns (`src/components/ui/*`, CVA variants, shared slide primitives) before inventing one-off wrappers.

## Pre-flight

Before dispatching Project Manager, ensure template context is loaded (see sibling skill `load-template-context`). If the repo artifacts are missing, tell the user to run the one-time bootstrap from `Settings -> Brand Guide -> Prompt kopieren` for the loaded PPTX.

## Post-flight

On approve, the final output is a concrete slide definition — either a diff against an existing template file or a new template file. Apply it only if the user asks you to; otherwise just present it.
