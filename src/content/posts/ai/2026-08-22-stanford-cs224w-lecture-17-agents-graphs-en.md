---
title: "Stanford CS224W Lecture 17: Agents + Graphs: Retrieval, Planning, and Action in Structured Worlds"
date: 2026-08-22
category: ai
type: deep-dive
tags: [cs224w, stanford, graph-neural-network, graph-machine-learning]
lang: en
series:
  name: "Reading Stanford CS224W"
  order: 18
tldr: "A Fall 2025 slide-grounded reconstruction of Lecture 17, covering From graph QA to agents, Multimodal retrieval in STaRK, Tool use and traversal while documenting the public-material boundary."
description: "The complete agenda and self-study notes for Stanford CS224W Fall 2025 Lecture 17, without substituting the 2021 recordings."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-stanford-cs224w-lecture-17-agents-graphs)

This is **Lecture 17 of Stanford CS224W: Machine Learning with Graphs, Fall 2025**, dated 2025-11-20. It follows the [course schedule](https://web.stanford.edu/class/cs224w/) and the [official slide artifact linked in that row](https://web.stanford.edu/class/cs224w/slides/2025-cs224w-lecture.pdf); speaker attribution follows the slides.

## Materials and gaps

Public materials include the official slides and optional readings on the schedule. Canvas video, live Q&A, board work, and Ed discussions are unavailable and are not reconstructed. The public 2021 videos are not evidence for a 2025 lecture. Where a slide filename differs from the lecture number, the Fall 2025 schedule row remains canonical.

## Complete lecture agenda

### 1. From graph QA to agents

Graph QA often assumes one retrieval step followed by prediction. An agent can rewrite a query after observations, traverse neighbors, call tools, and decide when to stop. Each added degree of autonomy adds a failure and cost source.

### 2. Multimodal retrieval in STaRK

STaRK combines text, relations, and structure in a retrieval benchmark whose queries may require semantic and multi-hop evidence. Vector similarity can miss relational constraints, while graph distance alone cannot interpret natural-language conditions.

### 3. Tool use and traversal

An agent may expose neighbor lookup, attribute filters, reranking, or external search as tools. Every traversal should log input, output, and selection rationale so retrieval, planning, and generation failures remain distinguishable.

### 4. Adaptive planning in AvaTaR

AvaTaR-style methods adapt traversal from feedback: retrieve candidates, observe results, and choose the next step rather than executing one fixed path. This helps with unfamiliar schemas but can create loops and excessive tool calls.

### 5. Evaluating success, cost, and traceability

Evaluation should include final Hit@K or answer accuracy alongside step count, tool cost, stopping behavior, evidence traces, and failure categories. A maximum step budget and saved trace are the first executable guardrails.

## Deep lecture agenda

### From QA to an agent

One-shot graph QA fixes retrieval before answering. An agent can reformulate a query, choose a tool, traverse neighbors, backtrack, and stop after observing results. This turns a fixed pipeline into a policy, but adds loops, tool errors, cost, and reproducibility problems.

### A structured environment

The graph defines state and actions: current entities and evidence form the state, while actions follow edges, filter attributes, search text, or call an external API. Tool schemas must specify inputs, outputs, and errors so the LLM cannot invent relations or issue invalid queries.

### The STaRK task

STaRK-style benchmarks retrieve answers to natural-language queries from semi-structured graphs, where success depends on text attributes and multi-hop relations. Pure vector similarity misses relational constraints, while pure graph distance misses semantics, making the task a test of hybrid retrieval.

### Retriever baselines

Compare BM25 or text embeddings, graph heuristics, GNN retrieval, and LLM reranking under the same candidate universe and Hit@K protocol. If an agent begins from stronger candidates, its gain cannot all be credited to planning; initial retrieval quality must be reported separately.

### Traversal

At each step the agent selects an entity or relation and receives neighbors. High-degree nodes cause action explosion, so top-k pruning, relation filters, or summaries are needed. Because pruning may delete the gold path, log every candidate list, chosen action, and gold-path survival.

### Planning

Planning may generate all subgoals first or interleave reasoning with actions. A fixed plan is auditable but brittle on an unknown schema; adaptive planning reacts to observations but can loop. Maximum steps, a visited set, and explicit stop criteria are required guardrails.

### AvaTaR

AvaTaR-style adaptive traversal uses retrieval feedback to choose the next step instead of committing to one path. Evaluation must distinguish a wrong relation choice, missed entity, tool failure, and generator misreading, because these failures require different fixes.

### Memory

An agent may retain a short-term trace, retrieved evidence, or long-term schema knowledge. Memory that persists answer-bearing information across test examples contaminates evaluation, so episode boundaries, cache keys, and cross-task learning policy must be explicit.

### Grounding

The final answer should cite a graph evidence path and source attributes. Merely retrieving evidence does not prove support: relation direction and time still matter, and an edge generated by the LLM but absent from the graph is a hallucination.

### Cost

Every step consumes LLM tokens, graph queries, reranking, and wall time. A success gain obtained with ten times more calls is a different deployment tradeoff. Report average and percentile steps, tokens, latency, timeouts, and loop rate alongside accuracy.

### Safety

If tools can mutate a graph or external state, read and write authority must be separated. The self-study setting should use read-only tools, a sandbox, and step limits; retrieval capability does not authorize graph mutation.

### Acceptance

Create a one-hop lookup, a multi-hop constraint query, and a query with a high-similarity distractor. Hold the initial retriever fixed while comparing a fixed pipeline and adaptive agent. Save action traces, gold-path survival, final evidence, and cost, then rerun under renamed node IDs and permuted tool results.

## Implementation, failure modes, and acceptance

### Schema discovery

On an unfamiliar graph, the agent may inspect node and edge types plus sample attributes. This tool also consumes budget and must not reveal hidden labels. Compare full-schema, partial-schema, and no-schema settings separately.

### Tool errors

Queries may time out, return empty results, be denied, or be malformed. The policy should choose among retry, reformulation, and stopping under a retry cap. Inject controlled failures to test whether it loops or fabricates a successful result.

### Stopping

Correct stopping means evidence is sufficient, not merely that tokens are exhausted. Let the agent answer, abstain, or continue, and report premature stops, unnecessary steps, and budget exhaustion to expose the success-cost frontier.

### Counterfactual evidence

Removing the gold edge or changing a constraint should change the answer; adding irrelevant high-similarity nodes should not. These counterfactuals test whether the agent uses graph evidence rather than guessing from language priors.

### Reproducibility

LLM sampling, tool-result order, and graph updates produce variance. Freeze model version, temperature, seed, and tool snapshot, then report repeated-run distributions. Selecting only a successful trajectory creates severe selection bias.

### Authority

Place read-only traversal and write actions in separate tool namespaces. When the task requires retrieval only, grant no mutation capability. Any write would need preview, exact target validation, and human approval rather than being inferred from agent capability.

## Self-study checkpoint

Use oracle experiments to establish ceilings. An oracle retriever with the real planner isolates planning and reading; an oracle gold path with the real generator isolates answering; both oracles test formatting and evaluation. The gaps show whether to invest in retrieval, planning, or generation instead of assuming more traversal helps.

Build a trajectory evaluator that labels each action as valid, useful evidence, redundant, error recovery, or hallucinated tool use. A correct answer reached through false evidence is not fully grounded, while a wrong answer after retrieving the gold path points to the reader rather than the planner. Report task success, grounded success, and oracle-reader success separately.

Sweep maximum steps through 1, 3, 5, and 10 while holding everything else fixed, then plot success, groundedness, tokens, and latency. If added steps only create loops, tighten stopping; if gold-path survival rises but answer quality does not, improve the reader.

Finally, permute tool-result order and inject empty results. The answer should not depend on neighbor ordering, and an empty result should trigger reformulation or abstention rather than an invented edge. Cap retries and preserve each error code and following action for replay.

Decompose the pipeline into graph construction, retrieval or sampling, encoder, prediction head, and evaluation. Replace one component at a time and retain cost and failure traces so any improvement remains attributable.

## References

- [CS224W Fall 2025 schedule](https://web.stanford.edu/class/cs224w/)
- [Lecture 17 official slides](https://web.stanford.edu/class/cs224w/slides/2025-cs224w-lecture.pdf)
