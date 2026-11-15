---
title: "Framework Update: AG2 v1.3.0"
date: 2026-11-07
category: daily
type: digest
tags: [ai-agent, framework, daily, ag2]
lang: en
description: "AG2 v1.3.0 lets an ancestor agent observe events across its whole delegation tree, gives variables explicit scopes with ScopedValue, deprecates four old APIs, and raises the Python floor to 3.11"
tldr: "Three things in AG2 v1.3.0: (1) `@observer(ChildEvent)` lets an ancestor agent receive events from its entire delegation tree, including streamed chunks, without any of it landing in the ancestor's own model transcript; (2) `ScopedValue` adds COPIED/LOCAL/SHARED scopes that spell out exactly how a variable crosses a delegation boundary; (3) Breaking: `TaskConfig`, `Agent(assembly=...)`, `Agent(knowledge=...)`, and `Agent.task()` are deprecated and removed in 1.4, and the minimum Python version is now 3.11."
series:
  name: "AI Framework Changelog"
  order: 63
---

> 🌏 [中文版](/posts/daily/2026-11-07-framework-ag2-v1.3.0)

## Release Info

| Item | Value |
|---|---|
| Framework | AG2 (formerly AutoGen) |
| Version | v1.3.0 |
| Previous version | v1.2.2 |
| Released | 2026-11-04 |
| Release Notes | [v1.3.0](https://github.com/ag2ai/ag2/releases/tag/v1.3.0) |
| GitHub | [ag2ai/ag2](https://github.com/ag2ai/ag2) |
| Stars | 5.0k |

## Why this release matters

The moment multi-agent work involves delegation, two problems show up right away: the parent can't see what a child agent is doing, and when a child changes some shared variable, it's unclear whether the parent or its siblings should see that change too. AG2 used to leave both problems to the developer — want visibility, bolt on a callback that prints logs; want shared state, pass a reference around and hope nothing silently overwrites it. 1.3 turns both into first-class APIs: `@observer` lets events surface from a child at any depth without mixing into the parent's own reasoning context, and `ScopedValue` turns "should this variable be shared across nodes" into a declaration instead of a verbal agreement. The release also cuts: four older APIs are now deprecated and the Python floor moves to 3.11, consolidating a direction the last few releases had been building toward.

## What changed

- **Delegation-tree event observation**: `@observer(ChildEvent)` lets an ancestor agent receive every event emitted by any descendant — including `ModelMessageChunk` from streaming — without that event entering the ancestor's own model transcript or triggering its tools or model loop → build unified progress monitoring or live UI updates without polluting the parent agent's reasoning context
- **Events can be addressed back**: an observed event carries `event.origin`, and `await event.origin.send(...)` delivers a message back to the exact delegation node that raised it, through that node's own normal handling path → a parent can actively intervene on a specific child instead of just passively listening in
- **Explicit variable scopes (`ScopedValue`)**: adds `Scope.COPIED` (deep-copied per branch, the default for plain values), `Scope.LOCAL` (not inherited by descendants), and `Scope.SHARED` (one binding shared across the whole invocation tree) → when agents share state, which variables are shared and which stay isolated is declared upfront instead of discovered later while debugging an accidental shared reference
- **Descendant usage arrives in real time**: original `UsageEvent` records now reach ancestors as they happen, preserving source identity, stage, model, and provider, with no more delegation rollups → billing and usage monitoring can attribute spend to the node that actually made the call, instead of reading one blurry total
- **Dynamic context before each model call (`statusbar_middleware`)**: injects current state — progress, remaining steps, environment state — before every model call, with dependency-injection support; `persist=True` keeps those snapshots as service observations → no more cramming progress information into a prompt template
- **A shared task lifecycle**: model runs, delegations, and standalone `Task` blocks now go through the same lifecycle transitions; pass `capability` or `ttl_seconds` to `ask`, `run`, or `resume` to turn on lifecycle events (delegation enables them automatically); `ttl_seconds` is only an expiry deadline for an external observer, not a local execution timeout → monitoring systems can track different kinds of work through one consistent set of state transitions
- **Knowledge as a plugin (`KnowledgePlugin`)**: bundles the store, the knowledge tool, bootstrap, and event logging into one plugin, replacing the settings that used to live scattered across `Agent(knowledge=...)`

```diagram
title: Event observation and the model transcript are two separate pipes
desc: The chunk a Worker streams out is wrapped as a ChildEvent and handled right inside the observer callback — it never continues on to the model transcript. Only the tool result from a finished delegation reaches the model transcript, and the two paths never cross at the observer in the middle. The observer can also address a message straight back to the Worker with event.origin.send().
step: Worker streams a chunk, wrapped as ChildEvent, to the observer callback
step: Observer callback handles the event in place, logs progress
step: Worker finishes the delegation; the tool result goes straight to the model transcript
step: Observer addresses a message back to Worker with event.origin.send()
---
<svg viewBox="0 0 640 360">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="336"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="336"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="336"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H316" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="108" text-anchor="middle" dominant-baseline="central">ChildEvent</text>
  </g>
  <g data-step="2">
    <path class="dg-line" d="M324 160H352Q360 160 360 168V176Q360 184 352 184H328" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="372" y="172" dominant-baseline="central">log progress</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M96 232H540" marker-end="url(#arrow)"/>
    <text class="dg-edge" x="208" y="220" text-anchor="middle" dominant-baseline="central">tool result</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M316 296H100" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-mono" x="208" y="284" text-anchor="middle" dominant-baseline="central">origin.send()</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="96" rx="2" data-step="1 2"/>

  <rect class="dg-box" x="20" y="24" width="152" height="48" rx="6"/>
  <text class="dg-label" x="96" y="40" text-anchor="middle" dominant-baseline="central">Worker</text>
  <text class="dg-sub" x="96" y="59" text-anchor="middle" dominant-baseline="central">(child agent)</text>
  <rect class="dg-box dg-box--accent" x="224" y="24" width="192" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">observer callback</text>
  <rect class="dg-box" x="456" y="24" width="176" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">model transcript</text>
</svg>
```

## Breaking Changes

- `TaskConfig`, `Agent(tasks=...)`, `Agent.tasks`, and the automatically injected `run_subtask` / `run_subtasks` tools → construct workers explicitly and delegate through `Agent.as_tool()`:
  - Affected: projects that use the `tasks=` parameter to auto-generate subtask delegation need to rewrite before 1.4 removes it
- `Agent(assembly=...)` → register `AssemblerMiddleware` through `middleware=`, and add `HaltCheckMiddleware` alongside `AlertPolicy`:
  - Affected: projects that assemble multi-agent flows with the assembly parameter
- `Agent(knowledge=...)` → `plugins=[KnowledgePlugin(...)]`:
  - Affected: projects that pass knowledge settings directly in the `Agent` constructor
- `Agent.task()` → construct `Task(owner_id=..., spec=TaskSpec(...))` directly:
  - Affected: code that calls `Agent.task()` to create a standalone task
- `OpenAIConfig` becomes an alias for `OpenAIResponsesConfig` in 1.4; the official recommendation is to switch to `OpenAIResponsesConfig` or `OpenAICompletionsConfig` explicitly now:
  - Affected: projects still using the `OpenAIConfig` name will see its meaning shift once the alias lands in 1.4
- **Minimum Python version raised to 3.11**:
  - Affected: projects still on Python 3.10 must upgrade Python before installing AG2 1.3

## Migration Guide

### Upgrading from 1.2.2 to 1.3.0

```bash
pip install --upgrade ag2==1.3.0
```

```python
# Old: Agent(tasks=...) auto-injects run_subtask / run_subtasks
agent = Agent(
    "coordinator",
    config=config,
    tasks=[TaskConfig(worker_agent)],
)

# New: construct the worker explicitly, delegate through as_tool()
worker = Agent("worker", config=config, prompt="...")
coordinator = Agent(
    "coordinator",
    config=config,
    tools=[worker.as_tool(description="Delegate to the worker")],
)

# Old: Agent(knowledge=...)
agent = Agent("assistant", config=config, knowledge=KnowledgeConfig(...))

# New: plugins=[KnowledgePlugin(...)]
from ag2.knowledge import KnowledgePlugin, MemoryKnowledgeStore

agent = Agent(
    "assistant",
    config=config,
    plugins=[KnowledgePlugin(store=MemoryKnowledgeStore())],
)
```

Confirm the runtime is on Python 3.11 or newer before upgrading. Projects that don't touch `tasks=`, `assembly=`, `knowledge=`, or `Agent.task()` can upgrade as-is — the deprecation warnings don't change existing behavior.

## How it compares to other frameworks

Neither CrewAI's role-based delegation nor LangGraph's graph-level state has turned "how does a child's event surface" and "how does a variable cross delegation boundaries" into explicit first-class APIs — developers usually wire up their own callbacks or pass references around by hand. AG2 1.3 formalizes both: events travel through the observer channel without mixing into the parent's reasoning context, and state travels through declared `ScopedValue` scopes instead of relying on implicit copying. That gives AG2 a more complete story for observability inside a delegation tree than comparable frameworks, but it's still an in-process delegation model — next to cross-process, durable workflow engines like Temporal or Inngest, it's solving a different layer of the problem.

## Today's takeaway

I used to think "observability" in a multi-agent framework just meant bolting a callback onto the delegation point to print logs, then manually forwarding whatever mattered up the chain. Seeing AG2 explicitly define `ChildEvent` as something that never enters the parent's model transcript and never triggers the parent's tool loop made it click: observation and participating in the conversation have to be two separate pipes. If a child's progress update gets dropped into the parent's context as an ordinary message, the parent can easily mistake that progress notification for a new instruction it needs to respond to — sending the reasoning chain on an extra, unnecessary loop.

## References

- [AG2 v1.3.0 Release Notes](https://github.com/ag2ai/ag2/releases/tag/v1.3.0)
- [ag2ai/ag2 GitHub](https://github.com/ag2ai/ag2)
- [Full Changelog: v1.2.2...v1.3.0](https://github.com/ag2ai/ag2/compare/v1.2.2...v1.3.0)
- [AG2 Documentation: Observe a Delegation Tree](https://docs.ag2.ai/docs/user-guide/advanced/stream/#observe-a-delegation-tree)
- [AG2 Documentation: Variable Scopes Across Subagents](https://docs.ag2.ai/docs/user-guide/context/variables/#variable-scopes-across-subagents)
- [AG2 Documentation: Migrating from TaskConfig](https://docs.ag2.ai/docs/user-guide/subagents/#migrating-from-taskconfig)
