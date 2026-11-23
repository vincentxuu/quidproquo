---
title: "Tool of the Day: GEO & SEO Readiness MCP — Check Whether Your Site Can Be Read and Cited by AI Search"
date: 2026-11-24
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source MCP server that lets Claude, Cursor and other agents check a site's robots.txt, llms.txt, structured data and sitemap to see whether it's friendly to AI search engines like ChatGPT Search and Perplexity"
tldr: "geo-seo-mcp-pro is an MCP server that checks how friendly a site is to AI search engines. Install: git clone, then python3 server.py --check <url>. It solves the problem of having to check robots.txt, llms.txt, structured data and sitemaps separately just to confirm an AI engine can read and cite a page."
series:
  name: "AI Tool of the Day"
  order: 88
---

> :globe: [中文版](/posts/daily/2026-11-24-tool-geo-seo-mcp)

## Tool Info

| Item | Value |
|---|---|
| Name | GEO & SEO Readiness MCP (geo-seo-mcp-pro, Lite edition) |
| Type | MCP server |
| GitHub | [alicexixi85/geo-seo-mcp-pro](https://github.com/alicexixi85/geo-seo-mcp-pro) |
| Stars | 1 (checked 2026-11-23, v0.2.2 released 15 hours earlier) |
| Language | Python (98.7%) |
| License | MIT |
| Install | `git clone https://github.com/alicexixi85/geo-seo-mcp-pro.git` |

## The Problem It Solves

Your site ranks fine on Google, but you have no idea whether ChatGPT Search, Perplexity and other AI search engines can actually read your pages or would cite them. Finding out means checking several unrelated places: whether `robots.txt` blocks citation crawlers like `OAI-SearchBot` and `PerplexityBot` — a different set of user-agents from the ones used for model training, like `GPTBot` and `ClaudeBot`, controlled separately; whether `/llms.txt` exists and is actually Markdown rather than a disguised error page; whether the page ships usable JSON-LD structured data; whether `canonical` and `og:url` accidentally point to another domain; and whether a sitemap can even be found. Four or five checks, each in a different place — easy to miss one.

geo-seo-mcp-pro bundles all five into one MCP server with five tools. `check_ai_crawler_access` specifically splits "AI search citation crawlers" from "AI training crawlers" (blocking the training ones is treated as a site's own policy choice, not an error). `check_llms_txt` verifies `/llms.txt` is real Markdown and not a 200-status error page in disguise. `extract_structured_data` pulls JSON-LD (including `@graph`), flags cross-host `canonical`/`og:url` mismatches, and detects pages that are nearly empty JS shells. `check_sitemap` locates the sitemap from `robots.txt` or `/sitemap.xml` and counts its URLs. `quick_readiness_report` runs the first four in one pass and returns a fix-first list, failures ahead of warnings. Every result is labeled `PASS`/`WARN`/`FAIL`/`INFO` or `UNMEASURED` — if a site blocks the request or times out, it honestly reports `UNMEASURED` instead of guessing. Version 0.2.2 (released 2026-11-23) added detection for a sneakier kind of citation blocking: `X-Robots-Tag` and `meta robots` values like `noai`, `nosnippet` and `noindex`, which are easier to miss than a `robots.txt` rule.

Good fit: content or marketing teams who want to know whether what they publish can actually be cited by AI search, indie developers doing a pre-launch health check on a new page, or anyone already scripting site maintenance with Claude Code or Cursor who wants one more MCP tool to ask "is this URL AI-search-ready?"

## Quickstart

### Install

```bash
# Requires Python 3.10+, no other dependencies
git clone https://github.com/alicexixi85/geo-seo-mcp-pro.git
cd geo-seo-mcp-pro

# One-off check without any MCP client
python3 server.py --check https://your-site.com
```

### Basic usage

```json
// Claude Desktop (claude_desktop_config.json) / Cursor (~/.cursor/mcp.json)
{
  "mcpServers": {
    "geo-seo-readiness": {
      "command": "python3",
      "args": ["/absolute/path/to/geo-seo-mcp-pro/server.py"]
    }
  }
}
```

Once connected, just ask the agent:

```text
Run a quick_readiness_report for https://example.com
and list the three things I should fix first.
```

### Advanced usage (optional)

v0.2.2 ships a zero-install remote Streamable HTTP endpoint — no clone, no Docker — that Claude Desktop/Web Connectors, ChatGPT Developer Mode, Cursor and Windsurf can all connect to directly:

```text
Remote MCP endpoint: https://mcp.usethelever.com/geo-audit/mcp
```

Self-hosting with Docker:

```bash
docker build -t geo-seo-readiness-lite .
docker run -i --rm geo-seo-readiness-lite
```

## Comparison with Existing Tools

| | geo-seo-mcp-pro (Lite) | Manual checks | Screaming Frog and other classic SEO crawlers |
|---|---|---|---|
| Agent queries directly via MCP | ✓ | ✗ | ✗ (human-facing GUI/CSV) |
| Splits AI search crawlers from AI training crawlers | ✓ | Have to look up the user-agent lists yourself | Some have a generic bot list, rarely split this way |
| Detects hidden citation blockers like `noai`/`nosnippet` | ✓ (new in v0.2.2) | Have to dig through docs | Mostly absent |
| Free and open source to run | ✓ (Lite is fully functional) | — | Mostly paid desktop tools |
| Aggregates all five checks into a fix-first list | ✓ | Have to compile it yourself | Produces reports, but not in a shape an agent can consume |

## Things to Watch

- **Only reads the initial HTML, doesn't execute JavaScript.** JSON-LD injected client-side on an SPA won't be seen; the tool reports it as looking like a "JS shell" rather than a hard failure, but it's still worth cross-checking with a headless-browser tool.
- **Can't see CDN/WAF-level blocking.** `robots.txt` is only one layer of rules — something like Cloudflare's bot settings can block a crawler earlier in the pipeline, and that has to be checked separately in the platform's own dashboard.
- **The Lite edition has a paid upgrade path.** The author also sells a commercial Pro edition (headless rendering, competitor comparison, white-label PDF reports), but the README is explicit that "the Lite server is complete on its own and does not require the paid edition" — what's on GitHub is the entire free version.
- Only checks public `http`/`https` URLs; it refuses localhost and private network addresses.

## Today's Takeaway

GEO (AI-search visibility) is turning into its own checklist rather than just a branch of SEO — and the checklist overlaps with classic SEO without being the same thing. `robots.txt` used to be about whether you block crawlers at all; now it's about which kind of crawler — training versus citation. Whether `/llms.txt` exists, or where `canonical` points, used to be nice-to-have polish; now they directly decide whether an AI engine sees the page at all, or attributes it to the wrong URL. Reducing all of that to five mechanical checks is a useful reminder that this new layer of rules is, for now, still about getting the format right — not about whether the content is any good.

## References

- [alicexixi85/geo-seo-mcp-pro — GitHub](https://github.com/alicexixi85/geo-seo-mcp-pro)
- [alicexixi85/geo-seo-mcp-pro — README](https://raw.githubusercontent.com/alicexixi85/geo-seo-mcp-pro/main/README.md)
- [v0.2.2 Release Notes — Remote Streamable HTTP Endpoint, Citation Blocker Detector & Free Community Checker](https://github.com/alicexixi85/geo-seo-mcp-pro/releases/tag/v0.2.2)
- [Is your site invisible to ChatGPT Search? Five checks you can run in a minute — dev.to](https://dev.to/alicexixi85/is-your-site-invisible-to-chatgpt-search-five-checks-you-can-run-in-a-minute-1a18)
- [MCP Registry entry — io.github.alicexixi85/geo-seo-mcp-pro](https://registry.modelcontextprotocol.io/v0/servers?search=geo-seo-mcp-pro)
