---
title: "Cohere North: Cohere's First Agentic Coding Family"
date: 2026-10-10
category: tech
type: deep-dive
tags: [cohere, north, agentic-coding, sparse-moe, programming]
lang: en
tldr: "Cohere's North series marks its first agentic coding model family. North Mini Code (30B total / 3B active sparse MoE) is purpose-built for code generation and automated development, with 256K context and free access via OpenRouter as `north-mini-code:free`."
description: "Deep dive into Cohere North's design philosophy, architecture, differences from the Command series, and how to use the free tier for coding tasks."
draft: true
---

> 🌏 [中文版](/posts/tech/2026-10-10-ai-model-family-cohere-north)

[Cohere](https://cohere.com/)'s **North** series, launched in 2026, marks a major strategic shift from "RAG / embeddings / general conversation" to **Agentic Coding**. **North Mini Code** is the family's first public model: a 30B total / 3B active parameter sparse MoE designed for code generation, testing, and automated development. It is available for free on OpenRouter as `cohere/north-mini-code:free`, giving developers direct access to Cohere's coding agent capabilities.

---

## Background: from RAG to Agentic Coding

Cohere originally held a significant share of the enterprise RAG market with the Command series (Command R, Command R+, Command A) and the Embed series. But the 2026 strategic pivot is clear: **no longer just "providing models," but providing "executable coding agents."** The North series is the productized proof of that pivot.

| Cohere series | Primary positioning | Representative models |
|---|---|---|
| **Command / Embed** | RAG, embeddings, general conversation | Command A, Embed v3 |
| **North** (new) | Agentic Coding | **North Mini Code** (30B/3B sparse MoE) |

---

## North Mini Code: core specifications

| Item | Specification |
|---|---|
| **Model name** | North Mini Code |
| **Trainer** | **Cohere** |
| **Architecture** | Sparse Mixture-of-Experts |
| **Parameters** | 30B total / 3B active |
| **Context** | 256,000 tokens |
| **License / access** | OpenRouter `:free` (`cohere/north-mini-code:free`) |
| **Input modalities** | Text (code, natural language instructions, documentation) |
| **Output modalities** | Code, reasoning explanations, tool calls |

---

## Design philosophy

This section interprets the model positioning; its wording is not a verbatim statement from the vendor.

**"Coding is not generation, but a verifiable chain of operations."** Cohere's North series was designed from the ground up with the following assumptions:

- Code generation must be **executable**, not merely syntactically correct text
- Development agents need **multi-step tool chains**: read existing code → propose modifications → run tests → verify results → generate reports
- Code quality verification must be **built-in**: the model should be able to check for compilation errors, test failures, and logical inconsistencies on its own

North Mini Code's sparse MoE design lets it maintain the capacity of 30B total parameters with only 3B active, delivering low-latency coding responses suitable for interactive coding assistants and batch automated development pipelines.

---

## Core capabilities

The model generates text and tool-call requests. The host application must provide tools, execute requests, return results, and manage state, audit logs, and concurrency. Workflow examples below describe applications built around the model; a standalone chat request does not execute those workflows.

| Capability | Description |
|---|---|
| **Code generation** | Generates functions, classes, and test cases across multiple languages (Python, TypeScript, Go, Java, etc.) |
| **Automated testing** | Generates unit tests based on code structure, then executes tests and analyzes results |
| **Refactoring & optimization** | Refactors existing code per instructions, optimizing performance, readability, and security |
| **Documentation & explanation** | Generates docstrings, READMEs, and API documentation |
| **Cross-file reasoning** | Analyzes dependencies across multiple files simultaneously within 256K context, enabling cross-file modifications |

---

## Differences from the Cohere Command series

| Aspect | Command series | North series |
|---|---|---|
| **Positioning** | General conversation, RAG, enterprise knowledge | Agentic Coding |
| **Architecture** | Dense / standard Transformer | Sparse MoE |
| **Context** | 128K–200K | 256K |
| **Unique strengths** | Long-document understanding, embedding search | Coding agents, tool chains, verifiable output |
| **Free tier** | Some Command models have trial credits | `north-mini-code:free` directly available |

---

## Ideal use cases

| Use case | Description |
|---|---|
| **Interactive coding assistant** | Developers get real-time coding suggestions, refactoring, and test generation in the IDE |
| **Batch automated development** | Automated test generation, legacy code refactoring, documentation updates |
| **Code review & security** | Automated security vulnerability detection, dependency freshness checks, code quality analysis |
| **Education & learning** | Learning programming languages, understanding existing codebase structure |

---

## Limitations and caveats

- **Coding-focused, not general conversation**: North Mini Code underperforms Command / other general models on general chat, creative writing, and mathematical reasoning
- **Free endpoint volatility**: OpenRouter `:free` has queue limits; production environments should upgrade to Cohere's paid endpoints
- **Privacy**: OpenRouter free endpoints may collect prompts; for sensitive code, use Cohere's official platform

---

## References

- [Cohere official](https://cohere.com/)
- [Cohere North Mini Code on OpenRouter](https://openrouter.ai/cohere/north-mini-code:free)
- [OpenRouter Cohere model documentation](https://openrouter.ai/docs/models/cohere/north-mini-code)
- [Cohere North series announcement](https://cohere.com/blog/north-series)

---

## Related posts

- [OpenRouter: Unified API](https://openrouter.ai/)
- [Cohere Command series introduction](https://cohere.com/blog/command-r-plus)
- [LLM inference free-tier comparison](https://opencode.ai/docs/zen/)

---

*Last updated: 2026-10-10. Cohere North is a new series; specs and free-tier policies may change with version updates. Always refer to official documentation.*
