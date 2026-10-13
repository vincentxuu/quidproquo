---
title: "Framework Update: Mastra @mastra/core@1.76.0"
date: 2026-10-14
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.76 stops crash recovery from corrupting messages when multiple processes race for the same durable agent run, but a quiet default-model change can also swap your billing provider"
tldr: "Mastra @mastra/core@1.76.0 centers on multi-instance correctness: (1) each run is claimed by the process actually driving it, so crash recovery no longer restarts a run that's still executing; (2) storage adapters can enforce run fencing to reject writes from an execution that lost ownership; (3) PostgreSQL working-memory updates now merge atomically inside a row-locked transaction. Breaking changes: `@mastra/playground-ui` dropped its old Metrics card components, with `MetricsCardGroup`/`MetricsLineChart` losing a few props; Observational Memory now defaults to `model: 'auto'` instead of a fixed Gemini 2.5 Flash, so anyone who didn't pin a model explicitly will silently switch providers."
series:
  name: "AI Framework Changelog"
  order: 40
---

> 🌏 [中文版](/posts/daily/2026-10-14-framework-mastra-1.76.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | @mastra/core@1.76.0 |
| Previous version | @mastra/core@1.75.0 |
| Release date | 2026-10-11 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.76.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28,000 |

## Why this release matters

The scariest failure mode for a durable agent — one that persists its execution state so it can resume after a crash — isn't dying mid-run. It's two processes both deciding they should take over the same run and writing to the same thread at once. 1.76 nails this down directly: every run now has a clear owner whose claim keeps renewing, and crash recovery only steps in once that claim actually lapses (about 30 seconds after the process dies); where the storage adapter supports it, a process that lost ownership gets its writes rejected outright. For teams already running Mastra agents across multiple replicas, this fixes a real data-corruption scenario that's rare to hit in testing but genuinely happens in production. The cost: this release also touches two defaults that don't look like breaking changes at first glance — the Metrics panel components, and Observational Memory's default model moving from a fixed provider to one that tracks your main model. Miss either and your bill or your UI changes in ways you didn't expect.

## What changed

- **Durable agent run ownership + storage-level run fencing**: a run is claimed by whichever `stream()`, `generate()`, `resume()`, or `recover()` call is executing it; the claim renews on every tick and lapses about 30 seconds after the process dies. `recoverActiveRuns()` skips runs whose claim is still live (returning `status: 'skipped'` with a retry time); `recover()` throws `DURABLE_AGENT_RUN_ACTIVE` for a run still held elsewhere, requiring `force: true` to take it over — and even then, taking over a run the *same* process is still executing throws `DURABLE_AGENT_RECOVER_RUN_ACTIVE_LOCALLY`, so the same run can never end up executing twice at once. This fixes a previously reported bug (#23734) where crash recovery restarted a run that was still running, and the two executions clobbered each other's messages on the same thread
- **Atomic PostgreSQL working-memory merges**: schema-based working-memory updates with `scope: 'resource'` now deep-merge inside a row-locked transaction, so writers in separate processes changing different fields no longer stomp on each other. `mode: 'merge'` lets you request this explicitly over the API too, and adapters that can't support atomic merges now return a clear HTTP 400 instead of silently overwriting the record
- **File handling no longer stalls the whole thread**: when a provider rejects an attached file (an SDK refusal from OpenAI or Anthropic, or Gemini's 502), the new default `UnsupportedFileHandler` retries the call with the file stripped out, or swaps in a sandbox path when one's available — previously, a rejected file left in the thread would fail *every* later turn, even plain-text ones
- **`nestUnderParent` / `nestUnderRun()`**: lets a run — an LLM judge, say — attach as a true child span under an earlier run in the same trace, while keeping the parent run's trace-level identity, which is handy for nested scoring/judging traces
- **Automatic retry for Gemini's `MALFORMED_FUNCTION_CALL`**: the default `stream-error-retry-processor` now resends a failed step unchanged (up to twice) when it hits this intermittent Gemini error; no tool runs during that step, so the retry can't duplicate side effects. Durable agents aren't covered by this yet

## Breaking Changes

- `@mastra/playground-ui` removed its old Metrics card components in favor of new self-contained Metrics cards/dashboard building blocks
  - `MetricsCardGroup` no longer accepts `variant`; `MetricsLineChart` dropped `xAxisInterval`/`xAxisMinTickGap`
  - Affects: anyone who customized the playground's Metrics panel
- `@mastra/memory`'s Observational Memory now defaults to `model: 'auto'` (tracking your main model/provider) instead of the fixed `google/gemini-2.5-flash`
  - Affects: anyone relying on a fixed Gemini Flash to keep observation/reflection costs down — without an explicit model pin, the provider and rate will now shift along with whatever main model you're using

## Migration Guide

### Upgrading from 1.75.0 to 1.76.0

```bash
npm install @mastra/core@1.76.0
```

```typescript
// If you relied on Observational Memory defaulting to Gemini Flash for cost control,
// pin it explicitly now:
const memory = new Memory({
  observationalMemory: {
    model: "google/gemini-2.5-flash", // omitting this now means model: 'auto', tracking the main model
  },
});
```

```typescript
// Custom Metrics panel component — drop the removed props
// Before (1.75.0)
<MetricsCardGroup variant="compact">
  <MetricsLineChart xAxisInterval={5} xAxisMinTickGap={20} />
</MetricsCardGroup>

// After (1.76.0): these props no longer exist; rebuild against the new
// self-contained Metrics cards/dashboard building blocks in playground-ui
```

```typescript
// Taking over a stuck run in a multi-replica deployment
const stream = await durableAgent.recover(runId, { force: true });
// taking it over stops the execution that was holding it
```

## Compared to other frameworks

LangGraph and CrewAI mostly stop at single-instance retry when it comes to fault tolerance. Mastra 1.76 pushes durable agent correctness down to the storage adapter layer — run fencing, row-locked atomic merges — treating multi-replica data consistency as the framework's job rather than something you bolt on with your own distributed lock. That fits Mastra's long-standing bet on production TypeScript deployments. It's also a useful contrast with DSPy 3.4.1, released the same day: DSPy is chasing "how do we let the model optimize itself," while Mastra 1.76 is chasing "how do we stop an agent that's already running from corrupting its own state across machines" — two complementary problems that barely overlap.

## Today's takeaway

I assumed durable agent crash recovery just meant "restart from the saved checkpoint once the process dies." Seeing Mastra 1.76 split that into four distinct layers — claim a run, renew the claim, only recover once the claim actually expires, require a forced takeover to seize a run that's still live elsewhere — made it clear: the hard part isn't recovering a dead run. It's being sure a run is actually dead, rather than merely looking dead while another process is still driving it. Get that one judgment wrong once, and you have two executions writing the same message record at the same time.

## References

- [Mastra @mastra/core@1.76.0 Release Notes](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.76.0)
- [Mastra GitHub Repository](https://github.com/mastra-ai/mastra)
- [Mastra Durable Agents Documentation](https://mastra.ai/docs/harness/durable-agents)
