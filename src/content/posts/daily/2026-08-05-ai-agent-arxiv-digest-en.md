---
title: "AI Agent Arxiv Digest — 2026-08-05"
date: 2026-08-05
category: daily
type: digest
tags: [ai-agent, arxiv, daily, tool-use, agent-planning, multi-agent]
lang: en
description: "Three papers converge on one core question — how should agents plan tool calls without wasting steps? ToolLIFT uses function-level workflow graphs to generalize tool planning to unseen toolsets, HyperAgent encodes parameter-level dependencies as a hypergraph for executable paths, and a multilingual diagnosis reveals five failure modes when planning breaks down in non-English settings"
tldr: "ToolLIFT abstracts tool trajectories into function-level workflow graphs, lifting OOD accuracy by 4+ points on average; HyperAgent builds tool-schema hypergraphs with deficit-oriented expansion, beating ReAct by 14.3 points on AppWorld with lower token cost; a multilingual multi-agent planning diagnosis finds that planning grounding failures rise with decreasing language resources, and the TART fix improves scores by 5.6 points on average"
series:
  name: "AI Agent Arxiv Digest"
  order: 73
---

> 🌏 [中文版](/posts/daily/2026-08-05-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers all point at the step most likely to go wrong in an agent system — the planning process that turns a user request into an executable tool sequence. ToolLIFT discovers that reusable "function-level workflow structures" exist across different toolsets; extract them and planning generalizes to toolsets never seen during training. HyperAgent pushes the problem one layer deeper: knowing which tools to use isn't enough — you also need to know where each parameter comes from, so it models parameter-level dependencies as a queryable hypergraph. The third paper reveals the planning bottleneck from another angle — when the user doesn't speak English, the planner systematically loses entities, timestamps, sources, and other critical information, and the lower the language's resource level, the higher the failure rate. The combined message is clear: agent tool planning can't rely on implicit LLM reasoning alone — it needs explicit structure, whether that's a workflow graph, a parameter hypergraph, or a semantic parsing template.

## Terms to Know Before Reading

| Term | Plain Explanation |
|---|---|
| Tool Planning | The process where an agent decides "which tools to call, in what order, and where parameters come from" — the bridge from intent to action |
| OOD (Out-of-Distribution) | The toolset or data used at test time was never seen during training — this tests generalization, not memorization |
| Hypergraph | In an ordinary graph, an edge connects two nodes; in a hypergraph, an edge can connect multiple nodes simultaneously — well suited for expressing "one tool requires multiple inputs and produces multiple outputs" |
| Task DAG | A directed acyclic graph formed by decomposing a complex task into subtasks, where edges represent inter-subtask dependencies |
| Planning Grounding | Ensuring that critical information (entities, timestamps, operations) isn't lost when converting a user's natural language request into an executable plan |

---

## Paper 1 ｜ ToolLIFT: Abstracting Tool Trajectories into Function-Level Workflow Graphs for Generalizable Planning

### ToolLIFT: Lifting Tool-Specific Trajectories into Function-Level Graphs for Generalizable Tool Planning
Xiuhui You, Jiayi Luo, Zichao Shen et al.　·　arxiv: 2608.03468

Links: [arxiv](https://arxiv.org/abs/2608.03468) · [alphaxiv](https://www.alphaxiv.org/abs/2608.03468)

### TL;DR

Abstracts historical tool-call trajectories from the "specific tool" level to "function-level workflow graphs" (FWG), then uses decoupled workflow planning and tool selection for generalization — average accuracy improves by 4+ points across three OOD benchmarks.

### Read Priority

Must-read — if your agent platform needs to support dynamically expanding toolsets (e.g., more and more MCP servers being connected), the "function-level abstraction" proposed here is currently the most actionable generalization approach.

### Domain Background

Most existing tool planning methods build "tool-level" dependency graphs — nodes are specific tools, edges are call relationships between them. The problem is these graphs are locked to a particular toolset; swap in a different set of APIs and you have to rebuild. Prior methods like ToolNet and GTool used graph structures to improve planning but showed limited generalization to unseen toolsets.

### Mid-Level Walkthrough

- **Problem**: Imagine your agent has learned a workflow with an HR system's APIs — "look up employee → get department → send notification." Now you need to integrate a completely different CRM system where API names and parameters are entirely different, but the workflow structure of "query → get related data → take action" is actually the same.
- **Method**: ToolLIFT first uses a trajectory-lifting mechanism to map specific tools in historical trajectories to "function-level" nodes (e.g., "query," "filter," "notify"), constructing a function-level workflow graph (FWG). At planning time, it first does workflow planning on the FWG (deciding the abstract flow), then maps each function node to a specific tool (tool selection). Finally, a source-gated reward from RL ensures parameter provenance is traceable.
- **Why it matters**: This means an agent's tool-use experience can transfer across toolsets. For platforms that frequently onboard new tools, you don't have to learn from scratch every time.

### Deep Dive

- ID benchmarks (HuggingFace / Multimedia): 1.37–1.50 points above the strongest baseline (Llama-3.1-8B)
- OOD benchmarks (DailyLifeAPIs / Seal-Tools / ToolAlpaca): 3.22–4.90 points above the strongest baseline ⚠️ (self-reported by authors; awaiting independent replication)
- Largest gains on "rare tools" (bottom 20% by training frequency) — FWG enables cross-tool experience sharing
- Validated on two backbone models: Qwen2.5-7B and Llama-3.1-8B
- Adoption threshold: requires historical tool-call trajectories to build the FWG; cold-start scenarios need data accumulation first
- Relation to LangGraph / CrewAI: FWG can serve as a planning-layer plugin without changing the execution layer
- Limitation: assumes each parameter has a single information source; multi-source fusion is not yet handled

### Reviewer's One-Liner

The function-level abstraction insight is clear and experiments are comprehensive — OOD generalization is the real highlight. The main concern is that workflow graph quality depends heavily on historical trajectory coverage: if the initial trajectories don't contain a certain workflow pattern, generalization will be limited.

### Your Take-Away

- If you're building an agent tool platform with frequently changing toolsets: reference the FWG construction approach and store tool experience as "function-level templates" rather than "tool-level trajectories"
- If you're doing RL-based agent training: the source-gated reward design is worth borrowing — it solves the parameter provenance tracking problem that's easy to overlook in long tool chains

---

## Paper 2 ｜ HyperAgent: Dynamic Planning over Tool-Schema Hypergraphs for Parameter-Level Dependencies

### HyperAgent: Planning and Acting over Tool-Schema Hypergraphs for Tool-Use LLM Agents
Zian Zhai, Xingyu Tan, Gaowang Zou et al.　·　arxiv: 2608.02650

Links: [arxiv](https://arxiv.org/abs/2608.02650) · [alphaxiv](https://www.alphaxiv.org/abs/2608.02650)

### TL;DR

Models parameter-level dependencies using a "tool-schema hypergraph," then dynamically constructs a tool support subgraph for each subtask via Deficit-Oriented Expansion — achieves 63.1% TGC on AppWorld (Test-N), 14.3 points above ReAct, while reducing API calls and token consumption.

### Read Priority

Must-read — AppWorld is one of the benchmarks closest to real-world API usage scenarios. HyperAgent achieves performance comparable to RL-trained methods without any model fine-tuning, and is more practical to deploy in production.

### Domain Background

Existing tool-graph methods only record "Tool A's output can be used by Tool B" without specifying which output maps to which input. When one tool has multiple outputs and multiple downstream tools each need different ones, coarse-grained edges aren't enough. Additionally, tool executability is dynamic — some inputs may already be provided by the user, so upstream tools don't need to be called.

### Mid-Level Walkthrough

- **Problem**: Imagine you need to help a user "remind roommates to pay up." This requires: look up user account → look up roommate list → get each person's contact info → check pending payment requests → match → send reminder. ReAct's approach is to try step by step, backtracking whenever a parameter is missing — wasting massive amounts of tokens on exploration.
- **Method**: HyperAgent first builds a hypergraph from all API input/output schemas (one tool = one hyperedge, from multiple input schema nodes to multiple output schema nodes). Upon receiving a task, it extracts a task-relevant subgraph from the hypergraph, then decomposes it into a Task DAG. When executing each subtask, it uses Deficit-Oriented Expansion — checking what parameters the current state is missing, tracing upstream along the hypergraph for tools that can produce them, and assembling the minimal complete path.
- **Why it matters**: It turns tool dependency resolution from "LLM guessing by semantics" into "structured querying," drastically reducing trial-and-error. Especially effective for scenarios with many APIs (AppWorld has 457).

### Deep Dive

- GPT-4o backbone: Test-N TGC 63.1% (ReAct 48.8%), Test-C TGC 35.7% (ReAct 30.2%)
- Compared with RL-trained methods: highest among NFT methods, approaching LOOP(token)'s 71.3% ⚠️ (LOOP uses fine-tuned Qwen-2.5-32B; not directly comparable)
- Tool context graph recall: at equal budget (20 tools), gold tool recall significantly higher than semantic top-K and In-N-Out
- Both token consumption and API call count lower than ReAct
- Adoption threshold: requires schema annotation for the toolset (the In-N-Out dataset provides templates; new toolsets need fresh annotation)
- Relation to MCP: MCP's tool schemas are naturally suited for building TSH, but need supplemental effect/precondition annotations
- Limitation: tested only on AppWorld so far; transfer to real SaaS APIs remains to be validated

### Reviewer's One-Liner

The hypergraph modeling and deficit-oriented expansion design are rigorous, and ablations thoroughly prove each component's necessity. The main concern is that hypergraph construction relies on GPT-4o + manual effect/precondition annotation, which could become a bottleneck when toolsets change rapidly.

### Your Take-Away

- If your agent operates over many APIs (>50): HyperAgent's "extract context subgraph first, then expand by deficit" is currently the most effective strategy for reducing wasted exploration
- If you're designing MCP tool schemas: consider adding effect and precondition fields — this will dramatically amplify graph-based methods' effectiveness

---

## Paper 3 ｜ Why Non-English Agent Planning Breaks — Five Failure Modes and a Fix

### An Actionable Diagnosis of Multilingual, Multi-Agent Planning Failures
Vikas Pahuja, Jonathan Brokman, Omer Hofman et al. (Fujitsu Research of Europe / Cohere)　·　arxiv: 2608.03735

Links: [arxiv](https://arxiv.org/abs/2608.03735) · [alphaxiv](https://www.alphaxiv.org/abs/2608.03735)

### TL;DR

The first systematic diagnosis of planning failures in multilingual multi-agent systems, identifying five categories of "planning grounding failures" (entity / source / temporal / operation / output) and proposing TART as a fix — averaging 5.6 points of improvement on GAIA-MAPS across 11 languages.

### Read Priority

Skim — if your agent only serves English-speaking users you can skip the details, but the "planning grounding failure" taxonomy itself is valuable for debugging agents in any language. Must-read for teams serving multilingual users.

### Domain Background

Performance degradation of multilingual agents has been documented by multiple studies, but prior work only reported "non-English performs worse" without diagnosing where things break. Is the tool call itself going wrong? Or is the planning stage already losing critical information? This paper is the first to focus on the planner and identify the specific patterns of information loss during the "user request → executable plan" conversion.

### Mid-Level Walkthrough

- **Problem**: A user asks an agent a question containing dates and names in Igbo (a Nigerian language). When the planner converts the request into a tool-call plan, the name is misspelled, the date format is converted incorrectly, and "query" is even misinterpreted as "create." This isn't a tool-level problem — it's a planning-stage grounding failure.
- **Method**: The authors categorize five types of planning grounding failures from real failure cases — entity (names/places lost), source (search replaced with direct answer), temporal (date format or relative time conversion errors), operation (action intent misinterpreted), and output (return format doesn't match expectations). They then design TART (Taxonomy-guided Actionable Task Representation), which uses an LLM to parse the user request into a structured representation covering all five dimensions before feeding it to the planner.
- **Why it matters**: This taxonomy turns "multilingual agents perform poorly" from a vague observation into an actionable debugging framework. And TART's cost is minimal — just one semantic parsing step before planning.

### Deep Dive

- GAIA-MAPS (11 languages × 165 tasks): GPT-5-mini + OWL + TART averages 5.6-point improvement
- MULTITAT (10 languages): 1.9-point average improvement ⚠️ (self-reported by Fujitsu / Cohere)
- Low-resource languages (Igbo, Yoruba) show the highest proportion of planning grounding failures among all failures
- Consistent effectiveness across three LLM backbones (GPT-5-mini, Mistral-Large-3, Qwen3-VL-235B)
- Adoption threshold: TART requires only one LLM call for semantic parsing — minimal added latency and cost
- Relation to existing frameworks: can be directly prepended to the planning step of OWL / CrewAI / LangGraph
- Limitation: TART itself relies on an LLM for semantic parsing; if the LLM's understanding of the target language is poor, parsing quality will be limited too

### Reviewer's One-Liner

The five failure modes are clearly articulated and have real debugging value; TART's design is clean and effective. The main question is whether GAIA-MAPS's task distribution represents real multilingual usage — in practice, low-resource language users may ask entirely different types of questions.

### Your Take-Away

- If your agent serves non-English users: add a TART-style semantic parsing step before planning — low cost with clear benefits
- If you're debugging agent failures: use this paper's five-category taxonomy (entity / source / temporal / operation / output) to label failure causes — far more useful than coarse labels like "tool call failed"

---

## Today's Takeaway

I used to think the bottleneck in tool planning was "the LLM isn't smart enough." Today's reading reveals that the real issue is "implicit LLM reasoning is inherently weak at structured problems like tool dependencies." All three papers converge on the same solution direction: use explicit structure (workflow graphs, hypergraphs, semantic templates) to take away the parts the LLM shouldn't be guessing at, letting it focus on what it does best — semantic understanding. The design implication for agent systems: whenever you find your agent repeatedly trial-and-erroring at some step, first ask "is there structure here that can be modeled explicitly?"

## References

- [arxiv:2608.03468](https://arxiv.org/abs/2608.03468)
- [arxiv:2608.02650](https://arxiv.org/abs/2608.02650)
- [arxiv:2608.03735](https://arxiv.org/abs/2608.03735)
