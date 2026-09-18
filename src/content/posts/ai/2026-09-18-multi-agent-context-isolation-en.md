---
title: "Multi-Agent Context Management: The Fork vs Fresh Trade-off, History Truncation, and Result Compression"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, context-engineering, agent, anthropic, openai, langgraph, cost-optimization]
lang: en
tldr: "Should a sub-agent see the parent's conversation? Fork carries full history but token costs grow exponentially. Fresh saves money but lacks context. Industry consensus: default to Fresh, Fork only when needed, and always pair it with history truncation and result compression."
description: "Part 4 of the Multi-Agent Systems in Practice series. A deep dive into fork/fresh context modes, history truncation strategies, and result compression mechanisms, comparing implementations from Claude Code to Antigravity."
draft: false
series:
  name: "Multi-Agent Systems in Practice"
  order: 4
---

The most underestimated problem in multi-agent systems isn't "how to make agents cooperate" — it's "how much information should each agent see."

Give too much — token explosion, runaway costs, and the model drowning in irrelevant information. Give too little — the sub-agent lacks context and makes poor decisions. This post covers how different frameworks handle context isolation and sharing.

## Fork vs Fresh: Two Fundamental Modes

Nearly every framework that supports subagents faces the same choice: should the child agent inherit the parent's conversation history?

### Fresh (Blank Slate)

The sub-agent receives only the task description, with no parent conversation history.

According to [Anthropic's agent design guide](https://docs.anthropic.com/en/docs/agents), Fresh is the default choice for most scenarios. Claude Code's Fresh subagent starts with zero context — the prompt must fully describe the task on its own. This suits work that requires independent judgment — code review, security audits, fact-checking — because inheriting the parent's context would actually introduce bias.

Codex's worker agents also operate with independent contexts. Per the [OpenAI documentation](https://openai.com/index/codex-now-generally-available/), each spawned worker receives an explicit task string from the manager, not the entire conversation.

**Advantages**: Saves tokens, no context pollution, independent judgment
**Disadvantages**: The task description must be self-contained — if key background from the parent conversation isn't included, the sub-agent will lack information

### Fork (Inherit History)

The sub-agent receives the parent agent's complete conversation history plus a new task message.

Claude Code's Fork subagent inherits the full context and shares the parent's prompt cache, so cache-hit portions aren't charged again. This is what makes fork mode cost-viable — without prompt caching, fork's input token cost would grow linearly with nesting depth.

**Advantages**: The sub-agent has full context and doesn't need the task description to restate all prior information
**Disadvantages**: High token consumption, severe context bloat with deep nesting

### When to Use Which

| Scenario | Recommendation | Reason |
|---|---|---|
| Code review / security audit | Fresh | Needs independent judgment; inheriting context introduces author bias |
| Parallel data lookups | Fresh | Each query is independent; no need to know what other queries are doing |
| "Summarize what we just discussed" | Fork | Must see the full conversation to summarize |
| Debugging: "look into that error from earlier" | Fork | Needs to know what was already tried |
| Batch processing | Fresh | Each item is processed independently |

## The Context Bloat Problem

Fork mode causes exponential context bloat with nested spawns. Consider this scenario:

```
Parent agent (50 messages, ~15K tokens)
  └─ Child agent A (fork: inherits 50 + own 20 = 70 messages, ~21K tokens)
       └─ Grandchild A1 (fork: inherits 70 + own 15 = 85 messages, ~25K tokens)
       └─ Grandchild A2 (fork: inherits 70 + own 15 = 85 messages, ~25K tokens)
  └─ Child agent B (fork: inherits 50 + own 30 = 80 messages, ~24K tokens)
```

Three levels of nesting, 5 agents, and input tokens alone exceed 110K. With 5 parallel spawns per level and 3 levels deep, the theoretical maximum is 125 agents each carrying bloated context — the bill would be spectacular.

## Industry Solutions

### Result Compression

The sub-agent's full response is summarized by an LLM into a condensed version before being returned to the parent agent.

According to [Anthropic's multi-agent research system writeup](https://www.anthropic.com/engineering/multi-agent-research-system), their orchestrator-worker architecture compresses worker responses before merging them into the orchestrator's context. This prevents a common problem: one worker returns a lengthy response that eats up the context space available for subsequent workers.

[Antigravity (formerly Gemini CLI)](https://github.com/google-gemini/gemini-cli/blob/main/docs/core/subagents.md) takes this even further — **all** subagent results are mandatorily compressed before being returned to the main session. This reflects Antigravity's design philosophy: the main agent's context is a precious resource that sub-agents shouldn't freely pollute.

### History Truncation

Instead of carrying full history, fork mode truncates to the most recent N messages or produces a summary.

According to the Microsoft Agent Framework's [TokenOps philosophy](https://github.com/microsoft/agents), the first response to approaching a budget limit isn't to stop, but to compress context. The original AutoGen 0.2's `TransformMessages` mechanism could truncate or summarize messages before passing them to an agent — while the API is now deprecated, the concept was inherited by MAF.

Practical recommendations:
- Fork mode should default to carrying only the most recent 20 messages (or ~8K tokens)
- Anything beyond that gets a one-time LLM summary, placed as the first system message
- Truncate at each nesting level to prevent layer-by-layer bloat

### Selective Context

Rather than all-or-nothing, carry only the relevant parts.

[LangGraph](https://langchain-ai.github.io/langgraph/)'s State mechanism naturally supports this — each node accesses only the keys it needs from the graph state, not the entire conversation history. You can design a state schema with keys like `user_request`, `search_results`, `analysis`, and `final_report`, where each agent node reads and writes only its relevant portion.

This is more granular than the fork/fresh binary choice, but requires developers to design the state schema themselves — the trade-off is more upfront design work.

## The Role of Prompt Cache

Fork mode's cost depends heavily on whether prompt caching is available.

According to [Anthropic's pricing](https://docs.anthropic.com/en/docs/about-claude/models), cache-hit input tokens are charged at only 10% of the base price. Claude Code's Fork subagent shares the parent agent's prompt cache, so if the inherited 50 messages of history all hit cache, the actual additional cost is only 10%.

But this advantage **only holds when using the same provider and the cache hasn't expired**. Cross-provider multi-agent setups (e.g., Windsurf's Cascade + Devin) have no shared cache, so fork mode costs the full input token price.

## In Summary

The core trade-off in context management is **information sufficiency vs token efficiency**:

1. **Default to Fresh** — most tasks don't need full history; a well-written task description beats 50 messages of conversation history
2. **Fork only when needed** — use it only when the sub-agent genuinely needs conversational context
3. **Always pair Fork with truncation** — don't carry unlimited history; 20 messages or 8K tokens is a reasonable cap
4. **Always compress results** — summarize sub-agent responses before passing them back to the parent to prevent context pollution
5. **Use cache when available** — prompt caching brings fork mode costs down to an acceptable range

One easily overlooked point: **context management affects quality, not just cost**. According to [Google Research's experiments](https://arxiv.org/abs/2512.08296), information-overloaded agents actually perform worse than those with lean information — once models are buried in irrelevant messages, they ignore the instructions that actually matter. Less is more.

## References

- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Claude models & pricing](https://docs.anthropic.com/en/docs/about-claude/models)
- [Claude Code — Subagent types (Fork vs Fresh)](https://code.claude.com/docs/en/workflows)
- [OpenAI — Codex GA announcement](https://openai.com/index/codex-now-generally-available/)
- [Antigravity — Subagents documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/core/subagents.md)
- [Microsoft Agent Framework](https://github.com/microsoft/agents)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Google Research — Towards a Science of Scaling Agent Systems (arXiv 2512.08296)](https://arxiv.org/abs/2512.08296)
