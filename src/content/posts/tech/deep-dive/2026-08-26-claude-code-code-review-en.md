---
title: "How Claude Code Reviews Your PRs: Multi-Agent Analysis, REVIEW.md, and ultrareview"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, code-review, github, ci]
lang: en
tldr: "GitHub PRs get reviewed by a fleet of agents automatically — 20 minutes on average, about $15–25 per review, with findings posted as inline comments on the offending lines. For larger changes, /code-review ultra launches a cloud deep review that reports independently verified bugs in 5–10 minutes at roughly $5–25 per run; Pro/Max plans include 3 free runs."
description: "How Claude Code's GitHub PR review works: the multi-agent parallel analysis and verification pipeline, severity levels, @claude review triggers, REVIEW.md customization, and when a cloud ultrareview is worth it."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 20
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-code-review)

Among all the automations [Claude Code](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) enables, code review has the most reliable return on investment: fixed input (a diff), verifiable output (findings you can check against the code), and a need on every single PR. This post covers its two review paths — Code Review, the managed service attached to GitHub pull requests, and the `/code-review` command that runs in your own session plus its deeper cloud version, `/code-review ultra` (ultrareview). Both are in research preview as of this writing; everything below follows the official docs.

## Why code review suits an agent

Three structural reasons. First, an agent reads completely: human reviewers usually judge from the diff alone, while an agent can put changes back into the context of the whole codebase — who calls this function, what other code assumes about this field — so it catches cross-file regressions. Second, it is immune to mood and time pressure: a PR pushed at 5pm gets exactly the scrutiny of one pushed at 10am, with no benefit of the doubt from "you did this last time too." Third, it runs on every PR: human attention is scarce and missed reviews are normal; the agent's value is turning "someone looks at every PR" from an aspiration into the default.

The costs are false positives and money — each gets its own section below.

## Starting from the GitHub App: setup and triggers

Code Review is a managed service on Anthropic's infrastructure. During research preview it requires Team or Enterprise plans; organizations with Zero Data Retention enabled cannot use it. Setup is done by an Owner: install the Claude GitHub App from claude.ai/admin-settings/claude-code, select the repositories to review, then pick a trigger behavior per repo:

| Behavior | When it runs |
|----------|--------------|
| Once after PR creation | Once, when the PR opens or is marked ready for review |
| After every push | On every push, auto-resolving threads once flagged issues are fixed |
| Manual | Only when someone comments `@claude review` |

Manual comment commands work in any mode: `@claude review` starts a single review; `@claude review always` subscribes the PR to reviews on every subsequent push. Note that before the July 2026 update, bare `@claude review` also subscribed — you now have to write `always`. The command must be a top-level comment starting the message, and the PR must be open. Draft PRs can be triggered manually, since an explicit request means you want the review now.

Pricing is token-based, averaging $15–25 per review, billed separately through usage credits rather than your plan's included usage; you can set a monthly spend cap in admin settings. After every push multiplies cost, so high-traffic repos should start in Manual mode and opt important PRs in with `@claude review always`.

## How the multi-agent analysis works

When a review runs, multiple agents analyze the diff and surrounding code in parallel on Anthropic infrastructure, each looking for a different class of issue. A verification step then checks candidate findings against actual code behavior to filter out false positives. Results are deduplicated, ranked by severity, and posted as inline comments on the specific lines where issues were found, with a summary in the review body. When nothing is found, the check run says so. Reviews complete in 20 minutes on average.

Findings come in three severity levels:

| Marker | Severity | Meaning |
|--------|----------|---------|
| 🔴 | Important | A bug that should be fixed before merging |
| 🟡 | Nit | A minor issue worth fixing but not blocking |
| 🟣 | Pre-existing | A bug already in the codebase, not introduced by this PR |

Each finding includes a collapsible extended-reasoning section explaining why it was flagged and how Claude verified the problem exists. Every comment ships with 👍👎 pre-attached; Anthropic collects reactions after merge and uses them to tune the reviewer.

One common misunderstanding: it **does not block merges**. The check run always completes with a neutral conclusion, so branch protection rules are never tripped. If you want your own CI to gate on severity counts, the official docs show how to parse the check run output with `gh` and jq.

## Ultrareview: deep review in the cloud

`/code-review` already works locally: it runs as a background subagent without filling your conversation context, takes an effort level from `low` to `max` to trade coverage against confidence, and applies fixes directly with `--fix`. When a change is substantial enough to warrant something deeper, add `ultra`:

```text
/code-review ultra
```

Ultrareview launches a fleet of reviewer agents in a remote sandbox on Claude Code on the web infrastructure. The key difference: **every reported finding is independently reproduced and verified**, so results concentrate on real bugs rather than style suggestions. Before launching, a confirmation dialog shows the review scope, your remaining free runs, and the estimated cost. Reviews typically take 5 to 10 minutes; you can keep using your session or even close the terminal, tracking progress later with `/tasks`.

A few practical boundaries:

- Requires signing in with a claude.ai account; Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, and ZDR-enabled organizations cannot use it — `/code-review ultra` falls back to a local review in those cases.
- Diffs have size limits: up to 500 changed files and 8,000 changed lines by default. If your repo is too large to bundle, push the branch, open a draft PR, and use PR mode — the remote sandbox clones directly from GitHub instead of uploading your local working tree.
- Billing goes through usage credits: Pro and Max get a one-time allotment of 3 free runs, then roughly $5–25 per review; Team and Enterprise get no free runs. In CI or scripts, use the `claude ultrareview` subcommand, which blocks until findings print to stdout.

What scale justifies it? The official comparison table draws the line clearly: `/code-review` is for fast feedback while iterating, taking seconds to a few minutes; ultra is for "pre-merge confidence on substantial changes." Running ultra on a one-line fix wastes money; refactors spanning many files, authentication logic changes, and migrations — the changes that hurt most when broken — justify the $5–25 and ten minutes. You can also point it at a teammate's PR number to review before approving.

## Reading the findings: tuning your reviewer

After findings arrive, replying to an inline comment does nothing — fix the code and push instead; if the PR is subscribed to push-triggered reviews, the next run resolves threads automatically once issues are fixed.

The longer game is reducing noise. Code Review reads two files from your repo: violations of `CLAUDE.md` are reported at nit level (bidirectionally — if your change makes part of CLAUDE.md outdated, it flags the docs too), while `REVIEW.md` carries review-only instructions with stronger influence. Tuning that works in practice: recalibrate what Important means for your repo, cap nit volume (say five per review, mention the rest in the summary), skip generated code and lockfiles, and require `file:line` citations for behavior claims before they post. Keep REVIEW.md short — length dilutes the rules that matter.

## Division of labor with GitHub Actions automation

Managed Code Review covers the "every PR gets looked at" layer. Putting Claude inside your own workflow — custom triggers, tasks beyond review — is the territory of the [GitHub Actions post](/posts/tech/deep-dive/2026-03-28-claude-code-ci-cd-github-actions); the two don't compete.

## References

- [Code Review — Claude Code Docs](https://code.claude.com/docs/en/code-review) — setup, triggers, multi-agent pipeline, severity definitions, pricing, and the local `/code-review` command
- [Find bugs with ultrareview — Claude Code Docs](https://code.claude.com/docs/en/ultrareview) — how `/code-review ultra` works, diff limits, free runs and pricing, and the comparison table with the local review

## Changelog

- 2026-08-26: Initial version, based on official docs as of August 2026 (both Code Review and ultrareview are in research preview).
