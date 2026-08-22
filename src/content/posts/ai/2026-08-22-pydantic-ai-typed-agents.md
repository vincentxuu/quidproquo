---
title: "Pydantic AI：用型別、Dependency Injection 與驗證建立 Python Agent"
date: 2026-08-22
category: ai
type: deep-dive
tags: [pydantic-ai, ai-agent, python, structured-output, dependency-injection, type-safety]
lang: zh-TW
tldr: "Pydantic AI 把 Agent 寫成 Agent[Deps, Output]：依賴、工具輸入與最終輸出都有型別，模型結果必須通過 Pydantic 驗證。"
description: "介紹 Pydantic AI 的 typed Agent、RunContext、tools、structured output、測試與 durable execution 整合。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-pydantic-ai-typed-agents-en)

[Pydantic AI](https://pydantic.dev/docs/ai/) 是 Pydantic 團隊建立的 Python agent 框架。它的辨識度不在多 agent 圖，而在型別邊界：Agent 的 dependency 與 output 都是 generic type，工具參數和模型輸出再由 Pydantic schema 驗證。

這讓它很適合既有 FastAPI、Pydantic model 與 typed service 的後端。你的 agent 可以依賴資料庫 client，最後必須回傳程式真正能使用的物件，而不是一段看起來像 JSON 的文字。

## Agent 同時宣告依賴與輸出

```python
from dataclasses import dataclass
from pydantic import BaseModel
from pydantic_ai import Agent, RunContext

@dataclass
class Deps:
    customer_id: str

class Answer(BaseModel):
    summary: str
    needs_human: bool

agent = Agent('openai:gpt-5-mini', deps_type=Deps, output_type=Answer)

@agent.tool
async def customer_context(ctx: RunContext[Deps]) -> str:
    return f'customer={ctx.deps.customer_id}'
```

[官方 Agent 文件](https://pydantic.dev/docs/ai/core-concepts/agent/)把 instructions、tools、output type、dependency type、model 與 settings 都收在同一個容器。`RunContext` 將程式端依賴傳給工具，不必把資料庫或使用者身分塞進 prompt。

## Structured output 是驗證，不是事實保證

[Output 文件](https://pydantic.dev/docs/ai/core-concepts/output/)說明 Pydantic AI 會從 output type 建 JSON schema，並驗證模型結果。型別錯誤可以重試；欄位語意仍要由 validator、business rule 或人工核准判斷。`needs_human: false` 通過型別，不代表模型真的有權批准退款。

工具同樣可用 `@agent.tool` 取得 context，或用 `@agent.tool_plain` 宣告不需依賴的函式。Toolset 則把一組工具打包、過濾或在測試時替換，適合把 production integration 換成 fake。

## Durable execution 交給專門 runtime

Pydantic AI 沒有假裝普通 message history 就能解決長工作流。[官方 durable execution 概覽](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/)列出 Temporal、DBOS、Prefect 與 Restate 整合，將 agent step 放進可恢復 runtime。

這是務實分工，也會增加部署面。團隊仍要理解選定 runtime 的 retry、determinism、serialization 與版本升級規則；看見 integration 名稱不等於零設定就得到可靠工作流。

## 整體來說

Pydantic AI 適合輸出必須進入正式 Python domain model、工具需要明確依賴，而且希望用 type checker 與測試提早抓錯的團隊。以角色聊天為核心的多 agent 系統，AG2 可能更直覺；需要圖狀 checkpoint 的流程，LangGraph 更直接。

最小驗證請做一個 typed output、一個需 dependency 的工具與一個 fake model 測試，再故意回傳錯 schema，確認失敗如何被觀測。其他框架定位見[Agent 框架選型指南](/posts/ai/2026-08-22-agent-framework-selection-guide)。

## 參考資料

- [Pydantic AI documentation](https://pydantic.dev/docs/ai/)
- [Pydantic AI Agents](https://pydantic.dev/docs/ai/core-concepts/agent/)
- [Pydantic AI Output](https://pydantic.dev/docs/ai/core-concepts/output/)
- [Pydantic AI durable execution](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/)
- [站內：2026 Agent 框架怎麼選](/posts/ai/2026-08-22-agent-framework-selection-guide)
