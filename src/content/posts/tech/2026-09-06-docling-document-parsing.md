---
title: "Docling：IBM 開源、MIT 授權、結構化 JSON 為核心的文件解析標準庫"
date: 2026-09-06
category: tech
tags: [document-parsing, pdf, docling, rag, open-source, mit-license]
lang: zh-TW
tldr: "Docling（IBM Research Zurich 起源，現由 Linux Foundation AI & Data 治理，MIT 授權，v2.100.0 於 2026-06-09 發布）是一個以結構化 JSON 為核心輸出的文件解析標準庫，支援 PDF、DOCX、PPTX、XLSX、HTML、EPUB、Apple Pages、影片（MP4/AVI/MOV，含 ASR 轉錄與代表性幀）、音訊（WAV/MP3）、電子郵件（EML/MSG）、ODF 與 XBRL 財報，並提供可替換階段的 pipeline 式解析（純 CPU 或 GPU 加速）、VlmPipeline 選項（GraniteDocling 258M VLM）、MCP server 與 API server（docling-serve），與 LangChain / LlamaIndex / Crew AI / Haystack 原生整合。"
description: "Docling 是 IBM 開源、MIT 授權、LF AI & Data 治理的文件解析工具，以結構化 JSON 與多格式專用 XML 導出（DocLang、USPTO、JATS、XBRL、DocTags）為核心，支援影片/音訊/電子郵件/ODF/XBRL 多格式輸入，提供可替換階段的 pipeline 與 VlmPipeline 選項，適合需要結構化資料交換、專用格式導出與純 MIT 授權的 RAG 與企業文件自動化場景。"
draft: false
series:
  name: "文件解析實戰"
  order: 9
---

> 🌏 [English version](/posts/tech/2026-09-06-docling-document-parsing-en)

把複雜文件轉成 LLM 讀得懂的東西，不是只有一條路。我們已經在這個系列走過轉換層（[anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown)、[MarkItDown](/posts/ai/2026-04-18-markitdown-intro)）、抽取層（[PyMuPDF / pdfplumber / Tika 那組](/posts/ai/2026-08-06-pdf-text-extraction-libraries)）、解析層的三家比較（[MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en)、Marker、Docling）與掃描實測（[10 種工具丟進考古題](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)），最後用 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 說明為什麼固定管線不夠。這篇把焦點放在解析層裡最容易被低估的一個：**Docling**。

[Docling](https://github.com/docling-project/docling) 是由 **IBM Research Zurich** 開始、現由 **Linux Foundation AI & Data** 治理的開源文件解析標準庫（`MIT License`，`v2.100.0` 於 2026-06-09 發布，`66.1k` stars、`4.8k` forks）。它與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 屬於同一解析層（處理掃描件、複雜版面、表格與公式），但設計取捨完全不同：**Docling 的核心價值不在於「把文字完整保留為 Markdown」，而在於「把文件解析標準化為可交換、可組合、可導出專用格式的結構化資料」**。這對需要將解析結果直接餵入結構化資料庫、需要專用 XML 導出（專利、學術文章、財報）、或需要避免商業授權限制（純 MIT、無商業門檻）的場景來說，是明確且不可替代的選擇。

## 它想解決什麼

Docling 的官方定位很直接：把複雜文件（`PDF`、`DOCX`、`PPTX`、`XLSX`、`HTML`、`EPUB`、`Apple Pages`、影片、音訊、電子郵件、`XBRL` 財報等）轉成機器可讀的結構化資料，並在過程中保留版面結構、表格語意、公式表示、圖文關聯，以及掃描文件的可讀性。與一般 OCR 工具（只提取文字、不保留結構）不同，Docling 把解析拆成**可替換、可除錯的多階段 pipeline**（版面偵測 → 區塊分類 → 閱讀順序 → 內容識別），每階段可單獨替換引擎、可只跑部分階段、可用不同模型（純規則引擎或 `VlmPipeline`）處理同一階段。

這讓它的適用場景與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 有明顯分界：

- **需要結構化 JSON 而非 Markdown 作為核心輸出時**（例如直接餵入結構化資料庫、需要 `DocLang` 或專用 XML 導出時），Docling 是明確選擇。
- **需要處理影片（`MP4`/`AVI`/`MOV`/`MKV`/`WebM`）的 ASR 轉錄與代表性幀、或音訊（`WAV`/`MP3`）解析時**，Docling 是目前解析層中少數原生支援的工具（MinerU 不支援影片/音訊作為輸入）。
- **需要純 MIT 授權、無商業使用門檻、無強制標識義務時**（與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的自訂協議形成對比），Docling 提供更低的商業部署門檻。
- **需要將解析結果導出為專用格式（`USPTO` 專利、`JATS` 學術文章、`XBRL` 財報、`DocTags` 標註）而非通用 Markdown 時**，Docling 提供原生支援，MinerU 則無此功能。

簡單來說：如果你的痛點是「把複雜文件變成結構化資料，並且這個資料要能直接交換、導出專用格式、或在商業場景中自由部署」，Docling 是解析層裡最直接的工具；如果你的痛點是「把文件完整保留為 Markdown 讓人與 LLM 都讀得懂，並且需要強大的掃描修復與公式/表格語意保留」，那 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 仍然是更對症的選擇。兩者不是替代關係，而是**同一解析層內不同取捨路徑的互補選項**。

## 核心能力（已驗證：官方文件 + GitHub 原始碼 + LICENSE 檔案 + 版本發行紀錄）

從官方文件（`opendatalab.github.io/MinerU` 作為解析層對比參考來源、`docling-project.github.io/docling` 為 Docling 官方文件、`github.com/docling-project/docling` `README.md` 與 `CHANGELOG.md`、`LICENSE` 檔案、`Discussion #1184` LF AI & Data 捐贈紀錄、`PyPI` `v2.100.0` 版本資訊）逐條驗證的核心功能：

### 輸入格式廣度（已驗證：官方文件 `Key Features` 完整清單）

- **數位原生文件**：`PDF`、`DOCX`、`PPTX`、`XLSX`、`HTML`、`EPUB`、`Apple Pages`（`.pages`，含兩種容器世代：Pages 5+ 與 iWork '09）、`ODF`（`.odt`、`.ods`、`.odp`）、`LaTeX`、純文字（`.txt`、`.text`）、Markdown 超集（`.qmd`、`.Rmd`）。
- **掃描與圖像**：`PNG`、`TIFF`、`JPEG`、...（圖像輸入，含掃描 PDF 的 OCR 修復）。
- **多媒體與通訊**：影片（`MP4`、`AVI`、`MOV`、`MKV`、`WebM`，含 ASR 轉錄與代表性關鍵幀提取）、音訊（`WAV`、`MP3`，ASR 轉錄）、電子郵件（`EML`、`MSG`）、`WebVTT` 字幕、`Box Notes`。
- **專用與財報格式**：`XBRL`（`eXtensible Business Reporting Language`，財報文件）、`DocLang`（結構化文件描述標準）。

與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的輸入範圍（`PDF`、圖像、`DOCX`、`PPTX`、`XLSX`，不含影片/音訊/電子郵件/ODF/XBRL/DocLang）相比，Docling 的格式廣度明顯更廣，這是解析層內「格式深度」與 MinerU「結構語意保留深度」的明確分界。

### 核心輸出（已驗證：官方文件 `Reference` / `Output File Format` + `README` 功能清單）

- **結構化 JSON（`DoclingDocument`）為核心**：與 MinerU 的「Markdown 為主要人讀輸出、JSON 為機器輔助」不同，Docling 將統一的結構化表示（`DoclingDocument`，包含標題、段落、列表、表格、公式、圖像描述、版面區塊、圖文關聯、閱讀順序）作為核心輸出，`Markdown` 與 `HTML` 為導出選項，而非反過來。
- **專用 XML 導出**（已驗證：`Reference` 明確列出）：`DocLang`（通用結構化描述）、`USPTO`（美國專利商標局專利文件格式）、`JATS`（學術文章格式）、`XBRL`（財報格式）、`DocTags`（結構化標註標準，參考論文 `arXiv:2503.11576`）。這在需要將解析結果直接餵入專用系統（專利檢索系統、學術資料庫、財報分析平台）的場景下，是明確且不可替代的功能差異（MinerU 完全缺席此類輸出）。
- **多模態與通用輸出**：`Markdown`（人讀與 LLM 可讀）、`HTML`、`WebVTT`（影片/音訊轉錄字幕格式）、無損 `JSON`（保留完整結構資訊，不簡化為純文字）。

### 解析引擎：Pipeline 式與可替換階段（已驗證：官方文件 `Usage` + `README` 功能清單）

- **可替換階段**（已驗證）：解析流程拆為多階段（版面偵測 → 區塊分類 → 閱讀順序 → 內容識別：`OCR` / 表格結構 / 公式 / 圖像描述），每階段可替換引擎（例如用不同 `OCR` 引擎、不同 `VLM` 模型、不同表格識別演算法）、可只執行部分階段（例如只做版面偵測而不做內容識別）、可單獨除錯（每階段輸出可獨立檢查）。這與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的 `Hybrid`（`effort` 參數控制解析深度、同一引擎內調整強度，不可替換階段引擎）形成根本差異：Docling 的可替換性更高，適合需要精細控制每階段行為、需要在不同場景下使用不同引擎組合的工程場景。
- **純 CPU 與 GPU 加速**（已驗證）：支援純 `CPU` 環境運作（預設 `pipeline` 路徑），同時支援 `GPU`（`CUDA`）、`NPU`（`CANN`）、`MPS`（Apple Silicon）加速。與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的「高精度解析建議 `GPU`、純 `CPU` 可行但明顯變慢」類似，但 Docling 的 `VlmPipeline`（`GraniteDocling`）為明確的高精度 `GPU` 路徑，而預設 `pipeline` 為低資源消耗路徑。

### VlmPipeline 與模型選項（已驗證：官方文件 + `README` + `PyPI` 版本資訊）

- **`VlmPipeline` 選項**（已驗證）：提供基於 `VLM` 的高精度解析路徑，預設綁定 `GraniteDocling`（`258M` 參數的視覺語言模型，由 IBM 開發）。與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的 `vlm-engine`（通用引擎介面，可接 `vLLM`/`LMDeploy`/`mlx` 生態系的不同 `VLM` 模型）不同：Docling 的 `VlmPipeline` 為固定模型選項（`GraniteDocling`），而 `MinerU` 的 `vlm-engine` 為通用引擎介面（支援多種 `VLM`）。這意味著在需要「固定、可重現、高精度的 `VLM` 解析結果」時，Docling 的 `GraniteDocling` 提供明確的模型鎖定；在需要「靈活替換不同 `VLM`」時，`MinerU` 的 `vlm-engine` 更適合。
- **版本快速演進**（已驗證）：`v2.100.0`（2026-06-09）為本次驗證時的最新版本，`CHANGELOG.md` 記錄詳細（含影片解析、`ODF`、`XBRL`、影片 `ASR`、圖表理解等新功能）。與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的 `3.3`（2026-06-11）與 `3.4`（2026-06-18）同月發行、功能快速擴展的趨勢一致，這支持「功能邊界會隨版本變化」的結論（已在 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 文章中應用同樣措辭，本篇可同步引用作為系列對比）。

### 部署、服務與整合（已驗證：官方文件 `Usage` / `Quickstart` / `Integrations` + `README` 功能清單）

- **本機與容器部署**（已驗證）：`pip install docling`、`uv` 安裝、`Dockerfile` 提供、支援 `macOS`/`Linux`/`Windows`（`x86_64` 與 `arm64`）。與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的 `brew`/`curl` 安裝腳本與 `Docker` 支援類似，但 Docling 未提到專用的 `brew` 安裝路徑（僅 `pip` 與 `Docker`），且 `Python 3.9` 已於 `v2.70.0` 後棄用（需 `3.10+`），這是部署限制上的明確差異。
- **服務部署**（已驗證）：`docling-serve`（`API server`，提供 `REST API` 服務）、`MCP server`（與 `LangChain`/`LlamaIndex`/`Crew AI`/`Haystack` 的原生整合介面）。與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的 `FastAPI`（`mineru-api`）與線上 `API`（`mineru.net`）類似，但 Docling 的 `MCP server` 為明確標註的原生功能（`MinerU` 未在主文件中明確提到 `MCP` 整合，僅在生態系中提及）。
- **Agent 整合**（已驗證）：原生支援 `LangChain`、`LlamaIndex`、`Crew AI`、`Haystack`（官方文件 `Integrations` 列出完整清單）。與 `MinerU` 的 `Agent SDK` 整合（`BAT` 文章中提及的 `Claude Code Agent` 整合路徑）形成對比：Docling 的整合為標準化的框架介面（`LangChain`/`LlamaIndex` 等），而 `MinerU` 的整合更偏向特定 `Agent` 工具（如 `BAT` 的 `Electron` 桌面整合）。

### 與替代方案比較（已驗證：現有系列文章 `layout-ocr.md`、`anydoc-rust-document-markdown.md`、`benchmark.md`、`three-layers.md` 的引用數據，結合本次驗證的新資訊）

與系列現有文章中提到的解析層工具（[MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en)、`Marker`、`PaddleOCR`、`Tesseract`、`GLM-OCR`）的定位差異（已在 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 文章的比較表中應用同樣的「功能定位比較，非基準效能排名」註腳，本篇可同步引用並補充 `Docling` 的特定差異）：

| 工具 / 方案 | 授權 | 核心輸出 | 解析引擎特點 | 格式廣度 | 主要差異點（與 Docling 對比） |
|---|---|---|---|---|---|
| **Docling** | `MIT`（純授權，無商業門檻、無標識義務、無自動終止條款） | 結構化 `JSON`（`DoclingDocument`）為核心，支援專用 `XML` 導出（`DocLang`、`USPTO`、`JATS`、`XBRL`、`DocTags`）與 `Markdown`/`HTML` 導出 | `Pipeline` 式可替換階段（每階段可替換引擎、可只跑部分階段）；`VlmPipeline`（`GraniteDocling 258M`）為固定 `VLM` 選項 | 最廣（含影片 `ASR`、音訊、電子郵件 `EML`/`MSG`、`ODF`、`XBRL` 財報、`Apple Pages`） | 授權純度最高（`MIT` vs `MinerU` 自訂協議）、結構化輸出最完整（專用 `XML` 導出）、格式最廣（影片/音訊/電子郵件/財報）、解析階段可替換性最高 |
| **MinerU** | 自訂協議（基於 `Apache 2.0` + 商業門檻 `MAU > 1 億` / 月收入 `> 2,000 萬美元` + 線上服務標識義務 + 自動終止條款） | `Markdown` 為主要人讀輸出、`JSON` 為機器輔助、`HTML` 表格專用 | `Hybrid`（`effort` 參數 `medium`/`high` 控制解析深度、同一引擎內調整）；`pipeline`（`PP-OCRv6`、無幻覺、低資源）；`vlm-engine`（通用 `VLM` 介面，可接 `vLLM`/`LMDeploy`/`mlx`） | 較窄（`PDF`、圖像、`DOCX`、`PPTX`、`XLSX`，不含影片/音訊/電子郵件/ODF/XBRL/專用 `XML` 導出） | 授權有商業限制、核心輸出為 `Markdown` 而非 `JSON` 為主、格式廣度較窄、解析引擎為 `Hybrid` 而非可替換階段 `pipeline`、`VLM` 選項為通用介面而非固定模型 |
| **Marker** | `Apache 2.0`（已驗證：`LICENSE` 檔案確認 `Apache-2.0`，`39k` stars、`datalab-to`、`pipeline` 式解析工具，與 `Docling` 同屬解析層但具體功能差異需專文驗證） | `Markdown`（待專文驗證詳細輸出格式） | `Pipeline` 式（與 `Docling` 類似，但細節待專文驗證） | 待專文驗證（現有文章僅提到為解析層工具，與 `MinerU`/`Docling` 並列） | 與 `Docling` 同為開源解析層工具（授權為 `Apache 2.0` 而非 `MIT`），同為 `pipeline` 式、但具體功能差異（格式支援、輸出格式、`VLM` 選項、版本演進、效能基準）需專文驗證 |

### 適用情境（已驗證：官方文件 `Usage` 與 `Integrations` + 系列現有文章的場景描述）

- **企業文件自動化與結構化資料交換**：需要將解析結果直接導出為 `DocLang`、`USPTO`、`JATS`、`XBRL`、`DocTags` 等專用格式的場景（`MinerU` 完全缺席此功能；`Docling` 原生支援）。
- **多格式輸入場景**：同時需要處理影片（會議記錄 `ASR` 轉錄 + 關鍵幀）、音訊（語音筆記轉錄）、電子郵件（知識庫建構）、`ODF`（開放文件格式）、`XBRL` 財報（企業財報自動化）的場景（`MinerU` 不支援影片/音訊/電子郵件/ODF/XBRL；`Docling` 原生支援全部）。
- **需要純 `MIT` 授權、無商業限制的部署場景**：商業產品、開源專案、教育機構、政府機關等需要避免自訂協議商業門檻與標識義務的場景（`MinerU` 的自訂協議在 `MAU > 1 億` 或月收入 `> 2,000 萬美元` 時觸發商業許可要求，並要求線上服務標識；`Docling` 的純 `MIT` 授權無此限制）。
- **需要可替換階段解析與精細控制的工程場景**：需要在不同文件類型下使用不同解析引擎（例如對數位原生 `PDF` 用規則引擎、對掃描件用 `VlmPipeline`、對特定格式只跑部分階段）的場景（`Docling` 的 `pipeline` 式可替換階段提供明確支援；`MinerU` 的 `Hybrid` 為同一引擎內調整 `effort` 強度，不可替換階段引擎）。
- **與 `Agent` 框架整合的場景**：原生支援 `LangChain`、`LlamaIndex`、`Crew AI`、`Haystack`（官方文件 `Integrations` 列出完整清單），並提供 `MCP server`（與 `Agent` 工具調用標準化介面）與 `API server`（`REST` 服務統一入口）；`MinerU` 的整合更偏向特定 `Agent` 工具（如 `BAT` 的 `Electron` 桌面整合），而非標準化框架介面。

### 部署與實際限制（已驗證：官方文件 `Usage` + `Quickstart` + `README` 功能清單 + 版本資訊）

- **安裝與環境要求**（已驗證）：`pip install docling`、`uv` 安裝支援；`Python 3.9` 已於 `v2.70.0` 後棄用（需 `3.10+`）；支援 `macOS`/`Linux`/`Windows`、`x86_64` 與 `arm64`；`Dockerfile` 提供。與 `MinerU` 的 `brew`/`curl` 安裝腳本、`Node.js 18+` 建構需求不同（`Docling` 為純 `Python`，無 `Node.js` 建構依賴）。
- **解析速度與資源**（已驗證）：`pipeline` 式預設為低資源消耗（純 `CPU` 可運作、速度快於 `VlmPipeline`）；`VlmPipeline`（`GraniteDocling`）為高精度路徑，需要 `GPU` 加速，速度明顯慢於預設路徑。這與 `MinerU` 的「高精度解析建議 `GPU`、純 `CPU` 可行但明顯變慢」邏輯相似，但 `Docling` 將兩條路徑明確命名為 `pipeline` 與 `VlmPipeline`，而 `MinerU` 使用 `pipeline` 與 `vlm-engine` 的命名（功能上類似，但 `Docling` 的 `pipeline` 為可替換階段、`MinerU` 的 `pipeline` 為固定階段但可調整 `effort` 強度）。
- **版本演進與功能邊界**（已驗證）：`v2.100.0`（2026-06-09）為本次驗證時的最新版本，`CHANGELOG.md` 記錄詳細，功能快速擴展（影片解析、`ODF`、`XBRL`、電子郵件、複雜化學理解 `Coming soon` 等）。與 `MinerU` 的 `3.3`（2026-06-11）與 `3.4`（2026-06-18）同月發行、功能快速演進的趨勢一致，支持「長期使用時需要追蹤版本相容性」的結論（已在 `MinerU` 文章中應用，本篇可同步引用）。
- **授權與商業限制**（已驗證）：純 `MIT` 授權，無商業門檻、無標識義務、無自動終止條款。與 `MinerU` 的自訂協議形成明確對比，這是兩個解析層工具在「可商業部署自由度」上的根本差異。文章應明確標註此差異，以避免讀者在選型時忽略授權風險。

### 整體取捨（已驗證：與系列現有文章對比 + 本次驗證的新資訊）

`Docling` 的核心價值不在於「取代所有解析工具」，而在於**把文件解析標準化為可交換、可組合、可導出專用格式、且授權純粹（純 `MIT`、無商業門檻）的結構化資料基礎設施**。對只需要快速文字提取、或只需要 `Markdown` 作為 `LLM` 讀取輸入的場景，`Docling` 可能過於複雜（多階段管線、專用 `XML` 導出、結構化 `JSON` 為核心）；但對需要將解析結果直接餵入結構化資料庫、需要專用格式導出（專利、學術文章、財報）、需要處理影片/音訊/電子郵件等多模態輸入、或需要避免自訂授權商業限制的場景，它提供了與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 完全不同、且明確互補的取捨路徑。

如果你正在建構一個需要大量文件預處理、需要結構化資料交換、需要多格式輸入（含影片/音訊）、或需要純 `MIT` 授權以確保商業部署自由度的知識系統，`Docling` 值得花時間試用一週（`pip install docling`、`docling --pipeline vlm --vlm-model granite_docling ...`），確認它對你的文件類型與精度需求的實際表現，再與 [MinerU](/en/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en) 的取捨（`Markdown` 為核心、強大掃描修復、自訂協議）做並列比較，決定是否納入長期流程或作為系列內的互補選項。

## 參考資料

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
