---
title: "LangChain v1 Agents：create_agent、middleware 與 LangGraph runtime"
date: 2026-08-22
category: ai
type: deep-dive
tags: [langchain, ai-agent, langgraph, middleware, tool-calling, python]
lang: zh-TW
tldr: "LangChain v1 用 create_agent 提供高階 agent loop，底層由 LangGraph 執行；工具、structured output 與 middleware 是正式擴充邊界。"
description: "介紹 LangChain v1 Agents 的執行模型、工具、structured output、middleware，以及何時該直接使用 LangGraph。"
draft: false
---

> 🌏 [English version](/posts/ai/2026-08-22-langchain-agents-v1-en)

[LangChain v1 Agents](https://docs.langchain.com/oss/python/langchain/agents) 是建立 tool-calling agent 的高階入口。`create_agent` 接收模型、工具與 instructions，產生一個會反覆呼叫模型和工具，直到模型給出最終答案或達到停止條件的 agent loop。

今天談 LangChain agent，不能再用早期「很多 chain 與 executor」的印象理解。v1 的 `create_agent` 底層以 LangGraph 執行，middleware 則成為插入動態 prompt、模型切換、tool error、PII 與人工核准的正式邊界。

## 最小 agent 是模型加工具

```python
from langchain.agents import create_agent
from langchain.tools import tool

@tool
def search_orders(customer_id: str) -> str:
    """Return recent orders for a customer."""
    return "order-42: shipped"

agent = create_agent(
    model="openai:gpt-5-mini",
    tools=[search_orders],
    system_prompt="Answer support questions using verified order data.",
)

result = agent.invoke({
    "messages": [{"role": "user", "content": "Where is my order?"}]
})
```

工具可以是普通 Python function 或 coroutine。框架負責把 schema 暴露給模型、執行 tool call、把結果放回 state，再決定是否需要下一輪。這省掉的是 agent loop 的共同機械工作，不是工具本身的權限與業務驗證。

## Structured output 是結束契約

Agent 的最終回答常要進 API 或資料庫。[官方文件](https://docs.langchain.com/oss/python/langchain/agents)允許把 Pydantic model、dataclass 或其他 schema 傳給 `response_format`。供應商支援原生 structured output 時採 `ProviderStrategy`，否則可以走 tool-based strategy。

這項功能把「模型說它完成了」改成「輸出通過 schema 才完成」。它仍不能替你驗證事實正確性；金額、權限與外部 ID 等欄位還要做 domain validation。

## Middleware 是 v1 的主要擴充點

Middleware 可在 agent、model 或 tool 執行前後介入。典型用途包括按任務難度切模型、壓縮 context、重試 tool error、過濾 PII、設定 fallback，以及對高風險工具要求人工核准。

這比在每個工具裡各寫一份橫切邏輯容易維護，但 middleware 順序也會成為新控制流程。採用前應把每層的輸入、輸出與失敗行為寫成測試，不要讓五個 middleware 共同改寫同一份 messages 卻沒有 trace。

## LangChain 與 LangGraph 的邊界

`create_agent` 適合標準的 model → tools → model loop。需要自訂 node、edge、分支、subgraph、checkpoint 或從任意中斷點恢復時，直接使用 [LangGraph](/posts/ai/2026-03-27-langgraph-agent-orchestration) 會比較清楚。兩者不是競爭產品：LangChain 提供高階 agent abstraction，LangGraph 是底層 orchestration runtime。

## 整體來說

LangChain v1 適合想快速得到一個可擴充 agent loop，又希望日後能下探 LangGraph 的 Python 團隊。不適合的情境，是只有一次模型呼叫卻引入整套 agent runtime，或核心其實是固定、可預測的資料流程。

先拿一個工具與十筆固定案例做 baseline，再依序加入 structured output 和一個 middleware。每加一層都保存 trace 與成功率，才能知道框架真的解決了什麼。跨框架比較見[Agent 框架選型指南](/posts/ai/2026-08-22-agent-framework-selection-guide)。

## 參考資料

- [LangChain Agents](https://docs.langchain.com/oss/python/langchain/agents)
- [LangChain agent middleware reference](https://reference.langchain.com/python/langchain/agents/middleware)
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [站內：LangGraph Agent orchestration](/posts/ai/2026-03-27-langgraph-agent-orchestration)
- [站內：2026 Agent 框架怎麼選](/posts/ai/2026-08-22-agent-framework-selection-guide)
