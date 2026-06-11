---
title: "LangGraph: Managing Agent Workflows with Graph Structures"
date: 2026-03-27
type: guide
category: ai
tags: [langgraph, agent, orchestration, rag, workflow]
lang: en
tldr: "LangGraph models LLM workflows as directed graphs, solving the pain points of multi-turn iteration, conditional branching, and parallel execution that are difficult to handle with linear pipelines."
description: "What LangGraph is, why it is more practical than plain pipelines, how nobodyclimb uses it to manage three RAG strategy graphs (Baseline / Agentic / Plan-Execute), and when using it is actually overkill."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-27-langgraph-agent-orchestration)

Most RAG tutorials are linear: query → embed → retrieve → generate. But real-world systems quickly run into problems: "The answer quality isn't good enough — we need to re-retrieve," "This query needs to be broken into subtasks first and then merged," "Simple questions should go straight to the LLM without running the full pipeline."

Adding this logic to a linear pipeline eventually results in if/else statements scattered everywhere. LangGraph's core proposition is: model these control flow structures explicitly as a graph.

## What Is LangGraph

LangGraph is a sub-framework in the LangChain ecosystem. Its core concept is representing LLM workflows as **directed graphs**. Nodes are execution units (which can be LLM calls, tool calls, or any function), and edges are transitions between nodes. It supports conditional edges to determine which path to take.

State is a typed dict that flows through the graph. Each node receives the current state, performs its work, and returns the updated state.

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class State(TypedDict):
    query: str
    documents: list[str]
    answer: str
    loop_count: int

def retrieve(state: State) -> State:
    # Vector search logic
    docs = vector_store.search(state["query"])
    return {"documents": docs}

def generate(state: State) -> State:
    answer = llm.invoke(f"Based on: {state['documents']}\nAnswer: {state['query']}")
    return {"answer": answer.content}

def should_retry(state: State) -> str:
    if groundedness_score(state["answer"]) < 0.5 and state["loop_count"] < 2:
        return "retrieve"
    return END

graph = StateGraph(State)
graph.add_node("retrieve", retrieve)
graph.add_node("generate", generate)
graph.add_edge("retrieve", "generate")
graph.add_conditional_edges("generate", should_retry)
graph.set_entry_point("retrieve")

app = graph.compile()
```

This code explicitly expresses the logic of "evaluate after generation, retry if quality is insufficient" — no need to embed control flow inside individual functions.

## Why Not Use a Plain Pipeline

The problem with linear pipelines isn't that they can't implement these features — it's that the maintenance cost grows quickly once they do:

**Conditional Routing**: In a linear pipeline, skipping certain steps typically relies on internal checks within each step or `skipWhen` conditions at the engine layer. As conditions multiply, it becomes hard to tell at a glance which steps will run and which won't. LangGraph centralizes routing logic in edges — the graph structure itself is the documentation.

**Loops**: Pipelines generally assume single-pass execution. Adding retry loops means either adding global loop control at the engine layer or having a step call back to itself — both are workarounds. In LangGraph, cyclic graphs are first-class citizens.

**Parallel Execution**: LangGraph supports the `Send` API for map-reduce patterns, splitting a task into multiple parallel branches that merge back together, without manually writing `Promise.all`.

## nobodyclimb's Three Strategy Graphs

nobodyclimb's AI Q&A system sits on top of a pipeline engine (14 base steps) and uses LangGraph to add a strategy selection layer. Based on query complexity, it automatically routes to one of three graphs:

### Baseline Graph (15 nodes)

The standard flow for most queries. The 14 pipeline steps execute sequentially, plus a `memoryExtractor` — which extracts user preferences from conversations (frequently visited crags, preferred difficulty ranges) and writes them to long-term memory.

```
query → semantic-cache → tool-selection → [RAG steps] → generation → evaluation → memoryExtractor
```

### Agentic Graph (12 nodes)

For complex queries where "I'm not sure if the retrieved information is sufficient to answer this question." The core is the `agenticDecision` node: the LLM reads the currently retrieved documents and decides whether they are sufficient to answer the question. If not, it triggers `agenticRetrieve` to re-retrieve, looping up to 5 times.

```
query → retrieve → agenticDecision ──(sufficient)──→ generate
                       ↑
                       └──(insufficient)── agenticRetrieve ──┘
```

### Plan-Execute Graph (8 nodes)

For compound queries, such as "Compare the 5.10 routes at Longdong and Beitou — which is better for beginners?" The `planning` node first decomposes the question into subtasks, `executePlanStep` executes each one, and `synthesis` merges the multiple sub-results into a single answer.

```
query → planning → executePlanStep (x N) → synthesis → generate
```

All three graphs share the same set of base step implementations. The differences lie only in graph structure and a few LangGraph-specific nodes.

## When to Use LangGraph, and When It's Overkill

**Worth using when:**

- There are multiple execution paths, and the route is dynamically determined based on state
- Loops are needed (self-correction, multi-turn retrieval)
- Tasks can be decomposed into subtasks for parallel execution
- The flow is complex enough that a linear pipeline's if/else statements become unreadable

**Potentially overkill when:**

- The flow is a fixed query → retrieve → generate with no branching
- The team is unfamiliar with graph abstractions, and the learning curve outweighs the benefits
- You only need "retry once if quality is poor" — a simple retry loop is sufficient
- Dependency size matters (LangGraph pulls in a non-trivial set of dependencies)

The decision criterion is straightforward: if your pipeline has more than one conditional branch or requires any form of looping, LangGraph is worth considering. If your flow can be fully described as a linear list, you don't need it.

## Key Trade-offs

**Pros:**
- The flow graph is documentation — `.get_graph().draw_mermaid()` outputs a visualization directly
- Unified state management eliminates the need to pass numerous parameters between functions
- Built-in checkpointing enables resuming interrupted executions (important for long-running agents)
- LangSmith integration provides trace and observability out of the box

**Cons:**
- The abstraction layer adds complexity — debugging is harder than calling functions directly
- State types need maintenance, and as state fields grow, they can become unwieldy
- Rapid version iteration means the API is sometimes unstable
- If you only use LangGraph without the rest of LangChain, the cost of pulling in the entire ecosystem just for graph structure needs to be weighed

## References

- [LangGraph Official Documentation](https://langchain-ai.github.io/langgraph/)
- [LangGraph Concepts: Graphs](https://langchain-ai.github.io/langgraph/concepts/low_level/)
- [LangGraph Concepts: State Management](https://langchain-ai.github.io/langgraph/concepts/low_level/#state)
- [LangGraph How-to Guides](https://langchain-ai.github.io/langgraph/how-tos/)
- [NobodyClimb RAG Pipeline Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) — Complete 20-node design with three strategy graphs
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture) — Overall platform architecture and Cloudflare-first strategy
