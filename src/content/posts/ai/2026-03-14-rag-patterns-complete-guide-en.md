---
title: "The Complete Guide to RAG System Patterns: A Ten-Generation Evolution from Naive to Multi-Agent with Practical Navigation"
date: 2026-03-14
updated: 2026-08-25
type: guide
category: ai
tags: [rag, guide, retrieval, embedding, reranking, evaluation, agent]
lang: en
tldr: "RAG has evolved far beyond simple 'search + generate' into a technology ecosystem spanning ten generations — and since 2025 into an Agentic/Reasoning era. This article is a systematic navigation guide: from Naive RAG to Multi-Agent/LongRAG across ten generations, the post-ten Agentic Era (Search-R1/RL search, MCP, GraphRAG 3.x, vision-native retrieval), retrieval strategies, chunking, embedding, reranking, evaluation frameworks, observability, and cost optimization. Each topic has a dedicated deep-dive article."
description: "A complete navigation guide for RAG systems: ten generations of RAG evolution (Naive -> Advanced -> Modular -> Self-RAG -> CRAG -> Graph RAG -> Speculative -> Agentic -> Multi-Agent -> LongRAG) plus the post-ten Agentic/Reasoning RAG era, retrieval strategies (incl. Late Chunking), chunking, embedding, vector databases, reranking, evaluation frameworks, guardrails, observability, and cost optimization."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 1
---

> 🌏 [中文版](/posts/ai/2026-03-14-rag-patterns-complete-guide)

Search for "RAG" and you'll find hundreds of articles, each talking about something different.

Some explain the three steps of Naive RAG. Others discuss Graph RAG's knowledge graphs. Some cover Agentic RAG's ReAct loop. Others focus on reranking and embedding model selection. They all fall under "RAG," but they solve completely different problems and apply to vastly different scenarios.

The problem isn't too little information — it's **too fragmented**.

This article is a map. It won't dive deep into any single topic — each topic has its own dedicated article. What it does is: give you a bird's-eye view of the entire RAG technology landscape, then help you pick the right path based on your needs.

**Who needs this guide**: Engineers building RAG systems, tech leads who want to understand the full RAG landscape, and anyone lost among the various RAG variants. Whether you're starting from scratch or looking to improve an existing system, this guide will help you find your bearings.

---

## How to Use This Guide

1. **Start with the global architecture diagram**: Understand the relationship between ten generations of RAG and surrounding technologies
2. **Find your stage**: Are you building an MVP? Optimizing quality? Managing production operations?
3. **Jump to the relevant section**: Each section gives you 2-4 paragraphs of overview plus key insights
4. **Click into the deep-dive articles**: Every topic has a standalone, comprehensive article

---

## Global Architecture Diagram

```
                     RAG Technology Landscape
    ┌─────────────────────────────────────────────────────┐
    │                                                     │
    │  ┌────────── Ten Generations ─────────────────────┐ │
    │  │                                               │  │
    │  │  Gen 1: Naive RAG (Search + Generate)         │  │
    │  │    ↓                                          │  │
    │  │  Gen 2: Advanced RAG (Pre/Post-processing)    │  │
    │  │    ↓                                          │  │
    │  │  Gen 3: Modular RAG (Composable DAG)          │  │
    │  │    ↓                                          │  │
    │  │  Gen 4: Self-RAG (LLM decides whether to      │  │
    │  │         search)                               │  │
    │  │    ↓                                          │  │
    │  │  Gen 5: CRAG (Retry on bad results)           │  │
    │  │    ↓                                          │  │
    │  │  Gen 6: Graph RAG (Knowledge graph reasoning) │  │
    │  │    ↓                                          │  │
    │  │  Gen 7: Speculative RAG (Small model drafts)  │  │
    │  │    ↓                                          │  │
    │  │  Gen 8: Agentic RAG (Autonomous Agent)        │  │
    │  │    ↓                                          │  │
    │  │  Gen 9: Multi-Agent RAG (Multi-Agent          │  │
    │  │         collaboration)                        │  │
    │  │    ↓                                          │  │
    │  │  Gen 10: LongRAG (Long context replaces       │  │
    │  │          fine chunking)                       │  │
    │  │                                               │  │
    │  └───────────────────────────────────────────────┘  │
    │  ┌────── Post-Ten: Agentic Era (2025-) ──────┐  │
    │  │ Reasoning × Retrieval + RL + Multi-tool     │  │
    │  │ Search-R1 / REX-RAG / AlignRAG / GTA-RAG    │  │
    │  │ Deep Research (product) + MCP (protocol)    │  │
    │  └───────────────────────────────────────────┘  │
    │                                                     │
    │  ┌─ Retrieval Strategies ─┐ ┌─── Infrastructure ──┐ │
    │  │ BM25 + Vector          │ │ Chunking            │ │
    │  │ HyDE                   │ │ Embedding           │ │
    │  │ Multi-Query            │ │ Vector DB           │ │
    │  │ Cross-Encoder          │ │ Prompt Design       │ │
    │  │ ColBERT / SPLADE       │ │ Streaming           │ │
    │  │ RRF / MMR              │ │ Memory              │ │
    │  │ Semantic Cache          │ └─────────────────────┘ │
    │  │ Text-to-SQL            │                         │
    │  │ Late Chunking          │ ┌─ Quality & Ops ─────┐ │
    │  └────────────────────────┘ │ Evaluation          │ │
    │  ┌─── Frontier ──────────┐  │ Guardrails          │ │
    │  │ Agent Memory          │  │ Observability       │ │
    │  │ Multimodal RAG        │  │ Cost / A/B Test     │ │
    │  └───────────────────────┘  └─────────────────────┘ │
    │                                                     │
    └─────────────────────────────────────────────────────┘
```

---

## Generation Comparison Overview

| Generation | One-line Description | Core Strength | Use Case |
|------|-----------|---------|---------|
| Gen 1: Naive | Search -> stuff into prompt -> generate | Simplest, fastest to run | MVP, PoC, internal tools |
| Gen 2: Advanced | Add query rewrite, reranking, chunk optimization | Major quality improvement | First production version |
| Gen 3: Modular | Break pipeline into composable modules | Flexibility, testability | Products needing customization |
| Gen 4: Self-RAG | LLM decides whether to search | Reduces unnecessary retrieval | Hybrid knowledge Q&A |
| Gen 5: CRAG | Auto-correct and retry on bad search results | Fault tolerance | Open-domain Q&A |
| Gen 6: Graph RAG | Knowledge graph + vector search | Relationship reasoning | Regulations, healthcare, complex knowledge networks |
| Gen 7: Speculative | Small models draft in parallel, large model verifies | Low latency, low cost | High-throughput scenarios |
| Gen 8: Agentic | Autonomous Agent + ReAct loop | Multi-step reasoning | Complex research-type questions |
| Gen 9: Multi-Agent | Multiple specialized Agents collaborate | Scalability, specialization | Enterprise multi-domain systems |
| Gen 10: LongRAG | Large chunks + long-context models | Preserves full context | Long documents, legal contracts |
| Post-Ten: Agentic Era | Reasoning × Retrieval + RL + multi-tool | Autonomous research, cross-tool integration | Complex research, enterprise deep Q&A |

> Post-ten has no consensus Gen 11 number — treat it as an *Agentic Era* rather than a linear continuation. For generation boundaries, see the two 2025 surveys: [Towards Agentic RAG with Deep Reasoning](https://arxiv.org/abs/2507.09477) and [Reasoning RAG via System 1 or System 2](https://arxiv.org/abs/2506.10408).

### Maturity Spectrum

Not every generation is equally mature. When choosing, consider the production-readiness of the technology:

- **Proven** (extensive production use cases): Gen 1 Naive, Gen 2 Advanced, Gen 3 Modular
- **Maturing** (production use cases exist but still rapidly evolving): Gen 5 CRAG, Gen 6 Graph RAG ([GraphRAG now at v3.1.2](https://github.com/microsoft/graphrag/releases)), Gen 8 Agentic RAG, Gen 9 Multi-Agent (supervisor/orchestrator patterns now ship with the mainstream agent frameworks)
- **Early adoption** (mostly papers and experiments, limited general framework support): Gen 4 Self-RAG (needs purpose-built training), Gen 7 Speculative (needs your own distilled drafter), Gen 10 LongRAG
- **Frontier validation** (2025-): Agentic/Reasoning RAG (e.g., [Search-R1](https://arxiv.org/abs/2503.09516) RL multi-turn search, [AlignRAG](https://arxiv.org/abs/2504.14858) test-time critique) and [MCP](https://modelcontextprotocol.io/specification/2025-06-18) tool integration — productized ([OpenAI Deep Research](https://openai.com/index/introducing-deep-research/)) but fast-moving, not a stable baseline yet

---

# Part 1: Ten Generations of RAG Evolution

## Gen 1-3: Naive -> Advanced -> Modular

### Gen 1: Naive RAG

The most primitive form of RAG: take the user's question, perform a vector search, find the most relevant chunks, stuff them all into the prompt, and let the LLM generate an answer. Three steps: Indexing -> Retrieval -> Generation.

Architecture in one sentence: `Query -> Embed -> Vector Search -> Top-K Chunks -> LLM -> Answer`

It works, but it has many problems. The semantics of the query and document don't always align, chunking strategy has a huge impact, retrieved results may be irrelevant, and the LLM may ignore context and hallucinate on its own. Every link in the chain is a potential failure point. Most teams get stuck on Naive RAG for two to three weeks before realizing that "just stuffing it in" isn't enough.

### Gen 2: Advanced RAG

The core improvement of Advanced RAG is adding a processing layer before and after Retrieval. **Pre-processing**: query rewriting, HyDE, multi-query expansion — making search more precise. **Post-processing**: reranking, compression, deduplication — improving the quality of context sent to the LLM.

Architecture in one sentence: `Query -> Pre-process -> Retrieve -> Post-process -> Generate`

This is the starting point for most production systems. Simply adding Cross-Encoder reranking usually gives a clear improvement in the quality of the context you hand the LLM. There is no universal number for the gain — it depends on how weak your base retriever is, how large a top-K you rerank, and how homogeneous your data is, so measure it on your own data instead of copying a percentage from someone's blog. If you can only do one thing to improve Naive RAG, add reranking.

### Gen 3: Modular RAG

Modular RAG breaks the entire pipeline into independent modules — Routing, Retrieval, Reranking, and Generation are each a replaceable component. Think of it as a DAG (Directed Acyclic Graph) where each node handles one task, connected through standard interfaces.

Architecture in one sentence: `Query -> Router -> [Module A | Module B | Module C] -> Merge -> Generate`

This lets you A/B test individual components, dynamically switch strategies based on query type, and even implement fallback between modules. Most mature RAG products eventually move toward a Modular architecture because you'll inevitably encounter "this type of question needs a different path."

-> Deep dive: [The Three Generations of RAG: From Naive to Modular](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution-en)
-> Deep dive: [Modular RAG Pipeline: Designing RAG as a Composable DAG](/posts/ai/2026-03-12-modular-rag-pipeline-architecture-en)

---

## Gen 4: Self-RAG

The key breakthrough of Self-RAG: **the LLM decides for itself whether to retrieve**.

Traditional RAG searches for every question, but the LLM already knows the answer to many of them — "How do you write a list comprehension in Python?" doesn't need a search. Self-RAG trains the model to output special reflection tokens: `[Retrieve]` decides whether to search, `[ISREL]` judges whether search results are relevant, `[ISSUP]` judges whether the generated answer is supported by context.

```
User Query
    ↓
LLM: Need to search? ──→ [No Retrieve] → Generate directly
    ↓ [Retrieve]
Search → Results relevant? ──→ [ISREL=No] → Discard, try another batch
    ↓ [ISREL=Yes]
Generate answer → Supported by context? ──→ [ISSUP=No] → Regenerate
    ↓ [ISSUP=Yes]
Output final answer
```

The benefit of Self-RAG is reducing unnecessary searches (lowering latency and cost) while ensuring result quality when search is needed. The downside is it requires special training — you can't point it at an off-the-shelf general API model; you need a model fine-tuned to emit reflection tokens (the original paper released Llama 2-based weights).

Use case: When knowledge base content significantly overlaps with the LLM's own knowledge, Self-RAG can avoid redundant searches. If your questions almost always require search (e.g., enterprise internal document Q&A), Self-RAG offers little benefit.

---

## Gen 5: CRAG (Corrective RAG)

The problem CRAG solves is straightforward: **What do you do when search results are bad?**

Naive RAG uses whatever it finds, even if the results are completely irrelevant. CRAG adds an Evaluator after Retrieval, using a lightweight model (or LLM) to score search results. If the score is high, use them directly; if the score is low, trigger correction strategies — broaden search conditions, switch to a different search engine, or even use web search as a fallback.

Architecture in one sentence: `Query -> Retrieve -> Evaluate(relevant/uncertain/irrelevant) -> [Use | Refine | Web Search] -> Generate`

This "correct when search fails" mechanism prevents the RAG system from failing outright on edge cases, automatically trying different strategies instead. The [CRAG paper](https://arxiv.org/abs/2401.15884) reports significant gains across four short- and long-form generation datasets, but the size of the gain varies a lot with the dataset and the underlying retriever — what it establishes is "adding a correction layer makes things more robust," not a fixed percentage.

CRAG's practical value lies in the fact that it doesn't require changing your existing search engine — it's a layer added after search results come back. This means you can "bolt on" CRAG to any existing RAG system without redesigning the pipeline.

-> Deep dive: [CRAG: Automatically Broadening Conditions and Retrying When Retrieval Fails](/posts/ai/2026-03-12-corrective-rag-crag-en)

---

## Gen 6: Graph RAG

Vector search excels at finding "semantically similar passages," but it's not good at **relationship reasoning**.

"Does this drug interact with that drug?" "Which other regulations does this regulation reference?" "What role does this person hold at this company, and which companies does this company partner with?" — These questions require not finding similar text, but traversing **relationship chains**.

Graph RAG extracts entities and relationships from documents, builds them into a Knowledge Graph, then queries both the vector index and the graph during retrieval. Vector search finds relevant document fragments; the graph finds relevant entity relationships; the two are merged before being sent to the LLM.

Architecture in one sentence: `Query -> [Vector Search + Graph Traversal] -> Merge Context -> Generate`

Microsoft's [GraphRAG paper](https://arxiv.org/abs/2404.16130) further proposed the concept of Community Summary: pre-generating summaries for communities (highly interconnected node clusters) in the graph, enabling the system to answer questions requiring "global understanding."

Building Graph RAG costs significantly more than pure vector search — you need entity extraction, relationship modeling, and graph maintenance. But in "relationship-dense" domains like regulatory compliance, healthcare knowledge, and enterprise organizational relationships, the investment is worthwhile.

-> Deep dive: [GraphRAG: Building Knowledge Graphs for LLM Relationship Reasoning](/posts/ai/2026-03-12-graph-rag-en)
-> Deep dive: [GraphRAG 3.x vs LightRAG vs HippoRAG 2: Three-Axis Selection on Index Cost, Incrementality and Memory](/posts/ai/2026-08-25-graphrag-lightrag-hipporag-en)

---

## Gen 7: Speculative RAG

Speculative RAG borrows from Speculative Decoding: **use small models for initial work, large models for final verification**.

The specific approach: a small, distilled specialist model (7B-class in the original paper) simultaneously generates multiple candidate answer drafts, each based on a different subset of retrieved chunks. Then a large generalist model evaluates all drafts at once, selecting the best one. Which specific models sit on each side matters less than the structure: many small draft passes, one large verification pass.

```
Retrieved Chunks: [C1, C2, C3, C4, C5]
    ↓
Small model (parallel):
    Draft 1 (based on C1, C2)
    Draft 2 (based on C2, C3)
    Draft 3 (based on C4, C5)
    ↓
Large model (single verification): Select Draft 2 → Final answer
```

The benefits are low latency (small models run fast and in parallel) and low cost (the large model only does one verification, not full generation). The [Speculative RAG paper](https://arxiv.org/abs/2407.08223) reports accuracy up to 12.97 percentage points higher (76.60 against 63.63 — an absolute difference, not a relative gain) and 50.83% lower latency on PubHealth; those are the best-case numbers on that dataset, and the margins on TriviaQA, MuSiQue, PopQA, and ARC-Challenge are considerably smaller, so don't treat them as typical. Also note the precondition: the numbers assume a distilled specialist drafter, not any off-the-shelf 7B model.

Key insight: Speculative RAG essentially trades compute parallelism for latency. If your bottleneck is insufficient GPUs rather than high latency, this pattern will actually make things worse.

-> Deep dive: [Speculative RAG: Small Models Draft in Parallel, Large Model Verifies at Once](/posts/ai/2026-03-15-speculative-rag-en)

---

## Gen 8: Agentic RAG

All previous generations of RAG are **single-pass flows**: query comes in, pipeline runs once, answer goes out. Agentic RAG breaks this limitation — it turns the LLM into an **autonomous Agent** that can search multiple times, reflect, and adjust strategies.

The core mechanism is the ReAct loop (Reasoning + Acting): the LLM first thinks ("What information does this question need?"), then acts (search, call APIs, compute), observes results, and decides the next step. This loop can run multiple rounds until the Agent believes it has enough information to answer.

Agentic RAG is particularly suited for **complex research-type questions** — those that need to be decomposed into multiple sub-questions, gather information from different sources, and synthesize into an answer. The downsides are high latency (potentially 3-10 rounds), high cost (each round is an LLM call + search), and the Agent may go off track.

Architecture in one sentence: `Query -> Agent(Think -> Act -> Observe -> Think -> ...) -> Answer`

Beyond ReAct, there's also the Plan-and-Execute pattern: let the LLM create a complete plan first, then execute it step by step. This performs better in scenarios requiring systematic information gathering.

When should you use Agentic RAG? A simple rule of thumb: if the user's question requires more than one search to answer (e.g., "Compare the revenue growth rates of Company A and Company B" requires searching for each company separately), consider Agentic RAG.

-> Deep dive: [Agentic RAG: Letting the LLM Decide Whether to Search Again](/posts/ai/2026-03-12-agentic-rag-react-loop-en)
-> Deep dive: [Plan-and-Execute: Plan First, Then Execute RAG Pattern](/posts/ai/2026-03-12-plan-and-execute-rag-en)

---

## Gen 9: Multi-Agent RAG

When a system needs to cover multiple specialized domains, a single Agent struggles to handle everything well. Multi-Agent RAG's approach: **one specialized Agent per domain, plus an Orchestrator for assignment and consolidation**.

For example, an enterprise knowledge Q&A system: an HR Agent specializes in searching personnel policy documents, a Legal Agent searches regulations and contracts, a Tech Agent searches technical documents. The user's question first goes to the Orchestrator, which determines which Agent to ask (or asks multiple simultaneously), then merges the results into a final answer.

Architecture in one sentence: `Query -> Orchestrator -> [Agent_HR | Agent_Legal | Agent_Tech] -> Merge -> Answer`

The advantage of Multi-Agent is that each Agent can have its own search strategy, its own prompt, and its own knowledge base, without interference. The challenges are designing the communication protocol between Agents, the logic for merging results, and controlling overall latency.

In practice, the biggest pitfall of Multi-Agent RAG isn't technical — it's "how to draw responsibility boundaries between agents." If two agents' knowledge domains overlap, the orchestrator doesn't know whom to ask, and the result is actually worse than a single agent.

-> Deep dive: [Multi-Agent RAG: Distributed Retrieval Architecture with Multiple Specialized Agents](/posts/ai/2026-03-16-multi-agent-rag-patterns-en)

---

## Gen 10: LongRAG

LongRAG challenges a fundamental assumption of RAG: **Do chunks have to be small?**

Traditional RAG splits documents into 256-512 token chunks because early LLMs had small context windows (4K-8K) that couldn't fit much. But today's models easily handle 128K-1M context windows, so this limitation no longer exists.

LongRAG uses large chunks (or even entire documents) paired with long-context models. The benefit is preserving complete context — no more "the answer got split across two chunk boundaries." Search precision requirements are also lower because large chunks naturally have higher hit rates.

Architecture in one sentence: `Query -> Coarse Retrieval (large chunks) -> Long-Context LLM -> Answer`

The tradeoff is dramatically increased token usage (large chunks mean more tokens sent to the LLM) and increased latency. LongRAG is suited for scenarios with high completeness requirements and lower cost sensitivity, such as legal contract analysis and long research paper Q&A.

An interesting trend: context limits keep growing and per-token prices keep falling, so LongRAG's cost disadvantage keeps shrinking. The specific limits and prices change every few months, so no numbers here — check your provider's official docs.

But "more context" does not mean "better answers." Long-context models still suffer from position bias and attention dilution on very long inputs; putting something in the window does not guarantee the model reads it. The pragmatic compromise: small knowledge bases can go straight to large chunks plus long context, large knowledge bases still need traditional chunking + retrieval — and either way you validate with an eval set rather than assuming "a big enough context window solves it."

-> Deep dive: [LongRAG: Rethinking RAG Chunking Strategy with Long-Context Models](/posts/ai/2026-03-15-longrag-long-context-retrieval-en)

---

## Post-Ten: Agentic / Reasoning RAG (2025-)

If Gen 1-10 progressively enhanced the single-pass "retrieve → generate" pipeline, the 2025 cluster **interleaves reasoning and retrieval**: the model autonomously emits multiple search queries mid-reasoning, trained with RL to learn *when* to search, *what* to search, and *how* to use results. This is not a subdivision of a single Gen — two independent surveys define it as a new paradigm ([Towards Agentic RAG with Deep Reasoning](https://arxiv.org/abs/2507.09477)'s *Synergized RAG-Reasoning* and [Reasoning RAG via System 1/2](https://arxiv.org/abs/2506.10408)'s *Reasoning Agentic RAG*).

The technical起点 is [Search-R1](https://arxiv.org/abs/2503.09516) (2025-03): RL (retrieved token masking + outcome reward) trains an LLM to search autonomously in multiple turns while reasoning, with significant gains over RAG baselines on Qwen2.5. Branches include [REX-RAG](https://arxiv.org/abs/2508.08149) (policy correction for RL dead-ends), [GTA-RAG](https://arxiv.org/abs/2608.22479) (graph-trajectory distillation), [Interact-RAG](https://arxiv.org/abs/2510.27566) (turning retrieval from a black-box query into steerable corpus interaction), and [AlignRAG](https://arxiv.org/abs/2504.14858) (test-time critique to align reasoning with evidence). Details are deferred to dedicated deep dives; this section only sets the boundary and hands off.

Product and protocol落地 matter as much: [OpenAI Deep Research](https://openai.com/index/introducing-deep-research/) (2025-02-02, o3-optimized multi-step browsing + Python tool agent) productizes Agentic RAG end-to-end; [MCP (Model Context Protocol)](https://modelcontextprotocol.io/specification/2025-06-18) (open-sourced by Anthropic 2024-11-25) generalizes "retrieval" from vector-store lookup to unified tool/data-source invocation (Resources / Tools / Prompts), now adopted by ChatGPT, Claude, VS Code, Cursor and integrated into orchestration runtimes like [LangGraph 1.2.11](https://github.com/langchain-ai/langgraph/releases). In the ten-generation taxonomy, this is an infrastructure generation jump, not a single trick.

Pragmatic note: Agentic tricks are not universally better. An [Agent-Orchestrated Adaptive RAG comparative study](https://arxiv.org/abs/2606.05658) shows query decomposition helps on structured domains but can hurt ranking precision on multi-hop tasks, and reflection improves citation precision at higher latency. Whether to adopt this era depends on whether your problems truly need multi-turn reasoning and cross-tool orchestration.

-> Deep dive: [Agentic / Reasoning RAG: From Search-R1 to Deep Research and MCP](/posts/ai/2026-08-25-agentic-reasoning-rag-en)

---

## Frontier: MCP Tool Integration (2025 Protocol Layer)

Open-sourced by Anthropic in Nov 2024, [MCP](https://modelcontextprotocol.io/specification/2025-06-18) generalizes RAG "retrieval" from vector-store lookup to unified tool/data-source invocation. Host / Client / Server plus Resources / Tools / Prompts and Sampling / Roots / Elicitation negotiation let one MCP server serve multiple agent frameworks. Adopted in 2025 by ChatGPT, Claude, VS Code and Cursor, and integrated into [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) (1.2.11 durable execution / human-in-the-loop / streaming *orchestration runtime*), [CrewAI](https://github.com/crewAIInc/crewAI/releases) and [AutoGen 0.7](https://github.com/microsoft/autogen/releases). For new systems, prefer MCP-first with custom tool-use as fallback, minding host authorization and untrusted tool descriptions.

---

## Frontier: Agent Memory

RAG is fundamentally **read-only** — the system reads data from the knowledge base but never writes back. Agent Memory upgrades RAG into a **read-write system**.

As an Agent interacts with users, it writes learned preferences, facts, and decisions into memory storage. During the next interaction, these memories are retrieved alongside the knowledge base. This enables the Agent to continuously learn and personalize, rather than being a stateless Q&A machine.

Memory systems typically have three layers: Working Memory (context of the current conversation), Episodic Memory (summaries of past conversations), and Semantic Memory (extracted facts and preferences). These three layers plus the external knowledge base form the Agent's complete cognitive system.

-> Deep dive: [Agent Memory Systems: Evolution from RAG to Read-Write Memory](/posts/ai/2026-03-19-agent-memory-systems-en)

---

## Frontier: Multimodal RAG

Text is just one form of knowledge. Much of an enterprise's knowledge is scattered across charts in PDFs, architecture diagrams in presentations, product photos, and even videos and recordings.

Since 2025 the main line has shifted from "OCR → text → index" to **vision-native retrieval**: [ColPali](https://arxiv.org/abs/2407.01449) (ICLR 2025) embeds page images directly with a VLM plus ColBERT late interaction, [Qwen2.5-VL](https://qwenlm.github.io/blog/qwen2.5-vl/) (2025-01-26, 3B/7B/72B, dynamic resolution + 1hr video understanding) works as a backbone; the old `colpali-engine` is deprecated in favor of [Sentence Transformers v6 MultiVectorEncoder](https://github.com/illuin-tech/colpali). For evaluation, use [ViDoRe V2](https://arxiv.org/abs/2505.17166) (V1 saturated at >90% nDCG@5, new version adds blind contextual / long cross-doc queries).

In practice, the biggest challenge of multimodal RAG isn't model capability but pipeline complexity — PDF parsing, table extraction, image OCR, frame-by-frame video analysis — each step can fail; vision-native retrieval preserves fidelity but multi-vector storage bloat requires compression such as [token pooling (pool factor 3 → -66.7% vectors at 97.8% performance)](https://arxiv.org/abs/2505.17166).

-> Deep dive: [Multimodal RAG: Bringing Images into the Knowledge Base](/posts/ai/2026-03-12-multimodal-rag-en)

---

# Part 2: Retrieval Strategies

Retrieval is the heart of a RAG system. Use the wrong strategy, and no amount of LLM power downstream can save you. Below are the main retrieval strategies and the problems each one solves.

## Retrieval Strategy Quick Selection

| Your Problem | What to Use | Why |
|---------|---------|-------|
| Vector search misses exact keywords | Hybrid Search (BM25 + Vector) | Two search types complement each other |
| Query and document use different wording | HyDE | Hypothetical answer bridges the semantic gap |
| Single query has insufficient coverage | Multi-Query Expansion | Search from multiple angles |
| Top-K results are poorly ranked | Cross-Encoder / Listwise Reranking | Precise re-ranking; since 2025 try jina-reranker-v3.5 |
| Need both speed and precision | ColBERT | Late interaction compromise |
| BM25 is too dumb but need sparse vectors | SPLADE | Learned sparse vectors (v3 is the new baseline) |
| Multiple result lists need merging | RRF / DBSF | Rank fusion, no training; Qdrant Hybrid shows both beat single-path |
| Results are too homogeneous | MMR | Relevance + diversity |
| Chunks lack context | Contextual Retrieval / Late Chunking | Add context prefix vs encode-then-chunk (zero LLM cost) |
| Different questions need different paths | Query Classification | Route at the entry point |
| Too many repeated questions | Semantic Caching | Semantic cache |
| Answer is in structured data | Text-to-SQL Router | SQL is more accurate than search |

## Hybrid Search: BM25 + Vector + RRF

Vector search excels at semantic matching but misses exact keywords. BM25 excels at keyword matching but doesn't understand semantics. Hybrid Search uses both, then merges rankings via RRF (Reciprocal Rank Fusion). This is the most common search architecture in production systems today.

-> [Hybrid Search: Using BM25 + Vector Search to Cover Each Other's Blind Spots](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en)

## HyDE: Hypothetical Answer Search

Users' questions and documents have different language styles, resulting in low vector search recall. HyDE first has the LLM generate a "hypothetical answer," then uses that hypothetical answer for searching. Because the hypothetical answer's language style is closer to real documents, recall usually improves — but the size of the gain depends heavily on the domain and the base retriever (the original paper compares against Contriever in a zero-shot, no-labelled-data setting), and the advantage narrows once you have labelled data to fine-tune a retriever with.

-> [HyDE: Improving Vector Search Recall with Hypothetical Answers](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings-en)

## Multi-Query Expansion

One question can be phrased in many ways. Multi-Query has the LLM rewrite the original question into 3-5 queries from different angles, each performing a search, with results merged at the end. This catches documents that a single query would miss.

-> [Multi-Query Expansion: One Question, Multiple Search Angles](/posts/ai/2026-03-12-multi-query-expansion-en)

## Cross-Encoder Reranking (incl. Listwise)

Vector search uses bi-encoders — query and document each get their own embedding, then compared. Fast but imprecise. Cross-Encoders concatenate query and document and feed them into the model together, yielding much higher precision but slower speed. The typical approach: use vector search to pull back top-50, then Cross-Encoder reranks to top-5. Since 2025, [jina-reranker-v3/v3.5](https://arxiv.org/abs/2509.25085) (0.6B listwise, BEIR 63.20 matching a 4B model, +9.6 on semi-structured, with further latency cuts) places the query with multiple candidates in one context window with causal attention to compare candidates directly — suitable for semi-structured and cross-document comparison; validate on your own labeled set rather than copying leaderboard numbers.

-> [Cross-Encoder Reranking: Getting the Most Relevant Documents to the Top](/posts/ai/2026-03-12-cross-encoder-reranking-en)

## ColBERT: Late Interaction

ColBERT is a compromise between bi-encoders and cross-encoders. It computes an embedding for every token in both query and document, performing token-level interaction matching during search. More precise than bi-encoders, faster than cross-encoders.

-> [ColBERT: The Third Path in Vector Search](/posts/ai/2026-03-12-colbert-late-interaction-en)

## SPLADE: Learned Sparse Vectors

BM25 relies on term frequency; SPLADE uses BERT to learn weights for each token, producing sparse vectors. It combines the advantages of keyword matching (sparse) and semantic understanding (learned). The 2024 [SPLADE-v3](https://arxiv.org/abs/2403.06789) is a stronger sparse baseline on MS MARCO and can serve as a quantifiable upgrade after BM25 in the Hybrid section — measure BM25 gains first before adding learned sparse.

-> [SPLADE: Smarter Sparse Vector Search than BM25](/posts/ai/2026-03-12-splade-sparse-vectors-en)

## RRF: Multi-Source Result Fusion

When you have multiple search result lists (e.g., BM25 results and vector search results), RRF uses a simple formula to merge them based on rank position. No score normalization needed, no training needed — plug and play. A 2025 [Qdrant Hybrid study](https://qdrant.tech/articles/hybrid-search/) shows dense+sparse dual prefetch + RRF/DBSF beats single-path on 5 datasets with ~0.6–1.47ms extra (single-container single-concurrency baseline; re-measure in your setup) — "measure first, then add learned sparse" remains a robust flow.

-> [RRF: How to Merge Multi-Source Results in RAG Systems](/posts/ai/2026-03-12-rrf-multi-source-fusion-en)

## MMR: Diversity Reranking

If your top-5 search results all talk about the same thing, you've effectively wasted 4 context slots. MMR (Maximal Marginal Relevance) considers both relevance and diversity when ranking, ensuring results cover different aspects.

-> [MMR + Popularity Weighting: Making Recommendations Both Relevant and Diverse](/posts/ai/2026-03-12-mmr-diversity-reranking-en)

## Contextual Retrieval

A method proposed by Anthropic — [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval): during the indexing phase, add a context segment to each chunk ("This passage is from a certain document's certain section, discussing a certain topic"). During search, this context is matched together, dramatically improving chunk discoverability. The Sep 2024 official numbers show Contextual Embeddings + Contextual BM25 cutting failure from 5.7% to 1.9% (with rerank) at ~$1.02/1M tokens (benchmark assumption; varies by chunk size/model).

A zero-LLM-cost alternative is [Late Chunking](https://arxiv.org/abs/2409.04701): encode the whole document with a transformer once, then split into chunks and mean-pool so each chunk vector naturally carries cross-chunk context, needing no per-chunk LLM call for prefix generation — suitable for long-context embedding models (32K window) and budget-constrained scenarios; benefits diminish on super-long documents or highly independent chunks. The two are not mutually exclusive; choose by cost and window size or measure head-to-head.

-> [Contextual Retrieval: Adding "What This Passage Is About" to Every Chunk](/posts/ai/2026-03-12-contextual-retrieval-en)
-> Deep dive: [Late Chunking vs Contextual Retrieval: Zero-Cost Alternative and Implementation](/posts/ai/2026-08-25-late-chunking-contextual-retrieval-en)

## Query Classification

Not all questions should take the same path. Factual questions use precise search, analytical questions use deep search, casual chat responds directly without searching. Query Classification classifies questions at the pipeline entry point and selects different strategies based on question type.

-> [Query Classification: Letting RAG Know How to Answer This Question](/posts/ai/2026-03-12-query-classification-adaptive-routing-en)

## Semantic Caching

Semantically similar questions ("What's the weather in Taipei" and "What's the current temperature in Taipei") don't need to run the full pipeline twice. Semantic Cache uses vector similarity to determine if a new query is close enough to a previous one, and if so, returns the cached answer directly.

-> [Semantic Caching: Run RAG Only Once for Semantically Similar Questions](/posts/ai/2026-03-12-semantic-caching-en)

## Text-to-SQL Router

Some questions have answers in structured data (databases), where vector search is less effective than writing SQL directly. The Text-to-SQL Router determines whether a question is suitable for conversion to a SQL query and, if so, routes it to the database path instead of RAG.

-> [Text-to-SQL Router: Precise Queries Skip RAG](/posts/ai/2026-03-12-text-to-sql-router-en)

---

# Part 3: Infrastructure

Half of RAG's effectiveness depends on infrastructure choices — how to chunk, which embedding to use, which vector database to choose. These decisions are made early in the project, and changing them later is costly.

## Infrastructure Decision Order

When building a RAG system, infrastructure decisions have a specific order. First decide on the Chunking strategy (because it affects everything downstream), then select the Embedding model (because once chosen, it's hard to switch — changing models means re-embedding all documents), then choose the vector database, and finally design the prompt.

```
Chunking -> Embedding -> Vector DB -> Prompt Design -> Streaming
   ↑                                                    ↓
   └──── If results are poor, you usually need ─────────┘
         to start fixing from here
```

## Chunking Strategies

Chunking method directly determines whether RAG can find the answer. Too small loses context; too large introduces noise. Common strategies include: fixed size, paragraph/sentence-based, recursive splitting, and semantic splitting (using embedding similarity to determine boundary points). There is no "best size" — you need to experiment based on your document types and question types.

-> [Chunking Strategies: How You Split Determines Whether RAG Can Find the Answer](/posts/ai/2026-03-12-chunking-strategies-en)

## Embedding Model Selection

For Traditional Chinese RAG systems, embedding model selection is particularly important. [BGE-M3](https://huggingface.co/BAAI/bge-m3) is a common starting point — it supports dense, sparse, and multi-vector retrieval in one model and does reasonably well on Traditional Chinese. But embedding leaderboards turn over quickly, so treat no model as settled: weigh language coverage, dimensionality, maximum token length, and above all the benchmark you run on your own data. New lines to benchmark in 2025-2026 include [jina-embeddings-v5-text](https://arxiv.org/abs/2602.15547) (distillation + task contrastive, sub-1B small at 32K context), [jina-embeddings-v4](https://arxiv.org/abs/2506.18902) (3.8B multimodal dual-mode, chart/table SOTA) and [Jina-ColBERT-v2](https://arxiv.org/abs/2408.16672) (late-interaction multi-vector) — compare as three branches (small/efficient vs multimodal/vision vs multi-vector) against BGE-M3 rather than a single swap.

-> [BGE-M3: Why This Embedding Model Suits Traditional Chinese RAG](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en)

## Vector Database Selection

Vector database feature matrices move fast enough that any table written down here would be stale within months, so there isn't one. What stays stable are the tradeoff axes: fully managed versus self-hosted, single-node versus distributed, native hybrid search and metadata filtering or not, and where it deploys (a cloud region or the edge). Narrow the field to two or three candidates on those axes, then check each vendor's official docs ([Pinecone](https://www.pinecone.io/), [Weaviate](https://weaviate.io/), [Qdrant](https://qdrant.tech/), [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)) for current features and pricing. Notable 2025-2026 increments: [Qdrant 1.19 Turbo4](https://qdrant.tech/blog/qdrant-1.19.x/) (pure 4-bit quantization, 9× storage cut, three memory tiers pinned/cached/cold) and [Weaviate 1.30 BlockMax WAND](https://weaviate.io/blog/weaviate-1-30-release) (up to 10× lexical search speedup, multi-vector GA + quantization), plus the [Qdrant Hybrid RRF/DBSF measurements](https://qdrant.tech/articles/hybrid-search/) noted above — quantization and hybrid retrieval are now defaults, not add-ons.

-> [Vector Database Selection: How to Choose Between Pinecone, Weaviate, Qdrant, and Vectorize](/posts/ai/2026-03-12-vector-database-comparison-en)

## Prompt Design

RAG prompt design isn't just "stuffing context in." Pay attention to: the arrangement of context and instructions, citation format, how to instruct the LLM to say "I don't know" when context is insufficient, and how to make the LLM cite answer sources. Good prompt design can produce vastly different answer quality from the same set of retrieved chunks.

-> [RAG Prompt Engineering: How to Design System Prompts and Context](/posts/ai/2026-03-12-rag-prompt-engineering-en)

## Streaming

Users don't want to wait 10 seconds to see a complete answer. SSE (Server-Sent Events) lets the LLM's response display as it generates, dramatically improving user experience. When implementing, pay attention to citation handling during streaming, error handling, and abort mechanisms.

-> [RAG Streaming: SSE for Displaying LLM Responses as They Generate](/posts/ai/2026-03-12-rag-streaming-sse-en)

## Personalization and Memory

Let the RAG system remember user preferences — language style, frequently asked topics, context from the last conversation. This isn't just chat history, but extracting structured preference data from conversations to use as additional context during the next search and generation.

-> [RAG Personalization: Learning User Preferences from Conversations](/posts/ai/2026-03-12-memory-personalization-en)

---

# Part 4: Quality and Operations

Launching a RAG system is just the beginning. The real challenges are: How do you know if it's performing well? How do you prevent it from failing? How do you continuously improve while controlling costs?

## Quality Operations Priority Order

If you've just launched, build quality infrastructure in this order:

1. **Evaluation** (you can't improve what you can't measure)
2. **Failure Modes** (know where it will break)
3. **Guardrails** (prevent the most severe errors)
4. **Observability** (find the cause when things go wrong)
5. **Cost Optimization** (save money only after quality stabilizes)
6. **A/B Testing** (you can only compare once you have a baseline)

## Evaluation Frameworks

You can't improve what you can't measure. [RAGAS](https://docs.ragas.io/) (latest [v0.4.3 (2025-01-13)](https://github.com/explodinggradients/ragas/releases) — there is no 2.0; 0.4 is a breaking collections API + BasePrompt migration), [DeepEval](https://deepeval.com/), and [TruLens](https://www.trulens.org/) are three mainstream RAG evaluation frameworks, each providing different metrics: Faithfulness (whether the answer is faithful to context), Relevance (whether retrieved results are relevant), and Answer Correctness (whether the answer is correct). Recommend running automated evaluations in CI, so every pipeline change has numbers, supplemented by [RAGTruth](https://arxiv.org/abs/2401.00396) (~18k word-level hallucination corpus) and [FinanceBench](https://huggingface.co/datasets/PatronusAI/financebench) (finance-domain benchmark) for hallucination taxonomy and domain matrices.

-> [RAG Evaluation Frameworks: How to Use RAGAS, DeepEval, and TruLens](/posts/ai/2026-03-12-rag-evaluation-frameworks-en)

## LLM-as-Judge

When you don't have large amounts of human-labeled test data, you can use another LLM to evaluate RAG output. Self-Reflection has the answer-generating LLM score itself; LLM-as-Judge uses an independent LLM for scoring. Both have biases, but they're sufficient as signals for rapid iteration.

-> [Self-Reflection + LLM-as-Judge: Letting AI Evaluate Its Own Answers](/posts/ai/2026-03-12-self-reflection-llm-as-judge-en)

## Common Failure Modes

RAG systems have over ten common failure modes: chunks split in the wrong place causing incomplete answers, embedding semantic drift, reranking accidentally pushing correct results down, LLM ignoring context and hallucinating, context window overstuffing actually reducing quality. Knowing these failure modes lets you fix issues in a targeted way.

-> [Common RAG Failure Modes: 10 Problems and Their Solutions](/posts/ai/2026-03-12-rag-failure-modes-en)

## Guardrails

Both input and output of RAG systems need protection. Input side: prevent prompt injection, filter sensitive queries. Output side: check for hallucination, filter harmful content, ensure answers have citation support. Guardrails aren't nice-to-have — they're a necessary condition for production systems.

-> [RAG Guardrails: Adding a Defense Layer to Input and Output](/posts/ai/2026-03-12-rag-guardrails-en)

## Observability

RAG pipelines have many stages, and issues at any one can affect the final answer. The goal of observability is making this black box transparent: every step of every query (query rewrite results, retrieved chunks, post-reranking order, the LLM's complete prompt) should be traceable and replayable.

-> [RAG Observability: Per-Node Tracing to Make the Black Box Transparent](/posts/ai/2026-03-12-rag-observability-tracing-en)
-> [RAG Observability Tools Landscape](/posts/ai/2026-03-12-rag-observability-tools-en)

## Cost Optimization

RAG costs come mainly from three areas: embedding computation, vector search, and LLM generation. Each has optimization potential — embedding cache, chunk compression, small model + large model tiering, semantic caching, and token quota systems. The goal is minimizing per-query cost without sacrificing quality.

-> [RAG Cost Optimization: Minimizing the Cost of Every Query](/posts/ai/2026-03-12-rag-cost-optimization-en)
-> [RAG Quota System](/posts/ai/2026-03-12-rag-token-quota-system-en)

## A/B Testing

You switched a reranking model — did quality improve or degrade? You changed chunk size from 512 to 1024 — what's the effect? RAG A/B testing is much more complex than web A/B testing — you're comparing the performance of two complete pipelines, and the metrics are semantic (answer quality), not click-through rates.

-> [RAG A/B Testing: How to Scientifically Compare Two Pipeline Configurations](/posts/ai/2026-03-12-rag-ab-testing-en)

## Cold Start

When a new system launches, the knowledge base is empty or sparse. How do you make the system usable at this stage? Common strategies: preload public knowledge, use the LLM's own knowledge as a fallback, guide users to upload documents, and use few-shot examples to demonstrate system capabilities.

-> [RAG Cold Start: Making the System Usable When There's No Data](/posts/ai/2026-03-12-rag-cold-start-en)

## RAG vs Fine-tuning

Not all problems should be solved with RAG. If knowledge is static, query patterns are fixed, and you have sufficient training data, fine-tuning may be more appropriate. In practice, the strongest approach combines both: fine-tune to teach the model "how to use context," and RAG provides the latest context.

-> [RAG vs Fine-tuning: It's Not Either-Or](/posts/ai/2026-03-12-rag-vs-fine-tuning-en)

---

# How to Choose a RAG Generation?

Facing ten generations, the most common question is: "Which generation should I use?"

The answer depends on your problem complexity and resource constraints:

```
How many searches does your question need to be answered?

Just one ──→ Gen 1-3 (Naive/Advanced/Modular)
    │           ├─ Just starting? → Gen 1 Naive
    │           ├─ Quality not good enough? → Gen 2 Advanced
    │           └─ Need flexibility? → Gen 3 Modular
    │
Sometimes no search needed ──→ Gen 4 Self-RAG
    │
Search results often wrong ──→ Gen 5 CRAG
    │
Need relationship reasoning ──→ Gen 6 Graph RAG
    │
Very high latency requirements ──→ Gen 7 Speculative RAG
    │
Need multi-step reasoning ──→ Gen 8 Agentic RAG
    │
Multiple specialized domains ──→ Gen 9 Multi-Agent RAG
    │
Documents are long and can't be fragmented ──→ Gen 10 LongRAG
    │
Need reasoning × retrieval / cross-tool integration ──→ Post-Ten Agentic Era (Search-R1 / MCP / Deep Research)
```

Important reminder: **Generations are not linear upgrades**. Gen 10 isn't necessarily better than Gen 2 — they solve different problems. A well-designed Advanced RAG (Gen 2) will outperform a poorly designed Agentic RAG (Gen 8) in most scenarios. Choose based on your problem characteristics, not by chasing the newest generation.

---

# Recommended Reading Paths

Based on your goal, pick a path:

## MVP Path: Get RAG Running as Fast as Possible

If you want to build a working RAG system in the shortest time:

1. [The Three Generations of RAG](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution-en) — Understand the basic architecture
2. [Chunking Strategies](/posts/ai/2026-03-12-chunking-strategies-en) — Split your documents properly
3. [BGE-M3 Embedding](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en) — Choose the right embedding model
4. [Vector Database Selection](/posts/ai/2026-03-12-vector-database-comparison-en) — Pick a vector database
5. [RAG Prompt Engineering](/posts/ai/2026-03-12-rag-prompt-engineering-en) — Write good prompts

## Quality Improvement Path: Make Answers More Accurate

If your RAG is already running but answer quality isn't good enough:

1. [Hybrid Search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) — Cover vector search's blind spots
2. [Cross-Encoder Reranking](/posts/ai/2026-03-12-cross-encoder-reranking-en) — Improve ranking precision
3. [HyDE](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings-en) — Improve recall
4. [RAG Evaluation Frameworks](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) — Measure improvements with numbers
5. [Common RAG Failure Modes](/posts/ai/2026-03-12-rag-failure-modes-en) — Find specific problem points

## Advanced Architecture Path: Handle More Complex Problems

If you need more than simple Q&A:

1. [CRAG](/posts/ai/2026-03-12-corrective-rag-crag-en) — Fault tolerance for search failures
2. [Agentic RAG](/posts/ai/2026-03-12-agentic-rag-react-loop-en) — Multi-step reasoning
3. [GraphRAG](/posts/ai/2026-03-12-graph-rag-en) — Relationship reasoning
4. [Speculative RAG](/posts/ai/2026-03-15-speculative-rag-en) — Low latency, high throughput

## Production Operations Path: Running Stably in Production

If you're taking a RAG system to production:

1. [RAG Guardrails](/posts/ai/2026-03-12-rag-guardrails-en) — Input/output protection
2. [RAG Observability](/posts/ai/2026-03-12-rag-observability-tracing-en) — Full-chain tracing
3. [RAG Cost Optimization](/posts/ai/2026-03-12-rag-cost-optimization-en) — Control spending
4. [RAG A/B Testing](/posts/ai/2026-03-12-rag-ab-testing-en) — Compare configurations scientifically

## Frontier Exploration Path: See the Future

If you want to learn about the latest RAG developments:

1. [Multi-Agent RAG](/posts/ai/2026-03-16-multi-agent-rag-patterns-en) — Multi-Agent collaboration
2. [LongRAG](/posts/ai/2026-03-15-longrag-long-context-retrieval-en) — New thinking with long context
3. [Agent Memory](/posts/ai/2026-03-19-agent-memory-systems-en) — Read-write memory systems
4. [Multimodal RAG](/posts/ai/2026-03-12-multimodal-rag-en) — Multimodal knowledge bases (incl. ColPali vision-native + ViDoRe V2)

> 2025-: the post-ten Agentic Era (reasoning × retrieval + RL, multi-tool) and the [MCP](https://modelcontextprotocol.io/specification/2025-06-18) protocol layer are forming; dedicated deep dives are coming (Search-R1 / Interact-RAG / GraphRAG 3.x) and this guide will fill in `-> Deep dive` links when they ship.

---

## One Final Word

RAG is not a single technology — it's an entire technology ecosystem.

Don't try to learn everything at once. Find the problem you most urgently need to solve right now, follow the corresponding path, understand and stabilize that area, then move on to the next topic.

This guide will be continuously updated. Whenever a new deep-dive article is published, links will be added here.

## Changelog

- 2026-08-25: Added post-ten *Agentic Era (2025-)* frame + dedicated section (Search-R1/REX-RAG/AlignRAG, Deep Research, MCP), Late Chunking vs Contextual Retrieval comparison + listwise reranker (jina v3.5), 2025 increments for embeddings/vector DBs (jina-v5/v4, Qdrant Turbo4, Weaviate BlockMax WAND, Hybrid RRF/DBSF), vision-native Multimodal rewrite (ColPali/Qwen2.5-VL/ViDoRe V2) plus new MCP frontier section, and RAGAS version correction.
- 2026-08-25: Added inline official-source links (BGE-M3 / four vector DB vendors / Anthropic Contextual Retrieval / RAGAS, DeepEval, TruLens) and a GraphRAG inline paper link for traceability.
- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — Gao et al. (2023), a comprehensive survey covering the three-generation evolution of Naive RAG, Advanced RAG, and Modular RAG
- [Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection](https://arxiv.org/abs/2310.11511) — Asai et al. (2023), the original Self-RAG paper on the self-reflection mechanism for autonomous retrieval decisions
- [Corrective Retrieval Augmented Generation](https://arxiv.org/abs/2401.15884) — Yan et al. (2024), the CRAG paper on correcting poor retrieval results through evaluators
- [From Local to Global: A Graph RAG Approach to Query-Focused Summarization](https://arxiv.org/abs/2404.16130) — Edge et al. (2024), Microsoft's original GraphRAG paper on enhancing global queries with knowledge graphs
- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG](https://arxiv.org/abs/2501.09136) — Singh et al. (2025), a survey on Agentic RAG system taxonomy and evolution paths
- [Searching for Best Practices in Retrieval-Augmented Generation](https://arxiv.org/abs/2407.01219) — Wang et al. (2024), an experimental study on optimal component combinations for RAG pipelines
- [Multi-Head RAG: Solving Multi-Aspect Problems with LLMs](https://arxiv.org/abs/2406.05085) — Besta et al. (2024), using multi-head attention mechanisms to improve retrieval accuracy for multi-aspect queries
- [Speculative RAG: Enhancing Retrieval Augmented Generation through Drafting](https://arxiv.org/abs/2407.08223) — Wang et al. (2024), the drafting-plus-single-verification architecture behind Gen 7
- [Precise Zero-Shot Dense Retrieval without Relevance Labels](https://arxiv.org/abs/2212.10496) — Gao et al. (2022), the original HyDE paper on bridging the query-document semantic gap with hypothetical documents
- [Towards Agentic RAG with Deep Reasoning: A Survey](https://arxiv.org/abs/2507.09477) (2025) — post-ten Agentic/Reasoning RAG boundaries and Synergized RAG-Reasoning taxonomy
- [Reasoning RAG via System 1 or System 2: A Survey](https://arxiv.org/abs/2506.10408) (2025) — System 1/2 distinction for predefined vs agentic reasoning
- [Search-R1: Training LLMs to Reason and Leverage Search Engines with RL](https://arxiv.org/abs/2503.09516) (2025) — RL-trained autonomous multi-turn search as the Agentic Era entry point
- [Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) — Anthropic (Sep 19, 2024), Contextual Embeddings + BM25 and cost baseline
- [Late Chunking: Contextual Chunk Embeddings](https://arxiv.org/abs/2409.04701) — Jina AI (2024), encode-then-chunk zero-LLM-cost alternative
- [Qdrant 1.19 — TurboQuant Datatype & Memory Tiers](https://qdrant.tech/blog/qdrant-1.19.x/) (Aug 5, 2026) — quantization and memory tiers
- [Hybrid Search in Qdrant](https://qdrant.tech/articles/hybrid-search/) (Aug 24, 2026) — RRF/DBSF hybrid measurements
- [Weaviate 1.30 Release](https://weaviate.io/blog/weaviate-1-30-release) (Apr 8, 2025) — BlockMax WAND and multi-vector GA
- [GraphRAG Releases v3.1.2](https://github.com/microsoft/graphrag/releases) / [GraphRAG Docs](https://microsoft.github.io/graphrag/) — Microsoft (Aug 21, 2025 — current 3.1.x, four queries Global/Local/DRIFT/Basic)
- [Model Context Protocol Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18) / [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) — official protocol sources
- [ColPali: Efficient Document Retrieval with Vision Language Models](https://arxiv.org/abs/2407.01449) (ICLR 2025) / [colpali GitHub](https://github.com/illuin-tech/colpali) — vision-native route and deprecation migration
- [Qwen2.5 VL](https://qwenlm.github.io/blog/qwen2.5-vl/) (Jan 26, 2025) / [ViDoRe V2](https://arxiv.org/abs/2505.17166) — multimodal backbone and benchmark
- [RAGTruth: A Hallucination Corpus](https://arxiv.org/abs/2401.00396) / [FinanceBench](https://huggingface.co/datasets/PatronusAI/financebench) — hallucination taxonomy and finance-domain supplement
- [BGE-M3 — BAAI/bge-m3](https://huggingface.co/BAAI/bge-m3) / [jina-embeddings-v3/v4/v5-text](https://arxiv.org/abs/2409.10173) / [Jina-ColBERT-v2](https://arxiv.org/abs/2408.16672) / [SPLADE-v3](https://arxiv.org/abs/2403.06789) — embedding and sparse retrieval official/paper sources
