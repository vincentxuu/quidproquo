---
title: "商業文件解析 API 橫評：專用 Parser、通用 VLM、三大雲，交叉點在哪？"
date: 2026-09-16
category: ai
type: deep-dive
tags: [document-parsing, commercial-api, cohere-parse, llamaparse, azure-document-intelligence, google-document-ai, aws-textract, reducto, vision-language-model, rag, enterprise]
lang: zh-TW
tldr: "商業文件解析分三條路線：專用 Parser（Cohere Parse $1.50/千頁、Reducto r-1 mini $1、LlamaParse Agentic Plus 在 ParseBench 2 拿 90.93 居首）、三大雲（Azure／Google／AWS，欄位抽取與合規；AWS 在 2026-11 推出生成式的 Textract Insights）、直接用通用 VLM（Claude Opus 5.5 在 ParseBench 2 排第二，但實測每千頁約 $65，比榜首的 LlamaParse Agentic Plus 貴一倍多）。2026 年下半年最大的變化是最便宜的 VLM（GPT-6 Luna、Claude Haiku 5.5）每千頁已降到 $1.3-1.6，跟專用 parser 同價，但圖表幾乎抽不出來。選型的第一個問題仍然是「你要轉錄還是理解」。"
description: "比較專用文件 Parser（Cohere Parse、LlamaParse、Reducto、Mistral OCR、Datalab）、三大雲服務（Azure DI／Content Understanding、Google Document AI、AWS Textract Core／Insights）、通用 VLM（Claude、GPT、Gemini）三條路線的定位、定價與能力維度，用 ParseBench 2 的實測成本重算 10 萬頁/月的交叉點，延續文件解析實戰系列的三層階梯框架。"
draft: false
series:
  name: "文件解析實戰"
  order: 11
glossary:
  - term: "ParseBench"
    definition: "LlamaIndex 發佈的文件解析基準。v1 約 2,000 頁人工校驗的企業文件、五個維度；ParseBench 2 擴充到 4,317 個測試案例、六個維度（新增表單），並依錯誤嚴重度計分。兩版分數不能互比。"
    context: "目前商業 API 最常引用的橫向評測，但榜首 LlamaParse 正是發佈者自家產品。"
  - term: "Prebuilt Model"
    aliases: ["預建模型"]
    definition: "雲端廠商預先訓練好的文件解析模型，針對特定文件類型（發票、收據、身分證）做結構化欄位抽取，不需要使用者提供訓練資料。"
    context: "Azure 和 Google 的 prebuilt 覆蓋 20+ 種文件類型，是它們跟純解析 API 的主要區隔。"
---

> :globe: [English version](/posts/ai/2026-09-16-commercial-document-parsing-api-comparison-en)

這個系列的前七篇全部在講開源方案：從[三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)的選型框架，到 [MarkItDown](/posts/ai/2026-04-18-markitdown-intro)、[anydoc](/posts/ai/2026-08-06-anydoc-rust-document-markdown) 的轉換層，[PyMuPDF / pdfplumber](/posts/ai/2026-08-06-pdf-text-extraction-libraries) 的抽取層，[MinerU / Marker / Docling](/posts/ai/2026-08-06-document-parsing-layout-ocr) 的解析層，到 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 讓 agent 動態調度。結論都是同一句：**先選對層，再選工具**。

但企業場景有三個拉力，會把你從開源推向商業 API：

1. **不想養 GPU。** 解析層的開源工具都要 GPU——MinerU 建議 8GB+ VRAM，Docling 的 VlmPipeline 要更多。中小團隊不一定有 ML Ops 能力維護推論叢集。
2. **需要 SLA。** 開源工具沒有 uptime 保證、沒有客服。把它包成微服務自己跑，99.9% availability 是你的事。
3. **合規要求。** 金融、醫療、政府場景要 SOC 2、HIPAA、FedRAMP。三大雲的文件解析服務天生帶這些認證，開源方案得自己補。

這篇把商業方案分成三條路線——**專用文件 Parser**、**三大雲 Prebuilt 服務**、**直接用通用 VLM**——放回三層階梯的框架裡，比定價、比能力、算成本，最後給一張決策樹。以下價格都是各家官方定價頁 2026-11 的牌價（美元，未含稅與量販折扣）。

## 六家一覽

| | 定位 | 單價（每千頁） | 輸出 | 特色 | 主要限制 |
|---|---|---|---|---|---|
| **Cohere Parse 5** | 專用文件 VLM | API $1.50；Model Vault 依 GPU 時數另計 | Markdown | 2.3B 參數、成本最低級、可私有部署 | 無信心分數、不吐 JSON、只支援 9 種語言 |
| **LlamaParse** | 多級 agentic 解析 | Fast $1.50 → Agentic Plus $37.50（Pro 方案 $1.25 → $31.25） | Markdown / JSON | 四級模式、ParseBench 2 第一（90.93） | 發佈 ParseBench 的就是自家；Agentic Plus 單價是 Fast 的 25 倍 |
| **Azure DI** | 雲端全功能 | Read $1.50、Layout／Prebuilt $10、Custom $30 | JSON（結構化欄位） | 20+ 種 prebuilt 文件模型、月費承諾層最低 $0.45 | 圖表幾乎不抽；正和 Content Understanding 合併 |
| **Google Document AI** | GCP 生態整合 | OCR $1.50、Layout Parser $10、Form／Custom $30；Invoice 依文件計 | JSON（結構化欄位） | Custom Extractor、Layout Parser 內建 chunking | Invoice 等 prebuilt 按份計費，單頁文件很貴；custom processor 有 hosting 費 |
| **AWS Textract** | AWS 生態整合 | Core：Text $1.50、Tables $15、Forms $50；Insights：Extraction $8.50、Custom $40 | JSON；Insights 另出 Markdown／HTML | Analyze Lending（房貸封包）、2026-11 新增生成式 Insights | Core Forms 單價最高；Insights 只有兩個美國區域、6 種語言 |
| **Reducto** | 開發者導向 agentic | r-1 mini $1、r-1 $10、Extract $20、Deep Extract $40 | Markdown / JSON | ParseBench 2 第四（86.23）、citation grounding | r-1 mini 便宜但圖表分數趨近 0 |

幾個值得注意的結構性差異：

**Cohere 和 LlamaParse 吐 Markdown**，設計目標是 RAG pipeline 的 ingestion——把文件轉成 LLM 讀得懂的純文字。**三大雲和 Reducto 的 Extract 吐結構化 JSON**，設計目標是欄位抽取——從發票裡拉出「供應商名稱」「金額」「日期」這些 key-value。

這不是小差異。如果你的場景是「把 PDF 丟進向量資料庫做語意搜尋」，Markdown 輸出直接能用；如果是「從一堆發票裡自動建帳」，結構化 JSON 省掉你寫 parser 的工。選錯輸出格式，下游的工程量差一個數量級。

這條界線在 2026 下半年開始模糊：AWS 的 [Textract Insights](https://aws.amazon.com/about-aws/whats-new/2026/11/textract-insights-ga/)（2026-11-20 GA）同時吐 Markdown／HTML 給 RAG、吐 blueprint 定義的欄位給系統；Azure 也在把 Document Intelligence 和以生成式模型為核心的 Content Understanding 合到 Microsoft Foundry 底下。三大雲正在往「解析＋抽取一次做完」靠攏。

## 其他值得注意的商業方案

六家之外，市場上還有幾個值得列入評估清單的：

| | 單價（每千頁） | 差異化 | 適合場景 |
|---|---|---|---|
| **Mistral OCR 4.1** | $4（即時）/ $2（batch）；Document AI 欄位抽取 $5 | 段落級 bounding box、區塊標籤、區塊與字詞級信心分數；170 種語言；企業版可單一容器自架 | 要信心分數又要便宜的大量 ingestion |
| **Datalab** | Balanced $4、Accurate $10（同意資料供訓練打 75 折） | Marker／Surya 團隊的託管版；ParseBench 2 Accurate 82.63、表格 90.38 | 文字與表格為主、圖表少的文件 |
| **Upstage Document Parse** | 最高 $30（Auto 模式依頁自動選 Standard／Enhanced）；純 OCR $1.50 | 韓國廠商，中日韓文件經驗多 | 中日韓文件 |
| **Unstructured** | $15（含全 pipeline） | 不只 parser，是 ETL 平台（chunking + embedding + connector） | 需要一站式 ingestion pipeline |
| **Mathpix** | $5（即時）/ $1.50（batch） | LaTeX 公式辨識獨強 | 學術論文、數學/科學文件 |
| **LandingAI ADE** | credit 制（$1＝100 credits），DPT-3 Pro 約 1.5 credits/頁、DPT-3 Verity 約 0.55 | Agentic extraction、細粒度視覺定位 | 需要 agentic 欄位抽取 |
| **百度智能雲 文档解析** | Unlimited-OCR 每頁人民幣 0.02 元（限時折扣，原價 0.05）；PaddleOCR-VL 0.05 元 | 背後是開源的 [Unlimited OCR 2](/posts/daily/2026-10-27-model-baidu-unlimited-ocr-2) 與 PaddleOCR-VL，百頁級長文件 | 簡體中文文件、資料可在中國境內處理 |
| **ABBYY Vantage** | 未公開牌價，年約議價 | 30 年 OCR 經驗、on-prem 部署最成熟 | 金融保險大型 IDP 專案 |
| **Nanonets** | 依工作流程區塊計費，$0.02-0.30/次 | no-code UI、內建 validation workflow | 小量體、需要人工覆核的中小企業 |

特別值得提的是 **Reducto r-1 mini**：$1/千頁是目前帳面最低的專用 parser，ParseBench 2 表格 86.11、視覺定位 88.53，但圖表只有 1.35——它是為大量純文字與表格頁設計的。同價位帶的 **Mistral OCR 4.1** batch $2/千頁，優勢在信心分數：OCR 4.1 每個區塊都有信心值，可以直接決定哪些頁要人工覆核。

不在表上的兩個參考點：Cloudflare Workers AI 的 [`toMarkdown`](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities) 對多數格式免費，但它是[轉換層](/posts/ai/2026-08-06-document-parsing-three-layers)工具，掃描件和複雜版面不是它的範圍；騰訊優圖的 [Youtu-Parsing-Omni](/posts/daily/2026-10-10-model-tencent-youtu-parsing-omni) 是開放權重模型、沒有官方託管 API，要自己部署。

## 直接用通用 VLM 當 Parser

除了專用 parser，還有一條完全不同的路：直接把 PDF 頁面截圖，丟給 Claude、GPT、Gemini 這些通用 VLM，用 prompt 叫它轉成 Markdown 或 JSON。

這不是偷懶。在 [ParseBench 2](https://github.com/run-llama/ParseBench)（4,317 個測試案例、六個維度，依錯誤嚴重度計分），通用 VLM 已經混進專用 parser 的前段班：

| 排名 | 方案 | ParseBench 2 整體 | 每千頁實測成本 | 類型 |
|---|---|---|---|---|
| 1 | LlamaParse Agentic Plus | **90.93** | $28 | 專用 parser |
| 2 | **Claude Opus 5.5** | **87.11** | $65 | 通用 VLM |
| 3 | LlamaParse Agentic | 86.96 | $12.50 | 專用 parser |
| 4 | Reducto r-1 | 86.23 | $10 | 專用 parser |
| 5 | LlamaParse Cost Effective | 85.52 | $3.75 | 專用 parser |
| 6 | Gemini 4 Argon（low） | 85.32 | $27 | 通用 VLM |
| 13 | GPT-6.2 Sol（medium） | 82.12 | $25 | 通用 VLM |
| — | Claude Sonnet 5.5 | 75.07 | $31 | 通用 VLM |
| — | GPT-6 Luna（low） | 74.59 | $1.30 | 通用 VLM |
| — | Mistral OCR 4.1 | 69.26 | $4 | 專用 parser |
| — | Azure DI（layout） | 66.81 | $10 | 三大雲 |

ParseBench 2 的分數和 v1 不能互比；v1 的榜也在持續重算，引用時要看清楚是哪一版、哪一天的數字。Google Document AI 和 AWS Textract 只出現在 v1 榜，且整體分數都在 50 分以下；Cohere Parse 兩版都沒有上榜。

ParseBench 是企業文件（保險、金融、政府），難度有限。更嚴格的 [Dr.DocBench](https://arxiv.org/abs/2606.01393)（arXiv:2606.01393，2026-06，4,514 頁專家級文件、52 個科目）用當時的前沿 VLM 測，分數叢聚在 60 分左右：

| 模型（2026-06 測試版本） | Dr.DocBench Overall | Table TEDS |
|---|---|---|
| GPT-5.5 | **61.94** | 48.90 |
| Claude Opus 4.6 | 60.19 | 49.21 |
| Gemini 3.1 Pro | 60.13 | 51.26 |
| MinerU 2.5（pipeline） | 54.37 | **55.85** |

在專家級文件上，pipeline 式的 MinerU 2.5 表格結構反而贏過所有通用 VLM。但這份測的是上一代模型；到 ParseBench 2，當代前沿 VLM 的表格分數已經是全榜最高（Gemini 4 Neon 95.23、GPT-6.2 Sol 94.91、Claude Opus 5.5 94.20），和 LlamaParse Agentic Plus（94.72）同一級。表格這一項，「VLM 不如專用工具」已經不能當通則。

Unstructured 在 2026-08 發佈的 [SCORE-Bench](https://unstructured.io/blog/frontier-models-are-strong-but-document-parsing-is-harder)（224 份真實文件）拆解了另一個面向：專用 pipeline 在複合指標上贏裸 VLM 4-16 個百分點，而且幻覺率差異很大——測試時的 Claude Opus 4.6 僅 0.044（跟 pipeline 平），GPT-5.2 達 0.167、Gemini 2.5 Pro 達 0.257。這些都是已被取代的版本，新一代還沒有同一份測試的數字；「不同 VLM 家族的幻覺傾向差很多」這個結論，換模型前仍值得用自己的文件重測。

### VLM 的強項：彈性與「理解」

最大的優勢是**彈性**：用 prompt 就能調整輸出格式，不需要等 API 更新。今天要 Markdown、明天要 JSON、後天要「只抽出金額超過 10 萬的項目」——通用 VLM 都做得到，專用 parser 做不到。也只有通用 VLM 能回答「這份合約的風險在哪」這種需要理解的問題。

圖表要分開看。舊版 ParseBench 裡，多數專用 parser 的圖表分數低於 6%，通用 VLM 遠遠領先；到 ParseBench 2，圖表維度（要把圖表還原成完整資料表）的前段班換成了 agentic parser——LlamaParse Agentic Plus 92.58、Reducto（agentic 模式）89.07、Pulse Ultra 2 86.80——它們在內部對圖表頁額外呼叫 VLM。裸用的 VLM 落差很大：GPT-6.2 Sol（medium）78.86、Claude Opus 5.5 74.12，Claude Sonnet 5.5 只有 38.59、Claude Haiku 5.5 只有 12.13。便宜的 VLM 在圖表上幾乎幫不上忙。

### VLM 的弱項：成本、穩定性、幻覺

每頁成本取決於你怎麼算。用最單純的假設——一頁文件圖片約 1,750 input tokens、輸出約 500 tokens、不開推理——套各家牌價，跟 ParseBench 2 實際跑出來的成本並列：

**專用 parser（每千頁牌價）：**

| 方案 | 每千頁成本 |
|---|---|
| Reducto r-1 mini | $1.00 |
| Cohere Parse 5 | $1.50 |
| Mistral OCR 4.1 batch | $2.00 |
| LlamaParse Cost Effective | $3.75-4.50 |

**通用 VLM（每千頁）：**

| 模型 | 牌價（input／output，每百萬 token） | 公式估算 | ParseBench 2 實測 |
|---|---|---|---|
| GPT-6 Luna | $0.10／$0.50 | ~$0.43 | $1.27（low） |
| Claude Haiku 5.5 | $0.10／$0.50（≤100K） | ~$0.43 | $1.55 |
| Gemini 3.8 Flash | $0.75／$3.75（至 2026-12-31，之後 $1.50／$7.50） | ~$3.2 | $8.48（low） |
| Gemini 4 Hydrogen | $1.50／$7.50 | ~$6.4 | 未上榜 |
| GPT-6.1 Terra | $1／$5 | ~$4.3 | $11.55（low） |
| GPT-6.2 Sol | $2／$10 | ~$8.5 | $22.89（low） |
| Claude Sonnet 5.5 | $2／$10 | ~$8.5 | $31.30 |
| Gemini 4 Argon | $2／$10（至 2026-11-30，之後 $4／$20） | ~$8.5 → $17 | $26.83（low） |
| Claude Opus 5.5 | $4／$20 | ~$17 | $64.92 |
| Gemini 4 Neon | $3／$15 | ~$12.8 | $62.04（low） |
| GPT-6.2 Astra／Claude Fable 5.2 | $8／$40 | ~$34 | 未上榜 |

實測成本是公式估算的 3-5 倍。差距主要來自兩處：推理型號的思考 token 計入輸出（Gemini 定價頁明寫 output 含 thinking tokens，Claude Opus 5.5 的 adaptive thinking 永遠開啟），以及高解析度頁面圖片的實際 token 數比 1,750 多。做預算時用實測值比較保險；公式只適合當下限。三家的 Batch API 都是標準價 5 折。

這張表推翻了舊版本文的一個結論。2026-09 時，最便宜的通用 VLM 每千頁也要 ~$3，是專用 parser 的 2 倍以上；現在 GPT-6 Luna 和 Claude Haiku 5.5 實測每千頁 $1.3-1.6，跟 Cohere Parse 同價，ParseBench 2 整體分數（74.59、71.24）也比 Mistral OCR 4.1（69.26）高。但便宜 VLM 的分數是靠文字與表格撐起來的，圖表和視覺定位明顯偏弱。頂級 VLM 則還是貴：Claude Opus 5.5 拿到第二名，但每千頁 $65，是榜首 LlamaParse Agentic Plus（$28）的兩倍多。

而且通用 VLM 有三個專用 parser 不會有的問題：

1. **輸出不穩定。** 同一頁文件跑兩次，Markdown 格式可能不同。表格有時用 `|` 分隔、有時用 HTML `<table>`。量產 pipeline 受不了這種不確定性。
2. **幻覺。** SCORE-Bench（2026-08，測試當時的模型版本）顯示 Gemini 的幻覺率達 0.257、GPT 達 0.167——每四到六頁就有一頁會「合理地」編造不存在的內容。ParseBench 2 對改動數字、翻轉否定這類錯誤給重罰，分數高代表這類錯少，但不等於零。幻覺風險是通用 VLM 的結構性弱點。
3. **沒有信心分數。** VLM 不會告訴你哪個欄位辨識不確定，你得自己設計品質檢查流程。

### 什麼時候用 VLM、什麼時候用專用 Parser

| 場景 | 用通用 VLM | 用專用 Parser |
|---|---|---|
| 圖表密集（技術手冊、研究報告） | △ 只有頂級型號可用，Opus 5.5 圖表 74 分 | ✓ agentic parser 圖表 85-93 分 |
| 量少+異質性高（每月 < 1 萬頁） | ✓ 不值得串 pipeline | ✗ 過度工程 |
| 需要「理解」而非「轉錄」 | ✓ 可以問「這份合約的風險在哪」 | ✗ 只會轉成文字 |
| 大量同質文件（10 萬頁發票） | △ 便宜型號 $130-160/月，但沒信心分數 | ✓ prebuilt 一次拿到欄位與信心分數 |
| 需要結構化 JSON | ✗ 格式不穩定 | ✓ schema 固定 |
| 不能容忍幻覺 | ✗ 幻覺率依模型差很多 | ✓ 留空或標低信心 |
| 表格結構精度 | ✓ 前沿型號 ParseBench 2 表格 94-95 分 | ✓ LlamaParse Agentic Plus 94.72、Reducto r-1 90.97 |

### 務實做法：多模型路由

最聰明的做法不是二選一，而是分流：標準頁面走便宜的專用 parser（Reducto r-1 mini、Cohere、Mistral OCR batch），表格與圖表密集的頁面升級到 agentic parser（LlamaParse Agentic、Reducto r-1），只有需要理解、推理的頁面才動用 Claude Opus 5.5／Gemini 4 Argon 這一級的 VLM。這跟 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 的邏輯完全一致——讓 agent 根據頁面特性選路線，而不是一體適用。

依 Unstructured 的分析，專用 pipeline 的優勢不在模型更好，而在三層包裝：optimized prompting + post-processing + output enforcement。ParseBench 2 的圖表維度也印證了這點：agentic parser 內部同樣在呼叫 VLM，分數贏在包裝。如果你願意自己做這三層包裝，拿通用 VLM 當底層引擎是可行的——但那基本上就是在自建一個專用 parser。

## 按能力維度比較

### 表格

表格是文件解析的試金石。有兩份來源可以參考，但要分開讀：

| 方案 | ParseBench 2 表格 | RD-TableBench（Reducto 發佈） |
|---|---|---|
| Gemini 4 Neon | **95.23** | — |
| LlamaParse Agentic Plus | 94.72 | — |
| Claude Opus 5.5 | 94.20 | — |
| Reducto r-1 | 90.97 | **90.2%** |
| Datalab Accurate | 90.38 | — |
| Mistral OCR 4.1 | 81.84 | — |
| Azure DI（layout） | 77.58 | 82.7% |
| AWS Textract | — | 80.9% |
| Google Document AI | — | 64.6% |

兩份 benchmark 的資料集和計量方式不同，數字不能直接比大小；Cohere 自報的 ParseBench（v1）表格 87.0 也一樣。可以信的結論有兩個：前沿 VLM 和 agentic parser 現在都在 90 分以上；三大雲的傳統 layout 模型在兩份測試裡都落在後段，Google 又是三家最低。

### 圖表

依 ParseBench 2 的圖表維度，agentic parser 領先（LlamaParse Agentic Plus 92.58、Reducto agentic 模式 89.07），頂級 VLM 次之（GPT-6.2 Sol medium 78.86、Claude Opus 5.5 74.12），非 agentic 的專用 parser 與三大雲 layout 模型多數低於 2 分。Cohere Parse 5 明確不涵蓋圖表提取。如果你的文件裡有大量圖表（技術手冊、研究報告），要嘛選 agentic parser，要嘛用頂級 VLM 自己做——上面「直接用通用 VLM 當 Parser」那一節有詳細比較。另一個選項是 Textract Insights 和 Datalab 的圖表附加功能：前者幫每張圖產生說明文字，後者把圖表解析成資料，都是另外計費的 add-on。

### 手寫辨識

三大雲都支援手寫文字辨識（Azure DI 和 Textract 明確列為功能；AWS 在 2026-11 更新 Textract Core 時特別提到加強手寫與密集表格）。Mistral 自報 OCR 4.1 的手寫辨識精度 88.9%（對照 Azure 的 78.2%）。Cohere、LlamaParse、Reducto 的文件裡沒有單獨提到手寫支援。如果你的場景包含手寫表單（醫療、保險理賠），Mistral OCR 和三大雲都是可選的。

### 多語言

| 方案 | 語言數 |
|---|---|
| LlamaParse | 80+ |
| Cohere Parse | 9 種商業語言 |
| Mistral OCR 4 | 170 |
| Azure DI | 300+（Read OCR） |
| Google Document AI | 200+（OCR） |
| AWS Textract | Core 40 種；Insights 6 種（英、西、義、葡、法、德） |

Azure 和 Google 的 OCR 語言覆蓋最廣，但這是 OCR 層級的字元辨識，不等於結構化抽取也支援這麼多語言。Cohere 只訓練了 9 種語言，繁體中文是否在列需要確認。AWS Textract Core 在 2026-11 從 6 種語言擴到 40 種，但新的 Insights 仍只支援 6 種歐洲語言，中文文件用不了。

### 表單 Key-Value 抽取

**三大雲的核心優勢在這裡。** Azure DI 有 20+ 種 prebuilt model（發票、收據、身分證、合約、銀行對帳單、支票、稅表），Google Document AI 有類似的 specialized processor，AWS Textract 有獨家的 Analyze Lending（房貸封包自動化）和 Analyze Expense。新的 Textract Insights 改用 blueprint：用自然語言描述每個欄位，AWS 也提供 W-2、1040、護照等公開 blueprint，一份混雜多種文件的封包可以一次切分、分類、抽取。

Cohere 不做 KV 抽取——它把文件轉成 Markdown，你拿去給 LLM 抽欄位。LlamaParse、Reducto、Mistral（Document AI）、Datalab 都有另外計費的 Extract API，但沒有預建的文件類型模型，要自己定義 schema。

### 信心分數

| 方案 | 有信心分數 |
|---|---|
| Azure DI | ✓（每個欄位） |
| Google Document AI | ✓（每個欄位） |
| AWS Textract | ✓（Core 每個欄位；Insights 每個值附來源頁與座標） |
| Mistral OCR 4.1 | ✓（區塊與字詞級 + bounding box） |
| Reducto | ✓（citation grounding） |
| LlamaParse | △（Extract 有 citations 與信心分數，Parse 沒有） |
| Datalab | △（字詞級 bounding box 與信心分數是付費 add-on） |
| Cohere Parse | ✗ |
| 通用 VLM | ✗ |

信心分數是企業場景的硬需求。沒有它，你不知道哪些頁需要人工覆核——要嘛全部人工看（成本爆炸），要嘛全部信任機器（品質失控）。Cohere 的技術文件明確沒有提供信心分數，這在高價值文件場景（合約、法律文書）是個顯著限制。

## 成本模型：10 萬頁/月

帳面單價只是起點。依場景不同，實際成本可以差 10 倍以上。以下通用 VLM 一律用 ParseBench 2 的實測每頁成本換算，專用 parser 和三大雲用牌價。

### 場景 A：純文字 OCR（單欄文件、不需要表格結構）

| 方案 | 月費 |
|---|---|
| Reducto r-1 mini | $100 |
| GPT-6 Luna（VLM） | ~$127 |
| Cohere Parse 5 | $150 |
| LlamaParse Fast | $150 |
| Azure DI Read | $150 |
| Google Enterprise Document OCR | $150 |
| AWS Textract DetectDocumentText | $150 |
| Claude Haiku 5.5（VLM） | ~$155 |
| Mistral OCR 4.1 batch | $200 |

各家幾乎一樣，連最便宜的 VLM 都擠進這個價位。這個場景其實不該用商業 API——[抽取層](/posts/ai/2026-08-06-pdf-text-extraction-libraries)的 `pymupdf4llm` 零成本就能搞定。如果你堅持用中階 VLM 跑：GPT-6.2 Sol 要 ~$2,300/月、Claude Sonnet 5.5 要 ~$3,100/月——花十幾倍的錢做同樣的事，而且多了幻覺風險。

### 場景 B：含表格的混合文件

| 方案 | 月費 | 類型 | ParseBench 2 整體 |
|---|---|---|---|
| Reducto r-1 mini | $100 | 專用 parser | 72.55 |
| GPT-6 Luna（VLM） | ~$127 | 通用 VLM | 74.59 |
| Cohere Parse 5 | $150（表格包含在基本價） | 專用 parser | 未上榜 |
| Claude Haiku 5.5（VLM） | ~$155 | 通用 VLM | 71.24 |
| Mistral OCR 4.1 batch | $200 | 專用 parser | 69.26 |
| LlamaParse Cost Effective | $375-450 | 專用 parser | 85.52 |
| Datalab Balanced | $400 | 專用 parser | 82.35 |
| Azure Content Understanding（Standard 抽取） | $500 起 | 三大雲 | — |
| Textract Insights（Extraction） | $850 | 三大雲 | — |
| Azure DI Layout | $1,000 | 三大雲 | 66.81 |
| Google Layout Parser | $1,000 | 三大雲 | — |
| Reducto r-1 Parse | $1,000 | 專用 parser | 86.23 |
| LlamaParse Agentic | $1,250-1,500 | 專用 parser | 86.96 |
| AWS Textract Tables | $1,500 | 三大雲 | — |
| GPT-6.2 Sol（VLM，low） | ~$2,300 | 通用 VLM | 79.12 |
| Gemini 4 Argon（VLM，low） | ~$2,700 | 通用 VLM | 85.32 |
| LlamaParse Agentic Plus | $3,125-3,750 | 專用 parser | 90.93 |
| Claude Sonnet 5.5（VLM） | ~$3,100 | 通用 VLM | 75.07 |
| Claude Opus 5.5（VLM） | ~$6,500 | 通用 VLM | 87.11 |

差距拉開了。$100-200 這一檔有五個選項，整體分數都在 69-75，差異主要在信心分數（Mistral 有、VLM 沒有）和輸出格式。性價比的甜蜜點在 $375-450：LlamaParse Cost Effective 85.52 分，已經接近 $1,000 的 Reducto r-1 和 $6,500 的 Claude Opus 5.5。如果你需要的是「把表格變成可用的 Markdown」，從這一檔開始測；如果需要「從表格裡抽出特定欄位」，三大雲的 prebuilt 或各家的 Extract API 才是正解。

### 場景 C：發票/收據自動化（需要 KV 抽取）

| 方案 | 月費（10 萬張單頁發票） |
|---|---|
| Mistral Document AI（batch） | $250 |
| Azure DI Invoice Prebuilt | $1,000（月費承諾 10 萬頁層 $900） |
| AWS Textract AnalyzeExpense | $1,000 |
| Reducto Extract | $2,000 |
| AWS Textract Insights（Custom，30 個欄位內） | $4,000 |
| Google Invoice Parser | $10,000 |

三大雲的 prebuilt 計價單位不一樣，這張表最容易算錯。Azure 和 AWS 按頁計；Google 的 Invoice Parser 按「份」計，每份 10 頁以內 $0.10——10 萬張單頁發票就是 $10,000，要是同樣 10 萬頁是 1 萬份 10 頁的文件，才是 $1,000。Mistral Document AI 最便宜，但它是 OCR 之後再呼叫 LLM 依你的 schema 填欄位，沒有預建的發票模型，欄位品質要自己驗。

### 隱藏成本

帳面價格之外，至少還有三項：

1. **失敗重試。** API 回傳 500 或 timeout 的頁面要重跑。依使用者社群回報，各家的失敗率大約在 0.5-2%，10 萬頁就是 500-2,000 頁重試成本。Google Document AI 明確寫失敗的請求（4xx、5xx）不計費，其他家要看條款。
2. **人工覆核。** 沒有信心分數的方案（Cohere、通用 VLM），你得另外設計品質抽檢流程。有信心分數的方案，低於閾值的頁面還是要人看——依 yololab 對 Cohere Parse v5 的分析，「每千頁便宜不等於每件核准便宜」，因為後端的人工覆核成本可能比 API 費用高。
3. **固定費與促銷到期。** Google Document AI 的 custom processor 有 hosting 費（$0.05/小時，一年約 $438），即使沒有請求也在跑錶。Azure 的承諾層超額部分另計。VLM 的促銷價會到期：Gemini 4 Argon 2026-12-01 起單價翻倍，Gemini 3.8 Flash 2027-01-01 起翻倍。這些在 POC 階段不明顯，上線後會吃掉你的成本模型。

## Benchmark 怎麼讀（再說一次）

這個系列反覆講同一件事：**benchmark 看誰做的，跟看分數一樣重要**。

- **ParseBench** 由 LlamaIndex 發佈，兩版榜首都是自家的 LlamaParse Agentic Plus。方法論公開、資料集與各家輸出都上了 HuggingFace、分數會隨評分程式更新重算，但結構性偏誤依然存在。
- **RD-TableBench** 由 Reducto 發佈，榜首是 Reducto r-1（90.2%）。同樣的結構。
- **olmOCR-bench** 主要評開源工具，商業 API 的資料點較少。

目前還沒有一個完全中立的第三方 benchmark 橫跨所有商業 API。最接近的是學術 survey [Document Parsing Unveiled](https://arxiv.org/abs/2410.21169)（arXiv:2410.21169，2024），但它出版時 Cohere Parse 5 和 Reducto r-1 都還沒發佈。

**務實的做法是拿自己的語料測。** 從你的實際文件裡抽 50-100 頁、涵蓋最難的案例，用各家 API 跑一遍，人工比對輸出。50 頁的評測比 4,000 頁的別人的 benchmark 更能告訴你該選哪一家。

## 開源 vs 商業的決策交叉點

不是「量大就自建、量小就付費」這麼簡單。交叉點取決於四個維度：

### 1. 團隊有沒有 GPU 維運能力

有 ML Ops 團隊 → 開源（MinerU / Docling）自建微服務，邊際成本趨近零。
沒有 → 商業 API，把可靠度的責任外包。

### 2. 文件多樣性

文件格式單一（全部是同一種發票） → 三大雲的 prebuilt model，一個 API call 直接拿到結構化欄位。
文件高度異質（合約、財報、技術手冊混在一起） → LlamaParse Agentic、Textract Insights 的封包切分，或開源方案搭 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 自己做調度。

### 3. 輸出需求

要 Markdown（餵進 RAG） → Reducto r-1 mini／Cohere Parse（最便宜）、LlamaParse Cost Effective（性價比）、LlamaParse Agentic Plus（最準）。
要結構化 JSON（欄位抽取、建帳） → 三大雲的 prebuilt 或各家 Extract API。
兩個都要 → Reducto、LlamaParse、Textract Insights 都能同時出 Markdown 和 JSON。

### 4. 合規與部署位置

資料不能出境 → Azure / AWS / Google 的指定區域部署，或 Cohere Model Vault、Mistral OCR、LlamaParse、Reducto、Datalab 的企業版私有部署（VPC 或 on-prem）。
需要 SOC 2 / HIPAA → 三大雲天生有；HIPAA BAA 在 Reducto 要 Growth、Datalab 要 Team、LlamaParse 要 Enterprise 方案。

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
               ├─ 需要「理解」不只「轉錄」？
               │     └─ 是 → 【通用 VLM】Claude Opus 5.5 / Gemini 4 Argon
               │           （彈性最高，但每千頁 $27-65）
               │
               ├─ 需要結構化欄位抽取？（發票/收據/身分證）
               │     └─ 是 → 你在哪朵雲？
               │           ├─ Azure → Azure DI Prebuilt
               │           ├─ GCP   → Google Document AI（注意按份計費）
               │           └─ AWS   → Textract（房貸→Lending，
               │                       混雜封包→Insights）
               │
               ├─ 需要 Markdown 做 RAG？
               │     ├─ 追求最低成本 → Reducto r-1 mini / Cohere Parse
               │     ├─ 要信心分數   → Mistral OCR 4.1 batch
               │     ├─ 性價比       → LlamaParse Cost Effective
               │     └─ 圖表密集     → LlamaParse Agentic Plus / Reducto agentic
               │
               ├─ 混合場景（95% 標準 + 5% 複雜）
               │     └─ 多模型路由：標準頁走便宜 parser，
               │       複雜頁升級 agentic parser 或 VLM
               │
               └─ 不確定 → 先用 50 頁自己的語料測，再決定
```

## 上線前驗證清單

不管選哪一家，上線前至少跑過這六項：

**1. 語料覆蓋測試。** 從生產文件裡抽 50-100 頁，涵蓋最好的和最差的案例。不要只測乾淨的 PDF——拿掃描歪斜的、解析度差的、蓋了章的去測。

**2. 表格完整性。** 挑最複雜的表格（合併儲存格、跨頁、巢狀），比對輸出的 row/column 數量是否正確。差一欄就是錯。

**3. 信心分數校準。** 如果 API 有信心分數，驗證它是否真的跟錯誤率相關——信心 0.95 的欄位是不是真的 95% 正確？還是只是模型的自信？Textract Insights 發佈時也沒有附準確率數字，AWS 自己建議用代表性樣本調閾值。

**4. 延遲與吞吐。** 測「平均延遲」不夠，要測 P99。API 在尖峰時段的延遲可能是閒時的 3-5 倍。10 萬頁/月平均每秒不到 1 頁，但如果你的 ingestion 是 batch job、每天跑一次，瞬間吞吐需求會高得多——Reducto r-1 mini 的標準方案同時處理上限只有 50 頁。

**5. 失敗模式。** 故意丟壞檔案（0 bytes、加密 PDF、超過頁數限制的文件）看 API 怎麼回應。是回 400 讓你知道，還是靜默回空結果？後者更危險，因為你的 pipeline 不會知道出錯了。

**6. 成本試算加乘。** 把帳面單價乘以 1.3-1.5 倍，涵蓋重試、限流等待、人工覆核。用 VLM 的話，先用自己的文件量一次實際 token 數，不要拿公式估算當預算。如果乘完還在預算內，才算安全。

## 跟 Visual RAG 的關係

[ColPali](/posts/ai/2026-09-03-colpali-visual-document-retrieval) 走完全不同的路：跳過文字解析，直接把 PDF 頁面當圖片做 patch-level embedding。表格結構 100% 保留，但 BM25 不能用、儲存量 ~100 倍。

商業 API 和 ColPali 不是競爭關係，而是 pipeline 的不同階段：

- **需要文字語意搜尋** → 用商業 API 或開源 parser 轉成文字 → embedding → 向量搜尋
- **表格密集、版面複雜、需要視覺定位** → ColPali 直接做圖片檢索
- **兩者混合** → 用 [Agentic Parsing](/posts/ai/2026-09-03-agentic-parsing-document-agents) 的 agent 根據頁面類型動態選路線

## 整體來說

商業文件解析的選項比多數人以為的多——不只是六家 API，而是三條路線的排列組合：專用 parser 追求成本效率、三大雲 prebuilt 追求欄位抽取的開箱即用、通用 VLM 追求理解力和彈性。

2026-09 以來最大的變化是價格帶的重疊：最便宜的 VLM 降到跟專用 parser 同價，前沿 VLM 的表格分數追上 agentic parser；但圖表和信心分數仍是專用 parser 的地盤，頂級 VLM 每千頁的實測成本也還是榜首 parser 的兩倍以上。**更準不等於更適合**——「轉錄」和「理解」是兩個不同的需求，選錯路線比選錯工具貴一個數量級。

選型的核心問題不是「哪家最好」，而是「你要轉錄還是理解」。要轉錄 → 專用 parser，要理解 → VLM，兩個都要 → 多模型路由。在這個判斷之上，才是量體、團隊能力、合規需求這些軸。

依然沒有全能選手，就像[這個系列每一篇的結論](/posts/ai/2026-08-06-document-parsing-three-layers)一樣。但現在你有一張更完整的決策樹——從三條路線出發，走到具體的選擇。

## 更新紀錄

- 2026-11-23：各家型號與價格更新到 2026-11 官方定價頁。通用 VLM 換成 Claude 5.5／Fable 5.2、GPT-6.x、Gemini 4 世代（舊的 Sonnet 5、Opus 5、GPT-5.5、Gemini 3.1 Pro 從比較表移除），成本改用 ParseBench 2 的實測每頁成本重算三個 10 萬頁情境，並說明實測是公式估算的 3-5 倍；ParseBench 排行換成 ParseBench 2，連帶改寫「VLM 圖表領先」「VLM 表格不如專用工具」兩個已不成立的結論。新增 Reducto r-1 mini、AWS Textract Insights、Azure Content Understanding、Google Layout Parser、Datalab、百度文档解析。修正三處舊錯：Mistral OCR batch 是 $2 不是 $1、Azure 承諾層是月費不是年約（最低 $0.45/千頁）、Google Invoice Parser 按份計費（單頁發票每千張 $100）。另更新 LlamaParse 四級 credits、Mathpix、Upstage、LandingAI、Nanonets 價格與 Textract 語言數。

## 參考資料

- [ParseBench: A Document Parsing Benchmark for AI Agents（arXiv:2604.08538）](https://arxiv.org/abs/2604.08538)
- [ParseBench（含 ParseBench 2）Leaderboard — GitHub](https://github.com/run-llama/ParseBench)
- [LlamaIndex — ParseBench 發佈文](https://www.llamaindex.ai/blog/parsebench)
- [Dr.DocBench: Evaluating LLM/VLM Document Parsing（arXiv:2606.01393）](https://arxiv.org/abs/2606.01393)
- [Unstructured — Frontier Models Are Strong But Document Parsing Is Harder（SCORE-Bench）](https://unstructured.io/blog/frontier-models-are-strong-but-document-parsing-is-harder)
- [OCR Arena — 社群盲測 ELO 排名](https://www.ocrarena.ai)
- [Cohere — Introducing Parse](https://cohere.com/blog/parse)
- [Cohere 定價頁](https://cohere.com/pricing)
- [LlamaParse 定價頁](https://www.llamaindex.ai/pricing)
- [Reducto r-1 模型發佈文](https://reducto.ai/blog/parse-r-1-model)
- [Reducto 定價頁](https://reducto.ai/pricing)
- [Mistral OCR 4 發佈文](https://mistral.ai/news/ocr-4/)
- [Mistral OCR 4.1 — 模型頁](https://docs.mistral.ai/models/ocr-4-1)
- [Datalab 定價頁](https://www.datalab.to/pricing)
- [LandingAI 定價頁](https://landing.ai/pricing)
- [Unstructured 定價頁](https://unstructured.io/pricing)
- [Upstage 定價頁](https://www.upstage.ai/pricing)
- [Mathpix OCR API 定價](https://mathpix.com/pricing/api)
- [Nanonets 定價頁](https://nanonets.com/pricing)
- [百度智能云 文字识别 产品价格](https://cloud.baidu.com/doc/OCR/s/tlrzzplc1)
- [Cloudflare Workers AI — Markdown Conversion](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/)
- [AWS Textract 定價](https://aws.amazon.com/textract/pricing/)
- [AWS — Amazon Textract Insights is now generally available](https://aws.amazon.com/about-aws/whats-new/2026/11/textract-insights-ga/)
- [AWS ML Blog — Announcing Amazon Textract Insights](https://aws.amazon.com/blogs/machine-learning/announcing-amazon-textract-insights-verifiable-generative-ai-for-documents/)
- [Azure AI Document Intelligence 定價](https://azure.microsoft.com/en-us/pricing/details/ai-document-intelligence/)
- [Azure Content Understanding 定價](https://azure.microsoft.com/en-us/pricing/details/content-understanding/)
- [Azure Retail Prices API](https://prices.azure.com/api/retail/prices)
- [Google Cloud Document AI 定價](https://cloud.google.com/document-ai/pricing)
- [Claude API 定價](https://platform.claude.com/docs/en/about-claude/pricing)
- [OpenAI API 定價](https://developers.openai.com/api/docs/pricing)
- [Gemini Developer API 定價](https://ai.google.dev/gemini-api/docs/pricing)
- [Document Parsing Unveiled: Techniques, Challenges, and Prospects（arXiv:2410.21169）](https://arxiv.org/abs/2410.21169)
- [AI 模型家族：Claude](/posts/tech/2026-08-24-ai-model-family-claude)、[GPT](/posts/tech/2026-08-24-ai-model-family-gpt)、[Gemini](/posts/tech/2026-08-24-ai-model-family-gemini) — 本站
- [文件解析的三層階梯](/posts/ai/2026-08-06-document-parsing-three-layers)（系列第 1 篇）
- [解析層：當結構要用模型推斷](/posts/ai/2026-08-06-document-parsing-layout-ocr)（系列第 5 篇）
- [掃描 PDF 實測：10 種解析工具](/posts/ai/2026-08-16-scanned-pdf-ocr-benchmark)（系列第 6 篇，2026-08 本機實測，未納入本文提到的新模型）
- [Agentic Parsing：讓 Agent 決定怎麼解析文件](/posts/ai/2026-09-03-agentic-parsing-document-agents)（系列第 7 篇）
- [ColPali：跳過 OCR，直接用圖片做文件檢索](/posts/ai/2026-09-03-colpali-visual-document-retrieval)
- [Table Serialization：表格該怎麼轉成文字](/posts/ai/2026-09-03-table-serialization-rag)
