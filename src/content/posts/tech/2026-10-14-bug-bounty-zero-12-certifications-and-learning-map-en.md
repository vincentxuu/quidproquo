---
title: "Bug Bounty Certifications and a Practice Map for Articles 0–14"
date: 2026-10-14
category: tech
type: guide
tags:
  - bug-bounty
  - security
  - certification
  - career
  - owasp
lang: en
description: "Choose practice and certifications for research, careers, or curiosity, using concrete outputs across series articles 0–14."
tldr: "Finish a reproducible practice report, identify your gaps, then choose a course or credential; certification does not authorize testing."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 14
---

> 🌏 [繁體中文版](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map)

## Decide what to practice before choosing an exam

By article 14, you have encountered rules, the web, a research workbench, reports, memory, virtual machines, TEEs, and AI products. Should your next step be more practice or a certification?

My suggestion is to finish one practice report that you can reproduce yourself. Use it to identify what is missing: networking fundamentals, vulnerability understanding, tool use, or explaining impact. Then decide which course or exam addresses that gap. OSCP, Security+, and CISSP serve different learning and career purposes; none is a compulsory next step for every reader of this series.

A certification also does not authorize testing a particular website. Consult the target program's current complete rules for permitted assets, prohibited actions, participation, and payment conditions. This article does not determine your eligibility for individual programs or predict bounty income.

## How to use the site's four certification guides

The certification guides began with the needs of software developers and people building secure platforms. Vulnerability researchers can reuse their comparison methods while selecting material for their own goals.

| Article | Read first | Use it to decide |
|---|---|---|
| [Security certification landscape](/posts/tech/2026-09-10-security-cert-landscape-en) | The boundaries between fundamentals, offensive security, application security, and governance | Choose a capability area; do not turn six categories into a ladder everyone must complete |
| [AI security certification comparison](/posts/tech/2026-09-10-ai-security-cert-showdown-en) | How it distinguishes protecting AI systems from using AI in security work | Check whether a syllabus covers your intended threats and practice; an AI label does not establish fit |
| [ROI breakdown of three classic certifications](/posts/tech/2026-09-10-security-cert-roi-en) | Its approach to preparation time, registration, and maintenance costs | Budget your time and money; salary estimates do not predict bounty income |
| [Taiwan's security certification ecosystem](/posts/tech/2026-09-10-taiwan-security-cert-ecosystem-en) | How it examines job postings and training resources | Compare your intended roles; assess corporate compliance needs separately from authorization to test |

For a career change, find specific jobs you would apply for and list skills separately from credentials. For web vulnerability practice, compare syllabuses and labs against the work you want to do. Before paying, check the certification provider's current version, fees, and rules. This article does not repeat prices or exam durations that may change.

## A practice map for articles 0–14

This table follows the revised series ordering. Older numbers in filenames do not determine the current article number. Each row has a concrete output so you can distinguish reading about an activity from completing it.

| Articles | Topic and practice entry point | What to produce |
|---|---|---|
| 0–1 | Overview, rules, and scope: select a program and read its rules without sending test traffic | One page listing permitted assets, prohibited methods, and unresolved questions |
| 2–3 | Websites and the workbench: use browser developer tools, an intercepting proxy, or curl against your own local service | Compare the same request across tools; label cookies, parameters, and responses |
| 4 | XSS and IDOR: choose an XSS or Access control lab in the [PortSwigger Web Security Academy](https://portswigger.net/web-security) | Explain which check is missing at which boundary, and how to verify a fix |
| 5 | RCE: choose an OS command injection lab in the Academy | Trace input to the command-execution boundary and explain why a fix works |
| 6 | Reporting and triage: write a report about the authorized practice lab above | Preconditions, reproduction steps, observed results, and impact that another person can follow |
| 7–8 | Memory and overflows: rerun the series' local examples, then select suitable [pwn.college](https://pwn.college/) material and challenges | Record input, program state, and results; identify where the overflow occurs |
| 9–10 | VMs, hypervisors, and an escape case: redraw the articles' isolation boundaries and public case analysis | Distinguish guest, host, affected component, and prerequisites; reading a case is different from performing an escape |
| 11 | TEEs and confidential computing: compare the architecture material cited in the article | A threat model identifying whose data is protected, whom it trusts, and what it does not protect against |
| 12 | AI product bounty programs: read the target rules and the [OWASP LLM risk list](https://owasp.org/www-project-top-10-for-large-language-model-applications/) | Three separate columns for risk categories, permitted scope, and qualifying-report conditions |
| 13 | Bounty map: return to official reward pages | Record maximum rewards together with their conditions; do not treat them as average income |
| 14 | Certifications and this learning map: review your outputs | Choose one gap, one resource, and a time to inspect your next result |

The Academy's official page provides free learning material and interactive labs. The pwn.college home page describes free participation and asks learners not to publish challenge solutions, walkthrough videos, or livestreams. Follow each platform's rules and distinguish private practice notes from material you may publish.

[OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) is another practice project that you can deploy in your own environment using its official instructions. It is intentionally vulnerable. Check access boundaries before deployment so the exercise service is not exposed to other people. These resources are starting points; listing them does not claim completion of every challenge. The VM and TEE portions of this map focus on reading, diagrams, and threat models, rather than promising a ready-made lab suitable for every beginner.

## Three goals, three next steps

### Changing careers

1. Find specific job postings and separate required skills, helpful certifications, and day-to-day responsibilities.
2. Choose a lab relevant to the role and write an explanation someone else can reproduce.
3. Compare the job requirements with your gaps, then compare course or certification content, cost, and preparation arrangements.

### Understanding the principles

1. Pick a local example from articles 2–6 and follow the request, vulnerability, and report through a complete cycle.
2. For lower-level topics, continue with articles 7–10; first explain the prerequisites and isolation boundaries.
3. Explain why one fix works in your own words. The part you cannot explain is your next study target.

### Trying a formal vulnerability program

1. Read its complete rules and check the target, methods, and personal participation conditions. Ask the program about unresolved questions first.
2. Practice the relevant vulnerability class in an authorized lab and record your hypotheses and evidence.
3. Use article 6 to structure your report and set a time budget. If the evidence does not establish a vulnerability, do not present a suspected impact as confirmed.

These routes can overlap. A certification may provide a syllabus or a career signal; practice outputs show what you can currently do. Neither guarantees finding a new vulnerability or receiving a reward.

## Self-check

- [ ] I can distinguish learning resources, credential requirements, and authorization to test.
- [ ] I have a practice report with prerequisites, reproduction steps, and impact.
- [ ] I can identify the next capability gap to address.
- [ ] If registering for an exam, I have checked its current official version and conditions.
- [ ] I have not treated a maximum bounty, a salary figure, or a credential as an income guarantee.

## Update history

- 2026-10-15: Reorganized practice around revised articles 0–14 and aligned both languages; removed unsupported eligibility, free-book, hypervisor-category, and fixed preparation-time claims while retaining practical exercises and certification reading guidance.

## References

- [PortSwigger Web Security Academy](https://portswigger.net/web-security): free learning material and interactive labs.
- [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/): an intentionally vulnerable open-source practice application.
- [pwn.college](https://pwn.college/): practice platform, free participation, and its request about publishing solutions.
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/): an entry point for identifying AI application risks.
- [Google VRP Rules](https://bughunters.google.com/about/rules/google-friends/google-and-alphabet-vulnerability-reward-program-vrp-rules), [Meta Bug Bounty Scope](https://bugbounty.meta.com/scope/), and [Microsoft Hyper-V Bounty](https://www.microsoft.com/en-us/msrc/bounty-hyper-v): program-rule entry points; read current complete terms before participating.
- [OffSec OSCP Exam Guide](https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide): exam information; this article does not prescribe OSCP for every vulnerability researcher.
