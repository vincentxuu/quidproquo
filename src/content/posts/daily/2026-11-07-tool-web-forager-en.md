---
title: "Tool Spotlight｜web-forager — an agent-grade collection engine that checks robots.txt before it reads Xiaohongshu"
date: 2026-11-07
category: daily
type: digest
tags: [ai-agent, tool, daily, mcp-server]
lang: en
description: "An open-source web information-gathering engine — one CLI, MCP server, and Claude Code skill share the same pipeline for HTML, PDF, Office files, RSS, and public pages on Bilibili, Zhihu, and more, with a robots.txt check and rate limit in front of every request"
tldr: "web-forager is an MIT-licensed open-source tool with three interfaces — CLI, MCP server, and Claude Code skill — sharing one engine that reads web pages, PDFs, Office documents, RSS feeds, and public pages on Bilibili, Zhihu, and Xiaohongshu. Install: point an MCP config at python mcp_server.py. It closes the gap between search tools that only hand back links and hand-rolled scrapers with no compliance layer — every request is checked against robots.txt and rate-limited before it fetches anything, and an unreachable robots.txt is treated as a denial."
series:
  name: "AI Tool of the Day"
  order: 75
---

> 🌏 [中文版](/posts/daily/2026-11-07-tool-web-forager)

## Tool Info

| Item | Value |
|---|---|
| Name | web-forager |
| Type | MCP server (plus a CLI and a Claude Code skill) |
| GitHub | [JiamingShi-JsPhys/web-forager](https://github.com/JiamingShi-JsPhys/web-forager) |
| Stars | 3 (at the time of writing — under a day old) |
| Language | Python |
| License | MIT |
| Install | Point an MCP config at `python mcp_server.py` (or `git clone` and run `python install.py --project . --global` to write rule files for every host) |

## What problem it solves

When an agent does research, it keeps hitting the same gap: a search API hands back links and snippets, but you still have to fetch the page yourself; a hand-rolled scraper fetches the page, but has no compliance layer — it doesn't check robots.txt, doesn't rate-limit, and has no parsing logic for a PDF or an Office file. Each side only solves half the problem, and there's no stable contract connecting them.

web-forager wires the two halves together. Every request goes through the same `HttpFetcher` gate — a robots.txt check, a cache layer, retry with backoff, a per-origin rate limiter, and a response-size cap — before it's handed to the matching extractor. HTML, PDF, DOCX, XLSX, EPUB, CSV, RSS/Atom, sitemaps, and public pages on Bilibili, Zhihu, Xiaohongshu, Weibo, and Douban all converge on the same output shape: `metadata`, `markdown`, `tables`, and `warnings`. A missing dependency exits with a specific code instead of a traceback (6 for missing Playwright, 7 for missing `pypdf`), and fetched text is always treated as untrusted data rather than instructions to execute.

Good fit: a research agent scanning public discussion on Bilibili or Zhihu for a market or sentiment read; an agent working through a batch of PDFs, Office notes, or RSS feeds to summarize them; or discovering a site's sitemap with `map` before deciding whether to read it page by page. Not a fit: reading content behind a login, bypassing a CAPTCHA or a Cloudflare challenge, or collecting anyone's personal data — web-forager deliberately refuses all three.

## Getting started

### Install

```bash
git clone https://github.com/JiamingShi-JsPhys/web-forager.git
pip install -r web-forager/requirements.txt   # core deps: requests, beautifulsoup4, trafilatura
# add these only if you need them:
# pip install playwright && playwright install chromium   # JS rendering
# pip install pypdf                                        # PDF text layer
```

### Basic usage

Point an MCP server entry at `mcp_server.py` and restart the client — it exposes seven tools you can call from chat right away:

```json
{
  "mcpServers": {
    "web-forager": {
      "command": "python",
      "args": ["/absolute/path/to/web-forager/mcp_server.py"]
    }
  }
}
```

The seven tools: `web_fetch`, `web_search`, `web_surf`, `web_scholar`, `web_map`, `web_bilibili`, `web_clean`. The equivalent CLI actions:

```bash
python run.py --action fetch --url "https://www.zhihu.com/" --render auto
python run.py --action scholar --source arxiv --query "multi-agent systems"
python run.py --action map --url "https://example.org" --limit 500
```

### Advanced usage

`surf` can carry a resumable session, following links on the page one hop at a time instead of stopping after a single fetch:

```bash
python run.py --action surf --url "https://www.zhihu.com/" \
  --depth 1 --max-pages 5 --session zhihu-01
```

Run it again with the same `--session` later and it picks up where it left off, instead of re-planning the whole route.

## Compared to existing options

| | web-forager | Search APIs (Exa, Tavily, etc.) | Hand-rolled requests + BeautifulSoup |
|---|---|---|---|
| Links or content | ✅ Both — plus unified Markdown/metadata | Mostly links and snippets | You write the parsing yourself |
| robots.txt compliance built in | ✅ Checked on every request; unreachable = denied | Depends on the provider; not visible to you | ❌ You add it yourself |
| Multi-format support (PDF/Office/RSS/sitemap) | ✅ Native | ❌ Usually web pages only | You wire up each format's library yourself |
| Chinese social platforms (Bilibili, Zhihu, Xiaohongshu, etc.) | ✅ Dedicated adapters | Depends on the provider's index | You handle layout and anti-scraping yourself |
| Needs an API key / paid plan | ❌ No | Usually yes | ❌ No |
| Offline test coverage | ✅ 115 tests, run against a local fake HTTP server | — | Usually none |

## Things to watch out for

- **An unreachable robots.txt counts as a denial** — a conservative but RFC-compliant default, not "no robots.txt means go ahead." `--ignore-robots` is only for resources you're explicitly authorized to access.
- **Robots.txt permission isn't the same as a platform's terms of service.** Zhihu, Weibo, and Xiaohongshu's own terms generally still restrict large-scale automated collection. The tool won't help you get around a login wall or a verification challenge, but it's still on you to check each platform's terms before deciding what and how much to collect — don't treat "robots.txt didn't block it" as a compliance guarantee.
- **PDF extraction only reads the text layer** — scanned papers or photocopies need OCR, which this tool doesn't do. **Search result availability shifts with your network environment**; Sogou throws up a human-verification page, so the default `auto` route already excludes it.

## Today's takeaway

Most agent-facing fetch tools make you pick a side between search and compliance: use someone else's search API and you're compliant but stuck with links, or write your own scraper and you get full content but you're now responsible for robots.txt and rate limiting yourself. web-forager pins both to the same layer — the compliance check isn't a patch bolted on after search or fetch, it's the gate every request passes through first, whether that request is a search, a sitemap walk, or a scholarly API call. The lesson for tools agents will run unattended for a long time: compliance works best as a step the architecture doesn't let you skip, not an option callers have to remember to add.

## References

- [JiamingShi-JsPhys/web-forager — GitHub](https://github.com/JiamingShi-JsPhys/web-forager)
- [web-forager README](https://github.com/JiamingShi-JsPhys/web-forager/blob/main/README.md)
- [AGENTS.md (agent operating rules and hard limits)](https://github.com/JiamingShi-JsPhys/web-forager/blob/main/AGENTS.md)
- [CHANGELOG.md (1.0.0 / 1.0.1 release notes)](https://github.com/JiamingShi-JsPhys/web-forager/blob/main/CHANGELOG.md)
- [LICENSE (MIT)](https://github.com/JiamingShi-JsPhys/web-forager/blob/main/LICENSE)
