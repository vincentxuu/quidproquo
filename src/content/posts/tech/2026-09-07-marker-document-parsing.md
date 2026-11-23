---
title: "Marker：Datalab 開源、速度優先、可純 CPU 跑的文件解析管線"
date: 2026-09-07
category: tech
tags: [document-parsing, pdf, marker, rag, open-source, apache-license]
lang: zh-TW
tldr: "Marker 是 Datalab 開源的 PDF 轉 Markdown／JSON 管線，程式碼 Apache 2.0，模型權重另用修改版 OpenRAIL-M（Surya 2.5 門檻 500 萬美元、Indra OCR 2,000 萬美元，與 Datalab 競爭者一律需付費授權）。v2.2（2026-11）分 no_ocr、fast、balanced、vllm 四種模式：CPU 上用內建 ONNX 引擎、不必架 VLM 服務；GPU 上把表格、公式、CJK 與掃描頁交給 Surya 2.5。"
description: "Marker 2.x 導讀：四種轉換模式怎麼選、可選的 LLM 增強、Datalab 自報 benchmark 該怎麼讀，以及程式碼與模型權重分開的授權結構，和 MinerU、Docling 的分工。"
draft: false
series:
  name: "文件解析實戰"
  order: 10
---

> :globe: [English version](/posts/tech/2026-09-07-marker-document-parsing-en)

這個系列已經走過轉換層（[anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown)、[MarkItDown](/posts/ai/2026-04-18-markitdown-intro)）、抽取層（[PyMuPDF／pdfplumber／Tika](/posts/ai/2026-08-06-pdf-text-extraction-libraries)）、[三層框架](/posts/ai/2026-08-06-document-parsing-three-layers)、[掃描實測](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)，以及解析層的 [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing) 與 [Docling](/posts/tech/2026-09-06-docling-document-parsing)。這篇補上解析層第三個常被拿來比的工具：**Marker**。

[Marker](https://github.com/datalab-to/marker) 由 Datalab 開發，把 PDF、圖片、PPTX、DOCX、XLSX、HTML、EPUB 轉成 Markdown、JSON、HTML 或 RAG 用的 chunks，處理表格、表單、公式、行內數學、連結與程式碼區塊，並移除頁首頁尾。它和另外兩家的取捨很清楚：**Marker 把速度與 CPU 可用性放第一**，Docling 把結構化 JSON 與純 MIT 授權放第一，MinerU 把結構保留與本機文件庫放第一。本文以 2026-11 的 v2.2 為準。

## 它想解決什麼

官方的一句話是「快速且準確地把 PDF 轉成 Markdown 與 JSON」。Marker 2 是一次以速度為目標的重寫：先用 `pdftext` 讀 PDF 本來就有的文字層，只在需要的地方（亂碼或掃描頁、公式、信心低的表格）才叫 VLM，而不是每一頁都丟給 VLM 做 OCR。

這個設計對應一個常見的現實：多數企業 PDF 是電子原生的，文字層是好的，真正需要模型的只是少數頁面。把模型留給那些頁面，就能在 CPU 上跑出可用的速度。

## 核心能力

### 輸入與輸出

- **輸入**：`pip install marker-pdf` 處理 PDF；`marker-pdf[full]` 加上 DOCX、PPTX、XLSX、EPUB、HTML。
- **輸出**：Markdown、JSON、HTML、chunks；可擷取並保存圖片。
- **自訂**：可以替換 processor、renderer，或用 `TableConverter` 只抽表格。2.0 拿掉了原本的結構化抽取 converter，官方建議改用 `--use_llm` 或 Datalab 的付費 API。

### 四種轉換模式

v2.2 把模式擴成四種，不指定 `--mode` 時依硬體自動選：CUDA GPU 用 `balanced`，CPU 與 Apple Silicon 用 `fast`。

| 模式 | 做法 | 適合 |
|---|---|---|
| `no_ocr` | 只讀文字層，加上內建 Indra ONNX 做版面與閱讀順序，完全不跑 OCR | 電子原生 PDF、要最高 CPU 吞吐 |
| `fast` | Indra ONNX 做版面、閱讀順序與行／頁 OCR，不需要外部 VLM 服務 | CPU、Apple Silicon 的預設 |
| `balanced` | 乾淨的拉丁文字頁走 `pdftext` 加 ONNX；表格、公式、CJK 與非拉丁文字、掃描頁交給 Surya 2.5 VLM | GPU 的預設 |
| `vllm` | 每一頁都用 Surya 2.5 VLM 做整頁 OCR | 品質差的掃描件、公式密集、多語混排 |

中文文件要注意：`balanced` 會把 CJK 頁面送進 VLM，所以中文為主的文件實際上更接近 `vllm` 的速度與資源需求，CPU 上的 `fast` 則不會走 VLM。

### 可選 LLM 增強

`--use_llm` 讓 LLM 幫忙合併跨頁表格、處理行內數學、整理表單欄位。預設服務是 Gemini（`gemini-3.5-flash`），也可以換成 Claude、OpenAI 相容端點、Azure OpenAI、Vertex、OpenRouter 或本機 Ollama。這是 Marker 和 Docling、MinerU 最不一樣的地方：增強用的模型由你選，而不是綁在工具裡。代價是開了之後文件內容會送到你選的 LLM 服務。

### 部署與服務

- **環境**：Python 3.10 以上與 PyTorch；GPU、CPU、MPS 都能跑。
- **CLI**：`marker_single` 處理單檔，`marker` 處理資料夾（v2.2 加上 `--recursive` 與 `--skip_existing` 可續跑）；`--stdout` 直接輸出到標準輸出，方便接 agent 或 shell 管線；`--install_skill` 可安裝給 coding agent 用的 skill 檔。
- **服務與介面**：`marker_server` 提供 FastAPI REST 服務，`marker_gui` 是 v2.2 新的瀏覽器檢視器，可以疊圖看版面區塊、閱讀順序與各階段耗時，取代舊的 Streamlit 介面。

### 先前版本

v2.0（2026-07）是重寫的起點，當時分 `balanced`、`fast` 與 `--disable_ocr` 三條路，VLM 是 Surya OCR 2。v2.1（2026-10）把預設 VLM 換成 Surya 2.5（要回 Surya 2 可設 `SURYA_MODEL_CHECKPOINT=datalab-to/surya-ocr-2`）。v2.2 加上 Indra ONNX 引擎與 `vllm` 模式，CPU 路徑不再需要另外架推論服務。

## Benchmark 怎麼讀

Marker 的數字幾乎都由 Datalab 自己跑：

- **v2.0 公告**：在 Ai2 的 [olmOCR-bench](https://github.com/allenai/olmocr) 上，`balanced` 總分 76.0%，吞吐量是 MinerU 3.x `pipeline` 後端的 5 倍以上（單張 B200 上 2.9 對 0.54 頁／秒）。benchmark 是第三方的，但分數是 Datalab 自己跑的；[MarkTechPost 的整理](https://www.marktechpost.com/2026/07/24/datalab-marker-v2-vs-mineru-docling-and-liteparse-benchmark-breakdown/)也明寫這一點。比較對象是 MinerU 的舊 `pipeline` 後端，不是 MinerU 4 的 `standard` 檔位。
- **v2.2 公告**：在 Datalab 自己發布的 [OmniParseBench](https://huggingface.co/datasets/datalab-to/omni_parse_bench)（838 頁）上，`balanced` 88.9、`fast` 83.2，同表 Docling 74.9、PaddleOCR-VL 1.5 84.4。資料集與評分程式都出自 Datalab，屬於自家 benchmark。

好處是 repo 裡的 `benchmarks/` 可以重現這些數字，連競品的執行器都附上了；限制是文件組成與硬體都是他們選的。最可靠的做法是把這套 harness 拿來跑自己的文件。本系列[掃描實測](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)是 2026-08 用當時版本跑的，Marker 2.2 的新模式不在那次結果裡。

## 授權與商業使用

Marker 的授權分兩層，選型時要分開看：

- **程式碼**：Apache 2.0，可商用。
- **模型權重**：修改版 AI Pubs OpenRAIL-M，每個模型的 LICENSE 各自定門檻。`balanced`、`vllm` 用的 Surya 2.5（與 repo 的 `MODEL_LICENSE` 相同）：前一年營收或累計股權、債權募資超過 500 萬美元者，除個人與研究用途外需向 Datalab 購買授權。`no_ocr`、`fast` 用的 Indra OCR 權重門檻是 2,000 萬美元。兩份都另有一條：提供與 Datalab 競爭的產品或服務者不能使用。

最後一條常被忽略：如果你在做文件解析 SaaS，即使是小新創也可能落在限制內。四種模式都會用到模型權重（`no_ocr` 也要用 Indra 做版面），所以「程式碼是 Apache 2.0」不等於整套可以自由商用；只在 CPU 跑 `fast` 的團隊門檻較寬，要用 GPU 路徑就以 500 萬美元為準。

## 與 MinerU、Docling 的分工

| | Marker | [MinerU](/posts/tech/2026-09-05-mineru-ocr-doc-parsing) | [Docling](/posts/tech/2026-09-06-docling-document-parsing) |
|---|---|---|---|
| 授權 | 程式碼 Apache 2.0；權重有營收、募資與競爭者限制 | Apache 2.0 加附加條款（MAU 1 億／月營收 2,000 萬美元門檻、線上服務標示） | MIT；各 VLM preset 依其模型授權 |
| 主要輸出 | Markdown、JSON、chunks | Markdown、JSON 等九種渲染目標 | 結構化 JSON（`DoclingDocument`），可匯出 DocLang、DocTags |
| 速度與資源取捨 | 四種模式；CPU 有不跑 VLM 的路徑 | 四個檔位；`basic` 可在 CPU 跑 | 預設 pipeline 可純 CPU；另有多種 VLM preset |
| 特色 | LLM 增強可自選服務 | 本機文件庫與 agent 分頁讀取 | 輸入格式最廣（含音訊、郵件、專利與財報 XML） |

三者不是互相取代，而是解析層裡三條不同的取捨路徑。需要快、要在沒有 GPU 的機器上批次轉檔、能接受權重授權條件，Marker 最直接；授權要最乾淨，看 Docling；要讓 agent 在本機逐頁讀長文件，看 MinerU。

## 更新紀錄

- 2026-11-23：依 v2.1、v2.2 更新：四種轉換模式、Indra ONNX、Surya 2.5、`marker_gui` 與 agent 用 CLI 旗標；benchmark 改標為 Datalab 自報並補 OmniParseBench；補上模型權重授權的競爭者條款與 Surya、Indra 各自的門檻；修正 MarkTechPost 連結；中文版改為中文並修正系列名稱；移除查不到出處的 MCP server 與框架整合敘述。

## 參考資料

- [datalab-to/marker — GitHub](https://github.com/datalab-to/marker)：README、`MODEL_LICENSE`、`benchmarks/`
- [Marker v2.2.0 release note](https://github.com/datalab-to/marker/releases/tag/v2.2.0)：四種模式、Indra ONNX、OmniParseBench
- [Marker v2.1.0 release note](https://github.com/datalab-to/marker/releases/tag/v2.1.0)：Surya 2.5
- [Marker v2.0.0 release note](https://github.com/datalab-to/marker/releases/tag/v2.0.0) 與 [Datalab 部落格：Marker 2](https://www.datalab.to/blog/marker-2)
- [marker-pdf — PyPI](https://pypi.org/project/marker-pdf/)
- [Datalab Marker v2 vs MinerU, Docling, and Liteparse — MarkTechPost, 2026-07-24](https://www.marktechpost.com/2026/07/24/datalab-marker-v2-vs-mineru-docling-and-liteparse-benchmark-breakdown/)
- [olmOCR-bench — allenai/olmocr](https://github.com/allenai/olmocr)
- [OmniParseBench — Hugging Face](https://huggingface.co/datasets/datalab-to/omni_parse_bench)
- [surya-ocr-2.5 — Hugging Face](https://huggingface.co/datalab-to/surya-ocr-2.5)
