# GitHub Actions failure and runtime analysis

Date: 2026-08-30 (Asia/Taipei)
Repository: `vincentxuu/quidproquo`
Local baseline observed: `main` at `a95ff1bc`
Scope: read-only analysis; no workflow, production, schema, or migration changes were made.

## Executive result

The current red deploys have one confirmed primary failure and one deterministic latent failure:

1. `Sync posts to production D1` rewrites the whole corpus through hundreds of remote Wrangler processes, then fails at the final stale-row prune with `not authorized: SQLITE_AUTH`.
2. If the D1 prune is fixed, `Sync post embeddings` is configured to process at most 40,000 chunks, while the current corpus has more than 42,500. It will make 500 HTTP/embedding requests and then exit 1 with work remaining.

The long runtime is structural rather than a slow package install. Recent job evidence shows `pnpm install` taking 2-3 seconds, while the content D1 sync takes about 22-23 minutes, build takes about 3-4 minutes, Astro check takes about 1.3-1.6 minutes, and SEO/AEO report generation takes about 1.5-2 minutes.

## Live evidence

Snapshot of the latest 50 Deploy runs: 19 failures, 18 successes, 11 cancellations, 1 running, and 1 pending. The cancelled runs are largely concurrency queue replacement during rapid pushes, not independent test failures.

Confirmed failing runs:

- [Run 33285423126](https://github.com/vincentxuu/quidproquo/actions/runs/33285423126): `Sync posts to production D1` ran 1,361 seconds, reached `Pruning stale posts...`, then failed with `not authorized: SQLITE_AUTH`.
- [Run 33270671493](https://github.com/vincentxuu/quidproquo/actions/runs/33270671493): the same step ran 1,347 seconds and failed at the same prune operation.
- [Run 33269481706](https://github.com/vincentxuu/quidproquo/actions/runs/33269481706): the same step ran 1,398 seconds and failed at the same prune operation.

In these runs, `Deploy to production` had already succeeded before D1 sync failed. A red run therefore does not mean the Worker deployment itself failed. It means the post index was partially refreshed, stale pruning failed, embeddings were skipped, and search-freshness verification was skipped.

## Root causes

### P0: full-corpus D1 rewrite plus unauthorized prune

`scripts/sync-to-d1.ts:129-190` reads and prepares every eligible post. `scripts/sync-to-d1.ts:199-212` sends all posts and chunks again, even for a one-file content change. Each batch calls a fresh `npx wrangler d1 execute` subprocess at `scripts/sync-to-d1.ts:119-126`.

Current-worktree measurement:

- 3,144 Markdown files
- 2,980 eligible posts
- 42,596 chunks
- 60 post batches
- 456 chunk-statement batches
- 1 prune batch
- 517 remote Wrangler calls per content sync

The prune introduced by `808654ca` creates `_sync_eligible_post_slugs` as a TEMP table (`scripts/sync-to-d1.ts:80-116`). The authenticated Actions log proves the combined prune file is rejected with `SQLITE_AUTH`; the public log does not identify a more specific SQL statement. Cloudflare documents D1 as compatible with most, not all, SQLite conventions and documents `wrangler d1 execute --file` as an import path: https://developers.cloudflare.com/d1/sql-api/sql-statements/ and https://developers.cloudflare.com/d1/best-practices/import-export-data/.

### P0: embedding sync cannot finish the current corpus

`scripts/sync-embeddings-prod.mjs:5-6` defaults to 80 chunks per request and 500 requests. `src/lib/indexing/pipeline.ts:30-35,83-84` pages `post_chunks` directly and reports more work whenever a full page is returned.

Capacity is therefore 40,000 chunks. Both tracked-HEAD measurement (42,526) and current-worktree measurement (42,596) exceed it. Once D1 sync gets past prune, the embedding step needs about 532-533 batches but is hard-limited to 500; `scripts/sync-embeddings-prod.mjs:76-78` then exits 1.

Increasing `EMBED_SYNC_MAX_BATCHES` alone is not a sound fix: it converts the deterministic failure into an even longer full-corpus re-embedding on every content change and daily schedule.

### P1: every hosted runner misses the OG image cache

`package.json:10` runs OG generation after every Astro build. `scripts/generate-og-images.mjs:14,49-65` caches under `.cache/og-images`, but deploy and preview workflows never restore or save that directory. The repository's recorded local measurement is 401.64 seconds cold versus 0.82 seconds warm for 2,978 images (`docs/admin-v2-production-verification.md:17`). Actual recent Actions builds were about 193-245 seconds.

### P1: expensive work is serialized in one production job

`.github/workflows/deploy.yml:17-141` serializes checks, build, report generation, migration, deploy, D1 sync, embedding sync, and freshness verification. A successful non-content run still took 6m30s: Astro check 95s, build 240s, migration 4s, deploy 27s; content reports and indexing were correctly skipped.

`content:ops` adds quadratic corpus work: every post scans all posts for internal-link candidates (`scripts/content-ops.mjs:131-142,202-227`) and all same-language pairs are compared for duplicates (`scripts/content-ops.mjs:229-242`). At roughly 3,000 posts, this is millions of comparisons per content sync.

### P1: schedule always selects the heaviest path

`.github/workflows/deploy.yml:55-58` forces `should_sync=true` for both schedule and manual dispatch. The daily schedule therefore performs full reports, D1 rewrite, full embedding, and freshness checks even when no future-dated post became publishable.

### P2: concurrency explains cancellations and queue delay

`.github/workflows/deploy.yml:10-12` keeps one production group with `cancel-in-progress: false`. GitHub keeps the running mutation and replaces an older pending run when newer pushes arrive, which explains jobless cancelled runs during the push burst.

Do not blindly change this to `true`: cancellation during D1 or Vectorize mutation can leave a partial index. Split cancellable validation/build work from a serialized, non-cancellable production mutation lane first.

### P2: other correctness and warning issues

- Production repeats only lint, Astro check, and references instead of the canonical `pnpm verify`; preview uses the full gate. This allows production and preview quality behavior to drift (`deploy.yml:36-43`, `preview.yml:29-30`, `scripts/verify.mjs:139-153`).
- D1 migration uses `continue-on-error: true` (`deploy.yml:109-116`), so schema/auth failure can be hidden until a later step fails less clearly.
- `.work/stanford-cs221-notes/source` is tracked as git mode `160000` without a `.gitmodules` entry. Checkout cleanup warns `fatal: No url found for submodule path ...`; this is not the primary failure but should be cleaned up.
- `fetch-depth: 0` is required by the current before/after diff implementation. Checkout is only about 4-6 seconds in observed runs, so it is not a priority bottleneck despite the full history.

## Recommended sequence

1. Hotfix the confirmed red run: stop using the rejected TEMP-table prune. The smallest operational workaround is `--no-prune`, explicitly accepting stale deleted rows until a durable prune exists.
2. Replace full D1 rewrite with content-hash or git-diff incremental upsert/delete. If a staging manifest is retained, use an explicitly migrated persistent table and validate its D1 permissions before the expensive write phase.
3. Make embeddings incremental by chunk content hash and delete/upsert only changed chunk IDs. Keep a separate explicit rebuild workflow for full re-indexing.
4. Persist `.cache/og-images` with an Actions cache keyed by generator template/font inputs; content-specific cache filenames already include post metadata.
5. Run the scheduled index path only when the publishable manifest changes. Manual full rebuild should be a separate, visible maintenance workflow.
6. Split quality/build from production mutation. Cancellable jobs can produce an artifact; deployment, D1, and Vectorize mutation remain serialized and non-cancellable.
7. Align production with `pnpm verify`, remove the orphan gitlink, and decide whether migration failures should remain non-blocking.

Workflow changes, D1 migration/schema work, and production execution are Tier 2 under the operating charter and require explicit approval before implementation.
