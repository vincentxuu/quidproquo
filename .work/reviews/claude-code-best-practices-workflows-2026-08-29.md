# Claude Code Best Practices Workflows Pair Review - 2026-08-29

Files:

- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-best-practices-workflows.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-best-practices-workflows-en.md`

Status: revised, still `draft: true`.

Changes applied:

- Verified `/batch` against the current Commands reference rather than Common workflows.
- Updated the `/batch` paragraph to say it decomposes work into 5 to 30 units, then runs one background subagent per unit in an isolated git worktree to implement, test, and open a PR.
- Added Commands reference to both reference lists.

Groundlane sources:

- https://code.claude.com/docs/en/best-practices
- https://code.claude.com/docs/en/common-workflows
- https://code.claude.com/docs/en/commands
- https://code.claude.com/docs/en/prompt-library

