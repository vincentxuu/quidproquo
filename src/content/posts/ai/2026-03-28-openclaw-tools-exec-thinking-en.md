---
title: "OpenClaw Tools, Part 3: Turning Off the File Tools Does Not Make exec Read-Only"
date: 2026-03-28
type: guide
category: ai
tags: [openclaw, exec, shell, security, thinking, slash-commands]
lang: en
series:
  name: "Reading the OpenClaw Docs"
  order: 22
tldr: "exec is a mutating shell surface: disabling write, edit, and apply_patch does nothing to make it read-only. And since sandboxing is off by default, host=auto actually resolves to the gateway — if you really want the sandbox, say so explicitly and it will at least fail closed."
description: "The OpenClaw exec tool: how execution host resolves, the unit traps, and the security design — the four host values, timeoutSeconds versus yieldMs, rejected PATH and loader overrides, the shell snapshot, and the line between background execution and scheduling."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-28-openclaw-tools-exec-thinking)

`exec` has the largest blast radius of any tool here, so this article covers it and the controls around it.

## The first sentence is the point

> `exec` is a **mutating shell surface**: commands can create, edit, or delete files wherever the selected host or sandbox filesystem permits. **Disabling OpenClaw filesystem tools such as `write`, `edit`, or `apply_patch` does not make `exec` read-only.**

Worth memorizing, because it defeats a very natural assumption: **"I turned off the write tools, so the agent can't touch my files" — false.** As long as `exec` exists, the shell exists.

## Where it runs: the four `host` values

`host` accepts only `auto`, `sandbox`, `gateway`, or `node` — **it is not a hostname selector**, and hostname-like values are rejected before the command runs.

Resolution:

- **`auto`** resolves to `sandbox` when a sandbox runtime is active, and `gateway` otherwise
- **Sandboxing is off by default**, so with no extra config `host=auto` actually runs **on the gateway host**
- **An explicit `host=sandbox` fails closed** when no sandbox is active, rather than quietly running on the gateway

That last rule is good design: **implicit defaults may be permissive, but an explicit request must be honored or refused.** If a command must run in the sandbox, say so.

Other rules: per-call `host=node` is allowed from `auto`; **per-call `host=gateway` is only allowed when no sandbox runtime is active**; `host=node` requires a paired node (select one with `exec.node` or `tools.exec.node` when several exist).

Also: **`exec host=node` is the only shell-execution path for nodes** — the legacy `nodes.run` wrapper has been removed.

## The unit trap

Concrete enough that the docs flag it themselves:

| Parameter | Unit |
|---|---|
| `timeoutSeconds` (exec) | **seconds** |
| `yieldMs` (sibling on exec) | **milliseconds** |
| `timeout` (the identically named `process` parameter) | **milliseconds** |

Which is why exec's timeout is called `timeoutSeconds` — **to put the unit at the call site**. The default `tools.exec.timeoutSeconds` is 1800 (30 minutes); a per-call `0` disables the exec process timeout for that call.

## Security choices worth learning from

**PATH and loader overrides are rejected.** Host execution (`gateway`/`node`) rejects `env.PATH` and `LD_*`/`DYLD_*` overrides **to prevent binary hijacking or injected code**. A classic attack surface, blocked at the parameter layer rather than detected after the fact.

**The shell snapshot.** On non-Windows gateway hosts, bash and zsh exec commands use a startup snapshot: OpenClaw captures sourceable aliases and functions plus a small safe environment set from your shell startup files into `$OPENCLAW_STATE_DIR/cache/shell-snapshots/`, then sources it before each command. **Secret-looking variables are excluded**, and sandbox and node exec do not use the snapshot. Disable with `OPENCLAW_EXEC_SHELL_SNAPSHOT=0`.

This solves "the agent's commands can't find my usual aliases" while avoiding "drag the entire environment, secrets included, into the run."

**Shell selection has fallback logic.** On non-Windows it uses `SHELL`, but **if `SHELL` is fish it prefers `bash` (or `sh`)** to avoid fish-incompatible bashisms, falling back to `SHELL` only if neither exists. On Windows it prefers PowerShell 7 (`pwsh`), then Windows PowerShell 5.1.

**Some commands cannot run through exec.** `openclaw channels login` is an interactive channel-auth flow and `/approve` must go through the approval command handler rather than a shell — both are blocked. Run channel login in a terminal on the gateway host, or use a channel-specific login tool such as `whatsapp_login`.

**Environment markers.** OpenClaw sets `OPENCLAW_SHELL=exec` in the spawned environment (including PTY and sandbox execution) so shell and profile rules can detect exec-tool context. Channel-origin runs also expose a narrow sender/chat identity JSON payload in `OPENCLAW_CHANNEL_CONTEXT`.

## Approvals and elevated mode

The per-call `security` parameter is **ignored for normal tool calls** — `gateway`/`node` security derives from `tools.exec.mode` and the host approvals file, and elevated mode can force full access only when the operator explicitly grants it.

`ask` behaves similarly: the baseline derives from `tools.exec.mode` and host approvals. **For channel-origin model calls, per-call `ask` is ignored when the effective host ask is `off`; otherwise it can only harden to a stricter mode.**

The direction is unambiguous: **per-call parameters can tighten, never loosen.**

`elevated` explicitly requests escaping the sandbox onto the configured host path (`gateway` by default, or `node` when `tools.exec.host=node`), and **is only available when elevated access is enabled for the current session or provider.**

## Do not fake scheduling with sleep loops

This guidance also appears in the system prompt; here is the tool-level version:

- Use `exec` / `process` for commands that **start now and continue in the background**
- With automatic completion wake enabled, **start the command once** and rely on the push path
- Use `process` for logs, status, input, or intervention
- **Do not emulate scheduling with sleep loops, timeout loops, or repeated polling**
- **For work that should happen later or on a schedule, use cron**

Agent-started background commands appear in the Web, iOS, and Android background-task views until they finish, and **the task ledger is finalized before the completion heartbeat wakes the agent again** — bookkeeping first, then the wake.

## The preflight boundary

A detail worth knowing: script preflight checks (for common Python and Node shell-syntax mistakes) **only inspect files inside the effective `workdir` boundary.** A script path resolving outside `workdir` skips preflight.

And **preflight skips entirely when `host=gateway` with an effective policy of `security=full` and `ask=off`** — so setting security to its most permissive also costs you this convenience check.

## The big picture

The right mental model: **`exec` is a shell, and a shell's capability boundary is set by the host and the sandbox — not by which other OpenClaw tools you have switched off.**

The levers that actually constrain it are: sandboxing (change where it runs), `tools.exec.mode` plus host approvals (change what it may do), and OS-user isolation (change who it runs as). **Turning off `write` is not on that list.**

## Changelog

- 2026-08-18: Substantially revised against the current official docs. Added: **the explicit statement that disabling file tools does not make `exec` read-only**, `host` accepting only four values and not being a hostname selector, **sandboxing being off by default so `host=auto` resolves to gateway while an explicit `host=sandbox` fails closed**, `exec host=node` as the only node shell path (with `nodes.run` removed), **the unit differences between `timeoutSeconds`, `yieldMs`, and `process`'s `timeout`**, rejected `env.PATH` and `LD_*`/`DYLD_*` overrides, **the shell startup snapshot** (secrets excluded, unused by sandbox and node, disableable), fish and PowerShell selection logic, the commands exec cannot run, the `OPENCLAW_SHELL` and `OPENCLAW_CHANNEL_CONTEXT` markers, **per-call `security`/`ask` only tightening**, the background-versus-cron boundary, and the preflight `workdir` boundary and its skip under the most permissive policy.

## References

This article draws on the following official OpenClaw documentation:

- [Exec tool](https://docs.openclaw.ai/tools/exec) — parameters, host resolution, security design, config
- [Elevated mode](https://docs.openclaw.ai/tools/elevated) — the host escape path
- [Sandboxing](https://docs.openclaw.ai/gateway/sandboxing) — how sandbox mode interacts with `tools.exec.host`
- [Tools and custom providers](https://docs.openclaw.ai/gateway/config-tools) — tool policy and group semantics
- [Automation](https://docs.openclaw.ai/automation) — cron and background tasks
