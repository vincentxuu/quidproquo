---
title: "Claude——從 AI 安全實驗室到 Fable 5.2 與 Claude 5.5 四層，閉源 Agent 的主力選擇"
date: 2026-08-24
category: tech
tags: [ai-agent, llm, claude, anthropic, model-family-claude, constitutional-ai, agentic-coding, model-selection]
lang: zh-TW
type: deep-dive
tldr: "Claude 是 Anthropic 的閉源 LLM 家族，以 Constitutional AI 訓練、Agent 能力和 coding 表現聞名。2026 年 9 到 11 月換成新一代：Opus 5.5（$4／$20）是官方建議的預設主力，Sonnet 5.5（$2／$10）與 Haiku 5.5（短 prompt $0.10／$0.50）補上快速與高量層，Fable 5.2（$8／$40）負責最難的推理與長程 agent 工作。四個型號都是 1M context、128K 輸出。Fable 5.2 在 Artificial Analysis 綜合指標排第一；同一底層模型的 Mythos 5.2 只開放給通過資安或生命科學驗證計畫的機構。"
description: "Claude 模型家族完整介紹：從 2023 年 Claude 1 到 2026 年 Fable 5.2 與 Claude 5.5 系列的演化脈絡、API 平台與消費級產品線、Constitutional AI 與 Agent 架構、Fable／Opus／Sonnet／Haiku 四層定位與定價、Mythos 受限存取、舊型號退役時程，以及 Agent 開發者的選型指南"
series:
  name: "AI 模型家族"
  order: 7
draft: false
glossary:
  - term: "Constitutional AI"
    aliases: ["CAIS", "Constitutional AI Safety"]
    definition: "Anthropic 開發的 AI 對齊方法——用一套憲法原則（constitution）指導模型行為，讓模型自我批評和修正，減少人類標註依賴"
  - term: "MCP"
    aliases: ["Model Context Protocol"]
    definition: "Anthropic 提出的工具整合標準協議，讓 LLM 能統一呼叫外部工具和資料源，被稱為 AI 模型的 USB-C 接口"
  - term: "Adaptive Thinking"
    definition: "Claude 的動態推理機制——模型依 effort 設定與問題複雜度自動決定思考深度；Fable 5.2 與 Opus 5.5 永遠開啟"
  - term: "Claude Code"
    definition: "2025 年 2 月隨 Claude 3.7 Sonnet 推出的 CLI 編碼 Agent，深度整合檔案讀寫、Git 操作與多檔案編輯工作流"
---

> 🌏 [English version](/posts/tech/2026-08-24-ai-model-family-claude-en)

2023 年 3 月，當 OpenAI 的 GPT-4 剛上線時，Anthropic 在同一週悄悄發佈了 Claude——一個以「安全」為核心設計哲學的語言模型。三年半後的 2026 年，Claude 在半年內換了兩代：6、7 月 Fable 5、Sonnet 5、Opus 5 上線，9 月起 Opus 5.5、Sonnet 5.5、Haiku 5.5 組成 Claude 5.5 系列，11 月 9 日 Fable 5.2 接手最高層。這是「AI 模型家族」系列的第七篇深度介紹，追蹤 Claude 從 Claude 1 到 Fable 5.2 的完整演化。

怎麼解讀文中引用的 benchmark 數字，請參考[AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources)。這篇是[AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview)系列的一部分。

## 家族定位與版本矩陣

以 2026-11-20 Claude 官方模型總覽與定價頁為準：

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| Claude Fable 5.2 | 最難的推理與長程 agent 工作 | $8／$40，綜合指標第一 | Anthropic API／授權雲端 |
| Claude Opus 5.5 | 官方建議的預設主力，長時間 agentic coding 與知識工作 | $4／$20 | Anthropic API／授權雲端 |
| Claude Sonnet 5.5 | 速度與智慧的平衡，範圍明確的日常工作 | $2／$10 | Anthropic API／授權雲端 |
| Claude Haiku 5.5 | 高量、低延遲的分類、抽取、路由 | 100K 以內 $0.10／$0.50 | Anthropic API／授權雲端 |
| Claude Mythos 5.2 | 與 Fable 5.2 同一底層模型，資安與生命科學護欄較寬 | 同 Fable 5.2 價格 | 限通過驗證計畫的機構 |


### 兩條產品線：API 平台 vs 消費級 Claude，加上四層推論等級
看懂 Claude 在 2026 年的動作，關鍵是把它拆成兩條平行線，再加上一張四層推論等級表：

**API 平台線**（developer / enterprise）：所有推理都走 Anthropic 官方 API，或經授權的雲端——Amazon Bedrock、Google Cloud、Microsoft Foundry，以及 Anthropic 自己營運的 Claude Platform on AWS。這條線負責開發者與企業營收，也是 Claude Code、MCP、各種 Agent 工作流的承載層。

**消費級 Claude app 線**：面向終端使用者的 claude.ai 與桌面/行動 App，把同一批模型包成對話、寫作、分析產品。這條線不對外開放權重，也不提供自架選項。

中間是推論等級的分層。2026 年 6 月 Claude 從三層擴展為四層，新增 Fable 這一層；Fable 與 Mythos 是同一個底層模型，差別只在護欄與存取資格。到 Claude 5.5 世代，四層的價格與規格如下（Claude API 標準價，每 1M tokens）：

| 項目 | Fable 5.2 | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 |
|---|---|---|---|---|
| 定位 | 最難推理，長程 agent | 預設主力，長時間 coding 與知識工作 | 日常工作，最快的 Sonnet | 高量、低延遲 |
| Input | $8 | $4 | $2 | $0.10（≤100K）／$0.50（>100K） |
| Output | $40 | $20 | $10 | $0.50／$2.50 |
| Cache 命中 | $0.20 | $0.20 | $0.10 | $0.01／$0.05 |
| Batch API | 標準價 50% | 50% | 50% | 50% |
| Context／Max output | 1M／128K | 1M／128K | 1M／128K | 1M／128K |
| Adaptive thinking | 永遠開啟 | 永遠開啟 | 可調 | 可調 |
| 預設 effort | high | medium | high | medium |
| 相對延遲 | 中等 | 中等 | 快 | 最快 |

定價有三個值得記住的細節。其一，**快取命中特別便宜**：一般 Claude 模型快取命中是輸入價的 10%，Opus 5.5 與 Sonnet 5.5 是 5%，Fable 5.2 只有 2.5%；agentic 工作大部分成本在快取讀取，這比牌面單價更影響帳單。其二，**Haiku 5.5 依 prompt 長度分兩段計價**，超過 100K 後單價變 5 倍。其三，Claude 4.7 之後的 tokenizer 對同樣文字約多產生 30% token，從舊型號換過來時，單價降了不代表帳單等比例降。


### 子線與生態系：一張表看懂 Claude 有多少模型
「家族小」是 Claude 最容易被低估的特徵——它幾乎沒有獨立的視覺、語音、嵌入專模型線，子線都是同一個底座的不同服務層級：

| 子線 | 代表版本（2026-11） | 定位 |
|---|---|---|
| 最高層 | Claude Fable 5.2 | 最難推理與長程規劃，也可當其他模型的 Advisor 或 Orchestrator |
| 受限存取 | Claude Mythos 5.2 | 同 Fable 底層模型，限資安與生命科學驗證計畫 |
| 預設主力 | Claude Opus 5.5 | 長時間 coding / agentic |
| 中端 | Claude Sonnet 5.5 | 範圍明確的日常工作、文件與簡報 |
| 輕量 | Claude Haiku 5.5 | 分類、抽取、路由，也適合當 subagent |
| 終端 Agent | Claude Code | 命令列 coding agent |
| 開放標準 | MCP（Model Context Protocol） | 開源協議，讓 Agent 接外部工具 |
| 企業產品 | Claude for Work / Teams | 企業版權限與治理 |

兩個觀察：

**MCP 是 Claude 最被低估的生態槓桿。** Anthropic 把 Model Context Protocol 開源，現在已成為 Agent 接外部工具的事實標準——即使你不跑 Claude，你的 Agent 基礎設施很可能已經建立在 MCP 上。這讓 Claude 的影響力超出單一模型範圍。

**產品線高度集中在 API 層。** 不像 Qwen 有 Coder/VL/Omni/Image 多條子線、Gemini 有影像／影片／語音專門型號，Claude 的子線幾乎都是同一套能力的不同服務層級，沒有獨立的影像生成、語音、嵌入專模型線。這讓它的生態比其他大家族窄，但產品體驗更一致。

## 家族演化

### 家族演化時間線
| 版本 | 時間 | 關鍵事實 | 改變了什麼選型 |
|---|---|---|---|
| Claude 1 | 2023-03 | 首個公開模型，9K context，Constitutional AI 訓練 | 安全與拒答邊界成為 Claude 的賣點 |
| Claude 2 / 2.1 | 2023-07／2023-11 | 100K → 200K context，系統提示、tool use 實驗 | 長文件分析成為 Claude 的早期強項 |
| Claude 3 Opus/Sonnet/Haiku | 2024-03 | 三層產品線確立，多模態（視覺） | 開始依價格層挑模型，而不是只有一個 Claude |
| Claude 3.5 Sonnet | 2024-06／2024-10 | Sonnet 品質超越前代 Opus；Artifacts、Computer Use 公測 | 中價位的 Sonnet 成為多數人的預設 |
| Claude 3.7 Sonnet | 2025-02 | 首個混合推理模型，Claude Code 啟動 | 推理深度變成可調參數；coding agent 有了官方工具 |
| Claude 4 / 4.5 | 2025-05～11 | Agent 編碼世代，MCP 標準化 | Claude 成為 agentic coding 的主要選項之一 |
| Claude 4.6 / 4.7 / 4.8 Opus | 2026-02～05 | 1M context、新 tokenizer、adaptive thinking、effort 控制 | 1M context 與 effort 參數成為標配；Opus 價格降到 $5／$25 後維持多代 |
| Claude Fable 5 / Sonnet 5 / Opus 5 | 2026-06～07 | 新增 Fable 層（Mythos 為受限版）；Sonnet 5 $2／$10；Opus 5 SWE-bench Verified 96% | 產品線從三層變四層；Sonnet 5 的促銷價轉為永久價（[價格公告](/posts/daily/2026-08-17-pricing-anthropic-sonnet-5-price-freeze)） |
| Claude Fable 5.1 | 2026-09-01 | Artificial Analysis Intelligence Index 66 分，快取命中降到 $0.25 | 最高層的分數與快取成本同時改善（[模型卡](/posts/daily/2026-09-07-model-anthropic-claude-fable-5-1)） |
| Claude Opus 5.5 | 2026-09-22 | $4／$20，官方稱多數工作達 Fable 5.1 水準，成本比 Opus 5 少 40% | 預設主力從 Sonnet／Opus 5 移到 Opus 5.5；Opus 價格多代來首次調降（[模型卡](/posts/daily/2026-09-25-model-anthropic-claude-opus-5-5)） |
| Claude Sonnet 5.5 | 2026-09-28 | 單價不變，Terminal-Bench 4.0 從 10.3% 到 70.6% | 日常層的能力大躍進，省錢靠少用 token 而非降價（[價格分析](/posts/daily/2026-09-30-pricing-anthropic-claude-sonnet-5-5-flat-pricing)） |
| Claude Haiku 5.5 | 2026-10-07 | 1M context、首個可調 effort 的 Haiku，平均成本約降 75% | 小模型也能做 computer use 與 subagent（[模型卡](/posts/daily/2026-10-09-model-anthropic-claude-haiku-5-5)） |
| Claude Fable 5.2 / Mythos 5.2 | 2026-11-09 | $8／$40，比 5.1 便宜 20%、輸出快 30% | 目前的選型基準，見下方各節（[模型卡](/posts/daily/2026-11-14-model-anthropic-claude-fable-5-2)） |

三年半、多個里程碑。Claude 的演化有一條清晰的主線：**從安全研究到 Agent 能力的逐步釋放**。3.7 Sonnet 引入推理、4.0 引入 Agent、4.6 引入 1M context，5 世代新增 Fable 層把產品線拉到四層。5.5 世代的重點則是降價與提速：Opus 5.5 與 Fable 5.2 都降了 20% 單價、快取大降，Haiku 5.5 更是大幅降價。

## 架構與訓練取捨

### 架構：從安全研究到 Agent 能力
#### Constitutional AI

Claude 從第一天就用 Constitutional AI 訓練。這個方法的核心是：不靠大量人類標註來判斷「什麼是好回答」，而是用一套**憲法原則**（constitution）讓模型自我批評和修正。

訓練過程分兩階段：

1. **監督學習階段**：讓模型生成回答，再根據憲法原則自我批評，產生修正後的版本，用這些版本微調
2. **RLAIF 階段**（RL from AI Feedback）：讓模型根據憲法原則評估兩個回答哪個更好，用這個偏好訓練獎勵模型，再用 RL 強化

這個方法的優勢是可擴展性——不依賴昂貴的人類標註，又能精確控制模型行為。Claude 2 的憲法引用了《世界人權宣言》等文件的原則，這也是為什麼 Claude 的拒答邊界由 Anthropic 決定、企業無法自行鬆綁。

#### 同一底層模型，依存取資格分 Fable 與 Mythos

Anthropic 在 Fable 5.2 公告裡寫明：「Claude Fable 和 Claude Mythos 是同一個底層模型」。Fable 套用較強的資安與生物安全護欄，因此可以開放給所有使用者；Mythos 只給通過 Life Sciences 或 Cyber Verification Program 的機構，用於資安或生醫研究。這跟 OpenAI 用同一組權重切出 Rosalind、Cyber 的做法類似。護欄也往下延伸：Opus 5.5 的生物與資安能力被評為與 Mythos 5.1 相當，因此套用 Fable 5.1 等級的護欄；Sonnet 5.5 是第一個上線就帶資安護欄的 Sonnet。

#### Adaptive Thinking 與 effort

從 Claude 4.7 開始引入，到 Claude 5 成為預設行為。Adaptive Thinking 讓模型根據問題複雜度與 effort 設定自動決定推理深度，不再用舊的手動 budget_tokens 模式（Opus 4.6／Sonnet 4.6 起已棄用，之後的型號不接受）。到 5.5 世代，Fable 5.2 與 Opus 5.5 的 thinking 永遠開啟，Sonnet 5.5 與 Haiku 5.5 可調；各型號的預設 effort 不同（Fable、Sonnet 是 high，Opus、Haiku 是 medium），從舊型號遷移時要確認 effort 設定。

#### 多模型協作：Advisor 與 Orchestrator

Fable 5.2 的公告建議多數 coding 與知識工作先從 Opus 5.5 開始，再依任務往上換 Fable、往下換 Sonnet 或 Haiku。Fable 5.2 也可以擔任 Advisor（Haiku、Sonnet、Opus 遇到難題時向它諮詢）或 Orchestrator（把簡單任務分派給小模型）。Haiku 5.5 的公告則把它定位成適合 Opus 5.5、Sonnet 5.5 的 coding subagent。

#### MCP（Model Context Protocol）

2024 年 11 月發佈的工具整合標準。MCP 讓 Claude 能以統一協議呼叫外部工具和資料源，類似 AI 模型的 USB-C 接口。它已成為業界事實標準——OpenAI、Google、Microsoft 都已支援或宣布支援。對 Agent 開發者來說，這是 Claude 生態外溢影響力最大的那一環。

#### Claude Code

2025 年 2 月隨 Claude 3.7 Sonnet 一起推出的 CLI 編碼工具。Claude Code 讓開發者在終端機中直接與 Claude 協作編碼，支援檔案讀寫、Git 操作、多檔案編輯。到 2026 年，它已成為 Anthropic 最重要的產品之一——不只是模型的包裝，而是深度整合了 Agent 工作流。

## 評測與競品比較

### 效能位置
Claude 5.5 世代各型號的官方公告重點如下，皆為 Anthropic 自測或 Anthropic 引用的第三方評測：

| 模型 | 官方重點數字 |
|---|---|
| Claude Fable 5.2 | FrontierSWE v2 69.9%（GPT-6 Astra 65.5%、Gemini 4 Carbon 61.2%）；Terminal-Bench-Science 0.1 74.6%（Mythos 5.2 75.3%）；OSWorld 2.1 89.3%；AutomationBench 51.4%（Gemini 4 Carbon 53.9%）；FrontierCode 2.0 49.1%（xhigh）；RoboDojo Sim 64.9% |
| Claude Opus 5.5 | Terminal-Bench 4.0 66.4%（GPT-6 Astra 57.9%）；GDPval-AA v2.1 1846 Elo；AutomationBench 40.0%（GPT-6 Astra 41.4%）；官方自陳 AutomationBench 與 Terminal-Bench-Science 仍落後 GPT-6 Astra |
| Claude Sonnet 5.5 | Terminal-Bench 4.0 70.6%（Sonnet 5 10.3%）；GDPval-AA v2.1 1844，只比 Opus 5.5 低 2 分；OSWorld 2.1 80.1% |
| Claude Haiku 5.5 | OSWorld 2.1 72.4%（Haiku 4.5 15.7%、GPT-6 Luna 48.9%）；Terminal-Bench 4.0 39.2%（GPT-6 Luna 16.4%） |

和第三方與競品公告對照：

| 來源 | 結果 |
|---|---|
| Artificial Analysis Intelligence Index | Fable 5.2 以 65 分排第一，GPT-6.2 Astra 62、Gemini 4 Neon 61（[Neon 模型卡](/posts/daily/2026-11-20-model-google-gemini-4-neon)整理） |
| OpenAI GPT-6.2 公告 | Agents' Last Exam 上 GPT-6.2 Astra 比 Fable 5.2 高 5.5 分、成本約 5%，但 Fable 5.2 的成績排除了九個用到 fallback 的任務 |
| Google Gemini 4 公告 | AutomationBench 上 Gemini 4 Neon 56.3%、Carbon 53.9%，都高於 Fable 5.2 的 51.4% |

讀這些數字的兩個注意點。第一，Anthropic 自己在 Opus 5.5 公告寫明，到這個能力水準 benchmark 差距已經不太能反映實際差異，他們內部使用感受到的 Opus 5.5 與 Fable 5.1 差距比分數小。第二，各家公告都挑自己領先的 benchmark：Claude 強在 FrontierSWE、OSWorld、Terminal-Bench-Science，OpenAI 強調每任務成本，Google 強調 AutomationBench。跨家比較要看同一個 benchmark、同一個 effort 設定。


### 跟競品的位置
把 Claude 放回 2026 年底的格局：

- **對上 GPT**：Fable 5.2 在綜合指標領先 GPT-6.2 Astra，Astra 的優勢是每任務成本低很多（$8／$40 同價，但 OpenAI 稱 token 用量少）。Opus 5.5 對 GPT-6.2 Sol 是 $4／$20 對 $2／$10。詳見 [GPT 家族](/posts/tech/2026-08-24-ai-model-family-gpt)
- **對上 Gemini**：Gemini 4 Neon（$3／$15）在 Coding Agent Index 與 AutomationBench 領先，Claude 在 FrontierSWE、computer use 與綜合指標較強；Gemini 的原生影片／音訊輸入是 Claude 沒有的。詳見 [Gemini 家族](/posts/tech/2026-08-24-ai-model-family-gemini)
- **對上開源（DeepSeek／Qwen／Kimi／GLM）**：開源模型可自架、單價低一到兩個數量級；Claude 的優勢是 agentic 穩定性、Claude Code 與 MCP 生態、企業支援，但無法自架

## 授權、價格與部署

### 授權陷阱：只有商用 API，沒有開放權重
Claude 是系列裡少數完全沒有開放權重的家族——只有商用 API，沒有可下載的權重，也沒有 Apache/MIT 授權。它的「授權」就是 Anthropic 的服務條款（Terms of Service）和可使用政策（Acceptable Use Policy）。這帶來四個但書：

- **無法自架**：所有推理都必須走 Anthropic 的 API 或經授權的雲端。資料主權敏感的行業若要完全在地部署，Claude 直接出局
- **條款可變**：Anthropic 保留隨時調整價格、速率限制、可接受使用範圍的權利
- **安全過濾不可自行關閉**：拒答邊界由 Anthropic 決定。要放寬資安或生物相關限制，唯一途徑是申請驗證計畫取得 Mythos 或驗證後的 Opus 5.5，不是自己設定
- **各平台壽命不同**：官方停用頁的日期只適用 Anthropic 營運的平台（Claude API、Claude Platform on AWS、Anthropic 營運的 Google Cloud、Microsoft Foundry）；Amazon Bedrock 與 Google 營運的 Google Cloud 自訂停用日。例如 Sonnet 4 在 Claude API 2026-06-15 就退役，Bedrock 晚了四個月

退役與遷移要注意的時程：

- **Sonnet 4.5** 在 2026-11-30 從 Anthropic 營運的平台退役，官方建議換 Sonnet 5.5（[退役公告](/posts/daily/2026-10-23-pricing-anthropic-claude-sonnet-4-5-retirement)）
- **Opus 4.8 的 fast mode** 已標為棄用，官方建議改用 Opus 5.5 fast mode（[下架公告](/posts/daily/2026-11-09-pricing-anthropic-claude-opus-4-8-fast-mode-sunset)）
- **Haiku 4.5** 的退役承諾是「不早於 2026-10-15」，已經過了這個日期，隨時可能公告停用
- **新模型的退役承諾**：Fable 5.2、Opus 5.5、Sonnet 5.5、Haiku 5.5 都是「不早於發佈後一年」，Anthropic 承諾退役前至少 60 天通知


### Claude 5.5 世代：Fable、Opus、Sonnet、Haiku 怎麼選
各型號的定價與規格見上方四層比較表。其他計費規則：

- **Fast mode**：輸出速度最高 2.5 倍。Fable 5.2 fast mode 為 $16／$80；Opus 5.5 也有 fast mode；Opus 5 仍是研究預覽，Opus 4.8 已棄用
- **US-only 推論**：Claude 4.6 之後的型號設定 `inference_geo: "us"` 時，所有 token 價格乘以 1.1
- **Batch API**：Message Batches API 為標準價 50%，Opus 5.5、Sonnet 5.5、Haiku 5.5 搭配 beta header 最多可輸出 300K tokens
- **舊型號仍在架上**：Fable 5.1 與 Fable 5 維持 $10／$50，要拿到 Fable 5.2 的新價必須手動換 model ID；Opus 5 $5／$25、Sonnet 5 $2／$10、Haiku 4.5 $1／$5

定價與規格來自[Claude 官方模型總覽](https://platform.claude.com/docs/en/about-claude/models/overview)與[Claude Pricing](https://platform.claude.com/docs/en/about-claude/pricing)。

## Agent 使用與選型

### 對 Agent 開發者的意義
- **不確定用哪個** → 先用 Opus 5.5：官方建議多數工作從它開始，效果不夠再升 Fable、成本太高再降 Sonnet／Haiku
- **最難的推理、長程 agent、科學研究** → Fable 5.2：綜合指標第一，FrontierSWE、Terminal-Bench-Science、OSWorld 領先；也可當其他模型的 Advisor
- **範圍明確的日常 coding、文件與簡報** → Sonnet 5.5：$2／$10，Terminal-Bench 4.0 70.6%，速度比 Opus 快
- **高量分類、抽取、路由、coding subagent** → Haiku 5.5：短 prompt $0.10／$0.50；注意超過 100K 價格變 5 倍
- **資安研究或生醫研究** → 申請 Cyber 或 Life Sciences Verification Program，才能用 Mythos 5.2 或放寬護欄的 Opus 5.5
- **企業級 tool 整合** → MCP 協議已經是業界標準，Claude 對 MCP 的支援最原生
- **還在用 Sonnet 4.5、Opus 4.8 fast mode** → 依退役時程遷移；新 tokenizer 會多產生約 30% token，用自己的請求估算實際帳單
- **本地部署** → Claude 是閉源的，無法自架。需要本地部署請看 Qwen 或 DeepSeek

## 限制與取捨

Claude 無法自架，安全拒答邊界也無法由企業自行鬆綁，要放寬只能走驗證計畫。官方 benchmark 多為自測，且各家挑自己領先的項目；Anthropic 自己也承認在這個能力水準 benchmark 差距不太可靠。高品質 Agent 的代價包含較高 token 費用與服務條款依賴；各雲端平台的停用日不一致，要依實際呼叫的平台確認。

### 整體來說
Claude 的故事是「安全研究如何變成商業競爭力」。Anthropic 從 AI 安全出發，用 Constitutional AI 建立了模型對齊的技術壁壘，再用 MCP 和 Claude Code 把模型能力轉化為開發者工具。2026 年的四層產品線從 Haiku 5.5 的 $0.10 到 Fable 5.2 的 $40，覆蓋了每個價格帶。

5.5 世代的主軸是讓更便宜的層級追上上一代的最高層：Opus 5.5 達到 Fable 5.1 水準、價格降 20%；Sonnet 5.5 在部分評測接近 Opus 5.5；Haiku 5.5 成本降約 75%。對 Agent 開發者來說，務實的做法是以 Opus 5.5 為預設，最難的任務交給 Fable 5.2，大量執行交給 Sonnet 或 Haiku。只是這份能力仍不能用「自架」換來，也不能用開源授權鎖住。


## 更新紀錄

- **2026-11-20**：補上 Claude 5.5 世代（Fable 5.1、Opus 5.5、Sonnet 5.5、Haiku 5.5、Fable 5.2／Mythos 5.2）。版本矩陣、四層定價表、子線表、評測、退役時程與選型改寫為 2026-11-20 Claude 官方模型總覽、定價頁、停用頁與官方公告的內容；新增 Fable／Mythos 同底層模型、Advisor／Orchestrator 協作、快取與 tokenizer 計費細節。Claude 5 世代降為歷史：原本的 Fable 5／Opus 5 SWE-bench、LiveBench 對照表與選型表移出正文，當時的數字見時間線連結的每日模型卡；時間線改為每列註明「改變了什麼選型」。修正錯誤：原文稱 Claude 是系列「唯一」沒有開放權重的家族，改為「少數之一」；原文稱 Opus 5 被認證為「最對齊的模型」查無出處，改引 Opus 5.5 公告的自動行為稽核結果；原文的 Haiku 4.5 已不是現行輕量層。
- **2026-10-11**：依家族共同格式重組章節，補上由既有內容整理的矩陣。沿用原有版本、價格與來源日期，未進行新一輪事實查證。

## 參考資料

- [Introducing Claude Fable 5.2 and Claude Mythos 5.2 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-2)
- [Introducing Claude Opus 5.5 — Anthropic](https://www.anthropic.com/claude-opus-5-5)
- [Introducing Claude Sonnet 5.5 — Anthropic](https://www.anthropic.com/claude-sonnet-5-5)
- [Introducing Claude Haiku 5.5 — Anthropic](https://www.anthropic.com/claude-haiku-5-5)
- [Claude Fable 5.1 and Mythos 5.1 — Anthropic](https://www.anthropic.com/claude-fable-and-mythos-5-1)
- [Claude Models Overview — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/models/overview)
- [Claude Pricing — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)
- [Model deprecations — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Introducing Claude Opus 5](https://www.anthropic.com/news/claude-opus-5)
- [Introducing Claude Sonnet 5](https://www.anthropic.com/news/claude-sonnet-5)
- [Claude Fable 5 and Claude Mythos 5](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Constitutional AI: Harmlessness from AI Feedback (arXiv:2212.08073)](https://arxiv.org/abs/2212.08073)
- [Anthropic 官方網站](https://www.anthropic.com)
- [Claude Model History — ClaudeKit Guide](https://getclaudekit.com/blog/models/claude-model-history)
- [Anthropic Wikipedia](https://en.wikipedia.org/wiki/Anthropic)
- [Claude (AI) Wikipedia](https://en.wikipedia.org/wiki/Claude_(AI))
- [AI 模型評測來源指南](/posts/tech/2026-08-24-ai-model-evaluation-sources) — 本站
- [AI 模型用途總覽](/posts/tech/2026-08-24-ai-model-landscape-overview) — 本站
