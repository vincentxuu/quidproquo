---
title: "多模態與視覺：WebWatcher 重新定義 deep research"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, multimodal, webwatcher, vision-language, neurips2025, browsecomp-vl]
lang: zh-TW
tldr: "所有的 deep research agent 都是『文字為主』的——但真實世界不只有文字。WebWatcher（NeurIPS 2025）是第一個將視覺推理整合進 deep research 的系統，用 OCR、圖像搜尋、代碼執行等工具處理圖表、截圖、視訊等多元資訊。"
description: "深入解析 WebWatcher：多模態 deep research agent，結合視覺-語言推理與多工具互動。提出 BrowseComp-VL 基準，發表於 NeurIPS 2025，被引用 102+ 次。揭示 deep research 從文字到多模態的範式轉移。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 10
---

前面幾篇看的都是文字為主的 deep research agent。但真實世界的研究不只是看文字——你會遇到：

- 論文中的**圖表**（柱狀圖、流程圖、架構圖）
- 網頁上的**截圖**（UI 設計、產品介面）
- **手寫筆記**或掃描文件
- 影片中的**視覺資訊**

**WebWatcher**（arXiv:2508.05748，NeurIPS 2025）是第一個把視覺推理正式整合進 deep research 的系統。

## 為什麼需要多模態

現有 deep research agent 的問題很簡單：**它們只看文字，但世界不只有文字。**

| 場景 | 問題 |
|---|---|
| 讀論文 | 圖表包含關鍵數據，但文字描述可能不完整 |
| 分析產品 | UI 設計、互動流程無法用文字完全描述 |
| 實地研究 | 手寫筆記、掃描文件需要 OCR |
| 影片分析 | 視訊內容無法被文字代理獲取 |

WebWatcher 的論文開宗明義：
> "Most research remains primarily text-centric, overlooking visual information in the real world."

## WebWatcher 架構

### 核心設計

| 組件 | 功能 |
|---|---|
| **視覺-語言推理** | 理解圖像、圖表、截圖的含義 |
| **多工具協調** | OCR、圖像搜尋、代碼執行、網頁導航 |
| **think–act–observe 循環** | 動態決策過程 |

### 訓練方法

1. **合成多模態軌跡**：高品質的視覺+文字合成數據做 cold-start
2. **多工具深度推理**：運用各種工具進行推理
3. **RL 強化泛化**：用強化學習提升跨場景適應能力

### 工具集

- 網頁圖像搜尋
- 文字搜尋
- 網頁導航
- 代碼解釋器
- **OCR**（光學字元識別）

### 新基準：BrowseComp-VL

WebWatcher 提出 BrowseComp-VL——一個需要**視覺和文字雙重推理**的基準：
- 不只是文字問答
- 需要從圖像中提取資訊並與文字結合
- 模擬真實世界的多模態研究場景

## 關鍵結果

WebWatcher 在四個挑戰性的 VQA（Visual Question Answering）基準上顯著超越：
- 封閉源系統（如 OpenAI 的视觉模型）
- RAG workflow
- 開源 agent

核心優勢：**模組化設計**——視覺推理、工具調用、決策循環明確分離，可以獨立優化。

## 與系列其他篇的關係

| 系列篇 | 連結 |
|---|---|
| order 0（全景分類） | 多模態是 Phase III（Full-stack AI Scientist）的自然延伸 |
| order 3（IterResearch/AREX） | 多模態 agent 也需要長時程記憶 |
| order 5（Tongyi DeepResearch） | Tongyi 的 Heavy 模式可以整合多模態推理 |
| order 11（開源工具全景） | 多模態工具是開源生態的新邊界 |

## 趨勢：從文字到全模態

```
文字 only（2024）→ 文字+圖像（WebWatcher, 2025）→ 全模態（未來）
```

WebWatcher 只是起點。未來的 deep research agent 需要：
- 理解表格、圖表、地圖、流程圖
- 處理影片、音訊、3D 模型
- 跨模態綜合（從一張圖和一段文字推導出結論）

## 關鍵教訓

1. **真實世界的信息是多模態的**——只會讀文字的 agent 是「殘疾」
2. **工具協調比單一模型能力更重要**——OCR、圖搜、代碼各司其職
3. **合成數據是關鍵**——沒有大量多模態 trajection，就沒有多模態 agent

## 參考資料

- [WebWatcher: Breaking New Frontier of Vision-Language Deep Research Agent](https://arxiv.org/abs/2508.05748) — Geng et al., NeurIPS 2025, 102+ citations.
- [BrowseComp-VL](https://arxiv.org/abs/2508.05748) — 多模態瀏覽基準。
- [Tongyi DeepResearch Technical Report](https://arxiv.org/abs/2510.24701) — 本系列 order 5，Tongyi 的 Heavy 模式。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
