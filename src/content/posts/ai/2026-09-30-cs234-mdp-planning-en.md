---
title: "CS234 L2: Planning with a Model: Policy Evaluation, PI, VI"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, mdp, value-iteration, dynamic-programming]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 2
tldr: "Lecture 2 of CS234 Winter 2026 assumes the world model is known and asks how to compute the best policy. An MDP plus a policy is an MRP, so a policy can be evaluated by iterating a Bellman backup. Policy iteration alternates evaluation and improvement, and the slides prove each round is no worse than the last, so it stops within |A|^|S| rounds. Value iteration takes another route: apply the Bellman optimality operator over and over. For γ < 1 that operator is a contraction, so value iteration always converges. The lecture ends with finite horizons, where the best policy usually depends on how many steps remain."
description: "A guide to Lecture 2 of Stanford CS234 (Winter 2026), based on the official lecture2post slides: the MDP definition, why an MDP plus a policy is an MRP, iterative policy evaluation, policy iteration and its monotonic improvement proof, the Q function, Bellman backup operators, value iteration and the contraction proof, and planning with a finite horizon. The companion video is the Spring 2024 Lecture 2 (supplement); the readings are Sutton & Barto chapter 3 and sections 4.1–4.4."
draft: false
glossary:
  - term: "Bellman backup"
    aliases: ["Bellman backup operator"]
    definition: "An operator that maps a value function to a new value function. The optimality version is BV(s) = max_a [R(s,a) + γ Σ P(s'|s,a) V(s')]; the policy version B^π replaces the max with the action π picks."
    context: "CS234 L2 uses it to describe policy evaluation, policy iteration, and value iteration in one language."
  - term: "contraction operator"
    definition: "An operator that never increases the distance between two inputs. For γ < 1 the Bellman backup shrinks the infinity-norm distance by a factor of γ."
    context: "This is why value iteration always converges to a unique solution."
  - term: "policy iteration"
    aliases: ["PI"]
    definition: "A planning algorithm that alternates two steps: evaluate the current policy's value, then pick the action with the highest Q value in each state as the new policy, until the policy stops changing."
    context: "CS234 L2 proves it improves monotonically and ends within |A|^|S| rounds."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-mdp-planning)

> **Source years**: based on the Winter 2026 [Lecture 2 slides (post-class version)](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf). The companion video is [Spring 2024 Lecture 2: Tabular MDP Planning (supplement)](https://www.youtube.com/watch?v=gHdsUUGcBC0). The title matches, but the slides are the 2026 version. This is post 2 of the [Reading Stanford CS234](/posts/ai/2026-09-30-cs234-course-overview-en) series.

The [previous post](/posts/ai/2026-09-30-cs234-intro-sequential-decisions-en) stopped at Markov reward processes: how to value a process with no actions. The second lecture of [CS234](https://web.stanford.edu/class/cs234/) adds actions and asks a more practical question: **when you know how the world works, how do you compute the best policy?**

The slides open with a question to be answered by the end of class. Can we build algorithms that guarantee the policy only improves, or stays the same, with each extra round of computation? Do all algorithms have this property? The answer is "yes, and no, not all of them." This post covers which algorithm has it and why.

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=gHdsUUGcBC0
title: Spring 2024 Lecture 2: Tabular MDP Planning (YouTube, supplement)
```

Original videos: [Spring 2024 Lecture 2: Tabular MDP Planning (YouTube, supplement)](https://www.youtube.com/watch?v=gHdsUUGcBC0)

Course and recording entries:

- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## The warm-up: what a large γ means

The first quick check on the slides: "In an MDP, a large discount factor γ means short-term rewards are much more influential than long-term rewards." The answer is **false**. A large γ weighs delayed, long-term rewards more. Only γ = 0 values immediate rewards alone.

## The formal MDP definition

An MDP is an MRP plus actions, written as the tuple (S, A, P, R, γ):

- S: a finite set of Markov states
- A: a finite set of actions
- P: a transition model for each action, P(sₜ₊₁ = s′ | sₜ = s, aₜ = a)
- R: a reward function, R(s, a) = E[rₜ | sₜ = s, aₜ = a]
- γ ∈ [0, 1]: a discount factor

A footnote notes that reward is sometimes defined on the state alone, or on (s, a, s′). This course mostly uses (s, a).

The Mars rover MDP has two **deterministic** actions: a₁ moves one cell left (staying put in s₁), and a₂ moves one cell right (staying put in s₇). Each is a 7×7 matrix of 0s and 1s.

## An MDP plus a policy is an MRP

A policy is written in general as a conditional distribution π(a | s) = P(aₜ = a | sₜ = s). Combine it with an MDP and you get an MRP (S, R^π, P^π, γ):

```text
R^π(s)     = Σ_a π(a|s) R(s, a)
P^π(s'|s)  = Σ_a π(a|s) P(s'|s, a)
```

This step is the foundation of the lecture: **evaluating a policy in an MDP is the same as evaluating an MRP**, so the methods from the previous post apply directly.

## Policy evaluation: an iterated Bellman backup

```text
initialize V_0(s) = 0 for all s
for k = 1 until convergence:
    for s in S:
        V_k^π(s) = Σ_a π(a|s) [ R(s,a) + γ Σ_{s'} p(s'|s,a) V_{k−1}^π(s') ]
```

The slides call this line "a **Bellman backup** for a particular policy." If the policy is deterministic, the outer sum disappears: V_k^π(s) = R(s, π(s)) + γ Σ p(s′ | s, π(s)) V_{k−1}^π(s′).

Exercise L2E1 on the slides is worth doing by hand. In s₆, action a₁ stays in s₆ with probability 0.5 and reaches s₇ with probability 0.5. Take π(s) = a₁, V_k = [1, 0, 0, 0, 0, 0, 10], and γ = 0.5. Then

```text
V_{k+1}(s6) = 0 + 0.5 × (0.5 × 10 + 0.5 × 0) = 2.5
```

The 10 from s₇ gets discounted twice: once by the 0.5 probability and once by γ = 0.5.

## From evaluation to control: how big is the policy space?

Before control, the slides ask two questions. The Mars rover has 7 states and 2 actions. How many deterministic policies are there? Is the optimal policy unique?

- There are |A|^|S| = 2⁷ = 128 deterministic policies
- The optimal policy is **not necessarily unique**: two policies can share the same, maximal value function

MDP control computes π*(s) = argmax_π V^π(s). The slides list three properties. A unique optimal value function exists. In an infinite horizon problem, the optimal policy is **deterministic** and **stationary** (it does not depend on the time step). It is not necessarily unique.

One brute-force option is to enumerate all |A|^|S| policies and evaluate each. Policy iteration is generally far more efficient.

## Policy iteration

```text
i = 0
initialize π_0(s) randomly
while i == 0 or ‖π_i − π_{i−1}‖_1 > 0:   # the action changed in some state
    V^{π_i} ← evaluate π_i
    π_{i+1} ← policy improvement
    i = i + 1
```

Policy improvement needs a new definition, the **state-action value**:

```text
Q^π(s, a) = R(s, a) + γ Σ_{s'} P(s'|s, a) V^π(s')
```

It means: take action a, then follow π. The improvement step computes Q for every action in every state and picks the largest:

```text
π_{i+1}(s) = argmax_a Q^{π_i}(s, a)
```

### Why improvement never makes things worse

Here is the intuition. The max is at least as large as the value of the old action:

```text
max_a Q^{π_i}(s, a) ≥ Q^{π_i}(s, π_i(s)) = V^{π_i}(s)
```

So "follow π_{i+1} for one step, then π_i forever" is at least as good as following π_i all along. But the new policy follows π_{i+1} at **every** step. Does the guarantee survive? The proposition on the slides says it does:

> V^{π_{i+1}} ≥ V^{π_i} (compared state by state), with strict inequality whenever π_i is suboptimal.

<details>
<summary>Proof: monotonic improvement (slides p.26–27)</summary>

```text
V^{π_i}(s) ≤ max_a Q^{π_i}(s, a)
           = max_a [ R(s,a) + γ Σ_{s'} P(s'|s,a) V^{π_i}(s') ]
           = R(s, π_{i+1}(s)) + γ Σ_{s'} P(s'|s, π_{i+1}(s)) V^{π_i}(s')      // definition of π_{i+1}
           ≤ R(s, π_{i+1}(s)) + γ Σ_{s'} P(s'|s, π_{i+1}(s)) max_{a'} Q^{π_i}(s', a')
           = R(s, π_{i+1}(s)) + γ Σ_{s'} P(s'|s, π_{i+1}(s))
               ( R(s', π_{i+1}(s')) + γ Σ_{s''} P(s''|s', π_{i+1}(s')) V^{π_i}(s'') )
           ⋮
           = V^{π_{i+1}}(s)
```

Each line replaces "V^{π_i} at the next step" with something no smaller: one more step under π_{i+1}, followed by V^{π_i}. Unroll it all the way and you get the value of following π_{i+1} at every step.

</details>

### When PI stops

The third quick check on the slides has two parts:

1. **Once the policy stops changing, can it ever change again?** No. If π_{i+1}(s) = π_i(s) for all s, then Q^{π_{i+1}} = Q^{π_i}, and the next argmax is the same.
2. **Is there a maximum number of iterations?** Yes, |A|^|S|. Improvement is monotonic, so apart from an optimal policy, each policy can appear in at most one round, and there are only |A|^|S| policies.

That answers the opening question: policy iteration guarantees that an extra round never makes the policy worse.

## Bellman equations and Bellman backup operators

Before value iteration, the slides separate two Bellman objects.

A policy's value function must satisfy the **Bellman equation**:

```text
V^π(s) = R^π(s) + γ Σ_{s'} P^π(s'|s) V^π(s')
```

The **Bellman backup operator** B takes a value function and returns a new one, improving it where possible:

```text
BV(s) = max_a [ R(s, a) + γ Σ_{s'} p(s'|s, a) V(s') ]
```

The policy-specific version B^π replaces the max with the action π picks: B^π V(s) = R^π(s) + γ Σ P^π(s′ | s) V(s′). In this language, policy evaluation finds the **fixed point** of B^π: keep applying B^π until V stops changing.

## Value iteration

Policy iteration computes a policy's infinite horizon value, then uses it to improve the policy. Value iteration uses a different idea: **keep the optimal value of starting in s with k steps left, and stretch k one step at a time.**

```text
k = 1
initialize V_0(s) = 0
repeat until convergence (e.g. ‖V_{k+1} − V_k‖_∞ ≤ ε):
    for s in S:
        V_{k+1}(s) = max_a [ R(s,a) + γ Σ_{s'} P(s'|s,a) V_k(s') ]
```

In operator form it is one line: V_{k+1} = B V_k. To extract a policy, take the argmax over the final V.

### Why it always converges: contraction

Let O be an operator and |x| any norm. If |OV − OV′| ≤ |V − V′|, then O is a contraction operator.

The slides' conclusion: **value iteration converges if γ < 1, or if you end up in a terminal state with probability 1.** The reason is that for γ < 1 the Bellman backup is a contraction. Apply it to two different value functions and the distance between them shrinks.

<details>
<summary>Proof: the Bellman backup is a contraction for γ < 1 (slides p.40–41)</summary>

Use the infinity norm, ‖V − V′‖ = max_s |V(s) − V′(s)|.

```text
‖BV_k − BV_j‖
  = ‖ max_a [R(s,a) + γ Σ P(s'|s,a) V_k(s')] − max_{a'} [R(s,a') + γ Σ P(s'|s,a') V_j(s')] ‖
  ≤ max_a ‖ R(s,a) + γ Σ P(s'|s,a) V_k(s') − R(s,a) − γ Σ P(s'|s,a) V_j(s') ‖
  = max_a ‖ γ Σ P(s'|s,a) (V_k(s') − V_j(s')) ‖
  ≤ max_a ‖ γ Σ P(s'|s,a) ‖V_k − V_j‖ ‖
  = max_a ‖ γ ‖V_k − V_j‖ Σ P(s'|s,a) ‖
  = γ ‖V_k − V_j‖
```

The last step uses the fact that probabilities sum to 1. The slides point out that even if every inequality were an equality, this would still be a contraction for γ < 1.

</details>

The slides then leave three practice questions without answers:

1. Prove that value iteration converges to a **unique** solution for discrete states and actions with γ < 1
2. Does the initialization of values in value iteration affect anything?
3. If you run the policy extracted from value iteration at each round in the real infinite horizon problem, is its value guaranteed to improve monotonically, as with policy iteration?

The third question ties back to the opening claim that not all algorithms have this property.

## Finite horizon

If you can make only H decisions, the value iteration loop runs H times. V_k and π_k now mean "the optimal value and optimal policy with k decisions left."

Another option is **simulation**: generate many episodes and average their returns. Concentration inequalities bound how fast the average approaches the expected value, and the method **needs no Markov assumption**.

The slides demonstrate with the Mars rover MRP (γ = 1/2, H = 4, starting in s₄):

| Sampled episode | Return |
|---|---|
| s₄, s₅, s₆, s₇ | 0 + ½×0 + ¼×0 + ⅛×10 = 1.25 |
| s₄, s₄, s₅, s₄ | 0 |
| s₄, s₃, s₂, s₁ | 0 + ½×0 + ¼×0 + ⅛×1 = 0.125 |

The last question: **is the optimal policy stationary in finite horizon tasks?** The slides answer "in general, no." The intuition: the risks worth taking with ten steps left differ from those with one step left. Compare the infinite horizon case, where the optimal policy is stationary.

## VI versus PI

| | Value iteration | Policy iteration |
|---|---|---|
| What each round computes | The optimal value for horizon = k, then k increases | The infinite horizon value of the current policy |
| How you get a policy | Argmax over V; at horizon = k it directly gives the optimal policy | Use the computed value to select another, better policy |
| Connection | — | The slides say it is closely related to policy gradient, a very popular RL method |

That last cell is a setup. The structure of "evaluate the current policy, then move toward a better one" returns in [post 7 on policy gradients](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en).

## What you should know from this lecture

The slides' "What You Should Know" list:

- Define MP, MRP, MDP, Bellman operator, contraction, model, Q-value, policy
- Be able to implement value iteration and policy iteration
- Give pros and cons of different policy evaluation approaches
- Be able to prove contraction properties
- Know the limitations of these approaches and of the Markov assumption: which policy evaluation methods require it?

This post answers the last one: the iterated Bellman backup requires it, and averaging simulated returns does not.

## What you can do tonight

The [A1 starter code](https://web.stanford.edu/class/cs234/assignments/a1/code.zip) contains `vi_and_pi.py`, and the RiverSwim problem asks you to implement a Bellman backup, policy iteration, and value iteration. Tonight, skip the code and do one thing on paper. Take the deterministic Mars rover MDP (γ = 0.5, every action's reward 1 in s₁, 10 in s₇, 0 elsewhere, starting from V₀ = 0) and run five rounds of value iteration, writing down V and the argmax policy each round. Here is what I got, so you can check your work: in round one every action ties. After that, s₇'s value spreads left and s₁'s spreads right, the "go right" region grows each round, and by round five only s₁ and s₂ still choose left.

Then read [Sutton & Barto](http://incompleteideas.net/book/RLbook2018.pdf) sections 4.1–4.4 and compare the book's policy evaluation, policy improvement, policy iteration, and value iteration. The [next post](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en) covers what A1 practices.

## Further reading

- [CS221 L7: MDPs and value iteration](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration-en): the same algorithms in a prerequisite course
- [Reinforcement learning: MDPs, value iteration, and continuous states (CS229 notes chapter 19)](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-19-reinforcement-learning-en)
- [CS224R L1: Writing decision making as an RL problem](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en)
- [Berkeley CS285: policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en)

**Series navigation**: previous, [What RL is and the language of MDPs](/posts/ai/2026-09-30-cs234-intro-sequential-decisions-en) | next, [A1: effective horizon, reward hacking, Bellman residuals, RiverSwim](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en) | [series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS234 home page (Winter 2026)](https://web.stanford.edu/class/cs234/)
- [CS234 Lecture Materials (Winter 2026)](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 2 slides: Making Sequences of Good Decisions Given a Model of the World (2026 post-class)](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf)
- [A1 starter code, code.zip (2026)](https://web.stanford.edu/class/cs234/assignments/a1/code.zip)
- [Spring 2024 Lecture 2: Tabular MDP Planning (YouTube, supplement)](https://www.youtube.com/watch?v=gHdsUUGcBC0)
- [Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed.), chapter 3 and sections 4.1–4.4](http://incompleteideas.net/book/RLbook2018.pdf)
