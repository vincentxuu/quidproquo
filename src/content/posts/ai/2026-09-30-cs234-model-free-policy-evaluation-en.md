---
title: "Reading CS234: Evaluating a Policy Without a Model — MC, TD(0), and Certainty Equivalence"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, temporal-difference, mdp]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 4
tldr: "If you don't know the transition probabilities or rewards, how do you estimate what a policy is worth? CS234 Lecture 3 gives three answers. Monte Carlo averages full-trajectory returns: unbiased, high variance, and it has to wait for the episode to end. TD(0) targets one real reward plus the next state's estimate: biased, lower variance, and it updates every step. Certainty equivalence estimates a model and then runs dynamic programming: the most data-efficient and the most expensive to compute. The AB example at the start of Lecture 4 makes the difference plain: on the same data, MC says V(A)=0 and TD says V(A)=0.75."
description: "A guide to Stanford CS234 (Winter 2026) Lecture 3 and the opening of Lecture 4: first-visit, every-visit, and incremental Monte Carlo; bias, variance, and consistency; TD(0) and the TD error; the Mars rover example; the cost of certainty equivalence; and what batch MC and TD converge to (Sutton & Barto's AB example)."
draft: false
glossary:
  - term: "bootstrapping"
    aliases: ["bootstrap"]
    definition: "In RL, building an update target from your own current value estimate, e.g. using V(s′) in place of the expected sum of all rewards after s′."
    context: "L3 points out that dynamic programming and TD bootstrap; Monte Carlo does not."
  - term: "TD error"
    aliases: ["temporal difference error", "δ_t"]
    definition: "δ_t = r_t + γV(s_{t+1}) − V(s_t): the gap between the TD target and the current estimate. TD(0) moves V(s_t) by α times this amount each step."
    context: "The L3 TD(0) update is V(s_t) ← V(s_t) + α·δ_t."
  - term: "certainty equivalence"
    aliases: ["MLE MDP"]
    definition: "Compute maximum-likelihood estimates of the transitions and rewards from data, treat that estimated MDP as the true one, and solve for V^π with dynamic programming."
    context: "The third evaluation method in L3; L4 shows batch TD(0) converges to exactly its answer."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Edition note**: This guide follows the Winter 2026 [Lecture 3 slides](https://web.stanford.edu/class/cs234/slides/lecture3post.pdf) (post-class version, 57 pages) and [Lecture 4 slides](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) pp. 5–15 of [CS234](https://web.stanford.edu/class/cs234/). The public recording is Spring 2024's [video 3, "Policy Evaluation"](https://www.youtube.com/watch?v=jjq51TRNVvk); I haven't compared it page by page against the 2026 slides. Facts were checked against the official slides on 2026-09-30. Access level **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)): the slides are public; live Poll Everywhere responses and the 2026 recordings are not.

**Series**: Previous: [Assignment 1: Effective Horizon, Reward Hacking, Bellman Residuals, RiverSwim](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en) | Next: [Control Without a Model: ε-greedy, GLIE, Q-learning, Function Approximation](/posts/ai/2026-09-30-cs234-model-free-control-function-approx-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

Up to the [previous lecture](/posts/ai/2026-09-30-cs234-mdp-planning-en), we assumed a complete model: the probability of landing in each state after each action, and the reward you get. Real problems almost never hand you that. All you can do is run the policy and watch which states it visits and which rewards it collects.

Lecture 3's title states the problem outright: **Policy Evaluation Without Knowing How the World Works**. Today is only about evaluation: given a fixed policy π, estimate its value V^π. Improving the policy (control) waits for the next lecture. The slides also say up front that today's data comes from running π itself (on-policy). Evaluating π with data from other policies comes later.

The listed readings are sections 5.1, 5.5, and 6.1–6.3 of [Sutton & Barto, 2nd edition](http://incompleteideas.net/book/the-book-2nd.html), and the structure follows David Silver's Lecture 4.

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=jjq51TRNVvk
title: Stanford CS234 Spring 2024 Lecture 3, "Policy Evaluation"
```

Original videos: [Stanford CS234 Spring 2024 Lecture 3, "Policy Evaluation"](https://www.youtube.com/watch?v=jjq51TRNVvk)

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## Back to dynamic programming: it already borrows its own estimate

L3 opens by recalling DP policy evaluation:

V_k^π(s) = r(s, π(s)) + γ Σ_{s′} p(s′ | s, π(s)) V_{k−1}^π(s′)

The slides point out that this substitutes Σ p(s′|s,π(s)) V_{k−1}^π(s′) for "the expected return from the next step onward." **Building the update target from your own estimate** is called bootstrapping. Without a model, the Σ p(s′|…) term can't be computed. The three methods below differ in how they deal with it.

The warm-up questions are worth a look too. One asks whether, in a tabular MDP, value iteration asymptotically yields a policy with the same value as policy iteration. Yes: both are guaranteed to converge to optimal. Another asks whether value iteration can need more than |A||S| iterations. Yes. The slides' counterexample is one state, one action, r = 1, γ = 0.9, V_0 = 0. V* is 1/(1 − γ), but after the first iteration V_1 is only 1, and it takes infinitely many iterations to get there.

## Monte Carlo: value is the average return

The most direct idea: V^π(s) is the expected return starting from s, so run π many times and average the returns G_t observed from s.

The slides list MC's properties (L3 pp. 10–11):

- No transition or reward model needed
- **Does not assume the state is Markov**
- Episodic settings only: every trajectory must end before you have a full return

### Three flavors of MC

| Version | How it works | Properties (L3 p. 26) |
|---|---|---|
| First-visit MC | In each trajectory, average only the return from the **first** time s appears | Unbiased; by the law of large numbers, converges to the true value as N(s) → ∞ |
| Every-visit MC | Average a return every time s appears | Biased, but consistent, and often better MSE |
| Incremental MC | V(s) ← V(s) + α(G_{i,t} − V(s)) | Properties depend on the learning rate α |

The incremental update is worth memorizing. The slides say many algorithms ahead take this shape: **a learning rate, a target, and an incremental update**. With α = 1/N(s), it equals every-visit MC. With α larger than 1/N(s), it weights recent data more, which the slides say can help in non-stationary domains.

α can vary with the update count. The slides' convergence condition is Σ_n α_n = ∞ and Σ_n α_n² < ∞; when both hold, incremental MC converges to the true V^π.

### Yardsticks for an estimator

L3 pauses here to define terms used for the rest of the course (pp. 23–25):

- **Bias**: how far the estimator's expectation is from the true value
- **Variance**: how much the estimator itself wobbles
- **MSE** = Variance + Bias²
- **Consistency**: as data grows, the probability of missing the true value by more than any ε goes to 0

The slides leave a question for you: is an unbiased estimator always consistent? Other practical criteria listed are computational cost, memory, and statistical efficiency, meaning how accurate the estimate gets for a given amount of data.

### Where MC falls short

The slides are blunt (p. 28): MC is generally a **high-variance** estimator, and reducing variance can take a lot of data. When data is expensive or the stakes are high, it may be impractical. And the episode has to end before you can update.

But one line is easy to miss (p. 29): **even when you know the true model, MC is sometimes preferred over dynamic programming.** MC doesn't assume Markov and doesn't sum over every state; if you can simulate, you can estimate.

## TD(0): one real reward plus the next state's estimate

L3 quotes Sutton & Barto: if one had to identify one idea as central and novel to RL, it would undoubtedly be temporal-difference (TD) learning.

TD takes half from MC and half from DP:

- Like MC, it **samples**: no model, just the (s, a, r, s′) actually experienced
- Like DP, it **bootstraps**: instead of waiting for the full trajectory, it uses the current V(s′) to stand in for the rest of the return

The update:

V^π(s_t) ← V^π(s_t) + α([r_t + γV^π(s_{t+1})] − V^π(s_t))

The bracketed r_t + γV^π(s_{t+1}) is the **TD target**. Its gap from the current estimate, δ_t = r_t + γV^π(s_{t+1}) − V^π(s_t), is the **TD error**. Because TD can update after every (s, a, r, s′), it **doesn't need an episodic setting** and works for infinite-horizon tasks.

### Mars rover: same trajectory, MC and TD update different things

L3 reuses the Mars rover from the previous lecture (pp. 35–36). There are 7 states, R = [1 0 0 0 0 0 10] regardless of action, π always picks a1, and any action from s1 or s7 ends the episode. The observed trajectory:

(s3, a1, 0, s2, a1, 0, s2, a1, 0, s1, a1, 1, terminal)

- **TD(0)** with α = 1 and V initialized to 0: after this trajectory, V = [1 0 0 0 0 0 0]. Only s1 becomes nonzero, because when s3→s2, s2→s2, and s2→s1 were updated, the next state's estimate was still 0.
- **First-visit MC** (γ = 1): V = [1 1 1 0 0 0 0]. s1, s2, and s3 all receive that final +1.

The slides' last page sums up the difference: **TD(0) uses each data point only once; MC uses the entire return from s to the end of the episode.** TD needs more trajectories before the reward information propagates back, one step at a time.

### What happens at α = 1

A poll (L3N2) asks about TD at extreme values of α. The slides' correct answers:

- At α = 1, TD replaces the estimate with the TD target
- At α = 1, if the policy passes through states with multiple possible next states, V may **oscillate forever**
- There exist deterministic MDPs where α = 1 TD converges

"At α = 0, TD weighs the TD target more" is false: at α = 0 nothing updates at all.

### Properties of TD

The TD summary in L3 (p. 40):

- Biased: early on, it's influenced by initialization
- Generally **lower variance than MC**
- Consistent if the learning rate meets the same conditions as incremental MC
- The algorithm shown is TD(0); in general there are methods that interpolate between TD(0) and MC

The bias–variance comparison later (p. 56) explains why. The return G_t is a function of a multi-step sequence of random actions, states, and rewards. The TD target involves **one** random action, one reward, and one next state. So G_t is unbiased but high-variance, and the TD target is biased but low-variance. The slides also preview a difference that matters soon. MC stays consistent even with function approximation. TD(0) converges to the true value with a tabular representation, but **doesn't always converge with function approximation**. The next post runs into this.

## Certainty equivalence: estimate a model, then trust it

The third method is actually model-based (L3 pp. 42–43). After each (s, a, r, s′), recompute the maximum-likelihood model:

- P̂(s′ | s, a) = count of transitions from (s, a) to s′ / N(s, a)
- r̂(s, a) = total reward received at (s, a) / N(s, a)

Then feed the estimated MDP to any DP method from the previous lecture to compute V^π.

The trade-offs listed on the slides:

| Aspect | Notes |
|---|---|
| Data efficiency | Very high |
| Computational cost | Very high: each update refits the model and replans, O(\|S\|³) for the analytic solution, O(\|S\|²\|A\|) for iterative methods |
| Convergence | Consistent for Markov models |
| Bonus | Easy to use for off-policy evaluation |

The slides include an optional exercise: what does certainty equivalence estimate from the same Mars rover trajectory? The solution pages (pp. 50–51) estimate p̂(s2|s2, a1) = p̂(s1|s2, a1) = 0.5, then solve V = (I − γP)^{−1}R for s1, s2, and s3. The solution page flags its own typo (V(s1) should be 1), so watch for it if you check your work against it.

## Batch setting: same data, different answers from MC and TD

The start of L4 finishes off L3 (L4 pp. 8–13). The MC and TD methods above use each data point once and throw it away. With a fixed set of K episodes, you can instead sample an episode from the set over and over, apply MC or TD(0), and run to convergence. What does each converge to?

The slides use Sutton & Barto's Example 6.4, the **AB example**. Two states A and B, γ = 1, and 8 episodes:

- A, 0, B, 0 (once)
- B, 1 (six times)
- B, 0 (once)

V(B) is uncontroversial: 6 of 8 visits returned 1, so both MC and TD give **0.75**. V(A) is the point. The slides' answer: **V^MC(A) = 0 and V^TD(A) = 0.75.**

Why (L4 p. 13):

- **Batch MC** converges to the minimum-MSE fit to the observed returns. A appeared once, with return 0, so V(A) = 0.
- **Batch TD(0)** converges to DP on the maximum-likelihood model, **which is certainty equivalence**. The data says A always goes to B, and B is worth 0.75, so V(A) = 0.75.

Which is right depends on whether the world is Markov. The comparison on L4 p. 14 ties this to efficiency. TD(0) does an O(1) update per data point, O(L) for an episode of length L. MC is also O(L), but has to wait for the episode to finish. MC can be more data-efficient than simple TD, but **TD exploits Markov structure**, which helps if the domain really is Markov. Certainty equivalence exploits it too.

## The three methods side by side

| | Monte Carlo | TD(0) | Certainty equivalence |
|---|---|---|---|
| Needs a model | No | No | Estimates one from data |
| Assumes Markov | No | Exploits it | Exploits it |
| Needs episodes to end | Yes | No | No |
| Bias | First-visit is unbiased | Biased | — |
| Variance | High | Lower | — |
| Compute per update | Low | O(1) | High (replanning) |
| Batch converges to | Min MSE on observed returns | The CE answer | Itself |

The L4 p. 15 summary gives an application: evaluating average purchases per session for a new product recommendation system. That's the textbook case of no world model, only data from running the policy.

## How to self-study it

1. Read [L3](https://web.stanford.edu/class/cs234/slides/lecture3post.pdf) pp. 10–43, then [L4](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) pp. 5–15. The optional worked examples and answers are gathered in L3 pp. 44–57.
2. The public recording is 2024's [Lecture 3, "Policy Evaluation"](https://www.youtube.com/watch?v=jjq51TRNVvk). Use it as a listening supplement; it may not split topics the same way as the 2026 slides.
3. Read along in [Sutton & Barto](http://incompleteideas.net/book/RLbook2018.pdf) 5.1, 5.5, 6.1–6.3; the AB example is Example 6.4.
4. Hands-on: in Python, run first-visit MC, every-visit MC, and α = 1 TD(0) on the Mars rover trajectory and check that your vectors match the slides. Then feed the 8 AB episodes to batch MC and batch TD and watch them settle at 0 and 0.75.

One thing to do tonight: just the AB example. Before looking at the answer, write down on paper what you think V(A) should be and why. Then compare against both algorithms and ask which assumption your intuition was making.

## Further reading

- The same topic in CS221 (an introductory take on TD and Q-learning): [CS221 Lecture 8: Reinforcement Learning and Q-learning](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning-en)
- Policy evaluation and value-based methods from a deep RL angle: [Berkeley CS285: Policy and Value Methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS234 course home (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule: Week 2 "Policy Evaluation" and "Q-learning and function approximation"
- [CS234 lecture materials page](https://web.stanford.edu/class/cs234/modules.html) — pre- and post-class slide links for L3 and L4
- [CS234 Lecture 3 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture3post.pdf) — MC, TD(0), certainty equivalence, bias/variance, Mars rover example
- [CS234 Lecture 4 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) — pp. 5–15: batch MC/TD, the AB example, efficiency comparison
- [Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed.)](http://incompleteideas.net/book/the-book-2nd.html) — supporting reading listed by the course; 5.1, 5.5, 6.1–6.3 and Example 6.4
- [Stanford CS234 Spring 2024 Lecture 3, "Policy Evaluation"](https://www.youtube.com/watch?v=jjq51TRNVvk) — public recording (2024 edition)
- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — all 16 public recordings
