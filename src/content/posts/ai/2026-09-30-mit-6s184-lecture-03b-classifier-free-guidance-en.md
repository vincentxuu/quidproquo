---
title: "MIT 6.S184 L3B: Guidance and Classifier-Free Guidance"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 6
tldr: "Feeding the prompt to the network as an extra input should, in theory, sample from p_data(x|y), but in practice the images don't follow the prompt closely enough. Lecture 3B uses Bayes' rule to split the guided vector field into the unguided vector field plus a classifier gradient; scaling that classifier term by w is classifier guidance. Replacing the classifier with the difference between guided and unguided fields gives CFG, which needs no classifier: ũ = (1−w)·u(x|∅) + w·u(x|y). Training only requires swapping the label for a null label ∅ with probability η. The costs: two network calls per step, and for w>1 you are no longer sampling from the data distribution."
description: "A guide to Lecture 3B of MIT 6.S184 (IAP 2026), based on lecture notes §5, the second half of Slides 3, and the recording: vanilla guidance and the terminology in Remark 25, classifier guidance (eq. 62), the derivation of classifier-free guidance and Remark 26, the label-dropout CFG objective (eqs. 63–64), Algorithm 5, Summary 27 (eq. 65), and Remark 28 on diffusion models."
draft: false
glossary:
  - term: "guidance scale"
    aliases: ["CFG scale", "w"]
    definition: "The weight w in classifier-free guidance that amplifies the prompt's influence. At w=1 you get the ordinary guided vector field; w>1 pushes samples toward regions that match the prompt more closely but with less diversity."
    context: "MIT 6.S184 notes, Summary 27; the notes say most AI-generated images and videos use w≥4."
  - term: "label dropout"
    aliases: ["condition dropout"]
    definition: "When training a CFG model, replacing a sample's label y with a null label ∅ (meaning 'no condition') with probability η, so one network learns both the guided and unguided vector fields."
    context: "MIT 6.S184 notes, eqs. (63)–(64) and Algorithm 5."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance)

> **Version note**: This post is based on [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) (IAP 2026): [lecture notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §5 (pp.34–40), the classifier-free guidance part of [Slides 3](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf), and the [Lecture 3B recording](https://www.youtube.com/watch?v=8oWZ1bHwyRI) (39 minutes). Equation, Remark, and Algorithm numbers follow the notes. Access level A3: notes, slides, recordings, labs, and official solutions are all public; lab grading is for enrolled MIT students only. Checked 2026-09-30.

**Series**: Previous [Lab 2: Flow Matching and Score Matching by Hand](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en) | Next [L4: U-Nets, DiTs, and Latent Space](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures-en) | [Series overview](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)

Up to this point, the course's models can only "generate an image." You can't say which image you want. Lecture 3B adds the last piece: making the model follow a prompt. The lecturer, Peter Holderrieth, calls this "one of the most crucial parts" of these models.

The star is **classifier-free guidance (CFG)**. Its derivation needs only two things you already have: Bayes' rule, and Proposition 1 from [Lecture 3A](/posts/ai/2026-09-30-mit-6s184-lecture-03a-score-matching-en) (for Gaussian paths, vector fields and scores are interchangeable). If Prop. 1 is shaky, go back to that post first.

The time convention matches the rest of the series: t=0 is noise, t=1 is data.

## First, vocabulary: guided is not conditional

**Remark 25** fixes a naming clash. In earlier lectures, "conditional" meant conditioning on a single data point z, as in the conditional probability path `p_t(x|z)` and the conditional vector field `u_t^target(x|z)`. Now there's a second kind of condition: the prompt y. To keep them apart, the notes call conditioning on y **guided**.

So three vector fields appear in this post. Keep them straight:

| Name | Symbol | Meaning |
|---|---|---|
| conditional vector field | `u_t^target(x\|z)` | conditioned on one data point z; has a closed form; the training target |
| unguided vector field | `u_t^target(x)` | the marginal vector field, ignoring the prompt |
| guided vector field | `u_t^target(x\|y)` | the marginal vector field given the prompt; what we want to learn |

## Vanilla guidance: feed the prompt in, change nothing else

The obvious approach (§5.1) is to make the prompt y a third input to the network, `u_t^θ(x|y)`, and leave everything else alone. y can be text or a class label; the notes put no constraints on its space.

Training barely changes. The only difference is that data now comes in pairs (z, y), an image and its prompt, so the PyTorch dataloader returns both. The loss still regresses the network output onto the conditional vector field `u_t^target(x|z)`, which doesn't depend on y. To sample, fix a y, feed it to the network at every step, and simulate the ODE from t=0 to t=1.

<details>
<summary>Notes eq. (58): the guided conditional flow matching loss</summary>

```text
L_CFM^guided(θ) = E_{(z,y)~p_data(z,y), t~Unif[0,1], x~p_t(·|z)} ‖u_t^θ(x|y) − u_t^target(x|z)‖²   (58)
```

Compared with the unguided CFM loss from Lecture 2 (eq. 26), the only change is sampling a pair (z, y) from `p_data` instead of just z.

In the recording, a student asks why the conditional vector field `u_t^target(x|z)` doesn't depend on the prompt. The lecturer says it could and the theory would still hold; people just don't do it in practice, and it would only add notation.

</details>

In theory, you're done: train well enough and this samples from `p_data(x|y)`. But the notes and slides show the same figure: a model trained on ImageNet, prompted with "corgi dog," produces images that don't look much like corgis and have visible errors. The notes offer two possible reasons. The model may underfit and never learn the true marginal vector field, or the data may be imperfect, since image–text pairs from the web contain many mistakes.

So we need a way to **artificially strengthen the prompt's influence**.

## Classifier guidance: scale up the "classifier" term

Start with CFG's predecessor. The notes restrict this part to Gaussian probability paths so Prop. 1 applies.

Three steps, intuition first:

1. By Bayes' rule, the guided score `∇log p_t(x|y)` splits into the unguided score `∇log p_t(x)` plus `∇log p_t(y|x)`. The denominator `p_t(y)` doesn't depend on x, so its gradient vanishes.
2. Using Prop. 1 to convert scores back to vector fields, the guided vector field equals **the unguided vector field plus a_t times `∇log p_t(y|x)`**.
3. `p_t(y|x)` means "look at a noisy image x and guess its label y." That's a classifier, and it's the only term that depends on the prompt.

If images don't follow the prompt well enough, the natural move is to scale the prompt-dependent term by w (w>1). That is **classifier guidance**, eq. (62) in the notes.

<details>
<summary>Notes eqs. (59)–(62): deriving classifier guidance</summary>

Gaussian path `p_t(·|z) = N(α_t z, β_t² I_d)` with `α_0 = β_1 = 0` and `α_1 = β_0 = 1`. By Prop. 1:

```text
u_t^target(x|y) = a_t ∇log p_t(x|y) + b_t x                                   (59)
p_t(x|y) = p_t(x) p_t(y|x) / p_t(y)                                           (60)
∇log p_t(x|y) = ∇log p_t(x) + ∇log p_t(y|x)     (∇ w.r.t. x, so ∇log p_t(y) = 0) (61)

⇒ u_t^target(x|y) = u_t^target(x) + a_t ∇log p_t(y|x)

ũ_t(x|y) = u_t^target(x) + w a_t ∇log p_t(y|x)       (classifier guidance)     (62)
```

The notes point out that for w ≠ 1, `ũ_t(x|y) ≠ u_t^target(x|y)`. This is no longer the "true" guided vector field; it's a heuristic.

</details>

Where does the classifier come from? You train one with supervised learning to predict labels from noisy images. The notes and the recording both name two problems:

- **You need a second network.** And you can't use an off-the-shelf classifier, because x is noisy data; the classifier has to be trained on noisy inputs. The workload doubles.
- **Text prompts are hard.** When y is a long piece of text rather than a class, `p_t(y|x)` is hard to learn and its gradient hard to obtain.

The notes say classifier guidance was largely superseded by CFG, so it serves only as a stepping stone.

## Classifier-free guidance: the classifier never has to exist

The key move in CFG is **eliminating the classifier from the formula**.

Run the Bayes identity backwards: the classifier gradient `∇log p_t(y|x)` equals the guided score minus the unguided score. Substitute that into eq. (62), use Prop. 1 to turn both scores into vector fields, and you get:

**ũ_t(x|y) = (1 − w) · u_t^target(x) + w · u_t^target(x|y)**

Only two vector fields remain. No classifier. As the lecturer puts it in the recording, we reinforce the effect of a classifier without ever training one; the classifier is "completely hypothetical." Hence the name.

Another way to read it: `ũ = u(x|y) + (w−1)·[u(x|y) − u(x)]`. The difference between "with prompt" and "without prompt" is the direction the prompt adds, and CFG walks w−1 extra steps along it. At w=1 nothing is amplified and you get the plain guided vector field back.

<details>
<summary>Notes §5.2: from eq. (62) to CFG in four lines</summary>

```text
ũ_t(x|y) = u_t^target(x) + w a_t ∇log p_t(y|x)
         = u_t^target(x) + w a_t (∇log p_t(x|y) − ∇log p_t(x))
         = u_t^target(x) − (w b_t x + w a_t ∇log p_t(x)) + (w b_t x + w a_t ∇log p_t(x|y))
         = (1 − w) u_t^target(x) + w u_t^target(x|y)
```

Line three adds and subtracts `w b_t x` so each bracket takes the form of Prop. 1.

**Remark 26**: although the derivation uses Gaussian paths, the final linear combination is valid for any probability path. At w=1 it's easy to check that `ũ_t(x|y) = u_t^target(x|y)`. The Gaussian case just illustrates the intuition of amplifying a hypothetical classifier.

</details>

### One network playing both roles

The formula still has two vector fields, which looks like two models. The notes' fix is to add a **null label ∅** to the label set, meaning "no prompt given," and set `u_t^target(x) = u_t^target(x|∅)`. The same network gives the guided field when fed a real y and the unguided field when fed ∅.

The training problem: sampling (z, y) from data never yields y=∅. So you create it artificially. Pick a hyperparameter η and **replace the label with ∅ with probability η**. The lecturer's offhand example is 20%. The model learns both to follow the prompt and what to do without one.

The lecturer stresses that this is a minimal change to the existing training procedure, which is exactly why CFG is practical and scalable: one network.

<details>
<summary>Notes eqs. (63)–(64) and Algorithm 5: training with CFG</summary>

```text
L_CFM^CFG(θ) = E_□ ‖u_t^θ(x|y) − u_t^target(x|z)‖²                                  (63)
□ = (z,y) ~ p_data(z,y), t ~ Unif[0,1], x ~ p_t(·|z), replace y = ∅ with prob. η     (64)
```

Algorithm 5 (Gaussian path `p_t(x|z) = N(x; α_t z, β_t² I_d)`):

```text
Require: paired dataset (z, y) ~ p_data, neural network u_t^θ
for each mini-batch:
    sample (z, y) from the dataset
    sample t ~ Unif[0,1]
    sample ε ~ N(0, I_d)
    x = α_t z + β_t ε
    with probability p drop the label: y ← ∅
    L(θ) = ‖u_t^θ(x|y) − (α̇_t z + β̇_t ε)‖²
    gradient step on L(θ)
```

Note: line 6 of Algorithm 5 calls the dropout probability p, while the text and eq. (64) call it η. Same hyperparameter. Eqs. (66)–(67) inside Summary 27 restate eqs. (63)–(64).

</details>

### Sampling: swap the vector field, keep everything else

**Summary 27** condenses it into eq. (65):

**ũ_t(x|y) = (1 − w) · u_t^target(x|∅) + w · u_t^target(x|y)**, with w > 1

Sampling is identical to vanilla guidance: fix y, start from `X_0 ~ p_init`, simulate the ODE to t=1. The only difference is that each step uses `ũ_t^θ(x|y)`. Slides 3 puts it plainly: "Sampling with Classifier-Free Guidance simply is the same as before but we use the weighted vector field."

In practice, every step runs the network twice, once with y and once with ∅, then combines them. At the end of the recording, the lecturer names this as CFG's drawback: **twice the network calls, half the efficiency.**

## CFG is a heuristic, and it leaves the data distribution

This is the idea from the lecture most worth keeping.

For w>1, the distribution of `X_1` is **no longer** `p_data(·|y)`. The notes call CFG a heuristic justified mainly by its excellent empirical results, and say that "almost any image or video that you see that is AI-generated relied heavily on classifier-free guidance w ≥ 4." Slides 3 is blunter: without CFG, almost nothing would work.

The recording adds detail:

- **It's the first time in the course we go beyond the data distribution.** Everything so far aimed to sample from it. The lecturer notes that if you measure text–image alignment for images from modern models, it can beat random real image–caption pairs from the web. Web data has wrong captions; the model does better than its data on this one axis.
- **The price is diversity.** He describes CFG as squeezing the distribution toward the modes that best represent the condition. The slides show a sketch where stronger guidance makes the distribution tighter. Push w too high and images get oversaturated; every variation except "the most cat-like cat" disappears.
- **w<1 is allowed too** and weakens the prompt. Asked about going negative, the lecturer says that would roughly mean steering away from the prompt.

Both the notes and slides use Stable Diffusion 3 as an example. Slides 3 gives SD3's guidance scale as about 4.0; notes §6.3 says SD3 samples with a weight between 2.0 and 5.0. Figure 13 in the notes shows MNIST at w=1.0, 2.0, and 4.0, and says you'll make a similar figure yourself in [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en).

**Try it**: in any open-source text-to-image tool, sweep the CFG scale from 1 to above 10 with the same prompt and seed. You'll see both claims from the notes: higher values follow the prompt more closely and look more uniform and saturated.

## Extending to diffusion models

**Remark 28** is one sentence: replace `u_t^θ(x|y)` with `ũ_t^θ(x|y)` and sample with the SDEs from Lecture 3A. CFG changes the vector field, so it doesn't matter whether you sample with an ODE or an SDE.

## What this lecture leaves out

- **How the network ingests the prompt.** Turning text into vectors, embedding t, and the network architecture are [Lecture 4](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures-en).
- **The literature guide.** Slides 3 continues past CFG into a section called "A guide to the diffusion literature" (time conventions, DDPM/DDIM, and other perspectives), but the lecturer says at the end of the recording that he'll cover it next week. The same material appears as a Bonus at the end of Slides 4.

## After this lecture, you should be able to

- Tell conditional (on z) apart from guided (on prompt y).
- Explain why vanilla guidance suffices in theory but not in practice.
- Derive the form of classifier guidance in three lines from Bayes' rule and Prop. 1.
- Write the CFG vector field `(1−w)·u(x|∅) + w·u(x|y)` and explain why w=1 reduces to vanilla guidance.
- Explain what label dropout does during training and how many network calls each CFG sampling step needs.
- Explain why a model with w>1 no longer samples from the data distribution.

**Tonight**: read notes pp.34–40. Being able to rewrite the four-line derivation in §5.2 from memory is enough. Then open Part 2 of [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en), do Questions 2.2 and 2.3, and use Sanity Check 2.4 to try different values of w on a three-component Gaussian mixture.

## Further reading

- Conditional generation and guidance from the DDPM perspective (time runs the opposite way): [CMU 11-785 L23: Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en)
- A general introduction to generative models: [MIT 6.S191 L4: Generative Modeling](/posts/ai/2026-08-22-mit-6s191-l04-generative-modeling-en)
- The original CFG paper: [Ho & Salimans, Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598) (reference [18] in the notes and the image source for the slides)

## References

- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — Lecture 3-B topics: guided generation, classifier guidance, classifier-free guidance
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models (lecture notes PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §5: Remark 25, eqs. (57)–(67), Remark 26, Algorithm 5, Summary 27, Figures 11–13, Remark 28; §6.3.1 CFG weight for SD3
- [Slides 3 (20260123_Lecture_03.pdf)](https://diffusion.csail.mit.edu/2026/docs/20260123_Lecture_03.pdf) — Section 6: Classifier-free guidance; SD3 guidance scale ≈ 4.0; "CFG does not model the data distribution anymore"
- [Lecture 3B recording: Classifier-free Guidance (2026)](https://www.youtube.com/watch?v=8oWZ1bHwyRI)
- [Slides 4 (20260128_Lecture_04_edited.pdf)](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf) — Bonus: A guide to the diffusion literature
- [Ho & Salimans (2022), Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [eje24/iap-diffusion-labs (branch 2026)](https://github.com/eje24/iap-diffusion-labs/tree/2026) — CFG implementation in Lab 3 Part 2
