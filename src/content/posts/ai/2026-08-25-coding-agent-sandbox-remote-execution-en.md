---
title: "Learning from Mature Coding Agents (11): Sandboxes and Remote Execution — Deploying on Cloudflare Sandbox"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 11
tags: [coding-agent, harness-engineering, sandbox, cloudflare-workers, durable-objects, sse]
lang: en
description: "How Codex, Claude Code, OpenCode, Pi, and OMP handle sandboxing—and why local OS sandboxes and cloud sandboxes are two different problems. Compared against looplane's real deployment on Cloudflare Workers with a control plane, Durable Objects, and a Sandbox binding, including SSE file stream decoding and stale wheel pitfalls."
tldr: "A local sandbox limits the blast radius of an agent on your machine; a cloud sandbox is about moving code safely onto someone else's machine. All five mature projects solve the first problem; only looplane actually deployed the second. Lessons from production: mocks can't catch SSE framing, green CI can't catch a stale wheel, and cleanup paths deserve timeouts just as much as success paths."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-sandbox-remote-execution)

## The Design Problem

When an agent needs to execute model-generated code, the instinctive answer is "add a sandbox." But sandboxing is really two different problems:

**Local sandboxing** asks: when the agent runs commands on the user's machine, how do we limit the blast radius? The defense line is the operating system—Seatbelt, Landlock, restricted tokens. **Remote sandboxing** asks something entirely different: when we move code onto a disposable machine, how do credentials stay off it? Who owns the run lifecycle? How do results come back safely?

The five reference projects almost exclusively answer the first question. You only learn how deep the second one goes after deploying it yourself—this post is looplane's record from having jumped in.

## What the Five Projects Do

### Codex: OS-level sandboxes, split by platform

Codex's sandboxing is entirely local. `codex/codex-rs/sandboxing/src/manager.rs#get_platform_sandbox` picks a backend by compile target: Seatbelt on macOS, seccomp (with Landlock) on Linux, restricted token on Windows. On the Linux side, `codex/codex-rs/linux-sandbox/src/landlock.rs#set_no_new_privs` sets `no_new_privs` before applying filesystem rules; Windows gets its own crate in `windows-sandbox-rs/src/lib.rs#run_windows_sandbox_capture`. Three platforms, three implementations—none of which involve shipping code to the cloud.

### Claude Code: sandboxing as a per-command decision

Claude Code also takes the local route: `claude-code-source/src/tools/BashTool/shouldUseSandbox.ts` decides before every bash call whether that command should run inside the sandbox, backed by the SandboxManager in `claude-code-source/src/utils/sandbox/sandbox-adapter.ts`, which bridges macOS `sandbox-exec` and Linux bubblewrap. Notably honest comment in the source: the exclusion list (`excludedCommands`) is explicitly documented as not a security boundary—the actual control is the permission prompt.

### Pi: no built-in sandbox, delegated to extensions

Pi's core does zero isolation itself; the official example `pi-mono/packages/coding-agent/examples/extensions/sandbox/index.ts` shows how to wrap bash with `@anthropic-ai/sandbox-runtime` (sandbox-exec/bubblewrap). One detail worth studying: `pi-mono/packages/coding-agent/src/bun/restore-sandbox-env.ts#restoreSandboxEnv` works around a real bug—Bun-compiled binaries see an empty `process.env` inside sandboxes and must recover it from `/proc/self/environ`. Making your code *survive being sandboxed* is an engineering problem of its own.

### OMP: snapshot isolation, not a security boundary

OMP (a Pi fork) ships `oh-my-pi/crates/pi-iso/src/apfs.rs` for APFS clonefile workspace snapshots and `btrfs.rs` for subvolumes—built for rollback-able experiments, not for containing hostile code. The line between isolation and security is drawn deliberately.

### OpenCode: the "containers" directory is CI images

A self-correction from my own research: OpenCode's `opencode/packages/containers/` sounds like an agent execution sandbox, but the README reveals they're prebuilt images for GitHub Actions—`base/Dockerfile` is just Ubuntu 24.04 plus build tools, pushed to ghcr.io by `script/build.ts` to speed up CI. There is no built-in untrusted-code sandbox. Lesson: when you see the word "container," first ask who runs what, where.

## looplane's Choice and Pitfalls

With M6, looplane took on the second question: actually deploying the Python agent loop to Cloudflare. The architecture has three layers:

**The Worker is a control plane, not the agent.** `cloudflare/wrangler.jsonc` defines the Worker `looplane-control-plane`, one `lite` container class, and two Durable Object bindings. The request contract is deliberately narrow: `cloudflare/src/control-plane.ts#validateRunRequest` accepts only a UTF-8 text file map, four check commands whitelisted by exact argv (`ALLOWED_CHECK_ARGV`), and hard size caps. Git credentials, arbitrary shells, and caller-chosen images never enter the contract.

**A Durable Object owns capability lifecycles.** `cloudflare/src/capability-do.ts#RunCapability` uses a SQLite-backed DO for per-run activation, atomic budget consumption (`maxSteps + 2` model requests), expiry, and revocation. The model API key lives only in Worker secrets; the container-side agent holds nothing but a short-lived HMAC run token whose audience is pinned to the internal proxy path.

**Least privilege inside the container.** The entrypoint is fixed at `FIXED_COMMAND` (`/usr/local/bin/looplane-sandbox-run`). A root-owned wrapper drops privileges via `setpriv --reuid=looplane --no-new-privs` before handing over to Python; the token is written as an owner-only file rather than an env var, consumed and immediately unlinked by `sandbox_entry.py#_read_and_remove_run_token`, with `PR_SET_DUMPABLE 0` disabling dumpability. The base image is pinned by digest.

Then came what a real deployment taught me—two things mocks completely missed:

**SSE framing.** The very first live run failed: the Sandbox SDK's `readFileStream()` doesn't return raw file bytes but [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) framing—parsing it directly as JSON obviously explodes. The fix was switching to the official `streamFile()` decoder (see `decodeFileStream` in `cloudflare/src/index.ts`), with the byte cap applied to **decoded** content rather than the raw stream. Commit `0b65df9`.

**Stale wheel.** The container image bakes in a Python wheel, but `wrangler deploy` doesn't rebuild it for you—CI can be fully green while you deploy a three-day-old artifact. The fix was baking the rebuild into the deploy lifecycle: `cloudflare/package.json`'s `"deploy"` script forces `build:runtime` before Wrangler packages anything. Commit `cebe5c9`.

One more design principle: **cleanup paths get bounds just like success paths**. Both `destroySandboxBounded` and `revokeCapabilityBounded` wrap their work in timeouts, and any cleanup failure replaces an otherwise successful response with a 500—a leaked, unrevoked capability is far worse than one failed run.

## Engineering Rationale

The core model of the [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/) is: one Durable Object class equals one container. Workers get a `getSandbox()` handle through the [Containers](https://developers.cloudflare.com/containers/) binding; each instance has its own filesystem and exec interface, with lifecycle managed by the platform. looplane uses the run id directly as the sandbox id, so "one disposable container per run" requires no scheduler of our own. The strong-consistency requirement for capabilities—budget consumption for the same run must not race—is precisely what [Durable Objects](https://developers.cloudflare.com/durable-objects/) are designed for: single-point serialization backed by SQLite storage. SSE is a common streaming transport choice for such SDKs, and its event framing comes at a price: consumers must use a matching decoder; MDN's description of the [EventSource data format](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events) maps directly onto `streamFile()`'s input.

## Improvement Roadmap

In priority order:

1. **Egress network policy.** The container currently has unrestricted outbound access; hostile-code containment is explicitly not claimed. Next step: converge model traffic to the internal proxy and deny everything else by default.
2. **Going async.** The endpoint is synchronous with a 240-second timeout, capping run complexity. A durable queue plus status/cancel APIs is the obvious next stop.
3. **Multi-instance and warm pools.** `max_instances: 1` means one run at a time, and cold-start latency is paid entirely by the user.
4. **Keep the local sandbox track alive.** Codex's Landlock/seccomp blueprint still applies—even inside a container, processes deserve a second wall. A "cloud sandbox" isn't a reason to skip local sandboxing; it's one more layer of insurance.

In one sentence: all five projects teach you how to shrink the blast radius on **your** machine. Remote execution adds three new questions—credentials that never touch disk, someone owning the lifecycle, and a return channel you must decode properly—and none of them become concrete bugs until you actually deploy.

## References

- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/sandbox/)
- [Cloudflare Containers](https://developers.cloudflare.com/containers/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [MDN — Server-Sent Events (EventSource data format)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [openai/codex — codex-rs/sandboxing and linux-sandbox](https://github.com/openai/codex/tree/main/codex-rs/sandboxing)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [sst/opencode — packages/containers](https://github.com/sst/opencode/tree/main/packages/containers)
- [badlogic/pi-mono — sandbox extension example](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent/examples/extensions/sandbox)
