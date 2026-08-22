---
title: "Choosing a React Stack in the AI Era: From the TanStack Trio to the Full Map"
date: 2026-08-19
category: tech
type: deep-dive
tags: [react, tanstack-router, tanstack-query, zustand, ai-agent, frontend]
lang: en
tldr: "TanStack Router (19.7M weekly downloads) + Query (55.8M) + Zustand (44.5M) as the core, with Vite, react-hook-form + Zod (224M), Tailwind + shadcn, and Vitest + Playwright — the current default stack for serious SPAs. The AI era adds three new selection criteria: does the docs site ship llms.txt (all of TanStack does; React Router doesn't), can type safety act as an agent guardrail, and does the source code live in your repo where an agent can read it."
description: "A full React SPA stack map — routing, server state, client state, forms, styling, tables, testing — with hand-verified npm data, plus the new AI-era selection criteria: llms.txt, type-safety guardrails, copy-in source models, and the training-data counterweight."
series:
  name: "Technology Choices in the AI Era"
  order: 1
draft: false
---

🌏 [中文版](/posts/tech/2026-08-19-react-stack-ai-era)

The three classic criteria for picking React libraries — feature coverage, ecosystem size, maintenance activity — now need a fourth: **how well your AI coding agent handles the library**. As more code is produced by agents, "will the agent write this correctly, and if not, will anything catch it" starts to materially affect velocity. This post maps the most consensual stack for pure SPAs today (TanStack Router + TanStack Query + Zustand at the core), lays out every layer's default pick and alternatives (all npm numbers hand-checked in August 2026), and closes with the selection criteria the AI era has added.

## How the core trio divides the work

The organizing idea is to **split state by its nature across three single-purpose tools** rather than reach for one all-in-one framework:

```
URL state            → TanStack Router (routes, params, search params)
Server state         → TanStack Query (API cache, dedup, revalidation)
Residual client state → Zustand (UI prefs, modals, cross-component scratch)
```

**[TanStack Query](/posts/tech/2026-03-27-tanstack-query-server-state-en) is the least controversial of the three**: server data is a cache, not state. Hand-rolling fetch in `useEffect` gives you no caching, no deduplication, no background refresh — every project eventually grows its own degraded copy of Query, so you might as well use the real one. **[Zustand](/posts/tech/2026-03-27-zustand-state-management-en)** is "adopt when it hurts": once server data lives in Query, genuine client state is often small enough for Context + useReducer. A store that keeps shrinking is a sign the architecture is working.

**TanStack Router** is the young piece (1.0 in late 2023). Its differentiation against React Router is architectural: 100% type safety (paths, params, and search params all inferred at compile time — navigating to a nonexistent route is a type error, not a runtime 404), search params as first-class citizens (validation, typing, and serialization built in), and route loaders that integrate with Query to eliminate loading waterfalls.

### Routing market reality: the incumbent and the challenger

npm weekly downloads (checked August 2026): react-router **44.2M**, @tanstack/react-router **19.7M**. The precise statement is: **React Router is still the mainstream choice, and TanStack Router is the mainstream second choice** — about forty-plus percent of the incumbent's volume, a rare catch-up pace for a router whose 1.0 is barely two and a half years old. React Router's turbulent version history (the breaking v5→v6 rewrite, then v7 absorbing Remix and splitting into library/framework modes) has accumulated community fatigue; TanStack Router's type safety and search-params story are architectural gaps that can't be closed by patches. Existing projects have no reason to migrate; for new TypeScript-heavy back-office apps, the scale has tipped.

## The rest of the stack

The trio only covers routing and state. A real project's full map looks like this (weekly npm downloads in parentheses, checked August 2026):

```
Build       Vite (142.9M)
  │
  ├─ Routing         TanStack Router (19.7M)   / alt: React Router (44.2M)
  ├─ Server state    TanStack Query (55.8M)    / alt: SWR (13.5M)
  ├─ Client state    Zustand (44.5M)           / alt: Redux Toolkit (23.4M), Jotai (4.9M)
  ├─ Forms           react-hook-form (50.5M)
  ├─ Validation      Zod (224.1M)
  ├─ Styling         Tailwind CSS (106.0M) + shadcn/ui (copy-in)
  ├─ Tables/virtual  TanStack Table (15.9M) / Virtual (18.4M)
  ├─ AI interface    AI SDK (ai, 18.4M) + AI Elements (copy-in)
  │
  └─ Testing         Vitest (77.6M) + Playwright (70.0M)
```

Layer by layer:

**Build: Vite, no contest.** Create React App was officially deprecated in 2025; the React docs now recommend either a framework or a build tool like Vite. 142.9M weekly downloads means this layer is a solved question.

**Forms + validation: react-hook-form + Zod.** Forms are the one slice of client state complex enough to deserve a dedicated tool: the uncontrolled architecture keeps keystrokes from re-rendering the whole form, and 50.5M downloads is a clear consensus. Zod's 224.1M is the more striking number — it long ago outgrew forms to become the TypeScript ecosystem's general standard for "runtime validation + type inference": API response checking, environment variables, LLM structured output (Zod is the preferred way to define AI SDK tool schemas, with JSON Schema also accepted). **A Zod schema is a contract for your agent**: write it precisely and the agent's data-handling code gets a machine-checkable boundary. TanStack Form (2.3M) takes a types-first approach but is too young to threaten the incumbent.

**Styling: Tailwind + shadcn/ui.** Tailwind at 106.0M; [shadcn/ui](/posts/tech/2026-03-27-shadcn-ui-component-library-en) isn't a package but component source copied into your repo. The pair is unusually agent-friendly — criterion three below.

**Tables and virtualization: TanStack Table / Virtual.** Headless by design — logic only (sorting, filtering, pagination, virtualization math), rendering entirely yours, so they mesh with the Tailwind/shadcn styling world. Back-office apps eventually hit the ten-thousand-row table; these are the answer when it happens, not something to install on day one.

**Server-state alternative: SWR.** From Vercel, lighter and simpler (13.5M). It does have mutations, optimistic updates, and infinite scrolling (`useSWRMutation`, `useSWRInfinite`), but its completeness and periphery (devtools, offline, pagination helpers) are widely considered behind Query's. Reasonable in a Next.js codebase for convenience; for SPAs, use Query.

**Client-state alternatives: Redux Toolkit and Jotai.** RTK's 23.4M is mostly installed base — the modernization path for existing Redux apps, rarely a first pick for new ones. Jotai (4.9M) is the atom model: when your state graph is a fine-grained dependency web (form builders, canvas apps), atoms fit better than Zustand's single store; typical back-office apps don't need that complexity.

**AI interface: AI SDK + AI Elements.** If the product needs an AI conversation UI, the AI SDK (`ai`, 18.4M) `useChat` hook handles streaming and message parts, and [AI Elements](/posts/tech/2026-08-19-vercel-ai-elements-en) supplies copy-in components like Conversation, Reasoning, and Sources. Same model as shadcn — see the dedicated post.

**Testing: Vitest + Playwright.** Vitest (77.6M) consumes your Vite config natively — unit and component tests with zero extra setup; Playwright (70.0M) covers E2E. Testing matters more in an agent workflow than it ever did: it's the last stage of the agent's self-verification loop, which is the next section's subject.

## The new AI-era criteria

Three criteria that only became important in the last two years, and will only grow.

### 1. Machine-readable docs: llms.txt

llms.txt is a convention for exposing a docs site as plain text that an LLM can ingest directly. Tested by hand (August 2026, HTTP status):

| Docs site | /llms.txt |
|---|---|
| tanstack.com | ✅ 200 |
| ui.shadcn.com | ✅ 200 |
| zustand.docs.pmnd.rs | ✅ 200 |
| ai-sdk.dev | ✅ 200 |
| nextjs.org | ✅ 200 |
| reactrouter.com | ❌ 404 |

The table speaks for itself about each team's posture toward agent-driven development. When your agent needs the current form of an API, a docs site with llms.txt can be fed wholesale into context; without it, the agent scrapes HTML or leans on training-data memory — which is exactly where hallucinations come from.

### 2. Type safety = agent guardrails

This is TanStack Router's most underrated advantage in the AI era: **when an agent writes a wrong route, misses a param, or typos a search param, it's a compile-time error, not a runtime 404**. An agent's self-correction loop feeds on fast, unambiguous error signals — an error that turns `tsc` red gets fixed by the agent itself; a 404 that only shows up in a browser needs a human (or an expensive E2E loop) to find. The same logic runs through the whole stack: Zod makes data boundaries checkable, Vitest makes behavior checkable, Playwright makes user journeys checkable. **For every layer, ask: "if the agent gets this wrong, does a machine catch it?"** The more layers answer yes, the more agent output converges before review — which matters more than how familiar the agent is with any given library.

### 3. Is the source in your repo?

The shadcn model (shadcn/ui, AI Elements) copies component source into your project, which turned out to have an unforeseen benefit: **agents can read it and modify it**. A traditional npm package is a black box to an agent — customization happens by wrapping. Copied-in components can be grepped, understood, and edited directly. The vendors are leaning in: shadcn ships an official MCP server (`ui.shadcn.com/docs/mcp`) that lets agents browse and install registry components, and the AI Elements repo carries a `SKILL.md` written for coding agents.

### The counterweight: training-data mass

An honest counterforce: **mainstream = abundant training data = agents write it correctly bare-handed**. React Router's 44.2M installed base means oceans of tutorials and open-source code in every model's training set; the agent gets it roughly right without reading docs. TanStack Router is young and under-represented — agents drift into outdated APIs or React Router idioms. Zod at 224M versus any young validation library tells the same story: **top-of-the-charts libraries come with "agent works out of the box" built in**. The deficit can be papered over with llms.txt / MCP / doc-feeding, but the papering has a cost. So this criterion pulls against the other three: the more mature your agent workflow (doc-feeding, type-check loops), the more you can harvest the "niche but well-tooled" premium; teams still vibe-coding bare-handed err less by picking the most mainstream option.

## Overall

For serious SPAs without SSR (dashboards, SaaS back offices, internal tools), this map is the current default: Vite + Query + react-hook-form + Zod + Tailwind are near-automatic; Zustand when it hurts; the router depends on how much your team values type safety, between TanStack and React Router; Table/Virtual when you hit the big table. Content-driven, SEO-critical sites should go to Next.js or Astro; if SSR arrives later, TanStack Start is an official upgrade path, not a dead end.

The AI-era selection rule compresses to one line: **pick what machines can catch when it's wrong (strong types), what machines can read (llms.txt / MCP), and what machines can edit (copy-in source)** — because the "person" writing the code is, increasingly, not a person.

## References

- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [React Router](https://reactrouter.com/)
- [Vite](https://vite.dev/)
- [react-hook-form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Table](https://tanstack.com/table/latest)
- [Vitest](https://vitest.dev/)
- [Playwright](https://playwright.dev/)
- [AI SDK](https://ai-sdk.dev/)
- [TanStack llms.txt](https://tanstack.com/llms.txt)
- [shadcn/ui MCP Server](https://ui.shadcn.com/docs/mcp)
- [llms.txt spec](https://llmstxt.org/)
- [npm downloads API (data source)](https://api.npmjs.org/downloads/point/last-week/react-router)
- On this site: [TanStack Query: The Standard Answer for Server State](/posts/tech/2026-03-27-tanstack-query-server-state-en), [Zustand](/posts/tech/2026-03-27-zustand-state-management-en), [shadcn/ui: Not a Package — It's Copy-Pasted Component Source Code](/posts/tech/2026-03-27-shadcn-ui-component-library-en), [AI Elements](/posts/tech/2026-08-19-vercel-ai-elements-en)
