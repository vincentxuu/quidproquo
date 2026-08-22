---
title: "LangChain v1 Agents: create_agent, Middleware, and the LangGraph Runtime"
date: 2026-08-22
category: ai
type: deep-dive
tags: [langchain, ai-agent, langgraph, middleware, tool-calling, python]
lang: en
tldr: "LangChain v1 provides a high-level agent loop through create_agent, runs it on LangGraph, and treats tools, structured output, and middleware as its extension boundaries."
description: "An introduction to LangChain v1 Agents, tools, structured output, middleware, and the boundary between LangChain and LangGraph."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-langchain-agents-v1)

[LangChain v1 Agents](https://docs.langchain.com/oss/python/langchain/agents) is the high-level entry point for tool-calling agents. `create_agent` combines a model, tools, and instructions into a loop that continues until the model returns a final answer or reaches a stop condition.

The current design should not be understood through LangChain's early collection of chains and executors. `create_agent` runs on LangGraph, while middleware is the supported boundary for dynamic prompts, model selection, tool errors, PII controls, and human approval.

## A minimal agent is a model plus tools

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
result = agent.invoke({"messages": [{"role": "user", "content": "Where is my order?"}]})
```

Tools may be ordinary Python functions or coroutines. The framework exposes their schemas, executes calls, returns results to state, and decides whether another model turn is needed. It does not replace authorization or domain validation inside those tools.

## Structured output is the completion contract

The [agent documentation](https://docs.langchain.com/oss/python/langchain/agents) accepts schemas through `response_format`. It uses a provider-native strategy when available and can fall back to a tool-based strategy. This changes completion from “the model says it is done” to “the result satisfies a schema,” though factual and domain validation remain application responsibilities.

## Middleware is the main v1 extension point

Middleware can run around the agent, model, and tools. Common uses include dynamic model selection, context compression, tool-error handling, PII filtering, fallbacks, and approval gates. Ordering becomes part of the control flow, so test each layer's inputs, outputs, and failure behavior instead of stacking message-mutating middleware without traces.

## The LangChain–LangGraph boundary

`create_agent` fits the standard model-tools-model loop. When a system needs custom nodes, edges, branches, subgraphs, checkpoints, or precise resume points, use [LangGraph](/posts/ai/2026-03-27-langgraph-agent-orchestration-en) directly. LangChain is the high-level agent abstraction; LangGraph is its orchestration runtime.

## Overall

LangChain v1 suits Python teams that want a quick but extensible agent loop with a path down to LangGraph. Start with one tool and a fixed evaluation set, then add structured output and one middleware at a time. Preserve traces and success rates so each abstraction earns its place. See the [agent framework guide](/posts/ai/2026-08-22-agent-framework-selection-guide-en) for the wider comparison.

## References

- [LangChain Agents](https://docs.langchain.com/oss/python/langchain/agents)
- [LangChain agent middleware reference](https://reference.langchain.com/python/langchain/agents/middleware)
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [On this site: LangGraph agent orchestration](/posts/ai/2026-03-27-langgraph-agent-orchestration-en)
- [On this site: choosing an agent framework in 2026](/posts/ai/2026-08-22-agent-framework-selection-guide-en)
