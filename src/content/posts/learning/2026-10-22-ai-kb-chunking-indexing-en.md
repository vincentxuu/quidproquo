---
title: "Chunking and Indexing: How Big to Cut, What to Search With, and How to Know You Chose Right"
date: 2026-10-22
category: learning
type: guide
tags: [knowledge-base, rag, chunking, hybrid-search, embedding]
lang: en
tldr: "Building an index means three decisions: the chunking unit, whether to search with keywords, vectors or both, and which embedding model to use. All three are semi-permanent, since changing any of them means rebuilding. The research is cautious: semantic chunking isn't consistently better, splitting by sentences or by document structure is usually enough, and overlap has small, setup-dependent effects. In one Traditional Chinese study, the correct passage ranked first 57% of the time with vector search alone, keyword search 76%, and the two combined 81%. Don't choose by feel: compare two setups on order 11's test questions, changing one thing at a time."
description: "Building Knowledge Bases, order 16: why the three decisions are semi-permanent, how to choose a chunking unit (research on semantic chunking and overlap), how keyword, vector and hybrid search perform in Traditional Chinese, embedding models and language, and how to compare two setups with your test questions."
series:
  name: "Building Knowledge Bases"
  order: 16
---

> 🌏 [中文版](/posts/learning/2026-10-22-ai-kb-chunking-indexing)

A support colleague asks the AI, "How many years of warranty does model A-3021 have?" The product manual says it plainly, yet the AI says it can't find it. There are two reasons: the manual was cut into 500-character chunks, with "A-3021" at the end of one chunk and the warranty period at the start of the next; and the system uses only vector search, in which a model number like "A-3021" is nearly indistinguishable from "A-3012".

This is the sixth post in the AI part of "Building Knowledge Bases". [Order 15](/posts/learning/2026-10-22-ai-kb-metadata-schema-en) settled which fields each chunk carries; this post covers how big to cut documents, how to search them, and how to know you chose right. The site's post on [Chunking Strategies](/posts/ai/2026-03-12-chunking-strategies-en) covers chunking algorithms and reranking in more detail, so this post won't repeat them. By the end you'll be able to compare two chunking setups with your test questions and pick the better one.

## Three decisions, all semi-permanent

Building an index involves three decisions:

1. **The chunking unit**: how big a chunk is and what it's split on.
2. **What to search with**: keywords, vectors, or both.
3. **The embedding model**: which model turns text into vectors, and whether it understands your language.

They're semi-permanent because changing them means rebuilding. Change how you chunk, and every document has to be re-chunked; changing the embedding model is worse. MongoDB's documentation is clear that vectors from different models can't be compared, and even if the dimensions match, every document has to be re-embedded ([MongoDB: Migrate to a new embedding model](https://www.mongodb.com/docs/voyageai/tutorials/migrate-embedding-model/)). So it pays to compare options with your test questions at the start.

## Decision one: the chunking unit

**Semantic chunking isn't consistently better.** Semantic chunking uses embeddings to detect where the topic changes and splits there. In 2025 Qu and colleagues compared approaches on several datasets: on data that was already made of long documents, splitting by a fixed number of sentences did best; semantic chunking clearly won only on data the authors built by stitching many short texts into one, where topics were jumbled ([Qu et al. 2025](https://aclanthology.org/2025.findings-naacl.114/)). They also found that the choice of embedding model mattered a lot: the best model beat the next best by more than 7% on average.

**Splitting by sentences is about as good as semantic splitting.** In Bennani and Moslonka's 2026 comparison, sentence-based and semantic chunking scored almost the same, both slightly better than splitting by a fixed number of tokens ([Bennani & Moslonka 2026](https://arxiv.org/abs/2601.14123)).

**Overlap has small, setup-dependent effects.** Overlap means letting neighboring chunks share some text so sentences aren't cut off. In their setup, Bennani and Moslonka added 20% overlap and scores barely changed, while the number of chunks grew by a quarter. Chroma's 2024 technical report also saw no benefit from overlap in most setups, but with a small embedding model and fixed-token chunking, recall was clearly higher with overlap ([Chroma 2024](https://www.trychroma.com/research/evaluating-chunking)). The same report found OpenAI's default of 800 tokens with 400 overlap had slightly below-average recall. So the safer statement is that whether overlap helps depends on your setup; if you can't measure a difference, leave it off.

**My suggestion:** chunk by document structure first, meaning, as [order 13](/posts/learning/2026-10-22-ai-kb-parsing-cleaning-en) described, by heading hierarchy with a heading path on each chunk; for long text without clear structure, group sentences into chunks. Add semantic chunking and large overlaps only once your test questions show a need. Qu and colleagues also observed, while analyzing errors, that problems with fixed splitting could often be solved by splitting by section first.

## Decision two: keywords, vectors, or both

Vector search is good at finding content with similar meaning, but not at things that must match exactly, such as names, numbers and codes; keyword search (e.g. BM25) is the reverse.

**In Traditional Chinese research, keyword search holds up well.** In 2025 Hsu and Tzeng of National Chengchi University compared methods on DRCD, a Traditional Chinese reading-comprehension dataset; the share of questions whose correct passage ranked first was 57% with OpenAI's embedding model alone, 76% with BM25 alone, and 81% with the two combined ([Hsu & Tzeng 2025](https://arxiv.org/abs/2503.23013)).

**When text is messy, hybrid doesn't always win.** Another study by the same team on scanned financial reports found that when OCR text hadn't been cleaned, BM25 beat hybrid search; once the text was cleaned, hybrid search did best ([Hsu et al. 2025](https://arxiv.org/abs/2503.08452)). This echoes order 13: parsing quality affects every later step.

**Hybrid isn't always worth its cost, either.** [Order 11](/posts/learning/2026-10-22-ai-knowledge-base-test-questions-first-en) mentioned Kucia and Gawlik's study ([Kucia & Gawlik 2026](https://arxiv.org/abs/2609.14579)): on real users' questions, hybrid search was no more accurate than pure vector search, yet slower.

So my suggestion: for a Traditional Chinese knowledge base, default to hybrid search, because queries for model numbers, part numbers, names and regulation article numbers are common; but confirm with your test questions that it actually does better on your data. The site's post on [Hybrid Search](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en) covers how it works.

## Decision three: the embedding model and language

Whether an embedding model understands your language can make a big difference. In 2024 the C-Pack team built a benchmark for Chinese embeddings; on the same set of Chinese retrieval questions, OpenAI's text-embedding-ada-002 scored 52 and the team's own BGE-large scored 71.5 ([Xiao et al. 2024](https://doi.org/10.1145/3626772.3657878)). Three caveats: the benchmark and the BGE model come from the same team; the data is Simplified Chinese, with no Traditional Chinese; and ada-002 is an older model, and the authors themselves note Chinese embeddings have improved a lot since.

So choose a model with your own test questions: pick two or three candidates, build an index with each, and see whether the source passages rank near the top. The site's posts on [BGE-M3](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en) and [why a more expensive embedding won't save Traditional Chinese RAG](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures-en) cover practical Traditional Chinese experience; for what an embedding is, see [Embeddings: How Models Turn Words Into Computable Vectors](/posts/ai/2026-08-26-understanding-ai-models-embedding-en).

## How to compare two setups with your test questions

Every question in order 11's test set comes with its source passage, and that's the basis for comparison:

1. **Pick one metric.** The simplest is "does the source passage appear in the top 5", scored 1 or 0 per question; the average is the hit rate.
2. **Change one thing at a time.** For example, different chunking with everything else the same; change chunking and model together and you can't tell which caused the difference.
3. **Build an index for each setup and run every test question.** Record each question's result on both sides.
4. **Look at the overall result and at individual questions.** The setup with the higher overall hit rate isn't necessarily better on every question; pulling out the questions where the two differ often shows which kind of question is affected, such as number lookups or questions spanning sections.
5. **With few questions, a difference of one or two doesn't count.** One question out of 20 may just be luck; decide when you see a clear gap, or when one kind of question consistently improves.

## Example: one question, two chunking setups

Question: "How many years of warranty does model A-3021 have?" Source: "Product manual", chapter 4, "Warranty".

**Setup A: 500-character chunks, vector search only.**

Three of the top 5 are about other models' warranties, one is A-3021's spec table, and the source chunk ranks 9th. Because the cut fell between the model number and the warranty, the chunk with the warranty period doesn't contain "A-3021" at all.

**Setup B: chunked by heading, each chunk carrying its heading path, hybrid search.**

The source chunk becomes "Product manual > A-3021 > 4. Warranty", with the model number in the heading path; keyword search matches "A-3021" directly, and this chunk ranks 1st.

If, across 20 test questions, setup B's hit rate is clearly higher and the number-lookup questions all improve, choose B.

## Limits of the research

Qu and Bennani used English data, and Bennani tested overlap with sparse retrieval on English Wikipedia, which doesn't carry over directly to vector retrieval; Chroma's report is the vendor's own evaluation. The two Traditional Chinese studies use a reading-comprehension dataset and scanned financial reports, not ordinary company documents. C-Pack is Simplified Chinese. The best chunking and retrieval setup depends heavily on the data; this research can tell you that you don't need complicated methods at the start, but not which one your data needs.

## What you can do tonight

1. **Check your current chunking settings.** Chunk size, overlap, what it splits on; you may never have changed many tools' defaults.
2. **Check which kind of search you use.** If it's vectors only, pick three test questions containing numbers or names and see whether they're found.
3. **Build a heading-based index and compare it with your current one.** Use order 11's test questions and compute the top-5 hit rate.
4. **Record the current settings and results.** Use that record for every later change of model or chunking.

## Self-check

**Q:** If a Traditional Chinese corpus uses vector search only, what might it miss?

**How to judge:** Things that must match exactly: names, product model numbers, document numbers, regulation article numbers. Vector search groups similar meanings together, so "A-3021" and "A-3012" are nearly identical as vectors; Traditional Chinese research also found keyword search beating pure vector search. OCR typos in scans make this worse. So add keyword search by default, and include a few number and name questions in your test set.

## References

- [MongoDB Docs, Migrate to a New Embedding Model](https://www.mongodb.com/docs/voyageai/tutorials/migrate-embedding-model/)
- [Qu, Tu & Bao 2025, Is Semantic Chunking Worth the Computational Cost? (Findings of NAACL 2025)](https://aclanthology.org/2025.findings-naacl.114/)
- [Bennani & Moslonka 2026, A Systematic Analysis of Chunking Strategies for Reliable Question Answering (ECIR 2026, arXiv)](https://arxiv.org/abs/2601.14123)
- [Chroma 2024, Evaluating Chunking Strategies for Retrieval](https://www.trychroma.com/research/evaluating-chunking)
- [Hsu & Tzeng 2025, DAT: Dynamic Alpha Tuning for Hybrid Retrieval in Retrieval-Augmented Generation (arXiv)](https://arxiv.org/abs/2503.23013)
- [Hsu, Lin, Lin & Tzeng 2025, KAP: MLLM-assisted OCR Text Enhancement for Hybrid Retrieval in Chinese Non-Narrative Documents (arXiv)](https://arxiv.org/abs/2503.08452)
- [Kucia & Gawlik 2026, Beyond Benchmark Scores: How Synthetic and Authentic Query Distributions Diverge in RAG Evaluation (CIKM 2026, arXiv)](https://arxiv.org/abs/2609.14579)
- [Xiao et al. 2024, C-Pack: Packed Resources For General Chinese Embeddings (SIGIR 2024)](https://doi.org/10.1145/3626772.3657878)
- On this site: [Chunking Strategies: How You Split Text Determines Whether RAG Can Find the Answer](/posts/ai/2026-03-12-chunking-strategies-en)
- On this site: [Hybrid Search: Using BM25 + Vector Search to Cover Each Other's Blind Spots](/posts/ai/2026-03-12-hybrid-search-bm25-vector-rrf-en)
- On this site: [BGE-M3: Why This Embedding Model Works Well for Traditional Chinese RAG](/posts/ai/2026-03-12-bge-m3-embedding-model-selection-en)
- On this site: [A More Expensive Embedding Won't Save Your Traditional Chinese RAG: Three Layers of Failure and the Fix Order](/posts/ai/2026-06-04-zh-tw-embedding-rag-failures-en)
- On this site: [Embeddings: How Models Turn Words Into Computable Vectors](/posts/ai/2026-08-26-understanding-ai-models-embedding-en)
