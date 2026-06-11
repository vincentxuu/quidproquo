---
title: "2026 Q1 Open-Source LLM Landscape: From Frontier Models to On-Device, a Complete Survey"
date: 2026-03-31
type: project
category: ai
tags: [open-source, llm, glm-5, kimi, deepseek, qwen, llama, gemma, mistral, minimax, phi, smollm, gpt-oss, moe, on-device-ai, embedding, reranker, tts, stt, image-generation, video-generation, code-model, ollama, vllm]
lang: en
tldr: "2026 Q1 saw a full-blown open-source model explosion: on the LLM front, GLM-5, Kimi K2.5, and Qwen3.5 caught up with closed-source models; Embedding and Reranker are dominated by Qwen3 and BGE; speech has Voxtral TTS and Whisper V3; image has FLUX.2; and video has Wan 2.2 rivaling Sora. This is the complete navigation map."
description: "A comprehensive survey of the 2026 Q1 open-source model ecosystem: frontier LLMs, mid-tier models, mobile small models, Embedding, Reranker, code models, speech (STT/TTS), image generation, video generation, inference engines and deployment options, with links to dedicated articles and a Q1 release timeline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-31-open-source-llm-landscape)

The pace of open-source LLM progress in Q1 2026 is too fast for any single article to cover completely. In Q1 alone, over 15 major models were released -- frontier-tier MoE models broke through 1T parameters, mid-tier efficiency improved dramatically (Qwen3.5-35B achieves better performance than the previous-gen 235B flagship with only 3B active parameters), and mobile small models were compressed down to 140M for on-device inference.

This article is a navigation map. For each category, I'll lay out the current landscape and key metrics, with details linked to dedicated articles -- those cover the full technical architecture, benchmark comparisons, and hands-on experience.

## 2026 Q1 Open-Source Model Release Timeline

Let's start with the big picture. Here are the major open-source model releases from January to March 2026:

| Date | Model | Developer | Highlights |
| ---- | ----- | --------- | ---------- |
| 01/15 | InternLM3-8B | Shanghai AI Lab | 8B, 4x data efficiency vs Llama 3.1 |
| 01/27 | Kimi K2.5 | Moonshot AI | 1T/32B MoE, Agent Swarm, MIT |
| 02/11 | GLM-5 | Zhipu AI | 745B/44B MoE, MIT, #1 open-source |
| 02/11 | MiniMax-M2.5 | MiniMax | 230B/10B MoE, SWE-bench 80.2% |
| 02/16 | Qwen3.5-397B | Alibaba | 397B/17B MoE, native multimodal, Apache 2.0 |
| 02/24 | Qwen3.5 Medium | Alibaba | 122B/35B/27B three sizes |
| Feb | Tiny Aya | Cohere | 3.35B, 70+ languages |
| 03/01 | Qwen3.5 Small | Alibaba | 0.8B--9B, mobile multimodal |
| 03/15 | GLM-5-Turbo | Zhipu AI | Accelerated version of GLM-5 |
| 03/16 | Mistral Small 4 | Mistral AI | 119B/6.5B MoE, unified reasoning + multimodal + code |
| 03/26 | Voxtral TTS | Mistral AI | Open-source speech synthesis, 9 languages |
| 03/27 | GLM-5.1 | Zhipu AI | Improved GLM-5, code ability approaching Claude Opus |

## Frontier Open-Source Models (100B+)

Nearly all frontier open-source models in 2026 use the **Mixture of Experts (MoE)** architecture -- massive total parameter counts, but only a small fraction activated per inference, striking a balance between performance and cost. Chinese labs dominate this tier.

### GLM-5 / GLM-5.1 (Zhipu AI) -- Highest-Ranked Open-Source

745B total parameters, 44B active parameters (256 experts, 8 activated per token), MIT license. Trained entirely on Huawei Ascend chips, without a single NVIDIA GPU. Artificial Analysis Intelligence Index #1 open-source (50 points), SWE-bench Verified 77.8%, Humanity's Last Exam 50.4%. API pricing around $1.00/$3.20 per M tokens.

**GLM-5.1**, released on March 27, further improved performance, with code ability approaching Claude Opus 4.6.

**-> [GLM-5 Deep Dive: Zhipu AI's 744B Open-Source Model](/posts/ai/2026-03-26-glm5-model-intro)**

### Kimi K2.5 (Moonshot AI) -- 1T Parameters + Agent Swarm

A 1T total / 32B active parameter MoE model, MIT license (attribution required for >100M MAU or >$20M monthly revenue). Native multimodal, with the biggest highlight being **Agent Swarm** -- capable of coordinating 100 sub-agents simultaneously and issuing 1,500 tool calls. Code and math are open-source strongest on some benchmarks.

**-> [Kimi Deep Dive: Moonshot AI's Long-Context AI Model](/posts/ai/2026-03-26-kimi-model-intro)**

### Qwen3.5-397B-A17B (Alibaba) -- Multimodal Flagship

397B total / 17B active parameters, hybrid MoE (Gated Delta Networks + sparse MoE, 512 experts, 10 routed + 1 shared per token). 262K context (expandable to 1M), native multimodal (text/image/video), supports 201 languages, Apache 2.0 license.

After the Qwen3 series (235B flagship) in April 2025, Alibaba released the fully upgraded 3.5 series in just half a year -- the evolution speed is remarkable.

### MiniMax-M2.5 -- SWE-bench Rivaling Claude Opus

230B total / 10B active parameters MoE model, Modified MIT license. SWE-bench Verified 80.2% (matching Claude Opus 4.6), Multi-SWE-Bench #1 (51.3%), at 1/20th the cost of Claude Opus. Trained with their proprietary Forge RL framework.

MiniMax is relatively low-profile, but M2.5's code ability is among the very best in open-source models.

### DeepSeek V3 / R1 -- Still Important but Starting to Age

DeepSeek-V3 (671B/37B MoE, 2024/12) and R1 (reasoning-specialized, 2025/01) were open-sourced under MIT, with training cost of only $5.6M, sending shockwaves through the industry. V3.1 (2025/08) merged V3 and R1 capabilities with hybrid thinking mode. V3.2-Exp (2025/09) introduced Sparse Attention.

But as of 2026/03/31, **neither R2 nor V4 have been released** -- the originally planned May 2025 schedule has been delayed multiple times. CEO Liang Wenfeng reportedly wasn't satisfied with R2's performance and may be retraining on Huawei chips.

### Llama 4 Scout / Maverick (Meta) -- Ultra-Long Context

Released April 2025. Scout (109B/17B MoE, 16 experts) has a **10M context window**, Maverick (400B/17B MoE, 128 experts) has 1M context. Llama 4 Community License (open-weight but not fully open-source).

Multimodal (text + image input), multilingual support, but Chinese capability still lags behind Qwen and GLM.

### gpt-oss-120b (OpenAI) -- First Open-Source Model

Released August 2025, 117B total / 5.1B active parameters MoE, **Apache 2.0** license. Reasoning capability close to o4-mini, can run on a single 80GB GPU. Also released gpt-oss-20b (21B/3.6B).

OpenAI releasing an open-source model is itself a historic event, even though it's no longer the most capable.

### Devstral 2 (Mistral) -- Code-Specialized

123B dense model, 256K context, Modified MIT. SWE-bench Verified 72.2%, 7x more cost-efficient than Claude Sonnet. Designed specifically for code generation and agentic coding.

### Frontier Tier Overview

| Model | Total Params | Active Params | Architecture | License | Released | Strength |
| ----- | ------------ | ------------- | ------------ | ------- | -------- | -------- |
| GLM-5.1 | 745B | 44B | MoE | MIT | 2026/03 | #1 overall open-source |
| Kimi K2.5 | 1T | 32B | MoE | MIT* | 2026/01 | Agent Swarm |
| Qwen3.5-397B | 397B | 17B | MoE | Apache 2.0 | 2026/02 | Multimodal + multilingual |
| MiniMax-M2.5 | 230B | 10B | MoE | Modified MIT | 2026/02 | Best SWE-bench |
| DeepSeek-V3.1 | 671B | 37B | MoE | MIT | 2025/08 | Lowest cost |
| Llama 4 Maverick | 400B | 17B | MoE | Llama 4 | 2025/04 | 1M context |
| Llama 4 Scout | 109B | 17B | MoE | Llama 4 | 2025/04 | 10M context |
| gpt-oss-120b | 117B | 5.1B | MoE | Apache 2.0 | 2025/08 | OpenAI open-source |
| Devstral 2 | 123B | 123B | Dense | Modified MIT | 2025/12 | Code-specialized |

## Mid-Tier Models (7B--70B)

Not every application needs a frontier model. 7B--70B models can run on a single machine or a few GPUs, hitting the sweet spot for many production scenarios.

### Qwen3.5 Medium Series (2026/02)

Alibaba released three sizes on February 24, all Apache 2.0 with native multimodal:

| Model | Total Params | Active Params | Architecture | Highlights |
| ----- | ------------ | ------------- | ------------ | ---------- |
| Qwen3.5-122B-A10B | 122B | 10B | MoE | Best agentic benchmark (BFCL-V4 72.2) |
| Qwen3.5-35B-A3B | 35B | 3B | MoE | Surpasses previous-gen 235B flagship |
| Qwen3.5-27B | 27B | 27B | Dense | SWE-bench Verified 72.4, matching GPT-5 mini |

**Qwen3.5-35B-A3B** is particularly noteworthy -- 3B active parameters surpassing the previous-gen flagship with 22B active parameters represents a massive leap in architectural efficiency.

### Mistral Small 4 (2026/03)

119B total / 6.5B active parameters MoE, 256K context, Apache 2.0. Unifies Magistral (reasoning), Pixtral (multimodal), and Devstral (code) into a single model with adjustable reasoning intensity.

### Gemma 3 (Google, 2025/03)

Based on Gemini 2.0 technology, available in 1B/4B/12B/27B sizes, multimodal (text + image), 128K context. Traditional Chinese performance on Cloudflare Workers AI outperforms Llama.

**-> [Gemma 3 on Cloudflare Workers AI: A Pragmatic Choice for Traditional Chinese Applications](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)**

### Devstral Small 2 (Mistral, 2025/12)

24B dense, Apache 2.0. SWE-bench Verified 68.0%, runs on consumer hardware. If you only need code capability and hardware is limited, this is the best value option.

### InternLM3-8B (Shanghai AI Lab, 2026/01)

8B parameters, 4x data efficiency vs Llama 3.1 (trained on 4T tokens), integrates conversational and deep thinking modes, performance matching GPT-4o-mini.

### Other Widely Used Models

- **Llama 3.1 70B / 3.3 70B** (2024): Most mature English ecosystem, 128K context
- **Qwen3-32B / 14B / 8B** (2025/04): Apache 2.0, strong in Chinese and multilingual

## Mobile Small Models (Below 7B)

1B--4B parameter models, after quantization, can achieve usable inference speeds on regular smartphones. The most important Q1 2026 advances are the Qwen3.5 Small series and continuously improving inference frameworks.

### Qwen3.5 Small Series (2026/03)

0.8B / 2B / 4B / 9B four sizes, hybrid architecture (Gated DeltaNet + MoE), 262K context, native multimodal (4B and above), 201 languages, Apache 2.0. The 9B version even surpasses the previous-gen Qwen3-30B.

The top choice for Traditional Chinese and multilingual on-device scenarios.

### Gemma 3n (Google, 2025/05--07)

Designed specifically for mobile, Per-Layer Embeddings (PLE) let a 5B parameter model occupy only 2GB RAM. E2B/E4B two sizes, multimodal (text/image/audio/video), optimized in partnership with Qualcomm, MediaTek, and Samsung.

### Other Notable Small Models

| Model | Parameters | License | Strength |
| ----- | ---------- | ------- | -------- |
| Llama 3.2 | 1B / 3B | Llama Community | Most mature English ecosystem, 128K context |
| Phi-4-mini-flash-reasoning | 3.8B | MIT | Math reasoning, 10x throughput |
| SmolLM3 | 3B | Apache 2.0 | Fully open-source (including training data), 128K context |
| MobileLLM-R1 | 140M--950M | MIT | Best sub-billion reasoning |
| Tiny Aya | 3.35B | CC-BY-NC | 70+ languages, edge devices |
| gpt-oss-20b | 21B / 3.6B active | Apache 2.0 | OpenAI small open-source model |

**-> [Mobile Small Models Complete Comparison: Choices and Constraints in 2026](/posts/ai/2026-03-31-mobile-small-models)**

## Embedding Models: The Foundation of RAG

RAG requires not just generation models but also Embedding models to vectorize text. This domain changed significantly in 2026 -- Qwen3-Embedding took #1 on MTEB multilingual, Jina v4 supports multimodal embeddings, and Nomic v2 became the first to apply MoE to embedding models.

| Model | Developer | Params | Dimensions | Max Tokens | Multilingual | License | Strength |
| ----- | --------- | ------ | ---------- | ---------- | ------------ | ------- | -------- |
| Qwen3-Embedding-8B | Alibaba | 8B | 7168 | 32K | 100+ languages | Apache 2.0 | MTEB multilingual #1 (70.58) |
| BGE-M3 | BAAI | 568M | 1024 | 8K | 100+ languages | MIT | Only model supporting dense + sparse + ColBERT tri-mode |
| Jina Embeddings v4 | Jina AI | 3.8B | 2048 | 32K | 30+ languages | CC-BY-NC-4.0 | Multimodal (text + image + PDF) |
| NV-Embed-v2 | NVIDIA | 7.85B | 4096 | 32K | Primarily English | CC-BY-NC-4.0 | High MTEB English score |
| Nomic Embed v2 | Nomic AI | 475M (MoE) | 768 | 512 | ~100 languages | Apache 2.0 | First MoE Embedding, fully open-source |
| EmbeddingGemma-300M | Google | 300M | 768 | 2K | 100+ languages | Gemma | Edge deployment, <200MB RAM |

How to choose: For Traditional Chinese RAG, use **BGE-M3** (MIT, tri-mode retrieval) or **Qwen3-Embedding** (highest accuracy). For multimodal embedding (images + PDF), use **Jina v4**. For edge devices, use **EmbeddingGemma**.

**-> [BGE-M3: Why This Embedding Model Fits Traditional Chinese RAG](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)**

## Reranker Models: Boosting Retrieval Precision

Embedding handles recall; Reranker handles precision ranking. A good Reranker can dramatically improve RAG answer quality.

| Model | Developer | Params | License | Strength |
| ----- | --------- | ------ | ------- | -------- |
| Qwen3-Reranker (0.6B/4B/8B) | Alibaba | 0.6B--8B | Apache 2.0 | Full pipeline with Qwen3-Embedding |
| BGE Reranker v2-m3 | BAAI | 568M | MIT | Pairs with BGE-M3, most permissive license |
| Jina Reranker v3 | Jina AI | 0.6B | CC-BY-NC-4.0 | 131K context, cross-document interaction |
| gte-reranker-modernbert-base | Alibaba | 149M | Apache 2.0 | 149M matches 1.2B Nemotron |

Most pragmatic combinations: **BGE-M3 + BGE Reranker v2-m3** (all MIT) or **Qwen3-Embedding + Qwen3-Reranker** (all Apache 2.0).

**-> [Cross-Encoder Reranking: Getting the Most Relevant Documents to the Top](/posts/ai/2026-03-12-cross-encoder-reranking)**
**-> [ColBERT: The Third Path for Vector Search](/posts/ai/2026-03-12-colbert-late-interaction)**
**-> [SPLADE: Smarter Sparse Vector Search Than BM25](/posts/ai/2026-03-12-splade-sparse-vectors)**

## Code Models: Specialized for Writing Code

Most frontier LLMs can write code, but some models are specifically optimized for coding.

| Model | Developer | Params | License | Highlights |
| ----- | --------- | ------ | ------- | ---------- |
| Qwen3-Coder-480B-A35B | Alibaba | 480B/35B MoE | Apache 2.0 | Open-source coding flagship |
| Qwen2.5-Coder-32B | Alibaba | 32B | Apache 2.0 | HumanEval 92.7% (surpasses GPT-4o) |
| Devstral 2 | Mistral | 123B dense | Modified MIT | SWE-bench 72.2%, 256K context |
| Devstral Small 2 | Mistral | 24B | Apache 2.0 | SWE-bench 68%, runs on consumer hardware |
| StarCoder2-15B | BigCode | 15B | OpenRAIL-M | 600+ programming languages, widest coverage |
| DeepSeek-Coder-V2 | DeepSeek | 236B/21B MoE | DeepSeek License | 128K context, code + math |

## Speech Models: STT and TTS

### Speech-to-Text (STT)

| Model | Developer | Params | WER | Languages | License |
| ----- | --------- | ------ | --- | --------- | ------- |
| Canary Qwen 2.5B | NVIDIA | 2.5B | 5.63% | English | CC-BY-4.0 |
| Granite Speech 3.3 8B | IBM | ~9B | 5.85% | Multilingual + translation | Apache 2.0 |
| Whisper Large V3 | OpenAI | 1.55B | 7.4% | 99+ languages | MIT |
| Whisper Large V3 Turbo | OpenAI | 809M | 7.75% | 99+ languages | MIT |
| Parakeet TDT 1.1B | NVIDIA | 1.1B | ~8% | English | CC-BY-4.0 |

For multilingual, go with **Whisper V3** (MIT, 99+ languages). For highest English accuracy, use **Canary Qwen**. For real-time streaming, use **Parakeet TDT** (>2000x real-time speed).

### Text-to-Speech (TTS)

| Model | Developer | Params | Languages | License | Strength |
| ----- | --------- | ------ | --------- | ------- | -------- |
| Voxtral TTS | Mistral | 4B | 9 languages | Apache 2.0 | 3-second voice cloning, 70ms latency, released 2026/03 |
| Kokoro | hexgrad | 82M | Multilingual | Apache 2.0 | High-quality synthesis at 82M, runs on CPU |
| Fish Speech V1.5 | Fish Audio | -- | Chinese/English multilingual | -- | 300K hours training, DualAR architecture |
| Parler TTS | Hugging Face | ~600M | English | Apache 2.0 | Prompt-controllable tone and style |

**Voxtral TTS** is the standout release of 2026/03 -- 3 seconds of audio is all it needs to clone a voice, supports streaming, Apache 2.0 license.

## Image Generation Models

| Model | Developer | Params | License | Strength |
| ----- | --------- | ------ | ------- | -------- |
| FLUX.2 Dev | Black Forest Labs | 32B | Open weights (non-commercial) | Best text rendering and characters |
| FLUX.2 Klein 4B | Black Forest Labs | 4B | Apache 2.0 | Consumer GPU instant generation |
| Stable Diffusion 3.5 Large | Stability AI | 8.1B | Free for revenue <$1M | Runs on 12GB VRAM |
| SDXL | Stability AI | ~3.5B | CreativeML Open RAIL-M | Most mature ecosystem (LoRA, ControlNet) |

## Video Generation Models

| Model | Developer | Params | License | Strength |
| ----- | --------- | ------ | ------- | -------- |
| Wan 2.2 | Alibaba | 5B/14B | Apache 2.0 | Cinema-grade quality, 5B runs on consumer GPU |
| HunyuanVideo | Tencent | 13B | Tencent License | Quality rivaling Runway Gen-3 |
| Open-Sora 2.0 | HPC-AI Tech | 11B | Open-source | Training cost only $200K, approaching OpenAI Sora |
| Mochi 1 | Genmo | 10B | Apache 2.0 | Commercial-friendly |

Open-source video generation made the most dramatic progress in 2026 -- Wan 2.2 and HunyuanVideo quality directly rivals Sora and Veo.

## Deployment and Inference: How to Run the Models

After choosing a model, you still need to choose how to run it. The 2026 inference ecosystem is quite mature, but optimal choices vary significantly by scenario.

### Local Development -> Ollama

Download and launch models with a single command, Docker-style CLI + OpenAI-compatible API. Ideal for personal development, prototyping, and offline use. Not suitable for high-concurrency production environments.

**-> [Ollama Complete Guide: Run LLMs Locally with One Command](/posts/ai/2026-03-14-ollama-local-llm-guide)**

### Production Deployment -> vLLM

PagedAttention + continuous batching + prefix caching -- currently the most mainstream open-source LLM inference engine. Ideal for API services requiring high throughput.

**-> [vLLM: From PagedAttention to Production-Grade LLM Inference Engine](/posts/ai/2026-03-14-vllm-inference-engine)**

### Edge / Serverless -> Cloudflare Workers AI

If you don't want to manage GPUs, Cloudflare Workers AI provides zero-ops inference services. Model selection is limited, but Gemma 3 12B outperforms Llama for Traditional Chinese.

**-> [Gemma 3 on Cloudflare Workers AI: A Pragmatic Choice for Traditional Chinese Applications](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)**

### Deployment Quick Reference

```text
What do you need?
├── Local experiments / prototyping -> Ollama
├── Production API service         -> vLLM (self-managed GPU) or Cloudflare Workers AI (managed)
├── Mobile app                     -> llama.cpp + GGUF or Google AI Edge
└── Offline / privacy              -> Ollama or on-device models
```

## Leaderboard Status (2026/03)

The gap between open-source and closed-source models is closing rapidly, though frontier closed-source models still lead.

### LMArena (formerly Chatbot Arena)

5,632,160 votes, 333 models. Top 9 are all closed-source (Claude Opus 4.6 leads at 1504 Elo), with GLM-5 family and Kimi K2.5 as the highest-ranked open-source models.

### Artificial Analysis Intelligence Index

314 models. Highest closed-source score: 57 (Gemini 3.1 Pro Preview), highest open-source score: 50 (GLM-5 Reasoning) -- the gap has narrowed from 20+ points a year ago to just 7 points.

Fastest model: Mercury 2 (789.2 tok/s). Cheapest model: Gemma 3n E4B ($0.03/M tokens).

## How to Choose a Model: Decision Framework

### Step 1 -- Identify Your Use Case

| Scenario | Recommended Direction |
| -------- | --------------------- |
| General conversation / Chatbot | GLM-5.1, Kimi K2.5, Qwen3.5-397B |
| Code generation / Agentic Coding | MiniMax-M2.5, GLM-5.1, Devstral 2 |
| Traditional Chinese RAG | Gemma 3 12B (generation) + BGE-M3 (Embedding) |
| Multilingual applications | Qwen3.5 series (201 languages) |
| Mobile offline | Gemma 3n, Qwen 3.5 Small |
| Math / Reasoning | Phi-4-mini (mobile), DeepSeek-R1 (cloud) |
| Ultra-long text | Llama 4 Scout (10M context), Kimi K2.5 |
| Extremely low budget | Cloudflare Workers AI (free tier) + Gemma 3 |

### Step 2 -- Identify Your Constraints

- **GPU resources**: No GPU -> Ollama CPU mode or Cloudflare Workers AI; Have GPU -> vLLM
- **Language needs**: Traditional Chinese -> Qwen or Gemma first; English -> Llama or Phi first
- **License needs**: Commercial use -> MIT / Apache 2.0 (GLM-5, Qwen3.5, SmolLM3); watch out for Llama and Modified MIT restrictions
- **Privacy needs**: Can't send to cloud -> local deployment or on-device

### Step 3 -- Just Try It

Benchmarks and real-world performance don't always align. Running a test with your own data is more useful than reading any leaderboard. Ollama lets you evaluate a model in five minutes -- the barrier is too low to have any excuse not to try.

## How to Track the Latest Models

Open-source models iterate extremely fast, and by the time this article is published, there might already be something new next week. Here are the channels I regularly follow:

### Leaderboards / Comparison Sites

- **[Artificial Analysis](https://artificialanalysis.ai/leaderboards/models)**: Independent measurement, 72-hour update cycle, 314+ models, includes speed (tokens/sec) and price comparisons, filterable by model size -- especially useful for tracking cost-effectiveness
- **[LiveBench](https://livebench.ai/)**: Monthly new questions from latest arXiv papers and news, avoids benchmark gaming, covers math, code, and reasoning
- **[LMArena](https://lmarena.ai/)** (formerly Chatbot Arena): Crowd-sourced blind A/B comparisons producing Elo ratings. Closer to "how it actually feels to use" than benchmarks
- **[LiveBench](https://livebench.ai/)**: Monthly new questions from latest arXiv papers and news, avoids benchmark gaming

### Real-Time Tracking

- **[Hugging Face Trending Models](https://huggingface.co/models?sort=trending)**: Reflects what the community is downloading in real-time; new open-source models often appear here before they hit the news
- **[Hugging Face Daily Papers](https://huggingface.co/papers)**: Community-voted daily paper selections; technical papers for new models almost always make the list
- **[LLM Stats](https://llm-stats.com)**: Updates hourly, aggregates model release news from TechCrunch, VentureBeat, and other sources; shows new models from the past 24 hours
- **Official blogs / announcement pages of each lab**:
  - [Google AI Blog](https://blog.google/technology/ai/) · [Meta AI Blog](https://ai.meta.com/blog/) · [Microsoft Research Blog](https://www.microsoft.com/en-us/research/blog/)
  - [Qwen Blog](https://qwenlm.github.io/blog/) · [DeepSeek](https://api-docs.deepseek.com/news) · [Zhipu AI (GLM)](https://open.bigmodel.cn/dev/howuse/introduction) · [Moonshot AI (Kimi)](https://www.moonshot.cn/)
  - [Mistral AI News](https://mistral.ai/news/) · [MiniMax](https://www.minimax.io/news) · [Stability AI](https://stability.ai/news)
  - [Hugging Face Blog](https://huggingface.co/blog) · [NVIDIA AI Blog](https://developer.nvidia.com/blog/category/generative-ai/) · [Jina AI Blog](https://jina.ai/news/) · [BAAI (BGE)](https://www.baai.ac.cn/)

### Community

- **[r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)**: The most active local model community on Reddit; first-hand benchmarks, quantized versions, and hands-on reviews mostly originate here
- The comment sections on **[Hugging Face Daily Papers](https://huggingface.co/papers)** also frequently feature in-depth discussions between model authors and the community

Recommended strategy: Track new releases with LLM Stats -> check community reaction on Hugging Face Trending -> compare numbers on Artificial Analysis / LMArena -> read hands-on feedback on r/LocalLLaMA. But ultimately, you still need to test with your own data -- benchmarks and real-world performance don't always align.

## The Big Picture

Five structural trends defined the open-source LLM landscape in Q1 2026:

1. **MoE dominates**: Nearly all frontier models are MoE, with active parameters controlled between 10--44B; inference cost no longer scales linearly with total parameter count
2. **Chinese labs lead**: GLM-5, Kimi K2.5, Qwen3.5, MiniMax-M2.5, DeepSeek -- 4 out of the top 5 frontier open-source models come from China
3. **Native multimodal**: Qwen3.5, Gemma 3n, Kimi K2.5 all integrate vision from pre-training, no longer bolted-on adapters
4. **MIT/Apache 2.0 as standard**: Frontier open-source model licenses are becoming increasingly permissive, dramatically lowering the commercial use barrier
5. **Open-source catching up with closed-source**: GLM-5 scored 50 on Artificial Analysis, closed-source highest is 57 -- a year ago the gap was over 20 points

The biggest structural shift: Model selection decisions are moving from "open-source vs closed-source" to "self-hosted vs managed." Technical capability is no longer the bottleneck -- operational capability is.

---

## References

In-site articles:

- [GLM-5: Zhipu AI's 744B Open-Source Model](/posts/ai/2026-03-26-glm5-model-intro)
- [Kimi: Moonshot AI's Long-Context AI Model](/posts/ai/2026-03-26-kimi-model-intro)
- [Mobile Small Models: Choices and Constraints in 2026](/posts/ai/2026-03-31-mobile-small-models)
- [BGE-M3: Why This Embedding Model Fits Traditional Chinese RAG](/posts/ai/2026-03-12-bge-m3-embedding-model-selection)
- [Ollama Complete Guide: Run LLMs Locally with One Command](/posts/ai/2026-03-14-ollama-local-llm-guide)
- [vLLM: From PagedAttention to Production-Grade LLM Inference Engine](/posts/ai/2026-03-14-vllm-inference-engine)
- [Gemma 3 on Cloudflare Workers AI: A Pragmatic Choice for Traditional Chinese Applications](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)

External resources:

- [GLM-5 -- Hugging Face](https://huggingface.co/zai-org/GLM-5)
- [Kimi K2.5 -- Hugging Face](https://huggingface.co/moonshotai/Kimi-K2.5)
- [Qwen3.5-397B-A17B -- Hugging Face](https://huggingface.co/Qwen/Qwen3.5-397B-A17B)
- [MiniMax-M2.5 Official](https://www.minimax.io/news/minimax-m25)
- [DeepSeek Models Guide -- BentoML](https://www.bentoml.com/blog/the-complete-guide-to-deepseek-models-from-v3-to-r1-and-beyond)
- [Llama 4 -- Meta AI](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [gpt-oss -- OpenAI](https://openai.com/index/introducing-gpt-oss/)
- [Mistral Small 4 -- Mistral AI](https://mistral.ai/news/mistral-small-4)
- [Devstral 2 -- Mistral AI](https://mistral.ai/news/devstral-2-vibe-cli)
- [LMArena Leaderboard](https://lmarena.ai/)
- [Artificial Analysis LLM Leaderboard](https://artificialanalysis.ai/leaderboards/models)
- [LiveBench](https://livebench.ai/)
- [LLM Stats -- AI Model Releases](https://llm-stats.com)
- [r/LocalLLaMA -- Reddit](https://reddit.com/r/LocalLLaMA)
