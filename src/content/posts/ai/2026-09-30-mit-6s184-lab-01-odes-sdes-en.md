---
title: "MIT 6.S184 Lab 1: Simulating ODEs and SDEs"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, generative-ai, score-matching]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 2
tldr: "MIT 6.S184 Lab 1 has three parts. First you write the step functions for Euler and Euler–Maruyama. Then you use them to simulate Brownian motion and the Ornstein–Uhlenbeck process and watch how σ and θ shape trajectories and the final distribution. Finally you implement Langevin dynamics, watch a cloud of points get pushed toward a five-mode Gaussian mixture, and show by hand that the OU process is Langevin dynamics with a Gaussian target. The questions, code scaffolding, and official solutions are all on GitHub; outside readers get no Gradescope grading and have to check against the solutions themselves."
description: "A guide to MIT 6.S184 (IAP 2026) Lab 1: the structure of lab_one.ipynb, what each question tests (Q1.1 Euler/Euler–Maruyama, Q2.1 Brownian motion, Q2.2 the OU process and σ²/2θ, Q3.1 LangevinSDE, Q3.2 OU as Langevin), how it maps to Algorithms 1–2, Example 6, and Remark 20 in the notes, and how to check yourself against the official solutions. No full solutions."
draft: false
glossary:
  - term: "Langevin dynamics"
    definition: "The SDE with drift (σ²/2)∇log p(x) plus σ dW_t; under mild conditions it pushes any starting distribution toward p, and p is its stationary distribution."
    context: "The subject of Lab 1 Part 3, and a special case in Remark 20 of the notes."
  - term: "score"
    aliases: ["score function"]
    definition: "The gradient of the log density, ∇log p(x), pointing in the direction of steepest density increase."
    context: "Lab 1 uses it to build Langevin dynamics; notes §4 develops it formally."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes)

> **Version note**: This post covers Lab 1 of [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026: [`labs/lab_one.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_one.ipynb) and the official solution [`solutions/lab_one_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_one_complete.ipynb) (branch `2026`), cross-referenced with Algorithms 1–2, Example 6, and Remark 20 of the [lecture notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf). Checked on 2026-09-30. It explains what each question tests and does not reproduce full solutions.

**Series position**: Previous: [L1: Generation Is Sampling, and ODEs and SDEs Are the Machine](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en) | Next: [L2: Flow Matching, Learning the Marginal Vector Field from Conditional Paths](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) | [Series overview](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)

[Lecture 1](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en) gave two update rules, Euler and Euler–Maruyama. Lab 1 has you turn them into code and use them to watch three kinds of SDEs. No neural network is trained anywhere in this lab; every vector field is written by hand. The point is to get a feel for simulating an SDE before anything is learned.

## Course video sources

Use the official course entry to check the lecture covered by this article; a directly embeddable public recording for this article has not been verified in this update.

Course and recording entries:

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## Before you start

On the course site this lab is called **Lab 1: Working with ODEs and SDEs**; the notebook's own title is Lab One: Simulating ODEs and SDEs. The site's workflow is:

1. Download the `.ipynb` from GitHub and open it in Jupyter or Google Colab.
2. Complete every question.
3. Export to PDF and submit to Gradescope via Canvas (without clearing cell outputs).

Step 3 is for enrolled MIT students only. For outside readers the only feedback is the official solution, so write your own version and produce the plots first, then open `lab_one_complete.ipynb` to compare.

The environment is set up in the first code cell: PyTorch (including `vmap` and `jacrev` from `torch.func`), matplotlib, seaborn, and tqdm. It uses CUDA when a GPU is available and falls back to CPU otherwise; this lab is light on compute.

The [README changelog](https://github.com/eje24/iap-diffusion-labs/tree/2026) has two entries for Lab 1: 1/22/25 fixed several typos, and 3/9/25 fixed a timestep bug in Langevin dynamics. Downloading from the `2026` branch gets you the fixed version.

## Part 0: two abstract classes

The notebook first defines two abstract classes, `ODE` and `SDE`. `ODE` needs only `drift_coefficient(xt, t)`; `SDE` adds `diffusion_coefficient(xt, t)`. The drift coefficient is the notes' vector field `u_t(x)`, and the diffusion coefficient is `σ_t`.

The notebook notes that an ODE can be seen as an SDE with zero diffusion coefficient; they are kept separate here for pedagogical and performance reasons.

## Part 1: Question 1.1, two step functions

The `Simulator` base class already implements the `simulate` loop: walk along a time grid `ts`, compute the step size `h`, and call `step`. You fill in:

- `EulerSimulator.step`: notes eq. (4), line 5 of [Algorithm 1](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en).
- `EulerMaruyamaSimulator.step`: notes eq. (9), lines 5–6 of Algorithm 2.

**What it tests**: that you multiply the diffusion coefficient by `√h` and by standard Gaussian noise shaped like `xt`, not by `h`. The formula is written in the notebook cell; translate it into tensor operations. The notebook then points out that with zero diffusion coefficient, the two simulators are identical.

**Self-check**: one Euler–Maruyama step is one Euler step plus a noise term. If your code doesn't have that structure, it's wrong.

## Part 2: looking at SDE trajectories

### Question 2.1: Brownian motion

Set `u_t = 0` and `σ_t = σ` and you get scaled Brownian motion, `dX_t = σ dW_t`. You:

1. Answer an intuition question first: what do trajectories look like when σ is very large, or close to zero?
2. Fill in both coefficients of `BrownianMotion`.
3. Run the default plotting cell (500 trajectories, time 0 to 5), then answer: what happens when you vary σ?

The official answer to that last question is a single sentence: the variance of the distribution of terminal values increases. That lines up directly with the normal increments in notes eq. (5).

### Question 2.2: the Ornstein–Uhlenbeck process

Set `u_t(x) = −θx` and `σ_t = σ` for the OU process of [Example 6](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en). The flow is similar:

1. Intuition question: what do trajectories look like for very small or very large θ?
2. Fill in both coefficients of `OUProcess`.
3. The default comparison cell uses θ=0.25 and σ ∈ {0, 0.5, 2.0}, the same θ as Figure 3 in the notes. The top row plots trajectories, the bottom row the final distribution.
4. Observation question: do solutions converge to a point or to a distribution? Answer in two sentences of the form "When (θ or σ) goes (up or down), we see…".

The hint is to watch the ratio **D = σ²/(2θ)**. That is exactly the variance of the limiting distribution `N(0, σ²/(2θ))` from Example 6. The next cell fixes D at 0.25, 1, and 4 and takes σ in 1, 2, and 10, laid out as a 3×3 grid.

The official conclusion reads in two directions. Along a row (fixed D), a larger σ converges faster to the same Gaussian-looking distribution. Down a column (fixed σ), a larger D widens the final distribution.

**What this section tests**: connecting the tug-of-war, the vector field pulling in and the noise pushing out, to the variance formula of the limiting distribution.

## Part 3: moving whole distributions with SDEs

Part 2 looked at individual trajectories; Part 3 looks at a whole cloud of points. As the notebook puts it, what we really care about is how an SDE transforms a **distribution**, because the end goal is turning Gaussian noise into `p_data`.

This is where the **score** appears: the gradient of the log density, `∇log p(x)`. The notebook's `Density` class computes it automatically with `vmap(jacrev(log_density))`, so you don't write it by hand. The provided distributions are a 2D Gaussian and two Gaussian mixtures (one randomly placed, one symmetric).

### Question 3.1: LangevinSDE

Implement overdamped Langevin dynamics:

```text
dX_t = ½ σ² ∇log p(X_t) dt + σ dW_t
```

Fill in both coefficients of `LangevinSDE`. The drift can use `self.density.score(xt)`.

The default experiment targets a 5-mode Gaussian mixture with σ=0.6, starts 1000 points from a wide Gaussian (covariance 20·I), and simulates t from 0 to 5. You are then asked to vary σ, the number and range of steps, the source, and the target, and say what you see and why. The official observation: the distribution converges to the one used to build the Langevin dynamics, and larger σ converges faster.

This corresponds to **Remark 20** in the notes (Langevin dynamics, p.29): when the probability path is constant, `p_t = p`, the resulting SDE is Langevin dynamics; `p` is its stationary distribution, and under mild conditions it converges to `p` from other starting distributions too. Figure 10 in the notes shows particles evolving toward a 5-mode Gaussian mixture. Remark 20 sits in notes §4.2, which is [Lecture 3-A](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en). The notebook text says "In Lecture 2, we will make this notion of driving more precise," which doesn't quite match how the 2026 notes are organized; go by §4.2.

The next two cells are an optional animation that needs `ffmpeg` (the notebook recommends installing it with conda; `pip install ffmpeg` will likely not work) and `celluloid`.

### Question 3.2: OU is Langevin dynamics

The lab ends with a short derivation in two parts:

1. Show that when `p(x) = N(0, σ²/(2θ))`, the score is `−(2θ/σ²) x`. The notebook gives this Gaussian's density as a hint.
2. Conclude that Langevin dynamics targeting this Gaussian is the OU process `dX_t = −θX_t dt + σ dW_t`.

**What it tests**: connecting the OU process of Part 2 with the Langevin dynamics of Part 3. Differentiate the log density, the constant drops out, and a linear function remains; plug it into the Langevin drift and `½σ²` cancels `2θ/σ²` down to θ. The last sentence of Remark 20 says the same thing: OU processes are the special case of Langevin dynamics with a Gaussian target, and they served as the basis for early diffusion models.

## After this lab you should be able to

- Plug any `drift_coefficient`/`diffusion_coefficient` pair into a simulator and produce trajectories.
- Read the separate roles of σ and θ off a plot and explain the OU final distribution with σ²/(2θ).
- Say why Langevin dynamics needs the score and how it relates to OU.

**Something you can do tonight**: do only Question 1.1 and the first three steps of Question 2.2, produce the three θ=0.25 plots, and put them next to Figure 3 in the notes.

## Further reading

- These simulators come back in Lab 2, paired with trained vector fields: [Lab 2: Writing Flow Matching and Score Matching by Hand](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en)
- The formal treatment of scores and Langevin dynamics: [L3A: Score Functions, SDE Sampling, and Score Matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [lab_one.ipynb (branch 2026)](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_one.ipynb) — question structure, default parameters, hints
- [lab_one_complete.ipynb (official solution)](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_one_complete.ipynb) — official answers to the observation questions
- [eje24/iap-diffusion-labs README](https://github.com/eje24/iap-diffusion-labs/tree/2026) — changelog (1/22/25, 3/9/25)
- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — submission workflow in the Labs section
- [Holderrieth & Erives lecture notes PDF](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — eq. (4), (5), (9), Algorithms 1–2, Example 6 and Figure 3, Remark 20 and Figure 10
