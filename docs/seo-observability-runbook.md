# SEO / AEO Observability Runbook

This runbook separates three concerns that are easy to mix up:

- **Technical hygiene**: generated pages have crawlable URLs, canonical metadata, structured data, sitemap, robots, and `llms.txt`.
- **Search performance**: Google/Bing impressions, clicks, CTR, average position, indexed pages, sitemap status, and rich result errors.
- **Answer-engine visibility**: ChatGPT, Perplexity, Bing/Copilot, Google AI results, and other answer surfaces mention or cite quidproquo pages for repeatable prompts.

## Local Checks

Run before committing SEO/AEO infrastructure changes:

```bash
pnpm check:seo-smoke
pnpm verify
```

`check:seo-smoke` is deterministic and offline. It checks source invariants and, when `dist/client` exists, also checks built sitemap and sampled HTML.

Run an observability snapshot:

```bash
pnpm seo:observe
```

Default output:

```text
docs/seo-observability-report.json
```

Default paths, row limits, dimensions, metrics, and secret env names live in:

```text
scripts/config/seo-observability.config.mjs
```

Keep provider-specific defaults there. `scripts/seo-observability.mjs` should stay as the runner/report generator.

The report is designed to ingest external exports without requiring credentials inside this repo:

```bash
pnpm seo:observe -- \
  --gsc .work/seo/gsc-28d.json \
  --bing .work/seo/bing-28d.json \
  --llm .work/seo/llm-probes.json \
  --report docs/seo-observability-report.json
```

For live Google fetches, keep tokens outside the repo:

```bash
GSC_SITE_URL='sc-domain:quidproquo.cc' \
GSC_ACCESS_TOKEN='...' \
GA4_PROPERTY_ID='123456789' \
GA4_ACCESS_TOKEN='...' \
pnpm seo:observe -- --fetch-gsc --fetch-ga4
```

If those variables are missing or expired, the script writes `live_warnings` in the report instead of failing local checks.

## External Data Inputs

### Google Search Console

Export or fetch 28-day rows with `query` and `page` dimensions. The live adapter uses the Search Console Search Analytics API `searchAnalytics.query` endpoint with `dimensions: ["query", "page"]`.

Required env for live fetch:

- `GSC_SITE_URL`: Search Console property URL, for example `sc-domain:quidproquo.cc` or `https://quidproquo.cc/`.
- `GSC_ACCESS_TOKEN`: OAuth token with `https://www.googleapis.com/auth/webmasters.readonly`.

Supported export shape:

```json
{
  "rows": [
    {
      "keys": ["llms.txt 專案", "https://quidproquo.cc/posts/tech/2026-08-21-llms-txt/"],
      "clicks": 3,
      "impressions": 120,
      "ctr": 0.025,
      "position": 9.2
    }
  ]
}
```

### Bing Webmaster Tools

Use the same row fields when possible: `query`, `page`, `clicks`, `impressions`, `ctr`, `position`. The script also accepts generic row arrays.

Live Bing fetch is intentionally not enabled yet. Microsoft documents the Bing Webmaster API, but also notes legacy SOAP and POX APIs retire on **2026-08-31**. Do not add a live client until the REST/OAuth path is fixed and tested against a verified property.

### Google Analytics 4

The live adapter uses the Google Analytics Data API `properties.runReport` endpoint.

Required env for live fetch:

- `GA4_PROPERTY_ID`: numeric GA4 property id, without the `properties/` prefix.
- `GA4_ACCESS_TOKEN`: OAuth token with read access to the property.

Current report dimensions/metrics:

- Dimension: `pagePath`
- Metrics: `activeUsers`, `screenPageViews`, `sessions`

### LLM / Answer-Engine Probes

Run the fixed probes in `docs/seo-observability-queries.json` against each answer engine. Record only public answers and public citations; do not store account cookies, private session data, or API keys.

Supported shape:

```json
{
  "probes": [
    {
      "id": "llms-txt-project-need",
      "engine": "perplexity",
      "checked_at": "2026-08-29T00:00:00.000Z",
      "cited": true,
      "urls": ["https://quidproquo.cc/posts/tech/2026-08-21-llms-txt/"],
      "notes": "Cited the llms.txt article in the answer."
    }
  ]
}
```

## Weekly Review

1. Run `pnpm content:ops` to refresh content quality signals.
2. Export Google Search Console and Bing Webmaster rows for the last 28 days.
3. Run the fixed AEO probes from `docs/seo-observability-queries.json`.
4. Run `pnpm seo:observe -- --gsc ... --bing ... --llm ...`.
5. Review `priorities` in the generated report.

## Interpretation

- High impressions + low CTR: improve title and description, but do not overfit one query.
- Pages with clicks but no strong structured data: inspect JSON-LD and on-page answer clarity.
- AEO probes not citing the site: improve direct answer blocks, internal links, references, and crawlable summaries before adding more pages.
- Bots not appearing in logs: verify robots, firewall rules, and Cloudflare bot settings before assuming content quality is the issue.

## Boundaries

- Do not put GSC/Bing credentials in the repo.
- Do not put private ChatGPT/Perplexity session transcripts in the repo.
- Do not make claims about ranking improvement from local checks alone.
- `Pagefind` is site-search indexing; it is not external SEO observability.

## References

- [Google Search Console Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Google Analytics Data API properties.runReport](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)
- [Bing Webmaster API](https://learn.microsoft.com/en-us/bingwebmaster/)
