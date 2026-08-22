---
title: "Pydantic AI: Building Python Agents with Types, Dependencies, and Validation"
date: 2026-08-22
category: ai
type: deep-dive
tags: [pydantic-ai, ai-agent, python, structured-output, dependency-injection, type-safety]
lang: en
tldr: "Pydantic AI models an agent as Agent[Deps, Output]: dependencies, tool inputs, and final outputs are typed, and model results must pass Pydantic validation."
description: "An introduction to Pydantic AI's typed Agent, RunContext, tools, structured outputs, testing, and durable-execution integrations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-pydantic-ai-typed-agents)

[Pydantic AI](https://pydantic.dev/docs/ai/) is a Python agent framework from the Pydantic team. Its defining feature is the type boundary: dependencies and outputs are generic types, while tool inputs and model results are validated with Pydantic schemas.

This fits FastAPI and typed Python backends. An agent can depend on a database client and must return an object the application can use—not text that merely resembles JSON.

## Declare dependencies and output together

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

The [Agent guide](https://pydantic.dev/docs/ai/core-concepts/agent/) groups instructions, tools, output type, dependency type, model, and settings. `RunContext` passes application dependencies to tools without putting a database or user identity into the prompt.

## Validation is not factual correctness

The [output guide](https://pydantic.dev/docs/ai/core-concepts/output/) explains how output types become JSON schemas and validated results. A schema error can trigger a retry; semantic correctness still requires validators, domain rules, or approval. A typed `needs_human: false` does not authorize a refund.

Tools may use context or be plain functions. Toolsets make integrations reusable and replaceable in tests. For long-running work, the [durable execution overview](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/) integrates Temporal, DBOS, Prefect, and Restate rather than treating message history as a checkpoint system.

## Overall

Pydantic AI fits teams whose outputs enter real Python domain models and whose tools need explicit dependencies. Start with one typed output, one dependency-aware tool, and a fake-model test; deliberately return the wrong schema and observe the failure path. For alternatives, see the [agent framework guide](/posts/ai/2026-08-22-agent-framework-selection-guide-en).

## References

- [Pydantic AI documentation](https://pydantic.dev/docs/ai/)
- [Pydantic AI Agents](https://pydantic.dev/docs/ai/core-concepts/agent/)
- [Pydantic AI Output](https://pydantic.dev/docs/ai/core-concepts/output/)
- [Pydantic AI durable execution](https://pydantic.dev/docs/ai/capabilities/durable_execution/overview/)
- [On this site: choosing an agent framework in 2026](/posts/ai/2026-08-22-agent-framework-selection-guide-en)
