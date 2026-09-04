---
title: "Looplane Subagent Scheduling and Parent-owned Transactions"
date: 2026-08-30
category: tech
type: deep-dive
tags: [looplane, coding-agent, subagents, scheduling, transactions]
lang: en
tldr: "Looplane normalizes each subagent dispatch into dependency waves of at most four nodes, runs read-only children concurrently in isolated workspaces, then makes the parent repeat hooks, approval, and transaction execution for any modification."
description: "Trace Looplane's subagent dependency graph, wave concurrency, isolated child workspaces, bounded handoffs, and the authority boundary of parent-owned transactions."
series:
  name: "Looplane Architecture Notes"
  order: 16
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-looplane-subagent-scheduling)

The [previous article](/posts/tech/2026-08-30-looplane-skills-hooks-plugins-en) separated three kinds of repository-local extension authority. When a task has independent investigation tracks, [Looplane](https://github.com/vincentxuu/looplane) can also dispatch subagents. The central question is not how many agents run, but who owns the workspace and modification authority.

## Dependencies become execution waves

One `dispatch_subagents` call accepts one to four children. Each has a unique ID, a `scout`, `analyst`, or `reviewer` role, an instruction, at most six steps, and optional `depends_on` edges. Unknown dependencies, duplicate IDs, and cycles fail before launch.

The scheduler then constructs topological waves. Ready children within one wave run concurrently through `asyncio.gather`. The next wave waits and receives bounded handoffs from completed dependencies. This is a small dependency scheduler, not a persistent worker pool, priority system, work-stealing engine, or dynamic dispatcher.

```text
wave 1: scout A ─┐
                  ├─ bounded handoff -> wave 2: reviewer C
wave 1: analyst B┘
                                      -> parent transaction
```

## A child gets a separate run and narrower authority

A child preserves the parent's repository, base SHA, allowed paths, and verification constraints, but receives a distinct run root under `<parent run>/subagents/<id>` and a disposable workspace. Child runners disable further subagent dispatch, preventing recursive expansion.

The current headless child policy denies modification and execution. Children read, search, analyze, and report. A later wave receives bounded summaries, status, and a changed-files field rather than a shared mutable workspace. Although the report schema can describe changed files, the current policy should not be read as a child-edit handoff.

## The parent owns the modifying transaction

The parent model may include a proposed transaction in its `dispatch_subagents` call. A child can review that proposal through its instruction, but the transaction is not tool authority smuggled back from the child. Only after successful child completion does the parent runner construct `tool_transaction`, repeat action guards and pre-tool hooks, request permission approval, and execute sequentially in the parent workspace.

`dispatch_subagents` is therefore classified as read. Modification and execution appear only at the parent transaction stage, where the [order 11 transaction contract](/posts/tech/2026-08-30-looplane-tool-program-transactions-en) still applies. Reviewer acceptance cannot replace operator approval, and a child workspace is not merged directly into the parent.

## Limits are per dispatch, not a global worker quota

Four children, six steps per child, and at most eight proposed transaction steps bound one call. The parent loop and repeated-action guards still apply, but the reviewed code has no separate global dispatch-count quota. A trace analyzer can aggregate recorded roles, waves, and transactions or warn about the absence of a reviewer; it does not reschedule future work.

This design fits tasks with explicit dependencies and evidence that can be gathered in parallel. For a single lookup or direct edit, the extra dispatch only adds turn cost. Used selectively, children expand analysis bandwidth while the parent remains the sole owner that converts advice into workspace side effects.

The [next article](/posts/tech/2026-08-30-looplane-sdk-conversation-websocket-en) enters the embedding boundary, followed by the IDE bridge and the order 19 Cloudflare capstone.

---

## References

- [Subagent schedule normalization and child runs](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/subagents.py)
- [Dispatch and parent transaction flow](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/loop.py)
- [Subagent unit tests](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_subagents.py)
- [Subagent end-to-end tests](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/tests/test_loop_e2e.py)
