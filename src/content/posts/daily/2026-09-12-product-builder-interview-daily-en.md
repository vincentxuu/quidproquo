---
title: "Product Builder Interview Daily — 2026-09-12: Technical PM"
date: 2026-09-12
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: en
description: "Today's Technical PM practice: use the RFC process and Architecture Decision Records to make engineering judgment traceable, then practice an API design question about a partner's timeout retries causing duplicate orders — with a case study of how Stripe solved the same problem with an Idempotency-Key header."
tldr: "The easiest way to fumble a Technical PM question is to frame technical judgment as either \"engineering decides\" or \"I decide alone,\" without naming how you open the decision process to the team without losing direction. Today we use the RFC process to converge input from multiple stakeholders, and Architecture Decision Records to preserve the reasoning behind a decision, then practice an API design question about a partner system that auto-retries after a timeout and ends up creating duplicate orders — how do you make the retry safe, and how do you know the fix actually worked. The case study is Stripe's Idempotency-Key header: the same problem, solved on their payments API for a decade now, and still the reference answer people reach for on this exact question."
series:
  name: "Product Builder 面試日練"
  order: 24
---

> 🌏 [中文版](/posts/daily/2026-09-12-product-builder-interview-daily)

## Today's Topic

The Technical PM round isn't testing whether you understand technology — it's testing whether, given a real system constraint, you can drive a solution that engineering will actually accept and that someone reading it six months later can still understand. Most candidates default to one of two extremes: "I don't understand this, let engineering decide" or "I'll just call it and engineering executes." The interviewer's next question is always "so how do you get a senior engineer who disagrees to sign off."

Today we use the RFC process to open a technical decision up for comment and converge disagreement, then use an Architecture Decision Record (ADR) to write down the reasoning — so a Technical PM answer stops being a claim of technical fluency and starts having a real collaboration mechanism and a traceable record behind it.

## Core Frameworks

### The RFC Process (Request for Comments)

A technical decision shouldn't be made by one person in a room — it should be laid out in a document where everyone it affects can surface disagreement in writing:

| Phase | What happens | The Technical PM's role |
|------|------|------|
| Draft | Write the problem, the goal, the constraints, and at least two options with their trade-offs | Co-write with the eng lead, translating business constraints into technical-constraint language |
| Open comment | Set a fixed window (e.g. 3-5 days) for every stakeholder to comment | Proactively tag downstream teams who'll be affected — don't wait for them to notice on their own |
| Converge | Reply to every point of disagreement with a stated position, rather than accepting all of it | Judge which comments are preference and which are real risk — don't split the difference on everything |
| Finalize and announce | Mark the RFC as accepted, and write the decision back into an ADR | Make sure the decision has a traceable record instead of living only in chat messages |

**Common mistake**: treating the RFC as a rubber-stamp formality — nobody actually reads it during the comment window, or the owner avoids engaging with disagreement, and the decision ends up settled by whoever has more authority in the room rather than by the argument in the document.

### Architecture Decision Records (ADR)

An ADR's job is to preserve *why*, not just *what* — so someone six months from now (possibly you) can understand the trade-off that was made. Michael Nygard's four-section format from 2011 is still the industry standard:

1. **Context**: what constraints existed at the time, why this decision had to be made now
2. **Decision**: what was decided, stated in one clear sentence
3. **Status**: proposed / accepted / superseded — a decision isn't permanent; a later ADR can replace it
4. **Consequences**: the benefits and costs that follow from the decision, including the parts you might come to regret

**Common mistake**: writing only the Decision section, skipping Context and Consequences — six months later nobody knows why the other option wasn't chosen, and the same debate happens all over again.

## Today's Practice Question

### The Question

"You own the order API for a B2B platform. When a partner's system doesn't get a response before its timeout, it automatically retries the same request. After launch, you find that this retry behavior is causing duplicate orders for some partners, and support complaints are rising. How would you design the API to make retries safe, and how would you know the fix actually worked?"

(Question type: API design / technical trade-off; self-authored based on a retry / duplicate-order scenario common in Technical PM interview question banks)

### How to Break It Down

1. **Clarify the scope**: First pin down where the retry happens — is it the partner's SDK auto-retrying, or logic they wrote themselves? How long is the timeout window? Does the current API have any deduplication mechanism at all, or none?
2. **Define the user**: The user here is the partner engineering team integrating the API, not the end consumer. Most partners can't quickly change their own retry logic, so the fix needs to work without requiring much cooperation on their end.
3. **Structure the analysis**: The core problem is that the server needs to tell apart "a second attempt at the same logical request" from "the user genuinely wants to place a second order." That means deciding where the dedup key lives, how long it's valid, where it's stored, and how to handle the conflicting case where the same key arrives with different content.
4. **Propose the mechanism**: Require callers to send an Idempotency-Key header, and have the server cache the result for that key for a window (say, 24 hours) — a retry with the same key gets the original result back without re-running the order logic; the same key with different content gets an explicit error instead of silently overwriting with the new content.
5. **Define success**: After launch, track whether duplicate-order complaints and timeout-retry-driven support tickets go down. Also watch average API latency, since the added cache lookup could slow things down — fixing one problem while slowing every request isn't actually a fix.

### Sample Answer (say it like this in the interview)

> **Clarifying the scope**: "I'd first confirm where the retry is happening — is it built into the partner's official SDK, or logic they wrote themselves? How long is the timeout window? Does the API currently have zero dedup mechanism, or one that just doesn't handle this case well? That tells me whether I need every partner to change their retry logic, or whether I should pull dedup responsibility entirely onto our side."
>
> **Designing the fix**: "I'd lean toward owning dedup at the API layer, because expecting every partner to simultaneously change their retry logic isn't realistic. Concretely: every order request carries an Idempotency-Key, and the server checks whether that key has already been processed — if so, it returns the original result without re-running the order logic. If the same key shows up with different order content, I'd return an explicit error rather than guessing at intent, because guessing wrong costs more than asking the caller to confirm again."
>
> **Defining success and risk**: "After launch I'd watch two metrics — duplicate-order complaints and timeout-retry-driven support tickets — both should trend down. But I'd also watch average API latency, because the added dedup lookup is a cost, and if latency rises meaningfully, that means we traded performance for correctness at a bad rate and need to redesign the storage layer rather than accept it. I'd write this decision up as an ADR — recording why we chose server-side dedup over asking partners to fix their retry logic — so nobody reopens the same debate in six months."

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|-----------------|----------|
| Distinguished "network-layer retry" from "the user genuinely wants a second order" | |
| Named the idempotency key's lifecycle and storage design | |
| Explained what happens when the same key arrives with different content, instead of silently overwriting | |
| Defined concrete success metrics (complaint count, ticket volume) | |
| Considered the effect on latency/performance, not just correctness | |
| Bonus: mentioned using an RFC or ADR to communicate the decision to engineering and leave a traceable record | |

## Today's Case Study

**Stripe: making payment API retries safe with the Idempotency-Key header**

Stripe's API documentation explicitly requires callers to send an Idempotency-Key header (recommending a V4 UUID or another string with enough entropy) so the server can tell "a retry of the same logical request" apart from "a genuinely new request." In their 2017 engineering blog post "Designing robust and predictable APIs with idempotency," Stripe explained that their official Ruby library even retries automatically on failure, using the idempotency key together with increasing backoff and jitter — because in payments, the cost of a duplicate charge is far higher than the cost of waiting one more second. That design is still the core mechanism in Stripe's API today, documented in their current official reference.

**Interview connection**: this case is a real-world answer to the exact "partner timeout retries causing duplicate orders" question — use it directly to answer "give an example of an API that handles retry safety well," or use it to check whether your own proposal just reinvented a pattern Stripe already validated. The point isn't memorizing the term Idempotency-Key — it's articulating why the *asymmetric cost* (a duplicate charge vs. one extra confirmation) is what justifies pulling dedup responsibility onto the server rather than leaving it to each partner.

## Further Reading

- [Technical Product Manager Interview Questions: APIs, Metrics, Systems, and Product Trade-Offs](https://prachub.com/resources/technical-product-manager-interview-questions-apis-metrics-systems-and-product-trade-offs) — PracHub's Technical PM interview question bank, covering API contracts, system boundaries, build-versus-buy, and more
- [A Structured RFC Process](https://philcalcado.com/2018/11/19/a_structured_rfc_process.html) — Phil Calçado (former engineering leader at DigitalOcean/SoundCloud) on running an RFC process, with concrete design for the comment window and status tracking
- [Designing robust and predictable APIs with idempotency](https://stripe.com/blog/idempotency) — Stripe's official engineering blog on the reasoning and implementation behind the idempotency key mechanism

## References

- [Idempotent requests | Stripe API Reference](https://docs.stripe.com/api/idempotent_requests) — source for "Today's Case Study": Stripe's current official spec for the Idempotency-Key header
- [Designing robust and predictable APIs with idempotency](https://stripe.com/blog/idempotency) — source for "Today's Case Study": Stripe's 2017 blog post explaining the design rationale for idempotency
- [A Structured RFC Process](https://philcalcado.com/2018/11/19/a_structured_rfc_process.html) — source for "Core Frameworks": the phase design of the RFC process
- [Technical Product Manager Interview Questions: APIs, Metrics, Systems, and Product Trade-Offs](https://prachub.com/resources/technical-product-manager-interview-questions-apis-metrics-systems-and-product-trade-offs) — source for "Today's Practice Question": the retry / duplicate-order scenario
