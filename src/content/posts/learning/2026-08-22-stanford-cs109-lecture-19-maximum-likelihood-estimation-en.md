---
title: "Stanford CS109 Lecture 19 | Maximum Likelihood Estimation: Hold data fixed and optimize the parameter"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs109, probability, stanford, statistics]
lang: en
series:
  name: "Reading Stanford CS109"
  order: 20
tldr: "MLE fixes observed data and optimizes parameters; log-likelihood turns products into sums, but a maximum can also lie on a boundary."
description: "A problem-by-problem guide to Stanford CS109 Summer 2026 Lecture 19: likelihood, MLE, boundary solutions, gradient ascent, and Bayesian estimation."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation)

This is article 20 in [Reading Stanford CS109](/series/stanford-cs109), covering **Summer 2026 Lecture 19** (Jul 23). The schedule calls it **MLE**, while the lecture page uses **Maximum Likelihood Estimation**; Chris Gregg is the instructor. This guide follows the current [worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture19-Worksheet.pdf), [answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture19-AnswerKey.pdf), [LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture19-LLMPrompts.pdf), and course reader.

The lecture remains **L2**. Its three-page worksheet has P1–P6 plus an optional challenge. The two-page public key deliberately omits P5 and the challenge because they are pset6 problems. The three-page guide has six concepts; its last page only continues Concept 6 and the wrap-up. Current slides are unavailable and video is Canvas-gated, so this article stays within public artifacts.

## P1: Connect entropy to parameter learning

For a uniform distribution over four values:

```text
H(X) = -4(1/4)log₂(1/4) = 2 bits
```

An even yes/no split leaves two equiprobable values under either answer. Expected remaining entropy is 1 bit, hence information gain is also 1 bit. The review connects information to estimation: data is valuable when it narrows the plausible models.

## P2: MLE for a Geometric

`X ~ Geo(p)` counts deploy attempts through the first success. The data `[2,1,4,1,2]` sums to 10. The i.i.d. assumption gives:

```text
L(p) = ∏ᵢ(1-p)^(xᵢ-1)p = p⁵(1-p)⁵
LL(p) = 5ln p + 5ln(1-p)

dLL/dp = n/p - (Σxᵢ-n)/(1-p) = 0
p̂ = n/Σxᵢ = 1/x̄
```

Thus `p̂=5/10=0.5`. Every deploy ends in exactly one success, making this total successes divided by total attempts.

## P3: MLE for an Exponential

Assume API request gaps follow `X ~ Exp(λ)`. The gaps `[0.8,1.4,0.2,0.6]` hours sum to 3:

```text
L(λ) = λⁿe^(-λΣxᵢ)
LL(λ) = nln λ - λΣxᵢ
λ̂ = n/Σxᵢ = 1/x̄ = 4/3 ≈ 1.33 requests/hour
```

`λ` is a rate and the sample mean is an average gap, so they are reciprocals. Shorter mean gaps should imply a higher estimated arrival rate.

## P4: Calculus misses a boundary maximum

Samples `[1.2,3.7,2.1]` come from `Uni(0,β)`. The likelihood must include its support:

```text
L(β) = β⁻³  if β ≥ maxᵢxᵢ = 3.7
     = 0    otherwise
```

Within the feasible region, the derivative of `LL(β)=-3ln β` is always negative. There is no interior critical point; likelihood decreases from the left boundary, so `β̂=maxᵢxᵢ=3.7`. It cannot overestimate the true endpoint, and continuous samples are almost surely below `β`, giving downward bias. “Differentiate and set to zero” finds only interior stationary points; parameter-dependent support requires checking boundaries.

## P5: Rayleigh scale for a wind farm

The worksheet parameterizes the density as:

```text
f(w|θ) = (w/θ)exp(-w²/(2θ)), w ≥ 0
LL(θ) = constant - Nln θ - Σᵢwᵢ²/(2θ)
θ̂ = Σᵢwᵢ²/(2N)
```

The ten wind speeds give `θ̂=18.915`. P5 is labeled `pset6: mle_wind`, and the public key says only “Problem set problem.” This derivation follows the public prompt, not a hidden key solution.

## P6: A point estimate versus a belief distribution

Six successes among nine users give `p̂=6/9=2/3≈0.667`. Updating the Laplace prior `Beta(2,2)` gives:

```text
p | data ~ Beta(8,5)
posterior mean = 8/13 ≈ 0.615
```

MLE is the point maximizing observed-data likelihood; a posterior is a full belief distribution over the parameter. With little data, the prior pulls its mean toward `1/2`. At 600 successes out of 900, MLE is about `0.667` and the posterior mean is `602/904≈0.666`; four pseudo-observations matter little.

## Optional challenge: Negative Binomial

Each `X` counts experiments through `r=5` successes. For 100 samples:

```text
L(p) ∝ p^(nr)(1-p)^(Σxᵢ-nr)
p̂ = nr/Σxᵢ
```

The supplied observations sum to `1450`, so `p̂=500/1450=10/29≈0.345`. Each observation contains five successes, making this total successes divided by total trials. The challenge is another pset6 problem omitted from the public key.

## Guide unit: Parametric models and likelihood

Bernoulli has `θ=p`, Poisson and Exponential use `θ=λ`, and Normal has `θ=(μ,σ²)`. Fixing `θ` selects one distribution from a model family. For i.i.d. data:

```text
L(θ) = ∏ᵢf(xᵢ|θ)
```

Independence justifies the product; identical distribution gives each factor the same model and parameter. `L(θ)` fixes data and varies `θ`; it is not automatically a normalized distribution over parameters.

## Guide unit: Logs, argmax, and gradient ascent

Because `log` is strictly increasing, `argmaxθ L(θ)=argmaxθ log L(θ)`. It turns products into sums, simplifies differentiation, and avoids numerical underflow. `argmax` returns a maximizing parameter, not the maximum function value.

When a derivative has no closed-form root:

```text
initialize θ
repeat:
    θ ← θ + η∇LL(θ)
```

A large step size can overshoot or diverge; a tiny one converges slowly. A non-concave objective may lead to a local maximum. P4 is different: its maximum lies on a support boundary.

## How to use the LLM Learning Guide

Follow its six concepts: parametric models, likelihood, log-likelihood and argmax, classic MLEs, boundaries and gradient ascent, then MLE versus Bayesian estimation. Attempt each Test me prompt first. Ask the model to identify the first wrong step and justify the i.i.d. product.

For the wrap-up, request one problem chaining model and `θ` identification, likelihood and log-likelihood, a complete MLE derivation, and a boundary or numerical-optimization case. Seeing the solution first practices reading, not modeling.

## Material boundaries

- The worksheet has three pages with P1–P6 plus an optional challenge; the two-page key omits both pset6 solutions.
- The guide has six concepts across three pages; page three adds no seventh concept.
- Current slides are unavailable and video is Canvas-gated; this article does not reconstruct inaccessible content.

## References

- [Stanford CS109 Summer 2026 schedule](https://web.stanford.edu/class/cs109/schedule.html)
- [Lecture 19 page](https://web.stanford.edu/class/cs109/lectures/19-MaximumLikelihoodEstimation)
- [Lecture 19 worksheet](https://web.stanford.edu/class/cs109/worksheets/Lecture19-Worksheet.pdf)
- [Lecture 19 answer key](https://web.stanford.edu/class/cs109/worksheets/Lecture19-AnswerKey.pdf)
- [Lecture 19 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture19-LLMPrompts.pdf)
- [Probability for Computer Science reader](https://probabilitycoders.stanford.edu/spr26)
