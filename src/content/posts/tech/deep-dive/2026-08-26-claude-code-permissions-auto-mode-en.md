---
title: "How Much Autonomy to Give Claude Code: Permission Modes, the Auto Mode Classifier, and Allow/Deny Rules"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, permissions, auto-mode]
lang: en
tldr: "Claude Code ships six permission modes; day to day you cycle Manual, Accept edits, Plan, and Auto with Shift+Tab. On Pro/Max/Team plans, eligible interactive terminal and VS Code sessions start in auto mode by default, with a background classifier reviewing most actions and blocking force pushes, `curl | bash`, production deploys, and more by default. This post covers the four-mode spectrum, permission rule syntax, and organization-level trust config."
description: "From prompting on every step to prompting on none: how Claude Code's four main permission modes differ, what the auto mode classifier blocks by default, how allow/deny/ask rules work, and what managed settings control at the org level."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 7
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-permissions-auto-mode)

The [series entry point](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en) described checkpoints and permission modes as Claude Code's two safety rails. This post expands the second one. It resolves a dilemma: ask about every action and long tasks drown you in prompts; ask about nothing and you have handed over your filesystem and terminal wholesale. Permission modes are the scale between those two extremes.

## The four-mode spectrum

Press `Shift+Tab` to cycle through modes; the status bar shows where you are. The official docs list six values, but four cover daily use:

| Mode (config value) | What runs without asking | Best for |
|------|------|------|
| Manual (`default`) | Reads only | Sensitive work, unfamiliar codebases |
| Accept edits (`acceptEdits`) | Reads, file edits, common filesystem commands (`mkdir`, `touch`, `mv`, `cp`, `sed`, etc.), within the working directory | Iterating while reviewing via git diff after the fact |
| Plan (`plan`) | Reads and exploration; when auto mode is available, classifier-approved commands can run, while edits stay blocked until you approve a plan | Understanding a codebase before touching it |
| Auto (`auto`) | Nearly everything, but each action passes a background classifier first | Long tasks, reducing prompt fatigue |

The other two are edge cases. `dontAsk` never appears in the Shift+Tab cycle; it only runs pre-approved tools, built for locked-down CI allowlists. `bypassPermissions` skips routine permission prompts, but explicit ask rules, user-interaction tools, critical-path removals, cross-session messaging safeguards, and a few other documented checks can still prompt or block — that mode deserves its own article, linked at the end.

A few details worth knowing: the UI label is Manual but the config value is `default`; the CLI also accepts `manual` as an alias. An `auto` value in a project's `.claude/settings.json` does not take effect — it belongs in `~/.claude/settings.json`. Writes to protected paths such as `.git` and `.claude` are usually not auto-approved, except in `bypassPermissions` and in some plan-mode sessions where bypass permissions are available.

## How auto mode works

Auto mode is not "no checks" — it swaps the reviewer from you to a separate **classifier model**. Most tool calls go through classifier-backed checks before they run, blocking anything that escalates beyond your request, targets unrecognized infrastructure, or looks driven by hostile content Claude read; interaction tools, explicit ask rules, and other safeguards still follow their own prompt or denial paths. On Pro/Max/Team plans it has been the built-in starting mode for interactive sessions since v2.1.228 (v2.1.233 on native Windows); the first session that starts in auto mode shows a notice linking to the docs.

The classifier ships with a long default block list, including:

- Download-and-execute (`curl | bash`) and sending sensitive data to external endpoints
- Production deploys and migrations, mass deletion on cloud storage, granting IAM or repo permissions
- Force push, `git reset --hard` and other operations that discard uncommitted changes, `terraform destroy`
- Commits or pushes whose changes would send secrets outside the repository when they run

Allowed by default: local file operations in your working directory, installing dependencies declared in lock files or manifests, reading `.env` and sending credentials to their matching API, read-only HTTP requests, and pushing to any branch of the repository you're working in. Run `claude auto-mode defaults` to print the full lists.

Inside the classifier, precedence runs in four tiers: `hard_deny` blocks unconditionally (user intent and exception rules don't apply) → `soft_deny` can be overridden by explicit user intent ("clean up the repo" does not authorize a force push; "force-push this branch" does) → `allow` rules act as exceptions to soft blocks → everything else passes. And `permissions.deny` is evaluated *before* the classifier — it applies in **every** mode including bypassPermissions, making it the hardest boundary.

The key warning in the official docs is that auto mode “does not guarantee safety.” Use it for tasks where you trust the general direction, not as a replacement for review on sensitive operations.

## Fine-tuning with permission rules

Modes set the baseline; [permission rules](https://code.claude.com/docs/en/permissions) handle individual cases on top. Rules follow `Tool` or `Tool(specifier)` format and come in three kinds — allow (no prompt), ask (always prompt), deny (blocked). Evaluation order is fixed: deny → ask → allow, and no amount of specificity changes it:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git commit *)"
    ],
    "ask": ["Bash(gh pr create *)"],
    "deny": ["Bash(git push *)", "Read(./.env)", "WebFetch(domain:evil.example)"]
  }
}
```

Syntax notes: put `*` after the subcommand — `Bash(git log *)` allows only git log commands, while `Bash(git *)` allows every git operation. `Read` and `Edit` rules use gitignore syntax, and a single `Read(./.env)` deny also blocks editing and creating files at that path. A bare tool-name deny like `"WebFetch"` removes the tool from Claude's context entirely. Most importantly, **an explicit ask rule forces a prompt even in auto mode** — "full autonomy everywhere else, but every push goes through me" is exactly what it's for.

## Governance at the organization level

Above personal preference sits a fourth layer: managed settings. Administrators set `permissions.defaultMode` there for a uniform starting mode, or set `permissions.disableBypassPermissionsMode` / `permissions.disableAutoMode` to `"disable"` to remove those modes outright — a removed `auto` disappears from Shift+Tab too, and a session started with `--permission-mode auto` falls back to Manual.

Auto mode has its own trust config: the [`autoMode`](https://code.claude.com/docs/en/auto-mode-config) settings block. The key concept is `autoMode.environment`. By default the classifier trusts only the working directory and the repo's configured remotes; pushing to another company repo or writing to a team cloud bucket gets blocked until you list which repos, buckets, and domains are trusted, in natural language. Project conventions and behavioral boundaries should start in the `CLAUDE.md` content Claude already loads, because the classifier reads that memory too.

```json
{
  "autoMode": {
    "environment": [
      "$defaults",
      "Source control: github.example.com/acme-corp and all repos under it",
      "Trusted internal domains: *.corp.example.com"
    ]
  }
}
```

One piece of security design stands out: the classifier does **not** read `autoMode` from project-level `.claude/settings.json` or `.claude/settings.local.json`. Only user settings, managed settings, and the `--settings` flag count — because files inside a project directory may come from a checked-in repo, and a repo must not be able to expand its own trust boundary. Individual developers can add entries but cannot remove ones managed settings provide. For boundaries that must never be crossed regardless, fall back to `permissions.deny` in managed settings.

## How to choose

My actual usage: Plan first on unfamiliar codebases, then switch to Accept edits once I understand the terrain. Trusted projects and long tasks go straight to Auto with a `Bash(git push *)` ask rule as the human checkpoint. For anything a rewind can't undo — payments, database migrations — back to Manual. Auto mode's classifier substantially lowers the risk of autonomy, but what it lowers is the risk of *accidents*, not of the things you shouldn't have handed over anyway.

If your instinct is "why bother with grades — just turn everything off," that is the world of `--dangerously-skip-permissions`. Before taking that road, read the [cost analysis of bypassing all permission prompts](/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions-en) ([中文版](/posts/tech/2026-03-16-claude-code-dangerously-skip-permissions)) — that post covers the far end of this spectrum.

## References

- [Choose a permission mode — Claude Code Docs](https://code.claude.com/docs/en/permission-modes.md) — behavior comparison across the six modes, Shift+Tab cycling details, the classifier's default block and allow lists
- [Configure permissions — Claude Code Docs](https://code.claude.com/docs/en/permissions.md) — allow/ask/deny rule syntax, wildcard matching rules, evaluation order
- [Configure auto mode — Claude Code Docs](https://code.claude.com/docs/en/auto-mode-config.md) — `autoMode.environment` trust config, hard/soft deny tiers, managed-settings controls
- [Settings — Claude Code Docs](https://code.claude.com/docs/en/settings.md) — settings scopes, managed settings, and sources for keys such as `permissions.defaultMode`

## Update log

- 2026-08-26: Initial version, written against the August 2026 official docs (auto mode as the Pro/Max/Team default starting mode; Manual label requires v2.1.200+).
- 2026-08-29: Added `bypassPermissions` exceptions, protected-path exceptions, plan-mode command behavior, full settings key prefixes, and the role of `CLAUDE.md` in steering the auto mode classifier.
