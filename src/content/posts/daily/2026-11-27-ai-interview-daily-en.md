---
title: "AI Engineer Interview Drill — 2026-11-27: Coding"
date: 2026-11-27
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Friday's topic is Coding: hand-rolling a simplified continuous-batching scheduler, and practicing how to talk through the different cost structure of prefill versus decode, plus why the payoff of continuous batching is tied directly to output-length variance."
tldr: "Continuous batching isn't a guaranteed win: when every request's output length is identical (CV = 0), measured throughput matches static batching exactly; the gain only shows up, and climbs to 2.91x, once output lengths get spread out toward CV near 1. The point interviewers catch most people missing: the scheduler (who gets to run) and PagedAttention (how the KV cache is stored) are two separate, complementary layers — whether a freed slot can immediately take a new request depends on whether memory allocation allows it, not on the scheduling logic alone."
series:
  name: "AI Engineer 面試日練"
  order: 100
---

> :globe: [中文版](/posts/daily/2026-11-27-ai-interview-daily)

## Today's Focus

Friday is the fixed slot for Coding, narrowed to the ML-flavored implementation problems that show up most: batch inference, tokenizers, data processing, numpy. These rounds aren't checking whether you can call a library function — they're checking whether you know what's happening underneath it.

Today's pick is hand-rolling a simplified continuous-batching scheduler: simulating what one decode step of an LLM serving engine actually does — which requests are running, which ones just finished, and who gets the freed-up slot. It touches both "can you write the scheduling loop cleanly" and "ML system design" at once: getting the loop to run is the baseline. Being able to explain that the payoff of continuous batching is tied to the traffic's output-length distribution, not a free lunch, is what actually separates candidates on this question.

## Core Concepts, Fast

### Prefill and decode have fundamentally different cost structures

Prefill reads the whole prompt in one pass; its compute cost scales with prompt length and keeps the GPU busy with real matrix work. Decode produces one token per step, but every single step has to re-read the entire set of model weights. One measurement: Qwen2.5-7B in bfloat16 has about 15.2 GB of weights, a GB10's memory bandwidth is about 273 GB/s, giving a theoretical floor of 55.7 ms per weight read — and a single-request decode step measured 78.05 ms. Pushing the batch from 1 to 32 barely moved that per-step time (78.05 ms to 74.77 ms), while total throughput jumped 26.7x. In other words, decode's per-step cost is nearly fixed regardless of how many requests share it — an empty slot is pure waste, not savings.

### Static, dynamic, and continuous batching differ in who decides when to swap requests

Static batching collects a fixed-size batch and waits for every request in it to finish before starting the next batch — if one request happens to be long, every request that already finished keeps occupying a slot for nothing. Dynamic batching adds a timeout so the batch can start even if the queue hasn't filled, but once it starts, the policy is identical to static: a long request still blocks everyone else's slot. Continuous batching changes the unit of scheduling from "a whole batch" to "every decode step": after each step it checks which requests just finished, and immediately hands their freed slot to the next request in the waiting queue, without waiting for the whole batch to clear.

### Continuous batching's payoff is tied directly to output-length variance — it's not a guaranteed win

This is the easiest point to get caught out on, and the easiest to oversimplify. Using the coefficient of variation (CV, standard deviation divided by mean) to measure how spread out output lengths are, the measured results are clear: at CV = 0 (every request produces exactly the same number of tokens), continuous batching's throughput ratio against static batching is 1.00x — no difference at all, because every request finishes at the same time and there's no freed slot to reclaim. At CV = 0.58 the ratio is 1.40x; at CV = 0.94 it jumps to 2.60x; at CV = 0.99 (close to real chat traffic) it reaches 2.91x. What an interviewer wants to hear isn't "continuous batching is always faster than static" — it's "the gain comes from reclaiming freed slots, and the more spread out the output lengths are, the more slots there are to reclaim."

### The scheduler and KV-cache memory management are two separate, complementary layers

The scheduler decides who runs in a given step, but a slot can only actually change hands if the memory layer allows any request to occupy any piece of memory — that's the problem PagedAttention solves. It stores each request's KV cache as fixed-size pages drawn from a shared pool, with a block table recording which pages belong to which request, so pages don't need to be stored contiguously. If the KV cache were allocated as one contiguous block instead, the hole left by a finished request usually doesn't match the size the next waiting request needs, so even if the scheduler wants to swap requests, memory can't produce the exact space. Saying both layers out loud — the scheduler handles who runs, PagedAttention handles how it's stored — shows you understand how the pieces connect, not just that "continuous batching is faster."

### Token budget and slot count are two independent production limits

Real systems don't just limit "how many requests can run at once" — there's also a budget for "how many tokens this step can process in total." Slot count (like vLLM's `max_num_seqs`, a cap on concurrent requests) and the per-step token budget (like `max_num_batched_tokens`, covering every decoding token plus any prompt chunk being read) are two separate knobs. If a long prompt gets read in one step, it eats the entire token budget for that step, forcing every other request that's mid-decode to pause — which is why production systems use chunked prefill: splitting a long prompt across several steps so it shares the budget with everyone else's decode tokens instead of monopolizing a whole step.

```flow-diagram
{
  "title": "One decode step of continuous batching",
  "lang": "en",
  "width": 640,
  "height": 460,
  "nodes": [
    {"id": "decode", "label": "Every request in a slot\nemits one token", "x": 210, "y": 50, "w": 300, "h": 70},
    {"id": "check", "label": "Check remaining output length:\nwhich requests just finished?", "x": 210, "y": 160, "w": 300, "h": 70},
    {"id": "free", "label": "Finished requests leave their slot,\nfree their KV-cache pages", "x": 210, "y": 270, "w": 300, "h": 70, "tone": "accent"},
    {"id": "fill", "label": "Fill freed slots from the waiting\nqueue (FIFO), bounded by token budget", "x": 210, "y": 380, "w": 300, "h": 60}
  ],
  "edges": [
    {"from": "decode", "to": "check", "step": 1},
    {"from": "check", "to": "free", "step": 2},
    {"from": "free", "to": "fill", "step": 3},
    {"from": "fill", "to": "decode", "step": 4, "label": "Next decode step", "via": [[400, 380], [400, 50]], "labelAt": [400, 220], "tone": "warn"}
  ],
  "steps": [
    "Every decode step, each request currently in a slot emits one more token. The cost of this step is nearly independent of how many requests share the slots — it's mostly a single re-read of the model's weights.",
    "After emitting tokens, check each request's remaining output length to see which ones hit zero — this determines who leaves after this step.",
    "Finished requests leave their slot and free the KV-cache pages they held (PagedAttention stores these in small pages, so freed space can be reused by any new request without needing to match the exact size).",
    "Fill the freed slots from the waiting queue in FIFO order. A new request's prefill shares the same step's token budget with everyone else's decode tokens — if it's too long, it has to be split across several steps (chunked prefill) instead of consuming the whole budget at once and stalling everyone else mid-decode."
  ],
  "caption": "Simplified for clarity: preemption (evicting an already-running request when the KV cache is full) and cross-GPU scheduling are omitted. The point that matters is keeping \"decode cost per step is roughly fixed, so an idle slot is pure waste\" separate from \"the scheduler swaps requests, but memory management is what makes the swap possible.\""
}
```

## Today's Practice Question

### The Question

Write a simplified continuous-batching scheduler for LLM serving. The engine has a fixed number of decode slots (`max_slots`); each decode step lets only the requests currently occupying a slot emit one token each. Requests arrive as `(request_id, output_len)` in a waiting queue, not necessarily all at once.

**Level 1**: Write `step()` to simulate one decode step — decrement the remaining token count of every occupied request by 1, remove (and return) any request whose remaining count hits 0, and use the freed slots to pull new requests from the waiting queue in FIFO order.

**Level 2 (advanced)**: The engine also has `max_batched_tokens`. A new request's prefill must first consume a token budget equal to its prompt length, and that budget has to be shared with every decode token running in the same step. A prompt that's too long has to be read across multiple steps (chunked prefill) instead of consuming an entire step's budget at once and stalling other requests that are mid-decode.

**Source**: FastPrep's problem bank lists this as an Anthropic Fellow Program project-coding question, "Inference Engine Scheduler" — "Implement the request scheduler of an LLM inference engine, assigning prefill and decode work across progressively harder levels," still being reported as of November 2026. **Difficulty**: Intermediate to advanced **Round**: Project coding (live coding plus follow-ups that escalate the difficulty level by level)

### How to Break It Down

1. **Clarify the problem first**: Is each request's output length known ahead of time, or does the scheduler only find out as tokens get generated (in practice, usually unknown — the scheduler can only act on tokens already emitted)? Is the slot count fixed, or does it scale dynamically with available GPU memory? Do prefill and decode share one token budget? Should preemption be supported — evicting a running request when the KV cache is full, to be rebuilt later?
2. **Build a framework**: Use two data structures — a dict of currently-occupied requests with their remaining token counts, and a FIFO queue of waiting requests. `step()` always does three things in order: decrement every occupied request's remaining count by 1, filter out the ones that hit 0 as this step's completions, then use the freed slot count to pull that many requests off the waiting queue.
3. **Go deep on the core**: The most important trade-off to raise unprompted — continuous batching's payoff isn't guaranteed; it's entirely a function of the traffic's output-length variance (CV). At CV = 0 it matches static batching exactly (1.00x); it only reaches 2.60x at CV = 0.94 and 2.91x at CV = 0.99. Also explain that the scheduler (who runs) and the memory manager (PagedAttention, how the KV cache is stored) are two separate but complementary layers — the scheduler wants to swap requests, but that only works if memory allows any request to occupy any page; otherwise the incoming request might not find a contiguous block of the right size.
4. **Close strong**: Emphasize that this question isn't really testing whether you can write a clean loop — it's testing whether you know what production constraints this scheduler actually has to deal with: token budget and slot count are two independent knobs, a long prompt needs chunked prefill so it doesn't stall everyone else, and a full KV cache needs a preemption fallback. Volunteering these three points gets you further than stopping once Level 1 compiles.

### A Sample Answer (how you'd actually say this in an interview)

> I'd split this into two layers upfront — scheduling and memory — because that's how production systems actually divide the work. **On the scheduling side**: keep a table of currently-running requests and a waiting queue. Every decode step does three fixed things — let every running request emit one token, filter out the ones whose remaining length hit zero, and fill the freed slots from the waiting queue in FIFO order. That logic isn't hard by itself, but I'd flag one thing explicitly: continuous batching's payoff isn't automatic — it depends entirely on how spread out the traffic's output lengths are. If every request produces the same number of tokens, there's no freed slot to reclaim, so it's exactly as fast as static batching. It only pulls ahead when output lengths vary — some requests finish fast and some run long — and measured results show the throughput ratio climbing from 1x to nearly 3x as that variance goes from none to something close to real chat traffic.
>
> **On the memory side**: saying "this slot changes hands now" is one sentence, but making that swap actually work requires the KV cache to be managed in pages — each request's cache stored as fixed-size pages drawn from a shared pool, not requiring contiguous memory, so a freed request's space can be reused by any new request without needing to match exactly. For production I'd add two more constraints: the per-step token budget has to count decode and prefill together, so a long incoming prompt gets split across several steps instead of blocking everyone else's decode step; and when the KV cache is full, the engine needs to be able to evict the most recently admitted request, put it back at the front of the queue, and later re-read its prompt to rebuild its state — that's preemption, and the answer still comes back complete, just later.

### Self-Check

Use this table to check whether your answer covered the key points:

| Checklist item | Covered? |
|---|---|
| Distinguished prefill (compute-bound, scales with prompt length) from decode (roughly fixed per-step cost, re-reads weights every step) | |
| Explained continuous batching vs. static batching: slots change hands without waiting for the whole batch to finish | |
| Explained that continuous batching's payoff depends on output-length variance (CV), and is a no-op at CV = 0 | |
| Mentioned that token budget (e.g. `max_num_batched_tokens`) and slot count (e.g. `max_num_seqs`) are two independent limits | |
| Mentioned that the scheduler (who runs) and KV-cache memory management / PagedAttention (how it's stored) are separate but complementary layers | |
| Bonus: volunteered chunked prefill (splitting long prompts) or preemption (the fallback when the KV cache is full) | |

## Further Reading

- [Continuous Batching Beats Static and Dynamic by Up to 2.91× in vLLM](https://towardsdatascience.com/continuous-batching-beats-static-and-dynamic-by-up-to-291-in-vllm) — a controlled experiment on one GPU, holding the engine and memory manager fixed and varying only the scheduling policy, that quantifies how continuous batching's payoff tracks output-length variance (CV)
- [vLLM interview questions, answered with numbers from a real GPU](https://systemdesignacademy.medium.com/vllm-interview-questions-answered-with-numbers-from-a-real-gpu-5c666bf27328) — measured numbers for continuous batching, PagedAttention, preemption, and chunked prefill against real vLLM settings (`max_num_seqs`, `max_num_batched_tokens`), useful for follow-up questions that ask for specifics

## References

- [Anthropic Interview Questions (35, Updated Nov 2026) — fastprep.io](https://www.fastprep.io/anthropic-interview) — source for today's practice question, listing the Anthropic Fellow Program project-coding question "Inference Engine Scheduler": assigning prefill and decode work across progressively harder levels
- [Continuous Batching Beats Static and Dynamic by Up to 2.91× in vLLM — Towards Data Science](https://towardsdatascience.com/continuous-batching-beats-static-and-dynamic-by-up-to-291-in-vllm) — source for "Prefill and decode have fundamentally different cost structures" and "Continuous batching's payoff is tied directly to output-length variance" (CV 0 to 0.99 mapping to 1.00x–2.91x, decode step 78.05ms → 74.77ms)
- [vLLM interview questions, answered with numbers from a real GPU — systemdesignacademy](https://systemdesignacademy.medium.com/vllm-interview-questions-answered-with-numbers-from-a-real-gpu-5c666bf27328) — source for "Static, dynamic, and continuous batching", "The scheduler and KV-cache memory management are two separate, complementary layers", and "Token budget and slot count are two independent production limits" — PagedAttention page size, `max_num_seqs`/`max_num_batched_tokens` defaults, and preemption numbers all come from this piece
