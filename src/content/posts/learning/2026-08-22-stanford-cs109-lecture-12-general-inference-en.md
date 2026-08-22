---
title: "Stanford CS109 Lecture 12 | General Inference: Bayesian networks, sampling, and rare evidence"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 13
tldr: "A Bayesian network factorizes a huge joint through conditional independence; ancestral sampling generates joint samples, and rejection sampling filters them into a conditional."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 12: Bayesian networks, factorization, conditional independence, ancestral sampling, rejection sampling, and MCMC."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-12-general-inference)

This is article 13 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 12: General Inference** on July 9 with Chris Gregg. Its Summer agenda follows the [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture12-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture12-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture12-LLMPrompts.pdf), and the shared Spring-dated reader's [computational inference](https://probabilitycoders.stanford.edu/spr26/computational_inference) chapter. The Canvas recording is inaccessible, so spoken material is not reconstructed.

The canonical Summer worksheet is a complete two-page P1–P6 plus challenge. The PDF also contains an unnumbered **1-D Tracking** page with no lecture header and no counterpart in the answer key or LLM guide. This article covers it as an orphan supplemental artifact rather than inventing a P7.

## P1: One more Bayes update

The spam prior is `0.3`. A spam message contains `free` with probability `0.6`, versus `0.1` for not-spam:

```text
P(Spam|free)
= 0.6(0.3) / [0.6(0.3)+0.1(0.7)]
= 0.18/0.25 = 0.72
```

This continues the prior-times-likelihood update. What changes next is scale: an exact joint dictionary becomes too large, motivating structured factorization and sampling.

## P2: A Bayesian network factors the joint

The three binary-variable network has `Flu→Fever` and `Flu→Tired`, so

```text
P(Flu,Fever,Tired)
= P(Flu)P(Fever|Flu)P(Tired|Flu)
```

For `Flu=1, Fever=1, Tired=0`,

```text
0.2 × 0.9 × (1-0.8) = 0.036
```

Three binary variables require `2³=8` full-joint rows; `n` require `2^n`. A Bayesian network stores a conditional table for each node given its parents. When parent sets remain small, that representation is far smaller than enumerating every assignment.

## P3: Conditional is not marginal independence

The network asserts

```text
Fever ⟂ Tired | Flu
```

Once Flu status is known, tiredness adds no fever information, and `P(Fever=0|Flu=1)=0.1`.

Without conditioning on Flu, however, Fever and Tired are dependent. Tiredness is evidence for Flu, which raises the fever probability, so `P(Fever=1|Tired=1)≠P(Fever=1)`. Effects of a common cause may be marginally dependent while becoming independent when the cause is fixed.

## P4: Ancestral sampling is a generative story

Generate one joint sample in parent-before-child order:

1. Draw `Flu~Bern(0.2)`.
2. Given that Flu value, draw Fever from its conditional Bernoulli.
3. Given the same Flu value, draw Tired from its conditional Bernoulli.
4. Return `(Flu,Fever,Tired)`.

This is ancestral sampling. The probability of each program path is the product of the same factors in the joint, so the long-run frequency of an assignment approaches its joint probability. A correct joint sampler is therefore a procedural definition of the joint distribution.

## P5: Rejection sampling for conditional inference

To estimate `P(Flu=1|Fever=1)`, repeatedly draw full ancestral samples, discard every sample with `Fever≠1`, and compute the fraction of retained samples with `Flu=1`. Restricting to the evidence subpopulation makes that retained frequency converge to the conditional probability.

The exact Bayes check is

```text
P(Fever=1)
= 0.9(0.2)+0.05(0.8)
= 0.22

P(Flu=1|Fever=1) = 0.18/0.22 ≈ 0.818
```

The estimate should approach `0.818` as retained samples grow. The keep rule must use only evidence; filtering on the query would bake the desired answer into the sample.

## P6: Rejection sampling on a larger WebMD network

The ten Bernoulli variables include risk factors, diseases, and symptoms. Generate one joint sample by drawing root variables first, then children in topological order. Each node's Bernoulli probability is selected from its conditional table using already sampled parent values.

The evidence is `{fever=1,tick=1,cough=0}`. Retain only joint samples matching all three values. Among retained samples, separately compute the fractions with `Lyme=1` and `Flu=1`. The posteriors need not sum to one because Lyme and Flu are not mutually exclusive alternatives; a sample may contain both or neither.

P6 is a pset4 item deliberately omitted from the public answer key. This article uses only the public prompt's sampling order, keep rule, and estimators; it does not invent missing conditional tables.

## Challenge: Rare evidence breaks rejection sampling

If evidence occurs in only one of every 10,000 joint samples, roughly 9,999 samples are discarded. A stable posterior estimate then requires generating an enormous stream. Efficiency worsens as evidence becomes rarer or more variables are observed.

Conceptually, MCMC holds observed variables fixed at their evidence values and repeatedly resamples unobserved variables. Its sample stream is already evidence-consistent, avoiding the mass rejection of naive forward sampling. The official material stops at this comparison and does not develop transition kernels or convergence proofs.

## Orphan supplemental artifact: 1-D Tracking

The worksheet PDF includes an extra self-driving-car LiDAR page without a Summer Lecture 12 header, problem number, answer-key entry, or guide concept. It defines true distance `T~N(1,3)`, noise `M~N(0,1.5)`, and measurement `X=t+M`.

Conditioned on fixed `T=t`, only noise remains random:

```text
X|T=t ~ N(t,1.5)
f(X=4|T=t)
= 1/√(3π) × exp[-(4-t)²/3]
```

Bayes multiplies this likelihood by the prior density:

```text
f(T=t|X=4)
= K × exp[-(4-t)²/3] × exp[-(t-1)²/6]
```

`K` absorbs constants independent of `t` and the posterior normalization. The page is useful continuous-Bayes practice, but its curricular status is unclear, so it is not counted as formal P7 or attributed to the live lecture.

## How to use the LLM Learning Guide

The guide's six concepts are joint-table scale, Bayesian-network factorization, conditional independence, generative/ancestral sampling, rejection sampling, and rare evidence with MCMC. Start from the DAG and write the product, then write the sampling order. For a conditional query, separate the evidence keep rule from the query fraction. Finally, use an exact small-network Bayes result to check whether simulation converges in the right direction.

## Material boundaries

- The formal agenda is complete P1–P6 plus challenge. One orphan 1-D Tracking page is covered separately rather than misnumbered.
- P6 is a pset4 item deliberately omitted from the public answer key; missing network parameters are not inferred.
- The Canvas recording is inaccessible, so no additional spoken examples or claims are inferred.
- The formal worksheet and guide are two pages each. The short-material exception applies; the article remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 12: General Inference](https://web.stanford.edu/class/cs109/lectures/12-GeneralInference)
- [Lecture 12 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture12-Worksheet.pdf)
- [Lecture 12 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture12-AnswerKey.pdf)
- [Lecture 12 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture12-LLMPrompts.pdf)
- [Probability for Computer Science: Computational inference](https://probabilitycoders.stanford.edu/spr26/computational_inference)
