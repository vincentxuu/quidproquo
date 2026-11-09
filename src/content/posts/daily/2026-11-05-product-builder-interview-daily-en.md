---
title: "Product Builder Interview Daily — 2026-11-05: AI Product Design"
date: 2026-11-05
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: en
description: "Use a three-question risk-tiering test — reversibility, auditability, blast radius — to decide whether an AI agent's action should run on its own or wait for human approval, then practice redesigning a support refund agent's approval flow."
tldr: "Today's core framework is risk tiering: three gates — reversibility, auditability, and blast radius — decide whether an AI agent's action runs on its own or waits for a human. The practice question is redesigning the approval flow for a customer-support refund agent."
series:
  name: "Product Builder 面試日練"
  order: 78
---

> 🌏 [中文版](/posts/daily/2026-11-05-product-builder-interview-daily)

## Today's Focus

After 2026's wave of enterprise AI agent rollouts, "AI product design" interview questions rarely stay abstract — they hand you a concrete scenario and ask whether a specific action should run on its own or wait for a human. Kore.ai surveyed over 400 US enterprise IT leaders this May: 79% said they'd had to roll back an action an AI agent took, and 70% had hit a failure their own team didn't catch. Interviewers now have a stack of real failure cases to pull from, so chanting "human-in-the-loop" isn't enough — you need a concrete tiering rule you can actually defend.

## Core Frameworks

### Framework 1: Human-AI Task Allocation (risk tiers)

Tier an AI agent's actions by "can this be undone if it's wrong," and gate each tier differently:

| Tier | Example | Gate |
|------|------|---------|
| Read | Look up an order, search documents | No gate, but scoped to what the user is allowed to see |
| Suggest / draft | Draft a reply, propose a ledger entry | No gate — the output is text, a human still decides whether to send it |
| Reversible write | Tag a ticket, create a draft | Light gate: confirm, and make it easy to undo |
| Hard-to-reverse write | Refund, send an external message, delete a record | Explicit approval: show the exact action, the before/after, and the agent's stated reason |

(This table reconciles three 2026 pieces — from Orbilon, Nordbeam, and Arize — that each use slightly different wording but land on the same conclusion: gate by consequence, not uniformly.)

### Framework 2: Trust Calibration — three questions

To decide whether an action belongs in the "hard-to-reverse" tier, ask three questions (from Viktor's 2026 decision rule):

1. **Reversibility**: Can the system undo the final step within a minute? If not, gate it first.
2. **Auditability**: Can a reviewer check the result faster than redoing the work? If not, require the agent to attach evidence — don't rely on trust alone.
3. **Blast radius**: If this goes wrong, who's affected besides the person who asked? If the answer includes customers, money, or production, a human should hold the call.

```diagram
title: Should an AI agent's action wait for approval
desc: Two gates — reversibility and blast radius — decide whether an AI agent's action can run on its own, or needs a human to sign off
caption: Simplified: the full version also has an auditability gate ("can review beat redo"), covered in the three questions above
step: Agent is about to act
step: Check whether it can be undone within a minute
step: If reversible, run it and just log it
step: If not reversible, check blast radius next
step: If the blast radius is small, run it with periodic spot-checks
step: If it reaches customers or money, wait for a human
---
<svg viewBox="0 0 640 480">
  <path class="dg-line" d="M280 34V60" marker-end="url(#arrow)" data-step="1"/>
  <path class="dg-line" d="M280 108V144" marker-end="url(#arrow)" data-step="2"/>
  <path class="dg-line dg-line--accent" d="M376 188H432" marker-end="url(#arrow-accent)" data-step="3"/>
  <path class="dg-line" d="M280 232V268" marker-end="url(#arrow)" data-step="4"/>
  <path class="dg-line" d="M376 312H432" marker-end="url(#arrow)" data-step="5"/>
  <path class="dg-line dg-line--warn" d="M280 356V392" marker-end="url(#arrow-warn)" data-step="6"/>

  <circle class="dg-dot" cx="280" cy="28" r="6" data-step="1"/>

  <g data-step="1">
    <rect class="dg-box" x="160" y="60" width="240" height="48" rx="6"/>
    <text class="dg-label" x="280" y="84" text-anchor="middle" dominant-baseline="central">Agent wants to act</text>
  </g>

  <g data-step="2">
    <path class="dg-box" d="M280 144L376 188L280 232L184 188Z"/>
    <text class="dg-label" x="280" y="178" text-anchor="middle" dominant-baseline="central">Undo in a minute?</text>
    <text class="dg-sub" x="280" y="200" text-anchor="middle" dominant-baseline="central">Reversibility</text>
  </g>

  <g data-step="3">
    <rect class="dg-box dg-box--accent" x="432" y="164" width="184" height="48" rx="6"/>
    <text class="dg-label" x="524" y="188" text-anchor="middle" dominant-baseline="central">Run it, just log it</text>
  </g>

  <g data-step="4">
    <path class="dg-box" d="M280 268L376 312L280 356L184 312Z"/>
    <text class="dg-label" x="280" y="302" text-anchor="middle" dominant-baseline="central">Hits customers or money?</text>
    <text class="dg-sub" x="280" y="324" text-anchor="middle" dominant-baseline="central">Blast radius</text>
  </g>

  <g data-step="5">
    <rect class="dg-box" x="432" y="288" width="184" height="48" rx="6"/>
    <text class="dg-label" x="524" y="312" text-anchor="middle" dominant-baseline="central">Run it, spot-check later</text>
  </g>

  <g data-step="6">
    <rect class="dg-box dg-box--warn" x="152" y="392" width="256" height="64" rx="6"/>
    <text class="dg-label" x="280" y="412" text-anchor="middle" dominant-baseline="central">Wait for approval</text>
    <text class="dg-sub" x="280" y="434" text-anchor="middle" dominant-baseline="central">With reason + before/after</text>
  </g>

  <text class="dg-edge" x="404" y="176" text-anchor="middle" dominant-baseline="central" data-step="3">Yes</text>
  <text class="dg-edge" x="290" y="250" text-anchor="start" dominant-baseline="central" data-step="4">No</text>
  <text class="dg-edge" x="404" y="300" text-anchor="middle" dominant-baseline="central" data-step="5">No</text>
  <text class="dg-edge dg-text--warn" x="290" y="374" text-anchor="start" dominant-baseline="central" data-step="6">Yes</text>
</svg>
```

Behind these three questions is one insight: **over-trust and under-trust are both design failures — they just cost differently.** Gate every action and the cost is a buried manager and a neutered agent; release every action and the cost is one bad refund wrecking customer trust. The interview is testing whether you can turn that abstract trade-off into a concrete tiering table.

## Today's Practice Question

### The Question

"Your customer-support AI agent currently requires human approval for every action — looking up an order, drafting a reply, updating a ticket, issuing a refund — all gated the same way. The support lead approves about sixty items a day, most of them mechanical copy-paste, and after a month is approving almost everything within seconds without really reading it. The lead is complaining that headcount is stuck on approvals, but the product team worries that loosening the gate will turn a bad refund into a trust crisis. How would you redesign this approval flow?" (Source: self-authored, adapted from a real customer-support refund agent approval redesign described in codestringers.com's "Human in the Loop AI: Gate the Irreversible Step.")

### How to Break It Down

1. **Clarify the problem**: Ask what kinds of actions are currently gated, what share each takes, and what fraction has actually been overturned or edited by the lead — that tells you which actions have simply never caused a problem.
2. **Define who's affected**: who's doing the reviewing (the support lead), who bears the risk (customer trust, company finances), and who's hurt by the current bottleneck (the lead's time, the agent's responsiveness).
3. **Structure the analysis**: apply the risk-tiering table and sort read, draft, ticket-update, and refund into the four tiers — not by "AI feature" or "department," which have nothing to do with risk.
4. **Propose a plan**: let read and draft run fully on their own; gate ticket updates lightly with confirm-and-undo; require refunds and outbound messages to show the full before/after and the agent's stated reason before release.
5. **Define success**: approval volume should drop to a level the lead can actually review carefully — not rubber-stamp — while the refund-error rate and complaint volume must not rise as a result of loosening the gate.

### A Sample Answer (how to actually say this in the interview)

> **Start by splitting apart what "approval" even means here.** "I'd pull the last month of approval logs first. I'd bet reads and drafts have almost never been overturned or edited, and the only actions that actually need human judgment are refunds and outbound messages — but right now all four action types are mixed into the same queue, which is why the lead is burning out reviewing sixty items a day."
>
> **Then apply risk tiering.** "Reads — looking up orders, searching history — run fully on their own, because a wrong lookup has zero downstream cost. Drafts also run freely, since they're just text a human still reviews before sending. I'd make ticket-status updates run automatically with logging and one-click undo, because a mislabeled ticket is cheap to fix. Only refunds and outbound messages — the hard-to-reverse actions that touch customers and company money directly — require explicit approval, and the approval screen has to show the agent's reasoning, the amount, and the customer's history, not just an 'approve/reject' button."
>
> **Trade-offs and risk.** "This should drop the lead's daily review count from sixty to single digits, but each one would get genuine scrutiny instead of a rubber stamp. The risk is that in the first two weeks we might catch a few edge cases that should've stayed gated at the ticket-update tier — so I'd roll this out at 10% traffic first, watch the refund-error rate and complaint volume closely, and only go to full rollout once neither has actually gone up."

### Self-Check Checklist

Use this table to check whether your answer missed anything important:

| Check item | Covered? |
|---------|---------|
| Did you first break down existing approval actions and how often each was actually overturned | |
| Did you apply consequence-based tiering instead of gating everything uniformly | |
| Did you specify exactly which actions run freely vs. require approval, and what the approval screen shows | |
| Success metric: lower approval volume + error/complaint rate that doesn't rise | |
| Did you address risk and edge cases: a gradual rollout, how to catch edge cases | |
| Bonus: did you name over-trust and under-trust as symmetric design failures, not something you only guard against on one side | |

## Today's Case

**A ~120-person B2B company's refund agent: redesigning the approval tiers**

This company originally required human approval for every single agent action. The support lead was approving around sixty items a day, and within a month was clicking approve on nearly all of them within seconds — the review had become a rubber stamp in all but name. After the redesign, actions were split into three tiers: reads and drafts run freely, with only a 10% sample shown to the lead for spot-checking; ticket and order-note updates count as reversible writes — logged, but not gated; only the refund itself and outbound customer messages — the hard-to-reverse actions — require a human to review the order, the policy clause the agent relied on, and the amount before release. After the redesign, the lead reviews about fifteen items a day, rejecting or amending roughly one in eight — the review finally became a real judgment call instead of a formality.

**Interview angle**: This case is a direct answer to "how would you design the human-AI collaboration boundary for an AI feature." It shows you can turn an abstract "human-in-the-loop" principle into an executable tiering rule with concrete numbers (review volume, rejection rate) — not just land on "everything needs human review," which carries no trade-off at all.

## Further Reading

- [Human in the Loop AI: Gate the Irreversible Step](https://www.codestringers.com/articles/human-in-the-loop-put-the-gate-at-the-irreversible-step) — the full refund-agent tiering redesign behind today's case.
- [What AI Agents Cannot Do Yet: An Honest Take (2026)](https://viktor.com/blog/what-ai-agents-cant-do) — source of the three-question framework (reversibility, auditability, blast radius) in today's practice question.
- [AI Product Designer: Role, Skills, Salary & Challenges (2026)](https://provn.co/roles/product-designer) — on trust calibration as a formal AI product designer responsibility, and the EU AI Act Article 50 disclosure obligation.

## References

- [79% of Enterprises Have Undone an AI Agent's Action](https://orbilontech.com/ai-agent-rollback-audit-trail) — the Kore.ai 79%/70% survey figures cited at the top of today's focus.
- [Human in the Loop AI: Gate the Irreversible Step](https://www.codestringers.com/articles/human-in-the-loop-put-the-gate-at-the-irreversible-step) — source of the core risk-tiering table and today's case.
- [What AI Agents Cannot Do Yet: An Honest Take (2026)](https://viktor.com/blog/what-ai-agents-cant-do) — original source of the three-question Trust Calibration test.
- [Human-in-the-Loop AI Agents: Approval Design](https://nordbeam.io/blog/human-in-the-loop-ai-agents) — cross-check source for the risk-tiering table.
- [What Are AI Agents? Architecture, Tools & How They Work](https://arize.com/ai-agents) — second cross-check source for the risk-tiering table.
