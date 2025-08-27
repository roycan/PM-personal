# Contributing Guide

Thank you for considering a contribution. This project is used for teaching incremental refactoring, data safety, and testable JavaScript **without ES modules**. Please follow these lightweight guidelines.

## Ground Rules
- Keep scripts small and attach only one surface to the `App` global per file.
- Favor pure helpers in `App.utils` when possible (easier to test & later migrate to modules).
- Do not introduce build tooling (no bundlers) unless discussed first.
- Follow AI usage policies in `AI_POLICY.md`.

## Branch / Lesson Flow
Each numbered branch corresponds to a lesson (see `PLAN.md`). For new changes:
1. Branch from the latest lesson branch (or `main` after merges).
2. Name your branch descriptively: `feat-logs-edit`, `fix-import-validation`, etc.
3. Keep PRs focused (single lesson increment or fix).

## Commit Messages
Use short imperative subject lines:
```
Add log filters to project page
Fix import merge handling of duplicate ids
Refactor calendar init into loader
```
Optionally add a longer body explaining rationale.

## Pull Requests
Include:
- Summary of changes
- Any prompts used for AI assistance + verification notes
- Testing steps (manual or QUnit additions)
- Screenshots / GIFs for UI changes when helpful

Template sections (suggested):
```
### Summary

### What Changed

### How to Test

### AI Assistance (if any)
Prompt:
Verification:

### Follow-ups
```

## Testing
- Add or update QUnit tests in `tests/` for any new pure logic.
- Manual test data: create a few projects, add logs across dates, export/import.

## Import / Export Safety
- Never overwrite existing data structures without validation.
- Provide a backup path before destructive changes.

## Code Style
- Vanilla JS, ES5+ syntax only (no build step assumptions).
- Keep functions under ~40 lines when feasible.
- Use early returns for clarity.

## Accessibility (Deferred Phase)
- Phase 10 will address ARIA roles, focus management, and keyboard traps. Avoid regressions that make this harder later.

## License
By contributing you agree your work is provided under the MIT License.

---
Questions? Open a discussion or issue first if unsure.
