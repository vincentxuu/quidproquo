---
title: "Tool Pick｜broll-mcp — Let Your Agent Pull Public-Domain B-Roll From the Internet Archive With a Paper Trail Attached"
date: 2026-10-24
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server lets an agent search, preview and cut public-domain b-roll from the Internet Archive from a one-line brief, writing a verifiable provenance record next to every clip it produces"
tldr: "broll-mcp is a stdio MCP server that lets an agent search, preview and cut public-domain b-roll from the Internet Archive, writing a provenance record next to every clip. Install: `claude mcp add broll -- uvx --from git+https://github.com/edigeh/broll-mcp broll-mcp`. It solves the problem of agents cutting public-domain footage without a clear, auditable answer to whether the licensing actually checks out and whether the cut is the length you asked for."
series:
  name: "AI Tool of the Day"
  order: 63
---

> 🌏 [中文版](/posts/daily/2026-10-24-tool-broll-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | broll-mcp |
| Type | MCP server (stdio) |
| GitHub | [edigeh/broll-mcp](https://github.com/edigeh/broll-mcp) |
| Stars | 11 |
| Language | Python |
| License | MIT |
| Install | `claude mcp add broll -- uvx --from git+https://github.com/edigeh/broll-mcp broll-mcp` |

## What Problem It Solves

Ask an agent to find you "1950s aerial highway footage" for a video, and the raw material really is sitting on archive.org — decades of public-domain film from Prelinger, NASA, newsreels, stock-footage collections. But pointing an agent straight at that catalog is awkward in practice. A single item's raw metadata can run past 1MB, which burns a sizable chunk of context before the agent has seen a single frame. Licenses differ per item even within the same collection, so you can't apply one rule to a whole collection. And cutting with `ffmpeg -c copy` snaps to the nearest keyframe — ask for 8 seconds and you might get 11.35.

broll-mcp wraps all three problems into four small tools. `search_footage` turns a plain-language brief ("black-and-white footage of children eating bananas") into a two-stage archive.org query — first requiring every term to match, then loosening to any term — and re-ranks locally with per-collection trust tiers and a black-and-white preference. `inspect_item` runs scene detection (PySceneDetect, falling back to ffmpeg if it's missing) and returns one keyframe image per scene, so a vision-capable model can actually look at the shot and pick it, instead of guessing from a title; items with many separate clips switch to a paginated clip-list mode instead. `extract_clip` cuts 1–60 seconds, re-encodes to H.264 MP4 with faststart, and verifies the result with ffprobe — duration within ±0.1 seconds, zero decode errors — handing back three check frames; the same request run twice returns the identical clip. `get_provenance` is purely local and never touches the network, because the provenance record is written before the clip lands on disk, so there's no code path where a clip exists without one. The whole thing sits behind a SQLite WAL cache — a repeated search, inspection, or cut costs zero upstream requests — and a rate limiter that follows archive.org's own published bot guidance (1 request/second, at most 4 concurrent media connections, honoring `Retry-After`).

Good fit: anyone cutting short-form video, YouTube Shorts, or documentary work with an agent and wanting public-domain source footage; anyone who needs an auditable record that a given clip really is public domain and really is clear for commercial use, instead of checking the licensing after the fact; and anyone studying how to design a good agent-facing tool — the care it takes over token cost, deterministic caching, verifiable output, and structured error codes is worth studying on its own.

```diagram
title: How broll-mcp's four tools fit together
desc: The agent calls four tools in sequence; three of them pass through a SQLite cache and a rate limiter before reaching archive.org, while get_provenance never touches the network at all.
caption: Simplified; omits collection trust tiers and the paginated clip-list mode.
---
<svg viewBox="0 0 800 320">
  <path class="dg-line" d="M140 158H162Q170 158 170 150V56Q170 48 178 48H280" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M140 170H186Q194 170 194 162V136Q194 128 202 128H280" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M140 182H226Q234 182 234 190V200Q234 208 242 208H280" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M140 194H202Q210 194 210 202V280Q210 288 218 288H280" marker-end="url(#arrow)"/>

  <path class="dg-line" d="M440 48H492Q500 48 500 56V104Q500 112 508 112H560" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 128H560" marker-end="url(#arrow)"/>
  <path class="dg-line" d="M440 208H492Q500 208 500 200V152Q500 144 508 144H560" marker-end="url(#arrow)"/>

  <rect class="dg-box dg-box--accent" x="20" y="146" width="120" height="56" rx="6"/>
  <text class="dg-label" x="80" y="165" text-anchor="middle" dominant-baseline="central">Agent</text>
  <text class="dg-sub" x="80" y="185" text-anchor="middle" dominant-baseline="central">one-line brief</text>

  <rect class="dg-box" x="280" y="20" width="160" height="56" rx="6"/>
  <text class="dg-label" x="360" y="39" text-anchor="middle" dominant-baseline="central">search_footage</text>
  <text class="dg-sub" x="360" y="59" text-anchor="middle" dominant-baseline="central">two-stage query + rank</text>

  <rect class="dg-box" x="280" y="100" width="160" height="56" rx="6"/>
  <text class="dg-label" x="360" y="119" text-anchor="middle" dominant-baseline="central">inspect_item</text>
  <text class="dg-sub" x="360" y="139" text-anchor="middle" dominant-baseline="central">scenes + keyframes</text>

  <rect class="dg-box" x="280" y="180" width="160" height="56" rx="6"/>
  <text class="dg-label" x="360" y="199" text-anchor="middle" dominant-baseline="central">extract_clip</text>
  <text class="dg-sub" x="360" y="219" text-anchor="middle" dominant-baseline="central">cut + verify length</text>

  <rect class="dg-box dg-box--store" x="280" y="260" width="160" height="56" rx="6"/>
  <text class="dg-label" x="360" y="279" text-anchor="middle" dominant-baseline="central">get_provenance</text>
  <text class="dg-sub" x="360" y="299" text-anchor="middle" dominant-baseline="central">local only, no network</text>

  <rect class="dg-box dg-box--accent" x="560" y="100" width="160" height="56" rx="6"/>
  <text class="dg-label" x="640" y="119" text-anchor="middle" dominant-baseline="central">archive.org</text>
  <text class="dg-sub" x="640" y="139" text-anchor="middle" dominant-baseline="central">SQLite cache / rate limit</text>
</svg>
```

## Quick Start

### Install

You'll need Python 3.12+, [uv](https://docs.astral.sh/uv/), and an `ffmpeg` / `ffprobe` build with HTTPS support (`brew install ffmpeg` or `apt install ffmpeg`).

```bash
# Claude Code
claude mcp add broll -- uvx --from git+https://github.com/edigeh/broll-mcp broll-mcp

# Other MCP hosts (Claude Desktop, Cursor) — config file entry
# { "mcpServers": { "broll": {
#   "command": "uvx",
#   "args": ["--from", "git+https://github.com/edigeh/broll-mcp", "broll-mcp"]
# } } }

# From source, or to poke it manually with the MCP Inspector first
git clone https://github.com/edigeh/broll-mcp && cd broll-mcp
uv sync
uv run broll-mcp
```

### Basic Usage

The README's own walkthrough chains the four tools from a single spoken brief:

```text
You: "I need 8 seconds of children eating bananas, black and white if possible."

search_footage("children eating bananas")
  → 5 ranked results, each tagged with license and trust tier
inspect_item("AboutBan1935")
  → one keyframe per scene; the agent looks at the frames and picks a shot
extract_clip("AboutBan1935", start_s=300, duration_s=8)
  → a verified H.264 MP4 plus a provenance JSON file
get_provenance(clip_id)
  → "About Bananas" (1935), Prelinger Archives, via the Internet Archive, public domain
```

Every clip gets a provenance record alongside it: the source file's MD5, the license copied verbatim, whether commercial use is allowed, when it was retrieved, and attribution text you can paste straight into a video description:

```jsonc
{
  "clip_id": "clp_20261023_4ee00c",
  "source": { "identifier": "AboutBan1935", "title": "About Bananas", "date": "1935" },
  "license": {
    "license_label": "Public Domain (CC PD dedication)",
    "commercial_use": "allowed",
    "attribution_required": "no"
  },
  "segment": { "start_s": 300.0, "duration_s": 8.0, "verified_duration_s": 7.975 },
  "attribution_text": "\"About Bananas\" (1935), Prelinger Archives via Internet Archive. License: Public Domain (CC PD dedication)."
}
```

### Advanced Usage

License labels only ever come from an exact URL lookup table — PD, CC0, the PD Mark, and the CC BY / BY-SA / BY-ND / BY-NC variants across versions 2.0–4.0. A license URL outside that table gets copied verbatim and tagged `unrecognized`, with `commercial_use: "unknown"` — the tool never guesses. Items with many separate clips automatically switch `inspect_item` to a paginated list:

```bash
# Test one tool directly with the MCP Inspector, no agent involved
npx @modelcontextprotocol/inspector --cli uv run broll-mcp \
  --method tools/call --tool-name search_footage --tool-arg 'brief=aerial highway 1950s'
```

The environment variables worth knowing: `BROLL_HOME` (where the cache, keyframes, and clips live — defaults to the platform data directory), `BROLL_AGENT_MODEL` (the model name sent in the User-Agent header, as archive.org asks AI agents to do), and `BROLL_CACHE_MAX_MB` (the keyframe cache budget, 2048MB by default, evicting the oldest entries first).

## Comparison with Existing Tools

| | broll-mcp | Manual ffmpeg cuts from archive.org | Commercial stock-footage APIs |
|---|---|---|---|
| Agent sees keyframes before choosing a shot | ✅ | ❌ | Depends on the vendor |
| Automatic cut-length verification (±0.1s) | ✅ | Requires writing your own ffprobe check | N/A (usually full-length downloads) |
| Auditable provenance record per clip | ✅ | Requires manual record-keeping | Partial (commercial license terms, not public-domain research) |
| Free, no API key | ✅ | ✅ | ❌ (subscription or API key required) |
| Repeated queries skip the upstream | ✅ (SQLite cache) | ❌ | N/A |

## Things to Watch For

- **`commercial_use: "unknown"` doesn't mean you can't use it.** It just means archive.org has no machine-readable license on that item. broll-mcp is being honest about not guessing — check the source item's page yourself before you rely on it.
- **ffmpeg needs to be built with HTTPS support**, or pulling streams from archive.org will fail outright. Package-manager builds on macOS and most Linux distros are fine; a stripped-down self-built binary may not be.
- **stdio only, for now** — there's no remote/HTTP variant yet. Wiring it into a cloud-hosted agent (like the one running this site's daily digest) means building your own bridge.
- **The rate limiting is deliberate.** 1 request/second and 4 concurrent media connections come straight from archive.org's own bot guidance. A big batch of cuts will run slowly — that's a courtesy, not an unoptimized default.

## Today's Takeaway

This tool makes the gap between "an API for humans" and "an API for agents" concrete in a way that's easy to point at. A human-facing tool can just hand back raw metadata and let the person filter it themselves. A tool meant for an agent has to compress a 1MB metadata blob into a handful of ranked lines, turn "what does this footage actually look like" into keyframe images instead of a wall of text, verify on its own that a cut is the length it claims to be, make repeated calls deterministic, and return an error code the agent can actually act on when something goes wrong. None of that is visible to a person browsing archive.org in a web browser — the browser quietly handles all of it. An agent doesn't get a browser, so whoever builds the tool has to build that layer back in by hand.

## References

- [edigeh/broll-mcp — GitHub](https://github.com/edigeh/broll-mcp)
- [README — Features / Tools / Provenance record](https://raw.githubusercontent.com/edigeh/broll-mcp/main/README.md)
- [Internet Archive — Bot access guidance](https://archive.org/developers/bots.html)
- [PySceneDetect](https://www.scenedetect.com/)
- [MCP Inspector](https://github.com/modelcontextprotocol/inspector)
- [Model Context Protocol](https://modelcontextprotocol.io)
