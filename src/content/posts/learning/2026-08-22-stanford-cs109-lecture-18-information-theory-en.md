---
title: "Stanford CS109 Lecture 18 | Information Theory: Surprise, entropy, information gain, and KL"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 19
tldr: "Surprise turns rare events into bits; entropy is expected surprise, information gain selects uncertainty-reducing questions, and KL measures excess cost from a model distribution."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 18: self-information, entropy, expected information gain, KL divergence, and distribution comparison."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-18-information-theory)

This is article 19 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 18: Information Theory** on July 22 with Chris Gregg. It follows the current [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture18-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture18-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture18-LLMPrompts.pdf), and the reader's [information theory](https://probabilitycoders.stanford.edu/spr26/information_theory) chapter. Current slides are unavailable and Canvas video is gated, preserving the L2 boundary.

The artifacts intentionally have different agendas. The two-page worksheet/key contain formal P1–P5, with no P6 or challenge. The three-page guide has six concepts and additionally covers entropy code, KL divergence, and distribution comparisons. This article covers each source without inventing worksheet numbers.

## P1: Review a recursive expectation

`retry()` succeeds with probability `.5` and returns four seconds; otherwise it spends two seconds and retries. For `μ=E[T]`,

```text
μ=.5(4)+.5(2+μ)=3+.5μ
μ=6 seconds
```

This closes total expectation before expectation is reused to define entropy.

## P2: Why surprise uses a logarithm

Event information content is

```text
I(E)=log2(1/P(E))=-log2 P(E)
```

Drawing the ace of spades has surprise `log2 52≈5.70 bits`. A probability-one event has `log2 1=0` bits: certainty conveys no news.

For independent events, `P(E∩F)=P(E)P(F)`, so

```text
I(E∩F)=log2[1/(P(E)P(F))]
      =I(E)+I(F)
```

The logarithm turns independent probability products into additive surprise: two independent shocks contribute twice the bits.

## P3: Entropy is expected surprise

```text
H(X)=Σx P(x)log2(1/P(x))=-Σx P(x)log2 P(x)
```

A fair coin has one bit of entropy. For `Bern(0.9)`,

```text
-.9log2(.9)-.1log2(.1)≈0.469 bits
```

The biased coin is more predictable and has lower entropy. For PMF `(1/2,1/4,1/8,1/8)`,

```text
H=(1/2)(1)+(1/4)(2)+(1/8)(3)+(1/8)(3)=1.75 bits
```

Among eight-value distributions, Uniform maximizes entropy at `log2 8=3 bits`. Code skips zero-probability entries and uses convention `0 log 0=0`.

## P4: Compare diagnostic tests by expected remaining entropy

Root-cause prior is frontend `1/2`, backend `1/4`, database `1/8`, and network `1/8`, with entropy `1.75 bits`.

Test A asks whether the cause is frontend. Yes has probability `1/2` and leaves zero entropy. No has probability `1/2`, conditional PMF `(1/2,1/4,1/4)`, and entropy `1.5`:

```text
E[remaining H|A]=.5(0)+.5(1.5)=.75
gainA=1.75-.75=1.0 bit
```

Test B separates `{frontend,backend}` from `{database,network}`. Yes has probability `3/4`, conditional `(2/3,1/3)`, and entropy about `.918`; No has probability `1/4` and entropy one:

```text
E[remaining H|B]=.75(.918)+.25(1)≈.939
gainB≈.811 bits
```

Test A is better. The answer is random before testing, so evaluate every branch weighted by its probability—not only a best-case branch or a naive half-of-outcomes split that ignores the prior.

## P5: Two Dice, Two Hints

Given that the first die is one, sum `X` is uniform on 2 through 7:

```text
H1(X)=log2 6≈2.58496
```

Given only `X≤7`, conditional sum probabilities follow counts `(1,2,3,4,5,6)/21`:

```text
H2(X)=-Σ(i=1..6)(i/21)log2(i/21)
     ≈2.39830

H1-H2≈0.18666 bits
```

The first hint leaves six uniform sums and therefore more uncertainty than the skewed conditional distribution from `X≤7`. P5 is a pset5 item omitted from the public key; this calculation uses only the prompt.

## Guide unit: Score information-gain questions in code

For a dictionary PMF, compute entropy with `H -= p*log2(p)`, skipping `p=0`. For a yes/no question, partition possible values by answer, compute each answer probability and normalized conditional PMF, then evaluate

```text
expected_remaining = Σa P(answer=a)H(X|answer=a)
gain = H(X)-expected_remaining
```

Decision trees and Wordle solvers repeat this scoring loop over candidate questions and choose maximum gain. This guide-supported implementation is not worksheet P6.

## Guide unit: KL divergence and cross-entropy

When reality is `P` and model is `Q`, expected excess surprise from coding with `Q` is

```text
D_KL(P||Q)=Σx P(x)log[P(x)/Q(x)]
```

It is nonnegative and zero only when `P=Q`, but asymmetric and therefore not a distance. If `P(x)>0` while `Q(x)=0`, the model declares a possible event impossible and divergence is infinite.

For `P=(.5,.5)` and `Q=(.75,.25)`, base-2 values illustrate directionality:

```text
D(P||Q)≈0.208 bits
D(Q||P)≈0.189 bits
```

Cross-entropy satisfies `H(P,Q)=H(P)+D_KL(P||Q)`. With fixed data distribution `P`, minimizing cross-entropy minimizes KL to predictions, connecting this unit to later classifier losses.

## Guide unit: Three distribution comparisons

Total variation measures the largest event-probability discrepancy, with discrete form `0.5Σ|P-Q|`. Earth mover's distance uses support geometry and asks for minimum mass-transport cost. KL evaluates a probabilistic model through reality-weighted excess surprise, requiring an explicit direction.

Forecasts, Poisson fits, and next-token predictions often suit cross-entropy/KL. Location distributions where a five-kilometer error should cost less than a 500-kilometer error naturally suit earth mover's geometry. The guide asks only for this conceptual comparison, not unprovided algorithm details.

## How to use the LLM Learning Guide

The six concepts are surprise, entropy, information gain, entropy code, KL divergence, and distribution comparison. Label the log base and units, then identify which distribution defines each expectation. Question selection must average all answers; KL must declare reality `P` and model `Q` before calculation.

## Material boundaries

- The formal worksheet agenda is P1–P5, with no P6 or challenge. The six-concept guide additionally covers code, KL, and comparisons.
- P5 is a pset5 item omitted from the public answer key and is computed only from the prompt.
- Current slides are unavailable and video is gated; this L2 guide does not reconstruct missing lecture content.
- The limited artifact scope qualifies for the short-material exception; the article remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 18: Information Theory](https://web.stanford.edu/class/cs109/lectures/18-InformationTheory)
- [Lecture 18 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture18-Worksheet.pdf)
- [Lecture 18 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture18-AnswerKey.pdf)
- [Lecture 18 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture18-LLMPrompts.pdf)
- [Probability for Computer Science: Information theory](https://probabilitycoders.stanford.edu/spr26/information_theory)
