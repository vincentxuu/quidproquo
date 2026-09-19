---
title: "Ling — From Trillion-Parameter Flagships to 5.1B Execution Nodes, Ant Group's Three-Line AGI Strategy"
date: 2026-09-19
category: tech
type: deep-dive
tags: [ai-agent, llm, ant-group, model-family-ling, moe, open-source, agent, finance]
lang: en
description: "Ant Group's Ling model family deep-dive: 2025→2026 evolution timeline, Ling/Ring/Ming three-series strategy, architecture journey from Ling 1.0 to Ling 3.0, Ling-3.0-flash-Fin finance model, and an Agent developer's selection guide"
series:
  name: "AI 模型家族"
  order: 20
glossary:
  - term: "Ling"
    def: "Ant Group's independently developed and open-sourced LLM family, including Ling (non-thinking), Ring (thinking), and Ming (multimodal) series, built on MoE architecture"
  - term: "Ring"
    def: "The reasoning-focused model line within the Ling family, achieving IMO 2025 gold (35/42) and CMO 2025 gold (105/126) with Ring-2.6-1T"
  - term: "Ming"
    def: "The multimodal model line in the Ling family, supporting text, image, audio, and video understanding and generation; Ming-flash-omni-2.0 is the latest flagship"
  - term: "KDA"
    def: "Kimi Delta Attention, an evolution of Lightning Attention with fine-grained diagonal gating in Delta Rule state updates for precise long-sequence memory retention"
---

> 🌏 [中文版](/posts/tech/2026-09-19-ai-model-family-ling)

In March 2025, Ant Group validated the engineering feasibility of MoE large language models on non-A100/H100 heterogeneous computing platforms — this was the starting point of the Ling family. Fifteen months later, it delivered a matrix spanning 7.9B to 1T parameters across text, reasoning, and multimodal domains. On September 9, 2026 at the Bund Conference, the family gained a new member: Ling-3.0-flash-Fin, the first finance-enhanced model.

This is the twentieth family deep-dive in the "AI 模型家族" series, tracing Ling's complete evolution from trillion-parameter flagship to 5.1B efficient execution node, and its "planning-execution separation" AGI strategy.

How to interpret the benchmark numbers cited in this article, please see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources).

## Family Evolution Timeline

| Date | Version | Significance |
|---|---|---|
| 2025-03 | Ling 1.0 | Validated MoE LLM engineering feasibility on non-high-end heterogeneous platforms; completed domestic computing platform adaptation |
| 2025-09 | Ring-1T-preview | World's first open-source trillion-parameter thinking model |
| 2025-10-09 | Ling-1T + Ring-1T | Trillion-parameter non-thinking + thinking models open-sourced simultaneously; Ling/Ring/Ming family formally established |
| 2025-10 | Ling 2.0 | First breakthrough at trillion-parameter scale; FP8 end-to-end training; 1M context |
| 2026-02 | Ling-2.5-1T + Ring-2.5-1T | Ling 2.5: Hybrid Linear Attention; AIME 2026 with only 5,890 tokens to match frontier performance; Ring 2.5: IMO 2025/CMO 2025 dual gold |
| 2026-02 | Ming-flash-omni-2.0 | Industry's first model to unify speech, music, and audio in a single architecture |
| 2026-04 | Ling-2.6-1T | Trillion-flagship "fast thinking": MLA + Linear Attention hybrid, AIME 2026 leading, SWE-bench Verified at open-source forefront |
| 2026-04 | Ling-2.6-flash | 104B/7.4B; anonymous "Elephant Alpha" on OpenRouter topped Trending for consecutive days |
| 2026-05 | Ring-2.6-1T | Trillion-parameter deep thinking model for complex reasoning and long-horizon autonomous execution |
| 2026-07-23 | Ling-3.0-flash | 124B/5.1B; native hybrid linear architecture; KDA + MLA 5:1; matches 1T flagship performance |
| 2026-08 | Ling-3.0-tiny | 7.9B/1.3B; fully local deployment; zero cloud dependency |
| 2026-09-09 | Ling-3.0-flash-Fin | 124B/5.1B; finance-enhanced; MIT open-source; co-developed with CICC; FinFIRST benchmark |

Eighteen months, twelve milestones. Ling's evolution follows a clear thesis: **first prove technical ceiling with trillion parameters, then compress into highly efficient smaller models via architectural innovation, and finally carve out vertical depth (Fin) for domain-specific scenarios.** Scale is not the goal — intelligence-per-computation is.

## Three Product Lines: Ling Executes, Ring Thinks, Ming Multimodal

The key to understanding the Ling family architecture is decomposing it into three parallel lines (plus one experimental line):

**Ling series** (non-thinking/general-purpose): A full-size matrix from Ling-mini to Ling-3.0-flash, built on MoE architecture to deliver "flagship intelligence, Flash efficiency." This line is responsible for **execution** — high-speed inference, tool calling, high-frequency agent tasks. Ling-3.0-flash is positioned as the execution node in the "planning-execution separation" paradigm.

**Ring series** (thinking/reasoning): From Ring-1T to Ring-2.6-1T, trillion-parameter thinking models focused on deep reasoning, mathematical proof, and long-horizon autonomous execution. Ring-2.5-1T achieved IMO 2025: 35/42 (gold medal standard) and CMO 2025: 105/126 (surpassing China's national team cutoff). This line handles **planning** — multi-step reasoning for complex problems.

**Ming series** (multimodal): Unified text, image, audio, and video understanding and generation. Ming-flash-omni-2.0 is the industry's first model to unify speech, music, and audio within a single architecture.

**LLaDA series** (experimental): Diffusion model experiments including LLaDA-MoE and LLaDA 2.0/2.1/2.2, exploring non-autoregressive generation paths.

The logic is clear: **Ling handles "fast and efficient", Ring handles "deep and rigorous", Ming handles "complete and cross-modal"**. All three share underlying training infrastructure and architectural innovations (hybrid linear attention, MoE routing optimization), but serve distinct roles during inference.

## Architecture Evolution: From Hybrid Linear to Native Hybrid Linear

Ling's architectural evolution can be distilled into a single trajectory:

**Ling 1.0 (2025-03)**: Validated MoE feasibility on non-high-end heterogeneous platforms. This was the engineering validation phase — the architecture itself was still being figured out.

**Ling 2.0 (2025-10)**: First breakthrough at trillion-parameter scale. Introduced FP8 end-to-end training. Training efficiency improved dramatically, enabling cross-domain generalization. Context window reached 1M tokens.

**Ling 2.5 (2026-02)**: Hybrid Linear Attention (HLA) architecture introduced — attention layers interleaved at a 1:7 ratio of MLA and Lightning Linear Attention. Significantly improved throughput for long-sequence reasoning: over 32K tokens, memory access reduced by 10× and generation throughput increased by 3×.

**Ling 2.6 (2026-04)**: "Fast thinking" paradigm established. Ling-2.6-1T abandoned the industry-wide pursuit of "slow thinking" multi-step reasoning in favor of reaching results with minimal token expenditure. On AIME 2026, it significantly outperformed other non-thinking models. Ling-2.6-flash achieved same-size SOTA on agent-related benchmarks (SWE-bench Verified, TAU2-Bench, BFCL-V4).

**Ling 3.0 (2026-07)**: Upgraded from "hybrid linear" to **native hybrid linear design**. The core innovation is KDA (Kimi Delta Attention) — evolving from Lightning Attention with fine-grained diagonal gating in Delta Rule state updates for more precise retention of critical information in long sequences. The MoE expert activation ratio compressed from 1/32 in the previous generation to **1/64**, dramatically improving "efficiency leverage" without sacrificing model capacity. KDA and MLA layers alternate at a **5:1 ratio**, balancing long-context efficiency with state memory robustness.

This trajectory matters because Ling is not "scaling up" — it is **compressing intelligence**. Each generation achieves equal or superior performance with fewer activated parameters.

## Family Matrix and Selection Guide

| Dimension | Ling-3.0-tiny | Ling-3.0-flash | Ling-2.6-1T | Ring-2.6-1T | Ling-3.0-flash-Fin |
|---|---|---|---|---|---|
| Total Parameters | 7.9B | 124B | 1T | 1T | 124B |
| Active Parameters | 1.3B | 5.1B | N/A | N/A | 5.1B |
| Positioning | Local offline | Production agent execution | Trillion flagship fast-thinking | Deep reasoning | Finance-enhanced agent |
| Context | 256K | 256K → 1M | 256K | 1M | 256K → 1M |
| Open Source | Yes | Yes | Yes | Yes | Yes (MIT) |
| Best For | Personal KM, offline | High-frequency Agent, coding | Instant reasoning, agentic | Math proofs, complex reasoning | Investment research, financial reports |

Selection logic is straightforward: **local offline, small tasks → tiny; fast Agent execution, coding, general reasoning → flash; instant trillion flagship → 2.6-1T; deep reasoning and math → Ring 2.6-1T; financial domain → flash-Fin**.

## Open Source Strategy and Ecosystem

Ling's open source strategy has three defining characteristics:

**First, clean licensing**. From Ling-1T to Ling-3.0-flash-Fin, nearly all models are under Apache 2.0 or MIT licenses. This compares favorably with Qwen 3.8-Max's custom terms and Llama's Community License — Ling's licensing is more business-friendly.

**Second, domestic computing platform compatibility**. From Ling 1.0 onward, the family emphasizes running on non-A100/H100 heterogeneous platforms. Ling-3.0-flash received Huawei Ascend 0 Day support (with the new CANN PyPTO operator programming framework). This lowers the self-hosting barrier for domestic developers.

**Third, mature framework ecosystem**. SGLang, vLLM, TokenSpeed, llama.cpp, and transformers are all supported. Ling has been validated against Claude Code, Kilo Code, Qwen Code, Hermes Agent, and OpenClaw frameworks.

## Position Against Competitors

Ling's position in 2026 can be described along two axes:

**Open-source leadership**: Ling-3.0-flash "matches or surpasses industry-leading models with two to three times its parameter scale" across core benchmarks. Independent evaluation ([frangelbarrera/Ling-3-flash-evaluation](https://github.com/frangelbarrera/Ling-3-flash-evaluation), 845 API calls, 12 test phases) scored it 7.0/10, with standout security performance (100% jailbreak resistance, 100% indirect injection prevention).

**Competitive against Chinese open-source**: Ling-2.5-1T achieves frontier thinking-model results on AIME 2026 using only 5,890 tokens — matching models that typically require 15k–23k tokens. This token efficiency places it among the leaders alongside DeepSeek V4, Kimi K2.5, and GPT-5.2.

The limitation is equally clear: **closed frontier models (Claude, GPT) lead comprehensively**. Ling still trails on top-tier coding benchmarks (Ring-2.6-1T's Terminal-Bench 2.1 57.5 is behind GPT-5.4's scores). Additionally, flash-Fin's general benchmark (AA Intelligence Index 41) remains below top closed-source models.

## Implications for Agent Development

If you are building **high-frequency agent workflows** (coding agents, search agents, tool-call-intensive scenarios): Ling-3.0-flash is one of the most compelling open-source options for "intelligence density per compute" — 5.1B activated parameters achieving 1T flagship performance, with 60–80% TTFT reduction and single-node deployability. Pair with Ling-3.0-tiny for a "big-small" architecture: flash handles planning, tiny handles local execution.

If you are building **finance-related agents** (investment research, earnings analysis, valuation modeling): Ling-3.0-flash-Fin is the most complete finance-enhanced open-source model available. MIT licensing plus the FinFIRST benchmark open-source lets you self-host, test, and validate the entire pipeline.

If you are doing **deep reasoning tasks** (mathematical proofs, code correctness verification): Ring-2.6-1T is a better fit than Ling — it's purpose-built for "slow thinking" with IMO/CMO gold-level reasoning rigor that the Ling series cannot match.

Not recommended for: peak performance (closed models lead comprehensively), speech/video output (Ling is text-only; Ming handles multimodal), or production-grade reliability requiring 100% certainty (official documentation explicitly states flash-Fin's outputs "do not constitute investment advice" and require professional review).

## Overall Assessment

Ling's core bet is that **intelligence-per-computation beats absolute scale** — not who has the biggest parameters, but who delivers the highest intelligence for the same compute. From Ling 1.0's engineering validation to 3.0's native hybrid linear architecture, this path has become increasingly clear: 1/64 MoE expert activation, KDA's precise long-sequence memory, and "planning-execution separation" across three parallel lines.

The significance of flash-Fin extends beyond a single finance model — it's the first vertical landing of the "Ling approach": take efficient general-purpose architecture + domain fine-tuning + open evaluation benchmarks, and package them as a complete solution. The key thing to watch: will this playbook be replicated in legal, medical, engineering, and other vertical domains?

## References

- [Ant Group Official: Ant Group Unveils Ling AI Model Family and Launches Ling-1T (2025-10-09)](https://www.antgroup.com/en/news-media/press-releases/1759982400000)
- [Ant Group Official: Ant Group Releases Ling-2.5-1T and Ring-2.5-1T (2026-02-16)](https://secure.businesswire.com/news/home/20260215551663/en/Ant-Group-Releases-Ling-2.5-1T-and-Ring-2.5-1T-Evolving-Its-Open-Source-AI-Model-Family)
- [Ant Group Official: Open-Sources Ling-3.0-flash-Fin for Real-World Financial Workflows (2026-09-09)](https://www.antgroup.com/en/news-media/press-releases/1788944400000)
- [Ant Ling Developer Docs: Model Family](https://developer.ant-ling.com/zh-CN/docs/models)
- [Ant Ling Developer Docs: Ling-3.0-flash Release](https://developer.ant-ling.com/zh-CN/blogs/ling-3.0-flash-release)
- [Hugging Face: inclusionAI/Ling-3.0-flash-Fin](https://huggingface.co/inclusionAI/Ling-3.0-flash-Fin)
- [LLM Timeline: Ant Group (27 models, 2025-2026)](https://llmtimeline.org/ant-group)
- [frangelbarrera/Ling-3-flash-evaluation: Independent Evaluation](https://github.com/frangelbarrera/Ling-3-flash-evaluation)
- [Leiphone: 连续發布兩款萬億參數模型，螞蟻AI來勢洶洶](https://www.leiphone.com/category/ai/L6tQCmiyhpWnqvRk.html)
- [Ant Group Official: Ant Group Unveils Ling-3.0-Flash (BusinessWire, 2026-07-27)](https://www.businesswire.com/news/home/20260726584441/en/)
