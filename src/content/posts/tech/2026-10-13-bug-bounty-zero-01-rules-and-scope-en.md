---
title: "Bug Bounty From Zero: From Rules, Workbench to First Report"
date: 2026-10-13
category: tech
type: guide
difficulty: beginner
tags: [bug-bounty, security, web-security, rules, scope, beginner-guide]
lang: en
description: "Series 0: Complete roadmap for starting bug bounty hunting — from reading rules, setting up a workbench, to writing your first accepted report."
tldr: "This is article 0 of 'Bug Bounty from Zero': you don't need to become an expert first — just learn how to read the rules, set up your workbench, and write your first report that passes triage. These three steps determine whether your bounty gets accepted or rejected."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 0
---

> 🌏 [中文版](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope)

## TL;DR

**You only need to do three things to start: Read the rules, open your workbench, write your first report.** This is the starting point of the `bug-bounty-from-zero` series (0 → 14). Every subsequent article builds on this: Rules (1), How Websites Work (2), Hunter’s Workbench (3), XSS/IDOR (4), RCE (5), Report & Triage (6), Memory (7), Buffer Overflow (8), VM/Hypervisor (9), Hyper-V Escape (10), TEE/Confidential Computing (11), AI Products (12), Top Payouts Fact-Check (13), Certifications & Learning Map (14).

**Why this order?** Because a bug bounty hunter doesn’t start with RCE — you first need to know **what constitutes legal testing boundaries**, then operate real tools, then document findings in a report the triage team can act on. That report quality determines whether Google VRP pays you $101,010 (T0+S0, maxed at $121,212 with 1.2x) or rejects you on a technicality.

---

## Scenario

You’ve enrolled in a bug bounty program (e.g., Google VRP, Meta Private Processing, Microsoft MSRC). The landing page shows a thick “Rules” document listing:

- **In-scope**: Which domains, which features, which product surfaces you may test
- **Out-of-scope**: Third-party services, internal systems, AI training data
- **Rewards**: RCE $101,010, Info Disclosure $25,000, XSS $7,500 (modified by quality multiplier 0.8x / 1.0x / 1.2x)

You don’t know where to start. This article is for exactly that “from zero” situation.

---

## Problem

**First mistake: Scanning before reading rules.** You waste time on out-of-scope assets, miss in-scope endpoints, or get rejected for “duplicate / low quality / no PoC.”

**Second mistake: Testing manually in a browser.** You need a reproducible toolchain: Burp Suite Community (free), browser DevTools (F12 → Network → Copy as cURL), and a local practice server (Article 3 ships `shop.mjs`).

**Third mistake: Writing “I found XSS” instead of “Here is how you reproduce it and why it matters.”** Google VRP explicitly adjusts reward based on report quality: Low-quality 0.8x, Good 1.0x, Exceptional 1.2x. $101,010 → $80,808 (low) vs $121,212 (exceptional).

---

## Solution: Three Steps

### Step 1 — Read Rules (30 minutes)

Every bounty rules page follows the same pattern:

| Section | What to look for | Example (Google VRP) |
|---|---|---|
| **Scope** | Domain list, product lines, allowed test methods | `*.google.com`, `*.youtube.com`, `*.blogger.com` |
| **Rewards** | Severity tier payout + quality multiplier | T0/S0 RCE: $101,010 × 1.2 (max) = $121,212 |
| **Exclusions** | Prohibited targets, third-party services, social engineering | Third-party services, internal systems, physical attacks |
| **Report Quality** | How to qualify for 1.2x vs 0.8x | Full repro steps, PoC, CVSS assessment, impact statement |

**Quick validation**: Ctrl+F for `in-scope` and `reward`. Verify the domain you want to test is listed. Record the payout numbers — you’ll need them for the EV estimation in Article 6.

### Step 2 — Open Your Workbench (Article 3 has full instructions)

Your stack:

1. **Burp Suite Community Edition** (free download): Proxy → Intercept, Repeater, HTTP History
2. **Chrome DevTools** (F12 → Network → right-click → Copy as cURL)
3. **Local practice server** (`shop.mjs` shipped in Article 3): `node shop.mjs` binds to `127.0.0.1:8000`, simulating IDOR + XSS surfaces

**Minimum viable test loop**: Before touching real targets, verify you can:
- Replay a request via `curl` (confirming reproducibility)
- Modify a URL parameter (`/api/orders/1532` → `1533`) and observe response changes
- Use Burp Repeater to cycle status codes (200 → 403 → 404)

### Step 3 — Write Your First Report (Article 6 has the full template)

A bounty report is not “I found XSS.” It is **reproducible instructions for someone else**. Standard template (copy-ready):

```
Title: [concise, include domain + vuln type]
Summary: [one sentence on impact + severity]
Steps to Reproduce: [1. 2. 3. … include URL, parameter, tool used]
Expected Behaviour: [what should have happened]
Actual Behaviour: [what actually happened, with response body or description]
Impact: [on users, data, system; include estimated exposure]
Proof of Concept: [executable curl or Burp Repeater steps]
Severity / CVSS: [if applicable, include CVSS 3.1 score and rationale]
Remediation / Fix: [how to fix, or why a workaround exists]
References: [related CVEs, docs, prior research]
```

**Why this structure?** Google VRP’s reward table directly scales with report quality. Missing “Steps to Reproduce” = 0.8x. Complete PoC + impact + remediation = 1.2x.

---

## Why This Matters: The VRP Reward Architecture

Google VRP (2024 rules update):

| Tier | Domain level | RCE payout | With 1.2x multiplier |
|---|---|---|---|
| T0 | Tier 0 domains | $101,001 | $121,212 |
| T1 | Tier 1 domains | $101,001 | $121,212 |
| T2 | Normal Google apps | $75,000 | $90,000 |
| T3a | Acquisition Tier 0/1 | $10,000 | $12,000 |
| T3b | Other acquisitions | $1,337–$5,000 | $1,604–$6,000 |

This means: **the same vulnerability, reported with different quality, earns different money.** That’s why report writing (Article 6) sits in the middle of this series, not the end.

---

## Self-Check (Key question: Are you ready?)

- [ ] You’ve opened a bounty program’s rules page and highlighted the “In-scope” domain list
- [ ] You’ve downloaded Burp Suite Community and intercepted at least one local request
- [ ] You know what “Copy as cURL” does and can replay it in your terminal
- [ ] You understand: T0/S0 RCE maxes at $121,212 (1.2x); T2 (general apps) maxes at $90,000
- [ ] You understand the series flow: Rules (1) → How Websites Work (2) → Workbench (3) → Bugs (4-5) → Report (6) → Deep Dives (7-12) → Payouts (13) → Roadmap (14)

---

## References

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) — payout table and quality multiplier
- [Google VRP July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515) — $151,515 max reward announcement
- [Google 2024 In Review](https://blog.google/security/vulnerability-reward-program-2024-in/) — Chrome $250K, Mobile $300K
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — hands-on vulnerable app
- [Meta Private Processing Payout](https://bugbounty.meta.com/payout-guidelines/private-processing/) — $300k / $300k / $150k / $10k
- [Meta Scope](https://bugbounty.meta.com/scope/) — TEE-related scope

---

*_This is article 0 (overview) of "Bug Bounty from Zero." Full series flow diagram is in Article 6 (report writing) and Article 14 (roadmap)._*