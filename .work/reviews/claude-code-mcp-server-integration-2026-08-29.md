# Claude Code MCP Server Integration Review - 2026-08-29

Scope:
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration-en.md`

Constraints followed:
- Did not flip `draft: true`.
- Did not edit outside the two assigned post files and this review file.
- Used Groundlane MCP tools only for web research/fetching.

Official sources checked:
- https://code.claude.com/docs/en/mcp
- https://code.claude.com/docs/en/mcp.md
- https://code.claude.com/docs/en/mcp-quickstart.md
- https://code.claude.com/docs/en/settings
- https://code.claude.com/docs/en/env-vars

Findings and fixes:
- Confirmed: MCP server configuration is separate from `settings.json`; manual scopes are local, project, and user; local and user live in `~/.claude.json`, project lives in `.mcp.json`.
- Fixed: clarified that local > project > user precedence is for the three manual scopes, while plugin servers and claude.ai connectors come after those sources in current docs.
- Fixed: clarified that JSON entries with `url` but no `type` are current configuration errors that Claude Code skips with an explicit message, instead of leaving the older implication that it simply loads as stdio and fails.
- Fixed: added current debugging detail for `claude mcp list`, `claude mcp get <name>`, and headless `stream-json` `system/init.mcp_server_errors`.
- Confirmed: HTTP is the recommended remote transport; SSE is deprecated; WebSocket must be configured with JSON/add-json because `claude mcp add --transport` does not accept `ws`.
- Confirmed: `claude mcp login <name>` is documented from v2.1.186, SSH/no-browser URL flow from v2.1.191, and `/mcp` remains the interactive auth/debug entry point.
- Confirmed: quickstart still describes the same on-disk config table and troubleshooting flow.
- Confirmed: settings docs separately state `~/.claude.json` holds MCP server configurations and per-project state.
- Confirmed: zh/en files remain aligned on frontmatter, headings, examples, references, and changelog.

Groundlane notes:
- `web_search` for the official MCP docs initially found the canonical page.
- One later Groundlane `web_search` call returned HTTP 500 / container disconnected; retried with the `you` provider and continued.

Validations:
- `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration-en.md` - pass, 2 files, no reference issues.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration.md` - pass, 0 blocking, 0 to review.
- `pnpm check:series-order` - pass, no blocking order issues; unrelated existing missing-order warnings remain in other series.
- `pnpm check:lang-parity` - pass, 1428 zh/en pairs, no parity issues.
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-mcp-server-integration-en.md` - pass with nonblocking warning that `ai-agent` does not appear literally in title/body.
- Did not run `pnpm check:links` because it performs external web access outside Groundlane.

Residual risks:
- Official Claude Code docs are changing frequently; version-specific details after 2026-08-27 may drift.
- The `ai-agent` tag remains because Claude Code/MCP integration is substantively agent-tooling content; the local quality script still warns because the literal phrase does not appear in title/body.
- Focused checks were run on these two files only where supported by repo scripts; full `pnpm verify` was intentionally avoided because the worktree already contains many unrelated changes.
