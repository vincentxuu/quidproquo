---
title: "StepFun Step: Step 5 Preview Bets on a Narrow, Deep MoE for Long-Horizon Agents, and the License Moves Off Apache 2.0"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, stepfun, open-source, model-family-stepfun, moe, model-selection]
lang: en
type: deep-dive
tldr: "StepFun's current flagship is Step 5 Preview: 600B total parameters, 27B active, 1M context. It launched on the API in September and released weights on October 15 under the new StepFun Model License 1.0, which requires a separate commercial license for hardware makers and for MaaS operators with more than $20M in revenue. Artificial Analysis's current index scores it 29, and it is verbose and slow; its strengths are finance and research agents, while long-horizon terminal coding still trails the closed frontier. For Apache 2.0 or cheap high-throughput work, use Step 3.7 Flash; speech is covered by the API-only StepAudio 3."
description: "StepFun Step model family: Step 5 Preview and Step 3.7 Flash specs, the narrow-deep architecture and Sparse GQA, vendor and third-party evaluations, StepFun Model License terms, API and OpenRouter pricing, the StepAudio 3 speech line, the 2024–2026 timeline, and agent selection."
series:
  name: "AI Model Families"
  order: 37
draft: false
glossary:
  - term: "Sparse GQA"
    definition: "The sparse attention in Step 5 Preview's full-attention layers: an indexer compresses every 8 past positions into one block, each KV group picks its 512 most relevant blocks (about 4,096 tokens), and attention then reads the original K/V"
  - term: "Gated SWA (Gated Sliding Window Attention)"
    aliases: ["Gated SWA"]
    definition: "Sliding window attention with a gate, attending only to a recent span of tokens; Step 5 Preview interleaves it 3:1 with full-attention layers, a ratio carried over from Step 3.5 Flash"
  - term: "MTP-3 (3-way Multi-Token Prediction)"
    aliases: ["MTP-3"]
    definition: "An auxiliary head that predicts the next 3 tokens at once; at inference time it serves as the draft for speculative decoding to raise generation speed"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-stepfun)

StepFun (阶跃星辰) is a Chinese model company founded in Shanghai in 2023. Its models all carry the "Step" name and span text, vision and speech. This post is for agent developers evaluating Chinese open-weight models: what Step 5 Preview and Step 3.7 Flash are each good for, where they stand against GLM, Kimi and the closed frontier, and what the new license means for hardware products, API resale and distillation.

As of November 2026, the flagship Step 5 Preview launched on the API on September 20 and released its weights on October 15; it still carries the Preview name. It is the first open-weight Step flagship not under Apache 2.0, while the previous Step 3.5 and 3.7 Flash remain Apache 2.0.

For how to read the benchmark numbers below, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

Prices below come from [StepFun's international pricing page](https://platform.stepfun.ai/docs/en/guides/pricing/details.md), per 1M tokens, as input / output / cache hit:

| Model / line | Role | Key differences | Access and price |
|---|---|---|---|
| Step 5 Preview (`stepfun-ai/Step-5-Preview`, API name `step-5-preview`) | Current flagship, long-horizon agents | 600B total, 27B active; 1M context, 64K max output per API call; the API accepts text, images and video | Open weights (StepFun Model License 1.0; FP8 / BF16 / NVFP4) plus API: $1.00 / $2.70, cache $0.10 |
| Step 3.7 Flash (`step-3.7-flash`) | High-frequency multimodal agents | 198B (196B language backbone plus 1.8B vision encoder), about 11B active; 256K; low / medium / high reasoning | Open weights (Apache 2.0 per HF metadata) plus API: $0.20 / $1.15, cache $0.04 |
| Step 3.5 Flash / Step 3.5 Flash 2603 | Text-only reasoning | 196B, 11B active; 256K; the 2603 build adds a low-reasoning mode and better token efficiency | Open weights (Apache 2.0) plus API: $0.10 / $0.30, cache $0.02 |
| StepAudio 3 series | Speech | Full-duplex realtime conversation, TTS, general audio and music generation, ASR Max | API only, priced per session minute, character or audio hour |

Two things to know first:

- **The API and the weights do not have identical specs.** The [official docs](https://platform.stepfun.ai/docs/en/guides/models/step-5-preview) say the API accepts video and outputs at most 64K per call; the [HF model card](https://huggingface.co/stepfun-ai/Step-5-Preview) lists only text and image input, and for self-hosting the 1M context is shared between input and output. Artificial Analysis and Vals AI also list text and image only.
- **The cache-hit price has changed.** The launch [model card](/posts/daily/2026-09-21-model-stepfun-step-5-preview-en) recorded $0.05; the current pricing page says $0.10.

### Sub-lines and ecosystem

The [`stepfun-ai` organization](https://huggingface.co/stepfun-ai) on Hugging Face holds more than 50 repos. Beyond the main line:

- **Speech**: open-weight Step-Audio (2025-02), Step-Audio-2-mini, the reasoning-oriented Step-Audio-R1 / R1.1, and the 3B audio-editing model Step-Audio-EditX; the current flagship StepAudio 3 is API only. For cross-vendor speech comparisons, see the [speech and audio overview](/posts/tech/2026-08-26-ai-model-family-speech-audio-en).
- **Vision and GUI**: Step3-VL-10B, the OCR model GOT-OCR2.0, and the phone GUI agent GELab-Zero-4B-preview.
- **Image and video generation**: Step1X-Edit, NextStep-1 and Step-Video-T2V all have open weights, but image generation on the API was fully retired on 2026-10-10.
- **Math formalization**: StepFun-Prover and StepFun-Formalizer.

The API has two platforms: international `platform.stepfun.ai` (`https://api.stepfun.ai/v1`) and China `platform.stepfun.com` (`https://api.stepfun.com/v1`), and keys do not cross over. Besides pay-as-you-go, StepFun offers a Step Plan subscription and a terminal coding agent called Step Code.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| Step-1 / Step-2 | 2024 (Step-2 GA in 2024-07) | Closed API; Step-2 is a trillion-parameter MoE. These APIs were retired on 2026-07-08 | — |
| Step-Audio, Step-Video-T2V | 2025-02 | The first open weights, starting with speech (Apache 2.0) and video (MIT) | — |
| Step3 | 2025-07 | A 321B-total, 38B-active multimodal MoE under Apache 2.0; the API version was retired on 2026-07-08, with Step 3.7 Flash as the recommended replacement | — |
| Step 3.5 Flash | 2026-02 | Shrinks to 196B / 11B with MTP-3 and a 3:1 sliding-window mix, becoming a cheap, high-throughput text agent option | — |
| Step 3.7 Flash | 2026-05-29 | Adds native vision to the same backbone, so no separate vision model is needed; three reasoning levels | — |
| StepAudio 3 series | 2026-09 (technical reports) | Full-duplex realtime speech and unified audio generation, API only | — |
| Step 5 Preview | 2026-09-20 (API) / 10-15 (weights) | The flagship returns to a large model with 1M context; weights move to the StepFun Model License | [Model card](/posts/daily/2026-09-21-model-stepfun-step-5-preview-en) |

The arc over two years is a shift from a closed-API company to an open-weight one: from 2025 almost every product line released weights, and all of Step 3.x used Apache 2.0. Step 5 Preview is the first exception. Its weights are still open, but the terms add three hurdles: attribution, hardware and MaaS.

## Architecture and training trade-offs

### Step 5 Preview: narrow but deep

StepFun's [architecture blog](https://platform.stepfun.com/blog/inside-step-5-preview) lays out the reasoning. Agent tasks involve many tool calls and long prefills, leaving the model little room to write out full reasoning chains, so it has to do implicit multi-hop reasoning through its layers during prefill; with too few layers it "runs out of layers" on long prefills. Step 5 Preview therefore scales depth rather than width:

- **92 Transformer blocks.** StepFun says this matches the depth of Kimi K3 and Qwen3.8-Max with less than a quarter of their total parameters and less than a third of their active parameters. The hidden size in [config.json](https://huggingface.co/stepfun-ai/Step-5-Preview/blob/main/config.json) is only 4,096.
- **3:1 interleaved attention.** Every 3 Gated SWA layers (window 512) are paired with 1 full-attention layer, as in Step 3.5 Flash. StepFun tried several linear-attention variants, found the gap marginal, and chose SWA because it works more easily with speculative decoding.
- **Sparse GQA.** Full-attention layers use GQA with a sparse index, inspired by DeepSeek's DSA, but every 8 past positions are first compressed into a block and 512 blocks (about 4,096 tokens) are selected. StepFun's numbers: indexer and top-k cost drop to 1/8, with 78.06% token coverage versus 79.09% for per-token selection of 2,048.
- **MoE**: the config lists 352 routed experts with 8 selected per token, plus a shared expert, and 3 MTP layers.

The cost of going deep is training instability. StepFun hit numerical blow-ups and gradient spikes, and fixed them three ways: FP32 hidden states and gradients, FP32 scale parameters in RMSNorm, and a fine-grained gradient clamp that clips only about 0.00004% of the largest gradients per layer.

The reinforcement learning work targets long rollouts. StepFun made the training and inference sides bitwise identical (under 10% overhead), trained context compaction end to end as part of the policy, and cut the sample-drop rate below 1%. On the rollout inference side, MTP-3 gives about a 30% end-to-end speedup and native FP8 MoE about another 20%.

Self-hosting: per the [model card](https://huggingface.co/stepfun-ai/Step-5-Preview), FP8 needs 4 B300 or 8 H200 GPUs, and BF16 needs 8 B300 or two 8-GPU H200 nodes. StepFun ships vLLM (`vllm/vllm-openai:step-5-preview`) and SGLang (`lmsysorg/sglang:step-5-preview`) images, and notes that the BF16 Transformers sharding workflow has not yet been validated end to end.

### Step 3.7 Flash: a small backbone plus vision

The [Step 3.7 Flash model card](https://huggingface.co/stepfun-ai/Step-3.7-Flash) pairs Step 3.5 Flash's 196B backbone (45 layers, 8 of 288 experts) with a 1.8B vision encoder, activating about 11B per token, and StepFun cites up to 400 tokens per second. Its value is deployment flexibility: beyond data centers, StepFun lists workstations such as Macs with 128GB of unified memory, DGX Station and Ryzen AI Max+ 395 systems, with support in vLLM, SGLang, Transformers and llama.cpp.

## Evaluation and alternatives

### Third party: Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/step-5) Intelligence Index v5.0.1 scores Step 5 Preview at 29 (reasoning setting), above the median of 23 for open-weight models of similar size. It also flags two cost issues: running the full index produced 129M output tokens against a median of about 104M, and the average task took 22.3 minutes against a median of 14.3, which it calls notably slow. Cost per task is $2.35.

StepFun's launch page and the launch model card cite a score of 44, which came from the index version at launch; the index has since been revised with a different test set, so the two scores cannot be compared. Step 3.7 Flash has no score on the current version yet.

### Third party: Vals AI

[Vals AI](https://www.vals.ai/models/stepfun_step-5-preview) gives Step 5 Preview 54.76% on the Vals Index, 29th of 43 models, and 55.43% on its Finance Index (34th of 46). Vals's own Terminal-Bench 4.0 run is 31.82%, slightly below StepFun's self-reported 33.3%.

### Vendor-reported: Step 5 Preview against GLM, Kimi and the closed frontier

The table below is taken from the [Step 5 Preview launch page](https://www.stepfun.com/step-5-preview); all numbers are StepFun's. Step 5 Preview runs at High reasoning and the other models at Max; DeepSWE uses the SWE-agent harness. The comparison models are the versions available at launch, not later releases such as Kimi K3.1 Pro or Claude Opus 5.5:

| Benchmark | Step 5 Preview | GLM-5.3 | Kimi K3 | GPT-6 Astra | Claude Opus 5 |
|---|---|---|---|---|---|
| DeepSWE v1.1 | 67.7 | 66.9 | 67.5 | 74.1 | 74.0 |
| Terminal-Bench v4 | 33.3 | 41.9 | 12.6 | 57.9 | 52.3 |
| SWE-Marathon v1.1 (partial score) | 72.7 | 67.4 | 84.4 | 77.3 | 85.6 |
| GDPval-AA v2.1 (Elo) | 1566 | 1645 | 1524 | 1542 | 1708 |
| AutomationBench-AA | 51.0 | 62.2 | 58.3 | 68.5 | 56.6 |
| BrowseComp | 88.7 | — | 91.2 | 91.5 | 90.2 |
| FrontierFinance | 66.4 | 64.1 | 62.6 | 55.0 | 69.7 |
| AA-LCR v1.1 | 88.3 | 79.7 | 88.7 | 80.7 | 79.3 |
| MMMU-Pro | 76.0 | text only | 81.0 | 87.0 | 85.0 |

How to read it:

- **Long-horizon terminal coding is the weak spot.** DeepSWE is level with GLM and Kimi, but Terminal-Bench v4 and SWE-Marathon trail the closed frontier clearly. StepFun's own StepCodeBench write-up also concedes a meaningful gap to the frontier on the hardest long-running tasks.
- **Finance and long documents are the strengths.** On FrontierFinance it trails only Claude Opus 5, and on AA-LCR long-context reasoning it is close to the top of the table; StepFun's three in-house FinStepBench suites show the same pattern, but they are in-house benchmarks.
- **Work-style agent tasks are not a lead.** GDPval-AA and AutomationBench-AA both come in below GLM-5.3; these two are Artificial Analysis test sets.

In-house benchmarks need separate treatment: StepCodeBench (553 repos, 9 task categories, 33 languages) is 49.0% against Claude Opus 5's 63.9%, and the three FinStepBench suites are also StepFun-authored. The launch page adds two 24-hour long-horizon cases: optimizing an MLA kernel on an H100 to 508 TFLOPS (Claude Opus 5: 493), and automatically post-training Qwen3-30B-A3B from 53.3% to 60% on AIME24. These are single cases, not rerunnable benchmarks.

### Step 3.7 Flash

All numbers on the [Step 3.7 Flash model card](https://huggingface.co/stepfun-ai/Step-3.7-Flash) and [official blog](https://static.stepfun.com/blog/step-3.7-flash/) are self-reported: SWE-Bench Pro 56.3 (Step 3.5 Flash: 51.3), Terminal-Bench 2.1 59.5, ClawEval-1.1 67.1, Toolathlon 49.5, GDPval-AA 45.8, and SimpleVQA (with search) 79.2. StepFun itself names Terminal-Bench and GDPval as areas to improve.

### StepAudio 3

The [StepAudio 3 Realtime technical report](https://arxiv.org/abs/2609.14005) self-reports MMSU 90.6, 98.9 on the Artificial Analysis Full-Duplex Bench, and a 56.0% task-success rate on τ-Voice; [ASR Max](https://platform.stepfun.ai/docs/en/guides/models/stepaudio-3-asr) self-reports a 0.57% contextual-reasoning error rate (previous generation: 1.59%). For third-party TTS rankings, see the [speech and audio overview](/posts/tech/2026-08-26-ai-model-family-speech-audio-en).

## Licensing, pricing, and deployment

### StepFun Model License 1.0: three hurdles

The [Step 5 Preview LICENSE](https://huggingface.co/stepfun-ai/Step-5-Preview/blob/main/LICENSE.txt) is StepFun's own license, which the model card calls "Apache-2.0-Style". The base grant is broad: perpetual, worldwide and free, allowing commercial use, modification and redistribution, with a patent license. The differences sit in Section 2:

| Situation | Condition |
|---|---|
| General commercial use, fine-tuning, redistribution | Include the license, keep notices, mark modifications, provide the model card or a link |
| A commercial product with more than 100M active users or more than $20M in revenue in any calendar month | Prominently display "Powered by StepFun AI" in the UI (including the About page) and the user agreement |
| A hardware maker or brand (phones, vehicles, smart glasses, wearables, robots, smart-home devices) offering the model's capabilities as a device feature | Sign a commercial license with StepFun first, **with no size threshold** |
| Operating a MaaS business while group revenue exceeds $20M over any 12 months | Any commercial use requires a commercial license first |
| Purely internal use, or a StepFun-certified distribution channel | Not subject to the two rows above |

Two more clauses are easy to miss:

- **Distillation counts as a derivative.** "A model trained to a material extent on outputs of the Model" is deemed a derivative work and falls under the same license.
- **MaaS is defined by control.** It is MaaS only if third parties have meaningful control over inputs, parameters or training data; embedding the capability in a specific end-user feature, or merely relaying requests to another provider's model, does not count.

The license has no regional exclusion; a material breach terminates it, with rights restored if cured within 30 days. The previous Step 3.5 Flash and Step 3.7 Flash remain Apache 2.0, but the Step 3.7 Flash repo declares Apache 2.0 only in its metadata and has no LICENSE file, which legal reviews should note.

### API pricing

- **Step 5 Preview**: $1.00 / $2.70, cache hit $0.10; output tokens include the reasoning process.
- **Step 3.7 Flash**: $0.20 / $1.15, cache hit $0.04.
- **Step 3.5 Flash (including 2603)**: $0.10 / $0.30, cache hit $0.02.
- **OpenRouter**: [Step 5 Preview](https://openrouter.ai/stepfun/step-5-preview) is served by StepFun (FP8, 1M context, 64K output) and Featherless (FP4, 262K context, 32K output) at the same price; Step 3.7 Flash is hosted by StepFun and Novita. On the [OpenRouter rankings](https://openrouter.ai/rankings) "New & Trending" list through November 22, Step 5 Preview processed 3.23T tokens this week, up more than tenfold week over week, ranking 6th, though it is not in the weekly top ten by usage.
- **Speech**: new StepAudio 3 prices take effect at noon on 2026-11-23 (UTC+8). Realtime is $0.125 per session minute (both sides' speaking time counts), TTS is $14 per 1M billable characters (one Chinese character counts as 3), music generation starts at $2.40 per output hour, ASR Max is $0.60 per audio hour, and cloning or designing a voice costs $1.50 each. Unit prices on individual model pages do not match the overall table; the [pricing table](https://platform.stepfun.ai/docs/en/guides/pricing/details.md) is authoritative.
- **Rate limits**: individual accounts are tiered by cumulative top-up; the lowest tier (under $15) allows 5 concurrent requests, 100 requests per minute and 500K TPM.

### Retirements and replacements

Per the official [deprecations page](https://platform.stepfun.ai/docs/en/guides/model-migration.md):

- **2026-07-08**: `step-1-8k`, `step-1-32k`, `step-1v-8k`, `step-1v-32k`, `step-2-mini`, `step-2-16k` and `step-1o-vision-32k` were retired, with `step-1o-turbo-vision` as the replacement; `step-3` was retired, with `step-3.7-flash` as the replacement.
- **2026-10-10**: image generation and editing (`step-2x-large`, `step-image-edit-2`) were retired, and the [notice](https://platform.stepfun.ai/docs/en/guides/image-offline-notice.md) names no replacement model.

### Self-hosting

Step 5 Preview's vLLM and SGLang commands already include MTP speculative decoding and the `step5` reasoning and tool-call parsers. Step 3.7 Flash also ships FP8, NVFP4 and GGUF builds and is available as an NVIDIA NIM.

## Agent integration and selection

- **Finance research, long-document analysis and deep-search agents** → Step 5 Preview. FrontierFinance and AA-LCR are close to the closed frontier at a fraction of closed-flagship prices, but expect it to be slow, and measure hallucination and output length on your own tasks first.
- **High-frequency agents that need to see images, or parallel coding agents** → Step 3.7 Flash. Its input price is a fifth of Step 5 Preview's and its output price is under half, and it can be self-hosted on a 128GB workstation.
- **A primary coding agent or terminal work** → Step 5 Preview is not the first choice; Terminal-Bench v4 and SWE-Marathon trail Claude Opus 5 and GPT-6 Astra.
- **Voice customer service, in-car assistants and companion conversation** → StepAudio 3 Realtime: full duplex, thinks while speaking, and can call tools mid-conversation; API only, billed per session minute.
- **Need Apache 2.0** → Step 3.5 Flash (text only) or Step 3.7 Flash (text plus images), both 256K.
- **Building phones, cars, robots or other hardware, or reselling a general API** → before choosing Step 5 Preview, check Section 2(c) for whether you need a commercial license; the hardware clause has no size threshold.
- **Distilling your own model from Step 5 Preview outputs** → the resulting model is treated as a derivative work.

Integration: the API offers both OpenAI-compatible Chat Completions and a Messages API format, with reasoning effort set via `reasoning_effort` and `output_config.effort` respectively (low / medium / high), plus tool calling and JSON Schema output. StepFun also lists harnesses such as Claude Code, KiloCode and OpenClaw for Step 3.7 Flash. Tools, search and code execution are provided by the host; the model itself does not touch your local environment.

A minimal selection check: send the same set of agent tasks to `step-5-preview` at high and at low, then to `step-3.7-flash` at medium, and compare completion rate, output tokens, total time and the bill. Artificial Analysis data shows Step 5 Preview takes notably longer per task than its peers, so latency-sensitive flows need to account for time.

## Limitations and trade-offs

- **Slow and verbose.** Artificial Analysis measured 22.3 minutes per task (peer median 14.3) and about 25% more output tokens than the median, which eats into the per-token price advantage.
- **Long-horizon coding trails the closed frontier.** StepFun's own Terminal-Bench v4, SWE-Marathon and StepCodeBench notes point the same way, and Vals AI's Terminal-Bench 4.0 result of 31.82% is no better than the self-reported figure.
- **Launch-time scores are out of date.** The 44 is from the old index version; the current version gives 29, and the vendor comparison table uses previous-generation competitors.
- **The license is no longer Apache 2.0.** Hardware products, large MaaS operators, attribution for large products and distillation all carry conditions, so the old "Step is open source, use it however you like" impression no longer holds.
- **Still a Preview.** There is no GA name yet, and the API and weights differ in specs (video input, output cap), which may change.
- **Sub-lines are contracting.** Image generation on the API has been fully retired, the speech flagship is API only, and open-weight speech models stop at the Step-Audio-R1.1 and EditX generation.

Step's strategy can be summed up as using a narrow, deep architecture and 1M context to put its flagship in the top tier of open-weight models, aimed at finance and research agents at a mid-range price, while the Flash line holds down low prices and permissive licensing. For outside developers, Step 5 Preview belongs on the evaluation list for finance and long-document agents; it is not a coding champion, it is not fast, and its license adds three hurdles that Step 3.x did not have.

## References

- [Step 5 Preview: Advancing the Pareto Frontier — StepFun launch page (evaluation table)](https://www.stepfun.com/step-5-preview)
- [Inside Step 5 Preview: Architecture and Training for Agentic Work — StepFun blog](https://platform.stepfun.com/blog/inside-step-5-preview)
- [stepfun-ai/Step-5-Preview — Hugging Face model card (specs, deployment)](https://huggingface.co/stepfun-ai/Step-5-Preview)
- [StepFun Model License 1.0 — Hugging Face](https://huggingface.co/stepfun-ai/Step-5-Preview/blob/main/LICENSE.txt)
- [Step-5-Preview config.json — Hugging Face](https://huggingface.co/stepfun-ai/Step-5-Preview/blob/main/config.json)
- [Step 5 Preview — StepFun Open Platform docs](https://platform.stepfun.ai/docs/en/guides/models/step-5-preview)
- [Pricing and Rate Limits — StepFun Open Platform](https://platform.stepfun.ai/docs/en/guides/pricing/details.md)
- [Model Overview — StepFun Open Platform](https://platform.stepfun.ai/docs/en/guides/models/overview.md)
- [Model Lifecycle & Deprecations — StepFun Open Platform](https://platform.stepfun.ai/docs/en/guides/model-migration.md)
- [Image Model Retirement Notice — StepFun Open Platform](https://platform.stepfun.ai/docs/en/guides/image-offline-notice.md)
- [stepfun-ai/Step-3.7-Flash — Hugging Face model card](https://huggingface.co/stepfun-ai/Step-3.7-Flash)
- [Step 3.7 Flash — StepFun blog](https://static.stepfun.com/blog/step-3.7-flash/)
- [stepfun-ai/Step-3.5-Flash — Hugging Face model card](https://huggingface.co/stepfun-ai/Step-3.5-Flash)
- [Step 3.5 Flash technical report — arXiv 2602.10604](https://arxiv.org/abs/2602.10604)
- [stepfun-ai/step3 — Hugging Face model card](https://huggingface.co/stepfun-ai/step3)
- [Step-3 is Large yet Affordable — arXiv 2507.19427](https://arxiv.org/abs/2507.19427)
- [StepAudio 3 Realtime — StepFun Open Platform docs](https://platform.stepfun.ai/docs/en/guides/models/stepaudio-3-realtime.md)
- [StepAudio 3 Realtime Technical Report — arXiv 2609.14005](https://arxiv.org/abs/2609.14005)
- [StepAudio 3 Gen Technical Report — arXiv 2609.12945](https://arxiv.org/abs/2609.12945)
- [StepAudio 3 ASR — StepFun Open Platform docs](https://platform.stepfun.ai/docs/en/guides/models/stepaudio-3-asr)
- [stepfun-ai — Hugging Face organization](https://huggingface.co/stepfun-ai)
- [StepFun: Step 5 Preview — OpenRouter (providers and pricing)](https://openrouter.ai/stepfun/step-5-preview)
- [OpenRouter Rankings](https://openrouter.ai/rankings)
- [Step 5 Preview — Artificial Analysis](https://artificialanalysis.ai/models/step-5)
- [Step 5 Preview — Vals AI](https://www.vals.ai/models/stepfun_step-5-preview)
- [Chinese AI can benefit from bigger models, more data, says start-up founder — South China Morning Post (via Yahoo Finance)](https://finance.yahoo.com/news/chinese-ai-benefit-bigger-models-093000246.html)
- [Model Card | Step 5 Preview](/posts/daily/2026-09-21-model-stepfun-step-5-preview-en) — this site
- [AI Model Families: Speech and Audio](/posts/tech/2026-08-26-ai-model-family-speech-audio-en) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series guide
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
