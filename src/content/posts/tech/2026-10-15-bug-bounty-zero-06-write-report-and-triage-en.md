---
title: "Write Report & Triage: How to Turn a Bug Into a Payout"
date: 2026-10-15
category: tech
type: guide
difficulty: beginner
tags: [bug-bounty, security, report-writing, triage, google-vrp, best-practices]
lang: en
description: "Series 6: How to turn a discovered bug into a successful bug bounty report. Covers report structure, quality scoring, triage communication, and getting approved by the program."
tldr: "A step-by-step guide to writing a winning bug bounty report: structure, quality criteria, triage communication, and common pitfalls to avoid."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 6
---

> 🌏 [Chinese version](/posts/tech/2026-10-15-bug-bounty-zero-06-write-report-and-triage)

## TL;DR

Writing a bug bounty report is half the battle. To win a payout, your report must follow a strict structure: **Title → Summary → Steps to Reproduce → Expected vs Actual → Impact → CVSS → Remediation → References**. Follow the template below and you'll maximise your chance of hitting the 1.2x quality multiplier and securing the full $121,212 RCE reward.

---

## Scenario

You've completed Articles 1‑4 and now want to submit a bug bounty report. The report quality directly determines the reward: with 0.8x / 1.0x / 1.2x multipliers, the same RCE vulnerability can earn $80,808 (low quality) or $121,212 (exceptional quality). This article teaches you how to structure a report that earns the maximum payout.

---

## Problem

**Mistake 1:** Report structure is messy, missing key sections (impact analysis, CVSS, remediation advice).
**Mistake 2:** No quality multiplier specified, resulting in reduced payouts.
**Mistake 3:** Missing PoC (Proof of Concept) details, making it hard for evaluators to verify reproducibility.
**Mistake 4:** Tone is too subjective and lacks professionalism.

---

## Solution: Report Writing Steps

### 1. Structure Framework (Google VRP Standard)

| Section | Content Points |
|---|---|
| **Title** | Specific nouns + vulnerability type, e.g. "Google VRP RCE – Remote Code Execution Vulnerability" |
| **Summary** | One sentence on impact and severity |
| **Steps to Reproduce** | 1. Target URL or API endpoint 2. Input malicious parameter 3. Observe response 4. Analysis |
| **Expected Behaviour** | What should happen normally (e.g. "Server returns 200 OK") |
| **Actual Behaviour** | What actually happened (e.g. "Server returns root permissions, showing sensitive data") |
| **Impact** | User data leakage, service disruption, brand damage |
| **CVSS 3.1** | CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H |
| **Remediation** | Fix suggestion (e.g. "Replace system() call with parameterized API") |
| **References** | Related document links |

### 2. Quality Multiplier (Quality Multiplier)

- **0.8x (Low quality):** Missing PoC, incomplete impact description
- **1.0x (Good):** Complete PoC, impact description, CVSS
- **1.2x (Exceptional):** Above + detailed remediation suggestions, clear impact scope

### 3. Common Report Mistakes

| Mistake | Fix |
|---|---|
| Missing PoC | Add `curl` command or Burp Repeater steps |
| Vague impact description | Explicitly state "attacker can execute arbitrary commands" or "data leakage" |
| Missing CVSS | Cite official CVSS vector |
| Overly subjective tone | Use "discovered", "verified", "remediation" etc. |

### 4. Submission Workflow

1. **Write report** (using template)
2. **Self-check** (against checklist): PoC, impact, CVSS, remediation
3. **Submit** (via email/portal): include report, PoC link, CVSS score
4. **Wait for evaluation** (typically 3‑7 days): if rejected, adjust based on feedback and resubmit

---

## Why This Matters: Report Quality & Reward Correlation

Google VRP explicitly states:
- **RCE** is the highest-risk category (S0), base reward $101,010
- **Quality multiplier** directly multiplies the reward: 0.8x / 1.0x / 1.2x
- **PoC completeness** is the key to 1.2x — without PoC, you only get 0.8x

Therefore, every element of the report directly affects the final payout amount.

---

## Self-Check (Key question: Can you write a complete report?)

- [ ] Report includes Title, Summary, Steps, Expected, Actual, Impact, CVSS, Remediation
- [ ] Quality multiplier is explicit (0.8x / 1.0x / 1.2x) with clear reasoning
- [ ] PoC includes reproducible `curl` or Burp steps
- [ ] CVSS 3.1 vector is listed
- [ ] Remediation suggestion is specific (e.g. "use parameterized API" instead of "fix it")
- [ ] Language is zh-TW (or en counterpart) with identical structure

---

## References

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [OWASP Report Writing Guide](https://owasp.org/www-community/guides/reporting-a-software-vulnerability)
- [CVSS 3.1 Specification](https://www.first.org/disclaimer/cvss-3-1)
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)

---

*This is Series 6 (Report & Triage) of "Bug Bounty from Zero." Previous: RCE (5); Next: Top Payouts Fact Check (13).*