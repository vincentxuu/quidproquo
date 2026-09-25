---
title: "Tool Pick｜terminal-mcp — Giving Agents a Screen to Read, Not Just Command Output"
date: 2026-09-26
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server that exposes a real PTY through full VT100/ANSI terminal emulation, so agents can drive full-screen TUI programs like vim and htop, take screenshots, and record sessions for replay"
tldr: "terminal-mcp is an MCP server that exposes a real terminal (a PTY behind full xterm.js emulation) so an agent can operate interactive CLIs and full-screen TUI programs the way a human does. Install: npm install -g @ellery/terminal-mcp. It solves the problem of ordinary shell-exec tools getting stuck or misreading output whenever a command hits an interactive prompt or a full-screen redraw."
series:
  name: "AI Tool of the Day"
  order: 37
---

> 🌏 [中文版](/posts/daily/2026-09-26-tool-terminal-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | terminal-mcp |
| Type | MCP server |
| GitHub | [elleryfamilia/terminal-mcp](https://github.com/elleryfamilia/terminal-mcp) |
| Stars | 140 |
| Language | TypeScript |
| License | MIT |
| Install | `npm install -g @ellery/terminal-mcp` |

## What Problem It Solves

Most tools agents use to run commands are, under the hood, one-shot exec: send a string, wait for the process to exit, scrape stdout. That works fine for `npm install` or `git status`, but it breaks the moment a command turns interactive — `docker exec -it` into a container, `git rebase -i` opening an editor, an installer asking for `y/N`, `ssh` waiting on a password, or anything that needs a full-screen redraw like `htop`, `vim`, `less`. The agent either gets back a soup of ANSI escape codes or just times out, because it has no way to know whether to wait, how long, or what the screen actually looks like right now.

terminal-mcp's approach is to stop treating the terminal as a pipe and treat it as a screen. It spawns a real pseudo-terminal via `node-pty` (macOS, Linux, and Windows via ConPTY), then wraps it in a full VT100/ANSI terminal emulator using `@xterm/headless` — meaning it tracks cursor position, handles screen redraws, and remembers the color and style of every cell on screen, exactly like a real terminal would. What the agent gets back isn't a byte stream but a snapshot of "what the screen looks like right now": `getContent` (the plain-text buffer) and `takeScreenshot` (either JSON with reconstructed ANSI colors, or an actual PNG image). Input goes the other way too — `type` sends text, `sendKey` sends special keys like `Ctrl+C`, `ArrowUp`, or `Enter`, matching how a human would drive the same terminal. It supports multiple independent sessions (five by default, addressed by `sessionId`), and it can record an entire session to the asciicast format for later playback with `asciinema` — useful for auditing exactly what an autonomous agent did on a machine, or for capturing a debugging walkthrough as a demo.

Good fit for: debugging or driving full-screen TUI programs (`vim`, `htop`, `k9s`); CI/CD pipelines or containers with no TTY that still need to answer interactive prompts mid-run; recording an agent's terminal session for later replay or audit; running a long build in one session while diagnostics run in another, isolated shell at the same time.

## Getting Started

### Install

```bash
# Global install
npm install -g @ellery/terminal-mcp

# Or via install script
curl -fsSL https://raw.githubusercontent.com/elleryfamilia/terminal-mcp/main/install.sh | bash

# Auto-detect installed MCP clients (Claude Code, Codex, Gemini CLI, etc.) and wire them up
terminal-mcp setup --dry-run   # preview first
terminal-mcp setup             # actually write config
```

### Basic Usage

```json
// .mcp.json — headless mode: single process, embedded PTY, no TTY required, works in CI/containers
{
  "mcpServers": {
    "terminal": {
      "command": "terminal-mcp",
      "args": ["--headless", "--cols", "120", "--rows", "40"]
    }
  }
}
```

```jsonc
// The three core tools an agent actually calls
{ "name": "type", "arguments": { "text": "htop" } }
{ "name": "sendKey", "arguments": { "key": "Enter" } }
{ "name": "takeScreenshot", "arguments": { "format": "text" } }
// Returns plain-text content, cursor position, and terminal dimensions —
// the agent reads a screen, not a raw output stream.
```

### Advanced Usage

```bash
# Enable sandbox mode to restrict what filesystem and network this PTY can touch
terminal-mcp --sandbox --sandbox-config ~/.terminal-mcp-sandbox.json
```

```json
{
  "filesystem": {
    "readWrite": [".", "/tmp", "~/.cache"],
    "readOnly": ["~"],
    "blocked": ["~/.ssh", "~/.aws", "~/.gnupg"]
  },
  "network": { "mode": "all" }
}
```

## Comparison with Existing Tools

| | terminal-mcp | mcp-tty | iterm-mcp |
|---|---|---|---|
| Correctly renders full-screen TUI (vim, htop) | ✅ full VT100 emulation | ❌ README states ANSI is stripped, full-screen output won't render | Depends on the actual iTerm window, not an independent emulation |
| Cross-platform | ✅ macOS/Linux/Windows | ✅ macOS/Linux/Windows | ❌ macOS only, requires iTerm2 installed |
| Headless/CI use with no TTY | ✅ `--headless` single process | ✅ | ❌ requires a running iTerm2 app |
| Multiple independent sessions | ✅ up to 5, `createSession`/`destroySession` | ✅ named sessions | ❌ drives whichever single iTerm tab you currently have |
| Screenshot (PNG) | ✅ | ❌ | ❌ |
| Session recording/replay (asciicast) | ✅ | ❌ | ❌ |
| Sandboxed filesystem/network | ✅ macOS Seatbelt / Linux bubblewrap | ❌ | ❌ |

## Things to Watch For

- **Pick the right mode**: the default is a dual-process "interactive + client" architecture that needs a real TTY already open. CI, containers, and other headless automation must explicitly pass `--headless`, or the process will just sit waiting on a socket.
- **PNG screenshots need an extra dependency**: `takeScreenshot`'s `png` format requires `@resvg/resvg-js`, which isn't installed by default — you'll only find out when the call fails.
- **Sandbox mode degrades gracefully on Windows**: the README is explicit that Windows has no Seatbelt/bubblewrap equivalent, so `--sandbox` effectively runs unsandboxed there. Don't assume the same isolation strength across all three platforms.
- **Solo-maintained project**: 140 stars, 15 forks, not an official Anthropic project — maintained by a single developer (elleryfamilia). Keep an eye on release cadence and issue response time before adopting it for anything critical.

## Today's Takeaway

Most "let an agent drive a terminal" tools solve "how do I send a command in and scrape the output back out" — which still treats the terminal as a pipe. terminal-mcp goes the other way: it fully reconstructs cursor position, screen redraws, and cell-level color attributes, so what the agent sees is "what the screen looks like right now" instead of "what this process printed." That distinction is invisible most of the time, but the moment an agent needs to debug a full-screen TUI program or respond to an interactive prompt, the usability gap becomes immediately obvious — a linear text stream simply can't express where the cursor moved or which line got redrawn, while a screen snapshot can.

## References

- [elleryfamilia/terminal-mcp — GitHub](https://github.com/elleryfamilia/terminal-mcp)
- [terminal-mcp GitHub API metadata (license/stars/created date)](https://api.github.com/repos/elleryfamilia/terminal-mcp)
- [7ez/mcp-tty — GitHub](https://github.com/7ez/mcp-tty)
- [ferrislucas/iterm-mcp — GitHub](https://github.com/ferrislucas/iterm-mcp)
