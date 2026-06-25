---
title: "Let AI Pick Up Issues, Write Code, and Open PRs: Hands-Off Development with Claude Code Remote Agent"
date: 2026-03-27
type: guide
category: tech
tags: [claude-code, remote-agent, scheduled-trigger, openspec, github-issues, automation, dx]
lang: en
tldr: "Using Claude Code's Scheduled Remote Agent, automatically scan GitHub issues every 2 hours, implement features, open PRs, and address review feedback — no human intervention required. Humans only write issues and click merge. Pair it with the custom /publish-tasks skill to push OpenSpec engineering tasks directly to GitHub issues."
description: "The evolution from semi-automated to near-fully-automated development. Use Claude Code Remote Trigger to set up a cloud-scheduled agent that autonomously handles GitHub issues and PR review feedback, connected to OpenSpec's /publish-tasks skill for an end-to-end requirements-to-delivery pipeline."
draft: false
series:
  name: "Claude Code Automation Guide"
  order: 15
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline)

The previous post covered the eight phases from OpenSpec to automated deployment. That workflow runs, but there's a problem: every single step requires a human to trigger it.

"Implement this feature" → AI writes code → "Commit it" → AI commits → "Push it" → AI pushes → "Open a PR" → AI opens PR → CI finishes → "Collect feedback" → AI collects → "Fix it" → AI fixes.

AI handles every step perfectly, but a human has to sit at the keyboard acting as dispatcher the whole time. That's not automation — that's a voice assistant.

## Goal: Humans Do Only Two Things

1. Write requirements (via OpenSpec or directly as issues)
2. Review + Merge

Everything in between — read requirements → open branch → write code → run tests → commit → push → open PR → address review feedback → notify when ready to merge — all of it runs on its own.

## Claude Code Remote Trigger

Claude Code has a feature called Scheduled Remote Trigger. Here's how it works:

1. You define a cron schedule and a prompt
2. When the time comes, Anthropic's cloud automatically spins up an isolated Claude Code session
3. That session clones your specified repo and executes the tasks in the prompt
4. Results stay in the cloud when it finishes

Your computer can be off. It still runs. No local terminal session required.

## Configuration

```bash
# Create via /schedule inside Claude Code
```

Key settings:

| Setting | Value |
|---------|-------|
| Schedule | Every 2 hours (`0 */2 * * *`) |
| Model | claude-sonnet-4-6 |
| Sources | daodao-server, daodao-f2e, daodao-ai-backend, daodao-storage |
| Tools | Bash, Read, Write, Edit, Glob, Grep |

`sources` is an array — you can include multiple repos. The cloud environment clones all of them on startup and configures git authentication. This matters: if you only include one repo and the agent tries to `git clone` others on its own, it'll fail due to missing credentials. Learned that the hard way.

## Two Phases

Each Remote Agent run does two things:

### Phase 1: Issue Monitoring

Scan all 4 repos for issues with the `auto` label:

```bash
for REPO in daodaoedu/daodao-server daodaoedu/daodao-f2e daodaoedu/daodao-ai-backend daodaoedu/daodao-storage; do
  gh issue list --repo $REPO --label "auto" --state open --json number,title
done
```

For each issue without an associated PR: read the issue → cd to the corresponding repo → open branch `auto/<number>-<desc>` → implement → test → commit → push → open PR (`Closes #number`) → leave a comment on the issue.

### Phase 2: PR Patrol

Scan open PRs across all 4 repos, filtering for branches starting with `auto/`. If there's new review feedback, address it. If CI is green and there are no unresolved reviews, post a comment: "Ready to merge."

## Lessons from Path Discovery

The first version of the prompt hard-coded repo paths (`~/daodao-server`), but the remote environment's directory structure didn't match expectations. After fixing that, I added a discovery step at the start:

```bash
ls -la ~/ && find ~/ -maxdepth 2 -name '.git' -type d
```

This lets the agent explore its own directory structure and identify repos by characteristic files (`prisma/` = server, `apps/mobile/` = f2e, `pyproject.toml` = ai-backend, `migrate/sql/` = storage).

Remote agent prompts must be defensive. Never assume any path, environment variable, or system state. It starts from scratch every single time.

## /publish-tasks: Bridging OpenSpec and Remote Agent

With the Remote Agent in place, one piece was still missing: how do you turn OpenSpec engineering tasks into GitHub issues the agent can actually read?

Creating issues manually is slow and easy to get wrong on context. So I built a `/publish-tasks` skill:

```
/publish-tasks
```

It does the following:

1. Reads the OpenSpec change's `tasks.md`, `proposal.md`, `design.md`, and `specs/`
2. Finds all incomplete tasks (`- [ ]`)
3. Groups them by section into logical issues (tasks in the same section become one issue)
4. Shows you a preview of the groupings for confirmation before creating them

Each issue body includes full context:

```markdown
## Context
**Change**: notification-system

### Why
(excerpt from proposal.md)

## Tasks
- [ ] 12.1 Validate comment event...
- [ ] 12.2 Validate P2 aggregation...

## Technical Context
(relevant architecture decisions from design.md)

## Specs
(relevant requirements from specs/)

## Acceptance Criteria
- All tasks completed
- Tests pass
```

The key principle: **the issue body must be self-contained**. The Remote Agent has no local files — all context must live in the issue. If the issue is too sparse, the agent guesses; if it's thorough, the implementation quality improves dramatically.

## The Full Pipeline

```
What humans do                     What AI does automatically
──────────────                     ──────────────────────────

Explore requirements in OpenSpec
    ↓
Generate proposal → design
→ specs → tasks
    ↓
/publish-tasks                →    GitHub Issues + auto label
                                        ↓
                                   Scan every 2 hours
                                   Read issue → open branch
                                   Implement → test → open PR
                                        ↓
                                   Review feedback arrives
                                   Fix → push → comment
                                        ↓
Review + Merge             ←      "CI all green, ready to merge!"
```

## Limitations

To be honest:

| Limitation | Impact |
|------------|--------|
| Only 1 trigger allowed per plan | Worked around by scanning all repos in a single trigger |
| Minimum interval of 1 hour | Not real-time — must wait for the next scan cycle |
| No memory between sessions | Cannot carry over context from previous runs |
| Not suited for design decisions | Requirements analysis and architecture still require human judgment |

The biggest limitation is actually this: **the quality of AI-written code depends entirely on the quality of the issue**. If an issue just says "add a notification feature," what comes out will be rough. But if the issue contains a complete spec, schema design, API contract, and acceptance criteria, the quality is significantly better.

This is also why the OpenSpec workflow (Phases 1–2) can't be automated — that's the stage where you decide *what* to build and *how* to build it, which requires human judgment. The Remote Agent handles "implement per spec," and that's exactly where it excels.

## From Semi-Automated to Near-Fully-Automated

```
Phase 1.0  Humans write all the code
Phase 1.5  Humans trigger every step; AI executes
Phase 2.0  Humans write requirements and merge; everything in between is automatic  ← we are here
Phase 3.0  ???
```

Phase 3.0 might look like real-time GitHub webhook triggers (no cron wait), automatic detection of new issues, and auto-merging low-risk PRs. But Phase 2.0 is already enough for now.

The real bottleneck isn't the degree of automation — it's issue quality. Time spent writing requirements clearly is worth more than time spent making AI start faster.

## References

- [Claude Code Official Docs](https://docs.anthropic.com/en/docs/claude-code)
- [Claude Code Remote Agent Docs](https://docs.anthropic.com/en/docs/claude-code/remote-agents)
- [OpenSpec GitHub](https://github.com/openspec-dev/openspec)
- [GitHub CLI (gh) Official Docs](https://cli.github.com/manual/)
- [GitHub Issues Official Docs](https://docs.github.com/en/issues)
- [AI-Driven Dev Workflow from OpenSpec to Deployment](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy) — The full eight-phase workflow; this post extends the "automation" portion of it
- [/file-bug-issue Skill + Remote Agent Integration](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent) — Using a Skill to convert debug conversations into issues for the Remote Agent to fix
- [Claude Code's Three-Layer Quality Defense: Hooks, Skills, and Instruction Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md) — A deep dive into the Skill and Hook mechanisms
- [Daodao Tech Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
