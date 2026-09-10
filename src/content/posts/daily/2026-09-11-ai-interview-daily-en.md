---
title: "AI Engineer Interview Daily — 2026-09-11: Coding"
date: 2026-09-11
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Today's coding drill is a real dynamic-batching interview question: how to fill a fixed-capacity batch with individually arriving inference requests, keep slot mapping and multiple stop conditions correct, and why interviewers increasingly test production judgment over rote algorithms."
tldr: "Today's Coding rotation works through a real xAI interview question — implement dynamic batching for token decoding, refilling finished slots in a fixed-capacity batch B while correctly handling three stop conditions (stop_token, stop_sequence, max_tokens) and keeping the slot_id-to-request_id mapping correct. Core concepts cover how continuous batching trades off GPU utilization against latency, using NumPy broadcasting and boolean masks instead of explicit loops, padding and attention masks for variable-length inputs, and why a production batch inference API should scale on queue depth rather than raw GPU utilization. Bonus: a meta-point on interview design — 2026 ML coding interviews increasingly skip rote algorithm recall in favor of realistic production scenarios like today's, testing engineering judgment instead."
series:
  name: "AI Engineer Interview Daily"
  order: 23
---

> 🌏 [中文版](/posts/daily/2026-09-11-ai-interview-daily)

## Today's Topic

Today is the Coding rotation. This round doesn't test generic algorithm puzzles lifted from a coding-challenge site — it tests "ML-flavored" implementation problems: Python (often with NumPy) code tied directly to inference and data processing, like today's "dynamically fill individually arriving requests into a fixed-capacity batch." By 2026, several frontier AI labs' coding rounds routinely wrap a production problem — batching, padding, queue management — into a live coding question. What they're testing is whether you handle edge cases and pick the right data structures on the fly, not how many algorithm templates you've memorized. This round shows up in the onsite coding segment, and it's the line that separates "can grind LeetCode" from "would actually trust their code in a production inference service."

## Core Concepts Cheat Sheet

### The slot-refill logic of dynamic / continuous batching

In a fixed-capacity batch of size B, each slot is progressing through generation at its own pace. The moment one slot's request finishes early (hits a stop token or max_tokens), it should be refilled immediately from the waiting queue — not wait for the entire batch to finish before regrouping. That's the core of continuous batching: it keeps the GPU from sitting idle waiting for the slowest sequence, and it's the design that lets inference engines like vLLM sustain high throughput.

### NumPy vectorization: broadcasting and boolean masks instead of loops

NumPy's performance comes from pushing element-wise operations down into vectorized C-level code instead of Python for-loops. Interviewers love asking "how would you vectorize this loop" — using broadcasting to auto-align arrays of different shapes for arithmetic, and boolean masks (True/False arrays produced by a comparison) instead of `if` checks to filter or update elements. A loop-based answer usually passes the correctness bar, but the follow-up is always "will this run in time on 100k rows?"

### Padding and attention masks for variable-length inputs

Sequences within a batch are usually different lengths, so they get padded to a common length to fit into one tensor — but the padded positions must not actually participate in the computation. That's where an attention mask comes in: it flags which positions are real tokens versus padding, so attention scores or loss computations can mask out the padded positions. This pairs naturally with a batching question, since padding length shifts constantly once old and new slots are mixed together.

### Batch inference APIs: scale on queue depth, not GPU utilization alone

A production batch inference API shouldn't decide when to scale workers purely on GPU utilization, since utilization is a lagging indicator — by the time it spikes, the queue may already be backed up. A more robust approach uses queue depth (how many requests are waiting) or a target wait time as a leading indicator, combined with shape bucketing (grouping similarly-sized requests to reduce padding waste) and clear idempotency semantics across the job's lifecycle.

### The design philosophy behind coding interviews: production judgment, not memorization

More teams are finding that rote algorithm-recall questions don't predict "can this person actually keep a model healthy in production" — realistic, engineering-flavored prompts (how do you handle edge cases in feature engineering, how do you design the batching logic) turn out to be much better signals of data-structure judgment and edge-case sensitivity. If an interviewer is watching you type live, they usually want to see that you state your assumptions before writing code — not how fast you can type.

## Today's Practice Question

### The Question

You're given a black-box "simulated language model" interface: `model_next(batch_prefixes)` takes a list of token lists (one per currently active sequence in the batch) and returns an equal-length `next_tokens` array, where `next_tokens[i]` is the next generated token for `batch_prefixes[i]`. You have a set of requests, each carrying: a `max_tokens` limit (not counting the prompt), a stop condition (either a single `stop_token`, or a `stop_sequence` that ends generation once it appears as a suffix of the output), and a callback to return the final generated result. Implement a dynamic-batching decoding engine: the batch has a fixed capacity `B`; requests start in a waiting queue; you repeatedly call `model_next` to advance all active sequences; sequences may finish at different times due to `max_tokens`, `stop_token`, or `stop_sequence`; whenever a slot frees up, refill it from the waiting queue; maintain a correct `slot_id -> request_id` mapping so tokens never get mixed up across a refill; and correctly handle the case near the end where `len(active) < B`.

**Source**: PracHub Knowledge Hub (xAI Interview Question)　**Difficulty**: Advanced　**Round**: onsite live coding

### How to Break It Down

1. **Clarify first**: Confirm whether `model_next` re-consumes the full prefix on every call (versus only incremental tokens with internal KV-cache state), whether all requests are available in the waiting queue upfront or can arrive mid-run, and whether `stop_sequence` matching needs to handle a stop sequence that straddles two separate generation calls.
2. **Build a framework**: Maintain three pieces of state — a fixed-length `B` array of active slots (each holding its request object and generated-token buffer so far), a FIFO waiting queue for requests not yet in the batch, and a `slot_id -> request_id` mapping. The main loop: assemble `batch_prefixes` from all active slots, call `model_next`, append each returned token to its slot's output buffer, then check whether each slot should terminate.
3. **Go deep on the core**: The sharpest correctness trap here is state leakage on refill — once a slot's request finishes and a new request takes its place, the generation buffer, `max_tokens` counter, and stop-sequence matching state all need a clean reset; otherwise the new request's output gets contaminated by leftover tokens from the old one. The key performance trade-off is "wait to fill vs. run with whatever's available" — running an under-filled batch too eagerly wastes GPU utilization, but waiting too long to fill it drives up latency for requests already sitting in the queue. That's exactly the problem continuous batching solves in real systems.
4. **Close strong**: Walk through how each of the three stop conditions is checked independently — `max_tokens` just counts generated tokens, `stop_token` compares the latest token directly, and `stop_sequence` checks whether the tail of the generated output so far matches the stop sequence (a sliding or suffix check, not a full-string comparison). It's worth proactively tying this back to "this is what vLLM's PagedAttention and continuous batching solve in production — what we're building here is a simplified version," so the interviewer knows you see where this maps in a real system.

### Sample Answer (What You'd Actually Say)

> **Framing the problem**: Before writing any code, I'd confirm a few assumptions — `model_next` consumes the full prefix each call, all requests start in the waiting queue with no concurrent arrivals to handle, and `stop_sequence` needs to be checked against the tail of the current output after every new token. Given that scope, I'd maintain three pieces of state: a fixed-length `active_slots` array of size `B`, a `waiting_queue`, and each slot's own generation buffer plus stop-condition checker.
>
> **Core logic**: Each iteration of the main loop assembles `batch_prefixes` from all active slots and passes it to `model_next`, appends each returned token to the corresponding slot's output buffer, and checks whether that slot has hit `max_tokens`, matched `stop_token`, or has a tail matching `stop_sequence`. The moment a slot is determined to be finished, I'd immediately fire its callback with the result, fully reset that slot's state (buffer, counters, stop-matching state), refill it from `waiting_queue`, and update the `slot_id -> request_id` mapping. If the waiting queue is empty, that slot is marked idle, and the next round only assembles `batch_prefixes` from genuinely active slots — which naturally handles the `len(active) < B` case without extra branching.
>
> **Correctness and extension**: I'd specifically call out that the moment of refill is where bugs are most likely — I'd rather write an explicit `reset_slot` function than let old and new requests share any mutable state. To close, I'd note this is essentially a simplified version of continuous batching — a real system like vLLM layers PagedAttention on top to manage KV-cache memory fragmentation — but today's question already covers the three core pieces: dynamic slot filling, correct slot mapping, and multiple stop conditions.

### Self-Check List

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---------|---------|
| Clearly defined active slots, waiting queue, and each slot's generation state | |
| Slot reset on completion (buffer, counters, stop-condition state) explained, to prevent contaminating new requests | |
| How each of the three stop conditions (max_tokens / stop_token / stop_sequence) is checked | |
| Correct handling of the partially-filled case, `len(active) < B` | |
| Tied back to how this maps to production continuous batching / vLLM | |
| Bonus: discussed the "fill first vs. run with what's available" trade-off between GPU utilization and latency | |

## Further Reading

- [Design a batch inference API — PracHub (Anthropic Interview Question)](https://prachub.com/interview-questions/design-a-batch-inference-api) — Takes today's coding question up a level into a full batch inference API system design prompt, good for extra practice on the same theme.
- [microsoft/batch-inference — GitHub](https://github.com/microsoft/batch-inference) — A real open-source dynamic batching library claiming up to 16x throughput on GPT completion scenarios; a useful comparison against the simplified version you'd write in an interview.
- [Real-time, Batch, and Micro-Batching Inference Explained — dat1.co](https://dat1.co/blog/real-time-batch-and-micro-batching-inference-explained) — Lays out the trade-offs between real-time, batch, and micro-batching inference plainly, good for sharpening intuition on which to pick when.

## References

- [Implement dynamic batching for token decoding — PracHub (xAI Interview Question)](https://prachub.com/interview-questions/implement-dynamic-batching-for-token-decoding) — Source of today's practice question and its slot-mapping and stop-condition design.
- [Design a batch inference API — PracHub (Anthropic Interview Question)](https://prachub.com/interview-questions/design-a-batch-inference-api) — Source for the queue-depth-driven autoscaling and shape-bucketing concepts.
- [Machine Learning Engineers Interview Questions (25 That Predict Performance) — Korebpo](https://korebpo.com/machine-learning-engineers-interview-questions) — Source for the "coding interviews test production judgment, not memorization" framing.
