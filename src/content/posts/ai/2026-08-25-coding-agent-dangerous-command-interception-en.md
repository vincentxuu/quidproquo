---
title: "Learning Design from Mature Coding Agents (28): Dangerous Command Interception and Shell Escalation — Between Allowlists and Always Ask"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 28
tags: [coding-agent, shell-execution, security, approval, looplane, codex, claude-code, omp]
lang: en
tldr: "All five projects combine allow/ask/deny decisions, compound-command inspection, and fail-closed behavior. looplane now has a deny-first classifier, critical floor, shell segmentation, timeout-deny, configured allow/deny rules, and visible policy reasons. Broader syntax coverage and live interactive validation remain open."
description: "Comparing dangerous-command escalation across five coding agents, then checking Looplane's allow/ask/deny classifier, critical floor, and policy-audit baseline."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-dangerous-command-interception)

This Part Two article originally treated dangerous-command grading as a missing capability. Looplane now has a deterministic allow / ask / deny classifier, deny-first rule layering, a critical-command floor, and approval-visible policy reasons. The evidence base remains pi, omp, opencode, codex, and claude-code; their implementations now test what Looplane's baseline still lacks in free-shell parsing depth, persistent-rule UX, and cross-platform sandbox parity.

## The capability problem: binary decisions can't carry a free shell

Once an agent can run shell commands, the question shifts from "can it run things" to "which commands can run without asking". The difficulty is that a continuous spectrum gets compressed into discrete decisions: thousands of commands sit between `ls` and `rm -rf /`, but the approval mechanism can only say go or no-go. Too loose, and a single `git push --force` wipes remote history. Too tight, and every command pops a confirmation dialog — users start clicking approve mindlessly, and confirmation fatigue becomes a security vulnerability in itself.

Compound commands make it worse: `cd x && rm -rf /` hides the dangerous part mid-line; if an allow rule only checks the string's prefix, shell control syntax smuggles it through. So mature projects are really solving three sub-problems: **how to grade** (which commands are trusted enough to skip asking), **how to decompose** (where the danger hides inside compound commands), and **how to fail** (what the default is when the user is absent or times out).

## How the five do it

### codex: a policy engine plus syscall-level escalation

codex is the only project that splits this into two dedicated crates. Layer one is the policy engine `execpolicy`: `codex-rs/execpolicy/src/decision.rs#Decision` defines a three-valued decision — `Allow` (runs without approval), `Prompt` (requires explicit approval, with a comment noting it is rejected outright when `approval_policy="never"`), `Forbidden` (blocked without further consideration). Rules are prefix-shaped: `codex-rs/execpolicy/src/rule.rs#PrefixRule` matches argv token-by-token via `matches_prefix`, and `RuleMatch` carries a `justification` field so rules can attach a reason surfaced in prompts or rejection messages. The whole policy is evaluated by `codex-rs/execpolicy/src/policy.rs#check`, falling back to heuristics when nothing matches.

Layer two, `shell-escalation`, is far more radical: instead of inspecting strings at the tool entry point, it intercepts the `execve` syscall itself through a patched shell. The `EscalationPolicy` trait (`codex-rs/shell-escalation/src/unix/escalation_policy.rs`) receives the real resolved executable path and full argv — not the string the model claimed — sidestepping the fundamental limitation that string analysis never fully captures shell semantics. The decision type `EscalationDecision` in `escalate_protocol.rs` has three variants: `Run` (inside the sandbox), `Escalate(EscalationExecution)` (execute elevated, choosing between `Unsandboxed`, `TurnDefault`, or explicit `Permissions`), and `Deny`.

The most worth-stealing part is where fail-closed lands. In `codex-rs/core/src/tools/runtimes/zsh_fork/unix_escalation.rs`, mapping the user's `ReviewDecision` onto escalation decisions, timeout (`TimedOut`) and cancellation both map to `deny` — only explicit consent escalates; everything else does not execute.

### claude-code: informational warnings plus sandbox routing

claude-code takes a "warnings inform, permissions enforce" route. `src/tools/BashTool/destructiveCommandWarning.ts#getDestructiveCommandWarning` maintains a `DESTRUCTIVE_PATTERNS` regex list covering `git reset --hard`, `git push --force`, `DROP TABLE`, `terraform destroy`, and more; the file header comment is explicit: "purely informational — it doesn't affect permission logic." Its job is to add one human-readable sentence to the permission dialog, not to grab authority from the approval mechanism. What actually changes execution is `src/tools/BashTool/shouldUseSandbox.ts#shouldUseSandbox`: commands go into the sandbox by default, exempted only by a user-configured exclusion list.

### omp: critical patterns plus semantically correct allow matching

omp's fork keeps a carefully written regex list at `packages/coding-agent/src/tools/bash.ts#CRITICAL_BASH_PATTERNS`: `rm --no-preserve-root`, fork bombs, `dd if=… of=/dev/`, `curl | bash` and its process-substitution variants, `nc -e` reverse shells. A comment states the trade-off principle — false negatives cost data loss or a compromised host, while false positives remain recoverable through user policy — so the list is deliberately tight.

The architecturally interesting part is the matching semantics for allow/deny/pattern rules (`bashApprovalRuleMatches` in the same file): `deny` and `prompt` fire if any segment matches, using a shared tokenizer to split compound commands — `cd x && rm -rf /` can't hide. But **`allow` must vouch for the entire command** and voids itself if any shell control syntax appears — because "a narrow allow rule riding on a smuggled segment" is exactly the most common bypass. The tool's `approval` method integrates these into the final tier decision.

### pi: delegate risk judgment to extension hooks

pi's core does almost no dangerous-command detection itself. `pi-mono/packages/coding-agent/src/core/tools/bash.ts#BashSpawnHook` provides a pre-spawn hook: extensions receive `{command, cwd, env}` and may rewrite or reject. This outsources "what counts as dangerous" to the community — risk policy becomes composable packages rather than core code. The cost is equally clear: zero protection out of the box; whether and which hook is installed depends entirely on the user.

### opencode: the command as resource, wildcard rules

opencode's bash tool (`packages/core/src/tool/bash.ts`) calls `permission.assert({resources: [input.command], save: [input.command]})` before executing — treating the full command string as a permission resource evaluated against schema-layer wildcard rules (`packages/core/src/permission.ts#evaluate`), with approval remembered via `save`. It also scans command arguments for external directories but honestly marks that scan advisory-only in comments — static scanning can't catch every path, so it warns rather than blocks.

## Academic grounding

The common ancestor of these designs is least privilege: Saltzer and Schroeder's classic 1975 paper [The Protection of Information in Computer Systems](https://www.cs.virginia.edu/~evans/cs551/saltzer/) defines "least privilege" — every subject should hold the minimum permissions needed for its current task. codex's three-way decision is that principle engineered: minimal in-sandbox privilege by default (`Run`), exceptions require explicit authorization (`Escalate`), forbidden things leave no room for negotiation (`Deny`). "Deny by default" directly implements another entry from the same paper, fail-safe defaults: timeouts, cancellations, and missing responses all land on deny. Anthropic's own [security documentation](https://docs.anthropic.com/en/docs/claude-code/security) also positions permission prompts and sandboxing as two independent lines of defense — warning systems (claude-code's destructive warnings) exist to inform human decisions, while sandboxing and approvals enforce boundaries; merging their responsibilities serves neither.

## Original design draft (2026-08-25)

The current state, honestly: looplane has **no free-shell tool**. Its only EXECUTE channel is `tools.py#run_check`: verification commands come from config with fully fixed argv, and the tool schema even restricts names to an enum. Effect grading relies on `approvals.py#ToolEffect` (READ/MODIFY/EXECUTE); headless runs default `HeadlessApprovalPolicy.allow_execute` to False, and the only way to enable it is the CLI-level `--unsafe-local-exec` boolean flag.

The design is safe, but the gap is clear: **decisions are binary**. An allowlist hit runs; everything else falls to "ask the user" or stays disabled. The moment you want to add a bash tool, or let a trusted repo ship its own check commands (the `--unsafe-local-exec` help text already hints at this direction), the three-value ToolEffect cannot express "this command is dangerous but negotiable" — the middle ground. Draft:

**Layer one: a three-valued decision engine.** Add `src/looplane/shell_policy.py` defining `ShellDecision = ALLOW | PROMPT | FORBIDDEN` (aligned with codex's naming), taking parsed argv and workdir as input. Two rule sources: prefix rules from config (reusing run_check's exact-argv thinking, loosened to prefixes), plus a built-in critical-regex list following omp's tightening principle — only shapes that are virtually never legitimate in automation.

**Layer two: per-segment inspection of compound commands.** Split on `;`, `&&`, `||`, `|` boundaries with `shlex`; FORBIDDEN/PROMPT fires on any matching segment; ALLOW must cover every segment and contain no control syntax — omp's hard-won semantics, copied verbatim.

**Layer three: fail-closed escalation.** PROMPT goes through the existing `TTYApprovalPolicy`, but session-level consent should change from today's global grant set (`approvals.py#_grants`) to per-pattern grants, so "approved pytest once" doesn't mean "approved everything". Timeouts and rejections always deny, matching codex. Every decision (with rule name and justification) writes to the audit trail — the event stream is looplane's existing strength; this plugs right in.

## Fitting into the existing architecture

The good news: the foundation exists — ToolEffect grading, callback/headless/TTY approval policies, the exact argv allowlist, the audit trail. Missing is just the middle layer of risk semantics. Three concrete integration points: `run_check`'s verification commands move onto the new engine (the allowlist becomes a special case of ALLOW rules); `--unsafe-local-exec` downgrades from a boolean to "fallback decision when no rule matches", letting headless mode benefit from grading too; `effect_for_tool` stays unchanged, with shell policy layered as refinement inside the EXECUTE effect.

Ordering matters too: this should come before OS-level sandboxing (the next post's topic). Pattern grading is cheap, pure software, immediately useful; the landlock/seatbelt layer is the backstop for when grading gets it wrong. Grading first — otherwise the sandbox has nothing to back up.

## Looplane's current implementation

As of `2ed5efb`, the old binary-decision description is obsolete. `permissions.py` splits shell-shaped commands into segments, then `classify_command_policy()` returns `allow`, `ask`, or `deny`. The critical floor and explicit deny rules precede session grants and allow rules; shell interpreters, network/package operations, permission changes, archives, and suspicious compound shapes escalate, while suspicious long timeouts are denied.

`ApprovalRequest.policy_reason` reaches TTY/TUI surfaces, run events, and persisted audit records; legacy `exec/run` and resume paths use the same guard. This remains command-text classification, not execve interception. Shell expansion, wrapper programs, and adversarial obfuscation require conservative handling, with the OS sandbox as the second boundary.

## References

- [Looplane command policy (fixed commit)](https://github.com/vincentxuu/looplane/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/looplane/permissions.py)

- [openai/codex — codex-rs/execpolicy](https://github.com/openai/codex/tree/main/codex-rs/execpolicy): Allow/Prompt/Forbidden three-way decisions and the prefix rule engine
- [openai/codex — codex-rs/shell-escalation](https://github.com/openai/codex/tree/main/codex-rs/shell-escalation): execve-intercepting escalation server
- [Claude Code docs — Security](https://docs.anthropic.com/en/docs/claude-code/security): positioning permission prompts and sandboxing as dual defenses
- [OpenCode docs — Permissions](https://opencode.ai/docs/permissions/): command-string-as-resource permission rules
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi): repo hosting `CRITICAL_BASH_PATTERNS`
- [Saltzer & Schroeder, The Protection of Information in Computer Systems (1975)](https://www.cs.virginia.edu/~evans/cs551/saltzer/): original source of least privilege and fail-safe defaults
