---
title: "LongCat 系列：美團開源 Agentic Coding 模型家族"
date: 2026-10-10
category: tech
type: deep-dive
tags: [meituan, longcat, moe, open-weight, agentic-coding, sparse-attention]
lang: zh-TW
tldr: "LongCat 是美團（Meituan）開發的開源 LLM 模型家族。最新版 LongCat-2.0（2026-06-30 發布）擁有 1.6T 總參數、約 48B 活躍參數、1M 上下文，採用 LongCat Sparse Attention 與 N-gram Embedding 架構，專為長上下文推理、agentic coding、repo-level 理解設計，以 MIT 授權開源。"
description: "深入介紹 LongCat 模型家族的架構演進（Flash → 2.0）、LongCat Sparse Attention、N-gram Embedding 模組、與主流 agent harness 的整合、效能基準、以及與同量級模型的比較。"
draft: true
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-longcat-en)

[美團（Meituan）](https://www.meituan.com/) 的 **LongCat** 系列是目前最受注目的開源模型家族之一。從 **LongCat-Flash（560B）** 到 **LongCat-2.0（1.6T）**，LongCat 專為長上下文推理、agentic coding、repo-level 理解與自動化任務執行而設計。LongCat-2.0 在 2026-06-30 以 MIT 授權發布，此前曾以 "**Owl Alpha**" 代號在 OpenRouter 上安靜測試，使用率一度登上排行榜頂端。

---

## 系列概述

| 版本 | 總參數 | 活躍參數 | 上下文 | 核心定位 | 發布日期 |
|---|---|---|---|---|---|
| **LongCat-Flash** | 560B | ~27B（18.6B–31.3B） | 128K | 高效 agentic coding | 2025 |
| **LongCat-2.0** | 1.6T | ~48B（33B–56B） | 1M（native） | 長上下文推理 + agentic coding | 2026-06-30 |

> ⚠️ LongCat-2.0 的 1M 上下文是 **native** 訓練得來，不是靠外插法（extrapolation）達成。訓練資料包含 30T+ tokens，其中數百億 tokens 為 1M token 上下文長度。

---

## 架構演進：從 Flash 到 2.0

LongCat-2.0 在 LongCat-Base 的基礎上做了三項正交（orthogonal）的架構改進，每個模組可獨立啟用或關閉：

### 1. LongCat Sparse Attention（LSA）

LSA 是 DeepSeek Sparse Attention 的進化版，目標是讓 1M 上下文的訓練與推論在硬體上可行：

- 透過 **更輕量的 indexer** 加速長上下文處理，同時不犧牲模型品質
- 解決 fine-grained sparse mechanism 的二次方評分成本與記憶體碎片問題
- 與 LongCat-Flash 使用的 Multi-head Latent Attention（MLA）不同，LSA 是專門為極長上下文設計的稀疏注意力機制

### 2. N-gram Embedding 模組

- 在 MoE expert layout 完全正交的維度上擴展 embedding space
- 透過 5-gram token 組合框架，增加約 **135B 參數**
- 將 embedding space 擴展約 **100 倍**，提升模型對長上下文與 rare token 的表達能力

### 3. 動態 token-level compute allocation

- MoE layout 專為 **coding、推理、互動任務** 設計，而非通用聊天機器人
- 每個 token 可動態分配不同的計算量，提升參數效率

---

## 核心能力

模型產生文字與工具呼叫請求；主程式須提供工具、執行請求、回傳結果，並管理狀態、稽核紀錄與並行工作。以下工作流描述的是圍繞模型建立的應用，單次聊天請求不會自行執行完整流程。

| 能力 | 說明 |
|---|---|
| **Agentic Coding** | 深度整合 Claude Code、OpenClaw、Hermes 等主流 agent harness，在程式碼理解、repo-level edits、自動化任務執行、agentic workflows 上表現出色 |
| **長上下文推理** | 1M native 上下文，適合處理整個程式碼庫、長篇研究報告、法律文件 |
| **Repo-level 理解** | 跨檔案依賴分析、大型程式碼庫結構理解 |
| **工具調用** | 支援 `tools` 與 `tool_choice` function calling；但不支援 `response_format`（JSON 輸出不被強制） |
| **多語言** | 中英文程式碼與自然語言處理 |

---

## 效能基準

LongCat-2.0 在 Agentic Coding 與 General Agent 基準上的表現：

| Benchmark | LongCat-2.0 | Gemini 3.1 Pro | GPT-5.5 | Claude Opus 4.6 | Claude Opus 4.8 |
|---|---|---|---|---|---|
| **Terminal-Bench 2.1** | 70.8 | 70.7 | 73.8 | — | 78.9 |
| **SWE-bench Pro** | 59.5 | 54.2 | 58.6 | 57.3 | 69.2 |
| **SWE-bench Multilingual** | 77.3 | 76.9 | — | 77.8 | 84.8 |
| **FORTE** | 73.2 | 70.3 | 77.8 | 73.2 | 77.2 |
| **BrowseComp** | 79.9 | 85.9 | 84.4 | 84.0 | 84.3 |

其他基準：IFEval 90.0、GPQA-diamond 88.9、RWSearch 78.8。

> 💡 LongCat-2.0 的 SWE-bench Multilingual 分數為 77.3，高於 Gemini 3.1 Pro（76.9），低於 Claude Opus 4.6（77.8）；來源未列出可比較的 GPT-5.5 分數。LongCat 分數由美團自行評測，這些編碼項目的對照模型分數則引用各模型官方報告。

---

## 訓練硬體：國產晶片集群

LongCat-2.0 的預訓練與大規模部署皆在 **5 萬張國產 AI ASIC superpod** 集群上完成：

- 這是目前已知最大規模、完全使用中國國產晶片訓練的 LLM
- 訓練穩定性是關鍵挑戰：如何讓大規模集群穩定完成預訓練，而非單純啟動單一大型 run
- LongCat-Flash 的推論則使用 H800 GPU

---

## 授權與存取

| 項目 | 說明 |
|---|---|
| **授權** | MIT（須遵守授權條款） |
| **OpenRouter** | `meituan/longcat-2.0`，$0.30/M input、$1.20/M output；Cache Read $0.006/M |
| **Hugging Face** | `meituan-longcat/LongCat-2.0`（FP8 / INT8 版本） |
| **API** | [longcat.chat](https://longcat.chat/) 提供 Token Pack  Flash Sale 方案 |
| **本地部署** | 需大量 GPU 叢集（1.6T MoE）；FP8/INT8 版本可降低硬體需求 |

> 💡 本次查詢時，OpenRouter 列出的價格為 input $0.30/M、output $1.20/M，cache read 則為 $0.006/M；供應商價格可能調整。

---

## 版本對照與選擇建議

| 需求 | 建議版本 | 原因 |
|---|---|---|
| 最強 agentic coding + 1M 上下文 | **LongCat-2.0** | 1.6T 總參數、LSA、N-gram Embedding、native 1M 上下文 |
| 高吞吐日常 coding | **LongCat-Flash** | 560B 更輕量、128K 上下文已足夠大多數場景 |
| 極限上下文（整本書/整個 repo） | **LongCat-2.0** | 1M native 訓練，非外插法 |

---

## 適用場景

| 場景 | 說明 |
|---|---|
| **Repo-level editing** | 在 1M 上下文內分析整個程式碼庫，進行跨檔案修改 |
| **Agentic coding agent** | 整合 Claude Code / OpenClaw / Hermes，執行多步驟開發任務 |
| **長文檔分析** | 處理完整研究報告、法律文件、技術規格 |
| **多語言程式碼** | 中英文程式碼理解與生成 |
| **自動化任務** | Tool calling + 多步推理 |

---

## 限制與注意

- **JSON 輸出不被強制**：不支援 `response_format`，需要 JSON 輸出時需在 prompt 格式上自行確保
- **本地部署門檻極高**：1.6T MoE 需大量 GPU 叢集；建議使用 OpenRouter 或 Hugging Face 託管版本
- **社群驗證中**：LongCat-2.0 發表不到半年，架構與效能聲明尚需社群在美團以外的環境驗證
- **晶片供應鏈風險**：高度依賴中國國產 AI 晶片，未來供應可能受政策影響

---

## 同系列文章

- [Cohere North：Cohere 首個 Agentic Coding 家族](/posts/tech/2026-10-10-ai-model-family-cohere-north)
- [NVIDIA Nemotron 系列](/posts/tech/2026-10-10-ai-model-family-nemotron)
- [Apodex：長時程研究模型](/posts/tech/2026-10-10-ai-model-family-apodex)
- [Liquid AI：緊湊推理模型](/posts/tech/2026-10-10-ai-model-family-liquid-ai)
- [Dots Studio Dots：開放權重 MoE 模型家族](/posts/tech/2026-10-10-ai-model-family-dots-studio)

---

## 參考資料

- [LongCat-2.0 官方介紹](https://longcat.chat/blog/longcat-2.0)
- [Hugging Face: meituan-longcat/LongCat-2.0](https://huggingface.co/meituan-longcat/LongCat-2.0)
- [OpenRouter: LongCat 2.0](https://openrouter.ai/meituan/longcat-2.0)
- [Reuters: China's Meituan says new AI model trained on domestic chips](https://www.reuters.com/world/china/chinas-meituan-says-new-ai-model-trained-domestic-chips-2026-06-30/)
- [Geopolitechs: LongCat-2.0 — China's Most Unexpected AI Model](https://www.geopolitechs.org/p/longcat-20-chinas-most-unexpected)
- [VentureBeat: Meituan open sources LongCat-2.0](https://venturebeat.com/technology/meituan-open-sources-longcat-2-0-the-1-6t-near-frontier-agentic-coding-model-thats-been-leading-openrouter-trained-entirely-on-chinese-chips)
- [MarkTechPost: Meituan Releases LongCat-2.0](https://www.marktechpost.com/2026/07/05/meituan-releases-longcat-2-0-a-1-6t-parameter-open-moe-model-with-native-1m-context-and-longcat-sparse-attention)

---

*最後更新：2026-10-10。LongCat-2.0 為新發表模型，規格與政策會隨版本更新；請以官方文件為準。*
