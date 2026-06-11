---
title: "Gemma on Cloudflare Workers AI: A Pragmatic Choice for Traditional Chinese Applications"
date: 2026-04-28
type: guide
category: ai
tags: [gemma, cloudflare-workers-ai, llm, traditional-chinese]
lang: en
tldr: "For running LLMs on Cloudflare Workers AI, gemma-3-12b-it follows Traditional Chinese instructions noticeably better than llama-3.1-8b-instruct. With Gemma 4 arriving in 2026, you get Vision, Function calling, and 256K context -- upgrade as needed."
description: "Why choose gemma-3-12b-it over Llama, how to use Cloudflare Workers AI with its limitations and trade-offs, and real-world performance observations in the nobodyclimb Traditional Chinese RAG system. 2026 update: Gemma 4 (gemma-4-26b-a4b-it) is now available, bringing 256K context and multimodal capabilities."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)

Choosing an LLM isn't about picking "the most powerful one" -- it's about picking "the one that works within your constraints." nobodyclimb runs on Cloudflare Workers, and AI inference stays within the Cloudflare ecosystem -- `@cf/google/gemma-3-12b-it` is the best option under these constraints.

> **2026-04 Update**: Cloudflare Workers AI now offers `@cf/google/gemma-4-26b-a4b-it`, bringing a 256K context window, Vision, and Function calling support. See the [Gemma 4 comparison section](#gemma-4-2026-update) at the bottom of this post.

## What Is Cloudflare Workers AI

Cloudflare Workers AI is Cloudflare's inference service that lets you call hosted models directly from the Workers environment without managing GPU infrastructure. Billing is token-based.

Supported models span text generation, embedding, image generation, speech-to-text, and more. On the LLM side, mainstream open-source models like Llama, Mistral, Gemma, and Qwen are currently available.

```typescript
// In the Workers environment, bindings work like this
const response = await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [
    { role: "system", content: "You are an AI assistant for a Taiwan rock climbing community." },
    { role: "user", content: "What routes at Longdong are suitable for beginners?" }
  ],
  max_tokens: 1024,
  stream: true,
});
```

Compared to self-hosting an inference service, the benefits are clear: no GPU management, no model serving ops work, and it lives in the same environment as other Workers bindings (D1, KV, Vectorize).

## Why gemma-3-12b-it, Not llama-3.1-8b-instruct

nobodyclimb initially used `llama-3.1-8b-instruct`. The main reasons for switching:

**Traditional Chinese instruction following**: Llama 3.1 8B's Traditional Chinese output quality was inconsistent -- it would occasionally mix in Simplified Chinese characters or ignore formatting instructions in the system prompt (e.g., "answers must include source links"). Gemma 3 is noticeably more reliable in this regard.

**12B vs 8B**: The parameter count gap is perceptible in the RAG Q&A use case. Gemma 3 12B utilizes context better -- when given 5 retrieved documents, it can synthesize information more accurately instead of only using the first few.

**Gemma 3's multilingual training**: Google included more comprehensive multilingual coverage in Gemma 3's training data, with a higher proportion of Chinese (including Traditional Chinese) compared to Llama 3.1's publicly known training configuration.

This isn't to say Llama is bad -- it's that for the specific use case of Traditional Chinese RAG, gemma-3-12b-it is a better fit.

## Basic Usage

**Non-streaming (suitable for evaluation, background jobs):**

```typescript
const result = await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userQuery }
  ],
  max_tokens: 512,
});

const answer = result.response; // string
```

**Streaming (suitable for user interfaces):**

```typescript
const stream = await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [...],
  stream: true,
});

// With Hono's streamSSE
return streamSSE(c, async (sseStream) => {
  for await (const chunk of stream) {
    if (chunk.response) {
      await sseStream.writeSSE({ data: chunk.response });
    }
  }
});
```

**JSON output (suitable for structured tasks like judge, filter-build):**

```typescript
const result = await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [
    {
      role: "system",
      content: "Reply in JSON format: { score: number, reason: string }"
    },
    { role: "user", content: `Evaluate the quality of this answer: ${answer}` }
  ],
  response_format: { type: "json_object" },
  max_tokens: 256,
});

const evaluation = JSON.parse(result.response);
```

## Usage Scenarios in nobodyclimb

The system has multiple pipeline steps that require LLM calls:

| Step | Task | Output Type |
|------|------|-------------|
| HyDE | Generate hypothetical answer documents | Plain text |
| multi-query | Expand query into multiple angles | JSON array |
| filter-build | Extract structured search conditions | JSON object |
| llm-generation | Final answer generation | Plain text (streaming) |
| judge | Evaluate answer quality | JSON object |
| agenticDecision | Determine if information is sufficient | JSON boolean + reasoning |

Same model, different prompt engineering, performing vastly different tasks. This is the strategy of having one sufficiently capable model handle everything, rather than selecting the smallest adequate model for each task -- on Cloudflare Workers AI, this makes management simpler.

## Limitations of Cloudflare Workers AI

Not spelling these out clearly will lead to painful pitfalls later:

**CPU time limits**: Workers have CPU time caps (30 seconds on the Paid plan, but AI calls don't count toward CPU time -- they count toward wall time). A pipeline with multiple LLM calls (HyDE + generation + judge) can collectively exceed Workers' execution time limits. nobodyclimb's solution is to make judge writes asynchronous (non-blocking to the main flow) and only enable HyDE for complex queries.

**Opaque model versioning**: Cloudflare manages model versions, and you can't pin a specific checkpoint. Model behavior may change without notice. You need monitoring mechanisms to detect anomalies in output quality.

**No fine-tuning**: Hosted models on Workers AI currently can't be fine-tuned. Domain adaptation relies entirely on prompt engineering and RAG.

**Cold start latency**: During low-traffic periods, the first call may have higher latency. Semantic caching can mitigate this (cache hits avoid LLM calls entirely).

**Context window**: gemma-3-12b-it on Cloudflare Workers AI has a context window of 8192 tokens according to official documentation. Be careful not to exceed the limit with long conversations or large numbers of retrieved documents.

## Comparison with Other Options

| | gemma-3-12b-it (Workers AI) | gemma-4-26b-a4b-it (Workers AI) | OpenAI GPT-4o-mini | Self-hosted Ollama |
|---|---|---|---|---|
| Trad. Chinese quality | Good | Good | Very good | Model-dependent |
| Context window | 8K tokens | 256K tokens | 128K tokens | Model-dependent |
| Vision | No | Yes | Yes | Model-dependent |
| Function calling | No | Yes | Yes | Model-dependent |
| Ops cost | Zero | Zero | Zero | High |
| Latency | Medium | Fast (MoE active 4B) | Low | Hardware-dependent |
| Flexibility | Low | Low | Medium | High |
| Pricing structure | Token-based | $0.10/$0.30 per M tokens | Token-based | Fixed hardware cost |

If Traditional Chinese quality is the top priority, the GPT-4o series is still stronger. But if you're already in the Cloudflare ecosystem and don't want to maintain another AI service account and API key, Workers AI is the smoothest choice.

## Real-World Observations

After several months of use:

- Traditional Chinese instruction following is more stable than Llama; formatting requirements in system prompts (citing sources, JSON output) are generally followed
- Occasional hallucination issues are caught by the judge + self-reflection mechanism -- groundedness below 0.5 triggers a retry
- 12B inference speed isn't fast; the first token in streaming typically takes 1-2 seconds, and a complete answer (300-500 characters) takes about 5-8 seconds
- JSON output mode is stable; `response_format: { type: "json_object" }` rarely returns malformed output

Overall assessment: under the constraint of "staying within the Cloudflare ecosystem," this is currently the best Traditional Chinese LLM option.

## Gemma 4 (2026 Update)

In 2026, Cloudflare Workers AI launched `@cf/google/gemma-4-26b-a4b-it`. Several key upgrades are worth noting:

**Architecture change: MoE**  
Gemma 4 adopts a Mixture-of-Experts architecture. Total parameters are 26B, but only about 4B are activated per inference (a4b = active 4 billion). Actual inference speed is faster than Gemma 3 12B while performing better on most tasks.

**256K context window**  
Gemma 3 on Workers AI only had 8K. Gemma 4's 256K is a massive leap, directly benefiting RAG scenarios that need to fit large volumes of documents.

**Vision support**  
You can pass in images for visual understanding, suitable for applications that need to analyze screenshots or charts.

**Function calling**  
Native tool calling support, more reliable than forcing JSON through prompts, ideal for agentic workflows.

```typescript
// Gemma 4 usage is the same as Gemma 3, just swap the model ID
const response = await env.AI.run("@cf/google/gemma-4-26b-a4b-it", {
  messages: [
    { role: "system", content: "You are an AI assistant for a Taiwan rock climbing community." },
    { role: "user", content: "What routes at Longdong are suitable for beginners?" }
  ],
  max_tokens: 1024,
  stream: true,
});
```

**When to upgrade to Gemma 4?**

- Need to process long documents or multiple context sources -> 256K directly solves Gemma 3's 8K limitation
- Need function calling for agentic tasks -> Gemma 4 has native support
- Need image understanding -> Gemma 4 supports vision
- Text-only RAG with limited budget -> Gemma 3 12B is still sufficient, and the pricing structure differs (Gemma 3 has no public pricing, Gemma 4 is $0.10/$0.30 per M tokens)

## References

- [Cloudflare Workers AI Official Docs](https://developers.cloudflare.com/workers-ai/)
- [Workers AI: Text Generation](https://developers.cloudflare.com/workers-ai/models/text-generation/)
- [Workers AI: gemma-3-12b-it Model Page](https://developers.cloudflare.com/workers-ai/models/gemma-3-12b-it/)
- [Workers AI: gemma-4-26b-a4b-it Model Page](https://developers.cloudflare.com/workers-ai/models/gemma-4-26b-a4b-it/)
- [Google Gemma 3 Technical Report](https://ai.google.dev/gemma/docs/gemma3)
- [NobodyClimb RAG Pipeline Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture) -- Full application of gemma-3-12b-it in a 20-node pipeline
