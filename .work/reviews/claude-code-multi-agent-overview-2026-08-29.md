# Claude Code multi-agent overview review - 2026-08-29

Scope:
- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview.md`
- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview-en.md`

Verdict: minimally fixed. The pair stays draft-only and series order 24 remains paired across zh-TW/en.

## Sources Checked

- https://code.claude.com/docs/en/agents
- https://code.claude.com/docs/en/sub-agents
- https://code.claude.com/docs/en/agent-view
- https://code.claude.com/docs/en/agent-teams
- https://code.claude.com/docs/en/workflows
- https://code.claude.com/docs/en/worktrees

All web research/fetching used Groundlane MCP tools.

## Fixes Applied

- Clarified Agent Teams task-list claims: teammates can message each other directly, but shared task-list behavior depends on agents having Task tools.
- Clarified subagent communication: subagents normally report to the spawning conversation; named subagents can message each other, but that still is not a separate coordination surface.
- Clarified worktree trust behavior: interactive `--worktree` runs require workspace trust, while non-interactive `-p` runs skip that trust check.
- Clarified non-interactive worktree cleanup: `-p` runs do not trigger exit cleanup, and creation locks can remain until stale-lock sweep; manual removal may need `git worktree unlock`.
- Clarified isolation enforcement: Claude Code also blocks shell command shapes it cannot verify will stay inside the worktree.

## Checks

- `pnpm check:references src/content/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview-en.md` - passed.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview.md` - passed, 0 blocking and 0 review terms.
- `pnpm check:series-order` - passed with existing non-blocking gap warnings, no blocking order issues.
- `pnpm check:lang-parity` - passed.
- `pnpm check:links src/content/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-multi-agent-overview-en.md` - passed after rerun with network access; sandbox run had returned TypeError for every URL.

## Residual Risks

- Official Claude Code docs are moving quickly. These claims were verified against the fetched pages on 2026-08-29, but version-specific behavior can drift.
- I did not run full `pnpm verify` because the user requested a narrow pair review and the worktree contains many unrelated pending changes.
