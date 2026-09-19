---
title: "Open-Source Tools Overview: GPT-Researcher, STORM, smolagents..."
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, open-source, gpt-researcher, storm, smolagents, comparison]
lang: en
tldr: "The deep research open-source ecosystem has evolved from 'single frameworks' to 'tool clusters.' This article compares 12+ projects: GPT-Researcher emphasizes multi-agent collaboration, STORM simulates expert conversations, smolagents focuses on state management. Each tool solves different problems."
description: "Comprehensive comparison of open-source deep research tool ecosystem: GPT-Researcher (multi-agent + Deep Research features), STORM (expert-conversation style outlines), smolagents (state management), Local Deep Research (local deployment), Feynman (local-first). Analyzes design philosophies and use cases."
draft: false
series:
  name: "Deep Research 前沿"
  order: 11
---

> 🌏 [中文版](/posts/ai/2026-09-19-open-source-tools-overview)

The previous articles covered academic papers. This one covers the **open-source world's implementations**.

The deep research open-source ecosystem has evolved from "single frameworks" to "tool clusters." Each project solves different problems:

- **GPT-Researcher**: Emphasizes multi-agent collaboration and report quality
- **STORM**: Simulates expert conversations to produce structured outlines
- **smolagents**: Focuses on state management and tool coordination
- **Local Deep Research**: Fully local deployment
- **Feynman**: Local-first, can read papers, verify claims

## Open-Source Ecosystem Landscape

### By Design Philosophy

| Category | Representative Projects | Core Features |
|---|---|---|
| **Multi-Agent Collaboration** | GPT-Researcher, AutoGen | Multiple agents working together |
| **Expert Conversation** | STORM | Simulates experts to produce outlines |
| **State Management** | smolagents | Structured state management of tools |
| **Local-First** | Local Deep Research, Feynman | Fully offline operation |
| **Framework** | LangChain-OpenDeepResearch | Composable components |
| **End-to-End** | Tongyi DeepResearch | Complete training pipeline |

### Detailed Comparison

#### GPT-Researcher

- GitHub: assafelovic/gpt-researcher
- Core: Autonomous agent researches web + local files, produces long reports with citations
- Features:
  - Intelligent image extraction (scrapes relevant images from web)
  - 2000+ word reports
  - Multi-agent mode (simulates STORM)
  - **Deep Research features**: Tree exploration mode
  - MCP support
- Strengths: Active community, rich features, reached DeepResearchGym benchmark first place
- Best for: Research tasks requiring rich reports and images

#### STORM (Stanford)

- Core: Simulates expert conversations to produce research outlines
- Process: First produces outlines via "simulated expert discussion," then retrieves evidence based on outlines
- Features: Highly structured long-form articles, approaching Wikipedia quality
- Strengths: Especially clear structure, coherent narrative
- Best for: Highly structured background articles or overview reports

#### smolagents

- Core: Lightweight agent framework emphasizing **state management**
- Features:
  - State as variables (not dependent on LLM memory)
  - Images/audio can be stored as state and reused
  - MCP tool support
- Strengths: Reliable state tracking, suitable for multimodal
- Best for: Long-running tasks with complex state

#### Local Deep Research

- Core: Fully local deployment, no external API dependencies
- Best for: Privacy-sensitive scenarios, offline environments
- Limitations: Model capabilities and tool coverage restricted

#### Feynman

- Core: Local-first research assistant
- Capabilities: Read papers + search web + draft + run workflows + verify claims
- Best for: Academic research, paper review, experiment reproduction

## Benchmark Performance

According to DeepResearchGym (CMU, May 2025):

| System | Citation Quality | Report Quality | Coverage |
|---|---|---|---|
| **GPT-Researcher** | 85.36% | 83.70% | 64.67% |
| OpenAI Deep Research | — | — | — |
| Perplexity | — | — | — |

GPT-Researcher ranked **first in all three categories** on DeepResearchGym (>85% citation precision, >80% report clarity, highest key point recall).

## Design Philosophy Trade-offs

| Design Choice | Trade-off |
|---|---|
| Multi-agent vs. Single-agent | Depth vs. Speed |
| Online vs. Local | Capability vs. Privacy |
| Framework vs. End-to-End | Flexibility vs. Simplicity |
| General vs. Specialized | Breadth vs. Depth |

## Trend Observations

1. **MCP integration**: Most projects are starting to support MCP (Model Context Protocol)
2. **Tree exploration**: From linear search to tree-branch exploration
3. **Multimodal**: From text to images, tables, code
4. **Local-first**: Privacy concerns driving local deployment solutions

## References

- [GPT-Researcher](https://github.com/assafelovic/gpt-researcher) — Multi-agent deep research.
- [STORM](https://arxiv.org/abs/2410.01208) — Stanford, expert-conversation outlines.
- [smolagents](https://github.com/huggingface/smolagents) — Hugging Face, state management.
- [DeepResearchGym](https://arxiv.org/abs/2505.19253) — CMU benchmark.
- [Tongyi DeepResearch](https://arxiv.org/abs/2510.24701) — order 5 of this series, Tongyi Lab complete system.
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — Previous article: three-phase landscape classification.
