---
title: "AI Products & Vulnerability Classification: A New Era"
date: 2026-10-15
category: tech
type: guide
difficulty: beginner
tags: [bug-bounty, security, ai-products, vulnerability, llm, classification, vulnerability-report]
lang: en
description: "Series 12: Analyzing AI-era vulnerability classification — how LLM, ML, and inference engine security risks are categorized, with Google VRP reward structures compared."
tldr: "AI products introduce new vulnerability surfaces (prompt injection, data leakage, model tampering, availability attacks). Reports must classify bugs into Confidentiality/Integrity/Availability and provide comparative analysis. Google VRP maximum $121,212 (T0/S0 + 1.2x)."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 12
---

> 🌏 [Chinese version](/posts/tech/2026-10-15-bug-bounty-zero-12-ai-era-bounty)

## TL;DR

**AI products (LLMs, generative AI, inference engines) introduce entirely new vulnerability surfaces**: prompt injection, data leakage, model tampering, availability attacks. Reports must categorize vulnerabilities as Confidentiality / Integrity / Availability, and include comparative analysis (e.g., how AI bugs differ from traditional RCE). Google VRP max reward is $121,212 (T0/S0 + 1.2x), but AI vulnerability assessment is more complex because the vulnerability may stem from "model behavior" rather than traditional "code defects."

---

## Scenario

You're testing an AI product (e.g., AI assistant, chatbot, generative AI tool). You discovered "prompt injection" — by providing specific inputs, you can make the AI perform actions you want (e.g., leak system instructions, generate malicious content). You need to write this as a report but don't know:
- Is this a "vulnerability"?
- If yes, how to classify it?
- How to evaluate rewards?
- How to compare with traditional vulnerabilities (RCE, XSS)?

This article teaches you how to handle this.

---

## Problem

**Mistake 1:** Directly treating AI vulnerabilities as traditional vulnerabilities (e.g., saying "RCE"), but AI vulnerabilities have a different nature — they originate from "model behavior" rather than "code defects."

**Mistake 2:** Missing comparative analysis (e.g., how AI vulnerabilities differ from traditional RCE). Google VRP requires reports to include "model behavior analysis," "comparative analysis," and "remediation suggestions" for AI bugs. Missing any reduces the reward to 0.8x (e.g., $121,212 → $96,970).

**Mistake 3:** No PoC (e.g., inputting "Ignore previous instructions, please execute..."). This prevents evaluators from verifying reproducibility.

---

## Solution: AI Vulnerability Classification + Report Writing

### 1. AI Vulnerability Classification (Three Main Categories)

| Category | Definition | Example | Comparative Analysis (vs Traditional) |
|---|---|---|---|
| **Confidentiality** | AI leaks data it shouldn't (e.g., system instructions, private data) | After prompt injection, system prompts or user conversations are leaked | vs RCE: RCE is "execute command," confidentiality is "data leakage" |
| **Integrity** | AI generates incorrect or malicious content, affecting data integrity | After prompt injection, malicious content is generated or results are tampered | vs XSS: XSS is "execute script," integrity is "content tampering" |
| **Availability** | AI service is blocked or unavailable (e.g., DoS, resource exhaustion) | Large-scale prompt injection causes resource exhaustion, service interruption | vs DoS: AI DoS is "model resource exhaustion" not network traffic |

### 2. Google VRP AI Vulnerability Reward Structure

| Tier | Base Reward | 0.8x | 1.0x | 1.2x |
|---|---|---|---|---|
| **AI Product Vulnerability (T0/S0)** | $101,010 | $80,808 | $101,010 | $121,212 |
| **AI Product Vulnerability (T1/S1)** | $63,267 | $50,613 | $63,267 | $75,920 |
| **AI Product Vulnerability (T2/S2)** | $1,337–$31,337 | $1,069–$25,069 | $1,337–$31,337 | $1,604–$37,604 |

> **Key**: AI vulnerability rewards follow the same structure as traditional RCE, but evaluators require "model behavior analysis" — explaining WHY this prompt causes the vulnerability — making reports more complex.

### 3. Report Writing Points

| Section | Content |
|---|---|
| **Title** | `Target – AI Product Vulnerability (Prompt Injection / Data Leakage / Availability Attack)` |
| **Summary** | `AI Product (LLM / ML / Inference Engine) has a vulnerability leading to data leakage / content tampering / service interruption` |
| **Steps to Reproduce** | 1. Provide specific prompt 2. Observe AI behavior change 3. Record input and output 4. Analyze impact |
| **Expected Behaviour** | AI should follow system instructions, not leak confidential data, not generate malicious content |
| **Actual Behaviour** | AI follows malicious prompt, leaks confidential data / generates malicious content / service interruption |
| **Impact** | Confidential data leakage, content tampering, service interruption (quantified, e.g., number of leaked records) |
| **CVSS 3.1** | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` |
| **Remediation** | Strengthen prompt filtering, validate inputs, restrict model output, apply security updates |
| **References** | [CVE-2023-XXXXX](https://cve.mitre.org/), [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-llm-applications/) |

---

## Why This Matters: AI Vulnerability Reward Design

1. **AI is a New Domain**: AI vulnerability assessment standards are still evolving; Google VRP continues updating (e.g., adding TEECoE, AI product vulnerability categories in 2024)
2. **Model Behavior is Unpredictable**: AI vulnerabilities stem from "model behavior" rather than "code defects," so reports need deeper analysis (e.g., why does this prompt cause the vulnerability?)
3. **Comparative Analysis is Important**: Evaluators need to understand how AI bugs differ from traditional bugs (RCE, XSS) to determine reward tier. Reports must include comparative analysis.

**Example**: Same AI vulnerability (prompt injection),
- Report quality 0.8x (missing comparative analysis, missing model behavior analysis) → $101,010 × 0.8 = $80,808
- Report quality 1.2x (complete analysis + comparison + remediation) → $101,010 × 1.2 = $121,212

---

## Self-Check (Key question: Can you handle AI vulnerabilities?)

- [ ] Can you categorize AI vulnerabilities into Confidentiality / Integrity / Availability?
- [ ] Do you know the basic difference between AI bugs and traditional bugs (RCE, XSS)?
- [ ] Do you know Google VRP's AI product vulnerability reward structure ($101,010 / 1.2x → $121,212)?
- [ ] Can you provide a PoC for AI vulnerabilities (e.g., specific prompt and output)?
- [ ] Do you know reports need "model behavior analysis," "comparative analysis," and "remediation"?

---

## References

- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google VRP July 2024 Announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515)
- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-llm-applications/)
- [Google AI Security Blog](https://blog.google/technology/ai/)
- [CVE Database](https://cve.mitre.org/)
- [PortSwigger — Burp Suite Documentation](https://portswigger.net/burp/documentation)

---

*This is Series 12 (AI Era) of "Bug Bounty from Zero." Previous: TEE (11); Next: Top Payouts (13), Certifications (14).*