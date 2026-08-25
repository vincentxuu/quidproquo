---
title: "Cohere——RAG 原生的異類：Command、Embed、Rerank、Aya 四支柱怎麼選"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, cohere, rag, embedding, rerank, model-family-cohere, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Cohere 是唯一把生成、檢索、重排、多語言四條線都做成產品的模型家族。Command A 111B 以兩張 GPU 跑 256K 上下文、Embed v4 支援圖文混合檢索、Rerank v4 32K 處理半結構化資料、Aya 覆蓋 101 種語言——四件套為 RAG 而生，這篇拆開每一塊的定位、授權與選型。"
description: "Cohere 模型家族完整介紹：從 2019 年多倫多創立到 Command A 111B 的演化、Embed v4 與 Rerank v4 的檢索架構、Aya 101/Expanse 多語言線、North 平台與私有部署、定價與競品對照。"
series:
  name: "AI 模型家族"
  order: 10
draft: false
glossary:
  - term: "RAG"
    aliases: ["Retrieval-Augmented Generation"]
    definition: "先檢索外部資料再交給模型生成答案的架構，降低幻覺、提升可追溯性。"
  - term: "Rerank"
    definition: "檢索第二階段：對召回的候選文件重新打分排序，只把最相關的餵進生成模型。"
  - term: "North"
    definition: "Cohere 的企業級 AI 工作平台，整合 Command、Embed、Rerank 與文件連接器。"
  - term: "Model Vault"
    definition: "Cohere 的獨佔式託管推論平台，模型跑在隔離實例上，支援加密運算與遠端驗證。"
  - term: "Aya"
    definition: "Cohere 的多語言研究系列，覆蓋 23 至 101 種語言，部分權重以 Apache 2.0 開源。"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-cohere-en)

2019 年，Transformer 論文共同作者 Aidan Gomez 在多倫多創立 Cohere。當多數實驗室追逐「最強聊天模型」時，Cohere 選了一條不同的路——做企業的 RAG 基礎設施。六年後，這個選擇長成了四根支柱：用來生成的 Command、用來檢索的 Embed、用來精排的 Rerank、用來跨語言的 Aya。沒有一家對手把這四塊同時做成產品線。

這是[AI 模型家族](/series/ai)系列的第八篇，追蹤 Cohere 從語言模型新創到企業 RAG 套件的完整演化。怎麼解讀文中引用的 benchmark，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)；快速對照 20 多種用途的模型選型，見[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)。

## 家族演化時間線

| 版本 | 發佈 | 關鍵事實 |
|---|---|---|
| Cohere 成立 | 2019 | 多倫多，Aidan Gomez（Transformer 論文共同作者）與 Nick Frosst、Ivan Zhang 共同創立 |
| Command（初代） | 2022–2023 | 早期生成模型，$1.00/$2.00 定價，奠定 API 基礎 |
| Command R | 2024-03-11 | 首個 RAG 專用模型，128K context，$0.50/$1.50 |
| Command R+ | 2024-04 | 旗艦 104B 參數，128K context，$3.00/$15.00，複雜 RAG 與多步驟 tool use |
| Command R+ 08-2024 | 2024-08 | 大幅更新版，吞吐量 +50%、延遲 -25%，降價至 $2.50/$10.00 |
| Aya 101 | 2024-02 | 13B、101 種語言、Apache 2.0 開源 |
| Aya 23 | 2024-05 | 8B/35B、23 種語言、CC BY-NC 4.0 |
| Aya Expanse | 2024-12-05 | 8B（8K）/32B（128K）、23 種語言、CC BY-NC 4.0，API $0.50/$1.50 |
| Command A | 2025-03-13 | 111B、256K context、兩張 GPU 即可跑，吞吐量較 R+ 08-2024 高 150% |
| Embed v4.0 | 2025 | 圖文混合（文字+圖片+PDF）、128K、可變維度 256–1536 |
| Rerank v3.5 / v4 | 2025 | v3.5 單一多語言 4K；v4 Fast/Pro 32K、支援半結構化 JSON/YAML |
| North / Compass | 2025 | 企業工作平台 North + 智慧搜尋 Compass |
| North Mini Code | 2025 | 首個 agentic coding MoE：30B 總參數 / 3B 活躍，256K context，Apache 2.0 |
| Transcribe | 2025 | 語音辨識模型，含阿拉伯語微調版 |

六年、四次世代跳躍。Cohere 的節奏不是「每季發一個更大模型」，而是「每條線各自演進、最後在 North 平台合流」。

## 四支柱：為什麼 Cohere 不只是 LLM 公司

多數家族只有一條主線（Qwen 拚全尺寸覆蓋、DeepSeek 拚 MoE 效率、Claude 拚 Agent）。Cohere 同時維護四條：

**Command（生成）**：對話、RAG grounded generation、多步驟 tool use。從 R 到 R+ 再到 A，每一代都在「如何更省算力做 RAG」上加碼——Command A 用 111B 達到對手更大模型的品質，且只要兩張 A100/H100。

**Embed（檢索）**：把文字/圖片轉成向量，是 RAG 的第一環。v4.0 之前分英文/多語言雙軌（v3.0 的 1024 維完整版 vs 384 維輕量版）；v4.0 統一為單一多語言模型，支援可變維度與多模態輸入。

**Rerank（精排）**：RAG 的第二環，對召回結果重新打分。v3.0 分英文/多語言，v3.5 起單一多語言，v4 拉到 32K 並能處理半結構化資料（表格、JSON、YAML）。按 search unit 計費（1 query + 最多 100 文件）。

**Aya（多語言）**：研究導向的多語言系列。Aya 101 覆蓋 101 種語言且 Apache 2.0 商用友善；Aya 23/Expanse 收斂到 23 種核心語言、品質更高但改為 CC BY-NC 4.0（研究用，非商用）。

這四塊的組合拳是 Cohere 唯一的護城河：別家需要你自己拼 OpenAI + BGE + Jina + NLLB，Cohere 給你一整套、同一家計費、同一套私有部署。

## 架構：為什麼叫 RAG 原生

### Grounded generation 與引用

Command R/R+/A 從訓練階段就針對「給定文件、產生帶引用回答」最佳化。模型會在回答中標註資訊來源，而不是自由發揮。這對企業知識庫問答至關重要——法務、客服、金融場景不能接受無來源的答案。

### 多步驟 tool use

Command R+ 起支援 multi-step tool use：模型可以在一個回應週期內順序呼叫多個工具，並用前一步的結果決定下一步。這是 Agent 的基礎能力，Cohere 在 2024 年就把它做成 R+ 的主打，而非事後外掛。Command A 在此之上強調「少做不必要的工具呼叫」——實務上，亂呼工具比不呼工具更昂貴。

### 效率優先的設計

Command A 的技術賣點不是參數量，而是效率：111B 參數、256K context、只需兩張 GPU，吞吐量較前代 R+ 08-2024 高 150%。Cohere 官方說法是「on par or better than GPT-4o and DeepSeek-V3 across agentic enterprise tasks, with significantly greater efficiency」（[Command A 發佈文](https://cohere.com/blog/command-a)）。對需要私有部署的企業而言，「兩張卡就能跑旗艦」比「多 2% benchmark」更實際。

## Embed v4 與 Rerank v4：怎麼選

### Embed：從雙軌到統一

| 項目 | Embed v4.0 | Embed v3.0（完整版） | Embed v3.0（輕量版） |
|---|---|---|---|
| 模態 | 文字 + 圖片 + 混合 PDF | 文字 | 文字 |
| 維度 | 256 / 512 / 1024 / 1536（預設 1536） | 1024 | 384 |
| Context | 128K tokens | 512 tokens | 512 tokens |
| 語言 | 單一多語言（100+） | 英文 / 多語言分開 | 英文 / 多語言分開 |
| 距離度量 | Cosine / Dot / Euclidean | Cosine | Cosine |
| 量化 | float / int8 / uint8 / binary | float | float |

v4.0 的兩個關鍵升級：**多模態輸入**（直接嵌圖片和 PDF，不需先轉文字）與**可變維度**（依場景選 256 維省儲存或 1536 維保品質）。舊版 512 tokens 的 context 在長文件場景是硬傷，v4.0 拉到 128K 後可直接嵌整份文件。

定價：Embed 無公開的每 token 單價，採企業議價；[Model Vault](https://cohere.com/pricing) 獨佔實例為 Small $4/小時（$2,500/月）、Medium $5/小時（$3,250/月）。

### Rerank：從 4K 到 32K

| 項目 | Rerank v4 Pro / Fast | Rerank v3.5 | Rerank v3.0 |
|---|---|---|---|
| 語言 | 單一多語言 | 單一多語言 | 英文 / 多語言分開 |
| Context | 32K | 4K | 4K |
| 半結構化 | 支援 JSON/YAML/表格 | — | — |
| 計費 | 每 search unit（1 query + 100 docs） | 同左 | 同左 |
| 超長文件 | 自動切 chunk（>510 tokens） | 同左 | 同左 |

v4 的核心差異是**半結構化資料**：企業文件常混雜表格、JSON、YAML，v4 Pro/Fast 能直接對這類內容打分，不需先轉純文字。Context 從 4K 拉到 32K 後，可一次精排更長的文件。

Model Vault 定價：Rerank 3.5 與 Rerank 4 Fast Medium 皆 $5/小時（$3,250/月），Rerank 4 Pro Large $10/小時（$6,500/月）。

### 一句話選型

- **新專案直接上 v4**：Embed v4.0 + Rerank v4 Pro 是目前組合，多模態與 32K 精排覆蓋最廣。
- **成本敏感**：Rerank 4 Fast 與 Pro 同價（Medium 皆 $5/小時），選 Pro 即可；Embed 可用 512 維而非 1536 維，儲存與延遲皆減半。
- **已用 v3**：v3.0 的英文/多語言分流在 v3.5/v4 已統一，升級可簡化整合。

## Aya：101 種語言到 23 種的收斂

| 版本 | 參數 | 語言數 | Context | 授權 | API 定價 |
|---|---|---|---|---|---|
| Aya 101 | 13B（mT5-xxl） | 101 | — | Apache 2.0 | —（權重下載） |
| Aya 23 | 8B / 35B | 23 | 8K | CC BY-NC 4.0 | — |
| Aya Expanse 8B | 8B | 23 | 8K | CC BY-NC 4.0 | $0.50 / $1.50 |
| Aya Expanse 32B | 32B | 23 | 128K | CC BY-NC 4.0 | $0.50 / $1.50 |

Aya 的演化呈現收斂：從 101 種語言的大而全，到 23 種核心語言的精而深。101 種的 Aya 101 仍是唯一 Apache 2.0 商用友善的版本；23 種的 Expanse 品質更高、支援長上下文（32B 達 128K），但 CC BY-NC 限制商用——企業若要商用多語言生成，需走 Cohere API 而非自架權重。

23 種語言清單：阿拉伯語、中文（簡/繁）、捷克語、荷蘭語、英語、法語、德語、希臘語、希伯來語、印地語、印尼語、義大利語、日語、韓語、波斯語、波蘭語、葡萄牙語、羅馬尼亞語、俄語、西班牙語、土耳其語、烏克蘭語、越南語。與 Command A 支援的 23 種完全一致。

## North、Compass 與子線

Cohere 在模型之外疊了兩層平台：

**[North](https://cohere.com/north)**：企業級 AI 工作平台，整合 Command、Embed、Rerank、文件連接器與 Agent 工作流。定位類似「企業內部的 ChatGPT + RAG + 自動化」，強調私有、安全、可接現有系統。**[Compass](https://cohere.com/compass)**：智慧搜尋與探索系統，偏文件發現與洞察挖掘。

子線一覽：

| 子線 | 代表版本 | 定位 |
|---|---|---|
| 旗艦生成 | Command A 111B | 企業 RAG、Agent、多語言，256K，兩張 GPU |
| 前代旗艦 | Command R+ 08-2024 104B | 仍在役，128K，$2.50/$10.00 |
| 輕量生成 | Command R7B | 端側/低成本場景 |
| 檢索 | Embed v4.0 | 多模態、128K、可變維度 |
| 精排 | Rerank v4 Pro/Fast | 32K、半結構化 |
| 多語言研究 | Aya Expanse 32B | 23 語言、128K |
| 開放多語言 | Aya 101 13B | 101 語言、Apache 2.0 |
| Agentic coding | North Mini Code 30B-A3B | MoE（30B 總/3B 活躍）、256K、Apache 2.0 |
| 語音辨識 | Transcribe / Transcribe Arabic | ASR，含阿拉伯語微調版 |
| 工作平台 | North / Compass | 企業工作流與搜尋 |

兩個觀察：

**North Mini Code 是 Cohere 首次跨入 coding。** 30B 總參數但每次只啟用 3B，256K context，Apache 2.0——參數標記與架構思路接近 DeepSeek 的 MoE 路線，但 Cohere 的賣點是「為 North 平台內的 coding agent 而生」，而非通用 coding 榜單。

**平台化是雙面刃。** North 把四支柱打包成一站式方案，對已有 Cohere 部署的企業是加分；但對只想用 Embed 或 Rerank 的團隊，North 的存在感可能造成「是否被綁定」的疑慮。實務上，Embed/Rerank/Command 皆可單獨透過 API 使用，不強制經 North。

## 定價與部署

### API 定價（每百萬 tokens）

| 模型 | Input | Output | 備註 |
|---|---|---|---|
| Command R 03-2024 | $0.50 | $1.50 | 已標 deprecated（2025-09-15） |
| Command R+ 04-2024 | $3.00 | $15.00 |  |
| Command R+ 08-2024 | $2.50 | $10.00 | 現役主力 |
| Command A 03-2025 | $2.50 | $10.00 | 與 R+ 08-2024 同價，效率更高 |
| Aya Expanse 8B/32B | $0.50 | $1.50 |  |
| Embed v4.0 | 企業議價 | — | 無公開 per-token 單價 |
| Rerank | 按 search unit | — | 1 query + 100 docs 為一單位，>500 tokens 自動切 chunk |

來源：[Cohere Pricing](https://cohere.com/pricing) 與 [Command A 文件](https://docs.cohere.com/docs/command-a)。

### 私有部署

Cohere 提供兩種私有化路徑，均為 Kubernetes 容器化部署，支援 AWS/Azure/GCP/OCI：

- **Private Deployments**：跑在客戶自有環境（on-prem 或隔離 VPC），資料不出境。
- **[Model Vault](https://docs.cohere.com/docs/model-vault)**：Cohere 代管的獨佔實例（非多租戶），分 Standard 與 Encrypted（機密運算、遠端驗證）兩級，通過 GDPR、HIPAA、SOC 2。

Model Vault 按實例時數計費，Embed 與 Rerank 的 Vault 定價見上節表格。Command 系列的 Vault 定價需洽業務。

### 授權陷阱

Cohere 的授權分三層，選型前必須看清：

- **API（Command/Embed/Rerank）**：商用 API，按量計費，無權重下載。資料主權敏感場景需走 Private Deployment，而非「下載權重自架」。
- **Apache 2.0（Aya 101、North Mini Code）**：可商用、可自架、可改作。這是 Cohere 唯一真正開放的兩款。
- **CC BY-NC 4.0（Aya 23、Aya Expanse、Command R+/A 的 HF 權重）**：僅限研究與非商用，商用需走 API。HuggingFace 上的 `CohereLabs/c4ai-command-*` 與 `aya-expanse-*` 皆屬此類。

對比系列其他家族：Qwen（Apache 2.0/自訂）、DeepSeek（MIT）、Llama 4（Community License）、Mistral（Apache/Modified MIT）皆有可商用自架權重；Cohere 的旗艦生成與檢索模型**沒有**可商用自架權重，私有化必須透過官方部署方案。

## 跟競品的位置

把 Cohere 放回 2026 年的格局：

- **對上 OpenAI（GPT-5.6 + text-embedding-3）**：GPT 在通用品質與生態上領先，但 Cohere 的 Embed/Rerank 為 RAG 專門最佳化，且提供引用 grounded generation。需要「可追溯的企業問答」時 Cohere 更省事。
- **對上 BGE-M3 / Jina（開源檢索）**：BGE-M3（MIT、36M 下載）與 Jina Reranker v3.5 是開源 RAG 的預設組合，可自架、成本低。Cohere Embed v4/Rerank v4 的優勢是多模態、32K、半結構化與企業支援，而非純分數。
- **對上 Qwen / DeepSeek（開源生成）**：兩家提供可商用自架權重（Apache 2.0/MIT），Cohere Command 無此選項；但 Cohere 的多步驟 tool use 與 grounded RAG 在企業場景更成熟。
- **對上 Claude / Gemini（閉源生成）**：Claude Opus 5 與 Gemini 3 在 coding 與推理上領先 Cohere；Cohere 的差異化是「生成+檢索+重排」的一站式與私有部署，而非單點品質。
- **對上 NLLB / SeamlessM4T（多語言/翻譯）**：Aya 101 的 101 語言覆蓋與 NLLB-200 同級，且為指令跟隨模型（可加上下文翻譯）；Aya Expanse 則在 23 種語言內提供更強的生成品質。

一句話定位：**如果你要的是「一個/chat/completions 端點」，Cohere 不是首選；如果你要的是「一套能私有部署的 RAG 流水線」，Cohere 是少數能一次給齊的家族。**

## 對 Agent 開發者的意義

- **RAG 流水線一站式** → Embed v4（召回）+ Rerank v4 Pro（精排）+ Command A（生成帶引用）是 Cohere 設計的黃金組合，同一家 API、同一套私有部署。
- **多步驟 Agent** → Command A/R+ 的 multi-step tool use 支援順序工具呼叫，適合「搜尋→讀文件→計算→回覆」這類工作流。
- **多語言 Agent** → Aya Expanse 32B（128K）可處理跨語言文件，或用 Aya 101（Apache 2.0）自架多語言分類/翻譯。
- **高吞吐/成本敏感** → Embed 與 Rerank 的 API 為檢索最佳化，延遲與成本低於「用 LLM 做 rerank」；Aya Expanse 的 $0.50/$1.50 亦屬低價帶。
- **私有部署/合規** → Model Vault（Standard/Encrypted）與 Private Deployments 支援資料不出境，金融、政府、醫療場景的首選之一；但旗艦生成無可商用自架權重，評估時需納入供應商鎖定風險。
- **本地/邊緣** → 僅 Aya 101 與 North Mini Code 為 Apache 2.0 可自架；需要本地 Embed/Rerank 請評估 BGE-M3 + Jina 等開源替代。

務實的混用策略：

| 任務 | 推薦 | 原因 |
|---|---|---|
| 企業知識庫問答 | Cohere Embed v4 + Rerank v4 Pro + Command A | 原生 grounded generation 與引用 |
| 多語言文件處理 | Aya Expanse 32B（API）或 Aya 101（自架） | 101/23 語言覆蓋，指令式翻譯 |
| 低成本多語言生成 | Aya Expanse 8B API $0.50/$1.50 | 同品質下最便宜的多語言生成 |
| 本地/離線 RAG | BGE-M3 + Jina Reranker + Qwen/DeepSeek | Cohere 檢索無可商用自架權重 |
| 複雜 coding agent | Claude Opus 5 / DeepSeek V4 Pro + Cohere Rerank | 生成用最強模型，檢索用 Cohere 精排 |
| 需私有部署的 Agent | Cohere Private Deployment / Model Vault | 資料不出境，SOC 2/HIPAA/GDPR |

## 整體來說

Cohere 證明了另一種生存策略：不跟 OpenAI、Anthropic 拚「最強聊天模型」，而是把 RAG 的每一環都做成產品。當對手提供一個端點時，Cohere 提供一條流水線——Embed 召回、Rerank 精排、Command 生成、Aya 跨語言，全部可在私有環境中運行。

代價是開放度。旗艦生成與檢索模型沒有可商用的開源權重，Aya 的開放也從 Apache 2.0 退至 CC BY-NC。Cohere 的「開放」是研究開放，而非部署開放。選 Cohere 前，先確認你需要的是「一套能買的 RAG 基礎設施」而非「一組能自架的權重」——這一行比 benchmark 分數更重要。

---

## 參考資料

- [Cohere 官方網站](https://cohere.com)
- [Cohere Pricing](https://cohere.com/pricing) — Command、Aya、Model Vault 定價
- [Command A — Cohere Docs](https://docs.cohere.com/docs/command-a) — 111B、256K、兩張 GPU、$2.50/$10.00
- [Introducing Command A: Max performance, minimal compute — Cohere Blog](https://cohere.com/blog/command-a) — 發佈時間、效率主張
- [Command R+ — Cohere Docs](https://docs.cohere.com/docs/command-r-plus) — RAG 與多步驟 tool use 能力
- [Cohere Models — Docs](https://docs.cohere.com/docs/models) — 全模型清單、context、參數量、狀態
- [Cohere Embed — Product](https://cohere.com/embed) 與 [Cohere Embed — Docs](https://docs.cohere.com/docs/cohere-embed) — v4.0 多模態、可變維度
- [Cohere Rerank — Product](https://cohere.com/rerank) 與 [Rerank Overview — Docs](https://docs.cohere.com/docs/rerank-overview) — v4 32K、半結構化
- [Cohere North](https://cohere.com/north) 與 [Compass](https://cohere.com/compass) — 企業工作平台
- [Private Deployments](https://cohere.com/private-deployments) 與 [Model Vault — Docs](https://docs.cohere.com/docs/model-vault) — 私有化與機密運算
- [Aya — Cohere Research](https://cohere.com/research/aya) — 多語言系列總覽
- [Aya 101 — HuggingFace (CohereLabs/aya-101)](https://huggingface.co/CohereLabs/aya-101) — 13B、101 語言、Apache 2.0
- [Aya Expanse 8B](https://huggingface.co/CohereLabs/aya-expanse-8b) / [32B](https://huggingface.co/CohereLabs/aya-expanse-32b) — 23 語言、CC BY-NC 4.0、8K/128K
- [Command A 03-2025 — HuggingFace](https://huggingface.co/CohereLabs/c4ai-command-a-03-2025) — 111B、256K
- [Command R+ 08-2024 — HuggingFace](https://huggingface.co/CohereForAI/c4ai-command-r-plus-08-2024) — 104B
- [North Mini Code — Docs](https://docs.cohere.com/docs/north-mini-code-1.0) — 30B-A3B MoE、256K、Apache 2.0
- [Cohere Labs — HuggingFace](https://huggingface.co/CohereLabs) — 開放權重總表
- [Attention Is All You Need (arXiv:1706.03762)](https://arxiv.org/abs/1706.03762) — Transformer 奠基論文，Aidan Gomez 為共同作者
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
