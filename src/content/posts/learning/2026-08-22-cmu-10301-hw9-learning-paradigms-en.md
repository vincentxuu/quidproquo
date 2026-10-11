---
title: "Close the Course with Ensembles, k-Means, PCA, and Recommenders | CMU 10-301 Assignment 9"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, clustering, pca, recommender-systems]
lang: en
type: guide
difficulty: 深度
tldr: "The final written assignment combines ensembles, clustering, representation, and recommendation to test whether you can choose a learning paradigm from problem structure."
description: "Four-topic integration and course-completion assessment for CMU 10-301/601 Spring 2026 HW9 Learning Paradigms."
series: { name: "Reading CMU 10-301 Machine Learning", order: 9 }
---
> 🌏 [中文版](/posts/learning/2026-08-22-cmu-10301-hw9-learning-paradigms)

The [official handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw9.zip) is titled **Homework 9: Learning Paradigms** and is the final, entirely written assignment. Its four main sections are PCA, k-Means, Ensemble Methods, and Recommender Systems. The ZIP supplies the PDF, LaTeX template, figures, and a few plotting data files, but no starter code, full dataset, or reference answers.

## The common question

Ensembles combine predictors; k-means groups unlabeled examples by distance; PCA preserves major variation; recommenders exploit sparse user-item signals. Each first requires an objective, representation, and failure conditions.

## First check and completion

No programming command is required. First open the [ZIP's LaTeX template and `figures/data`](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw9.zip), and map each artifact to its PCA, k-means, or recommender section before calculating. Completion means hand-running a k-means assignment/update, calculating a two-dimensional PCA direction, explaining ensemble bias/variance tradeoffs and recommendation sparsity, and drawing a course-wide method-selection map. There are no official answers against which to claim verification.

## Run one k-means iteration by hand

This is an invented teaching example, not an official assignment solution.

Invented one-dimensional points are 0,2,8,10, with initial centers 0 and 10. Nearest-center assignment groups 0,2 together and 8,10 together. Updating by group means gives centers 1 and 9. Another assignment keeps the same groups.

**Check and answer:** What is the sum of squared distances now? (0-1)²+(2-1)²+(8-9)²+(10-9)²=4. This stopping state in a toy example does not prove arbitrary initializations find a global optimum.

## Walk through the other three topics too

These are invented teaching examples, not official solutions.

**PCA:** Points are `(-2,0),(0,0),(2,0)`, with mean `(0,0)`. Variation exists along x but none along y, so the first principal component lies along x; projecting onto it retains all variation. Check: for `(0,-2),(0,0),(0,2)`, the principal direction becomes y. These points are centered; do not apply the same reasoning to uncentered data without handling the mean.

**Ensemble:** Three binary classifiers predict `1,0,1` for one example. Majority vote returns `1`. If the true label is `0`, the ensemble is still wrong; shared errors are not repaired by voting. Check: predictions `0,0,1` return `0`. This illustrates a combination rule without guaranteeing improvement.

**Recommendations:** User U rates item A as 5 and leaves B unrated; V rates A as 4 and B as 5. U’s B cell is unobserved, not a zero-star dislike. Recommending B to U from V’s preferences is a hypothesis to evaluate, not a known answer. Check: can that empty cell directly supply prediction error? No; use independently held-out actual ratings or define an appropriate alternative evaluation task.

The examples ask what variation to preserve, how predictions are combined, and what missing entries mean. Define the question and objective before choosing a method rather than treating all four assignment topics as one success metric.

## Changelog

- 2026-10-11: Added an invented example, worked calculation or reasoning, and a comprehension check with an answer.

## References
- [HW9 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw9.zip)
- [Spring 2026 coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
