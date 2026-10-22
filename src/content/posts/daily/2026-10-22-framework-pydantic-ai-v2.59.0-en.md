---
title: "Framework Update: Pydantic AI v2.59.0"
date: 2026-10-22
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.59.0 patches a high-severity DoS in the web_fetch tool, ships DaytonaSandbox and ElevenLabsRealtimeModel, and unifies provider errors into shared categories"
tldr: "Three things in Pydantic AI v2.59.0: (1) a high-severity security fix (GHSA-4whf-38hw-pxxh) — the `web_fetch` tool could stall unrelated work in the same process when it fetched attacker-crafted HTML with many elements; (2) `DaytonaSandbox`, which runs the whole harness toolset (Coder, Shell, FileSystem) inside a Daytona sandbox; (3) provider-neutral model error categories like `ModelRateLimitError` and `ModelContextWindowExceededError`, so retry logic no longer has to special-case each provider."
series:
  name: "AI Framework Changelog"
  order: 48
---

> 🌏 [中文版](/posts/daily/2026-10-22-framework-pydantic-ai-v2.59.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.59.0 |
| Previous | v2.58.0 |
| Released | 2026-10-21 |
| Release Notes | [v2.59.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.59.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.8k |

## Why this version matters

The urgent part is a security fix: if the `web_fetch` tool ever pulls in a maliciously crafted HTML page with a large number of elements, the HTML-to-text conversion can stall other work running in the same process — a real DoS path for any system that lets an agent fetch arbitrary web pages on its own. Upgrading isn't optional. On the feature side, this release keeps building out the "harness engineering" direction from the last few versions: `DaytonaSandbox` moves Coder, Shell, and FileSystem capabilities into a cloud sandbox as a bundle, and `ElevenLabsRealtimeModel` adds another backend option for voice agents. The release also collapses scattered provider-specific error messages into a handful of shared categories, so retry logic finally doesn't need a separate branch per provider.

## Key changes

- **Fixed a high-severity DoS in `web_fetch` (GHSA-4whf-38hw-pxxh)**: HTML containing a large number of elements, if attacker-controlled, could stall other tasks in the same process during conversion → any system that lets an agent fetch untrusted pages on its own should upgrade immediately; the fix also landed in the `v1.107.9` branch
- **`DaytonaSandbox`**: a new workspace type that runs `Coder`, `Shell`, `FileSystem`, and other harness capabilities inside a Daytona sandbox → one more managed execution environment option, no server management required
- **`ElevenLabsRealtimeModel`**: a new backend for Eleven Realtime speech-to-speech models → another provider option for realtime voice agents
- **Provider-neutral model error categories**: added `ModelRateLimitError`, `ModelUnavailableError`, `ModelServerError`, `ModelContextWindowExceededError`, and `ModelHTTPError.for_category` → retry logic can now branch on "what happened on rate limit" once, instead of string-matching each provider's own error format
- **`<tool_result>` tags on `BackgroundTools` output**: background tool results are now framed as tagged tool output instead of untagged user text → lowers the risk of tool output being mistaken for a user instruction
- **Escaping in `SummarizingCompaction`**: compacted transcripts are now escaped so tool output can't forge messages → paired with `TrajectoryJudge`'s `ref`-bound `<judge_feedback>` tag, both close off ways a tool's returned content could impersonate a system or user message

## Breaking Changes

No breaking changes in this release, though a few items are behavior-adjacent opt-ins:

- `TemporalDurability` gained `non_retryable_model_errors`, letting you name which model error categories Temporal should not auto-retry
- `FunctionToolset.instructions` and instruction functions can now opt into `on_change='append'`; default behavior is unchanged, this is opt-in
- Affected: teams using Temporal durability or dynamic instruction prefixes should check whether these new options should be turned on

## Migration guide

No code changes are required to upgrade. If you run a self-built web-fetching agent, verify the `web_fetch` security fix takes effect after upgrading.

```bash
pip install --upgrade pydantic-ai==2.59.0
```

## Comparison with other frameworks

Agno's `v3.1.8`, released the same day, adds a persistent checkpoint store for its own sandboxes — a strong overlap with Pydantic AI's `DaytonaSandbox` here. Both frameworks are spending this month's effort on the same underlying problem: how to run an agent's code-execution environment safely.

## Takeaway

I used to think "unifying provider errors" was just renaming exception messages for readability. Seeing `non_retryable_model_errors` wire directly into Temporal's retry mechanism made it clear: a shared error taxonomy isn't just nicer to read — it turns retry policy into a single reusable setting, instead of a separate judgment call baked into every provider adapter.

## References

- [Pydantic AI v2.59.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.59.0)
- [GHSA-4whf-38hw-pxxh: web_fetch HTML conversion DoS advisory](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-4whf-38hw-pxxh)
- [pydantic/pydantic-ai on GitHub](https://github.com/pydantic/pydantic-ai)
