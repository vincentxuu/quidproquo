---
title: "AI Agent Arxiv Digest — 2026-08-28"
date: 2026-08-28
category: daily
type: digest
tags: [ai-agent, arxiv, daily]
lang: en
description: "Three papers attack the same problem from different layers — Agent memory should stop being serialized into the prompt: Scroll turns an entire session into an executable environment, EARM lets a retriever accumulate its own scoring experience, and PolyMemDB routes different memory types into separate databases"
tldr: "Scroll turns an agent session into an executable Python environment, beating the best published system by 37.4 points on the 256K-context LOCA long-horizon benchmark; EARM lets a reranker remember scores it has already assigned, maintaining accuracy gains while directly scoring only 17.5% of candidates; PolyMemDB stores different facets of memory across five specialized databases and computes a trustworthiness score for conflicting facts via probabilistic inference"
series:
  name: "AI Agent Arxiv Digest"
  order: 96
---

> 🌏 [中文版](/posts/daily/2026-08-28-ai-agent-arxiv-digest)

## Today's Overview

Today's three papers attack the same underlying issue from three different technical layers: "Agent memory" has long stopped being a simple matter of stuffing history into a prompt. Scroll argues that history shouldn't be serialized at all — turn the whole session into an executable environment, keep every raw record, and query it with Python when needed. EARM argues that the retriever itself should have memory — store the relevance scores it has already assigned and use matrix completion to guess the scores it hasn't computed yet, cutting most of the reranking inference cost. PolyMemDB argues, from a database-engineering angle, that memory data is inherently heterogeneous (entity relations, probabilistic confidence, spatiotemporal coordinates), and forcing it all into one storage format is the root of the problem — route each data type to the database built for it, then use probabilistic inference to resolve contradictions. Together, the three papers sketch how "Agent memory" is turning from a prompt-engineering problem into a genuine systems-design problem.

## Terms Worth Knowing Before You Read

| Term | Plain-language explanation |
|---|---|
| Agent | An AI system that plans its own steps, calls tools, and iterates — not a single-turn chatbot |
| Context Window | The maximum amount of text an LLM can "see" at once, and the biggest bottleneck for long-horizon agent tasks |
| Event Log | An append-only, never-edited record of the full interaction history, so raw detail is never lost to compression or summarization |
| Reranking | Re-scoring a coarsely filtered set of candidates with a stronger model; more accurate than the initial pass but also more expensive |
| Matrix Completion | A technique for inferring unknown values from a small number of known ones, commonly used for rating prediction in recommender systems |
| Probabilistic Database | A database where fields hold probability distributions instead of fixed values, used to handle facts that are uncertain, time-varying, or contradictory |

---

## Paper 1 | Turning Context into an Environment: Scroll Lets Agents Write Code to Manage Their Own Long-Term Memory

**Context as an Environment: Programmatic Context Management for Long-Horizon Agents**
Yin Lin, Elaine Ang, Erkang Zhu et al. (Alibaba Group; Elaine Ang affiliated with Columbia University) · arxiv: 2608.21690

Links: [arxiv](https://arxiv.org/abs/2608.21690) · [alphaxiv](https://www.alphaxiv.org/abs/2608.21690)

### TL;DR

Instead of serializing history into the prompt, Scroll turns the entire agent session into a persistent Python execution environment, letting the model query, compute over, and filter its own history by writing code. On Qwen3.8-Max it reaches 94.8% on LongMemEvalS, 73.1% on BEAM10M (5.1 points above the best published memory system), and 86.7% on 256K-context LOCA (37.4 points above the best published long-horizon agent).

### Read Priority

Must-read — nearly every long-horizon agent platform is fighting the same battle of "history too long to fit in context." Scroll offers a concrete solution direction, already adopted by a real framework, not just a proof-of-concept sitting in a paper.

### Field Background

Most existing long-horizon agent memory schemes decide at write time what to keep — compressing into summaries or extracting key facts into a fixed memory format. The problem is that at write time, nobody knows what will be needed later; once something is summarized away, the detail is gone for good. RAG-style vector retrieval instead treats history as an independent document store, but an agent's session is really a highly correlated, continuous stream of events — not the heterogeneous document collection RAG typically assumes.

### Intermediate Walkthrough

- **Problem**: Imagine an agent running a complex task for hundreds of turns. You give it a constraint at turn 10; by turn 200, when it needs to make a decision, that constraint has long since been summarized away or simply never retrieved.
- **Method**: Scroll stores the entire session history in an append-only Event Log and keeps a persistent Python kernel alive across model calls that is never reset. Instead of passively receiving summaries, the model actively writes code (`exec`) to search, filter, and aggregate the history sitting inside that kernel — only what it explicitly `print`s makes it into the next turn's prompt. When the "working view" starts filling up, older content is moved out of view but never discarded; the system keeps an "eviction index" recording its exact location in the Event Log, so it can be retrieved directly later without re-searching the whole history.
- **Why it matters**: Context management shifts from "engineers manually designing what to remember" to "the model writing code to look things up itself," directly inheriting LLMs' improving coding ability while never losing the raw record — critical for tasks that need precise numbers, timing, or fact updates.

### Deep Dive

- Main results (Qwen3.8-Max): LongMemEvalS 94.8%, BEAM10M 73.1% (5.1 points above the best published memory system), LOCA 128K 89.3% / 256K 86.7% (37.4 points above the 49.3% scored by the MiniMax M3 + ReAct baseline at 256K) ⚠️ (baselines are drawn from each system's best published results, not a controlled reproduction under one environment)
- The most damaging ablation: replacing the Event Log with "summarize at write time and discard the original" drops the overall score from 73.1 to 19.9, with tasks requiring precise numbers, temporal reasoning, or fact updates falling to near zero
- Removing the persistent kernel and replacing queries with ordinary tool calls costs 7.3 points — serialized tool results can no longer be re-filtered, merged, or aggregated inside the kernel
- Counter-example: on tasks where "summarizing at write time" actually helps (dialogue summarization, preference tracking), Scroll loses to specialized memory systems — e.g., 70.5 on summarization tasks versus Exabase M-1's 91.9
- The weaker the model, the smaller the benefit: a 35B open-source model still scores 88.8 on LongMemEvalS (only 6 points off the best), but on LOCA 256K the gap widens to 64 points (86.7 vs. 22.7) — showing Scroll's ceiling tracks the model's multi-step coding ability
- Real-world signal: the open-source agent framework QwenPaw (part of AgentScope) has already merged a Scroll-like strategy into its production code, passing full code review including sandbox security and SQL-injection fixes — not just an academic concept
- Limitation: every comparison against other memory systems uses "the best published result from the literature," not a controlled comparison under the same environment ⚠️

### Reviewer's One-Liner

Turning context management directly into a coding task is solidly executed, and the ablations make a clean case that "keeping the raw record" beats "summarizing at write time"; but the baseline comparisons aren't controlled, and the benefit clearly tracks the model's coding-planning ability, so results will shrink considerably with a weaker model.

### Your Takeaway

- If your agent platform handles long-horizon tasks that need precise information preserved across many turns: Scroll's design of "keep history out of the prompt, query it in an executable environment" is worth adopting directly, especially if your framework already supports code execution (CodeAct-style architectures)
- If you're evaluating whether to adopt a similar mechanism: first confirm your backbone model's own coding-planning ability is strong enough — weaker models see limited gains and may even do worse due to execution errors

---

## Paper 2 | The Retriever Should Also Remember: EARM Amortizes Reranking Cost with Retrieval Experience

**The Retriever Should Remember: Experience-Amortized Reranking for Long-Term Agent Memory**
Qi Feng, Chris Ding, Jicong Fan (School of Data Science, CUHK-Shenzhen) · arxiv: 2608.22767

Links: [arxiv](https://arxiv.org/abs/2608.22767) · [alphaxiv](https://www.alphaxiv.org/abs/2608.22767)

### TL;DR

EARM stores the relevance scores an LLM has already assigned as reusable "retrieval experience" in an online matrix, then uses causal matrix completion to guess scores for candidates it hasn't scored yet — improving answer accuracy by up to 6.62% over pure semantic retrieval while directly scoring only 17.5% of candidates.

### Read Priority

Skim — directly useful for long-term memory systems with a stable memory store and high query volume (personal assistants, customer support), but the method rests on matrix completion, so the math bar is higher than the engineering bar.

### Field Background

Long-lived agents accumulate large memory stores, but retrievers are typically stateless: semantic vector retrieval is fast but imprecise, and LLM reranking is accurate but re-scores a fresh batch of candidates every single time, throwing the scores away immediately afterward with no accumulation. This paper points out a previously overlooked phenomenon: when the same memory store is queried repeatedly, the scores a retriever has already assigned actually hide reusable structure.

### Intermediate Walkthrough

- **Problem**: Imagine a retriever re-scoring 200 candidate memories on every query. After a thousand queries, that's two hundred thousand scoring calls — yet many memories keep getting retrieved by similar types of questions, and those historical scores are never recorded.
- **Method**: EARM stores the LLM relevance score for every query-memory pair in a continuously growing sparse matrix (queries as columns, memories as rows), then uses causal matrix completion to learn the matrix's shared structure. It combines a small number of freshly scored candidates with the estimated scores to rank the rest. As accumulated experience grows, the fraction of candidates that need direct scoring keeps shrinking.
- **Why it matters**: It separates "remembering content" from "remembering how to retrieve" — a long-lived agent shouldn't just remember what happened, it should also remember which memories have proven useful for which kinds of questions, turning reranking from a fixed per-query cost into a capability that accumulates over the agent's lifetime.

### Deep Dive

- Core numbers: using only actually-scored candidates (Observed-only) improves 1.36–3.83% over pure semantic retrieval; stacking completed scores on top adds another 0.78–2.79%, reaching a combined 6.62% improvement at rank=8, Top-10
- Efficiency validation: the fraction requiring direct scoring drops from 100% down to 17.5% of candidates while still beating pure semantic retrieval on accuracy
- Test set: the LoCoMo long-term conversational memory dataset, covering multi-hop, open-domain, single-hop, and temporal question types; scoring uses Qwen3.5-4B-Q8_0, with GPT-4o-mini for both answer generation and evaluation
- Deployment threshold: requires maintaining a growing "query-memory relevance matrix" with ongoing online matrix completion; benefits are clearest for systems with a stable memory store and high query volume, and limited where the memory store or query topics keep shifting
- Limitation (three self-reported by the authors): (1) the scoring budget is scheduled by fixed query order rather than dynamically adjusted for model uncertainty or cold-start; (2) matrix completion assumes reusable low-dimensional structure, which breaks down if the query distribution is too heterogeneous; (3) LLM scoring itself is noisy and prompt-sensitive, so completion risks amplifying the scorer's errors rather than just saving cost

### Reviewer's One-Liner

Framing "the retriever should also accumulate experience" as a clean matrix-completion problem is a practical cost saving — maintaining accuracy while scoring only 17.5% of the budget is genuinely useful — but it's validated on a single dataset only, and the authors themselves admit that an unstable query distribution can turn completion into noise amplification rather than savings.

### Your Takeaway

- If your system has a stable memory store with high-volume repetitive queries (customer support, a personal assistant accumulating user data over time): EARM's idea of "store scores and reuse them" can directly cut reranking inference cost
- If your memory store or query distribution keeps shifting (new users, new topics constantly appearing): this method's core assumption doesn't hold — don't rush to adopt it

---

## Paper 3 | Memory Shouldn't Live in Just One Database: PolyMemDB Resolves Contradictions with Probabilistic Inference

**PolyMemDB: A Polyglot Database System for AI Memory Management**
Yu Wang, Jiaheng Lu (University of Helsinki) · arxiv: 2608.25577

Links: [arxiv](https://arxiv.org/abs/2608.25577) · [alphaxiv](https://www.alphaxiv.org/abs/2608.25577)

### TL;DR

PolyMemDB routes different facets of memory (graph, vector, probabilistic, spatiotemporal, and raw content) into five specialized databases and extends probabilistic-database semiring inference to memory facts, computing a time-decayed confidence score for each fact so an agent facing contradictory memories can return a graded confidence answer instead of a binary yes/no.

### Read Priority

Skim — this is a system-demonstration (demo track) paper with no large-scale quantitative evaluation. Useful as an architectural reference for how to route heterogeneous memory data, not as a paper to cite for performance numbers.

### Field Background

Most memory systems still force all memory data into a single storage paradigm (plain text or one vector store), squeezing fundamentally different kinds of information — entity relations, spatiotemporal constraints, event confidence — into the same format. Over long interactions, facts get corrected or overturned, but most systems simply overwrite the old value: no provenance trail is kept, and the LLM is forced into a binary judgment when facing contradictory memories, which invites hallucination.

### Intermediate Walkthrough

- **Problem**: Imagine a user said ten months ago they love running, complained about knee pain five months ago, and just finished a marathon last week. "Does this person like running?" shouldn't be a simple yes/no question — it needs to weigh conflicting evidence across different points in time.
- **Method**: PolyMemDB routes memory by type: entity-relationship graphs go into Neo4j, event confidence into the probabilistic database ProvSQL, spatiotemporal constraints into MobilityDB, and vectors and raw content into ChromaDB and object storage respectively. Queries follow a three-tier fallback: check the graph first (low latency), fall back to vector retrieval, and only fall back further to raw content if that's insufficient. For contradictory facts, the system applies exponential time decay to each observation and computes four probabilistic states — positive drive, negative suppression, evidence conflict, and evidence insufficiency — synthesizing them into a single "net evidence confidence" score between -1 and 1.
- **Why it matters**: Memory data is inherently heterogeneous; forcing different kinds of data into one database doesn't make the problem go away, it just hides it. Routing each data type to the database built for it, then letting probabilistic inference handle contradictions, gives the LLM a chance to answer with "how confident it is" rather than guessing outright.

### Deep Dive

- Demo case: on a 48-session conversation from LongMemEval, PolyMemDB builds a memory graph of 229 entities and 221 relations, able to trace answers requiring long-range dependencies (e.g., "what discount does my favorite author's book have") with a full evidence chain
- A second demo scenario: automatically extracting a "graduation trip" itinerary from a long conversation and visualizing it on a spatiotemporal map, filtering out irrelevant locations by time window (e.g., narrowing an entire trip down to 5 Italian cities)
- Confidence calculation example: for "does Alice like running," a recent completed marathon contributes only 47.2% positive drive, but historical knee pain and heat-exhaustion events push "evidence conflict" up to 52.3%, yielding a net confidence of only about 0.22 — letting the LLM produce a nuanced answer like "committed but has struggled along the way" instead of a flat "yes" or "no"
- Limitation: this is a system-demonstration (demo track) paper with no large-scale quantitative evaluation or baseline comparison — only three qualitative demo scenarios ⚠️
- Deployment threshold: running Neo4j, ProvSQL, MobilityDB, ChromaDB, and object storage simultaneously is a non-trivial infrastructure cost for a small team
- Source code available: [github.com/wangyu-1999/PolyMemDB](https://github.com/wangyu-1999/PolyMemDB)

### Reviewer's One-Liner

Approaching memory fragmentation from a database-engineering angle is a solid, interpretable way to think about resolving contradictory facts through probabilistic inference; but this is a system demo rather than a quantitative evaluation, and running five heterogeneous databases is real operational overhead to weigh against the architecture's appeal — treat it as a reference design, not something to copy wholesale.

### Your Takeaway

- If you're designing an enterprise knowledge base, or need to handle "contradictory facts in long-term memory": PolyMemDB's approach of replacing binary judgments with probabilistic scores is worth studying, especially for scenarios that need confidence-annotated, traceable answers
- If your team has limited resources: you don't need to copy the five-database architecture — you can apply the "probabilistic confidence + data provenance" subsystem idea to your existing single database instead

---

## Today's Takeaway

I used to think the optimization headroom in memory systems mostly sat in "compression algorithms" and "retrieval models." Today's papers show the real leverage points are spread across three entirely different engineering layers — whether context should be "environmentalized" rather than "serialized," whether the retriever itself should have memory, and which database each type of memory data should actually live in. Missing any one of these three layers means any "accuracy number" for a long-term memory system is only a temporary lead.

## References

- Scroll paper (Context as an Environment: Programmatic Context Management for Long-Horizon Agents): [arxiv 2608.21690](https://arxiv.org/abs/2608.21690), code reference [QwenPaw scroll branch](https://github.com/agentscope-ai/QwenPaw/pull/5321)
- EARM paper (The Retriever Should Remember: Experience-Amortized Reranking for Long-Term Agent Memory): [arxiv 2608.22767](https://arxiv.org/abs/2608.22767)
- PolyMemDB paper (PolyMemDB: A Polyglot Database System for AI Memory Management): [arxiv 2608.25577](https://arxiv.org/abs/2608.25577), code [GitHub](https://github.com/wangyu-1999/PolyMemDB)
