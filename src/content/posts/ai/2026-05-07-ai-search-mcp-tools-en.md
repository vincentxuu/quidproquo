---
title: "Search MCP Tools for AI Agents: What to Do When WebFetch / WebSearch Gets Blocked"
date: 2026-05-07
category: ai
tags: [mcp, search, web-search, tavily, firecrawl, exa, bocha, claude-code, agent]
lang: en
tldr: "When using AI agents like Claude Code or Cursor, built-in WebFetch / WebSearch often gets blocked by Cloudflare, geo-restrictions, or rate limits. Connecting a search MCP server is the most direct fix. This post compares the options actually available in 2026."
description: "Comparing search MCP servers for AI agents: Tavily, Firecrawl, Exa, Linkup, Brave, Bocha, Bright Data, and more, with use cases and limitations for each."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-05-07-ai-search-mcp-tools)

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

In February 2026, Tavily was acquired by Nebius for an initial $275M (up to $400M on milestones). It now belongs to the Nebius AI cloud platform, but the brand and existing APIs remain operational. Monthly active SDK downloads exceed 3 million, with IBM, Cohere, and Groq among its customers.

Pricing: Free tier at 1,000 credits/month, paid plans start at $30/month, $0.008 per credit, ~$800 for 100K pages.

Good for: General agent integration, getting clean results without manual SERP cleaning.
Not ideal for: Large-scale full-text crawling, extremely cost-sensitive batch jobs.

## Firecrawl

Positioned as an "LLM-ready crawler and search index," Firecrawl converts web pages into clean Markdown and uses curated indexes (news, research, finance, government) as search sources. **The core is open-source and self-hostable**, which is very friendly for self-hosted MCP setups. The official `firecrawl-mcp` server is available.

Pricing: Standard plan at $99/month ($83/month annual), including 100K credits. 1K searches cost ~$1.66, 1K page extractions ~$0.83. Free 500 credits to try. 100K pages cost ~$83 -- one-tenth the cost of Tavily.

Good for: Crawling full text to feed into RAG, budget-sensitive use cases, compliance requirements for self-hosting.
Not ideal for: Real-time SERP results, semantic search.

## Exa

Exa's strength is neural / similarity search: "find me web pages semantically similar to this URL or this text." Most other providers rely on keyword + ranker approaches and lack Exa's ability to index entire web pages via embeddings. The official `exa-mcp-server` exposes three tools -- search, find similar, and get contents -- so agents can use a hybrid approach.

Pricing is a bit steep for keyword searches, but no one else can match Exa's semantic search capabilities right now.

Good for: Finding related content, competitive research, semantic recommendations, similar case studies.
Not ideal for: Pure keyword SERP, budget-sensitive high-frequency queries.

## Linkup

A European (French) team with servers in the EU, focused on GDPR compliance. Two modes: Standard (fast SERP responses) and Deep (multi-step research). The MCP server is officially maintained.

Pricing: Standard search at EUR 5 / 1,000 queries, free EUR 5 credit per month.

Good for: Clients or regulations requiring EU data boundaries, B2B company intelligence, predictable per-unit pricing.
Not ideal for: Non-English resources, scenarios focused on the Chinese or Asian markets.

## Brave Search (Note: Free Tier Has Been Discontinued)

An independent index that does not log queries. The official `brave-search-mcp` lets agents connect directly.

**The free tier was discontinued in early 2026**: New registrations only receive a $5 monthly credit (~1,000 queries), while existing free subscribers retain 2,000 queries/month. Paid plans start at $5 / 1,000 queries, up to $30 / 1,000 queries. To receive the free credit, you must display a Brave Search attribution notice on your website.

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

Both provide "cheap structured Google results." The difference: Serper is cheaper (~$2 / 1,000 queries) but only returns SERP snippets and links; SerpAPI is pricier but offers the most complete structured fields (knowledge panels, ads, featured snippets). Community MCP servers exist for both.

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

## References

- [Model Context Protocol Official Documentation](https://modelcontextprotocol.io/)
- [Anthropic: Claude Code MCP Configuration](https://docs.claude.com/en/docs/claude-code/mcp)
- [Tavily MCP server](https://github.com/tavily-ai/tavily-mcp)
- [Firecrawl MCP server](https://github.com/mendableai/firecrawl-mcp-server)
- [Exa MCP server](https://github.com/exa-labs/exa-mcp-server)
- [Brave Search MCP server](https://github.com/brave/brave-search-mcp-server)
- [Bocha Search MCP](https://github.com/BochaAI/bocha-search-mcp)
- [Bright Data MCP](https://github.com/luminati-io/brightdata-mcp)
- [Nebius announces agreement to acquire Tavily](https://nebius.com/newsroom/nebius-announces-agreement-to-acquire-tavily-to-add-agentic-search-to-its-ai-cloud-platform)
- [Top 5 Exa Alternatives for AI Web Search (Firecrawl Blog)](https://www.firecrawl.dev/blog/exa-alternatives)
- [Brave Kills Free Search API Tier (Implicator.ai)](https://www.implicator.ai/brave-drops-free-search-api-tier-puts-all-developers-on-metered-billing/)
- [Bocha AI Open Platform](https://open.bochaai.com/)
