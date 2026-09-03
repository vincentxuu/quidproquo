---
title: "AI Agent Arxiv Digest — 2026-08-13"
date: 2026-08-13
category: daily
type: digest
tags: [ai-agent, arxiv, daily, agent-memory, multi-agent, agent-security]
lang: en
description: "All three papers today tackle the same core problem — agent memory needs to be editable, access-controlled, and shareable across agents, and each layer introduces new failure modes"
tldr: "EvoGraph-Mem uses a failure-aware editable graph to let agent memory self-correct, preventing stale insights from poisoning decisions; MAP-Graph turns provenance tracking from post-hoc audit into real-time access control, achieving 95% success across 2,700 synthetic tasks; MaSRead shows multi-agent KV cache sharing is possible but requires content-addressed reading instead of positional addressing"
series:
  name: "AI Agent Arxiv Digest"
  order: 81
---

> 🌏 [中文版](/posts/daily/2026-08-13-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers dissect agent memory challenges at three distinct layers. EvoGraph-Mem discovers that append-only memory rots over time — stale insights keep getting retrieved and become decision poison — so it designs an editable graph memory that lets agents identify which memories to keep, revise, or archive. MAP-Graph pushes the problem up a layer: when multiple agents share memory, semantic relevance doesn't equal access permission, and summaries can mask private or contaminated sources, so it uses provenance tracking as real-time access control rather than post-hoc auditing. MaSRead pushes down to the infrastructure layer: agents can directly share KV cache fragments instead of text, but merged caches can't be read positionally — they require content-addressed access. Together, the three papers outline a clear stack: memory must be self-correcting (EvoGraph-Mem), access-controlled (MAP-Graph), and efficiently shareable at the infrastructure level (MaSRead).

## Key Terms

| Term | Plain Explanation |
|---|---|
| Memory Pollution | An agent repeatedly retrieves stale or incorrect stored insights, causing new decisions to be biased by old errors |
| Provenance Tracking | Recording where each piece of information came from and what reasoning steps it went through, used to assess trustworthiness and access permissions |
| KV Cache | Key-value pairs cached by a Transformer during inference, storing the computational state of what the model has "read" |
| CRDT (Conflict-free Replicated Data Type) | A data structure that allows multiple nodes to modify independently and merge afterward, guaranteeing eventual consistency |
| Path Trust | Multiplying trustworthiness scores along an information derivation chain — more intermediary steps means lower trust |

---

## Paper 1 | EvoGraph-Mem: Failure-Aware Editable Graph Memory for Self-Correcting Agent Memory

### EvoGraph-Mem: Failure-Aware Editable Graph Memory for Long-Term Language Agents
Yuxi Qian, Yuxiang Ren · arxiv: 2608.11248

Links: [arxiv](https://arxiv.org/abs/2608.11248) · [alphaxiv](https://www.alphaxiv.org/abs/2608.11248)

### TL;DR

Upgrades agent memory from an "append-only log" to an "editable insight graph" where each insight tracks supporting and contradicting evidence plus activation state, enabling memory self-correction instead of repeated pollution from stale insights.

### Read Priority

Must-read — if your agent runs more than a few dozen task rounds, memory quality degradation is nearly unavoidable. This paper offers the most complete architecture for "memory maintenance" to date.

### Background

Existing memory-augmented agents mainly solve "how to store" and "how to retrieve" but rarely address "what happens when stored information becomes outdated." Previously distilled insights can become stale, over-generalized, or even harmful as tasks evolve, and when these insights are repeatedly retrieved, they cause memory pollution.

### Mid-Level Walkthrough

- **Problem**: Imagine your agent learns at round 10 that "retry three times on timeout," but by round 50 the system architecture has changed and retries now trigger rate limiting. This stale insight gets retrieved every time due to high semantic relevance to timeout, causing the agent to make wrong decisions repeatedly.
- **Method**: Build an editable insight graph — each insight node tracks positive evidence (used successfully), negative evidence (used and failed), and activation state. After task execution, the graph controller does four things: retain reliable insights, archive failed insights, revise outdated insights, and add newly discovered reusable insights. Retrieval uses a utility-aware mechanism that prioritizes nodes with more positive evidence and no recent failures.
- **Why it matters**: "Append-only memory isn't enough for long-term tasks" is no longer just intuition — this paper proves it directly through ablation studies. For agent platforms, memory maintenance needs to be treated as a first-class citizen alongside memory retrieval.

### Deep Dive

- Consistently outperforms existing memory-augmented agent baselines across multiple backbone models ⚠️ (author-evaluated, awaiting external replication)
- Ablation shows significant performance drop when graph editing is removed, proving append-only is insufficient
- Utility-aware retrieval outperforms pure semantic similarity retrieval
- Deployment overhead: requires running graph update logic after each task; additional latency is acceptable for small-scale deployments
- Compatible with LangGraph / CrewAI — can serve as a memory layer plugin
- Limitation: currently tested on structured tasks; effectiveness in open-ended conversational scenarios remains unvalidated

### Reviewer's One-Line Take

Clean architecture design; the positive/negative evidence tracking plus archival mechanism is a real contribution to memory maintenance. But the granularity of "insights" isn't deeply discussed — too coarse mixes in irrelevant information, too fine leads to fragmentation.

### Your Take-Away

- If your agent runs 20+ task rounds and performance degrades over time: directly reference EvoGraph-Mem's positive/negative evidence tracking mechanism, adding a "failure counter" and "auto-archive" layer on top of your existing memory module
- If you're designing an agent memory API: expose "delete/revise/archive" as operations equally important as "add/retrieve"

---

## Paper 2 | MAP-Graph: Provenance-Driven Real-Time Access Control for Multi-Agent Shared Memory

### MAP-Graph: Provenance-Aware Shared Memory for Multi-Agent Workflows
Yiqi Wang, Zihao Yan, Jiaqi Zhang et al. · arxiv: 2608.10509

Links: [arxiv](https://arxiv.org/abs/2608.10509) · [alphaxiv](https://www.alphaxiv.org/abs/2608.10509)

### TL;DR

In multi-agent shared memory, semantic relevance doesn't equal access permission — MAP-Graph uses a provenance graph for real-time permission filtering and path-trust ranking, achieving 94.96% overall success rate and 72.70% precise decision accuracy across 2,700 synthetic tasks.

### Read Priority

Must-read — once a multi-agent system shares memory, permissions and trust are not optional. This paper elevates provenance from "post-hoc audit" to "real-time control" and is the most complete design to date.

### Background

In multi-agent workflows, shared memory lets agents reuse other agents' outputs, but problems follow: summaries can mask underlying source permission restrictions, and a seemingly harmless summary may contain private, contaminated, or revoked information. Existing approaches provide semantic retrieval, scoped access, or lineage tracking, but none separate hard authorization from graded trust.

### Mid-Level Walkthrough

- **Problem**: Agent A summarizes internal financial data and stores it in shared memory. Agent B finds this summary via semantic search and uses it to answer an external customer — data leak, yet neither agent did anything wrong. The issue is that "semantically relevant" was treated as "allowed to access."
- **Method**: MAP-Graph builds a typed execution graph where nodes are agents, sources, memories, claims, and actions. Retrieval follows three steps: (1) Permission filtering — exclude records that violate access rules; (2) Path-trust ranking — multiply trust scores along the derivation chain, then re-rank combined with semantic similarity; (3) Risk-sensitive gating — decide whether to proceed based on action risk level, while preserving affected lineage for audit.
- **Why it matters**: When multi-agent systems start handling real enterprise data, "who can see what" is no longer a feature request but a compliance baseline. MAP-Graph demonstrates that provenance tracking can serve both security and performance.

### Deep Dive

- 2,700 synthetic tasks (three domains), 94.96% overall success rate, 72.70% precise decisions
- Clean scenario (requiring correct pass-through rather than security blocking) success rate 90.22% ⚠️ (author-evaluated)
- Ablation study isolates contributions of permission filtering, path trust, and action gating
- Precise decision and access control advantages hold across two different backbone models
- Deployment overhead: requires pre-defined permission rules and trust scoring; easier to integrate for enterprises with existing RBAC systems
- Aligns with MCP's resource scoping philosophy — can serve as a memory module at the MCP server layer
- Limitation: currently a synthetic task benchmark; real enterprise workflow complexity is higher

### Reviewer's One-Line Take

Elevating provenance tracking from an audit tool to an access control signal is the right direction, and the typed execution graph design is solid. But the 2,700 synthetic task benchmark is far from real enterprise scenarios, and 72.70% precise decisions may not suffice for high-risk contexts.

### Your Take-Away

- If you're building multi-agent shared memory: add a permission filtering layer before semantic retrieval — don't let RAG similarity scores bypass access control
- If you're designing agent security architecture: treat provenance tracking as a real-time control signal rather than a post-hoc audit log — MAP-Graph's three-step architecture (filter → trust rank → risk gate) is directly adoptable

---

## Paper 3 | MaSRead: Sharing KV Cache Fragments as Memory Across Agents

### MaSRead: Content-Addressed Reading of Replicated Latent Stores
Carlos Baquero, Luis Brito, Joao Resende · arxiv: 2608.11218

Links: [arxiv](https://arxiv.org/abs/2608.11218) · [alphaxiv](https://www.alphaxiv.org/abs/2608.11218)

### TL;DR

Multiple agents can directly share KV cache fragments instead of text, using CRDTs to guarantee merge consistency — but merged caches can't be read positionally. MaSRead uses content addressing and hard attention masks to let subsequent queries selectively read the correct fragments.

### Read Priority

Skim — conceptually groundbreaking but far from production. Worth a deep read if you're working on agent infrastructure or distributed inference; otherwise just note the direction.

### Background

Information exchange between agents today is almost entirely text-based — one agent generates a response, another stuffs the text into its prompt. But text exchange loses computational state: the second agent must re-understand everything the first agent already "thought through." Directly sharing KV caches would skip this redundant computation. The problem is that cache fragments from different agents interfere with each other when merged — being co-located doesn't mean they can be read separately.

### Mid-Level Walkthrough

- **Problem**: Imagine two agents each read different documents and produce their own KV caches. Now a third agent wants to ask a question requiring information from both documents. Merging the two cache segments saves re-encoding cost — but the model's attention conflates the two segments' content, producing wrong answers.
- **Method**: MaSRead solves this in three steps: (1) Use CRDTs to merge cache fragments from different agents, guaranteeing convergence regardless of arrival order or duplication; (2) Starting from the query, use lexical labels to do graph traversal and locate needed fragments; (3) Use hard attention masks to isolate each fragment, decode them one by one, then combine. Decoding cost depends on fragment length, not the entire store size.
- **Why it matters**: This explores pushing inter-agent information exchange from the "text layer" to the "computational state layer." If matured, it could dramatically reduce communication cost and latency in agent collaboration.

### Deep Dive

- Tested on five store structures: chain, pipeline, symmetric, hub, and natural language
- Successfully recovered target fragments under isolation conditions, remaining effective as irrelevant fragments increase
- Cross-model-family transfer tests passed ⚠️ (author-evaluated, limited scale)
- Routing stage still depends on store size; end-to-end performance needs further evaluation
- High deployment bar: requires models to expose KV cache interfaces, which mainstream APIs currently don't support
- Lexical routing may miss semantically related but lexically disconnected evidence
- Limitation: answer composition capability is constrained by the frozen reader model

### Reviewer's One-Line Take

Conceptually very interesting — using CRDTs to let agents share computational state rather than text is a direction worth exploring. But validation is small-scale, and the premise of models exposing KV cache interfaces isn't realistic in the near term.

### Your Take-Away

- If you're building distributed agent infrastructure: MaSRead's "content addressing + hard attention masks" is a design pattern worth tracking, especially as open-source models begin exposing cache interfaces
- If you're evaluating agent communication protocols: file "shared computational state" as a more efficient but longer-term alternative to "shared text" — MCP's text protocol remains the practical choice for now

---

## Today's Takeaway

I used to think the core challenge of agent memory was "how to store" and "how to retrieve." Today revealed the real challenges lie in three deeper layers: stored information expires and needs correction (EvoGraph-Mem), semantic relevance doesn't equal access permission in multi-agent sharing (MAP-Graph), and even the medium for exchanging memory doesn't have to be text (MaSRead). A memory system isn't a "write-and-forget" module — it's a living system that requires continuous maintenance, access control, and supports multiple physical implementations.

## References

- [arxiv:2608.10509](https://arxiv.org/abs/2608.10509)
- [arxiv:2608.11218](https://arxiv.org/abs/2608.11218)
- [arxiv:2608.11248](https://arxiv.org/abs/2608.11248)
