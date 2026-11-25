---
title: "Product Builder Interview Daily — 2026-11-26: AI Product Design"
date: 2026-11-26
category: daily
type: digest
tags: [product-builder-interview, daily, ai-product]
lang: en
description: "AI Product Design practice: use an AI-confidence × action-risk quadrant to decide when to automate and when to require human review, then break down a design question about a legal AI agent drafting contract clauses — with a case study on how Legora's design team uses AI to scale human judgment instead of replacing it."
tldr: "AI Product Design isn't about whether to add human-in-the-loop — it's about placing every product action into a quadrant of AI confidence × action risk to decide whether it auto-executes, gets a confirmation checkpoint, gets flagged as provisional, or escalates straight to a human. Today's practice question is a legal AI agent whose contract-clause drafts are either rubber-stamped or stuck in review bottlenecks; the case is Legora's design team using AI to systematize human design judgment rather than replace it."
series:
  name: "Product Builder 面試日練"
  order: 99
---

> :globe: [中文版](/posts/daily/2026-11-26-product-builder-interview-daily)

## Today's Topic

The most common AI Product Design question doesn't ask whether you should add human-in-the-loop — it hands you a scenario where an AI already does something automatically and checks whether you can draw the line clearly: which actions the AI should just do, which ones must be stopped for a human to look at, and how to keep a user's trust in the system calibrated to how reliable it actually is. This question type shows up constantly at AI-native product companies, because getting the human-AI boundary wrong either buries the product in review friction or lets mistakes slip through unnoticed.

## Core Frameworks

**Framework 1: Human-AI Task Allocation**

Within a single AI feature, whether an action should be automated depends on two dimensions: how confident the AI is in this particular output, and how costly it is if that output is wrong. Plotting those two dimensions as a quadrant keeps a design from swinging to either extreme — fully automating the whole feature, or routing every single step through human review.

```diagram
title: Human-AI task allocation quadrant: AI confidence × action risk
desc: Actions are placed into auto-execute, confirmation checkpoint, provisional draft, or escalate-to-human based on AI confidence and action risk; a legal AI agent's contract-clause drafting lands in low-confidence, high-risk escalation.
caption: Quadrant definitions follow Aufait UX's "Human in the Loop UX for Enterprise Systems," specifically its "match automation to risk" and "confidence-based escalation" principles; placed items are illustrative.
---
<svg viewBox="0 0 640 456">
  <line class="dg-rule" x1="352" y1="40" x2="352" y2="420"/>
  <line class="dg-rule" x1="88" y1="230" x2="616" y2="230"/>

  <path class="dg-axis" d="M88 420V36" marker-end="url(#arrow)"/>
  <path class="dg-axis" d="M88 420H620" marker-end="url(#arrow)"/>

  <text class="dg-small" x="76" y="48" text-anchor="end" dominant-baseline="central">Risk: high</text>
  <text class="dg-small" x="76" y="408" text-anchor="end" dominant-baseline="central">Risk: low</text>
  <text class="dg-small" x="96" y="440" dominant-baseline="central">AI confidence: low</text>
  <text class="dg-small" x="616" y="440" text-anchor="end" dominant-baseline="central">AI confidence: high</text>

  <text class="dg-tag dg-text--accent" x="104" y="60" dominant-baseline="central">Escalate</text>
  <text class="dg-tag" x="600" y="60" text-anchor="end" dominant-baseline="central">Confirmation checkpoint</text>
  <text class="dg-tag" x="104" y="400" dominant-baseline="central">Provisional draft</text>
  <text class="dg-tag" x="600" y="400" text-anchor="end" dominant-baseline="central">Auto-execute</text>

  <circle class="dg-dot dg-dot--accent" cx="148" cy="100" r="7"/>
  <text class="dg-label dg-text--accent" x="164" y="100" dominant-baseline="central">Clause drafting</text>
  <circle class="dg-dot" cx="184" cy="176" r="5"/>
  <text class="dg-sub" x="196" y="176" dominant-baseline="central">Novel reasoning</text>

  <circle class="dg-dot" cx="464" cy="96" r="5"/>
  <text class="dg-sub" x="476" y="96" dominant-baseline="central">Legal summary</text>

  <circle class="dg-dot" cx="168" cy="296" r="5"/>
  <text class="dg-sub" x="180" y="296" dominant-baseline="central">Brainstorm draft</text>

  <circle class="dg-dot" cx="392" cy="336" r="5"/>
  <text class="dg-sub" x="404" y="336" dominant-baseline="central">Formatting fixes</text>
  <circle class="dg-dot" cx="400" cy="384" r="5"/>
  <text class="dg-sub" x="412" y="384" dominant-baseline="central">Template fill</text>
</svg>
```

Each quadrant maps to a distinct interface pattern: **auto-execute** (low-risk, high-confidence actions just happen with no gate — gating everything degrades into rubber-stamp clicking), **confirmation checkpoint** (high-risk but high-confidence actions get a clear review screen before they take effect), **provisional draft** (low-risk but low-confidence outputs get labeled "draft" or "suggested" to lower the chance of blind acceptance, without slowing anyone down), and **escalate** (high-risk and low-confidence cases get routed straight to a human, with a stated reason why).

**Framework 2: Trust Calibration mechanisms**

Sorting actions into four quadrants isn't enough on its own — each quadrant needs a concrete mechanism to actually ship it:

| Mechanism | What it does | Maps to |
|---|---|---|
| Confirmation checkpoint | Pauses before an action takes effect, shows full context and consequences, requires explicit confirmation | Confirmation checkpoint |
| Provisional state | Labels output as "draft" or "pending review" to lower the chance a user treats it as final | Provisional draft |
| Confidence-based escalation | Routes to human review automatically based on a confidence score, with a stated reason | Escalate |
| Traceability | Logs what a human changed in an AI output and why, feeding it back into the system | All four, especially escalate and confirmation checkpoint |

## Today's Practice Question

### The question

You own a legal AI agent product that drafts contract clauses automatically from the background materials a lawyer uploads. Three months after launch, user interviews surface two contradictory complaints: senior partners say "junior associates see a clause the AI wrote and sign off without really reading it"; junior associates say "the system makes us check off every single clause one by one before we can move on, even trivial ones — a large contract means two hundred checkboxes." How would you redesign this drafting feature's human-AI collaboration experience?

(Source: original, scenario structure informed by review bottlenecks common to legal AI agent products such as Legora; framework drawn from Aufait UX's "Human in the Loop UX for Enterprise Systems" taxonomy of common HITL pitfalls.)

### How to break it down

1. **Scope the question**: ask the interviewer whether the "checkbox everything" flow currently treats every clause the same way — if so, that single fact explains both complaints at once: high-risk clauses aren't flagged distinctly (so they get rubber-stamped), and low-risk clauses are forced through the same heavy review loop (causing review fatigue).
2. **Define the users**: senior partners care that the clause that matters doesn't get missed; junior associates care about not burning time on clauses that were never going to go wrong. Both groups are actually asking for the same thing — risk-based tiering — just complaining about the same gap from opposite sides.
3. **Structure the analysis**: classify clauses using the human-AI task allocation quadrant, not by "AI-written vs. human-written" but by "how severe is the consequence if this clause is wrong" × "how confident is the AI in this clause"; then map each quadrant to a concrete trust-calibration mechanism.
4. **Propose a solution**: for high-risk clauses — indemnification, liability caps, termination — add a confirmation checkpoint with a stated reason ("this liability cap is 40% lower than the firm's standard template"); for low-risk, formatting-level clauses — dates, addresses, defined terms — mark them provisional but don't block the flow, letting senior partners spot-check afterward; log every human edit and feed it back into the next drafting pass.
5. **Define success**: the rate of high-risk clauses signed off unmodified should go down, and the average review time on low-risk clauses should also go down — both numbers have to improve together, or fixing one side will just trigger the other group's complaint.

### Sample answer (how to actually say this in the interview)

> **Separate the two complaints to find the shared gap.** "Senior partners are worried high-risk clauses get overlooked; junior associates are worried even zero-risk clauses cost them time on re-review. Those sound like opposite complaints, but they point at the same problem — the current interface runs every clause through the exact same review flow with no risk tiering."
>
> **Redesign around confidence × risk.** "I'd split clauses into four buckets. High-risk, high-complexity ones — indemnification, liability caps — get a confirmation checkpoint even when the AI is confident, and the screen states exactly how this clause differs from the standard template and why it matters. Low-risk, formatting-level clauses — dates, defined terms — get marked 'standard style applied,' a provisional state that doesn't block the flow but gives senior partners a side list they can scan in one pass. Anything where the AI's confidence is genuinely low — reasoning tied to an industry-specific regulatory quirk the client has, say — goes straight to a human with a stated reason why the AI wasn't confident."
>
> **Fix the review fatigue without weakening the safety net.** "Two hundred checkboxes becomes a checkpoint only on clauses that are actually risky. Most low-risk clauses auto-apply and get flagged, so junior associates' review load drops noticeably — but it's not that nothing gets reviewed, it's that the review effort gets concentrated where it's actually worth spending."
>
> **Close the loop with traceability.** "Every time a lawyer edits an AI draft, I'd log the clause type and the reason for the edit, and periodically check which types get edited the most — that's a signal the AI's confidence estimate for that type was set too high, and it should move straight into the escalate bucket instead of waiting for the same complaint to come back around."

### Self-check

Use this table to make sure your answer didn't skip anything:

| Check | Covered? |
|---------|---------|
| Identified that the two seemingly contradictory complaints are the same gap (missing risk tiering) | |
| Classified clauses by AI confidence × risk, not by "AI-written vs. human-written" | |
| Gave high-risk clauses a concrete confirmation checkpoint with a stated reason | |
| Gave low-risk clauses a concrete noise-reduction design (provisional label, no gate) | |
| Success metrics track both "high-risk sign-off-without-review rate" and "low-risk review time" | |
| Bonus: mentioned feeding human edits back to recalibrate confidence over time | |

## Today's Case

**Legora: using AI to systematize design judgment, not replace it**

Legora builds an agentic operating system for legal work, growing from 20-plus people to over a thousand in just over a year. Head of Design Anton Reimertz faces a version of today's exact problem: with no lawyers on the design team, how do you keep the product judgment scattered across a dozen-plus designers' heads consistent, without writing it all down in a document that goes stale within six months? Their answer is to record every design critique — the session plus whatever prototypes were shared on screen — and run it through a Claude workflow that automatically sorts it into "decisions," "patterns," and "principles," including sentences nobody labeled as a principle at the time, like someone casually saying "we can never have more than three panels." Any designer who needs that judgment can hand a prototype, a Figma file, or even a napkin sketch to the same skill and get feedback consistent with past critiques, instead of waiting for a senior designer to be free. The prototyping stage deliberately avoids locking into one tool — teams push a direction to roughly 80% there in Claude Design, ChatGPT, or directly in the production environment, then bring it back into Figma for the polished version used to drive engineering handoff or marketing assets.

**Interview angle**: this case is ready material for "how does an AI-native team keep product consistency while moving fast" or "give an example of using AI to scale human judgment rather than replace it." The core argument to borrow: the AI here isn't replacing design judgment — it's turning something that used to live only in a few people's heads, and could disappear the moment they left, into a resource anyone can call on demand. That's the same logic behind "provisional state" and "traceability" in today's framework: making human judgment visible and reusable, instead of letting AI paper over it.

## Further Reading

- [Human in the Loop UX for Enterprise Systems: Principles and Pitfalls - Aufait UX](https://www.aufaitux.com/blog/human-in-the-loop-ux/) — five HITL interface patterns (confidence-based escalation, provisional state, confirmation checkpoint, and more) plus a full rundown of twelve common design pitfalls
- [Smarter AI Product Design Centers the User's Real Needs - IEEE Spectrum](https://spectrum.ieee.org/human-centered-ai-product-design) — how to tell whether an AI feature actually solves a need or was bolted on just to have an "AI story"
- [Anthropic Product Manager Interview Guide - PracHub](https://prachub.com/interview-guide/anthropic-product-manager-interview-guide) — the hallucination rate, over-refusal, and model-tiering vocabulary common in AI-native company PM interviews, plus a case-breakdown method

## References

- [Inside an AI-native design team - Tom Scott × Anton Reimertz](https://verifiedinsider.substack.com/p/inside-an-ai-native-design-team) — source for "Today's Case," the full interview on how Legora's design team systematizes judgment with a Claude workflow
- [Human in the Loop UX for Enterprise Systems: Principles and Pitfalls - Aufait UX](https://www.aufaitux.com/blog/human-in-the-loop-ux/) — source for the human-AI task allocation quadrant and trust-calibration mechanisms in "Core Frameworks"
- [Anthropic Product Manager Interview Guide - PracHub](https://prachub.com/interview-guide/anthropic-product-manager-interview-guide) — reference for the question style behind "Today's Practice Question" at AI-native product companies
