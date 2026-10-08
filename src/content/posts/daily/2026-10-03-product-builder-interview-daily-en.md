---
title: "Product Builder Interview Drill — 2026-10-03: Technical PM"
date: 2026-10-03
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: en
description: "Practicing a Technical PM question — planning the deprecation of a public API after a breaking auth change — using Stripe's date-based API versioning. The case: Stripe has never forced an account to upgrade since 2011, translating every request through version-change modules instead."
tldr: "Technical PM interviews don't test whether you can draw an architecture diagram — they test whether you can break a breaking API change into concrete decisions: customer segmentation, a compatibility layer, a phased deprecation timeline, and a sunset date you're actually willing to enforce. Today's framework is the five-layer API design model (Use Case → Contract → Compatibility → Operability → Developer Experience), paired with an ADR format (Context → Decision → Consequences → Revisit trigger) for writing decisions down. The practice question is: how would you plan a deprecation for a public API with a breaking auth change? The approach: clarify whether the change is security-driven or a refactor, segment customers by call volume, evaluate whether a compatibility layer can absorb part of the breaking change, then roll out in four phases (warning → outreach → soft deadline → shutdown), tracking migrated-traffic share as the leading indicator. The case study is Stripe: since 2011, every account has been pinned to a date-named API version on its first request, and every breaking change since then has been absorbed by internal version-change modules rather than forced onto developers — a pattern Stripe made explicit in September 2024 with monthly non-breaking releases and two breaking major releases a year."
series:
  name: "Product Builder Interview Daily"
  order: 45
---

> 🌏 [中文版](/posts/daily/2026-10-03-product-builder-interview-daily)

## Today's Focus

What exposes a weak Technical PM candidate isn't whether they know systems-design vocabulary. It's what happens when the interviewer drops a scenario like "should we make a breaking change to this API" or "should this service be split up," and the candidate hands the technical decision back to engineering instead of owning it — the customer migration plan, the compatibility trade-offs, the consequences. This round tests "PM-altitude systems design": you're not expected to write code, but you are expected to turn technical constraints into a product decision in a 20-30 minute conversation, one an engineer in the room would actually trust.

## Core Frameworks

**API design and versioning: Use Case → Contract → Compatibility → Operability → Developer Experience**

| Layer | Question to answer | Common blind spot |
|---|---|---|
| Use Case | Who calls this API, for what job, with what latency/consistency needs? | Jumping straight to specs without framing the use case |
| Contract | How are resources, auth, error formats, idempotency, and pagination defined? | Over-engineering the interface at the cost of predictability |
| Compatibility | What's the versioning strategy, deprecation policy, communication plan? | Treating a breaking change as a pure engineering call that ignores existing customers |
| Operability | Rate limits, observability, SLOs, support cost? | Optimizing for launch day, not for running the thing afterward |
| Developer Experience | Docs, examples, sandbox, time to first successful call? | Treating DX as a nice-to-have instead of core deliverable |

**ADR shorthand (Architecture Decision Record)** — once a technical decision is made, write it down in this format so the team has both alignment and a way back:

1. **Context**: what pressure or constraint is forcing this decision now
2. **Decision**: which option was chosen, and which were ruled out
3. **Consequences**: what costs and risks this creates, and who owns them
4. **Revisit trigger**: what has to happen for this decision to be reopened

The point of an ADR isn't to document for yourself — it's so that whoever inherits this six months from now (including the engineer who originally disagreed) can see why the call was made, without re-running the whole debate.

## Today's Practice Question

### The Question

"We need to make a breaking change to a public API — changing the existing auth mechanism. How would you plan the deprecation?"

(Source: adapted from Product HQ's "Technical PM interview questions I'd actually ask" practice bank, combined with the API-lifecycle depth described in AI Interviewer's "Technical Product Manager Interview Preparation.")

### How to Break It Down

1. **Clarify the problem**: is this breaking change driven by a security fix (timeline is forced) or an architectural refactor (timeline has slack)? How many active customers are on the old auth mechanism right now?
2. **Map the blast radius**: pull call-volume data per customer and per endpoint to find the customers who combine high volume with low migration readiness — that group sets the floor on how long the deprecation window needs to be.
3. **Structure the analysis**: revisit the Contract and Compatibility layers — can a compatibility layer translate old-style requests into the new auth mechanism internally, buying migration time, instead of forcing every customer to cut over at once?
4. **Propose a plan**: phase the deprecation — start with a deprecation warning in responses that doesn't break existing calls, publish a migration guide and code samples, reach out directly (even one-on-one) to high-volume customers, and only then set a sunset date you actually intend to enforce.
5. **Define success**: the metric isn't "did we send the announcement" — it's the share of traffic still on the old version and whether any high-volume customer is still unmigrated as the sunset date approaches. If a major account is still stuck two weeks out, there needs to be a contingency: more hands-on help, or pushing the date.

### A Model Answer (How to Say This Out Loud)

> **Frame the nature of the change first.** I'd confirm whether this auth change is a security fix or a refactor — if it's a security issue, there's little room to negotiate the timeline, so the strategy leans toward "mandatory, but with enough runway." If it's a refactor, I'd first check whether a compatibility layer could absorb the breaking change on the backend, so most customers never notice.
>
> **Then talk about sequencing.** I'd pull each customer's call volume on the old auth endpoint over the last 90 days and split them into three groups: low-volume, technically capable customers who can migrate quickly on their own; high-volume accounts where a failed migration is the costliest outcome and who need one-on-one support; and low-volume, low-resource long-tail accounts who are easiest to miss and need automated reminders. I'd put resources against the high-volume group first, because their migration risk is directly our business risk.
>
> **Finally, talk about execution rhythm.** I'd run four phases: add a deprecation warning header and publish a migration guide, reach out directly to high-volume accounts with hands-on migration support, set a "soft deadline" partway through where the system throws louder warnings without rejecting requests yet, and only then the real sunset date. Throughout, I'd watch the weekly decline curve of old-version traffic — if one customer segment is clearly lagging, that means our communication or tooling isn't working, and I'd rather push the sunset date than let a customer's production environment break on shutdown day.

### Self-Check Before You Answer

| Checklist item | Covered? |
|---|---|
| Clarified the nature of the change (security vs. refactor) and its effect on timeline | |
| Segmented impact using actual call-volume data, not treated everyone the same | |
| Considered a compatibility layer to absorb part of the breaking change, rather than forcing a full cutover | |
| Proposed a concrete phased plan (warning → outreach → soft deadline → shutdown) | |
| Defined a leading indicator (migrated-traffic share), not just "did we announce it" | |
| Bonus: noted that the sunset date has to be one you'll actually enforce, not a hollow notice | |

## Today's Case Study

**Stripe: date-named API versions hand the "when to upgrade" decision back to developers**

Stripe's API has never forced an account to upgrade since 2011. The mechanism: on an account's very first API call, it's automatically pinned to whatever API version is current at that moment; from then on, every request from that account uses the pinned version unless the developer explicitly overrides it with a `Stripe-Version` header or upgrades manually in the dashboard. When Stripe ships a breaking change, it doesn't rewrite the existing endpoint — it adds a new, date-named version (like `2017-02-14`) and a matching "version-change module" in the request pipeline. The system starts from the latest version and walks backward, applying each version-change module in sequence until it reaches whatever version the caller is pinned to. The result: Stripe only maintains one current implementation internally, while an account that integrated in 2015 still sees 2015-shaped responses today (sources: Stripe's engineering blog, "APIs as infrastructure: future-proofing Stripe with versioning," and Stripe engineer Brandur Leach's post, "Why Doesn't Stripe Automatically Upgrade API Versions?"). Starting in September 2024, Stripe made this cadence explicit: monthly releases with no breaking changes, plus two named major releases a year that do carry breaking changes (for example, the 2024-09-30 "acacia" release) — developers can safely upgrade to any monthly release without touching their code, and only need to evaluate compatibility for a major release (source: Stripe's API Reference, "Versioning").

**Interview angle**: this case is strong ammunition for "how do you keep evolving an API without breaking existing customers" — the core argument is that version compatibility becomes an architectural responsibility (the version-change modules), not something customers are asked to absorb on the company's release schedule. It also works for "how do you balance engineering velocity with customer trust," since Stripe is effectively trading internal engineering complexity (maintaining the translation layer) for zero migration cost on the developer side.

## Further Reading

- [APIs as infrastructure: future-proofing Stripe with versioning](https://stripe.com/blog/api-versioning) — Stripe's own account of how version pinning and version-change modules work.
- [Why Doesn't Stripe Automatically Upgrade API Versions?](https://brandur.org/api-upgrades) — former Stripe engineer Brandur Leach explains why automatic upgrades aren't used, and the middle-ground options that would be theoretically possible.
- [Technical PM interview questions I'd actually ask](https://producthq.org/career/technical-product-manager/technical-product-manager-interview-questions) — source for today's practice question and the API decision framework.

## References

- [APIs as infrastructure: future-proofing Stripe with versioning — Stripe Blog](https://stripe.com/blog/api-versioning) — source for today's case: version pinning and version-change modules.
- [Why Doesn't Stripe Automatically Upgrade API Versions? — brandur.org](https://brandur.org/api-upgrades) — source for the detail that an account is pinned on its first API call.
- [Versioning — Stripe API Reference](https://docs.stripe.com/api/versioning) — source for the 2024 monthly-release / annual-major-release cadence.
- [Technical PM interview questions I'd actually ask — Product HQ](https://producthq.org/career/technical-product-manager/technical-product-manager-interview-questions) — source for today's practice question and the Use Case → Contract → Compatibility → Operability → DX framework.
- [Technical Product Manager Interview Preparation — AI Interviewer](https://ai-interviewer.tech/blog/technical-product-manager-interview-preparation) — source for the API-lifecycle depth (usage data, migration guides, an enforced sunset date).
