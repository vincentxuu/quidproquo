---
title: "Claude Code Agent Teams in Practice: Team Lead, Point-to-Point Messaging, and a Shared Task Board"
date: 2026-03-28
type: deep-dive
category: tech
tags: [claude-code, agent-teams, multi-agent, parallel-execution, ai-agent, dx]
lang: en
tldr: "Agent Teams lets multiple full Claude Code sessions work as one team: a team lead assigns work while teammates each run their own context window, coordinating through point-to-point messaging and a shared task list. This post covers the three key differences from sub-agents, the trade-off between teammateMode display modes, and why token cost scales linearly with team size."
description: "A deep dive into Claude Code's Agent Teams: enabling the feature, the division of labor between team lead and teammates, SendMessage point-to-point messaging, task board management, teammateMode display settings, plus use cases and cost limits."
draft: true
series:
  name: "Claude Code Deep Dives"
  order: 25
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide)

This is the Agent Teams installment of the "Claude Code Deep Dives" series. [F1, the multi-agent overview](/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview), mapped the whole territory, and [D4 on sub-agents](/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution) covered the lightweight way to parallelize; this post handles the heavyweight option — multiple Claude Code instances forming a long-lived team. The feature is experimental and disabled by default, and the official docs are upfront about its known limitations, so half of this post is about how to use it and the other half is about when not to.

## How It Differs from Sub-agents

A sub-agent is "dispatch, then collect the report": the main conversation opens a fresh context window, the sub-agent does its work, summarizes results back, and its lifecycle ends there. Teammates in an agent team are different — they are **long-lived, full Claude Code sessions** — each with its own context window, loading the same CLAUDE.md, MCP servers, and skills at spawn time, but not inheriting the lead's conversation history.

The official comparison (see also the [official sub-agents docs](https://code.claude.com/docs/en/sub-agents) for the full mechanics):

| | Sub-agents | Agent Teams |
|---|---|---|
| Context | Own context window; results return to the caller | Own context window; fully independent |
| Communication | Report back to the main agent only | Teammates message each other directly |
| Coordination | Main agent manages all the work | Shared task list; self-coordinating |
| Best for | Focused tasks where only the result matters | Complex work requiring discussion and collaboration |
| Token cost | Lower (results summarized back into main context) | Higher (each teammate is a separate instance) |

Condensed into three sentences: teammates message each other, share a task board, and you can talk to any teammate directly without going through the lead. Sub-agents can do none of these.

## Starting Your First Team

Agent teams are controlled by `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`, disabled by default. Add this to settings.json:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

As of v2.1.178 you no longer ask Claude to create and name a team first — just describe the task and the teammates you want in natural language:

```text
Spawn three teammates to review PR #142:
- One focused on security implications
- One checking performance impact
- One validating test coverage
```

Claude populates a shared task list, spawns a teammate per perspective, and synthesizes findings once everyone finishes.

One side effect worth knowing: with this variable enabled, subagents that **Claude names on its own** also launch as teammates, even if you never asked for a team. If part of your flow really only needs the dispatch-and-report behavior of a subagent, set the variable back to `"0"` — no session restart required. Also note that non-interactive mode (`-p` flag, Agent SDK sessions) never spawns teammates.

## What the Lead and Teammates Each Do

Architecturally there are exactly four components:

| Component | Role |
|-----------|------|
| Team lead | The main session: spawns teammates, coordinates, synthesizes |
| Teammates | Independent Claude Code instances working their assigned tasks |
| Task list | Shared list of work items that teammates claim and complete |
| Mailbox | Messaging system for communication between agents |

Everything lives locally: team config at `~/.claude/teams/{team-name}/config.json`, tasks at `~/.claude/tasks/{team-name}/`. The team name derives from the session ID (`session-` plus the first eight characters); the config directory is removed automatically when the session ends, while the task list persists so a resumed session picks up where it left off.

The core rule of the division of labor: **you instruct the lead, and the lead instructs the teammates**. For complex or risky tasks you can add a plan approval gate — require a teammate to stay in read-only plan mode until the lead approves its plan. The lead makes approval decisions autonomously; to influence its judgment, put criteria in your prompt, such as "only approve plans that include test coverage."

On permissions: teammates inherit the lead's permission settings. You can change individual modes after spawn but not at spawn time, and teammate permission prompts bubble up to the lead session for you to handle.

## The Messaging Model: Point-to-Point, No Broadcast

Teammates communicate through [`SendMessage`](https://code.claude.com/docs/en/tools-reference), and it is strictly addressed: reaching everyone means sending one message per recipient. The official wording is "To reach everyone, send one message per recipient" — there is no broadcast operation.

Messages are delivered automatically; the lead never polls. When a teammate finishes and stops, it sends an idle notification to the lead — but the notification **does not carry the teammate's output**. Results get shared by messaging the lead or updating the shared task list.

Under the hood, each agent has a mailbox JSON file (`~/.claude/teams/{team-name}/inboxes/{agent-name}.json`), and a message counts as sent only when the write succeeds. One security rule is worth remembering: recipients are told the message came from another Claude session, not from you, so a teammate cannot approve permission prompts on your behalf, and an action you denied cannot be relayed to another teammate to bypass the check.

At the tool layer: `SendMessage` handles inter-agent messaging (and since v2.1.224 can also reach your other Claude Code sessions), while `ListAgents` lists every agent Claude can message — it requires v2.1.224 or later and appears only in sessions where cross-session messaging is enabled.

## Managing the Task Board

The shared task list runs on four tools: `TaskCreate`, `TaskGet`, `TaskList`, and `TaskUpdate`. Tasks have three states: pending → in progress → completed. Dependencies are managed automatically — a pending task with unresolved dependencies cannot be claimed, and when a teammate completes a task, downstream tasks unblock without any action from you.

Assignment goes two ways:

- **Lead assigns**: tell the lead which task goes to which teammate.
- **Self-claim**: after finishing its current work, a teammate picks up the next unassigned, unblocked task on its own.

Claiming uses file locking to prevent two teammates grabbing the same task simultaneously. To enforce quality gates, use hooks: `TeammateIdle` (when a teammate is about to go idle), `TaskCreated`, and `TaskCompleted` — exit code 2 blocks the action and feeds back a message.

For day-to-day operation: `Ctrl+T` toggles the task list display; in the agent panel, **use the up and down arrow keys to select a teammate, then press Enter to open its transcript and message it directly**; Esc interrupts the selected teammate's current turn.

## teammateMode: Two Display Modes

- **In-process** (default): all teammates run inside your main terminal, switched via the agent panel. Works in any terminal with zero extra setup.
- **Split panes**: each teammate gets its own pane — everyone's output visible at once, click into any pane to interact. Requires tmux or iTerm2.

Configure via `teammateMode` in `~/.claude/settings.json`: `"auto"` (split panes when already inside tmux or iTerm2, otherwise fall back to in-process), `"in-process"`, `"tmux"`, or `"iterm2"` (v2.1.186+, explicitly iTerm2 native split panes, requires the `it2` CLI). Note the default change: as of v2.1.179 the default moved from `"auto"` to `"in-process"`, so if you were used to split panes, set it back yourself. For a single session, override with `claude --teammate-mode auto` (an experimental flag that does not appear in `--help`).

While viewing an in-process teammate, your plain text and skills go to that teammate, but built-in commands still execute in the lead's session. And since a teammate's model is fixed at spawn time, `/model` and `/fast` only change the lead's settings.

## Use Cases and the Cost Warning

The four strongest use cases named by the official docs: research and review (multiple angles investigating and challenging each other's findings), new modules or features (each teammate owns separate files without stepping on others), debugging with competing hypotheses (five teammates try to disprove each other's theories — the surviving theory is most likely the root cause), and cross-layer coordination (one teammate each for frontend, backend, and tests). If you're new, start with tasks that don't write code to validate the value first.

The negative list is just as clear: sequential tasks, same-file edits, and work with many dependencies are better served by a single session or subagents.

Cost is the most practical brake: each teammate carries its own context window, so token usage scales **linearly** with headcount — the official docs state plainly that it costs significantly more than a single session. In practice, start with 3 teammates and 5–6 tasks per person; three focused teammates often outperform five scattered ones. Factor the known limitations into any decision too: in-process teammates aren't restored by `/resume` or `/rewind`, task status updates can lag, shutdown can be slow, a session supports exactly one team, teammates cannot spawn their own teammates, and the lead role is fixed and cannot be transferred.

## Lessons Learned

A sub-agent is a function call; an agent team is a coworker. The difference isn't whether you can parallelize (both can) — it's the communication topology and lifecycle: teammates coexist over time, message each other point-to-point, and self-coordinate on a shared task board. The price is linearly rising token cost plus the rough edges of an experimental feature. My recommendation: run one team through a boundary-clear review or research task first, confirm the coordination gains actually exceed the cost, and only then hand it code-writing work.

## References

- [Orchestrate teams of Claude Code sessions — Claude Code Docs](https://code.claude.com/docs/en/agent-teams) — Official Agent Teams documentation: enablement, display modes, task board, mailbox architecture, hooks, limitations, and troubleshooting
- [Tools reference — Claude Code Docs](https://code.claude.com/docs/en/tools-reference) — Current status, version requirements, and permission columns for `SendMessage`, `ListAgents`, and the `TaskCreate` family
- [Create custom subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents) — Sub-agent lifecycle, tool filtering, and its "runs within a single session" positioning; the baseline for the Agent Teams comparison table

## Changelog

- 2026-03-28: Outline skeleton created.
- 2026-08-26: Expanded into full prose based on the official docs (code.claude.com, including v2.1.178+ behavior); corrected teammate switching to arrow-key selection + Enter, removed the nonexistent broadcast description, and added teammateMode `"iterm2"` plus the current status of `SendMessage`/`ListAgents`.
