---
title: "LongCat 系列：美團開源 Agentic Coding 模型家族"
date: 2026-10-10
category: tech
type: deep-dive
tags: [meituan, longcat, moe, open-weight, agentic-coding, sparse-attention]
lang: zh-TW
tldr: "LongCat-Flash 與 LongCat-2.0 是美團的開放權重 MoE 模型。本文依官方模型卡說明動態計算、LSA、長上下文與工具使用，並區分模型規格和託管端點限制。"
description: "LongCat 模型家族：Flash 與 2.0 的架構差異、MIT 權重授權、agent 分工、端點參數與部署取捨。"
draft: false
series:
  name: "AI 模型家族"
  order: 30
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-longcat-en)

美團的 **LongCat** 是開放權重語言模型家族。LongCat-Flash 用動態 MoE 分配每個 token 的計算量；LongCat-2.0 則把重點推向長上下文、程式碼理解與多步工具使用。選擇時，應把模型規格、託管端點限制與實際工作流分開看。

## 從 Flash 到 2.0

以下規格依[官方 Flash 模型卡](https://huggingface.co/meituan-longcat/LongCat-Flash-Chat)與[2.0 模型卡](https://huggingface.co/meituan-longcat/LongCat-2.0)整理，查核日期為 2026-10-11。

| 模型 | 總參數 | 每 token 活躍參數 | 官方上下文 | 重點 |
|---|---|---|---|---|
| LongCat-Flash-Chat | 560B | 平均約 27B，依輸入動態變動 | 128K | 非 thinking 聊天、程式碼與工具使用 |
| LongCat-2.0 | 1.6T | 約 48B | 1M | 長上下文、程式碼庫修改與 agent 工作流 |

「活躍參數較少」描述每個 token 需要的計算，不能直接拿來估算整份權重的儲存成本。部署 1.6T MoE，仍須考慮完整權重、專家配置、上下文快取與並行請求。

2.0 官方模型卡指出，訓練包含 1M 上下文資料。這支持它經過長上下文訓練，但不能推出它會完整記住整個程式碼庫，或處理任意長文都能保持相同準確率。

## 架構為什麼這樣設計

### Flash：把計算留給需要的 token

Flash 的動態計算機制使用 zero-computation experts，依上下文分配專家計算量；Shortcut-connected MoE 則增加計算與通訊重疊的空間。這是大型 MoE 的工程重點：節省計算後，跨裝置通訊仍可能成為瓶頸。

### 2.0：降低長上下文索引成本

LongCat Sparse Attention（LSA）針對稀疏注意力的索引成本與零碎記憶體存取，組合三個設計：

- **Streaming-aware Indexing**：結合連續存取與動態選取 token，改善記憶體讀取方式。
- **Cross-Layer Indexing**：相鄰層重用索引結果，減少重複索引。
- **Hierarchical Indexing**：先做區塊級粗篩，再從候選區塊選 token。

這三項是 **LSA 內部的改進**，不應把 LSA、N-gram Embedding 與動態 MoE 統稱為官方所說的三個可獨立開關模組。

2.0 也沿用 Flash-Lite 的 **N-gram Embedding**，在 MoE 以外的稀疏維度擴展參數。其角色是增加表示容量；它不是搜尋索引，也不會替主程式持久保存任務進度。

## 模型能力與 agent 的分工

官方模型卡列出 Claude Code、OpenClaw、Hermes 等 harness 的整合方向，以及程式碼理解、跨檔案修改與自動化任務。這是應用整合的定位，不能保證所有 harness 版本或所有專案都能直接使用。

模型產生文字與工具呼叫請求；主程式要提供工具、執行請求、回傳結果，並管理狀態、權限與稽核紀錄。需要它修改程式碼時，至少提供讀檔、修改檔案與測試工具，再用實際 repo 驗證。

一個可落地的試用順序是：先讓模型解釋跨檔案依賴，再要求修改一個小功能，最後檢查 diff、執行測試並記錄工具失敗。把整個 repo 塞進上下文，不能取代這些檢查。

## 怎麼讀效能報告

2.0 模型卡列出 Terminal-Bench、SWE-bench、BrowseComp 等結果。官方註明，未加星號的分數由美團內部評測，加星號的對照分數引用其他模型官方報告。這不是所有模型都由獨立第三方以同一設定重跑的排行榜。

選型時，應核對 harness、工具權限、推理預算與成功判定。對自己產品更有用的測量是：跨檔案修改能否通過測試、工具參數是否正確、失敗後能否恢復，以及完成任務的總成本。本文不把廠商表格推成「全面勝過」其他家族的結論。

## 授權、端點與範例

Flash 模型卡將權重與原始碼列為 MIT；2.0 模型卡將模型權重列為 MIT，並說明不授予美團商標或專利使用權。使用時仍要保留授權所要求的聲明，不能把 MIT 等同於沒有任何義務。

[OpenRouter 的 2.0 端點資料](https://openrouter.ai/api/v1/models/meituan/longcat-2.0/endpoints)在本次查核列出 `meituan/longcat-2.0` 與 `tools`、`tool_choice`，沒有列出 `response_format`。這描述當時端點支援的參數，不是所有部署方式永久相同的模型限制。價格請以呼叫當下的端點資料為準。

以下是對該路由的最小 HTTP 範例，需自行設定 API key；本文未進行付費推理呼叫：

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer ${OPENROUTER_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"model":"meituan/longcat-2.0","messages":[{"role":"user","content":"Explain the dependency between these two modules."}]}'
```

需要 JSON 時，要先確認供應商是否支援強制結構化輸出。只在 prompt 寫「請回 JSON」不足以保證格式；主程式仍須解析、驗證 schema 並處理錯誤。

## 部署與選擇

2.0 官方列出 GPU 與 NPU 部署路徑，GPU 指向 SGLang cookbook，NPU 指向 SGLang-FluentLLM。官方也表示其訓練與大規模部署使用 AI ASIC superpods；這不代表使用者只能用該硬體部署，也不應推成晶片供應鏈的市場結論。

| 需求 | 可先評估 | 驗證重點 |
|---|---|---|
| 已使用 Flash 的工具流程 | LongCat-Flash-Chat | 既有 chat template、工具解析與上下文是否足夠 |
| 長文件與跨檔案修改 | LongCat-2.0 | 長輸入下的檢索正確率、修改是否通過測試 |
| 自建服務 | 官方部署指引 | 完整權重、記憶體、並行與推論框架支援 |

LongCat 的取捨是以大型稀疏模型換取長上下文與 agent 能力；託管 API 可以降低自建門檻，但仍要驗證端點支援與任務成功率。值得先從一個可測試的工作流開始，再決定是否擴大使用。

## 同系列文章

- [NVIDIA Nemotron 系列](/posts/tech/2026-10-10-ai-model-family-nemotron)
- [Cohere North 模型家族](/posts/tech/2026-10-10-ai-model-family-cohere-north)
- [Apodex 模型家族](/posts/tech/2026-10-10-ai-model-family-apodex)
- [Liquid AI 模型家族](/posts/tech/2026-10-10-ai-model-family-liquid-ai)
- [Dots 模型家族](/posts/tech/2026-10-10-ai-model-family-dots-studio)

## 更新紀錄

- 2026-10-11：依官方模型卡與端點資料重寫架構、部署及能力邊界，移除未完成查證的日期、硬體數量與排行推論，完成草稿發布。

## 參考資料

- [LongCat-Flash-Chat 官方模型卡](https://huggingface.co/meituan-longcat/LongCat-Flash-Chat)
- [LongCat-2.0 官方模型卡與部署入口](https://huggingface.co/meituan-longcat/LongCat-2.0)
- [OpenRouter LongCat-2.0 端點資料](https://openrouter.ai/api/v1/models/meituan/longcat-2.0/endpoints)
- [LongCat 官方程式碼庫](https://github.com/meituan-longcat/LongCat-2.0)
