# Skill: create-slide

> Canonical skill spec — platform-neutral. Referenced by `.claude/commands/create-slide.md`, `.claude/skills/create-slide/SKILL.md`, `.github/prompts/create-slide.prompt.md`.

## Purpose
Orchestrate the 4-role team (Narrative → Visual → Brand → QA) to produce a single slide that answers the user's brief in the visual identity of the currently loaded PPTX template.

## When to invoke
- User asks "baue mir einen Slide über X" / "create a slide about X".
- User pastes a brief, bullet list, or topic and wants a finished CodeSlide variant.
- User says "überarbeite slide N" where the rework touches narrative, layout, or brand.

## Inputs
- **Brief**: the user's free-form request.
- **Template context**: the currently loaded PPTX's theme + layouts. Source order:
  1. `.slidebuilder/template-context.md` (Stage 2, if it exists)
  2. Otherwise: read theme from `src/stores/slideStore.ts` / `buildCopilotPrompt` output
  3. Otherwise: ask the user to upload a PPTX first — do not fabricate theme values

## The loop (strict order)

```
brief
  ↓
[1] Narrative Director  → headline + key_statements + slide_type_hint
  ↓
[2] Visual Director     → codeSlideId + slot mapping + proposed_diff
  ↓
[3] Brand Guardian      → approve / reject (veto power)
  ↓  (if reject → back to Visual)
[4] QA Lead             → approve / loop_back / escalate
  ↓  (if loop_back → back to named role)
  ↓  (if escalate → return diagnostic to user)
final output to user
```

Max **3 loops** per slide. After loop 3, QA Lead must escalate — do not let the loop run forever.

## Dispatch instructions (platform-agnostic)

For each role, hand off the previous role's structured output verbatim and let the role read the canonical spec in `docs/roles/<role>.md`. Do **not** paraphrase the role's job into the handoff — the role already knows what to do.

1. **Narrative Director** (`docs/roles/narrative-director.md`)
   - Input: user brief + template context.
   - Output: `# Narrative Output` block (headline, key_statements, slide_type_hint, audience, tone).

2. **Visual Director** (`docs/roles/visual-director.md`)
   - Input: Narrative Output.
   - Output: `# Visual Output` block (codeSlideId, slots, rationale, proposed_diff).

3. **Brand Guardian** (`docs/roles/brand-guardian.md`)
   - Input: Visual Output (especially proposed_diff).
   - Output: `# Brand Verdict` — `approve` or `reject` with violation list.
   - On reject: loop back to Visual Director with the violation list. Do not proceed to QA.

4. **QA Lead** (`docs/roles/qa-lead.md`)
   - Input: Narrative Output + Visual Output + Brand Verdict + original brief + loop counter.
   - Output: `# QA Verdict` — `approve` | `loop_back` | `escalate`.
   - On approve: present final output to user with process summary.
   - On loop_back: return to named `loop_target` role, increment loop counter.
   - On escalate: present diagnostic with [A]/[B]/[C] options to user.

## Quality gates for the orchestrator itself

- [ ] Template context was loaded before Narrative Director was dispatched.
- [ ] Each role's output is passed to the next role unmodified (no summarization that strips required fields).
- [ ] Loop counter is tracked and included in every QA Lead dispatch.
- [ ] On escalation, the diagnostic is presented to the user — the orchestrator does not silently retry or silently accept.
- [ ] Final approved output uses `var(--slide-*)` (Brand Guardian would have rejected otherwise, but double-check).

## Do not

- Skip a role because "it's a simple slide". All 4 always run.
- Merge roles into one prompt. The separation is the value — one role's blind spot is another role's focus.
- Let the loop exceed 3 iterations silently. Escalate.
- Fabricate theme values if no PPTX is loaded. Refuse and ask the user to upload first.
