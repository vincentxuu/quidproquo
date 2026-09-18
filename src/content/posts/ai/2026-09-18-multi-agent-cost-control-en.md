---
title: "Multi-Agent Cost Control: How Seven Frameworks Handle the 'Soft Landing Before Hard Stop' Consensus"
date: 2026-09-18
type: deep-dive
category: ai
tags: [multi-agent, cost-optimization, agent, anthropic, openai, langgraph, crewai, microsoft-agent-framework, bedrock]
lang: en
tldr: "Parallel + nested agent spawns can burn 200K+ tokens in a single conversation turn. From Anthropic to Microsoft, the industry is converging on tiered responses: compress → downgrade → stop, rather than a binary kill switch."
description: "Comparing multi-agent cost control mechanisms across Anthropic Claude Agent SDK, OpenAI Codex, Microsoft Agent Framework, LangGraph, CrewAI, and Amazon Bedrock Agents, with industry consensus and practical recommendations."
draft: false
series:
  name: "Multi-Agent Systems in Practice"
  order: 2
---

Having multiple AI agents collaborate sounds great — one searches, one analyzes, one writes the report. But when agents can dynamically spawn sub-agents, and those sub-agents can spawn their own, each carrying the full conversation history, token consumption in a single turn can grow exponentially.

This article surveys cost control mechanisms across seven major frameworks and the emerging industry consensus.

## Why Multi-Agent Systems Blow Up Costs

Three main reasons:

**Parallel spawns**: A supervisor agent dispatching 5 sub-agents to search simultaneously means 5x the LLM calls. Set the limit to 20, and that's 20x.

**Nesting depth**: Sub-agents can spawn their own sub-agents. At depth 3 with 5 parallel spawns per level, the theoretical upper bound is 5³ = 125 agents running concurrently.

**Fork context bloat**: Fork mode copies the parent agent's full conversation history to the child. Layer one carries 50 messages, layer two carries 80, layer three carries 120 — input tokens inflate at each level, multiplied by the parallelism count.

According to AutoGen community reports in 2025, unbounded conversation loops caused 40% budget overruns for some users. This isn't a theoretical risk — it actually happened.

## How Each Framework Handles It

### Anthropic: Claude Agent SDK + Managed Agents

According to [Anthropic's documentation](https://docs.anthropic.com/en/docs/agents), Anthropic introduced a three-tier system in 2026:

| Mechanism | Type | Description |
|---|---|---|
| **Session Budget** | Hard dollar cap | Set at the session level; when reached, returns `budget_reached` stop reason — pauses rather than terminates |
| **Task Budget** | Soft token hint | Server-side countdown injection; the model allocates priorities and wraps up proactively as the budget approaches |
| `max_tokens` per tool call | Per-call | Limits output tokens for individual tool invocations |

Task Budget is the most interesting design — rather than hard-blocking, it lets the model "know" the budget is running low and decide whether to economize or wrap up. According to Anthropic, this works best on Opus 4.7+.

Managed Agents pricing: token fees + $0.08/session-hour + tool costs.

Also worth noting is [Claude Code](https://code.claude.com/docs/en/workflows)'s Dynamic Workflow system. It provides `budget.remaining()` as a first-class primitive, letting orchestration scripts query remaining token budget alongside `pipeline()` / `parallel()` / `agent({schema})` for deterministic orchestration. Up to 1,000 agents per run, 16 concurrent, with resume-after-interrupt support (cache hit). This is currently the only coding agent that makes budget tracking a first-class orchestration primitive.

### OpenAI: Codex CLI

According to the [Codex GA announcement](https://openai.com/index/codex-now-generally-available/), Codex uses a Manager / Worker model with six primitives: `spawn_agent`, `send_message`, `followup_task`, `wait_agent`, `list_agents`, `close_agent`.

On cost control, Codex is relatively restrained:
- `config.toml` sets `max_concurrent_threads_per_session`
- Cloud version runs each task in an isolated sandbox container, fire-and-forget
- No built-in token budget mechanism — relies on OpenAI account-level spend limits

[Symphony](https://openai.com/index/open-source-codex-orchestration-symphony/) is OpenAI's open-source orchestration layer that uses Linear as a control plane to map issues to Codex agents, but it also lacks per-task token budgets.

### Microsoft Agent Framework (2026-04 GA)

[Microsoft Agent Framework](https://github.com/microsoft/agents) merged AutoGen's agent abstractions with Semantic Kernel's enterprise features; both entered maintenance mode. Its core philosophy is called **TokenOps**:

> When overspending, prioritize "in-place intervention" — compress context, cache results, reduce output. The kill switch is the last resort.

Specific mechanisms:

- `ChatClientAgentRunOptions.max_tokens`: per-call output cap
- **Termination middleware**: composable termination conditions, including `TokenUsageTermination`
- **Three-tier response**: approaching threshold → throttle → pause (await confirmation) → terminate
- Automatic context compression or model downgrade when approaching budget

The TokenOps philosophy: compress first, downgrade second, stop last — never a binary cut.

MAF's predecessor AutoGen is a cautionary tale worth remembering. AutoGen 0.2's `GroupChat` let multiple agents converse freely with no built-in token budget or turn limits, leading to community-reported 40% budget overruns. In November 2024, the original authors left Microsoft and forked [AG2](https://github.com/ag2ai/ag2); Microsoft built the async-first AutoGen 0.4 rewrite. By April 2026, Microsoft merged AutoGen + Semantic Kernel into MAF, and AutoGen officially entered [maintenance mode](https://github.com/microsoft/autogen/discussions/7066). From "unbounded conversation" to "tiered TokenOps" — this journey took nearly two years.

### LangGraph

[LangGraph](https://langchain-ai.github.io/langgraph/)'s approach is the most straightforward:

- `recursion_limit` (default 25) — hard cap on recursion depth
- Each node is a discrete LLM call, individually measurable
- Scheduler respects rate limits
- Combined with [LangSmith](https://smith.langchain.com/) for per-node token tracking

LangGraph's advantage is that explicit graph structure makes costs most predictable — you drew N nodes, so it runs at most N times. However, it has no built-in token budget mechanism; you need to implement that in your node logic.

### CrewAI

[CrewAI](https://docs.crewai.com/) takes a per-agent approach:

- `max_iter=5`: each agent runs at most 5 iterations, preventing infinite loops
- `max_tokens=2000`: limits single output length
- **Per-agent model tiering**: critical steps use Claude Opus / GPT-4o, routine tasks use Haiku / GPT-4o-mini

CrewAI's standout feature is how naturally model tiering works — you specify different models when creating each agent, no additional routing logic needed.

### Amazon Bedrock Agents

[Bedrock Agents](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html) provides platform-level guardrails:

- Session idle timeout: 60–5,400 seconds
- [Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html): content filtering / PII / denied topics, independent of the model
- 50K tokens per minute cap (memory retrieval)
- Lambda execution timeout up to 3,600 seconds

Bedrock's advantage is that guardrails operate at the platform level — no application-layer management needed. The downside is low flexibility — you can't do application-level logic like "downgrade model when approaching budget."

### Community Consensus (Dify)

The [Dify](https://dify.ai/) community compiled three-layer best practices:

1. **Per-model monthly budget cap**: prevent single-model runaway
2. **Per-conversation token ceiling**: hard limit per conversation
3. **Sub-agent timeout + token limit**: independent limits per subtask

Additional recommendations: auto-downgrade model at 70% budget, trigger alerts at 50% daily budget.

## Industry Consensus: Soft Landing Before Hard Stop

Across all frameworks, tiered response is the consensus:

```
Normal → Approaching budget (compress/downgrade) → At budget (pause/alert) → Over budget (terminate)
```

The difference lies in "who decides":

- **Anthropic Task Budget**: the model decides it's time to wrap up (soft hint)
- **Microsoft TokenOps**: middleware automatically compresses and downgrades (system automatic)
- **Bedrock Guardrails**: platform hard-blocks (no application-level control)
- **CrewAI**: developers pre-assign model tiers at design time

None is "right" — it depends on how much control you need. But **having only one tier (hard stop) is insufficient** — all frameworks agree on this.

## Practical Recommendations

Based on these frameworks' experience, multi-agent cost control requires at minimum:

1. **Basic guardrails** (must-have): iteration limits, concurrency limits, nesting depth limits, hard timeout
2. **Token budget** (must-have): per-turn or per-session token cap; refuse new spawns when exceeded
3. **History truncation** (high priority): don't carry unlimited history in fork mode; truncate to recent N messages or summarize
4. **Tiered response** (medium priority): compress/downgrade when approaching budget; hard-stop only at the limit
5. **Observability** (medium priority): per-agent token consumption visualization — without it, you won't know where the money went when things go wrong
6. **Result caching** (low priority): cache spawn results for identical task + context combinations to avoid duplicate LLM calls

Point 3 is easily overlooked — fork mode context bloat is multiplicative. Deep spawns will hit the model's context window limit quickly, and the bill will have exploded long before that.

## Overall

Multi-agent cost control isn't a single switch — it's a layered set of mechanisms. The industry is moving from "just set a limit" toward "tiered response + model self-awareness." Anthropic's Task Budget lets the model economize on its own; Microsoft's TokenOps lets the system auto-downgrade. Both are far smarter than a simple hard stop.

If you're building a multi-agent system, the minimum bar is: iteration limits + token budget + concurrency limits. The advanced approach adds: history truncation + tiered response. The ultimate goal is letting the system find the most efficient way to complete the task within budget, rather than getting abruptly cut off mid-execution.

## References

- [Anthropic — Building effective agents](https://docs.anthropic.com/en/docs/agents)
- [Anthropic — Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk)
- [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [Anthropic — Patterns and problems in multiagent systems](https://www.anthropic.com/research/multiagent-systems)
- [Claude Code — Dynamic Workflows](https://code.claude.com/docs/en/workflows)
- [OpenAI — Codex GA announcement](https://openai.com/index/codex-now-generally-available/)
- [OpenAI — Symphony open-source orchestration](https://openai.com/index/open-source-codex-orchestration-symphony/)
- [Microsoft Agent Framework](https://github.com/microsoft/agents)
- [Microsoft — AutoGen maintenance mode discussion](https://github.com/microsoft/autogen/discussions/7066)
- [Microsoft — AutoGen to Agent Framework migration guide](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-autogen/)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangChain — Benchmarking Multi-Agent Architectures](https://www.langchain.com/blog/benchmarking-multi-agent-architectures)
- [LangSmith — Tracing & Observability](https://smith.langchain.com/)
- [CrewAI Documentation](https://docs.crewai.com/)
- [Amazon Bedrock Agents](https://docs.aws.amazon.com/bedrock/latest/userguide/agents.html)
- [Amazon Bedrock Guardrails](https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html)
- [Dify — Open-source LLM app development platform](https://dify.ai/)
- [AG2 — Community fork of AutoGen](https://github.com/ag2ai/ag2)
- [Google Research — Towards a Science of Scaling Agent Systems (arXiv 2512.08296)](https://arxiv.org/abs/2512.08296)
