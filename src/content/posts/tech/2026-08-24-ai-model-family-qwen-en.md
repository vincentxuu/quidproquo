---
title: "Qwen: A Full-Size Family from 0.8B to 2.4T — Qwen4-Max Arrives Closed, and Small Models Carry the Open Line"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, qwen, open-source, model-family-qwen, moe, model-selection]
lang: en
type: deep-dive
tldr: "Qwen is the most-downloaded model family on HuggingFace. Qwen4-Max, live since 2026-11-16, brings a new architecture (QSA sparse attention, Gated Residual, N-gram Embedding): 2.4T total parameters with only 71B active, API prices cut to $1.50/$4.50 — but no weights. Alibaba says smaller Qwen4 models will be open-sourced, with no date. What you can download today is still generation 3.8: 27B (Apache 2.0), Flash-Next (Qwen Community License), and 2.4T-A95B (custom Max License), each with different commercial restrictions. This post covers the family's evolution, the Qwen4 architecture trade-offs, pricing and licensing by tier, and how to choose today."
description: "A guide to the Qwen (Tongyi Qianwen) model family: Qwen4-Max specs and pricing, the Qwen4 architecture (QSA, Gated Residual, N-gram Embedding), the three licenses on generation-3.8 open weights, QwenCloud pricing, the 2023→2026 evolution timeline, and agent selection."
series:
  name: "AI Model Families"
  order: 2
draft: false
glossary:
  - term: "Gated DeltaNet"
    definition: "A variant from the linear attention family that replaces the full attention matrix with a fixed-size recurrent state, so compute grows linearly rather than quadratically with sequence length. Qwen has used it to replace part of the traditional attention layers since Qwen3.5"
  - term: "QSA (Qwen Sparse Attention)"
    aliases: ["Qwen Sparse Attention"]
    definition: "The sparse attention layer in the Qwen4 architecture: a lightweight indexer selects relevant context at micro-block granularity before attention runs, cutting attention and indexing cost on long sequences. Each QSA layer is paired with three Gated DeltaNet layers"
  - term: "N-gram Embedding"
    definition: "Short n-gram (bigram/trigram) lookups at layer 2 that provide representations of local token patterns. They add parameter capacity with almost no extra compute, and are easier to offload to memory than MoE experts"
  - term: "AxB-AyB notation"
    aliases: ["MoE parameter notation"]
    definition: "Parameter notation for MoE models: Ax is total parameters, Ay is what each token actually activates. 397B-A17B means 397B total parameters with only 17B active per forward pass"
  - term: "Early fusion"
    aliases: ["early fusion"]
    definition: "Mixing text, images, and video into pretraining from the start, rather than bolting a vision adapter onto a finished text model. The source of native multimodal capability"
---

> :globe: [繁體中文版](/posts/tech/2026-08-24-ai-model-family-qwen)

Qwen (Tongyi Qianwen) is the most-downloaded model family on HuggingFace (see the [series overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en)), with sizes from a 0.8B phone model to 2.4T. This post is for agent developers choosing within Qwen: whether to use Qwen4-Max or generation 3.8 for an API flagship, which weights to download for self-hosting, and what each of the three open-weight licenses rules out.

As of November 2026, the API side has moved to Qwen4-Max while the downloadable weights are still generation 3.8. Alibaba open-sourced Max-tier weights for the first time in August; three months later Qwen4-Max went back to closed weights, with only a promise that smaller Qwen4 models will be open-sourced.

For how to read the benchmark numbers cited here, see the [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en).

## Family positioning and model matrix

International (Singapore) list prices per 1M tokens, checked on 2026-11-20 against the [QwenCloud pricing page](https://docs.qwencloud.com/developer-guides/getting-started/model-prices) and HuggingFace model cards:

| Model / line | Role | Key difference | Access and price |
|---|---|---|---|
| Qwen4-Max (`qwen4-max`) | Current flagship | New Qwen4 architecture, 2.4T total / 71B active, 1M context, text/image/video input | API only: $1.50/$4.50, cache hit $0.075; no weights |
| Qwen3.8-Max (`qwen3.8-max`, now pointing to the 0902 snapshot) | Previous flagship | Automatically points to `qwen3.8-max-0902` since Sept 5 | API: $2/$6, cache hit $0.25 |
| Qwen3.8-2.4T-A95B | Self-hostable flagship weights | Weights behind Qwen3.8-Max; text-only, thinking mode required | Open weights, custom Qwen3.8-Max License |
| Qwen3.7-Plus (`qwen3.7-plus`) | Mid-tier multimodal API | $0.40/$1.60 up to 256K; $1.20/$4.80 above 256K | API only, currently 20% off for a limited time |
| Qwen3.8-Flash (`qwen3.8-flash`) | Low-cost API | Production service built on Flash-Next, 1M context by default | API: $0.15/$0.47 |
| Qwen3.8-Flash-Next | Qwen4 architecture preview weights | 125B total / 6B active, plus 51B N-gram Embedding | Open weights, Qwen Community License 1.0 |
| Qwen3.8-27B | Local multimodal | Dense 27B, native image and video understanding | Open weights, Apache 2.0 |
| Qwen3-Embedding / Reranker | RAG | 0.6B / 4B / 8B | Open weights, Apache 2.0 |

Max/Plus/Flash in an API model name are service-tier labels and do not guarantee downloadable weights; Qwen4-Max is the flagship of that name that has none. To decide whether you can self-host, read the license column, not the suffix.

### Two product lines: openness buys ecosystem, closure collects revenue

**The open line** (the `Qwen` org on HuggingFace): checkpoints from generations 3.5 through 3.8. This line holds the ecosystem position — Ollama, vLLM, SGLang, and llama.cpp all support it, and the fine-tuning community treats it as the default base model. From generation 3.8 on, open weights are no longer uniformly Apache 2.0; the license now varies by tier (see "Licensing, pricing, and deployment").

**The commercial line** (the QwenCloud / Model Studio API): the Max tier has long been API-only. Generation 3.6's three commercial SKUs shipped only on DashScope, and generation 3.7 released no weights at all.

There was also a leadership shift. [Qwen's core technical lead left in early 2026](https://modelfit.io/blog/qwen-team-exodus-alibaba/), and the next two generations leaned closed. Qwen3.8 in August 2026 went the other way and open-sourced a Max-tier model for the first time — the [HuggingFace model card](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B) says it is the "first time" a Max-class model has been openly released.

With Qwen4, the flagship is API-only again. The [official announcement](https://qwen.ai/blog?id=qwen4-max) says only that "smaller models in the family are coming to open source", with no sizes, license, or date; the [Alibaba press release](https://www.alibabagroup.com/en-US/document-2060139246777270272) says the same. So "Qwen's flagship gets open-sourced" held once, in generation 3.8 — it is not a family convention.

### Sub-lines and ecosystem

Besides the general-purpose main line, Qwen runs several sub-lines:

| Sub-line | Evolution | Status (2026-11) |
|---|---|---|
| Main line | 3.5 (open) → 3.6/3.7 commercial (closed) → 3.8 (Max API + three open-weight models) → Qwen4-Max (API only) | See the matrix above |
| Coder | Qwen2.5-Coder → Qwen3-Coder 480B-A35B → Coder-Next 80B-A3B | Apache 2.0; [no new release since March 2026](https://www.scriptbyai.com/qwen-timeline) — coding moved to the main-line flagship |
| Vision-language | Qwen2.5-VL → [Qwen3-VL-235B](https://huggingface.co/collections/Qwen/qwen3-vl) → native multimodal main line | Taken over by the main line from 3.5 |
| Reasoning | QwQ-32B as a separate research line → thinking mode folded into Qwen3 | Absorbed |
| Omni / speech | Qwen2-Audio → Qwen3-Omni 30B-A3B (Apache 2.0) → 3.5-Omni, Audio-3.0 series | API-only with no weights since mid-July 2026 |
| Image generation | Qwen-Image → 2.0 (Apache 2.0) → Image-3.0 (closed API) / [Qwen-Image-2.1](/posts/daily/2026-09-20-model-qwen-image-2-1-en) (open weights, non-commercial research only) | See the 2.1 model card for specs and license |
| Embedding / Reranker | Qwen3-Embedding and Qwen3-Reranker (0.6B/4B/8B) | Apache 2.0, the current RAG workhorses |
| Math | Qwen2.5-Math → folded into the main line | Absorbed |

Two trends:

**Capabilities are being folded into the main line.** Coder, Math, and QwQ have all stopped iterating independently. Once a general model is strong enough at a specialty, maintaining a separate sub-line stops paying off. Vision went another way: rather than dropping the VL line, early fusion made vision a native capability of the main line.

**Licenses are being tiered downward.** Small understanding models stay Apache 2.0; new media-generation releases are either closed or non-commercial; flagship weights come with commercial conditions, or don't come at all.

The deployment ecosystem is a quiet advantage: AWS Bedrock, Google Vertex AI Model Garden, and NVIDIA NIM have all hosted Qwen open-weight models, plus third parties such as OpenRouter, Together, and Fireworks. On the tooling side there is the Qwen Code terminal agent, the Qoder coding product, the QwenWork office assistant, and the [Live Delivery plugin](https://github.com/QwenLM/Qwen-Live-Delivery-Plugin) open-sourced alongside Qwen4-Max.

## Family evolution

| Version | Released | What changed for selection | On this site |
|---|---|---|---|
| Qwen-7B / 14B | 2023-08 | First open release; the Tongyi Qianwen brand debuts | — |
| Qwen1.5 | 2024-02 | Full 0.5B–72B coverage; self-hosters can pick a size by hardware | — |
| Qwen2 | 2024-06 | 72B flagship, 128K context | — |
| Qwen2.5 | 2024-09 | Coder/VL/Math specialist lines form, giving separate options for specialist tasks | — |
| Qwen3 | 2025-04 | 235B-A22B MoE with switchable thinking; the closed Qwen3-Max appears, splitting the flagship from the open line | — |
| Qwen3-Coder / Next | 2025-07 / 09 | Coder 480B-A35B; Next-80B-A3B first tests ultra-sparse MoE with a hybrid Gated DeltaNet layout | — |
| Qwen3.5 | 2026-02 | 397B-A17B open flagship, native multimodal, 201 languages; Gated DeltaNet becomes the main-line architecture | — |
| Qwen3.6 / 3.7 commercial | 2026-04 to 06 | Max/Plus/Flash API-only, no open weights for all of 3.7; self-hosters stuck on the 3.5/3.6 open line | — |
| Qwen3.8-Max | 2026-08-03 | 2.4T-A95B at $2/$6; the API alias moved to the 0902 snapshot on Sept 5 | — |
| Qwen3.8 open weights | mid-2026-08 | First open Max-tier weights (custom license); 27B under Apache 2.0 becomes the default for local multimodal | — |
| Qwen3.8-Flash-Next | 2026-08-26 | First public Qwen4 architecture, 6B active; license switches to the Qwen Community License, so MaaS and coding/office-assistant businesses need a separate license | [Model card](/posts/daily/2026-08-26-model-qwen-qwen3-8-flash-next-en) |
| Qwen4-Max | 2026-11-16 (Token Plan preview from 11/11) | New architecture, 71B active, 25% price cut — but the flagship is closed again; self-hosting still means 3.8 | [Model card](/posts/daily/2026-11-18-model-qwen-qwen4-max-en) |

The first half of the story was "open source builds the ecosystem." 2026 added a second thread: the commercial and open lines split, and open licenses were redrawn by model tier. Qwen3.8-Max is now the previous generation in this post; its full evaluation table (Terminal-Bench 2.1, SWE-bench Pro, LongBench v2, and more) remains on its [HuggingFace model card](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B), and the update history below records what moved out.

## Architecture and training trade-offs

### Qwen4: attention, residuals, and embeddings changed at once

The [Qwen4-Max announcement](https://qwen.ai/blog?id=qwen4-max) describes the new architecture: a 2.4T backbone with 71B active per token, plus 328B N-gram Embedding parameters. The changes land in three places:

- **GDN + QSA**: every three Gated DeltaNet layers compress history into fixed-size states, followed by one QSA layer. QSA uses a lightweight indexer to select relevant context at micro-block granularity rather than token by token, cutting attention and indexing cost on long sequences. Generation 3.8 used Gated Attention in the same slot.
- **Gated Residual**: four parallel residual branches, each with dynamic read and write gates, aimed at stronger cross-layer information flow and more stable training.
- **N-gram Embedding**: n-gram lookups at layer 2 provide local token patterns. The [Flash-Next model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next) frames embeddings as a separate axis for scaling parameters — less compute than MoE and easier to offload, which suits memory-constrained accelerators.

Reported effects: no loss spikes across the 2.4T-scale pre-training run, and the Base model's bits per byte on knowledge, code, QA, and STEM is about 5–13% lower than Qwen3.8-Max-Base with 25% fewer active parameters. These are all Alibaba's in-house evaluations.

The architecture first shipped as open weights in August at small scale (Flash-Next, 125B/6B) and only reached Max three months later. If you want to study the Qwen4 architecture locally, Flash-Next is currently the only download.

### Gated DeltaNet: making long context cheap

Standard Transformer attention scales quadratically with sequence length. Gated DeltaNet replaces the full attention matrix with a fixed-size recurrent state, so compute grows linearly. It was first trialed in Qwen3-Next-80B-A3B in September 2025 and became the main-line architecture in Qwen3.5, using a **hybrid layout**: the Qwen3.8-2.4T-A95B model card specifies 23 blocks of "3 Gated DeltaNet layers + 1 Gated Attention layer." Qwen4 keeps the three-to-one ratio and swaps the attention layer for QSA.

### Fine-grained MoE: many small experts

Qwen's MoE is fine-grained: Qwen3.8-2.4T-A95B has 512 experts, with 10 routed plus 1 shared expert active per token. For self-hosted inference, active parameters drive latency, but total parameters drive VRAM — even quantized to 4-bit, 2.4T needs about 1.2TB of memory for the weights alone, [a multi-node datacenter spec](https://aliteq.com/alibaba-qwen3-8-max-open-weights-2026).

### Native multimodality: built in, not bolted on

Since 3.5, Qwen has trained with early fusion. Qwen4-Max and Qwen3.8-27B both natively accept text, images, and video; but the Qwen3.8-2.4T-A95B weights are text-only and require thinking mode — image input and non-thinking mode are only on the API version, Qwen3.8-Max. If you plan to self-host the flagship for vision tasks, know this gap first.

## Evaluation and alternatives

### Where Qwen4-Max lands

All scores below come from the comparison chart in Alibaba's Qwen4-Max announcement (numbers as transcribed by [MarkTechPost](https://www.marktechpost.com/2026/11/16/alibaba-qwen4-max-release/)); some items cite third-party leaderboards, and none were independently reproduced at launch:

| Benchmark | Qwen4-Max | Qwen3.8-Max-0902 | Strongest rival in the chart |
|---|---|---|---|
| HLAB-Vals-1.1 (legal agents) | **21.3** | 15.4 | Kimi K3.1 11.7 |
| Agents' Last Exam v1.1 | **46.7** | — | Claude Opus 5.5 / Kimi K3.1 43.4 |
| DeepSWE v1.1 | **75.7** | 69.3 | Kimi K3.1 75.5 |
| Humanity's Last Exam | 51.7 | 43.9 | Claude Opus 5.5 59.8 |
| Terminal-Bench 4.0 | 48.5 | 38.9 | Kimi K3.1 67.2 |
| ProgramBench | 31.5 | 28.0 | Claude Opus 5.5 65.0 |
| Chartography | 54.2 | — | GPT-6 Astra 71.1 |

Qwen4-Max takes first on 4 of 16 benchmarks; Claude Opus 5.5 takes 7. Its strengths are long vertical tasks (law, biomedicine, long-horizon agents); its weaknesses are native coding, terminal work, and chart understanding. The [Alibaba press release](https://www.alibabagroup.com/en-US/document-2060139246777270272) also says it ranked 6th on Code Arena.

Two caveats:

- **Rival scores may be out of sync.** The chart lists Kimi K3.1 at 67.2 on Terminal-Bench 4.0, but Moonshot's own card says 65.7 (see the [Kimi K3.1 Pro model card](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro-en)). When quoting a vendor's numbers for a competitor, check the competitor's original release.
- **Work360 is an in-house benchmark.** Qwen4-Max rose from 47.74 to 52.69 while using about 35% fewer tokens at High effort, and average cost per task fell from $4.43 to $1.67. The token savings may matter more for cost than the score, but no third party has reproduced them yet.

### Position against competitors

- **Against Claude Opus 5.5 ($4/$20)**: behind on most scores, with less than half the ProgramBench score; roughly 60–80% cheaper. A good high-volume backstop, not a replacement for a primary coding agent.
- **Against Kimi K3.1 Pro ($2/$10)**: clearly behind on Terminal-Bench 4.0, tied on DeepSWE; Qwen4-Max is cheaper, but Kimi follows an open-weight path (see the [Kimi family post](/posts/tech/2026-08-24-ai-model-family-kimi-en)) while Qwen4-Max has no weights.
- **Against DeepSeek**: DeepSeek still wins on price and on MLA's structural cost advantage; Qwen wins on size range and multimodal breadth.

## Licensing, pricing, and deployment

### Three open-weight licenses, three sets of commercial limits

From generation 3.8 on, "Qwen open source = Apache 2.0" no longer holds. Based on the full LICENSE texts on HuggingFace:

| Weights | License | Commercial conditions |
|---|---|---|
| Qwen3.8-27B, Qwen3-Embedding / Reranker | Apache 2.0 | Keep the license notice |
| [Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B/blob/main/LICENSE) | Qwen3.8-Max License | Products above 100M monthly active users or US$20M monthly revenue must prominently display the model name; Model-as-a-Service or AI Work Assistant (coding/office) businesses whose group revenue exceeds US$50M over 12 months need a separate license before commercial use |
| [Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next/blob/main/LICENSE) | Qwen Community License 1.0 | Same display obligation; Model-as-a-Service or AI Work Assistant businesses need a separate license before commercial use **regardless of revenue** |

Both custom licenses exempt purely internal use that does not expose the model's capabilities to third parties. In practice: embedding Qwen in an ordinary SaaS product is mostly unaffected; if you resell API access or build a coding/office assistant, negotiate a license before choosing Flash-Next — 27B has no such issue.

### QwenCloud pricing highlights

- **Qwen4-Max**: $1.50/$4.50, implicit cache hit $0.075 (down 70% from $0.25); explicit cache creation $1.875 for 5 minutes, $3 for 1 hour. Limits: non-thinking mode 991K input / 131K output, thinking mode 983K input / 262K output, 5M TPM by default ([QwenCloud model page](https://www.qwencloud.com/models/qwen4-max)).
- **Qwen3.8-Max**: still $2/$6; since Sept 5, `qwen3.8-max` automatically points to the `qwen3.8-max-0902` snapshot at the same price ([update notice](https://docs.qwencloud.com/changelog/model-updates/qwen3.8-max-upgrade)). Code that needs fixed behavior should pin the snapshot ID.
- **Qwen3.7-Plus**: tiered pricing — if a single request exceeds 256K input tokens, the whole request is billed at $1.20/$4.80; currently 20% off for a limited time.
- **Qwen3.8-Flash**: $0.15/$0.47, cache hit $0.016.
- **Regional differences**: the same model is cheaper under the Global deployment scope (e.g., Qwen4-Max at $1.413/$4.24), and free quota exists only in the Singapore region. Check which regional endpoint you call before comparing prices.

The API is compatible with OpenAI Chat Completions/Responses and Anthropic Messages formats, and supports function calling, structured outputs, batch, web search, and fine-tuning.

## Agent integration and selection

- **API flagship, price-sensitive, tasks in law/biomedicine/long workflows** → Qwen4-Max. 25% cheaper than 3.8-Max and, per Alibaba's data, uses fewer tokens; test it on your own tasks first.
- **Primary workload is a coding agent or terminal work** → Qwen4-Max is not the first pick; ProgramBench and Terminal-Bench 4.0 trail Claude Opus 5.5 and Kimi K3.1 Pro clearly.
- **High multimodal volume** → Qwen3.7-Plus ($0.40/$1.60 up to 256K) is still Qwen's cheapest multimodal API; watch the tier above 256K.
- **Large volumes of cheap calls** → Qwen3.8-Flash ($0.15/$0.47).
- **Running on a laptop or edge device** → Qwen3.8-27B: dense, native vision, Apache 2.0; [CNBC reports](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html) it runs in 17GB of VRAM.
- **Self-hosting a flagship for research or data sovereignty** → Qwen3.8-2.4T-A95B; read the license and prepare a multi-node cluster, and remember it is text-only with mandatory thinking.
- **Waiting for open Qwen4 weights** → Alibaba has only promised open smaller models, with no date, sizes, or license; don't plan on Apache 2.0.
- **RAG** → Qwen3-Embedding plus Reranker, in the same ecosystem as your main model.
- **Citing benchmarks** → write out generation, tier, and snapshot ID (e.g., `qwen3.8-max-0902`), or you are comparing different runs.

## Limitations and trade-offs

- **The flagship has no weights.** Qwen4-Max is available only through QwenCloud and Alibaba's own products; data-sovereignty or offline needs fall back to generation 3.8.
- **Evaluations are almost all self-reported.** Qwen4-Max's 16-benchmark comparison and Work360 both come from Alibaba, and rival scores may not match the rivals' own reports.
- **Licenses must be checked per model.** One generation's three open-weight models carry three licenses; the custom licenses' limits on API providers and coding/office-assistant businesses need checking at selection time.
- **Max/Plus/Flash says nothing about weights.** The suffix is only a service tier.

Qwen's bet is still the "full catalog": it doesn't win every category — the agentic coding ceiling is Claude's and the price floor is DeepSeek's — but it has an option for everything from phones to datacenters, from embeddings to speech. What changed in 2026 is that "you can run it yourself" now depends on the model tier and its license terms.

## Update history

- **2026-11-20**: Added the Qwen4 generation. The matrix, evaluation, pricing, and selection were rewritten for Qwen4-Max and the 3.8 models still on offer (QwenCloud pricing page, the Qwen4-Max announcement, HuggingFace model cards and LICENSE files, read 2026-11-20); added the Qwen4 architecture, a comparison of the three open-weight licenses, the Qwen3.8-Max snapshot switch, and regional price differences. Qwen3.8-Max is now the previous generation; the earlier Terminal-Bench 2.1 / SWE-Bench Pro / LongBench v2 table moved out of the body, with full numbers on its HuggingFace model card. The timeline now has four columns and links to daily model cards. Corrections: Qwen3.8-2.4T-A95B is post-trained weights, not a "base" model; 27B's context is now listed as 262K native, extensible to 1M; new Qwen-Image releases are not only closed — version 2.1 has open weights under a non-commercial license.
- **2026-10-11**: Reorganized sections to the shared family format and added a matrix compiled from existing content. Kept the original versions, prices, and source dates; no new round of fact-checking.

## References

- [Qwen4-Max: Your New Teammate Has Arrived — Qwen official blog](https://qwen.ai/blog?id=qwen4-max)
- [Alibaba Unveils Qwen4-Max — Alibaba Group press release](https://www.alibabagroup.com/en-US/document-2060139246777270272)
- [Qwen4-Max — QwenCloud model page (pricing, limits, built-in tools)](https://www.qwencloud.com/models/qwen4-max)
- [Model pricing — QwenCloud docs](https://docs.qwencloud.com/developer-guides/getting-started/model-prices)
- [Qwen3.8-Max update notice — QwenCloud changelog](https://docs.qwencloud.com/changelog/model-updates/qwen3.8-max-upgrade)
- [Qwen/Qwen3.8-2.4T-A95B — HuggingFace model card](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)
- [Qwen3.8-Max License — HuggingFace](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B/blob/main/LICENSE)
- [Qwen/Qwen3.8-Flash-Next — HuggingFace model card](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [Qwen Community License 1.0 — HuggingFace](https://huggingface.co/Qwen/Qwen3.8-Flash-Next/blob/main/LICENSE)
- [Qwen/Qwen3.8-27B — HuggingFace model card](https://huggingface.co/Qwen/Qwen3.8-27B)
- [Qwen3.8-Max: A New Bar for Coding and Cowork — Qwen official blog](https://qwen.ai/blog?id=qwen3.8)
- [Alibaba Releases Qwen4-Max: 2.4T MoE, 71B Active, 1M Context — MarkTechPost](https://www.marktechpost.com/2026/11/16/alibaba-qwen4-max-release/)
- [Qwen-Live-Delivery-Plugin — GitHub](https://github.com/QwenLM/Qwen-Live-Delivery-Plugin)
- [Alibaba open-sources Qwen open-weight AI laptop models — CNBC](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html)
- [The hardware math behind self-hosting Qwen3.8-Max — Aliteq](https://aliteq.com/alibaba-qwen3-8-max-open-weights-2026)
- [Qwen team exodus — Modelfit](https://modelfit.io/blog/qwen-team-exodus-alibaba/)
- [Qwen Timeline: Model & Product Release History — ScriptbyAI](https://www.scriptbyai.com/qwen-timeline)
- [Qwen3 Technical Report (arXiv:2505.09388)](https://huggingface.co/papers/2505.09388)
- [Model card: Qwen4-Max](/posts/daily/2026-11-18-model-qwen-qwen4-max-en) — this site
- [Model card: Qwen3.8-Flash-Next](/posts/daily/2026-08-26-model-qwen-qwen3-8-flash-next-en) — this site
- [AI model landscape overview](/posts/tech/2026-08-24-ai-model-landscape-overview-en) — this site, series overview
- [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources-en) — this site
