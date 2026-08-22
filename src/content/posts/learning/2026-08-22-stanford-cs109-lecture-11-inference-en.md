---
title: "Stanford CS109 Lecture 11 | Inference: Prior times likelihood, then normalize"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 12
tldr: "Inference multiplies each hidden-variable prior by an observation likelihood and normalizes; the same loop handles repeated evidence and discretized continuous beliefs."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 11: belief tables, Bayes updates, normalization, repeated observations, discretization, and indicator likelihoods."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-11-inference)

This is article 12 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 11: Inference** on July 8 with Chris Gregg. Its Summer agenda follows the [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture11-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture11-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture11-LLMPrompts.pdf), and the shared Spring-dated reader's [inference](https://probabilitycoders.stanford.edu/spr26/inference) chapter. The Canvas recording is inaccessible, so spoken material is not reconstructed.

The original worksheet is two pages with complete numbering: P1–P2 appear on page one, and P3–P6 plus the challenge appear on page two. The central move is not a new Bayes formula but an executable data structure and update loop:

```text
posterior[h] = prior[h] × likelihood(observation | h)
normalize(posterior)
```

## P1: One Bayes update

A bag is equally likely to contain a Fair or Trick coin, whose head probabilities are `0.5` and `0.9`. After one head,

```text
P(Trick | heads)
= P(heads|Trick)P(Trick)
  / [P(heads|Trick)P(Trick)+P(heads|Fair)P(Fair)]
= 0.9(0.5) / [0.9(0.5)+0.5(0.5)]
= 0.45/0.70 ≈ 0.643
```

A head is more likely under the Trick model, so the posterior rises above the `0.5` prior. Inference reallocates belief according to how compatible the observation is with each hidden state.

## P2: A belief dictionary and update loop

The Stanford Acuity Test discretizes vision ability `A` into three candidates:

| `a` | 0.2 | 0.5 | 0.9 |
|---|---:|---:|---:|
| `P(A=a)` | 0.2 | 0.3 | 0.5 |

The probability of reading a letter correctly equals `a`, so after a wrong answer `Y=0`, the likelihood is `1-a`. Multiplying each entry gives

```text
a=0.2: 0.2×0.8 = 0.16
a=0.5: 0.3×0.5 = 0.15
a=0.9: 0.5×0.1 = 0.05
```

Their sum, `0.36`, is the evidence probability `P(Y=0)` and the Bayes denominator. Dividing each entry by it yields

```text
P(A=0.2|Y=0) ≈ 0.444
P(A=0.5|Y=0) ≈ 0.417
P(A=0.9|Y=0) ≈ 0.139
```

A mistake is easier to generate at low ability, so belief shifts downward. This dictionary is non-parametric: it stores mass for candidate values without forcing the posterior into a named distribution family.

## P3: Two routes for multiple observations

The next, larger letter is read correctly, giving likelihood `a`. Use the P2 posterior as the next prior:

```text
0.444×0.2 = 0.0889
0.417×0.5 = 0.2083
0.139×0.9 = 0.1250
sum ≈ 0.4222

posterior ≈ {0.211, 0.493, 0.296}
```

Alternatively, multiply the original prior by both likelihoods at once:

```text
0.2(0.8)(0.2)=0.032
0.3(0.5)(0.5)=0.075
0.5(0.1)(0.9)=0.045
```

The sum is `0.152`, and normalization again produces `{0.211,0.493,0.296}`. Under conditional independence of observations given ability, sequential updating and one product of likelihoods are equivalent. Intermediate normalization is merely a shared constant.

## P4: Why normalize?

The normalization constant is the total probability of the observation:

```text
P(obs) = Σa P(A=a)P(obs|a)
```

It sums out hidden value `a`, so it is the same positive number for every candidate. Dividing by it makes the posterior sum to one and therefore a probability distribution.

If only the mode or `argmax_a P(A=a|obs)` is needed, normalization may be skipped because a shared positive divisor cannot change rankings. Reporting probabilities, sampling, or computing expectations still requires normalization.

## P5: Discretize a continuous belief

In Bayesian carbon dating, sample age `A` is continuous, but code uses integer ages from 100 through 10,000 as dictionary keys. Each entry approximates `P(A=i|observation)`. A fine enough grid approximates the continuous belief while retaining the same multiply-and-normalize loop.

`calc_likelihood(m, age)` represents `P(M=m|A=age)`: the probability of observing `m` remaining C14 molecules if the sample truly has that age, computed from radioactive decay. A likelihood scores candidate ages through the generative model; it is not itself `P(age|m)`.

## P6: A full Mutation Clock posterior

Mitochondrial DNA has 10,000 base pairs, each mutating at annual rate `r=6.67×10^-6`. At age `t`, the probability one position has mutated at least once follows from a Poisson zero-event complement:

```text
p(t) = 1-P(Poi(rt)=0) = 1-e^(-rt)
```

With independent positions and exactly ten observed mutations,

```text
P(X=10|T=t)
= C(10000,10) p(t)^10 [1-p(t)]^9990
```

The prior is uniform on integer `t∈{0,...,200}`. The combination constant and uniform prior cancel during normalization:

```text
P(T=150|X=10)
= L(150) / Σ(t=0..200)L(t)

L(t)=p(t)^10[1-p(t)]^9990
```

The official prompt gives a quick check of about `0.011`, with the mode at `t=150`. P6 is a pset4 item deliberately omitted from the public answer key; these expressions are built only from the public prompt.

## Challenge: The Baby That Won't Arrive

Delivery day `D` has a prior PMF around day zero. Today is day `-17`, and no baby has arrived. A true delivery day `d≤-17` makes this observation impossible, whereas `d>-17` is fully compatible:

```text
P(no baby yet at -17 | D=d) = 1[d>-17]
```

Multiply the prior by this indicator and normalize. Every `d≤-17` receives zero posterior mass. Surviving days retain their relative prior weights, but each rises after division by the remaining total mass. Negative information is still information: it eliminates hidden states and redistributes their probability.

## How to use the LLM Learning Guide

The guide's six concepts are belief updating, the belief-table loop, normalization, multiple observations, continuous-variable discretization, and reading likelihoods from models. For each exercise, label the hidden and observed variables first, then choose an indicator, PMF, or PDF likelihood. After multiplication, branch explicitly: stop at unnormalized values when only the mode is required, or verify a sum of one when a posterior distribution is required.

## Material boundaries

- This guide covers official P1–P6, the optional due-date challenge, and all six LLM-guide concepts; page-boundary numbering is complete.
- P6 is a pset4 item deliberately omitted from the public answer key; this article derives only its likelihood and posterior from the public prompt.
- The Canvas recording is inaccessible, so no additional spoken examples or claims are inferred.
- The worksheet and guide are two pages each. The short-material exception applies; the article remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 11: Inference](https://web.stanford.edu/class/cs109/lectures/11-Inference)
- [Lecture 11 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture11-Worksheet.pdf)
- [Lecture 11 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture11-AnswerKey.pdf)
- [Lecture 11 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture11-LLMPrompts.pdf)
- [Probability for Computer Science: Inference](https://probabilitycoders.stanford.edu/spr26/inference)
- [Probability for Computer Science: Bayesian carbon dating](https://probabilitycoders.stanford.edu/spr26/bayesian_carbon_dating)
- [Probability for Computer Science: Baby delivery](https://probabilitycoders.stanford.edu/spr26/prob_baby_delivery)
