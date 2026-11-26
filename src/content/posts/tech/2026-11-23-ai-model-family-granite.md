---
title: "IBM Granite——Granite 4.2 推理模型加上 Guardian、Vision、Speech、Embedding 與時間序列，整套 Apache 2.0 的企業小模型"
date: 2026-11-23
category: tech
tags: [ai-agent, llm, ibm, open-source, model-family-granite, reasoning, embedding, speech-to-text, guardrails, model-selection]
lang: zh-TW
type: deep-dive
tldr: "IBM Granite 目前的語言主線是 Granite 4.2（3B、8B、30B 稠密推理模型，可切換思考模式，自架以 128K context 為準），旁邊配 Guardian 4.1（判斷器）、Vision 4.1（文件抽取）、Speech 5.0（語音辨識）、Embedding R2 與時間序列模型。幾乎全部 Apache 2.0，例外是語音 NC 版的非商用授權。Artificial Analysis 給 30B 6 分、8B 5 分，低於同尺寸中位數；它的價值在可以完全自架、授權乾淨、子線齊全，不在單模型分數。"
description: "IBM Granite 模型家族介紹：Granite 4.2 語言模型與 Switch、Guardian、Vision、Speech、Embedding、時間序列各子線的定位、4.0 混合 Mamba 到 4.1／4.2 回到稠密架構的轉折、官方與第三方評測、授權例外、OpenRouter／watsonx／Workers AI 價格與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 39
draft: false
glossary:
  - term: "aLoRA（Activated LoRA）"
    aliases: ["Activated LoRA"]
    definition: "只在被控制 token 啟用之後才作用的 LoRA 轉接器；啟用前的 KV cache 由基底模型產生，所以切換到轉接器時可以直接重用，不必重算整段前文"
  - term: "CTC（Connectionist Temporal Classification）"
    definition: "語音辨識的訓練目標，讓模型直接把音訊幀對齊到文字單位，推論時可以非自回歸地一次輸出，速度比逐字生成的語音語言模型快很多"
---

> :globe: [English version](/posts/tech/2026-11-23-ai-model-family-granite-en)

IBM Granite 是 IBM 的開放權重模型家族，主打企業可以自己部署的小模型，語言模型最大只到 30B。旁邊還有安全判斷、文件視覺、語音、embedding 和時間序列預測等子線，幾乎全部用 Apache 2.0 釋出。這篇寫給要在自己機房或雲端帳號裡組 Agent 管線的開發者：Granite 4.2 該選哪個尺寸、子線各補哪個缺口，以及它跟前沿開放權重模型差多遠。

2026 年 11 月在架的主線是 8 月 25 日發布的 Granite 4.2。它是 Granite 第一個內建思考模式的世代，但架構從 4.0 的混合 Mamba 改回一般的稠密 Transformer。

怎麼解讀文中的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

Granite 是一組可以拆開用的元件，不是一個旗艦加幾個縮小版。下表每列都是 Hugging Face [`ibm-granite` 組織](https://huggingface.co/ibm-granite)下的開放權重：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| [Granite 4.2](https://huggingface.co/ibm-granite/granite-4.2-30b)（3B／8B／30B） | 目前的語言主線 | 稠密 Transformer；思考、不思考、低強度思考三種模式；12 種測試語言；純文字 | 權重（Apache 2.0）；託管只有 8B 上 OpenRouter：$0.06／$0.15 起 |
| [Granite 4.1](https://huggingface.co/ibm-granite/granite-4.1-8b)（3B／8B／30B） | 上一代非推理指令模型，也是 4.2 的 base | 沒有思考模式；watsonx.ai 目前上架的是這一代 | 權重（Apache 2.0）＋watsonx.ai |
| [Granite Switch 4.1](https://huggingface.co/ibm-granite/granite-switch-4.1-8b)（8B／30B） | 一個端點兼顧對話、決策與語音 | 4.1 基底＋decision 與 guardian 兩個 aLoRA＋內嵌語音編碼器 | 權重（Apache 2.0），vLLM 外掛或 llama.cpp |
| [Granite Guardian 4.1 8B](https://huggingface.co/ibm-granite/granite-guardian-4.1-8b) | 輸入輸出判斷器 | 內建有害內容、越獄、RAG／工具呼叫幻覺等準則，也能自訂準則 | 權重（Apache 2.0） |
| [Granite Vision 4.1 4B](https://huggingface.co/ibm-granite/granite-vision-4.1-4b) | 文件影像抽取 | 圖表轉 CSV／程式、表格轉 JSON／HTML、欄位抽取 | 權重（Apache 2.0）＋watsonx.ai |
| [Granite Speech 5.0](https://huggingface.co/ibm-granite/granite-speech-5.0-2b)（2B／470M TurboCTC） | 語音辨識與翻譯 | 2B 是語音語言模型，能翻譯；470M 只做轉錄，速度快一個量級 | 權重（Apache 2.0；NC 版另計） |
| [Granite Embedding Multilingual R2](https://huggingface.co/ibm-granite/granite-embedding-311m-multilingual-r2)（311M／97M） | 多語檢索向量 | 32K context，768／384 維，可截短維度 | 權重（Apache 2.0） |
| Granite Time Series（[TTM-R3](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r3)、[PatchTST-FM-r2](https://huggingface.co/ibm-granite/granite-timeseries-patchtst-fm-r2)、[Ensemble R1](https://huggingface.co/ibm-granite/granite-timeseries-ensemble-r1)） | 零樣本時間序列預測 | 1M 級到約 385M 參數，非語言模型 | 權重（Apache 2.0；PatchTST-FM-r2 雙授權） |

三件事先知道：

- **context 的兩個數字。** [Granite 4.2 模型卡](https://huggingface.co/ibm-granite/granite-4.2-30b)寫「原生 128K，可延伸到 512K」，因為 4.1 base 預訓練最後一階段把長度拉到 512K。但模型設定、官方 vLLM／SGLang 範例、Ollama 與 OpenRouter 都用 131,072 tokens。規劃系統時以 128K 為準，512K 要自己驗證。
- **3B 沒有 agentic 訓練。** 8B 與 30B 多跑了軟體工程、終端、搜尋三段 agentic 強化學習；3B 只有基礎強化學習，官方表格裡 3B 的 SWE-bench 與 Terminal-Bench 都是 NA。
- **4.2 只有文字。** 要看圖用 Vision 4.1 4B，要聽音訊用 Speech 5.0 或 Switch；目前沒有同時吃多種模態的 Granite 4.2。

### 子線與生態

- **Switch 與 Granite Libraries。** [Granite Libraries](https://huggingface.co/collections/ibm-granite/granite-libraries)（`granitelib-core`、`granitelib-rag`、`granitelib-guardian`）是一批針對 RAG 改寫、幻覺偵測、政策檢查等任務訓練的 aLoRA 轉接器。Switch 把其中幾個和基底模型組成同一個 checkpoint；Switch 4.1 預設只放 decision 與 guardian-core 兩個，[preview 版](https://huggingface.co/ibm-granite/granite-switch-4.1-8b-preview)則放了 12 個。應用端建議透過 IBM 的 [Mellea](https://github.com/generative-computing/mellea) 函式庫呼叫。
- **Docling。** 文件轉換工具 [Docling](/posts/tech/2026-09-06-docling-document-parsing) 的 VLM 路徑預設綁 [Granite-Docling 258M](https://huggingface.co/ibm-granite/granite-docling-258M)，Vision 4.1 4B 也能接進 Docling 做圖表與表格的深度抽取。
- **實驗線。** [Granite-SWASH-3B-A600M](https://huggingface.co/ibm-granite/granite-swash-3b-a600m)是滑動視窗注意力加 attention sink 的 MoE，官方標為下一代 Granite 的預覽。[Granite 4.1 LLMON preview](https://huggingface.co/ibm-granite/granite-4.1-8b-llmon-preview)把 prompt 各段包成可定址區塊，明確分開可信指令與不可信資料。兩者都放在 Granite Experiments 集合，不是正式產品。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| Granite Code | 2024-05-06 | 3B 到 34B 的程式碼模型，IBM 第一批大量開放權重 | — |
| Granite 3.0 | 2024-10-21 | 通用 2B／8B 指令模型以 Apache 2.0 釋出，同期推出 Guardian 3.0 | — |
| Granite 3.1／3.2／3.3 | 2024-12 至 2025-04 | 3.1 把 context 拉到 128K；3.2 加入可開關的思考模式；Vision 與 Speech 子線在這段期間成形 | — |
| Granite 4.0 | 2025-10-02 | 改成混合 Mamba-2／Transformer，長 context 與多工作階段的記憶體大降；首批取得 ISO 42001 認證、checkpoint 加密簽章 | [Workers AI 指南](/posts/ai/2026-08-18-workers-ai-model-guide)（4.0-H-Micro） |
| Granite 4.1 | 2026-04-29 | 回到稠密 Transformer，約 15T tokens 預訓練；IBM 稱 8B 追平 4.0-H-Small（32B-A9B）。Guardian、Vision、Embedding R2 同月換代 | — |
| Granite 4.2 | 2026-08-25 | 第一個內建思考模式的世代，8B／30B 加 agentic 強化學習；同日推出 Speech 5.0 TurboCTC | [每日摘要](/posts/daily/2026-08-29-ai-agent-daily)、[Speech 5.0](/posts/daily/2026-08-28-ai-agent-daily) |
| Granite Switch 4.1／4.1.1 | 2026-10-14／10-27 | 對話、決策、安全判斷與語音共用一個端點；4.1.1 換新 decision 權重並支援 7 種語音語言 | [4.1](/posts/daily/2026-10-17-ai-agent-daily)、[4.1.1](/posts/daily/2026-10-30-ai-agent-daily) |
| Speech 5.0 2B | 2026-10-20 | 語音語言模型主線換代，翻譯與關鍵字偏置擴充 | — |

站上沒有 Granite 的每日模型卡，上表連到的是當天的每日摘要。主軸有兩條。第一條是架構：4.0 押注混合 Mamba 換取長 context 的記憶體效率，4.1 卻改回稠密，IBM Research 的說法是稠密架構相容性較廣，方便雲端、機房與邊緣裝置都能跑。第二條是從單一語言模型擴成可組裝的元件庫：Guardian、Libraries 與 Switch 讓「安全檢查」「RAG 子任務」變成掛在同一個基底上的轉接器。4.0 的混合架構模型（H-Micro、H-Tiny、H-Small）仍在 Hugging Face、watsonx.ai 與 Workers AI 上，但已不是這篇的選型對象。

## 架構與訓練取捨

### Granite 4.2：小尺寸稠密模型加上分段強化學習

[Granite 4.2 技術部落格](https://huggingface.co/blog/ibm-granite/granite-4-2)與模型卡揭露的設計：

- **主幹**：稠密 decoder-only，GQA（8 個 KV head）、RoPE（θ＝10,000,000）、SwiGLU、RMSNorm，輸入與輸出 embedding 不共用。3B 與 8B 都是 40 層，30B 是 64 層。
- **預訓練**：沿用 4.1 base，約 15T tokens、五階段，前兩階段打底並加重數學與程式碼，中間兩階段用高品質資料退火，最後一階段分段把 context 從 4K 延伸到 512K。[IBM Research 公告](https://research.ibm.com/blog/introducing-granite-4-2)另提到 1T tokens 的合成程式碼資料，以及加快輸出的投機解碼層。
- **SFT**：約 720 萬筆、100B tokens，其中 agentic 資料占 31.6%（再細分，軟體工程占 69%）。資料由 OpenHands、OpenCode、SWE-agent、Codex 等十幾種 agent 框架產生，再用 LLM 當評審過濾掉幻覺、無效工具呼叫與呼叫未定義函式的樣本。30B 另跑第二段 SFT，加重 agentic coding 資料。
- **強化學習**：每個階段都是獨立的非同步 GRPO 訓練，接續上一階段的 checkpoint。順序是可驗證獎勵（數學、程式、科學、指令遵循、工具呼叫）→ 指令遵循與程式碼加強 → 軟體工程 agent（真實 repo 沙盒，跑隱藏測試）→ 終端 agent → 搜尋 agent（LLM 評審最終答案）→ RLHF。RLHF 階段同時加了推理長度懲罰，壓低前面階段養出的冗長思考。

分段的好處是每段只優化一種能力、獎勵訊號乾淨；代價是 3B 被排除在 agentic 階段外，三個尺寸的能力差距不只是參數量。

### 為什麼從混合 Mamba 改回稠密

[Granite 4.0 公告](https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models)的賣點是 H 系列每 40 層只有 4 層注意力、其餘 36 層是 Mamba-2，長 context 與多個並行工作階段的記憶體用量大幅下降。但混合架構需要推論框架額外支援，IBM 當時就另外發了傳統 Transformer 版的 4.0-Micro 給還不支援的平台。[Granite 4.1 部落格](https://huggingface.co/blog/ibm-granite/granite-4-1)改用稠密架構後，宣稱 8B 指令模型追平或超過 4.0-H-Small。對自架者來說，4.2 的實際影響是：任何支援一般 Transformer 的框架都能跑，但長 context 的 KV cache 回到隨長度線性成長，128K 長度下記憶體成本比 4.0-H 高。

### 子線的架構重點

- **Switch**：轉接器都是 aLoRA，基底模型算出的 KV cache 可以直接給後續的決策或安全判斷重用；[Switch 4.1 部落格](https://huggingface.co/blog/ibm-granite/granite-switch-4-1)說整個組合占用的 VRAM 約等於單一基底模型。語音則是把 TurboCTC 的轉錄結果貼回對話，[模型卡](https://huggingface.co/ibm-granite/granite-switch-4.1-8b)明講語音編碼器與 LLM 沒有聯合訓練。
- **Speech 5.0 TurboCTC**：只有編碼器、沒有 LLM，16 層 Conformer 加 CTC，輸出速率降到每秒 12.5 個 token。[發布部落格](https://huggingface.co/blog/ibm-granite/granite-speech-5-0-470m-turboctc)寫得很清楚：換來 20 倍以上的吞吐，放棄語音翻譯與關鍵字偏置。需要翻譯的話用 [Speech 5.0 2B](https://huggingface.co/ibm-granite/granite-speech-5.0-2b)，它是把 granite-4.0-1b-base 對齊到語音的語音語言模型。
- **Vision 4.1 4B**：基於 Granite 4.1 3B，3.4B 語言模型加 0.6B 視覺編碼器，用任務標籤（`<chart2csv>`、`<tables_html>` 等）切換抽取任務。
- **Embedding R2**：ModernBERT 架構，97M 版是從 311M 版剪層、縮減詞表而來。

## 評測與競品比較

### 官方自報：Granite 4.2 三個尺寸

以下摘自 [Granite 4.2 模型卡](https://huggingface.co/ibm-granite/granite-4.2-30b)與技術部落格，IBM 以 NeMo Evaluator SDK 為基礎的框架測得：

| Benchmark | 3B | 8B | 30B |
|---|---|---|---|
| SWE-bench Verified | NA | 47.67 | 57.00 |
| SWE-bench Pro | NA | 19.11 | 33.29 |
| Terminal-Bench 2.1 | NA | 20.56 | 29.24 |
| τ³-bench（平均） | 45.78 | 58.06 | 62.00 |
| BFCL v4 | 52.41 | 52.39／50.29 | 61.39 |
| AIME25 | 78.33 | 86.67 | 89.17 |
| GPQA | 54.80 | 64.14 | 66.41 |
| IFBench（prompt） | 74.33 | 79.33 | 77.17 |
| RULER 128K | 55.30 | 71.41 | 81.38 |

讀法：

- **8B 到 30B 的落差集中在 agentic coding。** SWE-bench Pro 從 19 跳到 33，推理與指令遵循則只差幾分；只做 RAG 與文件任務的話，8B 的 CP 值較高。
- **官方文件之間有小出入。** 8B 的 BFCL v4 模型卡寫 52.39、部落格表格寫 50.29，表中兩個都列。部落格內文說注意力頭是 40 個，但同篇架構表寫 8B 與 30B 是 32 個；本文依架構表。
- **沒有文字形式的競品對照。** [IBM Research 公告](https://research.ibm.com/blog/introducing-granite-4-2)只附了一張 30B 與同級模型的比較圖，沒有逐項數字，這裡不轉成表。

### 第三方：Artificial Analysis

[Artificial Analysis](https://artificialanalysis.ai/models/granite-4-2-30b) 的 Intelligence Index v5.0.1 給 Granite 4.2 30B 6 分，在 4B–40B 開放權重模型中低於中位數 10；[8B](https://artificialanalysis.ai/models/granite-4-2-8b) 5 分；[3B](https://artificialanalysis.ai/models/granite-4-2-3b) 也是 5 分，但在 4B 以下的小模型類別高於中位數 4。這套指數以 Terminal-Bench 4.0、FrontierCode、HLE 等高難度 agent 任務為主，對小模型很嚴苛；作為參照，[Tencent Hy4](/posts/tech/2026-11-23-ai-model-family-tencent-hy) 拿 35 分。Artificial Analysis 也量到 8B 跑完整套指數平均每題 $0.0405、輸出約 100 tok/s，冗長程度在同類中段。

### 子線的官方數字

這些都是 IBM 在模型卡自報的結果，比較對象與條件以各卡為準：

- **Speech 5.0 TurboCTC**：[發布部落格](https://huggingface.co/blog/ibm-granite/granite-speech-5-0-470m-turboctc)在單張 H200 上量到 12,600 以上的 RTFx（每秒可轉錄超過 3.5 小時音訊），當時 Open ASR Leaderboard 速度前段約 6,000。10 月的多語版[模型卡](https://huggingface.co/ibm-granite/granite-speech-5.0-470m-turboctc)寫英文平均 WER 5.51%，比英文版的 5.78% 好；這組數字和部落格發布時寫的 5.00% 彙總方式不同，不能直接相比。日文 CER 在三個測試集都勝過 2B 版。
- **Embedding R2**：Multilingual MTEB Retrieval（18 項）311M 得 65.2、97M 得 60.3；IBM 稱 97M 是 100M 以下開放多語模型的最高分。
- **Guardian 4.1 8B**：自訂準則的 IFEval 多條件平衡準確率從 Guardian 3.3 的 0.458 升到 0.844；在 JETTS 當 best-of-N 獎勵模型拿 70.29，高於測試過的 70B 以下獎勵模型。
- **Vision 4.1 4B**：VAREX 文件欄位抽取零樣本 exact match 94.2%。
- **時間序列**：PatchTST-FM-r2 的模型卡寫，到 2026-08-31 為止它是 GIFT-Eval 上寬鬆商用授權的零樣本模型第一名，納入所有可重現的零樣本模型則排第二；Ensemble R1 在 10-20 的 GIFT-Eval 快照排第三。
- **Switch decision aLoRA**：Jev Decision Index v0.3 總分 46.72。這套決策模型榜單怎麼讀，見[決策模型選型](/posts/tech/2026-10-22-ai-model-family-decision-models)。

## 授權、價格與部署

### 授權：Apache 2.0，加兩個例外

Granite 4.2 的 Hugging Face repo 沒有另放 LICENSE 檔，授權由 metadata 的 `apache-2.0` 與模型卡連到的 Apache 2.0 原文決定。IBM Research 的公告寫明企業可以下載、微調、上線而「沒有授權限制」，沒有營收或月活門檻，也沒有地區排除。整個 `ibm-granite` 組織 252 個 repo 裡，要注意的例外是：

| 模型 | 授權 | 影響 |
|---|---|---|
| [granite-speech-5.0-470m-turboctc-nc](https://huggingface.co/ibm-granite/granite-speech-5.0-470m-turboctc-nc) | CC-BY-NC-SA-4.0 | 只限研究與非商用；用了更多受限資料，英文 WER 略好。商用請選同名不帶 `-nc` 的 Apache 版 |
| [granite-timeseries-patchtst-fm-r2](https://huggingface.co/ibm-granite/granite-timeseries-patchtst-fm-r2) | OpenMDW 1.0 或 Apache 2.0 擇一 | 雙授權，選 Apache 2.0 即可照一般方式使用 |

少數 GGUF 轉檔 repo 沒有填 license metadata，用之前回原始 repo 確認。另外 IBM 從 4.0 世代開始替 Hugging Face 上的 checkpoint 加密簽章，可以驗證檔案來源。

### 託管價格

| 通路 | 模型 | 價格（每 1M tokens，輸入／輸出） |
|---|---|---|
| [OpenRouter](https://openrouter.ai/ibm-granite/granite-4.2-8b) | Granite 4.2 8B | CoreWeave $0.06／$0.15、DeepInfra $0.06／$0.25；快取讀取 $0.015 |
| [watsonx.ai](https://www.ibm.com/products/watsonx-ai/pricing) | Granite 4.0-H-Small | $0.0636／$0.265 |
| [Workers AI](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/) | Granite 4.0-H-Micro | $0.017／$0.112，131K context |

- **Granite 4.2 的託管選擇很少。** OpenRouter 只有 8B，context 131K，預設開啟推理（`reasoning_effort` 可選 high、low、none）；OpenRouter 統計的加權實付價約 $0.036／$0.183。30B 在 Artificial Analysis 標為沒有公開 API。
- **watsonx.ai 停在 4.1 世代。** 定價頁列出 granite-4-1-3b／8b／30b、Vision 4.1 4B 與 Speech 4.1 2B，沒有 Granite 4.2；要用 4.2 得在 watsonx 自行部署或改走其他通路。
- **Workers AI** 仍只有 4.0-H-Micro，用法見 [Workers AI 模型指南](/posts/ai/2026-08-18-workers-ai-model-guide)。

### 自架

- **檔案大小**：[Ollama](https://ollama.com/library/granite4.2) 的 `granite4.2:3b` 約 2.2GB、`8b` 5.3GB、`30b` 18GB，三者都是 128K context。官方另發 FP8、NVFP4、MXFP4、GGUF 與 Apple MLX 版本。
- **vLLM**：需要 v0.20 以上，推理解析器用 repo 附的 `granite_thinking_parser`（內建的 `nemotron_v3` 也能用），工具呼叫解析器用 `qwen3_coder`。**SGLang** v0.5.18 以上，解析器設 `auto`。
- **取樣參數是硬規定**：模型卡要求所有任務與後端都用 `temperature=1.0`、`top_p=0.95`，沿用其他模型的低溫設定可能讓效果變差。
- **思考模式**：chat template 參數 `enable_thinking=True/False`，加 `low_effort=True` 是低強度思考；多輪對話預設會刪掉前幾輪的思考內容（`truncate_history_thinking`）以節省 context。

## Agent 使用與選型

- **在自己的 GPU 上跑工具呼叫、RAG 與文件流程** → Granite 4.2 8B。授權沒有門檻，量化後約 5GB，τ³-bench 只比 30B 低 4 分。
- **自架的 coding agent** → Granite 4.2 30B，SWE-bench Verified 57 分，官方模型卡附了 OpenCode、Pi、OpenHands 的設定範例。要跟前沿模型比 coding，它不是同一個量級。
- **手機、筆電或極低延遲** → 3B 或 4.0-H-Micro；3B 沒受過 agentic 訓練，多步驟工具迴圈別交給它。
- **檢查 Agent 的輸入輸出** → Guardian 4.1 8B，越獄、有害內容、RAG 是否有依據、工具呼叫幻覺都有內建準則，也能用一句自然語言寫自訂準則。
- **同一個端點要同時對話、分類決策與轉錄語音** → Switch 4.1，省掉多個模型的 VRAM。
- **圖表、表格、表單抽取** → Vision 4.1 4B，或在 Docling 管線裡用 Granite-Docling。
- **大量轉錄** → Speech 5.0 TurboCTC；要翻譯或關鍵字偏置改用 Speech 5.0 2B。
- **多語檢索** → Embedding Multilingual R2，延遲優先選 97M。
- **需求預測、監控指標預測** → TTM-R3 先跑零樣本，或用 Ensemble R1 免去挑模型。

一個最小的組合：Granite 4.2 8B 當主模型、Guardian 4.1 8B 在每輪前後各判一次、Embedding R2 做檢索，三者都是 Apache 2.0，可以全部放在同一個私有環境。選型驗證時，把同一組任務分別用 `enable_thinking=False`、`low_effort=True` 和完整思考各跑一次，比較完成率、輸出 token 與延遲；Guardian 則用你自己的違規樣本量誤判率，不要只看官方的平衡準確率。

## 限制與取捨

- **整體能力離前沿很遠。** Artificial Analysis 的 30B 與 8B 都低於同尺寸中位數，官方表也沒有直接的競品數字。Granite 的強項是可控、可自架、授權乾淨，不是榜單名次。
- **評測多半是自報。** 子線的 MTEB、JETTS、VAREX、GIFT-Eval 數字都來自 IBM 模型卡；官方文件之間還有小出入（BFCL、注意力頭數，以及 IBM Research 公告說 4.2 建在「Granite 4.0 基礎模型」上，模型卡寫的是 4.1 base）。
- **512K context 是預訓練長度，不是服務長度。** 官方部署範例全用 128K，RULER 128K 的 8B 也只有 71 分。
- **3B 能力少一段。** 沒有 agentic 強化學習，官方沒給它 coding agent 分數。
- **授權例外藏在名稱裡。** 語音 `-nc` 版是非商用授權，下載時要看清楚名稱。
- **託管通路少。** Granite 4.2 只有 8B 上 OpenRouter，watsonx.ai 還在 4.1，想要不自架就用最新世代的選擇有限。
- **Switch 的語音只是串接。** 語音編碼器與 LLM 沒有聯合訓練，轉錄錯誤會直接流進後面的對話與決策。

Granite 的定位可以概括成：用 Apache 2.0 提供一整套企業 Agent 需要的小零件，讓團隊在自己的環境裡把主模型、安全判斷、檢索、語音和文件抽取全部換成開放權重。需要前沿推理或 coding 能力時，它適合當管線裡的工人與守門員，主腦另外找。

## 參考資料

- [ibm-granite — Hugging Face 組織頁](https://huggingface.co/ibm-granite)
- [ibm-granite/granite-4.2-30b — HuggingFace 模型卡（規格、評測、部署）](https://huggingface.co/ibm-granite/granite-4.2-30b)
- [ibm-granite/granite-4.2-8b — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-4.2-8b)
- [ibm-granite/granite-4.2-3b — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-4.2-3b)
- [Granite 4.2 LLMs: How They're Built — Hugging Face 技術部落格](https://huggingface.co/blog/ibm-granite/granite-4-2)
- [Granite 4.2 brings native reasoning to enterprise agents — IBM Research](https://research.ibm.com/blog/introducing-granite-4-2)
- [Granite 4.1 LLMs: How They're Built — Hugging Face 技術部落格](https://huggingface.co/blog/ibm-granite/granite-4-1)
- [ibm-granite/granite-4.1-8b — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-4.1-8b)
- [IBM Granite 4.0: hyper-efficient, high performance hybrid models — IBM 公告](https://www.ibm.com/new/announcements/ibm-granite-4-0-hyper-efficient-high-performance-hybrid-models)
- [ibm-granite/granite-4.0-h-small — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-4.0-h-small)
- [ibm-granite/granite-3.0-8b-instruct — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-3.0-8b-instruct)
- [ibm-granite/granite-8b-code-instruct-4k — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-8b-code-instruct-4k)
- [ibm-granite/granite-switch-4.1-8b — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-switch-4.1-8b)
- [ibm-granite/granite-switch-4.1-8b-preview — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-switch-4.1-8b-preview)
- [Granite Switch 4.1: Chat, Decisions, and Speech from One Endpoint — Hugging Face 部落格](https://huggingface.co/blog/ibm-granite/granite-switch-4-1)
- [Granite Libraries — Hugging Face 集合](https://huggingface.co/collections/ibm-granite/granite-libraries)
- [Mellea — GitHub](https://github.com/generative-computing/mellea)
- [ibm-granite/granite-guardian-4.1-8b — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-guardian-4.1-8b)
- [ibm-granite/granite-vision-4.1-4b — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-vision-4.1-4b)
- [ibm-granite/granite-docling-258M — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-docling-258M)
- [ibm-granite/granite-speech-5.0-2b — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-speech-5.0-2b)
- [ibm-granite/granite-speech-5.0-470m-turboctc — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-speech-5.0-470m-turboctc)
- [ibm-granite/granite-speech-5.0-470m-turboctc-nc — HuggingFace 模型卡（CC-BY-NC-SA-4.0）](https://huggingface.co/ibm-granite/granite-speech-5.0-470m-turboctc-nc)
- [Extremely Fast and Accurate Transcription with Granite Speech 5.0 Turbo CTC — Hugging Face 部落格](https://huggingface.co/blog/ibm-granite/granite-speech-5-0-470m-turboctc)
- [ibm-granite/granite-embedding-311m-multilingual-r2 — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-embedding-311m-multilingual-r2)
- [ibm-granite/granite-embedding-97m-multilingual-r2 — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-embedding-97m-multilingual-r2)
- [ibm-granite/granite-timeseries-ttm-r3 — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-timeseries-ttm-r3)
- [ibm-granite/granite-timeseries-patchtst-fm-r2 — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-timeseries-patchtst-fm-r2)
- [ibm-granite/granite-timeseries-ensemble-r1 — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-timeseries-ensemble-r1)
- [ibm-granite/granite-swash-3b-a600m — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-swash-3b-a600m)
- [ibm-granite/granite-4.1-8b-llmon-preview — HuggingFace 模型卡](https://huggingface.co/ibm-granite/granite-4.1-8b-llmon-preview)
- [IBM: Granite 4.2 8B — OpenRouter（供應商與價格）](https://openrouter.ai/ibm-granite/granite-4.2-8b)
- [Granite 4.2 30B — Artificial Analysis](https://artificialanalysis.ai/models/granite-4-2-30b)
- [Granite 4.2 8B — Artificial Analysis](https://artificialanalysis.ai/models/granite-4-2-8b)
- [Granite 4.2 3B — Artificial Analysis](https://artificialanalysis.ai/models/granite-4-2-3b)
- [watsonx.ai pricing — IBM](https://www.ibm.com/products/watsonx-ai/pricing)
- [granite-4.0-h-micro — Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/models/granite-4.0-h-micro/)
- [granite4.2 — Ollama](https://ollama.com/library/granite4.2)
- [Docling 文件解析](/posts/tech/2026-09-06-docling-document-parsing) — 本站
- [Workers AI 模型指南](/posts/ai/2026-08-18-workers-ai-model-guide) — 本站
- [決策模型怎麼選](/posts/tech/2026-10-22-ai-model-family-decision-models) — 本站
- [Tencent Hy（混元）模型家族](/posts/tech/2026-11-23-ai-model-family-tencent-hy) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
