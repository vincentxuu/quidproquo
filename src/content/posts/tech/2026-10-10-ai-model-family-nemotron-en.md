---
title: "NVIDIA Nemotron Series: Open-Weight Reasoning and Multimodal Model Family"
date: 2026-10-10
category: tech
type: deep-dive
tags: [nvidia, nemotron, moe, open-weight, reasoning, multimodal, agentic]
lang: en
tldr: "NVIDIA Nemotron is an open-weight Mixture-of-Experts model family from NVIDIA covering Ultra (550B), Super (120B), Lightning (30B), and Nano (30B-A3B multimodal reasoning) variants. Latest versions offer 1M context, frontier reasoning, and multimodal capabilities, with free endpoints available on OpenRouter."
description: "Deep dive into the NVIDIA Nemotron series architecture evolution, version differences (Ultra/Super/Lightning/Nano), open licensing, reasoning and multimodal capabilities, and how to use the free endpoints on OpenRouter."
draft: true
---

> 🌏 [中文版](/posts/tech/2026-10-10-ai-model-family-nemotron)

[NVIDIA](https://www.nvidia.com/)’s **Nemotron** series is currently one of the most capable open-weight model families in terms of scale and reasoning depth. From **Nemotron-3 Ultra (550B)** to **Nemotron-3.5 Lightning (30B)**, plus the multimodal reasoning-focused **Nemotron-3 Nano Omni (30B-A3B)**, Nemotron spans the full spectrum from flagship reasoning to lightweight agents. These models are built on **Mixture-of-Experts (MoE)** and **hybrid Transformer-Mamba architectures**, and are offered as free models (`:free` suffix) on OpenRouter, allowing developers to directly access frontier reasoning capabilities.

---

## Family overview

| Version | OpenRouter free model ID | Parameters | Context | Core positioning | Trainer |
|---------|--------------------------|------------|---------|------------------|---------|
| **Nemotron-3 Ultra** | `nvidia/nemotron-3-ultra-550b-a55b:free` | 55B active / 550B total | 1M | Strongest reasoning & orchestration | **NVIDIA** |
| **Nemotron-3 Super** | `nvidia/nemotron-3-super-120b-a12b:free` | 12B active / 120B total | 262K | Complex multi-agent applications | **NVIDIA** |
| **Nemotron-3.5 Lightning** | `nvidia/nemotron-3.5-lightning:free` | 3B active / 30B total | 1M | High-throughput fast variant | **NVIDIA** |
| **Nemotron-3 Nano Omni** | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 30B-A3B | 256K | Multimodal sub-agent (text/image/video) | **NVIDIA** |
| **Nemotron-3.5 Content Safety** | `nvidia/nemotron-3.5-content-safety:free` | 4B | 128K | Content safety guardrail (multimodal) | **NVIDIA** |

> ⚠️ **Nemotron 3 series free endpoints** on OpenRouter with the `:free` suffix are **not legacy models made free**—they are NVIDIA’s latest flagship models released specifically to attract developer feedback and adoption. Free tier is subject to OpenRouter limits (20 RPM / daily quota 50–1000 RPD based on spend); exceeding requires payment or adding credits to raise quota.

---

## Architecture evolution: from Transformer to hybrid Transformer-Mamba

NVIDIA employs a **hybrid Transformer-Mamba architecture** in the Nemotron series, combining Transformer self-attention with Mamba’s state-space model (SSM) efficiency to enable scalable reasoning at extreme context lengths (1M tokens) and parameter counts (550B).

| Version | Architecture traits | Design focus |
|---------|---------------------|--------------|
| **Nemotron-3 Ultra** | Hybrid Transformer-Mamba MoE (55B active / 550B total) | Frontier reasoning, 1M context, frontier agent orchestration |
| **Nemotron-3 Super** | Hybrid Transformer-Mamba MoE (12B active / 120B total) | High efficiency in multi-agent settings, 120B params but only 12B active |
| **Nemotron-3.5 Lightning** | MoE (3B active / 30B total) | Extremely high throughput, ideal for large-scale batch processing |
| **Nemotron-3 Nano Omni** | Multimodal MoE (30B-A3B) | Accepts text, image, video input as a perception sub-agent in enterprise agent systems |
| **Nemotron-3.5 Content Safety** | Dense 4B model (fine-tuned from Gemma-3-4B) | Specialized multimodal guardrail for input/output moderation |

---

## Core capabilities

The model generates text and tool-call requests. The host application must provide tools, execute requests, return results, and manage state, audit logs, and concurrency. Workflow examples below describe applications built around the model; a standalone chat request does not execute those workflows.

### 1. Frontier reasoning
- **Nemotron-3 Ultra** is among NVIDIA’s strongest open reasoning models, designed for multi-step logical reasoning, mathematical proofs, and complex planning
- 1M context enables processing entire books, full research reports, or lengthy legal documents in one pass
- Supports tool use, external knowledge retrieval, and structured outputs

### 2. Agentic orchestration
- **Nemotron-3 Super (120B)** is purpose-built for multi-agent systems: capable of coordinating multiple sub-agents to complete complex tasks
- Supports multi-step tool chains: search → compute → verify → generate report
- Ideal for enterprise agent systems, intelligent customer service, and complex workflow automation

### 3. High-throughput fast inference
- **Nemotron-3.5 Lightning (30B)** delivers rapid responses with only 3B active parameters out of 30B total
- Suited for high-concurrency request scenarios: batch document processing, real-time analysis, RAG system core

### 4. Multimodal perception
- **Nemotron-3 Nano Omni** accepts text, image, and video inputs
- Designed as the **perception and context sub-agent** in enterprise agent systems: takes multimodal input and outputs structured understanding for the primary agent to reason upon
- Ideal for use cases requiring visual understanding: product inspection, medical image analysis, document scanning comprehension

### 5. Content safety guardrail
- **Nemotron-3.5 Content Safety** is a 4B-parameter multimodal guardrail model
- Fine-tuned from Google Gemma-3-4B, specifically designed to moderate both inputs and outputs (text and vision)
- Useful for building safe AI applications: automatic filtering of harmful content, ensuring compliant outputs

---

## Version comparison & selection guide

| Need | Recommended version | Free endpoint ID | Reason |
|------|---------------------|------------------|--------|
| Strongest reasoning + 1M context | Nemotron-3 Ultra | `nvidia/nemotron-3-ultra-550b-a55b:free` | 55B active, frontier reasoning |
| Multi-agent orchestration + 128K–262K context | Nemotron-3 Super | `nvidia/nemotron-3-super-120b-a12b:free` | 12B active, practical orchestration performance |
| High-throughput batch processing | Nemotron-3.5 Lightning | `nvidia/nemotron-3.5-lightning:free` | 3B active, extremely fast |
| Multimodal sub-agent + 256K context | Nemotron-3 Nano Omni | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | Text/image/video input |
| Content safety filtering | Nemotron-3.5 Content Safety | `nvidia/nemotron-3.5-content-safety:free` | Specialized guardrail |

---

## Ideal use cases

### ✅ Recommended

| Use case | Description |
|----------|-------------|
| **Complex multi-step reasoning** | Mathematical proofs, logical derivations, complex planning, predictive modeling |
| **Long-document analysis** | 1M context enables processing entire books, lengthy reports, or full legal evidence in one pass |
| **Multi-agent systems** | Enterprise-grade agent orchestration, intelligent customer service, complex workflow automation |
| **High-throughput batch processing** | Large-scale document cleaning, data extraction, report generation |
| **Multimodal perception** | Agent systems requiring visual understanding (product inspection, medical imaging, document scanning) |
| **Content safety filtering** | Building safe AI applications: automatic harmful content filtering, ensuring compliant output |

### ❌ Not recommended

| Use case | Reason |
|----------|--------|
| **Simple chat/customer service** | Overkill; better suited to lighter models (e.g., Nemotron-3.5 Lightning or Gemma 4) |
| **Real-time low-latency chat** | Ultra/Super inference times can be tens of seconds to minutes; Lightning is fast but still not as quick as dedicated speed-optimized models |
| **Pure creative writing** | Not a literary-creation-specialized model; style is practical and reasoning-oriented |
| **Local deployment on small GPU** | Ultra/Super require large GPU clusters (or multi-GPU); free endpoints are already hosted by NVIDIA |

---

## Deployment and access

### OpenRouter (free tier)
```python
import os
import openai
client = openai.OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1"
)
# Ultra
resp = client.chat.completions.create(
    model="nvidia/nemotron-3-ultra-550b-a55b:free",
    messages=[{"role":"user","content":"..."}]
)
# Super
resp = client.chat.completions.create(
    model="nvidia/nemotron-3-super-120b-a12b:free",
    messages=[{"role":"user","content":"..."}]
)
# Lightning
resp = client.chat.completions.create(
    model="nvidia/nemotron-3.5-lightning:free",
    messages=[{"role":"user","content":"..."}]
)
```
- Free tier subject to OpenRouter `:free` policies (20 RPM / 50–1000 RPD)
- For production access, check the current NVIDIA NIM terms and paid provider options; trial credits and eligibility can change.

### NVIDIA NIM (official platform)
- Check the current trial-credit allocation in your NVIDIA account.
- Check current rate limits in your NVIDIA account; limits can vary by service and account.
- Fullest model selection: Nemotron-3 Ultra, Super, Lightning, Nano, Content Safety all available
- Free credits are for development/prototyping, not for production SLAs
- Requires NVIDIA account and API key

### Open weights / local deployment
- NVIDIA provides open-weight downloads for some Nemotron models (model-dependent)
- Plan GPU resources from weight format, total model size, context length, and concurrency; consult the official deployment guide.
- Official recommendation: use **NVIDIA TensorRT-LLM** or **vLLM** for inference optimization

---

## Limitations and caveats

| Limitation | Note |
|------------|------|
| **Free endpoint volatility** | OpenRouter `:free` has queues, occasional 503s; validate with retreats before relying |
| **Inference latency can be high** | Ultra (550B) single requests can take tens of seconds to minutes; Lightning (30B) is faster but still not as fast as dedicated speed models |
| **Multimodal limitation** | Only Nano Omni supports image/video; Ultra/Super/Lightning are text-input only |
| **Privacy** | OpenRouter free endpoints may collect prompts by default; for sensitive data, use NVIDIA NIM paid endpoints or enable ZDR |
| **Resource intensity** | Local deployment of Ultra needs large GPU clusters; free endpoints are hosted by NVIDIA, so no self-hosting required |

---

## References

- [NVIDIA Nemotron 3 Ultra official](https://research.nvidia.com/labs/nemotron/Nemotron-3-Ultra/)
- [NVIDIA NIM model catalog](https://build.nvidia.com/)
- [OpenRouter Nemotron 3 Ultra](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free)
- [OpenRouter Nemotron 3 Super](https://openrouter.ai/nvidia/nemotron-3-super-120b-a12b:free)
- [OpenRouter Nemotron 3.5 Lightning](https://openrouter.ai/nvidia/nemotron-3.5-lightning:free)
- [OpenRouter Nemotron 3 Nano Omni](https://openrouter.ai/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free)
- [NVIDIA NIM pricing / rate limits](https://build.nvidia.com/)

---

## Related posts

- [OpenRouter: Unified API and multi-provider routing](/posts/ai/2026-08-22-openrouter-model-routing-en)
- [OpenCode and Zen Gateway](/posts/ai/2026-04-02-agent-cli-opencode-en)
- [LLM inference free-tier comparison (2026-05)](/posts/ai/2026-05-09-llm-inference-free-tier-comparison-en)
- [Apodex: Long-horizon research model](/posts/tech/2026-10-10-ai-model-family-apodex-en)
- [Liquid AI: Compact reasoning model](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en)
- [Dots Studio Dots: Open-weight MoE model family](/posts/tech/2026-10-10-ai-model-family-dots-studio-en)

---

*Last updated: 2026-10-10. Model specs, free-tier policies, and access options may change; always verify against official docs.*
