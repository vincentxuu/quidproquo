---
title: "How to Read Bug Bounty Rules: Scope, Rewards, Exclusions & Quality Multipliers"
date: 2026-10-13
category: tech
type: guide
difficulty: beginner
tags: [bug-bounty, security, rules, scope, rewards, quality-multiplier]
lang: en
description: "Series 1: How to quickly read any bug bounty program's rules document, accurately define the legal testing scope, reward structure, and prohibited items."
tldr: "Bug bounty rules have four key sections: Scope (legal testing range), Rewards (payout + quality multiplier), Exclusions (prohibited items), and Report Quality (report grading standard). This article teaches you to master these in 30 minutes via keyword search — avoiding wrong-target testing, rejected reports, and reduced payouts."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 1
---

> 🌏 [Chinese version](/posts/tech/2026-10-13-bug-bounty-zero-02-how-websites-work)

## TL;DR

**Bug bounty rules have four key sections: Scope (legal testing range), Rewards (payout + quality multiplier), Exclusions (prohibited items), and Report Quality (report grading standard).** Master these via keyword search (Ctrl+F: `in-scope`, `reward`, `exclude`, `quality`) — and you’ll avoid testing wrong targets, having reports rejected, or seeing payouts slashed by quality multipliers (Google’s 0.8x / 1.0x / 1.2x directly affects dollar amounts).

---

## Scenario

You’ve enrolled in a new bug bounty program (e.g., Apple, GitHub, Cloudflare). The rules page is 2,000 words. You don’t have time to read every word, but if you accidentally test an out-of-scope asset, your account could be banned. If you miss the quality multiplier, the same RCE could earn $121,212 (Google T0+S0+1.2x) or only $80,808 (0.8x).

---

## Problem

**First mistake: Not reading Scope.** You test out-of-scope assets, get your account banned, or waste hours on unrewardable targets.

**Second mistake: Missing the Rewards table.** Different programs pay vastly different amounts. Google’s T0/S0 RCE = $101,010 base; Meta’s code execution = $300k base; Microsoft’s Hyper-V escape = $250k base. And multipliers change everything.

**Third mistake: Ignoring Exclusions.** Social engineering, DoS, third-party services, and physical attacks are commonly prohibited. Touching them = disqualification.

**Fourth mistake: Writing low-quality reports.** Missing “Steps to Reproduce” = Google’s 0.8x → $101,010 drops to $80,808.

---

## Solution: Four-Step Rule Reading

### Step 1 — Scope: Keyword Search & Syntax

| Syntax | Meaning | Example | Testable? |
|---|---|---|---|
| `*.example.com` | All subdomains | `app.example.com` | ✅ |
| `example.com` | Root domain only | `example.com` | ✅ |
| `!api.example.com` | Exclude specific | `api.example.com` | ❌ |
| `/v1/*` | Path prefix | `/v1/users` | ✅ |
| `*.example.com/*` | Full path | All paths | ✅ |

**Checklist**: Ctrl+F for `in-scope`, copy all domains; search `out-of-scope` or `exclude`, mark prohibited zones; check for “invite-only” (Meta Private Processing); check QPS limits (GitHub: 60 req/min/IP).

### Step 2 — Rewards: Three-Tier Comparison (2026 snapshot)

| Severity | Google VRP | Meta Private Processing | Microsoft Hyper-V |
|---|---|---|---|
| **RCE / Code Exec** | T0/S0: $101,010 × 1.2 (max) = $121,212 | External: $300,000 Internal: $50,000 | L1 guest→host: $250,000 L2 guest→guest: $150,000 |
| **Info Disclosure** | T2: $13,337–$31,337 | External: $150,000 Internal: $50,000 | L1: $50,000 L2: $25,000 |
| **XSS / Client-side** | T2: $3,133–$13,337 | External: $10,000 | N/A |
| **DoS** | Usually $0 | $0 | $15,000 / $10,000 / $5,000 |
| **Max Single Payout** | $151,515 (2024 announcement) | $300,000 (code exec) | $250,000 |

**Key insight**: Google’s quality multiplier directly scales the payout. Meta distinguishes External vs Internal (internal ≈ 1/6 of external). Microsoft uses Layer (L1/L2) and has 1.0/0.5/0.25 multipliers — different from Google’s 1.2/1.0/0.8.

### Step 3 — Exclusions: Common Prohibited Items

| Category | Typical Prohibited Behavior | Risk |
|---|---|---|
| Social engineering | Phishing, fake support, coercing employees | Account ban, legal risk |
| DoS / Stress testing | Intentional resource exhaustion, QPS over-limit | Account ban, service impact |
| Third-party services | Attacking CDN, WAF, identity providers | Out-of-scope, no payout |
| Physical attacks | Hardware tampering, on-site intrusion | Legal risk |
| Unauthorized scanning | Unsanctioned crawlers, brute-force | Account ban, IP block |
| Data theft | Downloading more real-user data than needed for verification | Account ban, legal risk |

**Tip**: Ctrl+F for `prohibited`, `forbidden`, `not allowed`, `exclude`, `social engineering`, `denial of service`.

### Step 4 — Report Quality: From 0.8x to 1.2x

Google VRP explicitly defines:

| Quality | Multiplier | Conditions |
|---|---|---|
| **Low** | 0.8x | Missing repro steps, no PoC, vague impact, no CVSS |
| **Good** | 1.0x | Full repro steps, PoC present, clear impact, CVSS |
| **Exceptional** | 1.2x | Good conditions + remediation suggestion, quantified impact, automated scripts, visual evidence |

**Quick self-check**: Does your report include?
- [ ] Executable `curl` or Burp Repeater steps
- [ ] Concrete impact: how many records leaked, PII types, estimated loss
- [ ] CVSS 3.1 vector string (e.g., `CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:H/I:N/A:N`)
- [ ] Remediation suggestion (code-level or config-level)

---

## Why This Matters: The VRP Reward Architecture

1. **Scope defines the attack surface** — vendors only pay for assets they control.
2. **Rewards reflect business risk** — core services (Google T0: identity, auth) = highest bounty.
3. **Quality multiplier incentivizes complete reports** — evaluator time is precious; complete reports save it.
4. **Exclusions protect third parties & users** — prevent bounty hunters from harming unrelated targets for a reward.

---

## Self-Check (Key question: Do you get it?)

- [ ] Can you find a new program’s in-scope domain list in 5 minutes?
- [ ] Can you name Google’s T0/S0 base RCE payout ($101,010) and maximum ($121,212)?
- [ ] Can you list Meta External vs Internal bounty difference (6x)?
- [ ] Do you know the four conditions for Google’s quality multiplier 1.2x?
- [ ] Have you saved the target program’s Exclusions list before testing?

---

## References

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 In Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [Meta Private Processing Payout](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Meta Scope](https://bugbounty.meta.com/scope/)
- [Microsoft Hyper-V Bounty](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Microsoft MSRC Bounty Overview](https://www.microsoft.com/en-us/msrc/bounty)

---

*This is Series 1 (rules) of "Bug Bounty from Zero." The next article covers how modern websites work: HTTP, TLS, cookies, sessions — the foundation for Articles 2+.*

---

*Next: [Series 2 — How Websites Work](/posts/tech/2026-10-13-bug-bounty-zero-03-common-web-bugs)*

_全系列流程圖請參考第 6 篇（報告撰寫）與第 14 篇（學習路徑）。_*