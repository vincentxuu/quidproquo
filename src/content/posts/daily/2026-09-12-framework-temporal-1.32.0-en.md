---
title: "Framework Update | Temporal v1.32.0"
date: 2026-09-12
category: daily
type: digest
tags: [ai-agent, framework, daily, temporal]
lang: en
description: "Temporal v1.32.0 takes Standalone Activities to GA while shipping several breaking changes to Nexus callback routing and the query converter"
tldr: "Temporal v1.32.0 highlights: (1) Standalone Activities reach GA, with delayed starts, operator APIs (pause/resume/reset), and batch operations; (2) Nexus callbacks now route by URL scheme by default, removing the old header-based config — a breaking, security-driven change; (3) the Unified Query Converter becomes the default, tightening type validation and empty-string filtering on Visibility queries."
series:
  name: "AI Framework Changelog"
  order: 19
---

> 🌏 [中文版](/posts/daily/2026-09-12-framework-temporal-1.32.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Temporal |
| Version | v1.32.0 |
| Previous | v1.31.1 |
| Released | 2026-09-11 |
| Release Notes | [GitHub Release](https://github.com/temporalio/temporal/releases/tag/v1.32.0) |
| GitHub | [temporalio/temporal](https://github.com/temporalio/temporal) |
| Stars | 22.9k |

## Why This Version Matters

Temporal occupies an awkward spot in the Agent world: it isn't an Agent framework, yet it's the execution engine actually holding up reliability for a lot of long-running Agent tasks under the hood. The biggest signal in v1.32 is that Standalone Activities reach GA — an execution unit that isn't bound to a full Workflow lifecycle, and can be independently paused, resumed, or canceled. That's a better fit for the common case where an Agent task is just a handful of tool calls that don't need the overhead of full Workflow orchestration. The same release also changes how Nexus cross-service callbacks route, switching to URL-scheme-based routing by default — a security-driven change that fixes a case where, under certain configurations, an external callback could previously be mistaken for an internal request. Teams self-hosting a Temporal cluster to back long-running Agent workflows need to read the breaking changes carefully before upgrading.

## Key Changes

- **Standalone Activities GA**: `activity.enableStandalone` and `activity.startDelayEnabled` are now on by default, adding delayed starts, operator APIs (pause/resume an Activity, reset attempt state with optional heartbeat cleanup), and batch operations (cancel/terminate/delete by visibility query or explicit execution list) → Activities used to be manageable only as part of a Workflow; now they're an independently operable unit, a better match for "one Agent tool call" granularity
- **Proactive Activity Cancellation**: via a Nexus-based worker commands channel, the server no longer needs heartbeats to cancel an Activity on a worker — cancel commands go out for all in-flight Activities when a Workflow closes (terminate/timeout/cancel/continue-as-new) → fewer Agent tasks stuck waiting on tool calls that should already be done
- **CountWorkers API**: a new RPC counts workers matching a query filter without pulling full details → saves significant data transfer when monitoring a large worker fleet
- **One-time Versioning Overrides**: route a single Workflow to a specified Worker Deployment Version without creating a permanent Pinned override, automatically cleared once a Workflow Task completes on the target version; Child Workflows can also set Pinned/Auto-Upgrade/one-time routing independently of their parent
- **Poller Autoscaling observability**: a new `poller_scale_decision` counter tracks each scaling decision, plus server-side per-namespace auto-enroll (`frontend.pollerAutoscalingAutoEnroll`)
- **Task Queue Dynamic Partitioning (experimental)**: adjusts read/write partition counts based on task-add rate and backlog; no default policy yet, so operators need to validate settings themselves before applying
- **Workflow Task Completion Pagination (pre-release)**: lets a single `RespondWorkflowTaskCompleted` split across multiple requests, so a Workflow Task that exceeds the request size limit can still complete; disabled by default

## Breaking Changes

- Nexus callback routing changed: worker targets always use `temporal://system`; the old `Nexus-Callback-Source` header-based routing is only available when `callback.inspectSourceHeader` is explicitly enabled. The `nexusoperation.useSystemCallbackURL` and `component.nexusoperations.useSystemCallbackURL` settings have been removed
  - Impact: deployments using Nexus cross-service callbacks that depend on the old routing behavior
- `component.callbacks.allowedAddresses` → `callback.allowedAddresses`
  - Impact: deployments configuring the Nexus callback address allowlist via dynamic config
- Unified Query Converter is now the default: type validation on Visibility queries is stricter (e.g. `CustomKeyword = 123` now errors on the type mismatch, with an exception for numeric type conversions), and `Text` type fields can no longer be filtered against an empty or whitespace-only string → `system.visibilityEnableUnifiedQueryConverter: false` can temporarily restore the old behavior, but the legacy converter is slated for removal in v1.33
  - Impact: any project using custom Search Attributes for Visibility queries
- `VisibilityRow.ExecutionDuration` changed from `*time.Duration` to `*int64`
  - Impact: projects with a custom `VisibilityStore` implementation
- `Describe`/`List` batch responses now use explicit `*_WORKFLOW` enum values
  - Impact: client code comparing against the previously deprecated enum values
- Elasticsearch Visibility queries now default to disallowing partial results (`allow_partial_search_results=false`)
  - Impact: deployments using Elasticsearch as the Visibility store — pagination behavior of `ListWorkflowExecutions` and similar APIs may be affected
- `ListWorkers` no longer returns internal system workers by default; pass `include_system_workers` to see them
  - Impact: scripts that rely on the full `ListWorkers` response for monitoring or automation

## Migration Guide

### Upgrading from 1.31.x to 1.32.0

```bash
# Server side (pick the method matching your deployment; container image example below)
docker pull temporalio/server:1.32.0
```

```go
// If you have a custom VisibilityStore implementation, update the type accordingly
// Before
type VisibilityRow struct {
    ExecutionDuration *time.Duration
}

// After
type VisibilityRow struct {
    ExecutionDuration *int64
}
```

If your project depends on the old Nexus header-based callback routing, confirm all external callback sources have migrated to URL-scheme routing before upgrading, or set `callback.inspectSourceHeader: true` to buy transition time. If you use custom Search Attribute queries, run your existing queries against a test environment first to confirm they don't hit the new type-validation restrictions from the Unified Query Converter — then decide whether to delay migration with `system.visibilityEnableUnifiedQueryConverter: false`.

## Cross-Framework Observations

While frameworks like LangGraph and Mastra keep pulling memory and checkpointing into native features to reduce dependence on external persistence components, Temporal is moving in the opposite direction here — breaking Activities into finer, more independently operable units. That reflects two different bets on how long-running Agent tasks should work: one lets the Agent framework absorb persistence logic itself, trading for a lighter deployment; the other, Temporal's, keeps sharpening control at the execution-engine layer, positioning itself as infrastructure worth running underneath whatever framework sits on top. It's not clear yet which bet wins, but Standalone Activities reaching GA signals Temporal has no intention of ceding the Agent tool-call use case.

## Takeaway

I used to think Standalone Activities were just a syntactic simplification — an Activity that doesn't need to be wrapped in a Workflow. Seeing this release ship a full operator API (pause, resume, reset attempt state) and batch operations (cancel/terminate/delete by visibility query) in one go made it clear: what turns an execution unit from "experimental syntactic sugar" into "safe to run in production" isn't whether it works, but whether there's a full set of operational controls to intervene when it doesn't. This release is exactly filling that gap.

## References

- [Temporal v1.32.0 Release Notes](https://github.com/temporalio/temporal/releases/tag/v1.32.0)
- [Temporal GitHub](https://github.com/temporalio/temporal)
- [Temporal v1.31.1 Release Notes](https://newreleases.io/project/github/temporalio/temporal/release/v1.31.1)
- [Full Changelog: v1.31.1...v1.32.0](https://github.com/temporalio/temporal/compare/v1.31.1...v1.32.0)
