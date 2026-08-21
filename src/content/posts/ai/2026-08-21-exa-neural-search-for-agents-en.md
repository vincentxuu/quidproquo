---
title: "Exa: Neural Search Built for Agents, Not People"
date: 2026-08-21
category: ai
type: deep-dive
tags: [exa, web-search, ai-agent, mcp, neural-search, developer-tools]
lang: en
tldr: "Exa turns every indexed web page into an embedding and retrieves by vector similarity instead of keyword matching. Official pricing as checked on 2026-08-21: $7 / 1k requests for /search (first 10 results included), $1 / 1k pages for /contents, $12–15 / 1k for the deep tiers, with $20 in free credits for new accounts. This blog's CLAUDE.md puts Exa first among cloud fetch tools, 16 of its 38 skills reference it directly, and only four existing posts mention it in passing — with zero dedicated posts. This is that post."
description: "A deep dive on the Exa search API: how neural retrieval differs mechanically from keyword search, the embedding index and in-house vector database, why agent workflows need a different shape of search, pricing and latency tiers verified 2026-08-21, plus the real limits — no self-hosting, per-request billing, and vendor-reported numbers."
series:
  name: "Technology Choices in the AI Era"
  order: 12
draft: false
---

🌏 [中文版](/posts/ai/2026-08-21-exa-neural-search-for-agents)

The first eleven posts in this series covered things other people use that I did not. This one inverts that. This blog's `CLAUDE.md` carries an explicit rule about web-fetch priority: `stealth_fetch` first, then `mcp__claude_ai_Exa__*`, then Tavily / linkup / jina, and only then the built-in `WebFetch`. Sixteen of the 38 skills in this repo reference exa directly in their instructions, while only four existing posts mention it in passing — across zero dedicated articles. Every primary source in this post was pulled with Exa's own `web_fetch_exa` after Firecrawl ran out of credits mid-research. Used daily, never written about. So let's write about it.

## What Exa Is

[Exa](https://exa.ai/) (formerly Metaphor) is a San Francisco search company selling a set of HTTP APIs: `/search` to find pages, `/contents` to pull them, `/answer` for a direct answer, `/monitors` for scheduled reruns, and an Agent API for multi-step research. What separates it from the Google/Bing lineage is that it **crawls, indexes, and trains its own retrieval models** rather than wrapping somebody else's SERP.

The scale numbers are self-reported. When Exa announced on 2026-08-17 that it [powers search in Firefox](https://exa.ai/blog/exa-firefox), it described its index as "1.4 trillion URLs and 100 billion documents." Mozilla [published a matching announcement](https://blog.mozilla.org/en/firefox/firefox-exa-partnership/) confirming that Smart Window on desktop and Quick Answers on iOS now source their citations from Exa, with a zero-data-retention commitment. Three months earlier, the [Series C announcement](https://exa.ai/blog/announcing-series-c) listed customers: Cursor, Cognition, HubSpot, OpenRouter, Monday.com.

All of those figures come from Exa's own posts and this site has not independently verified them — read them at that level. What is independently verifiable is the Firefox partnership, which Mozilla confirmed on its own blog rather than leaving it as a one-sided vendor claim.

## How Neural Search Actually Differs From Keyword Search

"Smarter" is not an explanation. The mechanism is.

Classic keyword retrieval (the BM25 lineage) builds an inverted index: split every document into terms, record which documents contain which terms, then at query time match terms and score by term frequency against document frequency, multiplied by quality signals like the link graph. The hard limit is that **query and document must share literal words**, and the design barely absorbs extra compute — once the index is built, ten times the GPUs will not make BM25 more accurate.

Exa took the other route: train a transformer to compress **every web page** into an embedding, compress the query the same way, and compare the two by dot product. [Exa's own account](https://exa.ai/blog/how-to-build-nextgen-search) is that other engines preprocess documents into keywords while they preprocess documents into embeddings.

The training signal comes from the sentence that introduces a link — next-link prediction. Someone writes "I read a great article about X:" and the link that follows is the correct answer for that sentence. The model learns to predict the link from the description.

That training objective directly determines how you should phrase a query. **Write what someone would say when introducing the link, not keywords.** The docs are blunt about it: the query field "supports long, semantically rich descriptions for finding niche content," with `"blog post about embeddings and vector search"` as the example. A concrete thing to do tonight: take a `query: "React vs Vue performance"` from an agent you already run, change it to `query: "blog post comparing React and Vue rendering performance with benchmarks"`, fire both, and compare the top five.

On the serving side they wrote their own vector database. The [2024-12 engineering post](https://exa.ai/blog/building-web-scale-vector-db) breaks it down into five stacked optimizations:

- **Truncate**: embeddings are trained with Matryoshka, so a prefix is itself a usable approximation — 4,096 dimensions cut to the first 256, a 20x memory reduction
- **Quantize**: each dimension goes from a 16-bit float to 1 bit (greater than zero becomes 1, otherwise -1), another 16x
- **Look up**: query vectors stay floating point while document vectors are only ±1, so a length-4 subvector has just 16 possible values and every dot product is precomputed into a table
- **Cluster**: documents are split into 100,000 clusters and a query only scans its own cluster plus nearby ones
- **Rerank**: every step above is lossy, so the coarse results get reranked against uncompressed data to recover recall

Note that this describes the system as of late 2024. [Exa 2.0 (2025-10)](https://exa.ai/blog/exa-api-2-0) says the vector database got new clustering algorithms and lexical compression, and the embedding model was retrained for over a month on 144 H200s. Read those numbers as "this is the shape of their approach," not "these are today's parameters."

One more thing: the current docs **no longer expose `neural` or `keyword` as selectable types**. `type` now controls latency and depth (`auto` / `fast` / `instant` / `deep-lite` / `deep` / `deep-reasoning`), with a single note that "some older docs and payloads still use legacy search-type names." Plenty of tutorials online still teach `type="neural"`; copying them will fail.

## Agents Need a Different Shape of Search Than People Do

A human using a search engine gets ten blue links, skims them, clicks two, hits back, clicks a third. The cost of that loop is **attention**, and attention can be aborted at any moment.

An agent using a search engine puts the results straight into a context window. The cost is **tokens**, and the agent cannot glance at a bad result and discard it — the useless one still consumes tokens, still participates in downstream reasoning, and still gets a chance to pull the answer off course. Three concrete requirements fall out of that difference, and Exa's API is shaped around them.

**First, token efficiency.** The docs recommend `highlights` over full text for agent workflows, claiming a 10x token reduction with no added latency — highlights chunk the page and pick the passages matching your query. The change is small: `{"contents": {"highlights": true}}`, switching to `text` with a `maxCharacters` cap only when you genuinely need the whole page.

**Second, latency tiers.** The docs list `instant` at roughly 250 ms, `fast` at roughly 450 ms, `auto` at about a second, and the deep tiers from 4 to 40 seconds. Those are documented figures; this site has not benchmarked them. The point of tiers is that different nodes in one agent should use different ones — `instant` for grounding mid-conversation, `deep` for the research pass before writing a report.

**Third, control over freshness and shape.** `maxAgeHours` decides whether to livecrawl: `24` recrawls anything cached longer than a day, `0` always livecrawls, `-1` serves cache only. `outputSchema` makes it return the JSON you want (max nesting depth 2, max 10 total properties), and `category` restricts search to `company` / `people` / `publication` / `news` / `personal site` / `financial report`. One easy mistake: `includeDomains` already accepts path prefixes (`exa.ai/blog`) and subdomain wildcards (`*.substack.com`), and the docs explicitly say not to duplicate that with a `site:` operator in the query.

## What It Costs (Verified 2026-08-21)

Pricing is the fastest thing to go stale. Everything below was read from [exa.ai/pricing](https://exa.ai/pricing) on 2026-08-21. There is no subscription and no minimum spend — you load credits and get charged per request.

| Endpoint | Base price (up to 10 results) | Each result above 10 | AI page summaries |
|---|---|---|---|
| `/search` | $7 / 1k requests | $1 / 1k results | $1 / 1k pages |
| `/answer` | $5 / 1k requests | — | — |
| `/monitors` | $15 / 1k requests | $1 / 1k results | $1 / 1k pages |
| `/contents` | $1 / 1k pages, per content type | — | $1 / 1k pages |

The deep tiers price separately: `deep-lite` and `deep` are both $12 / 1k requests, `deep-reasoning` is $15 / 1k. The Agent API lets you fix an `effort` level for a predictable per-request price, from $0.012 (`minimal`) to $1.00 (`xhigh`); `auto` meters actual usage against a $5 default cap per run.

Free allowance: new accounts get $20 (which Exa converts to roughly 2,800 searches), and the Free Tier adds $10 in credits monthly. The MCP path is looser still — `https://mcp.exa.ai/mcp` works without a key, returns 429 when you exhaust the free rate limit, and that is when you add `x-api-key` to the headers.

One billing detail worth remembering: "per content type" on `/contents` means one page requested with both `text` and `highlights` bills as two pages. Also, pulling contents through `/search` is **free for the first 10 results** — the docs themselves recommend using `/search` with contents for search-shaped use cases rather than searching first and calling `/contents` separately.

## How This Blog Actually Uses It

This site has always used Exa as a fetch tool rather than as a search engine, which is not where most introductions put the emphasis.

The logic of that `CLAUDE.md` priority rule is: try `stealth_fetch` for anti-bot evasion first, fall back to cloud MCP servers, and Exa leads that list. In practice `web_fetch_exa` is often the only tool that gets certain sites down cleanly — this article is the case in point. The plan was to scrape Exa's docs with Firecrawl; the very first call returned `Insufficient credits`, and the entire source set ended up being fetched by Exa, from Exa's own documentation.

On the MCP side only two tools are enabled by default: `web_search_exa` and `web_fetch_exa`. `agent_run` (multi-step research) and `web_search_advanced_exa` (the full search parameter surface) only appear if you name them with `?tools=` on the URL. That default is a good call — [this site has written about MCP tool descriptions blowing up an agent's context](/posts/tech/2026-05-18-llm-tool-description-hard-rules-en), and two tools with short descriptions treat an agent far better than ten tools each carrying a long schema. Opt in explicitly when you need more: `https://mcp.exa.ai/mcp?tools=web_search_exa,web_fetch_exa,agent_run`.

One more detail that connects straight back to [the llms.txt post earlier in this series](/posts/tech/2026-08-21-llms-txt-en): every page of Exa's docs has a `.md` twin (`https://exa.ai/docs/reference/exa-mcp.md`), and `https://exa.ai/docs/llms.txt` carries the full index. That removes an entire HTML-cleanup layer when an agent reads the docs — the research for this post was exactly that: fetch `llms.txt` for the page list, then fetch each `.md`.

## Which Layer You Are Actually Buying

This is not a comparison post — the head-to-head of comparable services lives in [this site's search MCP comparison](/posts/ai/2026-05-07-ai-search-mcp-tools-en), and tool selection for scraping is in the [AI scraping tool landscape](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en). This section answers one question that follows directly from the mechanism above: when you pay, which segment of the chain are you paying for.

Search decomposes into three layers: **who crawls, who ranks, and who shapes the result into something an agent can consume**. Four categories of service sit at different layers:

| Service | What you are buying |
|---|---|
| SERP APIs ([Serper](https://serper.dev/), [SerpAPI](https://serpapi.com/)) | Somebody else's ranking, wrapped in structured JSON |
| [Firecrawl](https://github.com/firecrawl/firecrawl) | Fetching and conversion — pages washed into clean Markdown |
| [Tavily](https://tavily.com/) | Reranked, summarized, agent-ready results |
| Exa | Its own crawled index plus the embedding retrieval model on top |

Next-link prediction and the five-layer vector pipeline described earlier are all descriptions of that last row. It also determines how replaceable each layer is: the Markdown-washing layer swaps out for another tool, the reranking layer swaps out for another model, but **a continuously recrawled index of the web has no equivalent substitute** — a subject this site covers separately in [Tavily and Exa have no on-prem option](/posts/ai/2026-08-21-self-hosted-search-stack-en).

The flip side: if your queries are genuinely keyword-shaped — a specific error string, a known API name — you barely touch the two layers you are paying for, and per-request billing charges you the same.

## The Honest Part: Limits and When Not to Use It

**There is no self-hosted version.** Cloud-only, billed per request. The Enterprise plan offers custom indexes, SLAs, and zero data retention, but those are contractual commitments — the machines stay on Exa's side. If your data genuinely cannot leave your premises, this path is closed. How far a self-hosted stack gets you and what it costs is a separate post: [Tavily and Exa have no on-prem option](/posts/ai/2026-08-21-self-hosted-search-stack-en).

**Per-request billing is a poor fit for high-frequency keyword lookups.** $7 / 1k is negligible inside a research workflow, but if your agent fires three searches per turn across hundreds of thousands of turns a day, the bill is not necessarily proportional to the value of "precise answers." Measure before choosing: log a week of search calls, split them into "findable by keyword" and "only findable semantically," and let the ratio decide what you should be paying.

**Neural retrieval is less predictable than keyword retrieval.** Exa's founder says so himself, plainly, in [A Perfect Search Engine](https://exa.ai/blog/perfect-search):

> Neural search engines are more chaotic and unpredictable, but in time they will win over traditional ones.
>
> — Will Bryk, co-founder and CEO of Exa, 2025-01-07

"Will win in time" is his judgment; "unpredictable" is your cost today. In practice, rephrasing the same question can return quite different results. Treat queries like prompts — store them, version them, do not rewrite them from scratch each time.

**The docs contain instructions addressed to agents.** Exa's [Search API guide](https://exa.ai/docs/reference/search-api-guide) embeds a block that speaks directly to coding agents, opening with "IMPORTANT INSTRUCTIONS FOR AI CODING AGENTS." It tells the agent to stop and go generate integration code through the dashboard onboarding flow instead; if the agent has browser automation, it suggests the agent run that flow itself. This is not malicious, but it is a real pattern: **the documentation your agent reads may contain messages written for your agent**. If your workflow pipes fetched docs straight into an agent, that is worth knowing.

**Every performance number is vendor-reported.** Index size, latency, benchmark scores — all from Exa's own announcements, none reproduced here. What is checkable is that they publish methodology (the vector database post goes down to assembly-level optimizations) and that the MCP server is [open source on GitHub](https://github.com/exa-labs/exa-mcp-server).

## Overall

Exa is betting on a specific premise: the primary user of search is shifting from humans to agents, and agents want something different — not ten links to choose from, but precise data that fits a token budget, with controllable freshness and a specifiable return shape. That bet shows up in every corner of the API, from `highlights` to `outputSchema` to `maxAgeHours`.

As a selection call: if your agent mostly does research, comparison, or finding the thing you can describe but cannot name, Exa is the most direct next step, and $20 of free credit is enough to judge it against your own query mix in an afternoon. If you need self-hosting, pure keyword lookup, or high-frequency calls squeezed to the last cent, this is not your tool.

And if you are like this site — using it mostly as the thing that can actually fetch a page, rather than as a search engine — that is entirely reasonable too. Just remember that what you are paying for is something else.

## References

- [Exa official site](https://exa.ai/)
- [Exa Pricing (verified 2026-08-21)](https://exa.ai/pricing)
- [Exa docs index, llms.txt](https://exa.ai/docs/llms.txt)
- [Exa Search API guide](https://exa.ai/docs/reference/search-api-guide)
- [Exa Search best practices (parameters and search types)](https://exa.ai/docs/reference/search-best-practices)
- [Exa Contents API guide](https://exa.ai/docs/reference/contents-api-guide)
- [Exa MCP setup docs](https://exa.ai/docs/reference/exa-mcp)
- [exa-labs/exa-mcp-server (GitHub)](https://github.com/exa-labs/exa-mcp-server)
- [How we're building the next generation of search (Exa Blog, 2025-03-11)](https://exa.ai/blog/how-to-build-nextgen-search)
- [How we built a web-scale vector database (Exa Blog, 2024-12-17)](https://exa.ai/blog/building-web-scale-vector-db)
- [A Perfect Search Engine (Exa Blog, 2025-01-07)](https://exa.ai/blog/perfect-search)
- [Introducing Exa 2.0 (Exa Blog, 2025-10-10)](https://exa.ai/blog/exa-api-2-0)
- [Exa raises $250M Series C (Exa Blog, 2026-05-20)](https://exa.ai/blog/announcing-series-c)
- [Exa is now powering search in Firefox (Exa Blog, 2026-08-17)](https://exa.ai/blog/exa-firefox)
- [Firefox and Exa: Building AI search around people, not platforms (Mozilla Blog, 2026-08-18)](https://blog.mozilla.org/en/firefox/firefox-exa-partnership/)
- Related on this site: [Search MCP tools for AI agents](/posts/ai/2026-05-07-ai-search-mcp-tools-en), [Tavily and Exa have no on-prem option](/posts/ai/2026-08-21-self-hosted-search-stack-en), [AI scraping tool landscape](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en), [llms.txt](/posts/tech/2026-08-21-llms-txt-en)
