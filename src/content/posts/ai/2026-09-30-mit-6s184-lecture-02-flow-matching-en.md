---
title: "MIT 6.S184 L2: Flow Matching, Learning the Marginal Vector Field from Conditional Paths"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, flow-matching, diffusion-model, generative-ai]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 3
tldr: "The object we want is the marginal vector field: run an ODE along it and noise flows into data. The catch is that it requires an integral over the whole dataset, so we can't compute it. Flow matching regresses on the conditional vector field instead, the one that pushes noise toward a single data point, which has a closed form. Theorem 12 in the notes shows the two losses differ by a constant and share the same gradient. On the CondOT path, training reduces to one line: sample data z, noise ε, and time t, and have the network predict z − ε at the point tz + (1−t)ε."
description: "A guide to Lecture 2 of MIT 6.S184 (IAP 2026), based on §3 of the lecture notes and Slides 2: conditional and marginal probability paths, the Gaussian conditional path (Example 8), conditional vector fields and Example 10, the marginalization trick (Theorem 9), the continuity equation (Theorem 11), why the FM and CFM losses are equivalent (Theorem 12), Algorithm 3 CondOT training, Example 13, and Summary 14."
draft: false
glossary:
  - term: "probability path"
    definition: "A family of distributions p_t indexed by time from 0 to 1, with noise at t=0 and data (or a single data point) at t=1. It specifies what the distribution should look like at every intermediate time."
    context: "Lecture notes §3.1. It fixes the distribution at each time, not how an individual particle moves."
  - term: "conditional vector field"
    definition: "A vector field u_t(x|z) designed for a single data point z; running the ODE along it sends noise to z. It usually has a closed form."
    context: "Flow matching uses it as the regression target to learn the intractable marginal vector field."
  - term: "CondOT path"
    aliases: ["CondOT probability path", "straight line schedule"]
    definition: "The Gaussian conditional path with α_t = t and β_t = 1 − t, N(tz, (1−t)² I_d): a linear interpolation between noise and data."
    context: "The path used in Algorithm 3 of the notes, where the conditional vector field simplifies to z − ε."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching)

> **Version note**: This post follows the IAP 2026 offering of [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html). I checked it on 2026-09-30 against §3 of the [lecture notes PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) (pp.14–24) and [Slides 2](https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf). The [Lecture 2 recording](https://www.youtube.com/watch?v=PNkMKWW8Khw) is a good companion. Access level: **A3, enough for self-study**. All equation numbers refer to the notes.

**Series position**: part 3 of [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en) | previous: [Lab 1: Simulating ODEs and SDEs](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en) | next: [L3A: Score Functions, SDE Sampling, and Score Matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en)

[Lecture 1](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en) built the generation machine: start from Gaussian noise `X_0 ~ p_init`, follow a neural-network vector field `u_t^θ` by simulating an ODE, and return the endpoint at t=1. An untrained network only produces noise.

This lecture answers one question: **how do we tune θ so that the ODE endpoint `X_1` follows the data distribution `p_data`?** The notes call the answer flow matching and, at the start of §3, describe it as simple, scalable, and the current state of the art.

Keep the time direction in mind: in this course **t=0 is noise and t=1 is data**. Much of the diffusion literature uses the reverse, so be careful when you compare with other material.

## One table for the whole lecture

Slides 2 organizes the lecture as a 2×3 "Flow Matching Matrix". The top row is "conditional", meaning a **single data point**. The bottom row is "marginal", meaning **the whole data distribution**.

| | Probability path | Vector field | Training loss |
|---|---|---|---|
| Conditional (one data point z) | `p_t(x\|z)` | `u_t(x\|z)` | CFM loss |
| Marginal (whole dataset) | `p_t(x)` | `u_t(x)` | FM loss |
| Tractable? | Top row: closed forms | Bottom row: intractable | But the bottom row can be learned through the top row |

The argument moves left to right and top to bottom. Pick a conditional path, derive its conditional vector field, prove that averaging gives the marginal versions, and finally prove that regressing on the conditional field is the same as regressing on the marginal one.

## Step 1: pick a path from noise to data

The ODE only pins down the start (`p_init`) and the end (`p_data`). You are free to choose the distributions in between, for 0<t<1. A **probability path** writes that choice down.

A **conditional probability path** `p_t(x|z)` is defined for one data point z. At t=0 it equals `p_init`; at t=1 it collapses to the Dirac delta `δ_z`, which always returns z (eq. 11).

The **marginal probability path** `p_t(x)` is what you get by first sampling `z ~ p_data` and then sampling from `p_t(·|z)` (eq. 12–13). It interpolates from `p_init` to `p_data` (eq. 14).

The notes flag an asymmetry: **we can sample from `p_t`, but we can't evaluate its density**, because the density requires an integral over the data distribution. Every later step works around that integral.

Slides 2 adds a point worth remembering. A probability path only specifies the "snapshot" distribution at each time. It says nothing about how a single particle moves. Particle dynamics come from the vector field in the next step.

### The key example: the Gaussian conditional path

The notes call the Gaussian path "by far the most important example" and strongly recommend reading it carefully (Example 8, p.15). Take two noise schedulers `α_t` and `β_t`, both continuously differentiable and monotonic, with `α_0 = β_1 = 0` and `α_1 = β_0 = 1`:

```text
p_t(·|z) = N(α_t z, β_t² I_d)                               (15)
z ~ p_data, ε ~ N(0, I_d)  ⇒  x = α_t z + β_t ε ~ p_t       (16)
```

At t=0, `α_0 = 0` and `β_0 = 1`, so only noise is left. At t=1, `α_1 = 1` and `β_1 = 0`, so only the data point is left. Smaller t means more noise.

## Step 2: a conditional vector field pushes noise to one data point

A path is only a wish about the distribution at each time. To make particles actually follow it, you need a vector field.

For each data point z, a **conditional vector field** `u_t(x|z)` is any vector field whose ODE produces the conditional path: start at `X_0 ~ p_init`, follow the field, and `X_t ~ p_t(·|z)` (eq. 17). You can usually derive one by hand.

For the Gaussian path, the answer is Example 10 (p.17):

```text
u_t(x|z) = (α̇_t − (β̇_t / β_t) α_t) z + (β̇_t / β_t) x        (20)
```

Here `α̇_t` and `β̇_t` are time derivatives.

<details>
<summary>Proof of Example 10 (notes p.18)</summary>

First define the conditional flow `ψ_t(x|z) = α_t z + β_t x` (eq. 21). If `X_0 ~ N(0, I_d)`, then `X_t = α_t z + β_t X_0 ~ N(α_t z, β_t² I_d)`, which is exactly the conditional path.

What remains is to recover the vector field from the flow. By the definition of a flow, `d/dt ψ_t(x|z) = u_t(ψ_t(x|z)|z)`:

```text
α̇_t z + β̇_t x = u_t(α_t z + β_t x | z)          for all x, z
substitute x → (x − α_t z)/β_t:
α̇_t z + β̇_t (x − α_t z)/β_t = u_t(x|z)
rearranging gives eq. (20).
```

A footnote in the notes says you can also double-check this by plugging it into the continuity equation introduced later.

</details>

On its own, a conditional vector field looks useless. Every trajectory collapses onto the same z, so it only regenerates a known data point. Its value shows up in the next step.

## Step 3: average them and you get the marginal vector field

**Theorem 9 (marginalization trick, p.16)**: average the conditional vector fields with the weights below. The resulting marginal vector field `u_t(x)` makes the ODE follow the marginal path, so `X_1 ~ p_data`.

```text
u_t(x) = ∫ u_t(x|z) · p_t(x|z) p_data(z) / p_t(x) dz          (18)
X_0 ~ p_init,  dX_t/dt = u_t(X_t)  ⇒  X_t ~ p_t  (0 ≤ t ≤ 1)  (19)
```

By Bayes' rule, the weight `p_t(x|z) p_data(z) / p_t(x)` is the posterior probability that a noisy x came from data point z. The notes give the intuition: for each possible data point z, take the velocity that would carry you to z, weight it by how much you believe x came from z, and average.

That is also the problem. The integral sweeps over the whole data distribution, so **it's intractable**.

### Why averaging works: the continuity equation

To prove Theorem 9, the notes use a basic tool from math and physics. This is the series' first partial differential equation. If PDEs are new to you, grab the intuition first.

**Theorem 11 (continuity equation, p.19)**: the ODE's particles satisfy `X_t ~ p_t` if and only if

```text
∂_t p_t(x) = −div(p_t u_t)(x)          for all x and 0 ≤ t ≤ 1     (23)
```

The left side is how the density at x changes over time. On the right, divergence measures the net outflow of the vector field; with a minus sign it becomes net inflow, scaled by the probability mass currently at x. **Probability mass is conserved (it always integrates to 1), so if it increases somewhere, it must have flowed in from somewhere else.** Slides 2 draws exactly this outflow-minus-inflow picture.

<details>
<summary>Proving Theorem 9 with the continuity equation (notes p.19)</summary>

The goal is to show that `u_t` from eq. (18) satisfies the continuity equation.

```text
∂_t p_t(x) = ∂_t ∫ p_t(x|z) p_data(z) dz
           = ∫ ∂_t p_t(x|z) p_data(z) dz
           = ∫ −div(p_t(·|z) u_t(·|z))(x) p_data(z) dz      conditional path satisfies the continuity eq.
           = −div( ∫ p_t(x|z) u_t(x|z) p_data(z) dz )       swap integral and div
           = −div( p_t(x) ∫ u_t(x|z) p_t(x|z) p_data(z) / p_t(x) dz )
           = −div(p_t u_t)(x)                                by eq. (18)
```

The first and last lines together are the continuity equation, and Theorem 11 then gives eq. (19). A full proof of the continuity equation itself is in Appendix B of the notes (from p.72).

</details>

## Step 4: regressing on the conditional field equals regressing on the marginal field

The most direct training objective is to make the network approximate the marginal vector field with a mean-squared error:

```text
L_FM(θ)  = E_{t~Unif, x~p_t} ‖u_t^θ(x) − u_t(x)‖²                    (24)
         = E_{t~Unif, z~p_data, x~p_t(·|z)} ‖u_t^θ(x) − u_t(x)‖²     (25)
```

Sampling is easy: draw t, draw a data point z, add some noise to get x. The blocker is `u_t(x)` itself, which is the intractable integral from above.

So swap in the tractable conditional vector field as the target. That gives the **conditional flow matching loss**:

```text
L_CFM(θ) = E_{t~Unif, z~p_data, x~p_t(·|z)} ‖u_t^θ(x) − u_t(x|z)‖²   (26)
```

This looks suspicious. We care about the marginal field, so why should regressing on the conditional one work?

**Theorem 12 (p.20)** answers it: `L_FM(θ) = L_CFM(θ) + C`, where C does not depend on θ, so **the gradients are identical**. Minimizing the CFM loss with SGD is the same as minimizing the FM loss. Assuming an infinitely expressive network, the minimizer of the CFM loss equals the marginal vector field. In the notes' words, by explicitly regressing on the tractable conditional field, we implicitly regress on the intractable marginal field.

<details>
<summary>Proof outline for Theorem 12 (notes pp.20–21)</summary>

1. Expand the FM loss with `‖a − b‖² = ‖a‖² − 2aᵀb + ‖b‖²`. The `‖u_t(x)‖²` term doesn't depend on θ; call it the constant `C_1`.
2. The cross term is the crux. Write the expectation as an integral and substitute eq. (18); `p_t(x)` cancels:

```text
E_{t, x~p_t}[u_t^θ(x)ᵀ u_t(x)]
  = ∫∫ p_t(x) u_t^θ(x)ᵀ ∫ u_t(x|z) p_t(x|z) p_data(z) / p_t(x) dz dx dt
  = ∫∫∫ u_t^θ(x)ᵀ u_t(x|z) p_t(x|z) p_data(z) dz dx dt
  = E_{t, z~p_data, x~p_t(·|z)}[u_t^θ(x)ᵀ u_t(x|z)]
```

3. With the cross term now in conditional form, add and subtract `‖u_t(x|z)‖²` to complete the square. The result is `L_CFM(θ) + C_2 + C_1`.

</details>

The notes highlight three features of the algorithm:

1. **Simulation-free**: training never simulates the ODE, which makes it very cheap.
2. **Plain regression**: not far from supervised learning.
3. **Extremely simple**: it's hard to imagine a simpler training objective.

After training, you sample by simulating `dX_t = u_t^θ(X_t) dt` with Algorithm 1 (Euler's method) from Lecture 1 (eq. 27). The literature calls this whole pipeline flow matching.

## On Gaussian paths, training is one line

**Example 13 (p.22)** plugs the Gaussian path into the CFM loss. Sampling is `x_t = α_t z + β_t ε` (eq. 28), and the conditional vector field is eq. (20), restated as eq. (29). After substituting `α_t z + β_t ε` for x, the coefficients on z and x cancel:

```text
L_CFM(θ) = E_{t~Unif, z~p_data, ε~N(0,I_d)} ‖u_t^θ(α_t z + β_t ε) − (α̇_t z + β̇_t ε)‖²   (31)
```

Sample a data point, sample noise, compute a mean-squared error.

Now take the most common special case, `α_t = t` and `β_t = 1 − t`. The notes say this is sometimes called the **(Gaussian) CondOT probability path**. Here `α̇_t = 1` and `β̇_t = −1`, so the target simplifies to `z − ε`. Slides 2 calls it the Straight Line Schedule: linearly interpolate between noise and data, and the network predicts their difference.

**Algorithm 3 (p.22)** is exactly this special case:

```text
for each mini-batch:
  sample z from the dataset
  sample t ~ Unif[0,1]
  sample ε ~ N(0, I_d)
  x = t z + (1 − t) ε
  L(θ) = ‖u_t^θ(x) − (z − ε)‖²
  θ ← grad_update(L(θ))
```

The notes say Stable Diffusion 3 and Meta's Movie Gen Video were trained with this simple procedure. Slides 2 shows samples from both.

## Summary 14: the whole lecture

Summary 14 (notes pp.23–24) condenses the lecture into four steps:

1. Choose a conditional probability path `p_t(x|z)` with `p_0(·|z) = p_init` and `p_1(·|z) = δ_z`.
2. Find a conditional vector field `u_t(x|z)` whose flow produces the path (equivalently, one that satisfies the continuity equation).
3. The marginal vector field averaged via eq. (32) turns noise into data along the ODE.
4. Learn it with the CFM loss.

The three Gaussian-path formulas (eq. 35–37):

| Object | Formula |
|---|---|
| Conditional path | `p_t(x\|z) = N(x; α_t z, β_t² I_d)` |
| Conditional vector field | `u_t(x\|z) = (α̇_t − (β̇_t/β_t) α_t) z + (β̇_t/β_t) x` |
| CFM loss | `E ‖u_t^θ(α_t z + β_t ε) − (α̇_t z + β̇_t ε)‖²` |

## After this lecture you should be able to

- Explain the difference between conditional and marginal paths, and why the marginal one can be sampled but not evaluated.
- Write down the Gaussian conditional path and its conditional vector field.
- Explain the marginalization trick as a posterior-weighted average.
- Say in one sentence why Theorem 12 makes flow matching trainable.
- Write Algorithm 3 from memory.

**Something to do tonight**: read pp.14–22 of the notes. Then, on paper, plug `α_t = t` and `β_t = 1 − t` into eq. (31) and derive the Algorithm 3 target `z − ε` yourself. Once you can, Problem 3.1 in [Lab 2](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en) is only a coding exercise.

## Further reading

- Next step: the same Gaussian path has a second reading, the score function. See [L3A: Score Functions, SDE Sampling, and Score Matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en)
- The DDPM view: [CMU 11-785 Lecture 23: Diffusion Models](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en). Check the time direction before comparing formulas; DDPM-style writing usually puts data at t=0
- A flow matching assignment from another course: [Berkeley CS189 HW2: regression, GMMs, and flow matching](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching-en)
- A broad introduction to generative models: [MIT 6.S191 L4: Generative Modeling](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling-en)

Series navigation: previous, [Lab 1: Simulating ODEs and SDEs](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en) | next, [L3A: Score Functions, SDE Sampling, and Score Matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en) | [back to the series overview](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)

## References

- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — Lecture 2 topic list
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models (lecture notes PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §3: eq. (10)–(37), Example 8, Theorem 9, Example 10, Theorem 11, Theorem 12, Algorithm 3, Example 13, Summary 14; Appendix B
- [arXiv 2506.02070](https://arxiv.org/abs/2506.02070) — arXiv version of the notes
- [Slides 2 (20260122_Lecture_02.pdf)](https://diffusion.csail.mit.edu/2026/docs/20260122_Lecture_02.pdf) — Flow Matching Matrix, paths as snapshots only, continuity equation diagram, Straight Line Schedule, SD3 and Movie Gen examples
- [Lecture 2 recording: Flow Matching (2026)](https://www.youtube.com/watch?v=PNkMKWW8Khw)
