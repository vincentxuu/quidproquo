---
title: "Framework Update: Inngest v1.49.0"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, framework, daily, inngest]
lang: en
description: "Inngest v1.49.0 opens up function replay and resume through the v2 API, CLI, and MCP, letting stuck or failed agent workflows be recovered directly"
tldr: "Two things in Inngest v1.49.0: (1) a new v2 API for function replay, which replays a specific run by time range and status, callable from the API, CLI, or MCP; (2) a new v2 API for resuming a function, letting a paused workflow recover straight from the control plane without hand-rolled polling. No breaking changes for SDK users; self-hosted teams should follow the migration notes' deployment order."
series:
  name: "AI Framework Changelog"
  order: 52
---

> 🌏 [中文版](/posts/daily/2026-10-24-framework-inngest-v1.49.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Inngest |
| Version | v1.49.0 |
| Previous version | v1.48.0 |
| Release date | 2026-10-23 |
| Release Notes | [GitHub Release](https://github.com/inngest/inngest/releases/tag/v1.49.0) |
| GitHub | [inngest/inngest](https://github.com/inngest/inngest) |
| Stars | 5,968 |

## Why this release matters

[The last release covered here (1.46.0)](/posts/daily/2026-10-07-framework-inngest-1.46.0-en) connected local development straight to a Cloud sandbox. This one fills in an operational gap for long-running workflows: function replay and resume, exposed for the first time through all three of the v2 API, the CLI, and MCP at once. Replaying a failed run or resuming a stuck function used to mean clicking around the dashboard by hand, or writing your own polling loop to check status. Now both are standard calls any caller can trigger. For teams writing long-running agent workflows that wait on external events or human review, that means a stuck agent can be detected and recovered by an automated system, without a human in the loop.

## Key Changes

- **New v2 API for function replay**: replay a function's past runs by time range and status through the API (`POST /api/v2/apps/{app_id}/functions/{function_id}/replays`), the CLI (`inngest api create-replay`), or MCP (`create_replay`) → debug a failed or skipped run in a specific time window without re-triggering the whole event
- **New v2 API for resuming a function**: resume a paused function through the API (`POST /v2/apps/{app_id}/functions/{function_id}/resume`), the CLI, or MCP → a long-running agent workflow stuck waiting on an external event can recover straight from the control plane, no hand-rolled polling needed
- **CQRS pagination fix**: run pagination now includes skipped runs and keeps precise paging → replay queries can now correctly find every run in a "skipped" state
- **Dashboard shows replay failures and correct skipped counts** → a failed replay no longer disappears silently; operators can see directly which replays didn't succeed
- **API request-limit fix**: size limits are now enforced before parsing → closes a bypass where a trailing slash skipped the event request size limit

## Breaking Changes

None for SDK users. Self-hosted teams should read the release's Migration Notes: the GraphQL change in #5018 needs to ship first, dashboard builds use the live API, and the new error field shouldn't be removed until the dashboard can safely roll back.

## Migration Guide

Just upgrade — no code changes needed:

```bash
# Go-based inngest CLI / server
go install github.com/inngest/inngest/cmd/inngest@v1.49.0
```

Teams self-hosting Inngest should confirm the dashboard version can roll back safely before deploying #5018's GraphQL change and removing the new error field.

## How it compares to other frameworks

Temporal has polished long-running signal/resume support for years. By opening function replay and resume to the API, CLI, and MCP all at once, Inngest is closing the gap on exactly the operational capability Temporal is known for, rather than staying a serverless workflow engine confined to the queueing and scheduling layer.

## Today's Takeaway

I used to think of function replay and resume as back-office debugging tools an operator clicks through in a dashboard. Watching Inngest open both up to the API, CLI, and MCP at once made it clear that this turns "recovering a stuck agent" into a standard action an agent — or an external automation — can call directly, rather than something that only a human can trigger.

## References

- [Inngest v1.49.0 Release Notes](https://github.com/inngest/inngest/releases/tag/v1.49.0)
- [inngest/inngest GitHub Repository](https://github.com/inngest/inngest)
- [Inngest v1.46.0 — previous framework update](/posts/daily/2026-10-07-framework-inngest-1.46.0-en)
- [Full Changelog: v1.48.0...v1.49.0](https://github.com/inngest/inngest/compare/v1.48.0...v1.49.0)
