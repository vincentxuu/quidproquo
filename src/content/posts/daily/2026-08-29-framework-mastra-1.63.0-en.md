---
title: "Framework Update | Mastra @mastra/core 1.63.0"
date: 2026-08-29
category: daily
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.63 binds trace data directly into native log records, adds a worker /health endpoint so deployment platforms can gate rollouts, and ships one playground-ui breaking change"
tldr: "Mastra @mastra/core@1.63.0 in three points: (1) a new `AdaptableLogger` contract writes trace_id/span_id straight into native log records, replacing the old dual-write wrapper — `PinoLogger` in `@mastra/loggers` is the first to support it; (2) `@mastra/deployer` adds a standalone worker entry with a `/health` endpoint (503 while starting, 200 once ready) so deployment platforms can judge whether a rollout is safe; (3) breaking change: `@mastra/playground-ui`'s DataList drops `variant=\"lined\"`/`flushLeft`/`flushRight`/`MonoCell` in favor of `DataList.TextCell font=\"mono\"`."
series:
  name: "AI Framework Changelog"
  order: 9
---

> 🌏 [中文版](/posts/daily/2026-08-29-framework-mastra-1.63.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | `@mastra/core@1.63.0` |
| Previous | `@mastra/core@1.62.0` |
| Release Date | 2026-08-28 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.63.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 27.5k |

## Why This Release Matters

Mastra 1.63 fixes a problem most teams don't hit until they're already in production: the trace system and the application's own logs run on two parallel tracks. Mastra used to solve this with a dual-write wrapper — the same event got written once to the trace system and once to the log system, kept in sync purely by convention. The moment either side dropped a write or drifted in format, a trace in Studio had no way to jump to its matching native log line. 1.63 introduces the `AdaptableLogger` contract, which injects `trace_id`/`span_id` directly into the native log record and derives the observability `LogEvent` from that same record — essentially replacing "two separate outputs reconciled after the fact" with "one output that naturally carries the fields." `@mastra/loggers`'s `PinoLogger` is the first logger to implement this contract, hooking trace fields in through pino's mixin mechanism while preserving any custom mixin fields a user has already set. The same release also closes a deployment-side gap: `@mastra/deployer` now generates a standalone worker entry with a `/health` endpoint — 503 while starting, 200 once initialization completes — so Kubernetes or any other deployment platform can use that signal for rollout gating instead of relying on the crude "is the process still alive" check.

## Notable Changes

- **Logger adapter contract (`AdaptableLogger`)**: `@mastra/core/logger` adds a standardized contract letting a logger write `trace_id`/`span_id` into native log records during a traced operation and derive the observability `LogEvent` from that same record → the built-in `ConsoleLogger` already implements it; `Mastra` gains a `loggerOptions` setting with two independent toggles, `correlation` (inject trace fields, on by default) and `export` (forward log records to observability storage, on by default); an existing `IMastraLogger` that hasn't implemented the adapter still falls back to the old dual-write wrapper, but that path is now marked deprecated and will be removed in the next major version
- **PinoLogger gains trace-context support**: `@mastra/loggers`'s `PinoLogger` implements the adapter contract, adding trace fields to stdout, file, and custom transports via a pino mixin while keeping the user's own mixin fields intact → native application logs and Mastra observability line up without wiring your own middleware
- **Trace/log linking fixed for non-exported spans**: logs/metrics emitted from internal or excluded spans now link to "the nearest ancestor span that will actually be exported," or omit `spanId` entirely if none exists → fixes the Studio bug where clicking through led to no matching trace
- **Deployment readiness probe**: `@mastra/deployer` adds a standalone worker entry to the standard build artifact along with a `/health` endpoint (503 while starting, 200 once ready) → deployment platforms can use this signal to judge whether a rollout is safe instead of guessing
- **Scheduler/resume robustness fixes**: workers can now discover and run schedules created after startup without a restart; resume logic now correctly handles falsy resume payloads (`false`/`0`/`""`), preventing a suspended background task from being mistaken for one with no payload and re-triggered → more reliable for deployments running long-lived schedules and background tasks

## Breaking Changes

- `@mastra/playground-ui`'s `DataList` API cleanup drops `variant="lined"`, `flushLeft`/`flushRight`, per-cell `height`, and `DataList.MonoCell`
  - Affected: projects embedding `@mastra/playground-ui`'s `DataList` component directly or using the props/`MonoCell` above; use `DataList.TextCell font="mono"` in place of `MonoCell`

## Migration Guide

### Upgrading from 1.62.x to 1.63.0

```bash
# Step 1: update the dependency
pnpm add @mastra/core@1.63.0
```

```tsx
// Step 2: if you embed @mastra/playground-ui's DataList directly
// Old (1.62.x)
<DataList variant="lined" flushLeft>
  <DataList.MonoCell>{value}</DataList.MonoCell>
</DataList>

// New (1.63.0)
<DataList>
  <DataList.TextCell font="mono">{value}</DataList.TextCell>
</DataList>
```

Projects that only call the `@mastra/core` API (without embedding `@mastra/playground-ui` components directly) have no breaking changes in this release and can upgrade as-is. To adopt trace-correlated logging, switch your logger to `@mastra/loggers`'s `PinoLogger`, or adjust `correlation`/`export` behavior via `loggerOptions` as needed.

## Cross-Framework Observations

Trace data drifting out of sync with native logs is a common second-stage problem for agent frameworks building out observability — the first stage is getting traces/spans working at all, and the second is realizing what users actually want is to click one trace and see every related log from that time window, not two systems each doing their own thing. Mastra's move here is to bind the two at the record level via an adapter contract — a lower barrier to entry than requiring the whole stack to adopt the OpenTelemetry Logs API outright (Pino support ships first), but it also means other loggers only get this benefit once they implement their own adapter. Combined with this release's new worker `/health` endpoint, this update isn't about adding new agent capabilities — it's closing two common pain points on the path to production (trace/log mismatch, no rollout health probe), and it'll land harder for teams already running Mastra in production than for teams still at the POC stage.

## Takeaway

I used to assume it was normal for trace systems and application logs to be designed separately, each optimized for its own format, kept aligned manually through a shared field like `trace_id`. Seeing Mastra collapse the two into "one log record, read two different ways" made it click that dual-write — reconciling after the fact — carries a hidden assumption: that the two write paths will never miss a beat or fall out of sync. But the moment one code path forgets to write to one of them, the two sides quietly diverge without ever throwing an error. Converging on a single source of truth and deriving different views from it is a design that's much harder to break than reconciling two datasets after the fact.

## References

- [Mastra @mastra/core@1.63.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.63.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.62.0 — GitHub Release (previous version)](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.62.0)
