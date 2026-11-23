---
title: "Baidu ERNIE: 5.5 Flash Returns to Open Weights, but Base and Preview Carry Different Licenses"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, baidu, open-source, model-family-ernie, moe, model-selection]
lang: en
type: deep-dive
tldr: "Baidu's current ERNIE generation is ERNIE 5.5 Flash: a text-only MoE with 280B total parameters, 14B active and 1M context. The un-post-trained Base went open on November 5 under a custom license that excludes the EU, UK and South Korea; the post-trained Preview followed on November 11 with an API on Qianfan and a promise of Apache 2.0 weights. Baidu's own evaluations put it near Hy4 and DeepSeek-V4.1-Flash on agent tasks, but no third-party score exists yet. The closed flagship is still May's ERNIE 5.1."
description: "Baidu ERNIE model family: ERNIE 5.5 Flash Base and Preview specs and architecture (HCA + MLA-DSA, Multi-Router Latent MoE, ECHO), vendor evaluations, the two different licenses, Qianfan pricing, the ERNIE 4.5 → 5.0 → 5.1 → 5.5 timeline, the Unlimited OCR sub-line, and agent selection."
series:
  name: "AI Model Families"
  order: 35
draft: false
glossary:
  - term: "HCA (Heavily Compressed Attention)"
    aliases: ["Heavily Compressed Attention"]
    definition: "The compressed attention used in most ERNIE 5.5 Flash layers: every 128 tokens collapse into one cached entry, plus a short uncompressed window of recent tokens, to shrink the KV cache at long context"
  - term: "ECHO"
    definition: "ERNIE 5.5 Flash's replacement for an MTP module: the backbone's last layer is reused to predict upcoming tokens and doubles as the speculative-decoding drafter; it adds about 0.36B parameters"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-ernie)

ERNIE (文心, Wenxin) is Baidu's large model family; Baidu's consumer chatbot and its enterprise platform Qianfan are both built on it. This post is for agent developers evaluating ERNIE: what the Base and Preview of ERNIE 5.5 Flash are each for, how their two licenses differ, and how to validate the model when no third-party evaluation exists.

As of November 2026, Baidu has put its new generation on the 280B ERNIE 5.5 Flash. It open-sourced the pre-trained Base first, then shipped a post-trained Preview whose weights Baidu says will be open-sourced by November 25. The closed flagship is still ERNIE 5.1 from May.

For how to read the benchmark numbers below, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

| Model / line | Role | Key difference | Access |
|---|---|---|---|
| ERNIE 5.5 Flash Preview (Qianfan `ERNIE-5.5-Flash-Preview`) | Post-trained model of the current generation | 280B total, 14B active; 1M context, 64K default output; text only; Baidu labels it a mid-post-training checkpoint | Qianfan API; free on OpenRouter; weights promised under Apache 2.0 |
| ERNIE 5.5 Flash Base (`baidu/ERNIE-5.5-Flash-Base`) | Pre-trained weights | Same architecture, no mid- or post-training; completions only | Open weights (FP8 / BF16), ERNIE 5.5 Flash Base license |
| ERNIE 5.1 | Closed flagship | A sub-network extracted from ERNIE 5.0, about one-third of 5.0's total parameters | ERNIE website, Baidu products and Qianfan |
| ERNIE 4.5 series | Previous open weights | Ten models, from a 0.3B dense model to a 424B-A47B multimodal MoE | Open weights, Apache 2.0 |
| Unlimited OCR 2 (`baidu/Unlimited-OCR-2`) | Long-document OCR | 3.34B, built for cross-page parsing of documents hundreds of pages long | Open weights, MIT |

A few things to know first:

- **Preview and Base have different licenses.** Base uses a Baidu custom license with territorial exclusions and a revenue threshold; Preview is promised under Apache 2.0. The architecture is the same, so the choice of weights decides where and how you can use them commercially (see "Licensing, pricing, and deployment").
- **5.5 Flash has no vision.** Baidu's own Unreal Engine demo spells it out: the model cannot see the screen, so it turned problems found in playtesting into measurable tests in code. Image tasks in this generation need an outside tool.
- **5.1 and 5.5 Flash are separate lines.** 5.1 continues 5.0's elastic-training approach; 5.5 Flash is a new architecture pre-trained from scratch, not a shrunken 5.1.

### Sub-lines and ecosystem

Beyond the general-purpose line, Baidu's [`baidu` organization](https://huggingface.co/baidu) on Hugging Face maintains several task-specific lines: [Unlimited OCR](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2-en) for long-document OCR (MIT), Qianfan-OCR, the text-to-image ERNIE-Image, and PaddleOCR-VL in the PaddlePaddle ecosystem. Qianfan also launched the low-cost long-context model ERNIE-Light-DT-1.0 and the talking-portrait video model ERNIE-Wizshot-ME at the same time.

Baidu trains and serves most of its models on its own PaddlePaddle framework; the ERNIE 4.5 weights ship in both PaddlePaddle (`-Paddle`) and PyTorch (`-PT`) formats. ERNIE 5.5 Flash Base is published directly as safetensors, with official SGLang and vLLM deployment examples.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| ERNIE 4.5 open release | 2025-06-30 | Ten models released at once under Apache 2.0, up to 424B-A47B; Baidu's first large-scale open-weight release | — |
| ERNIE 5.0 | Preview on LMArena from 2025-11, final release 2026-01 | A 2.4T natively omni-modal model that understands and generates text, images, video and audio in one autoregressive backbone; API only, no weights | — |
| ERNIE 5.1 | 2026-05-09 | A sub-network extracted from 5.0 with about one-third of the total and half of the active parameters, at about 6% of a comparable model's pre-training cost; still closed | — |
| Unlimited OCR 2 | 2026-10-27 | 3.34B under MIT; parses hundred-page documents without chunking first | [Model card](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2-en) |
| ERNIE 5.5 Flash Base | 2026-11-05 | New architecture pre-trained from scratch on 33.5T tokens, released as the end-of-pre-training checkpoint; custom license excludes the EU, UK and South Korea | [Model card](/posts/daily/2026-11-09-model-baidu-ernie-5-5-flash-base-en) |
| ERNIE 5.5 Flash Preview | 2026-11-11 | First post-trained release, API on Qianfan; Apache 2.0 weights promised | — |

The theme of the year is "closed flagship and open weights split apart": the 4.5 generation went fully open, 5.0 and 5.1 stayed API-only, and 5.5 Flash returns to open weights, this time with a smaller, cheaper architecture. 5.0's omni-modal approach did not carry over; 5.5 Flash is text only.

## Architecture and training trade-offs

### ERNIE 5.5 Flash: every component squeezes KV cache and active compute

From the [ERNIE 5.5 Flash Base announcement](https://ernie.baidu.com/release/ernie-5-5-flash-base/) and the [Hugging Face model card](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base):

- **Hybrid sparse attention**: 37 of 43 layers use HCA, compressing every 128 tokens into one cached entry; only 6 layers (about one in seven) use MLA with DeepSeek Sparse Attention and keep token-level access to the full context. This is the main reason the KV cache stays small at 1M context.
- **Multi-Router Latent MoE**: each layer has 512 routed experts (top-10) plus one shared expert, operating in a low-dimensional latent space; several independently initialized routers replace a single router, which Baidu says makes routing scores track actual expert usefulness more closely.
- **Manifold-Constrained Hyper-Connections**: the residual path is widened into multiple streams.
- **ECHO**: instead of a separate MTP module, the backbone's last layer is reused to predict upcoming tokens and also serves as the speculative-decoding drafter.
- **Training**: 33.5T tokens with the Muon optimizer and FP8 mixed precision; training context was extended gradually to 128K, with 1M supported for fine-tuning and inference.

The trade-off is that long-context ability comes mostly from inference-time extension rather than native training, and Base's long-context scores are indeed more conservative than its exam and code scores. On Qianfan, Preview runs with FP4 expert weights plus a draft head, and Baidu claims more than 200 output tokens per second.

### Post-training: purpose-built workspaces and RSI

The [Preview announcement](https://ernie.baidu.com/release/ernie-5-5-flash-preview) describes the post-training focus: 300,000 workspaces holding 10 million reference files in more than 40 file types for knowledge work, 150,000 environments for video creation, and dedicated data for game development and Blender/CAD. [Baidu's press release](https://www.prnewswire.com/news-releases/baidu-unveils-latest-ernie-models-amid-broader-full-stack-ai-lineup-and-debuts-token-exchange-to-power-intelligent-organizations-302937959.html) adds that Preview was optimized with ERNIE Evolve, Baidu's "recursive self-improvement" technology, to raise inference efficiency. Preview is a mid-post-training release, and Baidu says some capabilities may still fall short.

### ERNIE 5.0 and 5.1: elastic training

The core of the [ERNIE 5.0 technical post](https://ernie.baidu.com/research/posts/ernie5.0/) is Once-For-All elastic training: a single pre-training run jointly optimizes sub-models with different depths, expert capacities and top-k settings. [ERNIE 5.1](https://ernie.baidu.com/research/posts/ernie-5.1-0508-release/) is extracted from that sub-model matrix, which is how it reaches flagship level at about 6% of the pre-training cost. Baidu has not disclosed 5.1's exact parameter count.

## Evaluation and alternatives

### Third party: none yet

[Artificial Analysis](https://artificialanalysis.ai/models/creators/baidu) lists only ERNIE 5.0 Thinking Preview and ERNIE 4.5 300B-A47B, with no version of ERNIE 5.5. Every number below comes from Baidu; run your own tests before choosing.

### Vendor-reported: ERNIE 5.5 Flash Preview against its peers

From the [Preview announcement appendix](https://ernie.baidu.com/release/ernie-5-5-flash-preview). Where a rival cell has two numbers, the first is quoted from that vendor's report and the second is Baidu's own run; a single unannotated number is quoted from the vendor's report:

| Benchmark | ERNIE 5.5 Flash Preview | Hy4 | DeepSeek-V4.1-Flash-1017 | GLM-5.3 | Claude Opus 5.5 |
|---|---|---|---|---|---|
| Terminal-Bench 4.0 | 46.5 | 44.4 / 42.4 | 42.3 / 40.9 | 41.8 / 38.8 | 66.4 / 63.6 |
| DeepSWE v1.1 | 71.2 | 74.9 | 77.0 | 66.9 | 74.2 |
| ProgramBench (almost solved) | 29.5 | 30.0 / 28.5 | 29.1 / 27.5 | 19.0 / 19.0 | 65.0 |
| AutomationBench | 61.9 | 56.2 / 55.2 | 60.5 / 57.2 | 48.2 / 50.7 | 58.0 (Baidu run) |
| BrowseComp | 87.4 | 91.8 (Baidu run) | 80.3 (Baidu run) | 77.8 (Baidu run) | 90.8 |
| HLE (no tools) | 46.4 (text-only subset) | 46.7 (Baidu run, text-only subset) | 44.0 (text-only subset) | 42.0 (text-only subset) | 61.4 |

How to read it:

- **14B active lands in the same tier as the 49B-active Hy4.** Terminal-Bench 4.0 and AutomationBench edge out Hy4 and DeepSeek-V4.1-Flash-1017, while DeepSWE trails.
- **The closed frontier is still far ahead.** Terminal-Bench 4.0 and ProgramBench both lose clearly to Claude Opus 5.5.
- **Baidu chose the evaluation setup.** Each benchmark uses a different harness (Claude Code, mini-swe-agent, Codex and others) and judge model; because the model has no vision, some tasks relied on another vendor's model to describe images.
- **Cross-vendor numbers do not always match.** The same table quotes Hy4 at 77.6 on APEX-Agents, while Tencent's own [Hy4 model card](https://huggingface.co/tencent/Hy4) says 75.2.

### Vendor-reported: Base against base models of similar size

The [Base announcement](https://ernie.baidu.com/release/ernie-5-5-flash-base/) runs four base models through the same harness, prompts and few-shot examples: MMLU-Pro 78.4 (DeepSeek-V4-Flash-Base 69.2, Hy3-preview-Base 66.9) and HumanEval+ 82.3 (69.5 and 78.0). The weak spots are long context and Chinese knowledge: HELMET-Rerank 56.2, InfiniteBench 46.5 and ChineseSimpleQA 73.0, all below DeepSeek-V4-Flash-Base's 60.0, 48.0 and 75.3.

### The closed flagship, ERNIE 5.1

Baidu's evidence is leaderboard rank: on May 9 it scored 1,223 on the Arena Search leaderboard, fourth globally and first among Chinese models; Baidu also reports 99.6 on AIME26 with tools. There is no like-for-like comparison with 5.5 Flash.

## Licensing, pricing, and deployment

### Two sets of weights, two licenses

| Weights | License | Key conditions |
|---|---|---|
| [ERNIE 5.5 Flash Base](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base) | ERNIE 5.5 Flash Base Model License Agreement v1.0 | The licensed territory excludes the EU, UK and South Korea, and use, distribution or display of outputs outside it is not licensed; commercial use is allowed for related-product revenue up to $50M a year, but a one-time use notice is required before the first commercial use; above $50M you need written authorization first; governed by Hong Kong law |
| ERNIE 5.5 Flash Preview | Apache 2.0 promised | Weights scheduled for release by November 25 |
| ERNIE 4.5 series | Apache 2.0 | No added conditions |
| Unlimited OCR 2 | MIT | No added conditions |

The Base license counts "annual revenue" broadly: affiliates under common control are aggregated, and if a product also uses other models, the whole product's revenue counts. Taiwan is not on the exclusion list, but products serving users in the EU, UK or South Korea cannot use Base. Once Preview's Apache 2.0 weights ship, these restrictions no longer apply, provided the weights really are released under that license.

### Qianfan pricing

- **ERNIE 5.5 Flash Preview**: [Baidu's press release](https://www.prnewswire.com/news-releases/baidu-unveils-latest-ernie-models-amid-broader-full-stack-ai-lineup-and-debuts-token-exchange-to-power-intelligent-organizations-302937959.html) lists RMB 1 per million input tokens, RMB 4 per million output tokens and RMB 0.04 for cache hits. The [Qianfan promotion page](https://cloud.baidu.com/product/qianfan_home/model_3.html) shows input priced by peak (8:00–22:00) and off-peak hours, currently at 50% off: peak RMB 2 down to 1, off-peak RMB 1 down to 0.5. The press release also says the model is free on OpenRouter.
- **ERNIE-Light-DT-1.0**: RMB 8 per million input tokens and RMB 0.8 for cache hits, aimed at low-cost long-context calls.
- **ERNIE 5.1**: offered on the ERNIE website and Qianfan; this post does not cover its pricing.

### Self-hosting

Base ships FP8 and BF16 safetensors and expects a BOS token on every input (keep `add_special_tokens=True` when tokenizing). Base is not a chat model and has no chat template; call it through completions. Until Preview's weights are out, Preview is API-only.

## Agent integration and selection

- **A cheap agent backend for knowledge work, Blender/CAD or game development** → ERNIE 5.5 Flash Preview. These are where Baidu invested most, and it is cheaper than Hy4; but it is a mid-training checkpoint, so behavior may change before the final release.
- **Agents that need to see images** → 5.5 Flash is a poor fit; add a vision model or use a natively multimodal model such as Hy4.
- **Your own post-training or training-method comparisons** → ERNIE 5.5 Flash Base, provided you do not serve the EU, UK or South Korea and you handle the notice and revenue thresholds.
- **Open weights with no strings** → wait for Preview's Apache 2.0 weights; for immediate use, only the ERNIE 4.5 series qualifies.
- **Long-document parsing** → Unlimited OCR 2: 3.34B, runs on a single GPU, MIT license.
- **Chat or search products for the Chinese market** → ERNIE 5.1, whose Arena Search ranking is its strongest public signal.

A minimal selection check: send the same tasks to ERNIE 5.5 Flash Preview, Hy4 and DeepSeek-V4.1-Flash-1017 and compare completion rate and cost. The three sit close together in Baidu's table, and only your own tasks will show the gap; Preview's free period on OpenRouter is a good time to run this.

## Limitations and trade-offs

- **No third-party scores.** Every ERNIE 5.5 number was produced by Baidu, and Artificial Analysis has not listed it.
- **Preview is an unfinished release.** Baidu says post-training is ongoing, so the final release's scores and behavior may differ.
- **Text only.** 5.0's omni-modal ability did not carry over to 5.5 Flash; vision tasks need outside tools.
- **Base's license is territorial.** The EU, UK and South Korea are outside the licensed territory, and the revenue test aggregates affiliates and whole products.
- **Little public detail on the closed flagship.** ERNIE 5.1 has no disclosed parameter count, and its international availability lags Qwen and DeepSeek.

Baidu's bet this generation is "efficiency-first, mid-size open weights": reach the Hy4 and DeepSeek-V4.1-Flash tier with 14B active parameters, and leave the Base to the community for post-training. For outside developers, ERNIE 5.5 Flash belongs on the evaluation list for low-cost agent backends, but it becomes a production option only once the Apache 2.0 weights actually ship and third-party scores appear.

## References

- [ERNIE 5.5 Flash Preview — Baidu ERNIE official blog (with benchmark appendix)](https://ernie.baidu.com/release/ernie-5-5-flash-preview)
- [ERNIE 5.5 Flash Base — Baidu ERNIE official blog](https://ernie.baidu.com/release/ernie-5-5-flash-base/)
- [baidu/ERNIE-5.5-Flash-Base — Hugging Face model card](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base)
- [ERNIE 5.5 Flash Base Model License Agreement — Hugging Face](https://huggingface.co/baidu/ERNIE-5.5-Flash-Base/blob/main/LICENSE)
- [Baidu Unveils Latest ERNIE Models — Baidu press release (PR Newswire)](https://www.prnewswire.com/news-releases/baidu-unveils-latest-ernie-models-amid-broader-full-stack-ai-lineup-and-debuts-token-exchange-to-power-intelligent-organizations-302937959.html)
- [Three new ERNIE models on Baidu Qianfan — Baidu AI Cloud (in Chinese)](https://cloud.baidu.com/product/qianfan_home/model_3.html)
- [ERNIE 5.1 Officially Released — Baidu ERNIE official blog](https://ernie.baidu.com/research/posts/ernie-5.1-0508-release/)
- [ERNIE 5.0: A 2.4 Trillion-Parameter Unified Multimodal Foundation Model — Baidu ERNIE official blog](https://ernie.baidu.com/research/posts/ernie5.0/)
- [ERNIE-5.0 Tops LMArena Text Leaderboard — Baidu ERNIE official blog](https://ernie.baidu.com/research/posts/ernie-5.0-0110-release-on-lmarena/)
- [Announcing the Open Source Release of the ERNIE 4.5 Model Family — Baidu ERNIE official blog](https://ernie.baidu.com/research/posts/ernie4.5/)
- [ERNIE Research post list](https://ernie.baidu.com/research/)
- [baidu/Unlimited-OCR-2 — Hugging Face model card](https://huggingface.co/baidu/Unlimited-OCR-2)
- [Baidu models — Artificial Analysis](https://artificialanalysis.ai/models/creators/baidu)
- [tencent/Hy4 — Hugging Face model card (for Hy4's self-reported figures)](https://huggingface.co/tencent/Hy4)
- [Model card: ERNIE 5.5 Flash Base](/posts/daily/2026-11-09-model-baidu-ernie-5-5-flash-base-en) — this site
- [Model card: Baidu Unlimited OCR 2](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2-en) — this site
- [Tencent Hy family](/posts/tech/2026-11-23-ai-model-family-tencent-hy-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series introduction
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
