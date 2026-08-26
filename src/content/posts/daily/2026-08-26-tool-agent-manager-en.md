---
title: "Tool Pick | agent-manager — Wrangle All Your Coding Agent Terminal Tabs Into One tmux TUI"
date: 2026-08-26
category: daily
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "agent-manager is a Go-based tmux TUI that unifies management of multiple coding agent sessions (Claude Code, Codex, OpenCode, etc.) — one-key replies, one-key worktree creation, full-file diff with inline comments sent back to the agent"
tldr: "agent-manager is a terminal UI built on top of tmux that tracks the status of multiple AI coding agent sessions at once. Install: brew install yoanwai/tap/agent-manager. It solves the problem of juggling terminal tabs to figure out which agent is stuck and which one is done."
series:
  name: "AI Tool of the Day"
  order: 11
---

> 🌏 [中文版](/posts/daily/2026-08-26-tool-agent-manager)

## Tool Info

| Field | Value |
|---|---|
| Name | agent-manager |
| Type | CLI / Terminal UI (multi coding-agent session manager, built on tmux) |
| GitHub | [YoanWai/agent-manager](https://github.com/YoanWai/agent-manager) |
| Stars | 345 |
| Language | Go (Bubble Tea TUI on top of tmux) |
| License | Apache-2.0 |
| Install | `brew install yoanwai/tap/agent-manager` |

## What Problem It Solves

You've got three or four terminal tabs open, each running a Claude Code or Codex session, and every few minutes you're switching between them to check — "Is this one done?" "Is that one stuck waiting for my input?" Once you have enough tabs, status tracking becomes pure memory. And the diffs each agent generates can only be viewed line-by-line in their own pane — if you want to leave feedback, you're copy-pasting and re-explaining.

agent-manager wraps each agent session into a tmux session (on a dedicated `agentmgr` tmux server, so it won't collide with your own tmux sessions), then displays all session statuses in a single view as a collapsible project tree. Press `space` to send a message into the selected session without attaching to it; press it on a group row to spawn a new agent with that prompt. The input box stays open after you hit enter, so you can dispatch multiple tasks to different agents in quick succession. The killer feature is `ctrl+r` review mode: full-file diff with syntax highlighting and change-line coloring. Press `c` to leave an inline comment, press `C` to bundle all comments into a single message sent back to the agent's pane — the agent starts processing immediately while the view updates in real time. It also registers its own MCP server into every launched session, so agents themselves can call `create_session` and `send_session` to spawn sub-tasks or message other agents.

Best for: developers who use tmux, run two or more coding agent CLIs in parallel (Claude Code, Codex, OpenCode, Gemini CLI, etc.), want a unified "who's done, who's stuck" view, and frequently do diff reviews. Currently macOS / Linux only; Windows requires WSL2.

## Quick Start

### Installation

```bash
# Homebrew (macOS / Linux, installs tmux automatically)
brew install yoanwai/tap/agent-manager

# Or use the install script (downloads the platform-specific release and verifies checksum)
curl -fsSL https://raw.githubusercontent.com/YoanWai/agent-manager/main/install.sh | sh
```

Dependencies: tmux 3.1+, git. Homebrew handles them automatically; the install script detects your system package manager (apt/dnf/pacman/zypper/apk) and prompts with the install command.

### Basic Usage

```bash
# Launch the management interface
agent-manager
```

| Key | Action |
|---|---|
| `n` | New session (pick agent tool, directory, group; optionally with an initial prompt) |
| `space` | Quick prompt: reply to the selected session, or spawn a new agent on a group row |
| `ctrl+r` | Enter full-file diff review for the session; `c` to leave inline comments, `C` to send comments back to the agent |
| `x` / `v` | Kill a session to free resources / revive with the same conversation |
| `alt+w` | Open a new git worktree for the agent from the quick prompt |
| `?` | Full keybinding reference (searchable) |

### Advanced Usage

Every session launched gets agent-manager's built-in MCP tools, so the agent itself can operate the workspace:

```
create_session   # Spawn another agent with a task name, auto-creates worktree if needed
send_session     # Queue a message to another agent, delivered when it's idle
create_terminal  # Open a user-visible shell under the current session or a group
review           # Declare the repo / merge base / diff range to review
```

For example, if an agent determines a sub-task should be handed off to another agent, it can call `create_session` directly to spin up a new session with the task description — no need for a human to press `n`.

## Comparison With Existing Tools

The three tools most commonly compared in the "multi-agent CLI orchestration" space are agent-manager, Pane, and Golutra. agent-manager is the lightest of the three, built directly on top of tmux.

| | agent-manager | Pane | Golutra | Plain tmux |
|---|---|---|---|---|
| Architecture | Go TUI + tmux | Electron desktop app | Tauri (Rust + Vue3) desktop app | Native tmux |
| Session isolation | tmux session | Git worktree (auto-created) | Terminal pane | Manual |
| Full-file diff + inline comments sent to agent | ✅ | ✅ (GUI) | Requires integration | ❌ |
| Agent operates the manager via MCP | ✅ (spawn/message/review) | Has its own CLI (runpane) | Forwards agent's own | ❌ |
| Cross-platform | macOS / Linux (Windows needs WSL2) | macOS / Windows / Linux | macOS / Windows / Linux | Depends on tmux |
| Remote access | tmux detach/attach | Self-hosted daemon + mobile browser | Planned | tmux detach/attach |
| GitHub Stars (2026-08) | 345 | 339 | 3,800 | — |

## Caveats

- **Features the project itself lists as missing**: cost tracking (how many tokens/dollars an agent spent) and mouse navigation are not yet implemented. If either is a hard requirement, the official docs suggest checking the comparison page for alternatives.
- **Windows requires WSL2**: agent-manager is built on tmux, which doesn't run natively on Windows — you need a WSL2 environment.
- **Actively evolving**: There are 24 open issues on GitHub. The `n`/`enter`/`←`/`→` keybindings are marked "in beta" by the maintainers and can be toggled off in Settings. Watch for keybinding changes across versions.
- **Expanded agent autonomy**: The MCP tools let agents spawn new sessions and message other agents on their own, effectively delegating "create new tasks" authority to the agents themselves. In multi-agent setups, be aware this may exceed what you originally intended.

## Takeaway

When people talk about "running multiple AI coding agents," the conversation usually gravitates toward agent frameworks and SDKs (LangGraph, CrewAI, and the like). But in practice, the real productivity bottleneck is a layer below that — "how do I watch several agent CLIs running at the same time, know which one is stuck and which one is done, and send review feedback back?" Tools like agent-manager represent a new category distinct from agent development frameworks: workspace management for agent sessions.

## References

- [YoanWai/agent-manager GitHub repo](https://github.com/YoanWai/agent-manager): README, keybinding reference, MCP tools documentation, license (Apache-2.0), stars/forks — all from the official repo.
- [agent-manager.dev official docs](https://agent-manager.dev/docs/install/): Installation methods, dependencies (tmux 3.1+, git), feature descriptions.
- [agent-manager.dev official comparison page](https://agent-manager.dev/compare/): Feature comparison with herdr, Agent of Empires, agent-deck, Vibe Kanban, claude-squad, and plain tmux.
- [Multi-Agent CLI Orchestration Tools Compared: Agent-Manager, Pane, and Golutra in 2026 — Developers Digest](https://www.developersdigest.tech/blog/multi-agent-cli-orchestration-tools-compared-2026): Architecture, stars, and license comparison of three multi-agent CLI orchestration tools (published 2026-07-30).
