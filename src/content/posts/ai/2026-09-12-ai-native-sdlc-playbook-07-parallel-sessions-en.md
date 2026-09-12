---
title: "AI-Native SDLC Playbook L7: Parallel Sessions and Subagents"
date: 2026-09-12
category: ai
type: guide
tags: [claude-code, sdlc, claude-academy, parallel-sessions, subagent, worktree]
lang: en
tldr: "One engineer runs multiple Claude Code sessions simultaneously, each in its own git worktree; repetitive verification work goes to subagents. The bottleneck shifts from 'writing code' to 'reviewing output.'"
description: "Claude Academy AI-Native SDLC Playbook Lesson 7 guide: using parallel sessions and subagents to multiply an engineer's throughput, plus real-world worktree pitfalls to watch for."
draft: false
series:
  name: "AI-Native SDLC Playbook"
  order: 7
---

Traditional development follows a linear rhythm — one engineer works on one task, waiting for builds, tests, and reviews, filling the gaps with context switches that carry cognitive overhead. When an AI agent handles implementation, those idle periods stop being mandatory pauses and become windows to kick off the next task.

[Claude Academy Lesson 7](https://academy.claude.com/courses/ai-native-sdlc-playbook/parallel-sessions-and-subagents) shows how to put this into practice: run parallel sessions to advance multiple tasks simultaneously, and use subagents to handle repetitive work within each task.

## Parallel Sessions vs Subagents

The course draws a clear boundary right at the start:

> "Parallel sessions raise the number of tasks an engineer can have in flight, while subagents keep each session focused on its own task."

A **parallel session** is a fully independent Claude Code instance running in its own git worktree, working on a different task. The engineer is the only connecting point — you switch between terminals, checking progress, giving directions, and reviewing output.

A **subagent** is a helper role within a single session, with its own context window and tool limits, handling repetitive subtasks. A typical example is a "verifier" — after every code change, it runs the app, tests the changed behavior, and reports results. Delegating this to a subagent is more consistent than describing the steps manually every time.

## How to Get Started

### Split Tasks from Plan Mode

Parallelization requires that tasks don't conflict on files. The course recommends starting from the plan mode output (`plan.md`), splitting work into independent chunks — tasks touching different files can run in parallel; those sharing files stay in a single session and run sequentially.

### Isolate with Worktrees

Each task launches in a dedicated worktree:

```bash
claude --worktree feature-auth
claude --worktree fix-rate-limit
```

Each worktree is a separate checkout on its own branch, with filesystem-level isolation. Two sessions can never modify the same file simultaneously.

### Start with 2–3 Sessions

The course specifically warns against opening too many sessions at once. The practical ceiling depends on your review capacity — only add sessions when reviews keep pace. Running 5 sessions but having no time to review the output is just manufacturing tech debt.

### Turn Repeated Work into Subagents

Recurring work patterns can be encoded as subagents. Place a Markdown file in `.claude/agents/`, defining a name, description, and allowed tools:

```markdown
---
name: verifier
description: Runs the app and checks the change works before the session reports done
tools: Bash, Read
---

Start the app with make run. Exercise the changed behavior and the two
nearest neighboring flows. Report what you ran, what you saw, and any
behavior that does not match plan.md. Do not fix anything; report only.
```

Note the last sentence: "Do not fix anything; report only." This constraint matters — the verifier only reports; whether to fix is the engineer's or main session's decision. Separation of concerns keeps each role's behavior predictable.

## Governance: All Sessions Play by the Same Rules

Parallelization risks a flood of output with inconsistent quality. The course's answer is straightforward: repository hooks and permission settings apply uniformly to every session. Rules set in `.claude/settings.json` — which paths are off-limits, which checks run before commit — every session in every worktree follows them.

Activity is also attributed to the launching engineer. PRs from multiple sessions all carry the same author, and review responsibility doesn't disappear because "the AI wrote it."

## Real-World Pitfalls

We used worktrees for parallel development in a mid-sized project and hit several issues the course doesn't explicitly mention:

### Port Conflicts

Multiple worktrees running dev servers simultaneously will clash on default ports. Each worktree needs its own port assignment, or simply add to CLAUDE.md: "Check whether the port is in use before starting the dev server."

### Git Staging Races

This is the sneakiest pitfall. Between `git add` and the pre-commit hook there's a time window — during which another session's commit can "sweep up" your staged files.

Our solution is a discipline: **always use `git commit -- <explicit-paths>` instead of bare `git commit`**, specifying exactly which files to commit. After committing, verify with `git log --oneline -1` that it's your commit. If push is rejected, `git pull --rebase`.

This rule ended up written directly into CLAUDE.md, so every session follows it automatically.

### Review Is the Real Bottleneck

The course's advice — "only add sessions when reviews keep pace" — isn't a platitude. We tried running 4 sessions simultaneously; output velocity was impressive, but reviews piled up until the next day. By merge time, conflicts were everywhere. We settled back to 2–3 sessions with a dedicated verifier subagent, and overall delivery actually became smoother.

## How to Measure Effectiveness

The course suggests tracking two metrics:

- **Leading indicator**: Concurrent sessions per engineer (from OpenTelemetry exports) and the ratio of active steering time to waiting time in a workday
- **Lagging indicator**: Changes merged per engineer per week, paired with rework rate (from PR history)

The goal isn't "more sessions is better" — it's finding the maximum number of parallel tracks you can sustain without increasing the rework rate.

## Getting Started

1. Make sure you have a well-maintained CLAUDE.md — all sessions read it; it's the foundation for consistency
2. Add commit discipline to CLAUDE.md: specify file paths, verify after commit
3. Start with 2 sessions: one for the main feature, one for bug fixes or tests
4. Turn the verification steps you repeat most often into your first subagent
5. After one week, check merge count and rework rate, then decide whether to add a third session

## References

- [Parallel sessions and subagents — Claude Academy](https://academy.claude.com/courses/ai-native-sdlc-playbook/parallel-sessions-and-subagents)
- [Claude Code Agents — Anthropic Docs](https://docs.anthropic.com/en/docs/claude-code/sub-agents)
- [Git Worktrees — Git Documentation](https://git-scm.com/docs/git-worktree)
- [AI-Native SDLC Playbook Course Guide](/posts/ai/2026-09-12-ai-native-sdlc-playbook-course-guide)
