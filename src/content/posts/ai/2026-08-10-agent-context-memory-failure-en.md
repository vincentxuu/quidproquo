---
title: "Context and Memory: Where Agents Actually Fail"
date: 2026-08-10
category: ai
type: deep-dive
tags: [context-engineering, memory, ai-agent, llm, kv-cache]
lang: en
series:
  name: "Agent 生產線"
  order: 3
tldr: "Chroma tested 18 frontier models and all of them degrade as input grows — as a cliff, not a slope. Memory failures are usually retrieval failures in disguise. And the real cost of KV cache is bandwidth, not storage: every generated token reads the whole cache."
description: "Three mechanisms behind agent failure: the architectural limits of context rot and lost-in-the-middle, memory decomposed along tier × type with its four trade-offs including poisoning, and why KV cache is a bandwidth cost."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-10-agent-context-memory-failure)

[Part 2](/posts/ai/2026-08-10-model-component-harness-system-en) concluded that reliability comes from the engineering around the model. This part covers the largest piece of that "around": what the model actually sees on each turn.

Start with the least intuitive claim: **giving an LLM more information makes it dumber.**

## Three limits that don't disappear as models improve

**Context rot.** [Chroma's study](https://research.trychroma.com/context-rot) evaluated 18 frontier models (including GPT-4.1, Claude 4, Gemini 2.5, Qwen3) and found that all of them degrade as input grows, and that they **do not use context uniformly**. The original wording: "models do not use their context uniformly; instead, their performance grows increasingly unreliable as input length grows." Worse is the shape of the degradation — **a cliff, not a slope** — and the cliff sits in a different place for every model and task, so you cannot extrapolate from one model to another.

That study also criticizes NIAH-style benchmarks: they measure lexical retrieval, a very narrow capability, and models doing well on it has convinced the field that long context is a solved problem.

**Lost in the middle.** Attention concentrates at the head and tail of the context; the middle is where things get dropped. The cause is tied to positional encoding (the decay effect in RoPE), which makes it architectural rather than a data problem. Practically: put the most critical instructions and data at the ends, and actively trim the middle.

**Statelessness.** Models have zero memory between calls. Every time one appears to "remember," that is the system re-injecting something. This is why memory has to be engineered externally — it is not a model capability.

Stack all three together and the closing line of [ByteByteGo's context engineering guide](https://blog.bytebytego.com/p/a-guide-to-context-engineering-for) is worth copying down:

> Once models are good enough, most failures stop being intelligence failures and become context failures — the model would have done the right thing, but it didn't receive what it needed, or received too much of what it didn't.

## Four strategies: Write / Select / Compress / Isolate

The corresponding practices reduce to four verbs:

| Strategy | What it does | Examples |
|---|---|---|
| **Write** | Store things outside the context | scratchpads, `CLAUDE.md`, external files |
| **Select** | Pull in only what's relevant | RAG; **tools also need selective loading**, not everything at once |
| **Compress** | Shrink what's already in there | Claude Code triggers auto-compact at 95% capacity; [Cognition](https://cognition.com/blog/dont-build-multi-agents) even fine-tuned a small model for it |
| **Isolate** | Split across agents with clean contexts | sub-agents each handle a slice and return summaries |

"Tools also need selective loading" is the commonly skipped half. Every tool definition occupies context, and an agent with dozens of MCP tools attached may burn a meaningful share of its budget before starting work. Part 4 shows Stripe hosting nearly 500 tools while **giving agents a small subset by default**.

## Memory: two orthogonal axes

Several incompatible decompositions of memory circulate (two-way, three-way, four-way). The usable version uses **two orthogonal axes** rather than one list:

- **Tier** (where it lives): context window → session → long-term store → cold archive. Explicitly analogous to an OS paging between RAM and disk
- **Type** (what it is): **working** (current task) / **episodic** (specific past interactions, time-anchored) / **semantic** (facts and preferences across contexts) / **procedural** (learned ways of doing things)

Episodic is the type most often dropped, and its absence has a concrete consequence: with no record of "what I tried, that it failed, and why," an agent stuck in a failure loop will keep retrying the same bad approach.

### The key line: memory failures are retrieval failures in disguise

[The memory piece](https://blog.bytebytego.com/p/how-ai-agents-manage-memory-and-avoid) offers a good thought experiment: an agent with a perfect database and bad retrieval, against an agent with empty memory that is honest about its own limits — **the first one often loses**. It will confidently stack stale or irrelevant information as ground truth, while the second at least says "I don't know."

Four trade-offs you have to make yourself:

1. **Recency vs relevance** — the most recent is not the most relevant
2. **Summarization vs fidelity** — **the distortion is not uniform**: names, dates and specific commitments get smoothed away while vague themes survive, **and the agent's confidence does not change**. This is the most insidious one, because compressed errors look exactly as certain as correct information
3. **Staleness** — "I'm vegetarian" may not hold two years later, and systems have only very blunt heuristics for guessing the world moved
4. **Memory poisoning** — **long-term memory is a long-term attack surface**. A malicious instruction written in six months ago keeps influencing every retrieval until somebody notices. [Part 5](/posts/ai/2026-08-10-agent-security-harness-layer-en) expands on this

## A widely misread cost structure: KV cache is bandwidth, not storage

Long context is expensive. Most people know that. What it is expensive *in* is where most explanations go wrong.

KV cache size is directly computable:

```
cache size = 2 × layers × KV heads × head dim × bytes per value × tokens × batch size
```

It grows **linearly** with context length and batch size. Concretely: Llama 3 70B at 128K context, single request, is roughly **40 GB** — one request eating most of an 80GB card.

But the crucial reframing is this: **during decoding, every generated token requires reading the entire cache from memory into compute.** So it is a **bandwidth cost, not merely a storage cost**. That explains a common confusion — why a request that "clearly fits" is still slow.

Once you have the formula, every optimization maps onto one of its terms:

| Optimization | Which term | Effect |
|---|---|---|
| **GQA** (grouped-query attention) | KV head count | Llama 2/3 70B and Mistral 7B drop to 8 heads, roughly 8× saving |
| **MLA** (DeepSeek) | head dimension | DeepSeek-V3 is ~70 KB per token vs 192–328 KB for GQA models |
| **Quantization** | bytes per value | 8-bit typically costs under 1% accuracy; 4-bit shows measurable loss on multi-needle retrieval |
| **Eviction** | token count | Drop what's judged unimportant |
| **Paged attention** | waste | Fragmentation from 60–80% down to under 4%, throughput up 2–3× |
| **Prefix / prompt caching** | recomputation | On a hit, cost and latency drop 50–90% |

That last row carries a security caveat worth remembering: **shared caches across users have already produced a timing side-channel that can leak information about other people's prompts.** Cheap is not free.

## A corollary for local workflows

If you also maintain `CLAUDE.md` / `AGENTS.md` style files, this part has a direct implication: **they are a config layer, not a memory layer.**

The difference is the failure mode. A memory layer fails by retrieving the wrong thing, so you fix retrieval. A config layer loads unconditionally every turn regardless of relevance, so it fails by **dilution as the file grows** — and what you fix is length and scope. Same pipeline, different treatments. Part 4 has the most concrete prescription for this, from Stripe.

## The series

1. [Drawing the Lines: Agent, Workflow, RAG, and MCP](/posts/ai/2026-08-10-agent-workflow-rag-mcp-boundaries-en)
2. [The Model Is a Component, the Harness Is the System](/posts/ai/2026-08-10-model-component-harness-system-en)
3. **Context and Memory: Where Agents Actually Fail** (this post)
4. [Launch Is Where the Work Starts: Enterprise Cases Read Sideways](/posts/ai/2026-08-10-enterprise-agent-case-studies-en)
5. [Security: Prompt Injection Can Only Be Contained in the Harness](/posts/ai/2026-08-10-agent-security-harness-layer-en)
6. [Before You Cite: Checking 19 Primary Sources](/posts/ai/2026-08-10-verifying-agent-numbers-en)
7. [The Protocol Layer: MCP, A2A, ACP, Skills](/posts/ai/2026-08-10-mcp-a2a-skills-protocol-layer-en)
8. [Three Shapes of RAG and the Evaluator Paradox](/posts/ai/2026-08-10-rag-graph-agentic-variants-en)

## References

- [Chroma Research — Context Rot](https://research.trychroma.com/context-rot)
- [ByteByteGo — A Guide to Context Engineering for LLMs](https://blog.bytebytego.com/p/a-guide-to-context-engineering-for)
- [ByteByteGo — How AI Agents Manage Memory and Avoid Forgetfulness](https://blog.bytebytego.com/p/how-ai-agents-manage-memory-and-avoid)
- [ByteByteGo — Why An LLM's Memory Gets Expensive and How to Fix It](https://blog.bytebytego.com/p/why-an-llms-memory-gets-expensive)
- [ByteByteGo — The Memory Problem: Why LLMs Sometimes Forget Your Conversation](https://blog.bytebytego.com/p/the-memory-problem-why-llms-sometimes)
- [Cognition — Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents)
