---
title: What Tools Power This Blog
date: 2026-03-12
category: tech
tags: [astro, cloudflare, blog, tools]
lang: en
description: A complete overview of this blog's tech stack — from framework choices and the Cloudflare ecosystem to overall architecture design
tldr: Astro + the full Cloudflare suite — static-first, edge-computed, zero maintenance cost
draft: false
type: guide
pinned: true
---

🌏 [中文版](/posts/tech/guide/2026-03-12-tools-behind-this-blog)

This blog runs on Astro + Cloudflare Workers, backed by D1, R2, KV, Vectorize, and Workers AI. The core reasoning behind this combination: a content site doesn't need a complex server, but it does need infrastructure flexible enough to do the right thing at the right time.

## Framework: Astro

Astro is a content-first static site generator built around a key design principle called **Islands Architecture** — it outputs pure HTML by default, and only emits JavaScript for components explicitly marked as interactive.

This is the opposite of Next.js's philosophy. Next.js is JavaScript-driven by default, requiring `"use client"` / `"use server"` directives to define boundaries. Astro defaults to zero JS, and you opt into interactivity with directives like `client:load`. For a reading-focused content site like a blog, Astro's approach is more natural — article pages need zero client-side logic.

Astro 6 supports **Hybrid Mode**, allowing static pages and dynamic APIs to coexist in the same project. Article pages on this site use `export const prerender = true` to generate HTML at build time; search and API endpoints use server-side rendering and are processed on demand.

### Content Collections

Astro's built-in Content Collections are the right way to manage Markdown. Define your schema with Zod:

```typescript
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()),
    lang: z.enum(['zh-TW', 'en']).default('zh-TW'),
    tldr: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});
```

Frontmatter fields are fully typed in TypeScript — mistyped field names or wrong value types fail at build time, not at render time when the data anomaly would be much harder to catch.

### i18n

Astro 6 ships with built-in i18n routing. This site configures Chinese as the default locale (root path) and English under the `/en/` prefix. No third-party packages needed — a few lines of config and multilingual routing is done.

---

## Deployment: Cloudflare Workers

Cloudflare Workers is an edge computing platform — your code doesn't run in a single data center, but is deployed to 300+ nodes globally, with each request executed at the node closest to the user.

Compared to traditional serverless (Lambda, Cloud Functions), Workers' key advantage is **near-zero cold starts**. Lambda cold starts can take hundreds of milliseconds; Workers uses a V8 Isolate architecture with startup times under 5ms. The difference is noticeable for latency-sensitive APIs.

Workers' constraints lie in its execution environment. It isn't a full Node.js runtime — it exposes only a subset of Web APIs, meaning some npm packages can't be used directly. There's also a bundle size limit (1MB compressed), which matters for complex applications.

Deploy with `wrangler deploy`, develop locally with `wrangler dev` — which simulates D1, KV, and other services without needing a cloud connection.

---

## Database: Cloudflare D1

D1 is Cloudflare's serverless SQLite, running on edge nodes.

Markdown files are the single source of truth on this site; D1 is a derived copy. A build-time script (`scripts/sync-to-d1.ts`) syncs post content into it, with the goal of supporting RAG search — letting AI query article content to answer questions.

D1 works exactly like SQLite — if you know SQL, you're immediately productive. The `batch()` API lets you send multiple statements at once, but there's an implicit limit of 100 per batch; anything beyond that is silently dropped (for more on D1 usage, see: [Cloudflare D1 Complete Guide](/posts/tech/2026-03-27-cloudflare-d1-sqlite-database)).

Compared to standalone database services like PlanetScale or Supabase, D1's advantage is zero configuration — already inside the Cloudflare ecosystem, just set up the binding and you're done, no connection strings or credentials to manage.

---

## Vector Search: Cloudflare Vectorize

Vectorize is Cloudflare's vector database, used to store text embeddings (semantic vectors).

The plan for this site is to use it for RAG search: user submits a question → question is converted to an embedding → Vectorize finds the closest matching article passages → passages are handed to AI to generate an answer. The feature isn't live yet, but the index and bindings are already configured.

Vectorize is a managed service — no need to maintain your own vector database (like Pinecone or a self-hosted Qdrant), which saves a lot of operational overhead for a personal project.

---

## AI Inference: Cloudflare Workers AI

Workers AI lets you run AI models directly on Cloudflare without calling external APIs like OpenAI or Anthropic.

Available models cover embeddings (`@cf/baai/bge-base-en-v1.5`), text generation (Llama, Mistral families), image generation (Stable Diffusion), and more. For this site, the primary uses are converting article content into embeddings for storage in Vectorize and handling AI Q&A later.

Compared to external API calls, Workers AI offers lower latency (everything within the Cloudflare network), transparent pricing, and no API key management. The trade-off is fewer available models than OpenAI and a capability gap on complex tasks.

---

## Object Storage: Cloudflare R2

R2 is Cloudflare's object storage — S3-compatible API, used for images and other static assets.

The critical difference from S3 is **no egress fees**. S3 charges per GB of outbound traffic; R2 doesn't. For an image-heavy content site with frequent reads, this difference compounds into a significant cost gap over time.

---

## Session Management: Cloudflare KV

KV is Cloudflare's distributed key-value store — extremely low read latency, ideal for small data that needs fast access.

Workers are stateless; each request runs in an isolated execution environment. When you need to persist state across requests (like sessions), KV is the most straightforward option. Writes propagate to global nodes within seconds; reads are served from the nearest cache.

---

## Package Management: pnpm

pnpm replaces npm, with a core difference: it uses hardlinks to share packages — all projects share the same package instances on disk rather than each project copying everything into its own `node_modules`. Significantly less disk usage and faster installs.

---

## Overall Architecture

```
Markdown posts (.md)
       │
       ├─ build time → Astro SSG → static HTML
       │
       └─ sync script → Cloudflare D1
                              │
                         Vectorize (embeddings)
                              │
                         Workers AI (RAG Q&A)

Cloudflare Workers (Edge)
       ├── Static assets (article pages)
       ├── Dynamic API (search, Q&A)
       ├── R2 (images)
       └── KV (sessions)
```

The core principle of this architecture is **static-first, dynamic on demand**. Anything that can be handled at build time is handled upfront, with no runtime dependency. Edge Functions are used only where dynamic capability is genuinely needed.

The Cloudflare all-in-one approach keeps integration costs low — all services on one platform, configure the bindings and they can talk to each other, no cross-service auth or connection management. Free tier quotas are more than sufficient for a personal project. The downside is a smaller ecosystem than AWS or GCP; for more advanced architectural problems, documentation and community resources are comparatively limited.

## References

- [Astro Documentation](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro i18n Routing](https://docs.astro.build/en/guides/internationalization/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [Cloudflare Vectorize Documentation](https://developers.cloudflare.com/vectorize/)
- [Cloudflare Workers AI Documentation](https://developers.cloudflare.com/workers-ai/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [pnpm Documentation](https://pnpm.io/)
- [Zod Documentation](https://zod.dev/)
- [What to Know Before Switching Astro Blog Templates](/posts/tech/guide/2026-03-12-astro-blog-template-guide) — Astro template selection and migration guide
