# Project Refactor & Teaching Plan (Hybrid multi-page, NO ES modules)

> Status: Planning phase (no refactor code committed yet)
>
> Goal: Produce a hybrid multi-page static site (GitHub Pages friendly) that is simple for high-school students to understand and extend, using no ES modules — instead use small IIFE/global patterns for encapsulation and incremental lessons.

## Guiding Principles
- Keep code small, explicit, and well-named so students can follow easily.
- Prefer clear separation of concerns (storage, rendering, wiring) without introducing module syntax.
- Use IIFE or a single global `App` object to provide encapsulation while avoiding import/export complexity.
- Keep deployment zero-build and mobile-friendly (CDN assets OK).
- Add complexity only when it clearly benefits teaching outcomes.

## Branch Roadmap (Incremental Learning Path)
| Order | Branch Name | Focus / Lesson Outcome |
|-------|-------------|------------------------|
| 0 | `00-original` | Baseline snapshot (current unrefactored code) |
| 1 | `01-separate-assets` | Split inline CSS/JS into files; keep single global script initially |
| 2 | `02-data-model-and-storage` | Add `storage.js` (IIFE/global) with versioned export/import and schema validation |
| 3 | `03-multi-page-structure` | Convert to hybrid pages: `index.html` (projects) + `project.html` (project detail) using URL params |
| 4 | `04-state-and-rendering` | Introduce small renderer files and a simple pub/sub pattern using `App` globals |
| 5 | `05-add-log-list-and-filters` | Implement logs table, search, date filters, sort controls |
| 6 | `06-calendar-and-analytics` | Lazy-load FullCalendar on `project.html`, add analytics module |
| 7 | `07-theming` | CSS custom properties + dark mode toggle persisted in storage |
| 8 | `08-import-export-hardening` | Add safer import (validation + backup) and merge options |
| 9 | `09-minimal-testing` | QUnit (or tiny harness) for pure helpers and storage validation |
| 10 | `10-accessibility-pass` (deferred) | ARIA roles, modal focus, keyboard tabs |
| 11 | `main` | Final merged main branch (rebased as lessons complete) |

Branches can be reordered slightly to suit class pacing; core constraint: no ES modules in this repository's teaching flow.

## File Layout (NO ES modules — IIFE / global `App` pattern)
- `index.html` — Projects list, add project, import/export UI.
- `project.html` — Per-project view (tabs: logs list, calendar, analytics).
- `assets/css/` — `bulma.css` + `base.css`, `components.css`.
- `assets/js/` (global/object-based):
	- `app.boot.js` — creates the global container: `window.App = window.App || {}` and documents expected slots.
	- `utils.js` — `App.utils = { ... }` (id gen, date helpers, small pure functions).
	- `storage.js` — `App.storage = (function(){ ... })();` (versioned localStorage logic, export/import, validation/migration stubs).
	- `render.projects.js` — attaches `App.render.projects` (project list UI used by `index.html`).
	- `render.projectPage.js` — attaches `App.render.projectPage` (project detail UI used by `project.html`).
	- `main.index.js` — page-specific wiring for `index.html` (wires events, depends on `App.storage` and `App.render.projects`).
	- `main.project.js` — page-specific wiring for `project.html` (wires tabs, lazy-load calendar loader).
	- `vendor/fullcalendar-loader.js` — tiny helper to inject FullCalendar script/styles on demand.
- `assets/data/sample-data.json` — seed data for demos/reset.
- `tests/` — static test pages using QUnit that exercise `App.utils` and `App.storage` helpers.
- `PLAN.md`, `README.md`, `LICENSE`.

Notes:
- Each script adds a single well-documented property to `App` instead of using `export`.
- HTML includes scripts in stable order: `bulma` CSS, `app.boot.js`, `utils.js`, `storage.js`, `render.*.js`, `main.*.js`.

## Phase & Task Checklists (revised for NO ES modules)

### Phase 0: Confirm Open Decisions
- [ ] Confirm license (MIT recommended).
- [ ] Confirm QUnit vs custom test harness (QUnit recommended via CDN).
- [ ] Confirm branch roadmap.

### Phase 1: Baseline Extraction (`01-separate-assets`)
- [ ] Create `assets/css/` and extract inline styles to `base.css`.
- [ ] Create `assets/js/app.boot.js` that establishes `window.App` and documents shape.
- [ ] Move existing script into `assets/js/main.index.js` (preserve exact behavior, only reorganize).
- [ ] Add `README.md` with quick deploy instructions.

### Phase 2: Data Model & Storage (`02-data-model-and-storage`)
- [ ] Create `assets/js/storage.js` as an IIFE attached to `App.storage`.
- [ ] Include `DATA_VERSION` and namespaced localStorage keys (e.g., `pmlog:v1:projects`).
- [ ] Implement `exportBundle()` and `importBundle(bundle, mode)` signatures and validation stubs (no UI prompts inside).
- [ ] Add `assets/data/sample-data.json` and a `resetToSample()` helper.

### Phase 3: Multi-page Structure (`03-multi-page-structure`)
- [ ] Create `project.html` (project details) and update `index.html` to link to it with `?id=...`.
- [ ] Implement URL parsing helpers in `App.utils` and default fallback behavior (sessionStorage fallback).
- [ ] Ensure both pages include shared scripts in the correct order.

### Phase 4: State & Rendering (`04-state-and-rendering`)
- [x] Split UI code into `render.projects.js` and `render.projectPage.js` attaching to `App.render.*`.
- [x] Introduce a tiny pub/sub on `App.events = { on, off, emit }` implemented via closures in `app.boot.js` or a small IIFE.
- [x] Replace inline alerts with an inline status area on each page (simple DOM updates).

### Phase 5: Logs List & Filters (`05-add-log-list-and-filters`)
- [x] Add logs table UI (responsive) to `project.html` and implement text search and date range filters.
- [x] Add simple sort controls and filtered-count display.

### Phase 6: Calendar & Analytics (`06-calendar-and-analytics`)
- [x] Add `vendor/fullcalendar-loader.js` that injects CDN script/link tags when calendar tab is opened.
- [x] Implement calendar wiring in `main.project.js` to lazily instantiate calendar and attach event handlers to show modals.
- [x] Move analytics calculations into `App.utils.analytics` as pure functions (testable).

### Phase 7: Theming & UX (`07-theming`)
- [x] Introduce CSS custom properties in `base.css` and add a dark mode toggle that persists to `App.storage`.

### Phase 8: Import/Export & Safety (`08-import-export-hardening`)
- [x] Validate import bundle structure before writing; provide backup download option.
- [x] Implement merge vs overwrite modes (merge policy: match by id, fallback match by name).

### Phase 9: Minimal Testing (`09-minimal-testing`)
- [ ] Add `tests/storage.html` and `tests/utils.html` that load the shared scripts and run QUnit tests against `App.storage` and `App.utils`.
- [ ] Keep tests focused on pure functions and storage validation.

### Phase 10: Accessibility Pass (Deferred) (`10-accessibility-pass`)
- [ ] Add keyboard tab navigation and modal focus trap later as a dedicated lesson.

### Phase 11: Docs & Quality (`11-quality-and-docs`)
- [ ] Add README, architecture notes (how `App` is composed), lesson plan per branch, CONTRIBUTING, LICENSE.

## Script Ordering & Best Practices (Important when NOT using modules)
- Load order matters. Always include scripts in this sequence:
	1. `app.boot.js` (creates `window.App` and `App.events`)
	2. `utils.js` (pure helpers)
	3. `storage.js` (depends on utils)
	4. `render.*.js` (depends on storage & utils)
	5. `main.*.js` (wires DOM events; last)
- Document order clearly in `README.md` and top of each script with a short header comment.
- Keep each `App.*` surface small and well-documented to make later refactor to modules trivial.

## Migration Path to ES modules (future)
- If you later want to teach ES modules, the migration is straightforward:
	- Replace `App.*` assignments with `export const` and import into consumers.
	- Update HTML to use `<script type="module">` for the entry points.
	- Keep tests and utilities as pure functions to minimize migration friction.

## Data & Privacy (unchanged core proposals)
- Keep namespaced keys and a `DATA_VERSION` in the export bundle.
- Provide backup before overwrite and a sample-data reset.

## Testing & Classroom Exercises
- Lesson exercises will show students how to:
	- Extract inline script into `utils.js` and confirm functionality.
	- Replace global functions with `App.*` members (IIFE attaching to `App`).
	- Implement `importBundle()` validation and test with `tests/storage.html`.

## License Recommendation
- Recommend MIT for educational reuse.

## Next Actions
- [ ] Confirm this NO-ES-modules plan. Once confirmed I'll start Phase 1: create `assets/` folders, extract inline styles, and add `app.boot.js` and `utils.js` skeletons (no behavioral changes yet).

---
(End of revised plan)

## Next Action After Confirmation
Start Phase 1: create baseline branch, extract assets, add README, commit.

---
(End of Plan)
