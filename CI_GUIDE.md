# CI Guide (proposed) — Deferred Implementation

This project currently defers adding GitHub Actions. Below is a proposed CI workflow and guidance for teaching and later enabling it.

Goals
- Run linting and QUnit tests in a reproducible environment on every PR.
- Keep CI simple and not dependent on Node/npm.

Proposed approach
1. Use a simple static server (Python's `http.server` or Node's `serve`) to serve the repo.
2. Run a headless browser test runner to execute QUnit tests and collect results.

Example GitHub Actions approach (outline)
- Job: `ci`
  - Runs-on: ubuntu-latest
  - Steps:
    - Checkout repo
    - Setup Python
    - Serve tests: `python3 -m http.server 8000 &`
    - Wait for server to be ready
    - Run headless browser runner (e.g., `playwright` or `puppeteer`) to open `http://localhost:8000/tests/index.html` and gather QUnit output.

Why deferred
- Playwright or Puppeteer require Node tooling and downloading browser binaries. To avoid adding that tooling now, CI is deferred until you want it.

Teaching guide
- Locally, students can run tests by serving files with `python3 -m http.server` and opening `tests/index.html` in a browser.
- When ready to enable CI, choose between lightweight headless runners or a small Docker-based runner with pre-installed headless Chromium.

YAML suggestion (for later)
I can provide a ready-to-use `ci.yml` that uses Playwright and Node, or a Docker-based option if you prefer no Node on the host. Tell me which you prefer and I will draft the exact YAML.
