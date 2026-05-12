# Crawler Production Smoke Test

Run this after deploying crawler changes, after rotating crawl secrets, and after changing crawl targets.

## Preconditions

- `CF_API_TOKEN`, `CF_ACCOUNT_ID`, and `CRAWL_SECRET` are set on the Worker.
- Latest D1 migrations have been applied to production.
- Deploy completed with the cron trigger from `wrangler.jsonc`.

## Checks

1. Verify unauthorized requests are rejected.

```bash
curl -i -X POST https://quidproquo.cc/api/crawl/sync \
  -H "X-Crawl-Secret: wrong-secret"
```

Expected: HTTP 401 with `{"error":"Unauthorized"}`.

2. Trigger an incremental crawl.

```bash
curl -sS -X POST https://quidproquo.cc/api/crawl/sync \
  -H "X-Crawl-Secret: $CRAWL_SECRET" \
  -H "Content-Type: application/json" | jq .
```

Expected:

- `status` is `ok` or `partial_error`.
- `runId` and `durationMs` are present.
- Every result includes `target`, `pages`, `chunks`, `durationMs`, `jobId`, `statusCounts`, `skippedPages`, and `modifiedSince` after the first successful run.
- `errors` is `0` for a healthy run.
- If `needsEmbedSync` is `true`, run the embedding sync before treating RAG search as fresh.

Example healthy response shape:

```json
{
  "ok": true,
  "status": "ok",
  "runId": "uuid",
  "durationMs": 120000,
  "results": [
    {
      "target": "Cloudflare D1",
      "jobId": "job-id",
      "pages": 12,
      "chunks": 80,
      "skippedPages": 0,
      "statusCounts": { "completed": 12 },
      "modifiedSince": 1770000000,
      "durationMs": 30000
    }
  ],
  "totalChunks": 80,
  "errors": 0,
  "needsEmbedSync": true
}
```

3. Force a full crawl only when validating target coverage.

```bash
curl -sS -X POST https://quidproquo.cc/api/crawl/sync \
  -H "X-Crawl-Secret: $CRAWL_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"full":true}' | jq .
```

Expected: each configured target returns non-zero pages and chunks unless that upstream site blocks crawling.

4. Validate bad request handling.

```bash
curl -i -X POST https://quidproquo.cc/api/crawl/sync \
  -H "X-Crawl-Secret: $CRAWL_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"modifiedSince":"bad"}'
```

Expected: HTTP 400 with `modifiedSince must be a positive Unix timestamp in seconds`.

5. Validate D1 chunk coverage.

```bash
wrangler d1 execute quidproquo-db --remote \
  --command="SELECT source_name, COUNT(*) AS chunks, COUNT(DISTINCT source_url) AS pages, MAX(updated_at) AS last_updated FROM doc_chunks GROUP BY source_name ORDER BY source_name"
```

Expected: Cloudflare D1, Cloudflare Workers, Cloudflare Vectorize, and Astro Docs are present.

6. Validate checkpoint state.

```bash
wrangler d1 execute quidproquo-db --remote \
  --command="SELECT key, value, updated_at FROM settings WHERE key LIKE 'crawl:last_success:%' ORDER BY key"
```

Expected: one checkpoint per successful target. Values are Unix timestamps in seconds.

7. Validate search freshness after embedding.

```bash
pnpm eval:rag
```

Expected: RAG evaluation completes without doc-search regressions. If the crawl changed chunks, run the production embedding sync first.
