---
title: "Learning from Mature Coding Agents (3): Workspace Isolation and Path Policy"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 3
tags: [coding-agent, harness-engineering, sandbox, path-traversal, git-worktree, tool-use]
lang: en
description: "How Codex, Claude Code, OpenCode, Pi, and OMP handle workspace isolation and path validation, compared against rivumi's disposable Git workspace: pinned SHA, SafePathPolicy, and the missing OS-level sandbox."
tldr: "Mature agents share one consensus—model-supplied paths are untrusted—but place the defense line differently: Codex backs everything with an OS sandbox, Claude Code validates per-call at the permission layer, OpenCode draws a project boundary. rivumi uses a disposable Git workspace plus a pure-Python SafePathPolicy: it protects the source repo, not the host, and that gap is the next post's topic."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-workspace-isolation)

## The Design Problem

Every file tool in a coding agent takes a path as its first argument. That path is an LLM-generated string — it can be mistyped, hallucinated, or steered by prompt injection into reading `.env` or writing `~/.ssh/authorized_keys`. So every agent must answer the same three questions:

1. Can the model touch anything outside the workspace?
2. Where does path validation live — tool code, the permission system, or the operating system?
3. If validation is bypassed, what is the worst-case blast radius?

The combination of these answers decides whether an agent is merely "convenient" or actually "trustworthy". This post lays out how five mature projects answer them, then compares my own choices in rivumi.

## What the Five Projects Do

### Codex: the OS sandbox is the last line of defense

OpenAI Codex is the most explicit about this: path checks can exist at many layers, but real guarantees come from its core sandboxing module. On macOS it uses Apple Seatbelt — `codex/codex-rs/sandboxing/src/seatbelt.rs#create_seatbelt_command_args` turns the working directory set into `sandbox-exec` policy arguments; the base policy lives in `codex/codex-rs/sandboxing/src/seatbelt_base_policy.sbpl`, whose first substantive rule is `(deny default)`, with comments crediting Chrome's renderer sandbox as inspiration.

On Linux it's Landlock + seccomp: `codex/codex-rs/linux-sandbox/src/landlock.rs#install_filesystem_landlock_rules_on_current_thread` makes the entire `/` read-only, adds read-write access only for `writable_roots`, then installs a seccomp filter to block network syscalls. The most instructive detail is the fail-closed check — after `restrict_self()`, it inspects `RulesetStatus::NotEnforced`; if the kernel doesn't support Landlock and the policy never took effect, the code returns `SandboxErr::LandlockRestrict` and refuses to run. "Sandbox unavailable" does not mean "run unsandboxed".

### Claude Code: fine-grained path resolution at the permission layer

Claude Code's defense sits mostly at the tool and permission layers. `claude-code-source/src/tools/BashTool/pathValidation.ts#validatePath` expands tildes, resolves, and checks every path appearing inside Bash commands against allowed working directories. One honest detail: the source comment explains that paths are deliberately checked **without resolving symlinks**, because on macOS `/tmp` is a symlink to `/private/tmp` and resolving first would let dangerous paths slip through. `checkPathConstraints` and `validateOutputRedirections` in the same file even intercept output redirections.

On the file-tool side, `FileEditTool/FileEditTool.ts#validateInput` enforces absolute-path requirements and special restrictions on settings files before handing off to `checkWritePermissionForTool`; reads go through `checkReadPermissionForTool` in `FileReadTool/FileReadTool.ts`. There's also an interesting design: `EnterWorktreeTool/EnterWorktreeTool.ts#createWorktreeForSession` can switch the whole session into an isolated git worktree — isolation via version control instead of hard-blocking paths.

### OpenCode: project boundary + allow/ask/deny

OpenCode defines the boundary at the project-instance level. `opencode/packages/opencode/src/project/instance-context.ts#containsPath` answers "is this path inside the project": true if it's under `ctx.directory` or `ctx.worktree`, with a special case for non-git projects where worktree is `/` and would otherwise match every absolute path. Out-of-bounds operations trigger the external-directory permission flow in `tool/external-directory.ts`, finally evaluated by allow / ask / deny rules in `permission/index.ts`.

### Pi: leave the boundary to ExecutionEnv

badlogic/pi-mono is the most minimal: the tool layer only normalizes relative paths to absolute ones — `pi-mono/packages/agent/src/harness/tools/path-utils.ts#resolveToolPath` delegates entirely to the `ExecutionEnv.absolutePath()` interface defined in `pi-mono/packages/agent/src/harness/types.ts`. Pi itself ships no built-in sandbox; the boundary is whatever the embedding application decides. A deliberate trade-off: keep the core small and testable, push isolation responsibility outward.

### OMP: inherits Pi, adds a worktree baseline

oh-my-pi, being a fork of Pi, keeps the same ExecutionEnv path model but adds a worktree baseline to its autoresearch workflow: `oh-my-pi/packages/coding-agent/src/autoresearch/index.ts` records the baseline commit, resets the worktree to it on discard, and warns when you're not on the dedicated branch that revert safety is incomplete.

## rivumi's Choice and How It Differs

rivumi M1's isolation strategy is a **disposable Git workspace**, built from two modules:

**Layer one: the workspace itself is a disposable clone pinned to an exact commit.** `src/rivumi/runtime.py#LocalGitWorkspace.prepare` requires base_sha to be a full 40-character SHA, verifies the commit exists via `rev-parse --verify`, clones with `clone --no-hardlinks --no-checkout` (no-hardlinks guarantees physically separate files), and after detaching HEAD re-verifies that `rev-parse HEAD` equals base_sha before handing over the workspace. The run dir is forbidden from living inside the source repo. The source worktree is never touched, and the final output is an unstaged patch reviewed by a human.

**Layer two: every model-supplied path passes through `src/rivumi/policy.py#SafePathPolicy.resolve`.** It rejects absolute paths, backslashes, NUL bytes, `..` traversal, `.git` in any segment, and after resolution confirms via `relative_to(workspace_root)` that nothing escaped through a symlink. Globs are segment-aware — `*` doesn't cross directories; only a complete `**` segment does, so `src/*.py` never accidentally covers `src/deep/x.py`.

Compared with the five projects, the differences are clear and deserve honesty:

- **I have no OS-level sandbox.** Codex's Landlock/Seatbelt constrains a process's syscalls and filesystem view; rivumi's clone only protects the source repo. Check commands running inside the workspace still carry full user privileges, can see host files, and can reach the network. The M1 doc lists this as a known limitation, which is why local verification refuses to run by default and requires an explicit `--unsafe-local-exec`.
- **Fail-closed was learned, but only applied to capability assertions so far.** Codex's spirit of refusing to execute when the kernel can't enforce maps in rivumi to "tool calling disabled by default for unknown providers, requiring explicit capability assertion"; fail-closed execution itself has to wait for the OS sandbox.
- **Path policy stricter than Pi, shallower than Codex.** Pi outsources the boundary; rivumi, like OpenCode, draws it at the application layer, but adds blanket `.git` denial and resolved symlink escape checks. The cost: all these checks are Python string handling, so any parser bug is an escape hatch. OS sandboxes don't have this problem because the kernel doesn't parse strings.

## Academic Grounding

The SWE-agent team's ACI (agent–computer interface) concept shows that interface design directly affects agent success rate and safety — tool boundaries are design variables, not implementation details ([Yang et al., 2024](https://arxiv.org/abs/2405.15793)). Path policy is the most fundamental ACI decision: all five projects insert a code-level gate between "the model expresses intent" and "the intent gets executed", differing only in gate strength. OpenAI likewise treats sandbox and approval as two independent security controls in Codex ([Codex security docs](https://developers.openai.com/codex/security)), echoing defense in depth: application-layer checks reduce accident probability, OS sandboxes bound accident damage.

## Improvement Roadmap

In priority order:

1. **An OS-level sandbox is the biggest gap — and the setup for what's next.** Codex's Landlock (Linux) / Seatbelt (macOS) dual track, fail-closed enforcement checks, and seccomp network filtering are the direct blueprint for rivumi Part Two #29, "OS-Level Sandboxing". The short-term substitute is a container backend (Cloudflare Sandbox or local Docker), which the M1 doc already names as a prerequisite for hostile code.
2. **Network egress policy.** Check commands currently have unrestricted network access; there's no blocked channel for secret exfiltration.
3. **Artifact secret scanning.** Patches and logs should be scanned for credential patterns before entering the artifact bundle.
4. **Keep the existing strengths.** Pinned full SHA, no-hardlinks clone, HEAD re-verification, segment-aware globs — a level of rigor uncommon even among the five projects. Once the OS sandbox lands, they remain worth keeping as a second wall.

One-line summary: a disposable workspace solves "don't dirty your repo"; an OS sandbox solves "don't wreck your machine". rivumi already does the former; the latter is the next battle.

## References

- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (arXiv)](https://arxiv.org/abs/2405.15793)
- [OpenAI Codex — Sandbox & approvals](https://developers.openai.com/codex/security)
- [openai/codex — codex-rs/sandboxing](https://github.com/openai/codex/tree/main/codex-rs/sandboxing)
- [Landlock: unprivileged access control (kernel docs)](https://docs.kernel.org/userspace-api/landlock.html)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [sst/opencode](https://github.com/sst/opencode)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
