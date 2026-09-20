---
title: "Framework Update: Pydantic AI v2.46.0"
date: 2026-09-21
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI 2.46 extends TypeSafeModel, its just-shipped non-generative classifier model, to fill tool call arguments, pick union output types, and act as an LLMJudge/GEval judge"
tldr: "Three things worth knowing about Pydantic AI v2.46.0: (1) the previous release (2.45.0) introduced TypeSafeModel — a provider for TypeSafe's Jev, a classifier that answers typed questions instead of writing text — and this release fills in what it couldn't do yet: filling tool call arguments and picking a type before filling a union output; (2) a new `typesafe_boolean_threshold` turns the yes/no decision boundary from a fixed distance-from-0.5 into a tunable parameter; (3) `supports_text_output` lets `LLMJudge` and `GEval` run on models that don't produce text at all, so Jev can now serve as the judge model in evals. No breaking changes."
series:
  name: "AI Framework Changelog"
  order: 25
---

> 🌏 [中文版](/posts/daily/2026-09-21-framework-pydantic-ai-2.46.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.46.0 |
| Previous version | v2.45.0 |
| Release date | 2026-09-19 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.46.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20k |

## Why this release matters

The previous release (2.45.0, 2026-09-17) merged `TypeSafeModel`, a provider that connects to TypeSafe's Jev classifier. Jev isn't a language model — it doesn't write text. You give it a passage and a set of typed questions (each field of a Pydantic model becomes one question), and it answers every field directly with a confidence score. Because it skips sequential token generation, an AlphaSignal ticket-triage benchmark measured a 227ms median latency for Jev against 1,415ms for gpt-5.6-luna — roughly 6x faster. But 2.45.0's limits were just as clear: `str` outputs, native file inputs, and tool calls that require generated arguments were all unsupported, raising a `UserError` on contact. 2.46.0 closes exactly two of those gaps — filling tool arguments and handling union output types — while also making Jev's confidence threshold tunable and, notably, usable as an eval judge. For teams already routing decisions through TypeSafeModel, this isn't a standalone feature drop; it's the previous release's gaps getting filled in, one version later.

## Key changes

- **TypeSafeModel fills tool arguments (when Jev can express them)**: Jev previously only filled `output_type` fields. Starting in 2.46.0, when a tool's argument schema falls within Jev's supported question types (`bool`, `Literal`, `Enum`, a `float` bounded to `[0, 1]`, and similar), tool-call arguments can be filled by Jev too, without switching to a text-generating model mid-run
- **TypeSafeModel fills a union output type by picking the type first**: when `output_type` is a union, Jev first answers "which type applies," then fills that type's fields — union types were previously out of scope for Jev
- **`typesafe_boolean_threshold`**: yes/no decisions used to be based on a fixed distance from 0.5; this release makes that threshold configurable, useful when the cost of false positives and false negatives is asymmetric — you can tighten or loosen the decision line directly instead of wrapping a post-processing layer around the agent
- **`supports_text_output` on `ModelProfile` lets `LLMJudge`/`GEval` run on models with no text output**: Pydantic AI's built-in eval tools, `LLMJudge` and `GEval`, previously assumed the judge model could write out its reasoning as text. This release lets them recognize a model that can't, so Jev — a pure classifier — can now serve as the judge, scoring agent outputs with a much faster classifier instead of a generative one
- **`Choices` helper**: builds a set of described options at runtime, for dynamically generated classification/selection fields
- **Enum options described via member docstrings (`UseEnumMemberDocstrings`)**: each enum option can carry its own docstring as its description, which matters for classifiers like Jev that need a clear question description per field
- **`RealtimeSession.wait_for_playback()`**: real-time voice sessions get a method to wait for playback to finish; the official docs examples were updated to wait for the reply to finish before closing
- **`TemporalDurability` adds `event_stream_topic`**: streams agent events out through Temporal's Workflow Streams, contributed by the community — one of the few changes in this release unrelated to TypeSafeModel

## Breaking Changes

No breaking changes in this release.

## Migration Guide

Upgrade directly, no code changes required:

```bash
pip install --upgrade pydantic-ai==2.46.0
```

Code changes are only needed if you want to use the newly filled-in capabilities — for example, letting Jev fill tool arguments:

```python
from pydantic_ai import Agent
from pydantic_ai.models.typesafe import TypeSafeModel

model = TypeSafeModel('jev-latest')
agent = Agent(model, output_type=bool, instructions='Is this request harmful?')

# Starting in 2.46.0, tool-call arguments that fall within Jev's
# supported question types (bool / Literal / Enum / a 0-1 float, etc.)
# can be filled by Jev too, without switching models mid-run
```

## Comparison with other frameworks

LangGraph and CrewAI are largely about orchestrating multiple text-generating models. Pydantic AI's TypeSafeModel opens a different path: swap out the steps in an agent's decision chain that are really just classification — continue or not, which branch, a risk score — for a non-generative discriminative model, while keeping that step inside Pydantic's type validation and provider interface. By wiring tool arguments and union types into TypeSafeModel in 2.46.0, Pydantic AI signals this isn't a one-off demo integration but an intent to let classifiers and generative models coexist in the same agent, switched in as needed.

## Today's takeaway

I used to assume "model" in an agent framework defaults to "something that generates text." Watching Jev — a classifier that never writes text, only answers typed questions — get wired in as a first-class citizen of `Agent`, sharing the same provider interface and type validation as any language model, changed that: a lot of the steps in an agent's decision chain are classification problems, not generation problems, and forcing a generative model onto them just means paying token-generation latency and cost for nothing.

## References

- [Pydantic AI v2.46.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.46.0)
- [Pydantic AI GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.44.0 — previous framework update](/posts/daily/2026-09-18-framework-pydantic-ai-2.44.0)
- [TypeSafe (Jev) — Pydantic AI official docs](https://pydantic.dev/docs/ai/models/typesafe/)
- [TypeSafeModel PR #8450](https://github.com/pydantic/pydantic-ai/pull/8450)
- [Pydantic AI Adds Jev to Cut Classification Latency 6x Without Generating Tokens — AlphaSignal](https://alphasignal.ai/news/pydantic-ai-adds-jev-to-cut-classification-latency-6x-without-generating-tokens)
- [Full Changelog: v2.45.0...v2.46.0](https://github.com/pydantic/pydantic-ai/compare/v2.45.0...v2.46.0)
