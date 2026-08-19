---
title: "What AI Certifications Engineers Can Take in 2026"
date: 2026-08-06
category: ai
tags:
  - certification
  - career
  - aws
  - gcp
  - azure
  - ipas
lang: en
type: deep-dive
tldr: "Every AI certification an engineer can register for in 2026, listed one by one: AWS AIP-C01 / MLA-C01 / AIF-C01, Google PMLE, Microsoft AI-103 and AI-500, all twelve NVIDIA exams, Databricks, Snowflake, Oracle's Agentic AI track, IBM watsonx, Salesforce Agentforce, GitHub GH-300, Anthropic's four Claude exams, Taiwan's iPAS AI Application Planner, plus the governance and audit line (IAPP AIGP, ISACA AAISM / AAIA, CertNexus CAIP) — prices, validity, and registration gates all checked against vendor pages. Two things that hit your wallet: Google's PMLE exam guide has renamed Vertex AI to Gemini Enterprise Agent Platform throughout, making pre-mid-2026 study material worthless, and the iPAS intermediate certificate is valid 5 years, not permanently."
description: "Full specifications for the AI certifications engineers can register for in 2026: AWS AIP-C01 / MLA-C01 / AIF-C01, Google Professional ML Engineer, Microsoft's AI-103 and agent track, NVIDIA's twelve exams, Databricks, Snowflake, Oracle, IBM, Salesforce, GitHub Copilot GH-300, Anthropic's four Claude exams, Taiwan's iPAS, and the governance line of IAPP AIGP, ISACA AAISM / AAIA, and CertNexus CAIP — pricing, validity, registration gates, and syllabus changes, all checked against official pages."
glossary:
  - term: "Gemini Enterprise Agent Platform"
    aliases: ["Agent Platform"]
    definition: "Google Cloud's agent development platform announced at Cloud Next '26, which absorbs and replaces the Vertex AI brand and service names."
    advanced: "Includes Agent Studio, Agent-to-Agent Orchestration, Agent Registry, Agent Identity, Agent Gateway, and Agent Observability. The former Vertex AI AutoML / Workbench / Feature Store / Model Registry / Pipelines all now carry the Agent Platform prefix."
    context: "Used here to explain why old PMLE study material is now worthless."
    links:
      - label: "Welcome to Google Cloud Next '26"
        url: "https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-06-ai-certifications-2026-fact-check)

All three major cloud vendors overhauled their AI certification tracks in the first half of 2026, so what you can actually register for looks quite different from a year ago. This piece lists every exam an engineer can sit right now, with prices, validity, and registration gates taken from official announcements.

Two things worth knowing before you pay: **Google's PMLE exam guide has renamed Vertex AI throughout**, which makes pre-mid-2026 study material worthless, and **the iPAS intermediate certificate is valid 5 years**, not permanently as commonly written.

## The Table: What You Can Register For

| Certification | Cost | Duration / Questions | Validity |
|---|---|---|---|
| [AWS Certified Generative AI Developer – Professional](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) (AIP-C01) | $300 | 180 min / 75 | 3 years |
| [AWS Certified ML Engineer – Associate](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) (MLA-C01) | $150 | 130 min / 65 | 3 years |
| [AWS Certified AI Practitioner](https://aws.amazon.com/certification/certified-ai-practitioner) (AIF-C01) | $100 | 90 min / 65 | 3 years |
| [Google Professional ML Engineer](https://cloud.google.com/learn/certification/machine-learning-engineer) | $200 | 120 min / 50–60 | 2 years |
| [NVIDIA NCA-GENL](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/) | $125 | 60 min / 50–60 | 2 years |
| [Databricks GenAI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate) | $200 | 90 min / 45 | 2 years |

Microsoft and Anthropic are absent from this table: Microsoft's track turned over entirely this year and the codes need handling separately, and Anthropic publishes no pricing. iPAS is Taiwan-specific and follows different rules, so it gets its own section too. The NVIDIA row lists only the entry-level exam — the catalog actually holds twelve, tabled further down. Snowflake, Oracle, IBM, Salesforce, and GitHub are in "Other Ecosystems," and the governance line (IAPP, ISACA, CertNexus) is a different kind of credential entirely, so it gets its own section.

## Which One to Take

Confirm which cloud your company actually runs first, then pick the certification. Reversing that order leaves you with an AWS credential that carries almost no negotiating power at an Azure shop.

| Your environment / goal | Suggested path |
|---|---|
| AWS, want a fast start | AIF-C01 ($100) → MLA-C01 ($150) |
| AWS, building GenAI applications | Straight to AIP-C01 ($300); expects 2 years AWS + 1 year GenAI |
| Google Cloud | PMLE ($200), and **only use material published after mid-2026** |
| Azure / Microsoft ecosystem | AI-103 (associate); add AI-500 (expert, beta) for agent work |
| Data platform + LLM | Databricks GenAI Engineer Associate ($200) |
| GPU / model layer | NVIDIA NCA-GENL ($125) |
| Proving agent-system skills | NVIDIA NCP-AAI ($200, professional) or Microsoft AI-500 (expert, beta) |
| Snowflake / Oracle / Salesforce shops | See "Other Ecosystems" — each vendor now has its own GenAI or agent exam |
| Daily Copilot user | GitHub GH-300, the lowest-barrier proctored exam of the group |
| AI governance, audit, security compliance | IAPP AIGP or ISACA AAISM / AAIA — see "Governance, Audit, Security" |
| Taiwan job market / contracting | iPAS intermediate, NT$1,000 for both subjects |

If you want foundations rather than a credential, the site also has [which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) (in Mandarin), which reorders the official OpenAI, Anthropic, and Google offerings by capability tier.

**This table answers "which one", not "how to prepare".** For that the site has a whole series — [AI Certification Prep](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en), built on each vendor's official exam-guide domain weights, one post per certification. If you are undecided, the per-vendor chooser is the fastest way in:

- [Which of the three AWS certifications](/posts/ai/2026-08-19-aws-certifications-which-one-en) — including the time branch created by MLA-C01 English retiring 2026-09-28
- [Which of the four Microsoft certifications](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one-en) — where the code-first and low-code lines diverge
- [Which of the four NVIDIA certifications](/posts/ai/2026-08-19-nvidia-certifications-which-one-en) — two professionals are not registrable yet, and all official training is paid
- [Which of the four Claude certifications](/posts/ai/2026-08-19-claude-certifications-which-one-en) — individuals cannot register; Claude Partner Network organizations only

Technical topics tested across several exams are pulled into five deep dives: [multi-agent architecture](/posts/ai/2026-08-18-multi-agent-architecture-exam-domains-en), [RAG and retrieval evaluation](/posts/ai/2026-08-18-rag-evaluation-exam-domains-en), [AI governance frameworks](/posts/ai/2026-08-18-ai-governance-frameworks-exam-domains-en), [prompt and context engineering](/posts/ai/2026-08-18-prompt-context-engineering-exam-domains-en), and [cost and latency optimization](/posts/ai/2026-08-18-genai-cost-latency-exam-domains-en).

## AWS: Three Exams Separated by Price and Expected Experience

All three are open to register. [AIF-C01](https://aws.amazon.com/certification/certified-ai-practitioner) is the entry point at $100, 90 minutes, 65 questions. [MLA-C01](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) moves up to ML engineering practice at $150, 130 minutes, 65 questions. At the top sits [AIP-C01](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) at $300, 180 minutes, 75 questions, where AWS expects **2 years of AWS experience plus 1 year of GenAI development** — the only one of the three aimed squarely at GenAI application development.

**MLA-C01 has under six weeks left — don't start preparing for it now.** A notice sits at the top of the [official certification page](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate):

> This exam is being updated. Registration for the updated version (MLA-C02) opens September 1, 2026. The last day to take the current exam (MLA-C01) in English is September 28, 2026. The current exam in other languages (Korean, Japanese, and Simplified Chinese) will remain available until general availability of MLA-C02.

So the English exam ends **2026-09-28**, while Japanese, Korean, and Simplified Chinese survive until C02 goes GA. The C02 exam guide is **not published yet** — the official docs URL for `machine-learning-engineer-associate-02` returns 404 — so nobody knows what it covers. If you want the associate tier, the rational move is to wait for the C02 specs on September 1 rather than spend eight weeks on an exam that stops being offered at the end of September.

**AIF-C01 is offered in Traditional Chinese.** It runs in 12 languages including Traditional Chinese — the only certification in this article that does. MLA-C01 and AIP-C01 offer English, Japanese, Korean, and Simplified Chinese only; Google's PMLE is English and Japanese only. Sitting an exam in your first language is worth factoring into the time estimate.

All three are valid 3 years, but the renewal rules are more layered than most roundups suggest. The [official recertification page](https://aws.amazon.com/certification/recertification/) spells them out:

**The AI trio has no "take a course instead" option.** AWS as a program offers two paths — renew (+3 years) and maintain (+1 year, completed on AWS Skill Builder with a paid subscription) — but maintain is listed only for SAA, Developer, CloudOps/SysOps, SAP, and DOP. The Options column for AIF-C01, MLA-C01, and AIP-C01 contains exams only.

**Passing a higher exam renews the lower ones.** This is the cheapest path and the least frequently written down:

| What you hold | How to renew (all +3 years) |
|---|---|
| AI Practitioner (AIF-C01) | Retake AIF-C01, **or pass MLA-C01**, **or pass AIP-C01** |
| ML Engineer – Associate (MLA-C01) | Retake MLA-C01, **or pass AIP-C01** |
| GenAI Developer – Professional (AIP-C01) | Retake AIP-C01 only |

One AIP-C01 pass therefore pushes AIF-C01, MLA-C01, and Data Engineer – Associate three years out as well.

**Renewals come with a 50% voucher.** The Cost column for all three reads "Use the 50% discount voucher in your AWS Certification Account" — so the three-year renewal is $50 / $75 / $150, not list price.

Preparation paths: [AIF-C01](/posts/ai/2026-08-18-aws-aif-c01-prep-guide-en) and [AIP-C01](/posts/ai/2026-08-18-aws-aip-c01-prep-guide-en); the trade-offs are in [which of the three AWS certifications](/posts/ai/2026-08-19-aws-certifications-which-one-en).

## Google: PMLE Is the Only One, but the Material Must Postdate Mid-2026

Google has exactly two AI certifications: [Generative AI Leader](https://cloud.google.com/learn/certification/generative-ai-leader) (foundational) and [Professional ML Engineer](https://cloud.google.com/learn/certification/machine-learning-engineer) (professional). Of the 9 professional certifications on the [official certification index](https://cloud.google.com/learn/certification), none covers GenAI or agent engineering. Google's strategy is to **fold agentic content into the existing PMLE rather than create a separate credential** — so within the Google ecosystem, **PMLE is the only way** to demonstrate GenAI or agent capability.

Generative AI Leader is not worth $99 for an engineer. Google is blunt about the audience:

> This certification is for anyone in any job role, with or without hands-on technical experience.

Too little signal for anyone with a programming background. Exam languages are English, Japanese, Spanish, and Portuguese — no Chinese.

PMLE's preparation path is in [the Google PMLE prep guide](/posts/ai/2026-08-18-google-pmle-prep-guide-en).

### Every Product Name in the Exam Guide Was Renamed

This is the one thing to know before registering for PMLE. Most articles describe it as covering "Vertex AI" — but **that term has all but vanished from the current exam guide**. Comparing the full [official exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer):

| Old name (still used in most material) | Current exam guide term |
|---|---|
| Vertex AI | Gemini Enterprise Agent Platform |
| Vertex AI AutoML | Agent Platform AutoML |
| Vertex AI Workbench | Agent Platform Workbench |
| Vertex AI Feature Store | Agent Platform Feature Store |
| Vertex AI Model Registry | Agent Platform Model Registry |
| Vertex AI Pipelines | Agent Platform Pipelines |
| Vertex AI Prediction | Agent Platform Inference |
| Model Garden | Model Garden (the only survivor) |

At Cloud Next '26, Google folded Vertex AI into [Gemini Enterprise Agent Platform](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26), which officially "brings together the best of Vertex AI with transformational new features, including Agent Studio, Agent-to-Agent Orchestration, Agent Registry, Agent Identity, Agent Gateway, Agent Observability."

**Practical impact**: every PMLE course, online class, and question bank published before mid-2026 uses the old vocabulary. Exam questions use the new names directly, and anyone who only recognizes legacy Vertex AI terminology will stall on "Agent Platform Feature Store." This is the fastest way to waste $200.

Section weights were also rebalanced:

| Section | Weight |
|---|---|
| 1. Architecting low-code AI solutions | ~13% |
| 2. Collaborating within and across teams to manage data and models | ~16% |
| 3. Scaling prototypes into ML models | ~21% |
| 4. Serving and scaling models | ~20% |
| 5. Automating and orchestrating ML pipelines | ~18% |
| 6. Monitoring AI solutions | remainder |

Several topics won't appear in traditional ML material at all: **LLM-as-a-judge evaluation**, **prompt and context engineering**, **cost / latency / availability optimization for Gemini applications**, and **fine-tuning Gemini models using BigQuery**.

Factor validity into the cost: the official [exam terms](https://cloud.google.com/certification/terms) state professional certifications are valid two years, with renewal opening 60 days before expiry.

The renewal rules changed in 2026, and two details affect the math. The [official renewal page](https://support.google.com/cloud-certification/answer/9907853) says continuing education on Google Skills can add a year of validity, and the table lists foundational, associate, and professional tiers alike — **but the caveat on the same page states that only CDL, ACE, PCA, and PDE currently have that option**. PMLE is not among them; Google says it plans "to add the Google Skills renewal option to the other certifications at a later date." So PMLE still means retaking the exam today, though the restriction is clearly temporary.

The other commonly missed detail is the discount: the same page states you receive a **50% renewal discount code** when you first certify, retrievable from your CM Connect profile. That halves the $200 renewal — provided you don't let the certification lapse more than 30 days, after which you pay full price for the standard exam.

### Two Ways to Spend Less on Google

The [Get Certified program](https://cloud.google.com/learn/certification) lets Google Cloud **customers** take certification prep training at no cost. If your company is a GCP customer, check internally for a slot before paying $200.

The [GEAR program](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26), announced at Cloud Next '26 and running on Google Skills, is hands-on agent training whose new learning paths include *Introduction to Agents and Google's Agent Ecosystem* and *Develop Agents with Agent Development Kit (ADK)*. It maps directly onto PMLE's new agentic topics, and ADK work converts straight into portfolio material.

## Microsoft: AI-103 as the Base, Agent Credentials on Top

The current associate-level exam is **AI-103**, leading to [Azure AI Apps and Agents Developer Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/). The official description reads "designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry" — the core platform is **Microsoft Foundry**, so preparation looks nothing like the old Azure AI service lineup.

Microsoft's agent track is more complete than anyone else's. Beyond the already-GA AB-620 (AI Agent Builder Associate), there are two **expert-level** credentials: [Multi-Agent AI Solutions Expert](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/) (AI-500, beta, officially positioned around "designing, building, and optimizing scalable, production-ready, multi-agent AI systems") and [Agentic AI Business Solutions Architect](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/) (AB-100).

**AI-500 has a hard prerequisite that most roundups omit.** The "Certification prerequisites" section of the [official page](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/) states:

> To become a Microsoft Certified: Multi-Agent AI Solutions Expert (beta), you must earn the Microsoft Certified: Azure AI Apps and Agents Developer Associate certification.

You must hold **AI-103 first**; the page's field reads `Prerequisites: 1 certification`. Going straight to AI-500 is not possible, so the real cost is $165 (AI-103) plus $165 (AI-500). It is also **still in beta and English-only**, and the page still says "Learning paths or modules are not yet available for this certification."

**AI-500 deserves separate attention.** Among the three major clouds, only Microsoft offers an expert-level certification dedicated to multi-agent system architecture, so it differentiates you a tier above the associate-level AI-103. The tradeoff is slow score reporting during beta and questions that may shift before general release. It is not the only advanced agent credential on the market, though — NVIDIA's NCP-AAI and Oracle's Agentic AI track aim at the same thing; the difference is whose platform you get locked to.

Microsoft also has one advantage nobody else offers: renewal runs through a **free online renewal assessment**, rather than retaking the full exam as AWS and Google require. That extends to the [GitHub Copilot certification (GH-300)](https://learn.github.com/certification/COPILOT), which sits under the Microsoft umbrella: 100 minutes, **24-month validity**, proctored by Pearson VUE, covering responsible Copilot use, prompt crafting, agent mode and MCP, content exclusions, and audit logs. The official page says only that price depends on the country or region where the exam is proctored — it **publishes no figure**. The $99 quoted around the web is a third-party number; the registration page is what counts.

Preparation paths for all four: [AI-103](/posts/ai/2026-08-18-microsoft-ai-103-prep-guide-en), [AI-500](/posts/ai/2026-08-18-microsoft-ai-500-prep-guide-en), [AB-620](/posts/ai/2026-08-18-microsoft-ab-620-prep-guide-en), [AB-100](/posts/ai/2026-08-18-microsoft-ab-100-prep-guide-en); the trade-offs are in [which of the four Microsoft certifications](/posts/ai/2026-08-19-microsoft-ai-certifications-which-one-en).

## NVIDIA: Twelve Exams, Not Just NCA-GENL

The table above lists only the entry-level one. The [official certification catalog](https://www.nvidia.com/en-us/learn/certification/) actually lists twelve:

| Certification | Code | Cost | Duration |
|---|---|---|---|
| Agentic AI (Professional) | NCP-AAI | $200 | 2 hours |
| Generative AI LLMs (Professional) | NCP-GENL | $200 | 2 hours |
| Generative AI LLM (Associate) | NCA-GENL | $125 | 1 hour |
| Generative AI Multimodal (Associate) | NCA-GENM | $125 | 1 hour |
| AI Infrastructure and Operations (Associate) | NCA-AIIO | $125 | 1 hour |
| AI Infrastructure (Professional) | NCP-AII | $400 | 2 hours |
| AI Networking (Professional) | NCP-AIN | $400 | 2 hours |
| AI Rack and Interconnect (Professional) | NCP-ARI | $400 | 2 hours |
| AI Operations (Professional) | NCP-AIO | $500 | 2 hours |
| Accelerated Data Science (Professional) | NCP-ADS | $200 | 2 hours |
| Accelerated Data Science (Associate) | NCA-ADS | $125 | 1 hour |
| OpenUSD Development (Professional) | NCP-OUSD | $200 | 2 hours |

Two are worth calling out. **NCP-AAI (Agentic AI)** is one of the few vendor credentials built directly around multi-agent interaction, scalability, and ethical safeguards at professional level, and $200 is an easier entry than Microsoft's expert line. **NCA-GENM (Generative AI Multimodal)** is the only one here aimed specifically at systems spanning text, image, and audio — a better match than NCA-GENL if that's what you build.

One practical warning: NCP-AII, NCP-AIN, NCP-ARI, and NCP-AIO run $400–$500 and test GPU cluster deployment, monitoring, and interconnect. Those are infrastructure-team credentials, not application-engineer ones. Picking the wrong tier means paying four times as much for an exam you can't use.

Preparation paths for the four generative-AI exams: [NCA-GENL](/posts/ai/2026-08-18-nvidia-nca-genl-prep-guide-en), [NCP-GENL](/posts/ai/2026-08-18-nvidia-ncp-genl-prep-guide-en), [NCP-AAI](/posts/ai/2026-08-18-nvidia-ncp-aai-prep-guide-en), [NCA-GENM](/posts/ai/2026-08-18-nvidia-nca-genm-prep-guide-en); the trade-offs are in [which of the four NVIDIA certifications](/posts/ai/2026-08-19-nvidia-certifications-which-one-en).

## Other Ecosystems: Snowflake, Oracle, IBM, Salesforce

If your company isn't on any of the clouds above, these are the ones that count:

| Certification | Specs | Notes |
|---|---|---|
| [SnowPro Specialty: Gen AI](https://learn.snowflake.com/en/certifications/) | Current code **GES-C02**; every Specialty exam costs **$225** | Check the code before buying material. The same track also has Advanced: MLOps Engineer (MLA-B01) and Data Scientist (DSA-C03) |
| Oracle **Agentic AI track** (four exams) | Agentic AI Foundations (**free**), OCI Enterprise AI Professional, Agentic AI for Oracle AI Database Professional, and for Oracle Data Platform Professional | An entirely new line opened in August 2026 |
| [IBM Certified watsonx Generative AI Engineer – Associate](https://www.ibm.com/training/certification/ibm-certified-watsonx-generative-ai-engineer-associate-C9007000) | Exam code C1000-185 | **No price on the official page**; check the Pearson VUE checkout |
| [Salesforce Certified Agentforce Specialist](https://trailheadacademy.salesforce.com/certificate/exam-agentforce-specialist---AI-201) | AI-201, 60 questions / 105 minutes, **$200** (retake $100), no prerequisite | Covers Prompt Builder, agent lifecycle, Testing Center, Data Library |

Oracle changed two things this year that affect how you search for material. Per the [official announcement](https://blogs.oracle.com/oracleuniversity/oci-certification-learning-paths-and-exams-2026-updates-now-available), certification titles and badges **no longer carry the calendar year** (it's "OCI Architect Associate," not "OCI 2026 Architect Associate"), and while **Foundations-level courses and exams stay free, Professional-level courses moved to paid access**. Most tutorials you'll find still teach exam codes that no longer match the official pages, so compare names before trusting one.

## Claude: Four Certifications, All Specs in the Exam Guides

[Anthropic announced on July 23, 2026](https://claude.com/blog/four-role-based-claude-certifications) that the certification program had expanded to four credentials spanning Associate, Developer, and Architect roles. The same announcement notes that since the March launch, "more than 36,000 consultants have received certification across more than 1,300 organizations."

Engineers want **Claude Certified Developer: Foundations**, officially described as "for engineers building applications with Claude, and includes training on the Claude API, tool use, and agent development."

**All four fees and validity periods are officially published** — the path is just buried: the Pearson VUE page leads to the per-certification pages on [Anthropic Partner Academy](https://anthropic-partners.skilljar.com/), and each of those links a downloadable exam guide PDF whose "Exam Details at a Glance" table states the numbers verbatim:

| Certification | Code | Items | Time | Fee | Validity |
|---|---|---|---|---|---|
| [Claude Certified Associate – Foundations](https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification) | CCAO-F | 60 | 120 min | **$99** | 12 months |
| [Claude Certified Developer – Foundations](https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification) | CCDV-F | 53 | 120 min | **$125** | 12 months |
| [Claude Certified Architect – Foundations](https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification) | CCAR-F | 60 | 120 min | **$125** | 12 months |
| [Claude Certified Architect – Professional](https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification) | CCAR-P | 63 | 120 min | **$175** | 12 months |

All four pass at **720 on a 100–1,000 scaled score**, mix multiple-choice with multiple-response items, are delivered online proctored or at a Pearson test center, and report percent-correct by domain on the score report. CCAR-F has one structural quirk: **four scenarios drawn from a bank of six**.

The certification pages also publish domain weights. CCAR-F breaks down as Agentic Architecture & Orchestration 27%, Claude Code Configuration & Workflows 20%, Prompt Engineering & Structured Output 20%, Tool Design & MCP Integration 18%, Context Management & Reliability 15%; CCDV-F is dominated by Applications and Integration at 33.1%.

Retake rules are on the [Pearson VUE page](https://www.pearsonvue.com/us/en/anthropic.html): 14 days after a first failure, 30 after a second, 90 after a third, and **at most 4 attempts per exam in any rolling 12-month period**.

The registration gate does have an official source. The Pearson VUE page (last updated 2026-07-08) states:

> Certification is open to organizations in the Claude Partner Network and counts toward partner program standing.

Claims online that individuals can freely register for the exams are not supported by any official source I could find — **plan on needing access through a partner organization**.

Preparation paths for all four: [CCAR-F](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en), [CCAR-P](/posts/ai/2026-08-18-claude-certified-architect-professional-prep-guide-en), [CCDV-F](/posts/ai/2026-08-18-claude-certified-developer-prep-guide-en), [CCAO-F](/posts/ai/2026-08-18-claude-certified-associate-prep-guide-en); the trade-offs are in [which of the four Claude certifications](/posts/ai/2026-08-19-claude-certifications-which-one-en).

## iPAS Intermediate: Taiwan's Local Option, Valid 5 Years

Per the [official exam information](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info) (in Mandarin), intermediate Subject 1 (AI Technology Application and Planning) is mandatory, plus one of Subject 2 (Big Data Processing and Analysis) or Subject 3 (Machine Learning Technology and Applications), both requiring ≥70. The fee is a 2026–2027 promotional **NT$500 per subject** (regular price NT$1,500), so NT$1,000 for both, reverting in 2028.

The "roughly 25% Python code-reading questions" claim is true and officially sourced — iPAS published a [notice on code question weighting](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e) (in Mandarin) stating that code interpretation questions were added to Subjects 2 and 3 starting with the second 2025 session.

**Validity is the detail most sources get wrong**; even [104's certification guide](https://nabi.104.com.tw/posts/nabi_post_57d88633-27b9-4b3f-9535-501d4b781617) (in Mandarin) states the certificate is valid permanently. The [2026 iPAS AI Application Planner examination handbook](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf) (in Mandarin) is explicit:

| Level | Validity | Renewal requirement |
|---|---|---|
| Beginner | Permanent | No renewal needed |
| **Intermediate** | **5 years** | 48+ hours of AI-related training within 5 years of issuance |

Renewal has one engineer-friendly provision: **each year of AI-related work experience offsets 8 hours of training**. If AI is your day job, five years of experience covers 40 hours, leaving just 8 hours of coursework.

There's a real deadline: per the [official registration instructions](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration) (in Mandarin), the intermediate exam runs only twice in 2026 (May 23 and November 14), and individual registration for the second session closes **2026-09-22 at 12:00 noon**.

### The Intermediate Certificate Is Split, and Subject Scores Carry Over

Per the [2026 handbook](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0410_20260410115646.pdf) (in Mandarin), intermediate isn't one generic certificate. Subjects 1 + 2 at 70 or above yields "AI Application Planner (**Data Analysis**)"; Subjects 1 + 3 yields "AI Application Planner (**Machine Learning**)." The parenthetical shows up on your résumé, so decide which one you want first.

Two money-saving rules that people miss:

- **A passing subject score is held for three calendar years.** A subject passed in 2026 counts through 2029-12-31, so the next sitting only needs the other subject.
- **Older iPAS credentials grant exemptions.** Holders who passed Subject 2 of the former Machine Learning Engineer (beginner) can be exempted from intermediate Subject 3; holders who passed Subject 1 of the former Big Data Analyst (intermediate) can be exempted from either Subject 2 or Subject 3 (one only). Either way, passing Subject 1 at 70 or above is enough to earn the certificate. **Exemption eligibility only runs through the end of 2027.**

### Beginner Level: Permanent, and Worth Banking

The beginner level covers two subjects — Introduction to AI Fundamentals, and Generative AI Applications and Planning — at 75 minutes each with a 70-point pass mark, and runs four times in 2026 (March 21, May 16, August 15, November 7), three times as often as intermediate. **The beginner certificate is valid permanently with no renewal**, unlike intermediate's 5 years; the validity table above lists both, so don't conflate them.

For a faster local credential there are two non-iPAS options from the Computer Skills Foundation: **TQC AI Applications and Technology** (Practical AI1 / Advanced AI2 / Professional AI3, **NT$1,000** each, 50 knowledge questions) and **TQC+ Artificial Intelligence: Machine Learning Python 3** (PML3, **NT$1,800**, 60 minutes, hands-on coding only). PML3 is the only local exam here that tests implementation, but neither carries the weight of an iPAS certificate issued by the Ministry of Economic Affairs.

## Governance, Audit, Security: A Completely Different Line

Everything above asks "can you build it." This section asks "can you sign off on it." Companies adopting AI now need someone accountable for the risk, and these credentials barely overlap with the engineering ones — two of them require you to already hold something else.

| Certification | Cost | Specs and gates |
|---|---|---|
| [IAPP AIGP](https://store.iapp.org/aigp-exam/) (AI Governance Professional) | $649 member / **$799 non-member** | 100 questions / 2.75 hours, **2-year** term, 20 continuing-education credits per term; non-members pay a $250 maintenance fee at recertification |
| [ISACA AAISM](https://www.isaca.org/credentialing/aaism) (Advanced in AI Security Management) | $459 member / $599 non-member, plus a $50 application fee | **Requires an active CISM or CISSP**; 10 hours of AI-domain CPE annually |
| [ISACA AAIA](https://www.isaca.org/credentialing/aaia) (Advanced in AI Audit) | Same | **Requires an active CISA**, or CIA / US CPA / ACCA and similar audit designations |
| [CertNexus CAIP](https://certnexus.com/certified-artificial-intelligence-practitioner-caip/) (AIP-210) | No price on the official page | 80 questions / 120 minutes, 3-year validity, renewable with 60 hours of continuing education |

**What sets CAIP apart isn't the content, it's the accreditation.** It is ANAB-accredited under **ISO/IEC 17024**, the only credential in this entire article that is — a vendor certification derives its authority from the vendor, while CAIP's comes from a third party having audited how it writes and scores questions. Procurement, audit, and compliance contexts care about the latter. The content itself is vendor-neutral end-to-end ML: problem framing 26%, feature engineering 20%, training and tuning 24%, operationalization 30%.

Read the ISACA gates carefully: **these are add-ons to credentials you already hold, not entry points.** Without CISM / CISSP / CISA you cannot sit them, and the prerequisite itself represents years of experience plus an exam. Conversely, if you already hold one, the marginal cost of adding an AI credential is low and the CPE counts toward both.

AIGP is the most policy- and regulation-oriented of the group, covering responsible development, deployment, and governance frameworks. It suits legal, risk, and PM-plus-governance roles — it is not a way to demonstrate engineering ability.

## Three Commonly Mis-listed Items, Each Wrong in a Different Way

**"Google Cloud GenAI Engineer" does not exist.** It is an invented name, verified three ways: requesting `cloud.google.com/learn/certification/generative-ai-engineer` serves "404. Page Not Found — The requested URL was not found on this server" (the HTTP status code is actually 200, a soft 404, so "the link resolves" is not evidence the certification exists); the official certification index lists only Generative AI Leader and Professional ML Engineer under AI; and none of the 9 professional certifications covers GenAI or agent engineering.

**Free course certificates from OpenAI and Anthropic are not certifications.** Both vendors say so outright: the [OpenAI Academy help page](https://help.openai.com/en/articles/20001270-openai-academy-courses) states completion certificates "are not OpenAI Certifications, do not represent a formal OpenAI credential," and the [Claude Academy FAQ](https://academy.claude.com/help/faq) answers the "is this the same as certification" question with "No — they're two different things." The courses are worth taking, but what they attest to is course completion, not assessed capability — **they do not belong in a field asking for a professional AI/ML certification**. OpenAI's actual proctored credential remains in employer pilots, with no public registration, price, or date.

**CNCF's "Certified Kubernetes AI Conformance" is a real certification, just not one awarded to people.** It is a [conformance program for platforms and vendors](https://www.cncf.io/announcements/2025/11/11/cncf-launches-certified-kubernetes-ai-conformance-program-to-standardize-ai-workloads-on-kubernetes/), certifying that a Kubernetes distribution can reliably run AI workloads, awarded on a vendor-submitted self-assessment. CNCF's individual certification list (CKA, CKAD, CKS, KCNA, CNPA, CNPE, and so on) currently contains **no AI-specific credential at all**. Seeing it in an "AI certifications" list is a category error.

## Three Things to Check Before You Register

**Study material freshness matters more than the certification itself.** PMLE is the clearest case: same name, same price, same-looking landing page, but old material walks you into a wall. Ten minutes with the official exam guide comparing service names before you register beats another hundred practice questions.

**Not finding it is not the same as it not existing.** The first version of this article said Anthropic publishes no prices or validity for the Claude certifications. That was wrong — they do, in exam guide PDFs two levels below the Pearson VUE page, complete with fees, item counts, validity, and domain weights. I stopped at the Pearson page and concluded from its silence. When checking vendor specs, follow the path all the way down to the certification page and its exam guide or blueprint download.

**Within a single official domain, page freshness can differ by months.** Microsoft Q&A still hosts answers claiming AI-103 is in beta, while the certification page dropped the `(beta)` suffix long ago, is marked `hidden: false`, and was updated `2026-07-23`. Official sources still need checking for which page and when it was updated.

Relatedly, the common claim that "PMLE is the most-mentioned AI certification in the job market" has **no credible job-posting statistics behind it**. Treat it as opinion.

## Overall

**Match the cloud first, then the certification.** None of these vendors' credentials transfer; picking the wrong ecosystem adds almost nothing to a résumé. The one exception is CertNexus CAIP — ISO/IEC 17024 accredited and vendor-neutral, at the cost of proving nothing about any specific platform.

**Put validity into the total cost.** AWS is 3 years, Google 2, NVIDIA and Databricks 2. The AWS AI trio renews by exam only, but a 50% voucher applies and passing a higher exam renews the lower ones; PMLE also requires a retake today, but comes with a 50% renewal code, and continuing-education renewal already covers four other Google certifications with more promised. Microsoft's free online renewal assessment is still the cheapest of the group.

**Certifications have a shorter half-life than people assume.** Microsoft turned over its entire AI track, PMLE renamed every product in its guide, and Claude went from one exam to four — all within the first half of 2026. Assume any certification recommendation older than three months has at least one dead line in it, this one included; open the vendor page before you pay.

**Taiwan's iPAS intermediate remains good value** — NT$1,000 for both subjects, a national credential with real weight in local hiring and government procurement — but budget for the 5-year renewal.

**The governance line gates on something else entirely.** AIGP, AAISM, and AAIA are not "harder AI certifications"; they are add-ons that presuppose a compliance or security identity. Without CISM / CISSP / CISA you cannot sit the ISACA pair at all, regardless of whether you could pass.

## Changelog

- 2026-08-19: Added links to the 24-post AI Certification Prep series. Fifty files linked to this article; it linked back to one. The "which one" table now leads into the series and the four per-vendor choosers, and each vendor section ends with its preparation paths. No content or conclusions changed.
- 2026-08-18: Substantially expanded coverage. NVIDIA goes from a single exam to the full twelve-exam catalog (including Agentic AI NCP-AAI and multimodal NCA-GENM), correcting the earlier claim that only Microsoft offers an expert-level agent credential; added "Other Ecosystems" (Snowflake GES-C02, Oracle's new Agentic AI track, IBM watsonx C1000-185, Salesforce Agentforce Specialist AI-201) and GitHub Copilot GH-300; added "Governance, Audit, Security" (IAPP AIGP, ISACA AAISM / AAIA, CertNexus CAIP); added iPAS beginner-level specs plus the intermediate certificate split, subject-score carry-over, and exemption rules, along with TQC and TQC+; added AI-500's hard prerequisite (AI-103 must be earned first, quoted from the official Certification prerequisites section) along with its beta and English-only status; added the MLA-C01 update notice (English retires 2026-09-28, C02 registration opens September 1 with no published guide) and the exam-language details (AIF-C01 is the only one offered in Traditional Chinese); corrected the AWS renewal section — the article said renewal meant retaking with no continuing-education option, whereas the official recertification page lists both renew and maintain paths (maintain limited to SAA, Developer, CloudOps, SAP, DOP), cross-certification renewal across the AI trio, and a 50% voucher on every renewal; added a "commonly mis-listed" section covering Google Cloud GenAI Engineer (does not exist), OpenAI (free, globally available course certificates that are explicitly not certifications, with the formal credential still in employer pilots), and CNCF Kubernetes AI Conformance (awarded to platforms, not people), kept as three distinct errors rather than one shared reason. Per the "professional AI/ML certifications only" scope, free course-completion certificates from OpenAI Academy and Claude Academy are not listed as credentials; a single note with official sources remains in the mis-listed section. A significant error in the Claude section was corrected: the article claimed Anthropic published no prices or validity, when in fact each exam guide PDF states the fee ($99 / $125 / $125 / $175), item count, 12-month validity, and domain weights; retake rules were added, and the "what a vendor doesn't publish isn't known" takeaway was rewritten as "not finding it is not the same as it not existing." Retired exams were dropped from the article so that everything listed is currently registrable. Three existing facts were re-verified: the Google certification index (2 foundational, 3 associate, 9 professional) confirms Generative AI Leader and PMLE are still the only AI credentials, so that conclusion stands; the `generative-ai-engineer` evidence was corrected — that URL is a soft 404 (404 page body, HTTP status 200), so the original "returns HTTP 404" was inaccurate; and two Google renewal changes were added, namely the 50% renewal code issued at first certification and the continuing-education path currently limited to CDL, ACE, PCA, and PDE, leaving PMLE exam-only.

## References

**AWS**

- [AWS Certified Generative AI Developer – Professional (AIP-C01)](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AWS Certified Machine Learning Engineer – Associate (MLA-C01)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate)
- [AWS Certified AI Practitioner (AIF-C01)](https://aws.amazon.com/certification/certified-ai-practitioner)
- [AWS Recertification policy (three-year validity)](https://aws.amazon.com/certification/policies/recertification/)

**Google Cloud**

- [Professional ML Engineer official exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Professional ML Engineer certification page](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [Generative AI Leader certification page](https://cloud.google.com/learn/certification/generative-ai-leader)
- [Google Cloud certification index (includes Get Certified program)](https://cloud.google.com/learn/certification)
- [Google Cloud Exam Terms & Conditions (validity and renewal)](https://cloud.google.com/certification/terms)
- [Google Cloud Certification Renewal (renewal paths, 50% code, continuing-education scope)](https://support.google.com/cloud-certification/answer/9907853)
- [Welcome to Google Cloud Next '26 (Gemini Enterprise Agent Platform launch)](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)
- [GEAR program and AI learning paths](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)

**Microsoft**

- [Azure AI Apps and Agents Developer Associate (AI-103)](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [Multi-Agent AI Solutions Expert (AI-500, beta)](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [Agentic AI Business Solutions Architect (AB-100)](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)

**NVIDIA / Databricks / Anthropic**

- [NVIDIA certification catalog (all twelve exams and prices)](https://www.nvidia.com/en-us/learn/certification/)
- [NVIDIA NCA-GENL official page](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NVIDIA NCP-AAI (Agentic AI Professional)](https://www.nvidia.com/en-us/learn/certification/agentic-ai-professional/)
- [NVIDIA NCA-GENM (Generative AI Multimodal Associate)](https://www.nvidia.com/en-us/learn/certification/generative-ai-multimodal-associate/)
- [Databricks Certified Generative AI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate)
- [Anthropic: Four role-based Claude certifications (2026-07-23)](https://claude.com/blog/four-role-based-claude-certifications)
- [Pearson VUE — Claude Certification Program (retake rules)](https://www.pearsonvue.com/us/en/anthropic.html)
- [Anthropic Partner Academy — the four certification pages and exam guide downloads](https://anthropic-partners.skilljar.com/page/partner-certifications)
- [Claude Academy FAQ (free completion badges vs. proctored certification)](https://academy.claude.com/help/faq)

**Other ecosystems**

- [Snowflake SnowPro certification index (GES-C02 and exam pricing)](https://learn.snowflake.com/en/certifications/)
- [Oracle: OCI Certification Learning Paths and Exams, 2026 updates](https://blogs.oracle.com/oracleuniversity/oci-certification-learning-paths-and-exams-2026-updates-now-available)
- [IBM Certified watsonx Generative AI Engineer – Associate (C1000-185)](https://www.ibm.com/training/certification/ibm-certified-watsonx-generative-ai-engineer-associate-C9007000)
- [Salesforce Certified Agentforce Specialist (AI-201)](https://trailheadacademy.salesforce.com/certificate/exam-agentforce-specialist---AI-201)
- [GitHub Copilot certification (GH-300) exam details](https://learn.github.com/certification/COPILOT)
- [Exam GH-300 study guide (Microsoft Learn)](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/gh-300)

**Governance / audit / security**

- [IAPP AIGP exam page (pricing and maintenance)](https://store.iapp.org/aigp-exam/)
- [ISACA AAISM certification page](https://www.isaca.org/credentialing/aaism)
- [ISACA AAIA certification page](https://www.isaca.org/credentialing/aaia)
- [CertNexus CAIP (AIP-210) certification page](https://certnexus.com/certified-artificial-intelligence-practitioner-caip/)
- [CAIP AIP-210 exam blueprint (domain weights and recertification)](https://certnexus.com/wp-content/uploads/2023/08/CertNexus-Certified-Artificial-Intelligence-Practitioner-Exam-AIP-210-blueprint.pdf)

**Commonly mis-listed**

- [OpenAI Academy courses (free, global, and explicitly not certifications)](https://help.openai.com/en/articles/20001270-openai-academy-courses)
- [OpenAI: Launching our first OpenAI Certifications courses](https://openai.com/index/openai-certificate-courses/)
- [CNCF launches the Kubernetes AI Conformance Program (platform-level, not individual)](https://www.cncf.io/announcements/2025/11/11/cncf-launches-certified-kubernetes-ai-conformance-program-to-standardize-ai-workloads-on-kubernetes/)
- [CNCF individual certification list](https://www.cncf.io/training/certification/)

**iPAS and Taiwan-local**

- [iPAS AI Application Planner exam information](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info) (in Mandarin)
- [2026 iPAS AI Application Planner examination handbook](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf) (in Mandarin)
- [Notice on intermediate-level code question weighting](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e) (in Mandarin)
- [iPAS exam registration instructions](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration) (in Mandarin)
- [2026 iPAS handbook, April revision (certificate split and exemption rules)](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0410_20260410115646.pdf) (in Mandarin)
- [TQC AI Applications and Technology](https://www.tqc.org.tw/TQCNet/CertificateDetail.aspx?CODE=ijqo8mJkRJo%3D) (in Mandarin)
- [TQC+ Artificial Intelligence: Machine Learning Python 3 (PML3)](https://www.tqcplus.org.tw/CertificateDetail.aspx?CODE=XgSlxg3TL8Q%3D) (in Mandarin)
- [104: 2026 AI certification guide](https://nabi.104.com.tw/posts/nabi_post_57d88633-27b9-4b3f-9535-501d4b781617) (in Mandarin)

**Related on this site**

- [Complete Guide to the Claude Certified Architect Foundations Exam](/posts/ai/2026-08-18-claude-certified-architect-foundations-guide-en)
- [Which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) (in Mandarin)
