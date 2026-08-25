---
title: "Web Extraction Quality Benchmark: Crawl4AI, Firecrawl, Jina Reader, and Readability"
date: 2026-08-22
category: ai
type: deep-dive
tags: [web-scraping, web-extraction, crawl4ai, firecrawl, benchmark]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 10
tldr: "Extraction tools cannot be compared by HTTP 200s. The same 20 URLs must be scored for body text, headings, tables, code, links, metadata, noise, latency, and cost. This draft publishes the corpus, adapter contract, and gates, but no winner without a same-version raw run across all four paths."
description: "A reproducible web extraction benchmark for Crawl4AI, Firecrawl, Jina Reader, and Mozilla Readability, using 20 fixed URLs and separate quality, structure, latency, and cost metrics."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-web-extraction-quality-benchmark)

> **Unpublished benchmark specification.** The 20 URLs, output contract, scoring rubric, and failure labels are fixed. However, the environment on 2026-08-22 has no `FIRECRAWL_API_KEY`, and the four adapters have not completed one version-locked raw run. No raw artifacts means no ranking, so this remains `draft: true`.

After search finds a URL, the next step is not to send raw HTML to an LLM. It is to extract the body reliably. [Crawl4AI](https://docs.crawl4ai.com/core/markdown-generation/), [Firecrawl](https://docs.firecrawl.dev/features/scrape), [Jina Reader](https://jina.ai/reader/), and [Mozilla Readability](https://github.com/mozilla/readability) all produce cleaner content, but they differ in rendering, body detection, Markdown structure, metadata, and cost.

This article does not repeat the [34-tool crawler landscape](/posts/ai/2026-07-25-ai-web-scraping-tools-landscape-en), and it does not compare vendor demo pages. It asks one question: **given exactly the same URLs, which path retains the information needed to answer a question, and which merely produces clean-looking text?**

## These are four different kinds of pipeline

| Pipeline | Page acquisition | Main output | Benchmark configuration |
|---|---|---|---|
| Crawl4AI | Local browser crawler | Raw/fit Markdown, HTML, links | `cleaned_html` + default Markdown, no LLM filter |
| Firecrawl | Managed scrape API | Markdown, HTML, metadata | `/scrape`, formats=`markdown` |
| Jina Reader | Managed URL-to-text service | LLM-friendly Markdown | Keyless Reader endpoint |
| Readability | Local DOM heuristic | Article HTML, text, title, byline | Playwright final DOM passed to Readability |

Readability does not fetch pages or convert HTML to Markdown. The benchmark uses one Playwright fetcher to obtain the final DOM before Readability selects the article body; otherwise, it would compare HTTP clients rather than extraction. Mozilla also warns that Readability does not sanitize output, so extracted HTML still needs a sanitizer before rendering.

Crawl4AI separates `raw_markdown` and `fit_markdown`; fit output passes through a content filter. To avoid treating query-specific pruning as baseline extraction, round one compares default cleaned Markdown. Fit Markdown becomes a separate configuration in round two.

## Fix 20 URLs before seeing results

The corpus uses public, anonymously accessible pages whose important structures can be labeled manually. Every case stores `retrieved_at`, final URL, HTTP status, content hash, and a human-authored ground-truth manifest.

| ID | Type | URL | Structures that must survive |
|---|---|---|---|
| docs-01 | API docs | `https://playwright.dev/docs/auth` | headings, code, warning |
| docs-02 | Python docs | `https://docs.python.org/3/library/pathlib.html` | signatures, tables, code |
| docs-03 | Rust Book | `https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html` | prose, code, callouts |
| docs-04 | Crawl4AI docs | `https://docs.crawl4ai.com/core/markdown-generation/` | nested headings, code, links |
| docs-05 | Firecrawl docs | `https://docs.firecrawl.dev/features/scrape` | tabs, code, response fields |
| repo-01 | GitHub README | `https://github.com/mozilla/readability` | badges, headings, code, links |
| repo-02 | GitHub README | `https://github.com/microsoft/playwright-mcp` | option table, code, warnings |
| table-01 | HTML table | `https://www.w3.org/TR/WCAG22/` | conformance tables, anchors |
| table-02 | Compatibility docs | `https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie` | syntax, compatibility links |
| long-01 | Security guide | `https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html` | deep hierarchy, code, lists |
| long-02 | Standards text | `https://www.rfc-editor.org/rfc/rfc9110.html` | numbered sections, references |
| spa-01 | React docs | `https://react.dev/learn/managing-state` | client navigation, code |
| spa-02 | Material docs | `https://m3.material.io/styles/color/system/overview` | rendered body, image captions |
| article-01 | Engineering blog | `https://blog.cloudflare.com/workers-ai/` | title, author/date, body, links |
| article-02 | Product page | `https://www.mozilla.org/en-US/firefox/reader-view/` | body, images, CTA noise |
| zh-01 | Taiwan government | `https://moda.gov.tw/` | Traditional Chinese headings, nav/body split |
| zh-02 | Taiwan law | `https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=I0050021` | article numbers, paragraphs, metadata |
| ja-01 | Japan government | `https://www.digital.go.jp/policies` | Japanese headings, cards, links |
| pdf-01 | arXiv abstract | `https://arxiv.org/abs/2311.09735` | title, authors, abstract, DOI links |
| edge-01 | robots policy | `https://www.google.com/robots.txt` | plain text must not become empty |

The list is versioned, not immortal. If a page disappears or is redesigned, retain the old hash and publish a new corpus version. Never silently replace a URL and join the two runs into one trend.

## Every adapter returns one contract

Raw responses are archived in full, then normalized into one JSON shape:

```json
{
  "case_id": "docs-01",
  "adapter": "crawl4ai-default",
  "adapter_version": "0.9.x",
  "requested_url": "https://playwright.dev/docs/auth",
  "final_url": "https://playwright.dev/docs/auth",
  "retrieved_at": "2026-08-22T00:00:00Z",
  "status": "success",
  "latency_ms": null,
  "cost_usd": null,
  "title": null,
  "author": null,
  "published_at": null,
  "markdown": null,
  "links": [],
  "raw_artifact": "raw/docs-01/crawl4ai-default.json",
  "error": null
}
```

`null` and `0` are not interchangeable. Missing billing data is `null`, not zero cost. A missing author is `null`, not an empty string. Timeout, blocked, fetch error, parse empty, and partial content stay separate; otherwise, a login page can inflate the success rate.

## Score required evidence before visual cleanliness

Ground truth stores `required_spans`, `required_structures`, and `known_noise`, not one complete canonical rendering. Reviewers are blinded to the adapter and score six dimensions separately:

1. **Body completeness:** recall of required spans.
2. **Noise ratio:** navigation, cookie banners, recommendations, and footer content.
3. **Structure retention:** headings, tables, code blocks, lists, and links remain recognizable.
4. **Metadata:** title, author, publication time, and canonical URL are correct.
5. **Traceability:** links retain their original targets and content retains section anchors or locators.
6. **Efficiency:** p50/p95 latency, request count, paid cost, and output bytes.

Do not collapse these into one score. Missing half the body should not cancel against low latency. Regression gates should be separate: required-span recall cannot fall, code retention cannot fall, and p95 latency cannot exceed a pre-agreed tolerance.

## Four ways to invalidate the benchmark

### Calling fetch success extraction success

HTTP 200 may contain a consent page, login page, bot challenge, or app shell. Verify title, required spans, and minimum body content before marking success.

### Fetching each pipeline at a different time

Home pages, docs, and SPAs change. Run all four adapters for each case in one short window and retain a source snapshot.

### Using character count as completeness

Long output may be navigation and footer noise. Short output may be precise. Score required spans and noise separately.

### Trusting extraction output

HTML, Markdown, and metadata can all contain prompt injection or malicious markup. Mozilla explicitly says Readability does not sanitize. Markdown from a managed service is not automatically safe either. Sanitize, retain provenance, and separate content from tool instructions.

## The only current conclusion is the test design

Official capabilities can be described; winners cannot. Crawl4AI provides a local browser and configurable Markdown/filter pipeline. Firecrawl provides managed scrape formats. Jina Reader offers a low-friction URL-to-text endpoint. Readability is the lightest local article heuristic, while fetch, render, Markdown conversion, and sanitization remain the operator's responsibility.

This article will switch to `draft: false` only after all four adapters finish the same corpus version, raw artifacts are archived, and blinded annotations are complete. Anything less is a comparison of product descriptions, not an experiment.

## References

- [Crawl4AI — Markdown Generation](https://docs.crawl4ai.com/core/markdown-generation/)
- [Firecrawl — Scrape](https://docs.firecrawl.dev/features/scrape)
- [Jina AI — Reader API](https://jina.ai/reader/)
- [Mozilla Readability — README and API](https://github.com/mozilla/readability)
- [Playwright — Browser automation documentation](https://playwright.dev/docs/intro)
