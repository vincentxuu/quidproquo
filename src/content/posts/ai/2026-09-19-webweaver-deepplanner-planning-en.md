---
title: "WebWeaver & DeepPlanner: Dual-Agent Architecture and Planning Optimization"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, planning, dual-agent, advantage-shaping, WebWeaver, DeepPlanner, ICLR2026, ACL2026]
lang: en
tldr: "Previous articles covered training from scratch and long-horizon memory. This one goes deeper: how to make the agent's 'planning' itself better? WebWeaver tackles it architecturally (dual-agent iterative outline optimization). DeepPlanner tackles it through training (advantage shaping for planning tokens). Both point to the same conclusion: planning is the ceiling of deep research."
description: "A deep comparison of WebWeaver (dual-agent iterative outline optimization, DeepResearch Bench 50.58, 93.37% citation accuracy) and DeepPlanner (advantage shaping RL for planning, 67.1 MBE with 1/10 the data). One fixes the architecture, the other fixes the training."
draft: false
series:
  name: "Deep Research 前沿"
  order: 4
---

> 🌏 [中文版](/posts/ai/2026-09-19-webweaver-deepplanner-planning)

Previous articles covered training agents from scratch (order 2) and long-horizon memory management (order 3). This article goes one level deeper: **how to make the agent's 'planning' itself better?**

The deep research core loop is: plan → search → synthesize → output. But most systems treat "planning" as a single step—design a workflow, then execute. WebWeaver (ICLR 2026) and DeepPlanner (ACL Findings 2026) ask the same question: **can planning itself be a continuously optimizable capability?**

The answer is two different paths:
- **WebWeaver**: architectural approach — dual-agent iterative outline optimization
- **DeepPlanner**: training approach — advantage shaping for planning tokens

## WebWeaver: Dual-Agent Iterative Outlines

WebWeaver's core problem: existing deep research systems **decouple planning from evidence acquisition**—plan the full report structure first, then search everything at once. This creates two issues:

1. **Static pipeline**: Planning is fixed before evidence is gathered; when new findings emerge, the structure can't adapt
2. **Long-context failure**: Dumping all evidence into one generation causes "loss in the middle" and hallucinations

### Dual-Agent Architecture

| Agent | Role | What It Does |
|---|---|---|
| **Planner** | Researcher | Dynamic outline optimization: search → optimize outline → search again |
| **Writer** | Writer | Hierarchical retrieval + section-by-section writing: targeted extraction from memory bank |

### Planner: Iterative Outline Optimization Cycle

Not "write the outline first, then fill it with data"—but **optimize the outline while searching**:

```
Optimize outline → Search evidence → Update outline → Search evidence → ... (iterate)
```

Each iteration, the Planner:
1. Decides what to search based on current outline
2. Stores found evidence as **citation IDs** in a memory bank
3. Adjusts outline structure based on new evidence

### Writer: Hierarchical Targeted Retrieval

The Writer doesn't read the entire memory bank. It:
1. Reads citation IDs corresponding to each section in the outline
2. Extracts only those relevant pieces of evidence
3. Writes section by section

The elegance: **Planner embeds citation IDs into the outline → Writer uses this structure for targeted retrieval**. This nearly eliminates long-context problems and hallucinations.

### Benchmark Performance

| Benchmark | WebWeaver | Gemini Deep Research | OpenAI Deep Research |
|---|---|---|---|
| DeepResearch Bench (total) | **50.58** | 49.71 | 46.45 |
| Citation accuracy | **93.37%** | 78.3% | 75.01% |
| Effective citations | 200+ | — | — |

The Planner performs ~16 search steps, 2+ structural optimization cycles, stores 100+ web pages (67,000 tokens of evidence). The Writer produces a 26,000-token report in ~25 steps.

Model: Tongyi-DeepResearch-30B-A3B (fine-tuned from Qwen3-30B-A3B-Instruct). Part of the Tongyi DeepResearch family from Alibaba's Tongyi Lab.

## DeepPlanner: Advantage Shaping for Planning

DeepPlanner approaches the problem differently: **not changing the architecture, but training agents to plan better.**

### Core Finding

Under vanilla RL training, **planning tokens exhibit significantly higher entropy than other action tokens**—meaning the planning stage has the most uncertain decisions, which need the most learning, but vanilla RL doesn't update these areas effectively.

### Advantage Shaping

Two key techniques:

**1. Token-Level Entropy-Shaped Advantage**

Add an entropy term to token-level advantages:
- Larger gradients for high-entropy tokens (uncertain planning decisions)
- Clipping for strongly negative advantages to prevent sign flips
- Essentially: "tell the model where you're most uncertain, focus learning there"

**2. Sample-Level Advantage Upweighting**

Increase sample-level advantage weights for planning-intensive rollouts (tasks requiring many planning decisions).

### Results

| Metric | DeepPlanner | EvolveSearch-ite3 |
|---|---|---|
| Training samples | **3,072** | 32,000 |
| Rollouts per sample | **8** | 16 |
| Overall MBE | **67.1** | Lower |
| Benchmarks | 7 deep research benchmarks | — |

With 1/10 the samples and half the rollouts, surpasses a system trained on 10× the resources.

### Core Conclusion

> **Scaling high-level planning quality, not just data volume or rollouts, is critical for improving deep research.**

## Relationship and Differences

| Dimension | WebWeaver | DeepPlanner |
|---|---|---|
| **Approach** | Architecture design | Training methodology |
| **Core mechanism** | Dual-agent + iterative outline optimization | Entropy-shaped advantage shaping |
| **Problem solved** | Planning-evidence decoupling, long-context failure | Planning token uncertainty, inefficient RL updates |
| **Role division** | Planner plans, Writer writes | Single agent, but token-level distinction between planning and execution |
| **Evidence management** | Memory bank + citation ID targeted retrieval | Doesn't directly manage evidence structure |
| **Data efficiency** | Not emphasized | 1/10 samples to surpass |
| **Best for** | Open-ended research reports (need structured output) | Enhancing any deep research agent's planning capability |

### Complementarity

These two approaches aren't mutually exclusive—they're **complementary**:

- WebWeaver provides an **architectural paradigm**: planner-writer separation with iterative outline optimization
- DeepPlanner provides a **training method**: how to make agents learn planning faster and better

Ideally, DeepPlanner's advantage shaping could be applied to WebWeaver's Planner agent—best architecture plus best training.

## Significance for the Series

These two papers shift focus from "training the whole agent" to "optimizing planning as a specific capability." Mapping to the three-phase roadmap:

- Phase I (Agentic Search): Planning decides "what to search"
- Phase II (Integrated Research): Planning decides "how to structure the report"
- Phase III (Full-stack AI Scientist): Planning decides "how to design experiments"

**Planning quality is the ceiling of deep research**—search power is wasted if planning is wrong; writing skill is meaningless if the outline is incoherent.

## What's Next

The final two articles cover evaluation and future outlook.

## 參考資料

- [WebWeaver: Structuring Web-Scale Evidence with Dynamic Outlines for Open-Ended Deep Research](https://arxiv.org/abs/2509.13312) — Zijian Li et al., ICLR 2026. Dual-agent framework, DeepResearch Bench 50.58, 93.37% citation accuracy.
- [DeepPlanner: Scaling Planning Capability for Deep Research Agents via Advantage Shaping](https://arxiv.org/abs/2510.12979) — Fan et al., ACL Findings 2026. Entropy-shaped advantage shaping, 67.1 MBE, 7 benchmarks.
- [Tongyi DeepResearch](https://tongyi-agent.github.io/blog/introducing-tongyi-deep-research) — Alibaba Tongyi Lab's deep research agent family (WebWalker, WebDancer, WebSailor, WebWeaver, etc.).
- [WebWeaver GitHub](https://github.com/Alibaba-NLP/DeepResearch) — Tongyi DeepResearch repository.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.
