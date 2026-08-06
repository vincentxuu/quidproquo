---
title: "AI Certifications for Engineers in 2026: What's Still Live, What's Retired, and What Never Existed"
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
tldr: "Took a circulating '2026 AI certifications for engineers' list and checked every line against primary sources. Three hard errors: Microsoft AI-102 was retired on 2026-06-30, Google has no GenAI Engineer certification at all (the URL returns 404), and the iPAS intermediate certificate is valid for 5 years, not permanently. Separately, Google's PMLE exam guide has renamed every service from Vertex AI to Gemini Enterprise Agent Platform, invalidating all study material published before mid-2026."
description: "A primary-source audit of 2026 AI certifications for engineers: actual pricing, validity periods, registration gates, and syllabus changes for AWS AIP-C01 / MLA-C01, Google PMLE, Microsoft's AI-103 and agent certification track, NVIDIA NCA-GENL, Databricks GenAI Engineer, Anthropic's four Claude exams, and Taiwan's iPAS AI Application Planner."
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

A "2026 AI certifications for engineers" list looks reasonable at first glance: AWS, Google Cloud, Azure, NVIDIA, Databricks lined up in order, each with a price tag, plus a local Taiwanese option at the end. Then you check each line against the vendor's own page, and **three of them turn out to be dead** — one exam was retired two months ago, one certification never existed, and one validity period is stated backwards.

This is the record of that audit. Every price, validity period, and exam domain below comes from an official page. Secondhand blogs were used only to find leads, never to draw conclusions — and it turns out the worst errors all came from secondhand summaries.

## Why Secondhand Sources Are Especially Unreliable Here

Certification content has a structural problem: **content farms update far more slowly than vendors change their exams**. In the first half of 2026, all three major cloud vendors overhauled their AI certification tracks at the same time. Meanwhile, many top-ranking "best AI certifications 2026" articles are 2025 posts with the year in the title swapped out.

Three failure modes showed up:

| Failure mode | Example caught here |
|---|---|
| Exam retired, article still recommends it | Microsoft AI-102 |
| Certification doesn't exist, invented out of thin air | "Google Cloud GenAI Engineer" |
| Specification stated backwards | iPAS intermediate "valid permanently" |

There's a fourth, subtler mode: **the certification still exists under the same name, but its entire syllabus has been swapped out**. Google's PMLE is that case, covered separately below.

## Error One: Microsoft AI-102 Has Been Retired

The original list wrote "AI-102 or the newer AI-103," implying both are options. In reality, the [Azure AI Engineer Associate certification page](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/) carries a warning at the top:

> This certification and the renewal assessment are retired.

The page metadata shows an update timestamp of `2026-06-30` and is flagged `hidden: true` / `noindex` — Microsoft pulled it from search indexing entirely. Existing holders keep their credential until it expires naturally, but it **cannot be renewed and cannot be newly earned**.

The replacement is **AI-103**, leading to [Azure AI Apps and Agents Developer Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/). The official description reads "designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry" — the core platform is **Microsoft Foundry**, not Semantic Kernel as the original list guessed.

One verification trap worth noting: Microsoft Q&A still hosts answers claiming AI-103 is in beta. But the certification page title no longer carries the `(beta)` suffix, is marked `hidden: false`, and was updated `2026-07-23` — **it has gone GA**, and the Q&A entry is pre-GA residue. Within the same official domain, page freshness can differ by months.

Microsoft's retirement wave is much larger than the original list suggested — nearly the entire AI track turned over:

| Old | New | Retirement |
|---|---|---|
| AI-900 Azure AI Fundamentals | AI-901 | 2026-06-30 |
| AI-102 Azure AI Engineer | AI-103 Azure AI Apps and Agents Developer | 2026-06-30 |
| DP-100 Azure Data Scientist | AI-300 MLOps Engineer | 2026-06-01 |
| AZ-204 Azure Developer | AI-200 Azure AI Cloud Developer | 2026-07-31 |
| AZ-500 Azure Security Engineer | SC-500 Cloud and AI Security Engineer | 2026-08-31 |

The original list said "Microsoft is pushing agent certifications hard in 2026." That's correct, and understated. Beyond the already-GA AB-620 (AI Agent Builder Associate), there are two **expert-level** credentials:

- [Multi-Agent AI Solutions Expert](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/) (AI-500, beta) — officially positioned around "designing, building, and optimizing scalable, production-ready, multi-agent AI systems"
- [Agentic AI Business Solutions Architect](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/) (AB-100)

**AI-500 is the most notable find in this audit.** No other major cloud vendor currently offers an expert-level certification dedicated to multi-agent system architecture. If you're heading toward agent work, it differentiates you a tier above the associate-level AI-103. The tradeoff is slow score reporting during beta and questions that may shift before general release.

## Error Two: Google Has No GenAI Engineer Certification

The original list suggested "Google Cloud → Professional ML Engineer or Cloud GenAI Engineer." The latter does not exist. Verified three ways:

1. Requesting `cloud.google.com/learn/certification/generative-ai-engineer` directly returns **HTTP 404**
2. The [Google Cloud certification index](https://cloud.google.com/learn/certification) lists only two AI-related entries: Generative AI Leader (foundational) and Professional Machine Learning Engineer (professional)
3. Cross-checking multiple third-party full listings yields 9 professional certifications — Cloud Architect, Cloud Database Engineer, Cloud Developer, Data Engineer, Cloud DevOps Engineer, Cloud Security Engineer, Cloud Network Engineer, Workspace Administrator, Machine Learning Engineer. No GenAI or agent engineering credential.

Google's strategy is to **fold agentic content into the existing PMLE rather than create a separate certification**. So within the Google ecosystem, PMLE is the only credential that demonstrates GenAI or agent capability.

While we're here, the frequently mis-recommended [Generative AI Leader](https://cloud.google.com/learn/certification/generative-ai-leader): $99, 90 minutes, 50–60 questions, **valid 3 years**, no prerequisites. Google is blunt about the audience:

> This certification is for anyone in any job role, with or without hands-on technical experience.

For an engineer with a programming background, it carries too little signal — the original list was right to skip it. Note also that exam languages are English, Japanese, Spanish, and Portuguese — **no Chinese**.

## Error Three: The iPAS Intermediate Certificate Is Not Permanent

This is the most widely repeated error in Taiwanese sources; even articles on the 104 job board state "the certificate is valid permanently." The [2026 iPAS AI Application Planner examination handbook](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf) (in Chinese) is explicit:

| Level | Validity | Renewal requirement |
|---|---|---|
| Beginner | Permanent | No renewal needed |
| **Intermediate** | **5 years** | 48+ hours of AI-related training within 5 years of issuance |

Renewal has one engineer-friendly provision: **each year of AI-related work experience offsets 8 hours of training**. If AI is your day job, five years of experience covers 40 hours, leaving just 8 hours of coursework to renew.

The "permanent" claim probably spread because the beginner level genuinely is permanent, and that got applied loosely to the whole credential.

Everything else checks out: intermediate Subject 1 (AI Technology Application and Planning) is mandatory, plus one of Subject 2 (Big Data Processing and Analysis) or Subject 3 (Machine Learning Technology and Applications), both requiring ≥70. The fee is a 2026–2027 promotional **NT$500 per subject** (regular price NT$1,500), so NT$1,000 for both, reverting to full price in 2028.

The original list's claim of "roughly 25% Python code-reading questions" is also true and officially sourced — iPAS published a [notice on intermediate-level code question weighting](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e) (in Chinese) stating that code interpretation questions were added to Subjects 2 and 3 starting with the second 2025 session.

There's a real deadline: the intermediate exam runs only twice in 2026 (May 23 and November 14), and individual registration for the second session closes **2026-09-22 at 12:00 noon**.

## Google PMLE: Same Certification, Entirely Renamed Syllabus

This is the highest-impact and least-discussed finding. The original list described PMLE as covering "Vertex AI, MLOps, model deployment and monitoring" — but **the term Vertex AI has all but vanished from the current exam guide**.

Pulling the full [official exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer) and comparing service names:

| Old name (still used in most study material) | Current exam guide term |
|---|---|
| Vertex AI | Gemini Enterprise Agent Platform |
| Vertex AI AutoML | Agent Platform AutoML |
| Vertex AI Workbench | Agent Platform Workbench |
| Vertex AI Feature Store | Agent Platform Feature Store |
| Vertex AI Model Registry | Agent Platform Model Registry |
| Vertex AI Pipelines | Agent Platform Pipelines |
| Vertex AI Prediction | Agent Platform Inference |
| Model Garden | Model Garden (the only survivor) |

This is more than a reskin. At Cloud Next '26, Google folded Vertex AI into [Gemini Enterprise Agent Platform](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26), which officially "brings together the best of Vertex AI with transformational new features, including Agent Studio, Agent-to-Agent Orchestration, Agent Registry, Agent Identity, Agent Gateway, Agent Observability." The certification index page also carries a notice that exams are being updated to reflect Cloud Next '26 product changes.

**Practical impact**: every PMLE course, question bank, and Udemy class published before mid-2026 uses the old vocabulary. Exam questions use the new names directly, and someone who only recognizes legacy Vertex AI terminology will stall on "Agent Platform Feature Store." This is the fastest way to waste $200 on the original list.

Section weights were also rebalanced (current official guide):

| Section | Weight |
|---|---|
| 1. Architecting low-code AI solutions | ~13% |
| 2. Collaborating within and across teams to manage data and models | ~16% |
| 3. Scaling prototypes into ML models | ~21% |
| 4. Serving and scaling models | ~20% |
| 5. Automating and orchestrating ML pipelines | ~18% |
| 6. Monitoring AI solutions | remainder |

Several newly added topics won't appear in traditional ML material at all: **LLM-as-a-judge evaluation**, **prompt and context engineering** (written into the candidate description), **cost / latency / availability optimization for Gemini applications**, and **fine-tuning Gemini models using BigQuery**. This is no longer a purely classical ML exam.

Factor validity into the cost: Google's official [exam terms](https://cloud.google.com/certification/terms) state professional certifications are valid two years and renewal **requires retaking the exam** (unlike Microsoft's free online renewal assessment), starting up to 60 days before expiry. Given how often Google renames things, $200 plus a fresh round of prep every two years is not a trivial maintenance cost.

## Claude Certifications: Specs Right, Registration Gate Unmentioned

The original list wrote "Anthropic Claude Certified (Developer / Architect – Foundations) $99–$175." The price range is right, but it collapses four separate exams into one. The actual lineup:

| Certification | Code | Price | Audience |
|---|---|---|---|
| Claude Certified Associate – Foundations | CCAO-F | $99 | Non-technical roles |
| Claude Certified Developer – Foundations | CCDV-F | $125 | Engineers |
| Claude Certified Architect – Foundations | CCAR-F | $125 | Solution architects |
| Claude Certified Architect – Professional | CCAR-P | $175 | Senior architects |

Engineers want **CCDV-F at $125**, not $99 — that's the non-technical Associate exam.

Two points the original list omitted entirely, both of which affect whether you can sit the exam at all:

**First, validity is only 12 months.** Every other vendor here gives 2–3 years; a Claude credential needs renewing annually.

**Second, registration runs through the Partner Network.** The [official Pearson VUE page](https://www.pearsonvue.com/us/en/anthropic.html) (last updated 2026-07-08) states:

> Certification is open to organizations in the Claude Partner Network and counts toward partner program standing.

Training is gated the same way: "Training is available to members of the Claude Partner Network." Claims online that individuals can freely register are not supported by any official source I could find — **plan on needing access through a partner organization**. The preparation courses themselves are free and publicly available, with no gate.

Retake policy: 14 days after the first failure, 30 after the second, 90 after the third, with a maximum of 4 attempts per rolling 12-month period.

For exam content details, see the site's [complete guide to the Claude Certified Architect Foundations exam](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide-en) — though that piece was written in March 2026 when only the Architect exam existed. For pricing and codes after the July expansion to four exams, this article supersedes it.

## What Passed Verification

The rest of the list holds up against official pages. Exact specifications:

| Certification | Cost | Duration / Questions | Validity |
|---|---|---|---|
| [AWS Certified Generative AI Developer – Professional](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) (AIP-C01) | $300 | 180 min / 75 | 3 years |
| [AWS Certified ML Engineer – Associate](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) (MLA-C01) | $150 | 130 min / 65 | 3 years |
| [AWS Certified AI Practitioner](https://aws.amazon.com/certification/certified-ai-practitioner) (AIF-C01) | $100 | 90 min / 65 | 3 years |
| [Google Professional ML Engineer](https://cloud.google.com/learn/certification/machine-learning-engineer) | $200 | 120 min / 50–60 | 2 years |
| [NVIDIA NCA-GENL](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/) | $125 | 60 min / 50–60 | 2 years |
| [Databricks GenAI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate) | $200 | 90 min / 45 | 2 years |

A few corrections:

- **AIP-C01 passes at 750/1000.** Of the 75 questions, 10 are unscored, so 65 actually count.
- **NVIDIA NCA-GENL is $125**, not the $135 some blogs list. Official blueprint weights: Core ML 30%, Software Development 24%, Experimentation 22%, Data Analysis & Visualization 14%, Trustworthy AI 10%.
- **AWS ML Specialty is indeed retired**, with a final exam date of 2026-03-31; existing holders keep the credential for 3 years. The original list's framing of MLA-C01 as its replacement is directionally right.
- **The Databricks exam is weighted toward building**: Application Development 30% plus Assembling and Deploying 22% is more than half the exam. It is not a theory test.

As for the original list's claim that "Google Cloud PMLE is currently one of the most-mentioned in the job market" — **no credible job-posting statistics support this**. Treat it as opinion.

## Two Ways to Spend Less

Picked up while auditing the Google track; neither appeared in the original list:

**Get Certified program** — Google Cloud customers can join a certification preparation program at no cost. If your company is a GCP customer, check internally for a slot before paying $200.

**GEAR program** — announced at Cloud Next '26 and running on Google Skills, this is hands-on agent training whose new learning paths include *Introduction to Agents and Google's Agent Ecosystem* and *Develop Agents with Agent Development Kit (ADK)*. It maps directly onto PMLE's new agentic topics, and ADK work converts straight into portfolio material — a better return than grinding another hundred practice questions.

## Overall

After the audit, the corrected read on this list:

**Certifications have a shorter half-life than people assume.** All three errors originated in the first half of 2026 — AI-102 retiring, PMLE renaming, Claude going from one exam to four, all within six months. Assume any certification recommendation older than three months has at least one dead line in it.

**Pick the cloud first, then the certification — never the reverse.** An AWS credential carries almost no negotiating power at a company running Azure. This was the single most valuable piece of advice in the original list.

**Study material freshness matters more than the certification itself.** PMLE is the clearest case: same name, same price, same-looking landing page, but old material walks you straight into a wall. Spending ten minutes with the official exam guide comparing service names before you register has a far higher return than another hundred practice questions.

**Taiwan's iPAS intermediate remains good value** — NT$1,000 for both subjects, a national credential with real weight in local hiring and government procurement — but budget for the 5-year renewal rather than treating it as done forever.

For courses rather than certifications, the site also has [which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) (in Chinese), which reorders the official OpenAI, Anthropic, and Google offerings by capability tier.

## References

**AWS**

- [AWS Certified Generative AI Developer – Professional (AIP-C01)](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AWS Certified Machine Learning Engineer – Associate (MLA-C01)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate)
- [AWS Certified Machine Learning – Specialty (retirement notice)](https://aws.amazon.com/certification/certified-machine-learning-specialty)
- [AWS Certified AI Practitioner (AIF-C01)](https://aws.amazon.com/certification/certified-ai-practitioner)

**Google Cloud**

- [Professional ML Engineer official exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Professional ML Engineer certification page](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [Generative AI Leader certification page](https://cloud.google.com/learn/certification/generative-ai-leader)
- [Google Cloud certification index](https://cloud.google.com/learn/certification)
- [Google Cloud Exam Terms & Conditions (validity and renewal)](https://cloud.google.com/certification/terms)
- [Welcome to Google Cloud Next '26 (Gemini Enterprise Agent Platform launch)](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)
- [GEAR program and AI learning paths](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)

**Microsoft**

- [Azure AI Engineer Associate (AI-102, retired)](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/)
- [Azure AI Apps and Agents Developer Associate (AI-103)](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [Multi-Agent AI Solutions Expert (AI-500, beta)](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [Agentic AI Business Solutions Architect (AB-100)](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)
- [Microsoft Credentials roundup: June 2026](https://techcommunity.microsoft.com/blog/skills-hub-blog/microsoft-credentials-roundup-june-2026/4528350)
- [Pearson VUE — Microsoft Exam Updates](https://www.pearsonvue.com/us/en/microsoft/updates.html)

**NVIDIA / Databricks / Anthropic**

- [NVIDIA NCA-GENL official page](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [Databricks Certified Generative AI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate)
- [Pearson VUE — Claude Certification Program](https://www.pearsonvue.com/us/en/anthropic.html)

**iPAS**

- [iPAS AI Application Planner exam information](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info) (in Chinese)
- [2026 iPAS AI Application Planner examination handbook](https://www.ipas.org.tw/api/proxy/uploads/certification/AIAP/115%E5%B9%B4%E5%BA%A6AI%E6%87%89%E7%94%A8%E8%A6%8F%E5%8A%83%E5%B8%AB%E8%83%BD%E5%8A%9B%E9%91%91%E5%AE%9A%E7%B0%A1%E7%AB%A0(%E5%88%9D%E3%80%81%E4%B8%AD%E7%B4%9A)_0105_20260105184002.pdf) (in Chinese)
- [Notice on intermediate-level code question weighting](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e) (in Chinese)
- [iPAS exam registration instructions](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-registration) (in Chinese)

**Related on this site**

- [Complete Guide to the Claude Certified Architect Foundations Exam](/posts/ai/2026-03-20-claude-certified-architect-foundations-guide-en)
- [Which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) (in Chinese)
