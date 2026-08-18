---
title: "Is Your JSON-LD Invisible to AI Search Engines? A Pipeline Breakdown and AEO/GEO Strategy"
date: 2026-04-18
type: guide
category: marketing
tags: [aeo, geo, ai-seo, web-search, content-strategy, seo, json-ld, schema, structured-data, llms-txt, claude-code, perplexity]
lang: en
tldr: "Different AI engines process web pages in vastly different ways. Some only read the body; others rely on pre-built indexes. JSON-LD and schema markup are not universally effective — body content quality and structure are the only cross-platform foundations that hold."
description: "A breakdown of how ChatGPT, Perplexity, Gemini, and Claude each process web content, an analysis of the real impact of JSON-LD, schema, and meta tags, and actionable AEO/GEO strategies for 2026."
draft: false
series:
  name: "AEO, GEO, and AI Search"
  order: 4
---

🌏 [中文版](/posts/marketing/2026-04-18-ai-search-engine-aeo-geo-strategy)

People working on AEO/GEO often treat "AI search optimization" as an extension of traditional SEO: add JSON-LD, throw in FAQ schema, write a solid meta description, then wait for AI systems to cite you. But if you've looked at how AI search engines actually process web pages under the hood, you'll find the reality is far more complicated — some engines simply cannot read anything you put in `<head>`.

This post breaks down the content processing pipelines of the four major AI search engines, so you can see exactly where your SEO assets pay off and where they're completely wasted.

> **Update, August 2026**: the Claude pipeline details below come from third-party analysis of a March 2026 source code leak. Anthropic never confirmed them, and the implementation may since have changed — treat them as an observation at one point in time, not a specification. This refresh adds two substantive corrections: Anthropic now runs a dedicated search-index crawler, `Claude-SearchBot` (a separate path from Claude Code's WebFetch); and `Google-Extended` does not affect Google Search or AI Overviews. Details in the relevant sections.

## Claude: On the WebFetch Path, Body Only — Head Doesn't Exist

First, something the original post didn't make clear: **"Claude reading a web page" is not a single path.**

- **Claude Code / WebFetch**: a user or agent supplies a URL and it's fetched and read on the spot. That's the path dissected below.
- **Claude-SearchBot**: Anthropic's search-index crawler, which crawls and indexes ahead of time to serve Claude's web search; there are also `Claude-User` (user-triggered) and `ClaudeBot` (training) ([official documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler)).

In other words, "Claude can't see your structured data at all" holds only for the WebFetch path. Anthropic has not published Claude-SearchBot's parsing details, so whether *that* path reads `<head>` is currently **unverified**. Everything below concerns WebFetch.

Claude Code's web access relies on two tools: WebSearch to find URLs and WebFetch to read content.

WebSearch runs server-side and returns a title, URL, and encrypted snippet. In the CLI flow, however, the snippet is rarely used. What actually determines what the AI reads is WebFetch.

The WebFetch pipeline:

```
URL → Upgrade HTTP to HTTPS
    → Check domain blocklist (via api.anthropic.com)
    → Axios fetches HTML locally
    → Turndown.js converts <body> to Markdown
    → Truncated to 100,000 characters
    → Passed to Claude Haiku for summarization
    → Returns summary (direct quotes capped at 125 chars for non-pre-approved domains)
```

Turndown.js runs with **zero configuration**, with the following default behaviors:

- `<script>` and `<style>` are stripped → **JSON-LD inside `<script type="application/ld+json">` simply disappears**
- `<meta>` and `<link>` live in `<head>` → **meta descriptions and OG tags don't exist**
- Images are stripped by default → **alt text is invisible**
- Text inside `<nav>` is **not** removed — it gets fed to Haiku alongside body content, competing for attention

For 119 pre-approved documentation sites (mainly official docs for technical frameworks), if the server returns `Content-Type: text/markdown` and the content is under 100K characters, Haiku summarization is skipped and content is used directly. Regular websites are not on this list.

Also note: Axios is an HTTP client — it does not execute JavaScript. SPAs and client-side-rendered pages may return only an empty shell.

## ChatGPT: Passage-Level Retrieval — Low Rankings Can Still Win

The original post said ChatGPT's search is "built on Bing's live index". That's no longer accurate in 2026 — but "fully self-built" would be equally wrong, because **the available accounts contradict each other and OpenAI has not published its architecture**:

- What's certain: OpenAI runs its own search crawler, `OAI-SearchBot`, and its [official documentation](https://platform.openai.com/docs/bots) states that "sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers" — which means it has retrieval data of its own.
- What isn't: industry analyses disagree widely on how much still comes from Bing. Some argue ChatGPT's citation distribution has visibly diverged from Bing's results; others say the Bing retrieval partnership persists. There is currently **no reliable first-party source to settle it**.

The practical implication for site owners is unambiguous: **you must allow `OAI-SearchBot`**. Allowing only `GPTBot` (training) will not get you into ChatGPT's search answers.

Its processing differs significantly from traditional search. The pipeline roughly works as follows:

1. **Server-side fetching** with query rewriting (queries are automatically rewritten to broaden matches)
2. Clean HTML → **passage-level chunking** → vector embeddings
3. **Hybrid retrieval** (semantic search + keyword matching)
4. **Cross-encoder reranker** for fine-grained ranking
5. **LLM-as-a-judge**: the model ultimately decides which passages to cite

The key here is **passage-level granularity**. A page ranked fifth overall can outperform a first-ranked page if one of its passages precisely answers the question at hand.

`<head>` metadata primarily influences Bing's indexing side and doesn't necessarily get passed to the generative model. However, since fetching is server-side, JavaScript-rendered content has a chance of being picked up.

## Perplexity: Self-Built Index — Structured Data Actually Works

Perplexity is the only AI search engine with a fully self-built search index.

- Its own crawler, **PerplexityBot**, pre-crawls and indexes content, tracking over 200 billion unique URLs
- Uses an **AI-driven dynamic parsing module** that automatically generates parsing logic for different site structures
- Multi-stage ranking pipeline: hybrid retrieval → pre-filtering → cross-encoder reranker
- Highest citation density of all platforms, with per-sentence source attribution
- Powered by **Vespa AI** for large-scale RAG

Because PerplexityBot crawls the full HTML, **schema, JSON-LD, and structured data are genuinely effective here**. If you want Perplexity citations, your traditional SEO structured data work is not wasted.

## Gemini: Built on Google's Index

Gemini's generative answers are built directly on top of Google Search's index and Knowledge Graph.

- The model auto-decides whether search is needed → generates a query → retrieves search results
- If a page isn't in Google's index, Gemini can't see it
- The scope of `Google-Extended` is widely misunderstood: it governs **Gemini Apps and Vertex AI generative APIs**, and [Google states explicitly that it does not affect Google Search](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended). Blocking `Google-Extended` will **not** remove you from AI Overviews or AI Mode — those run through Googlebot, and opting out means opting out of Search itself
- Returns `groundingMetadata` containing the search query, web results, and citation links

Since Google's indexing crawler reads the full HTML (including `<head>`), **traditional SEO structured data remains fully effective in the Gemini path**.

## Pipeline Comparison at a Glance

| | Claude (WebFetch) | ChatGPT | Perplexity | Gemini |
|---|---|---|---|---|
| Fetching method | Local Axios | Server-side (`OAI-SearchBot`) | Pre-crawled index (`PerplexityBot`) | Existing Google index (Googlebot) |
| Reads `<head>`? | ❌ | ⚠️ Indirect | ✅ | ✅ |
| JSON-LD/schema effective? | ❌ | ⚠️ Limited | ✅ | ⚠️ Read, but Google says it isn't required |
| Supports JS rendering? | ❌ | ✅ | ✅ | ✅ |
| Citation density | Low | Medium | High | Medium |

The Claude column covers the WebFetch path only. Anthropic separately runs `Claude-SearchBot` for its search index; its parsing details are unpublished, so that path's values are currently **unverified**.

## Practical Strategies

With the pipeline differences in mind, here are directions you can act on immediately:

**Body structure matters more than metadata.** This is the only strategy that works across all platforms. Use clear heading hierarchy (H2/H3), paragraphs, and lists to organize your body content. After Turndown.js conversion, pages with cleaner structure retain more quotable passages; ChatGPT's passage-level retrieval also depends on clean segmentation.

**Lead each paragraph with its conclusion.** Claude's Haiku summarizer allows only 125 characters of direct quotes for non-pre-approved domains. Make the first sentence of every paragraph a complete, standalone claim — not a windup sentence. This helps across all AI engines since they all do some form of passage summarization.

**Do schema and structured data — but don't overrate them.** They are still read on the Perplexity and Google-index paths. But Google's May 2026 [official guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) lists "overfocusing on structured data" among the things you don't need to do: structured data is **not required** for generative AI search and there's no special schema — its value is rich result eligibility. Add that Claude's WebFetch can't see it and ChatGPT's exposure is indirect, and the fair position is "SEO hygiene", not "AEO leverage".

Incidentally, the FAQ schema mentioned at the top of this post no longer produces a rich result (fully retired 2026-05-07), and `HowTo` went earlier. Don't spend time backfilling either.

**Ensure content doesn't depend on client-side rendering.** Claude's Axios client, like most AI crawlers, does not execute JavaScript. If your page's core content is rendered in the browser by React or Vue, most AI engines will receive an empty shell or skeleton. SSR or static generation is a baseline requirement.

**Minimize `<nav>` text noise.** Claude's Turndown.js does not strip `<nav>`, so navigation text gets fed to the summarization model alongside your body content, competing for its attention. Use concise nav labels and avoid keyword-stuffing your navigation.

**Allocate resources by target engine.** If your traffic comes primarily from the Google ecosystem (Search + Gemini), structured data remains a high priority. If your goal is to be cited by users of AI coding tools (Claude Code, Cursor, etc.), focus on body content quality and static HTML.

**Check search-type and training-type user agents separately in robots.txt.** This is where a single wrong move costs you everything: `OAI-SearchBot` (OpenAI search), `Claude-SearchBot` (Anthropic search), and `PerplexityBot` (Perplexity's index) are the three crawlers that decide whether you appear in answers at all, and they are a different decision from the training crawlers `GPTBot` and `ClaudeBot`. Settle this before you touch schema.

## The Bottom Line

AEO/GEO in 2026 is not a one-size-fits-all game. The pipeline differences between AI search engines are large enough that the same page can look completely different on different platforms — the gap between "full crawl with indexed structured data" and "local Axios reading body only" can't be bridged by tweaks.

But one thing remains constant across all platforms: **write information-dense body content, present it with clear structure, and ensure every paragraph still makes sense after being truncated and paraphrased.** Technical additions (schema, llms.txt, JSON-LD) are multipliers, not foundations.

## References

- [How Claude Code Eats the Web - Giuseppe Gurgone](https://giuseppegurgone.com/claude-webfetch)
- [Claude Code Leak: How WebSearch Sees Your Website - Wise Relations](https://wire.wise-relations.com/news/2026-04-01-claude-code-websearch-leak/)
- [Reverse Engineering Claude Code Web Tools - Liran Yoffe (Medium)](https://medium.com/@liranyoffe/reverse-engineering-claude-code-web-tools-1409249316c3)
- [Inside Claude Code's Web Tools: WebFetch vs WebSearch - Mikhail Shilkov](https://mikhail.io/2025/10/claude-code-web-tools/)
- [Anthropic leaked its own Claude source code - Axios](https://www.axios.com/2026/03/31/anthropic-leaked-source-code-ai)
- [The Claude Code Source Leak: 512,000 Lines, a Missing .npmignore - Layer5](https://layer5.io/blog/engineering/the-claude-code-source-leak-512000-lines-a-missing-npmignore-and-the-fastest-growing-repo-in-github-history/)
- [Claude Code's Entire Source Code Was Just Leaked via npm Source Maps - DEV Community](https://dev.to/gabrielanhaia/claude-codes-entire-source-code-was-just-leaked-via-npm-source-maps-heres-whats-inside-cjo)
- [Architecting and Evaluating an AI-First Search API - Perplexity Research](https://research.perplexity.ai/articles/architecting-and-evaluating-an-ai-first-search-api)
- [How Perplexity Built an AI Google - ByteByteGo](https://blog.bytebytego.com/p/how-perplexity-built-an-ai-google)
- [How different AI engines generate and cite answers - Search Engine Land](https://searchengineland.com/how-different-ai-engines-generate-and-cite-answers-463234)
- [Perplexity vs ChatGPT vs Gemini: How AI Engines Cite Content - WhiteHat SEO](https://whitehat-seo.co.uk/blog/ai-engines-comparison-citations)
- [Grounding with Google Search - Gemini API Docs](https://ai.google.dev/gemini-api/docs/google-search)
- [Anthropic crawler documentation](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) — how ClaudeBot, Claude-User, and Claude-SearchBot divide up
- [Overview of OpenAI Crawlers](https://platform.openai.com/docs/bots) — OAI-SearchBot decides whether you appear in ChatGPT search answers
- [Perplexity Crawlers](https://docs.perplexity.ai/docs/resources/perplexity-crawlers)
- [Google crawlers and Google-Extended](https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers#google-extended) — Google-Extended does not affect Google Search
- [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — Google's position that structured data isn't required for generative AI search
- [Google Search documentation updates](https://developers.google.com/search/updates) — retirement dates for the FAQ and HowTo rich results
