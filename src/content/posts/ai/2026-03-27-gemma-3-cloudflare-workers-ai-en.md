---
title: "Gemma on Cloudflare Workers AI: A Pragmatic Choice for Traditional Chinese Applications"
date: 2026-04-28
type: guide
category: ai
tags: [gemma, cloudflare-workers-ai, llm, traditional-chinese]
lang: en
tldr: "For running Traditional Chinese LLM workloads on Cloudflare Workers AI, the Gemma family follows instructions more reliably than same-tier Llama models. gemma-3-12b-it was marked deprecated on 2026-05-30; the current equivalent is gemma-4-26b-a4b-it: 256K context, Vision, Function calling, at $0.10 / $0.30 per M tokens."
description: "Why pick Gemma over Llama on Cloudflare Workers AI, how to use it, its limitations and trade-offs, and real observations from the nobodyclimb Traditional Chinese RAG system. After gemma-3-12b-it's 2026-05-30 removal, this post centers on gemma-4-26b-a4b-it and includes migration notes."
draft: false
series:
  name: "Cloudflare AI Stack"
  order: 3
---

> 🌏 [中文版](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)

Choosing an LLM isn't about picking "the most powerful one" -- it's about picking "the one that works within your constraints." nobodyclimb runs on Cloudflare Workers, and AI inference stays within the Cloudflare ecosystem. Under that constraint, the Gemma family has consistently been the smoothest option for Traditional Chinese.

> **Model status (2026-08)**: this post was originally built around `@cf/google/gemma-3-12b-it`, which Workers AI marked deprecated on 2026-05-30 (the model page and its pricing are still up, but it is on the way out). The current equivalent is `@cf/google/gemma-4-26b-a4b-it`, and every example here has been updated to Gemma 4. The three reasons for choosing Gemma over Llama still hold for Gemma 4, so that analysis stays.

## What Is Cloudflare Workers AI

Cloudflare Workers AI is Cloudflare's inference service that lets you call hosted models directly from the Workers environment without managing GPU infrastructure. Billing is token-based.

Supported models span text generation, embedding, image generation, speech-to-text, and more. On the LLM side, mainstream open-source families currently available include Gemma, Llama, Qwen, GLM, gpt-oss, and Kimi.

```typescript
// In the Workers environment, bindings work like this
const response = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
  messages: [
    { role: "system", content: "You are an AI assistant for a Taiwan rock climbing community." },
    { role: "user", content: "What routes at Longdong are suitable for beginners?" }
  ],
  max_tokens: 1024,
  stream: true,
});
```

Compared to running your own inference service, the benefits are obvious: no GPU management, no model-serving ops work, and it sits in the same environment as your other Workers bindings (D1, KV, Vectorize).

## Why Gemma, Not Llama

nobodyclimb started on `llama-3.1-8b-instruct` and later moved to what was then `gemma-3-12b-it`. The three reasons for that switch are still the reasons to pick Gemma 4 today:

**Traditional Chinese instruction following**: Llama 3.1 8B produced inconsistent Traditional Chinese — occasionally mixing in Simplified characters, or ignoring formatting instructions in the system prompt (for example, "include source links in your answer"). Gemma is noticeably more reliable here.

**Parameter count**: the gap between 12B and 8B is felt in RAG question answering — give the model five retrieved documents and the larger one integrates information across all of them instead of leaning on the first couple. Gemma 4 pushes this further with MoE: 26B total parameters, roughly 4B active per inference.

**Gemma's multilingual training**: Google's Gemma training data has broader multilingual coverage, with a higher proportion of Chinese (including Traditional) than Llama 3.1's published training setup.

None of this says Llama is bad — it says that for this specific use case, Traditional Chinese RAG, Gemma fits better. Worth noting: both model IDs in that original comparison were marked deprecated in the same 2026-05-30 wave. [The official wording](https://developers.cloudflare.com/workers-ai/changelog/) is *will be deprecated* — their pages and prices are still up, but neither is what you start a new project on.

## Basic Usage

**Non-streaming (good for evaluation and background jobs):**

```typescript
const result = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userQuery }
  ],
  max_tokens: 512,
});

const answer = result.response; // string
```

**Streaming (good for user interfaces):**

```typescript
const stream = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
  messages: [...],
  stream: true,
});

// Paired with Hono's streamSSE
return streamSSE(c, async (sseStream) => {
  for await (const chunk of stream) {
    if (chunk.response) {
      await sseStream.writeSSE({ data: chunk.response });
    }
  }
});
```

**JSON output (good for structured tasks like judge and filter-build):**

```typescript
const result = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
  messages: [
    {
      role: "system",
      content: "Respond in JSON with the shape { score: number, reason: string }"
    },
    { role: "user", content: `Evaluate the quality of this answer: ${answer}` }
  ],
  response_format: { type: "json_object" },
  max_tokens: 256,
});

const evaluation = JSON.parse(result.response);
```

## How nobodyclimb Uses It

Several pipeline steps in the system call the LLM:

| Step | Task | Output type |
|------|------|-------------|
| HyDE | Generate a hypothetical answer document | Plain text |
| multi-query | Expand the query into multiple angles | JSON array |
| filter-build | Extract structured search filters | JSON object |
| llm-generation | Final answer generation | Plain text (streamed) |
| judge | Evaluate answer quality | JSON object |
| agenticDecision | Decide whether the information is sufficient | JSON boolean + reasoning |

One model, different prompt engineering, wildly different tasks. That is a deliberate choice to let one capable model handle everything rather than picking the smallest sufficient model per task — on Cloudflare Workers AI, that is simply easier to manage.

## Cloudflare Workers AI Limitations

Not spelling these out leads to painful surprises later:

**CPU time limits**: Workers have a CPU time cap (30 seconds on the Paid plan, though AI calls count against wall time rather than CPU time). A pipeline with several LLM calls (HyDE + generation + judge) can exceed the Workers execution limit in aggregate. nobodyclimb handles this by writing judge results asynchronously (not blocking the main flow) and enabling HyDE only for complex queries.

**Models get retired, and versions are opaque**: Cloudflare manages model versions, you cannot pin a specific checkpoint, and behavior can change without notice. Worse, entire model IDs get put on a retirement track. The 2026-05-30 sweep marked 18 IDs deprecated at once, including the whole Llama 2/3/3.1 line, Mistral 7B, and Gemma 3 12B. The implication is that model IDs should not be scattered as string literals throughout your code — collapse them into a single constant or config value so a swap touches one place. You also want monitoring that detects output quality regressions.

**No fine-tuning**: hosted models on Workers AI cannot be fine-tuned today. Domain adaptation has to come from prompt engineering and RAG.

**Cold start latency**: during low-traffic periods the first call can be noticeably slower. A semantic cache mitigates this (a cache hit skips the LLM entirely).

**Check the model page for the context window**: it varies a lot between models, and the number on the Workers AI model page — not the upstream model's spec — is what applies. `gemma-4-26b-a4b-it` is 256,000 tokens, `glm-4.7-flash` is 131,072, and `gemma-3-12b-it` was 80,000 before removal. Size your long conversations and retrieval sets against the real limit.

## Comparison with Other Options

| | gemma-4-26b-a4b-it (Workers AI) | glm-4.7-flash (Workers AI) | OpenAI GPT-4o-mini | Self-hosted Ollama |
|---|---|---|---|---|
| Traditional Chinese quality | Good | Good | Very good | Depends on model |
| Context window | 256K tokens | 131K tokens | 128K tokens | Depends on model |
| Vision | Yes | No | Yes | Depends on model |
| Function calling | Yes | Yes | Yes | Depends on model |
| Ops cost | Zero | Zero | Zero | High |
| Latency | Fast (MoE, 4B active) | Fast | Low | Depends on hardware |
| Flexibility | Low | Low | Medium | High |
| Price (per M tokens) | $0.10 / $0.30 | $0.06 / $0.40 | Token-based | Fixed hardware cost |

If Traditional Chinese quality is your top priority, the GPT-4o family is still stronger. But if you are already in the Cloudflare ecosystem and don't want to maintain another AI service account and API key, Workers AI is the smoothest path.

Within that ecosystem, the split between Gemma 4 and GLM-4.7-Flash is roughly: pick Gemma 4 when you need vision or a very full context window, and pick GLM for text-only conversations where input greatly outweighs output (input is only $0.06, though output costs a bit more).

## Real-World Observations

After several months of use:

- Traditional Chinese instruction following is more stable than Llama; formatting requirements in the system prompt (cite sources, emit JSON) are generally respected
- Occasional hallucinations are caught by the judge + self-reflection mechanism, retrying when groundedness falls below 0.5
- 12B inference was not fast — first streamed token typically at 1-2 seconds, full answers (300-500 words) around 5-8 seconds; Gemma 4 improves this since only 4B is active
- JSON output mode is stable; `response_format: { type: "json_object" }` rarely returns malformed output

Overall: under the constraint of "don't leave the Cloudflare ecosystem," this is the best Traditional Chinese LLM option available.

## Migrating from Gemma 3 to Gemma 4

`@cf/google/gemma-3-12b-it` was marked deprecated on 2026-05-30. Cloudflare suggested three replacements: `@cf/zai-org/glm-4.7-flash` (fast tool calling), `@cf/google/gemma-4-26b-a4b-it` (efficient open model), and `@cf/moonshotai/kimi-k2.6` (agentic plus vision, but requires a paid plan). Coming from Gemma 3, Gemma 4 is the most direct move.

**Architecture change: MoE**
Gemma 4 uses a Mixture-of-Experts architecture. 26B total parameters, but only about 4B activate per inference (a4b = active 4 billion). It is faster than Gemma 3 12B in practice while performing better on most tasks.

**256K context window**
Gemma 3 was served at 80K on Workers AI; Gemma 4 is 256K. For RAG workloads that stuff in large retrieval sets, that is real headroom.

**Vision support**
You can pass images for visual understanding, useful for applications that analyze screenshots or charts.

**Function calling**
Native tool calling is more reliable than forcing JSON through prompt engineering, which suits agentic workflows.

**And it is cheaper**
Gemma 3 was $0.35 / $0.56 per M input/output tokens; Gemma 4 is $0.10 / $0.30. The upgrade does not cost you anything on the bill.

```typescript
// Migration is a model ID swap; the calling interface is identical
const response = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
  messages: [
    { role: "system", content: "You are an AI assistant for a Taiwan rock climbing community." },
    { role: "user", content: "What routes at Longdong are suitable for beginners?" }
  ],
  max_tokens: 1024,
  stream: true,
});
```

An identical interface does not mean identical output. Re-run your prompt evaluation after the swap — JSON formatting instructions that lean on few-shot examples or specific phrasing are the first thing to break when the model changes.

## Update Log

- 2026-08-18: `gemma-3-12b-it` was marked deprecated on 2026-05-30; all examples updated to `gemma-4-26b-a4b-it`, with a new migration section and a GLM-4.7-Flash comparison. Two factual corrections: Gemma 3's context window on Workers AI was 80,000 tokens (previously stated as 8192), and Gemma 3 did have published pricing at $0.35 / $0.56 per M tokens (previously stated as unpublished).

## References

- [Cloudflare Workers AI documentation](https://developers.cloudflare.com/workers-ai/)
- [Workers AI model catalog](https://developers.cloudflare.com/workers-ai/models/)
- [Workers AI changelog: the 2026-05-30 deprecations and recommended replacements](https://developers.cloudflare.com/workers-ai/changelog/)
- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
- [Workers AI: gemma-4-26b-a4b-it model page](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/)
- [Workers AI: gemma-3-12b-it model page (marked Deprecated)](https://developers.cloudflare.com/workers-ai/models/gemma-3-12b-it/)
- [Workers AI: glm-4.7-flash model page](https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/)
- [Google Gemma official docs](https://ai.google.dev/gemma/docs)
- [NobodyClimb RAG Pipeline Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture-en) — how Gemma is used across the 20-node pipeline
