---
title: "IterResearch & AREX: Memory and Self-Evolution for Long-Horizon Research"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, long-horizon, agent, memory, self-improvement, IterResearch, AREX, Markovian]
lang: en
tldr: "When a research agent runs 25, 100, or 2000 turns, what happens? Context suffocation: information piles up, noise increases, attention gets diluted. IterResearch solves this with Markovian state reconstruction; AREX achieves recursive self-improvement with an inner/outer loop. Both answer: how does an agent stay coherent across hundreds of search rounds?"
description: "A deep analysis of IterResearch (Markovian state reconstruction + EAPO, 2048 interactions scaling from 3.5% to 42.5%) and AREX (inner/outer loop recursive self-improvement, 4B/122B-A10B MoE). Core question: how does an agent maintain direction across hundreds of search rounds?"
draft: false
series:
  name: "Deep Research 前沿"
  order: 3
---

> 🌏 [中文版](/posts/ai/2026-09-19-iterresearch-arex-long-horizon)

Last articles covered how to train agents from scratch. This article tackles a different question: **once trained, how does an agent stay effective over long research sessions?**

What happens when a deep research agent runs 25, 100, or 2000 turns?

The answer is: it gets worse. IterResearch (arXiv:2511.07327) diagnoses the core problem upfront: **context suffocation** — all information piles up in an ever-expanding context window, attention gets diluted, noise contaminates reasoning, and the agent ends up "searching less effectively than when it started."

IterResearch and AREX attack the same problem from different angles: **long-horizon agent memory management and continuous self-improvement**.

## Core Problem: Context Suffocation

Existing deep research agents use a **mono-contextual** architecture — all information accumulates in a single expanding context window. This creates two problems:

1. **Noise contamination**: Irrelevant early-stage search results mix with later high-value evidence
2. **Attention dilution**: The model must extract key signals from thousands of tokens; signal-to-noise ratio drops continuously

Result? Agent efficiency degrades sharply over long research sessions, sometimes performing worse than at the start.

## IterResearch: Markovian State Reconstruction

IterResearch's core insight: **long-horizon research should be iterative, not linear**. It reformulates deep research as a Markov Decision Process (MDP).

### Key Mechanism: Workspace Reconstruction

After each action, the agent doesn't leave raw information in the context. Instead, it **reconstructs a compact workspace**:

```
[Current question] + [Evolving report/memory] + [Last action & observation]
```

This workspace is **bounded** — regardless of how long the research runs, the context stays the same size. Old details undergo "strategic forgetting"; only the compressed state is preserved.

### Efficiency-Aware Policy Optimization (EAPO)

Training considers "efficiency" as a dimension — not just "is the answer correct?" but "how many turns did it take?" This encourages agents to complete research with minimal interactions.

### Remarkable Interaction Scaling

IterResearch demonstrates unprecedented **interaction scaling**:

| Interaction Turns | Performance |
|---|---|
| Few turns | 3.5% |
| Many turns | **42.5%** |

And it's not just a trained agent — **as a prompting strategy**, it can be applied to frontier models without training, improving over ReAct-style chains by **+19.2pp** on long-horizon tasks.

Average **+14.5pp** across six benchmarks, narrowing the gap with frontier proprietary systems.

## AREX: Recursive Self-Improvement

BAAI's AREX takes a different path. It doesn't just solve "context gets too big" — it makes the agent **discover what's wrong and fix itself**.

### Dual-Loop Architecture

| Loop | Role | What It Does |
|---|---|---|
| **Inner loop** | Researcher | Search, read, synthesize, construct provisional answer |
| **Outer loop** | Auditor | Audit answer constraint-by-constraint, find unresolved claims, launch targeted follow-up research |

The core insight: **discovery-verification asymmetry** — finding a claim is easy, verifying it is hard. Most agents only do the former.

### Autonomous Context-Update Tool

AREX learns a `context-update` tool that:
- Compresses growing interaction history into a compact **improvement state**
- Preserves verified evidence
- Preserves unresolved constraints
- Operates without relying on an external model

This way, each outer loop restart brings a precise state of "what's confirmed, what still needs checking."

### Training Strategy

To mitigate sparse reward in long-horizon RL, AREX emphasizes **critical steps**:
- When decisive evidence is acquired
- When erroneous research directions are corrected

Models: Dense 4B model and 122B-A10B Mixture-of-Experts model.

## Comparison and Relationship

| Dimension | IterResearch | AREX |
|---|---|---|
| **Core problem** | Context suffocation | Discovery-verification asymmetry |
| **Solution** | Markovian state reconstruction | Recursive self-improvement |
| **Architecture** | Single loop, compressed state | Dual loop (research + audit) |
| **Memory** | Workspace (bounded) | Improvement state (verified + unresolved) |
| **Training** | EAPO (efficiency-aware) | Synthetic tasks + long-horizon RL |
| **Scaling** | 2048 interaction turns | 300 inner + 5 outer loops |
| **Unique advantage** | Works as prompting strategy without training | Autonomous auditing + self-correction |

### Shared Conclusion

> **Long-horizon research is not "more turns of searching" but a process of continuous compression and self-correction.**

IterResearch tells us: memory management is primary — if state compression works well, 2048 turns is not a problem.
AREX tells us: self-auditing is secondary — if the agent can discover what's wrong, it can automatically extend research depth.

Combined, they answer the full question: first compress state (IterResearch), then audit and correct (AREX).

## What's Next

Next article covers "how to optimize planning" — how WebWeaver and DeepPlanner do better before searching starts.

## 參考資料

- [IterResearch: Rethinking Long-Horizon Agents with Interaction Scaling](https://arxiv.org/abs/2511.07327) — Chen et al., Nov 2025. Markovian state reconstruction + EAPO, 2048-turn scaling.
- [AREX: Towards a Recursively Self-Improving Agent for Deep Research](https://arxiv.org/abs/2607.21461) — BAAI, Jul 2026. Dual-loop recursive self-improvement, 4B/122B-A10B MoE.
- [IterResearch GitHub](https://github.com/Chen-GX/IterResearch) — Code and runtime environment open-sourced.
- [autonomous-deep-research-agent](/posts/ai/2026-06-04-autonomous-deep-research-agent) — Previous article in this series: four-stage architecture breakdown.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.
- [webdancer-webthinker-from-scratch](/posts/ai/2026-09-19-webdancer-webthinker-from-scratch) — Previous article: training from scratch (WebDancer & WebThinker).
