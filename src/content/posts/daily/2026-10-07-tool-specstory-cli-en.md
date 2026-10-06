---
title: "Tool Pick｜SpecStory CLI — Auto-Save Every Agent Coding Session as Searchable Markdown"
date: 2026-10-07
category: daily
type: digest
tags: [ai-agent, tool, daily, cli-tool]
lang: en
description: "An open-source CLI that wraps Claude Code, Codex, Cursor CLI and a dozen other terminal coding agents, auto-saving every conversation as local markdown that you can search, share, and later mine into new agent skills"
tldr: "SpecStory CLI is an open-source CLI that wraps terminal coding agents — swap your launch command from claude to specstory run claude and every conversation auto-saves to .specstory/history/. Install: brew tap specstoryai/tap && brew install specstory. It solves the problem of AI coding sessions disappearing the moment you close the terminal, with no way to find or share them later."
series:
  name: "AI Tool of the Day"
  order: 47
---

> 🌏 [中文版](/posts/daily/2026-10-07-tool-specstory-cli)

## Tool Info

| Item | Value |
|---|---|
| Name | SpecStory CLI |
| Type | CLI (auto-save wrapper for terminal coding agents) |
| GitHub | [specstoryai/getspecstory](https://github.com/specstoryai/getspecstory) |
| Stars | 1,347 |
| Language | Go |
| License | Apache-2.0 |
| Install | `brew tap specstoryai/tap && brew install specstory` |

## What Problem It Solves

You spend an hour talking to Claude Code or Codex CLI, together tracking down a nasty bug and nailing down why some architectural decision has to be made a certain way. Close the terminal window, and that conversation only ever existed inside that one session — next time you hit the same problem, you re-explain the background from scratch. Want to share that debugging trail with a teammate? Screenshot it, or paste a wall of text with broken formatting and no way to search it later.

SpecStory CLI's approach is blunt and simple: it's a wrapper around the coding agent you already use. Swap your launch command from `claude` to `specstory run claude`, and the agent runs exactly the same — the only difference is that SpecStory saves every interaction alongside it as markdown, dropped into `.specstory/history/` inside your project. Everything stays local by default; log in and you can optionally sync to SpecStory Cloud for full-text search and team sharing across machines and projects. Skip the login and you simply end up with a clean local record. It also ships a feature called Lore, which mines your saved session history into new agent skills — not written from memory, but distilled from commands you actually ran and that actually worked.

Good fit: developers who run Claude Code, Codex, Cursor CLI or similar tools from the terminal and often can't recall how they solved something, or who want to hand a complete debugging session to a teammate. If you only touch an agent occasionally and never look back at history, this won't do much for you.

## Quick Start

### Install

```bash
# macOS / Linux, via Homebrew
brew tap specstoryai/tap
brew install specstory

# Check which agents are already installed and supported
specstory check
```

### Basic Usage

```bash
# Launch Claude Code through SpecStory; the session auto-saves
specstory run claude

# Same deal for Codex CLI or Cursor CLI — just swap the name
specstory run codex
specstory run cursor

# Re-render every past session in the project as markdown
specstory sync
```

After running this, your project gets a `.specstory/history/` folder with one markdown file per session, ordered by time, ready to grep or feed into any full-text search tool.

### Advanced Usage

```bash
# Optionally log in and sync local sessions to SpecStory Cloud
specstory login
specstory sync

# Install the Lore skill via npx, to mine past sessions into new skills
npx skills add specstoryai/getspecstory --skill lore
```

Once Lore is installed, run `/lore` in Claude Code (`$lore` in Codex, or just ask "mine my lore" in other agents) and it reads back through `.specstory/history`, distilling what you actually ran and what actually worked into an evidence-backed skill draft. Approve it, and it's installed into every supported agent on your machine.

## Comparison with Existing Tools

| | SpecStory CLI | Manual copy-paste | Agent's own session resume |
|---|---|---|---|
| Unified format across tools (Claude/Codex/Cursor CLI, etc.) | ✅ | Depends on habit | ❌ Each vendor is siloed |
| Local-first, cloud sync optional | ✅ | ✅ | Varies by tool |
| Full-text searchable history | ✅ (local or Cloud) | ❌ | Mostly unsupported |
| Auto-distills history into new skills (Lore) | ✅ | ❌ | ❌ |
| Shared team knowledge base | ✅ (requires Cloud login) | ❌ Scattered files | ❌ |

## Caveats

- **The CLI is open source; the IDE extensions are not.** The README is explicit about this — the Cursor and GitHub Copilot extensions are closed source. Only the terminal SpecStory CLI and the Lore skill have public source code.
- **Cloud sync is opt-in, but remember the trigger.** Stay logged out and everything stays local; once you run `specstory login` and then use `specstory run`, sessions auto-push to the cloud — worth knowing before you decide whether to log in.
- **One more wrapper layer means one more potential failure point.** It works by intercepting the target agent's input and output to save it. If a CLI interface changes in a future release, saving could break first — the project is open source, though, so you can send a PR for a new provider if it falls behind.

## Today's Takeaway

Most discussion of "AI development memory" focuses on giving the agent long-term memory. SpecStory flips that around and solves the human's memory problem instead — a coding agent's conversation is itself a valuable engineering record, it's just that by default nobody saves it. Turning that record into searchable local files, then using Lore to distill "how we actually did it" back into a skill, lets a team's working practices grow organically out of real conversations instead of being written up by hand after the fact.

## References

- [specstoryai/getspecstory — GitHub](https://github.com/specstoryai/getspecstory)
- [SpecStory official site](https://specstory.com/)
- [SpecStory full documentation](https://docs.specstory.com/overview)
- [Lore: distilling session history into agent skills](https://github.com/specstoryai/getspecstory/blob/dev/lore)
