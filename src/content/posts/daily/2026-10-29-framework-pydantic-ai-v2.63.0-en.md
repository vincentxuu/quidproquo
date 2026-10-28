---
title: "Framework Update: Pydantic AI v2.63.0"
date: 2026-10-29
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.63.0 changes CodeMode's tool disclosure from rewriting the cached prompt to appending to it, adds DetectLoops to catch repeated-action loops, and lets harness SpendLimits budgets share state across workers via PostgreSQL"
tldr: "Three things in Pydantic AI v2.63.0: (1) Breaking: `CodeMode` now defaults to `dynamic_catalog=True`, so a disclosed tool gets appended instead of rewriting the cached prompt, and `GoogleRealtimeConnection.dial`'s `replay` argument is now keyword-only; (2) a new `DetectLoops` capability catches and interrupts repeated-action loops, and `IPythonCodeMode` arrives as an alternative to the Monty-based CodeMode; (3) a new `PostgresSpendStore` lets harness `SpendLimits` budgets be shared across workers through PostgreSQL instead of each worker tracking its own allowance."
series:
  name: "AI Framework Changelog"
  order: 55
---

> 🌏 [中文版](/posts/daily/2026-10-29-framework-pydantic-ai-v2.63.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.63.0 |
| Previous | v2.62.0 |
| Released | 2026-10-27 |
| Release Notes | [v2.63.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## Why this version matters

The theme here is the cost of letting a long-running agent get out of control: calling the same tool over and over, a callback that hangs, or multiple workers each tracking their own budget. None of these break anything on their own, but run an agent for dozens of turns across dozens of workers and they quietly burn tokens and money. `DetectLoops` catches an agent repeating the same action and interrupts it directly; `PostgresSpendStore` turns `SpendLimits`, previously tracked independently per worker, into a single shared allowance stored in PostgreSQL; `task_timeout` keeps a single stuck task in `Dataset.evaluate` from dragging down an entire evaluation batch. At the same time, the maintainers flag a behavior change in the compatibility notes: `CodeMode`'s tool-disclosure behavior changed. Disclosing a new tool used to rewrite the entire cached prompt; now it appends instead — which directly affects prompt-cache hit rates for any agent that relies heavily on CodeMode's dynamic tool disclosure.

## Key changes

- **DetectLoops catches repeated-action loops**: the new `DetectLoops` capability interrupts an agent when it keeps repeating the same action → no need to roll your own loop-detection logic; a long task stuck in a tool-call loop can be cut off early
- **IPythonCodeMode as a new execution environment**: `IPythonCodeMode` arrives alongside the existing Monty-based `CodeMode` → scenarios that need IPython-ecosystem compatibility (e.g. existing notebook toolchains) get an alternative execution environment without being locked to Monty
- **PostgresSpendStore shares budgets**: the new `PostgresSpendStore` lets harness `SpendLimits` be shared through PostgreSQL → multiple workers running against the same budget cap no longer each maintain an independent allowance, avoiding overspend from workers stacking on top of each other
- **task_timeout bounds a single evaluation task**: `Dataset.evaluate` gets a `task_timeout` that sets a limit per task attempt → a single stuck task in an evaluation batch no longer holds up the whole batch's results
- **manage_message_history avoids duplicate history**: UI adapters get a new `manage_message_history` so server-held history isn't sent to the model twice → one less easy-to-miss source of wasted tokens when wiring up a custom UI layer
- **Public framing module**: a new public `pydantic_ai.framing` module (`wrap`, `neutralize_tags`, `register_tag`) → extensions can frame their own tags with official tooling instead of reinventing escaping logic each time
- **ag-ui-protocol 1.0 support**: official support for ag-ui-protocol 1.0 → no need to stay on an older spec when wiring up a front-end agent UI protocol

## Breaking Changes

- `CodeMode` now defaults to `dynamic_catalog=True`: disclosing a new tool appends to the prompt instead of rewriting the entire cached prompt
  - Affected: code that relies heavily on CodeMode's dynamic tool disclosure and depends on the old "every disclosure rewrites the prompt" behavior or cache keys will see a different prompt-cache hit pattern
- `GoogleRealtimeConnection.dial`'s `replay` argument is now keyword-only
  - Affected: code that calls `dial(..., replay_value)` positionally will error out directly
- Harness `LLMReminder` now defaults to `interval=10` instead of generating a reminder on every request
  - Affected: custom logic that assumes every request gets a reminder will behave differently
- Signed or encrypted history data is now replayed to providers with the same `canonical_system`
  - Affected: custom provider wrappers that assume `canonical_system` differs on every request should be re-checked

## Migration guide

### Upgrading from 2.62.0 to 2.63.0

```bash
pip install --upgrade pydantic-ai==2.63.0
```

```python
# To keep CodeMode's old "rewrite the cached prompt" behavior
code_mode = CodeMode(dynamic_catalog=False)

# If you call GoogleRealtimeConnection.dial with a positional replay argument
# Old
await connection.dial(config, replay_value)
# New (keyword-only)
await connection.dial(config, replay=replay_value)
```

Everything else is additive — existing code keeps working without changes if you don't opt into the new capabilities.

## Comparison with other frameworks

On the same day (2026-10-27), Agno's v3.1.11 let `ClaudeAgent`/`CodexAgent` — external coding agents — join a Team or Workflow directly as members, taking the "absorb an entire external agent into multi-agent orchestration" route. Pydantic AI's release instead evolves the execution layer itself: `IPythonCodeMode` arrives as an alternative to Monty-based CodeMode, while `DetectLoops`, `task_timeout`, and `PostgresSpendStore` shore up resource control during long runs. Both frameworks are converging on the same goal — letting agents run longer and more safely on their own — just from different layers: one integrates external agents at the orchestration layer, the other manages resource consumption at the execution layer.

## Takeaway

I used to think of `SpendLimits` as something each worker just computed on its own. Seeing it moved into a shared database with `PostgresSpendStore` made it clear that once an agent system scales to multiple workers running in parallel, budget control stops being a single-machine logic problem and becomes a distributed-consistency problem — without shared storage, every worker's view of "how much budget is left" is stale by definition, and stacked overspend is only a matter of time.

## References

- [Pydantic AI v2.63.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.63.0)
- [pydantic/pydantic-ai on GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.62.0...v2.63.0](https://github.com/pydantic/pydantic-ai/compare/v2.62.0...v2.63.0)
- [Agno v3.1.11 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.11)
