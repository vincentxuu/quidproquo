---
title: "AI Engineer Interview Daily — 2026-10-16: Coding"
date: 2026-10-16
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Friday's slot is ML-flavored coding — the interviewer hands you a blank editor and asks you to hand-roll softmax, k-means, or attention. The point isn't reciting the algorithm, it's handling shapes, numerical stability, and edge cases."
tldr: "Today's drill is the 'implement an ML algorithm from scratch' round: the real skill isn't memorizing formulas, it's vectorized thinking (broadcasting instead of nested loops), numerical stability (subtract the max before exponentiating so softmax doesn't overflow on extreme logits), and edge cases (empty clusters in k-means, tied scores in AUC) — those are where you actually earn points. You're usually restricted to NumPy and expected to write the model, loss, or layer yourself instead of calling sklearn. Today's practice question is adapted from PracHub's machine learning engineer question bank: k-means clustering from scratch."
series:
  name: "AI Engineer Interview Daily"
  order: 58
---

> 🌏 [中文版](/posts/daily/2026-10-16-ai-interview-daily)

## Today's Focus

Friday is Coding day. Not the general LeetCode kind — this is the ML-engineer-specific round where the interviewer hands you a blank editor and asks you to implement softmax, k-means, attention, or batch norm from first principles, usually with nothing but NumPy — no PyTorch, no scikit-learn. This round doesn't test whether you remember the math. It tests your feel for shapes, numerical stability, and edge cases — all the things a library quietly hides from you, and that you only trip over once you've actually written the code yourself.

## Core Concepts

### Vectorized thinking: broadcasting instead of nested loops

Given n data points and k centroids, the first instinct is to write two nested loops to compute distances. What the interviewer actually wants to see is whether you can do it in one shot with NumPy broadcasting: reshape the points to `(n, 1, d)`, the centroids to `(1, k, d)`, subtract, and take the norm along the last axis to get an `(n, k)` distance matrix directly. This isn't just about speed — it's the line that separates someone who's genuinely used NumPy from someone who can only write Python for-loops.

### Numerical stability is the unwritten rule nobody tells you

Functions like softmax, log-sum-exp, and cross-entropy are mathematically correct as written, but implementing them literally from the formula will overflow on extreme inputs. The standard fix is to subtract the row-wise max before exponentiating — the exponent can never blow up, and the result is mathematically identical. Interviewer test suites almost always hide a case with a huge logit; skip this step and you'll hit `inf` or `nan` on the spot.

### Edge cases are where the real points are

K-means can produce an empty cluster — a centroid that ends up with zero points assigned — and recomputing its mean then divides by zero. The standard fix is to reinitialize that centroid to the point currently farthest from all existing centroids, or simply skip the update and keep the old value. Tied scores in AUC calculations are another classic trap. The main logic of these functions usually takes five minutes to write; what actually separates candidates is whether you volunteer "here's what happens if X."

### "From scratch" is an implicit contract about scope

When an interviewer says "implement from scratch," the default assumption is NumPy only — the point is to prove you understand what the library is doing underneath, so calling `sklearn.cluster.KMeans` defeats the purpose, while basics like `np.linalg.norm` or `np.random` are fair game. Asking "what am I allowed to use" before you start is cheaper than writing the wrong thing and finding out later.

### Production thinking: know how you'd test it

After you finish writing the code, interviewers often follow up with "how do you know this is correct?" A good answer includes a fixed set of test cases (both normal and extreme inputs), comparing against a brute-force or high-precision reference within a stated tolerance, and at least one input you can think of that would break your original approach. This is the same instinct teams expect from unit tests on production data-processing or feature logic.

## Today's Practice Question

### The Question

Implement the k-means clustering algorithm from scratch. Given n data points in d dimensions and a number of clusters k, return a cluster label for each point. You may only use NumPy — no calling any existing clustering library.

**Source**: Adapted from PracHub's machine learning engineer interview question bank (general bank, not company-specific) &nbsp;&nbsp;**Difficulty**: Medium &nbsp;&nbsp;**Round**: Technical screen (coding round)

### How to Break It Down

1. **Clarify the problem first**: Is k given, or do you need to choose it? Any constraints on initialization (random points vs. k-means++)? What's the convergence criterion — assignments stop changing, or a fixed iteration cap? Is the distance metric Euclidean by default?
2. **Build the framework**: K-means is just two alternating steps — the assignment step (assign each point to its nearest centroid) and the update step (recompute each cluster's mean as the new centroid) — repeated until assignments stop changing or the iteration cap is hit.
3. **Go deep on the core**: Vectorize the assignment step's distance computation with broadcasting instead of nested loops. The update step needs to handle empty clusters — a centroid with zero points assigned will divide by zero when you recompute its mean; the standard fix is to reinitialize it to the point farthest from all current centroids. Also mention initialization sensitivity: random initialization can converge to a local optimum, so in practice you'd run it multiple times and keep the one with the lowest inertia (within-cluster sum of squares), or switch to k-means++.
4. **Close it out**: Summarize the time complexity as O(n·k·d·iterations), and proactively note that "in production I'd just call `sklearn.cluster.KMeans` — implementing it by hand here is to demonstrate I understand what it's doing internally, including how it handles empty clusters and initialization."

### Sample Answer (what you'd actually say in the interview)

> **Clarify scope first.** I'd ask what the convergence criterion is and whether k-means++ initialization is allowed, and confirm NumPy only, no sklearn. Getting this straight up front is cheaper than writing in the wrong direction.
>
> **Write the core loop.** For the assignment step, I'd reshape the points to `(n, 1, d)` and the centroids to `(1, k, d)`, subtract and take the norm to get an `(n, k)` distance matrix in one shot, then use `argmin` to find each point's nearest centroid — no nested loops needed. For the update step, I'd recompute each cluster's centroid with `np.mean`, but check for empty clusters first — if one shows up, I'd reassign it to whichever point is currently farthest from all existing centroids, to avoid dividing by zero. Convergence is checked by comparing the assignment vector to the previous round's; if it hasn't changed, stop — plus an iteration cap in case it genuinely doesn't converge.
>
> **Talk about initialization sensitivity and how I'd test it.** Random initialization tends to get stuck at local optima, so I'd mention I know how k-means++ works — picking the next centroid with probability proportional to squared distance, to spread the initial points out — and that in practice you'd run it a few times and keep the one with the lowest within-cluster sum of squares. For testing, I'd prepare a dataset with three well-separated clusters (so the answer is obvious by inspection) and a dataset that's deliberately just one cluster (to test the empty-cluster logic), and confirm neither case throws an error.

### Self-Check Checklist

Use this table to check whether your answer covered the key points:

| Checklist item | Mentioned? |
|---------|---------|
| Vectorized the distance computation with broadcasting, no nested loops | |
| Explicitly handled empty clusters (the divide-by-zero edge case) | |
| Mentioned initialization sensitivity and knows what k-means++ is | |
| Clearly stated both the convergence criterion and the iteration cap | |
| Proactively mentioned at least one test input targeting an edge case | |
| Bonus: complexity analysis + the production trade-off of using a library instead | |

## Further Reading

- [Machine Learning Coding Interview Questions, in NumPy — Geodesic](https://geodesicpartners.co.uk/machine-learning-coding) — A catalog of the most common traps in this round: softmax overflow on large logits, empty clusters in k-means, batch norm's train vs. eval variance, tied-score ranking in AUC
- [K Means Clustering interview questions and answers — Devinterview-io](https://github.com/Devinterview-io/k-means-clustering-interview-questions) — Common Q&A on k-means itself, useful to cross-check the conceptual boundaries of today's question
- [Machine Learning Interview Questions and Answers (2026) — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — A complete NumPy implementation of mini-batch gradient descent, as a vectorization-style reference

## References

- [Machine Learning Engineer Interview Questions (Updated 2026) — PracHub](https://prachub.com/positions/machine-learning-engineer) — Source of today's practice question (k-means clustering from scratch)
- [Machine Learning Coding Interview Questions, in NumPy — Geodesic](https://geodesicpartners.co.uk/machine-learning-coding) — The "NumPy only" scope contract, plus the numerical stability and edge case checklist
- [Machine Learning Interview Questions and Answers (2026) — goodspace.ai](https://goodspace.ai/interview-questions/machine-learning) — Vectorized mini-batch SGD implementation for comparison
- [K Means Clustering interview questions and answers — Devinterview-io](https://github.com/Devinterview-io/k-means-clustering-interview-questions) — Supplementary k-means concept reference
