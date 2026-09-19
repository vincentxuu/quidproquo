---
title: "Deep Research Landscape: Taxonomy of 80+ Implementations, Roadmap, and Trade-offs"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, survey, ai-agent, taxonomy, llm, roadmap]
lang: en
tldr: "The entire Deep Research field has 80+ implementations, but the core structure is just three-stage roadmap × four components × three optimization methods. This article maps the full landscape: from Agentic Search to Full-stack AI Scientist, from query planning to answer generation, from workflow prompting to end-to-end RL."
description: "A systematic taxonomy of 80+ Deep Research implementations: three-phase capability roadmap (Agentic Search → Integrated Research → Full-stack AI Scientist), four core components (planning, acquisition, memory, generation), and three optimization paradigms (prompting, SFT, RL), clarifying the fundamental distinction from traditional RAG."
draft: false
series:
  name: "Deep Research 前沿"
  order: 0
---

> 🌏 [中文版](/posts/ai/2026-09-19-deep-research-survey-overview)

In 2025, "Deep Research" went from lab concept to product category. OpenAI, Google, Perplexity, and Anthropic all shipped official features; on the open-source side, from GPT-Researcher to Search-R1, 80+ implementations emerged in half a year. But these systems look different on the surface — what actually distinguishes them?

The latest systematic survey (arXiv:2506.12594, November 2025) organizes the entire field into a clear skeleton: **three-stage roadmap × four core components × three optimization methods**. Master this framework and you can instantly see where any implementation sits and what it trades off.

This article starts at the highest level of classification, spreading out the full panorama; specific systems and techniques are covered in subsequent articles.

## Three-Phase Roadmap: From Search to Scientist

The survey's central contribution is viewing Deep Research as a **capability trajectory** rather than a value hierarchy. Systems don't need to arrive fully formed — they progressively expand what they can do across three phases:

| Phase | Capability | Example Tasks | Key Metrics |
|---|---|---|---|
| **Phase I: Agentic Search** | Find correct sources, extract answers | Open-domain QA, multi-hop QA | Accuracy, recall |
| **Phase II: Integrated Research** | Synthesize heterogeneous evidence into structured reports | Long-form research reports, surveys | Coherence, attribution completeness |
| **Phase III: Full-stack AI Scientist** | Propose hypotheses, design experiments, critique claims | Paper reviewing, scientific discovery, experiment automation | Novelty, reproducibility |

Phase I systems are essentially "smart searchers": decompose the user's question into sub-queries, retrieve documents, filter noise, and give citation-backed answers. Phase II requires stitching fragmented evidence into a coherent narrative — here, stopping conditions and conflict resolution become critical. Phase III is the ultimate form: not just compiling known facts, but generating original hypotheses and designing verification experiments.

> The practical value of this taxonomy: **readers can instantly see which phase a system operates in**, and judge whether it fits their needs. Quick fact-finding? Phase I suffices. Writing a complete research report? At least Phase II needed. Automating scientific discovery? That's Phase III territory.

## Four Core Components: The DR Closed Loop

Regardless of phase, every Deep Research system cycles through four components (Shao et al., 2025):

### 1. Query Planning

Decomposes vague, complex questions into a series of independently executable sub-queries. Three strategies:

- **Parallel planning**: Decompose all sub-questions at once, each solved independently. Best for structurally clear problems.
- **Sequential planning**: Each step depends on previous results, dynamically adjusted. Best for exploratory problems requiring "try and see."
- **Tree-based planning**: Explore multiple reasoning paths (e.g., Monte Carlo Tree Search), balancing exploration and exploitation. Best for the most open-ended problems.

Representative works: Least-to-Most Prompting, CoVE (Chain-of-Verification), Search-R1's end-to-end learned planning.

### 2. Information Acquisition

Decides **when** and **how** to retrieve external information. Three sub-questions:

- **Retrieval tools**: Traditional search engine APIs, browser automation, vector databases, multimodal retrieval.
- **Retrieval timing**: Search every step? Only when uncertain? Use confidence-based methods (e.g., Self-RAG) to decide.
- **Information filtering**: Document selection, context compression, rule-based cleaning. From pointwise relevance scoring to list-wise ranking.

This is the most visible boundary between DR and traditional RAG: RAG typically does static retrieval as one-shot augmentation, while DR's retrieval is **iterative, dynamic, and strategic**.

### 3. Memory Management

Maintains task context across long-horizon research. Four processes:

- **Memory consolidation**: Transient information into structured representations (narrative summaries or knowledge graphs).
- **Memory indexing**: Signal-enhanced indexing, graph-based indexing (supporting multi-hop reasoning), timeline indexing.
- **Memory updating**: How new information conflicts with or extends existing knowledge.
- **Memory forgetting**: Actively deleting irrelevant information to prevent context window saturation.

Memory management is often called the "cornerstone" of DR — without it, long research sessions become fragmented shards.

### 4. Answer Generation

Synthesizes accumulated evidence into attributed outputs. Four processes:

- **Integrating upstream information**: Merging plans, retrieval results, and memory states.
- **Synthesizing evidence and maintaining coherence**: Resolving conflicts via credibility-aware attention, multi-agent deliberation, or RL rewards.
- **Structuring reasoning and narrative**: Chain-of-Thought, structured planning, tool-augmented reasoning.
- **Multimodal presentation**: Expanding beyond text to visualizations, presentations, tables, code.

## Three Optimization Paradigms: From Hand-Crafted to End-to-End

How do you make these four components work well together? The survey identifies three approaches (ordered by "hand-crafting" degree):

| Paradigm | Approach | Best For | Representative |
|---|---|---|---|
| **Workflow Prompting** | Manually design multi-agent pipeline, orchestrator delegates to workers | Rapid prototyping, interpretability needed, no training budget | Anthropic multi-agent system (+90.2% internal eval) |
| **Supervised Fine-Tuning (SFT)** | Train smaller models on strong models' successful trajectories (strong→weak distillation) | Deployment efficiency, component-specific optimization | Open-RAG, AUTO-RAG, DeepRAG |
| **End-to-End RL** | Train the entire pipeline with PPO/GRPO, reward final answer correctness | Global optimum pursuit, can tolerate training instability | Search-R1, R1-Searcher, Rewrite-Retrieve-Read |

The trade-off is clear: **workflow prompting is most flexible but most expensive (~15× token consumption); SFT is most practical but depends on strong teacher models; end-to-end RL has the most potential but is the most unstable to train**.

## Fundamental Distinction from RAG

The survey compares RAG and DR across nine dimensions: search engine access, tool diversity, code execution, reflective correction, task memory, innovation capability, long-form output, action space, reasoning horizon, and workflow organization.

Core conclusion: **RAG is "retrieval as static augmentation"; DR is "retrieval as dynamic action"**. RAG has a narrow action space, single-step reasoning horizon, and fixed workflow; DR progressively expands on all dimensions.

## What's Next

This article covers the landscape classification. Subsequent articles will dive into each component: specific training methodologies (order 2–4), evaluation benchmarks and challenges (order 7–9), open-source tools and commercial products (order 11–12), and our own implementation choices (order 13).

## 參考資料

- [Deep Research: A Systematic Survey](https://arxiv.org/abs/2506.12594) — Shao et al., Nov 2025. The core paper: three-phase roadmap, four components, three optimization methods.
- [Deep Research: A Survey of Autonomous Research Agents](https://arxiv.org/abs/2508.12752) — Aug 2025. Capability-centric, modular perspective, focused on how each core capability can be independently optimized.
- [Deep Research Agents: A Systematic Examination And Roadmap](https://arxiv.org/abs/2506.18096) — Huang et al., Jun 2025. Static vs. dynamic workflows, single-agent vs. multi-agent classification.
- [Deep Research Survey GitHub Repository](https://github.com/scienceaix/deepresearch) — Continuously updated repository for the survey paper.
- [awesome-deep-research-agent](https://github.com/ai-agents-2030/awesome-deep-research-agent) — DR agent research list maintained by Huang et al.
- [autonomous-deep-research-agent](/posts/ai/2026-06-04-autonomous-deep-research-agent) — Previous article in this series: architecture breakdown of the four stages.
