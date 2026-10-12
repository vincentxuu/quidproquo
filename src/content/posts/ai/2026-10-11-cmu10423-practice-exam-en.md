---
title: "Practice Exam: Diagnose Conceptual Gaps | CMU 10-423 Topic Guide"
date: 2026-10-11
category: ai
type: guide
tags: [cmu-10423, cmu, ai-course, generative-ai, course-guide, self-study]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 37
description: "Use the public practice exam to diagnose assumptions, data flow, and evaluation errors through a worked probability example."
tldr: "Use the public practice exam to diagnose assumptions, data flow, and evaluation errors through a worked probability example."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cmu10423-practice-exam)

**Video status: recordings require login or course authorization.** [Recording source](#course-video-sources)

A correct multiple-choice answer may reflect recognition rather than understanding. Can you still explain the result after changing a condition? This guide uses the [Spring 2026 practice exam](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf) to build a cycle of answering, diagnosing, and solving a variation. It does not announce the scope of the actual exam or reproduce unavailable assessments.

You need basic probability and matrix shapes. Start with [RNN probability chains](/posts/ai/2026-09-30-cmu10423-rnn-lm-autodiff-en) or [causal attention](/posts/ai/2026-10-11-cmu10423-lecture-02-causal-attention-en) if those are unfamiliar. The goal is to distinguish mistakes in assumptions, data flow, algebra, and evaluation, then choose a targeted follow-up task.

## What the practice material covers

The public paper has thirteen topic groups, from autodiff, RNNs, Transformers, and decoding through image generation, adaptation, multimodal models, Prompt-to-Prompt, and scaling laws. That describes this document, not a guarantee about the actual exam. Use the separate guides' checks for later topics such as distributed training, agents, video, and world models.

Write a reason and a confidence estimate beside each answer. A confident wrong answer deserves priority: it often reveals an incorrect rule. Merely recognizing that DPO uses preferences does not show that you understand the reference policy.

## A complete probability example

Question 1.1 tests why language models use the probability chain rule. The following numerical variation is our teaching example, not a reproduction of the original question or its official solution.

For tokens A, B, C, let P(A)=0.5, P(B|A)=0.4, and P(C|A,B)=0.25. Their joint probability is 0.5×0.4×0.25=0.05. Using natural logarithms, sequence NLL is −log(0.05), approximately 2.996, or about 0.999 per token.

Multiplying the three marginal probabilities would add an independence assumption. The chain rule requires no such assumption. Teacher forcing supplies the correct history during training; generation uses a history containing previous model outputs. The source of the history changes, while the factorization remains valid.

Calling 0.05 the next-token probability confuses the quantity being measured: it is the probability of the whole specified sequence. A negative NLL signals a sign error. Adding the conditional probabilities signals a factorization error. These failures need different follow-up exercises.

## Turn errors into reproducible tasks

Keep four columns: your answer, the correct reasoning, the error category, and a new variation. Trace a smaller tensor for a shape mistake. Draw the data path for a conditioning mistake. Recompute a numerical example by hand and with code for an algebra mistake. Identify the denominator and test set for a metric mistake.

For example, the right attention output shape does not prove causal masking works. Change a future token and check that earlier outputs remain unchanged. That intervention tests the actual property instead of repeating the definitions of Q, K, and V.

## Check: change one condition

Change only P(C|A,B) to 0.5. What happens to joint probability and NLL? Does this prove the model improved on other sequences?

<details>
<summary>Answer and criterion</summary>

Joint probability becomes 0.1 and NLL becomes approximately 2.303, a reduction of log(2), about 0.693. Only this specified sequence is known to receive greater probability. Average held-out loss need not improve. Conditional distributions still normalize, so raising one candidate's probability can lower others.

</details>

Attempt one topic and one variation before consulting the [official solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf). Preserve ambiguous wording rather than treating this guide as the course's final adjudication. These checks are learning evidence, not a substitute for official grading. Continue to the [paper-report guide](/posts/ai/2026-10-11-cmu10423-hw623-paper-report-en) to practice supporting claims with evidence.

## Course Video Sources

The [official Spring 2026 course site](https://www.cs.cmu.edu/~mgormley/courses/10423/) directs recordings to SCS Panopto. On 2026-10-12, the anonymous reader returned an unloaded folder and a sign-in prompt; it did not provide playable lecture content. This establishes an access limit, not the absence of recordings. This guide uses public written materials and provides no reconstructed classroom speech or original-audio transcript.

- [Official recording folder](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)

## References

- [Practice questions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam.pdf)
- [Official practice solutions](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/practice_exam_solutions.pdf)
- [Coursework](https://www.cs.cmu.edu/~mgormley/courses/10423/coursework.html)
