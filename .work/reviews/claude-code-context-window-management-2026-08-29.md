# Claude Code context window management pair review

Date: 2026-08-29

Files reviewed:

- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management.md`
- `src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management-en.md`

## Conclusion

No blocking publish issues found within the assigned pair. Frontmatter is complete, both files remain `draft: true`, `series.order` is 10 in both languages, references are present, and zh/en structure is aligned.

## Edits Applied

- Clarified the compaction section so the three-item frame is described as the everyday control surface, not the complete set of all current compaction-related operations.
- Added the current official `/rewind` partial summarization options, `Summarize from here` and `Summarize up to here`, in both zh-TW and English.

## Checks

- `pnpm check:references src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management-en.md`
  - PASS: checked 2 post files, no reference issues found.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management.md`
  - PASS: checked 1 zh-TW post file, 0 blocking, 0 to review.
- `node scripts/check-lang-parity.mjs src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management.md src/content/posts/tech/deep-dive/2026-03-28-claude-code-context-window-management-en.md`
  - PASS: checked 1428 zh/en pairs, no parity issues found.

## Factual Verification

Groundlane MCP was used for all web research/fetching.

- `https://code.claude.com/docs/en/context-window`
  - Verified context-window definition, startup context categories, compaction survival behavior, subagent example, `/rewind` partial summarization options, and current 1M context model list.
- `https://code.claude.com/docs/en/features-overview`
  - Verified the extension-feature context-cost table: CLAUDE.md, skills, MCP servers, code intelligence, subagents, and hooks.
  - Verified `disable-model-invocation: true`, deferred MCP schemas, and hooks being zero-cost unless they return context.
- `https://code.claude.com/docs/en/model-config`
  - Verified model aliases, 1M model variant behavior, Sonnet 5 native 1M behavior, and `CLAUDE_CODE_AUTO_COMPACT_WINDOW` / `autoCompactWindow` snippets via Groundlane search/fetch.
- `https://code.claude.com/docs/en/errors`
  - Verified availability of the error reference and relevant context/error snippets via Groundlane search. Full-page fetch hit Groundlane output-limit protection, so this remains a lower-confidence check than the other three official pages.

## Residual Risks

- Claude Code docs are moving quickly. The article is accurate against Groundlane-fetched official docs on 2026-08-29, but model names, default thresholds, and error wording are likely drift-prone.
- The error reference page could not be fully fetched because Groundlane returned `OUTPUT_LIMIT`; search snippets confirmed relevant context-limit material, but not every line of the three error descriptions was re-read from the full page.
- The repo worktree had unrelated existing changes before this review; this review intentionally touched only the two assigned posts and this report.
