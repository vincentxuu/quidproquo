---
title: "A Complete Guide to CMU 11-785: 28 Public Lectures, but an Incomplete Assignment Chain"
date: 2026-08-22
category: ai
tags: [cmu, deep-learning, neural-networks, course-guide]
lang: en
type: guide
difficulty: 進階
tldr: "CMU 11-785 Spring 2026 publishes official slides and YouTube recordings for all 28 content lectures, plus extensive bootcamps and recitations. Its HW1–HW4 specifications, starters, and evaluation still depend on Autolab, Piazza, and Kaggle."
description: "A version-locked guide to CMU 11-785 Spring 2026: lecture sequence, assignment access boundary, prerequisites, compute tradeoffs, and an executable independent-study route."
draft: false
series:
  name: "Reading CMU 11-785 Deep Learning"
  order: 0
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-11785-course-overview)

[CMU 11-785 Introduction to Deep Learning Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html) is a graduate course that moves from neural-network representation to Boltzmann machines. Its official schedule contains one logistics session and **28 content lectures**. Every content lecture links slides, YouTube, and MediaServices, while a large bootcamp and recitation collection covers Python, NumPy, PyTorch, data handling, and model implementation.

It resembles a completely open course, but the boundary is sharp: the lecture chain is complete; the graded assignment chain is not. This guide and its series lock to Spring 2026 rather than mixing Fall 2025 or Fall 2026, and reconstruct only what public evidence supports.

## Version decision: Spring 2026 is latest-complete

Spring 2026 is the latest completed offering whose 28 content lectures can each be matched to slides and official recordings. Relative links in the [official lecture table](https://deeplearning.cs.cmu.edu/S26/pages/tables/lectures_table.html) sometimes omit `./` or contain spaces, so the series records resolved URLs instead of guessing paths from article pages.

Fall 2025 remains a historical fallback. Fall 2026 was a new-term entry at verification time and cannot replace a completed offering. “Canonical edition” only fixes the semester used for dates, ordering, and materials; it is not a judgment that other offerings are worse.

## The 28 lectures form six sections

| Section | Lectures | Capability thread |
|---|---:|---|
| Neural-network foundations | 1–8 | Representation, ERM, gradient descent, backpropagation, convergence, optimization, regularization |
| Convolutional networks | 9–12 | Convolutional structure and CNN design |
| Sequence models | 13–17 | RNNs, Seq2Seq, CTC, beam search, language models, translation |
| Attention and LLMs | 18–20 | Attention, Transformers, newer architectures, large language models |
| Generative and representation learning | 21–25 | Autoencoders, VAEs, diffusion, GANs, GNNs |
| Associative memory and decisions | 26–28 | RL, Hopfield networks, Boltzmann machines |

This is not merely a playlist of currently popular models. The first eight lectures establish what networks represent and why training succeeds or fails; CNNs and sequence models then receive long sections of their own. Jumping directly to LLMs or diffusion removes the common language the course uses for training and representation.

## Assignment audit: public titles do not make a reproducible course

The [official assignment table](https://deeplearning.cs.cmu.edu/S26/pages/tables/assignments_table.html) publishes four homeworks. HW1–HW4 each have Part 1 and Part 2, with deadlines and enrolled-course platform links.

The core links lead to CMU Autolab and Piazza. The [official syllabus](https://deeplearning.cs.cmu.edu/S26/pages/syllabus.html) separately explains that homework includes Autolab and Kaggle components. Without enrollment, there is no officially verified, same-version bundle of handouts, starter code, required data, tests, and feedback. The series will not publish complete assignment solutions or claim to reconstruct the official grader.

The public [recitation and bootcamp table](https://deeplearning.cs.cmu.edu/S26/pages/tables/recitations.html) is separate. Its notebooks, slides, recordings, and some data support practice in NumPy, PyTorch, data loaders, losses, model persistence, and workflow. These materials strengthen an independent-study path but do not become homework starters by proximity.

## Preparation

The course does not treat Python as a primary teaching topic. Before starting, you should be able to:

- Manipulate matrices in NumPy and reason about shapes and broadcasting.
- Differentiate vector and matrix functions and use the chain rule.
- Work with probability, expectations, and basic statistical language.
- Write a PyTorch dataset, model, loss, and training loop.

If the fourth item is weak, begin with the public PyTorch, dataset, and data-loader bootcamps. Use a small readiness gate tonight: without copying an example, write a two-layer MLP that performs forward, loss, backward, and one optimizer step on random data. If any tensor shape is unclear, repair that step before proceeding.

## Independent study: separate lecture and implementation tracks

Schedule two blocks per week. First watch one lecture with its slides; the next day, reproduce one corresponding recitation notebook. Lecture notes answer “what are the concept and derivation?” Implementation notes record shapes, numerical stability, training curves, and failures. Watching a recording does not complete an implementation.

When official homework assets are missing, use a smaller but honestly labeled substitute. After backpropagation, for example, implement an affine layer and activation in NumPy, then check gradients with finite differences. This tests the concept without pretending to be HW1P1.

Treat compute separately as well. Course documents discuss PSC, cloud environments, and Kaggle, but outsiders do not inherit CMU allocations or staff support. The early lectures and small CNN/RNN exercises can begin on a CPU or free notebook runtime; large speech, face-verification, and generative-model runs require a separate data and GPU budget.

## How the series proceeds

Each lecture guide locks to its official date, slides, and YouTube recording, follows the published agenda, and does not invent classroom dialogue. Course Logistics is included here; orders 1–28 map to the 28 content lectures. Implementations reproduce only small exercises supported by public material, with platform gaps stated explicitly.

The pilot covers Lectures 1–4. It will be reviewed for complete agenda coverage, independently recomputed derivations, and a self-check path that works without Autolab before the rest is produced.

## References

- [CMU 11-785 Spring 2026](https://deeplearning.cs.cmu.edu/S26/index.html)
- [Spring 2026 lecture table](https://deeplearning.cs.cmu.edu/S26/pages/tables/lectures_table.html)
- [Spring 2026 recitations and bootcamps](https://deeplearning.cs.cmu.edu/S26/pages/tables/recitations.html)
- [Spring 2026 assignments](https://deeplearning.cs.cmu.edu/S26/pages/tables/assignments_table.html)
- [Spring 2026 syllabus](https://deeplearning.cs.cmu.edu/S26/pages/syllabus.html)
