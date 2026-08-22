---
title: "Mastra: Agents, Workflows, Memory, and Evals in TypeScript"
date: 2026-08-22
category: ai
type: deep-dive
tags: [mastra, ai-agent, typescript, workflow, memory, observability]
lang: en
tldr: "Mastra is a TypeScript agent framework that combines agents, typed workflows, memory, MCP, tracing, and scorers in one Node.js development environment."
description: "An introduction to Mastra agents, tools, workflows, memory, Studio, evaluation, and its tradeoffs against thinner AI SDKs."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-mastra-typescript-agent-framework)

[Mastra](https://mastra.ai/docs) is an open-source agent framework for TypeScript and Node.js teams. It combines agents, tools, MCP, workflows, memory, tracing, scorers, and a local Studio rather than merely wrapping a model SDK.

That is attractive in an existing Next.js, Node.js, or Cloudflare project: schemas stay in TypeScript and no separate Python service is required. The tradeoff is a broad framework surface.

## Agents and tools meet at schemas

An Agent combines instructions, a model, tools, and memory. A Tool defines an input schema and executor. The [tools guide](https://mastra.ai/docs/agents/mcp-guide) can load MCP tools or expose a Mastra agent as an MCP tool.

```ts
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const lookup = createTool({
  id: 'lookup-order',
  description: 'Look up an order',
  inputSchema: z.object({ id: z.string() }),
  execute: async ({ id }) => ({ id, status: 'shipped' }),
});

export const supportAgent = new Agent({
  name: 'Support agent', instructions: 'Use tools before answering.',
  model: 'openai/gpt-5-mini', tools: { lookup },
});
```

Schemas reject malformed input, not unauthorized access. Tools must obtain verified identity from runtime context rather than trust customer IDs supplied by the model.

## Workflows own deterministic paths

[Mastra Workflows](https://mastra.ai/ai-workflows) compose typed steps with sequential, parallel, branch, and loop control, plus suspend and resume. Use an Agent when the model should choose the next action; use a Workflow when order, error handling, and approval are explicit. Persisted state still does not make external side effects idempotent.

## Memory, tracing, and scorers close different loops

Memory changes the context of future runs. Tracing explains what happened. Scorers measure whether the outcome met a criterion. Before production, verify storage ownership, trace export, and sensitive-data redaction; a convenient Studio should not be the only audit record.

## Overall

Mastra fits TypeScript teams building both agents and resumable workflows. For one structured model call, an AI SDK plus Zod is thinner. Evaluate Mastra with a three-step workflow—read, agent decision, approval and write—then restart the process and test resume. See the [agent framework guide](/posts/ai/2026-08-22-agent-framework-selection-guide-en) for alternatives.

## References

- [Mastra documentation](https://mastra.ai/docs)
- [Mastra agents](https://mastra.ai/ai-agents)
- [Mastra workflows](https://mastra.ai/ai-workflows)
- [Mastra tools and MCP](https://mastra.ai/docs/agents/mcp-guide)
- [On this site: choosing an agent framework in 2026](/posts/ai/2026-08-22-agent-framework-selection-guide-en)
