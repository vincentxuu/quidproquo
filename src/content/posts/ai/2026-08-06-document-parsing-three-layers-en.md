---
title: "The Three-Layer Ladder of Document Parsing: Pick the Layer Before the Tool"
date: 2026-08-06
category: ai
type: deep-dive
tags: [document-processing, document-parsing, rag, llm, ocr, open-source]
lang: en
tldr: "The most common mistake in feeding documents to an LLM isn't picking the wrong tool — it's picking the wrong layer. Structure already in the file goes to the conversion layer (milliseconds); text without structure goes to extraction; only inferred structure needs parsing. anydoc's 4.7ms against Docling's 513.6ms is a 109× gap, and most people jump straight to the most expensive layer."
description: "A three-layer decision framework for turning documents into LLM-readable content: conversion (MarkItDown, anydoc), extraction (PyMuPDF, pdfplumber), and parsing (MinerU, Docling, OCR-VLMs) — what each solves, what each costs, and a decision tree you can follow."
series:
  name: "文件解析實戰"
  order: 1
draft: false
glossary:
  - term: "OOXML"
    aliases: ["Office Open XML"]
    definition: "The file format standard used by Microsoft Office since 2007 — essentially a zip archive containing XML that describes the document's structure. `.docx`, `.pptx`, and `.xlsx` are all OOXML."
    context: "OOXML structure is written out explicitly in the XML, which is why conversion-layer tools never have to infer anything."
  - term: "Layout analysis"
    aliases: ["layout understanding", "版面分析"]
    definition: "The process of inferring semantic structure from a page's visual arrangement: which blocks are headings, which are body text, how columns split, what the reading order is, where table borders sit."
    context: "This is the fundamental difference between the parsing layer and the two below it — the lower layers read existing structure, the parsing layer infers structure that isn't there."
---

> 🌏 [中文版](/posts/ai/2026-08-06-document-parsing-three-layers)

"Turn documents into something an LLM can read" looks like one problem. It is actually three. I have watched too many teams compare MarkItDown's star count against MinerU's and pick the higher one — which is like asking whether a screwdriver beats a drill.

The first question is not "which tool" but **"does structure exist inside my file at all?"** There are three possible answers, they map to three layers, and the cost between them spans two orders of magnitude.

## What the three layers are

| | State of structure | The actual work | Representative tools | Order of magnitude |
|---|---|---|---|---|
| **Conversion** | Written explicitly in the file | Re-serialization | [anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en), [MarkItDown](/posts/ai/2026-04-18-markitdown-intro-en), pandoc | Single-digit ms |
| **Extraction** | Text exists, structure needs heuristics | Coordinate analysis, rule-based inference | PyMuPDF, pdfplumber, Trafilatura | Tens of milliseconds |
| **Parsing** | No structure, sometimes no text | Model-based inference | MinerU, Docling, OCR-VLMs | Hundreds of ms to seconds |

The ladder is one-directional: **anything solvable at a lower layer will be slower, more expensive, and more error-prone at a higher one**. The reverse simply does not work — point a conversion tool at a scanned document and the output is empty.

## Layer 1: Conversion — structure is already in the file

A `.docx` table *is* a `<w:tbl>`. A `.pptx` title *is* the shape whose placeholder type is title. An EPUB chapter *is* an `<h1>`. These [OOXML](https://learn.microsoft.com/en-us/openspecs/office-standards/ms-oi29500/)-family formats **are structured data already** — just serialized differently.

So the conversion layer's job is translation, not understanding. No model, no GPU, no inference: read the XML, map it to Markdown, write it out. That is why it can hit the 4.7 millisecond median in the [anydoc benchmark](https://github.com/firecrawl/anydoc) (queried 2026-08-06) — where Docling, taking the ML route, comes in at 513.6 milliseconds, a 109× difference. Both are libraries and both were timed with process startup excluded, so the comparison shares a basis.

**When to use it**: sources are Office files, EPUB, CSV, HTML, or similar formatted documents. More than half of a typical enterprise document store falls here — and gets dumped into an OCR pipeline anyway.

**How to choose**: for format depth go with [anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en) (14 formats, including legacy `.doc` / `.ppt` / `.xls`); for modality breadth go with [MarkItDown](/posts/ai/2026-04-18-markitdown-intro-en) (image OCR, audio transcription).

## Layer 2: Extraction — text exists, structure doesn't

PDF is the special case: it is the only format that spans all three layers.

A digital-native PDF has no internal concept of "paragraph" or "table." What it stores is a stream of instructions like "draw character A at coordinate (72, 480) in 11pt Times." The text is directly readable, but **the structure does not exist** — paragraph boundaries, reading order, table borders all have to be reconstructed from coordinate relationships.

That reconstruction is what the extraction layer does, using heuristics: character spacing, line spacing, font size changes, ruling line positions. [PyMuPDF](https://pymupdf.readthedocs.io/) (and `pymupdf4llm`, built for LLM use cases) and [pdfplumber](https://github.com/jsvine/pdfplumber) live here. On the web side, [Trafilatura](https://github.com/adbar/trafilatura) and Readability are the equivalents — HTML has tags but is full of noise, so rules pick body text out of navigation and ads.

**When to use it**: the PDF has selectable text (`pdftotext` produces output) and the layout is simple — single column, standard tables, no cells merged across pages.

This layer is badly underrated. Plenty of teams skip it and go straight to a VLM, but digital-native PDFs dominate most real corpora, and a single call to `pymupdf4llm` produces perfectly usable Markdown at zero marginal cost.

**When it breaks down**: multi-column layouts (rules interleave two columns into one garbled line), tables spanning pages, mathematical formulas, complex merged cells. Those go up a layer.

## Layer 3: Parsing — structure has to be inferred

At this layer, either there is no text at all (scans, photographed contracts, image-only PDFs), or there is text in a layout too complex for rules to recover (two-column academic papers with formulas, financial statements with nested tables).

What they share: **the structure is not in the file and must be inferred from visual signals by a model**. This is the domain of [layout analysis](https://github.com/opendatalab/MinerU) — detect blocks, classify block types, determine reading order, then recognize the content of each block.

Two approaches split this layer:

- **Pipeline-based**: [MinerU](https://github.com/opendatalab/MinerU), [Marker](https://github.com/datalab-to/marker), and [Docling](https://github.com/docling-project/docling) chain layout detection, OCR, and table recognition into multi-stage pipelines where each stage is swappable and debuggable. Docling in particular emphasizes structured JSON output rather than just Markdown.
- **End-to-end VLM**: hand a whole page to a vision-language model and get Markdown back. The [DeepSeek-OCR post](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression-en) dissects the extreme version of this route — one that inverts the idea entirely, rendering *text into images* for context compression.

Commercial APIs (LlamaParse, Azure Document Intelligence, Google Document AI, AWS Textract, Reducto) also sit here, trading money for accuracy and zero maintenance. Paying does not automatically win: on the [ParseBench](https://github.com/run-llama/ParseBench) leaderboard (arXiv [2604.08538](https://arxiv.org/abs/2604.08538); ~2,000 human-verified enterprise document pages across five capability dimensions), LlamaParse Agentic leads with an overall 84.88 against Azure Document Intelligence's 73.8 — **both paid, with the gap coming from multi-step strategy rather than budget**.

That benchmark deserves the same scrutiny as anydoc's, though: **ParseBench is built by LlamaIndex (run-llama), and the leader, LlamaParse, is their own product**. The methodology is public and both dataset and evaluation code are published on HuggingFace and GitHub, which is better than most self-evaluations — but the structural bias of "the author's own product wins" is still there. Its per-dimension scores (tables, charts, content faithfulness, semantic formatting, visual grounding) are more useful than the overall ranking.

**The cost**: GPUs (or per-page billing), latency measured in seconds instead of milliseconds, non-deterministic output (the same file twice may not produce the same result), and hard debugging.

## The decision tree

```
file arrives
   │
   ├─ Format carries structure? (.docx / .pptx / .xlsx / .epub / .odt / .csv)
   │     └─ yes ─────────────────► [CONVERSION] anydoc / MarkItDown
   │
   ├─ Is it a PDF?
   │     ├─ Selectable text? (pdftotext produces output)
   │     │     ├─ simple layout (single column, standard tables)
   │     │     │     └─────────────► [EXTRACTION] pymupdf4llm / pdfplumber
   │     │     └─ complex layout (multi-column, cross-page tables, formulas)
   │     │           └─────────────► [PARSING] MinerU / Marker / Docling
   │     └─ no selectable text (scan, image-only)
   │           └───────────────────► [PARSING] OCR-VLM / commercial API
   │
   └─ Web HTML?
         └─────────────────────────► [EXTRACTION] Trafilatura / Readability
```

In practice this tree should be a fallback chain rather than a one-shot decision: run the conversion layer first, and escalate on an unsupported error or empty output. anydoc returns unsupported for scanned PDFs rather than emitting half-broken output, precisely so you can wire it up that way.

## Three common misfires

**Sending digital-native PDFs to a VLM.** The most expensive mistake. Run `pdftotext` once; if it produces output, a text layer exists, and the extraction layer will cover roughly eight cases in ten.

**Running scans through the conversion layer and assuming it's broken.** Empty output is not a bug — there genuinely is no text in that PDF. What you need is OCR, not a different converter.

**Chasing 100% accuracy at the parsing layer.** Output here is inherently non-deterministic. Rather than spending three months tuning parameters, accept 90% and add validation downstream — which is exactly the argument of the [agentic parsing](/posts/ai/2026-05-24-agentic-attachment-rag-survey-en) research line: wrapping the parser as a tool the agent can re-run with a different strategy beats trying to get it right once at ingestion time.

## Overall

Picking the layer matters an order of magnitude more than picking the tool. Get the layer right and the differences within it are mostly format coverage and API ergonomics. Get it wrong and the best tool in the world is solving the wrong problem.

This series works down the ladder. The conversion layer is [MarkItDown](/posts/ai/2026-04-18-markitdown-intro-en) and [anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en); the extraction layer is [PyMuPDF / pdfplumber / Tika and friends](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en) (watch PyMuPDF's AGPL license); the parsing layer is [MinerU / Marker / Docling and the OCR-VLMs](/posts/ai/2026-08-06-document-parsing-layout-ocr-en), where the real selection axis turns out to be licensing rather than accuracy.

## References

- [firecrawl/anydoc — GitHub](https://github.com/firecrawl/anydoc)
- [microsoft/markitdown — GitHub](https://github.com/microsoft/markitdown)
- [PyMuPDF documentation](https://pymupdf.readthedocs.io/)
- [jsvine/pdfplumber — GitHub](https://github.com/jsvine/pdfplumber)
- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU)
- [datalab-to/marker — GitHub](https://github.com/datalab-to/marker)
- [docling-project/docling — GitHub](https://github.com/docling-project/docling)
- [adbar/trafilatura — GitHub](https://github.com/adbar/trafilatura)
- [The Deterministic Extraction Layer](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en)
- [The Parsing Layer: When Structure Must Be Inferred](/posts/ai/2026-08-06-document-parsing-layout-ocr-en)
- [Office Open XML (OOXML) standards — Microsoft Learn](https://learn.microsoft.com/en-us/openspecs/office-standards/ms-oi29500/)
- [ParseBench: A Document Parsing Benchmark for AI Agents (arXiv 2604.08538)](https://arxiv.org/abs/2604.08538)
- [run-llama/ParseBench — GitHub leaderboard](https://github.com/run-llama/ParseBench)
- [anydoc: 14 Office Formats to Markdown](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en)
- [MarkItDown: Convert Any File to Markdown Before Feeding It to an LLM](/posts/ai/2026-04-18-markitdown-intro-en)
- [Auto-embedding on upload is a bad default](/posts/ai/2026-05-24-agentic-attachment-rag-survey-en)
- [DeepSeek-OCR: Compressing Long Context Into Images](/posts/ai/2026-05-09-deepseek-ocr-contexts-optical-compression-en)
