---
title: "Small Models That Run on Phones: Choices and Constraints in 2026"
date: 2026-03-31
type: guide
category: ai
tags: [on-device-ai, small-models, mobile, quantization, llama, gemma, phi, qwen, mistral, smollm, mobilellm]
lang: en
tldr: "The main on-device LLMs in 2026 are Gemma 3n, Qwen 3.5 Small, Llama 3.2, Phi-4-mini, Ministral 3, and SmolLM3. Sub-3B quantized models can hit 30-50 tokens/sec on phones with 8GB RAM, but RAM, thermal throttling, and context window remain hard constraints."
description: "A roundup of small LLMs that can run on mobile devices in 2026, covering Gemma 3n, Qwen 3.5 Small, Llama 3.2, Phi-4-mini, Ministral 3, SmolLM3, quantization formats, inference frameworks, and real-world limitations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-31-mobile-small-models)

Running LLMs on phones is no longer demo-grade stuff. In 2026, 1B-4B parameter models can achieve usable inference speeds on regular smartphones after quantization. This post surveys the main model options, inference frameworks, and real-world constraints to help you decide which combination fits your use case.

## Model Options

### Gemma 3n (Google) — The Mobile-First Choice

Google released Gemma 3n in May 2025, designed specifically for mobile devices. The core innovation is **Per-Layer Embeddings (PLE)**, which lets a 5B-parameter model consume only 2GB of RAM and an 8B version only 3GB — equivalent to the memory footprint of traditional 2B and 4B models.

It supports text, image, and audio inputs, with a built-in nested sub-model (a 2B sub-model inside the 4B main model) that can dynamically switch based on latency requirements. Optimized hardware support through partnerships with Qualcomm, MediaTek, and Samsung. Deployed via Google AI Edge, the prefill phase can reach thousands of tokens/sec.

### Qwen 3.5 Small (Alibaba) — Best for Multilingual and Traditional Chinese

Released in March 2026, replacing Qwen 2.5 as the mobile workhorse. Four sizes: 0.8B / 2B / 4B / 9B.

Technical breakthroughs: hybrid architecture (Gated Delta Networks + sparse MoE), native multimodal training (4B and above support images and video), and support for over 200 languages. Qwen3.5-4B quantized is about 2.5-3GB and can run on phones with 8GB RAM. Community testing shows the 2B model running at 30-50 tokens/sec on iPhone in airplane mode.

If your use case involves Traditional Chinese or multilingual content, Qwen 3.5 Small is currently the best option to test.

### Llama 3.2 (Meta) — Most Mature English Ecosystem

1B and 3B variants, compressed from Llama 3.1 8B/70B through pruning and knowledge distillation. Supports 128K context window. The 1B quantized version is about 0.7GB, the 3B about 1.8GB.

Meta provides official quantized versions that are 2-4x faster than the original BF16 format, with 56% smaller model size and 41% less memory usage. On Snapdragon 8 Gen 4, Llama 3.2 3B with 4-bit quantization reportedly exceeds 200 tokens/sec.

The most mature English ecosystem with the most complete tool-calling support, but relatively weak in Chinese.

### Phi-4-mini (Microsoft) — Outstanding Reasoning Ability

3.8B parameters, dense decoder-only transformer, supporting 128K context. Even beats GPT-4o on math reasoning. Deployable to iPhone, Android, and Windows via Microsoft Olive + ONNX GenAI Runtime.

Microsoft also released **Phi-4-mini-flash-reasoning**, optimized for edge devices with 10x throughput improvement and 2-3x latency reduction. If you need reasoning-intensive tasks on mobile (math problem-solving, logical analysis), the Phi-4 series is the best choice.

### Ministral 3 (Mistral) — Full Edge Device Coverage

Part of the Mistral 3 family released in December 2025, available in 3B / 8B / 14B sizes. The 3B quantized version can run on devices with 4GB VRAM. Apache 2.0 licensed with no commercial restrictions.

Mistral's strategy is "the next wave of AI isn't about scale, but about ubiquity" — making models small enough to run on drones, vehicles, robots, and phones. Combined with Voxtral TTS (a 4B text-to-speech model) released in early 2026, Mistral is also building a presence in on-device voice AI.

### MobileLLM-R1 (Meta) — Sub-1B Reasoning Monster

A series designed specifically for phone CPUs by Meta, with four sizes from 140M to 950M. The core design philosophy is "deep-and-thin" — at sub-billion scale, more layers with smaller hidden dimensions perform significantly better than wide-and-shallow architectures.

MobileLLM-R1-950M achieves 5x the accuracy of OLMo 1.24B and 2x that of SmolLM2 1.7B on the MATH benchmark, with fewer parameters. The 125M version runs at 50 tokens/sec on iPhone and can handle basic tasks.

The advanced **MobileLLM-R1.5** uses on-policy knowledge distillation to further improve reasoning accuracy by 10-35 percentage points. If your use case involves math, code, or scientific reasoning with extremely constrained device memory, this is currently the best option.

### SmolLM3 (Hugging Face) — Highest Open-Source Transparency

3B parameters, supporting 128K context (via YARN extrapolation), 6 languages. Beats Llama 3.2 3B in the 3B tier and approaches Qwen3-4B and Gemma3-4B performance. Supports dual-mode reasoning (deep thinking and quick response).

Fully open-source — training data, code, and training configurations are all public, under Apache 2.0 license. If you need an auditable, reproducible model, SmolLM3 is the only option.

## Inference Frameworks

A model is just a weight file — you still need an inference framework to run it on a phone.

| Framework | Platform | Key Features |
|-----------|----------|-------------|
| Google AI Edge (MediaPipe) | Android / iOS | Google's official solution, supports Gemma 3n, GPU acceleration, easiest to get started |
| llama.cpp (GGUF) | Cross-platform | Most universal, large community, almost all models available in GGUF format |
| MLC LLM | Android / iOS | Compiles to native GPU shaders (Vulkan/Metal), typically the fastest |
| ExecuTorch | Android / iOS | Meta's official framework, best path for Llama, supports CoreML and XNNPACK |
| Core ML | iOS | Apple native, best performance on Apple Silicon, but locked to the Apple ecosystem |
| ONNX Runtime Mobile | Cross-platform | Microsoft's primary choice, optimized path for Phi models |

There are also ready-made apps for running models directly on your phone: **SmolChat** (supports any GGUF model), **MNN Chat** (focused on speed and efficiency), and **Off Grid** (fully offline, no account required).

If you have no special requirements, llama.cpp + GGUF is the safest starting point — it has the widest model selection and richest community resources.

## Quantization: How to Squeeze Models onto Phones

Raw FP16 models are too large for phones to handle. Quantization compresses weights from 16-bit down to 4-bit or even 2-bit.

**GGUF** (llama.cpp format) is currently the most popular quantization format for mobile. Common quantization levels:

- **Q4_K_M**: 4-bit, the best balance between quality and size — use this for most scenarios
- **Q3_K_S**: 3-bit, slightly smaller with a minor quality drop
- **Q2_K**: 2-bit, extreme compression with noticeable quality loss — only suitable for demos

A rough conversion rule: **1B parameters ≈ 0.6-0.7GB after Q4 quantization**.

Other quantization methods (AWQ, GPTQ) are primarily used server-side; mobile mostly converts to GGUF.

## Real-World Constraints

Running LLMs on phones sounds cool, but hardware limitations are very real:

**RAM is the biggest bottleneck.** The model needs to be loaded entirely into memory. A 4GB RAM phone can only reliably run 1B models; 8GB can handle 3-4B. Gemma 3n's PLE technology is currently the only approach that effectively breaks through this limitation.

**Context window is limited.** The KV cache consumes memory, so in practice mobile devices can typically only use 2K-4K tokens of context. Some models claim to support 128K, but you can't come close to using that much on a phone.

**Thermal throttling reduces speed.** After sustained inference for more than 30 seconds, phones start thermal throttling, and speed can drop 30-50%. This means long text generation won't feel great.

**Battery drain.** A single extended conversation consumes roughly 5-10% battery. Not unacceptable, but users will notice.

## Practical Use Cases

Given these constraints, on-device LLMs are currently best suited for:

- **Offline summarization**: Summarizing articles and emails when there's no internet connection
- **Smart replies**: Short text generation, like Smart Reply-style 1-2 sentence responses
- **Privacy-sensitive processing**: Medical notes, legal documents, and other content you don't want sent to the cloud
- **Offline translation**: With multilingual models like Qwen 3.5, basic translation can be done offline

Not well suited for: long text generation, complex multi-turn conversations, or RAG requiring large context — leave those to the cloud.

## Model Selection Decision Flow

```
What is your primary language?
├── Chinese (Traditional/Simplified) → Qwen 3.5 Small or Gemma 3n
├── Primarily English              → Llama 3.2 or Phi-4-mini
└── Multilingual                   → Gemma 3n or Qwen 3.5 Small

What is your device RAM?
├── 4GB  → Gemma 3n E2B sub-model, Qwen 3.5 0.8B, MobileLLM-R1
├── 6GB  → Llama 3.2 1B, Qwen 3.5 2B, SmolLM3, Ministral 3 3B (Q4)
├── 8GB+ → Gemma 3n E4B, Qwen 3.5 4B, Llama 3.2 3B, Phi-4-mini

What capabilities do you need?
├── Simple classification/extraction      → Qwen 3.5 0.8B, MobileLLM-R1 140M
├── Summarization/replies                 → 1B-3B
├── Reasoning/math (low resources)        → MobileLLM-R1.5 950M
├── Reasoning/math (8GB+)                → Phi-4-mini-flash-reasoning
└── Multimodal (image + text)            → Gemma 3n or Qwen 3.5 4B+
```

## How to Track the Latest Models

Small models iterate rapidly — by the time you finish reading this, there might be something new next month. Here are some channels worth following regularly:

**Leaderboards / Comparison Sites**

- **[Artificial Analysis](https://artificialanalysis.ai/leaderboards/models)**: Independent measurements, 72-hour update cycle, 314+ models, includes speed (tokens/sec) and price comparisons, filterable by model size — especially useful for tracking small model cost-effectiveness
- **[LiveBench](https://livebench.ai/)**: Generates new questions monthly from the latest arXiv papers and news, avoids benchmark gaming, covers math, code, and reasoning
- **[LMSYS Chatbot Arena](https://chat.lmsys.org/)**: Crowdsourced blind A/B comparisons that produce Elo ratings. Closer to "how it actually feels to use" than benchmarks, though small models may have insufficient vote counts

**Real-Time Tracking**

- **[Hugging Face Trending Models](https://huggingface.co/models?sort=trending)**: Real-time reflection of what the community is downloading — new open-source models often appear here before they hit the news
- **[Hugging Face Daily Papers](https://huggingface.co/papers)**: Community-voted daily paper picks — technical papers for new models almost always make the list
- **[LLM Stats](https://llm-stats.com)**: Updated hourly, aggregates model release news from TechCrunch, VentureBeat, and other sources — see new models from the past 24 hours

**Community**

- **[r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)**: The most active local model community on Reddit — first-hand benchmarks, quantized versions, and real-world phone test results mostly originate here
- The comments section of **[Hugging Face Daily Papers](https://huggingface.co/papers)** also frequently hosts in-depth discussions with model authors and the community
- **Hugging Face Discord / EleutherAI Discord**: Open-source model discussions, often with news earlier than official announcements

**Newsletters**

- **[Import AI](https://importai.substack.com/)** (Jack Clark): Weekly deep analysis of AI research papers, particularly good at interpreting new model architectures
- **[Interconnects](https://www.interconnects.ai/)** (Nathan Lambert): Focused on open-source models, RLHF, and training methodologies, with deep insights into the small model ecosystem

**X/Twitter**

- **[@\_akhaliq](https://x.com/_akhaliq)**: The fastest individual account for new model and paper releases — nearly real-time
- **[@rasbt](https://x.com/rasbt)** (Sebastian Raschka): Small model architecture breakdowns and hands-on tutorials
- **[@TheAhmadOsman](https://x.com/TheAhmadOsman)**: Focused on running LLMs locally, GPU benchmarks, inference optimization

**Official Lab Blogs**

- [Google AI Blog](https://blog.google/technology/ai/), [Meta AI Blog](https://ai.meta.com/blog/), [Microsoft Research Blog](https://www.microsoft.com/en-us/research/blog/), [Mistral Blog](https://mistral.ai/news/), [Qwen Blog](https://qwenlm.github.io/blog/)

Recommended strategy: use Hugging Face Trending and LLM Stats to track new releases, check the numbers on Artificial Analysis or LiveBench, read community real-world feedback on r/LocalLLaMA, and subscribe to Import AI or Interconnects for trend analysis. But ultimately, you need to test with your own data — benchmarks and real-world performance don't always align.

## The Big Picture

On-device LLMs in 2026 have moved from "tech demo" to "usable in specific scenarios." The biggest difference from a year ago is Gemma 3n's PLE technology and Qwen 3.5's native multimodal support — the former lets large models fit into small memory, and the latter enables phones to process both text and images simultaneously.

The key tradeoff remains: how much quality are you willing to sacrifice for offline capability and privacy? For most applications, the most pragmatic strategy is to handle simple tasks on-device (classification, short replies, private data) and leave complex tasks to the cloud — a hybrid architecture makes more sense than going all-in on either side.

## References

- [Gemma 3n — Google DeepMind](https://deepmind.google/models/gemma/gemma-3n/)
- [Announcing Gemma 3n preview: powerful, efficient, mobile-first AI](https://developers.googleblog.com/en/introducing-gemma-3n/)
- [Gemma 3 on mobile and web with Google AI Edge](https://developers.googleblog.com/en/gemma-3-on-mobile-and-web-with-google-ai-edge/)
- [Qwen 3.5 Small Model Series (Alibaba)](https://medium.com/data-science-in-your-pocket/qwen-3-5-small-model-series-released-7a5ed34fcbb3)
- [Alibaba releases Qwen 3.5 Small models — MarkTechPost](https://www.marktechpost.com/2026/03/02/alibaba-just-released-qwen-3-5-small-models-a-family-of-0-8b-to-9b-parameters-built-for-on-device-applications/)
- [Llama 3.2: Revolutionizing edge AI and vision with open, customizable models](https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/)
- [Meta quantized Llama models](https://ai.meta.com/blog/meta-llama-quantized-lightweight-models/)
- [Phi-4-mini-flash-reasoning — Microsoft Azure Blog](https://azure.microsoft.com/en-us/blog/reasoning-reimagined-introducing-phi-4-mini-flash-reasoning/)
- [Welcome to the new Phi-4 models — Microsoft](https://techcommunity.microsoft.com/blog/educatordeveloperblog/welcome-to-the-new-phi-4-models---microsoft-phi-4-mini--phi-4-multimodal/4386037)
- [SmolLM3: smol, multilingual, long-context reasoner — Hugging Face Blog](https://huggingface.co/blog/smollm3)
- [SmolLM3-3B Hugging Face](https://huggingface.co/HuggingFaceTB/SmolLM3-3B)
- [Mistral 3 launches for open AI era — eWEEK](https://www.eweek.com/news/mistral-3-launch/)
- [Mistral launches Mistral 3 for laptops, drones, and edge devices — VentureBeat](https://venturebeat.com/ai/mistral-launches-mistral-3-a-family-of-open-models-designed-to-run-on/)
- [MobileLLM-R1: Exploring the Limits of Sub-Billion Language Model Reasoners — Paper](https://arxiv.org/abs/2509.24945)
- [MobileLLM-R1-950M — Hugging Face](https://huggingface.co/facebook/MobileLLM-R1-950M)
- [MobileLLM GitHub](https://github.com/facebookresearch/MobileLLM)
- [ExecuTorch — Meta Mobile Inference Framework](https://github.com/pytorch/executorch)
- [llama.cpp GitHub](https://github.com/ggml-org/llama.cpp)
- [MLC LLM GitHub](https://github.com/mlc-ai/mlc-llm)
- [On-Device LLMs in 2026: What Changed, What Matters, What's Next](https://www.edge-ai-vision.com/2026/01/on-device-llms-in-2026-what-changed-what-matters-whats-next/)
- [The Best Open-Source Small Language Models in 2026 — BentoML](https://www.bentoml.com/blog/the-best-open-source-small-language-models)
- [LMSYS Chatbot Arena](https://chat.lmsys.org/)
- [LLM Stats — AI Model Releases](https://llm-stats.com/ai-news)
