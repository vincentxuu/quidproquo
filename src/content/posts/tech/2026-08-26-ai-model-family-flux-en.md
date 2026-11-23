---
title: "FLUX: The Image Model Family Built by Stable Diffusion's Original Team, from 12B to FLUX 3 Images, Video, and Robotics"
date: 2026-08-26
category: tech
tags: [ai-agent, flux, black-forest-labs, model-family-flux, image-generation, diffusion-model, model-selection]
lang: en
type: deep-dive
tldr: "FLUX is Black Forest Labs' image-model family. The current generation is FLUX 3: the closed API model FLUX 3 Image ($0.048 per 1K image) and the 5.6B open-weight FLUX 3 Image Klein ($0.009 per 1K image, FLUX Kommunity License: free commercial use if you and your affiliates earn under $5M a year). The same FLUX 3 base also powers video (FLUX 3 Video, still a preview) and robot action prediction (the 7B open-weight FLUX 3 Action). On the Artificial Analysis image board, FLUX 3 Image ranks 21st and Klein 31st, both above every FLUX.2 model but behind the closed leaders from OpenAI, Microsoft, and Google."
description: "A guide to Black Forest Labs' FLUX family: the FLUX.1-to-FLUX 3 timeline, rectified flow and Self-Flow architecture, how FLUX 3 Image, Klein, Video, and Action divide the work, the Kommunity License versus the dev noncommercial license, per-image and per-second pricing, where FLUX sits on the AA image and video boards, and selection advice for agent developers."
series:
  name: "AI Model Families"
  order: 16
draft: false
glossary:
  - term: "Rectified Flow Transformer"
    aliases: ["rectified flow", "流匹配"]
    definition: "FLUX's core architecture: rectified flow or flow matching learns a direct noise-to-data path instead of a diffusion model's curved denoising trajectory. FLUX implements it as a transformer in which text and image tokens share bidirectional attention."
  - term: "Guidance Distillation"
    definition: "Distilling a two-forward-pass guidance technique into the weights so one forward pass produces high-quality output. This distillation is the main difference between FLUX dev and pro."
  - term: "Self-Flow"
    definition: "FLUX 3's multimodal pretraining method (self-supervised flow matching), which learns images, video, and audio jointly in one set of weights; FLUX 3 Image, Klein, Video, and Action all derive from this base."
  - term: "FLUX Kommunity License"
    definition: "The license for FLUX 3 open weights (Klein, Action): free for noncommercial use; users whose gross annualized revenue, including affiliates, is under $5M may run the model in production and use its outputs commercially; above the threshold you need a paid license."
---

> :globe: [中文版](/posts/tech/2026-08-26-ai-model-family-flux)

In August 2024, four German researchers who had left Stability AI—Robin Rombach, Patrick Esser, Andreas Blattmann, and Dominik Lorenz—founded [Black Forest Labs](https://bfl.ai) (BFL) in Freiburg. Rombach was first author of the Latent Diffusion paper, and this group built the architecture behind Stable Diffusion. That same month they released the 12B [FLUX.1](https://github.com/black-forest-labs/flux). Two years later the family has grown from a single image model into FLUX 3, one base that handles images, video, and robot actions. This guide is for people choosing an image model for a product or an agent workflow: by the end you can decide between the closed FLUX 3 Image API, the self-hostable Klein, and the cheaper FLUX.2 tiers.

For benchmark interpretation, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en); for cross-family image and video comparisons, see the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en).

## Family positioning and model matrix

FLUX is now "one FLUX 3 base, offered as both a closed API and open weights." FLUX.2 is still on the API and costs less than FLUX 3, but FLUX 3 Klein already beats it on quality.

| Model / product line | Position | Key difference | Access |
|---|---|---|---|
| FLUX 3 Image | Flagship image generation and editing | One endpoint for generation and editing; up to 10 references, bounding boxes inside the prompt, up to 4K | BFL API (closed), $0.048 per 1K image |
| FLUX 3 Image Klein | Self-hostable image generation and editing | 5.6B with the same features as FLUX 3 Image; a distilled checkpoint (16 steps) and Base (50 steps, for fine-tuning) | Weights (FLUX Kommunity License) or BFL API, $0.009 per 1K image |
| FLUX 3 Video | Video with synchronized audio | Up to 20 seconds per request, up to 4K, 24 fps; officially labeled a preview | BFL API, priced per second |
| FLUX 3 Max | Low-latency video | Post-trained on FLUX 3 by fal Research; a 10-second clip takes about 12 seconds | fal only, billed by fal |
| FLUX 3 Action | Robot / game action prediction | 7B world action model that predicts actions plus about 2 seconds of future frames | Weights (FLUX Kommunity License) |
| FLUX.2 (klein 4B/9B, pro, flex, max, dev) | Previous image generation | klein 4B is the family's remaining Apache-2.0 weight; dev is 32B, noncommercial, with no hosted API | BFL API; klein and dev have weights |

## Family evolution

| Version | Release | Key facts | What it changed for selection |
|---|---|---|---|
| BFL founded | 2024-08 | Started in Freiburg; a16z led a $31M seed | — |
| FLUX.1 schnell/dev/pro | 2024-08 | 12B rectified-flow transformer; schnell Apache 2.0, dev noncommercial, pro API-only | Began the three tiers: open weights, noncommercial weights, API |
| FLUX1.1 [pro] | 2024-10 | Faster; Ultra/Raw modes added in November | The API tier became the production workhorse |
| FLUX.1 Kontext | 2025-05 | Text-plus-image contextual editing; Kontext [dev] weights in June | Generation and editing started merging into one line |
| FLUX.2 pro/flex/dev | 2025-11-25 | 32B, Mistral 3 24B VLM text encoder, up to 10 references, native 4MP ([official blog](https://bfl.ai/blog/flux-2)) | Multi-reference editing became standard |
| FLUX.2 [max] | 2025-12-16 | Grounded generation with live web search | A dedicated tier for images that need current facts |
| Series B | 2025-12-01 | $300M at a $3.25B valuation ([TechCrunch](https://techcrunch.com/2025/12/01/black-forest-labs-raises-300m-at-3-25b-valuation/)) | — |
| FLUX.2 [klein] | 2026-01-15 | 4B (Apache 2.0) and 9B (noncommercial), runs on consumer GPUs | Small self-hosted models could be used commercially |
| FLUX 3 announced | 2026-07-23 | A multimodal base trained jointly on images, video, and audio, rolled out in phases ([announcement](https://bfl.ai/blog/flux-3)) | BFL moved from an image company toward "visual intelligence" |
| FLUX 3 Video preview | 2026-08-04 | 20-second FHD with synchronized audio and lipsync; 2K/4K output added in September ([release notes](https://docs.bfl.ml/release-notes)) | Video and images from the same API |
| FLUX 3 Action | 2026-09-22 | 7B open-weight action model, top open model on RoboLab-120 ([release post](https://bfl.ai/blog/flux-3-action), [daily news](/posts/daily/2026-09-25-ai-agent-daily-en)) | The first FLUX 3 open weights |
| FLUX 3 Image | 2026-10-01 | One endpoint for generation and editing, bounding boxes, up to 4K | The current image flagship; see the sections below |
| FLUX 3 Image Klein | 2026-10-15 | 5.6B open weights, Kommunity License, INT8 build runs in 8GB VRAM ([release post](https://bfl.ai/blog/flux-3-image-klein), [daily news](/posts/daily/2026-10-16-ai-agent-daily-en)) | The self-hosted option now beats FLUX.2 [pro]; licensing moved to a revenue threshold |

The two-year storyline is clear: win the community with open weights, then build revenue with tiered APIs. FLUX 3's turning point is licensing. In the FLUX.2 generation only the smallest model, klein 4B, could be used commercially as-is. FLUX 3 open weights use a revenue threshold instead: small teams can use the whole model commercially, while large companies must pay. On revenue, Sacra estimated annualized revenue at about $96M in August 2025, and a multiyear deal with Meta worth about $140M was signed that September ([Sacra](https://sacra.com/c/black-forest-labs), a third-party estimate).

## Architecture and training trade-offs

### From rectified flow to Self-Flow

FLUX is not a classic U-Net diffusion model but a rectified-flow transformer: text and image patches attend to each other in one transformer stack, which is why accurate text rendering has been a FLUX signature since FLUX.1. FLUX.2 replaced the text encoder with a Mistral 3 24B VLM, which made 10-reference editing workable.

FLUX 3 goes further: Self-Flow (self-supervised flow matching) puts images, video, and audio into one pretraining run. BFL's account is that images contribute spatial detail, video contributes motion and physics, and audio contributes signals about events and interactions, so even an image-only model like Klein is derived from a multimodal base. BFL has not published the parameter count or training-data composition of the full FLUX 3 model.

### Klein: two checkpoints for a small model

FLUX 3 Image Klein ships two 5.6B checkpoints ([docs](https://docs.bfl.ml/flux_3/flux3_image_klein)):

- **Distilled**: 16 steps, CFG 1, for low-latency generation; the `flux-3-image-klein` API endpoint serves this one.
- **Base**: 50 steps, CFG 3.5, for fine-tuning and LoRA training; LoRAs trained on Base also load into the distilled model.

The generator weights are about 11.2GB in BF16 and 5.6GB in FP8; the INT8 build runs on RTX cards with 8GB of VRAM, and an RTX 4070 produces a 1MP image in under about 9 seconds. Parameter counts exclude the text encoder. The official docs say to always run the prompt upsampler.

### A change in how you control it

FLUX 3 Image has no separate "generate" and "edit" modes; the prompt decides which one happens. For precise layouts, append a JSON list of bounding boxes to the prompt: you can say where a headline, a face, or each grid panel goes, or change only the elements inside a box while every other pixel stays put. FLUX has never supported negative prompts (shared modulation plus guidance distillation), and the official prompting guide recommends rewriting them as positive descriptions; people migrating from Stable Diffusion need to drop that habit first.

## Evaluation and alternatives

### Images: Artificial Analysis AA-Image-T2I v2.1

[AA-Image-T2I v2.1](https://artificialanalysis.ai/image/leaderboard/text-to-image) (2026-11-23) computes Elo from blind pairwise human votes and fixes FLUX.2 [dev] at 1000 as the anchor.

| Model | AA Elo | Rank | Type | $/1K images |
|---|---|---|---|---|
| GPT Image 2.6 Sunburst (max) | 1263 | 1 | Closed | $211 |
| MAI-Image-2.7 | 1215 | 4 | Closed | $35 |
| Nano Banana 2.1 | 1175 | 8 | Closed | $34 |
| FLUX 3 Image | 1114 | 21 | Closed API | $48 |
| Qwen-Image-2.1 | 1047 | 30 | Open weights (research license) | No API |
| FLUX 3 Image Klein | 1040 | 31 | Open weights (Kommunity) | $9 |
| FLUX.2 [max] | 1021 | 44 | Closed API | $70 |
| FLUX.2 [pro] | 1005 | 53 | Closed API | $30 |
| FLUX.2 [dev] | 1000 | 56 | Open weights (noncommercial) | $12 |
| FLUX.2 [klein] 9B | 932 | 83 | Open weights (noncommercial) | $15 |

Three readings. First, FLUX 3 Image is about 90 points above FLUX.2 [max] but still more than 100 points behind the leaders; if you want the highest-scoring images, FLUX is no longer the first pick. Second, Klein's 1040 and Qwen-Image-2.1's 1047 fall inside each other's confidence intervals, but Qwen-Image-2.1 is under a research license and cannot be used commercially, whereas small teams can use Klein commercially. Third, Klein costs $9 per 1,000 images, more than three times cheaper than FLUX.2 [pro] with a higher score, which leaves almost no reason to start a new project on the FLUX.2 API tiers.

BFL's own internal evaluation says Klein is the top open-weight model on text-to-image, multi-reference, and editing, ahead of FLUX.2 [pro] and Ideogram V4.5, and 91 Elo above FLUX.2 [klein] 9B on text-to-image. That is self-reported, with undisclosed raters and prompts; AA's third-party results point the same way.

### Video: AA-Video-T2V v2.1

On [AA-Video-T2V v2.1](https://artificialanalysis.ai/video/leaderboard/text-to-video) (with audio, 2026-11-23, Kling 3.0 1080p Pro fixed at 1000), FLUX 3 Max ranks 7th at 1151 and BFL's own FLUX 3 ranks 10th at 1138; first place is Wan 3.0 at 1175. Confidence intervals overlap across the top group, and rankings shift every few weeks. For cross-family video comparisons, see the [video generation family article](/posts/tech/2026-08-26-ai-model-family-video-generation-en).

### Robotics: RoboLab-120 (self-reported)

FLUX 3 Action's guidance-distilled checkpoint reaches about a 42% success rate on the RoboLab-120 simulation benchmark, against 36.8% for the previous best open model, Cosmos 3 Nano (16B), and 28.0% for π0.5; the single-step distilled checkpoint scores about 38% in exchange for lower latency ([release post](https://bfl.ai/blog/flux-3-action)). These are simulation numbers; for a physical robot you need to fine-tune and re-verify on your own hardware.

## Licensing, pricing, and deployment

### Licensing: three sets of terms, check which one applies before you choose

| License | Models | Commercial use |
|---|---|---|
| Apache 2.0 | FLUX.1 [schnell], FLUX.2 [klein] 4B | Yes, no revenue threshold |
| [FLUX Kommunity License](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/LICENSE.md) | FLUX 3 Image Klein (both checkpoints), FLUX 3 Action | If gross annualized revenue including affiliates is under $5M: you may run the model in production and use outputs commercially; above that, buy a license. Production robotics uses are licensed only for noncommercial purposes |
| [FLUX [dev] Non-Commercial License](https://bfl.ai/legal/non-commercial-license-terms) | FLUX.1 [dev], Kontext [dev], FLUX.2 [dev], FLUX.2 [klein] 9B | The model is noncommercial only; outputs may be used commercially, but not to train a competing model |
| API only | FLUX 3 Image, FLUX 3 Video, FLUX.2 pro/flex/max, Kontext pro/max | Governed by the API terms |

Both non-Apache licenses require content filtering or human review and AI-generation disclosure where the law requires it. The Kommunity License also counts distilling another model from the outputs as a derivative.

The most common misunderstanding is about dev: you can sell the outputs, but self-hosting dev as a public service is a commercial deployment and needs a separate license. BFL's [self-hosting license plans](https://bfl.ai/pricing) are tiered: Builder (Klein + FLUX.2 [klein], 10K images per month) does not include dev; for dev you need Platform (Klein + klein 9B + dev, 100K images per month) or the agency plan, with Enterprise and synthetic-data plans above that. FLUX 3 Image itself has no weights. The training-data composition remains undisclosed, so assess copyright risk yourself.

### API pricing

1 credit = $0.01; the API and Playground cost the same ([BFL pricing page](https://bfl.ai/pricing), [release notes](https://docs.bfl.ml/release-notes)). FLUX 3 images are priced per image by resolution tier; text-to-image and editing cost the same, and reference images are not charged separately.

| Model | 768² | 1K | 2K | 4K |
|---|---|---|---|---|
| FLUX 3 Image | $0.041 | $0.048 | $0.100 | $0.607 |
| FLUX 3 Image Klein | $0.008 | $0.009 | $0.014 | $0.036 |

FLUX 3 Video is priced per output second, with audio included: text/image-to-video costs $0.15/s at HD, $0.24/s at FHD, $0.28/s at 2K, and $0.41/s at 4K, with video continuation (v2v) costing more; Draft previews are HD only at $0.06/s. FLUX 3 Max is billed on fal at regular rates of $0.17/s for 720p and $0.29/s for 1080p ([fal model page](https://fal.ai/models/blackforestlabs/flux-3-max/text-to-video)); the $8.70 per minute on the AA video board is the promotional price.

FLUX.2 is still priced per megapixel: klein 4B $0.014 for the first MP, klein 9B $0.015, pro $0.03 (then $0.015 per additional MP), flex $0.05, max $0.07. FLUX.2 [dev] has no hosted API and runs locally only. The official docs currently list no retirement dates for FLUX.2 or FLUX.1; FLUX.1 is marked as the previous generation, and the Kontext pages recommend FLUX.2 for new projects.

### Deployment

Klein's weights are on Hugging Face (accept the license first), with day-one support in ComfyUI, Diffusers, TensorRT-LLM, SGLang Diffusion, and vLLM-Omni; the official docs say it runs down to an RTX 3090, and the INT8 build goes down to 8GB of VRAM. In the data center, a GB300 in NVFP4 generates a 1MP image in under 0.6 seconds. FLUX 3 Action connects to robot arms through LeRobot, with fine-tuning examples for games and drones.

## Agent integration and selection

BFL ships an official [FLUX MCP server](https://docs.bfl.ml/api_integration/mcp_integration) (OAuth sign-in; generates and edits images and video) and publishes Agent Skills in black-forest-labs/skills that teach coding agents how to direct video generations. The models do no tool calling themselves; routing, retries, and cost control belong to your host loop.

- **Self-hosted or cost-sensitive production images** → FLUX 3 Image Klein: from $0.009 per image, scoring above the whole FLUX.2 line, and directly usable commercially by small teams. Above $5M in annual revenue, buy a license first or use the API.
- **Quality first while staying on FLUX** → FLUX 3 Image: bounding-box layout control and pixel-exact local edits are its strengths; for the highest raw score, look at GPT Image 2.6 or MAI-Image-2.7.
- **License must be clean with no revenue threshold** → FLUX.2 [klein] 4B (Apache 2.0), at a quality cost: its sibling klein 9B scores only 932 on the AA image board, and the 4B is not listed; for cross-family options, see Z-Image Turbo in the [landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en).
- **Images that need live web information** (real people, recent products) → FLUX.2 [max] grounding search is still the only FLUX tier with that feature.
- **Video** → FLUX 3 Video suits teams already on the BFL API; for speed, look at FLUX 3 Max on fal. Both are still a preview generation, so before launch compare them with Wan 3.0, Gemini Omni Flash, and other competitors on your own prompt set.
- **Robotics or game agents** → FLUX 3 Action can serve as a low-latency policy; BFL's experiments let a reasoning model plan while Action executes, which costs less than pure reasoning.

**Minimal validation**: take 20 to 50 real prompts from your product (including text to render and layout requirements), run Klein and FLUX 3 Image once each with the same seeds, and score blind win rates by hand; if Klein wins close to half the time, use Klein and keep the price difference.

## Limitations and trade-offs

- **Not the top for quality**: FLUX 3 Image ranks 21st on the AA image board, so quality-first workflows will be outscored by the closed leaders.
- **Licensing depends on revenue**: the Kommunity License lets small teams go commercial, but once a company passes the threshold it must pay; dev outputs can be sold, but deployment cannot. Neither is Apache 2.0.
- **Video and action are still early**: FLUX 3 Video is officially a preview, and Action's numbers come from simulation.
- **Limited disclosure**: the full FLUX 3 model's parameter count and training data are undisclosed, and part of Klein's quality claim comes from BFL's internal evaluation.
- **Unclear future for older tiers**: FLUX.2 and FLUX.1 are still callable with no retirement schedule, so integrations that rely on them long term should watch for announcements.

## Update history

- 2026-11-23: Added the FLUX 3 generation. The matrix, evaluation, pricing, and selection now cover FLUX 3 Image (2026-10-01), FLUX 3 Image Klein (2026-10-15), FLUX 3 Video, FLUX 3 Max, and FLUX 3 Action (2026-09-22), based on BFL release posts, release notes, the pricing page, the Kommunity License, and the Artificial Analysis image and video boards. FLUX.2 moved to the previous generation and remains in the timeline and pricing section. Licensing is now a table of three sets of terms, with updated self-hosting plans (Builder no longer includes FLUX.2 [dev]). Corrections: FLUX 3 Video launched on 2026-08-04 as a preview, not GA; FLUX 3 Video per-second prices now reflect the current pricing page; removed the "thirteenth" ordinal from the opening, which did not match the series order; the FLUX.1 link now points to the official GitHub repo. Removed the old LMArena snapshot figures (a different scale from AA v2.1) and outdated Midjourney and Imagen 4 unit prices.
- 2026-10-11: Reorganized the format, model matrix, and selection sections; retained existing sources and dates. No fresh fact-check was performed.

## References

- [FLUX 3 Image Klein — BFL official blog](https://bfl.ai/blog/flux-3-image-klein) — 2026-10-15 release post: 5.6B, hardware requirements, internal evaluation, and license
- [BFL Docs — Release Notes](https://docs.bfl.ml/release-notes) — FLUX 3 Image, Klein, and Video releases and prices
- [BFL Docs — FLUX 3 Image Klein](https://docs.bfl.ml/flux_3/flux3_image_klein) — specs for both checkpoints
- [BFL Docs — FLUX 3 overview](https://docs.bfl.ml/flux_3/flux3_overview) — Video preview status, FLUX 3 Max, FLUX 3 Action
- [BFL Pricing](https://bfl.ai/pricing) — API prices and self-hosting license plans
- [BFL Docs — Pricing](https://docs.bfl.ml/quick_start/pricing) — credit rules; FLUX.2 [dev] has no hosted API
- [FLUX 3 Max — fal](https://fal.ai/models/blackforestlabs/flux-3-max/text-to-video) — fal's post-trained version and billing
- [FLUX 3 Action — BFL official blog](https://bfl.ai/blog/flux-3-action) — 7B action model and RoboLab-120 results
- [FLUX 3 — BFL official blog](https://bfl.ai/blog/flux-3) — 2026-07-23 multimodal base announcement
- [FLUX Kommunity License v1.0 — Hugging Face](https://huggingface.co/black-forest-labs/flux-3-image-klein-comfy/blob/main/LICENSE.md) — revenue threshold and conditions
- [FLUX [dev] Non-Commercial License — BFL](https://bfl.ai/legal/non-commercial-license-terms) — dev-series license and output terms
- [FLUX.2: Frontier Visual Intelligence — BFL official blog](https://bfl.ai/blog/flux-2) — 2025-11-25 release post
- [black-forest-labs/flux2 — GitHub](https://github.com/black-forest-labs/flux2) — FLUX.2 inference repo and per-variant licenses
- [FLUX.2-klein-4B — Hugging Face model card](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B) — 4B, Apache 2.0
- [FLUX.2-dev — Hugging Face model card](https://huggingface.co/black-forest-labs/FLUX.2-dev) — 32B, noncommercial license
- [black-forest-labs/flux — GitHub](https://github.com/black-forest-labs/flux) — FLUX.1 inference repo
- [AA-Image-T2I v2.1 — Artificial Analysis](https://artificialanalysis.ai/image/leaderboard/text-to-image) — image generation leaderboard
- [AA-Video-T2V v2.1 — Artificial Analysis](https://artificialanalysis.ai/video/leaderboard/text-to-video) — video generation leaderboard (with audio)
- [Black Forest Labs raises $300M at $3.25B valuation — TechCrunch](https://techcrunch.com/2025/12/01/black-forest-labs-raises-300m-at-3-25b-valuation/) — Series B and founding-team background
- [Black Forest Labs revenue, valuation & funding — Sacra](https://sacra.com/c/black-forest-labs) — revenue estimate and Meta deal (third party)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
