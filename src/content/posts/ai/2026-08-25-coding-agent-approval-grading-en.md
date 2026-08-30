---
title: "Learning Agent Design from Mature Coding Agents (4): Approval Grading and the Audit Trail"
date: 2026-08-30
category: ai
type: deep-dive
series:
  name: "跟成熟 coding agent 學設計"
  order: 4
tags: [coding-agent, approval, permissions, audit-trail, rivumi, claude-code, codex]
lang: en
tldr: "Rivumi now grades effects as read/modify/modify_execute/execute and fails closed on unclassified tools. Native MCP tools default to execute unless trusted read-only metadata lowers them. Approval events still land in events.jsonl first and grants can scope to one change set or backend; general command rules and universal sandbox coupling remain unfinished."
description: "Comparing how pi, omp, opencode, codex, and claude-code grade tool actions, scope session grants, and record approval decisions — plus how rivumi's ToolEffect classification, durable audit events, and process-local scoped grants differ, and why dangerous-command interception is next."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-25-coding-agent-approval-grading)

After the [series overview](/posts/ai/2026-08-25-coding-agent-design-series-overview-en), the agent loop, and workspace isolation, this post covers the third foundation: which actions ask a human, how those decisions get recorded, and how far one "yes" extends.

## The design problem

An approval system has to answer three questions:

1. **Grading**: which actions run automatically, which ask? Where does classification live — declared per tool, or in one central table?
2. **Recording**: after the user hits Allow, where does that decision go? Can you later reconstruct what the model requested and what the human answered?
3. **Scope**: does "always allow" mean until the session ends, for the whole effect class, or precisely down to certain files?

The third point is most often underestimated. Too coarse (one click opens everything) means no defense; too fine (ask every time) fatigues users into blind Yes-pressing. Both lose.

## How the five do it

### claude-code: modes are the backbone, rules are exceptions

In the decompiled source every tool must implement two methods: `claude-code-source/src/Tool.ts#isReadOnly` declares read-onlyness, `#checkPermissions` returns an allow/ask decision. The mode set lives in `claude-code-source/src/types/permissions.ts`: `default`, `acceptEdits`, `plan`, `bypassPermissions`.

The write-decision core is `claude-code-source/src/utils/permissions/filesystem.ts#checkWritePermissionForTool` with a fixed priority: deny rules first, then ask rules; if mode is `acceptEdits` and the path is inside the working directory, allow; then allow rules; the final fallback is ask. Notably, `#checkPathSafetyForAutoEdit` forces manual approval for sensitive files like `.claude` config and `.bashrc` even in `acceptEdits` mode — a mode is not a universal pass.

### codex: approval and sandbox are two separate controls

`codex/codex-rs/protocol/src/protocol.rs#AskForApproval` defines four levels: `untrusted`, `on-request` (the model decides when to ask), `granular`, `never`. User responses live in `protocol.rs#ReviewDecision`, and they go beyond yes/no: `ApprovedForSession` (cached for this session), `ApprovedExecpolicyAmendment` (approve and write this command into policy), `Abort` (deny and stop working).

The clearest statement of its philosophy is `codex/codex-rs/core/src/safety.rs#assess_patch_safety`: a patch auto-approves only when all paths sit inside writable roots **and** a platform sandbox actually exists; without an enforceable sandbox it degrades to AskUser or Reject. "I judge this safe" isn't enough — "I have a mechanism that enforces safe" is. Session-level caching is implemented by `codex-rs/core/src/tools/sandboxing.rs#with_cached_approval`, keyed per approval key into an in-memory store.

### omp: tier ranks against mode ceilings

`oh-my-pi/packages/coding-agent/src/tools/approval.ts#resolveApproval` is the most compact scheme: each tool declares a `ToolTier` (`read` < `write` < `exec`), each mode sets a ceiling (`always-ask` allows read only, `write` up to write, `yolo` everything), and a tool passes when its tier rank ≤ the ceiling. The critical detail: a tool with no approval declaration defaults to tier `exec` — forgetting to classify means maximum alertness, not minimum. User overrides via `tools.approval.<tool>: allow|deny|prompt` beat the mode.

### opencode: rule matching, default ask

`opencode/packages/opencode/src/permission/index.ts#evaluate` matches wildcard rules on permission + pattern with `findLast` (last match wins), and **when nothing matches the default is `{action:"ask"}`**. `index.ts#ask` scans rules first — any pattern hitting `deny` rejects outright without prompting; when asking is needed it creates a pending request, publishes an event, blocks on a Deferred awaiting the reply, and accumulates approved rules into the session's `approved` list.

### pi: the core doesn't care, extensions handle it

pi-mono's core deliberately has no built-in permission system; approval is an extension hook: `pi-mono/packages/coding-agent/examples/extensions/permission-gate.ts` intercepts the `tool_call` event, regexes for `rm -rf`/`sudo`, and pops a `ctx.ui.select` confirm when a UI exists. Its fail-closed branch is the headless one: no UI means `{block:true}` — environments that cannot ask always block.

## What rivumi does differently

Rivumi's answer has three layers: effect classification, injected policy, durable audit.

**Classification is hard.** `rivumi/src/rivumi/approvals.py#ToolEffect` now has read / modify / modify_execute / execute. `tool_transaction` can combine edits and checks into a rollback-capable batch, so it cannot masquerade as plain modify. `TOOL_EFFECTS` declares every built-in, and `#effect_for_tool` raises for an unclassified tool. Native MCP uses `#effect_for_tool_definition`: resource/prompt bridges are read, remote tools default to execute, and only an explicit `readOnlyHint` annotation lowers one to read. Unknown tools and missing trust metadata are never guessed safe.

**Policy is injected.** `#TTYApprovalPolicy` offers four choices: once / session / deny / cancel, where session consent just adds the effect to a grant set; `#HeadlessApprovalPolicy` never reads stdin, so CI cannot hang waiting for input. A denied action becomes a failed `ToolObservation` the model can adapt to; cancellation produces an auditable terminal result.

**Audit lands on disk before projection.** `rivumi/src/rivumi/loop.py#_approval` runs in a fixed order: flip phase to `WAITING_APPROVAL` and save the manifest, emit `approval.requested`; after the decision write `approval.resolved`; session-grant updates land together with an `ApprovalAuditRecord` (request + decision + timestamp) appended to `SessionManifest.approval_history` (`rivumi/src/rivumi/session.py#ApprovalAuditRecord`). Even reusing an existing grant logs `approval.reused`. To reconstruct what the model requested, what the human answered, and what was reused — events.jsonl is the answer.

**Grant scope went through one deliberate narrowing.** In the M2 era a session grant was effect-grained: approve modify once, every later modify passes. When external CLIs arrived in M10, grants became process-local and scoped: `rivumi/src/rivumi/runtime_semantics.py#ProcessLocalGrant`'s docstring says non-persistent, and read access may never be stored as a grant; `#decide_permission` makes `READ_ONLY` mode a hard ceiling — stale grants cannot re-enable side effects after a mode switch. Scope comes from `rivumi/src/rivumi/tui.py#_grant_scope`: external backends get strings like `external_agent:codex-cli`, so consent for codex-cli doesn't cover Claude Code; command grants carry the full argv. The strictest case is Codex file changes: `rivumi/src/rivumi/codex_app_server.py#_file_change_grant_scope` fingerprints the proposed changes with SHA256, so a session grant covers exactly that identical change set and nothing else.

Compared with the five, Rivumi now has user/org/project allow-deny sources, deny-first precedence, and a dangerous-command classifier. It still lacks opencode wildcards or a Codex `exec_policy`-style inspectable, amendable language that covers external CLIs, and it does not universally require a proven sandbox before auto-approval. `--sandbox-checks` and conservative MCP classification are baselines, not a production authorization model.

## Engineering references

No classic paper is titled "how to ask humans," but engineering consensus is clear. [Anthropic's Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) names human-in-the-loop as a core agent pattern: high-risk, irreversible actions need human confirmation checkpoints — and those checkpoints belong in code, not prompts. [OpenAI's official Codex docs](https://developers.openai.com/codex/cli/) treat approval policy and sandbox policy as two independent dimensions users compose — "whether to ask" and "whether you can block" complement rather than substitute for each other. [Claude Code's permissions documentation](https://docs.claude.com/en/docs/claude-code/iam) describes the same layering: modes, per-tool rules, and settings hierarchies evolve independently. [opencode's permissions docs](https://opencode.ai/docs/permissions/) make the `allow / ask / deny` tri-state a public contract.

## What could improve

1. **Extend existing rules across external CLIs.** The native path has classification and allow/deny layering but no general shell; external CLIs own their command loops. The next step is a policy bridge into those runtimes, not another native classifier.
2. **A human-readable approval history view**: the audit trail already sits in events.jsonl, but there's no UI to replay it.
3. **A rule language**: not urgent until real usage proves always-asking is too annoying, but opencode's findLast-wins semantics are worth copying — simple, predictable, default ask.

## References

- [Building Effective Agents — Anthropic Engineering](https://www.anthropic.com/engineering/building-effective-agents)
- [OpenAI Codex CLI official documentation](https://developers.openai.com/codex/cli/)
- [Claude Code IAM & permissions documentation](https://docs.claude.com/en/docs/claude-code/iam)
- [opencode Permissions documentation](https://opencode.ai/docs/permissions/)
- [openai/codex (GitHub)](https://github.com/openai/codex)
- [sst/opencode (GitHub)](https://github.com/sst/opencode)
- [badlogic/pi-mono (GitHub)](https://github.com/badlogic/pi-mono)
- [can1357/oh-my-pi (GitHub)](https://github.com/can1357/oh-my-pi)
- [Rivumi approval classification at fixed commit `2ed5efb`](https://github.com/vincentxuu/rivumi/blob/2ed5efb94cb1f344f8b360256fd6b4aae60fe34c/src/rivumi/approvals.py)
