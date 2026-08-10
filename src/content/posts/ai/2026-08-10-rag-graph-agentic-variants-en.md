---
title: "Three Shapes of RAG and the Evaluator Paradox"
date: 2026-08-10
category: ai
type: deep-dive
tags: [rag, retrieval, ai-agent, agentic-ai, embedding]
lang: en
series:
  name: "Agent 生產線"
  order: 7
tldr: "Standard RAG gives a wrong answer when it retrieves the wrong chunk, and nothing in the system will notice. Agentic RAG adds a self-check, at the cost of the evaluator paradox: the ceiling on self-correction is whatever the evaluating LLM can judge about relevance."
description: "The mechanisms and trade-offs of Standard, Graph and Agentic RAG, the evaluator paradox and overcorrection, and how Perplexity, Dropbox, Uber and Yelp actually engineer retrieval."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-10-rag-graph-agentic-variants)

The last part of the series returns to retrieval. [Part 1](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en) gave the test — if the answer is in a document use RAG, if it requires acting on another system use an agent — but RAG has itself split into three shapes, and the third one moves the agent loop inside retrieval.

## Mechanisms and trade-offs

| | Mechanism | Trade-off |
|---|---|---|
| **Standard RAG** | query → embedding → top-K from a vector store → LLM generates | Fast and cheap, but **retrieve the wrong chunk and you get a wrong answer, with nothing in the system to notice** |
| **Graph RAG** | Classify the query first: specific questions take local search (vector lookup to find entities, then gather context along the knowledge graph); broad questions take global search (no vector search — load community reports in batches and have the LLM score and rank) | Expensive to build, slow to update. Suits legal, compliance and biomedical knowledge |
| **Agentic RAG** | A reasoning agent decomposes into sub-questions and selects sources → multi-source retrieval → **a second agent checks whether what came back actually answers the question, and re-retrieves if not** → synthesize | More capable and flexible, but slow, expensive and hard to debug. Suits problems needing multi-step reasoning and self-correction |

The second half of the Standard RAG row is the crux: **nothing will notice.** It cannot know it retrieved the wrong thing, because it has nothing to compare against. The generating LLM uses whatever it is handed, so a bad retrieval gets packaged into a fluent, cited, entirely plausible answer.

Agentic RAG exists to patch that hole by adding a checking step. But that step has a problem of its own.

## The evaluator paradox

Self-evaluation means **using one LLM call to supervise another LLM call**.

So the whole system has a ceiling on self-correction: **whatever the evaluating LLM can judge about whether a retrieval answers the question.** If it cannot tell, the extra round only costs time and money. This is not an implementation-quality issue; it is a ceiling inherent to the architecture.

There is a related failure mode called **overcorrection**: the agent discards retrieval results that were actually useful, goes looking for "something better," and ends up with a worse answer than the first attempt. Adding self-correction does not make things monotonically better.

Structurally this is the same as the memory thought experiment in [Part 3](/posts/ai/2026-08-10-agent-context-memory-failure-en) — a system that confidently evaluates itself can lose to one that knows it is uncertain.

## Four teams, four concrete practices

**[Perplexity](https://blog.bytebytego.com/p/how-perplexity-built-an-ai-google): a five-stage pipeline.** The piece also has a nice product-history detail — they were originally building English-to-database-query, and after ChatGPT launched they noticed the loudest complaint was **the lack of sources**, which their own prototype happened to solve. They **abandoned four months of existing work** and pivoted entirely to an answer engine.

**[Dropbox Dash](https://blog.bytebytego.com/p/how-dropbox-built-an-ai-product-dash): three difficulties in the data.** Variety (each format needs its own semantic extraction logic), fragmentation (spread across Gmail, Slack, Notion, Jira, **each with its own permission rules**), and multimodality. The second is the most underrated — cross-system retrieval is not just wiring up APIs; you have to apply each source's permission model correctly at retrieval time, or you get exactly the kind of leak described in [Part 5](/posts/ai/2026-08-10-agent-security-harness-layer-en).

**[Uber Finch](https://blog.bytebytego.com/p/how-uber-built-a-conversational-ai): single-table data marts to avoid joins.** Rather than asking an LLM to generate complex multi-table queries, pre-flatten the data. They also **use OpenSearch as a semantic layer holding natural-language aliases for both column names and column values** — when a user says "cancellations last month," the system needs to know which column and which value that maps to.

**[Yelp](https://blog.bytebytego.com/p/how-yelp-built-yelp-assistant): citations need parsing and verification, two steps.** The model emits markers like `[S1][S3]`, which are first parsed back to their original sources, and then **each marker is verified to correspond to genuinely retrievable content**. Skip the second step and you get answers that appear cited but whose citations point at nothing — worse than no citations, because they are more convincing.

## Knowing whether retrieval is broken

Different components need different evaluation, and conflating them hides problems:

| Target | Primary approach |
|---|---|
| **LLM** | Judge the final answer (LLM-as-judge) |
| **RAG** | **Evaluate retrieval and generation separately** — "retrieval was right but generation was wrong" and "retrieval was already wrong" are two different problems |
| **Coding agent** | Mostly running tests (code-based) |
| **Multi-agent** | Evaluate coordination and role adherence; mix code tests, LLM judging and human review |

The summary line is a good one: **"every additional component in the pipeline is one more place to go wrong, and one more thing your evals have to catch."** Read in reverse, that is also a selection criterion — if your evals cannot catch the failure modes that Graph RAG or Agentic RAG add, the extra complexity only makes debugging harder without making answers better.

Back to the test from the start of the series: in most cases, **getting Standard RAG's retrieval quality right pays better than upgrading to a more elaborate variant**. Anthropic said the same thing in *Building Effective Agents* — for many applications, optimizing single LLM calls with retrieval and in-context examples is usually enough.

## The series

1. [Drawing the Lines: Agent, Workflow, RAG, and MCP](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en)
2. [The Model Is a Component, the Harness Is the System](/posts/ai/2026-08-10-model-component-harness-system-en)
3. [Context and Memory: Where Agents Actually Fail](/posts/ai/2026-08-10-agent-context-memory-failure-en)
4. [Launch Is Where the Work Starts: Enterprise Cases Read Sideways](/posts/ai/2026-08-10-enterprise-agent-case-studies-en)
5. [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)
6. [The Protocol Layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en)
7. **Three Shapes of RAG and the Evaluator Paradox** (this post)

## References

- [ByteByteGo — EP220: RAG vs Graph RAG vs Agentic RAG](https://blog.bytebytego.com/p/ep220-rag-vs-graph-rag-vs-agentic)
- [ByteByteGo — How Agentic RAG Works?](https://blog.bytebytego.com/p/how-agentic-rag-works)
- [ByteByteGo — How Perplexity Built an AI Google](https://blog.bytebytego.com/p/how-perplexity-built-an-ai-google)
- [ByteByteGo — How Dropbox Built an AI Product Dash with RAG and AI Agents](https://blog.bytebytego.com/p/how-dropbox-built-an-ai-product-dash)
- [ByteByteGo — How Uber Built a Conversational AI Agent For Financial Analysis](https://blog.bytebytego.com/p/how-uber-built-a-conversational-ai)
- [ByteByteGo — How Yelp Built "Yelp Assistant"](https://blog.bytebytego.com/p/how-yelp-built-yelp-assistant)
- [ByteByteGo — MCP vs A2A vs ACP](https://blog.bytebytego.com/p/mcp-vs-a2a-vs-acp-how-ai-agents-actually)
- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
