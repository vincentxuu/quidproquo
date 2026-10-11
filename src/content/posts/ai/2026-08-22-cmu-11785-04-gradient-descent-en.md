---
title: "CMU 11-785 Lecture 4: Training II: Gradient Descent"
date: 2026-08-22
category: ai
tags: [cmu, deep-learning, neural-networks, course-guide]
lang: en
type: guide
difficulty: 進階
tldr: "Spring 2026 Lecture 4 focuses on the definitions of derivative and gradient, extrema and second derivatives, gradient descent as repeated steps against the gradient, and the network, input/output representations, and divergence that must be defined before training. This guide follows the official slides and recording and adds a small self-check that does not depend on the enrolled-course grader."
description: "A bilingual guide to CMU 11-785 Spring 2026 Lecture 4: Training II: Gradient Descent."
draft: false
series:
  name: "Reading CMU 11-785 Deep Learning"
  order: 4
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-11785-04-gradient-descent)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

This article covers CMU 11-785 Spring 2026 **Lecture 4: Training II: Gradient Descent**. Its primary evidence is the [official slide deck](https://deeplearning.cs.cmu.edu/S26/documents/slides/lec4.learning.pdf) and [official YouTube recording](https://youtu.be/WOtAtLGZRIg). It reconstructs only what those materials support and does not invent classroom dialogue or unpublished remarks.

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=WOtAtLGZRIg
title: Lecture 4 official YouTube recording
```

Original videos: [Lecture 4 official YouTube recording](https://www.youtube.com/watch?v=WOtAtLGZRIg)

Course and recording entries:

- [cmu-11785-deep-learning — official course materials and recording index](https://deeplearning.cs.cmu.edu/S26/pages/tables/lectures_table.html)

Checked: 2026-10-10.

Content check: verified against the video transcript (2026-10-10): Read the auto-generated transcript (about 84 minutes); sampled the start, middle and end and searched for derivative, gradient, step size, second derivative and softmax. The transcript confirms derivatives, gradients and gradient descent, but the lecturer never says "learning rate" (he says step size) and the lecture is not about training a linear neuron, so the topic description was rewritten.

## What this lecture addresses

The lecture centers on the definitions of derivative and gradient, extrema and second derivatives, gradient descent as repeated steps against the gradient, and the network, input/output representations, and divergence that must be defined before training. Keep three things separate while reading: the model or algorithm's definition, the objective it optimizes, and the actual computational flow. The first determines the allowed function family, the second states what training prefers, and the third controls memory, speed, and numerical stability.

As Lecture 4, this topic inherits the course's earlier language of representation and training while establishing components used later. Do not merely copy terminology. For each equation, label its input, output, learnable parameters, and gradient path.

## Conceptual thread

Begin with a shape audit. Write the batch, feature, and sequence or spatial dimensions next to every tensor. Then ask whether parameters are shared, whether normalization is required, and whether training differs from inference. These questions expose the gap between recognizing an equation and implementing it correctly.

Place each local operation back inside the overall objective. A deep-learning system does not succeed because of one layer alone: data, representation, loss, optimizer, and evaluation jointly determine behavior. When a result changes, hold the other conditions fixed before diagnosing it.

## Reproduce one small example

Tonight's minimum exercise is: **calculate three gradient-descent steps on a quadratic with two learning rates**. Work through a tiny input by hand, reproduce it in NumPy or PyTorch, and compare the results. If they differ, inspect shapes, indexing, and reductions before questioning the theory.

“Runs without an exception” is not a sufficient check. Record at least one invariant: probabilities sum to one, a loss should decline, an output shape remains fixed, or numerical and analytic gradients agree. This restores a feedback loop without the course's hidden grader.

## Boundary with official homework

The [Spring 2026 assignment table](https://deeplearning.cs.cmu.edu/S26/pages/tables/assignments_table.html) exposes HW1–HW4 titles, deadlines, and platform links, but the complete handouts, starters, data, Autolab tests, and Piazza guidance do not form an anonymously available same-version bundle. The exercise above is a reduced practice task derived from public lecture material, not a reproduction or solution of official homework.

For more implementation work, select a related notebook from the [official recitation and bootcamp table](https://deeplearning.cs.cmu.edu/S26/pages/tables/recitations.html). Those public resources support practice; they do not become official homework starters.

## After the lecture

Close the slides and write the lecture's input, output, objective, and one failure mode on a blank page. Continue only when you can explain all four without notes. Otherwise return to the small example and reduce its input until every operation can be checked manually.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Matched the embedded video against the live official lecture table for the same lecture; playback was not checked individually.
- 2026-10-10: Checked the video content against its transcript. Rewrote the topic description (the video is not about training a linear neuron and does not use the term learning rate).

## References

- [CMU 11-785 Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)
- [Lecture 4 slides](https://deeplearning.cs.cmu.edu/S26/documents/slides/lec4.learning.pdf)
- [Lecture 4 official YouTube recording](https://youtu.be/WOtAtLGZRIg)
- [Spring 2026 recitations and bootcamps](https://deeplearning.cs.cmu.edu/S26/pages/tables/recitations.html)
