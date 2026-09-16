---
title: "商業文件解析 API 橫評：專用 Parser、通用 VLM、三大雲，交叉點在哪？"
date: 2026-09-16
category: ai
type: deep-dive
tags: [document-parsing, commercial-api, cohere-parse, llamaparse, azure-document-intelligence, google-document-ai, aws-textract, reducto, vision-language-model, rag, enterprise]
lang: zh-TW
tldr: "商業文件解析分三條路線：專用 Parser（Cohere Parse $1.50/千頁、LlamaParse Agentic Plus 90.2%）、三大雲 Prebuilt（Azure/Google/AWS，結構化欄位抽取）、直接用通用 VLM（Fable 5.1 在 ParseBench 拿 78.92，圖表理解碾壓專用 parser，但每頁成本 3-16 倍且會幻覺）。10 萬頁/月純 OCR 各家都 ~$150，加表格後 AWS 跳到 $1,500、用 Claude Sonnet 5 跑要 $900。選型的第一個問題不是「哪家最準」，是「你要轉錄還是理解」。"
description: "比較專用文件 Parser（Cohere Parse、LlamaParse、Reducto）、三大雲服務（Azure DI、Google Doc AI、AWS Textract）、通用 VLM（Claude、GPT、Gemini）三條路線的定位、定價與能力維度，延續文件解析實戰系列的三層階梯框架。"
draft: false
series:
  name: "文件解析實戰"
  order: 8
glossary:
  - term: "ParseBench"
    definition: "LlamaIndex 發佈的文件解析基準，約 2,000 頁人工校驗的企業文件，涵蓋表格、圖表、內容忠實度、語意格式化、視覺定位五個維度。"
    context: "目前商業 API 最常引用的橫向評測，但榜首 LlamaParse 正是發佈者自家產品。"
  - term: "Prebuilt Model"
    aliases: ["預建模型"]
    definition: "雲端廠商預先訓練好的文件解析模型，針對特定文件類型（發票、收據、身分證）做結構化欄位抽取，不需要使用者提供訓練資料。"
    context: "Azure 和 Google 的 prebuilt 覆蓋 20+ 種文件類型，是它們跟純解析 API 的主要區隔。"
---

> 🌏 [English version](/en/posts/ai/2026-09-16-commercial-document-parsing-api-comparison-en)

這個系列的前七篇全部在講開源方案：從[三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)的選型框架，到 [MarkItDown](/posts/ai/2026-04-18-markitdown-intro)、[anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown) 的轉換層，[PyMuPDF / pdfplumber](/posts/ai/2026-08-06-pdf-text-extraction-libraries) 的抽取層，[MinerU / Marker / Docling](/posts/ai/2026-08-06-document-parsing-layout-ocr) 的解析層，到 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 讓 agent 動態調度。結論都是同一句：**先選對層，再選工具**。

但企業場景有三個拉力，會把你從開源推向商業 API：

1. **不想養 GPU。** 解析層的開源工具都要 GPU——MinerU 建議 8GB+ VRAM，Docling 的 VlmPipeline 要更多。中小團隊不一定有 ML Ops 能力維護推論叢集。
2. **需要 SLA。** 開源工具沒有 uptime 保證、沒有客服。把它包成微服務自己跑，99.9% availability 是你的事。
3. **合規要求。** 金融、醫療、政府場景要 SOC 2、HIPAA、FedRAMP。三大雲的文件解析服務天生帶這些認證，開源方案得自己補。

這篇把商業方案分成三條路線——**專用文件 Parser**、**三大雲 Prebuilt 服務**、**直接用通用 VLM**——放回三層階梯的框架裡，比定價、比能力、算成本，最後給一張決策樹。

## 六家一覽

| | 定位 | 單價（每千頁） | 輸出 | 特色 | 主要限制 |
|---|---|---|---|---|---|
| **Cohere Parse v5** | 專用文件 VLM | API $1.50；Model Vault 依規格另計 | Markdown / Blocks | 2.3B 參數、成本最低級、可私有部署 | 無信心分數、不吐 JSON、圖表不在範圍 |
| **LlamaParse** | 多級 agentic 解析 | Fast $1.25 → Agentic Plus $56.25 | Markdown / JSON | 四級模式、ParseBench 84.9% 最高 | Agentic 模式單價 45 倍於 Fast |
| **Azure DI v4.0** | 雲端全功能 | Read $1.50、Prebuilt $10、Custom $30 | JSON（結構化欄位） | 20+ 種 prebuilt 文件模型、年約可降至 $0.53 | 功能疊加成本攀升快、圖表弱 |
| **Google Document AI** | GCP 生態整合 | OCR $1.50、Invoice $10、Custom $30 | JSON（結構化欄位） | Custom Extractor、Document AI Workbench | 表格精度六家最低（64.6%）、有 hosting 費 |
| **AWS Textract** | AWS 生態整合 | Text $1.50、Tables $15、Forms $50 | JSON（結構化欄位） | Analyze Lending（房貸封包，獨家）、Expense | Forms 單價最高、無 custom model 訓練 |
| **Reducto r-1** | 開發者導向 agentic | Parse $10、Extract $20、Deep Extract $40 | Markdown / JSON | 表格精度 90.2% 最高、citation grounding | ParseBench 整體 67.8%、平台較新 |

幾個值得注意的結構性差異：

**Cohere 和 LlamaParse 吐 Markdown**，設計目標是 RAG pipeline 的 ingestion——把文件轉成 LLM 讀得懂的純文字。**三大雲和 Reducto 吐結構化 JSON**，設計目標是欄位抽取——從發票裡拉出「供應商名稱」「金額」「日期」這些 key-value。

這不是小差異。如果你的場景是「把 PDF 丟進向量資料庫做語意搜尋」，Markdown 輸出直接能用；如果是「從一堆發票裡自動建帳」，結構化 JSON 省掉你寫 parser 的工。選錯輸出格式，下游的工程量差一個數量級。

## 其他值得注意的商業方案

六家之外，市場上還有幾個值得列入評估清單的：

| | 單價（每千頁） | 差異化 | 適合場景 |
|---|---|---|---|
| **Mistral OCR 4.1** | $4（即時）/ $1（batch） | 內建信心分數 + bounding box、手寫辨識 88.9%（優於 Azure 78.2%）、ParseBench 74.5 | batch 模式比 Cohere 更便宜且有信心分數 |
| **Upstage Document Parse** | $10-30 | TEDS 表格結構 93.48%、0.6 秒/頁 | 中日韓文件、需要極高表格精度 |
| **ABBYY Vantage** | $20-80（年約議價） | 30 年 OCR 經驗、on-prem 部署最成熟 | 金融保險大型 IDP 專案 |
| **Unstructured.io** | $15（含全 pipeline） | 不只 parser，是 ETL 平台（chunking + embedding + connector） | 需要一站式 ingestion pipeline |
| **Mathpix** | $10 | LaTeX 公式辨識獨強 | 學術論文、數學/科學文件 |
| **LandingAI ADE Gen2** | credit 制（約 1 credit/頁） | Agentic extraction、DocVQA 99.16% | 需要 agentic 欄位抽取 |
| **Nanonets / Docsumo** | $299-500+/月起 | no-code UI、內建 validation workflow | 小量體、需要人工覆核的中小企業 |

特別值得提的是 **Mistral OCR 4.1**：batch 模式 $1/千頁比 Cohere Parse ($1.50) 更便宜，而且有信心分數（Cohere 沒有）。ParseBench 整體 74.5 落後 LlamaParse Agentic（87.0），但成本是後者的 1/12。如果你的場景是大量文件的 batch ingestion、不追求極致精度，Mistral OCR 的 batch 模式可能是目前性價比最高的選項。

## 直接用通用 VLM 當 Parser

除了專用 parser，還有一條完全不同的路：直接把 PDF 頁面截圖，丟給 Claude、GPT、Gemini 這些通用 VLM，用 prompt 叫它轉成 Markdown 或 JSON。

這不是偷懶。依最新的 [ParseBench leaderboard](https://github.com/run-llama/ParseBench)（180+ 種 pipeline），通用 VLM 已經混進專用 parser 的排名裡：

| 排名 | 方案 | ParseBench 整體 | 類型 |
|---|---|---|---|
| 1 | LlamaParse Agentic Plus | **90.20** | 專用 parser |
| 2 | LlamaParse Agentic | 87.01 | 專用 parser |
| 3 | Pulse Ultra 2 | 81.60 | 專用 parser |
| 4 | LlamaParse Cost Effective | 80.61 | 專用 parser |
| 5 | **Anthropic Fable 5.1** | **78.92** | 通用 VLM |
| 6 | oi-parser | 78.30 | 專用 parser |
| 10 | Extend 2.0 | 75.33 | 專用 parser |

但 ParseBench 是企業文件（保險、金融、政府），難度有限。更嚴格的 [Dr.DocBench](https://arxiv.org/abs/2606.01393)（arXiv:2606.01393，2026-06，4,514 頁專家級文件、52 個科目）把前沿 VLM 壓到 60 分左右：

| 模型 | Dr.DocBench Overall | Table TEDS |
|---|---|---|
| GPT-5.5 | **61.94** | 48.90 |
| Claude Opus 4.6 | 60.19 | 49.21 |
| Gemini 3.1 Pro | 60.13 | 51.26 |
| MinerU 2.5（pipeline） | 54.37 | **55.85** |

兩個重要訊號：一，前沿 VLM 在專家級文件上叢聚在 60 分，沒有壓倒性領先者；二，pipeline 式的 MinerU 2.5 在 Table TEDS（55.85）上反而贏過所有通用 VLM——專用工具在表格結構上仍然更可靠。

Unstructured 在 2026-08 發佈的 [SCORE-Bench](https://unstructured.io/blog/frontier-models-are-strong-but-document-parsing-is-harder)（224 份真實文件）進一步拆解了差距：專用 pipeline 在複合指標上贏裸 VLM 4-16 個百分點，表格抽取最多落後 23 個百分點。而且幻覺率差異驚人——測試時的 Claude Opus 4.6 僅 0.044（跟 pipeline 平），但 GPT-5.2 達 0.167、Gemini 2.5 Pro 達 0.257。這些數字反映的是測試時使用的模型版本，新版本的幻覺率可能已改善，但「不同 VLM 家族的幻覺傾向差異很大」這個結論不變。

### VLM 的強項：圖表理解與彈性

ParseBench 的圖表維度裡，14 種專用 parser 中只有 4 家超過 50%，多數低於 6%。通用 VLM 在這個維度遠遠領先——它不只能「辨識」圖表裡的文字，還能「描述」圖表在表達什麼。這是專用 parser 做不到的事。

另一個優勢是**彈性**：用 prompt 就能調整輸出格式，不需要等 API 更新。今天要 Markdown、明天要 JSON、後天要「只抽出金額超過 10 萬的項目」——通用 VLM 都做得到，專用 parser 做不到。

### VLM 的弱項：成本、穩定性、幻覺

每頁成本差距巨大。一頁文件圖片約 1,750 input tokens、輸出約 500 tokens，依各家 2026-09 定價：

以下是一頁文件（~1,750 input + 500 output tokens）的成本，以專用 parser 為基準（2026-09 查詢）：

**專用 parser：**

| 方案 | 每千頁成本 |
|---|---|
| Mistral OCR batch | $1.00 |
| Cohere Parse v5 | $1.50 |

**通用 VLM：**

| 模型 | 每千頁成本 | 備註 |
|---|---|---|
| Gemini 3.8 Flash | ~$3 | 促銷價至 2026-12-31，届滿後約 $6 |
| Claude Haiku 4.5 | ~$4 | |
| Claude Sonnet 5 | ~$9 | |
| Gemini 3.1 Pro | ~$10 | Preview |
| Claude Opus 5 | ~$21 | |
| GPT-5.5 | ~$24 | |

用通用 VLM 做文件解析，成本是專用 parser 的 2-16 倍。

通用 VLM 的成本跨度很大。Gemini 3.8 Flash（~$3/千頁，促銷價至 2026 年底）是目前性價比最高的 VLM 選項，跟專用 parser 成本接近；Sonnet 5 和 Gemini 3.1 Pro（~$9-10/千頁）是精度和成本兼顧的主流選擇；Opus 5 和 GPT-5.5（~$21-24/千頁）精度最高但成本是專用 parser 的 14-16 倍。Batch API 可以打折（多數約半價），但頂級 VLM 依然比專用 parser 貴很多。

而且通用 VLM 有三個專用 parser 不會有的問題：

1. **輸出不穩定。** 同一頁文件跑兩次，Markdown 格式可能不同。表格有時用 `|` 分隔、有時用 HTML `<table>`。量產 pipeline 受不了這種不確定性。
2. **幻覺。** SCORE-Bench（2026-08，測試當時的模型版本）顯示 Gemini 的幻覺率達 0.257、GPT 達 0.167——每四到六頁就有一頁會「合理地」編造不存在的內容。Claude 系列幻覺率最低（0.044），但成本也最高。新版模型可能已改善，但幻覺風險是通用 VLM 的結構性弱點。
3. **沒有信心分數。** VLM 不會告訴你哪個欄位辨識不確定，你得自己設計品質檢查流程。

### 什麼時候用 VLM、什麼時候用專用 Parser

| 場景 | 用通用 VLM | 用專用 Parser |
|---|---|---|
| 圖表密集（技術手冊、研究報告） | ✅ 唯一能理解圖表的路線 | ❌ 圖表維度幾乎全軍覆沒 |
| 量少+異質性高（每月 < 1 萬頁） | ✅ 不值得串 pipeline | ❌ 過度工程 |
| 需要「理解」而非「轉錄」 | ✅ 可以問「這份合約的風險在哪」 | ❌ 只會轉成文字 |
| 大量同質文件（10 萬頁發票） | ❌ 成本 $900+/月（Claude Sonnet 5） | ✅ 成本 $150-1,500/月 |
| 需要結構化 JSON | ❌ 格式不穩定 | ✅ schema 固定 |
| 不能容忍幻覺 | ❌ 幻覺率 0.04-0.26（依模型） | ✅ 留空或標低信心 |
| 表格結構精度 | ❌ Dr.DocBench TEDS ~49-51 | ✅ MinerU 55.85、Reducto 90.2% |

### 務實做法：多模型路由

最聰明的做法不是二選一，而是分流：標準頁面走專用 parser（Cohere / Mistral OCR），複雜頁面（圖表、手寫、怪異版面）升級到 Gemini 3.8 Flash 或 Sonnet 5，只有真正困難的案例才動用 Opus 5 / GPT-5.5。這跟 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 的邏輯完全一致——讓 agent 根據頁面特性選路線，而不是一體適用。

依 Unstructured 的分析，專用 pipeline 的優勢不在模型更好，而在三層包裝：optimized prompting + post-processing + output enforcement。也就是說，如果你願意自己做這三層包裝，拿通用 VLM 當底層引擎是可行的——但那基本上就是在自建一個專用 parser。

## 按能力維度比較

### 表格

表格是文件解析的試金石。依 Reducto 發佈的 [RD-TableBench](https://reducto.ai/blog/parse-r-1-model)（1,000 張複雜表格），精度排名：

| 方案 | 表格精度 |
|---|---|
| Reducto r-1 | **90.2%** |
| Azure DI | 82.7% |
| AWS Textract | 80.9% |
| Cohere Parse 5（ParseBench Tables） | 87.0% |
| Google Document AI | 64.6% |

兩份 benchmark 用的資料集和計量方式不同，所以 Cohere 的 87.0（ParseBench）和 Reducto 的 90.2（RD-TableBench）不能直接比大小。但 Google 在兩份測試裡都是末段班，這個結論可以信。

### 圖表

依 [ParseBench](https://arxiv.org/abs/2604.08538) 的圖表維度，14 種方法裡只有 4 家超過 50%，多數專用 parser 低於 6%。Cohere Parse v5 明確不涵蓋圖表提取。如果你的文件裡有大量圖表（技術手冊、研究報告），目前最可靠的做法是用通用 VLM（Claude、GPT-5、Gemini）直接描述圖表內容——上面「直接用通用 VLM 當 Parser」那一節有詳細比較。

### 手寫辨識

三大雲都支援手寫文字辨識（Azure DI 和 Textract 明確列為功能），Mistral OCR 4.1 的手寫辨識精度達 88.9%（優於 Azure 的 78.2%）。Cohere、LlamaParse、Reducto 的文件裡沒有單獨提到手寫支援。如果你的場景包含手寫表單（醫療、保險理賠），Mistral OCR 和三大雲都是可選的。

### 多語言

| 方案 | 語言數 |
|---|---|
| LlamaParse | 100+ |
| Cohere Parse | 9 種商業語言 |
| Azure DI | 300+（Read OCR） |
| Google Document AI | 200+（OCR） |
| AWS Textract | 英/西/德/法/義/葡 |

Azure 和 Google 的 OCR 語言覆蓋最廣，但這是 OCR 層級的字元辨識，不等於結構化抽取也支援這麼多語言。Cohere 只訓練了 9 種語言，繁體中文是否在列需要確認。AWS Textract 的語言支援最少，非拉丁語系的場景要注意。

### 表單 Key-Value 抽取

**三大雲的核心優勢在這裡。** Azure DI 有 20+ 種 prebuilt model（發票、收據、身分證、合約、銀行對帳單、支票、稅表），Google Document AI 有類似的 specialized processor，AWS Textract 有獨家的 Analyze Lending（房貸封包自動化）和 Analyze Expense。

Cohere、LlamaParse 不做 KV 抽取——它們把文件轉成 Markdown，你拿去給 LLM 抽欄位。Reducto 的 Extract API 做結構化抽取，但沒有預建的文件類型模型，要自己定義 schema。

### 信心分數

| 方案 | 有信心分數 |
|---|---|
| Azure DI | ✅（每個欄位） |
| Google Document AI | ✅（每個欄位） |
| AWS Textract | ✅（每個欄位） |
| Mistral OCR | ✅（每個欄位 + bounding box） |
| Reducto | ✅（citation grounding） |
| LlamaParse | ❌ |
| Cohere Parse | ❌ |
| 通用 VLM | ❌ |

信心分數是企業場景的硬需求。沒有它，你不知道哪些頁需要人工覆核——要嘛全部人工看（成本爆炸），要嘛全部信任機器（品質失控）。Cohere 的技術文件明確沒有提供信心分數，這在高價值文件場景（合約、法律文書）是個顯著限制。

## 成本模型：10 萬頁/月

帳面單價只是起點。依場景不同，實際成本可以差 10 倍。

### 場景 A：純文字 OCR（單欄文件、不需要表格結構）

| 方案 | 月費 |
|---|---|
| LlamaParse Fast | $125 |
| Cohere Parse 5 | $150 |
| Azure DI Read | $150 |
| Google OCR | $150 |
| AWS Textract DetectText | $150 |

五家幾乎一樣。這個場景其實不該用商業 API——[抽取層](/posts/ai/2026-08-06-pdf-text-extraction-libraries)的 `pymupdf4llm` 零成本就能搞定。如果你堅持用通用 VLM 跑：Gemini 3.8 Flash 要 $300/月、Claude Sonnet 5 要 $900/月——花 2-6 倍的錢做同樣的事，而且多了幻覺風險。

### 場景 B：含表格的混合文件

| 方案 | 月費 | 類型 |
|---|---|---|
| Cohere Parse 5 | $150（表格包含在基本價） | 專用 parser |
| Mistral OCR batch | $100 | 專用 parser |
| LlamaParse Agentic | $1,250 | 專用 parser |
| Azure DI Prebuilt | $1,000 | 三大雲 |
| AWS Textract Tables | $1,500 | 三大雲 |
| Reducto r-1 Parse | $1,000 | 專用 parser |
| Gemini 3.8 Flash（VLM） | $300 | 通用 VLM |
| Gemini 3.1 Pro（VLM） | $1,000 | 通用 VLM |
| Claude Sonnet 5（VLM） | $900 | 通用 VLM |
| Claude Opus 5（VLM） | $2,100 | 通用 VLM |

差距拉開了。Cohere 和 Mistral OCR batch 在這裡最便宜，因為它們的基本價已包含表格——但代價是沒有結構化 JSON（Cohere 還沒有信心分數）。輕量 VLM（Gemini 3.8 Flash $300）成本接近但精度和穩定性都低一截；中階 VLM（Sonnet 5 $900、Gemini 3.1 Pro $1,000）開始有實用精度，但比專用 parser 貴 6-7 倍。如果你需要的是「把表格變成可用的 Markdown」，Cohere / Mistral batch 性價比最高；如果需要「從表格裡抽出特定欄位」，三大雲的 prebuilt 才是正解。

### 場景 C：發票/收據自動化（需要 KV 抽取）

| 方案 | 月費 |
|---|---|
| Azure DI Invoice Prebuilt | $1,000 |
| Google Invoice Parser | $1,000 |
| AWS Textract Expense | $1,000（前 1M 頁） |
| Reducto Extract | $2,000 |

三大雲在 prebuilt 場景幾乎同價。但 Azure 的年約承諾可以把 8M 頁/月的單價壓到 $0.53/千頁，大量體場景有顯著折扣。

### 隱藏成本

帳面價格之外，至少還有三項：

1. **失敗重試。** API 回傳 500 或 timeout 的頁面要重跑。依使用者社群回報，各家的失敗率大約在 0.5-2%，10 萬頁就是 500-2,000 頁重試成本。
2. **人工覆核。** 沒有信心分數的方案（Cohere、LlamaParse），你得另外設計品質抽檢流程。有信心分數的方案，低於閾值的頁面還是要人看——依 yololab 對 Cohere Parse v5 的分析，「每千頁便宜不等於每件核准便宜」，因為後端的人工覆核成本可能比 API 費用高。
3. **API 限流。** Google Document AI 的 processor 有 hosting 費（$0.05/小時），即使沒有請求也在跑錶。Azure 的 commitment tier 超額部分按 pay-as-you-go 計費。這些在 POC 階段不明顯，上線後會吃掉你的成本模型。

## Benchmark 怎麼讀（再說一次）

這個系列反覆講同一件事：**benchmark 看誰做的，跟看分數一樣重要**。

- **ParseBench** 由 LlamaIndex 發佈，榜首 LlamaParse Agentic（84.9%）是他們自家產品。方法論公開、資料集上了 HuggingFace，但結構性偏誤依然存在。
- **RD-TableBench** 由 Reducto 發佈，榜首是 Reducto r-1（90.2%）。同樣的結構。
- **olmOCR-bench** 主要評開源工具，商業 API 的資料點較少。

目前還沒有一個完全中立的第三方 benchmark 橫跨所有商業 API。最接近的是學術 survey [Document Parsing Unveiled](https://arxiv.org/abs/2410.21169)（arXiv:2410.21169，2024），但它出版時 Cohere Parse v5 和 Reducto r-1 都還沒發佈。

**務實的做法是拿自己的語料測。** 從你的實際文件裡抽 50-100 頁、涵蓋最難的案例，用各家 API 跑一遍，人工比對輸出。50 頁的評測比 2,000 頁的別人的 benchmark 更能告訴你該選哪一家。

## 開源 vs 商業的決策交叉點

不是「量大就自建、量小就付費」這麼簡單。交叉點取決於四個維度：

### 1. 團隊有沒有 GPU 維運能力

有 ML Ops 團隊 → 開源（MinerU / Docling）自建微服務，邊際成本趨近零。
沒有 → 商業 API，把可靠度的責任外包。

### 2. 文件多樣性

文件格式單一（全部是同一種發票） → 三大雲的 prebuilt model，一個 API call 直接拿到結構化欄位。
文件高度異質（合約、財報、技術手冊混在一起） → LlamaParse Agentic 或開源方案搭 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 自己做調度。

### 3. 輸出需求

要 Markdown（餵進 RAG） → Cohere Parse（最便宜）或 LlamaParse（最準）。
要結構化 JSON（欄位抽取、建帳） → 三大雲的 prebuilt 或 Reducto Extract。
兩個都要 → 需要串兩種工具，或用 Reducto（同時出 Markdown 和 JSON）。

### 4. 合規與部署位置

資料不能出境 → Azure / AWS / Google 的指定區域部署，或 Cohere 的 Model Vault 私有部署。
需要 SOC 2 / HIPAA → 三大雲天生有，Cohere 和 LlamaParse 要看 enterprise 方案。

### 決策樹（延伸自[第一篇](/posts/ai/2026-08-06-document-parsing-three-layers)）

```
你的文件需要解析層嗎？
   │
   ├─ 不需要（有文字、版面單純）
   │     └─ 【抽取層】pymupdf4llm，不花錢
   │
   └─ 需要（掃描件 / 複雜版面 / 表格密集）
         │
         ├─ 團隊有 GPU + ML Ops？
         │     ├─ 是 → 【開源解析層】MinerU / Docling
         │     │         量大時邊際成本趨近零
         │     └─ 否 → 往下走商業 API
         │
         └─ 商業方案怎麼選？
               │
               ├─ 文件含大量圖表、需要「理解」不只「轉錄」？
               │     └─ 是 → 【通用 VLM】Claude Opus 5 / GPT-5.5
               │           （成本高但圖表維度碾壓專用 parser）
               │
               ├─ 需要結構化欄位抽取？（發票/收據/身分證）
               │     └─ 是 → 你在哪朵雲？
               │           ├─ Azure → Azure DI Prebuilt
               │           ├─ GCP   → Google Document AI
               │           └─ AWS   → Textract（房貸→Lending）
               │
               ├─ 需要 Markdown 做 RAG？
               │     ├─ 追求最低成本 → Mistral OCR batch / Cohere Parse
               │     ├─ 追求最高精度 → LlamaParse Agentic（$12.50/千頁）
               │     └─ 表格密集     → Reducto r-1（表格 90.2%）
               │
               ├─ 混合場景（95% 標準 + 5% 複雜）
               │     └─ 多模型路由：標準頁走專用 parser，
               │       複雜頁升級 VLM
               │
               └─ 不確定 → 先用 50 頁自己的語料測，再決定
```

## 上線前驗證清單

不管選哪一家，上線前至少跑過這六項：

**1. 語料覆蓋測試。** 從生產文件裡抽 50-100 頁，涵蓋最好的和最差的案例。不要只測乾淨的 PDF——拿掃描歪斜的、解析度差的、蓋了章的去測。

**2. 表格完整性。** 挑最複雜的表格（合併儲存格、跨頁、巢狀），比對輸出的 row/column 數量是否正確。差一欄就是錯。

**3. 信心分數校準。** 如果 API 有信心分數，驗證它是否真的跟錯誤率相關——信心 0.95 的欄位是不是真的 95% 正確？還是只是模型的自信？

**4. 延遲與吞吐。** 測「平均延遲」不夠，要測 P99。API 在尖峰時段的延遲可能是閒時的 3-5 倍。10 萬頁/月平均每秒不到 1 頁，但如果你的 ingestion 是 batch job、每天跑一次，瞬間吞吐需求會高得多。

**5. 失敗模式。** 故意丟壞檔案（0 bytes、加密 PDF、超過頁數限制的文件）看 API 怎麼回應。是回 400 讓你知道，還是靜默回空結果？後者更危險，因為你的 pipeline 不會知道出錯了。

**6. 成本試算加乘。** 把帳面單價乘以 1.3-1.5 倍，涵蓋重試、限流等待、人工覆核。如果乘完還在預算內，才算安全。

## 跟 Visual RAG 的關係

[ColPali](/posts/ai/2026-09-03-colpali-visual-document-retrieval) 走完全不同的路：跳過文字解析，直接把 PDF 頁面當圖片做 patch-level embedding。表格結構 100% 保留，但 BM25 不能用、儲存量 ~100 倍。

商業 API 和 ColPali 不是競爭關係，而是 pipeline 的不同階段：

- **需要文字語意搜尋** → 用商業 API 或開源 parser 轉成文字 → embedding → 向量搜尋
- **表格密集、版面複雜、需要視覺定位** → ColPali 直接做圖片檢索
- **兩者混合** → 用 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 的 agent 根據頁面類型動態選路線

## 整體來說

商業文件解析的選項比多數人以為的多——不只是六家 API，而是三條路線的排列組合：專用 parser 追求成本效率、三大雲 prebuilt 追求欄位抽取的開箱即用、通用 VLM 追求理解力和彈性。

最反直覺的發現是：**通用 VLM 的整體分數已經能排進前五（Fable 5.1 在 ParseBench 拿 78.92），但在表格結構精度上仍然輸給 pipeline 式的專用工具**（Dr.DocBench 上 MinerU 2.5 的 Table TEDS 55.85 贏過所有 VLM 的 48-51）。更準不等於更適合——「轉錄」和「理解」是兩個不同的需求，選錯路線比選錯工具貴一個數量級。

選型的核心問題不是「哪家最好」，而是「你要轉錄還是理解」。要轉錄 → 專用 parser，要理解 → VLM，兩個都要 → 多模型路由。在這個判斷之上，才是量體、團隊能力、合規需求這些軸。

依然沒有全能選手，就像[這個系列每一篇的結論](/posts/ai/2026-08-06-document-parsing-three-layers)一樣。但現在你有一張更完整的決策樹——從三條路線出發，走到具體的選擇。

## 參考資料

- [ParseBench: A Document Parsing Benchmark for AI Agents（arXiv:2604.08538）](https://arxiv.org/abs/2604.08538)
- [ParseBench Leaderboard — GitHub](https://github.com/run-llama/ParseBench)
- [LlamaIndex — ParseBench 發佈文](https://www.llamaindex.ai/blog/parsebench)
- [Dr.DocBench: Evaluating LLM/VLM Document Parsing（arXiv:2606.01393）](https://arxiv.org/abs/2606.01393)
- [Unstructured — Frontier Models Are Strong But Document Parsing Is Harder（SCORE-Bench）](https://unstructured.io/blog/frontier-models-are-strong-but-document-parsing-is-harder)
- [OCR Arena — 社群盲測 ELO 排名](https://www.ocrarena.ai)
- [Cohere Parse 官方頁面](https://cohere.com/parse)
- [Cohere 定價頁](https://cohere.com/pricing)
- [Reducto r-1 模型發佈文](https://reducto.ai/blog/parse-r-1-model)
- [Reducto 定價頁](https://reducto.ai/pricing)
- [Mistral OCR — 官方文件](https://docs.mistral.ai/capabilities/document/)
- [AWS Textract 定價](https://aws.amazon.com/textract/pricing/)
- [Azure AI Document Intelligence 定價](https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/)
- [Google Cloud Document AI 定價](https://cloud.google.com/document-ai/pricing)
- [Document Parsing Unveiled: Techniques, Challenges, and Prospects（arXiv:2410.21169）](https://arxiv.org/abs/2410.21169)
- [文件解析的三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)（系列第 1 篇）
- [解析層：當結構要用模型推斷](/posts/ai/2026-08-06-document-parsing-layout-ocr)（系列第 5 篇）
- [掃描 PDF 實測：10 種解析工具](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)（系列第 6 篇）
- [Agentic Parsing：讓 Agent 決定怎麼解析文件](/posts/ai/2026-09-03-agentic-parsing-document-agents)（系列第 7 篇）
- [ColPali：跳過 OCR，直接用圖片做文件檢索](/posts/ai/2026-09-03-colpali-visual-document-retrieval)
- [Table Serialization：表格該怎麼轉成文字](/posts/ai/2026-09-03-table-serialization-rag)
