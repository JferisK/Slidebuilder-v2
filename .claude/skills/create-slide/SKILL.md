---
name: create-slide
description: Orchestrates the 4-role slide production team (Narrative → Visual → Brand → QA) with loop-back on failure. Use when user asks to build, create, or rework a slide. Caps at 3 loops then escalates.
---

# create-slide

Orchestrate the full 4-role team to produce one slide that answers the user's brief in the visual identity of the loaded PPTX.

## Canonical spec

Read `docs/skills/create-slide.md` in the repo root. It is the source of truth for this skill and describes the loop, dispatch order, handoff formats, and escape conditions.

## Claude-specific dispatch

Each role is a subagent under `.claude/agents/`. Dispatch them in order via the Task tool:

1. `subagent_type: narrative-director` → prompt with the user's brief + template context. Wait for `# Narrative Output`.
2. `subagent_type: visual-director` → prompt with the Narrative Output verbatim. Wait for `# Visual Output`.
3. `subagent_type: brand-guardian` → prompt with the Visual Output. Wait for `# Brand Verdict`.
   - If `reject`: loop back to visual-director with the violation list. Increment loop counter. Do not proceed to QA.
4. Run a real fit/screenshot check against the mapped PPTX layout when available. Verify placeholder fit before QA.
5. `subagent_type: qa-lead` → prompt with all prior outputs + fit/screenshot result + the original brief + current loop counter. Wait for `# QA Verdict`.
   - If `approve`: present final output + process summary to the user. Done.
   - If `loop_back`: re-dispatch the named `loop_target` role. Increment loop counter.
   - If `escalate`: present the diagnostic + [A]/[B]/[C] options to the user. Stop.

Track the loop counter yourself. Do not exceed 3. After loop 3, you must escalate even if QA says loop_back.

Dense workshop slides should also prefer existing repo UI patterns (`src/components/ui/*`, CVA variants, shared slide primitives) before inventing one-off wrappers.

## Pre-flight

Before dispatching Narrative Director, ensure template context is loaded (see sibling skill `load-template-context`). If no PPTX is loaded, refuse and ask the user to upload one.

## Post-flight

On approve, the final output is a concrete slide definition — either a diff against an existing template file or a new template file. Apply it only if the user asks you to; otherwise just present it.
