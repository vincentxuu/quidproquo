---
title: "Model Card: OpenMOSS MOSS-Image"
date: 2026-10-19
category: daily
type: digest
tags: [ai-agent, model-release, daily, openmoss, model-family-moss-image]
lang: en
description: "OpenMOSS's open-weight 5B text-to-image model MOSS-Image scores 96.3 Mean-6 on its own long-text rendering benchmark and ranks second in end-to-end human evaluation behind GPT Image 2 — yet its bare backbone tops the field under shared prompts"
tldr: "MOSS-Image: a 5B single-stream diffusion transformer released 2026-10-16 by OpenMOSS (MOSI.AI / Shanghai Innovation Institute / Fudan University / Shanghai Jiao Tong University), Apache-2.0, prompts up to 4,096 tokens, paired with a GPT-6-driven agentic prompt enhancer for layout planning. On its own LLTB long-text benchmark it scores 96.3 Mean-6 (highest among open-weight models, 31.4 points above the next-best Qwen Image 2512 at 64.9); on 7Bench layout control it scores 0.88 mIoU / 0.70 AUC, far ahead of Ideogram 4's 0.44 / 0.20; on RealLayoutArena end-to-end human evaluation it ranks second of nine systems (1698.70 Elo), behind GPT Image 2 (1844.35) but ahead of Seedream 5.0 Pro, Qwen Image 3.0 Pro, and Nano Banana Pro — yet its bare backbone tops the field (1807.34 Elo) when every system is given the same enhanced prompt. All benchmarks are self-constructed and self-evaluated by OpenMOSS, with no third-party reproduction yet; the model does not support image-conditioned input or editing, and there is no official API pricing."
series:
  name: "AI Model Tracker"
  order: 52
glossary:
  - term: "MOSS-Image"
    def: "An open-weight text-to-image model family from OpenMOSS, built for long-form text rendering and native JSON layout control"
  - term: "OpenMOSS"
    def: "An open AI research group spanning MOSI.AI, the Shanghai Innovation Institute (SII), Fudan University, and Shanghai Jiao Tong University, known earlier for the MOSS Chinese dialogue model"
---

> 🌏 [中文版](/posts/daily/2026-10-19-model-openmoss-moss-image)

## Model Info

| Field | Value |
|---|---|
| Model ID | `OpenMOSS-Team/MOSS-Image-Base` (plus a curated-data fine-tune, `OpenMOSS-Team/MOSS-Image-SFT`) |
| Vendor | OpenMOSS (joint team: MOSI.AI / Shanghai Innovation Institute (SII) / Fudan University / Shanghai Jiao Tong University) |
| Parameters | 5B (single-stream diffusion transformer / DiT; text encoder is a frozen Qwen3.5-9B, VAE is a frozen FLUX.2 small decoder) |
| Context Window | Not applicable (image generation model; text prompts capped at 4,096 tokens) |
| Input Pricing (USD/1M tokens) | Not applicable (image model has no input-token pricing; Apache-2.0 open weights, no official API) |
| Output Pricing (USD/1M tokens) | Not applicable (same as above; third-party host [fal.ai](https://fal.ai/models/fal-ai/moss-image) lists MOSS-Image-SFT at $0.05 per megapixel of output image — roughly $0.05 per 1024×1024 image — unofficial pricing) |
| Open Source | Yes (Apache-2.0) |
| Release Date | 2026-10-16 |
| Official Announcement | [OpenMOSS MOSS-Image project page](https://openmoss.ai/MOSS-Image/) |
| HuggingFace | [OpenMOSS-Team/MOSS-Image-Base](https://huggingface.co/OpenMOSS-Team/MOSS-Image-Base) |
| Family | MOSS-Image (first release, two checkpoints: Base and SFT) |

## Key Capabilities

- **Long-form text rendering**: on OpenMOSS's own LongLongTextBench (LLTB, average target length 1,339.8 characters, roughly 11.1x the prior LongTextBench), MOSS-Image scores 96.3 Mean-6 — the highest of any open-weight model in the official comparison table, 31.4 points above the next-best Qwen Image 2512 (64.9). Its longest English and Chinese conditions score 97.1 and 92.4, respectively.
- **Layout control precision**: on the third-party 7Bench benchmark, it scores 0.88 mIoU_det / 0.70 Layout AUC, far ahead of the next-best Ideogram 4 (0.44 / 0.20).
- **End-to-end design generation**: on OpenMOSS's own RealLayoutArena (RLA — 61 poster/infographic/UI design requests, judged via blind pairwise human comparison), the complete system (DiT + agentic prompt enhancer) scores 1698.70 Elo, ranking second of nine systems, behind only the closed-source GPT Image 2 (1844.35).
- **Backbone instruction-following**: when every generator's own prompt enhancer is removed and all nine systems are given the same shared, enhanced natural-language prompt, MOSS-Image's bare backbone tops the field at 1807.34 Elo, ahead of ERNIE Image (1748.51) and SenseNova-U1 (1689.23).

## Benchmark Results

| Benchmark | Score | Predecessor | Best Competitor |
|---|---|---|---|
| LLTB (LongLongTextBench) Mean-6 | 96.3 | First release, no predecessor | Qwen Image 2512: 64.9 |
| 7Bench layout control (mIoU_det / Layout AUC) | 0.88 / 0.70 | First release, no predecessor | Ideogram 4: 0.44 / 0.20 |
| RLA end-to-end system Elo (9 systems, full pipeline) | 1698.70 (ranked 2nd) | First release, no predecessor | GPT Image 2: 1844.35 (ranked 1st) |
| RLA shared-prompt backbone Elo (9 generators) | 1807.34 (ranked 1st) | First release, no predecessor | ERNIE Image: 1748.51 |

⚠️ LLTB, 7Bench, and RLA are all constructed and evaluated entirely in-house by OpenMOSS (the paper states: "all results on 7Bench, LLTB, and RLA are obtained through our own evaluation"). None of these numbers has an independent third-party reproduction yet, so the scores should be read with some caution. The one benchmark drawing on externally published results is LongTextBench, which OpenMOSS itself describes as near-saturated (most models cluster between 96.05 and 98.85), which is why LLTB was built as the primary evaluation instead.

## Compared to Predecessors and Competitors

MOSS-Image is OpenMOSS's first text-to-image model, so there is no predecessor to compare against. Its real selling point isn't "beating everyone" — it's using a 5B model to open a 31.4-point gap over Qwen Image 2512 in the narrow domain of long-form text rendering. That's an unusually large margin among open-weight text-to-image models, but since LLTB is a self-built benchmark and the comparison set is limited to "open-weight models OpenMOSS chose to include," selection or evaluation bias toward its own model can't be ruled out.

Against the real heavyweights, MOSS-Image shows an interesting split: the complete system (including its own agentic prompt enhancer) ranks only second in the RLA end-to-end comparison, behind GPT Image 2. But strip both systems' prompt enhancers away and give them the same shared, enhanced natural-language prompt, and MOSS-Image's bare backbone actually overtakes GPT Image 2 to top the field. That suggests the MOSS-Image DiT backbone itself is very good at following detailed instructions, but the GPT-6-based prompt enhancer it's paired with — the step that turns a one-line user request into a concrete design spec — still lags behind whatever GPT Image 2 has built in. The bottleneck is planning, not rendering.

On pricing, the two sides are on entirely different paths: GPT Image 2, Seedream 5.0 Pro, and Qwen Image 3.0 Pro are all closed, paid APIs, while MOSS-Image goes fully open under Apache-2.0 for self-hosting at zero marginal cost — competing on "best open-weight long-text rendering" rather than trying to win on overall design quality outright.

## What This Means for Agent Development

In OpenMOSS's own prompt-strategy ablation, the JSON layout prompt — which specifies bounding boxes and coordinates for objects and text directly, using a coordinate system centered on the canvas — scored highest (1622.87 Elo), ahead of a plain natural-language layout description (1506.20 Elo). That means structuring layout requirements as coordinates helps generation quality itself, not just engineering convenience.

- If you're building an agent that needs to produce structured visual assets at scale (e-commerce posters, slide covers, infographic cards, UI mockups): MOSS-Image lets the agent emit JSON coordinate specs directly, without maintaining a separate "text-to-layout" rule engine — and being Apache-2.0, it can be self-hosted and fine-tuned to a house visual style; without a GPU, [fal.ai](https://fal.ai/models/fal-ai/moss-image) already hosts MOSS-Image-SFT as a pay-per-pixel API (unofficial)
- If you're generating bilingual (Chinese/English mixed) content: LLTB's Chinese long-text score (92.4) trails English (97.1) slightly but is still the best among open-weight models in the official table, making it a reasonable fit for marketing assets that need both languages rendered in the same image
- Not a fit: the paper explicitly lists "does not support image-conditioned input or image editing" as a current limitation, so if your agent needs iterative editing of an existing image or consistency of a character across multiple images, MOSS-Image can't do that yet; its agentic prompt enhancer also relies on an external GPT-6 for planning, so a fully self-hosted, closed-loop pipeline would still need to swap that piece out

## Today's Insight

The usual narrative around open-weight text-to-image models catching up to closed giants is "overall image quality is almost there." MOSS-Image cuts the problem differently: instead of claiming the best overall design quality, it opens a large, precisely measurable gap in one narrow domain — long-form text rendering — that closed models tend to underinvest in, then uses the shared-prompt backbone comparison to pin the real gap against GPT Image 2 down to planning, not rendering. But that's also a reminder: a self-built, self-evaluated "best open-weight" claim, before any third-party reproduction exists, really only confirms that the architecture choices are sound — not that the scores can be compared at face value.

## References

- [fal.ai: MOSS Image (Text to Image) API](https://fal.ai/models/fal-ai/moss-image)
- [OpenMOSS MOSS-Image project page](https://openmoss.ai/MOSS-Image/)
- [OpenMOSS-Team/MOSS-Image-Base (Hugging Face model card)](https://huggingface.co/OpenMOSS-Team/MOSS-Image-Base)
- [OpenMOSS/MOSS-Image (official GitHub repository)](https://github.com/OpenMOSS/MOSS-Image)
- [MOSS-Image Technical Report (arXiv:2610.23374)](https://arxiv.org/abs/2610.23374)
- [ArtRealmAI: MOSS-Image Drops 5B Open Weights](https://artrealmai.com/article/moss-image-open-weights-5b-layout)
