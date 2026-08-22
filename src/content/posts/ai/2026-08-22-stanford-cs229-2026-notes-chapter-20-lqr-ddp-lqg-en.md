---
title: "LQR, DDP, and LQG: From Linear Control to Uncertainty"
date: 2026-08-22
type: deep-dive
category: ai
tags: [cs229, lqr, ddp, lqg, kalman-filter]
lang: en
tldr: "Chapter 20 exploits linear dynamics and quadratic objectives to solve LQR, then uses DDP for local nonlinearity and Kalman filtering with LQG for partially observed state."
description: "A reading of Chapter 20 in the 2026 CS229 notes: finite-horizon dynamic programming, LQR Riccati recursions, DDP linearization, and Kalman estimation for LQG."
draft: false
series:
  name: "Reading Stanford CS229"
  order: 21
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-20-lqr-ddp-lqg)

This article reads Chapter 20, printed pages 244–257, of the [2026 CS229 main notes](https://cs229.stanford.edu/main_notes.pdf). It is a chapter guide to the 2026 notes, not a reconstruction of any quarter's recordings. It explains how structured control problems are solved and approximated without reproducing every Riccati or Gaussian-conditioning proof.

## Finite-horizon dynamic programming works backward

A finite-horizon problem may have time-dependent dynamics, rewards, and policies. It starts with terminal value and recurses backward:

\[
V_T^*(s)=\max_a R_T(s,a),
\]

\[
V_t^*(s)=\max_a\left[R_t(s,a)+\mathbb{E}_{s'}V_{t+1}^*(s')\right].
\]

Unlike an infinite-horizon fixed point, this requires only a finite number of backward steps. “Know the next value, then choose the current action” is the entry point to the analytic LQR solution.

## Why LQR produces a linear policy

LQR assumes continuous states and actions, linear dynamics, and a quadratic reward:

\[
s_{t+1}=A_ts_t+B_ta_t+w_t,
\]

\[
R_t(s_t,a_t)=-s_t^\top U_ts_t-a_t^\top W_ta_t.
\]

Zero-mean Gaussian noise \(w_t\) perturbs the system, while \(U_t,W_t\) penalize state deviation and control magnitude. If the next value is quadratic, substituting it into the Bellman backup and optimizing over \(a_t\) leaves another quadratic value. The optimal action is therefore linear in state, \(a_t^*=L_ts_t\), with coefficients found by a discrete Riccati recursion from the horizon backward.

The notes emphasize a structural fact: under these assumptions, optimal gain \(L_t\) does not depend on the process-noise covariance. Noise changes the constant offset in expected value, but not the best linear controller. This is not permission to ignore noise in arbitrary control systems.

## DDP repeatedly solves a local LQR

For nonlinear dynamics \(s_{t+1}=F(s_t,a_t)\), a first-order Taylor expansion around nominal point \((\bar s_t,\bar a_t)\) gives local linear dynamics, while a second-order reward expansion gives a local quadratic objective. A constant coordinate lets the result fit the LQR form.

Differential Dynamic Programming cycles through a nominal trajectory, local linearization and quadratic approximation at each time, a backward LQR solve, and a new rollout through the true nonlinear \(F\). If the new path moves too far from the expansion points, the local model fails. The notes explicitly mention reward shaping; step sizes and regularization are common implementation supplements for controlling the update region.

## LQG estimates an unobserved state before control

With partial observation, add an observation model:

\[
y_t=Cs_t+v_t,\qquad s_{t+1}=As_t+Ba_t+w_t.
\]

A Kalman filter maintains Gaussian belief mean \(s_{t|t}\) and covariance \(\Sigma_{t|t}\). Its predict step advances the belief through the dynamics. The update step uses the new observation's innovation:

\[
s_{t+1|t+1}=s_{t+1|t}+K_t(y_{t+1}-Cs_{t+1|t}),
\]

where Kalman gain \(K_t\) depends on predicted uncertainty and sensor noise. LQG then applies the LQR gain to the estimated state: \(a_t=L_ts_{t|t}\). This is the separation of estimation and control in the linear-Gaussian-quadratic setting.

## Assumptions and failure modes

- LQR's analytic form relies on linear dynamics, quadratic objectives, and suitable matrix conditions.
- Noise-covariance independence of the controller is specific to this LQR setup.
- DDP is local; poor nominal paths or large updates invalidate its approximation.
- Kalman filtering relies on credible models and noise assumptions; severe nonlinearity, non-Gaussian noise, or model error harms the belief.
- The LQG separation principle is not a general result for arbitrary POMDPs.

## Connection to adjacent chapters

Chapter 19 introduced general MDPs and continuous-state approximation. This chapter exploits extra structure to obtain computable control laws. Chapter 21 takes a model-free route, estimating a policy gradient from sampled trajectories without first identifying transition dynamics.

## Exercise

Consider \(s_{t+1}=s_t+a_t+w_t\) with cost \(s_t^2+0.1a_t^2\). Explain why the optimal action should be proportional to \(s_t\) with the opposite sign. Then add \(y_t=s_t+v_t\) and draw the data flow among Kalman predict, Kalman update, and the LQR action.

## References

- [CS229 Lecture Notes Chapter 20: LQR, DDP, LQG, and Kalman Filtering (2026-08-18)](https://cs229.stanford.edu/main_notes.pdf#page=245)
- [Official Stanford CS229 course page](https://cs229.stanford.edu/)
