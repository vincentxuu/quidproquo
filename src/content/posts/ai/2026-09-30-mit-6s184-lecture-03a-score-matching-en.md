---
title: "MIT 6.S184 L3A: Score Functions, SDE Sampling, and Score Matching"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, score-matching, generative-ai]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 4
tldr: "A score function is the gradient of the log density; it points toward where probability rises fastest. On Gaussian paths, the score and last lecture's vector field are both linear in x and z, so each converts into the other (Proposition 1 in the notes): learn one and you have learned both. With the score in hand, you can add noise of any strength to the ODE and turn it into an SDE without changing the distribution at any time (Theorem 17). The score itself is learned with the same trick as flow matching, by regressing on the conditional score. On Gaussian paths, that amounts to predicting the noise that was added, which is the DDPM training objective."
description: "A guide to the first half of Lecture 3 (3-A) of MIT 6.S184 (IAP 2026), based on §4 of the lecture notes and the first half of Slides 3: conditional and marginal score functions, Example 15, the Proposition 1 conversion formula, the Remark 16 denoiser, the SDE extension trick (Theorem 17, Example 18), the Fokker–Planck equation (Theorem 19), Langevin dynamics (Remark 20), denoising score matching (Theorem 22, Example 23), Algorithm 4, and Summary 24."
draft: false
glossary:
  - term: "score function"
    aliases: ["score"]
    definition: "The gradient of a distribution's log density with respect to x, ∇ log q(x). It points in the direction of steepest ascent in log-likelihood."
    context: "Lecture notes §4.1. The diffusion literature mostly starts from the score; flow matching starts from the vector field. On Gaussian paths they are interchangeable."
  - term: "SDE extension trick"
    definition: "Add a correction term (σ_t²/2)·∇log p_t and noise σ_t dW_t to the marginal vector field. The resulting SDE still has distribution p_t at every time. Any σ_t ≥ 0 works."
    context: "Theorem 17 in the notes. It lets a trained flow model sample with a stochastic SDE."
  - term: "denoising score matching"
    aliases: ["DSM", "conditional score matching"]
    definition: "Learning the marginal score by regressing on the tractable conditional score ∇log p_t(x|z). On Gaussian paths this is equivalent to predicting the added noise."
    context: "Theorem 22 and Example 23 in the notes. DDPM's noise-prediction loss is a reparameterization of it."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching)

**Video status: Videos included.** [Source details](#course-video-sources)

> **Version note**: This post follows the IAP 2026 offering of [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html). I checked it on 2026-09-30 against §4 of the [lecture notes PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) (pp.25–33) and the first half of [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf), up to the "Key takeaway" slide. The [Lecture 3-A recording](https://www.youtube.com/watch?v=ngC3QnYSVNM) is a good companion. Slides 3 is shared by 3-A and 3-B; the guidance half belongs to [L3B](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en). Access level: **A3, enough for self-study**.

**Series position**: part 4 of [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en) | previous: [L2: Flow Matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) | next: [Lab 2: Writing Flow Matching and Score Matching by Hand](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en)

[The previous lecture](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) only dealt with flow models: learn a marginal vector field and follow it with an ODE. But Lecture 1's machine has a second form, the diffusion model, which adds Brownian motion to the ODE and becomes an SDE. How do you train that?

The question for this lecture: **what is a score function, and why does learning it (or learning the vector field) let you sample with an SDE?** The answer also explains how diffusion models relate to flow matching.

The time direction is unchanged: **t=0 is noise, t=1 is data**.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the lecture numbers and recording links match and the videos are public and embeddable.

```youtube
url: https://www.youtube.com/watch?v=ngC3QnYSVNM
title: MIT 6.S184: Flow Matching and Diffusion Models - Lecture 03A - Score Functions (2026)
```

Original videos: [MIT 6.S184: Flow Matching and Diffusion Models - Lecture 03A - Score Functions (2026)](https://www.youtube.com/watch?v=ngC3QnYSVNM)

Course and recording entries:

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

Checked: 2026-10-10.

## Score functions point toward higher probability

For any distribution `q(x)`, its **score function** is `∇ log q(x)`, the gradient of the log-likelihood with respect to x (§4.1, p.25). The intuition is simple: it points in the direction of steepest ascent in log-likelihood. Figure 8 in the notes draws it as a field of arrows pointing into the high-density regions.

The notes say the diffusion literature takes the score perspective, and this section retells the previous lecture in that language.

On last lecture's probability paths there are two scores:

- **Conditional score** `∇ log p_t(x|z)`: one data point.
- **Marginal score** `∇ log p_t(x)`: the whole data distribution.

They relate exactly the way the vector fields do. The marginal score is the posterior-weighted average of the conditional score (eq. 38):

```text
∇ log p_t(x) = ∫ ∇ log p_t(x|z) · p_t(x|z) p_data(z) / p_t(x) dz      (38)
```

The proof in the notes uses only `∂_y log y = 1/y` and the chain rule (eq. 39).

**Example 15** computes the conditional score of the Gaussian path `N(α_t z, β_t² I_d)`:

```text
∇ log p_t(x|z) = −(x − α_t z) / β_t²          (40)
```

## Vector fields and scores are interchangeable

Notice that eq. (40) is linear in x and z. So is last lecture's conditional vector field, eq. (20). Slides 3 puts it this way: both are linear functions, just with different coefficients. That means you can convert one into the other.

**Proposition 1 (conversion formula, p.26)**: on Gaussian paths,

```text
u_t(x|z) = a_t ∇ log p_t(x|z) + b_t x         (41)
u_t(x)   = a_t ∇ log p_t(x)   + b_t x         (42)
a_t = β_t² (α̇_t / α_t) − β̇_t β_t,   b_t = α̇_t / α_t
```

The conditional version is straight algebra. For the marginal version, take the posterior-weighted integral of both sides, then use eq. (38) and the fact that the posterior integrates to 1.

The notes call this result striking: **once you've learned the marginal vector field, you've learned the score, and vice versa.** Slides 3 adds that early diffusion models learned the score and then converted it into the vector field, and that the two are equivalent.

<details>
<summary>Remark 16: the denoiser, another equivalent parameterization (p.26)</summary>

The conversion works because, after marginalizing, both the vector field and the score are linear reparameterizations of the posterior mean `E_{z|x}[z]`. So anything that recovers `E_{z|x}[z]` can recover the vector field and the score, and it may even be preferable for numerical and training stability.

The most common choice is the posterior mean itself, called the **denoiser**:

```text
D_t(x|z) = z,   D_t(x) = ∫ z · p_t(x|z) p_data(z) / p_t(x) dz
                       = (β_t u_t(x) − β̇_t x) / (α̇_t β_t − α_t β̇_t)     (43)
```

Intuitively, it's the expected clean data z given noisy data x. The notes say people often call such models denoising diffusion models, since learning `D_t` and learning `u_t` are theoretically equivalent. They also leave a question to think about: will the denoiser always output a "clean" data point?

</details>

## Sampling with an SDE: add noise, keep the distribution

So far, we can make ODE trajectories follow a probability path. With the score, the same result extends to SDEs.

**Theorem 17 (SDE extension trick, pp.27–28)**: for any diffusion coefficient `σ_t ≥ 0`,

```text
X_0 ~ p_init,
dX_t = [ u_t(X_t) + (σ_t² / 2) ∇ log p_t(X_t) ] dt + σ_t dW_t      (44)
⇒  X_t ~ p_t  (0 ≤ t ≤ 1)                                           (45)
```

You add two things to the original vector field: a noise term `σ_t dW_t`, and a score correction that pulls toward high probability. The noise scatters particles, the score pulls them back, and the two cancel. **The distribution at every time stays the same**, so `X_1 ~ p_data`. Figure 9 in the notes shows zig-zag trajectories with the same distributions as the ODE version.

The notes stress the most striking part: **you can pick σ_t after the network is trained**.

In theory any σ_t works. In practice there are two sources of error: the network doesn't learn the vector field and score perfectly (training error), and large σ_t forces Euler–Maruyama to take tiny steps (simulation error). So for a given trained model, there is an optimal σ_t that you find empirically. A footnote in the notes clarifies that the "best σ_t" is an artifact of imperfect training and finite compute, not a theoretical property of the continuous-time dynamics.

Slides 3 is blunter about why you would want an SDE at all:

- In theory, every diffusion coefficient gives the same result.
- In practice, there is training error and simulation error.
- Downstream applications (fine-tuning, inference-time optimization, and so on) may need stochastic evolution.
- The good news: ODE sampling often gives the best results. **SDE sampling is an option, not a must.**

**Example 18 (p.28)**: on Gaussian paths, Proposition 1 lets you write the whole SDE using only the score.

```text
dX_t = [ (a_t + σ_t²/2) ∇ log p_t(X_t) + b_t X_t ] dt + σ_t dW_t     (46)–(47)
```

### Why the distribution is preserved: the Fokker–Planck equation

Last lecture used the continuity equation to show the ODE follows the path. SDEs need its generalization. This is the second PDE of the series; again, start with the intuition.

**Theorem 19 (Fokker–Planck equation, p.29)**: the SDE `dX_t = u_t(X_t) dt + σ_t dW_t` has distribution `X_t ~ p_t` if and only if

```text
∂_t p_t(x) = −div(p_t u_t)(x) + (σ_t² / 2) Δp_t(x)      (49)
```

`Δ` is the Laplacian (eq. 48). With σ_t = 0 you recover the continuity equation. For the extra Laplacian term, the notes use a heat analogy: the heat equation has the same term, and it is in fact a special case of Fokker–Planck. Heat diffuses through a medium; we add a mathematical diffusion process, so we get the extra Laplacian. Slides 3 labels it "dispersion".

<details>
<summary>Proving Theorem 17 with Fokker–Planck (notes p.29)</summary>

We need to show the SDE in eq. (44) satisfies the Fokker–Planck equation for `p_t`:

```text
∂_t p_t = −div(p_t u_t)                                         Theorem 11
        = −div(p_t u_t) − (σ_t²/2) Δp_t + (σ_t²/2) Δp_t         add and subtract
        = −div(p_t u_t) − div((σ_t²/2) ∇p_t) + (σ_t²/2) Δp_t    definition of the Laplacian
        = −div(p_t u_t) − div(p_t (σ_t²/2) ∇log p_t) + (σ_t²/2) Δp_t   ∇log p_t = ∇p_t / p_t
        = −div(p_t [u_t + (σ_t²/2) ∇log p_t]) + (σ_t²/2) Δp_t   div is linear
```

The last line is the Fokker–Planck equation with drift `u_t + (σ_t²/2)∇log p_t`. A full proof of Fokker–Planck itself is in Appendix B of the notes (from p.72).

</details>

### A special case: Langevin dynamics

**Remark 20** (marked Optional in the notes, pp.29–30): if the probability path doesn't change over time, `p_t = p`, set `u_t = 0` and you get

```text
dX_t = (σ_t² / 2) ∇ log p(X_t) dt + σ_t dW_t        (50)
```

This is **Langevin dynamics**. By Theorem 17, p is its stationary distribution: start in p and you stay in p. Under mild conditions, starting from a different distribution also converges to p. The notes say this underlies molecular dynamics simulation and many MCMC methods. When p is Gaussian you get the Ornstein–Uhlenbeck process, which served as the basis for the first formulations of diffusion models. Part 3 of [Lab 1](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en) does exactly this.

**Remark 21** (Optional) gets one sentence: GLASS Flows is a sampling trick that reproduces the same stochastic transitions as an SDE using only ODEs.

## Score matching: the same trick learns the score

The last piece is learning the marginal score `∇ log p_t(x)`. On Gaussian paths, just convert from the vector field with Proposition 1. In general, the notes say you can also learn it directly.

Use a score network `s_t^θ` and write two losses, following last lecture's recipe (§4.3, p.31):

```text
L_SM(θ)  = E_{t, z~p_data, x~p_t(·|z)} ‖s_t^θ(x) − ∇ log p_t(x)‖²      score matching
L_CSM(θ) = E_{t, z~p_data, x~p_t(·|z)} ‖s_t^θ(x) − ∇ log p_t(x|z)‖²    conditional score matching
```

The marginal score is intractable; the conditional score isn't.

**Theorem 22**: `L_SM(θ) = L_CSM(θ) + C`, so the gradients match and the minimizer satisfies `s_t^θ = ∇ log p_t`. The proof is identical to Theorem 12 from last lecture, because eq. (38) has the same form as eq. (18); just replace the vector field with the score.

### On Gaussian paths: predict the noise

**Example 23 (Denoising Diffusion Models, pp.31–32)** plugs in the conditional score, eq. (51), and substitutes `α_t z + β_t ε` for x:

```text
∇ log p_t(x|z) = −(x − α_t z) / β_t²                                   (51)
L_CSM(θ) = E ‖s_t^θ(α_t z + β_t ε) + ε / β_t‖²
         = E [ (1/β_t²) ‖β_t s_t^θ(α_t z + β_t ε) + ε‖² ]
```

What the network really learns is to **predict the noise that corrupted the data point**. That's where the name "denoising" score matching comes from. Slides 3 says the same thing in large type.

This loss is numerically unstable when `β_t ≈ 0`; it only works when enough noise has been added. The notes explain that the early [Denoising Diffusion Probabilistic Models (DDPM)](https://arxiv.org/abs/2006.11239) paper therefore dropped the constant `1/β_t²` and reparameterized the score network as a noise predictor `ε_t^θ = −β_t s_t^θ`:

```text
L_DDPM(θ) = E_{t~Unif, z~p_data, ε~N(0,I_d)} ‖ε_t^θ(α_t z + β_t ε) − ε‖²
```

**Algorithm 4 (p.32)** has almost the same shape as last lecture's Algorithm 3:

```text
for each mini-batch:
  sample z from the dataset
  sample t ~ Unif[0,1]
  sample ε ~ N(0, I_d)
  x_t = α_t z + β_t ε
  L(θ) = ‖s_t^θ(x_t) + ε/β_t‖²     or   L(θ) = ‖ε_t^θ(x_t) − ε‖²
  update θ by gradient descent
```

## Summary 24: the whole lecture

Summary 24 (notes pp.32–33), together with the Key takeaway slide in Slides 3, comes down to three points:

1. **Conversion formula**: on Gaussian paths, learning the marginal vector field and learning the score are equivalent (Proposition 1).
2. **Denoising score matching**: regress on the conditional score and you learn the marginal score (Theorem 22).
3. **Sampling with scores**: add as much noise as you like, then correct the vector field with the score (Theorem 17, eq. 52–53).

On Gaussian paths you don't need to train `s_t^θ` and `u_t^θ` separately; convert with Proposition 1.

## So how do flow matching and diffusion relate?

Put the two lectures side by side:

| | L2 Flow matching | L3A Score matching |
|---|---|---|
| Object learned | Marginal vector field `u_t(x)` | Marginal score `∇ log p_t(x)` |
| Regression target | Conditional vector field `u_t(x\|z)` | Conditional score `∇ log p_t(x\|z)` |
| Equivalence theorem | Theorem 12 | Theorem 22 |
| Sampling | ODE | SDE with any σ_t (σ_t = 0 is the ODE) |
| On Gaussian paths | Predict `α̇_t z + β̇_t ε` | Predict the noise ε |

On Gaussian paths, what each side learns converts into the other via Proposition 1. The differences are mainly parameterization, numerical stability, and whether you add noise at sampling time.

## After this lecture you should be able to

- Write the conditional score of a Gaussian path and explain why it converts to the conditional vector field.
- Explain what the score correction does in the SDE extension trick, and why σ_t can be chosen after training.
- Say which term Fokker–Planck adds to the continuity equation and what it represents.
- Derive DDPM's noise-prediction loss from denoising score matching.

**Something to do tonight**: read pp.25–27 of the notes. Plug eq. (40) into eq. (41) and check that the right side really equals last lecture's eq. (20). That algebra is exactly what Question 3.3 of [Lab 2](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en) asks you to write as code.

## Further reading

- The DDPM view: [CMU 11-785 Lecture 23: Diffusion Models](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en). **Watch out: the time direction is reversed.** The "A guide to the diffusion literature" section of Slides 3 distinguishes the flow time convention (data at t=1, noise at t=0; used in this course) from the diffusion time convention (data at t=0, noise as t→∞). Appendix E of the notes also warns that the popular convention puts `p_data` at t=0. DDPM belongs to the latter, so flip t before comparing formulas.
- The diffusion chapter of another set of notes: [Stanford CS229 2026 notes, chapter 14: Diffusion models](/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-14-diffusion-models-en)
- Appendix E of the notes (A Guide to the Diffusion Model Literature): discrete vs continuous time, forward processes vs probability paths, the inverted time convention, and how flow matching relates to stochastic interpolants, mapping the literature back onto this course's language

Series navigation: previous, [L2: Flow Matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) | next, [Lab 2: Writing Flow Matching and Score Matching by Hand](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en) | [back to the series overview](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official course page: lecture numbers and recording links match and the videos are public, so the status is now “Videos included.”

## References

- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — Lecture 3-A topic list
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models (lecture notes PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §4: eq. (38)–(54), Example 15, Proposition 1, Remark 16, Theorem 17, Example 18, Theorem 19, Remarks 20–21, Theorem 22, Example 23, Algorithm 4, Summary 24; Appendices B and E
- [arXiv 2506.02070](https://arxiv.org/abs/2506.02070) — arXiv version of the notes
- [Slides 3 (20260123_Lecture_03.pdf)](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) — first half: score functions, conversion formula, denoising score matching, Fokker–Planck diagram, why SDEs, Langevin, Key takeaway; time conventions from the second half
- [Lecture 3-A recording: Score Functions (2026)](https://www.youtube.com/watch?v=ngC3QnYSVNM)
- [Ho, Jain & Abbeel 2020, Denoising Diffusion Probabilistic Models](https://arxiv.org/abs/2006.11239) — the DDPM paper cited in the notes
