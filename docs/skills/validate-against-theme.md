# Skill: validate-against-theme

> Canonical skill spec — platform-neutral. Referenced by `.claude/skills/validate-against-theme/SKILL.md` and `.github/prompts/validate-against-theme.prompt.md`. Implements the Brand Guardian scan pattern as a reusable skill.

## Purpose
Scan a diff or a file in `src/slides/templates/**` for Theme Contract violations (AGENTS.md §3). Returns a structured list of violations with line numbers and suggested fixes. **This skill is a check, not a fix** — it reports, the caller decides whether to edit.

## When to invoke
- Before committing any change to `src/slides/templates/**`.
- As part of the Brand Guardian role (see `docs/roles/brand-guardian.md`).
- On demand when the user asks "ist diese Änderung CD-konform?" / "is this on-brand?".

## Inputs
- **Path or diff**: one of
  - a file path under `src/slides/templates/`,
  - a unified diff patch,
  - a code block pasted into the conversation.

## Scan rules

Flag each of the following as a violation. Include file, line number (1-indexed), the offending token, and the approved replacement from the cookbook in `docs/roles/brand-guardian.md`.

1. **Hardcoded Tailwind color classes** (any of: `amber blue red green purple pink orange yellow cyan lime fuchsia rose sky violet indigo emerald teal`) with a numeric shade:
   - `bg-<hue>-NNN`
   - `text-<hue>-NNN`
   - `border-<hue>-NNN`
   - `ring-<hue>-NNN`
   - `from-<hue>-NNN` / `to-<hue>-NNN` / `via-<hue>-NNN`

2. **Slate in production output**: `bg-slate-*`, `text-slate-*`, `border-slate-*` **outside** wireframe debug labels. (Allowed inside WireBlock's own internal label styling.)

3. **Fixed pixel dimensions**:
   - String literals like `"400px"`, `"300px"` in inline styles.
   - Arbitrary Tailwind sizes: `w-[NNNpx]`, `h-[NNNpx]`, `min-w-[NNNpx]`, `max-h-[NNNpx]`.
   - **Allowed**: `px` values for `borderRadius`, `borderWidth`, `gap`, `padding` ≤ 32px (fine-detail spacing). Flag only width/height.

4. **Raw hex or rgb colors** in inline styles: `color: "#0A3D62"`, `backgroundColor: "rgb(10,61,98)"`. Must go through `var(--slide-*)`.

5. **Font family overrides**: inline `fontFamily: "Arial"` etc. Must be `var(--slide-font-heading)` or `var(--slide-font-body)`, or inherit.

## Fast grep command (when working from shell)

```bash
# Color classes
grep -nE "bg-(amber|blue|red|green|purple|pink|orange|yellow|cyan|lime|fuchsia|rose|sky|violet|indigo|emerald|teal)-[0-9]+" src/slides/templates/
grep -nE "text-(amber|blue|red|green|purple|pink|orange|yellow|cyan|lime|fuchsia|rose|sky|violet|indigo|emerald|teal)-[0-9]+" src/slides/templates/
grep -nE "border-(amber|blue|red|green|purple|pink|orange|yellow|cyan|lime|fuchsia|rose|sky|violet|indigo|emerald|teal)-[0-9]+" src/slides/templates/

# Fixed pixel widths/heights
grep -nE "(width|height):\s*['\"][0-9]+px['\"]" src/slides/templates/
grep -nE "(w|h|min-w|max-w|min-h|max-h)-\[[0-9]+px\]" src/slides/templates/

# Raw hex
grep -nE "['\"]#[0-9a-fA-F]{3,8}['\"]" src/slides/templates/
```

## Output format

```
# Theme Validation
verdict: "pass" | "fail"
violations:
  - file: "src/slides/templates/XX.tsx"
    line: 42
    issue: "<one-line description>"
    offending: "<exact offending token>"
    fix: "<approved replacement from cookbook>"
```

On `pass`, `violations` is empty. On `fail`, every violation must have a concrete fix — do not say "refactor this" without naming the replacement.

## Do not

- Apply the fixes yourself. This skill reports only. Brand Guardian rejects; the Visual Director re-emits.
- Skip violations because they're "minor". One hardcoded color erodes the contract.
- Flag `slate-*` inside wireframe debug paths. Focus on production rendering.
