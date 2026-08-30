---
title: "Building a Taiwan Stock Research Agent (Part 5): Walk-Forward Evaluation, Run Cards, and an Honest 50% Baseline"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, backtesting, walk-forward, eval, ai-agent]
lang: en
tldr: "I do not measure whether the agent ‘feels accurate.’ I freeze parameters in walk-forward OOS tests, record a hash of every input in run cards, and keep the honest 5/10 = 50% golden-eval baseline so the agent has to admit that it is not accurate yet."
description: "The three pillars of stock-research-agent evaluation: rolling walk-forward validation, SHA-256 run cards, a golden-eval baseline that gets only 5 of 10 cases right, and realized-return reflection—and why admitting inaccuracy is more valuable than pretending to be accurate."
draft: false
glossary:
  - term: "walk-forward"
    definition: "A rolling strategy-validation method that selects parameters using only a past training window, freezes them, and tests them on a future out-of-sample window before advancing again."
  - term: "point-in-time"
    definition: "Using only data available before a particular moment, without future data, to prevent cheating in a backtest."
  - term: "run card"
    definition: "A JSON record written after each evaluation run, containing parameters, per-fold results, a data hash, and warnings so the exact input dataset for the run can be identified."
  - term: "golden eval"
    definition: "An evaluation set built from fixed historical cutoffs that reruns decisions under consistent criteria and measures accuracy as a long-term baseline."
  - term: "run-card hash"
    definition: "A SHA-256 fingerprint of the input table for a run. It can identify the same dataset but cannot reconstruct a historical version that a third-party data source has since changed."
---

> 🌏 [中文版](/posts/tech/2026-08-23-stock-agent-5-walkforward-eval)

> **Building a Taiwan Stock Research Agent (Part 5 of 9)**: [Previous: Backtest Accountability—Why Backtests Lie](/posts/tech/2026-08-23-stock-agent-4-backtest-accountability-en) ｜ [Next: Making Every Number in an LLM Report Auditable](/posts/tech/2026-08-23-stock-agent-6-auditable-number-citations-en) ｜ [Full table of contents in Part 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en)

This article explains how the project measures itself: walk-forward validation, run card records, a golden-eval baseline, and realized-return reflection on past decisions. By the end, you will know why I put an unattractive result such as 5/10 = 50% on the first page of the README—and why I consider it the most valuable part of the project.

The previous article explained how a single backtest can be fooled by survivorship bias, ignored costs, and overfitting. But avoiding deception takes more than calculating costs correctly. You must answer a harder question: **How were the parameters selected?** If you choose the best-looking threshold across the entire historical period and then backtest it on that same period, that is not validation. It is archaeology.

## Walk-Forward: Parameters Can Only Live in the Time They Have Seen

I chose rolling walk-forward evaluation. The default configuration for `stock-agent walk-forward` is:

```text
|---- 252 交易 train ----|-- 63 日 test --|
         |---- train ----|-- test --|      step = 63 日
                ...
```

The score threshold is selected only inside the training window. Candidate values are `[15, 20, 25, 30, 35]`, and the selection criterion is **net expectancy per trade** in the training data after costs. Once selected, the threshold is frozen and applied to a non-overlapping out-of-sample test window. Test windows do not overlap; each fold advances by one test-window length.

There is also a small but critical detail: **a signal must complete its full holding period inside the fold**. A single-run backtest enters at the next open and exits at the close of the 20th future session. Any signal near the end of a test window whose holding period would extend beyond the fold is excluded. An incomplete trade with an unknown outcome cannot be used to pad the results. Truncated tail trades are never counted short—which means you are accountable only for trades that have fully played out.

One run on five years of 2330 data produced 15 folds, eight OOS trades, a 50% win rate, and -0.44% net expectancy per trade. Ugly? Yes. But that is the real result after freezing the parameters. Because the number of OOS trades is below 10, the run card automatically marks the statistics as unrepresentative. This is not me adding a verbal small-sample disclaimer; the program enforces it.

## Run Cards: Leave a Fingerprint Without Pretending You Can Travel Back in Time

Every walk-forward run creates a separate JSON file in `run_cards/` using schema v1. It records the configuration, train and test metrics for every fold, OOS trade dates, the data’s SHA-256 hash, and warnings.

The hash is itself an act of honesty. It can answer only one question: “Which DataFrame did this run use?” It **cannot** reconstruct adjusted history that Yahoo later serves differently. Dividend adjustments, ex-rights adjustments, and corporate actions can all change historical prices. Once Yahoo changes them, the hash I have can identify “what I saw at the time,” but not “what a new fetch returns today.” This is not a PIT (point-in-time) vintage snapshot. It is a boundary, and the run card states that boundary explicitly. A backtest system may not be able to avoid this limitation, but it should mark it instead of pretending that a hash makes the run replayable.

## Golden Eval: A 50% Baseline

The third pillar is the golden eval under `evals/`: 10 fixed historical cutoffs. Each case locks the symbol, `as_of`, and 20-session horizon. The decision side can see only data available on or before `as_of`; only the label side uses the realized net return from the next open to the horizon close. The `up/flat/down` labels use a ±2% band.

The current artifact contains 10 cases and gets five right: **50% accuracy**. All 10 labels match net returns recalculated from Yahoo prices. In plain language, the labels are clean, but my decisions are right only half the time.

The README calls this an “honest pre-improvement baseline, not a post-tuning performance claim.” Why publish something so self-incriminating? Because an agent that claims it “can help research stocks” but cannot produce an accuracy score at fixed historical cutoffs is merely a machine that writes convincing reports. A 50% result means: “I am not accurate yet, but I can measure myself with the same ruler.” That is far more valuable than “I feel useful.”

## Realized-Return Reflection: Evaluate Only Decisions That Have Matured

Every research run is written to `runs/` as a timestamped, append-only JSON file. Run the same symbol seven times in one day and you get seven files; nothing is overwritten. The Reflection node, on a later run of the same symbol, evaluates only past decisions that have accumulated **20 future trading sessions**. It enters at the next open and exits at the close of the 20th future session. The stock and 0050 use **exactly the same entry and exit dates and the same Taiwan trading costs**. The output contains the stock’s net return, 0050’s net return, alpha, and whether the original `buy_candidate/watch/avoid` was correct in both absolute-return and alpha terms.

Immature decisions are untouched. Missing benchmark dates and invalid logs are skipped, and every skipped item leaves a note. Reflection may **only calibrate confidence for the current run**. Neither prompts nor rules may treat it as “knowing more about the present future.” Reflection looks backward; it is not a predictor.

## Overall

These three mechanisms express the same philosophy: evaluation must be point-in-time and out-of-sample, must leave an auditable record, and must accept that **admitting the agent is not accurate yet is more valuable than pretending that it is**.

In the end, the biggest lesson had little to do with trading. When you design evaluation for an LLM agent, the hardest part is not writing the metric. It is forcing yourself to write “not representative” into the artifact, leave -0.44% in the README, and treat 50% as a starting point rather than a source of shame. Many agents show off good grades. Only an agent willing to pin a failing test to the wall has earned the right to talk about improvement.

The next article approaches the problem from another angle: how to ensure that every number in a report is auditable rather than invented by the LLM.

---

## References

- [vincentxuu/stock-research-agent GitHub repository](https://github.com/vincentxuu/stock-research-agent)
- [docs/architecture.md — walk-forward, golden eval, and realized-return reflection](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/architecture.md)
- [evals/golden_cases.jsonl](https://github.com/vincentxuu/stock-research-agent/blob/main/evals/golden_cases.jsonl)
