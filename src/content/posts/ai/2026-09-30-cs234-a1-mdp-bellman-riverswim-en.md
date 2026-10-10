---
title: "CS234 Assignment 1: Effective Horizon, Reward Hacking, Bellman Residuals, and RiverSwim"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, homework, mdp]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 3
tldr: "CS234's Winter 2026 Assignment 1 is worth 68 points across four questions: an inventory MDP where the horizon and discount change the optimal policy (8), a traffic example where a proxy reward makes the AI car refuse to merge (5), bounding a greedy policy's performance with the Bellman residual (30), and hand-written value iteration and policy iteration on RiverSwim (25). The three written questions all drill one idea: the reward, γ, and value function you write down may not be the goal you think they are."
description: "A guide to Stanford CS234 (Winter 2026) Assignment 1: Q1 effective horizon, Q2 reward hacking, Q3 Bellman residuals and policy performance bounds, Q4 VI/PI on RiverSwim, with point values, submission format, the code.zip file list, and the RiverSwim environment parameters. It explains what each question trains; no solutions."
draft: false
glossary:
  - term: "Bellman residual"
    aliases: ["Bellman error magnitude"]
    definition: "For an arbitrary value vector V, the difference after one Bellman backup, BV − V. Its infinity norm ‖BV − V‖ is the Bellman error magnitude."
    context: "Assignment 1 Q3 uses it to bound how far the greedy policy extracted from V can fall below optimal."
  - term: "reward hacking"
    aliases: ["proxy reward"]
    definition: "An agent optimizes the written reward (often an easy-to-measure proxy) very well while its behavior drifts away from what the designer actually wanted."
    context: "Assignment 1 Q2 uses the highway-merging example from Pan, Bhatia & Steinhardt (ICLR 2022)."
    links:
      - label: "Pan, Bhatia & Steinhardt (ICLR 2022)"
        url: "https://openreview.net/pdf?id=JYtwGwIL7ye"
  - term: "RiverSwim"
    definition: "A small MDP from Strehl & Littman (2008): a row of states like a river. Swimming downstream (LEFT) always succeeds but pays little; swimming upstream (RIGHT) often gets pushed back, and the big reward sits at the far upstream end. A standard test for exploration and discounting."
    context: "Assignment 1 Q4 uses a modified 6-state version with three current strengths."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim)

**Video status: Official entry or recording index only.** [Source details](#course-video-sources)

> **Edition note**: This guide follows the Winter 2026 assignments and slides of [CS234](https://web.stanford.edu/class/cs234/); the public recordings are the [Spring 2024 edition](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX). Every fact was checked on 2026-09-30 against the [assignments page](https://web.stanford.edu/class/cs234/assignments.html), the [A1 question PDF](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf) (7 pages), and [code.zip](https://web.stanford.edu/class/cs234/assignments/a1/code.zip). Access level **A3** (defined in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)): questions, LaTeX template, and starter code are public. What you can't get is the Gradescope autograder, the hidden test cases, and official solutions.

**Series**: Previous: [Planning with a Model: Policy Evaluation, PI, VI](/posts/ai/2026-09-30-cs234-mdp-planning-en) | Next: [Evaluating Without a Model: MC, TD(0), Certainty Equivalence](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation-en) | [Series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

The previous post covered planning with a known model: policy evaluation, policy iteration, value iteration, and why the Bellman backup is a contraction. Assignment 1 splits that material into four questions and makes you approach it from two sides. On paper, you prove properties of the Bellman operator. In code, you write VI and PI yourself on a small environment.

On the 2026 schedule, A1 is released in Week 1 and **due January 16 at 6 pm PST**. That's the same week as L3 "Policy Evaluation" and L4 "Q-learning and function approximation." On-campus students hand in this model-based assignment while they're already learning model-free methods.

This post covers what each question trains, which tools from the previous lecture it needs, and where people tend to get stuck. **It gives no solutions.**

## Course video sources

Official course and existing recording entries are linked below. A single public video matching this article has not been verified for embedding.

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## Submission and points

You submit three parts on Gradescope:

1. A PDF of the written part, typeset with the official [LaTeX template](https://web.stanford.edu/class/cs234/assignments/a1/assignment1_template.zip)
2. The raw `.tex` file
3. The coding part: run `make clean`, then `make submit`, and upload the resulting `assignment1.zip`

| Question | Topic | Points | Format |
|---|---|---|---|
| Q1 | Effect of Effective Horizon | 8 | Written, four parts at 2 points each |
| Q2 | Reward Hacking | 5 | Written, 2 + 3 points |
| Q3 | Bellman Residuals and performance bounds | 30 | Written proofs; (a)–(i) graded, (j)(k) are ungraded challenges |
| Q4 | RiverSwim MDP | 25 | 20 points of code + 5 written |

The total is 68 points. The course site lists two grade breakdowns. For on-campus students A1 is 7%, alongside mandatory tutorials worth 24%. Off-campus students have no tutorials, and A1 is 15%.

## Q1: Same MDP, different horizon, different optimal policy

The setting is a store's inventory. The state is the stock level s (0 to 10), and there are two actions, sell and buy:

- Sell: if s > 0, get +1 and stock drops by one; at s = 0 nothing happens
- Buy: no reward, stock rises by one; the step from 9 to 10 pays **+100**
- s = 10 is terminal; every day starts at s = 3

The question first walks through H = 4: sell three times for +3, and the fourth step earns 0 whatever you do. Then it asks:

- (a) Starting at s = 3, is there a finite horizon H that makes the optimal policy **both buy and sell**?
- (b) In the infinite-horizon discounted setting, is there a γ ∈ [0, 1) under which the optimal policy **never fully stocks** the inventory? Explain your reasoning; no specific value needed.
- (c) Can the infinite-horizon discounted version with γ and the finite-horizon undiscounted version with H ever share the same optimal policy? If so, give concrete values of γ and H.
- (d) Following (c): does **every** H have a matching γ? Justify in one or two sentences.

This question drills a conclusion from the previous lecture. With identical rewards and dynamics, a different γ or H can produce a completely different optimal policy. The +1 is available every step. The +100 requires six reward-free steps first. Think of H or γ as "how long the agent is willing to wait," then ask whether the two kinds of waiting have the same shape.

Before (c) and (d), reread two lines from the [L2 slides](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf). The optimal policy of an infinite-horizon discounted MDP is stationary (it doesn't depend on the time step). Is the optimal policy stationary in finite-horizon tasks? The slide's answer is "In general no." Whether the optimal policy can depend on **steps remaining** is the place to start thinking about whether the two settings can match up.

## Q2: A proxy reward makes the AI car stay off the highway

This question picks up where Q1 leaves off. The choice of horizon and discount alone can push a policy away from what a human intended, and this is called reward hacking. The example comes from [Pan, Bhatia & Steinhardt (ICLR 2022)](https://openreview.net/pdf?id=JYtwGwIL7ye):

- The real goal is to minimize the mean commute of all cars, human-driven and AI-driven, but that's hard to write as a reward
- So the designers use an easy-to-measure **proxy**: maximize the mean velocity of all cars
- The scene has one AI car at an on-ramp and many human-driven cars on the highway
- Under this proxy, the AI car's optimal policy is to **park and not merge**

Part (a) asks you to explain why not merging is optimal (2 points). Part (b) asks for alternative rewards that still aren't "minimize commute" and stay easy to optimize, but don't make the AI car never merge. The answer is 2 to 5 sentences and may include equations. The question says there's no single answer and reasonable ones get full credit (3 points).

For (a), take the word "mean" apart. Who is in the denominator, and how do the numerator and denominator move while the AI car sits still? A footnote adds that, in the original paper, systems with simpler function representations actually reward-hack less in this example. The series comes back to this in the [value alignment](/posts/ai/2026-09-30-cs234-value-alignment-ethics-en) post.

## Q3: Bounding a greedy policy's performance with the Bellman residual

This is the core of the assignment, 30 points, and the densest proof in the first half of the course. The question opens by stressing one distinction:

- **V** is an arbitrary |S|-dimensional vector, not necessarily achievable by any policy. The example: in a 2-state MDP with only negative rewards, V = [1, 1] is a valid V but can never be a V^π.
- **V^π** is the value some policy π actually achieves in this MDP.

All norms are infinity norms, ‖v‖ = max_s |v(s)|. The question defines two operators, the optimal B (max over actions) and the fixed-policy B^π. It reminds you that class already proved ‖BV − BV′‖ ≤ γ‖V − V′‖.

The parts fall into three stages.

**Stage 1: basic properties of B^π (9 points)**

| Part | What to prove | Points |
|---|---|---|
| (a) | B^π is also a γ-contraction | 3 |
| (b) | B^π has a unique fixed point (you may assume one exists; hint: contradiction) | 3 |
| (c) | Monotonicity: if V ≤ V′ elementwise, then B^π V ≤ B^π V′ | 3 |

For (a), you can follow the class proof for B. The fixed-policy version is actually simpler because there's no max. Parts (b) and (c) are the foundation for every later inequality.

**Stage 2: Bellman residuals and a performance lower bound (16 points)**

The question defines the Bellman residual as BV − V and the **Bellman error magnitude** as ‖BV − V‖. It extracts a greedy policy from an arbitrary V: π(s) = argmax_a [r(s,a) + γ Σ p(s′|s,a) V(s′)].

| Part | Content | Points |
|---|---|---|
| (d) | For which V is ‖BV − V‖ = 0, and why? | 2 |
| (e) | Prove ‖V − V^π‖ ≤ ‖V − B^π V‖ / (1 − γ) and ‖V − V*‖ ≤ ‖V − BV‖ / (1 − γ); hint: insert a zero term and use the triangle inequality | 5 |
| (f) | With ε = ‖BV − V‖ and π greedy with respect to V, prove V^π(s) ≥ V*(s) − 2ε/(1 − γ) | 5 |
| (g) | Give a real-world application where a lower bound on V^π would be useful | 2 |
| (h) | If another V′ has the same ε, does the shared lower bound mean the two greedy policies have equal value at every state? | 2 |

Part (e) is the lever for the whole question, and (f) is its first use. After (i), the question adds some intuition. A constant reward r per step sums to r/(1 − γ) under discounting. So the bound says the greedy policy's average per-step reward falls short of optimal by at most 2ε. If an algorithm drives the Bellman residual down, you can guarantee that the policy you extract isn't too bad.

**Stage 3: when V overestimates (5 points + challenges)**

Part (i) adds the condition V* ≤ V (V is at least the optimal value at every state). You prove the bound tightens to ε/(1 − γ). The hint: why is V^π ≤ V* for every π?

Parts (j) and (k) are ungraded. Part (j) handles a practical snag: you usually don't know V*, so V* ≤ V is hard to check. It asks you to show that BV ≤ V is enough to conclude V* ≤ V, with hints pointing to induction and lim B^n V. Part (k) tightens the bounds from (f) and (i) to 2γε/(1 − γ) and γε/(1 − γ).

<details>
<summary>Check your toolkit before starting Q3</summary>

- The value iteration contraction proof from the previous post: how ‖BV − BV′‖ ≤ γ‖V − V′‖ follows from properties of max
- The triangle inequality holds for the infinity norm
- Elementwise inequalities and norm inequalities are different things. Parts (c), (i), (j) use the first; (a) and (e) use the second. Mixing them up is the most common source of mistakes
- V^π is the fixed point of B^π; V* is the fixed point of B
- The definition of the greedy policy already tells you how B^π V and BV relate for that π

</details>

## Q4: VI and PI on RiverSwim

The coding question uses RiverSwim from [Strehl & Littman (2008)](https://www.sciencedirect.com/science/article/pii/S0022000008000767). You need only Python 3 and numpy (`requirements.txt` has a single line: numpy). Unzipping `code.zip` gives:

| File | Purpose |
|---|---|
| `riverswim.py` | The environment: `RiverSwim(current, seed)`; `get_model()` returns the reward table R and transition tensor T |
| `vi_and_pi.py` | Five functions to fill in; `__main__` runs PI and VI with a WEAK current and γ = 0.99 |
| `Makefile`, `collect_submission.sh` | `make submit` zips only `vi_and_pi.py` into `assignment1.zip` |
| `requirements.txt` | numpy |

### What the environment looks like

Reading `riverswim.py` shows the parameters directly. These are part of the problem setup, not the solution:

- 6 states and 2 actions: 0 is LEFT, 1 is RIGHT; the agent always starts at the leftmost state 0
- The reward is a table R[s, a] with only two nonzero entries: **0.005** for LEFT at the leftmost state, **1** for RIGHT at the rightmost state
- LEFT always succeeds
- RIGHT from a middle state: stay put with probability 0.6, get pushed back one state with probability **0.09 × current strength**, and move forward with the rest
- WEAK, MEDIUM, and STRONG map to strengths 1, 2, 3, so the forward probabilities are 0.31, 0.22, and 0.13

That's the tension in RiverSwim. LEFT is a nearly risk-free but tiny reward. RIGHT means swimming against the current for several states to reach a reward 200 times larger.

### The four parts

| Part | Content | Points |
|---|---|---|
| (a) | Implement `bellman_backup(state, action, R, T, gamma, V)`: return the value of one Bellman backup for a single state-action pair | 4 |
| (b) | Implement `policy_evaluation`, `policy_improvement`, and `policy_iteration`; return the optimal value function and policy | 8 |
| (c) | Implement `value_iteration` | 8 |
| (d) | Written: with a WEAK current, find the largest γ (to two decimal places) at which an optimal agent starting at the far-left state **does not swim upstream**, and explain why that makes sense. Repeat for MEDIUM and STRONG, and describe how the optimal values and γ change, quantitatively and qualitatively | 5 |

The question gives a sanity check. With a WEAK current, γ = 0.99, and tolerance 0.001, the leftmost and rightmost states should have values **30.328** and **36.859**. Both VI and PI must land within 0.001. Grading also uses hidden test cases.

A few implementation points worth settling first:

- `bellman_backup` is the building block the other three functions share. It handles one (s, a) and takes no max; the max and argmax belong to the callers.
- `policy_evaluation` has `tol=1e-3` in its signature. It expects **iterative** evaluation until changes fall below the tolerance, not a direct linear solve.
- The `policy_iteration` docstring says to call the previous two functions. Think about the stopping condition: does the policy stop changing, or the values?
- The starter code initializes the policy with `np.zeros(num_states, dtype=int)`, so everything starts as LEFT.
- The "largest γ" in (d) has to be found by sweeping in code. This part replays Q1 in a more realistic environment: γ decides whether the agent will pay a cost now for a large reward far away.

## How to self-study it

1. Make sure you can rewrite the two proofs from the previous post yourself: monotonic policy improvement and the Bellman backup contraction. Nearly every part of Q3 is a variation on them.
2. Do Q1 and Q2 first. They shouldn't take long, but phrase your answers as "because H/γ changed X, the policy changed Y." You'll use the same pattern in Q4 (d).
3. Work Q3 in order, (a)→(c), (d)→(f), then (i), finishing each stage before moving on. Leave (j)(k) until the rest is done.
4. In Q4, write `bellman_backup` first and check VI and PI against the two sanity-check numbers. Once they match, sweep γ for (d).
5. There's no autograder for you. The only things you can verify are the two sanity-check values and whether VI and PI agree.

One thing to do tonight: open `riverswim.py` and draw the 6 states and both actions' arrows on paper, labeling every WEAK-current transition probability. Once it's drawn, you'll probably have a hunch about Q4 (d). Then check it in code.

## Further reading

- The same MDP, value iteration, and Q-learning as taught in another course: [CS221 Lecture 7: MDPs and Value Iteration](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration-en)
- A full deep RL course route with assignments: [Berkeley CS285 Spring 2026 guide](/posts/learning/2026-08-22-berkeley-cs285-spring-2026-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS234 course home (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule (A1 released Week 1, due Week 2), grade breakdown, late-day policy
- [CS234 assignments page](https://web.stanford.edu/class/cs234/assignments.html) — links to the A1 questions, LaTeX template, and code.zip
- [CS234 Winter 2026 Assignment 1 question PDF](https://web.stanford.edu/class/cs234/assignments/a1/CS234_A1_Questions.pdf) — all four questions, points, submission format, and sanity-check values
- [A1 code.zip](https://web.stanford.edu/class/cs234/assignments/a1/code.zip) — `riverswim.py`, `vi_and_pi.py`, Makefile, `collect_submission.sh`, `requirements.txt`
- [A1 LaTeX template](https://web.stanford.edu/class/cs234/assignments/a1/assignment1_template.zip) — template for the written part
- [CS234 Lecture 2 slides (post-class)](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf) — the Bellman backup, contraction, and stationarity material Q1 and Q3 rely on
- [Pan, Bhatia & Steinhardt, The Effects of Reward Misspecification (ICLR 2022)](https://openreview.net/pdf?id=JYtwGwIL7ye) — the highway-merging example in Q2
- [Strehl & Littman, An analysis of model-based Interval Estimation for Markov Decision Processes (JCSS 2008)](https://www.sciencedirect.com/science/article/pii/S0022000008000767) — origin of RiverSwim, as cited by the assignment
- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX) — public recordings; video 2, "Tabular MDP Planning," covers what A1 needs
