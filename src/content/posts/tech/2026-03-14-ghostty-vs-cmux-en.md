---
title: "Ghostty vs cmux: A Guide to Choosing Your Modern Terminal"
date: 2026-03-14
type: guide
category: tech
tags: [ghostty, cmux, terminal, macos, ai-agent]
lang: en
tldr: "Ghostty is a fast, native, general-purpose terminal emulator. cmux is a terminal built on top of Ghostty, specifically designed for AI coding agents. They're not competitors — they operate at different layers."
description: "An overview of the Ghostty terminal emulator and cmux, covering their core features and the use cases each one is best suited for."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-14-ghostty-vs-cmux)

If you've been looking for an iTerm2 replacement, Ghostty is the standard answer. But if you're running multiple AI coding agents simultaneously, cmux is worth a closer look. This post breaks down the design philosophy, feature differences, and how to choose between the two.

## Ghostty

Ghostty was created by Mitchell Hashimoto, founder of HashiCorp, and quickly gained traction in the developer community after its public release in late 2024. Its positioning is clear: be fast, feature-complete, *and* native — not two out of three.

**Design Philosophy**

Most terminals make trade-offs between speed, features, and native experience. Ghostty's approach is to extract the core into `libghostty` (a C-compatible library), wrap it with Swift/AppKit on macOS and GTK on Linux, and use Metal (macOS) or OpenGL (Linux) for rendering. This lets it achieve GPU-accelerated rendering while maintaining a truly native UI — unlike Electron-based terminals that simulate native feel using web technologies.

**Core Features**

- **GPU-accelerated rendering**: The only terminal on macOS that supports both Metal and ligatures simultaneously — iTerm2 falls back to CPU rendering when ligatures are enabled
- **Zero-config out of the box**: Sensible defaults that just work, including built-in Nerd Fonts support — install and go
- **Native tabs and split panes**: Built with actual system UI components, not custom-drawn widgets
- **Deep macOS integration**: Quick Look, Force Touch, Secure Input API, and a drop-down terminal (Quake mode)
- **Rich themes**: Hundreds of built-in themes with automatic light/dark mode switching
- **libghostty**: Exposed as an embeddable library, enabling other terminal tools to build on top of this core

**Limitations**

macOS doesn't have a system-level "default terminal" setting, and Ghostty currently doesn't have a built-in option to set itself as default ([open feature request](https://github.com/ghostty-org/ghostty/discussions/7762)). If you want `.command` or `.tool` scripts to open in Ghostty by default, you'll need to manually configure file associations in Finder.

```bash
brew install --cask ghostty
```

## cmux

cmux is developed by [manaflow-ai](https://github.com/manaflow-ai/cmux), positioned as "a terminal for AI coding agents." It uses libghostty under the hood — also Swift + AppKit — so rendering performance is on par with Ghostty, but with an entire layer of agent workflow features built on top.

**Design Philosophy**

cmux describes itself as a primitive, not a solution. It provides the building blocks — terminal, browser, notifications, workspaces, split panes, CLI control interface — without prescribing a specific workflow. What agents you run and how you compose them is entirely up to you.

**Core Features**

- **Vertical sidebar tabs**: Each workspace shows live git branch, PR status, listening ports, and latest notifications — at a glance you can see which agent is busy with what
- **Smart notification system**: Supports OSC 9/99/777 terminal sequences; when an agent is waiting for input, the corresponding pane lights up with a blue ring and the tab highlights — `Cmd+Shift+U` jumps to the latest unread
- **Embedded scriptable browser**: Agents can screenshot the DOM, grab element refs, click, fill forms, and execute JS; the browser pane can be docked next to the terminal pane, letting Claude Code directly interact with your dev server
- **Socket control API**: The `cmux` CLI sends JSON messages to a Unix socket; the main app listens and updates the UI — everything is programmable: create workspaces, switch tabs, send keyboard events, open URLs
- **AI agent integration**: Native support for Claude Code, Codex, OpenCode, Gemini CLI, Aider, and Kiro

```bash
brew tap manaflow-ai/cmux && brew install --cask cmux
```

## Architecture Overview

```
┌─────────────────────────────────────┐
│              cmux                   │
│  ┌──────────┐  ┌───────────────┐    │
│  │ Sidebar  │  │  Terminal     │    │
│  │ Tab list │  │  (libghostty) │    │
│  │ + Notifs │  ├───────────────┤    │
│  └──────────┘  │  Browser      │    │
│                │  (scriptable) │    │
│                └───────────────┘    │
│         Socket API / CLI            │
└─────────────────────────────────────┘

         ↑ built on top of

┌─────────────────────────────────────┐
│           libghostty                │
│     (GPU rendering / terminal core) │
└─────────────────────────────────────┘
```

## Summary

| | Ghostty | cmux |
|--|---------|------|
| **Platform** | macOS + Linux | macOS only |
| **Purpose** | General-purpose terminal | AI agent workstation |
| **Core** | libghostty (original) | Built on libghostty |
| **Notifications** | None | Yes (OSC + CLI hook) |
| **Embedded browser** | None | Yes (scriptable) |
| **Programmable API** | Limited | Full CLI + Socket |
| **Maturity** | Stable (v1.2) | Rapidly evolving |
| **License** | MIT | AGPL-3.0 |

These two tools are not competitors — cmux is literally built on Ghostty's shoulders.

**Choose Ghostty** if you want a fast, zero-config, cross-platform terminal for everyday use and you're tired of iTerm2.

**Choose cmux** if you're running multiple AI agents simultaneously (Claude Code, Codex, etc.), need to know which agent is waiting for you, need agents to directly control a browser, or need to script and automate your entire workspace.

---

## References

- [Ghostty official site](https://ghostty.org/)
- [Ghostty - About](https://ghostty.org/docs/about)
- [Ghostty - Features](https://ghostty.org/docs/features)
- [GitHub - ghostty-org/ghostty](https://github.com/ghostty-org/ghostty)
- [How to make Ghostty the default terminal? (GitHub Discussion)](https://github.com/ghostty-org/ghostty/discussions/7364)
- [Add Option to Set Ghostty as Default Terminal on macOS (GitHub Discussion)](https://github.com/ghostty-org/ghostty/discussions/7762)
- [GitHub - manaflow-ai/cmux](https://github.com/manaflow-ai/cmux)
- [cmux official site](https://www.cmux.dev/)
- [cmux: Native macOS Terminal for AI Coding Agents - Better Stack](https://betterstack.com/community/guides/ai/cmux-terminal/)
