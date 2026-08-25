---
title: "CS221 Lecture 13: Bayesian Networks II: Gibbs Sampling and the Markov Blanket"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 14
tldr: "Lecture 13 replaces costly exact inference with Gibbs sampling: resample one variable at a time from a conditional determined by its Markov blanket, then approximate query probabilities with sample frequencies."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 13: official agenda, core development, implementation connection, and material gaps."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-13-bayes-gibbs-sampling)

This article follows **Stanford CS221, Autumn 2025, Lecture 13**. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering; the executable lecture artifact is [gibbs_sampling](https://stanford-cs221.github.io/autumn2025-lectures/?trace=gibbs_sampling). The discussion below follows the execution order in `source/gibbs_sampling.py`. Rather than hiding the mathematics behind a finished sampler, the source exposes `ProbTable`, `Bernoulli`, `sample_dict`, and `normalize_dict` so that distributions, updates, and counts remain visible.

> Material gap: the official executable lecture and course site are public. This article does not treat Canvas-only interactions, assignment solutions, or hidden tests as known material. The public lecture repository is the lecture artifact, not a complete record of every classroom activity.

## TL;DR

The lecture begins by treating a Bayesian network as a factorized representation of a joint distribution. It then returns to the basic inference operations: condition on evidence, marginalize variables that are not queried, and normalize into a conditional distribution. Building the full joint can be exponentially expensive, so the lecture reviews rejection sampling and asks whether the next sample can continue from the previous one.

Gibbs sampling keeps a complete assignment that always satisfies the evidence. It repeatedly chooses one non-evidence variable and resamples it from its conditional distribution given all the other variables. The resulting samples are adjacent states in a Markov chain, not independent draws. This avoids rejection, but correlated variables can make the chain mix slowly or get stuck. The Markov blanket then reduces the factors needed for one update to a local neighborhood. Only after this sampling development does the source connect graph structure to independence and conditional independence.

## Recap: a Bayesian network represents a joint distribution

`main()` states the agenda: last time covered Bayesian networks and rejection sampling; this time covers faster probabilistic inference methods and conditional independence. The later Gibbs derivation only makes sense once the network semantics are fixed.

Start with random variables (X=(X_1,ldots,X_n)), then draw a directed acyclic graph over them. The small alarm example has burglary (B), earthquake (E), and alarm (A), with edges (B	o A) and (E	o A). Each node receives a local conditional distribution: `p(b)`, `p(e)`, and `p(a | b, e)`. The source uses `ProbTable("B", [0.95, 0.05])` and the same prior for (E); its alarm table assigns probability 1 when (a=(blor e)), and 0 otherwise.

The Bayesian-network factorization is

\[
P(X_1,ldots,X_n)=\prod_i p(x_i\mid parents(x_i)).
\]

For the alarm network:

\[
P(B,E,A)=p(b)p(e)p(a\mid b,e).
\]

Calling the joint distribution a database specifying how the world works is useful only if the product is taken literally: the probability of every assignment comes from multiplying local factors. Gibbs updates will use the same product, while avoiding the need to enumerate every joint-table entry first.

## Inference operations: condition, marginalize, normalize

Inference asks questions of that joint distribution. The source uses (P(Bmid A=1)). First condition on the evidence by fixing (A=1); in the table this selects `P_BEA.p[:, :, 1]`, leaving (P(B,E,A=1)). Then marginalize the irrelevant variable (E):

\[
P(B,A=1)=\sum_e P(B,e,A=1).
\]

Summing over (B) gives the evidence probability (P(A=1)). The final normalization is

\[
P(Bmid A=1)=\frac{P(B,A=1)}{P(A=1)}.
\]

The code uses `einsum` for the eliminations: the pattern `"b e -> b"` sums out (E), and `"b ->"` sums out the remaining (B) to a scalar. These are the exact-inference operations shown in this source: conditioning, marginalization, and normalization. The difficulty is that explicitly forming the full joint table can grow exponentially with the number of variables.

### Sampling from a joint program

The lecture next writes the alarm network as a probabilistic program. `alarm()` samples (B) and (E) with `Bernoulli(0.05)`, computes `A = B or E`, and returns `{"B": B, "E": E, "A": A}`. A program that returns samples from the joint distribution also defines that distribution procedurally.

### Rejection sampling

`rejection_sampling(program, query, evidence, num_samples)` calls the program from scratch on every iteration. If `evidence(sample)` is true, it increments `counts[query(sample)]`; at the end it divides each count by the total retained count. For the alarm query (P(Bmid A=1)), the program still generates a world according to its prior and keeps it only when the alarm is on.

The clean advantage is independence: each retained sample came from a fresh generation. The cost is that evidence is not used while generating the candidate. If the evidence is rare, most candidates fail the `if evidence(sample)` check and disappear. Producing a useful number of retained samples then requires many fresh attempts. The source makes the transition explicit: how can probabilistic inference be faster?

## From rejection to Gibbs: continue from the previous state

The rejection picture is `sample`, discard, then start another `sample`. Gibbs sampling creates a chain: `sample → sample → sample → sample`. Its basic recipe is to initialize an arbitrary complete assignment and then change one variable at a time, conditioning on all the others.

The initialization must satisfy the evidence. Every later update excludes evidence variables, so each state preserves the same observation. Gibbs therefore avoids generating a world that will immediately be rejected. The trade-off is equally important: neighboring samples share state, so they are not independent and more samples are required. Gibbs sampling is presented here as a special case of Markov chain Monte Carlo.

## Telephone: calculating one Gibbs update

The first full example is a telephone network (A	o B	o C). The intuition is that (A) sends a bit to (B), then (B) sends one to (C), with possible corruption at each step. The source defines `p_a = [0.5, 0.5]`; `p_b_given_a` is 0.8 when (b=a) and 0.2 otherwise; `p_c_given_b` has the same pattern. The inference goal is (P(Amid C=1)). Observing a final 1 encourages (A=1), but the signal has passed through two potentially noisy links.

The lecture first runs rejection sampling with random seed 3 and 100 samples. The query is `sample["A"]`, and the evidence is `sample["C"] == 1`. This provides a direct comparison: every candidate still starts by executing `telephone()` from the beginning.

Gibbs then fixes (C=1) and starts with `x = {"A": 1, "B": 0, "C": 1}`. To update (B), the conditional distribution is written as

\[
P(B=b \mid A=a,C=c)=
\frac{P(A=a,B=b,C=c)}{P(A=a,C=c)}.
\]

The denominator is a normalizer:

\[
P(A=a,C=c)=\sum_bP(A=a,B=b,C=c).
\]

Because the telephone joint factorizes,

\[
P(A=a,B=b,C=c)=p(a)p(b \mid a)p(c \mid b).
\]

For the current assignment, `joint_prob(x, "B", value)` copies the assignment, overwrites `B`, and evaluates the three local factors for the updated (y). The source computes `p_ab0c` and `p_ab1c`, adds them to obtain `p_ac`, divides to obtain the probabilities of (B=0) and (B=1), and samples with `sample_dict`. Both (A=1) and (C=1) support the intermediate bit being 1, so (B) is pulled toward 1.

The computational point is just as important as the arithmetic. The source never constructs a complete (A,B,C) joint table; it tests the two values in (B)'s domain. However, `joint_prob` still touches the local factors for (A,B,C). The stated runtime is (O(\#iterations\times\#variables\times|domain|\times\#variables)).

## The Gibbs loop: burn-in, samples, and counts

The source implementation accepts `init_x`, the update list `vars`, a `query`, a `joint_prob`, and `num_iterations`. It copies the initial assignment with `x = dict(init_x)`, so the caller's dictionary is not mutated. On every outer iteration it visits each variable in `vars`. For a binary variable it evaluates the joint score for values 0 and 1, normalizes the two scores with `normalize_dict`, samples with `sample_dict`, and writes the result into `x[var]`.

The code records `counts[query(x)] += 1` after every single-variable update and normalizes those counts at the end. It does not expose a separate burn-in argument and does not discard an initial prefix. That means the early path from the arbitrary initialization remains part of the returned estimate in this implementation. A reader must account for that when interpreting the result; the function has not silently solved the initialization problem. With `num_iterations=100`, the outer loop runs 100 cycles, and one count is recorded for every update in `vars`, so the number of recorded query values is tied to the number of single-variable updates.

In the telephone run, `vars` is `["A", "B"]` and `C` remains evidence. The source runs one short version and then 100 iterations, comparing the Gibbs estimate with the earlier rejection estimate. They are in the same general range. This is an executable demonstration of a chain, not an exact-value guarantee.

## Markov blanket: retain only local factors

Even without materializing a full table, a joint-probability callback may repeatedly compute factors that cancel. The longer telephone chain has joint

\[
p(a)p(b \mid a)p(c \mid b)p(d \mid c)p(e \mid d).
\]

If only one variable changes, many factors are shared by every candidate and by the normalizer. For (A	o B	o C), when updating (A) while (B=b,C=c) are fixed, the two candidate numerators contain

\[
p(a=0)p(b \mid a=0)p(c \mid b)
\]

and

\[
p(a=1)p(b \mid a=1)p(c \mid b).
\]

The common (p(c \mid b)) has no effect after normalization and can be ignored.

In general, an update needs the local conditional probabilities involving the variable being sampled. Evaluating those factors requires the variable's parents, its children, and the other parents of those children. The source calls this set the **Markov blanket**, and lists the telephone blankets as `MarkovBlanket(A) = {B}`, `MarkovBlanket(B) = {A, C}`, and `MarkovBlanket(C) = {B}`. The blanket does not delete the rest of the graph; it identifies which terms survive in the local conditional ratio.

`markov_prob` therefore computes `p_a * p_b_given_a` for an (A) update and `p_b_given_a * p_c_given_b` for a (B) update. It omits the unrelated factors. Running 100 Gibbs iterations with the same telephone query gives the same kind of estimate while changing the per-update work. The source summarizes the cost as (O(\#iterations\times\#variables\times|domain|\times|markov\_blanket|)) instead of touching the full variable set. Small blankets are where this locality becomes useful.

## Alarm network: local updates are not instant exactness

The source returns to the alarm network (B,E	o A). It initializes `x = {"B": 1, "E": 1, "A": 1}`, which satisfies the fixed evidence (A=1), and updates only `B` and `E`. `compute_prob` evaluates `p_b * p_e * p_a_given_be` for each candidate assignment; the query is (B). The code runs 100 iterations and then 200 iterations, followed by an explicit warning that the estimates are not quite accurate.

That warning matters. More iterations may improve an estimate, but this source gives no error bound and no formal convergence guarantee. The Markov blanket can reduce the amount of arithmetic in an update; it does not turn a finite correlated chain into exact inference.

## Where each method becomes difficult

Two binary examples make the trade-off concrete. First consider (A	o B), with prior `p_a = [0.5, 0.5]` and
`p_b_given_a = [[0.9999, 0.0001], [0.9998, 0.0002]]`. The query is (P(Amid B=1)). Evidence (B=1) is rare, so rejection sampling must reject almost every sample that does not match it. Gibbs conditions on (B=1), so this case is comparatively friendly to Gibbs.

Now keep (A	o B), but set `p_b_given_a` by the deterministic rule `a == b`. There is no evidence, and the initial state is `{"A": 0, "B": 0}`. Rejection sampling regenerates from scratch and therefore explores normally. A one-variable Gibbs move cannot cross to the other diagonal state: changing (A) alone while (B=0) produces zero joint probability, and changing (B) alone while (A=0) does the same. The chain gets stuck and never explores (A=1).

This is the source's concrete account of mixing limits. Rare events are hard for rejection sampling; highly correlated variables are hard for Gibbs sampling. Before increasing an iteration count, ask whether evidence is rare and whether single-variable moves can travel between high-probability regions. The source mentions mixing times as a way to study the effective running time of correlated samples, and names Metropolis–Hastings as a more general MCMC algorithm using a proposal distribution. It does not develop that proposal or provide a convergence theorem, so those topics remain extensions rather than claims established by this artifact.

## Finally: graph structure and conditional independence

Only after the Gibbs discussion does the source turn to conditional independence. The earlier sections used Bayesian networks to perform inference; this section asks what structural properties of the graph imply about probability.

Variables (A) and (B) are independent when, for every (a,b),

\[
P(A=a,B=b)=P(A=a)P(B=b).
\]

With no edge between them, the source writes the joint as `p(a) p(b)`, so they are independent. With (A	o B), it is `p(a) p(b | a)`, so they are not independent in general. A less obvious case is (A,B	o C): even though both point to (C), marginalizing (C) gives `Σ_c p(a) p(b) p(c | b, a) = p(a) p(b)`, so A and B are independent. For a common cause (C	o A,B), the expression `Σ_c p(c)p(a|c)p(b|c)` generally does not split into the two marginals, so A and B are not independent.

Conditional independence given (C=c) means

\[
P(A=a,B=b \mid C=c)=P(A=a \mid C=c)P(B=b \mid C=c).
\]

In the common-cause graph (C	o A,B), fixing (C=c) leaves `p(a | c) p(b | c)`, so A and B become conditionally independent. In the (A,B	o C) graph, conditioning on their common child leaves `p(a)p(b)p(c|a,b)`, and the source says A and B are no longer conditionally independent. The alarm example makes the distinction concrete: burglary (B) and earthquake (E) are independent before observing the alarm, but are not conditionally independent given (A=1), because one possible cause changes how the evidence should be attributed to the other.

The source gives a general graph procedure for asking whether A and B are independent given C: shade the variables in C; recursively remove non-shaded leaves; connect parents to one another (the “marriage” step); then check whether a path remains from A to B without passing through a shaded node. The source labels the last two items with the same number 3; the duplicated label does not change the operations.

The medical-diagnosis example names Cold (C), Allergies (A), Cough (H), and Itchy eyes (I). It lists C and A as independent, C and I as independent, C and I as independent given A, and C and I as independent given A and H. Those are the claims present in the source; no additional numerical table is supplied here.

## What the lecture leaves you to check

The main line of Lecture 13 is not that Gibbs sampling universally replaces rejection sampling. It progressively narrows the work of one inference update: represent the joint with Bayesian-network factors; condition on evidence; marginalize and normalize; observe that rejection regenerates and wastes rare evidence; keep an evidence-satisfying state and resample one variable; exploit the Markov blanket to keep only local factors; then use graph structure to reason about independence.

When reading or implementing this source, three calculations should be reproducible by hand: how candidate joint products become a conditional distribution; why a Markov blanket permits particular factors to cancel; and why rare evidence versus strong correlation harms the two samplers in different ways. Burn-in, multi-chain diagnostics, error bounds, and a fuller convergence theory are not developed here. The artifact only points to inaccurate finite estimates, mixing times, and the possibility that the simple method is slow. Those limits should remain visible rather than being filled in with guarantees the source does not provide.

## References

- [Official CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official executable lecture artifact: gibbs_sampling](https://stanford-cs221.github.io/autumn2025-lectures/?trace=gibbs_sampling)
- [Official CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
