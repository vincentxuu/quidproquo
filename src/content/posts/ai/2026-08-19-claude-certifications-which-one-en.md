---
title: "Choosing Among the Four Claude Certifications: First Check Whether You Can Even Register"
date: 2026-08-19
type: guide
category: ai
tags: [certification, anthropic, claude, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 24
tldr: "Before comparing exam objectives there is one fact that outranks all of them: registration for the Claude certifications is open only to organizations in the Claude Partner Network — individuals cannot sign up. For those who clear that gate, four things actually decide the answer. CCAO-F ($99) does not count toward partner tier eligibility while the other three do. Claude Code is 20% of CCAR-F but only 3.1% of CCDV-F — the architect exam tests the tool far more heavily than the developer exam. CCAR-P is 28% non-technical (governance 14% plus stakeholder communication 14%), which nothing else in this series is. And CCAO-F is the cheapest but only 14% Prompting; Output Evaluation at 21% is its real spine. All four are valid 12 months, with retakes at 14 / 30 / 90 days and 4 attempts per rolling 12 months."
description: "A selection guide to Anthropic's four certifications (CCAO-F, CCDV-F, CCAR-F, CCAR-P): the partner-only registration gate first, then the domain weights from the official exam guides that separate the four roles — partner tier eligibility, the Claude Code weight inversion, the 28% non-technical block, plus where the official sources disagree and what Anthropic has not published."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-19-claude-certifications-which-one)
>
> This is a selection guide built from official sources, not an exam-day account — I have not sat any of these exams. Every "what it tests" points back to the four official exam guides and certification pages; no braindumps. Verified 2026-08-19.

## The most important thing first: you probably cannot register

The [Pearson VUE Claude Certification Program page](https://www.pearsonvue.com/us/en/anthropic.html) is blunt about it:

> Certification is **open to organizations in the Claude Partner Network** and counts toward partner program standing.

**All four are the same.** There is no individual registration path — you cannot put your own card down and sit CCAO-F for your résumé. That is exactly why this series originally excluded the Claude four (see the series' [specification roundup](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)). They were written up later because their exam guides are the most detailed public statement anyone has published about how the roles in an AI rollout divide up.

So there are two ways to read this post:

- **You are inside a partner organization** (Accenture, Deloitte, PwC, EPAM, and Wipro are among the firms that have publicly committed to certifying people at scale): read on for which of the four to pick.
- **You are not**: you cannot sit any of them, but **the four weight tables are Anthropic's definition of these four roles** — what "using Claude to do work," "building against the API," "designing solutions," and "facing compliance and customers" each require, and in what proportion. As a map for your own positioning, or for designing internal training, that is more useful than the badge.

## The official specs (reconciled from the four prep posts)

Each of the four prep posts carries its own comparison table. **Checked cell by cell, the four tables agree — there are no conflicting numbers among them.** Consolidated:

| | [CCAO-F](/posts/ai/2026-08-18-claude-certified-associate-prep-guide-en) | [CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide-en) | [CCAR-F](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en) | [CCAR-P](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide-en) |
|---|---|---|---|---|
| Price | **$99** | $125 | $125 | **$175** |
| Questions | 60 | **53** (fewest) | 60 | **63** (most) |
| Time | 120 min | 120 min | 120 min | 120 min |
| Passing score | 720 (scale 100–1,000) | 720 | 720 | 720 |
| Validity | 12 months | 12 months | 12 months | 12 months |
| Domains | 7 | 8 | 5 | 7 |
| Heaviest domain | Output evaluation **21%** | Applications & integration **33.1%** | Agentic architecture **27%** | Integration **19%** |
| Coding required | **No** | Yes (Python / TypeScript) | Yes | Yes |
| Counts toward partner tier | **No** | Yes | Yes | Yes |

All four run 120 minutes, so **the per-question budget varies a lot**: CCDV-F is the roomiest at roughly 2 min 15 s per question, and CCAR-P's 63 questions are the tightest at under 1 min 55 s. One footnote on price: CCAR-F's guide says the checkout amount reflects your partner tier discount, so $125 is list, not what you pay.

## Fork one: CCAO-F does not count toward partner tier eligibility

This is the one rule among the four that can flip the answer outright. The CCAO-F certification page carries a note that **the new Claude Certified Associate certification does not count towards Claude Partner Network tier eligibility**. The other three count toward partner program standing.

Anthropic's announcement post spells out what tier standing is made of:

> Tier standing in the Claude Partner Network combines certified practitioners with deployed customers and public customer references.

**So ask first why the organization is certifying at all:**

- **To move up a partner tier** → CCAO-F does nothing for that. The $99 price advantage is irrelevant; put the budget on the other three.
- **To get non-technical colleagues genuinely using Claude well** → CCAO-F is the only fit, and the only one of the four that does not require writing code.

These two motives routinely get discussed as one purchase, and the result is a block of seats that does not count toward tier.

## Fork two: Claude Code is 20% of the architect exam and 3.1% of the developer exam

Lining up the four guides, this is the most counter-intuitive cell in the whole set:

| Exam | Claude Code domain | Weight |
|---|---|---|
| CCAR-F | Claude Code Configuration & Workflows | **20%** |
| CCDV-F | Claude Code | **3.1%** |
| CCAR-P | Developer Productivity & Operational Enablement | 7% |
| CCAO-F | No dedicated domain | — |

**Most people guess this backwards.** The intuition is "developers live in Claude Code, so the developer exam tests it most," and the reality is that CCAR-F weights it more than six times as heavily. The two exams are asking different questions:

- **CCAR-F asks "how do you roll Claude Code out to a team":** the three-level CLAUDE.md hierarchy (user / project / directory), path-scoped loading via `.claude/rules/`, Commands versus Skills, `context: fork`, plan mode versus direct execution, and non-interactive `-p` runs in CI/CD. These are **configuration and process decisions**.
- **CCDV-F asks "how do you build the thing against the API":** its 33.1% first domain is Claude API mechanics plus software engineering, and Claude Code is just one of the interfaces inside it.

CCAR-P's 7% is the same subject compressed at the professional level — it assumes you can already configure it and tests enabling and troubleshooting it for a team.

**What that means for choosing**: if your actual job is "setting the team's Claude Code conventions," the exam that matches is CCAR-F, not CCDV-F, however much you think of yourself as an engineer.

## Fork three: CCAO-F is the cheapest, and it is not a prompting exam

CCAO-F's seven domains weigh in at 21 / 16 / 15 / 14 / 12 / 12 / 10:

| Domain | Weight |
|---|---|
| Output Evaluation and Validation | **21%** |
| Workflow Integration and Solution Design | 16% |
| Governance, Risk, and Responsible Use | **15%** |
| Prompting and Task Execution | **14%** |
| Product and Model Selection | 12% |
| Configuration and Knowledge Management | 12% |
| Troubleshooting and Optimization | 10% |

**Prompting is 14%, while output evaluation at 21% plus governance at 15% comes to 36%.** More than a third of the exam is about judging whether Claude's output can be trusted and when it should not be used at all — spotting hallucinations, deciding when human review is required, applying data-sensitivity and regulatory considerations.

That changes who it suits. It is not a beginner's version of the developer credential, and it is not a prompt-writing certificate; the official exclusion clause says plainly that it is **not** for software developers who build against APIs or design agentic systems — that scope belongs to the Architect and Developer credentials. It is designed for a role that hands technical work upward; the verb the guide uses is *escalate*.

## Fork four: 28% of CCAR-P is not technical

CCAR-P's seven domains run 19 / 17 / 16 / 14 / 14 / 13 / 7, and two of them are its identity:

- **Governance, Safety & Risk Management 14%**: guardrails, LLM risks and failure modes, regulatory compliance (the guide names **GDPR, HIPAA, FedRAMP**), AI ethics, human-in-the-loop validation.
- **Stakeholder Communication & Lifecycle Management 14%**: structured requirements discovery and interviews, stakeholder feedback loops and SLA alignment, architecture documentation, and the five lifecycle stages.

**That is 28% combined, and no other certification in this series has anything like a "stakeholder communication" domain.** Meanwhile its Claude Models, Prompting & Context Engineering domain is only 13% — well below the equivalent content in CCDV-F.

The test is simple: **if your responsibility stops at "get the system built," that 28% is both the least familiar and the most expensive part of the four ($175 is the highest price); if you sit across the table from customer legal and security, this is the one designed for you.** For the cross-vendor material on the governance half, see [AI governance frameworks across exams](/posts/ai/2026-08-18-ai-governance-frameworks-exam-domains-en).

## The one-page decision table

| What you actually do | Pick | Why |
|---|---|---|
| Use Claude for daily work and build Claude Projects, no code | **CCAO-F $99** | The only one with no coding requirement — but it **does not count toward partner tier** |
| Ship against the Claude API daily, write MCP servers and agents | **CCDV-F $125** | 33.1% on API mechanics and software engineering; Claude Code only 3.1% |
| Set the team's Claude Code workflow, design agentic solutions | **CCAR-F $125** | Claude Code 20% plus agentic architecture 27% |
| Face customer compliance and security, own architecture and delivery | **CCAR-P $175** | Governance 14% plus stakeholder 14% |
| The organization is certifying for tier standing | Anything but CCAO-F | Only those three count toward partner program standing |

**The four are not a ladder.** No exam guide lists any of them as a prerequisite for another, and CCAR-F is not a prerequisite for CCAR-P — the basis for choosing is scope of responsibility, not seniority. (There is one place where the official sources disagree on this; see the next section.)

## Rules all four share

**Validity is 12 months across the board.** On-time renewal is a **free, non-proctored** assessment on the Anthropic Partner Academy; **let it lapse and that path is gone** — restoring the credential means paying full price for the full exam ($99 / $125 / $125 / $175). Anthropic also reserves the right to require a full retake instead of a renewal assessment when exam content changes substantially.

**Retake intervals** ([Pearson VUE](https://www.pearsonvue.com/us/en/anthropic.html)):

> If you don't pass, you can retake the exam after a short waiting period: **14 days** after your first attempt, **30 days** after your second, and **90 days** after your third. You can take up to **4 attempts** per exam in any rolling 12-month period.

Within this series that penalty sits in the middle: stricter than AWS's unlimited retakes, far softer than Google's year-long wait after a third failure. Practically, **you can schedule more aggressively than on the Google track, but not so aggressively that one attempt is all you get** — a third failure costs 90 days while the 12-month validity clock keeps running.

**Delivery**: all four are proctored (online or at a Pearson test center) with identity verification, and passing issues a digital badge through Credly by Pearson.

## Two places the official sources disagree

Per this series' discipline, **when official sources conflict, cite both and mark it uncertain rather than picking one as fact.**

**One: is it a ladder or not?**

- Anthropic's [announcement post](https://claude.com/blog/four-role-based-claude-certifications) says: "Every path to getting credentialed **starts with a foundation-level certification and advances to the professional-level**." Read literally, that implies CCAR-P requires a foundation-level credential first.
- But CCAR-P's exam guide sets no prerequisite, and none of the four guides lists any other exam as a prerequisite.

**Current reading**: there is no hard prerequisite in the registration mechanics (the exam guides are the normative documents), and the announcement sentence most likely describes a recommended path rather than an eligibility rule. If your organization is sequencing training on the strength of it, **confirm with your partner contact** rather than relying on this post.

**Two: three roles or four?**

- The Pearson VUE page says "three roles to choose from: **Practitioner, Architect, and Developer**" — and then lists four certifications on the same page.
- Anthropic's announcement says the certifications map to the **four** largest roles, and the non-technical credential is called **Associate**, not Practitioner.

Three versus four is reconcilable (Architect has both a Foundations and a Professional level, so three roles yield four exams), but **the Practitioner/Associate naming mismatch is real** — search both terms when hunting for official material.

## What Anthropic has not published (do not estimate it)

Anthropic publishes less about these four than any other vendor in this series. Below is what is **verifiably absent**; this post does not fill the gaps:

| Item | Status |
|---|---|
| Sub-domain weights | **Published for CCDV-F only** (broken out below 1%); CCAO-F, CCAR-F, and CCAR-P publish only at domain level |
| Penalty for wrong answers | CCAR-F's exam guide says nothing about it — **do not treat "no penalty for guessing" as known** |
| Pass rates | Not published |
| Scenario-draw structure | **Documented for CCAR-F only** (six scenario banks, four drawn); the other three guides say nothing equivalent, which is not evidence they share the structure |
| Individual registration path | Does not exist — this is not "unpublished," it is officially partner-organizations-only |

## What will go stale (check here next time)

| Item | Status as of 2026-08-19 | Recheck |
|---|---|---|
| Registration gate | Claude Partner Network organizations only, no individuals | Quarterly |
| CCAO-F excluded from partner tier | Note still present on the official certification page | Every 6 months |
| The four specs | $99 / $125 / $125 / $175; 60 / 53 / 60 / 63 questions | Quarterly |
| Domain weights | 21-16-15-14-12-12-10; 33.1-16.8-14.7-11.0-10.6-8.1-3.1-2.6; 27-18-20-20-15; 19-17-16-14-14-13-7 | Quarterly |
| Retake rules | 14 / 30 / 90 days, 4 attempts per 12 months | Every 6 months |
| Three-roles vs four-certifications naming | The two official pages still disagree | On each page revision |

## References

- [Pearson VUE — Claude Certification Program (registration gate, retake and proctoring rules)](https://www.pearsonvue.com/us/en/anthropic.html)
- [Anthropic: four role-based Claude certifications](https://claude.com/blog/four-role-based-claude-certifications)
- [Claude Certified Associate – Foundations certification page](https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification)
- [Claude Certified Developer – Foundations certification page](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification)
- [Claude Certified Architect – Foundations certification page](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification)
- [Claude Certified Architect – Professional certification page](https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification)
- [Claude Academy FAQ (free course certificates vs. proctored certifications)](https://academy.claude.com/help/faq)

**Related posts**

- [AI Certifications for Engineers in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Claude Certified Associate (CCAO-F) prep path](/posts/ai/2026-08-18-claude-certified-associate-prep-guide-en)
- [Claude Certified Developer (CCDV-F) prep path](/posts/ai/2026-08-18-claude-certified-developer-prep-guide-en)
- [Claude Certified Architect Foundations exam guide](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en)
- [Claude Certified Architect Professional (CCAR-P) prep path](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide-en)
- [Multi-agent architecture across five exams](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
- [AI governance frameworks across exams](/posts/ai/2026-08-18-ai-governance-frameworks-exam-domains-en)
- [How prompt and context engineering get tested](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains-en)
