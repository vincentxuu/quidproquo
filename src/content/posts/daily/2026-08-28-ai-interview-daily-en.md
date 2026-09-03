---
title: "AI Engineer Interview Daily — 2026-08-28: Coding (Inference Scheduling & Debugging)"
date: 2026-08-28
category: daily
type: digest
tags: [ai-engineer-interview, daily, coding]
lang: en
description: "Today's ML coding round practice: reading and fixing someone else's ML code, a state-machine approach to LLM inference scheduling, leakage-safe pandas time-series features, and AUC-ROC from scratch."
tldr: "2026 ML coding rounds no longer just test 'can you build it from scratch' — they also test whether you can read code someone else broke. Today covers five topics: a state-machine design for LLM inference scheduling, strategies for debugging existing ML code, NumPy shape traps, leakage prevention in pandas time-series features, and computing AUC-ROC by hand. The practice problem is adapted from a recently leaked Anthropic OA: a simplified GPU request scheduler."
series:
  name: "AI Engineer 面試日練"
  order: 9
---

> 🌏 [中文版](/posts/daily/2026-08-28-ai-interview-daily)

## Today's Topic

ML coding rounds picked up a new branch in 2026: instead of handing you a blank page and asking you to implement an algorithm from scratch, the interviewer hands you code that looks like it runs but has a hidden bug, and gives you a time limit to read the logic, find the problem, and get every test passing. This format is closer to real work than pure from-scratch coding — senior engineers spend far more time reading other people's code than writing new code of their own.

Today's five topics — a state-machine mindset for LLM inference scheduling, strategies for debugging existing code, NumPy shape traps, leakage prevention in pandas time-series features, and computing AUC-ROC by hand — span both frontier-lab OA style and traditional FAANG coding-round style. Working through this covers both interviewer perspectives: "build it from scratch" and "read it, understand it, fix it."

## Core Concepts Quick Reference

### A State-Machine Design for LLM Inference Scheduling

Frontier labs like Anthropic have started asking for a "simplified GPU request scheduler": each request first goes through a Prefill stage (building the KV cache), then a Decode stage (generating one token at a time), and the GPU has a fixed token-batch capacity per timestep. The trick isn't simulating a real system like vLLM — it's treating the problem as a clean state machine, with explicit Waiting/Prefill/Decode/Finished states, queues managing the transitions, and finished requests removed immediately at the end of every step.

### Strategies for Debugging Existing ML Code

When the interviewer hands you code that "looks right but has a bug hiding somewhere," don't rush to rewrite it. Run the tests first to see which cases fail, start fixing from the smallest edge case, rerun tests after every change, and keep changes minimal instead of rewriting the whole thing. This process itself is what gets scored — the interviewer is watching for a systematic debugging habit, not luck in spotting the bug.

### NumPy Shape Traps

`(n,)`, `(n, 1)`, and `(1, n)` often "look the same" mathematically but behave completely differently under broadcasting, indexing, and matrix operations. This is the most common source of bugs when debugging existing ML code, especially in recursive tree construction or hand-rolled gradient updates — one careless `squeeze()` or `reshape()` and the code silently computes the wrong answer for certain inputs without ever throwing an exception.

### Pandas Time-Series Features and Data Leakage

Rolling-window features (moving average, standard deviation, extrema) are a common pandas hand-coding problem for time-series ML, and the crux is handling window boundaries correctly — should a too-short window return NaN or compute over whatever's available — plus the leakage bug interviewers love to catch: using future data to compute a feature for the current timestep. The test for leakage is direct: would this feature actually be available at the moment you're making the prediction?

### AUC-ROC from Scratch

Given predicted probabilities and labels, the standard way to hand-code AUC-ROC is: sort by predicted probability, sweep every possible threshold, compute TPR and FPR at each threshold, then integrate using the trapezoidal rule. Beyond whether you can write it, interviewers often follow up with "AUC is 0.92 but the business metric hasn't moved — what could explain that?" — which ties the from-scratch implementation directly back to production model-evaluation judgment.

## Today's Practice Problem

### Problem

"Implement a simplified LLM inference request scheduler. Each request passes through two stages in order: Prefill (building the KV cache) and Decode (generating one token at a time). The GPU has a fixed token-batch capacity per timestep. Design the data structures and scheduling logic to correctly handle request state transitions, and make sure excess requests wait for the next round when capacity is exceeded."

**Source**: A recently leaked Anthropic OA problem (2026)　**Difficulty**: Advanced　**Format**: Online assessment (take-home coding)

### Approach Breakdown

1. **Clarify the problem first**: Ask whether the capacity limit refers to "total tokens processed this timestep" or "number of requests," whether Prefill and Decode tokens share the same capacity budget, whether request order needs to stay FCFS or can be reordered, and whether preemption is in scope.

2. **Build the scaffold**: Don't try to simulate real GPU scheduling details — treat this purely as a state machine. Define four states, `Waiting → Prefill → Decode → Finished`, each backed by a queue. Each timestep: first let requests already in Decode generate one token (priority usually goes to in-flight requests to avoid starvation), then use remaining capacity to pull new requests from Waiting into Prefill.

3. **Go deeper on the core**: The three places most likely to go wrong — and what interviewers most want you to articulate clearly — are: (a) the state-transition ordering constraint: a request can't enter Decode before Prefill has completed; (b) the capacity check must happen *before* adding a request to this timestep's batch, not after discovering you've overshot; (c) finished requests must be removed from the queue immediately, or they'll pollute the next round's scheduling decisions. These three map directly onto the three failure modes the problem statement calls out.

4. **Wrap up**: Proactively say something like "this is just a simplified correctness model for scheduling — a real system like vLLM would use continuous batching and PagedAttention to manage KV cache memory, but that's a separate optimization layer; the OA is testing whether the state machine itself is correct." This shows you understand the problem's scope and won't over-engineer it.

### Sample Answer (How to Walk Through It in the Interview)

> I'll treat this entirely as a state machine and skip simulating real GPU details. **First, I define four explicit states**: `waiting`, `prefill`, `decode`, `finished`, managed with four queues (or a single list of request objects with a state field). Each timestep runs in two passes: first, process every request currently in Decode and generate one token each, consuming one unit of capacity; second, with whatever capacity remains, pull requests from Waiting into Prefill in order, and once Prefill finishes for a request it transitions to Decode and starts generating on the next timestep.
>
> **I'll write the capacity check as "tentatively compute, then commit"**: before adding a request to this timestep's batch, check whether current usage plus this request's cost would exceed the limit — if so, it stays in Waiting and tries again next round. That avoids the messier logic of "add it, discover you overshot, then roll back."
>
> **I'll write state transitions as assertions, not assumptions**: for example, no request in the Decode queue should ever have an incomplete Prefill. The moment a request generates its end token, I mark it `finished` and remove it from the Decode queue immediately, rather than leaving cleanup for the next round. These defensive checks look redundant, but they're exactly where this kind of OA's hidden tests like to poke.

### Self-Check Checklist

Use this table to check whether your answer covers the key points:

| Checkpoint | Covered? |
|---------|---------|
| Explicitly defined Waiting/Prefill/Decode/Finished states | |
| Capacity check happens *before* adding to the batch, not after | |
| Prefill must complete before Decode (state ordering constraint) | |
| Finished requests removed within the same timestep | |
| Clear scheduling priority rule (FCFS or otherwise) and starvation handling | |
| Bonus: mentioned vLLM continuous batching / PagedAttention as the production extension | |

## Further Reading

- [Anthropic OA Latest Review: Inference Engine + Extra Trees Debug](https://dev.to/interviewshow-cs/anthropic-oa-latest-review-inference-engine-extra-trees-debug-b9i) — Full breakdown of today's practice problem, plus the common NumPy shape traps in the companion Extremely Randomized Trees debug problem
- [The Machine Learning Engineer Interview Guide (2026) — TechScreen](https://techscreen.app/articles/machine-learning-engineer-interview-guide-2026) — A full breakdown of the 2026 trend toward "debug an existing training loop" / "read a 200-line legacy script and find the bug" style applied ML coding problems
- [Python Machine Learning Interview Questions for Data Scientists — Let's Data Science](https://letsdatascience.com/blog/python-machine-learning-interview-questions) — Complete worked examples and common mistakes for from-scratch AUC-ROC, k-fold cross-validation, and similar problems

## References

- [Anthropic OA Latest Review: Inference Engine + Extra Trees Debug](https://dev.to/interviewshow-cs/anthropic-oa-latest-review-inference-engine-extra-trees-debug-b9i) — Source for today's practice problem, and the three common failure modes in the "debugging existing code" concept section
- [The Machine Learning Engineer Interview Guide (2026) — TechScreen](https://techscreen.app/articles/machine-learning-engineer-interview-guide-2026) — Source for the 2026 trend description on debugging existing training loops and reading legacy code
- [Python Machine Learning Interview Questions for Data Scientists — Let's Data Science](https://letsdatascience.com/blog/python-machine-learning-interview-questions) — Source for the NumPy shape traps and from-scratch AUC-ROC sections
