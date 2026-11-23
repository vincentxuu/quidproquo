---
title: "Video Generation Model Families: After Sora, the New Field of Wan 3.0, MiniMax H3, Gemini Omni Flash, and Kling 4.0"
date: 2026-08-26
category: tech
tags: [video-generation, model-family-video, wan, minimax, kling, gemini-omni, sora, diffusion-transformer]
lang: en
type: deep-dive
tldr: "By November 2026 video generation has a new cast. The Sora app closed on 2026-04-26 and the Sora API on 2026-09-24 with no replacement; in the Gemini API, Google replaced Veo with Gemini Omni Flash (version 1.2 went GA on 2026-11-05). On Artificial Analysis's text-to-video-with-audio board v2.1, first place is the API-only Wan 3.0 (1175) and the top open-weights model is MiniMax H3 (1163), whose license excludes the United States, the EU, the UK, and South Korea and requires separate written authorization above $20 million in annual product revenue. The top scores are bunched together, so choose on single-pass length, access, license, and price rather than rank."
description: "Cross-family comparison of video generation (November 2026): Sora's exit and the Veo handover, Wan moving from open weights to API-only 3.0, MiniMax H3 open weights and their license limits, Kling 3.0 to 4.0, Seedance 2.5, and Runway's turn into a multi-model platform, with the AA-Video-T2V v2.1 board, a spec and price table, and selection advice."
series:
  name: "AI Model Families"
  order: 18
draft: false
glossary:
  - term: "Diffusion Transformer（DiT）"
    definition: "An architecture replacing a diffusion model's U-Net backbone with a Transformer. The mainstream video approach compresses video into spatiotemporal latents with a VAE, then denoises those latents with a Transformer. Sora's spacetime patches and MiniMax H3's Omni Transformer follow this path."
  - term: "原生音訊"
    aliases: ["native audio"]
    definition: "Generating picture and sound—dialogue, effects, and ambience—in the same process instead of dubbing later. The advantage is lip synchronization and audiovisual consistency. Veo 3 was the first large-scale deployment; by 2026 every mainstream model has it built in."
  - term: "Credit"
    definition: "A virtual billing unit used by generation platforms, with different models consuming different credits per second. Runway, Kling, and similar platforms use credits; convert them to per-second video cost before comparing platforms."
  - term: "C2PA"
    definition: "The Coalition for Content Provenance and Authenticity standard, which records AI-generation provenance in file metadata. Sora output included C2PA plus a watermark from day one."
  - term: "SynthID"
    definition: "Google DeepMind's invisible watermark embedded directly in generated pixels or audio waveforms. Human eyes cannot see it, but detection tools can read it. Veo and Imagen include it."
---

> :globe: [中文版](/posts/tech/2026-08-26-ai-model-family-video-generation)

OpenAI's Sora preview in February 2024 set the agenda for text-to-video; two years later Sora itself is gone. This is the cross-family video-generation comparison in the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series, written for people wiring video generation into a product or an agent workflow. After reading it you should know which models are available in November 2026, which have shut down, whether open weights can be used in your market, and which model to try first for each use case. Leaderboard and price data are from 2026-11-23; rankings move every few weeks, so cite them with a date.

For how to read the benchmark numbers cited here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## The November 2026 field: leaderboard and available models

The two biggest changes this year were exits. OpenAI [closed the Sora app on 2026-04-26 and the Sora API on 2026-09-24](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation), and its [API deprecations page](https://developers.openai.com/api/docs/deprecations) lists "No one-to-one replacement" for `sora-2`, `sora-2-pro`, and the Videos API. Google shut down the Veo 3.1 preview endpoints in the Gemini API on 2026-10-22, with [`gemini-omni-1.2-flash` as the official replacement](https://ai.google.dev/gemini-api/docs/deprecations).

[Artificial Analysis AA-Video-T2V v2.1](https://artificialanalysis.ai/video/leaderboard/text-to-video) ranks text-to-video with audio from blind votes. The top of the board on 2026-11-23:

| Model | AA Elo (with audio) | 95% rank range | Type | $/minute | Developer |
|---|---|---|---|---|---|
| Wan 3.0 | 1175 | 1–3 | Closed API | $12.00 | Alibaba Cloud |
| Utopai X | 1171 | 1–3 | Closed | No API | Utopai |
| MiniMax H3 (768p) | 1163 | 2–6 | Open weights (custom license) | $4.80 | MiniMax |
| Hyperflow H3 | 1157 | 3–9 | Open weights (H3 derivative) | Not yet priced | VideoRebirthAI |
| Dreamina Seedance 2.5 | 1156 | 3–8 | Closed | $34.12 | ByteDance |
| Gemini Omni Flash 1.2 | 1154 | 3–9 | Closed | $6.26 | Google |
| FLUX 3 Max | 1151 | 4–9 | Closed | $8.70 | Black Forest Labs |
| HeyGen Video 1 | 1150 | 4–10 | Closed | $2.40 | HeyGen |
| Pika H3 Flex | 1125 | 11–15 | Open weights (H3 derivative) | $2.10 | Pika |
| Kling 3.0 1080p (Pro) | 1000 | 23–24 | Closed | $10.08 | Kuaishou; the board's Elo anchor |
| Veo 3.1 | 962 | 26–28 | Closed | $24.00 | Google's previous generation |

Three cautions apply. First, the 95% intervals of the top eight overlap; a gap between 1150 and 1175 cannot produce a stable order, so treat the ranks as one tier. Second, v2.1 fixes Kling 3.0 1080p (Pro) at 1000, so its scores are not comparable with older boards, such as the 1,247 Elo for Gen-4.5 cited in the August 2026 version of this article. Third, $/minute is the API price AA computes at its benchmark settings (1080p where offered); H3 is measured at 768p, a different output spec from the 1080p entries.

Absences matter too. Kling 4.0 launched on 2026-10-15, but its API was not yet open when it was announced, and the v2.1 board lists only the Kling 3.0 family; Runway's Gen-4.5 is not on the v2.1 with-audio board. Among the top three open-weights entries, the Hugging Face pages of Hyperflow H3 and Pika H3 Flex both list MiniMax H3 as the base model, so the open-weights slot is currently a single family.

## Family evolution

### Sora: it defined the field but did not outlast its second generation

Sora 1 opened to ChatGPT Plus/Pro in December 2024 and produced silent video only. [Sora 2](https://openai.com/index/sora-2/) on 2025-09-30 added native synchronized audio and the cameo consent mechanism, and its iOS app was an instant hit. On 2026-03-24 OpenAI issued the retirement notice for Sora 2 and the Videos API; the app and web experience closed on 2026-04-26, and the API stopped accepting requests on 2026-09-24. OpenAI has not launched a replacement video API, so integrations still on the Sora API must switch vendors; purchased Sora credits can be used for Codex instead.

### Google: from Veo to Gemini Omni Flash

[Veo](https://deepmind.google/models/veo/) debuted in May 2024. Veo 3 on 2025-05-20 was the first native-audio model deployed at scale, and [Veo 3.1](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/) on 2025-10-15 added reference images for character locking and first/last-frame control. In 2026, video generation in the Gemini API moved to the natively multimodal Gemini Omni line: a preview on 2026-06-30, [Gemini Omni 1.1 Flash](/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash-en) GA on 2026-08-27, and [version 1.2 on 2026-11-05](https://ai.google.dev/gemini-api/docs/changelog), which raised single-pass generation to 15 seconds, reference images to six, and cut video output pricing by 30%. From 2026-12-03 the 1.1 endpoint routes automatically to 1.2. In the Gemini API, the Veo 2 and 3.0 endpoints closed on 2026-06-30 and the Veo 3.1 preview endpoints on 2026-10-22; the replacement in every case is `gemini-omni-1.2-flash`.

### Kling: Kuaishou's iteration speed

Kling 1.0 debuted in June 2024 and has iterated faster than anyone since. [Kling 3.0](https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-launches-30-model-ushering-era-where-everyone-can-be/) (2026-02-05) merged text-to-video, image-to-video, reference generation, and video editing into a single multimodal architecture with 15-second clips, multilingual native audio, and multi-shot storyboarding; [native 4K followed on 2026-04-23](https://kling.ai/blog/kling-ai-introduces-native-4k-video-model). [Kling 4.0](https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-officially-launches-next-generation-kling-40-raising/) officially launched on 2026-10-15 with 30-second single-pass generation, up to 15 reference assets and 10 keyframes, output up to 10-bit HDR, and integration with Kling MCP and CLI; at announcement its API was still "coming soon." The commercial milestone was an [annualized revenue run rate of $240 million in December 2025](https://www.prnewswire.com/news-releases/kling-ai-annualized-revenue-run-rate-hits-usd240-million-in-december-2025-302659847.html).

### Wan: from open-source benchmark to API-only

Alibaba's Wan 2.1 and 2.2 were the most important open video models; [Wan2.2's weights are released under Apache-2.0](https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B) and can still be downloaded and used commercially. From 2.5 on the line moved to APIs, and [Wan 3.0](https://www.alibabacloud.com/en/news/product/video-generation-model-wan30-officially-launched-nsb) officially launched on 2026-08-24: up to 30 seconds per pass, up to 1080P, native audio, references of up to 10 images, 5 videos, and 5 audio clips at once, plus documents and web pages as input. The API needs no application, bills by the second, and does not charge for failed generations. The Wan-AI organization on Hugging Face has no 3.0 weights. Launch details are in the [Wan3.0 model card](/posts/daily/2026-08-26-model-alibaba-wan3-0-en).

### MiniMax: from Hailuo to H3 open weights

MiniMax's video line was originally offered as an API under the Hailuo brand. The weights of [MiniMax H3](https://huggingface.co/MiniMaxAI/MiniMax-H3) went up on Hugging Face at the end of July 2026 (license date 2026-08-02), and it is now the highest-scoring open-weights model on the AA board. Watch the scope of the release: the weights cover H3-Base only, with 768p output; H3-Regenerate-2K, which raises output to 2K, and the H3-Context-IR preprocessing system are not open source and run through MiniMax's API. The model card specifies 4–15 seconds per clip, 24 fps, and 32 kHz stereo. License limits are covered under "Licensing, watermarks, and commercial use" below.

### Seedance: ByteDance's 30-second single take

[Seedance 2.5](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5) launched on 2026-07-31. It keeps 2.0's joint audio-video architecture, raises single-pass generation from 15 to 30 seconds with multiple rounds of extension, accepts up to 30 images, 10 videos, and 10 audio clips as references in one pass, and supports timestamp-targeted edits. It rolled out on Jimeng, Doubao Pro, and Dreamina, with the API on BytePlus ModelArk (marked "coming soon" at launch). It sits in the top tier on the AA board, but at $34.12 per minute it is the most expensive of the leaders.

### Runway: from model maker to multi-model platform

Runway commercialized first: Gen-1 and Gen-2 (2023), Gen-3 Alpha (2024-06), and [Gen-4.5](https://runwayml.com/research/introducing-runway-gen-4.5), which took first place on the AA text-to-video board of the time when it launched on 2025-12-01. In 2026 Runway did not release a new-generation video foundation model. The main thread in its [changelog](https://runway.com/changelog) is bringing third-party models such as Wan 3.0, Seedance 2.5, MiniMax Hailuo 3.0, Gemini Omni Flash, and Kling 3.0 into its interface and Runway MCP, plus Aleph 2.0 video editing, Runway Agent, the Studio timeline, Ruby HDR grading, and plugins for Premiere Pro, After Effects, and DaVinci Resolve. Choosing Runway now means choosing a production environment, not a model.

**Others**: xAI's Grok Imagine Video 1.5 scores 1051 on v2.1 at $15.00 per minute; Lightricks' LTX-2.5 sits around 935. Luma's Ray3.2 is not on the v2.1 board; in August 2026 its [official documentation](https://lumalabs.ai/llm-info) listed a 1080p limit, and its pitch is 16-bit HDR output.

## Specifications and pricing

Only generations currently available and recommended are listed. Prices use official pricing where possible; where no official per-second price is published, they are converted from AA's $/minute and labeled as such.

| Model | Single-pass length | Resolution | Audio | Price (per second) | Access |
|---|---|---|---|---|---|
| Wan 3.0 | 30 s | Up to 1080P | Native | ~$0.20 at 1080P (AA $12.00/min) | Alibaba Cloud Model Studio API; no weights |
| MiniMax H3 | 4–15 s | Open weights 768p; 2K via API | Native stereo 32 kHz | ~$0.08 at 768p (AA $4.80/min) | Weights (custom license) + MiniMax API |
| Seedance 2.5 | 30 s, multi-round extension | Not listed on the official pages cited here | Native | ~$0.57 (AA $34.12/min) | Jimeng, Dreamina, BytePlus ModelArk |
| Gemini Omni 1.2 Flash | 15 s; extend to 30 s total | Native 720p; 1080p and 4K upsampled | Native | ~$0.07 at 720p, ~$0.104 at 1080p, ~$0.209 at 4K (official) | Gemini API |
| Kling 3.0 | 15 s | Native up to 4K | Native (multilingual) | ~$0.17 at 1080p Pro (AA $10.08/min) | Official API and third-party platforms |
| Kling 4.0 | 30 s | Up to 10-bit HDR; 4K, 1080p, 21:9 marked as coming | Native | No published API price | Kling platform, MCP, CLI; API coming |
| Runway Gen-4.5 | Short clips (limit not listed in the sources cited here) | Native limit not listed in the sources cited here | Native | Credits | Runway platform and API |

Gemini Omni 1.2 Flash's per-second prices are Google's own token conversion ($12.00 per million video output tokens, 5,792 tokens per second at 720p); 1080p and 4K are upsampled, not native. Vendors change prices often, so check the official pricing pages before buying.

## Architectural consensus: everyone is on the same path

The technical core has converged on **diffusion transformers over latents**: compress video into spatiotemporal latents, cut them into patches, and denoise with a Transformer. Sora's spacetime patches were the earliest public description; the most complete public description today is MiniMax H3's model card: a 33B-parameter dense single-stream Transformer (about 13B of it in AdaLN branches that can be precomputed and need not be loaded for inference), text encoded from layer 50 hidden states of Qwen3-VL-32B, a visual VAE with 16x spatial and 4x temporal compression, and visual and audio latents predicted jointly by one Transformer.

Three points of consensus in 2026:

- **Joint audio-video generation is table stakes.** Everyone followed Veo 3 within a year; Seedance 2.5, Kling 3.0, and H3 all generate audio and picture in the same process.
- **Thirty seconds per pass is the new ceiling.** Wan 3.0, Seedance 2.5, and Kling 4.0 all reached 30-second single-pass generation in the second half of 2026; Gemini Omni 1.2 Flash does 15 seconds plus conversational extension.
- **References went from "a few images" to "a whole bundle."** Wan 3.0 takes 10 images, 5 videos, and 5 audio clips; Seedance 2.5 takes 30 images, 10 videos, and 10 audio clips; Kling 4.0 takes up to 15 references plus 10 keyframes; H3's Ref2VA variant takes up to 12 files. Consistency control has gone from selling point to baseline; the differences are how much you can feed in and whether you can target edits at specific timestamps.

## Licensing, watermarks, and commercial use

**Read open-weights licenses clause by clause.** The [MiniMax H3 Community License](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE) grants rights only within the "Applicable Territory," which explicitly excludes the European Union, the United Kingdom, the Republic of Korea, and the United States. Commercial products or services with more than $20 million in annual revenue need prior written authorization by email, and commercial products must prominently display "MiniMax H3" in their interface. The acceptable use policy also requires that generated content published in public environments be clearly disclosed as machine-generated. The license counts distilled and derivative models as "MiniMax H3 Works," so derivative weights such as Hyperflow H3 and Pika H3 Flex need the same check. If you need open weights with no territorial limits, the safest choice today is Apache-2.0 Wan2.2, a generation behind in quality.

**Three watermarking approaches coexist.** OpenAI used "visible plus verifiable": downloaded Sora files carried a moving watermark and [C2PA content credentials](https://openai.com/index/creating-with-sora-safely/) (Sora has shut down, so this is now historical). Google embeds the invisible [SynthID](https://deepmind.google/models/synthid/) directly into pixels and waveforms. Some platforms sell watermark removal as a paid feature. Two traps: metadata can be stripped, so a missing signal does not prove a human shot the footage; and platform rules on real people's likeness and copyrighted characters differ clause by clause, so read the terms of service before commercial use instead of relying on demo videos.

## Selection advice

- **Highest quality with audio**: Wan 3.0. Thirty-second single shots and documents or web pages as input suit marketing and education content automation. In the same tier at about half the price is Gemini Omni 1.2 Flash (1080p is upsampled), a good fit for teams already on the Gemini API.
- **Long narratives and fine editing**: Seedance 2.5 has the most complete combination of 30 seconds, multi-round extension, and timestamp editing, but the highest unit price; test costs on short clips first. Kling 4.0 has similar specs; evaluate whether it fits automated pipelines once its API opens.
- **Self-hosting**: MiniMax H3 is the top open-weights model, and the model card's SGLang example runs on 4 GPUs. First confirm that your users and operations are outside the United States, the EU, the UK, and South Korea and that annual revenue stays under $20 million, and note that only the 768p H3-Base is open. If you do not qualify, fall back to Apache-2.0 Wan2.2 or use an API.
- **Budget batch generation**: Pika H3 Flex ($2.10/minute) or HeyGen Video 1 ($2.40/minute); Gemini Omni 1.2 Flash's 360p draft tier at about $0.023 per second suits cheap iteration before a final render.
- **Film and editing workflows**: Runway. Its value is Aleph 2.0 editing, the Studio timeline, and the Adobe and DaVinci plugins, plus switching among Wan 3.0, Seedance 2.5, Gemini Omni Flash, and other models in one interface.
- **Still on the Sora API or Veo preview endpoints**: both sets of endpoints have shut down, so migrate. Veo's official replacement is `gemini-omni-1.2-flash`; Sora has no official replacement, so choose by use case from the list above.

When wiring video generation into an agent, abstract the model ID behind Runway Model Router or your own routing layer: this year Sora, Veo, and Gemini Omni 1.1 were all shut down or rerouted within months, and integrations that hard-code model names break first.

## Overall

This year's story has three threads. First, the pioneers left: Sora defined the field with one preview, then shut down within a year of its second generation, and in the Gemini API Google replaced Veo with Gemini Omni. Second, Chinese vendors hold the front: Wan, MiniMax, Seedance, and Kling are all in the top tier or have just shipped a new generation, and the open-weights slot is almost entirely the H3 family, whose license excludes the United States and the EU. Third, single-model leads keep getting shorter, and Runway simply became a multi-model platform. The selection lesson: do not bet on a single model. Write down your capability needs (length, references, audio, resolution), license territory, and cost per second, and let a routing layer swap models.

---

## Update history

- 2026-11-23: Updated the data to November 2026. Added "The November 2026 field" section using the Artificial Analysis AA-Video-T2V v2.1 with-audio board (2026-11-23); replaced the spec and price table with currently available generations (Wan 3.0, MiniMax H3, Seedance 2.5, Gemini Omni 1.2 Flash, Kling 3.0/4.0, Runway Gen-4.5); added Wan, MiniMax, and Seedance family sections and an H3 license explanation. Sora 2 and Veo 3.1 moved to history: the Sora API shut down on 2026-09-24, and the Veo 3.1 preview endpoints in the Gemini API shut down on 2026-10-22 with `gemini-omni-1.2-flash` as the official replacement; the old table's Sora 2 and Veo 3.1 prices were removed, and launch-time details are in the [Wan3.0](/posts/daily/2026-08-26-model-alibaba-wan3-0-en) and [Gemini Omni 1.1 Flash](/posts/daily/2026-09-02-model-google-gemini-omni-1-1-flash-en) model cards. Corrections: Hailuo H3 was described as "native 2K" and "5–15 seconds, extendable to about 30 seconds"; per the model card, the open weights reach only 768p, 2K requires the API, and clips are 4–15 seconds. Removed the description of Runway Gen-4.5's "A2D architecture with Qwen2.5-VL," which could not be checked against a primary source.
- 2026-10-11: Normalized series metadata and end-section ordering; retained the existing comparison hierarchy, sources, and dates. No fresh fact-check was performed.

## References

- [AA-Video-T2V v2.1 — Artificial Analysis](https://artificialanalysis.ai/video/leaderboard/text-to-video) — text-to-video with audio, open-weights ranking, and $/minute (2026-11-23)
- [What to know about the Sora discontinuation — OpenAI Help](https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation) — app closed 2026-04-26, API 2026-09-24
- [Deprecations — OpenAI API](https://developers.openai.com/api/docs/deprecations) — Sora 2 and Videos API retirement, notice 2026-03-24, no one-to-one replacement
- [Sora 2 — OpenAI](https://openai.com/index/sora-2/) — 2025-09-30 launch announcement
- [Creating with Sora safely — OpenAI](https://openai.com/index/creating-with-sora-safely/) — C2PA and watermark policy
- [Gemini API Release Notes — Google AI for Developers](https://ai.google.dev/gemini-api/docs/changelog) — Gemini Omni 1.2 Flash (2026-11-05)
- [Gemini deprecations — Google AI for Developers](https://ai.google.dev/gemini-api/docs/deprecations) — Veo endpoint shutdown dates and replacements
- [Gemini Developer API pricing — Google AI for Developers](https://ai.google.dev/gemini-api/docs/pricing) — Gemini Omni 1.2 Flash per-second prices by resolution
- [Veo — Google DeepMind](https://deepmind.google/models/veo/)
- [Introducing Veo 3.1 and new creative capabilities in the Gemini API — Google Developers Blog](https://developers.googleblog.com/en/introducing-veo-3-1-and-new-creative-capabilities-in-the-gemini-api/)
- [Video generation model Wan3.0 officially launched — Alibaba Cloud](https://www.alibabacloud.com/en/news/product/video-generation-model-wan30-officially-launched-nsb) — 30 seconds, 1080P, reference limits, no API application needed
- [Wan-AI/Wan2.2-T2V-A14B — Hugging Face](https://huggingface.co/Wan-AI/Wan2.2-T2V-A14B) — Apache-2.0 weights
- [MiniMaxAI/MiniMax-H3 — Hugging Face](https://huggingface.co/MiniMaxAI/MiniMax-H3) — model card: architecture, 768p/2K, 4–15 seconds, deployment examples
- [MiniMax H3 Community License — Hugging Face](https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/LICENSE) — excluded territories, $20 million threshold, display obligation
- [VideoRebirthAI/hyperflow-h3-flash — Hugging Face](https://huggingface.co/VideoRebirthAI/hyperflow-h3-flash) — base model listed as MiniMax-H3
- [Introducing Seedance 2.5 — ByteDance Seed](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5) — launched 2026-07-31
- [Kling AI Launches 3.0 Model — Kuaishou IR](https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-launches-30-model-ushering-era-where-everyone-can-be/) — 2026-02-05
- [Kling AI Introduces the World's First Native 4K Video Model — Kling AI](https://kling.ai/blog/kling-ai-introduces-native-4k-video-model) — native 4K on 2026-04-23
- [Kling AI Officially Launches Kling 4.0 — Kuaishou IR](https://ir.kuaishou.com/news-releases/news-release-details/kling-ai-officially-launches-next-generation-kling-40-raising/) — launched 2026-10-15, 30 seconds, API coming
- [Kling AI Annualized Revenue Run Rate Hits USD240 Million — PR Newswire](https://www.prnewswire.com/news-releases/kling-ai-annualized-revenue-run-rate-hits-usd240-million-in-december-2025-302659847.html)
- [Introducing Runway Gen-4.5 — Runway Research](https://runwayml.com/research/introducing-runway-gen-4.5) — 2025-12-01
- [Product Updates & Changelog — Runway](https://runway.com/changelog) — 2026 third-party model integrations, Aleph 2.0, plugins
- [SynthID — Google DeepMind](https://deepmind.google/models/synthid/) — invisible watermarking
- [Luma model information — lumalabs.ai](https://lumalabs.ai/llm-info) — Ray3.2, 1080p limit
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
