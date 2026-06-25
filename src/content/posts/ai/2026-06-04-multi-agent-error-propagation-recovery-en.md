---
title: "Multi-Agent Error Propagation and Recovery: Borrowing Thirty Years of Weapons from Distributed Systems"
date: 2026-06-04
category: ai
type: deep-dive
tags: [multi-agent, ai-agent, fault-tolerance, orchestration, llm]
lang: en
tldr: "At 99% accuracy per step over 100 steps, the error-free completion rate drops to just 36% -- error compounding is a structural problem, not something prompt tuning can fix. Distributed systems' supervisor trees, bulkheads, circuit breakers, sagas, and durable execution can be mapped almost one-to-one into agent orchestration. But LLMs introduce a failure class that traditional systems never had -- semantic errors that don't crash -- which require Inspector agents (recovering 96.4%) and redundancy voting (MAKER: one million steps with zero errors) to address."
description: "Comparing LLM multi-agent orchestration with traditional distributed systems fault-tolerance: the math of error compounding, MAST's 14 failure modes, how topology affects fragility, lessons from Erlang OTP / sagas / Temporal, and why semantic-layer errors render all traditional detection signals useless."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-06-04-multi-agent-error-propagation-recovery)

A 99% accuracy per step sounds high, but over a 100-step workflow, the error-free completion rate drops to just `0.99^100 ≈ 36%`; at 200 steps it's 13%. This is the classic math of "series reliability" -- a multi-step workflow fails if any single step goes wrong, so the overall success rate is the product of each step's success rate. The key insight: **this is a structural problem, not something prompt tuning can fix**. No matter how much models improve, they can only reduce the per-step error rate p -- they cannot change the shape of exponential decay.

The good news is that distributed systems have been fighting this battle for thirty years, and their arsenal can be mapped almost one-to-one. The bad news is that LLMs introduce a failure class traditional systems never had -- **semantic errors that don't crash** -- which render all traditional fault-tolerance trigger signals useless. This post lays the two worlds side by side and sorts out what you can copy directly versus what you need to invent from scratch.

## How LLM Agents Amplify Errors

Simple probabilistic compounding is just the starting point. Agent collaboration "spreads" single-point errors into system-level failures:

- **Errors become epistemic premises**: In peer-to-peer architectures, Agent B directly consumes Agent A's output without intermediate validation -- if A is wrong, B reasons on top of that error, and C then ingests the combined errors from A+B. Errors are not isolated events; they become epistemic inputs that shape all downstream reasoning.
- **Topology determines fragility**: "From Spark to Fire" (arXiv:2603.04474, empirical measurements from a single paper) injected errors on LangGraph: injecting into a star topology's **leaf node caused only 9.7% failure rate, while injecting into the hub node caused 100% system-level failure** -- the orchestrator is the single point of failure for error propagation. Huang et al. (ICML 2025, arXiv:2408.00989) ran controlled experiments yielding a resilience ranking: hierarchical A->(B<->C) dropped only 5.5% in performance under a faulty agent, linear chains dropped 10.5%, and flat peer discussion dropped 23.7% -- **flat structures amplify failures**.
- **More agents don't necessarily mean better results**: Without proper isolation and validation, adding agents adds risk, not reliability.

What does failure look like? The anchor paper is MAST ("Why Do Multi-Agent LLM Systems Fail?", arXiv:2503.13657, NeurIPS 2025 Datasets & Benchmarks spotlight): Grounded Theory analysis of 150+ execution traces (each averaging over 15,000 lines), 6 expert annotators (kappa=0.88), distilling **14 failure modes across 3 major categories** -- system design issues (violating task/role specs, step duplication, lost conversation history), inter-agent misalignment (not asking for clarification, task drift, ignoring each other's inputs), and task verification issues (premature termination, no validation, wrong validation). Core insight: **MAS failures primarily stem from inter-agent interaction and system design, not model capability limits** -- "a well-designed MAS can achieve performance gains with the same base model." This is precisely the foundation for borrowing engineering tools from distributed systems.

## The Most Critical Gap: Semantic Errors That Don't Crash

Mapping LLM failures against traditional faults, most have equivalents: tool call failure = transient fault, context pollution = state corruption, step duplication = state machine bug. But three have no traditional counterpart: **hallucination** (confidently producing incorrect content), **silent semantic failure** (process alive, responses normal, content nonsensical), and **false consensus** (multiple agents mutually reinforcing errors -- closest to Byzantine faults but with different root causes).

What these three share: no exceptions thrown, no crashes, health probes all green. **Traditional "detect -> isolate -> restart" trigger signals are completely useless** -- this is the gap that must be filled when borrowing from distributed systems.

## What You Can Copy Directly: Isolation Weapons

**Supervisor tree (Erlang/OTP, the standard answer for 30 years)**. Structural separation: supervisors are only responsible for starting, monitoring, and restarting; all business logic lives in workers. Three restart strategies directly encode dependency relationships -- `one_for_one` (independent child nodes), `one_for_all` (tightly coupled groups), `rest_for_one` (linear dependency chains). Add **restart intensity** (if restarts exceed the limit within a time window, the supervisor terminates itself and escalates) to prevent infinite restart storms -- in the agent world, this translates to preventing "infinite replan loops that burn credits." The correct understanding of the "let it crash" philosophy: it's not about ignoring errors, but about extracting error handling from business logic so workers only write the happy path.

**Bulkhead**: Resource partitioning so that one compartment's failure doesn't drain the entire ship. Keep LLM call pools and tool execution pools separate. Cognizant's Maximal Agentic Decomposition breaks tasks down to "one agent, one decision," with each agent receiving only the minimum necessary context -- this is a bulkhead implemented in the context dimension, directly blocking context drift.

**Circuit breaker (three states: Closed -> Open -> Half-Open)**: When upstream model APIs fail, reject requests outright and degrade gracefully -- don't pile up failed requests that burn credits.

A cautionary example of incorrectly drawn isolation boundaries: LangGraph parallel branches A and B in the same superstep -- B succeeds, A hits a rate limit and throws an exception -> **the entire superstep rolls back, and B's success is also discarded**. The fix is to attach a `RetryPolicy` to each node that might experience transient failures -- corresponding to the distributed systems anti-pattern of "transaction boundaries too large causing innocent rollbacks."

## What You Can Copy Directly: Recovery Weapons

**Retry + exponential backoff + jitter**: Jitter prevents thundering herds. AWS benchmarks show decorrelated jitter delivers the best throughput under most load conditions.

**Saga / compensating transaction** (Garcia-Molina & Salem, 1987): Break long transactions into a sequence of local sub-transactions, each paired with a compensating action; on failure, compensate in reverse. LangGraph 1.2+'s `error_handler` compensation branches are a ready-made vehicle -- define compensating actions for steps with side effects (sending emails, writing to DBs).

**Checkpoint / event sourcing / durable execution**: Temporal packages all of these into a platform -- each important step is recorded as an append-only event log; after a crash, replay returns to the exact state; activities use idempotency tokens to achieve exactly-once side effects. Temporal has announced integrations with Google ADK and OpenAI Agents SDK -- durable execution is being positioned as the reliability foundation for agents. LangGraph's checkpointer (writing each superstep to PostgreSQL, using `thread_id` as the cursor) follows the same approach.

LangGraph's official five-category error routing is essentially a distributed fault-tolerance lookup table translated for LLMs:

| Error Type | Who Fixes It | Strategy | Distributed Equivalent |
|---|---|---|---|
| Transient (network, rate limit) | System | `RetryPolicy` | retry + backoff |
| LLM-recoverable (tool failure, parse error) | LLM itself | Store error in state, loop back so LLM sees it and retries | **No traditional equivalent -- LLM-specific** |
| User-fixable (missing info) | Human | `interrupt()` to pause, can resume days later | human-in-the-loop |
| Recoverable after retries | Developer | `error_handler` compensation branch | saga / compensation |
| Unexpected | Developer | bubble up | let-it-crash |

Two pitfalls when adapting these patterns: **LLM replay is non-deterministic** (the same input doesn't guarantee the same decision), so event sourcing must store "actual LLM responses" rather than just inputs; **tool calls must be idempotent**, otherwise crashing after "external write completed but before checkpoint" will duplicate side effects.

## What You Must Invent: Semantic-Layer Recovery

To address semantic errors that don't crash, the LLM world has developed recovery layers that have no traditional system equivalent -- **using agents to validate agents**:

- **Inspector / Challenger** (Huang et al., ICML 2025): Challenger lets each agent challenge others' outputs; Inspector is a separate review agent that audits and corrects messages -- **recovering up to 96.4% of faulty agent errors**. The key is not that the Inspector is smarter, but that it reviews from outside the primary agent's "error context."
- **Redundancy voting**: For critical steps, take n independent outputs and majority-vote. System error rate becomes **O(p^ceil(n/2))** -- errors decrease exponentially with redundancy, flipping "multiplicative decay" into "exponential convergence" (The Six Sigma Agent, arXiv:2601.22290). MAKER (arXiv:2511.09030) uses first-to-ahead-by-k voting plus **red-flagging** (discarding structurally anomalous outputs before re-sampling), completing **1,048,575 steps with zero errors** across 20 games of Tower of Hanoi -- the first system to break one million steps.
- **Watch out for correlated errors**: Multiple outputs from the same base model often err together (same-direction hallucination), which redundancy voting can't catch -- you need red-flagging, heterogeneous models, or an Inspector with external context.

Reality check: A controlled fault-injection study (arXiv:2606.01416) found that most first-generation frameworks (ChatDev, MetaGPT, AutoGen) respond to faults by **"stopping" rather than "recovering"** -- failure recovery (not failure detection) is the largest current gap.

## Putting It All Together

A practical prioritization for deployment: First, get the **topology** right (hierarchical, error-prone agents on leaf nodes, don't let the orchestrator become a single point of error propagation); then add **cheap traditional weapons** (per-node retry policy, circuit breaker, checkpoint, idempotent tools); finally, add **semantic-layer validation** for high-risk steps (Inspector or voting -- they burn tokens, so only use them where the cost of errors is high).

One-line takeaway: Traditional fault-tolerance solves "errors that crash" -- just copy those directly. The truly new problem in multi-agent systems is "errors that don't crash" -- and the answer isn't making a single agent smarter; it's having an eye in the architecture that stands outside the error context.

## References

- [Why Do Multi-Agent LLM Systems Fail? / MAST (arXiv:2503.13657)](https://arxiv.org/abs/2503.13657)
- [On the Resilience of LLM-Based Multi-Agent Collaboration with Faulty Agents (arXiv:2408.00989)](https://arxiv.org/abs/2408.00989)
- [From Spark to Fire: Error Cascades in LLM-Based Multi-Agent Collaboration (arXiv:2603.04474)](https://arxiv.org/abs/2603.04474)
- [The Six Sigma Agent (arXiv:2601.22290)](https://arxiv.org/abs/2601.22290)
- [MAKER: Solving a Million-Step LLM Task with Zero Errors (arXiv:2511.09030)](https://arxiv.org/abs/2511.09030)
- [Cognizant AI Lab -- MAKER](https://www.cognizant.com/us/en/ai-lab/blog/maker)
- [Self-Healing Agentic Orchestrators (arXiv:2606.01416)](https://arxiv.org/abs/2606.01416)
- [Garcia-Molina & Salem -- Sagas (1987)](https://dl.acm.org/doi/10.1145/38713.38742)
- [Erlang/OTP -- Supervision Principles](https://www.erlang.org/doc/system/sup_princ.html)
- [Azure Architecture Center -- Bulkhead pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/bulkhead)
- [AWS Builders' Library -- Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/)
- [Temporal -- Durable Execution](https://temporal.io/)
- [LangGraph -- Persistence Concepts](https://langchain-ai.github.io/langgraph/concepts/persistence/)
