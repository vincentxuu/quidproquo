# Claude Code sub-agent pair review - 2026-08-29

Files reviewed:

- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution-en.md`

Scope:

- Series order 15 pair only.
- No `draft: false` flip.
- No edits outside the two post files and this review note.
- Web research/fetching used Groundlane MCP tools only.

Official sources fetched:

- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/context-window
- https://code.claude.com/docs/en/memory
- https://code.claude.com/docs/en/permissions

Findings and fixes:

- Factual drift: the context-window docs say a subagent returns the summary plus a small metadata trailer. The posts said only the final summary returns. Fixed in both languages.
- Factual clarity: the posts listed `memory` as a persistent memory scope but did not say it is the subagent's own auto memory, not the main conversation's memory. The official memory/sub-agents docs make this distinction and note fork as the exception. Added one short paragraph in both languages.
- Reference coverage: the posts relied on sub-agent, memory, and permission details but only listed the sub-agents and context-window pages. Added the official memory and permissions pages to both reference sections.
- Lang parity: the same factual changes were applied to zh-TW and en.
- Frontmatter: required fields are present; `draft: true` was preserved; series order remains 15 in both files.
- zh-TW wording: `pnpm check:tw` reported 0 blocking and 0 review terms for the zh-TW post.

Validations:

- `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution.md` - pass
- `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution-en.md` - pass
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution-en.md` - pass
- `pnpm check:lang-parity src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-sub-agent-parallel-execution-en.md` - pass; script checked all pairs and found no parity issues
- `pnpm check:series-order` - pass with 12 existing non-blocking gap warnings in unrelated series; no blocking order issues
- `rg -n "order: 15|Claude Code 深入介紹|Claude Code Deep Dives|claude-code-sub-agent-parallel-execution" ...` - this pair is the only Claude Code series order 15 pair found; another order 15 hit belongs to a different series.

Residual risks:

- I did not run full `pnpm verify` because the worktree already contains many unrelated modified and untracked files outside this scope; focused checks for this pair passed.
- I did not run external link checking; the focused reference checker passed and all four official docs pages returned HTTP 200 through Groundlane.
