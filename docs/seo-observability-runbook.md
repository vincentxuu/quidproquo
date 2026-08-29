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

## GitHub Actions Variables and Secrets

The deploy workflow reads these repository-level GitHub Actions variables and secrets:

| Name | GitHub type | Source | Notes |
| --- | --- | --- | --- |
| `GSC_SITE_URL` | Variable | Google Search Console property | Use `sc-domain:quidproquo.cc` for the domain property, or the exact URL-prefix property such as `https://quidproquo.cc/`. |
| `GSC_ACCESS_TOKEN` | Secret | Google OAuth 2.0 access token | Must include the Search Console read-only scope. Short-lived; see the token notes below. |
| `GA4_PROPERTY_ID` | Variable | Google Analytics 4 property | Numeric GA4 property id only, without `properties/` and not the `G-...` Measurement ID. |
| `GA4_ACCESS_TOKEN` | Secret | Google OAuth 2.0 access token | Must include Analytics read-only access. Short-lived; see the token notes below. |

Set them in GitHub:

1. Open the GitHub repository.
2. Go to **Settings** → **Secrets and variables** → **Actions**.
3. Add `GSC_SITE_URL` and `GA4_PROPERTY_ID` in the **Variables** tab.
4. Add `GSC_ACCESS_TOKEN` and `GA4_ACCESS_TOKEN` in the **Secrets** tab.

Equivalent GitHub CLI commands:

```bash
gh variable set GSC_SITE_URL --body 'sc-domain:quidproquo.cc'
gh variable set GA4_PROPERTY_ID --body '<numeric-property-id>'
gh secret set GSC_ACCESS_TOKEN
gh secret set GA4_ACCESS_TOKEN
```

The CLI prompts for secret values. Do not pass access tokens on the command line, where they may be captured by shell history.

### Get `GSC_SITE_URL`

1. Open [Google Search Console](https://search.google.com/search-console).
2. Select the `quidproquo.cc` property.
3. Use the property identifier shown in Search Console:
   - Domain property: `sc-domain:quidproquo.cc`
   - URL-prefix property: `https://quidproquo.cc/`

The property must match what the authenticated Google account can read. A token for an account that does not have access to that property will return no useful live data.

### Get `GA4_PROPERTY_ID`

1. Open [Google Analytics](https://analytics.google.com/).
2. Select the GA4 property for `quidproquo.cc`.
3. Go to **Admin** → **Property settings** → **Property details**.
4. Copy the numeric **Property ID**.

Do not use the web stream Measurement ID here. Measurement IDs usually start with `G-`; the Data API `runReport` endpoint expects a numeric property id and the request path becomes `properties/<GA4_PROPERTY_ID>`.

### Get Google access tokens

The current live adapter accepts Bearer access tokens directly. These tokens are short-lived, so this setup is best for manual `workflow_dispatch` runs or short CI tests. For scheduled production observability, prefer exporting JSON inputs into `.work/seo/` or extend the adapter to exchange a refresh token/service-account credential at runtime.

Using `gcloud`:

```bash
gcloud auth application-default login \
  --scopes='https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/analytics.readonly'

gcloud auth application-default print-access-token
```

Use the printed token as both secrets only if the same Google account has read access to Search Console and the GA4 property:

```bash
gh secret set GSC_ACCESS_TOKEN
gh secret set GA4_ACCESS_TOKEN
```

For Search Console, the minimum scope is:

```text
https://www.googleapis.com/auth/webmasters.readonly
```

For GA4 Data API reads, use:

```text
https://www.googleapis.com/auth/analytics.readonly
```

Before adding tokens to GitHub, test locally without printing the token:

```bash
GSC_SITE_URL='sc-domain:quidproquo.cc' \
GSC_ACCESS_TOKEN="$GSC_ACCESS_TOKEN" \
GA4_PROPERTY_ID="$GA4_PROPERTY_ID" \
GA4_ACCESS_TOKEN="$GA4_ACCESS_TOKEN" \
pnpm seo:observe -- --fetch-gsc --fetch-ga4
```

If the token is missing, expired, or lacks access, the report records `live_warnings`. It should not block `pnpm verify`.

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
- [Google Search Console API authorization](https://developers.google.com/webmaster-tools/v1/how-tos/authorizing)
- [Google Analytics Data API properties.runReport](https://developers.google.com/analytics/devguides/reporting/data/v1/rest/v1beta/properties/runReport)
- [Google Analytics Data API quickstart](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart)
- [GitHub Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets)
- [GitHub Actions variables reference](https://docs.github.com/en/actions/reference/workflows-and-actions/variables)
- [Bing Webmaster API](https://learn.microsoft.com/en-us/bingwebmaster/)
