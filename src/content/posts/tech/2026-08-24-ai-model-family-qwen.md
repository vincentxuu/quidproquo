---
title: "Qwen——從 0.8B 到 2.4T 的全尺寸家族，Qwen4-Max 閉源登場、開源線改由小模型接棒"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, qwen, open-source, model-family-qwen, moe, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Qwen 是 HuggingFace 下載量最高的模型家族。2026-11-16 上線的 Qwen4-Max 換上新架構（QSA 稀疏注意力、Gated Residual、N-gram Embedding），2.4T 總參數只啟用 71B，API 降到 $1.50／$4.50，但不釋出權重；官方說 Qwen4 的小模型會開源，尚未給日期。目前能下載的仍是 3.8 世代：27B（Apache 2.0）、Flash-Next（Qwen Community License）、2.4T-A95B（自訂 Max License），三種授權對商用的限制各不相同。這篇整理家族演化、Qwen4 架構取捨、各層定價與授權，以及現在該怎麼選。"
description: "Qwen（通義千問）模型家族介紹：Qwen4-Max 規格與定價、Qwen4 架構（QSA、Gated Residual、N-gram Embedding）、3.8 世代開放權重的三種授權、QwenCloud 定價、2023→2026 演化時間線與 Agent 選型。"
series:
  name: "AI 模型家族"
  order: 2
draft: false
glossary:
  - term: "Gated DeltaNet"
    definition: "線性注意力（linear attention）家族的變體，用遞迴狀態取代完整的注意力矩陣，處理長序列時計算量隨長度線性增長而非平方增長。Qwen3.5 起用它取代部分傳統 attention 層"
  - term: "QSA（Qwen Sparse Attention）"
    aliases: ["Qwen Sparse Attention"]
    definition: "Qwen4 架構的稀疏注意力層：用輕量 indexer 以 micro-block 為單位挑出相關的上下文再做注意力，降低長序列的注意力與索引成本。每個 QSA 層搭配三個 Gated DeltaNet 層"
  - term: "N-gram Embedding"
    definition: "在第二層用短 n-gram（bigram／trigram）查表提供局部 token 模式的表示。它增加參數容量但幾乎不增加計算，也比 MoE 專家更容易 offload 到記憶體"
  - term: "AxB-AyB 命名法"
    aliases: ["MoE 參數標記"]
    definition: "MoE 模型的參數標記：Ax 代表總參數量、Ay 代表每個 token 實際啟用的參數量。例如 397B-A17B 是總參數 397B、每次只啟用 17B"
  - term: "早期融合（early fusion）"
    aliases: ["early fusion"]
    definition: "從預訓練階段就把文字、圖片、影片混在一起訓練，而不是訓練完文字模型再外掛視覺 adapter。原生多模態能力的來源"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-qwen-en)

Qwen（通義千問）是 HuggingFace 下載量最高的模型家族（見[系列導讀](/posts/tech/2026-08-24-ai-model-landscape-overview)），尺寸從手機端的 0.8B 一路到 2.4T。這篇寫給要在 Qwen 裡挑模型的 Agent 開發者：API 旗艦選 Qwen4-Max 還是 3.8 世代、要自架該下載哪一個、三種開放權重授權各擋住什麼用途。

2026 年 11 月的局面是：API 端換成 Qwen4-Max，能下載的權重仍停在 3.8 世代。阿里在 8 月第一次開源 Max 級權重，三個月後的 Qwen4-Max 又回到閉源，只承諾 Qwen4 的小模型會開源。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。

## 家族定位與版本矩陣

以下為 2026-11-20 對照 [QwenCloud 定價頁](https://docs.qwencloud.com/developer-guides/getting-started/model-prices)與 HuggingFace 模型卡核對的國際區（Singapore）牌價，每 1M tokens：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式與價格 |
|---|---|---|---|
| Qwen4-Max（`qwen4-max`） | 目前旗艦 | Qwen4 新架構，2.4T 總參數、71B 啟用，1M context，輸入文字／圖片／影片 | 僅 API：$1.50／$4.50，快取命中 $0.075；不釋出權重 |
| Qwen3.8-Max（`qwen3.8-max`，現指向 0902 快照） | 上一代旗艦 | 9/5 起自動指向 `qwen3.8-max-0902` | API：$2／$6，快取命中 $0.25 |
| Qwen3.8-2.4T-A95B | 可自架的旗艦權重 | Qwen3.8-Max 的權重版，純文字、必開思考模式 | 開放權重，自訂 Qwen3.8-Max License |
| Qwen3.7-Plus（`qwen3.7-plus`） | 中階多模態 API | 256K 以內 $0.40／$1.60，超過 256K 改收 $1.20／$4.80 | 僅 API，目前限時八折 |
| Qwen3.8-Flash（`qwen3.8-flash`） | 低價 API | 以 Flash-Next 為基礎的正式服務版，預設 1M context | API：$0.15／$0.47 |
| Qwen3.8-Flash-Next | Qwen4 架構預覽權重 | 125B 總參數、6B 啟用，另有 51B N-gram Embedding | 開放權重，Qwen Community License 1.0 |
| Qwen3.8-27B | 本地多模態 | 稠密 27B、原生圖片與影片理解 | 開放權重，Apache 2.0 |
| Qwen3-Embedding／Reranker | RAG | 0.6B／4B／8B 三種尺寸 | 開放權重，Apache 2.0 |

API 型號裡的 Max／Plus／Flash 是服務層級標籤，不保證有可下載權重；Qwen4-Max 就是同名旗艦裡沒有權重的那一個。判斷能不能自架，看授權欄位，不看型號後綴。

### 兩條產品線：開源換生態，閉源收營收

**開源線**（HuggingFace 上的 `Qwen` org）：從 3.5 到 3.8 的各代檢查點。這條線負責生態位——Ollama、vLLM、SGLang、llama.cpp 都支援，微調社群把它當基底模型的首選。3.8 世代起，開源權重不再一律 Apache 2.0，而是依模型層級換授權（見「授權、價格與部署」）。

**商用線**（QwenCloud／Model Studio 的 API）：Max 層級長期只在 API 上架。3.6 世代的商用三 SKU 只在 DashScope 上架，3.7 整代不釋出權重。

中間還有人事轉折。[2026 年初 Qwen 核心技術負責人離職](https://modelfit.io/blog/qwen-team-exodus-alibaba/)，之後兩個世代往閉源傾斜。2026 年 8 月的 Qwen3.8 反過來第一次把 Max 級模型開源，[HuggingFace 模型卡](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)寫明這是「first time」把 Max 級模型放進開放發布。

到了 Qwen4，旗艦又只上 API。[官方公告](https://qwen.ai/blog?id=qwen4-max)只說「家族裡較小的模型會開源」，沒有給尺寸、授權或日期；[Alibaba 新聞稿](https://www.alibabagroup.com/en-US/document-2060139246777270272)的說法相同。所以「Qwen 的旗艦會開源」在 3.8 世代成立過一次，不能當成家族慣例。

### 子線與生態系

除了通用主線，Qwen 同時經營多條子線：

| 子線 | 演化路徑 | 狀態（2026-11） |
|---|---|---|
| 通用主線 | 3.5（開源）→ 3.6／3.7 商用線（閉源）→ 3.8（Max API＋三款開放權重）→ Qwen4-Max（僅 API） | 見本節矩陣 |
| Coder | Qwen2.5-Coder → Qwen3-Coder 480B-A35B → Coder-Next 80B-A3B | Apache 2.0；[2026 年 3 月後無新版](https://www.scriptbyai.com/qwen-timeline)，coding 能力改由主線旗艦承擔 |
| 視覺語言 | Qwen2.5-VL → [Qwen3-VL-235B](https://huggingface.co/collections/Qwen/qwen3-vl) → 主線原生多模態 | 由 3.5 起的主線接手 |
| 推理 | QwQ-32B 獨立研究線 → 思考模式併入 Qwen3 主線 | 已收編 |
| Omni／語音 | Qwen2-Audio → Qwen3-Omni 30B-A3B（Apache 2.0）→ 3.5-Omni、Audio-3.0 系列 | 新版自 2026 年 7 月中起純 API、不附權重 |
| 影像生成 | Qwen-Image → 2.0（Apache 2.0）→ Image-3.0（閉源 API）／[Qwen-Image-2.1](/posts/daily/2026-09-20-model-qwen-image-2-1)（開放權重，僅限非商業研究） | 2.1 的規格與授權見其模型卡 |
| Embedding／Reranker | Qwen3-Embedding 與 Qwen3-Reranker（0.6B/4B/8B） | Apache 2.0，RAG 現役主力 |
| Math | Qwen2.5-Math → 數學能力併入主線 | 已收編 |

兩個趨勢：

**能力往主線收編。** Coder、Math、QwQ 都已停止獨立迭代。通用模型的專項能力夠強之後，維護獨立子線就不划算。視覺不是砍掉 VL 線，而是用早期融合把視覺變成主線的天生能力。

**授權往下分層。** 理解類小模型繼續 Apache 2.0；媒體生成類新版不是閉源就是非商業授權；旗艦權重附帶商用條件，或乾脆不給。

部署生態是隱性優勢：AWS Bedrock、Google Vertex AI Model Garden、NVIDIA NIM 都託管過 Qwen 的開放權重模型，再加上 OpenRouter、Together、Fireworks 等第三方。工具端有終端 Agent Qwen Code、程式開發產品 Qoder、辦公助理 QwenWork，以及 Qwen4-Max 一起開源的 [Live Delivery 外掛](https://github.com/QwenLM/Qwen-Live-Delivery-Plugin)。

## 家族演化

| 版本 | 發佈 | 改變了什麼選型 | 站上紀錄 |
|---|---|---|---|
| Qwen-7B／14B | 2023-08 | 初代開源，通義千問品牌亮相 | — |
| Qwen1.5 | 2024-02 | 0.5B～72B 全尺寸覆蓋，自架可以依硬體挑尺寸 | — |
| Qwen2 | 2024-06 | 72B 旗艦、128K context | — |
| Qwen2.5 | 2024-09 | Coder／VL／Math 專模型線成形，專項任務有獨立選項 | — |
| Qwen3 | 2025-04 | 235B-A22B MoE、思考模式可切換；閉源 Qwen3-Max 首次現身，旗艦開始和開源線分開 | — |
| Qwen3-Coder／Next | 2025-07／09 | Coder 480B-A35B；Next-80B-A3B 首次試驗超稀疏 MoE＋Gated DeltaNet 混合佈局 | — |
| Qwen3.5 | 2026-02 | 397B-A17B 開源旗艦，原生多模態、201 語言；Gated DeltaNet 升為主線架構 | — |
| Qwen3.6／3.7 商用線 | 2026-04～06 | Max／Plus／Flash 只上 API，3.7 整代無開放權重；想自架只能停在 3.5／3.6 開源線 | — |
| Qwen3.8-Max | 2026-08-03 | 2.4T-A95B，$2／$6；9/5 起 API 自動指向 0902 快照 | — |
| Qwen3.8 開放權重 | 2026-08 中旬 | 第一次開源 Max 級權重（自訂授權）；27B 以 Apache 2.0 成為本地多模態首選 | — |
| Qwen3.8-Flash-Next | 2026-08-26 | Qwen4 架構第一次公開，6B 啟用；授權改為 Qwen Community License，MaaS 與程式／辦公助理業者要另取授權 | [模型卡](/posts/daily/2026-08-26-model-qwen-qwen3-8-flash-next) |
| Qwen4-Max | 2026-11-16（11/11 起 Token Plan 預覽） | 新架構、71B 啟用、降價 25%，但旗艦回到閉源；要自架仍得用 3.8 | [模型卡](/posts/daily/2026-11-18-model-qwen-qwen4-max) |

前半段的劇本是「開源建立生態」，2026 年多了第二條主軸：商用線與開源線分家，開源授權按模型層級重新劃界。Qwen3.8-Max 在主篇降為上一代；它的完整評測表（Terminal-Bench 2.1、SWE-bench Pro、LongBench v2 等）保留在 [HuggingFace 模型卡](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)，本站更新紀錄也記下移出的範圍。

## 架構與訓練取捨

### Qwen4：注意力、殘差、嵌入三處同時改

[Qwen4-Max 官方公告](https://qwen.ai/blog?id=qwen4-max)寫明新架構：2.4T backbone、每 token 啟用 71B，另加 328B 的 N-gram Embedding 參數。改動集中在三處：

- **GDN＋QSA**：每三個 Gated DeltaNet 層把歷史壓進固定大小的狀態，再接一個 QSA 層。QSA 用輕量 indexer 以 micro-block 為單位挑出相關上下文，而不是逐 token 挑選，降低長序列的注意力與索引成本。3.8 世代同一位置用的是 Gated Attention。
- **Gated Residual**：四條並行殘差分支，各有動態讀寫閘門，目標是加強跨層資訊流並穩定訓練。
- **N-gram Embedding**：在第二層用 n-gram 查表提供局部 token 模式。[Flash-Next 模型卡](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)的說法是：嵌入是另一條擴參數的軸，計算量比 MoE 少、也更容易 offload，適合記憶體吃緊的加速器。

官方報告的效果：2.4T 規模預訓練全程沒有 loss spike；Base 模型在知識、程式、問答、STEM 的 bits per byte 比 Qwen3.8-Max-Base 低約 5–13%，啟用參數少 25%。這些都是阿里自家評測。

這套架構先在 8 月的 Flash-Next 以 125B／6B 的小規模公開權重，三個月後才放大到 Max。想在本地研究 Qwen4 架構的人，目前唯一能下載的就是 Flash-Next。

### Gated DeltaNet：讓長 context 變便宜

傳統 Transformer 的注意力計算量隨序列長度平方增長。Gated DeltaNet 用固定大小的遞迴狀態取代完整注意力矩陣，計算量改成線性增長。它在 2025 年 9 月的 Qwen3-Next-80B-A3B 試水溫，Qwen3.5 起升為主線，採**混合佈局**：Qwen3.8-2.4T-A95B 的模型卡寫明是 23 組「3 層 Gated DeltaNet＋1 層 Gated Attention」。Qwen4 保留三比一的比例，只把注意力層換成 QSA。

### 細粒度 MoE：專家切得多而小

Qwen 的 MoE 走細粒度路線：Qwen3.8-2.4T-A95B 有 512 個專家，每 token 啟用 10 個路由專家加 1 個共用專家。對自架推論來說，決定延遲的是啟用參數，但決定 VRAM 的是總參數——2.4T 即使量化到 4-bit，光權重就要約 1.2TB 記憶體，[這是多節點資料中心的規格](https://aliteq.com/alibaba-qwen3-8-max-open-weights-2026)。

### 原生多模態：不是外掛，是天生

從 3.5 開始，Qwen 用早期融合訓練。Qwen4-Max 與 Qwen3.8-27B 都原生收文字／圖片／影片；但 Qwen3.8-2.4T-A95B 這份權重是純文字、而且必須開思考模式，圖片輸入與非思考模式只在 API 版 Qwen3.8-Max 提供。自架旗艦要做視覺任務，這個落差要先知道。

## 評測與競品比較

### Qwen4-Max 的位置

以下分數全部出自阿里 Qwen4-Max 公告的對照圖（數字經 [MarkTechPost](https://www.marktechpost.com/2026/11/16/alibaba-qwen4-max-release/) 轉錄），部分項目引用第三方排行榜，發布時都沒有獨立複測：

| Benchmark | Qwen4-Max | Qwen3.8-Max-0902 | 圖中最強對手 |
|---|---|---|---|
| HLAB-Vals-1.1（法律 agent） | **21.3** | 15.4 | Kimi K3.1 11.7 |
| Agents' Last Exam v1.1 | **46.7** | — | Claude Opus 5.5／Kimi K3.1 43.4 |
| DeepSWE v1.1 | **75.7** | 69.3 | Kimi K3.1 75.5 |
| Humanity's Last Exam | 51.7 | 43.9 | Claude Opus 5.5 59.8 |
| Terminal-Bench 4.0 | 48.5 | 38.9 | Kimi K3.1 67.2 |
| ProgramBench | 31.5 | 28.0 | Claude Opus 5.5 65.0 |
| Chartography | 54.2 | — | GPT-6 Astra 71.1 |

16 項裡 Qwen4-Max 拿下 4 項第一，Claude Opus 5.5 拿下 7 項。強項是垂直領域的長任務（法律、生醫、長時序 agent），弱項是原生編程、終端操作與圖表理解。[Alibaba 新聞稿](https://www.alibabagroup.com/en-US/document-2060139246777270272)另稱它在 Code Arena 排第六。

兩個但書：

- **他牌分數可能不同步。** 圖中 Kimi K3.1 的 Terminal-Bench 4.0 是 67.2，但 Moonshot 自己的模型卡寫 65.7（見 [Kimi K3.1 Pro 模型卡](/posts/daily/2026-10-30-model-moonshot-ai-kimi-k3-1-pro)）。轉引友商分數時要回頭對原始發布。
- **Work360 是自家評測。** Qwen4-Max 從 47.74 升到 52.69，同時 High 檔省約 35% token、每任務平均成本從 $4.43 降到 $1.67。省 token 的幅度對成本影響可能比分數更大，但目前沒有第三方複現。

### 跟競品的位置

- **對上 Claude Opus 5.5（$4／$20）**：分數多數落後，尤其 ProgramBench 不到一半；價格便宜約六到八成。適合當跑量的後盾，不適合取代主力 coding agent。
- **對上 Kimi K3.1 Pro（$2／$10）**：Terminal-Bench 4.0 明顯落後，DeepSWE 打平；Qwen4-Max 更便宜，但 Kimi 走開放權重路線（見 [Kimi 家族文](/posts/tech/2026-08-24-ai-model-family-kimi)），Qwen4-Max 沒有權重。
- **對上 DeepSeek**：DeepSeek 的優勢仍是價格與 MLA 的結構性低成本；Qwen 的優勢是尺寸光譜和多模態廣度。

## 授權、價格與部署

### 三種開放權重授權，商用限制各不相同

3.8 世代起「Qwen 開源＝Apache 2.0」不再成立。以下依 HuggingFace 上的 LICENSE 全文：

| 權重 | 授權 | 對商用的條件 |
|---|---|---|
| Qwen3.8-27B、Qwen3-Embedding／Reranker | Apache 2.0 | 保留授權聲明即可 |
| [Qwen3.8-2.4T-A95B](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B/blob/main/LICENSE) | Qwen3.8-Max License | 產品月活超過 1 億或月營收超過 2,000 萬美元，介面要顯著標示模型名；經營 Model as a Service 或 AI 工作助理（程式／辦公）且集團 12 個月營收超過 5,000 萬美元，商用前要另取授權 |
| [Qwen3.8-Flash-Next](https://huggingface.co/Qwen/Qwen3.8-Flash-Next/blob/main/LICENSE) | Qwen Community License 1.0 | 同樣的標示義務；經營 Model as a Service 或 AI 工作助理業務的，**不論營收**商用前都要另取授權 |

兩份自訂授權都對「純內部使用、不把模型能力提供給第三方」豁免。實際影響：做一般 SaaS 產品嵌入 Qwen 多半不受影響；做 API 轉售、或做 coding／辦公助理產品的，選 Flash-Next 前要先談授權，選 27B 則沒有這個問題。

### QwenCloud 定價重點

- **Qwen4-Max**：$1.50／$4.50，隱性快取命中 $0.075（前代 $0.25，降 70%）；顯式快取寫入 5 分鐘 $1.875、1 小時 $3。上限：非思考模式輸入 991K／輸出 131K，思考模式輸入 983K／輸出 262K，預設 5M TPM（[QwenCloud 模型頁](https://www.qwencloud.com/models/qwen4-max)）。
- **Qwen3.8-Max**：$2／$6 不變；9/5 起 `qwen3.8-max` 自動指向 `qwen3.8-max-0902` 快照，價格不變（[更新公告](https://docs.qwencloud.com/changelog/model-updates/qwen3.8-max-upgrade)）。要固定行為的程式應寫快照 ID。
- **Qwen3.7-Plus**：階梯計價，單次請求超過 256K 輸入，整筆改收 $1.20／$4.80；目前限時八折。
- **Qwen3.8-Flash**：$0.15／$0.47，快取命中 $0.016。
- **區域差異**：同一模型在 Global 部署範圍的價格較低（例如 Qwen4-Max $1.413／$4.24），免費額度只在 Singapore 區。比價時先確認你呼叫的是哪個區域端點。

API 同時相容 OpenAI Chat Completions／Responses 與 Anthropic Messages 格式，支援 function calling、structured outputs、批次、網路搜尋與微調。

## Agent 使用與選型

- **要 API 旗艦、預算敏感、任務偏法律／生醫／長流程** → Qwen4-Max。比 3.8-Max 便宜 25%，官方數據還省 token；先用自己的任務實測。
- **主力是 coding agent 或終端操作** → Qwen4-Max 不是首選，ProgramBench 與 Terminal-Bench 4.0 都明顯落後 Claude Opus 5.5 與 Kimi K3.1 Pro。
- **多模態請求量大** → Qwen3.7-Plus（256K 以內 $0.40／$1.60）仍是 Qwen 裡最便宜的多模態 API；注意超過 256K 的階梯價。
- **大量低價呼叫** → Qwen3.8-Flash（$0.15／$0.47）。
- **要在筆電或邊緣裝置跑** → Qwen3.8-27B：稠密、原生視覺、Apache 2.0；[CNBC 報導](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html)稱 17GB 顯示記憶體可跑。
- **要自架旗艦做研究或資料主權** → Qwen3.8-2.4T-A95B，先讀授權並準備多節點叢集；記得它是純文字、必開思考模式。
- **想等 Qwen4 開放權重** → 官方只承諾小模型開源，沒有日期、尺寸與授權；現在規劃不要假設它是 Apache 2.0。
- **要做 RAG** → Qwen3-Embedding 加 Reranker，和主力模型同一生態。
- **引用 benchmark 時** → 寫全世代、層級、快照 ID（例如 `qwen3.8-max-0902`），否則比的是不同場次。

## 限制與取捨

- **旗艦沒有權重。** Qwen4-Max 只能透過 QwenCloud 與阿里自家產品使用，資料主權或離線部署的需求只能退回 3.8 世代。
- **評測幾乎都是自報。** Qwen4-Max 的 16 項對照與 Work360 都來自阿里；他牌分數和對方自報版本也可能不一致。
- **授權要逐個模型看。** 同一世代的三款權重有三種授權，自訂授權對 API 業者與程式／辦公助理業者的限制，在選型階段就要確認。
- **Max／Plus／Flash 不代表權重狀態。** 型號後綴只是服務層級。

Qwen 的賭注仍是「全家桶」：單項冠軍不一定拿，agentic coding 的最高水位在 Claude，最低價在 DeepSeek；但從手機端到資料中心、從 embedding 到語音都有對應選項。2026 年的變化在於，「可以自己跑」這件事開始依模型層級和授權條件而定。

## 更新紀錄

- **2026-11-20**：補上 Qwen4 世代。矩陣、評測、定價與選型改寫為 Qwen4-Max 與目前在架的 3.8 型號（QwenCloud 定價頁、Qwen4-Max 官方公告、HuggingFace 模型卡與 LICENSE，2026-11-20 讀取）；新增 Qwen4 架構、三種開放權重授權條款比較、Qwen3.8-Max 快照切換與區域價差。Qwen3.8-Max 降為上一代，原本的 Terminal-Bench 2.1／SWE-Bench Pro／LongBench v2 對照表移出正文，完整數字見其 HuggingFace 模型卡。時間線改為四欄並連到每日模型卡。修正：Qwen3.8-2.4T-A95B 是後訓練權重而非「基座」；27B 的 context 補為原生 262K、可擴至 1M；Qwen-Image 新版不只閉源，2.1 版另以非商業授權開放權重。
- **2026-10-11**：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [Qwen4-Max: Your New Teammate Has Arrived — Qwen 官方部落格](https://qwen.ai/blog?id=qwen4-max)
- [Alibaba Unveils Qwen4-Max — Alibaba Group 新聞稿](https://www.alibabagroup.com/en-US/document-2060139246777270272)
- [Qwen4-Max — QwenCloud 模型頁（定價、上限、內建工具）](https://www.qwencloud.com/models/qwen4-max)
- [Model pricing — QwenCloud 文件](https://docs.qwencloud.com/developer-guides/getting-started/model-prices)
- [Qwen3.8-Max update notice — QwenCloud 更新公告](https://docs.qwencloud.com/changelog/model-updates/qwen3.8-max-upgrade)
- [Qwen/Qwen3.8-2.4T-A95B — HuggingFace 模型卡](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B)
- [Qwen3.8-Max License — HuggingFace](https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B/blob/main/LICENSE)
- [Qwen/Qwen3.8-Flash-Next — HuggingFace 模型卡](https://huggingface.co/Qwen/Qwen3.8-Flash-Next)
- [Qwen Community License 1.0 — HuggingFace](https://huggingface.co/Qwen/Qwen3.8-Flash-Next/blob/main/LICENSE)
- [Qwen/Qwen3.8-27B — HuggingFace 模型卡](https://huggingface.co/Qwen/Qwen3.8-27B)
- [Qwen3.8-Max: A New Bar for Coding and Cowork — Qwen 官方部落格](https://qwen.ai/blog?id=qwen3.8)
- [Alibaba Releases Qwen4-Max: 2.4T MoE, 71B Active, 1M Context — MarkTechPost](https://www.marktechpost.com/2026/11/16/alibaba-qwen4-max-release/)
- [Qwen-Live-Delivery-Plugin — GitHub](https://github.com/QwenLM/Qwen-Live-Delivery-Plugin)
- [Alibaba open-sources Qwen open-weight AI laptop models — CNBC](https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html)
- [The hardware math behind self-hosting Qwen3.8-Max — Aliteq](https://aliteq.com/alibaba-qwen3-8-max-open-weights-2026)
- [Qwen team exodus — Modelfit](https://modelfit.io/blog/qwen-team-exodus-alibaba/)
- [Qwen Timeline: Model & Product Release History — ScriptbyAI](https://www.scriptbyai.com/qwen-timeline)
- [Qwen3 技術報告（arXiv:2505.09388）](https://huggingface.co/papers/2505.09388)
- [模型卡｜Qwen4-Max](/posts/daily/2026-11-18-model-qwen-qwen4-max) — 本站
- [模型卡｜Qwen3.8-Flash-Next](/posts/daily/2026-08-26-model-qwen-qwen3-8-flash-next) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站，系列導讀
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
