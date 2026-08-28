# Claude Code prompt caching pair review - 2026-08-29

Reviewed files:

- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching.md`
- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching-en.md`

## Result

No blocking publish issues found. Applied small factual/reference fixes only; `draft: true` was left unchanged in both files.

## Checks

- Frontmatter: required fields present; `date`, `category`, `tags`, `lang`, `type`, `series.order: 11`, and `draft: true` are valid for both files.
- TLDR/description: concrete and not duplicate. TLDR wording was updated to include the documented helper-request TTL exception.
- References: initially warned because one official link covered multiple topic sections; added focused official references for API prompt caching, statusline `current_usage`, and OpenTelemetry usage metrics.
- zh-TW wording: `pnpm check:tw` reported `0 blocking, 0 to review`.
- Parity: `node scripts/check-lang-parity.mjs` reported no parity issues across the repo's checked pairs; manual read found the pair aligned after edits.
- Official factual claims: checked against Groundlane-fetched official docs only.

## Edits Applied

- Added `unscoped rules` to the project-context layer table in both languages, matching the Claude Code prompt caching docs.
- Clarified that the default one-hour TTL on Claude subscription applies to the main conversation within included usage plus a small server-controlled helper-request set; other requests use five minutes unless configured.
- Added three official reference links to both files:
  - Claude Platform prompt caching API docs
  - Claude Code statusline docs
  - Claude Code monitoring usage docs

## Validation

```text
pnpm check:references src/content/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching-en.md
OK: checked 2 post files, no reference issues found.

pnpm check:tw src/content/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching.md
checked 1 zh-TW post file(s): 0 blocking, 0 to review.

node scripts/check-lang-parity.mjs src/content/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching.md src/content/posts/tech/deep-dive/2026-08-26-claude-code-prompt-caching-en.md
OK: checked 1428 zh/en pair(s), no parity issues found.
```

Extra scan:

```text
rg --pcre2 for zh-TW cross-section references and repeated-character residue only matched Markdown frontmatter separators and table delimiter lines.
```

## Groundlane Sources

- https://code.claude.com/docs/en/prompt-caching.md
- https://platform.claude.com/docs/en/build-with-claude/prompt-caching.md
- https://code.claude.com/docs/en/statusline.md
- https://code.claude.com/docs/en/monitoring-usage.md

## Residual Risks

- Did not run full `pnpm verify` because the requested scope was this pair and the workspace has unrelated existing changes.
- Did not flip `draft:false`, per instruction.
