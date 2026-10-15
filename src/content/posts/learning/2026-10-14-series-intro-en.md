---
title: "How to Read This Series: Introduction"
date: 2026-10-14
category: learning
type: guide
tags: [series, intro, reading-guide]
lang: en
series:
  name: "How to Write Teaching Articles"
  order: 0
draft: false
---

## What Is This Series?

The series "How to Write Teaching Articles" records the full process of writing good teaching‑ and learning‑related articles: from rules, structure, and fact‑checking to final polish. It contains 30 pieces (order 0–29) meant to be read in sequence; each post opens with a small map showing "where we are now".

## Reading Order

### orders 0–6: one full flow
From rules, how websites work, the hunter's toolkit, to writing a report—this walks you through a complete bug‑bounty cycle once.

### orders 7–11: why the most valuable bugs are low‑level
Memory → overflow → VM → real escape cases → TEE.

### orders 12–13: TEE chapter and the bounty map
The TEE chapter uses a WhatsApp example (protecting AI), then moves on to what AI‑product bounties pay. By now you understand Web, memory, VMs, TEE, and AI products, so you can look at the top‑level bounty map.

### order 14: wrap‑up
Depending on your goals, what to practice next, whether certification helps, and whether to invest; this ties back to every piece in the series.

## How to Read

- **Visible before invisible.** Start with requests the browser sees, then the server, then memory and hardware isolation.
- **Hands‑on before deep theory.** By order 6 you've done one full cycle; only then do we answer "why are low‑level bugs worth more?".
- **Difficulty gaps handled in transition sections, not labels.** The biggest jump is 6→7 (Web to C); order 7 opens with motivation and a 15‑minute C primer.
- **Bounty tables are only "difficulty/impact hints."** Each post has at most one such table, placed late, taking ≤15% of the article.
- **One metaphor runs through the series: a building.** The system is the building; the scope is the floors the program says you may test; a request is the slip handed to the clerk; XSS is convincing another resident to act on your note; IDOR is the clerk handing over someone else's package without checking; RCE is getting the manager's keys; memory overflow is writing outside the box and smearing into the neighbour's column; the hypervisor is the wall between flats and the manager's office; TEE is the safe even the manager can't open. Each article stretches the metaphor only where it still works, and notes where it breaks.

## Section map (shown at the top of every article)

Every article opens with the same little map so you can locate yourself instantly:

```
Choose plan → Read rules → Know the target → Recon & intercept → Find bug → Confirm impact → Write report → Split → Patch / bounty / repeat
```

## Old‑post correspondence

| order | topic        | status | corresponds to |
|-------|--------------|--------|----------------|
| 0     | overview     | new    | – |
| 1–28  | teaching‑article how‑to | written one by one | `src/content/posts/learning/2026-*-*.md` |
| 29    | case study   | new    | – |

## How to Use This

- **Read straight through.** Start at order 0 and go to order 29 to learn the whole writing‑and‑review pipeline.
- **Pick a topic.** Want just XSS, RCE, or TEE? Jump to the matching order (4, 5, 7–13).
- **Use as reference.** Need to refresh a step (e.g. fact‑checking)? Open the matching order and read its "Embedding media (YouTube)" and "Research process stays out of the lead" sections.

## References

- Series plan: `.work/series-plans/bug-bounty-from-zero.md` (grandfathered).
- Rules: `.agents/skills/post/references/writing-guide.md#但書與歸因不堆疊`.
- Checker: `node scripts/check-process-leak.mjs`
