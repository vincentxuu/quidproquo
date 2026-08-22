---
title: "CS224N Lecture 6: Turn a Final Project into a Testable Question"
date: 2026-08-22
category: ai
type: guide
tags: [cs224n, nlp, research-project, transformer, stanford]
lang: en
series:
  name: "Stanford CS224N 導讀"
  order: 7
tldr: "Lecture 6 completes the Transformer picture with encoders, decoders, and cross-attention, then breaks the final project into formats, assessment, research topics, and data. A viable topic needs one explicit baseline and metric."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 6: Transformer review, custom/default projects, and choosing a topic and dataset."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-final-projects)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 6 on January 22, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture06-final-project.pdf) is titled **Final Projects: Custom and Default; Practical Tips**. The agenda first spends about fifteen minutes completing the Transformer picture, then covers project types and assessment, research topics and data sources, and Q&A.

## What the Transformer review completes

A decoder block uses masked self-attention so a language model sees only left context. An encoder removes the causal mask and gives every position bidirectional context. An encoder–decoder lets the decoder read encoder outputs through cross-attention: queries come from the decoder while keys and values come from the source.

These forms map to task constraints. Representation and classification often use encoders; autoregressive generation uses decoders; source-conditioned generation fits encoder–decoders. Architecture choice begins by asking whether an output may see future positions and whether a separate source sequence exists.

## Default and custom projects

The default project gives students a shared task and codebase for comparing methods. The [Custom Final Project Tips](https://web.stanford.edu/class/cs224n/project/custom-final-project-tips.pdf) require a custom project to define its own problem, data, and experiments. Neither is complete merely because it produces a demo; [Practical Methodology](https://www.deeplearningbook.org/contents/guidelines.html) likewise organizes work around baselines, diagnosis, and iteration.

To narrow a topic, write one falsifiable question such as: “Under a fixed data and parameter budget, does method A improve metric B?” Then name the baseline, primary metric, and error analysis. If one experiment simultaneously changes data, model, loss, and evaluation, its outcome cannot identify the useful decision.

## Topics and data sources

The deck suggests starting from limitations in existing papers, adjacent tasks, model failures, or newly available data. Data must be checked early for licensing, format, annotation quality, class distribution, and compute cost. Finding a dataset name does not prove feasibility. Download a small sample and run ingestion, splitting, and a baseline first.

An action for tonight: make a one-page project brief with five fields—question, baseline, data, primary metric, and largest risk. If any field lacks a concrete noun, narrow the topic before training.

## Use the Transformer recap to choose an architecture

Draw which inputs each output may see. Encoders support bidirectional representation, decoders causal generation, and encoder–decoders source-conditioned targets. Prove the pipeline with a small model before scaling.

## Write claim, intervention, and measurement

A testable question names the expected change, the single component changed, and the dataset/metric. Add a failure criterion so a negative result can still support analysis rather than becoming a curated demo.

## Baselines isolate contribution

Choose the simplest comparison that reveals what the new method adds. Hold splits, preprocessing, evaluation, and seeds fixed; disclose extra data and model size. Trivial baselines also detect leakage and broken metrics.

## Audit data before choosing the model

Record provenance, license, unit, labels, and split logic. Inspect distributions, duplicates, missing values, domains, and raw examples. Check that retrieval answers exist in the corpus and that humans can apply the rubric consistently.

## Match metrics to use

Use class-aware metrics for imbalance and suitable semantic/human evaluation for open generation. Keep primary metrics limited; report quality, cost, latency, and safety separately. Categorize errors rather than selecting anecdotes.

## Build an experiment matrix and ablations

Plan baseline, proposed method, and one ablation. Tune on validation and touch test after freezing decisions. Use multiple seeds where feasible and preserve an experiment ledger with code, config, data, runtime, and predictions.

## Move from proposal to report

First run an end-to-end baseline, then implement and test the intervention, run the fixed matrix, and finish with error analysis. A milestone needs working evidence. Every next run should distinguish two hypotheses or change a decision.

## Connect public Assignment 3 to project engineering

The [A3 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a3.pdf) and [public code and tests](https://web.stanford.edu/class/cs224n/assignments_w26/a3.zip) decompose a decoder-only Transformer into attention, MLP, blocks, loss, and generation with local tests. Decompose custom systems similarly: indexing/retrieval/context/generation or state/policy/tools/evaluator.

Assign ownership for dataset versions, evaluation changes, and test runs. Separate preprocessing, training, and evaluation commands with immutable configs. Before submission, ask a teammate who did not write the module to reproduce the baseline and main table from a clean environment.

## Material gap

Winter 2026 recordings and Q&A are not public. This article covers the Transformer recap and the three project agenda items in the official deck, but it does not reconstruct student questions, spoken topic suggestions, or live assessment explanations.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 6 Final Projects & Practical Tips slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture06-final-project.pdf)
- [Custom Final Project Tips](https://web.stanford.edu/class/cs224n/project/custom-final-project-tips.pdf)
- [Assignment 3 handout](https://web.stanford.edu/class/cs224n/assignments_w26/a3.pdf)
- [Assignment 3 public code and tests](https://web.stanford.edu/class/cs224n/assignments_w26/a3.zip)
- [Deep Learning: Practical Methodology](https://www.deeplearningbook.org/contents/guidelines.html)
