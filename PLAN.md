# Project Plan (Simplified ES Modules, Two Pages)

Status: Realignment after refactor drift.
Primary Goal: A lean, teachable personal project log with the smallest architecture that satisfies the user stories in `inceptions/user-stories.md`.

---
## Master Checklist (Progress at a Glance)
Legend: [ ] not started, [~] in progress, [x] done, [>] deferred/optional

### Phase 0 – Cleanup & Alignment
- [x] 0.1 Remove placeholder render files (`render.projects.js`, `render.projectPage.js`).
- [x] 0.2 Remove duplicate event bus definition (keep one) in `app.boot.js`.
- [x] 0.3 Add migration note to `README.md` about ES module transition & key rename.
- [x] 0.4 Create placeholder `assets/js/data.js` (module scaffold, unused yet).
- [x] 0.5 Draft new storage key constants & migration logic plan (doc only for now).
- [x] 0.6 Decide safe timing to remove `storage.js` (deleted in Phase 4 after export/import parity).
- [ ] 0.7 Validate no console errors after cleanup (manual smoke).

### Phase 1 – Projects MVP
- [x] 1.1 Convert HTML pages to use `<script type="module">` for new entry scripts. (index migrated; project page pending later phase)
 - [x] 1.2 Implement `data.js` basic project CRUD (using old keys + migration to new keys `ppl:v1:*`).
 - [x] 1.3 Implement `utils.js` (module export) for id/date helpers & validation skeletons.
 - [x] 1.4 Build `index.js` (list + add project) using new modules (legacy scripts commented out for rollback if needed).
 - [x] 1.5 Empty state messaging for zero projects.
 - [x] 1.6 Manual migration test (old keys → new keys). (Instructions: clear new keys, seed legacy keys via console, reload, confirm projects appear, check `migrationStatus()` migrated=true.)
- [x] 1.7 Remove `storage.js` after confirming functionality parity.

### Phase 2 – Logs CRUD (Project Page Base)
 - [x] 2.1 Add logs data methods to `data.js` (add, update, delete, list by project).
 - [x] 2.2 Build initial `project.js` (add log only).
 - [x] 2.3 Implement edit + delete.
 - [x] 2.4 Inline row expansion (single open at a time).
 - [x] 2.5 Basic placeholder analytics section container.
 - [x] 2.6 Update README usage instructions (multi-page flow).

### Phase 3 – Filtering & Sorting
- [x] 3.1 Text search (results/observations/reflections).
- [x] 3.2 Date range filter.
- [x] 3.3 Sort direction toggle (date asc/desc).
- [x] 3.4 Filtered count display.
- [x] 3.5 Debounce search input (optional if needed).

### Phase 4 – Export / Import
- [x] 4.1 Export bundle generator (version, exportedAt, arrays). (Implemented earlier in `data.js`)
- [x] 4.2 Validation function for bundle shape. (Enhanced deep validation in `utils.mod.js`)
- [x] 4.3 Merge import (id-based) logic. (`importBundle` merge mode)
- [x] 4.4 Overwrite import logic. (`importBundle` overwrite mode)
- [x] 4.5 Simple UI (export button triggers download, import file input + mode selection).
- [x] 4.6 Error & success messaging (non-alert inline).
- [x] 4.7 Manual round‑trip test. (Automated script: `tests/roundtrip.html` + `window.runExportImportSmoke()`)

### Phase 5 – Calendar + Basic Analytics
- [x] 5.1 Calendar lazy loader (dynamic script or dynamic import) triggered on tab activation.
- [x] 5.2 Calendar event build (one event per log, truncated title).
- [x] 5.3 Event click scroll/highlight matching log row.
- [x] 5.4 Basic analytics helper `computeBasicStats(logs)` (implemented via `summarizeLogs` + `activityLastNDays`).
- [x] 5.5 Render analytics (total, first, last, activeDaysLast30).
- [x] 5.6 Recompute analytics + refresh calendar after CRUD.
	- Note: Replaced legacy vendor loader with ES module `calendarLoader.js` (fixes missing calendar after removing legacy globals).

### Phase 6 – Optional Enhancements
- [x] 6.1 Dark mode toggle + persist (migrated to `theme.js`).
- [ ] 6.2 Focus handling improvements (return focus to last control after actions).
- [ ] 6.3 Loading states / skeleton (optional if needed).

### Phase 7 – Tests (QUnit via CDN)
- [x] 7.0 Migrate legacy test harness to ES modules (utils, validation, analytics).
- [x] 7.1 Create `tests/index.html` (module aware) loading QUnit + modules.
- [x] 7.2 Tests: id generation uniqueness.
- [x] 7.3 Tests: date formatting / validation.
- [x] 7.4 Tests: project/log validation.
- [x] 7.5 Tests: bundle validation (good + bad cases) (partial via validation tests; extend later if needed).
- [x] 7.6 Tests: analytics edge cases (0, 1, multiple logs; 30-day window) (basic coverage present; extend cases later).
- [x] 7.7 Tests: import merge vs overwrite scenarios (covered by automated roundtrip smoke test).
- [x] 7.8 Remove obsolete legacy test pages (`storage_test.html`, `utils_test.html`).
- [ ] 7.9 Add dedicated analytics edge-case expansions (streaks, large sets) (optional / deferred).

### Phase 8 – Accessibility & Documentation Polish
- [ ] 8.1 Keyboard accessible tab navigation.
- [ ] 8.2 Check color contrast (light/dark modes if dark enabled).
- [ ] 8.3 ARIA labelling for interactive elements (calendar tab, log expansion rows).
- [ ] 8.4 Expanded README (architecture, teaching notes, stretch ideas).
- [ ] 8.5 CHANGELOG initial entries.

### Deferred / Stretch
- [>] Streak analytics.
- [>] Multi-project aggregate analytics.
- [>] Tooltips / color coding in calendar.
- [>] Modal-based detail editing.

---
## Guiding Principles (Reference)
- Favor boring, explicit code over clever abstractions.
- Two HTML pages only.
- Native ES modules; no build step.
- LocalStorage + JSON export/import (versioned).
- Calendar + minimal analytics only.
- Incremental commits; no large mixed changes.

## Module Layout (Target End State)
- `assets/js/utils.js`
- `assets/js/data.js`
- `assets/js/index.js`
- `assets/js/project.js`
- `assets/js/calendarLoader.js` (Phase 5)
- `assets/js/theme.js` (optional Phase 6)

## Data Keys & Migration (Planned)
- New keys: `ppl:v1:projects`, `ppl:v1:logs`.
- One-time migration: if new keys empty and old `pmlog:v1:*` exist, copy then re-save under new names.

Migration Logic Draft (Task 0.5):
1. On first load of `data.js` implementation (Phase 1), read new keys.
2. If both arrays empty AND (oldProjects || oldLogs) exist under `pmlog:v1:*`, then:
	- Write old arrays to new keys.
	- (Optional) Flag migration complete by setting a boolean key `ppl:migrated:v1` to prevent re-running if user later re-adds old keys manually.
3. Do NOT delete old keys (keep reversible) — optional Phase 6 cleanup prompt may offer deletion.
4. Export operations always use new keys; import writes only to new keys.

## Validation Summary
- Project: id, name.
- Log: id, projectId exists, ISO date, results.
- Bundle: version===1, arrays present, each element valid.

## Calendar Simplicity
- Month view only; event click focuses log row.
- No editing in calendar for MVP.

## Analytics Scope
- totalLogs, firstDate, lastDate, activeDaysLast30.

## Testing Strategy
- QUnit CDN; focus on pure functions first.

## Risk Mitigation
- One concern per commit.
- Manual smoke test list after each phase.
- Keep README aligned with implementation.

## Acceptance Criteria (Condensed)
- All Phase 1–5 stories implemented without console errors.
- Export/import round trip preserves data.
- Calendar/list stay in sync after operations.


---
End of Plan Checklist
