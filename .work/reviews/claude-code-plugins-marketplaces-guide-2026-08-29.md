# Claude Code plugins marketplaces guide review - 2026-08-29

Scope:
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide-en.md`

Groundlane sources checked:
- https://code.claude.com/docs/en/plugins
- https://code.claude.com/docs/en/discover-plugins
- https://code.claude.com/docs/en/plugin-marketplaces
- https://code.claude.com/docs/en/plugin-dependencies
- https://code.claude.com/docs/en/skills
- https://code.claude.com/docs/en/mcp

Findings and fixes:
- Series order 16 pair is present in both languages. Nearby order is 14 MCP, 15 sub-agent, 17 hooks/skills/agents appendix; no order fix needed.
- `draft: true` preserved in both files.
- Frontmatter has required fields, 5 tags, non-identical `tldr`/`description`, matching bilingual series names and order.
- Reference sections cover the main official docs. No missing reference issue from `pnpm check:references`.
- zh-TW term scan found 0 blocking and 0 review items.
- Factual drift fixed:
  - Plugin structure now includes `monitors/monitors.json` and `bin/`.
  - `commands/` is described as a compatible flat skill format, with `skills/` preferred for new plugins.
  - Marketplace cache copy wording now notes the `command` source link-mode exception.
  - Community marketplace wording now distinguishes repo `anthropics/claude-plugins-community` from marketplace name `claude-community`.
  - Team settings wording now notes external-source plugins enabled by project settings still need member installation before loading.
  - Dependency bundle wording now says `name` is still required.

Validations run:
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide.md` - pass
- `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide-en.md` - pass
- `pnpm check:lang-parity src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide-en.md` - pass
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-plugins-marketplaces-guide-en.md` - pass
- `pnpm check:series-order` - pass with unrelated existing warnings for other incomplete series; no blocking order issues

Residual risks:
- Did not run full `pnpm verify` because the requested scope is limited and current `progress.txt` already has unrelated modifications.
- Groundlane returned one transient HTTP 500 while fetching the MCP page; retry succeeded.
- Official docs are live and version-gated in several places, so CLI-version-specific behavior may drift again.
