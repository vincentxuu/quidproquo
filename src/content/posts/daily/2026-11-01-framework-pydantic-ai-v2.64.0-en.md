---
title: "Framework Update: Pydantic AI v2.64.0"
date: 2026-11-01
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.64.0 adds a ModelFallback capability that can stick to whichever fallback model just answered, a BoxdSandbox that bundles a whole set of harness capabilities into one sandboxed machine, and an ArtifactScanner that screens Memory and Skills artifacts for safety"
tldr: "Four things in Pydantic AI v2.64.0: (1) Breaking: a retrying transport that gives up now raises `ModelHTTPError` so fallback can take over, `Coder`'s tools turn off strict schemas by default, and `json-repair` becomes an optional dependency; (2) a new `ModelFallback` capability with a `sticky` option that stays on whichever fallback model just answered, plus a `prepare_model_request` hook and `RetryModelRequest`; (3) a new `BoxdSandbox` that bundles `Coder`, `Shell`, `FileSystem` and other harness capabilities into one boxd sandbox machine; (4) a new `ArtifactScanner` that screens `Memory` and `Skills` artifacts for safety."
series:
  name: "AI Framework Changelog"
  order: 59
---

> 🌏 [中文版](/posts/daily/2026-11-01-framework-pydantic-ai-v2.64.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.64.0 |
| Previous version | v2.63.0 |
| Release date | 2026-10-30 |
| Release Notes | [v2.64.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.64.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## Why this version matters

This release turns "what happens when the model goes down" from a try/except problem into a proper capability. Before this, handling a failed model call usually meant wrapping your own retry-and-switch logic around the agent, with no shared state management. `ModelFallback` brings that into the framework itself: on failure it switches models, and with `sticky` it can keep the conversation on whichever fallback model just answered, instead of re-failing against the primary model on every single request before switching over again. The same release also closes another gap that shows up in long-running agents — `Memory` and `Skills` are artifacts the agent writes and later reads back on its own, and until now there was no shared mechanism for screening them. The new `ArtifactScanner` fills that gap. `BoxdSandbox` goes a different direction: it bundles `Coder`, `Shell`, and `FileSystem` — capabilities that used to be managed separately — into a single boxd machine, giving the execution environment a much clearer boundary.

## Key Changes

- **ModelFallback capability**: a formal model-fallback mechanism with a `prepare_model_request` hook and `RetryModelRequest`, constructible directly from an agent spec → fallback logic no longer needs to be hand-rolled outside the agent; when and how to switch models can be declared instead
- **sticky keeps the conversation on the fallback that answered**: `ModelFallback` adds a `sticky` option that keeps the conversation on whichever fallback model just responded successfully → avoids re-failing against the primary model on every request before switching back, cutting repeated failure latency
- **BoxdSandbox bundles the sandbox**: a new `BoxdSandbox` runs `Coder`, `Shell`, `FileSystem` and other harness capabilities inside the same boxd machine → what used to be separately managed execution environments now collapse into one sandbox with a clear boundary, lowering the risk of capabilities contaminating each other
- **ArtifactScanner for security scanning**: `Memory` and `Skills` get a new `ArtifactScanner` that screens artifacts the agent writes and later reads back → the memory and skill files a long-running agent accumulates get an extra safety check instead of being trusted just because the agent wrote them itself
- **RunContext.load_capability for on-demand loading**: a new `RunContext.load_capability` lets code load a capability at runtime as needed → agents no longer need every possibly-used capability attached up front, lowering initialization cost
- **first_event_timeout protects against a stalled stream**: a new model setting, `first_event_timeout`, lets a stream that never actually starts trigger fallback → a stuck stream no longer hangs indefinitely; it fails fast and switches models instead
- **DetectLoops results paired with the triggering response**: `DetectLoops` tool results are now paired with the specific response that made the call → debugging a repeated-action loop can now be traced back to exactly which turn caused it

## Breaking Changes

- When a retrying transport gives up, the error status it raises is now `ModelHTTPError`, letting the fallback mechanism take over:
  - Impact: code that assumed the exhausted-retry error was some other transport-layer exception needs to catch `ModelHTTPError` instead
- `Coder`'s tools turn off strict tool schemas by default, opt back in with `Coder(strict=True)`:
  - Impact: scenarios that relied on strict schema validation (e.g. assuming tool arguments always match a fixed structure) will see looser behavior after upgrading, and need to explicitly pass `strict=True` to keep the old behavior
- `json-repair` moves from a required dependency to an optional one, needed only by `Coder` and `RepairToolArguments`:
  - Impact: environments that use related functionality without separately installing `json-repair` will now hit a missing-dependency error at the point of use, instead of having it installed up front

## Migration Guide

### Upgrading from 2.63.0 to 2.64.0

```bash
pip install --upgrade pydantic-ai==2.64.0
```

```python
# To keep Coder's old strict tool-schema behavior
coder = Coder(strict=True)

# If your code uses Coder's json-repair-related features, install the optional dependency
# pip install "pydantic-ai[json-repair]"

# Declare fallback models with ModelFallback, and stick to whichever one answered
fallback = ModelFallback(models=[primary_model, backup_model], sticky=True)
```

Everything else is additive — existing code keeps working without any changes.

## Comparison with other frameworks

The day before (2026-10-29), Agno's v3.1.12 wired `ClaudeAgent`/`CodexAgent`'s own permission requests into AgentOS's existing Approval UI, letting a run pause into a persistable `PAUSED` state while waiting for a human to approve it. Pydantic AI is closing a similar gap in this release — risk control for long-running agents — but from a different angle: `ArtifactScanner` screens content the agent writes into `Memory`/`Skills` on its own, while `ModelFallback` handles what happens when the model itself fails. One is "a human approves the action," the other is "automatically scan the data and fail over the model." Looked at together, both frameworks are reinforcing the same direction — letting agents run longer and more safely on their own — just from different risk surfaces.

## Today's Takeaway

I used to assume model fallback meant "switch on failure, keep using the primary model once it recovers." Seeing the `sticky` option made me realize that assumption has a cost: if every request re-fails against the primary model before switching to fallback, every single turn of the conversation pays the "confirm the primary model is still down" latency and retry cost all over again. `sticky` flips that around — since the previous turn already confirmed the fallback model works, it just stays there instead of re-verifying the primary model's health on every turn.

## References

- [Pydantic AI v2.64.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.64.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.63.0...v2.64.0](https://github.com/pydantic/pydantic-ai/compare/v2.63.0...v2.64.0)
- [Agno v3.1.12 Release Notes](https://github.com/agno-agi/agno/releases/tag/v3.1.12)
