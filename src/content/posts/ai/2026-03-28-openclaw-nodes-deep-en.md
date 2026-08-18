---
title: "OpenClaw Nodes in Depth: Approval Binds the Plan, Not the Command You Edited Afterward"
date: 2026-03-28
type: deep-dive
category: ai
tags: [openclaw, nodes, system-run, exec, approvals, remote-execution]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 29
tldr: "The best part of remote node execution is how approval binds: exec prepares a canonical systemRunPlan before approval, and once granted the gateway forwards that stored plan — not any later caller-edited command, cwd, or session fields — and re-validates the working directory before running."
description: "OpenClaw's remote node host execution model: how gateway and node divide responsibility, approval bound to a canonical plan and a concrete file operand, the refusal strategy when no single file can be identified, and active computer presence."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-nodes-deep)

The previous article covered mobile devices as nodes. This one covers **sending commands to another machine to run** — and why its approval model looks the way it does.

## Dividing responsibility

You use a node host when **the Gateway runs on one machine and you want commands to execute on another.** The model still talks only to the gateway, which forwards `exec` calls to the node host when `host=node` is selected.

| Role | Responsibility |
|---|---|
| Gateway host | Receives messages, runs the model, routes tool calls |
| Node host | Executes `system.run` / `system.which` on the node machine |
| Approvals | **Enforced on the node host** (in `~/.openclaw/state/openclaw.sqlite#exec_approvals_config`) |

That third row deserves a pause: **approvals are enforced on the machine that runs the command**, not on the Gateway. The right direction — the machine bearing the consequences holds the veto.

## Approval binding: the heart of it

Remote execution approval has an easily-missed attack surface: **there is a gap between the moment you approve a command and the moment it runs.** OpenClaw handles that gap in three layers.

### 1. Bound to a canonical plan

> Approval-backed node runs **bind exact request context**. The exec path prepares a canonical **`systemRunPlan`** before approval; once granted, **the gateway forwards that stored plan, not any later caller-edited command/cwd/session fields**, and **re-validates the working directory before running.**

Solid design. It defeats the pattern of "submit something harmless for approval, then swap the parameters afterward" — **what gets approved is the plan itself, not a request object that remains editable.**

Re-validating the working directory adds another layer: **even when the plan is untouched, the environment can change between approval and execution.**

### 2. Bound to a concrete file operand

> For direct shell/runtime file executions, OpenClaw also **best-effort binds one concrete local file operand** and **denies the run if that file changes before execution.**

So after you approve "run this script," swapping out the script file blocks the run. This is the post-approval TOCTOU problem.

### 3. Refuse rather than pretend

The line most worth stealing:

> If OpenClaw **cannot identify exactly one concrete local file** for an interpreter/runtime command, **approval-backed execution is denied instead of pretending full runtime coverage.** Use sandboxing, separate hosts, or an explicit trusted allowlist/full workflow for broader interpreter semantics.

**"Deny rather than pretend to cover"** — a security mechanism that acknowledges its own boundary and fails outside it beats one that claims total coverage while quietly having holes.

## Two pairing stores (recap and detail)

Covered in the previous article; here are the complete rules:

- **Device pairing** governs transport authentication. **The device pairing record is the durable approved-role contract; token rotation stays inside it and cannot upgrade a node into a role pairing never granted.**
- **`node.pair.*` / `openclaw nodes pending|approve|reject|remove|rename`** is **a separate gateway-owned store** tracking the node's approved command and capability surface across reconnects, and **does not gate transport authentication.**

`nodes status` marks a node **paired** only when its device pairing role includes `node`.

Removal permissions are tiered too: `operator.pairing` may remove non-operator node rows on other devices, while **a device-token caller revoking its own node role on a mixed-role device additionally needs `operator.admin`.**

## Active computer presence

A feature added after March with a very concrete purpose: a connected native Mac can opt in to **coalesced physical-input activity** under **Settings → Permissions → Active computer detection** (**Accessibility is also required**).

The Gateway marks **the freshest eligible Mac as `active`**, gives the agent a stable node-id hint, and **routes node connection alerts there before a delayed fallback.**

The everyday problem it solves: **you have three Macs connected — which one should the agent notify?** The answer is "the one you're actually using," decided by physical input activity, which is far more practical than guessing or manual selection.

## macOS node mode: don't run two

Mentioned in the desktop article, flagged again because it is easy to trip on: **the macOS menu bar app connects to the Gateway as one node**, adding native Canvas, camera, screen, notification, and computer-control commands to the node-host surface.

**Do not start a second CLI node on that Mac** — the app already runs the matching CLI node-host runtime as an internal worker and **is the sole Gateway connection and node identity.**

## Transport today

Most nodes use the **Gateway WebSocket on the operator port**. The old **Bridge protocol (TCP JSONL) is now historical only** for current nodes.

The lone exception is the direct Apple Watch node with its signed HTTPS polling on the same port (reason in the previous article).

## The big picture

What has real engineering substance in the nodes layer is not "a phone can be a peripheral" but **how remote execution approval is made trustworthy.**

Three rules to take away, and they hold in any system where a human approves and a machine executes: **approval should bind an unmodifiable plan**, **the environment should be re-validated before execution**, and **when the boundary cannot be identified, refuse rather than downgrade coverage.**

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **the remote node host responsibility split** and approvals being enforced on the node host, **the three layers of approval binding** (a canonical `systemRunPlan` rather than later-editable fields, working-directory re-validation, best-effort binding of one concrete file operand with denial on change, and refusal rather than pretended coverage when no single file resolves), **the two pairing stores** and the token-rotation guarantee, the `paired` determination in `nodes status`, tiered removal permissions, **active computer presence** (physical input activity electing the `active` Mac, requiring Accessibility), the macOS single-node rule, and the Bridge protocol's move to historical status.

## References

This article draws on the following official OpenClaw documentation:

- [Nodes](https://docs.openclaw.ai/nodes/) — pairing, remote node host, approval binding
- [Active computer presence](https://docs.openclaw.ai/nodes/presence) — setup and privacy
- [Node pairing](https://docs.openclaw.ai/gateway/pairing) — the request/approve lifecycle
- [Exec tool](https://docs.openclaw.ai/tools/exec) — the `host=node` execution path
- [Nodes troubleshooting](https://docs.openclaw.ai/nodes/troubleshooting) — the runbook
