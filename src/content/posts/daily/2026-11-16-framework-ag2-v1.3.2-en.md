---
title: "Framework Update: AG2 v1.3.2"
date: 2026-11-16
category: daily
type: digest
tags: [ai-agent, framework, daily, ag2]
lang: en
description: "AG2 v1.3.2 unifies token usage accounting across providers under one rule, fixing an undercount of prompt_tokens on Anthropic and Bedrock, while letting one decision agent answer several questions in a single request"
tldr: "Three things in AG2 v1.3.2: (1) Breaking: prompt_tokens now always means the full input, including cache reads and writes — fixing an Anthropic/Bedrock undercount, so usage numbers will go up; (2) response_schema can be a flat dataclass/Pydantic model that answers several decision questions in one request, instead of one agent per question; (3) Breaking: ACP moves to the official 1.0 protocol, requiring agent-client-protocol >=1.0.0."
series:
  name: "AI Framework Changelog"
  order: 67
---

> 🌏 [中文版](/posts/daily/2026-11-16-framework-ag2-v1.3.2)

## Release Info

| Item | Value |
|---|---|
| Framework | AG2 (formerly AutoGen) |
| Version | v1.3.2 |
| Previous version | v.1.3.1 |
| Release date | 2026-11-15 |
| Release Notes | [v1.3.2](https://github.com/ag2ai/ag2/releases/tag/v1.3.2) |
| GitHub | [ag2ai/ag2](https://github.com/ag2ai/ag2) |
| Stars | 5.1k |

## Why this release matters

Multi-provider agent frameworks tend to force every provider's usage fields into the same field names — `prompt_tokens`, `completion_tokens`, `total_tokens`. The problem is that providers don't agree on whether a cache hit counts as part of the prompt. OpenAI and Gemini fold cache reads and writes into `prompt_tokens`; Anthropic and Bedrock, until now, only reported the part that missed the cache. So the same field name meant a different number depending on which provider answered, and any cross-provider usage dashboard, `TokenMonitor` threshold, or delegation-tree usage rollup could be silently wrong — not crashing, just wrong. 1.3.2 pins the rule down at the provider-mapper layer: `prompt_tokens` always means the whole input, and cache reads/writes are a subset of it, never an addition on top. The other change worth flagging is how decision agents are used: before, one agent could only answer one classification question; now a flat schema lets it answer several in a single request, without resending — and rebilling — the same input for each one.

```diagram
title: AG2 v1.3.2: how prompt_tokens changes on Anthropic/Bedrock
desc: Before 1.3.2, Anthropic/Bedrock's prompt_tokens counted only the part of the input that missed the cache, leaving cache reads and writes out of the total. After 1.3.2, prompt_tokens always means the full input, with cache_read_input_tokens/cache_creation_input_tokens as a subset of it rather than an addition.
caption: Numbers are from the release notes: the same call reported prompt_tokens=3 before, and prompt_tokens=8,630 after.
---
<svg viewBox="0 0 640 320">
  <text class="dg-sub" x="160" y="30" text-anchor="middle" dominant-baseline="central">Before</text>
  <rect class="dg-box dg-box--ghost" x="20" y="48" width="280" height="64" rx="6"/>
  <text class="dg-label" x="160" y="70" text-anchor="middle" dominant-baseline="central">prompt_tokens = 3</text>
  <text class="dg-sub" x="160" y="92" text-anchor="middle" dominant-baseline="central">only the part that missed the cache</text>

  <rect class="dg-box dg-box--ghost" x="20" y="132" width="280" height="64" rx="6"/>
  <text class="dg-label" x="160" y="154" text-anchor="middle" dominant-baseline="central">cache_read_input_tokens</text>
  <text class="dg-sub" x="160" y="176" text-anchor="middle" dominant-baseline="central">8,627 (not counted in prompt_tokens)</text>

  <text class="dg-edge" x="160" y="226" text-anchor="middle" dominant-baseline="central">TokenMonitor/telemetry undercounts the real input</text>

  <text class="dg-sub" x="480" y="30" text-anchor="middle" dominant-baseline="central">After 1.3.2</text>
  <rect class="dg-box" x="340" y="48" width="280" height="64" rx="6"/>
  <text class="dg-label" x="480" y="70" text-anchor="middle" dominant-baseline="central">prompt_tokens = 8,630</text>
  <text class="dg-sub" x="480" y="92" text-anchor="middle" dominant-baseline="central">always the full input</text>

  <rect class="dg-box" x="340" y="132" width="280" height="64" rx="6"/>
  <text class="dg-label" x="480" y="154" text-anchor="middle" dominant-baseline="central">cache_read_input_tokens</text>
  <text class="dg-sub" x="480" y="176" text-anchor="middle" dominant-baseline="central">8,627 (a subset of prompt_tokens)</text>

  <text class="dg-edge" x="480" y="226" text-anchor="middle" dominant-baseline="central">usage numbers are now comparable across providers</text>
</svg>
```

## Key changes

- **One rule for token usage across providers**: `prompt_tokens` always means the full input, including cache reads and writes; `cache_read_input_tokens` and `cache_creation_input_tokens` are a subset of it, never an addition; `total_tokens >= prompt_tokens + completion_tokens` → fixes the Anthropic/Bedrock undercount that left out cache hits, so usage numbers are now directly comparable across providers
- **Gemini Live thinking tokens fold into completion_tokens**: matching how batch Gemini and xAI already count them, instead of being excluded from usage → workflows doing reasoning on Gemini Live finally get a complete usage number
- **Several decision questions in one request**: `response_schema` can now be a flat dataclass, `TypedDict`, or Pydantic model, with each field mapping to one decision question; both `OpenAIDecisionsConfig` and `TypeSafeConfig` support it, and every question goes out in a single request → no more spinning up one agent per question ("is this spam, which team, how urgent") just to resend and rebill the same input three times; a schema the decision APIs can't answer — nested fields, `Optional`, a field without a question — is rejected locally before anything is sent
- **ACP 1.0**: messages no longer get joined into one string — each chunk is now its own `ModelMessage` event, and `reply.body` is the agent's final message rather than everything it said; text/blob resources, resource links, and tool-result structure are no longer dropped; a session no longer needs `async with` to close cleanly; `cwd` and `additional_directories` are resolved to absolute paths as soon as a session starts
- **Python 3.15 support**: CI and type-checking now cover 3.15, but PyYAML hasn't shipped 3.15 wheels yet, so `pip install ag2` on 3.15 builds PyYAML from source and needs a C compiler

## Breaking Changes

- `prompt_tokens`, `total_tokens`, and the telemetry field `gen_ai.usage.input_tokens` will go up on Anthropic and Bedrock (cache reads/writes are now counted in):
  - Affected: any project with a token budget or `TokenMonitor` threshold will hit it sooner than before; usage data stored by earlier versions is not rewritten
- `completion_tokens` and `total_tokens` will go up on Gemini Live thinking models (thinking tokens now included):
  - Affected: workflows on Gemini Live thinking models with a usage threshold set
- the `acp` extra now requires `agent-client-protocol>=1.0.0,<2`; 0.12.x is no longer supported:
  - Affected: any project pinning `agent-client-protocol` itself — update that pin before upgrading AG2
- `ag2.acp.AuthMethod` drops the env-var auth method the SDK removed; `BridgeState.turn_text` is replaced by `turn_messages`:
  - Affected: code that references either name directly

## Migration Guide

### Upgrading from v.1.3.1 to v1.3.2

```bash
pip install --upgrade ag2==1.3.2
```

```python
# Before: one decision agent per question — three agents for three questions
is_spam_agent = Agent("is_spam", config=OpenAIDecisionsConfig(), response_schema=bool)
department_agent = Agent("department", config=OpenAIDecisionsConfig(), response_schema=Department)
urgency_agent = Agent("urgency", config=OpenAIDecisionsConfig(), response_schema=Urgency)
# the same ticket text gets sent, and billed, three times

# After: a flat schema answers all of them in one request
@dataclass
class TicketTriage:
    is_spam: Annotated[bool, Question("Is this message spam?")]
    department: Annotated[Department, Question("Which team should handle this ticket?")]
    urgency: Annotated[Urgency, Question("How urgent is this ticket?")]

triage = Agent("triage", config=OpenAIDecisionsConfig(), response_schema=TicketTriage)
reply = await triage.ask("I was charged twice this month.")
```

Before upgrading, check whether your `agent-client-protocol` pin is already `>=1.0.0,<2` — if not, update that pin first. If you have a token budget or `TokenMonitor` threshold set, re-check those numbers after upgrading, especially for anything running on Anthropic, Bedrock, or Gemini Live thinking models — the same threshold can now trigger earlier than it used to. Projects without ACP or custom token thresholds can upgrade directly.

## Compared to other frameworks

deepset's Haystack also added OpenAI Decisions API-based router/classifier components this week (v3.5.0, Nov 10) — `OpenAIDecisionsTextRouter`, `OpenAIDecisionsImageRouter`, `OpenAIDecisionsDocumentClassifier` — but each component handles a single classification axis: which branch a piece of text or an image goes to. AG2's flat schema here is solving a different dimension — bundling several independent questions (is it spam, which department, how urgent) into one request — so the redundancy it removes is "does the same input need to be sent more than once," not which axis to classify on. As for the cross-provider token rule, most frameworks just pass each provider's SDK usage fields through as-is; few write down an explicit rule for whether `prompt_tokens` should include cache hits and enforce it at the provider-mapper layer. AG2 has filled that gap more carefully than most comparable frameworks.

## Today's takeaway

I used to assume `prompt_tokens` was a standardized field in multi-provider frameworks — if the field name is unified, surely its meaning is too. Seeing the before/after in the release notes made it clear that isn't true: on the same call, Anthropic used to report `prompt_tokens=3` while the model had actually read 8,630 tokens. That's not a bug — it's that the field never had a shared cross-provider definition in the first place. Which means any cross-provider usage dashboard built on "standardized" field names could have been silently off by an order of magnitude, with nobody noticing, because nothing about it ever threw an error.

## References

- [AG2 v1.3.2 Release Notes](https://github.com/ag2ai/ag2/releases/tag/v1.3.2)
- [ag2ai/ag2 on GitHub](https://github.com/ag2ai/ag2)
- [Full Changelog: v.1.3.1...v1.3.2](https://github.com/ag2ai/ag2/compare/v.1.3.1...v1.3.2)
- [AG2 Documentation: Several Decision Questions at Once](https://docs.ag2.ai/docs/user-guide/decision_models/#several-questions-at-once)
- [AG2 Documentation: Telemetry](https://docs.ag2.ai/docs/user-guide/telemetry/agent/)
- [AG2 Documentation: ACP Client](https://docs.ag2.ai/docs/user-guide/acp/client/)
- [Framework Update: Mastra @mastra/core v1.83.0](/posts/daily/2026-11-14-framework-mastra-core-v1.83.0-en)
