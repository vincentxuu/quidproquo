---
title: "MinerU：從 PDF 到結構化 Markdown 的文件解析引擎"
date: 2026-09-05
category: tech
tags: [ocr, pdf, mineru, document-parsing, rag, open-source]
lang: zh-TW
tldr: "MinerU 是 OpenDataLab 的開源文件解析引擎。4.0（2026-09）把 3.x 的 pipeline／vlm／hybrid 後端改成 flash／basic／standard／advanced 四個品質檔位，輸入擴大到 Office、OpenDocument、EPUB、OFD、HTML，並加上給 agent 逐頁讀取的本機文件庫；授權仍是有商業門檻的 MinerU Open Source License。"
description: "MinerU 4.x 導讀：四個解析檔位、原生多格式解析、本機文件庫與 agent 讀取、硬體需求、授權門檻，以及它在 RAG 前處理中的適用範圍。"
draft: false
series:
  name: "文件解析實戰"
  order: 8
---

> :globe: [English version](/posts/tech/2026-09-05-mineru-ocr-doc-parsing-en)

要把學術論文、內部 PDF 報告或掃描合約丟進 RAG，第一個卡關的通常不是向量化，而是文件解析：文字被切斷、表格變成亂序段落、公式變亂碼、掃描圖讀不出來。

[MinerU](https://github.com/opendatalab/MinerU) 是 OpenDataLab 開源的文件解析引擎，目標是把 PDF、圖片與 Office 文件轉成保留表格、公式、閱讀順序的 Markdown 與結構化資料。它不是單純的 OCR，而是從版面偵測到文件結構的整條管線。2026 年 9 月的 4.0 是一次大改版，本文以目前的 4.2 系列為準，3.x 的做法放在「先前版本」一段帶過。

## 它想解決什麼

MinerU 起源於 [InternLM](https://internlm.org/) 的預訓練資料準備：團隊要把大量科學文獻轉成乾淨語料，而現有工具在公式、表格、圖文混排上不穩定。所以它的設計目標一直是「保留結構」而不是「抽出文字」：表格保留成 HTML、公式保留成 LaTeX、段落維持閱讀順序。

4.0 之後，它再往前一步：不只是轉檔工具，而是一個本機文件庫，讓 agent 可以分頁讀、搜尋、引用某一頁的某個區塊。

## 核心能力

### 輸入與輸出

- **輸入**：PDF、圖片、DOC／DOCX、PPT／PPTX、XLS／XLSX、RTF、ODT／ODS／ODP、EPUB、OFD、HTML／MHTML、CSV／TSV。純文字檔（`.txt`、`.md`）直接讀，不解析。
- **限制**：只有 PDF 與圖片能用全部四個檔位；Office、OpenDocument、EPUB、OFD、HTML 一律在本機以 `flash` 檔位原生解析（由 MIT 授權的 [DocVortex](https://github.com/myhloli/docvortex) 處理，不轉 PDF、不下載模型）。
- **輸出**：同一份文件模型可渲染成九種目標：Markdown、HTML、LaTeX、DOCX、EPUB、PDF、Structured Content，以及 Content List V1／V2。各個 CLI 與 API 入口只開放其中一部分。

### 四個解析檔位

| 檔位 | 做什麼 | 適合 |
|---|---|---|
| `flash` | 不跑推論模型，直接讀 PDF 文字層與電子文件 | 預覽、建索引；不當最終閱讀品質 |
| `basic` | 小模型做 OCR、公式、表格，可在 CPU 跑 | 隱私敏感、資源有限的本機解析 |
| `standard` | 小模型加 VLM 處理複雜版面（預設） | 一般閱讀與複雜文件 |
| `advanced` | 與 standard 同一組模型，但花更多推論算力 | 困難文件、願意等的場合 |

小模型（版面、OCR、公式、表格）可選 ONNX 或 Torch；VLM 引擎可選 llama.cpp、vLLM、LMDeploy 或 mlx，兩者分開設定。`standard` 用的 VLM 是 MinerU2.5-Pro（1.2B），模型層的細節見[解析層模型篇](/posts/ai/2026-08-06-document-parsing-layout-ocr)。

### 本機文件庫與 agent 讀取

- `mineru parse`、`read`、`search`、`find`、`watch`、`scan` 一組指令，解析結果會快取在本機。
- `mineru parse` 預設只讀 PDF 前 10 頁，回傳續讀指令，長文件逐頁讀，不一次塞進 context。
- `doc:{id}/tier:{tier}/page:{page}/block:{block}` 這類定位符可以回頭讀某一頁、匯出某個區塊的圖片，當成可驗證的引用。

### 部署與服務

- **本機優先**：預設全程本機解析，只有明確加 `--remote` 才會上傳到官方服務。
- **硬體**：基礎套件就能跑 ONNX 小模型（CPU）加 llama.cpp VLM。4.1 起會自動挑 Intel、AMD、NVIDIA 或 Apple Silicon 的 GPU，官方說代表性推論約為 CPU 的 2～3 倍。
- **服務**：Python SDK、`mineru-kit parse` 批次轉換、多服務 Router 與 Gradio WebUI 共用同一套結構化結果；HTTP 服務是 V1 API（4.1 起以 `/v1/tasks` 為主）。
- **4.2 補強**：WebUI 點原文區塊就能對到解析結果（反過來也行）、利用 Tagged PDF 的結構資訊改善閱讀順序、本機文件庫的 HTTP 介面改成要帶 Bearer Token、URL 輸入加了 SSRF 防護。

### 先前版本（3.x）

3.x 用 `pipeline`、`vlm`、`hybrid` 三種後端切換，CLI 是 `mineru -p input.pdf -o output`。4.0 把後端選擇換成檔位，入口改成 `mineru parse` 或 `mineru-kit parse`，設定檔從 `mineru.json` 換到 `$MINERU_HOME/config.yaml`，舊的 `/file_parse` 與 `/tasks` HTTP 介面移除。照舊教學操作前先看官方的 [3.x → 4.0 遷移指南](https://opendatalab.github.io/MinerU/reference/migration_4/)。

## 與替代方案比較

下表是功能定位比較，不是同一基準下的效能排名：

| 工具 | 核心定位 | 結構化輸出 | 授權 | 適合場景 |
|---|---|---|---|---|
| **MinerU** | PDF／圖片 → 結構化 Markdown 與 JSON；Office 類走原生解析 | 高（表格 HTML、公式 LaTeX、九種渲染目標） | MinerU Open Source License（Apache 2.0 加商業門檻） | RAG 前處理、訓練語料、agent 讀長文件 |
| **[Docling](/posts/tech/2026-09-06-docling-document-parsing)** | 結構化 JSON（`DoclingDocument`）為核心 | 高（DocLang、DocTags 匯出；可讀入 USPTO、JATS、XBRL 等專用 XML） | MIT | 結構化資料交換、需要寬鬆授權 |
| **[Marker](/posts/tech/2026-09-07-marker-document-parsing)** | 速度優先的 Markdown／JSON 管線 | 中高 | 程式碼 Apache 2.0，模型權重另有門檻 | CPU 批次、快速轉檔 |
| **PaddleOCR／Tesseract** | 文字辨識為主 | 低（結構要自己補） | Apache 2.0 | 只要文字的掃描件 |

MinerU 的定位不是「最強 OCR」，而是把文件解析成機器可讀的結構。只要從一張發票抽文字，輕量 OCR 就夠；要把整份論文或技術手冊轉成 LLM 能檢索的資料，表格、公式與閱讀順序的保留才值回成本。

## 適用情境

### RAG 前處理與知識庫建構

把 PDF 報告、產品手冊轉成結構化 Markdown 與 JSON 再進向量資料庫。先用代表性樣本驗證解析品質，再決定切塊與索引策略。

### LLM 訓練資料清洗

結構化結果帶版本化 schema，資料工程可以在「原始解析」與「最終語料」之間做可追溯的篩選，而不是直接把 PDF 壓成純文字。

### Agent 讀長文件

4.0 的文件庫與定位符讓 agent 可以分頁讀、搜尋、回頭引用某個區塊，適合合約、規格書這類需要逐段核對的文件。

### 掃描文件數位化

對敏感合約或歷史檔案，`basic` 檔位可以在沒有 GPU 的機器上本機完成 OCR，原件不用先交給第三方。

## 部署與實際限制

- **Python 版本**：4.1 起需要 Python 3.11～3.14。
- **硬體門檻**：`basic`（ONNX）約 0.8 GB 模型、2 GB 記憶體即可；`standard`／`advanced` 約 2～3 GB 模型、8～16 GB 記憶體，CPU 能跑但官方建議有 Vulkan 或 8 GB 以上 VRAM 的 GPU。AMD 與其他廠商加速器的舊適配只留在 `mineru<4`。
- **格式不等於品質**：Office、EPUB 等格式只走 `flash` 原生解析，內嵌圖片裡的文字不會跑 OCR。
- **遙測**：本機文件庫的匿名使用遙測預設開啟（不含文件內容與檔名），可用 `mineru telemetry status` 查看並關閉。在意的話部署時先關。
- **破壞性變更頻繁**：4.0 與 4.1 都改過 HTTP API，服務端、Router、SDK 與客戶端要一起升級。長期使用要釘版本。
- **準確度要自己驗**：官方 benchmark 是特定測試集的結果，非英文、非標準排版、高度圖文混排的文件仍要逐份抽查。

## 整體取捨

MinerU 的價值在於把文件解析從「抽文字」提升到「保留結構」，4.0 之後又加上「讓 agent 分頁讀、可引用」這一層。只需要快速抽文字的場景，它太重；需要把複雜文件變成可檢索、可追溯的結構化資料，而且資料不能離開本機的場景，它是完整的開源選項。

授權是選型時要先看的：[MinerU Open Source License](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md) 以 Apache 2.0 為底，但你和關聯企業合計 MAU 超過 1 億或月營收超過 2,000 萬美元時要另取商業授權；以 MinerU 對外提供線上服務要在介面或公開文件標明；違反這兩條授權自動終止。多數團隊碰不到門檻，但標示義務人人都有。

## 更新紀錄

- 2026-11-23：依 MinerU 4.0～4.2 改寫：四個解析檔位取代 pipeline／vlm／hybrid、輸入格式擴大、九種輸出、本機文件庫與 agent 讀取、Python 3.11～3.14、遙測預設開啟；3.x 降為「先前版本」段；移除 4.x 文件未再宣稱的「109 種語言」；中文版補回完整內容。

## 參考資料

- [opendatalab/MinerU — GitHub](https://github.com/opendatalab/MinerU)：README、各版 release note
- [MinerU 4.0.0 release note](https://github.com/opendatalab/MinerU/releases/tag/mineru-4.0.0-released)：檔位、格式、文件庫、遷移
- [MinerU 4.1.0 release note](https://github.com/opendatalab/MinerU/releases/tag/mineru-4.1.0-released)：GPU 自動加速、Tasks API、Python 3.11～3.14
- [MinerU 4.2.0 release note](https://github.com/opendatalab/MinerU/releases/tag/mineru-4.2.0-released)：WebUI 溯源、Tagged PDF、Bearer Token
- [MinerU 官方文件](https://opendatalab.github.io/MinerU/)：[檔位與執行環境](https://opendatalab.github.io/MinerU/usage/tiers/)、[輸出格式](https://opendatalab.github.io/MinerU/reference/output_files/)、[3.x → 4.0 遷移](https://opendatalab.github.io/MinerU/reference/migration_4/)
- [MinerU Open Source License（LICENSE.md）](https://github.com/opendatalab/MinerU/blob/master/LICENSE.md)
- [MinerU2.5-Pro-2605-1.2B — Hugging Face](https://huggingface.co/opendatalab/MinerU2.5-Pro-2605-1.2B)：standard 檔位使用的 VLM
- [DocVortex — GitHub](https://github.com/myhloli/docvortex)：Office 等格式的原生解析引擎（MIT）
