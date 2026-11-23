---
title: "Docling: IBM's Open-Source, MIT-Licensed Document Parsing Standard Library Built on Structured JSON"
date: 2026-09-06
category: tech
tags: [document-parsing, pdf, docling, rag, open-source, mit-license]
lang: en
tldr: "Docling started at IBM Research Zurich, is now governed by the Linux Foundation AI & Data, and is MIT-licensed. It parses every input into one structured DoclingDocument, then exports Markdown, HTML, JSON, DocLang, or DocTags. Its input coverage is the widest of the three parsing-layer tools (Office, Apple iWork, audio, video, email, calendars, patent and financial-report XML). In autumn 2026 it added a model-free native PDF pipeline, and its VLM pipeline grew from GraniteDocling to presets including MinerU2.5-Pro, Nemotron Parse, and MiniCPM-OCR."
description: "A guide to Docling: the DoclingDocument representation, input and export formats, the standard, native, and VLM pipelines, why VLM preset licenses must be checked separately, and how it divides the work with MinerU and Marker."
draft: false
series:
  name: "Document Parsing in Practice"
  order: 9
---

> :globe: [中文版](/posts/tech/2026-09-06-docling-document-parsing)

Making complex documents readable for LLMs isn't a single-path problem. This series has covered the conversion layer ([anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en), [MarkItDown](/posts/ai/2026-04-18-markitdown-intro-en)), the extraction layer ([PyMuPDF / pdfplumber / Tika](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en)), the parsing layer's [tool comparison](/posts/ai/2026-08-06-document-parsing-layout-ocr-en) and [scanned-document test](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark-en), and then [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents-en) to explain why fixed pipelines aren't enough. This post focuses on the parsing-layer tool that's easiest to underrate: **Docling**.

[Docling](https://github.com/docling-project/docling) started at **IBM Research Zurich** and was later donated to the **Linux Foundation AI & Data**. It is MIT-licensed; the latest release as of November 2026 is `v2.151.1`. It sits in the same parsing layer as [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) but makes different trade-offs: **Docling's core is not "turn documents into Markdown" but "turn every kind of document into one exchangeable, composable structured representation."** Markdown is just one of its export options.

## What it's trying to solve

Enterprise documents come from everywhere: PDFs, Word files, slides, spreadsheets, email, meeting recordings, Apple iWork files, plus data with established XML schemas such as patents and financial reports. Writing a parser per format leaves downstream code juggling inconsistent outputs.

Docling's answer is to convert every input into one data model, `DoclingDocument` (headings, paragraphs, lists, tables, formulas, pictures, layout blocks, and reading order), so downstream code deals with a single structure. PDF parsing is split into swappable stages: layout detection, OCR, table structure, formulas, picture classification. Each stage can be swapped or turned off.

That draws clear lines against other tools:

- **When you need structured JSON, not just Markdown** (for example, feeding a database or downstream code), Docling is the direct choice.
- **When inputs are mixed**, including audio, video, email, calendars, iWork, and patent or financial XML, Docling covers the most.
- **When the license must be clean**, Docling is MIT, without MinerU's commercial thresholds or attribution duty. Once you turn on the VLM pipeline, though, each model brings its own license (see below).

## Core capabilities

### Input formats

- **Office documents**: DOCX, XLSX, PPTX; legacy DOC, XLS, PPT and RTF (requires LibreOffice); ODT, ODS, ODP; Apple Pages, Numbers, Keynote (requires the `format-iwork` extra); EPUB.
- **Web and markup**: HTML, XHTML, MHTML, Markdown, AsciiDoc, LaTeX, CSV.
- **Images**: PNG, JPEG, TIFF, BMP, WEBP, via OCR.
- **Audio and video**: WAV, MP3, M4A and other audio, plus MP4, AVI, MOV, MKV, WEBM video, whose audio track is transcribed (requires the `audio` or `asr` extra and ffmpeg); the README also lists representative keyframes for video.
- **Communication and others**: EML and MSG email (including meeting invitations), iCalendar, WebVTT, Box Notes, IBM AFP.
- **Schema-specific**: DocLang XML, USPTO patent XML, JATS journal-article XML, XBRL and iXBRL financial reports, and mainframe EBCDIC data.

Note that USPTO, JATS, and XBRL are **input** formats: Docling reads those XML files into a `DoclingDocument`. It does not export an ordinary PDF as patent or financial XML.

### Export formats

A `DoclingDocument` exports to Markdown, HTML, plain text, lossless JSON, DocLang XML and the DocLang archive (`.dclx`, with page images), [DocTags](https://arxiv.org/abs/2503.11576), WebVTT, LaTeX, and JSONL chunks for RAG.

### Three PDF pipelines

| Pipeline | How it works | Trade-off |
|---|---|---|
| Standard (default) | Reads the PDF text layer plus stages for layout (Heron by default), table structure, OCR, and more | Runs on CPU; each stage can be swapped or disabled |
| Native (`--pipeline native`, since v2.126) | Runs no layout, OCR, or table model; uses only the text and images the PDF already carries | Very fast, but no reading order, headings, or table structure |
| VLM (`VlmPipeline`) | Sends whole pages to a vision-language model | Quality depends on the chosen model; usually needs a GPU or Apple Silicon |

The native pipeline sits close to this series' extraction layer: use it to index quickly, then run the full pipeline on the documents that matter.

### VLM presets

`docling --pipeline vlm FILE` uses the default preset, IBM's GraniteDocling (258M, Apache 2.0); `docling --vlm-model <preset> FILE` switches models. Presets added between September and November 2026 include NVIDIA Nemotron Parse 2.0 and 3.5, MinerU2.5-Pro, Unlimited-OCR 2, LightOnOCR-3, Surya-OCR-2.5, and MiniCPM-OCR, alongside existing ones such as SmolDocling, DeepSeek-OCR, Granite Vision, and Nanonets-OCR2. Model details are in the [parsing-layer model post](/posts/ai/2026-08-06-document-parsing-layout-ocr-en) and the [MiniCPM family post](/posts/tech/2026-11-23-ai-model-family-minicpm-en).

This means Docling no longer ties you to one model; you can swap VLMs behind the same `DoclingDocument`. The cost is license review per model: Docling's code is MIT, but each set of weights you choose has its own license. The Surya models, for example, carry revenue thresholds, and some presets need a separate OpenAI-compatible inference server.

### Deployment and integrations

- **Install**: `pip install docling`; requires Python 3.10+ (3.9 support ended in v2.70.0); supports macOS, Linux, and Windows on x86_64 and arm64, with a Dockerfile provided.
- **Services**: `docling-serve` provides an API server, and an [MCP server](https://docling-project.github.io/docling/usage/mcp/) lets agents call it directly.
- **Framework integrations**: the docs list LangChain, LlamaIndex, Crew AI, and Haystack.
- **CLI**: v2.149 reorganized the CLI options; when following an older tutorial, trust `docling --help`.

### Earlier versions

When this post first ran (September 2026), GraniteDocling was the VLM pipeline's main model and PDFs had only the standard pipeline. Over the following two-plus months Docling shipped almost weekly. The main changes: the native PDF pipeline, many VLM presets, the iWork trio, iCalendar, iXBRL, RTF, MHTML, and AFP input, and chart data extraction.

## Comparison with alternatives

This is a positioning comparison, not a performance ranking on one benchmark:

| | Docling | [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) | [Marker](/posts/tech/2026-09-07-marker-document-parsing-en) |
|---|---|---|---|
| License | MIT; VLM presets follow each model's license | Apache 2.0 plus additional terms (100M MAU / USD 20M monthly revenue threshold, attribution for online services, automatic termination) | Code Apache 2.0; model weights restricted by revenue, funding, and competitor terms |
| Core output | `DoclingDocument` structured JSON, exportable to Markdown, HTML, DocLang, DocTags | Markdown, JSON, and other targets (nine in total) | Markdown, JSON, chunks |
| Input breadth | Widest (audio, video, email, calendars, iWork, patent and financial XML) | PDF, images, Office, OpenDocument, EPUB, OFD, HTML; no audio, video, or email | PDF, images, Office, EPUB, HTML |
| Speed trade-off | Standard, native, and VLM pipelines | Four tiers: flash, basic, standard, advanced | Four modes: no_ocr, fast, balanced, vllm |

On OmniParseBench, a benchmark Datalab published and scored itself, Docling's default pipeline scored 74.9, below Marker and PaddleOCR-VL. It's a competitor's self-reported number, but it makes a point: Docling's strength is format breadth and structured representation, not the accuracy of its default pipeline. For accuracy, switch VLM presets and validate on your own documents.

## Use cases

- **Structured data exchange**: parsed results go straight into a database or downstream code and need stable JSON, not Markdown.
- **Mixed-format knowledge bases**: the same corpus contains meeting recordings, email, iWork files, or patent and financial XML.
- **Strict license review**: commercial products, government, or education that must avoid custom-license thresholds and attribution duties; review the license of whichever VLM weights you choose as well.
- **Fine-grained control**: native or standard pipelines for born-digital PDFs, a VLM preset for scans, or only some stages.
- **Agent frameworks**: via the MCP server or the LangChain and LlamaIndex integrations.

## Deployment and practical limits

- **Default-pipeline accuracy**: on complex layouts and formula-heavy documents, the default pipeline often trails dedicated VLMs; compare the standard pipeline against a few VLM presets on representative samples.
- **Extra dependencies**: legacy Office and RTF need LibreOffice, audio and video need ffmpeg plus the ASR extra, and iWork needs the `format-iwork` extra.
- **Fast release cadence**: almost a release a week, and the CLI was reorganized in v2.149. Pin versions in production and read the CHANGELOG before upgrading.
- **The native pipeline is not parsing**: it's fast but produces no reading order or table structure, so it can't replace the full pipeline.

## Overall trade-offs

Docling's value is standardizing document parsing into one exchangeable structured representation, under an MIT license that lets it go into commercial deployments freely. If you only need Markdown for an LLM to read, it may be too heavy. If you need documents in many formats turned into consistent structured data, or license review is a hard requirement, it is the most direct choice in the parsing layer. The VLM presets added in autumn 2026 turn it from "a tool" into "a framework where you can swap models," but they also widen license review from Docling itself to the models you pick.

To try it, `pip install docling`, run the default pipeline with `docling FILE`, then compare the same document with `docling --vlm-model granite_docling FILE` or another preset.

## Update Log

- 2026-11-23: Updated for v2.101–v2.151: the native PDF pipeline, multiple VLM presets (GraniteDocling remains the default), iWork, iCalendar, iXBRL, RTF, MHTML, and AFP input, and LaTeX and chunk export. Corrected the claim that USPTO, JATS, and XBRL are export formats; they are input schemas. Corrected the claim that the VLM pipeline is tied to a single model. Updated the MinerU and Marker comparisons to their new versions. Removed unverified NPU support and star counts.

## References

- [docling-project/docling — GitHub](https://github.com/docling-project/docling): README, [CHANGELOG](https://github.com/docling-project/docling/blob/main/CHANGELOG.md), [LICENSE](https://github.com/docling-project/docling/blob/main/LICENSE) (MIT)
- [Docling documentation](https://docling-project.github.io/docling/): [supported formats](https://docling-project.github.io/docling/usage/supported_formats/), [Vision Models](https://docling-project.github.io/docling/usage/vision_models/), [Model Catalog](https://docling-project.github.io/docling/usage/model_catalog/), [MCP server](https://docling-project.github.io/docling/usage/mcp/)
- [Native PDF pipeline PR #3979](https://github.com/docling-project/docling/pull/3979)
- [Docling — PyPI](https://pypi.org/project/docling/)
- [Docling donation to LF AI & Data (discussion #1184)](https://github.com/docling-project/docling/discussions/1184)
- [Docling Technical Report — arXiv 2408.09869](https://arxiv.org/abs/2408.09869)
- [DocTags — arXiv 2503.11576](https://arxiv.org/abs/2503.11576)
- [granite-docling-258M — Hugging Face](https://huggingface.co/ibm-granite/granite-docling-258M)
- [Marker v2.2.0 release note](https://github.com/datalab-to/marker/releases/tag/v2.2.0): OmniParseBench comparison figures (self-reported by Datalab)
