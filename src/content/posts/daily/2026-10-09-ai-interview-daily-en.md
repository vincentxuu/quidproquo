---
title: "AI Engineer Interview Daily — 2026-10-09: Coding"
date: 2026-10-09
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Friday's slot is Coding. Moving past the scheduler, tokenizer, and sampling problems from recent weeks, today's drill is a component every LLM API gateway ends up hand-rolling: a token-bucket rate limiter whose cost scales with token count, with a focus on lazy refill math, the check-then-deduct race condition, and what happens when a single request's cost exceeds the bucket's own capacity."
tldr: "Today's Coding drill shifts away from the inference scheduling, tokenizer, and sampling problems covered in recent weeks toward another component nearly every LLM API gateway has to build itself: a token-bucket rate limiter. Unlike a generic API rate limiter, LLM rate limiting is measured in tokens, not requests — OpenAI and Anthropic both enforce dual RPM/TPM limits, and a single request can cost thousands of tokens instead of a flat 1. The core ideas covered here are lazy refill (computing how many tokens accrued using elapsed time × refill rate at check time, with no background timer), the check-then-deduct race condition (concurrent reads of the balance can over-admit requests), what to do when a single request's cost exceeds the bucket's total capacity, and extending the design to multiple API gateway instances sharing one global quota via an atomic Redis Lua script — using Redis's own clock rather than each server's local time. Today's practice question comes from a real question collected in an AI engineering interview question bank."
series:
  name: "AI Engineer 面試日練"
  order: 51
---

> 🌏 [中文版](/posts/daily/2026-10-09-ai-interview-daily)

## Today's Focus

Friday's slot is Coding. Previous weeks already covered inference scheduling (twice), a BPE tokenizer, a longest-match tokenizer, a dynamic-batching decode engine, and temperature/top-k/top-p sampling. Today's problem is another LLM API gateway staple, but from a different angle: a token-bucket rate limiter. On the surface this looks like a textbook algorithm, but applying it to an LLM API introduces one variable that classic rate limiters don't have to deal with — cost isn't a flat 1, it scales with token count — and that single change surfaces several edge cases a generic rate limiter never has to think about. This is good practice for a backend/infra technical screen, and for the follow-up question "how would you limit how often a user can call your LLM API" — you want to be able to describe a concrete algorithm, not just say "add a middleware."

## Core Concepts

### Token bucket is built on lazy refill, not a background timer

A token bucket maintains a running balance of available tokens, a maximum capacity (the burst limit), and a fixed refill rate (tokens added per second). A correct implementation doesn't spin up a background thread to add tokens every second — it uses lazy refill: on every incoming request, it takes "now minus the last-checked timestamp," multiplies by the refill rate to get how many tokens theoretically accrued during that window, adds that to the balance, clamps it to the capacity, and only then checks whether the balance covers the request. The advantage is that the bucket consumes zero resources while idle — correctness depends entirely on getting the elapsed-time math right, not on a running clock.

### LLM API rate limits are measured in tokens, not request count

A generic API rate limiter (say, 100 requests per minute per user) deducts a flat cost of 1 on every call. LLM APIs don't work that way: OpenAI and Anthropic both enforce RPM (requests per minute) and TPM (tokens per minute) simultaneously, and TPM is usually the ceiling you hit first — a single request carrying a 40,000-word document can burn through most of a minute's token budget while barely moving the request counter. That means `try_acquire` can't just mean "this is request number N" — it has to accept a dynamic `cost` argument (typically the estimated input token count, sometimes plus expected output tokens), and that cost is different on every call.

### Check-then-deduct is a textbook race condition

Split lazy refill and deduction into separate steps: read the balance, decide if it's enough, then subtract. If those three steps aren't a single atomic operation, concurrent callers break it — two threads can both read a balance that looks sufficient, both pass the check, and both deduct, leaving the balance negative and effectively admitting more traffic than the limit allows. The fix is to wrap the entire "read balance → apply refill → check → deduct" sequence in a single lock (a `threading.Lock` for a single-process version) or a single atomic operation (a Redis Lua script for the distributed version), so no other request can interleave in the middle.

### A request whose cost exceeds the bucket's total capacity needs an explicit decision

If a single request's cost (say, 5,000 tokens) exceeds the bucket's maximum capacity (say, capacity is only 3,000), that request can never succeed no matter how long it waits or how full the bucket gets. If the caller's retry logic treats this the same as "temporarily insufficient balance," it retries forever with no way to tell what's wrong. The right design distinguishes this case from "not enough right now, but will be later" — typically by raising a distinct exception or returning a different result when cost exceeds capacity, rather than reusing the same "insufficient balance, try again" return value.

## Today's Practice Question

### The Question

Implement a `TokenBucketLimiter` class whose constructor takes `capacity: float` (the bucket's maximum size) and `refill_rate: float` (tokens added per second), with a method `try_acquire(cost: float, now: float) -> bool`. On each call, first compute elapsed time since the previous call, multiply by `refill_rate` to get the accrued tokens, add them to the balance and clamp to `capacity`; then check whether the balance is `>= cost` — if so, deduct `cost` and return `True`; otherwise leave the balance untouched and return `False`. Handle these edge cases correctly: `cost` exactly equal to the current balance; `cost` exceeding `capacity` (a request that can never succeed, which must be distinguishable from "temporarily insufficient, will succeed later"); `now` equal to or barely greater than the previous call's timestamp (avoid floating-point drift pushing the balance slightly over `capacity`); and thread-safety when `try_acquire` is called concurrently. Follow-up discussion: how would you adapt this when multiple API gateway instances need to share one global quota — for example, a plan-wide TPM limit shared across every server behind a load balancer?

**Source**: A real question collected in an AI engineering interview question bank (open-source GitHub collection; original wording: "Implement a token-bucket rate limiter for an LLM API where cost scales with tokens, then make it distributed")　**Difficulty**: Medium　**Round**: technical screen / infra coding round

### How to Break It Down

1. **Clarify first**: Confirm whether `now` is a timestamp passed in by the caller (for testability, without real waiting) or something `try_acquire` grabs internally via `time.monotonic()`. Confirm whether `cost` is always positive and whether `capacity`/`refill_rate` need validation against nonsensical values like zero or negative. These decisions shape how strict the interface needs to be.
2. **Build the framework**: The core logic has three steps — (1) compute elapsed: `now - self._last_refill_time`; (2) refill: `self._tokens = min(self.capacity, self._tokens + elapsed * self.refill_rate)`, then update `self._last_refill_time = now`; (3) check and deduct: `if self._tokens >= cost: self._tokens -= cost; return True`, else `return False`. Wrap the whole thing in a lock to guarantee atomicity.
3. **Go deep on the core trade-off**: The real depth here is separating "the algorithm itself" from "what's unique about LLM APIs" — most token-bucket tutorials assume a flat cost of 1, but here cost varies, and that variation is exactly what creates the "this request can never succeed" edge case (with a flat cost of 1, any capacity ≥ 1 guarantees eventual success; with variable cost, some requests are structurally too big for the bucket). For the follow-up, the answer is to move state out of process memory and into Redis, wrapping "read balance, apply refill, check, deduct" into a single atomic `EVAL` call via a Lua script so concurrent gateways hitting the same key can't over-admit. Time should come from Redis's own `TIME` command rather than each app server's local clock, because clock skew between machines — even a few hundred milliseconds to a few seconds — would make different servers compute different refill amounts for the same key, meaning the rate limit isn't actually the same rule on every machine.
4. **Wrap up**: Converge the answer into four layers — lazy refill computes how much accrued, the check covers the variable cost, the whole operation must be atomic, and an oversized request must be distinguishable from a temporarily-insufficient one — while explicitly calling out that variable cost is the key difference from the textbook version, showing you've actually thought through how the algorithm breaks when applied to an LLM-specific workload rather than reciting it from memory.

### Sample Answer (how to say it out loud in an interview)

> I'd design the class state with three fields: `capacity`, `refill_rate`, and the current balance plus the timestamp of the last check. **Step one in `try_acquire` is lazy refill**: take the `now` passed in, subtract the last-checked timestamp to get elapsed time, multiply by `refill_rate` to get how many tokens theoretically accrued, add that to the balance and clamp it to `capacity` so it never overshoots, and store this call's `now` as the new baseline. **Step two is the check**: if the balance is greater than or equal to this request's `cost`, deduct and return `True`; otherwise leave the balance untouched and return `False`.
>
> **The big difference from a generic rate limiter is that cost varies**, because LLM API limits are measured in tokens, not requests — a single long-context request can eat most of a minute's budget in one shot. That means I need to specifically handle the case where `cost` itself exceeds `capacity`: no amount of refilling will ever let that request through, and if I return the same `False` as "temporarily insufficient," the caller's retry logic will spin forever with no way to diagnose why — so I'd raise a distinct exception, or return a different value, to separate the two cases. **The whole read-refill-check-deduct sequence needs to sit behind a lock**, otherwise two threads reading the same sufficient balance will both deduct and push it negative, effectively admitting more traffic than the limit allows. To extend this across multiple gateways sharing one quota, I'd move the state into Redis and wrap the entire operation into one atomic `EVAL` call via a Lua script, and I'd pull time from Redis's own `TIME` command rather than each machine's system clock — clock skew between servers would otherwise make the same rate-limit rule compute differently depending on which machine handled the request.

### Self-Check

Use this table to check whether your answer covered the key points:

| Checklist item | Covered? |
|---------|---------|
| Lazy refill: compute accrued tokens from elapsed time × refill rate, not a background timer | |
| Called out that LLM API cost scales with token count, not a flat 1 | |
| Check-then-deduct is a race condition that needs a lock or atomic operation | |
| A request whose cost exceeds capacity must be distinguishable from "temporarily insufficient" | |
| Bonus: distributed version mentions Redis Lua script atomicity and using Redis's clock instead of each machine's local time | |

## Further Reading

- [Token bucket rate limiter with Redis and Go — Redis Docs](https://redis.io/docs/latest/develop/use-cases/rate-limiter/go) — The official guide to wrapping read, refill, and deduct into a single atomic Lua script, matching today's distributed-version discussion.
- [Stop 429s, 15% Token Drift: Gateway LLM Rate Limits for Engineers — MLflow](https://mlflow.org/articles/rate-limiting-llm) — Explains why LLM APIs enforce both RPM and TPM and why TPM is usually the first ceiling hit, the background for today's "rate limits measured in tokens" section.
- [How to Build a Distributed Rate Limiting System Using Redis and Lua Scripts — freeCodeCamp](https://www.freecodecamp.org/news/build-rate-limiting-system-using-redis-and-lua/) — A full distributed token-bucket walkthrough with a runnable Lua script and a Docker test setup.

## References

- [AI Engineering Interview Questions — GitHub (collected by amitshekhariitbhu)](https://github.com/amitshekhariitbhu/ai-engineering-interview-questions) — Source of today's practice question, "Implement a token-bucket rate limiter for an LLM API where cost scales with tokens, then make it distributed."
- [Token bucket rate limiter with Redis and Go — Redis Docs](https://redis.io/docs/latest/develop/use-cases/rate-limiter/go) — Source for the "check-then-deduct race condition" section and the distributed-version Lua script atomicity discussion.
- [Stop 429s, 15% Token Drift: Gateway LLM Rate Limits for Engineers — MLflow](https://mlflow.org/articles/rate-limiting-llm) — Source for the "LLM API rate limits are measured in tokens, not requests" section's RPM/TPM explanation.
- [How to Build a Distributed Rate Limiting System Using Redis and Lua Scripts — freeCodeCamp](https://www.freecodecamp.org/news/build-rate-limiting-system-using-redis-and-lua/) — Source for the "cost exceeding bucket capacity" discussion and the distributed version's clock-skew point.
