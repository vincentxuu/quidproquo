---
title: "Bug Bounty from Zero: From Program Rules to Your First Report"
date: 2026-10-15
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, web-security, rules, scope, beginner-guide]
lang: en
description: "An overview of the complete beginner path: read program rules, set up a local workbench, reproduce a finding, and write a report."
tldr: "Start with permission and scope, practice inspecting requests locally, then turn a verified finding into a reproducible report. Rewards depend on the program and its assessment."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 0
---

> 🌏 [繁體中文版](/posts/tech/2026-10-15-bug-bounty-how-it-works)

## TL;DR

**Start with three things: understand the rules, set up your workbench, and write a reproducible report.** This is the starting point for the `bug-bounty-from-zero` series, from part 0 to part 14: rules (1), web fundamentals (2), the workbench (3), XSS and IDOR (4), RCE (5), reporting and classification (6), memory (7), buffer overflows (8), virtual machines and hypervisors (9), Hyper-V escape (10), TEEs (11), AI vulnerabilities (12), checking reward claims (13), and certifications and a learning map (14).

Why this order? Before using tools, you need to know which systems and methods the program authorizes. Before reporting a vulnerability, you need evidence someone else can reproduce. A reward is a possible outcome of an eligible finding; a complete template does not guarantee acceptance or payment.

## The situation

You open a program such as Google VRP, Meta's bug bounty program, or Microsoft's MSRC. Its rules describe:

- **In scope:** eligible domains, products, features, and versions.
- **Out of scope:** excluded assets, vulnerability classes, and testing methods.
- **Rewards:** how the program evaluates eligible findings and any applicable reward table.

These details vary between programs. A wildcard domain or a reward from another program does not establish permission for your target. This article helps you turn that long rules page into a practical starting plan.

## Three mistakes that block progress

**Scanning before reading the rules.** You can test an excluded system, use a prohibited method, or miss an eligibility condition. A technically valid bug can still be out of scope or a duplicate.

**Testing without a repeatable setup.** Browser interactions help you discover behavior, but you also need a record of requests and responses. Burp Suite Community, browser DevTools, and a local practice server let you repeat a request and change one input at a time.

**Reporting only a vulnerability name.** “I found XSS” does not explain where the input enters, when it executes, who it affects, or how a reviewer can reproduce it. A clear report reduces ambiguity; it does not force a particular severity or reward.

## A three-step workflow

### Step 1: Read the rules

Use an initial reading session to extract these four items. Take longer if the rules leave anything unclear.

| Section | What to record | A useful question |
|---|---|---|
| Scope | Exact assets, versions, and authorized methods | Is this host and this action explicitly covered? |
| Rewards | Relevant categories and eligibility conditions | Does this table apply to this product and impact? |
| Exclusions | Third parties, prohibited techniques, and excluded findings | Does this test cross an excluded boundary? |
| Reporting | Required evidence and submission channel | Can the reviewer reproduce this without guessing? |

**Quick check:** search the rules for “scope,” “reward,” and “report.” Record the source URL and the conditions that apply to your proposed test. If ownership or permission is unclear, use the program's clarification process before testing that asset. Do not treat a payout estimate as authorization.

### Step 2: Set up the workbench

Part 3 explains the tools in detail:

1. **Burp Suite Community Edition:** intercept requests with Proxy, inspect HTTP history, and resend requests with Repeater.
2. **Browser DevTools:** use Network → Copy as cURL to export a request.
3. **A local practice server:** run `node shop.mjs` on `127.0.0.1:8000`. The workbench example has login, search, and order endpoints.

You can start without touching a real target. Check whether you can:

- Repeat the same request with `curl`.
- Change `/api/orders/1532` to `/api/orders/1533` while keeping the same session.
- Explain the difference between a `200`, `401`, `403`, and `404` response in the local application.

The example checks order ownership and returns search results as JSON. It is a baseline for learning request handling, not proof that either endpoint contains XSS or IDOR. Part 4 explains what additional evidence would establish those findings.

### Step 3: Write your first report

A report is a set of instructions another person can follow, supported by evidence. Part 6 develops this template:

```text
Title: [Concise description, including the asset and vulnerability type]
Summary: [One sentence describing the affected users or data]
Steps to Reproduce: [Numbered steps with URLs, parameters, and tools]
Expected Behaviour: [What the application should allow or reject]
Actual Behaviour: [What happened, with relevant response evidence]
Impact: [The demonstrated effect on users, data, or the system]
Proof of Concept: [A reproducible curl command or Repeater procedure]
Severity / CVSS: [If requested, the score, version, and reasoning]
Remediation / Fix: [A proposed fix, if you can support it]
References: [Relevant official documentation, advisories, or CVEs]
```

Keep the steps minimal and consistent. Use your own test accounts, redact credentials, and include only the data needed to demonstrate the issue. Separate what you observed from possible further consequences. Do not claim account takeover when you have demonstrated only script execution.

This structure helps a reviewer reproduce the behavior and judge its impact. A missing field does not automatically produce a fixed discount, and filling every field does not guarantee a higher payment.

## Why reward tables need context

A reward table belongs to a specific program. Its categories can depend on the affected product, asset sensitivity, impact, report quality, and other conditions stated in the rules. Eligibility and duplicate handling also matter.

Read the current official rules when evaluating a finding. Keep any historical announcement attached to its date and program; do not combine a past advertised maximum with a different table's multiplier. Parts 6 and 13 explain reporting and how to check payout claims.

The practical lesson is to document the affected asset and demonstrated impact first. That evidence supports the program's evaluation more reliably than choosing a headline reward and working backward.

## Self-check

- [ ] I opened a program's rules and identified the assets and testing methods relevant to my plan.
- [ ] I installed Burp Suite Community and intercepted a local request.
- [ ] I can export a request as cURL and repeat it from a terminal.
- [ ] I can distinguish reward eligibility from a possible payout, without treating either as guaranteed.
- [ ] I understand the learning path: rules → web fundamentals → tools → vulnerabilities → reporting → deeper systems topics → reward verification → a learning map.

## Update history

- 2026-10-15: Replaced the English placeholder with the complete overview, clarified the local lab's baseline behavior, and removed unsupported payout calculations and reward guarantees in both languages.

## References

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules) — program scope and reward conditions.
- [Google's July 2024 reward announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515) — a historical announcement, not a substitute for current rules.
- [Google's 2024 VRP review](https://blog.google/security/vulnerability-reward-program-2024-in/) — historical program results.
- [PortSwigger: Burp Suite documentation](https://portswigger.net/burp/documentation)
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) — an intentionally vulnerable practice application.
- [Meta Private Processing payout guidelines](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Meta scope](https://bugbounty.meta.com/scope/)

This is part 0, the overview. Continue with rules (1), web fundamentals (2), and the workbench (3); parts 6 and 14 bring the reporting workflow and learning path together.
