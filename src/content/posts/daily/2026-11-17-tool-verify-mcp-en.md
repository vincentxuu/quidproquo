---
title: "Tool Pick｜verify-mcp — 9 keyless verification tools for your agent"
date: 2026-11-17
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "verify-mcp is an MCP server that gives agents 9 read-only, API-key-free verification tools: Wayback history, domain age, DNS, certificate transparency, and sun/shadow math — and deliberately skips people lookups"
tldr: "verify-mcp is a dependency-free, keyless MCP server with 9 read-only verification tools (Wayback history, domain age, DNS, certificate transparency, sun/shadow math). Install: pip install git+https://github.com/Ghongha007/verify-mcp.git. It refuses to do people lookups, drawing the line between verification and doxxing at the tool level."
series:
  name: "AI Tool of the Day"
  order: 81
---

> 🌏 [中文版](/posts/daily/2026-11-17-tool-verify-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | verify-mcp |
| Type | MCP server |
| GitHub | [Ghongha007/verify-mcp](https://github.com/Ghongha007/verify-mcp) |
| Stars | 1 (at time of writing; repo created 2026-11-16) |
| Language | Python (standard library only, no external dependencies) |
| License | MIT |
| Install | `pip install git+https://github.com/Ghongha007/verify-mcp.git` |

## What Problem It Solves

Ever ask an agent to help verify a suspicious claim, only to end up doing the actual checking yourself across a dozen browser tabs? A site claims it's been reporting on a region since 2015 — you check the Wayback Machine for its earliest snapshot. A domain looks freshly registered — you run a WHOIS/RDAP lookup. A shortened link shows up — you expand it before deciding whether to click. A photo claims a specific time and place — you end up computing sun position and shadow direction by hand. Every one of these is a separate tool on a separate website, and the agent can't help because none of them are in its tool list.

verify-mcp packages these moves into an MCP server with 9 read-only tools: `wayback_history`/`wayback_closest` for page history, `domain_registration` for RDAP records, `dns_records` for Cloudflare's public DNS, `certificate_names` for certificate transparency logs (via crt.sh) to surface what subdomains a domain has run, `expand_link` to unwrap short links, and `sun_position`/`shadow_times` to compute solar position and shadow direction locally using NOAA's equations. The first five each hit one free public service; the last two run entirely on your machine. The whole thing has zero external dependencies — pure Python standard library. The more deliberate design choice: it flatly refuses to do people lookups — no tools for finding someone's accounts, phone number, address, or face — and every single result ends with a line on what that method can't tell you, so the agent doesn't treat one data source as a verdict.

Good fit: news verification, OSINT investigations, a first pass on a suspicious link or screenshot, or the kind of cross-checking this site's own `post-verify` and `source-eval` skills do — triangulating multiple independent sources instead of trusting one.

## Quick Start

### Install

```bash
git clone https://github.com/Ghongha007/verify-mcp.git
cd verify-mcp
pip install .

# Or skip keeping a local checkout and install straight from git
pip install git+https://github.com/Ghongha007/verify-mcp.git
```

Claude Code:

```bash
claude mcp add verify -- python3 -m verify_mcp
```

Claude Desktop and other JSON-config clients:

```json
{
  "mcpServers": {
    "verify": { "command": "python3", "args": ["-m", "verify_mcp"] }
  }
}
```

### Basic Usage

```
You: This site claims it's been covering this region since 2015. When was
     the domain actually registered, and what's the earliest Wayback
     snapshot?

What the agent calls, in order:
1. domain_registration { domain: "example-news.com" }
   → RDAP lookup returns registration date and registrar
2. wayback_history { url: "https://example-news.com" }
   → lists the earliest snapshot date and a link to it
3. Lines up both dates: does the site's claimed start year predate the
   domain's actual registration?

Every tool's result ends with a line on that method's limits (e.g.
"the registration date reflects the current holder — a domain can be
dropped and re-registered under a new owner").
```

### Advanced Usage

```
Question: A photo claims to have been taken at 5pm on 2026-11-16, at
28.6139, 77.2090 (New Delhi), and the streetlight's shadow points
northwest. Does that check out?

The agent calls sun_position / shadow_times with the coordinates and
time to work out the sun's azimuth, then compares it against the
shadow direction in the photo — entirely local math, no external API
calls, no separate sun-angle calculator needed.
```

## Comparison with Existing Tools

| | verify-mcp | Manual tab-switching | General-purpose web-search MCP | OSINT people-search tools |
|---|---|---|---|---|
| No API key required | ✅ | — | Depends on plan | Depends on plan |
| Local sun position / shadow math | ✅ | Needs a separate calculator | ❌ | ❌ |
| Built to refuse people lookups | ✅ | — | — | ❌ (that's their core feature) |
| Every result states what it can't tell you | ✅ | You have to know the limits yourself | ❌ | Depends on the tool |
| Agent queries multiple angles and synthesizes | ✅ | Manual synthesis | Partial | Partial |

## Caveats

- **Very new.** Created 2026-11-16, 1 star at time of writing, single author. The README itself says it "has not yet been tried inside Claude Desktop or other chat applications" — only scripted JSON-RPC messages and the official MCP Python client (2.3.0) have been tested: handshake, tool listing, tool calls. Run it yourself before relying on it for real verification work.
- **`expand_link` exposes your IP.** Unwrapping a short link sends a HEAD request directly to the destination server, which sees your source IP. The README is explicit: if the link came from a hostile party, use a VPN, or don't expand it at all.
- **The public services behind it rate-limit and go down.** crt.sh is frequently slow or errors out; RDAP isn't offered by every TLD, and many country-code domains return little useful data; the sun math ignores atmospheric refraction, so it's approximate when the sun is near the horizon (within about 3 degrees).
- Any single result here is one piece of a puzzle, not a conclusion — a point the README itself keeps making. Don't treat a single lookup, especially a shadow-angle calculation that already carries margin for error, as proof.

## Today's Takeaway

I used to assume a verification tool gets more accurate by integrating more data sources — people-finder databases, satellite imagery, paid APIs. verify-mcp makes the opposite case: take a handful of services that are already free and keyless (Wayback, RDAP, crt.sh, Cloudflare DNS), add some math that runs entirely locally (sun position), and package them as nine small tools an agent can call — while deliberately leaving out anything that finds a person. The line between verification and doxxing often comes down to exactly that: can you find the person behind it. This author chose to draw that line at the tool level — there's simply no tool to call for it — rather than leaving it to whoever uses the server to decide.

## References

- [Ghongha007/verify-mcp — GitHub](https://github.com/Ghongha007/verify-mcp)
- [verify-mcp README (raw)](https://raw.githubusercontent.com/Ghongha007/verify-mcp/main/README.md)
- [verify-mcp — pyproject.toml](https://raw.githubusercontent.com/Ghongha007/verify-mcp/main/pyproject.toml)
- [Model Context Protocol docs](https://modelcontextprotocol.io)
