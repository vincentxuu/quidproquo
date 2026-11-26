---
title: "Upstage Solar: Choosing Between Korea's Solar Pro 4 and Solar Mini 4 APIs and the Open-Weight Solar Open 2"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, upstage, korea, open-weight, moe, model-family-solar, model-selection]
lang: en
type: deep-dive
tldr: "Upstage's Solar line has three current branches: the closed Solar Pro 4 API (parameters undisclosed, 512K context), the closed Solar Mini 4 API (35B total, 3B active), and the open-weight Solar Open 2 (250B total, 15B active, 1M context). Its strengths are Korean and Japanese document-heavy office agents and low prices; Artificial Analysis's current index scores Pro 4 at 14, below the median of 21 for its price band. Open 2's license is Apache 2.0 plus a branding clause: derivative models must be named Solar-something and say Built with Solar."
description: "Upstage Solar model family: Solar Pro 4, Solar Mini 4 and Solar Open 2 specs, the hybrid linear-attention architecture, vendor and third-party evaluations, Upstage Solar License terms, Upstage Console and OpenRouter pricing and retirement dates, adoption numbers from HF, Ollama and cloud catalogs, the 2023–2026 timeline, and agent selection."
series:
  name: "AI Model Families"
  order: 44
draft: false
glossary:
  - term: "KDA (Kimi Delta Attention)"
    aliases: ["Kimi Delta Attention"]
    definition: "A linear attention that accumulates context into a fixed-size recurrent state, so the KV cache does not grow with sequence length; 36 of Solar Open 2's 48 layers use it"
  - term: "NoPE (No Positional Encoding)"
    aliases: ["NoPE"]
    definition: "A design in which attention layers use no positional encoding at all; position information comes implicitly from the linear-attention recurrent state, avoiding RoPE's length-extrapolation limit"
  - term: "DUS (Depth Up-Scaling)"
    aliases: ["Depth Up-Scaling"]
    definition: "The scaling method behind SOLAR 10.7B: duplicate and stack an existing model's layers to make it deeper, then continue pre-training, instead of training a larger model from scratch"
---

> :globe: [中文版](/posts/tech/2026-11-23-ai-model-family-upstage-solar)

Solar is the language model family from Upstage, a Korean AI company. This post is for agent developers who want a model from outside the US and China, or who work with Korean and Japanese documents: what Solar Pro 4, Solar Mini 4 and Solar Open 2 are each good for, where the vendor's numbers and third-party numbers diverge, and what the open-weight license requires of derivative models.

As of November 2026, the API offers only the two fourth-generation models: Solar Pro 3, Solar Pro 2 and the old Solar Mini were all retired on October 30, 2026. Teams that want to self-host look at Solar Open 2, released in July. Models from other Korean companies (LG, SKT, KT, Naver and others) are covered in the [Korean models overview](/posts/tech/2026-11-23-ai-model-family-korea-models-en).

For how to read the benchmark numbers below, see the [guide to AI model evaluation sources](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

Upstage frames it as a division of labor: if you need to self-host and data cannot leave the building, use the open-weight Solar Open 2; if you want to hand long, complex work to an API, use Solar Pro 4. Solar Mini 4 was added later as the low-cost, high-volume model. Prices are from [Upstage's pricing page](https://www.upstage.ai/pricing), per 1M tokens, excluding tax:

| Model / line | Role | Key differences | Access and price |
|---|---|---|---|
| Solar Pro 4 (API name `solar-pro4`, version `solar-pro4-260806`) | API flagship for long-document and multi-step tool agents | Parameters undisclosed; 512K context, up to 128K output; reasoning on by default; English, Korean, Japanese | Closed API: list $0.30 / $1.20 (cached $0.06); current promotion $0.15 / $0.60 (cached $0.03) |
| Solar Mini 4 (`solar-mini4`, version `solar-mini4-260922`) | Low-cost, high-volume agent tasks | 35B total, 3B active MoE; 512K / 128K; reasoning off by default | Closed API: list $0.10 / $0.40 (cached $0.01); current promotion $0.05 / $0.20 (cached $0.005) |
| Solar Open 2 (`upstage/Solar-Open2-250B`) | Open weights, self-hosted agent base model | 250B total, 15B active; hybrid linear attention, 1M context; English, Korean, Japanese | Open weights (Upstage Solar License); the official API has been shut down |
| Solar Open 100B (`upstage/Solar-Open-100B`) | Previous open-weight generation | 102B / 12B MoE, 128K context, all-softmax attention | Open weights (Upstage Solar License) |

Two things to know first:

- **The promotional prices have no end date.** The pricing page shows Solar Pro 4 at half price since 2026-10-20 and Solar Mini 4 since 10-11, with no expiry listed; budget against list price as well. Upstage prices exclude 10% VAT.
- **Pro 4 and Mini 4 have no weights.** Upstage's [HuggingFace organization](https://huggingface.co/upstage) holds only their tokenizers. Upstage says both can be deployed on-premises, but that goes through sales.

### Sub-lines and ecosystem

Upstage started out in document AI. Its Document Parse, Document OCR and Information Extract APIs, and Upstage Studio, a no-code document-agent platform built on Solar Pro 4, share one Console account and credit balance with the LLMs. Document Parse's table accuracy appears as a row in this site's [comparison of commercial document parsing APIs](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison-en). The [model catalog](https://console.upstage.ai/docs/models) also lists Syn Pro, a 30B Japanese enterprise model that is not part of the Solar brand.

## Family evolution

| Version | Released | What changed for selection |
|---|---|---|
| SOLAR 10.7B | 2023-12 | Used DUS to deepen Mistral 7B's weights into 10.7B; base under Apache 2.0, Instruct under CC BY-NC 4.0; a popular small open-weight base for fine-tuning at the time |
| Solar Pro preview | 2024-09-10 | 22B under MIT, pitched as 70B-class quality on a single GPU; English only |
| Solar Pro | 2024-11-26 | The 22B release moved to the API and landed on AWS Bedrock Marketplace and SageMaker JumpStart in December |
| Solar Pro 2 | 2025-07-10 | 31B; one model switches between chat and reasoning modes; context grew to 64K |
| Solar Open 100B | Late 2025-12 (announced 2026-01-06) | First output of Korea's Ministry of Science and ICT "Independent AI Foundation Model" project, a 102B-A12B model trained from scratch; license changed to the Upstage Solar License |
| Solar Pro 3 | 2026-01-26 | The API flagship became a 102B / 12B MoE with 128K context, the same specs as Solar Open 100B |
| Solar Open 2 | 2026-07-22 | 250B-A15B, hybrid linear attention, 1M context; the first open-weight Solar pitched at agents |
| Solar Pro 4 | 2026-08-06 (paid from 08-11) | The API flagship pivoted to agents, context grew to 512K; free for the first week, then 90% off, 70% off, and now half price |
| Solar Mini 4 | 2026-09-22 (blog 10-01) | A low-cost model with 3B active parameters, replacing the old 10.7B Solar Mini |

The arc runs from small, dense, carefully tuned models to MoE agent models with long context. Licensing moved with it: early weights shipped under Apache 2.0, MIT or CC BY-NC, while the Solar Open series uses the custom Upstage Solar License. Retirement dates for older API models are in [Licensing, pricing, and deployment](#licensing-pricing-and-deployment). The site has no daily model cards for earlier Solar generations; Upstage's [version history](https://console.upstage.ai/docs/models/history) is the reference for their details.

## Architecture and training trade-offs

### Solar Open 2: linear attention in exchange for 1M context

The design as documented in the [Solar Open 2 model card](https://huggingface.co/upstage/Solar-Open2-250B) and [technical report](https://arxiv.org/abs/2607.20062):

- **MoE backbone**: 48 layers, hidden size 4,096; each layer has 320 routed experts plus 1 shared expert, with 8 routed experts active per token. 250,287,794,944 parameters in total, 15B active per token.
- **Hybrid attention**: every block of four layers is one softmax layer (GQA with a sigmoid output gate) followed by three linear-attention layers (KDA extended to negative eigenvalues), repeated 12 times. Only 12 layers keep a KV cache, so long-context memory is about a quarter of an all-softmax model of the same shape. The softmax layer comes first, the reverse of the linear-first order in Kimi Linear and Qwen3.5.
- **NoPE**: no positional encoding anywhere. Position comes from the linear layers' recurrent state, which sidesteps RoPE's extrapolation limit and takes context from the previous generation's 128K to 1M.
- **Inherited weights**: the 5.69B parameters (about 2.3%) that survive the architecture change were transferred from Solar Open 100B; everything else was randomly initialized and fully pre-trained. In a controlled comparison in Upstage's [blog post](https://www.upstage.ai/blog/en/solar-open-2), the new architecture reached in 210B tokens the MMLU score the old one needed 671B tokens to reach.
- **Data and post-training**: the model card lists about 12T pre-training tokens (the technical report abstract describes a 10T mixture curated from a 20T pool). Post-training first trains 12 domain specialists across tool use, coding, office work and other scenarios, then merges them with multi-teacher on-policy distillation (MOPD).
- **Korean tokenizer**: inherits Solar Open 1's 196,608-token vocabulary. The report measures global-model tokenizers spending 1.2–1.9× more tokens on the same Korean text, which shows up directly in cost and effective context for Korean work.

The cost: self-hosting in BF16 needs at least four H200s (the card recommends eight, and its Quickstart assumes eight GPUs with 141 GB or more each). NotaAI publishes INT4 and NVFP4 quantizations, which Upstage says run on two H200s. The model card's inference examples all use Upstage's own vLLM and Transformers forks; [NVIDIA's Dynamo recipe](https://docs.nvidia.com/dynamo/latest/recipes/solar-open2-250b) likewise notes that the stock runtime has no model definition for it, so a dedicated image is required, and that speculative decoding is not supported.

### Solar Pro 4 and Solar Mini 4: specs only partly disclosed

The [Solar Pro 4 spec page](https://console.upstage.ai/docs/models/solar-pro-4) says "Undisclosed parameters". The [launch post](https://www.upstage.ai/blog/en/solar-pro-4) gives one line on training: it reuses OfficeVerse, the data pipeline introduced with Solar Open 2, which synthesizes office tasks from public data across 11 industries and 12 task types and grades each pass or fail on the final deliverable. Upstage does not say whether Pro 4 and Open 2 share a base model.

[Solar Mini 4](https://www.upstage.ai/blog/en/solar-mini-4) is a 35B-total, 3B-active MoE that Upstage says was "pretrained from the ground up". Note that 3B is per-token compute; all 35B of weights still have to sit in memory. Upstage says a quantized build fits on one H100 80GB, but that is only offered under on-premises contracts, not as a download.

## Evaluation and alternatives

### Third party: Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/solar-pro-4) Intelligence Index v5.0.1 (nine evaluations, including Terminal-Bench 4.0, AutomationBench-AA and GDP.pdf) scores Solar Pro 4 at 14, against a median of 21 for its price band, ranking 27th of 40. It also flags two cost problems: the full index run produced 243 million output tokens (median about 97 million), and each task took around 65 minutes on average (median 6.7). Solar Mini 4, Solar Open 2 and Solar Open 100B all have Artificial Analysis pages but no score on the current index.

Upstage's press release cites "42 on the Artificial Analysis index" for Solar Pro 4, and the Mini 4 post cites "24.1". Both are on the older index from August (the Mini 4 post states v4.3.2). Version 5 is rescaled, so 42 and 14 are not on the same scale, and the old scores cannot be compared with the v5 scores cited elsewhere in this series.

### Vendor-reported: Solar Pro 4 vs. Solar Open 2

From the [Solar Pro 4 launch post](https://www.upstage.ai/blog/en/solar-pro-4). Rows marked "in-house" use Upstage's own evaluation environment; Upstage attributes the rest to Artificial Analysis results from August 2026:

| Benchmark | Solar Open 2 | Solar Pro 4 |
|---|---|---|
| Terminal-Bench v2.1 | 43.2 | 57.0 |
| GDPval-AA v2 | 31.4 | 38.8 |
| BrowseComp (in-house) | 37.3 | 49.2 |
| SWE-Bench Verified, OpenHands (in-house) | 69.2 | 70.6 |
| MCP-Atlas (in-house) | 58.2 | 61.4 |
| τ³-Banking | 18.1 | 23.0 |
| AA-LCR | 62.7 | 71.0 |
| GPQA Diamond | 85.6 | 89.0 |
| KMMLU-Pro (in-house) | 78.4 | 79.2 |
| Ko-GDPval (in-house) | 86.8 | 87.3 |
| Arena-Hard v2 Japanese (in-house) | 75.3 | 81.9 |

How to read it: the gap is in agent execution (terminal tasks, web research, work deliverables); on knowledge, math, coding and Korean professional exams the two are roughly level. That is the basis for Upstage's advice to self-host Open 2 and send long tasks to Pro 4 over the API.

### Vendor-reported: Solar Open 2 vs. open-weight peers

The English table in the [Solar Open 2 model card](https://huggingface.co/upstage/Solar-Open2-250B) compares it with DeepSeek-V4-Flash (284B-A13B, max), MiMo-V2.5 (310B-A15B), Mistral Medium 3.5 (128B dense) and Command A+ (218B-A25B). All numbers are published by Upstage:

| Benchmark | Solar Open 2 | DeepSeek-V4-Flash | MiMo-V2.5 | Mistral Medium 3.5 |
|---|---|---|---|---|
| MMLU-Pro | 86.2 | 85.9 | 84.6 | 81.2 |
| GPQA-Diamond | 86.3 | 88.9 | 83.0 | 77.5 |
| LiveCodeBench v6 | 92.4 | 92.3 | 89.1 | 84.9 |
| SWE-Bench Verified | 70.4 | 73.8 | 73.0 | 69.6 |
| Terminal Bench Hard | 28.3 | 34.1 | 41.7 | 33.3 |
| MCP-Atlas | 58.2 | 58.2 | 63.9 | 30.7 |
| APEX-Agents | 16.6 | 13.2 | 13.4 | 6.1 |
| KMMLU-Pro | 78.4 | 78.9 | 69.1 | — |
| Ko-GDPval (in-house) | 86.8 | 85.0 | 81.0 | — |

- **Knowledge and Korean are on par with DeepSeek-V4-Flash.** On Korean tests such as KMMLU-Pro, CLIcK and KBL it is mostly in the top group; Ko-GDPval is Upstage's own Korean office-agent benchmark.
- **Terminal and software engineering trail.** Terminal Bench Hard is the lowest in the table, and SWE-Bench Verified is below DeepSeek-V4-Flash and MiMo-V2.5.
- **The same model scores differently across two official documents.** In the Pro 4 post, Open 2's LiveCodeBench is 87.0; the model card says 92.4. The 43.2 on Terminal-Bench v2.1 and the 28.3 on Terminal Bench Hard in the model card are different benchmarks. Cite the source and do not merge the tables.

Cross-family context: DeepSeek-V4 is covered in the [DeepSeek family post](/posts/tech/2026-08-24-ai-model-family-deepseek-en), Mistral Medium in the [Mistral family post](/posts/tech/2026-08-24-ai-model-family-mistral-en), and Command A in the [Cohere family post](/posts/tech/2026-08-24-ai-model-family-cohere-en). Other Korean vendors pitching sovereign models are compared in the [Korean models overview](/posts/tech/2026-11-23-ai-model-family-korea-models-en).

### Vendor-reported: Solar Mini 4

From the [Solar Mini 4 launch post](https://www.upstage.ai/blog/en/solar-mini-4): 24.1 on the older index v4.3.2 (Qwen3.6 35B A3B 18, Nemotron 3.5 Lightning 13), AA-LCR 83.3%, SciCode 47.6%, HLE 25.8%, AutomationBench-AA 22.3%, τ³-Banking 47.2. The cost comparison uses only three Korean tasks run three times each: the estimated cost of 1,000 task sets was $1.25 for Mini 4 and $2.20 for MiMo-V2.5. Upstage notes this was a preliminary internal test, without prompt caching, with MiMo called through a third-party router.

## Licensing, pricing, and deployment

### Upstage Solar License: Apache 2.0 plus a branding clause

[Solar Open 2](https://huggingface.co/upstage/Solar-Open2-250B/blob/main/LICENSE) and [Solar Open 100B](https://huggingface.co/upstage/Solar-Open-100B/blob/main/LICENSE) use the same Upstage Solar License (the two LICENSE files are identical). The HF metadata only says `license: other`; the full text is needed to see what it means. The preamble says it "basically adopts all provisions of the Apache License 2.0, including the principle of allowing commercial use"; the difference is Section 4(e).

| Situation | Conditions |
|---|---|
| Commercial use, internal use, serving it through an API | Same as Apache 2.0; no revenue or MAU threshold and no regional exclusion |
| Redistributing the model or modified files | Include the license, keep copyright and NOTICE, mark changes, as in Apache 2.0 |
| Distributing or making available a "Derivative AI Model" (trained, fine-tuned, distilled or otherwise improved from it) | The model name must begin with "Solar" (e.g. `Solar-MyModel-v1`); related websites, interfaces or documentation must prominently display "Built with Solar"; include this license |
| Using the Solar name | Must not imply Upstage endorsement or suggest an official Upstage product |

So a team that fine-tunes Solar Open 2 and releases the result under its own brand is constrained on naming and attribution, while a team that only runs inference or embeds it in a product faces terms close to Apache 2.0. The Solar Open 100B repo also states that its code files (`.py`, `.json`, `.jinja`) are Apache 2.0; only the weights fall under the Solar License.

Solar Pro 4 and Solar Mini 4 are closed APIs under the Upstage Console terms. Their model pages state that API input is not used for training and is not stored unless the service requires it.

### API pricing

- **Solar Pro 4**: list $0.30 / $1.20, cached $0.06; since 10-20 the promotion is $0.15 / $0.60, cached $0.03. On [OpenRouter](https://openrouter.ai/upstage/solar-pro4), Upstage's endpoints carry the promotional price, and KT also hosts it at list price.
- **Solar Mini 4**: list $0.10 / $0.40, cached $0.01; since 10-11 the promotion is $0.05 / $0.20, cached $0.005. On [OpenRouter](https://openrouter.ai/upstage/solar-mini4), Upstage is the only host.
- Both list 524,288 context and up to 131,072 output tokens on OpenRouter, with tool calling, parallel tool calls, structured outputs and `reasoning_effort`.
- Upstage Console also has prepaid plans: $100 or more per month adds 10% bonus credit and higher rate limits.

### Retirements and replacements

Per the [version history](https://console.upstage.ai/docs/models/history) and the pricing page:

- `solar-pro3`, `solar-pro2` and the old `solar-mini` were retired on 2026-10-30 (KST); Upstage directs users to the `solar-pro4` and `solar-mini4` aliases.
- The `solar-open2` API was only ever a closed beta and ended on 2026-08-12; only the HuggingFace weights remain.

### Adoption and distribution

| Metric | Numbers |
|---|---|
| OpenRouter usage | Solar Mini 4 is 7th in New & Trending, with 1.19T tokens over the last seven days and week-over-week growth above 999% ([rankings](https://openrouter.ai/rankings), a single-week snapshot); Upstage's press release claims Solar Pro 4 passed 370 billion tokens within a week of listing |
| HF downloads, last 30 days | Solar-Open-100B 75,145 (612,873 all time); Solar-Open2-250B 6,347 (57,547 all time); SOLAR-10.7B-Instruct 43,694 |
| HF derivative models | Solar-Open2-250B: 18 (15 quantizations, 3 fine-tunes); Solar-Open-100B: 20; SOLAR-10.7B-Instruct: 257 (194 adapters) |
| Ollama official library | Old models only: `solar` (10.7B) with 1M downloads and `solar-pro` (Pro preview) with 591.4K, both untouched for two years; no official image for Solar Open 2 or the fourth generation |
| Cloud marketplaces | Upstage's [deployment options table](https://console.upstage.ai/docs/deployment-options) lists Solar Pro 4 and Mini 4 only on Upstage Console, not on AWS (Bedrock, SageMaker), Azure or Snowflake; AWS Marketplace still carries a Solar Pro 2 SageMaker package |

How to read it: fourth-generation API usage comes mainly through OpenRouter and Nous Research's Hermes Agent, and the large cloud catalogs have not caught up. On the open-weight side, Solar Open 2's downloads and derivative count are far below the previous generation's, and community activity is mostly quantization; that is a different order of magnitude from SOLAR 10.7B, which accumulated more than 250 derivatives.

## Agent integration and selection

- **High-volume, schema-driven extraction, classification and tool calls** → Solar Mini 4. At the promotional $0.20 per 1M output tokens with reasoning off by default; start at the lowest `reasoning_effort` and raise it only if quality falls short.
- **Long-document office agents in Korean or Japanese** (contract comparison, spreadsheets through to reports and slides) → Solar Pro 4. This is where Upstage has invested most, and it ships example agents in its [Agent Cookbook](https://www.upstage.ai/blog/en/solar-pro-4); but Artificial Analysis found it slow and verbose, so count latency and output tokens in the cost.
- **Data must stay on-premises, self-hosting required** → Solar Open 2, on at least four H200s (BF16) or two H200s (quantized). If you plan to fine-tune and publish, first confirm your team accepts Solar naming and the Built with Solar notice.
- **Primary coding agent or terminal work** → not the first choice. Solar Open 2's self-reported Terminal Bench Hard and SWE-Bench Verified both trail DeepSeek-V4-Flash and MiMo-V2.5.
- **English-first work judged by overall score** → there are higher-scoring options at the same price; Pro 4's current index score of 14 is below the median of 21.
- **Need billing and compliance through AWS Bedrock, Azure or similar marketplaces** → the fourth generation is not there yet; the options are Upstage Console, OpenRouter, or an on-premises contract.

A minimal selection test: take a set of your own Korean or Japanese document tasks and run them on Solar Mini 4 (lowest `reasoning_effort` and default) and on Solar Pro 4, recording completion rate, output tokens, latency and cost. Upstage's API is OpenAI-SDK compatible: set `base_url` to `https://api.upstage.ai/v1` and the model to `solar-mini4` or `solar-pro4`. Solar Pro 4 reasons by default and returns the reasoning trace, so include reasoning tokens in the comparison.

## Limitations and trade-offs

- **Overall scores are modest.** The only independent overall score is Artificial Analysis, where Pro 4 gets 14 on v5; the 42 and 24.1 that Upstage often cites are from the older index.
- **Most evaluations are self-reported or in-house.** Ko-GDPval, KBankMMLU and Ko-AIME are Upstage's internal benchmarks, as are the "in-house" rows in the Pro 4 table, and the same Open 2 model scores differently across two official documents.
- **The API models are opaque.** Solar Pro 4 discloses neither parameters nor architecture, Mini 4 discloses only its parameter count, and neither has weights.
- **Slow and long-winded.** Artificial Analysis measured about 46 seconds to the first answer token and about 65 minutes per task for Pro 4, with 2.5× the median output tokens.
- **Prices are promotional.** The current half-price offer has no end date; long-term budgets should use list price.
- **Derivatives carry the Solar brand.** The license permits commercial use, but naming and attribution of fine-tuned releases are constrained.
- **Narrow distribution.** The fourth generation is absent from AWS, Azure and similar marketplaces, and Solar Open 2 needs Upstage's own vLLM fork. A `solar-mini-4-5-tokenizer` repo appeared on HuggingFace in November with no matching announcement yet.

Solar's strategy, in short: lean on a Korean-efficient tokenizer and its document-AI roots to sell the API as an inexpensive office-agent model, while open weights from the national sovereign-model project hold the local and on-premises market. For Korean and Japanese document work it belongs on the evaluation list; for overall English capability or coding agents, stronger options exist at the same price.

## References

- [Solar Pro 4: The Agentic Model That Finishes the Job — Upstage blog](https://www.upstage.ai/blog/en/solar-pro-4)
- [Solar Pro 4 — Upstage Console model page](https://console.upstage.ai/docs/models/solar-pro-4)
- [Solar Mini 4: Built for High-Volume Agent Workloads — Upstage blog](https://www.upstage.ai/blog/en/solar-mini-4)
- [Solar Mini 4 — Upstage Console model page](https://console.upstage.ai/docs/models/solar-mini-4)
- [Solar Open 2: Korea's Sovereign Foundation Model — Upstage blog](https://www.upstage.ai/blog/en/solar-open-2)
- [upstage/Solar-Open2-250B — HuggingFace model card](https://huggingface.co/upstage/Solar-Open2-250B)
- [Upstage Solar License — HuggingFace](https://huggingface.co/upstage/Solar-Open2-250B/blob/main/LICENSE)
- [Solar Open 2 Technical Report — arXiv 2607.20062](https://arxiv.org/abs/2607.20062)
- [upstage/Solar-Open-100B — HuggingFace model card](https://huggingface.co/upstage/Solar-Open-100B)
- [Solar Open Technical Report — arXiv 2601.07022](https://arxiv.org/abs/2601.07022)
- [Korean AI firm Upstage releases AI model as open source — Aju Press](https://www.ajupress.com/view/20260106083310286)
- [All Models and Version History — Upstage Console](https://console.upstage.ai/docs/models/history)
- [Changelog — Upstage Console](https://console.upstage.ai/docs/resources/changelog)
- [Pricing — Upstage](https://www.upstage.ai/pricing)
- [Deployment Options — Upstage Console](https://console.upstage.ai/docs/deployment-options)
- [Models — Upstage Console](https://console.upstage.ai/docs/models)
- [Upstage AI Unveils Solar Pro 4 — Upstage press release (PR Newswire)](https://www.prnewswire.com/news-releases/upstage-ai-unveils-solar-pro-4-scoring-42-on-artificial-analysis-index-to-rank-among-global-frontier-models-302856434.html)
- [Upstage Releases Next-Generation Solar Pro on AWS — Amazon press release](https://press.aboutamazon.com/aws/2024/12/upstage-releases-next-generation-solar-pro-generative-ai-llm-on-aws)
- [Solar models from Upstage are now available in Amazon SageMaker JumpStart — AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/solar-models-from-upstage-are-now-available-in-amazon-sagemaker-jumpstart/)
- [Solar Pro 2 — AWS Marketplace](https://aws.amazon.com/marketplace/pp/prodview-yar5lgioxenj4)
- [Solar Open2 250B — NVIDIA Dynamo documentation](https://docs.nvidia.com/dynamo/latest/recipes/solar-open2-250b)
- [Upstage: Solar Pro 4 — OpenRouter](https://openrouter.ai/upstage/solar-pro4)
- [Upstage: Solar Mini 4 — OpenRouter](https://openrouter.ai/upstage/solar-mini4)
- [OpenRouter Rankings](https://openrouter.ai/rankings)
- [Solar Pro 4 — Artificial Analysis](https://artificialanalysis.ai/models/solar-pro-4)
- [upstage — HuggingFace organization](https://huggingface.co/upstage)
- [solar — Ollama library](https://ollama.com/library/solar)
- [solar-pro — Ollama library](https://ollama.com/library/solar-pro)
- [Korean models overview](/posts/tech/2026-11-23-ai-model-family-korea-models-en) — this site
- [Commercial document parsing API comparison](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison-en) — this site
- [DeepSeek model family](/posts/tech/2026-08-24-ai-model-family-deepseek-en) — this site
- [Mistral model family](/posts/tech/2026-08-24-ai-model-family-mistral-en) — this site
- [Cohere model family](/posts/tech/2026-08-24-ai-model-family-cohere-en) — this site
- [Guide to AI model evaluation sources](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
