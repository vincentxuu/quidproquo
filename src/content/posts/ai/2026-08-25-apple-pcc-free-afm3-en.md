---
title: "Apple Opens Free Private Cloud Compute Access: AFM 3 and What Developers Need to Know"
date: 2026-08-25
category: ai
type: deep-dive
tags: [apple-intelligence, foundation-models, private-cloud-compute, on-device-ai, apple-silicon, ios, swift]
lang: en
tldr: "Apple is giving App Store Small Business Program developers free access to AFM 3 models on Private Cloud Compute if their apps have fewer than two million first-time downloads. The five-model family includes the sparse 20B-parameter AFM 3 Core Advanced, which activates only 1–4B parameters on-device, and AFM 3 Cloud Pro on Google Cloud NVIDIA GPUs, refined with outputs from Gemini."
description: "A guide to Apple's third-generation Foundation Models (AFM 3): five model architectures, IFP sparsity, Gemini's role in refinement, eligibility for free Private Cloud Compute access, the Foundation Models framework's open-source status, and limits including availability in the EU and China."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-apple-pcc-free-afm3)

At WWDC 2026 in June, Apple introduced the third generation of Apple Foundation Models (AFM 3) and announced that qualifying small developers could use its cloud models on Private Cloud Compute (PCC) **for free**. The announcement was easy to miss amid the rest of WWDC, but for independent developers and small studios, it may be the first opportunity to add a frontier-class model to an app without first taking on a cloud AI bill.

## Eligibility for Free Access

According to the [official Apple Developer page](https://developer.apple.com/private-cloud-compute), developers must meet all three conditions:

1. **Participate in the App Store Small Business Program** (membership in the $99-per-year Apple Developer Program, with revenue below $1 million in the previous year)
2. **Have fewer than two million total first-time downloads across all apps**
3. **Obtain the Private Cloud Compute entitlement** by applying with an Apple ID on the entitlement page

TestFlight and ad hoc test installations **do not count** toward the download total. Developers can check cumulative downloads in App Store Connect Analytics. If an app later exceeds two million downloads, or the developer no longer qualifies for the Small Business Program, Apple will provide notice and a **six-month transition period** to move to a paid plan rather than cutting access immediately.

The implication is clear: Apple wants small developers to start building and create an ecosystem of apps that depend on PCC. Once an app grows beyond the threshold, it is already tied to Apple's API and privacy architecture, which raises the cost of moving elsewhere.

## AFM 3: Five Models for Two Compute Environments

According to an [Apple Machine Learning Research article](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models), AFM 3 is a five-model family developed with Google across on-device and cloud environments.

### On-Device

| Model | Parameters | Architecture | Characteristics |
|---|---|---|---|
| AFM 3 Core | 3B | Dense | Direct upgrade from the previous generation; runs on every supported device |
| AFM 3 Core Advanced | 20B | Sparse (IFP) | Activates only 1–4B parameters per request; newest Apple silicon only |

AFM 3 Core Advanced is the most interesting technical development. Conventional large language models need all their weights in DRAM for inference, but phones have limited memory. Apple stores the full 20B-parameter model in NAND flash. When a prompt arrives, **Instruction-Following Pruning (IFP)** uses a lightweight dense block to choose the required experts and moves only the selected 1–4B parameters into DRAM.

Apple did not invent IFP at the last minute. The original paper ([arXiv 2501.02086](https://arxiv.org/abs/2501.02086)) appeared in January 2025. Its key result was that a configuration with 3B activated parameters beat a 3B dense baseline by **5–8 absolute percentage points** on math and coding while matching the quality of a 9B dense model. In other words, the compute cost of 3B delivered the effect of three times as many parameters.

> The critical difference is that routing happens once per **prompt**, not once per token as in a conventional Mixture-of-Experts architecture. NAND-to-DRAM bandwidth is not fast enough to swap experts for each token without prohibitive latency.

The design also allows inference-time flexibility. A simple task can load a 1B expert subset; a complex task can load up to 4B, trading speed for quality. According to an [ofox.ai developer analysis](https://ofox.ai/blog/apple-foundation-models-3-wwdc-2026-developer-read), this is the first dynamically sparse LLM shipped at consumer scale.

### Cloud: Private Cloud Compute

| Model | Hardware | Use |
|---|---|---|
| AFM 3 Cloud | Apple silicon | General inference, prioritizing speed and efficiency |
| ADM 3 Cloud (Image) | Apple silicon | Image generation and editing for Image Playground and Genmoji |
| AFM 3 Cloud Pro | Google Cloud NVIDIA GPU | Highest capability: agentic tool use and complex reasoning |

All three cloud models run on Private Cloud Compute. Apple **has not disclosed parameter counts for any cloud model**; only the on-device models have public figures. AFM 3 Cloud and ADM 3 Cloud run on Apple's own Apple silicon servers. For AFM 3 Cloud Pro, Apple worked with Google and NVIDIA to extend PCC's privacy guarantees to NVIDIA GPUs in Google Cloud.

In Apple's human evaluation, AFM 3 Cloud was preferred over the 2025 server model by **56% to 11%** on English tasks, with large gains across languages (68.3% to 6.9% for PFIGSCJK languages). AFM 3 Cloud Pro improved on AFM 3 Cloud by about **10% for text** and **14% for image understanding and math**.

One caveat matters: **Apple published no third-party benchmark results**—no MMLU, SWE-bench, or GPQA. Every comparison is a side-by-side human preference evaluation against Apple's own 2025 baseline. These numbers are not a competitive ranking against GPT-5.5, Claude Opus 4.8, or Gemini 3.1 Pro.

PCC's central promise is privacy: user data **is not stored or shared with anyone, including Apple**. That is the fundamental distinction from other cloud AI services. The claim is not simply “we promise not to inspect your data”; the architecture is intended to make inspection impossible.

## Gemini's Role: Teacher Signal, Not Runtime

Apple's relationship with Google is easy to misread. Two Apple executives have described it this way:

> “The amount of the Google Assistant we use is none.” — Craig Federighi, SVP Software Engineering ([9to5Mac](https://9to5mac.com))

> “All of these are custom builds for Apple Silicon, trained using proprietary data, and refined using outputs from Gemini frontier models.” — Amar Subramanya, Apple AI VP ([CNBC](https://www.cnbc.com))

The two statements fit together: Apple **does not run Gemini in production**. It uses Gemini outputs for distillation-style refinement during post-training. Google's involvement is deeper for AFM 3 Cloud Pro—several reports describe Gemini-derived training infrastructure—but Apple still leads pre-training and post-training, and inference runs on NVIDIA GPUs.

This reflects a broader industry pattern in 2026: frontier labs train teacher models and downstream organizations distill from them. Apple is the largest distribution channel to acknowledge the arrangement publicly.

## Foundation Models Framework: One Swift API

Foundation Models is Apple's native Swift framework. Developers use the same interface for on-device models and PCC cloud models. According to a [WWDC 2026 session](https://developer.apple.com/videos/play/wwdc2026/339), PCC models provide a **32K-token context window** and reasoning capabilities. Image input is new this year, enabling image descriptions, structured receipt extraction, and UI-element classification without a cloud request.

### An Open Provider Strategy

Apple introduced the `LanguageModel` protocol so third-party models can implement the same interface. Anthropic has released an Apache-2.0 Swift package that makes Claude a compatible backend; Google and OpenAI also have integrations. Developers can call different providers through the same API:

```swift
// 同一套 API，不同 provider
let session = LanguageModelSession()
let response = try await session.respond(to: "分析這張照片的內容")
// response.tokenUsage — iOS 27 beta 新增的 token 消耗追蹤
```

### Open-source Status

At Platforms State of the Union, Apple promised to open-source the Foundation Models framework “later this summer” so the same Swift API could run server-side. The framework itself **is not yet open source**, but Apple has released an Apache-2.0 companion Swift package on GitHub containing:

- **Skills API:** a result builder that injects task-specific instructions into a session transcript on demand, avoiding context pollution
- **History management modifiers:** discard completed tool calls, maintain rolling windows, and summarize history so long agentic loops stay within context limits
- **Chat-completions adapter:** connect any server implementing a chat-completions REST API, including a local MLX-LM Server, to Foundation Models' programming model

Apple labels the repository “emerging and experimental,” and its API surface may still change.

## What It Means for Small Developers

**The savings are not only financial.** GPT-4o costs about $10 per million output tokens, while Claude Sonnet 4 costs about $15. If an app with 100,000 monthly active users triggers an AI feature five times per user per day, API charges alone could consume much of a small studio's margin. Apple reduces that cost to zero, letting a developer build the feature and validate product-market fit before solving for scale.

**Where on-device works—and where it does not.** The current capability boundary makes on-device models suitable for structured extraction, classification, embedded summarization, and tool routing. Long context, agentic loops, frontier reasoning, and multi-image vision-language tasks still need the cloud. A practical design is hybrid: perform free offline work on-device and fall back to a cloud model for hard tasks.

**The free quota's boundary remains unclear.** Apple has not disclosed compute limits, rate limits, or monthly token allowances. There is no written answer to how much inference “free” access can support, and entitlement review has no guaranteed SLA. Developers should not place a core feature entirely on this free access without a fallback path.

**Lock-in is real.** Once an app's AI feature is built on Foundation Models, moving platforms is expensive. The API differs, and PCC's privacy architecture itself becomes part of App Store review and user trust. Apple is offering an incentive while building a moat.

## Limitations to Keep in Mind

- **Unavailable in the EU and mainland China:** Apple Intelligence initially does not operate on iPhone and iPad in those regions. Identical iPhones can expose different capabilities depending on the Apple ID region. Apps need a fallback for “Apple Intelligence unavailable.”
- **The two-million-download threshold** sounds high, but if an app becomes a hit, six months may not be enough to migrate to and test the paid plan.
- **Unknown model ceiling:** AFM 3 Cloud Pro is the strongest model, but Apple has not said whether free access includes Cloud Pro or only the base AFM 3 Cloud.
- **No third-party benchmarks:** Apple reports preference evaluations only against its previous model, not standard tests such as MMLU or SWE-bench. You must test performance on your own task.
- **No firm open-source date:** “later this summer” is Apple's wording. The companion package is on GitHub, but the core framework is not.
- **Device limits:** AFM 3 Core Advanced supports only the latest Apple silicon—iPhone 15 Pro and newer. Older devices get only the 3B AFM 3 Core.

## Overall

Apple is using free PCC access to attract small developers to AI features while Foundation Models creates a unified abstraction layer. AFM 3 Core Advanced's sparse IFP architecture is the technical highlight: a 20B-parameter model runs on a phone while activating only 1–4B parameters per request, and 3B of compute buys the quality of 9B. It is the first dynamically sparse LLM shipped at consumer scale.

Gemini supplies a teacher signal rather than a runtime model. Apple uses Gemini output for distillation-style refinement, but users interact with Apple's own models. That pattern is becoming an industry norm.

For independent developers in Taiwan, this is worth trying: zero initial cost, a native Swift API, and privacy guarantees that can become an app selling point. Remember three constraints: the free allowance is not defined, EU and China availability is a hard limit, and Apple designed the ecosystem to create lock-in. The safest approach is to preserve provider choice through the `LanguageModel` protocol instead of hard-coding all logic against Apple-specific APIs.

## References

- [Accessing Private Cloud Compute — Apple Developer](https://developer.apple.com/private-cloud-compute)
- [Introducing the Third Generation of Apple's Foundation Models — Apple Machine Learning Research](https://machinelearning.apple.com/research/introducing-third-generation-of-apple-foundation-models)
- [Instruction-Following Pruning for Large Language Models — arXiv 2501.02086](https://arxiv.org/abs/2501.02086)
- [What's new in the Foundation Models framework — WWDC 2026](https://developer.apple.com/videos/play/wwdc2026/241)
- [Build with the new Apple Foundation Model on Private Cloud Compute — WWDC 2026](https://developer.apple.com/videos/play/wwdc2026/319)
- [Bring an LLM provider to the Foundation Models framework — WWDC 2026](https://developer.apple.com/videos/play/wwdc2026/339)
- [Foundation Models — Apple Developer Documentation](https://developer.apple.com/documentation/foundationmodels)
- [Apple Is Open-Sourcing the Foundation Models Framework — Blake Crosley](https://blakecrosley.com/blog/foundation-models-open-source)
- [Apple's Third-Generation Foundation Models: A Developer's Read — ofox.ai](https://ofox.ai/blog/apple-foundation-models-3-wwdc-2026-developer-read)
- [Apple Opens Free Cloud Compute Access for Small Developers — INSIDE (in Mandarin)](https://www.inside.com.tw/article/42165-apple-foundation-model-cloud-developers)
