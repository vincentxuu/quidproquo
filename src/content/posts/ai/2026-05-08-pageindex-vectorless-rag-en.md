---
title: "PageIndex: RAG Without Vectors — Turning Long Documents Into a Book With a Table of Contents"
date: 2026-05-08
type: deep-dive
category: ai
tags: [rag, llm, pageindex, vectorless, retrieval, financebench]
lang: en
tldr: "PageIndex skips chunking, embedding, and vector storage entirely. Instead it relies on LLM reasoning over a tree-structured table of contents the LLM itself wrote, reporting 98.7% on FinanceBench in its own vendor-run evaluation. It solves a different problem than vector RAG — finding the right section in a well-structured long document."
description: "VectifyAI's open-source PageIndex dismantles the 'RAG = vector retrieval' assumption by replacing vector similarity with tree-structured tables of contents and LLM reasoning. This post covers how it works, how it differs from vector RAG, and when you should — and shouldn't — use it."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 9
---

> 🌏 [中文版](/posts/ai/2026-05-08-pageindex-vectorless-rag)

VectifyAI's open-source PageIndex takes a fundamentally different approach from mainstream RAG: no chunking, no embedding, no vector storage — instead, an LLM reasons over a tree-structured table of contents. The number it is most often cited for is 98.7% accuracy on FinanceBench, and that number comes with conditions we will unpack in its own section below. First, the part that genuinely matters: it reopens an assumption most people take as a given — that doing RAG means doing vectors.

## Two Prerequisite Concepts

**RAG**: Let the model consult a specific set of notes before answering. The notes live in a database; when a question comes in, retrieve relevant passages and feed them to the model so it knows about internal enterprise data or domain-specific information.

**Vector retrieval**: The mainstream approach for finding answers in RAG. Convert each text segment into a high-dimensional coordinate, convert the question into a coordinate too, then calculate which ones are closest. Fundamentally, it uses semantic similarity to find answers.

What PageIndex replaces is precisely this vector retrieval step.

## How PageIndex Works

PageIndex treats an entire document as a "book with a table of contents," processing it in two phases:

**Phase 1: Tree construction.** The whole PDF is read through upfront to produce a JSON tree-structured table of contents. Each node contains a title, summary, and page numbers — an index built for the queries that come later.

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

In long documents like financial reports, regulatory filings, and technical manuals, the gap between "semantically similar" and "actually relevant" directly determines accuracy. In an annual report, every "Risk Factors" section is semantically close, but only the one corresponding to the correct year and the correct subsidiary is actually the answer. This is exactly the territory PageIndex targets — how far ahead it actually is, the next section unpacks.

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

## How to Read the 98.7% Number

This figure gets retold as "vectorless RAG beats vector RAG," but its provenance needs stating plainly:

- **98.7% is a vendor self-evaluation.** It comes from VectifyAI running its own commercial system Mafin 2.5 (built on PageIndex) against the public [FinanceBench](https://arxiv.org/abs/2311.11944) question set. The [evaluation code is open-sourced](https://github.com/VectifyAI/Mafin2.5-FinanceBench), which is more transparent than most vendor numbers — but the party designing, running, and being measured by the evaluation is still the same party.
- **The 31% usually quoted alongside it is not a GPT-4o control.** In the original table that cell is labelled "ChatGPT 4o + Search," it covers only 66.7% of the questions, and the figure is carried over from a third party — it is not a baseline produced by the same pipeline. Treating 98.7% vs 31% as the gap between "reasoning" and "vectors" is measuring with two different rulers.
- **FinanceBench is single-document QA.** Each question targets one specific financial report — precisely the shape that tree navigation is best at.

Later third-party work has tested this directly, and the results conflict:

- Lumer et al. ([arXiv:2511.18177](https://arxiv.org/abs/2511.18177)) evaluated 1,200 SEC 10-K/10-Q/8-K filings on a 150-question benchmark and found **vector-based agentic RAG achieving a 68% win rate over hierarchical node-based systems**, at comparable latency (5.2s vs 5.98s).
- A cross-domain study spanning finance, legal, and medical documents ([arXiv:2604.14222](https://arxiv.org/abs/2604.14222)) reached the opposite conclusion: on the same 150 FinanceBench questions, Tree Reasoning scored 0.938 against Vector RAG's 0.821 — **but vector search won on the multi-document synthesis tier**.
- A third-party benchmark with published code and data ([repo](https://github.com/adorosario/pageindex-rag-benchmark)) reports that tree indexing could not be built over a 2,795-document corpus at all, forcing a fallback to FAISS vector retrieval. The author discloses that he founds one of the evaluated providers, which is worth factoring in when reading it.

Stacking these together, the defensible claim is: **inside a single well-structured long document, reasoning-based navigation really is more precise than similarity search; across a large document collection the advantage shrinks or reverses.** Not "vector RAG has been replaced."

## When to Use It — and When Not To

**Good fit**: Well-structured, long documents that will be queried repeatedly — annual reports, contracts, research papers, technical specifications. The one-time cost of building the tree is high, but the tree gets reused, so the amortized cost is reasonable.

**Not a good fit**:

- Broad searches across massive document collections — every document costs at least one tree build, so costs explode as document count grows, and this is exactly where the third-party evaluations above fall over.
- Loosely structured text (casual notes, forum posts, chat logs) — there's no hierarchy to build a tree from.
- Documents that are only queried once and discarded — the tree-building cost can't be amortized.
- Latency-sensitive applications — vector retrieval runs in milliseconds; PageIndex runs in seconds to minutes.

A pragmatic approach is **hybrid**: use vector retrieval to first narrow down a handful of candidate documents, then use PageIndex to navigate precisely within a single document. Broad search in the first stage, deep dive in the second — each side handles what it's best at. This is also the direction both third-party papers above end up recommending.

## Current State of the Project

The open-source repo (MIT licensed) now offers two tree-building modes. The default **flash** mode extracts structure heuristically and only calls an LLM for node summaries and an optimization expansion pass, which is dramatically faster. `--mode standard` is the fully LLM-driven build, and the structure-tuning flags (`--max-pages-per-node`, `--max-tokens-per-node`, and friends) only take effect there. Markdown input is also supported via `--md_path`, using `#` levels to infer node depth. The repo ships an agentic vectorless RAG example wired up with the OpenAI Agents SDK.

The project is growing along two axes: **PageIndex File System**, a file-level tree index layered on top so reasoning can span a corpus rather than one document — an attempt at its structural weakness — and a hosted service (chat platform, MCP server, API). The maintainers state plainly that the enhanced OCR and tree-building pipeline lives in the cloud service, while the open-source package uses standard PDF parsing. In other words, what you get from a local install is not the same pipeline that produced the published benchmark, and that belongs in your evaluation.

## The Bigger Picture

The truly noteworthy thing about PageIndex isn't the 98.7% number — that is a vendor self-evaluation, and the 31% it gets compared against is not even the same experiment. What matters is that it reopens the assumption that "doing RAG necessarily means doing vectors." As LLM inference gets cheaper and context windows get longer, the cost curve for "just let the model read a table of contents" will keep trending downward.

It isn't trying to replace vector RAG. Rather, it carves out a domain where vectors don't perform well: finding the right section in a well-structured long document may not need vectors at all. Conversely, once you scale to thousands of documents, the current evidence says it has to invite vectors back in.

## References

- [VectifyAI/PageIndex (GitHub, MIT)](https://github.com/VectifyAI/PageIndex)
- [PageIndex Official Site](https://pageindex.ai/)
- [PageIndex Developer Docs](https://docs.pageindex.ai/)
- [PageIndex: Next-Generation Vectorless, Reasoning-based RAG (official technical write-up)](https://pageindex.ai/blog/pageindex-intro)
- [VectifyAI/Mafin2.5-FinanceBench (the 98.7% evaluation repo — vendor self-reported)](https://github.com/VectifyAI/Mafin2.5-FinanceBench)
- [FinanceBench: A New Benchmark for Financial Question Answering (arXiv:2311.11944)](https://arxiv.org/abs/2311.11944)
- [Rethinking Retrieval: vector-based agentic RAG vs hierarchical node-based systems over 1,200 SEC filings (arXiv:2511.18177)](https://arxiv.org/abs/2511.18177)
- [Adaptive Query Routing: Vector / Tree / Hybrid across financial, legal, and medical documents (arXiv:2604.14222)](https://arxiv.org/abs/2604.14222)
- [adorosario/pageindex-rag-benchmark (third-party multi-document benchmark, with author conflict-of-interest disclosure)](https://github.com/adorosario/pageindex-rag-benchmark)
- [MarkTechPost: VectifyAI Launches Mafin 2.5 and PageIndex](https://www.marktechpost.com/2026/02/22/vectifyai-launches-mafin-2-5-and-pageindex-achieving-98-7-financial-rag-accuracy-with-a-new-open-source-vectorless-tree-indexing/)
- [Towards AI: PageIndex — The RAG Framework That Threw Out Vector Databases](https://pub.towardsai.net/pageindex-the-rag-framework-that-threw-out-vector-databases-and-still-hit-98-7-accuracy-d194e0549478)
- [pageindex_RAG_simple.ipynb (Official Cookbook)](https://github.com/VectifyAI/PageIndex/blob/main/cookbook/pageindex_RAG_simple.ipynb)
- [GraphRAG: Turning Knowledge Into Graphs for LLM Reasoning Along Relationships](/posts/ai/2026-03-12-graph-rag-en)
