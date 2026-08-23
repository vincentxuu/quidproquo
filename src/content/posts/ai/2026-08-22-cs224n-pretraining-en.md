---
title: "CS224N Lecture 7: Pretraining, Subwords, and In-Context Learning"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, pretraining, language-model, tokenization, stanford]
lang: en
series:
  name: "Stanford CS224N 導讀"
  order: 8
tldr: "Lecture 7 decomposes pretraining into scalable data, subword tokenization, three model objectives, and in-context learning. A general self-supervised objective yields reusable representations; downstream signals specify their use."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 7: BPE, decoder/encoder/encoder-decoder pretraining, and large models."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-pretraining)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 7 on January 27, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture07-pretraining.pdf), **Pretraining (Scaling, Systems, Data)**, has six agenda parts: motivation, subwords, the move from word embeddings to model pretraining, three architectures, what pretraining teaches, and large models with in-context learning.

## Why pretraining scales

Supervised tasks depend on human labels, limiting both volume and task coverage. Pretraining creates prediction targets from text itself, allowing a model to use large, diverse, unlabelled corpora. Smaller labelled sets, instructions, or prompts can then specify downstream use.

This is not free knowledge. What the model learns depends on the corpus, tokenizer, objective, parameter count, and compute budget. More data means more training signal; it does not guarantee balanced sources, correct content, or reliable downstream behavior.

## Subwords repair the fixed-vocabulary break

A whole-word vocabulary maps unseen words to UNK. The [byte-pair encoding subword method](https://aclanthology.org/P16-1162/) begins with characters and repeatedly merges the most frequent adjacent units until reaching a target vocabulary size. Common words may remain whole while rare and novel words decompose into known subwords.

The method trades vocabulary size against sequence length. A small vocabulary produces longer sequences; a large one leaves rare tokens undertrained. The segmentation is not linguistic analysis, and words can split into unintuitive pieces.

## Three pretraining forms

A decoder uses a left-to-right language-model objective and naturally supports generation. An encoder, as exemplified by [BERT](https://arxiv.org/abs/1810.04805), recovers masked tokens from bidirectional context and is suited to representation learning. An encoder–decoder conditionally generates a target from a source, using span corruption or text-to-text formulations.

These forms differ not merely in size but in visible information and training interface. Choose according to whether the downstream task needs open generation, bidirectional representation, or an explicit input-to-output transformation.

## Knowledge, capability, or pattern continuation?

The deck gives “what is pretraining teaching?” its own interlude. Behavioral evidence may show factual recall, syntax, or new-task performance, but one output cannot identify an internal representation. In-context learning adds another layer: parameters remain fixed while instructions or examples in the prompt change behavior for the current context.

Evaluation should separate what pretraining already supplied, what fine-tuning added, and what a prompt temporarily elicited. One benchmark score cannot locate the source of capability.

## From static embeddings to contextual models

Pretraining transfers an entire composition function rather than one word table. Token states vary by context; layer, pooling, subword alignment, and fine-tuning must be specified when comparing representations.

## BPE walkthrough and vocabulary trade-offs

BPE repeatedly merges the most frequent adjacent symbols and freezes the learned merge order. Large vocabularies shorten sequences but undertrain rare rows; small vocabularies lengthen attention. Tokenizer and checkpoint must stay paired.

## Decoder pretraining

Causal next-token prediction gives dense loss and a generation-native interface. It sees only left context, and likelihood alone does not supply factuality or instruction following.

## Encoder pretraining

Masked language modeling restores tokens from bidirectional context. Masking policy affects learning and creates pretrain–finetune mismatch. Encoders suit representation tasks but are not naturally autoregressive generators.

## Encoder–decoder pretraining

Corrupted sources are encoded bidirectionally and reconstructed by a decoder. Span corruption and text-to-text formulations unify conditional tasks while retaining source/target roles.

## Scale data, model, and compute together

The [Llama 3 technical report](https://arxiv.org/abs/2407.21783) provides a concrete large-scale pretraining case. Compute-aware scaling balances parameters and tokens. Preserve source mixture, deduplication, and filters; total token count alone cannot describe data.

## What pretraining teaches and what probes show

A probe shows information is decodable, not necessarily used. Interventions provide stronger evidence but can have broad side effects. Memorization and generalization require deduplication, temporal splits, and near-neighbor checks.

## Design an in-context learning experiment

Hold the checkpoint fixed and vary instructions, demonstrations, order, label mapping, and format. Report variation across orders, not one prompt. More examples can add cost and interference rather than monotonically improving performance.

Add a length-matched no-demonstration control and preserve every prompt and raw output so label-mapping and formatting errors remain inspectable.

## Material gap and numbering note

Winter 2026 recordings are not public. The deck cover retains a stale “Lecture 6: Pretraining” label, while the official schedule, date, filename, and sequence establish it as regular lecture 7. This article follows the schedule and does not speculate about the stale label.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 7 Pretraining slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture07-pretraining.pdf)
- [Neural Machine Translation of Rare Words with Subword Units](https://aclanthology.org/P16-1162/)
- [BERT](https://arxiv.org/abs/1810.04805)
- [The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783)
