---
title: "Training and Decoding: Why the Same Logits Produce Different Sequences | CMU 10-423 Lecture 3"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 4
tldr: "Learning a next-token distribution and choosing a token from that distribution are consecutive but distinct operations."
description: "A teaching guide based on public Spring 2026 materials: Training and Decoding: Why the Same Logits Produce Different Sequences | CMU 10-423 Lecture 3"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding)

**Video status: recordings require sign-in or course authorization.** This guide uses public slides and assignments; numerical examples are site-authored, not a lecture transcript.

Learning a next-token distribution and choosing a token from that distribution are consecutive but distinct operations. This guide compares greedy decoding, temperature, and top-p using the same logits, then explains why changing sampling rules is not retraining. Prerequisites are causal attention, softmax, and negative log likelihood.

## Training turns reference continuations into gradients

At every position, the model uses the reference prefix to predict the next reference token. Consider logits [ln 4,ln 2,0] for candidates A, B, and C. Their exponentials are [4,2,1], giving probabilities [4/7,2/7,1/7].

In this original example, if B is the target, cross-entropy is −ln(2/7)=1.2528. Its derivative with respect to the logits is p−one_hot(y), or [4/7,−5/7,1/7]. Gradient descent tends to raise B's logit and lower the others; parameter gradients continue through the computation that produced those logits.

The signal comes from reference data, not the token the model happened to sample. One occurrence of B does not establish that A is always invalid. Language permits multiple continuations; maximum likelihood learns frequencies and contextual relationships represented in the data.

## Greedy chooses the current maximum

Greedy decoding selects A from this distribution. It does not draw a random sample. However, the most likely token at each step need not produce the most likely whole sequence. Suppose the best second-step probability after A is 0.1, and after B it is 0.9. The two-step probabilities are 0.0571 and 0.2571 respectively; the path beginning with B is more likely.

Nor does finding a maximum-likelihood sequence automatically optimize usefulness. Conversation may benefit from diversity, while code requires verifiable correctness. Task quality is not captured by an isolated sequence probability.

## Temperature controls concentration

Temperature τ divides logits before softmax. At τ=1 we retain the original distribution. At τ=2 the unnormalized weights become [2,√2,1], giving approximately [0.4531,0.3204,0.2265]. At τ=0.5 they become [16,4,1], giving [0.7619,0.1905,0.0476].

Lower temperature amplifies the advantage of larger logits. It changes the sampling distribution, not the reliability of the model's knowledge. Every finite positive temperature preserves logit ordering. Direct division by τ=0 is undefined; implementations normally treat zero as a separate greedy case.

## Top-p retains probability mass, then renormalizes

Nucleus sampling sorts candidates and takes the smallest prefix whose cumulative probability reaches p. With the original distribution and p=0.8, A alone has probability 0.5714. A+B reach 0.8571, so these two remain. Renormalization gives [2/3,1/3,0].

At p=0.5, only A remains. At p=0.95, all three remain. The candidate count depends on the current distribution, unlike top-k, which retains a fixed number. The rule is not “keep every token whose individual probability exceeds 0.8”; that interpretation would leave an empty set here.

Combining temperature and top-p makes ordering consequential. Apply τ=2 first and the mass of A+B becomes approximately 0.7735. A top-p threshold of 0.8 now retains all three. Record the complete decoding procedure when comparing experiments, not just one temperature value.

## Separate pretraining, fine-tuning, and generation

Pretraining updates parameters using a broad dataset; fine-tuning continues parameter updates using another task or dataset. Decoding selects outputs using the distribution defined by the current parameters. Prompts, temperature, and stopping rules change generation, usually without an optimizer step. Increasing temperature does not repair missing training coverage or overfitting.

Track held-out loss, repeated generations for a fixed prompt, and task-specific success separately. Loss comparisons require compatible tokenizers, data, and reduction. Generation comparisons require controlled prompts and settings; random policies need multiple samples so that sampling luck is not mistaken for a better method.

## Variations with answers

If C becomes the reference target, loss is ln 7=1.9459 and the logit gradient is [4/7,2/7,−6/7]. Changing the label changes the learning signal. Whether a random draw happens to select C does not change this calculation.

The original distribution with top-p=0.8 retains A and B. After applying τ=2 first, the same threshold retains all three because A+B carry only about 0.7735 probability. Be able to identify both the retained set and its renormalized distribution. Lecture 4 then examines changes to the model itself: position representations and shared keys and values.

[Previous](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention-en) | [Next](/posts/ai/2026-09-30-cmu10423-modern-transformer-rope-gqa-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Course Video Sources

The official recording index is on SCS Panopto. The anonymous folder view is unloaded and requests sign-in; this is an access limitation, not evidence that recordings do not exist. Original audio and subtitles require the appropriate course access.

- [Official Panopto recording index](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [Official course homepage](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## References

- [Lecture 3 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture3-llms.pdf)
- [GPT-2 technical report](https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf)
- [The Curious Case of Neural Text Degeneration](https://arxiv.org/abs/1904.09751)
