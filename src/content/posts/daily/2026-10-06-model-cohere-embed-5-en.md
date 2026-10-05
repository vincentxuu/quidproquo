---
title: "Model Card: Cohere Embed 5"
date: 2026-10-06
category: daily
type: digest
tags: [ai-agent, model-release, daily, cohere, model-family-embed]
lang: en
description: "Cohere ships Embed 5, a new Pro/Fast embedding model pair — a new high on visually-rich enterprise document retrieval (ViDoRe V3: 85.8), with Pro for indexing and Fast for queries sharing one embedding space"
tldr: "Cohere Embed 5: announced 2026-09-30. Pro and Fast tiers, 128K context, text + image + mixed-PDF input, 100+ languages; priced at $0.12 (Pro) / $0.08 (Fast) per 1M text tokens, with image tokens at $0.40 for both; on ViDoRe V3 (visually-rich enterprise document retrieval) Pro scores 85.8, up 8.8 points from Embed 4's 77.0, ahead of Voyage 4 Large (83.7) and Gemini Embedding 2 (83.2); Pro and Fast share one embedding space, so you can index with Pro and query with Fast — cross-model combinations only lose 1.6–2.7% on average and don't require rebuilding the index; all figures are Cohere's own benchmarks, not yet independently reproduced"
series:
  name: "AI Model Tracker"
  order: 41
glossary:
  - term: "Embed"
    def: "Cohere's family of text/image embedding models, which turn content into vectors for semantic search and RAG"
---

> 🌏 [中文版](/posts/daily/2026-10-06-model-cohere-embed-5)

## Model Details

| Field | Value |
|---|---|
| Model ID | `embed-v5.0-pro` / `embed-v5.0-fast` |
| Vendor | Cohere |
| Parameters | Not disclosed |
| Context Window | 128,000 tokens (text, image, and mixed text+image alike) |
| Input Pricing (USD/1M tokens) | Pro $0.12 / Fast $0.08 (text); image tokens are $0.40 for both |
| Output Pricing (USD/1M tokens) | Not applicable — embedding models charge only for input tokens; there's no generative output |
| Open Source | No (served via API / Model Vault / Microsoft Foundry / Amazon SageMaker, with a self-hosting option on vLLM, but no publicly released open-weight license) |
| Release Date | 2026-09-30 |
| Official Announcement | [Cohere Blog: Embed 5 — Frontier Embedding Models for Enterprise](https://cohere.com/blog/embed-5) |
| HuggingFace | Not applicable (no public weights) |
| Family | Cohere Embed 5.x |

## Key Capabilities

- On ViDoRe V3 (retrieval over visually rich enterprise documents — financial filings, technical manuals, regulatory material, government reports), Embed 5 Pro averages 85.8, up 8.8 points from Embed 4's 77.0, with the biggest gains in HR (+11.4) and industrial (+10.3) domains
- First model family evaluated with RCP-nDCG@10, a new Cohere methodology that scores retrieved documents against query-specific relevance criteria instead of a fixed label set, which Cohere says better reflects quality on a team's own corpus
- Pro and Fast share a single embedding space: you can index with Pro and query with Fast (or vice versa). Across 40 development datasets, cross-model combinations lose only 1.6–2.7% on average versus same-model baselines, with no index rebuild required
- Supports Matryoshka embeddings plus float/int8/binary formats: a 2048-dimension float32 vector (8KB) can shrink to a 256-dimension binary vector (32 bytes) — a 256x reduction. Across 100 million chunks, that cuts vector storage from roughly 819GB to 3.2GB; Cohere recommends 1024-dimension int8 vectors as the typical quality/cost sweet spot

## Benchmark Results

| Benchmark | Embed 5 Pro | Embed 5 Fast | Previous (Embed 4) | Best Competitor |
|---|---|---|---|---|
| ViDoRe V3 (8-domain average) | 85.8 | 84.5 | 77.0 | Voyage 4 Large 83.7, Gemini Embedding 2 83.2 |
| FinanceBench | 80.1 | 80.0 | Not listed | OpenAI text-embedding-3-large 58.7 (Pro leads by 21.4 points) |
| FinQA | 90.0 | 88.8 | Not listed | No runner-up listed |
| Multilingual (avg. of German/French/Spanish/Italian/Russian) | 77 | Not listed | ~70 (+7) | Voyage 4 Large 76, Gemini Embedding 2 73 |
| Finance 3-benchmark average (FinanceBench/FinQA/ViDoRe V3 Finance) | Leads runner-up by 3.3 points | — | Not listed | Gemini Embedding 2 (runner-up) |

⚠️ All figures above are Cohere's own benchmarks; there's no independent third-party reproduction yet. RCP-nDCG@10 is a Cohere-designed methodology introduced with Embed 5 — Cohere published the annotations and code for outside review, but the evaluation set itself was still designed and curated by Cohere.

## vs. Previous Generation / Competitors

Compared with Embed 4, Embed 5's biggest gains aren't in plain English text retrieval — they're in documents where structure itself carries meaning: tables, charts, multi-column layouts, scanned financial pages that older "convert to text, then embed" pipelines tend to mangle. The 8.8-point average gain on ViDoRe V3, with HR and industrial domains both up more than 10 points, shows this release is mainly about closing the gap on non-plain-text document retrieval.

Against competitors, Embed 5 Pro leads on three vertical fronts — visually rich documents, financial documents, and multilingual retrieval (especially Middle Eastern and South Asian languages like Farsi, Telugu, and Hindi) — typically by 1–3 points over Voyage 4 Large and Gemini Embedding 2. The margin over OpenAI's text-embedding-3-large is much larger (21.4 points on FinanceBench). Notably, the announcement never cites a general-purpose benchmark like MTEB, which suggests Cohere is positioning this release around enterprise vertical differentiation rather than claiming a blanket new state of the art on general retrieval.

On pricing, Embed 5 splits indexing and querying into two price points — Pro costs 50% more than Fast, but Fast delivers 2.4x the average document throughput. That's different from most embedding models, which charge one price regardless of use case; Embed 5 effectively bakes the two-stage nature of a retrieval pipeline (batch indexing, where cost sensitivity is lower and quality matters most, vs. live querying, where latency and cost matter most) directly into the pricing.

## What This Means for Agent Development

Embed 5 isn't a generative model, but the quality ceiling for most RAG or agentic retrieval pipelines is often set by the retrieval layer, not the generation layer — if what gets retrieved is irrelevant or missing structure, no amount of LLM capability can fix that downstream.

- If you're building an agent loop that retrieves repeatedly (multi-turn search, a deep-research agent that narrows scope step by step): the shared embedding space fits directly — index once with Pro to get quality right, then use the cheaper Fast for every subsequent query round, without sacrificing index quality or rebuilding the index just to switch models
- If you're building a knowledge-base agent over financial reports, technical manuals, or regulatory documents where the information lives in tables, charts, or layout: Embed 5 Pro supports page-image and fused text-image embeddings directly, letting you skip the "OCR or convert to text first" step and avoid the structural loss that step tends to introduce
- If storage and infrastructure cost matter to you: int8/binary quantized embeddings combined with Matryoshka can cut vector storage to 1/256 of the baseline at scale (hundreds of millions of chunks) — a more concrete win for teams running their own vector databases than the benchmark gains themselves
- Not a fit: lightweight, plain-English FAQ retrieval — Cohere didn't bring out a general benchmark like MTEB for this release, so if your use case is simple text-only semantic search, a cheaper existing open-source embedding model may already be good enough without paying for Embed 5's vertical-domain advantages

## Today's Takeaway

Embedding model releases often get waved off as "minor infrastructure updates" because they can't demo a conversation the way a chat model can. But Embed 5 turns "index with the expensive Pro, query with the cheap Fast" into the core of its product design — which tells you the vendor itself recognizes that a retrieval pipeline's cost structure is fundamentally different from a generative model's: indexing is a one-time batch cost, while querying is a cost that accumulates with every loop of an agent's retrieval calls. Those two stages deserve different cost/quality tradeoffs by design, not a single model trying to cover both.

## References

- [Cohere Blog: Embed 5 — Frontier Embedding Models for Enterprise](https://cohere.com/blog/embed-5)
- [Cohere Docs: Cohere's Embed Models (embed-v5.0-pro / embed-v5.0-fast spec table)](https://docs.cohere.com/docs/cohere-embed)
- [tao.media: Cohere Launches Embed 5 Pro and Fast Frontier Embedding Models](https://www.tao.media/cohere-launches-embed-5-pro-and-fast-frontier-embedding-models)
- [digitalapplied: Cohere Embed 5: Pro and Fast Embedding Models Compared](https://www.digitalapplied.com/blog/cohere-embed-5-pro-fast-embedding-models)
