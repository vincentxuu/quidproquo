---
title: "CS124 Week 5 Embeddings and Social NLP: Context Vectors and the Public-Evidence Boundary"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, embeddings, social-nlp, nlp]
lang: en
series: { name: "Stanford CS124 導讀", order: 6 }
tldr: "Week 5's public materials support the distributional hypothesis, word embeddings, and cosine similarity; the paired Social NLP lecture is unrecorded and restricted, so concrete audit methods are labeled as author extensions."
description: "Stanford CS124 Winter 2026 Week 5: distributional hypothesis, word embeddings, cosine similarity, representation learning, Social NLP, and PA4."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week5-embeddings-social-nlp)

Week 5 is the first major representation-learning turn in CS124. Earlier representations are largely designed by people; embeddings are learned from contexts. The [official schedule](https://web.stanford.edu/class/cs124/lec/) pairs Embeddings material with Dan Jurafsky's live “Social NLP / NLP for Computational Social Science” lecture. The former has a public chapter and PA4; the latter is unrecorded and restricted, so this article does not reconstruct its argument.

**Version:** Winter 2026. **Unit:** Week 5, February 3 and 5. **Instructor:** Dan Jurafsky, including the February 3 live Social NLP lecture. **Public materials:** the [schedule](https://web.stanford.edu/class/cs124/lec/), [SLP3 Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf), and [PA4](https://github.com/cs124/pa4-embeddings). The syllabus assigns Chapter 5 pp.1–12 and 17–21 plus Chapter 10 pp.9–12 from the August 2025 release. **Gap:** the live lecture was not recorded, its Social NLP slides return 403 from the restricted path, and Canvas narration and Quiz 4 are gated. This article covers the public embeddings agenda and does not invent the live lecture's examples.

## Meaning from context

The distributional hypothesis and embedding definitions follow assigned [SLP3 Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf).

The distributional hypothesis says that words appearing in similar contexts tend to have similar meanings. Instead of manually defining every word, a system builds representations from neighboring usage.

A count-based vector can assign one dimension to each context word and record co-occurrence. Cosine similarity compares directions rather than raw lengths, reducing the tendency for globally frequent words to look similar to everything merely because their counts are large.

## From sparse counts to learned vectors

Raw co-occurrence matrices are high-dimensional, sparse, and dominated by frequent terms. Weighting such as PPMI highlights pairs occurring more often than independence would predict. Dense embeddings compress the statistics into a smaller continuous space.

[Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf) explains that word2vec-style methods learn vectors through a prediction objective instead of storing the full count matrix. The representation becomes an output of data and objective rather than a hand-written feature list. The [PA4 repository](https://github.com/cs124/pa4-embeddings) adds PyTorch and Transformers dependencies as the course moves into learned representations.

## One point per word is a limitation

A static embedding assigns one vector to each vocabulary item. It captures useful relations but merges polysemy: river-bank and financial-bank share a point. Contextualized embeddings later generate different token states from the surrounding sentence.

Static vectors still provide inexpensive, visualizable baselines. For stable lexical similarity or small data, they may be easier to deploy and inspect than a large contextual encoder.

## Author extension: a bounded audit of vector associations

The following is an author extension from [Chapter 5's](https://web.stanford.edu/~jurafsky/slp3/5.pdf) account of vectors learned from corpus distributions, not a reconstruction of the live Social NLP lecture. Distributional learning preserves corpus associations; vector proximity alone does not establish causal or person-level claims.

Proximity in a vector space is not a natural essence. Before interpreting person, occupation, or group vectors, ask where the corpus came from, who is overrepresented, what period it covers, and what claim the similarity is meant to support. A cosine score is geometry inside a representation, not a causal or moral judgment.

The evidence boundary matters here. A title does not authorize attributing particular studies, numbers, or ethical claims to the live lecture. Knowing that a topic occurred is not knowing how Jurafsky argued it.

## What PA4 should test

[PA4](https://github.com/cs124/pa4-embeddings) works with embeddings in a notebook environment. An independent extension should include three probes: expected synonym neighbors, polysemous words that may collapse senses, and human inspection of person or occupation neighborhoods.

Do not report only attractive analogies. Record failures, then vary corpus, context window, or representation. As a concrete finish line, choose ten words, create a cosine-similarity matrix, and explain whether each high-similarity pair reflects semantics, syntax, or source-data effects.

## Building the term-context matrix

[Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf) assigns target words to rows and context words to columns. Context may be a fixed window, sentence, or syntactic relation. Small windows often emphasize local or syntactic behavior; large windows more often capture topic. Larger is not automatically better.

PMI compares `P(w,c)` with `P(w)P(c)`, and PPMI clips negative values to zero. Rare pairs can receive extreme PMI because their denominator is tiny, so counts, smoothing, and thresholds must accompany interpretation. Show word, context, and joint counts beside a similarity result.

Cosine removes vector length and emphasizes direction, but is undefined for zero vectors and unstable with scarce evidence. Nearest-neighbor tables should include frequency rather than presenting similarity alone.

## Prediction-based embeddings

Skip-gram predicts nearby contexts from a target; CBOW predicts a target from contexts. Negative sampling approximates the large-vocabulary objective. Its sampling distribution changes which contrasts training rewards. The objective defines learned relationships rather than neutrally storing language.

An embedding row becomes useful when it supports shared prediction behavior. The same mechanism learns unintended corpus associations whenever they improve prediction.

## Analogies are probes, not understanding

Vector offsets can expose regularities, but results depend on corpus, vocabulary, metric, and candidate exclusions. Evaluate relation categories, report out-of-vocabulary coverage, and retain failures. Intrinsic analogy or similarity scores do not guarantee downstream classification or retrieval improvement.

## Static and contextual representations

Static lookup gives `bank` one vector. Contextual layers transform the token using its sentence, allowing river and finance uses to diverge. A contextual “embedding” therefore requires model, revision, layer, pooling, tokenizer, and input sentence. Averaging layers is itself a design choice.

The [PA4 repository](https://github.com/cs124/pa4-embeddings) uses PyTorch and Transformers dependencies to connect static exercises to pretrained contextual models. Record revisions so future runs remain interpretable.

## Responsible tests despite the Social NLP source gap

This remains an author extension from readable [Chapter 5](https://web.stanford.edu/~jurafsky/slp3/5.pdf), not a claim about the inaccessible live lecture.

The inaccessible live lecture cannot be reconstructed, but Chapter 5 supports one bounded principle: embeddings learn corpus distributions. Record source, period, language, sampling, and preprocessing before social interpretation.

A bias probe must define its metric and word lists. Cosine differences over selected targets and attributes are not a complete measure of social bias. Test sensitivity to alternative lists, seeds, and corpus slices. A fragile result is a probe finding, not a model essence.

Association does not reveal individual authors' beliefs and should not classify people. Representation audit identifies patterns that a downstream system might amplify; harm must then be evaluated in the actual task.

## A PA4 evidence package

Preserve a small count/PPMI matrix, static nearest neighbors, contextual sentence comparisons, and failure or bias probes. Attach corpus or model revision, vocabulary, and similarity definition. Add frequency-matched comparisons so representation quality is not confused with evidence volume.

Finally compare bag-of-words, static embeddings, and contextual features in one downstream classifier with the same split and retained error cases. This connects Weeks 2–5 without inventing live Social NLP content.

## Further study

Week 6 connects representation learning to neural networks, and Week 7 makes token states context-sensitive. Embedding quality remains relative to data, objective, and downstream criteria.

## References

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [SLP3 Chapter 5: Embeddings](https://web.stanford.edu/~jurafsky/slp3/5.pdf)
- [CS124 PA4 Embeddings](https://github.com/cs124/pa4-embeddings)
- [Speech and Language Processing, 3rd edition index](https://web.stanford.edu/~jurafsky/slp3/)
- [Complete Stanford CS124 course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en)
