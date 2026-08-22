---
title: "Stanford CS109 Lecture 14 | Beta: Turn an unknown probability into an updatable random variable"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 15
tldr: "A Beta distribution represents full belief about an unknown success rate; success/failure data updates two parameters for posteriors, smoothing, and Thompson-sampling decisions."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 14: Beta posteriors, conjugacy, moments, Laplace smoothing, CDFs, and Thompson sampling."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-14-beta-distribution)

This is article 15 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 14: Beta** on July 15 with Chris Gregg. Its Summer agenda follows the [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture14-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture14-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture14-LLMPrompts.pdf), and the shared Spring-dated reader's [Beta](https://probabilitycoders.stanford.edu/spr26/beta) chapter. The Canvas recording is inaccessible, so spoken material is not reconstructed.

The worksheet and answer key contain complete two-page P1–P7 plus challenge material. The guide has six concepts; its nominal third page only continues the wrap-up and closing note. The lecture's conceptual move is to treat an unknown success probability as a random variable supported on `[0,1]`, not merely a fixed unknown number.

## P1: Open with a Multinomial review

A fair six-sided die is rolled five times, with exactly two 3s, two 5s, and one 6:

```text
P = 5!/(2!2!1!) × (1/6)^2(1/6)^2(1/6)
  = 30/7776
  ≈ 0.00386
```

The unused faces have zero counts and contribute `0!=1` and `(1/6)^0=1`. This closes the Multinomial topic before making a category probability itself uncertain.

## P2: A Robot Gripper Beta posterior

Let `X` be the gripper's per-attempt success probability. The prior is `Uniform(0,1)=Beta(1,1)`. Six successes and two failures update by Beta–Bernoulli conjugacy:

```text
X|data ~ Beta(1+6,1+2) = Beta(7,3)
```

For `Beta(a,b)`, the mean is `a/(a+b)`, and the mode for `a,b>1` is `(a-1)/(a+b-2)`:

```text
E[X] = 7/10 = 0.7
mode = 6/8 = 0.75
```

The frequentist estimate is also `0.75`; the posterior mean is pulled toward prior mean `0.5`. The PDF has one peak at `0.75` and a longer left tail. Identical observed rates from eight and eight thousand attempts have identical point estimates but very different certainty; Beta concentration `a+b` retains that distinction.

## P3: A general Beta prior, conjugacy, and Laplace smoothing

A delivery drone starts with `Beta(4,2)` and then records three successes and five failures:

```text
posterior = Beta(4+3,2+5) = Beta(7,7)
```

This posterior is symmetric with mean `1/2`. Relative to a uniform prior, `a-1` and `b-1` behave like imagined successes and failures, so `Beta(4,2)` represents three imagined successes and one imagined failure.

Laplace smoothing uses `Beta(2,2)`. After `s` successes in `n` trials, the posterior is `Beta(2+s,2+n-s)`, with mode

```text
(s+1)/(n+2)
```

Even when `s=0` or `s=n`, the estimate does not become exactly zero or one. This prevents a tiny sample from declaring an unseen outcome impossible.

## P4: Puppy Training posterior variance

A uniform prior plus three successes and one failure gives `Beta(4,2)`. Its variance is

```text
Var(X) = ab / [(a+b)^2(a+b+1)]
       = 4×2 / (6²×7)
       = 2/63 ≈ 0.0317
```

This measures uncertainty about the success probability itself, not the Bernoulli variance of the next puppy's outcome. More observations increase `a+b` and generally concentrate the posterior.

## P5: A Street Parking belief update

One open and nine full spots among ten IID observations update `Beta(1,1)` to

```text
X|data ~ Beta(2,10)
E[X] = 2/12 = 1/6
```

The observed rate is `1/10`, while the posterior mean is `1/6` because the prior contributes an imagined success and failure. The difference is small-sample prior shrinkage, not an arithmetic error.

## P6: A Medicine posterior and Beta CDF

Seven desired outcomes among nine patients, starting from a uniform prior, give

```text
p|data ~ Beta(8,3)
```

The posterior probability that the true effect rate exceeds `0.6` is a right-tail integral, not a comparison of the mean with `0.6`:

```text
P(p>0.6|data) = 1-F_Beta(0.6;8,3)
```

In code, use `1 - stats.beta.cdf(0.6, 8, 3)`. P6 is a pset4 item omitted from the public answer key; the posterior and CDF expression follow only from the worksheet.

## P7: Thompson Sampling explores uncertainty

Drug A has six successes and two failures; Drug B has one success and one failure. Both began uniform:

```text
pA ~ Beta(7,3),  E[pA]=0.7
pB ~ Beta(2,2),  E[pB]=0.5
```

One Thompson-sampling round draws one plausible success rate from each posterior, chooses the drug with the larger draw, observes the outcome, and increments that drug's success or failure parameter. A has the higher mean, but B has little data and a wider posterior, so it occasionally draws a high value and is selected. This exploits current evidence while exploring an uncertain option that may be better.

P7 is also omitted from the public pset4 key. The worksheet and guide support this algorithm and interpretation, but a random draw means there is no unique next-drug answer.

## Challenge: Two foundational Beta facts

The Beta PDF is

```text
f(x)=x^(a-1)(1-x)^(b-1)/B(a,b),  0≤x≤1
```

At `a=b=1`, the numerator is one and `B(1,1)=∫[0,1]1dx=1`, giving constant density one on `[0,1]`: exactly `Uniform(0,1)`.

If the coin's head probability `X~Beta(a,b)`, the predictive probability of heads uses total probability:

```text
P(heads)=∫[0,1]P(heads|X=x)f(x)dx
        =∫[0,1]x f(x)dx
        =E[X]=a/(a+b)
```

The posterior mean is not merely descriptive; it is the next Bernoulli outcome's predictive probability and a natural point prediction under squared error.

## How to use the LLM Learning Guide

The six concepts are probability as a random variable, continuous-parameter Bayes, uniform-plus-data yielding Beta, Beta shapes and moments, conjugacy and Laplace smoothing, and CDF decisions with Thompson sampling. Write `a,b` as prior counts plus observed counts, then distinguish mean, mode, variance, and tail probability as answers to different questions. For a decision, explain how posterior uncertainty affects selection rather than comparing means alone.

## Material boundaries

- This guide covers P1–P7, the optional challenge, and all six LLM-guide concepts; numbering is complete.
- P6 and P7 are pset4 items deliberately omitted from the public answer key; this article derives only what the public worksheet and guide support.
- The guide's third page only continues the wrap-up and closing note, not another concept.
- The Canvas recording is inaccessible. The worksheet and substantive guide content are two pages each, so the short-material exception applies; the article remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 14: Beta](https://web.stanford.edu/class/cs109/lectures/14-Beta)
- [Lecture 14 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture14-Worksheet.pdf)
- [Lecture 14 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture14-AnswerKey.pdf)
- [Lecture 14 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture14-LLMPrompts.pdf)
- [Probability for Computer Science: Beta](https://probabilitycoders.stanford.edu/spr26/beta)
