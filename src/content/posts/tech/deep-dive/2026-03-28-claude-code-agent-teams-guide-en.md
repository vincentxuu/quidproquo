---
title: "Claude Code Agent Teams: Running Multiple AI Agents as a Collaborative Team"
date: 2026-03-28
type: guide
category: tech
tags: [claude-code, agent-teams, multi-agent, parallel-execution, ai-agent, dx]
lang: en
tldr: "Agent Teams lets you spin up multiple Claude Code instances working simultaneously — one acts as team lead to delegate tasks, while teammates execute independently, communicate with each other, and share a task list. Great for parallel code review, competing-hypothesis debugging, and cross-layer development. Currently an experimental feature."
description: "A deep dive into Claude Code's Agent Teams feature: multi-agent collaboration architecture, Team Lead and Teammate roles, shared task lists, inter-agent messaging, display modes (in-process vs tmux split panes), comparison with sub-agents, and real-world use cases."
draft: true
series:
  name: "Claude Code Automation Guide"
  order: 12
---

> 🌏 [中文版](/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide)

<!-- TODO: Content pending -->
<!-- Reference official docs: https://code.claude.com/docs/en/agent-teams.md -->

## Planned Outline

### What Are Agent Teams
- Multiple Claude Code instances forming a collaborative team
- Team Lead + Teammates architecture
- Key difference from Sub-agents: teammates can communicate with each other, while sub-agents only report back to the main agent
- Experimental feature — requires manually enabling `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`

### When to Use Agent Teams
- Research & Review: multiple agents reviewing from different angles simultaneously
- New feature development: each teammate owns a different module
- Competing-hypothesis debugging: multiple teammates test different theories and challenge each other
- Cross-layer coordination: one teammate each for frontend, backend, and testing
- When NOT to use: sequential tasks, editing the same file, work with many dependencies

### Launching Your First Agent Team
- Set `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS: "1"` in settings.json
- Describe the task and team structure in natural language
- Claude automatically creates the team, spawns teammates, and coordinates the work

### Controlling Your Agent Team

#### Display Modes
- **In-process**: all teammates share the same terminal; use Shift+Down to switch between them
- **Split panes**: each teammate gets its own tmux/iTerm2 pane so you can see all output at once
- `teammateMode` setting: `"auto"` / `"in-process"` / `"tmux"`

#### Specifying Teammates and Models
- Specify the number and roles in natural language
- You can assign a specific model to each teammate (e.g., Sonnet)

#### Task Management
- Shared task list: pending → in progress → completed
- Task dependencies: incomplete dependencies block downstream tasks
- Lead assigns tasks vs. teammates self-assigning
- File locking prevents multiple teammates from claiming the same task simultaneously

#### Talking Directly to Teammates
- In-process: Shift+Down to switch, Enter to inspect, Escape to interrupt
- Split panes: click on the pane to interact directly

#### Plan Approval
- Require teammates to submit a plan before starting implementation
- Lead reviews and approves before work begins
- Approval criteria can be customized (e.g., "must include tests")

### Architecture Details
- Team Lead: the main session that creates the team, spawns teammates, and coordinates
- Teammates: independent Claude Code instances
- Task List: shared task list stored at `~/.claude/tasks/{team-name}/`
- Mailbox: the inter-agent messaging system
- Team config: `~/.claude/teams/{team-name}/config.json`

### Inter-Agent Communication
- Automatic message passing — no polling required
- Idle notifications: teammates automatically notify the lead when they finish
- `message` vs `broadcast`
- Permission inheritance: teammates inherit the lead's permission settings

### Hooks Integration
- `TeammateIdle`: fires when a teammate is about to go idle
- `TaskCreated`: fires when a task is created
- `TaskCompleted`: fires when a task is completed
- Exit code 2 can block and provide feedback

### Real-World Examples

#### Parallel Code Review
```
Create an agent team to review PR #142:
- Security reviewer
- Performance reviewer
- Test coverage reviewer
```

#### Competing-Hypothesis Debugging
```
Spawn 5 teammates to investigate different hypotheses.
Have them debate and disprove each other's theories.
```

### Best Practices
- Give teammates enough context (they do not inherit the lead's conversation history)
- Optimal team size: 3–5 members, with 5–6 tasks each
- Right-size tasks: not too small (overhead outweighs benefit) and not too large
- Avoid file conflicts: each teammate should own different files
- Monitor and adjust regularly

### Limitations
- Session resumption is not supported (in-process teammates)
- Task status updates may be delayed
- Shutting down teammates can be slow
- Only one team per session
- Nested teams are not supported
- The lead role cannot be transferred
- Split panes require tmux or iTerm2

### Agent Teams vs Sub-agents Comparison

| | Sub-agents | Agent Teams |
|---|---|---|
| Context | Independent; results returned to the caller | Independent; fully isolated |
| Communication | Reports back to the main agent only | Teammates communicate directly with each other |
| Coordination | Main agent manages all work | Shared task list; self-coordinating |
| Best for | Focused tasks where only the result matters | Complex work requiring discussion and collaboration |
| Token cost | Lower | Higher |

## References

- [Claude Code Overview](https://docs.anthropic.com/en/docs/claude-code/overview) — Official Claude Code overview covering agent architecture and multi-session collaboration
- [Claude Code Common Workflows](https://docs.anthropic.com/en/docs/claude-code/common-workflows) — Official workflow guide including parallel sessions and git worktree usage
- [Claude Code Best Practices](https://docs.anthropic.com/en/docs/claude-code/best-practices) — Best practices for multi-agent parallel development, including the Writer/Reviewer pattern
- [Claude Code Settings](https://docs.anthropic.com/en/docs/claude-code/settings) — Settings reference for `teammateMode` and other agent teams configuration options
- [anthropics/claude-code-action on GitHub](https://github.com/anthropics/claude-code-action) — Claude Code Action source code demonstrating multi-agent automation in practice
- [Building effective agents — Anthropic](https://www.anthropic.com/research/building-effective-agents) — Anthropic research article on design principles and coordination patterns for multi-agent systems
- [Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) — Documentation for agent teams hooks: `TeammateIdle`, `TaskCreated`, `TaskCompleted`
