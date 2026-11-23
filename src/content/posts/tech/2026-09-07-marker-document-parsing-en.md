---
title: "Marker: Datalab's Open-Source, Speed-First Parsing Pipeline That Runs on CPU"
date: 2026-09-07
category: tech
tags: [document-parsing, pdf, marker, rag, open-source, apache-license]
lang: en
tldr: "Marker is Datalab's open-source PDF-to-Markdown/JSON pipeline. The code is Apache 2.0; the model weights use a modified OpenRAIL-M with paid-license thresholds of USD 5M for Surya 2.5 and USD 20M for Indra OCR, and no free use for Datalab's competitors. v2.2 (November 2026) has four modes, no_ocr, fast, balanced, and vllm: on CPU it uses a built-in ONNX engine with no VLM server; on GPU it routes tables, math, CJK, and scanned pages to Surya 2.5."
description: "A guide to Marker 2.x: choosing among the four conversion modes, the optional LLM boost, how to read Datalab's self-reported benchmarks, the split between code and model-weight licenses, and how it divides the work with MinerU and Docling."
draft: false
series:
  name: "Document Parsing in Practice"
  order: 10
---

> :globe: [中文版](/posts/tech/2026-09-07-marker-document-parsing)

This series has covered the conversion layer ([anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown-en), [MarkItDown](/posts/ai/2026-04-18-markitdown-intro-en)), the extraction layer ([PyMuPDF / pdfplumber / Tika](/posts/ai/2026-08-06-pdf-text-extraction-libraries-en)), the [three-layer framework](/posts/ai/2026-08-06-document-parsing-three-layers-en), a [scanned-document test](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark-en), and the parsing-layer tools [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) and [Docling](/posts/tech/2026-09-06-docling-document-parsing-en). This post covers the third tool usually compared in that layer: **Marker**.

[Marker](https://github.com/datalab-to/marker), built by Datalab, converts PDF, images, PPTX, DOCX, XLSX, HTML, and EPUB into Markdown, JSON, HTML, or RAG chunks. It handles tables, forms, equations, inline math, links, and code blocks, and removes headers and footers. Its trade-off against the other two is clear: **Marker puts speed and CPU usability first**, Docling puts structured JSON and a pure MIT license first, and MinerU puts structure preservation and a local document library first. This post reflects v2.2 from November 2026.

## What it's trying to solve

The official one-liner is "convert PDF to markdown and JSON quickly and accurately." Marker 2 was a speed-focused rewrite: it reads the PDF's existing text layer with `pdftext` and calls a VLM only where needed (garbled or scanned pages, equations, low-confidence tables) instead of VLM-OCRing every page.

That design matches a common reality: most enterprise PDFs are born-digital, the text layer is fine, and only a minority of pages actually need a model. Keeping the model for those pages is what makes CPU throughput usable.

## Core capabilities

### Input and output

- **Input**: `pip install marker-pdf` handles PDFs; `marker-pdf[full]` adds DOCX, PPTX, XLSX, EPUB, and HTML.
- **Output**: Markdown, JSON, HTML, chunks; images can be extracted and saved.
- **Customization**: you can swap processors and renderers, or use `TableConverter` to extract only tables. 2.0 removed the old structured-extraction converter; Datalab points users to `--use_llm` or its paid API instead.

### Four conversion modes

v2.2 expands the modes to four. Without `--mode`, Marker picks by hardware: `balanced` on CUDA GPUs, `fast` on CPU and Apple Silicon.

| Mode | How it works | Use for |
|---|---|---|
| `no_ocr` | Text layer only, plus the built-in Indra ONNX engine for layout and reading order; no OCR at all | Born-digital PDFs, maximum CPU throughput |
| `fast` | Indra ONNX for layout, reading order, and line/page OCR; no external VLM server | Default on CPU and Apple Silicon |
| `balanced` | Clean Latin-script pages go through `pdftext` plus ONNX; tables, math, CJK and other non-Latin scripts, and scanned pages go to the Surya 2.5 VLM | Default on GPU |
| `vllm` | Full-page Surya 2.5 VLM OCR on every page | Degraded scans, dense math, mixed scripts |

A note for Chinese, Japanese, or Korean documents: `balanced` sends CJK pages to the VLM, so CJK-heavy documents behave closer to `vllm` in speed and resource needs, while `fast` on CPU does not use the VLM.

### Optional LLM boost

`--use_llm` has an LLM merge tables across pages, handle inline math, and clean up form fields. The default service is Gemini (`gemini-3.5-flash`), and you can switch to Claude, any OpenAI-compatible endpoint, Azure OpenAI, Vertex, OpenRouter, or local Ollama. This is where Marker differs most from Docling and MinerU: you choose the boosting model instead of it being built into the tool. The cost is that, once enabled, document content goes to the LLM service you picked.

### Deployment and services

- **Environment**: Python 3.10+ and PyTorch; runs on GPU, CPU, or MPS.
- **CLI**: `marker_single` for one file, `marker` for folders (v2.2 adds `--recursive` and resumable `--skip_existing`); `--stdout` writes straight to standard output for agents and shell pipelines; `--install_skill` installs a skill file for coding agents.
- **Service and UI**: `marker_server` provides a FastAPI REST service, and `marker_gui` is the new v2.2 browser viewer with overlays for layout blocks, reading order, and per-stage timing, replacing the old Streamlit app.

### Earlier versions

v2.0 (July 2026) started the rewrite with three paths, `balanced`, `fast`, and `--disable_ocr`, using Surya OCR 2 as the VLM. v2.1 (October 2026) switched the default VLM to Surya 2.5 (set `SURYA_MODEL_CHECKPOINT=datalab-to/surya-ocr-2` to stay on Surya 2). v2.2 added the Indra ONNX engine and the `vllm` mode, so the CPU path no longer needs a separate inference server.

## How to read the benchmarks

Nearly all of Marker's numbers come from Datalab's own runs:

- **v2.0 announcement**: on Ai2's [olmOCR-bench](https://github.com/allenai/olmocr), `balanced` scored 76.0% overall at over 5× the throughput of MinerU 3.x's `pipeline` backend (2.9 vs 0.54 pages/sec on one B200). The benchmark is third-party, but the scores are Datalab's own runs, as [MarkTechPost's breakdown](https://www.marktechpost.com/2026/07/24/datalab-marker-v2-vs-mineru-docling-and-liteparse-benchmark-breakdown/) also states. The comparison is against MinerU's old `pipeline` backend, not MinerU 4's `standard` tier.
- **v2.2 announcement**: on Datalab's own [OmniParseBench](https://huggingface.co/datasets/datalab-to/omni_parse_bench) (838 pages), `balanced` scored 88.9 and `fast` 83.2, with Docling at 74.9 and PaddleOCR-VL 1.5 at 84.4 in the same table. Both the dataset and the scorer come from Datalab, so this is an in-house benchmark.

The upside is that the repo's `benchmarks/` harness reproduces these numbers, competitor runners included; the limit is that Datalab chose the document mix and the hardware. The most reliable move is to run that harness on your own documents. This series' [scanned-document test](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark-en) ran in August 2026 on the versions available then; Marker 2.2's new modes are not in those results.

## Licensing and commercial use

Marker's license has two layers, and you need to read them separately:

- **Code**: Apache 2.0, free for commercial use.
- **Model weights**: a modified AI Pubs OpenRAIL-M, with thresholds set separately in each model's LICENSE. Surya 2.5, used by `balanced` and `vllm` (same terms as the repo's `MODEL_LICENSE`): outside personal and research use, organizations with more than USD 5M in revenue in the prior year, or more than USD 5M raised in equity or debt, need a license from Datalab. The Indra OCR weights used by `no_ocr` and `fast` set the threshold at USD 20M. Both add one more term: you may not use them if you offer a product or service that competes with Datalab's.

The last clause is easy to miss: if you are building a document-parsing SaaS, even a small startup may fall under it. All four modes use model weights (`no_ocr` still uses Indra for layout), so "the code is Apache 2.0" does not mean the whole stack is free for commercial use. Teams running only `fast` on CPU get the wider threshold; any GPU path puts you at USD 5M.

## How it divides the work with MinerU and Docling

| | Marker | [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) | [Docling](/posts/tech/2026-09-06-docling-document-parsing-en) |
|---|---|---|---|
| License | Code Apache 2.0; weights restricted by revenue, funding, and competitor terms | Apache 2.0 plus additional terms (100M MAU / USD 20M monthly revenue threshold, attribution for online services) | MIT; each VLM preset follows its own model license |
| Main output | Markdown, JSON, chunks | Markdown, JSON, and other targets (nine in total) | Structured JSON (`DoclingDocument`), with DocLang and DocTags export |
| Speed vs. resources | Four modes; a CPU path with no VLM | Four tiers; `basic` runs on CPU | Default pipeline runs on CPU; many VLM presets |
| Distinctive feature | LLM boost with a service of your choice | Local document library for agents | Widest input coverage (audio, email, patent and financial-report XML) |

These are not replacements for each other but three different trade-off paths in the parsing layer. If you need speed, batch conversion on machines without a GPU, and can accept the weight license terms, Marker is the most direct choice. If you need the cleanest license, look at Docling. If you want agents reading long documents page by page on local machines, look at MinerU.

## Update Log

- 2026-11-23: Updated for v2.1 and v2.2: four conversion modes, Indra ONNX, Surya 2.5, `marker_gui`, and agent-oriented CLI flags. Benchmarks are now labeled as Datalab-reported, with OmniParseBench added. Added the competitor clause of the model-weight licenses and the separate Surya and Indra thresholds. Fixed the MarkTechPost link. Removed claims about an MCP server and framework integrations that had no source.

## References

- [datalab-to/marker — GitHub](https://github.com/datalab-to/marker): README, `MODEL_LICENSE`, `benchmarks/`
- [Marker v2.2.0 release note](https://github.com/datalab-to/marker/releases/tag/v2.2.0): four modes, Indra ONNX, OmniParseBench
- [Marker v2.1.0 release note](https://github.com/datalab-to/marker/releases/tag/v2.1.0): Surya 2.5
- [Marker v2.0.0 release note](https://github.com/datalab-to/marker/releases/tag/v2.0.0) and [Datalab blog: Marker 2](https://www.datalab.to/blog/marker-2)
- [marker-pdf — PyPI](https://pypi.org/project/marker-pdf/)
- [Datalab Marker v2 vs MinerU, Docling, and Liteparse — MarkTechPost, 2026-07-24](https://www.marktechpost.com/2026/07/24/datalab-marker-v2-vs-mineru-docling-and-liteparse-benchmark-breakdown/)
- [olmOCR-bench — allenai/olmocr](https://github.com/allenai/olmocr)
- [OmniParseBench — Hugging Face](https://huggingface.co/datasets/datalab-to/omni_parse_bench)
- [surya-ocr-2.5 — Hugging Face](https://huggingface.co/datalab-to/surya-ocr-2.5)
