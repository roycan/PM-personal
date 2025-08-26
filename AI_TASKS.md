# AI Tasks - Safe & Unsafe (examples)

Safe tasks (AI can be used to draft):
- Generate QUnit tests for pure functions.
- Create small, well-commented helper functions (<= 30 LOC) with tests.
- Propose documentation, lesson notes, or PR descriptions.
- Suggest small UI HTML snippets or CSS improvements (teacher review required).

Require human review (AI drafts OK, but human must approve before applying):
- Refactoring that touches storage or data format.
- Introducing new libraries or CDN dependencies.
- Changes that influence grading or student evaluation flow.

Unsafe / disallowed for automation:
- Schema migrations applied automatically.
- Direct commits to `main` or auto-merging PRs.
- Handling of secrets, credentials, or integrating external APIs.

Examples (how to ask AI safely):
- "Draft a QUnit test that asserts formatDateISO('2025-1-1') -> '2025-01-01' and 'invalid' input returns null"  
- "Propose a small helper `buildProjectRowHTML(project)` that returns a safe HTML string; do not change event wiring."  

Add more examples as lessons evolve.
