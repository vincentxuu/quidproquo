---
title: "開源工具全景：GPT-Researcher、STORM、smolagents…"
date: 2026-09-19
category: ai
type: deep-dive
tags: [deep-research, open-source, GPT-Researcher, STORM, smolagents, comparison]
lang: zh-TW
tldr: "Deep research 的開源生態已經從『單一框架』演變成『工具叢集』。這篇比較 12+ 個專案：GPT-Researcher 重視多代理協作、STORM 模擬專家對話、smolagents 強調狀態管理。每個工具解決不同問題。"
description: "全面比較開源 deep research 工具生態：GPT-Researcher（多代理 + Deep Research 功能）、STORM（專家對話式大纲）、smolagents（狀態管理）、Local Deep Research（本地部署）、Feynman（本地優先）等，分析各自設計哲學和適用場景。"
draft: false
series:
  name: "Deep Research 前沿"
  order: 11
---

前面幾篇看的是學術論文。這篇看**開源世界的實作**。

Deep research 的開源生態已經從「單一框架」演變成「工具叢集」。每個專案解決不同的問題：

- **GPT-Researcher**：重視多代理協作和報告品質
- **STORM**：模擬專家對話來產生結構化大纲
- **smolagents**：強調狀態管理和工具協調
- **Local Deep Research**：完全本地部署
- **Feynman**：本地優先，可讀論文、審核主張

## 開源生態全景

### 按設計哲學分類

| 類別 | 代表專案 | 核心特色 |
|---|---|---|
| **多代理協作** | GPT-Researcher、AutoGen | 多 agent 各司其職 |
| **專家對話** | STORM | 模擬專家產生大纲 |
| **狀態管理** | smolagents | 工具狀態的結構化管理 |
| **本地優先** | Local Deep Research、Feynman | 完全離線運行 |
| **框架型** | LangChain-OpenDeepResearch | 組合式組件 |
| **端到端** | Tongyi DeepResearch | 完整 training pipeline |

### 詳細比較

#### GPT-Researcher

- GitHub：assafelovic/gpt-researcher
- 核心：自主 agent 研究網頁 + 本地文件，產出長報告帶引用
- 特色：
  - 智慧圖片擷取（從網頁抓取相關圖像）
  - 2000+ 字報告
  - 多代理模式（模擬 STORM）
  - **Deep Research 功能**：樹狀探索模式
  - MCP 支持
- 優勢：社群活躍、功能豐富、已達 DeepResearchGym 基準第一
- 適合：需要豐富報告和圖像的研究任務

#### STORM (Stanford)

- 核心：模擬專家對話來產生研究大纲
- 流程：先透過「模擬專家討論」產出大纲，再根據大纲檢索證據
- 特色：結構化長篇文章，接近維基百科品質
- 優勢：結構特別清晰、敘事連貫
- 適合：需要高度結構化的背景文章或概述報告

#### smolagents

- 核心：輕量級 agent 框架，強調**狀態管理**
- 特色：
  - 狀態即變數（不依賴 LLM 記憶）
  - 圖像/音訊可存為狀態後重用
  - 支援 MCP 工具
- 優勢：狀態追蹤可靠、適合多模態
- 適合：需要長時間運行、狀態複雜的任務

#### Local Deep Research

- 核心：完全本地部署，無外部 API 依賴
- 適合：隱私敏感場景、無網路環境
- 限制：模型能力和工具覆蓋受限

#### Feynman

- 核心：本地優先研究助手
- 能力：讀論文 + 搜網 + 草擬 + 運行 workflow + 引用主張
- 適合：學術研究、論文審閱、實驗複現

## 基準表現

根據 DeepResearchGym（CMU, May 2025）：

| 系統 | 引文品質 | 報告品質 | 覆蓋率 |
|---|---|---|---|
| **GPT-Researcher** | 85.36% | 83.70% | 64.67% |
| OpenAI Deep Research | — | — | — |
| Perplexity | — | — | — |

GPT-Researcher 在 DeepResearchGym 上**三項都排名第一**（>85% 引文精確率、>80% 報告清晰度、最高關鍵點召回率）。

## 設計哲學的取捨

| 設計選擇 | 取捨 |
|---|---|
| 多代理 vs 單代理 | 深度 vs 速度 |
| 在線 vs 本地 | 能力 vs 隱私 |
| 框架 vs 端到端 | 彈性 vs 簡潔 |
| 通用 vs 專用 | 廣度 vs 深度 |

## 趨勢觀察

1. **MCP 整合**：大多數專案開始支援 MCP（Model Context Protocol）
2. **樹狀探索**：從線性搜索到樹狀分支探索
3. **多模態**：從文字到圖像、表格、程式碼
4. **本地化**：隱私需求推動本地部署方案

## 參考資料

- [GPT-Researcher](https://github.com/assafelovic/gpt-researcher) — 多代理 deep research。
- [STORM](https://arxiv.org/abs/2410.01208) — Stanford，專家對話式大纲。
- [smolagents](https://github.com/huggingface/smolagents) — Hugging Face，狀態管理。
- [DeepResearchGym](https://arxiv.org/abs/2505.19253) — CMU 基準。
- [Tongyi DeepResearch](https://arxiv.org/abs/2510.24701) — 本系列 order 5，Tongyi Lab 完整系統。
- [deep-research-survey-overview](/posts/ai/2026-09-19-deep-research-survey-overview) — 本系列上篇文章：三階段全景分類。
