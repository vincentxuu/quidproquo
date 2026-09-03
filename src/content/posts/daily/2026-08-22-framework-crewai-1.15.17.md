---
title: "框架更新｜CrewAI 1.15.17"
date: 2026-08-22
category: daily
type: digest
tags: [ai-agent, framework, daily, crewai]
lang: zh-TW
description: "CrewAI 1.15.17 讓宣告式（YAML/JSON）Flow 定義也能直接驅動實驗性的 conversational Flow 對話模式，不必再手寫 Python 子類別"
tldr: "CrewAI 1.15.17 三個重點：(1) 宣告式 Flow 定義現在可以直接開啟 conversational 對話模式，框架自動合成內建對話方法，不必手寫 Python `Flow` 子類別；(2) 明確標示 conversational 是 opt-in 行為，降低誤用風險；(3) 修了透過 slug 參照解析工具遺失 AMP slug、以及分塊處理超大單一訊息的問題，本版無 breaking changes。"
series:
  name: "AI Framework Changelog"
  order: 4
---

> 🌏 [English version](/en/posts/daily/2026-08-22-framework-crewai-1.15.17-en)

## 版本資訊

| 項目 | 值 |
|---|---|
| 框架 | CrewAI |
| 版本 | v1.15.17 |
| 前一版 | v1.15.16 |
| 發布日 | 2026-08-20 |
| Release Notes | [GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.17) |
| GitHub | [crewAIInc/crewAI](https://github.com/crewAIInc/crewAI) |
| Stars | 57.4k |

## 這個版本為什麼重要

CrewAI 從 1.15.0 開始一直在擴充「宣告式 Flow」——用 YAML/JSON 定義整個 Flow（`methods`、`start`、`listen`、`do` 等欄位），透過 `Flow.from_declaration()` 直接載入執行，不必寫 Python `Flow` 子類別。與此同時，CrewAI 另外有一個實驗性的 conversational Flow 功能，讓 Flow 具備多輪對話能力（`handle_turn()`、對話路由、訊息歷史），但一直以來只能靠 Python 子類別手動加 `conversational = True` 才能開啟。1.15.17 把這兩條線接起來：宣告式定義現在也能驅動對話模式，框架會自動合成對應的內建對話方法，用 YAML/JSON 定義 Flow 的團隊不必再回頭改寫成 Python class 才能拿到多輪對話能力。同一版也把「這是需要主動開啟的實驗性功能」講得更清楚，避免使用者誤以為對話模式是預設行為。

## 重要變更

- **宣告式 Flow 可驅動對話模式（Enable declarations to drive conversational mode）**：宣告式（YAML/JSON）Flow 定義現在可以直接啟用 conversational 對話模式 → 用 `Flow.from_declaration()` 載入的 Flow 不必再改寫成 Python 子類別，就能拿到多輪對話能力
- **自動合成內建對話方法（Synthesize built-in conversational methods for declarations）**：框架依宣告式定義自動組出對應的對話處理方法 → 減少手動接線的樣板碼
- **對話文件同步更新（Add declarative conversational flows documentation）**：補上宣告式對話 Flow 的官方文件
- **Opt-in 語意更明確（Make conversational opt-in unmistakable）**：讓「對話模式需要主動開啟」這件事更難被忽略或誤用
- **AMP slug 隨工具解析保留（Carry the AMP slug on tools resolved from a slug reference）**：透過 slug 參照解析出的工具，會攜帶對應的 AMP slug → 影響用 slug 參照共用工具庫的整合情境
- **處理超大單一訊息的分塊（Handle oversized single messages during chunking）**：chunking 邏輯新增對超大單一訊息的處理，避免超長輸入在記憶／RAG 分塊流程中出錯

## Breaking Changes

本版本無 breaking changes。conversational Flow 本身仍標示為實驗性功能（位於 `crewai.experimental` 底下），行為可能在未來版本調整。

## 遷移指南

直接升級即可，無需修改程式碼：

```bash
pip install --upgrade crewai==1.15.17
```

conversational Flow 目前仍以 Python 子類別方式驅動（1.15.17 起宣告式 Flow 也能開啟同一開關，細節請參考官方文件的宣告式對話 Flow 章節）：

```python
from crewai import Flow
from crewai.flow import listen
from crewai.experimental.conversational import ConversationConfig, ConversationState

@ConversationConfig(defer_trace_finalization=True)
class SupportFlow(Flow[ConversationState]):
    conversational = True

    def route_turn(self, context: dict) -> str | None:
        message = (self.state.current_user_message or "").lower()
        if "order" in message:
            return "order"
        return "converse"

    @listen("order")
    def handle_order(self) -> str:
        reply = "Your order is on the way."
        self.append_assistant_message(reply)
        return reply

flow = SupportFlow()
try:
    flow.handle_turn("Where is my order?")
finally:
    flow.finalize_session_traces()
```

## 與其他框架的對比觀察

CrewAI 這版的取徑很有代表性：先把「宣告式定義」和「Python 子類別」拆成兩條並行的 Flow 建構方式，再逐版把子類別才有的能力（這次是 conversational 對話模式）搬進宣告式系統。相較於 LangGraph 目前主要仍以 Python/graph API 為主的建構方式，CrewAI 更早在賭「用設定檔取代程式碼」這個方向會是更多團隊採用 Agent 框架的路徑。

## 今日收穫

之前以為「宣告式 Flow」和「conversational Flow」是 CrewAI 兩個獨立的實驗性功能，各自往前推進；這次才注意到框架團隊其實是把它們當成同一套建構模型的兩個介面——功能本身只開發一次（對話路由、訊息歷史、`handle_turn` 生命週期），差別只在於你用 Python 子類別還是 YAML/JSON 宣告去驅動它。這代表接下來子類別限定的功能，很可能都會逐步「補完」到宣告式系統裡，而不是變成兩套永遠不同步的 API。

## 參考資料

- [CrewAI 1.15.17 — GitHub Release](https://github.com/crewAIInc/crewAI/releases/tag/1.15.17)
- [crewAIInc/crewAI — GitHub](https://github.com/crewAIInc/crewAI)
- [Conversational Flows — CrewAI 官方文件](https://docs.crewai.com/en/guides/flows/conversational-flows)
- [CrewAI 1.15.0 — GitHub Release（宣告式 Flow 載入首次加入）](https://github.com/crewAIInc/crewAI/releases/tag/1.15.0)
