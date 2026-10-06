---
title: "Framework Update: Inngest v1.46.0"
date: 2026-10-07
category: daily
type: digest
tags: [ai-agent, framework, daily, inngest]
lang: en
description: "Inngest 1.46 lets a local dev environment connect straight to a Cloud sandbox to run agent code, and replaces one all-or-nothing API key with scoped, expiring versions"
tldr: "Three things in Inngest v1.46.0: (1) after running `inngest login`, a local workflow can connect directly to a Cloud sandbox to run agent code, with no need to deploy a full app or configure an SDK sandbox token (experimental); (2) API keys move from one all-powerful credential to versions scoped to the v2 API, CLI, or MCP, with optional expiry; (3) a Dashboard dependency, TanStack Start, is patched for CVE-2026-102989, a reflected XSS. No breaking changes — just upgrade."
series:
  name: "AI Framework Changelog"
  order: 34
---

> 🌏 [中文版](/posts/daily/2026-10-07-framework-inngest-1.46.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Inngest |
| Version | v1.46.0 |
| Previous version | v1.45.1 |
| Release date | 2026-10-06 |
| Release Notes | [GitHub Release](https://github.com/inngest/inngest/releases/tag/v1.46.0) |
| GitHub | [inngest/inngest](https://github.com/inngest/inngest) |
| Stars | 5,917 |

## Why this release matters

Inngest positions itself as a serverless workflow engine that happens to run AI workflows too, and most recent releases have been queue-performance and dashboard polish. 1.46 is the first release to pull "where does the agent's code actually run" into the platform itself: a local dev environment can now run `inngest login` and connect straight to a Cloud sandbox, with no need to deploy the whole app first or hand-configure an SDK sandbox token. For teams writing agents that call out to a code interpreter, that means local development and the production sandbox finally share one execution path, instead of maintaining a separate local simulation. The same release also replaces the old all-or-nothing API key with versions scoped to a specific use case and an optional expiry — a concrete security win for anyone running agents through CI or calling Inngest over MCP.

## Key Changes

- **Local workflows connect to Cloud sandboxes**: after `inngest login`, a local workflow can run agent code directly in a Cloud sandbox → no app deployment and no SDK sandbox token needed, but it's experimental: it needs a compatible JavaScript SDK build, and login is scoped to a single Cloud environment that already has sandbox access and a default VPC
- **Scoped API keys**: admins can create API keys scoped to the v2 API, CLI, or MCP, with an expiry date or no expiry → existing API and signing keys keep working unless an admin disables legacy key access
- **Sandbox secrets management**: the dashboard sidebar can import `.env` files to manage secrets, and the API accepts `secrets: ["OPENAI_API_KEY"]` to inject a stored secret into a sandbox by name → the release notes explicitly flag this as "an unshipped feature" that needs matching API, control-plane, and SDK support deployed together
- **Tracing now includes custom concurrency keys**: custom concurrency expressions and their evaluated values now show up in run and execution traces and through the trace GraphQL API (values over 512 characters are truncated) → debugging a concurrency bottleneck no longer means guessing
- **Realtime streaming gets guardrails**: publishing stops once execution is canceled or streaming runs past five minutes, a publish failure no longer discards the function's response, and the publishing endpoint now sends the authentication header the realtime API expects → a slow stream can no longer hang the whole function
- **CVE patch**: the dashboard's TanStack Start dependency is bumped to 1.168.60, fixing [CVE-2026-102989](https://tanstack.com/blog/tanstack-start-security-update-cve-2026-102989), a reflected XSS in server-function responses

## Breaking Changes

None in this release.

## Migration Guide

Just upgrade — no code changes needed:

```bash
# Go-based inngest CLI / server
go install github.com/inngest/inngest/cmd/inngest@v1.46.0
```

To try the experimental local-to-Cloud-sandbox connection, confirm your JavaScript SDK version is compatible, then run `inngest login` scoped to a single Cloud environment that already has sandbox access and a default VPC; use `inngest login --force` to switch environments. Sandboxes persist after shutdown and need to be cleaned up explicitly.

## How it compares to other frameworks

Like Temporal, Inngest has long positioned itself as a workflow engine doubling as an execution substrate for agents, but both left the question of where agent code actually runs in a sandbox to dedicated services like E2B or Daytona. 1.46's local-to-Cloud-sandbox connection is a signal that this piece is moving back inside the platform. Several of these features — sandbox secrets management, the local sandbox connection itself — are still experimental or explicitly unshipped, though, so Inngest still has some distance to go before it offers an agent primitive as ready to use as what Mastra or LangGraph already ship.

## Today's Takeaway

I used to treat "workflow orchestration" and "the sandbox an agent's code runs in" as two separate layers of infrastructure — one handling flow and retries, the other handling isolation and security. Watching Inngest wire a local login straight into a Cloud sandbox made it clear that workflow-engine vendors are pulling "where the agent runs" into their own platform surface, rather than leaving an interface for dedicated services like E2B or Daytona to plug into.

## References

- [Inngest v1.46.0 Release Notes](https://github.com/inngest/inngest/releases/tag/v1.46.0)
- [inngest/inngest GitHub Repository](https://github.com/inngest/inngest)
- [TanStack Start security update: CVE-2026-102989](https://tanstack.com/blog/tanstack-start-security-update-cve-2026-102989)
