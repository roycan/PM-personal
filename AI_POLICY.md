# AI Usage Policy (short)

Purpose
This project accepts AI assistance for drafting code, tests, and documentation, but humans must review and approve all changes before merging. This document defines acceptable and unacceptable AI tasks for this repository used in teaching.

Allowed (AI may assist)
- Generate unit tests for pure functions.
- Propose small refactors (single-function scope) with accompanying tests.
- Draft lesson notes, README sections, or PR descriptions.
- Create example data or sample JSON files.

Requires explicit human review
- Any change to data schema, storage keys, or migrations.
- Any change affecting student-facing lesson flow or evaluation.
- Changes that alter persisted data format (import/export bundle).

Disallowed (do not automate)
- Automatic commits to `main` or automatic merges without human approval.
- Automatic schema migrations applied without a tested migration path and teacher approval.
- Any task that involves handling secrets or external network changes.

Process
1. AI drafts output (code, tests, docs) in a PR comment or branch.  
2. Developer reviews and runs tests locally.  
3. CI runs tests and posts results.  
4. Human reviewer approves PR.  
5. Merge to lesson branch or `main`.

Transparency
- If AI assisted, include the prompt and short verification notes in the PR description (use the PR template).  
- Keep prompts and AI usage examples in `AI_PROMPTS.md`.

Maintenance
- Periodically audit AI prompts and generated outputs for drift and correctness (recommended every term).

Questions or exceptions
- Contact the repository owner to discuss any exceptions.
