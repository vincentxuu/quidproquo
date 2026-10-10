---
title: "Reading CS234, Part 7: Policy Gradients — Score Functions, REINFORCE, Baselines, and Actor-Critic"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, policy-gradient, reinforce]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 7
tldr: "Policy gradients skip learning a value function and deriving a policy from it. They run gradient ascent directly on the policy parameters θ. The key step rewrites ∇P(τ;θ) as P(τ;θ)∇log P(τ;θ); after taking the log, the dynamics model drops out and only the policy's own score function is left. The raw estimator is unbiased but very noisy, and CS234 reduces the noise in three ways: pair each action only with the return that follows it (REINFORCE), subtract a state-dependent baseline (proven not to add bias), and replace Monte Carlo returns with values estimated by a critic (actor-critic)."
description: "A guide to the second half of Lecture 5 and the first half of Lecture 6 of Stanford CS234 Reinforcement Learning (Winter 2026): why the aliased gridworld needs a stochastic policy, the likelihood ratio derivation, score functions for softmax and Gaussian policies, the policy gradient theorem, using temporal structure to get REINFORCE, the proofs that a baseline adds no bias and that V(s) is a near-optimal baseline, vanilla policy gradient, and advantages and actor-critic."
draft: false
glossary:
  - term: "score function"
    aliases: ["∇log π"]
    definition: "The derivative of the log of a parameterized probability distribution with respect to its parameters, e.g. ∇_θ log π_θ(a|s)."
    context: "In policy gradients, the score function of a trajectory's probability reduces to the policy term alone, so no dynamics model is needed."
  - term: "REINFORCE"
    aliases: ["Monte-Carlo policy gradient"]
    definition: "A Monte Carlo policy gradient algorithm that, after each episode, updates the policy at every step with θ ← θ + α ∇log π_θ(a_t|s_t) G_t."
    context: "The version on page 57 of CS234 L5; A2 asks you to implement it."
  - term: "baseline"
    definition: "A state-dependent quantity b(s) subtracted from the return in a policy gradient. It leaves the expected gradient unchanged but can lower its variance."
    context: "CS234 L6 proves a baseline adds no bias and derives that a near-optimal choice is the expected return, i.e. V(s)."
  - term: "advantage function"
    aliases: ["A(s,a)"]
    definition: "A^π(s,a) = Q^π(s,a) − V^π(s): how much more return you get by taking action a in state s and then following π, compared with following π throughout."
    context: "With V as the baseline, the policy gradient can be written as ∇log π times the advantage."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the Winter 2026 slides and assignments of [CS234](https://web.stanford.edu/class/cs234/); the recordings are the public Spring 2024 videos.** It is Part 7 of the [Reading Stanford CS234](/posts/ai/2026-09-30-cs234-course-overview-en) series and follows [DQN](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning-en).

Official materials used:

- Pages 22–61 of the [Lecture 5 slides](https://web.stanford.edu/class/cs234/slides/lecture5post.pdf) (policy gradients, score functions, REINFORCE, the start of baselines)
- Pages 9–23 of the [Lecture 6 slides](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf) (baseline derivation, vanilla PG, actor-critic)
- The assigned reading, Chapter 13 of [Sutton & Barto, 2nd ed.](http://incompleteideas.net/book/the-book-2nd.html)
- [Video 05, "Policy Search 1"](https://www.youtube.com/watch?v=L6OVEmV3NcE) and [video 06, "Policy Search 2"](https://www.youtube.com/watch?v=8PwvNQ5WS-o) from the public 2024 recordings. Per their YouTube chapters, video 05 runs from policy gradients and the likelihood ratio to REINFORCE and baselines, and the first half of video 06 continues with the baseline derivation and actor-critic.

Access level is **A3**, with the same gaps as the rest of the series: the 2026 recordings are on Canvas only, and live poll results and Ed discussions are not public.

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=L6OVEmV3NcE
title: Lecture 5: Policy Search 1 (Spring 2024, YouTube)
```

```youtube
url: https://www.youtube.com/watch?v=8PwvNQ5WS-o
title: Lecture 6: Policy Search 2 (Spring 2024, YouTube)
```

Original videos: [Lecture 5: Policy Search 1 (Spring 2024, YouTube)](https://www.youtube.com/watch?v=L6OVEmV3NcE)、[Lecture 6: Policy Search 2 (Spring 2024, YouTube)](https://www.youtube.com/watch?v=8PwvNQ5WS-o)

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## Why not keep learning values?

Page 23 first answers whether policy gradients are worth learning. They have been influential in NLP (sequence-level training built on REINFORCE), in robotics ([End-to-End Training of Deep Visuomotor Policies](https://arxiv.org/abs/1504.00702)), and in ChatGPT. The slides also note that PPO, which you implement in A2, was used to train ChatGPT.

Pages 24–25 sort methods into three groups:

| Group | What it learns | Where the policy comes from |
|---|---|---|
| Value-based | A value function | Implicit, e.g. ε-greedy |
| Policy-based | A policy | Learned directly, no value function |
| Actor-critic | Both | Learned directly, helped by a value function |

From this lecture on, the policy is written directly as $\pi_\theta(s, a) = P[a \mid s; \theta]$, and the goal is to find the $\theta$ that maximizes $V^{\pi}$.

### Aliased gridworld: deterministic policies get stuck

Pages 27–29 use an example to show why we want **stochastic policies**. The gridworld has two grey states that the agent cannot tell apart using features like "wall to the north" and "wall to the south".

- Under this aliasing, the best deterministic policy must either move west in both grey states or move east in both. Either way, it can get stuck and never reach the money.
- Value-based methods learn a near-deterministic policy (greedy or ε-greedy), so the agent walks up and down the corridor for a long time.
- The best stochastic policy moves east or west with probability 0.5 each in the grey states and reaches the goal in a few steps with high probability.

Policy-based methods can learn that stochastic policy directly.

## Derivation: moving the gradient inside the expectation

Pages 31–33 set up the objective. Assume an episodic MDP. The policy's value can be written as an expectation over trajectories:

$$V(\theta) = \sum_\tau P(\tau; \theta) R(\tau)$$

$\tau$ is a state-action trajectory and $R(\tau)$ is its total reward. Policy gradient methods do gradient ascent on $V(\theta)$, $\Delta\theta = \alpha \nabla_\theta V(\theta)$, and look for a **local** maximum.

Page 36 holds the key step of the whole section, the likelihood ratio:

$$\nabla_\theta V(\theta) = \sum_\tau \nabla_\theta P(\tau;\theta) R(\tau) = \sum_\tau P(\tau;\theta) \frac{\nabla_\theta P(\tau;\theta)}{P(\tau;\theta)} R(\tau) = \sum_\tau P(\tau;\theta) R(\tau) \nabla_\theta \log P(\tau;\theta)$$

Multiply by $P/P$ and the gradient becomes an expectation under $P$. You can estimate it by averaging over $m$ trajectories you actually ran.

### The dynamics model disappears

Pages 39–40 expand $\log P(\tau;\theta)$. A trajectory's probability is the product of the initial state distribution $\mu(s_0)$, the policy $\pi_\theta(a_t \mid s_t)$ at every step, and the dynamics $P(s_{t+1} \mid s_t, a_t)$ at every step. The log turns the product into a sum. Differentiate with respect to $\theta$ and only the policy terms depend on $\theta$:

$$\nabla_\theta \log P(\tau;\theta) = \sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t)$$

The slides label this term **no dynamics model required**. That is why policy gradients can be model-free.

### Two common score functions

Page 41 defines a score function as the derivative of the log of a parameterized probability. Pages 42–45 work out two policies:

- **Softmax policy** (discrete actions): $\pi_\theta(s,a) \propto e^{\phi(s,a)^\top\theta}$. The score function is $\phi(s,a) - \mathbb{E}_{\pi_\theta}[\phi(s,\cdot)]$: this action's features minus the policy's average features.
- **Gaussian policy** (continuous actions): mean $\mu(s) = \phi(s)^\top\theta$, with variance $\sigma^2$ fixed or learned. The score function is $(a - \mu(s))\phi(s)/\sigma^2$.

Page 45 adds that deep networks, or any model whose gradient you can compute, can also represent the policy.

### Intuition, and a common misconception

Page 49 gives the intuition. Read the estimator as $f(x)\nabla_\theta \log p(x \mid \theta)$, where $f(x)$ measures how good sample $x$ is. Stepping in that direction **pushes up the log probability of each sample in proportion to how good it is**. This works even when $f$ is discontinuous or unknown, or the sample space is a discrete set.

The poll on pages 47–48 asks whether the score function policy gradient (a) requires a differentiable reward, (b) works only for MDPs, or (c) is mainly useful for infinite-horizon tasks. The answer is **none of the above**.

The **policy gradient theorem** on page 50 extends the likelihood ratio result to three objectives (episodic, average reward per step, and average value):

$$\nabla_\theta J(\theta) = \mathbb{E}_{\pi_\theta}\big[\nabla_\theta \log \pi_\theta(s,a)\, Q^{\pi_\theta}(s,a)\big]$$

The slides recommend the derivation in Section 13.2 of Sutton & Barto (episodic, discrete states).

## Unbiased but noisy: three fixes

Page 52 names the raw estimator's properties: **unbiased, but very noisy**. The next three fixes all reduce variance.

### Fix 1: temporal structure → REINFORCE

Pages 53–56 observe that the reward $r_{t'}$ at time $t'$ can only be affected by actions taken before $t'$. Redo the derivation for a single reward term, sum over all $t'$, and swap the order of summation:

$$\nabla_\theta V(\theta) = \mathbb{E}\Big[\sum_{t=0}^{T-1} \nabla_\theta \log \pi_\theta(a_t \mid s_t) \sum_{t'=t}^{T-1} r_{t'}\Big]$$

Each action is now paired only with the return that **follows** it, $G_t$, instead of the whole trajectory's reward. Page 57 turns this into **REINFORCE**:

```text
initialize θ
for each episode {s1, a1, r2, ..., s_{T-1}, a_{T-1}, r_T} ~ π_θ:
    for t = 1 .. T-1:
        θ ← θ + α ∇θ log π_θ(s_t, a_t) G_t
return θ
```

### Fix 2: a baseline

Page 61 (repeated as page 11 of L6) subtracts a state-only quantity $b(s_t)$ from each return:

$$\nabla_\theta \mathbb{E}_\tau[R] = \mathbb{E}_\tau\Big[\sum_{t=0}^{T-1} \nabla_\theta \log \pi(a_t \mid s_t;\theta)\big(\textstyle\sum_{t'=t}^{T-1} r_{t'} - b(s_t)\big)\Big]$$

The slides make two claims. **No choice of $b$ biases the estimator.** A near-optimal choice is the expected return, $b(s_t) \approx \mathbb{E}[r_t + \dots + r_{T-1}]$. The intuition: raise an action's log probability in proportion to how much better this return was than expected.

<details>
<summary>L6 page 13: why a baseline adds no bias</summary>

Split the expectation into "up to $s_t$" and "after". Inside, $b(s_t)$ is a constant and comes out. What remains inside is $\mathbb{E}_{a_t}[\nabla_\theta \log \pi(a_t \mid s_t;\theta)]$. Run the likelihood ratio in reverse:

$$\sum_a \pi_\theta(a \mid s_t) \frac{\nabla_\theta \pi(a \mid s_t;\theta)}{\pi_\theta(a \mid s_t)} = \nabla_\theta \sum_a \pi(a \mid s_t;\theta) = \nabla_\theta 1 = 0$$

So the whole term is $b(s_t) \cdot 0 = 0$. Probabilities always sum to 1, so the derivative of that sum is 0.

</details>

<details>
<summary>L6 pages 14–15: why V(s) is a good baseline</summary>

Since $b$ does not change the expectation, minimizing variance only requires minimizing the second moment $\mathbb{E}[(\nabla_\theta \log \pi)^2 (G_t - b(s))^2]$. That is a weighted least squares problem. Setting the derivative to zero gives:

$$b(s) = \frac{\mathbb{E}\big[(\nabla_\theta \log \pi)^2 G_t\big]}{\mathbb{E}\big[(\nabla_\theta \log \pi)^2\big]} \approx \mathbb{E}_{a \sim \pi(\cdot \mid s)}[G_t(s)]$$

The optimal baseline is the expected return weighted by the squared score function. Approximately, that is the state value. This is why page 18 calls $V^\pi(s) = \mathbb{E}_{a \sim \pi}[Q^\pi(s,a)]$ a great baseline.

</details>

### "Vanilla" policy gradient

Page 16 of L6 combines the first two fixes:

1. Collect a batch of trajectories with the current policy.
2. At each step, compute the return $G_t^i$ and the advantage estimate $\hat{A}_t^i = G_t^i - b(s_t^i)$.
3. Refit the baseline by minimizing $\sum_i \sum_t |b(s_t^i) - G_t^i|^2$.
4. Update the policy with $\sum \nabla_\theta \log \pi(a_t \mid s_t, \theta)\hat{A}_t$, fed into SGD or Adam.

This is almost exactly the first half of A2 Question 2. A2 uses a neural network $b_\phi(s)$ as the baseline, fits it to returns with MSE, and also normalizes advantages to mean 0 and standard deviation 1. The handout explains that centering amounts to subtracting another constant baseline, and rescaling amounts to multiplying the learning rate by $1/\sigma$.

### Fix 3: replace Monte Carlo returns → actor-critic

L6 page 21: $G_t$ is an estimate from a single rollout, **unbiased but high variance**. As with TD vs MC in [Part 4](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation-en), bootstrapping and function approximation can trade a little bias for lower variance.

Page 22: whatever estimates V or Q is called the **critic**. **Actor-critic** methods keep explicit representations of both the policy and the value function and update both. The slides cite [A3C (Mnih et al., ICML 2016)](https://arxiv.org/abs/1602.01783) as a popular example.

Page 23 sets the baseline to an estimate of V, so the gradient can be written in terms of the advantage:

$$\nabla_\theta \mathbb{E}_\tau[R] \approx \mathbb{E}_\tau\Big[\sum_{t=0}^{T-1} \nabla_\theta \log \pi(a_t \mid s_t;\theta)\,\hat{A}^\pi(s_t, a_t)\Big], \quad A^\pi(s,a) = Q^\pi(s,a) - V^\pi(s)$$

## Poll: which statements are true?

The opening poll on pages 2–3 of L6 lists four statements about policy gradients. According to the slides, statements 1 and 3 are true:

1. **True**: $\nabla_\theta V(\theta) = \mathbb{E}_{\pi_\theta}[\nabla_\theta \log \pi_\theta(s,a) Q^{\pi_\theta}(s,a)]$
2. **False**: $\theta$ always increases in the direction of $\nabla_\theta \ln \pi$ (the direction also depends on the Q-values or returns)
3. **True**: on average, state-action pairs with higher estimated Q-values become more likely
4. **False**: convergence to the global optimum of the policy class is guaranteed (only a local optimum is)

**Something to do tonight**: without looking at this post, write out the likelihood ratio line and the "dynamics model disappears" step yourself. Wherever you get stuck is exactly what the next post keeps using. The importance sampling in [Part 8](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement-en) is the same "multiply by a ratio" trick.

## A question left for the next post

Vanilla PG throws away each batch after a single gradient step, and its step size is hard to choose. The Advanced Policy Gradients section in the second half of L6 starts from these two problems and leads to the performance difference lemma, KL, and PPO. That is the next post.

## Further reading

- [Reading CS224R: Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients-en) and [Actor-Critic](/posts/ai/2026-09-30-cs224r-actor-critic-en): how the same school's deep RL course covers it, with more robotics and implementation
- [Berkeley CS285: policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en)
- [CS229 notes, Chapter 21: policy gradient variants](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-21-policy-gradient-variants-en)

**Series navigation**: previous [Part 6: DQN](/posts/ai/2026-09-30-cs234-dqn-deep-q-learning-en) | next [Part 8: advanced policy gradients — performance bounds, KL, PPO, GAE](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement-en) | [series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS234: Reinforcement Learning (Winter 2026 course home page)](https://web.stanford.edu/class/cs234/)
- [CS234 modules page](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 5: Policy Gradient I slides (Winter 2026, post version)](https://web.stanford.edu/class/cs234/slides/lecture5post.pdf)
- [Lecture 6: Policy Gradient II slides (Winter 2026, post version)](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf)
- [Assignment 2 handout (Winter 2026)](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)
- [Sutton & Barto: Reinforcement Learning: An Introduction, 2nd ed. (Chapter 13, Policy Gradient Methods)](http://incompleteideas.net/book/the-book-2nd.html)
- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Lecture 5: Policy Search 1 (Spring 2024, YouTube)](https://www.youtube.com/watch?v=L6OVEmV3NcE)
- [Lecture 6: Policy Search 2 (Spring 2024, YouTube)](https://www.youtube.com/watch?v=8PwvNQ5WS-o)
- [Levine, Finn, Darrell, Abbeel 2015: End-to-End Training of Deep Visuomotor Policies](https://arxiv.org/abs/1504.00702)
- [Mnih et al. 2016: Asynchronous Methods for Deep Reinforcement Learning (A3C)](https://arxiv.org/abs/1602.01783)
