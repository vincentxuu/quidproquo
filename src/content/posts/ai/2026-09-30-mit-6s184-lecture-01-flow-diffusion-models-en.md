---
title: "MIT 6.S184 L1: Generation Is Sampling, and ODEs and SDEs Are the Machine"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 1
tldr: "Lecture 1 of MIT 6.S184 first rewrites \"generate an image of a dog\" as \"sample from the data distribution,\" then gives the machine that does the sampling: start from Gaussian noise and simulate an ODE along a neural-network vector field (a flow model), or add a little Brownian-motion noise at every step to get an SDE (a diffusion model). Each is simulated with the simplest numerical method available, Euler and Euler–Maruyama. How to train the vector field is left to Lecture 2."
description: "A guide to Lecture 1 of MIT 6.S184 (IAP 2026), following notes §1.3 and §2, Slides 1, and the recording: Key Ideas 1–4, vector fields, ODEs, and flows, Theorem 3 and the linear vector field example, Algorithm 1 Euler sampling, Brownian motion and SDEs, Theorem 5, the Ornstein–Uhlenbeck process, Algorithm 2 Euler–Maruyama, and Summary 7."
draft: false
glossary:
  - term: "vector field"
    definition: "A function that assigns a velocity vector u_t(x) to every time t and location x; ODE trajectories follow it."
    context: "In a flow model, the neural network parameterizes the vector field, not the flow."
  - term: "Brownian motion"
    aliases: ["Wiener process"]
    definition: "A stochastic process that starts at 0, has continuous paths, and has Gaussian, independent increments; think of it as a continuous-time random walk."
    context: "It drives the random part of an SDE."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Version note**: This post follows §1.3 and §2 (pp.4–13) of the [lecture notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) for [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026, [Slides 1](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf), and the [Lecture 1 recording](https://www.youtube.com/watch?v=9eJQQVrUUoI). Theorem, example, and algorithm numbers follow the notes. Checked on 2026-09-30.

**Series position**: Previous: [Series overview](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en) | Next: [Lab 1: Simulating ODEs and SDEs](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en)

The notes open with a line from Song et al.: creating noise from data is easy; creating data from noise is generative modeling. Lecture 1 turns that line into math. It defines what "generate" means, then gives two machines that push noise into data.

This lecture **does not cover training**. You will meet a neural-network vector field `u_t^θ`, but how its parameters are learned is the subject of [Lecture 2](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en).

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=9eJQQVrUUoI
title: Lecture 1 recording: Flow and Diffusion Models (2026)
```

Original videos: [Lecture 1 recording: Flow and Diffusion Models (2026)](https://www.youtube.com/watch?v=9eJQQVrUUoI)

Course and recording entries:

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## Making "generate" precise: four Key Ideas

Notes §1.3 formalizes the problem with four Key Ideas.

**Key Idea 1: objects are vectors.** An H×W RGB image is an element of `R^{H×W×3}`; a T-frame video lives in `R^{T×H×W×3}`; a molecule with N atoms can naively be written as `R^{3×N}`. After flattening, whatever we want to generate is some `z ∈ R^d`. Text is the exception, usually treated as discrete and left to §7.

**Key Idea 2: generation is sampling.** There is no single best picture of a dog, only pictures that fit better or worse. Machine learning captures that diversity as a probability distribution, the data distribution `p_data`; images that look more like dogs get higher `p_data(z)`. A subjective judgment of "good" becomes "likely under `p_data`." Generating an object means drawing a sample from `p_data`. Slides 1 adds a note: we don't know this density.

**Key Idea 3: a dataset.** All we have is a finite set of samples `z_1, …, z_N` drawn independently from `p_data`. Images can be collected from the internet, videos from YouTube, protein structures from the Protein Data Bank.

**Key Idea 4: guided generation.** Wanting "a dog running down a snowy hill" means sampling from a conditional distribution `p_data(·|y)`, where `y` is the conditioning variable, such as a prompt. The notes say techniques for unconditional generation generalize readily to the conditional case, so the first three sections focus almost entirely on unconditional generation. Conditioning waits until [Lecture 3-B](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en).

The notes then define a **generative model** as an algorithm that turns samples from a simple initial distribution (such as a Gaussian) into (approximate) samples from `p_data`. The course covers only flows and diffusions, and the notes point out that many other generative models exist.

## Machine one: ODEs and flow models

### Vector fields, ODEs, and flows describe the same thing

Picture an arrow at every point in space and every moment in time, telling you which way to go and how fast. That is a **vector field** `u_t(x)`. Start from `x_0` and follow the arrows; the path you trace is a solution of the ODE. The **flow** `ψ_t(x_0)` answers a different question: if you start at `x_0`, where are you at time t?

In the notes' words, vector fields define ODEs whose solutions are flows; intuitively, the three are the same object.

<details>
<summary>Notes eq. (1) and (2): definitions of an ODE and a flow</summary>

```text
ODE:    d/dt X_t = u_t(X_t),        X_0 = x_0            (1a)(1b)
flow:   ψ : R^d × [0,1] → R^d,  (x_0, t) ↦ ψ_t(x_0)
        d/dt ψ_t(x_0) = u_t(ψ_t(x_0)),   ψ_0(x_0) = x_0  (2)
```

Given an initial condition, the trajectory is `X_t = ψ_t(X_0)`.

</details>

Does a solution exist, and is it unique? **Theorem 3** (flow existence and uniqueness) says yes, as long as `u` is continuously differentiable with a bounded derivative; each `ψ_t` is then a diffeomorphism (differentiable with a differentiable inverse). The notes reassure the reader: machine learning parameterizes `u_t` with neural networks, which have bounded derivatives, so the theorem is good news rather than a burden. Slides 1 labels it the Picard–Lindelöf theorem and adds that, more generally, a Lipschitz vector field is enough.

**Example 4** is the simplest case: the linear vector field `u_t(x) = −θx` (θ>0) has flow `ψ_t(x_0) = exp(−θt) x_0`, and trajectories decay exponentially to 0. The Ornstein–Uhlenbeck process below is this same example with noise added.

<details>
<summary>Checking Example 4</summary>

```text
ψ_0(x_0) = x_0
d/dt ψ_t(x_0) = d/dt (exp(−θt) x_0) = −θ exp(−θt) x_0 = −θ ψ_t(x_0) = u_t(ψ_t(x_0))
```

The middle step uses the chain rule.

</details>

### The Euler method: one small step at a time

Once the vector field gets complicated, the flow has no closed form and has to be simulated. The simplest method is **Euler**: look up the arrow at your current position, move h along it, and repeat n times (h = 1/n).

```text
X_{t+h} = X_t + h · u_t(X_t)        (t = 0, h, 2h, …, 1−h)      notes eq. (4)
```

The notes say Euler is good enough for this class, and show Heun's method for a taste of something finer: take an Euler step as a first guess, then correct it using the average of the vector field at the current and guessed positions. Slides 1 illustrates the step-size tradeoff: large steps are more efficient but less accurate; small steps are more accurate but slower.

### Flow models: make the starting point random

An ODE is deterministic, but generation needs randomness. The notes' fix is direct: make the starting point random. Draw `X_0` from an easy-to-sample initial distribution `p_init` (usually the standard Gaussian `N(0, I_d)`) and simulate the ODE with a neural-network vector field `u_t^θ`. The goal is for the endpoint `X_1` to be distributed as `p_data`.

The notes stress a point that is easy to mix up: **despite the name, a flow model's neural network parameterizes the vector field, not the flow.** Getting the flow requires simulating the ODE.

<details>
<summary>Algorithm 1: sampling from a flow model with the Euler method</summary>

```text
Require: neural-network vector field u_t^θ, number of steps n
1: t = 0
2: h = 1/n
3: draw X_0 ~ p_init
4: for i = 1, …, n:
5:     X_{t+h} = X_t + h · u_t^θ(X_t)
6:     t ← t + h
7: return X_1
```

</details>

This is where the notes' time convention first shows up: **t=0 is noise, t=1 is data**. Much of the diffusion literature runs the other way (Appendix E of the notes flags this), so check the direction before comparing with other material.

## Machine two: SDEs and diffusion models

### Brownian motion: a continuous random walk

SDEs add randomness to ODEs, and the source of that randomness is **Brownian motion** `W_t`. The notes ask you to think of it as a continuous random walk. By definition, `W_0 = 0`, paths are continuous, and two conditions hold:

1. **Normal increments**: `W_t − W_s ~ N(0, (t−s) I_d)`, so variance grows linearly with time.
2. **Independent increments**: increments over non-overlapping intervals are independent.

Simulating it takes one line: at each step, add Gaussian noise scaled by `√h`.

```text
W_{t+h} = W_t + √h · ε_t,    ε_t ~ N(0, I_d)      notes eq. (5)
```

Why `√h` and not `h`? Normal increments require variance h over a step of length h, so the standard deviation is `√h`. The notes add a fun fact: Brownian paths are continuous (you could draw one without lifting the pen) but infinitely long (you would never stop drawing).

### From ODEs to SDEs

SDE paths are not differentiable, so `d/dt X_t` no longer makes sense. The notes first rewrite an ODE as an infinitesimal update, "take a small step toward `u_t(X_t)`," then add a Brownian-motion contribution at each step:

<details>
<summary>Notes eq. (6) and (7): definition of an SDE</summary>

```text
X_{t+h} = X_t + h·u_t(X_t) + σ_t (W_{t+h} − W_t) + h·R_t(h)      (6)
          └ deterministic ┘   └──── stochastic ────┘   └ error ┘

symbolic form:  dX_t = u_t(X_t) dt + σ_t dW_t,   X_0 = x_0       (7)
```

`σ_t ≥ 0` is the diffusion coefficient. The notes warn that the `dX_t` notation is purely informal shorthand for eq. (6).

</details>

An SDE has no flow map, because `X_t` is no longer fully determined by `X_0`. Existence and uniqueness still hold: **Theorem 5** says that if `u` is continuously differentiable with a bounded derivative and `σ_t` is continuous, the SDE has a unique solution. The notes skip the proof; in a stochastic calculus class, they say, it would take several lectures.

One important observation: **every ODE is an SDE with σ_t = 0.** From here on, ODEs count as a special case whenever SDEs are discussed.

### Example 6: the Ornstein–Uhlenbeck process

Add constant noise to Example 4's linear vector field and you get the **Ornstein–Uhlenbeck (OU) process**:

```text
dX_t = −θ X_t dt + σ dW_t      notes eq. (8)
```

Two forces pull against each other: the vector field `−θx` always pulls back toward 0, and `σ` keeps adding noise. Simulated long enough (t→∞), the distribution converges to the Gaussian `N(0, σ²/(2θ))`. With σ=0 you are back to the flow of Example 4. Figure 3 in the notes shows this with θ=0.25 and several values of σ, and [Lab 1](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en) has you redraw it.

### Euler–Maruyama: Euler for SDEs

The notes suggest that if the abstract definition of an SDE loses you, ask a different question: how would you simulate one? The answer is the **Euler–Maruyama method**, which is to SDEs what Euler is to ODEs: take a small step toward `u_t(X_t)`, then add a little Gaussian noise scaled by `√h·σ_t`.

```text
X_{t+h} = X_t + h·u_t(X_t) + √h·σ_t·ε_t,    ε_t ~ N(0, I_d)      notes eq. (9)
```

When the course simulates SDEs, labs included, this is usually the method.

### Diffusion models

Same recipe as flow models: draw the starting point from `p_init`, parameterize the vector field `u_t^θ` with a neural network, and add a **fixed** diffusion coefficient `σ_t`.

<details>
<summary>Algorithm 2: sampling from a diffusion model with Euler–Maruyama</summary>

```text
Require: neural network u_t^θ, number of steps n, diffusion coefficient σ_t
1: t = 0
2: h = 1/n
3: draw X_0 ~ p_init
4: for i = 1, …, n:
5:     draw ε ~ N(0, I_d)
6:     X_{t+h} = X_t + h · u_t^θ(X_t) + σ_t · √h · ε
7:     t ← t + h
8: return X_1
```

</details>

## Summary 7: the whole lecture

The notes close with Summary 7, which reads best as a table:

| | Content |
|---|---|
| Neural network | `u^θ : R^d × [0,1] → R^d`, parameterizing the vector field |
| Fixed | `σ_t : [0,1] → [0, ∞)`, the diffusion coefficient |
| Initialization | `X_0 ~ p_init`, e.g. a Gaussian |
| Simulation | `dX_t = u_t^θ(X_t) dt + σ_t dW_t`, from t=0 to t=1 |
| Goal | `X_1 ~ p_data` |

The last line: **a diffusion model with σ_t = 0 is a flow model.**

## After this lecture you should be able to

- State the mathematical definition of "generate" in one sentence: sampling from `p_data`.
- Distinguish vector fields, ODEs, and flows, and say which one a flow model's network parameterizes.
- Write the Euler and Euler–Maruyama updates and explain why the noise term carries `√h`.
- Say what distribution the OU process converges to.

**Something you can do tonight**: read pp.7–13 of the notes, then open Question 1.1 of [Lab 1](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en) and write both `step` functions.

## Further reading

- Rusty on probability: Appendix A of the notes (A Reminder on Probability Theory), or this site's [Stanford CS109 guide](/posts/learning/2026-08-21-stanford-cs109-probability-en)
- A broader intro to generative models: [MIT 6.S191 L4: Generative Modeling](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling-en)
- The DDPM view (opposite time direction): [CMU 11-785 L23: Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — Lecture 1 topic list
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models (lecture notes PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §1.3 Key Ideas 1–4, Summary 2; §2 eq. (1)–(9), Theorem 3, Example 4, Algorithm 1, Theorem 5, Example 6, Algorithm 2, Summary 7; Appendix E time convention
- [Slides 1 (20260120_Lecture_01.pdf)](https://diffusion.csail.mit.edu/2026/docs/20260120_Lecture_01.pdf) — course goals, Picard–Lindelöf, Euler step-size tradeoff, logistics
- [Lecture 1 recording: Flow and Diffusion Models (2026)](https://www.youtube.com/watch?v=9eJQQVrUUoI)
