# AI Prompt Bank (curated)

Purpose: provide safe, repeatable prompts students and teachers can use when asking an AI to help with this repo. Store prompts here to make AI usage transparent and reproducible.

Guidelines
- Keep prompts small and specific.
- Always request tests for logic changes.
- Ask for short, readable code (avoid one-liners that are hard to read).
- When using AI outputs, add the prompt plus verification notes to PR description.

Prompts

1) Generate a pure helper + tests
```
Context: This project uses IIFE/global `App` pattern. Place pure helpers in `App.utils`. Create a function `formatDateISO(dateString)` that accepts `yyyy-mm-dd` or ISO strings and returns `YYYY-MM-DD` normalized. Add QUnit tests for normal and edge inputs.

Output: only the JS code for the helper and the QUnit test file. Keep code short and readable.
```

2) Refactor a function into pure helpers
```
Context: file: `assets/js/main.index.js`. The function `renderProjects()` is 40 lines long and mixes DOM + logic. Extract logic that builds an HTML string for a project row into a pure helper `buildProjectRowHTML(project, activeProjectId)` and add QUnit tests for the helper.

Output: 1) helper code 2) test code 3) suggested diff for replacing inline logic with the helper.
```

3) Draft lesson notes for a branch
```
Context: Branch `03-multi-page-structure` implements `index.html` and `project.html`. Draft a concise lesson note (200-300 words) that explains why we separated pages, how URL params select a project, and a short classroom exercise.

Output: markdown only.
```

4) Create a PR description template
```
Context: Given a branch name and commit messages, generate a PR description with Summary, What changed, How to test locally, and any follow-ups.

Output: PR markdown only.
```

Safety prompts (what not to ask AI to do automatically)
- Do not request AI to perform direct data migrations without human review.
- Do not ask AI to run or commit changes automatically to `main`.

Add your own prompts below as lessons evolve.
