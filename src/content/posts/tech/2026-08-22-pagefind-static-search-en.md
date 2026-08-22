---
title: "Pagefind Explained: Full-Text Search for Astro Without a Search Backend"
date: 2026-08-22
category: tech
type: deep-dive
tags: [pagefind, astro, search, static-site, blog]
lang: en
tldr: "Pagefind scans static HTML after an Astro build and ships its index with a WebAssembly search runtime; the browser fetches only the index chunks required by a query, so no search server is needed."
description: "A data-flow tour of Pagefind: build-time indexing, browser-side search, filters, multilingual indexes, Astro integration, and the limits of backend-free full-text search."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-22-pagefind-static-search)

[Pagefind](https://pagefind.app/docs/) is a full-text search tool for static websites. Instead of calling a search API when someone submits a query, it scans the HTML produced after a site build and generates an index plus JavaScript and WebAssembly assets that deploy with the site. Search runs in the browser, so production does not need a separate Elasticsearch or Meilisearch service, or even a database search endpoint.

“Search runs in the browser” does not mean downloading the entire site on the first page load. Pagefind splits its index into chunks and fetches relevant pieces after a visitor starts searching. Titles, URLs, and excerpts for individual results can be loaded lazily as well. Its central tradeoff is unusually clear: move index updates into deployment and query execution onto the visitor's device, eliminating an always-on search service.

That model fits Astro, Hugo, Eleventy, and other content sites that produce static HTML. Pagefind is neither a hosted search service nor a semantic search or RAG system. It solves keyword full-text search with an index that can be rebuilt and deployed alongside the site. The rest of this article follows that data flow: build-time indexing → browser search → filtering/localization → limits.

## Build-time indexing: HTML comes first

Pagefind normally runs after the static site generator:

```text
Markdown / CMS
      │
      ▼
 Astro build
      │  dist/**/*.html
      ▼
   Pagefind
      │  dist/pagefind/*
      ▼
 Static host / CDN
```

The minimum command is one line:

```bash
npx pagefind --site dist
```

`--site` points at the completed build directory. Pagefind finds `**/*.html` by default, parses those pages, and writes its search bundle into a `pagefind/` subdirectory. The order matters: a development server that only exposes source routes does not yet contain the final HTML Pagefind needs. The official getting-started guide consequently requires Pagefind to run after every site build and before deployment.

In Astro, it can be attached to `astro:build:done`:

```js
{
  name: 'pagefind',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const { execSync } = await import('child_process');
      execSync(`npx pagefind --site ${dir.pathname}`, { stdio: 'inherit' });
    },
  },
}
```

This is the current build configuration for this site. Pagefind is generated alongside the Astro output, but its scope deserves precision: the site's 404 page loads the prebuilt Pagefind UI, while the main `/search` page currently uses a custom D1 keyword and hybrid-retrieval API. This is a real integration example, not an invented claim that every search path here runs only on Pagefind.

### Controlling what enters the index

According to the [indexing documentation](https://pagefind.app/docs/indexing/), Pagefind indexes from `<body>` by default and automatically skips elements such as `nav`, `footer`, `script`, and `form`. A content site should still mark its primary article region with `data-pagefind-body` so repeated navigation, sidebars, and footers do not dilute results:

```html
<main data-pagefind-body>
  <h1>Pagefind Explained</h1>
  <article>...</article>
</main>
```

Once `data-pagefind-body` appears anywhere on a site, pages without that attribute are excluded from the index. It is both useful and easy to misuse as a site-wide switch: adding it to one layout does not leave every other page indexed. `data-pagefind-ignore` excludes local regions. Documentation sites that need searches for punctuation such as `<head>` or `$` can preserve selected characters with `include_characters`.

## Browser search: fetch by query, not as one large bundle

Pagefind ships a ready-made UI and a JavaScript API for custom interfaces. The basic custom flow looks like this:

```js
const pagefind = await import('/pagefind/pagefind.js');
const search = await pagefind.search('astro');
const firstResult = await search.results[0].data();

console.log(firstResult.url, firstResult.meta.title);
```

`search()` first returns result identifiers and a lazy `data()` function. This API exposes Pagefind's bandwidth strategy: search indexes are alphabetically chunked, and full result data does not have to arrive at once. The official API documentation recommends calling `preload()` as a visitor types, downloading likely chunks before a debounced search executes. Repeated preload calls do not create duplicate network requests.

This differs from Fuse.js-style designs that send a complete JSON collection to the browser before matching in memory. It also differs from Meilisearch or Algolia, where the browser submits queries to a remote service. Pagefind still serves index files from a CDN, but the query itself does not need an application server. That is often the lowest-maintenance point for public documentation and blogs whose reads greatly outnumber writes.

The reverse is equally important: every content change requires a rebuild and re-index. If data changes every minute, results depend on the signed-in user, or queries must reach a private database in real time, this data flow is a poor fit.

## Filtering and localization: metadata becomes part of the static index

Full-text search is more than a text box. The [filtering documentation](https://pagefind.app/docs/filtering/) shows how Pagefind collects categories, authors, and tags from `data-pagefind-filter` attributes and queries them through the same browser API:

```html
<meta data-pagefind-filter="category[content]" content="tech">
<span data-pagefind-filter="tag">astro</span>
```

```js
const search = await pagefind.search('search', {
  filters: {
    category: 'tech',
    tag: ['astro', 'blog'],
  },
});
```

A page may have multiple values for one filter. `pagefind.filters()` also reports how many results are available for each combination. To build a faceted sidebar, the first practical step is not another API: emit existing frontmatter as these HTML attributes in the article layout, build the site, and inspect the values in Pagefind's playground.

The [multilingual documentation](https://pagefind.app/docs/multilingual/) describes how indexing follows the HTML. Pagefind reads `<html lang>`, builds an independent index for each detected language, and loads the matching index from the current page language when the browser initializes. Chinese, Japanese, and Korean segmentation is available in the extended release, which `npx pagefind` uses by default. Chinese text without spaces can be segmented, but Pagefind currently does not stem these specialized languages. It can therefore tokenize continuous Chinese text without automatically collapsing word forms to a shared root as it does for some other languages.

For a bilingual Astro site, the concrete requirement is simple: verify that each layout emits `zh-TW` or `en` on `<html>` rather than relying only on URL prefixes. A client-side language switch that does not reload the page needs `destroy()` followed by `init()` so Pagefind detects the new language.

## Limits: what backend-free search removes—and gives up

Pagefind fits public sites whose searchable content is known at deployment. It removes search clusters, synchronization jobs, and production query APIs, while letting the index ship and roll back with the site version. Other tools are a better starting point in these cases:

- **Real-time updates:** inventory, chat, or rapidly changing records cannot wait for another build.
- **Permission-aware search:** index files are public static assets and must not contain content restricted to particular users.
- **Complex ranking and analytics:** hosted search and dedicated engines offer fuller operational dashboards, query analytics, synonym management, and deeply customized relevance.
- **Semantic intent:** Pagefind performs lexical retrieval. A query such as “the article about why an agent forgets” may not share words with the desired page; vector or hybrid retrieval can fill that gap.
- **Pure SSR data:** if content only exists at request time and the build directory lacks complete HTML, Pagefind has nothing to index.

There is also a content-quality limit: Pagefind faithfully indexes the HTML it receives. If every page contains the same navigation copy, cookie banner, or hidden text, results will faithfully get worse. Start an implementation with three actions: constrain `data-pagefind-body`, exclude repeated regions, and test ten queries that real readers would use. That is more useful than tuning ranking controls first.

## Overall

Pagefind does not shrink a server-side search engine. It makes search part of the static website: read HTML at build time, publish chunked indexes at deployment, and let the browser fetch only what a query needs. For Astro documentation sites, portfolios, and blogs, that flow is portable, straightforward, and nearly absent from production operations.

Its limitations come from the same design. Index freshness is coupled to deployment, public assets cannot hold permissioned data, and keyword search does not become semantic understanding by itself. If content is public, page-shaped, and updated through deployment, Pagefind is often more sensible than operating a search service. When any of those assumptions fails, map the requirement first and then consider Meilisearch, Algolia, database full-text search, or hybrid retrieval.

## References

- [Pagefind — Getting Started](https://pagefind.app/docs/)
- [Pagefind — Configuring what content is indexed](https://pagefind.app/docs/indexing/)
- [Pagefind — Using the search API](https://pagefind.app/docs/api/)
- [Pagefind — Setting up filters](https://pagefind.app/docs/filtering/)
- [Pagefind — Multilingual search](https://pagefind.app/docs/multilingual/)
- [Pagefind — CLI configuration options](https://pagefind.app/docs/config-options/)
- [Pagefind GitHub repository](https://github.com/Pagefind/pagefind)
