---
title: "Benchmark Deep Dive: DeepResearch Bench II and the Evaluation Landscape"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, benchmark, deepresearch-bench-ii, evaluation, race, fact]
lang: en
tldr: "DeepResearch Bench II uses 9,430 expert rubrics covering 132 tasks, and finds that even the strongest agents satisfy less than 50% of criteria. This article breaks down the benchmark architecture, scoring methodology, leaders, and the overall evaluation landscape."
description: "Deep analysis of DeepResearch Bench II: 132 tasks, 9,430 expert-written rubrics, three-dimensional evaluation (InfoRecall/Analysis/Presentation), LLM judge vs. human agreement at 91.75%. Also maps the overall evaluation ecosystem."
draft: false
series:
  name: "Deep Research 前沿"
  order: 8
---

> 🌏 [中文版](/posts/ai/2026-09-19-deepresearch-bench-ii-benchmarks)

The previous article covered the fundamental challenges of evaluation. This one looks at the most important benchmark: **DeepResearch Bench II**.

This is currently the most comprehensive deep research agent evaluation framework—and the only yardstick that tells us "how far are our agents from where they need to be."

## DeepResearch Bench II Architecture

### Core Design

| Dimension | Specification |
|---|---|
| Tasks | **132** |
| Domains | **22** real-world domains |
| Rubrics | **9,430** fine-grained binary criteria |
| Evaluation | LLM judge (Gemini 2.5-Pro) + human verification |
| Evaluation Dimensions | Three: InfoRecall, Analysis, Presentation |

### Three-Dimensional Evaluation

| Dimension | What It Tests | Weight |
|---|---|---|
| **InfoRecall** | Whether information retrieval is accurate and comprehensive | ~52.9 criteria/task |
| **Analysis** | Whether new insights can be extracted from evidence | ~12.8 criteria/task |
| **Presentation** | Whether the report is credible and readable | ~5.7 criteria/task |

Each rubric is binary (pass/fail), written by domain experts, covering every detail of the report.

### Evaluation Methodology

DeepResearch Bench II's key innovation is **using LLM judges while ensuring human alignment**:

- Every batch of 50 rubrics evaluated by LLM judge
- Agreement with human annotators:
  - **Accuracy: 91.75%**
  - **F1: 89.57%**
- Experimental scale: 50 rubrics per batch

### Differences from DeepResearch Bench I

| | Bench I | Bench II |
|---|---|---|
| Tasks | 100 | **132** |
| Rubrics | Coarse | **9,430 fine-grained** |
| Evaluation | RACE + FACT | **Three-dimensional rubric-based** |
| Focus | Report quality | **Comprehensive diagnosis** |

## Benchmark Results: Who Leads?

| Agent | Total Score | InfoRecall | Analysis | Presentation |
|---|---|---|---|---|
| NVIDIA AI-Q | 54.50 | — | — | — |
| Xiaoyi DeepResearch 6.0 | 53.05 | 69.90 | 91.12 | 58.72 |
| Hermes Ultra | 50.83 | 61.12 | 92.56 | 55.64 |
| WebWeaver | ~50.58* | — | — | — |
| OpenAI Deep Research | ~46.45* | — | — | — |

> *Scores on Bench I; Bench II results may differ.

Key finding: **Even the strongest model satisfies less than 50% of rubrics.** This means current deep research agents have a huge gap from human expert level.

## Overall Evaluation Landscape

The deep research evaluation ecosystem has formed several layers:

### Layer 1: Report Quality Evaluation

| Benchmark | Method | Focus |
|---|---|---|
| DeepResearch Bench I | RACE + FACT | Report quality + citations |
| DeepResearch Bench II | Three-dimensional rubric | Comprehensive diagnosis |
| DeepResearchGym | Custom | 1,000 complex queries |

### Layer 2: Information Retrieval Evaluation

| Benchmark | Method | Focus |
|---|---|---|
| FACT Framework | Effective Citations + Citation Accuracy | Retrieval efficiency and accuracy |
| BrowseComp | Multi-step browsing | Web navigation ability |
| WebWalkerQA | Website traversal | Web structure understanding |

### Layer 3: Domain-Specific Evaluation

| Benchmark | Domain |
|---|---|
| FRAMES | Financial reasoning |
| FinSearchComp | Financial search |
| GAIA | General reasoning |
| HLE | Academic reasoning |

### Evolution of Evaluation Methods

```
LLM judge (early) → Human rubric (Bench II) → STC confidence → Hybrid evaluation (future)
```

Each stage solves the previous stage's problems:
- LLM judge is cheap but biased → Human rubric is accurate but expensive
- Human rubric is comprehensive but slow → STC tries to automate and align with reality
- STC isn't perfect → The future is hybrid

## Key Numbers

| Metric | Number | Meaning |
|---|---|---|
| Strongest agent's rubric pass rate | <50% | Huge gap from expert level |
| LLM-judge vs. human alignment | 91.75% | Trustworthy but not perfect |
| Number of rubrics | 9,430 | Extremely fine coverage |
| Number of tasks | 132 | 22 domains |
| Criteria per task | ~71 | Very fine-grained |

## Implications for Researchers

1. **Benchmarks are maps, not destinations**—Bench II tells you "where you are" but not "how to get there"
2. **InfoRecall vs. Analysis gap**—retrieval is easiest, synthesis is hardest
3. **Presentation is an underestimated dimension**—report credibility and readability matter equally

## References

- [DeepResearch Bench II: Diagnosing Deep Research Agents via Rubrics from Expert Reports](https://arxiv.org/abs/2601.08536) — Core paper, Li et al., 2026.
- [DeepResearch Bench](https://deepresearch-bench.github.io) — Bench I official website.
- [How NVIDIA AI-Q Reached #1 on DeepResearch Bench](https://huggingface.co/blog/nvidia/how-nvidia-won-deepresearch-bench) — NVIDIA AI-Q's evaluation analysis.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.
