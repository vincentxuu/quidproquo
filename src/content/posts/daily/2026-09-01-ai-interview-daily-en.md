---
title: "AI Engineer Interview Daily — 2026-09-01: Deep Learning & NLP"
date: 2026-09-01
category: daily
tags: [ai-engineer-interview, daily, deep-learning]
lang: en
description: "Today's deep learning and NLP drill: the intuition behind attention, why tokenization is a lossy design decision, and the often-overlooked idea that an embedding is a vector-space contract."
tldr: "Deep Learning & NLP interviews don't test whether you can draw a transformer diagram — they test whether you understand what each design decision trades away. Today covers four high-frequency topics: how self-attention computes and what KV cache saves, the vocab-size trade-off in tokenization, the senior-candidate detail that 'an embedding is a vector-space contract, and matching dimensions doesn't mean compatible,' and how to choose between fine-tuning and prompting while guarding against catastrophic forgetting. The practice problem is Scale AI's 'design an embedding and classification API,' walking through version compatibility, partial failure, and multi-tenant isolation end to end."
series:
  name: "AI Engineer Interview Daily"
  order: 13
---

> 🌏 [中文版](/posts/daily/2026-09-01-ai-interview-daily)

## Today's Topic

Deep Learning & NLP is where AI Engineer interviews most often expose "memorized but not understood." Plenty of candidates can sketch a transformer diagram or recite that BPE is subword tokenization, but when pressed on "what happens when you double the vocab size" or "why can't you swap two models that both output 1024-dim vectors," the answer falls apart.

Today isn't about redrawing architecture diagrams — it's about practicing what interviewers actually want to hear: what each design decision costs, and where the trap sits. This style of question shows up in phone-screen technical deep dives and in ML infra-flavored onsite system design rounds.

## Core Concepts Quick Reference

### What Self-Attention Computes, and What KV Cache Saves

Self-attention lets every token see every other token directly, instead of propagating information step by step like an RNN — this fixes the vanishing-gradient problem for long-range dependencies, at the cost of O(n²·d) complexity that grows quadratically with sequence length. In an interview, you need to explain what KV cache buys you: during generation, only the new token's query needs recomputing each step, while the keys and values for every prior token can be cached and reused. This turns autoregressive generation from "recompute everything every step" into "compute only the new column each step," and it's the base mechanism behind nearly every LLM inference service's latency savings.

### Tokenization Is a Lossy Design Decision, Not a Free Lunch

Bigger vocab isn't automatically better. Doubling the vocab means embedding and unembedding parameters each grow by roughly 250k × d_model (twice that if the weights aren't tied), while compression only scales logarithmically — 2.5x the vocab doesn't buy you 2.5x the bytes per token. The hidden trap is rare tokens: an overstuffed vocab leaves long-tail tokens with almost no gradient signal, turning them into functional noise. The interview bonus line: "vocab size is a parameter budget and a decode-latency tax, not a free compression win" — not just "a bigger vocab makes the tokenizer more efficient."

### An Embedding Is a Vector-Space Contract

This is the detail only senior candidates volunteer: an embedding model defines a geometry, and a classifier is a decision boundary drawn inside that specific geometry. Feed a classifier vectors from a different model (or even a different version of the same model), and the dimensions still line up, the scores still look plausible — but the answer has quietly stopped meaning anything. **Matching dimensions doesn't mean compatible.** That's also why preprocessing (normalization, casing, truncation length) belongs in the version too — change truncation from 512 to 1024 tokens and every vector's distribution shifts, silently invalidating the cache.

### Fine-Tuning vs. Prompting

Fine-tuning fits situations that need a stable "brand voice" or behavior pattern applied on every single call — you're baking a few thousand tokens of system prompt into the weights, saving the token cost and latency you'd otherwise pay on every request. The risk is catastrophic forgetting: a model fine-tuned on a narrow domain can lose its general-purpose capabilities. Mitigations worth naming in an interview include LoRA (tuning only a low-rank subspace while preserving the original weights), rehearsal (mixing samples from the original task back into the fine-tuning data), and using a lower learning rate to bound how far the weights can drift.

## Today's Practice Problem

### Problem

"Design an embedding generation and classification API: text goes in, a vector and a label come back. The system must support multiple tenants, handle partial failure (what happens when a few items in a thousand-item batch are malformed), treat GPU capacity as a scarce resource, and make sure one tenant can never read another tenant's cached results."

**Source**: Scale AI Machine Learning Engineer onsite interview question | **Difficulty**: Advanced (labeled "easy" on the interview platform, but all four parts carry traps) | **Stage**: onsite system design (ML infra)

### Breakdown

1. **Clarify the problem first**: The prompt itself expects you to ask "can callers supply their own embedding vectors?" — and this question matters more than it sounds. Accepting caller-supplied vectors means accepting a claim you can't verify: a vector arrives declaring which model version produced it, and nothing about the numbers proves that's true. Without a signing mechanism or a trusted producer, that's an unvalidated input fed straight into the classifier. Take the simplification the prompt offers — own both preprocessing and embedding generation inside the service — and explicitly say why the alternative is harder, rather than skipping past it.

2. **Establish a framework**: Organize the entire design around "a vector space is a contract." The API should require callers to name explicit `embedding_model` and `classifier` versions — never `latest`, because that lets results drift underneath a caller who changed nothing on their end — and preprocessing should be treated as a versioned artifact too, which is the detail most candidates skip.

3. **Dive into the core**: Three trade-offs matter most. First, handle partial failure by having the HTTP status describe the request, not any single item: if one item in a thousand is malformed, return 200 with a per-item status rather than rejecting the whole batch and forcing the caller to resend the 999 items you already computed on scarce GPU time. Second, justify dynamic batching with actual numbers rather than asserting "batching improves throughput." Third, the multi-tenant cache key must include `tenant_id` — a shared cache would get a better hit rate, but without the tenant boundary, one tenant could submit the same text and observe an abnormally fast response to infer whether another tenant already embedded that exact document, which is a genuine timing side channel.

4. **Wrap up**: Close with the line that ties the whole design together — "matching dimensions doesn't mean compatible; two models can both emit 1024-dimensional vectors while placing the same sentence in completely different positions, so compatibility can never be checked from vector shape at runtime — it has to come from a human-validated (embedding version, classifier version) pair recorded in a registry." That's the reason the system needs a registry, version pinning, and a rollout process, rather than something you mention in passing.

### Sample Answer (how to articulate this in an interview)

> Before I start designing, I'd want to confirm one thing: can callers supply their own embedding vectors instead of sending raw text every time? That decides the whole trust model — if external vectors are allowed, I have no way to verify the vector actually came from the model version it claims to. Matching dimensions doesn't mean it's the same vector space. Without a signature or a trusted source, that's an unvalidated input going straight into the classifier. Assuming that's not allowed, I'd handle preprocessing and embedding generation entirely inside the service.
>
> On the API, both `embedding_model` and `classifier` need explicit version strings — no `latest`, because that lets a caller's results drift underneath them without them changing anything. The detail that's easy to miss: preprocessing — normalization, casing, truncation length — should also be a versioned artifact stored in the registry, because moving truncation from 512 to 1024 tokens shifts the distribution of every vector, and the cache needs to invalidate along with it. For partial failure, I'd have the HTTP status describe the request itself: if a handful of items in a thousand-item batch are malformed, I'd return 200 with per-item status and error codes, instead of rejecting the whole batch and forcing a resend of work that already cost GPU time.
>
> For performance, I'd do dynamic batching — accumulate to a batch size of 32 or until a wait window expires, say 10 milliseconds, then run one forward pass, because accelerators have a high fixed cost and a low marginal cost per item; batching to 32 can multiply a single worker's capacity by more than eight. But the wait window can't grow unbounded — past some threshold the wait itself starts hurting tail latency. The cache key would include `tenant_id`, even at the cost of a lower hit rate — without it, one tenant could submit identical text and watch for an abnormally fast response to infer whether another tenant already embedded that exact document, which is exactly the timing side channel the prompt asks you to guard against. Finally, compatibility can never be judged from vector dimensions alone — two models both emitting 1024-dim vectors doesn't mean they share a vector space — so I'd keep a registry of human-validated (embedding version, classifier version) pairs and reject invalid combinations at request time, rather than discovering the result is wrong after the model has already run.

### Self-Check Checklist

Use this table to verify your answer covers the key points:

| Check Item | Mentioned? |
|---------|---------|
| Proactively asked whether callers can supply their own embeddings, and explained why it matters | |
| Versions are explicit, never `latest`; preprocessing is treated as a versioned artifact | |
| Partial failure handled by having HTTP status describe the request, not the item | |
| Dynamic batching backed by concrete numbers (batch size, wait window) | |
| Cache key includes tenant_id, with the timing side-channel risk explained | |
| Bonus: explicitly states "matching dimensions doesn't mean compatible" and describes a registry of validated pairs | |

## Further Reading

- [Deep Learning 200 Interview Questions & Answers — Part 2](https://atalupadhyay.wordpress.com/2026/08/25/deep-learning-200-interview-questions-answers-part-2-questions-101-200/) — Fills in the computational details of attention and Vision Transformers, a good companion to today's self-attention section
- [LLM System Design Interview #51 — The Tokenizer Swap Trap](https://aiinterviewprep.substack.com/p/llm-system-design-interview-51-the) — Digs into how fertility (tokens per word) breaks down unevenly across languages after a tokenizer swap, filling in the detail today's tokenization section only touched
- [ai-engineering-interview-questions (GitHub)](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — A collection of AI engineering interview questions covering catastrophic forgetting, chunking strategies, and embedding model selection, good for further practice

## References

- [Scale AI Interview Question: Design an Embedding and Classification API](https://medium.com/@emilyhustlenyc/scale-ai-interview-question-design-an-embedding-and-classification-api-5af182d937d4) — Full source for today's practice problem, including API design, dynamic batching numbers, and registry design details
- [LLM System Design Interview #51 — The Tokenizer Swap Trap](https://aiinterviewprep.substack.com/p/llm-system-design-interview-51-the) — Basis for the tokenization vocab-size trade-off section in Core Concepts
- [Deep Learning 200 Interview Questions & Answers — Part 2](https://atalupadhyay.wordpress.com/2026/08/25/deep-learning-200-interview-questions-answers-part-2-questions-101-200/) — Basis for the self-attention and KV cache section in Core Concepts
- [ai-engineering-interview-questions (GitHub)](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — Basis for the fine-tuning and catastrophic forgetting section in Core Concepts
