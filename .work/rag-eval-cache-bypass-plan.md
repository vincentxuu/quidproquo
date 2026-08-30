# Production RAG eval cache-bypass plan

Status: retrieval passed in production; catalog latency fix locally verified

- [x] Add an admin-only `cacheMode: bypass` request policy and prevent public eval trace impersonation.
- [x] Skip semantic-cache lookup and writes during authenticated evaluation runs.
- [x] Make live baseline and Promptfoo adapters require an admin cookie and request bypass explicitly.
- [x] Version semantic-cache rows by retrieval generation and bound their lifetime.
- [x] Check forbidden sources in both source metadata and generated answer text.
- [x] Run focused tests, `pnpm verify`, then inspect the scoped diff.
- [x] Deploy the cache-bypass contract and confirm anonymous bypass is rejected with 403.
- [x] Run an uncached production q21 via cache generation v2; confirm all four required course sources and no forbidden source.
- [x] Diagnose the remaining 51.2s failure as three Critic retries, not retrieval loss.
- [x] Align Writer and Critic around title-plus-link catalog evidence while preserving grounding checks.
- [x] Bound retry retrieval to 20 posts and emit only the accepted final draft once.
- [ ] Commit/push/deploy cache generation v3, then rerun uncached production q21.
