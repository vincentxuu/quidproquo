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
| Azure / Microsoft ecosystem | AI-103 (associate) → AI-500 (expert, beta; **requires AI-103 first**) |
| Data platform + LLM | Databricks GenAI Engineer Associate ($200) |
| GPU / model layer | NVIDIA NCA-GENL ($125) |
| Taiwan job market / contracting | iPAS intermediate, NT$1,000 for both subjects |

If you want foundations rather than a credential, the site also has [which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) (in Mandarin), which reorders the official OpenAI, Anthropic, and Google offerings by capability tier.

## AWS: Three Exams Separated by Price and Expected Experience

All three are open to register. [AIF-C01](https://aws.amazon.com/certification/certified-ai-practitioner) is the entry point at $100, 90 minutes, 65 questions. [MLA-C01](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate) moves up to ML engineering practice at $150, 130 minutes, 65 questions. At the top sits [AIP-C01](https://aws.amazon.com/certification/certified-generative-ai-developer-professional) at $300, 180 minutes, 75 questions, where AWS expects **2 years of AWS experience plus 1 year of GenAI development** — the only one of the three aimed squarely at GenAI application development.

All three are valid 3 years. The [official recertification policy](https://aws.amazon.com/certification/policies/recertification/) states:

> Certification through AWS is valid for three years from the date it was earned.

AWS explicitly does not accept continuing education credits, but "retake the exam" has one exception: **earning the higher-tier certification automatically recertifies the one below it**. The [AWS certification page for AIF-C01](https://aws.amazon.com/tw/certification/certified-ai-practitioner) states that before expiry you can retake the current version of the exam, "or earn AWS Certified Machine Learning Engineer - Associate, which will automatically recertify this certification." So on the AIF-C01 → MLA-C01 path, the second exam also handles renewal of the first.

Failing costs more than people expect. The [official After Testing policy](https://aws.amazon.com/certification/policies/after-testing/) states:

> If you fail an exam, you must wait 14 calendar days before you are eligible to retake the exam. There is no limit on exam attempts. However, you must pay the full registration fee for each exam attempt.

**A retake means waiting 14 calendar days and paying full price again.** If you hold a voucher or a time-limited promotion, that clause decides how early you must schedule — leaving room for one retake means booking at least 14 days before the deadline. Two more numbers from the same page: the passing standard is **700** for Foundational, **720** for Associate, and **750** for Professional and Specialty exams (scaled 100–1,000), and results are posted within **five business days**.

Exam languages differ across the three: AIF-C01 offers **Traditional Chinese** (plus Arabic, English, French, German, Italian, Japanese, Korean, Portuguese, Spanish, and Simplified Chinese), while MLA-C01 and AIP-C01 offer only English, Japanese, Korean, and **Simplified Chinese**.

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

Factor validity into the cost: the official [exam terms](https://cloud.google.com/certification/terms) state professional certifications are valid two years and renewal **requires retaking the exam** (unlike Microsoft's free online renewal assessment), starting up to 60 days before expiry. That retake is discounted, though — the official [Vouchers & Discounts page](https://support.google.com/cloud-certification/answer/10055456) states that upon certification, a **50% discount code** appears in the Benefits section of your CM Connect account and can be applied to the renewal attempt. So two years out it's $100, not $200, though discount codes can't be combined. Given how often Google renames things, the real cost is the fresh round of prep, not the exam fee.

PMLE is offered in **English and Japanese only** — no Chinese. The certification page also puts recommended experience at "3+ years of industry experience including 1 or more years designing and managing solutions using Google Cloud," while noting that "the exam does not directly assess coding skill" — so prep time belongs on architectural tradeoffs and service selection, not on drilling code questions.

### Two Ways to Spend Less on Google

The [Get Certified program](https://cloud.google.com/learn/certification) lets Google Cloud **customers** take certification prep training at no cost. If your company is a GCP customer, check internally for a slot before paying $200.

The [GEAR program](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26), announced at Cloud Next '26 and running on Google Skills, is hands-on agent training whose new learning paths include *Introduction to Agents and Google's Agent Ecosystem* and *Develop Agents with Agent Development Kit (ADK)*. It maps directly onto PMLE's new agentic topics, and ADK work converts straight into portfolio material.

## Microsoft: AI-103 as the Base, Agent Credentials on Top

The current associate-level exam is **AI-103**, leading to [Azure AI Apps and Agents Developer Associate](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/). The official description reads "designing, developing, and deploying advanced Azure AI solutions using Python and Microsoft Foundry" — the core platform is **Microsoft Foundry**, so preparation looks nothing like the old Azure AI service lineup. (It replaces AI-102, which was retired on 2026-06-30; details in "What You Can Stop Looking For" below.)

Microsoft's agent track is more complete than anyone else's. Beyond the already-GA AB-620 (AI Agent Builder Associate), there are two **expert-level** credentials: [Multi-Agent AI Solutions Expert](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/) (AI-500, beta, officially positioned around "designing, building, and optimizing scalable, production-ready, multi-agent AI systems") and [Agentic AI Business Solutions Architect](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/) (AB-100).

**AI-500 deserves separate attention — but it isn't a certification you bolt on, it's the next rung of the same ladder.** Microsoft's [certification announcement](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-multi-agent-ai-solutions-expert-certification/4494122) is explicit:

> To earn the Microsoft Certified: Multi-Agent AI Solutions Expert (AI-500) certification, candidates **must also earn** the Microsoft Certified: Azure AI Apps and Agents Developer Associate (Exam AI-103) certification.

AI-103 is a hard prerequisite; there's no skipping it.

No other major cloud vendor currently offers an expert-level certification dedicated to multi-agent system architecture, so it differentiates you a tier above the associate-level AI-103. The tradeoff is slow score reporting during beta — rescoring waits for general availability, with final results roughly 10 days after — and questions that may shift before general release. The same announcement puts GA in October 2026.

Microsoft also has one advantage nobody else offers: renewal runs through a **free online renewal assessment**, rather than retaking the full exam as AWS and Google require.

Price and languages: the [AI-103 exam page](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/) lists **$165 USD** (priced by the country or region where the exam is proctored) and 120 minutes. The language list is a live demonstration of this article's third caveat — for the same certification, **the certification overview page lists only English while the exam page lists 10 languages including Traditional Chinese**. Go by whichever page you see at registration.

One gap worth planning around: AI-103 currently has **no free practice assessment**. The official note reads "Practice Assessments are usually available within 8 weeks of the exam being out of beta and generally available." Microsoft's [AI-103T00 course](https://learn.microsoft.com/en-us/training/courses/ai-103t00/) gives you four learning paths totalling roughly 29.5 hours at no cost, but self-assessment tooling lags AWS — they'll teach you, they just won't test you.

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

Preparation training is likewise limited to Partner Network members. The [Pearson VUE page](https://www.pearsonvue.com/us/en/anthropic.html) states:

> Prepare for your certification exam with self-paced preparation training courses available in Anthropic Partner Academy. **Training is available to members of the Claude Partner Network.**

So "free training" and "public training" are two different things: the announcement describes Partner Academy as "our free training platform for **partners**" — no charge, but gated. The gate itself is free, though; the same announcement says "Firms can join the Claude Partner Network and register practitioners... **Membership is free**."

The practical sequence is therefore: **the firm joins the Partner Network at no cost → only then can you train and schedule the exam**. Claims online that individuals can freely register are not supported by any official source I could find. For an engineer, step one on this credential isn't studying — it's checking whether your employer is in the Partner Network.

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

## What Training Costs: Is the Free Tier Enough?

Everything above is exam fees. Each vendor has a second bill: training. **The two are unrelated** — you don't have to take a course to register, and no vendor checks what you studied. Conflating them is the main reason people misjudge the budget.

| Vendor | Free from the vendor | Behind a paywall |
|---|---|---|
| AWS | Skill Builder free account: 1,000+ learning resources, a 20-question Official Practice Question Set (with detailed feedback and recommended resources), and a 2-hour Exam Prep course | Subscription at **$29/month** or **$449/year**: Official Pretests and full-length practice exams, Guided Builder Labs; the annual tier adds Digital Classroom |
| Google | The ML Engineer learning path and official sample questions on Google Skills (formerly Cloud Skills Boost) | Hands-on labs consume credits; the GEAR program grants 35 free monthly credits |
| Microsoft | The four learning paths in AI-103T00, roughly 29.5 hours | Instructor-led classes, Exam Replay retake bundles |
| NVIDIA | A Free Self-Paced Courses section; the Exam Blueprint maps each topic straight to the matching course | Instructor-led workshops |
| Databricks | Three free on-demand courses in Academy (Databricks Fundamentals, AI Agent Fundamentals, Generative AI Fundamentals, ~1.5 hours each, badge on completion) | Instructor-Led courses marked PAID, 8–18 hours |
| Claude | Partner Academy prep training (free, but restricted to Partner Network members) | — |

**Only one of these is worth paying for: AWS's $29 monthly subscription.** Not for the courses — because the **full-length practice exam sits behind the paywall**, and the free 20 questions aren't enough to tell you whether you'd pass. Subscribe a month before the exam and cancel after: $29 to know whether you'll pass beats sitting the exam blind and paying full price again, especially since an AWS retake also means waiting 14 days. Don't buy the $449 annual tier.

Microsoft gives away the most — those 29.5 hours — while being the only one of the five with no free practice assessment. They'll teach you; they won't test you.

## Ways to Pay Less: Mechanisms vs. Luck

Time-limited promo codes expire the moment they're written down, but each vendor's **discount mechanism** is stable enough to plan around.

**AWS: Professional and Specialty exam vouchers include a free retake.** Per the [voucher promotion terms](https://aws.amazon.com/tw/certification/bulk-voucher/terms-and-conditions), registering for any Professional or Specialty exam between 2026-04-15 and 2026-12-31 with a prepaid exam voucher covers the first attempt in full, and the promotion code is applied automatically on a retake — **the second attempt is free** (failed first attempts can retake through 2027-04-30). For AIP-C01, that clause covers the $300 you'd otherwise lose on a failure. Foundational and Associate exams are not in this window.

**Google: passing earns you a 50% code for renewal** (see the section above).

**Microsoft: 80% off beta exams for the first 300 candidates.** Every new certification runs a beta period before general availability, during which the first 300 registrants get **80% off** using a public discount code published in the Microsoft Learn Blog announcement. Passing the beta earns the certification outright — no need to sit the GA version — and anyone who used the 80% code later receives a 25% discount voucher. The cost is waiting for rescoring. Catching these means watching the new-certification announcements, and with Microsoft's turnover this year there are plenty of beta windows.

**Databricks: a Virtual Learning Festival each quarter.** Complete any self-paced learning pathway in Academy during the window and you get a **50% voucher** for any Databricks certification ($200 → $100) plus 20% off Academy Labs. One per learner, valid roughly 90 days. The 2026 windows were 1/9–1/30, 3/16–4/3, and 6/15–7/6; the [official community FAQ](https://community.databricks.com/t5/training-offerings/faq-for-virtual-learning-festival-16-march-03-april-2026/td-p/150220) announces each round.

**NVIDIA: webinars and GTC on-site.** Webinars occasionally carry 50%-off exam codes, and [at GTC](https://www.nvidia.com/en-us/training/) proctored certification exams are free for on-site attendees — officially listed as a €115–€425 value.

**Asking your employer beats hunting for codes.** Google's Get Certified is customer-only, Microsoft's Enterprise Skills Initiative is limited to enrolled organizations, and AWS and Databricks team vouchers require company purchase. Every one of those is worth more than any discount an individual can find — check internally before you pay.

## Three Things to Check Before You Register

**Study material freshness matters more than the certification itself.** PMLE is the clearest case: same name, same price, same-looking landing page, but old material walks you into a wall. Ten minutes with the official exam guide comparing service names before you register beats another hundred practice questions.

**What a vendor doesn't publish isn't known.** Claude certification prices and validity are stated with total confidence across the web, yet Anthropic has never published them and third parties contradict each other. The right move there is to check the checkout page, not to trust a summary.

**Within a single official domain, page freshness can differ by months.** Microsoft Q&A still hosts answers claiming AI-103 is in beta, while the certification page dropped the `(beta)` suffix long ago, is marked `hidden: false`, and was updated `2026-07-23`. Official sources still need checking for which page and when it was updated.

Relatedly, the common claim that "PMLE is the most-mentioned AI certification in the job market" has **no credible job-posting statistics behind it**. Treat it as opinion.

## Overall

**Match the cloud first, then the certification.** None of these seven vendors' credentials transfer; picking the wrong ecosystem adds almost nothing to a résumé.

**Put validity into the total cost.** AWS is 3 years, Google 2, NVIDIA and Databricks 2. Google requires retaking the exam; AWS does too by default, except that moving up a tier automatically recertifies the tier below. Microsoft's free online renewal assessment is still the cheapest of the group. Don't forget the cost of failing, either — an AWS retake means 14 days' wait and another full fee.

**Certifications have a shorter half-life than people assume.** AI-102 retiring, PMLE renaming, Claude going from one exam to four — all within the first half of 2026. Assume any certification recommendation older than three months has at least one dead line in it, this one included; open the vendor page before you pay.

**Taiwan's iPAS intermediate remains good value** — NT$1,000 for both subjects, a national credential with real weight in local hiring and government procurement — but budget for the 5-year renewal.

## Changelog

- 2026-08-07: Added a "What Training Costs" section. The article previously listed exam fees only, omitting the training layer — and the two bills are independent (no course is required to register). It compares each vendor's free/paid boundary and concludes that only AWS's $29 monthly subscription is worth paying for, because the full-length practice exam sits behind the paywall.
- 2026-08-07: Added a "Ways to Pay Less" section (AWS Professional vouchers with a free retake, Microsoft's 80%-off beta window for the first 300 candidates, Databricks' quarterly Learning Festival voucher, NVIDIA webinars and GTC on-site exams, plus employer-side Get Certified / ESI / team vouchers). Also filled two gaps: **AI-500 requires earning AI-103 first**, and Google issues a 50% renewal discount code on certification (the article previously priced renewal at the full $200).
- 2026-08-07: Four corrections and additions. The AWS section gains the retake policy (14 calendar days, full fee each attempt), passing standards (700 / 720 / 750), and score reporting time, and corrects "recertification means retaking the exam" — earning MLA-C01 automatically recertifies AIF-C01. The Google section adds PMLE's exam languages and the official note that it does not directly assess coding skill. The Microsoft section adds AI-103's $165 price, free course hours, and the currently missing practice assessment, plus the fact that its language list differs between two official pages. The Claude section corrects "the preparation courses themselves are free and public" — training is free of charge but limited to Partner Network members, and the gate is firm membership, which is itself free.

## References

**AWS**

- [AWS Certified Generative AI Developer – Professional (AIP-C01)](https://aws.amazon.com/certification/certified-generative-ai-developer-professional)
- [AWS Certified Machine Learning Engineer – Associate (MLA-C01)](https://aws.amazon.com/certification/certified-machine-learning-engineer-associate)
- [AWS Certified AI Practitioner (AIF-C01)](https://aws.amazon.com/certification/certified-ai-practitioner)
- [AWS Certified Machine Learning – Specialty (retirement notice, final exam date 2026-03-31)](https://aws.amazon.com/certification/certified-machine-learning-specialty)
- [AWS Recertification policy (three-year validity)](https://aws.amazon.com/certification/policies/recertification/)
- [AWS Certification "After Testing" policy (retake waiting period, passing standards, score reporting)](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Certified AI Practitioner certification page (automatic recertification note)](https://aws.amazon.com/tw/certification/certified-ai-practitioner)
- [AWS voucher promotion terms and conditions (Professional / Specialty with free retake)](https://aws.amazon.com/tw/certification/bulk-voucher/terms-and-conditions)

**Google Cloud**

- [Professional ML Engineer official exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Professional ML Engineer certification page](https://cloud.google.com/learn/certification/machine-learning-engineer)
- [Generative AI Leader certification page](https://cloud.google.com/learn/certification/generative-ai-leader)
- [Google Cloud certification index (includes Get Certified program)](https://cloud.google.com/learn/certification)
- [Google Cloud Exam Terms & Conditions (validity and renewal)](https://cloud.google.com/certification/terms)
- [Google Cloud Certification — Vouchers & Discounts (50% renewal code)](https://support.google.com/cloud-certification/answer/10055456)
- [Welcome to Google Cloud Next '26 (Gemini Enterprise Agent Platform launch)](https://cloud.google.com/blog/topics/google-cloud-next/welcome-to-google-cloud-next26)
- [GEAR program and AI learning paths](https://cloud.google.com/blog/topics/training-certifications/gear-up-to-get-the-most-out-of-ai-learning-at-google-cloud-next26)

**Microsoft**

- [Azure AI Apps and Agents Developer Associate (AI-103)](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-apps-and-agents-developer-associate/)
- [AI-103 exam page (price, language list, practice assessment status)](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/)
- [Course AI-103T00: Develop AI apps and agents on Azure](https://learn.microsoft.com/en-us/training/courses/ai-103t00/)
- [Multi-Agent AI Solutions Expert (AI-500, beta)](https://learn.microsoft.com/en-us/credentials/certifications/multi-agent-ai-solutions-expert/)
- [Microsoft announcement: AI-500 certification requirement and beta discount mechanism](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-multi-agent-ai-solutions-expert-certification/4494122)
- [Agentic AI Business Solutions Architect (AB-100)](https://learn.microsoft.com/en-us/credentials/certifications/agentic-ai-business-solutions-architect/)
- [Azure AI Engineer Associate (AI-102, retired)](https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/)
- [Microsoft Credentials roundup: June 2026](https://techcommunity.microsoft.com/blog/skills-hub-blog/microsoft-credentials-roundup-june-2026/4528350)
- [Pearson VUE — Microsoft Exam Updates](https://www.pearsonvue.com/us/en/microsoft/updates.html)

**NVIDIA / Databricks / Anthropic**

- [NVIDIA NCA-GENL official page](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NVIDIA Deep Learning Institute (free self-paced courses, GTC on-site exams)](https://www.nvidia.com/en-us/training/)
- [Databricks Certified Generative AI Engineer Associate](https://www.databricks.com/learn/certification/genai-engineer-associate)
- [Databricks Virtual Learning Festival FAQ (50% voucher rules and validity)](https://community.databricks.com/t5/training-offerings/faq-for-virtual-learning-festival-16-march-03-april-2026/td-p/150220)
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
