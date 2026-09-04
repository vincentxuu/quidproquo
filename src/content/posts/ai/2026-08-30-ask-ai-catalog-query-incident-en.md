---
title: "Why Ask AI Could Not List Its Course Maps: A Catalog Retrieval and Convergence Incident"
date: 2026-08-30
category: ai
type: debug
tags: [rag, retrieval, evaluation, semantic-cache, langgraph, cloudflare]
lang: en
tldr: "The first observation of 'What course articles do you have?' was contaminated by an old cache entry. A real cache miss retrieved all four university maps but spent 51.169 seconds across three Writer and Critic passes; after catalog-specific retrieval and review fixes, one uncached production observation passed q21 in 26.821 seconds."
description: "A reconstruction of Ask AI's q21 course-catalog incident, from stale semantic cache and metadata-only retrieval to bounded retries, catalog-specific review, and one-pass convergence."
draft: false
series:
  name: "Ask AI in Practice"
  order: 8
---

> 🌏 [中文版](/posts/ai/2026-08-30-ask-ai-catalog-query-incident)

> **Optional companion reading:** Beginners can read this article directly. For extra context, see [Query Classification](/posts/ai/2026-03-12-query-classification-adaptive-routing-en) and [Agentic RAG](/posts/ai/2026-03-12-agentic-rag-react-loop-en).

When Ask AI received “What course articles do you have?”, the site already contained Stanford, MIT, CMU, and Berkeley course maps, and the production index was not empty. The first response that looked like retrieval failure came from an older semantic-cache entry. Once a real first-hit request ran, all four required sources were retrieved, yet the request still missed its latency contract.

The incident changed once “Did retrieval find the articles?” was separated from “Could generation and review converge in one pass?” The full contract and operator evidence are documented in the [Ask AI evaluation runbook](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md).

## A catalog query resembles recommendation but needs a different contract

The Planner treats “What course articles do you have?” as recommendation intent, but the user is asking for a catalog. Ordinary recommendation requires evidence for why each item is useful. A catalog lookup needs titles and exact links.

That difference affects every stage:

- Retrieval should prefer article metadata rather than require chunks that support recommendation reasons.
- The Writer should list the current matches without claiming they are the complete site catalog.
- The Critic should judge title and URL membership, not demand claims that metadata cannot support.

The old path applied one general recommendation rubric to both jobs. Retrieval could be correct while generation repeatedly judged its own answer insufficient.

## The first observation was contaminated by stale cache

The earliest production q21 response missed required course links, but `done.cached` showed that it came from an older cache entry. That response could not establish a failure in the new retriever because Research did not run for the request.

After semantic-cache generation `retrieval-v2` forced a first hit, the system found all four required maps:

- [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map)
- [MIT AI/ML course map](/posts/learning/2026-08-21-mit-ai-ml-course-map)
- [CMU AI/ML course map](/posts/learning/2026-08-21-cmu-ai-ml-course-map)
- [Berkeley AI/ML course map](/posts/learning/2026-08-21-berkeley-ai-ml-course-map)

The request still failed for a different reason: it took 51.169 seconds, above q21's 30-second limit. Public `agent_step` events showed three Research → Writer → Validation → Critic passes.

## Why three retries did not improve the answer

The Writer required a concrete recommendation reason for every item whenever intent was `recommendation`. Course-catalog retrieval supplied title and URL metadata, not enough content to support a reason for each post. The Critic then applied the ordinary recommendation rubric and could request coverage that the metadata could not provide.

Each retry appended Critic gaps to another search query. The [Research node](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/research.ts) deduplicated results across retries but did not apply a global `postLimit` after merging. The source set grew from twenty to twenty-six without supplying the missing evidence, increasing prompt and review cost instead.

There was also an output-boundary bug. Earlier engines emitted every Writer draft immediately. Because the client appends token events, three drafts could appear as one concatenated answer. The [shared pipeline facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts) now suppresses intermediate drafts and emits only the accepted `final_response`.

The production trace did not retain raw drafts or every Critic field, so it cannot prove that one confidence score was the sole root cause. The confirmed evidence consists of public stages, latency, and sources. The rubric mismatch is the mechanism most consistent with the code path and observed retries.

The deployed default used LangGraph routing. Public stages showed Validation completing before Critic on every pass, which is consistent with that code path but does not independently reveal the hidden validation result.

## The repair arrived in three commits

First, [`ff973444`](https://github.com/vincentxuu/quidproquo/commit/ff973444) removed generic catalog filler from search queries, routed broad catalog requests to metadata-only post retrieval, deduplicated at article level, and widened Writer context. The UI's Research count was changed to count distinct documents rather than chunks.

Second, [`765f7000`](https://github.com/vincentxuu/quidproquo/commit/765f7000) added admin-only `cacheMode: bypass`. Live evaluation requires an authenticated admin cookie; public callers cannot impersonate evaluation to bypass cache or quota. The same change versioned and bounded semantic cache and checked forbidden sources in both source metadata and answer text.

Third, [`b30ac957`](https://github.com/vincentxuu/quidproquo/commit/b30ac957) added catalog-specific Writer and Critic rubrics, a post-merge `postLimit`, and a narrow one-pass acceptance rule. Acceptance still requires:

- Deterministic Validation passing.
- Every cited URL belonging to the current retrieval set.
- At least four distinct post sources.
- Passing answer-relevance and intent-alignment checks.
- No drift or ungrounded claim.

Malformed Critic output, unknown citations, and fewer than four sources still retry. Only low confidence by itself can be tolerated after all stronger checks pass.

## The incident became the q21 contract

q21 in [`docs/rag-golden-dataset.json`](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-dataset.json) is the single source of truth. It requires the four university maps, forbids two unrelated Cloudflare posts, requires at least four distinct sources, caps latency at thirty seconds, and requires `done.cached` to be `false`.

Run deterministic fixtures first to verify adapters, scoring, and assertion wiring:

```bash
pnpm eval:rag:fixture
pnpm test:promptfoo
pnpm eval:promptfoo:fixture
```

Then run live checks against normally started Ask AI with an admin cookie:

```bash
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:rag
RAG_EVAL_COOKIE='admin-session-cookie' pnpm eval:promptfoo
```

Routine evaluation should not bump the cache generation. Authorized `cacheMode: bypass` already skips both semantic-cache reads and writes.

## What the production observation actually passed

After the `retrieval-v3` deployment, the first uncached q21 operator observation completed in 26.821 seconds. It included all four required course maps, displayed twenty distinct sources, and included neither forbidden Cloudflare post. The public stage sequence was a single Planner → Research → Writer → Validation → Critic pass.

GitHub Actions run `33298638227` proves that commit `b30ac957` passed repository gates and deployed. The response measurements are an operator observation recorded in [`a65b801e`](https://github.com/vincentxuu/quidproquo/commit/a65b801e).

The repository does not contain a sanitized raw live output, score, or trace artifact from that request, so a third party cannot recompute the measurements from git alone. This is one production regression observation, not a long-term latency benchmark or model-graded faithfulness result. It does not reveal raw ranked chunks, the full Writer context, or every Critic field.

## What changed in the diagnosis

A catalog query needs a contract centered on titles and exact links. Applying an ordinary recommendation rubric made correct retrieval spin through generation and review.

The incident record also preserves each change in diagnosis: a cached answer could not test the new retriever; retrieving four sources moved the problem from recall to convergence; one production pass proves only that request's public contract. Those boundaries point the next investigation to the correct layer.

## References

- [Ask AI RAG evaluation runbook and q21 incident](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md)
- [q21 golden retrieval contract](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-golden-dataset.json)
- [Catalog query strategy](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/query-strategy.ts)
- [Research retry, metadata-only retrieval, and result cap](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/research.ts)
- [Catalog Writer instructions](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.ts)
- [Catalog Critic acceptance rules](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/critic-routing.ts)
