---
title: "Product Builder Interview Daily — 2026-11-28: Technical PM"
date: 2026-11-28
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: en
description: "Technical PM practice: use an API design decision matrix to break down a 'should this API be REST or GraphQL' question, with GitHub's 2016 case of validating GraphQL on one small feature before betting on a full rewrite."
tldr: "When asked about an API technology choice, pin down exactly which design dimension the vague complaint maps to, then validate with one small-scope feature instead of announcing a full rewrite — today's north star metric is 'how many API calls it takes to assemble one resource.'"
series:
  name: "Product Builder 面試日練"
  order: 101
---

> :globe: [中文版](/posts/daily/2026-11-28-product-builder-interview-daily)

## Today's Topic

Technical PM API design questions aren't testing whether you know REST is "better" than GraphQL — they're testing whether you can turn a vague complaint ("integrating with this API is painful") into a specific technical symptom before picking a side. Plenty of candidates hear "should we switch API styles" and immediately commit to an answer, without first naming which dimension is actually broken: not enough query flexibility, too much versioning overhead, or no good caching story. What the interviewer is watching is that breakdown process, not which technology wins.

## Core Frameworks

**Framework 1: API design decision matrix**

| Dimension | REST | GraphQL | gRPC |
|---|---|---|---|
| Query flexibility | Fixed response shape, often needs multiple calls to assemble a view | Client specifies the fields it wants; one query can return a complete view | Strongly typed contract; flexibility sits between the two |
| Versioning | Usually `/v1`, `/v2`, or date-based versions | Tends toward additive schema evolution with deprecated fields, avoiding major version numbers | Managed via protobuf field numbers for compatibility |
| Caching | Mature HTTP caching, works out of the box | Needs a separate query-level caching strategy | Needs a custom caching layer |
| Learning curve | Low, mature ecosystem | Higher — requires schema design and a query language | Higher — requires proto definitions and tooling |
| Best fit | Public APIs with clear resource boundaries and a single kind of caller | Multiple client types (web, mobile, third-party) with very different query shapes | High-throughput internal service-to-service calls |

**Framework 2: Three feasibility questions**

When asked "should we redo this technical decision," answer these three before giving a verdict:

1. **How widespread is the symptom?** Does everyone hit this, or only a specific context (e.g. mobile)?
2. **Who absorbs the migration cost if you switch?** Existing integrators already live on the old contract; new developers haven't integrated yet — the cost is not the same for both.
3. **Can you validate on a small scope first?** Is there a low-risk feature you can try before announcing a full rewrite?

What these three questions share: **a technology choice isn't a matter of belief — it's translating a vague "this feels bad" into a specific dimension, then deciding whether the switching cost is worth paying.**

## Today's Practice Question

### The question

Your company is opening up a new developer API so third-party integrators can pull order data. Engineering wants to just expose the existing internal-admin REST API rather than designing a new one from scratch. But sales reports that engineers at two target customers complained during a demo: assembling one complete order view (basic info, line items, shipping status) takes five separate API calls, and about half the fields in each response go unused. What would you recommend engineering do?

(Source: original, drawing on Soreno.ai's technical PM interview-prep notes and the "simultaneous over-fetching and under-fetching" problem GitHub ran into when it launched its GraphQL API in 2016.)

### How to break it down

1. **Scope the question**: first find out whether "five API calls" happens to every integrator, or only in specific contexts (e.g. mobile reporting vs. the admin console) — how widespread the symptom is decides whether this touches the core architecture at all.
2. **Define the users**: separate two groups — integrators already on the current REST API (switching costs them a migration) versus developers who haven't integrated yet (switching costs them almost nothing).
3. **Structure the analysis**: use the API design decision matrix to map "five API calls" and "half the fields unused" to two specific dimensions — query flexibility and over-fetching — instead of a blanket "REST isn't good enough."
4. **Propose a solution**: don't let engineering rewrite the entire public API outright. Pick one narrow, low-risk scope (say, just the order-lookup use case) and validate a GraphQL layer there first, confirming it actually fixes the complaint before deciding whether to expand.
5. **Define success**: measure "average number of API calls to assemble one complete resource" and "the share of returned fields that are actually used" before and after the validation — not a gut feeling that "developer experience improved."

### Sample answer (how to actually say this in the interview)

> **Break the symptom down before picking a technology.** "When a customer says integration is painful, I first want to know exactly where that pain shows up. If the answer is 'it takes five API calls to assemble one order,' that's really two separate symptoms: not enough query flexibility — no single call returns a complete cross-resource view — and over-fetching — most of what comes back in each response goes unused. Both are common REST pain points for multi-resource composition."
>
> **Don't rewrite everything — validate on a small scope first.** "But I wouldn't rewrite the whole public API just because two customers complained, since existing integrators are already on the current REST contract, and a rewrite forces them all to migrate. I'd propose validating a GraphQL layer on just the order-lookup use case with those two customers, and check whether 'average calls to assemble one order view' actually drops from five to one."
>
> **Let the numbers decide whether to expand.** "If the validation shows a clear improvement, and other integrators' query patterns also vary a lot — some only need basic info, others need full shipping history — that's a reason to extend the GraphQL layer further. If it turns out only those two customers have an unusual usage pattern, keeping the existing REST API and adding a dedicated batch endpoint might be the cheaper fix. The call isn't mine to make on preference — it's made by what the validation data shows."

### Self-check

Use this table to make sure your answer didn't skip anything:

| Check | Covered? |
|---|---|
| Broke "it's painful" down into a specific technical dimension instead of a blanket judgment | |
| Separated existing integrators from new developers by migration cost | |
| Used the API design decision matrix to map the symptom to query flexibility / over-fetching | |
| Proposed validating on a small scope before deciding whether to expand, not a full rewrite | |
| Quantified success as "calls per assembled resource" and "field usage rate" | |
| Bonus: weighed existing customers' migration cost against business timeline pressure | |

## Today's Case

**GitHub: validating GraphQL on one small feature before betting on a full rewrite**

In 2016, GitHub explained publicly why it was launching a GraphQL API alongside its existing REST API. At the time, GitHub's REST API accounted for over 60% of requests to its database tier, partly because its hypermedia-driven design required clients to make repeated round trips just to assemble a complete picture — building one resource's full view often took two or three calls, and each response was padded with navigation-only `*_url` fields. Integrators complained that responses simultaneously carried too much data and too little. GitHub's engineering team was initially preparing a conventional REST APIv4 to fix this, but once they inventoried what they actually wanted — finer-grained OAuth scope information per endpoint, smarter pagination, type safety, auto-generated docs and clients — no existing API specification they evaluated fully matched those requirements. That's when they found GraphQL. Rather than porting the entire REST API at once, a small team inside the Platform organization first picked a narrow feature — emoji reactions on comments — and reimplemented it in GraphQL. Only after confirming that worked did they gradually move social features like the profile page, star counts, and watch functionality over, using an internal tool called Scientist to compare the old and new implementations' results before finally shipping GraphQL to production for external developers.

**Interview angle**: this case is ready-made material for "should we switch technical approaches" questions — the point isn't "GraphQL beats REST," it's "validate on a narrow scope to de-risk the commitment before deciding whether to expand it."

## Further Reading

- [The GitHub GraphQL API](https://github.blog/developer-skills/github/the-github-graphql-api/) — GitHub's own engineering blog post on why and how they made the switch
- [To infinity and beyond: enabling the future of GitHub's REST API with API versioning](https://github.blog/developer-skills/github/to-infinity-and-beyond-enabling-the-future-of-githubs-rest-api-with-api-versioning) — how GitHub later added versioning back onto its own REST API
- [GraphQL vs REST | Postman Blog](https://blog.postman.com/graphql-vs-rest) — a table comparing the two styles on versioning, caching, and learning curve

## References

- [The GitHub GraphQL API](https://github.blog/developer-skills/github/the-github-graphql-api/) — primary source for "Today's Case," GitHub Engineering's original 2016 post
- [Technical Product Manager Interview Questions & Prep](https://soreno.ai/articles/technical-product-manager-interview-questions) — technical PM interview perspective behind "Today's Practice Question"
- [GraphQL vs REST | Postman Blog](https://blog.postman.com/graphql-vs-rest) — source for the versioning and caching dimensions in the API design decision matrix
