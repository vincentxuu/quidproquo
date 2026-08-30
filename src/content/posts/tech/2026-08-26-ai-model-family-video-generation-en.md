---
title: "Video Generation Model Families: Sora Exits after a Two-year Arms Race Dominated by Veo 3.1, Kling 3.0, and Gen-4.5"
date: 2026-08-26
category: tech
tags: [video-generation, sora, veo, kling, runway, model-family-video, diffusion-transformer]
lang: en
type: deep-dive
tldr: "Sora's February 2024 preview shocked the industry, but the landscape reversed in two and a half years: OpenAI closed the consumer Sora app in April 2026 and scheduled its API for retirement on September 24; Veo 3.1 became the narrative default with native audio and Flow; Kling 3.0 became a unified multimodal model with $240M annualized revenue; and Runway Gen-4.5 briefly led Artificial Analysis in a November 2025 snapshot while defending the professional market through enterprise workflows. This guide compares four families by generation, specifications, pricing, and use case."
description: "A deep guide to video-generation families: Sora 1-to-2 and retirement, Veo 2-to-3.1 with native audio and Flow, Kling 1.0-to-3.0 commercialization, Runway Gen-3-to-Gen-4.5 enterprise positioning, specifications, prices, and selection for marketing, film, and batch generation."
series:
  name: "AI 模型家族"
  order: 18
draft: false
glossary:
  - term: "Diffusion Transformer（DiT）"
    definition: "An architecture replacing a diffusion model's U-Net backbone with a Transformer. The mainstream video approach compresses video into spatiotemporal latents with a VAE, then denoises those latents with a Transformer. Sora's spacetime patches and Kling's DiT plus 3D VAE follow this path."
  - term: "原生音訊"
    aliases: ["native audio"]
    definition: "Generating picture and sound—dialogue, effects, and ambience—in the same process instead of dubbing later. The advantage is lip synchronization and audiovisual consistency. Veo 3 was the first large-scale deployment."
  - term: "Credit"
    definition: "A virtual billing unit used by generation platforms, with different models consuming different credits per second. Runway, Kling, and Flow use credits; convert them to per-second video cost before comparing platforms."
  - term: "C2PA"
    definition: "The Coalition for Content Provenance and Authenticity standard, which records AI-generation provenance in file metadata. Sora output has included C2PA plus a watermark from day one."
  - term: "SynthID"
    definition: "Google DeepMind's invisible watermark embedded directly in generated pixels or audio waveforms. Human eyes cannot see it, but detection tools can read it. Veo and Imagen include it."
---

> 🌏 [中文版](/posts/tech/2026-08-26-ai-model-family-video-generation)

In February 2024, OpenAI previewed Sora with a minute-long Tokyo street scene and realistic physical reflections. The industry suddenly took text-to-video seriously. Sora was not even a public product—only a few filmmakers could test it—but it set the agenda for the next two years. Two and a half years later, this fifteenth family deep dive in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) has different protagonists: Sora has announced its exit, and Veo, Kling, and Runway divide the market.

For benchmark interpretation, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This is the fifteenth family deep dive in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en).

## Four-family Evolution Timeline

### Sora: From Shockwave to Retirement

Sora 1 opened to ChatGPT Plus and Pro users at sora.com in December 2024 and generated silent video only. The real turning point was [Sora 2](https://openai.com/index/sora-2/) on September 30, 2025: native synchronized audio, major gains in physical correctness, an invitation-only iOS app, and a cameo system for licensing real people's likenesses. It became an immediate hit. The reversal was abrupt. OpenAI notified developers in March 2026 that every Videos API would retire; the [consumer app closed April 26](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation), and the [API stops accepting requests September 24, 2026](https://developers.openai.com/api/docs/guides/video-generation). Official documentation lists no successor. Third-party estimates put lifetime compute cost far above revenue. OpenAI's “GPT-1 moment” description proved prophetic: it was a beginning, not a product.

### Veo: Native Audio Defines the Battlefield

[Veo](https://deepmind.google/models/veo/) followed the steadiest path: announced at I/O in May 2024; Veo 2 reached VideoFX and Vertex AI in December; Veo 3 on May 20, 2025 became the first native-audio model deployed at scale, generating dialogue, effects, and ambience together, alongside the [Flow](https://blog.google/technology/ai/veo-updates-flow/) creation tool. [Veo 3.1](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/) on October 15 improved audio, added Ingredients to Video with three character-reference images, first/last-frame control, and Extend for chained clips. [Gemini API release notes](https://ai.google.dev/gemini-api/docs/changelog) show 4K output and full-resolution vertical video arriving in January 2026, while Veo 2/3.0 endpoints were scheduled to close by late June 2026. Google also began a research collaboration with A24 in June 2026.

### Kling: Kuaishou's Commercial Surprise

[Kling 1.0](https://en.wikipedia.org/wiki/Kling_AI) debuted in June 2024 and opened global testing in July, distinguished by physical realism. It then iterated faster than anyone: 1.5 (2024-09), 1.6 (2024-12), 2.0 Master (2025-04), 2.1 (2025-05, with major price cuts), 2.5 Turbo (2025-09, leading an [Artificial Analysis snapshot](https://www.openpr.com/news/4208084/)), 2.6 (2025-12, native audio), and 3.0 (2026-02). Version 3.0 brought a unified multimodal architecture, native audio in five languages, multi-shot storyboards, character coreference, and video up to 15 seconds. Its [annualized revenue run rate reached $240M in December 2025](https://www.prnewswire.com/news-releases/kling-ai-annualized-revenue-run-rate-hits-usd240-million-in-december-2025-302659847.html), after 19 months and 60 million creators. Kuaishou integrated it with short video and advertising, making it the only player to demonstrate “model as ecommerce infrastructure.”

### Runway: An Enterprise Workflow Moat

Runway commercialized first: Gen-1 in February 2023 for video-to-video, Gen-2 in March for text-to-video, and Gen-3 Alpha in June 2024. [Gen-4.5](https://runwayml.com/research/introducing-runway-gen-4.5), released December 1, 2025, led an [Artificial Analysis text-to-video snapshot](https://www.cnbc.com/2025/12/01/runway-gen-4-5-video-model-google-open-ai.html) at 1,247 Elo. A week later, [TechCrunch reported](https://techcrunch.com/2025/12/11/runway-releases-its-first-world-model-adds-native-audio-to-latest-video-model/) native audio alongside the GWM-1 world model. In 2026, Runway moved toward a platform: Aleph 2.0 editing, Runway Agent, Studio timeline, and July's Runway Dev plus Media Router. Its [API changelog](https://docs.dev.runwayml.com/api-details/api_changelog) retired Gen-3 endpoints at the end of July. Customers such as Lionsgate show the positioning: not a single model, but the layer embedded in professional production.

**Second tier, briefly:** Luma progressed from Dream Machine to Ray3.2, a 16-bit HDR pioneer capped at 1080p in documentation; Pika emphasizes rapid short-video iteration; MiniMax open-sourced Hailuo 3.0's 33B base weights with native 2K in August 2026; xAI Imagine video starts at $0.05/s, with flagship 1.5 reaching roughly $0.25/s at 1080p inside the X ecosystem.

## Specifications and Pricing

| Model | Maximum duration | Maximum resolution | Audio | Price/second | API |
|---|---|---|---|---|---|
| Sora 2 / 2 Pro | 4–25s by tier | 1080p Pro | Native | $0.10; Pro $0.30–$0.70, batch half-price | Yes; retires 2026-09-24 |
| Veo 3.1 Quality / Fast | 8s base, chainable with Extend | 1080p / 4K since 2026-01 | Native | ~$0.40 / $0.15; no-audio about one-third less | Gemini API + Vertex AI |
| Kling 3.0 | 15s multi-shot | High-resolution video tiers; 2K/4K images | Native, five languages | Credits; 2.x about half flagship price or less | Official + fal/Replicate |
| Runway Gen-4.5 | Short clips; exact cap varies by source | 4K from Gen-4 Turbo | Native, added 2025-12 | Credits; entry subscription ~$12–15/month | Official API + Runway Dev |
| Hailuo 3.0 (H3) | 5–15s, extendable to ~30s | 2K | Native stereo | ~$0.13–$0.26 by resolution/channel | Official API; open weights |

Prices are approximate at publication; verify current official pricing before procurement.

## Architectural Consensus: Everyone Is on the Same Path

All four converge on **diffusion transformers over latents**. A 3D VAE compresses video into spatiotemporal latents, splits them into patches, and a Transformer denoises them. Sora's spacetime patches were the earliest public description; Kling documents DiT + 3D VAE. Runway's Gen-4.5 A2D advances this with autoregressive planning by Qwen2.5-VL and parallel diffusion decoding.

The second consensus is **audiovisual synchronization**. After Veo 3, Kling 2.6, Sora 2, Gen-4.5, and H3 all adopted native audio within a year. Sound went from differentiator to admission ticket. The third is **consistency control**: reference images lock characters through Veo Ingredients, Kling element consistency, and Runway multi-shot control, replacing early videos in which every shot seemed to recast the actors.

## Copyright, Watermarks, and Commercial Use

Three approaches coexist. OpenAI uses visible plus verifiable provenance: Sora downloads carry a dynamic watermark and [C2PA credentials](https://openai.com/index/creating-with-sora-safely/). Google embeds invisible [SynthID](https://deepmind.google/models/synthid/) into pixels and waveforms and says it has marked tens of billions of assets. Some platforms reserve watermark-free export for paid tiers. Paid plans generally permit commercial use. Two traps remain: metadata can be stripped, so failure to detect a signal does not prove human origin; and restrictions on real likenesses, cameos, and copyrighted characters vary by platform. Read service terms before commercial use rather than relying on demos.

## Selection Advice

- **Marketing shorts:** Veo 3.1 is the default. Native audio removes a whole post-production stage; use Fast for drafts and Quality for final output. Kling 2.6/3.0 offers a better audio/price mix when cost or Chinese speech matters.
- **Film previsualization:** Runway. Gen-4.5 consistency and Aleph 2.0 editing support director revisions, while Studio and Adobe Firefly integration fit existing pipelines. Use Luma Ray3.2 when HDR/EXR output is a grading requirement.
- **Programmatic batch generation:** avoid credit subscriptions and use per-second APIs. Hailuo H3 starts around $0.18/s depending on channel and can be self-hosted for low-cost volume. Veo on Vertex AI suits enterprise contracts and data governance. Do not start a new Sora workflow while its API retirement counts down.

## Overall

The story has three acts. Sora defined the category with a preview but did not win the market. Veo reset the minimum standard with native audio and forced everyone to follow within a year. Kling proved a Chinese short-video ecosystem could turn a video model into a money machine, while Runway showed that professional workflows retain customers better than a leaderboard lead. The next dividing line is already visible: world models such as Runway GWM-1 and Google's Genie line, plus open weights such as H3 and Wan, are moving the contest from who makes the prettiest clip to who can simulate a world—and who can be deployed independently.

---

## References

- [Sora 2 — OpenAI](https://openai.com/index/sora-2/)
- [Video generation with Sora — OpenAI API Docs](https://developers.openai.com/api/docs/guides/video-generation)
- [What to know about the Sora discontinuation — OpenAI Help](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation)
- [Creating with Sora safely — OpenAI](https://openai.com/index/creating-with-sora-safely/)
- [Veo — Google DeepMind](https://deepmind.google/models/veo/)
- [Introducing Veo 3.1 — Google Developers Blog](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/)
- [Gemini API Release Notes](https://ai.google.dev/gemini-api/docs/changelog)
- [Veo updates coming to Flow — Google Blog](https://blog.google/technology/ai/veo-updates-flow/)
- [Kling AI — Wikipedia](https://en.wikipedia.org/wiki/Kling_AI)
- [Kling AI Annualized Revenue Run Rate Hits USD240 Million — PR Newswire](https://www.prnewswire.com/news-releases/kling-ai-annualized-revenue-run-rate-hits-usd240-million-in-december-2025-302659847.html)
- [Introducing Runway Gen-4.5 — Runway Research](https://runwayml.com/research/introducing-runway-gen-4.5)
- [Runway releases its first world model — TechCrunch](https://techcrunch.com/2025/12/11/runway-releases-its-first-world-model-adds-native-audio-to-latest-video-model/)
- [Runway API Changelog](https://docs.dev.runwayml.com/api-details/api_changelog)
- [SynthID — Google DeepMind](https://deepmind.google/models/synthid/)
- [Luma model information](https://lumalabs.ai/llm-info)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en)
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en)
