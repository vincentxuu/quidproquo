---
title: "CS221 Lecture 8: MDPs II: Learning Q-Values Without a Transition Model"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 9
tldr: "Lecture 8 of Stanford CS221 Autumn 2025 follows the official material on MDPs II: Learning Q-Values Without a Transition Model and makes its assumptions and limits explicit."
description: "A lecture-by-lecture reading of Stanford CS221 Autumn 2025 Lecture 8: official agenda, core development, implementation connection, and material gaps."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning)

This article covers **Stanford CS221, Autumn 2025, Lecture 8**, taught by Percy Liang on 2025-10-15. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering and assignments. The executable spine is the official [reinforcement_learning artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=reinforcement_learning); its code can be checked in the [CS221 Autumn 2025 lecture repository](https://github.com/stanford-cs221/autumn2025-lectures), and the video entry point is Stanford Online's [CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN).

> Material gap: The local copy of the official artifact covers MDPs, tabular model-free methods, SARSA, and Q-learning. It does not provide features or linear approximation in this file, so this article marks that gap rather than importing material from another lecture. Canvas interactions, assignment solutions, and hidden tests are also unavailable.

## TL;DR

The lecture asks a concrete question: if the transition probabilities and rewards of an MDP are known, value iteration can find an optimal policy; if they are unknown, the agent must learn from repeated interaction. The official program proceeds through three approaches: model-based value iteration after estimating an MDP, model-free Monte Carlo that averages Q-values from complete rollouts, and SARSA and Q-learning, which bootstrap while the episode is still running.

The key to Q-learning is not that it is magically model-free. It changes the learning target for a state-action value. The agent receives `(state, action, reward, next_state, is_end)`, forms a target from the immediate reward plus the best current estimate at the next state, and moves the current Q-value toward that target. Action selection still uses epsilon-greedy exploration, but the update uses a greedy next action, making it off-policy.

This article follows the execution order of the [official artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=reinforcement_learning), rather than jumping to the final Q-learning claim. Every example uses the flaky tram MDP, while keeping separate the utility of a rollout and what the agent has learned internally.

## 1. Review the known MDP first

The official program starts by rerunning the previous lecture's MDP. For this material, an MDP exposes at least these interfaces: `start_state()` returns an initial state; `successors(state)` lists valid actions and each `(action, probability, reward, next_state)`; `is_end(state)` identifies terminal states; and `discount()` supplies the discount factor. The example constructs `FlakyTramMDP(num_locs=10, failure_prob=0.4)`, so the transport route is not guaranteed to succeed.

Do not conflate a policy with an agent. A policy maps a state to an action; the example's `tram_if_possible_policy` takes the tram where possible and walks otherwise. `generate_rollout(mdp, policy)` then produces an interaction trace, `policy_evaluation` computes the expected utility of that fixed policy, and `value_iteration(mdp)` computes an optimal policy directly. These are three different questions: how well does this policy do, what is its value, and what should we optimize if the model is available?

Q-values first receive an exact definition here. `Q_π(s, a)` is the value of taking `a` in `s` and then following policy `π`; `V_π(s)` is the value of following `π` from `s`, so `V_π(s)=Q_π(s,π(s))`. With a known model, a Q-value is a probability-weighted sum over possible next states:

`Q_π(s,a) = Σ_s' T(s,a,s') [R(s,a,s') + γ V_π(s')]`.

The optimal version replaces the future policy with the optimal one: `V*(s)=max_a Q*(s,a)`, and the optimal action is `π*(s)=argmax_a Q*(s,a)`. This is what value iteration can do, provided `T` and `R` are known. The problem only opens after this review: how can we obtain the same optimal policy when the MDP is unknown?

## 2. The RL protocol: the environment, not the interface, is unknown

Reinforcement learning replaces a known model with interaction. The lecture still assumes that the environment is backed by an MDP and that the observation is the next state. Each episode repeats the same protocol: the agent produces an action from the current state; the environment executes it and returns a reward and next state; the agent incorporates that feedback into its internal state. The diagram and flow can be inspected directly in the [artifact](https://stanford-cs221.github.io/autumn2025-lectures/?trace=reinforcement_learning).

“Unknown” has a precise meaning here. In an MDP we may not know which outcome will occur, but we know the transition distribution `T(s,a,s')`; in RL we do not even know those probabilities and can only observe samples. The file only notes that real life may expose part of the state, a partially observable MDP; it does not develop that case into an algorithm. That boundary matters.

The program defines an RL algorithm through two methods: `get_action(state)` turns a state into an action, and `incorporate_feedback(state, action, reward, next_state, is_end)` receives environmental feedback. `StaticAgent` wraps an existing policy: `get_action` always calls the same policy and `incorporate_feedback` does nothing. It is a baseline that makes the difference between a static policy and an agent whose internal policy can change visible in code.

## 3. Rollouts and evaluation: first measure one experience

`simulate(mdp, rl, num_trials)` supplies the outer training and evaluation loop. Each trial starts at `mdp.start_state()`. While the current state is not terminal, it calls `get_action`, samples a `Step` from the MDP's successor probabilities with `sample_transition`, sends reward, next state, and the terminal flag to `incorporate_feedback`, and advances to the next state. At the terminal state, it constructs a `Rollout` from the steps and computes that episode's discounted utility.

One rollout is a sample, not the expectation itself. The official example runs ten trials, stores each utility in `utilities`, and takes their mean. The resulting leaderboard `value` is an estimated value for that simulation; it is not the exact `V*` and does not prove that the agent knows the answer. More trials can make the estimate more stable, but the source only demonstrates this averaging procedure, not an error bound or statistical guarantee.

The loop also fixes the timing of feedback: the agent receives a transition at every step rather than waiting for the whole route. For `StaticAgent`, feedback is ignored, so simulation evaluates a fixed policy. For later RL algorithms, the same callback changes a data structure, so later actions may differ. This is the program-level distinction between a policy that maps states statically and an agent whose mapping evolves.

## 4. Model-based learning: learn the model, then reuse value iteration

The first response to an unknown MDP is to estimate it. The official material divides the process into three stages: first use an exploration policy to collect feedback and estimate transitions and rewards; then run value iteration on the estimated MDP; finally use the resulting exploitation policy.

In the flaky tram example, `walk_tram_policy` randomly chooses among valid actions; once the position no longer permits the tram, it can only choose `walk`. The exploration policy is not trying to maximize immediate utility. It tries all valid actions so that the estimated model gets data. Exploration therefore has a cost, and the lecture explicitly notes that utility during exploration may be suboptimal.

`ModelBasedValueIteration` stores an `EstimatedMDP`. The first feedback records the first state as the start state. Each feedback records the reward for `(state, action, next_state)` and increments that transition's count; if the next state is terminal, it is added to `end_states`. `successors` converts counts into observed probabilities by dividing each next-state count by the total count for that action. This is model estimation from feedback, not direct Q-value estimation.

During stage one, the agent has no exploitation policy, so `get_action` follows the exploration policy. After ten simulated trials, the program compares the true and estimated MDPs through their start state, successors, and terminal states. It also compares the true model's optimal policy with the optimal policy of the estimated model. With more exploration, the estimated MDP approaches the true MDP, and its policy can approach the true optimum; with finite data, the example notes that the policies need not be identical.

Stage two calls `run_value_iteration()` and stores the result as the exploitation policy. Stage three simulates ten more trials using that estimated policy. The source adds that practice need not enforce two rigid phases: continue refining the estimated MDP and gradually move from full exploration toward full exploitation. The tradeoff is exact: model-based RL can reuse the known MDP solver, but it must pay for model estimation and exploration.

## 5. Model-free Monte Carlo: learn Q directly from complete rollouts

The next question is whether we can estimate `Q*(s,a)` without first building an estimated MDP. The official answer begins with model-free Monte Carlo. Roll out a policy, observe the utility following each state-action pair, and average those observations. This bypasses the intermediate step of estimating `T` and then running value iteration.

The example has three steps with rewards `-1, -2, -2` and discount `1`. The utility from the first step is `-1 + 1×(-2) + 1²×(-2)`; from the second it is `-2 + 1×(-2)`; and from the last it is `-2 + 1×0`. Neighboring utilities therefore satisfy a recurrence: the previous utility is the current reward plus the discount times the next utility. The final future term is zero because the rollout has reached a terminal state.

The method still needs a rollout policy. The source moves from purely random exploration to epsilon-greedy: with probability `ε`, choose an action through the exploration policy; with probability `1-ε`, choose the best action among currently estimated Q-values. If a state has no tried actions, the implementation uses the exploration policy first, avoiding an average over an empty count.

`ModelFreeMonteCarlo` maintains Q with two statistics: `sum_utilities[state][action]` accumulates utilities observed from that state-action pair, and `counts[state][action]` counts visits; Q is their quotient. Each feedback is appended to the current rollout. Only when `is_end` is true does the algorithm walk backward, compute complete utilities, add them to the corresponding sums, increment counts, and clear the rollout. This is on-policy in the sense used by the source: the data comes from the epsilon-greedy policy currently being followed, and the estimate describes that policy's behavior.

The official example runs twenty trials and records mean rollout utility in the leaderboard. The limitation is the bridge to the next section: a complete Monte Carlo utility is unavailable until the episode ends. The lecture asks whether, when there is only one rollout in life, Q-values can be updated before that rollout is over.

## 6. SARSA: bootstrap while moving

SARSA answers with bootstrapping. It does not wait for a complete rollout; it combines the immediate reward with a current estimate of the future. The source writes full Monte Carlo as `u = r_0 + γr_1 + γ²r_2 + ... + γ^n r_n`, while the one-step SARSA target is `u = r_0 + γ Q_π(s_1,a_1)`. The next state and next action explain the name SARSA as the state-action-reward-state-action sequence.

For the current `Q(s,a)`, the implementation makes a gradient-style incremental update:

`Q(s,a) ← Q(s,a) + α [target - Q(s,a)]`, where `target = reward + γ Q(next_state,next_action)`.

Here `α` is the learning rate. The current value moves partway toward the target instead of being replaced in one step. SARSA calls `get_action(next_state)` to obtain the next action; it must not substitute the purely greedy `pi`, because SARSA estimates the epsilon-greedy policy actually being followed. It is therefore on-policy: exploratory actions also affect the next target.

There is no future action after a terminal state. The tabular source uses an unseen terminal Q value of `0`, so a terminal transition's target reduces to `reward`; written as general pseudocode, use `target = reward` at a terminal and add `γQ(next_state,next_action)` only otherwise. This is not cosmetic: adding a nonexistent terminal future would make the bootstrapped update disagree with the complete rollout.

## 7. Q-learning: use a greedy target to learn the optimal policy

SARSA estimates `Q_π(s,a)` for the current policy. The final section asks how to estimate `Q*(s,a)` when the optimal policy is not known. Q-learning changes SARSA's next action to the greedy action in the current Q table. It still acts with epsilon-greedy exploration, but its update calls `pi(next_state)` rather than `get_action(next_state)`.

Its target is therefore:

`target = reward + γ max_{a'} Q(next_state,a')`,

and, for a nonterminal transition:

`Q(s,a) ← Q(s,a) + α [target - Q(s,a)]`.

At a terminal next state, the future maximum is zero and the target is just the reward. The official `QLearning` class inherits SARSA's table and epsilon-greedy action selection but overrides `incorporate_feedback`; the original artifact obtains the same terminal behavior through the default zero value when a terminal state has no Q actions. This is worth noticing when reading executable source: the interface carries `is_end`, while the tabular implementation's terminal behavior is supplied by the empty-table default.

The same three-step manual example is sent through Q-learning, followed by twenty evaluation trials. The difference is concentrated in the policy used by the target: SARSA uses the next action that the agent actually selects, while Q-learning uses the greedy next action. Thus Q-learning can explore occasionally without making the update target exploratory; that is exactly where “off-policy” lives in this program, not merely an abstract label.

## 8. Q-values, tables, features, and the lecture's boundary

In this artifact, Q is tabular Q. A nested dictionary stores one number for each `(state, action)` pair. That representation fits a finite, enumerable state-action space such as flaky tram and makes `argmax`, averaging, and incremental updates easy to inspect line by line. The model-free Monte Carlo statistics and the SARSA/Q-learning tables correspond to two learning styles: averaging complete returns and correcting values incrementally toward a target.

The material does not provide state features, a feature extractor, linear Q approximation, a parameter vector, or a gradient update over features. This lecture therefore cannot support the claim that Q-learning has solved huge or continuous state spaces; `main()` instead says the next lecture will ask how to handle “huge state spaces.” If the question is how to represent Q with features or how linear approximation updates its parameters, the public artifact is a gap. Check the [official repository](https://github.com/stanford-cs221/autumn2025-lectures) for the appropriate material rather than importing another term, another offering, or memory into Lecture 8.

## 9. Comparing the methods

- Model-based value iteration: estimate `T`, `R`, and terminal states from exploration, then run value iteration on the estimated MDP. It retains a model and reuses the MDP solver; the cost is model learning and potentially suboptimal exploration utility.
- Model-free Monte Carlo: bypass the estimated MDP and average complete-rollout utilities into Q-values. It is direct, but it must wait for an episode to finish and each return can vary substantially.
- SARSA: use the next action actually selected by the epsilon-greedy policy in a bootstrapped target, learning Q for the current policy. It updates early, but exploration remains part of the target.
- Q-learning: use a greedy next action in the bootstrapped target while keeping exploratory behavior for action selection. It directly targets the optimal-policy Q-values, but still depends on its table, learning rate, and observed coverage; off-policy does not automatically solve large state spaces, unvisited actions, or scarce data.

## 10. Closing: remember the execution order

The lecture starts with a known MDP: policy, rollout, policy evaluation, and value iteration all use an accessible model. It removes that assumption and lets the agent see only reward and next state after each action. `simulate` defines the interaction protocol and evaluates behavior with mean utility over multiple rollouts.

Model-based learning reconstructs an estimated MDP from feedback and reuses value iteration. Model-free Monte Carlo directly accumulates complete-rollout utilities as Q-values. Epsilon-greedy ensures that the agent does not simply repeat its current favorite action. Because complete returns arrive too late, SARSA bootstraps from the next action actually selected. Finally, Q-learning keeps exploratory action selection but builds its target from the greedy next action, moving from on-policy to off-policy learning.

If the question changes to features, linear approximation, or huge state spaces, this Lecture 8 artifact has already marked the boundary: find the next official material instead of inventing missing sections here.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: reinforcement_learning](https://stanford-cs221.github.io/autumn2025-lectures/?trace=reinforcement_learning)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
