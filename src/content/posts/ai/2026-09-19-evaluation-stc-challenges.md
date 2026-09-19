---
title: "評估困境：為什麼 Deep Research 難以被正確評量"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, evaluation, benchmark, hallucination, STC, citation]
lang: zh-TW
tldr: "Deep research agent 跑出來的報告，該怎麼評分？用 LLM 當評審有偏，問人類太貴，測基準又跟不上。STC 等新方法試圖從「自信度」切入解決這個根本問題——但還沒有完美的答案。"
description: "深入分析 deep research agent 評估的三大困境：LLM 評審偏誤、人類評估成本、基準與現實脫節。STC 方法從自信度校准切入，但評估問題本身仍待解決。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 7
---

前面的文章都在看「怎麼做得更好」。這篇看一個更根本的問題：**怎麼知道做得好不好？**

Deep research agent 產出一份報告——可能長達數千字、帶著幾十個引用——該怎麼評分？

這個問題比看起來困難得多。三個核心困境：

1. **LLM 當評審有偏**：用 GPT-4 評 DeepResearch 的報告，等於讓一個 AI 評另一個 AI
2. **人類評估太貴**：一篇報告要 domain expert 花幾小時審核
3. **基準跟不上現實**：基準測的是「標準答案」，但 deep research 的價值在「過程」

**STC（Self-Trustworthiness Calibration）** 是近期提出的嘗試，從「自信度」切入——讓 agent 自己判斷自己說的準不準。

## 三大評估困境

### 困境一：LLM 評審偏誤

DeepResearch Bench 和 DeepResearch Bench II 都用 LLM 當評審（通常是 Gemini 2.5-Pro）。這有結構性問題：

- **評審者和被評審者同源**：都用同一個家族的模型
- **獎勵長篇大論**：LLM 評審傾向給篇幅長的報告高分，但不一定是好的報告
- **基準不一致**：不同 LLM 評審給的分數差異可達 20%

DeepResearch Bench 的實驗顯示：LLM-judge 與人類專家的一致性約為 91.75%（準確率）和 89.57%（F1）。看起來不錯——但那意味著每 100 個評判就有近 10 個出錯。

### 困境二：人類評估成本

DeepResearch Bench II 用 9,430 個 expert-written rubrics 覆蓋 132 個任務。每個 rubric 是 domain expert 寫的。

成本：
- 每個 rubric 約 15-30 分鐘撰寫
- 132 個任務 × 70+ rubrics = 9,000+ 個評判標準
- 總成本估計數十萬美元

這意味著：**幾乎沒有任何研究團隊能負擔自己的基準**。只能依賴少數大型實驗室釋出的基準。

### 困境三：基準與現實脫節

現有基準（如 DeepResearch Bench、GAIA、WebWalkerQA）評估的是：
- 問答正確性（封閉式）
- 報告完整性（開放式）
- 引文準確率

但真實世界的 deep research 價值不在這些：
- 使用者問的是模糊問題，不是基準上的精確題目
- 過程比結果重要——agent 怎麼找到答案比答案本身更有價值
- 適應性——面對新問題的靈活性

## STC：從自信度切入

STC（Self-Trustworthiness Calibration）的核心想法很巧妙：**不直接評估答案對不對，而是評估 agent 對自己答案的「自信度」是否準確。**

### 核心機制

```
agent 產出答案 → agent 聲明自信度 → 驗證自信度是否與實際準確率匹配
```

如果一個 agent 說「我有 90% 把握」但實際正確率只有 50%，那它的自信度是**過度膨脹**的。反之如果說「我只有 30% 把握」但正確率是 80%，那是**過度保守**。

好的 agent 應該：
- 高自信度 ↔ 高準確率
- 低自信度 ↔ 低準確率

### 實踐方式

STC 的方法：
1. 在推理過程中讓 agent **自願聲明**目前答案的自信度
2. 對比聲明的自信度與實際正確率
3. 用這個差距做為評估指標——而不是只看最終答案

這個方法的好處：
- **不依賴外部評審**：agent 自我評估
- **與使用場景對齊**：使用者在乎的不只是「答案對不對」，而是「答案有多可靠」
- **鼓勵誠實**：過度自信的 agent 會被懲罰

### 局限

STC 還沒有解決所有問題：
- agent 可以學會「聲明高自信度」但實際不準確
- 自信度的量化標準不統一
- 對於開放式研究問題，「正確率」本身就難以定義

## 現狀：還沒有完美答案

| 方法 | 優點 | 缺點 |
|---|---|---|
| LLM 評審 | 自動化、低成本 | 有偏、不一致 |
| 人類評估 | 準確 | 極度昂貴、不可擴展 |
| STC 自信度 | 與使用場景對齊、鼓勵誠實 | 量化標準不統一 |
| 事實核查 | 精確針對引用 | 只覆蓋部分內容 |

**沒有一種方法是完美的**。現實中的評估應該是組合式：
- STC 做為第一道過濾（自信度不準的淘汰）
- LLM 評審做為第二道（結構化評分）
- 隨機人類抽樣做為第三道（校準）

## 關鍵教訓

1. **評估比訓練更難**——一個 agent 可以訓練得很好，但不知道自己在做的事好不好
2. **自信度是真實世界的第一指標**——使用者不只需要答案，還需要知道答案有多可靠
3. **基準是參考不是真相**——DeepResearch Bench II 上 50% 的分數意味著「還有 50% 的專家標準沒達到」

## 下一步

下一篇看基準本身——DeepResearch Bench II 的架構與发现。

## 參考資料

- [DeepResearch Bench II: Diagnosing Deep Research Agents via Rubrics from Expert Reports](https://arxiv.org/abs/2601.08536) — 132 個任務、9,430 個 rubric、專家級評估。
- [DeepResearch Bench](https://deepresearch-bench.github.io) — 100 個 PhD 級任務，RACE + FACT 雙評估。
- [AA-Omniscience: Knowledge and Hallucination Benchmark](https://artificialanalysis.ai/evaluations/omniscience) — 自信度與幻覺的基準。
- [BrowseConf: Confidence-Guided Test-Time Scaling for Web Agents](https://arxiv.org/abs/2510.23458) — 自信度引導的測試時擴展，ACL Findings 2026。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
