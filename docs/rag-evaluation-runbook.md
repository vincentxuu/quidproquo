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
