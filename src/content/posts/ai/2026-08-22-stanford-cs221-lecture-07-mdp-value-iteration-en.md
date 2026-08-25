---
title: "CS221 Lecture 7: MDPs I: Putting Uncertainty into State Transitions"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 8
tldr: "Lecture 7 of Stanford CS221 Autumn 2025 follows the official material on MDPs I: Putting Uncertainty into State Transitions and makes its assumptions and limits explicit."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 7: official agenda, core development, implementation connection, and material gaps."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-07-mdp-value-iteration)

This article covers **Stanford CS221, Autumn 2025, Lecture 7**, taught by Percy Liang on 2025-10-13. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering, assignments, and lecture context. The article follows the executable [official `mdp` lecture artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=mdp), with the data structures and update order translated into a readable derivation. The recording can be cross-checked through the [official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN), and the lecture source is in the [official lecture repository](https://github.com/stanford-cs221/autumn2025-lectures).

> Material gap: The official lecture artifact and video are public; the local `mdp.py` does not provide the full spoken lecture, Canvas interactions, assignment solutions, or hidden tests. The claims below therefore stay with what the source directly demonstrates or what follows from its equations. Details from another term, unseen video material, or intuition are not presented as Lecture 7 conclusions.

## 1. Start with search: why an MDP is needed

`main()` begins by recalling last week's search. `TravelSearchProblem(num_locs=10)` has `start_state()`, `successors(state)`, and `is_end(state)`: each successor packages an action, a cost, and a next state. In search, executing an action from a state leads deterministically to one new state, so a solution can be described as an action sequence from start to goal; path cost then compares candidate solutions.

That model is insufficient for the grocery-store question: traffic and parking vary, so the agent chooses without knowing the outcome and must continue from whichever state occurs. The official artifact's distinction is that an MDP generalizes search while making the action result a distribution over next states.

So the question is not simply “which path is shortest?” It is “what should be done in every possible state, and how good is the behavior in expectation?” An action sequence does not say what to do after a tram failure or a different die outcome.

## 2. MDP vocabulary: states, actions, successors, probabilities, and rewards

The source explains the name first. “Markov” means past and future are treated as independent given the current state; “decision” means an agent takes actions; “process” means events unfold sequentially. It is also a modeling reminder: the state must retain information needed for future decisions, or the state-based recurrence no longer describes the intended process.

The interface is small, but every part matters:

- `start_state()` gives the starting point for rollouts and state traversal.
- `successors(state)` returns possible outcomes as `Step` records.
- `is_end(state)` says when expansion and future decisions stop.
- `discount()` supplies γ, the weight of future reward in utilities and recurrences.

`Step` stores the selected `action`, outcome `prob`, transition `reward`, and resulting `state`. `Actions(s)` is the available action set; `R(s,a,s')` is reward; `T(s,a,s')` is probability. For fixed `(s,a)`, all `T` values must sum to 1.

### Flaky tram: one action, two possible outcomes

The first example is a flaky tram. Locations are numbered 1 through n. Walking from i to i+1 takes one minute. Taking a tram aims to move from i to 2i and costs two minutes, but the tram fails with probability p. The goal is to reach n with the least expected time. The program encodes time cost as negative reward: walk gives -1 and tram gives -2, so maximizing reward still means preferring less negative expected time.

With `FlakyTramMDP(num_locs=10, failure_prob=0.4)`, the start state is 1. If `state + 1 <= num_locs`, walk has one successor with probability 1, reward -1, and state + 1. If `2 * state <= num_locs`, tram has two successors with the same action name: success reaches `2 * state` with probability `1 - failure_prob`, while failure stays in the current state with probability `failure_prob`; both outcomes have reward -2. Multiple successors for one action are the concrete shape of a distribution, not two actions for the policy to choose between.

When the tram cannot advance to n, the program models tram as probability 1, reward -100, and terminal `num_locs`. This penalty is example-specific; only n is terminal, so a failed tram that stays put creates another decision point.

### Dice game: termination and cycles can coexist

The second example is a dice game. In each round, choose `quit` or `stay`. Quit gives 10 with probability 1 and moves to `end`. Stay gives 4, then rolls a six-sided die: outcomes 1 or 2 move to `end`, while the other four outcomes continue in `in`. The program represents stay with two successors: probability `1/3`, reward 4, state `end`; and probability `2/3`, reward 4, state `in`. One action can therefore terminate immediately or return to the same state and form a cycle.

Search and MDP share start, end, and successors. The superficial difference is costs versus rewards; the deeper one is a single next state versus a next-state distribution. `get_action_successors` groups `Step` records by action so Q-value computation can weight all outcomes.

## 3. Policy, rollout, utility, and discount

In deterministic search, a solution can be an action sequence. MDPs need a different object. A policy is a function `π(s) -> a` that tells the agent what to do in each state. `always_walk_policy`, `always_quit_policy`, and `always_stay_policy` are simple policies in the source. `tram_if_possible_policy` checks `state * 2 <= mdp.num_locs`, taking the tram when it is available and walking otherwise. It needs information from the MDP because a policy must not select the example's invalid tram case blindly.

The order in `generate_rollout(mdp, policy)` is the important part. It starts at `start_state()`. While `is_end(state)` is false, it calls the policy to choose an action; filters `mdp.successors(state)` to that action; extracts probabilities; samples one successor with `np.random.choice`; appends the `Step`; and updates state to `step.state`. The policy chooses the action, while the MDP transition distribution chooses the result. One policy can therefore generate different rollouts because of tram failures or dice outcomes.

The utility of one rollout is a discounted sum of rewards. `compute_utility` applies `reward_i * discount ** i` to step i, so

\[
U = R_0 + \gamma R_1 + \gamma^2 R_2 + \cdots .
\]

The source uses `0 <= γ <= 1`. At γ=1 there is no discounting; future and present have equal weight. At γ=0 only the first reward matters. At γ=0.5, the next reward has half the present weight and later rewards decay by further powers. Both `FlakyTramMDP.discount()` and `DiceGameMDP.discount()` return 1, so those examples use undiscounted utility; separate calls to `compute_utility` demonstrate 0 and 0.5 on the same rollout.

Discounting defines the importance of distant reward and affects repeated backups; changing γ changes the objective, not just a solver setting. With γ=1, finite utility and termination depend on the specific cycle, rewards, and transitions. The source does not claim that every cycle terminates or converges.

## 4. Estimating policy value by simulation

For a fixed policy π, the expected utility from state s while following that policy is `V_π(s)`. The direct estimator is to roll out the policy repeatedly and average the resulting utilities. `monte_carlo_policy_evaluation` does exactly that: it creates the requested number of rollouts, collects each utility, and returns their `np.mean`. Since always-walk is deterministic in the tram example, the source uses one rollout; the tram policy and dice stay policy are sampled 20 times because their outcomes are stochastic.

This value is an estimate: a finite sample mean can differ from the expectation, and more simulations only approach it. The recurrence is introduced to avoid repeated sampling.

## 5. Q-values: making one action's expectation computable

The next question in the source is whether `V_π(s)` can be computed more efficiently than by many rollouts. The answer is to reuse the dynamic-programming recurrence. Define `Q(s, a, V)` by taking action a in state s, adding immediate reward to discounted successor value for each outcome, and summing those quantities with the outcome probabilities.

For the `Step` collection of action a, `compute_q_value` computes

\[
u(s,a,s') = R(s,a,s') + \gamma V(s'),
\]

then

\[
Q(s,a,V) = \sum_{s'} T(s,a,s')\bigl(R(s,a,s') + \gamma V(s')\bigr).
\]

In the flaky-tram warm-up, `get_initial_values` creates values corresponding to “just terminating”: terminal states are 0 and other states are -100. The code chooses state 9, obtains the action selected by the policy, gets that action's successors, and passes their values to `compute_q_value`. This is not full policy evaluation; it demonstrates one state and one action backup.

The source scales the operation to every state, replaces old values, and repeats. This is bootstrapping: zero, one, and two steps represent termination after zero, one, or two policy steps, progressively propagating farther outcomes. Each sweep uses the previous iteration's values.

## 6. Convergence, policy evaluation, and the Bellman equation

An iterative algorithm needs a stopping rule. `compute_distance` takes the maximum absolute difference between two state-value dictionaries:

\[
d(V,V') = \max_s |V(s)-V'(s)|.
\]

Each `policy_evaluation` iteration writes 0 for terminal states and uses only `π(s)` elsewhere. It calls `compute_q_value`, records the distance, stops below `tolerance` (default `1e-5`), or updates values up to `max_iters` (default 100). A distance plot shows change, not proof of correctness.

For a fixed policy, the update is the Bellman expectation equation:

\[
V_\pi(s) = \sum_{s'} T(s,\pi(s),s')
\left(R(s,\pi(s),s') + \gamma V_\pi(s')\right).
\]

Terminal values are explicitly set to zero in this program, so terminal states do not invoke a policy or successors. `get_states` recursively follows every successor from the start state and collects reachable states, giving the iterative algorithms a finite dictionary to update. This also exposes an implementation boundary: if the state space is infinite, not enumerable, or keeps generating new states, this `get_states` plus dictionary design cannot be applied directly.

The program approximates a recurrence with a tolerance or iteration cap; mathematical convergence needs conditions. A standard sufficient setting is finite states/actions, bounded rewards, and `0 <= γ < 1`, giving the Bellman backup its usual contraction behavior. With γ=1 or potentially endless reward accumulation, a decreasing distance is not a general guarantee: inspect termination, rewards, and transitions. Both examples use γ=1, so this article reports execution rather than a verified contraction theorem.

## 7. Value iteration: replace the policy action with the best action

Policy evaluation receives a policy as input. Value iteration aims to obtain the optimal value and policy directly. The source notes that the two procedures look similar: one evaluates a fixed `f(x)`, while the other compares actions and takes the best one at each state. The artifact links this dynamic-programming history to [Bellman's 1957 paper on dynamic programming](https://gwern.net/doc/statistics/decision/1957-bellman-dynamicprogramming.pdf); this article keeps to the recurrence shown in the source.

The optimal-value update is the Bellman optimality equation:

\[
V^*(s) = \max_a \sum_{s'} T(s,a,s')
\left(R(s,a,s') + \gamma V^*(s')\right)
= \max_a Q(s,a,V^*).
\]

The key difference is small but decisive. Policy evaluation fixes `a = π(s)`. Value iteration evaluates every action at a state with `compute_q_value`, then chooses the maximum Q-value. `value_iteration_for_state` collects actions and Q-values, uses `np.max` for the value, and uses `np.argmax` for the corresponding action. That action is the greedy choice under the current value table.

The outer loop uses the same initialization, creates `pi`, writes 0 for terminals, and calls `value_iteration_for_state` to update each value and action. It stops by distance or carries values forward. The result contains values, an action per state, and per-iteration distances; the policy is recorded during backup.

“Optimal” means maximizing the Bellman backup in this known MDP with these rewards, discount, terminal definition, and stopping settings. Negative time costs make this equivalent to shorter expected time; changing rewards, parameters, horizon, or transition estimation changes the contract.

## 8. How the examples connect the full pipeline

In the flaky-tram example, state 9 has walk reward -1, while tram is encoded as -100 because `2 * 9 > 10`. At earlier states, tram's Q-value includes both movement to `2 * state` and failure that stays in place, so failure probability affects the policy.

In the dice game, quit gives 10 and terminates; stay gives 4, then ends with probability `1/3` or returns to `in` with `2/3`. Monte Carlo estimates the policies, policy evaluation fixes one action, and value iteration compares both. The return to `in` shows that an MDP graph need not be acyclic.

## 9. Complexity and implementation boundaries

Let `|S|` be the number of reachable states, and include the number of actions per state and successors per action in the enumeration cost. One policy-evaluation iteration visits all states and expands the successors of the policy action. One value-iteration iteration visits all states and expands successors for every action. Roughly, if each state has `A` actions and each action has `B` outcomes, one value-iteration sweep costs `O(|S|AB)` and `K` sweeps cost about `O(K|S|AB)`. This is the enumeration cost of the implementation; it excludes the separate recursive state-graph construction and does not count NumPy or plotting overhead.

In memory, `values`, `new_values`, `pi`, and the visited set grow with reachable states. Large spaces make full tables and sweeps expensive. The source provides no function approximation, sampling-based planning, state abstraction, or model estimation.

The terminal-state rule is another boundary. Once `is_end` returns true, the program writes value 0 and does not apply another action or reward. That fits the examples' convention that `end` has no future reward; if a real task has an exit reward, it should be encoded on the transition into the terminal state rather than expected from the terminal state itself. The -100 invalid-action penalty is likewise a modeling decision, not something the algorithm discovers.

Finally, `max_iters=100` and `tolerance=1e-5` do not make `V*` exact. Hitting the cap returns an approximate table; a decreasing distance still requires checking initialization, reward scale, cycles, termination, and bounded reward at γ=1.

## 10. The model to carry forward

Do not just memorize “take the max”; audit the contract. Does the state retain Markov information? Are actions complete and probabilities normalized? Is reward a negative cost or utility? Which states are terminal? Does γ fit future preferences? Is the reachable space finite and enumerable? If one answer is unclear, the table may not answer the intended question.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: mdp](https://stanford-cs221.github.io/autumn2025-lectures/?trace=mdp)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
