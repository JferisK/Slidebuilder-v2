---
name: validate-against-theme
description: Scans a diff or file in src/slides/templates/ for Theme Contract violations (hardcoded colors, pixel widths, raw hex). Reports violations with cookbook fixes. Use before commits and as part of Brand Guardian's review.
---

# validate-against-theme

## Canonical spec

Read `docs/skills/validate-against-theme.md` in the repo root. Follow it exactly.

## Claude-specific usage

Use the `Grep` tool (not Bash) for scans. Prefer the patterns from the canonical spec:

- `bg-(amber|blue|red|green|purple|pink|orange|yellow|cyan|lime|fuchsia|rose|sky|violet|indigo|emerald|teal)-[0-9]+`
- `text-(...)-[0-9]+`
- `border-(...)-[0-9]+`
- `(w|h|min-w|max-w|min-h|max-h)-\[[0-9]+px\]`
- `['"]#[0-9a-fA-F]{3,8}['"]`

Set `path` to `src/slides/templates/` or to the specific file under review.

## Output

Return the `# Theme Validation` block from the canonical spec. Do not apply fixes — this skill reports.
