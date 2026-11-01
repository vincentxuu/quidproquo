# LLM API key draft publication

User authorized commit and push on 2026-11-01. Articles remain draft:true; no deployment command authorized or run.

Isolated checkout from origin/main; preserve shared checkout and all unrelated changes. Only four CS2680 checkedAt fields are refreshed on the remote registry. Full source-page copies and HTTP artifacts remain local and are excluded.

## Manifest

- src/content/posts/ai/2026-11-01-llm-api-key-leaks.md
- src/content/posts/ai/2026-11-01-llm-api-key-leaks-en.md
- .research/llm-api-key-leaks/research-note.md
- .research/llm-api-key-leaks/case-evidence.md
- .work/reviews/2026-11-01-llm-api-key-leaks.md
- .work/cs2680-video-recheck-20261101/independent-review.md
- src/lib/glossary/terms.ts
- scripts/config/course-videos.json
- progress.txt
- .work/llm-api-key-leaks/publication.md

## Validation

Final isolated-checkout pnpm verify passed all checks. Staged paths match the explicit manifest and git diff --cached --check passed. Two article hashes match the independently reviewed drafts. Normal pre-commit verify:staged runs during commit.
