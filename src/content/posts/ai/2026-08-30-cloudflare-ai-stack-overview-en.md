---
title: "Cloudflare AI Stack Guide: Building AI, RAG, and Agents on Workers"
date: 2026-08-30
type: guide
category: ai
tags: [cloudflare, ai-stack, workers-ai, rag, agents, architecture]
lang: en
tldr: "The Cloudflare AI Stack series covers the infrastructure around AI apps: where models run, how gateway control works, how RAG is built, how agents keep running, how memory is governed, and how browser, sandbox, secrets, data, and observability fit into a product."
description: "A guide to the Cloudflare AI Stack series, covering Workers AI, AI Gateway, AI Search, Vectorize, Agents, Agent Memory, Browser Run, Sandbox SDK, Secrets Store, D1/R2/DO, and observability."
draft: false
series:
  name: "Cloudflare AI Stack"
  order: 0
---

> 🌏 [中文版](/posts/ai/2026-08-30-cloudflare-ai-stack-overview)

When building an AI app, the model is only one piece. The surrounding infrastructure is where complexity shows up: provider keys, gateways, RAG, vector indexes, document sync, agent sessions, tool permissions, browsers, sandboxes, memory, observability, and cost control. You can connect a separate external service for each piece, or you can collapse many of them into Cloudflare.

This series is called Cloudflare AI Stack. It is an AI app architecture guide. It asks: how do I build an AI app on Cloudflare without managing a pile of separate infrastructure?

## Who This Series Is For

This path fits readers who:

- Want to use Workers AI for inference.
- Want AI Gateway to control OpenAI, Anthropic, Gemini, or other providers.
- Want to build RAG and are choosing between AI Search and Vectorize.
- Want agents to be durable runtime units instead of one-off HTTP loops.
- Want agents to use browsers, sandboxes, MCP, email, Slack, and webhooks.
- Want to decide where memory, conversations, artifacts, and eval traces should live.

If the main problem is normal website/app deployment, cache, storage, email, Turnstile, or Containers, read [Cloudflare Edge Platform](/en/posts/tech/2026-08-30-cloudflare-edge-platform-overview-en).

## Reading Order

I would read it in this order:

1. **Inference**: Workers AI bindings and model selection.
2. **Model control**: AI Gateway for observability, caching, rate limits, fallback, and BYOK.
3. **Retrieval**: AI Search for managed RAG; Vectorize for custom retrieval control.
4. **Runtime**: Agents for durable identity, state, SQLite, WebSockets, scheduling, and tool loops.
5. **Memory**: Agent Memory for user/team/project context, kept separate from RAG documents.
6. **Tools**: Browser Run when agents need a browser; Sandbox SDK when agents need code execution.
7. **Secrets and data**: Secrets Store for provider keys; D1/R2/DO for conversations, artifacts, locks, and traces.

The path starts with models, but it quickly moves beyond them. Production AI app problems are rarely just "can the model answer?" They are about whether the answer path is controllable, inspectable, recoverable, and governable.

## Each Service's Job

| Topic | What you should know after reading |
|---|---|
| Workers AI | What Cloudflare inference bindings can do |
| Workers AI model guide | How to choose chat, embedding, vision, and rerank models |
| AI Gateway | How provider calls are observed, cached, limited, and routed |
| AI Search | When to use a managed RAG pipeline |
| Vectorize | When to control chunking, embeddings, metadata, and queries yourself |
| Agents | How durable agent runtime is structured |
| Agent Memory | How memory differs from RAG documents |
| Browser Run for agents | When an agent needs a browser |
| Sandbox SDK | When an agent needs an isolated Linux workspace |
| Secrets Store | How BYOK and provider keys are governed centrally |
| D1/R2/DO for AI apps | Where conversations, artifacts, locks, and eval traces belong |

## When Not to Use This Stack

I would hesitate in these cases:

- You need to manage GPUs, training, or fine-tuning clusters yourself.
- Model hosting requires fine hardware-level control.
- The RAG pipeline must be fully custom and the team already has mature external infrastructure.
- Agents need long-running VMs or persistent block storage.
- Compliance rules prevent some data from entering Cloudflare.

Cloudflare AI Stack is strongest when the infrastructure around the AI app should live near Workers. It will not solve every AI product problem, but it can put inference, gateway control, retrieval, agent runtime, tools, secrets, and observability into one operating surface.

## References

- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Cloudflare AI Search](https://developers.cloudflare.com/ai-search/)
- [Cloudflare Vectorize](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Agents](https://developers.cloudflare.com/agents/)
- [Cloudflare Agent Memory](https://developers.cloudflare.com/agent-memory/)
- [Cloudflare Browser Run](https://developers.cloudflare.com/browser-run/)
- [Cloudflare Secrets Store](https://developers.cloudflare.com/secrets-store/)
