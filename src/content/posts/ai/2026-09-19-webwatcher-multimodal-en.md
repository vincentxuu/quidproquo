---
title: "Multimodal and Vision: WebWatcher Redefines Deep Research"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, multimodal, webwatcher, vision-language, neurips2025, browsecomp-vl]
lang: en
tldr: "All deep research agents are 'text-first'—but the real world isn't just text. WebWatcher (NeurIPS 2025) is the first system to integrate visual reasoning into deep research, using OCR, image search, code execution, and other tools to handle charts, screenshots, videos, and other diverse information."
description: "Deep analysis of WebWatcher: a multimodal deep research agent combining vision-language reasoning with multi-tool interaction. Proposes BrowseComp-VL benchmark, published at NeurIPS 2025, cited 100+ times. Reveals the paradigm shift from text to multimodal in deep research."
draft: false
series:
  name: "Deep Research 前沿"
  order: 10
---

> 🌏 [中文版](/posts/ai/2026-09-19-webwatcher-multimodal)

The previous articles all looked at text-centric deep research agents. But the real world isn't just text—you encounter:

- **Charts** in papers (bar charts, flowcharts, architecture diagrams)
- **Screenshots** on web pages (UI design, product interfaces)
- **Handwritten notes** or scanned documents
- **Visual information** in videos

**WebWatcher** (arXiv:2508.05748, NeurIPS 2025) is the first system to formally integrate visual reasoning into deep research.

## Why Multimodal Matters

The problem with existing deep research agents is simple: **they only read text, but the world isn't just text.**

| Scenario | Problem |
|---|---|
| Reading papers | Charts contain key data, but text descriptions may be incomplete |
| Analyzing products | UI design, interaction flows can't be fully described in text |
| Field research | Handwritten notes, scanned documents need OCR |
| Video analysis | Video content can't be retrieved by text-only agents |

WebWatcher's paper states clearly:
> "Most research remains primarily text-centric, overlooking visual information in the real world."

## WebWatcher Architecture

### Core Design

| Component | Function |
|---|---|
| **Vision-Language Reasoning** | Understanding meaning of images, charts, screenshots |
| **Multi-Tool Coordination** | OCR, image search, code execution, web navigation |
| **Think–Act–Observe Loop** | Dynamic decision-making process |

### Training Method

1. **Synthesized multimodal trajectories**: High-quality visual+text synthetic data for cold-start
2. **Multi-tool deep reasoning**: Using various tools for reasoning
3. **RL generalization**: Reinforcement learning for cross-scenario adaptation

### Tool Suite

- Web image search
- Text search
- Web navigation
- Code interpreter
- **OCR** (Optical Character Recognition)

### New Benchmark: BrowseComp-VL

WebWatcher proposes BrowseComp-VL—a benchmark requiring **both visual and text reasoning**:
- Not just text Q&A
- Requires extracting information from images and combining with text
- Simulates real-world multimodal research scenarios

## Key Results

WebWatcher significantly surpassed four challenging VQA (Visual Question Answering) benchmarks:
- Closed-source systems (e.g., OpenAI's vision models)
- RAG workflows
- Open-source agents

Core advantage: **Modular design**—vision reasoning, tool calling, and decision loop are clearly separated and can be independently optimized.

## Series Connections

| Series Article | Connection |
|---|---|
| order 0 (Landscape) | Multimodal is a natural extension of Phase III (Full-stack AI Scientist) |
| order 3 (IterResearch/AREX) | Multimodal agents also need long-term memory |
| order 5 (Tongyi DeepResearch) | Tongyi's Heavy mode can integrate multimodal reasoning |
| order 11 (Open-Source Tools) | Multimodal tools are the new frontier of the open-source ecosystem |

## Trend: From Text to Full Multimodal

```
Text-only (2024) → Text+Image (WebWatcher, 2025) → Full Multimodal (future)
```

WebWatcher is just the beginning. Future deep research agents need to:
- Understand tables, charts, maps, flowcharts
- Process video, audio, 3D models
- Cross-modal synthesis (derive conclusions from one image and one text)

## Key Takeaways

1. **Real-world information is multimodal**—agents that can only read text are "disabled"
2. **Tool coordination matters more than single-model capability**—OCR, image search, and code each do their part
3. **Synthetic data is key**—without large amounts of multimodal trajectories, there can be no multimodal agents

## References

- [WebWatcher: Breaking New Frontier of Vision-Language Deep Research Agent](https://arxiv.org/abs/2508.05748) — Geng et al., NeurIPS 2025, 100+ citations.
- [BrowseComp-VL](https://arxiv.org/abs/2508.05748) — Multimodal browsing benchmark.
- [Tongyi DeepResearch Technical Report](https://arxiv.org/abs/2510.24701) — order 5 of this series, Tongyi's Heavy mode.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.
