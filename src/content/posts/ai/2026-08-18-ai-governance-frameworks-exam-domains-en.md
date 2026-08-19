---
title: "AI Governance Frameworks vs. Exam Objectives: EU AI Act, NIST AI RMF, ISO/IEC 42001 — and Why No Certification Names Them"
date: 2026-08-18
type: deep-dive
category: ai
tags: [certification, ai-governance, compliance, career]
lang: en
series:
  name: "AI Certification Prep"
  order: 18
tldr: "Governance carries more weight on these exams than most engineers expect — CCAR-P is 14% governance plus 14% stakeholder work (28% non-technical), CCAO-F is 15%, AB-100's deploy-and-govern block is 40–45%, AIF-C01 is 14% responsible AI plus 14% security/compliance/governance. But across all fifteen official exam guides in this series, not one names the EU AI Act, the NIST AI RMF, or ISO/IEC 42001; the only regulations any of them names are CCAR-P's GDPR, HIPAA, and FedRAMP. So the use of this post isn't memorizing frameworks for an exam — it's using the three frameworks as a skeleton to file six certifications' scattered governance objectives. The three split cleanly: the EU AI Act is law (fully applicable 2026-08-02, high-risk duties pushed to 2027-12-02 by the AI Omnibus), the NIST AI RMF is voluntary (GOVERN/MAP/MEASURE/MANAGE, and 1.0 is currently being revised), and ISO/IEC 42001 is a certifiable management system standard whose clauses sit behind a paywall — so this post uses only what ISO's own public page states."
description: "A cross-certification breakdown of AI governance objectives: first the governance weights and objectives from six official exam guides, then the EU AI Act, NIST AI RMF 1.0, and ISO/IEC 42001 compared on scope, binding force, and timeline from the European Commission's, NIST's, and ISO's own pages, then each exam's governance objectives mapped to the framework it most resembles."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-18-ai-governance-frameworks-exam-domains)
>
> This is preparation material built from official sources, not an exam-day account — I have not sat these exams. Every "what it tests" points back to a vendor's official exam or study guide; every framework fact points back to the European Commission, NIST, or ISO. All sources are listed at the end. Verified 2026-08-18.

This is a technical deep-dive in the [AI Certification Prep series](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en), written the same way as [B1 on multi-agent architecture](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en): take one topic several certifications test in parallel, cover it once, then mark what doesn't transfer.

One difference from B1 has to come first, though:

**Across all fifteen A-track exam guides in this series, not one official guide names the EU AI Act, the NIST AI RMF, or ISO/IEC 42001.** The only regulations named verbatim anywhere in the series are in [CCAR-P](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide-en)'s governance domain: **GDPR, HIPAA, FedRAMP** — none of which is AI-specific legislation.

So this post is not "memorize three frameworks to pass an exam." **It is the inverse: use the three frameworks as a skeleton for filing six certifications' governance objectives**, which are scattered, differently worded, and vendor-specific. That is worth doing, because the duties those objectives describe almost all have a prototype in one of the three frameworks — renamed, and cited nowhere.

## Which certifications test governance, and how much

| Certification | Governance-related domain | Weight | The angle |
|---|---|---|---|
| [Claude CCAR-P](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide-en) | Governance, Safety & Risk Management | **14%** | The only one that names specific regulations |
| (same) | Stakeholder Communication & Lifecycle Management | **14%** | **28% combined, none of it technical** |
| [Claude CCAO-F](/posts/ai/2026-08-18-claude-certified-associate-prep-guide-en) | Governance, Risk, and Responsible Use | **15%** | User's view: when not to use it at all |
| [Microsoft AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en) | Deploy (incl. responsible AI, security, governance, risk, compliance) | **40–45%** | Objectives closest to statutory high-risk duties |
| [Microsoft AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en) (beta) | Secure, govern, and deploy | 20–25% | Says "govern"; is almost entirely operational control |
| [NVIDIA NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en) | Safety, Ethics, and Compliance | 5% | Objectives read like NIST's trustworthiness list |
| (same) | Human-AI Interaction and Oversight | 5% | Transparency mechanisms and human intervention |
| [AWS AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) | Guidelines for Responsible AI | 14% | Six dimensions — the fullest such list in the series |
| (same) | Security, Compliance, and Governance | 14% | **28% combined** |
| [AWS AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en) | AI Safety, Security, and Governance | 20% | Lineage, model cards, decision logs |

**One intuition to correct first**: most engineers assume governance is filler on entry-level certifications and thins out as exams get more senior. **It runs the other way.** CCAR-P is Anthropic's most expensive and most senior certification, and 28% of it isn't technical. AB-100 is the architect tier of Microsoft's agent line, and its heaviest block (40–45%) contains a whole objective strand on governance, risk, and compliance. **The more architect-shaped the role, the larger governance's share.**

**A second correction**: AI-500's block is called `Secure, govern, and deploy`, but spread out its study-guide objectives — RBAC, Azure Key Vault, OAuth 2.0, on-behalf-of, guardrails at four intervention points, the AI Red Teaming Agent, DTAP / blue-green / canary — and **not one of them is about law**. Its "govern" means operational control, not legal compliance. Keep the two senses of the word apart, or you will study the wrong material.

**Maps back to**: CCAR-P Governance (14%) + Stakeholder (14%), CCAO-F Governance (15%), AB-100 Deploy (40–45%), AI-500 Secure/govern/deploy (20–25%), NCP-AAI Safety/Ethics/Compliance (5%) + Human-AI Interaction (5%), AIF-C01 chapters 4 and 5 (14% each), AIP-C01 chapter 3 (20%).

## Three frameworks — first, what kind of thing each one is

These three get listed side by side constantly, but **they are not the same kind of artifact**, and reading them as if they were wastes time.

| | EU AI Act | NIST AI RMF 1.0 | ISO/IEC 42001:2023 |
|---|---|---|---|
| What it is | Legislation (Regulation (EU) 2024/1689) | A voluntary risk-management framework | A management system standard (MSS), third-party certifiable |
| Published by | The EU (Parliament and Council) | NIST (ITL AI Program), USA | ISO/IEC JTC 1/SC 42 |
| Binding? | **Legally binding** | **Voluntary** | Voluntary, but you can certify against it |
| Governs what | Specific *uses* of AI systems, by risk tier | How an organization manages AI risk, in any sector, any use case | An organization's **AI Management System (AIMS)** |
| Governs whom | Providers and deployers placing AI on, or using it in, the EU market | Any organization designing, developing, deploying, evaluating, or acquiring AI systems | Any organization providing or using AI-based products or services, public sector and non-profits included |
| Skeleton | Four risk tiers + a general-purpose AI (GPAI) chapter | **GOVERN / MAP / MEASURE / MANAGE** | **Plan-Do-Check-Act**, 51 pages |
| Key dates | In force 2024-08-01; **applicable 2026-08-02** | Released 2023-01-26; **currently being revised** | Published 2023-12-18, edition 1 |
| Cost | Free and public | Free and public | **CHF 225 (paywalled)** |

In one line: **the EU AI Act governs whether your product may be placed on the EU market; the NIST AI RMF governs how you think risk through internally; ISO/IEC 42001 governs whether you have a system an auditor can inspect.** They are not alternatives — in practice they stack.

### The EU AI Act: the only one with penalties

The Commission's official page divides risk into four tiers:

| Tier | Content | Effective |
|---|---|---|
| **Unacceptable risk** | **Nine prohibited practices**: harmful manipulation and deception, exploitation of vulnerabilities, social scoring, individual criminal-offence risk prediction, untargeted scraping of internet or CCTV material to build facial-recognition databases, emotion recognition in workplaces and education, biometric categorisation to deduce protected characteristics, real-time remote biometric identification for law enforcement in public spaces, plus a ninth on non-consensual sexually explicit content and CSAM generation | Prohibitions 1–8 from **February 2025**; prohibition 9 from **December 2026** |
| **High risk** | Critical infrastructure, education, product safety components, employment and worker management, access to essential private and public services (e.g. credit scoring), remote biometric identification, law enforcement, migration and border control, administration of justice and democratic processes | **Annex III use cases from 2027-12-02**; **Annex I product-embedded from 2028-08-02** |
| **Transparency risk** | People must be told when they are interacting with a machine; generative AI output must be identifiable; deep fakes and text published to inform the public on matters of public interest must be clearly labelled | **August 2026** |
| **Minimal or no risk** | No rules imposed; the Commission states the vast majority of AI systems currently used in the EU fall here | — |

For high-risk systems, the Commission's page lists seven pre-market obligations: **adequate risk assessment and mitigation, high-quality datasets to minimise discriminatory outcomes, logging of activity for traceability, detailed documentation for authorities, clear information to the deployer, appropriate human oversight measures, and a high level of robustness, cybersecurity, and accuracy.**

I separately confirmed the corresponding article numbers by reading the regulation text on EUR-Lex (**this is the original 2024 text — see the uncertainty note below**):

| Article | Heading | What it means in engineering terms |
|---|---|---|
| Article 5 | Prohibited AI practices | The nine bans |
| Article 6 | Classification rules for high-risk AI systems | Whether your system is high-risk at all |
| Article 9 | Risk management system | Risk management must be "established, implemented, documented and maintained" — an ongoing system |
| Article 10 | Data and data governance | Training-data governance requirements |
| Article 12 | Record-keeping | The system must technically allow automatic recording of events (logs) over its lifetime |
| Article 14 | Human oversight | Must be designed so natural persons can effectively oversee it, including human-machine interface tools |
| Article 15 | Accuracy, robustness and cybersecurity | Exactly what it says |
| Article 26 | Obligations of deployers of high-risk AI systems | **Deployers carry duties too, not just builders** |
| Article 50 | Transparency obligations for providers and deployers | Disclosure and labelling |
| Article 51 | Classification of GPAI models with systemic risk | The systemic-risk threshold for general-purpose models |

Post-market, the Commission's page states that **authorities handle market surveillance, deployers ensure human oversight and monitoring, providers must have a post-market monitoring system in place, and both providers and deployers report serious incidents and malfunctioning.**

**Governance and enforcement**: from **2026-08-02**, the AI Office and Member State authorities implement, supervise, and enforce the Act. The AI Office holds enforcement powers over GPAI models — it can request technical documentation, evaluate models, require corrective measures, and issue fines.

**Part of this is actively moving and must be marked uncertain**: the **AI Omnibus** simplification package was **adopted 2025-11-19**, reached **political agreement 2026-05-07**, and **entered into force 2026-07-27**. It pushed the high-risk application dates back (Annex III to 2027-12-02, Annex I to 2028-08-02), added the ninth prohibition, reinforced the AI Office's powers, and widened regulatory sandboxes and SME simplifications. **The article table above therefore comes from the 2024 original text on EUR-Lex, and the consolidated post-Omnibus text may differ** — cite article numbers from the consolidated version; all this post guarantees is that those numbers carried those headings in the original.

**This post does not state penalty amounts.** The penalty provisions were not within what I could read end to end here, and a blank is better than a wrong figure.

### NIST AI RMF: four functions, seven trustworthiness characteristics

NIST's own page is explicit about its status: **"intended for voluntary use"**, released 2023-01-26 through a consensus-driven public process with an RFI, multiple public drafts, and workshops. The framework document (NIST AI 100-1) describes itself as **voluntary, rights-preserving, non-sector-specific, and use-case agnostic**.

**The Core is four functions**:

| Function | What it does |
|---|---|
| **GOVERN** | Cultivates and implements a risk-management culture; sets out processes, documents, and organizational schemes that anticipate, identify, and manage risks; connects technical design to organizational values and policies; addresses the full product lifecycle |
| **MAP** | Establishes context and identifies risks |
| **MEASURE** | Analyzes, assesses, and tracks risks |
| **MANAGE** | Prioritizes and allocates resources to treat risks |

**The one structural fact worth memorizing**: **GOVERN is a cross-cutting function that applies to all stages of an organization's risk management processes and is infused throughout — and enables — the other three**, while MAP, MEASURE, and MANAGE can be applied in system-specific contexts and at specific lifecycle stages. The framework also states that, assuming a governance structure is in place, the functions may be performed in any order that adds value, and the process should be iterative.

**The seven trustworthiness characteristics** (Part 1): **valid and reliable, safe, secure and resilient, accountable and transparent, explainable and interpretable, privacy-enhanced, and fair with harmful bias managed.** The framework stresses these must be traded off rather than each maximized — its own example is that accurate-but-unsafe, safe-but-inaccurate, and inaccurate-but-secure-private-transparent systems are all undesirable.

**Companion resources**: the AI RMF Playbook (online, also voluntary), a Roadmap, a Crosswalk, and various Perspectives, all hosted in NIST's Trustworthy and Responsible AI Resource Center (launched 2023-03-30). Two profiles exist: the **Generative AI Profile (NIST-AI-600-1, released 2024-07-26)** and, from **2026-04-07, a concept note for a profile on trustworthy AI in critical infrastructure — a concept note, not yet a profile**.

**The biggest staleness risk in this whole post lives here**: NIST's page says it twice, in the banner and in the body — **"The AI RMF 1.0 is being revised as part of the White House AI Action Plan."** The 1.0 you read today is being rewritten. Memorize the structure (four functions, seven characteristics); the details are a moving target.

### ISO/IEC 42001: paywalled, so this section only states what ISO's public page states

What ISO's own page supports:

- Full title **ISO/IEC 42001:2023, Information technology — Artificial intelligence — Management system**
- **Edition 1, published 2023-12-18, 51 pages**, status Published (stage 60.60)
- Technical committee **ISO/IEC JTC 1/SC 42**
- Price **CHF 225** (PDF)
- It specifies requirements for establishing, implementing, maintaining, and continually improving an **Artificial Intelligence Management System (AIMS)**, for entities providing or using AI-based products or services
- ISO describes it as **the world's first AI management system standard**, built on the **Plan-Do-Check-Act** methodology, and a management system standard (MSS) rather than a technical standard about specific AI applications
- Related standards ISO itself lists: **ISO/IEC 22989** (terminology), **ISO/IEC 23053** (ML framework), **ISO/IEC 23894** (AI risk management guidance), and **ISO/IEC 42005** (impact assessment)

**Clause-level content is not stated here, because it is behind the paywall.** Which clauses exist, what Annex A's controls are, what the certification procedure involves — **not verified**. Second-hand summaries listing 42001's controls as fact are not a source until someone has read the standard itself. This is the one section of this post that has to stay blank, and blank beats wrong.

**Maps back to**: CCAR-P Governance (14%) "ensure regulatory compliance"; CCAO-F Governance (15%) "apply data sensitivity, regulatory, and privacy considerations" and "follow organizational AI policies and governance standards"; AB-100 Deploy (40–45%) "validate data residency and data movement compliance".

## Which framework each exam's governance objectives actually resemble

This is the most useful table in the post — **left is the raw objective from an official exam guide, right is its prototype among the three frameworks**. To repeat: **no certification cites any of these frameworks. This mapping is mine, not the vendors'.**

| Certification and domain | Official objective (from the exam guide) | Closest framework prototype |
|---|---|---|
| **CCAR-P** Governance 14% | Implement guardrails and safety controls; identify risks, limitations, and failure modes of LLM systems; ensure regulatory compliance (**GDPR, HIPAA, FedRAMP**); address bias, fairness, transparency; apply human-in-the-loop validation strategies | NIST **MAP + MEASURE + MANAGE** plus the seven characteristics; the regulations named are data-protection and sectoral regimes, **not AI-specific law** |
| **CCAO-F** Governance 15% | Identify appropriate and inappropriate use cases; apply data sensitivity, regulatory, and privacy considerations; **follow organizational AI policies and governance standards**; understand ethical implications | **ISO/IEC 42001's AIMS thinking** — "follow your organization's policy" is exactly management-system-standard language |
| **AB-100** Deploy 40–45% | Design agent security and governance; analyze vulnerabilities and mitigations incl. prompt manipulation; review against responsible AI principles; **validate data residency and data movement compliance**; design access control for grounding data and model tuning; **design audit trails for model and data changes** | **Closest of any exam to the EU AI Act's high-risk duties**: data governance (Art 10), record-keeping and traceability (Art 12), robustness and cybersecurity (Art 15) |
| **AI-500** Secure/govern/deploy 20–25% | RBAC, Key Vault, OAuth 2.0, on-behalf-of; guardrails at four intervention points (input / tool call / tool response / output); guardrail testing with synthetic data; AI Red Teaming Agent; DTAP / blue-green / canary | **The operational side of NIST's GOVERN**, with almost no legal content — its "govern" means control, not compliance |
| **NCP-AAI** Safety/Ethics/Compliance 5% | System safety and audit trails; compliance guardrails; **bias and toxicity mitigation**; layered safety frameworks (filters, escalation protocols); authorization and regulatory adherence | **NIST's seven characteristics**, almost item for item: safe; secure and resilient; fair with harmful bias managed |
| **NCP-AAI** Human-AI Interaction 5% | User-in-the-loop interfaces; structured feedback loops; **transparency mechanisms (explainable reasoning, decision traceability)**; human oversight and intervention | NIST's **accountable and transparent** + **explainable and interpretable**; also the EU AI Act's human oversight (Art 14) |
| **AIF-C01** Responsible AI 14% | Six dimensions — **bias, fairness, inclusivity, robustness, safety, veracity**; environmental and sustainability considerations; legal risks; detection tooling (label-quality analysis, human audit, subgroup analysis); transparency and explainability | **The closest wording in the series to NIST's seven characteristics**, though AWS cites NIST nowhere |
| **AIF-C01** Security/Compliance/Governance 14% | IAM, encryption, shared responsibility; **data sources and lineage, Model Cards**; prompt injection; output filtering and validation; **audit trails and logging of AI interactions**; data lifecycle and residency | EU AI Act **Art 10 data governance** + **Art 12 record-keeping**; residency lines up with AB-100's data-residency objective |
| **AIP-C01** Safety/Security/Governance 20% | Programmatic **model cards**, data lineage, metadata tagging, **decision logs**; source registration and CloudTrail auditing; continuous monitoring (misuse, drift, policy violations, **bias drift**, token-level masking, response logging, output policy filtering) | The EU AI Act's **post-market monitoring** (the Commission's page: providers must have a post-market monitoring system and report serious incidents) + the continuous nature of NIST's **MEASURE / MANAGE** |

**How to use this table**: if you are preparing for two or more of these, read NIST AI RMF 1.0 first — it is free, its Part 1 / Part 2 structure is clean, and **five of the eight objective groups above have their prototype in it**. The EU AI Act is genuinely touched only by AB-100 and the two AWS exams; ISO/IEC 42001 only by CCAO-F's "follow the organizational policy" framing.

**Maps back to**: CCAR-P Governance (14%), CCAO-F Governance (15%), AB-100 Deploy (40–45%), AI-500 Secure/govern/deploy (20–25%), NCP-AAI Safety/Ethics/Compliance (5%) + Human-AI Interaction (5%), AIF-C01 chapters 4 and 5 (14% each), AIP-C01 chapter 3 (20%).

## What an engineer has to be able to do, not recite

Governance questions are situational judgment, not definitions. These seven are what all the objectives above collapse into — each one lines up with at least one framework and at least one exam.

**1. Work out which tier your system is in, first.** The EU AI Act's obligation load jumps an order of magnitude between tiers. Most internal enterprise agent systems land in **transparency risk** (tell people they're talking to a machine, make generated content identifiable), not high risk. But the moment you touch an Annex III use case — CV screening, credit scoring, exam scoring — the full high-risk regime opens. **"It's just an internal tool" is not a classification criterion; the use is.**
→ EU AI Act Art 6; AB-100 "review against responsible AI principles"; CCAO-F "identify appropriate and inappropriate use cases".

**2. Write logs someone else can follow, not logs you can debug with.** Art 12 requires high-risk systems to technically allow automatic event recording over their lifetime; AIP-C01 tests **decision logs** and CloudTrail auditing; AI-500 tests **agent replay capture for reproducible debugging**. All three want the same thing at different intensities: **the ability to reconstruct one decision completely.** Printing errors doesn't count.

**3. Design human oversight to be actionable, not a confirm button.** Art 14's wording is that the system must be designed and developed so it "can be **effectively** overseen by natural persons", including appropriate human-machine interface tools. CCAR-P tests human-in-the-loop validation strategies; AI-500 tests approval flows, overrides, and edge cases; NCP-AAI gives human oversight and intervention a whole 5% domain. **A button that always gets pressed is not oversight.**

**4. Be able to state your data's provenance and lineage.** Art 10 is a dedicated data-governance article; AIF-C01 tests data lineage and Model Cards; AIP-C01 tests Glue lineage and source registration; AB-100 tests **data residency and data movement compliance**. This is the one that is hardest to retrofit — lineage is a design-time decision, not something you discover afterwards.

**5. Label AI-generated content.** The Act's transparency rules take effect in **August 2026**, and the Commission has published both a Code of Practice on Marking and Labelling of AI-generated Content (a voluntary tool, including a set of icons) and Guidelines on transparency obligations. This is the item with the weakest exam coverage — only AIF-C01's "AI decision transparency" comes near it — but **it is the one to act on right now in practice**.

**6. Have an organization-level AI policy, and be able to check systems against it.** That is ISO/IEC 42001's core: an AIMS is policies and objectives plus the processes to achieve them. CCAO-F makes "follow organizational AI policies and governance standards" an objective outright. **This one is a team-level artifact you cannot supply alone**, but you should at least know which policy governs your system.

**7. Treat risk management as continuous, not a pre-launch checklist.** NIST's GOVERN is cross-cutting and infused throughout the other three functions; ISO 42001 uses PDCA; the Act's Art 9 requires a risk management system to be "established, implemented, documented and maintained", and post-market the provider must monitor and report serious incidents. AIP-C01's **continuous monitoring (drift, policy violations, bias drift)** is the implementation of the same idea. **All three frameworks agree here, and so do the exams.**

**Maps back to**: EU AI Act Art 6 / 9 / 10 / 12 / 14 / 50; NIST GOVERN (cross-cutting) + MEASURE / MANAGE; ISO/IEC 42001's PDCA; AB-100 Deploy (40–45%), AIP-C01 chapter 3 (20%), AIF-C01 chapters 4 and 5 (14% each), CCAR-P Governance (14%), CCAO-F Governance (15%), NCP-AAI Human-AI Interaction (5%).

## Verification traps hit along the way

This section is here because these will directly affect your own attempt to check any of this:

- **`iso.org/standard/42001.html` is not ISO/IEC 42001.** That URL serves **ISO 12164-4:2008** (a hollow taper interface for machine tools, withdrawn years ago). The correct page is `iso.org/standard/42001` (equivalently `81230.html`). **The `.html` variant is a completely different standard, and taking it at face value would corrupt an entire section.**
- **HTTP 200 does not mean the page exists.** The Commission site's `standardisation-and-ai-act` path returns 200 with a body reading "Page not found". A status code cannot detect a soft 404 — you have to read the body.
- **EUR-Lex and ISO both block automated fetching**: EUR-Lex answers `curl` with **202** (not content), ISO with **403**. Both were only readable through a fetcher that executes JavaScript. **A 202 or 403 is not evidence that a source doesn't exist.**
- **The same page can state a date two ways**: the Commission's page says both "became applicable on 2 August 2026" and "the transparency rules will come into effect in August 2026". Compatible, different precision — quote the precise one.

## What will go stale (check here next time)

This is the fastest-ageing topic in the series: two of the three frameworks are in motion.

| Item | Status (verified 2026-08-18) | Recheck |
|---|---|---|
| **NIST AI RMF 1.0 revision** | NIST's page states it is being revised as part of the White House AI Action Plan; no timeline given | **Monthly** — most likely of the three to be replaced wholesale |
| EU AI Act high-risk dates | Annex III **2027-12-02**, Annex I **2028-08-02** (post-Omnibus) | Quarterly |
| AI Omnibus consolidated text | In force 2026-07-27; the article numbers here come from the 2024 original, which may differ | **Before citing any article number again** |
| EU AI Act ninth prohibition | Non-consensual explicit content and CSAM generation, effective **December 2026** | December 2026 |
| EU AI Act transparency rules | Effective August 2026; Commission published transparency guidelines 2026-07-20 | Quarterly |
| Third-party AI evaluation capacity | The Commission will launch a call to increase EU evaluation capacity, **expected operational by 2027** | 2027 |
| NIST critical-infrastructure profile | 2026-04-07 concept note only — **not yet a profile** | Quarterly |
| NIST GenAI Profile | NIST-AI-600-1, released 2024-07-26 | Alongside the AI RMF revision |
| ISO/IEC 42001 edition | Edition 1 (2023-12); has not entered systematic review (stage 90) | Every six months |
| ISO/IEC 42001 clause content | **Not verified (paywalled, CHF 225)** | If the standard itself is obtained |
| EU AI Act penalty amounts | **Not stated in this post** (penalty provisions not read) | If the consolidated text is read |
| Regulations CCAR-P names | GDPR, HIPAA, FedRAMP — **still no AI-specific law** | Each exam guide revision |
| Whether any exam starts testing AI-specific law | All fifteen exam guides name **none** of the three frameworks | Quarterly — most likely to change now that the Act is fully applicable |

**That last row is the one to watch.** The Act only became fully applicable on 2026-08-02, and most of these exam guides were finalized before that. **If a certification does start naming AI-specific law, the two most likely to move first are AB-100 (its objectives are already the closest to statutory high-risk duties) and CCAR-P (the only one with a habit of naming regulations at all).**

## References

**Primary official sources**

- [European Commission AI Act policy page (risk tiers, timeline, AI Omnibus, governance and enforcement)](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai)
- [Regulation (EU) 2024/1689 full text on EUR-Lex (source for article numbers and headings)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
- [EUR-Lex ELI permanent link](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [European AI Office (the enforcing body)](https://digital-strategy.ec.europa.eu/en/policies/ai-office)
- [AI Act Service Desk (official Q&A and support)](https://digital-strategy.ec.europa.eu/en/policies/ai-act-service-desk)
- [NIST AI Risk Management Framework official page (release date, revision notice, companion resources)](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST AI 100-1, AI RMF 1.0 full PDF (four functions, seven characteristics)](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf)
- [NIST AI 600-1, Generative AI Profile PDF](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [NIST Trustworthy and Responsible AI Resource Center — AI RMF resources](https://airc.nist.gov/airmf-resources/airmf/)
- [NIST AI RMF Playbook](https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook)
- [ISO/IEC 42001:2023 official standard page (edition, page count, committee, price, AIMS definition)](https://www.iso.org/standard/42001)

**Certification sources**

- [AI-500 official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-500)
- [AB-100 official study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ab-100)
- [NCP-AAI official certification page](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Multi-agent architecture across five exams](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en)
- [Claude Certified Architect Professional (CCAR-P) guide](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide-en)
- [Claude Certified Associate (CCAO-F) guide](/posts/ai/2026-08-18-claude-certified-associate-prep-guide-en)
- [Microsoft AB-100 preparation path](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en)
- [Microsoft AI-500 preparation path](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en)
- [NVIDIA NCP-AAI preparation path](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en)
- [AWS AIF-C01 preparation path](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en)
- [AWS AIP-C01 preparation path](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en)
- [The harness layer of agent security](/posts/ai/2026-08-10-agent-security-harness-layer-en)
- [Agent security: prompt injection and trust boundaries](/posts/ai/2026-06-04-agent-security-prompt-injection-trust-boundaries-en)
- [RAG guardrails](/posts/ai/2026-03-12-rag-guardrails-en)
