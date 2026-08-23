---
title: "CMU 10-301 HW3: Compare K-NN, Perceptron, and Linear Regression"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, knn, perceptron, linear-regression]
lang: en
type: guide
difficulty: 進階
tldr: "HW3 is written work: a decision-tree review followed by K-NN, Perceptron, and Linear Regression through inductive bias, errors, and model selection."
description: "A guide to the four-model comparison and self-assessment in CMU 10-301/601 Spring 2026 HW3."
series: { name: "Reading CMU 10-301 Machine Learning", order: 3 }
---
> 🌏 [中文版](/posts/learning/2026-08-22-cmu-10301-hw3-classic-models)

The [official handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw3.zip) is titled **Homework 3: Decision Trees, K-NN, Perceptron, Regression** and is entirely written. Its sections are decision tree revisited, regression tree, k-nearest neighbors, perceptron, and linear regression, with overfitting, error rates, and model selection inside them. The ZIP contains the PDF, LaTeX template, and figures—no starter code, dataset, or reference output.

## Do not read it as four formula sheets

The common question is which model fails first when representation or decision boundaries change. K-NN distance, perceptron separability, regression loss, and tree split preferences encode different assumptions.

## First check and completion

There is no necessary safe command. Open the [PDF/LaTeX bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw3.zip) and list the assumptions behind all five sections before calculating. Completion means pairing every result with its assumption and predicting model behavior on XOR, an outlier-contaminated line, and sparse high-dimensional points. With no official answers, do not label your derivations officially verified.

## References
- [HW3 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw3.zip)
- [Spring 2026 coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
