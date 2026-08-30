---
title: "Building a Taiwan Stock Research Agent (Part 3): Tiered LLMs and a Degradation Chain—API, Local CLI, and Dictionary Fallbacks"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, llm-ops, cost-control, observability]
lang: en
tldr: "Only two roles call an LLM; every other analyst remains fully programmatic. Each call follows an Anthropic API → local Claude CLI → rules-based degradation chain, and cost accounting trusts only provider-reported values—unknown cost is never treated as $0."
description: "The Taiwan-stock research agent's tiered LLM design: why only one of five analysts calls an LLM, how its three-level provider fallback works, and how to track cost without deceiving yourself."
draft: false
glossary:
  - term: "role"
    definition: "A logical role for an LLM call (analyst / synthesis), each bound to a default model and purpose."
  - term: "provider chain"
    definition: "A sequence in which one logical call tries multiple LLM providers, degrading to the next level after a failure."
  - term: "sanitized trace"
    definition: "A call record written to a local artifact that retains only the role, model, latency, tokens, and cost, excluding the prompt, error message, and credentials."
---

> 🌏 [中文版](/posts/tech/2026-08-23-stock-agent-3-tiered-llm-fallback)

> **Building a Taiwan Stock Research Agent (Part 3 of 9):** [Previous: LangGraph Parallel Architecture—Five Analysts Working at Once](/posts/tech/2026-08-23-stock-agent-2-langgraph-parallel-architecture-en) ｜ [Next: Why Backtests Lie](/posts/tech/2026-08-23-stock-agent-4-backtest-accountability-en) ｜ [Complete contents in Part 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en)

This article documents how my open-source stock-research-agent project manages LLM calls: which nodes warrant an LLM, what degradation chain those calls follow, and how the system accounts for cost. By the end, you will know how a “multi-agent” system can burn fewer tokens and why I record “unknown cost” separately from “free.”

## Do not burn more tokens just to be “multi-agent”

Many multi-agent projects start with the assumption that every analyst is an LLM: let them debate one another, then have one final LLM summarize the result. I deliberately chose a different design. The architecture document says it plainly: the system's core is not multiple LLMs debating each other, but programmatic data and replayable backtests constraining the final research narrative.

There are therefore only two roles:

- `analyst` (default: `claude-haiku-4-5`): currently used only for sentiment classification, batching Threads posts into fixed labels. A cheaper model is enough because this is a narrow classification task.
- `synthesis` (default: `claude-sonnet-5`): writes the final report. It must organize structured evidence from backtesting, fundamentals, investor positioning, and events into a Traditional Chinese narrative with counterarguments, so this is where I am willing to use a better model.

technical, fundamental, chips, events, backtest, and reflection never call an LLM. Python calculates the technical score, the backtest comes from replay, and reflection calculates realized returns. Asking an LLM to do these jobs would be both more expensive and less trustworthy. The LLM's role in this system is to “explain evidence that already exists,” not “generate evidence.”

## One provider chain, traversed independently by every call

Each logical call tries three levels in order:

1. If `ANTHROPIC_API_KEY` is present, call the Anthropic API.
2. If the API is not configured or fails, use the local Claude Code CLI when `claude` is available.
3. If neither works, degrade: sentiment switches to dictionary classification, while synthesis switches to a rules-based template.

```bash
# 強制走離線路徑，analyst/synthesis 一律標 disabled
STOCK_AGENT_NO_LLM=1 uv run stock-agent research 2330
```

Model selection also follows an explicit order of precedence: the `--analyst-model` / `--synthesis-model` CLI flags → the `STOCK_AGENT_ANALYST_MODEL` / `STOCK_AGENT_SYNTHESIS_MODEL` environment variables → the backward-compatible `STOCK_AGENT_MODEL` → the role default. Old settings on CI or another person's machine do not suddenly break, while I can still change models by touching only one layer.

One detail of the CLI layer is worth calling out. `claude` runs in print/JSON mode from a temporary directory, with tools, session persistence, user settings, and MCP servers all disabled; its system prompt is also replaced with one intended solely for plain-text generation. This is not a sandbox—the documentation explicitly states that the CLI remains an external executable and remote-model boundary—but it at least minimizes the scope in which the CLI might casually read my workspace or invoke tools on its own.

For degradation semantics, I insist on one rule: provider exceptions, timeouts, empty output, and skips all become sanitized attempts. The trace never contains exception messages, stderr, or credentials, and a failed provider never pretends to have succeeded. The artifact records which provider and model ultimately completed the call.

## Cost discipline: unknown cost is not $0

Each `LLMCall` trace records the role, purpose, configured model, provider-reported model, final status, latency, input/output/cache tokens, provider-reported USD cost, and the provider attempts in order. The command `stock-agent trace <run.json>` displays this information in the terminal.

The accounting rule is strict: **do not maintain a locally estimated pricing table**. Sum only the `cost_usd` values explicitly reported by providers. An aggregate has one of four states:

- `complete`: every successful call reports a cost.
- `partial`: some report a cost; others are unknown.
- `unknown`: successful calls occurred, but none report a cost.
- `not_applicable`: there was no successful LLM call.

Why be so particular? “Look up a price table and calculate it yourself” sounds reasonable, but model aliases, cache-billing rules, and plan discounts can change at any time. An estimated figure can be worse than no figure because it gives you a neat but incorrect total in the report. Unknown is an honest state. $0 is a hallucination.

Here is one measured sample from August 22, 2026: a default run for 2330. No sentiment posts were available that day, so only the synthesis call occurred. The provider was the Claude CLI, the model was `claude-sonnet-5`, latency was 36.387s, usage was 2 input tokens + 1,419 cache-creation tokens + 2,151 output tokens, and the provider reported a total cost of **US$0.029088**. This is one execution sample, not a fixed pricing promise. The API-adapter path currently obtains usage but does not calculate prices itself, so cost may be unknown when using the API. It does establish the rough order of magnitude: under this tiered design, one complete research run costs cents, not dollars.

## Langfuse: an optional post-hoc export

Langfuse is an optional post-hoc exporter in this project, not an SDK embedded in the hot path. If `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` are configured—with `LANGFUSE_BASE_URL` added for a self-hosted service—the system exports once after the graph finishes and before writing the local artifact. If they are absent, nothing else is affected; it simply records `credentials_missing`.

The export includes only sanitized metadata: symbol, direction, role, provider, model, status, latency, usage, and cost completeness. It sends **no prompt, complete report, provider error message, or credentials**. Posts and report contents should not leave the machine in the first place. Before exporting, the system performs a blocking `auth_check` to validate credentials and records `auth_failed` on failure. Import, connection, or export exceptions are recorded only as `export_error` plus the exception type. No observability failure is allowed to fail the research run. Observability is a bonus; the research itself is what matters. There is currently no LangSmith exporter, and I do not plan to build one.

## Overall / lessons learned

This tiering taught me three things. First, “multi-agent” does not mean “many LLM calls.” Restricting the LLM to the two places that genuinely need language capabilities—classifying sentiment and organizing a narrative—improves both cost and trustworthiness. Second, a fallback chain should descend all the way to a report that needs no LLM at all: dictionary plus rules-based template. In public deployments, I even set `STOCK_AGENT_NO_LLM=1` directly to prevent accidental spending. Third, honest cost and observability boundaries matter. Unknown means unknown; do not put estimated numbers in the ledger, and do not let a broken observability system take down the main workflow. These are dull engineering decisions, and that is precisely the point.

---

## References

- [vincentxuu/stock-research-agent — GitHub](https://github.com/vincentxuu/stock-research-agent)
- [docs/architecture.md — tiered LLMs and fallback / observability and cost](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [README — LLM trace and per-run cost](https://github.com/vincentxuu/stock-research-agent#llm-trace-and-per-run-cost)
- [Langfuse documentation](https://langfuse.com/docs)
