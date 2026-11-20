---
title: "The NVIDIA Nemotron Series: An Open-Weight Reasoning and Multimodal Family, with 3.5 Adding a Vision Super and Laptop-Class Bolt"
date: 2026-10-10
category: tech
type: deep-dive
tags: [nvidia, nemotron, moe, open-weight, reasoning, multimodal, agentic]
lang: en
tldr: "Nemotron is NVIDIA's open-weight model family, tiered by deployment target into Ultra, Super, Lightning, Nano, and Bolt, plus speech, retrieval, safety, and experimental Labs lines. The 3.5 generation (October 2026) replaces Super with Super VL, which reads images and video (120B / 12B active, 1M context), and compresses it into Bolt 74B-A9B, which fits in 24GB. Most new models move to the OpenMDW-1.1 license, but older models keep their own NVIDIA terms, so check each checkpoint."
description: "Choosing within NVIDIA Nemotron: the roles of 3.5 Super VL, Bolt, Lightning, Ultra, and Nano Omni; the Transcribe, Embed, Rerank, and Content Safety sub-lines; the experimental Labs model Dory; per-model licenses; and OpenRouter endpoints versus local deployment."
draft: false
series:
  name: "AI Model Families"
  order: 31
---

> 🌏 [繁體中文版](/posts/tech/2026-10-10-ai-model-family-nemotron)

**NVIDIA Nemotron** isn't one model but a set of open-weight models tiered by where they run: Ultra and Super for the datacenter, Lightning for always-on agents, Nano for sub-agents, and Bolt for laptops and devices — plus speech, retrieval, content safety, and Nemotron Labs for experimental architectures. This post is for developers choosing within Nemotron: what each tier solves, what changed in the 3.5 generation, and which license and endpoint differences matter.

The first step is to decide whether you need answer generation, audio-visual understanding, speech transcription, retrieval, or classification of inputs and outputs against a safety policy.

## Family positioning and model matrix

Compiled from the [NVIDIA Nemotron product page](https://developer.nvidia.com/topics/ai/nemotron), each HuggingFace model card, and the OpenRouter model list, checked on 2026-11-20. OpenRouter prices are third-party routing quotes per 1M tokens, not NVIDIA list prices:

| Model / line | Role | Key difference | License and access |
|---|---|---|---|
| Nemotron 3 Ultra 550B-A55B | Highest reasoning accuracy | 550B / 55B active, 1M official context | OpenMDW-1.1; OpenRouter $0.50/$2.20, plus a free route |
| **Nemotron 3.5 Super VL 120B-A12B** | Reasoning, tools, multimodal agents | Text/image/video input, 1M context, native MTP | OpenMDW-1.1; OpenRouter $0.15/$0.50, plus a free route |
| Nemotron 3.5 Lightning 30B-A3B | Specialized tasks for always-on agents | 30B / 3B active, 1M context | OpenMDW-1.1; OpenRouter $0.07/$0.20, plus a free route |
| Nemotron 3 Nano Omni 30B-A3B | Sub-agent for audio, video, image, and text understanding | 256K, text output | NVIDIA Open Model Agreement; OpenRouter free route |
| **Nemotron 3.5 Bolt 74B-A9B** | Everyday agents on laptops | Compressed from Super VL; the 24GB version uses 2-bit expert weights; 256K | OpenMDW-1.1; weights |
| **Nemotron 3.5 Bolt E4B** | On-device voice and assistant interfaces | Post-trained from Gemma-4-E4B-it, 8B (4B effective), 64K input and 64K output | OpenMDW-1.1, also bound by Gemma 4's Apache 2.0 terms |
| Nemotron 3.5 Transcribe 30B-A4B | Offline speech transcription and understanding | 40 languages, recordings up to 1 hour | OpenMDW-1.1; weights |
| Nemotron 3.5 Embed / Rerank / Parse | Retrieval and document extraction | Embed 1B / 8B, Rerank 8B | Per model card |
| Nemotron 3.5 Content Safety | Safety classification | 4B dense, 128K | OpenMDW-1.1 + Gemma terms; OpenRouter $0.20/$0.20 |
| Nemotron Labs (Dory, Sigma, etc.) | Experimental architectures | Dory is a 4B looped model | Dory under OpenMDW-1.1; Sigma under the Nemotron Open Model License |

### Separate model specs from API limits

On OpenRouter, Ultra's paid endpoint has a 262,144-token context while the free endpoint lists 1,000,000; the older Nemotron 3 Super's paid endpoint is also 262,144, while the official checkpoint supports 1M. Follow the endpoint you choose when calling the API, and don't write an endpoint limit up as the model's ceiling. "Listed in the catalog" and "inference succeeds right now" are also different evidence; this post did not call these endpoints.

## Family evolution

Compiled from the [nvidia HuggingFace organization](https://huggingface.co/nvidia); months come from repo creation times:

| Version | Date | What changed for selection | On this site |
|---|---|---|---|
| Nemotron 3 Nano 30B-A3B | 2025-12 | The 3 generation begins; the Mamba + Attention + MoE hybrid becomes the main line | — |
| Nemotron 3 Super 120B-A12B | 2026-03 | The workhorse for text reasoning and multi-agent use, adding LatentMoE and MTP | — |
| Nemotron 3 Nano Omni | 2026-04 | One model for audio, video, image, and text understanding | — |
| Nemotron 3.5 Content Safety | 2026-05 | Safety classification with custom policies, now under OpenMDW | — |
| Nemotron 3 Ultra 550B-A55B | 2026-06 | The family's largest model, for the highest reasoning accuracy | — |
| Nemotron 3.5 Lightning 30B-A3B | 2026-08 | The first 3.5 model, focused on efficiency for always-on agents | — |
| **Nemotron 3.5 Bolt / Transcribe / Embed** | 2026-10 | Adds laptop-class Bolt, speech transcription, and retrieval models | — |
| **Nemotron 3.5 Super VL** | 2026-10 | The Super tier becomes natively multimodal, with the license switched to OpenMDW-1.1 | — |
| Nemotron Labs Dory 1.0 | 2026-10-16 | Looped architecture; one set of weights can adjust compute at inference time | [Model card](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0-en) |

The 3.5 generation moves in two directions: the Super tier goes from text-only to reading images and video, and the new Bolt pushes the same capability down to laptops. Licensing also moves from per-model NVIDIA terms toward a common OpenMDW-1.1.

Nemotron 3 Super (text-only) is now the previous generation in this post; its specs and evaluation remain on its [HuggingFace model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16), and it still has a paid OpenRouter endpoint.

## Architecture and training trade-offs

### Super VL and Ultra: hybrid architecture, LatentMoE, and MTP

Ultra and Super combine Mamba-2, Attention, and MoE, using the **LatentMoE** expert design and **Multi-Token Prediction (MTP)**, which supports speculative decoding. The [Super VL model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16) adds a C-RADIO vision encoder and vision-language connector on top of that backbone, with reasoning settable to off, on (medium), or on. The BF16 deployment recommendation is 4× H100 or 2× GB200; for DGX Spark or fewer GPUs, NVIDIA points to the NVFP4 version. These designs target inference efficiency, but without the same hardware, input length, and concurrency settings, you can't conclude that a real service will be some multiple faster.

### Bolt 74B-A9B: a laptop version compressed from Super VL

Per the [Bolt 74B-A9B model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-BF16), it was compressed from Super VL using NVIDIA's Star Elastic method: a budget-conditioned router chooses expert counts and MoE widths per layer, expert top-K drops from the parent's 22 to 9, and the target is total memory under 24GB at batch size 1 and 128K context. That budget already accounts for later quantization (2-bit routed-expert weights, 16-bit SSM state, and so on), so architecture search and quantization are optimized together.

The BF16 version is mainly for fine-tuning and research; for actual inference, NVIDIA recommends the 24GB version with llama.cpp or vLLM. The cost is some score drops after 2-bit quantization — for example, on the official table AA-Omniscience non-hallucination changes from 56.14 for BF16 to 61.27, while accuracy falls from 21.80 to 16.90.

### Lightning: less active compute

3.5 Lightning is also a Mamba-2, MoE, and Attention hybrid. The official NVFP4 model card provides deployment paths for a single GPU and various hardware, and lists speculative decoding methods such as DSpark, MTP, and DFlash. Start evaluating it on always-on agents or sub-agent workflows, and still measure latency on your own requests and hardware.

### Nano Omni, Transcribe, and Content Safety: different jobs

Nano Omni uses vision and speech encoders beside the language backbone and outputs text, which suits meeting audio/video summaries, document understanding, and GUI workflows; it is not a video generation model. [Transcribe](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B) is a dedicated speech model: 34B total parameters (including the audio encoder), about 4.3B active, handling transcription, speaker attribution, speech translation, and audio QA.

Content Safety is fine-tuned from Google's **Gemma-3-4B-it**, a dense Transformer with a vision encoder. It takes a prompt, an optional image, an optional response, and a custom safety policy, and returns safety labels. It isn't another size of the MoE reasoning family, and it can't guarantee your application automatically complies with every policy.

### Labs: Dory's looped architecture

[Dory 1.0](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16) splits 36 layers into 8 input layers, a 20-layer shared recurrent block, and 8 output layers. At inference time the recurrent block can run 1, 2, or 4 times, trading compute for accuracy with the same weights; it also supports keeping only the last loop's KV cache, so memory doesn't grow with the loop count. It is an experimental Labs model, and vLLM support was still under review when this post was checked.

## Evaluation and alternatives

### Where Super VL lands

From the Super VL model card; NVIDIA's own runs:

| Benchmark | Nemotron 3.5 Super VL | Nemotron 3 Ultra | Qwen3.8-Flash-Next | GLM-5.3-Flash |
|---|---|---|---|---|
| GPQA Diamond | 89.52 | 87.0 | **92.7** | 91.2 |
| SWE-bench Verified | 71.10 | 73.9 | 78.7 | **79.10** |
| Terminal-Bench 2.1 | 60.67 | 54.80 | **85.80** | 82.70 |
| BrowseComp | 78 | 67.85 | **89.0** | 86.6 |
| AA-Omniscience hallucination rate (lower is better) | 30.0 | **22.1** | 41.3 | 30.3 |
| OSWorld-Verified | 51.14 | — | **55.8** | 14.78 |

How to read this table: in NVIDIA's own comparison, Super VL trails the contemporary Qwen3.8-Flash-Next and GLM-5.3-Flash clearly on coding and terminal tasks; its strengths are a lower hallucination rate and items such as long graph reasoning (GraphWalks 89.71). Its value lies in the combination of open weights, open training data, multimodality, and efficient deployment on NVIDIA hardware — not single scores.

### Where Bolt 74B-A9B lands

The Bolt model card compares it with models of similar memory footprint: the 24GB version scores 50.98 on Terminal-Bench 2.1, 66.75 on BrowseComp, and 86.43 on GPQA Diamond, all above Qwen3.6-35B-A3B (44.38, 48.74, 83.40) and Nemotron 3.5 Lightning. Also NVIDIA's own runs.

Official evaluations can set an evaluation direction but can't replace your own acceptance set; before comparing scores, confirm the tools, harness, reasoning budget, and precision format match.

For further comparison, see the [LongCat model family](/posts/tech/2026-10-10-ai-model-family-longcat-en), the [Cohere North model family](/posts/tech/2026-10-10-ai-model-family-cohere-north-en), the [Apodex model family](/posts/tech/2026-10-10-ai-model-family-apodex-en), the [Liquid AI model family](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en), and the [Dots model family](/posts/tech/2026-10-10-ai-model-family-dots-studio-en), comparing by task and deployment conditions.

## Licensing, pricing, and deployment

### Open weights don't mean one license for the whole family

Per each HuggingFace model card's license field:

| Model | License |
|---|---|
| 3 Ultra, 3.5 Super VL, 3.5 Lightning, 3.5 Bolt 74B-A9B, 3.5 Transcribe, Labs Dory | OpenMDW-1.1 |
| 3.5 Bolt E4B | OpenMDW-1.1, also bound by Gemma 4's Apache 2.0 terms |
| 3.5 Content Safety | OpenMDW-1.1, Gemma Terms of Use, and Gemma Prohibited Use Policy |
| 3 Super (text-only), text Nano, Labs Sigma | NVIDIA Nemotron Open Model License |
| 3 Nano Omni | NVIDIA Open Model Agreement |

Most new models use OpenMDW-1.1, but three NVIDIA licenses still coexist within the family. When downloading a checkpoint, read its own terms; model weights and NIM containers may also have different terms.

### Endpoints and pricing

NVIDIA offers API trials through NIM microservices and build.nvidia.com, and OpenRouter provides third-party routes. Route IDs from the OpenRouter model list on 2026-11-20:

| Model | Paid route (per 1M tokens) | Free route |
|---|---|---|
| Ultra | `nvidia/nemotron-3-ultra-550b-a55b` ($0.50/$2.20) | `:free` |
| Super VL | `nvidia/nemotron-3.5-super-vl` ($0.15/$0.50) | `:free` |
| Lightning | `nvidia/nemotron-3.5-lightning` ($0.07/$0.20) | `:free` |
| Nano Omni | — | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` |
| Content Safety | `nvidia/nemotron-3.5-content-safety` ($0.20/$0.20) | — |

Check current terms for free quotas, data-use policies, and service commitments; endpoints don't necessarily support the same `tools`, structured output, or modalities. Safety classification models in particular shouldn't be wired up with a generic agent tool-calling example.

Below is an example call to Super VL; set your own API key, and have your application handle rate limits, errors, and answer validation:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3.5-super-vl","messages":[{"role":"user","content":"Explain the assumptions in this technical proposal."}]}'
```

### Local deployment

Self-hosting requires planning for full weights, context cache, and concurrency memory. Bolt's 24GB version is currently the only model designed around "a single 24GB machine"; Super VL's BF16 version needs 4× H100, while the NVFP4 version lowers the bar. Treating active parameters as total memory needs will underestimate MoE deployment cost.

## Agent integration and selection

### Tool use and multi-agent roles

The model produces text and tool-call requests; the host program must provide tools, execute requests, return results, and manage state, permissions, audit logs, and concurrent work. Super VL's multi-agent positioning doesn't mean one chat call will spawn other agents by itself.

For a document-processing pipeline, for example, Nano Omni or Transcribe can read audio and video first, the host program can pass the text to Super VL for reasoning, and Content Safety can then classify against a specified policy. This is an application design suggestion; each stage's output, format, and error handling still need validation.

### Choosing and validating

| Need | Evaluate first | What to measure |
|---|---|---|
| Highest reasoning accuracy | Ultra | Accuracy on your tasks, cost to complete, reasoning budget |
| Multimodal agents, document and video understanding | Super VL | Chart and document extraction accuracy; token cost of reasoning modes |
| Local agents on a laptop | Bolt 74B-A9B 24GB | Quality loss of the 24GB quantized version on your tasks |
| On-device voice assistants | Bolt E4B | Time to first token and multi-turn tool-call stability |
| Always-on agents, many sub-agents | Lightning | Real hardware memory, concurrency, and latency |
| Meeting and recording transcription | Transcribe | Error rate on your languages and accents |
| Custom content safety policy | Content Safety | False positives, false negatives, policy coverage, and label format |

Nemotron's value lies in its range of task roles, open training data, and deployment paths. Picking the model that fits the task and then checking endpoints and licenses is more practical than treating the largest model as the answer to everything.

## Limitations and trade-offs

- **All evaluations are NVIDIA's own**, and on its own table Super VL trails contemporary open models on coding items.
- **Licenses must be checked per checkpoint**: three NVIDIA licenses and OpenMDW-1.1 coexist, and some models add Gemma terms on top.
- **Quantization has a cost**: some of Bolt 24GB's scores are below the BF16 version's.
- **Labs models are experimental**: Dory's inference framework support hasn't been formally released.
- **OpenRouter prices are third-party quotes**, not NVIDIA service commitments.

## Update history

- **2026-11-20**: Added the 3.5 generation. The matrix, architecture, evaluation, licensing, endpoints, and selection were rewritten (NVIDIA Nemotron product page, HuggingFace model cards and license fields for Super VL, Bolt, Transcribe, Dory, and others, and the OpenRouter model list, read 2026-11-20); added Super VL, Bolt 74B-A9B and E4B, Transcribe, retrieval models, and the Labs line, along with how Bolt is compressed from Super VL. The family evolution section previously said a full release timeline had not been compiled; it now covers 3 Nano through 3.5 Super VL. Nemotron 3 Super (text-only) is now the previous generation, and the example now calls Super VL. The license table adds Ultra (previously unlisted) as OpenMDW-1.1. OpenRouter routes now reflect the 2026-11-20 list; the earlier note that the Nano Omni endpoint showed an abnormal service status no longer matches the current state, so the table lists only routes and prices.
- 2026-10-11: Reorganized sections to the shared family format and added a model matrix from existing data; fact-check dates carried over from earlier records.
- 2026-10-11: Checked official model cards and endpoints, separated Super's model and API context, added Nano Omni audio and parameter notes, corrected per-model licenses and free-route availability, and published the draft.

## References

- [NVIDIA Nemotron product page](https://developer.nvidia.com/topics/ai/nemotron)
- [Nemotron 3.5 Super VL official model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Super-VL-120B-A12B-BF16)
- [Nemotron 3.5 Bolt 74B-A9B official model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-74B-A9B-BF16)
- [Nemotron 3.5 Bolt E4B official model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Bolt-E4B-BF16)
- [Nemotron 3.5 Transcribe official model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Transcribe-30B-A4B)
- [Nemotron Labs Dory 1.0 official model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-Labs-Dory1.0-4B-BF16)
- [NVIDIA Nemotron 3 Ultra official overview](https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/)
- [Nemotron 3 Super official model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16)
- [Nemotron 3 Nano official model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16)
- [Nemotron 3.5 Lightning official model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4)
- [Nemotron 3 Nano Omni official model card](https://huggingface.co/nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16)
- [Nemotron 3.5 Content Safety official model card](https://huggingface.co/nvidia/Nemotron-3.5-Content-Safety)
- [OpenMDW License 1.1](https://openmdw.ai/license/1-1/)
- [NVIDIA Nemotron Open Model License](https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-nemotron-open-model-license/)
- [OpenRouter model list API](https://openrouter.ai/api/v1/models)
- [Model card: NVIDIA Nemotron Labs Dory 1.0](/posts/daily/2026-10-19-model-nvidia-nemotron-dory-1-0-en) — this site
