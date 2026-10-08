---
title: "AI Security Cert Showdown — SecAI+ vs CAISP vs GAIPS vs AAISM"
date: 2026-09-10
category: tech
type: deep-dive
tags: [cybersecurity, certification, ai-security, owasp, llm, prompt-injection]
lang: en
tldr: "Four AI security certs, four different bets: SecAI+ ($359) is CompTIA's mid-level expansion play, CAISP ($999 all-in) has the strongest hands-on labs and fullest OWASP LLM Top 10 coverage, GAIPS ($999/$9K) is the SANS gold-standard defender cert with CyberLive exams, and AAISM ($459+) is governance-layer but requires CISM or CISSP first. Under $400 → SecAI+. Want to actually hack and fix → CAISP. Company paying → GAIPS. For the offensive side (AI red teaming), OSAI+, HTB COAE, and COASP launched in 2026 and form their own group; see the section near the end."
description: "A head-to-head comparison of four emerging AI security certifications — exam domains, formats, OWASP LLM Top 10 coverage, and real exam-taker reviews — to help AI platform developers pick the right one."
draft: false
series:
  name: "資安證照攻略"
  order: 2
---

> 🌏 [中文版](/posts/tech/2026-09-10-ai-security-cert-showdown)

ISACA launched AAISM in August 2025. CompTIA shipped SecAI+ in February 2026. GIAC opened GASAE in April, then GAIPS in July. In 18 months, four major certification bodies each placed their bet on AI security. Per [Practical DevSecOps market analysis](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison), the share of cybersecurity job postings requiring AI skills doubled from 14.2% to 28.5% between October 2025 and March 2026. Demand is real — but which cert actually teaches you something?

This post uses the OWASP LLM Top 10 v2.0 as the measuring stick, then takes apart each certification's exam domains, format, and real-world reviews to help you pick.

All four lean defensive or governance-focused. A separate batch of offensive (AI red teaming) certifications arrived in the first half of 2026: EC-Council COASP, OffSec OSAI+, HTB COAE, and GIAC GOAA. They are covered in [their own section below](#new-in-2026-four-offensive-side-certifications).

## The benchmark: OWASP LLM Top 10 v2.0 (2025)

Before comparing, align on the yardstick. The [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/) is the most widely adopted LLM security risk framework:

| # | Risk | One-liner |
|---|---|---|
| LLM01 | **Prompt Injection** | Crafted inputs override system instructions — #1 for two editions running |
| LLM02 | Sensitive Information Disclosure | Model leaks PII, trade secrets, or API keys from training data |
| LLM03 | Supply Chain | Hidden risks from third-party models, datasets, and plugins |
| LLM04 | Data and Model Poisoning | Training data, fine-tuning, or RAG corpus gets contaminated |
| LLM05 | Improper Output Handling | Feeding model output directly to DBs/APIs/browsers without validation |
| LLM06 | **Excessive Agency** | Agents with more permissions than necessary — **the top concern for AI Agent platform builders** |
| LLM07 | System Prompt Leakage | Attackers trick the model into revealing its system prompt |
| LLM08 | **Vector and Embedding Weaknesses** | Vulnerabilities in RAG pipelines and vector databases |
| LLM09 | Misinformation | Model produces convincing but false content |
| LLM10 | Unbounded Consumption | Uncapped token usage causing cost explosions or DoS |

Also note that the [OWASP Top 10 for Agentic Applications (2026)](https://owasp.org/www-project-top-10-for-large-language-model-applications/) is a **separate framework** targeting systems with memory, tools, and multi-step autonomy — complementary to the LLM Top 10.

## CompTIA SecAI+

### Positioning

CompTIA's first AI-security-only certification, launched February 17, 2026. Part of their "Expansion Series" — designed to stack on top of Security+, CySA+, or PenTest+, not replace them.

### Exam format

| Detail | Info |
|---|---|
| Exam code | CY0-001 |
| Questions / time | Up to 60 (multiple-choice + PBQs) / 60 minutes |
| Passing score | 600/900 |
| Cost | **$359** (exam voucher only; study materials sold separately) |
| Validity | 3 years, CEU renewal |
| Recommended experience | 3–4 years IT + 2 years cybersecurity |

**Sources**: [ACI Learning SecAI+ Guide](https://www.acilearning.com/blog/comp-tia-sec-ai-a-complete-guide-to-the-ai-security-certification), [Udemy Blog SecAI+ Guide](https://blog.udemy.com/comptia-secai-certification-guide)

### Four exam domains

| Domain | Weight | Coverage |
|---|---|---|
| Basic AI Concepts | 17% | ML, NLP, deep learning, AI-driven threats (polymorphic malware, etc.) |
| **Securing AI Systems** | **40%** | Protecting models, data pipelines, deployment environments (on-prem/cloud/hybrid) |
| AI-Assisted Security | 24% | Using AI to speed threat detection, automate alert triage, improve incident response |
| AI Governance, Risk & Compliance | 19% | GDPR, NIST AI RMF, global regulatory frameworks |

The 40% weight on "Securing AI Systems" is a good sign — it's not all theory. But a 60-minute, 60-question format limits depth. PBQs reach "configure a security control" level, not "attack and defend a real pipeline."

### OWASP coverage

Concept-level coverage of Prompt Injection, Data Poisoning, Supply Chain, and Improper Output Handling. Excessive Agency and Vector & Embedding Weaknesses are shallow — the exam asks "what is this risk," not "how do you implement defenses in a RAG pipeline."

### Best for

Someone with Security+ or equivalent who wants to quickly add "AI security" to their resume on a budget ($359 voucher + $30–$100 materials). CompTIA's brand recognition with HR departments is a real advantage.

## Practical DevSecOps CAISP

### Positioning

A hands-on AI security certification from Practical DevSecOps, available since late 2024. Not a multiple-choice exam — you get 6 hours to hack and fix an LLM pipeline, then 24 hours to write the report.

### Exam format

| Detail | Info |
|---|---|
| Cost | **$999–$1,099 all-in** (course videos, PDF, 60-day lab, 24/7 Mattermost support, 1 exam attempt) |
| Exam format | 6h practical (5 challenges, 100 points, 80 to pass) + 24h report |
| Validity | Lifetime |
| Prerequisites | None |

**Pricing structure matters**: SecAI+'s $359 buys only the exam voucher — materials and training are extra. CAISP's $999–$1,099 includes everything. Per [Practical DevSecOps' comparison](https://www.practical-devsecops.com/caisp-vs-comptia-secai-plus), SecAI+ with an Infosec Institute boot camp totals over $2,500.

### Course content and labs

From four independent exam-taker reviews:

- [tunelko.com](https://blogs.tunelko.com/2026/07/16/certified-ai-security-professional-caisp-practical-devsecops/) (**9/10**): "Labs are where CAISP genuinely shines. Models, NVIDIA drivers, CUDA all working out of the box. Zero environment-debugging time." Also noted occasional drift back into traditional SAST/DAST territory — skippable for experienced DevSecOps practitioners.
- [LinkedIn Mel Drews](https://www.linkedin.com/posts/meldrews_certified-ai-security-professional-credential-activity-7491467633704435712-Hyft) (SANS instructor, 22 years experience): "SANS is the gold standard. If you're looking for something that will get you a long way down a path for about 1/8 the cost, check out Practical DevSecOps." Spent 59 days in labs + 1 week organizing notes.
- [Medium Divith Shetty](https://divshettyy.medium.com/my-review-of-the-caisp-certified-ai-security-professional-certification-by-practical-devsecops-fb658fabf5da): "If you're already experienced in advanced offensive LLM security, you may find the material a bit basic. For beginners and early-career professionals, it's a good starting point."
- [LinkedIn Richie Prieto](https://www.linkedin.com/posts/richieprieto_aisecurity-cybersecurity-practicaldevsecops-activity-7457536949931696128-YW9n) (AI security consultant): "OWASP LLM Top 10 coverage is solid, but I found gaps in Agentic AI and newer protocols like MCP or A2A. At nearly $1,100, it's already starting to show its age in 2026."

**Consensus**: Lab quality is top-tier (10/10), depth is intro-to-intermediate, may be shallow for senior red teamers, but a great fit for DevSecOps/AppSec/developers entering AI security.

### OWASP coverage

The curriculum explicitly references OWASP LLM Top 10. Prompt Injection has step-by-step attack/defense labs, Data Poisoning uses TextAttack, RAG pipeline security gets dedicated labs, and Supply Chain has practical exercises. Most complete coverage of the four certs.

### Best for

People who want to actually do the work — not just know what prompt injection is, but break an LLM in a lab and fix it. Budget around $1,000 is acceptable, and you don't mind lower brand recognition than CompTIA/SANS.

## GIAC GAIPS

### Positioning

SANS/GIAC's defensive AI security certification, open for general purchase from July 28, 2026. Mapped to SANS SEC545 "GenAI and LLM Application Security" (5-day course). Per [CertCrush analysis](https://www.certcrush.app/blog/giac-gaips-ai-platform-security-explained-worth-it-2026), GIAC plans to deliver four AI security certifications by end of 2026 (GAIPS defensive, GASAE automation, GOAA offensive, fourth TBA). GOAA is already available; details are in the offensive section below.

### Exam format

| Detail | Info |
|---|---|
| Cost | **~$999 exam only** / **~$9,000 with SEC545 course** |
| Exam format | CyberLive (hands-on in real VM environments with real tools, not pure multiple-choice) |
| Validity | 4 years (36 CPE + ~$479 renewal fee) |
| Prerequisites | None required; AppSec/Cloud/MLOps experience recommended |

**Sources**: [GIAC official](https://www.giac.org/certifications/ai-security-platform-security-gaips), [CertMap GAIPS](https://certmap.de/en/cert/gaips)

### Exam domains

Per [CertCrush](https://www.certcrush.app/blog/giac-gaips-ai-platform-security-explained-worth-it-2026) and [CertMap](https://certmap.de/en/cert/gaips), GAIPS covers eight domains: AI application architecture, infrastructure and deployment security, MLOps pipelines, RAG (retrieval-augmented generation), **agentic systems**, model integrity, data protection, and AI governance.

The key differentiator: GAIPS explicitly covers **agentic systems security** — a domain none of the other three certifications pull out separately. For AI Agent platform builders, that's a direct hit.

### OWASP coverage

Highly aligned. Prompt Injection, Supply Chain, Data Poisoning, Excessive Agency (via the agentic systems domain), and Vector & Embedding Weaknesses (via the RAG domain) are all covered. CyberLive format means verification happens in real environments, not by memorizing definitions.

### Best for

Those with budget (company-funded ideally) who want the SANS/GIAC gold standard and need to show "top-tier certification" to clients or in interviews. The standalone $999 exam is comparable to CAISP, but without the 60-day lab preparation — you're on your own for study materials.

## ISACA AAISM

### Positioning

ISACA's AI security **management** certification, launched August 2025. Note the word "management" — this is not a hands-on defense cert. It's for building governance frameworks, setting policy, and assessing risk.

### Hard prerequisite

**You must hold an active CISM or CISSP to sit the exam.** This is not an entry-level certification — it builds on a senior manager's foundation.

### Exam format

| Detail | Info |
|---|---|
| Cost | **$459 (ISACA member) / $599 (non-member)**, plus $50 application fee |
| Exam format | 90 scenario-based multiple-choice questions / 150 minutes |
| Passing score | 450/800 |
| Validity | 3 years (20 CPE/year) |

**Sources**: [CertCrush AAISM](https://www.certcrush.app/blog/isaca-aaism-explained-domains-cost-worth-it-2026), [ISACA Chicago Chapter course](https://engage.isaca.org/chicagochapter/events/eventdescription?CalendarEventKey=f2013755-f3bf-493c-b4c0-019b7fb46820)

### Three exam domains

| Domain | Weight | Coverage |
|---|---|---|
| AI Governance and Program Management | 31% | AI policy, stakeholder communication, data governance, incident response |
| AI Risk Management | 31% | AI-specific threat assessment, vulnerability management, supply chain risk |
| **AI Technologies and Controls** | **38%** | AI architecture, security controls, adversarial testing, production monitoring |

Per [aaismexam.com analysis](https://aaismexam.com/blog/aaism-exam-format-question-types-and-time-limits), Domain 3 carries the highest weight (~34 of 90 questions) and is where candidates with pure governance backgrounds are most likely to struggle — you need to genuinely understand how AI systems are built and where they break.

### OWASP coverage

Concept-level. Supply Chain and Excessive Agency get governance-framework coverage ("you should enforce least privilege"), but you won't learn how to implement that in code. Prompt Injection and Data Poisoning stay at the "know this risk exists" level.

### Best for

Existing CISM/CISSP holders whose scope is expanding from traditional security management into AI governance — CISOs and security directors who need to explain "our AI security program" to the board. If you're a developer, this isn't for you.

## Head-to-head comparison

| | SecAI+ | CAISP | GAIPS | AAISM |
|---|---|---|---|---|
| **Cost** | $359 (voucher only) | $999–$1,099 (all-in) | ~$999 exam / ~$9K with course | $459–$599 |
| **Exam format** | 60 questions / 60 min | 6h hands-on + 24h report | CyberLive hands-on | 90 questions / 150 min |
| **Hands-on depth** | PBQs (limited) | **Highest** (real labs) | **High** (VM environment) | None (multiple-choice) |
| **Brand recognition** | CompTIA (strong with HR) | Practical DevSecOps (niche) | SANS/GIAC (industry gold) | ISACA (strong in governance) |
| **Prerequisites** | 2 years cybersec recommended | None | None (AppSec experience recommended) | **Requires CISM or CISSP** |
| **Validity** | 3 years | Lifetime | 4 years | 3 years |
| **Agentic systems** | Concept-level | Partial | **Explicitly covered** | Concept-level |
| **OWASP coverage** | Concept + PBQ | **Most complete** (lab-level) | High (CyberLive-level) | Concept-level |

### OWASP LLM Top 10 item-by-item coverage

| OWASP risk | SecAI+ | CAISP | GAIPS | AAISM |
|---|---|---|---|---|
| LLM01 Prompt Injection | Concept + PBQ | **Deep lab** | **CyberLive** | Concept |
| LLM02 Sensitive Info Disclosure | ✅ | ✅ | ✅ | Concept |
| LLM03 Supply Chain | ✅ | **Hands-on** | **Hands-on** | ✅ Governance |
| LLM04 Data & Model Poisoning | ✅ Concept | **TextAttack lab** | ✅ | Concept |
| LLM05 Improper Output Handling | ✅ | ✅ | ✅ | — |
| LLM06 Excessive Agency | Concept | ✅ | **✅ Agentic** | ✅ Governance |
| LLM07 System Prompt Leakage | ✅ | ✅ | Partial | — |
| LLM08 Vector & Embedding | Partial | **RAG lab** | **RAG lab** | — |
| LLM09 Misinformation | Concept | Partial | Partial | Concept |
| LLM10 Unbounded Consumption | Partial | Partial | Partial | — |

## Buying guide

### By budget

| Budget | Pick | Why |
|---|---|---|
| < $400 | **SecAI+** | $359 voucher, CompTIA brand recognition |
| ~$1,000 | **CAISP** | All-inclusive with labs, strongest hands-on |
| Company-funded | **GAIPS** (with SEC545) | SANS gold standard + CyberLive |
| Already hold CISSP/CISM | Add **AAISM** | AI security governance specialization |

### By experience

| Your background | Recommendation | Why |
|---|---|---|
| Developer, new to AI security | CAISP or SecAI+ | CAISP labs teach you to do; SecAI+ is faster to pass |
| Experienced DevSecOps / AppSec | CAISP | Extends into AI, lab format matches your workflow |
| Security manager / CISO | AAISM | You need governance frameworks, not code |
| AI Agent platform builder | **GAIPS** or CAISP | GAIPS explicitly covers agentic systems; CAISP's RAG labs are directly relevant |
| Pentester / red teamer | OSAI+, HTB COAE, or COASP | Offensive certifications, covered in their own section below |

### By goal

| You want... | Choose |
|---|---|
| Fast resume boost | SecAI+ (60-minute exam, $359) |
| Actual defensive skills | CAISP (6h practical, lab memory) |
| Top-tier brand credential | GAIPS (SANS/GIAC) |
| AI governance framework | AAISM (ISACA) |
| AI red teaming | OSAI+, HTB COAE, COASP (offensive side) |

## New in 2026: four offensive-side certifications

The four main certifications above are about how to defend and how to govern. Between February and April 2026, EC-Council, OffSec, and Hack The Box each shipped an AI red teaming certification. Add GIAC's GOAA and the offensive side gained four options at once.

| | EC-Council COASP | OffSec OSAI+ | HTB COAE | GIAC GOAA |
|---|---|---|---|---|
| **Full name** | Certified Offensive AI Security Professional | OffSec AI Red Teamer (course AI-300) | Certified Offensive AI Expert | Offensive AI Analyst (course SEC535) |
| **Launched** | Feb 2026 (with the Enterprise AI Credential Suite) | March 31, 2026 | April 2026 | Available |
| **Exam format** | 70 questions (multiple choice + performance-based) / 6 hours, live-proctored | 24-hour proctored practical against an AI-enabled enterprise environment | 7-day practical assessment + commercial-grade report | 56 questions / 2 hours, CyberLive |
| **Passing score** | 70–80% | Not listed on the official page | Not listed on the official page | 67% |
| **Cost** | Official on-demand course from $1,699 | $1,749 (90-day course + 1 attempt) or $2,749/year (2 attempts) | Requires completing the AI Red Teamer path; HTB suggests the Silver Annual subscription (includes a voucher good for 2 attempts) | See GIAC |
| **Validity** | See EC-Council | OSAI never expires; OSAI+ lasts 3 years | See HTB | See GIAC |
| **Target** | The AI system itself | The AI system itself | The AI system itself | **Traditional targets, attacked with AI** |

### EC-Council COASP

One of four AI certifications EC-Council announced on February 10, 2026 (the other three are AIE for AI literacy, CAIPM for program management, and CRAGE for governance and ethics). Exam code 312-52. The course has ten modules: offensive methodology, AI reconnaissance and attack surface mapping, vulnerability scanning and fuzzing, prompt injection and LLM application attacks, adversarial machine learning and model privacy attacks, data and training pipeline attacks, agentic AI and model-to-model attacks, AI infrastructure and supply chain attacks, testing, evaluation and hardening, and AI incident response and forensics. EC-Council states the curriculum aligns with the OWASP LLM Top 10, NIST AI RMF, and ISO 42001.

The practical point for readers in Taiwan: [Uuu (恆逸) runs a classroom course](https://www.uuu.com.tw/Course/Show/3332/COASP), 40 hours for NT$68,000, bundled with 180 days of official labs and one exam attempt (Uuu lists the exam's standalone price as USD 650). Of the four offensive certifications, COASP and OSAI+ have classroom courses in Taiwan, and COASP costs less than half as much.

### OffSec OSAI+

The AI red teaming certification from the makers of OSCP. The AI-300 course has about 65 hours of content across 11 modules, covering attacks on LLMs, RAG pipelines, embeddings, multi-agent systems, and AI infrastructure. The exam follows OffSec's usual style: 24 hours, proctored, no multiple choice. Passing earns both OSAI, which never expires, and OSAI+, which lasts 3 years. OffSec positions it as an advanced course that expects solid security fundamentals and basic familiarity with LLMs. Uuu also runs an [OSAI+ classroom course](https://www.uuu.com.tw/Course/Show/3408/OSAI): 40 hours for NT$149,000.

### HTB COAE

Hack The Box built its AI Red Teamer path with Google and aligned it to Google's SAIF framework; COAE is the certification at the end of that path. You must finish all 12 modules before sitting the exam, with no shortcut. The content leans further into machine learning than the other three: beyond prompt injection and LLM output attacks, it covers evasion attacks, gradient-based adversarial examples, privacy attacks and differential privacy, and the security of MCP. The exam runs 7 days, and compromising the targets is not enough to pass: you also submit a client-ready report.

### GIAC GOAA

The name says "Offensive AI," but it points the opposite way from the other three: it teaches **using AI as an attack tool**, such as deepfake audio and video phishing, AI-aided vulnerability discovery and exploit generation, writing malware with AI, and bypassing defensive controls. It is for people doing traditional red teaming and social engineering who want AI in their toolkit. If your goal is to test your own LLM application, this is the wrong certification.

### Choosing on the offensive side

| Your situation | Choose |
|---|---|
| Want classroom training in Taiwan, employer paying | COASP (NT$68,000) or OSAI+ (NT$149,000), both at Uuu |
| Already have OSCP-level pentesting skills | OSAI+ |
| Want to learn the math behind adversarial ML along the way | HTB COAE |
| Red teaming and social engineering, want AI to speed it up | GOAA |

For developers building AI Agent platforms, an offensive certification is not the first one to take. Build defensive skills with CAISP or GAIPS first, then pick one of these when you want to understand how attackers think.

## Other new arrivals and one still in development

- **Microsoft SC-500**: Cloud and AI Security Engineer Associate. It replaces AZ-500, which retired on August 31, 2026. The exam costs $165 and runs 120 minutes. This is a cloud security certification that added AI workloads, not a pure AI security certification: the AI-related objectives are Azure configuration tasks such as AI protection in Defender for Cloud, agent guardrails in Foundry, and Purview DSPM.
- **ISACA AAIR (Advanced in AI Risk)**: Launched April 15, 2026. $459 for members, $599 for non-members, and it requires one of 25 prerequisite certifications such as CRISC, CISA, CISM, or CISSP. With AAIA (audit) and AAISM (security management) from 2025, ISACA's three AI credentials are now complete, one each for risk, audit, and security management roles.
- **CSA TAISE (Trusted AI Safety Expert)**: From the Cloud Security Alliance with Northeastern University. $795 covers training and 2 exam attempts; 60 multiple-choice questions, 80% to pass, no prerequisites. A foundation in AI safety and governance.
- **GIAC GASAE**: Available since April 2026. 82 questions / 3 hours, 70% to pass, focused on AI automation for red, blue, and purple teams. Complementary to GAIPS.
- **ISC2's AI security certification**: It has no official name yet. ISC2 announced the start of development and a call for volunteers on July 15, 2026, held its first Job Task Analysis workshops in three cities in August, anticipates a pilot exam in late 2026, and does not expect the certification to be operational until 2027. For now, ISC2's approach is to fold AI security concepts into the exam outlines of its nine existing certifications.

## The bottom line

The AI security certification market is extremely young — 18 months ago, none of these existed. Per [StationX analysis](https://app.stationx.net/articles/best-ai-security-certifications), "by 2027, the landscape will look different again." The strategy right now isn't finding the "forever-right answer" — it's finding the tool that builds your capability today.

If you can only pick one: for AI Agent platform developers, CAISP's lab training is the most directly useful for your daily work. But remember — a certification proves you studied, not that you can apply it. Real security capability comes from practicing on real systems.

## Update log

- 2026-10-08: Added the section "New in 2026: four offensive-side certifications" (COASP, OSAI+, HTB COAE, GOAA) and entries for SC-500, AAIR, and TAISE. Corrected ISC2's status (the original said "CCAI in pilot," which was wrong; development was only announced in July 2026). OSAI changed from "coming soon" to available.

## References

- [CompTIA SecAI+ Certification (CY0-001)](https://www.comptia.org/certifications/secai)
- [ACI Learning — SecAI+ Complete Guide](https://www.acilearning.com/blog/comp-tia-sec-ai-a-complete-guide-to-the-ai-security-certification)
- [Udemy Blog — SecAI+ Certification Guide](https://blog.udemy.com/comptia-secai-certification-guide)
- [CIAT — Security+ vs SecAI+](https://www.ciat.edu/blog/blog-security-plus-vs-secai-plus)
- [Practical DevSecOps — CAISP](https://www.practical-devsecops.com/certified-ai-security-professional/)
- [Practical DevSecOps — CAISP vs SecAI+](https://www.practical-devsecops.com/caisp-vs-comptia-secai-plus)
- [Practical DevSecOps — CAISP vs AAISM](https://www.practical-devsecops.com/caisp-vs-aaism-compared)
- [tunelko.com — CAISP Review (9/10)](https://blogs.tunelko.com/2026/07/16/certified-ai-security-professional-caisp-practical-devsecops/)
- [LinkedIn Richie Prieto — CAISP Review](https://www.linkedin.com/posts/richieprieto_aisecurity-cybersecurity-practicaldevsecops-activity-7457536949931696128-YW9n)
- [Medium Divith Shetty — CAISP Review](https://divshettyy.medium.com/my-review-of-the-caisp-certified-ai-security-professional-certification-by-practical-devsecops-fb658fabf5da)
- [LinkedIn Mel Drews — CAISP Review](https://www.linkedin.com/posts/meldrews_certified-ai-security-professional-credential-activity-7491467633704435712-Hyft)
- [GIAC GAIPS Official](https://www.giac.org/certifications/ai-security-platform-security-gaips)
- [CertCrush — GAIPS Explained](https://www.certcrush.app/blog/giac-gaips-ai-platform-security-explained-worth-it-2026)
- [CertMap — GAIPS](https://certmap.de/en/cert/gaips)
- [ISACA AAISM Certification](https://www.isaca.org/credentialing/aaism)
- [CertCrush — AAISM Explained](https://www.certcrush.app/blog/isaca-aaism-explained-domains-cost-worth-it-2026)
- [aaismexam.com — AAISM Exam Format](https://aaismexam.com/blog/aaism-exam-format-question-types-and-time-limits)
- [OWASP Top 10 for LLM Applications 2025](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [Practical DevSecOps — AI Security Certification Market Analysis](https://www.practical-devsecops.com/choosing-the-right-ai-security-certification-a-head-to-head-comparison)
- [StationX — Best AI Security Certifications 2026](https://app.stationx.net/articles/best-ai-security-certifications)
- [EC-Council — Certified Offensive AI Security Professional (COASP)](https://iclass.eccouncil.org/our-courses/certified-offensive-ai-security-professional)
- [EC-Council — Enterprise AI Credential Suite press release (Feb 2026)](https://www.cybersecuritydive.com/press-release/20260211-ec-council-expands-ai-certification-portfolio-to-strengthen-us-ai-workfor-1/)
- [Uuu (恆逸教育訓練中心) — COASP course](https://www.uuu.com.tw/Course/Show/3332/COASP) (in Mandarin)
- [Uuu (恆逸教育訓練中心) — OSAI+ course AI-300](https://www.uuu.com.tw/Course/Show/3408/OSAI) (in Mandarin)
- [OffSec — AI-300: Advanced AI Red Teaming (OSAI+)](https://www.offsec.com/courses/ai-300/)
- [OffSec — OSAI+ AI-300 FAQ](https://help.offsec.com/hc/en-us/articles/46593095198740-OSAI-Advanced-AI-Red-Teaming-AI-300-FAQ)
- [Hack The Box — HTB Certified Offensive AI Expert (COAE)](https://academy.hackthebox.com/preview/certifications/htb-certified-offensive-ai-expert)
- [Hack The Box — HTB COAE launch announcement](https://academy.hackthebox.com/news/the-new-htb-certified-offensive-ai-expert-htb-coae-is-officially-here)
- [GIAC GOAA](https://www.giac.org/certifications/offensive-ai-analyst-goaa)
- [GIAC GASAE](https://www.giac.org/certifications/ai-security-automation-engineer-gasae)
- [Microsoft Certified: Cloud and AI Security Engineer Associate (SC-500)](https://learn.microsoft.com/en-us/credentials/certifications/cloud-and-ai-security-engineer-associate/)
- [ISACA AAIR](https://www.isaca.org/credentialing/aair)
- [ISACA — AAIR launch press release (April 15, 2026)](https://www.isaca.org/about-us/newsroom/press-releases/2026/isaca-launches-advanced-in-ai-risk-aair-certification-to-equip-it-risk-professionals)
- [CSA TAISE](https://cloudsecurityalliance.org/education/taise)
- [ISC2 — AI Security Certification development progress](https://www.isc2.org/new-ai-certification)
- [ISC2 — Development announcement (July 15, 2026)](https://www.isc2.org/insights/2026/07/ai-security-certification-development)
- [ISC2 — Updated AI exam guidance (September 2026)](https://www.isc2.org/Insights/2026/09/updated-ISC2-ai-guidance-published)
