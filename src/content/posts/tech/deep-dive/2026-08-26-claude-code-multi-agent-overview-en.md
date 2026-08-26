---
title: "How to Choose Claude Code's Multi-Agent Options: Subagents, Agent View, Agent Teams, Dynamic Workflows"
date: 2026-08-26
type: deep-dive
category: tech
tags: [claude-code, multi-agent, subagents, worktree]
lang: en
tldr: "The official docs split Claude Code's parallel work into 4 approaches: subagents delegate inside one session, agent view lets you supervise background sessions yourself, agent teams coordinate workers through a lead, and dynamic workflows run scripted fleets of subagents with cross-checks; file collisions are always handled by worktrees. Includes a translated comparison table and a three-question decision guide."
description: "Built on the official agents.md comparison table: how Claude Code's four parallel-work approaches differ, how to choose between them, and the worktree isolation story — --worktree, .worktreeinclude, and cleanup rules."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 24
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview)

A single Claude Code session running start to finish is the normal case. But when a task gets big — fixing three unrelated bugs at once, an audit that sweeps the whole repo, splitting up a 500-file migration — one thread starts to strain. This is the overview post for the multi-agent cluster: what each of the four officially recognized approaches actually gives you, how to choose, and finally the one thing no choice escapes — parallel work needs worktrees to avoid file conflicts. The mechanics of a single subagent are already covered in [the previous post](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution-en); I won't repeat them here.

## The four approaches

The official [Run agents in parallel](https://code.claude.com/docs/en/agents) page puts all four side by side. One premise applies to every approach: **the workers are all Claude sessions**. To bring a different tool in, expose it to Claude as an MCP server.

**Subagents**: delegated workers inside one session. Claude hands a side task off into its own context window and only a summary comes back to the main conversation. Use it when the side task would produce output you'll never reference again — search results, logs, whole file contents.

**Agent view**: a single monitoring screen opened with `claude agents`. You are the dispatcher: hand off multiple independent tasks to run in the background, check status at a glance, step in only where needed. Currently a research preview.

**Agent teams**: multiple coordinated sessions managed by a lead, with a shared task list and point-to-point messaging between teammates. Experimental, disabled by default. For when you want Claude itself to split a project into pieces, assign them, and keep everyone in sync.

**Dynamic workflows**: a script that runs many subagents and cross-checks their results. The official positioning is concrete: work too big to coordinate one turn at a time, or that needs more than a single pass — a codebase-wide audit, a 500-file migration, research verified against itself from several angles.

The same page draws clear boundaries: a background bash command merely avoids blocking the conversation, it doesn't spawn an agent; a forked subagent inherits your full conversation context but isn't a separate surface; a routine runs on a cloud schedule, solving "when" rather than "how to parallelize". Three support tools don't count as approaches on their own but pair well with these: worktrees (file isolation, see below), cross-session messaging (letting your own sessions talk to each other), and the `/batch` skill (splits one large change into 5–30 worktree-isolated subagents that each open a PR — packaging of the first two, not a new coordination style).

## The official comparison table

Translated from the official docs:

| Approach | What it gives you | Use it when |
|----------|-------------------|-------------|
| [Subagents](https://code.claude.com/docs/en/sub-agents) | Delegated workers inside one session doing side tasks in their own context, returning summaries | A side task would flood your main conversation with search results, logs, or file contents |
| [Agent view](https://code.claude.com/docs/en/agent-view) | One screen opened via `claude agents` to dispatch and monitor background sessions | Several independent tasks; hand them off, check status at a glance, step in when needed |
| [Agent teams](https://code.claude.com/docs/en/agent-teams) | Multiple coordinated sessions with a shared task list and messaging, managed by a lead | You want Claude to split the project, assign pieces, and keep workers in sync |
| [Dynamic workflows](https://code.claude.com/docs/en/workflows) | A script running many subagents with cross-checked results | Work outgrows a handful of subagents, or findings must verify against each other |

## How to choose

The official decision guide asks three questions; here they are in plain terms:

**Who coordinates?** Claude delegates and collects results inside one conversation — subagents. You hand off independent tasks and check back later — agent view. Claude plans and supervises a group of workers — agent teams (remember it's experimental). A script holds the plan instead of Claude's turn-by-turn judgment — dynamic workflows.

**Do the workers need to talk to each other?** Subagents report back only to the conversation that spawned them; agent view sessions report only to you (add cross-session messaging if separate sessions need to exchange findings); only teammates in an agent team message each other directly over a shared task list.

**Will tasks touch the same files?** If yes, isolate with worktrees (next section). Note especially: agent teams do not put teammates in their own worktrees — the official recommendation is to partition the work yourself so each teammate owns a different set of files.

## Worktree isolation: --worktree, .worktreeinclude, cleanup

A [git worktree](https://git-scm.com/docs/git-worktree) is a working directory with its own files and branch, sharing the same repository history as your main checkout. Claude Code wraps it in one flag:

```bash
claude --worktree feature-auth   # or -w
```

By default this creates the worktree under `.claude/worktrees/<name>/` on a branch named `worktree-<name>`; omit the name and one is generated (like `bright-running-fox`). Run it again with a different name in another terminal for a second isolated session. Two small tips from the docs: add `.claude/worktrees/` to your `.gitignore`, and note that interactive runs require workspace trust — accept the dialog once before `--worktree` will proceed.

**A worktree is a fresh checkout**, so untracked files like `.env` don't carry over. To copy them automatically into every new worktree, add a `.worktreeinclude` file at the project root; it uses `.gitignore` syntax and only copies files that both match a pattern and are actually gitignored:

```text
.env
.env.local
config/secrets.json
```

**Cleanup is semi-automatic.** When an interactive session exits, Claude checks whether the worktree holds unsaved work: a clean unnamed worktree is removed along with its branch, a named one prompts first; with changes inside, you choose keep or remove. Non-interactive `-p` runs trigger no cleanup — remove those yourself with `git worktree remove`. Subagents can get their own worktrees too — ask Claude to "use worktrees for your agents", or set `isolation: worktree` in a `.claude/agents/` definition; if the subagent finishes without changes, its worktree is removed automatically. Background sessions dispatched through agent view move into their own worktrees without any setup.

Isolation isn't a gentleman's agreement: while a session sits in a worktree, Claude Code blocks file edits targeting the main checkout, commands whose working directory resolves there, and git invocations redirected back via tricks like `git -C`.

## Reading path for this cluster

Each approach has its own deep dive; suggested order:

1. [Sub-agents mechanics](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution-en): context isolation, frontmatter definitions, background execution — the shared foundation.
2. [Agent View](/posts/tech/deep-dive/2026-08-26-claude-code-agent-view-en): dispatching background sessions yourself.
3. [Agent Teams](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide-en): lead plus shared task list.
4. [Dynamic Workflows](/posts/tech/deep-dive/2026-08-26-claude-code-dynamic-workflows-en): scripted execution at scale.

The [series entry point](/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en) has the map for the whole series.

## References

- [Run agents in parallel — Claude Code Docs](https://code.claude.com/docs/en/agents) — primary source: the four-way comparison table, the three-question decision guide, and the boundaries of supporting tools
- [Run parallel sessions with worktrees — Claude Code Docs](https://code.claude.com/docs/en/worktrees) — the `--worktree` flag, `.worktreeinclude` copy rules, cleanup, and enforced isolation

## Changelog

- 2026-08-26: Initial version, based on the official agents.md and worktrees.md pages as of August 2026.
