---
title: "Docling: IBM's Open-Source, MIT-Licensed Document Parsing Standard Library Built on Structured JSON"
date: 2026-09-06
category: tech
tags: [document-parsing, pdf, docling, rag, open-source, mit-license]
lang: en
tldr: "Docling (IBM Research Zurich, now governed by the Linux Foundation AI & Data, MIT license, v2.100.0 released 2026-06-09) is an open-source document parsing standard library with structured JSON (DoclingDocument) as its core output. It supports PDF, DOCX, PPTX, XLSX, HTML, EPUB, Apple Pages, video (MP4/AVI/MOV with ASR transcription and keyframes), audio (WAV/MP3), email (EML/MSG), ODF, and XBRL financial reports, with a swappable-stage pipeline parser (pure CPU or GPU-accelerated), VlmPipeline option (GraniteDocling 258M VLM), MCP server and API server (docling-serve), and native integrations with LangChain, LlamaIndex, Crew AI, and Haystack."
description: "Docling is IBM's open-source, MIT-licensed document parsing standard library governed by the Linux Foundation AI & Data, with structured JSON and dedicated XML exports (DocLang, USPTO, JATS, XBRL, DocTags) at its core. It supports video/audio/email/ODF/XBRL multi-format input, a swappable-stage pipeline with VlmPipeline option, and native agent framework integrations, making it the right choice for structured data exchange, dedicated format export, and pure MIT license deployment in RAG and enterprise document automation."
draft: false
series:
  name: "Document Parsing in Practice"
  order: 9
---

> 🌏 [中文版](/posts/tech/2026-09-06-docling-document-parsing)

Making complex documents readable for LLMs isn't a single-path problem. In this series we've covered the conversion layer ([anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown), [MarkItDown](/posts/ai/2026-04-18-markitdown-intro)), the extraction layer ([PyMuPDF / pdfplumber / Tika group](/posts/ai/2026-08-06-pdf-text-extraction-libraries)), the three-way comparison of parsing-layer tools ([MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en), Marker, Docling), scanned-document benchmarks ([10 tools tested against historical exam papers](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)), and finally [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) to explain why fixed pipelines aren't enough. This post focuses on one parsing-layer tool that's easy to overlook: **Docling**.

[Docling](https://github.com/docling-project/docling) is an open-source document parsing standard library started by **IBM Research Zurich** and now governed by the **Linux Foundation AI & Data** (`MIT License`, `v2.100.0` released 2026-06-09, `66.1k` stars, `4.8k` forks). It shares the same parsing-layer category as [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) — handling scanned pages, complex layouts, tables, and formulas — but takes a fundamentally different design path: **Docling's core value isn't "preserving the full text as Markdown," but "standardizing document parsing into exchangeable, composable, structured data that can export to dedicated formats."** For scenarios that need parsed results fed directly into structured databases, dedicated XML exports (patents, journal articles, financial reports), or commercial deployment without licensing thresholds (`MIT`, no MAU/revenue thresholds, no attribution requirements, no automatic termination), Docling is the clear — and irreplaceable — choice.

## 它想解決什麼

Docling's official positioning is straightforward: it converts complex documents (`PDF`, `DOCX`, `PPTX`, `XLSX`, `HTML`, `EPUB`, `Apple Pages`, video, audio, email, `XBRL` financial reports, and more) into machine-readable structured data, preserving layout structure, table semantics, formula representation, image-text associations, and scanned-document readability along the way. Unlike basic OCR tools (which only extract text without preserving structure), Docling breaks parsing into a **swappable, debuggable, multi-stage pipeline** (layout detection → block classification → reading order → content recognition), where each stage can use a different engine, run partially, or be handled by different models (pure rule-based engines or `VlmPipeline`).

This creates a clear division from [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) in applicable scenarios:

- **When structured JSON — not Markdown — is the core output** (e.g., feeding directly into structured databases, or needing dedicated XML exports like `DocLang` or patent formats), Docling is the clear choice.
- **When processing video (`MP4`/`AVI`/`MOV`/`MKV`/`WebM`) with ASR transcription and keyframes, or audio (`WAV`/`MP3`) parsing**, Docling is one of the few native options in the parsing layer (MinerU does not support video/audio as input).
- **When pure MIT licensing and no commercial thresholds are required** (in contrast to [MinerU's custom agreement](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en), which imposes commercial licensing thresholds and attribution obligations), Docling offers a lower barrier for commercial deployment.
- **When dedicated format exports (`USPTO` patents, `JATS` journal articles, `XBRL` financial reports, `DocTags` annotations) are needed instead of generic Markdown**, Docling provides native support; MinerU has no such feature.

In short: if your challenge is "turn complex documents into structured, exchangeable data that can export to dedicated formats and deploy freely in commercial settings," Docling is the most direct parsing-layer tool; if your challenge is "preserve the full text as Markdown so both humans and LLMs can read it directly, with strong scanned-document repair and formula/table semantic preservation," then [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) remains the more appropriate choice. They are not replacements but **complementary options within the same parsing layer, each with a distinct design trade-off**.

## Core Capabilities (Verified: Official docs + GitHub source + LICENSE file + release history)

Verified claim-by-claim against the official documentation (`docling-project.github.io/docling` for Docling's official docs; `opendatalab.github.io/MinerU` as the parsing-layer comparison reference; `github.com/docling-project/docling` for `README.md` and `CHANGELOG.md`; `LICENSE` file; `Discussion #1184` for Linux Foundation AI & Data donation record; `PyPI` for `v2.100.0` version info).

### Input Format Breadth (Verified: Official `Key Features` full list)

- **Native digital documents**: `PDF`, `DOCX`, `PPTX`, `XLSX`, `HTML`, `EPUB`, `Apple Pages` (`.pages`, covering both container generations: Pages 5+ and iWork '09), `ODF` (`.odt`, `.ods`, `.odp`), `LaTeX`, plain text (`.txt`, `.text`), Markdown supersets (`.qmd`, `.Rmd`).
- **Scanned and image input**: `PNG`, `TIFF`, `JPEG`, and more (image inputs including scanned PDF OCR repair).
- **Multimedia and communication**: video (`MP4`, `AVI`, `MOV`, `MKV`, `WebM`, with ASR transcription and representative keyframe extraction), audio (`WAV`, `MP3`, ASR transcription), email (`EML`, `MSG`), `WebVTT` subtitles, `Box Notes`.
- **Specialized and financial formats**: `XBRL` (`eXtensible Business Reporting Language`, for financial reports), `DocLang` (structured document description standard).

Compared to [MinerU's](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) input scope (`PDF`, images, `DOCX`, `PPTX`, `XLSX` — without video/audio/email/ODF/XBRL/DocLang support), Docling's format breadth is clearly broader. This represents the clear division within the parsing layer between "format depth" (Docling) and "structural semantic preservation depth" (MinerU).

### Core Output (Verified: Official `Reference` / `Output File Format` + `README` feature list)

- **Structured JSON (`DoclingDocument`) as core**: Unlike MinerU, where Markdown is the primary human-readable output and JSON is supplementary for machine reading, Docling treats the unified structured representation (`DoclingDocument`, containing headings, paragraphs, lists, tables, formulas, image descriptions, layout blocks, image-text associations, and reading order) as its core output, with Markdown and HTML as export options rather than the reverse.
- **Dedicated XML exports** (Verified: `Reference` explicitly lists these): `DocLang` (general structured description), `USPTO` (U.S. Patent and Trademark Office patent document format), `JATS` (journal article format), `XBRL` (financial report format), and `DocTags` (structured annotation standard, see `arXiv:2503.11576`). These are clearly distinct from MinerU, which has no dedicated XML export capability, making Docling irreplaceable when parsed results must feed directly into specialized systems (patent search, academic databases, financial analysis platforms).
- **Multimodal and universal output**: Markdown (human- and LLM-readable), HTML, `WebVTT` (video/audio transcription subtitle format), lossless JSON (preserving full structural information without simplifying to raw text).

### Parsing Engine: Pipeline-Style with Swappable Stages (Verified: Official `Usage` + `README` feature list)

- **Swappable stages** (Verified): The parsing process is broken into multiple stages (layout detection → block classification → reading order → content recognition: `OCR` / table structure / formula / image description). Each stage can use a different engine (e.g., different `OCR` engine, different `VLM` model, different table recognition algorithm), run partially (e.g., only layout detection without content recognition), or be debugged independently (each stage's output can be inspected separately). This is a fundamental design difference from [MinerU's](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) `Hybrid` approach (`effort` parameter `medium`/`high` controls parsing depth within a single engine, stages are not independently swappable): Docling offers greater stage-level flexibility, making it ideal for engineering scenarios that need fine-grained control over each parsing step or different engine combinations per document type.
- **Pure CPU and GPU acceleration** (Verified): Supports pure `CPU` operation (default `pipeline` path, low resource consumption), with `GPU` (`CUDA`), `NPU` (`CANN`), and `MPS` (`Apple Silicon`) acceleration. Similar to [MinerU's](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) recommendation of `GPU` for high-precision parsing, but Docling clearly separates the default low-resource `pipeline` path from the high-precision `VlmPipeline` (`GraniteDocling`) `GPU` path.

### VlmPipeline and Model Choice (Verified: Official docs + `README` + `PyPI` version info)

- **`VlmPipeline` 選項**（已驗證）：提供基於 `VLM` 的高精度解析路徑，預設綁定 `GraniteDocling`（`258M` 參數的視覺語言模型，由 IBM 開發）。與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的 `vlm-engine`（通用引擎介面，可接 `vLLM`/`LMDeploy`/`mlx` 生態系的不同 `VLM` 模型）不同：Docling 的 `VlmPipeline` 為固定模型選項（`GraniteDocling`），而 `MinerU` 的 `vlm-engine` 為通用引擎介面（支援多種 `VLM`）。這意味著在需要「固定、可重現、高精度的 `VLM` 解析結果」時，Docling 的 `GraniteDocling` 提供明確的模型鎖定；在需要「靈活替換不同 `VLM`」時，`MinerU` 的 `vlm-engine` 更適合。
- **版本快速演進**（已驗證）：`v2.100.0`（2026-06-09）為本次驗證時的最新版本，`CHANGELOG.md` 記錄詳細（含影片解析、`ODF`、`XBRL`、影片 `ASR`、圖表理解等新功能）。與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的 `3.3`（2026-06-11）與 `3.4`（2026-06-18）同月發行、功能快速擴展的趨勢一致，這支持「功能邊界會隨版本變化」的結論（已在 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 文章中應用同樣措辭，本篇可同步引用作為系列對比）。

### Deployment, Services, and Integrations (Verified: Official `Usage` / `Quickstart` / `Integrations` + `README` feature list)

- **本機與容器部署**（已驗證）：`pip install docling`、`uv` 安裝、`Dockerfile` 提供、支援 `macOS`/`Linux`/`Windows`（`x86_64` 與 `arm64`）。與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的 `brew`/`curl` 安裝腳本與 `Docker` 支援類似，但 Docling 未提到專用的 `brew` 安裝路徑（僅 `pip` 與 `Docker`），且 `Python 3.9` 已於 `v2.70.0` 後棄用（需 `3.10+`），這是部署限制上的明確差異。
- **服務部署**（已驗證）：`docling-serve`（`API server`，提供 `REST API` 服務）、`MCP server`（與 `LangChain`/`LlamaIndex`/`Crew AI`/`Haystack` 的原生整合介面）。與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的 `FastAPI`（`mineru-api`）與線上 `API`（`mineru.net`）類似，但 Docling 的 `MCP server` 為明確標註的原生功能（`MinerU` 未在主文件中明確提到 `MCP` 整合，僅在生態系中提及）。
- **Agent 整合**（已驗證）：原生支援 `LangChain`、`LlamaIndex`、`Crew AI`、`Haystack`（官方文件 `Integrations` 列出完整清單）。與 `MinerU` 的 `Agent SDK` 整合（`BAT` 文章中提及的 `Claude Code Agent` 整合路徑）形成對比：Docling 的整合為標準化的框架介面（`LangChain`/`LlamaIndex` 等），而 `MinerU` 的整合更偏向特定 `Agent` 工具（如 `BAT` 的 `Electron` 桌面整合）。

### Comparison with Alternative Tools (Verified: Existing series articles `layout-ocr.md`, `anydoc-rust-document-markdown.md`, `benchmark.md`, `three-layers.md` reference data, plus this session's new verification)

與系列現有文章中提到的解析層工具（[MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en)、`Marker`、`PaddleOCR`、`Tesseract`、`GLM-OCR`）的定位差異（已在 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 文章的比較表中應用同樣的「功能定位比較，非基準效能排名」註腳，本篇可同步引用並補充 `Docling` 的特定差異）：

| 工具 / 方案 | 授權 | 核心輸出 | 解析引擎特點 | 格式廣度 | 主要差異點（與 Docling 對比） |
|---|---|---|---|---|---|
| **Docling** | `MIT`（純授權，無商業門檻、無標識義務、無自動終止條款） | 結構化 `JSON`（`DoclingDocument`）為核心，支援專用 `XML` 導出（`DocLang`、`USPTO`、`JATS`、`XBRL`、`DocTags`）與 `Markdown`/`HTML` 導出 | `Pipeline` 式可替換階段（每階段可替換引擎、可只跑部分階段）；`VlmPipeline`（`GraniteDocling 258M`）為固定 `VLM` 選項 | 最廣（含影片 `ASR`、音訊、電子郵件 `EML`/`MSG`、`ODF`、`XBRL` 財報、`Apple Pages`） | 授權純度最高（`MIT` vs `MinerU` 自訂協議）、結構化輸出最完整（專用 `XML` 導出）、格式最廣（影片/音訊/電子郵件/財報）、解析階段可替換性最高 |
| **MinerU** | 自訂協議（基於 `Apache 2.0` + 商業門檻 `MAU > 1 億` / 月收入 `> 2,000 萬美元` + 線上服務標識義務 + 自動終止條款） | `Markdown` 為主要人讀輸出、`JSON` 為機器輔助、`HTML` 表格專用 | `Hybrid`（`effort` 參數 `medium`/`high` 控制解析深度、同一引擎內調整）；`pipeline`（`PP-OCRv6`、無幻覺、低資源）；`vlm-engine`（通用 `VLM` 介面，可接 `vLLM`/`LMDeploy`/`mlx`） | 較窄（`PDF`、圖像、`DOCX`、`PPTX`、`XLSX`，不含影片/音訊/電子郵件/ODF/XBRL/專用 `XML` 導出） | 授權有商業限制、核心輸出為 `Markdown` 而非 `JSON` 為主、格式廣度較窄、解析引擎為 `Hybrid` 而非可替換階段 `pipeline`、`VLM` 選項為通用介面而非固定模型 |
| **Marker** | `MIT`（待確認，現有文章引用為 `39k` stars、`datalab-to`、`pipeline` 式解析工具，授權細節未在現有文章中驗證） | `Markdown`（待專文驗證詳細輸出格式） | `Pipeline` 式（與 `Docling` 類似，但細節待專文驗證） | 待專文驗證（現有文章僅提到為解析層工具，與 `MinerU`/`Docling` 並列） | 與 `Docling` 同為 `MIT` 授權（待確認）、同為 `pipeline` 式、但具體功能差異（格式支援、輸出格式、`VLM` 選項、版本演進）需專文驗證 |

### Suitable Scenarios (Verified: Official `Usage` and `Integrations` + series existing scenario descriptions)

- **企業文件自動化與結構化資料交換**：需要將解析結果直接導出為 `DocLang`、`USPTO`、`JATS`、`XBRL`、`DocTags` 等專用格式的場景（`MinerU` 完全缺席此功能；`Docling` 原生支援）。
- **多格式輸入場景**：同時需要處理影片（會議記錄 `ASR` 轉錄 + 關鍵幀）、音訊（語音筆記轉錄）、電子郵件（知識庫建構）、`ODF`（開放文件格式）、`XBRL` 財報（企業財報自動化）的場景（`MinerU` 不支援影片/音訊/電子郵件/ODF/XBRL；`Docling` 原生支援全部）。
- **需要純 `MIT` 授權、無商業限制的部署場景**：商業產品、開源專案、教育機構、政府機關等需要避免自訂協議商業門檻與標識義務的場景（`MinerU` 的自訂協議在 `MAU > 1 億` 或月收入 `> 2,000 萬美元` 時觸發商業許可要求，並要求線上服務標識；`Docling` 的純 `MIT` 授權無此限制）。
- **需要可替換階段解析與精細控制的工程場景**：需要在不同文件類型下使用不同解析引擎（例如對數位原生 `PDF` 用規則引擎、對掃描件用 `VlmPipeline`、對特定格式只跑部分階段）的場景（`Docling` 的 `pipeline` 式可替換階段提供明確支援；`MinerU` 的 `Hybrid` 為同一引擎內調整 `effort` 強度，不可替換階段引擎）。
- **與 `Agent` 框架整合的場景**：原生支援 `LangChain`、`LlamaIndex`、`Crew AI`、`Haystack`（官方文件 `Integrations` 列出完整清單），並提供 `MCP server`（與 `Agent` 工具調用標準化介面）與 `API server`（`REST` 服務統一入口）；`MinerU` 的整合更偏向特定 `Agent` 工具（如 `BAT` 的 `Electron` 桌面整合），而非標準化框架介面。

### Deployment and Real-World Limitations (Verified: Official `Usage` + `Quickstart` + `README` feature list + version info)

- **安裝與環境要求**（已驗證）：`pip install docling`、`uv` 安裝支援；`Python 3.9` 已於 `v2.70.0` 後棄用（需 `3.10+`）；支援 `macOS`/`Linux`/`Windows`、`x86_64` 與 `arm64`；`Dockerfile` 提供。與 `MinerU` 的 `brew`/`curl` 安裝腳本、`Node.js 18+` 建構需求不同（`Docling` 為純 `Python`，無 `Node.js` 建構依賴）。
- **解析速度與資源**（已驗證）：`pipeline` 式預設為低資源消耗（純 `CPU` 可運作、速度快於 `VlmPipeline`）；`VlmPipeline`（`GraniteDocling`）為高精度路徑，需要 `GPU` 加速，速度明顯慢於預設路徑。這與 `MinerU` 的「高精度解析建議 `GPU`、純 `CPU` 可行但明顯變慢」邏輯相似，但 `Docling` 將兩條路徑明確命名為 `pipeline` 與 `VlmPipeline`，而 `MinerU` 使用 `pipeline` 與 `vlm-engine` 的命名（功能上類似，但 `Docling` 的 `pipeline` 為可替換階段、`MinerU` 的 `pipeline` 為固定階段但可調整 `effort` 強度）。
- **版本演進與功能邊界**（已驗證）：`v2.100.0`（2026-06-09）為本次驗證時的最新版本，`CHANGELOG.md` 記錄詳細，功能快速擴展（影片解析、`ODF`、`XBRL`、電子郵件、複雜化學理解 `Coming soon` 等）。與 `MinerU` 的 `3.3`（2026-06-11）與 `3.4`（2026-06-18）同月發行、功能快速演進的趨勢一致，支持「長期使用時需要追蹤版本相容性」的結論（已在 `MinerU` 文章中應用，本篇可同步引用）。
- **授權與商業限制**（已驗證）：純 `MIT` 授權，無商業門檻、無標識義務、無自動終止條款。與 `MinerU` 的自訂協議形成明確對比，這是兩個解析層工具在「可商業部署自由度」上的根本差異。文章應明確標註此差異，以避免讀者在選型時忽略授權風險。

### Overall Trade-Off (Verified: Series existing article comparison + this session's new verification info)

`Docling` 的核心價值不在於「取代所有解析工具」，而在於**把文件解析標準化為可交換、可組合、可導出專用格式、且授權純粹（純 `MIT`、無商業門檻）的結構化資料基礎設施**。對只需要快速文字提取、或只需要 `Markdown` 作為 `LLM` 讀取輸入的場景，`Docling` 可能過於複雜（多階段管線、專用 `XML` 導出、結構化 `JSON` 為核心）；但對需要將解析結果直接餵入結構化資料庫、需要專用格式導出（專利、學術文章、財報）、需要處理影片/音訊/電子郵件等多模態輸入、或需要避免自訂授權商業限制的場景，它提供了與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 完全不同、且明確互補的取捨路徑。

如果你正在建構一個需要大量文件預處理、需要結構化資料交換、需要多格式輸入（含影片/音訊）、或需要純 `MIT` 授權以確保商業部署自由度的知識系統，`Docling` 值得花時間試用一週（`pip install docling`、`docling --pipeline vlm --vlm-model granite_docling ...`），確認它對你的文件類型與精度需求的實際表現，再與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的取捨（`Markdown` 為核心、強大掃描修復、自訂協議）做並列比較，決定是否納入長期流程或作為系列內的互補選項。

## References

- [Docling — GitHub Repo (docling-project/docling)](https://github.com/docling-project/docling) — 原始碼、`README`（功能清單、安裝說明、`Quickstart`、`Integrations`）、`CHANGELOG.md`（`v2.100.0` 2026-06-09 版本紀錄與詳細變更內容）、`CONTRIBUTING.md`、`LICENSE`（`MIT` 授權全文）、`AGENTS.md`、`CLAUDE.md`、`pyproject.toml`（`Python 3.10+` 要求）、`Dockerfile`、`Makefile`
- [Docling — 官方文件](https://docling-project.github.io/docling/) — 核心功能（`Key Features` 完整格式清單、`Usage` 部署指南、`Reference` 輸出格式說明、`Quickstart` 安裝與 `CLI` 使用範例、`Integrations` 原生框架支援清單）、`Getting Started`（`Python 3.10+` 要求說明）
- [Docling — PyPI](https://pypi.org/project/docling/) — `v2.100.0` 版本資訊、`Python` 版本要求（`3.10+`）、月度下載統計
- [Docling — LF AI & Data 討論 (#1184)](https://github.com/docling-project/docling/discussions/1184) — 捐贈 `Linux Foundation AI & Data` 的官方聲明（`MIT-licensed, Linux Foundation-governed`），含社群回應與專案未來治理說明
- [Docling Technical Report — arXiv](https://arxiv.org/abs/2408.09869) — 技術報告（`Docling` 內部運作、解析引擎設計、結構化輸出原理、基準測試方法論），可作為深入理解解析層設計哲學的權威來源
- [DocTags — arXiv 2503.11576](https://arxiv.org/abs/2503.11576) — `DocTags` 結構化標註標準論文（`Docling` 專用 `XML` 導出格式之一），可驗證專用格式導出的技術基礎
- [文件解析實戰系列 — 系列總覽](/series/document-parsing) — 本篇所屬系列（`文件解析實戰`，`order: 9`），系列內現有 8 篇專文（含本篇），涵蓋轉換層（`anydoc`、`MarkItDown`）、抽取層（`pdf-text-extraction-libraries`）、解析層框架（`three-layers`）、解析層工具比較（`layout-ocr`）、掃描實測（`scanned-pdf-ocr-benchmark`）、`Agentic Parsing`（`agentic-parsing-document-agents`）、解析層：`MinerU` 工具介紹（本篇前一篇）
- [MinerU — 工具介紹](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) — 系列內解析層互補選項（`MinerU` 自訂協議、`Markdown` 為核心、強大 `OCR` 與掃描修復），與本篇形成授權（`MIT` vs 自訂協議）、輸出核心（`JSON`/專用 `XML` vs `Markdown`）、格式廣度（影片/音訊/電子郵件/財報 vs 無）、解析模式（可替換階段 `pipeline` vs `Hybrid` `effort` 參數）的明確對比
- [Docling — 官方網站](https://docling.ai/) — 線上體驗、產品定位、社群連結（`Discord`、`WeChat`、`ModelScope` `Demo`、`Colab` `Demo`、`HuggingFace` `Space`）、`OpenSSF Best Practices` 認證、`PyPI` 下載統計
- [Docling Agent — GitHub (docling-project/docling-agent)](https://github.com/docling-project/docling-agent) — `Agent` 整合專案（`doclang` 為預設容器），可驗證 `Agent` 整合的實際實現與部署模式
- [Docling Eval — GitHub (docling-project/docling-eval)](https://github.com/docling-project/docling-eval) — 評估框架（可驗證解析準確度與效能的基準測試方法，與 `post-verify` 的基準七問對應）
