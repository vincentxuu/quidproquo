# Claude Code Agent Teams pair review - 2026-08-29

Scope:
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide-en.md`

Sources checked with Groundlane:
- https://code.claude.com/docs/en/agent-teams
- https://code.claude.com/docs/en/tools-reference
- https://code.claude.com/docs/en/sub-agents#what-loads-at-startup
- https://code.claude.com/docs/en/cross-session-messaging
- https://code.claude.com/docs/en/costs#agent-team-token-costs

Findings and fixes:
- Fixed an over-absolute subagent comparison. Current official docs say subagents that Claude names can also message each other, so the pair now frames Agent Teams around long-lived teammates, shared task list, direct user entry into teammate sessions, and lead coordination.
- Corrected plan approval behavior. Official Agent Teams docs say the lead session grants teammate plan approval as soon as the request arrives, without reviewing it; the drafts no longer imply the lead applies custom review criteria.
- Updated task panel controls: `Ctrl+T` toggles the task list, arrows plus Enter open a teammate transcript, `x` stops a selected teammate, and Esc clears selection or interrupts the currently viewed teammate.
- Updated `teammateMode` descriptions: default is `in-process`; `auto`, `tmux`, and `iterm2` now match the official split-pane behavior and iTerm2 requirements.
- Added current `/effort` behavior while viewing an in-process teammate.
- Replaced the inferred "3 teammates, 5-6 tasks each" guidance with the official 3-5 teammate starting point and the 15-independent-task example.
- Added official references for cross-session messaging and Agent Teams token costs, clearing the focused reference warning.

Frontmatter / series:
- `draft: true` preserved in both files.
- `series.order: 25` preserved in both files.
- Title, date, category, tags, lang, tldr, and description are present in both files.

Validation:
- `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide-en.md` - OK, no reference issues.
- `pnpm check:post-quality src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide-en.md` - OK.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide.md` - 0 blocking, 0 to review.
- `pnpm check:lang-parity` - OK, checked 1428 zh/en pairs.
- `pnpm check:series-order` - no blocking order issues. Existing unrelated warnings remain for other incomplete series.

Residual risks:
- Official Claude Code docs are fast-moving; the article is current against the fetched pages on 2026-08-29, but version-specific behavior may drift.
- Full `pnpm verify` was not run because the requested scope was focused and the working tree contains many unrelated modified files.
