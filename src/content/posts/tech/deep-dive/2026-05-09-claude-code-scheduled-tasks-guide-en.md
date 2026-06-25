---
title: "Claude Code Routines: Complete Guide to Cloud Automation — Setup, Triggers, and Real-World Examples"
date: 2026-05-09
type: guide
category: tech
tags: [claude-code, routines, scheduled-tasks, remote-agent, automation, cron, dx]
lang: en
tldr: "Routines is Claude Code's cloud automation system (formerly Cloud Scheduled Tasks). Beyond cron scheduling, you can trigger runs via API endpoint or GitHub events — scan issues, review PRs, run checks, open PRs — all while your computer is off."
description: "A complete guide to Claude Code Routines' three trigger types (Schedule / API / GitHub), how it differs from Desktop scheduled tasks and /loop, and a real-world example with the daodao-auto-dev setup."
draft: false
series:
  name: "Claude Code Automation Guide"
  order: 8
---

🌏 [中文版](/posts/tech/deep-dive/2026-05-09-claude-code-scheduled-tasks-guide)

You write a prompt telling Claude: "Scan these four repos for GitHub issues labeled `auto`, implement them, then open a PR." Then you set it to run every 2 hours.

You go to sleep. At 2 AM, 4 AM, and 6 AM, Claude clones the repos, reads the issues, writes the code, runs tests, and opens PRs on its own. You wake up to three PRs waiting for your review.

That's what Claude Code **Routines** does.

> **Rename notice**: Routines is the new name for Cloud Scheduled Tasks. After expanding the feature set, it was renamed — in addition to scheduling, two new trigger types were added: **API trigger** and **GitHub event trigger**, and all three can be combined on a single routine.
>
> Routines is currently in **research preview**, so behavior, limits, and the API interface may still change.

## Three Scheduling Approaches

Claude Code offers three scheduling mechanisms suited to different scenarios:

| | Routines (cloud) | Desktop scheduled tasks | `/loop` |
|---|---|---|---|
| Runs on | Anthropic cloud | Your computer | Your computer |
| Computer must be on? | No | Yes | Yes |
| Session must be open? | No | No | Yes |
| Survives restart? | Yes | Yes | `--resume` restores within 7 days |
| Can read local files? | No (fresh clone each run) | Yes | Yes |
| MCP support | Connectors (per routine) | Config files + connectors | Inherits session |
| Permission prompts | None (autonomous) | Configurable per task | Inherits session |
| Trigger types | Schedule / API / GitHub | Schedule only | Schedule only |
| Minimum interval | 1 hour | 1 minute | 1 minute |

**Routines**: Your computer doesn't need to be online — ideal for cross-timezone teams and long-running automation. Every run is a fresh clone, clean and isolated.

**Desktop scheduled tasks**: Requires your computer to be on but not a live session. Can read and write local files. Good for tasks that need a local environment.

**`/loop`**: The lightest option — quick scheduling within a session. Best for short-term monitoring like "notify me when the deploy is done." Disappears when the session ends; use `--resume` to restore it.

This post focuses on Routines. For `/loop`, see [/loop Scheduling](/posts/tech/2026-05-09-claude-code-loop-scheduling). For the full Remote Agent pipeline, see [Remote Agent Auto-Dev](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline).

## What Is a Routine

A routine is a packaged Claude Code configuration: **prompt + one or more GitHub repos + connectors + one or more triggers**. Set it up once, run it automatically as many times as you want.

Available on: Pro, Max, Team, and Enterprise plans with Claude Code on the web enabled. Team / Enterprise admins can disable it globally from admin settings.

Each routine run is equivalent to a full Claude Code cloud session: **autonomous execution, no permission prompts, can run shell commands, use skills, and call connectors**. What it can access is entirely determined by the repos, environment, and connectors you configure — so lock those down carefully.

### How to Create One

Three entry points, all writing to the same cloud account:

- **Web**: Go to [claude.ai/code/routines](https://claude.ai/code/routines) and click **New routine**
- **Desktop App**: Routines page → **New routine** → choose **Remote** (choosing Local creates a Desktop scheduled task instead)
- **CLI**: Type `/schedule` in a session; Claude will walk you through setup conversationally

The CLI `/schedule` command can only create schedule-type routines. To add API or GitHub triggers, you need to edit in the Web UI.

You can also manage existing routines from the CLI: `/schedule list`, `/schedule update`, `/schedule run`.

### What You Configure

Key fields in the creation form:

**1. Name and prompt**

The prompt is the core. Routines run fully autonomously with no human interaction, so prompts must be **self-contained, explicit, and verifiable**. The prompt input lets you choose a model — that model is used for every run.

**2. Repositories**

One or more GitHub repos. Each run does a fresh clone of the default branch. Claude can only push to branches with a `claude/` prefix (unless you enable **Allow unrestricted branch pushes**).

**3. Environment (cloud environment)**

Controls what this routine can access:

- **Network access**: Default is **Trusted** — only allows common package registries (npm, PyPI), cloud APIs, and container registries; everything else is blocked (`403 host_not_allowed`). To reach your own services, switch to **Custom** and list specific domains, or use **Full** to allow everything
- **Environment variables**: Secrets like API keys and tokens
- **Setup script**: Install dependencies. **Results are cached** — not re-run every time

> Connector traffic goes through Anthropic's servers, so you don't need to add connector hosts to the Allowed domains list.

**4. Connectors**

Connect to MCP services (Slack, Linear, Google Drive, etc.). By default all your connected connectors are included — **remove the ones you don't need**. During a run, Claude calls tools without asking for permission, including write operations.

**5. Triggers (one or more)**

Detailed in the next section.

## Three Trigger Types

A single routine can have multiple triggers attached simultaneously. For example: "run nightly + trigger from a deploy script + run whenever a new PR is opened" can all be bound to the same routine.

### Schedule Trigger

Default options: Hourly / Daily (default 9:00) / Weekdays / Weekly. Times are entered in your local timezone and converted automatically.

**Custom cron**: In the Web form, first select the closest preset, then use the CLI `/schedule update` to set a precise cron expression. **Minimum interval is 1 hour** — anything more frequent will be rejected.

Each run has a small random delay (stagger) to prevent everyone hitting the API at the same time. The offset is fixed per routine.

#### One-Off Run (Single Trigger)

Schedules can also be set for a single execution: runs once at the specified time, then auto-disables. The UI shows it as **Ran**.

From the CLI, you can use natural language:

```bash
/schedule tomorrow at 9am, summarize yesterday's merged PRs
/schedule in 2 weeks, open a cleanup PR that removes the feature flag
```

**One-off runs don't count toward your daily routine limit** — they only count against your plan's general usage.

### API Trigger (New)

Each routine can have an HTTP endpoint. POST to it to trigger a run and get back a session URL. This is how you connect Claude Code to alerting systems, CD pipelines, or internal tools.

Setup (Web only — tokens cannot be created or revoked from the CLI):

1. Edit routine → **Select a trigger** → **Add another trigger** → **API**
2. After saving, a modal shows the URL and a sample curl command
3. Click **Generate token** — **the token is shown only once**, copy it immediately

Example call:

```bash
curl -X POST https://api.anthropic.com/v1/claude_code/routines/trig_01ABCDEFGHJKLMNOPQRSTUVW/fire \
  -H "Authorization: Bearer sk-ant-oat01-xxxxx" \
  -H "anthropic-beta: experimental-cc-routine-2026-04-01" \
  -H "anthropic-version: 2023-06-01" \
  -H "Content-Type: application/json" \
  -d '{"text": "Sentry alert SEN-4521 fired in prod. Stack trace attached."}'
```

Response:

```json
{
  "type": "routine_fire",
  "claude_code_session_id": "session_01HJKLMNOPQRSTUVWXYZ",
  "claude_code_session_url": "https://claude.ai/code/session_01HJKLMNOPQRSTUVWXYZ"
}
```

The `text` field is a freeform string (not parsed as structured data) and is fed to Claude alongside the routine's original prompt. If you pass JSON in `text`, Claude sees it as a literal string.

> The beta header is `experimental-cc-routine-2026-04-01`. This may change during research preview, but Anthropic commits to supporting the previous two header versions to allow migration time. The `/fire` endpoint is only available to claude.ai accounts and is not part of the Claude Platform API surface.

### GitHub Event Trigger (New)

GitHub events directly trigger a run. Each event opens a new independent session — **no session reuse**.

Setup (Web only):

1. Edit routine → **Add another trigger** → **GitHub event**
2. **The Claude GitHub App must be installed first** (the CLI's `/web-setup` only grants clone access — it does not install the App or enable webhooks)
3. Select repo, event type, and filters

Supported events:

| Category | Triggers when |
|--|--|
| Pull request | PR opened, closed, assigned, labeled, new commits pushed, other updates |
| Release | Release created, published, edited, deleted |

Each category lets you pick specific actions (e.g., `pull_request.opened`) or all actions.

PR filter options are rich: Author, Title, Body, Base branch, Head branch, Labels, Is draft, Is merged. Each field supports operators: equals, contains, starts with, is one of, is not one of, matches regex.

> `matches regex` matches the entire value, not a substring. To find titles containing "hotfix", use `.*hotfix.*` or just use `contains`.

Example filter combinations:

- **Auth module review**: base = `main` AND head contains `auth-provider`
- **Skip drafts**: Is draft = false
- **Label gating**: Labels contains `needs-backport`

> During research preview, **GitHub webhooks have per-routine and per-account hourly limits**. Excess events are dropped and reset at the next window.

## Managing Routines

Go to [claude.ai/code/routines](https://claude.ai/code/routines) and click a routine to see its detail page:

- **Run now**: Manually trigger a run immediately
- **Pause/Resume**: Toggle scheduling via the Repeats section; settings are preserved
- **Edit**: Change name, prompt, repos, environment, connectors, and triggers
- **Delete**: Delete the routine (past sessions remain)
- **Runs history**: Each run is a full session. Click in to see what Claude did, what it changed, and whether it decided to open a PR

> Important: A green status in the run list only means "the session started without an infrastructure error." **It does not mean the prompt task actually succeeded.** Blocked network, missing connector tools, or logic failures are only visible inside the transcript.

## Real-World Example: daodao-auto-dev

This is a routine I run in production to automate development on the daodao project.

### Setup

- **Name**: `daodao-auto-dev`
- **Repositories**: 4 repos — `daodaoedu/daodao-server`, `daodaoedu/daodao-f2e`, `daodaoedu/daodao-ai-backend`, `daodaoedu/daodao-storage`
- **Trigger**: Schedule with custom cron `0 */2 * * *` (every 2 hours)
- **Status**: Can be paused and resumed at any time

### Prompt Design

The prompt tells Claude to:

1. Explore the working environment and locate the four repos
2. Scan GitHub issues for those with the `auto` label
3. Implement them in priority order: create branch → write code → run tests → open PR
4. Check open PRs for review feedback and address it automatically

This prompt is roughly 200 lines long, including tech stack notes for each repo, coding conventions, and PR format requirements. The more specific you are, the better the output quality.

### Results in Practice

From the Runs history:

- Automatically runs every 2 hours (2:01 AM, 4:04 AM, 6:02 AM)
- Also supports manual triggers (shown with a **MANUAL** badge)
- Each run is an independent session that can be expanded to see the full conversation

A typical night looks like this:

```
Overnight → Claude finds 3 issues labeled auto
    ↓
Auto-creates branches, writes code, runs tests
    ↓
Opens 3 PRs (with changes like +177/-0, +121/-18, etc.)
    ↓
Wake up → review 3 PRs → merge
```

The human role shifts from "writing code" to "writing issues + reviewing PRs."

### Adding a GitHub Trigger for Real-Time PR Review

The schedule handles work in batches. To make PR review happen in real time, you can **add a GitHub trigger** to the same routine (or create a dedicated review routine):

- Trigger: `pull_request.opened`, filter `is draft = false`
- Every new PR immediately kicks off a review run that leaves inline comments

Schedule handles the backlog; GitHub trigger handles real-time events. Together they form a complete development agent.

### Pairing with /file-bug-issue

The [`/file-bug-issue` skill](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent) lets you open a GitHub issue directly from a debug session. If you decide AI can fix it, manually add the `auto` label and the next routine run picks it up automatically.

```
Debug → /file-bug-issue → GitHub Issue (bug label)
    ↓
Human decides it can be auto-fixed → add auto label
    ↓
Routine picks it up next run → auto-fixes → opens PR
```

## Prompt Design Principles

The biggest challenge with Routines is prompt quality. They run fully autonomously — **no permission prompts, no pauses to ask you anything** — you're not in the loop.

**Be self-contained.** Don't assume any prior context. Every run is a fresh clone with no memory between sessions. Everything the agent needs must be in the prompt.

**Be specific.** "Handle the issues" is too vague. "Scan issues with the `auto` label, sort by priority, process one at a time, create a `claude/<issue-number>` branch, run `pnpm test` when done, and only open a PR if tests pass" is the right level of detail.

**Set boundaries.** Tell Claude what not to do: don't modify CI config, don't force-push, don't merge PRs. Remove connectors you don't need. Don't set network access to Full unless necessary.

**Plan for failure.** "If tests fail, stop processing that issue, leave a comment on the PR explaining the failure, and continue with the next issue." Prompts that don't handle failure paths will leave Claude stuck.

**Iterate.** The first few runs will have problems. Read the session transcripts, adjust the prompt, and run again. It stabilizes after a few cycles.

## Limitations

**Fresh clone every run.** No filesystem cache (the setup script output is cached, but not the file system state). Large repos take longer to clone. You also can't persist state (e.g., "which issue did I process last") — use external systems (GitHub labels, issue status) to track progress instead.

**Branch restrictions.** By default, Claude can only push to `claude/`-prefixed branches. This is sensible security, but if your workflow requires pushing to other branches, you'll need to explicitly enable **Allow unrestricted branch pushes**.

**1-hour minimum interval.** Routines aren't suited for high-frequency monitoring. For minute-level polling, use Desktop scheduled tasks or `/loop`, or switch to a GitHub trigger to make it event-driven instead.

**No local file access.** Runs on Anthropic's cloud — your local files aren't visible. Use Desktop scheduled tasks for anything that needs a local environment.

**A few minutes of delay.** The stagger mechanism prevents everyone from hitting the API simultaneously, so each run has a small random delay. Not an issue in practice, but not suitable for time-critical scenarios.

**Daily run limit.** Routines consume your subscription usage and are also subject to a **per-account daily run cap**. Check how much you have left at [claude.ai/code/routines](https://claude.ai/code/routines) or in settings/usage. If you hit the cap, enable extra usage for metered overage or wait for the next window.

**Identity attribution.** Routines belong to your personal claude.ai account and aren't shared with teammates. PRs opened via your connected GitHub and Slack messages sent via your Slack connector **all appear under your name**. This is worth considering for team use.

**API still in beta.** The `/fire` endpoint uses the beta header `experimental-cc-routine-2026-04-01`, and the request/response shape may still change.

## The Big Picture

Routines transform Claude Code from a "you ask, it answers" interactive tool into an "set it and forget it" automation system.

The biggest mindset shift: **you no longer need to sit at your computer waiting for AI to do things.** Write the prompt, attach the triggers, and the AI becomes a developer running around the clock. You go from "the person who writes code" to "the person who designs the workflow."

And now it's not just scheduled runs — connect your alerting system via API trigger, connect PR creation via GitHub trigger, and the AI can act the moment something happens.

Start simple: auto-review yesterday's PRs every morning, run a dependency audit every week. Once that's stable, add a GitHub trigger to automate PR review, then add an API trigger to auto-triage alerts.

---

## References

- [Routines official docs (formerly Cloud Scheduled Tasks)](https://code.claude.com/docs/en/routines)
- [Desktop scheduled tasks official docs](https://code.claude.com/docs/en/desktop-scheduled-tasks)
- [/loop and in-session scheduling official docs](https://code.claude.com/docs/en/scheduled-tasks)
- [Trigger a routine via API (Platform docs)](https://platform.claude.com/docs/en/api/claude-code/routines-fire)
- [GitHub Actions integration](https://code.claude.com/docs/en/github-actions)
- [Claude Code on the web: cloud environment settings](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Claude Code /loop Scheduling](/posts/tech/2026-05-09-claude-code-loop-scheduling)
- [Remote Agent Auto-Dev Pipeline](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline)
- [/file-bug-issue Skill and Remote Agent Integration](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent)
- [Daodao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
