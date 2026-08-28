# Claude Code order 1 review — 2026-08-29

Files:

- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works.md`
- `src/content/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works-en.md`

Status:

- Series order: 1
- Current draft state: `draft: true` in both files
- Review result: content is not an empty shell; mechanically acceptable after small edits, but not flipped to published because that is a publish decision.

Edits made:

- Replaced the long official-docs blockquote with a paraphrase in both languages.
- Clarified that the permission-mode table lists common interactive modes, not the complete mode universe.
- Added caveats to the auto-mode default wording.
- Added specific references for checkpointing and permission modes.

Verification:

- `pnpm verify`: passed before edits.
- `pnpm check:references`: exit 0 after edits; existing site-wide warnings remain, including unrelated coding-agent and Claude Code draft reference-density warnings.
- `pnpm lint`: passed after edits.
- `pnpm check:tw src/content/posts/tech/deep-dive/2026-08-26-claude-code-how-it-works.md`: passed after edits.
- `pnpm astro check`: blocked by unrelated untracked file `src/content/posts/tech/2027-01-07-mit-67960-l01-introduction-en.md`, whose `additionalSeries.0` is parsed as a string instead of an object.
- `pnpm check:links` on both files: local checker returned `TypeError` for all `code.claude.com` links. Groundlane fetched the same official URLs successfully with HTTP 200, so this is treated as a local checker/network false positive, not dead references.

Groundlane-confirmed official sources:

- `https://code.claude.com/docs/en/how-claude-code-works`
- `https://code.claude.com/docs/en/tools-reference`
- `https://code.claude.com/docs/en/claude-directory`
- `https://code.claude.com/docs/llms.txt`
- `https://code.claude.com/docs/en/checkpointing`
- `https://code.claude.com/docs/en/permission-modes`
- `https://code.claude.com/docs/en/sessions`
- `https://code.claude.com/docs/en/model-config`

Remaining before publish:

- Human approval to flip `draft: false`.
- Optional: decide whether to fix the unrelated untracked MIT schema error before relying on `astro check` as a full-site gate.
