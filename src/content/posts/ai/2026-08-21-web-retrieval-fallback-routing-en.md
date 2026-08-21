---
title: "A Complete Web Retrieval Route for AI Agents: When to Use Search, Fetch, Crawlers, and Browsers"
date: 2026-08-21
category: ai
type: deep-dive
tags: [web-search, web-scraping, ai-agent, retrieval, browser-automation, http]
lang: en
series:
  name: "Search and Scraping in Practice"
  order: 7
tldr: "An agent should not open a browser for every web task: route first to Search or Fetch, then escalate on explicit signals such as status codes, weak content, JavaScript shells, authentication, or challenge pages, with retry, budget, cache, deduplication, and provenance constraints at every step."
description: "Fallback routing for AI-agent web retrieval: responsibility boundaries for Search, Fetch, Crawlers, Browsers, and controlled stealth; failure classification, decision tables, budgets, and executable router pseudocode."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-web-retrieval-fallback-routing)

[The previous article in this series](/posts/ai/2026-05-08-local-deep-research-walkthrough-en) covers how a research agent plans work and combines sources. This article narrows the scope to the retrieval layer: when an agent receives “find this information” or “read this URL,” should it call Search, direct Fetch, a Crawler, a Browser, or a controlled stealth browser?

The answer is not “use the strongest tool.” Build a route that escalates from **cheap, predictable, and auditable** operations to expensive operations with more side-effect risk. Success cannot mean HTTP `200`; login forms, challenge pages, soft 404s, and empty JavaScript shells can all return `200`.

## Five routes, one responsibility each

| Route | Responsibility | Good input | It should not own |
|---|---|---|---|
| Search | Discover candidate URLs and alternate sources | A question, entity, or unknown location | Treating snippets as full-text evidence |
| Fetch | Read the raw response from a known URL | HTML, JSON, text, or directly downloadable documents | Executing JavaScript or operating a page |
| Crawler | Expand links from a seed and extract content | Documentation sites, site sections, multipage lists | Simulating authenticated interaction |
| Browser | Execute JavaScript, wait for state, and operate safe UI | Client-rendered pages, consent, pagination, infinite scroll | Acting as the default HTTP client |
| Controlled stealth | Adjust browser characteristics within an authorized scope | False-positive bot detection on a dedicated or permitted site | Bypassing authorization, CAPTCHA, paywalls, or site policy |

Search and Fetch are alternative entry points, not fixed consecutive steps. If the user supplies a URL, Fetch first. If the user supplies only a question, Search first. Crawlers and Browsers are escalations. Stealth is not a fifth level with a higher success rate; it is a separate branch that requires explicit source authorization and policy approval.

This is also why [SearXNG and Crawl4AI](/posts/ai/2026-08-21-searxng-crawl4ai-setup-en) do not replace each other. The former answers “where might the answer be?” while the latter answers “what readable material exists inside this known site?”

## Classify the task before classifying the failure

The router's first decision is the task shape, not the tool:

- `discover`: no trusted URL; find candidate sources.
- `read`: a URL exists; retrieve one page.
- `traverse`: read a section, documentation tree, or paginated set.
- `interact`: the answer appears only after client-side rendering or safe UI interaction.
- `authenticated`: use a user-authorized session after verifying scope and data isolation.

The second decision is why the previous stage failed. Do not compress every condition into `fetch_failed`; that leaves the agent blindly swapping tools.

| Signal | Classification | Next action | Do not |
|---|---|---|---|
| DNS, connection reset, `502`, `503`, `504` | Transient transport failure | Retry within bounds, then try another source | Retry forever |
| `429` | Rate limiting | Honor `Retry-After`; reduce concurrency | Immediately rotate identities or many IPs |
| `301`, `302`, `307`, `308` | Redirect | Follow a bounded chain and retain it | Forward sensitive headers across unsafe boundaries |
| `401` | Unauthenticated | Enter the auth lane only with an authorized session | Guess credentials or borrow cookies |
| `403`, `451`, robots denial | Policy or access restriction | Stop or find a permitted public alternative | Treat every denial as bot detection to bypass |
| `404`, `410` | Missing source | Search for the canonical or replacement source | Retry the same URL |
| `200` with little body, navigation only, or login form | Content failure | Classify soft 404, auth wall, or extraction failure | Declare success |
| `200` with a JS shell and data after scripts run | Rendering failure | Use Browser, or an allowed known API | Guess readiness with a fixed sleep |
| Challenge or CAPTCHA | Challenge | Stop and report; handle only in an explicitly authorized environment | Automatically defeat or evade it |

[RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html) defines HTTP status semantics, but status is not a content-quality classifier. For example, `403` means that the server understood the request and refuses to fulfill it; it does not mean “try a browser that looks more human.” [RFC 6585](https://www.rfc-editor.org/rfc/rfc6585.html) states that a `429` response may include `Retry-After`; the router should use it instead of immediately resending.

## A `200` response still needs content acceptance

Every retrieval should pass four layers:

1. **Transport:** the response is readable, redirects do not loop, and the content type is supported.
2. **Page identity:** canonical URL, title, primary language, and expected origin agree.
3. **Content quality:** body length, text density, required fields, and query relevance meet task-specific thresholds.
4. **Policy:** no auth boundary was crossed, no form was submitted, no prohibited path was accessed, and no challenge page was cited.

Thresholds belong to the task. A global `minChars = 500` is wrong: an exchange-rate lookup may need one number, while a specification task needs sections and a version. Let the task declare `required_fields`, `expected_content_types`, and `quality_checks`; the router should execute that contract.

A Browser should not use “sleep three seconds” as its success condition. [Playwright auto-waiting](https://playwright.dev/docs/actionability) checks element state before actions. For retrieval, wait for an observable selector, response, or page state. The readiness condition belongs to the task contract, not a hard-coded delay.

## Retry only errors that can recover on their own

Retryable conditions commonly include timeouts, connection resets, `408`, `429`, and selected `5xx` responses. Non-retryable conditions commonly include unsupported formats, explicit `401`/`403`/`404`/`410`/`451` responses, policy denial, and confirmed login or challenge pages.

Even retryable conditions need all of the following:

- A per-stage `maxAttempts`, such as two Fetch attempts and one Browser attempt.
- Exponential backoff with jitter so workers do not collide again in lockstep.
- A task deadline; do not begin an attempt that cannot finish in the remaining time.
- An idempotency constraint; this route is read-only by default and must not replay state-changing actions.

Switching tools is not a retry. Escalating Fetch to Browser adds latency, CPU, memory, cookies, and interaction risk, so record it as an escalation.

## Budget and depth define when to stop

A fallback tree without budgets becomes brute-force search. Every task needs at least:

```ts
type RetrievalBudget = {
  deadlineMs: number
  maxRequests: number
  maxSearchQueries: number
  maxPages: number
  maxDepth: number
  maxBrowserStarts: number
  maxCostUsd?: number
}
```

`maxDepth` limits how far a crawler walks from its seed. `maxPages` limits total expansion. `maxBrowserStarts` prevents launching a browser for every candidate. On exhaustion, return `budget_exhausted` with partial evidence; do not disguise it as “not found.”

Define positive stopping conditions too. Stop when required facts, source count, and freshness all pass. Reading more pages does not automatically make an answer more reliable.

## Cache, deduplication, and provenance belong in the router

A cache key needs at least canonical URL, representation variant, and auth scope. URL alone is unsafe for authenticated content because it can return user A's page to user B. [RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html) separates fresh, stale, and validated responses. Prefer conditional requests with `ETag` or `Last-Modified` instead of always refetching or always trusting old data.

Deduplicate at three levels:

- URL normalization removes tracking parameters and fragments while preserving query parameters that change content.
- Redirect and canonical identity merge aliases while retaining the original chain.
- Content fingerprints process the same body once while preserving provenance when multiple origins syndicate it.

Every artifact should record `requested_url`, `final_url`, retrieval time, route, status, content type, content hash, cache state, auth scope, parent page, and search query. This provenance lets a claim trace back to a specific representation. [W3C PROV-O](https://www.w3.org/TR/prov-o/) provides a general model for entities, activities, agents, and derivations.

## An executable router shape

The code below omits provider SDKs but retains the contracts that control behavior: classification, budget, policy, and trace.

```ts
async function retrieve(task: Task, ctx: Context): Promise<Result> {
  const trace = ctx.trace.start(task)
  const candidates = task.url
    ? [{ url: normalize(task.url), discoveredBy: "user" }]
    : await searchWithBudget(task.query, ctx.budget, trace)

  for (const candidate of dedupe(candidates)) {
    if (!ctx.policy.mayFetch(candidate.url)) continue

    const cached = await ctx.cache.get(candidate.url, ctx.authScope)
    const fetched = await boundedFetch(candidate, cached, ctx, trace)
    const fetchVerdict = classify(fetched, task)

    if (fetchVerdict.kind === "usable") {
      const result = task.mode === "traverse"
        ? await crawlWithinBudget(candidate, task, ctx, trace)
        : toArtifact(fetched, trace)
      if (satisfies(result, task)) return trace.complete(result)
    }

    if (fetchVerdict.kind === "js-shell" && ctx.budget.browserStartsLeft > 0) {
      const rendered = await browseReadOnly(candidate, task.waitFor, ctx, trace)
      const browserVerdict = classify(rendered, task)
      if (browserVerdict.kind === "usable" && satisfies(rendered, task)) {
        return trace.complete(toArtifact(rendered, trace))
      }
      if (browserVerdict.kind === "challenge") {
        return trace.stop("challenge", { retryable: false })
      }
    }

    if (fetchVerdict.kind === "auth-required") {
      if (!task.requiresAuth || !ctx.authScope) continue
      const authorized = await browseWithAuthorizedSession(candidate, ctx, trace)
      if (satisfies(authorized, task)) return trace.complete(authorized)
    }

    if (!fetchVerdict.retryable) trace.recordStop(candidate, fetchVerdict.kind)
    if (ctx.budget.exhausted()) return trace.stop("budget_exhausted")
  }

  return trace.stop("no_acceptable_source")
}
```

In production, `boundedFetch` owns redirect caps, timeout, `Retry-After`, backoff, and cache validation. `classify` owns soft 404, login-page, challenge, JS-shell, and content-quality detection. Keeping them separate prevents transport retries and tool escalation from collapsing into one ambiguous loop.

## The default route

A safe, practical default is:

```text
Question only → Search → Fetch candidates
Known URL → Fetch
Site section → Fetch seed → Crawler
JS shell or safe interaction → Browser
Authenticated content → Authorized Browser session with auth-scoped cache
Challenge or explicit denial → Stop or switch to a permitted public source
Every stage → Stop when content passes; also stop when budget is exhausted
```

The goal is not to make an agent “get into every site.” The goal is to give every escalation an explainable failure signal, cost, and policy reason. The next article turns these contracts into a fixed corpus and regression gates: [How to Evaluate Agent Search Quality: Building a Web Retrieval Benchmark](/posts/ai/2026-08-21-web-retrieval-benchmark-en).

## References

- [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html)
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html)
- [RFC 6585: Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585.html)
- [RFC 9309: Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)
- [Playwright: Auto-waiting](https://playwright.dev/docs/actionability)
- [W3C PROV-O: The PROV Ontology](https://www.w3.org/TR/prov-o/)
- [On this site: Building a Web Retrieval Benchmark](/posts/ai/2026-08-21-web-retrieval-benchmark-en)
