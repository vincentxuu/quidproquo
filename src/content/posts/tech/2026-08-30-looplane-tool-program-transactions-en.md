---
title: "Looplane tool programs, transactions, and safe concurrency"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, tool-use, transactions, concurrency]
lang: en
tldr: "Looplane parallelizes calls only when they are read-only, concurrency-safe, and classified as READ. Tool programs provide bounded read-only repeat and branching, while transactions snapshot and restore possible workspace-file changes; external side effects are not rolled back."
description: "Explain Looplane read-only batching, bounded tool programs, file-backed transactions, and the limits of rollback."
series:
  name: "Looplane Architecture Notes"
  order: 11
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-looplane-tool-program-transactions)

A tool call passing path, permission, and [OS sandbox checks](/posts/tech/2026-08-30-looplane-local-os-sandbox-en) does not imply that multiple calls can run concurrently. Looplane separates eligible read batching, bounded read-only programs, and file-backed transactions.

## Concurrency requires three matching signals

`AgentRunner._can_execute_concurrently()` requires a definition marked both read-only and concurrency-safe, plus a runtime effect classified as `READ`. Only then does a batch use `asyncio.gather`. Batch lifecycle events are recorded, while observations retain request order. Modify, execute, and transaction calls remain sequential, and repeated-action guards still count batched calls.

## Programs are bounded read-only control flow

`tool_program` permits list, read, search, and git diff operations. It supports positive bounded repeats and `if_contains` branches, with a maximum nesting depth of three and a cap on expanded steps. The harness owns the timeout.

The program is read-only but the composite tool itself is intentionally not concurrency-safe: later steps and branches depend on earlier observations.

## Transactions compensate workspace-file changes

`tool_transaction` sequences read, replace, patch, check, and diff steps. Before execution, it conservatively unions paths that either branch could touch and snapshots bytes, mode, and prior existence. On failure it restores existing files and removes files created by the transaction. A rollback failure is reported separately rather than hidden.

This is atomic-ish only for the tracked workspace files. Looplane cannot undo processes, database writes, network requests, emails, remote APIs, or other command side effects. Checks should therefore remain checks rather than hidden deployment steps. The [next article](/posts/tech/2026-08-23-looplane-state-first-event-journaling-en) shows how these operations are recorded for replay and review.

---

## References

- [ToolExecutor source](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/tools.py)
- [Native-loop concurrency source](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/loop.py)
- [Tool program and transaction tests](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_tools.py)
- [Read-only batch loop tests](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_loop_e2e.py)
