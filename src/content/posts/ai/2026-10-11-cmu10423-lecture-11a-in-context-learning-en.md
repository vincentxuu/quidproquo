---
title: "In-Context Learning: How Examples Change Predictions | CMU 10-423 Lecture 11"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 14
draft: false
description: "A complete worked example and answered variations for In-Context Learning: How Examples Change Predictions."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-11a-in-context-learning)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## Same weights, different conditions

In-context learning (ICL) places task instructions and examples in the inference context. Unlike [LoRA](/posts/ai/2026-10-11-cmu10423-peft-en), ordinary ICL performs no optimizer step. The weights stay fixed, while p(y|prompt) changes because the prompt changes. Building on [decoding](/posts/ai/2026-10-11-cmu10423-lecture-03-training-decoding-en), this guide teaches controlled comparisons that distinguish example effects, formatting, and leakage. Its course material includes the zero/few-shot section at the end of Lecture 9 and ICL in Lecture 11.

The [GPT-3 paper](https://arxiv.org/abs/2005.14165) uses zero-shot, one-shot, and few-shot task settings. A shot is a completed task example, not a sentence in the prompt. A long instruction can still be zero-shot. Chain-of-thought is a separate dimension: whether an example includes reasoning, rather than just an input and answer.

## A controlled classification example

Our original task uses arbitrary labels: A means the reviewer liked the film, B means they disliked it. Hold the test sentence fixed: “The pacing is slow, but I like the character details.” The zero-shot prompt provides the label rule and test sentence. A few-shot prompt additionally includes “So boring I left → B” and “Slow, but the characters are moving → A.” The second example demonstrates that slow pacing need not imply a negative overall judgment.

Without running a model, we cannot claim it will answer A. We can say the few-shot prompt supplies a relevant judgment pattern. If its output changes from B to A, more controls are needed. Reverse example order while preserving everything else. Then preserve label counts but replace the examples with unrelated reviews. Record predictions, output-format compliance, and prompt token counts. These comparisons distinguish order, relevance, and cost.

## Useful examples can also mislead

Causal attention allows the test position to attend to preceding demonstrations. Pattern recognition, format continuation, and task associations learned during pretraining may contribute. Behavior that resembles learning does not prove the model internally executes a particular gradient algorithm. Examples also consume context and prefill computation on each request unless the serving system provides an applicable cache.

If every example ends in A, the model may learn an answer bias rather than the classification criterion. If a demonstration contains the exact test sentence and answer, that is leakage. Retrieval of similar solved tasks also requires a clear boundary between reference material and evaluation data; nearest-neighbor recall should not be presented as new reasoning ability.

## Reasoning examples do not guarantee correctness

A chain-of-thought demonstration might separate pacing from overall enjoyment. Yet fluent explanations can still rationalize a wrong guess. Evaluate against a predefined criterion and a counterexample: “The characters are subtle, but watching this was painful.” The overall judgment is negative, so B is appropriate. Answering A solely because of “subtle” reveals a failure to apply the intended rule.

## Check your understanding

Do ten different demonstration prompts with fixed weights constitute fine-tuning? No: there are no parameter updates. What should happen if the example labels contradict one another? No particular output is guaranteed; measure sensitivity and error rates and examine whether the model recognizes ambiguity. A comparison with SFT needs the same held-out evaluation data and separate accounting for training versus per-request inference costs. Continue to [SFT and RLHF](/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf-en) to see how the data changes when weights actually update.

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 11 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture11-ift-rlhf.pdf)
- [Primary paper](https://arxiv.org/abs/2005.14165)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
