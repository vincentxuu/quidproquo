---
title: "Apodex：Reasoning-First 的長程研究與預測模型"
date: 2026-10-10
category: tech
type: deep-dive
tags: [apodex, reasoning, research-agent, long-horizon, moe, verifiable-ai]
lang: zh-TW
tldr: "Apodex 由 Apodex 團隊訓練，是一個 reasoning-first 的 Mixture-of-Experts 模型，專為複雜長程研究、預測與可驗證任務設計。可直接處理檔案、資料、程式碼與工具，產出可驗證結果。"
description: "深入介紹 Apodex 模型家族架構、訓練哲學、核心能力（檔案/資料/程式碼/工具原生支援）、適用場景與部署方式。"
draft: true
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-apodex-en)

[Apodex](https://apodex.ai/) 是由 **Apodex** 團隊開發的 reasoning-first 模型家族。不同於一般以聊天或指令遵循為主的模型，Apodex 從架構與訓練目標就鎖定 **長程研究、預測與可驗證推理**——它不只是「給答案」，而是「給可被檢驗、可被重現的推理過程與工具鏈」。

目前對外開放的代表模型為 **Apodex 1.1 Mini**（`apodex/apodex-1.1-mini:free`），採 Mixture-of-Experts 架構，context window 262K tokens，在 OpenRouter 以免費模型形式提供。

---

## 核心定位：Reasoning-First，而非 Chat-First

| 維度 | 一般指令調整模型 | Apodex |
|------|-----------------|--------|
| **訓練目標** | 對話品質、指令遵循、安全對齊 | **可驗證推理**、長程規劃、工具鏈編排 |
| **輸出形式** | 自然語言回覆 | 結構化推理軌跡 + 可執行工具調用 + 可驗證產出物 |
| **錯誤處理** | 道歉、重試 | 顯式回溯、假設檢驗、工具輸出交叉驗證 |
| **適用任務** | 問答、寫作、編碼輔助 | **研究報告、預測建模、資料分析管線、複雜多步驗證** |

本文對 Apodex 設計的解讀：**「推理過程本身就是可審計的產出物」**。每一步推理都對應可觀察的工具調用（檔案讀寫、程式執行、資料查詢、API 呼叫），最終產出可被人類或自動化系統驗證的證據鏈。

---

## 架構與關鍵規格

| 項目 | 規格 |
|------|------|
| **架構** | Mixture-of-Experts (MoE) |
| **Context Window** | 262,144 tokens |
| **參數量** | 請以官方模型設定與權重倉庫為準 |
| **訓練組織** | **Apodex** |
| **授權/存取** | OpenRouter 免費模型（`:free` 後綴），亦可透過 Apodex 官方平台存取 |
| **輸入模態** | Text、Code、Data files（CSV、JSON、Parquet 等） |
| **輸出模態** | Text、Structured reasoning trace、Executable artifacts |

> ⚠️ 模型與官方代理服務是不同層次。AgentOS 與 Agent Team 提供執行流程；直接使用模型 API 時，仍需提供工具定義與執行工具的主程式。Mini 也可以在本地部署。

---

## 核心能力

模型產生文字與工具呼叫請求；主程式須提供工具、執行請求、回傳結果，並管理狀態、稽核紀錄與並行工作。以下工作流描述的是圍繞模型建立的應用，單次聊天請求不會自行執行完整流程。

以下工作流需要代理執行環境提供檔案、資料庫與程式執行工具；單純呼叫 OpenRouter chat API 不會內建這些工具。連接器、程式語言與持久狀態支援取決於實際設定，官方模型卡未證實下列完整清單。

### 1. 原生檔案與資料處理
- 直接讀寫本地/遠端檔案（CSV、JSON、Parquet、SQLite、Excel）
- 由執行環境提供 Pandas 資料框操作工具
- 資料庫存取需由執行環境設定工具或連接器。

### 2. 程式碼即推理載體
- 不只是「生成程式碼」，而是 **在推理過程中執行程式碼** 並將輸出納入下一步推理
- 程式執行需由主程式提供沙箱。
- 跨輪狀態保存取決於代理執行環境。

### 3. 工具鏈編排與驗證
- 可串接外部 API（搜尋、金融資料、科學文獻、天氣等）
- 應用可建立「假設 → 驗證 → 修正」迴路：模型主動提出假設、設計實驗/查詢、根據結果更新信念
- 主程式須記錄工具呼叫與中間結果，才能形成完整稽核軌跡

### 4. 長程研究工作流
- 支援「研究計畫 → 分解子任務 → 平行執行 → 綜合報告」的多階段流程
- 262K context 可容納大量文獻、資料樣本與中間推理
- 可輸出結構化研究報告（Markdown + 附件 + 可重現腳本）

---

## 適用場景

| 場景 | 說明 |
|------|------|
| **學術/產業研究** | 文獻綜述、假設生成、實驗設計、資料分析、報告撰寫全流程 |
| **金融/經濟預測** | 多源資料融合、模型回測、情境模擬、風險因子歸因 |
| **科學計算與建模** | 微分方程求解、參數估計、不確定性量化、結果可視化 |
| **複雜資料管線審計** | ETL 流程驗證、資料品質檢查、血統追蹤、合規報告 |
| **Agentic 系統核心** | 作為「規劃+驗證」核心，指揮下游執行型模型 |

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
    model="apodex/apodex-1.1-mini:free",
    messages=[{"role": "user", "content": "..."}]
)
```
- 免費額度受 OpenRouter `:free` 政策限制（20 RPM，日配額視儲值情況 50–1000 RPD）
- 適用原型開發、個人研究、低頻批次任務

### Apodex 官方平台
- 官方代理服務提供 AgentOS 與 Agent Team 工作流。
- 內建專用 IDE、版本化研究專案、協作與審計功能
- 企業定價與私有部署選項須向 Apodex 確認。

### 本地/私有部署
- 官方提供 **Apodex-1.1-mini 開放權重**，模型卡列出 SGLang 與 vLLM 本地部署指令，授權為 Apache 2.0
- 企業定價與私有部署選項須向 Apodex 確認。

---

## 典型使用範例

```python
# 研究任務：分析某產業過去 10 年營收與宏觀指標相關性
task = """
使用 World Bank API 取得 2014-2024 年全球 GDP 成長率、
美國 10 年期公債殖利率、原油價格。
再從 SEC EDGAR 抓取標普 500 能源類股過去 10 年財報營收。
執行滾動視窗相關性分析（窗口 24 月），輸出：
1. 統計顯著的領先/滯後指標
2. 含程式碼的可重現 Jupyter notebook
3. 結論與不確定性區間
"""
```

Apodex 會：
1. 規劃資料來源與抓取順序
2. 撰寫並執行抓取腳本（處理分頁、限流、錯誤重試）
3. 執行統計分析（Pandas/Statsmodels），產生圖表
4. 撰寫報告，附上完整可執行 notebook 與原始資料快照

---

## 限制與注意事項

| 限制 | 說明 |
|------|------|
| **非通用聊天模型** | 閒聊、創意寫作、一般編碼輔助非強項；建議搭配 Claude/GPT 使用 |
| **Mini 版能力上限** | 複雜多步驗證任務可能需要完整版；Mini 適合單一研究問題或子任務 |
| **工具執行環境隔離** | 沙箱無網路存取時需依賴預載資料或外部 API 金鑰配置 |
| **免費額度波動** | OpenRouter `:free` 端點排隊久、偶發 503；生產建議用官方付費方案 |
| **隱私** | OpenRouter 免費端點預設可能收集 prompt；敏感資料請走官方平台或啟用 ZDR |

---

## 參考資料

- [Apodex-1.1-mini 官方模型卡與本地部署](https://huggingface.co/apodex/Apodex-1.1-mini)

- [Apodex 官網](https://apodex.ai/)
- [Apodex on OpenRouter](https://openrouter.ai/apodex/apodex-1.1-mini:free)
- [OpenRouter Apodex 文件](https://openrouter.ai/docs/models/apodex/apodex-1.1-mini)
- [Apodex 研究案例集](https://apodex.ai/case-studies) （官網）

---

## 同系列文章

- [OpenRouter：統一 API 與多供應商路由](/posts/ai/2026-08-22-openrouter-model-routing)
- [OpenCode 與 Zen Gateway 介紹](/posts/ai/2026-04-02-agent-cli-opencode)
- [LLM 推論服務免費額度比較（2026-05 版）](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)

---

*最後更新：2026-10-10。模型規格、免費額度與存取方式會隨平台政策變動，請以官方文件為準。*
