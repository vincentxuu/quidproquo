---
title: "Hierarchical Chunking + Auto-Merge: Small Chunks Search Well, Big Chunks Read Well"
date: 2026-09-03
type: deep-dive
category: ai
tags: [hierarchical-chunking, auto-merge, rag, chunking, retrieval, llamaindex]
lang: en
tldr: "Small chunks give precise embeddings but lack context; big chunks have complete context but diluted embeddings. Hierarchical Chunking builds multi-level indexes (2048→512→128 tokens) with an Auto-Merge algorithm: leaf nodes match precisely, and when hit density exceeds a threshold the parent node is returned to the LLM instead. HiChunk shows a 12.7% evidence recall improvement; LlamaIndex and Haystack have it built in."
description: "Deep dive into Hierarchical Chunking and Auto-Merging Retrieval: design principles, Auto-Merge threshold logic, HiChunk improvements, comparisons with Parent Document Retriever / Contextual Retrieval / Late Chunking, and implementations in LlamaIndex and Haystack."
series:
  name: "RAG 技法大全"
  order: 50
---

> 🌏 [中文版](/posts/ai/2026-09-03-hierarchical-chunking-auto-merge)

The chunk size dilemma in RAG systems is a permanent tradeoff: small chunks give precise embeddings but send context-poor fragments to the LLM; big chunks preserve context but dilute the embedding with irrelevant content. According to [Firecrawl's 2026 chunking recommendations](https://www.firecrawl.dev/blog/best-chunking-strategies-rag), fixed 400–600 token chunks with 15% overlap plus cross-encoder reranking remain the industry baseline — but that baseline compromises on chunk size rather than solving the problem.

Hierarchical Chunking + Auto-Merging Retrieval takes a different approach: **no compromise — have both**. Small chunks handle precise search, big chunks handle complete context, a tree structure connects them, and an Auto-Merge algorithm dynamically decides which level to return.

## The Chunk Size Dilemma

The issue isn't chunking itself — it's that the same chunk must serve two conflicting roles simultaneously:

| Role | Needs | Preferred chunk size |
|------|-------|---------------------|
| **Search target** (embedding match) | Semantically focused, not diluted by noise | Small (128–256 tokens) |
| **Generation material** (sent to LLM) | Complete paragraphs with surrounding context | Large (1024–2048 tokens) |

Using a single chunk size for both roles inherently makes a fixed tradeoff between precision and completeness — and the optimal tradeoff point shifts with document type and query type.

[Parent Document Retriever](/en/posts/ai/2026-03-12-chunking-strategies-en) was the first-generation solution: search with small chunks, retrieve the associated large chunk when there's a hit. But it only has two levels with fixed granularity. Hierarchical Chunking extends this concept to multiple levels.

## Hierarchical Chunking Design

The core idea is splitting documents into a **multi-granularity tree structure**. Taking three levels as an example:

```
Level 0 (root):  2048 tokens  ─── Complete paragraphs sent to LLM
  Level 1:       512 tokens   ─── Intermediate layer
    Level 2:     128 tokens   ─── Leaf nodes, embedded & indexed
```

Only **leaf nodes are embedded and indexed**. Other levels are stored as raw text in the document store, linked via parent-child relationships. Search runs vector matching against leaf nodes; hits traverse up the tree to retrieve larger chunks for the LLM.

Per the [LlamaIndex HierarchicalNodeParser](https://developers.llamaindex.ai/python/framework-api-reference/node_parsers/hierarchical) implementation:

```python
from llama_index.core.node_parser import HierarchicalNodeParser

node_parser = HierarchicalNodeParser.from_defaults(
    chunk_sizes=[2048, 512, 128]
)
nodes = node_parser.get_nodes_from_documents(documents)
# nodes contain three levels, each child has a parent_node reference
```

Each node carries a `relationships` attribute recording its parent, children, and prev/next siblings. This tree isn't just an index structure — it preserves the document's paragraph hierarchy.

## The Auto-Merge Algorithm

Auto-Merge logic is intuitive: if enough children under the same parent are search hits, replace those children with the parent.

Per the [LlamaIndex AutoMergingRetriever](https://developers.llamaindex.ai/python/examples/retrievers/auto_merging_retriever/) documentation:

> "The auto merging retriever looks at a set of leaf nodes and recursively merges subsets of leaf nodes that reference a parent node beyond a given threshold."

The concrete flow:

```
1. Vector search returns top-K leaf nodes
2. Group by parent
3. For each parent:
   If hit children count / total children count ≥ threshold
   → Replace all hit children with parent
4. Recursively repeat up the tree (configurable depth)
```

The **default threshold** is 0.5 (50%). Intuition: if a paragraph has 4 child chunks and 3 are retrieved, sending the entire paragraph instead of 3 fragments saves tokens and provides more complete information.

```python
from llama_index.core.retrievers import AutoMergingRetriever

retriever = AutoMergingRetriever(
    vector_retriever,
    storage_context,
    simple_ratio_thresh=0.5,  # merge threshold
)
results = retriever.retrieve("B1 property restrictions")
```

## HiChunk: Smarter Thresholds

A fixed 50% threshold has a problem: different parents have different numbers of children. A long paragraph with 8 children merges at 4 hits; a short paragraph with 2 children merges at 1 hit — the latter is clearly too aggressive.

[HiChunk (arXiv:2509.11552)](https://arxiv.org/abs/2509.11552) proposes two improvements:

1. **HiCBench**: The first benchmark specifically evaluating hierarchical chunking quality, using manually annotated multi-level split points and evidence-dense QA pairs.
2. **Token-budget-aware adaptive thresholds**: Merge decisions consider the remaining token budget, not just hit ratios. If budget has room, lower the threshold for more merging; if nearly full, raise it to prevent large chunks from blowing the budget.

HiChunk results: with Auto-Merge, evidence recall improves 12.7% over fixed-size chunking, and chunk count actually decreases — because merging consolidates redundantly covered fragments.

## KohakuRAG: Four-Level Tree + Bottom-Up Embedding Aggregation

[KohakuRAG (arXiv:2603.07612)](https://arxiv.org/abs/2603.07612) extends the hierarchy to four levels (document → section → paragraph → sentence) and does something LlamaIndex doesn't do by default: **bottom-up embedding aggregation**.

The traditional approach only embeds leaf nodes. KohakuRAG aggregates child embeddings upward, giving every level its own vector representation. Search can match at different granularities: coarse filtering at high levels, precise location at low levels.

In the WattBot 2025 Challenge (precise technical QA + citation tracking), KohakuRAG scored 0.861 to win both public and private leaderboards.

## Haystack's Implementation

[Haystack's AutoMergingRetriever](https://haystack.deepset.ai/blog/improve-retrieval-with-auto-merging) moved from experimental to the main framework in March 2025. The concept matches LlamaIndex but with a different API:

```python
from haystack.components.preprocessors import HierarchicalDocumentSplitter
from haystack.components.retrievers import AutoMergingRetriever

splitter = HierarchicalDocumentSplitter(
    block_sizes=[400, 200, 100],
    split_overlap=0
)
```

Haystack's `HierarchicalDocumentSplitter` uses `block_sizes` (descending order) to control levels, producing documents with parent-child metadata.

## Comparison with Other Methods

| Method | Stage modified | Needs LLM | Storage multiplier | What it solves |
|--------|---------------|-----------|-------------------|---------------|
| **Hierarchical + Auto-Merge** | Retrieval | No | ~3× | Chunk size dilemma |
| [Contextual Retrieval](/en/posts/ai/2026-03-12-contextual-retrieval-en) | Ingestion | Yes (per chunk) | ~1.1× | Chunk isolation |
| [Late Chunking](/en/posts/ai/2026-08-25-late-chunking-contextual-retrieval-en) | Embedding | No | 1× | Chunk isolation |
| Parent Document Retriever | Retrieval | No | ~2× | Chunk size dilemma (two levels only) |

**vs Contextual Retrieval**: Contextual Retrieval uses LLM to add context per chunk (costs money, adds latency); Hierarchical relies on structural design with no LLM. They can be stacked — do Contextual Retrieval first to improve leaf node embedding quality, then use Auto-Merge to solve the size dilemma.

**vs Late Chunking**: Late Chunking modifies the embedding stage (encode whole document first, then split); Hierarchical modifies the retrieval stage (split and embed normally, merge at retrieval time). Late Chunking requires a long-context embedding model; Hierarchical doesn't.

**vs Parent Document Retriever**: Conceptually the same lineage, evolved. Parent Document Retriever has only two levels and no Auto-Merge logic — it always returns the parent regardless of how many children matched. Hierarchical is multi-level + dynamic merging, offering finer granularity.

## Limitations

1. **Increased storage**: Three-level indexing requires storing raw text for all levels (~3× baseline). The leaf node vector index stays the same size, but text storage grows.
2. **Threshold tuning needed**: 50% is a reasonable default, but the optimal value depends on document structure and query type. HiChunk's adaptive threshold is the right direction but adds complexity.
3. **Doesn't fix embedding quality**: If leaf node embeddings are poor (e.g., table chunks missing headers), Hierarchical Chunking won't help — it affects retrieval granularity, not search precision. For that, combine with [Header Propagation or Table-Aware Chunking](/en/posts/ai/2026-03-12-chunking-strategies-en).
4. **Requires re-indexing**: Migrating from flat chunking means re-chunking, building the tree, and re-embedding all leaf nodes.

## Overall

Hierarchical Chunking + Auto-Merge is one of the few RAG improvements that needs no extra LLM cost, no embedding model change, and delivers predictable results. It solves a specific problem — the chunk size dilemma — with a deterministic approach that doesn't depend on model randomness.

LlamaIndex and Haystack both have it built in — no need to build from scratch. If your system already has a two-level Parent Document Retriever architecture, migrating to multi-level + Auto-Merge is a small change.

Consider stacking [Contextual Retrieval](/en/posts/ai/2026-03-12-contextual-retrieval-en) to further improve leaf node embedding quality, or combining with [Cross-Encoder Reranking](/en/posts/ai/2026-03-12-cross-encoder-reranking-en) for more precise filtering before merging. But even standalone, the structural design alone delivers the 12.7% evidence recall improvement reported in HiChunk — at zero additional LLM cost, that's a solid return.

## References

- [LlamaIndex — HierarchicalNodeParser](https://developers.llamaindex.ai/python/framework-api-reference/node_parsers/hierarchical)
- [LlamaIndex — AutoMergingRetriever](https://developers.llamaindex.ai/python/examples/retrievers/auto_merging_retriever/)
- [arXiv:2509.11552 — HiChunk: Evaluating and Enhancing RAG with Hierarchical Chunking (2025)](https://arxiv.org/abs/2509.11552)
- [arXiv:2603.07612 — KohakuRAG: A Simple RAG Framework with Hierarchical Document Indexing (2026)](https://arxiv.org/abs/2603.07612)
- [Haystack — Improving Retrieval with Auto-Merging](https://haystack.deepset.ai/blog/improve-retrieval-with-auto-merging)
- [Haystack — AutoMergingRetriever Documentation](https://docs.haystack.deepset.ai/docs/automergingretriever)
- [Firecrawl — Best Chunking Strategies for RAG in 2026](https://www.firecrawl.dev/blog/best-chunking-strategies-rag)
- [Chunking Strategies: How Splitting Decides Whether RAG Finds the Answer](/en/posts/ai/2026-03-12-chunking-strategies-en) (site)
- [Contextual Retrieval: Adding "What This Chunk Is About" to Every Chunk](/en/posts/ai/2026-03-12-contextual-retrieval-en) (site)
- [Cross-Encoder Reranking: Putting the Most Relevant Documents on Top](/en/posts/ai/2026-03-12-cross-encoder-reranking-en) (site)
- [Late Chunking and Contextual Retrieval](/en/posts/ai/2026-08-25-late-chunking-contextual-retrieval-en) (site)
