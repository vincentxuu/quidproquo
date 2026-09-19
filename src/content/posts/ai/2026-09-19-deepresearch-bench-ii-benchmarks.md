---
title: "基準深度解析：DeepResearch Bench II 與評估格局"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, benchmark, DeepResearch-Bench-II, evaluation, RACE, FACT]
lang: zh-TW
tldr: "DeepResearch Bench II 用 9,430 個專家 rubric 覆蓋 132 個任務，發現最強的 agent 也只滿足不到 50% 的標準。這篇拆解基準架構、评分方法、領先者，並分析整個 deep research 評估格局。"
description: "深入解析 DeepResearch Bench II：132 個 task、9,430 個 expert-written rubrics、三維評估（InfoRecall/Analysis/Presentation）、LLM judge 與 human 一致性 91.75%。同時梳理整體評估格局。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 8
---

上一篇講了評估的根本困境。這篇看最核心的基準：**DeepResearch Bench II**。

這是目前最全面的 deep research agent 評估框架——也是唯一能告訴我們「現在的 agent 到底差在哪裡」的標尺。

## DeepResearch Bench II 架構

### 核心設計

| 維度 | 規格 |
|---|---|
| 任務數 | **132 個** |
| 領域 | **22 個**真實世界領域 |
| Rubric 數 | **9,430 個** fine-grained binary criteria |
| 評審方式 | LLM judge（Gemini 2.5-Pro）+ 人類驗證 |
| 評估維度 | 三維：InfoRecall、Analysis、Presentation |

### 三維評估

| 維度 | 什麼在測 | 權重 |
|---|---|---|
| **InfoRecall** | 資訊檢索是否準確且全面 | ~52.9 criteria/task |
| **Analysis** | 能否從證據中提煉出新洞察 | ~12.8 criteria/task |
| **Presentation** | 報告是否可信、易讀 | ~5.7 criteria/task |

每個 rubric 是二元的（pass/fail），由 domain expert 書寫，覆蓋報告的每個細節。

### 評審方法論

DeepResearch Bench II 的關鍵創新是**用 LLM 評審但確保與人類一致**：

- 每批 50 個 rubric 給 LLM judge 評分
- 與人類 annotator 的 agreement：
  - **準確率 91.75%**
  - **F1 89.57%**
- 實驗規模：50 個 rubrics 一批

### 與 DeepResearch Bench I 的差異

| | Bench I | Bench II |
|---|---|---|
| 任務數 | 100 | **132** |
| Rubric | 較粗 | **9,430 個細粒度** |
| 評估 | RACE + FACT | **三維 rubric-based** |
| 重點 | 報告品質 | **全面診斷** |

## 基準結果：誰領先？

| Agent | 總分 | InfoRecall | Analysis | Presentation |
|---|---|---|---|---|
| NVIDIA AI-Q | 54.50 | — | — | — |
| Xiaoyi DeepResearch 6.0 | 53.05 | 69.90 | 91.12 | 58.72 |
| Hermes Ultra | 50.83 | 61.12 | 92.56 | 55.64 |
| WebWeaver | ~50.58* | — | — | — |
| OpenAI Deep Research | ~46.45* | — | — | — |

> *在 Bench I 上的分數，Bench II 結果可能不同。

關鍵發現：**即使最強的模型也只滿足不到 50% 的 rubrics。** 這意味著現有的 deep research agents 距離人類專家水平還有巨大差距。

## 整體評估格局

Deep research 的評估生態已經形成幾個層次：

### 第一層：報告品質評估

| 基準 | 方法 | 重點 |
|---|---|---|
| DeepResearch Bench I | RACE + FACT | 報告品質 + 引文 |
| DeepResearch Bench II | 三維 rubric | 全面診斷 |
| DeepResearchGym | 自定義 | 1,000 複雜查詢 |

### 第二層：資訊檢索評估

| 基準 | 方法 | 重點 |
|---|---|---|
| FACT Framework | Effective Citations + Citation Accuracy | 檢索效率與準確度 |
| BrowseComp | 多步瀏覽 | 網頁導航能力 |
| WebWalkerQA | 網站遍歷 | 網頁結構理解 |

### 第三層：特定領域評估

| 基準 | 領域 |
|---|---|
| FRAMES | 金融推理 |
| FinSearchComp | 金融搜尋 |
| GAIA | 通用推理 |
| HLE | 學術推理 |

### 評估方法的演進

```
LLM judge (早期) → 人類 rubric (Bench II) → STC 自信度 → 組合式評估 (未來)
```

每個階段都在解決前一個的問題：
- LLM judge 便宜但有偏 → 人類 rubric 準確但貴
- 人類 rubric 全面但慢 → STC 試圖自動化且對齊現實
- STC 還不完美 → 未來是組合式

## 關鍵數字

| 指標 | 數字 | 含義 |
|---|---|---|
| 最強 agent 的 rubric pass rate | <50% | 距離專家還有巨大差距 |
| LLM-judge 與人類一致性 | 91.75% | 可信但不是完美 |
| Rubric 數量 | 9,430 | 覆蓋極細 |
| 任務數量 | 132 | 22 個領域 |
| 每 task 的 criteria 數 | ~71 | 非常細粒度 |

## 對研究者的意義

1. **基準是地圖不是終點**——Bench II 告訴你「在哪裡」，但不告訴你「怎麼到達」
2. **InfoRecall vs Analysis 的差距**——檢索最容易，綜合最難
3. **Presentation 是被低估的維度**——報告的可信度和易讀性同樣重要

## 參考資料

- [DeepResearch Bench II: Diagnosing Deep Research Agents via Rubrics from Expert Reports](https://arxiv.org/abs/2601.08536) — 核心論文，Li et al., 2026。
- [DeepResearch Bench](https://deepresearch-bench.github.io) — Bench I 官方網站。
- [How NVIDIA AI-Q Reached #1 on DeepResearch Bench](https://huggingface.co/blog/nvidia/how-nvidia-won-deepresearch-bench) — NVIDIA AI-Q 的評估分析。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
