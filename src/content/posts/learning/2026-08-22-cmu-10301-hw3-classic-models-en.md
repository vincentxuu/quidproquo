---
title: "Compare K-NN, Perceptron, and Linear Regression | CMU 10-301 Assignment 3"
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

## How XOR exposes a linear-boundary limit

This is an invented teaching example, not an official assignment solution.

Four invented points implement XOR: (0,0) and (1,1) have label 0; (0,1) and (1,0) have label 1. A strict linear separation requires b<0, w₁+b>0, w₂+b>0, and w₁+w₂+b<0. Adding the positive-side requirements gives w₁+w₂+b>-b>0, contradicting the last condition.

**Check and answer:** Can adding feature x₁x₂ help? Yes: score=x₁+x₂-2x₁x₂-0.5 yields -0.5,-0.5,0.5,0.5 in the listed point order. Changing representation changes separability.

## Changelog

- 2026-10-11: Added an invented example, worked calculation or reasoning, and a comprehension check with an answer.

## References
- [HW3 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw3.zip)
- [Spring 2026 coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
