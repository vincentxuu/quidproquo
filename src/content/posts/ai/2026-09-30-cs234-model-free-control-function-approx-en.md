---
title: "Reading CS234: Control Without a Model — ε-greedy, GLIE, Q-learning, and Function Approximation"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, q-learning, function-approximation]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 5
tldr: "Once you can evaluate a policy, the next step is to improve it while you collect data. CS234 Lecture 4 goes like this: ε-greedy keeps policy improvement monotonic; GLIE says how much to explore and when to stop; Q-learning converges to Q* under GLIE plus Robbins–Monro step sizes; and finally the table becomes a parameterized Q̂(s,a;w) trained by SGD on MC, SARSA, or Q-learning targets. The price is the deadly triad: function approximation, bootstrapping, and off-policy learning together can oscillate or diverge."
description: "A guide to Stanford CS234 (Winter 2026) Lecture 4 pp. 16–60: model-free policy iteration, exploration vs. exploitation, the ε-greedy monotonic improvement theorem, GLIE and GLIE MC control, on- vs. off-policy learning, SARSA and Q-learning convergence conditions, MC and TD targets for value function approximation, and the deadly triad."
draft: false
glossary:
  - term: "GLIE"
    aliases: ["Greedy in the Limit of Infinite Exploration"]
    definition: "Two conditions: every state-action pair is visited infinitely often, and the behavior policy converges to the policy that is greedy with respect to Q. ε-greedy with ε decaying as 1/i satisfies it."
    context: "L4 uses it as the premise of the convergence theorems for MC control and Q-learning."
  - term: "off-policy learning"
    aliases: ["off-policy"]
    definition: "Estimating and evaluating one (usually target) policy from experience gathered by a different behavior policy. On-policy learning, by contrast, learns about the policy that generated the experience."
    context: "Q-learning is off-policy: it acts ε-greedily but estimates the Q-values of the optimal policy."
  - term: "deadly triad"
    definition: "When function approximation, bootstrapping, and off-policy learning appear together, value learning can oscillate or fail to converge."
    context: "L4's explanation: the Bellman operator is a contraction, but the function-approximation fitting step can be an expansion."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-model-free-control-function-approx)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Edition note**: This guide follows pp. 16–60 and the optional worked examples on pp. 80–89 of the Winter 2026 [Lecture 4 slides](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) (post-class version, 89 pages) of [CS234](https://web.stanford.edu/class/cs234/). The DQN material on pp. 62–78 belongs to the next post. The public recording is Spring 2024's [video 4, "Q learning and Function Approximation"](https://www.youtube.com/watch?v=b_wvosA70f8); I haven't compared it page by page against the 2026 slides. Facts were checked against the official slides on 2026-09-30. Access level **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)).

**Series**: Previous: [Evaluating Without a Model: MC, TD(0), Certainty Equivalence](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation-en) | Next: [DQN: The Deadly Triad, Experience Replay, Fixed Targets](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

The [previous post](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation-en) covered estimating the value of a **fixed** policy without a model. What we actually want isn't "how good is this policy" but "how do I find a better one." That's control.

Lecture 4 is titled **Model Free Control and Function Approximation**, and it does two things. First it carries policy iteration over to the model-free world in the tabular setting. Then it replaces the table with a parameterized function. The listed readings are [Sutton & Barto](http://incompleteideas.net/book/the-book-2nd.html) sections 5.2–5.4, 6.4, 6.5, and 6.7, and the structure follows David Silver's Lectures 5 and 6. Slide 2 shows deep RL playing Atari, so you know where the lecture is headed.

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=b_wvosA70f8
title: Stanford CS234 Spring 2024 Lecture 4, "Q learning and Function Approximation"
```

Original videos: [Stanford CS234 Spring 2024 Lecture 4, "Q learning and Function Approximation"](https://www.youtube.com/watch?v=b_wvosA70f8)

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## Carrying policy iteration over to the model-free world

Policy iteration with a model alternates "evaluate → improve greedily." L4 p. 17 points out three things that change without a model:

1. **Evaluation computes Q, not V.** Without a model, knowing V^π doesn't tell you what happens if you take a different action, because you can't compute Σ p(s′|s,a)V(s′). To improve the policy directly, you need Q^π(s, a).
2. **Deterministic policies get stuck.** If π is deterministic, you only ever see action π(s), so Q(s, a) for any other action can't be estimated.
3. **Improvement uses an estimated Q**, and how to interleave evaluation and improvement needs rethinking.

Point 2 is the **exploration problem** (p. 18). You can't learn whether an action is good without trying it. But time spent trying new actions is time not spent on actions your experience says pay well.

## ε-greedy: the simplest balance, and improvement stays monotonic

An ε-greedy policy (p. 19) picks argmax_a Q(s, a) with probability 1 − ε, and otherwise picks uniformly among the |A| actions. The argmax action's total probability is 1 − ε + ε/|A|, and every other action gets ε/|A|.

The previous lecture's "policy iteration improves monotonically" proof assumed improvement outputs a deterministic policy. L4 pp. 20–21 gives the ε-greedy version:

> For any ε-greedy policy π_i, the ε-greedy policy with respect to Q^{π_i}, π_{i+1}, is a monotonic improvement: V^{π_{i+1}} ≥ V^{π_i}.

<details>
<summary>The key step of the proof (L4 p. 80)</summary>

Expand Q^{π_i}(s, π_{i+1}(s)) as Σ_a π_{i+1}(a|s) Q^{π_i}(s, a) = (ε/|A|) Σ_a Q^{π_i}(s, a) + (1 − ε) max_a Q^{π_i}(s, a).

Then replace the max with a weighted average, using weights (π_i(a|s) − ε/|A|) / (1 − ε). These weights are nonnegative and sum to 1 (because π_i itself is ε-greedy), and no weighted average exceeds the max. Substituting back, the two ε/|A| terms cancel, leaving Σ_a π_i(a|s) Q^{π_i}(s, a) = V^{π_i}(s).

So Q^{π_i}(s, π_{i+1}(s)) ≥ V^{π_i}(s), and the rest of the argument matches policy improvement with a model.

</details>

## MC control and GLIE: explore a lot, then stop

Switch the previous post's first-visit MC to estimate Q(s, a), apply an ε-greedy improvement after every episode, and you get **MC online control** (pp. 24–25). In the slides' pseudocode, ε starts at 1 and is set to ε = 1/k after episode k.

That schedule isn't arbitrary. L4 pp. 29–30 defines **GLIE** (Greedy in the Limit of Infinite Exploration):

1. Every state-action pair is visited **infinitely many times**
2. The behavior policy (the one actually used to act) converges to the greedy policy with respect to Q, with probability 1

The slides say ε-greedy with ε_i = 1/i is a simple GLIE strategy. The theorem (p. 31): **GLIE Monte-Carlo control converges to the optimal Q*(s, a).**

### Work one by hand

An optional example on p. 26 (solution on p. 82): the Mars rover gets a second action, with r(·, a1) = [1 0 0 0 0 0 10], r(·, a2) = [0 0 0 0 0 0 5], and γ = 1. The current greedy policy picks a1 everywhere, ε = 0.5, and Q starts at 0. The ε-greedy policy produces this trajectory:

(s3, a1, 0, s2, a2, 0, s3, a1, 0, s2, a2, 0, s1, a1, 1, terminal)

First-visit MC gives Q(·, a1) = [1 0 1 0 0 0 0] and Q(·, a2) = [0 1 0 0 0 0 0]. The new greedy policy is [a1, a2, a1, tie, tie, tie, tie]. If the new ε is 1/3, the probability of choosing a1 in s1 is 1 − 1/3 + (1/3)/2 = **5/6**.

## TD control: SARSA and Q-learning

MC control has to wait for the episode to end. Swap evaluation to TD and you can update every step (p. 33). First, two kinds of learning (p. 34):

- **On-policy**: learn about a policy from experience gathered by **following that policy**
- **Off-policy**: estimate and evaluate a target policy using experience gathered by **a different policy**

The two algorithms differ in a single term of the TD target:

| | Update | Type |
|---|---|---|
| SARSA | Q(s_t, a_t) ← Q(s_t, a_t) + α(r_t + γQ(s_{t+1}, a_{t+1}) − Q(s_t, a_t)) | On-policy: uses the next action actually taken |
| Q-learning | Q(s_t, a_t) ← Q(s_t, a_t) + α(r_t + γ max_{a′} Q(s_{t+1}, a′) − Q(s_t, a_t)) | Off-policy: uses the best action at the next state |

The Q-learning idea (p. 35): act with a behavior policy π_b (e.g. ε-greedy on Q) while estimating the Q-values of **the optimal policy π***.

### Same data, a factor of two apart

The optional examples (pp. 83–87) compute the difference. Continuing the two-action Mars rover, with α = 0.5, Q(·, a1) initialized to [1 0 0 0 0 0 10] and Q(·, a2) to [1 0 0 0 0 0 5], start at s6 and take a1:

- **SARSA**, observing (s6, a1, 0, s7, a2, 5, s7): the next action actually taken was a2, so Q(s6, a1) = 0.5 × 0 + 0.5 × (0 + Q(s7, a2)) = **2.5**
- **Q-learning**, observing (s6, a1, 0, s7): take the max, so Q(s6, a1) = 0 + 0.5 × (0 + max_{a′} Q(s7, a′) − 0) = 0.5 × 10 = **5**

The slides also answer "does Q's initialization matter?" Asymptotically no, under mild conditions; at the beginning, yes.

### When Q-learning converges

The theorem (p. 37): for finite-state, finite-action MDPs, Q-learning converges to Q*(s, a) if:

1. The policy sequence π_t(a|s) satisfies GLIE
2. The step sizes α_t satisfy the Robbins–Monro conditions: Σ_t α_t = ∞ and Σ_t α_t² < ∞ (α_t = 1/t, for example)

Page 38 lists what the result relies on: it builds on stochastic approximation, needs step sizes decreasing at the right rate, relies on the Bellman backup's contraction property, and assumes bounded rewards and values.

## When the table won't fit: value function approximation

Everything so far gives each (s, a) its own table entry. L4 p. 40 lists reasons to drop the table. You don't want to store (and learn) a model, value, Q, or policy separately for every state and action. You want a compact representation that **generalizes across states**, cutting the memory, computation, and **experience** needed.

### First, pretend there's an oracle

Pages 41–43 idealize: suppose an oracle returns the true Q^π(s, a) for any (s, a) you query. Then it's supervised learning. Fit a function Q̂(s, a; w) with parameters w to minimize

J(w) = E_π[(Q^π(s, a) − Q̂(s, a; w))²]

Gradient descent finds a local minimum, with gradient ∇_w J(w) = −2E_π[(Q^π(s, a) − Q̂(s, a; w))∇_w Q̂(s, a; w)]. SGD approximates that gradient with a finite number of samples, often one. The slides note that the expected SGD update equals the full gradient update.

### No oracle: substitute a target

In practice there's no oracle, so you need **something to stand in for Q^π(s_t, a_t)**. This maps one-to-one onto the previous post's evaluation methods (pp. 48–54, 59):

| Target | Stands in for Q^π(s_t, a_t) | Properties |
|---|---|---|
| Monte Carlo | The return G_t | Unbiased but noisy; amounts to supervised learning on (s, a, G) pairs |
| SARSA | r + γQ̂(s′, a′; w) | Bootstraps from the current approximation |
| Q-learning | r + γ max_{a′} Q̂(s′, a′; w) | Same, plus off-policy |

For TD evaluation, the slides (p. 52) say it combines **three forms of approximation**: sampling, bootstrapping, and value function approximation. The TD target r + γV̂(s′; w) is therefore a biased and approximated estimate of the true value.

Control interleaves the two: approximate policy evaluation with function approximation, then ε-greedy improvement (p. 57).

## The deadly triad: trouble when all three show up

Page 57 warns this **can be unstable**, generally when three things intersect. Page 60 calls it the **deadly triad**:

1. Function approximation
2. Bootstrapping
3. Off-policy learning (e.g. Q-learning)

The slides' intuition: each update is like an (approximate) Bellman backup followed by fitting the result to some feature representation. **The Bellman operator is a contraction, but function-approximation fitting can be an expansion.** Chain them and you can get oscillation or non-convergence. The slides point to Baird's counterexample in Sutton & Barto 2018.

Recall the preview on L3 p. 56 from the previous post: MC stays consistent with function approximation, while TD(0) with function approximation may not converge. The deadly triad is the full version of that sentence.

The next post's DQN starts right here: Q-learning with a neural network hits all three conditions. The slides (p. 63) name two concrete problems, correlations between samples and non-stationary targets. DQN holds things together with experience replay and fixed Q-targets.

## What you should be able to do after this lecture

From "What You Should Understand" on L4 p. 78 (the DQN item waits for the next post):

- Implement TD(0) and MC on-policy evaluation
- Implement Q-learning, SARSA, and MC control
- Name the three causes of instability (function approximation, bootstrapping, off-policy learning) and describe the problems qualitatively

## How to self-study it

1. Read [L4](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) pp. 16–60, then work the optional examples and checks on pp. 80–89. For the SARSA vs. Q-learning check, the slides' answer is that both statements are true.
2. The public recording is 2024's [Lecture 4, "Q learning and Function Approximation"](https://www.youtube.com/watch?v=b_wvosA70f8); use it as a listening supplement.
3. Read along in [Sutton & Barto](http://incompleteideas.net/book/RLbook2018.pdf) 5.2–5.4, 6.4, 6.5, 6.7.
4. Hands-on: `riverswim.py` from [Assignment 1](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en) has a `step()` method for sampling. Write tabular Q-learning and SARSA on it, and compare the learned Q against the Q* you get from value iteration.

One thing to do tonight: just compute the 2.5 and the 5. Write out the SARSA and Q-learning updates yourself, then ask: with a large ε, whose Q-values is SARSA actually learning?

## Further reading

- An introductory take on the same Q-learning in CS221: [CS221 Lecture 8: Reinforcement Learning and Q-learning](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning-en)
- Value-based methods in a deep RL course: [Berkeley CS285: Policy and Value Methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS234 course home (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule: Week 2 "Q-learning and function approximation"
- [CS234 lecture materials page](https://web.stanford.edu/class/cs234/modules.html) — pre- and post-class slide links for L4
- [CS234 Lecture 4 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture4post.pdf) — ε-greedy theorem, GLIE, SARSA, Q-learning convergence conditions, VFA, deadly triad, optional examples
- [CS234 Lecture 3 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture3post.pdf) — p. 56: how MC and TD differ in convergence under function approximation
- [Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed.)](http://incompleteideas.net/book/the-book-2nd.html) — supporting reading listed by the course; 5.2–5.4, 6.4, 6.5, 6.7 and Baird's counterexample
- [Stanford CS234 Spring 2024 Lecture 4, "Q learning and Function Approximation"](https://www.youtube.com/watch?v=b_wvosA70f8) — public recording (2024 edition)
- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — all 16 public recordings
