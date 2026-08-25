---
title: "CS221 Lecture 14: Bayesian Networks III: From Counts and Smoothing to EM"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 15
tldr: "Lecture 14 moves from maximum-likelihood counts and Laplace smoothing with complete data to EM, which alternates posterior responsibilities for latent variables with parameter updates."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 14: official agenda, core development, implementation connection, and material gaps."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-14-bayes-learning-em)

This article covers **Stanford CS221, Autumn 2025, Lecture 14**, listed on the official schedule as Bayesian Networks III on November 5, 2025. The [official course site](https://stanford-cs221.github.io/autumn2025/) identifies the offering; the article follows the executable [bayes_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=bayes_learning) source in sequence. The useful thread is not “EM as a black box,” but the change from counting complete assignments to counting weighted assignments when a variable is hidden.

> Material gap: the official course page, lectures repository, and executable lecture artifact are public; Canvas recordings, classroom whiteboard interactions, assignment solutions, and hidden tests are not part of this public source. I do not fill those gaps with another year's lecture notes.

## Put the Bayesian network back in context

The lecture does not begin with EM. It first reviews what is being learned. Given random variables (X=(X_1,\ldots,X_n)), define a directed acyclic graph and a local conditional distribution for every node:

\[
P(X_1=x_1,\ldots,X_n=x_n)=\prod_i p(x_i\mid \operatorname{parents}(X_i)).
\]

The Alarm network is the compact example: (B) is burglary, (E) is earthquake, and (A) is alarm, so the joint distribution is (p(b)p(e)p(a\mid b,e)). Once the joint distribution exists, inference can answer a query such as (P(B\mid A=1)). The source names exact inference, rejection sampling, and Gibbs sampling as possible ways to answer it. That distinction matters for this lecture: inference reads the local distributions; learning writes their parameters.

## Fully observable learning: writing local tables

In the fully observable setting, each training example is an assignment to every variable. The output is a set of local conditional distributions. For a single movie-rating variable (R\in\{1,2,3,4,5\}), the parameters are the five values of (p_R(r)). The source's data is 1, 3, 4, 4, 4, 4, 4, 5, 5, 5. The algorithm is deliberately plain: scan the examples, increment the count for each rating, then normalize the counts.

Add a genre variable (G), and the joint distribution becomes (p_G(g)p_R(r\mid g)). Each example updates a count for (G) and a local count for the pair ((G,R)). For each fixed genre (g), normalize only the ratings in that genre's bucket. This is the lecture's recurring rule: **count + normalize**. To estimate a local conditional distribution, use the child and all of its parent assignments; there is no need to construct a new giant joint table for every parameter.

The v-structure (G\to R\leftarrow A) makes one detail explicit: (p_R(r\mid g,a)) must condition on both parents simultaneously. The inverted-v example (G\to R1) and (G\to R2) instead has three independent local tables: (p_G), (p_{R1}(r1\mid g)), and (p_{R2}(r2\mid g)). The graph changes which assignments share a bucket, not the basic counting operation.

### Parameter sharing is a modeling decision

The source then makes (R1) and (R2) share one (p_R(r\mid g)). During counting, both ratings increment the same `counts_gr[g]`, so each genre receives more observations before normalization. At inference time, reading (p(r1\mid g)) and (p(r2\mid g)) does not reveal whether the tables are shared. During learning, however, the distinction changes exactly which observations are pooled.

Sharing gives fewer parameters and therefore requires fewer examples to estimate them; separate tables give more flexibility. The source does not decide whether the two users are similar. It leaves that as a modeling decision. This is a useful boundary: “more data” is not the only design choice; the parameterization decides what counts as the same local distribution.

### An HMM reuses the same counter

The hidden Markov model example gives the local distributions temporal names: (p_{start}), (p_{trans}), and (p_{emit}). Hidden state (H_t) and sensor reading (E_t) form the chain. For three time steps, the source expands the joint as a start probability, an emission, a transition, another emission, another transition, and a final emission.

Both source examples contain complete assignments, so learning is still counting. Put (H1) into the start counts; for each time step, count the pair (H_t,E_t) for emissions; count (H1\to H2) and (H2\to H3) for transitions; normalize each family. The general Bayesian-network implementation records `(parameter_name, parent_vars)` for each variable. For example, `H2` uses `trans` with parent `H1`. For each assignment, it builds the parent-value tuple and increments the child-value count.

If multiple nodes have the same `parameter_name`, they share a parameter table. Otherwise they have separate local tables. `fully_observable_learning` stores counts as
`counts[parameter_name][parent_values][value]`, optionally starting from a deep copy of pseudocounts, then calls `normalize_dict` for every parent bucket. The implementation is short because the model structure has already made the factorization explicit.

## Why count + normalize is maximum likelihood

The intuitive algorithm is not detached from a statistical objective. The source identifies it as the closed-form solution to maximum likelihood estimation. Given data (D), choose parameters (	heta) to maximize

\[
\max_\theta \prod_{x\in D}P(X=x;\theta)
=\max_\theta \sum_{x\in D}\log P(X=x;\theta).
\]

For one variable, the source uses (R=1,5,5). The objective is (p_R(1)p_R(5)p_R(5)), subject to the five probabilities summing to one. The derivation sketch introduces a Lagrange multiplier for that constraint, sets the gradient to zero, and solves it. The result is (p_R(1)=1/3) and (p_R(5)=2/3). The zero probabilities for unseen ratings are therefore the raw MLE result, not an accidental implementation bug.

For two variables, use the complete examples `(drama,4)`, `(drama,5)`, and `(comedy,5)`. The likelihood is a product of (p_G(g)p_R(r\mid g)) factors. Regrouping equal parameters separates it into one optimization for (p_G), one for (p_R(\cdot\mid drama)), and one for (p_R(\cdot\mid comedy)). Each subproblem is the same constrained problem as the one-variable case. Count + normalize is closed form here because complete assignments and the local factorization split the likelihood into independently normalized tables; no iterative optimizer is needed.

## Smoothing: pseudocounts in the same pipeline

The source next asks whether we really believe (p_R(2)=0) after observing only (R=1) and (R=4). Laplace smoothing changes the counts before normalization: add the same pseudocount \(lambda) to every possible rating. The implementation exposes this through `pseudocounts` in `fully_observable_learning`; a table containing \(lambda\) for each of the five values is copied in as the initial count table.

The source runs three limiting cases. As \(lambda\to0\), the estimate returns to the original MLE. As \(lambda\to\infty\), it approaches a uniform distribution. With more observations, a fixed pseudocount is washed out; repeating (R=4) 1000 times demonstrates that behavior. The supported claim is precise: smoothing adds pseudocounts and prevents zero probability estimates. The material does not develop a broader prior derivation, so there is no need to attach one here.

## Incomplete data: change the likelihood before changing the algorithm

The fully observed examples included (G). EM removes it from the training records while keeping the model (G\to R1) and (G\to R2). The observed data now contain only (R1,R2). If (G) were known, the earlier count-and-normalize routine would work. But both the hidden assignments and (	heta=(p_G,p_{R\mid G})) are unknown.

Maximum likelihood remains the objective, but “the data” means what was actually observed. For each observed pair ((r1,r2)), sum out the hidden (g):

\[
\max_\theta\sum_{r1,r2}\log P(R1=r1,R2=r2;\theta)
=\max_\theta\sum_{r1,r2}\log\sum_gP(G=g,R1=r1,R2=r2;\theta).
\]

The sum is inside the log. That is why we cannot simply pretend a missing genre label is known and run supervised counting. The source calls this a chicken-and-egg problem: given (	heta), compute (P(G=g\mid r1,r2;\theta)); given the hidden assignments, compute (	heta). Expectation Maximization alternates those two directions.

## EM, step by step

The source implementation initializes `p_g` at 0.5 for both drama and comedy. It initializes the conditional tables as comedy ({1:0.4,2:0.6}) and drama ({1:0.6,2:0.4}). The surrounding text describes starting from an initial parameter setting; this concrete code uses fixed, non-uniform conditional values rather than calling a random-number routine.

### E-step: turn observations into weighted complete data

For each observed example `x`, the code first computes an unnormalized score for every possible hidden genre:

\[
q(g)=p_G(g)p_{R\mid G}(r1\mid g)p_{R\mid G}(r2\mid g).
\]

`normalize_dict(q)` turns those scores into (P(G=g\mid r1,r2;\theta)). If both genres explain the observation, both remain in the result with different weights. The code appends `x | {"G": g}` together with `q[g]` to `weighted_training_data`.

This is not a hard guess of one label. One partially observed example becomes several possible complete assignments, and each assignment contributes according to its posterior responsibility. “Impute” here means weighted expansion, not replacing uncertainty with an arbitrary single answer.

### M-step: fractional counts and the familiar normalization

The M-step scans each `(x, weight)` pair. It adds `weight` to `counts_g[x["G"]]`; it adds the same weight to the rating counts for both `R1` and `R2` under that genre. Counts can therefore be fractional: they are sums of posterior responsibilities, not literal row counts.

The rest is familiar. Normalize `counts_g` to update (p_G), then normalize each genre's rating counts to update (p_R(r\mid g)). The M-step is almost the same as fully observable learning; the important change is the source of its counts. After the update, the new parameters feed the next E-step. The source runs five iterations for the first example and ten for a second example.

That second dataset contains repeated `(1,1)` and `(2,2)` pairs, plus `(1,2)` and `(2,1)`. The source observes that the probabilities become somewhat smoother to account for the more heterogeneous assignments. It does not claim a more general result beyond that example.

## What EM guarantees—and what it does not

The source's guarantee is deliberately limited: each iteration is guaranteed to increase the likelihood and the procedure converges to a local maximum. It is not guaranteed to find the global maximum. Initialization matters because latent-variable objectives can have different local explanations, and the iteration amplifies the preferences present at its starting point.

The source also says to initialize with a non-uniform distribution to break symmetries. In the concrete implementation, (p_G) itself starts uniform, while the two conditional tables are oppositely non-uniform: 0.4/0.6 for comedy and 0.6/0.4 for drama. That is the asymmetry that distinguishes the initial latent explanations in this example. The important point is to report what the code does, not to replace it with an unsupported claim of random restarts.

There is an identifiability limit as well. The hidden label names are arbitrary. A solution that swaps `drama` and `comedy` can describe the same observed distribution. The source says the hidden variable is recoverable only up to a permutation of labels. Therefore, comparing two EM runs requires accounting for label permutation before treating different names as different solutions.

## The executable agenda as a checklist

The source sequence can be used as an implementation checklist. First ask whether every variable is observed. If yes, count each `(parameter_name, parent_values, value)` assignment and normalize each local bucket. Next decide whether local parameters are shared; that decision determines which observations are pooled. If zero estimates are a problem, seed the counts with pseudocounts and understand the limiting behavior as \(lambda\) changes. If a variable is hidden, do not fabricate its label: optimize the observed-data likelihood, compute posterior weights in the E-step, and run weighted count + normalize in the M-step.

The same checklist also marks the limits supported by this material. Fully observed learning has a closed-form local estimate; incomplete-data learning has a marginalization term inside the log. EM can increase likelihood without reaching the global optimum, its result depends on initialization, and the names of hidden states are permutation-symmetric. The source does not discuss continuous variables, missingness mechanisms, general numerical optimizers, or extra convergence diagnostics here, so those topics remain outside this lecture reconstruction.

## References

- [CS221 Autumn 2025 official course site and schedule](https://stanford-cs221.github.io/autumn2025/)
- [Official executable lecture material: bayes_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=bayes_learning)
- [CS221 Autumn 2025 lectures repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
