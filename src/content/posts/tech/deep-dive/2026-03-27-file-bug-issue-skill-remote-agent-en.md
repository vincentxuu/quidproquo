---
title: "Turning Debug Sessions into GitHub Issues with a Claude Code Skill: Designing /file-bug-issue"
date: 2026-03-27
type: guide
category: tech
tags: [claude-code, skill, github-issues, bug-tracking, remote-agent, automation, dx]
lang: en
tldr: "Stuck mid-debug and can't fix it right now? Use /file-bug-issue to package the error analysis, reproduction steps, and attempted fixes from your conversation into a well-structured GitHub issue. Pair it with a Remote Agent to let AI automatically take over the fix."
description: "A walkthrough of the custom /file-bug-issue Claude Code skill — how it automatically collects error information from conversation context, creates a structured GitHub issue, and integrates with a Scheduled Remote Agent to form a pipeline from bug tracking to automated remediation."
draft: false
series:
  name: "Claude Code 自動化指南"
  order: 16
---

🌏 [中文版](/posts/tech/deep-dive/2026-03-27-file-bug-issue-skill-remote-agent)

CI was red again. PostgreSQL crashed while processing the 20th schema file, with the error `FATAL: the database system is shutting down`.

Twenty minutes of analysis later: Docker's default `/dev/shm` is only 64MB, and as schema files accumulated, shared memory ran out. On top of that, `docker-compose.dev.yml` had `initdb.d` mounted, which auto-ran the schema on startup — and then CI ran it a second time manually. Double execution blew the memory budget.

Root cause identified, fix clear (add `shm_size`, split out a CI-specific compose file, consolidate SQL connections). But this isn't what I should be fixing right now — I have other tasks in flight, and this fix involves changing the CI workflow and docker-compose files. Better to open an issue and track it properly.

The problem: my twenty minutes of analysis lived entirely inside a Claude Code conversation. If I jumped to GitHub to open an issue manually, I'd have to retype the error message, reproduction steps, root cause analysis, and suggested fixes from scratch. Or — more realistically — I'd open an issue that just said "CI schema validation failed" and have absolutely no memory of the details three days later.

## /file-bug-issue

So I built a skill. In the middle of a debug session, just say `/file-bug-issue`, and it will:

1. **Auto-collect from conversation context** — error messages, reproduction steps, attempted fixes, related files, environment info
2. **Ask which repo to file to** — verifies access with `gh repo view`
3. **Preview the issue content** — lets you confirm or adjust
4. **Run `gh issue create`** — creates the issue with a `bug` label

The whole process takes under a minute. The resulting issue looks like this:

```markdown
## Error Description

The CI Pipeline failed at the "Validate Schema SQL on pg-dev" step
when executing 190_create_table_user_join_group.sql — PostgreSQL shut down unexpectedly:

    psql: error: connection to server failed:
    FATAL:  the database system is shutting down

## Reproduction Steps

1. Open a PR targeting main or dev branch
2. CI triggers the ci-postgres.yml workflow
3. Schema validation step executes ./schema/*.sql files in sequence
4. Fails at the 20th file

## Root Cause Analysis

Docker's default /dev/shm is only 64MB... (full analysis)

## Suggested Fix

- [ ] Add shm_size: 256mb to docker-compose.dev.yml
- [ ] Use a separate compose override file for CI
- [ ] Run schema validation through a single connection
- [ ] Add a failure debug step to CI workflow
```

The key point: **all the context accumulated during the debug session is preserved**. Not a vague reconstruction written after the fact — a complete analysis captured in the moment.

## Design Decisions

### Why not use GitHub issue templates?

GitHub issue templates are designed for external users reporting bugs — people who don't know your codebase and need a structured form to guide them toward providing useful information.

But a developer filing their own bug issue is a different situation. You're already deep in the debug session. The error message is right in front of you. The root cause analysis is already done. What you need isn't a blank template — you need someone to organize the information scattered across your conversation into a proper document.

### Why a skill and not a hook?

Hooks are for defensive actions that trigger automatically — blocking bad commits, auto-formatting code. But "filing a bug issue" is a human judgment call. Not every error deserves an issue, and the issue content needs review. So this is a skill, triggered intentionally by the human.

### Traditional Chinese + original error messages

Our team writes issue content in Traditional Chinese, but error messages, commands, and code stay in their original English. This matters — translating error messages makes them unsearchable. `FATAL: the database system is shutting down` in Chinese won't turn up in a Google search.

## Integration with Remote Agent

This is where things get interesting.

I wrote previously about the [Remote Agent auto-development pipeline](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline) — using `/publish-tasks` to publish engineering tasks from OpenSpec as GitHub issues with an `auto` label, which a Scheduled Remote Agent scans every 2 hours, implements automatically, and opens PRs for.

Issues created by `/file-bug-issue` are tagged with a `bug` label, not `auto`. That's intentional — not every bug should be handed off to AI for automatic repair. But if you decide a particular bug's fix is clear-cut (like the CI issue above — just add one line: `shm_size: 256mb`), you can manually add the `auto` label, and the Remote Agent will pick it up on its next scan.

```
Debug conversation
    ↓
/file-bug-issue → GitHub Issue (bug label)
    ↓
Human judgment: can AI fix this?
    ↓
Yes → add auto label → Remote Agent auto-fixes → opens PR
No  → handled by humans
```

This is safer than having AI automatically fix every bug. Some bugs involve architectural decisions, cross-project coordination, or simply need more information before you can determine the right fix. Humans filter first; AI executes.

## When to Use It

Not every bug warrants an issue. These scenarios are the sweet spot:

| Scenario | Why it fits |
|----------|-------------|
| Persistent CI failures | Root cause found, but the fix needs time or coordination |
| Environment issues | Docker, cloud services, third-party tools — usually not a one-line fix |
| Cross-project bugs | Requires changes in other subprojects you don't own |
| Non-urgent but forgettable | Doesn't block current work, but you'll definitely forget in three days |

Not a good fit: bugs you're actively fixing right now (just fix it), single-character typos, issues someone else is already handling.

## The Skill Itself

The skill is actually quite short. The core logic is simply telling Claude what to collect, how to structure it, and which command to use to create the issue. It's not a program — it's a structured set of instructions.

```
1. Collect from conversation: error symptoms, reproduction steps, attempted fixes, related files, environment
2. Ask for repo → verify with gh repo view
3. Ensure bug label exists
4. Draft → preview → confirm
5. gh issue create
6. Report the link
```

This is the design philosophy behind Claude Code skills — you don't need to write complex code. Just write down "what would an experienced engineer do here" as a sequence of steps, and the AI follows through. The hardest part isn't the technical implementation; it's thinking clearly about what the workflow should be.

## From Conversation to Tracking to Fix

Here's the full bug-handling workflow as it stands now:

```
Encounter bug
    ↓
Debug in Claude Code (analyze, try fixes)
    ↓
Fixed → commit → done
Can't fix → /file-bug-issue → GitHub Issue
                ↓
          Simple + clear → add auto label → Remote Agent auto-fixes
          Needs judgment → handled by humans
                ↓
          Worth documenting → /post → write it up
```

Three skills, each owning one segment: `/file-bug-issue` handles tracking, Remote Agent handles execution, `/post` handles knowledge capture. They're not one big system — they're three small independent tools, connected by GitHub issues and labels.

This loose coupling is easier to maintain. If any one skill breaks or becomes unnecessary, just remove it. The others are unaffected.

## References

- [Claude Code Official Docs](https://docs.anthropic.com/en/docs/claude-code)
- [GitHub CLI (gh) Official Docs](https://cli.github.com/manual/)
- [GitHub Issues Official Docs](https://docs.github.com/en/issues)
- [Automated Overnight Development with Claude Code Remote Agent](/posts/tech/deep-dive/2026-03-27-remote-agent-auto-dev-pipeline) — the complete flow for Remote Agent picking up issues and opening PRs
- [Claude Code's Three-Layer Quality Defense: Hooks, Skills, and Instruction Files](/posts/tech/deep-dive/2026-03-26-claude-code-hooks-skills-agents-md) — design differences and how skills and hooks complement each other
- [AI-Driven Development from OpenSpec to Automated Deploy](/posts/tech/deep-dive/2026-03-27-ai-driven-dev-workflow-openspec-to-deploy) — the full eight-stage development pipeline
- [Conversation as Documentation: Turning Debug Sessions into Posts with Claude Code](/posts/tech/guide/2026-03-13-conversation-as-documentation) — another skill for extracting knowledge from conversations
