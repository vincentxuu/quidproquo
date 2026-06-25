---
title: "The Full Picture of Cloudflare Workers AI Binding: It's More Than Just run()"
date: 2026-04-17
type: guide
category: tech
tags: [cloudflare-workers-ai, cloudflare, rag, ai-gateway, tomarkdown]
lang: en
tldr: "env.AI is not just run(). It also exposes toMarkdown (document-to-Markdown conversion), autorag (managed RAG), gateway (external provider proxy), and models (metadata lookup). Understanding these four method groups is what unlocks Cloudflare as a full AI platform inside Workers."
description: "Starting from the markdown.new service, this post unpacks four overlooked built-in methods on the Cloudflare Workers AI binding: run, toMarkdown, autorag, and gateway. Includes code examples, a decision table, and known limitations."
draft: false
---

🌏 [中文版](/posts/tech/2026-04-17-cloudflare-workers-ai-binding-utilities)

I recently came across [markdown.new](https://markdown.new) — drop in any file (PDF, DOCX, XLSX, images, web pages) and get back LLM-friendly Markdown, for free, no sign-up required. When I looked under the hood, the core turned out to be a single call to `env.AI.toMarkdown()`.

That made me realize: most tutorials reduce Cloudflare Workers AI's `env.AI` binding to "just call `run()` to invoke a model." In reality, it exposes several managed utilities — and in many cases you don't need to build your own RAG pipeline, parse PDFs yourself, or wire up the OpenAI API directly.

This post walks through the overlooked tools hanging off `env.AI`.

## The Mental Model for the Binding

Quick background: [Cloudflare Workers connects to services via Bindings](/posts/tech/2026-03-27-cloudflare-workers-edge-compute) — `D1Database`, `KVNamespace`, `R2Bucket`, `Ai`, and so on. Once you declare the `Ai` binding, `env.AI` becomes available inside your Worker.

Most tutorials jump straight from here to `env.AI.run("@cf/meta/llama-3")` for LLM inference. But the binding object actually looks like this:

```
env.AI
├── run(model, input, options?)       ← direct model inference
├── toMarkdown(files, options?)       ← document-to-Markdown pipeline
├── autorag(name)                     ← managed RAG (now called AI Search)
├── gateway(name)                     ← AI Gateway: unified proxy for external providers
└── models()                          ← list all available models with metadata
```

Think of it this way: `run()` is the low-level primitive; the other three are pipelines Cloudflare has already assembled for you.

## 1. `run()` — The Model Inference Entry Point

The one everyone knows:

```typescript
// Text generation
await env.AI.run("@cf/google/gemma-3-12b-it", {
  messages: [
    { role: "system", content: "You are a helpful assistant" },
    { role: "user", content: "Explain V8 Isolates" },
  ],
  stream: true,
});

// Embeddings (for RAG)
await env.AI.run("@cf/baai/bge-m3", { text: ["paragraph to embed"] });

// Speech-to-text
await env.AI.run("@cf/openai/whisper", { audio: [...bytes] });

// Image generation
await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
  prompt: "a calico cat on a skateboard",
});
```

`run()` is "give me a model ID, I send input, you return output." Choosing the model, writing the prompt, and composing the pipeline are all on you.

For guidance on model selection, see: [Gemma 3 on Cloudflare Workers AI](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai).

## 2. `toMarkdown()` — Document Conversion Pipeline

**This is the core of markdown.new.** All you need is the AI binding declared in wrangler:

```jsonc
// wrangler.jsonc
{
  "ai": { "binding": "AI" }
}
```

One call does it all:

```typescript
const docs = await env.AI.toMarkdown([
  { name: "report.pdf",   blob: pdfBlob },
  { name: "slide.pptx",   blob: pptxBlob },
  { name: "photo.jpg",    blob: imageBlob },
  { name: "sheet.xlsx",   blob: excelBlob },
]);

// docs[i] = {
//   name: "report.pdf",
//   mimeType: "application/pdf",
//   format: "markdown",
//   tokens: 1523,
//   data: "# Report Title\n\n..."
// }
```

### How It Works Internally

Cloudflare routes files automatically by MIME type:

| Format | Handling |
|---|---|
| PDF | Text extraction with structure preservation (headings, lists, tables) |
| DOCX / PPTX / XLSX / ODT | Office parser → Markdown tables + paragraphs |
| HTML / web pages | DOM cleaning, strips `script` / `style` / ads |
| Images (PNG / JPG / WebP) | Vision model for captioning + OCR |
| CSV / JSON / XML | Converted to Markdown tables or code blocks |

No need to install pdf.js, mammoth, or tesseract yourself. Most formats are **free**; image captioning runs through a vision model and is billed accordingly.

### Optional conversionOptions

```typescript
await env.AI.toMarkdown(files, {
  image: { language: "en" },            // caption images in English
  html:  { selector: "article" },       // extract only the article element
  pdf:   { excludeMetadata: true },     // strip PDF metadata
});
```

### Limitations

- Single file cap: **10 MB**
- URL fetch timeout: **30 seconds**
- To check supported file extensions: `await env.AI.toMarkdown().supported()`

### Why "80% Fewer Tokens"

Stripping scripts, styles, navigation, ads, and tracking code from HTML — keeping only semantic structure — routinely reduces token count by 5× or more compared to raw HTML. For RAG crawlers or agent pipelines, that difference translates directly into **real cost savings**.

## 3. `autorag()` — Managed RAG (AI Search)

Anyone who has built RAG from scratch knows the pain: chunking, embedding, writing to a vector DB, query rewriting, retrieval, reranking, prompt assembly, streaming... every step has its own pitfalls. The [complete RAG patterns guide](/posts/ai/2026-03-14-rag-patterns-complete-guide) covers all of them.

AutoRAG (now called **AI Search**) is Cloudflare's managed version of that entire pipeline: drop your documents into R2, and it automatically chunks, embeds, and stores them in Vectorize. Querying is a single line.

```typescript
// After creating an AutoRAG instance
const rag = env.AI.autorag("my-rag");

// Retrieve + generate in one shot
const response = await rag.aiSearch({
  query: "What is a V8 Isolate?",
});
// response.response is the generated answer, response.data is the cited chunks

// Retrieve only (compose your own prompt)
const hits = await rag.search({
  query: "V8 Isolate",
  max_num_results: 5,
});
```

Best fit when: **your documents don't change often, you don't want to maintain a pipeline yourself, and Cloudflare's default chunking strategy is acceptable.** If you need fine-grained control over chunk size, hybrid search, or query rewriting, build it yourself (see [NobodyClimb RAG Pipeline](/posts/tech/deep-dive/2026-03-12-nobodyclimb-rag-pipeline-architecture)).

Recent update: AI Search now supports using OpenAI / Anthropic models for generation via an AI Gateway binding — not limited to models in the Cloudflare catalog.

## 4. `gateway()` — AI Gateway Proxy

You might be using OpenAI, Anthropic, and Google Gemini simultaneously. Each has its own SDK, billing model, logging, and rate limits. AI Gateway is Cloudflare's **unified proxy layer** for all of them:

- Unified logging (every call: cost, latency, prompt, response)
- Unified caching (same prompt doesn't cost twice)
- Unified rate limiting, retries, and fallbacks
- Switch providers from the dashboard without changing code

Using it from a Worker:

```typescript
const gw = env.AI.gateway("my-gateway");

// Fetch the full log for a specific call
const log = await gw.getLog("log-id-xxx");

// Get the gateway endpoint URL (use as baseURL in the OpenAI SDK)
const url = await gw.getUrl("openai");

// Universal endpoint: specify provider + fallback in a single request
await gw.run([
  { provider: "openai",    endpoint: "chat/completions", ... },
  { provider: "anthropic", endpoint: "messages",         ... }, // fallback if first fails
]);
```

A useful mental model:
- **`env.AI.run()`** = run a model from Cloudflare's own catalog
- **`env.AI.gateway().run()`** = proxy a call to an **external** model through Cloudflare

You can use both together: run your main product path through Workers AI (cheaper, co-located), and only hit OpenAI or Anthropic via Gateway for the handful of steps where quality demands it (e.g., `llm-as-judge`) — getting logs and caching as a bonus.

## 5. `models()` — Metadata Lookup

Less commonly used but occasionally handy:

```typescript
const list = await env.AI.models();
// Returns all models in the catalog with task types, pricing, and other metadata
```

Useful for "auto-select model" scenarios — for example, dynamically picking the latest available Llama version at runtime.

## Decision Table: Which One to Use

| Need | Use |
|---|---|
| Send a prompt, get a completion | `run()` |
| Generate embeddings | `run()` with an embedding model |
| PDF / DOCX / web page → Markdown | `toMarkdown()` |
| Q&A over a batch of R2 documents | `autorag()` / AI Search |
| Use OpenAI / Anthropic with unified logging / caching | `gateway()` |
| Mix Cloudflare models with external models | `run()` + `gateway()` together |
| Dynamically select a model at runtime | `models()` |

## How This Blog Uses It

The [quidproquo blog](/posts/product/2026-03-12-quidproquo-blog-from-scratch) `wrangler.jsonc` already declares three bindings: `AI`, `VECTORIZE_INDEX`, and `R2_IMAGES`. Currently only `run()` is in use — for embeddings and semantic search. The other three methods haven't been touched yet.

Some natural next steps:

1. **External document crawler** — `src/lib/crawl/` already has crawling configuration; piping fetched HTML through `toMarkdown()` before chunking would significantly cut downstream embedding token costs.
2. **AI Search** — sync `src/content/posts/` to R2 and wire up `autorag()` for a Q&A bot, without rebuilding the [chatbot pipeline](/posts/ai/2026-03-13-chatbot-development-guide) from scratch.
3. **Gateway** — for `llm-as-judge` answer quality evaluation, Claude or GPT-4 would outperform anything in the Workers AI catalog; Gateway handles unified logging and caching for those calls.

## Limitations and Trade-offs

**Shared across all methods:**

- Workers [CPU time / wall time limits](/posts/tech/2026-03-27-cloudflare-workers-edge-compute) still apply
- Model versions are opaque — Cloudflare manages checkpoints; you cannot pin a version
- No fine-tuning — domain adaptation relies on prompt engineering + RAG only

**`toMarkdown` specific:**

- 10 MB file size limit
- Image captioning is billed (runs through a vision model)
- PDF OCR on scanned documents is mediocre; typeset PDFs work fine

**`autorag` specific:**

- Chunking strategy is fixed; if you need customization, don't use this
- Adds a black-box layer compared to a self-built pipeline

**`gateway` specific:**

- External provider API keys are still your responsibility; Gateway only proxies
- Caching is disabled by default and must be explicitly enabled

## Summary

`env.AI` is not an alias for `run()`. It's **the entry point to an AI platform**:

- Run a model → `run()`
- Clean up data → `toMarkdown()`
- Build Q&A → `autorag()`
- Connect external providers → `gateway()`

Before writing AI features next time, ask: is there a managed version of this? Surprisingly often the answer is yes — and it's right there under `env.AI.`.

## References

- [Cloudflare Workers AI Official Docs](https://developers.cloudflare.com/workers-ai/)
- [Workers AI Bindings Reference](https://developers.cloudflare.com/workers-ai/configuration/bindings/)
- [Markdown Conversion (toMarkdown)](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/)
- [toMarkdown Workers Binding Usage](https://developers.cloudflare.com/workers-ai/features/markdown-conversion/usage/binding/)
- [AI Search (formerly AutoRAG) Workers Binding](https://developers.cloudflare.com/ai-search/usage/workers-binding/)
- [AI Gateway Worker Binding Methods](https://developers.cloudflare.com/ai-gateway/integrations/worker-binding-methods/)
- [Cloudflare Workers: V8 Isolate Fundamentals](/posts/tech/2026-03-27-cloudflare-workers-edge-compute)
- [Gemma 3 on Cloudflare Workers AI: Model Selection](/posts/ai/2026-03-27-gemma-3-cloudflare-workers-ai)
- [Complete RAG Patterns Guide](/posts/ai/2026-03-14-rag-patterns-complete-guide)
- [markdown.new](https://markdown.new) — the inspiration for this post
