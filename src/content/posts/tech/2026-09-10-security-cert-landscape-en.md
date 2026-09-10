---
title: "The Security Certification Landscape — Where Software Developers Should Start"
date: 2026-09-10
category: tech
type: guide
tags: [cybersecurity, certification, ai-security, career, cissp, comptia, aws]
lang: en
tldr: "6+ new AI security certifications launched in just 18 months (2025–2026), while the classic trio — Security+ ($404), AWS Security Specialty ($300), CISSP ($749) — remains foundational. For AI platform developers who aren't security specialists, a three-phase path works best: Security+ → AWS Security → SecAI+ or CAISP → CISSP, totaling $1,800–$2,650."
description: "A certification selection guide for software developers who aren't security specialists: covers 16 mainstream certifications by cost, prerequisites, and market recognition, plus a three-phase roadmap tailored for AI/SaaS platform developers."
draft: false
series:
  name: "資安證照攻略"
  order: 1
---

> 🌏 [中文版](/posts/tech/2026-09-10-security-cert-landscape)

You build AI Agent platforms, wire up LLM APIs, and manage AWS IAM policies — but you've never held a security certification. When a client asks "what security credentials does your team have?", you don't have an answer.

This is the first post in a four-part series. The goal here is a map: where 16 mainstream security certifications sit, what they cost, what they require, and a decision tree that gets you to a plan in 10 minutes. The next three posts dive into AI security cert comparisons, classic cert ROI breakdowns, and Taiwan-specific regulatory and exam prep details.

## Six tracks — figure out which one you're on

Security certifications aren't a single ladder. They're six parallel tracks. You don't need to run all of them, but you should know they exist.

### 1. Foundational

Build baseline literacy and a shared vocabulary.

- **CompTIA Security+** ($404–$439): The globally recognized entry point — 90 questions in 90 minutes, no experience required. Per [SecuSpark 2026 data](https://www.secuspark.com/blog/security-plus-pass-rate-statistics), self-study first-attempt pass rates sit around 50–65%, climbing to 85–93% with structured training.
- **ISC2 CC** ($199): ISC2's entry-level credential. Lower barrier, and strategically useful as a stepping stone toward CISSP or CCSP.

### 2. Cloud security

Match your cert to the cloud your code runs on.

- **AWS Security Specialty** ($300): 65 questions in 170 minutes, covering IAM policies, KMS, VPC security, GuardDuty, and Bedrock security configurations. Per [Pruvos community data](https://www.pruvos.com/certifications/cloud-computing/aws-scs-c03), first-attempt pass rates are roughly 45–55%, rising to 65–70% for candidates with hands-on AWS experience. Holders of any active AWS certification get a 50% discount ($150).
- **Azure AZ-500** ($165): The cheapest cloud security cert, with a 1-year validity and free annual online renewal. Relevant where government or financial clients run Azure.
- **GCP Professional Cloud Security Engineer** ($200): Prioritize this only if you work with Vertex AI.

### 3. Management and governance

For those leading teams, handling compliance, or reporting to boards.

- **CISSP** ($749): The gold standard. Per [Training Camp's 2026 analysis](https://trainingcamp.com/articles/cissp-pass-rate-what-the-numbers-actually-show-in-2026), credible first-attempt pass rate estimates are 50–60% — the widely repeated 20% figure has no traceable source. Only about 500 people in Taiwan hold it, making scarcity a real signal. Requires 5 years of experience across at least 2 of 8 domains; a degree waives 1 year.
- **CISM** ($575–$760): Security management track — governance, risk, incident management. Requires 5 years of security management experience.
- **CRISC** ($575–$760): IT risk control and audit track.

### 4. Offensive security

Red team, penetration testing, bug hunting.

- **OSCP** ($1,749 including course + lab): A grueling 23-hour 45-minute hands-on exam, valid for life. The highest-regard offensive cert in technical circles, but a major investment.
- **CEH v13** ($950–$1,199): Well-known but polarizing in the industry. Note: as of [ISC2's April 1, 2026 policy update](https://destcert.com/resources/how-much-cissp-certification-costs/), CEH no longer counts toward the CISSP experience requirement.

### 5. Application security

Making the code you write secure by design.

- **CSSLP** ($599): Covers the full secure SDLC — requirements, design, coding, testing, deployment, and operations. Requires 4 years of software development security experience. Directly relevant to AI Agent platform development.

### 6. AI security (2025–2026 emerging)

**This is an active battlefield.** Over 6 brand-new certifications launched within 18 months, and no industry standard has emerged yet.

| Certification | Cost | Launched | Exam format | Focus |
|---|---|---|---|---|
| **CompTIA SecAI+** | $359 | 2026/02 | 60 questions / 60 min | Mid-level expansion, stacks on Security+ |
| **CAISP** | $999–$1,099 all-in | 2024 Q4 | 6h hands-on + 24h report | Offensive/defensive, OWASP LLM Top 10 |
| **GIAC GAIPS** | ~$999 exam / ~$9K with course | 2026/07 | CyberLive hands-on | Defensive GenAI/LLM platform security |
| **ISACA AAISM** | $459–$599 | 2025/08 | 90 questions / 150 min | Governance layer (requires CISM or CISSP) |
| **GIAC GASAE** | ~$979 exam | 2026/04 | CyberLive | Red/blue/purple team AI automation |
| **ISC2 CCAI** | TBA | pilot 2025 Q4 | TBA | Security engineering (not yet released) |

Per [Practical DevSecOps market analysis](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison), the share of cybersecurity job postings requiring AI skills doubled from 14.2% to 28.5% between October 2025 and March 2026.

## Comparison table

All costs are USD exam fees; training and materials are extra.

| Certification | Cost | Difficulty | Experience req. | Validity | AI/SaaS relevance |
|---|---|---|---|---|---|
| ISC2 CC | $199 | ⭐ | None | 3 years | Low |
| Security+ | $404 | ⭐⭐ | None | 3 years | Medium |
| SecAI+ | $359 | ⭐⭐ | 2 years cybersec recommended | 3 years | High |
| AZ-500 | $165 | ⭐⭐ | None | 1 year | Medium |
| AWS Security | $300 | ⭐⭐⭐ | 5 years IT recommended | 3 years | Highest |
| CAISP | $999 | ⭐⭐⭐ | None | Lifetime | Highest |
| CSSLP | $599 | ⭐⭐⭐ | 4 years | 3 years | High |
| CEH v13 | $950+ | ⭐⭐⭐ | 2 years or official training | 3 years | Low |
| GAIPS | ~$999 | ⭐⭐⭐⭐ | None | 4 years | Highest |
| CISM | $575+ | ⭐⭐⭐⭐ | 5 years management | 3 years | Medium |
| AAISM | $459+ | ⭐⭐⭐ | Requires CISM/CISSP | 3 years | High |
| CISSP | $749 | ⭐⭐⭐⭐⭐ | 5 years | 3 years | High |
| CCSP | $599 | ⭐⭐⭐⭐ | 5 years (3 in security) | 3 years | Medium |
| OSCP | $1,749 | ⭐⭐⭐⭐⭐ | 2 years recommended | Lifetime | Medium |

## Taiwan regulatory context

You may not need certs for compliance, but understanding regulatory pressure helps you judge which certifications the market actually demands.

**Cybersecurity Management Act 2.0** (passed August 2025, subordinate regulations effective H1 2026): Certain non-government organizations must appoint a CISO and dedicated security staff. Maximum penalties raised to NT$10 million. However, **no specific certification is mandated** — only periodic professional training.

**FSC Listed Company Cybersecurity Guidelines**: Companies are tiered by capitalization — Tier 1 (≥NT$10 billion) must have a CISO plus at least 2 dedicated security staff. The guidelines "recommend" CISSP, CISM, or the domestic Intermediate Information Security Engineer certification, but do not mandate them.

**What job postings actually say**: A [Hua Nan Bank posting from September 2026](https://www.104.com.tw/job/7o6p3) (in Mandarin) lists its accepted certifications explicitly — CISSP, CISM, CompTIA Security+, AWS Certified Security – Specialty, CEH, CCSP, CSSLP. This is a real-world snapshot of what Taiwan's financial sector looks for.

Per [CloudInsight's 2026 salary survey](https://cloudinsight.cc/zh/blog/security-engineer-guide) (in Mandarin), holding advanced certifications like CISSP or OSCP adds 10–20% to a Taiwan security engineer's salary. Senior security managers with 5–8 years of experience earn NT$80,000–120,000 per month.

## Decision tree: a three-phase roadmap

If you're a software developer who doesn't specialize in security, especially building AI/SaaS products:

```
Phase 1 (Foundation + Cloud)
├── CompTIA Security+ ($404)
│   No prerequisites, high market recognition, counts toward
│   1 year of CISSP experience credit
│   Prep: 2–3 months self-study
│
└── AWS Security Specialty ($150–$300)
    Directly aligned with daily work (IAM, KMS, VPC, Bedrock)
    Prep: 2–3 months, ride the momentum from AIF-C01

Phase 2 (AI Security Specialization)
├── Top pick: CompTIA SecAI+ ($359)
│   Best value, vendor-neutral, stacks on Security+
│   40% of exam = Securing AI Systems
│
├── Or: CAISP ($999–$1,099 all-in)
│   Strongest hands-on component, 6h practical exam
│   Full OWASP LLM Top 10 coverage
│   Consistently rated 9/10 by exam takers (details in Part 2)
│
└── Watch: ISC2 CCAI (in pilot), GIAC GAIPS ($999/$9K)

Phase 3 (Long-term credential)
└── CISSP ($749)
    Highest market recognition, ~500 holders in Taiwan
    Security+ counts for 1 year of experience
    Can pass exam first as Associate of ISC2, then accumulate hours
```

### Cost estimate

| Phase | Certification | Exam fee | Study materials (est.) | Subtotal |
|---|---|---|---|---|
| Phase 1 | Security+ | $404 | ~$30 | ~$434 |
| Phase 1 | AWS Security | $150–$300 | ~$30 | ~$180–$330 |
| Phase 2 | SecAI+ | $359 | ~$30 | ~$389 |
| Phase 3 | CISSP | $749 | ~$50 | ~$799 |
| **Total** | | | | **~$1,802–$1,952** |

Taking the CAISP route instead, Phase 2 becomes ~$1,099 (materials and lab included), for a total of ~$2,512–$2,662.

## Study resources at a glance

Preparation ecosystems vary dramatically by certification. Here are the most common paths — Part 4 of this series goes deep.

### Online courses

| Certification | Platform | Price range | Notes |
|---|---|---|---|
| Security+ | Udemy (Professor Messer, Jason Dion) | $15–$30 (sale) | Professor Messer also offers a free full YouTube course |
| AWS Security | Udemy (Stephane Maarek, Neal Davis), AWS Skill Builder | $28–$120 | AWS Skill Builder has free foundational content |
| CISSP | Udemy, LinkedIn Learning, Training Camp bootcamp | $30–$3,000+ | Reddit r/cissp is the most active study community |
| SecAI+ | Infosec Institute Boot Camp, Udemy | $30–$2,500+ | Launched February 2026; resources still building |
| CAISP | Practical DevSecOps official (sole provider) | $999–$1,099 all-in | Includes 60-day lab, videos, PDF, 24/7 Mattermost support, 1 exam attempt |
| GAIPS | SANS SEC545 (sole provider) | ~$9,000 with course / ~$999 exam only | CyberLive practical exam; general purchase opened July 2026 |

### Taiwan-based training providers

| Provider | Key courses | Notes |
|---|---|---|
| [AI Network (全智網科技)](https://ainetwork-training.com/) | CISSP, CCSP, CEH, SecAI+ | ISC2 authorized, Taipei classroom, includes 2-day review boot camp |
| Uuu (恆逸教育訓練中心) | CISSP, CISM, Security+, CEH | EC-Council / CompTIA authorized, widest course selection |
| Gjun (巨匠電腦) | Security+, iPAS, foundational security | Nationwide chain, beginner-friendly, budget pricing |

### Exam venues (Taiwan)

- **Pearson VUE test centers** (CISSP, Security+, SecAI+, CEH): Taipei Xinyi District, United Century Building 12F-3; Kaohsiung Lingya District, Asia Pacific Financial Plaza 4F-1
- **OnVUE online proctoring** (Security+, SecAI+, AWS): Test from home with a private room and stable internet
- **CAISP**: Fully online — 6h hands-on exam + 24h report writing

### Free starting points

Not sure if you want to commit yet? These zero-cost resources let you test the water:

- **Security+**: [Professor Messer's full YouTube course](https://www.youtube.com/@professormesser), CompTIA official sample questions
- **AWS Security**: [AWS Skill Builder free learning path](https://skillbuilder.aws/), [Digital Cloud Training free PDF cheat sheets](https://digitalcloud.training/aws-security-specialty-resources-udemy)
- **CISSP**: ISC2 official sample questions, Reddit r/cissp daily discussions, Discord study groups
- **AI security fundamentals**: [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/) (free, essential reading)

## What to skip (for now)

| Certification | Why |
|---|---|
| CEH | Poor value for money; removed from CISSP experience credit list; less depth than OSCP |
| OSCP | Excellent but too offense-focused for the goal of *building* a secure AI platform |
| AAISM | Requires CISM or CISSP first — it's a second cert, not a first |
| CCSP / CISM / CRISC | 3–5 years of security management experience required; better suited for security specialists |

## Series overview

This is Part 1 of the "Security Certification Playbook" series. Coming next:

- **Part 2**: AI security cert showdown — SecAI+ vs CAISP vs GAIPS vs AAISM, and which ones actually teach you to defend against prompt injection
- **Part 3**: Security+ → AWS Security → CISSP ROI breakdown — study time, pass rates, and maintenance costs with real numbers
- **Part 4**: Taiwan's security certification ecosystem — regulatory details, local training providers, study resources, and exam logistics

## References

- [CompTIA Security+ Official Certification Page](https://www.comptia.org/certifications/security)
- [CompTIA SecAI+ Certification (CY0-001)](https://www.comptia.org/certifications/secai)
- [AWS Certified Security – Specialty (SCS-C03)](https://aws.amazon.com/certification/certified-security-specialty/)
- [ISC2 CISSP Certification](https://www.isc2.org/certifications/cissp)
- [ISC2 AI Security Certification (in development)](https://www.isc2.org/new-ai-certification)
- [GIAC GAIPS (AI Platform Security)](https://www.giac.org/certifications/ai-security-platform-security-gaips)
- [Practical DevSecOps CAISP](https://www.practical-devsecops.com/certified-ai-security-professional/)
- [ISACA AAISM (Advanced in AI Security Management)](https://www.isaca.org/credentialing/aaism)
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [SecuSpark — Security+ Pass Rate Statistics 2026](https://www.secuspark.com/blog/security-plus-pass-rate-statistics)
- [Training Camp — CISSP Pass Rate 2026](https://trainingcamp.com/articles/cissp-pass-rate-what-the-numbers-actually-show-in-2026)
- [Pruvos — AWS SCS-C03 Practice Tests](https://www.pruvos.com/certifications/cloud-computing/aws-scs-c03)
- [CyberSecJobs — Best Cybersecurity Certifications 2026](https://cybersecjobs.com/best-cybersecurity-certifications)
- [CloudInsight — Security Engineer Guide 2026](https://cloudinsight.cc/zh/blog/security-engineer-guide) (in Mandarin)
- [ICSDA — Listed Company Cybersecurity Guidelines FAQ](https://icsda.org.tw/) (in Mandarin)
- [SSDLC by 飛飛 — Taiwan Legal Compliance Guide](https://ssdlc.feifei.tw/taiwan-legal-compliance-guide-pdpa-cybersecurity-act-ssdlc) (in Mandarin)
- [Practical DevSecOps — AI Security Certification Comparison](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison)
