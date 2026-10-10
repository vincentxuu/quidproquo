---
title: "Reading CS234, Part 8: Advanced Policy Gradients — Performance Bounds, KL, PPO, and GAE"
date: 2026-09-30
category: ai
type: guide
tags: [cs234, ai-course, stanford, reinforcement-learning, policy-gradient, ppo]
lang: en
series:
  name: "Reading Stanford CS234"
  order: 8
tldr: "Vanilla policy gradients have two flaws. Each batch is thrown away after one step, and distance in parameter space is not distance in policy space, so a large step can collapse performance. Following Joshua Achiam's slides, CS234 starts from the performance difference lemma, rewrites the new policy's performance as a surrogate objective over the old policy's data, and bounds the approximation error with KL divergence. Maximizing 'surrogate minus a KL penalty' guarantees no regression, but the theoretical constant is too large, so PPO approximates it with an adaptive KL penalty or clipping. Advantages come from GAE, which trades off bias and variance."
description: "A guide to the second half of Lecture 6 and the first half of Lecture 7 of Stanford CS234 Reinforcement Learning (Winter 2026): the sample efficiency and step size problems of policy gradients, the performance difference lemma, importance sampling and the surrogate objective, the relative policy performance bound and KL, the monotonic improvement proof, PPO's adaptive KL and clipped variants, n-step advantages and GAE, and how it all maps onto the PPO coding in A2."
draft: false
glossary:
  - term: "performance difference lemma"
    aliases: ["relative policy performance identity"]
    definition: "The performance gap J(π′) − J(π) equals the expected discounted sum of the old policy π's advantages along trajectories of π′."
    context: "CS234 L6 uses it to write a new policy's performance in terms of the old policy's advantages; A2 Question 3 asks you to prove it."
  - term: "surrogate objective"
    aliases: ["L_π(π′)"]
    definition: "The approximation you get by replacing the new policy's state distribution d^π′ with the old policy's d^π in the performance difference lemma. It can be estimated from the old policy's data alone."
    context: "PPO and TRPO both maximize it, plus some mechanism that limits how far the new policy moves from the old one."
  - term: "GAE"
    aliases: ["Generalized Advantage Estimation"]
    definition: "A geometric λ-weighted average of the 1-step, 2-step, 3-step, ... advantage estimates, equivalent to a (γλ)-discounted sum of TD errors."
    context: "λ = 0 gives the TD(0) advantage (more bias, less variance); λ closer to 1 approaches Monte Carlo. PPO uses a truncated version."
    links:
      - label: "Schulman et al. 2016 (arXiv)"
        url: "https://arxiv.org/abs/1506.02438"
---

> 🌏 [中文版](/posts/ai/2026-09-30-cs234-ppo-gae-monotonic-improvement)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

**This post is based on the Winter 2026 slides and assignments of [CS234](https://web.stanford.edu/class/cs234/); the recordings are the public Spring 2024 videos.** It is Part 8 of the [Reading Stanford CS234](/posts/ai/2026-09-30-cs234-course-overview-en) series and follows [policy gradient basics](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en).

Official materials used:

- Pages 24–48 of the [Lecture 6 slides](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf). This section is marked as taken from Joshua Achiam's slides, with minor modifications by Brunskill.
- Pages 1–24 of the [Lecture 7 slides](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf) (PPO recap, GAE, monotonic improvement theory, PPO and policy gradient summaries)
- Section 2.4 (PPO) and Question 3 (distributions induced by a policy) of the [A2 handout](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)
- [Video 06, "Policy Search 2"](https://www.youtube.com/watch?v=8PwvNQ5WS-o) and [video 07, "Policy Search 3"](https://www.youtube.com/watch?v=4ngb0IZTg8I) from the public 2024 recordings. Per their YouTube chapters, the second half of video 06 (from 41:22) covers monotonic improvement, the performance difference lemma, and the PPO clipped objective, and the first 45 minutes of video 07 cover GAE and the monotonic improvement proof.

Access level is **A3**. The imitation learning half of Lecture 7 is covered in [Part 10](/posts/ai/2026-09-30-cs234-imitation-learning-irl-en).

This is the series' second mathematical peak. The main text sticks to intuition and results; proofs and definitions are in collapsible blocks.

## Course video sources

This article uses Winter 2026 materials. The public Spring 2024 recordings below are supplementary; lecture numbering and content may differ.

```youtube
url: https://www.youtube.com/watch?v=8PwvNQ5WS-o
title: Lecture 6: Policy Search 2 (Spring 2024, YouTube)
```

```youtube
url: https://www.youtube.com/watch?v=4ngb0IZTg8I
title: Lecture 7: Policy Search 3 (Spring 2024, YouTube)
```

Original videos: [Lecture 6: Policy Search 2 (Spring 2024, YouTube)](https://www.youtube.com/watch?v=8PwvNQ5WS-o)、[Lecture 7: Policy Search 3 (Spring 2024, YouTube)](https://www.youtube.com/watch?v=4ngb0IZTg8I)

Course and recording entries:

- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Official course / lecture source](https://web.stanford.edu/class/cs234/)

## The scenario: one step too far and performance collapses

Page 27 of L6 frames policy gradients as an optimization problem: maximize $J(\pi_\theta) = \mathbb{E}_{\tau \sim \pi_\theta}[\sum_t \gamma^t r_t]$ by stochastic gradient ascent, with gradient $\mathbb{E}[\sum_t \gamma^t \nabla_\theta \log \pi_\theta(a_t \mid s_t) A^{\pi_\theta}(s_t, a_t)]$. The slides then list two limitations.

**Poor sample efficiency** (page 28). Vanilla PG throws each batch away after one gradient step, because the policy gradient is an on-policy expectation: the data must come from the current policy. The opportunity is to take several steps on old data. The challenge: even if that works, how many steps should you take?

**Step size is hard to choose** (pages 29–31).

- Too large, and performance can collapse. Recovery is hard, because the next batch is collected by the broken policy.
- Too small, and progress is unacceptably slow.
- The "right" step size also changes with $\theta$. Advantage normalization and Adam-style optimizers help, but the slides ask: does that actually solve the problem?

Page 31 points out that the problem goes deeper than step size: **distance in parameter space is not distance in policy space**. The slides use a family of two-action policies whose action probabilities are set by a single parameter $\theta$. The figure shows that small parameter changes can unexpectedly cause big changes in the policy. So the core question is how to design an update rule that **never changes the policy more than we meant to**.

## The key tool: the performance gap between two policies

The **performance difference lemma** on page 33, which the slides note CS234 asks you to prove in HW2 (A2 Question 3):

$$J(\pi') - J(\pi) = \mathbb{E}_{\tau \sim \pi'}\Big[\sum_{t=0}^\infty \gamma^t A^\pi(s_t, a_t)\Big] = \frac{1}{1-\gamma}\,\mathbb{E}_{s \sim d^{\pi'},\, a \sim \pi'}\big[A^\pi(s,a)\big]$$

Here $d^\pi(s) = (1-\gamma)\sum_t \gamma^t P(s_t = s \mid \pi)$ is the discounted state distribution.

Page 34 lays out the good and the bad. The good: the new policy $\pi'$'s performance is expressed with **the old policy $\pi$'s advantages**. The bad: the expectation is still over trajectories from $\pi'$, which is exactly the policy we do not have yet.

### Fix the actions with importance sampling

Page 36 switches the action distribution from $\pi'$ to $\pi$, at the cost of a ratio:

$$J(\pi') - J(\pi) = \frac{1}{1-\gamma}\,\mathbb{E}_{s \sim d^{\pi'},\, a \sim \pi}\Big[\frac{\pi'(a \mid s)}{\pi(a \mid s)} A^\pi(s,a)\Big]$$

This is the same trick as the likelihood ratio in the [previous post](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en): multiply by a ratio to move the expectation under a distribution you can sample from. Page 37 notes one remaining problem: the states still come from $s \sim d^{\pi'}$.

### Approximate the states directly

Page 38 is blunt: pretend $d^{\pi'} \approx d^\pi$ and move on. The resulting approximation is called $L_\pi(\pi')$:

$$J(\pi') - J(\pi) \approx L_\pi(\pi') = \frac{1}{1-\gamma}\,\mathbb{E}_{s \sim d^\pi,\, a \sim \pi}\Big[\frac{\pi'(a \mid s)}{\pi(a \mid s)} A^\pi(s,a)\Big]$$

Page 40 stresses what we gain: this objective **can be optimized using trajectories from the old policy alone**. And because the weights depend only on the current step, not the whole history before it, they do not vanish or explode the way whole-trajectory importance weights do.

How good is this approximation? Page 38 cites the **relative policy performance bound** from [Achiam, Held, Tamar, Abbeel 2017 (Constrained Policy Optimization)](https://arxiv.org/abs/1705.10528):

$$\big|J(\pi') - (J(\pi) + L_\pi(\pi'))\big| \le C\sqrt{\mathbb{E}_{s \sim d^\pi}\big[D_{KL}(\pi' \,\|\, \pi)[s]\big]}$$

**If the policies are close in KL divergence, the approximation is good.** That sentence is the heart of the whole section.

<details>
<summary>L6 page 39: KL divergence, definition and properties</summary>

For discrete distributions $P$ and $Q$:

$$D_{KL}(P \,\|\, Q) = \sum_x P(x) \log \frac{P(x)}{Q(x)}$$

Properties: $D_{KL}(P\|P) = 0$; $D_{KL}(P\|Q) \ge 0$; and it is **not symmetric**, $D_{KL}(P\|Q) \ne D_{KL}(Q\|P)$. The KL between two policies at state $s$ is $\sum_a \pi'(a \mid s) \log \frac{\pi'(a \mid s)}{\pi(a \mid s)}$.

</details>

The recommended reading on page 41 lists the three sources of this line of work: [Kakade & Langford 2002](https://people.eecs.berkeley.edu/~pabbeel/cs287-fa09/readings/KakadeLangford-icml2002.pdf), [TRPO (Schulman et al. 2015)](https://arxiv.org/abs/1502.05477), and [CPO (Achiam et al. 2017)](https://arxiv.org/abs/1705.10528).

## Monotonic improvement: why the policy never gets worse

Pages 17–21 of L7 turn the bound above into a lower bound:

$$J(\pi') - J(\pi) \ge L_\pi(\pi') - C\sqrt{\mathbb{E}_{s \sim d^\pi}\big[D_{KL}(\pi' \,\|\, \pi)[s]\big]}$$

Maximize the right-hand side and you are guaranteed to improve on $\pi$. The slides call this a **majorize-maximize** algorithm with respect to the true objective, and both $L_\pi$ and the KL term can be estimated from samples of $\pi$.

<details>
<summary>L7 page 21: proof of no regression</summary>

Let $\pi_{k+1} = \arg\max_{\pi'} L_{\pi_k}(\pi') - C\sqrt{\mathbb{E}_{s \sim d^{\pi_k}}[D_{KL}(\pi' \| \pi_k)[s]]}$.

$\pi_k$ itself is a feasible point, and the objective there equals 0:

- $L_{\pi_k}(\pi_k) \propto \mathbb{E}_{s,a \sim d^{\pi_k}, \pi_k}[A^{\pi_k}(s,a)] = 0$ (a policy's average advantage against itself is 0)
- $D_{KL}(\pi_k \| \pi_k)[s] = 0$

So the optimal value is $\ge 0$, and by the lower bound, $J(\pi_{k+1}) - J(\pi_k) \ge 0$.

The slides add that the proof still holds if you restrict the optimization to any parameterized policy class $\Pi_\theta$, as long as $\pi_k \in \Pi_\theta$.

</details>

### The catch: C is too big

L7 page 22: the $C$ that theory provides is very large when $\gamma$ is near 1, so steps that follow it are too small. The slides list two ways out:

- **Tune the KL penalty coefficient** → PPO
- **Use a KL constraint instead** (called a trust region), the TRPO route

## PPO: two variants

The definition on L6 page 43: **Proximal Policy Optimization (PPO) is a family of methods that approximately penalize the policy for changing too much between steps.** Page 46 adds that it does so **without computing natural gradients**.

### Variant 1: adaptive KL penalty

$$\theta_{k+1} = \arg\max_\theta L_{\theta_k}(\theta) - \beta_k \bar{D}_{KL}(\theta \,\|\, \theta_k)$$

The algorithm on page 44:

1. Collect a set of partial trajectories with $\pi_k$.
2. Estimate advantages $\hat{A}_t^{\pi_k}$ with any advantage estimation method.
3. Maximize the objective above with $K$ steps of minibatch SGD (via Adam).
4. If the KL exceeds 1.5 times the target $\delta$, set $\beta_{k+1} = 2\beta_k$; if it falls below $\delta/1.5$, set $\beta_{k+1} = \beta_k/2$.

Two notes from the slides: the initial $\beta$ does not matter much because it adapts quickly, and some iterations may violate the KL constraint, but most do not. Page 45 highlights step 3: **K steps on the same batch**. That is the answer to the sample efficiency problem.

### Variant 2: clipped objective

Page 46. Let $r_t(\theta) = \pi_\theta(a_t \mid s_t) / \pi_{\theta_k}(a_t \mid s_t)$:

$$L^{CLIP}_{\theta_k}(\theta) = \mathbb{E}_{\tau \sim \pi_k}\Big[\sum_{t=0}^T \min\big(r_t(\theta)\hat{A}_t^{\pi_k},\ \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t^{\pi_k}\big)\Big]$$

$\epsilon$ is a hyperparameter; the slides say "maybe $\epsilon = 0.2$". The poll on pages 47–48 shows a figure from the [PPO paper (Schulman et al. 2017)](https://arxiv.org/abs/1707.06347) and asks which panel corresponds to $A > 0$ and which to $A < 0$. The answer: **the left panel is $A > 0$, the right panel is $A < 0$**.

How to read the objective:

- $A > 0$ (the action is better than average): you want to raise $r_t$, but past $1+\epsilon$ the objective goes flat, so pushing further gains nothing.
- $A < 0$ (the action is worse than average): you want to lower $r_t$, but below $1-\epsilon$ the objective also goes flat.
- The outer $\min$ always picks the more pessimistic of the two terms. My reading: clipping only stops you from going too far in the favorable direction; it does not stop you from undoing a move that made things worse. The slides do not spell this out, so check it against Figure 1 in Section 3 of the PPO paper.

A2 question 2.7(b) asks you to write down every case in which the clipped objective's gradient is 0 and explain why. It is practice on exactly these three points.

## GAE: how to estimate the advantage

Where does PPO's $\hat{A}_t$ come from? L7 page 10 first recalls n-step estimators. With the TD error $\delta_t^V = r_t + \gamma V(s_{t+1}) - V(s_t)$:

$$\hat{A}_t^{(1)} = \delta_t^V, \quad \hat{A}_t^{(2)} = \delta_t^V + \gamma\delta_{t+1}^V, \quad \hat{A}_t^{(k)} = \sum_{l=0}^{k-1}\gamma^l \delta_{t+l}^V = \sum_{l=0}^{k-1}\gamma^l r_{t+l} + \gamma^k V(s_{t+k}) - V(s_t)$$

The last equality is a telescoping sum.

The **Generalized Advantage Estimator** on pages 11–12 is an exponentially weighted average of these estimates:

$$\hat{A}_t^{GAE(\gamma,\lambda)} = (1-\lambda)\big(\hat{A}_t^{(1)} + \lambda\hat{A}_t^{(2)} + \lambda^2\hat{A}_t^{(3)} + \dots\big) = \sum_{l=0}^\infty (\gamma\lambda)^l \delta_{t+l}^V$$

The slides note that it comes from [Schulman et al., "High-Dimensional Continuous Control Using Generalized Advantage Estimation" (ICLR 2016)](https://arxiv.org/abs/1506.02438), and that their derivation follows the paper.

The poll on pages 13–14 asks about the properties of GAE($\gamma$, 0) and GAE($\gamma$, 1). The slides' answers:

- **GAE($\gamma$, 0) is the advantage using a TD(0) return**, i.e. $\delta_t^V$
- **GAE($\gamma$, 0) likely has more bias than GAE($\gamma$, 1)**

Page 15 concludes that you generally pick $\lambda \in (0, 1)$ to balance bias and variance. It is the same trade-off as MC vs TD in [Part 4](/posts/ai/2026-09-30-cs234-model-free-policy-evaluation-en), now applied to advantages.

Page 16: **PPO uses a truncated GAE** that only sums up to step $T$: $\hat{A}_t = \sum_{l=0}^{T-t-1}(\gamma\lambda)^l\delta_{t+l}^V$. The benefit is that you only need to run the policy for $T$ steps before updating, and you get a better gradient estimate.

## Two summary slides

The PPO summary on L7 page 23:

- Better data efficiency: several gradient steps before collecting new data
- Clipping (or a KL constraint) makes monotonic improvement more likely
- Conservative policy updating is an influential idea in RL, going back at least to the early 2000s
- Converges to a local optimum
- Very popular, easy to implement, used in ChatGPT tuning

The policy gradient summary on page 24: extremely popular and useful, with many extensions beyond this class; usable when the reward is not differentiable; often combined with model-free value methods, i.e. actor-critic.

## How this maps onto A2

PPO in Section 2.4 of A2 uses the same objective as the clipped variant in the slides, with different notation. The ratio is written $z_\theta$, and the advantage is $G_t - V_\phi(s_t)$ (A2 calls $V_\phi$ the critic and trains it like the baseline network). The procedure: collect data with $\pi_{\theta_{old}}$, run gradient ascent on $J_{clip}$, and after every $K$ updates set $\pi_{\theta_{old}}$ to $\pi_\theta$.

Three written questions tie directly to this post:

| A2 question | Points | What it asks | Where to look in this post |
|---|---|---|---|
| 2.7(b) | 3 | When is the clipped objective's gradient 0, and why does PPO behave this way? | The three reading notes in the clipped objective section |
| 2.7(c) | 3 | Why must PPO cache log-probabilities during rollouts when REINFORCE does not? How would the implementation change without them? | The denominator of the ratio $r_t$ is the old policy |
| 3(a)–(d) | 14 | Write the trajectory distribution and the state distribution $d^\pi$, prove an expectation identity, and finally prove the performance difference lemma | The "performance gap between two policies" section |

The handout also gives an implementation tip (Tip 3): don't divide probabilities to get the ratio; exponentiate the difference of the log-probabilities instead.

The full assignment walkthrough is in the [A2 post](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo-en).

**Something to do tonight**: sketch $\min(rA, \text{clip}(r)A)$ as a function of $r$ on paper, once for $A > 0$ and once for $A < 0$, with $\epsilon = 0.2$. Then answer A2 2.7(b), "when is the gradient 0". The drawing gets you there much faster than the text.

## Further reading

- [Reading CS224R: Off-Policy Actor-Critic (PPO and SAC)](/posts/ai/2026-09-30-cs224r-off-policy-actor-critic-ppo-sac-en): another Stanford RL course's implementation-first take on PPO
- [Reading CME295: preference tuning](/posts/ai/2026-09-29-cme295-preference-tuning-en): what PPO and the KL penalty look like in LLM alignment
- [Reading CS336: SFT and RLHF](/posts/ai/2026-08-22-cs336-sft-rlhf-en)
- [Berkeley CS285: policy and value methods](/posts/learning/2026-08-22-berkeley-cs285-policy-value-methods-en)

**Series navigation**: previous [Part 7: policy gradients — REINFORCE, baselines, actor-critic](/posts/ai/2026-09-30-cs234-policy-gradient-reinforce-en) | next [Part 9: A2 — implementing REINFORCE, baselines, and PPO](/posts/ai/2026-09-30-cs234-a2-policy-gradient-ppo-en) | [series overview](/posts/ai/2026-09-30-cs234-course-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CS234: Reinforcement Learning (Winter 2026 course home page)](https://web.stanford.edu/class/cs234/)
- [CS234 modules page](https://web.stanford.edu/class/cs234/modules.html)
- [Lecture 6: Policy Gradient II slides (Winter 2026, post version)](https://web.stanford.edu/class/cs234/slides/lecture6post.pdf)
- [Lecture 7: Policy Gradients and Imitation Learning slides (Winter 2026, post version)](https://web.stanford.edu/class/cs234/slides/lecture7post.pdf)
- [Assignment 2 handout (Winter 2026)](https://web.stanford.edu/class/cs234/assignments/a2/CS234_A2_Questions.pdf)
- [Stanford CS234 Spring 2024 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rN4wG6Nk6sNpTEbuOSosZdX)
- [Lecture 6: Policy Search 2 (Spring 2024, YouTube)](https://www.youtube.com/watch?v=8PwvNQ5WS-o)
- [Lecture 7: Policy Search 3 (Spring 2024, YouTube)](https://www.youtube.com/watch?v=4ngb0IZTg8I)
- [Kakade & Langford 2002: Approximately Optimal Approximate Reinforcement Learning](https://people.eecs.berkeley.edu/~pabbeel/cs287-fa09/readings/KakadeLangford-icml2002.pdf)
- [Schulman et al. 2015: Trust Region Policy Optimization](https://arxiv.org/abs/1502.05477)
- [Schulman et al. 2016: High-Dimensional Continuous Control Using Generalized Advantage Estimation](https://arxiv.org/abs/1506.02438)
- [Schulman et al. 2017: Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347)
- [Achiam, Held, Tamar, Abbeel 2017: Constrained Policy Optimization](https://arxiv.org/abs/1705.10528)
