---
title: "Agent Memory: A Reading Guide | Stanford CS329A Lecture 14"
date: 2026-10-11
category: ai
type: deep-dive
tags: [cs329a, ai-agent, ai-course, evaluation, llm]
lang: en
series:
  name: "Reading Stanford CS329A"
  order: 10
description: "Compare MemGPT, Cartridges, and CacheBlend with a break-even calculation and a stale-data exercise."
tldr: "Retrieval, trained KV representations, and cache reuse address different bottlenecks; speed does not guarantee freshness."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-11-cs329a-session-14-agent-memory-readings)

Giving an agent “more memory” can mean retrieving past information, representing long documents with less memory, or processing previously seen documents faster. The three assigned papers for [CS329A](https://cs329a.stanford.edu/) Autumn 2025 session 14 address these different layers. You will learn to match a method to a bottleneck rather than compare everything labeled memory as interchangeable. Prerequisite: models have finite context windows. A KV cache stores key/value tensors produced while processing input, not a text summary.

Read [Lecture 8 on search and deep research](/posts/ai/2026-10-11-stanford-cs329a-lecture-08-search-deep-research-en) first to separate retrieval from internal representations.

**Video status: The official schedule does not list a recording.** The nine public videos checked on 2026-10-11 did not include a match for this session. This does not prove that no recording exists. The schedule also lists guest lecturer Junchen Jiang; this explanation follows the assigned papers without reconstructing his spoken lecture.

## MemGPT: move relevant information into context

[MemGPT](https://arxiv.org/abs/2310.08560) borrows the operating-system idea of virtual memory. It distinguishes currently visible context from external storage and lets an agent manage and retrieve information through tools. It provides a way to use long-term memory without making a fixed context window infinite. Externally stored data remains invisible until retrieved. A faulty summary or missing detail does not repair itself merely because the system calls it memory.

Suppose a past support conversation is stored externally and the customer says, “Use the same shipping method as last time.” The agent must retrieve the previous method before answering; a completed search does not establish that the correct information entered context. The bottleneck is retrieval and management, not tensor size.

## Cartridges: learn a smaller representation offline

[Cartridges](https://arxiv.org/abs/2506.06266) trains a smaller KV cache for a fixed corpus while freezing the underlying model. Self-study produces diverse synthetic conversations, then trains the cartridge-conditioned model to match the output distribution of a model given the full corpus. Memorizing document text is not equivalent to answering differently worded questions. Synthetic conversations and context distillation address this gap.

The costs include offline processing and version management. If documents change daily and receive one query each, learning a representation may not pay off. Repeated queries over relatively stable data are a better fit. Reusability after training does not mean updates require no work.

## CacheBlend: reuse needs interaction repair

[CacheBlend](https://arxiv.org/abs/2405.16444) handles recombining document chunks with independently precomputed KV caches. A later chunk's standalone representation lacks attention to preceding chunks. Direct concatenation can affect answers, so CacheBlend selectively recomputes some tokens' KV values and overlaps cache retrieval with computation. It addresses prefill speed, not searchable personal memory or base-model training.

## A complete method-selection example

This original planning example uses invented costs, not reported results. A company has stable manuals A and B and daily-changing tickets C. One hundred daily questions repeatedly reference A and B. Full prefill costs 100 units per query, totaling 10,000. Suppose offline cartridge preparation costs 2,000 and each subsequent query costs 20. Total cost is 2,000+100×20=4,000. If quality checks pass, repeated queries justify amortizing preparation.

With ten queries, full prefill costs 1,000 while the cartridge approach costs 2,200. Let n be the query count: the break-even equation is 100n=2,000+20n, giving n=25. More than 25 queries save cost in this simplified model. This is selection intuition, not a throughput forecast.

Do not automatically serve daily-changing C from yesterday's representation. Retrieve today's ticket and place the correct version in context. If A and B's cached chunks are being recombined, separately assess a CacheBlend-style method. The three approaches can coexist if freshness, answer quality, and execution cost are each checked.

## Variation check and answer

A now changes hourly and receives only twenty queries. You still use yesterday's cartridge because answers are fast. Is that sufficient for delivery? **No.** Verify the source version and whether answers use the latest information. Under the example's assumptions, twenty full-prefill queries cost 2,000 versus 2,400 for offline preparation plus queries. Even the cost argument fails. Incremental updates or amortization across more queries need new actual costs, not the old equation.

A common mistake is equating cache hit rate with answer correctness. Tonight, record one real failure: missing data, stale data, insufficient context capacity, or slow prefill. Then choose retrieval management, trained representation, or cache reuse, and ask the same question before and after a source update to check freshness.

## English reading and expression

Original practice sentences: *Retrieval decides what information enters the context.* *Cache reuse reduces computation; it does not guarantee fresh information.* Use them to explain how C should be handled. This is reading and expression practice, without audio shadowing.


## References

- [Official Autumn 2025 schedule](https://cs329a.stanford.edu/)
- [Cartridges](https://arxiv.org/abs/2506.06266)
- [MemGPT](https://arxiv.org/abs/2310.08560)
- [CacheBlend](https://arxiv.org/abs/2405.16444)
