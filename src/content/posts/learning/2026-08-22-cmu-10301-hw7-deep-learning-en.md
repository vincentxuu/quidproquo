---
title: "CMU 10-301 HW7: Move from Basic Neural Networks to Deep Learning"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, deep-learning, neural-network]
lang: en
type: guide
difficulty: 深度
tldr: "HW7 builds on HW5 backpropagation to address deep-model architecture and training failures, emphasizing diagnosis over merely adding layers."
description: "The transition, implementation boundary, and self-assessment for CMU 10-301/601 Spring 2026 HW7 Deep Learning."
series: { name: "Reading CMU 10-301 Machine Learning", order: 7 }
---
> 🌏 [中文版](/posts/learning/2026-08-22-cmu-10301-hw7-deep-learning)

The [official handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw7.zip) is titled **Homework 7: Deep Learning** and contains written plus programming work. Written sections cover CNNs, RNNs, Transformers and AutoDiff, and empirical questions. Programming implements an RNN cell, self-attention, hybrid language model, validation, and generation on a TinyStories subset. The ZIP supplies `rnn.py`, public tests/test data, a tokenizer, tiny train/validation stories, loss/metric references, a Colab notebook, and an environment file.

## Establish a diagnostic order

Fix a tiny dataset and random seed. Check shapes, initial loss, one-step gradients, and tiny-set overfitting before architecture comparisons. If training loss does not move, inspect activations, normalization, and learning rate. Discuss regularization only when training succeeds and validation fails.

## First executable action and completion

Start with the [bundle's environment file](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw7.zip):

```bash
conda env create -f environment.yml
```

Then run `test_runner.py` and validate/generate on tiny stories. Completion means passing public tests for the RNN cell, attention, hybrid LM, training, validation, and generation, and reproducing tiny loss/metric references within their expected tolerance. Public tests do not replace Gradescope hidden tests.

## References
- [HW7 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw7.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
