---
title: "Cohere North：從 Agentic Coding 的 North Mini Code 開始的專用模型線"
date: 2026-10-10
category: tech
type: deep-dive
tags: [cohere, north, agentic-coding, sparse-moe, programming]
lang: zh-TW
tldr: "North 是 Cohere 的專用模型線，目前有三款：agentic coding 的 North Mini Code（30B total / 3B active MoE、256K context、Apache 2.0），翻譯的 North Small Translate（218B／25B，CC BY-NC），以及 2.4B 的視覺語言模型 North Micro Vision（Apache 2.0，只有權重）。本篇主寫 Mini Code：Cohere API 的 `north-mini-code-1.0` 在碰到限流前免費，正式用量走 Model Vault；OpenRouter 上已經沒有它的端點。"
description: "介紹 Cohere North 模型線（North Mini Code、North Small Translate、North Micro Vision）的定位與授權差異，North Mini Code 的架構、Cohere API 與 Model Vault 存取方式，以及編碼代理的驗證方法。"
draft: false
series:
  name: "AI 模型家族"
  order: 27
---

> :globe: [English version](/posts/tech/2026-10-10-ai-model-family-cohere-north-en)

[Cohere](https://cohere.com/) 在 2026 年推出的 **North 系列**加入了專注 **Agentic Coding** 的模型產品線。**North Mini Code** 是該系列的首款公開模型：30B 總參數、3B 活躍參數的 sparse MoE，專為程式碼生成、測試、自動化開發設計。之後 North 又加了翻譯模型 North Small Translate 與小型視覺語言模型 North Micro Vision，成為一條「各做一件事」的專用模型線。Mini Code 目前透過 Cohere API（`north-mini-code-1.0`）在碰到限流前免費試用，也可以下載 Apache 2.0 權重自架。

## 家族定位與版本矩陣

| 模型／產品線 | 定位 | 關鍵差異 | 存取方式 |
|---|---|---|---|
| North Mini Code | Agentic coding | 30B total／3B active；256K context、64K 輸出 | Apache 2.0 權重；Cohere API `north-mini-code-1.0`；Model Vault |
| North Small Translate | 機器翻譯，50+ 語言 | 218B total／25B active；16K context | CC BY-NC 4.0 權重；Cohere API `north-small-translate-1.0`（免費層） |
| North Micro Vision | 小型視覺語言模型 | 2.4B（2B 語言模型＋400M 視覺編碼器）；不支援工具呼叫 | Apache 2.0 權重；Cohere API 模型清單沒有列 |
| Command／Embed | 企業語言、RAG 與嵌入 | 與編碼模型分工不同 | Cohere 模型產品 |
| North 平台 | 企業代理 | 平台不是 North Mini Code 模型 | Cohere 企業代理平台 |

### North Mini Code：核心規格

| 項目 | 規格 |
|---|---|
| **模型名稱** | North Mini Code |
| **訓練組織** | **Cohere** |
| **架構** | Sparse Mixture-of-Experts |
| **參數** | 30B total / 3B active |
| **上下文** | 256K tokens；最大輸出 64K tokens |
| **授權/存取** | Apache 2.0 權重；Cohere API `north-mini-code-1.0`（限流前免費），正式用量走 Model Vault |
| **輸入模態** | Text（程式碼、自然語言指令、文件） |
| **輸出模態** | Code、推理說明、工具調用 |

## 家族演化

### 背景：從 RAG 到 Agentic Coding

Command 與 Embed 提供企業語言與嵌入模型；North Mini Code 則專注 agentic coding。這是產品定位的差異，不能直接推論成 Cohere 放棄 RAG 或整個公司的策略轉向。Cohere 也有名為 North 的企業代理平台；平台與 North Mini Code 模型不能混為一談。

| Cohere 系列 | 主要定位 | 代表模型 |
|---|---|---|
| **Command / Embed** | RAG、嵌入、通用對話 | Command A、Embed |
| **North**（新） | 專用模型：coding、翻譯、小型視覺 | **North Mini Code**（30B/3B）、North Small Translate、North Micro Vision |

### North 模型線時間線

| 時間 | 型號 | 改變了什麼選型 |
|---|---|---|
| 2026-06 | North Mini Code 1.0 | Cohere 第一次有 coding 專用模型，而且是 Apache 2.0 可商用權重 |
| 2026-08-12 | North Micro Vision Instruct | 2.4B 視覺語言模型，定位是拿來微調的小底座，不是聊天助理 |
| 2026-09-10 | North Small Translate 1.0 | 翻譯獨立成專用模型；權重是 CC BY-NC，商用要走 API 或洽 Cohere |
| 2026-10-05 | North 2（平台） | 企業 agent 平台改版，不是新模型；跟 North 模型線同名，選型時別混 |

North Small Translate 的評測、硬體需求與授權細節寫在 [Cohere 家族主篇](/posts/tech/2026-08-24-ai-model-family-cohere)，這裡不重複。North Micro Vision 的模型卡寫明它不是推理模型、數學與程式能力有限、不支援工具呼叫與 agent 工作流，多模態訓練只驗證到 8K context；要拿它做文件 OCR、圖表理解這類窄任務，先準備自己的資料微調。

## 架構與訓練取捨

### 架構與代理迴圈

官方模型卡描述 North Mini Code 是 decoder-only 的 sparse MoE Transformer，混合 sliding-window 與 global attention。後訓練先做 supervised fine-tuning，再針對 agentic coding 使用可驗證獎勵的強化學習。3B 活躍參數描述的是每個 token 的運算規模；部署時仍需容納完整權重，不能把它當成只要載入 3B 模型。

模型接收文字，產生文字、推理內容與工具呼叫請求。工具說明以 JSON schema 提供；應用程式負責執行工具、回傳結果。光收到模型回覆，不會自動跑測試、修改 repo 或操作終端機。

模型卡建議代理步驟之間保留模型產生的 thinking 內容。本地部署也要搭配正確的推理與工具解析器。照官方目前的部署範例設定，比假設任何 OpenAI-compatible server 都能正確解析更可靠。

## 評測與競品比較

本篇沒有在同一評測條件下核對編碼代理的候選模型，不能據此排名。比較時需對齊模型版本、benchmark、harness、工具權限與推理預算，再用下列任務驗證方式評估自己的工作流。

延伸選型可參考 [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere)、[Apodex](/posts/tech/2026-10-10-ai-model-family-apodex)，並依任務與部署條件比較。

## 授權、價格與部署

### 存取方式與第一個請求

Cohere API 的 model ID 是 `north-mini-code-1.0`，可用 Chat V2、Chat V1 或 OpenAI 相容的 Chat Completions 端點呼叫。官方文件寫明 trial 與 production keys 在碰到限流前都免費；限流是 trial 每分鐘 20 次、production 每分鐘 500 次，trial key 另有每月 1,000 次呼叫上限。正式部署指向 Model Vault（Cohere 的獨佔式推論環境）。權重以 Apache 2.0 提供；API 的帳號限制與資料條款和權重授權是不同事情。

先前的 OpenRouter 路由 `cohere/north-mini-code` 與 `:free` 已經沒有可用端點，不要再拿它當入口。

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["COHERE_API_KEY"],
    base_url="https://api.cohere.ai/compatibility/v1",
)
response = client.chat.completions.create(
    model="north-mini-code-1.0",
    messages=[{"role": "user", "content": "Write a Python palindrome checker and unit tests."}],
)
print(response.choices[0].message.content)
```

這個文字生成範例不會執行它寫出的測試。要評估代理能力，提供 repo 與沙箱，記錄實際 diff、測試輸出、工具往返次數與耗時。比較模型時使用同一個任務與執行環境。

## Agent 使用與選型

### 適用場景

| 場景 | 說明 |
|---|---|
| **互動式編碼助手** | 開發者在 IDE 中即時獲得編碼建議、重構、測試生成 |
| **批次自動化開發** | 自動化生成測試、重構舊程式碼、更新文件 |
| **程式碼審查與安全** | 產生待人工與工具核對的漏洞、相依與品質候選問題 |
| **教育與學習** | 學習編程語言、理解既有程式碼庫結構 |

## 限制與取捨

編碼專長是產品定位，不足以證明它在聊天或數學一定輸給每個通用模型。安全審查與重構是否成功，仍要靠實際測試與人工檢查。長上下文也不保證模型理解每個相依關係。

Cohere API 的免費額度有限流與每月呼叫上限，政策可能調整。傳送私有程式碼前先確認供應商的資料保留條款；「免費」或「官方平台」本身都不是隱私保證。本地開放權重部署可控制執行環境，但仍需足夠硬體與相容解析器。

## 更新紀錄

- 2026-11-23：OpenRouter 上的 `cohere/north-mini-code` 與 `:free` 已沒有可用端點，tldr、開頭、矩陣、規格表與存取段改成 Cohere API（`north-mini-code-1.0`，限流前免費）與 Model Vault，程式範例改用 Cohere 的 OpenAI 相容端點，補上限流數字與 64K 最大輸出。修正 model ID：原寫 `north-mini-code-1-0`，官方為 `north-mini-code-1.0`。補上同一條 North 模型線的 North Small Translate（2026-09-10）與 North Micro Vision（2026-08-12），新增時間線並跟 North 2 平台區分；Small Translate 的細節留在 Cohere 家族主篇。
- 2026-10-11：依共同家族格式重排章節，使用既有資料補版本矩陣；事實核對日期沿用既有紀錄。
- 2026-10-11：核對官方模型卡與 API 文件，補上權重授權和存取方式，移除未證實的市佔、公司策略與比較效能宣稱。

*最後更新：2026-11-23。Cohere North 為新系列，規格與免費政策會隨版本更新；請以官方文件為準。*

## 參考資料

- [Cohere 官方](https://cohere.com/)
- [Cohere 模型總覽（North 系列 model ID 與狀態）](https://docs.cohere.com/docs/models)
- [Cohere API 限流](https://docs.cohere.com/docs/rate-limits)
- [Cohere OpenAI 相容 API](https://docs.cohere.com/docs/compatibility-api)
- [North Mini Code 官方模型卡](https://huggingface.co/CohereLabs/North-Mini-Code-1.0)
- [Cohere North Mini Code 文件](https://docs.cohere.com/docs/north-mini-code-1.0)
- [North 企業代理平台](https://cohere.com/north)
- [Introducing North Small Translate（2026-09-10，Cohere 部落格）](https://cohere.com/blog/north-small-translate)
- [North Small Translate 文件](https://docs.cohere.com/docs/north-small-translate-1.0)
- [North-Micro-Vision-Instruct 模型卡](https://huggingface.co/CohereLabs/North-Micro-Vision-Instruct)
- [Meet North Micro Vision（2026-08-12，Hugging Face 部落格）](https://huggingface.co/blog/CohereLabs/meet-north-micro-vision-instruct)
- [Cohere 家族主篇](/posts/tech/2026-08-24-ai-model-family-cohere) — 本站
