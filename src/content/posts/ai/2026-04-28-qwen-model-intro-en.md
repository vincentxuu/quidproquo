---
title: "Qwen (Tongyi Qianwen): Alibaba's Open-Source LLM Family, from 72B to 397B — A Complete Evolution Overview"
date: 2026-04-28
type: project
category: ai
tags: [qwen, alibaba, llm, open-source, moe, multimodal, apache2, ai-model, dashscope, on-device-ai, agentic-coding]
lang: en
tldr: "Qwen (Tongyi Qianwen) is Alibaba's open-source LLM family, known for its Apache 2.0 license, 201-language coverage, and rapid iteration. The latest Qwen3.6 (2026/04) focuses on Agentic Coding — the 27B Dense version achieves 77.2% on SWE-bench and 59.3% on Terminal-Bench 2.0, on par with Claude Opus. A new Thinking Preservation feature lets agents retain reasoning context across turns."
description: "An in-depth look at Alibaba's Qwen (Tongyi Qianwen) model family, covering company background, full evolution history (Qwen1 to Qwen3.6), Qwen3.5/3.6 technical architecture (Gated DeltaNet + MoE), benchmark comparisons, the DashScope API, and Qwen's positioning for Traditional Chinese, multilingual, on-device, and Agentic Coding scenarios."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-28-qwen-model-intro)

In April 2025, Alibaba released Qwen3 — a series that made the entire open-source community re-evaluate "Chinese models" on technical merits. It introduced a **switchable thinking mode** mechanism, allowing the same model to dynamically toggle between fast responses and deep reasoning, rather than being locked into a reasoning-only path like DeepSeek-R1.

By Q1 2026, the Qwen3.5 series pushed further: the flagship 397B natively integrates vision and video, the on-device 9B version outperforms the previous-generation 30B, and the 35B version uses only 3B active parameters to surpass the old 235B flagship. This efficiency leap made Qwen the poster child for "small size, big punch" in the open-source model world.

At the end of April 2026, **Qwen3.6** was released, focusing on the community's most direct feedback: making the model more stable and practical in agentic coding scenarios. It introduces **Thinking Preservation** (retaining reasoning context across turns), and the 27B Dense version achieves 77.2% on SWE-bench Verified and 59.3% on Terminal-Bench 2.0, approaching Claude Opus 4.5 levels.

---

## Alibaba and Tongyi Qianwen

Qwen (full name **Tongyi Qianwen**) is the LLM product line developed under **Alibaba Cloud**, the cloud computing arm of Alibaba Group. The international brand name is Qwen.

Alibaba's AI investment started earlier than most realize — it established **DAMO Academy** back in 2017, with sustained foundational research across NLP, computer vision, and speech. The Qwen series began open-sourcing in late 2023, initially with 7B and 14B models, and has since evolved to today's 400B-class flagship.

Alibaba Cloud's API platform is called **DashScope** (Lingji), which serves as the primary distribution channel for the Qwen series. Outside the Chinese market, Qwen models are also widely available on Hugging Face and OpenRouter.

---

## Qwen Evolution History

| Date | Series | Key Milestone |
|------|--------|---------------|
| 2023/08 | **Qwen-7B / 14B** | First-generation open source, official debut of the Tongyi Qianwen brand |
| 2024/02 | **Qwen1.5** | Full size range from 0.5B to 72B, Traditional Chinese and multilingual improvements |
| 2024/06 | **Qwen2** | 72B flagship, 128K context, surpasses LLaMA 3 70B |
| 2024/09 | **Qwen2.5** | Introduced Qwen2.5-Coder (72B open-source code SOTA), Qwen2.5-VL (vision-language), Qwen2.5-Math |
| 2025/04 | **Qwen3** | 235B-A22B MoE flagship, **thinking mode toggle** (/think / /no_think), Apache 2.0 |
| 2026/02 | **Qwen3.5-397B** | 397B-A17B multimodal flagship, Gated DeltaNet + MoE, 201 languages, 262K context |
| 2026/02 | **Qwen3.5 Medium** | Three sizes: 122B / 35B / 27B; the 35B-A3B surpasses the old 235B flagship |
| 2026/03 | **Qwen3.5 Small** | 0.8B to 9B on-device series; the 9B outperforms the old Qwen3-30B |
| **2026/04** | **Qwen3.6** | 35B-A3B (MoE) + 27B (Dense), focused on Agentic Coding, introduces Thinking Preservation |

The overall rhythm of the Qwen family is: **first establish baselines with dense models, then dramatically cut inference costs with MoE, and finally squeeze small models onto phones**. This roadmap is similar to Meta's LLaMA, but moves faster and offers broader coverage of specialized models (Coder, VL, Math).

---

## Qwen3's Core Breakthrough: Thinking Mode Toggle

The Qwen3 series (2025/04) introduced a distinctive design: **the same model can dynamically choose to "think" or "not think"**.

- Adding `/think` to the prompt triggers deep reasoning (similar to o1 or DeepSeek-R1's chain-of-thought)
- Adding `/no_think` triggers a direct fast response, with lower latency and cost

This solves a practical problem: reasoning models shouldn't spend 5 seconds on a chain-of-thought for a prompt like "hello." Qwen3 lets developers decide when reasoning power is needed and when speed matters.

### Qwen3 Flagship Specs

```
Qwen3-235B-A22B
Total params:    235B
Active params:   22B
Architecture:    MoE
Context:         128K tokens
License:         Apache 2.0
```

---

## Qwen3.5: A Complete Architecture Upgrade

The Qwen3.5 series, launched in Q1 2026, made three major upgrades on top of Qwen3:

1. **New architecture**: Introduced **Gated Delta Networks** (replacing some traditional Attention layers), combined with sparse MoE
2. **Native multimodal**: Text, image, and video are integrated from pre-training, not bolted on via adapters
3. **Multilingual coverage**: Expanded from Qwen3's dozens of languages to **201 languages**

### Flagship: Qwen3.5-397B-A17B

```
Total params:    397B
Active params:   17B
Expert count:    512
Per token:       10 routed experts + 1 shared expert
Context:         262K tokens (extendable to 1M)
Multimodal:      Text / Image / Video
Language support: 201 languages
License:         Apache 2.0
```

Gated Delta Networks make the model more efficient at processing long sequences — traditional Transformer Attention scales quadratically with context length, while the Delta Networks architecture family improves this, making 262K context more practical for actual inference.

### Qwen3.5 Medium Series (2026/02/24)

| Model | Total Params | Active Params | Architecture | Highlight |
|-------|-------------|---------------|-------------|-----------|
| Qwen3.5-122B-A10B | 122B | 10B | MoE | BFCL-V4 72.2, strongest on agentic tasks |
| **Qwen3.5-35B-A3B** | 35B | 3B | MoE | Surpasses the previous-gen 235B-A22B flagship |
| Qwen3.5-27B | 27B | 27B | Dense | SWE-bench Verified 72.4 |

**The 35B-A3B is the standout here**. With only 3B active parameters, it surpasses the previous flagship that activated 22B — meaning the same inference cost (VRAM, compute) can run a significantly stronger model. This has major implications for the cost of self-hosted inference services.

### Qwen3.5 Small Series (2026/03/01)

| Size | Multimodal | Highlight |
|------|-----------|-----------|
| 0.8B | No | Ultra-low power, embedded/edge devices |
| 2B | No | Primary on-device model, balancing performance and size |
| 4B | Yes | Entry-level on-device multimodal |
| 9B | Yes | Outperforms the previous-gen Qwen3-30B |

The entire series is Apache 2.0 licensed, with 262K context and 201 languages. For Traditional Chinese and multilingual on-device applications, this is currently one of the top options to consider.

---

## Qwen3.6: Focused on Agentic Coding (2026/04)

Qwen3.6 is the latest release after Qwen3.5, about a week old at the time of writing. Rather than pursuing "bigger and stronger," it adjusts based on community feedback: making the model more stable in agentic coding tasks, more accurate in frontend workflows, and smoother in repository-level reasoning.

**Two versions:**

| Model | Architecture | Params | Active Params |
|-------|-------------|--------|---------------|
| Qwen3.6-35B-A3B | MoE | 35B | 3B (256 experts, 8 routed + 1 shared) |
| Qwen3.6-27B | Dense | 27B | 27B (fully activated) |

Both support multimodal (text, image, video), 262K context (extendable to 1M via YaRN), and Apache 2.0.

### The Most Important New Feature: Thinking Preservation

The Qwen3 series by default only retains the thinking block for the current turn — reasoning context from previous turns is discarded. This is fine for single-turn Q&A, but in multi-step agent execution, the model has to reason from scratch each turn, wasting tokens and risking consistency loss.

Qwen3.6 introduces the `preserve_thinking` option. When enabled, it retains reasoning content from historical turns:

```python
client.chat.completions.create(
    model="Qwen/Qwen3.6-27B",
    messages=messages,
    extra_body={
        "chat_template_kwargs": {"preserve_thinking": True},
    },
)
```

The impact on agentic tasks is twofold: reasoning becomes more consistent, while KV cache hit rates improve, potentially reducing actual token consumption.

### Note: `/think` Soft Toggle No Longer Supported

The Qwen3 series supported toggling modes within the prompt using `/think` and `/nothink`. **Qwen3.6 removes this mechanism**, replacing it with API parameter control:

- Enable thinking (default): just call normally
- Disable thinking (direct response): pass `enable_thinking: False`

```python
# Disable thinking (DashScope API)
extra_body={"enable_thinking": False}

# Disable thinking (self-hosted vLLM/SGLang)
extra_body={"chat_template_kwargs": {"enable_thinking": False}}
```

### Benchmark: Qwen3.6-27B vs. Competitors at the Same Tier

| Task | Qwen3.5-27B | Qwen3.6-35B-A3B | **Qwen3.6-27B** | Claude Opus 4.5 |
|------|-------------|-----------------|-----------------|-----------------|
| SWE-bench Verified | 75.0% | 73.4% | **77.2%** | 80.9% |
| SWE-bench Pro | 51.2% | 49.5% | **53.5%** | 57.1% |
| Terminal-Bench 2.0 | 41.6% | 51.5% | **59.3%** | 59.3% |
| SkillsBench | 27.2% | 28.7% | **48.2%** | 45.3% |
| AIME 2026 | 92.6% | 92.7% | **94.1%** | 95.1% |
| GPQA Diamond | 85.5% | 86.0% | **87.8%** | 87.0% |

**Qwen3.6-27B** matches or surpasses Claude Opus 4.5 on Terminal-Bench 2.0 and GPQA Diamond, despite the latter being a closed-source flagship model.

Notably, the 35B-A3B (MoE) actually trails the 27B (Dense) on most agentic coding benchmarks. Dense architectures are more stable than MoE's sparse activation when handling repository-level tasks that require global consistency.

---

## Qwen Specialized Model Ecosystem

Beyond general-purpose chat models, Qwen has several important vertical specialized models:

### Qwen2.5-Coder

A code-specialized model based on Qwen2.5-72B. It was the open-source SOTA on SWE-bench Verified for a time (before being surpassed by MiniMax-M2.5). Supports 92 programming languages, 128K context.

### Qwen2.5-VL

A vision-language model. Supports document understanding (including complex tables and layouts), math diagram parsing, and video clip Q&A. Excels on document understanding benchmarks like DocVQA.

### Qwen2.5-Math

A math-specialized model, analogous to DeepSeek-Math. Significantly outperforms general-purpose models of the same size on math benchmarks like MATH and AIME.

### qwen3-embedding

An embedding model for RAG and semantic search. One of three officially recommended embedding options (the other two being embeddinggemma and all-minilm).

---

## Benchmark Comparisons

### Frontier Open-Source Model Rankings (Artificial Analysis Intelligence Index, Q1 2026)

| Model | Score | Notes |
|-------|-------|-------|
| GLM-5 (reasoning mode) | 50 | #1 open source |
| Kimi K2.5 | 47 | Agent Swarm |
| **Qwen3.5** | **45** | — |
| DeepSeek-V3.1 | — | Lowest cost |

Qwen3.5 ranks third among frontier open-source models, behind GLM-5 and Kimi K2.5. However, on specific tasks, Qwen3.5-122B's agentic benchmark score (BFCL-V4 72.2) is the strongest in its class.

### Coding Capability (SWE-bench Verified)

| Model | Score |
|-------|-------|
| MiniMax-M2.5 | 80.2% |
| Claude Opus 4.6 | 80.9% |
| Qwen3.5-27B (Dense) | 72.4% |
| GPT-5 mini | ~72% |

---

## DashScope API

The Qwen series is available via Alibaba Cloud's **DashScope** platform, and also accessible on OpenRouter.

The pricing strategy is significantly more aggressive than OpenAI and Anthropic — Qwen's flagship models are typically priced at 1/5 to 1/3 of Claude Sonnet. Check the official DashScope pricing page for specific prices, as they update with model versions.

**Deployment options:**
- **DashScope API**: Hosted by Alibaba Cloud, the easiest option
- **OpenRouter**: International market access with direct price comparison
- **Local deployment**: Ollama, vLLM, and llama.cpp all support the Qwen series
- **License**: The entire series is Apache 2.0, with no commercial restrictions

---

## When to Choose Qwen?

**Traditional Chinese / Multilingual**: Qwen's Chinese language quality has consistently led among open-source models. Its 201-language coverage gives it an edge in multilingual scenarios across Southeast Asia, the Middle East, and beyond.

**On-device / Edge inference**: The Qwen3.5 Small series is a top choice for on-device deployment in Q1 2026, especially for scenarios requiring multimodal capabilities.

**Agent tasks**: Qwen3.5-122B-A10B scores 72.2 on BFCL-V4 (function calling benchmark), making it the strongest option at this model size — ideal for agent applications that need reliable tool calling.

**Agentic Coding / Terminal automation**: Qwen3.6-27B achieves 59.3% on Terminal-Bench 2.0, matching Claude Opus 4.5; its SkillsBench score of 48.2% surpasses Claude Opus. Pairing Qwen Code (a Claude Code-like terminal agent) with the DashScope API is currently the most complete coding agent combo in the open-source ecosystem.

**Cross-turn agent reasoning consistency**: For scenarios requiring multi-step execution with coherent reasoning context, Qwen3.6's `preserve_thinking` is a rare feature among open-source models, reducing token waste in cross-turn reasoning.

**Cost-sensitive production environments**: The 35B-A3B activates only 3B parameters while delivering performance comparable to the old 235B — in terms of inference cost, it is one of the best value-for-money options available.

**When Qwen is not the best fit**: If you need the absolute top rank among open-source models, GLM-5 still edges ahead on most benchmarks. If you need ultra-long context agent orchestration, Kimi K2.5 has a more specialized architecture. The highest watermark in software engineering (SWE-bench ~80%+) remains the domain of Claude Opus 4.5 and MiniMax-M2.5 — Qwen3.6-27B's 77.2% is close but still has a gap.

---

## The Big Picture

Qwen's core advantage isn't a single model winning a single benchmark — it's the **density of the entire family**: general chat, code, vision, math, embeddings, on-device — every scenario has a corresponding option, all Apache 2.0, all runnable locally.

Qwen3.6 shows what Alibaba is doing: not just chasing benchmark scores, but adjusting model behavior based on real community usage feedback. The Thinking Preservation feature is a design that only emerged after developers actually ran Qwen for multi-step agent tasks and realized they needed it.

In the 2026 open-source model landscape, Qwen represents the "most ecosystem-complete contender." For developers who need to integrate across multiple AI tasks, the architectural consistency of covering most scenarios with a single model family is a real advantage.

---

## References

- [Qwen3 Technical Report (Hugging Face)](https://huggingface.co/papers/2505.09388)
- [Qwen3.5-397B-A17B — Hugging Face](https://huggingface.co/Qwen/Qwen3.5-397B-A17B)
- [Qwen Blog (Official Technical Blog)](https://qwenlm.github.io/blog/)
- [DashScope API Platform](https://dashscope.aliyun.com/)
- [Artificial Analysis Intelligence Index](https://artificialanalysis.ai/leaderboards/models)
- [Qwen2.5-Coder Paper](https://arxiv.org/abs/2409.12186)
- [Qwen2.5-VL Paper](https://arxiv.org/abs/2502.13923)
- [Qwen3.6-35B-A3B — Hugging Face](https://huggingface.co/Qwen/Qwen3.6-35B-A3B)
- [Qwen3.6-27B — Hugging Face](https://huggingface.co/Qwen/Qwen3.6-27B)
- [Qwen Code (Terminal AI Agent)](https://github.com/QwenLM/qwen-code)
