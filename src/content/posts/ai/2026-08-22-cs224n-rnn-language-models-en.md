---
title: "CS224N Lecture 4: Language Models, RNNs, and Vanishing Gradients"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, language-model, rnn, nlp, stanford]
lang: en
series:
  name: "Stanford CS224N 導讀"
  order: 5
tldr: "Lecture 4 defines a language model as a next-word probability distribution, then uses an RNN to compress an arbitrarily long prefix. It also exposes recurrence's central cost: information and gradients travel one time step at a time."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 4: language models, RNNs, exploding and vanishing gradients, and machine translation."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-rnn-language-models)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 4 on January 15, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture04-rnnlm.pdf) has four agenda parts: language modeling, RNNs, exploding and vanishing gradients, and machine translation. It calls language modeling the course's most important concept because much of modern generative NLP still rests on next-token prediction.

## What a language model outputs

Given a prefix, a language model outputs a probability distribution over the next word. The probability chain rule multiplies these conditional probabilities to assign a probability to a whole text. Training minimizes the negative log probability of the observed next word; generation selects a token from the model distribution and feeds it back as input.

An n-gram model sees a fixed-length history. Its counts are interpretable, but data becomes sparse as context grows. Neural language models use shared parameters and continuous vectors so similar contexts can share statistical strength.

## How an RNN compresses the prefix

At each time step, an RNN combines the current token vector with the previous hidden state to produce a new hidden state. The same parameters are reused through time, so the network can process variable-length sequences. Each output distribution projects the hidden state into the vocabulary.

The intuition is attractive: the hidden state summarizes everything so far. It is also the bottleneck. All history is squeezed into a fixed-size vector, and the effect of token 1 on token 100 must pass through 99 state updates.

## Why gradients vanish or explode

The [early analysis of long-term dependency difficulty](https://ieeexplore.ieee.org/document/279181) and a [later analysis of RNN training](https://proceedings.mlr.press/v28/pascanu13.html) explain the mechanism: backpropagation through time treats the unrolled RNN as a deep network with shared weights, so gradients repeatedly multiply Jacobians. If the effective scale stays below one, distant signals decay exponentially; above one, they can explode.

Gradient clipping can limit an explosion but cannot recover a signal that vanished. LSTMs and GRUs create more direct gated state paths, yet retain sequential computation. They cannot parallelize positions in the way the later Transformer does.

## Machine translation magnifies the problem

Sequence-to-sequence translation uses an encoder to read a source sentence and a decoder to produce the target one word at a time. Compressing the whole source into the final encoder state particularly harms long sentences. The question “can each output step directly inspect different source positions?” leads into attention in the next lecture.

This is therefore more than obsolete architecture history. It establishes next-word prediction, shared sequence parameters, and long-range dependence. Transformers change the computational path without replacing the core language-model training interface.

## Chain rule and sequence probability

\[
P(x_1,\ldots,x_T)=\prod_{t=1}^{T}P(x_t\mid x_{<t}).
\]

The identity is exact; models differ in approximating each conditional. Log probabilities avoid underflow. Cross-entropy and perplexity require tokenizer-aware comparison. Teacher forcing uses gold prefixes in training, while generation encounters the model's own errors.

## Why n-grams remain useful baselines

N-grams estimate count ratios with smoothing and backoff. They are fast and inspectable but cannot share evidence across similar, nonidentical contexts. If a neural model cannot beat a simple n-gram under the same split, inspect the pipeline before adding capacity.

## RNN equations and shared parameters

\[
h_t=\tanh(W_hh_{t-1}+W_xx_t+b),\qquad
\hat y_t=\mathrm{softmax}(Uh_t+c).
\]

Weights are shared through time. Padding needs masks for both loss and state handling. Decoding remains separate from the probability model.

## Backpropagation through time

Unrolling produces repeated Jacobian products. Their effective scale causes vanishing or exploding gradients. Global-norm clipping limits explosion but cannot restore vanished signal. Truncated BPTT preserves forward state across chunks while deliberately cutting gradient history.

## LSTM and GRU paths

LSTM cell updates provide an additive path controlled by forget, input, and output gates. GRUs combine some gates with fewer parameters. Both improve credit assignment but retain sequential computation and do not guarantee unlimited memory.

## The seq2seq bottleneck and attention

A fixed final encoder state must compress an entire source. Attention lets each decoder step read all encoder states, shortening the path and exposing alignment. Training likelihood, decoding, and full-translation metrics remain separate components.

## A count-to-RNN experiment

Train a smoothed bigram and one-layer RNN with one tokenizer and split. Compare validation cross-entropy, latency, and next-token distributions for fixed prefixes. Create sentence pairs differing only in an early subject and test a later verb probability. Log unclipped gradient norms to observe explosion and distance-dependent decay.

## Three questions RNNs leave to later architectures

How long is the information path, can sequence positions train in parallel, and how is state capacity allocated? Transformers answer differently, but recurrent constant-size state can still suit streaming or constrained devices. Architecture depends on latency, memory, context, and task rather than age.

Hold tokenizer, data, scale, and decoding fixed; report quality with throughput, peak memory, and first-token latency.

## Material gap

Winter 2026 recordings are not public. This article covers all four agenda sections in the official deck but does not reconstruct spoken examples or classroom derivations, and it does not substitute public recordings from an older offering.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 4 Language Models and RNNs slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture04-rnnlm.pdf)
- [Learning Long-Term Dependencies with Gradient Descent is Difficult](https://ieeexplore.ieee.org/document/279181)
- [On the Difficulty of Training Recurrent Neural Networks](https://proceedings.mlr.press/v28/pascanu13.html)
