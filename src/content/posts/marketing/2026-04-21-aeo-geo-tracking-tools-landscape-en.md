---
title: "AEO / GEO Tool Landscape: Input, Traffic, and Output Layers — From isitagentready to aeo-radar to Profound"
date: 2026-04-21
updated: 2026-08-19
type: project
category: marketing
tags: [aeo, geo, ai-visibility, brand-monitoring, open-source, self-hosted, llm, ai-seo, cloudflare, agent-readiness, llms-txt, mcp, ai-crawler, gptbot]
lang: en
tldr: "AEO/GEO tools aren't a single category — they span three distinct layers: the input layer (is your website ready for AI to read), the traffic layer (how much are AI bots actually crawling), and the output layer (how is your brand mentioned in AI answers). This post maps out all three layers, from open-source self-hosted options to commercial SaaS."
description: "A complete map of AEO / GEO tools: input-layer tools like isitagentready, llms.txt validators and generators; traffic-layer tools like Matomo, Zerply, aibottracker; output-layer tools like aeo-radar, AiCMO, Profound, AthenaHQ, and Ahrefs Brand Radar. Includes common architecture patterns and selection guidelines."
draft: false
series:
  name: "AEO, GEO, and AI Search"
  order: 5
---

> 🌏 [中文版](/posts/marketing/2026-04-21-aeo-geo-tracking-tools-landscape)

AEO / GEO tools have grown from "SEO vendor add-on features" into a fully independent category over the past two years. The motivation is straightforward: Google search still matters, but more and more users are asking ChatGPT, Perplexity, Gemini, and Claude directly, getting synthesized answers — and whether your brand appears in those answers, where it ranks, and whose content gets cited are completely invisible to traditional SEO metrics.

But "AEO tools" is actually a very loose term. When you break it down, it covers three entirely different layers:

- **Input layer**: Is your website ready for AI agents to read (you have full control)
- **Traffic layer**: How much are AI bots actually crawling your pages (you can observe but not control)
- **Output layer**: How does AI mention you when generating answers (you can only influence)

This post maps out the tool landscape across all three layers, then pulls out common architecture patterns and selection guidelines.

> **Update, August 2026**: this piece was written in April 2026, and three significant things happened to the category in the four months since — Adobe completed its acquisition of Semrush (2026-04-28), Sitecore acquired Scrunch (2026-06-03), and Profound closed a $96M Series C at a $1B valuation (February 2026). Meanwhile the empirical data on llms.txt arrived, and it points the opposite way from the original draft. This refresh verifies each vendor site is still live, replaces perishable pricing and feature tables with the trade-offs that actually decide things, and annotates each open-source project with its last update.

## Input Layer: Is Your Website Ready for AI to Read?

This is the only layer you can control 100%. Tools fall into two categories: comprehensive health checks and llms.txt-specific tools.

### Comprehensive Health Checks

**[isitagentready.com](https://isitagentready.com/)** (by Cloudflare) is currently the most complete input-layer health check. Paste a URL, select Content Site / API / All Checks, and get a scored report covering four dimensions:

- **Discoverability**: robots.txt, sitemap, llms.txt
- **Content**: Markdown content negotiation, structured data
- **Bot Access Control**: AI crawler declarations (`AI-usage` directives)
- **Capabilities**: MCP endpoint, OAuth, Agent Skills, agentic commerce

The scan statistics Cloudflare published in its [launch post](https://blog.cloudflare.com/agent-readiness/) are striking — at the time, only about 4% of the **200,000 most visited domains** declared AI usage preferences and 3.9% supported Markdown negotiation (the population is not "all websites", and redirect and ad-server categories were already filtered out). Those are launch-date figures, but the post states the chart is **updated weekly** — current values are available through Cloudflare Radar's Data Explorer or API, so cite them with a date attached. Think of it as "Lighthouse for AI agents" — free, no registration required.

### llms.txt-Specific Tools

**Validators** (paste a URL to check llms.txt format):

- [llms-txt.io/validator](https://llms-txt.io/validator)
- [RankRay LLMs.txt Checker](https://rankray.com/free-seo-tools/llms-txt-checker/)
- [llmstxtchecker.net](https://llmstxtchecker.net/)
- [Pixelmojo](https://www.pixelmojo.io/tools/llms-txt-validator) — includes AI suggestions
- [indexly.ai](https://indexly.ai/llms-txt-checker)

**Open-source generators** (crawl your site and produce llms.txt):

- [firecrawl/llmstxt-generator](https://github.com/firecrawl/llmstxt-generator) — the most-starred option (last updated 2025-06)
- [apify/actor-llmstxt-generator](https://github.com/apify/actor-llmstxt-generator) — packaged as an Apify Actor, actively maintained (last updated 2026-05)
- [Blimeo/llms-txt-generator](https://github.com/Blimeo/llms-txt-generator) — can automatically monitor site changes, but has essentially no community (0 stars, last updated 2025-09); read the code before running it

**The original draft's judgment here has been overturned.** It argued that low adoption made this "an easy area to establish an early advantage". The evidence that has since emerged shows the problem isn't adoption — it's that **nobody reads the file**:

- Ahrefs analyzed server logs across 137,000 sites and found [97% of llms.txt files were never requested](https://ahrefs.com/blog/llmstxt-study/), and that no AI bot goes looking for an llms.txt that doesn't exist
- SE Ranking scanned 300,000 domains in [November 2025 and found 10.13% had one](https://seranking.com/blog/llms-txt/) — note this inverts the study's own conclusion, which calls it "a niche practice with very limited adoption", with nearly nine in ten sites not adopting it. The Ahrefs study above measured about 28%; the populations and dates differ, so don't read them as the same measurement
- In May 2026 Google put llms.txt on its ["you don't need to" list](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), and clarified on 2026-06-15 that such files "won't negatively or positively impact your visibility or rankings"

The one use with evidence behind it is that AI coding assistants read it on documentation sites. So: **worth doing for documentation sites, not worth prioritizing elsewhere** — which downgrades the validators and generators above from essential to merely handy.

## Traffic Layer: How Much Are AI Bots Actually Crawling You?

This is the most easily overlooked category. Traditional GA / Plausible **filters out** bot traffic by default, so even if GPTBot, ClaudeBot, and PerplexityBot are crawling thousands of your pages daily, you won't see it on your dashboard.

There's a new reason this layer matters in the second half of 2026: Cloudflare [announced](https://blog.cloudflare.com/content-independence-day-ai-options/) that from **2026-09-15** its defaults will block "mixed-use" crawlers (those combining search, training, and agent use) from ad-supported pages, applying to new customers, new sites added by existing customers, and all free-tier customers (the "mixed-use" definition and the scope live in the [press release](https://www.cloudflare.com/press/press-releases/2026/cloudflare-allows-the-agentic-internet-to-flourish-with-a-simple-philosophy-your-content-your-rules/); the blog post only covers the new-domains case). Which means **your AI bot traffic may change without you changing anything** — and you can only see that happen if you're measuring this layer.

Several emerging specialized tools:

- **[Matomo AI Assistants](https://matomo.org/guide/reports/ai-assistants/)** — a mainstream open-source analytics platform with built-in AI reports separating AI bot traffic from human traffic. AI chatbot reports landed in [5.8.0](https://matomo.org/blog/2026/03/new-feature-matomo-ai-assistants-tracking/) (March 2026), which has an official announcement; referral tracking and Content Requests (which pages AI actually pulls) also exist, but the exact versions they shipped in are not traceable in the changelog — check the [changelog](https://matomo.org/changelog/) yourself if you need to pin a version. Choose this if you want self-hosted analytics
- **[Zerply AI Traffic Analytics](https://zerply.ai/platform/ai-traffic-analytics)** — commercial SaaS, no code to embed, connects directly to CDN/reverse proxy
- **[aibottracker.com](https://www.aibottracker.com/)** — free, unlimited checks, lightweight option
- **[LLM Bot Tracker](https://wordpress.org/plugins/llm-bot-tracker-by-hueston/)** — WordPress plugin version

DIY enthusiasts can pull directly from access logs using ELK / Grafana / Datadog. The `User-Agent` signature list (GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, CCBot...) is well-documented on each provider's website and not hard to implement.

## Output Layer: How Is Your Brand Mentioned in AI Answers?

This is the most crowded battlefield for AEO/GEO tools, and the original starting point for this post (aeo-radar lives in this layer).

### Open-Source Self-Hosted

The core value proposition is the same across the board: **skip the SaaS subscription; keep your data and prompts on your own machine**. The differences lie in tech stack and data acquisition method.

Self-hosting has three hidden costs worth pricing before you commit: maintaining anti-bot workarounds (AI interfaces change their login walls and Cloudflare challenges), LLM tokens for the analysis step, and your own time. At a small number of tracked prompts, self-hosting usually wins; at scale, the first two costs converge on a SaaS subscription.

Each project below is annotated with its last update (verified August 2026). Churn in this category is high — treat long-dormant projects as reference implementations, not products you can depend on.

**[aeo-radar](https://github.com/hellowalt/aeo-radar)** (last updated 2026-07, maintained) uses Playwright to headlessly crawl AI interfaces daily without requiring API keys. The captured answers are processed by Claude CLI for structured extraction (brand mentions, sentiment, competitors, citation sources), stored in SQLite, and visualized through a Next.js 16 + Ant Design dashboard. Leading with Traditional Chinese and targeting non-English markets is a deliberate trade-off — the English market is already a red ocean, while non-English AEO data is a gap that commercial SaaS has long neglected.

**[AICMO/ai-cmo](https://github.com/AICMO/ai-cmo)** (last updated 2025-10, long dormant) is a more complete open-source option using Vue + Python + TypeScript with one-click Docker setup, explicitly supporting ChatGPT / Gemini / Perplexity / Claude. Positioned as an "open-source Profound," but you need to bring your own OpenAI + Vertex AI credentials.

**[danishashko/geo-aeo-tracker](https://github.com/danishashko/geo-aeo-tracker)** (last updated 2026-08, the fastest-growing of these — past 200 stars) has a tech stack most similar to aeo-radar (Next.js 16, TypeScript, Recharts) but with more features — 13 tabs, simultaneous tracking across 6 AI models, 6-stage SRO analysis, citation opportunity scanning, and competitor battlecards. It uses Bright Data's Web Scraper API for data collection — the upside is no need to maintain your own anti-bot strategies; the downside is that Bright Data isn't free.

**[sarahkb125/llm-brand-tracker](https://github.com/sarahkb125/llm-brand-tracker)** (last updated 2025-07, long dormant) takes a different approach — instead of crawling AI interfaces directly, it calls the OpenAI API, auto-crawls your brand's website, generates a batch of prompts from your site content, and queries ChatGPT. The upside is that it's clean and legitimate with no anti-bot concerns; the downside is you're seeing "how API-version ChatGPT views you," which differs from what web users actually see — the web version has real-time search, the API doesn't.

Lightweight options also include [naikpratham-hub/LLM-Brand-Visibility-Analyzer](https://github.com/naikpratham-hub/LLM-Brand-Visibility-Analyzer) (1 star, untouched since 2025-10 — read it as a sample, not a tool) and [getcito](https://github.com/ai-search-guru/getcito-worlds-first-open-source-aio-aeo-or-geo-tool).

### Commercial SaaS: The Spectrum from Free Tier to Six-Figure Enterprise Contracts

**No prices in this section.** Nearly every price point the original draft quoted has changed within four months (some cut, some dropped their free tier, some moved to EUR geo-pricing), and most vendors tier their entry plans by number of tracked prompts and engines covered, which makes a bare monthly figure meaningless. Check each vendor's pricing page. What follows is positioning plus status as of August 2026.

Pure AEO/GEO vendors (each site verified live in August 2026):

- **[Profound](https://www.tryprofound.com/)** — the enterprise flagship. The original draft's "Series B $35M" is out of date: on 2026-02-24 it closed a [$96M Series C at a $1B valuation](https://www.tryprofound.com/blog/profound-raises-96m-series-c) led by Lightspeed, bringing total funding past $155M, and the product has expanded from tracking into Agents that produce content
- **[AthenaHQ](https://athenahq.ai)** — YC-backed, ex-Google / DeepMind team
- **[Evertune](https://www.evertune.ai/)** — focuses on full AI search customer journey
- **[Scrunch](https://scrunch.com)** — **acquired by Sitecore** ([announced 2026-06-03](https://www.sitecore.com/company/newsroom/press-releases/2026/06/sitecore-acquires-scrunch-to-help-brands-influence-discovery--and-buying-decisions)). The brand and site are still up, but it's now folded into Sitecore's DXP, so future purchasing decisions attach to a Sitecore contract
- **[Peec.ai](https://peec.ai)**, **[ZipTie](https://ziptie.ai)**, **[Knowatoa](https://knowatoa.com)** — mid-tier
- **Goodie**, **Bluefish AI** — **both gone**. goodie.ai is now a domain-for-sale page and bluefish.ai redirects to a parking page. Both domains still return HTTP 200, so a status-code check would report them as alive — which is exactly the risk in this category: the tool is still on your dashboard after the company has stopped existing
- **[Otterly.AI](https://otterly.ai)**, **[LLMrefs](https://llmrefs.com/)**, **[AIclicks](https://aiclicks.io/)**, **[Rankscale](https://rankscale.ai/)**, **[Sight AI](https://www.trysight.ai)** — targeting small-to-mid team subscriptions

Traditional SEO platforms extending into AEO modules:

- **[Ahrefs Brand Radar](https://ahrefs.com/brand-radar)** — launched March 2025, bundled into the main Ahrefs subscription
- **Semrush AI Visibility Toolkit** — **Semrush has been acquired by Adobe**; the deal [closed 2026-04-28](https://news.adobe.com/news/2026/04/adobe-completes-semrush-acquisition) ($1.9B all-cash, announced November 2025). It's now part of Adobe's customer experience line, and how it consolidates with Adobe LLM Optimizer is still unsettled — worth pinning down before signing a long contract
- **[SE Ranking AEO Tool](https://seranking.com/answer-engine-optimization-tool.html)**
- **[HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)** — a free one-off health check (trial terms change; check the site)
- **[Writesonic GEO](https://writesonic.com/)** — tracking + content generation bundled

**Two structural shifts in 2026**: first, **a wave of acquisitions** — within six months Adobe took Semrush and Sitecore took Scrunch, and pure tracking tools are being absorbed into larger marketing and content platforms. Second, **the competitive frontier moved up** — from "can you track ChatGPT" to "citation source analysis depth", "hallucination detection", and "cross-platform share of voice attribution", and now toward "once you find the problem, can the tool fix the content". Pure tracking is becoming commoditized.

The question worth asking during evaluation is: **will this company still exist independently in two years?** Being acquired isn't necessarily bad — more resources — but your data export path, API commitments, and pricing all change with it.

### Citation-Specific Tools (Finer Granularity Than Mentions)

Mention (whether you're referenced) and citation (whether you're used as a source with a link) are different metrics. Tools specializing in citation tracking:

- **[Am I Cited](https://www.amicited.com)** — commercial SaaS focused on citation frequency, sentiment, and share of voice
- **[AI Citation Tracker Chrome Extension](https://chromewebstore.google.com/detail/ai-citation-tracker/mbnlbpijdjbnelpbijdaefhidmlbkiah)** — real-time highlighting during your own searches, green for your brand, red for competitors, free
- **[Decoding](https://trydecoding.com/ai-citation-tracking/)** — commercial citation tracking

Chrome extensions and other "record as you search" lightweight tools are great during the exploration phase before committing to a SaaS purchase.

## Resource Directories: The Meta Layer for Landscape Research

- [amplifying-ai/awesome-generative-engine-optimization](https://github.com/amplifying-ai/awesome-generative-engine-optimization) — currently the most comprehensive GEO tool map
- [geotoolco/Top-Answer-Engine-Optimization](https://github.com/geotoolco/Top-Answer-Engine-Optimization) — includes communities, plugins, and consulting firms (the repo was renamed; the old URL redirects)
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
- Generating llms.txt is optional now — worth it for documentation sites, low priority elsewhere (see the input-layer section)

**Traffic layer** (worth doing if you self-host analytics):
- Self-hosted: start with Matomo's AI Assistants reports (5.8.0 and later)
- Don't want to touch infrastructure: aibottracker.com free tier
- Content-heavy sites should enable this to know whether GPTBot is crawling you

**Output layer** (see how your brand actually appears in AI answers):
- Quick look: HubSpot AEO Grader (free trial), Ahrefs Brand Radar (if you already subscribe), AI Citation Tracker Chrome Extension (highlights during search)
- Long-term self-hosted: aeo-radar (smoothest for Traditional Chinese markets, still maintained), geo-aeo-tracker (most features and the most active, but requires Bright Data); AiCMO is feature-complete but long dormant — read it as a reference implementation
- Building your own AEO product: read the source code of aeo-radar and geo-aeo-tracker, then scan the awesome lists
- Enterprise-grade: Profound or AthenaHQ; if you're already inside the Sitecore or Adobe ecosystem, check whether an existing contract covers it (Scrunch → Sitecore, Semrush → Adobe)
- Single-platform subscription: Otterly.AI or LLMrefs
- Citation granularity: Am I Cited

## The Big Picture

The AEO tools category was still a SaaS vendor battlefield in the first half of 2025. By 2026, it has grown into a complete three-layer ecosystem — with both open-source and commercial options across input, traffic, and output layers.

The most interesting observation: **the input and traffic layers are actually more neglected than the output layer**. Everyone is focused on "how is my brand mentioned in AI answers," but very few are first answering "can AI even read my website" and "is AI actually crawling me" — two far more fundamental questions. Both of these layers are within your control, quantifiable, and face far less competition than the output layer.

The output layer's open-source solutions, on the other hand, have matured remarkably fast over the past two years. A combination like aeo-radar — Traditional Chinese-first, Playwright keyless crawling, Claude CLI analysis — didn't even have a viable technical path two years ago. It's possible now because headless browsers, LLM CLIs, and Next.js App Router all matured simultaneously. The barrier to building your own AEO tool is much lower than it appears: the core challenge isn't "writing crawlers and dashboards" but "choosing the right prompts, the right analysis logic, and the right data presentation." The tool is just the shell.

## Changelog

- 2026-08-19: Fact-checked against primary sources and refreshed; perishable details handed back to official docs. Added to the "AEO, GEO, and AI Search" series.

## References

- [isitagentready.com — Cloudflare Agent Readiness Health Check](https://isitagentready.com/)
- [Introducing the Agent Readiness score — Cloudflare Blog](https://blog.cloudflare.com/agent-readiness/)
- [llms-txt.io Validator](https://llms-txt.io/validator)
- [RankRay LLMs.txt Checker](https://rankray.com/free-seo-tools/llms-txt-checker/)
- [llmstxtchecker.net](https://llmstxtchecker.net/)
- [firecrawl/llmstxt-generator (Open-source llms.txt generator)](https://github.com/firecrawl/llmstxt-generator)
- [apify/actor-llmstxt-generator](https://github.com/apify/actor-llmstxt-generator)
- [Blimeo/llms-txt-generator](https://github.com/Blimeo/llms-txt-generator)
- [Matomo AI Assistants reports](https://matomo.org/guide/reports/ai-assistants/) and the [5.8.0 announcement](https://matomo.org/blog/2026/03/new-feature-matomo-ai-assistants-tracking/) (traffic-layer analytics)
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
- [Profound — AEO/GEO Enterprise SaaS](https://www.tryprofound.com/) and the [$96M Series C announcement (February 2026)](https://www.tryprofound.com/blog/profound-raises-96m-series-c)
- [Sitecore acquires Scrunch (2026-06-03)](https://www.sitecore.com/company/newsroom/press-releases/2026/06/sitecore-acquires-scrunch-to-help-brands-influence-discovery--and-buying-decisions)
- [Adobe completes Semrush acquisition (2026-04-28)](https://news.adobe.com/news/2026/04/adobe-completes-semrush-acquisition)
- [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read — Ahrefs](https://ahrefs.com/blog/llmstxt-study/)
- [LLMs.txt: Why Brands Rely On It and Why It Doesn't Work — SE Ranking](https://seranking.com/blog/llms-txt/)
- [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — Google puts llms.txt on the "you don't need to" list
- [Your site, your rules: new AI traffic options for all customers — Cloudflare](https://blog.cloudflare.com/content-independence-day-ai-options/) — the default-blocking policy effective 2026-09-15
- [AthenaHQ — YC-backed GEO Tool](https://athenahq.ai)
- [Ahrefs Brand Radar — AI Brand Visibility Tracking](https://ahrefs.com/brand-radar)
- [Semrush AI Visibility Toolkit](https://www.semrush.com/) (now part of Adobe)
- [HubSpot AEO Grader](https://www.hubspot.com/aeo-grader)
- [Otterly.AI](https://otterly.ai)
- [LLMrefs — LLM Brand Mention Tracking](https://llmrefs.com/)
- [Am I Cited — AI Citation Tracking](https://www.amicited.com)
- [AI Citation Tracker Chrome Extension](https://chromewebstore.google.com/detail/ai-citation-tracker/mbnlbpijdjbnelpbijdaefhidmlbkiah)
- [Decoding AI Citation Tracking](https://trydecoding.com/ai-citation-tracking/)
- [amplifying-ai/awesome-generative-engine-optimization (GEO Tool Map)](https://github.com/amplifying-ai/awesome-generative-engine-optimization)
- [geotoolco/Top-Answer-Engine-Optimization](https://github.com/geotoolco/Top-Answer-Engine-Optimization)
- [DavidHuji/Awesome-GEO (Academic Paper Collection)](https://github.com/DavidHuji/Awesome-GEO)
- [Best AEO/GEO Tracking Tools — aiclicks](https://aiclicks.io/blog/best-aeo-tracking-tools)
- [Profound vs Ahrefs Brand Radar Comparison](https://www.tryprofound.com/blog/ahrefs-brand-radar-review)
