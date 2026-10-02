---
title: "CS234 Data Efficiency I: Multi-Armed Bandits, Regret, and UCB"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, exploration, multi-armed-bandit]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 13
tldr: "CS234 L9 and the first half of L10 turn exploration from a rule of thumb like ε-greedy into something you can prove. First, regret: how much you lose compared with always pulling the best arm. Greedy locks onto a suboptimal arm, and ε-greedy with fixed ε spends an ε fraction of its time choosing at random, so both have regret that grows linearly with time. The Lai-Robbins lower bound says the best possible is logarithmic growth, and UCB gets there by being optimistic about uncertain arms: Theorem 7.1 of Bandit Algorithms shows each suboptimal arm is pulled only about 16 log n / Δ² times."
description: "A guide to Stanford CS234 (Winter 2026) L9 and the first half of L10: the multi-armed bandit setting, the broken-toe toy example, the gap-and-count decomposition of regret, why greedy and ε-greedy have linear regret, the Lai-Robbins lower bound, optimism in the face of uncertainty, sub-Gaussian confidence bounds, UCB1, and L10's regret proof redone from Bandit Algorithms Theorem 7.1, plus the Bastani et al. COVID testing case."
draft: false
glossary:
  - term: "regret"
    aliases: ["total regret", "cumulative regret"]
    definition: "The expected reward an algorithm gives up compared with choosing the action with the highest expected reward at every step. Minimizing total regret is equivalent to maximizing cumulative reward, but regret lets you compare algorithms across problems by how it grows over time."
    context: "The evaluation framework introduced in CS234 L9; L10–L12 use it or PAC to compare exploration algorithms."
  - term: "UCB"
    aliases: ["UCB1", "Upper Confidence Bound"]
    definition: "At each step, compute for each action an upper bound that is at least its true expected value with high probability, and pick the action with the largest bound. Rarely pulled actions have wide bounds and get tried first; as they are pulled more, the bounds narrow and only genuinely good actions keep being chosen."
    context: "CS234 L9 uses UCB1 from Auer, Cesa-Bianchi, and Fischer (2002); L10 proves its regret grows logarithmically."
  - term: "optimism in the face of uncertainty"
    aliases: ["OFU"]
    definition: "When uncertain, assume an action might be good and try it. If it really is good, you get high reward; if not, you learn something and stop overestimating it."
    context: "The principle behind UCB; L12 carries it over to MDPs (MBIE-EB)."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-bandits-regret-ucb)

> **Version note**: This post is based on the Winter 2026 slides of [CS234](https://web.stanford.edu/class/cs234/). The public recordings are the [Spring 2024 offering](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX); this post corresponds to video 11, "Exploration 1" (per its YouTube chapters: multi-armed bandits, regret, ε-greedy, and UCB1). Every fact was checked on 2026-09-30 against the [Lecture 9 slides](https://web.stanford.edu/class/cs234/slides/lecture9post.pdf) (post-class, 53 pages) and the [Lecture 10 slides](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf) (post-class, 41 pages; this post uses pp. 1–17). Access grade **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)): the slides and supplementary reading are public; the 2026 recordings are on Canvas for enrolled students only.

**Series**: previous [A3: reward engineering, RLHF, DPO on Hopper, and best arm identification](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits-en) | next [Data efficiency II: Thompson sampling, Bayesian bandits, Gittins](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

So far this course has used exactly one exploration method: ε-greedy. It showed up in GLIE control in [order 5](/posts/ai/2026-09-30-cs234-model-free-control-function-approx-en) and in DQN in [order 6](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning-en), but nobody asked whether it is any good.

L9 opens by listing four ways to evaluate an algorithm: whether it converges, whether it converges to the optimal policy, how quickly it gets there, and how many mistakes it makes along the way. The course has covered the first two; L9 starts on the last two. The lecture is titled "Data Efficient Reinforcement Learning", and the materials page groups L9 through L12 into one "Data Efficient RL" module, listing Section 7.1 of [Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) as supplementary reading.

L9 is clear about why bandits come first: they are a simpler place to see these ideas, and the ideas will extend to MDPs.

## The setting: RL with a single decision

A multi-armed bandit is a tuple (A, R): A is a known set of m actions (arms), and R^a(r) = P[r | a] is each arm's unknown reward distribution. At each step you pick an action and get a reward; the goal is to maximize cumulative reward.

Compared with an MDP, a bandit has no state transitions: your choice doesn't change the situation you face next. A quiz at the start of L10 states the relationship directly: a k-armed bandit is like a single-state MDP with k actions.

The whole module uses one toy example. L9 notes that it is made up and the numbers are not real treatment efficacies:

| Treatment | Probability of healing (true value, unknown to the algorithm) |
|---|---|
| a1 surgery | 0.95 |
| a2 buddy taping (taping the broken toe to its neighbor) | 0.90 |
| a3 do nothing | 0.10 |

The reward is binary: an x-ray at 6 weeks, 1 if healed and 0 if not. Each arm is a Bernoulli variable with an unknown parameter.

## Why greedy locks up

The most intuitive algorithm is greedy: estimate each arm's value Q̂(a) by Monte Carlo averaging, and pick the highest estimate at every step.

L9's example shows how it fails. Pull each arm once: surgery gets unlucky with 0, taping gets 1, doing nothing gets 0. Now Q̂(a2) = 1 is the highest, and greedy keeps choosing taping. As long as taping's average stays above 0, surgery is never tried again, and its estimate stays at 0 forever.

The slide's conclusion is one line: **greedy can lock onto a suboptimal action, forever.**

## Regret: turning "how many mistakes" into a number

To compare algorithms, L9 introduces regret. Some definitions:

- Q(a) = E[r | a]: the mean reward of action a
- V* = max Q(a): the mean reward of the best arm
- One-step regret l_t = E[V* − Q(a_t)], with the expectation over the algorithm's choices
- Total regret L_t = E[Σ (V* − Q(a_τ))]

Maximizing cumulative reward is equivalent to minimizing total regret. Define N_t(a) as the number of times action a has been chosen by time t, and the gap Δ_a = V* − Q(a). Total regret then decomposes as:

```text
L_t = Σ_a E[N_t(a)] · Δ_a
```

This formula is the backbone of the module. A good algorithm keeps **counts small for arms with large gaps**; the difficulty is that the gaps are unknown.

L9 also points out something easy to forget in practice: in real settings you can't compute regret, because it requires the true expected reward of the best arm. So theory works by **proving an upper bound**: on any bandit problem, this algorithm's regret won't exceed a certain amount.

## ε-greedy doesn't escape linear regret either

Back to the broken toes with greedy's regret table: each pull of taping costs 0.05, and each pull of doing nothing costs 0.85. Locked onto taping, regret grows by 0.05 per step, **proportional to the number of decisions**.

ε-greedy picks the highest estimate with probability 1 − ε and a random action with probability ε. It doesn't lock up, but the price is that **it always makes a suboptimal decision an ε fraction of the time**.

L9's quiz puts the two together: if some arm has a gap greater than 0, ε-greedy with ε = 0.1 can have linear regret, and so can ε = 0 (that is, greedy). The slide gives an informal definition: an algorithm has linear regret if it takes a non-optimal action a constant fraction of the time.

So there are two extremes: explore forever and get linear regret, or never explore and get linear regret. The question becomes: **is sublinear regret possible?**

## The lower bound: how good can it get

L9 first distinguishes two kinds of regret bounds:

- **Problem independent**: how regret grows with the total number of steps T
- **Problem dependent**: regret as a function of how many times each arm is pulled and its gap

Then it gives the Lai and Robbins lower bound: asymptotically, any algorithm's total regret grows at least **logarithmically** in the number of steps.

```text
lim_{t→∞} L_t ≥ log t · Σ_{a: Δ_a > 0} Δ_a / D_KL(R^a ‖ R^{a*})
```

The KL divergence in the denominator measures how similar a suboptimal arm's reward distribution is to the best arm's. The intuition is clean: hard problems have arms that **look alike but have different means**.

The slide calls this lower bound "promising": it is sublinear itself, so there is hope for an algorithm that achieves it.

## Optimism: when unsure, guess high

L9's answer is optimism in the face of uncertainty: **choose actions that might have a high value**. Why does that make sense? The slide lists two outcomes:

- If the arm really has a high mean, you get high reward
- If it is actually worse, pulling it will (in expectation) lower its average estimate and reduce its uncertainty, so you learn something

Neither outcome is a loss. The concrete method is the Upper Confidence Bound: estimate an upper bound U_t(a) for each action such that Q(a) ≤ U_t(a) with high probability. The width depends on N_t(a), and at each step you pick the action with the largest bound.

Where does the bound come from? L9 cites Corollary 5.5 of Lattimore and Szepesvári's *Bandit Algorithms*: if X_i − μ are independent σ-sub-Gaussian variables, the probability that the sample mean deviates from μ by more than ε is at most exp(−nε² / 2σ²). Solving the other way gives, with probability at least 1 − δ,

```text
μ ≤ μ̂ + sqrt( 2σ² log(1/δ) / n )
```

Assuming 1-sub-Gaussian rewards (σ² = 1) gives the UCB1 selection rule:

```text
a_t = argmax_a [ Q̂(a) + sqrt( 2 log(1/δ) / N_t(a) ) ]
```

UCB1 comes from Auer, Cesa-Bianchi, and Fischer (2002). The second term is an exploration bonus: the fewer the pulls, the bigger the bonus.

L9 works the broken toes by hand: pull each arm once (this time surgery and taping both get 1, doing nothing gets 0), then from t = 3 recompute all three upper bounds each step and pick the largest. The slides end with an optional question: what if you always pick the arm with the highest **lower** bound (pessimism)? Does that guarantee low regret? Think it through with two arms first.

> L11's "What You Should Understand" list answers the optional question indirectly: you should be able to give an example of why ε-greedy, greedy, and **pessimism** can result in linear regret.

## L10: the redone UCB regret proof

L9 has a post-lecture note: Brunskill tried a simpler, shorter UCB proof in L9 but realized during lecture that it had an error, so L10 presents the corrected proof following Theorem 7.1 of *Bandit Algorithms*. So read the proof in L10 pp. 10–16, not L9.

**Theorem 7.1** (as stated on L10 p. 11): run UCB on a stochastic K-armed bandit with rewards in [0, 1] and δ = 1/n². Then

```text
Regret_n ≤ 3 · Σ_i Δ_i + Σ_{i: Δ_i > 0} 16 log n / Δ_i
```

Regret grows only logarithmically in n, matching the order of the Lai-Robbins lower bound.

<details>
<summary>Proof outline (L10 pp. 11–16)</summary>

Without loss of generality let a1 be the best arm. Since Regret_n = Σ Δ_i E[N_n(a_i)], it is enough to bound the expected number of pulls of each suboptimal arm.

1. **Define a good event G_i** with two conditions: (*) the best arm a1's true value stays below its own UCB at all times; (**) after suboptimal arm a_i has been pulled u_i times, its UCB is already below a1's true value. u_i is a number of pulls to be chosen.
2. **Split the expectation**: E[N(a_i)] = E[1(G_i) N(a_i)] + E[1(G_i^c) N(a_i)] ≤ u_i + n · P(G_i^c).
3. **Under the good event, a_i is pulled at most u_i times**, by contradiction: otherwise at some step a_i has already been pulled u_i times and is chosen again, but then a_i's UCB < Q(a1) < a1's UCB, so a1 should have been chosen. The L10 slides flag a typo in the original here: the comparison is against Q(a1), not Q(a_i).
4. **Bound the probability of the bad event**: for condition (*), the union bound over time steps, with each UCB holding with probability 1 − δ, gives failure probability ≤ nδ. For condition (**), when u_i is large enough that the confidence width is ≤ cΔ_i, the previous lecture's concentration inequality gives exp(−u_i c² Δ_i² / 2).
5. **Choose u_i** so the width condition holds, giving u_i ≈ 2 log(1/δ) / ((1 − c)² Δ_i²), and substitute back.
6. **Finish**: with c = 0.5 and δ = 1/n², E[N(a_i)] ≤ 3 + 16 log n / Δ_i². Multiply by Δ_i and sum to get the theorem.

For full details, the slides themselves point to Section 7.1 of *Bandit Algorithms*.

</details>

The quiz at the start of L10 makes a good self-check. The official answer is that all five are true:

- Algorithms that minimize regret also maximize reward
- Ignoring constants and δ, UCB picks the arm maximizing Q̂(a) plus a function of N_t(a)
- With an exploration term of the form sqrt(log(t/δ) / N_t(a)), UCB would still likely learn to pull the optimal arm more than others
- With a fixed bonus (say 5), the algorithm is optimistic about empirical rewards but may still suffer linear regret
- A k-armed bandit is like a single-state MDP with k actions

The fourth is the one to think about: optimism alone isn't enough. **The amount of optimism has to shrink as data accumulates.**

## A real case: COVID border testing

L10 pp. 5–6 show a real case: [Bastani et al.'s COVID-19 border testing study in Nature](https://www.nature.com/articles/s41586-021-04014-z), which decided which arriving travelers to test. The slide title says "Nature 2001", but the paper was published in 2021; it looks like a typo.

The slide describes the problem with a string of qualifiers: **a nonstationary, contextual, batched bandit problem with delayed feedback and constraints**. Against this post's clean setting, each qualifier is an unsolved difficulty: reward distributions shift, each traveler has features, decisions are made in batches, test results take time, and testing capacity is capped.

The case is a reminder that the UCB proof lives in the simplest setting, and real deployments stack many layers on top. The next post's Thompson sampling handles one of them: deterministic optimism runs into trouble with batched, delayed feedback.

## How this relates to Assignment 3

[Assignment 3 Q4](/posts/ai/2026-09-30-cs234-a3-rlhf-dpo-bandits-en), best arm identification, uses the same tools: Hoeffding (a special case of sub-Gaussian) and the union bound. The difference is the objective:

- UCB cares about regret accumulated **along the way**, so it explores and exploits at once
- Q4 only cares about being right **at the end**, so it can pull every arm enough times before deciding

After this post, Q4 (a)'s "some arm's estimate deviates" is the union bound from step 4 of the proof above, and (b) asks how narrow the confidence width must be so the chosen arm is within ε.

## How to self-study it

1. **Work greedy and ε-greedy on the broken toes by hand.** Write down Q̂ and regret at each step and watch regret grow linearly.
2. **Write UCB1.** L11's learning goals say "Be able to implement UCB bandit algorithm". With three Bernoulli arms (0.95, 0.9, 0.1), plot cumulative regret for greedy, ε-greedy, and UCB1.
3. **Rewrite L10's proof outline yourself.** The same list asks you to "Be able to prove why UCB bandit algorithm has sublinear regret". When stuck, check Section 7.1 of *Bandit Algorithms*.
4. **Go back and do Assignment 3 Q4.**

One thing you can do tonight: simulate the broken toes in 30 lines of Python, run 1,000 steps, and compare the cumulative regret of ε-greedy with ε = 0.1 against UCB1. You'll see a straight line and a curve that flattens out; that is the difference between linear and logarithmic.

## Further reading

- Exploration methods and theory in deep RL: [Berkeley CS285 L19–25: Exploration, RL Theory, and Open Problems](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en)
- Course positioning, access gaps, and the 2024 video mapping: [Reading Stanford CS234 (series overview)](/posts/ai/2026-09-30-cs234-course-overview-en)

## References

- [CS234 course homepage (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule and learning outcomes (assessment goals for regret and exploration)
- [CS234 lecture materials page](https://web.stanford.edu/class/cs234/modules.html) — the "Data Efficient RL" module (L9–L12) and the Bandit Algorithms Section 7.1 reading
- [CS234 Lecture 9 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture9post.pdf) — bandit setting, broken toes, regret, ε-greedy, Lai-Robbins lower bound, sub-Gaussian confidence bounds, UCB1, the proof-correction note
- [CS234 Lecture 10 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf) — pp. 1–17: quiz and solutions, the COVID case, the Theorem 7.1 proof outline
- [CS234 Lecture 11 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture11post.pdf) — the "What You Should Understand" learning goals
- [Lattimore & Szepesvári, Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) — Corollary 5.5 and Theorem 7.1 in Section 7.1
- [Bastani et al., Efficient and targeted COVID-19 border testing via reinforcement learning (Nature 2021)](https://www.nature.com/articles/s41586-021-04014-z) — L10's real-world case
- [Stanford CS234 Spring 2024 playlist, video 11 "Exploration 1"](https://www.youtube.com/watch?v=sqYii3nd78w) — public recording (2024 offering; lectures don't align exactly with 2026)
