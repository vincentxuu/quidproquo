---
title: "CMU 10-301 HW2: From Information Calculations to a Complete Decision Tree"
date: 2026-08-22
category: learning
tags: [cmu, machine-learning, decision-tree, information-theory]
lang: en
type: guide
difficulty: 進階
tldr: "HW2 moves from hand-calculated entropy and mutual information to an end-to-end tree learner, predictor, and evaluator."
description: "The design and independent testing strategy for CMU 10-301/601 Spring 2026 HW2 Decision Trees."
series: { name: "Reading CMU 10-301 Machine Learning", order: 2 }
---
> 🌏 [中文版](/posts/learning/2026-08-22-cmu-10301-hw2-decision-trees)

The [official handout](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw2.zip) is titled **Homework 2: Decision Trees** and contains written plus programming work. Written sections cover function approximation, tree calculations, pseudocode, and empirical questions. Programming has an `inspection.py` entropy/majority-error tool and a `decision_tree.py` learner, predictor, evaluator, and tree printer. The ZIP supplies a `decision_tree.py` starter, heart/purchase/small datasets, and small depth-3 reference labels, metrics, and inspection output.

## Why the assignment is ordered this way

Hand calculation exposes why a feature wins. Code exposes stopping rules, tie-breaking, and depth limits. Draw the small-data tree first and require the program to produce the same structure before tuning anything.

## First executable action and completion

First create the inspection program and run the [handout command](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw2.zip):

```bash
python inspection.py small_train.tsv small_inspect.txt
```

Completion means matching the public inspection reference plus depth-3 labels, metrics, and printed tree, then passing your own separable, identical-feature, and tied-gain cases. Gradescope still evaluates private data.

## References
- [HW2 public bundle](https://www.cs.cmu.edu/~mgormley/courses/10601/homework/hw2.zip)
- [Spring 2026 schedule](https://www.cs.cmu.edu/~mgormley/courses/10601/schedule.html)
