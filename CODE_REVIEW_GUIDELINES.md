# Code Review Guidelines (simple)

Purpose
Keep reviews focused on clarity, correctness and teachable code. The reviewer role may be a teacher or a peer student.

Checklist for review
- [ ] Does the change have a clear, short description in the PR?  
- [ ] Is the change small and focused (prefer < 200 LOC)?  
- [ ] Are pure functions covered by QUnit tests?  
- [ ] Are side-effects minimal and well-documented (storage writes, DOM changes)?  
- [ ] Are new strings and user-facing text clear and free of jargon?  
- [ ] Are there no secrets or environment-specific values committed?  
- [ ] If AI-assisted, is the prompt included and the output verified?  

How to give feedback
- Use small, actionable comments.  
- If a function is unclear, suggest renaming or extracting a helper.  
- For students: praise clarity & tests, request small changes instead of big rewrites.

Merging policy
- At least one human must approve.  
- Tests must pass locally and in CI before merge.  
- For lesson branches, teacher approval is recommended before merging to `main`.

Teaching note
- Use PR reviews as classroom activities: students review each other's PRs guided by this checklist.
