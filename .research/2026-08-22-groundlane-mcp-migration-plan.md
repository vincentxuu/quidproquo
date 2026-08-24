# Groundlane MCP migration

Status: complete

## Scope

- Make Groundlane the documented Web MCP contract for Claude Code cloud.
- Remove repo-level activation and broad permission rules for legacy `web-fetch` and `stealth_fetch` MCP servers.
- Update canonical `.agents/skills/` references, then regenerate `.claude/skills/` with `pnpm skills:sync`.
- Preserve all unrelated dirty-worktree changes and never persist endpoint or token values.

## Tasks

- [x] Audit canonical instructions and settings for legacy names.
- [x] Apply the minimal settings and documentation migration on latest `origin/main`.
- [x] Sync generated skill mirrors.
- [x] Run targeted scans and `pnpm verify`.
- [x] Review scoped diff and publish the repository-side change.
- [x] Record the remaining Claude.ai Connector authentication requirement: Groundlane must use platform-managed OAuth or a managed credential proxy; Claude Code Cloud environment variables are not a secrets store.
