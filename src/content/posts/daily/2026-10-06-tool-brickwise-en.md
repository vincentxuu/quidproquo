---
title: "Tool Pick｜Brickwise — Stop Your AI Assistant From Writing Stale Roblox API Calls"
date: 2026-10-06
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server that turns Roblox DevForum threads and official docs into a sourced knowledge base, so Claude Code and Cursor can look things up instead of guessing from stale training data"
tldr: "Brickwise (roblox-logics-mcp) is an open-source MCP server that packages common Roblox development pitfalls into a sourced knowledge base your AI assistant can query. Install with `git clone` + `npm install && npm run build`, then wire it up with `claude mcp add`. It fixes AI assistants writing broken code from outdated Roblox APIs — like calling `PhysicsService` when the engine moved that to `WorldRoot` months ago."
series:
  name: "AI Tool of the Day"
  order: 46
---

> 🌏 [中文版](/posts/daily/2026-10-06-tool-brickwise)

## Tool Info

| Field | Value |
|---|---|
| Name | Brickwise (repo name: roblox-logics-mcp) |
| Type | MCP server |
| GitHub | [EL4CTEO/roblox-logics-mcp](https://github.com/EL4CTEO/roblox-logics-mcp) |
| Stars | 1 (publicly announced on Roblox DevForum on 2026-10-05) |
| Language | TypeScript |
| License | Code is MIT; content is community-sourced, each entry links back to its original source |
| Install | `git clone` + `npm install && npm run build`, then register with `claude mcp add` |

## The Problem It Solves

Ask Claude Code or Cursor to write a Roblox save-data or collision-detection script, and it will often hand you something plausible-looking that's quietly out of date — maybe it still calls `PhysicsService` to set a collision group, when Roblox moved that interface to `WorldRoot` a while back. Or it sets `Humanoid.Health = 0` directly, forgetting that `ForceField` only blocks `TakeDamage`, not a direct health write. These pitfalls live scattered across DevForum threads and odd corners of the Creator Docs — changes made after an AI's training cutoff that it simply never saw.

Brickwise's approach is straightforward: it packages these pitfalls into individual write-ups, each with source links, and exposes them to AI assistants over MCP. The assistant first calls `search_logics` to get cheap one-line summaries, then only calls `get_logic` — the expensive read — on the entry that actually looks relevant, pulling in the full write-up, common mistakes, and the original links. The free edition covers 8 core categories (data persistence, networking & security, combat, monetization, UI/UX, NPCs, performance, libraries) across 50 entries; a hosted full edition with 600+ entries across 19 categories is a one-time €7, no install required.

Good fit: anyone building Roblox games with an AI assistant, especially where engine-specific traps bite — like gamepasses being ownable before a player ever joins, or `OrderedDataStore` having no way to wipe data so you rotate its name weekly instead. If you don't write Roblox or Luau, this tool has nothing for you.

## Getting Started

### Install

```bash
git clone https://github.com/EL4CTEO/roblox-logics-mcp.git
cd roblox-logics-mcp
npm install
npm run build

# Register with Claude Code
claude mcp add roblox-logics -- node /absolute/path/to/roblox-logics-mcp/dist/index.js
```

Other clients (Cursor, Claude Desktop) wire up via config instead:

```json
{
  "mcpServers": {
    "roblox-logics": {
      "command": "node",
      "args": ["/absolute/path/to/roblox-logics-mcp/dist/index.js"]
    }
  }
}
```

### Basic Usage

Once connected, the assistant gets six extra tools and triggers them from a plain-language question:

```
You: "How do I save player data without losing their items?"

The assistant chains:
1. search_logics("save player data without losing items")
   → gets back a few one-line summaries, picks the most relevant
2. get_logic("data-persistence/orderedstore-save-retry")
   → reads the full write-up: the UpdateAsync retry logic, common
     mistakes, and the original DevForum link
3. Generates code based on what it just read, with sources attached
   for you to verify
```

### Advanced Usage

```
# Search by API name directly, skip guessing the right query
search_code("UpdateAsync")

# Find neighboring entries in the same system
# (e.g. the security checks that go alongside saving data)
find_related("data-persistence/orderedstore-save-retry")
```

## Compared to the Alternatives

| | Brickwise | Asking the AI assistant directly | Reading DevForum / Creator Docs yourself |
|---|---|---|---|
| Reflects 2026 API changes | ✅ | ❌ stuck at training cutoff | ✅ |
| Cites a source you can verify | ✅ | ❌ often fabricates something plausible | ✅ (it is the source) |
| Query cost | Reads a summary first, full text only on a hit | Free, but might be wrong | You spend the time searching and reading |
| Coverage | Free: 8 categories, 50 entries. Paid: 19 categories, 600+ | Whatever made it into training data | Everything, but you have to find it |

## Things to Watch

- **This is one person's write-up, not official Roblox documentation.** The README is explicit about this: each entry is summarized "in the author's own words" from DevForum, Creator Docs, or GitHub, with a link back but no guarantee of verbatim accuracy. Click through and check the source before you ship.
- **Brand new, barely validated.** The repo has existed since April 2026 but was only publicly announced on DevForum on 2026-10-05. It currently has 1 star, and there isn't yet a large base of users confirming the coverage holds up for real projects.
- **The free edition only covers 8 categories, 50 entries.** If your problem falls under movement, physics & VFX, world systems, game loops, audio, animation, social, or live-ops, the free edition won't have it — you'd need the €7 full edition or a trip to DevForum yourself.

## Today's Takeaway

The biggest risk with AI-assisted coding on a fast-moving platform like Roblox isn't that the assistant can't write the code — it's that it writes confidently using an API that's six months stale. That kind of error is hard to catch by reading the code itself, because the syntax is perfectly valid; it only breaks at runtime because the engine changed underneath it. Brickwise's fix isn't a smarter model — it's externalizing "what changed, and where was it discussed" into a queryable, sourced knowledge base the assistant checks before it writes a line, which is a lot cheaper than debugging after the fact.

## References

- [EL4CTEO/roblox-logics-mcp — GitHub](https://github.com/EL4CTEO/roblox-logics-mcp)
- [Brickwise | MCP server that teaches your AI assistant how Roblox systems really work — Roblox DevForum](https://devforum.roblox.com/t/brickwise-mcp-server-that-teaches-your-ai-assistant-how-roblox-systems-really-work/4916492)
- [Brickwise official site (with a sample entry)](https://brickwise.dev/)
- [Model Context Protocol specification](https://modelcontextprotocol.io)
