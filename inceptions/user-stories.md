# Inceptions / User Stories

Metadata
- Project: Personal Project Log (teaching edition)
- License: MIT
- Tests: QUnit via CDN
- Branch baseline: `00-original`
- Archive snapshot: `archives/index_20250826.html`

User stories (checklist)

## Core
- [ ] As a student, I can create a new project with a name so I can track multiple projects separately.
- [ ] As a student, I can view a list of my projects and select one to work on.
- [ ] As a student, I can add a log entry for a project with date, key results, observations, and reflections.
- [ ] As a student, I can edit and delete a log entry.
- [ ] As a student, my projects and logs are persisted in my browser so they remain between page reloads.

## Data Management
- [ ] As a student, I can export my data as a JSON file to back it up.
- [ ] As a student, I can import a JSON file to restore or replace my data (with validation and optional merge).
- [ ] As a teacher, I can provide sample data that students can load to start exercises.

## Navigation & Views
- [ ] As a student, I can navigate from the projects list to a project detail page (hybrid multi-page approach).
- [ ] As a student, on the project page I can see tabs for: Add Log, Logs List, Calendar View, and Analytics.
- [ ] As a student, I can use a table/list view to see all logs for the selected project.

## Calendar & Analytics
- [ ] As a student, I can view my logs on a calendar to see activity by date.
- [ ] As a student, I can view simple analytics: total logs, first & last log date, activity count in last 30 days.
- [ ] As a student, the calendar module is lazy-loaded to keep the initial page light.

## Filtering & Search
- [ ] As a student, I can search logs by text across results/observations/reflections.
- [ ] As a student, I can filter logs by date range.
- [ ] As a student, I can sort logs by date ascending/descending.

## Theming & UX
- [ ] As a student, I can toggle dark mode and my preference persists.
- [ ] As a student, I can see helpful empty state messages when there are no projects or logs.

## Tests & Validation
- [ ] As a teacher, I can run simple QUnit tests in the browser to check utility functions (id gen, analytics calculators, validation).
- [ ] As a student, I can read the README to learn how to run the project locally and deploy to GitHub Pages.

## Non-functional / Classroom
- [ ] As a teacher, code is organized into branches so students can follow incremental lessons.
- [ ] As a student, I can read comments and architecture notes explaining where code lives (App pattern) and why.

Notes / Acceptance Criteria
- Export bundle must include a `version` number and `exportedAt` timestamp.
- Import must validate JSON structure and give clear, non-technical error messages.
- Default storage keys must be namespaced with version (e.g., `pmlog:v1:projects`).
- Keep project UI mobile-friendly with Bulma responsive classes.

---
