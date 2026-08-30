# CI/CD repair implementation plan

Date: 2026-08-30
Approval: user approved Tier 2 workflow and D1 migration changes. Production deploy and remote migration execution remain out of scope.

## Target workflow boundaries

- `deploy.yml`: production orchestration and Worker deployment only.
- `quality.yml`: canonical `pnpm verify` reusable quality gate.
- `seo-observability.yml`: sequential content ops, freshness, observability, and artifact upload.
- `content-index.yml`: incremental D1/Vectorize sync after deployment; manual full rebuild entry point.
- `preview.yml`: preview orchestration reusing the quality workflow.

## Checklist

- [x] Confirm live failure and runtime root causes with authenticated GitHub logs.
- [x] Confirm current Cloudflare Workers, D1, and Vectorize API guidance.
- [x] Define the incremental sync request/response contract and authentication boundary.
- [x] Add D1 migration and storage/index state implementation.
- [x] Replace full Wrangler subprocess sync with bounded Worker binding batches.
- [x] Make post embeddings operate on changed/deleted chunk IDs; preserve explicit full rebuild.
- [x] Split workflows and add persistent OG image cache.
- [x] Add focused unit/runtime tests for delta, delete, idempotency, auth, and capacity.
- [x] Run focused tests, type checks, workflow validation, build, and `pnpm verify`.
- [x] Record remaining production migration/deploy steps without executing them.

## Safety constraints

- Do not run remote migrations, production sync, or deployment.
- Do not weaken checks or mark production mutations `continue-on-error`.
- Do not make production D1/Vectorize work cancellable mid-mutation.
- Preserve unrelated staged and untracked content in the shared worktree.

## Remaining production steps

1. Confirm the production Worker and GitHub Actions both have the same `INDEX_SYNC_SECRET`.
2. Merge/push the reviewed changes; the deploy workflow applies migration 0034 before deploying the new Worker.
3. Let the post-deploy content-index job perform the initial source-hash reconciliation and bounded embedding maintenance.
4. If an immediate complete rebuild is required, manually dispatch `Content Index` with confirmation `FULL_REBUILD` after the deploy succeeds.
