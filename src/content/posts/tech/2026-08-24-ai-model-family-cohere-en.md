---
title: "Cohere — The RAG-Native Outlier: How Command, Embed, Rerank, and Aya Fit Together"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, cohere, rag, embedding, rerank, model-family-cohere, model-selection]
lang: en
type: deep-dive
tldr: "Cohere is the only family that ships generation, retrieval, reranking, and multilingual as distinct products. Command A runs 256K context on two GPUs at 111B, Embed v4 does mixed image-text retrieval, Rerank v4 handles 32K semi-structured data, and Aya covers 101 languages — a four-piece stack built for RAG. This post breaks down each pillar's positioning, licensing, and selection guide."
description: "Complete guide to the Cohere model family: from the 2019 Toronto founding to Command A 111B, Embed v4 and Rerank v4 retrieval architecture, the Aya 101/Expanse multilingual line, the North platform and private deployment, pricing and competitive positioning."
series:
  name: "AI Model Families"
  order: 10
draft: false
glossary:
  - term: "RAG"
    aliases: ["Retrieval-Augmented Generation"]
    definition: "An architecture that retrieves external data before generating an answer, reducing hallucination and improving traceability."
  - term: "Rerank"
    definition: "The second retrieval stage: re-scores candidate documents and feeds only the most relevant ones to the generator."
  - term: "North"
    definition: "Cohere's enterprise AI workspace that bundles Command, Embed, Rerank, and document connectors."
  - term: "Model Vault"
    definition: "Cohere's isolated hosted inference platform where models run on dedicated instances with confidential computing and remote attestation."
  - term: "Aya"
    definition: "Cohere's multilingual research series covering 23 to 101 languages, with some weights open-sourced under Apache 2.0."
---

> 🌏 [中文版](/posts/tech/2026-08-24-ai-model-family-cohere)

In 2019, Transformer co-author Aidan Gomez founded Cohere in Toronto. While most labs chased the strongest chat model, Cohere chose a different path — enterprise RAG infrastructure. Six years later that bet has grown into four pillars: Command for generation, Embed for retrieval, Rerank for precise ranking, and Aya for multilingual coverage. No competitor ships all four as product lines.

This is the eighth deep dive in the [AI Model Family](/en/series/ai) series, tracing Cohere from language-model startup to enterprise RAG suite. For how to read the benchmark numbers cited here, see our [AI model evaluation sources guide](/posts/tech/2026-08-24-ai-model-evaluation-sources). This is part of the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) series.

## Family Timeline

| Version | Release | Key fact |
|---|---|---|
| Cohere founded | 2019 | Toronto, by Aidan Gomez (Transformer co-author) with Nick Frosst and Ivan Zhang |
| Command (original) | 2022–2023 | Early generation models at $1.00/$2.00, establishing the API foundation |
| Command R | 2024-03-11 | First RAG-specialized model, 128K context, $0.50/$1.50 |
| Command R+ | 2024-04 | Flagship 104B params, 128K context, $3.00/$15.00, complex RAG and multi-step tool use |
| Command R+ 08-2024 | 2024-08 | Major refresh, +50% throughput, −25% latency, repriced to $2.50/$10.00 |
| Aya 101 | 2024-02 | 13B, 101 languages, Apache 2.0 |
| Aya 23 | 2024-05 | 8B/35B, 23 languages, CC BY-NC 4.0 |
| Aya Expanse | 2024-12-05 | 8B (8K) / 32B (128K), 23 languages, CC BY-NC 4.0, API $0.50/$1.50 |
| Command A | 2025-03-13 | 111B, 256K context, runs on two GPUs, 150% higher throughput than R+ 08-2024 |
| Embed v4.0 | 2025 | Mixed image-text (text + images + PDFs), 128K, variable dims 256–1536 |
| Rerank v3.5 / v4 | 2025 | v3.5 single multilingual 4K; v4 Fast/Pro 32K with semi-structured JSON/YAML |
| North / Compass | 2025 | Enterprise workspace North + intelligent search Compass |
| North Mini Code | 2025 | First agentic coding MoE: 30B total / 3B active, 256K context, Apache 2.0 |
| Transcribe | 2025 | Speech recognition, including Arabic fine-tuned variant |

Six years, four generational leaps. Cohere's rhythm is not "a bigger model every quarter" but "each pillar evolves independently, converging on the North platform."

## Four Pillars: Why Cohere Is Not Just an LLM Company

Most families have one main line (Qwen bets on full size coverage, DeepSeek on MoE efficiency, Claude on agents). Cohere runs four in parallel:

**Command (generation)**: Chat, RAG grounded generation, multi-step tool use. From R to R+ to A, every generation doubled down on "how to do RAG with less compute" — Command A matches larger rivals' quality at 111B and needs only two A100/H100s.

**Embed (retrieval)**: Turns text/images into vectors — the first stage of RAG. Before v4.0 it split into English vs. multilingual tracks (v3.0 full 1024-dim vs. light 384-dim); v4.0 unified into a single multilingual model with variable dimensions and multimodal input.

**Rerank (precise ranking)**: The second RAG stage that re-scores retrieved candidates. v3.0 split English/multilingual, v3.5 unified to single multilingual, v4 extends to 32K and handles semi-structured data (tables, JSON, YAML). Billed per search unit (1 query + up to 100 docs).

**Aya (multilingual)**: Research-driven multilingual series. Aya 101 covers 101 languages under commercially friendly Apache 2.0; Aya 23/Expanse narrows to 23 core languages with higher quality under CC BY-NC 4.0 (research-only).

The combination is Cohere's only moat: others make you assemble OpenAI + BGE + Jina + NLLB yourself; Cohere gives you the full stack from one vendor, one bill, one private deployment.

## Architecture: Why "RAG-Native"

### Grounded generation with citations

Command R/R+/A are trained from the start for "given documents, produce a cited answer." The model annotates where information came from rather than improvising. For enterprise knowledge-base QA — legal, support, finance — answers without sources are unacceptable.

### Multi-step tool use

Since Command R+, the models support sequential multi-step tool use within a single response cycle, using prior tool outputs to decide the next step. This is the foundation for agents, and Cohere made it R+'s headline feature in 2024 rather than a late add-on. Command A adds emphasis on "avoiding unnecessary tool calls" — in practice, calling tools recklessly is more expensive than not calling them.

### Efficiency-first design

Command A's pitch is not parameter count but efficiency: 111B params, 256K context, two GPUs, 150% higher throughput than R+ 08-2024. Cohere's official line is "on par or better than GPT-4o and DeepSeek-V3 across agentic enterprise tasks, with significantly greater efficiency" ([Command A launch post](https://cohere.com/blog/command-a)). For enterprises that need private deployment, "the flagship runs on two cards" matters more than "2% higher on a benchmark."

## Embed v4 and Rerank v4: How to Choose

### Embed: From Dual Track to Unified

| Item | Embed v4.0 | Embed v3.0 (full) | Embed v3.0 (light) |
|---|---|---|---|
| Modality | Text + images + mixed PDFs | Text | Text |
| Dimensions | 256 / 512 / 1024 / 1536 (default 1536) | 1024 | 384 |
| Context | 128K tokens | 512 tokens | 512 tokens |
| Languages | Single multilingual (100+) | English / multilingual split | English / multilingual split |
| Distance | Cosine / Dot / Euclidean | Cosine | Cosine |
| Quantization | float / int8 / uint8 / binary | float | float |

Two key upgrades in v4.0: **multimodal input** (embed images and PDFs directly without converting to text first) and **variable dimensions** (pick 256 dims to save storage or 1536 dims to preserve quality). The old 512-token context was a hard ceiling for long documents; v4.0 at 128K can embed an entire document directly.

Pricing: no public per-token price for Embed — enterprise negotiation; [Model Vault](https://cohere.com/pricing) dedicated instances are Small $4/hr ($2,500/mo), Medium $5/hr ($3,250/mo).

### Rerank: From 4K to 32K

| Item | Rerank v4 Pro / Fast | Rerank v3.5 | Rerank v3.0 |
|---|---|---|---|
| Languages | Single multilingual | Single multilingual | English / multilingual split |
| Context | 32K | 4K | 4K |
| Semi-structured | JSON/YAML/tables supported | — | — |
| Billing | Per search unit (1 query + 100 docs) | Same | Same |
| Long docs | Auto-chunked (>510 tokens) | Same | Same |

The core differentiator in v4 is **semi-structured data**: enterprise documents mix tables, JSON, and YAML, and v4 Pro/Fast can score such content directly without converting to plain text. Bumping context from 4K to 32K allows reranking much longer documents in one pass.

Model Vault pricing: Rerank 3.5 and Rerank 4 Fast Medium both $5/hr ($3,250/mo), Rerank 4 Pro Large $10/hr ($6,500/mo).

### One-Line Selector

- **New projects → v4**: Embed v4.0 + Rerank v4 Pro is the current golden pair, covering multimodal and 32K reranking.
- **Cost-sensitive**: Rerank 4 Fast and Pro cost the same at Medium ($5/hr) — pick Pro; for Embed use 512 dims instead of 1536 to halve storage and latency.
- **Already on v3**: v3.0's English/multilingual split was unified in v3.5/v4 — upgrading simplifies integration.

## Aya: From 101 Languages to 23

| Version | Params | Languages | Context | License | API pricing |
|---|---|---|---|---|---|
| Aya 101 | 13B (mT5-xxl) | 101 | — | Apache 2.0 | — (weight download) |
| Aya 23 | 8B / 35B | 23 | 8K | CC BY-NC 4.0 | — |
| Aya Expanse 8B | 8B | 23 | 8K | CC BY-NC 4.0 | $0.50 / $1.50 |
| Aya Expanse 32B | 32B | 23 | 128K | CC BY-NC 4.0 | $0.50 / $1.50 |

Aya's evolution shows convergence: from broad 101-language coverage to deeper quality on 23 core languages. Aya 101 remains the only commercially friendly Apache 2.0 release; Expanse offers higher quality and long context (32B reaches 128K) but under CC BY-NC for non-commercial use — enterprises needing commercial multilingual generation must go through the Cohere API rather than self-hosting weights.

The 23-language list: Arabic, Chinese (simp/trad), Czech, Dutch, English, French, German, Greek, Hebrew, Hindi, Indonesian, Italian, Japanese, Korean, Persian, Polish, Portuguese, Romanian, Russian, Spanish, Turkish, Ukrainian, Vietnamese — identical to Command A's 23.

## North, Compass, and the Extended Family

Beyond models, Cohere layers two platforms:

**[North](https://cohere.com/north)**: Enterprise AI workspace bundling Command, Embed, Rerank, document connectors, and agent workflows. Think "ChatGPT + RAG + automation inside the enterprise," emphasizing private, secure integration with existing systems. **[Compass](https://cohere.com/compass)**: Intelligent search and discovery, focused on document discovery and insight surfacing.

Extended family:

| Line | Representative | Positioning |
|---|---|---|
| Flagship generation | Command A 111B | Enterprise RAG, agents, multilingual, 256K, two GPUs |
| Previous flagship | Command R+ 08-2024 104B | Still active, 128K, $2.50/$10.00 |
| Lightweight generation | Command R7B | Edge / low-cost scenarios |
| Retrieval | Embed v4.0 | Multimodal, 128K, variable dims |
| Reranking | Rerank v4 Pro/Fast | 32K, semi-structured |
| Multilingual research | Aya Expanse 32B | 23 languages, 128K |
| Open multilingual | Aya 101 13B | 101 languages, Apache 2.0 |
| Agentic coding | North Mini Code 30B-A3B | MoE (30B total / 3B active), 256K, Apache 2.0 |
| Speech recognition | Transcribe / Transcribe Arabic | ASR including Arabic fine-tune |
| Workspace platform | North / Compass | Enterprise workflows and search |

Two observations:

**North Mini Code marks Cohere's first step into coding.** 30B total but only 3B active per token, 256K context, Apache 2.0 — similar MoE thinking to DeepSeek's approach, but Cohere's pitch is "a coding agent for the North platform" rather than a general coding leaderboard play.

**Platformization cuts both ways.** North packages the four pillars into a one-stop solution — a plus for enterprises already on Cohere; but for teams that only want Embed or Rerank, North's presence can raise "am I being locked in?" concerns. In practice, Embed/Rerank/Command are all usable standalone via API without going through North.

## Pricing and Deployment

### API Pricing (per million tokens)

| Model | Input | Output | Notes |
|---|---|---|---|
| Command R 03-2024 | $0.50 | $1.50 | Deprecated (2025-09-15) |
| Command R+ 04-2024 | $3.00 | $15.00 |  |
| Command R+ 08-2024 | $2.50 | $10.00 | Current workhorse |
| Command A 03-2025 | $2.50 | $10.00 | Same price as R+ 08-2024, more efficient |
| Aya Expanse 8B/32B | $0.50 | $1.50 |  |
| Embed v4.0 | Custom enterprise | — | No public per-token price |
| Rerank | Per search unit | — | 1 query + 100 docs per unit, >500 tokens auto-chunked |

Sources: [Cohere Pricing](https://cohere.com/pricing) and [Command A docs](https://docs.cohere.com/docs/command-a).

### Private Deployment

Two private paths, both Kubernetes-containerized, available on AWS/Azure/GCP/OCI:

- **Private Deployments**: Runs in the customer's own environment (on-prem or isolated VPC), data never leaves.
- **[Model Vault](https://docs.cohere.com/docs/model-vault)**: Cohere-managed dedicated instances (no multi-tenancy), in Standard and Encrypted (confidential computing, remote attestation) tiers, compliant with GDPR, HIPAA, and SOC 2.

Model Vault is billed per instance-hour; see the Embed/Rerank tables above for those Vault prices. Vault pricing for the Command series requires contacting sales.

### Licensing Gotchas

Cohere's licensing splits into three tiers — check before you choose:

- **API (Command/Embed/Rerank)**: Commercial API, pay-as-you-go, no weight downloads. Data-sovereignty-sensitive workloads require Private Deployment, not "download and self-host."
- **Apache 2.0 (Aya 101, North Mini Code)**: Commercially usable, self-hostable, modifiable. The only two truly open releases from Cohere.
- **CC BY-NC 4.0 (Aya 23, Aya Expanse, Command R+/A HF weights)**: Research and non-commercial only; commercial use must go through the API. All `CohereLabs/c4ai-command-*` and `aya-expanse-*` weights on HuggingFace fall here.

Compared to other families in this series: Qwen (Apache 2.0/custom), DeepSeek (MIT), Llama 4 (Community License), and Mistral (Apache/Modified MIT) all offer commercially self-hostable weights; Cohere's flagship generation and retrieval models **do not** — going private means going through official deployment channels.

## Competitive Position

Cohere in the 2026 landscape:

- **vs. OpenAI (GPT-5.6 + text-embedding-3)**: GPT leads on general quality and ecosystem, but Cohere's Embed/Rerank are purpose-built for RAG with grounded generation and citations. For "traceable enterprise QA," Cohere is the lower-friction choice.
- **vs. BGE-M3 / Jina (open retrieval)**: BGE-M3 (MIT, 36M downloads) + Jina Reranker v3.5 is the default open RAG stack — self-hostable and cheap. Cohere Embed v4/Rerank v4 wins on multimodal, 32K, semi-structured, and enterprise support, not raw scores.
- **vs. Qwen / DeepSeek (open generation)**: Both offer commercially self-hostable weights (Apache 2.0/MIT); Cohere Command does not — but Cohere's multi-step tool use and grounded RAG are more mature for enterprise workflows.
- **vs. Claude / Gemini (closed generation)**: Claude Opus 5 and Gemini 3 lead on coding and reasoning; Cohere's differentiation is the "generation + retrieval + reranking" bundle with private deployment, not single-point quality.
- **vs. NLLB / SeamlessM4T (multilingual/translation)**: Aya 101's 101-language coverage matches NLLB-200 and adds instruction following (context-aware translation); Aya Expanse delivers stronger generation within 23 languages.

One-line positioning: **If you want a single `/chat/completions` endpoint, Cohere is not the first pick; if you want a privately deployable RAG pipeline, Cohere is one of the few families that ships it complete.**

## What This Means for Agent Builders

- **End-to-end RAG pipeline** → Embed v4 (recall) + Rerank v4 Pro (rerank) + Command A (cited generation) is Cohere's golden path — one API vendor, one private deployment.
- **Multi-step agents** → Command A/R+ multi-step tool use supports sequential calls ("search → read docs → compute → respond").
- **Multilingual agents** → Aya Expanse 32B (128K) handles cross-lingual documents, or Aya 101 (Apache 2.0) for self-hosted multilingual classification/translation.
- **High-throughput / cost-sensitive** → Embed and Rerank APIs are optimized for retrieval latency and cost vs. "using an LLM as a reranker"; Aya Expanse at $0.50/$1.50 is also in the low-price tier.
- **Private / compliant** → Model Vault (Standard/Encrypted) and Private Deployments keep data on-prem — a top pick for finance, government, and healthcare — but flagship generation has no commercially self-hostable weights, so vendor lock-in is part of the evaluation.
- **Local / edge** → Only Aya 101 and North Mini Code are Apache 2.0 self-hostable; for local Embed/Rerank consider open alternatives like BGE-M3 + Jina.

Pragmatic mix-and-match:

| Task | Recommendation | Why |
|---|---|---|
| Enterprise knowledge-base QA | Cohere Embed v4 + Rerank v4 Pro + Command A | Native grounded generation with citations |
| Multilingual doc processing | Aya Expanse 32B (API) or Aya 101 (self-hosted) | 101/23 language coverage, instruction-driven translation |
| Low-cost multilingual generation | Aya Expanse 8B API $0.50/$1.50 | Cheapest multilingual generation at this quality |
| Local/offline RAG | BGE-M3 + Jina Reranker + Qwen/DeepSeek | Cohere retrieval has no commercially self-hostable weights |
| Complex coding agent | Claude Opus 5 / DeepSeek V4 Pro + Cohere Rerank | Strongest generator + Cohere reranking |
| Agent needing private deployment | Cohere Private Deployment / Model Vault | Data stays on-prem, SOC 2/HIPAA/GDPR |

## Overall

Cohere proves a different survival strategy: instead of competing with OpenAI and Anthropic on "the strongest chat model," it productizes every stage of RAG. Where rivals offer an endpoint, Cohere offers a pipeline — Embed for recall, Rerank for precision, Command for generation, Aya for crossing languages, all runnable in a private environment.

The cost is openness. Flagship generation and retrieval have no commercially open weights, and Aya's openness stepped back from Apache 2.0 to CC BY-NC. Cohere's "open" is research-open, not deployment-open. Before choosing Cohere, confirm you need "a RAG infrastructure you can buy" rather than "weights you can self-host" — that line matters more than any benchmark score.

---

## References

- [Cohere Official Site](https://cohere.com)
- [Cohere Pricing](https://cohere.com/pricing) — Command, Aya, and Model Vault pricing
- [Command A — Cohere Docs](https://docs.cohere.com/docs/command-a) — 111B, 256K, two GPUs, $2.50/$10.00
- [Introducing Command A: Max performance, minimal compute — Cohere Blog](https://cohere.com/blog/command-a) — Release timing and efficiency claims
- [Command R+ — Cohere Docs](https://docs.cohere.com/docs/command-r-plus) — RAG and multi-step tool use
- [Cohere Models — Docs](https://docs.cohere.com/docs/models) — Full model catalog, context lengths, param counts, status
- [Cohere Embed — Product](https://cohere.com/embed) and [Cohere Embed — Docs](https://docs.cohere.com/docs/cohere-embed) — v4.0 multimodal and variable dimensions
- [Cohere Rerank — Product](https://cohere.com/rerank) and [Rerank Overview — Docs](https://docs.cohere.com/docs/rerank-overview) — v4 32K and semi-structured support
- [Cohere North](https://cohere.com/north) and [Compass](https://cohere.com/compass) — Enterprise workspace platform
- [Private Deployments](https://cohere.com/private-deployments) and [Model Vault — Docs](https://docs.cohere.com/docs/model-vault) — Private and confidential computing
- [Aya — Cohere Research](https://cohere.com/research/aya) — Multilingual series overview
- [Aya 101 — HuggingFace (CohereLabs/aya-101)](https://huggingface.co/CohereLabs/aya-101) — 13B, 101 languages, Apache 2.0
- [Aya Expanse 8B](https://huggingface.co/CohereLabs/aya-expanse-8b) / [32B](https://huggingface.co/CohereLabs/aya-expanse-32b) — 23 languages, CC BY-NC 4.0, 8K/128K
- [Command A 03-2025 — HuggingFace](https://huggingface.co/CohereLabs/c4ai-command-a-03-2025) — 111B, 256K
- [Command R+ 08-2024 — HuggingFace](https://huggingface.co/CohereForAI/c4ai-command-r-plus-08-2024) — 104B
- [North Mini Code — Docs](https://docs.cohere.com/docs/north-mini-code-1.0) — 30B-A3B MoE, 256K, Apache 2.0
- [Cohere Labs — HuggingFace](https://huggingface.co/CohereLabs) — Open weights catalog
- [Attention Is All You Need (arXiv:1706.03762)](https://arxiv.org/abs/1706.03762) — Foundational Transformer paper co-authored by Aidan Gomez
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site
