---
title: "Apodex：Reasoning-First 的長程研究與預測模型"
date: 2026-10-10
category: tech
type: deep-dive
tags: [apodex, reasoning, research-agent, long-horizon, moe, verifiable-ai]
lang: zh-TW
tldr: "Apodex 由 Apodex 團隊訓練，是一個 reasoning-first 的 Mixture-of-Experts 模型，專為複雜長程研究、預測與可驗證任務設計。搭配代理執行環境，可用工具處理檔案、資料與程式碼；原始模型 API 僅接收文字。"
description: "介紹 Apodex 模型架構、長上下文、function calling，以及原始模型 API 與研究代理服務的差異。"
draft: false
series:
  name: "AI 模型家族"
  order: 26
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-apodex-en)

[Apodex](https://apodex.ai/) 是由 **Apodex** 團隊開發的 reasoning-first 模型家族。官方模型卡將它定位為適合 **長程研究、預測與可驗證推理**——官方以可驗證產出定位其研究代理服務；能否重現結果，仍取決於工具、資料與執行紀錄。

目前對外開放的代表模型為 **Apodex 1.1 Mini**（`apodex/apodex-1.1-mini:free`），採 Mixture-of-Experts 架構，context window 262K tokens，在 OpenRouter 以免費模型形式提供。

---

## 先分清楚模型與研究代理服務

官方模型卡把 Apodex 定位為 reasoning-first，也提供原生 function calling 的使用方式。AgentOS、非同步 Agent Team 與交付前的 Statement Review 則是代理系統的組成，不會因為呼叫一次模型就全部出現。

官方 core-model API 文件明確區分兩者：`apodex-1.1` 與 `apodex-1.1-mini` 接收文字，伺服器端不執行規劃迴圈、搜尋或工具。Deep Research 服務才提供網頁搜尋、URL 抓取、程式沙箱與 MCP servers。選型時先決定需要哪一層產品，再挑模型。

## 架構與關鍵規格

| 項目 | 規格 |
|------|------|
| **架構** | Mixture-of-Experts (MoE) |
| **Context Window** | 262,144 tokens |
| **參數量** | 請以官方模型設定與權重倉庫為準 |
| **訓練組織** | **Apodex** |
| **授權/存取** | OpenRouter 免費模型（`:free` 後綴），亦可透過 Apodex 官方平台存取 |
| **輸入模態** | 文字（含程式碼與轉成文字的資料；core API 不接受檔案內容部件） |
| **輸出模態** | 文字、推理內容、工具呼叫請求；附件由執行環境產生 |

> ⚠️ 模型與官方代理服務是不同層次。AgentOS 與 Agent Team 提供執行流程；直接使用模型 API 時，仍需提供工具定義與執行工具的主程式。Mini 也可以在本地部署。

---

## 如何組成研究工作流

模型卡提供的 host loop 是：在 `tools` 傳入 schema，執行模型提出的請求，把結果以 `role="tool"` 放回對話，再繼續到模型不再要求工具。應用程式還要管理狀態、紀錄與權限。

例如資料分析應用可以提供 CSV 讀取器、Python 沙箱與報告寫入工具。這是建議的應用設計，不是本文已驗證的 Apodex 內建連接器清單。檔案格式、資料庫存取、網路權限與持續運作的 kernel 都取決於執行環境。

託管 Agent Team 描述了任務拆解、平行子代理與交付審查。若自行重建這類流程，要保留完成的工作與中間證據，並獨立核對計算和引用。模型寫出的推理文字，不能代替實際執行紀錄。

## 適用場景

以下是可評估的應用方向，不代表本文已驗證每類任務的正確率。

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
- 免費端點有額度與限流；使用前確認 OpenRouter 帳號政策。
- 適用原型開發、個人研究、低頻批次任務

### Apodex 官方平台
- 官方代理服務提供 AgentOS 與 Agent Team 工作流。

### 本地/私有部署
- 官方提供 **Apodex-1.1-mini 開放權重**，模型卡列出 SGLang 與 vLLM 本地部署指令，授權為 Apache 2.0
- 企業定價與私有部署選項須向 Apodex 確認。

---

## 可以先驗證的工作流

先拿可重現的資料分析任務測試，別一開始就交給它無限範圍的金融預測。提供公開 CSV、欄位說明與一個問題，例如：「比較兩年的月營收，標出缺漏月份，附上分析腳本。」執行環境提供唯讀檔案工具與沙箱，再用獨立計算核對產出。

這是應用設計範例，不是本文實測的成效。保留輸入資料快照、工具紀錄、腳本與最終數字；說明聽起來合理，還不足以證明任務成功。

## 限制與取捨

長上下文可以容納更多材料，不能保證模型找對資訊或算對結果。工具存取、狀態保存、並行工作與附件交付都要由執行環境管理。Mini 是否適合你的任務，要拿自己的資料測試；目前來源不足以支持「一般聊天一定較差」或「複雜任務一定需要完整版」的比較結論。

模型卡提供 SGLang 與 vLLM 本地部署方式，並列出 Apache 2.0 授權。本地部署仍需足夠記憶體，以及相符的推理與工具解析器。免費託管端點適合實驗；正式使用前確認供應商可用性、帳號配額與資料保留條款。

## 更新紀錄

- 2026-10-11：上線前核對模型與 API 文件，區分原始模型與研究代理服務，移除未證實的 IDE、私有部署與比較效能宣稱。

## 參考資料

- [Apodex-1.1-mini 官方模型卡與本地部署](https://huggingface.co/apodex/Apodex-1.1-mini)

- [Apodex 官網](https://apodex.ai/)
- [Apodex on OpenRouter](https://openrouter.ai/apodex/apodex-1.1-mini:free)
- [Apodex core-model API 文件](https://platform.apodex.ai/docs/models)
- [Apodex 模型設定](https://huggingface.co/apodex/Apodex-1.1-mini/raw/main/config.json)

---

## 同系列文章

- [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere)
- [North Mini Code](/posts/tech/2026-10-10-ai-model-family-cohere-north)

---

*最後更新：2026-10-11。模型規格、免費額度與存取方式會隨平台政策變動，請以官方文件為準。*
