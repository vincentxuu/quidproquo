---
title: "Product Builder Interview Daily — 2026-10-10: Technical PM"
date: 2026-10-10
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: en
description: "Practicing a Use Case → Contract → Compatibility → Operability → DX framework on a question adapted from Stripe's real API versioning history, with Stripe's own case study of rolling dated versions and version change modules shipping nearly a hundred breaking upgrades in six years without disrupting existing integrations."
tldr: "Technical PM interviews on API design aren't testing whether you can draw an architecture diagram — they're testing whether you can keep moving a system forward without breaking a single existing integration. Today's practice question is adapted from Stripe's real history: 'You need to swap a boolean field for an enum, but thousands of third-party integrations already depend on the old shape. How do you plan this change?' The answer framework is Use Case → Contract → Compatibility → Operability → DX: figure out who's calling and what the contract actually guarantees first, then decide the compatibility strategy, the ongoing maintenance cost, and how to communicate the change to developers. The case study is Stripe itself: since the company's founding in 2011 it has maintained compatibility with every API version, skipping v1/v2/v3-style major versions in favor of rolling, date-named versions, with every breaking change encapsulated in its own version change module — nearly a hundred breaking upgrades in six years, almost none of them felt by existing integrations."
series:
  name: "Product Builder Interview Daily"
  order: 52
---

> 🌏 [中文版](/posts/daily/2026-10-10-product-builder-interview-daily)

## Today's Focus

The place Technical PM interviews on API design most often expose a shallow answer isn't "should we use REST or GraphQL" — it's the follow-up: "this field change breaks every customer already on the old format, what do you do?" By 2026, fewer interviewers care whether you understand system architecture in the abstract; more of them want to know whether you can keep shipping changes when the interface is already load-bearing for thousands of third-party integrations. Most Technical PMs aren't designing a brand-new system from scratch — they're figuring out how to keep moving forward on one that's already welded in place by everyone depending on it.

## Framework Cheat Sheet

The **API and technical trade-off framework** doesn't just say "consider compatibility" — it walks through five dimensions in order, turning the abstract goal of "don't break customers" into a sequence of concrete design decisions:

| Dimension | Question | What it decides |
|------|----------|------------------|
| Use Case | Who's calling this API, for what job, and what are their latency and consistency needs? | Which group of users this change actually affects |
| Contract | What are the current fields, types, error codes, and pagination behavior? | What absolutely cannot change |
| Compatibility | Major versions (v1/v2/v3) or incremental, rolling versions? Should old clients get auto-pinned to their existing version? | The pace of rollout and the upgrade cost for users |
| Operability | How long do old versions get maintained, who owns that, and does the cost stay bounded over time? | Whether and how to encapsulate the compatibility logic |
| DX (developer experience) | How do docs, changelogs, and warnings tell developers what's changing before it hits them? | The concrete mechanism for communicating the change |

The point of this framework is that backward compatibility isn't a binary yes/no choice. You first separate who's actually calling and where the contract's edges are, and only then decide the rollout pace and how to keep maintenance cost from growing linearly with the number of versions you're carrying.

## Today's Practice Question

### The Question

"Your API has a bank account object with a boolean field called `verified`. Product now needs more granular states — pending, in review, verified, failed — so you're planning to replace `verified` with an enum-typed `status` field. The API already has thousands of third-party developers calling it in production, and your company's core promise is 'we never break an existing integration.' How do you plan this change?"

(Source: adapted from Stripe's official engineering blog post, *APIs as infrastructure: future-proofing Stripe with versioning*, which documents the real history — Stripe did replace a bank account's `verified` boolean with a `status` field back in 2014)

### How to Break It Down

1. **Clarify the problem**: Ask what share of existing integrations actually read the `verified` field today, whether the new `status` enum's possible values will grow over time (which affects whether it should be declared an "open" enum), and whether this change has any side effects beyond the field itself.
2. **Define the users**: Split callers into two groups — brand-new integrations that haven't hard-coded any assumptions yet, and integrations that have been live for years, possibly with code nobody actively maintains anymore. New integrations can just use the new contract; the old ones are what your compatibility design actually needs to protect.
3. **Structure the analysis**: Work through Contract → Compatibility → Operability → DX in order. Contract: the `verified` field's type and name can't silently disappear. Compatibility: instead of a one-time major version bump (which effectively forces everyone to re-integrate), use rolling, date-named versions, where each version carries only a small batch of changes. Operability: encapsulate the conversion logic for this specific change into its own, isolated "version change module" rather than scattering if-else checks through core code paths. DX: docs and changelogs should automatically flag "your current version is missing this field."
4. **Propose a plan**: Auto-pin new accounts to the latest version the first time they call the API; leave existing accounts pinned to whatever version they're already on until they choose to upgrade. In between, a dedicated transformation module walks the response "backward in time" at generation time, converting the new shape into whatever the caller's pinned version expects — so core code can always be written against the latest semantics, with zero compatibility branching cluttering it.
5. **Define success**: Track whether the share of accounts still pinned to older versions is naturally trending down over time (proof the compatibility layer hasn't become a permanent liability), whether the number of version change modules stays bounded (rather than accumulating linearly into technical debt that slows down new feature work), and whether this change produced any support tickets or complaints tied to compatibility.

### Sample Answer (something you could actually say in the interview)

> **Frame the scope first.** I wouldn't treat this as "should we make this change" — it's "how do we make this change invisible to everyone already depending on the old contract." I'd want to know how many existing integrations actually read `verified` today and what assumptions their code has baked in, because compatibility design isn't protecting some abstract "all users" — it's protecting this specific group that depends on the old shape.
>
> **Then talk about how I'd break it down.** I wouldn't force a major version bump that turns a small field change into a migration project for every single customer. I'd use rolling, date-named versions, so this change is just one of many small versions over time — new accounts auto-pin to the latest version, existing accounts stay pinned to whatever they're already on, and a dedicated, isolated transformation module bridges the two. That conversion logic lives in exactly one place; it never spreads into core code as scattered version checks that turn into spaghetti.
>
> **Finally, how I'd know it worked.** I'd track whether the share of accounts still on the old version is naturally declining over time — that tells me the compatibility layer isn't turning into a permanent burden. I'd watch the number of version change modules; if that count climbs linearly out of control, it means we're trading compatibility for unsustainable maintenance cost and need to revisit a deprecation timeline for old versions. And I'd make sure docs and changelogs proactively tell logged-in developers "your current version is missing this field" — moving the cost of communicating the change from manual support tickets to something the system handles automatically.

### Self-Check

Use this table to check whether your answer covered the key points:

| Check item | Covered? |
|---|---|
| Clarified who depends on the old field, and how deeply | |
| Distinguished new integrations from existing ones | |
| Used Contract/Compatibility/Operability/DX to structure the rollout strategy | |
| Proposed a concrete version-rollout mechanism, not just "we'll do good version management" | |
| Defined measurable success metrics (declining old-version share, bounded module count, support ticket volume) | |
| Bonus: explicitly named that compatibility isn't free and needs a real deprecation timeline | |

## Today's Case Study

**Stripe: nearly a hundred breaking upgrades in six years, almost invisible to customers**

Stripe has committed to maintaining compatibility with every API version since the company's founding in 2011. It skipped the common `v1`/`v2`/`v3` major-version scheme entirely — major versions tend to bundle changes so large that upgrading is almost as painful as re-integrating from scratch, and some share of users inevitably get stuck on an old version, forcing Stripe to choose between cutting them off or maintaining that version forever. Instead, Stripe uses rolling versions named by release date (like `2017-05-24`), where each one carries only a small batch of breaking changes, turning an upgrade into a staircase instead of a cliff. The first time a user calls the API, their account is automatically pinned to the latest available version, and every subsequent call implicitly uses that version unless they override it with a `Stripe-Version` header or manually upgrade from the dashboard. The real design insight is underneath: every breaking change is encapsulated in its own "version change module," so core code is always written against the latest semantics with no scattered version branching. When generating a response, the system walks backward through time, applying each relevant version change module in order, until it reaches the format the caller's pinned version expects. That mechanism let Stripe ship nearly a hundred breaking upgrades over six years with almost no disruption to existing integrations (source: Stripe's official engineering blog).

**Interview angle**: Use this case directly for questions about how to keep evolving an API that already has massive third-party dependency. It proves that "backward compatibility" isn't freezing the interface in place — it's encapsulating the complexity of change into a bounded mechanism, so core code stays clean while old customers remain completely unaffected until they're ready to move.

## Further Reading

- [Technical PM interview questions I'd actually ask — Product HQ](https://producthq.org/career/technical-product-manager/technical-product-manager-interview-questions) — The full write-up of the system-design-lite, API-and-trade-off, and engineering-prioritization frameworks and question bank that today's framework and practice question are drawn from.
- [Preparing for Stripe API upgrades — Stripe Dot Dev Blog](https://stripe.dev/blog/prepare-for-api-upgrades) — The same versioning mechanism from the developer's (not the API provider's) side, filling in the practical "DX" piece of today's case study.
- [Versioning — Stripe API Reference](https://docs.stripe.com/api/versioning) — How this mechanism evolved after 2024: monthly releases with no breaking changes, plus one major breaking release twice a year — a real example of the "Operability" dimension adjusting its own pace over time.

## References

- [APIs as infrastructure: future-proofing Stripe with versioning — Stripe Blog](https://stripe.com/blog/api-versioning) — Source of today's case study: the real history of the `verified` → `status` field change, and the details of the rolling dated version and version change module mechanism.
- [Technical PM interview questions I'd actually ask — Product HQ](https://producthq.org/career/technical-product-manager/technical-product-manager-interview-questions) — Source of today's core framework, "Use Case → Contract → Compatibility → Operability → DX," mapped onto today's practice question breakdown.
- [Versioning — Stripe API Reference](https://docs.stripe.com/api/versioning) — Source of the versioning-mechanism evolution detail referenced in Further Reading.
