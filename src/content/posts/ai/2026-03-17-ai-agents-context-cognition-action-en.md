---
title: "The Three Core Pillars of AI Agents: Context, Cognition, Action"
date: 2026-03-17
type: guide
category: ai
tags: [ai-agent, context-engineering, llm, reasoning, ReAct, agentic-ai, memory, mcp]
lang: en
tldr: "An AI agent is not a black box — it is built from three layers: what it knows (Context), how it thinks (Cognition), and what it can do (Action). Understanding these three layers is the key to grasping why agents are sometimes brilliant and sometimes go off the rails, and how to design a truly effective agent system."
description: "A deep dive into the three core pillars of AI agents: Context (situation management), Cognition (reasoning and planning), and Action (execution), covering context engineering, memory architecture, ReAct/ToT reasoning frameworks, MCP tool protocol, and other implementation details."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-17-ai-agents-context-cognition-action)

From ChatGPT to Claude, from GitHub Copilot to automated workflows, the term "AI agent" has become ubiquitous. But most people's understanding stops at "an AI that can do things for me," with little insight into how it actually works.

This vague understanding is barely enough for casual use, but once you try to **seriously build** or **deeply use** AI agents, you hit all kinds of inexplicable walls: Why can't the agent remember what was said last time? Why does it lose its way in the middle of complex tasks? Why does it have tools but not know how to use them?

The answers to these questions can almost always be traced back to a single framework.

According to Velu Sankaran's analysis, a true AI agent rests on three pillars: **Context**, **Cognition**, and **Action**. This isn't a metaphor — it's architecture. Each layer has its own responsibilities, its own engineering challenges, and its own failure modes.

This article aims to do one thing: take each layer apart and examine it clearly.

---

## Context: The Agent's Working Memory

### The LLM Is the CPU, the Context Window Is RAM

Andrej Karpathy offers a precise analogy: think of a large language model as a new kind of operating system, where the model itself is the CPU and the **context window is RAM** — it is the agent's only working memory.

This analogy has several important implications:

**Memory has a ceiling.** Even the largest models today don't have unlimited context windows. 100K or 200K tokens sounds like a lot, but once you pack in tool definitions, system instructions, conversation history, RAG results, and task state, you'll find it gets consumed much faster than expected.

**Every session starts from scratch.** LLMs have no persistent memory across conversations. When a conversation ends, everything resets. Whatever you told the agent yesterday about your preferred format or project background — it remembers none of it, unless you tell it again in the next conversation or an external memory system retains it.

**What goes in directly affects what comes out.** The quality of the context directly determines the quality of reasoning. This isn't just "more information is better" — it's about **the right information**. Irrelevant information dilutes attention; incorrect information leads to incorrect reasoning.

### Context Engineering: The Most Important Engineering Skill of 2025

This is why **Context Engineering** suddenly became a hot topic in 2025.

Karpathy's definition:

> Context engineering is the delicate art and science of filling the context window with just the right information for the next step.

LangChain put it more bluntly: Context engineering is the top priority for agent engineers — if your agent performs inconsistently, the problem is almost certainly in the context design, not the model itself.

**What does the context contain?**

```
┌─────────────────────────────────────────┐
│              Context Window             │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ System      │  │ Tool Definitions │  │
│  │ Instructions│  │ (what agent can  │  │
│  │             │  │  do & how)       │  │
│  └─────────────┘  └──────────────────┘  │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ Memory      │  │ RAG Results      │  │
│  │ (retrieved  │  │ (relevant chunks │  │
│  │  history)   │  │  from knowledge) │  │
│  └─────────────┘  └──────────────────┘  │
│                                         │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │ Current     │  │ Task State       │  │
│  │ Conversation│  │ (progress, vars) │  │
│  └─────────────┘  └──────────────────┘  │
└─────────────────────────────────────────┘
```

Every block involves engineering decisions: How much to include? Which version? How to compress? How to update?

### Memory Systems: From Short-Term to Long-Term

The "memory" component within context is one of the most complex engineering challenges in modern agent systems.

Drawing from human cognitive science, agent memory is typically divided into four categories:

**Working Memory**
This is the context window itself. Limited in capacity, it vanishes when the conversation ends. The agent's current reasoning state, the task steps being executed, the results just returned by tools — all of these live here.

**Episodic Memory**
Records specific events that have occurred: "Last Wednesday the user said they don't like bullet point formatting," "Yesterday this API returned a 404." This type of memory is usually implemented with a vector database, retrieving relevant past experiences through semantic similarity and injecting them into the context when needed.

**Semantic Memory**
Stores structured factual knowledge: definitions of domain terminology, business rules, world knowledge. This type of memory is relatively stable and doesn't expire as easily as episodic memory. It's typically implemented with knowledge graphs or structured databases.

**Procedural Memory**
Knowledge about "how to do something": how to call a specific API, how to handle a particular type of error, the standard steps for executing a given workflow. This type of memory is sometimes embedded directly in the system prompt, sometimes provided as few-shot examples.

As of 2025, the most mature long-term memory solution is **Mem0**, which combines episodic and semantic memory to help agents maintain consistent "memory" across conversations and sessions.

### Why Context Is the Agent's Lifeline

If context is poor, the other two pillars won't matter no matter how strong they are.

A common failure case: the agent receives tool definitions with vague descriptions, so it doesn't know when to use which tool; or RAG returns chunks that are only superficially related to the question, causing reasoning to go astray; or there's no memory mechanism, so the agent has to re-learn the user's preferences and background from scratch every time.

Good context engineering looks like this: every token in the context window has a reason to be there and directly contributes to the current task.

---

## Cognition: How the Agent Thinks

Once the agent has information, what does it do? **Reason.**

Cognition is the bridge between context and action — it determines how the agent analyzes problems, formulates plans, and decides on next steps. This is the key differentiator that transforms an agent from "a chatbot that can answer questions" into "an autonomous problem-solving agent."

### ReAct: The Most Widely Used Reasoning Framework

**ReAct (Reason + Act)** is currently the most widely used reasoning framework for LLM agents, proposed by Yao et al. in 2023.

Its logical structure is as follows:

```
Thought: Analyze the current situation, decide on the next step
Action: Call a tool or perform an operation
Observation: Observe the result returned by the tool
Thought: Adjust reasoning based on the result...
Action: ...
(Loop until the task is complete)
```

A concrete example — if you ask a ReAct agent to "check tomorrow's weather in Taipei and suggest what to wear based on the weather":

```
Thought: I need to first check tomorrow's weather in Taipei.
Action: search("Taipei tomorrow weather")
Observation: Tomorrow in Taipei, temperature 18-24°C, 60% chance of afternoon thunderstorms.

Thought: It will be cool with rain, so I should suggest bringing an umbrella and wearing a light jacket.
Action: respond("Tomorrow in Taipei there will be afternoon rain, I suggest wearing a light jacket and bringing an umbrella...")
```

ReAct's advantage is **strong adaptability** — because it observes environmental feedback at every step, if a tool returns an unexpected result, the next Thought can immediately adjust the strategy. It's particularly suited for tasks where "the path is unclear and requires course correction along the way."

The downside is lower efficiency for long tasks, since each step requires one LLM inference call.

### More Advanced Reasoning Frameworks

**Tree of Thoughts (ToT)**

ToT expands reasoning steps into a tree structure, allowing the agent to explore multiple possible paths simultaneously and then evaluate which path is most promising.

```
             Problem
            /    \
         Path A   Path B
        /    \      \
      A1      A2    B1
    (good)  (dead end) (best)
```

This approach mimics how humans "brainstorm" when solving complex problems. It's suited for creative problems or those with multiple viable solutions, but the computational cost is much higher since it needs to maintain multiple reasoning trees.

**Plan-and-Execute**

Splits the task into two phases: first a Planner creates a complete plan of all steps, then an Executor carries them out one by one.

```
Phase 1 - Planning:
  Task: "Write a market analysis report for me"
  Plan:
    1. Gather competitor information
    2. Analyze market size data
    3. Compile user research results
    4. Draft the report framework
    5. Fill in each chapter's content

Phase 2 - Execution:
  Execute the above steps sequentially...
```

Plan-and-Execute's advantage is clear structure and predictability, making it suitable for scenarios with well-defined task steps. The downside is less flexibility — if something unexpected occurs mid-execution, the cost of going back to modify the plan is high.

**Framework Comparison**

| Framework | Best For | Strengths | Weaknesses |
|-----------|----------|-----------|------------|
| ReAct | Exploratory tasks, unclear paths | Strong adaptability | Low efficiency for long tasks |
| Tree of Thoughts | Multi-solution problems, creative tasks | Comprehensive exploration | High computational cost |
| Plan-and-Execute | Long tasks with clear steps | Clear structure | Low flexibility |
| ReWOO | Tasks with many tool calls | Fewer round trips | High cost of planning failure |

The trend after 2025 is **dynamic switching**: automatically selecting the reasoning mode based on task characteristics — using ReAct for step-by-step exploration when facing uncertainty, switching to Plan-and-Execute for structured long tasks.

### Self-Reflection and Error Correction

A more advanced cognitive capability is **Reflexion** — the ability for an agent, after a failed execution, to look back, reflect, and learn from its mistakes to adjust its strategy, rather than continuing to repeat the same errors.

This capability is crucial in real-world tasks. Whether an agent can self-correct essentially determines its upper bound on complex tasks.

---

## Action: The Agent's Impact on the World

Once it has thought things through, it needs to act.

Action is the interface through which the agent interacts with the external world, and the key to transforming it from a "thinking tool" into an "execution system." Without action capabilities, an agent is just a chatbot.

### The Full Landscape of Actions

**Information Retrieval**
- Search engine queries
- Database queries
- RAG knowledge base retrieval
- API calls (reading data)

**Computation and Processing**
- Code execution (Python sandbox, JavaScript runtime)
- Mathematical calculations
- Data transformation and analysis

**System Operations**
- File read/write
- Shell command execution
- Browser automation (Playwright, Puppeteer)
- Application control (RPA)

**External Services**
- Sending email / Slack messages
- Calling third-party APIs (calendar, CRM, payments)
- Triggering webhooks

**Agent Collaboration**
- Calling sub-agents (multi-agent architecture)
- Requesting human confirmation (human-in-the-loop)
- Exchanging information with other agents

### Model Context Protocol (MCP): A Unified Language for Tools

Previously, every agent system had to write its own integration logic for each tool — repetitive and fragile. **MCP (Model Context Protocol)** is an open standard launched by Anthropic in 2024, designed to solve this problem.

MCP's core concept is **standardizing tool definitions**:

```
┌──────────────────┐       MCP Protocol      ┌──────────────────┐
│   AI Agent       │ ◄──────────────────────► │   MCP Server     │
│   (Client)       │                          │   (Tool Provider)│
│                  │  1. Ask what tools exist  │                  │
│                  │ ──────────────────────►  │                  │
│                  │  2. Return tool def list  │                  │
│                  │ ◄──────────────────────  │                  │
│                  │  3. Call a specific tool  │                  │
│                  │ ──────────────────────►  │                  │
│                  │  4. Return exec result   │                  │
│                  │ ◄──────────────────────  │                  │
└──────────────────┘                          └──────────────────┘
```

The benefit of MCP is that developers only need to write an MCP Server once, and any agent that supports MCP can use that tool — whether it's Claude, GPT, or an open-source model. Tools and models are decoupled, dramatically reducing integration costs.

At the same time, tool definitions in MCP Servers also serve context engineering: clear tool descriptions enable the agent to choose the right tool at the right time, rather than guessing.

### Risk Management for Actions

The more powerful the action layer, the higher the cost of errors. Deleting a file, sending an email, submitting a transaction — these actions are irreversible.

Real-world agent systems typically employ several layers of safety mechanisms:

**Human-in-the-Loop (Collaborative Confirmation)**
For high-risk operations (data deletion, financial transactions, public content publishing), require user confirmation before execution.

**Action Whitelist**
Only allow the agent to use specific tool combinations. For example, a code review agent only needs file-reading tools, not file-writing tools.

**Sandboxed Execution**
Code execution runs in an isolated environment to avoid impacting the main system. This is why most code agents run inside Docker containers.

**Reversibility Check**
Evaluate whether an action is reversible before executing it. If it's irreversible, require a higher level of confirmation.

---

## How the Three Pillars Work Together

Putting all three layers together reveals the complete operational cycle of an AI agent:

```
                    ┌─────────────────────────────────────────┐
                    │              AI Agent Loop               │
                    │                                         │
                    │   ┌─────────┐                           │
  User/Environment  │   │ Context │  ← Memory, Tools, State   │
       ──────────►  │   └────┬────┘                           │
                    │        │                                │
                    │        ▼                                │
                    │   ┌─────────┐                           │
                    │   │Cognition│  ← Reason, Plan, Reflect  │
                    │   └────┬────┘                           │
                    │        │                                │
                    │        ▼                                │
                    │   ┌─────────┐                           │
                    │   │ Action  │  → Tools, APIs, Files     │──► World
                    │   └────┬────┘                           │
                    │        │                                │
                    │        └─── Observation ──► Context ───┘
                    │                  (feedback loop)        │
                    └─────────────────────────────────────────┘
```

These three pillars are not a linear pipeline but a continuous loop:
- The result of an Action (Observation) feeds back into Context
- The updated Context drives the next round of Cognition
- Cognition decides the next Action

Each cycle moves the agent one step closer to its task objective.

### Failure Modes When the Three Layers Are Imbalanced

Understanding this architecture enables rapid diagnosis of the root cause when an agent malfunctions:

| Symptom | Root Cause | Improvement |
|---------|-----------|-------------|
| Agent forgets what was said earlier | Context lacks a memory mechanism | Add episodic memory |
| Agent has tools but doesn't know how to use them | Tool descriptions in context are unclear | Improve tool definitions |
| Agent loses direction mid-way through complex tasks | Cognition lacks planning capability | Switch to Plan-and-Execute |
| Agent repeats the same mistakes | Cognition lacks self-reflection | Add a Reflexion mechanism |
| Agent wants to act but can't | Insufficient action tool set | Expand tools, connect MCP servers |
| Agent's actions cause side effects | Action layer lacks risk controls | Add human-in-the-loop |

---

## What This Means for Users and Engineers

### If You Are an Agent User

Understanding these three layers makes you more intentional when using AI agents:

- When an agent gives inaccurate answers, first ask yourself: did I provide enough **context**?
- When an agent can't solve a complex problem, its **reasoning** framework may not be suited to that type of task
- When an agent can think clearly but can't execute, it may be missing the right **tools**

This isn't just abstract understanding — it has practical implications. You can significantly improve result quality by supplementing context, choosing a more suitable agent, or asking it to think step by step.

### If You Are an Agent Builder

When designing agent systems, each layer involves corresponding technical decisions:

**Context Layer Decisions**
- Memory strategy: Use working memory only or add external long-term memory? Which vector database?
- RAG design: What retrieval strategy, chunk size, and reranking approach?
- Context compression: How to summarize conversation history? What information can be discarded?

**Cognition Layer Decisions**
- Reasoning framework: ReAct, ToT, Plan-and-Execute, or a hybrid?
- Model selection: How much reasoning capability is needed? How to trade off cost vs. capability?
- Self-reflection: Should the agent be able to self-correct?

**Action Layer Decisions**
- Tool set design: Which tools are needed? Use MCP or custom definitions?
- Security boundaries: Which operations require human confirmation? Which can be fully automated?
- Error handling: What's the fallback strategy when tools fail?

---

## The Big Picture

An AI agent is not a black box, nor is it "a smarter chatbot." It is three carefully designed layers operating in concert:

- **Context** determines what it knows — this is the quality of input
- **Cognition** determines how it thinks — this is the quality of reasoning
- **Action** determines what it can affect — this is the capability of output

If any one of these three layers breaks down, the agent's overall performance collapses. A truly good agent system gets all three layers right, making them mesh together like precision gears.

Another value of this framework: it makes you realize that an agent's "intelligence" isn't just about the model's inherent capability — it depends to a much greater extent on how you design its environment. An agent that is carefully fed the right context, equipped with a complete reasoning framework, and authorized with sufficient tools can far surpass the same model's performance in its default state.

**You're not just designing an AI — you're designing a complete cognitive environment.**

---

## References

- [The Three Pillars of AI Agents: Context, Cognition, and Action](https://medium.com/@v31u/the-three-pillars-of-ai-agents-context-cognition-and-action-5f75c4d8534f) — Velu Sankaran
- [Context Engineering for Agents](https://blog.langchain.com/context-engineering-for-agents/) — LangChain Blog
- [Andrej Karpathy on Context Engineering](https://x.com/karpathy/status/1937902205765607626) — Twitter/X
- [Context Engineering Guide](https://www.promptingguide.ai/guides/context-engineering-guide) — Prompt Engineering Guide
- [ReAct vs Plan-and-Execute: A Practical Comparison](https://dev.to/jamesli/react-vs-plan-and-execute-a-practical-comparison-of-llm-agent-patterns-4gh9) — DEV Community
- [What Is AI Agent Memory?](https://www.ibm.com/think/topics/ai-agent-memory) — IBM
- [A Visual Guide to LLM Agents](https://newsletter.maartengrootendorst.com/p/a-visual-guide-to-llm-agents) — Maarten Grootendorst
- [What is the Model Context Protocol (MCP)?](https://modelcontextprotocol.io/) — MCP Official Documentation
- [Agentic AI: Architectures, Taxonomies, and Evaluation](https://arxiv.org/html/2601.12560v1) — arXiv
- [Memory in the Age of AI Agents](https://arxiv.org/abs/2512.13564) — arXiv
