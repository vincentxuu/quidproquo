---
title: "Cohere — The RAG-Native Outlier: How to Choose Among Command A+, Embed 5, Rerank 5, and Aya"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, cohere, rag, embedding, rerank, model-family-cohere, model-selection]
lang: en
type: deep-dive
tldr: "Cohere is the only family that ships generation, embedding, reranking, document parsing, and multilingual as separate products. The current generation: Command A+ (2026-05; 218B total / 25B active MoE, 128K, Apache 2.0, runs on two H100s) for generation; Embed 5 (2026-09-30, Pro $0.12 / Fast $0.08 per 1M tokens) and Rerank 5 (2026-10-21, Pro $0.05 / Fast $0.02, returns passages) for retrieval; Aya and North Small Translate for multilingual work. The flagship has commercially self-hostable weights for the first time, but Aya and the translation line remain non-commercial."
description: "Complete guide to the Cohere model family: from the 2019 Toronto founding to Command A+, Embed 5 and Rerank 5 retrieval architecture, the Aya / Tiny Aya multilingual line, Model Vault and private deployment, license tiers, pricing and retirements, and a selection guide for agent developers."
series:
  name: "AI Model Families"
  order: 10
draft: false
glossary:
  - term: "RAG"
    aliases: ["Retrieval-Augmented Generation"]
    definition: "An architecture that retrieves external data before generation, reducing hallucinations and improving traceability."
  - term: "Rerank"
    definition: "The second retrieval stage: re-scoring and reordering recalled candidates so only the most relevant documents reach the generation model."
  - term: "Context Focus"
    definition: "An optional Rerank 5 feature: the same rerank call returns, besides document scores, the most relevant passages inside each document (as character spans), so the downstream LLM reads only what it needs."
  - term: "Model Vault"
    definition: "Cohere's dedicated hosted inference platform; models run on isolated instances billed per GPU-hour, with an Encrypted tier using confidential computing."
  - term: "Aya"
    definition: "Cohere Labs' multilingual research series, from Aya 101 to Tiny Aya, licensed under Apache 2.0 or CC BY-NC depending on the release."
---

> :globe: [中文版](/posts/tech/2026-08-24-ai-model-family-cohere)

In 2019, Transformer co-author Aidan Gomez founded Cohere in Toronto. While most labs chased the strongest chat model, Cohere chose a different path — enterprise RAG infrastructure. Seven years later that bet has grown into a full retrieval pipeline: Command for generation, Embed for embedding, Rerank for precise ranking, Parse for document parsing, plus Aya and North for multilingual and specialist models. 2026 is the line's busiest generational turnover: Command A+ in May, Embed 5 in September, Rerank 5 in October.

This is the Cohere family post in the "AI Model Families" series. The main text covers the 2026 generation; the path from Command R to Command A, Embed v3/v4 and Rerank v3/v4 lives in the family timeline. Cohere's first agentic coding model, North Mini Code, has its [own post](/posts/tech/2026-10-10-ai-model-family-cohere-north-en); here it gets one line in the matrix and selection guide. For how to read the benchmarks cited here, see the [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources); for a quick cross-task selection reference, see the [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview).

## Family positioning and model matrix

Based on the models marked Live on Cohere's official models overview:

| Model / line | Positioning | Key difference | Access |
|---|---|---|---|
| Command A+ (`command-a-plus-05-2026`) | Enterprise agents, RAG, reasoning, vision, translation | 218B total / 25B active MoE, 128K, 48 languages | Apache 2.0 weights; API free up to rate limits, production via Model Vault |
| Embed 5 Pro / Fast | Embeddings for text, images, mixed PDFs | 128K, 256–2048 dims, Pro and Fast share one embedding space | API $0.12 / $0.08 per 1M text tokens; self-hosting available |
| Rerank 5 Pro / Fast | Reranking | 32K, Context Focus returns passages, calibrated scores | API $0.05 / $0.02 per 1M tokens |
| Parse 5 (`parse-v5.0`) | Document parsing: forms and PDFs to structured data | Vision parsing model | API, SageMaker, Foundry |
| North Small Translate, North Mini Code | Translation, agentic coding | The former 218B / 25B, 50+ languages, CC BY-NC; the latter 30B / 3B, Apache 2.0 | API; weights under their respective licenses |
| Aya Expanse 32B, Aya Vision 32B, Tiny Aya | Multilingual research | Tiny Aya is 3.35B, 70 languages, runs on phones | API; weights CC BY-NC |
| Transcribe / Transcribe Arabic | Speech recognition | 14 languages; an Arabic fine-tune | API; Transcribe weights Apache 2.0 |

### A pipeline, not an endpoint

Most families center on one chat model; Cohere's main line is every stage of RAG:

**Generation (Command)**: since Command R, trained for "given documents, answer with citations" and multi-step tool use. Command A+ is the last model in the Command A family, folding Command A Vision (images), Command A Reasoning (reasoning) and Command A Translate (translation) into one set of weights, and it is Cohere's first MoE model.

**Retrieval (Embed, Rerank, Parse)**: Embed 5, Rerank 5 and Parse 5 are what Cohere calls its "latest generation of search models." Embed handles recall, Rerank handles precise ranking and picks passages, Parse turns PDFs and forms into structured data before embedding.

**Multilingual (Aya, North Small Translate)**: Aya is Cohere Labs' research line; North Small Translate is the dedicated translation model from September 2026.

Elsewhere you would assemble OpenAI + BGE + Jina + a translation model yourself; Cohere offers the whole stack under one bill and one private deployment. That is still its moat.

### Platforms: North 2 and Model Vault

On top of the models, Cohere layers two platforms. **North** is the enterprise agent platform; North 2, launched 2026-10-05, has a new agent harness, adds memory, libraries and skills, lets admins set cost caps, rate limits and user quotas, deploys in the cloud, on-prem or air-gapped, and supports bring-your-own models. **Model Vault** is a dedicated inference environment that now runs third-party open models such as DeepSeek, GLM, MiMo, Gemma, Nemotron, GPT-OSS, Phi and Qwen alongside Cohere's own. Production use of Command A+ goes through Model Vault.

## Family evolution

| Version | Released | Key facts | What it changed for selection |
|---|---|---|---|
| Cohere founded | 2019 | Toronto; Aidan Gomez with Nick Frosst and Ivan Zhang | — |
| Command R / R+ | 2024-03 / 04 | RAG-focused, 128K; R+ is 104B with multi-step tool use | "Enterprise Q&A with citations" became Cohere's pitch; the original versions were deprecated on 2025-09-15 |
| Aya 101 / Aya 23 | 2024-02 / 05 | 101 languages under Apache 2.0; 23 languages moved to CC BY-NC | The multilingual research line's license started to tighten |
| Command R+ 08-2024 | 2024-08 | +50% throughput, price cut to $2.50/$10.00 | Same quality, cheaper |
| Aya Expanse | 2024-12 | 8B / 32B, 23 languages | The 8B version was retired on 2026-04-04 |
| Command A | 2025-03-13 | 111B dense, 256K, two GPUs; HF weights CC BY-NC | Private deployment of the flagship dropped to two cards |
| Embed v4 | 2025 | Text + images + mixed PDFs, 128K, variable dimensions | Embedding no longer required converting to text first |
| Command A Vision / Reasoning / Translate | 2025-07 to 08 | Three specialist versions for images, reasoning, 23-language translation | One model per specialist need; selection got more complex |
| Rerank v4 Pro / Fast | 2025-12-11 | 32K, semi-structured data | Long documents and JSON could be reranked directly |
| Transcribe | 2026-03-26 | First speech recognition model, Apache 2.0 | Speech joined the product line |
| Command A+ | 2026-05-20 | 218B / 25B MoE, Apache 2.0, 48 languages | Specialist versions folded back into one model; flagship self-hostable for commercial use for the first time; see sections below |
| North Mini Code | 2026-06 | 30B / 3B MoE, Apache 2.0 | First step into coding ([dedicated post](/posts/tech/2026-10-10-ai-model-family-cohere-north-en)) |
| North Small Translate | 2026-09 | 218B / 25B MoE, 50+ languages, CC BY-NC | Translation split into a dedicated model |
| Embed 5 Pro / Fast | 2026-09-30 | ViDoRe V3 Pro 85.8 (Embed 4: 77.0), shared embedding space | Indexing and querying can use different price tiers ([model card](/posts/daily/2026-10-06-model-cohere-embed-5-en)) |
| North 2 | 2026-10-05 | Enterprise agent platform overhaul | Platform layer supports bring-your-own models |
| Rerank 5 Pro / Fast | 2026-10-21 | Context Focus, calibrated scores, token-based billing | Reranking also picks passages, cutting downstream tokens further |

The seven-year rhythm is not "a bigger model every quarter" but each line evolving on its own, with all of them turning over in 2026. The generation line changed most: in 2025 it sprouted three specialist versions (Vision, Reasoning, Translate), and in 2026 it folded them all back into Command A+; the license also moved from Command A's CC BY-NC to Command A+'s Apache 2.0.

## Architecture and training trade-offs

### Command A+: Cohere's first MoE

The [Hugging Face model card](https://huggingface.co/CohereLabs/command-a-plus-05-2026-w4a4) spells out the structure: a decoder-only sparse MoE with 218B total parameters and 25B active per token; 128 experts with 8 active, plus 1 shared expert applied to every token. Attention follows Command A's design—sliding-window attention (with RoPE) interleaved 3:1 with global attention layers that use no positional embeddings.

The payoff is deployment efficiency: at W4A4 quantization it needs as little as 1 B200 or 2 H100s, and Cohere reports clearly better latency and throughput than Command A Reasoning. The cost is context dropping from Command A's 256K to 128K (64K max output), with a knowledge cutoff of 2025-04-01.

### Grounded generation and citations

The Command line is optimized from training for "given documents, answer with citations," marking which document each statement came from. Command A+ keeps this citation format and puts tool use, reasoning and vision into the same model—no more switching models when you need to read an image or reason.

### Embed 5: indexing and querying priced separately

Embed 5's key design is that Pro and Fast **share one embedding space**: you can index with Pro and query with Fast (or vice versa), and Cohere's own tests show cross combinations lose only 1.6–2.7% on average versus same-model baselines, with no re-indexing. Fast costs a third less than Pro and delivers 2.4× Pro's document throughput on average. Both support Matryoshka dimensions (256 to 2048) and float/int8/binary formats; Cohere recommends 1024-dim int8 for most scenarios.

### Rerank 5: reranking that also picks passages

Rerank 5's new **Context Focus** feature returns, in the same call, the most relevant character spans inside each document alongside document scores; scores are also calibrated (0.7 means roughly a 70% chance the document is useful), so one threshold works across queries and domains. On 30 QA datasets Cohere measured that removing half the retrieved context kept 96% of answer quality, and removing three-quarters kept 87%. Rerank reads raw text at query time, so upgrading from earlier versions needs no re-indexing.

## Evaluation and alternatives

All figures below are self-reported by Cohere; Embed 5 and Rerank 5 use Cohere's own RCP-nDCG@10 methodology and have no independent third-party replication yet.

### Generation: Command A+

| Benchmark | Command A+ | Comparison | Conditions |
|---|---|---|---|
| τ²-Bench Telecom | 85% | Command A Reasoning 37% | Standard settings and user simulation |
| Terminal-Bench Hard | 25% | Command A Reasoning 3% | Terminus-2 harness, following Artificial Analysis methodology |
| Artificial Analysis Intelligence Index | 37 | Cohere says it beats other leading open models | Index version at launch |

Cohere compares only against its own predecessor and "other open models," with no direct comparison to closed frontier models. The 37 is on the index as of launch (2026-05) and cannot be compared directly with later index revisions.

### Retrieval: Embed 5 and Rerank 5

| Model | Benchmark | Score | Comparison |
|---|---|---|---|
| Embed 5 Pro | ViDoRe V3 (visually rich enterprise documents) | 85.8 | Embed 4 77.0, Voyage 4 Large 83.7, Gemini Embedding 2 83.2 |
| Embed 5 Pro | FinanceBench | 80.1 | OpenAI text-embedding-3-large 58.7 |
| Rerank 5 Pro | BRIGHT | 82.2 | Voyage AI Rerank 3 5.8 points lower |
| Rerank 5 Pro | 46 composite datasets | First on 39, top two on 43 | ViDoRe V3, nanoMTEB, BRIGHT, BEIR and more |
| Rerank 5 Pro + Context Focus (threshold 0.4) | Search-agent evaluation | 58% accuracy, 35% fewer tokens than BM25 alone | BM25 alone 46% |

Embed 5's announcement cites no general English retrieval benchmark such as MTEB; its strengths are concentrated in visually rich documents, financial documents and multilingual retrieval.

### Competitive position

- **Against OpenAI embeddings and general models**: Embed 5 self-reports a large lead over text-embedding-3-large on financial and visual documents; OpenAI still leads on general generation quality and ecosystem
- **Against Voyage and Gemini Embedding (closed retrieval)**: Embed 5 Pro self-reports a 1–3 point lead and Rerank 5 Pro a lead over Voyage Rerank 3; the gaps are small, so retest on your own corpus
- **Against BGE-M3 and Jina (open retrieval)**: open stacks are self-hostable and cheap; Embed 5 also supports self-hosting, but license and fees go through Cohere
- **Against Qwen, DeepSeek, Mistral (open-weight generation)**: Command A+ is Apache 2.0 and runs on two H100s, putting Cohere on the same starting line as these families for the first time; on overall capability, the sources cited here have no directly comparable same-condition scores
- **Against Claude, GPT, Gemini (closed generation)**: closed frontier models still lead on coding and reasoning; Cohere's differentiation is the full RAG pipeline and private deployment

In one line: **if you want "the strongest /chat/completions endpoint," Cohere is not the first pick; if you want "a privately deployable RAG pipeline where parsing through generation come from one vendor," Cohere is one of the few families that delivers it all at once.**

## Licensing, pricing, and deployment

### License tiers

| License | Applies to | Meaning |
|---|---|---|
| Apache 2.0 | Command A+, North Mini Code, Transcribe, Aya 101 | Commercial use, self-hosting and modification allowed |
| CC BY-NC 4.0 (with the Cohere Labs acceptable use policy) | HF weights of Command A and Command R/R+, Aya 23, Aya Expanse, Aya Vision, Tiny Aya, North Small Translate | Research and non-commercial only; commercial use goes through the API or sales |
| Service only, no public weights | Embed, Rerank, Parse | Via API, Model Vault or private deployment |

Command A+ is the biggest change in this table: Cohere's flagship generation model has commercially usable open weights for the first time. But North Small Translate, built on the same 218B / 25B footprint, remains CC BY-NC—same parameter count does not mean A+'s license applies.

### API pricing

| Model | Billing | Price |
|---|---|---|
| Command A+ | Free up to rate limits (trial and production keys) | Production use via Model Vault |
| Command A 03-2025, Command R+ 08-2024 | Per 1M tokens | $2.50 / $10.00 |
| Embed 5 Pro / Fast | Per 1M tokens (text / image) | Pro $0.12 / $0.40; Fast $0.08 / $0.40 |
| Rerank 5 Pro / Fast | Per 1M tokens | Pro $0.05; Fast $0.02 |
| Aya Expanse 32B | Per 1M tokens | $0.50 / $1.50 |

Rerank 5 is billed per token; the older Rerank "search unit" (1 query plus up to 100 documents) does not apply.

### Model Vault (per GPU-hour, on-demand / promotional through 2027-03-31)

| GPU | On-demand | Promotional |
|---|---|---|
| L4 24GB | $3.00 | $1.00 |
| A100 80GB | $3.50 | $2.25 |
| H100 80GB | $6.25 | $4.25 |
| H100 80GB (Encrypted, confidential compute) | $9.00 | $4.25 |
| H200 141GB | $7.25 | $5.50 |
| B200 192GB | $9.75 | $8.00 |
| GB200 192GB | $12.50 | $10.00 |

Model Vault instances are dedicated (not multi-tenant), in Standard and Encrypted (confidential computing, remote attestation) tiers; Command A+'s minimum of 2 H100s works out to about $8.50/hour at the promotional rate.

### Deprecated and retired

- `command-r-03-2024`, `command-r-plus-04-2024`, `command`, `command-light`: deprecated 2025-09-15; Cohere recommends Command A or R/R+ 08-2024
- Aya Expanse 8B, Aya Vision 8B, Embed v2.0: retired 2026-04-04
- Rerank v4: still available, labeled previous generation; Rerank 5 recommended for new projects

### Private deployment

Besides Model Vault, Cohere offers Private Deployments in the customer's own environment (on-prem or isolated VPC) across AWS, Azure, GCP and OCI; Embed 5 and Rerank 5 are also available through Microsoft Foundry, Amazon SageMaker and OpenRouter.

## Agent integration and selection

- **Enterprise knowledge-base RAG (new project)** → index with Embed 5 Pro, query with Embed 5 Fast, rerank with Rerank 5 Pro with Context Focus on, generate with citations using Command A+: one API, one private deployment, and Context Focus can cut downstream tokens by a third or more
- **Self-hosted, commercially usable agent model** → Command A+: Apache 2.0, two H100s; check first that 128K context is enough
- **Agent loops with repeated searches** → Embed 5's shared embedding space matches the "index once, query many times" cost structure; Rerank 5's calibrated scores let an agent use a fixed threshold to decide whether to search again
- **Financial filings, technical manuals, scanned PDFs** → parse first with Parse 5, or use Embed 5's mixed image-text embeddings directly
- **Multilingual** → commercial generation with Command A+ (48 languages); for on-device small models consider Tiny Aya, but it is CC BY-NC, so commercial use needs a separate deal
- **Translation** → commercial use via Command A+ or a commercial license for North Small Translate; research can use the North Small Translate weights directly
- **Coding agents** → see the [North Mini Code post](/posts/tech/2026-10-10-ai-model-family-cohere-north-en); for complex coding a closed frontier model is still the better generator, with Cohere handling retrieval
- **Still on Command A or Rerank v4** → both still work; before switching to Command A+, check the impact of context dropping from 256K to 128K; moving Rerank to v5 is just a model-parameter change

Minimal selection check: take 50–100 real queries and compare hit rate and tokens sent to the LLM for "your current retrieval" versus "Embed 5 + Rerank 5 (Context Focus off / on)." This generation's claims center on "fewer tokens at the same quality," which is the easiest number to verify on your own corpus.

## Limitations and trade-offs

- **Evaluations are nearly all self-reported**: Embed 5 and Rerank 5 use Cohere's own RCP-nDCG@10; annotations and code are published, but Cohere designed the evaluation sets
- **Inconsistent licensing**: within one generation, Command A+ is Apache 2.0, Aya, Tiny Aya and North Small Translate are CC BY-NC, and Embed/Rerank have no public weights; check each one
- **Command A+ has shorter context**: 128K is enough for most RAG, but long-document workflows that relied on Command A's 256K need retesting
- **Free API has limits**: Command A+ is free up to rate limits; production requires a Model Vault billed per GPU-hour, a different cost structure from per-token billing
- **General capability is not the pitch**: Cohere publishes no direct comparison of Command A+ against closed frontier models; where top reasoning or coding matters, do not expect it to replace frontier models

## Update history

- **2026-11-23**: Added the 2026 generation (Command A+, Embed 5, Rerank 5, Parse 5, North Small Translate, Tiny Aya, Transcribe); rewrote the matrix, evaluation, pricing and selection sections from Cohere's models overview, model docs and launch posts; added a license tier table and Model Vault per-GPU-hour pricing. Command A, Embed v4 and Rerank v4 moved to history; the old Embed v4 / Rerank v4 spec tables left the main text, and Embed 5's launch figures are in the daily model card linked from the timeline. Corrected errors: the post said Cohere's flagship had no commercially self-hostable weights, but Command A+ is released under Apache 2.0; Apache 2.0 models include Command A+ and Transcribe, not just Aya 101 and North Mini Code; Aya Expanse 8B was retired on 2026-04-04; Model Vault is now priced per GPU-hour; Command A Vision, Reasoning and Translate (2025), previously missing, were added to the timeline. North Mini Code details stay in the dedicated post, with only a link here.
- **2026-10-11**: Restructured sections to the shared family format and added a matrix compiled from existing content. Kept the original versions, prices, and source dates; no new round of fact-checking.

## References

- [Cohere official site](https://cohere.com)
- [An Overview of Cohere's Models — Cohere Docs](https://docs.cohere.com/docs/models) — full model list, context, status and platform mapping
- [Introducing Command A+ — Cohere Blog](https://cohere.com/blog/command-a-plus) — Apache 2.0, 218B / 25B, 48 languages, τ²-Bench, AA Intelligence Index 37
- [Command A+ — Cohere Docs](https://docs.cohere.com/docs/command-a-plus) — 2026-05-20, 128K / 64K, free up to rate limits, Model Vault
- [Command A+ W4A4 — Hugging Face](https://huggingface.co/CohereLabs/command-a-plus-05-2026-w4a4) — 128 experts / 8 active, attention layout
- [Embed 5 — Cohere Blog](https://cohere.com/blog/embed-5) — Pro / Fast, shared embedding space, pricing, ViDoRe V3
- [Cohere Rerank 5 — Cohere Blog](https://cohere.com/blog/rerank-5) and [Announcing Rerank 5 — Cohere Changelog](https://docs.cohere.com/v2/changelog/rerank-v5) — Context Focus, calibrated scores, $0.05 / $0.02
- [Release Notes — Cohere](https://docs.cohere.com/changelog) — Rerank v4 (2025-12-11), Transcribe (2026-03-26), Embed 5 (2026-09-30), Aya 8B retirement (2026-04-04)
- [Deprecations — Cohere Docs](https://docs.cohere.com/docs/deprecations)
- [Cohere Pricing](https://cohere.com/pricing) — legacy model prices, Aya Expanse, Model Vault per GPU-hour
- [Tiny Aya — Cohere Docs](https://docs.cohere.com/docs/tiny-aya) and [tiny-aya-global — Hugging Face](https://huggingface.co/CohereLabs/tiny-aya-global) — 3.35B, 70 languages, CC BY-NC
- [North-Small-Translate-1.0 — Hugging Face](https://huggingface.co/CohereLabs/north-small-translate-1.0) — CC BY-NC 4.0, WMT26
- [Introducing North 2 — Cohere Blog](https://cohere.com/blog/introducing-north-2)
- [Command A — Cohere Docs](https://docs.cohere.com/docs/command-a) and [Introducing Command A — Cohere Blog](https://cohere.com/blog/command-a)
- [Command A 03-2025 — HuggingFace](https://huggingface.co/CohereLabs/c4ai-command-a-03-2025) — 111B, 256K, CC BY-NC
- [Aya — Cohere Research](https://cohere.com/research/aya), [Aya 101 — HuggingFace](https://huggingface.co/CohereLabs/aya-101), [Aya Expanse 32B](https://huggingface.co/CohereLabs/aya-expanse-32b)
- [Model Vault — Docs](https://docs.cohere.com/docs/model-vault) and [Private Deployments](https://cohere.com/private-deployments)
- [Cohere Labs — HuggingFace](https://huggingface.co/CohereLabs) — open-weight catalog
- [Attention Is All You Need (arXiv:1706.03762)](https://arxiv.org/abs/1706.03762) — the founding Transformer paper, co-authored by Aidan Gomez
- [AI Model Evaluation Sources Guide](/posts/tech/2026-08-24-ai-model-evaluation-sources) — this site
- [AI Model Landscape Overview](/posts/tech/2026-08-24-ai-model-landscape-overview) — this site
