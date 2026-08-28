# Claude Code Agent View Pair Review - 2026-08-29

Scope:
- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-agent-view.md`
- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-agent-view-en.md`

Constraints observed:
- Did not flip `draft: true`.
- Did not edit outside the two assigned post files and this review file.
- Web research used Groundlane MCP only.

Official sources checked:
- https://code.claude.com/docs/en/agent-view
- https://code.claude.com/docs/en/cross-session-messaging
- https://code.claude.com/docs/en/sessions

Findings and fixes:
- Agent View grouping: the current official docs describe Needs input and Ready for review above Working and Completed, with some grouped labels not mapping one-to-one to raw states. Fixed the tldr and intro in both languages so the post no longer collapses the UI to only Working / Needs input / Completed.
- Dispatch prefixes: the docs now cover both first-word subagent matching and `@<agent-name>` subagent mentions. Fixed both languages.
- Background command name: official wording uses `/background` with `/bg` as an alias. Fixed code comments in both languages.
- Cross-session messaging availability: the base claim v2.1.224+ is still valid for macOS/Linux/WSL 2 and v2.1.234+ for native Windows, but same-machine messaging on third-party providers or without feature-flag fetching requires v2.1.248+, and beyond-machine discovery depends on Remote Control/sign-in. Added the boundary in both languages.
- Session mention and listing: `@` mention of session names requires v2.1.232+; `/peers` is also available as an alias for `/list-agents`. Fixed both languages.

Validation:
- `pnpm check:series-order` passed with non-blocking warnings in unrelated series.
- `pnpm check:references src/content/posts/tech/deep-dive/2026-08-26-claude-code-agent-view.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-agent-view-en.md` passed.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-08-26-claude-code-agent-view.md` passed.
- Target pair scoped parity check passed: zh/en date match, `series.order` is 26 on both, heading count is 8 on both, changelog count is 1 on both.
- Full `pnpm check:lang-parity` passed before these edits, but after the edits it failed on an unrelated existing file: `src/content/posts/tech/deep-dive/2026-03-28-claude-code-agent-teams-guide.md` has zh/en changelog count drift (`zh 3 / en 2`).

Residual risks:
- I did not run full `pnpm verify` or `pnpm astro check` because the user requested a focused pair-only pass and the worktree contains many unrelated pending edits.
- Full lang parity is currently blocked by an unrelated Claude Code agent-teams post outside the allowed edit scope.
- Official Claude Code docs are live product docs and may keep changing; the post now matches the Groundlane-fetched pages as of 2026-08-29.
