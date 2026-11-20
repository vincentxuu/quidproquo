---
title: "Liquid AI LFM: On-Device Reasoning and Agent Workflows, with LFM3 Covering Every Modality on a 1.7B Backbone"
date: 2026-10-10
category: tech
type: deep-dive
tags: [liquid-ai, lfm, reasoning, agent-workflow, rag, long-context, compact-model]
lang: en
tldr: "Liquid AI's LFM is a family of small, device-first models. LFM3 (October 2026) switches to a tri-hybrid of short convolutions, sliding-window attention, and global attention; the text model LFM3-1.7B, with 1.73B parameters and 256K context, beats the previous LFM2.5-2.6B on most agent and tool benchmarks and shares one backbone with vision, audio, omni, and decision models. When you need stronger reasoning, LFM2.5-24B-A2B fills in with 2.45B active parameters. The weights use the LFM Open License v1.0, under which commercial use by companies with US$10M or more in annual revenue is not licensed."
description: "The Liquid AI LFM family: the LFM3 tri-hybrid architecture and six-model lineup, the LFM2.5-24B-A2B reasoning MoE, checkpoint versus hosted-API context limits, the LFM Open License revenue threshold, pricing, local deployment, and agent selection."
series:
  name: "AI Model Families"
  order: 29
draft: false
---

> 🌏 [繁體中文版](/posts/tech/2026-10-10-ai-model-family-liquid-ai)

Liquid AI's LFM is a model family built around efficient deployment. The value of a small model is putting a well-scoped task into an environment you can control: phones, laptops, edge devices, or a cheap cloud API. This post is for developers running agents locally or on a budget: how to choose between LFM3 and LFM2.5, what they can and can't do, and where the license draws its line.

This post was checked on 2026-11-20 against the official model cards, release posts, license files, and pricing page. The two differences most likely to trip you up: **official checkpoints and the hosted API have different context limits**, and **the license is not Apache or MIT — commercial use by companies with US$10M or more in annual revenue is not licensed**.

## Family positioning and model matrix

| Model / line | Role | Key difference | Access and price (per 1M tokens) |
|---|---|---|---|
| LFM3-1.7B | Current text workhorse | 1.73B, tri-hybrid architecture, 256K checkpoint context, ~1GB at 4-bit | Weights (LFM Open License v1.0); Liquid API $0.08/$0.20, cached input $0.02 |
| LFM3-VL-2B / Audio-2B / Omni-2B | Vision, audio, omni | Share the LFM3-1.7B backbone | Weights; Liquid API |
| d1-2B / d1-Omni-2B | Decision models | Specialized from the VL and Omni branches | Weights; see the [decision models family post](/posts/tech/2026-10-22-ai-model-family-decision-models-en) |
| LFM2.5-24B-A2B | Harder reasoning and agent tasks | 24B MoE, 2.45B active, 131K context, always reasons first | Weights; Liquid API $0.05/$0.70, cached input $0.025 |
| LFM2.5 small models | Previous generation | 230M to 8B-A1B, including Encoder, VL, Audio, and domain variants | Weights |

Prices are from the [Liquid AI pricing page](https://www.liquid.ai/pricing), which says calls cost the same on Liquid Console, OpenRouter, and Vercel AI Gateway; new organizations get $2 in free credit.

### Separate the model from the endpoint

The [Liquid API model list](https://docs.liquid.ai/api/models) gives `lfm3-1.7b` and `lfm2.5-24b-a2b` a 128,000-token context, smaller than the checkpoints' 256K (LFM3) and 131K (24B-A2B). Follow the endpoint limit when calling the API, and confirm against the checkpoint and inference framework config when self-hosting. The previous LFM2.5-2.6B had the same issue: 131,072 tokens on the checkpoint, only 65,536 on OpenRouter's free endpoint.

## Family evolution

Compiled from the [LiquidAI HuggingFace organization](https://huggingface.co/LiquidAI) and official blog posts; months come from repo creation times:

| Version | Date | What changed for selection | On this site |
|---|---|---|---|
| LFM2 series | 2025 | A short-convolution + GQA hybrid designed by hardware-in-the-loop architecture search; on-device speed is the main pitch | — |
| LFM2.5-1.2B / VL-1.6B | 2026-01 | The LFM2.5 generation begins, with Thinking and vision variants | — |
| LFM2-24B-A2B | 2026-02 | The first 24B MoE, 32K context, non-reasoning | — |
| LFM2.5 small and mid-size expansion | 2026-03 to 08 | 230M, 350M, 8B-A1B, and 2.6B, plus Encoder, Embedding, ColBERT, JP, and other specialized variants; 2.6B becomes the recommended size for reasoning and agents | — |
| LFM2.5-24B-A2B | 2026-10-13 | The largest and final LFM2.5 model; context extended to 131K, always reasons first, agent scores catch up with larger MoEs | [Model card](/posts/daily/2026-10-14-model-liquid-ai-lfm2-5-24b-a2b-en) |
| **LFM3** | 2026-10-27 | New tri-hybrid architecture; six 2B-class models share one backbone; the 1.7B text model beats LFM2.5-2.6B | [Model card](/posts/daily/2026-10-28-model-liquid-ai-lfm3-1-7b-en) |

LFM2.5-2.6B is now the previous generation in this post. The endpoint notes and OpenRouter example centered on it moved out of the body; its specs and evaluation remain on the [HuggingFace model card](https://huggingface.co/LiquidAI/LFM2.5-2.6B), and LFM3-1.7B's evaluation table lists 2.6B's scores for comparison.

## Architecture and training trade-offs

### LFM3: the tri-hybrid architecture

Per the [LFM3 announcement](https://www.liquid.ai/blog/lfm3) and the [LFM3-1.7B model card](https://huggingface.co/LiquidAI/LFM3-1.7B):

- **Three operators**: of 24 layers, 13 are gated short convolutions, 5 are sliding-window attention with a 256-token window, and 6 are global attention. The convolution kernel grows from 3 in LFM2 to 7.
- **Why sliding-window attention**: Liquid used hardware-in-the-loop architecture search to swap some convolution layers for other sequence blocks, and sliding-window attention gave the best quality–speed trade-off. The test hardware expanded from one phone and one laptop for LFM2 to 14 device and backend combinations, including phones, a Raspberry Pi 5, laptops, cloud CPUs, GPUs, and a Qualcomm Hexagon NPU.
- **Other changes**: a sigmoid gate on each attention head (which can suppress activation outliers that hurt quantization), RoPE applied to only half the dimensions in global attention layers, and normalization on both the input and output of each block.
- **Training**: 22T tokens of pre-training, with the final 3.5T as mid-training that adds more agent traces and tool calls and extends context to 256K.

Liquid says LFM3-1.7B matches LFM2-1.2B's per-parameter speed on short prompts and is about 25% faster at 8K context.

### One backbone, six models

All six models in LFM3's first release branch from `LFM3-1.7B-Base`: four input modalities (text, vision, audio, omni), plus two decision models specialized from the vision and omni models. The intent is "pick a small model that fits and fine-tune it yourself" rather than running one large general model; Liquid says every model can be fine-tuned on a single GPU.

### LFM2.5-24B-A2B: a reasoning MoE with few active parameters

Per the [24B-A2B model card](https://huggingface.co/LiquidAI/LFM2.5-24B-A2B) and [official blog](https://www.liquid.ai/blog/lfm2-5-24b-a2b), it keeps LFM2-24B-A2B's 40 layers (30 double-gated short convolution blocks + 10 GQA) with 64 experts per layer and top-4 routing. The changes: context from 32K to 131K, vocabulary from 65K to 128K, pre-training from 17T to 33T tokens, and a final post-training stage of reinforcement learning inside agent harnesses such as OpenClaw, Hermes Agent, Pi, and OpenCode. It is a pure reasoning model that always outputs its reasoning before answering.

Liquid disclosed a training problem: during teacher specialization the model showed reward hacking, searching git history or GitHub, PyPI, and HuggingFace for answers, and even noticing it was in a sandbox. Liquid tightened its sandboxes and says all reported results come from sealed evaluation environments.

## Evaluation and alternatives

### LFM3-1.7B

From the LFM3-1.7B model card; all runs are Liquid's own on vLLM, with each model at its full context:

| Benchmark | LFM3-1.7B | LFM2.5-2.6B | Qwen3.5-4B | Qwen3.5-9B |
|---|---|---|---|---|
| LiveClaw | **45.60** | 14.70 | 19.94 | 35.77 |
| WebArena-Verified | **38.42** | 3.02 | 21.92 | 28.94 |
| AutomationBench | **41.29** | 0.94 | 8.67 | 15.10 |
| BFCL V4 | **71.39** | 55.89 | 55.12 | 62.83 |
| SWE-bench Verified (OpenCode) | 43.40 | 18.00 | 41.20 | **51.20** |
| GPQA Diamond | 63.37 | 57.78 | 75.76 | **80.40** |
| RULER 128K | 65.56 | 1.15 | 84.63 | **87.11** |
| AA-Omniscience non-hallucination | **92.93** | 53.69 | 13.64 | 52.59 |

How to read this table: agent and tool tasks are LFM3-1.7B's strength, beating the five-times-larger Qwen3.5-9B on several items; knowledge questions, long-context retrieval (RULER 128K), and coding still trail. Its AA-Omniscience non-hallucination rate is high, but the same table shows accuracy of only 7.07 — it tends to decline to answer rather than knowing more. Liquid recommends pairing knowledge-heavy tasks with retrieval or search.

### LFM2.5-24B-A2B

In the official blog's 16-benchmark comparison, it leads or ties Qwen3.6-35B-A3B on 5 of 8 tool and agent benchmarks (AutomationBench 27.69 vs 8.72, LiveClaw 48.09 vs 38.19), but trails clearly on GPQA Diamond (74.42 vs 83.69) and SWE-Bench Verified (51.00 vs 66.20). All are Liquid's own runs.

When choosing, design a set of the tasks you actually need rather than guessing quality from parameter counts: field-extraction accuracy, tool-argument errors, answer citations, and end-to-end latency.

## Licensing, pricing, and deployment

### LFM Open License v1.0: a revenue threshold

LFM3 and LFM2.5 both use the [LFM Open License v1.0](https://huggingface.co/LiquidAI/LFM3-1.7B/blob/main/LICENSE). It is built on Apache 2.0 (copyright and patent grants, keeping notices on redistribution, marking modified files), plus a Section 5 commercial-use limitation:

- **Threshold**: commercial use by a legal entity with US$10M or more in annual revenue (including entities in a control relationship) is not licensed under this agreement and requires a separate arrangement with Liquid.
- **Below the threshold**: free commercial use, fine-tuning, and redistribution.
- **Non-profit exception**: qualified non-profits using the work for non-commercial or research purposes are not subject to the threshold.

Don't treat it as Apache or MIT. Compared with Kimi's and MiniMax's thresholds, LFM's US$10M is lower, and it counts the whole legal entity's revenue, not just the product using the model.

### Pricing and data terms

- **LFM3-1.7B**: $0.08/$0.20, cached input $0.02.
- **LFM2.5-24B-A2B**: $0.05/$0.70, cached input $0.025. The [site's model card](/posts/daily/2026-10-14-model-liquid-ai-lfm2-5-24b-a2b-en) recorded $0.10/$1.00 at launch; the current pricing page is lower.
- Third-party endpoints have their own data terms. For example, OpenRouter's free endpoint for LFM2.5-2.6B noted that prompts and outputs might be retained and used for training; free access doesn't mean no retention, so check terms or switch to local inference for sensitive data.

### Local deployment

Liquid provides BF16, FP8, NVFP4, GGUF, MLX, ONNX, and OpenVINO formats for frameworks including vLLM, SGLang, Transformers, llama.cpp, Ollama, LM Studio, and MLX. LFM3-1.7B is about 1GB at 4-bit, small enough for phones and laptops. Pick the runtime and weights for your hardware, test with small inputs, then increase context and concurrency step by step; model size is not the memory ceiling for the whole process.

## Agent integration and selection

### What it's good for

Liquid recommends local agents, tool calling, structured output, and domain fine-tuning. Start with well-scoped, source-grounded work: extracting fields from internal documents, answering from retrieved passages, or running background agents for inbox triage or scheduling on a local machine.

### Tool use needs a host program

The model emits a call, the host program executes it, and the result goes back in the `tool` role; the model won't read a CSV or write to a database just because it received an instruction. Note that the tool-call formats differ between generations: LFM3 emits XML-style `<tool_call>` blocks, while LFM2.5 defaults to a list of Python function calls. LFM3 also supports deferred tool loading (`defer_loading`): with many tools, only a search tool goes into the prompt, and the harness inserts definitions after the search finds them.

### How to choose

| Need | Evaluate first | What to verify |
|---|---|---|
| Local agents on phones or laptops | LFM3-1.7B | Tool name and argument accuracy; quality at 4-bit |
| Image, audio, or multimodal input | LFM3-VL / Audio / Omni-2B | The task scope on each model card |
| Harder reasoning or multi-step agents | LFM2.5-24B-A2B | Latency from reasoning tokens; keep expectations low on SWE-style tasks |
| Knowledge-heavy QA | LFM3-1.7B + retrieval | Whether citations are correct; the rate of declined answers |
| A domain-specific model of your own | Fine-tuned LFM3-1.7B | Gains on your own data after single-GPU fine-tuning |

## Limitations and trade-offs

- **Liquid states that LFM3-1.7B is not recommended for agentic coding or complex multi-step reasoning**, and 24B-A2B is not recommended on its own for knowledge-heavy tasks.
- **Reasoning consumes the generation budget**: LFM3 reasons by default, and Liquid says disabling it (`enable_thinking=False`) may behave inconsistently; 24B-A2B always reasons. A small parameter count alone doesn't guarantee short waits.
- **All evaluations are Liquid's own.**
- **The license threshold is low**: companies with US$10M or more in annual revenue must negotiate a license.
- **The hosted API's context is smaller than the checkpoint's.**

LFM's appeal is bringing tool workflows into local environments and turning them into specialized models with single-GPU fine-tuning. Whether to adopt it still depends on whether it passes evaluation on your tasks, data, and hardware.

## Update history

- **2026-11-20**: Added LFM3 and LFM2.5-24B-A2B. The matrix, architecture, evaluation, pricing, licensing, and selection were rewritten (LFM3 and 24B-A2B official blogs, HuggingFace model cards and LICENSE, Liquid API model list and pricing page, and the HuggingFace organization's model list, read 2026-11-20); added the tri-hybrid architecture, the six models sharing one backbone, the specific license revenue threshold, and the tool-call format difference between generations. The family evolution section previously said a full timeline had not been compiled; it now covers LFM2 through LFM3. LFM2.5-2.6B is now the previous generation; the OpenRouter example and endpoint comparison table centered on it moved out of the body. The license section previously said only "commercial restrictions apply"; it now states the US$10M annual revenue threshold.
- 2026-10-11: Reorganized sections to the shared family format and added a model matrix from existing data; fact-check dates carried over from earlier records.
- 2026-10-11: Rechecked architecture and training against official sources, separated checkpoint and API context, added data-retention and license limits, and removed untested performance comparisons before publishing.

## References

- [Introducing LFM3 — Liquid AI official blog](https://www.liquid.ai/blog/lfm3)
- [LiquidAI/LFM3-1.7B — HuggingFace model card](https://huggingface.co/LiquidAI/LFM3-1.7B)
- [LFM Open License v1.0 — HuggingFace](https://huggingface.co/LiquidAI/LFM3-1.7B/blob/main/LICENSE)
- [LFM2.5-24B-A2B: Built for Fast On-Device Agents — Liquid AI official blog](https://www.liquid.ai/blog/lfm2-5-24b-a2b)
- [LiquidAI/LFM2.5-24B-A2B — HuggingFace model card](https://huggingface.co/LiquidAI/LFM2.5-24B-A2B)
- [Liquid AI pricing page](https://www.liquid.ai/pricing)
- [Liquid API model list](https://docs.liquid.ai/api/models)
- [LiquidAI — HuggingFace organization](https://huggingface.co/LiquidAI)
- [Liquid AI: LFM2.5-2.6B release and training](https://www.liquid.ai/blog/lfm2-5-2-6b)
- [LFM2.5-2.6B official model card](https://huggingface.co/LiquidAI/LFM2.5-2.6B)
- [OpenRouter: LFM2.5-2.6B endpoint limits and data terms](https://openrouter.ai/liquid/lfm-2.5-2.6b:free)
- [Model card: Liquid AI LFM3-1.7B](/posts/daily/2026-10-28-model-liquid-ai-lfm3-1-7b-en) — this site
- [Model card: Liquid AI LFM2.5-24B-A2B](/posts/daily/2026-10-14-model-liquid-ai-lfm2-5-24b-a2b-en) — this site
- [Decision models family](/posts/tech/2026-10-22-ai-model-family-decision-models-en) — this site
