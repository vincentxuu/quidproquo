---
title: "Search MCP Tools for AI Agents: What to Do When WebFetch / WebSearch Gets Blocked"
date: 2026-05-07
category: ai
tags: [mcp, search, web-search, tavily, firecrawl, exa, bocha, claude-code, agent]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 1
type: guide
tldr: "When using AI agents like Claude Code or Cursor, built-in WebFetch / WebSearch often gets blocked by Cloudflare, geo-restrictions, or rate limits. Connecting a search MCP server is the most direct fix. This post compares the options actually available in 2026."
description: "Comparing search MCP servers for AI agents: Tavily, Firecrawl, Exa, Linkup, Brave, Bocha, Bright Data, and more, with use cases and limitations for each."
draft: false
---

> :globe: [中文版](/posts/ai/2026-05-07-ai-search-mcp-tools)

When running agent tasks in Claude Code, Claude Desktop, or Cursor, the built-in WebFetch / WebSearch tools frequently hit walls: Cloudflare blocks bots, geo-restrictions (WebSearch is only available in the US), authenticated pages are inaccessible, rate limits kick in, and the returned format is not LLM-friendly. The most direct solution is to connect a search MCP server and delegate the search layer to a specialized service. This post organizes the options available in 2026 by use case, with MCP support status and recommended scenarios noted for each.

## Why Switch to MCP Instead of Using Built-in Tools

The limitations of built-in WebFetch / WebSearch boil down to:

- **WebSearch geo-restriction**: Anthropic's web search is only available in the US region
- **WebFetch bot blocking**: Cloudflare, Akamai, and Datadome return 403 directly
- **Loss of structure**: HTML-to-markdown conversion loses ranking, citations, and metadata
- **No caching or quota control**: Full requests every time
- **Single search engine only**: No access to Bing, Baidu, or Chinese-language indexes

Search MCP servers fill exactly these gaps: professional anti-bot handling, structured SERP results, citations, quota management, and cross-region indexing.

## Tavily

The most mainstream agentic search MCP, natively integrated with LangChain / LlamaIndex. Results come pre-ranked and summarized with citations, ready to feed directly to an LLM without cleaning. The official `tavily-mcp` package is install-and-go.

In February 2026, Tavily was acquired by Nebius (transaction value not disclosed). It now belongs to the Nebius AI cloud platform, but the brand and existing APIs remain operational. Monthly active SDK downloads exceed 3 million, with IBM, Cohere, and Groq among its customers.

Pricing: Free tier at 1,000 credits/month, paid plans start at $30/month, $0.008 per credit, ~$800 for 100K pages.

Good for: General agent integration, getting clean results without manual SERP cleaning.
Not ideal for: Large-scale full-text crawling, extremely cost-sensitive batch jobs.

## Firecrawl

Positioned as an "LLM-ready crawler and search index," Firecrawl converts web pages into clean Markdown and uses curated indexes (news, research, finance, government) as search sources. **The core is open-source and self-hostable**, which is very friendly for self-hosted MCP setups. The official `firecrawl-mcp` server is available.

Pricing: Standard plan at $99/month ($83/month annual), including 100K credits. 1K searches cost ~$1.66, 1K page extractions ~$0.83. The free plan includes 1,000 credits per month (about 500 searches or 1,000 pages) with no card. 100K pages cost ~$83 -- one-tenth the cost of Tavily. The legacy `/extract` endpoint is removed on 2026-12-10; structured extraction moves to the JSON format of `/v2/scrape`, and multi-page or search-first jobs move to `/v2/agent`.

Good for: Crawling full text to feed into RAG, budget-sensitive use cases, compliance requirements for self-hosting.
Not ideal for: Real-time SERP results, semantic search.

## Exa

Exa's strength is neural / similarity search: "find me web pages semantically similar to this URL or this text." Most other providers rely on keyword + ranker approaches and lack Exa's ability to index entire web pages via embeddings. The official `exa-mcp-server` exposes three tools -- search, find similar, and get contents -- so agents can use a hybrid approach.

By 2026 it is no longer just "the semantic search one" — it spreads depth across several latency tiers you pick from. Since Exa 3.0 in October 2026, the recommended types are just `lite`, `auto`, and `deep`; `instant`, `fast`, and `deep-reasoning` are marked legacy but still callable:

| type | Latency | Use for |
|---|---|---|
| `lite` | Cache-only, fastest | Real-time chat and voice; limited parameters |
| `auto` | ~1s | Default, balances quality and speed |
| `deep-lite` | 4s | Lightweight synthesized output |
| `deep` | 4-15s | Multi-step reasoning with structured output |
| `instant` / `fast` (legacy) | ~250ms / ~450ms | Old low-latency options; new code should use `lite` or `auto` |
| `deep-reasoning` (legacy) | 12-40s | Old top depth; new code should use `deep` |

On top of that, `output_schema` works with any search type to return JSON matching your schema directly, and `category` targets verticals such as company (50M+ company pages), people (1B+), and publication (350M+ scholarly works).

Pricing (checked 2026-11-23): $7 per 1,000 searches for `auto` / `fast`, $4 for `lite` and `instant`, $12 for `deep` and `deep-lite`, $15 for `deep-reasoning`, and $1 per 1,000 pages for contents and AI summaries. The free tier gives $10 at signup (up to about 2,500 `lite` searches), resets the free balance to $10 on the first of every month, and adds a one-time $10 for completing onboarding.

Good for: Finding related content, competitive research, semantic recommendations, research tasks that need structured output.
Not ideal for: Pure keyword SERP, budget-sensitive high-frequency queries.

## Linkup

A European (French) team with servers in the EU, focused on GDPR compliance. Search depth comes in `fast`, `standard`, and `deep`, plus `flash` (alpha, under 200ms) since September 2026. The MCP server is officially maintained.

Pricing: billed in USD since May 2026 — `standard` search costs $0.005 per call (about $5 / 1,000 queries) and `deep` $0.05; eligible accounts have their free balance topped back up to $20 each month.

Good for: Clients or regulations requiring EU data boundaries, B2B company intelligence, predictable per-unit pricing.
Not ideal for: Non-English resources, scenarios focused on the Chinese or Asian markets.

## Brave Search (Note: Free Tier Has Been Discontinued)

An independent index that does not log queries. The official `brave-search-mcp` lets agents connect directly.

**The standalone free plan was discontinued in February 2026**: each plan now applies a $5 monthly credit instead (about 1,000 Search queries; up to $20 combined across four plans such as Search and Answers), and signup requires a card with prepaid billing. All Search types cost $5 / 1,000 queries. The relaunch announcement required a Brave Search attribution on your site to receive the free credit, but the terms updated in September 2026 make attribution optional, so check the current conditions in the dashboard before applying.

Good for: Privacy-sensitive verticals like healthcare, legal, and finance -- if willing to pay.
Not ideal for: Small projects that were relying on the free tier. Reassess your budget.

## Bocha

Currently the most pragmatic choice for Chinese-language scenarios. Accessible within mainland China with high-quality Chinese-language indexing. Bocha is the official search provider for DeepSeek, and Alibaba, Tencent, and ByteDance also use it. The company claims to handle over 60% of AI application search requests in China. It offers both Search API and Rerank API. For MCP, there is the official `bocha-search-mcp` and a community-maintained `yoko19191/bocha-ai-mcp-server`.

Good for: Products primarily serving Chinese users, Chinese-language RAG / chatbots, deployments within mainland China.
Not ideal for: English-language research applications, scenarios with strict cross-border compliance requirements.

## Bright Data

A veteran enterprise-grade data scraping provider. Key selling points: no concurrency limits, real-time scraping of Google / Bing / Yandex / Yahoo, Web Unlocker for anti-bot handling, and pay-per-success billing. The official MCP server bundles SERP API + Web Unlocker + Browser API, making it one of the few options that actually solves the "Cloudflare / Datadome blocking agents" pain point.

Good for: Million-query-per-day volumes, hitting anti-bot walls, needing full SERP structure.
Not ideal for: Prototyping stage, monthly usage under 10K.

## Serper / SerpAPI

Both provide "cheap structured Google results." The difference: Serper is cheaper ($1.00 / 1,000 queries, down to $0.30 at volume) but only returns SERP snippets and links; SerpAPI is pricier but offers the most complete structured fields (knowledge panels, ads, featured snippets). Community MCP servers exist for both.

Good for: Only needing Google ranking results for downstream reranking, extracting structured fields for analysis.
Not ideal for: Full-text content (you still need a crawler), semantic search.

## Quick Reference

| Scenario | Recommended MCP |
|----------|----------------|
| General agent + clean results out of the box | Tavily |
| Full-text crawling for RAG, budget-sensitive, self-hosted | Firecrawl |
| Semantically similar content | Exa |
| EU compliance, predictable pricing | Linkup |
| Large-scale crawling + anti-bot bypass | Bright Data |
| Privacy-sensitive, willing to pay | Brave Search |
| Chinese-language scenarios, mainland China deployment | Bocha |
| Google structured fields | SerpAPI / Serper |

## Connecting MCP in Claude Code / Claude Desktop

Using Tavily as an example, add to `~/.claude.json` or Claude Desktop's `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "tavily": {
      "command": "npx",
      "args": ["-y", "tavily-mcp"],
      "env": { "TAVILY_API_KEY": "tvly-xxx" }
    }
  }
}
```

Swap in Firecrawl, Exa, Brave, or Bocha using the same pattern -- just change the package name and environment variables. Claude Code also supports `claude mcp add` for direct configuration.

## The Big Picture

The value of connecting a search MCP goes beyond "adding one more tool." It transforms your agent from "dependent on built-in WebFetch / WebSearch, randomly broken by various protection mechanisms" to "having a stable search layer with controllable quotas and traceable citations."

In practice, the most sensible setup is **one primary + one backup**, toggled via feature flags:

- General purpose: Tavily (primary) + Firecrawl (full-text crawling)
- Chinese-language focused: Bocha (primary) + Serper (English supplement)
- Research / recommendations: Exa (semantic) + Tavily (general queries)
- Heavy anti-bot zones: Bright Data (standalone)

Betting on a single vendor carries elevated risk given the pace of this market in 2026. Adding a backup takes minimal effort.

## Update log

- 2026-11-23: Rechecked every provider's pricing against official pages. Tavily's acquisition value is now "not disclosed" (neither the Nebius release nor the SEC filing states it); Firecrawl's free allowance is corrected to 1,000 credits per month, with a note that `/extract` is removed on 2026-12-10; Exa's search types (new `lite`, with `instant` / `fast` / `deep-reasoning` now legacy) and free tier follow the 3.0 release; Linkup moves to USD pricing and gains `flash`; Brave drops the unsourced "2,000 queries for legacy free users" and "up to $30" claims, and the attribution requirement reflects current terms; Serper's unit price follows the current site.
- 2026-08-21: Rewrote the Exa section. The original described it only as "the semantic search one, a bit steep for keywords", but Exa now offers six search types (`instant` at ~250ms through `deep-reasoning` at 12-40s), `output_schema` structured output, and company / people / publication verticals, with per-item pricing published — the old description was no longer enough to choose on. Also fixed the Firecrawl MCP server's GitHub org (`mendableai` → `firecrawl`). Pricing for the other providers is still as queried on 2026-05-07 and has not been re-verified.

## References

- [Model Context Protocol Official Documentation](https://modelcontextprotocol.io/)
- [Anthropic: Claude Code MCP Configuration](https://docs.claude.com/en/docs/claude-code/mcp)
- [Tavily MCP server](https://github.com/tavily-ai/tavily-mcp)
- [Firecrawl MCP server](https://github.com/firecrawl/firecrawl-mcp-server)
- [Exa MCP server](https://github.com/exa-labs/exa-mcp-server)
- [Exa Pricing](https://exa.ai/pricing?tab=api) — rates and free tier as checked 2026-11-23
- [Exa 3.0](https://exa.ai/blog/exa-3) — `lite` launch and search-type changes
- [Exa Search API Guide](https://exa.ai/docs/reference/search-api-guide) — search types and output_schema
- [Brave Search MCP server](https://github.com/brave/brave-search-mcp-server)
- [Firecrawl Pricing](https://www.firecrawl.dev/pricing)
- [Firecrawl Extract deprecation notice](https://docs.firecrawl.dev/features/extract)
- [Linkup Pricing](https://docs.linkup.so/pages/documentation/platform/pricing)
- [Brave Search API](https://brave.com/search/api/)
- [Serper](https://serper.dev/)
- [Bocha Search MCP](https://github.com/BochaAI/bocha-search-mcp)
- [Bright Data MCP](https://github.com/luminati-io/brightdata-mcp)
- [Nebius announces agreement to acquire Tavily](https://nebius.com/newsroom/nebius-announces-agreement-to-acquire-tavily-to-add-agentic-search-to-its-ai-cloud-platform)
- [Top 5 Exa Alternatives for AI Web Search (Firecrawl Blog)](https://www.firecrawl.dev/blog/exa-alternatives)
- [Brave Kills Free Search API Tier (Implicator.ai)](https://www.implicator.ai/brave-drops-free-search-api-tier-puts-all-developers-on-metered-billing/)
- [Bocha AI Open Platform](https://open.bochaai.com/)
