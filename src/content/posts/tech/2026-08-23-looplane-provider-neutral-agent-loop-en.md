---
title: "Looplane's provider-neutral native loop: from one model turn to a verified terminal state"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, ai-agent, python, llm]
lang: en
tldr: "Looplane's native lane is controlled by AgentRunner: prepare a workspace, request a model turn, execute tool calls, append observations, and enter verification only when the model stops calling tools. Step, wall-time, repetition, token, and cancellation guards can terminate the run independently of the model. Protocol translation belongs to the next article."
description: "Follow AgentRunner.run through one Looplane native turn, tool observations, the verification gate, and deterministic terminal reasons."
series:
  name: "Looplane Architecture Notes"
  order: 4
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-23-looplane-provider-neutral-agent-loop)

Orders 1–3 establish the interface, disposable workspace, and [prompt, instruction, and explicit-memory pipeline](/posts/tech/2026-08-30-looplane-prompt-instructions-memory-en). This article enters the native lane: how Looplane's own `AgentRunner` turns one model request into tool execution and reaches either verified success or an explicit failure.

“Provider-neutral” has one narrow meaning here. The loop depends on canonical `ModelProvider.complete()` and `ModelTurn` values instead of embedding one vendor's wire format in the state machine. Translation for OpenAI, Anthropic, Gemini, or Workers AI belongs to order 5.

## Data flow through a native turn

```text
TaskContract + restored/new session state
                │
                ▼
       AgentRunner.run()
                │
        model.requested
                │
                ▼
     ModelProvider.complete(messages, tools)
                │
                ▼
          canonical ModelTurn
          ├─ tool_calls ─► approve ─► execute ─► observations ─┐
          │                                                    │
          └─ no calls ─► verification ─► pass / repair / fail ◄┘
```

A new run pins the base SHA, writes request and session state, prepares the disposable workspace, and initializes messages. Resume restores step, usage, messages, and active wall time from the manifest. Once those paths converge, each iteration performs instruction or context reload and required reinjection, increments the step, emits `model.requested`, and receives a canonical `ModelTurn`.

When the turn contains tool calls, the runner records fingerprints, requests approval, sends each call to `ToolExecutor`, appends observations to messages, and enters another iteration. When no tool call exists, the runner does not trust the prose answer as completion; it enters `_verify_all()`.

## Verification is the completion boundary

The model saying “done” means only that it stopped requesting tools. `_verify_all()` reruns the commands in `TaskContract.verification`. Only an all-pass result produces `RunStatus.COMPLETED` with `terminal_reason="verified"`. On failure, bounded output returns to the conversation as untrusted test output, giving the model another repair turn.

The native loop's success boundary is therefore neither a provider finish reason nor the assistant's final sentence. It is the point after the runner obtains fresh verification outcomes. Focused cases in `tests/test_loop_e2e.py` exercise this path with fixture models: emit tools, execute them, feed back failed checks, and only then complete or stop with an explicit terminal reason.

## Deterministic guards may terminate first

`AgentRunner` does more than wait for the model to stop. It owns code-enforced guards:

- `max_steps` bounds the outer loop.
- A wall-time budget covers workspace preparation, provider calls, tools, and verification.
- Repetition fingerprints count normalized tool names and arguments, producing `repeated_action` on repeated calls.
- Token budgets stop execution when recorded usage exceeds the contract.
- Cancellation while waiting for a model or during execution produces `user_cancelled`.

These limits are runner state, not suggestions in a system prompt. A representative fail-closed case is a model repeatedly issuing the same modification. The third occurrence is not another side effect; the run stops with the repetition terminal reason. `_record_fingerprint()` hashes normalized JSON, so changing argument-key order does not evade the guard.

## Contracts make state persistable and inspectable

`TaskContract`, `ModelTurn`, `ToolObservation`, and `VerificationOutcome` are explicit data structures. `ContractModel` uses `extra="forbid"` and frozen models, preventing unknown fields from disappearing silently and preventing another component from mutating values already committed to session state.

That contract boundary lets the journal, resume path, and TUI consume the same state. It also limits the claim: provider-neutral does not mean providers behave identically. It means each adapter must normalize a response before the loop can consume it. The next article covers protocol translation and the gateway; retry, fallback, cache hints, and estimated cost are covered in [order 6](/posts/tech/2026-08-30-looplane-model-routing-fallback-cost-en).

## What this loop does not provide

Deterministic guards do not make the loop an OS sandbox. Path and argv enforcement, permission decisions, and kernel containment belong to orders 8–10. Subagent transactions, MCP authorization, and external-CLI handoff have different owners as well. The loop cannot guarantee that a model solves a task; it guarantees an inspectable terminal reason and requires verification before success.

For broader comparisons of where other coding agents place loops, tools, and verification, see [Pi's minimal terminal harness](/posts/tech/2026-03-31-pi-coding-agent-minimal-terminal-harness-en) and the [Codex CLI overview](/posts/tech/2026-03-31-codex-cli-openai-coding-agent-en). The next Looplane article remains on Looplane's code path and focuses on the canonical `ModelProvider` contract and protocol translation.

---

## References

- [Looplane official repository](https://github.com/vincentxuu/looplane) — ground truth for `AgentRunner.run()`, contracts, and loop tests
- [Looplane M1 local harness document](https://github.com/vincentxuu/looplane/blob/main/docs/stages/m1-local-harness.md) — design background for the native harness
- [Pydantic model configuration](https://docs.pydantic.dev/latest/api/config/) — semantics of frozen models and extra-field validation
