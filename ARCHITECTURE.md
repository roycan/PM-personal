# Architecture Overview

A lightweight, teaching-focused structure: **no build tools, no ES modules**, just ordered `<script>` tags and a single global `App` namespace. Each script file attaches exactly one surface (`App.utils`, `App.storage`, etc.) so migrating to real ES modules later is straightforward.

## Runtime Composition
Load order (critical):
1. `app.boot.js` – establishes `window.App`, event bus, theme init.
2. `utils.js` – pure helpers (id generation, date helpers, validation stubs).
3. `storage.js` – versioned persistence + import/export.
4. `render.*.js` – presentational helpers (list/detail rendering).
5. `vendor/*.js` – optional lazy loaders (e.g., FullCalendar) – may appear before main if needed, or injected dynamically.
6. `main.index.js` / `main.project.js` – page wiring (DOM events, calls into above surfaces).

## Global Surfaces
| Surface | Responsibility | Notes |
|---------|----------------|-------|
| `App.events` | Pub/Sub (on/off/emit/once) | Keeps pages de-coupled. |
| `App.log` | Simple tagged console logging | Teaching clarity. |
| `App.theme` | Light/dark mode toggle + persistence | Uses `localStorage`. |
| `App.utils` | Pure functions & validation | Safe to unit test. |
| `App.storage` | Get/save arrays + import/export + merge/overwrite | Returns JSON strings for exports. |
| `App.render.projects` | Project list rendering (future extraction) | Calls DOM APIs only. |
| `App.render.projectPage` | Project detail rendering (future extraction) | Tab logic / sections. |
| `App.vendor.fullcalendarLoader` | Lazy resource injector | Prevents upfront bundle weight. |

## Data Model (v1)
```
Project: { id, name, createdAt }
Log: { id, projectId, date, results, observations, reflections, createdAt }
Bundle: { version:"v1", exportedAt, data: { projects:[], logs:[] } }
```

## Import / Export Merge Policy
- Overwrite: replace all stored arrays.
- Merge: map by `id`; imported item with existing id replaces it; otherwise appended.
- (Future) Name collision resolution could prompt user (teachable extension).

## Analytics & Calendar
- Calendar lazy-loaded only when user visits the tab (`fullcalendar-loader.js`).
- Analytics currently computed inline; future: move into `App.utils.analytics.*` for pure-test coverage.

## Migration Path to ES Modules
1. Replace each `App.<surface> =` with `export const <surface> =` in its file.
2. Add `type="module"` to HTML and import surfaces where needed.
3. Remove global namespace scaffolding.
4. Pub/Sub could be replaced by simple event emitter import or native `EventTarget` instance.

## Testing Strategy
- QUnit pages per surface group (utils, storage).
- Keep functions deterministic; pass in Date or use wrappers for easier testing if needed.

## Future Accessibility Pass (Deferred)
- Keyboard navigation, ARIA roles for tabs & modals, focus trap in import modal.

## Design Rationale
- Minimizes cognitive load for students before introducing module syntax.
- Encourages separation-of-concerns compatible with later refactors.
- Maintains transparency (just open DevTools to inspect `App`).

---
Questions or architectural changes? Open an issue or start a discussion before large refactors.
