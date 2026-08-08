---
title: "How to Prepare for an AI Certification: Calculate the Exam Date First, Then the Study Order"
date: 2026-08-07
category: ai
tags:
  - certification
  - career
  - aws
  - learning-path
  - azure
  - gcp
  - ipas
lang: en
type: guide
tldr: "Most prep guides start at chapter one. This one works backwards: derive the exam date from each vendor's retake rules (AWS makes you wait 14 calendar days, Google escalates 14 → 60 → 365 days, Microsoft allows a retake after 24 hours, and Taiwan's iPAS has no retake at all — you wait six months for the next session), then order your study by domain weight rather than domain number, and take a free official practice set before studying anything. Includes weightings for seven certifications and a five-week AIF-C01 example."
description: "A method for preparing for AI certifications: how each vendor's retake rules change the exam date calculation, ordering study by domain weight, using official practice material for diagnosis before studying, and writing stop-lines in advance — covering AWS, Google, Microsoft, NVIDIA, Databricks, and iPAS."
glossary:
  - term: "compensatory scoring"
    definition: "A scoring model that only checks whether your total score clears the bar, rather than requiring a passing score in every section."
    advanced: "The opposite is conjunctive scoring, where each section must independently clear a threshold. Under compensatory scoring, surplus points from heavily weighted domains offset losses in lightly weighted ones, so preparation should lean toward weight rather than spreading time evenly. Taiwan's iPAS intermediate exam works the other way: each of the two subjects must independently reach 70."
    context: "Used here to explain why weak domains on AWS exams don't need to be brought to full strength, and why the same logic breaks on iPAS."
    links:
      - label: "AWS Certification: After Testing"
        url: "https://aws.amazon.com/certification/policies/after-testing/"
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-07-ai-certification-prep-method)

Two things decide whether you pass a certification, and both happen before you open any study material: **which day you book the exam for**, and **which chapter you study first**. Most prep guides skip both and start teaching at chapter one.

This piece is about the arithmetic behind those two decisions, across AWS, Google, Microsoft, NVIDIA, Databricks, and Taiwan's iPAS. If you're still choosing which exam to take, see [what AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en).

## Step 1: Work Backwards From "What Happens If I Fail"

The exam date isn't "whenever I feel ready." It's calculated — and the calculation depends entirely on one thing: **when you'd be allowed to sit it again.**

Vendors differ far too much to carry one rule over to another:

| Vendor | After a failure |
|---|---|
| **Microsoft** | Retake after **24 hours**; every subsequent attempt is **14 days** apart, up to five per year |
| **AWS** | Wait **14 calendar days**; unlimited attempts; full fee each time |
| **Google (Foundational)** | Wait **14 days**; maximum ten attempts per year |
| **Google (Associate / Professional)** | **14 days** after the first failure, **60 days** after the second, **365 days** after the third; maximum four attempts in two years |
| **Databricks** | Wait **14 days**; full fee each time |
| **NVIDIA** | Wait **14 days**; maximum five per year; repurchase each attempt |
| **iPAS intermediate** | No retake mechanism — **wait for the next session** (six months) |

**Fourteen days is the industry standard** — AWS, Google, Databricks, and NVIDIA all land on that number. The real outliers sit at both ends: Microsoft's 24 hours and iPAS's six months.

The [AWS After Testing policy](https://aws.amazon.com/certification/policies/after-testing/) states:

> If you fail an exam, you must wait **14 calendar days** before you are eligible to retake the exam. There is no limit on exam attempts. However, you must pay the full registration fee for each exam attempt.

[Google's exam terms](https://cloud.google.com/certification/terms) escalate:

> If you don't pass the exam, you can take it again after **14 days**. If you don't pass the second time, you must wait **60 days** before you can take it a third time. If you don't pass the third time, you must wait **365 days** before taking it a fourth time.

Microsoft is the most forgiving, but only once. The [official retake policy](https://learn.microsoft.com/en-us/credentials/support/retake-policy) states:

> If you don't pass an exam the first time, you must wait **24 hours** before retaking it. A **14-day waiting period** is imposed between all subsequent attempts (up to 5).

[Databricks' exam terms](https://www.databricks.com/learn/certification/terms-and-conditions) read "There is a 14-day wait between all attempts. Payment is required each time you take an exam," and [NVIDIA's certification FAQ](https://www.nvidia.com/en-us/learn/certification) is also 14 days, capped at "no more than five times per year."

### Three Deadline Structures, Three Calculations

**1. Sit any time, but with an external deadline** — a time-limited discount code, a voucher expiry, an expense-claim cutoff. Work backwards:

```
latest first attempt = deadline − retake waiting period − score reporting buffer
```

Using AWS, with a deadline of passing by September 30:

| Item | Days | Working backwards |
|---|---|---|
| Deadline | — | 9/30 |
| Retake waiting period | 14 calendar days | 9/16 |
| Score and rescheduling buffer | ~4 days | **9/12** |

The score buffer exists because the same AWS page notes "Final results will be posted to your AWS Certification Account within five business days." If the deadline requires *passing* rather than merely *sitting* the exam, those five business days belong in the math.

So the first attempt goes on 9/12, not "sometime in late September." One week separates "a second chance if I fail" from "out of luck if I fail."

**2. Fixed sessions** (iPAS). There are no days to subtract; the buffer is measured in sessions. Per the [official exam information](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info) (in Mandarin), the 2026 intermediate exam runs twice — May 23 and November 14 — with individual registration for the second session closing at noon on September 22. Fail that one and **the next opportunity is six months away**.

That changes the strategy entirely: there's no "postpone a week" option, so the stop-line decision has to move ahead of the registration deadline rather than sitting a week before the exam.

**3. Sit any time, no external deadline.** Easy to assume no math is needed, but a retake still costs full price — AWS and Google both say so explicitly. Write the total cost of one retake at the top of the plan; you'll use it when deciding whether to move the date earlier.

## Step 2: Take an Official Practice Set Before Studying Anything

This is the least intuitive step and the most commonly skipped: **before you study anything, work through free official questions.**

The point isn't practice, it's **diagnosis**. What you want isn't the score, it's the table of how many questions you missed per domain — that table decides how the following weeks get allocated. Without it, your study order is just someone else's recommendation copied down.

Vendors are unequal here, and it directly affects whether you can do this at all:

| Vendor | Free diagnostic available before studying |
|---|---|
| **iPAS** | **Complete past exam papers as PDFs** (the official [learning resources page](https://ipd.nat.gov.tw/ipas/certification/AIAP/learning-resources) publishes all three intermediate subjects through the first 2026 session), plus official study guides and errata |
| AWS | Official Practice Question Set (20 questions, with detailed feedback and recommended resources) |
| Google | Official sample questions |
| NVIDIA | The Exam Blueprint maps every topic and weight to a matching course, usable as a self-check list |
| Databricks | The task statement list in the exam guide |
| Microsoft | Only the Exam Sandbox (a UI demo, not questions); AI-103 currently has **no** free practice assessment |

**iPAS is by far the most generous here**, and most people don't know it: the learning resources page publishes complete past papers as PDFs for all three intermediate subjects, alongside official study guides and errata sheets. Using a recent real paper as your diagnostic beats any mock exam.

The Microsoft cell is a practical trap. The official note reads "Practice Assessments are usually available within 8 weeks of the exam being out of beta and generally available," so a freshly revised certification has a gap. The fallback is to walk the exam guide's task statements one by one and ask whether you could do each.

## Step 3: Order by Weight, Not by Domain Number

Domain numbering reflects the exam writer's taxonomy, not your learning sequence. **Order by weight.**

Official weightings for seven certifications, from their current exam guides:

| Certification | Domain weights |
|---|---|
| [AWS AIF-C01](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/certification/approved/pdfs/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf) | Applications of foundation models 28, generative AI fundamentals 24, AI/ML fundamentals 20, responsible AI 14, security and governance 14 |
| [AWS MLA-C01](https://d1.awsstatic.com/training-and-certification/docs-machine-learning-engineer-associate/AWS-Certified-Machine-Learning-Engineer-Associate_Exam-Guide.pdf) | Data preparation 28, model development 26, monitoring/maintenance/security 24, deployment and orchestration 22 |
| [AWS CLF-C02](https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf) | Cloud technology and services 34, security and compliance 30, cloud concepts 24, billing and support 12 |
| [Google PMLE](https://cloud.google.com/learn/certification/guides/machine-learning-engineer) | Scaling prototypes 21, serving and scaling models 20, automation and orchestration 18, cross-team collaboration 16, low-code solutions 13, monitoring 13 |
| [Databricks GenAI Engineer](https://www.databricks.com/learn/certification/genai-engineer-associate) | Application development 30, assembling and deploying 22, designing applications 14, data preparation 14, evaluation and monitoring 12, governance 8 |
| [Microsoft AI-103](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/) | Five assessed areas published, no percentages |
| [NVIDIA NCA-GENL](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/) | The Exam Blueprint lists weights and maps them directly to training courses |

Study AIF-C01 by number and week one covers the 20% domain; study by weight and week one covers the 28% domain. The difference matters for one reason: **if work derails the plan halfway through, which domain do you want already finished?**

There's a second rule: **put memorization-heavy domains last.** On AIF-C01, responsible AI and security governance total 28% and read like compliance documentation, which engineers instinctively skim — yet they're pure memorization and the highest return per hour. Schedule them in the two weeks closest to the exam, while recall is freshest.

The third rule comes from the scoring model, and **it differs by certification**. The AWS After Testing policy states:

> The exam uses a **compensatory scoring model**, which means that you do not need to achieve a passing score in each section. You need to pass only the overall exam.

Passing scores are 700 for Foundational, 720 for Associate, and 750 for Professional and Specialty (out of 1,000). Since only the total counts, **a weak domain doesn't need to be brought to full strength**. If the diagnostic shows a 14% domain is especially poor, the right move isn't spending a week repairing it — it's putting that time into the 28% domain, where the same hours return more points.

**The iPAS intermediate exam does not work this way.** Subject 1 and your chosen second subject must **each** reach 70; failing either fails the whole thing. That's conjunctive, not compensatory: the weak subject has to be brought to the threshold, with no room to compensate from the stronger one. Applying the lean-toward-weight strategy here will sink you.

## Step 4: Write Your Stop-Lines in Advance

The last item in the plan isn't the exam. It's the **three lines that decide whether to sit it** — written down before you start studying.

For a five-week plan:

- **Week 4 practice exam below 55%** → the gap is too large; postpone two weeks and rework the two highest-weight domains
- **Week 5 practice exam below 70%** → postpone one week and repair only what the practice exam flagged
- **Week 5 practice exam at or above 80%** → sit it on the original date, and **stop studying**

Why write them in advance: self-assessment three days before an exam is almost always too optimistic. By then you've invested five weeks, and sunk cost pushes you toward sitting it anyway. A number written down beforehand is the only thing that counters that.

The third line matters just as much. Past 80%, more practice questions return very little, and the extra anxiety costs you on exam day.

**Fixed-session certifications need all three lines moved earlier.** iPAS has no "postpone a week" option, so the decision point belongs before the registration deadline: use your practice score then to decide whether to register for that session at all, rather than registering and agonizing afterwards. The fee isn't refundable, but what you save is six months of misplaced expectation.

## Worked Example: A Five-Week AIF-C01 Plan

Combining all four steps, assuming 7 hours a week and an exam date of 9/12:

| Week | Content | Output |
|---|---|---|
| Week 0 | Book the seat and confirm the price → download the exam guide (note the version) → create a free account → **take the 20-question diagnostic** | Gap table across five domains |
| Week 1 | Applications of foundation models (28%) | "Concept → AWS service name" mapping table |
| Week 2 | Generative AI fundamentals (24%) | Mapping table v2 |
| Week 3 | AI/ML fundamentals (20%) + responsible AI (14%) | Terminology cards |
| Week 4 | Security and governance (14%) + full review + **first practice exam** | Weakness list |
| Week 5 | Repair gaps + second practice exam → check against stop-lines → exam | — |

Week 0 puts booking ahead of downloading material because seat availability and price are external conditions — finding a problem a week earlier buys a week to adjust.

That "concept → AWS service name" table deserves a note. Anyone who has already built RAG or LLM applications largely has the conceptual layer of the first two domains; what's missing is the vendor's naming. Managed foundation models are Amazon Bedrock, managed RAG is Bedrock Knowledge Bases, output filtering is Guardrails, bias detection is SageMaker Clarify, drift monitoring is Model Monitor, and human review is Amazon Augmented AI — the last four are named explicitly in the exam guide's responsible AI domain. For those readers, the weekly output should be a mapping table rather than notes: the mode is "I know this one, what does AWS call it," not learning concepts from scratch.

## How Preparation Differs by Vendor

The four steps are universal; each vendor has its own thing to watch.

**AWS**: the official flow is exam guide → free practice questions → fill gaps with courses and labs → Official Pretest. Work through the free tier (20 questions plus a 2-hour course) before deciding whether to subscribe. What separates the three exams is hands-on exposure, not years on a résumé.

**Google (PMLE)**: the main risk isn't difficulty, it's stale material. The certification page states that "This exam was updated to reflect the transition from Vertex AI to Gemini Enterprise Agent Platform," so everything published before mid-2026 uses the old vocabulary — take notes in the new names only. Google also notes that "the exam does not directly assess coding skill," so time belongs on architectural tradeoffs and service selection.

**Microsoft (AI-103)**: the most free coursework of the five (AI-103T00's four learning paths, roughly 29.5 hours) but no free practice assessment, so self-testing means building in Microsoft Foundry yourself. If you plan to go further, AI-500 **requires earning AI-103 first** — they aren't parallel credentials.

**NVIDIA (NCA-GENL)**: 50 questions in 60 minutes, averaging 72 seconds each — this one tests fluency, not depth. The Exam Blueprint maps each topic straight to a training course, making it the most straightforward preparation path of the five: work down the list and tick boxes. One constraint to know upfront, though: the official FAQ states that "NVIDIA certification exams are **pass/fail. You won't receive a score**." There's no score report, so failing leaves you without a weakness breakdown and a second attempt runs on memory alone — which raises the value of diagnosing yourself properly beforehand.

**Databricks**: weight concentrates in application development (30%) and assembling and deploying (22%), so more than half is implementation. Preparation means building one RAG chain end to end on the platform — vector search, model serving, lifecycle management, data governance — rather than reading documentation. The official recommendation is 6+ months of hands-on experience.

**iPAS intermediate**: three characteristics shape preparation. First, complete past papers are public, so diagnose with real questions. Second, subjects 2 and 3 have included **code-interpretation questions** (roughly 25%) since the second 2025 session — a question type where reading isn't the same as knowing; print the snippets and trace the values by hand. Third, check the intermediate subject-exemption rules in the official downloads section before you start: they may remove one subject from your workload entirely.

## Common Mistakes

**Using outdated material.** The most expensive mistake, because you discover it at the test center. Ten minutes comparing service names against the official exam guide beats another hundred practice questions.

**Buying a course before reading the exam guide.** Backwards. Free resources are enough in most cases, and the only thing usually worth paying for is a full-length practice exam.

**Treating years of experience as an eligibility requirement.** The [AWS Before Testing policy](https://aws.amazon.com/certification/policies/before-testing/) states that "All AWS Certifications may be earned without completing specific prerequisites" — the "2 years recommended" lines are difficulty labels, not gates. The reverse also holds: don't skip the diagnostic because your experience looks sufficient on paper.

**Carrying one vendor's retake rule over to another.** Microsoft is 24 hours, AWS is 14 days, Google jumps to 60 days on the second failure, and iPAS is six months. The same shrug — "I'll just take it again" — costs two hundred times more in one case than the other.

**Not checking exam languages.** Language lists can differ between certifications from the same vendor, and reading speed affects the outcome more than an extra week of study.

## Where This Method Stops Working

It allocates time; it doesn't create knowledge. If the diagnostic shows you're unfamiliar with the entire subject area, that isn't a scheduling problem — build hands-on experience first rather than compressing five weeks into three.

That applies doubly to certifications testing operational detail: AWS's MLA-C01 expects you to have used Amazon SageMaker, and the Databricks exam expects you to have deployed on the platform. Grinding question banks to pass one of those has poor returns, and the value of the credential was in that hands-on familiarity to begin with.

## References

- [AWS Certification: After Testing policy (retake waiting period, passing standards, compensatory scoring, score reporting)](https://aws.amazon.com/certification/policies/after-testing/)
- [AWS Certification: Before Testing policy (no prerequisites)](https://aws.amazon.com/certification/policies/before-testing/)
- [AWS Certified AI Practitioner (AIF-C01) certification page](https://aws.amazon.com/certification/certified-ai-practitioner)
- [AIF-C01 official exam guide PDF (Version 1.4, weights of 28/24/20/14/14)](https://d1.awsstatic.com/onedam/marketing-channels/website/aws/en_US/certification/approved/pdfs/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf)
- [AWS MLA-C01 official exam guide PDF](https://d1.awsstatic.com/training-and-certification/docs-machine-learning-engineer-associate/AWS-Certified-Machine-Learning-Engineer-Associate_Exam-Guide.pdf)
- [AWS CLF-C02 official exam guide PDF](https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf)
- [AWS exam preparation overview (free practice question sets and Exam Prep courses)](https://aws.amazon.com/certification/certification-prep/)
- [Google Cloud Exam Terms & Conditions (retake waiting periods of 14 / 60 / 365 days)](https://cloud.google.com/certification/terms)
- [Google Cloud Certification: Retake Policy](https://support.google.com/cloud-certification/answer/9749448)
- [Google Professional ML Engineer official exam guide](https://cloud.google.com/learn/certification/guides/machine-learning-engineer)
- [Microsoft retake policy (24 hours for the first retake, 14 days thereafter, five per year)](https://learn.microsoft.com/en-us/credentials/support/retake-policy)
- [Microsoft AI-103 exam page (practice assessment status, assessed areas)](https://learn.microsoft.com/en-us/credentials/certifications/exams/ai-103/)
- [Microsoft course AI-103T00](https://learn.microsoft.com/en-us/training/courses/ai-103t00/)
- [NVIDIA NCA-GENL certification page (Exam Blueprint)](https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/)
- [NVIDIA Certification FAQ (14-day retake wait, five per year, pass/fail with no score)](https://www.nvidia.com/en-us/learn/certification)
- [Databricks Certified Generative AI Engineer Associate (domain weights)](https://www.databricks.com/learn/certification/genai-engineer-associate)
- [Databricks Certification Terms & Conditions (14-day retake wait, payment each time)](https://www.databricks.com/learn/certification/terms-and-conditions)
- [iPAS AI Application Planner learning resources (past papers and official study guides)](https://ipd.nat.gov.tw/ipas/certification/AIAP/learning-resources) (in Mandarin)
- [iPAS AI Application Planner exam information (sessions, subjects, passing conditions)](https://ipd.nat.gov.tw/ipas/certification/AIAP/exam-info) (in Mandarin)
- [Notice on iPAS intermediate code question weighting](https://ipd.nat.gov.tw/ipas/certification/AIAP/news/ffdba0fcdbda40baadeef2a1bdc0230e) (in Mandarin)

**Related on this site**

- [What AI certifications engineers can take in 2026](/posts/ai/2026-08-06-ai-certifications-2026-fact-check-en)
- [Which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide) (in Mandarin)
