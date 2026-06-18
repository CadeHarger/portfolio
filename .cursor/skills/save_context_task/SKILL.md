---
name: save_context_task
description: Instructions for creating a subtask in a way that saves context
---

## When to Use

- Use this skill only when invoked by the user

## Instructions
- When invoked, the user is wants you to complete the task using subagent(s) (of model type composer, the newest version, unless otherwise specified). They want this in order to save context in the main thread that the agent is using. 
- All code exploration should be done by the subagent. You should just provide the problem description as well as any relevant context from your thread to jumpstart the process for the subagent.
- For example, this could be useful when writing test cases for a feature you just implemented. Writing tests is narrow in scope, but understanding the testing setup could take up valuable context in the main thread, so it's best to delegate this to a subagent.
