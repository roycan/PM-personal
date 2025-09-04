# Personal Project Log (Teaching Edition)

Hybrid multi-page refactor for teaching high school students maintainable web development with minimal tooling. Deployable on GitHub Pages; no build step required.

> Migration Note (Phase 0–4 Realignment):
> Transition complete: moved from global `App` + IIFEs to native ES modules (`<script type="module">`).
> LocalStorage keys migrated to new names (`ppl:v1:*`) on first module load (legacy keys left intact for rollback).
> Deprecated legacy scripts (storage, main, render) removed after export/import parity (Phase 4). Theme now handled by ES module `theme.js` (legacy `app.boot.js` removed).

## Status
Refactor progressed through Phase 9 (minimal testing). Phase 10 (accessibility) deferred; Phase 11 (docs & quality) in progress. See `PLAN.md` for detailed checklist and `ARCHITECTURE.md` for structure. Contribution guidelines: `CONTRIBUTING.md`.

## Key Goals
- Simple, readable JavaScript using native ES modules (post realignment) with minimal surface area.
- Progressive lessons via phased checklist (`PLAN.md`).
- Clear separation: data (localStorage), page controllers, utilities.
- Data safety: versioned export/import JSON + validation.
- Lightweight theming (CSS custom properties + dark mode toggle) (optional phase).

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

### Basic Usage (Current Phases 1–2)
1. Open `index.html`.
2. Add a project with the form on the left; it appears in the list.
3. Click a project to navigate to `project.html?id=...`.
4. Add log entries (date defaults to today). Each saved log appears in the Logs tab.
5. Click "Details" on a log row to expand full results/observations/reflections inline.
6. Use Edit/Delete buttons on a log row to modify or remove it.
7. Analytics tab currently shows placeholders until Phase 5.

## Data Persistence (Current vs Upcoming)
Current (pre-migration) LocalStorage keys:
- `pmlog:v1:projects`
- `pmlog:v1:logs`

Upcoming (after Phase 1) keys:
- `ppl:v1:projects`
- `ppl:v1:logs`

Export bundle target shape (post realignment):
```json
{
  "version": 1,
  "exportedAt": "2025-09-04T00:00:00.000Z",
  "projects": [ ... ],
  "logs": [ ... ]
}
```
Import modes (planned):
- merge (id-based overwrite)
- overwrite (replace all)

### Export & Import (Phase 4)
You can now export and import your data from the main page:

Export:
- Click "Export Data" → downloads a JSON file named `project-log-export-YYYY-MM-DD-HH-MM-SS.json`.

Import:
1. Click "Import Data" and select a `.json` export file.
2. A modal opens showing validation results and counts.
3. (Optional) Click "Download Backup" to save your current data before proceeding.
4. Choose mode:
  - Merge: Add new / update existing items by id (safer).
  - Overwrite: Replace everything with file contents.
5. Click "Proceed with Import". A brief success message appears; modal closes.

Validation:
- Deep validation checks structure + each project/log. First few errors are shown if invalid.

Round‑Trip Test (Manual):
1. Add a unique project & a couple logs.
2. Export data (File A).
3. Delete a project or log.
4. Import File A with Overwrite → deleted items reappear.
5. Export again (File B) and diff vs File A (should match except exportedAt).

File Size Limit: 2MB (guardrail for classroom use).

Automated Round Trip Smoke:
Open `tests/roundtrip.html` and click "Run Test" (or run `runExportImportSmoke()` in console). It:
- Captures baseline bundle
- Tests overwrite restore
- Tests merge preserving new data
- Restores original baseline (no lasting changes)
Outputs JSON report with steps, timing, success flag.

## Using AI Assistance
See: `AI_POLICY.md`, `AI_PROMPTS.md`, `AI_TASKS.md`, `PRIVACY_AND_AI.md`, and the PR template (`.github/pull_request_template.md`). Always include prompts + verification notes in PRs when AI assisted.

## Testing
QUnit via CDN (retained). Open `tests/index.html` to run suites. Pure function coverage prioritized (utils, validation, analytics, import logic).

## Theming
Light/dark mode toggle persists using `localStorage` (`pmlog:theme`). Override variables in `assets/css/base.css` for classroom exercises.

## Roadmap (Condensed Progress)
- [x] Phases 1–9 implemented
- [ ] Phase 10 (Deferred) Accessibility enhancements
- [ ] Phase 11 Documentation polishing & contribution guidance (current)

See full roadmap in `PLAN.md`.

## License
MIT — see `LICENSE`.
