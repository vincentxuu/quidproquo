---
title: "MinerU: An Open-Source Engine from PDF to Structured Markdown"
date: 2026-09-05
category: tech
tags: [ocr, pdf, mineru, document-parsing, rag, open-source]
lang: en
tldr: "MinerU is OpenDataLab's open-source document parsing engine. Version 4.0 (September 2026) replaced the 3.x pipeline/vlm/hybrid backends with four quality tiers (flash, basic, standard, advanced), widened input to Office, OpenDocument, EPUB, OFD, and HTML, and added a local document library that agents can read page by page. The license is still the MinerU Open Source License, which carries commercial thresholds."
description: "A guide to MinerU 4.x: four parsing tiers, native multi-format parsing, the local document library for agents, hardware requirements, license thresholds, and where it fits in RAG preprocessing."
draft: false
series:
  name: "Document Parsing in Practice"
  order: 8
---

> :globe: [中文版](/posts/tech/2026-09-05-mineru-ocr-doc-parsing)

When you feed academic papers, internal PDF reports, or scanned contracts into a RAG pipeline, the first thing that breaks is usually not embedding but document parsing: text gets cut, tables turn into shuffled paragraphs, formulas become garbage, and scanned images can't be read at all.

[MinerU](https://github.com/opendatalab/MinerU) is OpenDataLab's open-source document parsing engine. It turns PDFs, images, and Office files into Markdown and structured data that keep tables, formulas, and reading order. It is not plain OCR; it is a full pipeline from layout detection to document structure. Version 4.0 in September 2026 was a major rewrite. This post describes the current 4.2 line and covers the 3.x approach briefly under "Earlier versions."

## What it's trying to solve

MinerU came out of pretraining data preparation for [InternLM](https://internlm.org/): the team needed to turn large volumes of scientific literature into clean corpora, and existing tools were unreliable on formulas, tables, and mixed text and images. Its design goal has always been preserving structure, not just extracting text: tables become HTML, formulas become LaTeX, paragraphs keep their reading order.

Since 4.0 it goes one step further. It is no longer only a converter but a local document library where an agent can read page by page, search, and cite a specific block on a specific page.

## Core capabilities

### Input and output

- **Input**: PDF, images, DOC/DOCX, PPT/PPTX, XLS/XLSX, RTF, ODT/ODS/ODP, EPUB, OFD, HTML/MHTML, CSV/TSV. Plain-text files (`.txt`, `.md`) are read directly, not parsed.
- **Limit**: only PDFs and images can use all four tiers. Office, OpenDocument, EPUB, OFD, and HTML are always parsed locally at the `flash` tier (handled by the MIT-licensed [DocVortex](https://github.com/myhloli/docvortex), with no PDF conversion and no model download).
- **Output**: one document model renders to nine targets: Markdown, HTML, LaTeX, DOCX, EPUB, PDF, Structured Content, and Content List V1/V2. Each CLI and API entry point exposes only a subset.

### Four parsing tiers

| Tier | What it does | Use for |
|---|---|---|
| `flash` | No inference models; reads the PDF text layer and digital documents directly | Preview and indexing; not a final reading quality |
| `basic` | Small models for OCR, formulas, and tables; runs on CPU | Privacy-sensitive or low-resource local parsing |
| `standard` | Small models plus a VLM for complex layouts (default) | Normal reading and complex documents |
| `advanced` | Same models as standard, more inference compute | Difficult documents when you can wait |

Small models (layout, OCR, formulas, tables) run on ONNX or Torch; the VLM engine can be llama.cpp, vLLM, LMDeploy, or mlx, configured separately. The VLM behind `standard` is MinerU2.5-Pro (1.2B); model-level details are in the [parsing-layer model post](/posts/ai/2026-08-06-document-parsing-layout-ocr).

### Local document library and agent reading

- A command family (`mineru parse`, `read`, `search`, `find`, `watch`, `scan`) caches parse results locally.
- `mineru parse` reads only the first 10 PDF pages by default and returns a continuation command, so long documents are read progressively instead of loaded into context at once.
- Locators such as `doc:{id}/tier:{tier}/page:{page}/block:{block}` let you go back to a page, export a block as an image, and cite it verifiably.

### Deployment and services

- **Local first**: parsing is local by default; documents are uploaded to the official service only when you pass `--remote` explicitly.
- **Hardware**: the base package runs ONNX small models on CPU plus a llama.cpp VLM. Since 4.1 it picks an Intel, AMD, NVIDIA, or Apple Silicon GPU automatically; the project reports representative inference at about 2–3× CPU speed.
- **Services**: the Python SDK, `mineru-kit parse` batch conversion, a multi-service Router, and a Gradio WebUI share one structured result model. The HTTP service is the V1 API (centered on `/v1/tasks` since 4.1).
- **4.2 additions**: the WebUI links source regions and parsed results in both directions, Tagged PDF structure improves reading order, the local library's HTTP interface now requires a Bearer token, and URL inputs gained SSRF protection.

### Earlier versions (3.x)

3.x switched between three backends, `pipeline`, `vlm`, and `hybrid`, with the CLI `mineru -p input.pdf -o output`. 4.0 replaced backend choice with tiers, moved the entry points to `mineru parse` or `mineru-kit parse`, moved configuration from `mineru.json` to `$MINERU_HOME/config.yaml`, and removed the old `/file_parse` and `/tasks` HTTP endpoints. Before following an older tutorial, read the official [3.x → 4.0 migration guide](https://opendatalab.github.io/MinerU/reference/migration_4/).

## Comparison with alternatives

This is a positioning comparison, not a performance ranking on one benchmark:

| Tool | Core role | Structured output | License | Fits |
|---|---|---|---|---|
| **MinerU** | PDF/images → structured Markdown and JSON; Office formats via native parsing | High (HTML tables, LaTeX formulas, nine render targets) | MinerU Open Source License (Apache 2.0 plus commercial thresholds) | RAG preprocessing, training corpora, agents reading long documents |
| **[Docling](/posts/tech/2026-09-06-docling-document-parsing-en)** | Structured JSON (`DoclingDocument`) at the core | High (DocLang and DocTags export; reads USPTO, JATS, XBRL XML) | MIT | Structured data exchange, permissive licensing |
| **[Marker](/posts/tech/2026-09-07-marker-document-parsing-en)** | Speed-first Markdown/JSON pipeline | Medium-high | Code Apache 2.0; model weights carry thresholds | CPU batch jobs, fast conversion |
| **PaddleOCR / Tesseract** | Text recognition | Low (you rebuild structure) | Apache 2.0 | Scans where only text matters |

MinerU is not trying to be the strongest OCR. It turns documents into machine-readable structure. If you only need text from one scanned invoice, a lightweight OCR engine is enough; if you need whole papers or manuals turned into data an LLM can retrieve over, keeping tables, formulas, and reading order is what pays for the extra cost.

## Use cases

### RAG preprocessing and knowledge bases

Convert PDF reports and product manuals into structured Markdown and JSON before they reach the vector store. Validate parse quality on representative samples first, then decide on chunking and indexing.

### LLM training data cleaning

Results carry a versioned schema, so data engineers can filter traceably between raw parses and final corpora instead of flattening PDFs into plain text.

### Agents reading long documents

The 4.0 library and locators let an agent read page by page, search, and cite specific blocks, which suits contracts and specifications that need clause-by-clause checking.

### Digitizing scanned documents

For sensitive contracts or historical archives, the `basic` tier can run OCR locally on a machine without a GPU, so originals never go to a third party.

## Deployment and practical limits

- **Python**: 4.1 and later require Python 3.11–3.14.
- **Hardware**: `basic` (ONNX) needs about 0.8 GB of models and 2 GB of RAM; `standard`/`advanced` need about 2–3 GB of models and 8–16 GB of RAM. They run on CPU, but the project recommends Vulkan or a GPU with 8 GB+ VRAM. Older AMD and vendor-accelerator adaptations remain only on `mineru<4`.
- **Format support is not quality**: Office, EPUB, and similar formats only get `flash` native parsing; text inside embedded images is not OCR'd.
- **Telemetry**: anonymous usage telemetry in the local library is on by default (it excludes document content and file names). Check and disable it with `mineru telemetry status` if that matters for your deployment.
- **Frequent breaking changes**: both 4.0 and 4.1 changed the HTTP API; servers, Routers, SDKs, and clients have to be upgraded together. Pin versions for long-running use.
- **Verify accuracy yourself**: official benchmarks reflect specific test sets. Non-English, non-standard layouts and heavy text-image mixes still need spot checks.

## Overall trade-offs

MinerU's value is moving document parsing from "extract text" to "keep structure," and since 4.0, adding a layer that lets agents read progressively and cite. For quick text extraction it is too heavy. For turning complex documents into searchable, traceable structured data that must stay on your own machines, it is a complete open-source option.

Check the license before you choose it. The [MinerU Open Source License](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md) builds on Apache 2.0, but if you and your affiliates together exceed 100 million MAU or USD 20 million in monthly revenue, you need a separate commercial license; if you offer an online service built on MinerU, you must say so in the interface or public documentation; breaching either term terminates the license automatically. Most teams never hit the thresholds, but the attribution duty applies to everyone.

## Update Log

- 2026-11-23: Rewritten for MinerU 4.0–4.2: four parsing tiers replacing pipeline/vlm/hybrid, wider input formats, nine output targets, the local document library for agents, Python 3.11–3.14, telemetry on by default. 3.x moved to "Earlier versions." Dropped the "109 languages" claim, which 4.x documentation no longer makes. This English version replaces an earlier draft that had been published untranslated.

## References

- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU): README and release notes
- [MinerU 4.0.0 release note](https://github.com/opendatalab/MinerU/releases/tag/mineru-4.0.0-released): tiers, formats, library, migration
- [MinerU 4.1.0 release note](https://github.com/opendatalab/MinerU/releases/tag/mineru-4.1.0-released): automatic GPU acceleration, Tasks API, Python 3.11–3.14
- [MinerU 4.2.0 release note](https://github.com/opendatalab/MinerU/releases/tag/mineru-4.2.0-released): WebUI traceability, Tagged PDF, Bearer token
- [MinerU documentation](https://opendatalab.github.io/MinerU/): [tiers and runtimes](https://opendatalab.github.io/MinerU/usage/tiers/), [output formats](https://opendatalab.github.io/MinerU/reference/output_files/), [3.x → 4.0 migration](https://opendatalab.github.io/MinerU/reference/migration_4/)
- [MinerU Open Source License (LICENSE.md)](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md)
- [MinerU2.5-Pro-2605-1.2B — Hugging Face](https://huggingface.co/opendatalab/MinerU2.5-Pro-2605-1.2B): the VLM used by the standard tier
- [DocVortex — GitHub](https://github.com/myhloli/docvortex): native parser for Office and similar formats (MIT)
