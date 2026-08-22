---
title: "Completing CMU 07-280: What You Know, What Is Missing, and What Comes Next"
date: 2026-08-22
category: ai
tags: [cmu, ai-course, learning-path, machine-learning, self-study]
lang: en
series:
  name: "Reading CMU 07-280"
  order: 28
type: guide
tldr: "Finishing 07-280 means more than reading 24 guides: produce a search engine, supervised-model comparison, CNN/GPT-2 experiments, and a small RL-plus-MCTS system before choosing 07-380, 10-301, or a specialist course."
description: "The capability boundary of CMU 07-280 Spring 2026, an evidence-based completion standard for independent learners, and routes into 07-380, 10-301, or advanced AI/ML work."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cmu-07280-completion-roadmap)

07-280 attempts a difficult compression: search, supervised learning, deep learning, NLP, and reinforcement learning—material previously spread across 15-281 and introductory ML—become one common foundation for 07-380. Spring 2026 was also the first complete offering, so its public material carries both curricular ambition and version risk.

Reading every guide is therefore not course completion. The enrolled course combines exams, written and programming homework, pre-reading, recitation, and participation. Independent learners do not have the same feedback chain and must preserve inspectable artifacts instead. The standard below does not pretend to grant CMU credit.

## The course teaches integration interfaces

Four interfaces recur beneath the topic breadth:

1. **Representation:** how a state, feature, token, embedding, or latent activation carries the problem.
2. **Objective:** what path cost, a constraint, loss, return, or search value actually prefers.
3. **Update or inference:** how node expansion, parameter updates, value backup, or sampling produces the next candidate.
4. **Evaluation:** how correctness, optimality, generalization, reward, and failure analysis become observable.

Placing a new method into those four slots transfers better than memorizing definitions for A*, CNNs, attention, and Q-learning. When diffusion, RLHF, or a vision transformer appears, you can still inspect representation, objective, update, and evaluation before waiting for another architecture diagram.

## Five artifacts for independent completion

### 1. An inspectable search engine

Implement UCS and A*, logging expansion order, path cost, and failure cases. Include one admissible heuristic and one deliberately invalid heuristic, then observe when optimality disappears.

### 2. A supervised-learning comparison

Compare a linear or logistic model, a tree, and a small neural network on the same split. Preserve learning curves, regularization settings, and error categories alongside scores. A model comparison without controlled data splits is not interpretable.

### 3. An AlexNet or CNN experiment

Reproduce frozen versus unfrozen transfer learning and record trainable parameters, training time, and validation results. Full ImageNet is unnecessary, but you should explain how dataset size and domain shift affect the choice.

### 4. A small GPT-style language model

Run a reduced path from tokenization and positional encoding through a causal mask and generation. Save a tensor-shape table, loss and perplexity curves, and multiple samples across temperatures. One selected generation is not an evaluation.

### 5. A small RL-plus-MCTS system

Verify value backup and visit counts in a small game before adding a policy/value network and self-play. Test each layer independently; “it eventually plays” cannot conceal errors in search or target generation.

Store all five artifacts in one repository. Each directory should include a README with the problem, execution steps, expected output, and known limitations. That is closer to the course's learning responsibility than five completion screenshots.

## What 07-280 deliberately leaves unfinished

The [official FAQ](https://www.cs.cmu.edu/~07280/) contrasts 07-280 and 10-301. The former adds heuristic and adversarial search, CSPs, GPU basics, and MCTS; the latter reaches k-NN, the perceptron, PAC learning, PCA, clustering, ensembles, recommenders, and MAP. Neither list is intrinsically more advanced—they allocate breadth and ML depth differently.

07-280 is not a complete modern generative-AI curriculum either. GPT-2 supplies a Transformer systems view, but not deep coverage of instruction tuning, preference optimization, retrieval, diffusion, multimodal systems, or distributed training. Some appear as potential 07-380 topics. Until the Fall 2026 course is complete, they remain possible directions rather than delivered content.

## Choosing the next course

### Choose 07-380 for a second layer of breadth and research topics

If you can explain all five artifacts and want logical agents, Bayes nets, game theory, generative models, or deeper AI ethics, 07-380 is the institutional continuation. Its topics can change by semester, so check the current syllabus before enrolling or self-studying.

### Add 10-301 material for clear ML-theory gaps

If you can assemble models but cannot explain generalization, MAP, PCA, clustering, or ensembles, targeted 10-301 units are more efficient than repeating all of 07-280. Formal CMU degree rules and independent learning paths are different; this is knowledge remediation, not duplicate prerequisite credit.

### Enter a specialist course when you have a problem and baseline

For NLP, vision, or RL, expand one artifact into a project with a dataset or environment, baseline, metric, and ablation. “I am interested in LLMs” is not yet a specialist project. Being able to predict failure modes is a better readiness signal.

## An executable completion week

Stop adding videos. Spend seven days consolidating: repair search and supervised-model tests in the first two days; rerun CNN and GPT experiments on days three and four; verify RL and MCTS on day five; write limitations on day six; and draw the full data and control flow from search to self-play on blank paper on the final day.

If one branch cannot be drawn, return to its lecture guide instead of restarting at Lecture 1. The value of 07-280 is not that it mentions every AI term once. It is learning how a system's representation, learning signal, inference procedure, and verification duties constrain one another.

## References

- [CMU 07-280 official course site](https://www.cs.cmu.edu/~07280/)
- [CMU 07-280 syllabus](https://www.cs.cmu.edu/~07280/07280_syllabus_v1.pdf)
- [CMU AI/ML Course Map](/posts/learning/2026-08-21-cmu-ai-ml-course-map-en)
- [CMU 07-280 Course Overview](/posts/ai/2026-08-22-cmu-07280-course-overview-en)
