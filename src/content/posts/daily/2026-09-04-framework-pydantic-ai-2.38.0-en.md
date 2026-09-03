---
title: "Framework Update | Pydantic AI 2.38.0"
date: 2026-09-04
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI 2.38.0 lets application code and capabilities subscribe to the Agent run event stream via typed CustomEvent/CapabilityEvent, and adds context_window introspection plus support for gemini-3.8-flash, Claude Fable 5.1, and more"
tldr: "Pydantic AI 2.38.0 highlights: (1) new typed `CustomEvent`/`CapabilityEvent` — application code and capabilities can now emit custom events into the Agent's run event stream and subscribe with `@on_event`, filling in a general-purpose observability and extension layer; (2) `RunContext` gains `context_window_used` and `ModelProfile` gains `context_window`, so agent code can read how much of the model's context window remains, for the first time; (3) new model support for `gemini-3.8-flash`, Claude Fable 5.1, and Claude Mythos 5.1, plus a new `VLLMProvider`. No breaking changes in this release."
series:
  name: "AI Framework Changelog"
  order: 13
---

> 🌏 [中文版](/posts/daily/2026-09-04-framework-pydantic-ai-2.38.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.38.0 |
| Previous | v2.37.0 |
| Release Date | 2026-09-03 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.38.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 19.7k |

## Why This Release Matters

The previous release (2.36.0) collapsed "which code needs to be replay-safe" into the declarative `@durable_operation` interface. This release fills in the other half: **how execution talks back out**. Previously, observing or extending an Agent run meant relying on the framework's fixed built-in event types (tool calls, model response chunks) — there was no proper channel for application code to signal something like "this capability just hit checkpoint X" or "this tool call needs user confirmation." 2.38.0 opens up two typed event kinds, `CustomEvent` and `CapabilityEvent`: application code and capabilities can push data directly into the run's event stream, and a new `@on_event` decorator subscribes to it — turning Agent observability and extensibility from "the framework decides what you can see" into "you decide what to expose." The same release also lets an Agent read, mid-run, how much of the bound model's context window remains — a new decision input for long-running agents that need to trigger compaction or truncation proactively.

## Key Changes

- **Typed `CustomEvent` and `CapabilityEvent` (`@on_event`)**: application code and capabilities can push custom events into the Agent's run event stream, subscribed to via the new `@on_event` decorator → no more routing custom mid-run signals through tool calls or side channels; events are typed, so subscribers get structured data instead of information packed into strings
- **`ModelProfile.context_window` and `RunContext.context_window_used`**: agent code can query the bound model's total context window size and how much of it the current call has actually used → useful for proactively triggering message compaction, truncating history, or switching to a longer-window model before running out of room, without maintaining your own token-counting logic
- **New model support: `gemini-3.8-flash`, Claude Fable 5.1 (`claude-fable-5-1`), Claude Mythos 5.1 (`claude-mythos-5-1`)**: keeps pace with the latest releases from major model providers — usable directly by id through `GoogleModel`/`AnthropicModel`
- **New `VLLMProvider`**: a dedicated provider for self-hosted vLLM inference servers, removing the need to hand-assemble an OpenAI-compatible shim
- **Stream rejection flag (reject streams without `finish_reason`)**: a new model profile switch treats a streamed response missing `finish_reason` as an error instead of silently treating it as a normal completion → avoids downstream code mistaking a dropped connection for the model finishing normally

## Breaking Changes

No breaking changes in this release. The one compatibility adjustment (listed under Compatibility Notes in the release, not Breaking Changes): unnamed one-off capabilities now get a default `id`, and repeated registrations follow a unified combine rule — this only affects capability code that never specified an explicit `id`, and the team judged it does not qualify as breaking.

Upgrade directly — no code changes required.

## Migration Guide

```bash
pip install --upgrade pydantic-ai==2.38.0
```

To use the new custom event mechanism, emit events from a capability or application code, and subscribe with `@on_event`:

```python
from pydantic_ai import Agent
from pydantic_ai.events import CustomEvent, on_event

agent = Agent("anthropic:claude-fable-5-1")

@on_event(CustomEvent)
async def handle_progress(event: CustomEvent, ctx):
    print(f"progress: {event.data}")

# emit a custom event from inside a capability or tool
async def my_capability(ctx):
    ctx.emit(CustomEvent(data={"stage": "fetching"}))
```

To check context window usage mid-run:

```python
async def my_tool(ctx: RunContext) -> str:
    profile = ctx.model.profile
    used = ctx.context_window_used
    if profile.context_window and used / profile.context_window > 0.8:
        # proactively compact or truncate history
        ...
```

## Cross-Framework Observations

`CustomEvent`/`CapabilityEvent` continues the direction opened by 2.36.0's `@durable_operation`: swapping "the framework decides everything for you" for "the framework hands you typed building blocks, and you assemble them." Read together within Pydantic AI's own trajectory, these two releases extend the capabilities system from fault-tolerant execution to observability and extensibility — both handled with the same declarative style, rather than each growing its own bespoke mechanism.

## Takeaway

My first read was that "adding a custom event system" is just another debug hook bolted onto the Agent. Looking at it next to 2.36.0's `@durable_operation`, though, it's clearer that Pydantic AI has spent the last two releases systematically collapsing the various side effects that happen during Agent execution — fault-tolerant replay, event notification — into the same shape of declarative extension point, instead of adding a new bespoke callback parameter every time a new need shows up. A framework's extensibility design is sometimes worth tracking more closely than any single feature in it.

## References

- [Pydantic AI v2.38.0 — GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.38.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #6258 — Let application code and capabilities emit typed CustomEvents and CapabilityEvents](https://github.com/pydantic/pydantic-ai/pull/6258)
- [PR #4611 — Add context_window to ModelProfile and context_window_used to RunContext](https://github.com/pydantic/pydantic-ai/pull/4611)
- [PR #8021 — Add gemini-3.8-flash model](https://github.com/pydantic/pydantic-ai/pull/8021)
- [PR #7989 — Add Claude Fable 5.1 and Claude Mythos 5.1 support](https://github.com/pydantic/pydantic-ai/pull/7989)
- [PR #6153 — Add VLLMProvider for vLLM servers](https://github.com/pydantic/pydantic-ai/pull/6153)
- [Framework Update | Pydantic AI 2.36.0 (previously tracked: @durable_operation)](/en/posts/daily/2026-08-30-framework-pydantic-ai-2.36.0-en)
