# Web Benchmark Draft Verification - 2026-08-29

## Scope

- `src/content/posts/ai/2026-08-21-web-retrieval-benchmark.md`
- `src/content/posts/ai/2026-08-21-web-retrieval-benchmark-en.md`
- `src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark.md`
- `src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark-en.md`

## Verdict

Do not publish these four posts yet. Keep `draft: true`.

The writing quality, reference coverage, zh/en parity, Traditional Chinese terminology, and link health checks pass. The publication blocker is factual: the posts are explicitly framed as benchmark specifications, and the required raw benchmark runs and artifacts are not present.

## Local Evidence

- The four post files already mark themselves as unpublished benchmark specs and `draft: true`.
- `.research/2026-08-21-web-retrieval-benchmark.md` records that `TAVILY_API_KEY`, `EXA_API_KEY`, `FIRECRAWL_API_KEY`, `BRAVE_SEARCH_API_KEY`, and `SEARXNG_URL` were not configured for the retrieval benchmark research pass.
- Local artifact scan did not find benchmark `results.jsonl`, version-locked raw run outputs, citation snapshots, attempt spans, or annotation outputs for these two benchmarks.
- The only local benchmark-specific research note found is for the retrieval benchmark spec, not completed raw benchmark results.

## Check Commands

```text
pnpm check:references src/content/posts/ai/2026-08-21-web-retrieval-benchmark.md src/content/posts/ai/2026-08-21-web-retrieval-benchmark-en.md src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark.md src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark-en.md
OK: checked 4 post files, no reference issues found.

pnpm check:tw src/content/posts/ai/2026-08-21-web-retrieval-benchmark.md src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark.md
checked 2 zh-TW post file(s): 0 blocking, 0 to review.

node scripts/check-lang-parity.mjs
OK: checked 1428 zh/en pair(s), no parity issues found.

pnpm check:post-quality src/content/posts/ai/2026-08-21-web-retrieval-benchmark.md src/content/posts/ai/2026-08-21-web-retrieval-benchmark-en.md src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark.md src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark-en.md
OK: checked 4 post files, no quality issues found.

pnpm check:links src/content/posts/ai/2026-08-21-web-retrieval-benchmark.md src/content/posts/ai/2026-08-21-web-retrieval-benchmark-en.md src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark.md src/content/posts/ai/2026-08-22-web-extraction-quality-benchmark-en.md
OK: no broken external links among 10 checked.
```

## Groundlane Verification

Fetched through `mcp__groundlane__web_fetch`; no legacy fetchers used.

- Crawl4AI Markdown Generation: supports the article's distinction between default/raw markdown and filtered `fit_markdown`.
- Firecrawl Scrape docs: supports the article's use of `/scrape`, Markdown output, HTML/raw HTML, metadata/status-code distinction, and managed scraping positioning.
- Jina Reader page: supports the article's description of Reader as URL-to-Markdown/JSON for LLM grounding, with optional API key for higher rate limits.
- Mozilla Readability README/raw README: supports the article's description of Readability as a DOM article parser, not a fetcher or Markdown converter; also confirms sanitizer is the caller's responsibility.
- RFC 9111: supports the retrieval article's freshness/stale/validation framing.
- OpenTelemetry HTTP metrics: supports the use of `http.client.request.duration` and HTTP metric conventions.
- Playwright Mock APIs: supports network mocking and HAR-based replay as fixture-lane mechanisms.
- Shopify Toxiproxy README: supports deterministic transport failure injection in test/CI/dev environments.
- W3C PROV-O: supports the provenance Entity/Activity/Agent framing.

## Publication Blockers

### Web Retrieval Benchmark

- Needs at least three configured live channels: direct HTTP fetch, search API, and browser automation.
- Needs archived raw artifacts: `results.jsonl`, page representation hashes, citation snapshots, attempt spans, corpus version, runner commit, region, and provider config fingerprint.
- Current repo search did not find those artifacts.
- Therefore the posts must not claim live success rates, latency, cost, or provider ranking, and should remain `draft: true`.

### Web Extraction Quality Benchmark

- Needs one same-corpus, same-version raw run across Crawl4AI, Firecrawl, Jina Reader, and Readability.
- Needs archived raw responses, normalized adapter outputs, and blinded annotation/scoring output.
- Current repo search did not find those artifacts.
- Without the raw run, publishing would compare product capabilities, not benchmark results; keep `draft: true`.

## Next Action

If these articles should ship soon, first implement or run the benchmark harnesses and archive their raw outputs. Only after that should the posts be updated with result tables, failure analysis, and `draft: false`.
