# Daily Digest frontend completion plan

Status: complete; canonical verify is blocked by a pre-existing content error noted below
Updated: 2026-08-16

## Contract

- Reader-facing channels: daily, arxiv, github, model-card, security,
  benchmark, framework, tool, funding, pricing, weekly, region.
- `signals` remains an internal JSON stage and is not rendered as a channel.
- All channel definitions and classification rules live in one shared source.

## Design direction

- Subject: an AI Agent ecosystem observation desk for readers following daily change.
- Job: let a reader understand the coverage and isolate one content stream quickly.
- Palette: inherit the site's forest brand tokens; use restrained blue and plum accents
  only to separate source feeds from market/watch channels.
- Type: inherit the site's Noto Sans TC body; use the existing mono stack for dates and counts.
- Layout: a compact channel matrix above the chronological feed, grouped as Briefings,
  Source feeds, and Watch desk.
- Signature: every channel control shows its published count and remains deep-linkable via
  `?type=...`.

## Tasks

- [x] Add shared channel registry, labels, grouping, and robust classifier.
- [x] Build reusable bilingual channel filter with counts and accessible state.
- [x] Wire both Daily pages to all 12 channels and URL-backed filtering.
- [x] Add focused classifier tests.
- [x] Run Astro check, focused tests, production build, and `pnpm verify`.
- [x] Record the pre-existing blocker separately from this implementation.

## Verification

- `pnpm exec vitest run src/data/daily-content-types.test.ts`: 16 tests passed.
- `pnpm exec astro check`: 0 errors.
- `pnpm exec astro build`: passed; `/daily` and `/en/daily` prerendered.
- Rendered HTML contains `all` plus all 12 channel filter keys.
- `pnpm verify`: lint, skill sync, and progress protocol passed; references failed because
  the pre-existing untracked `src/content/posts/daily/2026-05-25-ai-agent-arxiv-digest.md`
  has no `參考資料` section. This frontend task did not edit that article.
