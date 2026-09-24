---
title: "Framework Update: Mastra @mastra/core@1.69.0"
date: 2026-09-25
category: daily
type: digest
tags: [ai-agent, framework, daily, mastra]
lang: en
description: "Mastra 1.69 turns routing decisions and safety gating into one typed Classifier primitive that doubles as a workflow branch condition and an agent input/output guard, alongside three breaking changes"
tldr: "Four things worth knowing in Mastra @mastra/core@1.69.0: (1) a new Classifier primitive turns fixed-option LLM judgments into a first-class component you can register on a Mastra instance, with automatic tracing; (2) a Classifier can be used directly as a typed workflow step for branching, or wrapped in a ClassifierProcessor to guard agent input/output/streaming content, failing closed by default; (3) context.background.adopt() lets a tool acknowledge immediately while handing off a long-running background task, and @mastra/connect@0.3.0 ships ten new SaaS integrations at once; (4) breaking changes: @mastra/playground-ui's PageLayout/FluidHoverHighlight APIs were reworked, and the group option on trace queries is now deprecated."
series:
  name: "AI Framework Changelog"
  order: 26
---

> 🌏 [中文版](/posts/daily/2026-09-25-framework-mastra-1.69.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Mastra |
| Version | `@mastra/core@1.69.0` |
| Previous | `@mastra/core@1.68.0` |
| Release date | 2026-09-24 |
| Release Notes | [GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.69.0) |
| GitHub | [mastra-ai/mastra](https://github.com/mastra-ai/mastra) |
| Stars | 28.3k |

## Why this release matters

[The last post (1.67.0)](/en/posts/daily/2026-09-17-framework-mastra-1.67.0-en) covered agents that could generate their own workflows and wire up third-party services on their own. 1.69 fills in a different piece of infrastructure: it turns "making a judgment" into a typed primitive that can be traced and consumed directly by a workflow. Safety gating and routing decisions used to mean either an instruction buried in a prompt, or a hand-rolled helper function that calls an LLM and parses JSON back out. Neither approach gives you a consistent interface, and auditing what a given judgment actually evaluated — or how many tokens it burned — is close to impossible. Mastra 1.69's `Classifier` collapses this into a formal component: register it centrally on a `Mastra` instance, and every evaluation automatically opens a `CLASSIFIER_EVALUATION` tracing span. The same Classifier can act as a typed workflow step for branching, or be wrapped in a `ClassifierProcessor` to guard an agent's input, output, and streaming content — and the new processor fails closed by default, blocking a request outright when the judgment call itself fails rather than letting it through. Routing logic and safety policy now share the same piece of infrastructure for the first time, instead of two separate, ad hoc mechanisms.

## Key Changes

- **The Classifier primitive (`@mastra/core/classifier`)**: a new `Classifier` class for fixed-option evaluation, registerable via `new Mastra({ classifiers })`, with `getClassifier`/`listClassifiers`/`addClassifier`/`removeClassifier` management APIs. An evaluation outside an active trace opens its own root `CLASSIFIER_EVALUATION` span → a judgment call becomes a component you can test and observe on its own, instead of a hidden LLM call buried inside agent logic
- **Classifiers as typed workflow steps for branching**: a workflow can chain `.classifier(router)` directly into a fluent or dynamic graph, and branch conditions read the classifier's typed answer plus its token usage → hand-rolled conditional branches become a declarative `.branch([...])` fed by a structured judgment result
- **`ClassifierProcessor`: a safety gate for agent input/output/streaming**: the new `ClassifierProcessor` plugs into `inputProcessors`/`outputProcessors`, evaluates content through a classifier, and calls `abort()` from `onResult` to reject a request. It **fails closed by default** — a failed classifier call blocks the request; opt into the old fail-open behavior with `errorStrategy: 'warn'` → safety policy no longer depends on the agent obediently following a prompt instruction, but sits in a separate layer with an explicit abort semantic
- **`context.background.adopt()`: native background tool execution**: a tool can acknowledge immediately, then hand a long-running operation to Mastra via `context.background.adopt({ completion, cancel })` for it to track completion and cancellation, instead of keeping `execute()` pending → a long task (say, "research this topic for me") can confirm receipt right away while staying trackable and cancellable — though the adopted handle lives only in memory and won't survive a process restart
- **`@mastra/connect@0.3.0`: ten SaaS integrations in one release**: ten Nango-template-generated tool providers — Slack, GitHub, Google Mail, Google Calendar, Fireflies, PostHog, Stripe, Discord, Twitter/X, and HubSpot. Once a Mastra Platform connection is set up, `tools: connect()` resolves the right tools per request → agents no longer need hand-written tool wrappers to reach these services
- **More reliable durable execution on Inngest**: workflows and durable agents accept a new `retries` option, so a run can survive a process restart or redeploy by retrying and continuing past completed steps. `resumeStream()`, `approveToolCall()` and related resume methods fix two bugs — durable execution getting lost after an editor override, and a suspended run failing to find its snapshot → a long-running durable agent no longer fails outright over a single deploy

## Breaking Changes

- `@mastra/playground-ui`: `@mastra/playground-ui/lib/springs` is removed; `FluidHoverHighlight` now only accepts `hover` and `className`
  - Affected: projects customizing Mastra Studio UI with `FluidHoverHighlight` or the spring animation API directly
- `@mastra/playground-ui`: `PageLayout`/shell APIs were reworked — `PageLayoutRoot`, `MainContentLayout`, `MainContentContent`, and several `AppShell` header-related props/contexts are removed. Migrate to the new `PageLayout` (`breadcrumbs`, `headerActions`, `actionRow`)
  - Affected: projects customizing Mastra Studio pages with these layout components
- Trace grouping is now deprecated across Core/Server/Client: the `group` option on `queryTraces()` and the trace-query contract is deprecated in favor of `queryTraceThreads()`/the `queryThreads` contract (still functional until the next major release)
  - Affected: code querying traces with `group: { by: ['threadId'] }`

## Migration Guide

### Upgrading from 1.68.x to 1.69.0

```bash
pnpm add @mastra/core@1.69.0
```

```tsx
// Before (1.68.x and earlier, playground-ui)
import { FluidHoverHighlight } from '@mastra/playground-ui/lib/springs';
<FluidHoverHighlight hover={hover} spring={mySpringConfig} className="rounded-lg" />;

// After (1.69.0)
import { FluidHoverHighlight } from '@mastra/playground-ui';
const hover = useFluidHover(containerRef);
<FluidHoverHighlight hover={hover} className="rounded-lg" />;
```

```ts
// Before: grouped trace query
await mastraClient.queryTraces({ timeRange, group: { by: ['threadId'] } });

// After: query threads instead
await mastraClient.queryTraceThreads({ traces: { timeRange } });
```

Projects that don't customize Mastra Studio's playground-ui components and don't use grouped trace queries have no breaking changes here — just upgrade.

## Comparison with other frameworks

LangGraph's conditional branching (the `when()` syntax) wires a hand-written Python predicate function into the graph — the judgment logic itself is never a first-class part of the framework. Mastra's Classifier goes the other way: it structures the LLM judgment itself into a typed component with a management API and automatic tracing, then lets both workflows and agent input/output guards consume the same primitive. That's a different problem from what Composio solves with integration aggregation ("agents need to call lots of tools"); Mastra is addressing something more fundamental here — "agents need to make judgments." Safety gating and routing branches used to be two separately hand-rolled pieces of logic; now they're two uses of the same component.

## Today's Takeaway

I used to think agent safety gating meant adding a line to the system prompt asking the model to "please refuse unsafe requests." Seeing `ClassifierProcessor` fail closed by default, as a component sitting outside the agent's main execution path, changed that: the reliability of a safety policy shouldn't rest on whether the model obediently follows a prompt instruction. It should be a piece of infrastructure with an explicit abort semantic — one that blocks by default when the judgment itself fails, rather than letting things through. That's a different order of guarantee than a few extra sentences in a prompt.

## References

- [Mastra @mastra/core@1.69.0 — GitHub Release](https://github.com/mastra-ai/mastra/releases/tag/%40mastra%2Fcore%401.69.0)
- [mastra-ai/mastra — GitHub](https://github.com/mastra-ai/mastra)
- [Mastra @mastra/core@1.67.0 — previous framework update](/en/posts/daily/2026-09-17-framework-mastra-1.67.0-en)
- [PR #24738: Classifier registration API](https://github.com/mastra-ai/mastra/pull/24738)
- [PR #24747: Classifier as a typed workflow step](https://github.com/mastra-ai/mastra/pull/24747)
- [PR #24768: `ClassifierProcessor`](https://github.com/mastra-ai/mastra/pull/24768)
- [PR #24793: `ClassifierProcessor` fails closed by default](https://github.com/mastra-ai/mastra/pull/24793)
- [PR #24418: `context.background.adopt()`](https://github.com/mastra-ai/mastra/pull/24418)
- [PR #24606: ten new `@mastra/connect` providers](https://github.com/mastra-ai/mastra/pull/24606)
- [PR #24741: `retries` option for Inngest workflows/durable agents](https://github.com/mastra-ai/mastra/pull/24741)
