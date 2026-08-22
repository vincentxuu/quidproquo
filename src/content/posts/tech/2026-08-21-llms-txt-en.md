---
title: "llms.txt: The Copy of Your Docs Written for Machines"
date: 2026-08-21
category: tech
type: deep-dive
tags: [llms-txt, ai-agent, documentation, seo, developer-tools]
lang: en
tldr: "llms.txt is a convention proposed by Jeremy Howard on 2024-09-03 (the spec is now at v2): a Markdown index at your site root written for LLMs. Hand-tested across six frontend docs sites: TanStack, shadcn, Zustand, AI SDK, and Next.js all ship it; React Router is the lone 404. The companion llms-full.txt (full-text version) is live at Anthropic, Cloudflare, and others. This post covers the spec, who uses it, and why it has started to influence library selection."
description: "An introduction to the llms.txt spec: origin and format, the llms-full.txt companion convention, adoption across major developer docs sites (with a six-site hands-on test), what it means for AI search and coding-agent workflows, and how to read it as a library-selection signal."
series:
  name: "Technology Choices in the AI Era"
  order: 7
additionalSeries:
  - name: "AEO, GEO, and AI Search"
    order: 6
draft: false
---

🌏 [中文版](/posts/tech/2026-08-21-llms-txt)

One criterion keeps recurring in this series: pick libraries whose documentation machines can read. This post covers the vehicle for that criterion. llms.txt resembles the file its name winks at — robots.txt, a plain-text convention at the site root — but points the opposite way: robots.txt tells crawlers what **not** to look at; llms.txt tells language models what they **should** read, and where.

## Origin and spec

llms.txt was proposed by Jeremy Howard of fast.ai on September 3, 2024. The official one-liner: "A proposal to standardise on using an /llms.txt file to provide information to help agents use a website." The spec is actively maintained — as of August 2026 it stands at v2 — and its own opening notes how the times changed: when first written in 2024, "agents routinely using websites" was largely a prediction; today it is routine (coding agents fetching a library's docs to get an API call right, search-equipped assistants reading pages to answer product questions).

The format is deliberately simple: structured Markdown with an H1 site name, a blockquote one-line summary, then H2 sections of link lists to the pages that matter, each with a short description. It addresses three practical problems LLMs have with websites: the whole site doesn't fit in a context window, HTML is polluted with navigation/ads/JS noise, and the model can't tell which pages are authoritative. llms.txt is the site answering, "if the model can only read ten pages, these are the ten."

In practice a companion convention has grown alongside it: **llms-full.txt** — not an index but the entire documentation concatenated into one large Markdown file, suited to stuffing into a big context window or serving as RAG corpus. Anthropic (docs.anthropic.com), Cloudflare (developers.cloudflare.com), the AI SDK, and Zod all serve both files (each hand-verified reachable, August 2026).

## Who ships it: a six-site test

While writing the [selection overview](/posts/tech/2026-08-19-react-stack-ai-era-en), I tested six frontend docs sites (August 2026, HTTP status):

| Docs site | /llms.txt |
|---|---|
| tanstack.com | ✅ 200 |
| ui.shadcn.com | ✅ 200 |
| zustand.docs.pmnd.rs | ✅ 200 |
| ai-sdk.dev | ✅ 200 |
| nextjs.org | ✅ 200 |
| reactrouter.com | ❌ 404 |

The difference is concrete. Say your coding agent needs to write file-based routing with TanStack Router — a library under-represented in training data (a weakness [the series' third post](/posts/tech/2026-08-21-tanstack-router-type-safety-en) covers), so bare-handed output drifts into React Router idioms. With llms.txt the workflow is: fetch the index → locate the file-based-routing page → fetch it → write against the current API. Without it, the agent scrapes HTML and hopes, or writes from stale memory. **llms.txt is a niche library's main weapon against the training-data deficit** — which also explains the adoption pattern: the most eager adopters are young ecosystems like TanStack and the AI SDK, while React Router, with the largest installed base, hasn't moved. When the corpus already knows you, the pain is smaller.

## The honest part: disputes and limits

llms.txt is not uncontroversial; two things are worth remembering. **First, it is not a standard backed by the search giants**: Google's John Mueller publicly compared it to the long-abandoned keywords meta tag — self-declared signals can't be used for ranking — and noted that no major AI service has said it uses the file, with server logs showing they don't even check for it (as reported by Search Engine Journal). Mainstream AI search products are opaque about crawling; you cannot confirm whether ChatGPT search or Perplexity reads yours. Its most solid consumers today are not AI search engines but **coding agents and docs tooling** — workflows where a developer explicitly feeds llms.txt into context. Second, it carries a maintenance cost: an index that drifts from the docs turns from help into misdirection — the same "content rots" problem this site keeps re-verifying, except this time it's the machine-facing copy that rots.

So the sane expectation: treat it as a cheap investment in (and signal of) agent-friendliness, not SEO-style ranking magic.

## What it means for this blog

The natural question at this point: should content sites follow? This site's AEO/GEO series covered the KDD 2024 GEO research — AI search preferentially cites content with concrete numbers and inline-attributed sources. llms.txt is another lever on the same goal: telling models directly which articles are the authoritative ones. For docs sites it's near table stakes; for content sites it's a cheap, sensible add — one Markdown index listing the articles most worth citing.

## Overall

llms.txt bets on a premise that is coming true: **the readership of websites has permanently changed, and the machine share only grows**. Technically it is almost naive — one hand-written Markdown index — but it is positioned precisely: on the question of "what should the model read," it gives site owners their first formal say. For library authors it's a cheap must-do; for anyone choosing libraries it's an honest signal — a project that maintains llms.txt probably also cares about the agent-era developer experience; for content authors it's the cheapest tool in the GEO toolbox.

## References

- [The llms.txt spec (llmstxt.org)](https://llmstxt.org/)
- [TanStack llms.txt (example)](https://tanstack.com/llms.txt)
- [Anthropic llms-full.txt (example)](https://docs.anthropic.com/llms-full.txt)
- [GEO paper (KDD 2024, arXiv 2311.09735)](https://arxiv.org/abs/2311.09735)
- [Google Says LLMs.Txt Comparable To Keywords Meta Tag (Search Engine Journal)](https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804)
- On this site: [Choosing a React Stack in the AI Era](/posts/tech/2026-08-19-react-stack-ai-era-en), [AEO/GEO Strategy for the AI Search Era](/posts/marketing/2026-04-18-ai-search-engine-aeo-geo-strategy-en)
