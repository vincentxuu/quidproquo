# Japan crags expansion delivery

Date:2026-10-26. User authorized all35independent candidates and commit/push. Publication prepared in an isolated checkout based on origin/main87fe8d324b2f5a842d18b36b19b40646778473fe; unrelated shared-worktree changes are excluded.

## Scope

35new bilingual guides (70article files),35research notes,35review records,2updated overviews (57destinations total),35new gallery keys with766public-metadata videos/links, source index/snapshots and shared research pool. No standalone Kasameri-sawa/Hayama sector articles. Existing22guide bodies were not revised. Original overview date and links retained.

## Evidence and limits

- Each guide includes the public graded inventory actually read, native grades and row sources; blocked dynamic tables and unavailable guidebook interiors remain explicitly out of scope. Source rows/aliases do not imply distinct physical routes.
- Metadata checks do not imply continuous playback, audiovisual analysis, current permission or inspected hardware. Version/sector mismatches were rejected, including2Horai videos removed by independent review.
- Independent reviews:peer-north-samples.md,peer-central.md,peer-west.md. Parking and historical-closure scope were corrected against actual source text.
- source-recheck.md records active25volatile URLs:21automatic successes and4automatic failures. Exa fallback is recorded separately, including one portal-title-only result. Automatic failures remain visible. Retired Fujikyu404 is not a current article source.

## Validation

- Delivery audit:35pairs,0metadata/structure/URL-parity issues.
- Targeted grade check:70files,7960graded rows,0issues.
- Targeted references:72files,0errors,1keyword-overlap heuristic warning for Mikuradake, manually reviewed as relevant.
- Final build: `NODE_OPTIONS=--max-old-space-size=8192 pnpm build` passed, including Pagefind and OG generation; Vite emitted its non-blocking chunk-size advisory. Final full `pnpm verify` passed after the research-pool and final source corrections; receipt:verify-final.log.
- Generated HTML audit: all70new article paths and all35new links in each overview exist; gallery/detail output was inspected structurally, with removed Horai IDs absent. See render-audit.json. This is render evidence, not browser visual or video playback acceptance.

## Research pool

Added1170source identities,1230partial/snippet observations and11actual central-group zero-result pool queries. All1275prior records remain JSON-identical by ID; idempotent re-ingest adds zero. No video-watch or full-guidebook-read claim.

## Publication

Explicit manifest and scoped cached diff will be audited before commit. User authorized commit/push to main, with no manual deployment. Remote SHA readback is separate from CI/deployment state.
