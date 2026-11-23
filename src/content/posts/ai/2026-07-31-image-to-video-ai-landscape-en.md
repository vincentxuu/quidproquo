---
title: "The Image-to-Video Landscape: Architecture, Models, and Real Prices in 2026"
date: 2026-07-31
category: ai
type: deep-dive
tags:
  - image-to-video
  - video-generation
  - video-diffusion
  - diffusion-transformer
  - open-weights
  - veo
  - cosmos
lang: en
tldr: "Every serious image-to-video model in 2026 runs latent diffusion on a DiT backbone, so visual quality is no longer a useful axis for choosing one, and native audio has become standard. The real axes are self-hostability, whether the license covers your market, and dollars per second. Three traps: Sora's app and API are both shut down (2026-04-26 and 2026-09-24) with no official replacement; Wan 2.7 and Wan 3.0 are API-only, and downloadable weights stop at Wan 2.2; the Gemini API has shut down every Veo endpoint and replaced them with Gemini Omni 1.2 Flash (about $0.07/s at 720p)."
description: "A breakdown of the image-to-video generation pipeline: 3D causal VAE compression, DiT denoising, the four kinds of conditioning, and the speedups from step distillation and dropping classifier-free guidance. Plus actual per-second pricing for Gemini Omni Flash, Kling, and Runway taken from official pricing pages, and which open-weight models you can genuinely self-host today."
draft: false
---

> :globe: [中文版](/posts/ai/2026-07-31-image-to-video-ai-landscape)

Feed a model one image and one sentence, get a moving clip back. That is unremarkable in 2026 — but choosing a model is harder than it was two years ago, because visual quality has stopped being a useful discriminator. On [Artificial Analysis's image-to-video board, AA-Video-I2V v2.1](https://artificialanalysis.ai/video/leaderboard/image-to-video) (2026-11-23), the top ten span an Elo range from 1162 down to 1117, and their 95% intervals almost all overlap. What actually drives the decision is elsewhere: whether you can self-host, whether the license works for you, how fine-grained the control surface is, and what it really costs per second.

This piece takes the I2V pipeline apart, then talks cost using official pricing pages rather than review-site numbers. Verification turned up three errors that circulate widely in secondary coverage; each is flagged in the relevant section.

## 1. What makes I2V hard is constraints, not fidelity

[Image-to-Video Diffusion: From Foundations to Open Frontiers](https://arxiv.org/abs/2605.17248) (arXiv:2605.17248), published in May 2026, is the only survey that treats I2V as a subject in its own right. It states the difference from text-to-video (T2V) up front:

> Compared with broader video generation settings, this task places stricter demands on content consistency, identity preservation, and motion coherence.

Unpacked: T2V only has to look good and plausible. I2V carries three extra constraints — **content consistency** (don't invent things absent from the reference image), **identity preservation** (faces must not drift), and **motion coherence** (no inter-frame jitter). This is also why I2V is often more useful in practice than T2V: the reference image constrains the output space, so results are more predictable.

The survey compresses the whole field into four design axes: condition encoding, temporal modeling, noise prior design, and spatial-temporal upsampling. Essentially every difference between models falls along one of these.

## 2. What the pipeline looks like

```
reference image ──┐
prompt ───────────┼─→ condition encoding ──┐
                  │                        ↓
        3D causal VAE ─→ latent ─→ DiT denoising ─→ latent' ─→ VAE decode ─→ 480p/720p
         (16x/4x compression)                                                    ↓
                                                        separate super-resolution ─→ 1080p
```

Three decisions carry the design:

**1. Diffuse in latent space, not pixel space.** The [HunyuanVideo 1.5 technical report](https://arxiv.org/abs/2511.18870) (arXiv:2511.18870) gives concrete numbers: an 8.3B-parameter DiT paired with a 3D causal VAE compressing 16x spatially and 4x temporally, with 32 latent channels. Without compression the token count explodes and both training and inference become infeasible.

**2. U-Net gave way to DiT.** Early work inserted 1D temporal layers into a text-to-image 2D U-Net — pseudo-3D in effect — which let it inherit a mature T2I backbone for free. DiT instead cuts video into spacetime patches, treats them as tokens, and feeds them to a Transformer, buying scalability. The survey documents this migration explicitly, and essentially every production model now sits on the DiT side.

**3. Cascade rather than one shot.** HunyuanVideo 1.5 runs two stages: the DiT produces 480p–720p at 5 to 10 seconds, then a dedicated video super-resolution network takes it to 1080p. This decouples "is the motion right" from "is the image sharp" — regenerating wrong motion is expensive, while adding sharpness is cheap.

## 3. Controllability lives entirely in the conditioning layer

How usable an I2V model is comes down almost entirely to conditioning design. The survey identifies four types, in increasing order of control:

| Type | Representative | What it gets you |
|---|---|---|
| Image-only | [SVD](https://arxiv.org/abs/2311.15127) | Makes the image move, but the model cannot infer what motion you wanted |
| Image + Text | [DynamiCrafter](https://arxiv.org/abs/2310.12190) onward, now the mainstream | Describe the intended dynamics semantically |
| Image + Motion | Trajectories, camera paths, motion fields | Specify how the camera moves and where subjects go |
| Multi-reference / first-and-last frame | Seedance, Kling O3, others | Lock characters, lock start and end frames, hold consistency across shots |

If your requirement is "product shot with a specified push-in," categories three and four are what you should be shopping for. Leaderboard Elo tells you nothing about that.

## 4. The 2026 theme is cutting compute, not adding fidelity

The most interesting movement this year is not in quality but in inference cost, and three lines are pushing at once.

**Step distillation.** NVIDIA open-sourced Cosmos3-Super-Image2Video-4Step on July 20. The [official announcement](https://huggingface.co/blog/nvidia/cosmos3edge) is blunt about it:

> They cut sampling from 50 denoising steps to just 4, and remove the need for classifier-free guidance — which otherwise doubles the work per step — for up to 25× faster inference than the base model, with little to no loss in generation quality.

Note that two things stack here: fewer steps, plus removing [classifier-free guidance](https://arxiv.org/abs/2207.12598), which otherwise costs two forward passes per step. The more interesting result is the ranking — NVIDIA reports the distilled model as the top open-weight entry on the Artificial Analysis I2V leaderboard, **ahead of its own teacher**. The 25x figure is NVIDIA's own claim with no third-party reproduction, so discount it accordingly.

**Sparse attention.** HunyuanVideo 1.5's SSTA (Selective and Sliding Tile Attention) prunes redundant spatiotemporal kv blocks; the report claims a 1.87x end-to-end speedup over FlashAttention-3 on 10-second 720p synthesis. This is a direct answer to DiT attention cost growing quadratically with token count.

**The autoregressive branch has not taken off.** In principle, chunk-by-chunk AR generation extends to long clips more cheaply and holds long-range coherence better. In practice errors accumulate along the sequence and per-clip inference is slower. It has not displaced DiT in production; it mostly shows up as an extension feature bolted onto DiT models.

## 5. Current models, and one shutdown to plan around

[AA-Video-I2V v2.1](https://artificialanalysis.ai/video/leaderboard/image-to-video) as of 2026-11-23 (Elo from blind preference with audio; $/min is AA's conversion of API price at its benchmark settings):

| Rank | Model | Developer | Elo | Access | $/min |
|---|---|---|---|---|---|
| 1 | Dreamina Seedance 2.5 | ByteDance | 1162 | Closed | $34.12 |
| 4 | Dreamina Seedance 2.0 | ByteDance | 1141 | Closed | $22.45 |
| 5 | MiniMax H3 (768p) | MiniMax | 1136 | Open weights (custom license) | $4.80 |
| 12 | Wan 3.0 | Alibaba | 1110 | Closed API | $12.00 |
| 15 | Gemini Omni Flash 1.2 | Google | 1086 | Closed API | $6.26 |
| 25 | Kling 3.0 1080p (Pro) | Kuaishou | 1000 | Closed | $10.08 |
| 28 | Veo 3.1 | Google | 955 | Closed | $24.00 |

Hold the leaderboard loosely. It measures blind preference, which is not the same as "works well for your case," and it moves month to month. v2.1 pins Kling 3.0 1080p (Pro) at 1000 as its anchor, so these scores cannot be compared with the older board this post cited in its 2026-07 version (Gemini Omni Flash 1200, Seedance 2.0 1199 at the time). The top five have overlapping 95% intervals and are one tier; ranks 2 and 3, omitted above, are Utopai X and Boreal-H3, neither of which has an API yet. The top three open-weight entries (MiniMax H3, Hyperflow H3, Pika H3 Flex) are all from the H3 family; H3's license restrictions are covered in the next section. For each family's history and the text-to-video board, see the site's [video generation model families](/posts/tech/2026-08-26-ai-model-family-video-generation-en) post.

**Sora is gone.** The [official OpenAI help page](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation) is unambiguous:

> The Sora web and app experiences were discontinued on April 26, 2026. The Sora API will be discontinued on September 24, 2026.

Both dates have passed, and the [API deprecations page](https://developers.openai.com/api/docs/deprecations) lists the replacement for Sora 2 and the Videos API as "No one-to-one replacement," so any integration still pointing at Sora has to change vendors. Google did the same: every Veo endpoint on the Gemini API is shut down (the Veo 3.1 preview endpoints on 2026-10-22), and the [recommended replacement](https://ai.google.dev/gemini-api/docs/deprecations) is `gemini-omni-1.2-flash`. Two leading video APIs swapped out within a year is a ready-made case study in single-vendor risk.

## 6. Open weights, and a widely-repeated error

The conclusion first: **Wan 2.7 has no open weights. It is API-only, and so is Wan 3.0, released on 2026-08-24.**

A large number of articles — including several that surfaced in my first round of searching — describe Wan 2.7 as Apache 2.0 open weights you can download and self-host. First-party sources do not support this. In the [Wan-Video GitHub organization](https://github.com/Wan-Video), the main video generation model stops at [Wan2.2](https://github.com/Wan-Video/Wan2.2); the 2026 additions are derivative models such as Wan-Dancer and Wan-Animate-2. The [Wan-AI organization on Hugging Face](https://huggingface.co/Wan-AI) likewise tops out at the Wan2.2 family, with no 2.7 or 3.0. [Runpod puts it most directly](https://www.runpod.io/articles/guides/wan-2-7-runpod):

> You may see third-party posts claiming an Apache 2.0 release for Wan 2.7; that isn't supported by Alibaba's announcement or by anything on Hugging Face.

Since Wan 2.5, Alibaba has kept new generations behind the API; 2.2 is the last with downloadable weights. So Wan 2.7 and Wan 3.0 are hosted API models — do not plan a self-hosted deployment around them.

Here is what you can actually self-host for I2V today:

| Model | Specs | License |
|---|---|---|
| [Cosmos3-Super-Image2Video-4Step](https://huggingface.co/nvidia/Cosmos3-Super) | 720p, 189 frames @ 24fps (~8s), 4-step sampling | OpenMDW 1.1, commercial use permitted |
| [HunyuanVideo 1.5](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5) | 8.3B DiT, 480p–720p then upscaled to 1080p, targets consumer GPUs | Tencent Hunyuan Community |
| [LTX-2.3](https://huggingface.co/Lightricks/LTX-2.3) | 22B distilled checkpoint, synchronized audio and video, gemma-3-12b text encoder | Custom LTX license (**not** Apache 2.0 — that was LTX-Video v1) |
| [Wan 2.2](https://github.com/Wan-Video/Wan2.2) | I2V-A14B / TI2V-5B, 480p and 720p | Apache 2.0 |
| [MiniMax H3](https://huggingface.co/MiniMaxAI/MiniMax-H3) | Released weights are H3-Base: 768p output, 4–15 s per clip, native stereo audio; 2K requires the API | MiniMax H3 Community License (excludes the US, EU, UK, and South Korea; products above $20M annual revenue need separate written permission) |

The LTX line has since added [LTX-2.5](https://huggingface.co/Lightricks/LTX-2.5), whose weights went up on Hugging Face in 2026-07; downloading requires accepting the license, which is again the LTX-2.x community license rather than Apache 2.0. MiniMax H3 is the highest-scoring open-weight model on AA's image-to-video board, but its license excludes the US and the EU outright, so check where your users and operations are first. If you do not qualify, the unrestricted, commercially usable choices are still Wan 2.2 and Cosmos 3.

Cosmos 3 deserves a caveat about positioning: NVIDIA builds it as a world foundation model for physical AI, aimed at synthetic training data for robotics, autonomous driving, and industrial simulation — not at filmmaking. If it feels wrong for creative work, that is because it was never built for it.

## 7. Pricing: use official pages, because secondary numbers are badly wrong

The 2026-07 version of this post gave Veo 3.1's Gemini API prices (Standard with audio $0.40/s, Fast $0.10–$0.30/s, Lite $0.05–$0.08/s), at a time when secondary review sites quoted anywhere from $0.03/s to $0.75/s, a 25x spread. Those Veo endpoints are now shut down on the Gemini API. Google's video model there is Gemini Omni 1.2 Flash, billed by output tokens ($12.00 per million). The [official pricing page](https://ai.google.dev/gemini-api/docs/pricing) converts that to per-second figures:

| Resolution | Output tokens per second | Approx. price per second |
|---|---|---|
| 360p | 1,931 | $0.023 |
| 720p | 5,792 | $0.07 |
| 1080p (upsampled) | 8,688 | $0.104 |
| 4K (upsampled) | 17,376 | $0.209 |

Veo 3.1 itself is still available: Google's deprecations page points GA Veo users to the Gemini Enterprise Agent Platform on Google Cloud, and Runway still sells it.

[Runway's official API pricing](https://docs.dev.runwayml.com/guides/pricing/) bills in credits at 1 credit = $0.01: `gen4.5` is 12 credits/s ($0.12/s), `gen4_turbo` is 5 credits/s ($0.05/s), and `veo3.1 (audio)` is 40 credits/s ($0.40/s, the same as Veo 3.1's former Gemini API price). In the second half of 2026 Runway put third-party models such as Wan 3.0, Seedance 2.5, MiniMax H3, and Kling 4.0 on the same price list — for example `wan3` at 1080p is 20 credits/s and `seedance2_5` at 1080p is 68 credits/s — which makes it a handy single-channel comparison.

Kling's official API docs sit behind a login wall, but the rates from its 2026-02-06 VIDEO 3.0 User Guide are quoted consistently by [multiple](https://evolink.ai/blog/kling-3-o3-api-official-discount-pricing-developers) [sources](https://apiframe.ai/blog/ai-video-api-pricing-2026): 6 credits/s at 720p and 8 credits/s at 1080p without audio; 9 and 12 credits/s with native audio; voice control adds 2 credits/s. The dollar conversion depends on the prepaid package, with unit prices between $0.10 and $0.14, so 720p without audio lands around $0.06–$0.084/s.

One detail that gets overlooked: failed Kling API tasks do not consume credits, while the consumer app charges for them. Over heavy iteration that difference adds up.

## 8. The limits: long clips are still stitched

The 2026-07 version of this post said Veo 3.1 was the only model here that emits synchronized audio in one generation. That was already imprecise (Kling 3.0 and Seedance 2.0 had native audio) and is now plainly untrue: AA's main I2V v2.1 board is itself an audio-on evaluation, and Seedance 2.5, MiniMax H3, Wan 3.0, and Gemini Omni Flash all generate sound and picture in the same pass. When totaling cost, the thing to check is whether your plan prices audio separately; Kling 3.0, for example, has distinct rates with and without audio.

The more fundamental limit is duration. The whole DiT family shares one failure mode: attention cost grows quadratically with token count, making long clips exponentially expensive, and long-range temporal coherence is weak to begin with. This is not an engineering detail but an open research problem — ICML 2026 ran an entire workshop on it ([From Frames to Stories](https://icml2026-f2s-workshop.github.io)), and its problem statement is worth quoting directly:

> Across minutes of generation, current systems often suffer from identity drift, scene inconsistency, narrative breakdown, and weak responsiveness to user intent.

In practice: single-generation length grew in the second half of 2026 (Wan 3.0, Seedance 2.5, and Kling 4.0 advertise 30 seconds, Gemini Omni 1.2 Flash 15), but minute-scale video still drifts. Treat long-form video as an engineering problem of stitching shots together, not as something one generation will hand you.

## Overall

Work the selection backwards by asking four questions:

1. **Are you still on Sora or the Gemini API's Veo endpoints?** Both are shut down; migrate first. Veo's official replacement is Gemini Omni 1.2 Flash; Sora has none, so pick using the questions below.
2. **Can the data leave your infrastructure, and what is your volume?** For self-hosting, start with HunyuanVideo 1.5 or the LTX line; MiniMax H3 scores highest, but check its regional exclusions and revenue threshold first. In the Wan family, target 2.2 — do not be misled by open-source claims around 2.7 or 3.0.
3. **How fine does the control need to be?** For specified camera motion, locked characters, or cross-shot consistency, look at multi-reference and motion conditioning support, not at the leaderboard. Runway still has the best control surface here even though its Elo has been overtaken.
4. **What is the cost structure?** Per second, Gemini Omni 1.2 Flash 360p drafts (about $0.023/s) to Seedance 2.5 (about $0.57/s by AA's conversion) is a spread of more than twenty times. Iterate on the cheap tier, then confirm which quality tier your channel actually needs.

One closing note: information in this field has a short half-life, and the error rate in secondary coverage is startlingly high. The Wan 2.7 licensing claim and the Veo pricing figures this post addressed in its 2026-07 version were both widely repeated and wrong — and within four months, the Veo and Sora APIs themselves were shut down. Before committing to a purchase, spend a minute on the official pricing page and the official repo — it is cheap, and it saves a lot of trouble.

## Changelog

- 2026-11-23: Data updated to 2026-11. The leaderboard now uses AA-Video-I2V v2.1 (2026-11-23, audio-on, Kling 3.0 Pro anchored at 1000), with a note that scores are not comparable to the old board; Sora is now described as shut down for both app and API with no official replacement, and the Gemini API's Veo endpoints as all shut down with Gemini Omni 1.2 Flash as the replacement; the pricing section turns Veo 3.1's Gemini API prices into history and adds Omni 1.2 Flash's token-based conversion and Runway's newly added third-party model prices; the open-weights section adds that Wan 3.0 also has no weights, plus MiniMax H3 (with its regional license restrictions) and LTX-2.5. Correction: the earlier line "Veo 3.1 is the only model that emits synchronized audio in one generation" was already imprecise and now says native audio is mainstream; single-generation length updated to 15–30 seconds.

## References

**Papers and technical reports**

- [Image-to-Video Diffusion: From Foundations to Open Frontiers (arXiv:2605.17248)](https://arxiv.org/abs/2605.17248)
- [HunyuanVideo 1.5 Technical Report (arXiv:2511.18870)](https://arxiv.org/abs/2511.18870)
- [Scalable Diffusion Models with Transformers (arXiv:2212.09748)](https://arxiv.org/abs/2212.09748)
- [Classifier-Free Diffusion Guidance (arXiv:2207.12598)](https://arxiv.org/abs/2207.12598)
- [Stable Video Diffusion (arXiv:2311.15127)](https://arxiv.org/abs/2311.15127)
- [DynamiCrafter (arXiv:2310.12190)](https://arxiv.org/abs/2310.12190)
- [From Frames to Stories Workshop @ ICML 2026](https://icml2026-f2s-workshop.github.io)

**Models and repositories**

- [Introducing Cosmos 3 Edge (NVIDIA)](https://huggingface.co/blog/nvidia/cosmos3edge)
- [nvidia/Cosmos3-Super (Hugging Face)](https://huggingface.co/nvidia/Cosmos3-Super)
- [Tencent-Hunyuan/HunyuanVideo-1.5 (GitHub)](https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5)
- [Lightricks/LTX-2 (GitHub)](https://github.com/Lightricks/LTX-2)
- [Lightricks/LTX-2.3 (Hugging Face)](https://huggingface.co/Lightricks/LTX-2.3)
- [Wan-Video/Wan2.2 (GitHub)](https://github.com/Wan-Video/Wan2.2)
- [Wan-AI (Hugging Face organization)](https://huggingface.co/Wan-AI)
- [MiniMaxAI/MiniMax-H3 (Hugging Face)](https://huggingface.co/MiniMaxAI/MiniMax-H3)
- [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE)
- [Lightricks/LTX-2.5 (Hugging Face)](https://huggingface.co/Lightricks/LTX-2.5)

**Official pricing and announcements**

- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Runway API Pricing & Costs](https://docs.dev.runwayml.com/guides/pricing/)
- [Gemini API deprecations](https://ai.google.dev/gemini-api/docs/deprecations)
- [What to know about the Sora discontinuation (OpenAI)](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)
- [OpenAI API deprecations](https://developers.openai.com/api/docs/deprecations)
- [Kling 3.0 vs O3 API Pricing (EvoLink)](https://evolink.ai/blog/kling-3-o3-api-official-discount-pricing-developers)
- [AI Video API Pricing in 2026 (Apiframe)](https://apiframe.ai/blog/ai-video-api-pricing-2026)
- [Wan 2.7 on Runpod: open-weight status](https://www.runpod.io/articles/guides/wan-2-7-runpod)
- [AA-Video-I2V v2.1 Leaderboard (Artificial Analysis)](https://artificialanalysis.ai/video/leaderboard/image-to-video)
- [Image-to-Video Leaderboard 2026-07 snapshot (Artificial Analysis / BenchmarkList)](https://benchmarklist.com/arenas/artificial_analysis_image_to_video)

**Related posts on this site**

- [Video Generation Model Families](/posts/tech/2026-08-26-ai-model-family-video-generation-en)
- [The 3D Modeling Tool Landscape in 2026](/posts/ai/2026-07-27-3d-modeling-tools-landscape-en)
- [Driving Video Generation Tools with AI Agents: HyperFrames, HeyGen, Runway](/posts/ai/2026-05-10-ai-agent-video-generation-en)
