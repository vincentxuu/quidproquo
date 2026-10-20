---
title: "Product Builder Interview Drill — 2026-10-17: Technical PM"
date: 2026-10-17
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: en
description: "Saturday's rotation is Technical PM — practice a real Amazon review-abuse system-design question with an RFC → decision matrix → ADR framework, and look at the unverified-but-legendary 2002 Bezos API Mandate that supposedly seeded AWS."
tldr: "The hardest part of a Technical PM interview isn't drawing an architecture diagram — it's turning a room full of disagreeing engineers into one decision everyone can look up later. Today's practice question is a real one from the Exponent/Aced interview bank: design a system to detect review abuse on Amazon. The framework is RFC → decision matrix → ADR: write a short RFC per option so trade-offs are visible, score the options against agreed criteria instead of whoever argues loudest, then write the decision down so nobody re-litigates it in six months. The case is the legendary (and never formally confirmed) 2002 Bezos API Mandate — the memo that supposedly forced every Amazon team to talk only through service interfaces, and ended up seeding AWS."
series:
  name: "Product Builder Interview Daily"
  order: 59
---

> 🌏 [中文版](/posts/daily/2026-10-17-product-builder-interview-daily)

## Today's Focus

Interviewers rarely care whether you can draw an architecture diagram. What they're actually testing is whether you can take a room where engineers already disagree and turn it into one decision with a paper trail — which is why 2026 Technical PM interviews increasingly ask "how do you decide when your team disagrees" instead of pure system design. Most Technical PMs don't design systems from scratch; they facilitate a defensible call when engineers already have their own opinions.

## Framework Cheat Sheet

**RFC → decision matrix → ADR** turns "make a good technical decision" from a vague instruction into three concrete documents.

| Stage | Output | What it solves |
|---|---|---|
| RFC (Request for Comments) | Each option's advocate writes a short proposal: approach, trade-offs, migration cost | Puts disagreement on paper instead of leaving it to whoever talks loudest in the room |
| Decision matrix | 3–5 agreed-upon criteria (e.g. data-model fit, operational complexity, team expertise, migration risk, long-term scalability), scored per option | Turns "I think this is better" into something that can be checked and challenged |
| ADR (Architecture Decision Record) | Documents the context, the options, the choice made, and why | Lets an engineer who joins six months later skip re-arguing a fight that already happened |

The point isn't writing more documents — it's moving the decision authority from "whoever's loudest in the room" to "whoever's argument holds up in the matrix." That shift is the real leverage a Technical PM has in engineering collaboration.

## Today's Practice Question

### The Question

"Design a system to detect review abuse on Amazon — for example, paid positive reviews, review bombing, or bot accounts inflating ratings."

(Source: a real system-design question from the Exponent/Aced technical PM interview bank)

### Breaking It Down

1. **Clarify**: ask which kind of abuse this is — paid positive reviews, competitor review-bombing, or bot inflation. The detection signals differ completely between them, so scope it before designing anything.
2. **Define the users**: split into real buyers, whose legitimate reviews must never be wrongly removed, and the trust-and-safety team, who actually operate this system day to day — they're not bystanders.
3. **Structure the analysis**: build a decision matrix of signals — account age and history, review-posting velocity, duplicate or templated text, verified-purchase status, and the reviewer-to-seller relationship graph. Make "cost of a false positive" the single most important criterion: wrongly removing one real review costs far more than letting one suspicious review through, and that asymmetry decides which direction the whole system leans.
4. **Propose a solution**: route high-confidence cases to automatic removal and ambiguous cases to human review, instead of asking one model to carry both ends alone. That split is itself a mini RFC — laying the all-automatic and all-manual extremes side by side before picking a middle point.
5. **Define success**: track precision, recall, and the appeal-overturn rate — the metric that specifically catches a system that's wrongly removing too many real reviews. Write the threshold and the trade-off into an ADR, so the next time someone wants to tune sensitivity, they don't re-argue the original call from scratch.

### Sample Answer (how you'd actually say this in an interview)

> **Scope it first.** I wouldn't jump straight into designing a system that catches every kind of abuse. I'd ask whether this is paid positive reviews, competitor review-bombing, or bot inflation, because the signals for each are completely different, and skipping that question usually produces a system that's mediocre at all three.
>
> **Then I'd separate the two groups this touches.** Real buyers, whose normal reviews can't get caught in the net, and the trust-and-safety team, who are the actual daily operators of this system. I'd score candidates on account age, posting velocity, text duplication, verified-purchase status, and the reviewer-seller relationship graph — and I'd make "cost of a false positive" the deciding criterion, because wrongly pulling a real review costs more than missing one fake one. That asymmetry is what should drive every other design choice here.
>
> **For rollout, I wouldn't pick fully automatic or fully manual.** High-confidence cases get auto-removed, ambiguous ones route to a human reviewer, and the two sides cover each other's blind spots. I'd write down why we picked this sensitivity threshold instead of going fully automatic, so that six months from now, when someone wants to tighten or loosen it, they're reading a decision record instead of re-opening an architecture debate that already happened.

### Self-Check List

Use this table to check your answer for gaps:

| Check item | Covered? |
|---------|---------|
| Asked which kind of abuse this is before scoping the design | |
| Separated real buyers from the trust-and-safety team as two distinct users | |
| Built a decision matrix with concrete detection signals and criteria | |
| Named the false-positive-cost asymmetry as the variable that drives direction | |
| Defined measurable success metrics (precision, recall, appeal-overturn rate) | |
| Bonus: mentioned writing the decision into an ADR to avoid re-litigating it later | |

## Today's Case

**The 2002 Bezos API Mandate: a never-formally-confirmed legend that supposedly seeded AWS**

This story has circulated in Silicon Valley engineering circles for two decades, but its actual origin has never been formally confirmed — the earliest trace is a 2012 API Evangelist post, and the version most people know comes from a Steve Yegge internal post that leaked publicly in 2011. In the commonly circulated version, Jeff Bezos issued a company-wide mandate in 2002: from then on, every team had to expose its data and functionality only through service interfaces; teams could only talk to each other through those interfaces; no other form of inter-process communication was allowed — no direct linking, no reading another team's database directly, no shared memory, no back doors of any kind, with network service calls as the only permitted channel; the technology didn't matter; but every service interface had to be designed from day one to be externalizable to outside developers, no exceptions. Whether or not the memo existed in exactly that form, the behavior it describes clearly did: Amazon's teams were forced to break down internal data silos, because getting another team's functionality meant going through a well-defined, documented interface with a standard response format — not a back-channel query into someone else's database. That enforced "interface-first" discipline is widely credited as one of the preconditions that let Amazon later repackage its internal infrastructure and turn it into AWS.

**Interview angle**: use this case when asked "how would you use a technical decision to force team collaboration" or "give an example of API-first design that created a strategic moat." The point isn't "Amazon understood APIs early" — it's that one top-level architectural decision (ban the back doors, force everything through interfaces) solved an organizational-scale collaboration problem, which is exactly the same problem RFC → decision matrix → ADR solves at the scale of a single system, just applied to an entire company instead.

## Further Reading

- [30+ Technical Product Manager Interview Questions (2026 Guide) — Aced](https://www.aced.io/blog/technical-product-manager-interview-questions) — the full question bank across system design, AI/ML, technical fundamentals, and engineering partnership, with sample answers; today's practice question comes from here
- [System Design Interview Blueprint: 2026 6-Step Framework — Tech Interview](https://www.techinterview.net/blog/system-design-interview-guide) — a second system-design breakdown worth cross-training against today's RFC → decision matrix framework
- [Meta System Design Interview — IGotAnOffer](https://igotanoffer.com/blogs/tech/meta-system-design-interview) — what a big-tech system design round actually expects on high-level architecture and trade-off communication

## References

- [30+ Technical Product Manager Interview Questions (2026 Guide) — Aced](https://www.aced.io/blog/technical-product-manager-interview-questions) — source of today's practice question, "design a review-abuse detection system"
- [Technical Decision-Making Interview Questions — EM Tools](https://www.em-tools.io/interview-questions/technical-decision-making) — source of today's RFC → decision matrix → ADR framework and the five evaluation criteria (data-model fit, operational complexity, team expertise, migration risk, long-term scalability)
- [The Bezos API Mandate: Amazon's Manifesto For Externalization — Nordic APIs](https://nordicapis.com/the-bezos-api-mandate-amazons-manifesto-for-externalization/) — source of today's case, including the note that the memo's origin has never been formally confirmed
