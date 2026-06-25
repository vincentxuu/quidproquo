---
title: "PageIndex: RAG Without Vectors — Turning Long Documents Into a Book With a Table of Contents"
date: 2026-05-08
type: deep-dive
category: ai
tags: [rag, llm, pageindex, vectorless, retrieval, financebench]
lang: en
tldr: "PageIndex skips chunking, embedding, and vector storage entirely. Instead it relies on LLM reasoning over a tree-structured table of contents the LLM itself wrote, achieving 98.7% on FinanceBench (GPT-4o reading directly scores only 31%). It solves a different problem than vector RAG — finding the right section in a well-structured long document."
description: "VectifyAI's open-source PageIndex dismantles the 'RAG = vector retrieval' assumption by replacing vector similarity with tree-structured tables of contents and LLM reasoning. This post covers how it works, how it differs from vector RAG, and when you should — and shouldn't — use it."
draft: false
series:
  name: "RAG 系統實戰"
  order: 6
---

> 🌏 [中文版](/posts/ai/2026-05-08-pageindex-vectorless-rag)

VectifyAI's open-source PageIndex takes a fundamentally different approach from mainstream RAG: no chunking, no embedding, no vector storage — yet it achieves 98.7% accuracy on FinanceBench (the same set of questions where GPT-4o reading directly scores only 31%). It reopens an assumption that most people take as a given: that doing RAG means doing vectors.

## Two Prerequisite Concepts

**RAG**: Let the model consult a specific set of notes before answering. The notes live in a database; when a question comes in, retrieve relevant passages and feed them to the model so it knows about internal enterprise data or domain-specific information.

**Vector retrieval**: The mainstream approach for finding answers in RAG. Convert each text segment into a high-dimensional coordinate, convert the question into a coordinate too, then calculate which ones are closest. Fundamentally, it uses semantic similarity to find answers.

What PageIndex replaces is precisely this vector retrieval step.

## How PageIndex Works

PageIndex treats an entire document as a "book with a table of contents," processing it in two phases:

**Phase 1: Tree construction.** An LLM reads through the entire PDF upfront and automatically generates a JSON tree-structured table of contents. Each node contains a title, summary, and page numbers — essentially an index the LLM writes for its own future queries.

```
{
  "title": "Annual Report 2024",
  "children": [
    {
      "title": "Item 1. Business Overview",
      "summary": "...",
      "pages": [3, 4, 5],
      "children": [
        { "title": "Products", "summary": "...", "pages": [3] },
        { "title": "Markets",  "summary": "...", "pages": [4, 5] }
      ]
    },
    {
      "title": "Item 7. MD&A",
      "summary": "...",
      "pages": [42, 43, 44, 45]
    }
  ]
}
```

**Phase 2: Reasoning-based retrieval.** When a query comes in, the system doesn't compute vector distances. Instead, it hands the entire table of contents to the LLM and lets it decide which section to turn to — just like a person flipping through a book. If the content it reads isn't enough to answer the question, it goes back and picks another node; once it has enough, it generates an answer from that content.

The key word here is "**reasoning**," not "**similarity**" — and that is the most fundamental difference between PageIndex and vector RAG.

## Two Approaches Solving Different Problems

Vector RAG and PageIndex both appear to solve "find the relevant passage," but they're actually solving different problems.

**Vector RAG is a single-shot hit**: question comes in, compute the top-k most similar passages, feed them to the model — done in milliseconds, low cost, can span a large number of documents.

**PageIndex is multi-step reasoning**: question comes in, read the table of contents, pick a branch, read the content, judge whether it's sufficient, go back if not. Slow and expensive (every step is an LLM call), but the path is traceable — you can see which sections it chose and why.

In long documents like financial reports, regulatory filings, and technical manuals, the gap between "semantically similar" and "actually relevant" directly determines accuracy. In an annual report, every "Risk Factors" section is semantically close, but only the one corresponding to the correct year and the correct subsidiary is actually the answer. This is the real source of 98.7% vs 31%.

```
Vector RAG:       Question ─► [embed] ─► top-k passages ─► LLM answer
                  (milliseconds, cheap, cross-document, not explainable)

PageIndex:        Question ─► LLM reads TOC ─┐
                                              ▼
                                    Pick node, read content
                                              │
                                    ┌─────────┴─────────┐
                                  Enough             Not enough
                                    │                    │
                                    ▼                    └─► Go back and pick again
                                  Answer
                  (seconds to minutes, expensive, deep single-document, traceable path)
```

## When to Use It — and When Not To

**Good fit**: Well-structured, long documents that will be queried repeatedly — annual reports, contracts, research papers, technical specifications. The one-time cost of building the tree is high, but the tree gets reused, so the amortized cost is reasonable.

**Not a good fit**:

- Broad searches across massive document collections — each document requires at least one LLM call to start, so costs explode as document count grows.
- Loosely structured text (casual notes, forum posts, chat logs) — there's no hierarchy to build a tree from.
- Documents that are only queried once and discarded — the tree-building cost can't be amortized.
- Latency-sensitive applications — vector retrieval runs in milliseconds; PageIndex runs in seconds to minutes.

A pragmatic approach is **hybrid**: use vector retrieval to first narrow down a handful of candidate documents, then use PageIndex to navigate precisely within a single document. Broad search in the first stage, deep dive in the second — each side handles what it's best at.

## The Bigger Picture

The truly noteworthy thing about PageIndex isn't the 98.7% number — it's that it reopens the assumption that "doing RAG necessarily means doing vectors." As LLM inference gets cheaper and context windows get longer, the cost curve for "just let the model read a table of contents" will keep trending downward.

It isn't trying to replace vector RAG. Rather, it carves out a domain where vectors don't perform well: finding the right section in a well-structured long document may not need vectors at all.

## References

- [VectifyAI/PageIndex (GitHub, MIT)](https://github.com/VectifyAI/PageIndex)
- [PageIndex Official Site](https://pageindex.ai/)
- [PageIndex Developer Docs](https://docs.pageindex.ai/)
- [Reasoning-Based RAG (Official Concept Page)](https://www.mintlify.com/vectifyai/pageindex/concepts/reasoning-based-rag)
- [VectifyAI/Mafin2.5-FinanceBench (98.7% Benchmark Repo)](https://github.com/VectifyAI/Mafin2.5-FinanceBench)
- [MarkTechPost: VectifyAI Launches Mafin 2.5 and PageIndex](https://www.marktechpost.com/2026/02/22/vectifyai-launches-mafin-2-5-and-pageindex-achieving-98-7-financial-rag-accuracy-with-a-new-open-source-vectorless-tree-indexing/)
- [Towards AI: PageIndex — The RAG Framework That Threw Out Vector Databases](https://pub.towardsai.net/pageindex-the-rag-framework-that-threw-out-vector-databases-and-still-hit-98-7-accuracy-d194e0549478)
- [pageindex_RAG_simple.ipynb (Official Cookbook)](https://github.com/VectifyAI/PageIndex/blob/main/cookbook/pageindex_RAG_simple.ipynb)
- [GraphRAG: Turning Knowledge Into Graphs for LLM Reasoning Along Relationships](/posts/ai/2026-03-12-graph-rag)
