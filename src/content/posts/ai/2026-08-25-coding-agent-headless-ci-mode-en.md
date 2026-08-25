---
title: "Learning Design from Mature Coding Agents (21): Headless Mode and CI Usage — When Nobody Can Click Approve"
date: 2026-08-25
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 21
tags: [coding-agent, ci, headless, approval, rivumi, claude-code, codex]
lang: en
tldr: "The biggest problem when an agent enters CI is approval: no TTY, nobody to click approve. The five reference projects converge on two strategies — delegate permission decisions to the calling program (claude-code's control protocol), or replace approval semantics entirely (codex defaults to Never plus sandboxing, opencode auto-rejects). rivumi keeps one AgentRunner loop and injects a different ApprovalPolicy: headless uses HeadlessApprovalPolicy, which never reads stdin so it cannot hang the pipeline, and denies EXECUTE by default — fail closed."
description: "A source-level comparison of headless/CI permission design across pi, omp, opencode, codex, and claude-code: pre-authorization vs. delegation vs. fail closed, and why rivumi insists on one loop with two interfaces."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-headless-ci-mode)

The [previous post](/posts/ai/2026-08-25-coding-agent-toolset-design-philosophy-en) covered tool surface design; this one changes the scene: what happens when the same agent moves from your terminal into a CI pipeline.

Evidence base: **pi** (badlogic/pi-mono), **omp** (can1357/oh-my-pi), **opencode** (sst/opencode), **codex** (openai/codex Rust workspace), and **claude-code** (community-decompiled v2.1.88; symbol names may differ from upstream). Every citation below was read in my local clones.

## The design problem: who clicks approve in CI?

In interactive mode the answer to approval is trivial: show a dialog, a human picks allow or deny. That design silently assumes three things — there is a TTY, there is a patient human, and that human is present. Move to a CI runner and all three vanish at once: stdin is not a terminal, pipelines have timeouts, nobody is watching.

So the real design question of headless mode is not "how do we remove the UI" but: **where does the approval decision, previously carried by real-time conversation, move to?** There are only three candidate locations — declared up front (allowlists, sandbox configuration), delegated live to the caller's program (an SDK host), or denied unconditionally. Picking the wrong location has a concrete cost: pre-authorizing everything invites prompt injection; rejecting everything makes the agent useless in CI.

## What the five projects do

### claude-code: skip the trust dialog, delegate permissions to the SDK host

`claude-code-source/src/cli/print.ts#runHeadless` is the entry point of `-p` print mode. It keeps the full permission system but swaps out who gets asked: `getCanUseToolFn` (`claude-code-source/src/hooks/useCanUseTool.ts#getCanUseToolFn`) sends permission requests to stdout via the control protocol in headless mode, letting the SDK caller decide — the approval decision is delegated to whatever program wraps the agent.

The most honest piece of evidence is the help text for `-p, --print` in `main.tsx`: "The workspace trust dialog is skipped when Claude is run with the -p mode. Only use this flag in directories you trust." Print mode skips even the workspace trust dialog, which the official CLI reference also states ([CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference)). For fully unattended runs there is an even more aggressive `--dangerously-skip-permissions`, whose help text states its own precondition: "Recommended only for sandboxes with no internet access." Print-mode-only `--max-turns` and `--max-budget-usd` cap steps and spend, and the exit code comes from the result's `is_error` (`gracefulShutdownSync` at the end of `print.ts#runHeadless`) — pipelines can judge success without parsing text.

### codex: approvals default to Never, safety moves to the sandbox

`codex/codex-rs/exec/src/cli.rs#Cli` is built for non-interactive use end to end: prompt from stdin, `--json` JSONL event stream, `-o` writes the last message to a file, plus `resume`/`fork` subcommands. The key decision sits where ConfigOverrides is assembled in `codex-rs/exec/src/lib.rs`, with a comment saying it outright: "Default to never ask for approvals in headless mode", setting `approval_policy` to `AskForApproval::Never`.

But approval-Never is not the same as allow-everything — codex bets on another layer: OS-level sandboxing. `--sandbox read-only/workspace-write/danger-full-access` defines the actual filesystem and network boundary, converting the approval problem into a sandbox configuration problem ([sandbox docs](https://github.com/openai/codex/blob/main/docs/sandbox.md)). To bypass both layers you must explicitly pass `codex-rs/utils/cli/src/shared_options.rs#dangerously_bypass_approvals_and_sandbox`, whose doc comment is the sternest among the five: "EXTREMELY DANGEROUS. Intended solely for running in environments that are externally sandboxed."

### opencode: auto-reject by default, fail closed

In the handler of `opencode/packages/opencode/src/cli/cmd/run.ts#RunCommand`, the code that best expresses the headless default stance: on a `permission.asked` event, without `--auto`, it prints "permission requested: ...; auto-rejecting" and replies reject. In other words, opencode's non-interactive mode **denies everything by default**; allowing requires explicitly passing `--auto`, whose describe pulls no punches: "auto-approve permissions that are not explicitly denied (dangerous!)". This is the most conservative answer: a CI agent by default can only do things that need no approval.

### pi: no TTY means print mode, trust decisions fail closed

pi's mode selection lives in `pi-mono/packages/coding-agent/src/main.ts#resolveAppMode`: `-p`, non-TTY stdin, or non-TTY stdout — any of these enters print mode. The print-mode body `pi-mono/packages/coding-agent/src/modes/print-mode.ts#runPrintMode` is thin — send prompts, output results, set exit code from whether stopReason is error/aborted. The interesting part is how trust handles headless: at the end of `pi-mono/packages/coding-agent/src/core/project-trust.ts#resolveProjectTrusted`, before asking a human it checks `if (!options.projectTrustContext.hasUI) return false;` — with no UI to ask, the project is simply treated as untrusted and loaded with restricted settings. Unlike claude-code, pi's choice is not skipping the trust dialog but **when there is no one to ask, don't trust**.

### omp: approval mode becomes a runtime override

omp is a fork of pi, and its increment here is promoting approval level to a first-class parameter: `--approval-mode always-ask|write|yolo`, with `--auto-approve`/`--yolo` aliases. The block at `oh-my-pi/packages/coding-agent/src/main.ts#approvalMode` writes it into a settings override (the comment stresses it is a runtime override and is not persisted) so every downstream reader of `tools.approvalMode` — including the ACP permission bridge — sees the same intent. Also, piped input automatically triggers print mode; no manual `-p` needed.

## rivumi's choice: one loop, two policies

rivumi's answer is a fourth combination: **approval is not removed, it is injected**. The constructor of `src/rivumi/loop.py#AgentRunner` accepts an `approval_policy`; if none is given it uses `HeadlessApprovalPolicy`. The interactive path passes `TTYApprovalPolicy`. One agent loop, with the interface difference compressed into a single policy object.

The docstring of the headless policy is the whole design: "A deterministic policy that never reads stdin and therefore cannot hang CI" (`src/rivumi/approvals.py#HeadlessApprovalPolicy`). Its decision table has three rows: READ always allowed, MODIFY allowed (still bounded by path policy and cumulative patch limits), EXECUTE denied by default — fail closed, aligned with opencode. On top, `src/rivumi/cli.py#run` stacks contract-style boundaries: `--check` accepts only exact argv, `--max-steps` and `--wall-time` are hard budgets, the disposable workspace is pinned to a base SHA, and the command prints full artifacts and exits 1 whenever status is not completed.

The biggest difference from the five: rivumi's headless mode offers **no "pre-authorize everything" option**. codex has danger-full-access, claude-code has skip-permissions, omp has yolo; rivumi's closest thing is `--unsafe-local-exec`, and even that only allows the exact argv check commands declared in the task contract, not arbitrary shell. The cost is flexibility — many CI jobs are out of reach. The benefit is a crystal-clear CI usage boundary: exactly what the contract declares can run, and every approval decision lands in an inspectable audit trail.

## Engineering references

These trade-offs were not invented from thin air; official docs state the same positions more bluntly:

- The [Claude Code Agent SDK docs](https://docs.anthropic.com/en/docs/claude-code/sdk) describe the permission delegation model for headless/programmatic use — the public version of print.ts's control protocol.
- The [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference) documents the `-p` trust-dialog warning.
- Anthropic ships an official [GitHub Actions integration](https://docs.anthropic.com/en/docs/claude-code/github-actions) that turns headless permission settings (allowed tools) into workflow inputs.
- The [Codex exec docs](https://github.com/openai/codex/blob/main/docs/exec.md) position `codex exec` as "run Codex non-interactively" and explain pairing approvals with sandboxing.
- The [OpenCode CLI docs](https://opencode.ai/docs/cli) cover non-interactive `opencode run`.

The shared pattern worth copying: **headless safety does not rest on a few flags but on safe defaults** — codex defaults to Never plus sandbox, opencode defaults to rejection, pi refuses to trust when it cannot ask. Dangerous capability always hides behind explicit opt-in flags with long names, and the help text tells you the consequences directly.

## Improvement roadmap

What rivumi already has: cannot hang, fails closed, complete artifacts, machine-readable exit codes. Against the five, four paths remain:

1. **Structured output schema**. codex's `--output-schema` gives CI verifiable JSON instead of prose. rivumi's result.json is already structured; what's missing is letting users constrain the final reply with their own schema.
2. **A stable streaming event contract**. claude-code's stream-json plus its stdout guard (keeping any noise from polluting the JSON stream) is infrastructure for external orchestration. rivumi's events.jsonl is an artifact, not a live interface — mid-run observability in CI is currently impossible.
3. **Pair sandboxing with EXECUTE allow**. codex's lesson is that approval Never is only safe with OS-level isolation. If rivumi ever relaxes execute in CI, the right order is sandbox first (the subject of a later post in this series), not a bigger allowlist flag.
4. **Resume in the pipeline**. codex exec has a `resume` subcommand so failed jobs continue instead of restarting; rivumi's session resume exists on the interactive path but is not yet wired into the headless contract.

One-line summary: headless mode is not interactive mode with the UI ripped out — it replaces the dependency on human judgment entirely with contracts declared up front and safe defaults.

## References

- [Claude Code Agent SDK docs](https://docs.anthropic.com/en/docs/claude-code/sdk)
- [Claude Code CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-reference)
- [Claude Code GitHub Actions](https://docs.anthropic.com/en/docs/claude-code/github-actions)
- [Codex `codex exec` docs](https://github.com/openai/codex/blob/main/docs/exec.md)
- [Codex sandbox design](https://github.com/openai/codex/blob/main/docs/sandbox.md)
- [OpenCode CLI docs](https://opencode.ai/docs/cli)
- [badlogic/pi-mono](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi)
