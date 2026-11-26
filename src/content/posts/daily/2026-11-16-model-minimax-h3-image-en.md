---
title: "Model Card | MiniMax-H3-Image"
date: 2026-11-16
category: daily
type: digest
tags: [ai-agent, model-release, daily, minimax, model-family-minimax]
lang: en
description: "MiniMax releases the open-weight image model H3-Image — a 33.1B dense diffusion transformer, 6-step distillation for 16MP output. It edges out Nano Banana 2 on Artificial Analysis's editing board but trails by 77 Elo on text-to-image, and its license excludes commercial deployment in the US, EU, UK and South Korea"
tldr: "MiniMax-H3-Image: a 33.1B dense diffusion transformer, 6-step distilled sampling, native 16MP output (starting at 4096x4096). Artificial Analysis Image Editing Elo 1138 (#13/84, narrowly ahead of Nano Banana 2's 1126); Text-to-Image Elo 1066 (#25/114, 77 points behind Nano Banana 2). API pricing: roughly $0.022 for 1K, $0.069 for 4K (50% off until 2026-11-17 16:00 UTC). The MiniMax-H3-Image Community License excludes commercial deployment in the US, EU, UK and South Korea"
series:
  name: "AI Model Tracker"
  order: 74
glossary:
  - term: "MiniMax H3"
    def: "An open-weight omni-modal video model MiniMax released on 2026-07-31 that understands and generates across text, image, video and audio. H3-Image is derived from it by removing the audio layers and attaching an image-generation head"
---

> :globe: [中文版](/posts/daily/2026-11-16-model-minimax-h3-image)

## Model Info

| Field | Value |
|---|---|
| Model ID | `MiniMax-H3-Image` (Highspeed variant: `MiniMax-H3-Image-Highspeed`) |
| Vendor | MiniMax |
| Parameters | 33.1B (dense single-stream diffusion transformer, 50 layers; also requires loading the 66.7GB MiniMax-H3 Qwen3-VL text encoder, roughly 135GB of weights in total) |
| Context Window | Not applicable (image generation model). After H3-Image-Context-IR prompt expansion, only the first ~4,096 tokens take effect in local deployment; the API accepts up to 32,000 characters |
| Input Pricing (USD/1M tokens) | Priced primarily per image: Standard mode $0.02179 at 1K / $0.02333 at 2K / $0.06879 at 4K (4K is 50% off at $0.03439 until 2026-11-17 16:00 UTC). Underlying token rates: $2.30 per 1M input text tokens, $1.50 per 1M input image tokens |
| Output Pricing (USD/1M tokens) | Standard output image tokens: $3.80/1M. Highspeed mode: $7.60/1M output, roughly $0.13 for a 4K image (no launch discount) |
| Open Source | Yes (MiniMax-H3-Image Community License Agreement; excludes deployment and use in the US, EU, UK and South Korea. Annual revenue above US$1M or offering a hosted service requires separate written authorization. Commercial interfaces must prominently display "MiniMax-H3-Image") |
| Release Date | 2026-11-10 |
| Official Announcement | [MiniMax Blog: H3-Image](https://www.minimax.io/blog/minimax-h3-image) |
| HuggingFace | [MiniMaxAI/MiniMax-H3-Image](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image) |
| Family | MiniMax H3 (H3 video model, 2026-07-31 → H3-Image generation/editing model, this release) |

## Capability Highlights

- Native 16-megapixel output spanning every aspect ratio from 4096×4096 (1:1) to 6272×2688 (21:9), with no upscaler, and an API ceiling of 20,000,000 pixels
- 6-step distilled sampling (6 NFEs) with no classifier-free guidance; MiniMax claims sub-10-second 4K generation, up to 5x faster than mainstream alternatives :warning: third-party testing found only the Highspeed tier approaches 10 seconds at 4K — no independent timing has confirmed "under 10 seconds" for the Standard tier
- Up to 16 untyped reference images, addressed positionally as `<Picture 1>` through `<Picture 16>` in upload order, with one checkpoint covering both text-to-image and image editing
- On Artificial Analysis's independent leaderboards (published 2026-11-13): ranks #13/84 on image editing at Elo 1138, narrowly ahead of Nano Banana 2's 1126 (a 12-point lead, with overlapping confidence intervals); ranks #25/114 on text-to-image at Elo 1066, trailing Nano Banana 2's 1143 by 77 points (non-overlapping intervals)

## Benchmark Results

| Benchmark | Score | Previous Generation | Best Competitor |
|---|---|---|---|
| Artificial Analysis Image Editing Elo | 1138 (#13/84) | None (MiniMax's first dedicated image model; no prior image generation to compare against) | Nano Banana 2: 1126 (#17/84) |
| Artificial Analysis Text-to-Image Elo | 1066 (#25/114) | None | Nano Banana 2: 1143 (#11/114) |
| Highspeed variant Image Editing Elo | 1134 (#14/84) | None | Same as above |
| Highspeed variant Text-to-Image Elo | 1072 (#24/114) | None | Same as above |

:warning: All of the above are third-party scores from Artificial Analysis's independent leaderboards, not vendor self-reported figures — neither MiniMax's blog post nor its HuggingFace model card publishes any quantitative evaluation table (no GenEval, no DPG-Bench, no human-preference numbers). In the week after launch (through 2026-11-12), the only "evidence" available was the showcase gallery; it wasn't until Artificial Analysis added it to both leaderboards on 2026-11-13 that a credible quantitative comparison existed.

## Comparison with Previous Generation / Competitors

H3-Image has no true "previous generation" image model to compare against — MiniMax's earlier Hailuo 01/02 were video models, and H3-Image is the company's first dedicated image generation/editing model, architecturally descended from the H3 video model released on 2026-07-31 (with the audio layers removed, reusing its Qwen3-VL text encoder).

Against Google's Nano Banana 2, Artificial Analysis's leaderboards show a clean crossing: H3-Image narrowly wins on image editing (+12 Elo) but loses by 77 Elo on text-to-image, with non-overlapping confidence intervals. This matches each model's design intent — H3-Image's 16 untyped reference images and fixed 6-step sampler are built for "take a reference, edit it," while Nano Banana 2's 14 typed references (10 object, 4 character) plus search grounding and an adjustable thinking budget form a more complete generation pipeline, at the cost of latency and price.

On pricing, H3-Image is clearly cheaper: $0.02179 at 1K standard versus Nano Banana 2's $0.0336 (about 35% cheaper), and $0.06879 at 4K standard versus $0.113 (about 39% cheaper). During the launch discount, the 4K price drops to $0.03439 — roughly 30% of the competitor's price. But that discount expires on 2026-11-17 16:00 UTC, after which the 4K gap narrows noticeably. The licensing difference is the one a pricing table easily hides: the MiniMax-H3-Image Community License explicitly excludes deployment and use in the US, EU, UK and South Korea — in those four markets, "open weights" doesn't mean you can legally run it commercially without a separate license. Nano Banana 2, as a standard API product, carries no such restriction, but also has no equivalent licensing flexibility to compare — beyond its SynthID/C2PA provenance watermarking, which H3-Image lacks entirely.

## Implications for Agent Development

The fixed 6-step sampler with no CFG and no adjustable guidance strength means the same seed and input reproduce bit-for-bit on your own hardware — a rare property for pipelines that need visual-output regression testing. Most diffusion models become hard to reproduce the moment any sampling parameter changes; H3-Image removes that variable by design.

- If you're building an agent for batch e-commerce or marketing asset generation: native 16MP output combined with a flat token-pricing curve (4K costs only 3x the list price despite 16x the pixels), plus pricing 30-40% below Nano Banana 2, makes it a good fit for high-volume 4K batch production — but confirm your team isn't in one of the four excluded jurisdictions first
- If you're building "edit this reference consistently" workflows (character re-dressing, scene composition, UI mockup variations): the 16 untyped reference slots and the narrow editing-board win make this a better first candidate to test than pure text-to-image tasks
- Not a fit: scenarios that need search grounding or output carrying SynthID/C2PA provenance marks — H3-Image has neither, while Nano Banana 2 has both. Also not a fit for production environments with high standards for blank-page text-to-image quality — the 77-Elo gap with non-overlapping intervals is the most certain finding in this comparison

## Today's Takeaway

Neither MiniMax's blog post nor its HuggingFace model card published any quantitative evaluation table — it took three days, until Artificial Analysis added the model to two independent leaderboards, before a credible score comparison existed. That's a reminder that "open weights" and "the vendor honestly self-evaluates" are two separate things: when a new model ships without numbers, that doesn't mean there are no numbers to find — it means you have to wait for an outside leaderboard to supply them. Claims like "5x faster" or "leading open-weight model" are just claims until external data arrives, not conclusions.

## References

- [MiniMax official blog: H3-Image](https://www.minimax.io/blog/minimax-h3-image)
- [MiniMaxAI/MiniMax-H3-Image HuggingFace model card (architecture, license, Model Zoo details)](https://huggingface.co/MiniMaxAI/MiniMax-H3-Image)
- [OrcaRouter: MiniMax-H3-Image vs Nano Banana 2.1 — pricing comparison and "no independent leaderboard" initial assessment (2026-11-10)](https://www.orcarouter.ai/blog/minimax-h3-image-vs-nano-banana-2-1)
- [OrcaRouter: MiniMax-H3-Image vs Nano Banana 2 — Artificial Analysis Elo scores and territorial license restrictions (2026-11-14)](https://www.orcarouter.ai/blog/minimax-h3-image-vs-nano-banana-2)
- [TechTimes: third-party testing of MiniMax H3-Image's 4K generation speed (2026-11-12)](https://www.techtimes.com/articles/330529/20261112/minimax-releases-open-weight-image-model-h3-image-only-pricier-highspeed-tier-nears-10-second-4k.htm)
- [TokenPost: MiniMax H3-Image license excludes the US, EU, UK and South Korea (2026-11-11)](https://www.tokenpost.com/news/technology/54375)
