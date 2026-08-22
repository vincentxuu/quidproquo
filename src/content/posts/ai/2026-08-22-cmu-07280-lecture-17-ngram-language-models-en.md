---
title: "CMU 07-280 Lecture 17: From Tokenization to N-gram Language Models"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cmu, ai-course, natural-language-processing, language-model, n-gram]
lang: en
tldr: "Lecture 17 first decides how text becomes tokens, then uses N-grams to turn sequence probability into conditional probabilities estimated from corpus counts. Tokenization is the first design decision about what a model can see."
description: "A detailed reading of CMU 07-280 Spring 2026 Lecture 17: corpora, character/word/BPE tokenization, N-grams, and the probability problem behind language modeling."
draft: false
series:
  name: "Reading CMU 07-280"
  order: 17
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-lecture-17-ngram-language-models)

This is a lecture-by-lecture reading of **CMU 07-280, Spring 2026, Lecture 17**. The official slide deck is titled *Natural Language Processing (NLP): N-gram Language Models*. It moves from corpora and tokenization to N-grams and language models. Before asking how to build a modern LLM, it asks a more basic question: what must text become before a probabilistic model can process it?

## Official materials and reading scope

This article fully reads the [official Lecture 17 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec17_NLP.pdf) and uses the course site and syllabus to verify the offering. The official site does not provide a public Spring 2026 lecture recording, so this is a reading of published materials, not a reconstruction of spoken explanations, classroom questions, or live demos.

The slides proceed through NLP task examples, vocabulary, tokenization, BPE, language-model applications, and an N-gram worksheet. This article follows that same conceptual spine.

## The inherited problem: neural networks consume numbers, not language

Earlier lectures established neural networks, CNNs, and optimization. Moving those tools to text first requires choosing an input unit. A sentence can be divided into characters, words, punctuation, or subwords. That choice changes vocabulary size, sequence length, and the out-of-vocabulary problem.

The lecture separates four terms. A **corpus** is the text collection used for learning. A **tokenizer** converts text into tokens. A **vocabulary** lists the tokens the model can represent. **Context** is the preceding material available when predicting the current position. Those terms later become distinct parts of the data pipeline, encoding, parameter dimensions, and conditional probability.

## Full conceptual path: three token granularities

Using a small *I am Sam* corpus, the slides contrast three designs:

- Character tokens make unknown tokens rare and keep the vocabulary small, but produce long sequences.
- Word tokens give each step a larger semantic unit, but create a large vocabulary and many spelling variants.
- Byte pair encoding (BPE) begins with characters and repeatedly merges the most frequent adjacent pair, producing subwords between characters and words.

BPE matters as a repeatable procedure, not merely as a dictionary of common words: initialize a character vocabulary, tokenize the corpus, count adjacent pairs, add the most frequent merged token, and repeat. The model's token budget is allocated according to corpus frequency. Frequent fragments require fewer steps, while rare words can still fall back to smaller units.

Only after encoding can a language model receive a mathematical objective: assign a joint probability to a token sequence, or predict the next token conditioned on context. The slides use speech recognition to show two sources of evidence. An acoustic model asks which word matches the sound; a language model asks which word is plausible after *artificial*.

## Reproducible example: run two BPE merges by hand

Take the corpus `low low lower` and split every word into characters with an end marker:

```text
l o w </w>
l o w </w>
l o w e r </w>
```

In the first round, both `l o` and `o w` occur three times. If the tie-break chooses `l o`, add the token `lo`:

```text
lo w </w>
lo w </w>
lo w e r </w>
```

The pair `lo w` now occurs three times, so the second merge creates `low`. The word `low` takes one token, while `lower` becomes `low e r`. The example shows both the benefit and the boundary of BPE: it learns frequent string fragments, not guaranteed linguistic morphemes or semantic units.

Now make the smallest bigram count. Suppose the corpus contains `<s> I am Sam </s>` and `<s> I am here </s>`. Then

\[
P(am\mid I)=\frac{C(I,am)}{C(I)}=\frac{2}{2}=1,
\qquad
P(Sam\mid am)=\frac{1}{2}.
\]

The defining N-gram approximation is already visible: instead of preserving an arbitrarily long history, prediction uses counts from the most recent tokens.

## Recitation and homework connection

Lecture 17 introduces the concepts and begins the worksheet; Lecture 18 completes the N-gram calculations. Later, [Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf) replaces the one-token context table with an embedding language model. [Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf) advances to building GPT-2 and inspecting training loss, perplexity, and generation.

That does not mean Lecture 17 already teaches all of GPT-2. It defines the lowest-level data interface for the assignment: the model receives token indices, not raw strings. The formal notebook, autograder, and staff feedback are not equivalent to anonymous access, so a self-learner can reproduce the concepts without reproducing the full course service.

## Extension: N-grams versus modern LLMs

Both N-grams and autoregressive transformers factor sequence probability into token-by-token conditional probabilities. They differ in how the condition is represented. An N-gram counts a fixed-length discrete prefix; a transformer uses learned vectors and attention to summarize a longer context.

N-grams are therefore not merely obsolete language models. They make the chain rule, context, sampling, and sparsity visible in a small table. Attention changes the parameterization, but those underlying questions remain.

## An action for tonight

Take a 100–300 word passage and tokenize it three ways: characters, whitespace-delimited words, and two manual BPE rounds. Record vocabulary size and sequence length for each. Then build bigram counts and generate ten tokens. When a context has never appeared, label it as a zero count instead of inventing a fallback; that failure is the starting point for Lecture 18.

## References

- [CMU 07-280 Spring 2026 Lecture 17 slides](https://www.cs.cmu.edu/~07280/lectures/07280_S26_Lec17_NLP.pdf)
- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [CMU 07-280 Recitation 10](https://www.cs.cmu.edu/~07280/recitations/07280_S26_Rec10.pdf)
- [CMU 07-280 Homework 11](https://www.cs.cmu.edu/~07280/assignments/hw11_blank.pdf)
