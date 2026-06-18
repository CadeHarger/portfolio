---
name: test_fix_iterate
description: Contains specific instructions for how to go about running my agentic loop that runs integration tests, fixes bugs that were found, and then repeating. Only run when manually called.

## When to Use

- Use this skill when manually called. 

## Instructions

- When looking for where to make changes, start with `repo_schema.yaml`, then read the relevant sub-schemas before doing your own exploring. These files contain high-level information about what each file/folder in the repo contains, allowing you to quickly understand the project, its features, its architecture, and where to make changes.

**If working on the scepter backend (`scepter/backend/`):**
- Read `scepter/features.yaml` and `scepter/backend/backend_schema.yaml`.
- Run tests via `cd scepter/backend && python -m pytest tests/ -q`.
- Ensure editable installs for shared packages are current after monorepo moves: `pip install -e ../../core/packages/im_core -e ../../core/packages/im_browser_agent` from `scepter/backend/`.
- Plan where to make changes. If any part of how an implementation should be is unclear, use the ask questions tool if you need to clarify requirements with the user.
- Implement changes
- Summarize your context to shorten it and save tokens, only saving what will be relevant for the next test iteration (like if the same tests fail again) to prevent excessive token usage
- Repeat until all tests pass or the same bug fails twice (then escalate to the user with what you know).

**If working on the main app end-to-end (scepter/frontend + scepter/backend):**
- Read `scepter/features.yaml`, `scepter/frontend/frontend_schema.yaml`, and `scepter/backend/backend_schema.yaml`. Note: E2E tests cover the main `scepter/frontend` app only, not `exec_threat/frontend`.
- Run tests via `npm run test:e2e`. Exclude the output from your context if possible.
- View the report via `npx playwright show-report test-results/report`

**If working on the integration_agent:**
- Read `integration_agent/integration_agent_schema.yaml`.
- Run tests via `pytest` inside the `integration_agent/` directory.
- Tests live in `integration_agent/tests/`.
- Plan where to make changes. If any part of how an implementation should be is unclear, use the ask questions tool if you need to clarify requirements with the user. 
- Implement changes
- Summarize your context to shorten it and save tokens, only saving what will be relevant for the next test iteration (like if the same tests fail again) to prevent excessive token usage
- Repeat this process until:
    - A) All tests pass
    - B) You have failed to fix the same bug/issue twice. In this case the user will look into it again and help you, as there is probably missing context or something out of your control. If this is the case, note to the user what you know about the issue at the end.

Notes:
- Overlapping coverage in e2e and backend tests is okay and expected, but don't go too overboard

Principles:
- Non-integration Tests should be (mostly) Mutually Exclusive and (mostly) collectively exhaustive
