---
title: "CMU 10-301 HW1: Find ML Foundation Gaps with Mathematics and Python"
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

## References
- [Spring 2026 coursework](https://www.cs.cmu.edu/~mgormley/courses/10601/coursework.html)
- [HW1 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw1.zip)
