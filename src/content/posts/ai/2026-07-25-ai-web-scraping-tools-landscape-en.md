---
title: "AI Web Scraping Tools Landscape: A Selection Guide for 34 Open-Source Projects"
date: 2026-07-25
category: ai
type: deep-dive
tags: [web-scraping, ai-agent, browser-automation, llm, open-source]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 3
tldr: "From MarkItDown (175k stars, MIT) to curl_cffi (6k stars), a survey of 34 open-source tools for feeding data to AI. Categorized along five axes: whole-site crawling, AI browser agents, document conversion, smart extraction, and anti-detection infrastructure. The key to selection isn't which tool is best — it's scenario matching."
description: "A selection guide for 34 AI web scraping and data extraction open-source tools: whole-site crawlers (Firecrawl, Crawl4AI), AI browser agents (Browser-Use, Stagehand), document converters (MarkItDown, MinerU), smart extractors (Scrapling, ScrapeGraphAI), and anti-detection infrastructure (curl_cffi). Includes GitHub API-verified star counts and licenses."
draft: false
glossary:
  - term: "AGPL"
    aliases: ["AGPL-3.0", "GNU Affero General Public License"]
    definition: "A copyleft open-source license. If you use AGPL software to provide a network service, your integration code must also be open-sourced under the same license."
    context: "Firecrawl and Skyvern use AGPL-3.0 — evaluate the licensing implications for commercial deployment when selecting tools."
  - term: "TLS fingerprint"
    aliases: ["TLS 指紋", "JA3 fingerprint"]
    definition: "The combination of handshake parameters a browser uses when establishing an HTTPS connection. Anti-bot systems use TLS fingerprints to determine whether a request comes from a real browser."
    context: "curl_cffi and CloakBrowser bypass anti-bot detection by spoofing TLS fingerprints."
---

> 🌏 [中文版](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape)

"Scraping data for AI" has spawned an entire tool ecosystem. From [MarkItDown](https://github.com/microsoft/markitdown) at 175k stars to various niche tools in the low thousands, at least 34 active projects on GitHub address this problem. This article categorizes them along five axes — whole-site crawling, AI browser agents, document conversion, smart extraction, and anti-detection infrastructure — to help you pick the right tool for your scenario instead of building a scraper from scratch.

## It's Not Just "Download the Page"

Scraping data for AI involves three independent core problems, and no single tool solves all of them:

1. **Format conversion**: How to turn unstructured web pages or documents into LLM-digestible formats (Markdown, structured JSON)
2. **Interactive crawling**: How to handle pages requiring login, JS rendering, or dynamic loading
3. **Reliable access**: How to get data consistently in an environment of increasingly aggressive anti-bot measures

## Who Decides How to Scrape: Five Approaches

The biggest divergence among tools is "who's the decision maker":

| Approach | Representative Tools | Decision Maker | Trade-off |
|---|---|---|---|
| Rule-driven | [Scrapy](https://github.com/scrapy/scrapy), [Crawlee](https://github.com/apify/crawlee) | Developer writes selectors | High maintenance — breaks on redesign |
| AI-driven (DOM) | [ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai), [Stagehand](https://github.com/browserbase/stagehand) | LLM reads DOM | Token cost, latency |
| AI-driven (vision) | [Skyvern](https://github.com/Skyvern-AI/skyvern), [Browser-Use](https://github.com/browser-use/browser-use) | LLM reads screenshots | Slowest, most expensive, but cross-platform |
| Adaptive | [Scrapling](https://github.com/D4Vinci/Scrapling), AgentQL | Smart selectors self-repair | No AI cost, but learning curve |
| Format conversion | [MarkItDown](https://github.com/microsoft/markitdown), [MinerU](https://github.com/opendatalab/MinerU), [Marker](https://github.com/datalab-to/marker) | Doesn't scrape — only converts | Needs an upstream crawler |

The five categories below follow these approaches.

## Whole-Site Crawling: Firecrawl Leads, but Watch the License

The top pick is [Firecrawl](https://github.com/firecrawl/firecrawl) (170k stars, AGPL-3.0) — the most feature-complete option with built-in JS rendering, Markdown output, and sitemap scanning. Its API is designed specifically for LLM input scenarios. The catch is the AGPL license: if you use it to provide a network service, your integration code must also be open-sourced.

If the license is a deal-breaker, [Crawl4AI](https://github.com/unclecode/crawl4ai) (79k stars, Apache-2.0) is the closest alternative — Python-based, lighter weight, and growing fast.

For million-page scale, use [Scrapy](https://github.com/scrapy/scrapy) (63k stars, BSD-3) — the veteran Python framework with a mature distributed architecture, though you write your own parsers. JS/TS teams should look at [Crawlee](https://github.com/apify/crawlee) (25k stars, Apache-2.0) by Apify, with clean APIs and Playwright/Cheerio support. Non-engineers can try Maxun (~17k stars), a no-code interface for marking elements to scrape directly in the browser.

## AI Browser Agents: Let AI Operate Like a Human

These tools let AI operate a browser autonomously — clicking, filling forms, scrolling, taking screenshots, all self-directed.

[Browser-Use](https://github.com/browser-use/browser-use) (110k stars, MIT) has the largest community. It's a Python autonomous agent loop where every step relies on LLM reasoning — ideal for "let AI complete tasks on the web" scenarios. [Stagehand](https://github.com/browserbase/stagehand) (24k stars, MIT) has the cleanest API — three primitives (`act` / `extract` / `observe`) cover both interaction and data extraction, built on Playwright in TypeScript, better for stable automation scripts. [Skyvern](https://github.com/Skyvern-AI/skyvern) (23k stars, AGPL-3.0) takes a vision-first approach — no DOM parsing, pure screenshot-based decisions, best cross-platform capability but slowest per step.

Browser-MCP (~7k stars) exposes browser operations as MCP tools, making it easy to plug into Claude or LLM agent workflows.

For a deep dive into the pure-vision approach, see our [Midscene.js analysis](/posts/ai/2026-05-23-midscene-vision-ui-automation-en) — it takes the extreme stance of "screenshots only, no DOM" and even removed its DOM action mode in v1.0.

## Document Conversion: No Scraping, Just Format Translation

These tools don't scrape — they work on files you already have. They're in this post because format conversion is the first of the three core problems in "scraping data for AI", but **the selection logic for this layer doesn't live in a scraping context**, and the internal differences are bigger than they look.

[MarkItDown](https://github.com/microsoft/markitdown) (175k stars, MIT) and [anydoc](https://github.com/firecrawl/anydoc) (746 stars, MIT) are **pure conversion**: they read structure that already exists in the file and map it to Markdown — no model, no GPU, median latency in milliseconds. [MinerU](https://github.com/opendatalab/MinerU) (78k stars), [Marker](https://github.com/datalab-to/marker) (39k stars), and [Docling](https://github.com/docling-project/docling) (65k stars) are **parsing tools that run models and do OCR**, for scanned documents and complex layouts. They are two to three orders of magnitude slower, and their real selection axis is licensing rather than accuracy.

This layer has its own series on the site and isn't duplicated here: [Document Parsing in Practice](/en/series/document-parsing) covers [how to pick a layer](/posts/ai/2026-08-06-document-parsing-three-layers-en) and [the licensing traps of the three parsers](/posts/ai/2026-08-06-document-parsing-layout-ocr-en).

Lightweight options: [Trafilatura](https://github.com/adbar/trafilatura) (~6k stars) specializes in "extract body text from web pages, filter ads" — stable and reliable for preprocessing. [Jina Reader](https://github.com/jina-ai/reader) (12k stars, Apache-2.0) requires zero setup — prepend `r.jina.ai/` to any URL to get Markdown. Readability (~9k stars) is the engine behind Firefox's Reader Mode, often embedded as a preprocessing step in other tools.

## Smart Extraction: Self-Healing Selectors

Rule-driven scrapers break on website redesigns. These tools use AI or adaptive mechanisms for more resilient extraction.

[Scrapling](https://github.com/D4Vinci/Scrapling) (76k stars, BSD-3) uses adaptive selectors — no LLM involved, just smart algorithms that automatically repair broken selectors after site redesigns. Fast and token-free. [ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai) (29k stars, MIT) takes a different path: describe what data you want in natural language, and it uses an LLM to build the scraping pipeline automatically — great for one-off extraction tasks. [AutoScraper](https://github.com/alirezamika/autoscraper) (8k stars, MIT) is even simpler — give it a sample page and the data you want, and it learns the selectors itself.

AgentQL (~1k stars) replaces CSS/XPath with semantic queries, Parsera is a lightweight LLM extraction library, and ferret (~6k stars, Go) offers a declarative extraction language.

## Anti-Detection & Infrastructure: The Foundation for Reliable Data Access

[curl_cffi](https://github.com/lexiforest/curl_cffi) (6k stars, MIT) spoofs TLS fingerprints so HTTP requests look like they're from a real browser. CloakBrowser (~29k stars) is a stealth Chromium that can drop-in replace Playwright's browser instance. botasaurus (~6k stars) is a Python anti-detection scraping framework, and SeleniumBase (~13k stars) is Selenium on steroids with built-in stealth mode.

[changedetection.io](https://github.com/dgtlmoon/changedetection.io) (~33k stars) does something different — it monitors web page changes and notifies you, useful for tracking prices, inventory, or policy updates. [scrcpy](https://github.com/Genymobile/scrcpy) (148k stars, Apache-2.0) isn't strictly a scraper but an Android screen mirroring tool, useful when you need to extract data from mobile apps. brightdata-mcp (~3k stars) is a commercial-grade MCP server for AI agents to access data through Bright Data's infrastructure.

For more on anti-detection techniques, see our [guide to bypassing Cloudflare anti-bot](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent-en) (in Chinese) comparing nodriver / stealth / camoufox. For a practical example of connecting scrapers to MCP, see [turning a scraper script into an MCP Server](/posts/tech/2026-03-20-mcp-server-job-scraper-en) (in Chinese).

## Quick Reference Table

Major tools verified via GitHub API (re-queried 2026-08-21), sorted by stars:

| Tool | Stars | License | Language | Purpose |
|---|---|---|---|---|
| [MarkItDown](https://github.com/microsoft/markitdown) | 175k | MIT | Python | Document → Markdown |
| [Firecrawl](https://github.com/firecrawl/firecrawl) | 170k | AGPL-3.0 | TS | Whole-site crawl + LLM output |
| [scrcpy](https://github.com/Genymobile/scrcpy) | 148k | Apache-2.0 | C | Android screen mirroring |
| [Browser-Use](https://github.com/browser-use/browser-use) | 110k | MIT | Python | AI browser agent |
| [MinerU](https://github.com/opendatalab/MinerU) | 78k | — | Python | PDF table/formula extraction |
| [Crawl4AI](https://github.com/unclecode/crawl4ai) | 79k | Apache-2.0 | Python | Lightweight whole-site crawl |
| [Scrapling](https://github.com/D4Vinci/Scrapling) | 76k | BSD-3 | Python | Adaptive selectors |
| [Docling](https://github.com/docling-project/docling) | 65k | MIT | Python | Structured document conversion |
| [Scrapy](https://github.com/scrapy/scrapy) | 64k | BSD-3 | Python | Large-scale crawling framework |
| [Marker](https://github.com/datalab-to/marker) | 39k | Apache-2.0 | Python | Fast PDF conversion |
| [ScrapeGraphAI](https://github.com/ScrapeGraphAI/Scrapegraph-ai) | 29k | MIT | Python | Natural language → scraper |
| [Crawlee](https://github.com/apify/crawlee) | 25k | Apache-2.0 | TS | JS/TS crawling framework |
| [Stagehand](https://github.com/browserbase/stagehand) | 24k | MIT | TS | Clean-API browser agent |
| [Skyvern](https://github.com/Skyvern-AI/skyvern) | 23k | AGPL-3.0 | Python | Vision-first browser agent |
| [Jina Reader](https://github.com/jina-ai/reader) | 12k | Apache-2.0 | TS | URL → Markdown |
| [AutoScraper](https://github.com/alirezamika/autoscraper) | 8k | MIT | Python | Example-driven extraction |
| [curl_cffi](https://github.com/lexiforest/curl_cffi) | 6k | MIT | Python | TLS fingerprint spoofing (maintained) |

An additional 17 tools — including changedetection.io, CloakBrowser, Maxun, SeleniumBase, Readability, Browser-MCP, Trafilatura, ferret, botasaurus, AnyCrawl, Markdowner, CyberScraper-2077, brightdata-mcp, webclaw, Parsera, AgentQL, and Craw4LLM — are documented in the research notes, mostly in the 1k–10k star range.

## Bottom Line

Tools in this space distribute along two axes: "rules vs. AI" and "general vs. specialized." The 2024–2025 trend is clear: AI-driven scrapers (ScrapeGraphAI, Browser-Use, Stagehand) and document-to-LLM-format converters (MinerU, Marker, Docling) are growing explosively. But rule-driven veterans (Scrapy, Crawlee) remain irreplaceable at million-page scale.

The key to selection isn't "which is best" — it's scenario matching:

- **Markdown output + don't want to deal with JS rendering** → Firecrawl (watch AGPL) or Crawl4AI
- **Login / complex interaction** → Browser-Use or Stagehand
- **PDF / Office conversion** → MarkItDown (general) or MinerU (academic PDFs)
- **Site keeps redesigning, selectors keep breaking** → Scrapling
- **Blocked by Cloudflare** → curl_cffi + [Cloudflare bypass guide](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent-en) (in Chinese)

## Changelog

- 2026-08-21: Re-verified every star count via the GitHub API and fixed three renamed orgs — Firecrawl `mendableai` → `firecrawl`, Docling `DS4SD` → `docling-project`, Marker `VikParuchuri` → `datalab-to` (the old URLs still 301, but the names were wrong). The biggest month-over-month moves were Firecrawl (155k → 170k) and Scrapling (71k → 76k). Also removed curl-impersonate from the anti-detection section entirely — it last pushed on 2024-07-18, two years dormant — and replaced it with the still-maintained [curl_cffi](https://github.com/lexiforest/curl_cffi). Also shortened the "Document Conversion" section: it used to discuss pure converters (MarkItDown, anydoc) and OCR-performing parsers (MinerU / Marker / Docling) as one group despite a two-to-three order of magnitude difference. It now carries only the boundary and a handoff — the full selection logic, licensing traps and measurements belong to the [Document Parsing in Practice series](/en/series/document-parsing) and are not duplicated here.
- 2026-08-06: Added anydoc to the "Document Conversion" section (Firecrawl's Rust conversion library — 14/14 formats, 4.7ms median, 746 stars, MIT licensed), noting how its license differs from the AGPL-3.0 Firecrawl main project. For the full selection logic on this layer, see the [document parsing series](/en/series/document-parsing). Star counts for the other tools in this post remain as queried on 2026-07-24 and were not re-verified.

## References

- [Firecrawl (GitHub)](https://github.com/firecrawl/firecrawl)
- [Crawl4AI (GitHub)](https://github.com/unclecode/crawl4ai)
- [Browser-Use (GitHub)](https://github.com/browser-use/browser-use)
- [Crawlee (GitHub)](https://github.com/apify/crawlee)
- [Scrapy (GitHub)](https://github.com/scrapy/scrapy)
- [MarkItDown (GitHub)](https://github.com/microsoft/markitdown)
- [Scrapling (GitHub)](https://github.com/D4Vinci/Scrapling)
- [ScrapeGraphAI (GitHub)](https://github.com/ScrapeGraphAI/Scrapegraph-ai)
- [Stagehand (GitHub)](https://github.com/browserbase/stagehand)
- [Skyvern (GitHub)](https://github.com/Skyvern-AI/skyvern)
- [MinerU (GitHub)](https://github.com/opendatalab/MinerU)
- [Marker (GitHub)](https://github.com/datalab-to/marker)
- [Docling (GitHub)](https://github.com/docling-project/docling)
- [anydoc (GitHub)](https://github.com/firecrawl/anydoc)
- [Jina Reader (GitHub)](https://github.com/jina-ai/reader)
- [Trafilatura (GitHub)](https://github.com/adbar/trafilatura)
- [AutoScraper (GitHub)](https://github.com/alirezamika/autoscraper)
- [curl_cffi (GitHub)](https://github.com/lexiforest/curl_cffi) — maintained TLS fingerprint spoofing
- [changedetection.io (GitHub)](https://github.com/dgtlmoon/changedetection.io)
- [scrcpy (GitHub)](https://github.com/Genymobile/scrcpy)
- [Midscene.js: Vision-First UI Automation](/posts/ai/2026-05-23-midscene-vision-ui-automation-en) (on this site, in Chinese)
- [Bypassing Cloudflare Anti-Bot Guide](/posts/tech/deep-dive/2026-03-28-bypass-cloudflare-anti-bot-for-ai-agent-en) (on this site, in Chinese)
- [Turning a Scraper into an MCP Server](/posts/tech/2026-03-20-mcp-server-job-scraper-en) (on this site, in Chinese)
