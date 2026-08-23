---
title: "CS224N Lecture 11: Why LLM Benchmarks Expire"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224n, llm-evaluation, benchmark, nlp, stanford]
lang: en
series:
  name: "Stanford CS224N 導讀"
  order: 12
tldr: "Lecture 11 divides evaluation into what to test, how to measure it, and when the result stops being trustworthy. Benchmarks saturate or leak, prompts change scores, and an LLM judge remains a biased model."
description: "A lecture-by-lecture reading of CS224N Winter 2026 Lecture 11: benchmark design, dynamic and adversarial evaluation, metrics, LLM judges, and contamination."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224n-benchmark-evaluation)

The [official CS224N Winter 2026 schedule](https://web.stanford.edu/class/cs224n/) places lecture 11 on February 10, 2026, but does not name a lecturer; this article therefore attributes it only to the course staff. The [official deck](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture11-evaluation.pdf) has four agenda parts: the recent saga of LLM benchmarks, benchmark design, evaluation metrics, and cautions and open questions. The task is not to memorize another leaderboard but to decide whether a score still supports a decision.

## Benchmark shelf lives are shrinking

The [NLP benchmarking survey](https://aclanthology.org/2022.naacl-main.395/) explains how benchmarks and leaderboards turn research questions into shared targets. When models approach saturation, scores lose discriminative power. Test data may also enter pretraining corpora, turning generalization into recall. Human performance is not always a meaningful ceiling when a task rewards broad retrieval, strict formatting, or speed rather than human expertise.

Results therefore need model version, prompt, decoding settings, and evaluation date. A benchmark name alone is not reproducible.

## What to test: static, dynamic, and adversarial design

A high-impact benchmark needs a clear construct, representative data, and enough difficulty to distinguish methods. Static test sets are comparable but prone to saturation and leakage. Dynamic benchmarks refresh data. Adversarial benchmarks target weaknesses, though collection can introduce annotation artifacts that models exploit as shortcuts.

Multitask evaluation broadens coverage, but an average can hide subgroup failures. A leaderboard should be expanded into tasks and categories rather than read only by its aggregate.

## How to measure: references, models, and people

[HELM](https://arxiv.org/abs/2211.09110) demonstrates holistic evaluation across scenarios and metrics. Exact match is cheap and reproducible but too strict for open generation; model-based metrics such as [AlpacaEval](https://github.com/tatsu-lab/alpaca_eval) handle semantics and preferences but inherit position bias, verbosity bias, version drift, and knowledge gaps from the evaluator.

Human evaluation is not automatically a gold standard. A vague rubric, mismatched annotator expertise, or low agreement also produces unstable results. Preserve the rubric, samples, randomization, and agreement statistics.

## Goodhart, contamination, and prompt sensitivity

Once a metric becomes an optimization target, it may cease to represent the original quality. Contamination puts test items into training; prompt sensitivity changes measured capability with formatting. Trustworthy evaluation needs contamination audits, multiple reasonable prompts, error analysis, and a holdout not repeatedly used for development.

## Write an evaluation contract

Fix construct, population, inputs/outputs, metric, prompts, decoding, versions, date, and exclusions before test results. A task format is not automatically the capability name.

## Benchmark lifecycle

Track collection, annotation, release, leaderboard probing, saturation, and eventual training contamination. Version hashes and combine stable anchors with rolling fresh sets.

## Construct validity and shortcuts

Use counterfactuals and simple input-only baselines to detect artifacts, memorization, and format cues. Human ceilings require matched tools, time, and expertise.

## Dynamic and adversarial evaluation

Dynamic sets improve freshness but drift; adversarial sets expose weaknesses but create collector artifacts. Report natural, adversarial, and dynamic distributions separately.

## Aggregating multitask benchmarks

Macro, micro, normalized scores, and ranks encode different weights. Publish per-task, uncertainty, and worst-group results; count refusals by a predefined rule.

## Reference-based metrics

Exact match, token F1, BLEU, ROUGE, and learned semantic metrics measure different overlap. Validate correlation in the target domain and preserve normalization and references.

## Reference-free and information-theoretic metrics

Split rubrics so fluency cannot replace correctness. Calibration, likelihood, and uncertainty need tokenizer/API-aware interpretation and reliability plots.

## Human evaluation protocol

Train qualified annotators with anchors, blind identity, randomize order, double-label a subset, report agreement, and size samples for expected differences.

## Bias tests for LLM judges

Lock judge versions and test order, verbosity, self-preference, evidence use, and prompt injection. Audit with humans or independent judges.

## Contamination audit

Check exact, near-duplicate, paraphrase, template, and answer leakage. Use temporal/canary evidence when training data is closed and state uncertainty.

## Prompt sensitivity and uncertainty

Treat reasonable prompts and seeds as variation; use paired/bootstrap intervals and distinguish statistical from practical significance.

## An executable checklist

Document construct through cost, classify twenty errors, rerun prompt paraphrases and seeds, swap judge order, and state explicitly what the score cannot prove.

## Material gap

Winter 2026 recordings are not public. This article covers the deck's four agenda sections and subtopics but does not reconstruct the lecturer's spoken judgments about particular leaderboards.

## References

- [Official CS224N Winter 2026 course page](https://web.stanford.edu/class/cs224n/)
- [Lecture 11 Evaluation slides](https://web.stanford.edu/class/cs224n/slides_w26/cs224n-2026-lecture11-evaluation.pdf)
- [Challenges and Opportunities in NLP Benchmarking](https://aclanthology.org/2022.naacl-main.395/)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)
- [AlpacaEval](https://github.com/tatsu-lab/alpaca_eval)
