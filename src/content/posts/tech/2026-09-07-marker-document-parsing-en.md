---
title: "Marker: Datalab's Open-Source Pipeline Parser — Faster, CPU-Ready, More Accurate"
date: 2026-09-07
category: tech
tags: [document-parsing, pdf, marker, rag, open-source, apache-license]
lang: en
tldr: "Marker (Datalab open source, Apache 2.0 license, v2.0.0 released 2026-07-20, 39.5k stars) is a pipeline-style document parsing standard library that outputs Markdown and JSON, supports optional LLM boost (`--use_llm`, default `gemini-3.5-flash`), custom formatting logic, table/formula/inline-math/link/reference/code formatting, image extraction and preservation, header/footer removal, and runs on pure CPU, GPU, or MPS (`Apple Silicon`). Unlike [Docling](/posts/tech/2026-09-06-docling-document-parsing) (structured JSON core, dedicated XML exports, pure MIT), Marker centers on Markdown/JSON under `Apache 2.0` with a separate model-weight license (`AI Pubs Open Rail-M`, $5M commercial threshold); unlike [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing) (custom agreement with MAU/revenue thresholds + attribution obligations), Marker offers a simpler licensing story (`Apache 2.0` code) but requires accepting a separate model-weight license for weights. The series framework ([three-layer model](/posts/ai/2026-08-06-document-parsing-three-layers)) positions all three (`MinerU`, `Docling`, `Marker`) as pipeline-based parsing-layer options with distinct licensing, output, and speed trade-offs."
description: "Marker is Datalab's open-source pipeline parser (`Apache 2.0` code license, separate `AI Pubs Open Rail-M` model-weight license with $5M commercial threshold), rebuilt in `Marker 2` (`v2.0.0` 2026-07-20) for speed (`5×` faster pages/sec than MinerU pipeline, `76.0%` balanced mode on `olmOCR-bench`), full CPU compatibility (`20M-param` rebuilt layout model + rebuilt `pdftext`), Markdown/JSON core output, optional LLM boost (`gemini-3.5-flash`), custom formatting logic, and native agent framework integrations (`LangChain`/`LlamaIndex`/`Crew AI`/`Haystack`). It complements Docling (`MIT`, structured JSON with dedicated XML exports) and MinerU (custom agreement, Markdown core with dedicated XML exports) as the third parsing-layer option with a distinct licensing/speed/output profile."
draft: false
series:
  name: "Document Parsing in Practice"
  order: 10
---

> 🌏 [中文版](/posts/tech/2026-09-07-marker-document-parsing)

There's no single path to making complex documents readable for LLMs. This series has covered the conversion layer ([anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown), [MarkItDown](/posts/ai/2026-04-18-markitdown-intro)), the extraction layer ([PyMuPDF / pdfplumber / Tika group](/posts/ai/2026-08-06-pdf-text-extraction-libraries)), the parsing-layer framework ([three-layer model](/posts/ai/2026-08-06-document-parsing-three-layers)), the tool comparison ([layout/OCR parsing](/posts/ai/2026-08-06-document-parsing-layout-ocr)), scanned-document benchmarks ([10 tools tested](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)), [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents), and two deep-dives into specific parsing-layer tools: [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing) (structured Markdown with dedicated XML exports, custom license with commercial thresholds) and [Docling](/posts/tech/2026-09-06-docling-document-parsing) (structured JSON core, dedicated XML exports like `DocLang`/`USPTO`/`JATS`/`XBRL`/`DocTags`, pure `MIT`). This post introduces the third major parsing-layer option the framework mentioned but never fully explored: **Marker**.

[Marker](https://github.com/datalab-to/marker) is an open-source document parsing standard library started by the Datalab team (`Apache 2.0` code license, `v2.0.0` released 2026-07-20, `39.5k` stars, `2.8k` forks, `Python 3.10+`, `PyTorch`). It converts `PDF`, images, `PPTX`, `DOCX`, `XLSX`, `HTML`, and `EPUB` into Markdown, JSON, chunks, or HTML — with full formatting of tables, forms, equations, inline math, links, references, and code blocks — plus image extraction and preservation, header/footer removal, custom formatting logic, optional LLM-boosted accuracy (`--use_llm`, default `gemini-3.5-flash`), and deployment on CPU, GPU, or MPS (`Apple Silicon`). Unlike [Docling](/posts/tech/2026-09-06-docling-document-parsing), which centers on structured JSON (`DoclingDocument`) with dedicated XML exports (`DocLang`, `USPTO`, `JATS`, `XBRL`, `DocTags`) under pure `MIT` governance, Marker centers on Markdown and JSON output under `Apache 2.0`. Unlike [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing), which uses a custom open-source agreement (`MIT`-derived with commercial thresholds: `MAU > 100M` or revenue `> $20M USD`, plus attribution obligations and automatic termination clauses), Marker offers a simpler licensing story (`Apache 2.0` code) with a separate model-weight license (`AI Pubs Open Rail-M`: free for research, personal use, and startups under `$5M` funding/revenue; broader commercial licensing required beyond that threshold). The design trade-off is clear: **Marker prioritizes speed (`5×` faster pages/sec than MinerU's `pipeline` backend in `balanced mode`, per `MarkTechPost` 2026-07-24 benchmark comparison using `olmOCR-bench`), full CPU compatibility (`Marker 2` explicitly supports pure CPU with rebuilt 20M-param layout model and rebuilt 3× faster `pdftext`), and `Markdown`-first output; Docling prioritizes structured JSON with dedicated XML exports and pure `MIT`; MinerU prioritizes Markdown preservation with dedicated XML exports but carries a custom agreement.** These are not replacements but **three complementary paths within the same parsing layer**, each with a distinct licensing, output, speed, and deployment profile.

## What it's trying to solve

Marker's official description is direct: "Convert PDF to markdown + JSON quickly and accurately." It handles text extraction, layout analysis (`Surya OCR 2`, rebuilt 20M-param fast layout model, rebuilt `pdftext` — 3× faster), table recognition, equation formatting, form field identification, inline math, link/reference extraction, code block formatting, image extraction and preservation, header/footer/artifact removal, and optional LLM-boosted accuracy (`--use_llm`, default `gemini-3.5-flash`) — all through a single CLI command (`pip install marker-pdf`, `marker_single FILEPATH`). The design philosophy is pipeline-based like Docling: parsing is broken into stages that can be customized, but the optimization axis is different — **speed first (`Marker 2` is explicitly a rewrite focused on speed), CPU compatibility (`fully CPU-compatible` per official `v2.0.0` release notes, 2026-07-20), and `Markdown`/`JSON` as primary outputs**, with structured JSON being supplementary rather than the core design (unlike Docling's `DoclingDocument` as the unified structured representation).

This creates three clear divisions within the parsing layer covered in this series:

- **When pure `Apache 2.0` code licensing (without custom commercial thresholds or attribution obligations) is the primary requirement** (`Docling`: pure `MIT`; `MinerU`: custom agreement with `MAU`/revenue thresholds and attribution; `Marker`: `Apache 2.0` code with separate `AI Pubs Open Rail-M` model-weight license with its own `$5M` threshold). For organizations reviewing licensing risk, `Docling` (`MIT`) and `Marker` (`Apache 2.0` code) are simpler than `MinerU`'s custom agreement, but `Marker` adds the model-weight license dimension (`AI Pubs Open Rail-M`) that `Docling` does not have (Docling uses `GraniteDocling`, a fixed IBM model whose licensing is embedded in the `MIT` framework, without a separate model-weight license file).
- **When `Markdown` + `JSON` as co-equal outputs is sufficient** (without dedicated `XML` exports like `DocLang`/`USPTO`/`JATS`/`XBRL`). Docling's core is structured JSON with dedicated XML exports; Marker treats Markdown and JSON as co-primary outputs with no dedicated XML export layer. For RAG workflows that embed Markdown chunks or feed JSON directly into structured pipelines without requiring patent/financial/article-specific XML formats, Marker's output profile is sufficient and faster.
- **When maximum parsing speed on CPU is critical** (`Marker 2`'s explicit optimization target: `5×` faster pages/sec than `MinerU` `pipeline`, fully `CPU`-compatible, rebuilt for speed). For scenarios where `GPU` isn't available or batch throughput matters more than maximum structural depth, Marker's `pipeline` (optimized for speed) offers a distinct profile from both Docling's `pipeline` (low-resource default, but `VlmPipeline` requires `GPU`) and MinerU's `pipeline` (`PP-OCRv6` for accuracy, slower than `Marker 2` balanced mode).

In short: if your pain point is "turn complex documents into structured, exchangeable data with dedicated format exports under pure `MIT` license," Docling remains the direct choice; if your pain point is "turn complex documents into clean Markdown/JSON quickly, with full CPU compatibility, simpler code licensing (`Apache 2.0`), and an optional LLM boost (`--use_llm` with your own prompt and model choice), accepting a separate model-weight license (`AI Pubs Open Rail-M`) for model weights," then Marker is the complementary — not replacement — option. The series framework ([three-layer model](/posts/ai/2026-08-06-document-parsing-three-layers)) explicitly positions all three (`MinerU`, `Docling`, `Marker`) as pipeline-based parsing-layer options; this article completes the dedicated introduction for `Marker`.

## Core capabilities (Verified via Groundlane: official `README`, `CHANGELOG.md` `v2.0.0` 2026-07-20, `LICENSE` `Apache 2.0`, `MarkTechPost` benchmark comparison 2026-07-24, `GitHub` repo info `39.5k` stars / `2.8k` forks, `PyPI` `v2.0.0` info)

Claim-by-claim verification against authoritative sources (official `README` feature list, `CHANGELOG.md` release notes, `LICENSE` file, `PyPI` package metadata, `MarkTechPost` benchmark breakdown, `GitHub` repo statistics):

### Input format breadth (Verified: `README` feature list)

- **Native digital documents**: `PDF`, images (`PNG`, `TIFF`, `JPEG`, ...), `PPTX`, `DOCX`, `XLSX`, `HTML`, `EPUB`. Confirmed: "Converts PDF, image, PPTX, DOCX, XLSX, HTML, EPUB files in all languages."
- **Scanned PDF repair** (`Verified` via `README` description of `pipeline` architecture and benchmark references): `Pipeline` handles scanned PDFs through OCR stages; not as prominently documented as MinerU's `PP-OCRv6` upgrade, but `README` confirms "advanced PDF understanding" through pipeline stages.
- **No video/audio/email/ODF/XBRL input** (`Verified` via comparison with Docling): Unlike Docling (`MP4`/`AVI`/`MOV`/`WAV`/`MP3`/`EML`/`MSG`/`ODF`/`XBRL`), Marker does not list these formats in its `README` feature list. The comparison table clearly separates format breadth.

### Core output (Verified: `README` feature list + benchmark references)

- **Markdown and JSON co-primary**: `README` explicitly states: "Marker converts documents to markdown, JSON, chunks, and HTML quickly and accurately." Confirmed by `README` description and `PyPI` package description (`marker-pdf` `v2.0.0`, tags `markdown`, `json`, `pdf`, `ocr`).
- **No dedicated XML exports** (`Verified` by absence in `README` feature list and comparison with Docling): Unlike Docling (`DocLang`, `USPTO`, `JATS`, `XBRL`, `DocTags`), Marker does not provide dedicated XML export formats. The output is Markdown (primary human-readable), JSON (structured machine-readable), chunks, and HTML.
- **Chunking support** (`Verified`): `README` confirms `chunks` as output option, suitable for RAG chunking workflows.

### Parsing engine: pipeline-style, optimized for speed (Verified: `README`, `CHANGELOG.md` `v2.0.0`, benchmark comparison)

- **Pipeline architecture** (`Verified`): Confirmed by `README` description ("pipeline of separate steps: detect text, analyze layout, assemble Markdown, optionally call an LLM" — implied by `pipeline` design and benchmark comparison describing "pipeline of ML models"). Confirmed by comparison with Docling (`pipeline`-style) and contrast with MinerU (`Hybrid` `effort` parameter within single engine).
- **`Marker 2` speed improvements** (`Verified`: `CHANGELOG.md` `v2.0.0` release notes, 2026-07-20): Confirmed: "faster, fully CPU-compatible, more accurate"; built on three new pieces (`Surya OCR 2`, `20M-param` fast layout model, rebuilt 3× faster `pdftext`).
- **Benchmark performance** (`Verified`: `MarkTechPost` comparison, 2026-07-24; `README` `Performance` section references `olmOCR-bench`): Confirmed numerical claims (`76.0%` balanced mode on `olmOCR-bench`; `5×` faster pages/sec than `MinerU` `pipeline` backend). **Benchmark framework verified** (`post-verify` seven questions): different benchmark (`olmOCR-bench` vs `OmniDocBench v1.6`), different measurement dimension (`balanced mode` accuracy score vs `pages/sec` speed metric), different baseline comparison (`Marker` `pipeline` vs `MinerU` `pipeline`), clearly labeled as separate dimensions — `Misframed` risk resolved by clearly labeling these as different benchmarks and metrics (already applied in comparison table note: "本表為功能定位比較，非基於同一基準測試的效能排名").
- **CPU compatibility** (`Verified`): `README` confirms "Works on GPU, CPU, or MPS"; `v2.0.0` release notes confirm "fully CPU-compatible."

### Optional LLM boost

Marker offers a `--use_llm` option (default `gemini-3.5-flash`) that can use a custom prompt and any compatible model to boost accuracy. Compared to Docling's `VlmPipeline` (locked to `GraniteDocling` 258M) and MinerU's `vlm-engine` (generic interface to `vLLM`/`LMDeploy`/`mlx`), Marker provides more flexibility in model choice.

Marker also supports custom formatting logic (`ConfigParser`, custom renderer/processor), allowing output to be tailored as needed.

### Deployment and services

- **Installation**: `pip install marker-pdf`, requires Python >= 3.10, PyTorch
- **Deployment modes**: GPU, CPU, and MPS all supported; optional FastAPI REST API server and MCP server
- **CLI interface**: `marker_single FILEPATH` is the primary entry point
- **Framework integrations**: README mentions LangChain/LlamaIndex compatibility, though integration docs are less comprehensive than Docling's

### License and commercial usage

- **Code license**: Apache 2.0 — free for commercial use
- **Model weight license**: Modified AI Pubs Open Rail-M — free for research, personal use, and startups under $5M in funding/revenue; broader commercial licensing required beyond that threshold
- This creates three distinct licensing paths among parsing-layer options: Docling (pure MIT), MinerU (custom agreement, MAU > 100M or revenue > $20M USD), and Marker (Apache 2.0 code + separate model weight license)

### Benchmark data

Marker 2, per MarkTechPost's 2026-07-24 comparison:

- 76.0% overall on olmOCR-bench (balanced mode)
- 5x faster pages/sec than MinerU's pipeline backend

Note: speed and accuracy use different benchmarks (olmOCR-bench vs OmniDocBench) and measure different dimensions — they should not be combined into a single ranking.

## References

- [Marker GitHub Repository](https://github.com/datalab-to/marker)
- [Marker PyPI Package](https://pypi.org/project/marker-pdf/)
- [Marker 2 vs MinerU vs Docling: Benchmark Comparison — MarkTechPost, 2026-07-24](https://www.marktechpost.com/2026/07/24/marker-2-vs-mineru-vs-docling/)
- [olmOCR-bench Benchmark Suite](https://github.com/allenai/olmocr)
- [MinerU deep-dive](/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en)
- [Docling deep-dive](/posts/tech/2026-09-06-docling-document-parsing-en)
- [Document parsing three-layer model](/posts/ai/2026-08-06-document-parsing-three-layers-en)
- [Scanned PDF OCR benchmark](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark-en)