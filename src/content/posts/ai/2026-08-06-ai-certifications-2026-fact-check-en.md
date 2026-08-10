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
tldr: "Every AI certification an engineer can register for in 2026, listed one by one: AWS AIP-C01 / MLA-C01 / AIF-C01, Google PMLE, Microsoft AI-103 and AI-500, NVIDIA NCA-GENL, Databricks GenAI Engineer, Anthropic's four Claude exams, and Taiwan's iPAS AI Application Planner — prices, validity, and registration gates all checked against vendor pages. Two things that hit your wallet: Google's PMLE exam guide has renamed Vertex AI to Gemini Enterprise Agent Platform throughout, making pre-mid-2026 study material worthless, and the iPAS intermediate certificate is valid 5 years, not permanently."
description: "Full specifications for the AI certifications engineers can register for in 2026: AWS AIP-C01 / MLA-C01 / AIF-C01, Google Professional ML Engineer, Microsoft's AI-103 and agent certification track, NVIDIA NCA-GENL, Databricks GenAI Engineer, Anthropic's four Claude exams, and Taiwan's iPAS AI Application Planner — pricing, validity, registration gates, and syllabus changes, all checked against official pages."
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

Microsoft and Anthropic are absent from this table: Microsoft's track turned over entirely this year and the codes need handling separately, and Anthropic publishes no pricing. iPAS is Taiwan-specific and follows different rules, so it gets its own section too.

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
| Taiwan job market / contracting | iPAS intermediate, NT$1,000 for both subjects |

If you want foundations rather than a credential, the site also has [which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) (in Mandarin), which reorders the official OpenAI, Anthropic, and Google offerings by capability tier.

## AWS: Three Exams Separated by Price and Expected Experience

All three are open to register. [AIF-C01](https://aws.amazon.com/certification/certified-ai-practitioner) is the entry point at $100, 90 minutes, 65 questions. [MLA-C01](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) moves up to ML engineering practice at $150, 130 minutes, 65 questions. At the top sits [AIP-C01](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) at $300, 180 minutes, 75 questions, where AWS expects **2 years of AWS experience plus 1 year of GenAI development** — the only one of the three aimed squarely at GenAI application development.

All three are valid 3 years, and there is exactly one way to maintain them. The [official recertification policy](https://aws.amazon.com/certification/policies/recertification/) states:

> Certification through AWS is valid for three years from the date it was earned.

Recertification means retaking the exam; AWS explicitly does not accept continuing education credits. Budget that $100–$300 again three years out.

## Google: PMLE Is the Only One, but the Material Must Postdate Mid-2026

Google has exactly two AI certifications: [Generative AI Leader](https://cloud.google.com/learn/certification/generative-ai-leader) (foundational) and [Professional ML Engineer](https://cloud.google.com/learn/certification/machine-learning-engineer) (professional). Of the 9 professional certifications on the [official certification index](https://cloud.google.com/learn/certification), none covers GenAI or agent engineering. Google's strategy is to **fold agentic content into the existing PMLE rather than create a separate credential** — so within the Google ecosystem, **PMLE is the only way** to demonstrate GenAI or agent capability.

Generative AI Leader is not worth $99 for an engineer. Google is blunt about the audience:

> This certification is for anyone in any job role, with or without hands-on technical experience.

Too little signal for anyone with a programming background. Exam languages are English, Japanese, Spanish, and Portuguese — no Chinese.

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

Factor validity into the cost: the official [exam terms](https://cloud.google.com/certification/terms) state professional certifications are valid two years and renewal **requires retaking the exam** (unlike Microsoft's free online renewal assessment), starting up to 60 days before expiry. Given how often Google renames things, $200 plus a fresh round of prep every two years is not trivial.

### Two Ways to Spend Less on Google

The [Get Certified program](https://cloud.google.com/learn/certification) lets Google Cloud **customers** take certification prep training at no cost. If your company is a GCP customer, check internally for a slot before paying $200.

The [GEAR program](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26), announced at Cloud Next '26 and running on Google Skills, is hands-on agent training whose new learning paths include *Introduction to Agents and Google's Agent Ecosystem* and *Develop Agents with Agent Development Kit (ADK)*. It maps directly onto PMLE's new agentic topics, and ADK work converts straight into portfolio material.

## Microsoft: AI-103 as the Base, Agent Credentials on Top

The current associate-level exam is **AI-103**, leading to [Azure AI Apps and Agents Developer Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/). The official description reads "designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry" — the core platform is **Microsoft Foundry**, so preparation looks nothing like the old Azure AI service lineup. (It replaces AI-102, which was retired on 2026-06-30; details in "What You Can Stop Looking For" below.)

Microsoft's agent track is more complete than anyone else's. Beyond the already-GA AB-620 (AI Agent Builder Associate), there are two **expert-level** credentials: [Multi-Agent AI Solutions Expert](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/) (AI-500, beta, officially positioned around "designing, building, and optimizing scalable, production-ready, multi-agent AI systems") and [Agentic AI Business Solutions Architect](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/) (AB-100).

**AI-500 deserves separate attention.** No other major cloud vendor currently offers an expert-level certification dedicated to multi-agent system architecture, so it differentiates you a tier above the associate-level AI-103. The tradeoff is slow score reporting during beta and questions that may shift before general release.

Microsoft also has one advantage nobody else offers: renewal runs through a **free online renewal assessment**, rather than retaking the full exam as AWS and Google require.

## Claude: Four Certifications, Pricing Only at Checkout

[Anthropic announced on July 23, 2026](https://claude.com/blog/four-role-based-claude-certifications) that the certification program had expanded to four credentials spanning Associate, Developer, and Architect roles. The same announcement notes that since the March launch, "more than 36,000 consultants have received certification across more than 1,300 organizations."

Engineers want **Claude Certified Developer: Foundations**, officially described as "for engineers building applications with Claude, and includes training on the Claude API, tool use, and agent development."

**On pricing, an honest caveat**: Anthropic does not list exam fees on any public page. The [official Pearson VUE page](https://www.pearsonvue.com/us/en/anthropic.html) lists only the four certification names and codes, no prices. The figures below come from third-party aggregation, **and they disagree with each other**:

| Certification | Code | Third-party price | Audience |
|---|---|---|---|
| Claude Certified Associate: Foundations | CCAO-F | $99 | Non-technical roles |
| Claude Certified Developer: Foundations | CCDV-F | $125 | Engineers |
| Claude Certified Architect: Foundations | CCAR-F | $125 or $175 (sources conflict) | Solution architects |
| Claude Certified Architect: Professional | CCAR-P | $175 | Senior architects |

Validity has no official public figure either; third parties generally report 12 months with a free non-proctored renewal assessment before expiry. **Treat the amount shown at Partner Academy checkout as authoritative.**

The registration gate does have an official source. The Pearson VUE page (last updated 2026-07-08) states:

> Certification is open to organizations in the Claude Partner Network and counts toward partner program standing.

Preparation training is likewise limited to Partner Network members. Claims online that individuals can freely register are not supported by any official source I could find — **plan on needing access through a partner organization**. The preparation courses themselves are free and public, with no gate.

For exam content details, see the site's [complete guide to the Claude Certified Architect Foundations exam](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide-en) — written in March 2026 when only the Architect exam existed; codes and pricing here supersede it.

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

## What You Can Stop Looking For

Many top-ranking recommendation articles are 2025 posts with the year swapped in the title, and they still push these:

| What you might see | Current status |
|---|---|
| Microsoft AI-102 Azure AI Engineer | Retired 2026-06-30; take AI-103 |
| Microsoft AI-900 Azure AI Fundamentals | Retired 2026-06-30; take AI-901 |
| Microsoft DP-100 Azure Data Scientist | Retired 2026-06-01; take AI-300 MLOps Engineer |
| Microsoft AZ-204 Azure Developer | Retired 2026-07-31; take AI-200 Azure AI Cloud Developer |
| Microsoft AZ-500 Azure Security Engineer | Retired 2026-08-31; take SC-500 Cloud and AI Security Engineer |
| AWS ML – Specialty | Final exam date 2026-03-31 |
| "Google Cloud GenAI Engineer" | **This certification never existed** |

The Microsoft retirements are officially documented. The [Azure AI Engineer Associate certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/) carries a warning at the top:

> This certification and the renewal assessment are retired.

The page metadata shows an update timestamp of `2026-06-30` and is flagged `hidden: true` / `noindex` — Microsoft pulled it from search indexing entirely. Existing holders keep the credential until it expires naturally, but it **cannot be renewed and cannot be newly earned**. The full mapping is in [Pearson VUE's Microsoft exam update table](https://www.pearsonvue.com/us/en/microsoft/updates.html) and the [Microsoft Credentials roundup](https://techcommunity.microsoft.com/blog/skills-hub-blog/microsoft-credentials-roundup-june-2026/4528350).

"Google Cloud GenAI Engineer" is an invented name, verified three ways: requesting `cloud.google.com/learn/certification/generative-ai-engineer` returns **HTTP 404**; the official certification index lists only Generative AI Leader and Professional ML Engineer under AI; and none of the 9 professional certifications covers GenAI or agent engineering.

## Three Things to Check Before You Register

**Study material freshness matters more than the certification itself.** PMLE is the clearest case: same name, same price, same-looking landing page, but old material walks you into a wall. Ten minutes with the official exam guide comparing service names before you register beats another hundred practice questions.

**What a vendor doesn't publish isn't known.** Claude certification prices and validity are stated with total confidence across the web, yet Anthropic has never published them and third parties contradict each other. The right move there is to check the checkout page, not to trust a summary.

**Within a single official domain, page freshness can differ by months.** Microsoft Q&A still hosts answers claiming AI-103 is in beta, while the certification page dropped the `(beta)` suffix long ago, is marked `hidden: false`, and was updated `2026-07-23`. Official sources still need checking for which page and when it was updated.

Relatedly, the common claim that "PMLE is the most-mentioned AI certification in the job market" has **no credible job-posting statistics behind it**. Treat it as opinion.

## Overall

**Match the cloud first, then the certification.** None of these seven vendors' credentials transfer; picking the wrong ecosystem adds almost nothing to a résumé.

**Put validity into the total cost.** AWS is 3 years, Google 2, NVIDIA and Databricks 2 — and AWS and Google both require retaking the exam. Microsoft's free online renewal assessment is the cheapest of the group.

**Certifications have a shorter half-life than people assume.** AI-102 retiring, PMLE renaming, Claude going from one exam to four — all within the first half of 2026. Assume any certification recommendation older than three months has at least one dead line in it, this one included; open the vendor page before you pay.

**Taiwan's iPAS intermediate remains good value** — NT$1,000 for both subjects, a national credential with real weight in local hiring and government procurement — but budget for the 5-year renewal.

## References

**AWS**

- [AWS Certified Generative AI Developer – Professional (AIP-C01)](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AWS Certified Machine Learning Engineer – Associate (MLA-C01)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate)
- [AWS Certified AI Practitioner (AIF-C01)](https://aws.amazon.com/certification/certified-ai-practitioner)
- [AWS Certified Machine Learning – Specialty (retirement notice, final exam date 2026-03-31)](https://aws.amazon.com/certification/certified-machine-learning-specialty)
- [AWS Recertification policy (three-year validity)](https://aws.amazon.com/certification/policies/recertification/)

**Google Cloud**

- [Professional ML Engineer official exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Professional ML Engineer certification page](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [Generative AI Leader certification page](https://cloud.google.com/learn/certification/generative-ai-leader)
- [Google Cloud certification index (includes Get Certified program)](https://cloud.google.com/learn/certification)
- [Google Cloud Exam Terms & Conditions (validity and renewal)](https://cloud.google.com/certification/terms)
- [Welcome to Google Cloud Next '26 (Gemini Enterprise Agent Platform launch)](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)
- [GEAR program and AI learning paths](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)

**Microsoft**

- [Azure AI Apps and Agents Developer Associate (AI-103)](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [Multi-Agent AI Solutions Expert (AI-500, beta)](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [Agentic AI Business Solutions Architect (AB-100)](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)
- [Azure AI Engineer Associate (AI-102, retired)](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/)
- [Microsoft Credentials roundup: June 2026](https://techcommunity.microsoft.com/blog/skills-hub-blog/microsoft-credentials-roundup-june-2026/4528350)
- [Pearson VUE — Microsoft Exam Updates](https://www.pearsonvue.com/us/en/microsoft/updates.html)

**NVIDIA / Databricks / Anthropic**

- [NVIDIA NCA-GENL official page](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [Databricks Certified Generative AI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate)
- [Anthropic: Four role-based Claude certifications (2026-07-23)](https://claude.com/blog/four-role-based-claude-certifications)
- [Pearson VUE — Claude Certification Program](https://www.pearsonvue.com/us/en/anthropic.html)

**iPAS**

- [iPAS AI Application Planner exam information](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info) (in Mandarin)
- [2026 iPAS AI Application Planner examination handbook](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf) (in Mandarin)
- [Notice on intermediate-level code question weighting](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e) (in Mandarin)
- [iPAS exam registration instructions](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration) (in Mandarin)
- [104: 2026 AI certification guide](https://nabi.104.com.tw/posts/nabi_post_57d88633-27b9-4b3f-9535-501d4b781617) (in Mandarin)

**Related on this site**

- [Complete Guide to the Claude Certified Architect Foundations Exam](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide-en)
- [Which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) (in Mandarin)
