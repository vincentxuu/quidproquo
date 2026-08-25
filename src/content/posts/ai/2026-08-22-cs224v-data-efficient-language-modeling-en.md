---
title: "Stanford CS224V Lecture 14: Scaling Language Models When Data Is the Bottleneck"
date: 2026-08-22
category: ai
tags: [cs224v, stanford, language-model, data-efficiency, synthetic-data]
lang: en
type: deep-dive
series:
  name: "Reading Stanford CS224V"
  order: 15
tldr: "The final lecture is not a complete LLM-training tutorial. It studies data efficiency under fixed data and abundant compute, revisiting epochs, batches, ensembles, self-training, and conditions for synthetic continued pretraining."
description: "CS224V Training LLMs and Data-Efficient Language Modeling: data bottlenecks, finite-data pretraining, ensembles, self-training, synthetic continued pretraining, and limits."
---

> 🌏 [中文版](/posts/ai/2026-08-22-cs224v-data-efficient-language-modeling)

This guide reconstructs the lecture from the [official Fall 2025 deck](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf); system descriptions and reported results below are attributed to that historical course material unless a paper is linked at the claim.

The schedule abbreviates the final session as “Training LLMs,” but the deck's precise title is “Data-Efficient Language Modeling.” It is not a tokenizer-to-RLHF recipe. It asks how fixed high-quality data can be used better as compute grows, and whether synthetic data can add genuine generalization value.

## Agenda: use existing data, then make new data

The deck separates progress into algorithms, data, and compute, then motivates bottlenecks in pretraining, instruction tuning, and continued pretraining. Part 1 studies epochs, batch size, ensemble distillation, and self-training under finite data and abundant compute. Part 2 covers synthetic continued pretraining, diversity, neighbor supervision, and scaling. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Infinite compute does not repair finite data

Repeated training on a fixed corpus eventually saturates and overfits. The lecture revisits options often ignored in compute-rich settings: batch and repetition schedules, multiple-model ensembles and distillation, and self-training. The point is to study model scale separately from efficiency of data use. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Small-scale perplexity gains still require validation under continued pretraining and larger data. Otherwise a technique tied to one experimental regime can be mistaken for a general scaling law.

## Separate data, algorithms, and compute

Parameter count does not reveal whether gains came from architecture, tokens, cleaning, or budget. Data efficiency can mean tokens needed for a loss, best loss on fixed data, or downstream gains after continued pretraining. State the definition and report unique tokens, total presentations, and compute. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Why fixed-data pretraining saturates

Repeated epochs initially learn patterns and later overfit. Validation loss, memorization, and downstream generalization must be evaluated together. Infinite-compute experiments are controlled science, not production advice, and small-scale ordering requires validation at larger scale. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Batch size and epochs are data-efficiency interventions

Batch size changes gradient noise and steps, not only throughput. Comparisons must fix unique data while disclosing repetitions and FLOPs. Continued pretraining is a natural data-constrained test. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Ensembles are not merely an inference trick under compute abundance

Ensembles reduce variance; distillation converts multiple predictions into student supervision. They spend more compute on fixed data, so the question is whether that compute beats additional training of one model. Teacher errors and bias remain. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Self-training and feedback loops

Pseudo-labels can provide useful structure or amplify model preferences. Preserve generated corpora, synthetic proportion, teacher versions, duplication, and diversity. Independent evaluation must avoid contamination and shared-model style bias. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## What small-scale perplexity can establish

A method effective at hundreds of millions of tokens may reorder at billions. Report model, unique and total tokens, mix, compute, seeds, and regime-specific conclusions. Continued-pretraining transfer strengthens evidence without making it universal. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Three meanings of synthetic data

Distillation transfers teacher ability; post-training shapes existing behavior; synthetic pretraining aims to improve learning from limited domain documents. Instruction-following gains do not prove new pretraining knowledge. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

The lecture studies a pretrained model plus a small specialized corpus, making the additional knowledge objective explicit.

## Reversal curse and useful augmentation

Autoregressive training can learn A→B without B→A. Paraphrases provide alternate direction but can remain superficial or hallucinate. Useful augmentation preserves source facts while adding relational and contextual diversity. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Synthetic continued pretraining

A synthesizer maps a source document to a plausible related document. Students train on synthetic plus real data, with real anchors limiting drift. Every generated document needs source, model, version, deduplication, filtering, and provenance. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Learning from document neighbors

Real neighboring documents supervise a document-to-neighbor transformation rather than sentence paraphrase. Nearest-neighbor quality and scale matter; boilerplate similarity can teach poor transformations. Evaluate fact overlap, novel combinations, duplication, contradiction, and quality. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Thresholds and scaling

Synthetic data may fail below a teacher/data/quality threshold. Scaling curves, not one point, determine whether diversity failures improve. Compare repeated real data, synthetic augmentation, and a fresh-data oracle under a fixed token budget while also reporting generation and search compute. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Failure modes

Templates reduce effective diversity; hallucinations become training facts; iterative teachers amplify bias. Use lexical and semantic deduplication, distribution audits, grounding, human samples, real-data anchors, teacher diversity, and versioned generations. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## Connection to agent systems

Better training can reduce parser and generator error but cannot provide live database truth, action authorization, or provenance. System corrections can become training data only with privacy, policy, and version controls. Formal guards remain after model improvement. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## An auditable experiment

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Compare repeated real data, paraphrases, and neighbor-conditioned synthetic data with fixed unique real tokens and independent evaluation. Preserve generation provenance; audit facts, contradictions, diversity, and duplicates.

Run several seeds and measure loss, domain QA, reversal probes, memorization, and calibration. Before scaling, rule out evaluator contamination and style matching.

## Synthetic data must add variation, not only wording

The lecture distinguishes distillation, post-training alignment, and synthetic data intended to enrich pretraining knowledge combinations. Paraphrases can preserve the same information and bias without reproducing the diversity of web-scale relationships. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

Synthetic continued pretraining learns to generate a document's “neighbor.” Related document pairs supervise a synthesizer, which creates new combinations from a source; synthetic and real data are then mixed for training. Thresholds and scaling matter. Low-diversity output from weaker models can create feedback loops, and gains must survive larger-scale tests.

## How this closes CS224V

The first thirteen lectures usually place an LLM inside a constrained pipeline. The finale steps beneath the system layer: agent capabilities remain bounded by training data. Verification cannot create representations a model never learned, while synthetic data does not replace retrieval, formal state, or external evidence. ([lecture source](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf))

## A concrete experiment

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

Fix a real-token budget for a small continued-pretraining study. Compare repeated real data, paraphrase augmentation, and neighbor-conditioned synthetic data. Measure source-fact retention, duplication, and domain QA alongside validation loss, and preserve generated data for feedback-loop inspection.

## Material gaps

> **Author extension:** The following is an implementation or review method derived from the lecture, not a result reported by the deck.

The public deck is a research talk, not a complete training recipe. Several results belong to preprints or specific experimental regimes. Without a recording, full code, and all hyperparameters, this article does not generalize them to arbitrary model scales.

## References

- [Lecture 14: Data-Efficient Language Modeling](https://web.stanford.edu/class/cs224v/lectures/l-training.pdf)
- [CS224V Fall 2025 schedule](https://web.stanford.edu/class/cs224v/schedule.html)
- [CS224V Fall 2025 readings](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf)
- [CS224V Fall 2025 course home](https://web.stanford.edu/class/cs224v/)
- [Lecture 1: model/data/system course map](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf)
