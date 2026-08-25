---
title: "CS124 Week 6 Neural Networks and LLMs: From Units and Backpropagation to Decoder-Only Models"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, neural-network, llm, nlp]
lang: en
series: { name: "Reading Stanford CS124", order: 7 }
tldr: "Week 6 uses public neural-network slides for weighted sums, nonlinearities, loss, and backpropagation, then a public LLM/Transformer deck labeled 2025 for decoder-only architecture without treating it as the 2026 live transcript."
description: "Stanford CS124 Winter 2026 Week 6: neural units, multilayer networks, backpropagation, neural language models, LLM architectures, and PA5."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week6-neural-networks-llms)

Week 6 connects the first half's linear models and embeddings. The official agenda pairs Neural Networks material and PA5 with Dan Jurafsky's live “LLMs and Transformers!” lecture.

**Version:** Winter 2026. **Unit:** Week 6, February 10 and 12. **Public materials:** the [schedule](https://web.stanford.edu/class/cs124/lec/), [Neural Networks slides](https://www.stanford.edu/class/cs124/lec/7_NN.pdf), [LLM/Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf), [SLP3 Chapter 6](https://web.stanford.edu/~jurafsky/slp3/6.pdf), and [PA5](https://github.com/cs124/pa5-neural-networks). **Gap:** the required live lecture was not recorded, and the public deck retains a 2025 filename. It cannot prove the exact 2026 narration.

## A neural unit still begins with a linear score

The public [Neural Networks slides](https://www.stanford.edu/class/cs124/lec/7_NN.pdf) and assigned [Chapter 6](https://web.stanford.edu/~jurafsky/slp3/6.pdf) define a unit as computing `z = w·x + b` and applying a nonlinear activation. Without nonlinearity, stacked linear transformations collapse into one linear transformation. ReLU or sigmoid enables nonlinear decision surfaces.

This extends Week 3 rather than replacing it. Logistic regression already introduced weighted sums, bias, sigmoid, and loss. A neural network inserts hidden units so that representations can change during training.

## Forward, loss, and backprop form one loop

The forward pass computes layer activations and output logits or probabilities. Loss measures disagreement with targets. Backpropagation applies the chain rule from output toward earlier parameters; an optimizer updates the weights.

Tensor shapes and gradient paths matter as much as formulas. Hand-compute a two-layer forward pass and use a small numerical perturbation to check one gradient. When loss does not fall, inspect data, shapes, activations, and learning rate before concluding that the model is too small.

## Neural language models share the old objective

An n-gram model predicts the next token from a finite discrete history. A neural language model embeds tokens, combines context into a continuous hidden representation, and maps it to a vocabulary distribution. Both use the probability chain rule and next-token prediction. Neural representations allow similar contexts to share statistical strength, but do not remove context and compute limits.

## Three architecture families

The public LLM deck distinguishes decoders, encoders, and encoder-decoders. Decoder-only causal models support autoregressive generation; encoders build bidirectional representations; encoder-decoders map an input sequence to an output sequence. The slides note that everyday “LLM” usage commonly means decoder-only models, without erasing the other families.

This architecture distinction outlasts product names because it determines pretraining objective, visible context, and output behavior.

## The PA5 finish line

[PA5](https://github.com/cs124/pa5-neural-networks) keeps the notebook workflow. A useful completion test is to state each layer's shape, record loss over several updates on one batch, and explain why removing nonlinear activations collapses the model to a linear map.

Week 6 does not yet require a complete Transformer; PA6a does that next. Units, layers, losses, and gradients must become traceable first, or attention will merely add more matrices that cannot be debugged.

## From units to batch matrices

For batch size `m`, input dimension `d`, and hidden width `h`, write `X: m×d`, `W: d×h`, `b: h`, and `H: m×h` before implementation. Bias broadcasts across examples; it is not a separate parameter per row. A shape table catches semantic transpose mistakes before the loss.

Width and depth increase capacity and compute, not guaranteed quality. The small public slide networks exist to expose operations rather than prove that deeper is always better.

## Activation, initialization, and gradient flow

Sigmoid saturates at extreme inputs and produces small derivatives. ReLU retains a simple positive-region gradient but can leave units inactive in the negative region. Initialization must break symmetry; identical hidden-unit weights receive identical gradients. Excessive scale can saturate or explode activations.

Record activation means, standard deviations, zero fractions, and gradient norms. These observations come directly from the forward/backprop agenda and diagnose a stalled loss better than final accuracy alone.

## Backprop through a computational graph

In a two-layer classifier, loss gradients reach output weights, pass through the activation derivative, and then reach the first layer. Every parameter gradient must match its parameter shape. Products of derivatives explain vanishing and exploding gradients.

Check one parameter with centered finite differences. A mismatch points toward averaging, derivatives, transposes, or bias broadcasting.

## Optimization and generalization are different

A training loop shuffles batches, clears gradients, runs forward/loss/backward/update, and evaluates separately. Training loss proves fit to observed data; validation loss evaluates generalization. Falling training loss with rising validation loss signals overfitting. Both losses high may instead indicate capacity, features, optimization, or label problems.

Use a tiny-batch overfit test: implementation should drive loss very low on a few examples. Failure there suggests code before regularization.

## Aligning neural-language-model inputs and targets

Token IDs become embeddings, contexts predict the next token, and targets are shifted by one position. Output dimension equals vocabulary size. Cross-entropy normally consumes logits and integer IDs directly; padding positions should not contribute to loss.

Compare n-gram and neural models only with fixed tokenizer, split, and evaluation tokens. The public LLM deck deliberately preserves their common next-token probability and repeated-sampling structure while contrasting counts with learned representations.

## What the public architecture table supports

The deck groups decoder, encoder, and encoder-decoder families. Decoder-only models predict left-to-right; masked encoders build bidirectional representations; encoder-decoders condition generation on an encoded input. This supports architecture classification, not identical training claims for every listed product.

## A PA5 evidence package

Repository workflow and notebook behavior follow public [PA5](https://github.com/cs124/pa5-neural-networks).

Preserve shapes, seed, training and validation curves, gradient norms, one finite-difference check, and three errors. Change hidden width, activation, or learning rate one at a time. This evidence makes Week 7 attention debugging possible.

## Further study

The public deck confirms the architecture agenda but not the 2026 room's examples or discussion. Further expansion must stay tied to the pinned textbook and PA5 exercise evidence.

## References

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [Neural Networks slides](https://www.stanford.edu/class/cs124/lec/7_NN.pdf)
- [LLM and Transformer slides](https://www.stanford.edu/class/cs124/lec/LLM_cs124_week7_2025.pdf)
- [SLP3 Chapter 6](https://web.stanford.edu/~jurafsky/slp3/6.pdf)
- [CS124 PA5](https://github.com/cs124/pa5-neural-networks)
