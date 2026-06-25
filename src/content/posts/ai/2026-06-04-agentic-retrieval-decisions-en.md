---
title: "How Agents Decide Whether to Retrieve, What to Retrieve, and How to Merge: Three Decision Layers of Agentic RAG"
date: 2026-06-04
category: ai
type: deep-dive
tags: [rag, agentic-rag, retrieval, ai-agent, llm]
lang: en
tldr: "Traditional RAG is a fixed pipeline of 'retrieve then answer.' Agentic RAG splits retrieval into three decision layers: when to retrieve (FLARE uses token probabilities; Adaptive-RAG uses a complexity classifier), what to retrieve (HyDE / RAG-Fusion / decomposition / Step-back), and how to fuse (RRF k=60 then cross-encoder rerank then compression -- Anthropic measured a -67% failure rate reduction). Key counter-intuitive insight: unnecessary retrieval hurts quality -- 'deciding not to retrieve' is a first-class capability."
description: "A walkthrough of Agentic RAG's three decision layers and agent loop: trigger mechanisms of Self-RAG, Adaptive-RAG, FLARE, and CRAG; five query transformation techniques; engineering numbers for RRF fusion and reranking; and how ReAct / Plan-and-Solve / IRCoT wire these decisions into a loop."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-06-04-agentic-retrieval-decisions)

Traditional RAG is a **fixed pipeline** of "retrieve then read": regardless of question difficulty or whether the model already knows the answer, it always pulls from the knowledge base first. Agentic RAG turns retrieval into **a series of agent decisions** -- at every step it asks three questions: **(1) Do I need to retrieve right now? (2) What should I query, and where? (3) How do I fuse the multi-source results into one usable context?** -- and wraps these decisions into a plan-retrieve-reflect loop that only generates an answer when "enough is enough."

Let's start with the most important counter-intuitive conclusion: **unnecessary retrieval hurts quality**. For popular entities and questions the model can already answer with high confidence, forcing retrieval results actually injects noise, lowers accuracy, and adds latency and cost (Mallen et al.'s analysis of long-tail vs. popular questions is the origin of this line of thinking). So "deciding not to retrieve" is just as important as "deciding to retrieve" -- knowing when *not* to look things up is the essence of being agentic.

## Why a Fixed Pipeline Falls Short

Naive RAG has three structural pain points: it gets dragged down by retrieval noise on popular/well-known questions; a single retrieval pass cannot handle multi-hop questions ("Where is the alma mater of A's author?" requires two hops); and when retrieval quality is poor, incorrect context amplifies hallucinations rather than suppressing them. These three pain points correspond directly to the three decision layers that follow.

## Layer 1: When to Retrieve

Four trigger signals, all fundamentally confidence judgments about "can I answer this, and is what I have good enough":

- **Uncertainty during generation**: FLARE (arXiv:2305.06983) monitors the token probabilities of the next sentence during generation. **When they fall below a threshold, it triggers look-ahead retrieval** and regenerates that sentence -- uncertainty itself is the retrieval trigger.
- **Pre-generation question complexity**: Adaptive-RAG (arXiv:2403.14403) trains a T5 classifier to predict query complexity and outputs one of three choices: **no retrieval / single retrieval / iterative retrieval** (complex questions go through IRCoT-style iteration).
- **Model-initiated signals**: Self-RAG (arXiv:2310.11511) has the model emit **reflection tokens** during generation, autonomously deciding when to retrieve and evaluating whether retrieved passages are relevant and whether the answer is supported.
- **Post-hoc quality feedback**: CRAG (arXiv:2401.15884) uses a lightweight retrieval evaluator to score results into three action buckets: **Correct** goes through decompose-then-recompose to extract "knowledge strips"; **Incorrect / Ambiguous** falls back to web search for re-retrieval.

## Layer 2: What to Retrieve

Queries are not used as-is. Five transformation techniques, each solving a different misalignment problem:

- **Parallel multi-query**: RAG-Fusion (arXiv:2402.03367) has the LLM generate 3-5 query variants for parallel retrieval, then aggregates with RRF -- expanding the hit surface. See the on-site article on [multi-query expansion](/posts/ai/2026-03-12-multi-query-expansion) for more detail.
- **Decomposition**: Multi-hop questions are broken into multiple simple sub-questions for separate retrieval (query decomposition). IRCoT (arXiv:2212.10509) goes further by **interleaving retrieval into every step of Chain-of-Thought**, using the previous reasoning step as the next retrieval query.
- **Generate a fake answer**: HyDE (arXiv:2212.10496) first has the LLM generate a "hypothetical document," then uses its embedding for retrieval -- the semantic distance between a fake answer and a real document is shorter than between a question and a document. Details in the on-site [HyDE introduction](/posts/ai/2026-03-12-hyde-hypothetical-document-embeddings).
- **Abstraction**: Step-back prompting (arXiv:2310.06117) first asks a more abstract higher-level question to obtain "first principles," then uses them to answer the original question.
- **Routing and filtering**: Deciding whether to query a vector store, web search, or SQL, plus metadata filters -- this is the router's job, not the retriever's.

## Layer 3: How to Fuse

Multi-source retrieval returns a pile of overlapping, noisy, and sometimes contradictory passages. Fusion happens in three steps:

**1. Rank fusion for merging and deduplication.** The standard approach is Reciprocal Rank Fusion: `RRF(d) = Sum 1/(k + rank_r(d))`, with constant k conventionally set to **60** (same as Azure AI Search official documentation). The higher a document ranks across more rankers, the higher its total score; absent rankers contribute 0. Weighted RRF can further weight different retrievers (e.g., giving BM25 higher weight than vector). See the on-site [RRF multi-source fusion](/posts/ai/2026-03-12-rrf-multi-source-fusion) for the formula derivation.

**2. Cross-encoder rerank for fine-grained sorting.** Anthropic's [Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval) provides the most complete engineering numbers: before embedding, each chunk gets dedicated context prepended, then Contextual Embeddings + Contextual BM25 are combined, rank fusion deduplicates, and reranking follows (top-150 down to top-20). Measured retrieval failure rates: **contextual embeddings alone -35%; adding BM25 -49%; adding reranker -67% (5.7% down to 1.9%)**. Note: the benefit varies by data domain -- in some domains, contextual provides almost no help -- always benchmark on your own data. See the on-site articles on [Contextual Retrieval](/posts/ai/2026-03-12-contextual-retrieval) and [cross-encoder reranking](/posts/ai/2026-03-12-cross-encoder-reranking) for deeper dives.

**3. Compression to remove redundancy.** CRAG's knowledge strips are one approach; LLMLingua (arXiv:2310.05736) / LongLLMLingua (arXiv:2310.06839) use a small model to compute token importance for prompt compression, with the latter specifically addressing "lost in the middle" in long contexts.

## Wiring the Three Layers Together: The Agent Loop

The three decision layers are not isolated -- they are wrapped in a loop:

```
        ┌─────────────────────────────────┐
        ▼                                 │
  plan ──► retrieve? ──no──► generate     │
        │ yes                             │
        ▼                                 │
  query transform ──► retrieve ──► grade ─┤
        ▲                      │          │
        │   rewrite/web_search │ not good  │
        └──────────────────────┘  good ──► generate ──► answer grounded? ──► output
```

Representative loop designs: ReAct (arXiv:2210.03629) interleaves reasoning and action, feeding action results back into the next reasoning step (on-site: [Agentic RAG and the ReAct Loop](/posts/ai/2026-03-12-agentic-rag-react-loop)); Plan-and-Solve (arXiv:2305.04091) drafts a plan first then executes steps one by one (on-site: [Plan-and-Execute RAG](/posts/ai/2026-03-12-plan-and-execute-rag)); Self-RAG / CRAG provide reflection loops (on-site: [Corrective RAG](/posts/ai/2026-03-12-corrective-rag-crag)). Three stopping conditions to choose from: documents are sufficiently relevant, the answer is grounded (hallucination grader passes), or the iteration limit is reached.

For a macro-level taxonomy, see the Agentic RAG Survey (arXiv:2501.09136): it classifies systems along four axes -- number of agents, control structure, degree of autonomy, and knowledge representation -- corresponding to four design patterns: reflection, planning, tool use, and multi-agent collaboration. DeepRAG (arXiv:2502.01142) formalizes "when to retrieve" as an MDP -- theoretically acknowledging that this is a sequential decision problem.

## Engineering Trade-offs

LangGraph's adaptive / corrective RAG examples are the standard reference for landing this as a state machine: router -> retrieve -> grade -> rewrite / web_search -> generate -> hallucination & answer grader.

Applicability boundaries:

- **Agentic RAG is a good fit for**: multi-hop questions, multi-source needs, knowledge bases of uneven quality, high cost of wrong answers.
- **Standard RAG is fine for**: a single clean knowledge source, simple questions, latency/cost sensitivity -- every additional decision layer adds another LLM call, and the agentic overhead is real.

Three decision layers plus one loop -- that is the entire skeleton of Agentic RAG. If you remember only one thing: **giving the system the ability to say "I don't need to look this up" is just as valuable as making it better at looking things up.**

## References

- [Self-RAG (arXiv:2310.11511)](https://arxiv.org/abs/2310.11511)
- [Adaptive-RAG (arXiv:2403.14403)](https://arxiv.org/abs/2403.14403)
- [FLARE: Active Retrieval Augmented Generation (arXiv:2305.06983)](https://arxiv.org/abs/2305.06983)
- [Corrective RAG / CRAG (arXiv:2401.15884)](https://arxiv.org/abs/2401.15884)
- [HyDE (arXiv:2212.10496)](https://arxiv.org/abs/2212.10496)
- [Step-Back Prompting (arXiv:2310.06117)](https://arxiv.org/abs/2310.06117)
- [RAG-Fusion (arXiv:2402.03367)](https://arxiv.org/abs/2402.03367)
- [IRCoT: Interleaving Retrieval with Chain-of-Thought (arXiv:2212.10509)](https://arxiv.org/abs/2212.10509)
- [ReAct (arXiv:2210.03629)](https://arxiv.org/abs/2210.03629)
- [Plan-and-Solve Prompting (arXiv:2305.04091)](https://arxiv.org/abs/2305.04091)
- [LLMLingua (arXiv:2310.05736)](https://arxiv.org/abs/2310.05736)
- [LongLLMLingua (arXiv:2310.06839)](https://arxiv.org/abs/2310.06839)
- [Agentic RAG Survey (arXiv:2501.09136)](https://arxiv.org/abs/2501.09136)
- [DeepRAG (arXiv:2502.01142)](https://arxiv.org/abs/2502.01142)
- [Anthropic — Introducing Contextual Retrieval](https://www.anthropic.com/news/contextual-retrieval)
- [Azure AI Search — Hybrid search scoring (RRF)](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)
- [LangGraph — Agentic RAG tutorial](https://langchain-ai.github.io/langgraph/tutorials/rag/langgraph_agentic_rag/)
