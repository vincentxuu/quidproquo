---
title: "NVIDIA Nemotron Series: Open-Weight Reasoning and Multimodal Model Family"
date: 2026-10-10
category: tech
type: deep-dive
tags: [nvidia, nemotron, moe, open-weight, reasoning, multimodal, agentic]
lang: en
tldr: "Nemotron covers text reasoning, multimodal understanding, and safety classification. Ultra, Super, Lightning, Nano Omni, and Content Safety differ in architecture, context, and licensing; model specifications and API limits must be checked separately."
description: "NVIDIA Nemotron guide: hybrid MoE, Nano Omni audio and vision, Content Safety, variant licenses, free endpoints, and self-hosting tradeoffs."
draft: false
series:
  name: "AI Model Families"
  order: 31
---

> 🌏 [中文版](/posts/tech/2026-10-10-ai-model-family-nemotron)

**NVIDIA Nemotron** includes text reasoning, multimodal understanding, and content-safety models. Ultra, Super, Lightning, Nano Omni, and Content Safety have distinct roles, architectures, and licensing terms. Begin selection by deciding whether the task requires generating an answer, understanding audiovisual input, or classifying content against a safety policy.

## Family positioning and model matrix

| Model / product line | Positioning | Key differences | Access |
|---|---|---|---|
| Nemotron 3 Ultra | Large text reasoning | 550B / 55B; official 1M | Official model information; free OpenRouter route |
| Nemotron 3 Super | Text reasoning and multi-agent use | 120B / 12B; official 1M, free endpoint 262,144 | Open weights; free OpenRouter route |
| Nemotron 3.5 Lightning | Local inference | 30B / 3B; official 1M | OpenMDW-1.1 weights; free route |
| Nemotron 3 Nano Omni | Audio, video, image, and text understanding | 31B / about 3B; 256K; text output | NVIDIA Open Model Agreement; verify free-route status |
| Nemotron 3.5 Content Safety | Safety classification | 4B dense; 128K | OpenMDW-1.1 and Gemma terms; free route |

### Family overview: separate model and API limits

The following comes from NVIDIA's official cards and OpenRouter endpoint data, checked on October 11, 2026.

| Model | Official total / active parameters | Official context | OpenRouter free route context | Role |
|---|---|---|---|---|
| Nemotron 3 Ultra | 550B / 55B | 1M | 1,000,000 | Large text reasoning |
| Nemotron 3 Super | 120B / 12B | 1M | 262,144 | Text reasoning, tools, and multi-agent applications |
| Nemotron 3.5 Lightning | 30B / 3B | 1M | 1,000,000 | Efficiency and local inference |
| Nemotron 3 Nano Omni | Card lists 31B / about 3B; name retains 30B-A3B | 256K | 256,000 | Text, image, audio, and video understanding |
| Nemotron 3.5 Content Safety | 4B, dense model | 128K | 128,000 | Text and single-image safety classification |

Super can support 1M context as a model while its free API route permits about 262K. A provider limit is not the model's training limit; actual calls must respect the chosen endpoint.

Nano Omni's official card includes audio input. Its 31B specification also needs to be distinguished from the 30B-A3B route name, which is not a precise parameter count.

## Family evolution

This article organizes the 3 and 3.5 variants by task rather than compiling a complete release timeline: Ultra and Super for text reasoning, Lightning for local inference, Nano Omni for multimodal understanding, and Content Safety for classification. These roles do not form a single upgrade ladder.

## Architecture and training trade-offs

### Architectural differences

#### Ultra and Super: hybrid architecture, LatentMoE, and MTP

Ultra and Super combine Mamba, Attention, and MoE. Their official descriptions also include **LatentMoE** and **Multi-Token Prediction (MTP)**. The former is an expert architecture design; the latter supports speculative decoding. These target inference efficiency, but do not establish a universal speed multiplier across different hardware, input lengths, and concurrency settings.

#### Lightning: less active computation

3.5 Lightning also combines Mamba-2, MoE, and Attention. Its official NVFP4 card provides single-GPU and other hardware deployment recipes, alongside DSpark, MTP, and DFlash speculative decoding methods. It is a candidate for local agents or sub-agent workflows; measure latency on your own hardware and requests.

#### Nano Omni and Content Safety: distinct tasks

Nano Omni adds vision and speech encoders to a language-model backbone and produces text. Its applications include meeting summaries, document understanding, and GUI workflows. It is not a video-generation model.

Content Safety is fine-tuned from Google's **Gemma-3-4B-it**, using a dense Transformer and vision encoder. It accepts a prompt, optional image, optional response, and optional custom policy, then returns safety labels. It is not another size of the MoE reasoning architecture and cannot guarantee compliance with every application policy.

## Evaluation and alternatives

Official benchmarks help define an evaluation direction, but cannot replace your acceptance set. NVIDIA cards provide settings and some reproducibility recipes. Check tools, harnesses, reasoning budgets, and precision formats before comparing scores.

The cited material does not supply comparable results with aligned model versions, benchmarks, harnesses, tool permissions, and inference budgets in this article. Product positioning and parameter counts do not establish a ranking; use the task checks below to compare candidates.

For related selection questions, compare [LongCat family](/posts/tech/2026-10-10-ai-model-family-longcat-en), [Cohere North family](/posts/tech/2026-10-10-ai-model-family-cohere-north-en), [Apodex family](/posts/tech/2026-10-10-ai-model-family-apodex-en), [Liquid AI family](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en), [Dots family](/posts/tech/2026-10-10-ai-model-family-dots-studio-en).

## Licensing, pricing, and deployment

### Open weights do not imply one family-wide license

| Model | Terms listed by its official card |
|---|---|
| Nemotron 3 Super / text Nano | NVIDIA Nemotron Open Model License |
| Nemotron 3.5 Lightning | OpenMDW-1.1 |
| Nemotron 3 Nano Omni | NVIDIA Open Model Agreement |
| Nemotron 3.5 Content Safety | OpenMDW-1.1, Gemma Terms of Use, and Gemma Prohibited Use Policy |

Read the terms for the exact checkpoint being downloaded. Model weights and NIM containers may also have different terms: the Super card lists model and NIM software terms separately. A family-wide open label cannot replace this check.

### OpenRouter routes and an example

The endpoint data lists these free routes. Catalog presence and successful live inference are separate evidence; no model inference call was made for this article.

| Model | Full route ID |
|---|---|
| Ultra | `nvidia/nemotron-3-ultra-550b-a55b:free` |
| Super | `nvidia/nemotron-3-super-120b-a12b:free` |
| Lightning | `nvidia/nemotron-3.5-lightning:free` |
| Nano Omni | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` |
| Content Safety | `nvidia/nemotron-3.5-content-safety:free` |

Nano Omni's endpoint reported an abnormal service status during this check, so its free route cannot be promised available at that moment. Recheck provider status before use, along with current quotas, data-use policies, and service commitments.

This example calls Super. Supply your own API key and handle rate limits, errors, and answer validation in the application:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"model":"nvidia/nemotron-3-super-120b-a12b:free","messages":[{"role":"user","content":"Explain the assumptions in this technical proposal."}]}'
```

Supported tools, structured output, and modalities differ across endpoints. A safety classifier should not automatically receive the same tool-calling configuration as a general-purpose agent.

## Agent integration and selection

### Tool use and multi-agent responsibilities

The model generates text and tool-call requests. The host provides tools, executes requests, returns results, and manages state, permissions, audit logs, and concurrency. Super's multi-agent positioning does not mean a single chat call launches other agents by itself.

For document processing, an application could use Nano Omni to understand recordings or scans, pass its text to Super for reasoning, then use Content Safety for policy classification. This is an application design suggestion; every stage still needs output validation, formatting, and error handling.

### Selection and validation

| Need | Starting candidate | What to measure |
|---|---|---|
| Complex text reasoning | Ultra / Super | Task accuracy, completion cost, and reasoning budget |
| Local or numerous sub-agent jobs | Lightning | Hardware memory, concurrency, and latency |
| Document and audiovisual understanding | Nano Omni | Input formats, length limits, transcription, and charts |
| Custom content-safety policy | Content Safety | False positives, misses, policy coverage, and label format |

Nemotron offers multiple task roles and deployment paths. Choose a suitable variant, then verify its endpoint and license before adopting it across a workflow.

## Limitations and trade-offs

Self-hosting also requires planning for full weights, context caches, and concurrent memory. Quantized weights may reduce memory needs, but use the corresponding card and hardware recipe. Treating active parameters as total memory requirements underestimates MoE deployment costs.

## Update history

- 2026-10-11: Reorganized the article into the common family structure and added a model matrix using existing material; factual verification dates remain unchanged.
- 2026-10-11: Checked official cards and endpoints; separated Super model and API context, added Nano Omni audio and parameter details, corrected variant licenses and free-route availability, and published the draft.

## References

- [Official NVIDIA Nemotron 3 Ultra introduction](https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/)
- [Official Nemotron 3 Super model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-BF16)
- [Official Nemotron 3 Nano model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B-BF16)
- [Official Nemotron 3.5 Lightning model card](https://huggingface.co/nvidia/NVIDIA-Nemotron-3.5-Lightning-30B-A3B-NVFP4)
- [Official Nemotron 3 Nano Omni model card](https://huggingface.co/nvidia/Nemotron-3-Nano-Omni-30B-A3B-Reasoning-BF16)
- [Official Nemotron 3.5 Content Safety model card](https://huggingface.co/nvidia/Nemotron-3.5-Content-Safety)
- [NVIDIA Nemotron Open Model License](https://www.nvidia.com/en-us/agreements/enterprise-software/nvidia-nemotron-open-model-license/)
- [OpenRouter Super endpoint data](https://openrouter.ai/api/v1/models/nvidia/nemotron-3-super-120b-a12b:free/endpoints)
- [OpenRouter Nano Omni endpoint data](https://openrouter.ai/api/v1/models/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free/endpoints)
