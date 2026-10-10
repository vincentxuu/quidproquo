---
title: "MIT 6.S184 L5: Discrete Diffusion, Generating Language with CTMCs"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai, language-model]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 9
tldr: "Text is a sequence of discrete tokens. There is no direction to move in, so ODEs and SDEs do not exist. Lecture 5 carries the recipe from Lectures 1–4 over unchanged and swaps only the underlying stochastic process: vector fields become rate matrices, ODEs become continuous-time Markov chains (CTMCs), and the continuity equation becomes the Kolmogorov forward equation. With the factorized mixture path, the marginal rate matrix has exactly one unknown: the probability of each position's original token given the noisy sequence. Training a discrete diffusion model therefore reduces to per-position classification with a cross-entropy loss. Make the noise all [mask] tokens and you get a masked diffusion language model."
description: "A guide to Lecture 5 of MIT 6.S184 (IAP 2026), following notes §7 (marked Optional, no lab), Slides 5, and the recording: CTMCs and rate matrices (Theorem 33, Example 34), factorized CTMCs and Algorithm 7, the factorized mixture path (Example 35), the discrete marginalization trick (Theorem 36), the Kolmogorov forward equation (Proposition 2), Example 37, Theorem 38 and the discrete flow matching loss, masked diffusion language models (Example 39), Algorithm 8, and Remark 40 on generator matching."
draft: false
glossary:
  - term: "rate matrix"
    aliases: ["Q_t"]
    definition: "The object that replaces the vector field in a CTMC. Q_t(y|x) is the instantaneous rate of jumping from state x to state y at time t: off-diagonal entries are non-negative, and each diagonal entry is minus the sum of the outgoing rates."
    context: "MIT 6.S184 notes §7.1, eq. (84)–(87)."
  - term: "CTMC"
    aliases: ["continuous-time Markov chain"]
    definition: "A memoryless stochastic process on a discrete state space in continuous time. The future depends only on the current state, and the rate matrix fully determines the process (notes Theorem 33)."
    context: "The MIT 6.S184 notes treat CTMCs as the discrete analogue of SDEs."
  - term: "factorized mixture path"
    definition: "The most common probability path for discrete diffusion: each position independently keeps its data token with probability κ_t and is replaced by a noise token with probability 1−κ_t, where κ_t increases from 0 to 1."
    context: "MIT 6.S184 notes Example 35; with [mask] as the noise, it becomes a masked diffusion language model (Example 39)."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion)

> **Version note**: This post follows §7 (pp.54–66) of the [lecture notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) for [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) IAP 2026, [Slides 5](https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf), and the [Lecture 5 recording](https://www.youtube.com/watch?v=d0kmyEJN2hI) (1 h 21 min). Theorem, example, algorithm, and equation numbers follow the notes. Access level A3: the notes, slides, recordings, labs, and official solutions are all public. This lecture, however, has **no matching lab**, and §1.2 of the notes marks §7 as Optional. Checked on 2026-09-30.

**Series position**: Previous: [Lab 3: From DiT and VAE to latent diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en) | This is the last post in the series | [Series overview](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)

Every data type in Lectures 1–4 was a vector. An image is a point in `R^d`, and a vector field tells each point which way to move. Text does not work like that. A sentence is a sequence of tokens. There is no halfway point between "cat" and "dog", and no such thing as "a small step toward dog."

The notes open §7 bluntly: a discrete state space has **no mathematical diffusion process**, because SDEs do not exist there. What the machine learning literature calls a "discrete diffusion model" takes the learning principles of flow matching and moves them onto a different stochastic process: the **continuous-time Markov chain (CTMC)**. That is why Slides 5 is titled "Discrete diffusion models and discrete flow matching."

The good news: the recipe from [Lecture 2](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en) stays exactly the same. The three steps listed at the start of §7.2 are the flow matching steps: (1) build a probability path from noise to data; (2) derive conditional and marginal training targets; (3) learn the marginal target without simulation. Only the objects inside each step change.

The time convention matches the rest of the series: t=0 is noise and t=1 is data.

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=d0kmyEJN2hI
title: Lecture 5 recording: Discrete Diffusion Models (2026)
```

Original videos: [Lecture 5 recording: Discrete Diffusion Models (2026)](https://www.youtube.com/watch?v=d0kmyEJN2hI)

Course and recording entries:

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## Start with the map: every continuous object has a discrete twin

Slides 5 takes the six-cell table of continuous flow matching (conditional/marginal × probability path/vector field/loss) and swaps in the discrete versions. The table below pairs the numbered results from the notes. Each section after it fills in one row:

| Continuous (Lectures 1–3) | Discrete (Lecture 5) |
|---|---|
| State space `R^d` | `S = V^d`: token sequences of length d over a vocabulary of size V |
| Vector field `u_t(x)` | Rate matrix `Q_t(y\|x)` (eq. 84–86) |
| ODE / SDE | CTMC (eq. 87) |
| Existence and uniqueness (Theorem 3) | CTMC existence and uniqueness (Theorem 33) |
| Euler sampling (Algorithm 1) | Per-token Euler sampling (eq. 88, Algorithm 7) |
| Gaussian probability path (Example 8) | Factorized mixture path (Example 35) |
| Marginalization trick (Theorem 9) | Discrete marginalization trick (Theorem 36) |
| Continuity equation (Theorem 11) | Kolmogorov forward equation (Proposition 2) |
| CFM loss: regression | Discrete flow matching loss: classification |

## CTMCs: replace "which way" with "how fast to jump"

### State space and the Markov property

The notes first fix the state space. The vocabulary is `V = {v_1, …, v_V}`, the sequence length is d, and the set of all possible sentences is `S = V^d`. For language, V can be letters or tokens. The notes also use DNA as an example, where V is the four bases.

`X_t` is a random trajectory that jumps around S over time. The notes require it to be a **Markov process**: the future depends only on the present, and the past is irrelevant. The notes also point out that ODEs and SDEs are Markov processes too, just not on discrete spaces. A Markov process with discrete states and continuous time is a CTMC.

### Rate matrices: the discrete vector field

In continuous space, a vector field says which direction to move. In discrete space you can only **jump**, so what you describe is how fast you jump from x to y. That is the rate matrix `Q_t(y|x)`, and it has two conditions:

1. **Rates of jumping elsewhere are non-negative**: `Q_t(y|x) ≥ 0` whenever y ≠ x.
2. **The rate of staying equals minus the total outgoing rate**: `Q_t(x|x) = −Σ_{y≠x} Q_t(y|x)`. As the notes put it, you either stay or leave; there is no third option.

So every diagonal entry of a rate matrix is ≤ 0 and every off-diagonal entry is ≥ 0.

A CTMC "follows" a rate matrix when the derivative of its transition probabilities at h=0 equals the rate matrix, eq. (87). This is the discrete version of a differential equation.

<details>
<summary>Notes eq. (84)–(87) and Theorem 33</summary>

```text
Q : S × S × [0,1] → R,  (x, y, t) ↦ Q_t(y|x)                              (84)
Q_t(y|x) ≥ 0            whenever x ≠ y                                    (85)
Q_t(x|x) = −Σ_{y≠x} Q_t(y|x)   for all x                                  (86)

d/dh p_{t+h|t}(X_{t+h}=y | X_t=x) |_{h=0} = Q_t(y|x)   for all x, y ∈ S   (87)
```

The notes first check the other direction: the derivative at h=0 of any CTMC's transition probabilities automatically satisfies (85)–(86). At h=0 no time has passed, so `p_{t|t}(y|x)=0` for y≠x and the derivative can only be non-negative. Probabilities summing to 1 then gives (86).

**Theorem 33 (CTMC existence and uniqueness)**: For any rate matrix `Q_t` that is bounded and continuous in time, there is a unique set of transition probabilities satisfying eq. (87). The proof is in Appendix C of the notes (p.74).

For machine learning it plays the same role as Theorem 3 in Lecture 1: you can build a rate matrix with a neural network and safely assume it corresponds to exactly one CTMC.

</details>

### A worked example: two states flipping back and forth

**Example 34** has only two states, a and b, with a constant jump rate λ in both directions. The transition probabilities have a closed form. After time h, the probability of staying put is `(1 + e^{−2λh})/2` and the probability of having switched is `(1 − e^{−2λh})/2`.

The intuition is clean: `e^{−2λh}` is the memory of the starting state decaying. As h goes to infinity both probabilities approach 1/2, and the chain forgets where it started. The larger λ is, the faster it forgets. Slides 5 uses the same example to show that differentiating the transition probabilities yields the evolution equation.

### Simulation: a discrete Euler step

Most CTMCs have no closed-form transition probabilities; all you have is the rate matrix. But eq. (87) says transition probabilities are approximately linear over short times, so:

**Next-step distribution ≈ indicator of "stay here" + h times the rate matrix**, eq. (88).

The notes say that for small enough h this is a valid probability distribution, and drawing one category from it is one simulation step. It is the discrete version of the Euler method from [Lecture 1](/posts/ai/2026-09-30-mit-6s184-lecture-01-flow-diffusion-models-en).

<details>
<summary>Notes eq. (88)</summary>

```text
p_{t+h|t}(X_{t+h}=y | X_t=x) = 1_{y=x} + h Q_t(y|x) + R_t(h)      (R_t(h) negligible for small h)
X_{t+h} ~ p̃_{t+h|t}(·|x) = (1_{y=x} + h Q_t(y|x))_{y∈S}                    (88)
```

</details>

## CTMC models: why they must be factorized

A **CTMC model** (a discrete diffusion model) has two parts: an initial distribution `p_init` and a neural network `Q_t^θ`. Given the current state x, the network must output **an entire column** of the rate matrix, `{Q_t^θ(y|x)}_{y∈S}`, because sampling with eq. (88) needs every y.

The problem is immediate: `|S| = V^d`. With tens of thousands of tokens in the vocabulary and sequences hundreds of tokens long, that column cannot be stored on any computer.

The fix is a sparsity constraint: **change only one position at a time**. Sequences that differ from x in at most one token are its neighbors `N(x)`, and all non-neighbor rates are zero. The network then outputs one rate per position j and candidate token v, for an output shape of **d × V**. That grows linearly with sequence length instead of exponentially. The notes say almost all CTMC models are factorized, and a transformer over sequence length d with output dimension V produces exactly this shape.

Slides 5 illustrates neighbors with three sequences x, y, z: x and y are neighbors, y and z are neighbors, but z and x are not, because they differ in two positions.

### Algorithm 7: every position jumps in parallel

At each sampling step, the network computes the d × V rates, and then **each position independently and in parallel** takes one Euler step. The probability of switching to v is `h·q_j(v)`; the probability of keeping the current token is one minus the sum of those.

There is an approximation here. A true factorized CTMC moves one position at a time, but parallel updates can change several positions in one step. The notes say this per-token approximation agrees with the full CTMC Euler step to first order in h, and the probability of simultaneous updates to multiple positions is only O(h²).

<details>
<summary>Notes Algorithm 7: sampling from a factorized CTMC model</summary>

```text
Require: factorized rate network Q_t^θ, initial distribution p_init, number of steps n
1: t ← 0, h ← 1/n
2: draw X_0 ~ p_init, X_0 = (X_0^(1), …, X_0^(d)) ∈ V^d
3: for i = 1, …, n:
4:     compute factorized jump rates {q_j(v)}_{j=1..d, v∈V} ← Q_t^θ(·|X_t)
5:     for j = 1, …, d (in parallel):
6:         x ← X_t^(j)
7:         p̃_{j,t}(v|x) = h·q_j(v)                 if v ≠ x
                        = 1 − h·Σ_{v'≠x} q_j(v')   if v = x
8:         X_{t+h}^(j) ~ Categorical(p̃_{j,t}(·|x))
10:    t ← t + h
12: return X_1
```

</details>

## Training: the same flow matching recipe

The goal is identical to the continuous case: train `Q_t^θ` so that a CTMC started at `X_0 ~ p_init` reaches `X_1 ~ p_data` at t=1. The only difference is that `p_data` is now a probability mass function on S. The notes' example is "all texts on the world wide web."

### Probability paths: fading, not transporting

A **discrete conditional probability path** `p_t(x|z)` must equal `p_init` at t=0 (independent of z) and put all its mass on z at t=1 (`δ_z`). The marginal path is again an average over data, `p_t(x) = Σ_z p_t(x|z) p_data(z)`, so `p_0 = p_init` and `p_1 = p_data`, eq. (89).

The most common concrete path is the **factorized mixture path** (Example 35). Pick a scheduler `κ_t` that increases monotonically from `κ_0=0` to `κ_1=1`, then **flip an independent coin at each position**:

- with probability `κ_t`, keep the data token `z_j`;
- with probability `1−κ_t`, replace it with a noise token drawn from `p_init`.

At t=0 every token is destroyed; at t=1 none are. The notes compare this to the Gaussian path from [Lecture 2](/posts/ai/2026-09-30-mit-6s184-lecture-02-flow-matching-en): in both, a scheduler controls how fast information is destroyed. The difference is fundamental, though. A Gaussian path **moves probability mass through space**. A mixture path has no direction to move in; it simply **fades one distribution out and another in**. Slides 5 says the probability is "teleported," and Figure 19 of the notes shows this with a chessboard pattern.

<details>
<summary>Notes Example 35: the factorized mixture path</summary>

```text
p_init(x) = Π_{j=1}^d p_init^(j)(x_j)
0 ≤ κ_t ≤ 1,  κ_0 = 0,  κ_1 = 1,  κ̇_t ≥ 0

p_t(x|z) = Π_{j=1}^d [ (1 − κ_t) p_init^(j)(x_j) + κ_t δ_{z_j}(x_j) ]

Equivalent sampling procedure:
m_j ~ Bernoulli(κ_t),  ξ_j ~ p_init^(j)
x_j = m_j z_j + (1 − m_j) ξ_j,   j = 1, …, d
```

</details>

### The marginal rate matrix: the same marginalization trick

A **conditional rate matrix** `Q_t^z` is a rate matrix whose CTMC follows the conditional path `p_t(·|z)`. It is the counterpart of the conditional vector field.

**Theorem 36 (discrete marginalization trick)** says: average the conditional rate matrices, weighted by the posterior `p_{1|t}(z|x)`, and you get a marginal rate matrix whose CTMC follows the marginal path and ends at `p_data`. It is the same statement as Theorem 9 in Lecture 2, with vector fields swapped for rate matrices. `p_{1|t}(z|x)` is the probability that a noisy state x at time t came from data point z.

<details>
<summary>Notes Theorem 36, eq. (90)</summary>

```text
Q_t(y|x) = Σ_{z∈S} Q_t^z(y|x) · p_t(x|z) p_data(z) / p_t(x)
         = Σ_{z∈S} Q_t^z(y|x) · p_{1|t}(z|x),
where p_{1|t}(z|x) := p_t(x|z) p_data(z) / p_t(x)                           (90)

Q_t is a valid rate matrix, and: X_0 ~ p_init, X_t CTMC of Q_t ⇒ X_t ~ p_t
```

</details>

### The Kolmogorov forward equation: conservation of probability, discretely

To prove Theorem 36, the notes need a fundamental equation for CTMCs: the **Kolmogorov forward equation (KFE)**, Proposition 2. Slides 5 calls it the "discrete analogue to the continuity equation."

The intuition fits in one sentence: **the rate of change of a state's probability equals its net inflow**. Each state y sends its probability `p_t(y)` to x at rate `Q_t(x|y)`. Summing over all sources gives the rate of change of `p_t(x)`; the y=x term is negative and represents outflow. Proposition 2 says a CTMC has marginals `p_t` **if and only if** the KFE holds.

With the KFE in hand, proving Theorem 36 is just algebra: differentiate the marginal path, apply the KFE of each conditional path, multiply and divide by `p_t(y)`, and the marginal rate matrix appears.

<details>
<summary>Notes Proposition 2 and the proof outline</summary>

```text
d/dt p_t(x) = Σ_{y∈S} Q_t(x|y) p_t(y)
```

**Necessity**: if `X_t ~ p_t`, write `p_{t+h}(x)` as `Σ_y p_{t+h|t}(x|y) p_t(y)`, differentiate in h at 0, swap sum and derivative, and apply eq. (87).

**Sufficiency**: in matrix form the KFE reads `d/dt p_t = Q_t p_t`, a linear ODE on `R^S` with its initial condition fixed by `p_0`. By Theorem 3 from Lecture 1 (uniqueness of ODE solutions), any `q_t` satisfying the same equation equals `p_t`.

**Proof of Theorem 36** (notes p.62):

```text
d/dt p_t(x) = Σ_z d/dt p_t(x|z) p_data(z)
            = Σ_z [Σ_y Q_t^z(x|y) p_t(y|z)] p_data(z)                 (KFE of the conditional path)
            = Σ_y p_t(y) [Σ_z Q_t^z(x|y) p_t(y|z) p_data(z) / p_t(y)]
            = Σ_y p_t(y) Q_t(x|y)
```

</details>

### What the conditional rate matrix looks like

**Example 37** gives the conditional rate matrix for the factorized mixture path. It is simple enough to state in one sentence: **if position j is not yet the correct token `z_j`, jump to `z_j` at rate `κ̇_t/(1−κ_t)`; if it already is, stay.** It never jumps to any other token.

Slides 5 adds a warning on the same page: `1−κ_t` goes to 0 at t=1, so **the rates explode at t=1**. That makes intuitive sense. Time is running out, and any token not yet in place has to jump right away.

<details>
<summary>Notes Example 37</summary>

```text
Q_t^z(v_i, j | x_j) = κ̇_t / (1 − κ_t) · (δ_{z_j}(v_i) − δ_{x_j}(v_i))

                    = κ̇_t / (1 − κ_t) ×   0   if x_j = z_j
                                          1   if v_i = z_j, x_j ≠ z_j
                                          0   if v_i ≠ z_j, x_j ≠ z_j
                                         −1   if v_i = x_j, x_j ≠ z_j
```

Proof (notes pp.62–63): both the path and the rate matrix factorize completely across positions, so it suffices to handle d=1 and verify the KFE directly.

</details>

## The key step: learning the rate matrix means learning a classifier

**Theorem 38** plugs Example 37 into Theorem 36. The marginal rate matrix is also factorized, and it looks almost exactly like the conditional one, except that "the correct token `z_j`" becomes "the probability of each token being correct":

**Q_t(v_i, j | x) = κ̇_t/(1−κ_t) · ( p_{1|t}(z_j = v_i | x) − δ_{x_j}(v_i) )**

In this formula, `κ_t` is the scheduler you chose and `δ_{x_j}` is read off the current state. **The only unknown** is `p_{1|t}(z_j = v_i | x)`: given the whole noisy sequence x, the probability that position j was originally token `v_i`. Slides 5 labels this term "Only unknown!"

The notes call this result remarkable: learning the marginal rate matrix amounts to **learning a classifier for each position**. The network reads the noisy sequence x and outputs d × V logits, with a softmax per position. Any sequence-to-sequence network works; the notes name the transformer (§6.1.2, covered in [Lecture 4](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures-en)).

You train the classifier with cross-entropy, which gives the **discrete flow matching loss**:

**L_DFM(θ) = E[ −Σ_j log p^θ_{1|t}(z_j | x) ]**

The notes put the two sides next to each other. Continuous flow matching reduced generative model training to simple **regression**; discrete flow matching and discrete diffusion reduce it to simple **classification**.

<details>
<summary>Proof of Theorem 38, notes eq. (91)–(95)</summary>

```text
Q_t(y|x) = Σ_z Q_t^z(y|x) p_{1|t}(z|x)                                      (91)
```

When x and y are not neighbors, every `Q_t^z(y|x)` is 0, so the marginal rate matrix is factorized too. Then:

```text
Q_t(v_i, j|x) = Σ_z Q_t^z(v_i, j|x) p_{1|t}(z|x)                            (92)
              = Σ_z κ̇_t/(1−κ_t) (δ_{z_j}(v_i) − δ_{x_j}(v_i)) p_{1|t}(z|x)  (93)
              = κ̇_t/(1−κ_t) (Σ_z δ_{z_j}(v_i) p_{1|t}(z|x) − δ_{x_j}(v_i))  (94)
              = κ̇_t/(1−κ_t) (p_{1|t}(z_j = v_i|x) − δ_{x_j}(v_i))           (95)
```

(94) uses `Σ_z p_{1|t}(z|x) = 1`; (95) marginalizes over the other positions of z.

</details>

### Algorithm 8: the training loop

The training loop has the same shape as Algorithm 3 in Lecture 2. Only the noising and the loss change:

<details>
<summary>Notes Algorithm 8: training a factorized CTMC model (discrete diffusion)</summary>

```text
Require: sequence data z ~ p_data, per-position noise token distributions p_init^(j),
         schedule κ_t, network f_θ returning per-position logits, optimizer
for each training iteration:
    sample z ~ p_data
    sample t ~ Unif[0,1], κ ← κ_t
    sample a noisy state x ~ p_t(·|z) from the factorized mixture path:
        for j = 1..d (in parallel):
            m_j ~ Bernoulli(κ)
            ξ_j ~ p_init^(j)
            x_j ← m_j z_j + (1 − m_j) ξ_j
    ℓ_j(·) ← f_θ(x, t)_j,   p^θ_{1|t}(v|x)_j = Softmax(ℓ_j(v))
    L_DFM(θ) ← Σ_j −log p^θ_{1|t}(z_j|x)_j
    θ ← Opt.step(∇_θ L_DFM(θ))
```

After training, sample with Algorithm 7: at each step, plug the network's predicted probabilities into Theorem 38 to get the rates, then jump position by position.

</details>

**Try it**: this lecture has no lab, but every line of Algorithm 8 is short. Take any small transformer you have (for example, the attention layers you wrote in [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en)), train it on a small character-level corpus with Algorithm 8 using the [mask] noise from the next section, then sample with Algorithm 7. If it produces fluent short phrases, you have really understood this lecture.

## Masked diffusion language models

**Example 39** is the most important special case of the framework. Add a **[mask]** token to the vocabulary to mean "this position is hidden," and set the initial distribution to **a sequence that is entirely [mask]**: `p_init = δ_{[mask]^d}`.

Plugged into the factorized mixture path, noising means "replace each token with [mask] with probability `1−κ_t`," and generation means starting from a fully masked sequence and revealing positions one by one. Figure 20 in the notes traces this for "The cat sat on the mat.": at t=0.25 only "on" is revealed, at t=0.75 "cat," "the," and "mat" have appeared, and at t=1 the sentence is complete. Slides 5 shows the same process on the full opening paragraph of *One Hundred Years of Solitude*, with snapshots at t=0.3, 0.6, 0.8, and 1.0. Words do not appear left to right; they surface scattered across the paragraph and gradually fill it in.

The notes say current state-of-the-art discrete diffusion models use exactly this recipe, with neural networks (usually transformers) trained on web-scale data, citing [LLaDA2.0](https://arxiv.org/abs/2512.15745) (reference [4] in the notes).

### Versus autoregressive models

One slide in Slides 5 weighs discrete diffusion against autoregressive models. Every point carries a question mark; these are open questions, not conclusions:

- **Possible advantages**: generate multiple tokens in parallel (more speed?); generate tokens in any order (text editing?); design new probability paths (can we make ones with semantic meaning?).
- **Possible disadvantages**: no KV caching (less speed?); the model must learn to generate in any order (harder to learn?); left-to-right order itself carries meaning (is giving it up worth it?).

To see how these trade-offs play out in real diffusion LLMs, the site's [CME295 guide to diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms-en) covers the cost of parallel decoding from an LLM engineering angle.

## Why the recipe transfers so cleanly: generator matching

**Remark 40** answers the question you are probably asking by now: why do flow matching principles carry over to discrete spaces so seamlessly?

The notes' answer is that these principles were never specific to flows or CTMCs. They are **general learning principles for building generative models with Markov processes**. That idea became the [Generator Matching](https://arxiv.org/abs/2410.20587) framework (reference [19] in the notes), in which a **generator** generalizes both the vector field `u_t` and the rate matrix `Q_t`. The notes list extensions to models on smooth manifolds (geometric data), mixed state spaces (joint text and image generation), and other Markov processes such as jump processes. Slides 5 closes on the same question just before the class recap.

## After this lecture, you should be able to

- Explain why discrete spaces have no ODEs or SDEs, and how CTMCs replace them.
- State the two conditions on a rate matrix and explain why diagonal entries are non-positive.
- Explain why factorized CTMCs are necessary and why the network output is d × V.
- Name what the factorized mixture path shares with the Gaussian path (a scheduler controls information loss) and how it differs (fading in and out, not transporting).
- Use the KFE to explain why the discrete marginalization trick holds.
- Derive from Theorem 38 that training a discrete diffusion model is per-position classification with a cross-entropy loss.
- Describe the initial distribution and generation process of a masked diffusion language model.

**Something you can do tonight**: read pp.59–65 of the notes (§7.2) and redraw the continuous/discrete table from the top of this post yourself, writing the notes' number in every cell. Then work Example 34 by hand: differentiate the two-state transition probabilities in h and check that they equal the rate matrix at h=0.

## Further reading

- The engineering side of diffusion LLMs, three kinds of noise, and parallel decoding: [CME295: Diffusion LLMs](/posts/ai/2026-09-29-cme295-diffusion-llms-en)
- Continuous diffusion from the DDPM view (time runs in the opposite direction from this course): [CMU 11-785 L23: Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en)
- Starting points for discrete diffusion cited in the notes: [Campbell et al., A Continuous Time Framework for Discrete Denoising Models](https://arxiv.org/abs/2205.14987) (reference [5]) and [Gat et al., Discrete Flow Matching](https://arxiv.org/abs/2407.15595) (reference [16])
- Source of Figure 18 in the notes: [Lipman et al., Flow Matching Guide and Code](https://arxiv.org/abs/2412.06264) (reference [26])

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — Lecture 5 topics: Continuous-time Markov chains (CTMCs), Sampling from CTMC models, Training CTMC models
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models (lecture notes PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §1.2 (§7 marked Optional); §7: eq. (84)–(95), Theorem 33, Example 34, Algorithm 7, Example 35, Theorem 36, Proposition 2, Example 37, Theorem 38, Example 39, Algorithm 8, Remark 40, Figures 17–20; Appendix C (proof of Theorem 33)
- [Slides 5 (20260130_Lecture_05.pdf)](https://diffusion.csail.mit.edu/2026/docs/20260130_Lecture_05.pdf) — continuous/discrete flow matching table, "Discrete analogue to the continuity equation," "Rates explode at t=1," "Only unknown!," masked diffusion LM sampling demo, discrete diffusion vs. autoregressive discussion
- [Lecture 5 recording: Discrete Diffusion Models (2026)](https://www.youtube.com/watch?v=d0kmyEJN2hI)
- [eje24/iap-diffusion-labs (branch 2026)](https://github.com/eje24/iap-diffusion-labs/tree/2026) — contains Labs 1–3 only; no lab for Lecture 5
- [Holderrieth et al. (2024), Generator Matching: Generative Modeling with Arbitrary Markov Processes](https://arxiv.org/abs/2410.20587)
- [Bie et al. (2025), LLaDA2.0: Scaling Up Diffusion Language Models to 100B](https://arxiv.org/abs/2512.15745)
