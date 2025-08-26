# Personal Project Log (Teaching Edition)

Hybrid multi-page refactor (in progress) for teaching high school students maintainable web development with minimal tooling. Deployable on GitHub Pages; no build step required.

## Status
Phase 1 (asset extraction) + storage module WIP. Original monolithic version archived at `archives/index_20250826.html`.

## Key Goals
- Simple, readable JavaScript (no ES modules) using a single global `App` object and IIFE modules.
- Progressive lessons via branches (see `PLAN.md`).
- Clear separation: storage / rendering / wiring.
- Data safety: versioned export/import JSON + validation.

## Directory Overview
```
assets/css/        Base styles, custom properties, theming
assets/js/         IIFE-based scripts (app.boot, utils, storage, main.*)
archives/          Archived versions of earlier index.html
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

## Testing (planned)
QUnit via CDN (tests/ folder). Pure helpers (validation, analytics) will be covered by tests.

## License
MIT — see `LICENSE`.

## Roadmap (abbrev)
1. Separate assets (done)
2. Storage module (in progress)
3. Multi-page structure (`project.html`)
4. Renderers & events
5. Logs list + filters
6. Calendar & analytics (lazy)
7. Theming + dark mode

See detailed plan in `PLAN.md`.
