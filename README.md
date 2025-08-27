# Personal Project Log (Teaching Edition)

Hybrid multi-page refactor for teaching high school students maintainable web development with minimal tooling. Deployable on GitHub Pages; no build step required.

## Status
Refactor progressed through Phase 9 (minimal testing). Phase 10 (accessibility) deferred; Phase 11 (docs & quality) in progress. See `PLAN.md` for detailed checklist and `ARCHITECTURE.md` for structure. Contribution guidelines: `CONTRIBUTING.md`.

## Key Goals
- Simple, readable JavaScript (no ES modules) using a single global `App` object and IIFE modules.
- Progressive lessons via branches (see `PLAN.md`).
- Clear separation: storage / rendering / wiring.
- Data safety: versioned export/import JSON + validation.
- Lightweight theming (CSS custom properties + dark mode toggle).

## Directory Overview
```
assets/css/        Base styles, custom properties, theming
assets/js/         IIFE-based scripts (boot, utils, storage, render, main pages, vendor loaders)
assets/data/       (sample data placeholder)
archives/          Archived versions (original snapshot)
tests/             QUnit pages (storage & utils)
inceptions/        User stories and inception docs
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

Export bundle shape (`App.storage.exportBundle()` returns JSON string):
```json
{
  "version": "v1",
  "exportedAt": "2025-08-26T00:00:00.000Z",
  "data": {
    "projects": [ ... ],
    "logs": [ ... ]
  }
}
```

Import modes: `merge` (default) or `overwrite` via modal in `index.html`.

## Using AI Assistance
See: `AI_POLICY.md`, `AI_PROMPTS.md`, `AI_TASKS.md`, `PRIVACY_AND_AI.md`, and the PR template (`.github/pull_request_template.md`). Always include prompts + verification notes in PRs when AI assisted.

## Testing
Open `tests/index.html` to run QUnit suites. Add new test pages colocated in `tests/` named `feature_test.html` for clarity.

## Theming
Light/dark mode toggle persists using `localStorage` (`pmlog:theme`). Override variables in `assets/css/base.css` for classroom exercises.

## Roadmap (Condensed Progress)
- [x] Phases 1–9 implemented
- [ ] Phase 10 (Deferred) Accessibility enhancements
- [ ] Phase 11 Documentation polishing & contribution guidance (current)

See full roadmap in `PLAN.md`.

## License
MIT — see `LICENSE`.
