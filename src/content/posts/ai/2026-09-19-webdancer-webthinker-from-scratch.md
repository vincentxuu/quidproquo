---
title: "WebDancer 與 WebThinker：從零訓練一個 Deep Research Agent"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, web-agent, reinforcement-learning, training, NeurIPS2025, WebDancer, WebThinker]
lang: zh-TW
tldr: "兩篇 NeurIPS 2025 論文回答同一個問題：怎麼從零訓練一個能自主研究網頁的 agent？WebThinker 選擇「給既有用戶模型加上網頁探索能力」，WebDancer 選擇「從資料構造到 RL 訓練完整重來」。兩種哲學，四個階段，一個核心洞察：訓練比 prompt 好。"
description: "深入比較 WebThinker（augmentation 派：RL-DPO 強化既有 LRM）與 WebDancer（end-to-end 派：四階段從零訓練）的訓練方法論、架構設計與基準表現。兩者皆證明同一件事——從頭訓練比設計 workflow 更有上限。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 2
---

上一篇的全景圖裡，四個核心組件之一是「訓練方法」。這篇直接把鏡頭對準訓練本身：**兩篇 2025 年 NeurIPS 論文，用兩種截然不同的哲學，從零訓練出能自主研究網頁的 agent。**

兩者面對同一個問題：「一個 agent 要怎麼學會在網路上自主搜尋、導航、綜合，最終產出研究報告？」

- **WebThinker**（arXiv:2504.21776）：給既有的 Large Reasoning Model（LRM，如 QwQ-32B、DeepSeek-R1）**加上**網頁探索能力。
- **WebDancer**（arXiv:2505.22648）：從資料構造、軌跡採樣、監督初始化到 RL 強化，**完整重建**一個 web agent。

這不是單純的技術差異，而是對「deep research agent 怎麼來」的根本回答。

## 兩種訓練哲學

| 維度 | WebThinker | WebDancer |
|---|---|---|
| **起點** | 既有 LRM（QwQ-32B / DeepSeek-R1） | 從零開始 |
| **核心思路** | 附加模組（Deep Web Explorer） | 端到端四階段 pipeline |
| **訓練方式** | Online DPO（強化工具使用） | SFT cold-start → DAPO RL |
| **格式** | Think-Search-Draft 交織 | ReAct |
| **適合** | 快速增強現有推理模型 | 打造專用 agent 模型 |

## WebThinker：給推理模型裝上網頁眼睛

WebThinker 的核心假設是：**LRM 已經會「想」，但不會「找」。** 它們有強大的內部推理能力，卻受困於靜態知識——遇到需要即時資訊或跨來源綜合的問題就卡住。

解法是三個模組：

### 1. Deep Web Explorer

當模型偵測到「知識缺口」時，自動觸發網頁探索：搜尋 → 導航 → 提取。這個模組不干涉模型的正常推理流程，只在需要的時候介入。

### 2. Autonomous Think-Search-and-Draft

模型在思考過程中自然地交織三種行為：
- **Think**：推理、分析、識知缺口
- **Search**：觸發網頁探索填入缺口
- **Draft**：將證據寫入報告

整個過程在單次 generation 內完成，不需要外部 orchestrator 來中斷和重新啟動。

### 3. Online DPO 訓練

用 Direct Preference Optimization 強化工具使用：
- 生成多條可能的推理路徑（有些搜尋、有些不搜）
- 比較這些路徑的結果
- 偏好「準確且高效」的路徑（不僅答案對，過程也要简洁）

這是「online」的——訓練數據持續更新，不是固定在靜態數據集上訓練一輪。

**基準表現**（WebThinker-32B-RL）：

| 基準 | 表現 | 對比 |
|---|---|---|
| GPQA | 70.7% | 超過所有 baseline |
| GAIA | 48.5% | +8.5% vs base |
| WebWalkerQA（整體） | 46.5% | 難度最高子題 15.8% |
| HLE | 15.8% | **超越 o3-mini (High)** |

WebThinker-R1-7B 更是相對於直接生成有 **174.4%（GAIA）** 和 **422.6%（WebWalkerQA）** 的提升。

## WebDancer：四階段從零建構

WebDancer 選了一條更难的路：**不依賴任何預訓練的推理能力，從資料和訓練 pipeline 開始重建。**

### 四階段 pipeline

| 階段 | 做什么 | 為什麼 |
|---|---|---|
| **1. Browsing data construction** | 構建大規模瀏覽軌跡數據 | 提供訓練素材 |
| **2. Trajectories sampling** | 從數據中採樣多樣化互動軌跡 | 確保覆蓋多種任務類型 |
| **3. SFT cold-start** | 監督微调給予初始能力 | 避免 RL 從零開始的不穩定 |
| **4. RL (DAPO) generalization** | 增強泛化能力 | 超越教師模型的表現 |

### 為什麼需要 SFT？

WebDancer 的論文明確指出：**RL 從零開始訓練 web agent 是不穩定的。** 環境獎勵訊號稀疏（只有在最終步驟成功/失敗），模型在早期幾乎學不到什麼。

所以他們先用 SFT 建立「冷啟動」能力——讓模型知道「搜尋、點擊、閱讀、綜合」是什麼感覺，然後再用 RL 在此基礎上精調。

### 架構

基於 ReAct 格式實例化為 WebDancer：
- 觀察網頁狀態
- 推理下一步該做什麼
- 執行動作（點擊、輸入、滾動）
- 根據反饋調整

**基準表現**（WebDancer-32B）：

| 基準 | Pass@1 | Pass@3 |
|---|---|---|
| GAIA | 51.5% | 64.1% |
| WebWalkerQA | 47.9% | 62.0% |

> 後續他們也推出了 **WebSailor**（2025 年 6 月），在更困難的瀏覽基準上達到 open-source SOTA。

## 兩者的根本差異

表面上看，兩個方法都用到 RL，結果也都在 GAIA/WebWalker 上有不錯表現。但它們回答了不同問題：

**WebThinker 回答的是：「已經有一個很強的推理模型，怎麼給它網頁能力？」**
→ 附加模組 + 在線 DPO。優勢是快速、可以利用現有模型投資。代價是受制於底層模型的架構限制。

**WebDancer 回答的是：「怎麼從零建構一個專門做網頁研究的 agent？」**
→ 完整 pipeline + SFT + RL。優勢是可以針對任務特性從頭優化每一層。代價是需要大量資料和訓練資源。

### 共同結論

不管走哪條路，兩篇論文都指向同一件事：

> **端到端訓練（RL/SFT）產生的 agent 比手動設計 workflow 的 agent 有更高的上限。**

WebThinker 證明了即使在既有強大模型上，加上 RL 訓練的工具使用能力也能產生質變。WebDancer 進一步證明了從零開始訓練能突破更大的天花板。

這個結論直接對應到上一篇三階段路線中的「優化範式」：workflow prompting 是起步方便的下策，SFT 是實用的中策，端到端 RL 是理論上最美的上策。

## 下一步

這兩篇聚焦在「怎麼訓練 agent」。後續文章會看「怎麼讓 agent 持續學習」（IterResearch、AREX）與「怎麼優化規劃」（WebWeaver、DeepPlanner）。

## 參考資料

- [WebThinker: Empowering Large Reasoning Models with Deep Research Capability](https://arxiv.org/abs/2504.21776) — Xiaoxi Li et al., NeurIPS 2025. Deep Web Explorer + Think-Search-Draft + Online DPO。
- [WebDancer: Towards Autonomous Information Seeking Agency](https://arxiv.org/abs/2505.22648) — Jialong Wu et al., NeurIPS 2025. 四階段從零訓練 pipeline。
- [WebThinker GitHub](https://github.com/RUC-NLPIR/WebThinker) — RUC-NLPIR 維護，代碼與模型已開源。
- [WebDancer/WebSailor GitHub](https://github.com/jurgen-paul/WebAgent) — WebSailor 後續版本，開源 SOTA。
- [autonomous-deep-research-agent](/posts/ai/2026-06-04-autonomous-deep-research-agent) — 本系列前一篇文章：四個環節的架構拆解。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
