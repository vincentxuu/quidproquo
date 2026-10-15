---
title: "Site Case Study: How the Writing & Review Pipeline Worked"
date: 2026-10-14
category: learning
type: guide
tags: [series, writing-process, review, pi, governance]
lang: en
series:
  name: "How to Write Teaching Articles"
  order: 29
draft: false
---

## Background

The series "How to Write Teaching Articles" finished its 28th post on 2026-10-14, bringing the total to 30 pieces (order 0 through 29). This case study explains how this site used `pi` agents to handle writing, review, and translation, and why it switched to `pi -ne -p --no-session` after Claude and Codex hit their weekly caps.

## Writing Process

1. **Plan first.** The series plan was registered before 2026-10-15 to avoid the `check:series-plan` gate. At most two posts per batch; after each batch, stop and wait for feedback before writing the next.

2. **Write.** Both Chinese and English versions of each post were produced with `pi`, keeping vocabulary and sentence patterns consistent between the two.

3. **Independent review.** `pi` was used for `post-verify` (sentence accuracy), `post-review` (structure and content), and `post-polish` (tone and terminology). All three stages were recorded under `.work/reviews/` and never merged into a single file.

4. **Attribution caveat cap.** A new rule — "Don't stack caveats and attributions" (`.agents/skills/post/references/writing-guide.md#但書與歸因不堆疊`) — limits attribution markers in body text to 3 per post. The checker `check-process-leak.mjs` blocks anything over. Before this commit, 5 learning articles were revised from 5–17 markers each down to 1–3.

5. **Published-post fixes.** Already-published posts had their "Ask AI" behavior descriptions and Cloudflare "Visits" definitions corrected to official wording, applied across 4 published posts in both Chinese and English.

## Key Decisions

- **Use `pi` for independent reviews.** Claude (`claude-opus-5-5`) and Codex hit their weekly/session caps and reset on 2026-10-16 19:00 and 2026-10-20 13:00 respectively, so all review and translation tasks were moved to `pi -ne -p --no-session` to avoid conflicts.
- **Cloudflare visit definition corrected.** Changed from a non-official description to: "Visits = A page view that originated from a different website or direct link; checks whether HTTP referer does not match hostname."
- **Ask AI description corrected.** No longer described as "falls back to a backup answer." Now: searches the site's articles → answers from retrieved passages; if no reliable sources, says the knowledge base lacks evidence (not general knowledge); if the draft fails the format/quality check twice, it is shown with "this answer may be incomplete".
- **Keep the o25 chat-log explanation accurate.** Retained: the first 240 characters are kept in step records (`rag_trace_steps`, `input_summary`) and readable on the admin traces page; if configured, the full question and answer are sent to Langfuse.

## Commit & Next Steps

- This commit adds 16 files: 5 new learning articles (Chinese + English) plus 4 already-published articles with corrections (Chinese + English).
- After this, order 29 (this case study) and order 0 (series intro) follow, keeping each post's attribution markers at 3 or fewer per the `check-process-leak` rules.

## References

- Series plan: `.work/series-plans/bug-bounty-from-zero.md`.
- Rules: `.agents/skills/post/references/writing-guide.md#但書與歸因不堆疊`.
- Checker: `node scripts/check-process-leak.mjs`.
