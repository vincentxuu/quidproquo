---
title: "Model Card: MiniMax M3.1 Flash"
date: 2026-10-20
category: daily
type: digest
tags: [ai-agent, model-release, daily, minimax, model-family-minimax]
lang: en
description: "MiniMax ships M3.1 Flash — a 428B MoE model, 1M context, $0.15/$0.60 pricing — topping its own comparison table on Automation-Bench, while independent testing flags a notably higher hallucination rate"
tldr: "MiniMax M3.1 Flash: 428B total parameters, ~23B active (MoE), 1M context window, $0.15 input / $0.60 output per 1M tokens, cache reads at just $0.015. In MiniMax's own comparison table it scores 62.2 on Automation-Bench v1.0.6, ahead of DeepSeek V4.1 Flash 1017 (60.5) and Claude Opus 5 (50.3), but trails on DeepSWE and Terminal Bench 4.0. VentureBeat, citing Artificial Analysis's AA-Omniscience benchmark, reports a notably higher hallucination rate; weights are due 2026-10-23 and the license is still undisclosed."
series:
  name: "AI Model Tracker"
  order: 53
glossary:
  - term: "MiniMax"
    def: "A Shanghai-based large language model company known for its M-series (M1→M3) agentic models and the Hailuo video generation model"
---

> 🌏 [中文版](/posts/daily/2026-10-20-model-minimax-m3-1-flash)

## Model Info

| Field | Value |
|---|---|
| Model ID | `MiniMax-M3.1-Flash` |
| Vendor | MiniMax |
| Parameters | 428B total, ~23B active (MoE; source: MiniMax's own product page) |
| Context Window | 1,000,000 tokens |
| Input Pricing (USD/1M tokens) | $0.15 |
| Output Pricing (USD/1M tokens) | $0.60 |
| Open Source | No (weights due 2026-10-23, license not yet disclosed) |
| Release Date | 2026-10-19 |
| Official Announcement | [MiniMax's official X post](https://x.com/MiniMax_AI/status/2112150867868541221) |
| HuggingFace | Not applicable (not yet open-weight) |
| Family | MiniMax M3.x |

## Key Capabilities

- On Automation-Bench v1.0.6 (enterprise automation tasks spanning sales, marketing, finance, and HR scenarios), M3.1 Flash scores 62.2 — the top score among every model in MiniMax's own comparison table, ahead of DeepSeek V4.1 Flash 1017 (60.5) and Claude Opus 5 (50.3)
- A 1M-token context window with text, image, and video input; cache reads cost just $0.015 per 1M tokens — a tenth of the input price — with no long-context surcharge, keeping the cost of repeatedly re-reading context in long sessions low
- MiniMax claims nearly 3x faster inference than predecessor MiniMax M3, with the weighted-average cost per agentic task dropping from $0.51 to $0.22
- Reasoning cannot be turned off — developers only choose among five effort levels (Low / Medium / High / Xhigh / Max), and MiniMax recommends Max as the default

## Benchmark Results

| Benchmark | Score | Predecessor | Best Competitor |
|---|---|---|---|
| Automation-Bench v1.0.6 | 62.2 | Not disclosed on the same suite | DeepSeek V4.1 Flash 1017: 60.5 |
| DeepSWE v1.1 | 73.7 | Not disclosed on the same suite | DeepSeek V4.1 Flash 1017: 77.0 (ahead) |
| Terminal Bench 4.0 | 38.1 | Not disclosed on the same suite | Claude Opus 5: 51.8 (well ahead) |
| BabyVision (with tools) | 91.0 | Not disclosed on the same suite | DeepSeek V4.1 Flash 1017: 92.5 |

⚠️ All four scores above are from MiniMax's own published comparison table; no independent party has reproduced them yet. MiniMax has not published a row-by-row comparison between M3.1 Flash and predecessor M3 on the same benchmark suite — only two aggregate claims: "nearly 3x faster inference" and "agentic task weighted-average cost down from $0.51 to $0.22 per task."

## Compared to Predecessors and Competitors

Against predecessor MiniMax M3, M3.1 Flash's gains show up mainly in price rather than benchmark scores: per-token pricing is half of M3's (M3 runs $0.30/$1.20 up to 512K context, doubling beyond that), and the weighted-average cost per agentic task fell from $0.51 to $0.22. But MiniMax hasn't disclosed a row-by-row comparison of agent benchmarks like Automation-Bench or DeepSWE between the two generations, so "3x faster, 70% cheaper" currently reads as an aggregate vendor claim rather than an item-by-item verified upgrade.

Against competitors, M3.1 Flash only wins outright on Automation-Bench, the enterprise-automation benchmark, beating every model tested including Claude Opus 5. On DeepSWE (coding agents) and Terminal Bench 4.0 (terminal operation), it trails DeepSeek V4.1 Flash 1017, and Terminal Bench in particular shows a wide gap against Claude Opus 5's 51.8 (M3.1 Flash: 38.1, a 13.7-point gap). On price, M3.1 Flash ($0.15/$0.60) undercuts DeepSeek V4.1 Flash 1017 — but the latter is MIT-licensed and open-weight, with self-hosting costs approaching zero. MiniMax is betting on "metered API, priced as low as possible per token," while DeepSeek bets on "give the weights away entirely" — the two aren't really competing on the same axis.

The more interesting gap is between independent tests: VentureBeat, citing Artificial Analysis's AA-Omniscience benchmark, reports that because M3.1 Flash attempts to answer almost every question rather than abstaining, its hallucination rate under that benchmark's definition reaches 93%. Yet in a separate factual-accuracy test from The New Stack, M3.1 Flash answered 56% of factual questions correctly — ahead of DeepSeek V4.1 Flash's 43% on the same test set. The two results point in opposite directions, which says more about how unstandardized "hallucination rate" measurement still is than it does about either model — and notably, MiniMax's own comparison table contains no reliability or hallucination metric at all.

## What This Means for Agent Development

The combination of 1M context, native multimodality (text/image/video), and cache reads priced at a tenth of input is attractive for long-running enterprise automation agents — the kind of sales/marketing/finance/HR workflows Automation-Bench measures. If you're building a CoWork-style agent that repeatedly re-reads the same context over long sessions, M3.1 Flash's cost structure is worth evaluating.

If you're building a coding agent or one that operates a terminal: DeepSWE, Terminal Bench 4.0, and SWE Refactor scores all trail DeepSeek V4.1 Flash 1017 and Claude Opus 5, with the Terminal Bench gap especially wide — M3.1 Flash isn't a good fit as the backbone model for a coding or terminal agent right now.

Not a good fit: reasoning can't be disabled, so simple, low-latency tasks (single-turn Q&A, quick customer-support replies) don't pencil out — there's a token and latency floor regardless of task complexity. And given the elevated hallucination rate VentureBeat/Artificial Analysis measured, it's not a good candidate for unsupervised, low-fault-tolerance agent pipelines (cybersecurity, automated disbursement, and similar high-stakes automation) — at minimum, wait until the weights ship on 10/23 and the license is clear, and let independent evaluators run a fresh pass first.

## Today's Insight

I used to assume "high vendor benchmark scores plus low pricing" meant a model was ready for production. The MiniMax M3.1 Flash case is a reminder that vendor comparison tables carry zero hallucination or reliability metrics — it took an independent evaluator approaching the problem from a completely different angle (AA-Omniscience, which tests whether a model abstains under uncertainty) to surface that dimension at all. And different testing outfits don't even agree on what "hallucination rate" means — they can reach opposite conclusions (The New Stack's factual-accuracy test actually put M3.1 Flash ahead). Beyond a new model's official comparison table, it's worth specifically checking whether any independent party has tested reliability — benchmark scores and pricing alone aren't enough.

## References

- [MiniMax M3.1 Flash product page](https://agent.minimax.io/tools/m3.1-flash)
- [MarkTechPost: MiniMax Just Launched M3.1 Flash](https://www.marktechpost.com/2026/10/19/minimax-m3-1-flash-release/)
- [CellCog: MiniMax M3.1 Flash — Price, Benchmarks, Space Bunny](https://cellcog.ai/blog/minimax-m3-1-flash/)
- [Tech Insider: MiniMax M3.1 Flash — 70% Cheaper, Accuracy Doubts](https://tech-insider.org/minimax-m3-1-flash-hallucination-accuracy-2026/)
- [MiniMax's official X post](https://x.com/MiniMax_AI/status/2112150867868541221)
