# Review: Claude Code settings-json-guide

Date: 2026-08-29

Files:

- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-settings-json-guide-en.md`

Scope:

- Order 6 in `Claude Code 深入介紹` / `Claude Code Deep Dives`.
- Keep `draft: true`; do not publish without user approval.

Checks:

- Groundlane fetched `https://code.claude.com/docs/en/settings.md`; current official docs still describe the same settings files, managed settings, scope behavior, command-line override, and local-settings trust/git-exclude details used by the article.
- `pnpm check:references` on this pair and order 7 pair: pass.
- `pnpm check:tw` on zh files for this pair and order 7 pair: pass.
- `node scripts/check-lang-parity.mjs` on this pair and order 7 pair: pass.
- `pnpm verify`: pass.
- `pnpm astro check`: blocked by unrelated untracked MIT 6.7960 English draft frontmatter, `additionalSeries.0` expected object but received string.

Result:

- No mandatory edits found.
- Residual risk: no external link checker run in this batch; only official source fetch for the main facts was performed.
