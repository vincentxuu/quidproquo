---
title: "How to Read Bug Bounty Rules: Scope, Rewards, Exclusions, and Reporting"
date: 2026-10-13
category: tech
type: guide
difficulty: 入門
tags: [bug-bounty, security, rules, scope, rewards, quality-multiplier]
lang: en
description: "Part 1 turns program rules into a test plan: identify eligible assets and methods, record exclusions, and prepare the evidence required for reporting."
tldr: "Read rules through four questions: what may I test, which reward conditions apply, which actions are excluded, and how must I report? A listed asset does not authorize every method or guarantee a payout."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 1
---

> 🌏 [繁體中文版](/posts/tech/2026-10-13-bug-bounty-zero-01-rules-and-scope)

## TL;DR

Read a program through four lenses: **scope, rewards, exclusions, and reporting**. These are a reading framework, not four headings every program must use. Search for `scope`, `reward`, `exclude`, and `report`, then read the surrounding terms and linked product-specific rules.

By the end, you should have a written plan identifying the asset, permitted method, account and data boundaries, stop conditions, and reporting channel. A keyword match or reward table alone is not enough to authorize a test.

## The situation

You enroll in a new program and face a long rules document. You want to start testing, but you need to know whether a host is eligible, which actions are permitted, and what the program expects if you encounter private data.

The useful shortcut is to organize your reading. Skipping conditions is not a shortcut: an eligible product can still have excluded methods, versions, or vulnerability classes.

## Four recurring problems

**Scope is ambiguous.** Wildcards, product names, mobile applications, paths, and explicit exclusions can describe different boundaries. Asset ownership and scope eligibility also differ; a third-party integration is not automatically covered by its parent application's program.

**Reward tables look comparable when they are not.** A web-service finding, a TEE boundary crossing, and a guest-to-host escape have different prerequisites. A shared label such as “code execution” does not make their maximum awards interchangeable.

**Method and data restrictions are missed.** Rules can limit automation, request rates, account use, service disruption, or access to other users' data. Do not invent a universal rate limit from another program's API documentation.

**Reporting conditions become a formula.** Clear evidence helps evaluation, but a CVSS string, remediation suggestion, or video does not automatically earn a particular multiplier. Follow the program's actual requirements.

## A four-step reading workflow

### Step 1: Scope — identify the asset and its conditions

| Example notation | What it may mean | What to confirm in the program |
|---|---|---|
| `*.example.com` | A wildcard covering specified subdomains | Does the root domain count, and which exclusions override it? |
| `example.com` | A particular host or named asset | Does the program also cover related hosts or only this entry? |
| `api.example.com` in an exclusion list | That host is excluded | Do not assume every platform uses `!` as exclusion syntax |
| `/v1/*` | A path constraint in a particular scope format | Which host and methods does it apply to? |
| A product or version name | An application-specific target | Which versions, configurations, and environments qualify? |

These examples illustrate questions, not a scope parser you can apply to every platform.

- [ ] Record the exact asset entry and linked product rules.
- [ ] Read exclusions before turning the entry into a test target.
- [ ] Check invitation, registration, test-account, version, and environment requirements.
- [ ] Record any stated automation or rate limits. If a planned action is unclear, ask through the program's contact route before that action.

### Step 2: Rewards — compare conditions before amounts

| Program example | What to inspect | A comparison to avoid |
|---|---|---|
| Google and Alphabet VRP | Applicable asset tier, impact category, reward table, and stated report-quality considerations | Treating one tier's maximum as the reward for every RCE or XSS |
| Meta Private Processing | Eligible attack surface and external or internal scenario conditions | Treating external versus internal as a report-quality multiplier |
| Microsoft Hyper-V | The boundary crossed, vulnerability class, exploit requirements, and report-quality column | Applying Google's multipliers to Microsoft's table |

Use the official page for the precise product and category. Record its URL and the conditions relevant to your finding. If you quote an amount, distinguish a maximum from an expected payout and keep historical announcements separate from current rules.

A better comparison asks “what attacker capabilities and impact does this row require?” before it asks “which number is largest?”

### Step 3: Exclusions — turn restrictions into stop conditions

| Area to inspect | Examples to check in the rules | Practical consequence |
|---|---|---|
| Social engineering | Phishing or contacting staff under a false identity | Do not assume a technical-testing invitation covers people |
| Availability | Denial of service, resource exhaustion, stress tests | Stay within explicitly permitted methods and stop on service impact |
| Third parties | CDN, identity-provider, or integration assets | Confirm separate authorization rather than inheriting scope |
| Physical access | Device tampering or on-site access | Check whether the program permits that scenario |
| Automation | Scanners, brute force, traffic limits | Apply the program's own constraints |
| Data handling | Private records, credentials, retention, disclosure | Minimize access, use your own accounts, and follow reporting instructions |

Search for `prohibited`, `not allowed`, `exclude`, `social engineering`, `denial of service`, and `data`. The surrounding text determines the rule; these examples are not a universal list of exclusions.

### Step 4: Reporting — make the finding reproducible

Prepare evidence that answers:

- Which eligible asset and account roles are involved?
- What starting state and steps reproduce the behavior?
- What should happen, and what actually happens?
- What impact have you demonstrated, and what remains hypothetical?

Use a minimal cURL or Repeater procedure when helpful, with credentials redacted. Include the relevant response rather than unrelated records. Provide a CVSS version and rationale if requested; do not copy an unexplained vector into every report. Offer a fix when you have a supported suggestion, and use a screenshot or video if it clarifies the reproduction.

Do not download extra private data to manufacture an impact count. A minimal reproducible example and a clear access boundary are more useful than an unsupported estimate of affected users or financial loss.

## Why this structure works

Scope identifies the eligible attack surface. Testing restrictions protect services and other users. Reporting requirements make the finding assessable, while reward rules describe how the program evaluates eligible submissions.

These questions are related but distinct. A report can be technically clear and still be a duplicate or out of scope. A large advertised maximum does not remove the need to satisfy a row's prerequisites.

Save this worksheet before testing:

```text
Program and rules URL:
Asset / product / version:
Registration or invitation requirement:
Permitted method and any traffic limit:
Test accounts and data boundary:
Excluded actions and stop conditions:
Relevant reward category and prerequisites:
Report channel and required evidence:
Unresolved questions:
```

## Self-check

- [ ] I can locate the asset entry and any exclusions that override it.
- [ ] I can state which methods, accounts, and data the planned test uses.
- [ ] I can explain the relevant reward row's prerequisites without promising payment.
- [ ] I recorded stop conditions and the program's reporting channel.
- [ ] I resolved authorization questions before performing the affected action.

Next, part 2 explains HTTP, cookies, and sessions so that part 3's workbench requests make sense.

## Update history

- 2026-10-15: Preserved the systematic rules-reading workflow and synchronized both languages; corrected wildcard assumptions and program comparisons, removed unsupported rate limits, payout guarantees, and invented report-quality formulas.

## References

- [Google and Alphabet VRP Rules](https://bughunters.google.com/about/rules/6625378258649088/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Google's July 2024 announcement](https://bughunters.google.com/blog/increasing-google-alphabet-vrp-rewards-up-to-151515) — historical reward context.
- [Google's 2024 review](https://blog.google/security/vulnerability-reward-program-2024-in/) — historical program results.
- [Meta Private Processing payout guidelines](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Meta scope](https://bugbounty.meta.com/scope/)
- [Meta terms](https://bugbounty.meta.com/terms/)
- [Microsoft Hyper-V Bounty](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Microsoft MSRC Bounty Overview](https://www.microsoft.com/en-us/msrc/bounty)
