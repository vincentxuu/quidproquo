---
title: "Letta and MemGPT Complete Guide: Memory Inside a Stateful Agent Runtime"
date: 2026-08-22
category: ai
type: deep-dive
tags: [letta, memgpt, memory, ai-agent, context-engineering, stateful-agent]
lang: en
tldr: "Letta extends MemGPT's operating-system analogy but is not a standalone memory API. The runtime persists agent state, editable in-context blocks, conversation history, and external archival memory, while the model can actively curate memory through tools."
description: "From the MemGPT paper to current Letta: memory blocks, conversation history, archival memory, MemFS, agent state, deployment, and limitations."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-letta-memgpt-agent-memory)

[Letta](https://docs.letta.com/) is a runtime for stateful agents; MemGPT is its research origin and former name. The central analogy treats the context window as RAM, allowing an agent to decide what stays resident, what moves to external memory, and when to retrieve it.

This is not Mem0 with another search mode. Mem0 attaches to an existing agent; Letta owns agent state, messages, tools, and the memory-management loop.

## Three layers are not one data pool

```text
┌──────────────── context window ────────────────┐
│ system prompt                                  │
│ core memory blocks: persona / human / project  │
│ recent messages + summary                      │
└────────────────────────────────────────────────┘
              │ explicit tools
              ▼
┌──────────────── external memory ───────────────┐
│ conversation history search                    │
│ archival memory / passages                     │
└────────────────────────────────────────────────┘
```

**Memory blocks** are persistent editable prompt sections with labels, descriptions, values, and limits. **Conversation history** keeps messages that leave active context. **Archival memory** contains separately inserted passages retrieved through semantic search. Archival memory is not automatically populated on overflow, and blocks do not automatically synchronize with it.

```python
from letta_client import Letta

client = Letta(token="your-token")
agent = client.agents.create(
    name="project-assistant",
    memory_blocks=[{
        "label": "project",
        "description": "Stable project decisions and constraints",
        "value": "No decisions yet",
    }],
)
client.agents.passages.create(
    agent_id=agent.id,
    text="The refund policy allows returns within thirty days.",
    metadata={"topic": "refunds"},
)
```

The SDK surface evolves with the runtime. Use the current Agent SDK reference rather than an early MemGPT server tutorial.

## Why the agent can manage memory

Most memory services let application code decide when to add or search. Letta gives memory tools to the agent, allowing it to edit blocks, insert archival passages, and search history. Memory curation becomes agent policy—and incorrect retrieval expands into incorrect write policy.

An unverified inference written into the `human` block persists in every turn. Vague block descriptions can route updates incorrectly. Concurrent writers can overwrite shared blocks. Self-editable memory is both a capability and an auditable write permission.

## MemFS and the current direction

Current Letta material also describes MemFS, a git-backed Markdown context repository. Files under `system/` stay in the prompt; other files remain discoverable on demand, with version history showing how memory changed. This is closer to readable, diffable context engineering than treating every memory as a vector row.

Do not collapse every generation into one architecture. The MemGPT paper, retired Letta V1 server, current Agent SDK, and Letta Code/MemFS are an evolving line. Pick Agent SDK, Cloud, App Server, or Letta Code first, then evaluate that surface.

## Fit

Letta fits long-lived agents that reflect on and curate state: assistants, AI coworkers, research agents, and coding agents. It is usually too much runtime for a bot that stores three preference fields.

Mem0 is an attachable memory API, Zep is temporal fact memory, and Cognee is a data-to-graph pipeline. Choosing Letta is closer to choosing an agent runtime than choosing a storage backend.

## A minimum launch test

Run a conversation beyond the context window and change one user preference midway. Verify that the current block retains only the latest confirmed state, old dialogue remains searchable, and archival memory contains only explicitly inserted passages. Restore an earlier block version or rebuild the agent to prove that state, tools, and memory have an auditable recovery path.

## References

- [Letta Documentation](https://docs.letta.com/)
- [Letta Agent State API](https://docs.letta.com/api/resources/agents)
- [Letta Memory Architecture](https://github.com/letta-ai/skills/blob/main/letta/letta-api-client/memory-architecture.md)
- [Letta MemFS](https://github.com/letta-ai/letta-docs-md/blob/main/concepts/memfs/index.md)
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560)
