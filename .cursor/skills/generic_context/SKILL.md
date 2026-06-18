---
name: generic_context
description: Contains generic context for how to locate documentation for the project, as well as other general implementation rules
---

## When to Use

- Use this skill only when invoked by the user, or when providing context to subagents and you deem this to be necessary, or when referenced in another skill you're using

## Instructions

- Before reading any other files, start with `project_schema.yaml` at the workspace root. It gives a full structural overview of the portfolio site: what each file/component does, and where all content lives.
- The portfolio is a Vite + React + TypeScript SPA styled with Tailwind CSS v4. All displayed content (resume data) is centralized in `src/data.ts` — this is the first place to look when updating copy, adding jobs, projects, or skills.
- Components in `src/components/` are purely presentational; they import from `data.ts` and have no internal state.
- If any part of the implementation is unclear, use the ask questions tool to clarify requirements with the user.
- Be sure to update `project_schema.yaml` when significant structural changes are made. Keep entries concise — roughly 1–2 sentences per item is enough for an LLM to know whether it needs to read the file.
