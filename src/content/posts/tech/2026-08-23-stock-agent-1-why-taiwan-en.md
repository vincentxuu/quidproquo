---
title: "Building a Taiwan Stock Research Agent (Part 1): Why Taiwan Needs Its Own Research Agent"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, taiwan-stock, backtest, llm]
lang: en
tldr: "US-stock LLM agents have attracted nearly 100,000 GitHub stars, yet no Taiwan-stock project has even passed 10. I consolidated three side projects into a Taiwan-stock research agent where every conclusion must first survive a backtest; this article explains why."
description: "Why I am building an LLM research agent specifically for Taiwan stocks: the gap left by TradingAgents, the convergence of three side projects, and the core premise of backtest accountability."
draft: false
glossary:
  - term: "point-in-time"
    definition: "Making and validating decisions using only data available when the signal occurred, with no future data (PIT)."
  - term: "backtest accountability"
    definition: "Every LLM conclusion must first pass a historical backtest of the same signals; the system cannot issue an optimistic conclusion when expected value is negative."
  - term: "golden eval"
    definition: "A benchmark set with correct answers labeled at fixed historical cutoffs, used to measure agent output quality."
---

> 🌏 [中文版](/posts/tech/2026-08-23-stock-agent-1-why-taiwan)

> **Building a Taiwan Stock Research Agent (Part 1 of 9):** The beginning of the series ｜ [Next: LangGraph Parallel Architecture—Five Analysts Working at Once](/posts/tech/2026-08-23-stock-agent-2-langgraph-parallel-architecture-en) ｜ The complete table of contents appears below

[stock-research-agent](https://github.com/vincentxuu/stock-research-agent) is an open-source project I am building and still evolving: a LangGraph-orchestrated, multi-analyst research system for Taiwan stocks. It has one core rule—every LLM conclusion must pass a historical backtest of the same signals before it can enter the report. This first article explains why I chose Taiwan stocks, why I was in a position to build it, and where that rule came from. By the end, you will have a comparative GitHub survey as of August 22, 2026, an account of how three side projects converged into one agent, and the project's current, honestly rather unattractive baseline numbers.

## The US-stock space is crowded; Taiwan is wide open

Start with the numbers (a GitHub API snapshot from August 22, 2026; the full comparison is in `docs/similar-projects.md` in the repository):

- **TradingAgents** (TauricResearch): 99,207 stars. Its LangGraph multi-analyst design and Bull/Bear debate have made it the de facto standard in this field.
- **ai-hedge-fund** (virattt): 62,986 stars, with persona agents and mandate configuration files.
- **Vibe-Trading** (HKUDS): 31,432 stars, with the strongest emphasis on backtest validation among these toolkits.
- Localized forks for the Chinese market have already demonstrated demand: TradingAgents-CN has 31,305 stars and TradingAgents-astock has 3,051. The latter even adds three roles specialized for A-shares—a policy analyst, a hot-money tracker, and a lockup-expiration monitor—because those roles reflect the market's pricing structure.

Then I searched for “Taiwan stocks + agent / LLM”: **not a single Taiwan-stock LLM agent project on all of GitHub had more than 10 stars**. The leader was CasualTrader, a real-time simulated trading platform, with 9 stars; several other attempts had 2 or 0. Taiwanese developer jason8745 split analysis and backtesting across two repositories, llm-stock-team-analyzer and llm-agent-trader. No one had built “multi-agent research → backtest validation” as one closed loop.

That gap is not an accident. The depth of Taiwan's market lies where generic frameworks cannot reach: institutional investor flows, margin trading and short selling, disposition and attention-stock rules, the 10% daily price limit and same-day trading rules, and the cadence of monthly revenue announcements. Yahoo Finance's `.TW` suffix gives you candlesticks, but not investor positioning. A-share forks have shown that deeply adapting a generic framework to one local market is itself a valuable contribution. Taiwan stocks simply had not received that treatment yet.

## Three side projects converge

This project did not begin from scratch. It consolidates three unfinished side projects into the agent's tool layer:

```text
swing-screener（台股多因子技術評分）──▶ tools/indicators.py
threads-scraper（Threads 輿情抓取）──▶ tools/sentiment.py
pool / Signal Lottery（自寫回測引擎）──▶ tools/backtest.py
```

Each tool was only a toy on its own: the screener produced scores but could not explain why today mattered; the scraper collected sentiment but did not know how it related to price; the backtest engine could run, but had no thesis to test. The LLM agent is the glue that turns these tools into “research.” A supervisor dispatches technical, sentiment, investor-positioning, and event analysts in parallel, with each analyst backed by these existing programmatic snapshots. It does not call more LLMs merely for the sake of being “multi-agent.”

## Core premise: an untested conclusion is an opinion, not research

A classic quantitative-finance interview question asks, “Why does a backtest look beautiful while live trading loses money?” Most people can recite the standard answers: look-ahead bias, ignored costs, and inflated results from overlapping positions. LLM agents add another layer to the problem: an LLM can generate a conclusion that no data has ever validated, deliver it with extraordinary persuasiveness, and sound more certain than a real analyst.

This project's core premise is therefore:

> **Every LLM conclusion must first pass a historical backtest of the same signals. A conclusion that history has not validated is an opinion, not research.**

In practice, technical signals are replayed point-in-time before synthesis, using causal factors, next-day-open entries, and a built-in Taiwan-market cost model: 1.425‰ commission × 2 plus 3‰ securities transaction tax on the sale. **When expected value is negative, synthesis is structurally forbidden from issuing an optimistic conclusion.** This is not a soft suggestion in a prompt; the architecture enforces it. That is also the key difference from TradingAgents. Its README explicitly says to “treat the framework as a research scaffold,” its repository contains no backtesting module, and its only feedback loop is to fetch realized returns and write a reflection the next time it analyzes the same stock. TradingAgents produces an output after the debate; my system still has to pass the backtest gate.

## The project's honest state today

No pretending. Milestones M0–M4 are complete; M5 (research plan plus human review loop) and M7 (the research-to-paper execution boundary) are in progress. Here are the numbers recorded candidly in the repository's documentation:

- **One measured research run** (2330, two years of data): 12 backtest trades on the same factor signals, a 67% win rate, and 3.14% expected value per trade after costs. Only 1 of 3 signals fired that day, so the conclusion was `watch` with 0.47 confidence. The sample is small and cannot be extrapolated directly.
- **Golden eval baseline** (10 historical Taiwan-stock cutoffs): **5/10—only half**. This is an honest pre-improvement baseline, not a performance claim after tuning. All 10 static labels matched prices recomputed from Yahoo data, so at least the labels themselves were sound.
- **Walk-forward baseline** (2330, five years): 15 folds, only 8 out-of-sample trades, a 50% win rate, and **-0.44%** expected value per trade after costs. With fewer than 10 trades, the run card marks the result as “not statistically representative.”

One data caveat belongs up front: market prices are re-downloaded from Yahoo after the fact; they are **not point-in-time vintage snapshots**. The entire project is for research and education only and does not constitute investment advice. These figures document the source code and files currently observable in the repository. They are not performance promises of any kind.

## Overall

The lesson is simple: choosing a niche matters more than piling on features, and in the LLM-agent field, verifiability is scarcer than eloquence. Authors of US-market frameworks have pushed orchestration, debate, and memory extremely far. But combining “what the LLM says” and “what market data validates” in one pipeline—together with Taiwan-specific positioning and regulatory data—happens to occupy an open space for which I already had three tools. The next eight articles each unpack one subsystem in that closed loop.

## Series contents

1. **This article:** [Why Taiwan Needs Its Own Research Agent](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en)
2. [LangGraph Parallel Architecture: Five Analysts Working at Once](/posts/tech/2026-08-23-stock-agent-2-langgraph-parallel-architecture-en)
3. [Tiered LLMs and a Degradation Chain: API, Local CLI, and Dictionary Fallbacks](/posts/tech/2026-08-23-stock-agent-3-tiered-llm-fallback-en)
4. [Backtest Accountability: Why Backtests Lie](/posts/tech/2026-08-23-stock-agent-4-backtest-accountability-en)
5. [Evaluation Methodology: Walk-Forward Tests, Run Cards, and an Honest 50% Baseline](/posts/tech/2026-08-23-stock-agent-5-walkforward-eval-en)
6. [Making Every Number in an LLM Report Auditable](/posts/tech/2026-08-23-stock-agent-6-auditable-number-citations-en)
7. [The Copilot Loop: Plan Contracts, Verifiable Sources, and Human Review](/posts/tech/2026-08-23-stock-agent-7-research-plan-review-loop-en)
8. [The Boundary from Research to Simulated Orders: Content-Addressed Execution Contracts](/posts/tech/2026-08-23-stock-agent-8-execution-contracts-en)
9. [Deployment Boundaries: A Public API from Docker to Cloudflare Containers](/posts/tech/2026-08-23-stock-agent-9-cloudflare-deployment-en)

---

## References

- [vincentxuu/stock-research-agent (GitHub repository)](https://github.com/vincentxuu/stock-research-agent)
- [docs/similar-projects.md: comparison of similar open-source projects (snapshot from August 22, 2026)](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/similar-projects.md)
- [TauricResearch/TradingAgents (the 99k-star comparison)](https://github.com/TauricResearch/TradingAgents)
- [stock-research-agent architecture document: docs/architecture.md](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
