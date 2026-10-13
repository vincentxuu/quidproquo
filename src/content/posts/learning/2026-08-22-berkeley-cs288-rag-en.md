---
title: "Turning Retrieval, RAG, and Advanced Architectures into a System | Berkeley CS288 Topic Guide"
date: 2026-08-22
category: learning
tags: [berkeley, cs288, rag, retrieval, llm, evaluation]
lang: en
type: guide
difficulty: 深度
tldr: "Units 13–14 connect models to external knowledge; A3 requires data collection, QA annotation, indexing, and ablations under CPU and latency constraints."
description: "A guide to CS288 Retrieval and RAG, Advanced Architectures, and the end-to-end design of Assignment 3."
draft: false
series: { name: "Reading Berkeley CS288", order: 4 }
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs288-rag)

[Units 13–14](https://cal-cs288.github.io/sp26/) move from model internals to system boundaries: knowledge sources, segmentation and indexing, evidence delivery to a generator, and architectural trade-offs. The useful reading strategy is not memorizing a RAG diagram, but following Assignment 3's failure decomposition.

## Four separable RAG decisions

Separate corpus, retrieval unit, retriever, and generator. The corpus sets scope and timestamp. Chunking sets evidence granularity. Sparse, dense, or hybrid retrieval forms candidates. Only then does the generator turn question and evidence into an answer. Changing all four at once destroys attribution.

## A3 intentionally has no starter code

[Assignment 3](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment3.pdf) asks teams to answer short questions about Berkeley EECS pages. They crawl and clean the site, construct validation data, check annotation agreement, build a corpus, and use Exact Match, token F1, and retrieval recall for ablations.

The grading environment has no GPU, 4GB RAM, fixed dependencies and entry points, model-size limits, and latency constraints. The largest model is therefore not necessarily the deliverable system. A self-study version can use a smaller question set, but should retain timestamps, source URLs, retrieval recall, and end-to-end metrics.

## Access and safety boundaries

The PDF is public; hidden data, the official wrapper, and Gradescope are not. Solutions must not be distributed. Impact and Social Implications appears on the schedule without anonymous slides, so this article recommends recording crawl scope, personal-data handling, refresh policy, and citations without pretending those recommendations summarize the private lecture.

Try this tonight: crawl ten public EECS pages, write ten short-answer questions, build a BM25 baseline, save top-k evidence, and classify each failure as retrieval or generation.

## Separate retrieval and generation failures

This is an invented teaching example, not an official assignment solution.

An invented question asks for a classroom; the correct source says Room 101. In case one, top-k documents contain no room information and the model answers Room 202: mark a retrieval miss. In case two, top-k includes Room 101 but the answer remains Room 202: evidence was retrieved, so mark a generation miss. Both final answers are wrong, but diagnosis differs.

**Check and answer:** With correct evidence retrieved for eight of ten questions and six correct answers, does 60% end-to-end accuracy alone justify replacing the generator? No: inspect retrieval misses separately from failures despite available evidence.

## Changelog

- 2026-10-11: Added an invented example, worked calculation or reasoning, and a comprehension check with an answer.

## References

- [CS288 Retrieval and RAG schedule entry](https://cal-cs288.github.io/sp26/)
- [Assignment 3 specification](https://cal-cs288.github.io/sp26/assignments/Sp2026_CS288_Assignment3.pdf)
- [Assignments index](https://cal-cs288.github.io/sp26/assignments/)

