---
title: "CS224R L6: Q-learning and How to Stabilize It"
date: 2026-09-30
category: ai
type: guide
tags: [cs224r, reinforcement-learning, q-learning, stanford, ai-course, course-guide]
lang: en
series:
  name: "Reading Stanford CS224R"
  order: 7
tldr: "Q-learning drops the actor from actor-critic: learn the optimal Q-function directly and act by taking the argmax. The price is that convergence is not guaranteed; even linear Q can diverge. Lecture 6 of CS224R pulls it back with three engineering tricks: a target network that holds the targets still, Double Q that separates choosing an action from valuing it to curb overestimation, and n-step returns that trade a little bias for speed."
description: "A guide to Lecture 6 of Stanford CS224R (Spring 2026) and the TA's extra-section handout: from policy iteration to the Bellman optimality equation, why Q-learning is off-policy, epsilon-greedy and Boltzmann exploration, target networks and DQN, overestimation and Double Q-learning, n-step returns, and the summary of four families of online RL methods (PG, PPO, SAC, DQN)."
draft: false
glossary:
  - term: "Bellman optimality equation"
    definition: "The recursion satisfied by the optimal Q-function: Q*(s, a) = r(s, a) + γ E_{s'}[max_a' Q*(s', a')]. Q-learning's training target tries to make the learned Q satisfy it."
    context: "CS224R L6 derives it from policy iteration as the reason to drop the actor."
  - term: "target network"
    definition: "A frozen copy of the parameters used to compute Bellman targets, synced from the main network periodically or by an exponential moving average, so targets do not shift on every step."
    context: "DQN's core stabilization trick; HW2's off-policy actor-critic uses it too."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs224r-q-learning)

**Video status: Related supplementary video included; the original lecture recording has not been verified.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 edition of [CS224R](https://cs224r.stanford.edu/).** It is part 7 of the [Reading Stanford CS224R](/posts/ai/2026-09-30-cs224r-course-overview-en) series. It follows [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en) and covers Lecture 6, "Q-learning," on April 17, 2026. It also covers the TA-led "Extra section on Q-learning" that afternoon at 4:45 pm in Thornton 102.

Official sources used:

- The 30-page slide deck [06_cs224r_qlearning_2026.pdf](https://cs224r.stanford.edu/slides/06_cs224r_qlearning_2026.pdf)
- TA Maximilian Du's 41-page handout [CS224R_Tutotial_Max.pdf](https://cs224r.stanford.edu/material/CS224R_Tutotial_Max.pdf) (the filename really is spelled "Tutotial")
- The assigned readings on the schedule: [Double Q-learning (van Hasselt et al. 2015)](https://arxiv.org/abs/1509.06461) and [Distributional RL (Bellemare et al. 2017)](https://arxiv.org/abs/1707.06887). The DQN paper, [Mnih et al. 2013](https://arxiv.org/abs/1312.5602), is on the previous lecture's reading list; this lecture is where it gets taught.

Access level: **A3**. Slides and handout download anonymously. The 2026 recordings are Canvas-only.

There are two companion videos, both **supplements**: [Spring 2025 Lecture 6: Q-Learning](https://www.youtube.com/watch?v=-7kv6jf0isQ) (about 62 minutes) and [Spring 2025 Tutorial Session: Review of Q-Learning](https://www.youtube.com/watch?v=07MQNMcxhZU) (about 51 minutes). Both are 2025 recordings and may differ from the 2026 slides and handout. This post follows the 2026 materials.

## Course video sources

This article uses Spring 2026 materials. The public Spring 2025 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=-7kv6jf0isQ
title: Spring 2025 Lecture 6: Q-Learning (YouTube, supplement)
```

```youtube
url: https://www.youtube.com/watch?v=07MQNMcxhZU
title: Spring 2025 Tutorial Session: Review of Q-Learning (YouTube, supplement)
```

Original videos: [Spring 2025 Lecture 6: Q-Learning (YouTube, supplement)](https://www.youtube.com/watch?v=-7kv6jf0isQ)、[Spring 2025 Tutorial Session: Review of Q-Learning (YouTube, supplement)](https://www.youtube.com/watch?v=07MQNMcxhZU)

Content check: verified against the video transcripts (2026-10-10): for both videos I sampled the beginning, middle and end and searched keywords (not a word-by-word comparison). -7kv6jf0isQ is Spring 2025 L6 Q-Learning (Chelsea Finn): it recaps value functions and policy gradient/actor-critic, then covers how Q-functions relate to policies, RL without an explicit policy, replay buffers, target networks and double DQN-style stabilization. 07MQNMcxhZU is the Spring 2025 Tutorial Session: Review of Q-Learning, given by TA Anikait Singh (he introduces himself in the transcript): an MDP review, tabular and fitted Q iteration, parametric Q-learning (the bias/variance trade-off of TD versus Monte Carlo) and practical details. Both lengths (about 62 and 51 minutes) match. This post follows the 2026 materials; the videos are supplementary only.

Course and recording entries:

- [Official course / lecture source](https://cs224r.stanford.edu/)

The Spring 2026 lecture recordings sit behind Stanford sign-in on Canvas/Panopto; the public YouTube playlist is Spring 2025. Checked: 2026-10-10.

## The setting: can we skip learning a policy?

The last post ended at SAC-style off-policy actor-critic: the critic learns Q and the actor climbs toward higher Q. Slide 6 asks the next question: **if Q already tells you the best action, do you need a separate policy at all?**

The lecture's three learning goals:

- How Q-functions relate to policies
- How to do RL without learning an explicit policy
- How to stabilize Q-learning in practice

The slide also notes that this is "the very first deep RL method!"

## Intuition: evaluate, then act greedily

Slide 7 is a thought exercise. Suppose you have an accurate Q^π for some policy π. Define a new policy that picks the action with the highest Q^π in every state. Is it better, worse, or the same? Is it optimal?

The slide uses a 2D navigation example for class discussion and does not print the answer. What follows is my own note, the standard policy-improvement result from textbooks. The argmax policy is at least as good as π, because in each state it picks the action with the highest expected return given that you follow π afterward. It need not be optimal, because Q^π assumes you keep following the old π afterward.

Repeat those two steps and you have **policy iteration** (slide 10):

1. **Policy evaluation:** fit the current policy's Q (you can take multiple gradient steps)
2. **Policy improvement:** the new policy takes the argmax of Q in every state

Slide 10 then asks whether improvement can be folded into the Q update itself. Slide 11's answer is to change the target to y = r + γ max_a' Q(s', a'). That directly computes Q for the new policy.

## Mechanism 1: Bellman optimality and Q-learning

### Why the max is right

Slide 12 separates two terms:

- **Bellman equation:** holds for any policy π: Q^π(s, a) = r + γ E[Q^π(s', ā')], with ā' drawn from π
- **Bellman optimality equation:** if π* is optimal, the action it takes in s' is the one with the highest Q*, so Q*(s, a) = r + γ E[max_a' Q*(s', a')]

Optimizing the Q-learning target is an attempt to make the second equation hold.

The TA handout (slide 12) makes the same point by contradiction. If π* were not the argmax of Q*, its action would not have the highest return, so it would not be optimal. The handout also insists: **always put a superscript on your Q** (Q^π or Q*), because Q estimates the return of following a specific policy.

<details>
<summary>How the TA handout derives the Bellman equation (handout slides 7–10)</summary>

The handout starts from the definition of Q:

```
Q(s_t, a_t) := E_τ[ Σ_{t'=t}^{T} γ^{t'−t} r(s_{t'}, a_{t'}) ]
```

Peel off the first step's reward, and the remaining sum is the next step's Q:

```
Q(s_t, a_t) = r(s_t, a_t) + γ E_{s_{t+1}, a_{t+1}}[ Q(s_{t+1}, a_{t+1}) ]
```

The expectation has two layers: s_{t+1} ~ p(·|s_t, a_t) is how the environment responds, and a_{t+1} ~ π(·|s_{t+1}) is how we act. The handout adds: "This is very important!! Make sure you understand this :)"

Handout slide 14 calls the next step "Fake it till you make it." You do not have a correct Q, so you assume the right-hand Q is correct and use the right side to compute the left side. The equality becomes an assignment (←). That is fitted Q iteration.

</details>

### Q-learning is off-policy

Slide 13 stresses that Q-learning is off-policy. The target r + γ max Q(s', a') needs only one transition (s, a, r, s'), no matter which policy collected it.

Does it converge? The slide answers in two parts:

- **Tabular** (one Q entry per state and action): yes
- **In general:** no. You can construct scenarios where it diverges, even with linear Q. But it can be made to work well in practice.

The handout's intuition (slide 16): the right-hand side contains the true reward, so each update adds a bit of "true" information to Q. In the tabular case you can prove each update gets exponentially closer to the true solution. With a parametric network there is no guarantee. For the proof, the handout points to [CS234](https://web.stanford.edu/class/cs234/).

### How to collect data

Slide 14: because Q-learning is off-policy, the data can come from any exploration policy, as long as it **covers many actions**. Two common choices:

- **Epsilon-greedy:** with probability ε, take a uniformly random action; otherwise take the argmax. You often start with a larger ε and decrease it over training.
- **Boltzmann exploration:** take actions with probability proportional to their Q-values.

Slide 15 puts the full algorithm in two loops. The outer loop collects data with some policy (for example, epsilon-greedy) into a replay buffer. The inner loop samples a batch and takes K gradient steps on Q. The slide notes K=1 is common, though larger K is more efficient. The final policy is the argmax of Q.

**Try this:** implement epsilon-greedy Q-learning once on a tabular environment, such as the gridworld in [HW2](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer-en). Watch how the learned path changes as ε shrinks. Tabular Q-learning is guaranteed to converge, so any failure is a bug in your code. That makes it a good place to calibrate your intuition.

## Mechanism 2: three tricks for stable Q-learning

### Target networks: hold the target still

Slide 17 names the problem. The Q_φ inside the target r + γ max Q_φ(s', a') is the network you are updating. Every step moves the target too. It is a **moving target**, and it can make optimization unstable.

Slide 18's simple idea: **freeze the parameters used for the target and update them periodically**. Add an outer loop that saves φ' ← φ, and compute every target in the inner loop with Q_φ'. In the slide's words, the inner loop is now doing supervised learning, because the labels do not change inside it. This is **DQN** ("deep Q network").

The TA handout (slide 30) gives two ways to sync:

- **Hard update:** copy w' ← w every N steps
- **Soft update (Polyak):** w' ← τ·w + (1−τ)·w' every step

The handout also explains that the target term should use a stop-gradient (semi-gradient). Otherwise the model sits on both sides of the equation, which invites a "tail chasing" problem. Slide 31 adds two tools for TD gradients: **gradient clipping** to block disruptive noise, and **Huber loss** to reduce the effect of outliers.

### Double Q: do not pick and value with the same network

Slides 19–20 ask whether the Q-values are accurate. On one hand, DQN's predicted Q on Breakout and Seaquest rises along with the actual return, so the direction is right. On the other, a figure from van Hasselt's paper shows DQN's Q estimates well above their true values on Alien, Space Invaders, Time Pilot, and Zaxxon. Double DQN's estimates sit much closer to the truth.

Slide 21 explains why. max_a' Q_φ'(s', a') does two jobs: it uses Q_φ' to **select** the best action, then uses Q_φ' to **value** that action. Q_φ' is noisy, and taking the max of noise biases the result upward.

The TA handout (slide 32) puts it bluntly: even if the error is zero-centered, its maximum is not. **Maximizing unbiased noise gives a biased result.**

Slide 22's fix: use two networks, one to choose the action and another to value it. If their noise is uncorrelated, the problem goes away. Slide 23 shows you do not need to train an extra network:

- Standard Q-learning: y = r + γ Q_φ'(s', argmax_a' Q_φ'(s', a'))
- Double Q-learning: y = r + γ Q_φ'(s', argmax_a' **Q_φ**(s', a'))

That is, **use the current network to choose the action and the target network to value it**.

The handout (slide 34) takes one more step: if two Q-functions reduce overestimation, you can extend to a whole critic ensemble. That is exactly what HW2 Problem 3 does.

### N-step returns: a little bias for speed

Slides 24–25 return to an old problem from L4. Monte Carlo targets have high variance. One-step bootstrapping has high bias. N-step returns sit in between, and Q-learning can use them too:

- **Pros:** far less biased targets when Q-values are inaccurate, and typically faster learning, especially early on.
- **Cons:** only strictly correct when learning on-policy, because the intermediate rewards came from the policy that collected the data. With N=1 this is not an issue.

The slide lists three responses. **The most common is to ignore the problem and still use N > 1.** The other two: choose N dynamically so you only use data consistent with the current policy (workable when data is mostly on-policy and the action space is small), or use importance sampling.

The handout (slides 25–27) frames the same idea as a bias-variance tradeoff. A Bellman backup may be wrong (bias). A Monte Carlo estimate swings with each trajectory (variance). The k in an n-step return is your tuning knob between them.

<details>
<summary>Handout slide 29: Q-networks for discrete vs. continuous actions</summary>

- Continuous actions: the network takes state and action and outputs a scalar Q^π(s, a)
- Discrete actions: the network takes only the state and outputs a vector whose i-th entry is Q^π(s, a_i)

The discrete version gives every action's Q in one forward pass, so the argmax is cheap. That is why slide 28 recommends DQN for discrete or low-dimensional continuous actions.

</details>

## Tying it together: four families of online RL

Slide 26 shows two applications: Q-learning outperforming people on most Atari games (Mnih et al. 2015), and a robot grasping system trained with Q-learning (Kalashnikov et al. 2018).

Slide 27 summarizes every online RL method so far:

| | Vanilla PG | PPO-like | Off-policy AC (e.g. SAC) | Q-learning |
|---|---|---|---|---|
| Data used | On-policy | Technically off-policy, often called on-policy | Off-policy, replay buffer | Off-policy, replay buffer |
| How it becomes off-policy | n/a | Importance weights | Fit Q with TD, sample a from π | Fit Q* with TD |
| Value function fit | None | V^π | Q^π | Q* |
| Estimating "goodness" | Σr − b | V by MC, TD, or n-step; A by r+γV(s')−V(s) or GAE | TD or n-step | TD or n-step |
| Policy update | ∇log π × (Σr − b) | ∇log π × Â | ∇log π × Q̂ | argmax Q̂ |

Slide 28 is labeled "Chelsea's advice":

- **PPO and variants:** when you care about stability and ease of use, and not about data efficiency
- **DQN and variants:** when you have discrete actions or low-dimensional continuous actions
- **SAC and variants:** when you care most about data efficiency and are fine with tuning and less stability

**Try this:** print that table. For any RL paper you read, fill in the four rows first: what data it uses, which value function it fits, how it estimates goodness, and how it updates the policy. Most new methods fit one column, or a blend of two.

## Going further: Distributional RL and what the 2026 slides skip

The schedule lists [Bellemare et al. 2017](https://arxiv.org/abs/1707.06887) as a reading for this lecture, but no 2026 slide mentions it. According to its abstract, the paper argues for learning the **full distribution of returns** rather than only their expectation. It applies Bellman's equation to approximate value distributions and evaluates on Atari games. The slides do not cover it, so this post does not fill in details.

The handout's last two sections, a DQN walkthrough and Soft Actor-Critic, contain only titles and figures in the PDF, with no text to cite.

The next lecture moves to offline RL: what breaks in Q-learning when you cannot interact with the environment at all. See [L7 Offline RL](/posts/ai/2026-09-30-cs224r-offline-rl-en).

Related reading on this site:

- [CS221 L8 Reinforcement Learning and Q-learning](/posts/ai/2026-08-22-stanford-cs221-lecture-08-reinforcement-learning-q-learning-en), the same ideas from the tabular side
- [Berkeley CS285 policy and value methods guide](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en). Many slides in this lecture are marked "Slide adapted from Sergey Levine"

## What this post can and cannot confirm

Confirmed: the text, equations, and figure titles in the 2026 slides and TA handout; the schedule's dates, room, and readings; and the titles and lengths of the two 2025 videos. Not confirmed: the in-class answer to the slide 7 exercise, anything said in the TA section, and the details of the handout's DQN and SAC walkthroughs. Slide 2's course reminders mention sharing "written notes from last year's head CA." Those notes do not appear on the public site.

Series navigation: previous [L5 Off-Policy Actor-Critic](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en) | next [HW2: Gridworld Q-learning, PPO, and the Sawyer Hammer Task](/posts/ai/2026-09-30-cs224r-hw2-online-rl-sawyer-en) | [Series overview](/posts/ai/2026-09-30-cs224r-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Embedded videos are from an earlier public term, not the 2026 course, so status changed to related supplementary.
- 2026-10-10: Checked the video content against its transcript. Both videos (2025 L6 and the TA tutorial) match the post on topic, speaker and length; nothing needed correcting.

## References

- [CS224R: Deep Reinforcement Learning (Spring 2026 course site and schedule)](https://cs224r.stanford.edu/)
- [Lecture 6 slides: Q-Learning (2026)](https://cs224r.stanford.edu/slides/06_cs224r_qlearning_2026.pdf)
- [TA extra-section handout: Review of Q-Learning (Maximilian Du)](https://cs224r.stanford.edu/material/CS224R_Tutotial_Max.pdf)
- [Spring 2025 Lecture 6: Q-Learning (YouTube, supplement)](https://www.youtube.com/watch?v=-7kv6jf0isQ)
- [Spring 2025 Tutorial Session: Review of Q-Learning (YouTube, supplement)](https://www.youtube.com/watch?v=07MQNMcxhZU)
- [Mnih et al. 2013: Playing Atari with Deep Reinforcement Learning](https://arxiv.org/abs/1312.5602)
- [van Hasselt et al. 2015: Deep Reinforcement Learning with Double Q-learning](https://arxiv.org/abs/1509.06461)
- [Bellemare et al. 2017: A Distributional Perspective on Reinforcement Learning](https://arxiv.org/abs/1707.06887)
- [Stanford CS234: Reinforcement Learning](https://web.stanford.edu/class/cs234/)
