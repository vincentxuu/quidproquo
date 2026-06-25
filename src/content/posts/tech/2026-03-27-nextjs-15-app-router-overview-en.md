---
title: "Next.js 15 + App Router: What Server Components and use cache Actually Do"
date: 2026-03-27
type: guide
category: tech
tags: [nextjs, react, server-components, app-router]
lang: en
tldr: "Next.js 15 + React 19's App Router shifts rendering responsibility from the client to the server. use cache ties caching logic directly to data functions instead of scattering it across fetch options. Both DaoDao and NobodyClimb chose this stack for very practical reasons."
description: "A practical introduction to the core concepts of Next.js 15 App Router: Server Components, the use cache directive, and why two real-world projects — DaoDao and NobodyClimb — both settled on this stack."
draft: false
---

🌏 [中文版](/posts/tech/2026-03-27-nextjs-15-app-router-overview)

Next.js 15 + App Router isn't a minor iteration on Next.js — it's an architectural shift: from "render on the client first" to "render on the server first, let the client handle only interactivity." This shift changes more than just performance characteristics; it changes how you think about data flow entirely.

Both DaoDao and NobodyClimb chose Next.js 15 App Router. One runs on a traditional VPS, the other runs on Cloudflare Workers via `@opennextjs/cloudflare`. Their requirements are quite different, but they landed on the same frontend stack.

## What Problem Server Components Solve

In the Pages Router world, data flow looks like this:

```
Server getServerSideProps → serialize data → Client hydrate → Client calls API → render
```

This creates two problems: serialization has a cost (large objects and circular references are common pitfalls), and "the component that needs data" is decoupled from "the logic that fetches it" — `getServerSideProps` lives at the page level while components live in the component tree, requiring props drilling or context to bridge the two.

App Router's Server Components push data-fetching responsibility down to the component itself:

```tsx
// app/posts/[slug]/page.tsx
// This component runs directly on the server and can query the DB directly
async function PostPage({ params }: { params: { slug: string } }) {
  const post = await db.post.findUnique({ where: { slug: params.slug } });

  return <PostContent post={post} />;
}
```

`PostContent` can be a purely presentational Server Component or a `'use client'` interactive component. The key point: data-fetching logic and rendering logic live in the same place — no extra props chain needed.

## use cache: Caching Logic Co-Located with Data

In Next.js 13/14, caching was controlled through `fetch` options:

```typescript
// Next.js 13/14 approach
fetch(url, { next: { revalidate: 3600 } }); // 1-hour cache
fetch(url, { cache: "no-store" }); // no cache
```

The problem with this approach is that caching strategy is scattered across individual `fetch` calls, and it only applies to `fetch` — not direct database queries.

Next.js 15's `use cache` directive lets you annotate caching behavior directly on a function:

```tsx
async function getPost(slug: string) {
  "use cache";
  // cacheLife and cacheTag give fine-grained control
  cacheLife("hours"); // cache for 1 hour
  cacheTag(`post-${slug}`); // use tags for invalidation

  return await db.post.findUnique({ where: { slug } });
}

// When revalidation is needed
revalidateTag(`post-${slug}`);
```

The benefit: caching strategy lives alongside data logic. You can look at a function and immediately understand its caching behavior, without hunting through `fetch` calls for a `revalidate` option.

## Basic Structure

```
app/
├── layout.tsx           # Server Component, shared across all pages
├── page.tsx             # Server Component, fetches data then renders
└── posts/
    └── [slug]/
        ├── page.tsx     # Server Component
        └── Comments.tsx # 'use client', interactive parts
```

The rule for deciding whether a component should be a Server or Client Component is straightforward:

- Needs `useState`, `useEffect`, or event handlers → `'use client'`
- Only needs to fetch data and render → Server Component (default)
- Needs browser APIs (`window`, `localStorage`) → `'use client'`

A Client Component's children can still be Server Components:

```tsx
// ClientWrapper.tsx
"use client";

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div onClick={() => setOpen(!open)}>{children}</div>;
}

// page.tsx (Server Component)
export default async function Page() {
  const data = await fetchData();
  return (
    <ClientWrapper>
      <ServerOnlyContent data={data} /> {/* This remains a Server Component */}
    </ClientWrapper>
  );
}
```

## Why Both DaoDao and NobodyClimb Chose It

**DaoDao's situation**: It has two Next.js apps — `website` (marketing) and `product` (the application). SEO matters for `website`, and Server Components let content render to HTML directly on the server without waiting for client-side hydration, benefiting both initial load speed and search engine indexing.

**NobodyClimb's situation**: It runs on Cloudflare Workers via the `@opennextjs/cloudflare` adapter. Dynamic routes go through Workers; static assets go through Cloudflare Assets. With Cloudflare's globally distributed edge nodes, SSR completes at the edge — latency for users in Taiwan is lower than round-tripping to a single origin server.

What both projects have in common: both have SEO requirements (a learning platform and a climbing community), both need data fetched server-side, and App Router is the direction Next.js is actively investing in — the ecosystem and documentation are now stable.

## Things to Watch Out For

**Serialization constraints**: Props passed from a Server Component to a Client Component must be serializable. Passing `Date`, `Map`, or `Set` directly will cause errors — you need to convert them first.

**Third-party package compatibility**: Some older npm packages assume browser APIs by default. Importing them inside a Server Component will throw errors. The fix is to use dynamic import with `ssr: false`, or import them only after a `'use client'` boundary.

**Caching behavior requires explicit understanding**: App Router has four cache layers (Request Memoization, Data Cache, Full Route Cache, and Router Cache). Without understanding them, you'll easily run into "I updated the data but the page didn't change" situations. `use cache` makes one of those layers more intuitive, but you still need to understand the others.

**Dev vs. production behavior differences**: Caching is disabled by default in development and only activates in production, which makes testing cache behavior locally more painful.

## Overall

The core idea behind App Router is sound: let components fetch their own data, and keep caching strategy co-located with data logic. This makes code more cohesive and makes server-side rendering the default rather than an option.

If you're starting a new Next.js project today, App Router is the only direction worth learning seriously — Pages Router isn't "old but stable," it's "old and no longer evolving."

## References

- [Next.js 15 Official Docs](https://nextjs.org/docs)
- [React Server Components Explanation](https://react.dev/reference/rsc/server-components)
- [Next.js use cache directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [@opennextjs/cloudflare adapter](https://opennext.js.org/cloudflare)
- [DaoDao Technical Architecture Overview](/posts/tech/deep-dive/2026-03-12-daodao-tech-architecture)
- [NobodyClimb System Architecture](/posts/tech/deep-dive/2026-03-12-nobodyclimb-architecture)
