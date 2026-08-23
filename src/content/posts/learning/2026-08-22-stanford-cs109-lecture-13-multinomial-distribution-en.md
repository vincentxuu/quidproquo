---
title: "Stanford CS109 Lecture 13 | Multinomial: Category counts, bag of words, and log probability"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 14
tldr: "The Multinomial extends two-category Binomial counts to many categories; the same PMF models documents as word counts for Bayesian authorship with log-scores."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 13: multinomial coefficients, joint PMFs, binomial marginals, bag of words, Bayes, and log probabilities."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-13-multinomial-distribution)

This is article 14 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 13: Multinomial** on July 14 with Chris Gregg. Its Summer agenda follows the [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture13-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture13-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture13-LLMPrompts.pdf), and shared Spring-dated reader chapters on the [Multinomial](https://probabilitycoders.stanford.edu/spr26/multinomial) and [Federalist Papers](https://probabilitycoders.stanford.edu/spr26/federalist). The Canvas recording is inaccessible, so spoken material is not reconstructed.

The worksheet and answer key are both complete two-page P1–P6 plus challenge artifacts. The LLM guide displays a third page, but it contains only a carried-over closing sentence and page number—not a seventh concept or additional agenda item.

## P1: Review inference with a two-node network

The network is `Overloaded→Slow`, with `P(Overloaded=1)=0.1`, `P(Slow=1|Overloaded=1)=0.95`, and `P(Slow=1|Overloaded=0)=0.2`. Thus

```text
P(Overloaded=1,Slow=0)=0.1×0.05=0.005
```

The Slow marginal is `0.95(0.1)+0.2(0.9)=0.275`, giving

```text
P(Overloaded=1|Slow=1)
= 0.095/0.275 = 19/55 ≈ 0.345
```

Rejection sampling would retain only `Slow=1` joint samples and report the fraction with `Overloaded=1`. This reconnects factorization, Bayes, and sampling in one small model.

## P2: Count orderings with repeated types

A 12-position DNA fragment has four A, three C, two G, and three T nucleotides. Starting from `12!`, swaps among identical bases do not create new sequences, so

```text
C(12;4,3,2,3)
= 12!/(4!3!2!3!)
= 277,200
```

When each position independently chooses among four bases uniformly, one specific sequence has probability `(1/4)^12`. Summing all mutually exclusive sequences with the target counts gives

```text
P(counts 4,3,2,3)
= 277,200(1/4)^12
≈ 0.0165
```

This exposes the Multinomial PMF's structure: the probability of one ordering times the number of orderings with the same counts.

## P3: A Load Balancing joint PMF

Ten requests independently route to three data centers with probabilities `0.5`, `0.3`, and `0.2`. For counts `(X1,X2,X3)`,

```text
(X1,X2,X3) ~ Multinomial(10;0.5,0.3,0.2)

P(X1=c1,X2=c2,X3=c3)
= 10!/(c1!c2!c3!) × 0.5^c1 0.3^c2 0.2^c3
```

The PMF applies to nonnegative counts satisfying `c1+c2+c3=10`. For `(5,3,2)`,

```text
10!/(5!3!2!) × 0.5^5 0.3^3 0.2^2
≈ 0.0851
```

A Multinomial requires a fixed number of independent trials, exactly one category per trial, and unchanged category probabilities. Drawing cards without replacement violates both independence and constant probabilities.

## P4: Loot Boxes and a Binomial marginal

Eight loot boxes have common, rare, and legendary probabilities `0.6`, `0.3`, and `0.1`. Exactly `(4,3,1)` occurs with probability

```text
8!/(4!3!1!) × 0.6^4 0.3^3 0.1
≈ 0.0980
```

Looking only at the legendary count recolors categories into “legendary” and “everything else”:

```text
Xlegendary ~ Bin(8,0.1)
P(Xlegendary=1)=C(8,1)0.1(0.9)^7≈0.383
```

Generally, each `Xi~Bin(n,pi)`. Different category counts are not independent because they must sum to fixed `n`; an extra outcome in one category reduces the total available to others.

## P5: A large Midterm Rooms expression

Three hundred students independently enter rooms with probabilities `0.3`, `0.2`, and `0.5`. Exactly `(90,60,150)` has probability

```text
300!/(90!60!150!) × 0.3^90 0.2^60 0.5^150
```

The worksheet permits an unevaluated expression; the key gives approximately `0.00306`. Direct factorials and tiny powers risk overflow and underflow, foreshadowing P6's log computation.

## P6: Bag-of-words authorship inference

An anonymous pamphlet has counts `upon:2`, `whilst:1`, and `commerce:3`, with equal priors on authors H and M. Under bag of words,

```text
P(H|doc) ∝ P(H) × ∏i P(word_i|H)^n_i
```

The Multinomial coefficient depends only on document counts, so it is identical for H and M and cancels. Unshown words with identical probabilities under both authors also contribute only shared factors.

Multiplying thousands of tiny values underflows to floating-point zero. Logs use `log(ab)=log a+log b` and `log(a^n)=n log a`, turning a product into a stable sum. Since log is increasing, the ranking is unchanged:

```text
H: 2ln(0.005)+ln(0.0001)+3ln(0.002) ≈ -38.45
M: 2ln(0.0005)+ln(0.001)+3ln(0.003) ≈ -39.54
```

H has the larger, less negative log-score. Their difference is about `1.09`, so the likelihood ratio is `e^1.09≈3`: H is roughly three times as likely as M.

## Challenge: The Multinomial contains the Binomial

With `r=2`, set `X1=k`, `X2=n-k`, and `p2=1-p1`:

```text
P(X1=k,X2=n-k)
= n!/[k!(n-k)!] × p1^k(1-p1)^(n-k)
= C(n,k)p1^k(1-p1)^(n-k)
```

This is exactly the `Bin(n,p1)` PMF. For general `r`, recolor each trial as “type i” or “anything else.” The success probability becomes `pi`, proving directly that `Xi~Bin(n,pi)` without summing over all other category counts.

## How to use the LLM Learning Guide

The six guide concepts are the Multinomial coefficient, joint PMF, applicability assumptions, Binomial marginals, bag-of-words authorship, and log probabilities. First verify that counts and category probabilities each sum correctly, then write “number of orderings × probability of one ordering” on separate lines. For text, cancel author-independent factors before moving into log space to compare scores.

## Material boundaries

- This guide covers formal P1–P6, the optional challenge, and all six LLM-guide concepts; no problem is missing across pages.
- The guide's third page contains only closing text and a page number, not another concept.
- The Canvas recording is inaccessible, so no additional spoken examples or claims are inferred.
- The worksheet and substantive guide content are two pages each. The short-material exception applies; the article remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 13: Multinomial](https://web.stanford.edu/class/cs109/lectures/13-Multinomial)
- [Lecture 13 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture13-Worksheet.pdf)
- [Lecture 13 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture13-AnswerKey.pdf)
- [Lecture 13 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture13-LLMPrompts.pdf)
- [Probability for Computer Science: Multinomial](https://probabilitycoders.stanford.edu/spr26/multinomial)
- [Probability for Computer Science: Federalist Papers](https://probabilitycoders.stanford.edu/spr26/federalist)
