---
title: "Learning from Mature Coding Agents (3): Workspace Isolation and Path Policy"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 3
tags: [coding-agent, harness-engineering, sandbox, path-traversal, git-worktree, tool-use]
lang: en
description: "How Codex, Claude Code, OpenCode, Pi, and OMP isolate workspaces, compared with Looplane's disposable clone, SafePathPolicy, verification sandbox, and Cloudflare remote slice."
tldr: "Looplane's disposable clone and SafePathPolicy protect the source repo. `--sandbox-checks` can now wrap verification commands with macOS sandbox-exec, Linux bubblewrap, or Landlock, while Cloudflare provides a separate bounded Sandbox slice. Network policy, external-runtime coverage, and production hardening are not yet consistent across those backends."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-workspace-isolation)

## The Design Problem

Every file tool in a coding agent takes a path as its first argument. That path is an LLM-generated string — it can be mistyped, hallucinated, or steered by prompt injection into reading `.env` or writing `~/.ssh/authorized_keys`. So every agent must answer the same three questions:

1. Can the model touch anything outside the workspace?
2. Where does path validation live — tool code, the permission system, or the operating system?
3. If validation is bypassed, what is the worst-case blast radius?

The combination of these answers decides whether an agent is merely "convenient" or actually "trustworthy". This post lays out how five mature projects answer them, then compares my own choices in looplane.

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

## looplane's Choice and How It Differs

looplane M1's isolation strategy is a **disposable Git workspace**, built from two modules:

**Layer one: the workspace itself is a disposable clone pinned to an exact commit.** `src/looplane/runtime.py#LocalGitWorkspace.prepare` requires base_sha to be a full 40-character SHA, verifies the commit exists via `rev-parse --verify`, clones with `clone --no-hardlinks --no-checkout` (no-hardlinks guarantees physically separate files), and after detaching HEAD re-verifies that `rev-parse HEAD` equals base_sha before handing over the workspace. The run dir is forbidden from living inside the source repo. The source worktree is never touched, and the final output is an unstaged patch reviewed by a human.

**Layer two: every model-supplied path passes through `src/looplane/policy.py#SafePathPolicy.resolve`.** It rejects absolute paths, backslashes, NUL bytes, `..` traversal, `.git` in any segment, and after resolution confirms via `relative_to(workspace_root)` that nothing escaped through a symlink. Globs are segment-aware — `*` doesn't cross directories; only a complete `**` segment does, so `src/*.py` never accidentally covers `src/deep/x.py`.

Compared with the five projects, the differences are clear and deserve honesty:

- **There is now a verification-sandbox baseline, not one universal runtime sandbox.** `--sandbox-checks` routes `run_check` and final verification through `src/looplane/runtime.py#resolve_command_sandbox`: macOS uses `sandbox-exec`; Linux `auto` prefers bubblewrap and otherwise uses Looplane's Landlock wrapper. If an explicitly requested backend is unavailable, the command fails closed with exit 126. This wraps declared verification argv; it does not mean external CLIs, provider transports, and every host process share that boundary.
- **Remote execution has a separate bounded container slice.** The `cloudflare/` Worker/Sandbox control plane accepts bounded text source maps, not Git URLs, archives, shell strings, or caller credentials. That proves the isolation boundary can move into a container, but does not prove production traffic behavior or complete hostile-code hardening.
- **Path policy stricter than Pi, shallower than Codex.** Pi outsources the boundary; looplane, like OpenCode, draws it at the application layer, but adds blanket `.git` denial and resolved symlink escape checks. The cost: all these checks are Python string handling, so any parser bug is an escape hatch. OS sandboxes don't have this problem because the kernel doesn't parse strings.

## Academic Grounding

The SWE-agent team's ACI (agent–computer interface) concept shows that interface design directly affects agent success rate and safety — tool boundaries are design variables, not implementation details ([Yang et al., 2024](https://arxiv.org/abs/2405.15793)). Path policy is the most fundamental ACI decision: all five projects insert a code-level gate between "the model expresses intent" and "the intent gets executed", differing only in gate strength. OpenAI likewise treats sandbox and approval as two independent security controls in Codex ([Codex security docs](https://developers.openai.com/codex/security)), echoing defense in depth: application-layer checks reduce accident probability, OS sandboxes bound accident damage.

## Improvement Roadmap

In priority order:

1. **Make sandbox coverage explicit and expand it deliberately.** The bounded surfaces today are verification commands and the Cloudflare remote slice; external runtimes still own their execution semantics. The next step is a per-runtime matrix of filesystem, process, and network capabilities, with fail-closed or an explicit trusted-local label where enforcement is unavailable.
2. **Unify network egress policy.** Bubblewrap's network namespace, the macOS profile, and the Landlock wrapper do not expose identical controls. A production claim needs one deny-by-default contract and cross-platform tests.
3. **Complete secret scanning across the artifact boundary.** `run_check` stdout/stderr are scanned and redacted, and external-runtime patches are scanned. Native patches, sessions, and every other artifact still need one audited policy plus tests for uncovered credential formats.
4. **Keep the existing strengths.** Pinned full SHA, no-hardlinks clone, HEAD re-verification, segment-aware globs — a level of rigor uncommon even among the five projects. Once the OS sandbox lands, they remain worth keeping as a second wall.

One-line summary: the disposable workspace protects the source repo, and `--sandbox-checks` plus Cloudflare Sandbox add two enforceable slices. The broader claim — that every runtime cannot damage the machine — still requires cross-platform, cross-backend enforcement and production validation.

## References

- [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering (arXiv)](https://arxiv.org/abs/2405.15793)
- [OpenAI Codex — Sandbox & approvals](https://developers.openai.com/codex/security)
- [openai/codex — codex-rs/sandboxing](https://github.com/openai/codex/tree/main/codex-rs/sandboxing)
- [Landlock: unprivileged access control (kernel docs)](https://docs.kernel.org/userspace-api/landlock.html)
- [anthropics/claude-code](https://github.com/anthropics/claude-code)
- [sst/opencode](https://github.com/sst/opencode)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [Looplane command sandbox at fixed commit `2ed5efb`](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/runtime.py)
