---
title: "Train-Time Improvement: Turning Feedback into Learning | Stanford CS329A Lecture 6"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, reasoning, evaluation]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 6
description: "Use STaR, GRPO, and DAPO to understand self-generated training data, group-relative rewards, and useful learning signals."
tldr: "Useful training feedback must distinguish candidates; filtering, relative advantages, and sampling determine the learning signal."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-stanford-cs329a-lecture-06-train-time-rl)

**Video status: Videos included.** Lecture text is available; caption type, listening checks, and the shadowing player still require verification.

Does getting an answer right make a model more likely to succeed next time? Repeated attempts alone do not update its parameters. [Stanford CS329A](https://cs329a.stanford.edu/), Autumn 2025 Lecture 6, moves the improvement loop into training: turn generated candidates and verifiable outcomes into learning signals.

This guide uses the official lecture’s text transcript and the method sections of the official readings, [STaR](https://arxiv.org/html/2203.14465), [DeepSeekMath](https://arxiv.org/html/2402.03300), and [DAPO](https://arxiv.org/html/2503.14476). It is a teaching reconstruction, not a lecture transcript. You should know that a language model predicts tokens from preceding context; no RL implementation experience is required. The goal is to recognize whether a candidate batch contains useful feedback.

For prerequisite context, first read [candidate generation](/posts/ai/2026-10-11-stanford-cs329a-lecture-02-test-time-compute-en) and [verification](/posts/ai/2026-10-11-stanford-cs329a-lecture-03-robust-verification-en).

## Keep successful paths as training data

STaR generates rationales, checks final answers, and fine-tunes on rationales that reach correct answers. For failed questions, it can supply the known answer and ask for another rationale. The answer hint is removed from the training input. The updated model generates the next dataset.

The questions and correct answers must already be available. Generating rationales does not create trustworthy labels. A correct result can also accompany a faulty explanation, so inspect whether the explanation actually supports the answer.

## Compare candidates within a group

DeepSeekMath introduces GRPO: sample several responses to the same question and estimate relative advantages from their rewards, avoiding a separate critic. With outcome supervision, the simplified calculation subtracts the group mean and divides by its standard deviation. Positive advantages encourage responses; negative ones discourage them. The actual update also includes probability ratios, clipping, and a reference-model constraint. An advantage is not a new response probability.

STaR imitates accepted demonstrations. This RL approach adjusts generation preferences from comparisons. Both depend on feedback quality, but their update mechanisms differ.

## Worked example: four answers to a discount problem

This is an original teaching example. Input: “A book costs 120 dollars before a 20% discount. What do three books cost?” The answer is 120 × 0.8 × 3 = 288. Four candidates produce 288, 360, 288, and 96. A final-answer verifier assigns rewards 1, 0, 1, 0.

The mean is 0.5. Using population standard deviation for this hand calculation, every squared deviation is 0.25, so the standard deviation is 0.5. The advantages are 1, −1, 1, −1. Correct candidates receive relative encouragement. But a rationale saying “all three books are free, so the answer is 288” would also pass this verifier. RL reinforces rewarded behavior, which can fall short of our intended definition of correctness.

STaR would retain the two successful demonstrations, subject to checking their explanations. GRPO uses their relative rewards to update the policy. The same candidates support different training procedures.

## More sampling can still produce no signal

Suppose every response is 288. The mean reward is 1, with no variation. An entirely incorrect group has the same problem. Standard deviation is zero, so the formula cannot be applied directly. DAPO's dynamic sampling filters entirely correct or entirely incorrect groups and resamples to fill an informative training batch. This addresses the current group's lack of discriminating feedback; it does not mean permanently discarding every hard question.

DAPO also adjusts the upper clipping bound for exploration, aggregates policy loss at token level, and handles rewards for overlong responses. Sampling, weighting, and truncation decisions all affect what the model learns.

## Exercise and answer

Change the rewards to 1, 1, 1, 0. Their mean is 0.75 and population standard deviation is √0.1875, approximately 0.433. The first three advantages are approximately 0.577; the last is −1.732. Why do correct responses receive smaller positive advantages? They are less exceptional relative to their peers. The comparison baseline changed.

If every response is wrong, can we claim this group teaches the model to avoid all four mistakes? No. It provides no relative reward difference. A better starting model, a different difficulty curriculum, or a better feedback design may be needed.

## An action for today

Take ten questions with definite answers and generate four candidates each. Save inputs, answers, rationales, and rewards. Count all-correct, all-incorrect, and mixed groups. Manually inspect two correct-answer candidates with faulty rationales. Establish feedback quality before increasing training compute.

## English practice: audio shadowing pending

This article provides a paper-based reading guide. Lecture captions, three continuous audio segments, and listening checks remain unverified, so audio shadowing is pending. The English article is a translation of the guide, not the lecturer's transcript. Explaining the group mean in your own English is an original expression exercise, not source-audio shadowing.

## Lecture video source

[Stanford Online — Part 6](https://www.youtube.com/watch?v=yVnmHSAy3ck)

```youtube
url: https://www.youtube.com/watch?v=yVnmHSAy3ck
title: Stanford CS329A — Lecture 6
captions: en
```

## References

- [Stanford CS329A — Autumn 2025 official schedule](https://cs329a.stanford.edu/)
- [STaR](https://arxiv.org/html/2203.14465)
- [DeepSeekMath](https://arxiv.org/html/2402.03300)
- [DAPO](https://arxiv.org/html/2503.14476)
- [Stanford Online — official lecture video](https://www.youtube.com/watch?v=yVnmHSAy3ck)
