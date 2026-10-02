---
title: "CMU 10-423 L12–L13: Text-to-Image, Latent Diffusion, and Vision-Language Models"
date: 2026-09-30
category: ai
type: guide
tags: [cmu-10423, ai-course, cmu, multimodal, text-to-image, latent-diffusion, vision-language-model, clip]
lang: en
series:
  name: "Reading CMU 10-423"
  order: 13
tldr: "CMU 10-423 spends two lectures connecting generative models to a second modality. The second half of L12 asks how text can steer an image: three routes (GANs, autoregressive Parti, diffusion with DALL-E 2 and Imagen) lead to latent diffusion, which compresses images into an autoencoder's latent space, runs DDPM there, and reads the prompt through cross-attention. L13 goes the other way and lets a language model read images: CLIP/SigLIP or a VQ-VAE turns the image into vectors or integers for a decoder-only Transformer. What separates read-only VLMs (PaliGemma, Qwen-VL) from VLMs that can also output images (LWM, Gemini) is whether image tokens are discrete."
description: "A guide to the second half of Lecture 12 and Lecture 13 of CMU 10-423/623/723 Generative AI (Spring 2026): conditional image generation tasks, three technical routes to text-to-image, latent diffusion's autoencoder, prompt model, cross-attention design, and compute motivation; VLM tasks, the CLIP contrastive loss and SigLIP, PaliGemma and Qwen-VL architecture and training, VQ-VAE and the straight-through estimator, and VLMs that output both text and images."
draft: false
glossary:
  - term: "VQ-VAE"
    definition: "Vector-Quantized VAE: each vector the encoder outputs is replaced by its nearest neighbor in a codebook, turning an image into a sequence of discrete indices (image tokens) that a decoder turns back into an image."
    context: "L13 uses it to explain how a VLM can generate images as tokens."
  - term: "SigLIP"
    definition: "A CLIP variant that replaces the softmax in the contrastive loss with a pairwise sigmoid, so a large batch spread across machines doesn't need to exchange the full similarity matrix."
    context: "PaliGemma's image encoder."
---

> 🌏 [中文版](/posts/ai/2026-09-30-cmu10423-text-to-image-vlm)

**This post is based on the Spring 2026 offering of [CMU 10-423/623/723 Generative AI](https://www.cs.cmu.edu/~mgormley/courses/10423/).** It's post 13 in the [Reading CMU 10-423](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en) series and opens the multimodal foundation models unit. The main materials are the second half of the [Lecture 12 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf) (from Conditional Image Generation onward; the DPO first half is in [post 11](/posts/ai/2026-09-30-cmu10423-ift-rlhf-dpo-en)) and the [Lecture 13 slides](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm.pdf) (plus an [inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm-ink.pdf)). Many L13 pages are marked "Slide from Henry Chai".

The recordings live on CMU's Panopto and aren't available outside CMU, so this post relies on the slides alone. I didn't transcribe the handwriting on the inked version. The schedule lists no readings for these two lectures. I checked every fact against the official materials on 2026-09-30.

The previous post, [HW3](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en), still dealt with text-only LLMs. This one returns to the diffusion models of [L7](/posts/ai/2026-09-30-cmu10423-diffusion-models-en) and [L8](/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en) and adds a new question: **how does text steer image generation, and how does a language model come to read an image?**

## Second half of L12: conditional image generation

The slides open with five tasks that generate an image under some condition:

- **Class-conditional**: given a class label, generate an image of that class. In the slides' framing, image classification learns p(y|x) and this task learns p(x|y)
- **Super resolution**: reconstruct a high-resolution version of a low-resolution image
- **Image editing**: inpainting (fill missing pixels), colorization (color a grayscale image), uncropping (extend past the image border)
- **Style transfer**: render one image's semantic content in another image's style
- **Text-to-image**: given a text description, generate a matching image

Text-to-image is the focus. Using a timeline from Bie et al. (2023), the slides split the field into three routes.

### Route 1: GANs

A conditional GAN appends a label embedding to the inputs of both the generator and the discriminator. Training works as in [L6](/posts/ai/2026-09-30-cmu10423-gans-en): hold one side fixed, update the other, and alternate. The slides then show text-to-image results from Reed et al. (2016).

### Route 2: Autoregressive (Parti)

[Parti](https://arxiv.org/abs/2206.10789) treats text-to-image as sequence-to-sequence translation:

1. **Image tokenization**: pretrain a ViT-VQGAN that turns images into a sequence of discrete image tokens
2. **Training**: the text prompt goes into an encoder (pretrained BERT), and the decoder outputs the image-token sequence
3. **Generation**: the ViT-VQGAN turns the generated tokens back into a high-quality image

The appeal is that the whole language-model training toolkit carries over.

### Route 3: Diffusion (DALL-E 2, Imagen)

- **DALL-E 2**: first pretrain CLIP. The text encoder is trained and then frozen; the image encoder is only used to produce CLIP image embeddings. Then train two diffusion models. The **prior** generates a CLIP image embedding from a CLIP text embedding, and the **decoder** generates an image from that image embedding
- **Imagen**: a text-to-image diffusion model followed by a super-resolution diffusion model, all in pixel space. The slides' verdict: effective, but the compute requirements are very high

That compute cost is where the next section starts.

## Latent diffusion: moving diffusion into latent space

### Motivation

The slides list the cost of running diffusion in pixel space. Guided Diffusion (Dhariwal & Nichol, 2021), for example, takes 150–1000 V100 days to train. Inference is slow too: the same model needs 5 days on an A100 to produce 50,000 images.

The core idea of [LDM](https://arxiv.org/abs/2112.10752):

1. Train an autoencoder whose latent space is perceptually equivalent to the images but much lower-dimensional
2. Freeze the autoencoder and train a diffusion model on the latents of real images, `z₀ = encoder(x)`
3. To generate, denoise from noise z_T down to z₀, then decode it into an image
4. Read the prompt through cross-attention in latent space

### Three components

The slides split LDM into three parts that map to prompt space, latent space, and pixel space:

| Component | What it does | How it's trained |
|---|---|---|
| **Autoencoder** | Compresses high-dimensional images (e.g. 1024×1024) into a low-dimensional latent space and reconstructs them faithfully | Trained ahead of time on images alone (no text), then frozen and reused for all later LDM training |
| **Prompt model τθ** | A Transformer LM that turns the prompt into a representation | The slides say it's learned alongside the diffusion model |
| **Noise model** | A UNet with cross-attention that predicts noise | Optimized jointly with the prompt model |

For the autoencoder, the original paper tried two families: a VAE-like model that regularizes the latents toward a Gaussian, and a VQGAN that quantizes in the decoder. After trying a whole zoo of options, it picked one with good compression and little information loss.

### Where cross-attention goes

LDM's reverse process is the DDPM from [L7–L8](/posts/ai/2026-09-30-cmu10423-variational-inference-vae-en), with x replaced by z and one extra condition, τθ(y). The slides pause on a question: how should the mean µθ(z_t, t, τθ(y)) depend on the prompt?

The answer is cross-attention inside the UNet:

- Cross-attention sits inside a larger Transformer layer within the UNet
- **Queries come from the current UNet layer**
- **Keys and values are replaced by the prompt representation**

The training algorithm is almost DDPM's: sample t and noise ε, and minimize `‖ε − ε_θ(x_t, t, τθ(y))‖²`. The only change is that the noise predictor also takes the prompt. The cross-attention formulas come in the [next post](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en).

The slides sum up the results: LDM reaches strong FID/IS scores with far fewer parameters, and because the most expensive step runs in a low-dimensional latent space, it's much more efficient than plain diffusion.

## L13: vision-language models

L13 states the direction up front. Text-to-image makes an **image-generating model** understand language, and the output is still an image. A VLM makes a **text-generating model** understand images, and the output is usually still text.

The slides list four common benchmark task types:

- **Visual reasoning**: decide whether a statement about an image (or a pair of images) is true
- **Visual grounding**: locate an object in an image from a text description
- **Visual question answering**: answer open-ended questions about an image
- **Caption generation**: describe an image

The high-level architecture fits in one sentence: turn both the image and the text into embedding vectors, feed them to a decoder-only Transformer, and predict the next token. The difference is how the image gets encoded. The slides give two options: a **CLIP encoder** learns continuous embeddings directly, and a **VQ-VAE encoder** turns the image into discrete tokens before an embedding lookup.

### CLIP: aligning two modalities with contrastive learning

[CLIP](https://arxiv.org/abs/2103.00020) has two encoders. The text side is an encoder-only Transformer; the image side is a ResNet-style CNN or a ViT. Both are linearly projected into a multimodal embedding space of the same dimension.

The slides first show an "intuitive but incorrect" objective: maximize the cosine similarity of matched pairs minus all the unmatched similarities. Then comes the correct version, a bidirectional softmax contrastive loss with temperature τ.

<details>
<summary>Two ways to read the correct objective</summary>

The slides interpret the correct objective as two conditional distributions:

- **Image-to-Text**: given image I_i, pick its matching text from N texts (softmax over columns)
- **Text-to-Image**: given text T_i, pick its matching image from N images (softmax over rows)

The loss maximizes the sum of the correct pairs' log-likelihoods under both distributions.

</details>

The same probabilities give you **zero-shot classification**: treat N class names as N texts and pick the one with the highest probability.

**SigLIP** is a fix for scale. CLIP's softmax needs the whole batch's similarity matrix. That's fine when the batch fits on one machine, but spreading it across many machines adds communication overhead. SigLIP replaces the softmax with a pairwise sigmoid, which partly solves the problem.

### VLMs that output only text

- **PaliGemma**: a SigLIP image encoder followed by a linear projection that places image embeddings in the same high-dimensional space as word embeddings, then Gemma (a 2B-parameter LLM). The slides stress that **the LLM itself learns how to use these image embeddings** in order to maximize the likelihood of the correct response
- **Qwen-VL**: shows a common freezing schedule. First freeze the LLM so image embeddings learn to align with the word space; then unfreeze everything for a while; finally freeze only the ViT image encoder
- **Llama 3.2 Vision**: the slides use it to show that VLMs, like LLMs, are evaluated on a broad set of image-text benchmarks

**Resolution** is another design choice. The original Qwen-VL resizes every image to 448×448 and turns it into a fixed-length set of 256 embeddings with absolute position embeddings. Qwen2-VL supports dynamic resolution instead. The ViT still works on 28×28 patches, so image dimensions are resized to multiples of 28, and position embeddings switch to 2D-RoPE.

### VQ-VAE: turning images into tokens you can generate

CLIP embeddings are continuous, so a VLM has no natural way to define a loss for generating them. For a VLM to draw, images first have to become discrete tokens, which brings back the image tokenization Parti used.

How [VQ-VAE](https://arxiv.org/abs/1711.00937) works:

1. A codebook of K D-dimensional vectors is learned during training; the indices 1…K are the "image tokens"
2. An encoder (e.g. a ResNet-style CNN) maps the image to N D-dimensional vectors
3. Each vector is replaced by its nearest codebook vector
4. A decoder reconstructs the image from the quantized vectors

The catch is that step 3's argmin isn't differentiable. The slides' fix is the **straight-through estimator**: use the gradient with respect to the quantized vector as an estimate of the gradient with respect to the encoder's output. The closer the two are, the better the estimate.

<details>
<summary>What the VQ-VAE objective does</summary>

The slides describe two pulls. Codebook vectors should sit near where the encoder's outputs actually land, and the encoder should "respect" the codebook instead of overfitting the training data. The fix adds two regularization terms to the standard VAE objective, each wrapped in the stop-gradient operator sg so that it updates only one side: one term updates only the codebook, and the other (scaled by β) updates only the encoder.

</details>

The slides cite the original paper's result: 128×128×3 ImageNet images compressed to 32×32×1 indices (K=512), with reconstructions close to the originals.

The slides' takeaway: VLMs with VQ-VAE-style encoders can define a loss over image codebook tokens and so can generate images. VLMs with CLIP-style encoders can only output text, but CLIP embeddings are more expressive than discrete codes and can perform better in some settings.

### VLMs that output both text and images

- **Large World Model (LWM)**: pretrain a VQGAN image tokenizer/detokenizer, convert every image in the data to discrete tokens ahead of time, and train the Transformer like any other LM. At test time, whenever a sequence of image tokens appears, convert it back to an image
- **Gemini**, **Qwen2.5-Omni**, **Qwen3-Omni**: the slides use these to show the "any-to-any" direction. The Qwen3-Omni slide lists text, image, audio, and video inputs, and text (including a Thinking mode) and speech outputs

## How these lectures connect to homework and assessments

- **HW4** (L12–L14) has four written sections that map directly onto this post: LDM (7 points), VQ-VAE (8), CLIP (4), and VLMs (18, using PaliGemma2). For the programming part, see the [HW4 post](/posts/ai/2026-09-30-cmu10423-hw4-qformer-text-to-image-en)
- **Quiz 4** (March 16) covers "L12, text-to-image part only" through L15. The questions aren't available

## How to read these two lectures

1. Start with the "Latent Diffusion Model" motivation slide in L12 (the Motivation / Key Idea columns) and the diagram spanning prompt, latent, and pixel space, then go back to the three routes. Once you know the destination, GAN, Parti, and DALL-E 2 stop reading like a list of models.
2. For the two pages on CLIP's correct objective in L13, write out the column softmax and row softmax on a small N=3 matrix yourself. Once you've computed a contrastive loss by hand, it sticks.
3. Finish by comparing PaliGemma and LWM. One turns the image into continuous vectors, the other into integer tokens. Which one can generate images directly, and why?

**One thing to do tonight**: open the "LDM: Cross-Attention in Noise Model" slide in L12 and write one sentence saying where the queries, keys, and values each come from. If you can write that sentence, the cross-attention formulas in the next post are just that sentence in matrix form.

## Further reading

- The math and code of diffusion and latent diffusion: [MIT 6.S184 guide](/posts/ai/2026-09-30-mit-6s184-flow-matching-diffusion-overview-en), [Lab 3: DiT, VAE, and latent diffusion](/posts/ai/2026-09-30-mit-6s184-lab-03-dit-vae-latent-diffusion-en)
- How another course teaches vision-language models: [CS231n: Vision and Language](/posts/ai/2026-09-30-cs231n-vision-language-en)
- Definitions of access grades A0–A3: [Global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en)

Series navigation: previous [HW3: Fine-tuning GPT-2 with LoRA](/posts/ai/2026-09-30-cmu10423-hw3-lora-gpt2-en) | next [L14–L15: Cross-attention, DiT, Prompt-to-Prompt, and Q-Former](/posts/ai/2026-09-30-cmu10423-cross-attention-dit-qformer-en) | [Series overview](/posts/ai/2026-09-30-cmu10423-generative-ai-overview-en)

## References

- [CMU 10-423/623/723 Generative AI (Spring 2026): home page](https://www.cs.cmu.edu/~mgormley/courses/10423/)
- [Course schedule](https://www.cs.cmu.edu/~mgormley/courses/10423/schedule.html) — L12 (Feb 23), L13 (Feb 27), Quiz 4 coverage
- [Lecture 12 slides: DPO / Text-to-image / Latent diffusion](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture12-dpo-text2img.pdf)
- [Lecture 13 slides: Vision-language models](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm.pdf) ([inked version](https://www.cs.cmu.edu/~mgormley/courses/10423/slides/lecture13-vlm-ink.pdf))
- [HW4 handout (hw4.zip)](https://www.cs.cmu.edu/~mgormley/courses/10423/homework/hw4.zip) — written-section points
- [Bie et al. 2023: RenAIssance: A Survey into AI Text-to-Image Generation in the Era of Large Model](https://arxiv.org/abs/2309.00810) — source of the slides' timeline
- [Yu et al. 2022: Scaling Autoregressive Models for Content-Rich Text-to-Image Generation (Parti)](https://arxiv.org/abs/2206.10789)
- [Rombach et al. 2022: High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752)
- [Radford et al. 2021: CLIP](https://arxiv.org/abs/2103.00020)
- [van den Oord et al. 2017: Neural Discrete Representation Learning (VQ-VAE)](https://arxiv.org/abs/1711.00937)
- [Beyer et al. 2024: PaliGemma](https://arxiv.org/abs/2407.07726)
- [Bai et al. 2023: Qwen-VL](https://arxiv.org/abs/2308.12966)
- [Liu et al. 2024: World Model on Million-Length Video And Language With Blockwise RingAttention (LWM)](https://arxiv.org/abs/2402.08268)
