---
title: "Framework Update: Pydantic AI v2.61.0"
date: 2026-10-25
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.61.0 turns citations into a structured format that can be replayed across providers, and opens up the durable execution engine's internals so third parties can plug in their own backend"
tldr: "Three things in Pydantic AI v2.61.0: (1) structured citations — `TextPart` can now carry citations, normalized across Bedrock, OpenRouter, and xAI, and replayed back to whichever provider originally produced them across turns; (2) the durable execution engine's extension surface is now public (operation types, `ParameterTransports`, `DurableRunContext`, run identity hooks), so third parties can wire in their own durable backend; (3) several compatibility notes: `thinking=False` now sends the least thinking a model will accept instead of silently misbehaving, and `CohereModel` raises instead of silently dropping a file returned by a tool."
series:
  name: "AI Framework Changelog"
  order: 53
---

> 🌏 [中文版](/posts/daily/2026-10-25-framework-pydantic-ai-v2.61.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.61.0 |
| Previous | v2.60.0 |
| Released | 2026-10-23 |
| Release Notes | [v2.61.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.61.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.8k |

## Why this version matters

This release turns citations from decorative text in the output into structured data that actually flows through the system: `TextPart` can now carry citations, which get normalized into a consistent shape across providers and then replayed, unchanged, back to whichever provider originally produced them. For any RAG or search-backed agent that needs to keep track of "which source backed this sentence" across turns, that's a format-compatibility problem being solved, not a UI problem. The other headline change is opening up the durable execution engine's internals: operation types, `ParameterTransports`, `DurableRunContext`, and run identity hooks are all public API now — an acknowledgment that people want to wire in their own durable backend, instead of being limited to whatever the framework ships out of the box.

## Key changes

- **Structured citations**: `TextPart` now supports citations, with citations from Bedrock, OpenRouter, and xAI normalized into a shared shape; across turns, citations are replayed back to the provider that originally produced them, and the Vercel AI adapter keeps citations too → building a RAG or search agent no longer means hand-rolling your own citation format conversion
- **Durable engine extension surface made public**: operation types, `ParameterTransports`, `DurableRunContext`, and run identity hooks are all now public API → third parties can plug in their own durable execution backend instead of depending on whichever ones the framework currently supports
- **New model names**: added `kimi-k3.1-pro` and `kimi-k3.1-pro-highspeed`
- **Azure realtime improvements**: `RealtimeClientSecret.webrtc_url` now carries `webrtcfilter=on` on Azure OpenAI; the new `RealtimeModelProfile.supports_audio_output` makes text-only realtime models — like Gemini's robotics streaming models — default back to text output instead of being mistaken for voice-output models
- **Async auth for hosted MCP**: the `auth` function for hosted MCP capabilities can now be async

## Breaking Changes

No API-level breaking changes, but several behavior adjustments (compatibility notes):

- `thinking=False` now sends whichever minimal thinking level a model will accept, instead of trying to fully disable it — relevant for models that can't turn thinking off at all
- A warning is now raised when a broader-scope, provider-specific thinking setting overrides the `thinking` parameter
- `CohereModel` now raises `NotImplementedError` when a tool return contains a file, instead of silently dropping it
- `GoogleRealtimeModel.google_multi_speaker` is now deprecated — no current Gemini Live model supports it
- Affected: projects using `CohereModel` with tools that return files need to add error handling after upgrading; projects relying on provider-specific thinking overrides see no behavior change, but will now get a new warning

## Migration guide

```bash
pip install --upgrade pydantic-ai==2.61.0
```

No major code changes required. If a tool has ever returned a file to `CohereModel` and you never handled the case where it got silently dropped, add error handling after upgrading.

## Comparison with other frameworks

This week several frameworks are converging on the same theme — observability and extensibility. Pydantic AI opened up its durable engine's internals for third parties to plug into; crewAI's 1.15.29 (2026-10-23) promoted `AgentExecutor` out of experimental status and added trace export plus an offline evaluation runner. Different mechanics, same direction: frameworks are no longer just responsible for making an agent run — they also need to let you see and take over what happens during the run.

## Takeaway

I used to think citations were just extra metadata tacked onto the output text. Seeing Pydantic AI turn them into structured data — normalized, and replayable back to the provider that produced them — made it clear what's actually hard about citations across multi-turn conversations: it isn't displaying them, it's making sure that when the next turn sends them back to the provider, the provider still recognizes them as its own. That's a format-compatibility problem, not a UI one.

## References

- [Pydantic AI v2.61.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.61.0)
- [pydantic/pydantic-ai on GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.60.0...v2.61.0](https://github.com/pydantic/pydantic-ai/compare/v2.60.0...v2.61.0)
