# Claude Code channels guide review - 2026-08-29

Scope:

- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide-en.md`

Groundlane status:

- `mcp__groundlane__web_search` was available but returned `PROVIDER_UNAVAILABLE`.
- Used Groundlane `web_fetch` only for official source pages.

Official sources checked:

- https://code.claude.com/docs/en/channels.md
- https://code.claude.com/docs/en/channels-reference.md
- https://docs.anthropic.com/en/docs/claude-code/channels (redirects to `code.claude.com/docs/en/channels`)
- https://docs.anthropic.com/en/docs/claude-code/plugins (redirects to `code.claude.com/docs/en/plugins`)

Findings and fixes:

- Fixed the minimal webhook example in both languages so the emitted `meta` matches the shown `<channel path="/" method="POST">` example.
- Corrected organization defaults: claude.ai Team/Enterprise block channels until `channelsEnabled`; Console API key authentication allows channels by default unless managed settings are deployed.
- Clarified that `--dangerously-load-development-channels` bypasses the channel allowlist for local testing but not organization policy.
- Confirmed `draft: true` was preserved for both files.
- Confirmed `series.order: 21` is aligned across the zh-TW/en pair.

Validations:

- `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide-en.md` - passed.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-channels-guide.md` - passed with 0 blocking and 0 warn terms.
- `pnpm check:series-order` - passed with no blocking order issues; emitted unrelated missing-order warnings for incomplete series.
- `pnpm check:lang-parity` - failed on unrelated `src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide.md` changelog count mismatch.
- Pair-only parity script - passed for lang/date/series order/headings/changelog count/draft status.
- `pnpm lint` - passed.
- `pnpm astro check` - failed before this pair on unrelated `src/content/posts/tech/2027-01-07-mit-67960-l01-introduction-en.md` frontmatter schema (`additionalSeries.0` string instead of object).
- `pnpm check:links` - not run because it fetches external URLs outside Groundlane.

Residual risks:

- Channels are still documented as research preview; flag syntax, allowlist behavior, and protocol contract may change.
- Full-site checks may still be affected by unrelated dirty files in this worktree; focused checks were preferred for this pair.
