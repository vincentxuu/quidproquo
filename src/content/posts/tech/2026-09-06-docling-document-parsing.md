---
title: "Docling：IBM 開源、MIT 授權、結構化 JSON 為核心的文件解析標準庫"
date: 2026-09-06
category: tech
tags: [document-parsing, pdf, docling, rag, open-source, mit-license]
lang: zh-TW
tldr: "Docling 起源於 IBM Research Zurich，現由 Linux Foundation AI & Data 治理，MIT 授權。它把各種文件統一解析成結構化的 DoclingDocument，再匯出 Markdown、HTML、JSON、DocLang 或 DocTags。輸入格式是解析層三家裡最廣的（Office、Apple iWork、音訊、影片、郵件、行事曆、專利與財報 XML）。2026 秋天新增不跑模型的原生 PDF 管線，VLM 管線也從 GraniteDocling 擴充到 MinerU2.5-Pro、Nemotron Parse、MiniCPM-OCR 等多個 preset。"
description: "Docling 導讀：DoclingDocument 結構化表示、輸入與匯出格式、標準／原生／VLM 三條管線、VLM preset 的授權要分開看，以及它和 MinerU、Marker 的分工。"
draft: false
series:
  name: "文件解析實戰"
  order: 9
---

> :globe: [English version](/posts/tech/2026-09-06-docling-document-parsing-en)

把複雜文件轉成 LLM 讀得懂的東西，不是只有一條路。這個系列走過轉換層（[anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown)、[MarkItDown](/posts/ai/2026-04-18-markitdown-intro)）、抽取層（[PyMuPDF／pdfplumber／Tika](/posts/ai/2026-08-06-pdf-text-extraction-libraries)）、解析層的[工具比較](/posts/ai/2026-08-06-document-parsing-layout-ocr)與[掃描實測](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)，再用 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 說明為什麼固定管線不夠。這篇把焦點放在解析層裡最容易被低估的一個：**Docling**。

[Docling](https://github.com/docling-project/docling) 由 **IBM Research Zurich** 開始，後來捐給 **Linux Foundation AI & Data** 治理，採 MIT 授權，2026 年 11 月的最新版是 `v2.151.1`。它和 [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing) 同屬解析層，但設計取捨不同：**Docling 的核心不是「把文件轉成 Markdown」，而是「把各種文件統一成一份可交換、可組合的結構化表示」**，Markdown 只是它的匯出選項之一。

## 它想解決什麼

企業文件的來源很雜：PDF、Word、簡報、試算表、郵件、會議錄音、Apple iWork 檔，還有專利或財報這類有既定 XML schema 的資料。每種格式各寫一套 parser，下游就得處理一堆不一致的輸出。

Docling 的答案是先把所有輸入都轉成同一個資料模型 `DoclingDocument`（標題、段落、清單、表格、公式、圖片、版面區塊、閱讀順序都在裡面），下游只面對這一種結構。解析 PDF 時則拆成可替換的階段：版面偵測、OCR、表格結構、公式、圖片分類，每一段都能換引擎或關掉。

這讓它和其他工具的分界很清楚：

- **需要結構化 JSON 而不只是 Markdown**（例如直接進資料庫或下游程式）時，Docling 是直接的選擇。
- **輸入格式雜**，含音訊、影片、郵件、行事曆、iWork、專利與財報 XML 時，Docling 涵蓋最廣。
- **授權要乾淨**時，Docling 是 MIT，沒有 MinerU 那種商業門檻與標示義務。但開 VLM 管線時，用到的模型各有自己的授權（見下文）。

## 核心能力

### 輸入格式

- **辦公文件**：DOCX、XLSX、PPTX；舊版 DOC、XLS、PPT 與 RTF（需要 LibreOffice）；ODT、ODS、ODP；Apple Pages、Numbers、Keynote（需要 `format-iwork` extra）；EPUB。
- **網頁與標記**：HTML、XHTML、MHTML、Markdown、AsciiDoc、LaTeX、CSV。
- **影像**：PNG、JPEG、TIFF、BMP、WEBP，走 OCR。
- **音訊與影片**：WAV、MP3、M4A 等音訊，以及 MP4、AVI、MOV、MKV、WEBM 影片，抽出音軌做語音轉文字（需要 `audio` 或 `asr` extra 與 ffmpeg）；README 另列出影片可取代表性關鍵影格。
- **通訊與其他**：EML、MSG 郵件（含會議邀請）、iCalendar、WebVTT、Box Notes、IBM AFP。
- **專用 schema**：DocLang XML、USPTO 專利 XML、JATS 期刊文章 XML、XBRL 與 iXBRL 財報、大型主機的 EBCDIC 資料。

注意 USPTO、JATS、XBRL 是**輸入**格式：Docling 能把這些 XML 讀進來變成 `DoclingDocument`，不是把一般 PDF 匯出成專利或財報 XML。

### 匯出格式

`DoclingDocument` 可以匯出成 Markdown、HTML、純文字、無損 JSON、DocLang XML 與 DocLang 封裝檔（`.dclx`，含頁面圖片）、[DocTags](https://arxiv.org/abs/2503.11576)、WebVTT、LaTeX，以及給 RAG 用的 JSONL chunks。

### 三條 PDF 管線

| 管線 | 做法 | 取捨 |
|---|---|---|
| 標準管線（預設） | 讀 PDF 文字層，加上版面模型（預設 Heron）、表格結構、OCR 等階段 | 純 CPU 可跑；每階段可替換或關閉 |
| 原生管線（`--pipeline native`，v2.126 起） | 不跑任何版面、OCR 或表格模型，只用 PDF 本身帶的文字與圖片 | 很快，但沒有閱讀順序、標題與表格結構 |
| VLM 管線（`VlmPipeline`） | 整頁交給視覺語言模型 | 品質取決於選的模型，通常要 GPU 或 Apple Silicon |

原生管線的定位接近本系列的抽取層：適合先快速建索引，再挑重要文件跑完整管線。

### VLM preset

`docling --pipeline vlm FILE` 用預設 preset，也就是 IBM 的 GraniteDocling（258M，Apache 2.0）；`docling --vlm-model <preset> FILE` 可以換模型。2026 年 9～11 月陸續加入的 preset 包括 NVIDIA Nemotron Parse 2.0 與 3.5、MinerU2.5-Pro、Unlimited-OCR 2、LightOnOCR-3、Surya-OCR-2.5、MiniCPM-OCR，加上原有的 SmolDocling、DeepSeek-OCR、Granite Vision、Nanonets-OCR2 等。各模型的細節見[解析層模型篇](/posts/ai/2026-08-06-document-parsing-layout-ocr)與 [MiniCPM 家族篇](/posts/tech/2026-11-23-ai-model-family-minicpm)。

這代表 Docling 不再綁單一模型，可以在同一套 `DoclingDocument` 下替換 VLM。代價是授權要逐一看：Docling 程式碼是 MIT，但你選的模型權重各有授權，例如 Surya 系列帶營收門檻，部分 preset 要另外架 OpenAI 相容的推論服務。

### 部署與整合

- **安裝**：`pip install docling`，需要 Python 3.10 以上（3.9 在 v2.70.0 停止支援）；支援 macOS、Linux、Windows 的 x86_64 與 arm64，也提供 Dockerfile。
- **服務**：`docling-serve` 提供 API server，另有 [MCP server](https://docling-project.github.io/docling/usage/mcp/) 讓 agent 直接呼叫。
- **框架整合**：官方列出 LangChain、LlamaIndex、Crew AI、Haystack。
- **CLI**：v2.149 重整了 CLI 參數；照舊教學操作時，指令以 `docling --help` 為準。

### 先前版本

本文初版（2026-09）時 VLM 管線的主角是 GraniteDocling，PDF 只有標準管線。之後兩個多月幾乎每週發一版，主要變化是：原生 PDF 管線、多個 VLM preset、iWork 三件套、iCalendar、iXBRL、RTF、MHTML、AFP 輸入，以及圖表資料抽取。

## 與替代方案比較

下表是功能定位比較，不是同一基準下的效能排名：

| | Docling | [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing) | [Marker](/posts/tech/2026-09-07-marker-document-parsing) |
|---|---|---|---|
| 授權 | MIT；VLM preset 依各模型授權 | Apache 2.0 加附加條款（MAU 1 億／月營收 2,000 萬美元門檻、線上服務標示、違反自動終止） | 程式碼 Apache 2.0；模型權重有營收、募資與競爭者限制 |
| 核心輸出 | `DoclingDocument` 結構化 JSON，可匯出 Markdown、HTML、DocLang、DocTags | Markdown、JSON 等九種渲染目標 | Markdown、JSON、chunks |
| 輸入廣度 | 最廣（含音訊、影片、郵件、行事曆、iWork、專利與財報 XML） | PDF、圖片、Office、OpenDocument、EPUB、OFD、HTML；無音訊、影片、郵件 | PDF、圖片、Office、EPUB、HTML |
| 速度取捨 | 標準、原生、VLM 三條管線 | flash／basic／standard／advanced 四個檔位 | no_ocr／fast／balanced／vllm 四種模式 |

在 Datalab 自己發布、自己跑分的 OmniParseBench 上，Docling 預設管線得 74.9，低於 Marker 與 PaddleOCR-VL；這是競品自報的數字，但也提醒一件事：Docling 的強項是格式廣度與結構化表示，不是預設管線的準確度。要準確度，就換 VLM preset，並用自己的文件驗證。

## 適用情境

- **結構化資料交換**：解析結果要直接進資料庫或下游程式，需要穩定的 JSON 結構而不是 Markdown。
- **格式雜的知識庫**：同一批資料裡有會議錄音、郵件、iWork 檔、專利或財報 XML。
- **授權審查嚴格**：商業產品、政府或教育機構，需要避開自訂授權的門檻與標示義務；記得把選用的 VLM 權重授權一起審。
- **需要精細控制**：對電子原生 PDF 用原生或標準管線、對掃描件換 VLM preset、只跑部分階段。
- **接 agent 框架**：透過 MCP server 或 LangChain、LlamaIndex 等整合。

## 部署與實際限制

- **預設管線的準確度**：複雜版面、公式密集的文件，預設管線常不如專門的 VLM；先用代表性樣本比較標準管線與幾個 VLM preset。
- **額外依賴**：舊版 Office 與 RTF 要 LibreOffice，音訊與影片要 ffmpeg 與 ASR extra，iWork 要 `format-iwork` extra。
- **版本節奏快**：幾乎每週一版，CLI 在 v2.149 重整過。正式環境要釘版本，升級前讀 CHANGELOG。
- **原生管線不是解析**：它快，但不產生閱讀順序與表格結構，不能拿來取代完整解析。

## 整體取捨

Docling 的價值在於把文件解析標準化成一份可交換的結構化表示，並用 MIT 授權讓它能自由進商業部署。只需要 Markdown 給 LLM 讀的場景，它可能太重；需要把各種格式的文件變成一致的結構化資料，或授權審查是硬條件的場景，它是解析層裡最直接的選擇。2026 秋天加入的多個 VLM preset 讓它從「一個工具」變成「一個可以換模型的框架」，但也把授權審查的範圍從 Docling 本身擴大到你選的模型。

想試的話，先 `pip install docling`，用 `docling FILE` 跑預設管線，再用 `docling --vlm-model granite_docling FILE` 或其他 preset 比較同一份文件的結果。

## 更新紀錄

- 2026-11-23：依 v2.101～v2.151 更新：新增原生 PDF 管線、多個 VLM preset（GraniteDocling 仍是預設）、iWork、iCalendar、iXBRL、RTF、MHTML、AFP 輸入與 LaTeX、chunks 匯出；修正「USPTO、JATS、XBRL 是匯出格式」的錯誤，它們是輸入 schema；修正 VLM 管線「綁定單一模型」的說法；MinerU、Marker 的對照改依兩者新版；移除未查證的 NPU 支援與星數。

## 參考資料

- [docling-project/docling — GitHub](https://github.com/docling-project/docling)：README、[CHANGELOG](https://github.com/docling-project/docling/blob/main/CHANGELOG.md)、[LICENSE](https://github.com/docling-project/docling/blob/main/LICENSE)（MIT）
- [Docling 官方文件](https://docling-project.github.io/docling/)：[支援格式](https://docling-project.github.io/docling/usage/supported_formats/)、[Vision Models](https://docling-project.github.io/docling/usage/vision_models/)、[Model Catalog](https://docling-project.github.io/docling/usage/model_catalog/)、[MCP server](https://docling-project.github.io/docling/usage/mcp/)
- [原生 PDF 管線 PR #3979](https://github.com/docling-project/docling/pull/3979)
- [Docling — PyPI](https://pypi.org/project/docling/)
- [Docling 捐贈 LF AI & Data 討論（#1184）](https://github.com/docling-project/docling/discussions/1184)
- [Docling Technical Report — arXiv 2408.09869](https://arxiv.org/abs/2408.09869)
- [DocTags — arXiv 2503.11576](https://arxiv.org/abs/2503.11576)
- [granite-docling-258M — Hugging Face](https://huggingface.co/ibm-granite/granite-docling-258M)
- [Marker v2.2.0 release note](https://github.com/datalab-to/marker/releases/tag/v2.2.0)：OmniParseBench 對照數字（Datalab 自報）
