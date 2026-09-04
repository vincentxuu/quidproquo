---
title: "When Ask AI May Show Sources: Validation, Critic Review, Degradation, and the Source Gate"
date: 2026-08-30
category: ai
type: guide
tags: [rag, validation, citations, retrieval]
lang: en
tldr: "Ask AI finding a post does not mean the UI should display it as a source. An answer must pass deterministic Markdown and URL validation, then the Critic's relevance, intent, and grounding checks; if either gate fails, source cards are withheld."
description: "A code-level walkthrough of Ask AI's Writer, Validation, Critic, retry and degradation routing, and final source-presentation gate."
draft: false
series:
  name: "Ask AI in Practice"
  order: 4
---

> 🌏 [中文版](/posts/ai/2026-08-30-ask-ai-source-gating)

> **Optional companion reading:** Beginners can read this article directly. For background concepts, pair it with [Self-Reflection + LLM-as-Judge: Having AI Evaluate Its Own Answers](/posts/ai/2026-03-12-self-reflection-llm-as-judge-en) and [RAG Guardrails: Adding a Defense Layer to Inputs and Outputs](/posts/ai/2026-03-12-rag-guardrails-en).

When Ask AI's Research stage finds twenty posts, the browser does not immediately receive twenty source cards. Retrieved results are candidate evidence. The Writer's answer, the links inside that answer, and the source list sent to the UI each have a separate acceptance gate.

This article follows [Ask AI's source-presentation code](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/presentation.ts) end to end. The goal is to separate three questions that are easy to conflate: Is the output structurally valid? Is the answer grounded enough? May the UI expose the retrieved links?

## What the three gates protect

A response moves through Writer, Validation, Critic, and finally the Source Gate.

```text
search_results
    │
    ▼
Writer ── produces a draft and inline citations
    │
    ▼
Validation ── Markdown, Mermaid, citation URL membership
    │
    ▼
Critic ── relevance, intent alignment, drift, ungrounded claims
    │
    ├─ failed below limit → Research retries, Writer rewrites
    ├─ failed at limit    → fallback / degradation
    └─ passed             → accepted final response
                              │
                              ▼
                         Source Gate
```

The [Writer](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.ts) is instructed to cite only the exact `source_url` values supplied in `search_results`. That is still a model instruction, not an enforcement boundary, so two independent checks follow it.

## Validation handles deterministic failures

The [Validation node](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts) does not invoke a model. It checks whether:

- Markdown code fences are balanced.
- Markdown links and images can be parsed.
- Mermaid blocks are complete and begin with a supported diagram type.
- Every citation URL appears in `search_results`; image URLs must also come from retrieved image metadata.

URL membership is the critical check. A model can invent a plausible URL that happens to exist on the site, but Validation still reports `Unknown citation URL` when that URL was not retrieved for this request.

This proves that a citation belongs to the request's allowed set. It does not prove that the page supports the sentence. URL validity and evidentiary support are different claims.

## The Critic checks whether the answer fits the question

The [Critic](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/critic.ts) receives the question, draft, and a bounded set of retrieved evidence. It returns five signals: `confidence`, `answer_relevance`, `intent_alignment`, `drift_detected`, and `ungrounded_claims`.

The [routing rules](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/critic-routing.ts) treat low confidence, insufficient relevance or intent alignment, drift, and any ungrounded claim as failures. A malformed Critic response is not partially trusted; it becomes a review failure.

The Critic is a model judgment and can vary. It adds semantic quality signals to routing. It does not replace deterministic Validation or constitute an external fact-check.

## Retry and degradation do not smuggle sources through

Ordinary queries allow up to three draft attempts. If Validation or Critic review fails below the limit, the Critic's gaps are added to another Research query and the Writer tries again. At the limit, the flow switches to fallback or degradation.

Broad catalog queries have one narrow early-acceptance rule. For a question such as “What course articles do you have?”, an already reviewed draft may stop after one pass only when Validation passes, at least four distinct retrieved post URLs are cited, and relevance, intent alignment, drift, and ungrounded-claim checks all pass. The rule tolerates low confidence alone; unknown URLs, fewer than four sources, malformed review output, or drift still fail.

Early acceptance and source presentation remain separate decisions. A catalog draft may stop retrying after the stronger checks pass, while the final Source Gate still treats low confidence as Critic failure. The text can therefore be accepted without source cards being emitted.

The final UI rule is `shouldExposeRetrievedLinks()`:

```ts
return state.search_results.length > 0
  && !hasValidationFailure(state.validation)
  && !hasCriticFailure(state.critique)
```

`search_results.length > 0` answers only whether candidates exist. If either quality gate fails, [`/api/chat`](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts) emits no `sources` SSE event.

## Verify four states locally

Run the targeted source-gate and Critic-routing tests first:

```bash
pnpm exec vitest run \
  src/lib/retrieval/presentation.test.ts \
  src/lib/retrieval/agents/critic.test.ts \
  src/lib/retrieval/agents/validation.test.ts
```

At minimum, cover empty results, Validation failure, Critic failure, and both gates passing. Catalog tests should also cover an unknown citation, fewer than four distinct sources, drift, and malformed Critic output.

When reading SSE manually, record event types separately instead of checking only whether cards appear:

```bash
curl -N -X POST http://127.0.0.1:4321/api/chat \
  -H 'Content-Type: application/json' \
  --data '{"message":"What course articles do you have?"}'
```

A completed `Research` event proves only that the retrieval stage ran. A `sources` event proves that the final source gate passed. The public stream does not expose raw retrieved chunks, the complete Writer context, or every Critic field.

## The remaining boundary

The Source Gate prevents the UI from presenting candidates as endorsement after an answer has failed review. It does not turn sources into independently verified facts:

- Validation checks URL membership, not textual entailment.
- Critic review is model-based, not human review or external fact-checking.
- `sources` is a post-gate display list, not a complete ranked retrieval trace.
- A semantic-cache hit may return only `token` and `done`, without replaying sources or agent steps.

During debugging, identify which gate failed before changing retrieval, the Writer prompt, Validation, or the Critic rubric. Looking only at whether posts were found misses the second half of the pipeline.

## References

- [Ask AI presentation source gate](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/presentation.ts)
- [Deterministic draft validation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts)
- [Critic routing and catalog acceptance](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/critic-routing.ts)
- [Ask AI chat API and SSE events](https://github.com/vincentxuu/quidproquo/blob/main/src/pages/api/chat.ts)
- [Ask AI evaluation runbook](https://github.com/vincentxuu/quidproquo/blob/main/docs/rag-evaluation-runbook.md)
