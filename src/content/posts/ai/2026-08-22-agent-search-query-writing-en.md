---
title: "Writing Search Queries for Agents: Keywords, Semantic Descriptions, Decomposition, and Rewriting"
date: 2026-08-22
category: ai
type: deep-dive
tags: [web-search, ai-agent, query-rewriting, semantic-search, academic-search]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 9
tldr: "An agent should not send the user's sentence unchanged to every search service. Classify the need as exact lookup, keyword, semantic, or fielded search; move source, date, language, and field constraints into native provider parameters; then rewrite according to zero-result, overbroad, stale, or source-mismatch symptoms."
description: "A reproducible method for agent search queries: classification, keyword and semantic formulations, decomposition, expansion, scholarly-API syntax, failure-driven rewriting, and 12 fixed cases."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-22-agent-search-query-writing)

Search quality does not come from the search engine alone. When an agent forwards “please look this up” unchanged, it treats conversational language as a retrieval language. That occasionally works, but it is not controllable.

A more reliable approach treats the query as compiled output. First determine whether the task seeks an identifier, a particular kind of page, an unnamed concept, or a set of scholarly records. Then translate that need into syntax the target provider understands. This article covers **query generation and correction before an individual search call**. It does not cover planning or stopping a multi-step research task. Multi-path retrieval inside a vector database is covered separately in [Multi-Query Expansion](/posts/ai/2026-03-12-multi-query-expansion-en).

## Decide which query you are writing

The same information need can compile into at least four targets:

| Type | Core of the query | Typical uses |
|---|---|---|
| Exact lookup | A string that must not be rewritten | Error messages, API symbols, DOIs, model numbers |
| Keyword search | A few high-discrimination terms | Official documentation, releases, specific file types |
| Semantic search | A description of the ideal result page | Content you can describe but cannot name |
| Fielded search | Database fields and Boolean conditions | Papers, authors, dates, journals, publication types |

Length does not determine the class. `CVE-2026-1234` is short, but every character matters. “An engineering article about observability for AI agents operated by small teams on Cloudflare Workers” is long but suited to semantic retrieval. “Published in the last five years, retrieval in the title, excluding reviews” should compile into fields and filters in a scholarly database.

Before searching, an agent should at least produce this intermediate representation:

```json
{
  "intent": "exact_lookup | keyword | semantic | fielded",
  "must_keep": ["product names, error strings, or identifiers kept verbatim"],
  "concepts": ["concepts that may be expanded with synonyms"],
  "source_preference": ["official", "primary"],
  "filters": {
    "domains": [],
    "published_after": null,
    "language": null,
    "document_type": null
  },
  "queries": []
}
```

Separating `must_keep` from `concepts` matters. A model may expand “error handling” into `exception handling`, but it should not replace `CrawlerRunConfig` with a class name it guessed.

## Keyword queries: preserve discrimination, then remove words

A keyword query is not merely a question shortened to three nouns. It retains the lexical anchors that exclude the wrong pages.

Apply four operations in order:

1. Preserve error messages, symbols, product names, versions, and identifiers verbatim.
2. Remove conversational framing such as “please find” or “what is the latest.”
3. Add one term that identifies the page type, such as `release notes`, `API reference`, or `security advisory`.
4. Put source, time, language, and file-type restrictions in native parameters when the provider offers them.

Google's official documentation confirms that `site:` restricts a domain or URL prefix and `filetype:` restricts a file type. These operators are not a universal standard. The [SearXNG Search API](https://docs.searxng.org/dev/search_api.html) passes queries to external search services and explicitly warns that syntax understood by one upstream may not be honored by another. With SearXNG, prefer API parameters such as `engines`, `language`, and `time_range`. If you depend on an upstream operator, pin the engine and record it.

```json
{
  "q": "\"CrawlerRunConfig\" \"wait_for\"",
  "engines": "google",
  "language": "en",
  "format": "json"
}
```

More quotation marks do not automatically mean more precision. Exact strings are appropriate for errors and symbols. Quoting every ordinary concept can block synonyms, inflections, and alternative word orders. Lock one genuinely immutable anchor first and leave the remaining concepts available for recall.

## Semantic queries: describe the page you want

For semantic search, write how an ideal result would be introduced rather than supplying a bag of keywords. [Exa's Search Best Practices](https://exa.ai/docs/reference/search-best-practices) says that `query` supports long, semantically rich descriptions and uses `blog post about embeddings and vector search` as an example.

A useful semantic query usually contains four parts:

```text
[page type] + [topic] + [required conditions] + [desired evidence]
```

Instead of:

```text
React Vue performance
```

write:

```text
An engineering article comparing React and Vue rendering performance,
with a reproducible benchmark setup, measured results, and stated limitations.
```

`engineering article`, `reproducible benchmark setup`, and `stated limitations` describe properties of the ideal page. If the API has `includeDomains`, date, or `category` parameters, continue to use them. Do not blend “official sites only, after 2026, in English” into natural language and expect identical interpretation on every call.

## Decomposition is not twelve paraphrases

One query should own one verifiable information need. This question should be decomposed:

```text
Compare Tavily and Exa on pricing, data retention, search capability, and self-hosting.
```

A useful decomposition is:

```text
1. Tavily official pricing API credits
2. Exa official pricing API credits
3. Tavily official privacy data retention API queries
4. Exa official privacy zero data retention API queries
5. Tavily self-hosted official
6. Exa self-hosted official
```

The reason is not that more calls are inherently stronger. Different claims have different authoritative sources. Pricing belongs on pricing pages, retention belongs in privacy or security documentation, and self-hosting requires deployment documentation or a repository. When six needs are placed in one sentence, ranking must guess which one matters most.

Query expansion is a different operation. It preserves one information need while changing terms likely to appear in documents. `data retention` may get separate variants for `query storage` and `zero data retention`; the Taiwanese term `隨身碟` may get an English `USB flash drive` variant. Every variant should retain the same `claim_id`, so merged results do not masquerade as independent evidence.

A practical budget is: **begin with one precise query and add two variants only when there is a concrete sign of missed recall.** This is a cost guardrail, not a claim that three queries are universally optimal.

## Scholarly search: compile natural language into database grammar

Scholarly APIs do not share one query syntax. Applying Web-search habits to them often does not produce an error; it quietly searches the wrong fields.

- [PubMed Help](https://pubmed.ncbi.nlm.nih.gov/help/) explains that untagged terms go through Automatic Term Mapping, while tags such as `[tiab]`, `[mh]`, and `[dp]` change processing and Boolean operators must be uppercase. It also warns that a quoted phrase absent from the phrase index does not necessarily behave like exact match in a general Web engine.
- [OpenAlex Search](https://help.openalex.org/api/searching/) currently exposes `search`, `search.exact`, and `search.semantic`, with only one allowed per request. Boolean, phrase, proximity, and wildcard syntax have their own rules.
- The [Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/rest-api-filters/) separates text queries from exact filters. Publication dates belong in `from-pub-date` and `until-pub-date`, not merely as a year inside `query.bibliographic`.
- The [Semantic Scholar Academic Graph API](https://api.semanticscholar.org/api-docs/) distinguishes paper relevance search from bulk search. Bulk text queries match title and abstract with Boolean support, while filters and returned fields are separate parameters.

An agent should therefore not generate one “scholarly search string” and paste it everywhere. It should first represent concept groups, then let each adapter compile them:

```text
concept A: retrieval-augmented generation OR RAG
concept B: query rewriting OR query reformulation
date: 2023-01-01..
document type: research article
```

The same intermediate form must produce different output for PubMed, OpenAlex, and Semantic Scholar.

## Twelve fixed cases: a rerunnable specification, not a leaderboard

The table below is a query regression set. As of 2026-08-22, this site **has not stored cross-provider raw results for these twelve cases**. “Expected change” is therefore a direction to validate, not an observed ranking or success rate. A real run should retain the provider, full request, timestamp, first results, and human judgment before making any quality claim.

| ID | Need and original query | Rewrite or decomposition | Expected change (not yet measured) |
|---|---|---|---|
| Q01 | `Node fetch failed how to fix` | `"TypeError: fetch failed" undici Node.js` | Narrow results to the same failure family with the verbatim error |
| Q02 | `Crawl4AI wait for element` | `"CrawlerRunConfig" "wait_for" API reference` | Preserve the class and parameter and reduce generic crawling tutorials |
| Q03 | `latest Astro version` | `Astro stable release notes` plus an official-domain filter | Translate “latest” into a release page and a source constraint |
| Q04 | `Taiwan artificial intelligence policy PDF` | `人工智慧 政策` plus `site:gov.tw` and `filetype:pdf` | Restrict the domain and document type on engines that support the operators |
| Q05 | `React Vue performance` | `An engineering article comparing React and Vue rendering performance with a reproducible benchmark and limitations` | Shift from term co-occurrence toward an ideal-page description |
| Q06 | `small team agent observability` | `A postmortem or engineering guide about observability for production AI agents operated by a small team, including traces, cost, and failure diagnosis` | Seek concrete operating experience instead of terminology overviews |
| Q07 | `compare Tavily and Exa` | Split pricing, retention, search capability, and self-hosting into four claim groups, each restricted to official sources | Route every comparison claim to its corresponding primary documentation |
| Q08 | `2026 Astro security` | `Astro security advisory` plus `published_after=2026-01-01` and an official-domain filter | Move time and source constraints into structured filters |
| Q09 | `what is USB called in Taiwan` | Run `隨身碟 USB 台灣用語` and `"USB flash drive" Taiwan terminology` under one claim | Cover Chinese and English terminology without counting variants as independent evidence |
| Q10 | `RAG query rewrite medical systematic review last five years` | PubMed: `(("retrieval augmented generation"[tiab] OR RAG[tiab]) AND ("query rewriting"[tiab] OR "query reformulation"[tiab])) AND 2021:2026[dp]` | Constrain concepts to title/abstract and publication years |
| Q11 | `find related papers from this long research abstract` | OpenAlex: `search.semantic=<abstract>` with date conditions in filters | Route long input to semantic mode instead of reducing it to arbitrary keywords |
| Q12 | `find DOIs for 2024 query rewriting papers` | Crossref: `query.bibliographic=query rewriting`, `filter=from-pub-date:2024-01-01,until-pub-date:2024-12-31,type:journal-article`, and `select=DOI,title` | Separate text matching, date/type restrictions, and returned fields |

Q10–Q12 are syntax examples, not complete systematic-review strategies. A real review must also address controlled vocabulary, database coverage, deduplication, and human screening; those concerns belong in the later scholarly-search-pipeline article.

## Rewrite after failure: change one control at a time

When results are poor, do not merely ask an LLM to “rewrite this better.” Classify the symptom first.

| Symptom | Check first | Change only this on the next call |
|---|---|---|
| Zero results | Misspelled anchor, overly narrow quote or field | Remove one constraint or turn a phrase into two concepts |
| Too few results | Missing synonym, abbreviation, or language | Add an expansion query without overwriting the original |
| Too broad | Missing product, page type, or field | Add one discriminating anchor or native filter |
| Wrong sources | Source preference exists only in prose | Use a domain, category, or endpoint restriction |
| Stale results | “Latest” exists only as a word | Use a publication-date or crawl-date filter |
| Only secondary summaries | The task never explicitly requested primary sources | Split out a query for official docs, papers, laws, or original announcements |
| Duplicate pages from one site | One query contains multiple claims | Split claims, then canonicalize and deduplicate URLs |

Changing one control at a time preserves causality. A useful trace retains at least:

```json
{
  "case_id": "Q03",
  "claim_id": "astro-current-stable-version",
  "provider": "provider-name",
  "request": {},
  "rewrite_reason": "source-mismatch",
  "parent_query_id": "q-001",
  "searched_at": "ISO-8601 timestamp",
  "raw_result_path": "artifacts/search/q-002.json"
}
```

Without the raw response, do not retain only “version two was better.” Search indexes, rankings, and APIs change. A rerunnable query plus the response at the time is the artifact that can actually be debugged.

## A sufficient agent loop

```text
User need
  ↓
Extract must_keep, concepts, source, time, language, and document type
  ↓
Classify exact / keyword / semantic / fielded
  ↓
Compile provider query + native filters
  ↓
Inspect the first results: on-topic, primary, and fresh enough?
  ↓
Relax, narrow, expand, or decompose according to the symptom—one at a time
  ↓
Store request + raw results + judgment
```

Define the stopping condition at the query layer as well. Stop once a primary source directly supports the claim. If two consecutive synonym-only rewrites add no qualified source, do not continue indefinitely. Switch providers, query a known database, or report the evidence gap.

## Overall

The central skill in agent search-query writing is not asking an LLM for more keywords. It is **separating what cannot change, what may expand, what belongs in a filter, and what kind of page or record the task actually needs**.

Keyword queries depend on lexical anchors. Semantic queries describe ideal pages. Scholarly queries use the target database's fields and Boolean grammar. After failure, relax or tighten one condition at a time, retaining the parent query and raw results. The query then stops being a string that disappears inside a prompt and becomes a retrieval artifact that can be versioned, regression-tested, and audited.

The next article moves to “fetching correctly”: a fixed-URL comparison of how Crawl4AI, Firecrawl, Jina Reader, and Readability preserve body text, tables, code, and metadata.

## References

- [SearXNG Search API: queries and upstream syntax](https://docs.searxng.org/dev/search_api.html)
- [Google Search Central: `site:` and `filetype:` operators](https://developers.google.com/search/docs/monitor-debug/search-operators)
- [Exa Search Best Practices: long semantic queries, filters, and search types](https://exa.ai/docs/reference/search-best-practices)
- [OpenAlex Search: exact, Boolean, phrase, proximity, and semantic search](https://help.openalex.org/api/searching/)
- [Crossref REST API Filters](https://www.crossref.org/documentation/retrieve-metadata/rest-api/rest-api-filters/)
- [Crossref REST API Tips: query, filter, and select](https://www.crossref.org/documentation/retrieve-metadata/rest-api/tips-for-using-the-crossref-rest-api/)
- [Semantic Scholar Academic Graph API](https://api.semanticscholar.org/api-docs/)
- [PubMed Help: Automatic Term Mapping, field tags, and Boolean operators](https://pubmed.ncbi.nlm.nih.gov/help/)
- Related on this site: [Exa guide](/posts/ai/2026-08-21-exa-neural-search-for-agents-en), [SearXNG guide](/posts/ai/2026-08-21-searxng-complete-guide-en), [Web Retrieval Fallback Routing](/posts/ai/2026-08-21-web-retrieval-fallback-routing-en), and [Multi-Query Expansion](/posts/ai/2026-03-12-multi-query-expansion-en)
