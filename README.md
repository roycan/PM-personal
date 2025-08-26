# Personal Project Log (Teaching Edition)

Hybrid multi-page refactor (in progress) for teaching high school students maintainable web development with minimal tooling. Deployable on GitHub Pages; no build step required.

## Status
Phase 1 (asset extraction) complete. Multi-page expansion started (`project.html`). `storage.js` deprecated (kept one commit for history) — now using direct `localStorage` in page scripts plus validation helpers in `App.utils`. Original monolithic version archived at `archives/index_20250826.html`.

## Key Goals
- Simple, readable JavaScript (no ES modules) using a single global `App` object and IIFE modules.
- Progressive lessons via branches (see `PLAN.md`).
- Clear separation: storage / rendering / wiring.
- Data safety: versioned export/import JSON + validation.

## Directory Overview
```
assets/css/        Base styles, custom properties, theming
assets/js/         IIFE-based scripts (app.boot, utils, main.index, main.project, deprecated storage)
archives/          Archived versions (original snapshot)
tests/             QUnit harness + test files
inceptions/        User stories and inception docs
.github/           PR & issue templates
```

## Running Locally
Open `index.html` directly in a modern browser OR serve with a simple static server:
```
python3 -m http.server 8000
```
Then visit http://localhost:8000/

## Data Persistence
LocalStorage keys (v1):
- `pmlog:v1:projects`
- `pmlog:v1:logs`

Export bundle shape:
```json
{
  "version": 1,
  "exportedAt": "2025-08-26T00:00:00Z",
  "projects": [ ... ],
  "logs": [ ... ]
}
```

## Using AI Assistance
See `AI_POLICY.md`, `AI_PROMPTS.md`, and PR template. Always include prompts + verification notes.

## Testing
Open `tests/index.html` to run QUnit tests for utilities + validation. Add new test files referencing helpers under `assets/js/` as they appear.

## License
MIT — see `LICENSE`.

## Roadmap (abbrev)
1. Separate assets (done)
2. Validation migration & deprecate storage abstraction (done)
3. Multi-page structure (`project.html`) (in progress)
4. Logs CRUD on project page (done basic add/delete)
5. Project page improvements: edit logs, sorting, filtering (next)
6. Calendar & analytics stubs (present) → implement later lessons
7. Export/import re-wire without storage.js helper
8. Theming + dark mode
9. Accessibility sweep

See detailed plan in `PLAN.md`.
