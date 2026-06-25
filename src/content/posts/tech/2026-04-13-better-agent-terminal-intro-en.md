---
title: "Better Agent Terminal: Consolidate Multiple Project Terminals and Claude Code Agents into One Window"
date: 2026-04-13
type: guide
category: tech
tags: [claude-code, electron, terminal, developer-tools, agent, xterm, tony1223]
lang: en
tldr: "Better Agent Terminal (BAT) is an Electron desktop app that unifies multiple project workspaces, terminals, and Claude Code Agents into a single window — solving the everyday pain of exploding iTerm tabs and the lack of a proper GUI container for agents. MIT License, available on macOS, Windows, and Linux."
description: "Better Agent Terminal is a cross-platform desktop tool built by tony1223. Using Electron + React, it wraps xterm.js, a Git browser, a snippet manager, and Claude Code Agent into one app. This post covers its design philosophy, core features, and ideal use cases."
draft: false
---

🌏 [中文版](/posts/tech/2026-04-13-better-agent-terminal-intro)

When you're juggling three or four projects at once, iTerm or Windows Terminal tabs spiral out of control fast — each project spawns its own cluster of tabs (server, tests, git), and you're constantly trying to remember which window belongs to which repo. Add Claude Code to your daily workflow and things get worse: the agent eats up yet another dedicated terminal, turning your desktop into a chaos of overlapping windows.

[Better Agent Terminal](https://github.com/tony1223/better-agent-terminal) (BAT for short) is an Electron desktop app built by tony1223 with a straightforward idea: **bring workspaces, terminals, and Claude Code Agent together in one window, so switching between projects feels as natural as switching browser tabs**.

## What Problem It Solves

A typical engineer's day might look something like this:

- VS Code in one window, iTerm in another, with two or three tabs per project (server, test, git)
- A separate tab to run Claude Code as an agent, with conversation history tangled up with terminal output
- Switching projects means switching `cwd`, env vars, and Node versions
- Agent thinking blocks, token usage, and permission prompts are all buried in a plain-text interface that's hard to scan

BAT's design premise is: **the terminal is a tool, but the "project (workspace)" is what you actually care about**. So it elevates workspace to a first-class citizen. Each workspace can hold multiple terminals, its own environment variables, and its own profiles (local or remote). Switching workspaces switches the entire context in one shot.

## The Workspace Model

Workspace is the central concept in BAT. Key design decisions:

- **Folder-based organization**: Each workspace maps to a project directory. Once configured, you never have to `cd` again.
- **Groups and filtering**: When workspaces pile up, you can organize them into groups and filter via dropdown — no endless scrolling.
- **Drag-to-reorder**: Pin your most-used workspaces to the top.
- **Per-workspace environment variables**: Each workspace has isolated env vars that don't bleed into each other.
- **Profile switching**: A single workspace can have a "local" and a "remote" profile. Flip the profile to jump onto an SSH machine.
- **Detachable windows**: Any workspace can be popped out into its own window (handy for dual monitors) and automatically re-attaches when you restart the app.

This is especially useful when running multiple projects in parallel, or when you need to context-switch between local development and a production hotfix.

## Terminal and Built-in Tools

The terminal itself is built on `xterm.js + node-pty` with full Unicode and CJK support. But BAT treats the terminal as just one panel inside a workspace — alongside several other dev utilities:

- **Split panel layout**: 70% for the main terminal, 30% for a thumbnail strip showing the tail output of multiple terminals simultaneously.
- **File browser**: Click a file to preview it inline via highlight.js, no need to switch to your editor just to peek at some code.
- **Git integration**: Commit log, diff, branch list — and commits can be opened on GitHub in one click.
- **Snippet manager**: Backed by SQLite, with categories and favorites for frequently used commands or prompts. No more digging through `.zsh_history` or scattered notes.

None of these features are remarkable in isolation, but within the "single window, workspace-aware" context, they replace the combination of iTerm + GitHub Desktop + some snippet app — meaningfully reducing friction.

## Claude Code Agent Integration

This is where BAT diverges most from other terminal tools. It embeds `@anthropic-ai/claude-agent-sdk` directly into the app — no need to open a separate terminal and run `claude`.

Specifically, it adds:

- **Streaming message display**: Output isn't just dumped as raw text; it's rendered with structure.
- **Collapsible extended thinking**: Claude's reasoning blocks can be folded away so they don't flood the interface.
- **Visualized tool permissions**: Every tool call can be individually approved, or set to auto-approve mode. Far clearer than the CLI's raw `y/n` prompt.
- **Session persistence**: Close the app and reopen — you can resume a previous conversation.
- **Status line**: Real-time display of token usage and cost for the current session. Something you'd have to calculate yourself in the native CLI.
- **Account switching**: `/login`, `/logout`, and `/whoami` commands work natively, so switching between personal and work accounts is a config change, not an env var dance.
- **Image attachments**: Attach up to 5 images per message — useful for dropping screenshots to the agent for analysis.
- **Clickable file paths**: File references like `src/foo.ts:42` in agent output are clickable and open in a modal preview.

If you've found the Claude Code CLI adequate but always dreaded scrolling back through walls of thinking output — or constantly forget which account you're under — BAT's GUI is built exactly for those pain points.

## Experimental Remote Access

BAT also ships an experimental WebSocket server. When enabled, it generates a connection token (with QR code) that lets another BAT instance or a phone connect and control the session remotely.

The project recommends pairing this with **Tailscale** for cross-network access — no port forwarding required, leveraging Tailscale's WireGuard mesh for peer-to-peer connectivity, with better security and far lower setup cost than rolling your own reverse proxy.

This feature is still experimental, best suited for scenarios like "I'm away and need to debug the build server at home." For serious production remote pairing, more mature solutions are still recommended.

## Tech Stack

The app runs on a standard Electron + React combination:

- **Electron 28** + **React 18** + **TypeScript**
- Terminal: `xterm.js` + `node-pty`
- Agent: `@anthropic-ai/claude-agent-sdk`
- Storage: `better-sqlite3` (snippets, sessions)
- Remote: `ws` + `qrcode`
- Preview highlighting: `highlight.js`
- Bundling: `Vite 5` + `electron-builder`

```
┌──────────────────────── BAT Window ────────────────────────┐
│ ┌─ Workspaces ─┐ ┌───────── Active Workspace ─────────────┐ │
│ │ ▸ project-a  │ │ ┌── Terminal (70%) ──┐ ┌ Thumbs (30%) ┐│ │
│ │ ▸ project-b  │ │ │ $ pnpm dev         │ │ term-2 tail  ││ │
│ │ ▾ project-c  │ │ │ ...                │ │ term-3 tail  ││ │
│ │   ├ local    │ │ └────────────────────┘ └──────────────┘│ │
│ │   └ remote   │ │ ┌── Agent Panel (Shift+Tab) ──────────┐│ │
│ └──────────────┘ │ │ Claude Code · tokens · $0.23        ││ │
│                  │ │ [thinking ▸] [tool approve]         ││ │
│                  │ └─────────────────────────────────────┘│ │
│                  └────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## Installation

Several installation methods are supported:

```bash
# macOS (recommended)
brew tap tonyq-org/tap && brew install --cask better-agent-terminal

# One-line install script (macOS / Linux)
curl -fsSL https://raw.githubusercontent.com/tony1223/better-agent-terminal/main/install.sh | bash
```

Windows uses an NSIS installer; Linux has an AppImage — both available on the Releases page. Building from source is also supported, requiring Node.js 18+.

## Keyboard Shortcuts Worth Remembering

| Shortcut | Action |
|----------|--------|
| `Ctrl+`` | Toggle agent / terminal |
| `Shift+Tab` | Switch between terminal and agent mode |
| `Ctrl+P` | File picker |
| `Ctrl+↑` / `Ctrl+↓` | Previous / next workspace |

The keyboard-first workflow feels close to VS Code — once you're used to it, you barely touch the mouse.

## Who It's For

- **Engineers maintaining multiple projects simultaneously**: The workspace model maps directly onto the tab-explosion problem.
- **Heavy Claude Code users**: Anyone who wants a GUI to visualize thinking blocks, track token usage, and manage multiple accounts.
- **People doing local + remote hybrid development**: The profile switching + Tailscale remote combination is genuinely useful.
- **Anyone who wants one app to handle most terminal work**: Built-in Git, file preview, and snippets reduce context switching.

Less suited for:

- **CLI purists**: If Electron isn't your thing, this isn't your app.
- **People not using Claude Code**: Agent integration is BAT's biggest differentiator. Without it, BAT has no decisive edge over modern terminals like [Warp](https://www.warp.dev/) or [Wave](https://www.waveterm.dev/).
- **Anyone sensitive to Electron's memory overhead**: This is the classic Electron tax, and BAT doesn't escape it.

## Overall

BAT's core trade-off is explicit: **pay the Electron cost (memory, install size) to get workspace abstraction and a native GUI for Claude Code Agent**. If you find yourself at the intersection of "iTerm tab explosion" and "Claude Code CLI output is painful to read," it's probably the most targeted solution available right now.

It's also MIT licensed with public source — if something bothers you, just fork it. For heavy Claude Code users, spending a week with it is well worth the install.

## References

- [better-agent-terminal — GitHub Repo](https://github.com/tony1223/better-agent-terminal)
- [Claude Agent SDK — Anthropic Docs](https://docs.claude.com/en/api/agent-sdk/overview)
- [xterm.js](https://xtermjs.org/)
- [node-pty](https://github.com/microsoft/node-pty)
- [Electron](https://www.electronjs.org/)
- [Tailscale](https://tailscale.com/)
