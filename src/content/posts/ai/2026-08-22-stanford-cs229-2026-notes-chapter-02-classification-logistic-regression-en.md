---
title: "Classification and Logistic Regression: Decision Boundaries and Newton's Method"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs229, stanford, machine-learning, logistic-regression, classification]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 3
tldr: "Chapter 2 derives logistic loss from a sigmoid probability model, then contrasts it with the perceptron and extends it through softmax and Newton's method."
description: "A guided reading of Chapter 2 of the 2026 Stanford CS229 notes: logistic regression, perceptron, softmax regression, and Newton optimization."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-02-classification-logistic-regression)

This article reads Chapter 2, “Classification and logistic regression,” on printed pages 21–29 of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a **chapter reading of the 2026 notes**, not a reconstruction of a quarter's recordings.

## From a linear prediction to a class probability

Using \(\theta^Tx\) directly to predict zero or one gives an unbounded output with no probability interpretation. Logistic regression computes a linear logit and compresses it into \([0,1]\):

\[
h_\theta(x)=\frac{1}{1+e^{-\theta^Tx}}=P(y=1\mid x;\theta).
\]

The point \(\theta^Tx=0\) has probability 0.5 and defines a linear decision boundary. The linear score determines log-odds, not probability itself.

## Bernoulli likelihood becomes cross-entropy

For \(y\in\{0,1\}\), one observation has probability \(h^y(1-h)^{1-y}\). Taking logs of the dataset likelihood turns maximum likelihood into minimization of

\[
\ell(t,y)=-y\log\sigma(t)-(1-y)\log(1-\sigma(t)),
\]

where \(t=\theta^Tx\). Its derivative has the familiar “prediction minus target” form, supporting either ascent on log-likelihood or descent on negative log-likelihood.

The perceptron replaces the sigmoid with a hard threshold and updates only on mistakes. It retains a linear boundary and a simple rule, but it does not estimate calibrated probabilities. Similar-looking equations do not make it a probabilistic model.

## Multiclass classification with softmax

For \(k\) classes, the model assigns a logit to each class and normalizes them:

\[
P(y=j\mid x)=\frac{e^{\theta_j^Tx}}{\sum_{s=1}^k e^{\theta_s^Tx}}.
\]

Negative log-likelihood becomes multiclass cross-entropy. The derivative with respect to class \(j\)'s logit is its predicted probability minus the corresponding one-hot target. Softmax probabilities depend on relative scores: adding the same constant to every logit changes nothing.

## Why Newton's method is fast—and expensive

Gradient methods use local slope. Newton's method also uses the Hessian's curvature:

\[
\theta\leftarrow\theta-H^{-1}\nabla J(\theta).
\]

It can reach the optimum in fewer iterations, but constructing and solving the Hessian system becomes costly as the parameter count grows. Fewer iterations do not guarantee less wall-clock time.

## Limits and chapter connections

Without a nonlinear feature map, logistic regression still has a linear boundary. On perfectly separable data, unregularized maximum-likelihood parameters can also grow without bound. Probability outputs should only be interpreted literally when modeling and calibration assumptions are credible.

Chapter 1 supplied the optimization and likelihood vocabulary. Chapter 3 derives sigmoid and softmax from exponential-family assumptions rather than treating them as arbitrary wrappers. Chapter 4 then switches from modeling \(p(y\mid x)\) to modeling \(p(x\mid y)\).

## Self-study exercise

Create a two-dimensional binary dataset and train both logistic regression and a perceptron. Plot their boundaries, inspect how logistic probabilities change near the boundary, and compare gradient descent with Newton's method by both iteration count and elapsed computation.

## References

- [CS229 Lecture Notes (2026-08-18), Chapter 2: Classification and logistic regression](https://cs229.stanford.edu/main_notes.pdf)
- [Stanford CS229 course site](https://cs229.stanford.edu/)
