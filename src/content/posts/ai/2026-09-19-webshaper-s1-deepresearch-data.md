---
title: "數據合成：WebShaper 與 S1-DeepResearch"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, data-synthesis, WebShaper, S1-DeepResearch, formalization, ICLR2026]
lang: zh-TW
tldr: "前面看的是怎麼訓練 agent。但訓練需要高品質數據——而 deep research 的訓練數據長期短缺。WebShaper 用數學形式化解決這個問題：把資訊搜尋任務形式化為集合論，再用 agentic Expander 逐步擴展。S1-DeepResearch 則是把訓練從『搜尋為中心』擴展到『真正做研究』。"
description: "深入分析 WebShaper（集合論 + Knowledge Projections 形式化數據合成，GAIA 60.1%）與 S1-DeepResearch（五維統一軌跡建構，超越搜尋中心）。兩者回答同一個問題：怎麼產出高品質的 deep research 訓練數據？"
draft: false
series:
  name: "Deep Research 前沿"
  order: 6
---

前面幾篇看的都是「怎麼訓練」：從零訓練（order 2）、長時程記憶（order 3）、規劃優化（order 4）、完整管道（order 5）。

但所有這些都建立在同一個前提上：**有高品質的訓練數據。**

現實是，deep research 的訓練數據長期短缺。傳統做法是「先收集網頁，再根據內容生成問題」——但這個做法有結構性問題：**資訊結構與推理結構不一致**。搜尋到的東西不一定能產出好的訓練問題。

這篇看兩個解決方案：
- **WebShaper**：用數學形式化從根本上重新設計數據合成
- **S1-DeepResearch**：把訓練從「搜尋為中心」擴展到「真正做研究」

## 數據瓶頸：為什麼重要

訓練一個 deep research agent 需要什麼樣的數據？

不是普通的 QA 對。而是**結構化的 agent 軌跡**——包含提問、搜尋、瀏覽、綜合的完整過程。

現有方法的問題：

| 方法 | 問題 |
|---|---|
| 從網頁生成問題 | 資訊結構 ≠ 推理結構（搜得到的東西不一定適合訓練） |
| 人工標註 | 不可擴展、成本高 |
| 隨機合成 | 缺乏可控性、品質不穩定 |

WebShaper 和 S1-DeepResearch 分別從**任務形式化**和**軌跡統一**兩個角度突破這個瓶頸。

## WebShaper：集合論形式化

WebShaper 的核心創新是：**用數學正式定義「資訊搜尋任務」本身。**

### 問題本質

現有方法採用「information-driven」範式：
1. 先從網路收集資料
2. 根據收集到的資料生成問題

這導致**資訊結構與推理結構不一致**——搜尋結果的組織方式不一定對應良好的推理過程。

### 解法：集合論 + Knowledge Projections

WebShaper 把資訊搜尋（IS）任務**形式化為集合論**：

- 每個任務被表示為一個數學結構
- **Knowledge Projections (KP)** 是核心操作——它們精確控制推理結構
- KP 的組合可以工程化地控制難度、覆蓋範圍、多樣性

形式化的好處：
1. **可控性**：可以精確控制任務的推理深度和結構
2. **一致性**：資訊結構和推理結構天然一致
3. **可擴展性**：自動生成大量高品質任務

### 合成過程

```
產生種子任務 → agentic Expander 迭代擴展 → 驗證 → 訓練數據集
```

每一步：
1. 從簡單的種子問題開始
2. Agentic Expander 用檢索和驗證工具，根據形式化規則把問題變得更複雜
3. 確保擴展後的問題與形式化定義一致
4. 反覆直到達到目標難度

### 基準表現

| 基準 | WebShaper-72B | 第二名（WebSailor） | OpenAI Deep Research |
|---|---|---|---|
| GAIA (Pass@1) | **60.1%** | 55.4% | 67.4% |
| WebWalkerQA | **52.2%** | — | — |

跨不同基座模型都有效（Qwen-2.5-32B、QwQ-32B、Qwen-2.5-72B），證明形式化方法的通用性。

## S1-DeepResearch：超越搜尋中心

WebShaper 解决了「怎麼產生好的訓練數據」。S1-DeepResearch 問了一個更深層的問題：**「什麼樣的任務才算 deep research？」**

### 問題本質

大多數 deep research 系統是**搜尋中心**的——它們被訓練來回答問題。但真正的研究不只是問答：

| 真實研究能力 | 描述 |
|---|---|
| 資訊搜尋 | 找到相關來源 |
| **證據綜合** | 把多個來源串成有邏輯的敘事 |
| **指令遵循** | 按特定格式要求產出 |
| **交付物生成** | 產出報告、簡報、代碼等 |
| **長時程規劃** | 跨多階段的任務管理 |

大多數訓練數據只覆蓋了第一項。

### 解法：統一軌跡建構

S1-DeepResearch 提出**統一的軌跡建構範式**，結合：
- 封閉式 QA（可驗證的部分）
- 開放式研究任務（需要綜合的部分）

三階段建構：
1. **任務設計**：定義五維能力目標
2. **軌跡合成**：生成包含完整研究過程的軌跡
3. **驗證與過濾**：確保軌跡覆蓋所有維度

### 關鍵洞察

> **搜尋是必要條件，但不是充分條件。**

一個真正的 deep research agent 需要能在搜尋之後做更多事：綜合證據、產生報告、遵循複雜指令。訓練數據必須反映這個現實。

## 兩者的關係

| 維度 | WebShaper | S1-DeepResearch |
|---|---|---|
| **核心問題** | 怎麼產生高品質訓練數據？ | 什麼樣的任務才算 deep research？ |
| **方法** | 集合論形式化 + KP | 統一軌跡建構（五維） |
| **切入點** | 資訊搜尋任務的數學結構 | 研究能力的完整定義 |
| **貢獻** | 數據合成方法論 | 任務定義與軌跡規範 |
| **適用** | 產生 IS 訓練數據 | 定義和產生完整研究任務 |

### 互補性

這兩個方法高度互補：

- **WebShaper** 告訴你怎麼「造出好的問題」——形式化定義 + 系統擴展
- **S1-DeepResearch** 告訴你「什麼是好問題」——不僅僅是問答，而是完整的研究能力

理想的流程：
1. 用 S1-DeepResearch 的視角定義任務維度
2. 用 WebShaper 的形式化方法生成覆蓋所有維度的數據
3. 用這個數據訓練出真正的 deep research agent

## 與 Tongyi 生態的關係

兩個方法都來自 Tongyi Lab（阿里巴巴）：

- **WebShaper**：為 Tongyi DeepResearch 提供了訓練數據基礎
- **Tongyi DeepResearch**（order 5）：用 Agentic CPT + Agentic SFT + Agentic RL 訓練完整系統

這展現了 Tongyi Lab 的系統思路：**先解決數據（WebShaper），再解決訓練（Agentic CPT），最後得到完整系統（Tongyi DeepResearch）。**

## 下一步

最後兩篇看評估與未來展望。

## 參考資料

- [WebShaper: Agentically Data Synthesizing via Information-Seeking Formalization](https://arxiv.org/abs/2507.15061) — Tao et al., ICLR 2026. 集合論 + KP 形式化，GAIA 60.1%。
- [S1-DeepResearch: Beyond Search, Toward Real-World Long-Horizon Research Agents](https://arxiv.org/abs/2606.15367) — Dong et al., ScienceOne AI, 2026. 五維統一軌跡建構。
- [Tongyi DeepResearch Technical Report](https://arxiv.org/abs/2510.24701) — 本系列 order 5，Tongyi Lab 完整系統。
- [Open Data Synthesis For Deep Research](https://arxiv.org/abs/2509.00375) — 相關工作，InfoSeek 數據集。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
