---
title: "Bug Bounty Top Payouts Fact Check: Mobile, Browser, Cloud, TEE, AI, Crypto Rewards"
date: 2026-10-13
category: tech
type: guide
difficulty: intermediate
tags: [bug-bounty, security, rewards, payouts, vrp, google, meta, microsoft, apple, comparison]
lang: en
description: "Series 13: Consolidates top reward structures from Google VRP, Meta, Microsoft, Apple, Mozilla, and others, explaining why mobile, browser, cloud isolation, confidential computing, AI products, and crypto offer million‑dollar bounties."
tldr: "Maximum single payouts: Google VRP $151,515, Meta $300,000, Microsoft Hyper‑V $250,000, Apple $1,000,000, Mozilla $100,000. TEE, AI product, mobile device, and cloud‑isolated vulnerabilities earn the highest rewards."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 13
---

> 🌏 [Chinese version](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)

## TL;DR

**Consolidate the top‑reward structures of major bug bounty programs to see which vulnerabilities pay the most after learning Web, memory, VM, TEE, and AI.** Key figures:

| Program | Maximum Single Payout | Corresponding Vulnerability Type | Notes |
|---|---|---|---|
| **Google VRP** | $151,515 | RCE (T0/S0) + 1.2×/1.5× | 2024 announcement adjustment |
| **Meta** | $300,000 | TEE code execution (Private Processing) | External $300k / Internal $50k |
| **Microsoft Hyper‑V** | $250,000 | Guest→Host escape (L1) | L2 $150k |
| **Apple** | $1,000,000 | Zero‑click RCE with kernel + PCC | iOS/macOS core |
| **Mozilla** | $100,000 | RCE / Sandbox escape | Firefox ex‑employee leak |

---

## Scenario

You’ve finished articles 1‑12: rules, web fundamentals, workbench, XSS/IDOR, RCE, reporting, memory, stack overflow, VM/Hypervisor, TEE, and AI products. Now you want to know: “**Where can I earn the highest bounty? Why do those categories pay the most?**”

This article breaks down each major program’s reward table into a comparable format and maps it to the vulnerability types you just studied (RCE, VM Escape, TEE, AI). It helps you build intuition: **Reward ≈ Risk × Difficulty × Impact × Quality Multiplier**.

---

## Problem

**Mistake 1:** Looking at only one program’s reward table and assuming Google is the highest, while missing Meta’s TEE $300k or Apple’s $1M.

**Mistake 2:** Not understanding why mobile RCE (Apple $1M) is worth far more than server RCE (Google $151k) — because a phone holds the most personal data (photos, contacts, location, biometrics) and a zero‑click can affect every user without interaction.

**Mistake 3:** Assuming bounty numbers are static, but Google VRP’s July 2024 announcement raised the maximum from $101,010 to $151,515, and Meta introduced new TEE categories with Private Processing.

---

## Solution: Six‑Program Reward Comparison

### 1. Google VRP (Google + Alphabet)

| Tier | Example Domains | RCE Base | Max (1.2×) | Info Disc Base | XSS Base |
|---|---|---|---|---|---|
| **T0** | `accounts.google.com`, `*.google.com` (core identity) | $101,010 | $121,212 | $31,337 | $13,337 |
| **T1** | `*.google.com` (other core) | $101,010 | $121,212 | $31,337 | $13,337 |
| **T2** | General apps | $75,000 | $90,000 | $13,337 | $7,500 |
| **T3a** | Acquired T0/T1 | $10,000 | $12,000 | $3,133 | $1,333 |
| **T3b** | Other acquisitions | $1,337–$5,000 | $1,604–$6,000 | $133–$3,137 | $133–$1,337 |

**Key point**: July 2024 Google announcement allows up to **$151,515** ($101,010 × 1.5) under special conditions. Quality multiplier 0.8×/1.0×/1.2× applies directly to base reward.

### 2. Meta (Facebook / Instagram / WhatsApp / Private Processing)

| Category | Base Reward | Description |
|---|---|---|
| **TEE Code Execution (External)** | $300,000 | Private Processing environment external attack |
| **TEE Code Execution (Internal)** | $50,000 | Private Processing environment internal attack |
| **VM Escape** | N/A | Not in reward table |
| **Persistence** | $10,000 | Persistence vulnerability |
| **Info Disclosure (External)** | $150,000 | External information leak |
| **Info Disclosure (Internal)** | $50,000 | Internal information leak |
| **XSS / Client‑side (External)** | $10,000 | Client‑side vulnerability |

> **Takeaway**: Meta’s highest is **TEE Code Execution $300k**, reflecting the shift to confidential‑computing/AI era.

### 3. Microsoft Hyper‑V (MSRC)

| Layer | Vulnerability Type | Base Reward | Quality Multiplier |
|---|---|---|---|
| **L1** | Guest → Host escape | $250,000 | 1.0 / 0.5 / 0.25 |
| **L2** | Guest → Guest escape | $150,000 | Same as above |
| **L1 Info** | Host memory leak | $50,000 | Same |
| **L2 Info** | Guest memory leak | $25,000 | Same |
| **DoS** | Denial‑of‑service | $15,000 / $10,000 / $5,000 | Same |

**Key point**: Microsoft uses **Layer (L1/L2)** to distinguish, with quality multiplier 1.0/0.5/0.25 (not 1.2/1.0/0.8). Report quality strongly affects reward.

### 4. Apple Security Bounty

| Type | Maximum Reward | Condition |
|---|---|---|
| **Zero‑click RCE + Kernel + PCC** | $1,000,000 | iOS/macOS zero‑click RCE requiring kernel + PCC |
| **Kernel RCE** | $250,000 | Kernel privilege gain |
| **Sandbox Escape** | $100,000 | Escape sandbox |
| **iCloud / Server RCE** | $100,000 | Cloud service RCE |
| **Lockdown Mode Bypass** | $2,000,000 | Special mode bypass (rare) |

**Why so high?**: A phone is the ultimate personal‑data repository (photos, contacts, location, biometrics). A zero‑click RCE can affect all users without any user interaction, leading to massive impact.

### 5. Mozilla Firefox

| Type | Maximum Reward |
|---|---|
| **RCE / Sandbox Escape** | $100,000 |
| **Info Disclosure** | $50,000 |
| **XSS / Client‑side** | $20,000 |

> **Note**: 2024 former‑employee leaks suggested rewards were too low, causing talent drain; Mozilla is re‑evaluating.

### 6. Other Notable Programs

| Program | Maximum Reward | Specialty |
|---|---|---|
| **GitHub** | $50,000 | Supply chain, Actions, Codespaces |
| **Cloudflare** | $100,000 | Edge / Workers / D1 related |
| **Discord** | $30,000 | Client, API, infrastructure |
| **Telegram** | $100,000 | MTProto, client, server |

---

## Why This Is So: The Logic Behind Reward Structures

| Factor | Explanation |
|---|---|
| **Asset Value** | Phones/browsers = hundreds of millions of users’ core assets → highest rewards |
| **Attack Difficulty** | TEE / Hyper‑V / Kernel = extremely high technical barrier → high rewards attract experts |
| **Impact Scope** | Zero‑click > One‑click > Local > Remote (requires interaction) |
| **Quality Incentive** | Google 1.2×, Meta external/internal 6× spread, Microsoft 1.0/0.5/0.25 |

**Core formula**: Reward ≈ Risk Level × Attack Difficulty × Impact Scope × Quality Multiplier

---

## Self‑Check (Key question: Can you match each program’s top reward?)

- [ ] Do you know Google VRP’s maximum is $151,515 (T0/S0 RCE + 1.5× special condition)?
- [ ] Do you know Meta’s highest $300,000 is for TEE Code Execution (External)?
- [ ] Do you know Microsoft Hyper‑V’s top $250,000 is for Guest→Host Escape (L1)?
- [ ] Do you know Apple’s top $1,000,000 is for zero‑click RCE + kernel + PCC?
- [ ] Can you explain why mobile RCE is worth more than server RCE?
- [ ] Do you know how quality multipliers differ across programs (Google 1.2×, Meta 6× spread, Microsoft 0.25× low quality)?

---

## References

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [Google 2024 VRP Review](https://blog.google/security/vulnerability-reward-program-2024-in/)
- [Meta Private Processing Payout](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Meta Scope](https://bugbounty.meta.com/scope/)
- [Microsoft Hyper‑V Bounty](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Apple Security Bounty](https://support.apple.com/security-bounty)
- [Mozilla Bug Bounty](https://bugzilla.mozilla.org/page.cgi?id=security-bug-bounty.html)
- [GitHub Bug Bounty](https://bounty.github.com/)
- [Cloudflare Bug Bounty](https://hackerone.com/cloudflare)

---

*This is Series 13 (Top Payouts Fact Check) of "Bug Bounty from Zero." Previous: AI Era (12); Next: Certifications & Learning Map (14).*