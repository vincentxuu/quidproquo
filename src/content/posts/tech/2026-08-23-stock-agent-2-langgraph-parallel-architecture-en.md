---
title: "Building a Taiwan Stock Research Agent (Part 2): LangGraph Parallel Architecture—Five Analysts Working at Once"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, multi-agent, python, architecture]
lang: en
tldr: "Five analysts fan out in parallel within one superstep, so latency is max rather than sum; backtesting and reflection stand before synthesis, restricting the LLM to explaining evidence that already exists."
description: "A teardown of the stock-research-agent LangGraph topology: parallel fan-out, the fan-in barrier, typed state reducers, and why backtesting must precede synthesis."
draft: false
glossary:
  - term: "superstep"
    definition: "One LangGraph execution step. Nodes within the same step run in parallel; the next step waits until all of them finish."
  - term: "fan-in"
    definition: "A convergence point, or barrier, that waits for multiple parallel branches to finish before execution continues."
  - term: "reducer"
    definition: "A function that decides how to merge writes to the same state field from parallel nodes, such as appending values."
  - term: "point-in-time"
    definition: "Answering a historical question with only the data visible at that time, without using information known afterward."
---

> 🌏 [中文版](/posts/tech/2026-08-23-stock-agent-2-langgraph-parallel-architecture)

> **Building a Taiwan Stock Research Agent (Part 2 of 9):** [Previous: Why Taiwan Needs Its Own Research Agent](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en) ｜ [Next: Tiered LLMs and a Degradation Chain](/posts/tech/2026-08-23-stock-agent-3-tiered-llm-fallback-en) ｜ [Complete contents in Part 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en)

This article covers the skeleton of the entire agent: what the graph looks like, why the analysts run in parallel, and why backtesting must come before synthesis. By the end, you will have a topology diagram you can copy directly and a criterion for deciding when LangGraph is worthwhile and when a hand-written loop is enough.

## Graph topology

Start with the diagram from the README:

```text
supervisor ─▶ planning ─┬─▶ technical ──▶ backtest ──▶ reflection ─┐
                        ├─▶ sentiment ──────────────────┼─▶ synthesis ─▶ evaluation_gate ─┬─▶ report
                        ├─▶ chips ──────────────────────┤  (counter-args)   (8 hard gates, │
                        ├─▶ events ─────────────────────┘                    fail-closed)  ▼
                        └─▶ documents (external fetch only if the approved plan asks)   approval_gate
```

Several details matter.

First, `supervisor` is currently a fixed dispatcher, not an LLM router. The `planning` node first constructs a schema-valid `ResearchPlan`. The supervisor then returns the same set of analysts every time: technical, sentiment, fundamental, chips, and events, plus a documents node that fetches externally only when the approved plan calls for it. These six branches fan out in **the same superstep**.

Second, parallelism is about latency. Five analysts and documents start at once, making the duration of this section `max()` rather than `sum()`. This is a structural advantage over TradingAgents' sequential analyst chain, where analysts run one after another—as you can verify directly in its `graph/setup.py`. Sentiment classification and a FinMind fundamentals fetch have no dependency on each other within one research request. Running them sequentially simply wastes time.

Parallelism also offers a less-discussed benefit: finer-grained tolerance of partial failures. Each dataset in `fundamental` and `chips` may fail independently; the error degrades into report notes while the other branches finish normally. In a sequential chain, one upstream FinMind timeout can block the entire pipeline. After fan-out, each branch's failure affects only its own cell of evidence. This reflects the project's broader degradation philosophy: degrade when data or a provider fails instead of turning an entire research run into an all-or-nothing event.

Third, the technical branch has two additional nodes: `backtest` replays the same factor score, while `reflection` uses matured past decisions to calculate realized returns for the individual stock versus 0050. The fan-in edge then waits until **all six branches**—reflection, sentiment, fundamental, chips, events, and documents—have finished before allowing `synthesis` to proceed.

## Why backtesting must precede synthesis

This is the most important edge in the architecture. If the LLM writes a conclusion first, it begins finding reasons to support that conclusion—a common failure mode in LLM research reports. Putting backtest and reflection before synthesis reverses the causality. The prompt that reaches the LLM already contains structured evidence: how many times this signal set actually fired in the past, its expected value, and its win rate. The LLM's only remaining job is to explain that evidence, not invent it.

Moreover, `build_decision` itself is deterministic Python. It combines the technical score, win rate, expected value, sentiment, investor positioning, and fundamentals to calculate direction and confidence. Confidence is capped when the backtest sample is too small. A result can become `buy_candidate` only if signal strength, win rate, and positive expected value all pass their gates. The synthesis LLM writes a Traditional Chinese summary and counterarguments, but **cannot rewrite direction**. The LLM executes the narrative; it does not make the decision.

## Typed state and reducers

How does the system handle six branches writing back to the same `ResearchState` in parallel? Each analyst writes to its own independent field, represented by a Pydantic model, so their outputs do not overwrite one another. Only fields to which every branch may add, such as `llm_calls` and `errors`, use reducers. Each parallel node appends its own entry, and LangGraph gathers them at the join. This essentially eliminates the two easiest bugs to introduce in hand-written parallel code: incorrect join counts and state merging after partial failures.

## Why not write a loop from scratch?

The architecture document answers this directly. The graph has an explicit parallel fan-out, a dependent chain (`technical→backtest→reflection`), and a fan-in barrier. LangGraph provides those scheduling semantics and typed-state reducers, saving the work of implementing futures and join counting. More importantly, **graph topology turns “backtesting must happen before synthesis” into structure instead of an agreement written in a prompt**. A model can ignore a prompt that says, “Please consider the backtest results first.” It cannot ignore a graph edge.

This is the gap between a typical LLM-agent tutorial and a production system: tutorials put constraints in prompts; production systems put them in flowcharts and types. A prompt is a request. A graph edge is enforcement.

The framework does not guarantee research quality, however. Point-in-time data, the cost model, artifact schemas, provider fallbacks, and error degradation are all outside LangGraph's remit and are implemented by the project itself. Conversely, if your workflow consists of one LLM and a few sequential tools, a custom loop is simpler. A six-branch fan-out/fan-in is the scale at which the cost of adding the framework becomes justified.

## Overall

The central idea of this architecture is not “let many LLMs debate each other.” It is to **make programmatic data and replayable backtests constrain the final research narrative**. Parallelism is a welcome speed bonus. The real design effort went into the fan-in barrier before synthesis and the boundary that keeps the LLM away from the deterministic decision. The next article covers the LLM layers: tiered models, the provider fallback chain, and how the system still produces a report without an LLM.

---

## References

- [stock-research-agent — GitHub repository (the README's “How it works” section)](https://github.com/vincentxuu/stock-research-agent)
- [docs/architecture.md — agents and graph, and “Why LangGraph instead of a custom loop?”](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [Official LangGraph documentation](https://langchain-ai.github.io/langgraph/)
- [TradingAgents — the sequential multi-agent architecture used for comparison](https://github.com/TauricResearch/TradingAgents)
