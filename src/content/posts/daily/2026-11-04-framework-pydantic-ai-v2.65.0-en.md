---
title: "Framework Update: Pydantic AI v2.65.0"
date: 2026-11-04
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI v2.65.0 adds ConversationStore, which stores a conversation as a write-once message log, adds a WebSocket transport for OpenAI Responses, and lets ModelFallback catch a model refusal"
tldr: "Three things in Pydantic AI v2.65.0: (1) a new `ConversationStore` that stores a conversation as a write-once message log, with `Conversation.revision` to catch conflicting concurrent writes; (2) `ModelFallback`'s `fallback_on` can now catch a model refusal and switch to the next model automatically; (3) Breaking: Z.ai balance/plan-limit 429s now raise `ModelQuotaExceededError`, `BrowserUse` model calls now count toward usage and `UsageLimits`, and Temporal no longer retries model errors that can't succeed on retry by default."
series:
  name: "AI Framework Changelog"
  order: 61
---

> 🌏 [中文版](/posts/daily/2026-11-04-framework-pydantic-ai-v2.65.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | v2.65.0 |
| Previous version | v2.64.0 |
| Release date | 2026-11-02 |
| Release Notes | [v2.65.0](https://github.com/pydantic/pydantic-ai/releases/tag/v2.65.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 21k |

## Why this version matters

The last release (v2.64.0) fixed "what happens when the model goes down." This one fixes "where the conversation record lives, and who wins when two writes collide." Persisting an agent's conversation used to mean wiring up your own database and serializing the whole message history on every write, with no real answer for who wins when two writes land at once. `ConversationStore` brings that into the framework: a conversation is stored as a write-once message log that you only ever append to, instead of rewriting the whole history each time, and `Conversation.revision` lets concurrent writes detect a conflict instead of letting whichever write lands last silently overwrite the other. The same release also makes `ModelFallback` (the fallback capability added in v2.64.0) a bit smarter: an outright refusal from the model can now trigger a fallback too, not just a timeout or an error.

## Key Changes

- **ConversationStore for conversation persistence**: a new `ConversationStore` stores a conversation as a write-once message log that only ever gets appended to, never rewritten whole → long-running agents get a persistable conversation history natively, instead of wiring up your own database serialization
- **Conversation.revision catches conflicting writes**: a new `revision` field lets concurrent writes to the same conversation detect a conflict → multiple processes or workers writing the same conversation at once no longer risk one silently overwriting the other
- **ModelFallback catches model refusals**: `fallback_on` can now match `ContentFilterError` against a model refusal and trigger a switch to the next model → a refusal from a content policy no longer needs its own handling code; it goes through the existing fallback path
- **WebSocket transport for OpenAI Responses**: adds a WebSocket transport option for the OpenAI Responses API → a lower-latency, bidirectional alternative to HTTP streaming
- **12h prompt cache retention**: the OpenAI Responses API now supports a `'12h'` prompt-cache retention window for GPT-5.6 and later → conversations that go quiet for a while can still keep their cache instead of paying to rebuild it
- **anthropic_web_tools_allowed_callers**: a new setting restricts who can call Anthropic's web tools → useful when several agents share one model config and you want to narrow which callers can trigger network access

```diagram
title: ConversationStore uses revision to catch concurrent write conflicts
desc: Two workers append messages to the same conversation at once. Worker A writes first and succeeds, advancing revision from r1 to r2. Worker B still holds the stale r1 and sends the same append, which the store rejects with 409. Worker B reloads the latest revision and retries, succeeding this time.
step: Worker A sends an append at revision=r1
step: The store accepts the write, revision moves to r2
step: Worker B sends an append still at the stale revision=r1
step: The store detects a revision conflict and returns 409
step: Worker B sends the append again at the latest revision=r2
step: The store accepts the write, revision moves to r3
---
<svg viewBox="0 0 640 416">
  <line class="dg-rule" x1="96" y1="72" x2="96" y2="400"/>
  <line class="dg-rule" x1="320" y1="72" x2="320" y2="400"/>
  <line class="dg-rule" x1="544" y1="72" x2="544" y2="400"/>

  <g data-step="1">
    <path class="dg-line" d="M96 120H316" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="206" y="108" text-anchor="middle" dominant-baseline="central">append(revision=r1)</text>
  </g>
  <g data-step="2">
    <path class="dg-line dg-line--dashed" d="M316 168H100" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="208" y="156" text-anchor="middle" dominant-baseline="central">200, revision=r2</text>
  </g>
  <g data-step="3">
    <path class="dg-line" d="M540 216H324" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="432" y="204" text-anchor="middle" dominant-baseline="central">append(revision=r1)</text>
  </g>
  <g data-step="4">
    <path class="dg-line dg-line--warn dg-line--dashed" d="M324 264H540" marker-end="url(#arrow-warn)"/>
    <text class="dg-edge dg-mono dg-text--warn" x="432" y="252" text-anchor="middle" dominant-baseline="central">409 revision conflict</text>
  </g>
  <g data-step="5">
    <path class="dg-line" d="M540 312H324" marker-end="url(#arrow)"/>
    <text class="dg-edge dg-mono" x="432" y="300" text-anchor="middle" dominant-baseline="central">append(revision=r2)</text>
  </g>
  <g data-step="6">
    <path class="dg-line dg-line--accent dg-line--dashed" d="M324 360H540" marker-end="url(#arrow-accent)"/>
    <text class="dg-edge dg-mono" x="432" y="348" text-anchor="middle" dominant-baseline="central">200, revision=r3</text>
  </g>

  <rect class="dg-box" x="316" y="108" width="8" height="72" rx="2" data-step="1 2"/>
  <rect class="dg-box" x="316" y="204" width="8" height="72" rx="2" data-step="3 4"/>
  <rect class="dg-box" x="316" y="300" width="8" height="72" rx="2" data-step="5 6"/>

  <rect class="dg-box" x="32" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="96" y="48" text-anchor="middle" dominant-baseline="central">Worker A</text>
  <rect class="dg-box dg-box--accent" x="256" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="320" y="48" text-anchor="middle" dominant-baseline="central">ConversationStore</text>
  <rect class="dg-box" x="480" y="24" width="128" height="48" rx="6"/>
  <text class="dg-label" x="544" y="48" text-anchor="middle" dominant-baseline="central">Worker B</text>
</svg>
```

## Breaking Changes

- Z.ai balance/plan-limit 429s now raise `ModelQuotaExceededError` instead of `ModelRateLimitError`:
  - Impact: code that specifically caught `ModelRateLimitError` to handle Z.ai 429s needs to catch `ModelQuotaExceededError` instead
- `BrowserUse` model calls now count toward the host run's usage and `UsageLimits`:
  - Impact: scenarios that previously didn't count `BrowserUse`'s internal model calls against a usage cap will see higher total usage after upgrading, and runs close to the `UsageLimits` ceiling may get cut off sooner
- Temporal no longer retries model errors that can't succeed on retry by default; this is tunable via `non_retryable_model_errors`:
  - Impact: workflows that relied on the old behavior of "every model error gets retried by Temporal" will now see certain error types fail outright, so check whether those need to be added back to the retryable list

## Migration Guide

### Upgrading from 2.64.0 to 2.65.0

```bash
pip install --upgrade pydantic-ai==2.65.0
```

```python
# Code that used to catch ModelRateLimitError for Z.ai 429s should catch ModelQuotaExceededError instead
from pydantic_ai.exceptions import ModelQuotaExceededError

try:
    result = await agent.run(prompt)
except ModelQuotaExceededError:
    ...  # what used to be `except ModelRateLimitError`

# If a workflow relies on "every model error gets retried" from Temporal, state that explicitly
from pydantic_ai.durable_exec.temporal import TemporalAgent

agent = TemporalAgent(my_agent, non_retryable_model_errors=())  # empty set = keep the old "retry everything" behavior

# Basic ConversationStore usage
store = ConversationStore(...)
conversation = await store.load(conversation_id)
```

Everything else is additive — code that doesn't hit the three scenarios above keeps working without any changes.

## Comparison with other frameworks

The day before (2026-11-03), Composio CLI 0.6.0 turned two implicit assumptions — "what happens when execution is interrupted" and "which account to pick in a multi-account setup" — into explicit contracts, addressing the integration-layer boundary where an agent calls external tools. Pydantic AI goes a different direction in this release, closing a gap in the persistence layer: where a conversation itself lives, and who wins when two writes collide. Taken together, both frameworks are patching boundaries that tend to get overlooked once an agent runs long enough — one is the identity boundary across accounts and tool calls, the other is the conflict boundary across workers and processes writing the same conversation.

## Today's Takeaway

I used to assume "persisting a conversation" just meant serializing the whole message array into a database and rewriting it whole on every update. Seeing `Conversation.revision` made me realize that assumption only holds with a single worker and a single writer. The moment two workers touch the same conversation at once — a retry, a horizontally scaled worker — "rewrite the whole thing" turns into a race where whichever write lands last wins by accident. `ConversationStore` changes the write pattern from "overwrite the whole record" to "append only," and uses `revision` to catch the conflict — that's what actually makes persistence safe in a concurrent environment.

## References

- [Pydantic AI v2.65.0 Release Notes](https://github.com/pydantic/pydantic-ai/releases/tag/v2.65.0)
- [pydantic/pydantic-ai GitHub](https://github.com/pydantic/pydantic-ai)
- [Full Changelog: v2.64.0...v2.65.0](https://github.com/pydantic/pydantic-ai/compare/v2.64.0...v2.65.0)
- [Composio CLI 0.6.0 Release Notes](https://github.com/ComposioHQ/composio/releases/tag/%40composio%2Fcli%400.6.0)
