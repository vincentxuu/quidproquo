---
title: "CS124 Week 7 Transformers and Speech Processing: Causal Attention, Generation, and an Unrecorded Lecture"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, transformer, speech-processing, llm]
lang: en
series: { name: "Reading Stanford CS124", order: 8 }
tldr: "Week 7's public path is PA6a: implement causal self-attention, train a small Shakespeare Transformer, sample text, and compute perplexity; the live speech lecture remains an explicit source gap."
description: "Stanford CS124 Winter 2026 Week 7: Transformers, causal self-attention, sampling, perplexity, PA6a, and the evidence boundary around the unrecorded speech lecture."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week7-transformers-speech)

Week 7 carries forward the Week 6 LLM/Transformer lecture and adds a live Speech Processing lecture. Their public evidence differs: Transformers have slides, assigned reading, and PA6a; the speech lecture was unrecorded and has no public deck.

**Version:** Winter 2026. **Unit:** Week 7, February 17 and 19. **Public materials:** the [schedule](https://web.stanford.edu/class/cs124/lec/), [LLM/Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf), and [PA6a](https://github.com/cs124/pa6a-transformers). The syllabus assigns SLP3 August 2025 Chapter 7 pp.1–11 and 17 plus Chapter 8. **Gap:** current Chapter 7/8 PDFs have been renumbered; the live speech lecture was not recorded.

## Self-attention combines visible history

Transformer token states are projected into queries, keys, and values. Query-key similarity produces attention weights, which combine values. Each token can select context based on the input instead of compressing all history into one recurrent state.

A decoder-only model needs a causal mask so position `i` cannot see future tokens. Without it, training leaks answers. Multi-head attention repeats the operation with different projections, followed by an output projection, feed-forward layer, residual connections, and normalization.

## PA6a leaves the notebook

[PA6a](https://github.com/cs124/pa6a-transformers) is the course's first assignment outside Jupyter. Students implement `CausalSelfAttention.forward` in `model.py`, run `test_attention.py`, and train a small model on GPT-2-BPE-tokenized Shakespeare.

The [PA6a README](https://github.com/cs124/pa6a-transformers) reports 2,000 default CPU iterations, roughly fifteen minutes on the author's M1 MacBook Pro, and loss below 4.0. That is a repository-specific observation, not a hardware-independent guarantee.

After training, `sample.py` exposes temperature. Temperature changes the sampling distribution, not model weights: lower values concentrate probability, while higher values increase diversity and risk.

## Perplexity has a bounded meaning

[PA6a](https://github.com/cs124/pa6a-transformers) implements perplexity, the exponentiated average negative log probability. Lower perplexity means the model assigns higher probability to reference tokens. Comparisons require the same tokenizer and dataset because segmentation changes the prediction space.

The assignment then asks students to examine why perplexity and burstiness fail as AI-authorship detectors. A valid language-model metric becomes an unreliable identity claim when predictable prose is treated as non-human. The ethics questions explicitly consider standardized writing and uneven impact.

## The speech evidence boundary

The [schedule](https://web.stanford.edu/class/cs124/lec/) shows that Jurafsky gave a live Speech Processing lecture on February 17, that it was quiz material, and that live lectures were not recorded. Without a deck, it would be unsupported to attribute phonetics, CTC, Whisper, or any particular error rate to that meeting. Week 8's readings and PA6b belong to the next official unit and should not be used to invent narration here.

## A concrete finish line

After `test_attention.py` passes, draw a four-token causal mask and label every visible position. Generate low- and high-temperature samples from one checkpoint, record validation loss and perplexity, then state separately what perplexity supports as a model comparison and what it cannot support as an authorship judgment.

## Computing scaled dot-product attention

Project token states into `Q=XW_Q`, `K=XW_K`, and `V=XW_V`. `QKᵀ` produces a sequence-by-sequence score matrix. Divide by `sqrt(d_k)`, add negative infinity at future positions, apply row-wise softmax, and multiply by `V`.

A tiny manual example catches a missing transpose, reversed causal mask, or softmax over the wrong dimension. Each probability row should sum to one and future entries should be zero.

## Heads and Transformer blocks

Multi-head attention reshapes batch, head, sequence, and head dimension, runs attention per head, concatenates, and projects. Incorrect reshaping can mix heads and tokens while preserving plausible dimensions.

The block adds a position-wise feed-forward network, residual paths, normalization, and positional information. PA6a asks students to implement only `CausalSelfAttention.forward`, but reading the scaffold shows where embeddings, blocks, and the language-model head connect.

## What the unit test proves

`test_attention.py` covers synthetic values and masks, not whole-model training. Add an integration check: changing a future token must not alter earlier logits. Backpropagate a tiny loss and confirm finite gradients for query, key, and value projections. Public tests passing is not the same claim as hidden Gradescope completion.

## Training artifacts

The [PA6a repository](https://github.com/cs124/pa6a-transformers) supplies GPT-2-BPE-tokenized Shakespeare. Record split, context length, batch, layers, heads, dimensions, learning rate, and seed. Log train and validation loss with elapsed time. The README's 2,000 iterations and M1 timing are a local reference, not a universal benchmark.

Bind checkpoints to configuration and tokenizer identity. Preserve checkpoint, sampling settings, generated JSON, and perplexity JSON as one evidence chain.

## Sampling beyond one attractive example

Generation repeatedly samples from last-position logits and appends a token. Temperature changes sharpness. Any top-k or top-p extension should be labeled self-study, not official requirement. Fix checkpoint, prompt, length, and seed for comparison, and record repetition, unfinished strings, rare-token errors, and coherence failures.

## Auditing perplexity

Compute token cross-entropies, average over valid targets, then exponentiate. Do not average token-level exponentials. Exclude padding. With a uniform `V`-word distribution, perplexity should equal `V`, providing a hand-computable test.

Lower perplexity supports higher probability on the same evaluation stream. It does not directly measure factuality, safety, helpfulness, diversity, or authorship.

## Connecting ethics to generated outputs

[PA6a](https://github.com/cs124/pa6a-transformers) asks students to examine their own samples. Compare predictable structured prose with irregular prose and explain why predictability is not machine identity. The prompts specifically connect standardized rubrics to detector suspicion and ask for alternatives such as process evidence, oral explanation, or version history. These are repository prompts and student analysis, not claims about the unrecorded lecture.

## References

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [LLM and Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf)
- [CS124 PA6a Transformers](https://github.com/cs124/pa6a-transformers)
- [Speech and Language Processing, 3rd edition index](https://web.stanford.edu/~jurafsky/slp3/)
- [Complete Stanford CS124 course overview](/posts/ai/2026-08-21-stanford-cs124-languages-to-information-en)
