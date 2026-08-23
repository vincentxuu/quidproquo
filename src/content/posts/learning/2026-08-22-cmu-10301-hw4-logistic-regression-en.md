---
title: "CMU 10-301 HW4: Turn Logistic Regression Likelihood into a Classifier"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, logistic-regression, optimization]
lang: en
type: guide
difficulty: 進階
tldr: "HW4 joins probabilistic interpretation, cross-entropy gradients, and implementation into one traceable training pipeline."
description: "Derivation, implementation, and local validation for CMU 10-301/601 Spring 2026 HW4 Logistic Regression."
series: { name: "Reading CMU 10-301 Machine Learning", order: 4 }
---
> 🌏 [中文版](/posts/learning/2026-08-22-cmu-10301-hw4-logistic-regression)

The [official handout inside the ZIP](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw4.zip) is titled **Homework 4: Logistic Regression** and contains written plus programming work. Written sections cover linear regression, logistic-regression warm-up/analysis/adversarial attack, vectorization and pseudocode, word embeddings and gender biases, and empirical questions. Programming first uses `feature.py` to average GloVe vectors for Yelp sentiment text, then `lr.py` trains logistic regression. The ZIP provides both starters and `glove_embeddings.txt`; course data and selected references are not inside this public ZIP.

## Capability checkpoint

Hand-compute one example's logit, probability, loss, and gradient, then reproduce every value in code. Final accuracy alone can conceal a wrong sign, averaging error, or mishandled bias. Log per-epoch loss and fix ordering and initialization.

## First executable action and completion

Extract the [bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw4.zip), then run `python feature.py --help` and `python lr.py --help` to inspect the starter interfaces. Because the public ZIP lacks Yelp splits, no honest command can complete the official pipeline from that ZIP alone. With legitimately obtained data, run finite-difference gradient checks. Completion requires reproducible feature files, a numerically checked single-example gradient, and all train/validation/test outputs; without course data and hidden tests, completion remains partial.

## References
- [HW4 official bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw4.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
