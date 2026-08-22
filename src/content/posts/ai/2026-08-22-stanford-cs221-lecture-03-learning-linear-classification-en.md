---
title: "CS221 Lecture 3: Learning II: Linear Classification, Features, and Cross-Entropy"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 4
tldr: "Lecture 3 of Stanford CS221 Autumn 2025 develops operational representations and algorithmic intuition through Learning II: Linear Classification, Features, and Cross-Entropy."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 3, following the official executable artifact, examples, and limitations."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-03-learning-linear-classification)

This article follows the executable artifact's order: it reviews linear regression, then runs prediction_task, machine_learning_problem, hypothesis_class, zero_one_loss_function, zero_one_loss_optimization, logistic_loss_function, logistic_loss_optimization, multiclass_classification, and representing_text. The order matters because each representation or loss answers a problem exposed by the previous step.

> Public-material gap: the source explicitly links an Autumn 2023 linear-classification module; course, artifact, repository, and playlist links are below. The source gives sentiment classification as a task example, but provides neither hidden sentiment-assignment tests nor solutions, so they are not reconstructed here.

## From linear regression to linear classification

The previous unit's prediction task was regression: an input maps to a real number, using linear functions as the hypothesis class. This unit changes the output to a discrete choice: one class or label among K choices, using thresholded linear functions. It keeps the same three learning questions: which predictors are possible, how good is one, and how can we compute the best parameters?

## Prediction task: inputs, outputs, and argmax

The source begins with image classification: the input is an image and the output is its object type, such as cat. An image is a width × height × 3 RGB tensor. It then gives sentiment classification: the input is a document and the output is its sentiment, such as positive. Text is still a string rather than a tensor; that conversion comes later.

Binary classification has two choices, usually {−1, 1}; multiclass classification has K choices, usually {0, 1, ..., K−1}. A predictor takes an input and returns a predicted output; for multiple classes, it computes class scores and selects the highest-scoring class with argmax. The binary example computes logit = x[0] − x[1] − 1, returning 1 when logit > 0 and −1 otherwise. For x_a = [1, 2], logit = −2 and the prediction is −1. For x_b = [2, 0], logit = 1 and the prediction is 1. The points where logit = 0 form the decision boundary x[0] − x[1] − 1 = 0, or x[1] = x[0] − 1. Once prediction is defined, the question is where the predictor comes from.

## The machine-learning problem

Training data is a set of examples, each an (input x, target output y) pair. The source uses ([1, 2], −1), ([2, 0], 1), and ([0, 0], −1). A learning algorithm consumes this data and produces a predictor. The three questions are: which predictors are possible, which is good according to a loss function, and which optimization algorithm computes the best one.

## Hypothesis class: weights, bias, and straight-line cuts

As in regression, predictors are parameterized. A linear classifier has a weight vector and a bias. It computes weight @ x + bias, calls that raw score a logit, and thresholds it to 1 or −1. With weight = [1, −1] and x = [1, 1], bias = −1 gives boundary x[1] = x[0] − 1, while bias = 1 gives x[1] = x[0] + 1. The hypothesis class is every predictor obtainable by choosing weight and bias; its boundaries are straight-line cuts through the input space.

## Zero-one loss

Squared loss makes sense for regression because it measures numerical distance from the target. Classification outputs labels, so the source uses zero-one loss: prediction and target with the same sign yield 0, and a wrong prediction yields 1.

The same calculation can use the margin. Compute the logit, then margin = logit × target. A positive margin means the sign is correct; a negative margin means it is wrong; zero is on the boundary. The per-example loss is 1 when margin ≤ 0 and 0 otherwise. The source evaluates this on ([2, 0], 1) and ([0, −2], −1). Training loss is the average of per-example losses, or the error rate. Keep the roles distinct: the logit's sign is the prediction and its magnitude is confidence; the margin's sign says correct or wrong; zero-one loss is 0 or 1; train loss averages the data.

## Why zero-one loss cannot drive gradient descent

Every parameter set has a computable training loss, so it is tempting to optimize it as in regression. But the zero-one-loss curve is a sharp cliff at margin zero and has zero gradient almost everywhere; at zero it is not smoothly differentiable. Gradient descent therefore has no update signal. If an example is wrong, a tiny parameter movement usually leaves it wrong, so the loss does not reveal a local direction. The problem is not that error rate is irrelevant; it is that this objective does not provide the nonzero signal required by gradient-based optimization.

## The logistic function

A logit ranges from −∞ to +∞, while a probability must lie between 0 and 1. The source uses σ(z) = 1 / (1 + exp(−z)). As z approaches −∞, probability approaches 0; as z approaches +∞, it approaches 1; at z = 0 it is 0.5. The executable example checks 0, 1, 8, −1, and −8.

There is also a log-odds interpretation. Starting with prob = 0.2, compute odds = prob / (1−prob), take log(odds) as the logit, and apply the logistic function again to recover 0.2. The probabilities for logits 3 and −3 sum to 1. Its derivative is prob × (1−prob), which approaches 0 for large absolute logits.

## Logistic loss and maximum likelihood

To solve the zero-gradient problem, the classifier outputs a continuous probability distribution over labels instead of only a thresholded prediction. For one binary example, logit = x @ weight + bias; the positive probability is σ(logit), the negative probability is σ(−logit), and for target y ∈ {−1, 1}, the target probability is σ(logit × y) = σ(margin).

The source's maximum-likelihood interpretation is to maximize the log probability of the training targets. For multiple examples, probabilities multiply, such as p(y1|x1) × p(y2|x2); taking logs turns the product into a sum. Negating it turns maximization into loss minimization. Thus one logistic loss is −log(σ(margin)). It is smooth, approaches 0 as the margin grows, and the training logistic loss is the average over examples.

## Gradients, updates, and gradient descent

For one example the source computes margin = logit × target and loss = −log(σ(margin)), then:

    grad_logit = −σ(−margin)
    grad_weight = target × x × grad_logit
    grad_bias = target × grad_logit

The training-loss gradient is the average of the example gradients. Gradient descent starts at weight = [0, 0], bias = 0, and learning rate 1. For 20 steps over the three training examples it computes train loss, computes the mean gradient, and updates weight ← weight − learning_rate × grad_weight and bias ← bias − learning_rate × grad_bias. It records losses for a learning curve, then plots the final decision boundary with the training points. The source demonstrates the operation, not an additional numerical result.

## Binary and multiclass behavior

Binary classification uses one logit for y ∈ {−1, 1}; its sign is the predicted class, logistic gives prob_pos, and prob_neg = 1 − prob_pos. Multiclass classification uses y ∈ {0, 1, ..., K−1}, one weight vector per class, one logit per class, and a distribution over classes.

The source's concrete example uses x = [2, 0], weight matrix [[1, −1], [1, −1], [0, 2]], and bias [1, 1, 0]. It first computes logits = weight @ x + bias. The next operation is softmax, rather than applying independent binary logistics, because the desired output is one distribution competing across classes.

## Softmax and cross-entropy

Softmax converts multiple logits into probabilities:

    exp_logits = exp(logits)
    probs = exp_logits / sum(exp_logits)

For [1, −1, 0], the source computes probabilities and then adds 2 to every logit. Relative probabilities do not change: every exponential is multiplied by the same factor, so the numerator-to-denominator ratios stay the same.

Cross-entropy measures the difference between a target and predicted distribution. With target = [0.5, 0.2, 0.3] and predicted = [0.1, 0.5, 0.4], compute target × −log(predicted) term by term and sum. A high target probability paired with a low predicted probability receives a large penalty. The source states that cross-entropy is minimized when target equals predicted, at which point it is the entropy of the target or predicted distribution.

A single label can be represented as a one-hot target such as [0, 1, 0]. Only the target-class term remains, so cross-entropy is the negative log probability of that class. For the three-class classifier above, target 0 means computing logits, softmax probabilities, and then −log(probs[0]). This example loss can be optimized with gradient descent; the source summarizes cross-entropy loss as a generalization of logistic loss.

## Representing text as tensors

Sentiment input is a string, while machine learning operates on tensors. With "the cat in the hat", the source uses two steps: tokenization converts a string into a sequence of integers, and each integer is represented as a one-hot vector. Simple tokenization splits on spaces, builds a vocabulary, and maps strings to indices. An index selects a row of the identity matrix; the sequence becomes a matrix whose rows correspond to tokens.

In practice, the sparse one-hot vectors need not be stored. Indices can be used directly. The dot product of each one-hot row with w, written matrix @ w, is equivalent to w[indices]. The mathematical one-hot view and the indexed implementation therefore produce the same per-position values.

For a bag-of-words representation, represent each token as a one-hot vector and average the token vectors into a fixed-dimensional vector. bow @ w is equivalent to averaging w[indices]. The advantage is that the representation does not depend on text length. The limitation is that it ignores word order: the source uses dog bites man = man bites dog as the example. Finally, it notes that language models use more sophisticated tokenizers such as Byte-Pair Encoding and links to the paper and an interactive tokenizer. No sentiment feature engineering or hidden-assignment behavior absent from the source is added here.

## Summary

- Linear classification applies thresholds to linear functions and outputs one of K choices.
- Zero-one loss is error rate but has zero gradient almost everywhere.
- Logistic loss outputs probabilities and supplies nonzero gradients.
- Maximum likelihood turns a product of target probabilities into a minimizable loss through logs and negation.
- Multiclass models compute one logit per class and use softmax; for a one-hot label, cross-entropy is the negative log target-class probability.
- Text becomes tensors through tokenization and one-hot representation; code can use indices directly. Bag of words is fixed-dimensional but discards word order.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: linear_classification](https://stanford-cs221.github.io/autumn2025-lectures/?trace=linear_classification)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
- [Autumn 2023 linear-classification module linked by the source](https://stanford-cs221.github.io/autumn2023/modules/module.html#include=machine-learning%2Flinear-classification.js&mode=print6pp)
- [Byte-Pair Encoding paper](https://arxiv.org/pdf/1508.07909)
- [Interactive tokenizer](https://tiktokenizer.vercel.app/?encoder=gpt2)
