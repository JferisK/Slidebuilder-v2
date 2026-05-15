# Skill: create-slide

> Canonical skill spec — platform-neutral. Referenced by `.claude/commands/create-slide.md`, `.claude/skills/create-slide/SKILL.md`, `.github/prompts/create-slide.prompt.md`. Codex reads this file directly.

## Purpose
Orchestrate the 6-role agency team through 4 phases (Intake → Concept → Design → QA) to produce a single slide that answers the user's brief in the visual identity of the currently loaded PPTX.

## When to invoke
- User asks "baue mir einen Slide über X" / "create a slide about X".
- User pastes a brief, bullet list, or topic and wants a finished CodeSlide variant.
- User says "überarbeite Slide N" where the rework touches narrative, layout, brand, or visual drama.

## The 6 roles (canonical specs in `docs/roles/`)

| # | Role | File | Owns |
|---|---|---|---|
| 1 | **Project Manager** | `docs/roles/project-manager.md` | Process, Brief Lock, Strategy Lock gate, loop budget, escalation |
| 2 | **Content Strategist** | `docs/roles/content-strategist.md` | What is said, in what hierarchy (Pyramid / MECE / SCQA / Action Title / Duarte) |
| 3 | **Visual Designer** | `docs/roles/visual-designer.md` | Template pick, slot mapping, cognitive load, whitespace, fit |
| 4 | **Illustrator** | `docs/roles/illustrator.md` | Visual metaphor, focal point, drama, asset prompts |
| 5 | **Brand Guardian** | `docs/roles/brand-guardian.md` | Theme Contract (`var(--slide-*)` only), CI compliance |
| 6 | **QA Manager** | `docs/roles/qa-manager.md` | 7-point QA-Matrix, loop-back routing, final approve/escalate |

## Inputs
- **Brief**: the user's free-form request.
- **Template context**: the currently loaded PPTX's theme + layouts + Brand Guide status. Source order:
  1. `.slidebuilder/template-context.md` (Stage 2, if it exists)
  2. Otherwise: read theme from `src/store/slideStore.ts` / `buildCopilotPrompt` output
  3. Otherwise: ask the user to upload a PPTX first — do not fabricate theme values
- **Brand Guide**: if present, pass it verbatim to Visual Designer, Brand Guardian, and QA. If missing, warn that brand interpretation is weaker and recommend `/create-brand-guide`, but do not hard-block slide creation.

## The 4 phases

```
brief
  ↓
[Phase 1 — Intake & Briefing]
  Project Manager validates brief.
  Fast path: if brief is clear, silent auto-lock → Brief Lock.
  Slow path: up to 3 clarifying questions, then stop.
  ↓
[Phase 2 — Concept & Storyboard]
  Content Strategist produces Narrative Output
    (action_title, SCQA, key_statements, slide_type_hint, tone).
  Visual Designer picks codeSlideId + maps slots + proposed_diff.
  Strategy Lock gate:
    - loop 1: auto-pass (fast path, silent).
    - loop ≥ 2: PM re-verifies alignment explicitly (Strategy Re-Lock).
  ↓
[Phase 3 — Design & Production]
  Illustrator reviews for focal point, metaphor, drama.
    - approve → continue
    - reject  → loop back to Visual Designer with visual_changes
  Brand Guardian scans proposed_diff for Theme Contract violations and reports brand_guide_status.
    - approve → continue
    - reject  → loop back to Visual Designer with violation list
  Fit/Screenshot check (mechanical, no LLM) against mapped PPTX layout.
    - pass → continue
    - fail → loop back to Visual Designer with fit.issues
  ↓
[Phase 4 — QA & Delivery]
  QA Manager runs the 7-point QA-Matrix.
    - approve    → present final + process summary to user
    - loop_back  → re-dispatch qa.loop_target; increment loop_count
    - escalate   → present diagnostic + [A]/[B]/[C] options
  ↓
final output to user
```

**Hard cap: 3 end-to-end loops.** After loop 3, QA Manager must escalate regardless of remaining issues. The orchestrator enforces this even if QA says `loop_back`.

## Orchestrator pseudocode

```
INPUT:  user_brief, template_context
STATE:  loop_count = 0

# Phase 1 — Intake
pm = dispatch(project_manager, {brief: user_brief, template_context})
if pm.verdict == "needs_clarification":
    present(pm.questions)
    return
brief_lock = pm.brief_lock

# Phase 2 — Concept
narrative = dispatch(content_strategist, {brief_lock, template_context})

# Strategy Lock gate
if loop_count >= 1:
    strategy = dispatch(project_manager, {
        mode: "re_lock", brief_lock, narrative, loop_count,
    })
    if strategy.verdict == "force_escalate":
        present(strategy); return

visual = dispatch(visual_designer, {narrative, brief_lock, template_context})

# Phase 3 — Design
illu = dispatch(illustrator, {narrative, visual})
if illu.verdict == "reject":
    loop_count += 1
    if loop_count >= 3: force_escalate(); return
    goto Phase 3 with visual_designer(illu.visual_changes)

brand = dispatch(brand_guardian, {visual, illustrator_updates: illu.changes})
if brand.verdict == "reject":
    loop_count += 1
    if loop_count >= 3: force_escalate(); return
    goto Phase 3 with visual_designer(brand.violations)

fit = run_fit_check(visual, template_context)   # mechanical
if fit.verdict == "fail":
    loop_count += 1
    if loop_count >= 3: force_escalate(); return
    goto Phase 3 with visual_designer(fit.issues)

# Phase 4 — QA
qa = dispatch(qa_manager, {
    brief_lock, narrative, visual, illu, brand, fit, loop_count,
})
match qa.verdict:
  "approve":
      present(final_output, process_summary); return
  "loop_back":
      loop_count += 1
      if loop_count >= 3: force_escalate(); return
      goto qa.loop_target
  "escalate":
      present(qa.diagnostic, qa.options); return
```

### PM dispatch rules

- **Phase 1** — always dispatch. Fast path: if brief is lockable, silent auto-lock (no clarifying questions). Slow path: max 3 questions, then stop and wait for user.
- **Strategy Lock re-check** — dispatch PM only when `loop_count >= 1` **or** when QA flags thrash (same role rejecting for the same reason across 2 consecutive loops).

### Fast-path default

The PM runs but is not user-visible unless it asks questions or escalates. The user sees a single slide come back, not 6 role outputs. The process summary in QA's approve verdict lists the loop history compactly.

### Mandatory fit / screenshot check

Before QA approval, verify the slide against the **real mapped PPTX layout**, not just a free preview:

- use placeholder `id`, `x`, `y`, `w`, `h`, and slide size from prompt/context
- confirm the body content fully fits the mapped placeholder height
- inspect a rendered screenshot when available
- reject clipped bottom zones, hidden footer strips, or body compositions that only work outside the real layout

If screenshot generation is unavailable, treat the slide as **not yet fully verified** and escalate or block rather than silently approving.

## Quality gates for the orchestrator itself

- [ ] Template context was loaded before Content Strategist was dispatched.
- [ ] Brand Guide status (`present` or `missing`) was carried from template context into Brand Guardian and QA.
- [ ] Project Manager ran in Phase 1 (even in fast path, silently).
- [ ] Each role's output is passed to the next role unmodified (no summarization that strips required fields).
- [ ] Loop counter is tracked and included in every QA Manager dispatch.
- [ ] Illustrator ran before Brand Guardian (Illustrator may trigger a Visual Designer re-emit that Brand then scans).
- [ ] Real placeholder fit was checked before QA approval.
- [ ] Screenshot/render output was reviewed when available.
- [ ] On escalation, the diagnostic is presented to the user — the orchestrator does not silently retry or silently accept.
- [ ] Final approved output uses `var(--slide-*)` (Brand Guardian would have rejected otherwise, but double-check).
- [ ] If the user explicitly rejected a selected intro/summary block, no later loop reintroduces the same content as a paraphrased summary.

## Platform mapping

- **Claude Code**: each `dispatch(role)` is a `Task` tool call with `subagent_type: <role-slug>`. Adapter files live in `.claude/agents/`.
- **GitHub Copilot**: each `dispatch(role)` is a chatmode switch by the user (or Agent Mode). Adapters live in `.github/chatmodes/`.
- **OpenAI Codex**: Codex reads this pseudocode directly and simulates the 6 roles inline, reading `docs/roles/*.md` for each role's spec.

## Dispatch instructions (platform-agnostic)

For each role, hand off the previous role's structured output **verbatim** and let the role read the canonical spec in `docs/roles/<role>.md`. Do **not** paraphrase the role's job into the handoff — the role already knows what to do.

1. **Project Manager** (`docs/roles/project-manager.md`)
   - Input: user brief + template context.
   - Output on clear brief: `# Brief Lock`. On vague brief: `# Clarifying Questions` (stop the flow, wait for user).

2. **Content Strategist** (`docs/roles/content-strategist.md`)
   - Input: Brief Lock.
   - Output: `# Narrative Output` (action_title, scqa, key_statements, slide_type_hint, audience, tone).

3. **Visual Designer** (`docs/roles/visual-designer.md`)
   - Input: Narrative Output + Brief Lock + template context.
   - Output: `# Visual Output` (codeSlideId, slots, rationale, composition_notes, cognitive_load_budget, proposed_diff).

4. **Illustrator** (`docs/roles/illustrator.md`)
   - Input: Narrative Output + Visual Output + screenshot/render context when available.
   - Output: `# Illustrator Verdict` — `approve` or `reject` with `visual_changes` and optional `placeholder_prompts`.
   - On reject: loop back to Visual Designer.

5. **Brand Guardian** (`docs/roles/brand-guardian.md`)
   - Input: Visual Output + Illustrator updates + Brand Guide status/content.
   - Output: `# Brand Verdict` — `approve` or `reject` with `brand_guide_status`, violations + cookbook fixes.
   - On reject: loop back to Visual Designer.

6. **QA Manager** (`docs/roles/qa-manager.md`)
   - Input: Brief Lock + Narrative Output + Visual Output + Illustrator Verdict + Brand Verdict + Brand Guide status + fit/screenshot verdict + original brief + loop counter.
   - Output: `# QA Verdict` — `approve` | `loop_back` | `escalate`.

## Do not

- Skip a role because "it's a simple slide". All 6 always run (PM silent in fast path).
- Skip the fit/screenshot check because "the preview looks close enough".
- Merge roles into one prompt. The separation is the value — one role's blind spot is another role's focus.
- Let the loop exceed 3 iterations silently. Escalate.
- Fabricate theme values if no PPTX is loaded. Refuse and ask the user to upload first.
- Reintroduce an explicitly rejected intro/summary block as a cleaner or shorter summary. Replace it structurally or deepen it.
