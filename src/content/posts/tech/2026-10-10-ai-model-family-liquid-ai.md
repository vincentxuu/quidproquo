---
title: "Liquid AI LFM：緊湊推理與長上下文的 Agent 工作流模型"
date: 2026-10-10
category: tech
type: deep-dive
tags: [liquid-ai, lfm, reasoning, agent-workflow, rag, long-context, compact-model]
lang: zh-TW
tldr: "Liquid AI 的 LFM 2.5 系列是一個緊湊的推理模型（2.6B 參數），專為 agent 工作流、資料提取、RAG 與長上下文處理優化。支援高達 65K tokens 的上下文，適合需要快速響應與低延遲的場景。"
description: "深入介紹 Liquid AI LFM 系列的架構、推理能力、長上下文處理、Agent 工作流設計原則，以及如何與現有系統整合部署。"
draft: true
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-liquid-ai-en)

[Liquid AI](https://liquid.ai/) 開發的 **LFM（Liquid Foundation Model）** 系列是專為高效推理、長上下文與 agent 工作流設計的緊湊模型。最新版本為 **LFM 2.5-2.6B**（`liquid/lfm-2.5-2.6b`，含 `:free` 變體），擁有 **65K tokens** 的上下文窗口，僅 **2.6B 參數**，在 OpenRouter 上以 `liquid/lfm-2.5-2.6b:free` 提供免費存取。

---

## 核心定位：緊湊、快速、長上下文

| 項目 | 規格 |
|---|---|
| **模型名稱** | LFM 2.5-2.6B |
| **參數量** | 2.6B |
| **上下文窗口** | 65,536 tokens |
| **架構** | 緊湊推理模型（Liquid AI 自研架構） |
| **訓練組織** | **Liquid AI** |
| **存取方式** | OpenRouter（`:free`）、Liquid AI 官方平台 |
| **適用場景** | Agent 工作流、RAG、資料提取、批次處理、長文檔分析 |

> ⚠️ Liquid AI 官方建議 **避免將 LFM 用於 agentic coding（自動化編碼任務）**。該模型在複雜多步編碼任務上的表現不如專為編碼優化的模型（如 Poolside Laguna、Cohere North Mini Code）。

---

## 訓練與設計哲學

本文將 Liquid AI 的模型定位理解為 **「小模型、大效能」**——透過高效的模型架構與訓練策略，讓數十億參數的模型達到接近百億級模型的推理品質，同時保持低延遲與低成本。

LFM 系列的訓練重點：

- **推理效率優先**：模型在設計階段就優化了推理路徑的計算複雜度，減少不必要的計算步驟
- **長上下文原生支援**：65K context window 並非後期擴展，而是訓練階段就納入長文檔、長對話、多輪工具交互的資料分布
- **Agent 工作流對齊**：訓練資料包含大量的多步工具調用、資料提取任務、RAG 檢索與綜合流程，讓模型對「工具 → 觀察 → 推理」的循環有原生理解

---

## 核心能力

模型產生文字與工具呼叫請求；主程式須提供工具、執行請求、回傳結果，並管理狀態、稽核紀錄與並行工作。以下工作流描述的是圍繞模型建立的應用，單次聊天請求不會自行執行完整流程。

### 1. Agent 工作流優化
- **多輪工具調用**：支援在單一對話中執行多步工具操作（讀取、查詢、計算、寫入），並在每一步後更新推理狀態
- **低延遲響應**：2.6B 參數使推理速度遠快於大型模型，適合需要快速回饋的互動式 agent
- **記憶與上下文管理**：65K 窗口可容納完整的對話歷史、檢索結果與中間推理軌跡，減少上下文截斷導致的錯誤

### 2. 資料提取與 RAG
- **結構化資料提取**：從非結構化文本（PDF、網頁、報告）提取結構化資訊（表格、欄位、關係）
- **長文檔 RAG**：可同時處理長篇文檔（書籍、研究報告、法律文件）與外部知識庫檢索，綜合生成準確回答
- **多語言支援**：支援英語為主，對中文、日文、歐洲語言有基本理解能力（非專門優化）

### 3. 批次處理與自動化
- **高吞吐量**：小參數量允許在單一 GPU 上運行多個並發實例，適合批量文檔處理、資料清洗、報告生成
- **可預測延遲**：實際延遲需依輸入長度與部署環境量測，便於在自動化管線中設定超時與重試策略

---

## 適用場景與不適用場景

### ✅ 推薦場景

| 場景 | 說明 |
|---|---|
| **互動式資料助理** | 使用者詢問長文檔或資料庫，模型快速檢索並綜合回答 |
| **自動化報告生成** | 從原始資料（CSV、API、文件）生成結構化分析報告 |
| **RAG 系統核心** | 作為檢索結果的綜合與推理引擎，處理長上下文檢索片段 |
| **輕量 Agent 代理** | 在資源受限環境（邊緣設備、低成本雲實例）運行的智慧代理 |
| **多步資料清洗管線** | 逐步讀取、驗證、轉換、輸出資料，並記錄每步操作 |

### ❌ 不推薦場景

| 場景 | 原因 |
|---|---|
| **複雜 agentic coding** | Liquid AI 官方明確建議不要用於自動化編碼；複雜多文件重構、測試生成、架構設計表現不佳 |
| **高精度數學推理** | 2.6B 參數在複雜數學證明、多步邏輯推導上不如大型推理模型（如 NVIDIA Nemotron Ultra、Thinking Machines Inkling） |
| **創意內容生成** | 非專為創意寫作、詩歌、小說設計，風格較為實用和直接 |
| **多模態任務** | 僅支援文本輸入，不支援圖像、音頻、影片直接處理 |

---

## 部署與存取方式

### OpenRouter（免費）
```python
import os
import openai
client = openai.OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1"
)
resp = client.chat.completions.create(
    model="liquid/lfm-2.5-2.6b:free",
    messages=[{"role": "user", "content": "..."}]
)
```
- 免費額度受 OpenRouter `:free` 政策限制
- 適合開發測試、低頻批次任務

### Liquid AI 官方平台
- 完整版 LFM 模型（含更大參數版本）、企業 API、私有部署選項
- 提供專用 SDK、長上下文優化接口、批量推理端點
- 定價採按 token 計費，詳見 [Liquid AI 官方文件](https://liquid.ai/)

### 本地部署
- Liquid AI 提供部分模型的開源權重下載（需確認授權），可透過 vLLM、SGLang 進行本地推理
- 記憶體需求須依部署框架、權重格式、上下文長度與並行需求規劃。

---

## 典型使用範例

```python
task = """
從提供的 CSV 檔案中提取過去 5 年的季度營收資料，
計算年增長率（YoY），並標記異常季度（增長率低於 -10% 或高於 +50%）。
輸出：1) 清理後的資料表，2) 異常標記與可能原因分析，3) 可重現的 Python 腳本。
"""
```

在主程式提供工具、執行模型的工具呼叫並回傳結果後，可建立以下工作流：
1. 讀取 CSV 並理解欄位結構
2. 透過主程式提供的 Pandas 工具執行資料清洗與計算
3. 標記異常並提出可能解釋（季節性、一次性事件、市場變化）
4. 生成可重現的分析腳本與結構化報告

---

## 限制與注意事項

| 限制 | 說明 |
|---|---|
| **非編碼專家** | 複雜多文件重構、大型專案架構設計表現有限；建議搭配專用編碼模型 |
| **非創意模型** | 風格實用直接，不適合詩歌、文學創作、品牌文案 |
| **參數規模限制** | 2.6B 在深度推理（數學證明、哲學論證）上不如大型模型 |
| **免費端點浮動** | OpenRouter `:free` 有排隊與可用性波動；生產環境建議使用付費 API |
| **隱私** | OpenRouter 免費端點預設可能收集 prompt；敏感資料使用官方平台或啟用 ZDR |

---

## 參考資料

- [Liquid AI 官方網站](https://liquid.ai/)
- [LFM on OpenRouter](https://openrouter.ai/liquid/lfm-2.5-2.6b:free)
- [OpenRouter LFM 文件](https://openrouter.ai/docs/models/liquid/lfm-2.5-2.6b)
- [Liquid AI 開源模型與 SDK](https://github.com/LiquidAI)

---

## 同系列文章

- [OpenRouter：統一 API 與多供應商路由](/posts/ai/2026-08-22-openrouter-model-routing)
- [OpenCode 與 Zen Gateway 介紹](/posts/ai/2026-04-02-agent-cli-opencode)
- [LLM 推論服務免費額度比較（2026-05 版）](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)
- [Apodex：長程研究與可驗證推理模型](/posts/tech/2026-10-10-ai-model-family-apodex)
- [Dots Studio：大上下文 MoE 模型](/posts/tech/2026-10-10-ai-model-family-dots-studio)

---

*最後更新：2026-10-10。模型規格、免費額度與存取方式會隨平台政策變動，請以官方文件為準。*
