---
title: "FLUX: The Image Model Family Built by Stable Diffusion's Original Team, from 12B to a Self-Flow World Model"
date: 2026-08-26
category: tech
tags: [ai-agent, flux, black-forest-labs, model-family-flux, image-generation, diffusion-model, model-selection]
lang: en
type: deep-dive
tldr: "FLUX is Black Forest Labs' image-model family. The Stable Diffusion team launched it in August 2024 with a 12B rectified-flow transformer. Two years later it spans klein 4B ($0.014 and the only current Apache-2.0 model) / 9B, pro ($0.03), flex ($0.05), max ($0.07 with live web grounding), and open-weight 32B dev. FLUX 3 extends Self-Flow to video, synchronized audio, and robot actions. This guide covers the FLUX.1-to-FLUX 3 evolution, three-tier licensing, and model selection."
description: "A complete guide to Black Forest Labs' FLUX family: its 2024–2026 timeline, rectified-flow transformer architecture, schnell/dev/pro through FLUX.2 klein/max, noncommercial licensing traps, per-image pricing, competitors including Midjourney and Imagen, and FLUX 3 video and robotics."
series:
  name: "AI 模型家族"
  order: 16
draft: false
glossary:
  - term: "Rectified Flow Transformer"
    aliases: ["rectified flow", "流匹配"]
    definition: "FLUX's core architecture: rectified flow or flow matching learns a direct noise-to-data path instead of a diffusion model's curved denoising trajectory. FLUX implements it as a transformer in which text and image tokens share bidirectional attention."
  - term: "Guidance Distillation"
    definition: "Distilling a two-forward-pass guidance technique into the weights so one forward pass produces high-quality output. This distillation is the main difference between FLUX dev and pro."
  - term: "Grounded Generation"
    definition: "FLUX.2 max's signature feature: live web search during inference brings current information such as a person's appearance or product imagery into generation, addressing frozen model knowledge."
  - term: "Self-Flow"
    definition: "FLUX 3's unified multimodal architecture, jointly learning images, video, audio, and robot-action prediction in one set of weights; the foundation for BFL's move from image tooling to visual intelligence and world models."
---

> 🌏 [中文版](/posts/tech/2026-08-26-ai-model-family-flux)

In August 2024, four German researchers who had left Stability AI—Robin Rombach, Patrick Esser, Andreas Blattmann, and Dominik Lorenz—founded [Black Forest Labs](https://bfl.ai) in Freiburg. Rombach was first author of the Latent Diffusion paper, and this group built the architecture behind Stable Diffusion. Amid their former employer's financial turmoil and researcher exodus, they released [FLUX.1](https://bfl.ai/blog/flux-2) that same month. Its 12B parameters immediately beat the successor from their former company. This thirteenth AI Model Families article traces how the “German Avengers” grew one open model into a visual-intelligence company spanning images, video, and robotics in two years.

For benchmark interpretation, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is the thirteenth family deep dive in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en).

## Family Evolution Timeline

| Version | Release | Key facts |
|---|---|---|
| BFL founded | 2024-08 | Started in Freiburg with a $31M seed led by a16z |
| FLUX.1 schnell/dev/pro | 2024-08 | 12B rectified-flow transformer; schnell Apache-2.0, dev noncommercial, pro API-only |
| Series A | Late 2024 | About $100M led by a16z at a $1B valuation—unconfirmed officially; [TechCrunch](https://techcrunch.com/2024/09/20/grok-image-generator-black-forest-labs-raising-100m-at-1b-valuation/) cited sources in September 2024 |
| FLUX1.1 pro | 2024-10 | Six times faster; Ultra/Raw modes added in November with output up to 4MP |
| FLUX.1 Kontext | 2025-05 | Text-plus-image contextual editing; Kontext dev weights opened in June |
| FLUX.2 pro/flex/dev | 2025-11-25 | 32B architecture, Mistral 3 24B VLM text encoder, up to ten reference images, native 4MP ([blog](https://bfl.ai/blog/flux-2), [GitHub](https://github.com/black-forest-labs/flux2)) |
| FLUX.2 max | 2025-12-16 | Highest tier with live web grounded generation |
| Series B | 2025-12-01 | $300M at $3.25B, co-led by Salesforce Ventures and AMP, with NVIDIA, Figma Ventures, and Canva |
| FLUX.2 klein | 2026-01-15 | 4B ([Apache-2.0](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)) and noncommercial 9B; starts at 13GB VRAM; subsecond consumer-GPU generation |
| FLUX 3 announced | 2026-07-23 | Self-Flow foundation for images, 20-second video, synchronized audio, and robot actions; FLUX-mimic tested on Audi production lines ([announcement](https://bfl.ai/blog/flux-3)) |
| FLUX 3 Video GA | 2026-08-04 | One-pass 20-second FHD (1920×1088) at 24fps, native lip-synced audio, Draft preview ([release](https://bfl.ai/blog/flux-3-video)); FLUX 3 Image and open-weight Dev promised later in the year |

The playbook is clear: win the community with open weights—[FLUX.2-dev](https://huggingface.co/black-forest-labs/FLUX.2-dev) saw about 650,000 downloads in a month and its predecessor exceeded 30 million lifetime—then monetize through API tiers. Sacra estimated $96M annualized revenue by August 2025; Meta signed a $140M multiyear contract in September.

## Five Product Lines and One Backbone

FLUX slices one backbone by speed and control:

- **klein (4B/9B):** maximum step and guidance distillation for real time, subsecond on GB200. Together with the older schnell, 4B is one of only two Apache-2.0 weight releases in the family.
- **dev:** open-weight 32B research tier, guidance-distilled from pro. Full precision requires datacenter hardware; Hugging Face and BFL provide quantizations that run on RTX 4090.
- **flex:** the only API tier exposing low-level controls such as steps, for precise layout and detail workflows.
- **pro:** production default balancing quality and price.
- **max:** highest tier, with grounding search and the strongest editing consistency.

Three architectural facts matter. FLUX uses a rectified-flow transformer rather than a U-Net diffusion model; text and image patches attend inside one transformer stack, making accurate text rendering a signature from FLUX.1 onward. FLUX.2 replaces its text encoder with the Mistral 3 24B VLM, enabling visual-language understanding and editing across ten reference images. Shared modulation parameters plus guidance distillation make negative prompts technically unavailable, so users migrating from Stable Diffusion must change that habit.

## Licensing Trap: Openness Is Tiered, Not Binary

- **Apache-2.0:** FLUX.1 schnell and FLUX.2 klein 4B. Commercial use, self-hosting, and modification are permitted without a revenue threshold.
- **FLUX Non-Commercial License:** FLUX.1 dev, Kontext dev, FLUX.2 dev, and klein 9B. Weights are downloadable and **generated output may be sold**. The restriction applies to the model: commercial hosted service or training a competing model is prohibited. Commercial self-hosting requires BFL's Builder license, starting at 10,000 images/month and negotiated above that. The trap concerns deployment, not selling output.
- **API-only:** pro, flex, max, Kontext pro, and Kontext max are closed.

Midjourney, Ideogram, and Google Imagen provide no weights; Qwen-Image's main line uses Apache-2.0, but newer releases have closed. FLUX is the only major image family promising a self-hostable weight release every generation, although it is usually noncommercial. Training-data composition remains undisclosed, so users must assess copyright risk themselves.

## Pricing and Competitors

BFL bills in credits, one credit equaling $0.01. FLUX.2 bills by the **megapixel**, with declining prices after the first MP ([official pricing](https://docs.bfl.ml/quick_start/pricing)):

| Model | Starting price | Notes |
|---|---|---|
| FLUX.2 klein 4B | $0.014 | Per image, subsecond |
| FLUX.2 klein 9B | $0.015 | Per image |
| FLUX.2 pro | $0.03 (editing $0.045) | Subsequent MP half-price at $0.015 |
| FLUX.2 flex | $0.05 | Adjustable steps |
| FLUX.2 max | $0.07 | Includes grounding search |
| FLUX 3 Video | $0.17/s HD / $0.29/s FHD | Draft preview $0.06/s |

Google Imagen 4 Standard is about $0.04/image and Ultra $0.06; OpenAI GPT Image about $0.04; Midjourney sells a $30/month subscription rather than per-image API access; Grok Imagine starts at $0.02. FLUX spans $0.014–$0.07, covering both the least expensive usable tier and the highest-quality end.

Leaderboard position depends on the snapshot. In December 2025 LMArena, GPT Image led FLUX.2 pro by more than one percentage point; by mid-2026 they were near peers. [Artificial Analysis](https://artificialanalysis.ai/image/leaderboard/text-to-image) shows the current table. Open-weight dev entered around 1,149 ELO in a community-reposted December 2025 snapshot, the highest Western open-weight model; China's open-weight Hunyuan Image 3.0 ranked higher. Editing snapshots put it around 1,200–1,250.

## Lessons: Selection for Agent Developers

- **High-throughput or interactive drafts:** klein 4B—$0.014, subsecond, Apache-2.0 self-hosting fallback.
- **Final and brand assets:** pro. At $0.03, its quality/price ratio is hard to beat; a 4MP image costs about $0.075 because later megapixels are half-price.
- **Current factual grounding:** max's web grounding is unique.
- **Local/private deployment:** klein 4B or dev. Dev output may be sold, but hosted commercial service requires a Builder license; verify the terms first.
- **Video:** FLUX 3 Video is GA from $0.17/s HD, but independent benchmarks are not yet available; discount official win-rate claims.
- **Mixed strategy:** draft in klein, finish in pro, reserve max for shots requiring grounding. Prices differ fivefold while sharing one API.

Overall, FLUX is a story of defectors rebuilding influence through open weights. The original Stable Diffusion team inherited its open community, then converted community trust into enterprise contracts with Adobe, Canva, and Meta through tiered licensing. The 2026 bet is larger: Self-Flow puts images, video, audio, and robot actions into one set of weights. “A model that only learns images can only generate images,” Rombach said. Whether open weights remain a moat in the FLUX 3 generation is the question to watch over the next year.

---

## References

- [FLUX.2: Frontier Visual Intelligence — BFL](https://bfl.ai/blog/flux-2)
- [black-forest-labs/flux2 — GitHub](https://github.com/black-forest-labs/flux2)
- [FLUX.2-dev — Hugging Face model card](https://huggingface.co/black-forest-labs/FLUX.2-dev)
- [FLUX.2-klein-4B — Hugging Face model card](https://huggingface.co/black-forest-labs/FLUX.2-klein-4B)
- [BFL Docs — Pricing](https://docs.bfl.ml/quick_start/pricing)
- [BFL Docs — Release Notes](https://docs.bfl.ml/release-notes)
- [Black Forest Labs raises $300M at $3.25B valuation — TechCrunch](https://techcrunch.com/2025/12/01/black-forest-labs-raises-300m-at-3-25b-valuation/)
- [FLUX 3: Multimodal Video, Image & Audio — BFL](https://bfl.ai/blog/flux-3)
- [FLUX 3 Video, Part 1 — BFL](https://bfl.ai/blog/flux-3-video)
- [Black Forest Labs revenue, valuation & funding — Sacra](https://sacra.com/c/black-forest-labs)
- [Text-to-Image Leaderboard — Artificial Analysis](https://artificialanalysis.ai/image/leaderboard/text-to-image)
- [Grok's image generator, Black Forest Labs, is raising $100M at a $1B valuation — TechCrunch](https://techcrunch.com/2024/09/20/grok-image-generator-black-forest-labs-raising-100m-at-1b-valuation/)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en)
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en)
