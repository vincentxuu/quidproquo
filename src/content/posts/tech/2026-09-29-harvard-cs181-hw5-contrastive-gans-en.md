---
title: "Harvard CS181 HW5 (Part 2): SimCLR and GANs — Representations Without Labels, Generation Without Likelihoods"
date: 2026-09-29
category: tech
tags: [harvard, cs181, machine-learning, homework, self-supervised-learning, contrastive-learning, gan, generative-models]
lang: en
series:
  name: "Harvard CS181 Weekly Guides"
  order: 10
type: guide
tldr: "HW5 Problems 1–2 both turn learning into a classification task. SimCLR's NT-Xent loss asks the network to pick the other augmented view of the same image out of 2N−1 candidates; a GAN's discriminator classifies real versus fake. You derive the math behind each (the cross-entropy equivalence, the optimal discriminator and the JS divergence), then write both training loops on FashionMNIST and MNIST."
description: "Weekly guide to Harvard CS1810 Spring 2026 HW5 (due 2026-04-19) Problems 1–2: SimCLR's NT-Xent loss, temperature τ, representation collapse and augmentations, projection head and linear evaluation, plus the original minimax GAN's optimal discriminator, Jensen–Shannon divergence interpretation, and alternating training loop. Mapped to schedule week 10 and Section 8."
draft: false
glossary:
  - term: "NT-Xent"
    aliases: ["NT-Xent loss", "normalized temperature-scaled cross-entropy"]
    definition: "SimCLR's contrastive loss: take the cosine similarity between one augmented view and every other view in the batch, divide by temperature τ, apply softmax, and require the other view of the same image to get the highest probability."
    context: "HW5 Problem 1 asks you to show it equals a cross-entropy loss and to implement it in the notebook."
  - term: "Jensen–Shannon divergence"
    aliases: ["JS divergence", "JSD"]
    definition: "A symmetric measure of how two distributions differ: the average of each distribution's KL divergence to their mixture. It is 0 when the two are identical."
    context: "HW5 Problem 2 asks you to show that with an optimal discriminator the GAN objective is a constant plus a JS divergence term."
---

> 🌏 [中文版](/posts/tech/2026-09-29-harvard-cs181-hw5-contrastive-gans)

**Video status: Checked: no corresponding recording link listed on the public official page.** [Source details](#course-video-sources)

> ⚠️ **Edition and access**: Based on [CS1810 Spring 2026 HW5](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw5) (`hw5_release.tex/.pdf/.ipynb`), week 10 of the [official schedule](https://harvard-ml-courses.github.io/cs181-web/schedule), and [Section 8](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08.pdf) (headed Spring 2026). The week 10 lectures (SSL, contrastive learning, GANs, EBMs) are new in 2026, **the 2024 scribe notes have nothing matching them**, and there are no public recording links listed for the corresponding lectures. So everything here about lecture content comes from Section 8 and the assignment itself. Homework solutions are not public; Section 8 has a [solution PDF](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08_soln.pdf). Access grade **A3**, same as the [series overview](/posts/tech/2026-08-27-harvard-cs181-overview-en).

This is part 10 of the [Harvard CS181 Weekly Guides](/posts/tech/2026-08-27-harvard-cs181-overview-en). Previous: [HW5 (Part 1): K-means, HAC, and PCA](/posts/tech/2026-09-29-harvard-cs181-hw5-clustering-pca-en). Next: [HW6 (Part 1): Decoding, KV Cache, and Speculative Decoding](/posts/tech/2026-09-29-harvard-cs181-hw6-autoregressive-decoding-en).

K-means and PCA in the previous post were both about reconstruction: rebuild each image from a centroid or a few components and keep the error small. These two problems take a different route. SimCLR reconstructs nothing; it only asks the network to recognize that two crops came from the same image. A GAN never computes a data likelihood; it only needs samples that fool a discriminator. What ties them together is the title of section 5 in [Section 8](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08.pdf): **learning viewed as a classification problem**.

## Course video sources

Checked the official CS1810 Spring 2026 schedule and syllabus. This guide uses homework, section, or exam materials; the corresponding entries do not list a public lecture video. Slides and section materials are provided. No public listing does not mean that a recording never existed.

Official sources:

- [CS1810 Spring 2026 official schedule](https://docs.google.com/spreadsheets/d/13sqhDtt1mYDFJ_vkeMpSVLg9T-aqdATKlch4VXFeOJQ/edit?usp=sharing)
- [CS1810 Spring 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)

Checked on 2026-10-10.

## Where this sits in the 2026 schedule

| Item | Official source |
|---|---|
| Lectures | Week 10: Mar 31 "Self-Supervised Learning / Generative Models", Apr 2 "Contrastive Learning, GANs, and EBMs" |
| Section | Section 8 "Deep Learning Medley: Self-Supervised Learning and Generative Modeling, Contrastive Learning, GANs, Energy-Based Models" (listed in the week 11 row of the schedule as "S8: Generative Modeling Medley") |
| Homework | HW5 Problem 1 (SimCLR) and Problem 2 (GANs); released 2026-04-03, `\duedate` April 19, 2026 11:59pm |
| Code | The Problem 1 and Problem 2 sections of `hw5_release.ipynb` |

The HW5 tex gives no per-problem points.

## Problem 1: SimCLR and contrastive learning

### Setup

Take a batch of N images and augment each one twice, giving 2N views; the two views of one image form a positive pair. Each view goes through an encoder f and a projection head g, then gets ℓ2-normalized into z. For a positive pair (i, j), the NT-Xent loss is:

```text
ℓ(i,j) = −log [ exp(zᵢᵀzⱼ/τ) / Σ_{k≠i} exp(zᵢᵀzₖ/τ) ]
```

The denominator sums over the other 2N−1 views, and τ is the temperature.

### Four sub-questions

**1. NT-Xent and temperature.**
(a) Show that ℓ(i,j) equals the cross-entropy of a (2N−1)-way classification where j is the correct class and the other 2N−2 are negatives.
(b) Look at the softmax weight wₖ on a negative k and explain what happens as τ→0⁺, as τ→∞, and why an intermediate value is used in practice.

Section 8's section 5 already states the intuition for (a): InfoNCE is a softmax classification in which the model picks the true match from a set of candidates. For (b): the smaller τ gets, the closer softmax gets to argmax, so nearly all the weight lands on the single most similar negative; as τ grows, all negatives get the same weight and the model can't tell easy from hard. The notebook's public test `test_nt_xent_temperature_effect` checks exactly that lower temperature gives a higher loss.

**2. Representation collapse and augmentations.**
(a) If the encoder maps every input to the same unit vector c, every similarity is 1. What is ℓ(i,j)?
(b) Why is the encoder output h = f(x) often more useful downstream than the projection-head output z = g(f(x))?
(c) What do overly aggressive and overly weak augmentations do to the learned representation?

For (a), you'll get a constant that depends only on N. It shows the collapsed solution is not the minimum; the negative terms push it away. For (c), look at the augmentations the notebook actually uses: `RandomResizedCrop(28, scale=(0.6, 1.0))`, horizontal flip, ±15° rotation, and Gaussian blur with probability 0.5. If the crop could shrink to 10% of the image, could two views still be recognized as the same garment?

**3. Implementation (code).** Two components:
- A two-layer projection head: `Linear → ReLU → Linear`
- The NT-Xent loss, which the problem breaks into six steps: ℓ2-normalize → concatenate into a 2N×d matrix → compute the 2N×2N cosine similarity scaled by 1/τ → mask self-similarity → find each view's positive index → compute cross-entropy with the positive index as the target

The notebook comments add two details: set the diagonal to `-inf`; the positive for the first N views is at `i+N`, and for the last N at `i-N`. Run "Check 1.2.c: Hand Calculation" (a hand-computed value at τ=1.0) and "Check 1.2.d: Public Test Cases" before moving on.

**4. Training and linear evaluation (code).**
(a) Pre-train the encoder and projection head on FashionMNIST without labels;
(b) freeze the encoder and run linear evaluation on its features;
(c) compare against a supervised baseline with the same encoder architecture.

The notebook's hyperparameters: `SIMCLR_EPOCHS = 10`, `SIMCLR_BATCH_SIZE = 512`, `SIMCLR_LR = 1e-3`, `SIMCLR_TEMPERATURE = 0.5`, projection hidden size 128, output 64 dimensions. Linear evaluation defaults to 20 epochs, the supervised baseline to 10. Pre-training is the slowest step; the notebook's `RUN_SIMCLR_TRAINING` flag lets you skip it while working on earlier cells.

## Problem 2: GANs and the Jensen–Shannon divergence

### Setup

The original minimax objective:

```text
min_G max_D V(D,G) = E_{x~p_data}[log D(x)] + E_{z~p_z}[log(1 − D(G(z)))]
```

p_g is the distribution induced by x = G(z).

### Three sub-questions

**1. GANs as JS divergence (written).** With G fixed:
(a) derive the optimal discriminator D*(x) in terms of p_data(x) and p_g(x);
(b) substitute D* back and show the result is a constant plus a JS divergence term;
(c) explain in words what this means the generator is trying to do.

The key to (a) is that V can be written as an integral over x, so you maximize over D(x) separately at each x. Section 8's subsection 7.1 gives the form of the answer, so use it to check yours. For (b), after substituting, rewrite the denominators inside the logs as the mixture of the two distributions and the two KL terms appear. The conclusion for (c): with a strong enough discriminator, the generator minimizes the JS divergence between p_g and p_data.

**2. From derivation to training algorithm (written).** Write the discriminator objective and the generator objective, and describe the alternating loop used in practice.

Note that Section 8's section 6 writes the generator loss as `L_G = E_z[−log D(G(z))]`, not as minimizing the minimax term `log(1 − D(G(z)))`. The two share the same fixed point of the training dynamics, but the [original GAN paper](https://arxiv.org/abs/1406.2661) points out that early in training the discriminator rejects fakes easily, `log(1 − D(G(z)))` saturates and gives tiny gradients, and maximizing `log D(G(z))` gives much stronger ones. The question asks for the loop used in practice, so state which form you use and why.

**3. Implementation (code).** In the notebook: define the generator and discriminator, implement the discriminator loss on real and fake batches, implement the generator loss, write one epoch of alternating updates, then train for several epochs and visualize samples.

Notebook settings: MNIST, `batch_size = 128`, `latent_dim = 100`, images flattened to `28 * 28`, pixels normalized to `[-1, 1]` to match the generator's output range, two Adam optimizers with `lr = 2e-4`, `num_epochs = 20`. Subpart 2.1.d spells it out: the discriminator updates on real images and **detached** fake images, then the generator updates with a fresh batch of noise. Forget the detach and the discriminator's gradients flow into the generator.

## How the two problems connect

Section 8 ends by unifying three ideas with energy-based models:

| Method | What the "energy" is | Where negatives come from | Objective |
|---|---|---|---|
| Contrastive learning | Similarity function | Other samples in the dataset | Classify positives vs negatives |
| GAN | Discriminator logit | Generator samples | Adversarial training |
| EBM | Explicitly modeled E(x) | Noise, a generator, or MCMC | Maximize likelihood via push–pull dynamics |

The end of Section 8's section 5 gives the reason to go from SimCLR to GANs. Randomly drawn negatives are too easy, so the model learns only superficial cues, and naturally occurring hard negatives are rare in high dimensions. So can we **learn a distribution that produces hard negatives**? That is the generator. When you do Problem 2, treat the discriminator as a real-vs-fake classifier and the generator as an increasingly stubborn negative sampler, and the two problems become two halves of one story.

The assignment has no EBM question; EBMs appear only in Section 8.

## Suggested order

1. Do Problem 1's two written parts first. Once you've written the cross-entropy equivalence in (1a), step vi of the implementation, "compute cross-entropy with the positive index as the target," is a direct translation of it.
2. When writing NT-Xent, pass the hand-calculation check, then the public tests, and only then turn on `RUN_SIMCLR_TRAINING`.
3. For Problem 2, derive D*, check it against Section 8's subsection 7.1, then substitute and assemble the JS divergence.
4. Run the GAN loop for one epoch, print both losses, confirm both move, then run all 20.

## Self-check

- Why does the NT-Xent denominator exclude k = i but include the positive j?
- When τ is small, which negative dominates the gradient? What does that mean for hard negatives?
- What loss value does the collapsed solution give? How does it relate to the cross-entropy of random guessing?
- What does D*(x) = 1/2 mean?
- Why detach the fake images when updating the discriminator?

## Further reading

- [CS230 guide: supervised, self-supervised, and weakly supervised learning](/posts/ai/2026-08-16-cs230-how-embeddings-are-trained-en), which goes from triplet loss to the motivation for SimCLR.
- The original papers: [Chen et al., SimCLR (2020)](https://arxiv.org/abs/2002.05709) and [Goodfellow et al., Generative Adversarial Networks (2014)](https://arxiv.org/abs/1406.2661).

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. Re-read the official schedule and syllabus; they still list no public lecture video for this topic.

## References

- [CS1810 Spring 2026 HW5 folder (GitHub)](https://github.com/harvard-ml-courses/cs181-s26-homeworks/tree/main/hw5): `hw5_release.tex`, `hw5_release.pdf`, `hw5_release.ipynb`
- [HW5 problem PDF](https://github.com/harvard-ml-courses/cs181-s26-homeworks/blob/main/hw5/hw5_release.pdf)
- [CS1810 2026 official schedule](https://harvard-ml-courses.github.io/cs181-web/schedule) (weeks 10–11; read via Google Sheet CSV export on 2026-09-29)
- [Section 8: Deep Learning Medley (Spring 2026)](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08.pdf) / [solutions](https://harvard-ml-courses.github.io/cs181-web/static/sec08/sec08_soln.pdf)
- [CS1810 2026 syllabus](https://harvard-ml-courses.github.io/cs181-web/syllabus)
- [Chen et al., A Simple Framework for Contrastive Learning of Visual Representations (2020)](https://arxiv.org/abs/2002.05709)
- [Goodfellow et al., Generative Adversarial Networks (2014)](https://arxiv.org/abs/1406.2661)
- [Harvard CS181 Weekly Guides (series overview)](/posts/tech/2026-08-27-harvard-cs181-overview-en)
