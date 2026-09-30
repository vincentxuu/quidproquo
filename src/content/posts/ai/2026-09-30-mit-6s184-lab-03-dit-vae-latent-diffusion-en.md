---
title: "MIT 6.S184 Lab 3: From DiT and VAE to Latent Diffusion"
date: 2026-09-30
category: ai
type: guide
tags: [ai-course, mit, diffusion-model, flow-matching, generative-ai, diffusion-transformer, vae, latent-diffusion]
lang: en
series:
  name: "Reading MIT 6.S184"
  order: 8
tldr: "Lab 3 builds a conditional latent diffusion model on MNIST from scratch, in four stages: CFG training with label dropout (checked on a three-component Gaussian mixture), a diffusion transformer built piece by piece (Fourier time embedding, patchify, multi-head attention, adaLN-Zero, depatchify), a VAE, and finally the DiT trained inside the VAE's latent space. Problems and official solutions are public; submission goes through Gradescope on Canvas, which only enrolled MIT students can use."
description: "A guide to Lab 3 of MIT 6.S184 (IAP 2026), based on lab_three.ipynb and the official solutions on GitHub: shared components and MNIST in Parts 0–1, CFG in Part 2 (Question 2.2 training loss, 2.3 MLPConditionalVectorField, Sanity Check 2.4), the DiT in Part 3 (Questions 3.1–3.5), the VAE in Part 4 (Questions 4.1–4.7, with compute_loss matching eq. 83 of the notes), LatentCFGTrainer in Part 5, and a few mismatches between the lab and the notes."
draft: false
glossary:
  - term: "adaLN-Zero"
    aliases: ["adaLN zero"]
    definition: "An initialization for adaptive layer norm: the last layer of the conditioning MLP that produces scale, shift, and gate is initialized to zero, so each DiT block starts out close to the identity and training is more stable."
    context: "The recommended approach in MIT 6.S184 Lab 3, Question 3.3."
  - term: "patchify"
    aliases: ["patchifier"]
    definition: "Cuts an image into fixed-size patches and maps each to a d-dimensional token so a transformer can treat the image as a sequence; depatchify reverses it."
    context: "MIT 6.S184 Lab 3, Questions 3.2 and 3.4."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion)

> **Version note**: This post covers Lab 3 of [MIT 6.S184](https://diffusion.csail.mit.edu/2026/index.html) (IAP 2026). Problems come from [`labs/lab_three.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_three.ipynb) in [eje24/iap-diffusion-labs (branch 2026)](https://github.com/eje24/iap-diffusion-labs/tree/2026), checked against the official solutions in [`solutions/lab_three_complete.ipynb`](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_three_complete.ipynb). Theory references point to [lecture notes](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) §5–6. Access level A3: problems, solutions, notes, and recordings are all public; what's missing is grading feedback. Checked 2026-09-30.

**Series**: Previous [L4: U-Nets, DiTs, and Latent Space](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures-en) | Next [L5: Discrete Diffusion and Generating Language with CTMCs](/posts/ai/2026-09-30-mit-6s184-lecture-05-discrete-diffusion-en) | [Series overview](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)

This is the course's last lab, and it delivers on the promise in the course description: "at the end of the class, students will have built a latent diffusion model from scratch." The course site calls it "Lab 3: Diffusion Transformer and VAEs"; the notebook's own title is "A Conditional Generative Model for Images."

The first two labs did unconditional generation on 2D toy distributions. Lab 3 upgrades two things at once:

- **Conditional**: ask for "the digit 8," not just "a digit." That uses CFG from [L3B](/posts/ai/2026-09-30-mit-6s184-lecture-03b-classifier-free-guidance-en).
- **Images**: MNIST is resized to 32×32, so each image has 1024 dimensions. An MLP isn't enough; you need the diffusion transformer from [L4](/posts/ai/2026-09-30-mit-6s184-lecture-04-latent-spaces-architectures-en).

So finish L3B and L4 before opening this lab.

## Getting it, doing it, checking your answers

The course site's Labs section lists the steps: open the instructions, download the `.ipynb` from GitHub, work in whatever Jupyter environment you like (the site suggests Google Colab, and Lab 3 has a Colab link), then export to PDF and submit to Gradescope via Canvas, **without clearing cell outputs**.

Readers outside MIT get stuck at the last step, since Canvas is for enrolled students. The substitute is checking against the official solutions. Right under the Labs section, the site says "Stuck? Solutions can be found here," linking to the same repo.

Two practical notes:

- **You need a GPU.** Comments in both large training cells say you should have reasonable results in about 15 A100 minutes. Free-tier Colab GPUs are much slower, so cut the step counts for a first run.
- **The notebook calls this lab optional** and strongly recommends not using ChatGPT, Gemini, Claude, or any other LLM to write the code for you, or you'd be robbing yourself of a chance to get your hands dirty. This guide follows the same spirit: it explains what each question tests and doesn't paste full solutions.

The README changelog has two Lab 3 fixes: a guidance embedding dimension bug fixed on 3/12/25, and a bug in the solutions' sampling of the conditioning variable fixed on 3/13/25. Both predate IAP 2026, so the version on branch `2026` includes them.

## Parts 0–1: upgrade the old components, meet MNIST

**Part 0** has no coding, but it's worth reading because it shows what "conditional" looks like in code:

- `Sampleable` becomes `LabeledSampleable`, whose `sample()` returns both samples and labels. In the notebook's words, every distribution is now formally a **joint distribution** over data and labels. This matches sampling `(z, y) ~ p_data(z, y)` in eq. (58) of the notes.
- Probability paths, ODEs/SDEs, and simulators now accept arbitrary shapes `b ...` (images are `b c h w`) and pass the condition y along through `**kwargs`.
- In the Gaussian mixture `GMM`, a sample's label is the component it came from. You use it to check CFG before moving to images.

**Part 1** loads MNIST (resized to 32×32 and normalized) and plots a few digits along the `LinearAlpha`/`LinearBeta` Gaussian path from t=0 to t=1. The lab keeps the course's time convention: t=0 is pure noise, t=1 is data.

## Part 2: CFG

Part 2 opens by re-deriving L3B in markdown: vanilla guidance, the classifier term, scaling by w, and the switch to `(1−w)·u(x|∅) + w·u(x|y)`. If you read it side by side with the notes, watch out: **the notebook swaps the roles of `a_t` and `b_t`.** The notebook writes `u_t(x|y) = a_t x + b_t ∇log p_t(x|y)`; eq. (59) in the notes writes `a_t ∇log p_t(x|y) + b_t x`. Different names, same math.

In code, the null label ∅ is just one more integer. MNIST uses 0–9, so the notebook suggests hardcoding ∅ as 10.

### Question 2.2: the CFG training loss

This question turns eqs. (63)–(64) and Algorithm 5 into `get_train_loss`. The notebook's plain-English version has five steps:

1. Sample an image z and a label y from `p_data`.
2. With probability η, replace y with ∅.
3. Sample t ~ U[0,1].
4. Sample x from the conditional probability path `p_t(x|z)`.
5. Regress `u_t^θ(x|y)` onto the conditional vector field.

The easiest trap is step 3. The hints warn you **not to mix up `torch.rand` and `torch.randn`**; only the former is uniform on [0,1].

One naming mismatch: the question text asks you to fill in `CFGFlowTrainer.get_train_loss`, but the class in the code cell is called `CFGTrainer`. It's the same method.

**What to compare against the solution**: the official solution changes labels with a `torch.rand(...) < eta` mask; t is multiplied by `(1 − eps)` so it never hits exactly 1; the loss is the element-wise squared error, averaged.

### Question 2.3: `MLPConditionalVectorField`

Implement `forward`: the network takes x, t, and y. y is an integer label, so it goes through an embedding layer first and is then fed to the MLP together with x and t. This is what notes §6.1 means by "in low dimensions, concatenating x, y, and t into an MLP is enough."

### Sanity Check 2.4: a three-component Gaussian mixture

Combine `CFGTrainer`, `CFGVectorFieldODE`, and `MLPConditionalVectorField` and train on three Gaussians arranged in a triangle, with η=0.25 and null label 3. The output has three panels: the target, conditional samples for each component, and unconditional samples using the null label.

`CFGVectorFieldODE` is already written, and its `drift_coefficient` is worth reading: each step calls the network **twice**, once with y and once with the null label, then combines them as `(1−w)·unguided + w·guided`. L3B's point that CFG doubles the network calls is right there in the code.

**Try it**: this cell has a `guidance_strength` knob with the comment "try changing me!" Run it at 1.0, 3.0, and 5.0 and watch whether each component's points get tighter. That's the 2D version of L3B's "CFG pushes toward the modes."

## Part 3: a diffusion transformer from scratch

The notebook introduces this part "in the spirit of banging your head against a wall": you write the whole transformer yourself. Read it alongside notes §6.1.2 and Remark 29.

| Question | Component | Task |
|---|---|---|
| 3.1 | `FourierEncoder` | map scalar t to cos/sin features |
| 3.2 | `Patchifier` | `b c 32 32` → convolution → rearrange into a `b n d` token sequence |
| 3.3 | `MHA`, `DiffusionTransformerLayer`, `DiffusionTransformer` | multi-head self-attention, one DiT block, a stack of depth blocks with positional encodings |
| 3.4 | `Depatchifier` | `b n d` → norm → MLP → rearrange → convolution → `b 1 h w` |
| 3.5 | `DiffusionTransformerFlowModel` | embed t and y, add them, patchify, run the DiT, depatchify |

A few places worth pausing:

- **3.1's frequencies differ from the notes.** Eq. (69) in the notes uses a geometric sequence between `w_min` and `w_max`; the notebook draws frequencies `w_i` from a standard normal, and the official solution makes them learnable parameters. The notes already say the exact form of TimeEmb isn't essential, and here's a live example.
- **3.2's convolution is the patchify.** The notes describe patchify as reshaping and then multiplying by a matrix; the notebook does the same thing with one convolutional layer. The question also warns that the input channel count c won't be 1 once you train in latent space.
- **3.3 recommends working top-down.** Write `DiffusionTransformer` first (learning positional encodings with `nn.Parameter(torch.randn(n_tokens, dim))`), then one block, then attention. Blocks use **adaLN-Zero**: initialize the last layer of the conditioning MLP to zero so the residual branches barely act at first, which stabilizes training. Scale and shift modulate as `x * (1 + γ) + β`, with a gate α on each residual branch, and the feed-forward layer is suggested as `[dim, 4*dim, dim]`. This DiT conditions only on class labels, so it has **no cross-attention**, consistent with the last sentence of Remark 29 in the notes.
- **3.5 combines conditions by addition.** The hint suggests `nn.Embedding` with 11 classes (10 digits plus the null label), then **adding** the time embedding and class embedding to form the condition passed to every block's adaLN.

<details>
<summary>Training setup (notebook defaults)</summary>

```text
pixel-space DiT: img_size=32, patch_size=4, num_layers=8, dim=256, heads=8, final_dim=10, n_classes=11
trainer: η=0.35, null_label=10, num_steps=20000, lr=0.4e-3, batch_size=256
visualization: 10 samples per class, 100 Euler steps, guidance scale w ∈ {1.0, 3.0, 5.0}
```

patch_size=4 splits a 32×32 image into 8×8 = 64 tokens.

</details>

After training, the notebook generates a row per digit at w=1, 3, and 5, your own version of Figure 13 in the notes (MNIST at w=1, 2, 4).

## Part 4: a VAE

The architecture follows the notebook: the encoder maps `b 1 32 32` to `z_mean` (shape `b c h w`) and a **learned scalar** `z_logvar`; the decoder symmetrically outputs `x_mean` and a scalar `x_logvar`. This is exactly what the notes describe: many implementations, including the lab, fix the variances to learned constants to avoid pathological behavior when learning them.

| Question | Component | Recipe |
|---|---|---|
| 4.1 | `ResidualBlock` | save skip → GroupNorm → 3×3 conv → activation → 1×1 conv → add skip |
| 4.2 | `AttnBlock` | rearrange to `b (h w) c` → norm + `MHA` + residual → norm + feed-forward + residual |
| 4.3 | `EncoderBlock` | two residual blocks → one attention block → (optional) stride-2 conv downsample |
| 4.4 | `Encoder` | initial conv → one encoder block per hidden channel, no downsampling on the last → norm + 1×1 conv to `z_mean` |
| 4.5 | `DecoderBlock` | two residual blocks → one attention block → (optional) upsample + conv |
| 4.6 | `Decoder` | one decoder block per hidden channel, no upsampling on the last → norm + 1×1 conv to `x_mean` |
| 4.7 | `VAE.compute_loss` | implement the VAE loss |

4.2 reuses the `MHA` from Part 3, so if Part 3 isn't done, Part 4 is blocked too.

### Question 4.7: which equation compute_loss actually matches

The question says to implement `L_VAE(φ, θ)` "from the main text (display (85))," and the official solution's docstring says "See display 85." But **in the 2026 notes, eq. (85) is a condition on CTMC rate matrices in §7**, unrelated to VAEs. The content that matches is **eq. (83)**: the four terms for reconstruction error, decoder confidence, latent variance, and latent mean. The numbering was probably not updated after the notes were revised.

Two observations when comparing against the official solution:

- The solution's reconstruction term is `(x − x_mean)² / exp(x_logvar) + x_logvar` and its KL term is `β · (z_mean² + exp(z_logvar) − z_logvar − 1)`, each averaged with `.mean()`. The structure matches eq. (83), but the constants (½, d/2, and so on) and the summation differ, so **check structure, not constants**.
- β shows up with three values: the `VAE` class defaults to 0.1, the Part 4 training cell uses 10.0, and a comment in Part 5 says 1.0. The notes' practical remarks say modern autoencoders use very small β (β≪1). Treat it as an experiment: change β and see whether reconstruction quality or latent interpolation breaks first.

<details>
<summary>Training setup (notebook defaults)</summary>

```text
VAE: data_channels=1, hidden_channels=[16, 32, 64, 128], beta=10.0
trainer: batch_size=64, num_steps=5000, lr=1e-3, warmup_steps=500
```

With four hidden channels and downsampling in the first three blocks, 32×32 becomes 4×4, so the latent has shape `128×4×4`.

</details>

After training, the notebook linearly interpolates between the latents of two MNIST digits in 10 steps and decodes them. That's the most direct way to check whether the latent space is "walkable," a hands-on test of the "bad latent space" problem from L4.

## Part 5: LatentCFGTrainer

The last question is a single method: `LatentCFGTrainer.get_train_loss`. The hint: adapt `CFGTrainer.get_train_loss`, but instead of sampling from `path.p_data`, sample images directly from MNIST and pass them through the encoder **inside `torch.no_grad()`**. The VAE is already trained and frozen at this point; no gradients should flow back into it.

This is the five-step recipe from L4's Remark 32 and Slides 4: data → encode to latents → CFG flow matching on latents → sample → decode.

Checking against the official solution:

- After encoding, it draws one latent sample with reparameterization (`z_mean + exp(0.5·z_logvar)·ε`) and uses it as the data point z in the usual CFG flow. Remark 32 in the notes also samples from `q_φ(z|x)` during training.
- At sampling time it decodes with the **mean** returned by `vae.decode`, matching Remark 32's advice to take the mean rather than sample, avoiding noise artifacts.

<details>
<summary>Training setup (notebook defaults)</summary>

```text
latent path: p_simple_shape=[128, 4, 4]
latent DiT: img_size=4, patch_size=1, num_layers=8, c=128, dim=256, heads=8, final_dim=10, n_classes=11
trainer: η=0.35, null_label=10, num_steps=10000, lr=0.4e-3, batch_size=256
```

patch_size=1 means the 4×4 latent becomes 16 tokens, each a 128-dimensional position.

</details>

One thing worth computing yourself: this latent holds 128×4×4 = 2048 numbers, more than the 32×32 = 1024 pixels. The token count drops from 64 to 16, but the total number of values doesn't shrink. MNIST is already tiny; the point of this lab is **getting the whole latent diffusion pipeline to run end to end**. The memory savings L4 talks about show up with high-resolution images.

## After this lab, you should be able to

- Implement label dropout with a mask and explain why each CFG sampling step calls the network twice.
- Write multi-head self-attention, an adaLN-Zero DiT block, and patchify/depatchify without a reference implementation.
- State what a VAE encoder outputs, which terms make up its loss, and what β trades off.
- Plug a trained VAE into flow matching training and explain why the encoder call belongs inside `torch.no_grad()`.

**Tonight**: do only Part 2. Write Questions 2.2 and 2.3, run Sanity Check 2.4, change `guidance_strength` from 1 to 5, and compare screenshots. It's a small MLP on 2D data (3000 steps by default), nowhere near the A100-scale resources the notebook mentions for later parts, so you can start here.

## Further reading

- Transformers and attention from scratch: [Stanford CS224N: Transformers](/posts/ai/2026-08-22-cs224n-transformers-en), [CMU 11-785 L18: Attention and Transformers](/posts/ai/2026-08-22-cmu-11785-18-attention-transformers-en)
- The VAE ELBO derivation: [CMU 11-785 L22: Variational Autoencoders](/posts/ai/2026-08-22-cmu-11785-22-variational-autoencoders-en)
- The previous lab: [Lab 2: Flow Matching and Score Matching by Hand](/posts/ai/2026-09-30-mit-6s184-lab-02-flow-score-matching-en)

## References

- [MIT 6.S184 course site (IAP 2026)](https://diffusion.csail.mit.edu/2026/index.html) — Labs section: submission steps, Lab 3 Colab link, solutions link
- [eje24/iap-diffusion-labs (branch 2026)](https://github.com/eje24/iap-diffusion-labs/tree/2026) — README changelog (Lab 3 fixes on 3/12/25 and 3/13/25)
- [lab_three.ipynb (problems)](https://github.com/eje24/iap-diffusion-labs/blob/2026/labs/lab_three.ipynb) — Parts 0–5, Questions 2.2–5.1, training setups
- [lab_three_complete.ipynb (official solutions)](https://github.com/eje24/iap-diffusion-labs/blob/2026/solutions/lab_three_complete.ipynb)
- [Holderrieth & Erives, An Introduction to Flow Matching and Diffusion Models (lecture notes PDF)](https://diffusion.csail.mit.edu/2026/docs/lecture_notes.pdf) — eqs. (58), (59), (63)–(65), Algorithm 5; §6.1 eqs. (68)–(69), Remark 29; §6.2 eq. (83), Remark 32; §7 eq. (85)
- [Peebles & Xie (2023), Scalable Diffusion Models with Transformers](https://arxiv.org/abs/2212.09748) — notebook reference [1], source of the DiT diagram
- [Rombach et al. (2022), High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752) — notebook reference [2]
