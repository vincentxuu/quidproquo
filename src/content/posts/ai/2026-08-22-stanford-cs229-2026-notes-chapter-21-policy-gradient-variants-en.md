---
title: "Policy Gradient and Its Variants: REINFORCE and PPO"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, policy-gradient, reinforce, ppo, reinforcement-learning]
lang: en
tldr: "Chapter 21 derives REINFORCE with the log-derivative trick, then uses reward-to-go, baselines, and PPO clipping to control policy-gradient variance and update size."
description: "A reading of Chapter 21 in the 2026 CS229 notes: REINFORCE via the log-derivative trick, reward-to-go, baselines, and PPO's clipped surrogate."
draft: false
series:
  name: "Reading Stanford CS229"
  order: 22
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-21-policy-gradient-variants)

This article reads Chapter 21, printed pages 258–265, of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a chapter guide to the 2026 notes, not a reconstruction of any quarter's recordings. It preserves the central derivations, intuition, and limits of REINFORCE and PPO without copying every proof line by line.

## REINFORCE does not require environment formulas

Let a finite-horizon trajectory be \(\tau=(s_0,a_0,\ldots,s_T)\), with stochastic policy \(\pi_\theta(a\mid s)\). The objective maximizes discounted total reward:

\[
\eta(\theta)=\mathbb{E}_{\tau\sim P_\theta}\left[\sum_{t=0}^{T-1}\gamma^tR(s_t,a_t)\right].
\]

REINFORCE only needs interaction: sample transitions and query rewards. It does not require analytic transition or reward functions, nor does it explicitly learn them first.

## The log-derivative trick makes the gradient sampleable

Writing trajectory payoff as \(f(\tau)\),

\[
\nabla_\theta\mathbb{E}_{P_\theta}[f(\tau)]
=\mathbb{E}_{P_\theta}[\nabla_\theta\log P_\theta(\tau)f(\tau)].
\]

Trajectory probability contains the initial-state distribution, environment transitions, and policy probabilities. Only the policy depends on \(\theta\), so unknown transition terms vanish after differentiation:

\[
\nabla_\theta\log P_\theta(\tau)=\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t).
\]

Intuitively, actions in high-return trajectories become more likely, while low-return trajectories receive smaller or opposite weight. This Monte Carlo estimator is unbiased but can have high variance.

## Reward-to-go and baselines

An action at time \(t\) cannot affect earlier rewards, so the full trajectory return can be replaced by reward-to-go from \(t\). Because the expected score function is zero, subtracting a state-only baseline \(B(s_t)\) leaves the expected gradient unchanged:

\[
\nabla_\theta\log\pi_\theta(a_t\mid s_t)\bigl(R_{\ge t}-B(s_t)\bigr).
\]

When \(B\) approximates the value function, the parenthesized quantity estimates advantage. A baseline reduces variance rather than changing the objective, so even an imprecise estimate can help.

## How PPO reuses old-policy data

Vanilla policy gradient is on-policy: after an update, old trajectories no longer come from the current policy. PPO samples with \(\pi_{old}\) and defines a per-step likelihood ratio

\[
r_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{old}(a_t\mid s_t)}.
\]

It corrects the sampled action contribution with \(r_t\hat A_t\), then clips it:

\[
\min\left(r_t\hat A_t,\operatorname{clip}(r_t,1-\epsilon,1+\epsilon)\hat A_t\right).
\]

For a positive-advantage action already made much more likely, the objective stops rewarding further increase. For a negative-advantage action already made much less likely, it likewise stops rewarding further decrease. PPO supports multiple local updates per batch, but the state distribution still comes from the old policy. It is a local surrogate, not a complete removal of off-policy bias. In practice, GAE often improves the bias–variance tradeoff of advantage estimates.

## Assumptions and failure modes

- Unbiased REINFORCE is not necessarily sample-efficient; long horizons and sparse rewards raise variance.
- An action-dependent baseline does not inherit the state-only argument automatically.
- PPO clipping limits incentives on sampled actions, not a hard global bound on policy KL.
- The old-policy state distribution is not fully corrected by the action likelihood ratio.
- With a misspecified reward, the algorithm simply optimizes the wrong proxy more effectively.

## Connection to adjacent chapters

Chapter 20 performed model-based control using known or learned structure. Chapter 21 learns a policy directly from rollouts. It also closes the loop with Chapter 18: token-level PPO, group-relative baselines, and other LLM RLVR variants all build on this score-function and advantage framework.

## Exercise

Take two length-three trajectories with per-step rewards \((2,3,5)\) and \((1,1,0)\), and let \(\gamma=1\). Compute reward-to-go at every time, then use a baseline of 2 for each state and determine the advantage signs. Finally, with \(\epsilon=0.2\), explain clipping for \(\hat A>0,r=1.4\) and for \(\hat A<0,r=0.7\).

## References

- [CS229 Lecture Notes Chapter 21: Policy Gradient, REINFORCE, and PPO (2026-08-18)](https://cs229.stanford.edu/main_notes.pdf#page=259)
- [Official Stanford CS229 course page](https://cs229.stanford.edu/)
