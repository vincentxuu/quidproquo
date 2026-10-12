---
title: "DPO: Updating a Language Model Directly from Preference Pairs | CMU 10-423 Lecture 12"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, generative-ai]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 16
draft: false
description: "A complete worked example and answered variations for DPO: Updating a Language Model Directly from Preference Pairs."
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-lecture-12a-dpo)

**Video status: recordings require login or course authorization.** [Sources](#course-video-sources)

This guide follows [CMU 10-423](https://www.cs.cmu.edu/~mgormley/courses/10423/) Spring 2026 public slides. Worked examples are original teaching additions.

## Turn a two-stage pipeline into one loss

Start with [SFT and RLHF](/posts/ai/2026-10-11-cmu10423-lecture-11b-sft-rlhf-en): a preference pair is not a demonstration, and the reference is not updated alongside the policy. The [DPO paper](https://arxiv.org/html/2305.18290v3) rewrites reward using policy/reference probability ratios under a KL-regularized reward objective. We will calculate one loss and distinguish relative improvement from absolute response probability.

For fixed prompt x, let y_w be the preferred answer and y_l the other answer. The ideal policy for reward r is π*(y|x)=π_ref(y|x)exp(r(x,y)/β)/Z(x). Taking logs yields r=β log(π*/π_ref)+β log Z(x). This expression still contains the expensive normalizer Z; it is not a ready-to-run sampling algorithm for arbitrary reward models.

## Why the normalizer disappears

Bradley–Terry preferences depend on the reward difference for the same prompt. Substituting the expression cancels β log Z(x). Define s=β[(log πθ(y_w|x)−log π_ref(y_w|x))−(log πθ(y_l|x)−log π_ref(y_l|x))]. The single-pair loss is −log σ(s). This is a preference likelihood expressed through policy parameters, not a numerical reward label supplied by a person.

Keep the reference fixed. Each sequence log-probability sums response-token log-probabilities conditioned on that response's own prefix. Exclude prompt and padding tokens and handle EOS consistently. Replacing a sum with an average changes length behavior and is not the original objective.

## Calculate a pair

This is an original teaching example. Reference probabilities are 0.2 for the winner and 0.1 for the loser; policy probabilities are 0.3 and 0.1. With β=0.5, relative increases are 1.5 and one. Thus s=0.5 log(1.5)=0.2027, σ(s)≈0.5505, and loss≈0.5969, below the initial log 2≈0.6931. The 55% value is the preference model's pairwise win probability, not the winner's generation probability.

Now let reference probabilities be 0.4/0.1 and policy probabilities 0.3/0.15. The winner remains absolutely more probable, but its relative multiplier is 0.75 while the loser's is 1.5. Therefore s=0.5 log(0.5)=−0.3466 and loss≈0.8814. Relative to the reference, the policy has moved toward the loser. Comparing 0.3 with 0.15 alone misses this.

## What the gradient does and does not imply

The derivative with respect to s is σ(s)−1. A strongly negative margin gets a larger update; an already positive margin gets less weight. The gradient favors increasing the winner-to-loser log-probability ratio. Shared parameters and other examples interact, so this does not guarantee that every loser token's unconditional probability falls after each step.

The derivation depends on KL regularization, reference support, and the chosen preference model. Offline data covers limited responses and does not eliminate annotation bias or factual error. β is not a universally monotonic quality knob. Monitor loss, relative ratios, held-out preference performance, and degradation of original capabilities separately.

## Check your understanding

When policy equals reference, s=0 and loss=log 2 regardless of absolute probabilities. If both responses become twice as likely relative to reference, the multipliers cancel and loss stays unchanged. Pairing responses from different prompts breaks the cancellation argument, so retain a shared prompt within each record. Continue with the original testing example in [Assignment 3](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en).

## Course video sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, anonymous retrieval returned an unloaded folder and a sign-in prompt, without playable classroom content. This establishes an access limit, not the absence of recordings. This guide uses public slides and linked primary papers; examples are original teaching additions, not a transcript. [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22).

## References

- [CMU 10-423 Spring 2026 Lecture 12 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)
- [Primary paper](https://arxiv.org/abs/2305.18290)
- [Official schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html)
