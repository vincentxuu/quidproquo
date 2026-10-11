---
title: "Harvard CS181 HW6 (Part 2): HMMs and the Kalman Filter"
date: 2026-09-29
category: tech
tags: [harvard, cs181, hidden-markov-model, kalman-filter, markov-model, homework]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 12
type: guide
tldr: "HW6 Problem 1 (15 pts) swaps the discrete HMM from lecture for a continuous state: the state drifts by Gaussian noise each step, each observation adds more noise, and you derive the mean and variance of the filtering distribution p(zₜ | x₀…xₜ). That is a one-dimensional Kalman filter. The solution is two moves, predict with the transition and then correct with the observation, and the problem hands you both Gaussian identities you need."
description: "A guide to Harvard CS1810 Spring 2026 HW6 Problem 1: starting from forward-backward in Lecture 20 and Section 9, how filtering in a discrete HMM becomes a 1-D Kalman filter, a part-by-part walk through the predict and correct steps, common sticking points, and section exercises to try afterwards."
draft: false
glossary:
  - term: "filtering"
    aliases: ["filtration"]
    definition: "Estimating the current hidden state from the observations seen so far, i.e. p(zₜ | x₁…xₜ). Smoothing differs by using the whole sequence, including future observations."
    context: "HW6 Problem 1 asks for the filtering distribution in the continuous-state case."
  - term: "Kalman filter"
    definition: "HMM filtering when both the state dynamics and the observations are linear with Gaussian noise. Because a product of Gaussians and a convolution of Gaussians are both Gaussian, each step only updates one mean and one variance."
    context: "HW6 Problem 1 covers the 1-D case with an identity transition."
---

> 🌏 [中文版](/posts/tech/2026-09-29-harvard-cs181-hw6-hmm-kalman)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> ⚠️ **Version and access**: Based on [CS1810 Spring 2026 HW6](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6) (`hw6_release.tex/pdf/ipynb`, due 2026-05-01), the [Section 9 notes](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf), and the [2026 Lecture 20 HMM slides](https://drive.google.com/file/d/1XDSCd8VexNwnGeVoThc73RSYU-sez7mc/view), all opened on 2026-09-29. The Google Drive links to the lecture slides sit inside the topic cells of the [official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ); the CSV export drops them, the xlsx export keeps them. The course as a whole is **A3**, but there are no public recording links listed for the corresponding lectures, no homework solutions, and Gradescope requires enrollment. Neither the 2026 slides nor Section 9 **mention the Kalman filter**; the continuous-state material appears only in the homework.

This is part 12 of the [Harvard CS181 weekly guide](/en/posts/tech/2026-08-27-harvard-cs181-overview-en). The previous part, [HW6 (Part 1)](/en/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding-en), covered autoregressive models, which model the observed sequence directly. This part takes the other view of sequences: an unseen state is moving behind the observations.

## Course video sources

Checked the official CS1810 Spring 2026 schedule and syllabus. This guide uses homework, section, or exam materials; the corresponding entries do not list a public lecture video. Slides and section materials are provided. No public listing does not mean that a recording never existed.

Official sources:

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

Checked on 2026-10-10.

## Where HW6 sits in the term

Per the [2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ), Week 11 covered Autoregressive Models on Tuesday (April 7) and Hidden Markov Models on Thursday (April 9); the following Tuesday's Section 9 was "Autoregressive Models and HMMs". HW6 was released on April 17, labeled "AR, HMMS, MDPs, RL" on the schedule, and was due May 1.

The [HW6 problem set](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.tex) is titled "Sequential Models and Decision Making" and has five problems. The problem numbers don't follow lecture order, so this series splits them into four parts in lecture order:

| Part | Problem | Points |
|---|---|---|
| [HW6 (Part 1)](/en/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding-en) | Problem 4 Autoregressive Models | 20 |
| This post | Problem 1 Hidden Markov Models | 15 |
| [HW6 (Part 3)](/en/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning-en) | Problem 2 Policy and Value Iteration | 15 |
| [HW6 (Part 4)](/en/posts/tech/2026-09-29-harvard-cs181-hw6-q-learning-ethics-en) | Problem 3 Reinforcement Learning, Problem 5 Embedded Ethics | 20 + 10 |

## What the problem asks: you can't see the state, only noisy readings

The model in Problem 1 is two lines. The hidden state gets a Gaussian nudge every step, and the observation is the state plus a second Gaussian noise term:

```text
z_{t+1} = z_t + ε_t      ε_t ~ N(0, σ_ε²)
x_t     = z_t + γ_t      γ_t ~ N(0, σ_γ²)
z_0 ~ N(μ_p, σ_p²)
```

Picture something drifting randomly along a line while all you have is an imprecise sensor. Each reading `x_t` is not the true position `z_t`, yet you want to know where it probably is right now and how sure you can be. That is exactly what you derive: `p(z_t | x_0, …, x_t)` is a normal distribution, and you find its mean `μ_t` and variance `σ_t²`.

The problem calls this model a one-dimensional Kalman filter: a **continuous-state HMM**.

## Starting from the discrete HMM: the sum is what changes

[Lecture 20](https://drive.google.com/file/d/1XDSCd8VexNwnGeVoThc73RSYU-sez7mc/view) and [Section 9](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf) cover the discrete HMM, where the state takes one of K values and transition and emission matrices describe the model. Both use the same dynamic program:

- **Forward message** `α_t(z_t) = p(x_1…x_t, z_t)`: the probability of having seen the first t observations and being in state `z_t` now. The recursion weights and sums the transitions over every previous state, then multiplies by this step's emission probability.
- **Backward message** `β_t(z_t) = p(x_{t+1}…x_T | z_t)`: how well the future observations fit if you are in `z_t` now.
- Section 9's list states that filtering is proportional to `α_t`, and smoothing to `α_t · β_t`.

A Kalman filter does exactly the same thing with a real-valued state:

| | Discrete HMM (lecture) | 1-D Kalman (HW6 P1) |
|---|---|---|
| State | one of K values | a real number |
| Transition | matrix `T[i][j]` | `N(z_t; z_{t-1}, σ_ε²)` |
| Emission | matrix `π[k][l]` | `N(x_t; z_t, σ_γ²)` |
| Over the previous state | sum Σ | integral ∫ |
| Stored per step | K numbers | a mean and a variance |

The last row is the whole point: a Gaussian stays Gaussian under both operations, so however many steps you take, two numbers describe your belief.

## Part by part

### (a) Relation to α and β

The question asks how `p(z_t | x_0…x_t)` relates to `α_t` and `β_t` from forward-backward, and what the operation is called. Go back to the list of inference tasks in Section 9. One hint: the conditioning stops at `x_t` and uses no future observations, so ask whether `β` is needed here.

### (b)–(d) Predict, then correct

The problem already gives the decomposition:

```text
p(z_t | x_0…x_t) ∝ p(x_t | z_t) · p(z_t | x_0…x_{t-1})
                    └ correct ┘   └───── predict ─────┘
```

- **(b)** is the emission model itself; read it off the second line of the model.
- **(c)** is the predict step. Given last step's belief `N(μ_{t-1}, σ_{t-1}²)`, multiply by the transition and integrate `z_{t-1}` out. The problem's Hint 2 is the convolution-of-two-Gaussians identity; plug in. Intuitively, one step of random drift leaves the mean where it was but makes you less certain.
- **(d)** is the correct step: multiply (b) by (c). Hint 1 tells you to rewrite `N(x_t; z_t, σ_γ²)` as `N(z_t; x_t, σ_γ²)`, so both factors become Gaussians in `z_t` and Hint 2's product identity applies.

<details>
<summary>Mechanism: what Hint 2's product identity says</summary>

The identity the problem gives is:

```text
N(x; μ_a, σ_a²) · N(x; μ_b, σ_b²)
  ∝ N(x;  σ_b²/(σ_a²+σ_b²) · μ_a + σ_a²/(σ_a²+σ_b²) · μ_b,
          (1/σ_a² + 1/σ_b²)^(-1) )
```

Two ways to read it:

1. The new mean is a weighted average of the two means, and each weight is proportional to the **other** side's variance. Whichever side has the smaller variance (is more certain) gets the larger weight.
2. The new variance is the reciprocal of the summed precisions (inverse variances), so it is always smaller than either input. Combining two sources of information can only make you more certain.

In (d), one Gaussian comes from the predict step and the other from the current observation. Substitute (c)'s result for one and the rewritten emission for the other, and you have `μ_t` and `σ_t²`.
</details>

### (2) Interpret μ_t in a sentence or two

You explain how `μ_t` blends past observations with the current one. Think about two extremes: when the sensor is nearly noiseless (`σ_γ²` small), which way does `μ_t` lean? When the sensor is very noisy and the state barely moves, which way? Then ask which quantity carries all the past observations into `μ_t`.

## Common sticking points

- **Different time indexing**: the homework starts at `z_0, x_0`; Section 9 starts at `z_1, x_1`; the 2026 slides use both. Align them before comparing formulas.
- **μ_ε and μ_γ in the figure**: the graphical model draws parameter nodes `μ_ε` and `μ_γ`, but the text defines both noise terms with mean 0. Follow the text in your derivation.
- **The second argument of N(·) is a variance**: both hints write `N(x; μ, σ²)`. Plug in a standard deviation where a variance belongs and your answer is off by a square.
- **The proportionality in (d)**: the product identity only holds up to a constant. You report the mean and variance of the normal; you don't need the normalizer.

## What to practice afterwards

- [Section 9](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf) Exercise 3.3: given the parameters of a weather HMM, use Viterbi to find the most likely state path. The solution is in [sec09_soln.pdf](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09_soln.pdf).
- Section 9 Exercise 3.2: estimating HMM parameters from counts when the states are observed (a special case of the M-step).
- The Concept Check at the end of the [Lecture 20 slides](https://drive.google.com/file/d/1XDSCd8VexNwnGeVoThc73RSYU-sez7mc/view): a three-state healthy / mild / severe disease-progression HMM.
- For the classic reference, the course [Resources page](https://harvard-ml-courses.github.io/cs181-web/resources) lists [Rabiner's 1989 HMM tutorial](https://www.cs.ubc.ca/~murphyk/Bayes/rabiner.pdf).

The 2024 term's [Lecture 19 scribe notes](https://harvard-ml-courses.github.io/cs181-web/static/lec19/19-scribe-notes.pdf) (header dated 4/4/24) also cover HMMs and forward-backward and work as a supplement. They are 2024 notes, not 2026 lecture material.

## Further reading

Posts on this site that approach the same ideas from another angle; they don't replace this one:

- [LQR, DDP, and LQG: From Linear Control to Uncertainty](/en/posts/ai/2026-08-22-stanford-cs229-2026-notes-chapter-20-lqr-ddp-lqg-en) (CS229 notes; the multi-dimensional Kalman filter's role in control)
- [CS221 Lecture 14: Bayesian Networks III: From Counts and Smoothing to EM](/en/posts/ai/2026-08-22-stanford-cs221-lecture-14-bayes-learning-em-en)

## Next

In an HMM the state just evolves on its own. The next part, [HW6 (Part 3): Policy Iteration and Value Iteration for MDPs](/en/posts/tech/2026-09-29-harvard-cs181-hw6-mdp-planning-en), lets an agent choose actions, so transitions start to depend on what you do. The 2026 [Lecture 21 slides](https://drive.google.com/file/d/1RGWONNePmR07McdS_6H-vy_QWPSVevKG/view) open with exactly this contrast: the HMM's `p(z_{t+1} | z_t)` becomes the MDP's `p(s_{t+1} | s_t, a_t)`.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-read the official schedule and syllabus; they still list no public lecture video for this topic.

## References

- [CS1810 Spring 2026 HW6 problem set (hw6_release.tex)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw6/hw6_release.tex)
- [CS1810 Spring 2026 HW6 folder (PDF, notebook)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw6)
- [CS1810 2026 official schedule (Google Sheet)](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ)
- [CS1810 2026 Lecture 20: Hidden Markov Models slides (04/09/2026)](https://drive.google.com/file/d/1XDSCd8VexNwnGeVoThc73RSYU-sez7mc/view)
- [Section 9: Autoregressive Models and Hidden Markov Models](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09.pdf) ([solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec09/sec09_soln.pdf))
- [CS181 2024 Lecture 19 scribe notes (HMMs)](https://harvard-ml-courses.github.io/cs181-web/static/lec19/19-scribe-notes.pdf)
- [CS181 Resources page](https://harvard-ml-courses.github.io/cs181-web/resources)
- [Rabiner, 1989. A Tutorial on Hidden Markov Models and Selected Applications in Speech Recognition](https://www.cs.ubc.ca/~murphyk/Bayes/rabiner.pdf)
