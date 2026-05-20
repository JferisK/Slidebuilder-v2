---
name: Render Slide
description: Generate the latest slide render artifacts for a create-slide loop, including screenshot status, screenshot path, fit status, and open issues. Use after any slide code edit and before Illustrator, Brand, or QA review.
agent: agent
tools: [read, search]
---

# /render-slide

## Purpose

Produce the latest `# Loop Artifacts` block for the currently edited slide so downstream review roles are working from current evidence rather than text-only assumptions.

## Inputs

- The touched slide file(s)
- The active `codeSlideId` or target slide path
- Template Context
- Any available repo render command, script, or deterministic screenshot path

## Output

Return exactly this block:

```md
# Loop Artifacts
loop_count: <number>
edited_files:
  - <path>
render_status: "ready" | "blocked" | "failed"
screenshot_status: "available" | "missing" | "failed"
screenshot_path: "<path or empty>"
fit_status: "pass" | "fail" | "unknown"
fit_issues:
  - "<issue>"
open_issues:
  - "<issue>"
next_action: "<illustrator_review | brand_review | qa_review | escalate>"
```

## Rules

1. Prefer a deterministic repo render path over manual UI instructions.
2. If no deterministic render path exists yet, mark `render_status: "blocked"` and state the technical blocker in `open_issues`.
3. Do not claim screenshot availability unless a real artifact path exists.
4. Do not claim `fit_status: pass` unless placeholder-fit was actually checked against current layout geometry.
5. This prompt never approves slide quality. It only reports current render evidence.