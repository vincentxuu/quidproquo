---
title: "CS336 Lecture 14: Filtering, Deduplication, and Mixing Turn Raw Web Data into Training Data"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs336, training-data, deduplication, synthetic-data, llm]
lang: en
series:
  name: "Reading Stanford CS336"
  order: 15
tldr: "Lecture 14 moves raw documents through language, quality, and safety filtering; exact and near deduplication; and source mixing. Each stage reshapes model behavior, while synthetic instruction and agent trajectories extend the pipeline into executable environments."
description: "A guide to Stanford CS336 Spring 2026 Lecture 14: document filtering, PII and toxicity, exact/near dedup, MinHash, data mixing, epoch caps, and synthetic reasoning/SWE data."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs336-data-curation)

This post covers **CS336 Spring 2026 Lecture 14: Data (filtering, deduplication, mixing, synthetic data)**, taught by Percy Liang on May 13, 2026. Its primary source is the official executable lecture, [`lecture_14.py`](https://github.com/stanford-cs336/lectures/blob/main/lecture_14.py).

Lecture 13 finds raw sources. This lecture decides what enters the token stream. Filtering, deduplication, and mixing are called preprocessing, but each defines the distribution a model learns.

## Filtering combines several imperfect judgments

Raw web data passes through format parsing, language identification, and main-text extraction before handling short pages, templates, ads, code ratios, repeated symbols, and low-quality prose. Heuristics are cheap and interpretable. Classifiers capture more complex signals but amplify the preferences of their reference dataset.

Safety and privacy filters search for personal information, malicious material, adult content, and policy categories. False negatives retain risky content; false positives can systematically remove dialects, communities, or sensitive topics. Thresholds require source-level evaluation, not only a global retention rate.

A reliable pipeline preserves filter reasons and scores per document rather than emitting only a cleaned corpus. This supports threshold changes, bias analysis, and tracing back to provenance.

## Exact deduplication begins with hashes

Identical documents can be normalized, hashed, grouped, and reduced to one copy. Hashes turn full content into fixed-size keys suitable for MapReduce. The pipeline still needs collision handling, canonical-document selection, and source mappings.

Exact dedup misses copies with changed whitespace, templates, or a few sentences. Near dedup represents documents as n-gram or shingle sets and compares Jaccard similarity. MinHash approximates set similarity with compact signatures, and locality-sensitive hashing creates candidate buckets instead of quadratic all-pairs comparison.

Dedup saves more than tokens. Repetition increases memorization, train/test leakage, and the weight of widely syndicated pages. Excessive dedup can remove legitimate reuse such as quotations, code boilerplate, or translations.

## Mixing determines how often each source is seen

Uniform mixing gives every source equal probability. Proportional mixing follows token count. Temperature or α mixing lies between. A small high-quality source can overfit after many epochs; a large web source can drown out rare languages or code under pure proportional sampling.

Epoch caps limit repetitions per source. Regression-based mixing trains small models, learns a mapping from mixture weights to validation or downstream loss, and searches that surface. Small experiments must simulate large-scale epoching; otherwise they overvalue tiny high-quality sources that would be repeated excessively in the target run.

## Synthetic data still has provenance

Reasoning data can begin with human or synthetic prompts, sample several teacher responses, then filter by correctness, format, or reward. A larger teacher is not automatically a better teacher; prompt quality, sampling diversity, and verifiable answers matter.

Software-engineering data is harder. Tasks can come from GitHub PRs, model-injected bugs, or full agent trajectories. Repository dependencies, Docker environments, tests, and protection against reading future commits are part of the data. Without a reproducible environment, a trajectory is only plausible-looking text.

## An auditable data pipeline

Every stage should emit document ID, input snapshot, program version, scores and reasons, parent IDs, and output hash. Maintain audit samples for random retained and removed documents, each language and source, and threshold boundaries. The mixing manifest records sampling probabilities, epoch caps, and consumed tokens.

Use small-model ablations to compare not only aggregate validation loss but language, code, safety, memorization, and downstream slices. Lecture 14's core lesson is that data quality is not one classifier score; it is a traceable sequence of decisions.

## Material fidelity

This lecture has a Spring 2026 schedule entry and a complete executable artifact. This guide follows its filtering, deduplication, mixing, and synthetic-data sections.

## References

- [CS336 Spring 2026 course and schedule](https://cs336.stanford.edu/)
- [Lecture 14 executable lecture](https://github.com/stanford-cs336/lectures/blob/main/lecture_14.py)
- [DataComp-LM](https://arxiv.org/abs/2406.11794)
- [Dolma](https://arxiv.org/abs/2402.00159)

