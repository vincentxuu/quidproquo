---
title: "knowledge-pipeline: A Six-Layer Pipeline for RAG Quality Control"
date: 2026-04-18
type: guide
category: ai
tags: [rag, knowledge-management, pipeline, embedding, bge-m3, sqlite, quality-control]
lang: en
tldr: "A six-layer deterministic pipeline that handles everything from URL ingestion to vector embedding automatically, filtering out garbage before it enters your RAG system through an eight-dimension scoring system."
description: "An introduction to knowledge-pipeline: six-layer processing architecture, eight-dimension LLM scoring, hybrid vector retrieval, minimalist tech stack, and the scenarios it does and doesn't fit."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-18-knowledge-pipeline-rag-quality-control)

The output quality of a RAG system largely depends on input quality. Yet most people spend enormous effort tuning prompts, swapping embedding models, and experimenting with different chunking strategies while ignoring a far more fundamental problem: **the data being fed in is garbage to begin with**. knowledge-pipeline is designed to address exactly this -- it applies a six-layer pipeline for quality control before data ever enters the vector database.

## Design Philosophy: Stop Feeding Your RAG Garbage

The core argument of this project is straightforward: instead of applying fancy patches on the retrieval side (reranking, query expansion, self-reflection), filter out the bad stuff before it even enters the knowledge base.

This doesn't mean retrieval-side optimization is unimportant -- the two solve different problems. Even the best reranker can't save a knowledge base full of low-quality content. knowledge-pipeline handles the "pre-ingestion" stage that most RAG architectures overlook.

Compared to common approaches:

- **Manual curation**: Quality is controllable, but doesn't scale -- anything beyond 1,000 entries becomes unmanageable
- **Dump everything into the vector DB**: Fast, but retrieval quality degrades as data volume grows
- **knowledge-pipeline**: Automated filtering + scoring that scales while keeping quality trackable

## Six-Layer Pipeline Architecture

The entire system is a linear six-layer processing flow. Each layer operates independently and can be run, skipped, or replaced individually:

```
URL Input
  │
  ▼
┌──────────┐
│ 1. Ingest │  Import URLs from multiple sources
└────┬─────┘
     ▼
┌──────────┐
│ 2. Enrich │  Extract web content, generate summaries
└────┬─────┘
     ▼
┌──────────┐
│ 3. Score  │  Eight-dimension LLM scoring (0-100)
└────┬─────┘
     ▼
┌──────────┐
│ 4. Route  │  Classify to different destinations by score
└────┬─────┘
     ▼
┌──────────┐
│ 5. Embed  │  Hybrid vector embedding (dense + sparse)
└────┬─────┘
     ▼
┌──────────┐
│ 6. Serve  │  HTTP API / MCP for queries
└──────────┘
```

The benefit of this design is that **each layer can be debugged independently**. If Enrich has a problem, fix Enrich -- no need to rerun the entire pipeline from scratch. SQLite serves as the single persistence layer across all stages, and any intermediate state can be queried directly with SQL.

## Eight-Dimension Scoring System

The Score layer is the most critical part of the entire pipeline. Each piece of content is scored by an LLM across eight dimensions:

| Dimension | What It Evaluates |
|-----------|-------------------|
| Knowledge Density | How much useful information per unit of content |
| Novelty | Degree of overlap with existing knowledge |
| Evidence Quality | Whether there is data, citations, or experimental evidence |
| Actionability | Whether the reader can apply it immediately |
| Risk | Likelihood of information being outdated or incorrect |
| Time Horizon | How long this knowledge remains relevant |
| Emotional Content | Proportion of emotional content (high emotion usually means low knowledge density) |
| Source Credibility | Trustworthiness of the source |

The eight dimensions are synthesized into a single 0-100 signal score. This score determines how the next layer, Route, handles the content.

## Intelligent Routing

The Route layer automatically distributes content to five destinations based on the scoring results:

- **Writing**: High knowledge density, high novelty -- material suitable for writing into articles
- **Research**: Content with potential that needs further investigation
- **Validation**: Insufficient evidence quality, requires cross-verification
- **Action**: Highly actionable, can be executed directly
- **Archive**: Low-scoring content, archived but kept out of the main knowledge base

This is far more granular than "dumping everything into the same collection." When agents query, they can specify to search only Writing or Research, keeping results unpolluted by Archive-grade content.

## Hybrid Retrieval

The Embed layer uses BAAI/bge-m3 to generate both dense and sparse vectors simultaneously, fusing them at query time with a 70/30 weighting:

- **Dense (70%)**: Captures semantic similarity -- "machine learning" and "ML" get associated
- **Sparse (30%)**: Exact lexical matching, well-suited for proper nouns and technical terminology

Optionally, BAAI/bge-reranker-v2-m3 can be used for second-stage reranking to further improve precision. Compared to pure dense or pure sparse approaches, this hybrid strategy typically shows noticeable improvement in technical document retrieval.

## Tech Stack

The technology choices for this project are remarkably restrained:

- **Python 3.12+**: Core language
- **SQLite**: The only storage layer -- no additional database required
- **numpy + FlagEmbedding**: The only two non-standard library dependencies
- **Python HTTPServer**: Built-in HTTP server, no Flask/FastAPI dependency
- **Any OpenAI-compatible LLM**: Ollama, OpenAI, Anthropic all work

This means the deployment barrier is very low -- no Redis, PostgreSQL, or vector database needed. One machine with Python installed is enough to run it. However, it also means it's not suited for high-concurrency scenarios -- Python's built-in HTTPServer is not designed for production-grade traffic.

## Who Is This For

**Good fit:**
- Personal knowledge managers who want to automate the organization of 1,000+ saved items
- RAG developers who want to add a quality filtering layer before data ingestion
- Developers with a local LLM (Ollama) who want to run entirely offline

**Not ideal for:**
- Scenarios requiring real-time processing (the pipeline is batch-oriented)
- Non-technical users (requires self-hosting)
- Large-scale deployments (SQLite + Python HTTPServer has a ceiling)

## Overall Takeaway

knowledge-pipeline addresses the commonly overlooked "data quality" problem in RAG systems. The six-layer pipeline design allows each stage to be tuned independently, and the eight-dimension scoring makes quality judgments traceable rather than a black box. The minimalist tech stack is both an advantage and a limitation -- easy to get started, but production environments will need additional infrastructure reinforcement.

This project originated from the author's hands-on experience managing 1,600+ knowledge entries -- it is not armchair architecture. For developers building personal knowledge bases or RAG systems, even if you don't use it directly, the design thinking behind the six-layer pipeline and eight-dimension scoring is well worth studying.

## References

- [knowledge-pipeline GitHub](https://github.com/MakiDevelop/knowledge-pipeline)
- [BAAI/bge-m3 - Hugging Face](https://huggingface.co/BAAI/bge-m3)
- [BAAI/bge-reranker-v2-m3 - Hugging Face](https://huggingface.co/BAAI/bge-reranker-v2-m3)
- [Hybrid Search: BM25 + Vector + RRF Hybrid Retrieval Strategy](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf)
- [BGE-M3: Multilingual Multi-Granularity Embedding Model Selection](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)
