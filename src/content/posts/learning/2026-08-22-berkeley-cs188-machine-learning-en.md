---
title: "CS188 Decisions and Machine Learning: From VPI and Naive Bayes to Attention"
date: 2026-08-22
category: learning
tags: [berkeley, cs188, machine-learning, deep-learning, attention]
lang: en
type: guide
difficulty: 進階
series:
  name: "Berkeley CS188 Spring 2026"
  order: 6
tldr: "Lectures 19–25 connect rational decisions and VPI to machine learning, while Project 5 uses PyTorch for regression, classification, CNNs, attention, and an optional character-GPT."
description: "A guide to rational decisions, machine learning, deep learning, LLM topics, and Project 5 in the final technical unit of Berkeley CS188 Spring 2026."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-berkeley-cs188-machine-learning)

**Video status: Videos included.** [Source details](#course-video-sources)

[Lectures 19–25](https://inst.eecs.berkeley.edu/~cs188/sp26/) move from rational decisions and value of perfect information to decision trees, linear regression, Naive Bayes, neural networks, language models, and fine-tuning. [Project 5](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj5/) implements the second half in PyTorch through nonlinear regression, digit and language classification, CNNs, attention, and an optional character-GPT.

## Course video sources

The official Spring 2026 schedule and the official YouTube playlist ([CS188 SP26] Live Lectures, 28 videos) were checked live on 2026-10-10; the lecture recording embedded here is listed there as a “Recording”. No unverified timestamp is supplied.

```youtube
url: https://www.youtube.com/watch?v=qd1cyMpmbRs
title: CS188 Spring 2026 Lecture 19: Rational Decisions
```

Original videos: [CS188 Spring 2026 Lecture 19: Rational Decisions](https://www.youtube.com/watch?v=qd1cyMpmbRs)

Course and recording entries:

- [Official course and recording entry](https://inst.eecs.berkeley.edu/~cs188/sp26/)
- [CS188 Spring 2026 Recordings](https://www.youtube.com/playlist?list=PLp8QV47qJEg5tSxKiwcZt4LVwN_ek2Kxy)

Checked: 2026-10-10.

## This is not a replacement for a full deep-learning course

P5 introduces the modern ML workflow inside a broad AI course: model definition, forward pass, loss, optimizer, batches, and training loop. Its breadth does not replace a dedicated course in optimization, representation learning, or large models. Treat each task as an interface exercise instead of trying to acquire all underlying theory at once.

## Make the small model explainable first

In regression, explain input and output shapes, falling loss, and held-out behavior before advancing. Digit classification adds multiclass loss; language identification adds sequences; the CNN task introduces spatial inductive bias; and attention requires tracking query, key, and value tensor relationships.

The [official P5 specification](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj5/) warns that NumPy 2.0 can cause compatibility failures and suggests 1.24.3 or another version below 2.0 when those errors appear. Treat this as environment reproduction, not a reason to hide the mismatch with a model-code workaround.

For every task, record a baseline, loss curve, and one failure case. The local autograder can test interfaces and thresholds, but it cannot explain why a model fails. That example is the analysis independent study must add.

Series navigation: [Previous: Bayes nets and Ghostbusters](/posts/learning/2026-08-22-berkeley-cs188-bayes-ghostbusters-en) | [Next: Completion route](/posts/learning/2026-08-22-berkeley-cs188-completion-route-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official Spring 2026 schedule and YouTube playlist were checked live and list the embedded lecture recording, so the status is now Videos included.

## References

- [CS188 textbook — Machine Learning](https://inst.eecs.berkeley.edu/~cs188/textbook/ml/machine-learning.html)
- [CS188 textbook — Naive Bayes](https://inst.eecs.berkeley.edu/~cs188/textbook/ml/naive-bayes.html)
- [CS188 Spring 2026 Project 5](https://inst.eecs.berkeley.edu/~cs188/sp26/projects/proj5/)
