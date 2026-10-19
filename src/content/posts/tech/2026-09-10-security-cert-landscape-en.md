---
title: "The Security Certification Landscape — Where Software Developers Should Start"
date: 2026-09-10
category: tech
type: guide
tags: [cybersecurity, certification, ai-security, career, cissp, comptia, aws]
lang: en
tldr: "10+ new AI security certifications launched in just 18 months (2025–2026), while the classic trio — Security+ ($439), AWS Security Specialty ($300), CISSP ($749) — remains foundational. For AI platform developers who aren't security specialists, a three-phase path works best: Security+ → AWS Security → SecAI+ or CAISP → CISSP, totaling $1,780–$2,700."
description: "A certification selection guide for software developers who aren't security specialists: covers 22 mainstream certifications by cost, prerequisites, and market recognition, plus a three-phase roadmap tailored for AI/SaaS platform developers."
draft: false
series:
  name: "資安證照攻略"
  order: 1
---

> 🌏 [中文版](/posts/tech/2026-09-10-security-cert-landscape)

You build AI Agent platforms, wire up LLM APIs, and manage AWS IAM policies — but you've never held a security certification. When a client asks "what security credentials does your team have?", you don't have an answer.

This is the first post in a four-part series. The goal here is a map: where 22 mainstream security certifications sit, what they cost, what they require, and a decision tree that gets you to a plan in 10 minutes. The next three posts dive into AI security cert comparisons, classic cert ROI breakdowns, and Taiwan-specific regulatory and exam prep details.

## Six tracks — figure out which one you're on

Security certifications aren't a single ladder. They're six parallel tracks. You don't need to run all of them, but you should know they exist.

### 1. Foundational

Build baseline literacy and a shared vocabulary.

- **CompTIA Security+** ($439 after the June 2026 increase): The globally recognized entry point — 90 questions in 90 minutes, no experience required. CompTIA publishes no pass rate, and [SecuSpark's write-up](https://www.secuspark.com/blog/security-plus-pass-rate-statistics) points out that every percentage circulating online is an estimate from a training vendor or a forum poll. A more useful self-check is scoring 85% or higher on practice questions you have not seen before, then booking. The next version, V8 (SY0-801), is expected around November 17, 2026 and adds objectives on AI-related risks.
- **ISC2 CC** ($199): ISC2's entry-level credential. Lower barrier, and strategically useful as a stepping stone toward CISSP or CCSP.

### 2. Cloud security

Match your cert to the cloud your code runs on.

- **AWS Security Specialty** ($300): 65 questions in 170 minutes, covering IAM policies, KMS, VPC security, GuardDuty, and Bedrock security configurations. Per [Pruvos community data](https://www.pruvos.com/certifications/cloud-computing/aws-scs-c03), first-attempt pass rates are roughly 45–55%, rising to 65–70% for candidates with hands-on AWS experience. Holders of any active AWS certification get a 50% discount ($150).
- **Microsoft SC-500** ($165): Replaces AZ-500, which retired on August 31, 2026, and adds security controls for AI workloads to the exam scope. Still the cheapest cloud security cert. Relevant where government or financial clients run Azure.
- **GCP Professional Cloud Security Engineer** ($200): Prioritize this only if you work with Vertex AI.

### 3. Management and governance

For those leading teams, handling compliance, or reporting to boards.

- **CISSP** ($749): The gold standard. Per [Training Camp's 2026 analysis](https://trainingcamp.com/articles/cissp-pass-rate-what-the-numbers-actually-show-in-2026), credible first-attempt pass rate estimates are 50–60% — the widely repeated 20% figure has no traceable source. Few people in Taiwan hold it: [ISC2 member counts compiled by Wentz Wu](https://wentzwu.com/wp-content/uploads/2022/02/CISSP-Member-Count_20220101.pdf) showed 465 as of January 2022, and no later per-country figure appears to be public. Requires 5 years of experience across at least 2 of 8 domains; a degree waives 1 year.
- **CISM** ($575–$760): Security management track — governance, risk, incident management. Requires 5 years of security management experience.
- **CRISC** ($575–$760): IT risk control and audit track.

### 4. Offensive security

Red team, penetration testing, bug hunting.

- **OSCP** ($1,749 including course + lab): A grueling 23-hour 45-minute hands-on exam, followed by 24 hours to submit the report. Passing earns the lifetime OSCP plus the OSCP+, which is valid for 3 years. The highest-regard offensive cert in technical circles, but a major investment.
- **CEH v13** ($950–$1,199): Well-known but polarizing in the industry. Note: under [ISC2's experience waiver list effective April 1, 2026](https://www.isc2.org/Insights/2026/05/CISSP-Experiene-Waiver-Updates), CEH no longer counts toward the CISSP experience requirement (CISA, CRISC, and OSCP were removed at the same time).

### 5. Application security

Making the code you write secure by design.

- **CSSLP** ($599): Covers the full secure SDLC — requirements, design, coding, testing, deployment, and operations. Requires 4 years of software development security experience. Directly relevant to AI Agent platform development.

### 6. AI security (2025–2026 emerging)

**This is an active battlefield.** Over 10 brand-new certifications launched within 18 months, and no industry standard has emerged yet.

| Certification | Cost | Launched | Exam format | Focus |
|---|---|---|---|---|
| **CompTIA SecAI+** | $298 ($359 at launch) | 2026/02 | 60 questions / 60 min | Mid-level expansion, stacks on Security+ |
| **CAISP** | $1,099 all-in | 2024 H2 | 6h hands-on + 24h report | Offensive/defensive, OWASP LLM Top 10 |
| **GIAC GAIPS** | ~$999 exam / ~$9K with course | 2026/07 | CyberLive hands-on | Defensive GenAI/LLM platform security |
| **ISACA AAISM** | $459–$599 | 2025/08 | 90 questions / 150 min | Governance layer (requires CISM or CISSP) |
| **GIAC GASAE** | $999 exam | 2026/04 | 82 questions / 3 hours CyberLive | Red/blue/purple team AI automation |
| **EC-Council COASP** | Official course from $1,699 | 2026/02 | 70 questions / 6 hours (incl. performance-based) | Offensive: AI red teaming; classroom course at Uuu in Taiwan |
| **OffSec OSAI+** | $1,749 (incl. course) | 2026/03 | 24h practical | Offensive: advanced AI red teaming |
| **HTB COAE** | Subscription | 2026/04 | 7-day practical + report | Offensive: leans into adversarial ML |
| **GIAC GOAA** | $999 exam | Available | 56 questions / 2 hours CyberLive | Using AI as an attack tool (not attacking AI) |
| **ISACA AAIR** | $459–$599 | 2026/04 | 90 questions / 150 min | AI risk (requires CRISC or another listed cert) |
| **ISC2 (unnamed)** | TBA | Pilot expected late 2026 | TBA | In development, not operational before 2027 |

Per Cisco AI Workforce Consortium data cited in [Practical DevSecOps' market analysis](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison), 28.5% of cybersecurity job postings between October 2025 and March 2026 required AI skills, up from 14.2% in the same period a year earlier.

Details on the four offensive certifications (COASP, OSAI+, HTB COAE, GOAA) and how to choose among them are in [Part 2](/posts/tech/2026-09-10-ai-security-cert-showdown-en).

## Comparison table

All costs are USD exam fees; training and materials are extra.

| Certification | Cost | Difficulty | Experience req. | Validity | AI/SaaS relevance |
|---|---|---|---|---|---|
| ISC2 CC | $199 | ⭐ | None | 3 years | Low |
| Security+ | $439 | ⭐⭐ | None | 3 years | Medium |
| SecAI+ | $298 | ⭐⭐ | 2 years cybersec recommended | 3 years | High |
| SC-500 (replaces AZ-500) | $165 | ⭐⭐ | None | See Microsoft | Medium |
| GCP Cloud Security Engineer | $200 | ⭐⭐⭐ | None (3 years recommended) | See Google | Medium |
| AWS Security | $300 | ⭐⭐⭐ | 5 years IT recommended | 3 years | Highest |
| CAISP | $1,099 | ⭐⭐⭐ | None | Lifetime | Highest |
| CSSLP | $599 | ⭐⭐⭐ | 4 years | 3 years | High |
| CEH v13 | $950+ | ⭐⭐⭐ | 2 years or official training | 3 years | Low |
| GAIPS | $999 | ⭐⭐⭐⭐ | None | 4 years | Highest |
| GASAE | $999 | ⭐⭐⭐⭐ | None | 4 years | High |
| GOAA | $999 | ⭐⭐⭐ | None | 4 years | Low |
| COASP | Course from $1,699 | ⭐⭐⭐ | None | See EC-Council | High |
| HTB COAE | Subscription | ⭐⭐⭐⭐⭐ | Must complete the AI Red Teamer path | See HTB | High |
| OSAI+ | $1,749 | ⭐⭐⭐⭐⭐ | None (solid security background recommended) | OSAI lifetime / OSAI+ 3 years | High |
| CISM | $575+ | ⭐⭐⭐⭐ | 5 years management | 3 years | Medium |
| CRISC | $575+ | ⭐⭐⭐⭐ | 3 years | 3 years | Low |
| AAISM | $459+ | ⭐⭐⭐ | Requires CISM/CISSP | 3 years | High |
| AAIR | $459+ | ⭐⭐⭐ | Requires CRISC or another listed cert | See ISACA | Medium |
| CISSP | $749 | ⭐⭐⭐⭐⭐ | 5 years | 3 years | High |
| CCSP | $599 | ⭐⭐⭐⭐ | 5 years (3 in security) | 3 years | Medium |
| OSCP | $1,749 | ⭐⭐⭐⭐⭐ | 2 years recommended | Lifetime | Medium |

## Taiwan regulatory context

You may not need certs for compliance, but understanding regulatory pressure helps you judge which certifications the market actually demands.

**Cybersecurity Management Act 2.0** (passed August 29, 2025; in force since December 1, 2025; subordinate regulations reissued January 2026): Certain non-government organizations must appoint a CISO and dedicated security staff. Maximum penalties raised to NT$10 million. However, **no specific certification is mandated** — only periodic professional training.

**FSC staffing tiers and the TWSE control guidelines**: These are two separate documents. The binding one is a Financial Supervisory Commission (FSC) order from late 2021. Per [a TWSE briefing](https://www.twse.com.tw/staticFiles/news/event/8a8216d69236c2e3019240ce8ac7000c.pdf) (in Mandarin), it sorts listed companies into three tiers, and Tier 1 (capitalization ≥NT$10 billion, TWSE 50 constituents, and similar) must appoint a CISO and set up a dedicated security unit with a head and at least 2 dedicated staff. The [Cybersecurity Control Guidelines for Listed Companies](https://dsp.tpex.org.tw/storage/co_download/%E4%B8%8A%E5%B8%82%E4%B8%8A%E6%AB%83%E5%85%AC%E5%8F%B8%E8%B3%87%E9%80%9A%E5%AE%89%E5%85%A8%E7%AE%A1%E6%8E%A7%E6%8C%87%E5%BC%95.pdf) (in Mandarin), issued separately by the Taiwan Stock Exchange and the Taipei Exchange, are advisory and mention no certification at all; they only require security managers and staff to take professional training every year. The Securities and Futures Bureau's internal-control FAQ says companies may "require relevant cybersecurity competency certifications" without naming one. The commonly cited CISSP, CISM, and Intermediate Information Security Engineer are practical advice from private groups such as ICSDA.

**What job postings actually say**: A [Hua Nan Bank posting from September 2026](https://www.104.com.tw/job/7o6p3) (in Mandarin) lists its accepted certifications explicitly — CISSP, CISM, CompTIA Security+, AWS Certified Security – Specialty, CEH, CCSP, CSSLP. This is a real-world snapshot of what Taiwan's financial sector looks for.

On pay, [CloudInsight's security engineer guide](https://cloudinsight.cc/zh/blog/security-engineer-guide) (in Mandarin) cites 104 Salary data (updated September 28, 2026; 543 valid samples): the P25–P75 monthly range for security engineers is NT$51,000–74,000 at 5–10 years of experience and NT$51,000–87,000 at 10+ years, with security managers and CISOs counted separately. Its take on certifications: CISSP and OSCP help in salary negotiation, but without hands-on experience a certificate alone does little for pay.

## Decision tree: a three-phase roadmap

If you're a software developer who doesn't specialize in security, especially building AI/SaaS products:

```
Phase 1 (Foundation + Cloud)
├── CompTIA Security+ ($439)
│   No prerequisites, high market recognition, counts toward
│   1 year of CISSP experience credit
│   Prep: 2–3 months self-study
│
└── AWS Security Specialty ($150–$300)
    Directly aligned with daily work (IAM, KMS, VPC, Bedrock)
    Prep: 2–3 months, ride the momentum from AIF-C01

Phase 2 (AI Security Specialization)
├── Top pick: CompTIA SecAI+ ($298)
│   Best value, vendor-neutral, stacks on Security+
│   40% of exam = Securing AI Systems
│
├── Or: CAISP ($1,099 all-in)
│   Strongest hands-on component, 6h practical exam
│   Full OWASP LLM Top 10 coverage
│   Consistently rated 9/10 by exam takers (details in Part 2)
│
└── Watch: ISC2 AI security cert (in development), GIAC GAIPS ($999/$9K)

Phase 3 (Long-term credential)
└── CISSP ($749)
    Highest market recognition, few holders in Taiwan
    Security+ counts for 1 year of experience
    Can pass exam first as Associate of ISC2, then accumulate hours
```

### Cost estimate

| Phase | Certification | Exam fee | Study materials (est.) | Subtotal |
|---|---|---|---|---|
| Phase 1 | Security+ | $439 | ~$30 | ~$469 |
| Phase 1 | AWS Security | $150–$300 | ~$30 | ~$180–$330 |
| Phase 2 | SecAI+ | $298 | ~$30 | ~$328 |
| Phase 3 | CISSP | $749 | ~$50 | ~$799 |
| **Total** | | | | **~$1,776–$1,926** |

Taking the CAISP route instead, Phase 2 becomes ~$1,099 (materials and lab included), for a total of ~$2,547–$2,697.

## Study resources at a glance

Preparation ecosystems vary dramatically by certification. Here are the most common paths — Part 4 of this series goes deep.

### Third-party online courses

Checked item by item on October 18–19, 2026. Udemy prices are the list prices an anonymous visitor sees on Udemy's pages; Udemy discounts constantly and prices vary by region and over time, so what you actually pay may be lower. Items I could not price are marked as such. Check the page before buying.

| Certification | Platform | Price | Notes |
|---|---|---|---|
| Security+ | Udemy ([Jason Dion](https://www.udemy.com/course/securityplus), [Total Seminars / Mike Meyers](https://www.udemy.com/course/total-comptia-security-plus)) | Jason Dion's course lists at $119.99 and Mike Meyers' at $24.99; Dion's Security+ practice exams Set 1 is sold separately at $64.99 | Jason Dion's course is about 31 hours with one full practice exam, rated 4.7. Professor Messer's course is free [on his own site](https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/); I found no Udemy listing for him, so the earlier "Udemy (Professor Messer)" wording was removed |
| AWS Security | Udemy ([Stephane Maarek SCS-C03](https://www.udemy.com/course/ultimate-aws-certified-security-specialty/)), AWS Skill Builder | The Udemy topic page (July 2026) showed the course on sale at $17.99 (list $119.99) and practice exams at $14.99 (list $64.99); the course page showed no price when rechecked in October 2026, so check the page for the current price | Maarek's course is about 17 hours, mostly slides, no practice exam, and its page requires Solutions Architect Associate-level knowledge. The Neal Davis course mentioned earlier was not found |
| CISSP | [LinkedIn Learning (Mike Chapple)](https://www.linkedin.com/learning/isc2-certified-information-systems-security-professional-cissp-2024-cert-prep), Udemy (Jason Dion, Thor Pedersen), [Destination Certification](https://destcert.com/cissp), [Training Camp](https://trainingcamp.com/training/cissp-certification-bootcamp/) | LinkedIn Learning: third-party sources disagree ($29.99–$39.99/month, about $239.88/year), no official current price found; on Udemy, Jason Dion's full CISSP course lists at $99.99 (39 hours; his 6 practice exams are $64.99 extra), Thor Pedersen's practice-question courses run about $59.99–$79.99 each and his per-domain video courses about $94.99–$139.99; DestCert 5-day online bootcamp $2,697; Training Camp's 6-day live class does not publish a price, quote required | Chapple's course is the 2024 edition, about 21.5 hours, video only; Thor has both practice-question courses and per-domain video courses on Udemy, but per his own site Udemy does not carry everything (no flashcards, for example), and the full bundle is on his site; Reddit r/cissp is the most active study community |
| SecAI+ | [Infosec Institute Boot Camp](https://www.infosecinstitute.com/courses/comptia-secai-plus-boot-camp/), Udemy (several instructors, new in 2026) | Infosec 3-day camp $2,699 (exam voucher included); on Udemy, one SecAI+ practice-question course lists at $19.99 (instructor Mana Dowlatshahi Yeganeh), and I did not price the other courses | Launched February 2026; Udemy courses have few reviews (most under 500) |
| CAISP | Practical DevSecOps official (sole provider) | $1,099 all-in | Includes 60-day lab, videos, PDF, 24/7 Mattermost support, 1 exam attempt |
| GAIPS | SANS SEC545 (sole provider) | ~$9,000 with course / ~$999 exam only | CyberLive practical exam; general purchase opened July 2026 |

### Online courses from international vendors and platforms

You can take all of these from home, with no classroom and no travel. Prices are the public prices found in October 2026 and change often; check the official page before you buy.

| Certification | Course | Price / terms | Notes |
|---|---|---|---|
| Security+ | [Professor Messer's free full course](https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/) | Free | SY0-701, 121 videos, about 15 hours; the PDF notes are sold separately |
| Security+ | [CompTIA CertMaster Learn](https://www.comptia.org/en-us/resources/certmaster-training/learn/) | Reseller list prices of roughly $450–$600, 12-month access | Official self-paced course with videos, hands-on questions and practice questions; can be bundled with an exam voucher |
| Security+ | [Google Cybersecurity Certificate (Coursera)](https://www.coursera.org/professional-certificates/google-cybersecurity) | $49/month in the US and Canada; the official estimate is under $300 for most learners | 8 courses, under 6 months; graduates get a discount on the Security+ exam and training. Aimed at SOC-analyst basics, not a mirror of the Security+ exam objectives |
| CISSP | [ISC2 Official Online Self-Paced Training](https://www.isc2.org/training/online-self-paced/cissp-online-self-paced) | $995 list price in the ISC2 store (180-day access) | Adaptive learning, official eTextbook, 400+ practice questions; if you fail the first attempt you can retake the course free within a year |
| CC (ISC2 entry level) | [ISC2 CC free-program notice](https://www.isc2.org/landing/1mcc) | The free program stopped taking new enrollments on May 20, 2026; the CC exam costs $199 | Holders of an unexpired exam code must sit the exam by December 31, 2026 |
| AWS Security | [AWS Skill Builder](https://aws.amazon.com/training/digital/) | Free tier includes standard exam prep and official practice question sets; individual subscription $29/month or $449/year | The subscription adds Builder Labs, enhanced exam prep and official practice exams |
| SC-900 (Microsoft security fundamentals) | [Microsoft Learn learning paths](https://learn.microsoft.com/en-us/training/paths/describe-concepts-of-security-compliance-identity/) | Free | Entry level, not an advanced security certification |

In short: Security+ and AWS Security have good free or low-cost online material. ISC2's official CISSP online course is expensive, so most people pair Udemy or community resources with the official sample questions.

### Taiwan-based training providers

| Provider | Key courses | Notes |
|---|---|---|
| [Uuu (恆逸教育訓練中心)](https://www.uuu.com.tw/Course/Show/47/CISSP) | CISSP, CCSP, CSSLP, Security+, [SecAI+](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-), CEH, CPENT, [COASP AI Security](https://www.uuu.com.tw/Course/Show/3332/COASP) | EC-Council / CompTIA / ISC2 authorized; widest selection; only Taiwan provider offering both SecAI+ and COASP classroom training |
| [AI Network (全智網科技)](https://ainetwork-training.com/) | CISSP, CCSP, Security+, SecAI+ | ISC2 / Cisco / CompTIA / Palo Alto authorized, Taipei classroom, includes 2-day review boot camp |
| [WUSON (吳文智老師)](https://wentzwu.com/courses) | CISSP only | Taiwan's only CISSP advanced triple-crown holder (ISSAP + ISSEP + ISSMP); monthly cohorts consistently sold out; volunteer coaching team for exam prep |
| [DEVCORE](https://netmag.tw/2024/07/19/devcore-bring-global-security-training-agency-offsec-introduces-factory-instructor-physical-course-to-alive-taiwan-security-talent) | OSCP+, OSEP, OSWE | Partnered with OffSec in 2024 for Taiwan's first in-person courses taught by OffSec factory instructors (OSCP, OSWA, OSDA, OSEE that year); [in 2026](https://training.devco.re/2026) courses are mainly taught in Mandarin by DEVCORE instructors |
| Gjun (巨匠電腦) | Security+, iPAS Information Security Engineer (entry level) | Nationwide chain, beginner-friendly |

### Exam venues (Taiwan)

- **Pearson VUE test centers**: ISC2 exams (CISSP, CCSP) are offered at two sites in Taiwan, the Pearson-run center at United Century Building 12F-3 in Taipei's Xinyi District and the [Uuu-operated authorized center](https://www.uuu.com.tw/TestCenter/Info) at Asia Pacific Financial Plaza 4F-1 in Kaohsiung's Lingya District. CompTIA exams (Security+, SecAI+) can also be taken at Uuu's other centers and at authorized centers such as Gjun
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
| CCSP / CISM / CRISC | 3–5 years of experience required (CCSP: 5 years in IT including 3 in security; CISM: 5 years in security management; CRISC: 3 years); better suited for security specialists |

## Series overview

This is Part 1 of the "Security Certification Playbook" series. Coming next:

- **Part 2**: AI security cert showdown — SecAI+ vs CAISP vs GAIPS vs AAISM, and which ones actually teach you to defend against prompt injection
- **Part 3**: Security+ → AWS Security → CISSP ROI breakdown — study time, pass rates, and maintenance costs with real numbers
- **Part 4**: Taiwan's security certification ecosystem — regulatory details, local training providers, study resources, and exam logistics

## Update log

- 2026-10-18: Added the table "Online courses from international vendors and platforms" under study resources, with prices and terms for Professor Messer, CertMaster Learn, the Google Cybersecurity Certificate, ISC2 online CISSP training, AWS Skill Builder, and Microsoft Learn. The older "Online courses" table became "Third-party online courses" and was rechecked item by item: removed "Professor Messer on Udemy" and the unverified Neal Davis course, replaced the vague $15–$30, $28–$120 and $30–$3,000+ ranges with sourced per-course prices, and marked every price that could not be retrieved. On October 19 the Udemy prices were rechecked against Udemy's own pages: Jason Dion's Security+ course lists at $119.99 (the earlier "usually under $20 on sale" came from a third-party review that no Udemy page backed up, and was removed), Mike Meyers' at $24.99, Jason Dion's CISSP course at $99.99, and Thor Pedersen's practice-question and per-domain courses are now priced. The Maarek course page showed no price this time, so the July sale snapshot stays, labeled as such.
- 2026-10-12: SecAI+ exam fee changed from $359 to the current $298 and the cost estimate recalculated. CAISP updated to its current $1,099 and GASAE to $999. The Security+ pass-rate and Taiwan salary passages cited figures that their source pages no longer carry after revisions, so both now reflect what the sources say today. Taiwan CISSP holder count replaced with a dated statistic. Added the Cybersecurity Management Act effective date. Fixed the source link for the CEH waiver change and the wording of the AI job-posting statistic. Added GCP, CRISC, GASAE, GOAA, COASP, HTB COAE, OSAI+, and AAIR to the comparison table. Certification count corrected from 16 to 22. Corrected the regulatory passage: the staffing tiers come from an FSC order, while the control guidelines are an advisory document from the TWSE and TPEx that recommends no certification. Test center notes now distinguish by certifying body. DEVCORE, AI Network, and Gjun course listings updated to match their current sites. CAISP launch changed to 2024 H2. Added the OSCP report window and OSCP+ validity.
- 2026-10-08: Added COASP, OSAI+, HTB COAE, GOAA, and AAIR to the AI security category. AZ-500 has retired and is replaced by SC-500. Corrected ISC2's status (the original "CCAI pilot 2025 Q4" was wrong). Security+ exam fee switched to the post-increase $439 and the cost estimate recalculated.

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
- [SecuSpark — Security+ Pass Rate 2026: Why There Is No Official Number](https://www.secuspark.com/blog/security-plus-pass-rate-statistics)
- [Training Camp — CISSP Pass Rate 2026](https://trainingcamp.com/articles/cissp-pass-rate-what-the-numbers-actually-show-in-2026)
- [Pruvos — AWS SCS-C03 Practice Tests](https://www.pruvos.com/certifications/cloud-computing/aws-scs-c03)
- [CyberSecJobs — Best Cybersecurity Certifications 2026](https://cybersecjobs.com/best-cybersecurity-certifications)
- [CloudInsight — Security Engineer Guide 2026](https://cloudinsight.cc/zh/blog/security-engineer-guide) (in Mandarin)
- [ICSDA — Listed Company Cybersecurity Guidelines FAQ](https://icsda.org.tw/) (in Mandarin)
- [SSDLC by 飛飛 — Taiwan Legal Compliance Guide](https://ssdlc.feifei.tw/taiwan-legal-compliance-guide-pdpa-cybersecurity-act-ssdlc) (in Mandarin)
- [Practical DevSecOps — AI Security Certification Comparison](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison)
- [EC-Council COASP](https://iclass.eccouncil.org/our-courses/certified-offensive-ai-security-professional)
- [OffSec AI-300 (OSAI+)](https://www.offsec.com/courses/ai-300/)
- [Hack The Box COAE](https://academy.hackthebox.com/preview/certifications/htb-certified-offensive-ai-expert)
- [GIAC GOAA](https://www.giac.org/certifications/offensive-ai-analyst-goaa)
- [ISACA AAIR](https://www.isaca.org/credentialing/aair)
- [Microsoft SC-500 (Cloud and AI Security Engineer Associate)](https://learn.microsoft.com/en-us/credentials/certifications/cloud-and-ai-security-engineer-associate/)
- [Microsoft — AZ-500 retirement notice](https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/)
- [ISC2 — CISSP Experience Waiver Updates](https://www.isc2.org/Insights/2026/05/CISSP-Experiene-Waiver-Updates)
- [ISC2 — CISSP Experience Requirements](https://www.isc2.org/certifications/cissp/cissp-experience-requirements)
- [Wentz Wu — CISSP by Countries (ISC2 member counts, January 1, 2022)](https://wentzwu.com/wp-content/uploads/2022/02/CISSP-Member-Count_20220101.pdf)
- [GIAC — Certification Pricing and Fees](https://www.giac.org/pricing)
- [TWSE — cybersecurity briefing for listed companies (staffing tiers)](https://www.twse.com.tw/staticFiles/news/event/8a8216d69236c2e3019240ce8ac7000c.pdf) (in Mandarin)
- [TWSE / TPEx — Cybersecurity Control Guidelines for Listed Companies (September 2024 revision)](https://dsp.tpex.org.tw/storage/co_download/%E4%B8%8A%E5%B8%82%E4%B8%8A%E6%AB%83%E5%85%AC%E5%8F%B8%E8%B3%87%E9%80%9A%E5%AE%89%E5%85%A8%E7%AE%A1%E6%8E%A7%E6%8C%87%E5%BC%95.pdf) (in Mandarin)
- [TWSE information security portal (includes the internal-control FAQ)](https://dsp.twse.com.tw/informationSecurity/list) (in Mandarin)
- [Uuu — test center information](https://www.uuu.com.tw/TestCenter/Info) (in Mandarin)
- [DEVCORE Training 2026](https://training.devco.re/2026) (in Mandarin)
- [OffSec — OSCP+ Exam Guide](https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- [GIAC GASAE](https://www.giac.org/certifications/ai-security-automation-engineer-gasae)
- [ISACA — Earn a CRISC Certification](https://www.isaca.org/credentialing/crisc/get-crisc-certified)
- [Google Cloud — Professional Cloud Security Engineer](https://cloud.google.com/learn/certification/cloud-security-engineer)
- [Lee and Li — Amended Cyber Security Management Act promulgated](https://www.leeandli.com/TW/NewslettersDetail/7505.htm) (in Mandarin)
- [NCNU Computer Center — Cyber Security Management Act in force from December 1, 2025](https://cc.ncnu.edu.tw/p/406-1001-31660,r471.php?Lang=zh-tw) (in Mandarin)
- [Uuu — CompTIA SecAI+ course (includes an exam voucher worth USD 298)](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-) (in Mandarin)
- [Professor Messer — SY0-701 Security+ free course](https://www.professormesser.com/security-plus/sy0-701/sy0-701-video/sy0-701-comptia-security-plus-course/)
- [CompTIA — CertMaster Learn](https://www.comptia.org/en-us/resources/certmaster-training/learn/)
- [Coursera — Google Cybersecurity Professional Certificate](https://www.coursera.org/professional-certificates/google-cybersecurity)
- [ISC2 — CISSP Online Self-Paced Training](https://www.isc2.org/training/online-self-paced/cissp-online-self-paced)
- [ISC2 — One Million Certified in Cybersecurity (concluded)](https://www.isc2.org/landing/1mcc)
- [AWS Skill Builder](https://aws.amazon.com/training/digital/)
- [Microsoft Learn — SC-900 learning paths](https://learn.microsoft.com/en-us/training/paths/describe-concepts-of-security-compliance-identity/)
