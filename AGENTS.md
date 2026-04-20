# AGENTS.md — Slidebuilder-v2 (SlideForge)

> **Read this first.** Canonical project conventions for **any** AI agent or developer working on this repo. Claude Code, OpenAI Codex, GitHub Copilot — all three honor this file. Platform-specific pointers live in `CLAUDE.md` and `.github/copilot-instructions.md` but defer here for the substance.

---

## 1. What this project is

**Slidebuilder-v2** (internal codename: SlideForge) is a browser app that lets users upload a `.pptx` file, pick one of 25 React-authored slide templates (`CodeSlide`s) for each slide, and export the composed result as PNG or back to PPTX. It is **not** a general design tool — its whole purpose is to render content **inside the visual identity of the uploaded PowerPoint master**: same colors, same typography, same dimensions.

**Stack:** React 18 + TypeScript + Vite + Tailwind + Zustand. No backend. All parsing runs in the browser via JSZip (`src/parser/pptxParser.ts`).

---

## 2. Architecture at a glance

```
user uploads .pptx
        │
        ▼
src/parser/pptxParser.ts   → produces ParsedPresentation { masters[], slideSize }
                              Each master has theme.cssVars + layouts[] (placeholders)
        │
        ▼
src/store/slideStore.ts    → Zustand store holds masters, slides, active selection
        │
        ▼
src/components/DynamicSlide.tsx
        │                    Applies theme.cssVars as inline style on the slide root
        │                    (line ~232: `const themeStyle = theme.cssVars as React.CSSProperties`)
        │                    → every descendant can use var(--slide-primary) etc.
        ▼
src/slides/templates/NN-*.tsx  → React CodeSlide authoring
                                  Reads colors EXCLUSIVELY via var(--slide-*)
                                  — never via Tailwind color classes.
        │
        ▼
src/components/ExportButton.tsx → PNG export via html2canvas or PPTX re-emit
```

---

## 3. The Theme Contract (**most important rule**)

Any slide template rendered inside `DynamicSlide` has these CSS custom properties on its ancestor element:

| Variable | Purpose | Fallback |
|---|---|---|
| `--slide-bg` | Page background | `#ffffff` |
| `--slide-primary` | Dominant brand color (titles, strong fills) | `#1f4e79` |
| `--slide-secondary` | Soft fill / muted surface | `#f2f2f2` |
| `--slide-accent` | Highlight / CTA color | `#c00000` |
| `--slide-text` | Body text | `#1a1a1a` |
| `--slide-text-muted` | Hints, secondary copy | `#666666` |
| `--slide-font-heading` | Heading font stack | `Calibri, sans-serif` |
| `--slide-font-body` | Body font stack | `Calibri, sans-serif` |

**Rules:**

1. ✅ **DO** use `style={{ color: "var(--slide-primary)" }}` or `style={{ backgroundColor: "var(--slide-accent)" }}` for any color-carrying styling.
2. ✅ **DO** use Tailwind for **layout** (grid, flex, spacing, sizing, typography scale).
3. ❌ **DO NOT** hardcode Tailwind color classes (`bg-amber-100`, `text-blue-600`, `border-red-500`, `bg-slate-700`, etc.) in slide templates.
4. ✅ **Faded / tinted variants:** use `color-mix(in srgb, var(--slide-accent) 15%, transparent)` — modern CSS, supported everywhere.
5. 🟨 **`slate-*` is tolerated only for wireframe/debug UI** (e.g. placeholder labels in the template preview), never on user-visible production output.

**Canonical reference example:** [`src/slides/templates/24-PyramidHierarchy.tsx`](src/slides/templates/24-PyramidHierarchy.tsx) — demonstrates the correct pattern (CSS-var inline styles + responsive percentage widths). Imitate it.

**Shared variants:** `src/slides/templates/_shared.tsx` exports `WireBlock` with a `variant` prop (`default | title | metric | chart | accent | muted | dark`). All variants resolve to CSS-var styles under the hood — prefer the variant prop over inline styles when semantics match.

---

## 4. Dimensions & layout

- **Aspect ratio** comes from `slideSize` on the active master (`widthEmu × heightEmu`). Typical: 16:9 (9144000 × 5143500 EMU → 1280 × 720 px render).
- **No fixed pixel widths in templates.** Use `%`, Tailwind `w-*`, flex/grid. The slide re-scales via CSS transform in `SlideCanvas.tsx`; hardcoded widths break this.
- **Placeholder coordinates** are stored as **percentages** (`x`, `y`, `w`, `h` in `Placeholder.position` — range 0-100). Use them as-is, don't convert to pixels.

### Fit Contract

Theme correctness is not enough. A slide is only valid if it also fits the **real PPTX placeholder geometry** it is mapped into.

**Rules:**

1. ✅ Treat the mapped body placeholder as a **hard height budget**. Do not assume a free canvas preview equals the real layout.
2. ✅ Use the real placeholder data from the prompt/context, including `id`, `x`, `y`, `w`, `h`, and slide size.
3. ✅ Dense slides must solve overflow at the **template/content structure** level — not by globally shrinking the whole slide in `DynamicSlide`.
4. ✅ For `title + body` layouts such as `One Column Text`, avoid a second hero-title zone inside the body unless the body content is correspondingly reduced.
5. ✅ Approval requires a **real screenshot/render check** against the mapped layout when available.
6. ❌ Do not approve slides with clipped bottom zones, hidden footer bands, or content that only works in a looser preview.

**Default dense-handout structure for constrained body placeholders:**
- one short lead/leitzeile
- one or two compact content columns
- one short conclusion strip

This is the preferred fallback before inventing more complex diagram shells.

---

## 5. The CodeSlide / Slot system

File: `src/slides/types.ts`

```ts
export interface CodeSlide {
  id: string;           // stable, kebab-case — referenced from Slide.codeSlideId
  name: string;         // human label (usually "NN · Title")
  description: string;  // what this layout is for / when to pick it
  slots: CodeSlideSlot[];
  preferredTypes?: Record<string, string[]>;  // slot key → PPTX placeholder types
}

export interface CodeSlideSlot {
  key: string;          // "title", "content", "kpi", etc. — stable semantic name
  label: string;        // German label for the UI
  description?: string;
  Component: React.FC;  // Renders this slot
}
```

**How slot ↔ PPTX placeholder mapping works:** A `Slide` in the store carries `codeSlideId` (which template) and `codeSlotMapping` (semantic key → placeholder idx). This lets the same template work with PPTX layouts whose placeholder idx values differ. `preferredTypes` drives auto-mapping on assignment — specify sensible defaults.

**When adding a new template:**

1. Create `src/slides/templates/NN-<PascalName>.tsx` (pick next number).
2. Export a `CodeSlide` object + default export.
3. Register it in `src/slides/registry.ts`.
4. Slots should be semantic (`title`, `content`, `kpi`, `source`) — not positional (`left`, `right`).
5. Follow the Theme Contract (§3). No hardcoded colors.

---

## 6. Prompt assembly (how agents see the slide)

`src/components/AnnotationLayer.tsx` builds `buildCopilotPrompt()` when the user clicks for feedback. It injects:

- Master / layout name, slide id, ordinal
- Render dimensions + aspect ratio
- All 8 theme CSS vars (verbatim, resolved)
- All placeholders in the layout with position + current content
- Click position + nearest placeholder
- User's feedback comment

Agents receiving this prompt should **not** ask for colors / dimensions — they are already in the prompt. They **should** read `AGENTS.md` for authoring rules and the Slide 24 reference example.

They should also treat the prompt as the source of truth for:
- active `codeSlideId`
- placeholder `id` values
- the real body height budget
- whether the slide is being reviewed as a dense handout

If the prompt includes a screenshot/render status, that status is part of the QA surface, not an optional hint.

**Stage 2 (planned):** The prompt will also embed a serialized `.slidebuilder/template-context.md` with full layout inventory and sample slides.

---

## 7. The team process (6 roles, 4 phases)

Slide creation runs the playbook of a professional presentation agency: a **Project Manager** orchestrates **4 phases** (Intake → Concept → Design → QA) using a team of **6 specialists**. The flow is a review loop with loop-back on failure, hard-capped at 3 iterations.

### The 6 roles

| # | Role | Canonical spec | Mission | Veto |
|---|---|---|---|---|
| 1 | **Project Manager** | [`docs/roles/project-manager.md`](docs/roles/project-manager.md) | Own the process. Validate brief, lock strategy, track loop budget, escalate when stuck. | Refuses on vague brief or missing PPTX; forces escalation at loop 3. |
| 2 | **Content Strategist** | [`docs/roles/content-strategist.md`](docs/roles/content-strategist.md) | Decide *what* is said and in what hierarchy. Pyramid / MECE / SCQA / Action Titles / Duarte contrast. | Rejects if core message cannot be derived or content exceeds one slide. |
| 3 | **Visual Designer** | [`docs/roles/visual-designer.md`](docs/roles/visual-designer.md) | Pick the right CodeSlide template, map slots, control cognitive load, whitespace, placeholder fit. | Rejects if no template fits, slots overflow, or placeholder height is exceeded. |
| 4 | **Illustrator** | [`docs/roles/illustrator.md`](docs/roles/illustrator.md) | Ensure visual metaphor, focal point, drama. Propose asset prompts when assets are missing. | Rejects visually flat, dashboard-like, or anchor-less compositions. |
| 5 | **Brand Guardian** | [`docs/roles/brand-guardian.md`](docs/roles/brand-guardian.md) | Enforce the §3 Theme Contract — every color, font, dimension via `var(--slide-*)`. | Rejects any hardcoded color, raw hex, or fixed pixel width. |
| 6 | **QA Manager** | [`docs/roles/qa-manager.md`](docs/roles/qa-manager.md) | Final gate. Run 7-point QA-Matrix. Approve, loop back to the right role, or escalate. | Escalates to user after 3 loops. |

### The 4 phases

1. **Intake & Briefing** — PM validates the brief (Objective, Audience, Core Message, Brand, Technical Context). **Fast path:** if the brief is lockable, PM silent-auto-locks and the user never sees questions. **Slow path:** up to 3 clarifying questions, then stop.
2. **Concept & Storyboard** — Content Strategist emits `Narrative Output` (Action Title + SCQA + key statements + slide_type_hint). Visual Designer picks `codeSlideId` and maps slots. **Strategy Lock gate:** auto-passes on loop 1, PM re-verifies alignment on loop ≥ 2 or on QA thrash.
3. **Design & Production** — Illustrator reviews visual drama and focal point. Brand Guardian scans the diff for Theme Contract violations. A **mechanical fit/screenshot check** verifies the slide fits the mapped PPTX placeholder. Any reject sends work back to Visual Designer.
4. **QA & Delivery** — QA Manager runs the **7-point QA-Matrix** (Alignment, Farbkonsistenz, Datenkorrektheit, Placeholder-Drift, Technische Präzision, Markenkonformität, "so what"-Faktor). Verdict: `approve` | `loop_back` (with explicit `loop_target` role) | `escalate`. **Max 3 loops.**

### Methods / vocabulary

- **Pyramid Principle** (Minto) — answer first, then supporting arguments grouped by theme.
- **MECE** — Mutually Exclusive, Collectively Exhaustive. Bullets must not overlap and together must cover the headline.
- **SCQA** — Situation / Complication / Question / Answer. Frames slides that need context before the claim.
- **Action Titles** — a slide headline is a declarative sentence making the claim, not a noun-phrase topic label.
- **Duarte-Kontrast** — contrast "what is" against "what could be" to build narrative tension.
- **7-point QA-Matrix** — the agency-standard final checklist (see QA Manager spec).

### Mandatory review additions

Fit + screenshot + source-depth checks are **not optional**:

- **Fit / Placeholder review** — verify against the real mapped PPTX placeholder, not just a free preview.
- **Screenshot review** — when rendering is available, the loop must inspect the actual output image before final approval.
- **Source-depth review** — dense workshop slides must surface concrete source insights, not only topic labels or buzzwords.

### Dense Handout mode

Some workshop slides are intentionally more text-dense, supporting 8-10 minutes of speaking time.

In **dense handout** mode:
- more visible text is allowed
- more concrete source-derived content is expected
- layout discipline becomes stricter, not looser
- the slide must still fit the real PPTX placeholder without clipping
- the slide must not regress into a dashboard/form look

### Canonical skills

Platform-neutral skill specs live in `docs/skills/` and are referenced by every platform adapter:

- [`docs/skills/create-slide.md`](docs/skills/create-slide.md) — the 4-phase / 6-role orchestrator spec.
- [`docs/skills/load-template-context.md`](docs/skills/load-template-context.md) — read active PPTX theme + layouts.
- [`docs/skills/validate-against-theme.md`](docs/skills/validate-against-theme.md) — scan a diff/file for Theme Contract violations.

### Platform adapters

Adapters are thin — they set platform-specific frontmatter (tools, model, description) and defer to the canonical specs above.

| Platform | Roles | Skills | Orchestrator |
|---|---|---|---|
| **Claude Code** | `.claude/agents/{project-manager,content-strategist,visual-designer,illustrator,brand-guardian,qa-manager}.md` | `.claude/skills/{create-slide,load-template-context,validate-against-theme}/SKILL.md` | `.claude/commands/create-slide.md` (slash command `/create-slide <brief>`) |
| **GitHub Copilot** | `.github/chatmodes/{project-manager,content-strategist,visual-designer,illustrator,brand-guardian,qa-manager}.chatmode.md` | — (prompt files cover the same surface) | `.github/prompts/{create-slide,load-template-context,validate-against-theme}.prompt.md` |
| **OpenAI Codex** | Reads `AGENTS.md` + `docs/roles/*.md` + `docs/skills/*.md` directly. No adapter needed. | same | Invoke by telling Codex to follow `docs/skills/create-slide.md`. |

**Non-agentic fallback:** A single-agent session (no subagent dispatch) should still **mentally run through the 6 checks** — brief clarity, narrative hierarchy, template fit, visual drama, theme compliance, and 7-point QA — before presenting output.

Across all three platforms, slide creation should also prefer **existing frontend patterns already present in the repo**:
- `src/components/ui/*`
- `class-variance-authority`
- `tailwind-merge`
- shared slide primitives in `_shared.tsx`

Do not build every dense slide from scratch with ad hoc one-off wrappers if an existing or easily generalizable primitive can carry the pattern.

---

## 8. Directory map (what lives where)

```
src/
  parser/pptxParser.ts      — PPTX → ParsedPresentation (masters, theme, layouts)
  store/slideStore.ts       — Zustand state: masters, slides, selection
  lib/slideSize.ts          — EMU ↔ px math, aspect ratio
  slides/
    types.ts                — CodeSlide / CodeSlideSlot interfaces (READ-ONLY in spirit)
    registry.ts             — List of all CodeSlides
    templates/
      _shared.tsx           — WireBlock, WireGrid, WireTitle, WireLegend (theme-aware)
      01-ExecutiveMessageFirst.tsx … 25-AppendixSourceGrid.tsx
      24-PyramidHierarchy.tsx  ★ reference example (§3)
    DI Workshop/             — Project-specific slides
    dora-pam/                — Project-specific slides
  components/
    DynamicSlide.tsx        — Renders a slide with theme.cssVars applied
    SlideCanvas.tsx         — Host + scaling
    AnnotationLayer.tsx     — buildCopilotPrompt (§6)
    ui/                     — shadcn-style UI building blocks and reusable primitives
    SettingsPanel.tsx       — Template picker, slot mapping UI
    ExportButton.tsx        — PNG / PPTX export
```

### Golden references

- `src/slides/templates/24-PyramidHierarchy.tsx` — canonical theme-aware template example
- `src/slides/DI Workshop/23-IamAiDeepfakesSlide.tsx` — dense two-column argument slide for constrained body placeholders
- `src/slides/DI Workshop/24-AiAgentsIdentitiesSlide.tsx` — dense two-column operating-model slide for constrained body placeholders
- `docs/slide-patterns.md` — approved dense-slide patterns and anti-patterns

---

## 9. Commands

```
npm run dev       # Vite dev server (localhost:5173)
npm run build     # tsc --noEmit + vite build
npm run preview   # preview production build
```

No test runner configured. Verification is manual: load a PPTX, visually check slide 24 renders with the uploaded theme (not amber/slate).

---

## 10. Red flags to catch in review

- `bg-amber-*`, `bg-blue-*`, `bg-red-*`, `text-green-*`, `border-purple-*` inside `src/slides/templates/**` → **violates §3**.
- `width: "400px"`, `height: "300px"` inside slide templates → **violates §4**.
- A new `.tsx` slide that doesn't register in `src/slides/registry.ts` → will not appear in the picker.
- Slot `key` values that conflict with existing semantic keys elsewhere (e.g. `"body"` vs `"content"`) → pick the already-used one for consistency.
- If the user explicitly rejects a marked intro/summary block, do **not** replace it with another generic paraphrasing summary. Remove it, deepen it, or replace it with a structurally different block that adds real informational value.
