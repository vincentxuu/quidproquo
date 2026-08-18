---
title: "Three Generations of RAG: From Naive to Modular"
date: 2026-03-12
type: deep-dive
category: ai
tags: [rag, naive-rag, advanced-rag, modular-rag, architecture, evolution]
lang: en
tldr: "Naive RAG works but has real problems. Advanced RAG patches those problems. Modular RAG rearchitects the whole system to be composable and configurable. Understanding all three generations is the key to understanding why modern RAG systems look the way they do."
description: "The evolution of RAG systems across three generations: the shortcomings of Naive RAG, the targeted fixes in Advanced RAG, the architectural redesign in Modular RAG, and when to reach for each."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 2
---

> 🌏 [中文版](/posts/ai/2026-03-12-naive-advanced-modular-rag-evolution)

RAG systems evolved rapidly between 2023 and 2026, growing from a simple three-step process into sophisticated modular pipelines. Understanding that evolutionary arc makes it much easier to see what problem each design decision was actually solving.

## Naive RAG (First Generation)

The most basic RAG flow:

```
1. Indexing:   Document → Chunk → Embed → Vector DB
2. Retrieval:  Query → Embed → Vector Search → Top-K Chunks
3. Generation: Query + Top-K Chunks → LLM → Answer
```

Simple to implement, and it was essentially the blueprint for every RAG tutorial in early 2023. Early versions of LangChain were essentially a packaged Naive RAG.

**Problems with Naive RAG:**

**Retrieval issues:**
- Mismatch between query and document language patterns (questions vs. declarative statements)
- A single vector representing an entire passage compresses too much semantic information
- Polysemous words and domain-specific terms cause confusion

**Precision issues:**
- Irrelevant documents in the Top-K results create noise for the LLM
- Duplicate chunks waste context window space
- No relevance-based reranking

**Generation issues:**
- Context that is too long or too short
- The LLM has no way to assess the relative reliability of documents
- No mechanism to evaluate answer quality

These problems are barely noticeable in simple scenarios, but they significantly degrade quality in specialized vertical domains — climbing, medicine, law.

---

## Advanced RAG (Second Generation)

Advanced RAG addresses each of Naive RAG's failure modes with improvements at every stage:

**Pre-retrieval (improving the query itself):**
- **HyDE**: Transform the question into a hypothetical answer document to bridge the language-pattern gap
- **Multi-Query Expansion**: Generate multiple perspectives from a single question to improve recall
- **Query Rewriting**: Rewrite colloquial queries into a form better suited for search

**Retrieval (improving search quality):**
- **Hybrid Search**: BM25 + vector search, complementary coverage
- **Metadata Filtering**: Narrow the search scope to improve precision
- **Contextual Retrieval**: Inject context at indexing time to solve the isolated-chunk problem

**Post-retrieval (improving the context sent to the LLM):**
- **Cross-Encoder Reranking**: Fine-grained reranking to eliminate irrelevant documents
- **MMR (Maximal Marginal Relevance)**: Diversity-based selection to avoid redundancy
- **Context Compression**: Compress context while retaining key information

Advanced RAG is patch-on-patch on top of the original three-step flow. Each patch fixes a specific problem, but the overall design is still linear and fixed.

---

## Modular RAG (Third Generation)

The core limitation of Advanced RAG: different queries need different processing paths, but a fixed pipeline cannot adapt dynamically to query type.

Modular RAG's redesign:

**Core concept:** Extract each RAG capability into an independent module, then use a Pipeline Engine to compose them dynamically.

```
Instead of:  Query → Step1 → Step2 → ... → StepN → Answer

Do this:     Query
               ↓
        [Query Classification] → determines routing
               ↓
        Dynamically select and execute relevant modules:
        - Simple query:  skip most modules
        - Complex query: full module stack
        - SQL query:     route to Text-to-SQL path
        - Agentic query: enter ReAct loop
```

**Three defining properties:**

1. **Composable**: Modules can be freely combined; a new module only needs to implement a fixed interface
2. **Configurable**: An admin UI can dynamically enable/disable modules and tune parameters
3. **Routable**: The system automatically selects the optimal execution path based on query type

**New module types:**

Modular RAG doesn't just reorganize the existing steps — it introduces capabilities that Advanced RAG never had:

- **Query Router**: Selects a processing strategy based on intent
- **Self-Reflection**: Automatically regenerates when output quality falls below threshold
- **LLM-as-Judge**: Evaluates output quality
- **Agentic Loop**: The LLM actively decides whether it needs more information
- **Semantic Cache**: Caches responses for semantically similar queries
- **Memory**: Remembers user preferences for personalized responses

---

## After the Third Generation: Agentic RAG

From 2025 onward, as LLMs got better at self-reflection and tool use, a pattern emerged that people often name separately: Agentic RAG. Instead of an engineer fixing the order of steps ahead of time, the LLM acts as the orchestrator — deciding which actions to take, when to take them, and whether to iterate again. The "Agentic Loop" module inside Modular RAG becomes the control flow of the entire system.

Strictly speaking this isn't a fourth generation so much as a **transfer of control** within Modular RAG: the modules are the same modules; what changes is *who decides the execution order* — a fixed pipeline configuration, or the model at runtime.

**The cost is real.** An ACL 2026 study comparing Enhanced RAG (essentially the Advanced/Modular designs described above) with Agentic RAG found that the agentic setting needed on average 3.3x more input tokens, 1.9x more output tokens, and 1.5x more end-to-end latency, with cost across datasets running up to 3.6x higher — and that was with the agent capped at three turns.

More importantly, the quality findings are not one-sided:

- Agentic RAG is stronger at **understanding user intent** and **query rewriting**, and it needs no hand-written routing examples
- But at **picking the most relevant documents**, the agent's autonomous selection loses to Enhanced RAG's reranking
- In well-defined domains with structured user behavior, agentic routing wins; in broader, noisier domains, fixed routing proved more reliable
- The authors' conclusion: a well-optimized Enhanced RAG can match or exceed agentic performance while staying cheaper

In other words, "going agentic" is not automatically better — it trades cost and predictability for flexibility. The pragmatic combination is usually: let the agent handle intent routing and query rewriting, but keep an explicit reranking step.

Handing control to the model also introduces failure modes the pipeline era didn't have. A 2026 SoK paper on Agentic RAG formalizes these loops as finite-horizon partially observable Markov decision processes (POMDPs) and names several systemic risks: hallucinations compounding as they propagate around the loop, memory poisoning, retrieval misalignment, and cascading tool-execution vulnerabilities. None of these show up in static evaluation — what you need to evaluate is the whole trajectory, not a single answer.

---

## Comparing the Three Generations

| | Naive RAG | Advanced RAG | Modular RAG | Agentic RAG |
|---|-----------|-------------|-------------|-------------|
| Architecture | Linear 3-step | Enhanced linear flow | Modular DAG | Model-driven iterative loop |
| Who decides order | Code | Code | Config / routing rules | The LLM, at runtime |
| Flexibility | Low | Medium | High | Highest |
| Predictability | High | High | Medium | Low |
| Maintainability | Simple | Moderate | Complex but organized | Hard to debug (trajectory-level) |
| Configuration | Hardcoded | Partially configurable | Dynamically configurable | Defined by prompts and tools |
| Adapts to query type | No | Limited | Full support | Full support |
| Runtime cost | Low | Medium | Medium | High (token count multiplies) |

## Which Generation Should You Use?

**Naive RAG**: Great for PoCs, internal tools, and single-query-type scenarios. Ship fast, validate whether RAG actually adds value, then optimize.

**Advanced RAG**: The right choice for most production use cases. When you hit a specific quality problem, add the corresponding fix: poor recall → HyDE/Multi-Query; poor precision → Reranking; poor generation → Judge.

**Modular RAG**: Built for systems with diverse query types and a need for continuous iteration. High upfront engineering cost, but strong long-term maintainability. You need clear quality metrics and an iteration plan to get the most out of the modular design.

**Agentic RAG**: For cases where you can't enumerate query shapes ahead of time and you're willing to buy flexibility with cost. Confirm two things before shipping it: that you can observe the entire decision trajectory (not just the final answer), and that you've done the token math — the experimental evidence puts the cost at several times a fixed pipeline. Most teams land on a hybrid: agentic intent routing and query rewriting, fixed pipeline for reranking and generation.

## The Bigger Picture

The three generations aren't "new replaces old" — they're **solutions at different levels of complexity**. The core ideas from Naive RAG are still alive inside Modular RAG; they're just better organized.

Understanding what each generation solved — and what complexity it introduced — is what lets you find the right balance between "good enough" and over-engineering.

---

## References

- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)](https://arxiv.org/abs/2005.11401)
- [Modular RAG: Transforming RAG Systems into LEGO-like Reconfigurable Frameworks (2024)](https://arxiv.org/abs/2407.21059)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG (2025)](https://arxiv.org/abs/2501.09136)
- [Is Agentic RAG worth it? An experimental comparison of RAG approaches (ACL 2026 Industry Track)](https://arxiv.org/abs/2601.07711)
- [SoK: Agentic Retrieval-Augmented Generation (RAG): Taxonomy, Architectures, Evaluation, and Research Directions (2026)](https://arxiv.org/abs/2603.07379)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en) (zh-TW only)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en) (zh-TW only)
