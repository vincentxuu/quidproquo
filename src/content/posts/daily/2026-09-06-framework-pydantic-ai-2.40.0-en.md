---
title: "Framework Update | Pydantic AI 2.40.0"
date: 2026-09-06
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI 2.40.0 rounds out RealtimeSession with barge-in handling, enqueue, and respond primitives, and adds `@agent.on_event` to scope the 2.38.0 event-subscription mechanism to a single Agent instance"
tldr: "Pydantic AI 2.40.0 highlights: (1) `RealtimeSession` gains `handle_barge_in=True`, `interrupt(played_bytes=...)`, and `played_audio_bytes`, letting voice agents correctly handle the hardest part of voice UX — the user interrupting the AI mid-speech — plus two session control primitives, `enqueue()` (out-of-band message injection) and `respond=` (whether a text turn triggers a reply); (2) new `@agent.on_event` scopes the global `@on_event` subscription mechanism from 2.38.0 down to a single `Agent` instance, so code running multiple agents no longer has to figure out which agent an event came from. No breaking changes in this release."
series:
  name: "AI Framework Changelog"
  order: 16
---

> 🌏 [中文版](/posts/daily/2026-09-06-framework-pydantic-ai-2.40.0)

## Version Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.40.0 |
| Previous | v2.39.0 |
| Release Date | 2026-09-04 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.40.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 19.7k |

## Why This Release Matters

Pydantic AI's last few releases have been steadily filling gaps on the road to becoming a real voice-agent framework, and this one tackles the hardest gap: what happens when the user interrupts the AI mid-speech. Text chat doesn't have this problem — messages arrive turn by turn — but in a voice conversation the user can start talking at any moment while the AI is still speaking, and every voice agent has had to figure out, ad hoc, whether to stop the audio that's playing, whether the already-spoken portion counts toward conversation history, and whether the interrupted utterance needs to be regenerated. 2.40.0 turns this into an officially supported `handle_barge_in=True` switch, paired with `interrupt(played_bytes=...)` to precisely mark how much audio had actually played before the interruption — the framework then aligns conversation history to that exact point on its own. The same release also gives `RealtimeSession` `enqueue()` (external code can push messages mid-session without waiting for the current turn to end) and `respond=` (whether a text turn triggers a model reply). Together, these three finally give `RealtimeSession` full control over "who should be speaking, and when" instead of passively waiting on the model to decide.

## Key Changes

- **`handle_barge_in=True` and `interrupt(played_bytes=...)`**: `RealtimeSession` natively handles the user interrupting the AI mid-speech, with `played_audio_bytes` recording how much audio actually played before the interruption → voice agents no longer need ad hoc logic to figure out where conversation history should be truncated; the framework aligns it to actual playback
- **`RealtimeSession.enqueue()`**: lets code driving the session push messages out of band, without waiting for the current turn to finish naturally → useful for voice agents that need to inject a system prompt or status update mid-turn
- **`respond=` added to `RealtimeSession.send()`**: explicitly controls whether a text turn triggers a model reply, and documents the behavior → avoids the hidden failure mode of sending a message and accidentally triggering an unwanted reply
- **`@agent.on_event`**: scopes the global `@on_event` subscription introduced in 2.38.0 down to a single `Agent` instance → code running multiple agents in the same process no longer needs to figure out which agent an event came from
- **`provider_factory` added to `infer_realtime_model`**: lets you customize how the underlying provider for a realtime model is constructed, instead of being limited to the framework's built-in default provider logic
- **`pydantic_ai.prices.update_in_background()`**: keeps the model pricing table updated automatically in the background, instead of only getting fresh pricing data on package upgrades

## Breaking Changes

No breaking changes in this release.

Upgrade directly — no code changes required.

## Migration Guide

```bash
pip install --upgrade pydantic-ai==2.40.0
```

To let a voice agent correctly handle user interruptions:

```python
from pydantic_ai.realtime import RealtimeSession

session = RealtimeSession(model, handle_barge_in=True)

async def on_user_interrupt(played_audio_bytes: int):
    await session.interrupt(played_bytes=played_audio_bytes)
```

To scope event subscription to a single Agent instance instead of a global subscription:

```python
from pydantic_ai import Agent

agent = Agent("anthropic:claude-fable-5-1")

@agent.on_event(CustomEvent)
async def handle_progress(event, ctx):
    print(f"[{agent.name}] progress: {event.data}")
```

## Cross-Framework Observations

Barge-in handling for voice agents is still, for most frameworks (LangGraph and CrewAI included), a "developer wires up their own WebRTC/voice streaming service, the framework stays out of it" situation. Pydantic AI folding barge-in into a native framework API means the correctness of voice interaction itself is now part of the framework's own responsibility, rather than something pushed entirely onto the application layer — an extension of the same design philosophy behind its earlier moves to bring type safety and durable execution into the framework core.

## Takeaway

I initially assumed "interrupting" a voice agent just meant "stop playing the audio." Looking at the `interrupt(played_bytes=...)` API made clear that the real difficulty is what happens to conversation history afterward — whether an AI utterance cut off mid-sentence counts as "something the AI said" directly affects whether the next turn's context is accurate. A framework willing to fold that level of detail into its native API is a sign of a design that only comes from having hit this problem in production, repeatedly.

## References

- [Pydantic AI v2.40.0 — GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.40.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [PR #7870 — Handle barge-in in the session: handle_barge_in=True, interrupt(played_bytes=...), and played_audio_bytes](https://github.com/pydantic/pydantic-ai/pull/7870)
- [PR #8109 — Add RealtimeSession.enqueue() for out-of-band prompts](https://github.com/pydantic/pydantic-ai/pull/8109)
- [PR #8110 — Add respond= to RealtimeSession.send()](https://github.com/pydantic/pydantic-ai/pull/8110)
- [PR #8101 — Add @agent.on_event for registering event listeners on an Agent](https://github.com/pydantic/pydantic-ai/pull/8101)
- [PR #8106 — Add provider_factory to infer_realtime_model](https://github.com/pydantic/pydantic-ai/pull/8106)
- [PR #4841 — Add pydantic_ai.prices.update_in_background()](https://github.com/pydantic/pydantic-ai/pull/4841)
- [Framework Update | Pydantic AI 2.38.0 (previously tracked: CustomEvent/CapabilityEvent)](/en/posts/daily/2026-09-04-framework-pydantic-ai-2.38.0-en)
