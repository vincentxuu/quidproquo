---
title: "Build Your Own Search Backend: SearXNG + Crawl4AI, From Zero to Claude Code"
date: 2026-08-21
category: ai
type: guide
tags: [searxng, crawl4ai, self-hosted, web-search, mcp, docker]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 3
tldr: "Three components, one job each: SearXNG finds, Crawl4AI reads, and a thin layer of your own code glues them together. Three defaults will stop you cold — `formats` only emits HTML, `secret_key` ships as the literal string `ultrasecretkey`, and turning on the limiter blocks your own code. Also, the official install path changed in March 2026, so most tutorials online point at a repository that is now archived."
description: "The hands-on steps for a self-hosted search backend: run SearXNG from the official compose template, fix the three settings that matter, turn pages into Markdown with Crawl4AI, glue it into an API, and expose it to Claude Code over MCP. With a verification command for every step."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-searxng-crawl4ai-setup)

[The previous post in this series](/posts/ai/2026-08-21-self-hosted-search-stack-en) explained why Tavily and Exa have no self-hosted version and what assembling your own actually costs. This one is the build: how to get it running.

A word on where this comes from — the commands and settings are taken from the official documentation and SearXNG's `settings.yml` source, with versions noted inline. Numbers that require measurement (speed, success rates) are not in this post; that would be a different kind of post.

## Three things, one job each

A self-hosted search backend is just these three parts:

| Component | What it does | What it doesn't do |
|---|---|---|
| SearXNG | Sends your question to Google, Bing, DuckDuckGo and others at once, then dedupes and merges the results | Doesn't fetch page content — only titles, links, snippets |
| Crawl4AI | Takes a URL and turns the whole page into clean Markdown | Doesn't find URLs for you |
| Your glue layer | Connects the two and wraps them as an API | There is no good off-the-shelf option; writing it is faster |

Why write the third part yourself? The previous post covered it: the ready-made wrappers are all double-digit-star solo projects, while the two components underneath have real communities — and the glue is under three hundred lines.

## Step 1: Get SearXNG running

**One trap first.** Nine out of ten SearXNG install guides online tell you to clone `searxng/searxng-docker`. That repository was archived on 2026-03-28, and its README now states plainly that `searxng-docker repository is superseded`. The current approach pulls the compose template from the main repo:

```bash
mkdir -p ./searxng/core-config/
cd ./searxng/

curl -fsSL \
  -O https://raw.githubusercontent.com/searxng/searxng/master/container/docker-compose.yml \
  -O https://raw.githubusercontent.com/searxng/searxng/master/container/.env.example

cp -i .env.example .env
# edit .env to taste

docker compose up -d
```

Two services come up, visible via `docker compose ps`:

```
NAME             ...  PORTS
searxng-core     ...  0.0.0.0:8080->8080/tcp
searxng-valkey   ...  6379/tcp
```

Valkey is a Redis fork; SearXNG uses it for the counters behind its bot protection. Your config lands in `core-config/settings.yml`.

## Step 2: Fix three settings, or nothing works

All three live in `core-config/settings.yml`.

**One: it only emits HTML by default.** This is where most people get stuck. It's hard-coded in the source:

```yaml
search:
  # remove format to deny access, use lower case.
  # formats: [html, csv, json, rss]
  formats:
    - html
```

Which means hitting the API gives you a full web page, not JSON. Add it:

```yaml
search:
  formats:
    - html
    - json
```

**Two: the secret is a public default.** The `secret_key` in `settings.yml` ships as the literal string `ultrasecretkey`, which everyone knows. Change it:

```bash
sed -i "s|ultrasecretkey|$(openssl rand -hex 32)|g" core-config/settings.yml
```

The `SEARXNG_SECRET` environment variable overrides it too, if you'd rather not touch the file.

**Three: the limiter blocks you.** The limiter is SearXNG's bot protection, off by default (`limiter: false`). What it looks for is "this request doesn't look like a browser" — and your code doesn't look like a browser. If your instance only serves your own network, leaving it off is simplest:

```yaml
server:
  limiter: false
```

If you expose it publicly you need the opposite: limiter on, a reverse proxy in front, and an allowlist for your own client.

## Step 3: Confirm search actually comes back

Restart after editing, then verify:

```bash
docker compose restart core
curl -s "http://localhost:8080/search?q=crawl4ai&format=json" | head -c 400
```

JSON means you're good. A wall of HTML means `formats` didn't take effect — check that the config file is really mounted into the container. A 403 is the limiter.

SearXNG defaults to GET, so parameters go straight in the URL. The useful ones: `q` for the query, `categories` to pick a category (`general`, `news`, `science`, `it`), `language`, and `engines` to restrict which upstreams get used.

## Step 4: Crawl4AI turns pages into Markdown

SearXNG only gives you links and snippets. Snippets usually aren't enough for an LLM, so something has to go read the full page.

```bash
pip install crawl4ai
crawl4ai-setup
```

Don't skip `crawl4ai-setup` — it provisions the Playwright browser. Without it your first run fails with a missing-Chromium error.

```python
import asyncio
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode

async def fetch(url: str) -> str:
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(
            url=url,
            config=CrawlerRunConfig(
                cache_mode=CacheMode.BYPASS,   # always refetch
                scan_full_page=True,           # scroll to the bottom to trigger lazy loading
                page_timeout=30000,
            ),
        )
        return result.markdown

print(asyncio.run(fetch("https://example.com")))
```

Besides `markdown`, `result` carries `links`, `media`, `status_code`, `success`, and `error_message`. Check `success` to detect failure rather than testing whether `markdown` is empty — some pages genuinely have little content.

## Step 5: Glue them together

With "find" and "read" in hand, the rest is wiring. A minimal version:

```python
import asyncio, httpx
from crawl4ai import AsyncWebCrawler, CrawlerRunConfig, CacheMode

SEARXNG = "http://localhost:8080/search"

async def search_and_read(query: str, top_k: int = 3):
    # 1. find
    async with httpx.AsyncClient() as client:
        r = await client.get(SEARXNG, params={"q": query, "format": "json"})
        hits = r.json()["results"][:top_k]

    # 2. read (in parallel — don't wait one at a time)
    cfg = CrawlerRunConfig(cache_mode=CacheMode.BYPASS)
    async with AsyncWebCrawler() as crawler:
        pages = await asyncio.gather(
            *[crawler.arun(url=h["url"], config=cfg) for h in hits],
            return_exceptions=True,     # one bad page shouldn't sink the batch
        )

    # 3. merge
    return [
        {"title": h["title"], "url": h["url"],
         "content": p.markdown if not isinstance(p, Exception) else None}
        for h, p in zip(hits, pages)
    ]
```

Three things worth noting:

- **Parallel, but not too parallel.** Every Crawl4AI request is a browser tab behind the scenes; a dozen at once eats memory fast.
- **Don't drop `return_exceptions=True`.** Fetches fail all the time, and without it one broken page takes the whole batch with it.
- **Fall back to the snippet.** SearXNG results already include a `content` field, so when the full fetch fails you still have something usable.

## Step 6: Wire it into Claude Code

Wrap it as an MCP server and the agent will reach for it on its own. The minimal shape:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("local-search")

@mcp.tool()
async def web_search(query: str, top_k: int = 3) -> list[dict]:
    """Search the web and return page contents as Markdown."""
    return await search_and_read(query, top_k)

if __name__ == "__main__":
    mcp.run()
```

Register it:

```bash
claude mcp add local-search -- python /path/to/server.py
```

Registering isn't enough. The agent can see the tool but doesn't know when to reach for it. Spell out the priority order in `CLAUDE.md` — the same approach as [the Cloudflare bypass post](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent-en).

## Which machine you put it on matters

**Not a cloud VM.** This is where self-hosted search most often fails, and it has nothing to do with whether your config is right. Search engines are unusually suspicious of datacenter traffic; from AWS, GCP, or the big VPS ranges, SearXNG often starts returning empty results after a handful of queries. A residential IP behaves far better.

The previous post quoted someone who ran both:

> Search engines treat datacenter IPs as presumed-guilty. From a hyperscaler range (AWS, GCP, the big Hetzner/OVH pools) SearXNG starts handing back empty results within a handful of queries; from a residential IP you look like a person.
> — Jingbiao, "Giving an Agent a Search Engine It Actually Owns", 2026-06-20

The practical arrangement: a small always-on box at home (a mini-PC or NAS is fine), services bound to `127.0.0.1` only, reached from your laptop over something like Tailscale. Don't expose it to the open internet.

## Two things this doesn't solve

**Your queries still leave.** SearXNG has no index of its own — it forwards your question to Google and Bing. So self-hosting buys you "not routed through Tavily or Exa, not metered, not rate-limited", not "nobody knows what you searched for". If queries genuinely can't leave, the answer is indexing your own corpus.

**What you fetch can bite.** Web pages can carry hidden instructions, and a model that reads them will follow them. Once you self-host, no vendor filters anything for you — you are the only layer of defense. That thread runs through [the same crack in agent security](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries-en).

## When to give up and pay

The maintenance cost of this stack shows up in two places: upstream engines break (roughly half of SearXNG's engines ship disabled precisely because they get blocked), and hard targets refuse to be fetched.

If you find yourself fixing it twice a week, or your targets have serious anti-bot defenses, that's the signal to go back to paying. A large part of what Tavily and Exa sell is carrying exactly that burden. The full reasoning is in [the previous post](/posts/ai/2026-08-21-self-hosted-search-stack-en).

## References

- [SearXNG container installation docs](https://docs.searxng.org/admin/installation-docker.html) — the current compose-based install
- [searxng/searxng-docker](https://github.com/searxng/searxng-docker) — archived 2026-03-28; listed here only so you can recognize outdated tutorials
- [SearXNG settings.yml source](https://github.com/searxng/searxng/blob/master/searx/settings.yml) — where the `formats`, `secret_key`, and `limiter` defaults come from
- [SearXNG search settings docs](https://docs.searxng.org/admin/settings/settings_search.html) — the list of available output formats
- [Crawl4AI](https://github.com/unclecode/crawl4ai) — 78,805 stars, Apache-2.0 (checked 2026-08-21)
- [Model Context Protocol](https://modelcontextprotocol.io/) — official MCP docs
- [Giving an Agent a Search Engine It Actually Owns](https://jingbiao.me/2026/06/20/online-research/) — measured difference between datacenter and residential IPs
- On this site: [Tavily and Exa Have No Self-Hosted Version](/posts/ai/2026-08-21-self-hosted-search-stack-en)
- On this site: [AI Web Scraping Tools Landscape](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en)
- On this site: [The Same Crack in Agent Security](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries-en)
