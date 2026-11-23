---
title: "Commercial Document Parsing APIs Compared: Specialized Parsers, General VLMs, and the Big Three Clouds"
date: 2026-09-16
category: ai
type: deep-dive
tags: [document-parsing, commercial-api, cohere-parse, llamaparse, azure-document-intelligence, google-document-ai, aws-textract, reducto, vision-language-model, rag, enterprise]
lang: en
tldr: "Three routes to commercial document parsing: specialized parsers (Cohere Parse at $1.50/k pages, Reducto r-1 mini at $1, LlamaParse Agentic Plus first on ParseBench 2 at 90.93), Big Three clouds (Azure/Google/AWS for field extraction and compliance; AWS launched the generative Textract Insights in November 2026), and general-purpose VLMs (Claude Opus 5.5 ranks second on ParseBench 2, but its measured cost is about $65 per 1K pages, more than double the top-ranked LlamaParse Agentic Plus). The biggest shift in late 2026: the cheapest VLMs (GPT-6 Luna, Claude Haiku 5.5) now measure $1.3–1.6 per 1K pages, the same as specialized parsers, but they barely extract charts. The first question is still 'do you need transcription or comprehension?'"
description: "Comparing specialized document parsers (Cohere Parse, LlamaParse, Reducto, Mistral OCR, Datalab), Big Three cloud services (Azure DI / Content Understanding, Google Document AI, AWS Textract Core / Insights), and general-purpose VLMs (Claude, GPT, Gemini) on positioning, pricing, and capabilities, recomputing the 100K-pages/month crossover with ParseBench 2 measured costs. Part of the Document Parsing in Practice series."
draft: false
series:
  name: "Document Parsing in Practice"
  order: 11
glossary:
  - term: "ParseBench"
    definition: "A document parsing benchmark published by LlamaIndex. v1 covers ~2,000 human-verified enterprise pages across five dimensions; ParseBench 2 expands to 4,317 test cases across six dimensions (adding forms) with severity-aware scoring. Scores from the two versions are not comparable."
    context: "The most cited cross-vendor evaluation for commercial APIs, but the top-ranked LlamaParse is the publisher's own product."
  - term: "Prebuilt Model"
    definition: "A pre-trained document parsing model offered by cloud vendors, targeting specific document types (invoices, receipts, IDs) for structured field extraction without user-supplied training data."
    context: "Azure and Google offer 20+ prebuilt document types — this is their main differentiator over pure-parsing APIs."
---

> :globe: [中文版](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison)

The first seven posts in this series covered open-source tools exclusively: from the [three-layer staircase](/posts/ai/2026-08-06-document-parsing-three-layers-en) selection framework, through [MarkItDown](/posts/ai/2026-04-18-markitdown-intro-en) and [anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en) at the conversion layer, [PyMuPDF / pdfplumber](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en) at the extraction layer, [MinerU / Marker / Docling](/posts/ai/2026-08-06-document-parsing-layout-ocr-en) at the parsing layer, to [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents-en) for agent-driven tool selection. The conclusion was always the same: **pick the right layer first, then pick the tool**.

But enterprise scenarios create three forces that push you from open source toward commercial APIs:

1. **No GPU appetite.** Parsing-layer open-source tools all require GPUs — MinerU recommends 8GB+ VRAM, Docling's VlmPipeline needs more. Not every team has the ML Ops capability to maintain an inference cluster.
2. **SLA requirements.** Open-source tools come with no uptime guarantees and no support. Wrapping them in a microservice means 99.9% availability is your problem.
3. **Compliance.** Finance, healthcare, and government scenarios demand SOC 2, HIPAA, or FedRAMP. The Big Three clouds' document parsing services carry these certifications natively; open-source deployments need to add them yourself.

This post organizes commercial options into three routes — **specialized document parsers**, **Big Three cloud prebuilt services**, and **general-purpose VLMs** — and maps them back into the three-layer staircase framework, comparing pricing, capabilities, and cost models, ending with a decision tree. All prices below are list prices from each vendor's official pricing page as of November 2026 (USD, before tax and volume discounts).

## Six Major APIs at a Glance

| | Positioning | Price (per 1K pages) | Output | Strength | Key Limitation |
|---|---|---|---|---|---|
| **Cohere Parse 5** | Dedicated document VLM | API $1.50; Model Vault billed by GPU hour | Markdown | 2.3B params, lowest cost tier, private deployment | No confidence scores, no JSON output, only 9 languages |
| **LlamaParse** | Multi-tier agentic parsing | Fast $1.50 → Agentic Plus $37.50 (Pro plan $1.25 → $31.25) | Markdown / JSON | Four tiers, #1 on ParseBench 2 (90.93) | The ParseBench publisher's own product; Agentic Plus costs 25× Fast |
| **Azure DI** | Full-featured cloud | Read $1.50, Layout/Prebuilt $10, Custom $30 | JSON (structured fields) | 20+ prebuilt document models; monthly commitment tiers go as low as $0.45 | Barely extracts charts; merging with Content Understanding |
| **Google Document AI** | GCP ecosystem | OCR $1.50, Layout Parser $10, Form/Custom $30; Invoice billed per document | JSON (structured fields) | Custom Extractor; Layout Parser includes chunking | Invoice and similar prebuilts bill per document, expensive for single-page files; custom processors carry hosting fees |
| **AWS Textract** | AWS ecosystem | Core: Text $1.50, Tables $15, Forms $50; Insights: Extraction $8.50, Custom $40 | JSON; Insights also outputs Markdown/HTML | Analyze Lending (mortgage packets); generative Insights added November 2026 | Core Forms is the most expensive per page; Insights only in two US regions, 6 languages |
| **Reducto** | Developer-oriented agentic | r-1 mini $1, r-1 $10, Extract $20, Deep Extract $40 | Markdown / JSON | #4 on ParseBench 2 (86.23), citation grounding | r-1 mini is cheap but scores near zero on charts |

Several structural differences worth noting:

**Cohere and LlamaParse output Markdown**, designed for RAG pipeline ingestion — converting documents into text LLMs can consume. **The Big Three and Reducto's Extract output structured JSON**, designed for field extraction — pulling "vendor name," "amount," and "date" key-value pairs from invoices.

This isn't a minor distinction. If your use case is "drop PDFs into a vector database for semantic search," Markdown output works directly. If it's "auto-reconcile invoices," structured JSON saves you writing a parser. Picking the wrong output format means an order-of-magnitude difference in downstream engineering effort.

That line started to blur in late 2026. AWS's [Textract Insights](https://aws.amazon.com/about-aws/whats-new/2026/11/textract-insights-ga/) (GA on November 20, 2026) returns Markdown/HTML for RAG and the fields defined in a blueprint for your systems from the same request; Azure is folding Document Intelligence and the generative-model-based Content Understanding together under Microsoft Foundry. The Big Three are converging on "parse and extract in one pass."

## Other Notable Commercial Options

Beyond the six, several others deserve a spot on your evaluation list:

| | Price (per 1K pages) | Differentiator | Best For |
|---|---|---|---|
| **Mistral OCR 4.1** | $4 (real-time) / $2 (batch); Document AI field extraction $5 | Paragraph-level bounding boxes, block labels, block- and word-level confidence scores; 170 languages; enterprise self-hosting in a single container | High-volume ingestion that needs confidence scores on a budget |
| **Datalab** | Balanced $4, Accurate $10 (25% off if you allow training on your data) | Hosted version from the Marker/Surya team; ParseBench 2 Accurate 82.63, tables 90.38 | Text- and table-heavy documents with few charts |
| **Upstage Document Parse** | Up to $30 (Auto mode picks Standard or Enhanced per page); plain OCR $1.50 | Korean vendor with deep CJK document experience | CJK documents |
| **Unstructured** | $15 (full pipeline) | Not just a parser — an ETL platform (chunking + embedding + connectors) | One-stop ingestion pipeline |
| **Mathpix** | $5 (real-time) / $1.50 (batch) | Best-in-class LaTeX formula recognition | Academic papers, math/science documents |
| **LandingAI ADE** | Credit-based ($1 = 100 credits); DPT-3 Pro ~1.5 credits/page, DPT-3 Verity ~0.55 | Agentic extraction, fine-grained visual grounding | Agentic field extraction |
| **Baidu AI Cloud Document Parsing** | Unlimited-OCR RMB 0.02/page (limited-time discount, list RMB 0.05); PaddleOCR-VL RMB 0.05 | Backed by the open-source [Unlimited OCR 2](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2-en) and PaddleOCR-VL; handles 100-page documents | Simplified Chinese documents, processing inside mainland China |
| **ABBYY Vantage** | No public list price; annual contracts | 30 years of OCR experience, most mature on-prem deployment | Large-scale IDP in finance/insurance |
| **Nanonets** | Per workflow block, $0.02–0.30 per run | No-code UI, built-in validation workflows | Low-volume SMBs needing human review |

**Reducto r-1 mini** deserves special mention: at $1 per 1K pages it is the cheapest specialized parser on paper, scoring 86.11 on ParseBench 2 tables and 88.53 on visual grounding, but only 1.35 on charts — it is built for high volumes of text and table pages. In the same price band, **Mistral OCR 4.1** batch at $2 per 1K pages wins on confidence scores: every block in OCR 4.1 carries one, so you can decide directly which pages go to human review.

Two reference points that aren't in the table: Cloudflare Workers AI's [`toMarkdown`](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities-en) is free for most formats, but it is a [conversion-layer](/posts/ai/2026-08-06-document-parsing-three-layers-en) tool; scans and complex layouts are out of scope. Tencent Youtu's [Youtu-Parsing-Omni](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni-en) is an open-weight model with no official hosted API, so you deploy it yourself.

## Using General-Purpose VLMs as Parsers

Beyond specialized parsers, there's an entirely different path: screenshot each PDF page, send it to Claude, GPT, or Gemini, and prompt it to output Markdown or JSON.

This isn't lazy. On [ParseBench 2](https://github.com/run-llama/ParseBench) (4,317 test cases across six dimensions, scored by error severity), general-purpose VLMs now sit among the top specialized parsers:

| Rank | Solution | ParseBench 2 Overall | Measured cost per 1K pages | Type |
|---|---|---|---|---|
| 1 | LlamaParse Agentic Plus | **90.93** | $28 | Specialized parser |
| 2 | **Claude Opus 5.5** | **87.11** | $65 | General VLM |
| 3 | LlamaParse Agentic | 86.96 | $12.50 | Specialized parser |
| 4 | Reducto r-1 | 86.23 | $10 | Specialized parser |
| 5 | LlamaParse Cost Effective | 85.52 | $3.75 | Specialized parser |
| 6 | Gemini 4 Argon (low) | 85.32 | $27 | General VLM |
| 13 | GPT-6.2 Sol (medium) | 82.12 | $25 | General VLM |
| — | Claude Sonnet 5.5 | 75.07 | $31 | General VLM |
| — | GPT-6 Luna (low) | 74.59 | $1.30 | General VLM |
| — | Mistral OCR 4.1 | 69.26 | $4 | Specialized parser |
| — | Azure DI (layout) | 66.81 | $10 | Big Three |

ParseBench 2 scores are not comparable with v1, and the v1 board keeps getting re-scored, so check which version and which date a number comes from before quoting it. Google Document AI and AWS Textract appear only on the v1 board, both with overall scores below 50; Cohere Parse is on neither.

ParseBench covers enterprise documents (insurance, finance, government) of limited difficulty. The stricter [Dr.DocBench](https://arxiv.org/abs/2606.01393) (arXiv:2606.01393, June 2026, 4,514 expert-level pages across 52 subjects) tested the frontier VLMs of that time, which clustered around 60:

| Model (June 2026 versions) | Dr.DocBench Overall | Table TEDS |
|---|---|---|
| GPT-5.5 | **61.94** | 48.90 |
| Claude Opus 4.6 | 60.19 | 49.21 |
| Gemini 3.1 Pro | 60.13 | 51.26 |
| MinerU 2.5 (pipeline) | 54.37 | **55.85** |

On expert-level documents, the pipeline-based MinerU 2.5 beat every general VLM on table structure. But that test used the previous generation; on ParseBench 2, current frontier VLMs post the highest table scores on the board (Gemini 4 Neon 95.23, GPT-6.2 Sol 94.91, Claude Opus 5.5 94.20), level with LlamaParse Agentic Plus (94.72). For tables, "VLMs trail specialized tools" no longer holds as a general rule.

Unstructured's [SCORE-Bench](https://unstructured.io/blog/frontier-models-are-strong-but-document-parsing-is-harder) (August 2026, 224 real-world documents) breaks down another dimension: specialized pipelines beat raw VLMs by 4–16 percentage points on composite metrics, and hallucination rates vary widely — Claude Opus 4.6 at the time scored just 0.044 (on par with pipelines), GPT-5.2 hit 0.167, and Gemini 2.5 Pro reached 0.257. All of these versions have since been replaced, and the new generation has no numbers on the same test yet; "hallucination tendencies differ widely across VLM families" is still worth re-testing on your own documents before you switch models.

### VLM Strengths: Flexibility and Comprehension

The biggest advantage is **flexibility**: adjust output format via prompt, no API update needed. Markdown today, JSON tomorrow, "extract only line items over $100K" the day after — general VLMs handle all of it; specialized parsers can't. Only a general VLM can answer comprehension questions like "where are the risks in this contract?"

Charts need a separate look. On ParseBench v1, most specialized parsers scored below 6% on charts and general VLMs led by a wide margin. On ParseBench 2, where the chart dimension asks for the full underlying data table, the leaders are agentic parsers — LlamaParse Agentic Plus 92.58, Reducto in agentic mode 89.07, Pulse Ultra 2 86.80 — which call a VLM internally on chart pages. Raw VLMs vary widely: GPT-6.2 Sol (medium) 78.86, Claude Opus 5.5 74.12, while Claude Sonnet 5.5 scores only 38.59 and Claude Haiku 5.5 only 12.13. Cheap VLMs barely help with charts.

### VLM Weaknesses: Cost, Stability, Hallucination

Per-page cost depends on how you count. Using the simplest assumption — one page image ≈ 1,750 input tokens, ≈ 500 output tokens, no reasoning — against each vendor's list price, side by side with what ParseBench 2 actually measured:

**Specialized parsers (list price per 1K pages):**

| Solution | Cost per 1K pages |
|---|---|
| Reducto r-1 mini | $1.00 |
| Cohere Parse 5 | $1.50 |
| Mistral OCR 4.1 batch | $2.00 |
| LlamaParse Cost Effective | $3.75–4.50 |

**General VLMs (per 1K pages):**

| Model | List price (input/output per 1M tokens) | Formula estimate | ParseBench 2 measured |
|---|---|---|---|
| GPT-6 Luna | $0.10 / $0.50 | ~$0.43 | $1.27 (low) |
| Claude Haiku 5.5 | $0.10 / $0.50 (≤100K) | ~$0.43 | $1.55 |
| Gemini 3.8 Flash | $0.75 / $3.75 (through 2026-12-31, then $1.50 / $7.50) | ~$3.2 | $8.48 (low) |
| Gemini 4 Hydrogen | $1.50 / $7.50 | ~$6.4 | Not listed |
| GPT-6.1 Terra | $1 / $5 | ~$4.3 | $11.55 (low) |
| GPT-6.2 Sol | $2 / $10 | ~$8.5 | $22.89 (low) |
| Claude Sonnet 5.5 | $2 / $10 | ~$8.5 | $31.30 |
| Gemini 4 Argon | $2 / $10 (through 2026-11-30, then $4 / $20) | ~$8.5 → $17 | $26.83 (low) |
| Claude Opus 5.5 | $4 / $20 | ~$17 | $64.92 |
| Gemini 4 Neon | $3 / $15 | ~$12.8 | $62.04 (low) |
| GPT-6.2 Astra / Claude Fable 5.2 | $8 / $40 | ~$34 | Not listed |

Measured costs run 3–5× the formula estimate. The gap comes mainly from two places: reasoning models bill thinking tokens as output (Gemini's pricing page says output includes thinking tokens; Claude Opus 5.5's adaptive thinking is always on), and high-resolution page images cost more tokens than 1,750. Budget with measured numbers; treat the formula as a floor. All three vendors' Batch APIs run at 50% of the standard price.

This table overturns a conclusion from the original version of this post. In September 2026, the cheapest general VLM cost ~$3 per 1K pages, more than twice a specialized parser. Now GPT-6 Luna and Claude Haiku 5.5 measure $1.3–1.6 per 1K pages, the same as Cohere Parse, and their ParseBench 2 overall scores (74.59, 71.24) beat Mistral OCR 4.1 (69.26). But those cheap-VLM scores rest on text and tables; charts and visual grounding are clearly weaker. Top-tier VLMs are still expensive: Claude Opus 5.5 takes second place but costs $65 per 1K pages, more than double the top-ranked LlamaParse Agentic Plus ($28).

General VLMs also have three problems specialized parsers don't:

1. **Unstable output.** Run the same page twice and the Markdown formatting may differ. Tables sometimes use `|` delimiters, sometimes HTML `<table>`. Production pipelines can't tolerate this.
2. **Hallucination.** SCORE-Bench (August 2026, model versions at that time) showed Gemini at 0.257 and GPT at 0.167 hallucination rates — one in every four to six pages "plausibly" fabricates content that doesn't exist. ParseBench 2 penalizes changed numbers and flipped negations heavily, so a high score means fewer of those errors, not zero. Hallucination risk is a structural weakness of general VLMs.
3. **No confidence scores.** VLMs don't tell you which fields they're uncertain about. You need to build your own quality checks.

### When to Use VLMs vs Specialized Parsers

| Scenario | General VLM | Specialized Parser |
|---|---|---|
| Chart-heavy (technical manuals, research reports) | △ Only top-tier models; Opus 5.5 scores 74 on charts | ✓ Agentic parsers score 85–93 on charts |
| Low volume + high variety (< 10K pages/month) | ✓ Not worth building a pipeline | ✗ Over-engineering |
| Need "comprehension" not "transcription" | ✓ Ask "where are the risks in this contract?" | ✗ Only converts to text |
| High-volume homogeneous docs (100K invoices) | △ Cheap models run $130–160/month, but no confidence scores | ✓ Prebuilts return fields and confidence scores in one call |
| Need structured JSON | ✗ Format unstable | ✓ Fixed schema |
| Zero hallucination tolerance | ✗ Hallucination varies widely by model | ✓ Leaves blank or flags low confidence |
| Table structure accuracy | ✓ Frontier models score 94–95 on ParseBench 2 tables | ✓ LlamaParse Agentic Plus 94.72, Reducto r-1 90.97 |

### The Practical Approach: Multi-Model Routing

The smartest approach isn't either/or — it's routing: standard pages go to a cheap specialized parser (Reducto r-1 mini, Cohere, Mistral OCR batch), table- and chart-heavy pages escalate to an agentic parser (LlamaParse Agentic, Reducto r-1), and only pages that need comprehension or reasoning go to Claude Opus 5.5 / Gemini 4 Argon-class VLMs. This is exactly the logic of [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents-en) — let an agent choose the route based on page characteristics.

Per Unstructured's analysis, specialized pipelines' advantage isn't a better model but three layers of wrapping: optimized prompting + post-processing + output enforcement. ParseBench 2's chart dimension bears this out: agentic parsers also call VLMs internally and win on the wrapping. If you're willing to build those three layers yourself, using a general VLM as the underlying engine is viable — but at that point you're essentially building your own specialized parser.

## Capability Comparison by Dimension

### Tables

Tables are the litmus test of document parsing. Two sources are useful, but read them separately:

| Solution | ParseBench 2 Tables | RD-TableBench (published by Reducto) |
|---|---|---|
| Gemini 4 Neon | **95.23** | — |
| LlamaParse Agentic Plus | 94.72 | — |
| Claude Opus 5.5 | 94.20 | — |
| Reducto r-1 | 90.97 | **90.2%** |
| Datalab Accurate | 90.38 | — |
| Mistral OCR 4.1 | 81.84 | — |
| Azure DI (layout) | 77.58 | 82.7% |
| AWS Textract | — | 80.9% |
| Google Document AI | — | 64.6% |

The two benchmarks use different datasets and metrics, so the numbers can't be compared directly; the same goes for Cohere's self-reported ParseBench (v1) table score of 87.0. Two conclusions hold: frontier VLMs and agentic parsers now all score above 90, and the Big Three's traditional layout models land in the back half on both tests, with Google lowest of the three.

### Charts

On ParseBench 2's chart dimension, agentic parsers lead (LlamaParse Agentic Plus 92.58, Reducto in agentic mode 89.07), top-tier VLMs come next (GPT-6.2 Sol medium 78.86, Claude Opus 5.5 74.12), and non-agentic specialized parsers and the Big Three's layout models mostly score below 2. Cohere Parse 5 explicitly excludes chart extraction. If your documents contain many charts (technical manuals, research reports), either choose an agentic parser or use a top-tier VLM yourself — see the "Using General-Purpose VLMs as Parsers" section above. Textract Insights and Datalab also offer chart add-ons, billed separately: the former writes a caption for each figure, the latter parses charts into data.

### Handwriting Recognition

All Big Three clouds support handwritten text recognition (Azure DI and Textract list it explicitly; AWS's November 2026 Textract Core update specifically mentions stronger handwriting and dense-table handling). Mistral reports 88.9% handwriting accuracy for OCR 4.1 (versus 78.2% for Azure). Cohere, LlamaParse, and Reducto don't specifically mention handwriting support in their documentation. If your use case includes handwritten forms (healthcare, insurance claims), Mistral OCR and the Big Three are your options.

### Multilingual Support

| Solution | Languages |
|---|---|
| LlamaParse | 80+ |
| Cohere Parse | 9 business languages |
| Mistral OCR 4 | 170 |
| Azure DI | 300+ (Read OCR) |
| Google Document AI | 200+ (OCR) |
| AWS Textract | Core: 40; Insights: 6 (English, Spanish, Italian, Portuguese, French, German) |

Azure and Google offer the broadest OCR language coverage, but that's character-level recognition — structured extraction may not support as many. Cohere trained on only 9 languages; whether Traditional Chinese is included needs confirmation. AWS Textract Core expanded from 6 to 40 languages in November 2026, but the new Insights still supports only six European languages, so it can't handle Chinese documents.

### Form Key-Value Extraction

**This is where the Big Three shine.** Azure DI offers 20+ prebuilt models (invoices, receipts, IDs, contracts, bank statements, checks, tax forms). Google Document AI has similar specialized processors. AWS Textract has the exclusive Analyze Lending (mortgage packet automation) and Analyze Expense. The new Textract Insights uses blueprints instead: describe each field in natural language, or start from AWS public blueprints such as W-2, Form 1040, or passport, and a mixed packet can be split, classified, and extracted in one request.

Cohere doesn't do KV extraction — it converts documents to Markdown, and you feed that to an LLM for field extraction. LlamaParse, Reducto, Mistral (Document AI), and Datalab all offer separately billed Extract APIs, but none has prebuilt document-type models; you define the schema yourself.

### Confidence Scores

| Solution | Confidence Scores |
|---|---|
| Azure DI | ✓ (per field) |
| Google Document AI | ✓ (per field) |
| AWS Textract | ✓ (Core per field; Insights gives each value its source page and coordinates) |
| Mistral OCR 4.1 | ✓ (block- and word-level + bounding box) |
| Reducto | ✓ (citation grounding) |
| LlamaParse | △ (Extract has citations and confidence scores; Parse doesn't) |
| Datalab | △ (word-level bounding boxes with confidence are a paid add-on) |
| Cohere Parse | ✗ |
| General VLMs | ✗ |

Confidence scores are a hard requirement in enterprise settings. Without them, you can't tell which pages need human review — either review everything (cost explosion) or trust everything (quality collapse). Cohere's technical documentation explicitly offers no confidence scores, a significant limitation for high-value documents (contracts, legal filings).

## Cost Model: 100K Pages/Month

List prices are just the starting point. Actual costs can vary 10× or more depending on the scenario. General VLMs below use ParseBench 2 measured per-page costs; specialized parsers and the Big Three use list prices.

### Scenario A: Plain Text OCR (single-column documents, no table structure needed)

| Solution | Monthly Cost |
|---|---|
| Reducto r-1 mini | $100 |
| GPT-6 Luna (VLM) | ~$127 |
| Cohere Parse 5 | $150 |
| LlamaParse Fast | $150 |
| Azure DI Read | $150 |
| Google Enterprise Document OCR | $150 |
| AWS Textract DetectDocumentText | $150 |
| Claude Haiku 5.5 (VLM) | ~$155 |
| Mistral OCR 4.1 batch | $200 |

Nearly identical across providers, and even the cheapest VLMs now land in this band. This scenario shouldn't use a commercial API at all — `pymupdf4llm` at the [extraction layer](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en) handles it for free. If you insist on a mid-tier VLM: GPT-6.2 Sol costs ~$2,300/month and Claude Sonnet 5.5 ~$3,100/month — more than ten times the price for the same result, plus hallucination risk.

### Scenario B: Mixed Documents with Tables

| Solution | Monthly Cost | Type | ParseBench 2 Overall |
|---|---|---|---|
| Reducto r-1 mini | $100 | Specialized parser | 72.55 |
| GPT-6 Luna (VLM) | ~$127 | General VLM | 74.59 |
| Cohere Parse 5 | $150 (tables included in base price) | Specialized parser | Not listed |
| Claude Haiku 5.5 (VLM) | ~$155 | General VLM | 71.24 |
| Mistral OCR 4.1 batch | $200 | Specialized parser | 69.26 |
| LlamaParse Cost Effective | $375–450 | Specialized parser | 85.52 |
| Datalab Balanced | $400 | Specialized parser | 82.35 |
| Azure Content Understanding (Standard extraction) | From $500 | Big Three | — |
| Textract Insights (Extraction) | $850 | Big Three | — |
| Azure DI Layout | $1,000 | Big Three | 66.81 |
| Google Layout Parser | $1,000 | Big Three | — |
| Reducto r-1 Parse | $1,000 | Specialized parser | 86.23 |
| LlamaParse Agentic | $1,250–1,500 | Specialized parser | 86.96 |
| AWS Textract Tables | $1,500 | Big Three | — |
| GPT-6.2 Sol (VLM, low) | ~$2,300 | General VLM | 79.12 |
| Gemini 4 Argon (VLM, low) | ~$2,700 | General VLM | 85.32 |
| LlamaParse Agentic Plus | $3,125–3,750 | Specialized parser | 90.93 |
| Claude Sonnet 5.5 (VLM) | ~$3,100 | General VLM | 75.07 |
| Claude Opus 5.5 (VLM) | ~$6,500 | General VLM | 87.11 |

The gap widens. The $100–200 band has five options, all scoring 69–75 overall; they differ mainly in confidence scores (Mistral has them, VLMs don't) and output format. The value sweet spot is $375–450: LlamaParse Cost Effective scores 85.52, close to Reducto r-1 at $1,000 and Claude Opus 5.5 at $6,500. If you need "tables as usable Markdown," start testing in that band; if you need "specific fields extracted from tables," the Big Three's prebuilts or a vendor's Extract API is the answer.

### Scenario C: Invoice/Receipt Automation (KV extraction needed)

| Solution | Monthly Cost (100K single-page invoices) |
|---|---|
| Mistral Document AI (batch) | $250 |
| Azure DI Invoice Prebuilt | $1,000 ($900 on the 100K-page monthly commitment tier) |
| AWS Textract AnalyzeExpense | $1,000 |
| Reducto Extract | $2,000 |
| AWS Textract Insights (Custom, up to 30 fields) | $4,000 |
| Google Invoice Parser | $10,000 |

The Big Three bill prebuilts in different units, which makes this the easiest table to get wrong. Azure and AWS bill per page; Google's Invoice Parser bills per document, $0.10 for each document of up to 10 pages — 100K single-page invoices cost $10,000, and only if those 100K pages were 10K ten-page documents would it be $1,000. Mistral Document AI is cheapest, but it runs an LLM after OCR to fill your schema; there is no prebuilt invoice model, so you have to validate field quality yourself.

### Hidden Costs

Beyond list prices, at least three other factors:

1. **Retry costs.** Pages that return 500s or timeouts need re-processing. Community reports suggest 0.5–2% failure rates across providers, meaning 500–2,000 pages of retry costs per 100K. Google Document AI explicitly does not bill failed requests (4xx, 5xx); check other vendors' terms.
2. **Human review.** Methods without confidence scores (Cohere, general VLMs) require you to design a quality sampling process. Methods with confidence scores still need human review for below-threshold pages — as yololab's analysis of Cohere Parse v5 put it, "cheap per thousand pages ≠ cheap per approved case," because back-end human review costs can exceed API fees.
3. **Fixed fees and expiring promotions.** Google Document AI's custom processors carry hosting fees ($0.05/hour, about $438 a year) that run even with no requests. Azure's commitment tiers bill overages separately. VLM promotional prices expire: Gemini 4 Argon doubles on December 1, 2026, and Gemini 3.8 Flash doubles on January 1, 2027. These are invisible during POC but erode your cost model in production.

## How to Read Benchmarks (Again)

This series keeps repeating the same point: **who made the benchmark matters as much as the score**.

- **ParseBench** is published by LlamaIndex, and in both versions the top spot goes to their own LlamaParse Agentic Plus. Methodology is open, the dataset and every vendor's outputs are on HuggingFace, and scores are re-computed when the scorers change, but the structural bias remains.
- **RD-TableBench** is published by Reducto; the top spot goes to Reducto r-1 (90.2%). Same structure.
- **olmOCR-bench** primarily evaluates open-source tools, with fewer commercial API data points.

There is still no fully neutral third-party benchmark spanning all commercial APIs. The closest is the academic survey [Document Parsing Unveiled](https://arxiv.org/abs/2410.21169) (arXiv:2410.21169, 2024), but it predates both Cohere Parse 5 and Reducto r-1.

**The practical approach: test on your own corpus.** Pull 50–100 pages from your actual documents, covering the hardest cases, run them through each API, and manually compare outputs. A 50-page eval on your own data tells you more than someone else's 4,000-page benchmark.

## Open Source vs Commercial: Where's the Crossover?

It's not as simple as "build when volume is high, buy when volume is low." The crossover depends on four dimensions:

### 1. GPU Operations Capability

Have an ML Ops team → open source (MinerU / Docling) as a self-hosted microservice, near-zero marginal cost.
Don't → commercial API, outsource reliability.

### 2. Document Diversity

Uniform format (all the same invoice type) → Big Three prebuilt models; one API call returns structured fields.
Highly heterogeneous (contracts, financials, technical manuals mixed) → LlamaParse Agentic, Textract Insights packet splitting, or open-source tools with [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents-en) for custom orchestration.

### 3. Output Requirements

Need Markdown (for RAG) → Reducto r-1 mini / Cohere Parse (cheapest), LlamaParse Cost Effective (best value), LlamaParse Agentic Plus (most accurate).
Need structured JSON (field extraction, bookkeeping) → Big Three prebuilts or a vendor's Extract API.
Need both → Reducto, LlamaParse, and Textract Insights can all output Markdown and JSON together.

### 4. Compliance and Deployment Location

Data can't leave a region → Azure / AWS / Google regional deployments, or enterprise private deployments (VPC or on-prem) of Cohere Model Vault, Mistral OCR, LlamaParse, Reducto, or Datalab.
Need SOC 2 / HIPAA → the Big Three have it built in; a HIPAA BAA requires Reducto Growth, Datalab Team, or LlamaParse Enterprise.

### Decision Tree (extending [Part 1](/posts/ai/2026-08-06-document-parsing-three-layers-en))

```
Does your document need a parsing layer?
   │
   ├─ No (has text layer, simple layout)
   │     └─ [Extraction layer] pymupdf4llm, free
   │
   └─ Yes (scanned / complex layout / table-heavy)
         │
         ├─ Team has GPU + ML Ops?
         │     ├─ Yes → [Open-source parsing] MinerU / Docling
         │     │         near-zero marginal cost at scale
         │     └─ No → commercial API
         │
         └─ Which commercial option?
               │
               ├─ Need "comprehension," not just "transcription"?
               │     └─ Yes → [General VLM] Claude Opus 5.5 / Gemini 4 Argon
               │           (most flexible, but $27–65 per 1K pages)
               │
               ├─ Need structured field extraction? (invoices/receipts/IDs)
               │     └─ Yes → Which cloud?
               │           ├─ Azure → Azure DI Prebuilt
               │           ├─ GCP   → Google Document AI (watch per-document billing)
               │           └─ AWS   → Textract (mortgage → Lending,
               │                       mixed packets → Insights)
               │
               ├─ Need Markdown for RAG?
               │     ├─ Lowest cost        → Reducto r-1 mini / Cohere Parse
               │     ├─ Confidence scores  → Mistral OCR 4.1 batch
               │     ├─ Best value         → LlamaParse Cost Effective
               │     └─ Chart-heavy        → LlamaParse Agentic Plus / Reducto agentic
               │
               ├─ Mixed (95% standard + 5% complex)
               │     └─ Multi-model routing: standard pages → cheap parser,
               │       complex pages → agentic parser or VLM
               │
               └─ Unsure → test 50 pages of your own corpus first
```

## Pre-Production Validation Checklist

Whichever provider you choose, run at least these six checks before going live:

**1. Corpus coverage test.** Pull 50–100 pages from production documents, covering both the best and worst cases. Don't just test clean PDFs — test skewed scans, low-resolution images, and stamped documents.

**2. Table integrity.** Pick the most complex tables (merged cells, cross-page, nested) and verify row/column counts in the output. One missing column means it's wrong.

**3. Confidence score calibration.** If the API provides confidence scores, verify they actually correlate with error rates — is a field at 0.95 confidence really 95% correct? Or is it just model overconfidence? AWS shipped Textract Insights without accuracy figures and itself recommends tuning thresholds on a representative sample.

**4. Latency and throughput.** Average latency isn't enough — measure P99. Peak-hour latency can be 3–5× off-peak. 100K pages/month averages less than 1 page per second, but if your ingestion is a daily batch job, burst throughput requirements are much higher — Reducto r-1 mini on the Standard plan caps concurrent pages at 50.

**5. Failure modes.** Deliberately send bad files (0 bytes, encrypted PDFs, documents exceeding page limits) and see how the API responds. Does it return a 400 so you know, or silently return empty results? The latter is more dangerous because your pipeline won't know something went wrong.

**6. Cost multiplier.** Multiply list prices by 1.3–1.5× to cover retries, rate-limit waits, and human review. With VLMs, measure the real token count on your own documents first instead of budgeting from the formula. If it still fits your budget after the multiplier, you're safe.

## Relationship to Visual RAG

[ColPali](/posts/ai/2026-09-03-colpali-visual-document-retrieval-en) takes a completely different path: skip text parsing entirely and do patch-level embedding directly on PDF page images. Table structure is 100% preserved, but BM25 doesn't work and storage is ~100×.

Commercial APIs and ColPali aren't competitors — they're different stages in the pipeline:

- **Need text-based semantic search** → commercial API or open-source parser to text → embedding → vector search
- **Table-heavy, complex layout, need visual grounding** → ColPali for direct image retrieval
- **Both** → use [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents-en) to dynamically route by page type

## The Bottom Line

Commercial document parsing offers more options than most people realize — not just six APIs, but combinatorial choices across three routes: specialized parsers pursuing cost efficiency, Big Three cloud prebuilts pursuing out-of-the-box field extraction, and general VLMs pursuing comprehension and flexibility.

The biggest change since September 2026 is that the price bands now overlap: the cheapest VLMs cost the same as specialized parsers, and frontier VLMs have caught up with agentic parsers on tables. But charts and confidence scores remain specialized-parser territory, and top-tier VLMs still measure more than double the cost of the top-ranked parser per 1K pages. **More accurate doesn't mean more suitable** — "transcription" and "comprehension" are two different needs, and choosing the wrong route costs an order of magnitude more than choosing the wrong tool.

The core selection question isn't "which is best?" but "do you need transcription or comprehension?" Transcription → specialized parser. Comprehension → VLM. Both → multi-model routing. Only after that decision do volume, team capability, and compliance requirements come into play.

There's still no silver bullet, just as [every post in this series](/posts/ai/2026-08-06-document-parsing-three-layers-en) has concluded. But now you have a more complete decision tree — starting from three routes and arriving at a concrete choice.

## Update Log

- 2026-11-23: Updated every vendor's models and prices to the November 2026 official pricing pages. General VLMs moved to the Claude 5.5 / Fable 5.2, GPT-6.x, and Gemini 4 generations (the older Sonnet 5, Opus 5, GPT-5.5, and Gemini 3.1 Pro rows were removed from the comparison tables); the three 100K-page scenarios were recomputed with ParseBench 2 measured per-page costs, with a note that measured costs run 3–5× the formula estimate. The ParseBench ranking now uses ParseBench 2, which also rewrites two conclusions that no longer hold ("VLMs lead on charts" and "VLMs trail specialized tools on tables"). Added Reducto r-1 mini, AWS Textract Insights, Azure Content Understanding, Google Layout Parser, Datalab, and Baidu's document parsing API. Fixed three earlier errors: Mistral OCR batch is $2, not $1; Azure commitment tiers are monthly, not annual (lowest $0.45 per 1K pages); Google's Invoice Parser bills per document ($100 per 1K single-page invoices). Also updated LlamaParse tier credits, Mathpix, Upstage, LandingAI, and Nanonets pricing, and Textract language counts.

## References

- [ParseBench: A Document Parsing Benchmark for AI Agents (arXiv:2604.08538)](https://arxiv.org/abs/2604.08538)
- [ParseBench (including ParseBench 2) Leaderboard — GitHub](https://github.com/run-llama/ParseBench)
- [LlamaIndex — ParseBench Blog Post](https://www.llamaindex.ai/blog/parsebench)
- [Dr.DocBench: Evaluating LLM/VLM Document Parsing (arXiv:2606.01393)](https://arxiv.org/abs/2606.01393)
- [Unstructured — Frontier Models Are Strong But Document Parsing Is Harder (SCORE-Bench)](https://unstructured.io/blog/frontier-models-are-strong-but-document-parsing-is-harder)
- [OCR Arena — Community Blind-Test ELO Rankings](https://www.ocrarena.ai)
- [Cohere — Introducing Parse](https://cohere.com/blog/parse)
- [Cohere Pricing](https://cohere.com/pricing)
- [LlamaParse Pricing](https://www.llamaindex.ai/pricing)
- [Reducto r-1 Model Launch](https://reducto.ai/blog/parse-r-1-model)
- [Reducto Pricing](https://reducto.ai/pricing)
- [Mistral OCR 4 Launch Post](https://mistral.ai/news/ocr-4/)
- [Mistral OCR 4.1 — Model Page](https://docs.mistral.ai/models/ocr-4-1)
- [Datalab Pricing](https://www.datalab.to/pricing)
- [LandingAI Pricing](https://landing.ai/pricing)
- [Unstructured Pricing](https://unstructured.io/pricing)
- [Upstage Pricing](https://www.upstage.ai/pricing)
- [Mathpix OCR API Pricing](https://mathpix.com/pricing/api)
- [Nanonets Pricing](https://nanonets.com/pricing)
- [Baidu AI Cloud OCR Pricing](https://cloud.baidu.com/doc/OCR/s/tlrzzplc1)
- [Cloudflare Workers AI — Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/)
- [AWS Textract Pricing](https://aws.amazon.com/textract/pricing/)
- [AWS — Amazon Textract Insights is now generally available](https://aws.amazon.com/about-aws/whats-new/2026/11/textract-insights-ga/)
- [AWS ML Blog — Announcing Amazon Textract Insights](https://aws.amazon.com/blogs/machine-learning/announcing-amazon-textract-insights-verifiable-generative-ai-for-documents/)
- [Azure AI Document Intelligence Pricing](https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/)
- [Azure Content Understanding Pricing](https://azure.microsoft.com/en-us/pricing/details/content-understanding/)
- [Azure Retail Prices API](https://prices.azure.com/api/retail/prices)
- [Google Cloud Document AI Pricing](https://cloud.google.com/document-ai/pricing)
- [Claude API Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [Gemini Developer API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Document Parsing Unveiled: Techniques, Challenges, and Prospects (arXiv:2410.21169)](https://arxiv.org/abs/2410.21169)
- AI model families on this site: [Claude](/posts/tech/2026-08-24-ai-model-family-claude-en), [GPT](/posts/tech/2026-08-24-ai-model-family-gpt-en), [Gemini](/posts/tech/2026-08-24-ai-model-family-gemini-en)
- [The Three-Layer Staircase of Document Parsing](/posts/ai/2026-08-06-document-parsing-three-layers-en) (Series Part 1)
- [The Parsing Layer: When Structure Must Be Inferred](/posts/ai/2026-08-06-document-parsing-layout-ocr-en) (Series Part 5)
- [Scanned PDF Benchmark: 10 Parsers Tested](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark-en) (Series Part 6; local tests from August 2026, newer models mentioned here not included)
- [Agentic Parsing: Let Agents Decide How to Parse](/posts/ai/2026-09-03-agentic-parsing-document-agents-en) (Series Part 7)
- [ColPali: Skip OCR, Retrieve Documents as Images](/posts/ai/2026-09-03-colpali-visual-document-retrieval-en)
- [Table Serialization: How to Convert Tables to Text for RAG](/posts/ai/2026-09-03-table-serialization-rag-en)
