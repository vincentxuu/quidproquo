---
title: "MIT 6.5940 L14 LLM Post-Training: From SFT and RLHF to Fine-Tuning That Touches 1% of the Weights"
date: 2026-09-30
category: ai
type: guide
tags: [mit-65940, ai-course, course-guide, mit, fine-tuning, lora, peft, multimodal]
lang: en
series:
  name: "Reading MIT 6.5940"
  order: 18
tldr: "Lecture 14 has three parts. Fine-tuning: SFT runs next-token prediction on desired answers, RLHF trains a reward model and then fine-tunes with KL-penalized RL, and DPO collapses both stages into one supervised step. Then comes a chain of PEFT methods: BitFit tunes only biases, Adapters add small layers but slow inference, Prompt/Prefix-Tuning eat input length, LoRA fixes latency with a low-rank branch you can merge back, QLoRA stores the backbone in NF4, and BitDelta compresses the fine-tune delta to 1 bit. Multimodal LLMs: Flamingo uses cross-attention, PaLM-E and VILA feed images in as tokens, and VILA-U can also output images. Prompt engineering: zero/few-shot, CoT, and RAG."
description: "A guide to Lecture 14 of MIT 6.5940 EfficientML (Fall 2024), LLM Post-Training: SFT, RLHF, DPO; the trade-offs between BitFit, TinyTL, Adapter, Prompt-Tuning, Prefix-Tuning, LoRA, QLoRA, and BitDelta; the two multimodal designs behind Flamingo, PaLM-E, VILA, and VILA-U; plus in-context learning, chain-of-thought, and RAG. Includes a Fall 2026 comparison."
draft: false
glossary:
  - term: "PEFT"
    aliases: ["parameter-efficient fine-tuning"]
    definition: "Umbrella term for fine-tuning methods that update only a small subset of parameters (or add a few new ones) and freeze the rest. Each downstream task then needs only a small diff, not a full copy of the model."
    context: "The backbone of Lecture 14's first part, running from BitFit to BitDelta."
  - term: "QLoRA"
    definition: "Fine-tuning that stores the frozen backbone in 4-bit NormalFloat (NF4) and trains only LoRA branches. It also quantizes the quantization scaling factors (double quantization) and uses paged optimizer states that can be offloaded to CPU."
    context: "Lecture 14, pages 36–39. The slides' takeaway: fine-tuning LLMs becomes possible on mid-range and entry-level GPUs."
  - term: "BitDelta"
    definition: "Quantizes the difference (delta) between fine-tuned and base weights to 1 bit, keeping a single trainable scaling factor per tensor. Many fine-tuned variants can share one copy of base weights, which suits serving many fine-tunes at once."
    context: "Lecture 14, pages 40–42; work from Song Han's lab."
  - term: "Perceiver Resampler"
    definition: "The Flamingo module that compresses variable-size image features into a small fixed number of visual tokens: a set of learned queries attends over the image features, and the output count equals the number of queries."
    context: "Lecture 14, page 47, illustrated with 27 visual tokens and 5 queries."
---

> 🌏 [中文版](/posts/ai/2026-09-30-mit-65940-llm-post-training)

**This post is based on [MIT 6.5940](https://hanlab.mit.edu/courses/2024-fall-65940) Fall 2024.** It is post 18 in the [Reading MIT 6.5940](/posts/ai/2026-09-30-mit-65940-course-overview-en) series.

**Series**: previous [Fall 2026 supplement: Lab 1 GPU Basics](/posts/ai/2026-09-30-mit-65940-f26-lab1-gpu-basics-en) | next [L15 Long-Context LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm-en) | [Series overview](/posts/ai/2026-09-30-mit-65940-course-overview-en)

**Official materials**: [Lec14-LLM-Post-training.pdf](https://www.dropbox.com/scl/fi/ed32dovpq8no4571xmkzs/Lec14-LLM-Post-training.pdf?rlkey=5re66ef6shk3tr3v31ey6hzzo&st=d9n9h7ql&dl=0) (94 pages; all page numbers below refer to this PDF) and the [Lecture 14 recording](https://youtu.be/OCdwWfVoQ-Q). The F24 schedule puts this lecture on October 24, 2024, the same day the final project ideas came out. Access level **A3**: slides and video are public, and no lab goes with this lecture. Checked on 2026-09-30.

> A heads-up: the PDF cover says "Lecture 13 LLM Post-Training Part II", and page 26 contains an older, different Lecture Plan (mentioning PockEngine and LongLoRA). The course page and the video title both call this Lecture 14. This post follows the course page and uses the Lecture Plan on page 3 as its map.

**Fall 2026 comparison**: The [Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) also schedules "LLM Post Training" (Lecture 14, October 29). As of 2026-09-30 its slide and video links are still empty, so there is nothing to compare yet.

## Course video sources

Recording links have been checked against the official course page for the edition used by this article.

```youtube
url: https://www.youtube.com/watch?v=OCdwWfVoQ-Q
title: Lecture 14 recording (YouTube)
```

Original videos: [Lecture 14 recording (YouTube)](https://www.youtube.com/watch?v=OCdwWfVoQ-Q)

Course and recording entries:

- [mit-6-5940 — official course materials and recording index](https://hanlab.mit.edu/courses/2024-fall-65940)

## What this lecture is about

[Lecture 13](/posts/ai/2026-09-30-mit-65940-llm-deployment-en) asked how to run a trained LLM fast. This lecture steps back: a pretrained model can't act as an assistant or read images yet. How do you turn it into what you need at the lowest cost?

The Lecture Plan on page 3 has three parts:

| Part | Slides | Content |
|---|---|---|
| 1. LLM fine-tuning | 5–42 | SFT, RLHF (plus DPO), PEFT: BitFit, TinyTL, Adapter, Prompt-Tuning, Prefix-Tuning, LoRA, QLoRA, BitDelta |
| 2. Multimodal LLMs | 44–73 | Cross-attention (Flamingo), visual tokens (PaLM-E, VILA), image output (VILA-U) |
| 3. Prompt engineering | 75–93 | In-context learning, chain-of-thought, RAG |

The course is about efficiency, so the PEFT sequence gets the most detail here. Each method fixes a problem the previous one left behind. Read in order, they form one clear line of development.

## Part 1: Fine-tuning

### SFT, RLHF, and DPO: three ways to teach a model how to answer

- **SFT** (page 5): The objective is still next-token prediction. The only change is that the data contains only the answers you want. The slide uses Llama-2's SFT data, split into helpfulness and safety examples. Without SFT the answer is dry and terse. With it, the model sounds like customer support.
- **RLHF** (pages 7–9): Cites [Ouyang et al. (InstructGPT)](https://arxiv.org/abs/2203.02155). Static metrics such as BLEU and ROUGE can't capture creativity, truthfulness, or usefulness, so RLHF optimizes for human preference directly. There are two steps. First, train a reward model on pairwise comparisons. Then use RL to maximize reward, with a KL term that keeps the model close to a reference model so it doesn't overfit the reward model.
- **DPO** (pages 10–11): [Rafailov et al.](https://arxiv.org/abs/2305.18290) replace the two-stage, multi-model RLHF pipeline with one supervised step. No reward model and no RL algorithm. Page 11 uses the question "Where is Shanghai?": `y_win` is "Shanghai is a city in China" and `y_lose` is "Shanghai does not exist". The reference model's log probabilities can be computed offline in advance.

<details>
<summary>The three objectives (pages 8, 9, 10)</summary>

Reward model:

$$
\max_{r_\theta}\ \mathbb{E}_{(x,y_{win},y_{lose})\sim\mathcal{D}}\left[\log\sigma\big(r_\theta(x,y_{win})-r_\theta(x,y_{lose})\big)\right]
$$

RL fine-tuning:

$$
\max_{\pi_\theta}\ \mathbb{E}_{x\sim\mathcal{D},\,y\sim\pi_\theta(y|x)}\left[r_\theta(x,y)\right]-\beta\,\mathbb{D}_{KL}\left[\pi_\theta(y|x)\,\|\,\pi_{ref}(y|x)\right]
$$

DPO:

$$
\max_{\pi_\theta}\ \mathbb{E}\left[\log\sigma\left(\beta\log\frac{\pi_\theta(y_{win}|x)}{\pi_{ref}(y_{win}|x)}-\beta\log\frac{\pi_\theta(y_{lose}|x)}{\pi_{ref}(y_{lose}|x)}\right)\right]
$$

</details>

Other courses cover these three methods in more depth (see Further reading). 6.5940 spends seven slides on them and puts the weight on what comes next: whatever the training objective, **full fine-tuning updates billions of parameters, and storing dozens of fine-tuned copies costs even more**.

### PEFT: each method patches the previous one

Page 17 makes the case for PEFT with one comparison. Store a full 7B LLaMA for each of 1000 downstream tasks and you need 14 PB. Store a 14 MB adapter per task and you need 14 GB.

In slide order:

| Method | Pages | How it works | What it leaves unsolved |
|---|---|---|---|
| [BitFit](https://arxiv.org/abs/2106.10199) | 13–15 | Update only biases. BERT-base has 110M parameters but only 0.1M biases, over 1000x fewer | Matches or beats full fine-tuning on small-to-medium datasets; falls behind with more data |
| [TinyTL](https://arxiv.org/abs/2007.11622) | 16 | Tune only biases, and add lite residual modules for capacity. Keep activations small: lower resolution, avoid inverted bottlenecks | Built for on-device training; Lecture 21 goes deeper |
| [Adapter](https://arxiv.org/abs/1902.00751) | 17–19 | Insert small bottleneck layers into each Transformer layer and train only those. New tasks don't touch old ones | The extra layers sit in series at inference time and add latency |
| [Prompt-Tuning](https://arxiv.org/abs/2104.08691) | 20–22 | Replace a hand-written prompt with a trainable continuous vector prepended to the input. One batch can mix prompts for different tasks. Accuracy approaches full fine-tuning as models grow | Applied only at the first layer |
| [Prefix-Tuning](https://arxiv.org/abs/2101.00190) | 23–24 | Add trainable prefixes at every layer; consistently beats embedding-only tuning | See below |

Page 25 spells out what Prompt-Tuning and Prefix-Tuning share: both **lengthen the input**. That slows inference and uses up sequence length you could otherwise use. The slide then poses the question for the whole section: can we fine-tune without adding any inference latency?

### LoRA: a branch during training, merged away at inference

**Intuition.** Adapters are slow because the extra layers sit in series on the main path. Put the branch **in parallel** instead, and make it something you can add back into the original weight matrix. Then inference looks as if nothing changed.

**Mechanism** (pages 27–30). [LoRA](https://arxiv.org/abs/2106.09685) adds two small matrices beside each layer. A projects dimension d down to rank r and is initialized from a Gaussian. B projects r back to d and is initialized to zeros. Because B starts at zero, adding the branch doesn't change the output at first:

$$
h = xW + xAB = x(W + AB) = xW'
$$

After training, add $AB$ into $W$ to get $W'$. Inference costs nothing extra.

Pages 31–35 show LoRA outside language models. The same stable-diffusion-v1-5, with different LoRAs downloaded from Civitai, switches to ink-wash scenery, detail enhancement, and other styles.

### QLoRA and BitDelta: plugging quantization into fine-tuning

If you've done Lectures 5–6 on quantization, these two are easy to follow:

- **[QLoRA](https://arxiv.org/abs/2305.14314)** (pages 36–39): Keep LoRA's design, but store the frozen backbone in 4 bits. Three parts: a new data type, NormalFloat (NF4; page 37 lists its 16 exact values); double quantization, which also quantizes the scaling factors; and paged optimizers with CPU offloading. The slides conclude that mid-range and entry-level GPUs can now fine-tune LLMs.
- **[BitDelta](https://arxiv.org/abs/2402.10193)** (pages 40–42): The intuition is that fine-tuning adds little new information, so the weight delta should compress well. BitDelta quantizes the delta to **1 bit** and fine-tunes one scaling factor per tensor. Page 41 describes a fused binary GEMM kernel that combines dequantization with the matrix multiply, so 1-bit deltas stay quantized during batched inference. Page 42 applies it to multi-tenant serving, with all models fine-tuned from Mistral-7B. The slide's tagline: "The more you serve, the more you save!"

The whole PEFT line fits in one sentence: **first shrink what you train (BitFit, Adapter, Prompt), then remove the inference cost (LoRA), then cut storage and serving cost too (QLoRA, BitDelta)**.

## Part 2: Multimodal LLMs

Page 45 splits the ways to make an LLM see into two camps:

1. **Inject vision through cross-attention** (the Flamingo approach)
2. **Feed visual tokens as input** (the PaLM-E approach)

### Flamingo: freeze the LLM, insert cross-attention

[Flamingo](https://arxiv.org/abs/2204.14198) (pages 46–50) keeps the LLM frozen and inserts cross-attention layers between its layers so text can attend to images. Two components:

- **Perceiver Resampler** (page 47): compresses variable-size image features into a few fixed visual tokens. The slide's example: 27 visual tokens plus 5 learned queries give 32 keys and values, a 5×32 attention map, and 5 output tokens.
- **Gated cross-attention** (page 48): a tanh gate controls how much visual information gets in. The gate starts at 0, so the LLM behaves exactly as before at first. It's the same idea as initializing LoRA's B to zero.

### PaLM-E and VILA: turn images into tokens

- **[PaLM-E](https://arxiv.org/abs/2303.03378)** (page 51) feeds images, robot states, and 3D representations into the LLM as tokens. Page 52 continues to [RT-2](https://arxiv.org/abs/2307.15818), which outputs control signals directly.
- **[VILA](https://arxiv.org/abs/2312.07533)** (pages 53–64) comes from Song Han's lab and trains in three stages: projector training, pretraining, and SFT. Pages 54–57 list four findings:
  - Freezing the LLM during pretraining gives decent zero-shot results but no in-context learning. You need to unfreeze the LLM to get it.
  - Interleaved image-text data helps; image-text pairs alone are not enough.
  - Mixing text-only instruction data back in during SFT recovers text-only performance and also improves vision-language accuracy.
  - Original image resolution matters more than the number of tokens.

Page 64 shows VILA beating LLaVA-1.5 with the same prompts and the same base LLM. Pages 65–66 add two ways to handle high resolution: InternVL 1.5 tiles the image into 448×448 pieces plus a thumbnail, and CogAgent attaches a lightweight high-resolution encoder through cross-attention.

### VILA-U: output images too

[VILA-U](https://arxiv.org/abs/2409.04429) (pages 67–73) puts understanding and generation of video, images, and text into one autoregressive model. Two keys:

- **A unified vision tower**: trained with both an image-text contrastive loss (for semantics) and a reconstruction loss (to keep appearance, which generation needs), using residual quantization to turn images into discrete tokens.
- **Token in, token out**: every modality becomes tokens. Training can apply the LM loss to any token, and at inference decoders turn tokens back into text, images, or video.

Page 70 claims this is the first time a VLM with discrete visual tokens matches continuous-token models on understanding. The "tokenize the image, then generate autoregressively" idea returns in [Lecture 16's HART](/posts/ai/2026-09-30-mit-65940-efficient-vision-gan-video-pointcloud-en), this time from an efficiency angle.

## Part 3: Prompt engineering

The last part needs no training. It's about how you ask:

- **Zero-shot** (pages 75–76): Language models used to be one model per task, with one BERT for translation and another for sentiment. Once models got big enough, emergent abilities let one foundation model handle many tasks through prompts.
- **Few-shot / in-context learning** (pages 77–78): put a few demonstrations in the prompt. Page 78 gives two practical tips. Balance the number of examples per class for classification. Keep the demonstration format consistent.
- **Chain-of-thought** (pages 79–80): have the model write out intermediate reasoning steps. In zero-shot settings, adding "Let's think step by step" also works.
- **Prompts for diffusion** (pages 84–91): SDXL examples show the effect of adding descriptors one at a time, plus a negative prompt. Page 83 also includes a "grandma jailbreak" example, marked as already fixed.
- **[RAG](https://arxiv.org/abs/2005.11401)** (pages 92–93): an LLM can't memorize all long-tail knowledge. A simple RAG pipeline has four parts: an embedding model (evaluated with benchmarks like MTEB), a retriever, an optional reranker, and a language model that writes the answer.

## How to self-study this lecture

1. Make sure you understand the question on page 25 ("can we fine-tune without extra inference latency?") before reading $W' = W + AB$ on page 30. Together these two pages explain why LoRA beats Adapters.
2. Redo page 17's 14 PB vs 14 GB comparison for your own situation. How many fine-tuned variants do you keep? What does each cost stored in full, and what does it cost as a LoRA?
3. One thing you can do tonight: pick a LoRA checkpoint you've used (language or diffusion), open its config to find the rank r, estimate its parameter count as d×r×2, and compare that with the original layer.

## Further reading

- Same series: [L13 LLM Deployment](/posts/ai/2026-09-30-mit-65940-llm-deployment-en), [L5 Quantization Basics](/posts/ai/2026-09-30-mit-65940-quantization-basics-en) (background for NF4), [L15 Long-Context LLM](/posts/ai/2026-09-30-mit-65940-long-context-llm-en) (LongLoRA)
- RLHF/DPO: [CS224N Lecture 8: instruction tuning, RLHF, and DPO](/posts/ai/2026-08-22-cs224n-post-training-en), [CS224R L9: RLHF, DPO, and preference optimization](/posts/ai/2026-09-30-cs224r-rlhf-dpo-preference-optimization-en)
- LoRA/QLoRA: [CMU 11-868 L23: efficient fine-tuning of large models](/posts/ai/2026-09-30-cmu11868-peft-lora-en), [CS224N Tinker and LoRA](/posts/ai/2026-08-22-cs224n-tinker-lora-en)
- Multimodal: [CS231N L16: vision and language](/posts/ai/2026-09-30-cs231n-vision-language-en)

## Update Log

- 2026-10-10: Added course video sources and recording access notes.

## References

- [Lec14-LLM-Post-training.pdf (Fall 2024)](https://www.dropbox.com/scl/fi/ed32dovpq8no4571xmkzs/Lec14-LLM-Post-training.pdf?rlkey=5re66ef6shk3tr3v31ey6hzzo&st=d9n9h7ql&dl=0) — source for all page numbers, figures, and section boundaries in this post
- [Lecture 14 recording (YouTube)](https://youtu.be/OCdwWfVoQ-Q)
- [MIT 6.5940 Fall 2024 course page](https://hanlab.mit.edu/courses/2024-fall-65940) — schedule and dates
- [MIT 6.5940 Fall 2026 course page](https://hanlab.mit.edu/courses/2026-fall-65940) — Lecture 14 schedule and release status
- [Ouyang et al., Training language models to follow instructions with human feedback](https://arxiv.org/abs/2203.02155), [Rafailov et al., Direct Preference Optimization](https://arxiv.org/abs/2305.18290)
- [Ben Zaken et al., BitFit](https://arxiv.org/abs/2106.10199), [Cai et al., TinyTL](https://arxiv.org/abs/2007.11622), [Houlsby et al., Parameter-Efficient Transfer Learning for NLP](https://arxiv.org/abs/1902.00751)
- [Lester et al., The Power of Scale for Parameter-Efficient Prompt Tuning](https://arxiv.org/abs/2104.08691), [Li & Liang, Prefix-Tuning](https://arxiv.org/abs/2101.00190)
- [Hu et al., LoRA](https://arxiv.org/abs/2106.09685), [Dettmers et al., QLoRA](https://arxiv.org/abs/2305.14314), [Liu et al., BitDelta](https://arxiv.org/abs/2402.10193)
- [Alayrac et al., Flamingo](https://arxiv.org/abs/2204.14198), [Driess et al., PaLM-E](https://arxiv.org/abs/2303.03378), [Brohan et al., RT-2](https://arxiv.org/abs/2307.15818)
- [Lin et al., VILA](https://arxiv.org/abs/2312.07533), [Wu et al., VILA-U](https://arxiv.org/abs/2409.04429)
- [Lewis et al., Retrieval-Augmented Generation](https://arxiv.org/abs/2005.11401)
