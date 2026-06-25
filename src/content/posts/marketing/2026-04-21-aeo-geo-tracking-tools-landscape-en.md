---
title: "AEO / GEO Tool Landscape: Input, Traffic, and Output Layers — From isitagentready to aeo-radar to Profound"
date: 2026-04-21
type: project
category: marketing
tags: [aeo, geo, ai-visibility, brand-monitoring, open-source, self-hosted, llm, ai-seo, cloudflare, agent-readiness, llms-txt, mcp, ai-crawler, gptbot]
lang: en
tldr: "AEO/GEO tools aren't a single category — they span three distinct layers: the input layer (is your website ready for AI to read), the traffic layer (how much are AI bots actually crawling), and the output layer (how is your brand mentioned in AI answers). This post maps out all three layers, from open-source self-hosted options to commercial SaaS."
description: "A complete map of AEO / GEO tools: input-layer tools like isitagentready, llms.txt validators and generators; traffic-layer tools like Matomo, Zerply, aibottracker; output-layer tools like aeo-radar, AiCMO, Profound, AthenaHQ, and Ahrefs Brand Radar. Includes common architecture patterns and selection guidelines."
draft: false
---

> 🌏 [中文版](/posts/marketing/2026-04-21-aeo-geo-tracking-tools-landscape)

AEO / GEO tools have grown from "SEO vendor add-on features" into a fully independent category over the past two years. The motivation is straightforward: Google search still matters, but more and more users are asking ChatGPT, Perplexity, Gemini, and Claude directly, getting synthesized answers — and whether your brand appears in those answers, where it ranks, and whose content gets cited are completely invisible to traditional SEO metrics.

But "AEO tools" is actually a very loose term. When you break it down, it covers three entirely different layers:

- **Input layer**: Is your website ready for AI agents to read (you have full control)
- **Traffic layer**: How much are AI bots actually crawling your pages (you can observe but not control)
- **Output layer**: How does AI mention you when generating answers (you can only influence)

This post maps out the tool landscape across all three layers, then pulls out common architecture patterns and selection guidelines.

## Input Layer: Is Your Website Ready for AI to Read?

This is the only layer you can control 100%. Tools fall into two categories: comprehensive health checks and llms.txt-specific tools.

### Comprehensive Health Checks

**[isitagentready.com](https://isitagentready.com/)** (by Cloudflare) is currently the most complete input-layer health check. Paste a URL, select Content Site / API / All Checks, and get a scored report covering four dimensions:

- **Discoverability**: robots.txt, sitemap, llms.txt
- **Content**: Markdown content negotiation, structured data
- **Bot Access Control**: AI crawler declarations (`AI-usage` directives)
- **Capabilities**: MCP endpoint, OAuth, Agent Skills, agentic commerce

Cloudflare's published scan statistics are striking — only 4% of websites declare AI usage preferences, and only 3.9% support Markdown negotiation. Think of it as "Lighthouse for AI agents" — free, no registration required.

### llms.txt-Specific Tools

**Validators** (paste a URL to check llms.txt format):

- [llms-txt.io/validator](https://llms-txt.io/validator)
- [RankRay LLMs.txt Checker](https://rankray.com/free-seo-tools/llms-txt-checker/)
- [llmstxtchecker.net](https://llmstxtchecker.net/)
- [Pixelmojo](https://www.pixelmojo.io/tools/llms-txt-validator) — includes AI suggestions
- [indexly.ai](https://indexly.ai/llms-txt-checker)

**Open-source generators** (crawl your site and produce llms.txt):

- [firecrawl/llmstxt-generator](https://github.com/firecrawl/llmstxt-generator) — most stars, uses Firecrawl crawl + GPT-4-mini
- [apify/actor-llmstxt-generator](https://github.com/apify/actor-llmstxt-generator) — packaged as an Apify Actor
- [Blimeo/llms-txt-generator](https://github.com/Blimeo/llms-txt-generator) — can automatically monitor site changes

llms.txt is still a proposed standard. Adoption surged starting in 2025, but Cloudflare's scans show actual adoption rates remain very low — making this an easy area to establish an early advantage.

## Traffic Layer: How Much Are AI Bots Actually Crawling You?

This is the most easily overlooked category. Traditional GA / Plausible **filters out** bot traffic by default, so even if GPTBot, ClaudeBot, and PerplexityBot are crawling thousands of your pages daily, you won't see it on your dashboard.

Cloudflare's server log research shows ChatGPT-User can crawl 2,400 pages per hour. For content-heavy sites, this number directly relates to "whether AI has seen you" — it's the flip side of the input layer's llms.txt configuration.

Several emerging specialized tools:

- **[Matomo 5.8](https://inimino.org/matomo-5-8-launches-ai-chatbot-tracking-dedicated-reports-separate-bot-traffic-from-human-visits/)** — the first mainstream open-source analytics platform with built-in AI Assistants reports, separating AI bot traffic from human traffic. Choose this if you want self-hosted analytics
- **[Zerply AI Traffic Analytics](https://zerply.ai/platform/ai-traffic-analytics)** — commercial SaaS, no code to embed, connects directly to CDN/reverse proxy
- **[aibottracker.com](https://www.aibottracker.com/)** — free, unlimited checks, lightweight option
- **[LLM Bot Tracker](https://wordpress.org/plugins/llm-bot-tracker-by-hueston/)** — WordPress plugin version

DIY enthusiasts can pull directly from access logs using ELK / Grafana / Datadog. The `User-Agent` signature list (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, CCBot...) is well-documented on each provider's website and not hard to implement.

## Output Layer: How Is Your Brand Mentioned in AI Answers?

This is the most crowded battlefield for AEO/GEO tools, and the original starting point for this post (aeo-radar lives in this layer).

### Open-Source Self-Hosted

The core value proposition is the same across the board: **don't pay $200–$500/month for SaaS; keep your data and prompts on your own machine**. The differences lie in tech stack and data acquisition method.

**[aeo-radar](https://github.com/hellowalt/aeo-radar)** uses Playwright to headlessly crawl AI interfaces daily without requiring API keys. The captured answers are processed by Claude CLI for structured extraction (brand mentions, sentiment, competitors, citation sources), stored in SQLite, and visualized through a Next.js 16 + Ant Design dashboard. Leading with Traditional Chinese and targeting non-English markets is a deliberate trade-off — the English market is already a red ocean, while non-English AEO data is a gap that commercial SaaS has long neglected.

**[AICMO/ai-cmo](https://github.com/AICMO/ai-cmo)** is a more complete open-source option using Vue + Python + TypeScript with one-click Docker setup, explicitly supporting ChatGPT / Gemini / Perplexity / Claude. Positioned as an "open-source Profound," but you need to bring your own OpenAI + Vertex AI credentials.

**[danishashko/geo-aeo-tracker](https://github.com/danishashko/geo-aeo-tracker)** has a tech stack most similar to aeo-radar (Next.js 16, TypeScript, Recharts) but with more features — 13 tabs, simultaneous tracking across 6 AI models, 6-stage SRO analysis, citation opportunity scanning, and competitor battlecards. It uses Bright Data's Web Scraper API for data collection — the upside is no need to maintain your own anti-bot strategies; the downside is that Bright Data isn't free.

**[sarahkb125/llm-brand-tracker](https://github.com/sarahkb125/llm-brand-tracker)** takes a different approach — instead of crawling AI interfaces directly, it calls the OpenAI API, auto-crawls your brand's website, generates a batch of prompts from your site content, and queries ChatGPT. The upside is that it's clean and legitimate with no anti-bot concerns; the downside is you're seeing "how API-version ChatGPT views you," which differs from what web users actually see — the web version has real-time search, the API doesn't.

Lightweight options also include [naikpratham-hub/LLM-Brand-Visibility-Analyzer](https://github.com/naikpratham-hub/LLM-Brand-Visibility-Analyzer) and [getcito](https://github.com/ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool).

### Commercial SaaS: The Spectrum from Free Tier to Six-Figure Enterprise Contracts

Pure AEO/GEO vendors:

- **[Profound](https://www.tryprofound.com/)** — Series B $35M, enterprise flagship
- **[AthenaHQ](https://athenahq.ai)** — YC-backed, ex-Google / DeepMind team
- **[Evertune](https://www.evertune.ai/)** — focuses on full AI search customer journey
- **[Peec.ai](https://peec.ai)**, **[Scrunch](https://scrunch.com)**, **[Goodie](https://goodie.ai)**, **[Bluefish AI](https://bluefish.ai)**, **[ZipTie](https://ziptie.ai)**, **[Knowatoa](https://knowatoa.com)** — mid-tier
- **[Otterly.AI](https://otterly.ai)**, **[LLMrefs](https://llmrefs.com/)**, **[AIclicks](https://aiclicks.io/)**, **[Rankscale](https://rankscale.ai/)**, **[Sight AI](https://www.trysight.ai)** — targeting small-to-mid team subscriptions

Traditional SEO platforms extending into AEO modules:

- **[Ahrefs Brand Radar](https://ahrefs.com/brand-radar)** — launched March 2025, bundled into the main Ahrefs subscription
- **[SEMrush AI Visibility Toolkit](https://semrush.com)**
- **[SE Ranking AEO Tool](https://seranking.com/answer-engine-optimization-tool.html)**
- **[HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)** — free, 28-day trial with 10 ChatGPT prompt sets
- **[Writesonic GEO](https://writesonic.com/)** — tracking + content generation bundled

The competitive focus in SaaS has shifted from "can you track ChatGPT" to "citation source analysis depth," "hallucination detection," and "cross-platform share of voice attribution." Pure tracking functionality is becoming increasingly commoditized.

### Citation-Specific Tools (Finer Granularity Than Mentions)

Mention (whether you're referenced) and citation (whether you're used as a source with a link) are different metrics. Tools specializing in citation tracking:

- **[Am I Cited](https://www.amicited.com)** — commercial SaaS focused on citation frequency, sentiment, and share of voice
- **[AI Citation Tracker Chrome Extension](https://chromewebstore.google.com/detail/ai-citation-tracker/mbnlbpijdjbnelpbijdaefhidmlbkiah)** — real-time highlighting during your own searches, green for your brand, red for competitors, free
- **[Decoding](https://trydecoding.com/ai-citation-tracking/)** — commercial citation tracking

Chrome extensions and other "record as you search" lightweight tools are great during the exploration phase before committing to a SaaS purchase.

## Resource Directories: The Meta Layer for Landscape Research

- [amplifying-ai/awesome-generative-engine-optimization](https://github.com/amplifying-ai/awesome-generative-engine-optimization) — currently the most comprehensive GEO tool map
- [geotoolco/AEO-Answer-Engine-Optimization](https://github.com/geotoolco/AEO-Answer-Engine-Optimization) — includes communities, plugins, and consulting firms
- [izak-fisher/generative-engine-optimization-tools](https://github.com/izak-fisher/generative-engine-optimization-tools)
- [luka2chat/awesome-geo](https://github.com/luka2chat/awesome-geo)
- [tentenco/awesome-geo](https://github.com/tentenco/awesome-geo)
- [DavidHuji/Awesome-GEO](https://github.com/DavidHuji/Awesome-GEO) — academic paper collection

## Common Architecture (Output-Layer Tools)

When you tear apart the output-layer open-source projects, they're all running the same pipeline:

```
[Prompt list] → [Query AI interface] → [Structured extraction] → [Storage] → [Dashboard]
     │                  │                       │                    │            │
  Keywords         Playwright /           LLM-as-judge           SQLite /     Next.js
  Brand name       Official API /          (Claude /             Postgres     React
  Competitors      Bright Data            GPT-4 /                             Recharts
                   Scraper API            Gemini)
```

A few design decisions determine which path you take:

**Data acquisition method**: Crawling the web UI vs. calling the API. The former sees the real user experience (including real-time search and citation links) but requires handling anti-bot measures, Cloudflare, and cookie walls; the latter is stable and clean but diverges from what users actually see. aeo-radar chose Playwright + no API key, betting that "the former is more authentic."

**Analysis engine**: aeo-radar uses Claude CLI; AiCMO uses OpenAI + Vertex AI. The CLI approach means no extra API key to apply for — a Max subscription is enough to run it; the API approach enables cloud deployment and multi-worker parallelism.

**Database**: Starting with SQLite and offering a Postgres option is practically the default for this category. Data volumes are typically once daily x N prompts x M models — SQLite handles that fine for a while.

**Multilingual markets**: The open-source landscape currently has very thin coverage for Traditional Chinese / Japanese / Korean. aeo-radar's Traditional Chinese-first approach has no counterpart in the SaaS world.

## Selection Guidelines

Evaluate each of the three layers independently:

**Input layer** (do this first — highest ROI):
- Run isitagentready once, then fill in whatever's missing for llms.txt, robots.txt, and MCP
- To generate llms.txt, run firecrawl/llmstxt-generator (open source) once

**Traffic layer** (worth doing if you self-host analytics):
- Self-hosted: start with Matomo 5.8
- Don't want to touch infrastructure: aibottracker.com free tier
- Content-heavy sites should enable this to know whether GPTBot is crawling you

**Output layer** (see how your brand actually appears in AI answers):
- Quick look: HubSpot AEO Grader (free trial), Ahrefs Brand Radar (if you already subscribe), AI Citation Tracker Chrome Extension (highlights during search)
- Long-term self-hosted: aeo-radar (smoothest for Traditional Chinese markets), AiCMO (most feature-complete), geo-aeo-tracker (most polished UI but requires Bright Data)
- Building your own AEO product: read the source code of aeo-radar and AiCMO, then scan the awesome lists
- Enterprise-grade: Profound or AthenaHQ
- Single-platform subscription: Otterly.AI or LLMrefs
- Citation granularity: Am I Cited

## The Big Picture

The AEO tools category was still a SaaS vendor battlefield in the first half of 2025. By 2026, it has grown into a complete three-layer ecosystem — with both open-source and commercial options across input, traffic, and output layers.

The most interesting observation: **the input and traffic layers are actually more neglected than the output layer**. Everyone is focused on "how is my brand mentioned in AI answers," but very few are first answering "can AI even read my website" and "is AI actually crawling me" — two far more fundamental questions. Both of these layers are within your control, quantifiable, and face far less competition than the output layer.

The output layer's open-source solutions, on the other hand, have matured remarkably fast over the past two years. A combination like aeo-radar — Traditional Chinese-first, Playwright keyless crawling, Claude CLI analysis — didn't even have a viable technical path two years ago. It's possible now because headless browsers, LLM CLIs, and Next.js App Router all matured simultaneously. The barrier to building your own AEO tool is much lower than it appears: the core challenge isn't "writing crawlers and dashboards" but "choosing the right prompts, the right analysis logic, and the right data presentation." The tool is just the shell.

## References

- [isitagentready.com — Cloudflare Agent Readiness Health Check](https://isitagentready.com/)
- [Introducing the Agent Readiness score — Cloudflare Blog](https://blog.cloudflare.com/agent-readiness/)
- [llms-txt.io Validator](https://llms-txt.io/validator)
- [RankRay LLMs.txt Checker](https://rankray.com/free-seo-tools/llms-txt-checker/)
- [llmstxtchecker.net](https://llmstxtchecker.net/)
- [firecrawl/llmstxt-generator (Open-source llms.txt generator)](https://github.com/firecrawl/llmstxt-generator)
- [apify/actor-llmstxt-generator](https://github.com/apify/actor-llmstxt-generator)
- [Blimeo/llms-txt-generator](https://github.com/Blimeo/llms-txt-generator)
- [Matomo 5.8 AI Chatbot Tracking (Traffic-layer analytics)](https://inimino.org/matomo-5-8-launches-ai-chatbot-tracking-dedicated-reports-separate-bot-traffic-from-human-visits/)
- [Zerply AI Traffic Analytics](https://zerply.ai/platform/ai-traffic-analytics)
- [aibottracker.com](https://www.aibottracker.com/)
- [LLM Bot Tracker WordPress Plugin](https://wordpress.org/plugins/llm-bot-tracker-by-hueston/)
- [Overview of OpenAI Crawlers](https://developers.openai.com/api/docs/bots)
- [How to Detect AI Crawlers — GetCito](https://getcito.com/how-to-detect-ai-crawlers-on-your-website)
- [hellowalt/aeo-radar (AEO output-layer open-source tool, Traditional Chinese README)](https://github.com/hellowalt/aeo-radar/blob/main/README.zh-TW.md)
- [AICMO/ai-cmo (Open-source GEO/AEO tracking platform)](https://github.com/AICMO/ai-cmo)
- [danishashko/geo-aeo-tracker](https://github.com/danishashko/geo-aeo-tracker)
- [sarahkb125/llm-brand-tracker](https://github.com/sarahkb125/llm-brand-tracker)
- [naikpratham-hub/LLM-Brand-Visibility-Analyzer](https://github.com/naikpratham-hub/LLM-Brand-Visibility-Analyzer)
- [Profound — AEO/GEO Enterprise SaaS](https://www.tryprofound.com/)
- [AthenaHQ — YC-backed GEO Tool](https://athenahq.ai)
- [Ahrefs Brand Radar — AI Brand Visibility Tracking](https://ahrefs.com/brand-radar)
- [Semrush AI Visibility Toolkit](https://www.semrush.com/)
- [HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)
- [Otterly.AI](https://otterly.ai)
- [LLMrefs — LLM Brand Mention Tracking](https://llmrefs.com/)
- [Am I Cited — AI Citation Tracking](https://www.amicited.com)
- [AI Citation Tracker Chrome Extension](https://chromewebstore.google.com/detail/ai-citation-tracker/mbnlbpijdjbnelpbijdaefhidmlbkiah)
- [Decoding AI Citation Tracking](https://trydecoding.com/ai-citation-tracking/)
- [amplifying-ai/awesome-generative-engine-optimization (GEO Tool Map)](https://github.com/amplifying-ai/awesome-generative-engine-optimization)
- [geotoolco/AEO-Answer-Engine-Optimization](https://github.com/geotoolco/AEO-Answer-Engine-Optimization)
- [DavidHuji/Awesome-GEO (Academic Paper Collection)](https://github.com/DavidHuji/Awesome-GEO)
- [Best AEO/GEO Tracking Tools — aiclicks](https://aiclicks.io/blog/best-aeo-tracking-tools)
- [Profound vs Ahrefs Brand Radar Comparison](https://www.tryprofound.com/blog/ahrefs-brand-radar-review)
