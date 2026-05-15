# Dense Slide Patterns

Approved reference patterns for workshop slides that must fit real PPTX placeholders, carry more content, and still feel intentional rather than dashboard-like.

## Principles

- Fit the mapped PPTX body placeholder first.
- Prefer a strong editorial hierarchy over many equal cards.
- Use existing repo primitives first (`src/components/ui/*`, `_shared.tsx`, CVA-based components).
- Dense handout does **not** mean uncontrolled text density.

## Approved patterns

### 1. Editorial Split Dense
- one short lead band at the top of the body
- two compact content columns beneath
- one short conclusion strip at the bottom
- best for: `problem vs response`, `threat vs control`, `today vs target`

### 2. Evidence vs Action
- lead sentence
- left side: observed risks / evidence / signals
- right side: required controls / actions / governance
- use 3-4 concise rows per side
- best for: security, risk, compliance, transformation

### 3. Dense Compare
- two comparison columns
- one sharp subheadline per side
- 3-4 concrete points per side
- one short comparison takeaway
- best for: `A vs B`, principle pairs, before/after

### 4. Operating Model Dense
- short intro line
- left column: what is new / what exists
- right column: what control/governance must do
- short lifecycle or takeaway strip only if it fits in one compact row
- best for: AI agents, machine identities, governance topics

## Anti-patterns

- second hero title inside the body when the layout already has a title placeholder
- free-canvas composition that ignores the real PPTX placeholder height
- too many same-sized cards that read like a dashboard or form
- decorative orbit/lifecycle diagrams with low information density
- tiny badges/tags in the title area that do not survive presentation distance
- footer bands that clip at the bottom of the mapped body placeholder

## Frontend implementation guidance

- Prefer shared primitives and shadcn-style building blocks over one-off wrappers.
- Use CVA or variant-based APIs for reusable slide shells.
- Keep typography and spacing decisions concentrated in shared components when patterns repeat.
- Inline styles remain the authority for theme-driven colors and fonts via `var(--slide-*)`.
