---
title: "CS124 Week 4 Information Retrieval: The Indexing and Ranking Layer Beneath RAG"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, information-retrieval, rag, nlp]
lang: en
series: { name: "Reading Stanford CS124", order: 5 }
tldr: "Week 4 builds candidates with an inverted index, ranks them with tf-idf and cosine similarity, and then connects retrieved evidence to generation; PA3 exposes RAG's inspectable retrieval half."
description: "Stanford CS124 Winter 2026 Week 4: information retrieval, inverted indexes, tf-idf, cosine ranking, RAG, Lab 3, and PA3."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week4-information-retrieval)

Week 4 reframes “what does the model know?” as “where does the system look?” The assigned chapter is explicitly titled *Information Retrieval and Retrieval-Augmented Generation*: construct the index and ranking system first, then connect retrieved evidence to a generator.

**Version:** Winter 2026. **Unit:** Week 4, January 27 and 29. **Public materials:** the [schedule](https://web.stanford.edu/class/cs124/lec/), [SLP3 Chapter 11](https://web.stanford.edu/~jurafsky/slp3/11.pdf), [Lab 3](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md), [solutions](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md), and [PA3](https://github.com/cs124/pa3-information-retrieval). **Gap:** Canvas video and Gradescope Quiz 3 are gated, and the current Chapter 11 PDF postdates the class. This account stays with the retrieval pipeline shared by the schedule, lab, and assignment.

## Retrieval starts with candidates

Assigned [SLP3 Chapter 11](https://web.stanford.edu/~jurafsky/slp3/11.pdf) explains that scanning every document for every query scales linearly with the corpus and that an inverted index reverses the mapping: each term points to a posting list of documents containing it. Query-time intersections and unions create a candidate set.

Index construction depends on Week 2 tokenization. Case normalization, punctuation, stemming, and stop-word decisions all alter posting lists. Preprocessing defines the later search space.

## tf-idf balances local frequency and global rarity

Term frequency records how often a term occurs in a document; document frequency records how broadly it occurs across the corpus. Inverse document frequency downweights ubiquitous terms and raises rarer ones. Their product yields vectors for queries and documents, while cosine similarity compares direction rather than rewarding document length alone.

This ranking does not understand truth, but its score is inspectable: the query terms, document terms, and weights that raised a result can be traced.

## Retrieval evaluation separates failures

Precision measures how many retrieved items are relevant; recall measures how many relevant items were retrieved. Rank-aware metrics focus on the top of the list. Candidate generation often favors recall so good documents are not excluded, while reranking emphasizes precision. One aggregate score can hide the difference between “never retrieved” and “ranked poorly.”

## RAG makes retrieval generator input

Model parameters have a training cutoff and can produce unsupported claims. RAG retrieves passages and places them in generation context. The retriever decides which evidence is visible; the generator decides how to use it.

Connecting a vector database is not the end of the design. Tokenization, chunking, indexing, query formulation, ranking, and context packing can each change the answer. A retrieval miss cannot be repaired by a stronger generator because the relevant passage never arrives.

CS124 begins with sparse retrieval because it provides a hand-computable, debuggable baseline. Dense retrieval changes representations but does not remove candidate generation, ranking, or evaluation.

## A reproducible Lab 3 and PA3 exercise

Before reading the public solution, build a five-document corpus, create an inverted index, compute tf-idf, and rank two queries by cosine similarity. Explain each top result term by term. Then introduce a synonym-only query to expose lexical mismatch. Compare dense retrieval only on the same corpus and relevance judgments; otherwise the comparison is a demo rather than an evaluation.

## What postings store

A minimal posting stores document IDs for Boolean queries. Term-frequency scoring requires counts; phrase queries require positions. Richer postings enable more query types at storage and construction cost.

Stable docIDs and sorted posting lists permit linear two-pointer intersections. Processing a short list first shrinks multi-term candidates quickly. Phrase and proximity queries depend on positional streams, so punctuation, hyphens, stop-word removal, and tokenization directly affect matching.

Indexes also need document lengths and corpus size for normalization and IDF. Corpus updates change those statistics. Even a teaching assignment should record corpus version so scores can be reproduced.

## Hand-computing tf-idf ranking

With three documents and a two-term query, calculate TF, DF, IDF, vector dot products, and cosine normalization. A term appearing everywhere contributes little discrimination; a rare term receives greater weight. Rarity is only a corpus signal—typos and noise can also be rare.

Preserve term-level score contributions. An unreasonable result can then be assigned to TF, IDF, length normalization, or token mismatch instead of disappearing inside one cosine value.

## Judgments and query sets

Relevance belongs to a query and information need, not a document alone. Incomplete judgments can mark useful unjudged results as false positives. Precision@k emphasizes the visible top, recall coverage, reciprocal rank the first relevant result, and average precision multiple relevant results. Choose metrics for the task.

Slice queries into exact facts, broad topics, rare entities, and synonym mismatch. Keep corpus, queries, judgments, and metric code fixed while changing one retrieval factor at a time.

## Chapter 11's retrieval-to-generation path

Chapter 11 moves from information needs and web retrieval to LLM answers grounded in external text. A RAG pipeline separates query processing, candidate retrieval, ranking, context selection, and generation. Preserve normalized query, candidate IDs and scores, selected passages, answer, and citations.

Chunk size trades context against precision; overlap preserves boundary information while increasing duplication. Citation improves traceability but does not guarantee source quality. RAG should not be summarized as making hallucination impossible.

## Reproducible Lab 3 and PA3 evidence

Attempt public [Lab 3](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md) before opening solutions. Preserve postings, term contributions, and expected ranking, then diagnose differences in tokenization, logarithm conventions, normalization, or tie-breaking.

For [PA3](https://github.com/cs124/pa3-information-retrieval), keep failure logs for exact lexical match, synonym-only queries, and queries dominated by common words. A useful delivery includes index statistics, a query set, top-k outputs, metrics, and error slices. That evidence remains useful in production RAG and proves more than one successful chat transcript.

## Further study

For production RAG, preserve queries, relevant passages, and failure categories before changing chunking or embeddings. Make retrieval evaluation rerunnable so improvements can be assigned to the correct layer.

## References

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [SLP3 Chapter 11](https://web.stanford.edu/~jurafsky/slp3/11.pdf)
- [CS124 Lab 3](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval.md)
- [CS124 Lab 3 Solutions](https://github.com/cs124/labs/blob/main/Lab3_InformationRetrieval_Solutions.md)
- [CS124 PA3](https://github.com/cs124/pa3-information-retrieval)
