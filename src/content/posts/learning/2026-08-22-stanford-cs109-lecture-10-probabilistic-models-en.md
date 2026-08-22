---
title: "Stanford CS109 Lecture 10 | Probabilistic Models: Joints, marginals, independence, and Bayes"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 11
tldr: "A joint distribution retains the full relationship among variables; marginals, conditionals, independence, and Bayes extract different answers from it."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 10: joint PMFs, marginals, conditioning, independence, and Bayes with continuous likelihoods."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-10-probabilistic-models)

This is article 11 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 10: Probabilistic Models** on July 7 with Chris Gregg. Its Summer agenda follows the [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture10-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture10-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture10-LLMPrompts.pdf), and shared Spring-dated reader chapters on [joint distributions](https://probabilitycoders.stanford.edu/spr26/joint) and [inference](https://probabilitycoders.stanford.edu/spr26/inference). The Canvas recording is inaccessible, so spoken material is not reconstructed.

The lecture expands from one random variable to how several variables move together. A joint distribution is the complete starting point. Summing out an unneeded variable produces a marginal; normalizing a row or column produces a conditional; independence asks whether the joint factors into a product of marginals.

## P1: Open with a Normal review

For an IQ-like score `X~N(100,225)`, the second parameter is variance, so `σ=15`. The z-score of 130 is two:

```text
P(X>130) = 1-Φ((130-100)/15)
         = 1-Φ(2)
         = 1-0.9772 = 0.0228
```

This preserves the previous lecture's distinction among `σ²`, `σ`, and a right-tail complement before introducing two-variable models.

## P2: Read a joint PMF

Let `X` be relationship status—single (`S`) or in a relationship (`R`)—and `Y` be class year: freshman (`Fr`), sophomore (`So`), or junior (`Jr`). The official table is:

| `P(X,Y)` | Fr | So | Jr |
|---|---:|---:|---:|
| S | 0.18 | 0.12 | 0.10 |
| R | 0.12 | 0.18 | 0.30 |

All six cells are nonnegative and sum to `1.00`, making this a valid joint PMF. Read joint probabilities directly: `P(R,Jr)=0.30` and `P(S,Fr)=0.18`. The junior probability sums its column: `P(Y=Jr)=0.10+0.30=0.40`.

## P3: Sum a joint into marginals

Fix each value of `X` and sum across every possible `Y`:

```text
P(X=S) = 0.18+0.12+0.10 = 0.40
P(X=R) = 0.12+0.18+0.30 = 0.60
```

Similarly, summing over relationship status gives

```text
P(Y=Fr)=0.30,  P(Y=So)=0.30,  P(Y=Jr)=0.40
```

In general, `P(X=x)=Σy P(X=x,Y=y)`. The possible values of `Y` are mutually exclusive and exhaustive, so this is the law of total probability. The word “marginal” comes from writing these sums in the table's margins.

## P4: Conditioning and independence

Given that someone is a junior, the conditional probability of status `R` is

```text
P(X=R | Y=Jr) = P(R,Jr)/P(Y=Jr)
               = 0.30/0.40 = 0.75
```

The denominator renormalizes the junior column to sum to one. The table cell `0.30` is a joint probability; `0.75` is the proportion within the restricted junior sample space.

Independence would require `P(x,y)=P(x)P(y)` for every cell. One counterexample disproves it:

```text
P(S,Fr)=0.18
P(S)P(Fr)=0.40×0.30=0.12
```

Therefore `X` and `Y` are dependent. One matching cell cannot prove full independence; proving it requires every value pair or an equivalent structural argument.

## P5: Bayes with a discrete hidden variable and continuous likelihood

Let `Y=1` mean a baby can hear, with prior `P(Y=1)=0.75`. Gaze change after a sound follows

```text
X | Y=1 ~ N(15,25)
X | Y=0 ~ N(8,25)
```

After observing `X=14`, Bayes uses conditional densities as likelihoods even though a continuous variable assigns zero probability to an exact point:

```text
P(Y=1 | X=14)
= f(14|Y=1)P(Y=1)
  / [f(14|Y=1)P(Y=1)+f(14|Y=0)P(Y=0)]
```

Both Normals have `σ=5`, so the shared `1/(σ√(2π))` cancels. Using only the exponential parts,

```text
f(14|Y=1) ∝ e^-0.02 ≈ 0.9802
f(14|Y=0) ∝ e^-0.72 ≈ 0.4868

posterior ≈ 0.75(0.9802)
          / [0.75(0.9802)+0.25(0.4868)]
          ≈ 0.858
```

Fourteen is closer to 15 than to 8, so the observation raises belief in hearing from `0.75` to about `0.858`. A density serves as relative likelihood; the normalized posterior is the probability.

## P6: Why a full joint table does not scale

Twenty random variables with five values each require one cell per complete assignment:

```text
5^20 = 95,367,431,640,625 cells
```

This exponential growth motivates independence assumptions and Bayes networks. Rather than store every joint cell, a structured model factorizes the distribution into smaller local pieces. P6 is a pset4 item deliberately omitted from the public answer key; the count follows directly from the prompt.

## Challenge: A Tired Baby with Exponential likelihoods

The prior is `P(Tired)=3/4`. Eye-rub time follows `Exp(3)` when tired and `Exp(1)` otherwise. Observing a rub at two minutes and using `f(t)=λe^-λt` gives

```text
f(2|Tired) = 3e^-6
f(2|not Tired) = e^-2

P(Tired|t=2)
= (3/4)(3e^-6)
  / [(3/4)(3e^-6)+(1/4)e^-2]
≈ 0.142
```

The posterior falls from `0.75` to about `0.142`. `Exp(3)` has mean wait `1/3` minute, versus one minute for `Exp(1)`, so a two-minute wait is relatively more plausible when not tired. The challenge is also hidden from the public pset key. PDF extraction renders the prior fraction `3/4` as `34`; the original page clearly displays a fraction.

## How to use the LLM Learning Guide

The guide orders joint PMFs, marginals, conditioning within a joint, independence, random-variable Bayes, and a discrete hypothesis with continuous density. Reuse one table to ask four questions: which cell is the joint, which sum is the marginal, which marginal normalizes the conditional, and whether the joint equals the product of marginals. With a continuous observation, only the likelihood changes from a PMF to a density; prior multiplication and normalization remain unchanged.

## Material boundaries

- This guide covers official P1–P6, the optional tired-baby challenge, and all six LLM-guide concepts.
- P6 and the challenge are pset4 items deliberately omitted from the public answer key; this article derives them only from the public prompts.
- The challenge prior is `3/4`; `34` is a PDF fraction-extraction artifact.
- The Canvas recording is inaccessible. The worksheet and guide are two pages each, so the short-material exception applies; the article remains `draft: true` pending independent review.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 10: Probabilistic Models](https://web.stanford.edu/class/cs109/lectures/10-ProbabilisticModels)
- [Lecture 10 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture10-Worksheet.pdf)
- [Lecture 10 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture10-AnswerKey.pdf)
- [Lecture 10 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture10-LLMPrompts.pdf)
- [Probability for Computer Science: Joint distributions](https://probabilitycoders.stanford.edu/spr26/joint)
- [Probability for Computer Science: Inference](https://probabilitycoders.stanford.edu/spr26/inference)
- [Probability for Computer Science: Bayesian carbon dating](https://probabilitycoders.stanford.edu/spr26/bayesian_carbon_dating)
