---
title: "ByteDance Seed (Doubao): Seed2.1 Pro/Turbo, Seedream 5.5, and Seed Audio 1.0, with closed flagships and open weights limited to research models"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, bytedance, model-family-bytedance-seed, multimodal, image-generation, model-selection]
lang: en
type: deep-dive
tldr: "ByteDance Seed is ByteDance's foundation-model team, and the models behind the Doubao app come from it. The current text flagships are Seed2.1 Pro and Turbo (June 2026); images come from Seedream 5.5 (14th on the Artificial Analysis image leaderboard), video from Seedance 2.5, and audio from Seed Audio 1.0. All flagship models are closed and only available through Volcano Engine, BytePlus, or OpenRouter; the open weights are research models such as Seed-OSS-36B and UI-TARS. Seed2.1's evaluations are almost entirely self-reported, Artificial Analysis has no score for it yet, and international channels only sell Turbo."
description: "An introduction to the ByteDance Seed (Doubao) model family: positioning and official evaluations of Seed2.1 Pro/Turbo/Lite, Seedream 5.5 images, Seedance 2.5 video, Seed Audio 1.0, pricing on Volcano Engine, BytePlus and OpenRouter, adoption numbers for the Seed-OSS and UI-TARS open weights, the 2025→2026 timeline, and agent selection."
series:
  name: "AI Model Families"
  order: 46
draft: false
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-bytedance-seed)

ByteDance Seed is ByteDance's foundation-model team. In Chinese products the name you usually see is "Doubao": the Doubao app, the TRAE coding tool, and the Doubao models on Volcano Engine all run on Seed models. The biggest difference from Qwen or DeepSeek is that the flagship models have no open weights, and a single team ships text, image, video, and audio models.

This post is for agent developers and content-production teams evaluating Chinese models: where Seed2.1 Pro, Turbo, and Lite each fit, what Seedream 5.5 and Seed Audio 1.0 can do in a multimodal pipeline, and which channel to buy from outside China, including which models you cannot get there.

For how to read the benchmark numbers in this post, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

Seed's [models page](https://seed.bytedance.com/en/models) currently lists Seed2.1 for text plus one generation model each for images, video, and audio. The same model has a different name on each channel: `doubao-seed-*` on Volcano Engine (China), `dola-seed-*` on BytePlus (international), and `bytedance-seed/*` on OpenRouter.

| Model / line | Positioning | Key differences | Access |
|---|---|---|---|
| Seed2.1 Pro | Text flagship: long-horizon agents, complex office work, coding | Text, image, and video input; leads the official table on GDPval and video understanding | Closed; Volcano Engine API, Doubao, TRAE; not on the BytePlus price list |
| Seed2.1 Turbo | High-throughput production workhorse | 256K context; four reasoning levels (minimal means no thinking) | Closed; Volcano Engine, BytePlus, OpenRouter |
| Seed2.1 Lite | Low-cost omni-modal understanding | Text, image, video, and audio input; 1M context | Closed; Volcano Engine |
| Seedream 5.5 | Image generation and multi-turn editing | Native RGBA transparent assets, 100 rounds of successive edits | Closed; Jimeng, Doubao, Volcano Engine, BytePlus, OpenRouter |
| Seedance 2.5 | Video generation | 30-second single generations, large reference sets | Closed; Jimeng/Dreamina, Volcano Engine, BytePlus |
| Seed Audio 1.0 | Scene-level audio generation | Speech, sound effects, and ambience from one model | Closed; BytePlus, Volcano Engine, OpenRouter |
| Seed-OSS-36B | Open-weight text model | 36B dense, 512K context, controllable thinking budget | Hugging Face, Apache 2.0 |
| UI-TARS-1.5-7B | GUI agent research model | Reads screenshots and outputs actions | Hugging Face, Apache 2.0; OpenRouter |

Three things to know up front:

- **International channels only have Turbo.** The [BytePlus ModelArk price list](https://docs.byteplus.com/en/docs/modelark/model-pricing) includes `dola-seed-2-1-turbo` but neither Pro nor Lite, and OpenRouter also only has Turbo. To use Pro you need Volcano Engine (a China account) or products such as Doubao and TRAE.
- **Lite is not in the launch post.** The [Seed2.1 launch post](https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity) only introduces Pro and Turbo; [Volcano Ark](https://ark.volcengine.com/region:cn-beijing/model/detail?Id=doubao-seed-2-1-lite) later added Lite (version 260915), described as an omni-modal understanding model with 1M context.
- **There is also a real-time interaction line.** The models page lists SeedRealtime (full-duplex interaction that listens, watches, and speaks at once); this post does not cover it.

## Family evolution

Dates for the text line come from Seed's official [Seed Model Portfolio](https://seed.bytedance.com/en/seed_model_portfolio); image, video, and audio dates come from each launch page.

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| Seed1.5 (Doubao-1.5-pro) | 2025-01-22 | First Seed model in the portfolio, released under the name Doubao-1.5-pro | — |
| Seed1.5-VL | 2025-05-13 | Vision-language model as its own line, with a tech report | — |
| Seed1.6 | 2025-06-25 | 230B-total, 23B-active MoE with 256K context; AdaCoT decides whether to think based on question difficulty | — |
| Seed-OSS-36B | 2025-08-20 | General-purpose text weights under Apache 2.0; no later flagship generation has open weights | — |
| Seed1.8 | 2025-12-17 | Repositioned as a "generalized agentic model", emphasizing GUI operation and search agents; with a model card | — |
| Seed2.0 | 2026-02-14 | Pro/Lite/Mini sizes plus a Code model; Seed says token prices are about an order of magnitude below comparable frontier models. Lite was upgraded to omni-modal understanding at the end of April | — |
| Seed2.1 | 2026-06-23 | Narrowed to Pro and Turbo, focused on agent delivery and coding; Turbo reached OpenRouter in August | — |
| Seed Audio 1.0 | 2026-07-20 | Speech, sound effects, and ambience merged into one model | — |
| Seedance 2.5 | 2026-07-31 | Single video generations extended from 15 to 30 seconds | [Video generation family](/posts/tech/2026-08-26-ai-model-family-video-generation-en) |
| Seedream 5.5 | 2026-11-09 | Adds native transparent backgrounds and 100-round editing at a lower per-image price than 5.0 Pro | — |

This site has no daily model cards for earlier Seed generations, so their scores are not preserved here; readers who need Seed2.0 numbers should read the official [Seed2.0 model card](https://seed.bytedance.com/en/seed2). Two threads run through the timeline: the text line shifted from chasing scores to "can it deliver in real workflows" (the Seed2.1 model card's framing), while the open weights stayed with Seed-OSS and UI-TARS from 2025 and did not follow the flagship line. Prices did not fall every generation: Seed2.1 Pro is ¥6/¥30 on Volcano Engine, above the ¥3.2/¥16 of Seed2.0 Pro's lowest tier, in exchange for no longer charging more for longer inputs.

## Architecture and training trade-offs

### Seed2.1: architecture undisclosed, evaluation method disclosed

The official Seed page that does state a parameter count is [Seed1.6](https://seed.bytedance.com/en/seed1_6): a sparse MoE with 230B total and 23B active parameters, with image-text data mixed in during continued pre-training. Seed has not said whether Seed2.1 keeps that scale.

The [Seed2.1 model card](https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2.1/Seed2_1_Model_Card.pdf) gives no parameter count, no statement on MoE, no training-data volume, and no context design. What it spends pages on is how optimization targets were chosen:

- **Product feedback as the training target.** Internal users, invited external testers, and crowd-testing developers dogfood the models continuously; coding evaluation prioritizes the actual experience inside Claude Code and TRAE rather than standalone coding benchmarks.
- **Evaluation sets grown from failures.** General-agent evaluation sets grow out of bad cases reported by users, plus tasks distilled from interviews with enterprises and domain experts.
- **Models taking part in their own development.** A full section describes Seed models helping with evaluation construction, failure analysis, data cleaning, and data synthesis. Seed itself says this is still at an early stage.

The cost is that readers can hardly judge independently: apart from Workspace Bench, Agent Startup Bench, xDailyBench, CreativeWork, and Trae Agent Bench are all evaluations Seed built itself, so the conclusions lean heavily on ByteDance's own product scenarios.

### Seedream 5.5 and Seed Audio 1.0

The [Seedream 5.5 launch post](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5) does not disclose the architecture; it only says targeted training achieves "pixel-level preservation of unedited regions". This addresses accumulated error in successive editing: when each output becomes the next input, small deviations stack up into image degradation.

[Seed Audio 1.0](https://seed.bytedance.com/en/seedaudio1_0) discloses a two-stage structure: a language model first breaks creative intent into scene-level controls (who speaks, with what emotion, when each element enters), then a diffusion-based acoustic generator produces audio in a latent space. Speech, sound effects, and ambience share one acoustic encoder, so a single generation can align timing and acoustic space instead of generating layers separately and mixing them.

### Seed-OSS-36B: a conventional dense design

The [Seed-OSS-36B model card](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct) describes a 36B dense model (GQA, 64 layers, RoPE, SwiGLU) with native 512K context, trained on only 12T tokens. Its distinctive feature is a controllable thinking budget: `thinking_budget` sets the reasoning length, saving tokens on simple tasks. It also ships a base model trained without synthetic instruction data (`-woSyn`), so researchers can run clean post-training experiments.

## Evaluation and alternatives

### Third party: almost nothing

The [Artificial Analysis ByteDance Seed page](https://artificialanalysis.ai/models/creators/bytedance_seed) lists only Doubao Seed Code and Seed-OSS-36B-Instruct, neither with an Intelligence Index score; Seed2.1 Pro and Turbo are not there. The only outside signal for the text models is one Seed publishes itself: Seed2.1 Preview ranked 8th (1539) on Arena's Code Arena: Frontend.

Images and video do have third-party scores:

- **Seedream 5.5**: 14th on [AA-Image-T2I v2.1](https://artificialanalysis.ai/text-to-image/arena/leaderboard-text), Elo 1135±12 (5,334 votes), with AA listing $20 per 1,000 images. The previous Seedream 5.0 Pro is 23rd (1104) at $90 per 1,000 images. First place, GPT Image 2.6 Sunburst, is at 1263.
- **Seedance 2.5**: in the top tier of the AA text-to-video leaderboard; its rank, per-minute cost, and comparison with Veo, Kling, and Wan are in the [video generation family post](/posts/tech/2026-08-26-ai-model-family-video-generation-en).

### Self-reported: Seed2.1 against the mid-2026 frontier

The table below comes from the [Seed2.1 product page](https://seed.bytedance.com/en/seed2_1) and model card; every number is ByteDance's. The comparison models are Claude Opus 4.7, GPT-5.5, and Gemini 3.1 Pro, the frontier at the June 2026 launch, not today's latest versions:

| Benchmark | Seed2.1 Pro | Seed2.1 Turbo | Claude Opus 4.7 | GPT-5.5 | Gemini 3.1 Pro |
|---|---|---|---|---|---|
| GDPval | 87.9 | 82.7 | 82.7 | 84.9 | 67.3 |
| Workspace Bench | 53.0 | 54.7 | 55.1 | 58.7 | 32.8 |
| Terminal Bench 2.1 | 71.0 | 67.6 | 71.7 | 73.8 | 70.7 |
| NL2Repo-Bench | 47.0 | 43.7 | 58.2 | 45.1 | 33.4 |
| DeepSWE | 32.7 | 23.0 | 54.0 | 70.0 | 10.0 |
| SWE-Atlas | 35.2 | 30.6 | 38.7 | 44.7 | 23.6 |
| MMMU-Pro (with tools) | 82.7 | 82.2 | 74.0 | 81.2 | 80.5 |
| BabyVision | 73.7 | 62.9 | 22.2 | 55.9 | 54.4 |

How to read it:

- **Office and economically valuable tasks are the strength.** GDPval 87.9 is the top score in the table; Turbo's 82.7 ties Claude Opus 4.7. On Workspace Bench, the four models other than Gemini 3.1 Pro are close.
- **Visual understanding has the largest lead.** BabyVision, MMMU-Pro, and video understanding (VideoMME: Pro 89.2, Turbo 89) are all above the comparison models. The model card also reports the top score on the MobileWorld mobile GUI benchmark.
- **Hard program repair lags clearly.** On DeepSWE, Pro scores 32.7 and Turbo 23.0, against 70.0 for GPT-5.5 and 54.0 for Claude Opus 4.7; the model card itself says GPT-5.5 remains clearly ahead on the hardest program-repair tasks. Terminal Bench 2.1, by contrast, is close to the frontier.
- **Turbo is not uniformly weaker than Pro.** Turbo is slightly higher on Workspace Bench and BeyondAIME (88.0 vs 87.0); the gaps show up mainly on DeepSWE, Agent Startup Bench (54.0 vs 68.8), and TOMATO motion perception (56.8 vs 79.5).

The model card also reports a crowdsourced evaluation in which anonymous developers compared outputs and ranked Seed2.1 above Claude Opus 4.6. Seed ran that evaluation and chose the task distribution.

### Seedream 5.5 and Seed Audio 1.0 (self-reported)

- **Seedream 5.5**: experienced evaluators on the MagicArena platform compared six scenarios (e-commerce, marketing, film and TV, gaming, office, fashion design); all six beat Seedream 5.0 Pro, and usability rates in film/TV and office were more than double the previous version. Severe text corruption on dense Chinese and English small text is 0.4%, minor corruption 1.7%. Seed claims leads in text structure and text-to-image realism over GPT Image 2.5 Sunburst and Nano Banana 2.1, yet both rank above Seedream 5.5 on the third-party AA leaderboard.
- **Seed Audio 1.0**: usable-output rate above 90% in most scenarios (film and TV, short drama, animation, podcasts, live commerce, and more), and naturalness MOS above 4.0 for most languages; Vietnamese did not exceed 3.5 on complex instruction following, a weakness Seed flags itself.

### Open weights: Seed-OSS-36B (self-reported)

The [Seed-OSS-36B-Instruct model card](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct) compares against the August 2025 field (Qwen3-30B-A3B-Thinking-2507, gpt-oss-20b, Qwen3-32B): AIME25 84.7, LiveCodeBench v6 67.4, SWE-Bench Verified (OpenHands) 56, TAU1-Retail 70.4. A year later, open-weight models of this size have gone through several generations, so these numbers only show it was competitive at release.

## Licensing, pricing, and deployment

### Flagship models: closed APIs, priced per channel

The flagship models have no weights; terms of use are each platform's service agreement (Volcano Ark pages link the Doubao model service agreement). List prices on the three channels:

| Model | Volcano Engine (CNY per 1M tokens) | BytePlus (USD) | OpenRouter (USD) |
|---|---|---|---|
| Seed2.1 Pro | ¥6 / ¥30, cache hit ¥1.2 | Not listed | Not available |
| Seed2.1 Turbo | ¥3 / ¥15, cache hit ¥0.6 | $0.50 / $2.50, cached $0.10 | $0.50 / $2.50 |
| Seed2.1 Lite | ¥0.8 / ¥2.7 (audio input ¥12) | Not listed | Not available |
| Seed2.0 Lite | Tiered by input length, from ¥0.6 / ¥3.6 | $0.25 / $2.00 | $0.25 / $2.00 |
| Seed2.0 Mini | Tiered by input length, from ¥0.2 / ¥2.0 | $0.10 / $0.40 | $0.10 / $0.40 |

Prices come from [Volcano Ark model pricing](https://ark.volcengine.com/region:cn-beijing/docs/model-pricing) (in Chinese), [BytePlus ModelArk pricing](https://docs.byteplus.com/en/docs/modelark/model-pricing), and [OpenRouter](https://openrouter.ai/bytedance-seed/seed-2-1-turbo). Some details:

- **Off-peak and batch are about half price.** Volcano Engine's low-priority and batch inference are about 50% of the standard price; the BytePlus equivalent is Flex (Turbo $0.25 / $1.25). Cache-hit prices are not discounted.
- **Seed2.1 drops length tiers.** Seed2.0 charges by three input-length tiers (the 128K–256K price is three times the price under 32K); all three Seed2.1 models have a single price, with Turbo capped at 256K and the Pro and Lite pricing range extending to 1,024K.
- **OpenRouter is a pass-through.** Turbo's only provider is Seed itself (FP8), with a realized cache-hit rate of 76%.
- **Generation models bill per image and per second.** Seedream 5.5 costs ¥0.13 per image (up to about 1.5K) or ¥0.23 (up to about 2K); on BytePlus it is $0.020 / $0.035, plus $0.008 per reference image. Seed Audio 1.0 on OpenRouter is $0.15 per minute, up to 120 seconds per request. Seedance 2.5 is billed by resolution and token usage; a 5-second 720p clip is estimated at about ¥7.56 on Volcano Engine.

### Open weights: Apache 2.0, but research lines

The [ByteDance-Seed organization on Hugging Face](https://huggingface.co/ByteDance-Seed) has 63 models, mostly paper companions (image restoration, proteins, theorem proving, interpretability, and so on). Two are worth considering for selection:

- **Seed-OSS-36B**: the [LICENSE](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct/blob/main/LICENSE.txt) is unmodified Apache 2.0, with no revenue or MAU threshold. The model card notes it is primarily optimized for international (i18n) use cases.
- **UI-TARS-1.5-7B**: a GUI agent model that reads screenshots and outputs actions, Apache 2.0, hosted on OpenRouter ($0.10 / $0.20 per 1M tokens, 128K context); it has the most downloads in the organization over the last 30 days.

The Seed-Coder-8B series is MIT-licensed. Some newer Seed research weights (for example November's Cola2 continuous-latent language model) carry no license tag, so check before using them.

### Adoption

Only numbers that can be checked:

- **Hugging Face downloads and derivatives** (downloads are last 30 days / all time; derivatives are repos listing it as base model): UI-TARS-1.5-7B 228,551 / 4,723,023, 28 derivatives; Seed-OSS-36B-Instruct 44,136 / 460,823, 66 derivatives; SeedVR2-3B (video restoration) 41,691 / 288,938, 28 derivatives; BAGEL-7B-MoT 54,566 all time, 92 derivatives.
- **Ollama**: the official library has no ByteDance Seed models; community uploads of Seed-OSS-36B-Instruct have 1,624 downloads and UI-TARS 5,198.
- **OpenRouter usage** (tokens over the last 7 days): Seed 2.1 Turbo 5.12B, Seed-2.0-Lite 4.17B, Seedream 5.0 Flash 3.19B, Seedream 5.5 2.24B. Claude Code is the second-largest public traffic source for Turbo.
- **Cloud listings**: Volcano Engine Ark (the full Seed2.1 line, including Pro and Lite) and BytePlus ModelArk (Seed2.1 Turbo, Seed2.0, Seedream, Seedance, Seed Audio).

## Agent integration and selection

- **Office-document, report, and slide agents** → Seed2.1 Pro (China channels) or Turbo (international). GDPval and Workspace Bench are its strongest categories, and Turbo's office scores are close to Pro's.
- **Agents that read images, video, or charts** → Seed2.1. Visual and video understanding is where it leads the frontier models most; use Lite for audio input or 1M context.
- **Mobile GUI automation** → Seed2.1 (top official MobileWorld score); for a small, self-hostable, fine-tunable model, UI-TARS-1.5-7B.
- **Primary coding agent** → not recommended as first choice. Terminal Bench is near the frontier but DeepSWE lags far behind; use it as a cheap second opinion or for frontend generation, and hand hard repairs to another model.
- **E-commerce and marketing asset pipelines** → Seedream 5.5. Fixed per-image prices make budgeting easy, native RGBA skips background removal, and successive edits keep quality; for top-ranked image quality, GPT Image and Nano Banana still lead.
- **Dubbing, short-form video, game localization** → Seed Audio 1.0. It produces scene audio with ambience in one pass and can set when each line enters.
- **Long-form narrative video** → Seedance 2.5; see the [video generation family post](/posts/tech/2026-08-26-ai-model-family-video-generation-en) for selection details.
- **Must have open weights or on-prem deployment** → Seed-OSS-36B (Apache 2.0, 512K), but it is a 2025 model; for newer Chinese open weights look at [Qwen](/posts/tech/2026-08-24-ai-model-family-qwen-en), [DeepSeek](/posts/tech/2026-08-24-ai-model-family-deepseek-en), or [Tencent Hy](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en).

The smallest selection check: on OpenRouter, Seed2.1 Turbo accepts both OpenAI-compatible and Anthropic Messages requests, so it plugs directly into a host like Claude Code. Run the same set of your own agent tasks with `reasoning_effort` set to `minimal` and to the default `high`, and compare completion rates and output tokens; then add a few tasks that require reading charts or screenshots, which is where it is most likely to beat models at the same price.

## Limitations and trade-offs

- **Evaluations are almost all self-reported.** Seed2.1 has no Artificial Analysis or other independent overall score; more than half of the official table consists of Seed-built evaluations, and the comparison models stop at June 2026 versions.
- **International access is incomplete.** Pro and Lite are only on Volcano Engine; BytePlus and OpenRouter only have Turbo, and OpenRouter has a single provider (Seed) with no fallback.
- **Hard program repair lags.** The DeepSWE gap comes from Seed's own published numbers, not from a third party picking a weak spot.
- **Open weights have not kept up with the flagship line.** Seed-OSS and UI-TARS are both 2025 models and no flagship generation has weights; teams that need on-prem or auditable weights should look elsewhere.
- **Terms of service and data policy need separate review.** The flagship models are only available through ByteDance's clouds, so data location and compliance depend on Volcano Engine (China) or BytePlus (international, with ModelArk in the ap-southeast-1 region) terms.

Seed's strategy is the opposite of Qwen's and DeepSeek's: instead of spreading through open weights, it accumulates usage feedback through its own products (Doubao, Jimeng, TRAE) and then sells the models to enterprises. For outside developers, Seed2.1 Turbo is a mid-priced closed option with unusually strong visual understanding, and Seedream 5.5 and Seed Audio 1.0 are low-cost choices worth adding to comparisons for multimodal content pipelines.

## References

- [Seed2.1 Officially Released: Advancing AI Productivity — ByteDance Seed blog](https://seed.bytedance.com/en/blog/seed2-1-officially-released-advancing-ai-productivity)
- [Seed2.1 正式发布，深入 AI 生产力 — ByteDance Seed blog](https://seed.bytedance.com/zh/blog/seed2-1-officially-released-advancing-ai-productivity) (in Chinese)
- [Seed2.1 product page (evaluation table)](https://seed.bytedance.com/en/seed2_1)
- [Seed2.1 Model Card (PDF)](https://lf3-static.bytednsdoc.com/obj/eden-cn/lapzild-tss/ljhwZthlaukjlkulzlp/seed2.1/Seed2_1_Model_Card.pdf)
- [Seed-2.1-Preview Model Release on Arena — ByteDance Seed](https://seed.bytedance.com/en/blog/seed-2-1-preview-model-release-on-arena)
- [Seed Models — ByteDance Seed](https://seed.bytedance.com/en/models)
- [Seed Model Portfolio — ByteDance Seed](https://seed.bytedance.com/en/seed_model_portfolio)
- [Seed1.6 — ByteDance Seed (MoE scale, AdaCoT)](https://seed.bytedance.com/en/seed1_6)
- [Seed1.8 — ByteDance Seed](https://seed.bytedance.com/en/seed1_8)
- [Seed 2.0 Official Launch — ByteDance Seed](https://seed.bytedance.com/en/blog/seed-2-0-official-launch)
- [Seed2.0 product page and model card](https://seed.bytedance.com/en/seed2)
- [Introducing Seedream 5.5 — ByteDance Seed](https://seed.bytedance.com/en/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5)
- [Seedream 5.5 发布 — ByteDance Seed (availability channels)](https://seed.bytedance.com/zh/blog/more-realistic-images-more-stable-editing-across-100-rounds-introducing-seedream-5-5/) (in Chinese)
- [Introducing Seed Audio 1.0 — ByteDance Seed](https://seed.bytedance.com/en/blog/from-speech-to-audio-creation-introducing-the-seed-audio-1-0-audio-creation-model)
- [Seed Audio 1.0 product page](https://seed.bytedance.com/en/seedaudio1_0)
- [Introducing Seedance 2.5 — ByteDance Seed](https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5)
- [Volcano Ark model pricing](https://ark.volcengine.com/region:cn-beijing/docs/model-pricing) (in Chinese)
- [Doubao-Seed-2.1-turbo — Volcano Ark model details](https://ark.volcengine.com/region:cn-beijing/model/detail?Id=doubao-seed-2-1-turbo) (in Chinese)
- [Doubao-Seed-2.1-lite — Volcano Ark model details](https://ark.volcengine.com/region:cn-beijing/model/detail?Id=doubao-seed-2-1-lite) (in Chinese)
- [BytePlus ModelArk Pricing](https://docs.byteplus.com/en/docs/modelark/model-pricing)
- [ByteDance Seed: Seed 2.1 Turbo — OpenRouter](https://openrouter.ai/bytedance-seed/seed-2-1-turbo)
- [ByteDance Seed models and usage — OpenRouter](https://openrouter.ai/bytedance-seed)
- [ByteDance Seed Models — Artificial Analysis](https://artificialanalysis.ai/models/creators/bytedance_seed)
- [AA-Image-T2I v2.1 Leaderboard — Artificial Analysis](https://artificialanalysis.ai/text-to-image/arena/leaderboard-text)
- [ByteDance-Seed — Hugging Face organization](https://huggingface.co/ByteDance-Seed)
- [ByteDance-Seed/Seed-OSS-36B-Instruct — Hugging Face model card](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct)
- [Seed-OSS-36B LICENSE (Apache 2.0)](https://huggingface.co/ByteDance-Seed/Seed-OSS-36B-Instruct/blob/main/LICENSE.txt)
- [ByteDance-Seed/UI-TARS-1.5-7B — Hugging Face](https://huggingface.co/ByteDance-Seed/UI-TARS-1.5-7B)
- [milkey/Seed-OSS-36B-Instruct — Ollama (community upload)](https://ollama.com/milkey/Seed-OSS-36B-Instruct)
- [Video generation model families](/posts/tech/2026-08-26-ai-model-family-video-generation-en) — this site, Seedance 2.5 comparison and pricing
- [Region Focus: China — Doubao Work and the office-agent race](/posts/daily/2026-08-28-region-china-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
