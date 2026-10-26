# Process-leak checker proposal review

Reviewed: 2026-10-25. Proposal only; no patch applied, no actual checker edits, no commit or index mutation. User approval for the governance change remains pending with the main agent.

Files read:
- `.work/english-relationship-audit/checker-fix.patch`
- `.work/english-relationship-audit/check-process-leak-proposed.mjs` (the actual proposed file; no file literally named `proposed.mjs` exists)
- `/tmp/quidproquo-english-integrate/scripts/check-process-leak.mjs`

## Verdict

**Latest proposal is sufficiently bounded for the stated false-positive fix.** The two lexical guard defects identified in the first draft are now resolved and independently retested. Existing thresholds/check families remain unchanged. This is a technical review of the proposal; application still requires the user authorization being handled by the main agent, and no actual checker has been changed.

## Confirmed narrow parts

- Only the exact matched hedge `My guess` is eligible; other hedge forms remain counted.
- Requires category learning and the exact english-speaking inline-list tag; optional quoting is accepted, lookalike tags are rejected.
- Recognizes table lines, a limited set of blockquote speaker labels, or emphasized text with a teaching label / exercise-list context.
- Does not exempt the full article: sentence/process/audit checks remain active, and the existing process-topic escape hatch is unchanged.
- SENTENCE_LIMIT=2, AUDIT_H2_LIMIT=1 and HEDGE_LIMIT=3 are unchanged. No previous self-test/assert was removed.
- The existing 11 self-tests and nine additions all pass (20 total), including the four new lexical/tag negative cases.
- The proposed checker passes all 68 release article files with exit 0. This is a proposal run, not an actual production-checker result.
- Ordinary author prose remains counted, including the supplied `Status: *My guess is A*` pattern repeated four times: hedges=4 and one blocking problem.
- The actual isolated-checkout checker remains byte-identical to origin/main: SHA256 `f8cd1fa9171ccdaf711f51e1353d4cd1863fc6f2ed8cab3478e022452a0e3999` at review time. Latest proposed SHA256: `bd19691745a270f01cc8e8796ddd361a8b31402d5cda1b447a24dd8ed0ae0b35`.

## Finding 1 — resolved: English label substring matching

The first draft used teaching-label alternatives without English word boundaries. Consequently essay matched say and country matched try. The latest proposal now wraps the English alternatives in explicit word boundaries and keeps Chinese alternatives separate.

Reproduction: learning + exact english-speaking frontmatter; repeat the following line four times with A/B/C/D:

```text
In this essay, *My guess is A*.
```

First draft: hedges=0, problems=[]. Latest independent rerun: hedges=4, one blocking problem, for both essay and country; ordinary author italics remain counted.

Resolution confirmed: exact word boundaries and two new negative self-tests. Emphasis alone remains insufficient.

## Finding 2 — resolved: lookalike tag eligibility

The first draft raw frontmatter regex also matched not-english-speaking because hyphens create word boundaries. The latest proposal parses the inline tag-list elements, strips matching quotes and uses exact includes membership.

Reproduction: category learning, tags `[not-english-speaking, speaking]`, four table rows containing ordinary `My guess` opinions.

First draft: hedges=0, problems=[]. Latest independent rerun: both not-english-speaking and english-speaking-extra yield hedges=4 and one blocking problem. A quoted exact english-speaking tag correctly still enables the table-example exception.

Resolution confirmed: exact inline-list tag recognition with no dependency added, plus two negative self-tests for prefix/suffix lookalikes.

## Residual heuristic limits

- Any table cell containing the target phrase is treated as teaching material once article eligibility holds; syntax cannot prove it is an example rather than an author-opinion table. This is bounded to one phrase in one content family, but should be acknowledged.
- Exercise-heading and label recognition are intentionally partial; unrecognized heading languages, multiline tag metadata / quoted category values or alternative dialogue formatting may still produce false positives. These are conservative failures, not silent weakening.
- Approval of the intent should not be confused with approval of the first regex draft. The two refinements have now passed all 20 self-tests, the independent negative-case rerun and the same 68-article proposal check. Only the main agent should apply the real checker after user authorization.

## Execution scope

Only read source/patch files, imported the proposed analyzer from an in-memory data URL, and ran the proposal's self-tests / explicit 68-file check. This report is the only file written by this review task. No actual checker, test threshold, index, checkout or product article was modified.
