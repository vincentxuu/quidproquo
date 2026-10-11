---
title: "Framework Update: Pydantic AI 2.55.0"
date: 2026-10-11
category: daily
type: digest
tags: [ai-agent, framework, daily, pydantic-ai]
lang: en
description: "Pydantic AI 2.55 moves cross-run conversation history into a native Conversation object and unifies prompt caching into one cross-provider setting"
tldr: "Three things in Pydantic AI 2.55.0: (1) a new Conversation object carries and stores a conversation's run history, accepted as conversation= by every entry point, so you no longer wire message_history between calls yourself; (2) a unified, cross-provider cache setting and Caching capability, where cache=True now caches instructions and tool definitions on Anthropic, not just messages; (3) new officially hosted PostgresStepStore and PostgresMediaStore backends. Compatibility: every package now requires Python 3.11+, and LogfireMCP tool names gain a logfire_ prefix."
series:
  name: "AI Framework Changelog"
  order: 37
---

> 🌏 [中文版](/posts/daily/2026-10-11-framework-pydantic-ai-2.55.0)

## Release Info

| Item | Value |
|---|---|
| Framework | Pydantic AI |
| Version | `v2.55.0` |
| Previous version | `v2.54.0` |
| Release date | 2026-10-09 |
| Release Notes | [GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0) |
| GitHub | [pydantic/pydantic-ai](https://github.com/pydantic/pydantic-ai) |
| Stars | 20.5k |

## Why this release matters

Chaining one `run()` call to the next used to mean pulling `message_history` out of the previous result and passing it into the next call yourself — the framework had no say in how a conversation connected across runs. 2.55 moves that into the framework: a new `Conversation` object carries and stores the full run history of a conversation, and it's accepted as a shared parameter across every entry point (`run`, `run_sync`, `run_stream`, and the rest), not bolted onto one specific API. The other direction is pulling prompt caching out of per-provider SDK parameters and into one unified setting: a new cross-provider `cache` setting and `Caching` capability mean `cache=True` on Anthropic now caches instructions and tool definitions too, not just message content. Together these point the same way — turning "how does a conversation connect" and "how does caching turn on," both previously scattered across call sites or provider-specific parameters, into native, cross-provider framework interfaces. The more immediately felt changes are a halved import time (`pydantic_ai.mcp` now loads lazily) and new officially hosted Postgres persistence backends.

## Key Changes

- **`Conversation` object**: a new `Conversation` class carries and stores a conversation's run history, accepted as `conversation=` by every entry point → no more manually wiring the previous run's `message_history` into the next call ([#8337](https://github.com/pydantic/pydantic-ai/pull/8337))
- **Unified `Caching` capability**: a new cross-provider `cache` setting and `Caching` capability → one consistent way to turn on prompt caching instead of writing separate caching parameters per provider ([#7560](https://github.com/pydantic/pydantic-ai/pull/7560))
- **Wider Anthropic cache coverage**: with `cache=True` on Anthropic's automatic caching, instructions and tool definitions are now cached too (previously only message content was) → agents with long system prompts or many tool definitions save more on repeated tokens ([#10047](https://github.com/pydantic/pydantic-ai/pull/10047))
- **`PostgresStepStore` / `PostgresMediaStore`**: new officially hosted Postgres backends for messages and media respectively → no more rolling your own storage layer or tying yourself to the Logfire cloud ([#9899](https://github.com/pydantic/pydantic-ai/pull/9899))
- **Halved import time**: `pydantic_ai.mcp` now loads lazily, only when an MCP capability is actually needed → `import pydantic_ai` time is cut in half ([#10046](https://github.com/pydantic/pydantic-ai/pull/10046))
- **`OpenAIDecisionsModel`**: a new Decisions backend with image input support ([#9634](https://github.com/pydantic/pydantic-ai/pull/9634))
- **`claude-haiku-5-5` support**: added support for the Claude Haiku 5.5 model ([#9998](https://github.com/pydantic/pydantic-ai/pull/9998))
- **Prompt caching on by default in the harness `Coder`**: the built-in `Coder` capability now turns on prompt caching by default ([#10040](https://github.com/pydantic/pydantic-ai/pull/10040))

## Breaking Changes

- Every package (`pydantic-ai`, `pydantic-ai-slim`, `pydantic-graph`, and the rest) now requires Python 3.11 or newer; installs on Python 3.10 resolve to 2.54.0 or earlier:
  - `pip install pydantic-ai` won't error on Python 3.10, but it also won't get any of 2.55's new features — it just quietly installs an older version
  - Affects: projects still on Python 3.10 ([#9526](https://github.com/pydantic/pydantic-ai/pull/9526))
- `LogfireMCP` tool names now carry a `logfire_` prefix:
  - Affects: projects using `LogfireMCP` that hard-code the old tool name strings in code or prompts ([#9868](https://github.com/pydantic/pydantic-ai/pull/9868))

## Migration Guide

### Upgrading from 2.54.x to 2.55.0

```bash
# Step 1: check your Python version (3.11+) before upgrading the package
python --version
pip install --upgrade pydantic-ai==2.55.0
```

```python
# Before (2.54.x and earlier): wiring message_history between runs yourself
result1 = agent.run_sync("First message")
result2 = agent.run_sync("Follow-up", message_history=result1.all_messages())

# After (2.55.0): carry the whole conversation with a Conversation object
from pydantic_ai import Conversation

conversation = Conversation()
result1 = agent.run_sync("First message", conversation=conversation)
result2 = agent.run_sync("Follow-up", conversation=conversation)
```

```python
# New: a unified, cross-provider prompt caching setting
agent = Agent("anthropic:claude-haiku-5-5", cache=True)  # caches instructions + tool definitions too
```

Projects not on Python 3.10, and not hard-coding `LogfireMCP` tool name strings, have no code-level breaking change on upgrade; projects still on Python 3.10 need to upgrade Python first to get anything from 2.55.

## Comparison with Other Frameworks

Promoting conversation history from a hand-wired `message_history` list at the call site into a first-class framework object lines up with what Agno 3.1.2 just did with `Agent(compaction=True)` (folding long conversations into an archived `agno_compactions` table without overwriting the originals) — different frameworks are converging on the same idea: a conversation should be a queryable, storable, portable object, not just a list of messages passed back and forth. Unifying prompt caching into one framework-level setting fills in another piece: LangGraph and CrewAI still mean writing to whatever caching parameters each provider's SDK exposes, where Pydantic AI abstracts that behind one `cache` setting — a difference that shows up more clearly in projects wiring up several model providers at once.

## Today's Takeaway

I used to think prompt caching was just a per-provider SDK parameter that the framework, at best, passed through. Seeing Pydantic AI fold it into one framework-level setting — and turn it on by default for its own built-in `Coder` capability — made it click that caching strategy should actually follow the agent's definition: whether to cache, and how much to cache (messages? instructions? tool definitions?) are decisions the framework should be making, not something a developer re-derives at every provider call site.

## References

- [Pydantic AI v2.55.0 — GitHub Release](https://github.com/pydantic/pydantic-ai/releases/tag/v2.55.0)
- [pydantic/pydantic-ai — GitHub](https://github.com/pydantic/pydantic-ai)
- [Pydantic AI v2.53.0 — previous framework update](/en/posts/daily/2026-10-03-framework-pydantic-ai-2.53.0-en)
- [PR #8337: Add the `Conversation` object](https://github.com/pydantic/pydantic-ai/pull/8337)
- [PR #7560: Unified cross-provider `Caching` capability](https://github.com/pydantic/pydantic-ai/pull/7560)
- [PR #10047: Extend Anthropic caching to instructions/tool definitions](https://github.com/pydantic/pydantic-ai/pull/10047)
- [PR #9899: Add `PostgresStepStore`/`PostgresMediaStore`](https://github.com/pydantic/pydantic-ai/pull/9899)
- [PR #10046: Lazy-load `pydantic_ai.mcp`, halving import time](https://github.com/pydantic/pydantic-ai/pull/10046)
- [PR #9526: Every package now requires Python 3.11+](https://github.com/pydantic/pydantic-ai/pull/9526)
- [PR #9868: `LogfireMCP` tool names gain a `logfire_` prefix](https://github.com/pydantic/pydantic-ai/pull/9868)
- [Full Changelog: v2.54.0...v2.55.0](https://github.com/pydantic/pydantic-ai/compare/v2.54.0...v2.55.0)
