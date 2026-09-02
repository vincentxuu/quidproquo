---
title: "Tool Pick | upnote-mcp — Let Claude Read and Write Your Local UpNote Notes, No Cloud, No API Key"
date: 2026-09-03
category: daily
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An MCP server that reads and writes the desktop note app UpNote's local database directly — solving read correctness with a reverse-engineered WAL snapshot, and writes through UpNote's own URL scheme, no cloud and no API key involved"
tldr: "upnote-mcp is an open-source MCP server that lets Claude read and create UpNote notes. Install: clone the repo, then `npm install`. It solves the problem of a note app with no official automation API where you also don't want your notes touching the cloud."
series:
  name: "AI Tool of the Day"
  order: 19
---

> 🌏 [中文版](/posts/daily/2026-09-03-tool-upnote-mcp)

## Tool Info

| Field | Value |
|---|---|
| Name | upnote-mcp |
| Type | MCP server (local UpNote read/write, no cloud, no API key) |
| GitHub | [ahmedco88/upnote-mcp](https://github.com/ahmedco88/upnote-mcp) |
| Stars | 1 |
| Language | JavaScript |
| License | MIT |
| Install | `git clone https://github.com/ahmedco88/upnote-mcp.git && cd upnote-mcp && npm install` |

## What Problem Does It Solve

Have you ever wanted Claude to save a conversation's conclusions straight into whatever note app you actually use, only to find that most note tools either require a cloud account before they'll expose any automation, or expose none at all? UpNote is a local-first, cross-device-sync desktop note app whose only official automation is two URL-scheme actions — "create note" and "create notebook." There's no official API, no SDK, and no way at all to read existing notes.

upnote-mcp solves the read side through reverse engineering. UpNote stores data in SQLite running in WAL (Write-Ahead Log) mode, so the most recent notes haven't actually been written back to the main file yet — they sit in the `-wal` file instead. Copying just `upnote.sqlite3` alone gets you a stale snapshot. This server copies the main file plus `-wal` and `-shm` together into a temp folder, opens the copy in read-write mode so SQLite can replay the log, and only then can it guarantee it's reading current data. It also discovered that "which notes belong to which notebook" isn't stored where you'd reasonably expect — it lives in a `lists` table, keyed `notebooks_<id>`, holding a JSON array of note ids. Writes never touch the database at all: they go through UpNote's own `upnote://` URL scheme, effectively asking UpNote to do the writing itself, which means the read path can never corrupt your notes.

Good fit: you already keep notes in UpNote and want Claude to save session takeaways, to-dos, or code snippets straight into it — or, the other direction, want Claude to search or summarize a notebook — without spinning up a cloud account or wiring in a service that needs an API key.

## Quick Start

### Installation

```bash
git clone https://github.com/ahmedco88/upnote-mcp.git
cd upnote-mcp
npm install
```

Then add this to your MCP client config (e.g. `~/.claude.json` or Claude Desktop's `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "upnote": {
      "command": "node",
      "args": ["/full/path/to/upnote-mcp/server.mjs"]
    }
  }
}
```

### Basic Usage

The agent gets two sets of tools: writes (`upnote_create_note`, `upnote_create_notebook`) and reads (`upnote_list_notebooks`, `upnote_list_notes`, `upnote_search_notes`, `upnote_get_note`, `upnote_recent_notes`, `upnote_list_tags`).

```
You: Save this conversation's conclusions to UpNote, in the "Claude Notes" notebook
You: Search my notes for anything about sourdough
You: Summarize my Travel notebook
```

Claude picks the right tool on its own — you don't have to name which one to call.

### Advanced Usage

```json
"env": {
  "UPNOTE_DEFAULT_NOTEBOOK": "My Inbox",
  "UPNOTE_SNAPSHOT_DIR": "/private/only/you/can/read"
}
```

`UPNOTE_DEFAULT_NOTEBOOK` changes where a new note lands when you don't name a notebook. `UPNOTE_SNAPSHOT_DIR` moves the read snapshot out of its default system-temp location — on a shared machine this isn't optional, see the caveats below.

## Comparison with Alternatives

| | upnote-mcp | Manual copy-paste into UpNote | Cloud note MCPs (Notion / Evernote style) | UpNote's own URL scheme |
|---|---|---|---|---|
| Runs locally, no account or API key | ✅ | ✅ | ❌ (needs account + API key) | ✅ |
| Can search/summarize existing notes | ✅ | ❌ (fully manual) | ✅ | ❌ (create-only, no read) |
| Can edit existing notes | ❌ (UpNote's own automation limit) | ✅ | Usually ✅ | ❌ |
| Requires MCP client setup | Yes | No | Yes | N/A (not MCP) |

## Caveats

- **Create-only — no editing or tags.** This is a limit of UpNote's own automation (it only exposes "create note" and "create notebook"), not something this server chose to skip — the README says outright that existing notes can't be changed.
- **The read snapshot sits in your temp folder and nothing deletes it.** Anything that can read your temp folder can read your entire note library. On a shared or work machine, set `UPNOTE_SNAPSHOT_DIR` to somewhere only you can read.
- **Tested only on Windows 11 with the UpNote Store build.** Code paths exist for macOS and Linux database locations and URL openers, but the author marks them explicitly untested. Node 22.13+ is required (it uses `node:sqlite`).
- **This is reverse engineering, not an official integration.** The README opens with "Unofficial" and tells you to back up your notes — any UpNote update could change the database schema and break this server.

## Takeaway

The real difficulty here isn't writing the MCP protocol plumbing itself — reads, writes, and a stdio transport are all well-trodden ground. It's understanding an undocumented desktop app's local database: WAL mode means "what's in the file" and "what the app sees" are not the same thing, so copying the main file is not the same as copying the data. And a relationship as basic as "which notes belong to this notebook" isn't necessarily stored where a reasonable schema design would put it. Building a local-first integration is a fundamentally different kind of work than wrapping a REST API.

## References

- [upnote-mcp GitHub repo](https://github.com/ahmedco88/upnote-mcp): README, server.mjs source, and package.json, all from the official repo — covers the WAL snapshot mechanism, the notebook-membership data structure, and platform support status.
- [Model Context Protocol official docs](https://modelcontextprotocol.io): MCP protocol overview.
