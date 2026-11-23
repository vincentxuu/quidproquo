---
title: "Ling — Ling 3.1 at 560B/25B Becomes the Workhorse, Ring Folds into Hybrid Reasoning, and Medical and Speech Lines Branch Out"
date: 2026-09-19
category: tech
type: deep-dive
tags: [ai-agent, llm, ant-group, model-family-ling, moe, open-source, agent, finance, healthcare]
lang: en
description: "Ant Group's Ling (Ant Ling / inclusionAI) model family: Ling-3.1-flash (560B total / 25B active, 1M context, MIT) and the natively multimodal Ling-3.2-flash are now the main models, the Ring reasoning line has been retired from the API in favor of hybrid-reasoning Ling, plus the LingSante medical line, Ming-3.0 speech models, licensing, pricing, retirement dates, and agent selection"
tldr: "Ling's main model today is Ling-3.1-flash: 560B total parameters, 25B active per token, 1M context, switchable thinking, MIT weights on Hugging Face. Ling-3.2-flash, launched 2026-11-05, has the same size and natively takes images and video, but is API-only for now (OpenRouter has a free endpoint); Ant says weights are coming soon. The Ring reasoning models left the official API on 2026-11-15, and Ant recommends Ling-3.1-flash instead. For cheap, high-volume work the 124B/5.1B Ling-3.0-flash still applies; medical work has LingSante-3.1, speech has Ming-3.0."
series:
  name: "AI Model Families"
  order: 20
glossary:
  - term: "Ling"
    def: "Ant Group's independently developed, open-sourced LLM family, mostly MoE; the official API currently serves the Ling 3.x series, alongside the Ming omni-modal/speech line and the LingSante medical line"
  - term: "Ring"
    def: "Ling's former reasoning line (Ring-1T through Ring-2.6-1T); all Ring models left the official API on 2026-11-15, with Ling-3.1-flash (switchable thinking) as the recommended replacement; weights remain on Hugging Face"
  - term: "Ming"
    def: "Ling's omni-modal and speech line: Ming-flash-omni-2.0 is the omni-modal flagship, and Ming-3.0 added speech understanding, speech synthesis, and speech recognition models in September–October 2026"
  - term: "KDA"
    def: "Kimi Delta Attention, a linear-attention variant with fine-grained diagonal gating in Delta Rule state updates; Ling 3.x stacks mostly KDA layers with a few Gated MLA global-attention layers"
---

> :globe: [中文版](/posts/tech/2026-09-19-ai-model-family-ling)

Ling (Ant Ling; the Hugging Face organization is inclusionAI) is Ant Group's open-source model family. It changed generations in autumn 2026: the main model moved from the 124B Ling-3.0-flash to Ling-3.1-flash, with 560B total parameters and 25B active per token, and thinking can be switched on or off, so the separate Ring reasoning line has left the official API. This post is for people choosing an open-weight model for agent workflows: by the end you can decide between 3.1 and 3.0, whether to wait for 3.2 weights, and whether the medical and speech branches fit your work.

This is the twentieth family deep-dive in the "AI Model Families" series. For how to interpret the benchmark numbers cited here, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This post is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family positioning and model matrix

Based on Ant Ling's official selection table, retirement page, and Hugging Face model cards:

| Model / product line | Positioning | Key difference | Access |
|---|---|---|---|
| Ling-3.1-flash (incl. the `-1019` post-training update) | Workhorse: long-horizon agents, office work, software development | 560B total / 25B active, 1M context, switchable thinking | MIT weights (HF, ModelScope); official API `Ling-3.1-flash`; OpenRouter `inclusionai/ling-3.1-flash` |
| Ling-3.2-flash | Native multimodal: visual understanding, multimodal long-horizon agents, 3D, medical imaging | Also 560B / 25B, 1M; natively takes image, text, and video | API only: official `Ling-3.2-flash`, OpenRouter `inclusionai/ling-3.2-flash:free`; weights not yet public |
| Ling-3.0-flash | Low-cost, high-volume, low-latency | 124B / 5.1B active, 256K | MIT weights; official API; OpenRouter paid endpoints |
| Ling-3.0-flash-VL | Low-cost vision-language | 124B / 5.5B, image + video input, 256K | MIT weights; official API; OpenRouter paid endpoint |
| Ling-3.0-tiny | On-device, local offline | 7.9B / 1.3B | MIT weights; official API; OpenRouter paid endpoint |
| LingSante-3.1-flash / -3.1-air-VL | Medical research and evaluation | The former is built on Ling-3.1-flash (560B / 25B, 1M), the latter on Ling-3.0-flash-VL (124B / 5.5B, text + image) | MIT weights; the flash version also has a Computrix API |
| Ming-3.0 speech models | Speech understanding, synthesis, recognition | audio-flash 126B / 6.5B, audio-tiny 9.3B / 2.7B, tts-0.5B, tts-tiny, asr-tiny | MIT weights; asr-tiny, tts-0.5B, and audio-flash have an official API |

### From three lines to one hybrid-reasoning line

From 2025 to mid-2026, Ling split work across three lines: Ling did non-thinking execution, Ring was the trillion-parameter reasoning model for planning and deep reasoning, and Ming covered omni-modal tasks. From Ling 3.0, thinking became a switch on the same model (the official docs say Ling-3.0-flash can switch between thinking and non-thinking modes), and Ling 3.1 finished the move: the official retirement page points Ling-1T, Ring-1T, Ling/Ring-2.5-1T, Ling/Ring-2.6-1T, and Ling-2.6-flash all to Ling-3.1-flash as the replacement.

That makes selection simpler: start with Ling-3.1-flash for general text tasks; drop to Ling-3.0-flash for cost or latency; for images and video use Ling-3.2-flash (API) or Ling-3.0-flash-VL (self-hostable). Ring weights are still on Hugging Face, but Ant no longer runs them as a service.

### Vertical branches: finance, medical, speech

Another Ling trait is turning the same base into domain versions:

- **Finance**: Ling-3.0-flash-Fin (2026-09-09, 124B / 5.1B, MIT); details in the [model card](/posts/daily/2026-09-19-model-ant-group-ling-3-0-flash-fin-en). The official API's list of available models does not include it, and its OpenRouter endpoint is gone, so using it means downloading the weights and self-hosting
- **Medical**: after Ling-3.0-flash-Sante (2026-10-19, 124B / 5.1B), Ant released LingSante-3.1-flash (moved to the 3.1 base) and LingSante-3.1-air-VL (multimodal; its model card calls it the first open-source multimodal medical model from Ant's healthcare team) on 2026-11-19. Both model cards state these are research models, not medical devices
- **Speech**: Ming-3.0 splits into understanding (audio-flash, audio-tiny), synthesis (tts-0.5B, tts-tiny), and recognition (asr-tiny); the small tts-tiny and asr-tiny use the Ling 3.0 tiny backbone

## Family evolution

| Date | Version | Key facts | What it changed for selection |
|---|---|---|---|
| 2025-03 | Ling 1.0 | MoE LLM validated on non-A100/H100 heterogeneous compute | Self-hosting on domestic Chinese compute became a selling point |
| 2025-10-09 | Ling-1T, Ring-1T | Trillion-parameter non-thinking and thinking models open-sourced together | The "Ling executes, Ring plans" pairing took shape; official API retired 2026-06-15 |
| 2025-10 | Ling 2.0 series | End-to-end FP8 training, 1M context | Trillion-scale open models became usable for long documents |
| 2026-02 | Ling-2.5-1T, Ring-2.5-1T, Ming-flash-omni-2.0 | Ling 2.5 moved to hybrid linear attention; Ant said Ring 2.5 reached gold-medal level on IMO 2025 and CMO 2025; Ming 2.0 unified speech, music, and audio | Long-horizon reasoning throughput got cheaper; API retired 2026-09-30 |
| 2026-04 to 05 | Ling-2.6-1T, Ling-2.6-flash, Ring-2.6-1T | 2.6-flash is 104B / 7.4B; the Ring-2.6-1T API offered high / xhigh reasoning effort | Last generation of trillion-scale flagship and reasoning models; API retired 2026-11-15 |
| 2026-07-23 | Ling-3.0-flash | 124B / 5.1B, native hybrid linear architecture (KDA:MLA 5:1), switchable thinking | A hundred-billion-class model approached the previous trillion-scale flagship and fit on a single node |
| 2026-08 to 09 | Ling-3.0-tiny, Ling-3.0-flash-VL, Ling-3.0-flash-Fin | 7.9B / 1.3B on-device; 124B / 5.5B vision-language; finance-enhanced | One base began branching into on-device, vision, and vertical versions (Fin: [model card](/posts/daily/2026-09-19-model-ant-group-ling-3-0-flash-fin-en)) |
| 2026-09 to 10 | Ming-3.0 speech models | audio-flash / tiny (09-03), tts-0.5B / tiny (09-22), asr-tiny (10-14); official API from 10-19 | Speech recognition, synthesis, and understanding got self-hostable dedicated small models |
| 2026-09-30 | Ling-3.1-flash (API launch) | 560B / 25B; served at 256K during the free trial | The main size jumped from the hundred-billion class to the five-hundred-billion class |
| 2026-10-15 | Ling-3.1-flash open-sourced | MIT weights; HF repo created 10-13, plus a base model (10-25) | The current selection baseline; see sections below |
| 2026-10-27 | Ling-3.1-flash-1019 | Post-training update on the same architecture; Ant cites AA Intelligence Index v4.3.2 rising from 41 to 44 | Self-hosters should use this version directly |
| 2026-11-05 | Ling-3.2-flash | 560B / 25B, 1M, native multimodal; free for its first two weeks | Multimodal no longer requires dropping to the 124B VL model, but it is API-only for now |
| 2026-11-19 | LingSante-3.1-flash, LingSante-3.1-air-VL | Medical line moved to the 3.1 base and added a multimodal medical model | Medical research can evaluate directly with MIT weights |

The through-line: **prove the ceiling with trillion parameters, compress comparable capability into the hundred-billion class with a hybrid linear architecture (3.0), then in 3.1 scale back up to the five-hundred-billion class and merge thinking and non-thinking into one model**. Ring's exit follows from that path; Ant has not dropped reasoning.

## Architecture and training trade-offs

### Ling 3.1: a higher share of linear attention

The [Ling-3.1-flash model card](https://huggingface.co/inclusionAI/Ling-3.1-flash) gives the structure: of 72 layers, 63 are KDA (Kimi Delta Attention, linear time complexity) and 9 are Gated MLA, a 7:1 ratio; the first 4 layers are dense; the MoE part routes each token to 8 of 512 experts plus 1 shared expert; hidden size 4096, vocabulary 157,184.

Compared with Ling 3.0 (42 layers, KDA:MLA 5:1, hidden 2560), two things changed:

- **More linear attention**: only 1 in every 8 layers keeps global attention. Ant's blog says KDA handles long-sequence scaling while Gated MLA keeps a global path, so 1M context does not require every layer to pay quadratic cost. The trade-off is that global retrieval is concentrated in a few layers; precise look-ups in long documents still need validation on your own data
- **Same expert sparsity, larger size**: the activation ratio stays at 8/512 (1/64), but each expert is wider and there are more layers, taking total parameters from 124B to 560B and active from 5.1B to 25B. Per-token compute is about five times 3.0's, in exchange for steadier long-horizon task execution

### Switchable thinking instead of two models

Ling 3.1 is a "hybrid reasoning" model: thinking is enabled at inference with `chat_template_kwargs: {"enable_thinking": true}`. The model card recommends leaving it on for agent tasks, with sampling `temperature=1.0`, `top_p=0.95`, `top_k=20`. Ant's blog also acknowledges that while RL raised task success rates, chains of thought and interaction rounds got longer, which raises latency and token cost.

### Deployment trade-off: BF16 needs 8 H200s

The official BF16 weights are about 574GB. The model card's SGLang example uses 8×H200 (TP8 + EP8) or 4×GB300; the open-source blog says that with MXFP4 for routed experts and block-FP8 for dense layers, weights shrink from about 534GB to 292GB, and Hopper deployment drops from 8 GPUs to 4. On Hugging Face, inclusionAI currently publishes an MXFP4 repo only for the medical model (`LingSante-3.1-flash-MXFP4`); quantized files for the general model come mainly from the community (GGUF, EXL3, MLX, and others).

### Ling-3.2-flash: architecture not disclosed

Ant has disclosed only 560B total parameters, 25B active, 1M context, and that vision and language are "natively fused at the architectural level, without relying on external vision modules." Layer counts, the vision encoder, and training data are not public, and neither are the weights, so this post does not speculate about how it relates to 3.1.

## Evaluation and alternatives

All numbers below come from official model cards, blogs, or Ant's own account announcements; scores measured under different conditions are not mixed in one table.

### Ling-3.1-flash (officially cited and self-reported)

| Metric | Value | Source and conditions |
|---|---|---|
| Artificial Analysis Intelligence Index v4.3.2 | 41 (original) → 44 (`-1019`) | Cited in the `-1019` model card |
| Artificial Analysis Intelligence Index v5 | 30 (`-1019`) | Same; v4 and v5 use different scales and cannot be subtracted |
| AA-Briefcase | 1397 → 1524 | Same |
| AutomationBench-AA | 62% → 68% | Same |
| CritPt / SciCode | 18%→26% / 54%→57% | Same |
| Output speed | ~210 tokens/s | Open-source blog, citing Artificial Analysis |

Ant's blog also published three long-running cases, compared against Claude Fable 5 and GLM-5.3-Flash: a Lua-to-x86-64 compiler written from scratch passed 178 of 182 tests after about 17 hours (97.8%; Fable 5 99.0%, GLM-5.3-Flash 95.9%); rewriting a C image library in Rust reached an 8.015× speedup, above GLM-5.3-Flash's 1.396× and far below Fable 5's 27.31×. These are tasks Ant chose itself: they show the model can run for over ten hours without falling apart, but they are not public benchmarks.

### Ling-3.2-flash (official account announcement)

Ant Ling's launch post lists three comparisons against Claude Opus 5 (max): OmniDocBench 1.5 92.21 vs 90.56, ZEROBench (Sub) 43.71 vs 39.52, Vision2Web 85.86 vs 80.20. All three are document-understanding and vision tasks chosen by the vendor, with no third-party re-run.

### LingSante-3.1

The model card says it leads open-source models on complex medical reasoning, but results are shown only as images with no reproducible number table. Artificial Analysis lists LingSante-3.1-flash, but with no public API it has no Intelligence Index score yet. The model card also states that benchmark and simulated-environment results do not establish clinical effectiveness.

### Position against alternatives

- **Against Chinese open models (GLM-5.3, DeepSeek V4.x, Kimi, etc.)**: Ling-3.1-flash's selling points are price and the MIT license; Ant's long-horizon cases trade wins with GLM-5.3-Flash, and this post has no composite-index numbers measured under the same conditions to put side by side
- **Against closed frontier models**: Ant's own long-horizon cases still show a gap to Claude Fable 5, largest on extreme performance optimization
- **3.1 vs 3.0**: 3.1 is more capable but activates about five times as many parameters per token; Ant's selection table still positions 3.0-flash as the high-TPS, low-cost model for high-volume tasks

## Licensing, pricing, and deployment

### Licensing

The Ling-3.0/3.1 series, LingSante, and the Ming-3.0 speech models all list MIT in their Hugging Face license field (the Ling-3.1-flash repo has no separate LICENSE file; the metadata is the reference). Ling-3.2-flash has no weights yet and can only be used under each API platform's terms of service. The medical model cards add usage limits: no independent diagnosis, prescribing, or triage decisions, and processing patient records must comply with local privacy and healthcare regulations.

### API pricing (per 1M tokens)

Official pricing page (Ant Ling, RMB):

| Model | Input | Output | Cache read | Current promotion |
|---|---|---|---|---|
| Ling-3.2-flash | ¥2.00 | ¥6.00 | ¥0.40 | The two-week free launch period has ended |
| Ling-3.1-flash | ¥2.00 | ¥6.00 | ¥0.40 | 75% off: ¥0.50 / ¥1.50 / ¥0.10 |
| Ling-3.0-flash, Ling-3.0-flash-VL | ¥0.50 | ¥1.50 | ¥0.10 | 72% off: ¥0.14 / ¥0.42 / ¥0.028 |

OpenRouter (USD, models API on 2026-11-23):

| Model ID | Endpoint | Input | Output | Context |
|---|---|---|---|---|
| `inclusionai/ling-3.2-flash:free` | Ant Digital | $0 | $0 | 1M |
| `inclusionai/ling-3.1-flash` | Novita | $0.06 | $0.18 | 1M |
| `inclusionai/ling-3.0-flash` | Novita / DeepInfra | $0.021 / $0.06 | $0.063 / $0.18 | 262K / 131K |
| `inclusionai/ling-3.0-flash-vl` | DeepInfra | $0.06 | $0.18 | 131K |
| `inclusionai/ling-3.0-tiny` | Ant Digital | $0.015 | $0.045 | 262K |

Ant's pricing page lists OpenRouter prices of $0.30 / $0.90 list and $0.075 / $0.225 promotional for 3.1-flash, and $0.30 / $0.90 for 3.2-flash, which do not fully match what the OpenRouter API currently shows; go by the OpenRouter page. The old `ling-3.0-flash:free` and `ling-3.0-flash-fin` no longer have endpoints on OpenRouter; the free 3.2 endpoint on OpenRouter lists only text and image input, so video input requires the official API.

### Retired models

Ant Ling retirement page (after the date, API calls to that model ID return an error):

| Model | Retirement date (UTC+8) | Official replacement |
|---|---|---|
| Ling-2.6-1T, Ring-2.6-1T, Ling-2.6-flash | 2026-11-15 | Ling-3.1-flash |
| Ling-2.5-1T, Ring-2.5-1T | 2026-09-30 | Ling-3.1-flash |
| Ling-1T, Ring-1T | 2026-06-15 | Ling-3.1-flash |

Retirement affects only the official API; weights on Hugging Face remain downloadable.

### Deployment

For self-hosting, Ant recommends SGLang (an official day-0 image with MTP speculative decoding) or vLLM (`--tool-call-parser ling3 --reasoning-parser ling3`). The official API is compatible with both the OpenAI and Anthropic protocols, and the docs include setup guides for Claude Code, Kilo Code, OpenClaw, and Hermes Agent. Ling-3.0-flash has Huawei Ascend support; the sources cited here do not mention domestic-compute support for 3.1.

## Agent integration and selection

- **Long-horizon coding agents, office automation, search agents** → Ling-3.1-flash (use `-1019` if self-hosting), with thinking on; first confirm your GPU budget covers 8×H200 or 4 GPUs after quantization
- **High-volume, low-latency, large batch jobs** → Ling-3.0-flash: official API list price is about a quarter of 3.1's, and latency drops further with thinking off
- **Agents that need to see images and video (GUI automation, document understanding, screenshot-to-web)** → Ling-3.2-flash if API-only is fine; to self-host, use Ling-3.0-flash-VL until 3.2 weights arrive
- **On-device, offline, privacy-sensitive** → Ling-3.0-tiny (7.9B / 1.3B)
- **Medical research, medical agent evaluation** → LingSante-3.1-flash (text) or LingSante-3.1-air-VL (imaging reports, skin, meals, GUI appointment flows), always with human review
- **Financial research** → self-host Ling-3.0-flash-Fin weights, or use Ling-3.1-flash directly (Ant says 3.1 also improved in finance); compare both on your own questions
- **Speech** → Ming-3.0-asr-tiny (Chinese, English, and dialect recognition, with hotword support), Ming-3.0-tts-0.5B (7 languages plus Sichuanese and Cantonese, zero-shot voice cloning), Ming-3.0-audio-flash (audio understanding and reasoning)
- **Still calling Ring or Ling 2.x APIs** → they are retired; switch to `Ling-3.1-flash` with thinking on and rerun your evaluations; there is no equivalent of Ring's xhigh reasoning effort

Minimum selection check: run 20–50 of your own agent tasks on Ling-3.1-flash with thinking on and off and on Ling-3.0-flash, recording success rate, average output tokens, tool-call rounds, and cost per task. 3.1's advantage is in long-horizon work, so the task set needs multi-round tool calls or the difference won't show.

## Limitations and trade-offs

- **3.2 can't be self-hosted yet**: Ling-3.2-flash is API-only, with neither architecture details nor weights public; Ant says only that weights are "coming soon"
- **Evaluations are almost all self-reported**: AA scores are cited in model cards, the long-horizon cases and 3.2's wins are vendor-chosen, and the medical models' numbers exist only as images
- **3.1's hardware bar is high**: BF16 needs 8 H200-class GPUs, and 4 even after quantization; it is not a single-machine workload
- **Longer thinking**: Ant acknowledges chains of thought and interaction rounds grew after RL; estimate cost and latency on your own workload
- **Inconsistent price listings**: Ant's docs and the OpenRouter API list different prices for the same model, and prices return to list after promotions end
- **The medical models are not medical devices**: both LingSante model cards forbid independent diagnosis, prescribing, and triage
- **Ring's place**: the reasoning line no longer has an official service; teams that need a trillion-scale reasoning model can only self-host the old weights

## Update history

- 2026-11-23: Moved to the Ling 3.1 generation. Rewrote the matrix, architecture, evaluation, pricing, and selection around Ling-3.1-flash (API 2026-09-30, open-sourced 10-15, `-1019` update 10-27) and Ling-3.2-flash (11-05, API-only); added the LingSante-3.1 medical line, Ming-3.0 speech line, and the official retirement table (all Ring models and Ling 2.x have left the official API). The Ling 3.0 generation is now history and the low-cost option; the former 3.0 variant tables and Fin details moved out of the body, with Fin covered by the daily model card linked in the timeline. Corrections: removed the defunct OpenRouter `ling-3.0-flash:free`, `:fin:free`, and `:vl:free` endpoints; replaced "three parallel lines, Ring does planning" with the current state; replaced "almost all models are Apache 2.0 or MIT" with per-model licensing; the glossary entry for Ring previously said Ring-2.6-1T won IMO gold, while the body's source refers to Ring 2.5, and has been rewritten.
- 2026-10-11: Reorganized format, model matrix, and selection sections, keeping existing sources and dates; no fresh fact-check was done.

## References

- [Ant Ling docs: Ling models and selection table](https://developer.ant-ling.com/en/docs/models/ling/) — 3.2 / 3.1 / 3.0 specs, evolution table
- [Ant Ling docs: Pricing](https://developer.ant-ling.com/zh-CN/docs/models/price/) — official, OpenRouter, and ZenMux prices
- [Ant Ling docs: Deprecation](https://developer.ant-ling.com/zh-CN/docs/models/deprecation/) — Ring and Ling 2.x retirement dates and replacements
- [Ant Ling docs: Changelog](https://developer.ant-ling.com/zh-CN/docs/getting-started/changelog/) — Ling-3.2-flash and Ming-3.0 API launch dates
- [Ant Ling blog: Ling-3.1-flash, a model upgrade for real-world tasks (2026-09-30)](https://developer.ant-ling.com/zh-CN/blogs/ling-3.1-flash)
- [Ant Ling blog: Ling-3.1-flash officially open-sourced (2026-10-15)](https://developer.ant-ling.com/zh-CN/blogs/ling-3.1-flash-open-source)
- [Ant Ling: Introducing Ling-3.2-flash (LinkedIn, 2026-11-06)](https://www.linkedin.com/posts/ant-ling_antling-multimodalai-opensourceai-activity-7524272962829471744-O2DN)
- [Hugging Face: inclusionAI/Ling-3.1-flash](https://huggingface.co/inclusionAI/Ling-3.1-flash)
- [Hugging Face: inclusionAI/Ling-3.1-flash-1019](https://huggingface.co/inclusionAI/Ling-3.1-flash-1019)
- [Hugging Face: inclusionAI/LingSante-3.1-flash](https://huggingface.co/inclusionAI/LingSante-3.1-flash)
- [Hugging Face: inclusionAI/LingSante-3.1-air-VL](https://huggingface.co/inclusionAI/LingSante-3.1-air-VL)
- [Hugging Face: inclusionAI/Ming-3.0-audio-flash](https://huggingface.co/inclusionAI/Ming-3.0-audio-flash)
- [Hugging Face: inclusionAI/Ming-3.0-tts-0.5B](https://huggingface.co/inclusionAI/Ming-3.0-tts-0.5B)
- [Hugging Face: inclusionAI/Ming-3.0-asr-tiny](https://huggingface.co/inclusionAI/Ming-3.0-asr-tiny)
- [Hugging Face: inclusionAI/Ling-3.0-flash](https://huggingface.co/inclusionAI/Ling-3.0-flash)
- [OpenRouter: inclusionai models](https://openrouter.ai/inclusionai)
- [Artificial Analysis: LingSante-3.1-flash](https://artificialanalysis.ai/models/lingsante-3-1-flash-1119)
- [Ant Group: Ant Group Unveils Ling AI Model Family and Launches Ling-1T (2025-10-09)](https://www.antgroup.com/en/news-media/press-releases/1759982400000)
- [Ant Group: Ant Group Releases Ling-2.5-1T and Ring-2.5-1T (2026-02-16)](https://secure.businesswire.com/news/home/20260215551663/en/Ant-Group-Releases-Ling-2.5-1T-and-Ring-2.5-1T-Evolving-Its-Open-Source-AI-Model-Family)
- [Ant Group: Ant Group Unveils Ling-3.0-Flash (BusinessWire, 2026-07-27)](https://www.businesswire.com/news/home/20260726584441/en/)
- [Ant Group: Open-Sources Ling-3.0-flash-Fin for Real-World Financial Workflows (2026-09-09)](https://www.antgroup.com/en/news-media/press-releases/1788944400000)
- [Ant Ling docs: Ling-3.0-flash release](https://developer.ant-ling.com/zh-CN/blogs/ling-3.0-flash-release)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site
