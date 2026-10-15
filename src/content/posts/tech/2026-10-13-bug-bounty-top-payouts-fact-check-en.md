---
title: "Bug Bounty Payout Map: What Google, Hyper-V, Meta TEE, Apple and Mozilla Pay For"
date: 2026-10-13
category: tech
type: guide
difficulty: 進階
tags: [bug-bounty, security, rewards, payouts, vrp, google, meta, microsoft, apple, comparison]
lang: en
description: "Part 13: read representative categories from five official programs through attacker position, exploit outcomes, evidence and report quality."
tldr: "Read payouts with their product, category, threat scenario and evidence requirements; program ceilings and quality rules are not interchangeable."
draft: false
series:
  name: "Bug Bounty from Zero"
  order: 13
---

> 🌏 [繁體中文版](/posts/tech/2026-10-13-bug-bounty-top-payouts-fact-check)

After web bugs, memory, virtual machines and TEEs, the headline payouts become easier to read. This map compares representative categories from five programs. The useful question is what outcome a payment requires, and whether you can produce that evidence. The figures below are in US dollars, from official rules available on October 15, 2026.

Workflow position: choose a program → read scope → understand the target → find a bug → report it → **weigh the payout and research effort**.

## What each number actually buys

| Program and representative category | Official amount | Conditions to read alongside it |
|---|---|---|
| Google/Alphabet VRP: server RCE, S0 on T0 or T1 | $101,010 base | Report-quality factors are 0.8, 1 and 1.2, at the panel’s discretion |
| Microsoft Hyper-V: L1 guest RCE | Up to $250,000 | This cell requires a functioning exploit and a high-quality report; reports without an exploit have separate ceilings |
| Meta WhatsApp Private Processing: TEE code execution, privilege escalation, or VM escape | Each up to $300,000 | External attack scenarios; internal scenarios use a different table |
| Apple: network attack requiring no interaction, reaching kernel control | Up to $2,000,000 | The exploit-chain outcome and proof requirements for that category must be met |
| Apple PCC: remote attack on request data achieving specified unsigned code execution | $1,000,000 category | PCC has its own trust boundary and requirements, separate from device-kernel categories |
| Mozilla client security: Highest Impact | Up to $20,000 | Depends on actual impact, supported configurations and report quality; a qualifying sandbox escape is one example |

These categories connect to the preceding lessons. They are not a ranking of every company’s largest possible payment across all products. Some programs also have bonuses and exclusions, so the amounts do not price identical work.

## Google: choose the right cell before applying quality

[Google’s current rules](https://bughunters.google.com/about/rules/6625378258649088/google-and-alphabet-vulnerability-reward-program-vrp-rules) distinguish target tiers, vulnerability categories and impact. Server RCE in S0 has a $101,010 base for T0 and T1, and $75,000 for normal Google applications in T2. A hostname ending in `google.com` does not automatically make it T0.

Quality then applies to the appropriate base. If the panel assigns exceptional quality, the T0/S0 example is:

```text
101,010 × 1.2 = $121,212
```

That is an example for a particular cell. A reproducible PoC, impact analysis and clear responses help triage, but checking boxes does not guarantee a 1.2 factor. Other adjustments exist, and the panel decides the final amount. A historical headline maximum also does not establish a universal 1.5 multiplier in the current rules.

## Microsoft: exploit evidence and report quality define the cell

[The Hyper-V program](https://www.microsoft.com/en-us/msrc/bounty-hyper-v) lists separate ceilings for L1 guest RCE. With a functioning exploit and a high-quality report, the maximum is $250,000. Without an exploit, high-, medium- and low-quality reports have ceilings of $200,000, $100,000 and $50,000 respectively. L2 categories reach up to $150,000; the high-quality information-disclosure category reaches $25,000.

L1 and L2 are virtualization levels. They cannot be reduced to “guest-to-host” versus “guest-to-guest.” Explain the starting privileges, nested environment, boundary crossed and demonstrated outcome. This is why part 10 traces a real case’s data path instead of stopping at “VM escape.”

Google’s 0.8/1/1.2 factors do not apply to this table. Use Microsoft’s eligibility conditions and the ceiling in the relevant cell.

## Meta: external and internal describe the threat scenario

[The Private Processing guidelines](https://bugbounty.meta.com/payout-guidelines/private-processing/) apply to WhatsApp’s named system. In external scenarios, code execution inside the TEE, including bypassing code attestation, privilege escalation and escape to the host each reach up to $300,000. Data leaks reach $150,000 and persistence $10,000.

Internal scenarios use different limits: code execution, privilege escalation and data leaks each reach $50,000; VM escape is N/A and persistence reaches $5,000. A sixfold difference is not a report-quality penalty. The attacker starts in a different position. Nor does this table apply to every Intel SGX, AMD SEV or AI product: first establish that the affected system is in scope.

## Apple: distinguish exploit-chain outcomes from PCC

[Apple’s categories page](https://security.apple.com/bounty/categories/) organizes rewards around demonstrated outcomes. A network attack requiring no interaction and reaching kernel control has a category up to $2,000,000. Browser-to-kernel control has a $1,000,000 category. Where Target Flags are required, their proof requirements must be met.

PCC has separate conditions. A remote attack on request data that achieves unsigned code execution with arbitrary entitlements within the Apple PCC software image belongs to a $1,000,000 category. Access to user request data outside the trust boundary has a separate $250,000 category. These are not a combined requirement to compromise a device kernel and PCC in one chain.

[The program homepage](https://security.apple.com/bounty/) also describes conditional bonuses. Plan around an outcome you can demonstrate, then check each additional condition. Possible bonuses are not guaranteed payments.

## Mozilla: make the issue diagnosable and fixable

[Mozilla’s client bug bounty](https://www.mozilla.org/en-US/security/client-bug-bounty/) has a base table up to $20,000 for valid, potentially exploitable high- or critical-rated client security vulnerabilities, depending on impact and report quality. Highest Impact includes a qualifying sandbox escape. The Higher Impact category containing UXSS reaches $10,000; the High Impact category reaches $3,000.

The report needs enough information to diagnose and fix the issue, a simple reproducible test, and evidence such as an ASan trace or crash dump, or a root-cause analysis. A full exploit is not required. The page separately covers mitigation bypasses and qualifying bonuses: $20,000 is the ceiling in this base table, not an absolute ceiling for every possible program scenario.

## Turn the map into a research decision

Larger figures often come with harder demonstration requirements. When comparing opportunities, write down four things: what target you may legally test, the attacker’s starting position, the boundary to cross, and the evidence you can submit. This is a planning method, not a claim about how vendors set prices.

For a beginner, part 4’s local XSS and IDOR exercises already train reproduction and authorization reasoning. A large Hyper-V or kernel-chain award does not mean it should become your first month’s target. Part 6’s time-budget and expected-value framework, followed by the next chapter’s practice plan, connects the price map to action.

## Check your understanding

- Can you name the product, category and prerequisites behind each amount?
- Can you distinguish Google quality factors, Microsoft table ceilings and Meta’s external/internal scenarios?
- Why should Apple device exploit chains and PCC be compared separately?
- If you have demonstrated a crash but not a crossed security boundary, how should the report describe it?
- What reproducible evidence will next week’s exercise produce?

[Previous: AI product vulnerabilities](/posts/tech/2026-10-14-bug-bounty-zero-10-ai-era-bounty-en) · [Next: certifications and a learning map](/posts/tech/2026-10-14-bug-bounty-zero-12-certifications-and-learning-map-en)

## References

- [Google and Alphabet VRP current rules and reward table](https://bughunters.google.com/about/rules/6625378258649088/google-and-alphabet-vulnerability-reward-program-vrp-rules)
- [Microsoft Hyper-V Bounty Program](https://www.microsoft.com/en-us/msrc/bounty-hyper-v)
- [Meta WhatsApp Private Processing Payout Guidelines](https://bugbounty.meta.com/payout-guidelines/private-processing/)
- [Apple Security Bounty Categories](https://security.apple.com/bounty/categories/)
- [Apple Security Bounty program](https://security.apple.com/bounty/)
- [Mozilla Client Security Bug Bounty Program](https://www.mozilla.org/en-US/security/client-bug-bounty/)
