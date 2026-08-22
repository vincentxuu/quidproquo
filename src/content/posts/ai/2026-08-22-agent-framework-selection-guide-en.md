---
title: "Choosing an Agent Framework in 2026: LangGraph, CrewAI, MAF, AG2, Mastra, Pydantic AI, and DSPy"
date: 2026-08-22
category: ai
type: deep-dive
tags: [ai-agent, framework, orchestration, multi-agent, langgraph, pydantic-ai, dspy]
lang: en
tldr: "These seven tools are not one product category: LangGraph, MAF, and Mastra emphasize durable workflows; CrewAI and AG2 emphasize multi-agent collaboration; Pydantic AI emphasizes typed Python agents; DSPy optimizes AI programs against data and metrics. Choose the control model first."
description: "Compare seven 2026 agent frameworks by orchestration primitive, durable state, multi-agent model, typing, runtime, observability, and migration cost."
draft: true
---

> 🌏 [中文版](/posts/ai/2026-08-22-agent-framework-selection-guide)

These seven names often appear on the same “agent framework” list, but they solve different problems. [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) is a low-level orchestration runtime. [CrewAI](https://docs.crewai.com/) and [AG2](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/pattern-cookbook/overview/) start with multi-agent collaboration. [Microsoft Agent Framework](https://learn.microsoft.com/en-us/agent-framework/overview/) (MAF below) and [Mastra](https://mastra.ai/ai-workflows) combine agents with explicit workflows. [Pydantic AI](https://ai.pydantic.dev/agents/) starts from typed Python agents. [DSPy](https://dspy.ai/) treats prompts, tool use, and reasoning strategies as programs that can be optimized against data.

This is therefore not another framework popularity map. The site's existing [15 Agent Frameworks Worth Watching in 2026](/posts/ai/2026-04-01-agent-frameworks-2026-en) answers “what is available”; this article answers “which one fits this project,” without ranking by stars. API-level explanations of LangGraph, CrewAI, and MAF remain in their canonical [LangGraph](/posts/ai/2026-03-27-langgraph-agent-orchestration-en), [CrewAI](/posts/ai/2026-08-21-crewai-multi-agent-framework-en), and [MAF](/posts/ai/2026-08-21-microsoft-agent-framework-en) articles.

## First decide whether you need a framework

MAF's documentation gives a useful floor: “If you can write a function … do that instead.” A feature with one model call, a few tools, no resume requirement, and no cross-step state should begin as ordinary code. A framework earns its weight when it establishes shared boundaries for long-running execution, persistence, human approval, multi-role coordination, and observability.

Do one thing tonight: draw the process as boxes and arrows, then mark every point that may fail, pause, or require a human decision. If the drawing contains only one agent loop, start with a model SDK or a thin layer such as Pydantic AI. If a process restart must resume the same step, durable execution is a first-order requirement. If the real uncertainty is who should act next, examine CrewAI or AG2.

## Seven options on the same decision axes

| Option | Primary orchestration primitive | State and durability | Multi-agent model | Types and schemas | Language / runtime | Tracing and eval boundary |
|---|---|---|---|---|---|---|
| [LangGraph](https://docs.langchain.com/oss/python/langgraph/overview) | Graph of state, nodes, and edges | Checkpointers persist threads; stores retain cross-thread data | Subgraphs, handoffs, routers, or custom graphs | State schemas; node behavior remains code-controlled | Python, JavaScript | Framework owns execution; LangSmith is the adjacent platform |
| [CrewAI](https://docs.crewai.com/) | Agent, Task, Crew; Flow for explicit paths | Flows can persist state, pause, and resume | Sequential, hierarchical, and role delegation | Agents can use Pydantic structured outputs; roles remain mainly text-defined | Python | Open-source framework exposes tracing hooks; managed operations live in the platform |
| [MAF](https://learn.microsoft.com/en-us/agent-framework/overview/) | Agents, executors, edges, and graph workflows | Session state, checkpoints, human-in-the-loop | Sequential, concurrent, handoff, group chat, and other workflows | Type-safe routing and workflows | Python, .NET; verify Go capabilities individually | Middleware and telemetry are framework concerns |
| [AG2](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/pattern-cookbook/overview/) | Agent conversations, GroupChat, and handoffs | Conversation history and shared context; durable business state needs an explicit storage design | Group chat, nested chat, routing, and feedback loops | Tool parameters and structured output can use Pydantic | Python | Primarily logging and third-party integrations; eval is not the central orchestration primitive |
| [Mastra](https://mastra.ai/ai-workflows) | Typed steps with `.then()`, `.branch()`, `.parallel()`, and loops | Shared state; workflows suspend and resume | Agent networks or agents embedded in workflow steps | Step input and output schemas are first-class | TypeScript / Node.js | Tracing, scorers, datasets, and Studio share one ecosystem |
| [Pydantic AI](https://ai.pydantic.dev/agents/) | `Agent`, tools, dependencies, and typed outputs; a graph underneath | Agent history; durable execution through Temporal, DBOS, Prefect, Restate, and other integrations | Delegation, handoffs, or programmatic multi-agent patterns | `deps_type`, `output_type`, and Pydantic validation are central | Python | Logfire provides instrumentation; `pydantic-evals` is a separate package |
| [DSPy](https://dspy.ai/) | Signatures, Modules, and Optimizers; control flow is Python | Compiled programs can be saved, but DSPy is not a durable workflow runtime | ReAct and module composition can build agents; team orchestration is not the priority | Signatures declare typed inputs and outputs | Python | Metrics and optimizers are central; execution durability belongs elsewhere |

DSPy is the easiest row to misread. It can build agents and includes ReAct modules, but its distinctive value is not another handoff API. You define a metric and dataset, then let an optimizer tune instructions or demonstrations. If the workflow is stable while quality depends on manually tweaking prompts, DSPy may be more relevant than replacing the orchestrator. It can also live inside a LangGraph, MAF, or other runtime node.

## Choose by control model, not a feature checklist

### Explicit control over every path: LangGraph

LangGraph makes shared state, nodes, and edges its primary language. It fits systems where the model makes judgments but the application controls which paths exist. The official [persistence documentation](https://docs.langchain.com/oss/python/langgraph/persistence) separates thread checkpoints from cross-thread stores, so human approval, failure recovery, and long-term memory do not have to share one message list.

The cost is owning the state schema, node granularity, and checkpoint retention policy. A plain chatbot or fixed three-step pipeline may gain a handsome graph and an unnecessary execution model. Migration also becomes expensive once business rules are embedded across nodes, edges, and checkpoint namespaces, because the thing being moved is a state machine, not merely a model call.

### Describe a team first: CrewAI or AG2

CrewAI centers roles, tasks, and crews. If researcher, writer, and editor responsibilities are easier to describe in natural language than as a state graph, it can produce a multi-agent prototype quickly. Flow adds starts, listeners, routers, and persistent state when the route must become predictable. The canonical [CrewAI article](/posts/ai/2026-08-21-crewai-multi-agent-framework-en) covers its abstractions and limits in depth.

AG2 centers conversations. Its official pattern cookbook expresses routing, feedback loops, hierarchies, pipelines, and redundant execution through GroupChat collaboration. AG2 is a natural continuation for systems already organized around AutoGen-style `ConversableAgent`, message histories, and speaker selection. For replayable, versioned data workflows, however, a chat transcript is not automatically a business checkpoint; storage and idempotency still need explicit design.

Neither framework proves that multiple agents outperform one. Run the same task set through a single-agent and multi-agent version, then compare success rate, token cost, and latency. If role separation produces no measurable improvement, merge the roles again.

### Enterprise workflows and multiple language SDKs: MAF

MAF puts single agents, middleware, session state, telemetry, and graph workflows on one product surface. Its documentation explicitly separates open-ended tasks for agents from fixed processes requiring execution order for workflows. For teams already on .NET, Azure, Semantic Kernel, or Microsoft's AutoGen line, that integration boundary can matter more than an isolated API advantage.

This is also a migration decision. AG2 and Microsoft's current Agent Framework are separate projects, and the `autogen` package name is easy to misread; the canonical [MAF article](/posts/ai/2026-08-21-microsoft-agent-framework-en) covers the actual packages and support paths. MAF can run outside a Microsoft-only environment, but test a vertical slice against the target model, host, and telemetry backend instead of validating only the Azure happy path.

### A complete TypeScript product surface: Mastra

Mastra's advantage is not merely translating a Python framework into TypeScript. It puts typed workflows, agents, memory, MCP, tracing, and scorers in one TypeScript development loop. Workflow steps can chain, branch, run in parallel, loop, persist shared state, suspend, and resume. For Next.js, Node.js, or Cloudflare teams, avoiding another cross-language service is itself a significant architectural benefit.

The tradeoff is a broad framework surface. If all you need is one tool-calling agent, an existing AI SDK plus schema validation may be simpler than adopting storage, Studio, and deployment together. When testing lock-in, export traces, run the workflow against storage you control, and confirm that suspended state remains accessible without a proprietary UI.

### Python type boundaries first: Pydantic AI

Pydantic AI puts dependency and output types directly in an agent definition, then validates model output with Pydantic. It fits API backends, data services, and existing Pydantic codebases that need an agent with tools, dependency injection, and reliable schemas—not a multi-role organization chart.

For long-running execution, the official [durable execution](https://ai.pydantic.dev/durable_execution/) approach integrates Temporal, DBOS, Prefect, Restate, and related systems instead of inventing another scheduler. This makes it easier to join an existing platform, but deployment complexity now belongs to two layers. A team with no durable runtime should not treat a list of integrations as zero-configuration durability.

### Start with a metric, then optimize: DSPy

DSPy uses Signatures to declare inputs and outputs, Modules to select Predict, ChainOfThought, or ReAct behavior, and Optimizers to compile a program against a metric and training set. It fits teams that already have repeatable cases and know what a good answer means, but do not want to maintain prompt variants manually.

Without a dataset and metric, DSPy's main advantage cannot operate. It also does not replace checkpoints, human approval, scheduling, or cross-service retries. A practical first step is to rewrite one unstable classifier, extractor, or RAG node as a DSPy module, pass an offline evaluation, and then embed it back in the existing orchestrator.

## A decision sequence you can use directly

Start with the non-negotiable constraint:

1. **The primary runtime is TypeScript, and agents, workflows, traces, and evals should share one stack:** try Mastra first.
2. **The primary runtime is .NET, or the team is migrating from Semantic Kernel or Microsoft's AutoGen:** try MAF first.
3. **The project needs a recoverable explicit graph and can own a state machine:** try LangGraph first.
4. **Multi-agent work is fundamentally role division:** build the vertical slice in CrewAI.
5. **The existing mental model is conversation, speaker selection, and GroupChat:** examine AG2.
6. **A Python API prioritizes dependency types, output schemas, and validation:** try Pydantic AI.
7. **The workflow already exists; prompt and strategy quality are unstable:** try DSPy at that node.

“Try” does not mean finishing the quickstart. Run the same cases—including success, tool failure, human approval, and process restart—through each candidate. Save inputs, outputs, tokens, latency, and state. Compare which system makes a failure easiest to locate, resume, and migrate.

## Migration cost hides in three places

First is **state format**. Model providers are often replaceable; production checkpoints, message history, shared context, and memory namespaces become data contracts. Before adoption, export one complete run as intelligible JSON and verify that you can reconstruct it without the platform UI.

Second is **control flow**. LangGraph edges, CrewAI delegation, AG2 speaker selection, Mastra step chains, and DSPy compiled modules are different abstractions. Keep core business rules in ordinary functions and let the framework layer handle routing, state, and retries to preserve room for movement.

Third is **observability and evaluation**. Having traces does not imply quality evals; scoring final answers does not imply replayable failures. A selection proof of concept should answer: which tool call failed, what state existed at that point, whether execution can resume there, and whether the same cases regress after an upgrade.

## Overall

No framework wins every axis because the tools optimize different things. LangGraph optimizes explicit, durable graphs. CrewAI optimizes role-oriented division of labor. AG2 optimizes conversational collaboration. MAF optimizes a shared enterprise boundary for agents and workflows. Mastra optimizes an integrated TypeScript experience. Pydantic AI optimizes Python types and validation. DSPy optimizes AI program quality against a metric.

Write down what must survive failure, who decides the next step, and where the data contract lives. Then choose the framework whose control model matches those answers. If the answers are still unclear, build the baseline with ordinary functions first. That is usually cheaper than choosing a framework and reshaping the problem around it.

## References

- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview)
- [LangGraph persistence](https://docs.langchain.com/oss/python/langgraph/persistence)
- [CrewAI Documentation](https://docs.crewai.com/)
- [Microsoft Agent Framework overview](https://learn.microsoft.com/en-us/agent-framework/overview/)
- [AG2 Pattern Cookbook](https://docs.ag2.ai/latest/docs/user-guide/advanced-concepts/pattern-cookbook/overview/)
- [AG2 tools and structured outputs](https://docs.ag2.ai/latest/docs/user-guide/basic-concepts/introducing-tools/)
- [Mastra workflows](https://mastra.ai/ai-workflows)
- [Pydantic AI agents](https://ai.pydantic.dev/agents/)
- [Pydantic AI durable execution](https://ai.pydantic.dev/durable_execution/)
- [Pydantic Evals](https://ai.pydantic.dev/evals/)
- [DSPy documentation](https://dspy.ai/)
- [15 Agent Frameworks Worth Watching in 2026](/posts/ai/2026-04-01-agent-frameworks-2026-en)
- [LangGraph: Managing Agent Workflows with Graph Structures](/posts/ai/2026-03-27-langgraph-agent-orchestration-en)
- [CrewAI: Organizing Multi-Agent Collaboration Through Role-Playing](/posts/ai/2026-08-21-crewai-multi-agent-framework-en)
- [Microsoft Agent Framework: After the Merge, Who Does the Name AutoGen Point To?](/posts/ai/2026-08-21-microsoft-agent-framework-en)
