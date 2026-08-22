---
title: "CS124 Week 3 Logistic Regression and Text Classification: From Features to Probability and Loss"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs124, stanford, nlp, logistic-regression, text-classification]
lang: en
series: { name: "Stanford CS124 導讀", order: 4 }
tldr: "Week 3 connects text features, sigmoid probabilities, cross-entropy loss, and gradient descent, producing a classifier whose feature contributions remain inspectable."
description: "Stanford CS124 Winter 2026 Week 3: logistic regression, text classification, features, loss, gradient updates, Lab 2, and PA2."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs124-week3-logistic-regression)

Week 2 turns text into token sequences. Week 3 begins making document-level decisions. Its single agenda is logistic regression for text classification, followed through features, probabilities, loss, and updates in Lab 2 and PA2.

**Version:** Winter 2026. **Unit:** Week 3, January 20 and 22. **Public materials:** the [schedule](https://web.stanford.edu/class/cs124/lec/), [SLP3 Chapter 4](https://web.stanford.edu/~jurafsky/slp3/4.pdf), [Lab 2](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md), [solutions](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression_Solutions.md), and [PA2](https://github.com/cs124/pa2-logistic-regression). The syllabus assigns Chapter 4 pp.1–17, with pp.18 and 21 as useful extras. **Gap:** Canvas narration and Gradescope Quiz 2 are inaccessible; the current textbook PDF postdates the course.

## Classification begins with representation

[SLP3 Chapter 4](https://web.stanford.edu/~jurafsky/slp3/4.pdf) defines text classification as assigning a document to a category such as sentiment, spam, language, or author. The model receives a feature vector `x`, not an uninterpreted string. Features might record whether words occur, how often they occur, or normalized counts.

This embeds assumptions. Bag-of-words discards order while preserving lexical evidence. Adding bigrams retains local order but increases dimensionality and sparsity. Feature extraction defines what evidence the model is allowed to use.

## From a linear score to probability

Logistic regression computes `z = w·x + b`. A weight's sign shows which class the feature pushes toward; magnitude measures that push. The sigmoid `σ(z)=1/(1+e^{-z})` maps any real score to a binary-class probability.

The boundary remains linear, but probabilities let an application change its threshold and provide a differentiable training objective. A spam filter with expensive false positives should not inherit a threshold merely because 0.5 is conventional.

## Cross-entropy punishes confident errors

In [Chapter 4](https://web.stanford.edu/~jurafsky/slp3/4.pdf), binary cross-entropy for label `y` and positive-class probability `p` is `-[y log p + (1-y) log(1-p)]`. Correct confident predictions have small loss; confident errors grow sharply. Training lowers aggregate loss. The logistic-regression gradient reduces to prediction error times the input feature, and gradient descent updates parameters in the opposite direction.

Learning rate controls the step. Too large can overshoot; too small learns slowly. Lab 2 matters because it exposes each calculation rather than letting an optimizer hide a wrong sign or mismatched shape.

## Accuracy is not enough

With imbalanced labels, always predicting the majority can yield high accuracy. A confusion matrix exposes true and false positives and negatives. Precision asks how many predicted positives are real; recall asks how many real positives were found. Their tradeoff belongs to the task's costs.

Choose the threshold on validation data, not after reading test outcomes. Compare precision, recall, and confusion matrices across candidate thresholds, select an operating point from error costs, and monitor calibration when the deployed base rate changes.

Linear weights also provide a basic inspection tool: list the strongest positive and negative features and look for task evidence or dataset shortcuts. Those weights are associations, not causal effects.

## The PA2 finish line

[PA2](https://github.com/cs124/pa2-logistic-regression) continues the notebook workflow. The useful outcome is not simply calling a classifier; it is tracing features through logits, probabilities, loss, and gradients. Build a two-document vocabulary, choose `w,b`, compute one probability and loss, then change one weight and explain the movement. If a word's path into `z` remains invisible, the model's main pedagogical advantage has been lost.

## From text to a design matrix

Chapter 4's pipeline turns each document into a feature row and labels into a target vector. With `m` documents and `d` features, `X` has shape `m × d`. Binary and count features react differently to document length; a bias learns the base rate when other features are zero.

Vocabulary and normalization parameters must be fit on the training split. Looking at validation or test text before feature selection leaks evaluation distribution into the pipeline. Sparse document-term matrices should also remain sparse when scaling beyond the teaching notebook.

## Binary and multinomial outputs

Binary logistic regression uses sigmoid. Mutually exclusive multiclass classification computes one logit per class and applies softmax. Cross-entropy selects the negative log probability of the correct class, and its gradient retains the “predicted distribution minus target” structure.

That same structure returns in language modeling, where every next token is a large multiclass decision. Multi-label tasks are different: independent sigmoid outputs allow several labels rather than forcing them to share one unit of probability mass.

## Regularization and shortcuts

High-dimensional text allows rare words to acquire extreme weights. L2 penalizes squared weights; L1 encourages zeros. Strength belongs to validation tuning, not test-set selection.

Weight inspection can reveal shortcuts, such as a person's name becoming a sentiment cue because of corpus composition. Weights are associations. Group false positives and negatives by negation, sarcasm, domain shift, rare terms, and annotation ambiguity. Each failure suggests a different response: features, data, threshold, or label revision.

## Gradients, batches, and numerical stability

Single-example gradients are noisy, full-batch updates are expensive, and mini-batches trade between them. Record training loss separately from validation metrics. For extreme logits, direct `log(sigmoid(z))` can underflow; stable combined loss functions operate on logits. Verify whether a library expects logits or probabilities.

A finite-difference gradient check perturbs one weight by `±ε` and compares loss change with the analytic derivative. It catches transpose, averaging, and bias-update errors without adding material outside the official mathematical agenda.

## Evidence from Lab 2 and PA2

Attempt the public [Lab 2](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md) problems before opening solutions and preserve intermediate calculations. A PA2 evidence package should include split method, feature definition, class balance, confusion matrix, strongest weights, and three concrete errors, along with environment and notebook output. This proves more than one accuracy number and establishes a baseline for Week 6 neural classifiers.

## Further study

Neural networks replace hand-designed features with learned representations, but logits, sigmoid or softmax, cross-entropy, and gradient learning return. Week 3 remains their inspectable baseline.

## References

- [CS124 Winter 2026 schedule](https://web.stanford.edu/class/cs124/lec/)
- [SLP3 Chapter 4](https://web.stanford.edu/~jurafsky/slp3/4.pdf)
- [CS124 Lab 2](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression.md)
- [CS124 Lab 2 Solutions](https://github.com/cs124/labs/blob/main/Lab2_LogisticRegression_Solutions.md)
- [CS124 PA2](https://github.com/cs124/pa2-logistic-regression)
