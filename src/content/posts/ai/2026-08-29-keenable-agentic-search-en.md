---
title: "How AI Agent Search Infrastructure Is Changing: Keenable, Independent Indexes, and NEEDLE"
date: 2026-08-29
category: ai
type: deep-dive
tags: [keenable, web-search, ai-agent, mcp, retrieval, search-api, benchmark]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 14
tldr: "Keenable.ai positions itself as search infrastructure for AI agents: a 100B+ document index, Search/Fetch APIs, MCP/CLI entry points, 100K free monthly requests, and keyless public endpoints. It is worth tracking, but the 100B+ index, latency, and quality claims are still mostly company-provided; NEEDLE is open, but needs external reruns and human review."
description: "A research note turned deep dive on Keenable.ai: product positioning, pricing, MCP/API design, Lightpanda and Gradium integrations, NEEDLE benchmark methodology, and the caveats that still matter."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-29-keenable-agentic-search)

[Keenable.ai](https://keenable.ai/) is a new AI search infrastructure company. It is not an answer product like Perplexity. It is trying to sell a web search and content access layer to AI labs, inference platforms, browser agents, and MCP toolchains. The homepage makes the pitch concrete: 100B+ documents, under 250ms p95 in US East, and pricing from $1 per 1,000 requests at 100 RPS+.

Those numbers need caution. The more useful read is this: Keenable has found a real infrastructure problem and describes its product boundary clearly, but it is still early. Search quality and latency need your own tests, not only the company's benchmark.

## The problem is not search, it is agentic search

Human search is usually one query, ten blue links, a few clicks, and human judgement. Agent search is different. An agent searches inside a reasoning loop: it starts with a rough query, reads results, then feeds company names, error codes, dates, `site:` filters, and quoted snippets back into the next query. Those searches may be seconds apart, and one task may issue many of them.

Keenable's [About page](https://keenable.ai/about) frames today's web access tools as human-optimized infrastructure: conventional search APIs return links, while fetch APIs are slow and expensive. Keenable wants models to treat web access almost like parametric knowledge: cheap, low-latency, and usable inside a high-frequency reasoning loop.

That direction makes sense. If you have built agents, "can it search?" is not the only question. The harder questions are latency, snippet usefulness, repeated-query cost, quota behavior, and whether ranking favors content humans click or evidence an agent can use.

## Product boundary: Search, Fetch, CLI, MCP

Keenable's [API reference](https://docs.keenable.ai/api-reference) currently centers on two endpoints: `/v1/search` and `/v1/fetch`. Search returns ranked results with URL, title, description, and snippet. Fetch returns page content as Markdown, plus metadata such as title, description, and author.

There are three entry points. The [Quickstart](https://docs.keenable.ai/) recommends MCP for agents; the CLI handles login, local client setup, and terminal searches; REST is there when you want direct endpoint control. This is the right layering: models want tools, systems want HTTP, and engineers want a CLI for debugging.

The unusual part is the keyless public endpoint. The docs say you can call `/v1/search/public` and `/v1/fetch/public` without an API key, as long as you send `X-Keenable-Title` to identify the application. This is not a production plan: the public pool is limited to 1,000 requests per hour per IP, with a maximum of 10 requests/sec, and everyone on the same egress IP shares the pool. Its value is onboarding and graceful fallback: a tool can return results before a user configures a search key.

## Pricing: the homepage's $1 is not the starter price

Keenable's [Pricing page](https://keenable.ai/pricing) is more specific than the homepage. Agent builders pay $4 per 1,000 requests. AI labs and inference platforms get $1 per 1,000 requests at 100 RPS+ scale. The docs also say authenticated usage includes 100,000 free requests per month, and the [rate-limit page](https://docs.keenable.ai/rate-limits) lists a default authenticated limit of 10 requests/sec per organization, with higher limits negotiated.

So read "from $1 / 1K requests @ 100 RPS+" carefully. That is a scale price, not what an individual or small team should assume. For agent products, $4 per 1,000 requests is plausible, but not something you can blindly add to every reasoning step. You still need search budgets, caching, retries, and fallback behavior.

## Why Keenable keeps talking about an independent index

Keenable's main differentiation is not "we also have a search API." It claims to own an independent web index. The argument in its [NEEDLE post](https://keenable.ai/blog/needle-the-benchmark-your-search-engine-can-t-memorize) is that if you federate other search engines, you can rerank their results and change snippets, but you cannot fix their coverage or make the underlying index learn from agent traffic.

Two things should be separated.

First, owning the index is a plausible prerequisite for a durable moat. Search quality is not only a reranker. It depends on what you crawl, how often you refresh it, how you shard it, how candidates are recalled, how rare queries behave, and how snippets are produced. If agentic search becomes a high-frequency workload, an index owner can optimize for that distribution directly.

Second, owning an index does not automatically win. Google, Bing, and Brave also own indexes. Exa, Tavily, and Parallel each work on different layers of AI search. Keenable's index still needs measurement: freshness, coverage, spam resistance, long-tail behavior, and failure modes. "100B+ documents" is a scale signal, not a quality guarantee.

## NEEDLE: transparent, but not neutral proof

Keenable built something worth taking seriously: [NEEDLE](https://keenableai.github.io/needle/), short for News, Everyday, Expert, Deep-tail, and Legal Evaluation. It breaks search evaluation into five verticals: news, finance, scholar, agentic rare, and legal. The company says news runs hourly and the other suites run daily. The [GitHub repo](https://github.com/keenableai/needle) publishes query generation, engine clients, scoring, and GitHub Actions; run artifacts are archived to a Hugging Face dataset.

That is much better than a single "we are faster" chart. NEEDLE lets you inspect how queries are generated, how each engine is called, and how nDCG@5, recall@K, MRR, latency, and index overlap are computed. It also says clearly that it does not fetch pages or rerank results; it judges each engine's returned ranking, title, and snippet.

The caveat is just as clear: Keenable operates the benchmark itself. The dashboard methodology says the LLM judge has not yet gone through a systematic human-agreement audit. NEEDLE is useful as a rerunnable lead, not as the final market ranking. If you want to use it in a vendor decision, clone the repo, pin a query set, inspect raw artifacts, and rerun at least one slice yourself.

## Adoption signals: Gradium and Lightpanda

Two public adoption signals are visible.

The first is the [Gradium partnership](https://keenable.ai/blog/natural-conversation-live-retrieval-keenable-search-with-gradium). The integration targets voice agents, where a search pause of a few seconds breaks the conversational rhythm. Keenable says its search runs under 200ms, making live retrieval fit inside the conversation budget. That aligns with the latency thesis, but it is still a company partnership post, not an independent benchmark.

The second is the [Lightpanda integration](https://keenable.ai/blog/keenable-now-runs-inside-lightpanda). Lightpanda is a headless browser engine for automation, crawling, and AI agents. Keenable's docs say it is now the keyless fallback for Lightpanda's search tool. Without Brave, Tavily, or Exa keys, Lightpanda can still return `{title, url, snippet}` results through Keenable; higher-volume usage needs `KEENABLE_API_KEY`.

That is more interesting than a logo wall because it enters the default path of an agent/browser runtime. The limitation remains: fallback availability is not the same thing as best quality, and keyless access is not production quota.

## Company status: strong team, early company

[TechCrunch reported on August 25, 2026](https://techcrunch.com/2026/08/25/accel-backed-keenable-is-indexing-the-web-for-ai-agents/) that Keenable came out of stealth with a $26 million seed round led by Accel, with Conviction Partners and angels participating. CEO Andrey Styskin previously led Yandex's search, AI, and cloud division and worked on search infrastructure at Amazon. Co-founder Matthias Petri is an AI scientist. The report also says the team has about 15 engineers and plans to grow by the end of the year.

That background matters. Search infrastructure is experience-heavy. It is not just a wrapper around someone else's API. Yandex and Amazon search experience is a meaningful signal.

But this is still an early company. TechCrunch says Keenable is already in production at several AI labs and inference providers, but the customers are not named. That kind of unnamed-customer claim is common in infrastructure startups. Treat it as a positive signal, not a purchase reason.

## How I would evaluate it

If I were building an agent runtime or browser agent, I would add Keenable to the provider matrix, not immediately replace existing search providers. A practical evaluation would look like this:

1. Run the same query set against Keenable, Brave, Exa, Tavily, and Serper/Google.
2. Record latency, error rate, correct-source hits, and whether snippets are sufficient for a model to answer.
3. Split queries into fresh news, long-tail entities, technical docs, and operator-heavy searches.
4. Treat keyless public endpoints as onboarding or fallback only, not as a production dependency.
5. If NEEDLE scores influence the decision, rerun or at least sample-review the artifacts.

Keenable is most relevant when your agent actually performs frequent web searches inside tasks, and search latency or snippet quality already affects task success. If you only need occasional lookup, Brave, Exa, Tavily, or Serper may already be enough.

## Trade-off

Keenable's thesis is right: AI agents turn search into a workload unlike human search. Human search optimizes for clicks, browsing, and attention. Agent search optimizes for low latency, composition, retries, and evidence a model can use directly.

It is also not just a pitch deck. The public docs already include Search/Fetch APIs, MCP/CLI, keyless public endpoints, pricing, and rate limits. NEEDLE gives you a benchmark repo and dashboard that can be inspected. Lightpanda and Gradium are concrete integrations.

The reservation is quality proof. Search quality is not externally settled yet; 100B+ documents and latency claims are mostly company-provided; customers are largely unnamed; and the benchmark still needs third-party reruns. My conclusion: worth tracking, worth testing, and worth including in an agent search abstraction layer, but not yet proven enough to treat as the winning search infrastructure.

## References

- [Keenable.ai](https://keenable.ai/)
- [What Is Keenable - Independent Web Search for AI](https://keenable.ai/about)
- [Keenable Pricing](https://keenable.ai/pricing)
- [Keenable API reference](https://docs.keenable.ai/api-reference)
- [Keenable Rate limits](https://docs.keenable.ai/rate-limits)
- [Keenable Quickstart](https://docs.keenable.ai/)
- [NEEDLE: The benchmark your search engine can't memorize](https://keenable.ai/blog/needle-the-benchmark-your-search-engine-can-t-memorize)
- [NEEDLE benchmark dashboard](https://keenableai.github.io/needle/)
- [keenableai/needle GitHub repo](https://github.com/keenableai/needle)
- [Keenable now runs inside Lightpanda](https://keenable.ai/blog/keenable-now-runs-inside-lightpanda)
- [Natural conversation, live retrieval: Keenable search with Gradium](https://keenable.ai/blog/natural-conversation-live-retrieval-keenable-search-with-gradium)
- [TechCrunch: Accel-backed Keenable is indexing the web for AI agents](https://techcrunch.com/2026/08/25/accel-backed-keenable-is-indexing-the-web-for-ai-agents/)
