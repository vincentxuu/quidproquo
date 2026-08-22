---
title: "Microsoft Agent Framework: After the Merge, Who Does the Name AutoGen Point To?"
date: 2026-08-21
category: ai
type: deep-dive
tags: [microsoft-agent-framework, autogen, semantic-kernel, agent, ai-agent, mcp]
lang: en
tldr: "Microsoft merged Semantic Kernel and its own AutoGen into Microsoft Agent Framework, which hit 1.0 GA on 2026-04-02 for .NET and Python (Go is still public preview). The absorbed autogen-agentchat has not shipped since 2025-09-30. But AG2, the fork on the original authors' side, never merged — it shipped 1.0.2 six days ago, and `pip install autogen` gets you AG2, not Microsoft. This post covers MAF's abstractions, the migration clock, and how to read the tangle of names."
description: "A deep dive on Microsoft Agent Framework: how it merges Semantic Kernel and AutoGen, what is and is not covered by the 1.0 stability promise, the Semantic Kernel sunset timeline, and who actually owns the AutoGen, AG2, and autogen package names."
series:
  name: "Technology Choices in the AI Era"
  order: 9
draft: false
---

🌏 [中文版](/posts/ai/2026-08-21-microsoft-agent-framework)

Start with a practical problem: **if you run `pip install autogen` today, you do not get anything of Microsoft's.**

That package name belongs to AG2 and points at `ag2ai/ag2classic`. Microsoft's own line is published as `autogen-agentchat` and `autogen-core`, and those last shipped on 2025-09-30. The thing Microsoft actually promotes now is called Microsoft Agent Framework, published as `agent-framework`.

One name, three owners. Let me untangle that first, then talk about the framework itself.

## What got merged

Microsoft Agent Framework (MAF from here) was announced in October 2025, reached Release Candidate in February 2026, and **shipped 1.0 GA on 2026-04-02** for .NET and Python. The Go version is still public preview; the docs state plainly that declarative agents, RAG, CodeAct, and functional workflows are not there yet.

What it merges are two of Microsoft's own projects. The official framing is direct:

> Semantic Kernel and AutoGen pioneered the concepts of AI agents and multi-agent orchestration. The Agent Framework is the direct successor, created by the same teams... In short, Agent Framework is the next generation of both Semantic Kernel and AutoGen.

The division of labour is stated just as clearly. **AutoGen contributed the simple abstractions for single- and multi-agent patterns; Semantic Kernel contributed the enterprise half** — session-based state management, type safety, filters, telemetry, and broad model and embedding support. On top of both, MAF adds graph-based workflows so multi-agent execution paths can be controlled explicitly.

## What is in 1.0

"1.0" carries a commitment here: Microsoft calls it production-ready, with stable APIs and **full backward compatibility going forward**. What made the cut is what had been battle-tested:

- **Single agents and service connectors** — first-party connectors for Microsoft Foundry, Azure OpenAI, OpenAI, Anthropic Claude, Amazon Bedrock, Google Gemini, and Ollama
- **Middleware hooks** — intercept, transform, and extend agent behaviour at every execution stage: content safety filters, logging, compliance policy, all without touching agent prompts
- **Memory and context providers** — pluggable backends across Foundry Agent Service memory, Mem0, Redis, Neo4j, or a custom store
- **Agent workflows** — a graph engine that branches, fans out to parallel steps, and converges; **checkpointing keeps long processes alive across interruptions**
- **Multi-agent orchestration** — sequential, concurrent, handoff, group chat, and Magentic-One, all with streaming, checkpointing, human-in-the-loop approvals, and pause/resume
- **Declarative YAML** — put instructions, tools, memory config, and orchestration topology under version control and load them with one API call
- **A2A and MCP** — MCP lets agents discover and invoke external tools dynamically; A2A enables cross-runtime agent collaboration, with the docs noting A2A 1.0 support is still "coming soon"

A separate batch ships as preview: DevUI, a browser-based local debugger; Foundry hosted agents; AG-UI / CopilotKit / ChatKit frontend adapters; Skills; and one worth noting — **the GitHub Copilot SDK and the Claude Code SDK can be wrapped as agent harnesses inside MAF**, letting a coding-capable agent sit alongside others in the same multi-agent workflow.

## The minimum viable shape

On the Python side, an agent looks like this:

```python
# pip install agent-framework
from agent_framework import Agent
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential

agent = Agent(
    client=FoundryChatClient(
        project_endpoint="https://your-foundry-service.services.ai.azure.com/api/projects/your-project",
        model="gpt-5.4-mini",
        credential=AzureCliCredential(),
    ),
    name="HelloAgent",
    instructions="You are a friendly assistant. Keep your answers brief.",
)

result = await agent.run("What is the largest city in France?")
```

The packaging is worth knowing up front. `pip install agent-framework` pulls the core plus a set of common provider packages. The core is `agent-framework-core`, with providers split out (`agent-framework-openai`, `-foundry`, `-mem0`, `-copilotstudio`, and so on) so you can install only what you need once you know. But **imports always come from `agent_framework`**, regardless of how the packages are split.

Anyone migrating from Semantic Kernel will notice one difference immediately. SK offered a different agent class per service (`ChatCompletionAgent`, `OpenAIAssistantAgent`, `AzureAIAgent`, and more); MAF collapses those into a single `Agent` that works with any service whose SDK implements the right interface. The .NET equivalent is `ChatClientAgent`. Only two special cases remain: `CopilotStudioAgent` and `A2AAgent`.

## The brake Microsoft pumps itself

One line in the documentation strikes me as the most valuable thing on the page:

> If you can write a function to handle the task, do that instead of using an AI agent.

The same page draws the agent/workflow line: use an agent when the task is open-ended or conversational and needs autonomous tool use and planning; use a workflow when the process has well-defined steps, you need explicit control over execution order, or multiple agents and functions must coordinate.

A framework's own documentation telling you that most of the time you do not need it is more persuasive than a hundred listed features.

## The migration has a clock

This is the part that matters most for a selection decision: **Semantic Kernel's sunset has a date attached.**

Microsoft's commitment is that SK v1.x stays supported for "at least one year after Microsoft Agent Framework leaves Preview and is Generally Available." MAF went GA on 2026-04-02, which puts that around **April 2027**. In the meantime SK gets critical bug and security fixes, while the overwhelming majority of new features land only in MAF.

The tooling is more aggressive than typical migration docs. Alongside separate migration guides for Semantic Kernel and AutoGen, Microsoft ships **migration assistants** that analyse your existing code and generate a step-by-step plan. Existing SK code also gets a compatibility path: `KernelFunction` instances convert into MAF tools via `.as_agent_framework_tool` (requires `semantic-kernel` 1.38 or higher).

Going to that length usually means they genuinely want you to move.

## Who does AutoGen mean now

Back to the opening. Here is where the names actually sit (checked on PyPI, 2026-08-21):

| Package | Latest | Last published | Whose |
|---|---|---|---|
| `agent-framework` | 1.14.0 | 2026-08-14 | Microsoft — this is MAF |
| `autogen-agentchat` / `autogen-core` | 0.7.5 | **2025-09-30** | Microsoft's old AutoGen |
| `pyautogen` | 0.10.0 | 2025-07-15 | Microsoft, a proxy for `autogen-agentchat` |
| `ag2` | 1.0.2 | **2026-08-15** | Chi Wang and Qingyun Wu (`ag2ai/ag2`) |
| `autogen` | 0.14.1rc1 | 2026-06-30 | **also AG2's**, pointing at `ag2ai/ag2classic` |

Two things fall out of that table.

First, **Microsoft's AutoGen really has stopped**. `autogen-agentchat` last shipped on 2025-09-30, and MAF was announced the following month. The timing does not need much explaining.

Second, **AG2 did not merge**. It is maintained by the original authors, and it shipped 1.0.2 on 2026-08-15 — one day before MAF's latest release. These are two lines both alive, not two stages of one line.

The practical trap is that last row. `pip install autogen` installs AG2's classic line. Follow a 2025 tutorial that starts with that command, then debug against Microsoft's documentation, and you can lose a long time working out why nothing matches.

## The honest part

Three things to know going in.

**The pull toward Azure is strong.** The first-party connectors genuinely cover Anthropic, Google, Bedrock, and Ollama — this is not Azure-only. But the documentation's default path, the quickstart samples, and the surrounding hosting, memory, observability, and evaluation stories all orbit Microsoft Foundry. A team outside the Azure ecosystem should expect to get the core and miss half of the full experience.

**The third-party disclaimer is heavy.** The docs state that if you use MAF with any third-party servers, agents, code, or non-Azure Direct models, you do so at your own risk; those are Non-Microsoft Products governed by their own license terms, and you are responsible for costs and for whether your data leaves your organization's Azure compliance and geographic boundaries. That does not change the technical assessment, but it changes the procurement and legal conversation.

**Look carefully at what 1.0 covers.** The backward-compatibility promise applies to the stable list above. DevUI, Foundry hosting, the AG-UI adapters, Skills, the Agent Harness, and the Copilot / Claude Code SDK integrations are all preview, and Microsoft says explicitly those APIs may change on community feedback. Betting on a preview feature is not betting on the 1.0 promise.

## When to pick it

Judged by this series' criteria, **MAF does not score full marks on adoption** — it is too new, with `agent-framework` only starting in October 2025. But it has something most frameworks do not: **a large vendor's long-term support commitment with a date written on it**, plus the installed base of two predecessors.

So the sensible split:

- **Already on Semantic Kernel or Microsoft's AutoGen** — there is no real choice, only move now or move later. The SK window runs to roughly April 2027 and the migration assistants exist today.
- **Primarily on Azure, and a .NET team** — MAF is the default answer in that ecosystem; the .NET side never had many credible agent frameworks anyway.
- **A Python team not on Azure** — there is no compelling reason it has to be this one. What you are really comparing is MAF against something like LangGraph, not MAF against nothing.
- **Looking for AutoGen's multi-agent patterns** — first work out which line you mean. Sequential, handoff, group chat, and Magentic-One all came across into MAF; but if your existing code is AG2, that is a different project, and moving to MAF is a framework switch, not an upgrade.

## Overall

The most instructive thing about MAF is not its feature list. It is that it demonstrates **the standard way a large vendor collapses its own competing projects**: merge them, attach a date, ship migration assistants, and put every new feature behind the survivor. From a selection standpoint that is good news — it answers "which side do I bet on" for you, at the cost of having to act inside the window.

The genuinely awkward part is the name left behind. AutoGen is now simultaneously a frozen Microsoft package, an active community project, and a PyPI name that resolves to the latter. Check the year and the owner before deciding whether to trust the tutorial in front of you.

## References

- [Microsoft Agent Framework Version 1.0 announcement](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/)
- [Microsoft Agent Framework Overview (Microsoft Learn)](https://learn.microsoft.com/en-us/agent-framework/overview/)
- [Semantic Kernel migration guide](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel/)
- [Semantic Kernel and Microsoft Agent Framework (support timeline)](https://devblogs.microsoft.com/agent-framework/semantic-kernel-and-microsoft-agent-framework/)
- [Microsoft Agent Framework Reaches Release Candidate](https://devblogs.microsoft.com/foundry/microsoft-agent-framework-reaches-release-candidate/)
- [microsoft/agent-framework (GitHub)](https://github.com/microsoft/agent-framework)
- [ag2ai/ag2 (GitHub)](https://github.com/ag2ai/ag2)
- On this site: [LangGraph: Managing Agent Workflows with Graphs](/posts/ai/2026-03-27-langgraph-agent-orchestration-en), [MCP (Model Context Protocol)](/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration-en)
