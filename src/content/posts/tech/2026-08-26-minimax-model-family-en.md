---
title: "MiniMax: The Chat App Company That Built a Coding Model to Rival Frontier Labs"
date: 2026-08-26
category: tech
type: deep-dive
tags: [open-source, moe, code-model, benchmark, pricing, china-ai, agentic-coding]
lang: en
series:
  name: "AI 模型家族"
  order: 14
tldr: "MiniMax started as a consumer chat app company, then M2.5 scored 80.2% on SWE-bench Verified at 1/10-1/20 the cost of Claude Opus; M3 (456B total / 45.9B active) became the first open-weight model to clear 59% on SWE-bench Pro, with 1M context powered by their novel Sparse Attention mechanism."
description: "A deep dive into the MiniMax model family: the consumer-AI-to-coding-frontier pivot, M2.5/M2.7/M3 specs and benchmarks, MiniMax Sparse Attention explained, pricing strategy, and where it fits in the open-source ecosystem."
draft: false
glossary:
  - term: "MoE"
    def: "Mixture of Experts — a model architecture with multiple parameter groups where only a subset activates per token, balancing capability and efficiency"
  - term: "MSA"
    def: "MiniMax Sparse Attention — MiniMax's proprietary sparse attention mechanism that replaces full attention with KV-block selection, reducing long-context inference cost to ~1/20th"
  - term: "SWE-bench"
    def: "Software Engineering Benchmark — a standardized test that measures a model's ability to solve real GitHub issues"
---

> 🌏 [中文版](/posts/tech/2026-08-26-minimax-model-family)

MiniMax didn't start as a model company. It built character chat apps ([Talkie](https://www.talkie-ai.com/)) and video generation tools ([Hailuo AI](https://hailuoai.video/)), earning its spot as one of China's "Six AI Tigers." Then in February 2026, its M2.5 scored 80.2% on [SWE-bench Verified](https://www.swebench.com/) — just 0.6 points behind Claude Opus 4.6 at the time — at one-tenth to one-twentieth the API price. Here's how a chat app company ended up on the coding frontier.

## Company Background

MiniMax was founded in December 2021 in Shanghai by Yan Junjie, formerly of SenseTime's computer vision team. The name comes from the [Minimax algorithm](https://en.wikipedia.org/wiki/Minimax) — making optimal decisions by accounting for the opponent's best response.

As of 2025, the company has about 415 employees, revenue of roughly $79 million, and is still unprofitable (operating loss of $1.87 billion). Funding milestones: $600M led by Alibaba in March 2024 ($2.5B valuation), HKEX IPO in January 2026, and another $2B raise in July 2026.

Why would a consumer AI company build coding models? MiniMax's logic: to make AI products (chat, roleplay, video) truly good, the underlying model needs strong reasoning and tool-use capabilities. Coding ability is the foundation of agentic ability — models that write code well tend to use tools well.

## Model Family

| Model | Released | Architecture | Total Params | Active/Token | Context | Highlight |
|---|---|---|---|---|---|---|
| M2.5 | 2026-02 | MoE | ~229B | Undisclosed | — | SWE-bench 80.2%, price/perf benchmark |
| M2.5-Lightning | 2026-02 | MoE | ~229B | Undisclosed | — | 2× throughput (100 tok/s) |
| M2.7 | 2026-03 | MoE | — | ~10B | — | Ultra-efficient, SWE-bench 78% |
| M3 | 2026-06 | MoE + MSA | 456B | 45.9B | 1M | Open-weight flagship |

### M2.5: The Price/Performance Story

M2.5's story isn't about having the highest score — it's about **how little it costs to get that score**.

| Metric | M2.5 | Claude Opus 4.6 (contemporary) |
|---|---|---|
| SWE-bench Verified | 80.2% | 80.8% |
| API price (input / output) | $0.15 / $1.20 per M tokens | ~$15 / $75 per M tokens |
| Price gap | — | ~10-60× |

Per MiniMax's official claims, "$1 runs continuously for 1 hour at 100 tok/s." Four M2.5 instances running 24/7 for a year cost roughly $10,000.

During training, M2.5 exhibited an interesting **emergent behavior**: the model spontaneously writes architecture specs before coding (a "spec-writing tendency"). This wasn't engineered — it appeared naturally through extensive RL training.

### M3: The Technical Leap

M3 is MiniMax's largest model and their technical flagship.

Per MiniMax's official technical report, M3's core innovation is **MiniMax Sparse Attention (MSA)**: it replaces full attention computation with KV-block selection, reducing per-token compute at long contexts to roughly 1/20th of the previous generation. This makes a 1M context window economically feasible.

M3 is also a natively multimodal model, accepting text, image, and video inputs.

## Benchmark Comparison

All data from official MiniMax releases.

### M2.5 vs Contemporary Competitors

| Benchmark | M2.5 | Claude Opus 4.6 |
|---|---|---|
| SWE-bench Verified | **80.2%** | 80.8% |
| Multi-SWE-Bench | **51.3%** | — |
| BrowseComp (with context mgmt) | **76.3%** | — |

M2.5 trailed Opus 4.6 by just 0.6 percentage points, at an order-of-magnitude lower cost.

### M3 vs Open/Closed Flagships

| Benchmark | M3 | GPT-5.5 | Ornith 1.5-397B |
|---|---|---|---|
| SWE-bench Pro | **59.0%** | 58.6% | — |
| GPQA Diamond | **92.9%** | — | 92.8 |
| HLE | **39.0%** | — | 44.6 |

M3 was the first open-weight model to surpass GPT-5.5 on SWE-bench Pro. Compared to fellow MoE model [Ornith 1.5-397B](/posts/tech/2026-08-26-ornith-deepreinforce-model-family), the two trade blows on GPQA Diamond but take entirely different technical paths: Ornith uses self-improvement RL, while MiniMax uses massive-scale environment RL.

### M2.7: The Overlooked Efficiency Play

M2.7 deserves a mention: activating only ~10B parameters per token, it scores 78% on SWE-bench Verified — in the same range as Ornith 1.5-35B-A3B's 79%, though with higher activation (10B vs 3B). Both are competing on the same "use MoE to minimize inference cost" track.

## Training Methodology

MiniMax's RL training takes a different path from Ornith's self-improvement loop.

Per MiniMax's official documentation, M2.5 was trained via RL across "over 200,000 complex real-world environments" spanning 10+ languages. These aren't synthetic exercises — they're environments extracted from real software projects where the model attempts to solve problems, with success or failure as the reward signal.

M3 introduces an **interactive user-simulator framework**: it trains collaborative abilities through multi-turn dialogue scenarios using simulated users. Unlike most coding models that train on single-turn problem solving, M3 also learns to interact, ask questions, and iterate on modifications.

## Pricing Strategy

MiniMax's pricing is its sharpest differentiator.

| Model | Input | Output | Speed |
|---|---|---|---|
| M2.5 | $0.15/M | $1.20/M | Standard |
| M2.5-Lightning | $0.30/M | $2.40/M | 100 tok/s |
| M3 | $0.60/M | $2.40/M | — |

The gap versus closed-source flagships ranges from 10× to 60×. This pricing makes "running your coding agent on MiniMax" a serious option for many teams — especially for batch processing scenarios requiring high API call volumes.

## Is It Worth Watching?

**Yes, for three reasons:**

1. **Cost structure proof-of-concept** — M2.5 proved that frontier coding doesn't require frontier pricing. For dev teams, a 10× cost difference doesn't just save money — it shifts which use cases are economically viable
2. **MSA's engineering significance** — 1M context isn't new, but achieving it at 1/20th the compute is. If MSA's quality trade-offs are as minimal as MiniMax claims, this architectural direction is worth tracking
3. **Consumer AI feeding back into foundation models** — MiniMax's user base (200M+) provides training signals other pure model companies lack. The interactive user-simulator framework may be a direct expression of this advantage

**Caveats:**

- The company is still deeply unprofitable ($1.87B operating loss) — pricing may be subsidized
- M3 is open-weight but training data and code are not released — not fully open-source
- Benchmark scores are self-reported; large-scale independent reproductions are ongoing
- Geopolitical risks around Chinese AI companies are a factor for some use cases

## References

- [MiniMax Official Website](https://www.minimaxi.com/)
- [MiniMax M3 Technical Report](https://www.minimaxi.com/m3)
- [MiniMax on HuggingFace](https://huggingface.co/MiniMaxAI)
- [SWE-bench Leaderboard](https://www.swebench.com/)
- [Ornith: The Open-Source Coding Dark Horse Built on Self-Improvement RL](/posts/tech/2026-08-26-ornith-deepreinforce-model-family) — this site (in Chinese)
