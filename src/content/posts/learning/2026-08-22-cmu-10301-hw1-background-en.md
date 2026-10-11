---
title: "Find ML Foundation Gaps with Mathematics and Python | CMU 10-301 Assignment 1"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, python, linear-algebra]
lang: en
type: guide
difficulty: 進階
tldr: "HW1 is written and programming work: mathematical and CS foundations followed by a majority-vote classifier."
description: "A guide to the goals, public assets, and independent checks for CMU 10-301/601 Spring 2026 HW1."
series: { name: "Reading CMU 10-301 Machine Learning", order: 1 }
---
> 🌏 [中文版](/posts/learning/2026-08-22-cmu-10301-hw1-background)

The [official handout inside the ZIP](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw1.zip) is titled **Homework 1: Background** and contains written plus programming work. Written sections cover course policies, probability and statistics, linear algebra, calculus, geometry, and CS foundations. The programming component is a majority-vote classifier that reads TSV files and writes train/test labels and error metrics. The ZIP supplies heart and education splits, a LaTeX template, and reference outputs, but no `majority_vote.py` starter; hidden grading remains on Gradescope.

## The capability being tested

Translate notation into array shapes, loops, and exact command-line output. Record inputs, outputs, and dimensions after each derivation. For code, hand-compute a tiny case before comparing with the supplied example output. Classify disagreements as mathematical, indexing, or formatting failures.

## First executable action

After extracting the ZIP and creating `majority_vote.py`, run the [handout's interface](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw1.zip):

```bash
python majority_vote.py heart_train.tsv heart_test.tsv heart_train_labels.txt heart_test_labels.txt heart_metrics.txt
```

Then add tiny cases for reordered columns and constant labels. Completion means explaining the shapes in the main mathematics sections and matching both heart and education reference label/metric files line by line. It does not establish success on private tests.

## Hand-compute a majority-vote classifier first

This is invented data, not an official test case. Training labels are `1, 0, 1, 1`: three ones and one zero. Ignore features and predict `1` for every row. One of four training predictions is wrong, so training error is `1/4=0.25`.

Test labels are `0, 0, 1`. Keep the majority learned from training: predictions are `1, 1, 1`, with error `2/3`. Do not select a new majority from test labels; that would use test answers to change the classifier.

**Check:** For test labels `1, 1, 0, 1`, what are predictions and error? Four ones, with error `1/4=0.25`. This example deliberately avoids tied training counts. Follow the official handout for tie-breaking, columns, and output formatting rather than inferring them here.

## Changelog

- 2026-10-11: Added an invented teaching example, worked reasoning, and a comprehension check with an answer.

## References
- [Spring 2026 coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
- [HW1 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw1.zip)
