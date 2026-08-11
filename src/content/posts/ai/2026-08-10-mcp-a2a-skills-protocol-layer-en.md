---
title: "The Protocol Layer: MCP, A2A, ACP, Skills"
date: 2026-08-10
category: ai
type: deep-dive
tags: [mcp, agent-skills, ai-agent, tool-use, llm]
lang: en
series:
  name: "The Agent Production Line"
  order: 6
tldr: "MCP governs agent-to-tool, A2A governs agent-to-agent, Skills govern reusable knowledge. The test is whether the data changes: if it changes between calls you need MCP; if it's stable enough to write down, a skill file is simpler and has no runtime that can fail on its own."
description: "The full path from function calling to MCP and what it cost, MCP's five primitives including the direction-reversing Sampling, where A2A and ACP fit, and a five-dimension comparison of MCP against Agent Skills with a selection test."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer)

[Part 1](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en) placed MCP as "the standard interface for how an LLM uses tools" without elaborating. This part covers the protocol layer — what it solved, what it cost, and why Skills are not a competitor to MCP.

## From function calling to MCP: the path and the price

[Connecting LLMs to the Real World](https://blog.bytebytego.com/p/connecting-llms-to-the-real-world) tells this history most completely:

1. **Mid-2023**, function calling became a first-class feature of the OpenAI API — the model emits a structured intent to call something, the application executes it
2. **ChatGPT Plugins** tried to productize this, but **discovery was hard, quality was uneven, and the security model was immature**; they were retired entirely in April 2024
3. Every vendor defined its own schema, producing the **N×M problem**: N agents against M backends, every pair implemented separately
4. **MCP turned that into N+M**: agents implement a client once, backends implement a server once, and one protocol sits between
5. **Donated to the Agentic AI Foundation under the Linux Foundation** at the end of 2025

Steps 3 to 4 are the whole value. It is the same category of move as ODBC for databases or LSP for editors — not making any single integration better, but turning the *count* of integrations from multiplication into addition.

**The costs are real**, and there are two:

- **September 2025 brought the first supply-chain attack targeting MCP**: a package impersonating an official Postmark integration, quietly copying outgoing email. A widely adopted protocol is also a new, shared attack surface
- **Every tool definition consumes context.** This is easy to underrate — an agent with dozens of MCP servers attached can burn a meaningful part of its context budget before doing any work, and [Part 3](/posts/ai/2026-08-10-agent-context-memory-failure-en) explained that this has quality consequences, not just cost

Pinterest's handling is worth borrowing: **many small servers rather than one large one** (different servers need different access controls), plus a **central registry as the governance backbone** — only registered servers count as production-approved. The registry is a gate, not a phone book.

## MCP's five primitives

Most introductions stop at the Host / Client / Server roles, but the protocol defines five primitives across two sides.

**The server provides:**

- **Tools** — actions that can be invoked
- **Resources** — data that can be read
- **Prompts** — prewritten templates

**The client provides:**

- **Roots** — safe filesystem access boundaries
- **Sampling** — **the server asking the AI for help in return**, for example generating a database query

**Sampling's direction reversal is the notable one**: rather than the agent calling the server, the server calls back for model assistance. That lets a server handle steps requiring language understanding without shipping its own model, keeping cost and API keys on the client side. Most MCP write-ups skip it entirely.

## A2A and ACP: how agents talk to each other

MCP covers agent ↔ tool. Agent ↔ agent is a separate group of protocols:

| | Covers | Discovery |
|---|---|---|
| **MCP** | agent ↔ tools | server declares tools / resources / prompts |
| **A2A** | agent ↔ agent | **Agent Card**, published at a well-known URL |
| **ACP** | REST-first agent ↔ agent | **Agent Manifest**, plain HTTP |

A2A's flow is: discover peers via Agent Card → delegate a task → receive a structured result. If the peer needs more input mid-task it enters an **input-required** state and asks back. ACP took the REST route with synchronous responses or async SSE streaming, and **has since been folded into A2A**.

In production the two are complementary rather than competing: **MCP governs tool access, A2A governs communication between agents.**

## MCP vs Agent Skills: not the same problem

These two get compared constantly, but they solve different problems. Five dimensions:

| | MCP | Agent Skills |
|---|---|---|
| **Integration** | client-server protocol; N agents reach M backends through one interface | a folder plus `SKILL.md`, loaded when triggered |
| **Architecture** | separate process, own runtime, speaks JSON-RPC | just a directory: `SKILL.md` plus optional scripts / references / assets |
| **Invocation** | typed parameters, schema validation, composable | the agent reads `SKILL.md` and runs the bash / python / curl inside |
| **Runtime** | usually its own container or service | runs in the agent's own environment, no extra infrastructure |
| **Fits** | connecting to **live** systems and data | giving the agent **reusable knowledge and procedures** |

A comment thread offered a better test than the article body:

> If the data changes between calls, you need MCP (the agent needs live access). If the knowledge is stable enough to write down and still correct weeks later, a skill file is simpler and cheaper — **and it doesn't require a runtime that can fail independently of the agent**.

That last clause is the point. An MCP server is a separate process; it breaks on its own and needs its own deployment and monitoring. A markdown file does not.

The realistic answer is both: **skills tell the agent how to think, MCP gives it live data to think about.**

### A corollary for anyone maintaining skills

The Skills loading model exists precisely to fight context dilution: the agent first receives a **skills index containing only names and short descriptions**, and only after choosing one does the full `SKILL.md` load. This is the same idea as OpenAI's deferred tool discovery.

The implication is direct: **a `SKILL.md`'s `description` field should be written as a retrieval key, not as a comment.** It is the only part that enters the context before the skill is selected, so a vague description means the skill never gets selected.

LinkedIn goes further: they built a **skill registry** with similarity checking and human review to stop skills from proliferating. The direction is interesting too — moving from "application teams declare which skills they want" to "downstream systems declare which skills they provide, and applications discover them."

## Why screenshots and existing REST APIs aren't enough

The Figma piece offers the most concrete argument for "why build an MCP server instead of using what exists":

- **Screenshots alone** → the LLM has to **guess values from pixels**. It cannot tell 24px spacing from 20px, and the result "looks very similar but isn't the same"
- **The REST API alone** → returns complete JSON, and **it is too much data**. A single page produces thousands of lines stuffed with pixel coordinates, visual effects and internal layout rules

MCP's value is returning a **curated representation** in between. That is also a good test for whether a given system needs an MCP server at all: is the existing interface too coarse (guessing) or too fine (drowning)? If it is already about right, you don't need one.

## The series

1. [Drawing the Lines: Agent, Workflow, RAG, and MCP](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en)
2. [The Model Is a Component, the Harness Is the System](/posts/ai/2026-08-10-model-component-harness-system-en)
3. [Context and Memory: Where Agents Actually Fail](/posts/ai/2026-08-10-agent-context-memory-failure-en)
4. [Launch Is Where the Work Starts: Enterprise Cases Read Sideways](/posts/ai/2026-08-10-enterprise-agent-case-studies-en)
5. [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)
6. **The Protocol Layer: MCP, A2A, ACP, Skills** (this post)
7. [Three Shapes of RAG and the Evaluator Paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en)

## References

- [Model Context Protocol documentation](https://modelcontextprotocol.io/)
- [ByteByteGo — Connecting LLMs to the Real World: Tool Use, Function Calling, and MCP](https://blog.bytebytego.com/p/connecting-llms-to-the-real-world)
- [ByteByteGo — MCP vs A2A vs ACP: How AI Agents Actually Talk to Each Other](https://blog.bytebytego.com/p/mcp-vs-a2a-vs-acp-how-ai-agents-actually)
- [ByteByteGo — EP213: MCP vs Skills, Clearly Explained](https://blog.bytebytego.com/p/ep213-mcp-vs-skills-clearly-explained)
- [ByteByteGo — EP154: What is MCP?](https://blog.bytebytego.com/p/ep154-what-is-mcp)
- [ByteByteGo — Why Anthropic's MCP is a Big Deal](https://blog.bytebytego.com/p/why-anthropics-mcp-is-a-big-deal)
- [ByteByteGo — Figma Design to Code, Code to Design](https://blog.bytebytego.com/p/figma-design-to-code-code-to-design)
- [ByteByteGo — How Pinterest Built a Production MCP Ecosystem](https://blog.bytebytego.com/p/how-pinterest-built-a-production)
- [ByteByteGo — The Evolution of LinkedIn's Generative AI Tech Stack](https://blog.bytebytego.com/p/the-evolution-of-linkedins-generative)
