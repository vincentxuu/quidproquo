---
title: "Apple Foundation Models: Privacy-first Ecosystem AI with a 20B Sparse Model on Phones"
date: 2026-08-25
category: tech
tags: [ai-agent, llm, apple-intelligence, model-family-apple, foundation-models, private-cloud-compute, on-device-ai, apple-silicon, model-selection]
lang: en
type: deep-dive
tldr: "Apple Foundation Models (AFM) is Apple's closed-ecosystem AI family. It evolved from a 3B dense model with LoRA adapters in 2024 into five models in 2026. AFM 3 Core Advanced runs a 20B IFP sparse architecture on phones while activating only 1–4B parameters; Cloud Pro runs on Google Cloud NVIDIA GPUs and is refined through Gemini distillation. There is no public API price or third-party benchmark, and access is limited to Apple's Foundation Models framework."
description: "A complete guide to Apple Foundation Models: three generations from AFM in 2024 to AFM 3 in 2026, IFP sparsity and LoRA adapters, Private Cloud Compute security, Gemini distillation, the Foundation Models developer API, and the family's fundamental differences from other LLMs."
series:
  name: "AI 模型家族"
  order: 12
draft: false
glossary:
  - term: "IFP"
    aliases: ["Instruction-Following Pruning"]
    definition: "Apple's sparse activation technique. It chooses an expert subset from the prompt, allowing a 20B-parameter model to run on a phone with the compute cost of 1–4B parameters."
  - term: "Private Cloud Compute"
    aliases: ["PCC"]
    definition: "Apple's cloud AI inference infrastructure. Five guarantees—stateless computation, enforceable guarantees, no privileged access, non-targetability, and verifiable transparency—keep user data inaccessible to everyone, including Apple."
  - term: "PT-MoE"
    aliases: ["Parallel-Track Mixture-of-Experts"]
    definition: "Apple's MoE variant combining track parallelism with expert routing, used by the second- and third-generation AFM server models."
  - term: "Foundation Models framework"
    definition: "Apple's native Swift API for on-device and PCC cloud models, with guided generation, tool calling, and third-party model integration through one interface."
---

> 🌏 [中文版](/posts/tech/2026-08-25-ai-model-family-apple)

In June 2024, Apple introduced Apple Intelligence at WWDC 2024. Underneath were two in-house foundation models: a 3B model running on phones and another on Apple's cloud. Two years later, the AFM 3 family had expanded to five models. AFM 3 Core Advanced runs a sparse 20B-parameter architecture on the iPhone while activating only 1–4B parameters per request. The strongest model, AFM 3 Cloud Pro, runs on NVIDIA GPUs in Google Cloud and is refined through Gemini distillation. This is the eleventh family deep dive in the “AI Model Families” series, tracing Apple's complete evolution from the original AFM to AFM 3.

For guidance on reading the benchmark numbers cited here, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en). This article is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) series.

## Family Evolution Timeline

| Version | Date | Key facts |
|---|---|---|
| First-generation AFM | 2024-06 | ~3B on-device dense model + server model; LoRA adapters switch tasks; Apple Intelligence debuts |
| Technical report | 2024-07 | arXiv 2407.21075; first benchmark comparison with GPT-4, Llama-3-70B, and others |
| PCC launch | 2024-10 | Private Cloud Compute goes live; security researchers can verify all production software |
| Second-generation AFM | 2025-06 | Server model moves to PT-MoE; Foundation Models framework opens to developers |
| IFP paper | 2025-01 | arXiv 2501.02086 introduces Instruction-Following Pruning |
| AFM 3 | 2026-06 | Five models, IFP sparsity, Google collaboration, and PCC extended to NVIDIA GPUs |
| PCC on Google Cloud | 2026-06 | NVIDIA Confidential Computing + Intel TDX + Google Titan; industry's first third-party-hardware confidential inference pipeline |
| Framework open-source announcement | 2026-06 | Apple promises “later this summer”; companion package already on GitHub under Apache-2.0 |
| Free PCC access | 2026-08 | Small Business Program developers with fewer than two million downloads can use PCC cloud models for free |

Three generations and nine milestones. Apple's primary direction is not “build the strongest general model,” but **integrate models deeply into the OS and use privacy architecture as a moat**. Every technical choice—dynamic LoRA adapters, IFP sparsity, and PCC stateless computation—serves that strategy.

## Five Models: Two On-device Tiers and Three Cloud Tiers

AFM 3, released in June 2026, is the current generation. According to [Apple Machine Learning Research](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models), the family contains five models:

| Model | Parameters | Architecture | Deployment | Positioning |
|---|---|---|---|---|
| AFM 3 Core | 3B | Dense | On-device, all supported devices | Lightweight general tasks |
| AFM 3 Core Advanced | 20B | IFP sparse | On-device, latest Apple silicon | Complex on-device inference |
| AFM 3 Cloud | Undisclosed | PT-MoE | PCC on Apple silicon | General cloud inference |
| ADM 3 Cloud (Image) | Undisclosed | Diffusion | PCC on Apple silicon | Image generation and editing |
| AFM 3 Cloud Pro | Undisclosed | Undisclosed | PCC on Google Cloud NVIDIA GPU | Agentic tool use and complex reasoning |

Apple **discloses parameter counts only for the on-device models**. It has not published counts for any of the three cloud models.

The most obvious difference from other families is the absence of a price table. Apple does not sell API tokens as OpenAI, Anthropic, and Google do. AFM is available only through Foundation Models on Apple platforms and has no standalone API pricing. Eligible small developers in the App Store Small Business Program with fewer than two million downloads can [use PCC cloud models for free](/posts/ai/2026-08-25-apple-pcc-free-afm3-en).

## Architecture: Three Generations of Technical Evolution

### Generation One: Task Switching with LoRA Adapters (2024)

The first generation placed several **LoRA adapters** on one ~3B base model. Each rank-16 adapter occupied only tens of megabytes and specialized in a task such as summarization, rewriting, or notification classification. The system could load, cache, and swap adapters dynamically, turning one small model into several specialists.

Compression was aggressive: mixed 2-bit/4-bit quantization averaged 3.7 bits per weight, with a LoRA accuracy-recovery adapter restoring quality lost to quantization. Training used Apple's open-source, JAX/XLA-based [AXLearn](https://github.com/apple/axlearn).

### Generation Two: PT-MoE and Foundation Models (2025)

The server model moved from dense architecture to **Parallel-Track Mixture-of-Experts (PT-MoE)**, Apple's MoE variant. The on-device model expanded to 15 languages and gained image understanding.

The largest change was the debut of the native Swift **Foundation Models framework**, which let developers call the on-device model directly:

- **Guided generation:** a developer defines a Swift struct and macro annotation; the framework injects type constraints; constrained and speculative decoding guarantee the output format. It is a characteristic example of Apple's vertical integration across model, OS, compiler, and Swift.
- **Tool calling:** implement Swift's `Tool` protocol and the framework handles call graphs for parallel or sequential tool execution.
- Apple explicitly says: “It is not designed to be a chatbot for general world knowledge.”

### Generation Three: IFP Sparsity and Gemini Distillation (2026)

**Instruction-Following Pruning (IFP)** is AFM 3's most important technical advance. The original paper ([arXiv 2501.02086](https://arxiv.org/abs/2501.02086)) appeared in January 2025; AFM 3 Core Advanced is its first production deployment.

Conventional LLM inference requires every weight in DRAM. IFP stores 20B parameters in NAND flash. A lightweight dense block reads the prompt, selects a 1–4B expert subset, and moves only that subset into DRAM. Routing happens once per **prompt**, not per token, because NAND-to-DRAM bandwidth is too slow for expert swaps at every token.

The paper's key result: a configuration activating 3B parameters beat a 3B dense baseline by **5–8 absolute percentage points** on math and coding while matching a 9B dense model.

**Gemini supplies a teacher signal, not the runtime model.** Apple SVP Craig Federighi said, “The amount of the Google Assistant we use is none.” Apple AI VP Amar Subramanya described the models as “custom builds for Apple Silicon, trained using proprietary data, and refined using outputs from Gemini frontier models.” Apple does not run Gemini in production; it uses Gemini output for post-training distillation.

## Private Cloud Compute: Apple's Security Moat

PCC is more than Apple's cloud inference service; it is the key to Apple's AI strategy. According to [Apple Security Research](https://security.apple.com/blog/private-cloud-compute), PCC has rested on five guarantees since 2024:

1. **Stateless computation:** user data is deleted after processing, with no logs retained.
2. **Enforceable guarantees:** technical mechanisms enforce the guarantees; they do not depend on policy.
3. **No privileged runtime access:** there is no remote shell or Developer Mode, and even Apple staff cannot access the runtime.
4. **Non-targetability:** physical access cannot be used to target a specific user.
5. **Verifiable transparency:** every production software image is published for independent verification by security researchers.

The foundation is Apple silicon servers, a security-focused subset of iOS/macOS, Secure Enclave, and Secure Boot. A user device verifies a PCC node's cryptographic attestation and confirms that it runs published software before sending an encrypted inference request.

In 2026, PCC [expanded to Google Cloud](https://security.apple.com/blog/expanding-pcc). Apple layered its own software security over NVIDIA Confidential Computing, Intel TDX, and Google Titan to retain all five guarantees. Apple calls it the industry's first confidential inference pipeline on third-party hardware to reach this security level.

## Benchmarks: Apple Compares Only with Apple

Apple's benchmark strategy differs from every other family in the series: **after the first generation, it stopped publishing comparisons against external models**.

The sole direct comparison is the 2024 first-generation technical report.

**IFEval (Instruction Following):**

| Model | Instruction-level Accuracy |
|---|---|
| **AFM-on-device (~3B)** | **85.7%** |
| Llama-3-8B | 82.5% |
| Phi-3-mini | 67.9% |
| Mistral-7B | 65.2% |

| Model | Instruction-level Accuracy |
|---|---|
| **AFM-server** | **88.5%** |
| Llama-3-70B | 88.1% |
| GPT-4 | 85.4% |
| Mixtral-8x22B | 79.4% |
| GPT-3.5 | 74.8% |

Starting with generation two, all results became side-by-side human preference studies against Apple's prior model. There is no MMLU, SWE-bench, GPQA, or LiveBench. AFM 3 Cloud was preferred to the 2025 server model by **56% to 11%** in English and **68.3% to 6.9%** across PFIGSCJK languages. AFM 3 Cloud Pro improved on Cloud by about 10% in text and 14% in image understanding and math.

Apple's apparent position is that it builds OS-integrated features rather than a general LLM, so task-level human evaluation matters more than benchmark scores. The consequence is that external developers cannot compare AFM directly with GPT, Claude, Gemini, or DeepSeek.

## Where It Sits Among Competitors

Apple Foundation Models is the outlier in this series; the comparison dimensions differ from the other nine families:

| Dimension | Apple AFM | Claude | GPT | Gemini | DeepSeek |
|---|---|---|---|---|---|
| Access | iOS/macOS framework only | API | API | API | API + open-weight self-hosting |
| Price | Free for qualifying developers | $1–$50/MTok | $0.15–$30/MTok | $0.08–$12/MTok | $0.07–$8/MTok |
| Open weights | ✗ | ✗ | ✗ | ✗ | ✓ MIT |
| On-device | ✓ (core design) | ✗ | ✗ | ✓ (Nano family) | ✗ |
| Third-party benchmarks | ✗ (Apple-only comparisons) | ✓ | ✓ | ✓ | ✓ |
| Privacy guarantee | Architectural | Policy | Policy | Policy | Policy |
| Cross-platform | iOS / macOS / visionOS only | All platforms | All platforms | All platforms | All platforms |
| EU availability | ✗ (not on iPhone/iPad) | ✓ | ✓ | ✓ | ✓ |

Three fundamental differences place AFM in its own category:

1. **It sells an ecosystem, not an API.** Apple is not an LLM API provider. AFM exists to make iOS apps better. You cannot build a cross-platform AI product on AFM, but you can give an iOS app free AI features.
2. **Privacy is an architectural decision, not a promise.** PCC's stateless computation and verifiable transparency are technically enforceable. No other family in the series offers the same design.
3. **On-device is the home field.** Other families treat on-device as an experiment, as with Gemini Nano, or ignore it. Apple directs its most novel technique—IFP sparsity—to the on-device model because that is its core differentiator.

## Licensing and Access

AFM is **entirely closed**: no open weights, independent API, or downloadable model files. There is one route:

1. Join the Apple Developer Program for $99/year.
2. Call Foundation Models through Swift on iOS 26+, macOS, and other Apple platforms.
3. On-device inference is free. PCC cloud models are free for Small Business Program developers with fewer than two million downloads; after crossing the threshold, developers receive six months to migrate to a paid plan.

Apple plans to open-source the framework this year, enabling the same API in server-side Swift. An Apache-2.0 companion package is already on GitHub with a Skills API, history management, and a chat-completions adapter.

**Apple permits third-party model integration.** Through the `LanguageModel` protocol, Claude and Gemini can use the same framework. Anthropic has released an Apache-2.0 Swift package.

## Developer Selection: When to Use AFM

**AFM is appropriate when:**

- The app is iOS/macOS-only and does not need cross-platform support.
- Privacy is a core selling point, as in medical, financial, or children's apps.
- The app needs offline AI for structured extraction, classification, summarization, or tool routing.
- A small developer needs AI capability at zero initial cost.

**AFM is not appropriate when:**

- The product must support Android or the Web.
- It needs frontier reasoning or long-context agentic loops.
- It needs public benchmark comparisons with other LLMs.
- It targets the EU or mainland China, where Apple Intelligence was initially unavailable.
- It requires self-hosting or data-sovereignty compliance outside Apple's ecosystem.

**Practical hybrid:** use on-device AFM for free offline work and connect Claude or Gemini through `LanguageModel` for hard tasks, preserving provider flexibility.

## References

- [Introducing Apple's On-Device and Server Foundation Models — Apple ML Research (2024)](https://machinelearning.apple.com/research/introducing-apple-foundation-models)
- [Apple Intelligence Foundation Language Models — arXiv 2407.21075](https://arxiv.org/abs/2407.21075)
- [Updates to Apple's On-Device and Server Foundation Language Models — Apple ML Research (2025)](https://machinelearning.apple.com/research/apple-foundation-models-2025-updates)
- [Introducing the Third Generation of Apple's Foundation Models — Apple ML Research (2026)](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)
- [Instruction-Following Pruning for Large Language Models — arXiv 2501.02086](https://arxiv.org/abs/2501.02086)
- [Private Cloud Compute: A new frontier for AI privacy in the cloud — Apple Security Research (2024)](https://security.apple.com/blog/private-cloud-compute)
- [Expanding Private Cloud Compute — Apple Security Research (2026)](https://security.apple.com/blog/expanding-pcc)
- [Foundation Models — Apple Developer Documentation](https://developer.apple.com/documentation/foundationmodels)
- [Accessing Private Cloud Compute — Apple Developer](https://developer.apple.com/private-cloud-compute)
- [Apple Is Open-Sourcing the Foundation Models Framework — Blake Crosley](https://blakecrosley.com/blog/foundation-models-open-source)
- [Apple's Third-Generation Foundation Models: A Developer's Read — ofox.ai](https://ofox.ai/blog/apple-foundation-models-3-wwdc-2026-developer-read)
- [Apple Opens Free Cloud Compute Access for Small Developers — INSIDE (in Mandarin)](https://www.inside.com.tw/article/42165-apple-foundation-model-cloud-developers)
