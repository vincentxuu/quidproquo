---
title: "Claude Code /loop: Turning AI into a Background Worker with Native Scheduling (v2.1.72+)"
date: 2026-05-09
type: guide
category: tech
tags: [claude-code, ai-tools, automation, scheduling]
lang: en
tldr: "/loop is Claude Code's native cron feature — set schedules in plain English and let Claude monitor, auto-fix PRs, and run recurring tasks in the background. Session-scoped and expires after 7 days; for cross-session scheduling, use Routines or Desktop scheduled tasks."
description: "A guide to Claude Code's /loop scheduling feature, covering dynamic intervals, custom default prompts via loop.md, cron expressions, and how it compares to Routines and Desktop scheduled tasks."
draft: false
series:
  name: "Claude Code Automation Guide"
  order: 7
---

🌏 [中文版](/posts/tech/2026-05-09-claude-code-loop-scheduling)

## TL;DR

`/loop` lets you set recurring tasks for Claude Code in plain English — no cron syntax required. Just say "check deployment status every 10 minutes" and you're done. You can also omit the interval entirely and let Claude dynamically decide when to run next based on what it observes. Session-scoped with a maximum lifetime of 7 days, it's ideal for in-session monitoring and reminders — not for long-running cross-session automation.

> Requires Claude Code v2.1.72 or later. Verify with `claude --version`.

---

`/loop` launched in the March 7, 2026 update, transforming Claude Code from a passive response tool into a background worker capable of proactively executing tasks on its own.

At its core, it's a session-level cron job: you define a schedule and a prompt, and Claude Code executes it automatically whenever it's idle. Each session supports up to 50 concurrent scheduled tasks.

## Three Usage Modes

`/loop` accepts two parameters — an interval and a prompt — and their combination determines behavior:

| What you provide | Example | Behavior |
|--|--|--|
| Interval + prompt | `/loop 5m check the deploy` | Fixed cron schedule running your prompt |
| Prompt only | `/loop check the deploy` | Claude dynamically picks the next interval based on observed results |
| Interval only, or nothing | `/loop` | Runs the built-in maintenance prompt (or your `loop.md`) |

### 1. Fixed Interval

The most straightforward mode. Claude converts your description into a cron expression, schedules it, and confirms with you:

```bash
/loop 5m check if the deployment finished and tell me what happened
```

Supported time units: `s` (seconds, rounded up to minutes), `m` (minutes), `h` (hours), `d` (days). The interval can go before (`5m`) or after (`every 2 hours`) the prompt.

Non-standard cron intervals (e.g. `7m`, `90m`) are rounded to the nearest cron step — Claude will tell you what it selected.

### 2. Dynamic Interval (Let Claude Decide)

Omit the interval and provide only a prompt:

```bash
/loop check whether CI passed and address any review comments
```

After each run, Claude picks the next interval (between 1 minute and 1 hour) based on what it observed. If a build is still running or a PR has recent activity, it checks in more frequently; if everything has gone quiet, it backs off. Each run prints the chosen interval and the reasoning behind it.

Notably, dynamic `/loop` may switch to using the [Monitor tool](https://code.claude.com/docs/en/tools-reference#monitor-tool) to stream output from background scripts — avoiding unnecessary polling, saving tokens, and responding faster than repeated prompt re-runs.

> On Bedrock, Vertex AI, and Microsoft Foundry, omitting the interval falls back to a fixed 10-minute schedule.

### 3. Built-in Maintenance Prompt

Provide nothing at all:

```bash
/loop
```

Claude runs the built-in maintenance prompt, working through tasks in order:

- Continue any unfinished work from the current conversation
- Maintain the current branch's PR: review comments, CI failures, merge conflicts
- When there's nothing else to do, perform housekeeping (bug hunting, simplification)

Uses dynamic intervals by default. Add a time (e.g. `/loop 15m`) to switch to a fixed schedule.

#### Customize the Default Prompt with `loop.md`

To replace the built-in maintenance prompt, create a `loop.md` file:

| Path | Scope |
|--|--|
| `.claude/loop.md` | Project-level, takes priority |
| `~/.claude/loop.md` | User-level, applies to all projects without a project-level file |

It's plain Markdown with no required structure. For example, to keep a release branch healthy:

```markdown
Check the `release/next` PR. If CI is red, pull the failing job log,
diagnose, and push a minimal fix. If new review comments have arrived,
address each one and resolve the thread. If everything is green and
quiet, say so in one line.
```

Changes to `loop.md` take effect on the next iteration — you can tune it while it's running. Files exceeding 25,000 bytes will be truncated.

## One-Off Reminders

No need for `/loop` — just say it in plain English:

```bash
remind me at 3pm to push the release branch
in 45 minutes, check whether the integration tests passed
```

Claude schedules these as single-fire tasks that are automatically deleted after running.

## Real-World Use Cases

### Deployment Monitoring

```bash
/loop 10m check deployment status and alert on errors
```

### Automated PR Maintenance

```bash
/loop babysit all my PRs. When builds fail auto-fix
```

### Run a Custom Slash Command Every Two Hours

```bash
/loop 2h /review-pr 1234
```

### Morning Slack Summary

```bash
/loop every morning at 9:05 use Slack MCP to summarize mentions
```

### Main Branch CI Monitoring

```bash
/loop 15m check main branch CI, notify if red
```

### Time-Boxed Event Processing

```bash
/loop every morning at 9:00 process overnight error logs for 30 minutes then stop
```

## Managing Scheduled Tasks

Just tell Claude directly:

```bash
what scheduled tasks do I have?
cancel the deploy check job
cancel task abc12345
```

Under the hood, three tools power this — useful to know about:

| Tool | Purpose |
|--|--|
| `CronCreate` | Create a task (cron expression + prompt + repeat flag) |
| `CronList` | List all tasks with their IDs, schedules, and prompts |
| `CronDelete` | Cancel a task by its 8-character task ID |

### Stopping `/loop`

While `/loop` is waiting for the next iteration, press **Esc** to stop it. This clears only the pending wakeup — it doesn't affect other tasks you've asked Claude to schedule directly (those require an explicit `cancel`).

## How Scheduling Works

- The scheduler checks every second; tasks due to fire are queued at low priority
- **Triggers fire between turns** — they won't interrupt Claude mid-response; if Claude is busy, the task waits
- Times use the local timezone. `0 9 * * *` means 9 AM local time, not UTC

### Jitter

To prevent all sessions from hitting the API simultaneously:

- Repeating tasks fire up to 30 minutes late (high-frequency tasks are delayed by at most half their interval)
- One-time tasks scheduled on the hour or half-hour fire up to 90 seconds early

Jitter is derived from the task ID and remains consistent. To avoid jitter, set the minute to something other than `:00` or `:30` — for example, `3 9 * * *` won't be jittered.

### 7-Day Expiration

Repeating tasks **expire automatically after 7 days**. They run once more just before expiration, then are deleted. For longer-running schedules, recreate the task before it expires — or use [Routines](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide) or Desktop scheduled tasks instead.

### Resume Restoration

`claude --resume` or `claude --continue` restores unexpired tasks: repeating tasks within 7 days, and one-time tasks whose scheduled time hasn't passed yet. Background Bash and monitor tasks are not restored.

## Limitations

- **Session-scoped**: closing the terminal stops everything; only `--resume` brings tasks back
- **Non-interrupting**: tasks queue up while Claude is busy
- **No catch-up**: missed triggers while idle run only once — missed occurrences are not replayed
- **New sessions start clean**: opening a new conversation clears all tasks

## Cron Expression Reference

`CronCreate` accepts standard 5-field expressions: `minute hour day-of-month month day-of-week`. Supports `*`, single values, `*/n` step intervals, `1-5` ranges, and `1,15,30` lists.

| Example | Meaning |
|--|--|
| `*/5 * * * *` | Every 5 minutes |
| `0 * * * *` | Every hour on the hour |
| `0 9 * * *` | Daily at 9 AM local time |
| `0 9 * * 1-5` | Weekdays at 9 AM |
| `30 14 15 3 *` | March 15 at 2:30 PM |

`L`, `W`, `?`, and aliases like `MON`/`JAN` are not supported. When both day-of-month and day-of-week are specified, a match on either will trigger the task (standard vixie-cron behavior).

## Disabling Scheduling

Set the environment variable `CLAUDE_CODE_DISABLE_CRON=1` to disable the scheduler entirely, which also disables `/loop`.

## When Not to Use /loop

`/loop` is not a true overnight cron daemon. For these scenarios, reach for a different tool:

- **Cross-session cloud scheduling**: use [Routines](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide) (runs even when your machine is off; supports API/GitHub triggers)
- **Long-running local scheduling**: use Desktop scheduled tasks (requires the machine to be on, but not a session)
- **CI integration**: use GitHub Actions

Anthropic's design intent is clear: `/loop` is an in-session companion. For durable, cross-session automation, use Routines or Desktop.

## `/loop` vs. Ralph Loop

Ralph Loop is a community approach that uses a shell script to continuously re-invoke Claude against a prompt until the task is complete or a limit is hit:

|  | `/loop` (native) | Ralph Loop (community) |
|--|--|--|
| Setup | Plain English | Shell script |
| Trigger condition | Time-based or dynamic interval | Task completion condition |
| Persistence | Session-scoped, max 7 days | Script-controlled |
| Best for | Monitoring, reminders, periodic checks | Running until the job is done |

Ralph Loop is the right tool for "keep going until it works" jobs — like repeatedly fixing bugs until all tests pass. `/loop` is the right tool for "check periodically" or "dynamic polling" jobs — like watching CI status or PR reviews.

They solve different problems and aren't substitutes for each other. Choose based on the situation.

---

## References

- [Run prompts on a schedule - Claude Code Docs](https://code.claude.com/docs/en/scheduled-tasks)
- [Routines (cloud scheduling)](https://code.claude.com/docs/en/routines)
- [Desktop Scheduled Tasks](https://code.claude.com/docs/en/desktop-scheduled-tasks)
- [Channels: event-driven alternatives to polling](https://code.claude.com/docs/en/channels)
- [Monitor tool: streaming output from background scripts](https://code.claude.com/docs/en/tools-reference#monitor-tool)
