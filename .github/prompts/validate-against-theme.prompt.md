---
mode: agent
description: Scan a diff or a file under src/slides/templates/ for Theme Contract violations (hardcoded colors, pixel widths, raw hex). Reports only — does not fix. Used by Brand Guardian in Phase 3.
---

# /validate-against-theme

Input: ${input:target:Paste a diff, a file path under src/slides/templates/, or the code to scan.}

## Canonical spec

Read `docs/skills/validate-against-theme.md` in the workspace. Follow it exactly.

## Scans to run

Use the `search` tool or `codebase` tool with these patterns:

- `bg-(amber|blue|red|green|purple|pink|orange|yellow|cyan|lime|fuchsia|rose|sky|violet|indigo|emerald|teal)-[0-9]+`
- `text-(...)-[0-9]+`
- `border-(...)-[0-9]+`
- `(w|h|min-w|max-w|min-h|max-h)-\[[0-9]+px\]`
- `['"]#[0-9a-fA-F]{3,8}['"]`
- `['"][0-9]+px['"]` on `width` / `height` assignments

Scope to `src/slides/templates/` or the specific file under review.

## Output

Return the `# Theme Validation` block from the canonical spec. For every violation: `file`, `line`, `issue`, `offending`, `fix` (from the cookbook in `docs/roles/brand-guardian.md`). Do not apply fixes — this prompt reports only and Visual Designer re-emits.
