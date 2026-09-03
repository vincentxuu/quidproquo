---
title: "AI Agent Arxiv Digest — 2026-07-02"
date: 2026-07-02
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-rag, agent-memory, agent-evaluation]
lang: en
description: "Three papers tackling three core Agent platform challenges: **upgrading memory from retrieval to reasoning state** (User as Code), **removing the central orchestrator while cutting costs** (DeLM), and **letting users quickly verify Web Agent results** (HANSEL)."
tldr: "Three papers tackling three core Agent platform challenges: **upgrading memory from retrieval to reasoning state** (User as Code), **removing the central orchestrator while cutting costs** (DeLM), and **letting users quickly verify Web Agent results** (HANSEL). Together, they form a near-complete technical map for a high-trust Agent platform — memory layer, coordination layer, and explainability layer, each addressed by one paper."
series:
  name: "AI Agent Arxiv Digest"
  order: 39
---
> 🌏 [中文版](/posts/daily/2026-07-02-ai-agent-arxiv-digest)

## Today's Overview

Three papers tackling three core Agent platform challenges: **upgrading memory from "data retrieval" to "reasoning over state"** (User as Code), **removing the central orchestrator while cutting costs** (DeLM), and **letting users quickly verify Web Agent results** (HANSEL). Together, they form a near-complete technical map for a high-trust Agent platform — memory layer, coordination layer, and explainability layer, each addressed by one paper.

## Key Terms

| Explanation | Term |
|---|---|
| Persistent storage that lets an Agent remember user preferences and history across conversations — not the chat window itself, but a separate store for "things to recall next time" | Agent Memory |
| How memories are "fetched back"; the most common approach uses semantic similarity search, similar to how Google search works | Retrieval |
| A system where multiple AIs collaborate to complete a task; think of it as a project team where each agent handles a different subtask | Multi-Agent System (MAS) |
| The "manager" in a MAS responsible for dispatching tasks and aggregating results; DeLM's core claim is eliminating this single point | Orchestrator |
| The step-by-step record an Agent leaves while executing a task; for Web Agents, this includes pages visited, data extracted, etc. | Trajectory |


---


## Paper 1 | User as Code: Executable Memory for Personalized Agents

**Authors**: Bojie Li (Pine AI)　·　**arxiv**: 2606.16707
**Links**: [arxiv](https://arxiv.org/abs/2606.16707) · [alphaxiv](https://www.alphaxiv.org/abs/2606.16707)

### TL;DR

Upgrade the "user model" from a pile of text notes to directly executable Python code, enabling Agents not just to "look up facts" but to compute and reason over user state.

### Read Priority

Must-read.
Agent personalization is one of the hottest demands of 2026; this paper fundamentally redefines "what memory should look like" and is almost directly usable for engineers building personalization features.

### Background

AI Agents need to remember user preferences across multiple conversations — for example, you tell an Agent "I don't eat nuts," and it should still remember when ordering food next week. Existing systems almost universally store these preferences as plain text or knowledge graphs, then retrieve them via semantic search. The problem: "retrieving similar memories" and "reasoning over user state" are two different things. Text-based memory struggles with logical conflicts, cross-record aggregation, and complex "if…then…" rules.

### Mid-Level Walkthrough


#### Problem

Imagine your Agent has stored a hundred entries about your dietary preferences, schedule notes, and spending habits. Now it needs to answer: "How much did I spend eating out this month?" This is an aggregation computation, not "find the most similar memory" — but every retrieval-based memory system answers this poorly because they can't take a hundred entries and calculate over them.

#### Approach

User as Code (UaC) stores the user model as Python code: typed Python objects describe the user's "state" (e.g., `user.monthly_food_budget`), and Python functions describe "rules" (e.g., "if the order contains peanuts, mark as reject"). This code is live — after each conversation, the Agent appends new information to an event log and periodically checkpoints it into structured code. To answer a question, it directly executes this code to compute the answer.

#### Why It Matters

For platform developers, UaC means "user memory" shifts from blob storage + vector search to a version-controlled codebase. Memory logic becomes testable, auditable, and diffable. For PMs, personalization accuracy can leap from "roughly correct" to "precisely computed."

### Key Details

- **Two-phase pipeline**: append-only event log (never deletes records) → periodic checkpoint into structured Python code; inspired by the event sourcing design pattern from databases
- **LOCOMO benchmark**: 78.8% on general factual questions, on par with the full-context upper bound and the strongest retrieval-based systems
- **The aggregation cliff**: retrieval-based memory scores only 6–43% on aggregate questions; UaC achieves **99%** — this gap is the paper's core argument
- **Comparison with MemGPT / Mem0**: existing mainstream systems still center on text + retrieval; UaC is the first paper to store the entire user model as executable code (per the authors)
- **Limitation**: code generation depends on the LLM — if it produces buggy code, errors fail silently; LOCOMO is relatively small-scale, and stability under large-scale deployment remains unverified
- **Adoption threshold**: requires the underlying LLM to reliably output correct Python; code quality for complex user logic strongly depends on model capability
- **Author**: Bojie Li, Pine AI; single-author paper from an independent research lab with limited academic track record but strong engineering orientation

### Reviewer's One-Line Take

Novel idea; the 99% vs. 6–43% gap on aggregate questions is compelling. But LOCOMO is a relatively small and clean benchmark; real user behavior is messier and more contradictory, and code checkpoint quality on edge cases is the biggest open question. Worth tracking, but don't ship to production before stress-testing.

### Your Take-Away

- Building Agent personalization → read Section 3 (two-phase pipeline architecture) and check whether your current memory solution has the same "aggregation blind spot"
- Designing a memory-layer schema → ask yourself: is the user asking "which entry is most relevant" or "aggregate across many entries"? The former is fine with RAG; the latter calls for UaC or a hybrid approach

---


## Paper 2 | DeLM: Decentralized Multi-Agent Systems with Shared Context

**Authors**: Yuzhen Mao, Azalia Mirhoseini (Stanford University)　·　**arxiv**: 2606.10662
**Links**: [arxiv](https://arxiv.org/abs/2606.10662) · [alphaxiv](https://www.alphaxiv.org/abs/2606.10662)

### TL;DR

Replace the "one manager dispatches all tasks" architecture in Multi-Agent systems with "all agents read from a shared verified progress board and claim tasks themselves" — on SWE-bench, this cuts costs by 50% while scoring higher.

### Read Priority

Must-read.
This paper directly challenges the core assumption of LangGraph / AutoGen (centralized orchestrator). Anyone building multi-agent pipelines or evaluating agent frameworks should read this as a key counterexample.

### Background

Most existing Multi-Agent Systems (MAS) are centralized: one Orchestrator breaks a large task into subtasks, dispatches them to worker agents, and aggregates outputs. This works at small scale, but as subtasks multiply, the Orchestrator becomes a bottleneck — its context grows endlessly as it tracks all agents' states and resolves conflicts, with inference costs scaling linearly.

### Mid-Level Walkthrough


#### Problem

Imagine a software engineering Agent system that needs to fix 100 bugs. The centralized approach: one orchestrator continuously reads the status of all 100 bugs, decides who handles which, and integrates patches. The problem is that this orchestrator's context keeps growing, and inference costs explode linearly.

#### Approach

DeLM removes the central Orchestrator and replaces it with three components:
1. **Task Queue**: all pending subtasks are listed here
1. **Shared Verified Context**: all agents can read "confirmed completed progress"
1. **Parallel Agents**: agents claim tasks from the Queue on their own; once done, they write verified updates back to Shared Context
Agents don't need direct communication — they only read/write shared state. Each agent's context stays small and focused.

#### Why It Matters

This architecture is fundamentally different from mainstream frameworks (LangGraph's graph-based flows, AutoGen's group chat), more closely resembling a database event-sourcing + worker-pool pattern. For platform developers, scaling out can be as simple as adding worker pods rather than redesigning orchestrator logic.

### Key Details

- **SWE-bench Verified**: using Gemini 3-Flash, achieves 65.7%, **+10.5pp** above the strongest centralized baseline, at roughly **50%** lower cost ⚠️ (figure from VentureBeat reporting; verify against the original paper's Table)
- **LongBench-v2 Multi-Doc QA**: achieves the highest average accuracy across four frontier models; demonstrates the architecture works beyond coding, extending to long-document reasoning
- **Shared Context verification mechanism**: information written back by agents must pass verification before entering Context, preventing erroneous information from polluting downstream agents; specific verification method (unit test? LLM judge?) — check paper Section 3 for details
- **Relationship to AutoGen / LangGraph**: DeLM proposes an architectural pattern; in theory, a similar shared-state node could be implemented on top of LangGraph
- **Open-source implementation**: GitHub `yuzhenmao/DeLM`, maturity to be confirmed
- **Limitation**: concurrency consistency and write-conflict resolution for Shared Context remain unclear; fault tolerance mechanisms for real-world deployment are not addressed in the paper
- **Author background**: Azalia Mirhoseini is a Stanford professor, formerly at Google/DeepMind — high credibility

### Reviewer's One-Line Take

Clean architectural thinking; SWE-bench numbers are impressive, and the Stanford pedigree adds credibility. But the 50% cost reduction's baseline setup (token counting methodology, whether overhead is included) needs careful verification; the concurrency issues with Shared Context appear glossed over in the paper — this reads more as a research prototype than a production-ready framework.

### Your Take-Away

- Designing a multi-agent pipeline → use DeLM's shared-context pattern to evaluate whether your current Orchestrator is a cost/latency bottleneck, especially when subtasks exceed 10
- Choosing an agent framework → ask vendors "how do you support stateful shared context and async task claiming" — this paper gives you the vocabulary for framework evaluation

---


## Paper 3 | HANSEL: Extracting Breadcrumbs from Web Agent Trajectories for Interactive Verification

**Authors**: Yujin Zhang, Daye Nam (University of California, Irvine)　·　**arxiv**: 2606.18671
**Links**: [arxiv](https://arxiv.org/abs/2606.18671) · [alphaxiv](https://www.alphaxiv.org/abs/2606.18671)

### TL;DR

After a Web Agent completes a task, HANSEL automatically extracts the "most critical pages" from its browsing history for users to click through and verify — reducing trajectory volume by 61% compared to reviewing the full log.

### Read Priority

📖 Skim.
Worth a quick read if you're interested in Agent explainability / user trust; if your biggest pain point right now isn't Web Agent observability, save it for later.

### Background

Web Agents (e.g., OpenAI Operator, Claude Computer Use) can automatically perform online tasks for users: price comparison, booking, form filling. But how does the user know if the agent made a mistake? Currently, options are either "replay the full trajectory" (dozens of screenshots nobody finishes reviewing) or have an LLM auto-summarize (which may hallucinate).

### Mid-Level Walkthrough


#### Problem

You ask a Web Agent to find three hotels, compare prices including breakfast, and filter out poorly-reviewed ones. It runs 40 steps and recommends Hotel A. You want to verify, but reviewing a 40-step log takes 10 minutes — you skip it, but feel uneasy trusting the result blindly.

#### Approach

HANSEL (Highlighting Agent Navigation Steps as Evidence Links) automatically identifies "pages that provided the basis for the final answer" from the trajectory, preserving their interaction state (filters applied, search terms, scroll positions) so users can click through and re-verify. If an answer can't be traced back to any visited page, HANSEL explicitly flags "the gap."

#### Why It Matters

Trust is the biggest barrier to Web Agent deployment. HANSEL provides a lightweight "audit trail" solution — no need for full replay, just review the key pages. For platform providers, this is a practical path to improving user trust and reducing manual review costs.

### Key Details

- **Evaluation set**: AssistantBench + Online-Mind2Web, 45 tasks total (relatively small scale)
- **Core metrics**: evidence page identification at **83.7% precision / 88.8% recall**; trajectory compression of **61.6%** (keeping only key pages)
- **Interaction state preservation**: filters, query strings, scroll positions are all recorded and reproducible — more valuable for verification than plain screenshots
- **Gap detection**: displays a warning when agent answers cannot be traced to any visited page; provides indirect help in detecting hallucinations
- **Difference from Playwright trace / LangSmith**: existing tools record "operation steps"; HANSEL records "reasoning evidence pages" — a different level of abstraction
- **Limitation**: 45-task evaluation set is small; only evaluates agents with structured trajectory logs — black-box agents can't be integrated; impact of dynamic page loading and login walls on accuracy is unknown
- **Adoption threshold**: requires the agent itself to output structured trajectories with page content + reasoning; most existing agents don't retain this information

### Reviewer's One-Line Take

Precisely-defined problem, clean solution, and the gap detection design is a particular highlight. But 45 tasks is too small an evaluation set, and they all come from relatively clean benchmarks — this is a directionally-correct research prototype, not yet a production-ready tool.

### Your Take-Away

- Building a Web Agent product → add "evidence page extraction" to your UX roadmap; even without HANSEL itself, the UX pattern of "letting users one-click verify the agent's sources" is worth designing in now
- Building an agent observability platform → HANSEL's gap detection logic (whether answers have trajectory support) can serve as a monitoring signal in your alerting system


## References

- [arxiv:2606.16707](https://arxiv.org/abs/2606.16707)
- [arxiv:2606.10662](https://arxiv.org/abs/2606.10662)
- [arxiv:2606.18671](https://arxiv.org/abs/2606.18671)
