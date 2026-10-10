---
title: "MIT 6.S184 Lab 2: Writing Flow Matching and Score Matching by Hand"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, flow-matching, score-matching, pytorch]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 5
tldr: "Lab 2 turns §3–4 of the notes into PyTorch. You implement the Gaussian conditional path, its conditional vector field, and its conditional score. Then two nearly identical trainers do flow matching and score matching, Proposition 1 converts the learned vector field into a score, and finally a linear path makes a ring distribution flow into a checkerboard. Everything runs on 2D toy data. The README records a diffusion-coefficient bug fix dated 1/11/26; when I checked on 2026-09-30, the fix appeared only in the solutions notebook, not the student version, so patch it yourself before you start."
description: "A guide to Lab 2 of MIT 6.S184 (IAP 2026), based on labs/lab_two.ipynb and solutions/lab_two_complete.ipynb: Problems 2.1–2.4 (α_t/β_t, the Gaussian conditional path, conditional vector field, conditional score), Problem 3.1 flow matching training, 3.2 conditional score matching, Question 3.3 ScoreFromVectorField, Part 4 linear conditional paths and flow matching between arbitrary distributions, and the status of the 1/11/26 changelog fix."
draft: false
glossary:
  - term: "linear conditional path"
    aliases: ["linear conditional probability path"]
    definition: "For a fixed data point z, X_t = (1−t)X_0 + t z with X_0 drawn from any source distribution; the conditional vector field is (z − x)/(1 − t)."
    context: "Lab 2 Part 4. The source need not be Gaussian, so it supports flow matching between any two distributions, but it has no closed-form conditional score."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> **Version note**: This post covers Lab 2 of the IAP 2026 offering of [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html). I checked it on 2026-09-30 against [`labs/lab_two.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_two.ipynb), [`solutions/lab_two_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_two_complete.ipynb), and the README changelog in the [labs repo (branch 2026)](https://github.com/eje24/iap-diffusion-labs/tree/2026). Access level: **A3, enough for self-study**. The notebook and official solutions are public, but graded submission is only for enrolled MIT students.

**Series position**: part 5 of [Reading MIT 6.S184](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en) | previous: [L3A: Score Functions, SDE Sampling, and Score Matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en) | next: [L3B: Guidance and Classifier-Free Guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en)

[L2](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) and [L3A](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en) derived a pile of formulas: conditional paths, conditional vector fields, conditional scores, two losses, and a conversion formula. Lab 2 has you write all of them as code and watch "regress on the conditional target, learn the marginal one" actually happen.

The notebook introduces itself as an intuitive, hands-on walk-through of flow matching and score matching. Everything runs on 2D toy distributions; for the Problem 3.1 training cell, the notebook says to expect about a minute.

This post doesn't reproduce the solutions. It explains what each problem tests, where it maps to the notes, and how to check yourself against the official answers.

## Course video sources
Rechecked against the live official course page on 2026-10-10: the public page lists lecture recordings only and no recording dedicated to this article (the lab is provided as Colab notebooks and GitHub solutions).

Course and recording entries:

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

Checked: 2026-10-10.

## Before you start: three things

**1. Get the notebook.** The course site links Lab 2 through Google Drive, and its instructions say to download the `.ipynb` from GitHub and open it in Jupyter or Colab. This post uses the GitHub version because the solutions live in the same repo.

**2. Apply the 1/11/26 fix.** The newest entry in the README changelog reads:

> 1/11/26: Lab 2: Fix "doubly stochastic" diffusion coefficient bug in `ConditionalVectorFieldSDE` and `LangevinFlowSDE`

Here's the problem. `EulerMaruyamaSimulator.step`, which you wrote in Lab 1, already multiplies by `torch.randn_like(xt)`, so an SDE's `diffusion_coefficient` should return only σ. If it multiplies by `randn_like` again, the noise becomes a product of two Gaussians: "doubly stochastic".

When I checked branch 2026 on 2026-09-30, **the solutions version of both classes had been changed to `return self.sigma`, but the student version, `labs/lab_two.ipynb`, still had `return self.sigma * torch.randn_like(x)`**. Before you start, make the student version match the solutions in both places:

```python
def diffusion_coefficient(self, x: torch.Tensor, t: torch.Tensor) -> torch.Tensor:
    return self.sigma
```

**3. A small trap.** In the student version, `GaussianConditionalProbabilityPath.sample_conditioning_variable` returns `p_data.sample(num_samples)`, which reads the notebook's global `p_data`. The solutions use `self.p_data`. Running cells in order works fine, but if you swap in a different data distribution to experiment, results may not be what you expect. Change it to `self.p_data` while you're there.

## Parts 0–1: tools and interface

Part 0 has no questions. It's all Lab 1 material: `ODE`, `SDE`, `EulerSimulator`, `EulerMaruyamaSimulator`, Gaussian and Gaussian-mixture distributions, and plotting helpers.

Part 1 defines the abstract class `ConditionalProbabilityPath`. A conditional path must provide four methods:

| Method | In the notes |
|---|---|
| `sample_conditioning_variable` | draw `z ~ p_data` |
| `sample_conditional_path` | sample from `p_t(x\|z)` |
| `conditional_vector_field` | `u_t(x\|z)` |
| `conditional_score` | `∇ log p_t(x\|z)` |

`sample_marginal_path` is already written: draw z, then draw x, which is the two-step sampling of eq. (12). Across the lab you implement two subclasses: a Gaussian path and a linear path.

## Part 2: four pieces of the Gaussian conditional path

The goal here is to turn a standard Gaussian `N(0, I_d)` into a 2D Gaussian mixture with 5 modes.

### Problem 2.1: α_t and β_t

Implement `__call__` for `LinearAlpha` and `SquareRootBeta`. Note that this lab uses **`α_t = t` and `β_t = √(1−t)`**, not the CondOT path from Algorithm 3 in the notes (`β_t = 1−t`). The derivative `dt` is provided.

The point is just reading the contract: `α_0 = β_1 = 0` and `α_1 = β_0 = 1`, the boundary conditions from Example 8 in the notes.

### Problem 2.2: sampling the conditional path

Implement `sample_conditional_path` to sample from `N(α_t z, β_t² I_d)`. The hint is `X = μ + σZ`. This is `x = α_t z + β_t ε` from eq. (16)/(28) of the notes.

The notebook asks you to compare your plot with the panel labeled "Ground-Truth Conditional Probability Path" in Figure 6 of the notes.

### Problem 2.3: the conditional vector field

Implement `conditional_vector_field`. The formula is given; it's eq. (20) of the notes. Use `self.alpha.dt(t)` and `self.beta.dt(t)` for the derivatives.

The next cell simulates `dX_t = u_t(X_t|z) dt` and shows every trajectory converging to the same z. That's what L2 meant by "a conditional vector field alone isn't useful": it only regenerates that one data point.

The notebook adds an important aside here. `sample_conditioning_variable` is effectively sampling from `p_data`, but isn't that what we're trying to learn? The answer: in practice it returns points from a finite training set, formally assumed to be drawn IID from `p_data`.

### Problem 2.4: the conditional score

Implement `conditional_score` with `(α_t z − x) / β_t²`, eq. (40) from Example 15 of the notes.

The next cell simulates the conditional SDE with the SDE extension trick (Theorem 17 in the notes) and checks that its samples match samples drawn directly from the conditional path.

The notebook explains a numerical issue: with a larger σ, strange things happen. As t→1, `β_t → 0`, so the drift term `σ² (α_t z − X_t) / β_t²` blows up, and the blow-up scales with σ squared. A finite number of simulation steps can't track it. The usual workaround is `σ_t = β_t`, so the noise level shrinks and cancels the explosion.

## Part 3: two trainers and one conversion formula

### Problem 3.1: flow matching

Implement `ConditionalFlowMatchingTrainer.get_train_loss`, a Monte Carlo estimate of the CFM loss in eq. (26). The hints spell out every step:

1. `self.path.p_data.sample(batch_size)` for z
2. `torch.rand(batch_size, 1)` for t
3. `self.path.sample_conditional_path(z, t)` for x
4. the mean-squared error between `self.model(x, t)` and `self.path.conditional_vector_field(x, z, t)`

This is Algorithm 3 from the notes, only with the `β_t = √(1−t)` path. The notebook uses an MLP with 4 hidden layers of 64 units, trained for 5000 steps at batch size 1000.

The notebook warns in bold: **the loss should converge, but not to zero.** That lines up with Theorem 12 from L2. The CFM loss differs from the FM loss by a constant, so even a network that learns the marginal vector field perfectly won't reach zero CFM loss.

After training, wrap `flow_model` as an ODE, simulate it with `EulerSimulator`, and check that samples land on the 5 modes.

### Problem 3.2: score matching

Implement `ConditionalScoreMatchingTrainer.get_train_loss`, the conditional score matching loss from §4.3 of the notes. The structure is identical to 3.1. Only the target changes to `self.path.conditional_score(x, z, t)`, and the network becomes an `MLPScore`. The hint says to reuse your 2.4 implementation.

After training, `flow_model` and `score_model` go together into `LangevinFlowSDE`, which simulates

```text
dX_t = [u_t^θ(x) + (σ²/2) s_t^θ(x)] dt + σ dW_t
```

That's Theorem 17 of the notes, built from the learned vector field and the learned score. The notebook defaults to `sigma = 2.0`, with a comment warning not to set it too large or you'll hit numerical issues. **This `LangevinFlowSDE` is one of the two classes the changelog fixed**, so apply the patch first.

Once you finish 3.1 and 3.2, you'll notice the two trainers are nearly word-for-word identical. That's the code version of the L3A table row saying Theorems 12 and 22 share the same proof.

### Question 3.3: deriving the score from the vector field

Implement `ScoreFromVectorField.forward`. Instead of training again, convert the vector field learned in 3.1 into a score. The basis is Proposition 1 in the notes.

The notebook derives the formula for you:

```text
s̃_t^θ(x) = (α_t u_t^θ(x) − α̇_t x) / (β_t² α̇_t − α_t β̇_t β_t)
```

Watch one notation difference. The notebook writes `u = a_t x + b_t ∇log p_t` and calls `α̇_t/α_t` by the name `a_t`. Proposition 1 in the notes writes `u = a_t ∇log p_t + b_t x`, so the names `a_t` and `b_t` are swapped. The coefficients agree; only the labels trade places, so don't let that trip you up when cross-checking.

With `α_t = t` and `β_t = √(1−t)`, the denominator is `1 − t/2`, which is 0 at t=1, so the plots use `t = 1 − ε` instead.

The next cells plot both scores as vector fields: the top row learned by score matching in 3.2, the bottom row converted from the vector field. The notebook says the two will probably look a bit different but should point in roughly the same direction, especially near the modes.

## Part 4: a linear path between any two distributions

The last part switches paths. Fix a data point z and define the interpolant

```text
X_t = (1 − t) X_0 + t z,     X_0 ~ p_simple
```

It satisfies `p_0(x|z) = p_simple` and `p_1(x|z) = δ_z`, and its conditional vector field is `(z − x)/(1 − t)`, defined for t in [0,1).

The notebook points out two differences from the Gaussian path:

1. **No closed-form conditional score.** `conditional_score` is deliberately left out; the solutions version simply raises an exception.
2. **`p_simple` doesn't have to be Gaussian.** That's the whole point of Part 4.

### Problem 4.1: implement the linear path

Implement `sample_conditional_path` and `conditional_vector_field` for `LinearConditionalProbabilityPath`. You check correctness by seeing whether three rows of plots agree: the conditional path from `sample_conditional_path`, the conditional path simulated from `conditional_vector_field`, and the marginal path from `sample_marginal_path`.

### Part 4.2: training on a checkerboard

Use the same `ConditionalFlowMatchingTrainer` to flow from a standard Gaussian to a 4×4 checkerboard (`CheckerboardSampleable`). The notebook repeats the reminder: the loss converges, but not necessarily to zero.

### Problem 4.3: from rings to a checkerboard

Swap `p_simple` for `CirclesSampleable` and keep the checkerboard as the target. The model grows to 4 layers of 100 units, trained for 20000 steps. The question is a single line: play with different choices of `p_simple` and `p_data`. What do you observe?

This matches a slide in [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf): the method taught here converts arbitrary distributions into arbitrary distributions, with examples like silent video to video with audio, and low-resolution images to high-resolution images.

## Checking against the solutions

Open [`solutions/lab_two_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_two_complete.ipynb) and compare problem by problem. For readers outside MIT, this is the only feedback available: the course site's submission path is to export a PDF and submit to Gradescope through Canvas.

Some self-checks:

| Problem | What correct looks like |
|---|---|
| 2.2 | The conditional path plot matches the ground truth in Figure 6 of the notes |
| 2.3 | Every ODE trajectory converges to the red star z |
| 2.4 | SDE samples match the directly sampled conditional path (keep σ modest) |
| 3.1, 3.2 | Loss converges to a nonzero value; samples land on the 5 modes |
| 3.3 | The two rows of score fields point roughly the same way, most clearly near the modes |
| 4.1 | The three rows of plots agree |

## After this post you should be able to

- Name the four pieces a conditional path needs in code.
- Explain why the flow matching and score matching trainers are nearly identical, and why neither loss reaches zero.
- Convert a learned vector field into a score with Proposition 1, and say where the denominator hits zero.
- State what the linear path gains and loses compared with the Gaussian path.

**Something to do tonight**: download `labs/lab_two.ipynb`, change `diffusion_coefficient` in `ConditionalVectorFieldSDE` and `LangevinFlowSDE` to `return self.sigma`, then finish Problems 2.1–2.3. Together they are only a few lines, and they confirm you understand every Gaussian-path formula.

## Further reading

- Where the formulas come from: [L2: Flow Matching](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) (Problems 2.1–2.3, 3.1, Part 4) and [L3A: Score Functions and Score Matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en) (Problems 2.4, 3.2, 3.3)
- Where the simulators come from: [Lab 1: Simulating ODEs and SDEs](/posts/ai/2026-09-30-mit-6s184-lab-01-odes-sdes-en)
- A flow matching assignment from another course: [Berkeley CS189 HW2: regression, GMMs, and flow matching](/posts/learning/2026-09-29-berkeley-cs189-sp26-hw2-regression-gmm-flow-matching-en)

Series navigation: previous, [L3A: Score Functions, SDE Sampling, and Score Matching](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en) | next, [L3B: Guidance and Classifier-Free Guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en) | [back to the series overview](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Live-checked the official public page: it still lists lecture recordings only, with none dedicated to this article, so the status is now “Checked: no corresponding recording link listed on the public official page.”

## References

- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — Labs section: workflow, submission, Lab 2 link, solutions link
- [eje24/iap-diffusion-labs (branch 2026)](https://github.com/eje24/iap-diffusion-labs/tree/2026) — README changelog (1/11/26 fix)
- [`labs/lab_two.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_two.ipynb) — student version
- [`solutions/lab_two_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_two_complete.ipynb) — official solutions
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models (lecture notes PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — Example 8, eq. (16), (20), (26), (40), Algorithms 3–4, Proposition 1, Theorem 17, Figure 6
- [Slides 3 (20260123_Lecture_03.pdf)](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) — bridging between arbitrary distributions
