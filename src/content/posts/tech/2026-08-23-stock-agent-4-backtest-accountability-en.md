---
title: "Building a Taiwan Stock Research Agent (Part 4): Backtest Accountability—Why Backtests Lie"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, langgraph, ai-agent, backtest, point-in-time, quant]
lang: en
tldr: "This project has one core rule: every LLM conclusion must first pass a historical backtest of the same signals. When expectancy is negative, synthesis cannot issue an optimistic verdict. Each of the four traps that make backtests lie has a programmatic countermeasure."
description: "Why do backtests look great while live trading loses money? This Taiwan stock research agent turns backtest accountability into system structure through causal factors, next-session-open entries, a Taiwan-specific cost model, non-overlapping positions, and small-sample warnings."
draft: false
glossary:
  - term: "point-in-time"
    definition: "The discipline of using only information that was available at the historical moment being evaluated, without future information."
  - term: "look-ahead bias"
    definition: "Bias caused when a backtest uses data that could not yet have been known when the signal occurred, inflating performance."
  - term: "expectancy"
    definition: "The average net return per trade after costs, a core measure of whether a strategy can survive."
  - term: "ATR"
    definition: "Average True Range, a technical indicator of recent volatility used here to set stop-loss distance."
---

> 🌏 [中文版](/posts/tech/2026-08-23-stock-agent-4-backtest-accountability)

> **Building a Taiwan Stock Research Agent (Part 4 of 9)**: [Previous: Tiered LLMs and the Fallback Chain](/posts/tech/2026-08-23-stock-agent-3-tiered-llm-fallback-en) ｜ [Next: Evaluation Methodology—Walk-Forward, Run Cards, and an Honest 50% Baseline](/posts/tech/2026-08-23-stock-agent-5-walkforward-eval-en) ｜ [Full table of contents in Part 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en)

“The backtest looks great, but live trading keeps losing money.” This joke is so old in quantitative finance that it has become an interview question. This article explains how I answer it in stock-research-agent. Instead of relying on slogans about discipline, the graph makes the backtest happen before the LLM writes its conclusion. Synthesis can only interpret backtest evidence that already exists; it cannot write a conclusion first and then find reasons to support it. By the end, you will know how the system blocks four of the most common backtest lies—and what it still honestly admits it cannot do.

The core idea appears in the README under “Why this project?” and serves as the project’s opening line: **A conclusion that history has not validated is an opinion, not research.**

## Four Traps That Make Backtests Lie—and Their Countermeasures

I will say this up front: I have fallen into every one of these traps. The README has a “Why backtests lie” table that pairs each of the four traps with an implementation-level response. Here they are in detail.

### 1. Look-Ahead Bias: You Cannot Use Tomorrow’s Newspaper to Make Today’s Decision

This is the most common trap and the hardest to notice. If a factor enters at the close on the signal day, it assumes that before the close you already knew both the closing price and a factor value calculated from the full day’s data. But the signal only becomes valid after the close, when that entry is no longer possible. Half a day may not sound like much, but repeated over time it can turn a losing strategy into a money printer in the backtest.

This project’s response is simple: **every factor is a causal series** that uses only data available on or before the signal day. Every close-based signal enters at the **next trading session’s open**. The entry session counts as holding day one, and the position exits at the close of session 20. This rule is not confined to the backtest engine. The golden eval, walk-forward evaluation, and reflection logic all use the same entry and exit rules, avoiding inconsistencies where each module tells a different story.

### 2. Ignoring Trading Costs: Profitable on Paper, Wiped Out in Production

Many high-turnover strategies make money on paper without fees or taxes, then turn negative as soon as real costs are deducted. Taiwan stocks also have their own cost structure, so a US equity model cannot simply be reused.

The project includes a Taiwan-specific cost model. Stocks incur a **1.425‰ commission on both buys and sells, plus a 3‰ securities transaction tax on sells**. Taiwan index futures instead incur a **0.002% transaction tax on both sides**, have no securities transaction tax, and use contract multipliers (TXF=200, MXF=50). Futures use a separate data source—the FinMind TaiwanFuturesDaily front-month contract. The stock backtest path was left unchanged: the cost models are separate, so adding futures does not contaminate stock backtests.

### 3. Double-Counting Overlapping Positions: Counting the Same Rally Twice

If another signal appears during a 20-day holding period, many naive backtests open another position. The same rally is then counted across multiple trades, inflating both the trade count and the win rate.

The solution is simple, but it must be enforced: **positions cannot overlap**. Any new signal during an active holding period is ignored. Walk-forward evaluation is stricter still. If a signal cannot complete its entire holding period inside the test window, the whole trade is excluded. Truncated tail trades do not count, so an incomplete trade cannot flatter end-of-window performance.

### 4. Small-Sample Overconfidence: An “80% Win Rate” from Five Trades Means Nothing

Results from fewer than 10 trades have almost no statistical significance, but putting a percentage in a report makes them look authoritative. This project responds by **raising an explicit warning whenever a backtest has fewer than 10 trades and lowering the decision’s confidence ceiling**. This is not a conscience clause hidden in documentation. It is a deterministic `build_decision` rule: when the sample is too small, confidence is capped no matter how attractive the signal looks.

## The Accountability Integration Point: When Expectancy Is Negative, the LLM Cannot Say Something Positive

Those four defenses constrain the backtest engine itself. The next layer determines how backtest results constrain what the LLM is allowed to say. This is the project’s sharpest design choice:

**The synthesis node is forbidden from issuing an optimistic verdict when expectancy is negative.** The backtest must also run before synthesis. LangGraph’s topology makes this order structural rather than a convention buried in a prompt. The technical → backtest → reflection chain completes, all six analysis branches finish their fan-in, and only then does synthesis receive its material. By the time the LLM enters, the table contains only structured evidence. It can interpret that evidence and adjust the tone, but it cannot invent reasons to endorse a signal with no historical support. Combined with the small-sample confidence cap, a case such as “strong signal, but only six trades” naturally produces a conservative verdict.

## ATR Price Policy: Keep the LLM Away from the Numbers

A direction such as buy, watch, or avoid is not enough; research reports usually also want a stop and a target price. This project answers with the `atr_2r_v1` price policy, implemented entirely in deterministic Python:

- **Only a `buy_candidate` receives price levels**: entry is at the next trading session’s open, the stop is two ATR away, and the target is 2R away.
- **ATR(14) uses only OHLC data from on or before the signal day**—another application of PIT discipline that does not peek at later volatility.
- The policy ID, signal date, reference price, ATR value, and reward-to-risk ratio are all written into `Decision.price_plan` and persisted with the decision.
- `watch` and `avoid` produce no executable price levels.

The result is that **the LLM can interpret these prices but cannot invent them**. Both the policy formula and its ID are persisted, so a historical run can later be recalculated under exactly the same rules. This follows the same principle as the number-citation guard in Part 6: move the answer to “where did this number come from?” out of the prompt and into the schema.

## Measured Results, with Disclaimers

The README’s measured baseline reports one research run on 2330 using two years of data. A backtest over the same factor signals produced **12 trades, a 67% win rate, 3.14% net expectancy, and a maximum drawdown of -8.4%**. Only one of the three new signals generated that day was active, so the verdict was `watch` with 0.47 confidence. That was not the model being cautious; signal strength, win rate, and expectancy did not all clear their thresholds.

These numbers must be read with their disclaimers. The price data came from Yahoo and was fetched retrospectively, so it is **not a PIT vintage snapshot**. Twelve trades are a small sample and do not show that the strategy will work in the future. A result from one stock over one period is not evidence of production performance. The project’s honesty shows in its refusal to guarantee even its own positive-expectancy result. The walk-forward baseline has -0.44% expectancy across eight OOS trades; the next article covers that more honest—and less attractive—number.

## Known Limitations: This Backtest Is Still Not the Real Market

An honest list must be complete. The current backtest explicitly does not model:

- **Slippage, bid-ask spread, failure to fill at price limits, or capacity**—costs use fixed rates.
- **Dividend cash flows** or broker-specific discounts.
- **Maximum drawdown calculated from daily mark-to-market equity**—it is calculated from the equity of closed trades, so unrealized gains and losses during a position are invisible.
- Daily high/low trigger testing for the ATR policy, order placement, position sizing, or a risk budget.

Yahoo’s adjusted history can change when fetched again. A run card’s hash can identify “this DataFrame,” but it cannot reconstruct a vendor data version that no longer exists.

## Overall

The one thing I learned is that **backtests lie not because backtesting is broken, but because we make it too easy for a backtest to tell a flattering story**. The answer is not a smarter model. It is a more stubborn structure: causal factors, next-open entries, real costs, no overlap, silence imposed on small samples, backtesting before narrative, and prices kept away from the LLM. Once those constraints are nailed into the graph and schema, every conclusion the agent produces has a chance to be auditable. Part 5 explains how walk-forward and golden eval test it even more rigorously.

---

## References

- [stock-research-agent (GitHub repository)](https://github.com/vincentxuu/stock-research-agent) — the “Why backtests lie” countermeasure table, measured baselines, and “Capabilities at a glance”
- [docs/architecture.md — single-run backtesting and known limitations](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md) — causal factors, next-open entries, the `atr_2r_v1` price policy, and unmodeled backtest elements
- [PLAN.md — M2 backtest accountability milestone](https://github.com/vincentxuu/stock-research-agent/blob/main/PLAN.md)
