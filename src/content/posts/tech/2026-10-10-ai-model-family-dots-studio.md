---
title: "Dots Studio Dots：開放權重混合推理模型系列"
date: 2026-10-10
category: tech
type: deep-dive
tags: [dots-studio, dots3, moe, large-context, reasoning, open-weight]
lang: zh-TW
tldr: "Dots Studio Dots 是開放權重混合推理模型系列，最新版本 Dots 3（Dots3-Note Preview）提供 512K 上下文與 280B total / 16B active MoE 架構。專為長文檔、歷史資料與多步推理設計。"
description: "深入介紹 Dots Studio Dots 系列模型的架構、開源授權、混合推理能力、高上下文優勢，並以最新版本 Dots 3 的 Dots3-Note Preview 為代表說明應用場景與部署方式。"
draft: true
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-dots-studio-en)

[Dots Studio](https://dotstudio.ai/) 開發了 **Dots 3** 模型系列，其中 **Dots3-Note Preview** 是該系列中最輕量的一個開放權重 **混合推理 (MoE) 模型**，16B active parameters / 280B total parameters。Dots3-Note Preview 提供 **512K tokens 的上下文窗口**，非常適合需要大上下文卻受限於計算資源的場景（如長文檔摘要、多步推理、歷史文獻分析等）。

Dots3-Note Preview 以 **開放權重形式發布**；商用與研究用途須遵守實際授權條款，並支援與 OpenRouter 等平台進行免費存取，`dots-studio/dots-3-note-preview:free` 是該模型的免費版。

---

## 系列概述

| 項目 | 規格 |
|---|---|
| **模型名稱** | Dots3-Note Preview |
| **訓練組織** | **Dots Studio** |
| **架構** | Mixture-of-Experts (MoE) |
| **參數量** | 16B active / 280B total |
| **上下文窗口** | 512,000 tokens |
| **授權** | 開放權重；實際授權須查閱官方權重倉庫|
| **存取方式** | OpenRouter 免費版、官方平台、GitHub |
| **適用場景** | 長文檔處理、多步推理、歷史資料分析、複雜文獻綜述 |

> ⚠️ Dots 系列的 **Dots3-Note Preview** 是一款 **推理優先**的模型，專為長時間、大規模文檔處理與多步推理而設計。雖然上下文窗口龐大，但推理速度與多模態能力不如更加專一的模型（如 Gemma 4、Grok），更適合需要深度文檔理解與邏輯推理解決的任務。

---

## 架構與設計哲學

以下設計取捨是本文的架構解讀；未經驗證的效能優勢仍需實測。

**Dots 系列**的核心哲學：**「在有限計算資源下，通過混合專家發揮最大推理潛力」**。MoE 架構允許模型只激活與當前任務相關的 expert，在保持龐大參數量的同時，降低單次推理的計算負載，實現 **高效推理 + 大上下文支援** 的平衡。

**Dots 3（最新版本）**的代表模型 **Dots3-Note Preview** 特點：

- **超大上下文**：512K tokens 可一次處理完整的書籍、報告、長篇文章、甚至歷史資料集
- **語義對齊**：MoE expert 涵蓋語義理解、邏輯推理、跨領域知識整合
- **開源授權**：OpenRouter 列為開放權重模型；訓練資料公開範圍與商用條款仍須查閱官方資料
- **免費存取**：在 OpenRouter 上以免費版形式開放，降低使用門檻

---

## 核心能力

模型產生文字與工具呼叫請求；主程式須提供工具、執行請求、回傳結果，並管理狀態、稽核紀錄與並行工作。以下工作流描述的是圍繞模型建立的應用，單次聊天請求不會自行執行完整流程。

### 1. 長文檔理解與摘要
- **512K tokens** 上下文，可一次性讀取完整長篇文章（如學術論文、書籍章節、法庭證據）
- **深度文義理解**：支援句子級、段落級、章節級的多層語義對齊
- **結構化摘要**：可生成文獻概要、章節摘要、關鍵點提取等

### 2. 多步推理
- **邏輯推理**：支援複雜的條件邏輯推論、多步問題解決
- **工具調用**：可連結外部資料庫（SQL、文獻搜索），進行深度分析
- **跨領域知識整合**：將語言學、數學、領域專有名詞知識整合到推理過程

### 3. 大規模資料處理
- **批量文檔處理**：支援一次讀取多個大型文檔並進行批量分析
- **異構資料整合**：支援整合多個來源的結構化與非結構化資料
- **長序列處理**：支援需要長時間序列處理的任務（如歷史資料、時間序列分析）

---

## 適用場景

### ✅ 推薦

| 場景 | 說明 |
|---|---|
| **學術文獻綜述** | 一次性讀取多篇文章並生成綜合性學術論文 |
| **法律案件分析** | 分析大量法律文件，提取關鍵論點與證據鏈 |
| **歷史資料分析** | 處理歷史文獻，生成跨時期比較與趨勢分析 |
| **技術專利檢索** | 檢索大量專利文件，提取技術方案與創新點 |
| **大型報告生成** | 一次性讀取大量資料後生成結構化報告 |

### ❌ 不推薦

| 場景 | 原因 |
|---|---|
| **即時聊天助理** | 512K 上下文雖大，但推理延遲較長，適合即時互動；更多適合批次處理 |
| **多模態任務** | 目前僅支援文本輸入，不支援圖像、音頻、影片 |
| **簡單實用任務** | 小型上下文模型（如 LFM 2.5-2.6B、Gemma 4）在功能上更為充足，小型模型功能冗餘 |
| **高頻交易** | 推理速度不適合高頻互動場景 |

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
    model="dots-studio/dots-3-note-preview:free",
    messages=[{"role": "user", "content": "..."}]
)
```
- 免費額度受 OpenRouter `:free` 政策限制
- 適合原型開發、學術研究、低頻批次任務

### Dots Studio 官方平台
- 其他模型版本、企業 API 與 SLA 須向供應商確認。
- 提供配套的資料集、下載 pipelines、微調工具
- 平台定價與存取條件須向供應商確認

### 本地部署
- 下載權重前須確認官方發布位置與授權條款
| **硬體需求** | 須依總權重大小、量化格式與 KV cache 規劃；活躍參數量不代表只需載入那些權重。 |
- 可透過 vLLM、SGLang 等框架進行推理

### 注意事項
- Dots3-Note Preview 為 **推理優先**，若需要即時互動效果，可考慮更小型的上下文模型
- 512K 上下文需 careful memory management，避免 OOM
- 因授權為開源，支援客製化改進，但需要熟悉 MoE 架構的調試與優化

---

## 典型使用範例

```python
task = """
讀取已上傳的法律案件文本（PDF），提取被告名稱、案由、裁決結果、依據法條。
同時檢索類似案件庫（通過向量檢索），比對判決結果一致性。
輸出：1) 結構化案件資料，2) 類似案件比對報告，3) 可重現的 Python 腳本（Pandas + 開源函數庫）。
"""
```

Dots3-Note Preview 會：
1. 讀取 PDF 文件並提取文本（支援 OCR），識別案件結構
2. 執行法律術語命名體識別（找出被告名稱、案由、裁決）
3. 執行向量檢索，搜索類似案件資料
4. 進行判決一致性比較分析
5. 生成結構化報告與可重現的分析腳本

---

## 限制與注意事項

| 限制 | 說明 |
|---|---|
| **硬體需求** | 須依總權重大小、量化格式與 KV cache 規劃；活躍參數量不代表只需載入那些權重。 |
| **推理延遲較長** | MoE 雖然高效，但推理速度仍慢於小型上下文模型 |
| **非即時互動** | 更適合批次處理，而不是即時聊天 |
| **免費端點波動** | OpenRouter `:free` 有排隊與可用性波動；生產建議使用付費 API |
| **隱私** | OpenRouter 免費端點可能收集 prompt；敏感資料使用官方平台或啟用 ZDR |

---

## 參考資料

- [Dots Studio 官網](https://dotstudio.ai/)
- [Dots3-Note Preview on OpenRouter](https://openrouter.ai/dots-studio/dots-3-note-preview:free)
- [OpenRouter Dots3 文件](https://openrouter.ai/docs/models/dots-studio/dots-3-note-preview)
- [Dots3 GitHub](https://github.com/DotsStudio/Dots3)

---

## 同系列文章

- [OpenRouter：統一 API 與多供應商路由](/posts/ai/2026-08-22-openrouter-model-routing)
- [OpenCode 與 Zen Gateway 介紹](/posts/ai/2026-04-02-agent-cli-opencode)
- [LLM 推論服務免費額度比較（2026-05 版）](/posts/ai/2026-05-09-llm-inference-free-tier-comparison)
- [Apodex：長程研究模型](/posts/tech/2026-10-10-ai-model-family-apodex)
- [Liquid AI：緊湊推理模型](/posts/tech/2026-10-10-ai-model-family-liquid-ai)

---

*最後更新：2026-10-10。模型規格、授權、免費額度與存取方式會隨平台政策變動，請以官方文件為準。*
