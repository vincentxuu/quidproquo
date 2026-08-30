---
title: "Building a Taiwan Stock Research Agent (Part 8): The Boundary Between Research and Paper Orders—Content-Addressed Execution Contracts"
date: 2026-08-23
category: tech
type: deep-dive
tags: [stock-research-agent, ai-agent, pydantic, content-addressing, audit]
lang: en
tldr: "Three frozen Pydantic contracts weld the boundary between a research artifact and order-placement authority shut: content addressing, eight hard gates, and paper-only execution, while the agent never touches credentials."
description: "The stock-research-agent M7 execution boundary: a content-addressed StrategyArtifact, fail-closed evaluation with eight hard gates, an ApprovalDecision that structurally forbids live trading, and a capability matrix that keeps credentials out of agent context."
draft: false
glossary:
  - term: "content-addressing"
    definition: "Using a hash of the content (SHA-256) as an object's ID. Any content change produces a different ID, making tampering evident."
  - term: "fail-closed"
    definition: "Denying access by default when an error occurs or evidence is insufficient."
  - term: "frozen"
    definition: "Pydantic's immutable model setting; fields cannot be changed after an instance is created."
  - term: "hard gate"
    definition: "A mandatory check that blocks progress when it fails, with no human override."
  - term: "capability"
    definition: "An explicit list of the operations a role is authorized to perform."
---

> 🌏 [中文版](/posts/tech/2026-08-23-stock-agent-8-execution-contracts)

> **Building a Taiwan Stock Research Agent (Part 8 of 9)**: [Previous: The Copilot Loop—Plan Contracts, Verifiable Sources, and Human Review](/posts/tech/2026-08-23-stock-agent-7-research-plan-review-loop-en) ｜ [Next: The Deployment Boundary—A Public API from Docker to Cloudflare Containers](/posts/tech/2026-08-23-stock-agent-9-cloudflare-deployment-en) ｜ [Full table of contents in Part 1](/posts/tech/2026-08-23-stock-agent-1-why-taiwan-en)

A research agent can write a strategy, run a backtest, and produce a report without much danger—until real money enters the picture. This article explains the line I drew inside stock-research-agent. Between a "research artifact" and "placing a paper order," three immutable Pydantic contracts form a chain that ensures the LLM can never touch credentials, alter evaluation results, or obtain live-trading authority. It is the least compromising code in the project, and I want to make clear why.

## Three contracts form one chain

The heart of the design lives in `src/stock_agent/execution/contracts.py`: three frozen Pydantic v2 models.

```text
StrategyArtifact ──(artifact_id)──▶ ApprovalDecision ──(environment)──▶ ExecutionGateway
       \                                /
        \──── (EvaluationReport.evaluation_id) ────/
```

StrategyArtifact is an executable strategy package: code, parameters, universe, data snapshot ID, and dependency versions. EvaluationReport contains the results from the deterministic evaluator's eight hard gates for that artifact. ApprovalDecision is a time-limited authorization created after a human reviewer signs off, and it is the only authorization the ExecutionGateway accepts.

All three models share these invariants:

- `frozen=True` + `extra="forbid"`: once created, the object cannot change, and construction fails if it contains even one extra field.
- `artifact_id` and `evaluation_id` are SHA-256 hashes of canonical JSON: sorted keys, no whitespace, UTF-8, and no NaN/Inf. The system calculates each ID; if the caller supplies a different one, validation fails.
- The entire module performs zero I/O: it does not read environment variables or access the network, and tests can mock `_now_utc()`. It is a dependency-free leaf node that the Gateway can import directly.

## The power of content addressing

Why use content addressing? Because it makes changes impossible to hide.

The StrategyArtifact hash covers six fields: code, language, parameters, universe, data_snapshot_id, and dependencies. Change one parameter, modify one symbol in the universe, or switch the data snapshot, and the hash changes. The old ApprovalDecision still points to the old hash and immediately becomes invalid. The Gateway also recomputes both hashes—artifact and evaluation—**before every dispatch**, then checks `decision.artifact_id == report.artifact_id`. An evaluation for one artifact can therefore never be smuggled in for another.

One detail I insisted on is that the `metadata` field is deliberately **excluded from the hash**. Metadata is an informational annotation; changing an annotation should not change what you approved. By contrast, the only valid way to change a hashed field is `with_field_replaced(**patch)`, which returns a new object with a new ID. The old object remains untouched, and its old approval dies with it. A similar strategy is not the current strategy. That is the guarantee content addressing provides.

There is another safeguard: an empty symbol in the universe or duplicate dependency versions cause construction to raise immediately instead of being quietly discarded after logging. A before-validator first normalizes the universe and dependencies into canonical form, so two logically equivalent callers receive exactly the same hash.

## Eight gates, fail-closed, beyond the LLM's reach

EvaluationReport has eight hard gates: citation valid, point-in-time, out-of-sample, cost realistic, sample size adequate, drawdown within limits, reproducible, and code policy ok. Each gate is a boolean plus a reason string produced by a deterministic evaluator—**not by an LLM**.

The harshest design choice is that `passed` is always the AND of all eight gates, calculated by the validator itself. If anyone—an LLM critic, a reviewer UI, or a careless engineer—constructs the object with `passed=True` while any gate is False, construction immediately raises a ValueError. No failure has an override path. The only valid recovery is to change the artifact and rerun the evaluation. `metrics` and `warnings` are soft, informational fields and never affect `passed`. `hard_failures()` returns failed gate names in a fixed order, keeping logs deterministic.

This echoes the principle from earlier articles in the series: insufficient evidence means failure; only a pass requires evidence. Cold truth: LLMs are excellent at writing evaluations that "look reasonable," so I do not let one write this evaluation.

## Paper-only is a structural guarantee, not a setting

At the M7.1 stage, `ApprovalDecision.environment` accepts only `"paper"`. Any attempt to construct a `"live"` decision—including an attempt to smuggle a promotion through a parent chain—immediately raises `PromotionForbiddenError`. In this version, a live authorization is therefore an object that is **structurally impossible to create**, not a switch that happens to be off by default. A future live rollout (M7.4) will require an entirely new dual-review process and a fresh decision, not an upgrade of an old one.

Paper authorization has boundaries too: a lifetime of at most 24 hours, capability scope, and binding to the evaluation and approval hashes. Expiration raises `ExpiredApprovalError`. The remedy is a new review, not a retry.

The capability matrix divides authority among three roles. The Research Agent holds only `compile`, `backtest`, and `read`; it never receives `deploy_paper` or any capability that mutates live state. Operations such as `stop`, `cancel_orders`, and `liquidate` are Gateway-only. Credentials live exclusively inside the Execution Gateway and never enter agent context, prompts, or traces. The agent can **request** an operation, but the capability check happens inside the Gateway. Rejection raises `InsufficientCapabilityError`. A timeout always enters a reconciliation flow that checks the actual state instead of retrying blindly—because in an order system, a blind retry is another name for a duplicate order.

## Two adapters and their honest limitations

The first adapter is `QuantConnectAdapter`, which supports only compile and backtest. Neither operation requires credentials to enter the agent, and backtest records are stored locally under `runs/qc/`. A separate PaperMonitor compares paper-trading results against the backtest envelope. I state the limitations of QC paper trading plainly in `docs/quantconnect-api-notes.md`: DefaultBrokerageModel applies **no slippage** by default, market orders fill immediately and completely, and QC's list of cloud brokerages does not include any Taiwan broker. These are not fine print. They are prerequisites for deciding whether those results can represent live trading in Taiwan stocks.

The second adapter is `ShioajiSimulationAdapter`. It uses an SDK seam—Shioaji itself is not a project dependency—receives market data and fills only through callbacks, and uses a separate ledger for reconciliation. Credentials and error messages are both redacted.

M7.2's `approval_gate` is already wired into the graph as well. It is a sanitized interrupt: the payload contains only IDs and metrics, not code or the full report. The resume value must be a paper-only ApprovalDecision bound to the current run's `artifact_id` + `evaluation_id`; anything else fails closed. Without an injected dispatcher, the whole graph remains in research-only mode (`evaluation_gate → END`). Gateway dispatch is always a separate backend seam.

## Overall

The lesson from this contract layer is that when an agent touches money, do not trust a prompt, a dotted line in a flowchart, or a promise that "we will add a check later." Make violations **explode at construction time**. Content addressing exposes tampering. Frozen + forbid makes mutation impossible. Having the validator calculate the gates' AND keeps the result beyond the LLM's reach. `PromotionForbiddenError` makes live trading nonexistent. These safeguards take only a few dozen lines of code, but they make every hash in the audit trail trustworthy. Open questions remain: which layer should normalize universe tickers (`2330.TW` vs `2330` currently produce different hashes), and when should `limits` formally become a model? Those decisions can wait until the first adapter is genuinely operational.

---

## References

- [stock-research-agent: M7.1 Execution Contracts](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/m7.1-contracts.md)
- [stock-research-agent README: Research-to-Paper execution boundary (M7)](https://github.com/vincentxuu/stock-research-agent#research-to-paper-execution-boundary-m7)
- [QuantConnect API notes (paper limitations and endpoint semantics)](https://github.com/vincentxuu/stock-research-agent/blob/main/docs/quantconnect-api-notes.md)
- [QuantConnect Cloud Platform API Reference](https://www.quantconnect.com/docs/v2/cloud-platform/api-reference)
