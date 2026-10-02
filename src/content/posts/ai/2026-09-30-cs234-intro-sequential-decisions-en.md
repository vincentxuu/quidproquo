---
title: "CS234 L1: What RL Is and the Language of MDPs"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, mdp]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 1
tldr: "Lecture 1 of CS234 Winter 2026 first answers what RL is: learning from experience to make good decisions under uncertainty. It usually involves four things at once: optimization, delayed consequences, exploration, and generalization. A seven-cell Mars rover world then builds from a Markov process to a Markov reward process, defining return, the value function, and the discount factor, and ends with the Bellman equation for an MRP. You can solve it with a matrix inverse or iterate with dynamic programming. Add actions and you get an MDP, where the next lecture starts."
description: "A guide to Lecture 1 of Stanford CS234 (Winter 2026), based on the official lecture1post slides: the definition of RL, its four core challenges, the Markov assumption and state representation, the Mars rover Markov process and Markov reward process, evaluation versus control, and two ways to compute an MRP's value. The companion video is the Spring 2024 Lecture 1 (supplement); the reading is Sutton & Barto chapter 1."
draft: false
glossary:
  - term: "Markov assumption"
    aliases: ["Markov property"]
    definition: "A state s_t satisfies p(s_{t+1} | s_t, a_t) = p(s_{t+1} | h_t, a_t): given the present, the future is independent of the past history."
    context: "CS234 L1 uses it to compress the whole history into a state."
  - term: "Markov reward process"
    aliases: ["MRP"]
    definition: "A Markov chain plus rewards: a state set, a transition model, a reward function R(s), and a discount factor γ, with no actions."
    context: "An MDP with a fixed policy becomes an MRP, so MRP methods can evaluate policies directly."
  - term: "evaluation and control"
    definition: "Evaluation estimates the expected reward of following a given policy; control finds the best policy."
    context: "CS234 L1 separates the two, and the course keeps coming back to the distinction."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-intro-sequential-decisions)

> **Source years**: based on the Winter 2026 [Lecture 1 slides (post-class version)](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf). The companion video is the [Spring 2024 Lecture 1 recording (supplement)](https://www.youtube.com/watch?v=WsvFL-LjA6U). The title matches, but the slides are the 2026 version, so examples may differ. This is post 1 of the [Reading Stanford CS234](/posts/ai/2026-09-30-cs234-course-overview-en) series.

The first lecture of [CS234](https://web.stanford.edu/class/cs234/) has three parts: an overview of RL, logistics, and sequential decision making under uncertainty. The [series overview](/posts/ai/2026-09-30-cs234-course-overview-en) already covers the logistics (grading, tutorials, late days), so this post covers the other two.

One note first: the post-class PDF has 60 pages, but its page numbers read "/ 70," and the last page is the day's summary. The next lecture's slides pick up where this one stops.

## What RL is

The slides define it in one line: **learning through experience or data to make good decisions under uncertainty.**

Two framings follow. First, this is an essential part of intelligence. Second, the theory builds on ideas that go back to Richard Bellman in the 1950s, and the last decade brought a run of striking successes. The examples on the slides: superhuman Go from the AlphaGo line of work, plasma control for fusion, COVID-19 border testing (post 13 comes back to it in the bandit material), ChatGPT, and OpenAI o1.

The opening slide, "RL in 2025," quotes two passages. One says DeepSeek-R1-Zero showed strong reasoning after large-scale RL with no supervised fine-tuning first. The other is the International Mathematical Olympiad president confirming that Google DeepMind scored 35 of 42 points, a gold medal score. The course teaches theory that starts in the 1950s, but its first slide is set in 2025. The point: the theory is still in use.

## RL usually involves four things at once

The slides break RL down into four words:

| Challenge | How the slides put it | Example |
|---|---|---|
| Optimization | Find an optimal (or at least very good) way to make decisions, with an explicit notion of utility | Shortest route between two cities on a road network |
| Delayed consequences | Decisions now can matter much later | Saving for retirement; finding a key in Montezuma's Revenge |
| Exploration | Learn about the world by making decisions; the agent as scientist | Learning to ride a bike by trying and failing |
| Generalization | A policy maps past experience to actions | Why not just pre-program a policy? |

**Delayed consequences** raise two problems. When planning, you have to reason about a decision's long-term effects, not just its immediate benefit. When learning, temporal credit assignment is hard: which step caused the later high or low reward?

The key to **exploration** is that you only see the outcome of the path you chose. The slide's example: if you choose Stanford instead of MIT, your later experiences differ, and you never learn what the other path would have given you. Supervised learning is different, because every example comes labeled with the right answer.

The slides also name two kinds of problems where RL is especially strong. The first is problems with **no examples of desired behavior**, because the goal is to go beyond human performance or no data exists for the task. The second is **huge search or optimization problems with delayed outcomes**, with AlphaTensor as the example.

## A warm-up: the AI tutor

Before sequential decision making, the slides pose an exercise. A student starts out knowing neither addition (easier) nor subtraction (harder). An AI tutor can give addition or subtraction problems. The agent gets +1 when the student answers correctly and -1 when the student is wrong.

The exercise asks for the state space, action space, and reward model, what the dynamics model represents, and what a policy that maximizes expected discounted reward would do.

The slides do not print an answer, but the questions point to one: this reward pushes the agent to keep giving problems the student already gets right, which is not how a student learns most. The last question on the slide is exactly that: if this is not the best way to optimize for learning, what reward would encourage it? This is the first appearance of reward design. The reward hacking problem in [A1](/posts/ai/2026-09-30-cs234-a1-mdp-bellman-riverswim-en) comes back to it.

## The basic loop of sequential decisions

The goal of sequential decision making is to **select actions that maximize total expected future reward**, which may mean trading off immediate against long-term reward. The slides give three examples: web advertising, a robot unloading a dishwasher, and blood pressure control.

In discrete time, at each step t:

1. The agent takes action aₜ
2. The world updates given aₜ and emits observation oₜ and reward rₜ
3. The agent receives oₜ and rₜ

Everything so far is the **history**, hₜ = (a₁, o₁, r₁, …, aₜ, oₜ, rₜ). The agent picks actions based on the history. The **state** is the information assumed to determine what happens next, written as a function of the history, sₜ = f(hₜ).

## The Markov assumption: compressing history into a state

A state sₜ is Markov if and only if

```text
p(s_{t+1} | s_t, a_t) = p(s_{t+1} | h_t, a_t)
```

In other words, the future is independent of the past given the present.

The slides give two reasons the assumption is popular. It is simple, and it can often be satisfied by including some history in the state. In practice people often assume the most recent observation is a sufficient statistic of the history, so sₜ = oₜ. The choice of state representation affects computational complexity, the data you need, and the performance you end up with.

The slides then sort sequential decision processes with three questions:

- Is the state Markov? Is the world partially observable (a POMDP)?
- Are the dynamics deterministic or stochastic?
- Do actions affect only the immediate reward (bandits), or also the next state?

The third question matters later. A bandit is the special case where actions do not change the state, and [post 13](/posts/ai/2026-09-30-cs234-bandits-regret-ucb-en) is about it.

## The Mars rover: the course's toy example

This example runs through A1 and A2. A rover sits on a row of seven cells, s₁ to s₇, and its actions are TryLeft and TryRight. Reward: +1 in s₁, +10 in s₇, 0 elsewhere.

The **MDP model** is the agent's representation of the world, in two parts:

- **Transition/dynamics model**: predicts the next state, p(sₜ₊₁ = s′ | sₜ = s, aₜ = a)
- **Reward model**: predicts the immediate reward, r(s, a) = E[rₜ | sₜ = s, aₜ = a]

The slides pointedly add "Model may be wrong": the model is the agent's own estimate, not necessarily the true world. In the example, the agent's reward model estimates 0 in every cell, and its transition model says TryRight in s₁ has a 0.5 chance of staying put and a 0.5 chance of moving one cell right.

A **policy** π determines how the agent chooses actions. It can be deterministic, π(s) = a, or stochastic, π(a | s) = Pr(aₜ = a | sₜ = s). A quick check on the slides: is the policy that picks TryRight in all seven cells deterministic or stochastic? Deterministic, since each state maps to exactly one action.

## Evaluation and control

The course keeps coming back to this distinction:

- **Evaluation**: estimate the expected rewards from following a given policy
- **Control**: optimization, finding the best policy

A "Build up in complexity" slide then shows how the course proceeds. Start with finite states and actions and known dynamics and reward models. The job is to evaluate a policy and then compute the best one, which AI calls a planning problem. The order is Markov process → Markov reward process → MDP → evaluation and control in MDPs.

## Layer one: the Markov process

A Markov process (Markov chain) is a memoryless random process with two elements: a finite state set S and a transition model p(sₜ₊₁ = s′ | sₜ = s). **No rewards, no actions.**

With N states, the transition model is an N×N matrix P whose row i holds the probabilities of moving from sᵢ to each state. In the Mars rover version, the two end cells stay put with 0.6 and move inward with 0.4. Middle cells move left with 0.4, stay with 0.2, and move right with 0.4.

Sample episodes starting from s₄:

```text
s4, s5, s6, s7, s7, s7, ...
s4, s4, s5, s4, s5, s6, ...
s4, s3, s2, s1, ...
```

## Layer two: the Markov reward process

An MRP is a Markov chain plus rewards:

- S: a finite set of states
- P: a transition model P(sₜ₊₁ = s′ | sₜ = s)
- R: a reward function R(s) = E[rₜ | sₜ = s]
- γ ∈ [0, 1]: a discount factor

Still no actions. The Mars rover MRP has reward 1 in s₁, 10 in s₇, and 0 elsewhere.

Three definitions follow:

- **Horizon H**: the number of time steps in each episode, possibly infinite
- **Return Gₜ**: the discounted sum of rewards from t to the horizon, Gₜ = rₜ + γrₜ₊₁ + γ²rₜ₊₂ + … + γ^(H−1) rₜ₊H₋₁
- **State value V(s)**: the expected return starting from s, V(s) = E[Gₜ | sₜ = s]

Why discount? The slides give two reasons: it is mathematically convenient (returns and values stay finite), and humans often act as if they had a discount factor below 1. With γ = 0 you care only about immediate reward. With γ = 1 future reward counts as much as immediate reward. If episodes always have finite length, you can use γ = 1.

## Two ways to compute an MRP's value

The Markov property gives structure. The MRP value function satisfies:

```text
V(s) = R(s) + γ Σ_{s'∈S} P(s'|s) V(s')
    immediate reward   discounted sum of future rewards
```

This is the **Bellman equation** for an MRP. With finite states, the matrix form is V = R + γPV. Rearranging gives

```text
(I − γP) V = R    →    V = (I − γP)^(−1) R
```

**The first method solves it directly.** That takes a matrix inverse, roughly O(N³).

**The second method iterates with dynamic programming:**

```text
initialize V_0(s) = 0 for all s
for k = 1 until convergence:
    for s in S:
        V_k(s) = R(s) + γ Σ_{s'} P(s'|s) V_{k−1}(s')
```

Each iteration costs O(|S|²). With many states, iterating is usually cheaper than inverting. The policy evaluation in the next lecture applies this same iteration to MDPs.

## Add actions and you get an MDP

The Lecture 1 PDF stops at MRPs. The [Lecture 2 slides](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf) open with the formal definition: an MDP is an MRP plus actions, the tuple (S, A, P, R, γ), where both P and R depend on the action: P(s′ | s, a) and R(s, a).

The most important observation is there too: **an MDP plus a fixed policy π is an MRP again.** So both methods in this post can evaluate any policy in an MDP. The [next post](/posts/ai/2026-09-30-cs234-mdp-planning-en) picks up from there.

## The closing summary

The last page of Lecture 1 has two sentences: RL involves learning, optimization, delayed consequences, generalization, and exploration; the goal is to learn to make good decisions under uncertainty.

That list has five items, one more than the "four challenges" earlier. The four describe RL problems. "Learning" means the agent does not know the world model and has to learn from experience.

## What you can do tonight

Using the AI tutor format, write four lines for a system you know well (a recommender, a support bot, an agent you built):

```text
state:
action:
what the dynamics model represents:
reward:
```

Then ask two questions. Does your state satisfy the Markov assumption? If you optimized this reward, could the agent find behavior that scores well but is not what you want?

If you want to compute something, take the Mars rover MRP with γ = 0.5 and rewards [1, 0, 0, 0, 0, 0, 10]. Run the iteration above for two steps from V₀ = 0 and watch how s₆'s value picks up s₇'s reward.

## Further reading

- [Sutton & Barto chapter 1](http://incompleteideas.net/book/RLbook2018.pdf): the reading the materials page assigns to Lecture 1
- [CS224R L1: Writing decision making as an RL problem](/posts/ai/2026-09-30-cs224r-intro-mdps-behavior-en): how Stanford's deep RL course covers the same ground
- [Berkeley CS285 L1–4: imitation learning, distribution shift, and RL basics](/posts/learning/2026-08-22-berkeley-cs285-imitation-rl-basics-en)
- [CS221 L7: MDPs and value iteration](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration-en): MDPs in a prerequisite course

**Series navigation**: previous, [series overview](/posts/ai/2026-09-30-cs234-course-overview-en) | next, [Planning with a model: policy evaluation, PI, VI](/posts/ai/2026-09-30-cs234-mdp-planning-en)

## References

- [CS234 home page (Winter 2026)](https://web.stanford.edu/class/cs234/)
- [CS234 Lecture Materials (Winter 2026)](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 1 slides: Introduction to RL (2026 post-class)](https://web.stanford.edu/class/cs234/slides/lecture1post.pdf)
- [Lecture 2 slides: Making Sequences of Good Decisions Given a Model of the World (2026 post-class)](https://web.stanford.edu/class/cs234/slides/lecture2post.pdf)
- [Spring 2024 Lecture 1: Introduction to Reinforcement Learning (YouTube, supplement)](https://www.youtube.com/watch?v=WsvFL-LjA6U)
- [Sutton & Barto, Reinforcement Learning: An Introduction (2nd ed.), chapter 1](http://incompleteideas.net/book/RLbook2018.pdf)
