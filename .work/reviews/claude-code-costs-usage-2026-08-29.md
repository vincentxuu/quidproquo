# Claude Code costs usage review - 2026-08-29

## Verdict

Can remain `draft: true` and is now suitable for publication review. The main drift was in fast-moving Claude Code docs: `/usage` gained more plan/spend/task detail, model aliases became provider-dependent, and analytics/spend reporting is split more clearly across Teams/Enterprise, Console, APIs, CSV exports, and OpenTelemetry.

## Changes

- Updated both zh-TW and en posts while preserving frontmatter `date`, `category`, `lang`, `series`, `order`, and `draft: true`.
- Replaced stale W27/W30 default-model wording with provider-dependent alias resolution and pinning guidance.
- Refreshed `/usage` coverage for `modelPricing`, loop/scheduled-task rows, usage-credit spend, and `/insights` timestamped reports.
- Clarified fast mode support, pricing for Opus 5 / Opus 4.8, unsupported providers, and Team/Enterprise owner enablement.
- Clarified advisor as an Anthropic API server tool with provider limitations.
- Clarified Teams/Enterprise analytics vs spend reporting, Enterprise Analytics API, Console dashboard, workspace spend limits, and OpenTelemetry.

## Groundlane Sources

- https://code.claude.com/docs/en/costs
- https://code.claude.com/docs/en/model-config
- https://code.claude.com/docs/en/fast-mode
- https://code.claude.com/docs/en/analytics
- https://code.claude.com/docs/en/advisor
- https://claude.com/blog/claude-model-and-effort-level-in-claude-code

## Validation

- `pnpm check:references src/content/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage-en.md` - PASS, checked 2 post files with no reference issues.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage.md` - PASS, checked 1 zh-TW post file with 0 blocking and 0 review items.
- `node scripts/check-lang-parity.mjs` - PASS, checked 1428 zh/en pairs with no parity issues.
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage-en.md` - PASS, checked 2 post files with no quality issues.
- `pnpm check:links src/content/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-costs-usage-en.md` - PASS, checked 6 external links with no broken links.

## Residual Risks

- Claude Code model aliases, availability gates, and pricing are explicitly documented as moving targets; this post should be rechecked before flipping `draft` to `false`.
- Groundlane fetches used the public documentation pages as of 2026-08-29; account-specific entitlements, organization settings, and provider contracts can still differ.
