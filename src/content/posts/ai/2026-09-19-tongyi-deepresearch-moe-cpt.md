---
title: "Tongyi DeepResearch：從零到 Agentic Foundation Model"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, Tongyi, MoE, Agentic CPT, Qwen3, Alibaba, end-to-end training]
lang: zh-TW
tldr: "前四篇分別看全景、訓練、長時程、規劃。這篇看一個把所有環節串起來的完整系統：Tongyi DeepResearch。核心創新是『Agentic CPT』——在預訓練和微調之間插入一個 agentic 中間訓練階段，讓模型天生帶有 agent 偏置。MoE 架構 30B 參數只激活 3B，HLE 32.9 超越 OpenAI o3。"
description: "深入解析 Tongyi DeepResearch 的完整訓練管道：Agentic CPT（中間訓練）+ Agentic SFT（冷啟動）+ Agentic RL（GRPO），MoE 30B-A3B 架構，雙模式推理（ReAct + Heavy）。HLE 32.9、BrowseComp 43.4、FRAMES 90.6，開源系統中首次與 OpenAI DeepResearch 匹敵。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 5
---

前面四篇各看了一個環節：全景分類、訓練方法（WebDancer/WebThinker）、長時程記憶（IterResearch/AREX）、規劃優化（WebWeaver/DeepPlanner）。

這篇把鏡頭拉遠，看一個**把所有環節串起來的完整系統**：Tongyi DeepResearch（arXiv:2510.24701，Alibaba Tongyi Lab）。

它的核心問題是：**能不能從一個普通預訓練模型出發，通過一條完整的管道，造出一個專門做 deep research 的 agent？**

答案是：能。而且不只是能做到，還能做到開源 SOTA。

## 核心創新：Agentic CPT

大多數 LLM 訓練管道是：預訓練 → 微調（後訓練）。

Tongyi DeepResearch 發現這個流程有一個根本問題：**一般預訓練模型沒有「agent 偏置」**——它不知道什麼時候該搜尋、怎麼使用工具、如何管理長時程任務。你可以用後訓練把行為「貼」上去，但模型本質上還是個聊天模型。

他們的解法是在預訓練和後訓練之間插入一個**中間階段**：

```
預訓練 → Agentic CPT → Agentic SFT → Agentic RL → Tongyi DeepResearch
```

### Agentic CPT 是什麼？

Agentic Continual Pre-training 的核心思想：**不是在語料上繼續預訓練，而是在合成 agent 軌跡上繼續預訓練**。

訓練數據包含：
- 結構化的研究過程軌跡（提問 → 搜尋 → 閱讀 → 綜合）
- 工具調用記錄（什麼時候調用什麼工具）
- 圖結構知識（關聯性）

第一階段用 32K 上下文長度，第二階段擴展到 128K。模型在這個過程中學會了「當 agent」的**內在偏置**——不是被教條式的 prompt 綁住，而是真正理解 agent 行為的本質。

### 為什麼叫「pre-aligned」？

論文用詞很精確：Agentic CPT 建立的是一個 **pre-aligned agentic foundation model**——在進入任何後訓練之前，模型已經具備了 agent 行為的基礎能力。後面的 SFT 和 RL 只是在這個基礎上精調，而不是從零開始「貼」行為。

## 三階段訓練管道

| 階段 | 方法 | 數據 | 目標 |
|---|---|---|---|
| **Agentic CPT** | 持續預訓練 | 大規模合成 agent 軌跡 | 給模型植入 agent 偏置 |
| **Agentic SFT** | 監督微調 | ReAct + IterResearch 格式軌跡 | 冷啟動，schema 一致性 |
| **Agentic RL** | GRPO | 合成任務 + 真實環境 | 自我進化 |

### 數據合成：AgentFounder

整個管道的數據是**完全自動**的，沒有人工標註：

AgentFounder 系統把原始文本、圖結構知識、工具日誌轉換為結構化的 QA 對和動作序列。這就像為模型建立一個「記憶宮殿」——把研究過程的結構內化到參數中。

### RL 訓練：數據 > 算法

Tongyi 團隊有一個有趣的觀察：

> "The algorithm is important but not the only decisive factor. **Data and stability of the training environment** are likely the more critical components."

他們實驗了直接訓練模型在 BrowseComp 測試集上，結果遠差於用合成數據。假設是：直接看答案會導致過擬合，而合成數據保持了泛化性。

他們用了 customized GRPO，包含 token-level gradients 和 negative sample filtering，確保訓練穩定。

## 架構：MoE + 128K 上下文

| 特性 | 規格 |
|---|---|
| 總參數 | **30.5B** |
| 激活參數 | **3.3B** per token |
| 基礎模型 | Qwen3-30B-A3B |
| 上下文長度 | **128K** |
| 推理模式 | ReAct（標準）+ Heavy（IterResearch） |

MoE 設計的優勢：
- 推理成本 ≈ 小型密集模型
- 但保留專家容量（每個 token 只激活 3.3B 的專家）
- 128K 上下文支援長時程瀏覽會話和迭代綜合

### 雙模式推理

**ReAct 模式**（標準）：核心能力檢測，單一 agent 循環。

**Heavy 模式**（IterResearch）：並行 context-managed agents + synthesis，針對最困難的任務。這也是為什麼 HLE 從 32.9 提升到 **38.3** 的原因。

## 基準表現：開源 SOTA

| 基準 | Tongyi DeepResearch | OpenAI o3 |
|---|---|---|
| HLE | **32.9**（ReAct）/ 38.3（Heavy） | 24.9 |
| BrowseComp (EN) | **43.4** | 49.7* |
| BrowseComp (ZH) | **46.7** | 58.1* |
| WebWalkerQA | **72.2** | — |
| GAIA | **70.9** | — |
| xbench-DeepSearch | **75.0** | 67.0 |
| FRAMES | **90.6** | — |
| xbench-DeepSearch-2510 | **55.0** | — |

> *OpenAI o3 的 BrowseComp 分數是已知的，但基於不同提示策略。Tongyi 在效率上佔優——用 3B 激活參數達到相近或更好的效果。

關鍵結論：**用 30B 總參數 / 3B 激活參數，超越了 o3 等更大的封閉系統。**

## 系統觀：串起前面的篇章

Tongyi DeepResearch 不是一個單獨的技術創新，而是一個**系統整合**。它把前面幾篇文章的洞察串起來：

| 前面文章的洞察 | Tongyi 如何整合 |
|---|---|
| order 2（WebDancer/WebThinker） | 從零訓練的價值 → Agentic CPT 從基礎植入 agent 行為 |
| order 3（IterResearch/AREX） | 長時程記憶 → 128K 上下文 + Heavy 模式的並行 agents |
| order 4（WebWeaver/DeepPlanner） | 規劃優化 → IterResearch 格式作為 SFT 訓練格式之一 |

**它證明了一件事：deep research agent 不是靠一個單點技術突破，而是靠整個訓練管道的系统性設計。**

## 關鍵教訓

從 Tongyi 的實踐中，最值得帶走的幾點：

1. **預訓練不能直接產生 agent**——需要 Agentic CPT 作為中間橋樑
2. **數據品質 > 算法創新**——合成數據的品質決定了整個系統的上限
3. **環境穩定性 > 算法選擇**——訓練環境的穩定性比用什麼 RL 算法更關鍵
4. **MoE 是成本效率的關鍵**——30B 總參數但只激活 3B，讓這個系統在實際部署中可行

## 下一步

最後一篇看「未來展望」：具身研究、科學自動化、agent 叢集。

## 參考資料

- [Tongyi DeepResearch Technical Report](https://arxiv.org/abs/2510.24701) — Kuan Li et al., Tongyi Lab, Alibaba. 30.5B MoE, Agentic CPT, HLE 32.9。
- [Tongyi DeepResearch Blog](https://tongyi-agent.github.io/blog/introducing-tongyi-deep-research) — 官方介紹，包含完整系統概述。
- [Tongyi DeepResearch GitHub](https://github.com/Alibaba-NLP/DeepResearch) — 模型、框架、解決方案全面開源。
- [Scaling Agents via Continual Pre-training](https://arxiv.org/abs/2509.13310) — 姊妹論文，詳細解釋 Agentic CPT 方法論。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
