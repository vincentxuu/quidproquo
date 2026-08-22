---
title: "CS221 Lecture 9: MDPs III: Differentiating Expected Return Directly"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs221, artificial-intelligence, stanford]
lang: en
series:
  name: "Reading Stanford CS221"
  order: 10
tldr: "Lecture 9 moves from tabular RL to function approximation, derives REINFORCE with the log-derivative identity, and connects the derivation to the executable PyTorch implementation."
description: "A source-faithful reading of Stanford CS221 Autumn 2025 Lecture 9: RL review, function approximation, policy-gradient derivation, REINFORCE mechanics, and variance reduction."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs221-lecture-09-policy-gradient)

This article covers **Stanford CS221, Autumn 2025, Lecture 9**, taught by Percy Liang on 2025-10-20. The [official course site](https://stanford-cs221.github.io/autumn2025/) fixes the offering and assignments. The article follows the execution order of the lecture's [policy_gradient](https://stanford-cs221.github.io/autumn2025-lectures/?trace=policy_gradient) artifact and explains every example and derivation that actually appears there.

> Material gap: Official lecture material and video are public; Canvas interactions, assignment solutions, and hidden tests are unavailable. This article covers only what appears in `policy_gradient.py`. Actor-critic, generalized advantage estimation, entropy regularization, and off-policy policy-gradient derivations are not silently added.

## Where the lecture starts

The previous lecture's thread was reinforcement learning. This lecture reviews that setting, then asks how to handle larger state spaces and how to learn the policy directly.

There are two roles in the RL setting. The environment is a Markov decision process (MDP), and the agent is an RL algorithm. The source uses `FlakyTramMDP(num_locs=6, failure_prob=0.1)`: six locations, with a failure probability for the tram. The agent observes a state, chooses an action, receives a reward, and observes the next state.

The Q-learning review runs one interaction. At state 1 the agent chooses `walk`, receives `-1`, and reaches state 2. At state 2 it chooses `walk` again, receives `-1`, and reaches state 3. At state 3 it chooses `tram`, receives `-2`, reaches state 6, and terminates. A rollout produces the discounted sum of rewards. Here `discount=1`, so this rollout's utility is `-1 + -1 + -2 = -4`.

Because the environment is random, one rollout is not the value of a policy. The source runs 100 trials and uses the mean utility as an estimate of value. Value here is a sampled estimate of expected utility, not a constant revealed by one execution.

## RL review: what is being estimated?

The source distinguishes four values: `V_π(s)` is the value of starting at `s` and following `π`; `Q_π(s, a)` is the value of taking `a` at `s` and then following `π`; `V*(s)` is the value of following the optimal policy; and `Q*(s, a)` is the value of taking `a` and then following the optimal policy.

This leads to the model-based/model-free split. Model-based methods estimate the MDP and then compute an optimal policy. Value-based model-free methods do not estimate the full MDP; they estimate `Q(s, a)` directly. In the tabular setting, every state/action pair has a slot in a lookup table.

The source gives the common model-free update:

```text
Q(s, a) ← Q(s, a) + learning_rate × (target - Q(s, a))
```

The target may use a full rollout or bootstrapping. The first uses the actual discounted sum. The second uses the immediate reward plus an estimate of future reward. Monte Carlo estimates `Q_π` from full rollouts and is on-policy. SARSA estimates `Q_π` with `r + γ Q(s', a')`, where `a' = π(s')`, and is also on-policy. Q-learning estimates the optimal value with `r + γ max_a' Q*(s', a')` and is off-policy.

The source's on-policy/off-policy definition is precise: an exploration policy generates rollouts, and an estimation policy is used for the Q-values. They are the same in the on-policy case and different in the off-policy case. This distinction returns later because REINFORCE generates its rollout with its current stochastic policy, making the update on-policy.

## When tabular methods are not enough: function approximation

Tabular methods require every state/action pair to fit in a table. The source gives two more realistic state examples: a robot image and a sentence used in theorem proving. The set of all possible images or sentences is not a practical lookup table, so we use function approximation.

Replace the table with a parameterized function `Q_θ(s, a)`. The source frames the design as three familiar machine-learning choices: what functions belong to the hypothesis class, what loss says that a function is good, and what optimization algorithm reduces the loss.

First map state and action to a feature vector `φ(s, a)`. A linear function is `Q_θ(s, a) = φ(s, a) · θ`; an MLP can instead compute `MLP_θ(φ(s, a))`. This shares parameters across entries, but does not magically remove the modeling problem.

`ParameterizedQLearning` uses a tabular-like feature design for simplicity. `phi` maps `(state, action)` to an integer index and creates a one-hot vector of length `num_locs × len(actions)`. With six states and two actions, each pair still has its own coordinate, so the example preserves the freedom of a table.

`Q(state, action)` passes the feature through `nn.Linear`. `pi(state)` computes every action value and chooses the largest: `π_θ(s) = argmax_a Q_θ(s, a)`. During the demonstrated interaction, `incorporate_feedback` computes the target, squared loss, and gradient step. A nonterminal target is the immediate reward plus a discounted bootstrapped next-action value; a terminal target is only the reward. The update is `zero_grad()`, `loss.backward()`, and `optimizer.step()`.

After 100 rollouts, the source extracts the current policy and `V_θ(s) = Q_θ(s, π_θ(s))`, then compares them with values from solving the MDP using value iteration. The result is only “in the ballpark,” with better accuracy for states visited more often. The important boundary is that function approximation still estimates Q-values and obtains a policy with argmax. The lecture now asks whether the policy itself can be the learned object.

## Direct policy parameterization and the classifier problem

If a policy is treated as a classifier, the input is state `s` and the output is action `a`. A hard classifier is difficult to optimize directly because its discrete output changes at an argmax boundary; it does not provide a smooth direction for changing an action.

The source replaces the hard policy with a probabilistic classifier: `π_θ(a | s)` gives the probability of each action at a state. `Reinforce` uses `nn.Linear(num_locs, len(actions))`; a one-hot state becomes logits, and softmax turns logits into probabilities. The policy can sample an action instead of returning a single nondifferentiable category.

### The imitation-learning contrast

The source first shows the easy case where demonstrations exist. Its rollout goes from state 1 with `walk` to state 2, from state 2 with `walk` to state 3, and from state 3 with `tram` to state 6. The supervised examples are `(1, walk)`, `(2, walk)`, and `(3, tram)`. The objective is

```text
J(θ) = Σ_t log π_θ(a_t | s_{t-1})
```

Maximizing the demonstrated actions' log probabilities is imitation learning. The source names teleoperation in robotics and human-written mathematical solutions. RL has no demonstrations, however: it has a reward function and must learn from the outcomes of its own actions.

## Start with the probability of a trajectory

The source represents the three-step trajectory as

```text
τ = (s₀, a₁, r₁, s₁, a₂, r₂, s₂, a₃, r₃, s₃)
```

The example uses actions `walk, walk, tram` and rewards `-1, -1, -2`, ending at state 6. With `discount=1`, its utility is `-4`.

The probability of a trajectory is a product of the initial-state probability, policy action probabilities, and environment transition probabilities:

```text
p(τ) = p(s₀)
       × π_θ(a₁ | s₀) × T(s₀, a₁, s₁)
       × π_θ(a₂ | s₁) × T(s₁, a₂, s₂)
       × π_θ(a₃ | s₂) × T(s₂, a₃, s₃)
```

`p(s₀)` is the probability of the starting state, `π_θ(a_t | s_{t-1})` is the policy, and `T(s_{t-1}, a_t, s_t)` is the transition distribution. The parameters `θ` occur in the policy terms, which is what lets the later derivation isolate them.

The objective is expected rollout utility:

```text
V(θ) = E_θ[utility(τ)]
     = Σ_τ p_θ(τ) × utility(τ)
```

### Why a sampled discrete action blocks naive differentiation

If `V(θ)` is viewed as sampling a discrete action and then running the environment, the sampled `walk` or `tram` cannot be treated as an ordinary continuous tensor through which a gradient passes. The action is categorical, and transitions may also be stochastic. Enumerating every possible trajectory would recover the full expectation, but that is exactly the cost we want to avoid as the state/action space grows.

The source therefore does not differentiate the sampled action itself. It treats the selected trajectory as a sample from `p_θ(τ)` and rewrites the gradient of the expectation.

## The log-derivative identity and REINFORCE

Differentiate the expectation line by line:

```text
∇_θ V(θ) = ∇_θ E_θ[utility(τ)]
∇_θ V(θ) = ∇_θ Σ_τ p_θ(τ) × utility(τ)
∇_θ V(θ) = Σ_τ ∇_θ p_θ(τ) × utility(τ)
∇_θ V(θ) = Σ_τ p_θ(τ) × ∇_θ log p_θ(τ) × utility(τ)
∇_θ V(θ) = E_θ[∇_θ log p_θ(τ) × utility(τ)]
```

The middle step uses `∇p = p∇log p`. The source calls this the policy gradient theorem (identity). It does not make a discrete action continuous; it changes the expression into a log trajectory-probability gradient weighted by utility.

An expectation can be replaced by a sample `τ ~ p_θ(τ)`. Define the single-sample objective `J(θ, τ) = log p_θ(τ) × utility(τ)`. A gradient step on it is an unbiased estimator of the expected gradient. Expanding the trajectory probability leaves the policy terms, because the initial-state and transition distributions do not depend on policy parameters:

```text
∇_θ J(θ, τ)
= utility(τ) × Σ_t ∇_θ log π_θ(a_t | s_{t-1})
```

This is REINFORCE, linked by the source to Williams (1992). Intuitively, it performs imitation learning on rollouts generated by its own policy, weighted by utility. If utility is only `{0, 1}` for success or failure, it is imitation learning on the policy's successful demonstrations.

The estimator assumes that the rollout comes from the current `π_θ`, because the expectation is over `p_θ(τ)`. That is why the source labels the update on-policy. The result is an unbiased gradient estimate; it does not mean every sampled episode improves the policy or that the estimate has low variance.

## Turning the formula into PyTorch

`policy_gradient_implementation()` creates the same flaky tram MDP and `Reinforce(num_locs=6, actions=["walk", "tram"], discount=1, learning_rate=0.01)`. It runs a different rollout: state 1 with `walk` gets `-1` and reaches state 2; state 2 with `tram` gets `-2` and remains at state 2; state 2 with `tram` again gets `-2`, reaches state 4, and terminates. The utility is `-5`.

No separate epsilon-greedy exploration policy is needed. `get_action` samples from the stochastic softmax policy, so the policy itself explores.

The class maps directly to the equations. `phi(state)` creates a one-hot vector using `state - 1` as the index. `pi(state)` feeds it through the linear model and softmax and returns the two-action distribution. `get_action(state)` uses `torch.multinomial` to sample an index and maps that index back to an action name; it does not use argmax.

On every feedback step, `incorporate_feedback` adds `reward × discount ** len(rollout)` to `self.utility` and stores the action, reward, and next state. Until the episode ends, it only records the trajectory. At termination it walks through the rollout: the first state is `start_state`, and later states come from the previous step, reconstructing each `s_{t-1}` for its action.

For each pair, the model produces logits, the target is the action's one-hot index, and `CrossEntropyLoss` measures the current policy's classification loss. The source weights every term by the utility of the entire rollout:

```text
loss = Σ_t utility(τ) × CrossEntropy(logits(s_{t-1}), a_t)
```

The optimizer minimizes cross-entropy. Because utility can be negative, the weight reverses the gradient direction so that the update has the effect of increasing the log probability of actions from that rollout. This is the implementation connection to `utility × Σ log π`. The code then calls `zero_grad()`, `loss.backward()`, and `optimizer.step()`, and clears the rollout state. Finally it estimates value over 50 trials and lists the current policy at all six states.

This implementation does not use returns-to-go and does not learn a separate value function. It uses the same episode utility for every action in that episode. That is precisely what the variance-reduction section is about improving.

## Bias, variance, and estimator cost

There is an official executable-artifact bug/inconsistency that must be called out here: `policy_gradient.py` writes `probs = [0.1, 0.1, 0.1, 0.1]`, whose entries sum to only `0.4`. As an unnormalized weighted sum, `Σ_i p(i) × points[i] = 0.4`; but `torch.multinomial` treats nonnegative inputs as weights and normalizes them before sampling. The actual sampling distribution is therefore uniform with probability `0.25` for each point, and the sampling estimator's expectation is `(-4 - 6 + 6 + 8) / 4 = 1`, not `0.4`. Calling `0.4` the true mean is inconsistent with the executable artifact's sampling behavior, so the estimators below must be interpreted under the distribution that the code actually samples. The source temporarily leaves RL for a mean-estimation example: `μ = E[f(i)]`; each estimator is a random variable that tries to approach the actual `μ = 1`, with bias, variance, and cost.

The simplest estimator samples one `i` from the normalized distribution and returns `f(i)`, so one result can be -4, -6, 6, or 8. `evaluate_estimator` repeats this 100 times and computes mean and variance. A second estimator samples two points and averages them; it costs more but is generally more stable. A third adds Gaussian noise to one sample. It remains unbiased for the actual mean `1`, but its variance is worse.

The fourth estimator subtracts an offset. With `offsets = [-6, -6, 6, 6]`, the offset has mean zero under the normalized uniform sampling distribution, so

```text
E[f(i) - offset(i)] = E[f(i)] - E[offset(i)] = E[f(i)]
```

The mean is therefore unchanged at `1`, not `0.4`, while a useful offset can cancel variation and reduce variance. The zero-mean offset does not repair the source's inconsistent `probs` declaration or change the actual target mean back to `0.4`. This small example is the bridge to baselines, and it also makes the broader point that an estimator must be judged by bias, variance, and cost together.

## Baselines, returns-to-go, and bootstrapping

Return to `V(θ) = E_θ[utility(τ)]` and `∇_θ V(θ) = E_θ[∇_θ log p_θ(τ) × utility(τ)]`. REINFORCE is the unbiased estimate obtained from a sampled `τ ~ p_θ(τ)`, but the utility can be noisy.

If `b(s)` is any function of state only, not action, and `a ~ π_θ(a | s)`, the source gives the key identity:

```text
E_θ[∇_θ log π_θ(a | s) × b(s)] = 0
```

The proof is explicit for a normalized action distribution. `E[b(s)]` is constant with respect to `θ`, so its gradient is zero. Expanding over actions gives `Σ_a π_θ(a | s)b(s)`, whose gradient is `Σ_a ∇π_θ(a | s)b(s)`. Applying `∇π = π∇logπ` yields the zero-expectation identity. Subtracting a baseline therefore leaves the expected gradient unchanged. This baseline identity concerns normalized `π_θ`; it should not be conflated with the preceding artifact inconsistency, where unnormalized `probs` are passed to `torch.multinomial` and normalized implicitly.

The source lists three enhancements:

1. **Baselines** replace utility with `utility(τ) - b(s_{t-1})`; the baseline must depend only on state for the zero-expectation argument.
2. **Returns-to-go** use `r_t + γr_{t+1} + γ²r_{t+2} + ... - b(s_{t-1})`, retaining rewards from the current step onward.
3. **Bootstrapping** replaces full utility with a possibly biased `Q(s_{t-1}, a_t) - b(s_{t-1})`. The source explicitly says this reduces variance while introducing some bias.

The `γ` here is the same kind of discount used in the earlier discounted sum. The implementation sets `discount=1`, so its demonstrations have no reward decay. The article does not present a baseline as an existing feature of `Reinforce`, and does not fill the source's gaps with actor-critic material.

## The actual contract of this lecture

The source ends by placing three routes side by side: model-based methods estimate the MDP and obtain a policy; value-based methods estimate Q-values and obtain a policy; policy-based methods estimate the policy directly. Their common form is to generate rollouts, form a loss, and take a gradient step on MDP, Q-value, or policy parameters.

The policy-gradient contract is concrete: the policy is a stochastic distribution `π_θ(a | s)`; the current policy generates the rollout; each rollout produces utility; and the update uses its `(state, action)` pairs weighted by utility or by a variance-reduced alternative. The log-derivative identity avoids differentiating the sampled discrete action as a continuous value while still producing an unbiased gradient estimator for expected utility.

The costs are just as concrete. Updates wait for an episode to finish, and one trajectory's utility can be very noisy. Baselines and returns-to-go can reduce variance; bootstrapping trades some bias for lower variance. The source does not explain how to learn a baseline, choose hyperparameters, or prove convergence in larger environments. Those remain outside this material and cannot be inferred from the three-stop tram example.

## References

- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/)
- [Official lecture artifact: policy_gradient](https://stanford-cs221.github.io/autumn2025-lectures/?trace=policy_gradient)
- [CS221 Autumn 2025 executable lecture repository](https://github.com/stanford-cs221/autumn2025-lectures)
- [Official Stanford Online CS221 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMeDqwS1yFl3j3sR_-MQNEN)
- [Williams, 1992: Simple Statistical Gradient-Following Algorithms for Connectionist Reinforcement Learning](https://link.springer.com/article/10.1007/BF00992696)
