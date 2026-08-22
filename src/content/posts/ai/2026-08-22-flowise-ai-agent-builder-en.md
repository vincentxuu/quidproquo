---
title: "Flowise Deep Dive: From Assistant, Chatflow, and Agentflow to an EOL Migration Decision"
date: 2026-08-22
category: ai
type: deep-dive
tags: [flowise, low-code, ai-agent, workflow, mcp]
lang: en
tldr: "Flowise uses Assistant, Chatflow, and Agentflow to cover simple assistants, single-agent systems, and multi-agent orchestration; however, its repository was archived in August 2026 and official EOL is scheduled for August 31, so new projects should not adopt it without a maintained fork and migration plan."
description: "An application-lifecycle guide to Flowise's three visual builders, nodes, tools, memory, Prediction API, embeddings, deployment, Custom MCP security boundary, and post-EOL selection decision."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-flowise-ai-agent-builder)

[Flowise](https://docs.flowiseai.com/) is an open-source platform for building LLM workflows and AI agents on a visual canvas. Its center is not general SaaS automation or an all-in-one application platform. It combines models, retrievers, memory, tools, conditions, loops, and human approval into executable AI workflows.

This cannot be only a feature tour. The Flowise team published an [official wind-down announcement](https://github.com/FlowiseAI/Flowise/discussions/6727) with this timeline:

- Development stopped on July 29, 2026.
- The repository was archived on August 13, 2026.
- Official EOL is scheduled for August 31, 2026; as of this article's date, that effective date is still in the future.

The Apache 2.0 code remains forkable, but the original project will no longer receive normal feature and security maintenance. This article therefore answers two questions: how Flowise works and whether it should still be used.

## Step 1: Choose Assistant, Chatflow, or Agentflow

Flowise provides three builders. The difference is how much workflow detail you intend to own.

| Entry point | Core capability | A sensible first use |
| --- | --- | --- |
| Assistant | Instructions, tools, and uploaded-file RAG | Validate whether one question-answering assistant creates value |
| Chatflow | Single agents, chatbots, retrievers, and rerankers | Control a conversational or RAG pipeline explicitly |
| Agentflow | Conditions, loops, human approval, shared state, and multiple agents | Build complex workflows that need orchestration and resumption |

The [official introduction](https://docs.flowiseai.com/) describes Agentflow as a superset of Assistant and Chatflow. That does not mean every project should begin there. Write one sentence first: “What is the input, which actions are allowed, and what must the output look like?” Start with Assistant for question answering and a few tools, use Chatflow when retrieval and model nodes need explicit layout, and use Agentflow only when branches, loops, approvals, or multiple agents are necessary.

This is also where Flowise differs from two common alternatives. [n8n](/posts/ai/2026-08-22-n8n-agent-automation-en) is automation-first: schedules, webhooks, and broad business integrations are the center, with AI as one part of a workflow. [Dify](/posts/ai/2026-08-22-dify-ai-app-platform-en) is an application platform: Knowledge, workflows, plugins, and publishing share a workspace. Flowise is a visual LLM and agent builder centered on models, retrieval, tools, and agent orchestration.

## Step 2: Connect nodes, tools, and memory into a controlled flow

[Agentflow V2](https://docs.flowiseai.com/using-flowise/agentflowv2) defines nodes as explicit execution units. An LLM Node performs one model call. An Agent Node lets a model select tools or Document Stores according to an objective. A Tool Node executes a predetermined tool at a fixed point without asking the model to choose. If the required API call is known, prefer a Tool or HTTP Node. Use an Agent Node only when tool selection itself requires reasoning.

Memory is not one switch. LLM and Agent nodes can read conversation history as a full history, recent window, or summary. `$flow.state` is a temporary key-value store shared within one execution. Every key must be declared in the Start Node, and the state disappears when the run ends. Persistent conversation or business data still belongs in a durable memory integration, database, or external service.

A safer support workflow might look like this:

```text
Start
  -> Retriever (read-only knowledge)
  -> LLM (draft an answer with sources)
  -> Condition (does this involve a refund?)
       -> No: Direct Reply
       -> Yes: Human Input
                -> Approve: Tool (call refund API)
                -> Reject: Direct Reply
```

The important design choice is not adding another agent. It is placing a side-effecting action in a fixed Tool Node behind human approval. Flowise can also require human input for an individual tool attached to an Agent Node. Before release, test tool timeouts, missing arguments, empty retrieval, and user rejection.

## Step 3: Connect knowledge, embeddings, and the application API

An Agent Node can use a Flowise Document Store or a pre-existing vector store with its compatible embedding model. Embedding dimensions and index configuration must match. Changing the embedding model commonly requires rebuilding the index rather than changing a dropdown. Record the source documents, splitting configuration, embedding model, vector-store namespace, and synchronization time together if retrieval results must be reproducible.

Applications normally call a finished flow through the Prediction API instead of exposing the Flowise canvas. The primary official endpoint is `POST /api/v1/prediction/{id}`:

```bash
curl -X POST "https://flowise.example.com/api/v1/prediction/FLOW_ID" \
  -H "Authorization: Bearer $FLOWISE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"question":"What restrictions apply to refunds?","streaming":false}'
```

A flow may otherwise be callable by anyone who knows its ID. The official [flow authorization guide](https://docs.flowiseai.com/configuration/authorization/chatflow-level) explains how to assign an API key. A production gateway should still handle user authentication, tenant mapping, quotas, and audit logs. Never ship the platform key in browser code. Runtime `overrideConfig` should expose only explicitly approved fields rather than accept an external node configuration wholesale.

## Step 4: Operate the deployment as a service

The default single-node setup uses SQLite and local files. It suits prototyping, not an automatically production-ready topology. The official [production guide](https://docs.flowiseai.com/configuration/running-in-production) recommends Queue mode at scale: main servers receive requests, Redis carries jobs, workers execute flows, and PostgreSQL replaces SQLite. The database, uploaded files, vector store, Redis, and credential encryption key all belong in backup and recovery exercises.

The [environment variable guide](https://docs.flowiseai.com/configuration/environment-variables) exposes several easy-to-miss boundaries. Flowise encrypts third-party credentials with an encryption key; losing that key can make credentials unreadable even when the database survives. Public flows need rate limits, and reverse-proxy deployments must configure `NUMBER_OF_PROXIES` correctly. Community nodes, custom JavaScript dependencies, reachable HTTP destinations, and permitted model lists also need operator restrictions.

At minimum, rehearse restoring the database and encryption key, handling an interrupted worker job, and rerunning fixed regression cases after an upgrade. A canvas that opens proves that the UI is available, not that credentials, retrieval, and side-effecting tools still behave correctly.

## Custom MCP and arbitrary code execution are permission boundaries

Flowise Custom Tools and Custom Functions execute server-side JavaScript. Custom MCP over stdio goes further by starting local processes. The official [Tools & MCP tutorial](https://docs.flowiseai.com/tutorials/tools-and-mcp) recommends Streamable HTTP rather than stdio for cloud deployments. These are not ordinary drag-and-drop components; they are close to code-deployment and process-launch privileges.

The risk is demonstrated by an [official security advisory](https://github.com/FlowiseAI/Flowise/security/advisories/GHSA-g98q-rm45-q9h8). It documents an authenticated-user RCE through Custom MCP stdio configuration affecting versions through 3.1.2.

Version 3.1.3 patched that vulnerability.

The latest official [3.1.4 release](https://github.com/FlowiseAI/Flowise/releases/tag/flowise%403.1.4) contains another Custom MCP command-allowlist change and several authorization fixes. The site's [Flowise Custom MCP security alert](/posts/daily/2026-08-18-security-flowise-custom-mcp-command-injection) provides a longer incident analysis.

Existing deployments should at least pin 3.1.4, disable unneeded nodes, keep `CUSTOM_MCP_SECURITY_CHECK=true`, prefer remote HTTP MCP in production, and isolate Flowise workers with filesystem and egress restrictions. More importantly, only a small administrator group should be allowed to create Custom Tools, Custom Functions, and Custom MCP configurations. Validation is a last line of defense, not a substitute for least privilege.

## How to decide after EOL

For new projects, the conclusion is direct: do not make an archived, soon-to-be-EOL Flowise deployment the default production platform. An exception requires a trusted and actively maintained fork, ownership of security patches and dependency updates, a plan for model API changes, and a documented migration exit.

For an existing deployment, export flow definitions and inventory credentials, variables, Document Stores, vector indexes, uploaded files, and external API dependencies. Then classify flows by their actual center: webhook and SaaS-heavy automation can move toward n8n; products organized around Knowledge and application publishing can evaluate Dify; workflows requiring engineering control over agent state and recovery can evaluate a code-first agent framework. Do not select a replacement by visual resemblance alone. The real migration units are state, tool contracts, and data ownership.

Flowise remains useful for learning visual agent orchestration and may continue running existing flows in isolated environments. Its largest constraint is no longer a feature trade-off; official maintenance is ending. Write the stop condition on day one: without an active maintainer, traceable security patches, and a reproducible deployment, it does not enter production.

## References

- [Flowise official introduction](https://docs.flowiseai.com/)
- [Flowise Agentflow V2](https://docs.flowiseai.com/using-flowise/agentflowv2)
- [Flowise Tools & MCP](https://docs.flowiseai.com/tutorials/tools-and-mcp)
- [Flowise Prediction API](https://docs.flowiseai.com/api-reference/prediction)
- [Flowise flow-level authorization](https://docs.flowiseai.com/configuration/authorization/chatflow-level)
- [Flowise production deployment](https://docs.flowiseai.com/configuration/running-in-production)
- [Flowise environment variables and security configuration](https://docs.flowiseai.com/configuration/environment-variables)
- [Flowise official EOL announcement](https://github.com/FlowiseAI/Flowise/discussions/6727)
- [Flowise 3.1.4 release](https://github.com/FlowiseAI/Flowise/releases/tag/flowise%403.1.4)
- [GHSA-g98q-rm45-q9h8: Custom MCP RCE](https://github.com/FlowiseAI/Flowise/security/advisories/GHSA-g98q-rm45-q9h8)
