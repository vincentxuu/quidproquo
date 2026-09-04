---
title: "How Ask AI Turns Evidence into an Answer: Writer Context and Citation Contracts"
date: 2026-08-30
category: ai
type: guide
tags: [rag, citation, grounding, prompt-engineering, retrieval, validation]
lang: en
tldr: "Writer sees the first 8 candidates for a factual query or 12 for a recommendation by default. Citations must use an exact `source_url` from that set, and weak or empty retrieval triggers an instruction to abstain rather than fill gaps from model knowledge."
description: "Inspect how Ask AI bounds Writer context, restricts citation URLs, handles catalog and weak-retrieval cases, and separates deterministic URL validation from factuality."
draft: false
series:
  name: "Ask AI in Practice"
  order: 3
---

> 🌏 [中文版](/posts/ai/2026-08-30-ask-ai-writer-citation-contract)

> **Optional companion reading:** Beginners can read this article directly. For background concepts, pair it with [RAG Prompt Engineering: How to Design System Prompts and Context](/posts/ai/2026-03-12-rag-prompt-engineering-en).

Research finding candidates does not mean the model should place every candidate in the answer. Writer faces three constraints: its context window is bounded, factual claims must point to allowed URLs, and insufficient evidence should produce an abstention rather than a polished answer filled from model memory.

Ask AI splits those constraints across two layers. [`writer.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.ts) states the writing contract in the prompt. [`validation.ts`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts) then uses deterministic code to check Markdown structure and URL membership. The prompt defines the content boundary; code enforces the parts of the format boundary that can be checked mechanically.

## Writer sees a bounded evidence context

Writer does not query D1 or Vectorize directly. It takes a prefix of `state.search_results`: eight candidates by default for ordinary intents and twelve for recommendations. A test or another caller can override the result profile, but the implementation clamps it to the range 1–40.

Each context item looks like this:

```text
[Source 1] https://quidproquo.cc/posts/...
Title: Post title
evidence excerpt
Images: https://...   # only when images exist
```

The format preserves `source_url`, title, evidence excerpt, and image URLs. It does not send the complete post, a prose explanation of relevance, or a promise that these are all matching posts on the site. The top-k, ranking, and deduplication choices from the previous article become a concrete visibility boundary here.

## The citation contract limits what Writer may cite

The Writer system prompt requires the answer to:

- resolve the question directly before adding detail;
- ground factual claims only in the provided sources;
- use inline `[readable label](source_url)` citations;
- copy `source_url` exactly from context rather than construct or rewrite it;
- avoid bare URLs and a separate reference dump because the UI renders retrieved sources;
- state uncertainty or missing evidence instead of guessing.

A prompt cannot guarantee compliance. Its purpose is to define a successful answer precisely enough for deterministic validation to catch URL violations and for Critic to review drift and unsupported claims.

## Catalog lookup and ordinary recommendation need different rules

“Recommend a few posts for learning RAG” can include a reason for each post when the evidence excerpt supports it. “What course articles are there?” may use metadata-only retrieval. If Writer has only titles and URLs, requiring a recommendation reason encourages it to invent detail the evidence does not contain.

Broad catalog queries therefore receive a narrower contract: list matching titles and exact links, do not invent reasons from metadata, and do not claim that the result is the complete site catalog. An ordinary recommendation still asks for reasons, but only when evidence supports them.

This is not a stylistic preference. The evidence has a different shape, so the safe answer must shrink to what that evidence can support.

## Writer must back off when evidence is unreliable

The code defines `hasReliableEvidence` with two conditions: `search_results` is non-empty and `needs_web_search` is false. If either fails, the prompt explicitly says not to answer from general knowledge and to return a concise knowledge-base limitation instead.

That remains prompt-level behavior, not a proof. Writer can still violate the instruction, which is why the pipeline includes Validation, Critic, and fallback. This article stops at Writer and the citation contract; the next one separates those later gates.

## What deterministic validation actually checks

[`validateDraft`](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts) combines three checks:

1. Markdown code fences are balanced and link syntax is not obviously malformed.
2. Citation URLs belong to `search_results.source_url`, and images belong to retrieved image metadata.
3. Mermaid blocks are closed and start with a supported diagram type.

Relative links are normalized against `https://quidproquo.cc` before comparison. Any unknown citation fails validation, after which the graph follows its retry budget toward Research or fallback.

URL membership can stop the model from citing a location absent from retrieval state. It cannot establish that every sentence before the link is supported by that source. That is a content-level question for Critic and evaluation; `validation.passed` is not a complete factuality guarantee.

## Reproduce the Writer and citation checks

```sh
pnpm exec vitest run \
  src/lib/retrieval/agents/writer.parity.test.ts \
  src/lib/retrieval/agents/validation.test.ts \
  src/lib/conversation/pipeline.test.ts
```

These tests cover the weak-evidence abstention prompt, recommendation and catalog routing, the twelve-source window, rejection of unknown URLs, Mermaid structure, and emission of only the accepted final answer. They use fixture state and a mocked model; they do not measure production generation quality.

You can also locate the core prompt rules directly:

```sh
rg -n "EXACT source_url|does not answer from general knowledge|article catalog lookup" \
  src/lib/retrieval/agents/writer.ts
```

## Evidence boundary

The repository establishes the prompt, context truncation, deterministic URL validation, and their tests. It does not prove that a model always follows the prompt. Displayed sources do not reconstruct the full Writer context, and URL membership is not sentence-level factuality.

The conservative interpretation of a production response is: “This URL appeared in the public source set for the run, and the answer link passed the membership gate.” Claiming that a particular sentence was supported by a particular chunk requires the retained raw context. The public SSE interface does not expose it.

## References

- [Ask AI Writer](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.ts)
- [Deterministic validation](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.ts)
- [Writer parity tests](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/writer.parity.test.ts)
- [Validation tests](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/retrieval/agents/validation.test.ts)
- [Final-response pipeline facade](https://github.com/vincentxuu/quidproquo/blob/main/src/lib/conversation/pipeline.ts)
