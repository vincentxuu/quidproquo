---
title: "Tongyi DeepResearch: From Base Model to Agentic Foundation"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, tongyi, moe, agentic-cpt, qwen3, alibaba, end-to-end-training]
lang: en
tldr: "Previous articles covered the landscape, training from scratch, long-horizon memory, and planning optimization. This one zooms out to see a complete system that threads all these insights together: Tongyi DeepResearch. Its core innovation is Agentic CPT — inserting an agentic mid-training stage between pre-training and fine-tuning, giving the model an inherent agent bias. MoE 30B parameters activating 3B, HLE 32.9 surpassing OpenAI o3."
description: "A deep analysis of Tongyi DeepResearch's complete training pipeline: Agentic CPT (mid-training) + Agentic SFT (cold-start) + Agentic RL (GRPO). MoE 30B-A3B architecture, dual-mode inference (ReAct + Heavy). HLE 32.9, BrowseComp 43.4, FRAMES 90.6 — the first open-source system to match OpenAI DeepResearch."
draft: false
series:
  name: "Deep Research 前沿"
  order: 5
---

> 🌏 [中文版](/posts/ai/2026-09-19-tongyi-deepresearch-moe-cpt)

Previous articles covered individual pieces of the puzzle: the landscape (order 0), training from scratch (order 2), long-horizon memory (order 3), and planning optimization (order 4).

This article zooms out to see a **complete system that threads all these insights together**: Tongyi DeepResearch (arXiv:2510.24701, Alibaba Tongyi Lab).

Its core question: **can you take a general-purpose pre-trained model and, through a complete pipeline, build an agent specifically designed for deep research?**

Answer: yes. And not just capable — open-source SOTA.

## Core Innovation: Agentic CPT

Most LLM training pipelines follow: pre-training → post-training fine-tuning.

Tongyi DeepResearch finds a fundamental problem with this flow: **general pre-trained models lack "agent bias"** — they don't know when to search, how to use tools, or how to manage long-horizon tasks. You can "patch" behavior on through post-training, but the model is fundamentally still a chat model.

Their solution: insert a **mid-training stage** between pre-training and post-training:

```
Pre-training → Agentic CPT → Agentic SFT → Agentic RL → Tongyi DeepResearch
```

### What is Agentic CPT?

Agentic Continual Pre-training's core idea: **instead of continuing pre-training on text, continue pre-training on synthetic agent trajectories.**

Training data includes:
- Structured research process trajectories (question → search → read → synthesize)
- Tool call logs (when to invoke which tools)
- Graph-structured knowledge (associations)

Stage 1 uses 32K context length; Stage 2 expands to 128K. Through this process, the model learns the **innate bias** of being an agent — not behavior pinned by prescriptive prompts, but genuine understanding of what agent behavior means.

### Why "pre-aligned"?

The paper's terminology is precise: Agentic CPT builds a **pre-aligned agentic foundation model** — before any post-training, the model already possesses foundational agent capabilities. The subsequent SFT and RL merely refine this base, not "patch" behavior from scratch.

## Three-Stage Training Pipeline

| Stage | Method | Data | Goal |
|---|---|---|---|
| **Agentic CPT** | Continual pre-training | Large-scale synthetic agent trajectories | Implant agent bias |
| **Agentic SFT** | Supervised fine-tuning | ReAct + IterResearch format trajectories | Cold-start, schema consistency |
| **Agentic RL** | GRPO | Synthetic tasks + real environments | Self-evolution |

### Data Synthesis: AgentFounder

The pipeline's data is **fully automated** — no human annotation:

AgentFounder converts raw text, graph-structured knowledge, and tool logs into structured QA pairs and action sequences. Think of it as building a "memory palace" for the model — internalizing the structure of the research process into its parameters.

### RL Training: Data > Algorithm

The Tongyi team makes an interesting observation:

> "The algorithm is important but not the only decisive factor. **Data and stability of the training environment** are likely the more critical components."

They experimented with training directly on the BrowseComp test set and got substantially worse results than with synthetic data. Hypothesis: seeing answers directly causes overfitting, while synthetic data maintains generalization.

They used customized GRPO with token-level gradients and negative sample filtering for stable training.

## Architecture: MoE + 128K Context

| Feature | Specification |
|---|---|
| Total parameters | **30.5B** |
| Activated parameters | **3.3B** per token |
| Base model | Qwen3-30B-A3B |
| Context length | **128K** |
| Inference modes | ReAct (standard) + Heavy (IterResearch) |

MoE advantages:
- Inference cost ≈ small dense model
- Retains specialist capacity (only 3.3B activated per token)
- 128K context supports long-horizon browsing sessions and iterative synthesis

### Dual-Mode Inference

**ReAct mode** (standard): Core capability testing, single agent loop.

**Heavy mode** (IterResearch): Parallel context-managed agents + synthesis, targeting the hardest tasks. This is why HLE improves from 32.9 to **38.3**.

## Benchmark Performance: Open-Source SOTA

| Benchmark | Tongyi DeepResearch | OpenAI o3 |
|---|---|---|
| HLE | **32.9** (ReAct) / 38.3 (Heavy) | 24.9 |
| BrowseComp (EN) | **43.4** | 49.7* |
| BrowseComp (ZH) | **46.7** | 58.1* |
| WebWalkerQA | **72.2** | — |
| GAIA | **70.9** | — |
| xbench-DeepSearch | **75.0** | 67.0 |
| FRAMES | **90.6** | — |
| xbench-DeepSearch-2510 | **55.0** | — |

> *OpenAI o3 BrowseComp scores are known but based on different prompting strategies. Tongyi wins on efficiency — achieving comparable or better results with 3B activated parameters.

Key takeaway: **with 30B total / 3B activated parameters, surpasses larger closed systems like o3.**

## System View: Threading Previous Articles

Tongyi DeepResearch isn't a single technical breakthrough — it's a **system integration**. It threads together the insights from previous articles:

| Previous Article Insights | How Tongyi Integrates |
|---|---|
| order 2 (WebDancer/WebThinker) | Value of training from scratch → Agentic CPT implants agent behavior from the foundation |
| order 3 (IterResearch/AREX) | Long-horizon memory → 128K context + Heavy mode's parallel agents |
| order 4 (WebWeaver/DeepPlanner) | Planning optimization → IterResearch format as one of the SFT training formats |

**It proves one thing: deep research agents aren't built on a single technical breakthrough, but on systematic design of the entire training pipeline.**

## Key Takeaways

From Tongyi's practice, the most memorable lessons:

1. **Pre-training doesn't produce agents** — Agentic CPT is needed as a bridge
2. **Data quality > algorithm innovation** — synthetic data quality determines the system's ceiling
3. **Training environment stability > algorithm choice** — stability matters more than which RL algorithm
4. **MoE is key for cost efficiency** — 30B total activating 3B makes the system deployable in practice

## What's Next

Final article: future outlook — embodied research, scientific automation, agent swarms.

## 參考資料

- [Tongyi DeepResearch Technical Report](https://arxiv.org/abs/2510.24701) — Kuan Li et al., Tongyi Lab, Alibaba. 30.5B MoE, Agentic CPT, HLE 32.9.
- [Tongyi DeepResearch Blog](https://tongyi-agent.github.io/blog/introducing-tongyi-deep-research) — Official introduction with complete system overview.
- [Tongyi DeepResearch GitHub](https://github.com/Alibaba-NLP/DeepResearch) — Model, framework, and solutions fully open-sourced.
- [Scaling Agents via Continual Pre-training](https://arxiv.org/abs/2509.13310) — Companion paper detailing Agentic CPT methodology.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.
