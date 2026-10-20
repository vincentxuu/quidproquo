---
title: "Three Generations of RAG: From Naive to Modular"
date: 2026-03-12
updated: 2026-10-20
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

Side by side, the difference sits in the middle of the flow: every RAG step is laid out by an engineer, while Agentic RAG adds two decision points, choosing the tools and checking whether the evidence is enough, and goes back for another round when it is not. Each diagram steps through on its own once it scrolls into view; use the buttons to stop at any step.

```flow-diagram
{
  "title": "RAG: a fixed pipeline, walked once",
  "lang": "en",
  "width": 520,
  "height": 630,
  "nodes": [
    {"id": "user", "label": "User", "x": 110, "y": 50, "shape": "actor"},
    {"id": "app", "label": "LLM App", "x": 110, "y": 220, "w": 130},
    {"id": "llm", "label": "LLM", "x": 400, "y": 220, "shape": "chip"},
    {"id": "retriever", "label": "Retriever", "x": 110, "y": 400, "shape": "db", "w": 110},
    {"id": "prompt", "label": "Prompt Builder", "x": 400, "y": 400, "w": 150, "tone": "accent"},
    {"id": "index", "label": "Vector / hybrid index\n(built offline)", "x": 110, "y": 585, "w": 220, "h": 62}
  ],
  "edges": [
    {"from": "user", "to": "app", "step": 1, "label": "query", "offset": 16, "labelAt": [78, 135], "labelSide": "left"},
    {"from": "app", "to": "retriever", "step": 2, "label": "query", "labelAt": [128, 305]},
    {"from": "retriever", "to": "index", "step": 3, "label": "embed\n+ search", "labelAt": [78, 490], "offset": 16, "labelSide": "left"},
    {"from": "index", "to": "retriever", "step": 4, "label": "top-K chunks", "labelAt": [142, 490], "offset": 16},
    {"from": "retriever", "to": "prompt", "step": 5, "label": "query + chunks", "labelAt": [210, 380]},
    {"from": "prompt", "to": "llm", "step": 6, "label": "augmented\nprompt", "labelAt": [420, 310]},
    {"from": "llm", "to": "app", "step": 7, "label": "answer", "labelAt": [260, 200]},
    {"from": "app", "to": "user", "step": 8, "label": "response", "offset": 16, "labelAt": [142, 135]}
  ],
  "steps": [
    "The user sends a query",
    "The LLM App passes the query unchanged to the Retriever",
    "The query is embedded and searched against the prebuilt index",
    "The top-K closest chunks come back",
    "Query and chunks go to the Prompt Builder",
    "The augmented prompt goes to the LLM",
    "The LLM answers from the chunks",
    "The response returns to the user: the step order is hard-coded, and it runs exactly once"
  ]
}
```

```flow-diagram
{
  "title": "Agentic RAG: the model decides where to look, and whether to look again",
  "lang": "en",
  "width": 640,
  "height": 740,
  "nodes": [
    {"id": "user", "label": "User", "x": 90, "y": 50, "shape": "actor"},
    {"id": "app", "label": "LLM App", "x": 90, "y": 220, "w": 120},
    {"id": "orch", "label": "Agent\nOrchestrator", "x": 300, "y": 220, "w": 150, "h": 64, "tone": "accent"},
    {"id": "tools", "label": "Tools & retrieval sources\nvector DB · docs · web\nAPIs · MCP servers", "x": 520, "y": 390, "w": 200, "h": 86},
    {"id": "evidence", "label": "Retrieved evidence", "x": 520, "y": 545, "w": 170},
    {"id": "evaluator", "label": "Evaluator\nAgent", "x": 300, "y": 545, "w": 120, "h": 64, "tone": "accent"},
    {"id": "context", "label": "Context Builder", "x": 300, "y": 685, "w": 150},
    {"id": "llm", "label": "LLM", "x": 90, "y": 685, "shape": "chip"}
  ],
  "edges": [
    {"from": "user", "to": "app", "step": 1, "label": "query", "offset": 16, "labelAt": [58, 135], "labelSide": "left"},
    {"from": "app", "to": "orch", "step": 2, "label": "task", "labelAt": [180, 190]},
    {"from": "orch", "to": "tools", "step": 3, "label": "select tools", "via": [[520, 220]], "labelAt": [420, 190]},
    {"from": "tools", "to": "evidence", "step": 4, "label": "fetch evidence", "labelAt": [532, 480]},
    {"from": "evidence", "to": "evaluator", "step": 5, "label": "check vs\ntask", "labelAt": [400, 595]},
    {"from": "evaluator", "to": "orch", "step": 6, "label": "not enough:\nretry", "tone": "warn", "labelAt": [300, 400]},
    {"from": "evaluator", "to": "context", "step": 7, "label": "enough", "labelAt": [312, 615]},
    {"from": "context", "to": "llm", "step": 8, "label": "augmented\nprompt", "labelAt": [140, 640]},
    {"from": "llm", "to": "app", "step": 9, "label": "answer", "labelAt": [90, 450]},
    {"from": "app", "to": "user", "step": 10, "label": "response", "offset": 16, "labelAt": [122, 135]}
  ],
  "steps": [
    "The user sends a query",
    "The LLM App hands it to the Agent Orchestrator as a task",
    "The orchestrator picks its tools: vector DB, docs, web search, APIs or MCP servers",
    "Evidence comes back from the chosen sources",
    "The Evaluator checks whether the evidence is enough for the task",
    "Not enough: rewrite the query or switch sources and go back to step 3, with a cap on iterations so it cannot loop forever",
    "Enough: the evidence goes to the Context Builder",
    "The augmented prompt goes to the LLM",
    "The LLM answers",
    "The response returns to the user: how many rounds and which sources are decided at runtime"
  ]
}
```

**The cost is real.** An ACL 2026 study comparing Enhanced RAG (essentially the Advanced/Modular designs described above) with Agentic RAG found that the agentic setting's token cost varied by dataset (2.7x/1.7x input/output on FIQA, 3.9x/2.0x on CQADupStack-En), with 1.5x more end-to-end latency and cost across datasets running up to 3.6x higher.

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

## Changelog

- 2026-10-20: Added step-by-step animated flow diagrams of RAG and Agentic RAG to the Agentic RAG section
- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "RAG Techniques Compendium" series.

## References

- [Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (2020)](https://arxiv.org/abs/2005.11401)
- [Modular RAG: Transforming RAG Systems into LEGO-like Reconfigurable Frameworks (2024)](https://arxiv.org/abs/2407.21059)
- [Retrieval-Augmented Generation for Large Language Models: A Survey (2023)](https://arxiv.org/abs/2312.10997)
- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG (2025)](https://arxiv.org/abs/2501.09136)
- [Is Agentic RAG worth it? An experimental comparison of RAG approaches (ACL 2026 Industry Track)](https://arxiv.org/abs/2601.07711)
- [SoK: Agentic Retrieval-Augmented Generation (RAG): Taxonomy, Architectures, Evaluation, and Research Directions (2026)](https://arxiv.org/abs/2603.07379)
- [NobodyClimb System Architecture: A Full-Stack Climbing Community on Cloudflare](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture-en)
- [NobodyClimb AI Architecture: A 20-Node RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en)
