---
title: "Product Builder Interview Drill — 2026-10-29: AI Product Design"
date: 2026-10-29
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: en
description: "Using a risk-tiered task-allocation framework, practice a real ZoomInfo PM interview question — how would you design an AI feature that helps SDRs write outreach messages — with a case built on the approval-fatigue lesson hiding inside Anthropic's own 93% approval rate for Claude Code."
tldr: "AI product design questions don't test whether you can recite the phrase human-in-the-loop. They test whether you can ask one concrete question first — how costly is a mistake here, and can this action be undone — before deciding whether AI should act on its own or stop at a draft for a human to review. The core framework is risk-tiered task allocation: sort each decision by how costly a mistake is and whether it's reversible into three tiers — high-cost, irreversible actions need approval before execution; medium-cost, reversible ones can be sampled after the fact; low-cost ones can run autonomously with only exceptions and feedback routed back. The second framework is trust calibration: the goal isn't unconditional trust in AI, nor having the user double-check every single step — it's making clear which situations deserve trust and which deserve scrutiny. A common mistake is assuming a confidence score solves this; research shows a bare confidence number rarely helps users make better calls on its own. The practice question is a real one from ZoomInfo's interview loop: 'How would you design an AI feature that helps SDRs write better outreach messages?' The walkthrough demonstrates pinning down scope first — is this draft-assist or fully autonomous sending — then using the risk-tiering framework to land on 'sending is irreversible and a bad message can alienate a real prospect,' which argues for starting with draft-assist, not a one-shot jump to full automation. The case is Anthropic's own published number: Claude Code users approve 93% of permission prompts — which Anthropic itself frames not as proof that trust calibration is working, but as a warning sign of approval fatigue, where people stop reviewing carefully once they've approved enough times."
series:
  name: "Product Builder Interview Daily"
  order: 71
---

> 🌏 [中文版](/posts/daily/2026-10-29-product-builder-interview-daily)

## Today's Focus

AI product design questions have become almost unavoidable in PM interviews over the past couple of years, because nearly every product role now asks some version of "how would you add an AI feature to this product." What these questions actually test isn't whether you know what RAG or an LLM is — it's whether you can design something users will actually trust and use, given that AI fails probabilistically rather than in clean yes/no ways. The most common way candidates lose points is treating AI like magic: talking up what the feature can do without ever addressing what happens when it's wrong. Today's drill uses two frameworks to work through a real interview question.

## Core Frameworks

### Framework 1: Risk-Tiered Task Allocation

This framework decides which steps AI should handle on its own and which need a human to look first — based on two variables crossed against each other, not gut feel.

| Cost of a mistake | Is the action reversible? | Oversight to use |
|---|---|---|
| High | No | Approve before action |
| Medium | Yes | Sample after action |
| Low | Yes | Let it run — route exceptions and feedback back |

A common mistake: seeing "AI feature" and defaulting to full automation without first asking how costly a mistake would be here, and whether it can be undone. A message that actually gets sent, or a payment that actually goes out, sits in the "high cost, irreversible" tier — that shouldn't be fully automated in version one.

### Framework 2: Trust Calibration

The goal of trust calibration is "appropriate reliance" — not unconditional trust in AI, and not having the user re-check every step either. There are two failure modes to watch for, both worth avoiding:

| Failure mode | What it looks like | How it happens |
|---|---|---|
| Automation bias (over-reliance) | Users accept AI output without checking it | The interface makes "accept" easier than "verify" |
| Supervisory collapse | Automation runs so independently that people get pushed too far out of the loop to notice when they should step in | Too much autonomy granted up front, so users gradually stop watching |

A common mistake: assuming a confidence score solves trust calibration. Research shows a confidence score can help calibrate how much someone feels they should trust an output, but it doesn't automatically translate into better decisions. What actually helps is making verification cheap — citations the user can click open and check, a clear label for "this is a draft" versus "this already happened," an explicit "I'm not sure" state with a suggested next step — rather than a bare percentage.

## Today's Practice Question

### The Question

"How would you design an AI feature that helps a Sales Development Rep (SDR) write better outreach messages?"
(Source: a real ZoomInfo PM interview question, as reported by candidates and compiled by knok.work)

### Breaking It Down

1. **Clarify the question**: First ask whether this feature is meant to "generate and send automatically" or "generate a draft the SDR reviews before sending" — this decision shapes everything downstream, and skipping it means assuming a scope that might not even be the right one.
2. **Define the users**: There are two users here whose needs pull in different directions — the SDR wants efficiency (less typing, faster sends), while the recipient (a prospect) wants to not receive something that reads like a form letter. Optimizing only for the SDR's side easily produces a feature that sends a lot of messages with a terrible reply rate.
3. **Use the risk-tiering framework to decide whether full automation is appropriate**: This action — sending a message to a real prospect — carries a high cost of error (a wrong tone or a wrong fact can alienate a prospect and damage the company's first impression) and is irreversible (once a message is sent, the recipient has already seen it; there's no pulling it back). That lands squarely in the "high cost, irreversible" tier, which argues against full automation in version one — the system should stop at "AI generates a draft, the SDR approves it before it's sent."
4. **Propose a solution**: AI generates a draft based on the prospect's public data and examples of past outreach that actually got replies, with a short note attached explaining why it was written this way (which pieces of data it drew on) so the SDR can edit it before sending. Only once the system observes that a given SDR repeatedly sends a particular category of draft nearly unedited would it consider loosening that category to "preview, then batch-approve" — not opening up full automation across the board from day one.
5. **Define success metrics**: The headline metric isn't send volume or draft-generation speed — it's reply rate, because sending fast to no response helps nobody. Track edit distance on drafts as a leading indicator too: if SDRs are heavily rewriting drafts every time, that's a sign the model isn't there yet, and automation shouldn't be widened regardless of how fast it's shipping drafts.

### Sample Answer (how this could actually sound in an interview)

> I'd start by confirming with the interviewer whether this is "AI drafts, a human sends" or "AI sends on its own," because those carry completely different risk profiles and shape everything else I'd design. **Looking at the risk first**: once an outreach message goes out, the recipient has already seen it — there's no undo. If the content gets the tone or a fact wrong, what's damaged is the company's first impression with a real prospect. That's a high-cost, irreversible action, so I wouldn't ship full auto-send in version one — I'd land on "AI drafts, the SDR approves before it sends."
>
> **The draft itself needs to make it easy for the SDR to judge whether to trust it.** I'd have the AI generate drafts using the prospect's public data — their title, recent company news — plus examples of past outreach with high reply rates, and attach a short note on "why it's written this way" so the SDR can spot-check whether the data it pulled in is actually correct, rather than handing them a bare confidence percentage that doesn't tell them whether this specific message is safe to send as-is.
>
> **Automation would loosen gradually based on observed behavior, not all at once.** If the system notices a given SDR sending a particular category of draft nearly unedited, repeatedly, that's a signal the model has that category down well enough to move to batch-preview-then-approve instead of approving one by one — but that loosening is driven by actual behavior data, not by an assumption that "AI features should just be fully automatic." **For success metrics**, I'd use reply rate, not send volume, because sending a lot with no one responding doesn't move the business forward. I'd also track how much SDRs edit the drafts — if edit distance stays high, that's a sign automation shouldn't be widened yet.

### Self-Check

Use this table to check whether your answer hit the key points:

| Check item | Covered? |
|---|---|
| Clarified draft-assist vs. full automation to pin down scope first | |
| Defined both users (the operator and the third party affected), not just the operator's efficiency | |
| Used a concrete framework (risk-tiering or trust calibration) to decide oversight level, instead of defaulting to full automation | |
| Included a concrete mechanism for making AI output easy to verify, not just a confidence score | |
| Success metric tracks outcome quality (e.g. reply rate), not output speed or volume | |
| Bonus: automation widens gradually based on real behavior data, not all at once | |

## Today's Case

**Anthropic's Claude Code: a 93% approval rate that hides a trust-calibration warning sign**

Anthropic's own engineering blog published a number: Claude Code users approve 93% of permission prompts. On its face, that looks like a positive signal — most of the AI's suggestions must be correct if users are comfortable accepting them. But Anthropic itself frames this differently, calling it "approval fatigue": after seeing enough repeated approval requests, people gradually stop reviewing carefully and just mechanically click "allow." That's a real-world example of the "automation bias" failure mode from Framework 2 — a high approval rate on its own doesn't prove trust calibration is working; it might just mean users have stopped genuinely reviewing.

**Interview angle**: This case is a direct answer to a likely follow-up — "how would you know your human-in-the-loop design is actually working?" It demonstrates that you shouldn't treat a high approval or usage rate on its own as proof that trust calibration succeeded. Push further and ask whether that approval reflects genuine judgment or fatigue-driven rubber-stamping, and design to actively detect that fatigue — for example, switching a user who has approved everything for a long stretch without edits to sampled deep review instead of requiring approval on every single instance, which can preserve genuine attention better than demanding constant approval.

## Further Reading

- [AI Product Manager Interview Questions and Answers 2026 (55 Questions) - CloudSoftSol](https://cloudsoftsol.com/blog/ai-product-manager-interview-questions) — the full version of the risk-tiered task-allocation framework, with multiple AI PM case questions and structured answers
- [Human-in-the-Loop UX Patterns for AI Review - Tcules](https://www.tcules.com/insights/human-in-the-loop-ux-patterns) — a complete map of eight human-in-the-loop UX patterns, with the Claude Code approval-fatigue data and the EU AI Act's concrete requirements for human oversight
- [How to Crack AI Product Sense Interviews - IGotAnOffer](https://igotanoffer.com/en/advice/ai-product-sense-interview) — a complete answer structure for AI product design interviews, with real Glassdoor-reported questions from Anthropic, Meta, Google, and OpenAI

## References

- [ZoomInfo Product Manager Interview: Questions & Prep - Knok](https://knok.work/blog/zoominfo-product-manager-interview.html) — source of today's practice question (SDR AI outreach feature)
- [AI Product Manager Interview Questions and Answers 2026 (55 Questions) - CloudSoftSol](https://cloudsoftsol.com/blog/ai-product-manager-interview-questions) — source of the risk-tiered task-allocation framework
- [Human-in-the-Loop UX Patterns for AI Review - Tcules](https://www.tcules.com/insights/human-in-the-loop-ux-patterns) — source of the Claude Code 93% approval rate and "approval fatigue" case
- [Human-Centred AI UX: Designing Interfaces People Trust - Futurense](https://futurense.com/blog/human-centred-ai-ux-design-interfaces-people-can-trust) — source of the trust calibration (appropriate reliance) and supervisory collapse concepts
