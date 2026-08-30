---
title: "Evaluating Ask AI Retrieval: Golden Contracts, Fixtures, Live Runs, and Evidence Boundaries"
date: 2026-08-30
category: ai
type: guide
tags: [rag, evaluation, promptfoo, retrieval, regression-testing]
lang: en
tldr: "Ask AI keeps golden contracts, offline fixtures, live SSE output, and production observations separate. A passing fixture proves harness reproducibility; public sources can measure expected-source recall, but they do not expose hidden ranked chunks or establish model-graded faithfulness."
description: "A practical guide to Ask AI's q01–q21 dataset and Promptfoo retrieval contract, with repeatable commands and explicit boundaries between fixture, live, and production evidence."
draft: true
series:
  name: "Ask AI in Practice"
  order: 9
---

> 🌏 [中文版](/posts/ai/2026-08-30-ask-ai-retrieval-evaluation)

> **Optional companion reading:** Beginners can read this article directly. For extra context, see [RAG Evaluation Frameworks and Tool Selection](/posts/ai/2026-03-12-rag-evaluation-frameworks-en) and [RAG A/B Testing](/posts/ai/2026-03-12-rag-ab-testing-en).

RAG evaluation often starts with an attractive score table that does not say whether its inputs came from fixtures, development, or production. Ask AI resolves the evidence kind before scoring: a golden contract states expectations, an offline fixture checks the harness, a live runner captures public SSE, and production observations retain separate deployment and operator evidence.

This article follows the [Ask AI evaluation runbook](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md). You can copy its directory structure, commands, and artifact boundaries, but it will not manufacture raw ranked chunks that the public API never exposed.

## Keep four evidence layers in separate buckets

| Layer | Repository form | What it can prove |
|---|---|---|
| Golden contract | `docs/rag-golden-dataset.json` | Stable queries, answer points, expected sources, and forbidden claims |
| Offline fixture | `docs/rag-golden-fixture.json` | Reproducible adapter, scorer, and Promptfoo assertions on fixed inputs |
| Live output | `.work/rag-evals/live/` | Public SSE behavior from one target endpoint |
| Production observation | Runbook plus deployment evidence | An operator observation of one deployed version |

[`rag-golden-dataset.json`](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-dataset.json) currently uses schema `1.0` and case IDs q01 through q21. IDs and existing expectations are regression identifiers and should not be renumbered when wording changes.

The fixture contains independent candidate output for q01–q04 and q21 only. It does not pretend to call Ask AI and is not a production sample. The [dataset adapter](https://github.com/vincentxuu/quidproquo/blob/main/evals/rag/adapters/golden-dataset.mjs) validates schema, unique IDs and queries, and retrieval-contract fields.

## Start offline to verify the measuring tool

The baseline fixture writes candidate output, per-case scores, public-trace placeholders, and a summary report:

```bash
pnpm eval:rag:fixture
```

Default output:

```text
.work/rag-evals/fixture/
├── baseline-outputs.jsonl
├── baseline-scores.jsonl
├── baseline-traces.jsonl
├── baseline-report.json
└── promptfoo-report.json
```

Test Promptfoo's dataset adapter, provider, and assertion before evaluating its fixture:

```bash
pnpm test:promptfoo
pnpm eval:promptfoo:fixture
```

A passing fixture means the fixed candidate satisfies the current contract. It catches schema drift, duplicated expectations, scorer regressions, and broken Promptfoo wiring. It does not show that D1 or Vectorize retrieved the same material, and it does not test current model generation.

## A live runner must parse SSE as a stream

After starting Astro with normal Ask AI bindings, provide an authenticated admin cookie:

```bash
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:rag
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:promptfoo
```

The default target is `http://127.0.0.1:4321`; override it with `RAG_EVAL_BASE_URL`. Live requests set `traceScope: eval` and `cacheMode: bypass`. The API grants those capabilities only to an admin and skips both semantic-cache reads and writes.

[`eval-rag-baseline.mjs`](https://github.com/vincentxuu/quidproquo/blob/main/scripts/eval-rag-baseline.mjs) uses a stream reader to parse `token`, `sources`, `related`, `agent_step`, `done`, and `error`. Treating SSE as ordinary JSON with `response.text()` loses event boundaries and behaves poorly for long streams.

Live artifacts go under `.work/rag-evals/live/`, separate from fixtures. To compare pipeline engines:

```bash
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:rag:matrix
```

Only `RAG_EVAL_ENFORCE=1` makes aggregate threshold failures exit non-zero. These are local evaluation entry points. They do not by themselves prove that scheduled CI or a production deployment succeeded.

## Interpret the baseline metric names by their implementation

The baseline reports `contextRecall`, `answerRelevance`, and `faithfulness`, but their names must not outrun the data.

`contextRecall` measures how many expected source locators appear in public `sources`. The API does not expose hidden retrieved context, so this is not chunk-level context recall.

`answerRelevance` uses token coverage over expected answer points and applies a forbidden-claim gate. It is useful for deterministic regression, not a substitute for human semantic review.

`faithfulness` combines two observable checks: whether displayed sources align with expected sources and whether answer citation URLs belong to the displayed source set. Forbidden claims force failure. This is a citation and source-alignment heuristic, not a model judgment of whether every sentence is entailed by evidence.

`baseline-traces.jsonl` records public `agent_step` events only. It must not be described as a complete retrieval or model trace.

## q21 shows when a retrieval contract is justified

An ordinary golden case can stop at answer points, expected sources, and forbidden claims. Add `retrieval_contract` only when the public response exposes enough signals to enforce it.

The q21 question “What course articles do you have?” checks that:

- Stanford, MIT, CMU, and Berkeley course maps all appear.
- Two unrelated Cloudflare posts appear in neither sources nor answer.
- At least four sources are distinct.
- Latency remains within thirty seconds.
- `done.cached` is `false`.

Promptfoo does not duplicate those values. [`promptfoo-tests.mjs`](https://github.com/vincentxuu/quidproquo/blob/main/evals/rag/adapters/promptfoo-tests.mjs) builds tests from the golden dataset and hands the contract to a deterministic assertion. Change q21 in the dataset only, so baseline and Promptfoo do not drift into separate truths.

## Add a case from a new incident

Suppose another Chinese short query returns no sources. Preserve a publicly reproducible query, then define the contract:

1. Assign a stable ID that will not be reused.
2. Describe the answer points a reader needs; do not freeze one model's exact wording.
3. Add only expected sources that public `sources` can verify.
4. Add claims or sources that previously leaked into the answer as forbidden items.
5. Add `retrieval_contract` only when latency, cache, and source uniqueness are publicly observable.
6. Create an independent fixture candidate; do not copy live output into a fixture and call it independent validation.

After editing the dataset, run:

```bash
pnpm exec node --test \
  evals/rag/adapters/golden-dataset.test.mjs \
  evals/rag/provider.test.mjs \
  evals/rag/assertions.test.mjs

pnpm exec node --test scripts/eval-rag-baseline.test.mjs
```

Then run fixture and live checks. Use `RAG_EVAL_ARTIFACT_ROOT` to relocate all artifacts, or override individual report, output, score, and trace paths.

## The q21 production evidence stops at the public contract

After `retrieval-v3` deployed, one uncached q21 observation passed the four required sources, zero forbidden sources, source uniqueness, and latency contract in one public stage sequence. That record supports the public contract for that request and deployed version.

The repository does not contain sanitized raw live output, score, or trace artifacts from the observation, so the 26.821-second measurement and eight checks cannot be recomputed from git alone. It contains no raw ranked chunks, complete Writer context, or every Critic field. The observation is not a long-term latency benchmark and is not model-graded faithfulness.

An independently auditable production report should preserve scrubbed `baseline-outputs.jsonl`, `baseline-scores.jsonl`, `baseline-traces.jsonl`, and dataset identity. User content and session cookies require data minimization and secret scrubbing before any artifact is retained.

## Promotion gates should read artifacts, not impressions

Before promoting a retrieval change, verify that:

- Dataset schema and case IDs have not drifted.
- The fixture harness passes.
- A live run records `cached: false` and writes to the live artifact directory.
- Aggregate thresholds pass for the selected engine.
- Incident-specific retrieval contracts pass.
- Public sources and agent steps are not described as hidden context or a full trace.

The useful part of this workflow is not another score. Every score retains an evidence kind, dataset ID, and artifact path. When the API does not expose a signal, say that it was not measured; expand the API or trace contract only when the next investigation requires it.

## References

- [Ask AI RAG evaluation runbook](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md)
- [Golden dataset q01–q21 and q21 retrieval contract](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-dataset.json)
- [Independent offline fixture](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-fixture.json)
- [Golden dataset adapter](https://github.com/vincentxuu/quidproquo/blob/main/evals/rag/adapters/golden-dataset.mjs)
- [Promptfoo test generation](https://github.com/vincentxuu/quidproquo/blob/main/evals/rag/adapters/promptfoo-tests.mjs)
- [Baseline live and fixture runner with deterministic scoring](https://github.com/vincentxuu/quidproquo/blob/main/scripts/eval-rag-baseline.mjs)
