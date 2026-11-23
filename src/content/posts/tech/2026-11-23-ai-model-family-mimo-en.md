---
title: "Xiaomi MiMo: V2.6 Pro and Flash Are Cheap, MIT-Licensed Omnimodal Open Weights, but Slow"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, xiaomi, open-source, model-family-mimo, moe, model-selection]
lang: en
type: deep-dive
tldr: "Xiaomi MiMo's current lineup is MiMo-V2.6-Pro (1.02T total, 42B active) and MiMo-V2.6-Flash (309B, 15B active). Both have 1M context, read text, images, video and audio, and ship weights tagged MIT. The official API charges only $0.435/$0.87 and $0.14/$0.28 per 1M tokens, and Flash is #10 on OpenRouter's weekly chart. The cost is speed and verbosity: Artificial Analysis's current index scores Pro at 30 with an average of 43.7 minutes per task, and long terminal and security tasks still trail the closed frontier clearly."
description: "Xiaomi MiMo model family: specs for MiMo-V2.6-Pro, Flash, Pro-UltraSpeed and Distill-Qwen-9B, the hybrid SWA architecture and single mixed RL run, vendor and third-party evaluations, the MIT license and use restrictions, official API and OpenRouter pricing, the V2.5 retirement, HF and Ollama adoption numbers, the 2025–2026 timeline, and agent selection."
series:
  name: "AI Model Families"
  order: 40
draft: false
glossary:
  - term: "SWA (Sliding Window Attention)"
    aliases: ["SWA"]
    definition: "Attention in which each token only sees a fixed-length window of preceding tokens (128 in MiMo-V2.6); MiMo interleaves many SWA layers with a few global-attention layers to keep the long-context KV cache small"
  - term: "MOPD (Multi-Teacher On-Policy Distillation)"
    aliases: ["MOPD2"]
    definition: "Xiaomi's multi-teacher on-policy distillation: the student generates its own outputs, domain teacher models score them token by token, and the student is updated; V2.6's MOPD2 adds single-turn generations conditioned on prefixes taken from teacher trajectories or SFT demonstrations"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-mimo)

MiMo is Xiaomi's in-house large language model family; its Hugging Face organization is [XiaomiMiMo](https://huggingface.co/XiaomiMiMo). This post is for agent developers evaluating Chinese open-weight models: what MiMo-V2.6-Pro and Flash are each good for, where they stand next to DeepSeek, Kimi and Tencent Hy, and what speed and stability you pay for the low price.

As of November 2026, the V2.6 series was open-sourced and launched on the API on September 21–22, and MOPD checkpoints that fix a repeated-tool-call problem followed on September 27. The official API for the previous V2.5 generation was retired on October 21. V2.6-Flash is #10 on [OpenRouter's weekly chart](https://openrouter.ai/rankings), processing 3.7T tokens in the week to November 22, up 381% on the week before.

For how to read the benchmark numbers in this post, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

Prices below are [Xiaomi's official API list prices](https://mimo.xiaomi.com/mimo-v2-6), per 1M tokens, input/output:

| Model / line | Role | Key difference | Access and price |
|---|---|---|---|
| MiMo-V2.6-Pro (API `mimo-v2.6-pro`; weights `MiMo-V2.6-Pro-RL` / `-MOPD`) | Current flagship | 1.02T total, 42B active; 1M context; text, image, video and audio input | Open weights (MIT) + API: $0.435/$0.87, cache hit $0.0036 |
| MiMo-V2.6-Flash (API `mimo-v2.6-flash`; weights `MiMo-V2.6-Flash-RL` / `-MOPD`) | High volume, low cost | 309B total, 15B active; 1M context; same modalities as Pro | Open weights (MIT) + API: $0.14/$0.28, cache hit $0.0028 |
| MiMo-V2.6-Pro-UltraSpeed (`mimo-v2.6-pro-ultraspeed`) | Low latency | A high-speed serving mode of the same Pro checkpoint; Xiaomi claims up to 20x faster output | API only: $4.35/$8.70, cache hit $0.036 |
| MiMo-V2.6-Distill-Qwen-9B | Small model for local use and research | [Qwen3.5-9B](https://huggingface.co/Qwen/Qwen3.5-9B) fine-tuned on MiMo-generated data; text and images | Open weights (tagged MIT); Ollama `mimo-v2.6` |

Three things to know first:

- **The weights come in RL and MOPD versions.** The `-RL` checkpoints released on September 21 are the output of large-scale reinforcement learning; the `-MOPD` checkpoints from September 27 add a multi-teacher distillation pass, mainly to fix the model repeatedly issuing the same tool call. Xiaomi does not say which checkpoint the API currently serves.
- **API limits.** The [official models page](https://mimo.mi.com/docs/en-US/quick-start/model) lists a 128K maximum output for Pro and Flash, 100 RPM and 10M TPM per account per model. In thinking mode, `temperature` and `top_p` are fixed at 1.0 and 0.95 and cannot be changed.
- **Xiaomi's speech models are a separate line.** The same platform offers MiMo-V2.5-ASR and MiMo-V2.5-TTS (with voice cloning and voice design), which this post does not cover; for speech, see the [speech and audio model families](/posts/tech/2026-08-26-ai-model-family-speech-audio-en) post.

### Adoption

The numbers we could find, all read on 2026-11-23:

| Channel | Numbers |
|---|---|
| OpenRouter weekly chart | V2.6-Flash #10, 3.7T tokens/week (+381%) |
| Hugging Face downloads (last 30 days / all time) | Flash-RL 43,138 / 155,568; Pro-RL 31,483 / 137,950; Distill-9B 38,921 / 68,938; Flash-MOPD 25,500 / 38,177; Pro-MOPD 21,593 / 31,388 |
| Hugging Face derivatives (`base_model` filter) | Distill-9B 126, Flash-RL 46, Flash-MOPD 33, Pro-RL 13, Pro-MOPD 13 |
| Ollama | `mimo-v2.6` (Distill-9B, local) 141.1K downloads; `mimo-v2.6-flash:cloud` 10.6K; `mimo-v2.6-pro:cloud` 9,801 |
| Cloud and routing platforms | OpenRouter (Xiaomi, DeepInfra, StreamLake, Cohere, Tenstorrent and others), [Vercel AI Gateway](https://vercel.com/changelog/mimo-v2-6-models-now-available-on-ai-gateway), [Cloudflare](https://developers.cloudflare.com/ai/models/xiaomi/mimo-v2.6-pro/) (via PrimaLabs), [Fireworks](https://fireworks.ai/models/fireworks/mimo-v2p6-pro-rl) (dedicated GPUs, no serverless), Ollama Cloud |

Two readings. First, API usage is concentrated in Flash; Pro is not in OpenRouter's weekly top ten. Second, Flash leads Hugging Face downloads, but on Ollama the Distill-9B, which runs on a single consumer GPU, is far ahead (141K downloads against roughly 10K for each large model's cloud tag), and it also has the most Hugging Face derivatives. Cumulative downloads of the large V2.6 weights are still far below the 1.66 million of the previous V2.5, though V2.5 has been up for seven months and V2.6 for only two. The AWS Bedrock, Microsoft Foundry and Google Vertex AI hosted catalogs do not list MiMo, and [PrudentBench](https://prudai.com/en/prudentbench/models/mimo-v2-6-pro)'s November compliance check found no EU route on any of the three; teams that need a major cloud contract currently have to self-host or use the platforms above.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| MiMo-7B | 2025-04 | A 7B reasoning model, Xiaomi's first open-weight LLM | — |
| MiMo-VL-7B, MiMo-Audio-7B | 2025-05 / 2025-09 | 7B open models for vision and audio respectively | — |
| MiMo-V2-Flash | 2025-12-16 | 309B-A15B MoE with a 5:1 SWA/global-attention mix and MTP, Xiaomi's entry into large-MoE competition; updates in January and February 2026 improved coding and tool-call success rates | — |
| MiMo-V2-Pro, V2-Omni | 2026-03-18 | A 1T-A42B flagship and a 256K omnimodal model, API only, no weights | — |
| MiMo-V2.5, V2.5-Pro | 2026-04-23 (API) / 04-27 (weights) | V2.5 put omnimodality and 1M context into open weights for the first time; V2.5-Pro opened the 1T flagship weights, but text only | — |
| MiMo-V2.6 Pro / Flash | 2026-09-21–22 | Both became omnimodal at V2.5 prices; the whole RL run was livestreamed for six days | [Model card](/posts/daily/2026-09-27-model-xiaomi-mimo-v2-6-pro-en) |
| V2.6 MOPD weights | 2026-09-27 | Fixed repeated tool calls; the official V2.5 API was retired on 10-21 | — |

Over eighteen months the pattern is "scale up, merge modalities, hold the price." In the V2.5 generation you had to pick the 309B V2.5 for omnimodality or the text-only V2.5-Pro for the strongest text model; V2.6 merges the two lines into a Pro and a Flash that are both omnimodal, leaving only the size-versus-price trade-off. V2.6-Pro's launch-day figures (46.32 on version 4.3 of the AA index, comparisons against Claude Opus 5) are kept in [the model card from the time](/posts/daily/2026-09-27-model-xiaomi-mimo-v2-6-pro-en).

## Architecture and training trade-offs

### Backbone: mostly sliding-window attention

The design described in the [Pro model card](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL) and the [technical report](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL/blob/main/MiMo_V2_6_technical_report.pdf):

| Item | V2.6-Pro | V2.6-Flash |
|---|---|---|
| Total / active parameters | 1.02T / 42B | 309B / 15B (310B in the technical report) |
| Layers (SWA / global) | 70 (60 / 10) | 48 (39 / 9) |
| Routed experts | 8 of 384, no shared expert | 8 of 256, no shared expert |
| Sliding window | 128 tokens | 128 tokens |
| Pre-training data | 30T (27T text + 3T omnimodal) | 48T (26T text + 22T omnimodal) |

- **Hybrid attention**: the first layer uses global attention with a dense FFN; the rest are blocks of several SWA layers followed by one global-attention layer. With a window of only 128 tokens, the KV cache of most layers does not grow with context length, which is the main reason 1M context is affordable.
- **Omnimodal encoders**: a 681M-parameter MiMo ViT (28 layers, 24 of them SWA) handles images and video; audio goes through a 308M AudioTokenizer plus a 127M patch encoder.
- **MTP speculative decoding**: a 5-layer SWA draft model predicts the next 7 tokens in one pass for parallel verification.
- **Flash saw more data than Pro**: Flash's omnimodal stage used 22T tokens, Pro's only 3T. That may be one reason the two score close on visual tasks, though the technical report does not draw that conclusion.

The cost is the self-hosting bar: the official SGLang example runs Pro on 16 GPUs across two machines and Flash on a single 8-GPU machine. Weights ship in FP8, and training already included MXFP4 quantization-aware training.

### Training: one mixed RL run, livestreamed

V2.6's selling point is post-training. The approach described in the [official blog](https://mimo.xiaomi.com/mimo-v2-6) and the technical report:

- **Optimizer switch in mid-training**: pre-training used AdamW; mid-training (256K, then extended to 1M) switched the hidden layers to Muown, a Muon variant, to prepare for large-batch RL.
- **You Only RL Once**: coding, general agent, visual and security tasks go into the same batches in a single RL run, mixed across several agent harnesses, instead of training each domain separately and merging. Each step uses 1,568 prompts with 16 rollouts each, 3.5–3.7B tokens per step.
- **Groupwise Agentic Grading**: solutions that pass the tests no longer all get the same reward. GRS builds rubrics offline by contrasting rollouts in the same group, and GAR shifts advantage online toward higher-quality, shorter solutions.
- **MOPD2**: after RL, multi-teacher on-policy distillation extends the model into domains that are hard to verify automatically (game development, research, embodied AI).

Xiaomi livestreamed the production RL run for six days: each model ran 30 steps over about 750,000 trajectories, costing about $0.85M (Flash) and $2.62M (Pro). On the held-out DeepSWE v1.1, Flash rose from 48.8 to 65.68 and Pro from 58.4 to 72.57. The environments, RL framework and Distill-9B were open-sourced as well, an unusually complete package for teams studying agentic RL.

## Evaluation and alternatives

### Third party: Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/mimo-v2-6-pro) Intelligence Index v5.0.1 scores V2.6-Pro at 30, sixth among large open-weight models and above the median of 23; [Flash](https://artificialanalysis.ai/models/mimo-v2-6-flash) scores 27. On the same index version, [Tencent Hy4 scores 35](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en).

The 46.32 cited by Xiaomi and by the launch-day model card is from the older index version 4.3, which has a different mix of evaluations. It cannot be compared directly with today's 30, and it should not be ranked against other models' v5 scores.

Artificial Analysis also flags two costs:

- **Slow**: Pro averages 43.7 minutes per task (class median 14.4), takes 36 seconds to the first answer token, and outputs about 46 tok/s. Flash averages 48.9 minutes per task, slower than Pro.
- **Verbose**: running the full index, Pro produced 131 million output tokens and Flash 163 million, against a median of about 104 million.

### Third party: Vals AI

[Vals AI](https://www.vals.ai/models/xiaomi_mimo-v2.6-pro)'s current Vals Index gives Pro 57.81% (24th of 43 models) and [Flash](https://www.vals.ai/models/xiaomi_mimo-v2.6-flash) 54.83% (28th), both tested through the official API. Vals's own Terminal-Bench 4.0 runs: Pro 31.31%, Flash 24.24%. On launch day Vals reported Flash at 59.58% and Pro at 59.47%, the top two open-weight models in the 65-model version of the index at the time, with Flash first on CyberBench. The model sets differ between the two dates, so the ranks are not directly comparable.

### Vendor-reported: V2.6 against the closed frontier

From the [Pro model card](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL) and Table 3 of the technical report; all numbers are published by Xiaomi. MiMo Code Bench, MiMo Visual Coding and MiMo Cyber Bench are Xiaomi's internal evaluation sets:

| Benchmark | V2.6-Pro | V2.6-Flash | V2.5-Pro | Claude Opus 5 | GPT-5.6 Sol |
|---|---|---|---|---|---|
| DeepSWE v1.1 | 71.9 | 67.9 | 19.0 | 74.0 | 73.0 |
| ProgramBench | 26.5 | 26.0 | 12.5 | 37.0 | 25.0 |
| AutomationBench v1.0.6 | 53.1 | 52.3 | 16.0 | 50.3 | 45.8 |
| Toolathlon-Verified | 76.9 | 73.6 | 49.1 | 80.6 | 74.9 |
| Terminal Bench 4.0 | 34.9 | 28.8 | 1.5 | 49.0 | 39.9 |
| OSWorld-Verified | 82.0 | 80.8 | — | 83.4 | 83.0 |
| JobBench | 62.0 | 61.2 | 25.0 | 65.7 | 45.4 |
| ExploitBench | 47.9 | 25.3 | 16.6 | 70.0 | 78.5 |

How to read it:

- **The comparisons are against the previous round of closed models.** The table uses Claude Opus 5 and GPT-5.6 Sol. The [official blog appendix](https://mimo.xiaomi.com/mimo-v2-6) adds newer rivals: on Terminal Bench 4.0, GPT 6 Astra scores 59.6 and Claude Fable 5.1 55.1, a wider gap than the table shows.
- **General agents and computer use are close to the frontier.** AutomationBench, JobBench and OSWorld-Verified are within a few points of Opus 5.
- **Long terminal tasks and offensive security trail.** Terminal Bench 4.0 is about 14 points behind Opus 5, and Vals's third-party 31.31% is also below the self-reported 34.9. The gaps on ExploitBench and ExploitGym are larger.
- **Flash is close to Pro.** Most items differ by 4 points or less; the big gaps are long-horizon and security items such as Terminal Bench 4.0 and ExploitBench. In the blog appendix, DeepSeek V4.1 Flash beats V2.6-Pro on both DeepSWE (74.2) and AutomationBench (54.8).

### Distill-Qwen-9B

The [model card](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B) lists the SFT checkpoint's gains over Qwen3.5-9B (Xiaomi's own tests): SWE-bench Pro 44.6 (from 32.0), AutomationBench 30.3 (from 5.0), Terminal Bench 2.1 37.1 (from 27.0). It is an SFT release meant as a starting point for agentic RL research; Xiaomi does not claim it replaces the large models.

## Licensing, pricing, and deployment

### Weight license: MIT, with a use-restrictions notice

The metadata of every V2.6 weight repo says MIT, and Artificial Analysis lists MIT as well. Two caveats:

- **The repos do not include a LICENSE file.** The license appears only in the model card metadata, so teams that need a legal record should archive the model card version they used.
- **The model card ends with "Use Restrictions"**: no unlawful use, infringement, military use, malicious cyber activity, unauthorized handling of personal data or unlawful scraping, and no "autonomously executes high-risk actions without appropriate human oversight." The same section says it is only a reminder and does not amend the license or add conditions.

In practice, commercial use, fine-tuning, redistribution and API resale carry no revenue or user-count thresholds of the kind in the Tencent Hy License. Wiring MiMo into an unsupervised agent that performs high-risk operations, though, runs against what Xiaomi has publicly asked for. Distill-9B's base, Qwen3.5-9B, has its own license; derivative use needs to respect both.

### API service and data

The [service agreement](https://mimo.mi.com/docs/terms/user-agreement) (July 7, 2026 version) says the service outside mainland China is operated by Xiaomi Technologies Singapore, with data stored on servers in Europe and Singapore; in-China use falls under separate terms. The [in-China privacy policy](https://privacy.mi.com/XiaomiMiMoPlatform/zh_CN) (in Chinese) says user-provided text content will not be used for model training without prior consent; the clause covers text only, not images, video or audio.

### API pricing

- **Official**: Flash $0.14/$0.28, Pro $0.435/$0.87, UltraSpeed $4.35/$8.70 per 1M tokens; cache writes are free for a limited time. RMB prices for China are on the pricing page.
- **Third-party hosting on OpenRouter varies widely.** Flash ranges from $0.10 (Darkbloom, FP4, only 32K context) to $0.20 (Makora). Pro costs $2.64/$5.28 on PrimaLabs, and $4.00/$8.00 on Cloudflare via PrimaLabs, 6–9 times the official price. Pin the provider when routing; the model name alone is not enough.
- **UltraSpeed costs ten times Pro.** Xiaomi claims up to 20x faster output, while OpenRouter's description says about 10x; it only pays off when latency is truly the bottleneck.

### Retirement and migration

[Official deprecation notice](https://mimo.mi.com/docs/en-US/updates/deprecate): `mimo-v2.5-pro` and `mimo-v2.5` were retired at 10:00 (UTC+8) on 2026-10-21, and since October 14 requests had been routed automatically to `mimo-v2.6-pro` and `mimo-v2.6-flash`. When migrating, note that Flash's default `max_completion_tokens` rose from 32,768 to 131,072, and that thinking mode no longer accepts custom `temperature`/`top_p`. Third-party hosts on OpenRouter still serve V2.5, but Xiaomi's own endpoints are closed.

### Self-hosting

Xiaomi provides deployment commands for SGLang (`lmsysorg/sglang:latest`) and vLLM (`vllm/vllm-openai:mimov25-cu129`); enable `--reasoning-parser mimo` and `--tool-call-parser mimo` together. The Flash model card warns that stable vLLM may lag and recommends the prebuilt image.

## Agent integration and selection

- **High-volume, cost-sensitive agent loops** → V2.6-Flash. It costs a third of Pro and trails it by only a few points on most agent benchmarks.
- **Agents that need to see screens or video, or hear audio** → V2.6-Pro or Flash. One model takes all four modalities, so you can drop a separate OCR or ASR step.
- **Primary coding agent or terminal work** → MiMo is not the first choice. Terminal Bench 4.0 (34.9 vendor, 31.31% Vals) trails the closed frontier clearly, and DeepSWE also loses to DeepSeek V4.1 Flash.
- **Low latency or interactive use** → the standard models are a poor fit at over 40 minutes per task on average; UltraSpeed is fast but costs ten times as much, so do the math first.
- **Penetration testing or exploit work** → not a fit. ExploitBench trails GPT-5.6 Sol by about 30 points, and the model card's use restrictions name malicious cyber activity explicitly.
- **Local use or agentic RL research** → Distill-Qwen-9B plus the open-sourced environments and RL framework.
- **A permissively licensed large open-weight model** → MIT, with no MaaS or user-count threshold.

A minimal selection check: send the same set of agent tasks to the official Flash and Pro endpoints and record completion rate, output tokens, total time and number of tool calls. If repeated tool calls show up within a trajectory, self-host the MOPD weights or add repeated-call detection to the host loop.

## Limitations and trade-offs

- **Slowness and verbosity are third-party measurements.** Artificial Analysis's time per task is roughly three times the class median, and output tokens run high; part of the low unit price is eaten by token volume.
- **Long terminal tasks and security trail.** The vendor table, Vals's Terminal-Bench 4.0 and the blog appendix all point the same way, and the vendor table does not compare against the newest closed models.
- **Repeated tool calls.** [Xiaomi's own analysis](https://mimo.xiaomi.com/blog/mimo-v2-6-tool-call-repetition) shows the RL checkpoints repeating calls at 1.02% (Flash) and 0.54% (Pro) under OpenCode; the MOPD checkpoints improve this, but Xiaomi does not say which version the API uses.
- **Score versions must match.** 46.32 is the old AA index and 30 the current one; Vals ranks shifted after launch as the model set changed. Cite the version and date.
- **Absent from the big cloud catalogs.** Teams that need Bedrock, Foundry or Vertex contracts and data-residency guarantees can only self-host for now.
- **Incomplete license paperwork.** The weights are tagged MIT only in metadata, without a LICENSE file, and the model card adds a use-restrictions notice.

MiMo's strategy comes down to building credibility through a livestreamed, fully open-sourced RL effort, and making its open weights cheap, omnimodal and MIT-licensed. For outside developers, V2.6-Flash is a low-cost option worth adding to the evaluation list for high-volume agent loops and multimodal input. It is not the coding or security leader, and it does not suit workloads that need real-time responses.

## References

- [Introducing MiMo-V2.6 series — Xiaomi MiMo official blog](https://mimo.xiaomi.com/mimo-v2-6)
- [XiaomiMiMo/MiMo-V2.6-Pro-RL — Hugging Face model card (specs, evaluations, deployment, use restrictions)](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL)
- [XiaomiMiMo/MiMo-V2.6-Flash-RL — Hugging Face model card](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Flash-RL)
- [XiaomiMiMo/MiMo-V2.6-Pro-MOPD — Hugging Face model card](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-MOPD)
- [XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B — Hugging Face model card](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Distill-Qwen-9B)
- [MiMo-V2.6 technical report (PDF)](https://huggingface.co/XiaomiMiMo/MiMo-V2.6-Pro-RL/blob/main/MiMo_V2_6_technical_report.pdf)
- [Diagnosing and Mitigating Tool-Call Repetition in MiMo-V2.6 — Xiaomi MiMo technical blog](https://mimo.xiaomi.com/blog/mimo-v2-6-tool-call-repetition)
- [Models — Xiaomi MiMo API docs](https://mimo.mi.com/docs/en-US/quick-start/model)
- [Model Deprecation — Xiaomi MiMo API docs](https://mimo.mi.com/docs/en-US/updates/deprecate)
- [Model Release — Xiaomi MiMo API docs (release history)](https://mimo.mi.com/docs/en-US/updates/model)
- [Xiaomi MiMo Service Agreement](https://mimo.mi.com/docs/terms/user-agreement)
- [Xiaomi MiMo privacy policy (in Chinese)](https://privacy.mi.com/XiaomiMiMoPlatform/zh_CN)
- [XiaomiMiMo/MiMo-V2.5-Pro — Hugging Face](https://huggingface.co/XiaomiMiMo/MiMo-V2.5-Pro)
- [XiaomiMiMo/MiMo-V2.5 — Hugging Face](https://huggingface.co/XiaomiMiMo/MiMo-V2.5)
- [XiaomiMiMo/MiMo-V2-Flash — Hugging Face](https://huggingface.co/XiaomiMiMo/MiMo-V2-Flash)
- [XiaomiMiMo/MiMo-7B-RL — Hugging Face](https://huggingface.co/XiaomiMiMo/MiMo-7B-RL)
- [Xiaomi: MiMo-V2.6-Flash — OpenRouter (providers and pricing)](https://openrouter.ai/xiaomi/mimo-v2.6-flash)
- [Xiaomi: MiMo-V2.6-Pro — OpenRouter](https://openrouter.ai/xiaomi/mimo-v2.6-pro)
- [LLM Rankings — OpenRouter](https://openrouter.ai/rankings)
- [MiMo-V2.6-Pro — Artificial Analysis](https://artificialanalysis.ai/models/mimo-v2-6-pro)
- [MiMo-V2.6-Flash — Artificial Analysis](https://artificialanalysis.ai/models/mimo-v2-6-flash)
- [MiMo V2.6 Pro — Vals AI](https://www.vals.ai/models/xiaomi_mimo-v2.6-pro)
- [MiMo V2.6 Flash — Vals AI](https://www.vals.ai/models/xiaomi_mimo-v2.6-flash)
- [mimo-v2.6 — Ollama](https://ollama.com/library/mimo-v2.6)
- [MiMo V2.6 models now available on AI Gateway — Vercel](https://vercel.com/changelog/mimo-v2-6-models-now-available-on-ai-gateway)
- [MiMo-V2.6-Pro — Cloudflare AI docs](https://developers.cloudflare.com/ai/models/xiaomi/mimo-v2.6-pro/)
- [MiMo-V2.6-Pro-RL — Fireworks AI](https://fireworks.ai/models/fireworks/mimo-v2p6-pro-rl)
- [MiMo V2.6 Pro — PrudentBench (cloud route compliance check)](https://prudai.com/en/prudentbench/models/mimo-v2-6-pro)
- [Model Card | MiMo-V2.6-Pro](/posts/daily/2026-09-27-model-xiaomi-mimo-v2-6-pro-en) — this site
- [Tencent Hy (Hunyuan) model family](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en) — this site
- [Speech and audio model families](/posts/tech/2026-08-26-ai-model-family-speech-audio-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
