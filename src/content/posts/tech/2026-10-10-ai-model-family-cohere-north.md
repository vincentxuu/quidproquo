---
title: "Cohere North：Cohere 首個 Agentic Coding 家族"
date: 2026-10-10
category: tech
type: deep-dive
tags: [cohere, north, agentic-coding, sparse-moe, programming]
lang: zh-TW
tldr: "Cohere 以 North 系列推出首個 agentic coding 模型，North Mini Code（30B total / 3B active sparse MoE），專為程式碼生成與自動化開發設計。提供 256K 上下文，並以 `north-mini-code:free` 形式在 OpenRouter 提供免費存取。"
description: "介紹 Cohere North 系列的設計哲學、架構特點、與原有 Command 系列的差異，以及如何使用免費版本進行編碼任務。"
draft: false
series:
  name: "AI 模型家族"
  order: 27
---

> 🌏 [English version](/posts/tech/2026-10-10-ai-model-family-cohere-north-en)

[Cohere](https://cohere.com/) 在 2026 年推出的 **North 系列**加入了專注 **Agentic Coding** 的模型產品線。**North Mini Code** 是該系列的首款公開模型：30B 總參數、3B 活躍參數的 sparse MoE，專為程式碼生成、測試、自動化開發設計。它在 OpenRouter 以 `cohere/north-mini-code:free` 提供免費存取，讓開發者能直接體驗 Cohere 的編碼代理能力。

---

## 背景：從 RAG 到 Agentic Coding

Command 與 Embed 提供企業語言與嵌入模型；North Mini Code 則專注 agentic coding。這是產品定位的差異，不能直接推論成 Cohere 放棄 RAG 或整個公司的策略轉向。Cohere 也有名為 North 的企業代理平台；平台與 North Mini Code 模型不能混為一談。

| Cohere 系列 | 主要定位 | 代表模型 |
|---|---|---|
| **Command / Embed** | RAG、嵌入、通用對話 | Command A、Embed |
| **North**（新） | Agentic Coding | **North Mini Code**（30B/3B sparse MoE） |

---

## North Mini Code：核心規格

| 項目 | 規格 |
|---|---|
| **模型名稱** | North Mini Code |
| **訓練組織** | **Cohere** |
| **架構** | Sparse Mixture-of-Experts |
| **參數** | 30B total / 3B active |
| **上下文** | 256,000 tokens |
| **授權/存取** | OpenRouter `:free`（`cohere/north-mini-code:free`） |
| **輸入模態** | Text（程式碼、自然語言指令、文件） |
| **輸出模態** | Code、推理說明、工具調用 |

---

## 架構與代理迴圈

官方模型卡描述 North Mini Code 是 decoder-only 的 sparse MoE Transformer，混合 sliding-window 與 global attention。後訓練先做 supervised fine-tuning，再針對 agentic coding 使用可驗證獎勵的強化學習。3B 活躍參數描述的是每個 token 的運算規模；部署時仍需容納完整權重，不能把它當成只要載入 3B 模型。

模型接收文字，產生文字、推理內容與工具呼叫請求。工具說明以 JSON schema 提供；應用程式負責執行工具、回傳結果。光收到模型回覆，不會自動跑測試、修改 repo 或操作終端機。

模型卡建議代理步驟之間保留模型產生的 thinking 內容。本地部署也要搭配正確的推理與工具解析器。照官方目前的部署範例設定，比假設任何 OpenAI-compatible server 都能正確解析更可靠。

## 存取方式與第一個請求

OpenRouter 目前列出 `cohere/north-mini-code:free`。Cohere 自家文件使用的 API model ID 是 `north-mini-code-1-0`，說明 trial 與 production keys 在碰到限流前可免費使用，正式部署則指向 Model Vault。權重以 Apache 2.0 提供；API 的帳號限制與資料條款和權重授權是不同事情。

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)
response = client.chat.completions.create(
    model="cohere/north-mini-code:free",
    messages=[{"role": "user", "content": "Write a Python palindrome checker and unit tests."}],
)
print(response.choices[0].message.content)
```

這個文字生成範例不會執行它寫出的測試。要評估代理能力，提供 repo 與沙箱，記錄實際 diff、測試輸出、工具往返次數與耗時。比較模型時使用同一個任務與執行環境。

## 適用場景

| 場景 | 說明 |
|---|---|
| **互動式編碼助手** | 開發者在 IDE 中即時獲得編碼建議、重構、測試生成 |
| **批次自動化開發** | 自動化生成測試、重構舊程式碼、更新文件 |
| **程式碼審查與安全** | 產生待人工與工具核對的漏洞、相依與品質候選問題 |
| **教育與學習** | 學習編程語言、理解既有程式碼庫結構 |

---

## 限制與取捨

編碼專長是產品定位，不足以證明它在聊天或數學一定輸給每個通用模型。安全審查與重構是否成功，仍要靠實際測試與人工檢查。長上下文也不保證模型理解每個相依關係。

免費端點有帳號限制，可用性會變。傳送私有程式碼前先確認供應商的資料保留條款；「免費」或「官方平台」本身都不是隱私保證。本地開放權重部署可控制執行環境，但仍需足夠硬體與相容解析器。

## 更新紀錄

- 2026-10-11：核對官方模型卡與 API 文件，補上權重授權和存取方式，移除未證實的市佔、公司策略與比較效能宣稱。

## 參考資料

- [Cohere 官方](https://cohere.com/)
- [Cohere North Mini Code on OpenRouter](https://openrouter.ai/cohere/north-mini-code:free)
- [North Mini Code 官方模型卡](https://huggingface.co/CohereLabs/North-Mini-Code-1.0)
- [Cohere North Mini Code 文件](https://docs.cohere.com/docs/north-mini-code-1.0)
- [North 企業代理平台](https://cohere.com/north)

---

## 同系列文章

- [Cohere](/posts/tech/2026-08-24-ai-model-family-cohere)
- [Apodex](/posts/tech/2026-10-10-ai-model-family-apodex)

---

*最後更新：2026-10-11。Cohere North 為新系列，規格與免費政策會隨版本更新；請以官方文件為準。*
