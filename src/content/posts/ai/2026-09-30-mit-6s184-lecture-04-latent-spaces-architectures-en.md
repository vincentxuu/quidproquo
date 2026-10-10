---
title: "MIT 6.S184 L4: U-Nets, DiTs, and Latent Space"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai, diffusion-transformer, vae, latent-diffusion]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 7
tldr: "The algorithms are complete by Lecture 3B; Lecture 4 tackles two engineering problems that show up at scale. First, the network must take an image, a time t, and a prompt and output a vector field of the same size, so we use a U-Net or a diffusion transformer (DiT), embedding time with Fourier features and text with frozen CLIP/T5 encoders. Second, pixel space is too big, so we first train a VAE to compress images into a latent space, run flow matching there, and decode at the end. Stable Diffusion 3 and Meta Movie Gen Video both follow this recipe: flow matching in latent space, a DiT variant, and CFG."
description: "A guide to Lecture 4 of MIT 6.S184 (IAP 2026), based on lecture notes §6, Slides 4, and the recording: embedding time, class labels, and text; the DiT and the DiT block in Remark 29 (self-attention, cross-attention, adaLN); U-Nets; why plain autoencoders fall short; VAE reconstruction and KL terms (Remark 30, Example 31, eq. 83); Algorithm 6 (β-VAE); Remark 32 on latent diffusion; and the Stable Diffusion 3 and Movie Gen Video case studies as the notes describe them."
draft: false
glossary:
  - term: "adaLN"
    aliases: ["adaptive layer normalization", "AdaNorm"]
    definition: "Uses a conditioning vector (such as a time embedding) passed through an MLP to produce per-channel scale and shift that modulate normalized activations: x ↦ (1+γ)⊙Norm(x)+β."
    context: "MIT 6.S184 notes, Remark 29: how a DiT injects time t into every layer."
  - term: "reparameterization trick"
    aliases: ["reparameterisation trick"]
    definition: "Rewrites z ~ N(μ_φ(x), σ_φ²(x)) as z = μ_φ(x) + σ_φ(x)·ε with ε ~ N(0, I), so randomness comes only from ε, which doesn't depend on the parameters, and the loss can be backpropagated through φ."
    context: "Used to train the VAE in MIT 6.S184 notes §6.2.2."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures)

**Video status: Videos included; playback has not been rechecked individually.** [Source details](#course-video-sources)

> **Version note**: This post is based on [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) (IAP 2026): [lecture notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §6 (pp.41–53), [Slides 4](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf), and the [Lecture 4 recording](https://www.youtube.com/watch?v=g0MB1CCBmsI) (about 81 minutes). Equation, Remark, and Algorithm numbers follow the notes; content follows the notes and slides. Access level A3: notes, slides, recordings, labs, and official solutions are all public; lab grading is for enrolled MIT students only. Checked 2026-09-30.

**Series**: Previous [L3B: Guidance and Classifier-Free Guidance](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en) | Next [Lab 3: From DiT and VAE to Latent Diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en) | [Series overview](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)

By the end of Lecture 3B, training and sampling are fully specified: flow matching or score matching for training, CFG for following prompts. These algorithms work well on 2D toy distributions because the network is just an MLP; concatenate x, y, and t and you're done.

Switch to a 1024×1024 color image and two things break at once:

1. **An MLP won't do.** The network must take an image, a time value, and a prompt, and output a "velocity image" of the same size. That calls for specialized architectures.
2. **The space is huge.** The notes do the arithmetic: 1024×1024×3 is about 3 million dimensions, and video multiplies that by the number of frames.

Lecture 4 solves these two problems separately. Notes §6 covers architectures first and latent space second; Slides 4 reverses the order (Section 6 latent spaces, Section 7 architectures). This post follows the notes.

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=g0MB1CCBmsI
title: Lecture 4 recording: Latent Spaces, Neural networks (2026)
```

Original videos: [Lecture 4 recording: Latent Spaces, Neural networks (2026)](https://www.youtube.com/watch?v=g0MB1CCBmsI)

Course and recording entries:

- [mit-6s184 — official course materials and recording index](https://diffusion.csail.mit.edu/2026/index.html)

## Problem one: how the network takes three inputs

Notes §6.1 opens with the requirements: three inputs, a vector `x ∈ R^d`, a condition `y`, and a time `t ∈ [0,1]`, and one output, `u_t^θ(x|y) ∈ R^d`. Step one is turning t and y into vectors the network can digest.

### Embedding time, class labels, and text

- **Time t** is a single scalar, which carries too little weight next to a high-dimensional image (Slides 4 says the goal is to make it "count" more). The common approach is **Fourier features**: map t to cosines and sines at many frequencies so the network can capture high-frequency dependence on time. The notes add that this exact form isn't required; what matters is a d-dimensional vector with unit norm.
- **Class labels** are easiest. Learn one embedding vector per possible value (N+1 values, including CFG's null label) as part of the network parameters.
- **Text prompts** mostly rely on **frozen pretrained models**. The notes use CLIP as the example: it embeds images and text into a shared space, pulling matching pairs together. If you don't want to squeeze the whole sentence into one vector, a pretrained transformer can give you a sequence of embeddings, and it's common to combine several kinds. The notes abstract the result as a sequence of shape `S×k`.

<details>
<summary>Notes eqs. (68)–(69): Fourier time embedding</summary>

```text
TimeEmb(t) = sqrt(2/d) · [cos(2π w_1 t), …, cos(2π w_{d/2} t), sin(2π w_1 t), …, sin(2π w_{d/2} t)]^T   (68)

w_i = w_min · (w_max / w_min)^{(i−1)/(d/2−1)},   i = 1, …, d/2                                         (69)
```

Since sin² + cos² = 1, the vector always has norm 1.

</details>

### The diffusion transformer (DiT)

The DiT builds on the vision transformer idea: **cut the image into patches, treat each patch as a token, run attention over them, then reassemble the image shape.**

Four steps:

1. **Patchify**: split the `C×H×W` image into N patches of size P×P, with N = (H/P)·(W/P). Flatten each patch and multiply by a learnable matrix to get a d-dimensional token.
2. **Prepare the conditions**: a time embedding `t̃ ∈ R^d` and a prompt embedding `ỹ ∈ R^{S×d}`, both in the transformer's hidden dimension d.
3. **L DiT blocks**: each layer updates the patch tokens using the patches, the time, and the prompt (eq. 70).
4. **Depatchify**: multiply by another matrix and reshape back to `C×H×W`. That's the predicted velocity `u_t^θ(x|y)`.

Each DiT block does three things (**Remark 29**), one per input type:

| Input | Mechanism | What it does |
|---|---|---|
| image | self-attention | patches attend to each other |
| prompt | cross-attention | patches attend to text embeddings (queries from the image, keys/values from text) |
| time | adaptive normalization (adaLN) | the time embedding sets the scale and shift after normalization |

The notes also point out that class-conditioned DiTs, like the one in Lab 3, are simpler: they usually drop cross-attention and inject time and class together through adaLN.

<details>
<summary>Remark 29: the math of one DiT block</summary>

Scaled dot-product attention:

```text
Attn(Q, K, V) = softmax(Q K^T / sqrt(d_h)) V
```

In multi-head attention, each head has its own projections `W_Q^(h), W_K^(h), W_V^(h)`. The source sequence z is either x itself (self-attention) or the prompt y (cross-attention). Heads are concatenated and multiplied by `W_O`.

Time conditioning: an MLP `g` maps `t̃` to `(γ, β)`,

```text
AdaNorm_t̃(x) = (1 + γ) ⊙ Norm(x) + β
```

The full block:

```text
x ← x + g_self(t̃)  ⊙ MultiHeadAttention(AdaNorm_t̃(x), AdaNorm_t̃(x))
x ← x + g_cross(t̃) ·  MultiHeadAttention(AdaNorm_t̃(x), y)
x ← x + g_MLP(t̃)   ·  MLP(AdaNorm_t̃(x))
```

The `g_…` terms are learnable gating parameters. The notes say this description emphasizes algorithmic choices over architectural detail.

</details>

Slides 4 gives practical advice on DiTs: the best way to understand a transformer is to implement one. It points you to [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en).

### U-Net

The **U-Net** is the alternative: a convolutional network originally designed for image segmentation. What makes it a good fit for a vector field is that **its input and output are both image-shaped**. With y and t fixed, `x ↦ u_t^θ(x|y)` is exactly "image in, image out." The notes say U-Nets were used widely in the early diffusion literature.

The notes walk a `3×256×256` image through it:

```text
x_t^input  ∈ R^{3×256×256}     input
x_t^latent = E(x_t^input)  ∈ R^{512×32×32}    through the encoders: more channels, smaller height/width
x_t^latent = M(x_t^latent) ∈ R^{512×32×32}    through the midcoder
x_t^output = D(x_t^latent) ∈ R^{3×256×256}    through the decoders back to image shape
```

"Midcoder" is the notes' own name for the bottom of the U, and a footnote admits the term is completely non-standard. In practice, encoders and decoders are usually linked by residual connections, and attention layers are common inside them; the notes describe a simplified, purely convolutional version. The caption of Figure 15 says a U-Net like this was used in Lab 3 of the 2025 course; the 2026 Lab 3 uses a DiT instead.

## Problem two: pixel space is too big, so change spaces

### Why high dimensions hurt diffusion in particular

Slides 4 does the math for a 600×1000 color image: 3×600×1000 = 1.8 million dimensions. Three problems follow: GPU memory blows up, learning is very hard, and nearby pixels are highly correlated, so much of it is redundant.

The slides then ask a good question: **why is this a problem for diffusion models but not for supervised learning?** Two reasons:

- We learn a vector field, so **the output is as high-dimensional as the input**. An image classifier outputs a few classes and can narrow as it goes.
- Sampling **simulates an ODE, calling the same network many times**.

### Why a plain autoencoder isn't enough

The intuitive fix is compression: train an encoder to squeeze images into low-dimensional latents and a decoder to restore them, using reconstruction error. The notes' example downsamples a `3×1024×1024` image by 16 in height and width, to `3×64×64`.

The catch: reconstruction error only guarantees you can get the image back. **It says nothing about what the latent distribution looks like.** Your real goal is to train a generative model in latent space; if compression warps the data into a hard-to-learn distribution, you've compressed successfully and failed at generation. Slides 4 calls this a "bad" latent space.

So you need an autoencoder that controls the latent distribution.

### VAE: make the latents look Gaussian

A **variational autoencoder (VAE)** relaxes the encoder and decoder from deterministic functions to probability distributions: the encoder gives `q_φ(z|x)`, the decoder gives `p_θ(x|z)`, and the most common choice is Gaussian for both.

The VAE loss has two parts:

1. **Reconstruction**: how likely the original image is after encoding and decoding. With a Gaussian decoder and fixed variance, it's essentially MSE with added randomness.
2. **Prior**: push each image's encoding distribution `q_φ(·|x)` toward the standard Gaussian `N(0, I_k)`, measured by KL divergence. The notes' intuition: if every x encodes to something Gaussian-like, the overall latent distribution should look Gaussian too, and Gaussians are easy to learn.

The two parts are combined with a weight β. Expanded in the Gaussian case, the total loss has four terms, each labeled in the notes' eq. (83): **reconstruction error, decoder confidence, make latent variance 1, make latent mean 0**.

<details>
<summary>Remark 30, Example 31, eqs. (78)–(83): the VAE loss</summary>

**Remark 30** (KL divergence):

```text
D_KL(q ‖ p) = ∫ q(x) log(q(x)/p(x)) dx = E_{X~q}[log q(X)/p(X)]
D_KL ≥ 0, and D_KL = 0 ⇔ q = p                                           (76)(77)
```

**Example 31** (KL between diagonal Gaussians):

```text
D_KL(q ‖ p) = ½ [ K(σ_q²/σ_p²) + ‖μ_q − μ_p‖²/σ_p² ],   K(α) = Σ_i (α_i − log α_i − 1)   (80)
```

K(α) has a unique minimum at α=1, so KL is 0 when means and variances match.

VAE objective:

```text
L_VAE = L_VAE-Recon + β L_VAE-Prior                                      (78)
      = −E[log p_θ(x|z)] + β E[D_KL(q_φ(·|x) ‖ p_prior)]                  (79)

the four terms of eq. (83):
  (1/(2σ_θ²(z))) ‖x − μ_θ(z)‖²    reconstruction error
  (d/2) log σ_θ²(z)               decoder confidence
  (β/2) K(σ_φ²(x))                make latent variance = 1
  (β/2) ‖μ_φ(x)‖²                 make latent mean = 0
```

</details>

**How do you train it?** The expectation is taken over `q_φ(z|x)`, which itself depends on φ, so you can't backpropagate directly. The fix is the **reparameterization trick**: write z as `μ_φ(x) + σ_φ(x)·ε`, with ε drawn from a standard Gaussian that doesn't depend on φ. All randomness comes from ε; everything else is differentiable. **Algorithm 6** spells this out as a β-VAE training loop.

<details>
<summary>Algorithm 6: β-VAE training (decoder variance fixed at σ̃²)</summary>

```text
Require: data x ~ p_data, encoder (μ_φ(x), log σ_φ²(x)), decoder μ_θ(z), latent dim k, β ≥ 0, σ² > 0
for each mini-batch {x_i}:
    μ_i, log σ_i² ← encoder(x_i)
    ε_i ~ N(0, I_k)
    z_i ← μ_i + σ_i ⊙ ε_i            (σ_i = exp(½ log σ_i²))
    x̂_i ← μ_θ(z_i)
    L_recon ← (1/B) Σ_i ‖x_i − x̂_i‖² / (2σ̃²)
    L_KL    ← (1/B) Σ_i ½ Σ_j (μ_ij² + σ_ij² − log σ_ij² − 1)
    L ← L_recon + β L_KL
    update (φ, θ)
```

</details>

The notes add four practical remarks worth remembering:

- **Choosing β.** Large β hurts reconstruction and can cause posterior collapse, where the encoder ignores the input and outputs the standard Gaussian. A common stabilizer is KL warm-up: start at β=0 and ramp it up. The notes say β is very small in all modern autoencoders, β≪1.
- **Decoder variance is usually fixed.** Learning it is numerically delicate; fixing it makes the reconstruction term proportional to MSE.
- **Pixel MSE alone is blurry.** In practice people add perceptual losses.
- **Adversarial losses** (VAE-GAN style) sharpen outputs at the cost of less stable training.

### Latent diffusion: the same recipe on a different dataset

**Remark 32** says training a generative model in latent space is just the existing recipe with latents as data. Slides 4 lists five steps:

1. Take all training data (for example, every image on the internet).
2. Encode it all into latents (for a VAE, take the mean).
3. You now have a much smaller dataset of latents.
4. Train a flow or diffusion model on it; it now generates latents.
5. After sampling, decode back to images.

The notes add a detail: at inference, decode with the decoder's **mean** rather than sampling, to avoid noise artifacts. Intuitively, a good autoencoder filters out high-frequency, semantically meaningless detail, letting the generative model focus on perceptually important features.

Slides 4 gives two compression examples: Stable Diffusion maps `[3,256,256]` to `[4,32,32]`, and FLUX 2.0 maps `[3,1024,1024]` to `[32,64,64]`. The notes say that, at the time of writing, nearly all state-of-the-art image and video generation follows the latent diffusion paradigm.

Know the cost: **the autoencoder must be trained first, and final quality partly depends on how well it compresses and how good its reconstructions look.**

Appendix D of the notes (Additional Perspectives on VAEs) goes further on VAEs. This series has no separate post on it, so read it directly if you want more.

## Case studies: what the notes say about Stable Diffusion 3 and Movie Gen Video

Notes §6.3 uses two large models to show that every earlier lecture turns up in real systems. The table below covers only what the notes and Slides 4 say.

| | Stable Diffusion 3 | Meta Movie Gen Video |
|---|---|---|
| Generates | images | videos (data gains a time dimension T) |
| Objective | conditional flow matching; the notes say the SD3 paper tested many flow and diffusion variants and found flow matching best | conditional flow matching with straight-line schedulers `α_t = t, σ_t = 1−t` |
| Latent space | pretrained autoencoder | frozen, pretrained temporal autoencoder (TAE) compressing time, height, and width by 8 each; long videos are split into pieces, encoded separately, and stitched |
| Network | MM-DiT: extends DiT from class conditioning to text-sequence conditioning, with image and text processed through the whole network | DiT-like backbone, patchified along time and space; self-attention among patches, cross-attention to text embeddings |
| Text embeddings | three kinds, including CLIP (coarse) and the sequence outputs of the T5-XXL encoder (fine-grained) | three kinds: UL2 (text reasoning), ByT5 (character-level details, such as prompts asking for specific text in the frame), MetaCLIP |
| CFG | label dropout during training; guidance weight 2.0–5.0 when sampling | Slides 4 lists CFG |
| Scale | largest model 8 billion parameters; 50 Euler steps for sampling | largest model 30 billion parameters; Slides 4 says 6,144 H100 GPUs |

Slides 4 also lists LAION as SD3's dataset, which the notes don't mention. The notes point out that autoencoders matter even more for video than for images because of memory, which is why most current video generators are limited in how long a video they can produce.

## What this lecture leaves out

- **Training details and evaluation of these models.** The notes pick only what connects to the course; for the rest, read the SD3 paper and the Movie Gen technical report.
- **The literature guide.** Slides 4 ends with a Bonus section, "A guide to the diffusion literature," covering the flow and diffusion time conventions, DDPM/DDIM, stochastic interpolants, and other framings. It's the same material as the end of Slides 3; in the notes it corresponds to Appendix E.
- **Discrete data.** Diffusion over text tokens is [Lecture 5](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion-en).

## After this lecture, you should be able to

- Explain how each of the vector-field network's three inputs is embedded.
- Sketch the DiT's four steps and say which input self-attention, cross-attention, and adaLN each handle.
- Explain why a U-Net fits the job of parameterizing a vector field.
- Explain why high dimensions hurt diffusion more than classification.
- Explain why a plain autoencoder falls short and what problem the VAE's KL term solves.
- State the latent diffusion recipe in five steps and name what it additionally depends on.

**Tonight**: read notes pp.46–51 (§6.2) and explain each of the four terms in eq. (83) to yourself in one sentence. Then open Part 3 of [Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en) and start with the `Patchifier` in Question 3.2.

## Further reading

- The full VAE derivation (ELBO view): [CMU 11-785 L22: Variational Autoencoders](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders-en)
- Transformers and attention from scratch: [Stanford CS224N: Transformers](/posts/ai/2026-08-22-cs224n-transformers-en), [CMU 11-785 L18: Attention and Transformers](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers-en)
- Diffusion from the DDPM perspective (time runs the opposite way): [CMU 11-785 L23: Diffusion](/posts/ai/2026-08-22-cmu-11785-23-diffusion-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — Lecture 4 topics: VAEs and latent spaces, DiTs and U-Nets, large-scale case studies
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models (lecture notes PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — §6.1 eqs. (68)–(70), Remark 29, U-Net and Figure 15; §6.2 eqs. (71)–(83), Remark 30, Example 31, Algorithm 6, Remark 32; §6.3 SD3 and Movie Gen Video; Appendix D
- [Slides 4 (20260128_Lecture_04_edited.pdf)](https://diffusion.csail.mit.edu/2026/docs/20260128_Lecture_04_edited.pdf) — The Need for Latent Spaces, LDM recipe, SD / FLUX 2.0 compression, DiTBlock overview, SD3 and MovieGen case studies, literature guide
- [Lecture 4 recording: Latent Spaces, Neural networks (2026)](https://www.youtube.com/watch?v=g0MB1CCBmsI)
- [Peebles & Xie (2023), Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748)
- [Rombach et al. (2022), High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
- [Esser et al. (2024), Scaling Rectified Flow Transformers for High-Resolution Image Synthesis (SD3)](https://arxiv.org/abs/2403.03206)
- [Polyak et al. (2024), Movie Gen: A Cast of Media Foundation Models](https://arxiv.org/abs/2410.13720)
