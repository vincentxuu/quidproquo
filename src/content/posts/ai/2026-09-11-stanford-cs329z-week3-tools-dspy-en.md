---
title: "Reading Stanford CS329Z Week 3: Plug Tools In, Swap Frameworks Up — HW1 Begins"
date: 2026-09-11
category: ai
type: deep-dive
tags: [cs329z, ai-course, stanford, ai-agent, dspy, rag, compound-ai-systems]
lang: en
series:
  name: "Reading Stanford CS329Z"
  order: 4
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 19
tldr: "Week 3 standardizes tool interfaces with the MCP specification on Monday and trades hand-written pipelines for compilable, optimizable programs with the DSPy paper on Wednesday. HW1 drops the same Monday, opening the from-scratch versus framework rematch between Part A and Part B."
description: "A guided reading of the Stanford CS329Z Week 3 anchors: the MCP spec's host-client-server shape and safety rules, DSPy's compilable-pipeline design, and how they map to HW1 Parts A and B."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-11-stanford-cs329z-week3-tools-dspy)

Week 3 is the pivot. Monday (Oct 5, Tool Use & Function Calling) assigns the [MCP specification](https://modelcontextprotocol.io/specification/2025-06-18): tools get a standard plug, no more rewriting integrations per vendor. Wednesday (Oct 7, Frameworks & Agent Design) assigns Khattab et al.'s [DSPy](https://arxiv.org/abs/2310.03714) (ICLR 2024): prompt templates graduate from handcraft into compilable, optimizable programs. That same Monday, [HW1 drops](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en), opening the Part A from-scratch versus Part B framework rematch — with the project proposal due Friday (Oct 9).

## MCP: the standard plug for tools

The spec's inspiration is LSP (Language Server Protocol): back when every editor needed per-language rewiring, unification unlocked the ecosystem. MCP wants the same for AI tools, in three roles: the host is the LLM app, building clients, aggregating context, and enforcing consent and security policy; clients are connectors inside the host, one client per server; servers provide context and capabilities, all over JSON-RPC 2.0. Isolation is a stated design principle: servers never see the full conversation or each other. Capabilities are negotiated up front at initialization — undeclared features stay off.

Servers offer three capabilities, each with a controller: Prompts are user-invoked templates, Resources are application-mounted context, and [Tools](https://modelcontextprotocol.io/specification/2025-06-18/server/tools) are model-invoked functions. [Week 2](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en)'s ACI gets its standard shape here: tool definitions stop being per-vendor dialects. Clients symmetrically offer three back to servers: [Sampling](https://modelcontextprotocol.io/specification/2025-06-18/client/sampling) is server-initiated agentic behavior, with model preferences advisory and the client making the final pick; [Roots](https://modelcontextprotocol.io/specification/2025-06-18/client/roots) are filesystem boundaries, restricted to file:// URIs in this version; [Elicitation](https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation) is structured user input, new in this version, limited to flat primitive schemas and never for sensitive information.

The security chapter deserves its own read. Tools are arbitrary code execution, and the spec says so up front: tool annotations count as untrusted unless from a trusted server; invocations keep a human in the loop with veto power, sensitive operations need prior user confirmation, and tool inputs should be shown before the call leaves. Sampling requests and responses must be reviewable; roots need user consent before exposure. The protocol governs format; consent flows are the implementor's homework — a line that comes back when HW1 reaches sandboxes.

## DSPy: the end of prompt templates

The DSPy paper opens with a provocation: today's LM pipelines are hard-coded prompt templates, long strings accumulated through trial and error. It wants a systematic method instead: abstract pipelines as text-transformation graphs, with LMs invoked through **declarative modules**. Three moving parts: a signature declares inputs and outputs in natural language (e.g. `user_question -> search_query`) without saying how to coax the model; a module implements a signature with learnable parameters — the built-in ChainOfThought just prepends a rationale field and delegates to Predict, sketched in about a dozen lines; a teleprompter optimizes by filling each module with bootstrapped demonstrations. Modules carry parameters and teach themselves — generating and collecting demonstrations, composing prompting, finetuning, augmentation, and reasoning techniques.

In practice you write a signature plus a target metric, and the compiler tunes in three stages: generate candidate demonstrations (run the pipeline, keep traces that pass the metric), pick demonstration sets with random search or Optuna, and optionally rewrite program structure (e.g. ensembling compiled copies behind a majority vote). Both case studies reproduce: a few lines of DSPy lift GPT-3.5 to 82% accuracy on [GSM8K](https://arxiv.org/abs/2110.14168); the two-hop retrieval program's ensemble answers 45.6% of the [HotPotQA](https://arxiv.org/abs/1809.09600) test set (that cell covers half the test set, per the paper's cost note); and a 770M-parameter T5 distilled from just 200 labeled questions plus unlabeled ones scores nearly 40% exact match on dev. Small models with good systems beating big models with bad ones — [Week 1](/en/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en)'s thesis with reproducible numbers.

## How the two readings relate: the abstraction-level question

Wednesday's lecture title names it: what frameworks abstract versus what you built from scratch. LangChain, LangGraph, and LlamaIndex each pick a different abstraction altitude; DSPy picks "you don't even hand-write prompts." Week 2's brake pedal still applies: frameworks save startup time and charge debugging visibility. HW1 Part B asks precisely for this reflection: same agent, scratch versus DSPy builds — what did the framework hide, and what did it decide for you?

## What to do: finish a shrunken Part B this week

**What to do**: take your Week 2 hand-built RAG, lift exactly one stage (say query generation) into a DSPy signature, compile against twenty questions with accuracy as the metric, and compare against the hand-built score plus your time spent. The score gap matters less than three written lines: what decision the framework made for you, which decision you disagree with, and when you would switch back. Those three lines draft the Part B reflection — and the methods paragraph of Friday's proposal.

## Where it sits in the course

Week 3 releases HW1 (due Oct 30); once Week 4's ReAct fixes the loop's shape, Part A can close. MCP only grows from here: Week 5's multi-agent collaboration and Week 9's coding agents (SWE-agent, Claude Code architectures) are all division of labor over standard interfaces. Remember the spec's positioning line: MCP governs format, consent and trust are the implementor's homework.

## This week's course material

- Mon 10/5 Tool Use & Function Calling: anchor reading MCP specification (covered above); no additional readings this week.
- Wed 10/7 Frameworks & Orchestration: anchor reading the DSPy paper (covered above); no additional readings this week.
- Course schedule: [CS329Z site](https://cs329z.stanford.edu/)

## References

- On this site: [Week 2: workflows versus agents](/en/posts/ai/2026-09-10-stanford-cs329z-week2-workflows-rag-en), [Week 1: stop tuning only the model](/en/posts/ai/2026-09-09-stanford-cs329z-compound-ai-systems-en), [Stanford CS329Z course guide](/en/posts/ai/2026-08-21-stanford-cs329z-engineering-ai-agents-en)
- Course: [CS329Z schedule](https://cs329z.stanford.edu/)
- Sources: [MCP Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18), [Khattab et al., DSPy, ICLR 2024](https://arxiv.org/abs/2310.03714)
- Tools: [DSPy](https://dspy.ai/), [LangChain](https://www.langchain.com/), [LlamaIndex](https://www.llamaindex.ai/)
