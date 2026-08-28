---
title: "Delegating Coding Tasks from Slack: Claude Code in Slack and Claude Tag"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, slack, team-collaboration, ai-agent]
lang: en
tldr: "A single @Claude in Slack turns a bug report into a cloud-run Claude Code session. But there are now two paths: Pro/Max stays on the original Claude Code in Slack (each session runs under an individual account), while new or migrating Team/Enterprise setups should look at Claude Tag (shared org identity, admin-configured access and spend). Check your plan before setting anything up."
description: "A guide to Claude Code's Slack integration: setup, routing modes, and session flow for the original Claude Code in Slack, plus Claude Tag for Team/Enterprise workspaces — with a side-by-side comparison of both paths and their limitations."
draft: false
series:
  name: "Claude Code Deep Dives"
  order: 29
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration)

Bug reports don't arrive in a terminal — they arrive in a Slack channel: a teammate pastes reproduction steps, error screenshots pile up, half a day of context accumulates in a thread. The highest-value move at that moment isn't copying it all into your terminal; it's typing `@Claude` right in that thread with "investigate and fix this," and letting it spin up a Claude Code session in the cloud and report back. This is the same agentic loop from the [series entry post](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works) with a different entry point — same loop, new trigger: team conversation instead of terminal.

But this is now more complicated: Anthropic [is retiring the original Claude Code in Slack for Team and Enterprise workspaces](https://code.claude.com/docs/en/slack) in favor of a separate product line, **Claude Tag**. Before you configure anything, figure out which plan you're on — the two paths have completely different setup procedures and permission models.

## First, which plan are you on?

The official docs draw the line clearly:

- **Pro / Max** (individual plans): [Claude Tag isn't available](https://code.claude.com/docs/en/claude-tag), so the original Claude Code in Slack **remains the current setup path**.
- **Team / Enterprise**: new Slack workflows should look at [Claude Tag](https://claude.com/docs/claude-tag/overview), while the earlier version is being retired. Your existing Slack app and `@Claude` handle stay in place, and your Anthropic account team can tell you the exact cutover date.

The quickest check is your plan page on claude.ai. If the "setup steps" below keep failing, first confirm whether your workspace has already been switched to Claude Tag.

## Path one: Claude Code in Slack (Pro/Max)

### Five setup steps

1. **Install the app**: a workspace administrator goes to the [Slack App Marketplace](https://slack.com/marketplace/A08SF47R6P4) (app ID `A08SF47R6P4`) and clicks "Add to Slack".
2. **Connect your account**: open Claude from the Apps section in Slack, go to the App Home tab, click "Connect", and complete authentication in your browser.
3. **Configure Claude Code on the web**: sign in at [claude.ai/code](https://claude.ai/code) with the same account, connect GitHub, and authenticate at least one repository. Skipping this step gets you "Claude Code is not enabled for your account" — that's not a permissions issue; your account just has no cloud environment yet, and one sign-in creates it.
4. **Choose a routing mode**: Routing Mode in App Home has two options — **Code only** sends every @mention to Claude Code; **Code + Chat** lets Claude decide whether each message is a coding task or general Q&A, and if it guesses wrong you can hit "Retry as Code" in that thread.
5. **Invite it to channels**: installing the app adds Claude to no channels automatically. Type `/invite @Claude` in the channel you want. It only works in channels (public or private), not DMs.

### What it looks like in practice

After you @Claude with a coding task in a channel or thread: it gathers context (the whole thread when mentioned inside one; recent channel messages otherwise), picks a repository automatically, opens a session on claude.ai/code, and posts progress back to Slack. When done it @mentions you with a summary and action buttons: "View Session" for the full transcript, "Create PR" to open a pull request directly, "Change Repo" if it picked the wrong repository.

The security model is **user-level**: every session runs under your own Claude account, counts against your individual plan limits, and can only touch repositories you personally connected.

The official docs also give a practical split for choosing the entry point: use Slack when the context already lives in a Slack discussion, when you want to kick off work asynchronously, or when teammates need visibility; use the web directly when you need file uploads, real-time back-and-forth during development, or a longer and more complex task.

## Path two: Claude Tag (Team/Enterprise)

[Claude Tag](https://claude.com/product/tag) is a Public Beta Slack product line: `@Claude` works in channels as your **organization's shared identity**, not anyone's personal account; access is configured centrally by admins; and anyone in a channel can tag it into a thread and assign it a task.

For workspaces already using the earlier version, the migration doc lives on claude.com ("Migrate from the earlier Claude in Slack"). The admin-level shift is that access moves from "each person manages their own setup" to "the organization configures the shared setup": who can use it, which repositories it can reach, and organization-visible session ownership are all admin concerns. Channel and thread work also draws from the organization's usage balance and spend limit instead of an individual's quota; DMs are the exception, because they still run on the sender's own claude.ai account and limits.

One pitfall to know upfront: if sessions in a Claude Tag channel keep failing, the channel's cloud environment was probably created under someone's **personal** account — Claude Code fails the session immediately and retrying doesn't help. The fix is for an Owner to recreate it as an **organization-shared environment** on the Cloud environments page in admin settings, then set it as the org default or assign it to that channel.

## How the two paths differ

| | Claude Code in Slack | Claude Tag |
|---|---|---|
| Plans | Pro / Max | Team / Enterprise |
| Identity behind @Claude | Individual user account | Organization shared identity |
| Access control | Each user connects repos, pays own quota | Admin-configured; channel work uses organization spend |
| Session ownership | Personal history (claude.ai/code) | Visible to the organization |
| Status | Current path for individual plans | Current approach for Team/Enterprise |

One-line summary: individuals take path one, teams with centralized management take path two. The difference isn't feature count — it's **who owns the identity and permissions**.

## Limitations and caveats

Three hard limits: repositories must be on GitHub; each session can create one PR; and users need Claude Code on the web access, without which Claude falls back to standard chat replies.

One warning worth remembering comes from the docs themselves: when invoked, Claude reads the conversation context to understand the task and may follow directions from other messages in it — so only use it in trusted Slack conversations. It's the same risk every agent entry point carries: the easier the entry point, the larger the prompt injection surface.

Slack is one of Claude Code's surfaces; its browser-side sibling is covered in the [Chrome integration post](/posts/tech/deep-dive/2026-03-28-claude-code-chrome-integration). For comparing other automation triggers (GitHub Actions, scheduling), see the upcoming automation cluster in this series.

## References

- [Claude Code in Slack — Claude Code Docs](https://code.claude.com/docs/en/slack) — Setup steps, routing modes, session flow, permission model, plus the Team/Enterprise retirement notice and troubleshooting
- [Claude Tag — Claude Code Docs](https://code.claude.com/docs/en/claude-tag) — Claude Tag product positioning, eligible plans, and entry point to the full claude.com documentation
- [Work with Claude Tag — Claude.ai Documentation](https://claude.com/docs/claude-tag/overview) — Public Beta status, Team/Enterprise availability, channel access, usage balance, and spend limits

## Changelog

- 2026-08-29: Review update: corrected Team/Enterprise transition wording and added the Claude Tag beta, organization spend, and DM boundaries.
- 2026-08-26: Initial version, written against the August 2026 official docs (Team/Enterprise retiring the earlier version and directed to Claude Tag; Pro/Max keeps the original path).
