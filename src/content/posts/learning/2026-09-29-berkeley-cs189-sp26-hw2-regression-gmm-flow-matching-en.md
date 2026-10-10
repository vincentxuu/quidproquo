---
title: "CS189 Spring 2026 HW2 Guide: Chatbot Arena Paper Questions, Regression, MLE/MAP, From GMMs to Flow Matching"
date: 2026-09-29
category: learning
tags: [berkeley, cs189, machine-learning, open-course, homework, linear-regression, generative-models]
lang: en
type: guide
difficulty: 進階
series:
  name: "Reading Berkeley CS189"
  order: 10
tldr: "HW2 is a written-only assignment with 10 problems. The first half practices reading a paper (Chatbot Arena) and the core derivations for regression and MLE/MAP. The two heaviest problems come last: Mixed Feelings goes from k-means' fragility to outliers through robust k-means to a GMM with a uniform background, and Watch Me Flow Dat proves that conditional flow matching and a discretized MLE are the same objective. The problem PDF and LaTeX template are freely downloadable; there are no official solutions."
description: "Guide to Berkeley CS189 Spring 2026 Homework 2: the structure and point values of all ten problems, which lectures each one needs, how to approach the Chatbot Arena paper questions, the storyline of the robust k-means and flow matching problems, and how far an outside learner can go."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

This guide follows the public materials of [CS189 Spring 2026](https://eecs189.org/sp26/) (Jennifer Listgarten / Alex Dimakis). The series starts at the [Berkeley CS189 overview](/en/posts/learning/2026-08-22-berkeley-cs189-spring-2025-overview-en).

Homework 2 was released on 2/24, the same day as Lec 11, and was due **Friday 3/13 at 11:59 PM PT**, four days before the midterm. It reaches further than the lectures had at that point. The early problems review linear regression and MLE/MAP; the last two push GMMs forward into robust clustering and a generative model, flow matching.

This guide covers only what each problem tests, which lecture to revisit, and where people tend to get stuck. **It contains no answers.** HW1–4 have no public official solutions, and the GenAI policy in the [syllabus](https://eecs189.org/sp26/syllabus/) explicitly forbids pasting assignment text into GenAI tools. Enrolled students should not treat this as a solution source.

## Course video sources

No public lecture video dedicated to this post was found. The official Spring 2026 schedule and the lecture playlist (25 videos) were checked live on 2026-10-10 and contain lecture recordings only, no walkthrough of this homework; use the official course entry for recordings and materials.

Course and recording entries:

- [Official course and recording entry](https://eecs189.org/sp26/)
- [CS189 Spring 2026 Lectures — official YouTube playlist (25 videos)](https://www.youtube.com/playlist?list=PLuHtd0SzXhx4B8oOmp9PBEroMuV5n0MWE)

Checked: 2026-10-10.

## Official materials and what I could read

The schedule's HW2 Assignment link points to a [Drive folder](https://drive.google.com/drive/folders/1DfylGxAbv2yfybYhAmSa2b4m8dPjLMBm) with just two files:

| File | Contents | Could I read it? |
|---|---|---|
| `hw2.pdf` | 20 pages of problems | Yes, read in full |
| `hw2_student.tex` | LaTeX answer template; same problem text as the PDF | Yes, read in full |

You submit a single PDF to the Gradescope "HW2 Write-Up" assignment, starting each problem on a new page. HW2 has no notebook or coding part. The syllabus says each homework has a Part 1 Warmup and a Part 2 Main, but the HW2 folder shows no such split.

On this site's [A0–A3 scale](/en/posts/learning/2026-08-21-global-ai-cs-course-map-en), the problems themselves are fully public, so an outside learner can work through all of them. What you can't get is official solutions, Gradescope grading, or the Ed discussion.

## The ten problems at a glance

| # | Problem (original title) | Points | What it practices | Review |
|---|---|---|---|---|
| 1 | Paper Questions | Not listed | Read the [Chatbot Arena](https://arxiv.org/abs/2403.04132) paper and answer questions on the problem, prior approaches, inputs and outputs, Bradley–Terry, and limitations | End of Lec 14 |
| 2 | Sum of Residuals | 6 | Use the normal equation to show `Xᵀr = 0`, show residuals sum to 0 with a bias term, and reason about how an outlier affects least squares | Lec 7–10 |
| 3 | Weighted Linear Regression | 10 | Weighted least squares in matrix form, its gradient and closed form, and when `XᵀAX` is invertible | Lec 8–10 |
| 4 | MLE vs MAP | 16 | A coin with a Beta(3, 3) prior: likelihood, MLE, the posterior as another Beta, MAP | Lec 14 |
| 5 | Estimating the Population of Grizzly Bears | 11 | Capture-recapture: write the likelihood of the population N and find its MLE using likelihood ratios | Lec 5, 14 |
| 6 | One Dimensional Mixture of Two Gaussians | 6 | Joint and marginal likelihood for a 1D two-Gaussian mixture, and why it is hard to optimize | Lec 5–7 |
| 7 | A Bayesian Interpretation of Lasso | 8 | Put a Laplace prior on the weights, show MAP equals ℓ1 regularization, and give λ | Lec 14 |
| 8 | ℓ1-regularization, ℓ2-regularization, and Sparsity | 18 | Assuming `XᵀX = nI`, derive when each component of the ℓ1 and ℓ2 solutions is zero, and compare which is sparser | Lec 9–10 |
| 9 | Mixed Feelings | 42 | Generalized k-means, the breakdown of the quadratic penalty, robust k-means, a GMM with a uniform background | Lec 4–7 |
| 10 | Watch Me Flow Dat | 25 | Flow matching: the marginal vector field, equivalence of the CFM objective, MLE on discrete flows | Lec 5, 14 |

I summed the point values from the sub-parts marked in `hw2_student.tex`. Problem 1 has no points listed.

## Problem 1: the Chatbot Arena paper questions

The assignment says up front that this problem is about reading research papers methodically, not memorizing details. Most papers follow the same arc: motivate a problem, describe current solutions and their limits, present the proposed solution and key insight, give the method, then discuss limitations. The questions follow that order across sub-parts a–f, each with a pointer to the relevant section:

- **a. Problem:** What is Chatbot Arena trying to solve? Why is evaluating generative models harder than evaluating classifiers? (Introduction)
- **b. Current work:** Which categories of LLM benchmarks does the paper describe, and what are the limits of each? (Related Works)
- **c. Inputs and outputs:** the hint is that outputs exist both per battle and in aggregate.
- **d. Key insight and contributions:** these can be methods, software artifacts, a formalization of the problem, datasets, and so on.
- **e. Method details:** What is a Bradley–Terry coefficient and how does Arena use it for scoring? And why does Section 4 of the paper say Bradley–Terry is better for statistical estimation than the original Elo? The hint: Elo is an online metric updated after each battle, while Bradley–Terry fits all match outcomes at once. The problem also points to [Bertrand et al.](https://arxiv.org/abs/2206.12301) on Elo failing to capture transitive structure.
- **f. Limitations:** of Chatbot Arena itself, and of human-preference benchmarks in general. (Discussion)

The end of [Lec 14](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy-en) already demonstrates this reading approach, including "the first four questions can usually be answered from the introduction" and "Bradley–Terry is essentially logistic regression". Reading those slides first will save you time.

After the problem there's an ungraded page of "Other Practical Resources" that recommends Kaggle's entry-level Titanic competition and four related ones: LMSYS Chatbot Arena, WSDM Cup Multilingual Chatbot Arena, LLM Detect AI-Generated Text, and LLM Classification and Fine-Tuning.

## Problems 2–8: regression and MLE/MAP fundamentals

These seven are short derivations; the point is to write up the past few weeks' ideas cleanly. They fall into three groups:

- **Properties of least squares (Problems 2 and 3).** Problem 2's third part isn't a calculation: it asks you to predict qualitatively how a point with a huge y near the mean of x pulls on w, and to propose a loss that is more robust to outliers. Problem 3's final part asks when `XᵀAX` is guaranteed to be invertible, and whether the condition simplifies when all weights are positive.
- **Bayesian estimation (Problems 4, 5, 7).** Problem 4 is the standard Beta–Bernoulli conjugate pair, ending with a one-sentence explanation of how MLE and MAP differ; the problem says restating your earlier answers doesn't count. In Problem 5 the population N is an integer, so the hint says calculus won't help much and you should compare the likelihood at neighboring values of N. Problem 7 mirrors Lec 14's "Gaussian prior → ridge", with a Laplace prior instead.
- **Sparsity (Problem 8).** At 18 points it's the heaviest in this group. You split the ℓ1 objective into independent per-dimension terms, derive necessary and sufficient conditions for each component to be positive, zero, or negative, and then compare with ℓ2. Afterward you'll know what conditions actually sit behind the phrase "ℓ1 produces sparse solutions".

Problem 6 is worth only 6 points, but it sets up the last part of Problem 9: it asks why the mixture log-likelihood is hard to optimize, which comes down to a sum inside the log.

## Problem 9, Mixed Feelings: why k-means fears outliers

At 42 points this is the heaviest problem in the assignment, inspired by the NeurIPS 2016 paper [Robust k-means: a Theoretical Revisit](https://proceedings.neurips.cc/paper_files/paper/2016/file/80a8155eb153025ea1d513d0b2c4b675-Paper.pdf). It first generalizes k-means: pass each point's distance to its nearest center through a penalty function φ and sum. With `φ(t) = t²` you're back to the k-means from lecture. Then it has three parts:

1. **Breakdown of the quadratic penalty** (a, b; 12 points). The data are Gaussian inliers mixed with a fraction of heavy-tailed Cauchy outliers, and you prove the expected risk diverges for every center location. Then the Cauchy is replaced by a point mass at distance M and you find the optimal center. The problem notes that as M → ∞, the center gets dragged away without bound.
2. **Robust k-means** (c–e; 23 points). Each point may carry an error term, and the objective becomes a weighted squared error over inliers only, with the constraint that inliers carry exactly 1 − α of the probability mass. You build the Lagrangian, optimize pointwise, find the optimal center, and finally show, for two overlapping 1D Gaussians, that the hard boundary pushes the center away from the true mean with strictly positive bias.
3. **A GMM with a uniform background** (f, g; 7 points). Alongside two Gaussians with a shared covariance, a uniform component models outliers. You write the posterior responsibility γ₁(x) and prove that γ₁(x) → 0 as a point moves to infinity in any direction, explaining how the uniform term stabilizes the denominator.

The storyline runs from geometric k-means to probabilistic GMMs, in the same order as [Lec 4–7](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-04-07-clustering-mle-gmm-en). For the Lagrangian part, the problem links the Wikipedia article on Lagrange multipliers; Bishop's Appendix C also covers them.

## Problem 10, Watch Me Flow Dat: flow matching is MLE

This 25-point problem is inspired by the ICLR 2023 paper [Flow Matching for Generative Modeling](https://openreview.net/pdf?id=PqvMRDCJT9t), and recommends [A Visual Dive into Conditional Flow Matching](https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching/) as an optional visual introduction. Everything you need is in the problem itself.

The setup: you want to move a standard Gaussian (t = 0) to the data distribution (t = 1), using a time-dependent vector field `v_t(x)` that gives each point a velocity. Integrating the ODE carries a point from noise to data. The true marginal field is intractable, so you use a straight-line path from `x_0` to `x_1`, whose conditional vector field is `u_t(x|x_1) = (x_1 − x)/(1 − t)`; the problem suggests thinking of it as a slope. There are three parts:

1. **The Marginal Field** (a, b). Write the expected squared error between v and the conditional field, take its gradient, and prove that the minimizer v* is exactly the definition of the marginal field.
2. **Equivalent Objectives** (c; 7 points). Prove that the Conditional Flow Matching objective equals the marginal objective plus a constant independent of the parameters, so optimizing one is the same as optimizing the other.
3. **MLE on Discrete Flows** (d–f). Discretize time into T steps and build a Markov chain with Gaussian transitions. Write the log-likelihood, prove that maximizing it equals minimizing the squared distance between the model's velocity and the discrete empirical velocity, then plug in the straight-line path to show it recovers the CFM objective.

This problem pushes Lec 14's idea the furthest: "MLE under Gaussian noise equals squared error" holds not just for linear regression but for a modern generative model too.

## Fall 2026 comparison

The [Fall 2026](https://eecs189.org/fa26/) schedule lists Homework 2 on Friday 9/25 and "Homework 2 due" on 10/9, but the homepage has no public link to the assignment, so I can't tell whether the problems are the same. In terms of lectures, Fall 2026 covers linear regression, bias-variance, and logistic regression in Lectures 6–9, and GMMs in Lecture 5.

## Further reading

- Probability background: [Stanford CS109 on the Beta distribution](/en/posts/learning/2026-08-22-stanford-cs109-lecture-14-beta-distribution-en), [maximum likelihood estimation](/en/posts/learning/2026-08-22-stanford-cs109-lecture-19-maximum-likelihood-estimation-en)
- Classic ML for comparison: [Stanford CS229 guide](/en/posts/ai/2026-08-21-stanford-cs229-machine-learning-en)

Previous: [Lec 14 & 16: MLE vs MAP, bias-variance, entropy and KL](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-14-16-mle-map-bias-variance-entropy-en). Next: [Lec 17–18: neural networks and backpropagation](/en/posts/learning/2026-09-29-berkeley-cs189-sp26-lectures-17-18-neural-networks-backprop-en).

## Things you can do tonight

1. Download `hw2_student.tex` and start with Problem 4, MLE vs MAP. Make sure you can rearrange the posterior back into Beta form.
2. Open the Chatbot Arena paper, read only the introduction, and try answering Problem 1 parts a–d in your own words.
3. Before Problem 9, run a small NumPy experiment: sample from a Gaussian plus 5% Cauchy, run k-means with k = 1, and watch whether the center jumps around.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Checked the official schedule and playlist live; there is no recording dedicated to this homework, so the status stays official entry only.

## References

- [CS189 Spring 2026 homepage and schedule](https://eecs189.org/sp26/)
- [CS189 Spring 2026 syllabus (homework format, GenAI policy)](https://eecs189.org/sp26/syllabus/)
- [HW2 Drive folder (hw2.pdf, hw2_student.tex)](https://drive.google.com/drive/folders/1DfylGxAbv2yfybYhAmSa2b4m8dPjLMBm)
- [Chiang et al., Chatbot Arena (arXiv:2403.04132)](https://arxiv.org/abs/2403.04132)
- [Bertrand et al., On the Limitations of Elo (arXiv:2206.12301)](https://arxiv.org/abs/2206.12301)
- [Robust k-means: a Theoretical Revisit (NeurIPS 2016)](https://proceedings.neurips.cc/paper_files/paper/2016/file/80a8155eb153025ea1d513d0b2c4b675-Paper.pdf)
- [Lipman et al., Flow Matching for Generative Modeling (ICLR 2023)](https://openreview.net/pdf?id=PqvMRDCJT9t)
- [A Visual Dive into Conditional Flow Matching](https://dl.heeere.com/conditional-flow-matching/blog/conditional-flow-matching/)
- [CS189 Fall 2026 schedule](https://eecs189.org/fa26/)
