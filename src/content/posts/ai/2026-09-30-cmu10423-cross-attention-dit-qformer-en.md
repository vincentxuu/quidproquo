---
title: "CMU 10-423 L14–L15: Cross-Attention, DiT, Prompt-to-Prompt, and Q-Former"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, multimodal, attention, diffusion-transformer, diffusion-model, image-generation]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 14
tldr: "Where does the text condition enter an image generator? CMU 10-423 L14 answers with cross-attention: queries come from the image's latent representation and keys and values come from the prompt, so every latent pixel gets a probability distribution over which words to look at. That attention map is useful. Classifier-free guidance makes generations follow the prompt more closely, and Prompt-to-Prompt copies old attention maps into a run with an edited prompt so only part of the image changes, with no retraining. DiT swaps the UNet for a Transformer and injects conditions with adaLN-Zero. In the first half of L15, the Q-Former uses a small set of learnable queries to connect a frozen image encoder to a frozen LLM, which is what HW4 asks you to build."
description: "A guide to Lecture 14 and the first half of Lecture 15 of CMU 10-423/623/723 Generative AI (Spring 2026): from self-attention to cross-attention, where LDM's queries, keys, and values come from, the classifier-free guidance algorithm, Diffusion Transformer's adaLN-Zero and GFLOPs scaling results, Prompt-to-Prompt's attention swapping and alignment problem, and the learnable-query designs of the BLIP-2 Q-Former, MetaQueries, and Perceiver IO, plus how they tie into HW4."
draft: false
glossary:
  - term: "Q-Former"
    definition: "BLIP-2's Querying Transformer: a small set of learnable query vectors uses cross-attention to pull a fixed number of features out of a frozen image encoder and hands them to a frozen LLM."
    context: "The topic of L15 and the module HW4's programming part asks you to implement."
  - term: "Prompt-to-Prompt"
    definition: "An image editing method from Hertz et al. 2022: record the cross-attention weights while generating with the original prompt, then copy them in when rerunning with an edited prompt, so the layout stays the same and only the part tied to the changed words moves. No training and no mask needed."
    context: "L14 uses it to show what cross-attention weights are good for."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer)

**Video status: Recordings require sign-in or course authorization.** [Source details](#course-video-sources)

**This post is based on the Spring 2026 offering of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It's post 14 in the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series. The main materials are the [Lecture 14 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p.pdf) (plus an [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p-ink.pdf)) and the Querying Transformer first half of the [Lecture 15 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf). The scaling-laws second half is in [post 16](/posts/ai/2026-09-30-cmu10423-scaling-laws-moe-en).

The recordings live on CMU's Panopto and aren't available outside CMU, so this post relies on the slides alone. The Q-Former part of L15 is almost entirely paper figures with no slide text, so the description below comes from the captions of the BLIP-2, MetaQueries, and Perceiver IO figures the slides reproduce. The schedule lists no readings for these two lectures. I checked every fact against the official materials on 2026-09-30.

The [previous post](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en) said LDM reads the prompt through cross-attention without taking it apart. This post answers: **where in the model does the text condition enter, and why can editing the prompt change only part of the image?**

## Course video sources

The course links Spring 2026 recordings through SCS Panopto. The anonymous page did not load the videos and prompted sign-in. This article follows the public slides and assignments; recording access is governed by course authorization.

Course and recording entries:

- [CMU 10-423/623/723 Spring 2026 — official Panopto recordings](https://scs.hosted.panopto.com/Panopto/Pages/Sessions/List.aspx#folderID=%222fe20532-6905-4f5e-b391-b3c901534e6b%22)
- [cmu-10-423-generative-ai — official course materials and recording index](https://www.cs.cmu.edu/~mgormley/courses/10423/)

## Cross-attention: queries and keys/values come from different places

L14 starts by reviewing scaled dot-product attention from L2: one input sequence x is multiplied by W_q, W_k, and W_v to get queries, keys, and values. Cross-attention changes one thing. **Queries come from one sequence y (length n), while keys and values come from another sequence x (length m).**

<details>
<summary>Matrix form</summary>

- Q = Y·W_q ∈ ℝ^{n×d}
- K = X·W_k ∈ ℝ^{m×d}
- V = X·W_v ∈ ℝ^{m×d}
- S = QKᵀ/√d ∈ ℝ^{n×m}
- A = softmax(S), Y′ = AV

</details>

The slides start with translation. m is the number of source-language tokens ("estoy llegando tarde") and n is the number of target-language tokens ("I am running late"). Each target word's attention weights form a probability distribution over the source words.

Now switch to LDM:

- **Queries** come from a layer of the UNet
- **Keys and values** come from the text encoder's representation of the prompt
- m is the number of prompt tokens; n is the number of latent dimensions, or the number of pixels if there's no compression
- Each (latent) pixel's attention weights form a probability distribution over the prompt tokens

The slides add one note: the real attention and cross-attention blocks are multi-head.

This view, in which every pixel has a distribution over the words it looks at, is the foundation for Prompt-to-Prompt later on.

## Classifier-free guidance: making generation follow the prompt

The slides frame a trade-off. Diffusion models, unlike GANs, are good at producing diverse samples, but once you add a condition, that diversity can pull generations away from the prompt. [Classifier-free guidance](https://arxiv.org/abs/2207.12598) (CFG) pulls them back.

The same noise model learns two modes that share parameters: a conditional ε_θ(z_t, t, c), and ε_θ(z_t, t, ∅) with the condition replaced by a null embedding ∅. Sampling combines the two:

<details>
<summary>The sampling algorithm on the slide</summary>

1. w = 7.5
2. c = tokenize("a cat with green eyes"), c∅ = tokenize("")
3. z_T ∼ N(0, I)
4. At each step: ε_θ ← (1 + w)·ε_θ(z_t, t, c) − w·ε_θ(z_t, t, c∅), then compute z_{t−1} with the DDPM update

</details>

The rule on the slide: a larger w makes samples match the condition more closely, at the cost of diversity. The next two pages show figures from Ho & Salimans in which samples look more and more like their class as the guidance scale rises from 0 to 3.

## Diffusion Transformer: the UNet is optional

The slides' timeline starts with the UNet for medical image segmentation in 2015 and runs through DDPM and Dhariwal & Nichol, all using UNets. Everyone kept using it "because it seems to work well". [DiT](https://arxiv.org/abs/2212.09748) showed you don't actually need the UNet.

The DiT backbone is essentially a ViT with a few tweaks (see [L5](/posts/ai/2026-09-30-cmu10423-cnn-bert-vit-en)):

- **Input**: a noisy latent, a timestep, and a class label (or other conditioning)
- **Output**: a mean and a covariance of fixed size
- After a final LayerNorm, a linear layer turns the T token embeddings into the fixed-size output

### How the condition goes in: adaLN-Zero

The slides call the conditioning mechanism the interesting part of the DiT block. The original paper tried four options:

1. In-context conditioning
2. A cross-attention block
3. Adaptive LayerNorm (adaLN)
4. adaLN with zero initialization (adaLN-Zero)

adaLN-Zero worked best empirically. The key idea is to learn an MLP that outputs the scale and shift parameters for LayerNorm and the residual connections.

Note the contrast with LDM. LDM reads the condition through cross-attention; DiT's best variant uses adaLN. That difference matters in HW4.

### Measuring scale in GFLOPs, not parameters

The slides define two metrics. **GFLOPs** measure the compute of one forward pass, independent of hardware. **FID** passes real and generated images through a pretrained Inception-v3, takes mid-layer features, fits a multivariate Gaussian to each set, and computes the Fréchet distance between the two Gaussians. Lower is better.

Shrinking DiT's patch size raises GFLOPs without adding parameters, so DiT studies FID against GFLOPs. The slides leave a question here: if the patch size drops from 4 to 2, how much does total compute grow?

The scaling results come in three points:

1. GFLOPs and FID are strongly correlated: more compute, better FID
2. For the same training compute, larger DiT models are more compute-efficient than smaller ones
3. At similar compute, DiT also beats an LDM with a UNet backbone (the slides compare LDM-4 and DiT-XL/2)

## Prompt-to-Prompt: change the prompt, change only that part

### Why it's needed

The slides list the problems with two older approaches:

- **Fix the random seed and change the prompt**: the simplest baseline, but the whole layout can change dramatically. It feels like generating an unrelated image, not editing
- **Mask-based editing** (e.g. [Blended Diffusion](https://arxiv.org/abs/2111.14818)): a mask marks which region stays fixed and the text decides how the rest changes, but the user has to draw the mask

[Prompt-to-Prompt](https://arxiv.org/abs/2208.01626) aims to edit with text alone, no mask.

### How it works

It assumes a pretrained LDM and **involves no training at all; it only changes how samples are drawn**:

1. Encode the original prompt y, run diffusion once, and record the attention weights A_{T−1}, …, A_1 at every step
2. Encode the edited prompt y* and run diffusion again:
   - Reuse the initial noise z_T from the first run
   - Until timestep τ, use the attention weights from the first run
   - After that, switch to the attention weights computed in this run
   - Whichever weights you use, you still attend to y*
3. If running in latent space, decode back to pixel space at the end

The slides pose a question here: why use the original attention weights for a while before switching to the new ones? The answer is written on the inked version, and I didn't transcribe it. You can work it out against the Prompt-to-Prompt results slide that varies the switching point.

### When the shapes don't match

If y and y* have different lengths, A_t and A*_t won't have the same shape. The slides' fix is to swap in only the matching parts:

- The latent dimension stays constant
- With a fixed-length text encoder (e.g. CLIP's 77 positions, padded with `<PAD>`), the prompt dimension is also constant
- But the words may not line up. The slides' example changes "orange cat sitting" to "big tabby cat sitting" and copies the attention weights for "orange" to both "big" and "tabby"

The results slide explains that word-level cross-attention swapping automatically finds which regions of the image should stay fixed and which should change. Beyond word swaps, Prompt-to-Prompt supports down-weighting a descriptor and inserting phrases to change style or content. Each type of edit maps to a different cross-attention manipulation.

## First half of L15: the Querying Transformer

### Starting from PaliGemma's linear projection

L15 opens by recalling PaliGemma from the [previous post](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en): SigLIP image embeddings pass through one linear projection into the LLM, and the LLM has to learn how to use them on its own. The next three slides show a different way to connect the two.

### BLIP-2's Q-Former

[BLIP-2](https://arxiv.org/abs/2301.12597) places a lightweight Querying Transformer between a frozen image encoder and a frozen LLM, and pretrains it in two stages.

**Stage 1: vision-language representation learning.** The Q-Former takes a set of learnable queries. The queries run self-attention among themselves and read the image encoder's output through cross-attention (in every other block). Three objectives are optimized jointly, each with a different self-attention mask that controls how queries and text interact:

| Objective | Mask |
|---|---|
| Image-Text Matching | Bidirectional |
| Image-Grounded Text Generation | Multimodal causal |
| Image-Text Contrastive Learning | Unimodal |

**Stage 2: vision-to-language generative learning.** The Q-Former's output queries pass through a fully connected layer that maps them to the LLM's input dimension, and they go into the frozen LLM ahead of the text. A decoder-only LLM (e.g. OPT) generates text directly. With an encoder-decoder LLM (e.g. FlanT5), the prefix text goes to the encoder and the decoder generates the suffix.

The slides follow with a full page of zero-shot instructed image-to-text examples.

### MetaQueries and Perceiver IO

- **[MetaQueries](https://arxiv.org/abs/2504.06256)**: the slide title is "Simpler yet effective". Learnable queries attach directly to a frozen multimodal LLM, pull out conditions for generation, and pass them through a connector to a diffusion model. Training uses only a denoising objective on paired data. The figure's tagline reads "Render unto diffusion what is generative, and unto LLMs what is understanding"
- **[Perceiver IO](https://arxiv.org/abs/2107.14795)**: labeled a "Historical Note". A smaller latent array reads an input of any size through cross-attention, does most of its computation in latent space, and decodes to an output of any size with an output query array

What the three share: **a fixed number of learnable queries that pull the needed information out of a variable-length input from another modality.**

### This is what HW4 asks you to build

HW4's programming part (40 points) ties L14 and L15 together. The setup in hw4.pdf:

- **GPT-2 (frozen)**: turns text into per-token features
- **DiT (frozen)**: a class-conditional diffusion transformer pretrained on CIFAR-10, which originally reads a class embedding through adaLN
- **Q-Former (trained)**: 2–8 learnable queries read GPT-2's hidden states through cross-attention and output per-layer conditioning vectors that replace DiT's original class embedding

The starter code already implements CFG, and training drops the text condition with probability 0.1. The assignment ends by having you inspect cross-attention maps to see what the Q-Former pulls out of the LLM. Details are in the [HW4 post](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en).

## Assessment

The schedule puts Quiz 4 on March 16, covering the text-to-image part of L12 through L15. The questions aren't available.

## How to read these two lectures

1. Match the five-line matrix form of cross-attention to the translation example before reading the LDM slide. Once you're clear on what n and m stand for, Prompt-to-Prompt's shape problem is intuitive.
2. When reading DiT, put adaLN-Zero side by side with LDM's cross-attention. Both inject a condition: one adjusts LayerNorm's parameters, the other lets the image read the text.
3. The Q-Former slides are figures only, so open Figure 2 of the BLIP-2 paper and go through the three masks cell by cell.

**One thing to do tonight**: write down what Prompt-to-Prompt's `Edit(A_t, A*_t, t)` returns when t ≥ τ and when t < τ. Then think about the slide's question: what would happen to the layout if you used the new attention weights from the very first step?

## Further reading

- Hands-on practice with DiT, VAEs, and latent diffusion: [MIT 6.S184 Lab 3](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en), [MIT 6.S184 guide](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en)
- Another course's take on diffusion: [CS231n: Generative models — diffusion](/posts/ai/2026-09-30-cs231n-generative-models-diffusion-en)
- Definitions of access grades A0–A3: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

Series navigation: previous [L12–L13: Text-to-image, latent diffusion, and vision-language models](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm-en) | next [HW4: Text-to-image with a Q-Former](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026): home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L14 (Mar 9), L15 (Mar 11), Quiz 4 coverage
- [Lecture 14 slides: Cross-Attention / Diffusion Transformer / Prompt-to-Prompt](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p.pdf) ([inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture14-ldm-dit-p2p-ink.pdf))
- [Lecture 15 slides: Querying Transformer / Scaling Laws](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture15-querying-scaling.pdf)
- [HW4 handout (hw4.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) — the GPT-2 / DiT / Q-Former setup in the programming part
- [Ho & Salimans 2022: Classifier-Free Diffusion Guidance](https://arxiv.org/abs/2207.12598)
- [Peebles & Xie 2022: Scalable Diffusion Models with Transformers (DiT)](https://arxiv.org/abs/2212.09748)
- [Hertz et al. 2022: Prompt-to-Prompt Image Editing with Cross Attention Control](https://arxiv.org/abs/2208.01626)
- [Avrahami et al. 2021: Blended Diffusion for Text-driven Editing of Natural Images](https://arxiv.org/abs/2111.14818)
- [Li et al. 2023: BLIP-2](https://arxiv.org/abs/2301.12597)
- [Pan et al. 2025: Transfer between Modalities with MetaQueries](https://arxiv.org/abs/2504.06256)
- [Jaegle et al. 2021: Perceiver IO](https://arxiv.org/abs/2107.14795)
