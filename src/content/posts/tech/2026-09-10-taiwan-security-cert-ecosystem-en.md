---
title: "Taiwan's Security Certification Ecosystem — Regulations, Training, Resources, and Exam Logistics"
date: 2026-09-10
category: tech
type: guide
tags: [cybersecurity, certification, taiwan, career, cissp, comptia, training]
lang: en
tldr: "Taiwan's Cybersecurity Act 2.0 passed and FSC's three-tier system is in place, but neither mandates specific certifications — real demand comes from the job market. Taiwan has 7+ training providers: Uuu has the widest catalog (classroom courses for all three of SecAI+, COASP, and OSAI+), WUSON is the CISSP legend (monthly cohorts sold out through mid-2027), and DEVCORE was the first to bring OffSec factory instructors. ISC2 test centers in Taipei and Kaohsiung; most certs also support online proctoring from home."
description: "A complete guide to Taiwan's security certification ecosystem: the real impact of Cybersecurity Act 2.0, the FSC staffing tiers, and the TWSE control guidelines, 7 training providers compared, exam venues, iPAS local certification, study resources, and free starting paths."
draft: false
series:
  name: "資安證照攻略"
  order: 4
---

> 🌏 [中文版](/posts/tech/2026-09-10-taiwan-security-cert-ecosystem)

The first three parts mapped the [full landscape](/posts/tech/2026-09-10-security-cert-landscape-en), ran the [AI security cert showdown](/posts/tech/2026-09-10-ai-security-cert-showdown-en), and crunched the [classic cert ROI](/posts/tech/2026-09-10-security-cert-roi-en). This final installment covers what's unique to Taiwan: what regulations actually require, where to train, where to sit exams, and whether local alternatives exist.

## Regulations: where the push comes from

### Cybersecurity Management Act 2.0 (passed August 29, 2025; in force since December 1, 2025; subordinate regulations reissued January 2026)

Per [SSDLC by 飛飛's regulatory analysis](https://ssdlc.feifei.tw/taiwan-legal-compliance-guide-pdpa-cybersecurity-act-ssdlc) (in Mandarin), this is the first major revision since the Act took effect in 2019:

| Change | Details |
|---|---|
| Authority transferred | Executive Yuan → Ministry of Digital Affairs (MODA, via the Administration for Cyber Security) |
| Expanded audit scope | Presidential Office and all five Yuans now included |
| Non-government organizations | Must appoint a **CISO** and **dedicated security staff** |
| Banned products | Products deemed harmful to national cybersecurity banned at statutory level |
| Penalty ceiling | Failure to report: NT$10 million; failure to remediate: NT$5 million |
| Outsourcing | Written contracts with rights, obligations, and liability clauses required |
| Personnel vetting | Dedicated security staff must pass suitability checks |

**What this means for you**: If your company is a government contractor, critical infrastructure supplier, or part of a listed company's supply chain, the Act's requirements reach you indirectly. But the Act itself **does not mandate any specific certification** — only periodic training:
- ≥3 hours of professional training per person every 2 years
- ≥3 hours of general awareness training annually

### FSC staffing tiers and the TWSE control guidelines

These are two separate documents that are often lumped together as "the FSC guidelines." The binding one is a Financial Supervisory Commission (FSC) order dated December 28, 2021 (No. 11003656544, under Article 9-1 of the Regulations Governing Establishment of Internal Control Systems by Public Companies). Per [a TWSE briefing](https://www.twse.com.tw/staticFiles/news/event/8a8216d69236c2e3019240ce8ac7000c.pdf) (in Mandarin), listed companies are sorted into three tiers for security staffing, and a company's tier can go up but not down:

| Tier | Criteria | Security staffing required | Deadline |
|---|---|---|---|
| Tier 1 | Capitalization ≥NT$10 billion or TWSE 50 constituent | CISO + security director + ≥2 dedicated staff | End of 2022 |
| Tier 2 | Others without consecutive losses | Security director + ≥1 dedicated staff | End of 2023 |
| Tier 3 | Consecutive losses or net value below par | ≥1 dedicated staff (encouraged) | No fixed date |

The other document is the Cybersecurity Control Guidelines for Listed Companies, issued by the Taiwan Stock Exchange and the Taipei Exchange. Its ten chapters cover policy and organization, risk assessment, protective controls, outsourcing, and incident reporting, and it is advisory: companies may adopt it as fits their industry and size. [The guidelines themselves](https://dsp.tpex.org.tw/storage/co_download/%E4%B8%8A%E5%B8%82%E4%B8%8A%E6%AB%83%E5%85%AC%E5%8F%B8%E8%B3%87%E9%80%9A%E5%AE%89%E5%85%A8%E7%AE%A1%E6%8E%A7%E6%8C%87%E5%BC%95.pdf) (in Mandarin) mention no certification at all; they only require security managers and staff to take professional training every year. The Securities and Futures Bureau's internal-control FAQ says companies may "provide appropriate training or require relevant cybersecurity competency certifications" without naming one. The commonly cited **CISSP, CISM, and Intermediate Information Security Engineer (iPAS)** are practical advice from private groups such as ICSDA, not a requirement of the guidelines.

**The real push comes from the job market.** Per [Cathay Securities' 2025 sustainability report](https://www.cathaysec.com.tw/download/2025年永續報告書.pdf) (in Mandarin), its 11 dedicated security staff hold 25 international certifications: ISO 27701 Lead Auditor (20), CEH (6), CompTIA Security+ (4), CISM (2), CISSP (1), CCSP (1). A [Hua Nan Bank job posting from September 2026](https://www.104.com.tw/job/7o6p3) (in Mandarin) explicitly lists accepted certifications: CISSP, CISM, Security+, AWS Security Specialty, CEH, CCSP, CSSLP.

### Financial Cybersecurity Action Plan 2.0

The FSC's finance-specific framework (2022) imposes requirements directly relevant to developers:

- Security testing (SAST, DAST, penetration testing) before core system launches
- Regular vulnerability scanning and patching
- E-transaction security: multi-factor authentication, transaction signing
- Incident reporting: 30 minutes to 24 hours depending on severity

If your AI Agent platform serves financial clients, these requirements become your product requirements.

## Taiwan training providers: complete comparison

### International certification training

| Provider | Authorized by | Key certifications | Differentiator | Price range |
|---|---|---|---|---|
| [Uuu (恆逸)](https://www.uuu.com.tw/Course/Show/47/CISSP) | EC-Council / CompTIA / ISC2 | CISSP, CCSP, CSSLP, SSCP, [Security+](https://www.uuu.com.tw/Course/Show/1607/CompTIA-Security-), [SecAI+](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-), CySA+, CEH, CPENT, CCT, [COASP AI Security](https://www.uuu.com.tw/Course/Show/3332/COASP), [OSAI+](https://www.uuu.com.tw/Course/Show/3408/OSAI), CCSE | **Widest catalog** — classroom courses for all three of SecAI+, COASP, and OSAI+; all three major cert bodies authorized | NT$42,000–65,000; COASP NT$68,000, OSAI+ NT$149,000 |
| [AI Network (全智網)](https://ainetwork-training.com/) | ISC2 / Cisco / CompTIA / Palo Alto | CISSP, CCSP, Security+, SecAI+, CCNA | Taipei classroom, small class sizes; CISSP includes 2-day review boot camp (NT$20,000 value); running SecAI+ webinars as of 2026/09 | NT$36,000 (CISSP weekend early-bird; list price NT$56,000) |
| [WUSON (吳文智)](https://wentzwu.com/courses) | — | **CISSP only** | Taiwan's only CISSP advanced triple-crown holder (ISSAP + ISSEP + ISSMP); monthly cohorts sold out through mid-2027; volunteer coaching team for exam prep; known for "WISE Security Essentials" teaching methodology | Contact for pricing |
| [iSpan (資展國際)](https://www.ispan.com.tw/CISSP) | — | CISSP prep course | 37-hour classroom course, weekends; for experienced professionals who want a short sprint | Contact for pricing |
| [DEVCORE](https://netmag.tw/2024/07/19/devcore-bring-global-security-training-agency-offsec-introduces-factory-instructor-physical-course-to-alive-taiwan-security-talent) | OffSec partnership | OSCP+, OSEP, OSWE | Ran Taiwan's first in-person courses taught by OffSec factory instructors in 2024 (OSCP, OSWA, OSDA, OSEE that year); [in 2026](https://training.devco.re/2026) courses are mainly taught in Mandarin by DEVCORE instructors; offense-focused | NT$109,000 (OSCP, per [HackMD compilation](https://hackmd.io/@hiiii/ryOzgaf0a)) |
| Gjun (巨匠電腦) | CompTIA | Security+, iPAS Information Security Engineer (entry level) | Nationwide chain, beginner-friendly; also a Pearson VUE partner test site | Not listed on its site |

### Where to take AI security certification courses

Compiled October 2026. Classroom courses in Taiwan cluster around SecAI+, and only Uuu offers the offensive-side ones. For the rest I found only the vendors' own online courses.

| Certification | Classroom in Taiwan | Vendor online / self-study |
|---|---|---|
| SecAI+ | [Uuu](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-), [AI Network](https://ainetwork-training.com/courses/secai/) (3 days, NT$30,000), [NSIT](https://www.nsit.com.tw/course_detail/46) (5 days, NT$38,000), [iSpan](https://www.ispan.com.tw/comptia-secai-plus/) | Several CY0-001 prep courses on Udemy |
| COASP | [Uuu](https://www.uuu.com.tw/Course/Show/3332/COASP) (40 hours, NT$68,000, includes one exam attempt) | [EC-Council](https://iclass.eccouncil.org/our-courses/certified-offensive-ai-security-professional) on-demand from $1,699, live online from $2,499 |
| OSAI+ | [Uuu](https://www.uuu.com.tw/Course/Show/3408/OSAI) (40 hours, NT$149,000) | [OffSec](https://www.offsec.com/courses/ai-300/) $1,749 (90 days self-paced + 1 attempt) |
| HTB COAE | None found | [HTB Academy](https://academy.hackthebox.com/preview/certifications/htb-certified-offensive-ai-expert) AI Red Teamer path, by subscription |
| CAISP | None found | [Practical DevSecOps](https://www.practical-devsecops.com/certified-ai-security-professional/) $1,099, includes 60-day labs and the exam |
| GAIPS | None found | [SANS SEC545](https://www.sans.org/cyber-security-courses/genai-llm-application-security), 5 days live or self-paced |
| AAISM | None found | [ISACA](https://www.isaca.org/credentialing/aaism) official Online Review Course |
| TAISE | None found | [CSA](https://cloudsecurityalliance.org/education/taise) $795, training and exam bundled |

### Financial sector mandatory training

| Provider | Courses | Notes |
|---|---|---|
| [Taiwan Academy of Banking and Finance (金融研訓院)](https://www.tabf.org.tw/CourseLegalIntroduce.aspx?a=nlOruBvit%2Fw%3D) | Financial ISMS management, third-party supply chain security, web attack/defense, zero trust architecture, **AI financial security resilience**, cloud security | Legally recognized for financial sector security training hours; 7 topics in 2026 Q4 including AI security |
| ACAD (安碁學苑) | Security awareness, technical skills, certifications, competency, custom courses | Online + in-person, enterprise training focus |

### How to choose

| Your goal | Recommended | Why |
|---|---|---|
| Pass CISSP first try | **WUSON** or **Uuu** | WUSON is Taiwan's consensus top CISSP instructor; book early (sold out months ahead). Uuu has ISC2 official materials + review boot camp |
| Security+ entry | **Uuu** or **AI Network** | Both CompTIA authorized; AI Network offers small class sizes |
| AI security cert (SecAI+ / COASP / OSAI+) | **Uuu** | Classroom courses for all three AI security certs |
| OSCP offensive track | **DEVCORE** | First to bring OffSec factory instructors to Taiwan (2024); now taught in Mandarin by DEVCORE instructors |
| Budget-conscious / pure beginner | **Gjun** or self-study | iPAS + Security+ self-study is the cheapest path |
| Financial sector training hours | **Taiwan Academy of Banking and Finance** | Legally recognized, includes AI security topics |

## iPAS Information Security Engineer — Taiwan's local certification

Beyond international certifications, Taiwan has its own system:

| | Beginner | Intermediate |
|---|---|---|
| Issuer | Ministry of Economic Affairs, Industrial Development Administration |  Same |
| Cost | ~NT$1,600 (two subjects) | ~NT$2,400 (two subjects) |
| Exam language | **Traditional Chinese** | **Traditional Chinese** |
| Subjects | InfoSec Management Overview, InfoSec Technology Overview | InfoSec Planning Practice, InfoSec Protection Practice |
| Validity | **Permanent** | 5 years (48 hours of training to renew) |
| Regulatory recognition | MODA Cybersecurity Administration recognized | Same; also qualifies for NCC regulatory testing engineer |

Per the [HackMD iPAS discussion](https://hackmd.io/@hiiii/ryOzgaf0a) (in Mandarin):

- **Strengths**: Traditional Chinese exam, extremely low cost (NT$2,400 vs CISSP's US$749), local regulatory content, government procurement bonus points
- **Limitations**: Near-zero international recognition
- **Best for**: Taiwan job seekers, students, career switchers; those targeting government contracts

**iPAS vs Security+**: If you're job-hunting in Taiwan's domestic market on a tight budget → iPAS first. If you want international recognition or foreign companies → Security+ is more valuable. They don't conflict — you can take both.

## Exam venues and logistics

### Pearson VUE test centers

| Location | Address | Phone | Certifications |
|---|---|---|---|
| **Taipei** | 12F-3, No. 163, Sec. 1, Keelung Rd, Xinyi District (United Century Building) | (02) 2756-7808 | CISSP, CCSP, Security+, SecAI+, etc. (Pearson-run center) |
| **Kaohsiung** | 4F-1, No. 38, Xinguang Rd, Lingya District (Asia Pacific Financial Plaza) | (07) 536-1199 ext. 115 | Same (Pearson VUE authorized center operated by Uuu) |

These are the only two sites in Taiwan for ISC2 exams. CompTIA exams (Security+, SecAI+) can also be taken at [Uuu's other centers](https://www.uuu.com.tw/TestCenter/Info) (in Mandarin) and at Pearson VUE authorized centers such as Gjun. ISACA exams such as CISM and CRISC are delivered through PSI test centers, not Pearson VUE.

Per [AI Network's CISSP course page](https://ainetwork-training.com/courses/cissp), exams are available on demand but seats are limited — book early.

### Online proctoring (OnVUE / PSI)

| Method | Certifications | Requirements |
|---|---|---|
| **Pearson OnVUE** | Security+, SecAI+, CISSP (select sessions) | Private room, stable internet, webcam, English communication |
| **AWS PSI** | AWS Security Specialty, AWS AIF-C01 | Same |
| **Practical DevSecOps** | CAISP | Fully online, 6h practical + 24h report, no proctoring environment requirements |

**Home testing tips**:
- Desk must be clear, no one else in the room
- Network disconnection may terminate the exam (wired connection recommended)
- Some proctors will ask you to scan the entire room with your camera
- CISSP's CAT format works identically in online proctoring

### Exam languages

| Certification | Available languages | Notes |
|---|---|---|
| CISSP | English (CAT, 3 hours), Simplified Chinese / Japanese / Korean / others (linear, 250 questions, 6 hours) | Per [KnowledgeHut guide](https://www.knowledgehut.com/blog/security/cissp-exam-preparation), non-English versions use linear format (fixed 250 questions / 6 hours), not CAT |
| Security+ | English, Japanese, Portuguese | No Traditional Chinese |
| SecAI+ | English | Only English as of 2026 launch |
| AWS Security | English, Korean, Simplified Chinese, Japanese | No Traditional Chinese |
| CEH | English | — |
| CAISP | English | Report also written in English |
| iPAS | **Traditional Chinese** | The only Chinese-language option in this list |

## Salary and market demand

### Salary ranges

[CloudInsight's Security Engineer Guide](https://cloudinsight.cc/zh/blog/security-engineer-guide) (in Mandarin) cites 104 Salary data for the "security engineer" role (updated September 28, 2026; 543 valid samples):

| Experience | Monthly salary P25–P75 (NTD) | Monthly average |
|---|---|---|
| Under 1 year | 41,000–60,000 | 55,000 |
| 1–3 years | 45,000–63,000 | 56,000 |
| 3–5 years | 46,000–68,000 | 59,000 |
| 5–10 years | 51,000–74,000 | 63,000 |
| 10+ years | 51,000–87,000 | 72,000 |

- Security managers and CISOs are counted as separate roles and are not in this table
- **Financial sector** pays highest, tech second
- On certifications: the guide suggests that people with no experience take one entry-level certification first (Security+ or iPAS) to make job hunting easier; CISSP and OSCP help in salary negotiation, but without hands-on experience a certificate alone does little
- Few people in Taiwan hold CISSP: [ISC2 member counts compiled by Wentz Wu](https://wentzwu.com/wp-content/uploads/2022/02/CISSP-Member-Count_20220101.pdf) showed 465 as of January 2022, and no later per-country figure appears to be public

## Free starting paths

Not ready to spend money? Test the water at zero cost:

### General awareness
1. **OWASP Top 10 for LLM Applications 2025**: [Free to read](https://owasp.org/www-project-top-10-for-large-language-model-applications/) — essential for AI platform builders regardless of certification plans
2. **MODA Cybersecurity Administration recognized certification list**: Understand which certs are recognized under Taiwan's regulatory framework

### Security+ prep
1. [Professor Messer's full YouTube course](https://www.youtube.com/@professormesser): Free, complete, exceptional quality
2. CompTIA official sample questions
3. Reddit r/CompTIA community

### AWS Security prep
1. [AWS Skill Builder free learning path](https://skillbuilder.aws/)
2. [Digital Cloud Training free PDF cheat sheets](https://digitalcloud.training/aws-security-specialty-resources-udemy)
3. AWS official whitepapers (Security Best Practices, Well-Architected Security Pillar)

### CISSP prep
1. ISC2 official sample questions
2. [Reddit r/cissp](https://www.reddit.com/r/cissp/) daily discussion threads — extremely active, many Taiwan candidates sharing
3. Discord study groups

### AI security fundamentals
1. [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
2. [OWASP Top 10 for Agentic Applications 2026](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
3. Practical DevSecOps blog comparison articles (free)

## The bottom line

Taiwan's security certification ecosystem has three defining characteristics:

1. **Regulations push but don't prescribe**: The Cybersecurity Act 2.0, the FSC staffing tiers, and the TWSE control guidelines require dedicated security personnel or regular training, but none mandates specific certifications. Real demand comes from the job market — reading job postings on 104 is more useful than reading regulatory text.

2. **Training resources are richer than you'd expect**: Uuu's catalog breadth may be unmatched in the region (simultaneous ISC2, CompTIA, and EC-Council authorization plus new AI security courses). WUSON's CISSP program is a genuine legend in Taiwan's security community. Self-study isn't the only option.

3. **iPAS is an underrated starting point**: NT$2,400, Traditional Chinese, government procurement bonus points. If you have zero security background, starting with iPAS Intermediate to build confidence, then attacking Security+ to enter the international system, is a pragmatic path.

This is the final post in the "Security Certification Playbook" series. The complete series:

- [Part 1: The Landscape](/posts/tech/2026-09-10-security-cert-landscape-en) — 22 certifications mapped with a three-phase roadmap
- [Part 2: AI Security Cert Showdown](/posts/tech/2026-09-10-ai-security-cert-showdown-en) — SecAI+ vs CAISP vs GAIPS vs AAISM
- [Part 3: ROI Breakdown](/posts/tech/2026-09-10-security-cert-roi-en) — Security+ → AWS Security → CISSP investment returns
- **Part 4 (this post)**: Taiwan's ecosystem — regulations, training, exam venues, local resources

## Update log

- 2026-10-12: Added the Cybersecurity Management Act effective date (December 1, 2025) and when the subordinate regulations were reissued. The salary table cited figures that the source page no longer carries after a revision, so it now uses the 104 Salary data the source cites today, and the "CISSP / OSCP adds 10–20%" and "foreign companies pay 20–50% more" claims are removed. Taiwan CISSP holder count replaced with a dated statistic. CAISP updated to its current $1,099. Corrected the regulatory passage: the staffing tiers come from an FSC order, while the control guidelines are an advisory document from the TWSE and TPEx that recommends no certification. The test center table now distinguishes by certifying body, with CEH and CISM removed. DEVCORE, AI Network, and Gjun courses and prices updated to match their current sites.
- 2026-10-08: Uuu added an OffSec OSAI+ classroom course (NT$149,000), taking its AI security classroom courses from two to three. Added the COASP course price. DEVCORE's OffSec courses changed from "exclusive" to "first to bring." Added the table "Where to take AI security certification courses."

## References

- [SSDLC by 飛飛 — Taiwan Legal Compliance Guide](https://ssdlc.feifei.tw/taiwan-legal-compliance-guide-pdpa-cybersecurity-act-ssdlc) (in Mandarin)
- [ICSDA — Listed Company Cybersecurity Guidelines FAQ](https://icsda.org.tw/) (in Mandarin)
- [Cathay Securities 2025 Sustainability Report](https://www.cathaysec.com.tw/download/2025年永續報告書.pdf) (in Mandarin)
- [Hua Nan Bank 104 Job Posting (2026/09)](https://www.104.com.tw/job/7o6p3) (in Mandarin)
- [Uuu (恆逸) — CISSP](https://www.uuu.com.tw/Course/Show/47/CISSP) (in Mandarin)
- [Uuu — SecAI+](https://www.uuu.com.tw/Course/Show/3328/CompTIA-SecAI-) (in Mandarin)
- [Uuu — COASP AI Security](https://www.uuu.com.tw/Course/Show/3332/COASP) (in Mandarin)
- [Uuu — Security+](https://www.uuu.com.tw/Course/Show/1607/CompTIA-Security-) (in Mandarin)
- [Uuu — CCSP](https://www.uuu.com.tw/Course/Show/1146/CCSP) (in Mandarin)
- [Uuu Security Course Portal](https://security.uuu.com.tw) (in Mandarin)
- [AI Network (全智網)](https://ainetwork-training.com/)
- [AI Network — CISSP Course](https://ainetwork-training.com/courses/cissp)
- [WUSON (吳文智) — CISSP Courses](https://wentzwu.com/courses) (in Mandarin)
- [iSpan (資展國際) — CISSP Prep Course](https://www.ispan.com.tw/CISSP) (in Mandarin)
- [DEVCORE × OffSec Partnership (NetMag report)](https://netmag.tw/2024/07/19/devcore-bring-global-security-training-agency-offsec-introduces-factory-instructor-physical-course-to-alive-taiwan-security-talent) (in Mandarin)
- [Taiwan Academy of Banking and Finance — Security Personnel Courses](https://www.tabf.org.tw/CourseLegalIntroduce.aspx?a=nlOruBvit%2Fw%3D) (in Mandarin)
- [HackMD iPAS Security Certification Discussion](https://hackmd.io/@hiiii/ryOzgaf0a) (in Mandarin)
- [CloudInsight — Security Engineer Guide 2026](https://cloudinsight.cc/zh/blog/security-engineer-guide) (in Mandarin)
- [CloudInsight — Security Certification Guide](https://cloudinsight.cc/zh/blog/security-certifications) (in Mandarin)
- [KnowledgeHut — CISSP Exam Preparation Guide 2026](https://www.knowledgehut.com/blog/security/cissp-exam-preparation)
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Professor Messer YouTube](https://www.youtube.com/@professormesser)
- [AWS Skill Builder](https://skillbuilder.aws/)
- [Digital Cloud Training — AWS Security Specialty Free Resources](https://digitalcloud.training/aws-security-specialty-resources-udemy)
- [Uuu — OSAI+ course AI-300](https://www.uuu.com.tw/Course/Show/3408/OSAI) (in Mandarin)
- [AI Network — CompTIA SecAI+ course](https://ainetwork-training.com/courses/secai/) (in Mandarin)
- [NSIT — CompTIA SecAI+ course](https://www.nsit.com.tw/course_detail/46) (in Mandarin)
- [iSpan — CompTIA SecAI+ class](https://www.ispan.com.tw/comptia-secai-plus/) (in Mandarin)
- [SANS SEC545: GenAI and LLM Application Security](https://www.sans.org/cyber-security-courses/genai-llm-application-security)
- [Wentz Wu — CISSP by Countries (ISC2 member counts, January 1, 2022)](https://wentzwu.com/wp-content/uploads/2022/02/CISSP-Member-Count_20220101.pdf)
- [Lee and Li — Amended Cyber Security Management Act promulgated](https://www.leeandli.com/TW/NewslettersDetail/7505.htm) (in Mandarin)
- [TWSE — cybersecurity briefing for listed companies (staffing tiers)](https://www.twse.com.tw/staticFiles/news/event/8a8216d69236c2e3019240ce8ac7000c.pdf) (in Mandarin)
- [TWSE / TPEx — Cybersecurity Control Guidelines for Listed Companies (September 2024 revision)](https://dsp.tpex.org.tw/storage/co_download/%E4%B8%8A%E5%B8%82%E4%B8%8A%E6%AB%83%E5%85%AC%E5%8F%B8%E8%B3%87%E9%80%9A%E5%AE%89%E5%85%A8%E7%AE%A1%E6%8E%A7%E6%8C%87%E5%BC%95.pdf) (in Mandarin)
- [TWSE information security portal (includes the internal-control FAQ)](https://dsp.twse.com.tw/informationSecurity/list) (in Mandarin)
- [Uuu — test center information](https://www.uuu.com.tw/TestCenter/Info) (in Mandarin)
- [DEVCORE Training 2026](https://training.devco.re/2026) (in Mandarin)
- [OffSec — OSCP+ Exam Guide](https://help.offsec.com/hc/en-us/articles/360040165632-OSCP-Exam-Guide)
- [NCNU Computer Center — Cyber Security Management Act in force from December 1, 2025](https://cc.ncnu.edu.tw/p/406-1001-31660,r471.php?Lang=zh-tw) (in Mandarin)
