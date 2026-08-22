---
title: "CS224N Lecture 14: How Tokenization Creates Multilingual Cost Gaps"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, tokenization, multilingual-nlp, bpe, stanford]
lang: en
series:
  name: "Stanford CS224N 導讀"
  order: 15
tldr: "Lecture 14 moves from word, character/byte, and subword segmentation to BPE failures and cross-lingual fairness. A tokenizer determines sequence length, compute cost, and the units a model sees; it is not neutral preprocessing."
description: "A lecture-by-lecture reading of Julie Kallini's CS224N Winter 2026 Lecture 14: BPE, glitch tokens, cross-lingual transfer, and fairness."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-tokenization-multilinguality)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) confirms that lecture 14 was guest-taught by Julie Kallini on February 19, 2026. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture14-guest-julie-tokenization-multilinguality.pdf) has five agenda parts: word/character-byte/subword tokenization, BPE training, spelling and glitch-token cases, multilingual and cross-lingual transfer, fairness, and multilingual tokenizer challenges.

## Segmentation decides what the model sees

Word tokens are interpretable but struggle with unseen forms and morphology. Character or byte vocabularies are small and nearly eliminate OOVs, but produce longer sequences. Subwords sit between: frequent strings merge and rare forms decompose.

“Word” is itself unstable. Whitespace is not a universal boundary, and contractions, inflection, compounds, and named entities break one-rule segmentation.

## How BPE learns a vocabulary

The [BPE subword method](https://aclanthology.org/P16-1162/) begins with basic symbols, repeatedly finds the most frequent adjacent pair in its corpus, creates a merge, and replaces occurrences. The merge count determines vocabulary size. Frequency alone does not know morphemes or semantics, so segmentation may look morphological or arbitrary.

Real tokenizers also include pre-tokenization, normalization, special tokens, and byte fallback. “Uses BPE” is not reproducible without tokenizer files and versions.

## Spelling, glitch tokens, and failure points

A model handling spelling sees token sequences, not letters directly. Some strings split into rare or unstable pieces, making counting, reversal, and character operations difficult. A glitch token may own one tokenizer ID while having almost no reliable training context, producing anomalous behavior.

Not every failure belongs to the Transformer. Printing token IDs and segmentation often diagnoses a problem faster than changing the prompt.

## Fairness in multilingual tokenization

Multilingual models such as [XLM-R](https://arxiv.org/abs/1911.02116) use a shared tokenizer to enable parameter sharing and transfer, but high-resource languages more often receive frequent, longer tokens. A low-resource language may fragment into more units. Equivalent meaning then costs more tokens, leaves less effective context, and creates longer computation paths.

As [Do All Languages Cost the Same?](https://arxiv.org/abs/2305.13707) emphasizes, multilingual evaluation should compare fertility, unknown/byte fallback, tokens per sentence, and cost alongside task scores. Applying an English-centered tokenizer to every language is not a neutral baseline.

## “Word” is not cross-lingually stable

Whitespace, morphology, compounds, emoji, URLs, and code invalidate a universal word unit. Word vocabularies create UNKs; characters/bytes preserve coverage but lengthen sequences.

## Unicode, normalization, and pre-tokenization

Normalization and case folding can change distinctions. Pre-tokenization sets merge boundaries. Byte coverage remains universal but not equal-cost.

## A BPE training walkthrough

Count adjacent symbols, merge the top pair, and preserve merge ranks for inference. Corpus, ties, vocabulary budget, and special tokens are reproducibility inputs.

## WordPiece, Unigram, and BPE

They optimize/select vocabularies differently. SentencePiece is a framework that can use BPE or unigram; publish artifacts, not only family names.

## Spelling and character tasks

Group accuracy by single-token, subword, and byte segmentation. Tool-assisted character work is a separate capability.

## Glitch tokens

Audit round trips, corpus frequency, contextual behavior, and embeddings. Mitigation can break checkpoint compatibility and needs an explicit risk decision.

## Multilingual data distribution

Web data is unequal. Sampling, language ID, deduplication, normalization, quality, and code-switch policy shape transfer and interference.

## Measuring cross-lingual transfer

Separate zero-shot, translated, and multilingual training. Use native-created and dialect/code-switch slices, plus native expert evaluation.

## Fertility and cost fairness

On parallel content, report tokens per unit, price, context truncation, latency, and tokenizer version. Equal meaning can carry unequal operational cost.

## Vocabulary allocation

High-resource languages occupy more shared entries. Language adapters, byte models, and tokenizer mixtures trade transfer, storage, quality, and worst-group fairness.

## A tokenizer evaluation suite

Combine fertility/coverage/round-trip, morphology/entities/tasks, latency/memory/price, and Unicode/special-token safety regressions.

## An executable BPE exercise

Hand-run ten merges, train balanced and imbalanced multilingual tokenizers, then compare a fixed-size model on loss, compute, and rare-word behavior.

## Material gap

Winter 2026 recordings are not public. This article covers all five agenda sections in Julie Kallini's deck; live language examples and discussion are not reconstructed.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 14 Tokenization and Multilinguality slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture14-guest-julie-tokenization-multilinguality.pdf)
- [Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/)
- [Unsupervised Cross-lingual Representation Learning at Scale](https://arxiv.org/abs/1911.02116)
- [Do All Languages Cost the Same?](https://arxiv.org/abs/2305.13707)
