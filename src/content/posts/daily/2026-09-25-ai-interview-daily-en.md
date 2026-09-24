---
title: "AI Engineer Interview Daily — 2026-09-25: Coding"
date: 2026-09-25
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Friday's rotation is Coding — implementing a single-GPU inference batching scheduler, the question Anthropic asks across SWE, ML, hardware, and EM loops alike. Today covers dynamic batching's two trigger conditions, then extends into continuous batching and PagedAttention as the production-grade fix for wasted static batches."
tldr: "Today's Coding rotation tackles a question Anthropic asks across nearly every engineering-adjacent loop: design and implement a single-GPU inference batching scheduler that accepts up to 100 inputs per batch while callers block synchronously for results. The core tension is throughput versus latency. Concepts covered: dynamic batching's two trigger conditions (batch-size cap vs. wait-time cap), length bucketing to cut padding waste, continuous batching (iteration-level scheduling) versus static batching, how PagedAttention manages KV cache memory with paging, and backpressure for bounding tail latency when the queue fills up. The practice question turns Anthropic's system-design prompt into an actual scheduler class you can implement, with a full breakdown and sample answer."
series:
  name: "AI Engineer Interview Daily"
  order: 37
---

> 🌏 [中文版](/posts/daily/2026-09-25-ai-interview-daily)

## Today's Topic

Friday's rotation is Coding. Today's pick isn't an abstract algorithm question — it's a high-frequency prompt Anthropic asks across SWE, ML, hardware, and even EM loops: design and implement a single-GPU inference batching scheduler. It keeps showing up across roles because it tests three things at once — whether you understand the fundamental tension between throughput and latency, whether you can turn that tension into scheduling logic that actually runs (not just a box diagram), and whether you know how production systems like vLLM push this basic version further into continuous batching. Today grounds the system-design prompt into an actual Python scheduler you could write by hand.

## Core Concepts Cheat Sheet

### Dynamic batching: two trigger conditions, whichever fires first wins

The core tension in single-GPU inference is simple: bigger batches mean higher GPU utilization and lower per-unit cost, but early-arriving requests have to wait until the batch fills up, which stretches their latency. The standard fix is dynamic batching — set two trigger conditions at once, a `max_batch_size` (say, 100) and a `max_wait_ms` (say, 5-20ms), and flush the batch whenever either one fires first. Naming both parameters clearly in an interview points straight at this question's core dial: turn `max_wait_ms` up and throughput rises while latency worsens, turn it down and the reverse happens. That's the line that separates "explained the trade-off" from "just said we do batching."

### Length bucketing: padding shouldn't eat your compute

When a batch mixes requests of very different lengths, the naive approach pads every sequence to the longest one in the batch, wasting significant compute on meaningless padding tokens for the shorter ones. A common mitigation is length bucketing — group requests with similar lengths into the same bucket before batching, so padding waste is bounded by the length spread within a bucket rather than across the whole batch. A common follow-up is "what if the length distribution is extreme" — the answer is that bucket granularity is itself a tunable parameter: buckets too fine slow down how quickly each one fills, buckets too coarse waste more on padding, and the right setting depends on the actual traffic distribution.

### Continuous batching: token generation shouldn't use a fixed batch

Static batching has a fatal flaw: sequences within a batch finish generating at different lengths, but a sequence that finishes early has to sit idle until the entire batch completes before it can leave — wasting GPU time while it waits. Continuous batching (also called iteration-level scheduling, the core design behind serving engines like vLLM) changes the unit of batching from "a whole request" to "one iteration of one forward pass": as soon as a sequence finishes at any given step, it leaves the batch and frees its slot, and a new request waiting in the queue immediately takes its place — the batch's composition can change almost every iteration. This is the biggest difference between static batching and a production-grade LLM serving engine, and bringing it up in an interview is what separates "understands batching" from "understands LLM serving systems."

### PagedAttention: KV cache memory is the real bottleneck

The number of requests that fit in a batch is often limited not by compute but by KV cache memory — the naive approach pre-allocates contiguous memory sized for each sequence's maximum possible context length, even though most requests never use anywhere near that much, wasting 60-80% of allocated memory. PagedAttention (introduced by vLLM) borrows the idea of OS virtual-memory paging, splitting the KV cache into fixed-size blocks (16 tokens each, by default) allocated on demand and stored non-contiguously. Cutting memory waste directly translates into larger usable batches and meaningfully higher throughput — which is why continuous batching and PagedAttention are usually discussed together: one fixes scheduling waste, the other fixes memory waste.

### Backpressure: a full queue can't be allowed to blow up latency

If incoming request rate sustainably exceeds GPU processing rate, the queue grows unbounded and tail latency spirals out of control — unacceptable for users blocking synchronously on a result. The design needs an explicit queue capacity and a defined overflow behavior: a common approach is capping queue size and, once exceeded, immediately returning a "system busy, retry later" response or routing to fallback capacity, rather than letting requests queue indefinitely. When asked "what happens if traffic suddenly spikes," answering with "backpressure plus an explicit overflow path" signals production awareness far more than just saying "add more GPUs."

## Today's Practice Question

### The Question

Implement a synchronous single-GPU inference batching scheduler: expose a method `submit(request) -> response` that blocks the calling thread until that request has been placed in a batch, `run_batch(requests: list) -> list` has executed on the GPU side, and the corresponding response is available. The scheduler needs two parameters: `max_batch_size` (the cap per batch) and `max_wait_ms` (the maximum time any single request can wait before a batch is flushed, whether or not it's full). Additional requirement: multiple threads may call `submit` concurrently, so the scheduler must be thread-safe. Discussion question: if `run_batch`'s execution time varies with batch size (larger batches take proportionally longer), how would you adjust the `max_wait_ms` logic so requests that have already waited a long time don't get delayed even further?

**Source**: Anthropic Inference Batching System (via Exponent's 2026 AI Engineer interview guide)　**Difficulty**: Advanced　**Round**: technical screen / system design hybrid

### How to Break It Down

1. **Clarify first**: Confirm whether "synchronous" really means the caller's thread is blocked, versus a non-blocking callback/future being acceptable; confirm whether `run_batch` guarantees input-output order consistency (usually yes, but ask — otherwise results get mismatched to the wrong requests); assume no request-level priority (no jumping the queue) unless the interviewer says otherwise.
2. **Build a framework**: Use a thread-safe queue (e.g. `queue.Queue`, or a lock paired with `threading.Condition`) to receive requests, with a background thread (or timer) handling scheduling decisions. The core logic is "whichever fires first wins": every time a new request enters the queue, check whether `max_batch_size` has been reached — flush immediately if so; otherwise check whether the oldest request in the queue has already waited past `max_wait_ms` — flush (even if not full) if so.
3. **Go deep on the core**: The easiest correctness trap is the wait-time baseline — `max_wait_ms` should be measured from the moment the oldest request entered the queue, not recomputed on every check, otherwise a request can end up waiting forever without ever timing out. For thread safety, use a lock to protect queue reads/writes, paired with a `threading.Event` or `Condition` so each `submit` call can block until its own request's result is ready and then be woken specifically. The answer to the discussion question: if execution time scales with batch size, `max_wait_ms` shouldn't just guarantee "time from queue entry to batch flush" — it needs to fold the estimated `run_batch` execution time into the user's total acceptable latency budget. Larger batches should correspondingly shrink the allowed wait window, or the batch-size cap and wait window should be combined into a joint latency-budget function rather than two independently hardcoded constants.
4. **Close strong**: Name the gap between this basic version and a production system — this implementation uses static batching, where each batch has a fixed composition and has to finish before the next one starts. A production system would switch to continuous batching, letting sequences that finish early immediately free their slot for new requests, combined with PagedAttention-style KV cache management to fit larger batches. Volunteering this gap turns a coding-round question into a chance to demonstrate systems thinking.

### Sample Answer (What You'd Actually Say)

> **Frame the problem**: I'd first confirm that `submit` genuinely blocks the calling thread until a result is available, rather than supporting a non-blocking future — I'll assume it's blocking. I'll also assume `run_batch` preserves input-output order, and that multiple threads call `submit` concurrently, so the scheduler's internal state has to be thread-safe. Given that scope, I'd use a shared queue protected by a lock, plus a background scheduling thread.
>
> **Core logic**: `submit` places the request into the queue along with a `threading.Event`, then blocks on that Event. The background thread continuously checks two conditions: has the queue length reached `max_batch_size`, or has the oldest request in the queue been waiting longer than `max_wait_ms` — measured from that request's own enqueue timestamp, never recomputed from scratch on each check. Whichever condition fires first, the thread pulls out the current requests (up to `max_batch_size`) as a batch, calls `run_batch`, writes each result back to its corresponding request, and sets each one's Event to wake its blocked `submit` caller.
>
> **Correctness and follow-up**: I'd verify with two scenarios — a single request with nothing else to batch with should get force-flushed after `max_wait_ms` rather than waiting indefinitely; and rapidly submitting 100 requests should immediately trigger a `max_batch_size` flush without waiting for the timeout. For the discussion question, I'd fold "time already waited" plus "estimated execution time for this batch" into a single latency budget, rather than letting `max_wait_ms` judge in isolation — that avoids letting a large batch push an already-waiting request even further back. Finally, I'd note this version is static batching, and a production-grade version would switch to continuous batching so sequences enter and leave per iteration, plus PagedAttention for KV cache management to support larger batches.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Clearly named both flush triggers (batch-size cap / wait-time cap), whichever fires first | |
| Wait time is measured from when the oldest request entered the queue, not recomputed each check | |
| Handled multi-threaded thread safety (lock + Event/Condition wake-up mechanism) | |
| Discussion answer folds variable batch-execution time into the latency budget | |
| Volunteered continuous batching and PagedAttention as the production-grade extension | |
| Bonus: mentioned backpressure (how to handle overflow when the queue fills up) | |

## Further Reading

- [Achieve 23x LLM Inference Throughput & Reduce p50 Latency — Anyscale](https://www.anyscale.com/blog/continuous-batching-llm-inference) — A full walkthrough of how continuous batching and PagedAttention stack to boost throughput, filling in the quantitative detail behind today's "continuous batching" section.
- [vLLM Explained: PagedAttention and Continuous Batching — RunPod](https://www.runpod.io/articles/guides/vllm-pagedattention-continuous-batching) — A visual explanation of how PagedAttention manages KV cache with paging, good for building intuition if you're new to the concept.
- [45+ AI Engineer Interview Questions & Answers (2026 Guide) — Exponent](https://www.tryexponent.com/blog/ai-engineer-interview-questions/) — The source of today's question and the LLM serving interview framework, with a full categorized AI Engineer interview question bank.

## References

- [45+ AI Engineer Interview Questions & Answers (2026 Guide) — Exponent](https://www.tryexponent.com/blog/ai-engineer-interview-questions/) — Source for today's practice question and the Anthropic inference batching prompt and LLM serving framework.
- [Design an inference batching system for a single GPU — Exponent question bank](https://www.tryexponent.com/questions/5780/inference-batching-system) — Original question page for today's practice question.
- [Achieve 23x LLM Inference Throughput & Reduce p50 Latency — Anyscale](https://www.anyscale.com/blog/continuous-batching-llm-inference) — Source for the "continuous batching" and "PagedAttention" concept sections.
- [vLLM Explained: PagedAttention and Continuous Batching — RunPod](https://www.runpod.io/articles/guides/vllm-pagedattention-continuous-batching) — Source for the "PagedAttention" concept section's KV cache paging details.
