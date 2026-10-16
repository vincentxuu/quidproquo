---
title: "Tool Pick｜Co-op Anything — Let the Agent Reverse-Engineer a Single-Player Game Into Multiplayer"
date: 2026-10-17
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server plus playbook that lets a coding agent detect a single-player game's engine, check how far an existing co-op mod has gotten, decide whether to fix that mod or reverse-engineer from scratch, then verify the result with bots and package it for a friend to install"
tldr: "Co-op Anything is a playbook plus MCP server that lets an agent detect a single-player game's engine, check a directory of 208 existing co-op projects, and decide between fixing an existing mod or reverse-engineering from zero. Install: `git clone`, then `claude mcp add coop-anything -- python tools/mcp/coop_mcp.py`, or just paste the repo URL to your agent. It solves the problem of wanting to play a single-player game with friends when no co-op mod exists and you have no idea where to even start reverse-engineering it."
series:
  name: "AI Tool of the Day"
  order: 57
---

> 🌏 [中文版](/posts/daily/2026-10-17-tool-coop-anything)

## Tool Info

| Item | Value |
|---|---|
| Name | Co-op Anything |
| Type | MCP server + agent playbook (game reverse-engineering / co-op mod development) |
| GitHub | [cranebeaker/coop-anything](https://github.com/cranebeaker/coop-anything) |
| Stars | 19 (created 2026-10-16) |
| Language | Python |
| License | MIT |
| Install | `git clone`, then `claude mcp add coop-anything -- python3 tools/mcp/coop_mcp.py` (needs Python 3.9+ and PyYAML) |

## What Problem It Solves

Have you ever wanted to replay a single-player game with friends, only to find the developer never shipped a multiplayer mode? Adding co-op means first figuring out what engine the game runs on, whether anyone has already modded it, and whether that mod is still alive or long abandoned. Most people don't even know where to look — and the game itself is usually a closed executable with no source and no documentation.

Co-op Anything turns that whole process into a playbook an agent can follow. Its MCP server scans a game's install folder and identifies the engine from file signatures (Unreal, Unity, Source, Creation Engine, and more), then checks a directory that already tracks 208 co-op projects across 157 games to tell the agent whether to take the "revive an existing mod" path or the "reverse-engineer from zero" path. Both paths converge on the same finish line: connect players over Steam's free relay (the Spacewar test app, so nobody needs port forwarding), run automated QA with bots driving the actual game client, and package the result so a friend can install it in one click. Once the agent is done, it opens a pull request back to the repo with whatever it learned — a fixed mod, a failed attempt, an updated directory entry — so the next person's agent can pick up where it left off instead of starting from zero.

Good fit: turning an old single-player game (the README lists examples like Deus Ex, Fallout: New Vegas, and The Legend of Zelda: Ocarina of Time) into something you can play with friends; anyone curious how an agent handles a closed binary with no API and no docs; or pairing it with [REA](https://github.com/morluto/rea), a reverse-engineering MCP covered here earlier, for the lower-level binary work.

## Quick Start

### Install

```bash
# Requires Python 3.9+ and PyYAML
git clone https://github.com/cranebeaker/coop-anything.git
cd coop-anything
pip install pyyaml

# Add to Claude Code (see playbook/mcp.md for Codex / Gemini CLI / Cursor setup)
claude mcp add coop-anything -- python3 "$(pwd)/tools/mcp/coop_mcp.py"
```

You can also skip installing the MCP server entirely and just paste the repo URL to your agent: "Read https://github.com/cranebeaker/coop-anything and follow AGENTS.md. I want to play [game] in co-op with my friends."

### Basic Usage

```
Use coop-anything to detect the engine of the game installed at ~/Games/DeusEx,
check existing co-op projects for it and for other games on the same engine,
and tell me whether to revive an existing mod or build one from zero.
```

The agent calls these MCP tools in sequence:

- `detect_engine(game_dir)` — scans the folder for file signatures and returns a verdict like "Unreal Engine 1 or 2," the supporting evidence, and the matching modding tools (UnrealScript, UCC, UE Explorer)
- `search_directory(engine=...)` — lists known co-op projects on the same engine and how far along they are
- `read_playbook("reviving-abandoned-mods.md")` or `"how-coop-mods-work.md")` — reads the matching guide based on the verdict

### Advanced Usage

```
After the agent finishes a fix, it uses validate_entry to check that
the new entry for data/directory.yaml matches the schema,
then opens its own pull request with the fixed build, test results,
and a write-up back to the repo.
```

## Comparison with Existing Tools

| | Co-op Anything | Hunting for old mods on forums yourself | Nucleus Co-op | REA / ida-pro-mcp |
|---|---|---|---|---|
| Automatically detects engine and matching modding tools | ✅ | You look it up yourself | ❌ | ❌ |
| Tracks how far existing co-op mods got, and whether they're alive | ✅ (directory of 208 projects) | You look it up, results vary | ❌ | ❌ |
| Automated QA (bots play-test inside the game) | ✅ | ❌ | ❌ | ❌ |
| Real sync of enemies, world state, and story | Depends on the game; only needed on the from-zero path | Depends on that specific mod | ❌ (same-PC split screen only, no network sync) | Need to wire it up yourself |
| Closed-binary reverse-engineering | Pairs with REA | — | — | ✅ |

## Caveats

- **Very new, still small**: created 2026-10-16, 19 stars. The directory data and tool list are both still moving fast.
- **This produces a mod, not an official multiplayer mode**: quality depends entirely on the target game's engine and whatever mod work already exists for it — some games can be revived in days on the "fix an existing mod" path, while others on the "build from zero" path may eat a lot of agent compute without finishing.
- **The legal boundaries are stated clearly, but verify them yourself**: the README says plainly that the repo contains no game files, cracks, or decompiled source of closed games, and doesn't touch anti-cheat or online services. Game reverse-engineering still runs into copyright and platform terms, so check the target game's EULA and your local law before starting.
- **The MCP server itself is a read-only analysis tool**: the actual modding, compiling, and DLL injection happens through shell commands the agent runs by following the playbook. The MCP server only provides knowledge, engine detection, and schema validation — it's not a sandbox, and everything still runs under your own account's permissions.

## Today's Takeaway

I used to assume an agent touching games meant writing game code or building a bot that plays the game for you. Co-op Anything shows a different path: pointing an agent at a closed executable with no docs and no API, letting it figure out the engine, find the tools, make the changes, and run automated tests to check whether the fix actually worked. What's more interesting is how it compresses "how far has everyone's agent gotten" into one shared directory, stitched together by pull requests — a game too big for one agent to finish gets picked up by the next person's agent, instead of everyone starting over from scratch.

## References

- [Co-op Anything (cranebeaker/coop-anything) — GitHub](https://github.com/cranebeaker/coop-anything)
- [Co-op project directory, DIRECTORY.md](https://github.com/cranebeaker/coop-anything/blob/main/DIRECTORY.md)
- [MCP server setup, playbook/mcp.md](https://github.com/cranebeaker/coop-anything/blob/main/playbook/mcp.md)
- [REA — reverse-engineering MCP](https://github.com/morluto/rea)
- [Model Context Protocol](https://modelcontextprotocol.io/)
