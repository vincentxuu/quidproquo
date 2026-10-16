# Deployment optimization and dev-route repair (2026-10-16)

## Observed baseline

PR190 merged externally; both Preview deployments completed. First preview build8m02s,deploy5m09s (12,380 changed assets,254.41s upload). Second build7m36s,deploy48s (2 assets,1.67s upload). Latest observed main build4m45s with valid configuration cache and14.4s content sync. The two earlier content cache resets correctly rejected a cache from before the22redirect configuration changes; no cache bypass or workflow change justified.

Existing local build at7bf5b447:5,649 article pages contain1,580,167,737 bytes of repeated inline glossary data. Article HTML totals2,515,071,359 bytes. Pairwise matching paths will be compared because latestmain adds daily articles. Raw sizes are not compressed transfer sizes.

## Changes

Shared locale glossary resources have content-hashed URLs and immutable caching. Article HTML retains only custom locale overrides. Shared normalization/serialization/hash occurs once per module and locale. Browser merge preserves article priority, aliases, English fallback and longest phrase matching. Failed fetch/body read is bounded at5seconds, falls back to custom entries and can retry on focus/online; successful retry rebuilds marks and restores keyboard focus.

The article404 was a separate dev runtime defect: a295MB single data module throws `Failed to convert rust String into napi string`; Astro content store catches import failures and caches an empty store. Correct clock and source publication metadata were confirmed. Official experimental chunked collection storage with1MiB chunks fixes the full-project reproduction: raw/published5,675, articleHTTP200 and exactH1, including after removing diagnostics. Publication filters unchanged. No dependency, schema, workflow, production flag or screenshot tolerance changes.

Visual warmup now requires HTTP200 and the real article title; CI server stdout/stderr are visible. Baselines must be reviewed from real Linux rendered pages, never404.

## Validation

- Full unit suite:115files,752tests pass (includes10 glossary success/semantics/hash/network/body-timeout cases).
- Chromium DOM smoke:long phrase priority, failure/retry equivalence, excluded nodes/text, no repeated marks and focused term preservation pass.
- Actual old rendered zh/en glossary goldens retained for postbuild equality.
- Full final verify/build, matching-path size comparison and new PR remote checks recorded after completion.

Local raw evidence lives under /tmp/quidproquo-* and /tmp/ci-dev404-root-cause-and-fix.md; they are not publication artifacts. Previous Preview HTTP acceptance:22 redirects,22 destinations,30 exact articleH1 pass. New branch changes require their own Preview readback.

## Integrated local results

Final full `pnpm verify` all green; standalone Astro check0errors/0warnings. Production build exit0 in198.63s locally onNode22.18.0 (not a remote speed comparison);26OG generated and5650reused. Matching5649pages:HTML2,515,071,359→936,148,797 bytes; inlineglossary1,580,167,737→886,573 bytes; both shared assets total559,182bytes. Net raw savings after shared assets1,578,363,380bytes (~62.8% articleHTML). Full client bundle does not include sampled shared glossary prose.

Old actual rendered glossary golden equality:zh/en234entries each PASS. Real built-page Chromium:sharedhash resource loads;13/22 terms marked;focus opens popover;controlled503 API fallback displays exact old seed definition;no pageerrors;both locale screenshots visually inspected. Marker-only DOM test additionally covers longest-match/retry/focus semantics. Build _headers preserves existing /_astro rule and adds narrow immutable JSON rule.

## First remote revision e8461019

Full Verify and RAG contract passed. Visual job116742446740 stopped at `Timed out waiting300000ms from config.webServer`; it had not reached screenshot comparison, and no actual/diff images exist. Its log shows content synchronization still running when the service preparation deadline expires. Quality's successful check output is swallowed by verify.mjs, so only the402.932s complete-verifier time is known; no precise content-sync duration is claimed.

A minimal same-config experiment shows public `astro sync` writes the build cache directory, while dev uses `.astro`, reparsing entries despite equal config digests. Do not copy caches or bypass digest checks. The narrow infrastructure correction is a600second service-start readiness budget for the complete5,675-post cold database. HTTP200, exact articleH1, individual test limits and maxDiffPixels300 remain required. No screenshot baseline is changed without real actual/diff evidence.
