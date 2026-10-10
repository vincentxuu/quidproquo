---
title: "CS224R L4: Actor-Critic and Value Estimation — Learn to Judge Good and Bad, Then Do More of the Good"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, policy-gradient]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 5
tldr: "Policy gradient can only judge good and bad from the rewards it actually received, so it wastes data. Actor-critic trains a second network, a value function (the critic), to estimate how good a state is, and uses it to compute advantages that weight the policy's (the actor's) gradient. There are three ways to estimate value: supervise directly with a rollout's summed rewards (Monte Carlo), supervise with this step's reward plus your own estimate of the next state (bootstrapping), or use an n-step return in between. L4 ends by pushing actor-critic off-policy, first by taking several gradient steps on one batch (where PPO starts) and then by reusing all past data from a replay buffer (where SAC starts)."
description: "A guide to Lecture 4 of Stanford CS224R Deep Reinforcement Learning (Spring 2026), Actor-Critic Methods: definitions of V, Q, and advantage; why policy gradient wastes data; the bias-variance trade-off between Monte Carlo, bootstrapped, and n-step value estimates; discount factors; the full actor-critic algorithm; and two off-policy versions, multiple gradient steps with importance weights and a replay buffer with a Q-function."
draft: false
glossary:
  - term: "advantage function"
    aliases: ["A^π(s,a)"]
    definition: "How much better it is to take action a in state s than to act according to the current policy on average, equal to Q^π(s,a) − V^π(s)."
    context: "CS224R L4 uses it in place of the policy gradient's reward to go minus a baseline."
  - term: "bootstrapping"
    aliases: ["temporal difference learning"]
    definition: "Training a value function on labels made of this step's reward plus your current value estimate of the next state, instead of waiting for the trajectory to finish and summing the rewards."
    context: "The L4 slides call it a form of temporal difference (TD) learning."
  - term: "replay buffer"
    definition: "A store of every past transition (s, a, s′, r) from which training samples random minibatches."
    context: "L4's second off-policy actor-critic relies on it to reuse old data."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-actor-critic)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Source term**: This post is based on the Lecture 4 slides for Spring 2026 [CS224R](https://cs224r.stanford.edu/), [04_cs224r_actor_critic_2026.pdf](https://cs224r.stanford.edu/slides/04_cs224r_actor_critic_2026.pdf) (37 pages, taught 2026-04-10). The 2026 recordings are on Canvas only. The companion video is the [Spring 2025 L4 recording](https://www.youtube.com/watch?v=oejFZShW9hU), used as a supplement. The 2025 and 2026 decks share the same lecture outline. The 2026 deck adds a few lines about policy gradient's properties to the opening recap, and the rest differs only in dates. This post does not quote the video.

This is part 5 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series and picks up right after [L3: Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients-en). Slide 5 lists two learning goals:

- How to estimate how good a state and action is for a policy
- How to use those estimates to build a more efficient RL algorithm

This lecture has more formulas than L3, but one idea runs through it: **instead of waiting for rewards to tell you what is good, train a network to predict it.**

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=oejFZShW9hU
title: Spring 2025 Lecture 4: Actor-Critic Methods (YouTube, Stanford Online)
```

Original videos: [Spring 2025 Lecture 4: Actor-Critic Methods (YouTube, Stanford Online)](https://www.youtube.com/watch?v=oejFZShW9hU)

Course and recording entries:

- [CS224R Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [Official course / lecture source](https://cs224r.stanford.edu/)

## The setting: policy gradient wastes data

The recap on slide 3 adds two properties of policy gradient. You **need to collect an entire trajectory before updating**. And it **doesn't rely on the Markov property**, so it can work from observations rather than full states.

Slide 8 points out the problem. Go back to jacket folding, where the reward is sparse:

- a trajectory that folds only the sleeves
- a trajectory that flattens the jacket but doesn't fold it

Both came close to success, but with sparse rewards they score 0, and policy gradient **makes no use of them at all**. The humanoid's "one small step forward then falls backwards" trajectory also pushes down the likelihood of that small step.

The slide concludes that policy gradient doesn't use data efficiently, and then asks: **can we learn what is good and what is bad?**

## Intuition: replace the reward to go with a better estimate

The L3 gradient weights each action by the rewards actually collected from t onward. Slide 9 notes that this is **a single sample**, which is very noisy. If you had the **expected** future reward instead, things would be much better.

Slide 10 goes one step further. With a baseline, the weight is really the **advantage**: how much better this action is than average. **Better advantage estimates lead to less noisy gradients.**

So the online RL loop (slides 11–12) gains a step:

1. Run the policy to collect a batch of data
2. **Fit a model to estimate expected return** (V, Q, or A)
3. Improve the policy

The policy that makes decisions is the actor, and the value function that judges them is the critic.

## Mechanism 1: three value objects

Slide 6 defines three functions, all for a fixed policy π:

| Name | Meaning |
|---|---|
| $V^\pi(s)$ value function | Expected future reward starting at s and following π |
| $Q^\pi(s,a)$ Q-function | Expected future reward starting at s, taking a, then following π |
| $A^\pi(s,a)$ advantage | How much better taking a in s is than following π: $Q^\pi(s,a) - V^\pi(s)$ |

They are related by $V^\pi(s) = \mathbb{E}_{a\sim\pi(\cdot\mid s)}[Q^\pi(s,a)]$.

Slide 7 gives an exercise. The reward is 1 if I can play a drum piece within a month and 0 otherwise. The three actions are drawn as lounging in a deck chair (a1), sitting at a computer (a2), and drumming (a3), and the current policy always picks a1. Under this policy, what are V, Q, and A? It is worth stopping to work this out, especially Q for drumming, because Q means "take this action once, **then follow the current policy**."

### Which one to fit?

The derivation on slide 14 answers: fitting $V^\pi$ is enough.

Q splits into this step's reward plus the V of the next state. Approximate the expectation with the next state you actually sampled, and the advantage can be computed from a single V network:

$$A^\pi(s_t, a_t) \approx r(s_t, a_t) + V^\pi(s_{t+1}) - V^\pi(s_t)$$

V takes only a state, not an action, so it is easier to learn than Q.

## Mechanism 2: how to train V (policy evaluation)

Estimating the value of a given policy is called policy evaluation. L4 gives three versions.

### Version 1: Monte Carlo, supervise with rollouts

Slides 15–17: ideally, to know $V^\pi(s)$ you would run π from s many times and average. In reality **you can't reset the world to the same state**.

So you settle for less. Every trajectory leaves a single-sample estimate at every timestep, the rewards actually collected from there on. Gather all of them into a dataset and fit a V network with **supervised learning**. The network's generalization averages across similar states for you.

### Version 2: bootstrapping, use your own estimate as the label

Slide 18: the label becomes this step's reward plus the current V network's estimate of the next state. Because the label contains V itself, **it has to be recomputed after every gradient update**. The slide notes that this is also a form of temporal difference (TD) learning.

### How they differ: an example

Slide 19 draws two trajectories. One (black) passes a pink state, then a blue state, and ends at −1. The other (gray) reaches the same blue state by a different path and ends at +1. Rewards along the way are 0. The slide asks students what each method estimates for V.

The slide doesn't give the answer. Reading the figure: the blue state is visited by both trajectories, so both methods estimate it near 0. The pink state is visited only by the black trajectory. Monte Carlo sees only that one −1, while bootstrapping inherits the blue state's estimate, which is near 0. Bootstrapping stitches information across trajectories and has lower variance, but it depends on V's own estimate, so a wrong estimate brings in bias.

The slide then asks: **is there middle ground that balances bias and variance?**

### Version 3: n-step returns, the compromise

Slide 20: sum the actual rewards for the next n steps, then add the V estimate of the state after step n.

- Less variance than Monte Carlo
- Lower bias than one-step bootstrapping

The slide's conclusion: **n > 1 and n < T often works best in practice.**

<details>
<summary>The three labels as formulas (slides 19–20)</summary>

- Monte Carlo: $y_{i,t} = \sum_{t'=t}^{T} r(s_{i,t'}, a_{i,t'})$
- Bootstrapped: $y_{i,t} = r(s_{i,t}, a_{i,t}) + \hat{V}^\pi_\phi(s_{i,t+1})$
- n-step return: $y_{i,t} = \sum_{t'=t}^{t+n-1} r(s_{i,t'}, a_{i,t'}) + \hat{V}^\pi_\phi(s_{i,t+n})$

All three train with squared error: $\mathcal{L}(\phi) = \frac{1}{2}\sum_i \|\hat{V}^\pi_\phi(s_i) - y_i\|^2$.

</details>

### Aside: discount factors

Slide 21: if the episode length T is infinite, V can grow infinitely large in many cases. A simple trick is that rewards sooner are better than rewards later. Multiply the V in the bootstrapped label by $\gamma \in [0, 1]$. The slide notes that 0.99 works well.

The slide also points out that γ **changes the MDP**. It is as if every step has a 1 − γ chance of falling into a terminal state. This slide is marked as adapted from Sergey Levine.

## Mechanism 3: the full actor-critic algorithm

Slide 22 puts the pieces together:

1. Sample a batch of trajectories from $\pi_\theta$
2. Fit $\hat{V}_\phi$ to the summed rewards in the data
3. For every (t, i), compute $\hat{A}(s_{t,i}, a_{t,i}) = r(s_{t,i}, a_{t,i}) + \gamma\hat{V}_\phi(s_{t+1,i}) - \hat{V}_\phi(s_{t,i})$
4. $\nabla_\theta J(\theta) \approx \sum_{t,i}\nabla_\theta\log\pi_\theta(a_{t,i}\mid s_{t,i})\,\hat{A}(s_{t,i}, a_{t,i})$
5. $\theta \leftarrow \theta + \alpha\nabla_\theta J(\theta)$

Slide 23 contrasts the two in one line each:

- **Policy gradient**: observe what is good and bad, then do more of the good stuff.
- **Actor-critic**: **learn to estimate** what is good and bad, then do more of the good stuff.

## Mechanism 4: going off-policy

The algorithm above is still on-policy. The last part of L4 gives two versions, each more off-policy than the last.

### Version 1: several gradient steps on one batch

Slides 25–27: apply L3's importance weights in step 4 and you can take several steps on one batch.

But the advantages were computed with the **old** policy and get more outdated with every step, while the policy keeps raising the probability of high-advantage actions. Slide 27 asks what goes wrong if you take too many steps, and offers two ideas:

- **Idea 1: put a KL constraint on the policy.** The slide says we will see this again in LLM preference optimization.
- **Idea 2: bound the importance weights.** This doesn't directly constrain the policy, but it removes the incentive to keep pushing in one direction. The slide calls this **the key idea behind PPO**.

Besides [Sutton et al. 1999](https://proceedings.neurips.cc/paper_files/paper/1999/file/464d828b85b0bed98e80ade0a5c43b0f-Paper.pdf), the schedule lists [PPO (Schulman et al. 2017)](https://arxiv.org/pdf/1707.06347) as reading for L4. PPO's details are left to the [next lecture](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en).

### Version 2: a replay buffer that reuses all past data

Slide 28 asks whether we can be even more off-policy and use all past trial-and-error data. Two things make it work: keep all past data in a **replay buffer**, and adjust the equations to remove their on-policy assumptions.

Slide 30 first turns actor-critic into "sample a minibatch from the buffer" as is, then declares that **the algorithm is broken**. Two things are wrong:

1. **The value target is wrong.** The buffer's transitions came from old policies, so computing V at their next states doesn't estimate the current policy's value.
2. **The policy update is wrong.** The buffer's actions are not the ones the current policy would take.

Slides 31–33 fix them one at a time:

- **Fixing the value function**: learn **Q** instead of V. Q's target is r plus the Q of the next state and next action, where the next action is **sampled fresh from the current policy**, not taken from the buffer.
- **Fixing the policy update**: the same trick. For each state from the buffer, sample a fresh action from the current policy to compute the gradient. In practice you use Q in place of the advantage. The slide says this has higher variance but is convenient, and leaves a question: why is higher variance OK here?
- **What's left**: the buffer's states don't follow the current policy's state distribution. The slide's answer is that there's nothing to be done, so accept it. The intuition: we want the optimal policy on the policy's own state distribution, and we get the optimal policy on a **broader** one.

<details>
<summary>The fixed off-policy actor-critic (slide 33)</summary>

1. Take action $a\sim\pi_\theta(a\mid s)$, get $(s, a, s', r)$, store it in $\mathcal{R}$
2. Sample a batch $\{s_i, a_i, r_i, s'_i\}$ from $\mathcal{R}$
3. Update $\hat{Q}^\pi_\phi$ with targets $y_i = r_i + \gamma\hat{Q}^\pi_\phi(s'_i, a'_i)$, where $a'_i\sim\pi_\theta(a'\mid s'_i)$
4. $\nabla_\theta J(\theta) \approx \frac{1}{N}\sum_i\nabla_\theta\log\pi_\theta(a^\pi_i\mid s_i)\,\hat{Q}^\pi(s_i, a^\pi_i)$, where $a^\pi_i\sim\pi_\theta(a\mid s_i)$
5. $\theta \leftarrow \theta + \alpha\nabla_\theta J(\theta)$

Slides 29–34 are marked as adapted from Sergey Levine.

</details>

Slide 34 adds implementation details. There are fancier ways to fit Q, covered in the next two lectures, and a Gaussian policy can use the reparameterization trick to estimate the gradient better. The practical example it cites is [Soft Actor-Critic (Haarnoja et al. 2018)](https://arxiv.org/abs/1801.01290).

## Connecting back to the course: two kinds of off-policy

Slide 35 compares the two ends:

- **More off-policy (with a replay buffer, e.g. SAC)**: can be far more data-efficient.
- **Less off-policy (no replay buffer, e.g. PPO)**: the replay-buffer methods are generally harder to tune and less stable than this end.

That comparison maps out the next few lectures. L5 covers PPO and SAC, and L6 covers Q-learning. HW2 then has you write PPO and then an off-policy algorithm on the same sparse-reward task, a Sawyer robot arm hammering a nail. Slide 37 previews next week: Q-learning, the last big online RL method, plus practical implementation of online RL algorithms.

**Something to do tonight**: draw slide 19's figure on paper, fill in the four blanks yourself, and check them against the reading above. Then add a third trajectory so that two trajectories pass through the pink state, and see how the Monte Carlo and bootstrapped estimates change. When you meet Q-learning's bootstrapped targets in L6, you'll know what they save and what risk they take on.

## Further reading

- [Sutton et al. 1999: Policy Gradient Methods for Reinforcement Learning with Function Approximation](https://proceedings.neurips.cc/paper_files/paper/1999/file/464d828b85b0bed98e80ade0a5c43b0f-Paper.pdf): the assigned reading on the schedule, which shows that the policy gradient can be estimated with an approximate action-value or advantage function
- [Berkeley CS285: policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en): another course's take on actor-critic
- [CME295: Preference Tuning](/posts/ai/2026-09-29-cme295-preference-tuning-en): what the KL constraint looks like in LLM preference optimization

**Series navigation**: Previous [L3: Policy Gradients](/posts/ai/2026-09-30-cs224r-policy-gradients-en) | Next [L5: Off-Policy Actor-Critic (PPO and SAC)](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 homepage and schedule)](https://cs224r.stanford.edu/)
- [L4 Actor-Critic Methods slides (2026)](https://cs224r.stanford.edu/slides/04_cs224r_actor_critic_2026.pdf)
- [L4 Actor-Critic Methods slides (Spring 2025 archive)](https://cs224r.stanford.edu/spring_2025/slides/04_cs224r_actor_critic_2025.pdf)
- [Spring 2025 Lecture 4: Actor-Critic Methods (YouTube, Stanford Online)](https://www.youtube.com/watch?v=oejFZShW9hU)
- [CS224R Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [Sutton, McAllester, Singh, Mansour 1999 (NeurIPS)](https://proceedings.neurips.cc/paper_files/paper/1999/file/464d828b85b0bed98e80ade0a5c43b0f-Paper.pdf)
- [Schulman et al. 2017: Proximal Policy Optimization Algorithms](https://arxiv.org/pdf/1707.06347)
- [Haarnoja, Zhou, Abbeel, Levine 2018: Soft Actor-Critic](https://arxiv.org/abs/1801.01290)
