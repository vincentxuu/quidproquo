---
title: "Bug Bounty from Zero: Series Guide — Walking Through XSS, Memory, VM Escape, TEE, and AI Bounty Payouts in Plain Language"
date: 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, series-guide, beginner-guide]
lang: en
description: "Bug Bounty from Zero series guide: a 15-part path from reading program rules and setting up a workbench, through XSS, IDOR, RCE, memory bugs, buffer overflows, VM/hypervisors, Hyper-V escape, TEE, AI product bounty payouts, payout-map fact-checking, and certifications with a learning map."
tldr: "This is the reading entry point for the `Bug Bounty from Zero` series (parts 0–14). Each post covers one decision in plain language, backed by verifiable official sources, for readers with no security background."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 0
---

> 🌏 [繁體中文版](/posts/tech/2026-10-15-bug-bounty-how-it-works)

This is the reading entry point for `Bug Bounty from Zero`. The series has 15 posts (parts 0–14) arranged along one arc: **start by reading program rules and reward tables, set up a reproducible workbench, move from web bugs (XSS, IDOR) to RCE, then down to memory bugs, buffer overflows, VM/hypervisor escapes, Hyper-V escape, TEE, AI product bounty payouts, payout-map fact-checking, and finish with certifications and a learning map.**

Each post covers one decision, backed by verifiable official sources. It does not teach abuse of attack tools, and does not encourage unauthorized testing.

## What this series answers

When you open Google VRP, Meta Bug Bounty, or Microsoft MSRC, you see terms like In-scope, Out-of-scope, Rewards, and Exceptions. This series turns those long rules pages into a practical starting plan, and answers three questions:

1. **What am I allowed to test?** Read scope and exclusions on the rules page — don't assume, don't guess.
2. **How do I prove what I found?** Use a repeatable workbench and report template so a reviewer can reproduce without guessing.
3. **What is the finding roughly worth?** Compare against each program's reward table and actual rulings — don't reverse-engineer value from a headline number.

## What this series is not

- Not a penetration-testing course. No walkthroughs of attack tools, no guidance on finding real targets.
- Not a certification prep course. Part 14 mentions certs, but it does not replace official exam guides.
- Not encouragement of illegal testing. All examples run on local practice servers or targets you have explicit authorization to test.

## Learning path

```
Part 0 (this post) → Part 1 Rules → Part 2 Web fundamentals → Part 3 Workbench
     → Part 4 XSS/IDOR → Part 5 RCE → Part 6 Reporting & expected value
     → Part 7 Memory → Part 8 Buffer overflow → Part 9 VM/Hypervisor
     → Part 10 Hyper-V escape → Part 11 TEE → Part 12 AI bounty payouts
     → Part 13 Payout map fact-check → Part 14 Certifications & learning map
```

Numbering is a reading order, not a capability assessment. Parts 0–6 form a complete web-testing flow; parts 7–11 move into lower-level system bugs, a steeper cliff — read parts 0–6 first before deciding whether to continue.

## Post by post

### Stage 1: Rules and workbench (parts 0–3)

**0. Series guide (this post)**  
Reading entry point: the context, order, and boundaries of all 15 posts.

**1. [How to Read Bug Bounty Rules: Scope, Rewards, Exclusions, and Reporting](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope-en)**  
The four sections of a rules page: scope (what you may test), rewards (what gets paid), exclusions (what is excluded), reporting (what evidence to keep).

**2. [What Do the Browser and Server Exchange When You Click a Link?](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work-en)**  
HTTP, cookies, sessions, and input validation basics — the vocabulary for the bugs that follow.

**3. [A Bug Bounty Workbench: Capture Requests, Change Parameters, and Check Authorization](/posts/tech/2026-10-15-bug-bounty-hunter-workbench-en)**  
Burp Suite Community, browser DevTools, and a local practice server: repeat one request, change one input at a time.

### Stage 2: Web bugs and reporting (parts 4–6)

**4. [The Two Most Common Web Bugs, XSS and IDOR, and Why Google Pays Them Differently](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs-en)**  
XSS vs IDOR: how they differ, and why two browser-side bugs earn very different rewards from Google.

**5. [Why RCE Pays the Most in Google's Reward Table: Command Injection and Unsafe Deserialization](/posts/tech/2026-10-13-bug-bounty-zero-04-what-is-rce-en)**  
From "user input pasted into a shell command" to "untrusted data deserialized into objects": recognizing RCE and why it's dangerous.

**6. [How to Write a Bug Report That Earns the Full Reward: Quality Multipliers, a One-Page Template, and Expected Value](/posts/tech/2026-10-14-bug-bounty-zero-11-reports-and-expected-value-en)**  
Report template, impact analysis, low/medium/high severity, and whether the whole testing process is worth your time.

### Stage 3: Lower-level system bugs (parts 7–11)

**7. [How Programs Use Memory: Addresses, the Stack, the Heap and Return Addresses](/posts/tech/2026-10-13-bug-bounty-zero-05-how-programs-use-memory-en)**  
Where variables live, where a function returns to — the C and memory concepts needed to read lower-level examples.

**8. [How a Few Extra Characters Can Hand Someone Your Program: Buffer Overflows for Beginners](/posts/tech/2026-10-13-bug-bounty-zero-06-memory-bugs-buffer-overflow-en)**  
Writing past a buffer's length to overwrite adjacent memory, hijacking control flow, and replacing it with a length-limited call.

**9. [Virtual Machines and Hypervisors: Which Wall the L1 and L2 Rows of the Hyper-V Bounty Table Break](/posts/tech/2026-10-13-bug-bounty-zero-07-vm-and-hypervisor-en)**  
The wall between a VM and its hypervisor, and which layer Hyper-V's L1/L2 bounty rows correspond to.

**10. [A Hyper-V Escape Case Study: CVE-2021-28476, From a Guest's Packet to a Host Crash](/posts/tech/2026-10-13-bug-bounty-zero-08-hyper-v-escape-case-study-en)**  
One real, patched bug with public technical analysis — what a hole in that wall actually looks like.

**11. [TEEs and Confidential Computing: Why WhatsApp Put AI in a Room Even Meta Can't See Into](/posts/tech/2026-10-14-bug-bounty-zero-09-tee-and-confidential-computing-en)**  
Trusted execution environments and confidential computing: why some AI processing is invisible even to the platform itself.

### Stage 4: AI bounty payouts and a learning map (parts 12–14)

**12. [Bug Bounty for AI Products: What Google, OpenAI, Anthropic and Meta Accept, and What They Pay](/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty-en)**  
AI bounty pages mostly don't pay for what a model says (jailbreaks, hallucinations); they pay when a model acts on someone else, and for ordinary bugs around the AI product.

**13. [Bug Bounty Payout Map: What Google, Hyper-V, Meta TEE, Apple and Mozilla Pay For](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check-en)**  
Going row by row through each program's caps and conditions — putting "hundreds of thousands of dollars" back into context.

**14. [Bug Bounty Certifications and a Practice Map for Articles 0–14](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map-en)**  
Where certifications fit, a practice path through parts 0–14, and how to keep learning afterward.

## Things to know

- **Authorize first, test later.** A technically valid bug still gets rejected if it's out of scope or a duplicate.
- **Examples run locally only.** The `shop.mjs` practice server listens on `127.0.0.1` and never touches real targets.
- **Don't estimate payouts from memory.** Reward tables and rulings change; check the current official rules when assessing a finding.

## Related series on this site

This series is a from-zero practical entry point rather than a deep dive into one technology. If you want to go deeper after reading:

- **[Security Cert Prep](/en/series/security-cert-prep)** — certification prep paths built on official exam guides.
- **[Private Corpus Pipeline](/en/series/private-corpus-pipeline)** — the lifecycle of private data entering an index, echoing part 12's data-exfiltration angle.
- **[AI Model Families](/en/series/ai)** — architecture and licensing of individual model families, as background for part 12.

## How to read

- **In a hurry**: read part 0 (this post) and part 1 (rules), then jump to whichever topic interests you (e.g. part 12 for AI bounty payouts).
- **Walk the whole path**: read from part 0 to part 14 in order; after each post, check whether you can restate its core decision in plain language.
- **Already have a background**: skip parts 0–3 and start at part 4 (XSS/IDOR) or part 7 (memory).

Each post ends with official sources and further reading — follow them to go deeper.

## References

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) — program scope and reward conditions.
- [Meta Bug Bounty scope](https://bugbounty.meta.com/scope/) — invalid report reasons, duplicate handling, and payout factors.
- [Microsoft MSRC Bounty](https://www.microsoft.com/en-us/msrc/bounty) — Microsoft's vulnerability reward program overview.
- [PortSwigger: Burp Suite documentation](https://portswigger.net/burp/documentation) — workbench tool reference.
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — an intentionally vulnerable practice application.
- [繁體中文版](/posts/tech/2026-10-15-bug-bounty-how-it-works)
