---
title: "GLM-5: Zhipu AI's 744B Open-Source Model Trained Entirely on Huawei Chips"
date: 2026-03-26
type: project
category: ai
tags: [glm-5, zhipu-ai, 智譜ai, llm, moe, open-source, huawei-ascend, ai-model, agent]
lang: en
tldr: "GLM-5 is a 744B MoE open-source model released by Zhipu AI (Z.ai) in February 2026, trained entirely on Huawei Ascend chips and released under the MIT license. It currently ranks as the top open-source model, surpassing Claude and GPT-5 on benchmarks like Humanity's Last Exam, while its API pricing is 1/5 to 1/8 of theirs."
description: "An in-depth look at Zhipu AI's GLM-5 model, covering the company's background (a Tsinghua-born AI unicorn), technical architecture (744B MoE, Slime RL framework), model evolution, benchmark comparisons, API pricing, and its significance as the first frontier model trained without any American hardware."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-26-glm5-model-intro)

On February 11, 2026, Zhipu AI released **GLM-5**.

This alone wouldn't be particularly newsworthy — China sees new model releases every month. But GLM-5 has three characteristics that make it worth serious attention:

1. It is currently the **top-ranked open-source model** (#1 on both LMArena and Artificial Analysis)
2. It was trained entirely on **Huawei Ascend chips** — not a single NVIDIA GPU was used
3. It is released under the **MIT license** — the most permissive license among frontier-class models

Zhipu AI is the first company among China's "AI Six Tigers" to go public. On the day GLM-5 was released, its stock surged 28.7%.

---

## Who is Zhipu AI?

Zhipu AI (international brand name **Z.ai**) was founded in **2019**, incubated from **Tsinghua University's Knowledge Engineering Group (KEG)**. It is headquartered in Beijing's Tsinghua Science Park.

### Core Team

- **Tang Jie** — Co-founder and Chief Scientist. Tsinghua University professor, IEEE/ACM/AAAI Fellow, architect of the GLM framework
- **Li Juanzi** — Co-founder. Tsinghua University professor, Director of the KEG Lab
- **Zhang Peng** — CEO. Tsinghua PhD, responsible for commercialization strategy
- **Liu Debing** — Chairman and Co-founder. Former Technicolor China executive

Zhipu has deep academic roots. The GLM (General Language Model) architecture originated from Tsinghua research, and the team has had international academic influence since GLM-130B in 2022 (ICLR 2023 paper).

### Funding and IPO

- Raised over **$1.4 billion** in total, with investors including Alibaba, Tencent, Meituan, Xiaomi, and Saudi Aramco's Prosperity7
- **Listed on the Hong Kong Stock Exchange on January 8, 2026** (ticker: 2513), raising approximately **$558 million** in its IPO, with public subscriptions oversubscribed by 1,159x
- Post-IPO market cap briefly exceeded **$19 billion**, with shares rising over 250% from the listing price

---

## GLM's Evolution: From 130B to 744B

| Date | Model | Key Highlights |
|------|-------|----------------|
| 2022/07 | **GLM-130B** | 130B dense model, outperformed GPT-3 175B, ICLR 2023 paper |
| 2023/03 | **ChatGLM / ChatGLM-6B** | Aligned version; the 6B open-source variant went viral in the community |
| 2023/06 | **ChatGLM2-6B** | MMLU +23%, context 2K→32K |
| 2023 H2 | **ChatGLM3-6B** | Added function calling, code interpreter, and agent capabilities |
| 2024 | **GLM-4 Series** | 10T+ tokens pre-training; GLM-4 All Tools supports autonomous tool selection |
| 2025/07 | **GLM-4.5** | 355B MoE (32B active), 23T tokens; open-source MoE SOTA at the time |
| **2026/02** | **GLM-5** | **744B MoE (40B active), 28.5T tokens, MIT license** |
| 2026/03 | **GLM-5-Turbo** | Optimized for OpenClaw agent scenarios; tool-calling error rate down to 0.67% |

From ChatGLM-6B to GLM-5, Zhipu followed a clear strategy: **start with small open-source models to win developer mindshare, then progressively release larger, more capable models**. This is similar to Meta's LLaMA strategy, but Zhipu executed it earlier (in the Chinese market).

---

## Five Core Capabilities of GLM-5

### 1. Creative Writing

GLM-5 shows significant improvement in literary style diversity and Chinese expression quality, handling various genres and contexts effectively.

### 2. Code Generation: From Vibe Coding to Agentic Engineering

Zhipu used an interesting framing in its technical report: GLM-5 aims to transition from "vibe coding" (casual coding) to "agentic engineering" (systematic engineering). It scored **77.8%** on SWE-bench Verified — first among open-source models.

### 3. Multi-Step Reasoning

Scored **50.4** on Humanity's Last Exam (with tools), surpassing Claude Opus 4.5 and GPT-5.2 — the highest publicly reported score to date.

### 4. Agentic Intelligence

GLM-5 supports autonomous planning, tool use, and document generation (Word, PDF, Excel), capable of end-to-end completion of tasks like PRD writing, financial reports, and lesson plan design.

### 5. Long-Context Processing

- Input: **200K tokens**
- Output: **128K tokens**

The 128K output limit is exceptionally high among current models — most models have output limits far below their input limits.

### Hallucination Control

Through the **Slime RL framework**, GLM-5 reduced its hallucination rate from 90% (GLM-4.7) to **34%**, reportedly lower than Claude Sonnet 4.5's previous record.

---

## Technical Architecture

### MoE Design

```
Total Parameters:    744B
Number of Experts:   256
Active per Forward:  top-8 (~40-44B active parameters)
Sparsity Ratio:      ~5.9%
Pre-training Data:   28.5T tokens
Context:             200K input / 128K output
```

### Key Technical Innovations

**DeepSeek Sparse Attention (DSA)**
Dynamically allocates attention resources based on token importance, reducing unnecessary computational overhead.

**Multi-head Latent Attention (MLA)**
Reduces memory overhead by 33% compared to standard multi-head attention.

**Progressive Context Extension**
Rather than training on 200K from the start, context length is expanded in stages:
- 32K (first 1T tokens) → 128K (500B tokens) → 200K (50B tokens)

### Slime: Asynchronous RL Infrastructure

Slime is the core of GLM-5's post-training phase, with several noteworthy design choices:

- **Fully asynchronous**: Inference, evaluation, and parameter update pipelines run independently
- **TITO Gateway** (Token-in-Token-out): Eliminates inconsistencies from re-tokenization
- **FP8 inference**: Accelerates rollout speed
- **Heartbeat-driven fault tolerance**: Automatically handles node failures during training
- Each RL run produces 3,000–6,000 messages, specifically honing long-range planning and tool-use abilities
- Optimization target is **end-to-end latency** rather than aggregate throughput

### Huawei Ascend: Zero NVIDIA Dependency

This may be the most strategically significant technical detail of GLM-5.

In January 2025, the U.S. Department of Commerce added Zhipu to its Entity List. Zhipu promptly transitioned entirely to Huawei Ascend 910B chips and the MindSpore framework. GLM-5's training used approximately **100,000 Ascend 910B chips**.

This proved one thing: **training frontier-class models no longer requires NVIDIA**. While efficiency gaps may still exist, the answer to "can it be done?" is now definitively yes.

---

## Benchmark Comparisons

### Compared to Closed-Source Models

| Benchmark | GLM-5 | Claude Opus 4.5 | GPT-5.2 | Gemini 3 Pro |
|-----------|-------|-----------------|---------|-------------|
| HLE (with tools) | **50.4** | < 50.4 | < 50.4 | — |
| HLE (no tools) | 30.5 | — | — | — |
| AIME 2026 I | 92.7 | 93.3 | — | — |
| GPQA-Diamond | 86.0 | — | — | — |
| SWE-bench Verified | 77.8 | **80.9** | 80.0 | 63.8 |
| SWE-bench Multilingual | 73.3 (9 languages) | — | — | — |

### Open-Source Model Rankings (March 2026)

**Artificial Analysis Intelligence Index:**
- Gemini 3.1 Pro Preview: 57
- GPT-5.4: 57
- Claude Opus 4.6: 53
- **GLM-5 (reasoning mode): 50** ← #1 open-source
- Kimi K2.5: 47
- Qwen3.5: 45

**LMArena Text Arena:**
- GLM-5: 1452 points, overall rank #11, **#1 open-source**

In short: GLM-5 is currently the **strongest open-source model**, even surpassing Claude and GPT on certain benchmarks.

---

## API and Pricing

### Official API (Z.ai / BigModel.cn)

| Model | Input (/1M tokens) | Cache Hit | Output (/1M tokens) |
|-------|---------------------|-----------|----------------------|
| GLM-5 | $1.00 | $0.20 | $3.20 |
| GLM-5-Code | $1.20 | $0.30 | $5.00 |
| GLM-5-Turbo | $1.20 | — | $4.00 |

### Pricing Compared to Competitors

| Model | Input | Output | Ratio (vs GLM-5) |
|-------|-------|--------|-------------------|
| GLM-5 | $1.00 | $3.20 | 1x |
| Kimi K2.5 | $0.60 | $2.50 | Cheaper |
| Claude Opus 4.6 | $5.00 | $25.00 | 5–8x more expensive |
| GPT-5.2 | — | — | Significantly more expensive |

GLM-5's positioning is clear: **near-frontier closed-source capability at open-source pricing**.

### Deployment Options

- **Cloud API**: BigModel.cn, OpenRouter, NVIDIA NIM
- **Local deployment**: Supports vLLM, SGLang, KTransformers, xLLM
- **MIT license**: No restrictions on commercial use

---

## OpenClaw and the Agent Ecosystem

Zhipu has built a complete agent ecosystem around GLM-5:

### OpenClaw

OpenClaw is Zhipu's agent framework, with GLM-5-Turbo specifically optimized for it. It covers six major scenarios:

1. **Information Search** — Web search and data aggregation
2. **Office Automation** — Document generation, report writing
3. **Daily Tasks** — Scheduling, reminders, life management
4. **Data Analysis** — Data processing and visualization
5. **Software Development** — Code generation, debugging, refactoring
6. **Multi-Agent Collaboration** — Multiple agents working together on complex tasks

GLM-5-Turbo's tool-calling error rate is only **0.67%**, far below the 2–6% of other models.

### AutoGLM

AutoGLM is a standalone mobile agent app that uses voice commands to operate a phone and complete various tasks. Zhipu calls it "China's earliest agent model."

### CodeGeeX

Zhipu's AI coding assistant, similar to GitHub Copilot, built on the GLM model series.

---

## Market Positioning

### In China

- **Leader of the AI Six Tigers**: Zhipu is the first among six Chinese AI startups (Zhipu, Moonshot/Kimi, MiniMax, Baichuan, 01.AI, StepFun) to go public
- **Government market leader**: 70% of Chinese government AI spending must use "first-batch" domestic models, and Zhipu holds the largest share
- Serves over 50% of China's top 10 internet companies, with 2.9 million users (15% paying) and 12,000 enterprise clients

### Globally

- **#1 open-source**: Top of both LMArena and Artificial Analysis open-source rankings
- **Sovereign AI**: Provides "AI-in-a-Box" solutions for Southeast Asian and Middle Eastern countries (Indonesia, Vietnam, Malaysia, Singapore, UAE, Saudi Arabia, Kenya)
- Offices in Singapore, the UK, and Malaysia

### Strategic Significance

The biggest story about GLM-5 may not be its benchmark scores, but rather what it proves:

> **A Chinese company on the U.S. Entity List trained a frontier-class model using entirely domestic hardware, then open-sourced it under the MIT license.**

The implications for the global AI landscape may be more far-reaching than any single benchmark score.

---

## Key Takeaways

### Strengths
- **Strongest open-source model**: MIT license + #1 open-source ranking makes it highly attractive to developers
- **Cost-effective**: Near-frontier closed-source capability at 1/5 to 1/8 the price
- **Complete agent ecosystem**: From the base model to the OpenClaw framework to end-user applications (AutoGLM, CodeGeeX)
- **Non-U.S. hardware**: Strategic value for countries and companies affected by export controls
- **Hallucination control**: The Slime RL framework's 34% hallucination rate is a significant improvement

### Challenges
- Software engineering benchmarks like SWE-bench still trail Claude and GPT by about 3 percentage points
- English writing quality and general knowledge benchmarks like MMLU-Pro still show gaps
- Whether Huawei Ascend's training efficiency can keep pace with NVIDIA's iteration speed remains unknown
- International brand recognition lags behind OpenAI, Anthropic, and Google
- Geopolitical factors may affect adoption willingness in international markets

---

## Conclusion

GLM-5 represents an important milestone in China's AI development: it's not just "yet another catch-up model," but one that demonstrates differentiated competitiveness across multiple dimensions — open-source ranking, agent capabilities, cost-effectiveness, and hardware independence.

For developers, GLM-5's MIT license and competitive API pricing make it a serious option — especially if you're building agent applications, need strong Chinese language capabilities, or want vendor diversification.

For those observing the AI industry, Zhipu's journey from a Tsinghua lab to a Hong Kong Stock Exchange listing, and from NVIDIA GPUs to Huawei Ascend, is a story worth understanding in depth.

---

## References

- [GLM-5 Technical Report: from Vibe Coding to Agentic Engineering](https://arxiv.org/html/2602.15763v1)
- [ChatGLM Model Family Paper](https://arxiv.org/abs/2406.12793)
- [GLM-5 on Hugging Face](https://huggingface.co/zai-org/GLM-5)
- [Z.ai Official Website](https://www.zhipuai.cn/en)
- [BigModel.cn API Platform](https://bigmodel.cn/)
