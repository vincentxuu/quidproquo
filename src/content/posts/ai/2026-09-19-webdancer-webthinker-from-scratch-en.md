---
title: "WebDancer & WebThinker: Training a Deep Research Agent from Scratch"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, web-agent, reinforcement-learning, training, neurips2025, webdancer, webthinker]
lang: en
tldr: "Two NeurIPS 2025 papers answer the same question: how to train a web research agent from scratch? WebThinker chooses 'bolt on web capability to existing reasoning models,' WebDancer chooses 'rebuild everything from data construction to RL training.' Two philosophies, four stages, one core insight: training beats prompting."
description: "A deep comparison of WebThinker (augmentation: RL-DPO to enhance existing LRMs) and WebDancer (end-to-end: four-stage pipeline from scratch). Both prove the same thing—training from the ground up yields higher ceilings than hand-crafted workflows."
draft: false
series:
  name: "Deep Research 前沿"
  order: 2
---

> 🌏 [中文版](/posts/ai/2026-09-19-webdancer-webthinker-from-scratch)

Last article's panorama mapped the four core components of Deep Research systems. This article zooms into one of them: **training methodology**. Two NeurIPS 2025 papers take fundamentally different philosophies to train agents that can autonomously research the web from scratch.

Both face the same question: *how does an agent learn to autonomously search, navigate, synthesize, and produce research reports across the web?*

- **WebThinker** (arXiv:2504.21776): **Augment** existing Large Reasoning Models (LRMs like QwQ-32B, DeepSeek-R1) with web exploration capability.
- **WebDancer** (arXiv:2505.22648): **Rebuild from scratch** — data construction, trajectory sampling, supervised initialization, and RL fine-tuning, end to end.

These aren't just technical differences — they're fundamentally different answers to what a deep research agent *is*.

## Two Training Philosophies

| Dimension | WebThinker | WebDancer |
|---|---|---|
| **Starting point** | Existing LRM (QwQ-32B / DeepSeek-R1) | From scratch |
| **Core approach** | Add-on module (Deep Web Explorer) | End-to-end four-stage pipeline |
| **Training** | Online DPO (reinforce tool use) | SFT cold-start → DAPO RL |
| **Format** | Think-Search-Draft interleaving | ReAct |
| **Best for** | Rapidly enhancing existing models | Building specialized agent models |

## WebThinker: Give Reasoning Models Web Eyes

WebThinker's core hypothesis: **LRMs already know how to "think," but not how to "find."** They have powerful internal reasoning but are constrained by static knowledge — they stall when facing tasks requiring real-time information or cross-source synthesis.

The solution is three modules:

### 1. Deep Web Explorer

When the model detects a "knowledge gap," it automatically triggers web exploration: search → navigate → extract. This module doesn't interfere with normal reasoning; it only intervenes when needed.

### 2. Autonomous Think-Search-and-Draft

The model naturally interleaves three behaviors during thinking:
- **Think**: Reason, analyze, identify knowledge gaps
- **Search**: Trigger web exploration to fill gaps
- **Draft**: Write evidence into the report

The entire process completes in a single generation — no external orchestrator to interrupt and restart.

### 3. Online DPO Training

Direct Preference Optimization reinforces tool usage:
- Generate multiple possible reasoning paths (some search, some don't)
- Compare outcomes of these paths
- Prefer paths that are **accurate and efficient** (not just correct answers, but concise reasoning too)

This is "online" — training data updates continuously, not trained on a fixed dataset in one pass.

**Benchmark performance** (WebThinker-32B-RL):

| Benchmark | Score | vs. Baseline |
|---|---|---|
| GPQA | 70.7% | Beats all baselines |
| GAIA | 48.5% | +8.5% over base |
| WebWalkerQA (overall) | 46.5% | Hardest sub-question: 15.8% |
| HLE | 15.8% | **Surpasses o3-mini (High)** |

WebThinker-R1-7B achieved **174.4% (GAIA)** and **422.6% (WebWalkerQA)** relative gains over direct generation.

## WebDancer: Four Stages from Zero

WebDancer chose the harder road: **not relying on any pre-trained reasoning ability, rebuilding everything from data and training pipeline.**

### Four-Stage Pipeline

| Stage | What | Why |
|---|---|---|
| **1. Browsing data construction** | Build large-scale browsing trajectory data | Training material |
| **2. Trajectories sampling** | Sample diverse interaction trajectories from data | Cover multiple task types |
| **3. SFT cold-start** | Supervised fine-tuning for initial capability | Avoid RL instability from scratch |
| **4. RL (DAPO) generalization** | Enhance generalization | Surpass teacher model performance |

### Why SFT?

WebDancer's paper explicitly states: **training web agents with RL from scratch is unstable.** Environment reward signals are sparse (only success/failure at the final step), and the model learns almost nothing in early stages.

So they use SFT first to build "cold-start" capability — giving the model a sense of what "searching, clicking, reading, synthesizing" feels like — then use RL to refine on top.

### Architecture

Instantiated as WebDancer based on ReAct format:
- Observe web state
- Reason about next action
- Execute action (click, type, scroll)
- Adjust based on feedback

**Benchmark performance** (WebDancer-32B):

| Benchmark | Pass@1 | Pass@3 |
|---|---|---|
| GAIA | 51.5% | 64.1% |
| WebWalkerQA | 47.9% | 62.0% |

> They later released **WebSailor** (June 2025), achieving open-source SOTA on more difficult browsing benchmarks.

## The Fundamental Difference

On the surface, both approaches use RL and perform well on GAIA/WebWalker. But they answer different questions:

**WebThinker answers: "I already have a powerful reasoning model, how do I give it web capability?"**
→ Add-on module + Online DPO. Advantage: fast, leverages existing model investment. Cost: constrained by the underlying model's architecture.

**WebDancer answers: "How do I build a specialized web research agent from the ground up?"**
→ Full pipeline + SFT + RL. Advantage: can optimize every layer for the task. Cost: requires massive data and training resources.

### Shared Conclusion

Regardless of the path, both papers point to the same finding:

> **End-to-end training (RL/SFT) produces agents with higher ceilings than hand-crafted workflows.**

WebThinker proves that even on existing powerful models, adding RL-trained tool usage creates a qualitative shift. WebDancer goes further, proving that training from scratch can break through even higher ceilings.

This directly maps to the optimization paradigms in last article's three-stage roadmap: workflow prompting is the convenient starting point, SFT is the practical middle ground, and end-to-end RL is theoretically the most elegant ceiling.

## What's Next

These two focus on "how to train agents." Subsequent articles will cover "how to keep agents learning" (IterResearch, AREX) and "how to optimize planning" (WebWeaver, DeepPlanner).

## 參考資料

- [WebThinker: Empowering Large Reasoning Models with Deep Research Capability](https://arxiv.org/abs/2504.21776) — Xiaoxi Li et al., NeurIPS 2025. Deep Web Explorer + Think-Search-Draft + Online DPO.
- [WebDancer: Towards Autonomous Information Seeking Agency](https://arxiv.org/abs/2505.22648) — Jialong Wu et al., NeurIPS 2025. Four-stage from-scratch training pipeline.
- [WebThinker GitHub](https://github.com/RUC-NLPIR/WebThinker) — Maintained by RUC-NLPIR, code and models open-sourced.
- [WebDancer/WebSailor GitHub](https://github.com/jurgen-paul/WebAgent) — WebSailor follow-up, open-source SOTA.
- [autonomous-deep-research-agent](/posts/ai/2026-06-04-autonomous-deep-research-agent) — Previous article in this series: four-stage architecture breakdown.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.
