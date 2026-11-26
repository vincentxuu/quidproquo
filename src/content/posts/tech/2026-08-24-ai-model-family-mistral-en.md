---
title: "Mistral——Europe's Open-Weight Challenger: From Mixtral to the Trillion-Parameter Large 4, Competing on Efficiency and Sovereignty"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, mistral, mistral-ai, model-family-mistral, open-source, europe, moe, multimodal, model-selection]
lang: en
type: deep-dive
tldr: "Mistral is Europe's largest AI lab, betting on open weights plus sovereign European deployment. Its current workhorse is Mistral Large 4 (October 2026): a 1T-total, 52B-active multimodal MoE with 1M context, released under the Mistral Ecosystem Open-Weight License (a modified MIT) and priced at $0.70/$2.10 on the API. The low-cost option is Small 4 (119B / 6.5B active, Apache 2.0, $0.15/$0.60). Large 4 is the strongest Western open-weight model for coding and security work, but it still trails the top Chinese open models on aggregate reasoning."
description: "Complete Mistral AI model family guide: evolution 2023→2026, Mixtral's MoE efficiency path, the Large 4 and Small 4 tiers, Ministral/Voxtral/OCR sub-lines, the three open-weight licenses, deprecation dates, and a selection guide for agent developers"
series:
  name: "AI Model Families"
  order: 6
draft: false
glossary:
  - term: "Le Chonk"
    aliases: ["ML4"]
    definition: "Official nickname of Mistral Large 4, public preview on 2026-10-06 and open weights on 10-29"
  - term: "Mistral Ecosystem Open-Weight License"
    definition: "The modified MIT license used for Large 4: commercial use, fine-tuning and redistribution are allowed, but companies running a Model-as-a-Service business need a separate commercial license"
  - term: "Ministral"
    aliases: ["Ministral 3"]
    definition: "Mistral's lightweight line—3B / 8B / 14B for edge devices and low-latency scenarios, Apache 2.0"
  - term: "Vibe"
    definition: "Mistral's consumer and work agent product, renamed from Le Chat on 2026-05-28, with Work, Code and Chat modes"
  - term: "Regional Endpoints"
    definition: "Mistral's regional inference endpoints letting customers choose Europe or the US for inference, meeting GDPR and data-sovereignty requirements"
---

> :globe: [中文版](/posts/tech/2026-08-24-ai-model-family-mistral)

In April 2023, three French engineers who left Meta and Google DeepMind founded Mistral AI—Arthur Mensch, Guillaume Lample, and Timothée Lacroix. The strategy was clear from day one: not the largest models but the most efficient ones, then European data sovereignty as the way into enterprise. Three years later that path reached the trillion scale: Mistral Large 4 (October 2026) is Mistral's first 1T-parameter model and one of the largest open-weight flagships released by a Western lab. This is the sixth family deep-dive in the "AI Model Families" series. The main text covers the Large 4 generation; the path from Mistral 7B to Medium 3.5 lives in the family timeline.

For how to read the benchmarks cited here, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This post is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family positioning and model matrix

Based on the models listed on Mistral's official models overview:

| Model / line | Positioning | Key difference | Access |
|---|---|---|---|
| Mistral Large 4 (`mistral-large-4`) | General flagship: coding, security, documents, vision | 1T total / 52B active MoE, 1M context, $0.70/$2.10 | API; weights under the Mistral Ecosystem Open-Weight License |
| Mistral Small 4 (`mistral-small-2603`) | Low-cost workhorse and self-hosting | 119B total / 6.5B active MoE, 256K, $0.15/$0.60 | API; Apache 2.0 weights |
| Ministral 3 3B / 8B / 14B | Edge and on-device | Dense small models with text and image input | Apache 2.0 weights |
| Voxtral 3 family | Transcription, TTS, voice agents | Small/Mini Transcribe 3, TTS 3, realtime transcription | API (EU-hosted) or self-deployment |
| OCR 4.1, Codestral, Embed models | Document understanding, code completion, vectors | Task-specific services | API |

### Two product lines: open weights for the ecosystem, the sovereign platform for revenue

**Open-weight line** (the `mistralai` org on Hugging Face): from Mistral 7B and Mixtral through Large 4, nearly every Mistral flagship ships weights. Large 3 (December 2025) was Apache 2.0; from 2026 the licenses split—Small 4 and Ministral 3 stay Apache 2.0, Medium 3.5 moved to a modified MIT (with an exception for large-revenue companies), and Large 4 uses the Mistral Ecosystem Open-Weight License (MaaS providers need a separate deal). vLLM, SGLang and llama.cpp all support them.

**Sovereign platform line** (Mistral Studio API, Vibe, Forge): Large 4 was trained in Mistral's own European datacenters, and the preview was served on the same infrastructure; the Regional Endpoints launched in August 2026 let inference run in Europe or the US. The platform also hosts third-party open models—the models overview currently lists Z.ai GLM 5.3, GLM 5.3 Flash and DeepSeek V4.1 Flash.

The two lines reinforce each other: open weights let a company try the API first and move in-house later, while the sovereign platform sells to customers who cannot or will not self-host. The €3B Series D in September 2026 ([funding brief](/posts/daily/2026-09-12-funding-mistral-en)) was also a bet on sovereignty as the product, not on leaderboard scores.

### Sub-lines converge: one general model replaces several specialist lines

Mistral's 2025 naming matrix was the most confusing in this series: general Small/Medium/Large, Magistral for reasoning, Devstral for code, Pixtral for vision, each with its own versions. The 2026 direction is **convergence**:

- Small 4 (2026-03) was the first model to fold Magistral (reasoning), Pixtral (multimodal) and Devstral (agentic coding) into one set of weights, switched with `reasoning_effort`
- Medium 3.5 (2026-04) did the same in the middle tier, replacing Medium 3.1, Magistral and Devstral 2
- Large 4 (2026-10) pushes convergence to the flagship: instruct, reasoning, coding and agents in one set of weights, and Mistral says it will be the base for the next generation of specialist models

So model selection now comes down to two questions: do you need Large 4's capability or Small 4's cost? Specialist needs (speech, OCR, completion) are then matched to the corresponding service.

## Family evolution

| Version | Released | Key facts | What it changed for selection |
|---|---|---|---|
| Mistral 7B | 2023-09 | 7B dense, Apache 2.0 | Showed a small model with a permissive license could get into enterprises |
| Mixtral 8x7B | 2023-12 | 46.7B total / 12.9B active MoE | Started the MoE efficiency path where active parameters set the cost |
| Mistral Large (first) | 2024-02 | First API-only commercial flagship | Added a closed commercial line alongside open weights |
| Mixtral 8x22B | 2024-04 | 141B total MoE | Large open MoE became self-hostable |
| Mistral Small 3.1 | 2025-03 | 24B, Apache 2.0 | 24B became the sweet spot for single-GPU self-hosting; retired 2025-11-30 |
| Magistral / Devstral | 2025-05 to 07 | Reasoning and agentic-coding specialist lines | Specialist lines iterated separately, peak naming complexity; retired from late 2025 through 2026 |
| Mistral 3 (Large 3, Ministral 3) | 2025-12-02 | Large 3 is a 675B total / 41B active MoE under Apache 2.0; Ministral 3 at 3B/8B/14B | The flagship reopened its weights; general flagships no longer API-only |
| Mistral Small 4 | 2026-03-16 | 119B / 6.5B active MoE, 256K, Apache 2.0 | Reasoning, vision and coding merged into one small model, no more picking specialist lines |
| Mistral Medium 3.5 | 2026-04-28 | 128B dense, 256K, modified MIT, $1.50/$7.50 | Mid-tier general model replaced Medium 3.1, Magistral and Devstral 2; deprecated 2026-10-31 |
| Le Chat renamed Vibe | 2026-05-28 | Work, Code and Chat modes | The consumer product shifted from chat to a work agent |
| Regional Endpoints | 2026-08 | Inference region selectable: Europe or US | "Data stays in Europe" could go into the contract |
| Mistral Large 4 preview | 2026-10-06 | 1T-parameter MoE, public preview API, list price $1.36/$4.18 billed at half | Flagship scale caught up with Chinese open models, but specs and license were not final ([model card](/posts/daily/2026-10-07-model-mistral-large-4-en), [launch pricing](/posts/daily/2026-10-10-pricing-mistral-large-4-launch-sale-en)) |
| Voxtral 3 | 2026-10-22 | Transcription, TTS and a voice agent SDK | Voice agents got a full stack from one vendor |
| Mistral Large 4 open weights | 2026-10-29 | Three more weeks of RL, weights on Hugging Face, permanent API price $0.70/$2.10 | The current selection baseline, covered in the sections below ([pricing tracker](/posts/daily/2026-11-03-pricing-mistral-large-4-permanent-price-en)) |

The three-year arc: **build an efficiency reputation with small models, reopen the flagship at the end of 2025, then in 2026 fold the specialist lines back into general models and push scale to a trillion parameters**. For a stretch (2024–2025) the general flagship was API-only; every general flagship since Large 3 has shipped weights, while specialist services such as OCR and Codestral remain API-only.

## Architecture and training trade-offs

### Large 4: fine-grained MoE

The [Hugging Face model card](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B) spells out Large 4's structure: about 1T total parameters, 128 routed experts with 4 active per token plus 1 shared expert; 49B active parameters per token (52B including embeddings and output layers), and a 1.6B vision encoder. The docs card says "52B active, 1.05T total"; the two figures differ in whether embeddings are counted, not in model version.

This continues the Mixtral idea: total parameters set knowledge capacity, active parameters set inference cost. Against Large 3 (675B / 41B), total parameters grew by about half while active parameters grew by about a quarter. The checkpoint embeds a DSpark speculative-decoding draft head, and an NVFP4 quantized checkpoint targets Blackwell GPUs.

### Training: European compute and RL

Large 4 was trained from scratch on 3,800 NVIDIA Grace Blackwell GPUs in Mistral's own European datacenters (Large 3 used 3,000 H200s), with training data spanning 160+ languages including every official EU language. After the preview went live, Mistral ran three more weeks of RL before releasing the weights, with the biggest gains in coding and defensive security: Terminal-Bench 4.0 rose from 28.3% in the preview to 41% while output tokens fell 30%.

That brings two trade-offs:

- **Adjustable reasoning depth**: the weights support low/medium/high (default high); low replaces the preview's none mode. Mistral's emphasis is token efficiency—on the Artificial Analysis Coding Agent Index it ties GLM-5.3 (48%) while using 47% fewer tokens per task on average
- **Security capability versus refusals**: during the preview, security partners and government agencies got a version with reduced moderation and expanded cyber capabilities; the public weights ship with built-in guardrails, refusing 96.6% of malicious cyber requests on average in Mistral's own testing while still handling defensive work like reproducing and patching vulnerabilities

### Small 4: MoE with a small active footprint

Small 4's name is misleading—it is not a 24B dense model but a 119B-total MoE that activates about 6.5B parameters per token (6B excluding embeddings), again with 128 experts and 4 active. Mistral reports 40% lower latency and three times the throughput of Small 3; the minimum deployment is 4× H100 or 1× DGX B200, so "small" refers to inference cost, not single-GPU deployment.

## Evaluation and alternatives

Every figure below names its source; no table mixes scores taken under different conditions.

### Self-reported (Large 4 open weights, 2026-10-29)

| Benchmark | Mistral Large 4 | Comparison (as listed by Mistral) | Conditions |
|---|---|---|---|
| Artificial Analysis Coding Agent Index | 48% | Roughly tied with GLM-5.3; Large 4 uses 47% fewer tokens per task | AA's published reasoning levels |
| Terminal-Bench 4.0 | 41% | Preview 28.3%; Mistral claims first among open-weight models | Same |
| Cognition FrontierCode 2.0 | 19.7% | Mistral claims the lead | Cognition's private benchmark |
| Artificial Analysis Cyber Index | 51% | — | Find, reproduce and patch vulnerabilities |
| Refusal of malicious cyber requests | 96.6% | Mistral claims the highest among open models | Average over cyber prompts in JailbreakBench, StrongREJECT, AgentHarm |
| Surge Code blind human preference | Preferred over GLM-5.3, Kimi K3, DeepSeek V4.1 Flash | Behind only Claude Opus 5.5 | Surge AI blind pairwise |

### Third-party aggregate

The Hugging Face model card cites the Artificial Analysis Intelligence Index v5 at **26** for Large 4, framed as "the highest among Western open-weight models," while acknowledging that leading Chinese open models score higher on this aggregate. The preview scored 38 on v4.3.2, 6–8 points behind GLM-5.3 and Kimi K3 ([model card](/posts/daily/2026-10-07-model-mistral-large-4-en)); v4 and v5 use different scales, so the numbers cannot be subtracted.

### Competitive position

- **Against Chinese open models (GLM-5.3, Kimi K3, DeepSeek V4.x)**: still behind on aggregate reasoning, close on coding-agent indices with clearly lower token use. Large 4's differentiation is that training and serving happen in Europe with traceable lineage—for regulated European customers that is a compliance question, not just a score
- **Against Western open models**: both Mistral and Artificial Analysis put it first among Western open weights
- **Against closed frontier models (Claude, GPT, Gemini)**: it still loses to Claude Opus 5.5 in blind human preference; the preview's high vulnerability-reproduction score (82%) came partly from closed models refusing the task, which reflects refusal policy rather than general capability
- **Small 4**: Mistral only published latency and throughput gains over Small 3; the sources cited here have no comparable scores against same-tier competitors

## Licensing, pricing, and deployment

### Three licenses—check which one applies before you choose

| License | Models | Key restriction |
|---|---|---|
| Apache 2.0 | Small 4, Ministral 3, Large 3, Voxtral Small | No extra terms; commercial use and redistribution allowed |
| Modified MIT (Medium 3.5) | Medium 3.5 | Commercial use allowed, with an exception for large-revenue companies that need a separate deal |
| Mistral Ecosystem Open-Weight License | Large 4 | Commercial use, fine-tuning and redistribution allowed; operating a MaaS business (giving third parties API access with meaningful control over inputs, parameters or training data) requires a separate commercial license. Internal use, or a model embedded only inside specific product features, is exempt |

Note that the FAQ on Mistral's pricing page still says open-weight models are "Apache 2.0 licensed for research/individual use; while commercial deployments require a Mistral license," which does not match the license terms on the individual model cards. Go by the LICENSE file attached to each model's Hugging Face page.

### API pricing (USD per 1M tokens, Mistral docs cards)

| Model | Input | Cached input | Output | Context |
|---|---|---|---|---|
| Mistral Large 4 | $0.70 | $0.07 | $2.10 | 1M |
| Mistral Small 4 | $0.15 | — | $0.60 | 256K |

Batch processing is generally half price and cached input saves up to 90% (pricing-page general rules). For how Large 4's price moved—preview list $1.36/$4.18 billed at half, then a permanent $0.70/$2.10 from 10/29—see the [pricing tracker](/posts/daily/2026-11-03-pricing-mistral-large-4-permanent-price-en).

### Deprecated and scheduled retirements

From the deprecation table on Mistral's models overview:

| Model | Deprecated | Retired | Official replacement |
|---|---|---|---|
| Mistral Large 3 (`mistral-large-2512`) | 2026-10-31 | 2027-04-30 | Mistral Large 4 |
| Mistral Medium 3.5 (`mistral-medium-3-5`) | 2026-10-31 | 2027-04-30 | Mistral Large 4 |
| Mistral Medium 3 / 3.1 | 2026-05-22 | 2026-08-31 | Medium 3.5 (now itself replaced by Large 4) |
| Mistral Small 3.2 | 2026-04-30 | 2026-07-31 | Mistral Small 4 |
| Devstral 2, Magistral Medium 1.2 | 2026-05-22 | 2026-07-31 | Medium 3.5 |
| Mistral Large 2.1, Pixtral Large | 2026-02-27 | 2026-05-31 | Medium 3.5 |

Retirement only affects Mistral's own API; downloaded weights are unaffected. Cloud resellers may retire on different dates—Azure Foundry kept Medium 3 more than 100 days past Mistral's own shutdown ([pricing tracker](/posts/daily/2026-10-31-pricing-azure-foundry-claude-haiku-mistral-retirement-mismatch-en)).

### Deployment

For self-hosting Large 4, Mistral recommends vLLM or SGLang; Transformers and llama.cpp (GGUF) are also supported, and the NVFP4 checkpoint targets Blackwell. The official API runs in multiple regions, including a European deployment Mistral operates end-to-end under European law.

## Agent integration and selection

- **European compliance, self-hosted flagship** → Large 4: downloadable weights, trained and served in Europe; first check whether you count as a MaaS provider
- **Coding agents on a budget** → Large 4 at medium reasoning: Mistral's pitch is token efficiency, nearly half the tokens at the same score, so your bill depends on average output length
- **Defensive security agents (vulnerability reproduction, patching, detection rules)** → Large 4: refuses these tasks less often than most closed models; still validate on your own workload
- **High volume, low latency, Apache 2.0** → Small 4: $0.15/$0.60, with `reasoning_effort` switching between quick replies and deep reasoning
- **Edge and on-device** → Ministral 3 3B / 8B / 14B
- **Voice agents** → Voxtral 3 transcription and TTS with its voice agent SDK
- **Highest aggregate reasoning score** → not Large 4; top Chinese open models and closed frontier models score higher
- **Still on Large 3 or Medium 3.5** → both retire on 2027-04-30; move to Large 4 early and rerun your evaluations. Large 3 is Apache 2.0 and Large 4 is not, so have legal review the license change first

Minimal selection check: run the same 20–50 tasks from your own workload through Large 4 at low/medium/high and through Small 4, and record success rate, average output tokens and cost per task. Large 4's advantage claims center on token efficiency, which is the easiest number to verify on your own data.

## Limitations and trade-offs

- **Aggregate reasoning still lags**: on Artificial Analysis's aggregate index, Large 4 trails the leading Chinese open models; Mistral's "best" claims always carry an "open-weight" or "Western" qualifier
- **Licenses are no longer uniformly permissive**: Large 4's MaaS clause and Medium 3.5's large-revenue exception make "Mistral = Apache 2.0" out of date
- **Specs were inconsistent at launch**: on preview day, official and third-party figures conflicted on active parameters (49B / 52B) and context (1M / 512K); the open-weight model card now states 49B (excluding embeddings) / 52B (including) and 1M context, but third-party platform listings for context should still be checked against the actual API
- **Self-hosting is demanding**: Large 4 is a trillion-parameter MoE; even with NVFP4 it is not a single-machine workload for most teams, and Small 4's minimum is several H100s
- **Most evaluations are self-reported**: apart from the Artificial Analysis aggregate, most figures above are Mistral's own tests or chosen comparisons; against the top of live leaderboards the gap may be larger

## Update history

- **2026-11-23**: Added the Large 4 generation (public preview 2026-10-06, open weights 10-29); rewrote the matrix, evaluation, pricing and selection sections from Mistral's models overview, the Large 4 model card and both launch posts; added a license table and retirement dates. Medium 3.5 and Large 3 moved to history, with details from that time in the daily model card and pricing trackers linked from the timeline. Corrected errors: Large 3 was described as "2025-07, API-only closed commercial model" but is a 675B / 41B-active Apache 2.0 open-weight model released 2025-12-02; Small 4 was described as "2026-06, 24B dense, 128K" but is a 119B / 6.5B-active MoE with 256K released 2026-03-16; Devstral Small 2 was dated 2025-05 but is 2025-12; Le Chat has been renamed Vibe. Removed unsourced competitor scores unrelated to the current generation.
- **2026-10-11**: Restructured sections to the shared family format and added a matrix compiled from existing content. Kept the original versions, prices, and source dates; no new round of fact-checking.

## References

- [Mistral AI Official](https://mistral.ai/)
- [Introducing Mistral Large 4 — Mistral](https://mistral.ai/news/mistral-large-4) — 2026-10-06 preview, 3,800 Grace Blackwell GPUs, preview benchmarks
- [Mistral Large 4 (Le Chonk) is now open weight — Mistral](https://mistral.ai/news/mistral-large-4-oss/) — 2026-10-29 weights, three reasoning modes, Coding Agent Index, Cyber Index, license and permanent price
- [Mistral-Large-4-1T-A52B — Hugging Face](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B) and [LICENSE](https://huggingface.co/mistralai/Mistral-Large-4-1T-A52B/blob/main/LICENSE) — architecture, 1M context, AA Intelligence Index v5, MaaS clause
- [Mistral Large 4 — Mistral Docs](https://docs.mistral.ai/models/mistral-large-4-0) — 52B / 1.05T, $0.70/$2.10
- [Introducing Mistral Small 4 — Mistral](https://mistral.ai/news/mistral-small-4) and [Mistral Small 4 — Mistral Docs](https://docs.mistral.ai/models/mistral-small-4-0-26-03) — 119B / 6B active, 256K, Apache 2.0, $0.15/$0.60
- [Remote agents in Vibe. Powered by Mistral Medium 3.5 — Mistral](https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5/) and [Mistral Medium 3.5 — Mistral Docs](https://docs.mistral.ai/models/mistral-medium-3-5-26-04) — 128B dense, modified MIT, deprecated
- [Introducing Mistral 3 — Mistral](https://mistral.ai/news/mistral-3) — Large 3 675B / 41B, Ministral 3, Apache 2.0
- [Voxtral 3 — Mistral](https://mistral.ai/news/voxtral-3/)
- [Vibe gets to work — Mistral](https://mistral.ai/news/vibe-agent/) — Le Chat renamed Vibe
- [Mistral Models Overview](https://docs.mistral.ai/models) — current models, licenses, deprecation table
- [Mistral Pricing](https://mistral.ai/pricing)
- [Mistral Small 3.1](https://mistral.ai/news/mistral-small-3-1/)
- [Regional Inference and Open Models — Mistral](https://mistral.ai/news/regional-inference-open-models-new-compute/)
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site
