---
title: "Groundlane Series Part 7: Selector Healing, Retrieval Test, and Quality Benchmarks"
date: 2026-09-11
category: tech
type: deep-dive
tags: [groundlane, mcp, web-extract, selector, rag, corpus, benchmark, document-parsing, retrieval-test]
lang: en
tldr: "Groundlane v0.1.0 adds four quality mechanisms: web_extract selector healing (three-layer deterministic fallback, no LLM), corpus_retrieval_test (RAG recall verification inspired by RAGFlow), a document benchmark CLI (character-level F1), and a search benchmark framework (ground truth corpus with multi-provider comparison). Tool count goes from 54 to 55."
description: "Part 7 focuses on making agent data retrieval more reliable: deterministic selector repair when DOM changes, corpus recall verification before building a pipeline, and quantifiable benchmarks for document parsing and search quality."
draft: false
glossary:
  - term: "selector-healing"
    definition: "A deterministic fallback in web_extract: when a CSS selector finds no match, it tries tag-only → partial class → attribute strategies in order, reporting healedFields so the caller knows what was repaired."
  - term: "corpus-retrieval-test"
    definition: "Groundlane's RAG recall verification tool: given a query and expected source IDs, it reports recall, per-hit rank and score, and which sources were missed."
---

> 🌏 [繁體中文版](/posts/tech/2026-09-11-groundlane-series-7)

The first five parts established the operating baseline — tool contracts, comparison with traditional approaches, in-site application, pitfall checklists. This part shifts from "how to use" to "how to know the data you got is right": can a broken selector recover on its own, can corpus recall be verified before building a pipeline, and can document/search quality be measured with numbers.

## Selector Healing: Three-Layer Deterministic Fallback

### Why Selectors Break

`web_extract` determinism depends on CSS selectors matching the target DOM. Part 5 covered this: when a selector finds nothing, the system returns an empty result rather than guessing. But in practice, target pages change — class names get prefixed, elements switch from `div` to `section`, attributes get renamed. For automated pipelines running on a schedule, selector breakage is a matter of when, not if.

The traditional fix is "break it, then manually repair" or "let an LLM guess a new selector." The first doesn't scale; the second destroys determinism. Groundlane adds a layer between: deterministic fallback that doesn't guess but tries a few degradation strategies.

### The Three Layers

[`tryHealSelector`](https://github.com/lanefoundry/groundlane/blob/main/src/core/extract-fields.ts) tries three strategies in order:

**Layer 1: tag-only fallback.** Extract the tag name from the original selector (e.g., `h1.article-title` → `h1`) and match by tag alone. This catches most "class changed but the element is still there" cases.

**Layer 2: partial class match.** Extract the first class name (e.g., `article-title-v2`) and use `[class*="article-title-v2"]` for substring matching. This catches "class prefix or suffix changed" cases.

**Layer 3: attribute fallback.** Extract the attribute name from the selector (e.g., `data-testid` from `[data-testid="price"]`) and match any element with that attribute, regardless of value.

If all three fail, the selector is genuinely unmatched and goes to `missingFields`. No fourth layer, no LLM.

### healedFields Reporting

When healing triggers, the response includes a `healedFields` array ([`web-extract.ts`](https://github.com/lanefoundry/groundlane/blob/main/src/tools/web-extract.ts)):

```json
{
  "healedFields": [
    {
      "name": "price",
      "originalSelector": "span.price-tag-v2",
      "healedSelector": "span"
    }
  ]
}
```

The caller knows three things: which field was repaired, what the original selector was, and which fallback was actually used. This lets agents decide "accept the healed result" or "flag for human review" rather than silently proceeding with incorrect data.

### Risk Controls

Healing is deliberately conservative. A tag-only fallback might match multiple same-tag elements (a page can have many `<span>`s), but `web_extract` respects `many: true/false` to control result count, and healed results are explicitly labeled. If the healed match returns wrong content, that's a caller judgment call — the system's job is "try degradation when there's zero match," not "guarantee the degraded result is correct."

## corpus_retrieval_test: RAG Recall Verification

### Why Verify Recall Before Building a Pipeline

[RAGFlow's Retrieval Test](https://ragflow.io/) — seeing recall results before answer generation — addresses a common RAG blind spot: you don't know whether the LLM answered based on the right source or a coincidentally matched irrelevant document. Groundlane's `corpus_retrieval_test` ([`corpus-tools.ts`](https://github.com/lanefoundry/groundlane/blob/main/src/tools/corpus-tools.ts)) turns this concept into an MCP tool: no LLM generation, retrieval only.

### How It Works

Input: corpus ID, query, list of expected source IDs. Output:

```json
{
  "corpusId": "tech-docs",
  "query": "Cloudflare Workers WASM size limit",
  "expectedCount": 2,
  "foundCount": 1,
  "recall": 0.5,
  "hits": [
    { "sourceId": "workers-limits", "expected": true, "rank": 1, "score": 0.92 },
    { "sourceId": "workers-pricing", "expected": false, "rank": 2, "score": 0.71 }
  ],
  "missed": ["workers-changelog"]
}
```

`recall` tells you directly: 1 of 2 expected sources was found (50%). `missed` names the gap. `hits` with `expected: false` shows unexpected results in the top-K.

### When to Use It

- **Before launching a new corpus**: after enrolling sources, run a few known queries through retrieval test to confirm recall meets your bar before connecting an LLM.
- **After source updates**: when a corpus gets updated sources, verify that the update didn't degrade recall for existing queries.
- **Comparing chunk strategies**: run the same queries against the same sources chunked with different `document_chunk` parameters (e.g., 2048 vs 512 token levels) and compare recall.

The tool is read-only, consumes no LLM tokens — each call is just one `corpus_search` invocation.

## Document Benchmark CLI

### Why Benchmark

`document_parse` supports 14+ formats (PDF, DOCX, XLSX, PPTX, CSV, HTML, Markdown, JSON, XML, RTF, EML, EPUB, ODF), but "supports" and "correct" are different things. A CSV being parseable doesn't mean every cell was correctly extracted; a PDF producing text blocks doesn't mean the text is in reading order.

[`benchmark-document.mts`](https://github.com/lanefoundry/groundlane/blob/main/scripts/benchmark-document.mts) aims to verify basic correctness for each format with the smallest possible fixture set, not to chase large-scale coverage.

### Character-Level F1

The benchmark uses two complementary metrics:

**Required-text recall**: each fixture defines strings that must appear in the parsed output (e.g., every cell value in a CSV). Recall = found / expected. This catches omissions.

**Character-level F1**: treat required text and parsed output as bags of characters, compute precision (how much of the parsed output is correct), recall (how much of the correct text was found), and take F1. This suits document parsing better than exact match — parsed output may contain extra whitespace, punctuation, or format markers while the core content is correct.

### Fixture Design

Three fixtures in [`test/fixtures/document/`](https://github.com/lanefoundry/groundlane/tree/main/test/fixtures/document):

| Fixture | Format | What It Tests |
|---|---|---|
| `text-pdf` | PDF | Basic text extraction from a single-page text PDF |
| `csv-table` | CSV | Cell completeness for a 4-column, 4-row table (20 cells) |
| `markdown-doc` | Markdown | Text preservation through headings, lists, and tables |

Run:

```bash
node --import tsx scripts/benchmark-document.mts
```

Output is machine-readable JSON: per-fixture recall, F1, block count, table cell count, and latency.

### Design Tradeoffs

The fixture set is deliberately small (3) because this is a regression gate, not a quality leaderboard. The goal is "run all fixtures in under 1 second after any parser change and confirm no regression," not "prove Groundlane's parser is better than Docling." Cross-parser comparison needs a larger corpus with human-reviewed ground truth — that's the scope of the [Arena design](https://github.com/lanefoundry/groundlane/blob/main/docs/product/arena-design.md).

## Search Benchmark Framework

### Ground Truth Corpus Format

[`test/fixtures/search/queries.json`](https://github.com/lanefoundry/groundlane/blob/main/test/fixtures/search/queries.json) defines the query corpus:

```json
{
  "schemaVersion": 1,
  "queries": [
    {
      "id": "factual-01",
      "category": "factual",
      "query": "Cloudflare Workers WASM size limit",
      "expectedUrls": ["https://developers.cloudflare.com/workers/platform/limits/"],
      "expectedFragments": ["module size"]
    }
  ]
}
```

Each query has two kinds of ground truth:

- `expectedUrls`: URLs the top-5 results should include (partial match, tolerates trailing-slash differences).
- `expectedFragments`: fragments that should appear in the combined title + snippet text of the results.

### Multi-Provider Comparison

[`benchmark-search.mts`](https://github.com/lanefoundry/groundlane/blob/main/scripts/benchmark-search.mts) starts a local MCP server and calls `web_search` through the specified provider:

```bash
# Auto mode (Groundlane's default RRF fusion)
node --import tsx scripts/benchmark-search.mts

# Pin a provider
node --import tsx scripts/benchmark-search.mts -- test/fixtures/search/queries.json brave
node --import tsx scripts/benchmark-search.mts -- test/fixtures/search/queries.json tavily
```

JSON output includes per-query `urlRecall`, `fragmentRecall`, provider used, latency, and errors. The summary includes overall average recall and p95 latency.

### Current Limitations

- The query corpus has only 5 queries (2 factual, 2 technical, 1 current events) — not statistically significant, only useful for spotting large differences.
- Ground truth is hand-written, not validated through a human annotation process.
- `expectedUrls` uses partial matching, which can produce false positives.
- Requires provider API keys to run — no offline mode.

Scaling this to a credible leaderboard requires 50+ queries across five strata (factual / current events / technical / multi-hop / ambiguous) plus human annotation — that's what the [Arena design](https://github.com/lanefoundry/groundlane/blob/main/docs/product/arena-design.md) Search track plans for.

## Takeaway

All four mechanisms address the same class of problem: when an agent retrieves data from external sources, how does it know what it got is correct? Selector healing handles deterministic repair when DOM changes. Corpus retrieval test verifies recall before a pipeline is built. Document benchmarks catch parser regressions. Search benchmarks compare provider quality.

None of them use an LLM: healing is deterministic DOM structure matching, retrieval test is pure search + set comparison, benchmarks are character-level F1 computation. In the agent ecosystem, "deterministic quality mechanisms" are cheaper and more reproducible than "using another LLM to judge quality."

## References

- [Groundlane — GitHub Repo](https://github.com/lanefoundry/groundlane) — source code, README (55 tools), CHANGELOG, SECURITY.md
- [Groundlane `extract-fields.ts` — selector healing](https://github.com/lanefoundry/groundlane/blob/main/src/core/extract-fields.ts) — `tryHealSelector` three-layer strategy, `HealedField` type, `extractFields` integration
- [Groundlane `corpus-tools.ts` — corpus_retrieval_test](https://github.com/lanefoundry/groundlane/blob/main/src/tools/corpus-tools.ts) — input schema, recall computation, missed source reporting
- [Groundlane `benchmark-document.mts`](https://github.com/lanefoundry/groundlane/blob/main/scripts/benchmark-document.mts) — character-level F1, required-text recall, fixture schema
- [Groundlane `benchmark-search.mts`](https://github.com/lanefoundry/groundlane/blob/main/scripts/benchmark-search.mts) — ground truth corpus format, multi-provider MCP invocation, JSON output
- [Groundlane Arena design](https://github.com/lanefoundry/groundlane/blob/main/docs/product/arena-design.md) — Search/Extraction/Document track planning, Elo rating system
- [RAGFlow](https://ragflow.io/) — inspiration for Retrieval Test: seeing and verifying recall content before answer generation
- [Groundlane Series Part 5: Pitfalls and Best Practices](/posts/tech/2026-08-23-groundlane-series-5-en) — selector determinism, `truncated` checks, version-change risk
- [Groundlane Series Part 2: Actual Calls, Response Structures, and Error Boundaries](/posts/tech/2026-08-23-groundlane-series-2-en) — `web_extract` selector/pattern engine contracts
