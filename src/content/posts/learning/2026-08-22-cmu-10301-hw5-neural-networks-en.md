---
title: "CMU 10-301 HW5: Expose Neural Networks and Backpropagation with NumPy"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, neural-network, backpropagation]
lang: en
type: guide
difficulty: 進階
tldr: "HW5 avoids automatic differentiation so learners must track forward shapes, caches, and backward gradients themselves."
description: "Reading computation graphs and checking gradients in CMU 10-301/601 Spring 2026 HW5 Neural Networks."
series: { name: "Reading CMU 10-301 Machine Learning", order: 5 }
---
> 🌏 [中文版](/posts/learning/2026-08-22-cmu-10301-hw5-neural-networks)

The [official handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw5.zip) is titled **Homework 5: Neural Networks** and contains written plus programming work. Written work uses a feed-forward/backpropagation calculation and empirical questions. Programming builds a one-hidden-layer sigmoid/softmax OCR letter classifier. The ZIP supplies `neuralnet.py`, small train/validation CSV files, `tests.py`, unit-test data, an incorrect-output finder, and a visualizer; medium/large data and the official reference solution are absent.

## Read code as a computation graph

Label every tensor shape and cache only values required backward. Write local derivatives first, then accumulate along the graph. Batch dimensions, bias broadcasting, and loss normalization are common silent failures.

## First executable action and completion

From the [bundle's](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw5.zip) handout directory, run:

```bash
python -m unittest tests
```

Then use the handout's `neuralnet.py` interface on the small CSV files, run finite-difference checks, and overfit a tiny subset. Completion means passing public tests, producing correctly formatted per-epoch loss/labels/metrics, and matching numerical gradients. The handout explicitly says public tests are non-exhaustive, so this is not equivalent to full Gradescope credit.

## References
- [HW5 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw5.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
