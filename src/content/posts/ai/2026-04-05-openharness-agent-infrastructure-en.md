---
title: "OpenHarness: A Fully Open-Source Agent Harness Framework"
date: 2026-04-05
type: project
category: ai
tags: [agent-harness, open-source, multi-agent, tool-use, mcp]
lang: en
tldr: "An open-source Agent Harness framework from HKUDS (HKU Data Science Lab) that implements tool calling, skill loading, memory, permissions, and multi-agent collaboration as complete infrastructure, supporting Anthropic / OpenAI / GitHub Copilot API formats."
description: "OpenHarness is a complete open-source Agent Harness implementation covering Agent Loop, 43+ tools, a skill system, persistent memory, multi-agent collaboration, and security governance — ideal for researchers seeking to understand how production-grade Agents work."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-04-05-openharness-agent-infrastructure)

While researching Agent infrastructure recently, I came across OpenHarness, open-sourced by HKUDS (HKU Data Science Lab). It lays out a complete Agent Harness for you to inspect. If you want to understand "how an LLM becomes an Agent that can use tools, has memory, and can collaborate," this project's architecture is worth the time to study.

## What Is an Agent Harness

A Harness is the infrastructure layer wrapped around an LLM. The model provides intelligence; the Harness provides operational capability — tools, memory, observation, action, permissions. In OpenHarness's own words:

> Harness = Tools + Knowledge + Observation + Action + Permissions

This is essentially the same thing as manually wrapping function calling + context management around an LLM API, except OpenHarness systematizes it into 10 subsystems.

## Agent Loop Engine

At the core is a streaming tool-call loop:

```
query → stream → tool-call → execute → loop
```

The concrete flow:

```python
while True:
    response = await api.stream(messages, tools)

    if response.stop_reason != "tool_use":
        break  # Model determines the task is complete

    for tool_call in response.tool_uses:
        # Permission check → Hook → Execute → Hook → Result
        result = await harness.execute_tool(tool_call)

    messages.append(tool_results)
    # Model sees the results and decides the next step
```

This loop supports API retries (exponential backoff), parallel tool execution, and token counting with cost tracking. None of this is a new concept, but OpenHarness implements every layer — including streaming handling and error recovery.

## Tool Ecosystem (43+ Tools)

Tools are the Agent's hands and feet. OpenHarness ships with 43+ built-in tools, organized into several categories:

| Category | Tools | Purpose |
|----------|-------|---------|
| File I/O | Bash, Read, Write, Edit, Glob, Grep | Core file operations with permission checks |
| Search | WebFetch, WebSearch, ToolSearch | Web and code search |
| Notebook | NotebookEdit | Jupyter cell editing |
| Agents | Agent, SendMessage, TeamCreate | Subagent spawning and coordination |
| Tasks | TaskCreate/Get/List/Update/Stop | Background task management |
| MCP | MCPTool, ListMcpResources | Model Context Protocol integration |
| Scheduling | CronCreate/List/Delete | Scheduled and remote execution |

Each tool uses Pydantic for input validation, ships with its own JSON Schema description, and integrates with the permission system and Hook lifecycle.

## Skill System (Skills)

Skills are on-demand Markdown files that let the Agent acquire domain-specific knowledge when needed. Built-in skills cover commit writing, code review, debugging, planning, testing, simplification, and more.

Unlike stuffing all prompts into the system message, Skills are dynamically loaded — the Agent injects them into context only when it determines a particular skill is needed, avoiding wasted tokens. This design is practical when context windows are limited.

## Security and Governance

An Agent that can execute shell commands and read/write files needs robust security controls. OpenHarness takes a multi-layered defense approach:

- **Multi-level permission modes**: Controls tool access granularity
- **Path and command rules**: Allowlist/blocklist-style access control
- **PreToolUse / PostToolUse Hooks**: Interception points before and after tool execution for custom logic
- **Interactive approval dialogs**: High-risk operations require user confirmation

This is not a token permissions system — it is a pipeline that every tool call passes through.

## Persistent Memory

One of the most common criticisms of Agents is "no memory." OpenHarness addresses this with a three-layer architecture:

1. **CLAUDE.md discovery and injection**: Automatically detects project-level instruction files and injects them into context
2. **Context compression (Auto-Compact)**: Automatically compresses historical messages when nearing the context limit while preserving semantics
3. **MEMORY.md persistent storage**: Cross-session knowledge retention
4. **Session Resume**: Restores previous conversation state

This makes the Agent more than a stateless tool caller — it can accumulate knowledge across multiple sessions.

## Multi-Agent Collaboration

OpenHarness supports subagent spawning and team collaboration:

- **Subagent Spawning**: Dynamically creates subagents and delegates subtasks
- **Team Registry**: Centralized management of multiple agents
- **Background task lifecycle**: Tracks task status
- **ClawTeam integration** (planned)

This is useful for scenarios requiring complex task decomposition — the main agent handles planning, subagents execute independently, and results are collected and consolidated.

## Supported Model Providers

OpenHarness is not locked to a single model and supports three API formats:

**Anthropic format (default)**
- Anthropic Claude series
- Moonshot / Kimi (`kimi-k2.5`)
- Vertex AI, Amazon Bedrock

**OpenAI format**
- OpenAI (GPT-4o)
- DashScope (Qwen, DeepSeek)
- DeepSeek API
- GitHub Models, SiliconFlow, Groq
- Ollama (local deployment)

**GitHub Copilot format**
- Authenticates via OAuth device flow, no additional API key required

Switching providers is just a matter of changing environment variables:

```bash
# Use Kimi
export ANTHROPIC_BASE_URL=https://api.moonshot.cn/anthropic
export ANTHROPIC_API_KEY=your_key
export ANTHROPIC_MODEL=kimi-k2.5
oh
```

## Overall Architecture

```
┌─────────────────────────────────────────────┐
│                  Agent Loop                  │
│         query → stream → tool → loop         │
├──────────┬──────────┬──────────┬────────────┤
│  Tools   │  Skills  │  Memory  │ Permissions │
│  43+     │  .md     │  3-layer │  multi-level│
├──────────┴──────────┴──────────┴────────────┤
│  Hooks │ Commands(54) │ MCP Client │ Plugins │
├─────────────────────────────────────────────┤
│            Multi-Agent Coordinator           │
│     subagent spawning / team registry        │
├─────────────────────────────────────────────┤
│  Anthropic API │ OpenAI API │ Copilot OAuth  │
└─────────────────────────────────────────────┘
```

## Overall Assessment

The value of OpenHarness is not in inventing anything new, but in open-sourcing the complete implementation of a production-grade Agent Harness. Agent Loop, tool system, skill loading, memory management, permission control, multi-agent collaboration — all of these exist in various commercial products, but few projects lay out every layer for inspection.

It suits two types of people: researchers who want to understand how Agents work internally, and developers who want to build their own Agents on top of a proven architecture. It is not a good fit for quickly wiring up a chatbot — the framework's complexity is overkill for simple applications.

Technical requirements are Python 3.10+ and Node.js 18+, MIT licensed.

## References

- [OpenHarness GitHub — HKUDS Agent Harness Full Open-Source Framework](https://github.com/HKUDS/OpenHarness)
- [HKUDS - HKU Data Science Lab](https://github.com/HKUDS)
- [Model Context Protocol (MCP) — Agent Tool Integration Standard](https://modelcontextprotocol.io/)
- [Anthropic Claude API — Multi-Agent Collaboration Model Supported by OpenHarness](https://docs.anthropic.com/en/api/getting-started)
