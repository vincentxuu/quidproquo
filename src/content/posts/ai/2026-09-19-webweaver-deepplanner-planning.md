---
title: "WebWeaver 與 DeepPlanner：雙 Agent 架構與規劃優化"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, planning, dual-agent, advantage-shaping, webweaver, deepplanner, iclr2026, acl2026]
lang: zh-TW
tldr: "前面看的是怎麼訓練 agent 和怎麼維持長時程。這篇看更深一層的問題：怎麼讓 agent 的『規劃』本身變好？WebWeaver 用雙 agent（規劃者+寫作者）從架構上解決，DeepPlanner 用優勢 shaping 從訓練上解決。兩者指向同一件事：規劃是 deep research 的上限。"
description: "深入比較 WebWeaver（雙 agent 迭代輪廓優化，DeepResearch Bench 50.58、引文準確率 93.37%）與 DeepPlanner（優勢 shaping 強化規劃，67.1 MBE 超越 32K 樣本訓練）。前者從架構入手，後者從訓練入手。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 4
---

前面三篇看的是：全景分類（order 0）、訓練方法（order 2）、長時程記憶（order 3）。這篇往深一層看：**規劃本身怎麼變好？**

Deep research 的核心循環是：規劃 → 搜尋 → 綜合 → 輸出。但大部分系統把「規劃」當成一個步驟——設計好 workflow，然後執行。WebWeaver（ICLR 2026）和 DeepPlanner（ACL Findings 2026）問了同一個問題：**能不能把規劃本身變成一個可被持續優化的能力？**

答案是兩種不同路徑：
- **WebWeaver**：從**架構**入手——雙 agent 迭代輪廓優化
- **DeepPlanner**：從**訓練**入手——優勢 shaping 強化規劃 token

## WebWeaver：雙 Agent 迭代輪廓

WebWeaver 的核心問題是：現有 deep research 的「規劃」和「證據獲取」是**靜態分離**的——先規劃好全報告結構，再一次搜尋所有內容。這導致兩個問題：

1. **靜態 pipeline**：規劃與證據獲取解耦，發現新證據時無法回頭調整結構
2. **長上下文失敗**：一次性塞入所有證據產生報告，導致 "loss in the middle" 和幻覺

### 雙 Agent 架構

| Agent | 角色 | 做什么 |
|---|---|---|
| **Planner** | 研究者 | 動態輪廓優化：搜尋 → 優化輪廓 → 再搜尋 |
| **Writer** | 寫作者 | 分層检索 + 逐節寫作：從記憶庫定向提取證據 |

### Planner：動態輪廓優化循環

不是「先寫好輪廓再填資料」，而是**邊搜邊優化輪廓**：

```
輪廓優化 → 搜尋證據 → 更新輪廓 → 搜尋證據 → ...（迭代）
```

每一步迭代，Planner 都會：
1. 根據當前輪廓決定下一步要搜尋什麼
2. 把找到的證據以 citation ID 存入**記憶庫**
3. 根據新證據調整輪廓結構

### Writer：分層定向检索

Writer 不會讀整個記憶庫。它只會：
1. 讀取輪廓中每個章節對應的 citation IDs
2. 針對性地提取那些證據
3. 逐節寫作

這個設計的精妙之處：**Planner 嵌入 citation ID 到輪廓中 → Writer 用這個結構做定向检索**。這樣幾乎消除了長上下文問題和幻覺。

### 基準表現

| 基準 | WebWeaver | Gemini Deep Research | OpenAI Deep Research |
|---|---|---|---|
| DeepResearch Bench（總分） | **50.58** | 49.71 | 46.45 |
| 引文準確率 | **93.37%** | 78.3% | 75.01% |
| 有效引文數 | 200+ | — | — |

Planner 執行約 16 步搜尋、2+ 輪結構優化、儲存 100+ 頁網頁（67,000 tokens 證據）。Writer 產出 26,000-token 報告。

模型：Tongyi-DeepResearch-30B-A3B（基於 Qwen3-30B-A3B-Instruct 微調）。

## DeepPlanner：優勢 Shaping 強化規劃

DeepPlanner 從另一個角度切入：**不是改架構，而是訓練 agent 更好地規劃。**

### 核心發現

在 vanilla RL 訓練中，**規劃 token 的熵顯著高於其他動作 token**——這代表規劃階段的決策點最不確定、最需要學習，但 vanilla RL 對這些區域的更新不夠有效。

### Advantage Shaping

兩個關鍵技術：

**1. Token 級熵形優勢**

在原始 token-level advantage 上附加一個熵項：
- 對高熵 token（不確定的規劃決策）給更大梯度
- 對強負優勢 token 做 clipping 防止符号翻轉
- 本質上：「告訴模型哪些地方你最不確定，重點學這裡」

**2. Sample 級優勢加權**

對於規劃密集型的 rollups（那些需要大量規劃決定的任務），提高其樣本級優勢權重。

### 結果

| 指標 | DeepPlanner | EvolveSearch-ite3 |
|---|---|---|
| 訓練樣本 | **3,072** | 32,000 |
| Rollouts per sample | **8** | 16 |
| 整體 MBE | **67.1** | 較低 |
| 基準數 | 7 個 deep research | — |

用 1/10 的樣本和一半的 rollouts，超越了花 10 倍資源訓練的系統。

### 核心結論

> **提升高層規劃品質，比單純增加數據量或 rollouts 更關鍵。**

## 兩者的關係與差異

| 維度 | WebWeaver | DeepPlanner |
|---|---|---|
| **切入點** | 架構設計 | 訓練方法 |
| **核心機制** | 雙 agent + 迭代輪廓優化 | 熵形優勢 shaping |
| **解決的問題** | 規劃與證據解耦、長上下文失敗 | 規劃 token 不確定、RL 更新低效 |
| **角色分配** | Planner 負責規劃，Writer 負責寫作 | 單 agent，但 token 級區分規劃 vs 執行 |
| **證據管理** | 記憶庫 + citation ID 定向检索 | 不直接管理證據結構 |
| **數據效率** | 不強調 | 1/10 樣本即超越 |
| **適用場景** | 開放式研究報告（需要結構化輸出） | 強化任何 deep research agent 的規劃能力 |

### 互補性

這兩個方法不是互斥的，而是**互補的**：

- WebWeaver 提供了**架構範式**：規劃者和寫作者分離，迭代優化輪廓
- DeepPlanner 提供了**訓練方法**：如何讓 agent 在規劃階段學得更快更好

理想情況下，可以把 DeepPlanner 的優勢 shaping 應用到 WebWeaver 的 Planner agent 上——既有架構優勢，又有訓練效率。

## 對 series 的意義

這兩篇把焦點從「訓練整個 agent」轉移到「優化規劃這個特定能力」。對應到三階段路線：

- Phase I（Agentic Search）：規劃決定「搜什麼」
- Phase II（Integrated Research）：規劃決定「怎麼組織報告」
- Phase III（Full-stack AI Scientist）：規劃決定「怎麼設計實驗」

**規劃品質是 deep research 的上限**——搜尋再強，規劃不對就是浪費；寫作再熟，輪廓不對就是亂寫。

## 下一步

最後兩篇看「評估」與「展望」。

## 參考資料

- [WebWeaver: Structuring Web-Scale Evidence with Dynamic Outlines for Open-Ended Deep Research](https://arxiv.org/abs/2509.13312) — Zijian Li et al., ICLR 2026. 雙 agent 框架，DeepResearch Bench 50.58，引文準確率 93.37%。
- [DeepPlanner: Scaling Planning Capability for Deep Research Agents via Advantage Shaping](https://arxiv.org/abs/2510.12979) — Fan et al., ACL Findings 2026. 熵形優勢 shaping，67.1 MBE，7 個基準。
- [Tongyi DeepResearch](https://tongyi-agent.github.io/blog/introducing-tongyi-deep-research) — Alibaba Tongyi Lab 的 deep research agent 系列（WebWalker、WebDancer、WebSailor、WebWeaver 等）。
- [WebWeaver GitHub](https://github.com/Alibaba-NLP/DeepResearch) — Tongyi DeepResearch 倉庫。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
