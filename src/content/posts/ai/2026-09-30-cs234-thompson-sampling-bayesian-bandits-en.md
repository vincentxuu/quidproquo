---
title: "CS234 Data Efficiency II: Bayesian Bandits, Thompson Sampling, and the Gittins Index"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, exploration, multi-armed-bandit, bayesian-statistics]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 14
tldr: "CS234 L11 switches the logic of exploration from optimism to sampling. Thompson sampling keeps a posterior for each arm, draws one value from each posterior at every step, and pulls the arm with the largest draw. With Bernoulli rewards and a Beta prior, the update just adds one to the success or failure count. It implements probability matching: each arm is chosen with the posterior probability that it is the best arm. Under Bayesian regret it matches UCB's order, and with batched, delayed feedback it suits the problem better than deterministic UCB. The cost: a badly wrong prior can make it perform poorly."
description: "A guide to Stanford CS234 (Winter 2026) L11: Bayesian bandits and a Bayesian inference refresher, the Beta-Bernoulli conjugate update, the Thompson sampling algorithm with the broken-toe example worked step by step, probability matching, frequentist versus Bayesian regret, contextual TS for news recommendation, the TS-vs-optimism quiz, the Gittins index, and the PAC toy example."
draft: false
glossary:
  - term: "Thompson sampling"
    aliases: ["TS", "posterior sampling"]
    definition: "A Bayesian bandit algorithm: at each step, draw one sample from each action's reward posterior, pick the action with the largest sample, observe the reward, and update that action's posterior with Bayes rule."
    context: "The core algorithm of CS234 L11; L12 carries the same idea over to MDPs (PSRL)."
  - term: "probability matching"
    definition: "A decision rule that chooses each action with the posterior probability that it is the optimal action. Computing that probability directly is usually hard; Thompson sampling implements it with a single draw."
    context: "The key idea in CS234 L11 for why TS works."
  - term: "Gittins index"
    definition: "The optimal policy for maximizing expected discounted reward in a Bayesian multi-armed bandit. It is an index policy: it computes a real-valued index for each arm using only that arm's statistics and plays the arm with the largest index."
    context: "CS234 L11 uses it to answer whether Thompson sampling is optimal."
  - term: "Bayesian regret"
    definition: "Regret with an additional expectation over the prior on parameters. Frequentist regret assumes one fixed set of true parameters; Bayesian regret averages over possible problems."
    context: "The framework CS234 L11 uses to evaluate Thompson sampling."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-thompson-sampling-bayesian-bandits)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

> **Version note**: This post is based on the Winter 2026 slides of [CS234](https://web.stanford.edu/class/cs234/). The public recordings are the [Spring 2024 offering](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX); this post corresponds to video 12, "Exploration 2" (per its YouTube chapters: limits of UCB, PAC, optimistic initialization, Bayesian bandits, and Thompson sampling). Every fact was checked on 2026-09-30 against the [Lecture 11 slides](https://web.stanford.edu/class/cs234/slides/lecture11post.pdf) (post-class, 50 pages). The PDF's title page says "Lecture 13" and notes below it, "Typo: Lecture 11". Access grade **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)): the slides are public; the 2026 recordings are on Canvas for enrolled students only.

**Series**: previous [Data efficiency I: bandits, regret, UCB](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en) | next [Data efficiency III: PAC, MBIE-EB, PSRL, and strategic exploration in MDPs](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

The previous post's UCB assumes only that rewards are bounded; it makes no assumption about what the reward distribution looks like. Its exploration follows a deterministic rule: add a confidence width to each arm and pick the largest.

L11 takes another angle: **if you have prior knowledge about rewards, can you use it?** The answer is Bayesian bandits, and their best-known algorithm, Thompson sampling, explores with a completely different logic. Instead of guessing high, it draws lots according to what you currently believe.

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=gFJNsfg_35E
title: Stanford CS234 Spring 2024 playlist, video 12 "Exploration 2"
```

Original videos: [Stanford CS234 Spring 2024 playlist, video 12 "Exploration 2"](https://www.youtube.com/watch?v=gFJNsfg_35E)

Course and recording entries:

- [Spring 2024 offering](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

The Winter 2026 official Lecture Materials page lists slides only and no recordings; the public YouTube playlist is Spring 2024. Checked: 2026-10-10.

## Opening: a quiz on deterministic rewards

L11 opens with a quiz: what happens to UCB if the bandit's rewards are deterministic?

The official solution: in a deterministic setting, one pull makes an arm's average reward **exactly equal** to its true expectation. The confidence bounds hold with 100% probability (not just 1 − δ), so UCB has sublinear regret with probability 1. There is no division by zero either.

The quiz checks that you understand the role of the good event in the UCB proof: the probability that it fails is where the extra terms in the regret bound come from.

The slides then show the mid-quarter class survey: students liked the tutorials most and wanted more high-level structure, conceptual understanding, and examples in lectures. Brunskill says she will emphasize concepts and give concrete examples. L11 follows through: the broken-toe example takes up about ten slides.

## A Bayesian inference refresher

The Bayesian view: put a prior on the unknown parameters, and after observing data, update your uncertainty about them with Bayes rule.

For bandits, the unknowns are each arm's reward distribution. Let arm i's reward distribution depend on a parameter φ_i with prior p(φ_i). After one pull that returns r_i1:

```text
p(φ_i | r_i1) = p(r_i1 | φ_i) p(φ_i) / ∫ p(r_i1 | φ_i) p(φ_i) dφ_i
```

The integral in the denominator is usually hard. But if the prior and posterior have the same parametric form, they are called **conjugate**, and the update has a closed form. Exponential families have conjugate priors.

The most common pairing in bandits is Bernoulli rewards with a Beta prior. Rewards are 0 or 1; examples include ad click-through and treatment success or failure. With a Beta(α, β) prior, after observing r ∈ {0, 1}, the posterior is Beta(r + α, 1 − r + β).

In other words: **on success, add one to the first parameter; on failure, add one to the second.** That is the entire Bayesian update.

The slides then lay out the overall Bayesian bandit structure: keep a posterior over rewards p[R | h_t], where h_t is the history of actions and rewards so far, and use it to guide exploration. The two ways to use it are Bayesian UCB and probability matching (Thompson sampling). If the prior knowledge is accurate, performance is better.

## Thompson sampling

The algorithm is only a few lines:

```text
1: Initialize a prior p(R_a) for each arm a
2: for iteration = 1, 2, ... do
3:     For each arm a, sample a reward distribution R_a from the posterior
4:     Compute Q(a) = E[R_a]
5:     a_t = argmax_a Q(a)
6:     Observe reward r
7:     Update p(R_a_t) with Bayes rule
8: end for
```

Compared with UCB: UCB picks the arm with the largest upper bound; TS picks the arm with the largest draw this time. The first is deterministic, the second random.

## The broken toes, step by step

L11 reuses the previous post's broken-toe example (surgery 0.95, taping 0.9, doing nothing 0.1; the slides again note it is made up). All three arms start with a Beta(1,1) prior, the uniform distribution on [0, 1]. The slides walk through it:

| Step | Current posteriors (surgery, taping, nothing) | Draws | Pick | Outcome | Update |
|---|---|---|---|---|---|
| 1 | Beta(1,1), Beta(1,1), Beta(1,1) | 0.3, 0.5, 0.6 | nothing | 0 | nothing → Beta(1,2) |
| 2 | Beta(1,1), Beta(1,1), Beta(1,2) | 0.7, 0.5, 0.3 | surgery | 1 | surgery → Beta(2,1) |
| 3 | Beta(2,1), Beta(1,1), Beta(1,2) | 0.71, 0.65, 0.1 | surgery | 1 | surgery → Beta(3,1) |
| 4 | slide still shows Beta(2,1), … | 0.75, 0.45, 0.4 | surgery | 1 | surgery → Beta(4,1) |

Things worth noticing:

- At step 1 all three priors are identical, so the pick is pure luck. This time it drew "do nothing", which failed, and its posterior shifts toward 0.
- From step 2 on, surgery succeeds repeatedly, its posterior concentrates on high values, and its chance of producing the largest draw keeps rising.
- The step-4 posterior column on the slide reads Beta(2,1), but following the previous update it should be Beta(3,1). The final update to Beta(4,1) is consistent, so it looks like the slide was copied from the previous page without the change.

The slides end with a question: how does the sequence of arm pulls so far compare between optimism and TS? Put the previous post's hand-worked UCB run next to this one.

## Why it works: probability matching

L11 then explains what TS is doing. First, probability matching: **choose action a with the posterior probability that a is the optimal action**:

```text
π(a | h_t) = P[ Q(a) > Q(a'), ∀a' ≠ a | h_t ]
```

Computing this directly from the posterior is hard; it requires integrating over the joint distribution of all arms. In the slide's words, "somewhat incredibly", Thompson sampling implements probability matching: when you draw one set of values from the posterior and pick the largest, the probability that a gets picked is exactly E_{R|h_t}[1(a = argmax Q(a))].

The slide adds that probability matching is often optimistic in the face of uncertainty too, because **uncertain actions have a higher probability of producing the max**. So TS doesn't abandon optimism; it implements it probabilistically.

## How to evaluate it: frequentist and Bayesian regret

What framework should judge TS? L11 separates two kinds of regret:

- **Frequentist regret** assumes one fixed, unknown set of true parameters θ, and takes the expectation over the history of actions and rewards the algorithm produces. The previous post's UCB bound is of this kind.
- **Bayesian regret** adds a layer: the parameters themselves are drawn from a prior, and you take the expectation over the prior too.

The slides also review how optimism bounds regret: under the event that U_t really is an upper bound, each step's regret Q(a*) − Q(a_t) is at most U_t(a_t) − Q(a_t), the confidence width.

TS's theoretical standing comes down to two points:

- Frequentist bounds for standard TS do not (the slide says "last checked") match the best frequentist algorithms
- Under **Bayesian regret**, posterior sampling has the same regret bounds as UCB, ignoring constants (L11 p. 49)

Plus one empirical observation: **TS can be effective in practice, especially in contextual multi-armed bandits.**

## Contextual TS: news recommendation

A contextual bandit adds an input context that affects each arm's reward, drawn i.i.d. at each step. The slides use news recommendation as the example (citing work by Chapelle and Li):

- Arms = articles
- Reward = whether the user clicks (+1)
- Q(a) = click-through rate

Then comes a very practical quiz. A news site has thousands of people logging on every second, and often the next person arrives before we know whether the last one clicked. The official solutions:

1. **True**: TS is better than optimism here, because optimism algorithms are deterministic and would keep selecting the same action until feedback arrives
2. **False**: optimism does not have stronger regret bounds in this setting
3. **True**: TS can do much worse than optimism if the initial prior is very misleading. The slide's example: a Beta(100,1) prior on a Bernoulli arm whose true parameter is 0.1 puts most of its weight on high values for a long time

Point 1 answers the "batched, delayed feedback" in the previous post's COVID case: a deterministic algorithm making batch decisions picks the same arm for the whole batch, while TS's randomness naturally spreads exploration out.

## Is TS optimal? The Gittins index

TS often works well, but is it optimal? L11 answers in two layers.

In principle you can do better: given a prior and a known horizon, you can compute the decision policy that maximizes expected reward. The problem is computation: done naively, that gives a policy mapping the entire history to the next arm, far too large to compute.

Then it introduces **index policies**: compute a real-valued index for each arm, using only that arm's statistics and the horizon, and play the arm with the largest index (the slides cite the definition from Lattimore and Szepesvári's *Bandit Algorithms*). The **Gittins index** is such a policy, and it is the optimal policy for maximizing expected **discounted** reward in a Bayesian multi-armed bandit.

The slides stop there, with no method for computing the Gittins index and no proof. To go deeper, see [Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf).

## PAC: a preview of another framework

The "Today" lists in both L10 and L11 include "Bandits and Probably Approximately Correct", but in both slide decks the only concrete PAC content is the toy example on L11's last page:

- Same broken-toe example, with ε = 0.05
- Besides logging the regret of optimism (O) and TS at each step, add a "W/in ε" column: whether the chosen action is within ε of the optimal value, the indicator I(Q(a_t) ≥ Q(a*) − ε)

The intuition: regret counts how much you lose in total, while PAC cares about **how many steps are not ε-optimal**. In this example, taping (0.9) is exactly 0.05 below surgery (0.95), so choosing taping still counts as within ε; only choosing "do nothing" is a mistake.

The formal definition of PAC and its MDP version are the subject of the next post, [order 15](/posts/ai/2026-09-30-cs234-fast-rl-mdps-exploration-en) (L12).

## The learning goals list

L11 p. 47 lists what you should be able to do after the bandit section. Use it as a self-check:

- Understand how multi-armed bandits relate to MDPs
- Be able to define regret and PAC
- Be able to prove why the UCB bandit algorithm has sublinear regret
- Be able to give an example of why ε-greedy, greedy, and pessimism can result in linear regret
- Be able to implement the UCB bandit algorithm
- Be able to implement Thompson sampling for Bernoulli rewards

## How to self-study it

1. **Work the first four steps of the broken toes by hand.** Following the table above, draw from the Beta distributions with your own random numbers and see which arm you would pick.
2. **Implement Bernoulli TS.** Add TS to the previous post's UCB1 simulation on the same three arms and compare their cumulative regret curves.
3. **Run a batch experiment.** Deliver rewards only every 50 steps and see what happens to UCB1 and TS. This is the setting of L11's news recommendation quiz.
4. **Run a wrong-prior experiment.** Put Beta(100,1) on the "do nothing" arm and see how long TS takes to discover it is actually bad.

One thing you can do tonight: write a 20-line Bernoulli Thompson sampler with numpy's `np.random.beta`, run the broken toes for 1,000 steps, and print each arm's final Beta parameters. You'll see surgery's parameters are much larger, and "do nothing" was probably pulled only a handful of times.

## Further reading

- Exploration in deep RL (count-based, posterior sampling, and more): [Berkeley CS285 L19–25: Exploration, RL Theory, and Open Problems](/posts/learning/2026-08-22-berkeley-cs285-exploration-open-problems-en)
- Course positioning, access gaps, and the 2024 video mapping: [Reading Stanford CS234 (series overview)](/posts/ai/2026-09-30-cs234-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Embedded videos are from an earlier public term, not the 2026 course, so status changed to related supplementary.

## References

- [CS234 course homepage (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule and learning outcomes
- [CS234 lecture materials page](https://web.stanford.edu/class/cs234/modules.html) — the "Data Efficient RL" module (L9–L12)
- [CS234 Lecture 11 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture11post.pdf) — deterministic bandit quiz, Bayesian inference, Beta-Bernoulli, Thompson sampling, broken toes, probability matching, Bayesian regret, contextual TS, Gittins index, PAC toy example, learning goals
- [CS234 Lecture 10 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture10post.pdf) — the "Today" list previewing Bayesian bandits and PAC
- [Lattimore & Szepesvári, Bandit Algorithms](https://tor-lattimore.com/downloads/book/book.pdf) — the index policy definition cited in L11
- [Stanford CS234 Spring 2024 playlist, video 12 "Exploration 2"](https://www.youtube.com/watch?v=gFJNsfg_35E) — public recording (2024 offering; lectures don't align exactly with 2026)
