# Claude Code series order 9 pair review - 2026-08-29

## Scope

- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide-en.md`

## Checks

- Frontmatter: required fields present in both files; `draft: true` unchanged; `series.order: 9` aligned; tags are lowercase kebab-case and count is within the expected 3-7 range.
- TLDR/description: concrete and non-identical in both languages; claims match the article body after edits.
- zh-TW wording: no `pnpm check:tw` blocking or review terms.
- Parity: `node scripts/check-lang-parity.mjs` passed for the pair.
- References: initially the English post warned that 8 topic sections had only 2 links; after adding two official docs links to both versions, `pnpm check:references` passed.
- Official factual claims: verified with Groundlane MCP against current Claude Code docs for memory, large codebases, settings, and hooks.

## Edits Applied

- Removed a short orphaned zh-only subsection (`CLAUDE.md 語法與最佳實踐`) that had no English counterpart and read like leftover outline material.
- Added official Claude Code `settings` and `hooks-guide` references to both language versions to cover settings-scope and deterministic-enforcement claims.

## Validation Results

```text
pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide-en.md
OK: checked 2 post files, no reference issues found.

pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide.md
checked 1 zh-TW post file(s): 0 blocking, 0 to review.

node scripts/check-lang-parity.mjs src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-claude-md-agents-md-guide-en.md
OK: checked 1428 zh/en pair(s), no parity issues found.
```

## Sources

- https://code.claude.com/docs/en/memory
- https://code.claude.com/docs/en/large-codebases
- https://code.claude.com/docs/en/settings
- https://code.claude.com/docs/en/hooks-guide

## Residual Risks

- External docs are current as fetched on 2026-08-29, but Claude Code documentation can change; re-check before publishing if this post stays drafted for a long time.
- I did not run full `pnpm verify` because the requested scope was the order 9 pair and the workspace contains unrelated active changes.
