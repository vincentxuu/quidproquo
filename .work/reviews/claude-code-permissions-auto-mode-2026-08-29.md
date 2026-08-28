# Review: Claude Code permissions-auto-mode

Date: 2026-08-29

Files:

- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-permissions-auto-mode.md`
- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-permissions-auto-mode-en.md`

Scope:

- Order 7 in `Claude Code 深入介紹` / `Claude Code Deep Dives`.
- Keep `draft: true`; do not publish without user approval.

Checks:

- Groundlane fetched `https://code.claude.com/docs/en/permission-modes.md`, `https://code.claude.com/docs/en/auto-mode-config.md`, and `https://code.claude.com/docs/en/permissions.md`.
- `pnpm check:references` on this pair and order 6 pair: pass.
- `pnpm check:tw` on zh files for this pair and order 6 pair: pass.
- `node scripts/check-lang-parity.mjs` on this pair and order 6 pair: pass.
- `pnpm verify`: pass.
- `pnpm astro check`: blocked by unrelated untracked MIT 6.7960 English draft frontmatter, `additionalSeries.0` expected object but received string.

Edits applied:

- Tightened `tldr` wording so auto mode default is scoped to eligible interactive terminal and VS Code sessions, not every Pro/Max/Team session.
- Added `touch` and `sed` to the `acceptEdits` filesystem command examples.
- Clarified that `CLAUDE.md` content also steers the auto mode classifier, while the `autoMode` settings block is read only from user settings, managed settings, and `--settings`.
- Clarified that project `.claude/settings.local.json` is also excluded as an `autoMode` source.

Result:

- Mandatory drift fixes applied.
- Residual risk: no external link checker run in this batch; the official factual pages were fetched successfully.
