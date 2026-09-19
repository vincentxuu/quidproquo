---
title: "Data Synthesis: WebShaper & S1-DeepResearch"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, data-synthesis, webshaper, s1-deepresearch, formalization, iclr2026]
lang: en
tldr: "Previous articles covered how to train agents. But training requires high-quality data—and deep research training data has been scarce. WebShaper solves this with mathematical formalization: define IS tasks in set theory, then use an agentic Expander to iteratively expand them. S1-DeepResearch goes further: moves training from 'search-centric' to 'real research.'"
description: "A deep analysis of WebShaper (set theory + Knowledge Projections formalized data synthesis, GAIA 60.1%) and S1-DeepResearch (five-dimension unified trajectory construction, beyond search-centric). Both answer: how to produce high-quality deep research training data?"
draft: false
series:
  name: "Deep Research 前沿"
  order: 6
---

> 🌏 [中文版](/posts/ai/2026-09-19-webshaper-s1-deepresearch-data)

Previous articles covered how to train agents: from scratch (order 2), long-horizon memory (order 3), planning optimization (order 4), and complete pipelines (order 5).

But all of that assumes one thing: **high-quality training data.**

The reality is that deep research training data has been scarce. Traditional approaches collect web pages first, then generate questions from the content—but this has a structural flaw: **the information structure doesn't match the reasoning structure.** What you can search for doesn't necessarily make good training tasks.

This article covers two solutions:
- **WebShaper**: uses mathematical formalization to redesign data synthesis from scratch
- **S1-DeepResearch**: moves training from "search-centric" to "actually doing research"

## The Data Bottleneck

Training a deep research agent requires what kind of data?

Not ordinary QA pairs. **Structured agent trajectories**—complete processes including questioning, searching, browsing, and synthesizing.

Existing methods have problems:

| Method | Problem |
|---|---|
| Generate questions from web pages | Information structure ≠ reasoning structure |
| Human annotation | Not scalable, expensive |
| Random synthesis | Uncontrollable, unstable quality |

WebShaper and S1-DeepResearch break through this bottleneck from two angles: **task formalization** and **trajectory unification**.

## WebShaper: Set-Theoretic Formalization

WebShaper's core innovation: **mathematically define what an information-seeking task actually is.**

### The Problem

Existing methods use an "information-driven" paradigm:
1. Collect web data first
2. Generate questions based on what was found

This creates **inconsistency between information structure and reasoning structure**—the organization of search results doesn't correspond to good reasoning processes.

### Solution: Set Theory + Knowledge Projections

WebShaper formalizes information-seeking (IS) tasks using **set theory**:

- Each task is represented as a mathematical structure
- **Knowledge Projections (KP)** are the core operations—they precisely control reasoning structure
- Compositions of KP enable engineering of difficulty, coverage, and diversity

Benefits of formalization:
1. **Controllability**: precisely control reasoning depth and structure
2. **Consistency**: information and reasoning structures are naturally aligned
3. **Scalability**: automatically generate large quantities of high-quality tasks

### Synthesis Process

```
Generate seed tasks → agentic Expander iteratively expands → validate → dataset
```

Each step:
1. Start from simple seed questions
2. Agentic Expander uses retrieval and validation tools to make questions more complex
3. Ensures expanded questions align with formalization rules
4. Repeat until target difficulty is reached

### Benchmark Performance

| Benchmark | WebShaper-72B | Second place (WebSailor) | OpenAI Deep Research |
|---|---|---|---|
| GAIA (Pass@1) | **60.1%** | 55.4% | 67.4% |
| WebWalkerQA | **52.2%** | — | — |

Works across different backbone models (Qwen-2.5-32B, QwQ-32B, Qwen-2.5-72B), proving the formalization approach is general.

## S1-DeepResearch: Beyond Search-Centric

WebShaper solved "how to produce good training data." S1-DeepResearch asks a deeper question: **what actually constitutes deep research?**

### The Problem

Most deep research systems are **search-centric**—they're trained to answer questions. But real research isn't just Q&A:

| Real Research Capability | Description |
|---|---|
| Information seeking | Find relevant sources |
| **Evidence synthesis** | Stitch multiple sources into coherent narrative |
| **Instruction following** | Produce according to specific format requirements |
| **Deliverable generation** | Create reports, presentations, code |
| **Long-horizon planning** | Multi-stage task management |

Most training data only covers the first dimension.

### Solution: Unified Trajectory Construction

S1-DeepResearch proposes a **unified trajectory construction paradigm** combining:
- Closed-ended QA (verifiable components)
- Open-ended research tasks (requiring synthesis)

Three-stage construction:
1. **Task design**: Define five-dimension capability goals
2. **Trajectory synthesis**: Generate trajectories covering complete research process
3. **Verification & filtering**: Ensure trajectories cover all dimensions

### Core Insight

> **Search is necessary but not sufficient.**

A true deep research agent needs to do more than search—it needs to synthesize evidence, generate reports, follow complex instructions. Training data must reflect this reality.

## Relationship Between the Two

| Dimension | WebShaper | S1-DeepResearch |
|---|---|---|
| **Core question** | How to produce high-quality training data? | What counts as deep research? |
| **Method** | Set-theoretic formalization + KP | Unified trajectory construction (5D) |
| **Entry point** | Mathematical structure of IS tasks | Complete definition of research capabilities |
| **Contribution** | Data synthesis methodology | Task definition & trajectory specification |
| **Best for** | Generating IS training data | Defining and producing complete research tasks |

### Complementarity

These two approaches are highly complementary:

- **WebShaper** tells you how to "make good questions"—formalized definition + systematic expansion
- **S1-DeepResearch** tells you "what a good question looks like"—not just Q&A, but complete research capabilities

Ideal workflow:
1. Use S1-DeepResearch's lens to define task dimensions
2. Use WebShaper's formalization to generate data covering all dimensions
3. Train a true deep research agent with this data

## Connection to Tongyi Ecosystem

Both approaches come from Tongyi Lab (Alibaba):

- **WebShaper**: provides the training data foundation for Tongyi DeepResearch
- **Tongyi DeepResearch** (order 5): uses Agentic CPT + Agentic SFT + Agentic RL for complete system training

This shows Tongyi Lab's systematic thinking: **solve data first (WebShaper), then solve training (Agentic CPT), then get the complete system (Tongyi DeepResearch).**

## What's Next

Final two articles: evaluation and future outlook.

## 參考資料

- [WebShaper: Agentically Data Synthesizing via Information-Seeking Formalization](https://arxiv.org/abs/2507.15061) — Tao et al., ICLR 2026. Set theory + KP formalization, GAIA 60.1%.
- [S1-DeepResearch: Beyond Search, Toward Real-World Long-Horizon Research Agents](https://arxiv.org/abs/2606.15367) — Dong et al., ScienceOne AI, 2026. Five-dimension unified trajectory construction.
- [Tongyi DeepResearch Technical Report](https://arxiv.org/abs/2510.24701) — Order 5 of this series, Tongyi Lab complete system.
- [Open Data Synthesis For Deep Research](https://arxiv.org/abs/2509.00375) — Related work, InfoSeek dataset.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.
