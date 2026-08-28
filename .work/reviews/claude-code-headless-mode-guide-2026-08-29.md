# Claude Code headless mode guide review - 2026-08-29

Scope:
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide-en.md`

Groundlane-only web verification:
- Used `mcp__groundlane__web_fetch` for official Claude Code docs.
- `mcp__groundlane__web_search` was attempted for a bounded official-doc search and returned provider unavailable; verification continued by fetching known official documentation URLs through Groundlane.
- No legacy WebFetch, stealth_fetch, fetch_page, or Playwright web-content fetching was used.

Official source URLs checked:
- https://code.claude.com/docs/en/headless
- https://code.claude.com/docs/en/headless.md
- https://code.claude.com/docs/en/cli-reference
- https://code.claude.com/docs/en/cli-reference.md
- https://code.claude.com/docs/en/permission-modes
- https://code.claude.com/docs/en/agent-sdk/overview
- https://code.claude.com/docs/en/agent-sdk/python.md
- https://code.claude.com/docs/en/agent-sdk/typescript.md
- https://code.claude.com/docs/en/agent-sdk/sessions
- https://code.claude.com/docs/en/agent-sdk/streaming-output
- https://code.claude.com/docs/en/agent-sdk/structured-outputs
- https://code.claude.com/docs/en/agent-sdk/custom-tools
- https://code.claude.com/docs/llms.txt

Findings and fixes applied:
- Clarified that `claude -p` and Agent SDK sessions still start in Manual/default permission mode even though interactive Pro/Max/Team sessions may now start in auto mode.
- Reworded `--bare` from "skip all auto-loading" to "skip most auto-discovery" and documented the `--add-dir` `.claude/skills/` exception.
- Added that bare mode still has Bash, file read, and file edit tools, while skipping OAuth/keychain for Anthropic API auth.
- Updated `--continue` wording to distinguish `claude -p --continue` from interactive `claude --continue`.
- Added current headless CI details: background subagent/workflow wait ceiling and `--mcp-config` pending-server wait/version behavior.
- Reframed SDK streaming from "callbacks" to official message/event object behavior and made structured output/custom-tool wording match Zod/Pydantic and in-process MCP docs.
- Added focused Agent SDK references for sessions, structured outputs, and custom tools.
- Tightened frontmatter tags from broad `automation`/`scripting` to `[claude-code, headless, agent-sdk, cli, ci]` in both languages.
- Preserved `draft: true`; did not flip publication state.

Validation:
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide-en.md` - OK, no quality issues.
- `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide-en.md` - OK, no reference issues.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-headless-mode-guide.md` - OK, 0 blocking, 0 to review.
- `pnpm lint` - OK, 0 warnings, 0 errors.
- `pnpm check:lang-parity` - OK, checked 1428 zh/en pairs, no parity issues.
- `pnpm check:series-order` - OK, no blocking order issues; existing unrelated missing-order warnings remain.
- `pnpm astro check` - failed on unrelated untracked `src/content/posts/tech/2027-01-07-mit-67960-l01-introduction-en.md` because `additionalSeries.0` is a string but schema expects an object.

Residual risks:
- External link liveness was not checked with `pnpm check:links` because that script performs its own web requests; this turn constrained web research/fetching to Groundlane MCP tools.
- The broader Claude Code series still has existing global series-order warnings unrelated to this order 18 pair.
- `astro check` could not prove the full content graph because of the unrelated MIT 6.7960 draft schema error.
