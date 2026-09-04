---
title: "Learning from Mature Coding Agents (29): OS-Level Sandboxing"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 29
tags: [coding-agent, harness-engineering, sandbox, landlock, seatbelt, bubblewrap]
lang: en
description: "Dissecting OS-sandbox boundaries in mature coding agents, then checking Looplane's sandbox-exec, Landlock/seccomp, and fail-closed verification baseline."
tldr: "An OS sandbox is the kernel boundary beyond path policy. looplane now ships a fail-closed CommandSandbox: sandbox-exec on macOS, Landlock plus seccomp on Linux, and exit 126 when containment cannot be proven. Coverage still focuses on verification commands, and external CI confirmation remains open."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-os-level-sandboxing)

## The Capability Gap

The previous post on [workspace isolation and path policy](/posts/ai/2026-08-25-coding-agent-workspace-isolation) ended with one sentence: a disposable workspace solves "don't dirty my repo"; the OS sandbox solves "don't wreck my machine". This post tackles that admitted gap head-on.

The problem is concrete: when looplane runs verification commands inside the workspace, that process holds the user's full privileges — it can read `~/.ssh`, reach the network, overwrite shell config. `SafePathPolicy` only inspects the path arguments the model supplies; it cannot control child processes the command spawns. Every pure application-layer check shares one structural weakness: it is all string processing, and any parser bug is an escape hatch. Kernel-level isolation has no such weakness — at the syscall layer nothing reads strings; what matters is which file descriptors actually get opened.

So the question here: if looplane wants an OS-grade defense line in pure Python, without introducing a daemon architecture, whose homework should it copy?

## What the Five Projects Do

### Codex: one abstraction, three platform mechanisms

Part one already examined Seatbelt policy and Landlock's fail-closed check in detail, so here I only add the architecture view. Codex concentrates "which sandbox?" in a single dispatch point: `codex/codex-rs/sandboxing/src/manager.rs#get_platform_sandbox` returns exactly one of `MacosSeatbelt`, `LinuxSeccomp`, or `WindowsRestrictedToken`, and upper layers never touch platform details. Windows is not a second-class citizen either: `codex/codex-rs/windows-sandbox-rs/src/lib.rs#run_windows_sandbox_capture` builds a full deny-by-default sandbox out of restricted tokens plus ACLs.

Two details worth recording separately:

- **Pre-execution process hardening**: `codex/codex-rs/process-hardening/src/lib.rs#pre_main_hardening` runs before main — `PR_SET_DUMPABLE 0` (blocking same-UID ptrace), core dumps zeroed, all `LD_*` environment variables stripped. Not the sandbox itself, but a shrinkage of the attack surface outside it.
- **Dependency detection for bubblewrap**: besides Landlock, Linux has a bubblewrap route. `codex/codex-rs/sandboxing/src/bwrap.rs#system_bwrap_warning` actively probes whether the system bwrap has user namespace access, warns and falls back to a bundled copy if not — a dependency existing is not the same as a dependency working.

### Claude Code: sandbox-or-not as an independent decision

Claude Code's interesting move is extracting "should this command enter the sandbox" into its own function: `claude-code-source/src/tools/BashTool/shouldUseSandbox.ts#shouldUseSandbox` first checks the global switch, then whether the user explicitly asked to skip (and policy allows skipping), finally matching an exclusion list — all three gates must pass for true. The underlying adapter lives in `claude-code-source/src/utils/sandbox/sandbox-adapter.ts#convertToSandboxRuntimeConfig`: Seatbelt on macOS, bubblewrap on Linux (misconfiguration prompts `apt install bubblewrap socat`), and unsupported platforms get an explicit "unavailable" instead of silent passthrough.

### OpenCode and OMP: an honest contrast group

These two illustrate commonly confused near-misses. OpenCode's `opencode/packages/containers/base/Dockerfile` is a row of CI Dockerfiles — preinstalled build tools for GitHub Actions jobs; the README says so itself ("speed up jobs"), not a runtime security boundary. OMP's `oh-my-pi/crates/pi-iso/src/lib.rs#default_backend` comes closer but is still not one: it probes APFS clonefile, btrfs snapshots, ZFS clones, and NTFS block clones to find the fastest copy-on-write snapshot mechanism — solving "quickly produce disposable data copies", while processes keep every privilege they had. Snapshots are efficiency engineering; sandboxes are security boundaries. They are routinely conflated.

## Academic and Engineering Grounding

The first line of Codex's macOS policy, `(deny default)`, credits the [Chrome renderer sandbox](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/mac_sandboxing.md) — browsers spent over a decade proving that processes parsing untrusted content must default to denying everything and opt into each capability. On Linux, [Landlock](https://docs.kernel.org/userspace-api/landlock.html) has shipped since kernel 5.13 as unprivileged access control: no root, no extra daemon, rules stacked by the process itself — precisely the puzzle piece daemon-free architectures have been waiting for. [seccomp](https://man7.org/linux/man-pages/man2/seccomp.2.html) covers the network and syscall surface. And SWE-agent's ACI framework reminds us that interface design — when these mechanisms activate, how they behave on failure — matters as much as the mechanisms ([Yang et al., 2024](https://arxiv.org/abs/2405.15793)). Five projects compress into one sentence: **the sandbox must fail closed**. Codex errors out and refuses to execute when `restrict_self()` reports `RulesetStatus::NotEnforced`; Claude Code reports unavailability on unsupported platforms. None of them translates "the sandbox failed to start" into "then run naked".

## Original Design Draft (2026-08-25)

Goal: a `LocalSandbox` wrapper around the existing `run_bounded_command`, standard library only, no daemon.

**macOS: sandbox-exec with an absolute path.** Copy Codex and hardcode `/usr/bin/sandbox-exec`, avoiding PATH hijacking. Generate `.sbpl` dynamically from writable roots (workspace directory + tempdir + Python site-packages): `(deny default)` baseline, workspace read-write, everything else read-only or denied. Apple has never formally endorsed sandbox-exec, but it still ships and is the shared macOS choice of both Codex and Claude Code — following those two carries the lowest risk.

**Linux: mount Landlock via ctypes, ahead of bubblewrap.** Landlock's API is four syscalls (`landlock_create_ruleset`, `add_rule`, `restrict_self`, …), callable directly through ctypes with zero new dependencies — which matters given looplane's startup-performance discipline. Bubblewrap serves as fallback: probe the external binary's usability (a user namespace probe, per `bwrap.rs`) and never pretend it exists when it doesn't. For network isolation, version one skips hand-written seccomp BPF (too fragile from Python) in favor of `unshare(CLONE_NEWNET)` or an explicitly documented known limitation.

**Fail-closed is an acceptance criterion, not a footnote.** Check enforced status after Landlock's `restrict_self()`; kernel too old, sandbox-exec missing, bwrap without namespace access — all fall back to today's behavior: refuse to run verification unless `--unsafe-local-exec` is passed explicitly. In other words, "no sandbox" changes from an implicit accident into an explicit, user-signed exception.

**Process hardening lands first.** This partially exists already: `src/looplane/sandbox_entry.py#_harden_linux_process` already does `PR_SET_DUMPABLE 0`. Generalizing it to the local execution path, adding a zeroed core-dump rlimit and environment scrubbing costs about an hour and removes half the attack surface even when the sandbox is absent.

## Fitting Into the Existing Architecture

Four points, in dependency order:

1. **SafePathPolicy demotes to the second wall — not deleted.** It still intercepts prompt-injection-driven path hallucinations, and its error messages beat EPERM by miles. The OS sandbox catches what leaks past; policy catches the common cases.
2. **The Cloudflare Sandbox route (M6) stays; local becomes its mirror.** The M6 doc states plainly that no hostile-code containment is claimed while checks share a container with outbound network. The local draft adopts the same honesty template: what we claim, what we don't — written into docs, not hidden in flag names.
3. **Approval grading consumes sandbox state.** Future approval tiers should factor "was this execution sandboxed?" into risk: the same command can auto-approve sandboxed but must ask unsandboxed.
4. **Keep pinned SHA, no-hardlinks, HEAD re-verification.** These are data-integrity measures, orthogonal to process isolation; they remain correct after the sandbox arrives.

To close: part one said "the latter is the next battle." This post maps the battlefield — mechanism selection, the fail-closed contract, and where the new layer sits relative to the existing three (policy, workspace, cloud sandbox). What remains is writing it.

## Looplane's Current Implementation

As of `2ed5efb`, the draft has a working baseline. `runtime.py#CommandSandbox` builds platform wrappers: a sandbox-exec profile on macOS, and filesystem rules from `landlock_run.py` combined with a seccomp backend on Linux. Named profiles and read roots flow from CLI config into verification runners; if availability cannot be proven, execution fails closed with exit 126 before repository code starts.

Linux Landlock/seccomp has a local smoke and CI workflow, and the macOS wrapper has unit coverage. Containment still primarily wraps native verification commands rather than every agent process, however, and external CI results plus a broader platform matrix remain unconfirmed. The supported claim is that the configuration chain and deny-by-default behavior exist, not that every execution path has production isolation.

## References

- [Looplane CommandSandbox (fixed commit)](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/runtime.py)
- [Looplane Linux Landlock runner (fixed commit)](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/landlock_run.py)

- [Landlock: unprivileged access control (kernel docs)](https://docs.kernel.org/userspace-api/landlock.html)
- [landlock_create_ruleset(2) — Linux man page](https://man7.org/linux/man-pages/man2/landlock_create_ruleset.2.html)
- [seccomp(2) — Linux man page](https://man7.org/linux/man-pages/man2/seccomp.2.html)
- [Chromium macOS sandboxing design](https://chromium.googlesource.com/chromium/src/+/HEAD/docs/mac_sandboxing.md)
- [bubblewrap — unprivileged sandboxing tool](https://github.com/containers/bubblewrap)
- [openai/codex — codex-rs/sandboxing](https://github.com/openai/codex/tree/main/codex-rs/sandboxing)
- [Cloudflare Sandbox SDK](https://developers.cloudflare.com/agents/api-reference/sandbox/)
- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (arXiv)](https://arxiv.org/abs/2405.15793)
