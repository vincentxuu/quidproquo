---
title: "Agentic Parsing: Letting Agents Decide How to Parse Documents"
date: 2026-09-03
category: ai
type: deep-dive
tags: [agentic-parsing, document-parsing, ocr, rag, multi-agent, vision-language-model]
lang: en
tldr: "Traditional document parsing runs a fixed pipeline regardless of input, but contracts, financial reports, and technical manuals each need different strategies. Agentic Parsing lets LLM agents observe a document and dynamically choose tools — AgenticOCR parses only the regions that matter (70%+ visual token savings), and ParseBench shows even the best method scores only 84.9% across 2,000 enterprise pages. No silver bullet."
description: "A survey of Agentic Parsing: from fixed pipelines to agent-driven dispatch, covering AgenticOCR, ParseBench, DocLens, MADP, and other key papers, plus how it complements ColPali Visual RAG."
series:
  name: "Document Parsing in Practice"
  order: 7
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-03-agentic-parsing-document-agents)

Earlier posts in this series covered the [three-layer model](/en/posts/ai/2026-08-06-document-parsing-three-layers-en), [text extraction](/en/posts/ai/2026-08-06-pdf-text-extraction-libraries-en), and [model-based layout analysis](/en/posts/ai/2026-08-06-document-parsing-layout-ocr-en). They all point to the same conclusion: no single fixed pipeline handles every document well. Agentic Parsing hands the "which path to take" decision to an agent.

## The Fixed Pipeline Bottleneck

Traditional document parsing is a serial pipeline: OCR → layout analysis → text extraction → chunking → embedding. Each step uses fixed tools and parameters, regardless of input.

Three problems stand out:

**Document types vary wildly.** Contracts are dense double-column text, financial reports are packed with numerical tables, and technical manuals mix diagrams with nested lists. A single layout model that handles contracts well falls apart on a 25-column spec comparison table. According to [ParseBench](https://arxiv.org/abs/2604.08538) (LlamaIndex, 2026), which evaluated 14 methods across 2,078 enterprise pages, no method leads across all five dimensions (tables, charts, content faithfulness, semantic formatting, visual grounding).

**Full-page parsing is wasteful.** A user asks about "subrogation conditions for Plan B1," but the pipeline OCRs the entire 80-page PDF. As [AgenticOCR](https://arxiv.org/abs/2602.24134) (2026) observes, full-page parsing not only wastes compute but floods the generator's context with irrelevant content, diluting key evidence and increasing hallucination risk.

**Errors cannot self-correct.** Fixed pipelines are one-shot — if the first OCR step misreads a character, every downstream step builds on a broken foundation. No feedback loop.

## The Core Idea Behind Agentic Parsing

Let an LLM agent act as a dispatcher during parsing. The agent observes the document, identifies its type and structure, then dynamically selects tools and strategies.

Three conceptual tiers:

### Selective Parsing: Parse Only What You Need

AgenticOCR ([arXiv:2602.24134](https://arxiv.org/abs/2602.24134), 2026) starts by examining a low-resolution thumbnail, identifying Regions of Interest (RoI), and running high-resolution OCR only on those regions. The agent is trained via GRPO reinforcement learning to learn "where to look."

This transforms OCR from passive preprocessing into active perception — "parsing only what you need." It achieves expert-level performance on MMLongBench-Doc while significantly reducing the visual token budget.

### Multi-Agent Collaboration: Decomposing Complex Documents

Long documents exceed what a single agent can handle. Several representative frameworks:

**DocLens** ([arXiv:2511.11552](https://arxiv.org/abs/2511.11552), Google, 2025) uses two agents in a "Lens Module": a Page Navigator locates relevant pages from the full document, and an Element Localizer pinpoints specific tables or figures within a page. Paired with Gemini-2.5-Pro, it surpasses human experts on MMLongBench-Doc and FinRAGBench-V — especially on vision-centric and "unanswerable" queries.

**MADP** ([arXiv:2605.17159](https://arxiv.org/abs/2605.17159), 2026) distributes classification, parsing, and validation across different agents in a multi-agent pipeline for sustainable document processing.

**Doc-Researcher** ([arXiv:2510.21603](https://arxiv.org/abs/2510.21603), 2025) and **ARIAL** ([arXiv:2511.18192](https://arxiv.org/abs/2511.18192), 2025) approach from multimodal integration and precise grounding respectively: the former unifies outputs from multiple parsing tools, the latter focuses on grounding for document VQA.

### Adaptive Information Extraction: Adjusting Strategy by Document

**AgenticIE** ([arXiv:2509.11773](https://arxiv.org/abs/2509.11773), 2025) tackles information extraction from regulatory documents. These have complex structures — nested clauses, cross-references, appendices — that fixed NER/RE pipelines struggle with. AgenticIE lets the agent decide extraction strategy based on the document's actual structure.

## Benchmarks: How Good Is It?

ParseBench ([arXiv:2604.08538](https://arxiv.org/abs/2604.08538), LlamaIndex, 2026) is the first document parsing benchmark designed for AI agents. It covers 2,078 human-verified pages from enterprise documents across insurance, finance, and government.

Results across 14 methods:

| Method | Overall Score | Notes |
|---|---|---|
| LlamaParse Agentic | **84.9%** | Highest overall, but not best in every dimension |
| Other 13 methods | Varies | No consistently dominant approach |

The five dimensions (tables, charts, content faithfulness, semantic formatting, visual grounding) show a "fragmented capability landscape" — every method has strengths and weaknesses. This validates the agentic approach: instead of searching for one tool that does everything, let the agent pick tools based on document characteristics.

## Production Deployments

Several agentic parsing products are available in 2026:

**LlamaParse** offers four tiers: Fast (1 credit/page), Cost Effective (3 credits/page), Agentic (10 credits/page, ~$0.0125), and Agentic Plus (45 credits/page, ~$0.056). Agentic mode uses multimodal VLMs for layout inference.

**LandingAI ADE** (Agentic Document Extraction) is built on Document Pre-trained Transformers (DPT-2), launched in 2025.

**IDP Accelerator** ([published Feb 2026](https://idp-software.com/guides/agentic-document-processing/)) is an open-source framework with four components: multimodal classifier, multimodal LLM extraction, MCP-compliant analytics, and LLM-driven rule validation. In a healthcare deployment: 98% classification accuracy, 80% reduced processing latency, 77% lower operational costs.

## Complementing Visual RAG (ColPali)

[ColPali](/en/posts/ai/2026-03-12-colbert-late-interaction-en) skips text parsing entirely, rendering PDF pages as images and producing patch-level embeddings via vision-language models. Table structure is 100% preserved.

Agentic Parsing takes a different path: keep the text, but let the agent choose the best parsing method.

The two approaches complement rather than compete:

| Dimension | ColPali / Visual RAG | Agentic Parsing |
|---|---|---|
| Table preservation | 100% (image = original layout) | Depends on parser quality |
| Text searchability | ❌ (BM25 unavailable) | ✅ |
| Storage cost | ~100× | Normal |
| GPU required | Yes | Some methods don't need one |
| Best for | Table-dense, complex layouts | Mixed documents, text semantics |

According to the [Document Parsing Unveiled](https://arxiv.org/abs/2410.21169) (2024) survey, the future trend is convergence: agents first classify page types, then route table-dense pages to visual embeddings and text-heavy pages to traditional parsing.

## Overall

The core tradeoff in Agentic Parsing is spending more inference cost for higher parsing quality — each observe→decide→act cycle costs additional LLM tokens, but avoids the systematic failures that fixed pipelines exhibit on atypical documents.

Current limitations are clear: the best ParseBench score is only 84.9%, with no method strong across all five dimensions. Agentic mode costs 10–45× more than Fast mode. Whether to use it depends on document value and diversity — high-value contracts and financial reports justify agent parsing, while high-volume uniform receipts are fine with a fixed pipeline.

The direction is clear: document parsing is shifting from "one pipeline for everything" to "agents dispatching tools by document." This mirrors the evolution of RAG from [fixed retrieval](/en/posts/ai/2026-03-12-corrective-rag-crag-en) to [Agentic RAG](/en/posts/ai/2026-03-12-agentic-rag-react-loop-en).

## References

- [AgenticOCR: Parsing Only What You Need for Efficient Retrieval-Augmented Generation](https://arxiv.org/abs/2602.24134) (arXiv:2602.24134, 2026)
- [AgenticIE: An Adaptive Agent for Information Extraction from Complex Regulatory Documents](https://arxiv.org/abs/2509.11773) (arXiv:2509.11773, 2025)
- [ParseBench: A Document Parsing Benchmark for AI Agents](https://arxiv.org/abs/2604.08538) (arXiv:2604.08538, LlamaIndex, 2026)
- [Document Parsing Unveiled: Techniques, Challenges, and Prospects](https://arxiv.org/abs/2410.21169) (arXiv:2410.21169, 2024)
- [ARIAL: An Agentic Framework for Document VQA with Precise Grounding](https://arxiv.org/abs/2511.18192) (arXiv:2511.18192, 2025)
- [DocLens: A Tool-Augmented Multi-Agent Framework for Long Visual Document Understanding](https://arxiv.org/abs/2511.11552) (arXiv:2511.11552, Google, 2025)
- [MADP: A Multi-Agent Pipeline for Sustainable Document Processing](https://arxiv.org/abs/2605.17159) (arXiv:2605.17159, 2026)
- [Doc-Researcher: A Unified System for Multimodal Document Understanding](https://arxiv.org/abs/2510.21603) (arXiv:2510.21603, 2025)
- [Hybrid OCR-LLM Framework for Enterprise-Scale Document Processing](https://arxiv.org/abs/2510.10138) (arXiv:2510.10138, 2025)
- [ColPali: Efficient Document Retrieval with Vision Language Models](https://arxiv.org/abs/2407.01449) (arXiv:2407.01449, ICLR 2025)
- [LlamaParse — Document Parsing for LLM and Agent Pipelines](https://developers.llamaindex.ai/llamaparse/parse/guides/tiers/)
- [LandingAI ADE — Agentic Document Extraction](https://landing.ai/llms/best-document-parsing-apis-2026)
- [IDP Accelerator — Agentic Document Processing Guide](https://idp-software.com/guides/agentic-document-processing/)
- [The Three-Layer Model of Document Parsing](/en/posts/ai/2026-08-06-document-parsing-three-layers-en) (internal)
- [Layout Analysis: When Structure Requires Model Inference](/en/posts/ai/2026-08-06-document-parsing-layout-ocr-en) (internal)
- [ColBERT and ColPali](/en/posts/ai/2026-03-12-colbert-late-interaction-en) (internal)
- [CRAG: Automatically Relaxing Conditions on Retrieval Failure](/en/posts/ai/2026-03-12-corrective-rag-crag-en) (internal)
- [Agentic RAG: Letting the LLM Decide Whether to Search Again](/en/posts/ai/2026-03-12-agentic-rag-react-loop-en) (internal)
