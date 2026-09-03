---
title: "Multi-hop Retrieval: When Answers Are Scattered Across Documents"
date: 2026-09-03
type: deep-dive
category: ai
tags: [multi-hop-retrieval, rag, multi-hop-qa, iterative-retrieval, reasoning, agentic-rag]
lang: en
tldr: "Standard RAG retrieves one set of documents per query, but real questions often need reasoning across 2-4 documents. IRCoT pioneered interleaved retrieval-reasoning, PAR²-RAG beats IRCoT by 23.5% accuracy on four benchmarks, and CompactRAG compresses LLM calls down to just two."
description: "Design principles of multi-hop retrieval, comparison of five major frameworks (IRCoT, ReSP, HANRAG, DualRAG, PAR²-RAG), and their relationship with Agentic RAG and GraphRAG."
draft: false
series:
  name: "RAG 技法大全"
  order: 51
---

> 🌏 [中文版](/posts/ai/2026-09-03-multi-hop-retrieval-rag)

Standard RAG does one retrieval, one generation. That works for single-hop questions like "how do I use this API?", but real-world questions often aren't single-hop: "What was Company A's revenue last year, and how does it compare to Company B?" requires checking two annual reports and comparing them; "What proteins are involved in this drug's side-effect mechanism?" requires chaining findings across multiple papers. According to the [MuSiQue](https://arxiv.org/abs/2108.00573) benchmark design, such questions need 2-4 reasoning hops, and the benchmark deliberately excludes questions solvable through shortcut reasoning.

## Why One Retrieval Isn't Enough

Structural problems with single-hop retrieval:

1. **Information scattering**: Answer fragments are spread across different documents; a single top-k retrieval is unlikely to capture them all
2. **Query ambiguity**: Complex questions embed multiple sub-intents that a single embedding can't simultaneously capture
3. **Reasoning dependencies**: The second hop's query depends on the first hop's result ("Who is Company A's CEO?" → "What other boards does that person sit on?") — you can't form the second query without answering the first

According to [arXiv:2601.00536](https://arxiv.org/abs/2601.00536) (Retrieval-Reasoning Processes for Multi-hop QA: A Four-Axis Design Framework), multi-hop systems are designed along four axes: reasoning mode (implicit vs explicit), retrieval timing (upfront vs interleaved), knowledge integration method, and termination condition.

## Five Major Frameworks

### IRCoT: Interleaved Retrieval and Chain-of-Thought

[IRCoT](https://arxiv.org/abs/2212.10509) (Interleaving Retrieval with Chain-of-Thought Reasoning, 2023) is the foundational work in multi-hop retrieval. The approach: have the LLM generate one CoT reasoning step → use the reasoning output as a query for retrieval → add new evidence to context → continue the next reasoning step, alternating until reasoning completes.

The problem is that computational cost scales linearly with hop count — each round requires a full LLM call, and prompts grow increasingly long.

### ReSP: Retrieve, Summarize, Plan

[ReSP](https://arxiv.org/abs/2407.13101) (WWW 2025 Agent4IR Workshop) improves on IRCoT's two weaknesses: context overload and repetitive planning.

The core design is a **dual-function summarizer**: it produces two summaries from retrieved documents simultaneously — one targeting the global question (stored in global evidence memory), one targeting the current sub-question (stored in local pathway memory). This compresses context length and records the retrieval trajectory to avoid repeated queries.

According to the paper's data, ReSP improves F1 by 4.1 on HotpotQA and 5.9 on 2WikiMultihopQA, with significantly better robustness to context length than IRCoT.

### HANRAG: Noise-Resistant Heuristic Framework

[HANRAG](https://arxiv.org/abs/2509.09713) (Ant Group, 2025) addresses the problem of noise accumulation in iterative retrieval — irrelevant documents brought back in each round contaminate subsequent reasoning.

The approach: a **revelator** module that does three things — routes queries (determines whether multi-hop is needed), decomposes sub-queries, and filters noisy documents. Results show improvements on both single-hop and multi-hop tasks, particularly in scenarios with high noise-document ratios.

### DualRAG: Dual-Process Integration of Reasoning and Retrieval

[DualRAG](https://arxiv.org/abs/2504.18243) (2025) borrows from cognitive science's "dual-process theory" (System 1 fast intuition / System 2 slow reasoning):

- **RaQ (Reasoning-augmented Querying)**: generates targeted queries along the reasoning path
- **pKA (progressive Knowledge Aggregation)**: systematically integrates newly acquired knowledge to maintain reasoning coherence

The two processes are tightly coupled — RaQ's reasoning trajectory guides pKA's knowledge integration, and pKA's integrated knowledge supports RaQ's next reasoning step. The paper also provides fine-tuning methods for smaller models to maintain performance.

### PAR²-RAG: Breadth-First Then Depth-First, Planned Active Retrieval

[PAR²-RAG](https://arxiv.org/abs/2603.29085) (Oracle AI, 2026) is currently one of the highest-performing frameworks. Core idea: separate coverage from commitment.

Two-stage design:
1. **Breadth-first anchoring**: retrieve broadly to build a high-recall evidence frontier
2. **Depth-first refinement**: refine deeply on the evidence frontier with an evidence sufficiency control iterative loop

According to the paper's data, across four MHQA benchmarks, PAR²-RAG achieves up to **23.5%** higher accuracy than IRCoT, with retrieval NDCG improvements of up to **10.5%**.

### CompactRAG: Two LLM Calls for Multi-hop

[CompactRAG](https://arxiv.org/abs/2602.05728) (2026) takes a completely different approach: no iteration, compressing LLM calls to just **two** — once for sub-question decomposition, once for final answer synthesis. Intermediate sub-question resolution uses fixed-cost local modules.

This directly challenges the assumption that "multi-hop necessarily requires multi-round LLM calls." It achieves competitive accuracy while drastically reducing token consumption.

## Framework Comparison

```
Method       Reasoning      LLM Calls  Noise       Key Result
                                       Resistance
───────────────────────────────────────────────────────────────
IRCoT        Interleaved    O(n)       Weak        Foundational work
             CoT
ReSP         Summarize      O(n)       Medium      HotpotQA F1 +4.1
             + Plan
HANRAG       Heuristic      O(n)       Strong      Single+multi-hop
             routing                                improvement
DualRAG      Dual-process   O(n)       Medium      Supports small
             coupling                               model fine-tuning
PAR²-RAG     Breadth-first  O(n)       Strong      IRCoT +23.5%
             then depth                             accuracy
CompactRAG   One-shot       O(1)       Medium      Drastically fewer
             decompose                              tokens
```

## Relationship with Agentic RAG

Multi-hop retrieval is a subset of [Agentic RAG](/en/posts/ai/2026-03-12-agentic-rag-react-loop-en). An Agentic RAG agent loop naturally supports multi-round retrieval — the agent can autonomously decide "not enough information, search again," and multi-hop is the structured application of this capability.

The difference: multi-hop frameworks typically have explicit reasoning structures (sub-question decomposition, reasoning chains), while Agentic RAG is more general — an agent may decide to re-retrieve for various reasons, not just multi-hop reasoning.

According to [arXiv:2501.09136](https://arxiv.org/abs/2501.09136) (Agentic RAG Survey), multi-hop retrieval falls under the "plan-then-retrieve" and "interleaved retrieval-reasoning" subcategories of agentic RAG.

## Relationship with GraphRAG

[GraphRAG](/en/posts/ai/2026-03-12-graph-rag-en) naturally supports multi-hop: knowledge graphs encode entities and relations as nodes and edges, and traversing edges is hopping. Finding "Company A's CEO's other board positions" requires just two graph hops.

But graph construction cost is high — entity extraction, relation extraction, and graph construction are all needed, and graph coverage depends on construction quality. According to [arXiv:2509.09713](https://arxiv.org/abs/2509.09713), in scenarios with many documents but unclear relational structure (e.g., news articles), text-based multi-hop retrieval is more practical.

## The Special Challenge of Evaluation

Multi-hop QA evaluation is considerably harder than single-hop:

1. **Reasoning chain annotation**: You need not just the final answer, but also intermediate reasoning steps and supporting evidence. HotpotQA requires annotating supporting sentences; MuSiQue requires annotating intermediate answers at each hop.
2. **Shortcut reasoning**: Models may guess the answer without complete reasoning. MuSiQue's design goal is to eliminate such shortcuts — according to [Trivedi et al.](https://arxiv.org/abs/2108.00573), it excludes questions answerable via single-hop.
3. **Controllable hop count**: [MHTS](https://arxiv.org/abs/2504.08756) (Multi-Hop Tree Structure Framework, 2025) lets researchers generate questions with specific hop counts to test system performance at different complexity levels.

According to [arXiv:2604.18234](https://arxiv.org/abs/2604.18234) (ECIR 2026), LLM-based retrieval evaluation strategies need targeted adjustments for multi-hop scenarios — methods effective for single-hop may be misleading for multi-hop.

### Key Benchmarks

| Benchmark | Hops | Distinguishing Feature |
|---|---|---|
| [HotpotQA](https://hotpotqa.github.io/) | 2 | Bridge + comparison questions, with supporting sentences |
| [2WikiMultihopQA](https://arxiv.org/abs/2011.01060) | 2 | Cross-Wikipedia shared entity reasoning |
| [MuSiQue](https://arxiv.org/abs/2108.00573) | 2-4 | Deliberately eliminates shortcuts; strictest multi-hop benchmark |
| [MultiHop-RAG](https://arxiv.org/abs/2401.15391) | 2-4 | News article knowledge base, closer to real RAG scenarios |

## A Counter-Intuitive Finding

According to [arXiv:2601.19827](https://arxiv.org/abs/2601.19827) (When Iterative RAG Beats Ideal Evidence, 2026), in experiments on the chemistry-domain ChemKGMultiHopQA with 11 SOTA LLMs: **iterative RAG sometimes outperforms directly providing gold context**.

This violates the intuition that "better evidence always leads to better results." The paper's explanation: staged retrieval lets the model process one small piece of information at each step, avoiding attention dispersion in long contexts. Gold context dumps all relevant documents at once, and the model may actually be distracted by irrelevant passages.

This corroborates [OP-RAG](https://arxiv.org/abs/2409.01666) (In Defense of RAG): even when the context window is large enough, RAG's staged processing still has a token efficiency advantage.

## Overall

Multi-hop retrieval addresses a structural limitation of RAG: real question answers often don't reside in a single document. From IRCoT's interleaved retrieval-reasoning, to PAR²-RAG's breadth-first-then-depth approach, to CompactRAG's fixed call count, the field is evolving from "can do multi-hop" to "efficiently doing multi-hop."

The core consideration for choosing a framework: if hop count is fixed and predictable (e.g., always comparing two documents), CompactRAG's decompose-synthesize approach is most cost-effective; if hop count is uncertain and needs dynamic adjustment, PAR²-RAG's planned active retrieval is more reliable; if noise document ratio is high, HANRAG's filtering mechanism is worth considering.

## References

- [arXiv:2601.19827 — When Iterative RAG Beats Ideal Evidence: Multi-hop QA Diagnostic Study](https://arxiv.org/abs/2601.19827) (2026)
- [arXiv:2407.13101 — ReSP: Retrieve, Summarize, Plan for Multi-hop QA](https://arxiv.org/abs/2407.13101) (2024, WWW 2025)
- [arXiv:2509.09713 — HANRAG: Heuristic Accurate Noise-resistant RAG for Multi-hop QA](https://arxiv.org/abs/2509.09713) (2025, Ant Group)
- [arXiv:2504.18243 — DualRAG: A Dual-Process Approach for Multi-Hop QA](https://arxiv.org/abs/2504.18243) (2025)
- [arXiv:2603.29085 — PAR²-RAG: Planned Active Retrieval and Reasoning for Multi-Hop QA](https://arxiv.org/abs/2603.29085) (2026, Oracle AI)
- [arXiv:2602.05728 — CompactRAG: Reducing LLM Calls and Token Overhead in Multi-Hop QA](https://arxiv.org/abs/2602.05728) (2026)
- [arXiv:2212.10509 — IRCoT: Interleaving Retrieval with Chain-of-Thought Reasoning](https://arxiv.org/abs/2212.10509) (2023)
- [arXiv:2601.00536 — Retrieval-Reasoning Processes for Multi-hop QA: A Four-Axis Design Framework](https://arxiv.org/abs/2601.00536) (2025)
- [arXiv:2108.00573 — MuSiQue: Multihop Questions via Single-hop Question Composition](https://arxiv.org/abs/2108.00573) (2021)
- [arXiv:2504.08756 — MHTS: Multi-Hop Tree Structure Framework for Difficulty-Controllable QA](https://arxiv.org/abs/2504.08756) (2025)
- [arXiv:2604.18234 — Evaluating Multi-Hop Reasoning in RAG Systems](https://arxiv.org/abs/2604.18234) (ECIR 2026)
- [HotpotQA — A Dataset for Diverse, Explainable Multi-hop QA](https://hotpotqa.github.io/)
- [arXiv:2401.15391 — MultiHop-RAG: Benchmarking RAG for Multi-Hop Queries](https://arxiv.org/abs/2401.15391) (2024)
- [arXiv:2501.09136 — Agentic RAG Survey](https://arxiv.org/abs/2501.09136) (2025)
- [Agentic RAG: Letting the LLM Decide Whether to Search Again](/en/posts/ai/2026-03-12-agentic-rag-react-loop-en)
- [GraphRAG: Turning Knowledge into Graphs for LLM Reasoning](/en/posts/ai/2026-03-12-graph-rag-en)
- [Self-RAG: Letting the Model Decide Whether to Retrieve with Reflection Tokens](/en/posts/ai/2026-09-03-self-rag-reflection-tokens-en)
