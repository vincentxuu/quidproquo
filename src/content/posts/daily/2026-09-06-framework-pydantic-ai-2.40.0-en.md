---
title: "Framework Update | Pydantic AI v2.40.0"
date: 2026-09-06
category: daily
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI 2.40 adds @agent.on_event listeners and native realtime voice barge-in handling, improving Agent observability and voice interaction UX"
tldr: "Pydantic AI v2.40.0 highlights: (1) @agent.on_event decorator gives Agents native event listening; (2) realtime voice sessions now handle barge-in natively; (3) RealtimeSession.enqueue() lets external code inject out-of-band prompts. No breaking changes."
series:
  name: "AI Framework Changelog"
  order: 16
---

## Version Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.40.0 |
| Previous | v2.39.0 |
| Released | 2026-09-05 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.40.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 19,742 |

## Why This Version Matters

Pydantic AI takes a significant step forward for voice Agent UX. Previously, handling user barge-in (interrupting the AI mid-speech) required manual plumbing — detecting the interruption, tracking played bytes, and signaling the model to stop. v2.40.0 bakes this into the session layer with a single `handle_barge_in=True` flag. Meanwhile, the new `@agent.on_event` decorator gives Agents native event listening for cross-cutting concerns like billing, observability, and live UI updates without monkey-patching internals.

## Key Changes

- **`@agent.on_event` event listener decorator**: Register event callbacks directly on an Agent covering tool calls, token streaming, and completion events → billing and observability logic hooks directly onto the Agent without intercepting internal mechanisms
- **Realtime voice barge-in handling**: `handle_barge_in=True` + `interrupt(played_bytes=...)` + `played_audio_bytes` property → automatic interruption handling when users speak over the AI, with played-progress tracking built in
- **`RealtimeSession.enqueue()`**: Lets external code driving the session inject out-of-band prompts → enables backend-initiated messages during voice conversations (e.g., a support system pushing a promo code hint)
- **`respond=` parameter**: `RealtimeSession.send(respond=True/False)` controls whether a text message solicits a model reply → precise control over multi-turn voice conversation pacing
- **`provider_factory` for `infer_realtime_model`**: Custom provider factory function → more flexible realtime model initialization
- **`prices.update_in_background()`**: Background model pricing data refresh → long-running Agents track latest pricing without restarts

## Breaking Changes

No breaking changes in this version.

## Migration Guide

Direct upgrade, no code changes required.

```bash
pip install --upgrade pydantic-ai==2.40.0
```

Example using the new event listener:

```python
from pydantic_ai import Agent

agent = Agent("openai:gpt-4o")

@agent.on_event
async def log_events(event):
    print(f"Agent event: {event.type}")

result = await agent.run("Hello")
```

## Cross-Framework Observations

Pydantic AI continues to widen its lead in realtime voice capabilities. Among the 12 Agent frameworks we track, only Pydantic AI offers framework-level native barge-in and audio stream control — other frameworks (LangGraph, CrewAI, Mastra) still require manual WebSocket and audio processing for voice Agents. The `@agent.on_event` pattern brings the callback mechanism long available in the LangChain ecosystem into a more Pythonic form.

## Takeaway

I previously assumed voice Agent barge-in handling was simply "detect user speech and stop." Seeing Pydantic AI's implementation reveals the need to track played byte counts — the model needs to know where the user interrupted to maintain conversation coherence. This is an audio-streaming-specific state management problem with no text-chat equivalent.

## References

- [Pydantic AI v2.40.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.40.0)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #7870: Handle barge-in in the session](https://github.com/pydantic/pydantic-ai/pull/7870)
- [PR #8101: Add @agent.on_event](https://github.com/pydantic/pydantic-ai/pull/8101)
- [PR #8109: Add RealtimeSession.enqueue()](https://github.com/pydantic/pydantic-ai/pull/8109)
