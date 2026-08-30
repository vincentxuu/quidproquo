# Ask AI RAG evaluation runbook

This runbook keeps the evaluation contract, offline fixtures, live observations, and derived scores separate. A passing fixture run is a deterministic harness check; it is not evidence that the deployed Ask AI pipeline retrieved or generated the same result.

## Canonical inputs

- `docs/rag-golden-dataset.json` is the source of truth for evaluation cases. Its `schema_version` is `1.0`, its `evidence_kind` is `golden-contract`, and `cases` contains q01-q21.
- `docs/rag-golden-fixture.json` contains independent candidate outputs for deterministic offline checks. Its `evidence_kind` is `offline-fixture` and `source_dataset_id` identifies the contract it mirrors. It intentionally covers only q01-q04 and q21.
- `evals/rag/adapters/golden-dataset.mjs` validates both envelopes. `evals/rag/adapters/promptfoo-tests.mjs` converts cases with a `retrieval_contract` into Promptfoo tests, so the Promptfoo YAML does not duplicate q21.

Case IDs and existing expectations are stable regression identifiers. Add a `retrieval_contract` only when the public response contains enough evidence to enforce it. The current contract checks q21 for four university course sources, absence of two unrelated Cloudflare sources, source uniqueness, latency, and an uncached live response.

## Offline checks

Run the baseline scorer against the shared fixture:

```sh
pnpm eval:rag:fixture
```

Run the Promptfoo retrieval contract against the same fixture:

```sh
pnpm test:promptfoo
pnpm eval:promptfoo:fixture
```

Offline results are written under `.work/rag-evals/fixture/`. The baseline keeps four artifacts:

- `baseline-outputs.jsonl`: candidate answer, displayed sources, related items, and done/error payloads
- `baseline-scores.jsonl`: deterministic per-case scores
- `baseline-traces.jsonl`: fixture trace placeholders and allowed trace patterns
- `baseline-report.json`: summary, thresholds, dataset identity, and artifact paths

Promptfoo writes `promptfoo-report.json` beside them. Its fixture provider metadata includes `fixture: true` and `evidenceKind: offline-fixture`.

## Live checks

Start the Astro application with its normal Ask AI bindings, then run:

```sh
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:rag
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:promptfoo
```

The default target is `http://127.0.0.1:4321`; override it with `RAG_EVAL_BASE_URL`. An authenticated admin cookie avoids the public daily question quota during repeated evaluation. Live runners require this cookie and send `cacheMode: bypass`; the API accepts bypass only after the session verifies as an admin. Evaluation requests skip both semantic-cache reads and writes instead of silently grading or storing a cached answer. Live artifacts go under `.work/rag-evals/live/`, separate from fixture output.

For the baseline engine matrix:

```sh
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:rag:matrix
```

Set `RAG_EVAL_ENFORCE=1` (or use the `:ci` baseline scripts) to exit non-zero when aggregate thresholds fail. These commands are local evaluation entry points; they are not proof that a production deployment or scheduled CI run succeeded.

## Evidence boundary

The `/api/chat` stream exposes generated tokens, displayed `sources`, related items, agent-step status, a final `done` payload, and errors. It does not expose the exact retrieved chunks or the full prompt context. Therefore:

- `contextRecall` in the baseline is expected-source URL recall, not a measurement over hidden retrieved context.
- `faithfulness` is a deterministic citation/source alignment heuristic plus forbidden-claim checks, not a model-judged factuality guarantee.
- `baseline-traces.jsonl` records public `agent_step` events only. It must not be described as a full retrieval or model trace.
- A cached response may omit sources and agent steps; q21's Promptfoo contract requires an uncached response for this reason.

To change artifact locations, set `RAG_EVAL_ARTIFACT_ROOT` or the individual `RAG_EVAL_REPORT_PATH`, `RAG_EVAL_OUTPUTS_PATH`, `RAG_EVAL_SCORES_PATH`, and `RAG_EVAL_TRACES_PATH` variables.

## Production incident: q21 course catalog retrieval

### Symptom

The Ask AI question `有哪些課程文章` did not reliably demonstrate that university course guides were being retrieved. The first production q21 observation was served from an older semantic-cache entry, so its missing course links could not prove a failure in the newly deployed retriever.

After semantic-cache generation `retrieval-v2` forced a real first-hit query, retrieval found all four required course maps:

- Stanford: `learning/2026-08-20-stanford-cs-course-map`
- MIT: `learning/2026-08-21-mit-ai-ml-course-map`
- CMU: `learning/2026-08-21-cmu-ai-ml-course-map`
- Berkeley: `learning/2026-08-21-berkeley-ai-ml-course-map`

That run still failed q21 because it took 51.169 seconds, above the 30-second contract. Its public trace showed three Research → Writer → Validation → Critic passes. The evidence changed the diagnosis: source recall was working; the remaining failure was generation and review-loop convergence.

### Diagnosed mechanism

The production trace did not retain raw drafts or every Critic field, so it cannot prove one individual Critic score was the sole root cause. The mechanism most consistent with the code path and observed retries was the mismatch between a metadata-only catalog query and the ordinary recommendation rubric.

q21 is a broad catalog query using metadata-only post evidence. The Writer still treated every `recommendation` intent as a normal recommendation task and requested a concrete reason for every item. That could encourage claims the title-and-URL metadata could not support, while the Critic still evaluated the draft with the ordinary recommendation rubric.

Each retry added Critic gaps to a new query. Before the fix, results from multiple retry queries were deduplicated but not capped globally, so the source set grew from 20 to 26 without improving the required-source result. Each Writer draft was also emitted immediately; because the SSE consumer appends token events, repeated drafts could be concatenated into one visible answer.

The public trace showed Validation completing before every Critic step, but did not expose the validation result or full engine state. Under the deployed/default LangGraph routing, that sequence is consistent with validation passing before Critic; it is not independent proof of the hidden validation field.

### Fix

The q21 repair was delivered across three commits:

- `ff973444`: clean broad catalog queries, use metadata-only post retrieval, deduplicate at the article level, widen Writer context, and make the UI source count document-aware.
- `765f7000`: add authenticated admin-only `cacheMode: bypass`, prevent public eval impersonation, add a 24-hour versioned semantic-cache boundary, require live adapters to use the admin cookie, and check forbidden sources in both source metadata and answer text.
- `b30ac957`: give broad catalog queries a title-plus-exact-link Writer and Critic rubric; cap merged recommendation results at the configured `postLimit` (20 in the deployed/default profile); let a reviewed catalog draft stop after one pass only when validation, citation membership, answer relevance, intent alignment, drift, and ungrounded-claim checks pass; emit only the accepted final response through the shared pipeline facade; advance the cache generation to `retrieval-v3`.

The narrow catalog acceptance does not disable the Critic. A malformed Critic response, unknown citation, fewer than four retrieved citations, low relevance, low intent alignment, drift, or an ungrounded claim still follows the existing retry or fallback path. Only low confidence by itself may be tolerated after all stronger checks pass.

### Production evidence

The first uncached q21 request after the `retrieval-v3` deployment produced:

| Check | Result |
|---|---:|
| Semantic cache | `cached: false` |
| Latency | 26.821 seconds |
| Latency contract | ≤ 30 seconds |
| Required course maps | 4/4 |
| Unique displayed sources | 20/20 |
| Forbidden Cloudflare sources | 0 |
| Pipeline passes | 1 |
| Retrieval contract | 8/8 |

The observed trace was Planner → Research → Writer → Validation → Critic, with no second Research or Writer step. GitHub Actions run `33298638227` proves that commit `b30ac957` passed its gates and deployed; the production response measurements above are the operator observation recorded in commit `a65b801e`. No sanitized raw live-output, score, or trace artifact was committed, so the repository cannot independently recompute those measurements.

This is one production regression observation, not a long-term latency benchmark or a model-graded faithfulness result. It verifies the public q21 contract for that uncached request. It still does not expose raw Writer context, ranked retrieval chunks, or all Critic fields.

### Regression rule

Keep q21 only in `docs/rag-golden-dataset.json`; do not copy its source or latency expectations into Promptfoo YAML or baseline code. Promptfoo and baseline must continue loading it through the shared adapter.

For repeated live checks, use an authenticated admin session with `cacheMode: bypass`. Do not bump the semantic-cache generation merely to run routine evaluation. A public first-hit request is acceptable only as a one-time post-deployment observation when a real retrieval-generation change already requires cache invalidation.
