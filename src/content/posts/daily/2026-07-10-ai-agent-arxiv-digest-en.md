---
title: "AI Agent Arxiv Digest — 2026-07-10"
date: 2026-07-10
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-memory, agent-evaluation, agent-framework]
lang: en
description: "Three papers today map the 'evolutionary frontier' of Agent platforms: EvoSOP lets agents extract reusable SOPs from past execution traces instead of replanning from scratch; AgenticSTS proposes a strict bounded-memory contract with five typed layers replacing endless context stacking; Spider 2.0-AIFunc reveals that AI functions are already embedded in cloud SQL syntax, yet the best model hits only ~67% accuracy — a new challenge every data agent must face."
tldr: "Three papers today map the 'evolutionary frontier' of Agent platforms: EvoSOP lets agents extract reusable SOPs from past execution traces instead of replanning from scratch; AgenticSTS proposes a strict bounded-memory contract with five typed layers replacing endless context stacking; Spider 2.0-AIFunc reveals that AI functions are already embedded in cloud SQL syntax, yet the best model hits only ~67% accuracy — a new challenge every data agent must face. Together they outline three critical gaps agent platforms must close in 2026: tool efficiency, memory architecture, and data capabilities."
series:
  name: "AI Agent Arxiv Digest"
  order: 47
---
> 🌏 [中文版](/posts/daily/2026-07-10-ai-agent-arxiv-digest)

## Today's Overview

Three papers today map the "evolutionary frontier" of Agent platforms: EvoSOP lets agents stop replanning tool sequences from scratch every time, instead automatically extracting reusable SOPs from past execution traces — significantly boosting efficiency; AgenticSTS proposes a strict "bounded contract" for long-task memory, replacing endless context stacking with five-layer structured extraction; Spider 2.0-AIFunc reveals that AI functions have already been embedded directly into cloud SQL syntax, yet the strongest model achieves only ~67% accuracy — a new challenge data agents must face. Taken together: from tool efficiency to memory architecture to data capabilities, they outline three critical gaps agent platforms must close in 2026.

## Terms to Know Before Reading


| Plain-language explanation | Term |
|---|---|
| In agent frameworks, a multi-step tool workflow extracted and packaged from execution traces, so similar tasks don't need to be replanned from atomic actions every time — like a "macro" or callable subroutine. | SOP (Standard Operating Procedure) |
| Context size for each decision is capped; structured extraction replaces "stuff all history in," preventing prompts from growing infinitely with task length. | Bounded Memory |
| Systematically disabling a module or feature and measuring the performance drop, to quantify "how much does this component actually contribute." | Ablation Study |
| Calling LLM functions directly within SQL queries (e.g. AI_CLASSIFY, AI_COMPLETE), letting the database layer handle NLP tasks without extracting data for separate processing. | AI-native SQL |
| In text-to-SQL evaluation, the proportion of agent-generated SQL whose execution results exactly match the ground truth; the mainstream metric for SQL agent capability. | Execution Accuracy |


---


## Paper 1 ｜ From Atomic Actions to Standard Operating Procedures: Iterative Tool Optimization for Self-Evolving LLM Agents

**Authors**: Haipeng Ding, Yuexiang Xie, Zhewei Wei, Yaliang Li, Bolin Ding · **Affiliations**: Renmin University of China / Alibaba Tongyi Lab · **arxiv**: 2607.07321
**Links**: [arxiv](https://arxiv.org/abs/2607.07321) · [alphaxiv](https://www.alphaxiv.org/abs/2607.07321)

### TL;DR

Let agents extract frequently repeated "multi-step tool workflows" into reusable SOPs, then call them directly for similar tasks instead of reinventing the wheel — improving task success rate by 2.5%–13.4%.

### Read Priority

Must-read.
Anyone managing tool libraries on LangGraph, AutoGen, or custom frameworks should read this: EvoSOP's SOP synthesis mechanism directly addresses the production pain point of "tool version management and composition," and the architecture ideas are immediately applicable.

### Domain Background

Existing agent frameworks (LangGraph, AutoGen, Dify, etc.) treat tool libraries as **static**: each tool is an atomic action (read a file, run a web search, execute a line of code). Every time an agent tackles a complex task, it must replan the entire workflow from these atomic actions — causing high reasoning overhead and repeating the same mistakes. This is especially severe in long tasks and coding agent scenarios, yet there has been virtually no systematic solution.

### Intermediate Guide


#### Problem

Imagine a coding agent that repeatedly needs to "read a Python file → find function definitions → run unit tests → synthesize analysis." It may have executed this four-step workflow dozens of times, but each time starts from the most basic tool calls, not only consuming reasoning tokens but often making the same mistake at step two. The static tool library design prevents agents from learning "how to combine these steps most effectively" from past successes.

#### Method

This paper proposes **EvoSOP**, a framework for agent self-evolving tool libraries, with a four-stage cycle:
1. **Construction**: Analyze historical execution traces, identify frequently occurring multi-step action sequences, and package them as SOPs
1. **Merging**: Merge functionally overlapping SOPs to remove redundancy and keep the tool library lean
1. **Evaluation**: Test each SOP's success rate on new tasks
1. **Pruning**: Remove underperforming SOPs to ensure tool library quality only improves

#### Why It Matters

The SOP mechanism effectively builds an "expandable skill library" for agents, automatically extracted from actual successful executions without manual design. The implication for platform developers: tool libraries should be treated as **evolvable assets**, not one-time static configurations.

### Deep Dive

- **Core concept**: SOP = callable higher-order tool, encapsulating multi-step logic; from the agent's high-level planner perspective, it's just like calling any ordinary tool
- **Experimental results**: On two subsets of ACEBench, EvoSOP improves over the base method by **2.5%–13.4%** (depending on backbone model), with significantly fewer interaction rounds
- **AgentLens benchmark**: The paper also introduces an evaluation set built from real coding agent production traces, emphasizing real deployment environments over synthetic tasks
- **Difference from EvoTool (2603.04900)**: EvoTool optimizes tool-calling strategy (policy); EvoSOP changes the granularity of the tools themselves
- **Framework relevance**: LangGraph's subgraph mechanism and AutoGen's ConversableAgent tool registry can directly accommodate the SOP concept; if MCP's tool discovery supports dynamic tool versions in the future, EvoSOP logic can be seamlessly integrated
- **Limitation**: SOP quality depends on historical trace diversity — if the training distribution is narrow, extracted SOPs may over-specialize and actually interfere with new tasks
- **Deployment bar**: Requires saving structured execution traces; systems without trace logging infrastructure need to build it; SOP version management is not fully discussed

### Reviewer's One-Liner

The SOP concept itself isn't new, but its systematic implementation and evaluation within the LLM agent tool framework context is a clear contribution; the 2.5%–13.4% improvement depends on backbone choice, and peak gains should be noted for whether they were achieved on weaker baseline models — overall solid, and a direction paper worth following at the framework engineering layer.

### Your Take-away

- If your agent has repetitive multi-step workflows (e.g., "read code → analyze → generate patch → test"), you can start evaluating whether to package them as "SOP tools the agent can call" rather than having it replan every time — EvoSOP's four-stage cycle is a reusable management framework
- When designing tool libraries, start logging "which tool combination sequences appear most frequently with the highest success rates" — this log is the raw material for automatically extracting SOPs in the future

---


## Paper 2 ｜ AgenticSTS: A Bounded-Memory Testbed for Long-Horizon LLM Agents

**Authors**: Xiangchen Cheng, Yunwei Jiang, Jianwen Sun, Zizhen Li, Chuanhao Li, Xiangcheng Cao, Yihao Liu, Fanrui Zhang, Li Jin, Kaipeng Zhang · **Affiliations**: AlayaLab (Shanda AI) · **arxiv**: 2607.02255
**Links**: [arxiv](https://arxiv.org/abs/2607.02255) · [alphaxiv](https://www.alphaxiv.org/abs/2607.02255)

### TL;DR

Long-task agents shouldn't stuff all conversation history into context. Instead, use a "bounded contract": each decision's input is structured extraction from five typed memory layers, keeping prompt size always bounded. Uses hundreds of consecutive decisions in *Slay the Spire 2* as the testbed, with 298 published traces for comparative research.

### Read Priority

Must-read.
Any engineer building long-task agents (customer service bots, research assistants, code maintenance agents) struggling with "context keeps growing but performance keeps dropping" — AgenticSTS's five-layer memory design is an architecture blueprint you can reference directly.

### Domain Background

The memory problem for long-task LLM agents plagues virtually every production system: stuffing all conversation history into context is not only expensive but degrades reasoning quality beyond a certain length (the "lost in the middle" problem); summarization risks losing critical decision details. Prior work (Memento, Memory-R2, etc.) mostly focused on "how to retrieve better," but whether memory's "type structure" and "prompt assembly logic" can be systematically designed and ablated has received little rigorous attention.

### Intermediate Guide


#### Problem

An agent that needs to run hundreds of decision steps (e.g., a long-term research assistant, automated code reviewer, or strategic game AI): if every step includes all preceding context, the prompt explodes; if it only keeps the last few steps, it forgets critical early information. How do you balance "remembering what matters" with "not blowing up the prompt"?

#### Method

AgenticSTS proposes a **bounded memory contract**: each decision's input `u_d = π(L1, L2(s), L3(s), L4(s), L5(s))` is assembled from five structured memory layers, **never directly appending raw cross-decision transcripts**:
- **L1**: Immutable operator prompts and protocols
- **L2**: Immutable state schema and action format
- **L3**: Static knowledge base (in-game: 577 cards, 121 enemies' data)
- **L4**: Writable episodic memory + post-run summaries
- **L5**: Skill library with write gate (strategic skill store)

#### Why It Matters

Each memory layer can be independently ablated, letting engineers precisely know "which layer is actually contributing performance" — rather than facing a black-box RAG + memory hybrid. The implication for platform developers: memory design should be a typed, bounded, observable system component, not an afterthought patch.

### Deep Dive

- **Testbed**: *Slay the Spire 2* — a closed-rule stochastic card game requiring hundreds of tactical and strategic decisions per run, a rigorous environment for testing long-task planning
- **Ablation results** ⚠️ (N=10, directional, not statistically significant):
  - Baseline (no memory): 3/10 wins
  - Prompt-only (L1/L2 only): 4/10 wins
  - Adding L5 skills (Mode A/B): **6/10 wins**
  - Full (all layers): **6/10 wins**
  - Fisher exact p ≈ 0.37, insufficient sample size — do not treat as conclusive
- **Public resources**: 298 traces, memory snapshots, prompt records and scripts, designed as reproducible comparison evaluation assets
- **Difference from mainstream approaches**: RAG-based memory (e.g. mem0, Zep) focuses on "better retrieval"; AgenticSTS focuses on "memory's type contract and prompt assembly architecture" — the two are complementary
- **Limitation**: Small experiment scale (N=10), results are directional only; Slay the Spire 2 is a closed-rule game, and generalization to open-world long tasks remains unvalidated
- **Deployment bar**: Requires clearly defining each memory layer's types and write gate logic; systems with existing memory modules need refactoring, not minor tweaks
- **Submission status**: EMNLP 2026 ARR under review

### Reviewer's One-Liner

The five-layer architecture design is clean and ablatable — a valuable methodological contribution to memory research; but N=10 experimental results cannot achieve statistical significance, and the paper honestly flags this, which is a plus. Overall a "right question, good tooling, needs larger-scale validation" directional work — current value lies in the architectural template, not the performance numbers.

### Your Take-away

- If your agent has the "context keeps growing but performance doesn't follow" problem, AgenticSTS's five-layer typed design is an architecture checklist you can directly compare against your system: does L1 exist, is L3 knowledge base separated from L4 episodic memory, does L5 skill library have explicit write gate conditions
- The 298 published traces serve as reference for designing similar long-task testbeds — the prompt record format is especially helpful for understanding context assembly logic

---


## Paper 3 ｜ Spider 2.0-AIFunc: Extending Real-World Text-to-SQL to AI-Native SQL Workflows

**Authors**: Tianyang Liu, Canwen Xu, Fangyu Lei, Nikki Lijing Kuang, Jixuan Chen, Tao Yu, Julian McAuley, Zhewei Yao, Yuxiong He · **Affiliations**: UC San Diego / Microsoft / Columbia University et al. · **arxiv**: 2607.06229
**Links**: [arxiv](https://arxiv.org/abs/2607.06229) · [alphaxiv](https://www.alphaxiv.org/abs/2607.06229)

### TL;DR

Cloud data platforms like Snowflake have embedded LLMs directly into SQL (AI_CLASSIFY, AI_COMPLETE, etc.), but existing text-to-SQL benchmarks completely miss this "AI-native SQL." This paper establishes a 465-task evaluation set; the strongest model achieves only ~67% accuracy — a brand-new capability gap for data agents.

### Read Priority

Must-read.
If your agent platform connects to cloud data warehouses (Snowflake, BigQuery, etc.), or you're building data analyst agents, this paper reveals a blind spot you may not have realized — current models perform far worse on AI-native SQL than on traditional SQL.

### Domain Background

Text-to-SQL is the core capability for AI-assisted data analysis, and Spider 2.0 is the field's benchmark standard (ICLR 2025 oral). Over the past year, Snowflake's Cortex AI Functions, BigQuery's BQML, and similar offerings let analysts run `SELECT AI_CLASSIFY(review_text, ['positive','negative'])` for sentiment analysis right inside SQL — without leaving the database environment. But this "AI-native SQL" has syntax and parameter specs fundamentally different from traditional SQL, and no existing benchmark has evaluated it.

### Intermediate Guide


#### Problem

Imagine a data analysis agent — a customer asks "find me the 100 orders with the most negative reviews from last year." In a Snowflake Cortex environment, the correct approach is `SELECT order_id FROM reviews WHERE AI_CLASSIFY(text, ['positive','negative']) = 'negative' ORDER BY date DESC LIMIT 100` — but current models almost universally don't know that AI_CLASSIFY exists, let alone its parameter format. No existing text-to-SQL benchmark evaluates this scenario.

#### Method

This paper builds **Spider 2.0-AIFunc** on top of Spider 2.0 (Snowflake subset):
- Uses an agent-based pipeline to rewrite existing tasks into AI-native versions, updating both target queries and natural language instructions
- **465 validated tasks** across **125 real databases**
- Covers **6 types** of Snowflake Cortex AI functions (AI_COMPLETE, AI_CLASSIFY, AI_FILTER, AI_SIMILARITY_SCORE, etc.)
- Evaluation: give the agent bash tools (schema exploration) + SQL execution tools, measure execution accuracy

#### Why It Matters

AI-native SQL represents a paradigm shift happening at the data infrastructure layer — the boundary between analytical logic and AI reasoning is dissolving. If agent platforms don't provide specialized training or tool support for this capability, they'll perform like beginners who don't know the new syntax in cloud data scenarios.

### Deep Dive

- **Model performance**: Strongest proprietary models (GPT series) achieve execution accuracy of roughly **67%–70%** ⚠️; best open-source model reaches **58.1%**; gaps come mainly from three areas: predicate specification, schema grounding, and AI function parameterization
- **Counterintuitive finding**: Complex agents designed for traditional text-to-SQL (multi-round schema retrieval, table selection, etc.) **perform no better than minimal agents** — AI-native SQL requires understanding the AI functions themselves, not schema exploration
- **Benchmark construction method**: Uses an agent pipeline to automatically rewrite tasks while maintaining ground truth verifiability (execution result consistency) — this construction method itself is noteworthy as a reference for building similar benchmarks
- **Framework implications**: LangChain/LangGraph SQL toolkits need to extend their schema descriptions for AI-native SQL functions; text-to-SQL fine-tuning datasets need AI function usage examples
- **Snowflake dependency**: The benchmark currently targets Snowflake Cortex; BigQuery BQML, Azure SQL AI Functions, and similar ecosystems are not yet included — cross-platform generalization is a future research direction
- **Limitation**: The 465 tasks are primarily agent-generated and validated, with limited manual review; semantic correctness of AI functions (e.g., whether classification criteria are reasonable) is beyond execution accuracy's evaluation scope

### Reviewer's One-Liner

Forward-looking problem selection with perfect timing — AI-native SQL is indeed a real-world gap completely ignored by existing benchmarks; the construction method is clever (agent rewrite + automatic validation). The 67% peak accuracy is lower than expected, but note this is execution accuracy not semantic accuracy — real-world usability may be more complex. Overall a useful paper that pushes data agent capability evaluation one step forward.

### Your Take-away

- If your agent connects to Snowflake, add Snowflake Cortex AI Functions syntax and parameter formats to your system prompt or tool descriptions now — models don't know these functions by default, and this is an improvement you can make today
- When evaluating data agent capabilities, add Spider 2.0-AIFunc to your evaluation matrix; if your use case involves AI-native SQL, traditional Spider 2.0 scores don't reflect real-world capability


## References

- [arxiv:2607.07321](https://arxiv.org/abs/2607.07321)
- [arxiv:2603.04900](https://arxiv.org/abs/2603.04900)
- [arxiv:2607.02255](https://arxiv.org/abs/2607.02255)
- [arxiv:2607.06229](https://arxiv.org/abs/2607.06229)
