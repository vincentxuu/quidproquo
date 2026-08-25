---
title: "Agentic / Reasoning RAG: From Search-R1's RL Multi-Turn Search to Deep Research and MCP's Reasoning × Retrieval Paradigm"
date: 2026-08-25
category: ai
type: deep-dive
tags: [rag, agentic-rag, reasoning, reinforcement-learning, mcp, search-r1]
lang: en
tldr: "In 2025 RAG stopped being 'retrieve once, generate once.' Search-R1 trains models to search autonomously in multiple turns with RL, REX-RAG/AlignRAG add policy and alignment branches, OpenAI Deep Research productizes the loop, and MCP generalizes retrieval into unified tool invocation. This post unpacks the design philosophy, trade-offs against ten generations, and when to adopt the new paradigm."
description: "Unpacking the 2025 Agentic/Reasoning RAG paradigm: Search-R1's RL multi-turn search, branches REX-RAG/GTA-RAG/Interact-RAG/AlignRAG, OpenAI Deep Research productization and MCP tool generalization, with design philosophy, comparisons to ten generations, use cases and a LangGraph + MCP code sketch."
draft: false
series:
  name: "The RAG Techniques Compendium"
  order: 46
---

> 🌏 [中文版](/posts/ai/2026-08-25-agentic-reasoning-rag)

Before 2025, RAG was a single-pass pipeline: query in, retrieve once, generate once, done. The 2025 cluster broke that assumption: the model **autonomously decides when to search, what to search, and how to use results — mid-reasoning** — and the decision policy is trained with reinforcement learning. This post unpacks the shift — why it happened, what the technical entry point is, how the product and protocol layers land, and how to trade it off against the ten generations you already own.

You will get a post-ten "Agentic Era" boundary without a forced Gen 11 number, a Search-R1 family comparison, and a drop-in LangGraph + MCP tool skeleton to judge whether your project truly needs multi-turn reasoning × retrieval.

## What Is Agentic / Reasoning RAG

The core idea is **interleaving reasoning and retrieval**, not a one-way "retrieve then reason" pipeline. Two independent 2025 surveys define it as a new paradigm: [Towards Agentic RAG with Deep Reasoning](https://arxiv.org/abs/2507.09477) calls it *Synergized RAG-Reasoning* (three types: Reasoning-Enhanced RAG / RAG-Enhanced Reasoning / agentic interleaving), and [Reasoning RAG via System 1 or System 2](https://arxiv.org/abs/2506.10408) distinguishes *predefined reasoning* vs *agentic reasoning* with a focus on tool orchestration. Both agree: this is not a subdivision of Gen 8/9; retrieval moves from a black-box query to a steerable reasoning step.

Philosophically, it trades "predictable fixed flow" for "autonomous exploration" coverage. The cost is higher latency, cost, and observability burden — each extra turn is an LLM call + retrieval + tool execution, and errors compound across turns. The limits are immediate: if your question is answerable with one retrieval (factoid, single-doc QA), the extra turns only add variance; the [Agent-Orchestrated Adaptive RAG study](https://arxiv.org/abs/2606.05658) also shows query decomposition helps on structured domains but can hurt ranking precision on multi-hop tasks, and reflection improves citation precision at higher latency — adoption hinges on whether you truly need cross-tool, multi-step reasoning.

## Technical Entry Point: Search-R1 and 2025 Branches

The entry point is [Search-R1](https://arxiv.org/abs/2503.09516) (2025-03-12 v1 → 2025-08-05 v5). It trains an LLM to emit multiple search queries autonomously while reasoning stepwise with RL, masking retrieved tokens from the gradient and using outcome rewards; Qwen2.5-7B shows clear gains over RAG baselines, with Qwen2.5-3B also improving. The value is not a single percentage but the proof that "multi-turn retrieval × reasoning" can be learned with outcome rewards without hand-crafted retrieval triggers.

Four 2025 branches fill different gaps. [REX-RAG](https://arxiv.org/abs/2508.08149) tackles dead-ends in RL search agents via Mixed Sampling + Importance Sampling Policy Correction, with average gains of a few points over strong baselines across 7 QA tasks. [GTA-RAG](https://arxiv.org/abs/2608.22479) (EMNLP 2026) samples executable trajectories from an entity-document graph and optimizes answer plus evidence-chain coverage with GRPO + trajectory-guided rewards — a Graph × Agentic cross. [Interact-RAG](https://arxiv.org/abs/2510.27566) rejects the "retrieval is a black-box query" assumption, offering a Corpus Interaction Engine for index/filter/rerank manipulation trained end-to-end with SFT+RL. [AlignRAG](https://arxiv.org/abs/2504.14858) (NeurIPS 2025) defines *Reasoning Misalignment* and trains a retrieval-augmented Critic LM with contrastive critique to iteratively align reasoning and evidence at test time, where an 8B Critic can outperform a 72B model's alignment.

Compared to alternatives: versus [Self-RAG](https://arxiv.org/abs/2310.11511)'s single-model reflection tokens (Gen 8, 2023), this batch expands the binary "whether to retrieve" into continuous control of retrieval strategy; versus [Adaptive-RAG](https://arxiv.org/abs/2403.14403)'s three-slot routing (No/Single/Multi-step), policy now emerges from RL rather than preset slots. Suitable for open-domain multi-hop, cross-document synthesis, or unstable retrieval needing self-correction; unsuitable for high-consistency single-pass QA and latency-sensitive online serving — those should stay on Gen 2/3 Advanced/Modular.

## Product and Protocol Layer: Deep Research and MCP

Papers prove feasibility; product and protocol decide production readiness. [OpenAI Deep Research](https://openai.com/index/introducing-deep-research/) (2025-02-02) — an o3-optimized multi-step browsing + Python tool agent that searches, analyzes and synthesizes hundreds of sources in tens of minutes — productizes Agentic RAG end-to-end. It trades time for depth — suitable for research reports and due diligence where waiting is acceptable.

The protocol key is [MCP (Model Context Protocol)](https://modelcontextprotocol.io/specification/2025-06-18). Open-sourced by Anthropic on 2024-11-25 via the [official MCP announcement](https://www.anthropic.com/news/model-context-protocol) as *USB-C for AI* — Host / Client / Server triple, Resources / Tools / Prompts triple, with Sampling / Roots / Elicitation negotiation — MCP generalizes RAG "retrieval" from vector-store lookup to unified tool/data-source invocation, adopted in 2025 by ChatGPT, Claude, VS Code, Cursor and integrated into orchestration runtimes like [LangGraph 1.2.11](https://github.com/langchain-ai/langgraph/releases) — [LangGraph docs](https://docs.langchain.com/oss/python/langgraph/overview) now positions itself as an *orchestration runtime* (durable execution / persistence / human-in-the-loop / streaming), not a high-level agent framework.

Selection guidance: for new systems spanning search, databases, documents and APIs with one-build-many-run, prefer MCP-first with custom tool-use as fallback; when corporate networks forbid MCP servers or require fine-grained audits, custom layers remain. The risk is that MCP treats tool descriptions as untrusted input, expanding the security surface — host authorization and isolation must be explicit in the architecture.

## How to Choose: New Paradigm vs Ten Generations

- **Pick Gen 2/3 (Advanced/Modular)**: one retrieval suffices, latency/cost sensitive, needs testable DAGs — still the proven production baseline.
- **Pick Gen 6 GraphRAG**: relationship reasoning is the bottleneck (regulation citations, drug interactions, org relations) and you accept graph build cost. Since 2025 watch [GraphRAG at v3.1.2](https://github.com/microsoft/graphrag/releases) with four query modes; consider LightRAG / HippoRAG 2 for lightweight alternatives.
- **Pick Agentic/Reasoning RAG (this post)**: need more than one retrieval, dynamic correction of retrieval strategy mid-reasoning, or cross-tool synthesis (search + compute + doc ops). Only then is multi-turn cost justified.
- **Why not**: small complete KBs or structured-data answers (Text-to-SQL is more accurate) — extra Agentic turns dilute context without recall gains.

## Code Sketch: Minimal LangGraph + MCP Skeleton

This skeleton shows how Agentic RAG uses MCP as a unified retrieval layer under LangGraph. Each MCP server is a swappable retrieval source (vector store, search engine, doc parser); graph nodes handle reasoning and dispatch, edges handle persistence and human intervention.

```python
# Conceptual: Agentic RAG with LangGraph + MCP
# Requires: langgraph>=1.2, mcp[cli]
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver

class AgentState(dict):
    question: str
    trajectory: list  # [{thought, action, observation}]
    context: list     # merged retrieved chunks

def think(state: AgentState):
    return {"next_action": llm.decide(state)}  # Thought + Action (tool name + args)

def act_with_mcp(state: AgentState):
    tool_call = state["next_action"]
    observation = mcp_client.call(tool_call.name, tool_call.args)
    return {"trajectory": state["trajectory"] + [observation]}

def should_continue(state: AgentState):
    return "generate" if llm.should_answer(state) else "think"

builder = StateGraph(AgentState)
builder.add_node("think", think)
builder.add_node("act", act_with_mcp)
builder.add_node("generate", lambda s: {"answer": llm.generate(s)})
builder.set_entry_point("think")
builder.add_conditional_edges("think", lambda s: "act")
builder.add_conditional_edges("act", should_continue, {"think": "think", "generate": "generate"})
builder.add_edge("generate", END)

graph = builder.compile(checkpointer=MemorySaver(), interrupt_before=["act"])
```

Action you can do tonight: replace your single retrieval node with the small `think → act(MCP) → think` loop above, compare single vs two-turn recall and cost on an offline eval set, then decide on turn limits and tool allowlists.

## Overall Architecture

```
Query → Think (LLM reasoning) → MCP Tool Router ─┬─→ Vector Search Server
                                                 ├─→ Web Search Server
                                                 ├─→ Document Parse Server
                                                 └─→ Code / SQL Server
         ↑  Observation (feed back)  ←────────────┘
         ↓  (multi-turn until should_answer)
      Generate (synthesized answer + citations)
         │
      Memory / Checkpoint (replayable + human-in-the-loop)
```

## Overall

Agentic / Reasoning RAG is not "stronger retrieval" but turning retrieval into a subroutine of reasoning, trainable with RL and reusable via a tool protocol. The trade-off is clear: pay multi-turn, cross-tool cost for coverage and correctability in open-domain research. For most teams the pragmatic path is — keep Gen 2/3 as the online baseline, run the small Agentic loop as an offline research or high-value second path, and unify the retrieval surface with MCP — otherwise you will rebuild tool-use and observability from scratch.

## References

- [Towards Agentic RAG with Deep Reasoning: A Survey](https://arxiv.org/abs/2507.09477) — Jul 2025, Synergized RAG-Reasoning taxonomy, generation boundary
- [Reasoning RAG via System 1 or System 2: A Survey](https://arxiv.org/abs/2506.10408) — Jun 2025, System 1/2 distinction
- [Search-R1: Training LLMs to Reason and Leverage Search Engines with RL](https://arxiv.org/abs/2503.09516) — Mar 2025, RL multi-turn search entry point
- [REX-RAG: Reasoning Exploration with Policy Correction](https://arxiv.org/abs/2508.08149) — Aug 2025, policy correction for RL dead-ends
- [GTA-RAG: Graph-Trajectory-Augmented RL](https://arxiv.org/abs/2608.22479) — Aug 2025, graph-trajectory distillation (EMNLP 2026)
- [Interact-RAG: Reason and Interact with the Corpus](https://arxiv.org/abs/2510.27566) — Oct 2025, steerable corpus interaction
- [AlignRAG: Enhancing RAG Reasoning through Test-Time Critique](https://arxiv.org/abs/2504.14858) — Apr 2025, test-time critique alignment (NeurIPS 2025)
- [Introducing deep research](https://openai.com/index/introducing-deep-research/) — OpenAI Official Blog, Feb 2, 2025, productized research agent
- [Introducing the Model Context Protocol](https://www.anthropic.com/news/model-context-protocol) — Anthropic Official, Nov 25, 2024, MCP open-source
- [Model Context Protocol Specification 2025-06-18](https://modelcontextprotocol.io/specification/2025-06-18) — official spec
- [LangGraph overview](https://docs.langchain.com/oss/python/langgraph/overview) — official docs, orchestration runtime positioning
- [LangGraph Releases 1.2.11](https://github.com/langchain-ai/langgraph/releases) — Aug 11, 2025, version anchor
- [GraphRAG Releases v3.1.2](https://github.com/microsoft/graphrag/releases) — Aug 21, 2025, graph generation anchor
- [RAG Techniques Compendium Guide](https://quidproquo.cc/posts/ai/2026-03-14-rag-patterns-complete-guide-en) — series overview and selection
