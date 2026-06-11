---
title: "Context Engineering: Why Your AI Agent's Problem Is Information, Not the Model"
date: 2026-03-24
type: guide
category: ai
tags: [context-engineering, prompt-engineering, ai-agent, rag, memory, agentic-ai]
lang: en
tldr: "Context Engineering is the core concept that replaced Prompt Engineering in 2025: the focus shifted from 'how to ask' to 'what information to provide.' Delivering the right information at the right time into the context window is more effective than upgrading to a stronger model. This post covers the definition, four key strategies, practical techniques, and common failure modes."
description: "An in-depth look at Context Engineering — its definition, origins, core strategies (Write, Select, Compress, Isolate), and practical advice from Anthropic, LangChain, Karpathy, and others."
draft: false
series:
  name: "AI Agent 實戰"
  order: 1
---

> 🌏 [中文版](/posts/ai/2026-03-24-context-engineering-guide)

In mid-2025, the AI engineering community collectively adopted a new term.

Shopify CEO Tobi Lütke fired the first shot:

> I really like the term 'context engineering' over prompt engineering. It describes the core skill better: the art of providing all the context for the task to be plausibly solvable by the LLM.

Three days later, Andrej Karpathy followed up:

> Context engineering is the delicate art and science of filling the context window with just the right information for the next step.

Simon Willison delivered the final blow: the "inferred definition" of prompt engineering has been understood by the public as "little tricks for chatting with a chatbot," whereas context engineering carries the right connotation — this is serious engineering.

The name changed, but the real point is: **the mental model changed.**

---

## From Prompt to Context: What's Actually Different

**Prompt Engineering** mental model: How to write a single good instruction so the model gives the best response. You're tuning **wording**.

**Context Engineering** mental model: How to construct an entire information environment at runtime so the model has sufficient background for decision-making. You're designing a **system**.

```
Prompt Engineering        Context Engineering
─────────────────        ──────────────────
A single instruction      An entire information environment
Static text               Dynamic assembly
One-shot call             Multi-turn loops
Manual word tuning        Architecture design
```

Prompt engineering is now a subset of context engineering — writing a good system prompt still matters, but in production-grade agent systems, the prompt occupies only a small fraction of the context window.

LangChain CEO Harrison Chase's diagnostic principle is straightforward:

> If your agent is behaving inconsistently, just ask one question — "Does the LLM have enough information and tools at the moment it's making this decision?" Nine times out of ten, the answer is no.

**Most agent failures are context failures, not model failures.**

---

## What Goes Into the Context Window

An agent's context window at any given point looks roughly like this:

```
┌──────────────────────────────────────────────┐
│               Context Window                  │
│                                              │
│  ┌──────────────┐  ┌───────────────────────┐ │
│  │ System Prompt │  │ Tool Definitions      │ │
│  │ Role, rules,  │  │ Tool names, descriptions,│
│  │ output format │  │ parameter schemas     │ │
│  └──────────────┘  └───────────────────────┘ │
│                                              │
│  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Memory       │  │ RAG Results           │ │
│  │ Long-term    │  │ Relevant document     │ │
│  │ memory, user │  │ chunks retrieved from │ │
│  │ preferences  │  │ a knowledge base      │ │
│  └──────────────┘  └───────────────────────┘ │
│                                              │
│  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Conversation │  │ Task State            │ │
│  │ Chat history │  │ Progress, intermediate│ │
│  │              │  │ results, scratchpad   │ │
│  └──────────────┘  └───────────────────────┘ │
│                                              │
│  ┌──────────────┐  ┌───────────────────────┐ │
│  │ Few-shot     │  │ Environment           │ │
│  │ Examples     │  │ Current time, user    │ │
│  │              │  │ info, filesystem state │ │
│  └──────────────┘  └───────────────────────┘ │
└──────────────────────────────────────────────┘
```

Every block involves engineering decisions: How much to include? When to include it? Which version? When over budget, what gets cut first?

---

## Four Key Strategies: Write, Select, Compress, Isolate

LangChain organized context engineering into four operations:

### 1. Write — Store Information Outside the Context Window

Not all information needs to be in the context at all times. Store it first, pull it in when needed.

**Scratchpad**
The agent takes notes during execution. For example, Claude Code's `TodoWrite` is a form of scratchpad — the agent records task progress so subsequent steps can reference it.

**Memory**
Persistent memory across sessions. Three types:
- **Episodic**: Things that happened ("The user requested JSON format last time")
- **Semantic**: Factual knowledge ("This project uses TypeScript + Hono")
- **Procedural**: How to do things ("The deployment flow is build -> test -> push")

Key principle: **Write is deferred Select.** What you store now is meant to be precisely retrieved into context at some future moment.

### 2. Select — Pull the Right Information Into the Context Window

From all available information sources, pick what's most relevant right now.

**Select from Memory**
Use embedding search to find relevant historical memories and inject them into context. Don't stuff all memories in — only select what's relevant to the current task.

**Select from Tools**
When you have 50 tools, you don't need to stuff all 50 tool definitions into context every time. You can use RAG to perform semantic search over tool descriptions and mount only the relevant ones.

**Select from Knowledge Bases**
This is the core of RAG — retrieving relevant document chunks from vector databases and knowledge graphs based on a query.

**Hybrid Strategy**
The most effective approach is usually "pre-loading + runtime exploration":
- Pre-loading: Fixed context injected from the start (system prompt, core tools)
- Runtime exploration: Agent dynamically fetches on demand (RAG, memory retrieval, file reads)

### 3. Compress — Keep Only the Key Tokens

Context windows are finite. As conversations progress, accumulated tokens grow.

**Summary Compression**
Claude Code's approach: when context usage hits 95%, automatically trigger compression, summarizing old conversation history into a shorter version. Architectural decisions and unresolved issues are preserved; redundant tool outputs are discarded.

**Pruning Rules**
Hard-coded trimming rules — for example, keeping only the most recent N conversation turns, or deleting full tool call outputs and keeping only summaries.

**Why Does Compression Matter?**
Anthropic points out a counterintuitive phenomenon: longer context doesn't necessarily mean better quality. The LLM's attention mechanism is O(n^2) — each additional token must compute relevance against all other tokens. **Attention has a budget**, and irrelevant tokens dilute focus on important information.

> Find the smallest set of high-signal tokens that maximize likelihood of desired outcome.
> — Anthropic

### 4. Isolate — Separate Context Into Different Spaces

When one context window can't hold everything, or different tasks need different context, split them up.

**Multi-agent Isolation**
The primary agent delegates subtasks to sub-agents. Each sub-agent has its own clean context window, focused on a single task, and returns only a concise summary (1,000-2,000 tokens) to the primary agent upon completion.

**Sandbox Isolation**
Code execution runs in a sandbox (E2B, Docker), with results returned in structured format rather than stuffing the entire execution environment into context.

**State Schema Isolation**
LangGraph's approach: use typed state fields to separately manage different types of context, injecting specific state only at the nodes that need it.

---

## Anthropic's Practical Recommendations

Anthropic published [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), proposing several battle-tested principles:

### Structure Your System Prompt

Don't write one big block of natural language. Use XML tags or Markdown headers to create clearly delineated sections:

```markdown
## Role
You are a senior full-stack engineer...

## Behavioral Rules
- Read the full contents of a file before modifying it
- When uncertain, ask the user instead of guessing
- ...

## Output Format
Responses include: conclusion, code, caveats

## Tool Usage Guidelines
- Use Glob for file search, not find
- Use Read for file reading, not cat
```

The key is "right altitude" — specific enough to guide behavior, yet flexible enough to leave room for the agent's judgment. Avoid writing exhaustive if-else rules.

### Tool Design Is Context Engineering

A tool's name, description, and parameter schema are all part of the context. Design principles:

- **Self-contained**: Each tool's description should be sufficient for the agent to know "when to use it" and "how to use it"
- **Minimal overlap**: Tools shouldn't have overlapping functionality, or the agent will choose wrong
- **Error-friendly**: Return clear error messages so the agent can self-correct
- **Quantity restraint**: More than 20 tools noticeably increases selection error rates

### Just-In-Time Loading

Don't pre-stuff everything the agent might need. Keep lightweight pointers (file paths, URLs, query strings) and let the agent pull information when needed.

```
❌ Stuff the entire API documentation into the system prompt
✅ Tell the agent where the docs are and let it query with tools
```

This is **progressive disclosure** — let the agent explore autonomously like a developer, rather than information-bombing it from the start.

### Let the Agent Take Notes

For long-running tasks, have the agent maintain structured external notes:

```
project/
├── progress.txt      # Current progress and next steps
├── decisions.md      # Important architectural decisions and rationale
└── context.json      # Accumulated context
```

This aligns with the `claude-progress.txt` approach in [Anthropic's Harness Design](/posts/ai/2026-03-28-anthropic-harness-design) — externalizing state to the filesystem.

---

## Six Types of Context

Here's a taxonomy of the information inside a context window:

| Type | Description | Examples |
|------|-------------|----------|
| **Instructional** | Rules and constraints | System prompt, behavioral guidelines |
| **Dynamic** | Real-time information | Current time, user input, API responses |
| **Historical** | Historical records | Conversation history, previous decisions |
| **Retrieval-based** | Retrieved results | RAG document chunks, knowledge base |
| **Environmental** | Environment state | Tool definitions, filesystem, available APIs |
| **Exemplary** | Demonstrations | Few-shot examples |

Each type requires a different management strategy: Instructional is relatively static, Dynamic updates every time, Historical needs periodic compression, and Retrieval-based depends on search quality.

---

## Common Failure Modes

| Failure Mode | Symptoms | Fix |
|-------------|----------|-----|
| **Context Overload** | Agent ignores important instructions, response quality degrades | Compress, isolate, JIT loading |
| **Context Starvation** | Agent lacks background, repeatedly asks for known information | Add memory, improve RAG |
| **Context Noise** | Retrieves documents but they're irrelevant, reasoning drifts | Reranking, metadata filtering |
| **Context Conflict** | Multiple sources contradict each other | Label sources and credibility, prioritize |
| **Context Staleness** | Decisions made on outdated information | Timestamp mechanisms, periodic updates |
| **Vague Tool Descriptions** | Agent doesn't know when to use which tool | Rewrite tool descriptions, add examples |
| **Missing Memory** | Every conversation starts from scratch | Add episodic memory |

The most common anti-pattern is "Context Overload" — the intuition that "more information is always better," but in reality irrelevant tokens dilute attention and degrade overall quality. **Less is more; precision is power.**

---

## Relationship to the Three-Phase Evolution

Context Engineering sits at a pivotal position in the [three evolutionary phases of AI engineering](/posts/ai/2026-03-28-harness-engineering-evolution):

```
Phase 1: Prompt Engineering (2022-2024)
   └─ Optimize "how to ask"
   └─ Problem: Model doesn't understand → rephrase

Phase 2: Context Engineering (2025)    ← You are here
   └─ Optimize "what information to provide"
   └─ Problem: Model lacks information → supply relevant knowledge

Phase 3: Harness Engineering (2026)
   └─ Optimize "the entire execution environment"
   └─ Problem: Model loses control over time → design constraints and feedback systems
```

Context Engineering is the foundation of Harness Engineering. You can have the most sophisticated harness architecture, but if the context quality at each step is poor, every decision the agent makes will drift.

---

## Implementation Checklist

If you're building an agent system, check in this order:

1. **Is your system prompt structured?** Use sections to organize — don't write stream-of-consciousness
2. **Are tool descriptions clear enough?** Each tool's "when to use" and "how to use" should be explicit
3. **Do you have a memory mechanism?** At minimum a cross-turn scratchpad; ideally cross-session long-term memory
4. **How's your RAG retrieval quality?** Do you have reranking? Is chunk size reasonable?
5. **Do you have a compression strategy?** Long conversations won't blow out the context window?
6. **Do you have isolation mechanisms?** Complex tasks have sub-agents to share the load?
7. **Is your token budget managed?** Reserve enough space for generation (at least 30%)
8. **Do you have JIT loading?** You're not stuffing everything in from the start?

---

## The Big Picture

Context Engineering isn't a trendy name swap — it's a mental model upgrade.

Prompt engineering taught you to write a good sentence. Context engineering asks you to design an entire information system — where information comes from, when it enters the context, what format it takes, and when it should be compressed or discarded.

Karpathy's analogy nails it: the LLM is the CPU, the context window is RAM. You wouldn't load everything from the hard drive into memory — you carefully manage what gets loaded and when. Context engineering is the art of that memory management.

If your agent is performing inconsistently, don't rush to swap models. Look back at what was actually in the context window at the moment it made that decision — the answer is almost always right there.

---

## Further Reading

- [The Three Core Pillars of AI Agents: Context, Cognition, Action](/posts/ai/2026-03-17-ai-agents-context-cognition-action) — The role of context in agent architecture
- [From Prompt to Harness: The Three Evolutionary Phases of AI Engineering](/posts/ai/2026-03-28-harness-engineering-evolution) — Where Context Engineering fits in the evolution
- [Anthropic's Harness Design: Making AI Agents Work Like Engineers](/posts/ai/2026-03-28-anthropic-harness-design) — Anthropic's context persistence implementation
- [Andrej Karpathy on Context Engineering](https://x.com/karpathy/status/1937902205765607626) — The original tweet
- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — The full version of the four strategies
- [Anthropic — Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Implementation guide
- [Simon Willison — Context Engineering](https://simonwillison.net/2025/jun/27/context-engineering/) — Why this name is better than prompt engineering
- [Prompting Guide — Context Engineering Guide](https://www.promptingguide.ai/guides/context-engineering-guide) — Systematic tutorial

## References

- [Anthropic — Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic engineering blog on managing context as a finite resource: compaction, note-taking, and sub-agent architecture implementation guide
- [LangChain — Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — LangChain's complete analysis of the Write/Select/Compress/Isolate strategies and LangGraph integration
- [Simon Willison — Context Engineering](https://simonwillison.net/2025/jun/27/context-engineering/) — Explains why context engineering more accurately describes the essence of modern AI engineering than prompt engineering
- [MemGPT: Towards LLMs as Operating Systems](https://arxiv.org/abs/2310.08560) — Packer et al. (2023), analogizing LLM memory management to OS virtual memory, with a concrete implementation of the context window as RAM
- [Agentic Retrieval-Augmented Generation: A Survey on Agentic RAG](https://arxiv.org/abs/2501.09136) — Singh et al. (2025), a comprehensive survey of context management and memory architectures in Agentic RAG
- [Retrieval-Augmented Generation for Large Language Models: A Survey](https://arxiv.org/abs/2312.10997) — Gao et al. (2024), the complete technical background on RAG as a context selection strategy
- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) — Yao et al. (2023), the pioneering framework for interleaving reasoning and action within the context window
