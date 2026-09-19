---
title: "IterResearch 與 AREX：長時程研究的記憶與自我進化"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, long-horizon, agent, memory, self-improvement, iterresearch, arex, markovian]
lang: zh-TW
tldr: "長時間研究時，agent 面臨「上下文窒息」：資訊堆積、噪音增加、注意力被稀釋。IterResearch 用馬可夫狀態重建解決這個問題，AREX 用內外雙循環實現遞迴自我改進。兩者回答同一個問題：agent 怎麼在數百輪搜尋後依然保持清晰？"
description: "深入分析 IterResearch（馬可夫狀態重建 + EAPO，2048 輪互動從 3.5% 到 42.5%）與 AREX（內外雙循環遞迴自我改進，4B/122B-A10B MoE）的長時程架構設計。核心問題：agent 如何在數百輪搜尋後不喪失方向？"
draft: false
series:
  name: "Deep Research 前沿"
  order: 3
---

前面兩篇看的是「怎麼從零訓練 agent」。這篇看一個不同的問題：**訓練好的 agent 要怎麼在長時間研究中保持有效？**

一個 deep research agent 跑 25 輪、100 輪、甚至 2000 輪時，會發生什麼事？

答案是不好的。IterResearch（arXiv:2511.07327）的論文開頭直接診斷了這個問題：**上下文窒息（context suffocation）**——所有資訊堆積在不斷擴大的上下文窗口中，注意力被稀釋，噪音污染推理，agent 最終「越查越亂」。

IterResearch 和 AREX 從不同角度解決同一個問題：**長時程 Agent 的記憶管理與持續進化**。

## 核心問題：上下文窒息

現有 deep research agent 採用「單上下文」（mono-contextual）架構——所有資訊累積在一個持續擴大的 context window 裡。這帶來兩個問題：

1. **噪音污染**：早期搜尋的無關資訊和後來的高價值證據混在一起
2. **注意力稀釋**：模型要從數千個 token 中找出關鍵訊號，信噪比持續下降

結果？agent 在長時間研究後效率急劇下降，甚至比剛開始時更差。

## IterResearch：馬可夫狀態重建

IterResearch 的核心洞察是：**長時程研究不該是線性積累，而是反覆迭代。** 它把深度研究重新形式化為一個馬可夫決策過程（MDP）。

### 關鍵機制：Workspace Reconstruction

每完成一輪動作後，agent 不會把原始資訊留在 context 里，而是**重建一個緊湊的工作空間**：

```
[當前問題] + [演進中的報告/記憶] + [最後動作與觀察]
```

這個「workspace」是 bounded 的——不管研究做了多久，context 維持在同一個大小。舊的細節被「策略性遺忘」（strategic forgetting），只有壓縮後的狀態被保留。

### Efficiency-Aware Policy Optimization (EAPO)

訓練方式考量了「效率」這個維度：不僅問「答案對不對」，還問「你花了多少輪才到達」。這鼓勵 agent 用最少的交互完成研究。

### 驚人的 Scaling 行為

IterResearch 展現了前所未有的 **interaction scaling**：

| 交互輪數 | 表現 |
|---|---|
| 少量交互 | 3.5% |
| 大量交互 | **42.5%** |

而且它不只是訓練出來的 agent，**作為 prompting 策略也能用**——不加訓練地套用到 frontier models上，比 ReAct 風格鏈提升 **+19.2pp**。

六個基準上平均 **+14.5pp**，縮窄了與頂級封閉系統的差距。

## AREX：遞迴自我改進

BAAI 的 AREX 走了另一條路。它不只想解決「context 太大的問題」，還想讓 agent **自己發現自己錯了什麼，然後自己去修**。

### 雙循環架構

| 循環 | 角色 | 做什么 |
|---|---|---|
| **內循環** | 研究者 | 搜尋、閱讀、綜合、構建臨時答案 |
| **外循環** | 審計者 | 逐約束審核答案，發現未解決的主張，啟動針對性後續研究 |

這個架構的核心洞察是 **發現-驗證的不對稱性**（discovery-verification asymmetry）：找到一個主張容易，驗證它是否正確很難。大多數 agent 只做前者。

### 自動上下文更新工具

AREX 學會了一個自主的 `context-update` 工具：
- 把增長的交互歷史壓縮為一個緊湊的 **improvement state**
- 保留已驗證的證據
- 保留未解決的約束條件
- 不依賴外部模型

這樣，外循環每次重新啟動時，都帶著「知道哪些是確定的、哪些還需要查」的精確狀態。

### 訓練策略

為了避免長時程 RL 的稀疏獎勵問題，AREX 強調**關鍵步驟**：
- 獲取決定性證據的時刻
- 糾正錯誤研究方向的時刻

模型：4B 密集模型 + 122B-A10B MoE 模型。

## 兩者的對比與關係

| 維度 | IterResearch | AREX |
|---|---|---|
| **核心問題** | Context suffocation | 發現-驗證不對稱 |
| **解決方案** | 馬可夫狀態重建 | 遞迴自我改進 |
| **架構** | 單循環，壓縮狀態 | 雙循環（研究 + 審計） |
| **記憶** | Workspace（緊湊有界） | Improvement state（證證 + 未解約束） |
| **訓練** | EAPO（效率感知） | 合成任務 + 長時程 RL |
| **Scaling** | 2048 輪交互 | 300 內 + 5 外循環 |
| **獨特優勢** | 作為 prompting 策略可無訓練使用 | 自主審計+自我修正 |

### 共同結論

> **長時程研究不是「更多輪次的搜尋」，而是「持續壓縮和自我修正」的過程。**

IterResearch 告訴我們：記憶管理是第一性的——如果狀態壓縮做得好，2048 輪不是問題。
AREX 告訴我們：自我審計是第二性的——如果 agent 能自己發現哪裡錯了，就能自動延伸研究深度。

兩者組合起來就是一個完整的答案：先壓縮狀態（IterResearch），再審計修正（AREX）。

## 下一步

下一篇看「怎麼優化規劃」——WebWeaver 和 DeepPlanner 如何在搜尋前做得更好。

## 參考資料

- [IterResearch: Rethinking Long-Horizon Agents with Interaction Scaling](https://arxiv.org/abs/2511.07327) — Chen et al., Nov 2025. 馬可夫狀態重建 + EAPO，2048 輪交互 scaling。
- [AREX: Towards a Recursively Self-Improving Agent for Deep Research](https://arxiv.org/abs/2607.21461) — BAAI, Jul 2026. 雙循環遞迴自我改進，4B/122B-A10B MoE。
- [IterResearch GitHub](https://github.com/Chen-GX/IterResearch) — 代碼與執行環境開源。
- [autonomous-deep-research-agent](/posts/ai/2026-06-04-autonomous-deep-research-agent) — 本系列前一篇文章：四個環節的架構拆解。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
