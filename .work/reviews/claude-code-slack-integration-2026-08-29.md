# Claude Code Slack Integration Pair Review - 2026-08-29

Scope:
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration-en.md`

Constraints observed:
- Kept `draft: true`.
- Preserved frontmatter `date`, `category`, `lang`, `series.name`, and `series.order`.
- Edited only the two assigned post files and this review file.
- Web research and fetching used Groundlane MCP tools only.

Judgment:
- Publishable as a draft after fixes. The main blocking risk was drift-prone product-transition wording around Team/Enterprise and Claude Tag. The pair now matches current official docs while preserving the article's two-path framing.

Groundlane sources:
- `https://code.claude.com/docs/en/slack` - verified Claude Code in Slack setup, routing modes, session flow, user-level permissions, Team/Enterprise retirement note, Slack vs web guidance, troubleshooting, and limitations.
- `https://code.claude.com/docs/en/claude-tag` - verified Claude Tag as distinct from earlier Claude Code in Slack, available on Team/Enterprise, unavailable on Pro/Max, and organization shared identity.
- `https://claude.com/docs/claude-tag/overview` - verified Public Beta status, Team/Enterprise availability, organization-shared channel model, usage balance/spend limit, and DM exception.

Fixes made:
- Tightened zh/en tldr and intro language so Team/Enterprise is described as a transition/new-setup path rather than a completed universal cutover.
- Added inline official links for the retirement note and Claude Tag availability.
- Added Claude Tag Public Beta, organization usage balance/spend limit, and DM exception boundaries in both languages.
- Restored zh/en parity by adding the Slack-vs-web entry-point guidance to the English article.
- Added the Claude.ai Claude Tag overview to references in both languages.
- Removed the weak `automation` tag from both frontmatters; the article is about the Slack surface and permission model, not automation generally.
- Added a 2026-08-29 changelog entry in both languages without changing draft status.

Validation:
- `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration-en.md` - passed.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration.md` - passed, 0 blocking and 0 review terms.
- `node scripts/check-lang-parity.mjs` - passed, 1428 zh/en pairs checked.
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration-en.md` - passed after removing the weak `automation` tag.
- `pnpm check:links src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-slack-integration-en.md` - passed, 6 external links checked and no broken links.

Residual risks:
- Claude Code and Claude Tag docs are live product docs; plan boundaries, cutover timelines, and billing language can continue to drift.
- Exact Team/Enterprise cutover dates remain account-specific per Anthropic's docs, so the article intentionally points readers to their Anthropic account team instead of naming a date.
