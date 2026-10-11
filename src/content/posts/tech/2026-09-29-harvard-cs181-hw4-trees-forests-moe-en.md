---
title: "Harvard CS181 HW4 (Part 3): Decision Trees, Random Forests, and Mixture of Experts"
date: 2026-09-29
category: tech
tags: [harvard, cs181, decision-trees, ensemble, mixture-of-experts, homework]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 8
type: guide
tldr: "HW4 Problem 3 quantifies why voting trees get more accurate in three steps: with p=0.6 the Hoeffding bound needs B≈691 independent trees to reach 10⁻⁶; correlation ρ between trees floors ensemble variance at ρσ²; and random forests' dense ensembling is compared with MoE's sparse routing."
description: "A problem-by-problem guide to Harvard CS1810 Spring 2026 HW4 Problem 3: the Hoeffding error bound for majority-vote ensembles, the correlated-ensemble variance formula ρσ² + (1−ρ)σ²/B, the m=⌊√d⌋ feature-subsampling tradeoff, and how random forests and Mixture of Experts trade capacity against compute."
draft: false
glossary:
  - term: "Hoeffding's inequality"
    definition: "A concentration inequality: the probability that the average of independent bounded random variables deviates from its expectation by more than t shrinks exponentially in the number of samples."
    context: "HW4 Problem 3 uses it to bound the error rate of a majority-vote ensemble."
  - term: "random forest"
    definition: "Bagged decision trees where each split only considers m randomly chosen features, in order to decorrelate the trees."
    context: "Section 6's rule of thumb is m≈√d for classification and m≈d/3 for regression."
---

> 🌏 [中文版](/posts/tech/2026-09-29-harvard-cs181-hw4-trees-forests-moe)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> ⚠️ **Version and access**: Based on `hw4_release.tex` from [CS1810 Spring 2026 HW4](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw4) and §3 of the [Section 6 notes](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf), opened on 2026-09-29. The course is **A3** overall, with no public recording links listed for the corresponding lectures and no homework solutions. I did not get the Week 7 Non-parametric Models / Decision Trees lecture slides. Problem 3 is pen-and-paper only, with no notebook code; its header gives no total, and the marked sub-parts add up to 35 points.

This is post 8 of the [Harvard CS181 weekly guide](/posts/tech/2026-08-27-harvard-cs181-overview-en) and the last problem in HW4. The previous two posts covered [Transformers](/posts/tech/2026-09-29-harvard-cs181-hw4-transformer-en) and [autoencoders to VAEs](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae-en).

## Course video sources

Checked the official CS1810 Spring 2026 schedule and syllabus. This guide uses homework, section, or exam materials; the corresponding entries do not list a public lecture video. Slides and section materials are provided. No public listing does not mean that a recording never existed.

Official sources:

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

Checked on 2026-10-10.

## First: this problem doesn't test growing a tree

The [HW4 handout](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex) says up front that no problem asks you to build a decision tree by hand, and points you to the last exercise in the Section 6 notes for review.

That exercise is in [Section 6](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf) §3.3: six days of a runner's habits with two features, Outlook and Humidity. You compute the overall entropy, compare information gain to pick the root, and draw the final tree. The [solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06_soln.pdf) have the answers. Do it before Problem 3, because Problem 3 assumes you already know why single trees are unstable. Section 6 §3.4 says small changes in data can produce a different tree, so in practice we use shallow trees for interpretability and ensembles for accuracy.

Problem 3 asks: **how far can ensembling push accuracy, what caps it, and how does it differ from the MoE inside LLMs?**

## 1. Independent trees voting: the Hoeffding bound (15 pts)

Setup: `B` independently trained binary classifiers, each correct with the same probability `p > ½` on a test point, predicting by majority vote. The number of correct trees is `X ~ Binomial(B, p)`, and the ensemble is right when `X > B/2`.

### (a) 5 pts: derive the error bound

The handout gives Hoeffding's inequality and asks you to show:

```text
P(X ≤ B/2) ≤ exp(−2B(p − ½)²)
```

Hint: the ensemble errs when the mean `Z̄ = X/B ≤ ½`. Each `Zᵢ ∈ {0, 1}`, so `bᵢ − aᵢ = 1` and the denominator is `B`. Set `t = p − ½` and substitute.

### (b) 5 pts: plug in numbers

With `p = 0.6`, `(p − ½)² = 0.01`, so the bound is `exp(−0.02B)`:

| B | Hoeffding bound | Exact binomial tail (computed separately) |
|---|---|---|
| 10 | `e^(−0.2)` ≈ 0.82 | ≈ 0.37 |
| 100 | `e^(−2)` ≈ 0.135 | ≈ 0.027 |
| 1000 | `e^(−20)` ≈ 2.1×10⁻⁹ | ≈ 1.0×10⁻¹⁰ |

To get the bound below 10⁻⁶ you need `0.02B > ln 10⁶ ≈ 13.8`, so `B ≥ 691`. The right column is my own computation, summing binomial probabilities in Python (ties count as errors). The homework doesn't ask for it; it's there to show how conservative the Hoeffding bound is.

The last question, "is that good or necessary?", has no single answer, but think about two things. A 10⁻⁶ error rate is far beyond what most applications need. And the whole derivation assumes the trees are independent, which the next sub-part takes apart.

### (c) 5 pts: correlation and feature subsampling

In practice, bagged trees train on overlapping bootstrap samples and are correlated. You explain two things intuitively:

- Why correlation weakens the convergence guarantee: if all trees err on the same points, more votes can't fix those errors
- How random forest feature subsampling (each split considers only `m` random features) reduces correlation: a strong feature can't be the root of every tree, so tree structures are forced apart

## 2. Correlated trees: the ensemble variance formula (16 pts)

This turns the intuition from 1(c) into a formula. `B` trees, each with prediction variance `σ²`, and every pair with correlation `ρ`.

### (a) 8 pts: prove it

```text
Var( (1/B) Σ T_b(x) ) = ρσ² + (1 − ρ)σ²/B
```

<details>
<summary>Proof skeleton</summary>

The variance of the sum is `Σᵢ Σⱼ Cov(Tᵢ, Tⱼ)`. Split diagonal from off-diagonal:

- Diagonal `i = j`: `B` terms, each `σ²`
- Off-diagonal `i ≠ j`: `B(B − 1)` terms, each `ρσ²`

Multiply by `1/B²` and rearrange into `ρσ²` plus a term that shrinks with `B`.

</details>

### (b) 4 pts: read the formula

- As `B → ∞` the second term vanishes and the variance converges to `ρσ²`. As long as `ρ > 0`, no number of trees gets it to zero
- `ρ = 0` is the independent case from 1(a), with variance falling as `1/B`. `ρ = 1` is the same tree copied `B` times, and ensembling does nothing. You're asked for a practical scenario for each: nearly identical bootstrap samples, or every tree picking the same dominant feature, both push `ρ` toward 1

### (c) 4 pts: why m = 1 is a bad idea

The classification default is `m = ⌊√d⌋`. With `m = 1`, each split can only use one random feature. That minimizes `ρ`, but trees are often forced to split on useless features, so each tree gets worse. In terms of the formula from (a), `m` affects both `ρ` and the individual tree's error, and lowering `ρ` costs you weaker trees. The problem wants you to name that tradeoff.

Section 6 §3.5 gives the rule of thumb `m ≈ √d` for classification and `m ≈ d/3` for regression.

## 3. Random forests vs. Mixture of Experts (4 pts)

The handout puts both in one frame:

- **A random forest is a dense ensemble**: every tree processes every input
- **An MoE is a sparse ensemble**: a learned gating network routes each input to only a few experts, and the output is a weighted combination `y = Σ g_k(x) E_k(x)` with most `g_k = 0`

The handout's example is Mixtral 8x7B: about 47B total parameters, with each token routed to 2 of 8 experts so only about 13B are active (numbers from the handout; original source is the [Mixtral paper](https://arxiv.org/abs/2401.04088)). It also notes two differences. MoE experts specialize, random forest trees don't. And MoE suffers from expert collapse, where the gate sends most inputs to one or two experts, usually addressed with an auxiliary load-balancing loss.

Your answer compares, in 3–5 sentences, how each handles the tradeoff between capacity and compute, and explains why a random forest can't scale up the way an MoE can. A direction to think in: each extra tree adds inference cost linearly, and by part 2, the benefit of extra trees is capped at `ρσ²`. An MoE can keep adding total parameters while per-input compute is set by the number of experts each input is routed to.

## Connecting back to LLMs

Quite a few of the large models in use today are MoE architectures. Looking back at this problem, the classic idea of ensembling has turned around in LLMs: a random forest lowers variance by averaging many similar models, while an MoE routes inputs so different experts divide the work, trading sparse activation for a larger total capacity.

That wraps up HW4. HW5 moves to learning without labels: clustering, PCA, and self-supervised learning.

## Further reading

- [CS336 Lecture 4: attention alternatives and MoE](/posts/ai/2026-08-22-cs336-attention-moe-en): the systems side of MoE routing, load balancing, and expert parallelism
- [Generalization: bias-variance, double descent, and sample complexity (CS229 notes chapter 8)](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-08-generalization-en): another use of Hoeffding's inequality, in learning theory
- [Breiman 2001, Random Forests](https://doi.org/10.1023/A:1010933404324): the original random forest paper

## Previous / next

- Previous: [HW4 (Part 2): why autoencoders can't generate, and what VAEs add](/posts/tech/2026-09-29-harvard-cs181-hw4-autoencoder-vae-en)
- Next: [HW5 (Part 1): K-means, HAC, and PCA](/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-read the official schedule and syllabus; they still list no public lecture video for this topic.

## References

- [CS1810 Spring 2026 HW4 handout hw4_release.tex](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.tex)
- [CS1810 Spring 2026 HW4 handout PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw4/hw4_release.pdf)
- [CS1810 Spring 2026 Section 6 (Decision Trees in §3)](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06.pdf) ([solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec06/sec06_soln.pdf))
- [CS1810 Spring 2026 official schedule (Google Sheet)](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [Jiang et al. 2024, Mixtral of Experts](https://arxiv.org/abs/2401.04088)
- [Breiman 2001, Random Forests](https://doi.org/10.1023/A:1010933404324)
- [CS181 2026 course website](https://harvard-ml-courses.github.io/cs181-web/)
