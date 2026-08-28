---
title: "Claude Code in the Cloud: on the web, --cloud/--teleport, and Steering from Mobile"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, claude-code-web, cloud, teleport, mobile]
lang: en
tldr: "Claude Code on the web runs tasks in cloud environments, Anthropic-managed VMs by default or self-hosted environments when routed there: authorize GitHub, dispatch from browser or mobile, start cloud sessions with --cloud, and pull them back local with --teleport. Research preview on Pro/Max/Team; no separate compute charge, but rate limits are shared."
description: "Deep dive into Claude Code's cloud execution: the web dispatch flow, two GitHub auth paths, the one-way nature of --cloud and --teleport, auto-fix PRs, security isolation, self-hosted boundaries, and how the mobile app fits in."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 38
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-on-the-web)

The previous post covered [Remote Control](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide-en): the program runs on your machine, the browser is just a remote. This post covers the other half — **cloud execution**, where the code never runs on your machine at all. Both share the claude.ai/code interface; the difference is where the session executes. Drawing that boundary precisely is this post's main job.

## Current status

Claude Code on the web is a **research preview** for Pro, Max, and Team plans (Enterprise needs premium seats or Chat + Claude Code seats). Tasks run in cloud environments: Anthropic-managed VMs by default, or your organization's own runners when routed to a self-hosted environment. Sessions survive closing your browser; the Claude mobile app can monitor and steer from anywhere.

Start with what it's good at — the official quickstart names four scenarios:

- **Parallel tasks**: each `--cloud` command gets its own session and branch, no worktree juggling
- **Repos you don't have locally**: the cloud clones fresh every session, no checkout needed
- **Tasks that don't need frequent steering**: describe well, submit, come back to review
- **Code exploration**: understand a codebase without setting up a local environment

Work that needs your local config, tools, or MCP servers can't run there — that territory belongs to [local execution or Remote Control](/posts/tech/deep-dive/2026-03-28-claude-code-remote-control-guide-en).

## GitHub authorization: two paths

Cloud sessions need to clone repos and push branches. Two ways to authorize:

| Method | How | Best for |
|--------|-----|----------|
| GitHub App | Install during claude.ai/code onboarding | Browser onboarding; teams wanting auto-fix PRs |
| `/web-setup` | Run in terminal; syncs your local `gh` CLI token to your Claude account | Individual developers already using `gh` |

Know the scope: either way, a cloud session can access **every repository the connected GitHub account can see** — not just repos where the Claude App is installed. Installing the App enables PR webhooks (required for auto-fix); it is not session-level access control. To restrict access, restrict it on GitHub itself. Also note: Zero Data Retention (ZDR) organizations can't use `/web-setup` or other cloud session features.

First connection creates or prompts you to create a cloud environment named **Default**: CLI `/web-setup` and Pro/Max web onboarding usually create it automatically; Team/Enterprise may show a creation form unless an Owner enables Quick web setup. Default has Trusted network access — common package registries, GitHub, cloud SDKs, and other allowlisted domains, nothing else. Environments are editable: network level, environment variables, and a setup script that runs before sessions start. The script has roughly a five-minute budget for building the environment cache; heavy work belongs in a SessionStart hook running in the background.

## Terminal to cloud: `--cloud`

```bash
claude --cloud "Fix the authentication bug in src/auth/login.ts"
```

This starts a new cloud session. The critical detail: **the VM clones your current branch from the GitHub remote, not your local checkout** — push local commits first. The older `--remote` spelling still works as a deprecated alias.

There's also a fallback: with no GitHub connection, `claude --cloud` bundles your local repo and uploads it directly (full history plus uncommitted changes to tracked files, but not untracked files), capped at 100 MB — beyond that it degrades to current-branch-only, then to a single squashed snapshot. Bundled sessions can't push back without GitHub auth configured. `CCR_FORCE_BUNDLE=1` forces this path.

For an already-running cloud session, you can send follow-ups from any machine logged into the same account:

```bash
claude -p "add tests while you're at it" --cloud <session-id>
```

This queues the message and exits (printing the session ID and link); it can run from any machine logged into the same account and sends no local session state. Without `-p`, your terminal attaches interactively — still rolling out gradually. Note the directionality: **the CLI can only pull cloud sessions back (teleport), never push an existing local session to the web** (the Desktop app's Continue in menu is the exception). And `--cloud` is completely unrelated to `--remote-control` — the docs call this out explicitly.

## Cloud to terminal: `--teleport`

```bash
claude --teleport            # interactive picker
claude --teleport <session-id>
```

Teleport is also available through `/teleport`/`/tp` inside the CLI, `t` from the `/tasks` list, **Open in > Terminal** in the web UI, or `/teleport` inside the cloud session to print the exact command. It verifies four things: clean git state (it prompts you to stash otherwise), a checkout of the same repository (forks rejected), the cloud session's branch pushed to the remote, and the same claude.ai account. Then it fetches and checks out the branch and loads the full conversation history.

The most-misunderstood part: **after teleporting, your terminal has its own copy** — new work stays local and does not sync back to the cloud session. To keep steering from your phone, start `/remote-control` on the local session afterward. It's also distinct from `--resume`: `--resume` reopens local history; `--teleport` pulls a cloud session along with its branch.

## Mobile: one app, three entries

The Claude app (iOS/Android) is not "Claude Code for phones" — it's a client, and where the code runs depends on which entry you use:

| Entry | Connects to | When |
|-------|-------------|------|
| Claude Code on the web | A cloud session, Anthropic-managed by default | Repo on GitHub; task should outlive your phone being put away |
| Remote Control | A session on your computer | Work needs your local filesystem, tools, or MCP servers |
| Dispatch | The Desktop app | Message a task and let it decide how to run (Pro/Max only) |

Permission modes have boundaries here too: cloud sessions offer Accept edits / Plan / Auto only; Remote Control sessions offer Manual / Accept edits / Plan — **Bypass permissions is unavailable in both**, and Auto isn't available for Remote Control.

## Auto-fix PRs: Claude watches your pull request

When enabled, Claude subscribes to the PR's GitHub events: on CI failures or review comments it investigates and pushes a fix when one is clear. Enable via the web session's CI status bar, `/autofix-pr` on the PR's branch in your terminal, asking from your phone, or pasting a PR URL into any session. Prerequisite: the Claude GitHub App installed on the repo.

The behavior model matters: confident fixes get made and explained; ambiguous or architecturally significant comments trigger a question first; duplicate events get noted and skipped. It may reply to review threads using your GitHub account — each reply labeled as coming from Claude Code, but appearing under your username. One official warning: if your repo runs comment-triggered automation (Atlantis, Terraform Cloud, anything on `issue_comment`), Claude's replies can set it off. Think twice for such repos.

Auto-fix can't react to merge conflicts caused by the base branch advancing — GitHub emits no webhook for that; ask Claude to rebase manually.

## Security and cost

Three isolation layers in Anthropic-hosted environments: one isolated VM per session; network access governed by the environment (restricted by default, disableable entirely); sensitive credentials like git credentials **never enter the sandbox** — authentication goes through a secure proxy with scoped credentials. In self-hosted environments, runner isolation, network boundaries, and credential injection are your deployment's responsibility.

On cost: the cloud VM carries **no separate compute charge**, but consumption draws from the rate limits shared with all your Claude usage — parallel tasks eat proportionally more. Organization IP allowlists block every Anthropic-hosted cloud session (the API is called from Anthropic's network, not yours) — self-hosted environments exist for exactly this case and belong to the enterprise sub-series, not covered here.

## Choosing between cloud and Remote Control

One sentence: **where the work must run decides which you use**. Mid-task departure from your desk, or local environment needed — Remote Control. Repo on GitHub, zero-setup dispatch, or parallel fan-out — on the web. The official comparison table reduces to three rows: where code runs, whether your local config applies, and whether the session survives disconnection.

## Takeaways

The conceptual load sits on two directional facts: `--cloud` only creates new (cloning the remote, not your local; bundle fallback excludes untracked files), and `--teleport` only pulls back (creating a fork that no longer syncs). Remember those, plus "GitHub App installation ≠ access control" and "Anthropic-hosted VM free, rate limits shared," and everything else is table lookup.

## References

- [Use Claude Code on the web — Claude Code Docs](https://code.claude.com/docs/en/claude-code-on-the-web) — full `--cloud`/`--teleport` semantics, GitHub auth, bundle fallback, auto-fix PRs, security and limitations
- [Get started with Claude Code on the web](https://code.claude.com/docs/en/web-quickstart) — onboarding, Default environment, Trusted network level, self-hosted boundary, comparison table
- [Configure cloud environments](https://code.claude.com/docs/en/cloud-environments) — Default environment creation rules, network levels, setup scripts, proxies, and what cloud sessions include
- [Claude Code on mobile — Claude Code Docs](https://code.claude.com/docs/en/mobile) — three-entry positioning, mobile permission mode boundaries
- [Continue local sessions with Remote Control](https://code.claude.com/docs/en/remote-control) — the local counterpart (series post G4)

## Changelog

- 2026-08-26: Initial version, written against the August 2026 docs (research preview status).
