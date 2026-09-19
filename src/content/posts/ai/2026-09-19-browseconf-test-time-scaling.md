---
title: "測試時擴展：BrowseConf 與自信度引導的推理"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, test-time-scaling, BrowseConf, confidence, ACL2026]
lang: zh-TW
tldr: "前面看的是怎麼評估。這篇看另一個維度：在推理過程中怎麼動態分配計算資源。BrowseConf 的核心洞察是——agent 自己說的『自信度』就能預測答案準不準。高自信就用少點資源，低自信就多搜幾輪。"
description: "深入分析 BrowseConf（Confidence-Guided Test-Time Scaling for Web Agents，ACL Findings 2026）：用 agent 自聲明的自信度動態調整推理資源，高自信任務減少 token 消耗，低自信任務自動擴展。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 9
---

前面幾篇看的是訓練、架構、評估。這篇看一個新維度：**測試時計算資源分配**。

深度研究 agent 跑一個任務時，該花多少時間？固定 10 輪？20 輪？還是看情況？

**BrowseConf**（ACL Findings 2026）的答案是：**讓 agent 自己說。**

## 核心問題：測試時的資源分配

現有 deep research agent 面臨一個困境：

- **花太多**：每個任務都跑最多輪次，浪費資源
- **花太少**：簡單任務也跑很多輪，低效
- **不知道該花多少**：沒有機制判斷什麼時候「夠了」

傳統的做法是固定上限（比如最多 30 輪）。但研究發現：
- 有些任務 5 輪就夠了
- 有些任務需要 50 輪
- **agent 自己應該知道何時夠了**

## BrowseConf：自信度引導的測試時擴展

### 核心洞察

BrowseConf 的發現很直接：

> **模型在任務上準確率高時，自信度也高；準確率低時，自信度也低。**

而且，當模型「不知道」時，它會說「我不確定」——而不是亂猜。

這意味著：**自信度是一個有效的信號**，可以決定何時停止、是否重新思考、是否繼續搜尋。

### 機制

```
agent 完成推理 → 輸出答案 + 自信度分數
→ 判斷自信度：
  → 高自信 → 接受答案，結束
  → 低自信 → 重新思考，繼續搜尋
→ 重複直到達到自信度閾值或輪次上限
```

### 關鍵結果

| 指標 | BrowseConf | 基線 |
|---|---|---|
| 準確率（高自信子集） | 顯著高 | — |
| 準確率（低自信子集） | 接近零 | — |
| Token 消耗 | **大幅減少** | 固定輪次 |
| 效率 | 高自信任務用最少資源 | — |

核心結論：**低自信的答案基本上就是隨機的**——模型知道自己不知道，此時應該繼續研究而不是硬答。

### 與 Test-Time Scaling 的關係

BrowseConf 屬於更廣泛的 **Test-Time Scaling (TTS)** 範疇：

| 方法 | 思路 | 例子 |
|---|---|---|
| 計算擴展 | 給更多推理步驟 | o1/o3 風格 |
| 互動擴展 | 給更多工具調用 | BrowseConf |
| 並行擴展 | 同時探索多條路徑 | GenCluster |

BrowseConf 的獨特之處：**用自信度做為「動態資源分配」的信號**，而不是固定分配。

## 實踐意義

### 對開發者

1. **成本優化**：高自信任務用最少 token，降低 API 成本
2. **品質控制**：低自信任務自動標記，提醒使用者答案可能不可靠
3. **適應性**：同一個模型可以處理從簡單到極難的各種任務

### 對使用者

- 得到的不只是答案，還有答案的「可信度標籤」
- 對於「我不知道」的問題，agent 會繼續研究而不是亂給答案

### 對 deep research 系統

BrowseConf 的範式可以整合到任何 deep research pipeline 中：
- 插入在推理過程中作為停止條件
- 與 IterResearch 的「策略性遺忘」結合（高自信時記壓縮，低自信時保留）
- 與 STC 的評估框架結合（自信度校準是評估的一部分）

## 與 series 的關係

| 系列篇 | 連結 |
|---|---|
| order 3（IterResearch/AREX） | AREX 的「improvement state」與 BrowseConf 的「自信度閾值」概念相似 |
| order 7（評估困境） | STC 的核心問題就是「自信度是否準確」 |
| order 15（未來展望） | 自信度引導的資源分配是未來 agent 的標準功能 |

## 關鍵教訓

1. **不確定性的表達比答案本身更有價值**——知道「不知道」是智慧的起點
2. **動態資源分配比固定上限更高效**——讓 agent 自己決定何時夠了
3. **自信度是通用語言**——可以橫跨任務、模型、場景

## 參考資料

- [BrowseConf: Confidence-Guided Test-Time Scaling for Web Agents](https://arxiv.org/abs/2510.23458) — Ou et al., ACL Findings 2026。
- [Inference-Time Scaling of Verification: Self-Evolving Deep Research Agents](https://arxiv.org/abs/2601) — 相關工作，rubric-guided verification。
- [GenCluster: Scaling Test-Time Compute to Achieve IOI Gold Medal](https://arxiv.org/abs/2602) — 並行 TTS 方法。
- [evaluation-stc-challenges](/posts/ai/2026-09-19-evaluation-stc-challenges) — 本系列前一篇文章：評估困境。
