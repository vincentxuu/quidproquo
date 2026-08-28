# Claude Code code review pair review - 2026-08-29

Scope:
- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-code-review.md`
- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-code-review-en.md`

Groundlane sources fetched:
- https://code.claude.com/docs/en/code-review
- https://code.claude.com/docs/en/ultrareview
- https://code.claude.com/docs/en/github-actions

Findings and fixes:
- Frontmatter: both files keep `draft: true`; required fields exist; tags are lowercase kebab-case; zh/en dates and `series.order: 20` match.
- Series order: order 20 fits between GitHub Actions order 19 and Channels order 21; no same-series duplicate for order 20 found in the current file scan.
- Fact precision: the original tldr could read as if all GitHub PRs are automatically reviewed by default. Tightened both languages to say review must be configured and follows the repo trigger mode.
- GitHub Actions boundary: clarified that `anthropics/claude-code-action` is a checked-in workflow path, while Code Review is Anthropic's managed PR review service.
- References: added the official GitHub Actions docs to both reference sections because the article explicitly contrasts Code Review with the workflow integration.

Validation notes:
- Official Code Review docs support the managed service setup, trigger modes, manual `@claude review` / `@claude review always`, draft manual trigger, fork behavior, multi-agent verification, severity levels, neutral check run, REVIEW.md behavior, and average $15-25 review cost.
- Official ultrareview docs support `/code-review ultra`, remote sandbox, independent verification, 5-10 minute typical duration, 500 files / 8,000 changed lines default limit, Pro/Max one-time 3 free runs, typical $5-25 usage-credit cost, provider/ZDR exclusions, `/tasks`, and the `claude ultrareview` non-interactive subcommand.
- Official GitHub Actions docs support the distinction that `claude-code-action` runs inside repository workflows and is separate from the managed Code Review product.
- `pnpm check:references <zh> <en>` passed for the two assigned files.
- Focused series-order check across orders 19/20/21 passed with no duplicate or gap warnings.
- Focused zh/en parity check for this pair passed: date, draft, `series.order`, heading count, and changelog count match.

Residual risks:
- External docs are live and research-preview behavior can change; the changelog still frames this as based on August 2026 official docs.
- Full `node scripts/check-lang-parity.mjs` is currently blocked by an unrelated existing mismatch in `2026-03-28-claude-code-agent-teams-guide.md` (zh changelog 3 / en 2).
- I did not flip `draft: false`.
