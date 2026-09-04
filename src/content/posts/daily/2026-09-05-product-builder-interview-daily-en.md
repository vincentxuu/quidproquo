---
title: "Product Builder Interview Daily — 2026-09-05: Technical PM"
date: 2026-09-05
category: daily
type: digest
tags: [product-builder-interview, daily, technical-pm]
lang: en
description: "Today's Technical PM interview practice: use the RFC process and Architecture Decision Records — two engineering collaboration frameworks — to work through a real Stripe interview question, 'design a ledger service,' and look at how Figma chose a CRDT-inspired hybrid model for multiplayer instead of copying Google Docs' OT or adopting pure CRDTs."
tldr: "Technical PM interviews don't test whether you can design systems — they test whether you can discuss trade-offs with engineers in the same language. Today we use the RFC process (Draft-Review-Decision-Implementation) to practice narrowing a technical discussion, and the Architecture Decision Record (Context-Decision-Consequences-Alternatives) to practice writing up a technical trade-off clearly and traceably — practicing a real Stripe technical-round question from Exponent: design a ledger service."
series:
  name: "Product Builder 面試日練"
  order: 17
---

> 🌏 [中文版](/posts/daily/2026-09-05-product-builder-interview-daily)

## Today's Topic

A 2026 MentorCruise analysis points to a shift: the "technical round" in PM interviews has gone from a nice-to-have to a baseline requirement. The IPL's 2025 Product Management Hiring Trends report — drawn from 110+ hiring events at Google, Microsoft, Salesforce, and others — lists technical fluency as a "basic requirement" and data analysis as a "usual prerequisite." That's a different claim than "it helps."

That doesn't mean PMs need to design systems or write code. Best PM Jobs' technical interview guide is explicit about this: the goal isn't to make you draw architecture diagrams like an engineer, but to prove you can have an informed technical discussion, understand trade-offs, and ask good questions — in other words, whether you can sit at the same decision-making table as engineers, not whether you can replace them. Today we practice this with two tools engineering teams actually use for collaboration.

## Core Frameworks

### The RFC Process: narrowing a technical discussion into a decision

An RFC (Request for Comments) is the process engineering teams use before a major architecture or interface change: write a document, invite broad comment, then converge on a decision. A PM is rarely the RFC's author, but is often the person who keeps the discussion from losing focus:

| Stage | What happens | The PM's role |
|-------|---------------|------|
| **Draft** | Engineers write up the problem, goals, constraints, and an initial proposal | Supply business goals and constraints (timeline, budget, regulation) so the proposal doesn't drift from user needs |
| **Review** | Team members comment, propose alternatives, challenge assumptions | Clarify which users and scenarios are affected, pulling a diverging technical debate back to the product goal |
| **Decision** | Converge on one approach, recording rejected alternatives and why | Confirm the trade-off matches priorities; arbitrate conflicts between "the engineering ideal" and "time to market" when needed |
| **Implementation** | Build against the decision, revising the RFC if new information surfaces | Track whether scope is quietly creeping and whether the delivery still matches the original decision |

### Architecture Decision Records: writing a technical trade-off so anyone can follow it

An ADR is a short document that records why a technical decision was made, usually in four sections:

1. **Context**: the constraints and pressures at the time (e.g., existing system latency is already hurting conversion).
2. **Decision**: the specific choice made (e.g., switch to an asynchronous queue for writes instead of a synchronous call).
3. **Alternatives Considered**: the options that were rejected and why, so nobody re-proposes the same already-discussed option six months later.
4. **Consequences**: the benefits and costs of the decision, including technical debt it may create down the road.

The RFC answers "how should we decide," and the ADR answers "what did we decide, and why." If you're asked "tell me about a technical decision you influenced" in an interview, organizing your answer around the four ADR sections reads as far more structured — and far more convincing that you actually participated in the decision, rather than relaying an engineer's conclusion after the fact.

## Today's Practice Question

### The Question

Design a ledger service. Depending on the team, the interviewer will push you on either scalability or API design.

(Source: a real Stripe technical-round interview question featured in Exponent's "Stripe Product Manager (PM) Interview Guide")

### How to Break It Down

1. **Clarify the problem**: Ask who this ledger serves — internal balance reconciliation, or a public API for merchants to integrate against? What's the transaction volume (requests per second, peak-to-average ratio)? This determines whether you prioritize consistency or throughput first.
2. **Define the users**: There are at least two roles to consider separately — developers calling the API (who care about clear documentation and debuggable error messages), and finance/risk teams relying on the ledger's correctness for reconciliation (who care that data is never wrong or missing).
3. **Structure the analysis**: The core trade-off for a ledger is correctness versus latency. Financial ledgers typically use immutable, append-only records with double-entry bookkeeping for every transaction, guaranteeing debits and credits balance so that even after a crash, replaying events reconstructs the correct balance — at the cost of a slower write path than directly mutating a balance field.
4. **Propose a solution**: Require callers to pass an idempotency key on every write, preventing network retries from double-posting a transaction — this is standard practice across payment APIs. Separate the read path (current balance lookups) from the write path (new transactions) so each can scale independently.
5. **Define success**: Success isn't raw QPS — it's that the ledger can always be recomputed to a consistent result, that reconciliation discrepancies trend to zero, and that developer integration failure rates stay low. Technical correctness and developer experience both need to be met for a ledger service to succeed.

### Sample Answer (say it like this in the interview)

> **Frame the problem first**: Before designing anything, I'd confirm whether this ledger is for internal reconciliation or a public API that merchants call directly — that decides whether I prioritize API ergonomics or internal consistency guarantees first. Assuming it's a public API for merchants, I'd assume transaction volume will grow quickly with merchant growth, so the design needs headroom.
>
> **Break it down with a framework**: The ledger's core principle is that correctness can't be compromised, so I'd use append-only records — every transaction is an immutable entry, and the balance is derived by summing those entries rather than stored as a directly overwritable number. That way, even if a step retries or crashes, replaying the transaction log reconstructs the correct result. On the API side, I'd require every write request to carry an idempotency key, so a timeout-triggered retry never causes a duplicate charge or double-posting — a baseline defense across every payments system.
>
> **State the trade-off clearly**: This design sacrifices write latency — every transaction needs its debit and credit sides confirmed balanced before it lands, which is slower than updating a single balance field directly. I think that trade-off is worth it, because when a ledger gets the math wrong, the cost is trust and regulatory risk, not a few hundred milliseconds of user experience. Success is measured by zero reconciliation discrepancies and a low developer integration failure rate, not by chasing the highest possible QPS.

### Self-Check

Use this table to check whether your answer hit the key points:

| Checklist item | Covered? |
|-----------------|----------|
| Clarified the ledger's use case (internal reconciliation vs. public API) and transaction volume | |
| Distinguished developers (API consumers) from finance/risk (data correctness) as separate stakeholders | |
| Named the core correctness-vs-latency trade-off and explained why you picked a side | |
| Proposed concrete technical safeguards (idempotency keys, append-only records, double-entry bookkeeping) | |
| Success metrics included correctness (reconciliation discrepancy rate), not just performance (QPS) | |
| Bonus: explained how the decision affects future maintenance cost or technical debt | |

## Today's Case Study

**Figma: multiplayer that didn't copy Google Docs, and didn't force-fit a pure CRDT either**

Figma engineer Evan Wallace explained on the company's engineering blog that Figma's multiplayer system isn't a straight adoption of one existing technique. They didn't follow Google Docs' Operational Transformation approach, and they didn't adopt a textbook pure CRDT (Conflict-free Replicated Data Type — a structure that lets multiple nodes merge independently without a central server and still converge to the same result). Instead, Figma combined several CRDT concepts into a custom data structure: every object property follows a last-writer-wins rule, and layer ordering uses a floating-point position value between 0 and 1, so inserting a new layer just means averaging two existing values instead of renumbering the entire sibling list. The more critical architectural decision: every user editing the same file is routed to the same server, letting the server act as the arbiter of ordering — genuine distributed CRDT-merge logic is only invoked during crash recovery, and the normal happy path avoids the complexity of cross-node merging entirely.

**Interview connection**: This case is excellent material for "build vs. buy" and "why didn't you use an off-the-shelf solution" questions — Figma explicitly evaluated both OT and pure CRDTs before choosing a hybrid architecture tailored to its own needs (heavy layer counts, frequent position changes, low-latency visual feedback). You can map it directly onto today's ADR framework: Context is that a visual design tool's collaboration needs differ from a text editor's; Decision is the custom CRDT-inspired hybrid model; Alternatives Considered are OT and pure CRDTs; Consequences are performance better suited to layer manipulation, at the cost of maintaining a non-standard, custom data structure.

## Further Reading

- [MentorCruise: The PM Interview Has Become a Technical One](https://mentorcruise.com/blog/the-pm-interview-has-become-a-technical-one-eaba2) — analyzes the rising technical bar in PM interviews, citing the IPL's 2025 Hiring Trends report and shifts observed across multiple companies.
- [Best PM Jobs: Technical Interview for Product Managers 2026](https://www.bestpmjobs.com/resources/technical-interview-pm) — a thorough walkthrough of how much SQL, API, and system-design fundamentals a PM should know, with concrete examples.
- [Figma Blog: How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works) — the original source for today's case study, with Evan Wallace's detailed breakdown of Figma's multiplayer data structure design.

## References

- [Exponent: Stripe Product Manager (PM) Interview Guide](https://www.tryexponent.com/guides/stripe-product-manager-interview) — corresponds to the source of "Today's Practice Question."
- [MentorCruise: The PM Interview Has Become a Technical One](https://mentorcruise.com/blog/the-pm-interview-has-become-a-technical-one-eaba2) — corresponds to the trend background in "Today's Topic."
- [Figma Blog: How Figma's multiplayer technology works](https://www.figma.com/blog/how-figmas-multiplayer-technology-works) — corresponds to the technical details in "Today's Case Study."
