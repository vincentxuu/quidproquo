---
title: "Groundlane Series Part 6: The Document Toolkit — effort Dial, Field-Aware Chunking, and Confidence Routing"
date: 2026-09-11
category: tech
type: deep-dive
tags: [groundlane, mcp, document-parsing, rag, chunking, effort, ocr, vlm, docling, confidence-routing]
lang: en
tldr: "document_parse gains an effort parameter (fast/standard/deep) unifying anydoc WASM, OCR.space, and Docling VLM into a single dial; document_chunk's fieldAware mode extracts field names from table headers and metadata to solve RAG attribute conflation; document_smart_parse now returns a confidence score so agents decide whether to upgrade."
description: "Part 6 of the Groundlane series covers the effort parameter design for document_parse, field-aware chunking that solves RAG attribute conflation, confidence routing that lets agents self-decide parsing quality, and the Docling-serve VLM adapter wired into effort=deep."
draft: false
series:
  name: "Groundlane 實戰系列"
  order: 6
glossary:
  - term: "effort"
    definition: "document_parse quality-cost dial: fast (deterministic local parsing, zero cost), standard (auto-upgrades to OCR for scanned content), deep (VLM high-accuracy parsing)."
  - term: "field-aware chunking"
    definition: "document_chunk's fieldAware mode: extracts field names from table row 0 and metadata keys, attaches them to each chunk's fields array for downstream metadata pre-filtering."
  - term: "attribute conflation"
    definition: "When a dense embedding model compresses multiple structured fields (name, grade, location) into one vector, making it impossible to distinguish which attribute the user cares about during retrieval."
---

> 🌏 [繁體中文版](/posts/tech/2026-09-11-groundlane-series-6)

The first five parts walked Groundlane's Web tools from concept to operational checklists ([Part 1: Why agents need a controlled web access layer](/posts/tech/2026-08-23-groundlane-series-1-en), [Part 2: Tool parameters and responses](/posts/tech/2026-08-23-groundlane-series-2-en), [Part 3: Comparison with traditional approaches](/posts/tech/2026-08-23-groundlane-series-3-en), [Part 4: In-site application](/posts/tech/2026-08-23-groundlane-series-4-en), [Part 5: Pitfalls and best practices](/posts/tech/2026-08-23-groundlane-series-5-en)). This part enters the Document toolkit — Groundlane has expanded to 55 tools since `v0.1.0`, with over 20 related to document parsing. This article focuses on three design decisions: the `effort` parameter, field-aware chunking, and confidence routing.

## Why an effort dial

Groundlane's document parsing has three paths, each existing as a separate tool:

| Path | Tool | Cost | Accuracy | Best for |
|---|---|---|---|---|
| Deterministic local parsing | `document_parse` (anydoc WASM) | $0 | Medium | Digital-native PDF/DOCX/CSV |
| OCR | `document_ocr` (OCR.space) | Free tier 25k/month | High (scanned) | Scanned PDFs, images |
| VLM layout parsing | Docling-serve (GraniteDocling 258M) | Self-hosted cost | Highest | Complex tables, multi-column, mixed media |

The problem: callers must decide which tool to use. A PDF might have three pages of digital text and a fourth page that's a scanned appendix — you'd need to call `document_smart_parse` first to detect this, then route to the right tool.

Following [MinerU](https://github.com/opendatalab/MinerU)'s design (an `effort: medium | high` parameter that adjusts parsing depth within a single engine), Groundlane unifies the three paths into `document_parse`'s `effort` parameter:

```json
{
  "name": "document_parse",
  "arguments": {
    "source": {
      "kind": "inline",
      "dataBase64": "...",
      "mimeType": "application/pdf",
      "filename": "report.pdf"
    },
    "output": "markdown",
    "effort": "standard"
  }
}
```

- **`fast`** (default): runs anydoc WASM deterministic parsing, zero cost, suitable for known digital-native documents
- **`standard`**: runs `fast` first, then detects whether content is scanned (using pdf.js to analyze text volume on the first 5 pages); if more than half have fewer than 5 characters, auto-upgrades to OCR.space
- **`deep`**: routes to Docling-serve VLM path, using GraniteDocling 258M for layout-aware parsing

The response includes an `effortUsed` field showing which path was actually taken:

```json
{
  "ok": true,
  "data": {
    "effortUsed": "standard",
    "envelope": { "..." },
    "projection": { "..." },
    "mediaType": "application/pdf",
    "bytes": 245760
  }
}
```

The key difference from MinerU: MinerU's `effort` adjusts within a single engine (rule engine intensity), while Groundlane's `effort` routes across engines (anydoc → OCR → VLM). MinerU's `vlm-engine` is a generic interface that connects to different VLMs; Groundlane currently pins to Docling-serve. They're not substitutes — MinerU is a standalone parsing tool, Groundlane is a unified MCP server entry point.

## Field-aware chunking: solving RAG attribute conflation

This feature stems directly from a RAG retrieval problem encountered in a climbing route recommendation system (see the [full analysis](/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation-en)): a user queries "Beauty Mirror 5.11b, recommend routes of similar difficulty" and gets back routes with similar-sounding *names* — grades ranging from 5.8 to 5.12.

The root cause is that dense embeddings (like `bge-m3`) compress multiple independent attributes into a single vector. "Beauty Mirror" as a proper noun has extremely high discriminative power in the embedding space, while "5.11b" as a structured grade marker appears far more frequently — the model naturally focuses attention on the rare token. This is attribute conflation.

One defense is preserving field information at the chunking stage so downstream vector stores can do metadata pre-filtering. Groundlane's `document_chunk` now has a `fieldAware` parameter:

```json
{
  "name": "document_chunk",
  "arguments": {
    "dataBase64": "...",
    "mimeType": "text/csv",
    "filename": "routes.csv",
    "fieldAware": true
  }
}
```

When enabled, each chunk includes a `fields` array:

```json
{
  "chunkId": "chunk-L0-0",
  "text": "Name | Grade | Location | Type\nBeauty Mirror | 5.11b | Dragon Cave | Sport",
  "tokenCount": 18,
  "blockRefs": ["table-1"],
  "fields": ["Name", "Grade", "Location", "Type"]
}
```

Field names come from two sources:

1. **Table headers**: non-empty content from the first row (row 0) of table blocks
2. **Document metadata**: key-value pairs from the canonical document envelope's `metadata` array

When writing to a vector store, you can store `fields` as metadata:

```python
# Writing to Vectorize / Pinecone / Qdrant
for chunk in response["data"]["chunks"]:
    vector_db.upsert(
        id=chunk["chunkId"],
        text=chunk["text"],
        metadata={"fields": chunk["fields"]}  # for pre-filtering
    )

# Querying
results = vector_db.query(
    text="recommend routes around 5.11b difficulty",
    filter={"fields": {"$contains": "Grade"}}  # only search chunks with Grade field
)
```

This isn't a complete solution — the full approach requires query rewriting + score fusion (see the [three-layer defense](/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation-en) in the original article) — but it reduces noise at the chunking stage at zero cost (pure rule-based extraction, no LLM call).

## Confidence routing: letting the agent decide

`document_smart_parse` already detected scanned content (using pdf.js to analyze per-page text volume), but it only told you "this is a scanned PDF" without suggesting what to do next. The new version adds a `confidence` object:

```json
{
  "ok": true,
  "data": {
    "routedTo": "document_parse",
    "routeReason": "Mixed PDF: pages 1, 2 have text, pages 3, 4 appear scanned",
    "confidence": {
      "score": 0.75,
      "suggestedEffort": "standard",
      "reason": "2 of 4 pages appear scanned"
    },
    "content": "...",
    "engine": "groundlane-bounded-document-v3"
  }
}
```

The confidence calculation:

| Scenario | score | suggestedEffort |
|---|---|---|
| All pages have extractable text | 0.95 | fast |
| All scanned, OCR configured and used | 0.7 | standard |
| All scanned, OCR not configured | 0.1 | deep |
| Mixed (some scanned) | `1 - scannedRatio × 0.5` | scannedRatio > 0.3 → standard |
| Large file but almost no extracted text | 0.2 | standard |

This follows the core idea from [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents-en): don't auto-upgrade (that violates bounded cost), give the agent information so it can decide. An agent can use it like this:

1. Call `document_smart_parse` first
2. Check `confidence.score` — if > 0.8, `fast` is sufficient
3. If < 0.5, re-parse with `document_parse` at `effort: "standard"` or `"deep"`

## Docling-serve VLM adapter

Behind `effort: "deep"` is Docling-serve, IBM's open-source document parsing API server (MIT license; per the [Docling deep dive](/posts/tech/2026-09-06-docling-document-parsing-en), its core value is structured JSON output and a replaceable-stage pipeline).

Groundlane's adapter handles three concerns:

1. **Input normalization**: converts Groundlane's base64 inline source into Docling-serve's FormData file upload
2. **Output normalization**: converts Docling's `DoclingDocument` JSON (`main_text` + `tables`) into Groundlane's `DocumentBlock` format (`TextBlock` + `TableBlock`)
3. **Pipeline selection**: supports `standard` (deterministic rule engine) and `vlm` (GraniteDocling 258M) pipelines

Configuration is a `DOCLING_SERVE_URL` environment variable pointing to a self-hosted Docling-serve instance. Without it, `effort: "deep"` still works but won't activate VLM — it marks `effortUsed: "deep"` so callers know they requested high accuracy but the VLM backend isn't available.

## Overall

These three features address the same problem: **document parsing is not one-size-fits-all.**

- `effort` means callers don't need to know "which tool should I use" — just "how much accuracy do I need"
- `fieldAware` preserves structured semantics during chunking instead of flattening all fields into one text blob
- `confidence` lets agents make cost-quality tradeoffs autonomously instead of the system deciding for them

All three are additive (new parameters, no breaking changes), deterministic (no implicit LLM calls), and bounded (no auto-upgrade to costlier paths unless the caller explicitly asks). This aligns with Groundlane's core design principle: deterministic extraction without hidden LLM calls pretending to be stable structured output.

## References

- [Groundlane — GitHub Repo](https://github.com/lanefoundry/groundlane) — source code, README (55 tools), `src/tools/document-parse.ts` (effort implementation), `src/tools/document-chunk.ts` (fieldAware implementation)
- [MinerU — GitHub Repo](https://github.com/opendatalab/MinerU) — `effort: medium | high` design reference
- [Docling — GitHub Repo](https://github.com/docling-project/docling) — VLM adapter backend, MIT license, LF AI & Data governed
- [Docling-serve — GitHub Repo](https://github.com/docling-project/docling-serve) — Docling's REST API server, the actual backend for `effort: "deep"`
- [When Vector Search Matches by Name Instead of Grade: Attribute Conflation in RAG Systems](/posts/tech/deep-dive/2026-03-28-rag-multi-field-retrieval-attribute-conflation-en) — the problem motivating field-aware chunking
- [Agentic Parsing: Letting Agents Decide How to Parse Documents](/posts/ai/2026-09-03-agentic-parsing-document-agents-en) — the design inspiration for confidence routing
- [Docling: IBM's Open-Source, MIT-Licensed, Structured-JSON-Centric Document Parsing Library](/posts/tech/2026-09-06-docling-document-parsing-en) — the full Docling introduction
- [Groundlane Series Part 1: Why AI Agents Need a Controlled Web Access Layer](/posts/tech/2026-08-23-groundlane-series-1-en) — series starting point
- [Groundlane Series Part 2: Actual Calls, Response Structures, and Error Boundaries](/posts/tech/2026-08-23-groundlane-series-2-en)
- [Groundlane Series Part 3: Comparing with Traditional Approaches](/posts/tech/2026-08-23-groundlane-series-3-en)
- [Groundlane Series Part 4: In-Site Application](/posts/tech/2026-08-23-groundlane-series-4-en)
- [Groundlane Series Part 5: Pitfalls and Best Practices](/posts/tech/2026-08-23-groundlane-series-5-en)
