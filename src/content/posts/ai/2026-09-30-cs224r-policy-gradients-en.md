---
title: "CS224R L3: Policy Gradients — Differentiating the Policy Without Knowing How the World Works"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, ai-course, stanford, reinforcement-learning, policy-gradient]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 4
tldr: "Policy gradient is the first online RL algorithm in CS224R. Its gradient looks almost exactly like the imitation learning gradient, except that each trajectory is weighted by its reward. Actions from good outcomes become more likely, and actions from bad outcomes become less likely. The raw version is very noisy, so L3 cuts the variance in two ways: count only future rewards (causality) and subtract the average reward (a baseline). It is also on-policy, so every gradient step needs fresh data. Importance sampling plus a KL constraint lets you take several steps on one batch."
description: "A guide to Lecture 3 of Stanford CS224R Deep Reinforcement Learning (Spring 2026), Policy Gradients: deriving the policy gradient and REINFORCE from the RL objective, how it relates to the imitation learning gradient, why it is noisy (the humanoid and jacket-folding examples), how causality and baselines reduce variance, implementing it with a surrogate objective, and how importance sampling and a KL constraint make it partly off-policy."
draft: false
glossary:
  - term: "REINFORCE"
    aliases: ["vanilla policy gradient"]
    definition: "The most basic policy gradient algorithm: sample a batch of trajectories from the current policy, weight the gradient of each action's log probability by its trajectory's total reward, take one step, and sample again."
    context: "The \"Full algorithm\" on slide 11 of CS224R L3."
  - term: "reward to go"
    definition: "The sum of rewards from time t to the end of the trajectory. Using it instead of the whole trajectory's reward exploits the fact that an action now cannot affect past rewards, which lowers gradient variance."
    context: "L3 introduces it in the causality section, and L4 estimates it with a value function."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-policy-gradients)

> **Source term**: This post is based on the Lecture 3 slides for Spring 2026 [CS224R](https://cs224r.stanford.edu/), [03_cs224r_policy_gradients_2026.pdf](https://cs224r.stanford.edu/slides/03_cs224r_policy_gradients_2026.pdf) (29 pages, taught 2026-04-08). The 2026 recordings are on Canvas only and not visible to outsiders. The companion video is the [Spring 2025 L3 recording](https://www.youtube.com/watch?v=KCAOXd4IO9o), used as a supplement. I compared the 2025 and 2026 slides. The lecture outline is the same. The 2026 deck adds a "sneak peek of the gradient" on slide 8, and the rest differs only in dates and small edits. This post does not quote the video.

This is part 4 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. The previous part was [HW1](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger-en), and everything up to there was still supervised learning: you have expert demonstrations and you copy them. From this lecture on, the agent learns from its own attempts.

Slide 5 lists just two learning goals: understand the key intuition behind policy gradients, and know how to implement them and when to use them. The same slide notes that this is part of the basis for the default project.

The math load here is heavier than before. The main text keeps to intuition and conclusions, and the derivations sit in collapsible sections.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=KCAOXd4IO9o
title: Spring 2025 Lecture 3: Policy Gradients (YouTube, Stanford Online)
```

Original videos: [Spring 2025 Lecture 3: Policy Gradients (YouTube, Stanford Online)](https://www.youtube.com/watch?v=KCAOXd4IO9o)

Course and recording entries:

- [CS224R Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [Official course / lecture source](https://cs224r.stanford.edu/)

## The setting: imitation learning's ceiling

Slide 4 first sums up imitation learning. It is simple and scalable and can learn good behavior. But it **cannot outperform the demonstrator** and cannot improve with practice.

The same slide defines two terms used throughout:

- **offline**: uses only an existing dataset, with no new data from the learned policy.
- **online**: uses new data from the learned policy.

Online RL (slide 6) is a loop. First initialize the policy, randomly, with imitation learning, or with heuristics. Then repeat: run the policy to collect a batch of data, and improve the policy using that batch.

The hard part is the second step. With no expert telling you the right action, only a reward score, how do you compute a gradient?

## Intuition: the imitation gradient, weighted by reward

Slides 8 and 12 are the two most important slides in the lecture. They put the policy gradient next to the imitation learning gradient:

- Imitation learning: for every action in the demonstrations, push its log probability up.
- Policy gradient: for every action in every trajectory you ran yourself, push its log probability up, **scaled by the total reward that trajectory earned**.

The slide puts it as "imitation gradient, but weighted by reward." The intuition:

- Increase the likelihood of actions you took in high-reward trajectories.
- Decrease the likelihood of actions you took in negative-reward trajectories.

In other words, do more of the good stuff and less of the bad stuff. Slide 20 calls this a formalization of trial-and-error learning.

The formula has **no environment transition probabilities** in it. You don't need a physics model of the bird or the robot. You only need to be able to run the policy and see the reward.

<details>
<summary>Derivation: from the RL objective to the policy gradient (slides 3, 9–11)</summary>

The RL objective is to maximize expected total reward:

$$J(\theta) = \mathbb{E}_{\tau\sim p_\theta(\tau)}\left[\sum_t r(s_t, a_t)\right],\quad p_\theta(\tau) = p(s_1)\prod_t \pi_\theta(a_t\mid s_t)\, p(s_{t+1}\mid s_t, a_t)$$

The key is an identity, the log-derivative trick: $p_\theta(\tau)\nabla_\theta \log p_\theta(\tau) = \nabla_\theta p_\theta(\tau)$. It lets you write the gradient as an expectation:

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau\sim p_\theta(\tau)}\left[\nabla_\theta \log p_\theta(\tau)\, r(\tau)\right]$$

Expand $\log p_\theta(\tau)$. The initial state distribution and the transition probabilities don't depend on $\theta$, so they vanish under the gradient, leaving only the policy term:

$$\nabla_\theta J(\theta) = \mathbb{E}_{\tau\sim p_\theta(\tau)}\left[\left(\sum_{t=1}^T \nabla_\theta \log\pi_\theta(a_t\mid s_t)\right)\left(\sum_{t=1}^T r(s_t, a_t)\right)\right]$$

Estimate it by averaging over N sampled trajectories and you get **REINFORCE** (vanilla policy gradient) from slide 11:

1. Sample $\{\tau^i\}$ from $\pi_\theta$
2. $\nabla_\theta J(\theta) \approx \sum_i \left(\sum_t \nabla_\theta\log\pi_\theta(a_t^i\mid s_t^i)\right)\left(\sum_t r(s_t^i, a_t^i)\right)$
3. $\theta \leftarrow \theta + \alpha\nabla_\theta J(\theta)$

Slides 7, 9, 10, and 11 are marked as adapted from Sergey Levine.

</details>

## Mechanism 1: why the raw version is so noisy

Slides 13 and 15 use a simulated humanoid learning to walk. The reward is forward velocity, which is negative when the robot moves backward.

**Example 1** (slide 13): the batch contains "falls backwards," "one small step forward then falls backwards," "falls forwards," "manages to stand still," and "one large step backwards then small step forwards." The slide's answer is that the gradient will encourage the policy to **fall forward**, not to step forward. The "small step forward then falls backwards" trajectory has a low total reward, so the small step gets pushed down along with it.

**Example 2** (slide 15): the trajectories are "falls forwards," "slowly stumbles forwards," "steadily walks forwards," and "runs forwards." All four rewards are positive, so the gradient pushes **all four** behaviors up, falling and stumbling included. The slide notes that policy gradient is noisy, high-variance, and sensitive to reward scale.

The two examples expose two different problems, and L3 gives one fix for each.

### Fix 1: causality, count only future rewards

Slide 14 observes that an action at time t cannot affect rewards before t. So each action should be weighted only by the sum of rewards from t onward (the reward to go), not by what happened before it.

Back to example 1: "one large step backwards then small step forwards" has a negative total reward. But the small step itself brings positive reward, so with reward-to-go weighting it no longer gets pushed down with the rest.

### Fix 2: a baseline, subtract the average

Slides 16–17 deal with example 2. Subtract a constant b from every trajectory's reward, most commonly the batch's average reward. Now below-average behavior gets a **negative** gradient. "Falls forwards" still earns a positive reward, but it is worse than average, so its probability goes down.

Slide 17 then asks whether this is allowed. It is. Subtracting a constant baseline doesn't change the expected gradient, so the estimate stays **unbiased**, and it can reduce variance. The slide concludes that the average reward is a pretty good baseline.

Slide 18 adds a jacket-folding example (1 for neatly folded, 0.5 for folded with some wrinkles, 0 for not folded) and asks students how the gradient behaves once a baseline is in place.

<details>
<summary>Why a baseline is unbiased (slide 17)</summary>

$$\mathbb{E}[\nabla_\theta\log p_\theta(\tau)\, b] = \int p_\theta(\tau)\nabla_\theta\log p_\theta(\tau)\, b\, d\tau = \int \nabla_\theta p_\theta(\tau)\, b\, d\tau = b\,\nabla_\theta\int p_\theta(\tau)\,d\tau = b\,\nabla_\theta 1 = 0$$

The gradient with causality and a baseline (slide 19):

$$\nabla_\theta J(\theta) \approx \frac{1}{N}\sum_{i=1}^N\sum_{t=1}^T \nabla_\theta\log\pi_\theta(a_{i,t}\mid s_{i,t})\left(\left(\sum_{t'=t}^T r(s_{i,t'}, a_{i,t'})\right) - b\right)$$

</details>

## Mechanism 2: how to implement it

Slide 19 raises a practical problem. Computing $\nabla_\theta\log\pi_\theta$ separately for every $(i, t)$ takes N×T backward passes, which is too slow.

The fix is a **surrogate objective**. Drop the gradient symbol from the formula above and you get a log likelihood weighted by reward to go minus the baseline, which autodiff can handle in one pass. The slide calls this weighted maximum likelihood. For a discrete-action policy it is a weighted cross-entropy, and for a Gaussian policy it is a weighted squared error.

So in code, it is almost the same as the imitation learning loss, with one extra weight. That is why slide 12 puts the two side by side.

Slide 20 sums up: the log gradient trick, weighting by future rewards, and subtracting a baseline. But **even with these tricks, the gradient is noisy**.

## Mechanism 3: the cost of on-policy, and an off-policy version

Slide 21 points out another problem. The gradient formula assumes samples come from the **current** policy $\pi_\theta$. As soon as step 3 updates θ, the data in hand no longer comes from the new policy, so **you need to recollect data for every gradient step**.

Here the slide defines an attribute of online RL algorithms:

- **on-policy**: the update uses only data from the current policy.
- **off-policy**: the update can reuse data from other, past policies.

Vanilla policy gradient is on-policy.

### Importance sampling

To update a new policy $\pi_{\theta'}$ with samples from an old policy $\pi_\theta$, use importance sampling (slides 22–24): reweight each sample by a probability ratio. Slide 22 warns that the proposal distribution must have non-zero probability wherever the target distribution's probability is high.

The catch is that a whole-trajectory ratio is a product of T ratios, which can become very small or very large as T grows. Weighting each timestep separately is more stable but needs a ratio of state distributions, which is hard to measure. The slide says this is often approximated as 1. That gives the "common final form" on slide 24, where each term is multiplied only by that step's action probability ratio $\pi_{\theta'}(a\mid s)/\pi_\theta(a\mid s)$.

With this, you can **take multiple gradient steps on the same batch** (slide 25).

### A KL constraint

But what if the policy changes a lot before you sample new data? Slides 25–26 answer: the data no longer reflects the states the new policy will visit, and the gradient estimate gets worse.

The fix is to keep each update from straying too far from the old policy. One common choice on the slide:

$$\mathbb{E}_{s\sim\pi_\theta}\left[D_{KL}\left(\pi_{\theta'}(\cdot\mid s)\,\|\,\pi_\theta(\cdot\mid s)\right)\right] \le \delta$$

Slide 27 of L4 brings this KL constraint back and says it will show up again in LLM preference optimization.

## Connecting back to the course

The review on slide 27 comes down to four points:

- Online RL via policy gradients: on-policy, differentiating the RL objective directly.
- Baselines and causality reduce gradient variance.
- An off-policy version: importance sampling plus a KL constraint, so one batch supports multiple gradient steps.
- Intuition: do more high-reward stuff and less low-reward stuff. The gradient is still very noisy and **works best with large batch sizes and dense rewards**.

That last point is your cue for when to use it. If rewards are sparse, or you can only collect a little data at a time, policy gradient will struggle. Slide 29 previews the next lecture: actor-critic methods build closely on policy gradients and are the basis for popular algorithms like PPO.

**Something to do tonight**: open slides 12 and 19 side by side. Find the BC loss you wrote in HW1 and ask yourself: to turn it into the policy gradient surrogate objective, what one quantity do you need to add, and where does it come from?

## Further reading

- [Williams 1992: Simple statistical gradient-following algorithms for connectionist reinforcement learning](https://link.springer.com/article/10.1007/BF00992696): the assigned reading on the schedule, the paper that introduced the REINFORCE family of algorithms
- [Berkeley CS285: policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en): the same derivation in another course
- [CME295: RL with LLMs](/posts/ai/2026-09-29-cme295-rl-with-llms-en) and [CS336: RLVR](/posts/ai/2026-08-22-cs336-rlvr-en): what policy gradient looks like for language models

**Series navigation**: Previous [HW1: BC, Flow Matching, and DAgger on Flappy Bird](/posts/ai/2026-09-30-cs224r-hw1-imitation-flow-matching-dagger-en) | Next [L4: Actor-Critic and Value Estimation](/posts/ai/2026-09-30-cs224r-actor-critic-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 homepage and schedule)](https://cs224r.stanford.edu/)
- [L3 Policy Gradients slides (2026)](https://cs224r.stanford.edu/slides/03_cs224r_policy_gradients_2026.pdf)
- [L3 Policy Gradients slides (Spring 2025 archive)](https://cs224r.stanford.edu/spring_2025/slides/03_cs224r_policy_gradients_2025.pdf)
- [Spring 2025 Lecture 3: Policy Gradients (YouTube, Stanford Online)](https://www.youtube.com/watch?v=KCAOXd4IO9o)
- [CS224R Spring 2025 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rPwxE0ONYRa_itZFdaKCylL)
- [Williams 1992, Machine Learning 8](https://link.springer.com/article/10.1007/BF00992696)
