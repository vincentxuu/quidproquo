---
title: "Writing AI Papers and Submitting to arXiv: A Practical Guide to Structure, Experiments, and Conference Strategy"
date: 2026-09-13
category: ai
tags: [arxiv, paper-writing, submission, reproducibility, neurips, reforms, conference-submission, experimental-design, rebuttal, latex]
lang: en
tldr: "A consolidated guide drawing on the arXiv official guidelines, the NeurIPS ML Reproducibility Checklist, the REFORMS framework (8 modules, 32 items), and the preprint policies of five top conferences. Covers paper structure, experimental design red lines, the arXiv submission workflow, and a decision framework for conference vs. direct submission."
description: "Writing an AI paper and getting it on arXiv involves four layers of work: paper structure, experimental design (NeurIPS Checklist + REFORMS), arXiv submission (endorsement, categories, licensing, versioning), and conference strategy (NeurIPS/ICML/ICLR/CVPR/ACL preprint policies, rebuttal, camera-ready). All claims are sourced from official documents."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-09-13-writing-ai-paper-arxiv-submission)

## TL;DR

Writing an AI paper and submitting it to arXiv involves four layers of work, all covered here:

1. **Paper structure** — what each section from Abstract to Limitations should and should not contain
2. **Experimental design** — dual-check with the NeurIPS Reproducibility Checklist (16 items) + REFORMS (8 modules, 32 items)
3. **arXiv submission** — the 2026 endorsement update, category selection, licensing, version management
4. **Conference vs. direct arXiv** — the latest preprint policies of five top conferences and a recommended strategy

Every claim is traceable to an official source. Each section ends with a ready-to-use checklist.

## The Context

You likely have hands-on experience with RAG systems or agents. You've read hundreds of papers. You've started thinking, "This improvement is worth writing up." But between implementation and a submitted paper there's a fuzzy gap — how complete must the experiments be? How many baselines? Should you release code? Which arXiv category?

This is not an academic writing textbook (there are plenty of those). It's a **practical checklist from an AI/ML engineer's perspective**, laying out everything you need to check before you submit.

## Paper Structure: What Each Section Needs (and What to Avoid)

The standard AI/ML paper structure is well-established (all top conference author kits specify it). The common problem isn't a missing section — it's the wrong content inside it.

### Abstract

**Goal**: Let readers decide in 30 seconds whether to read the full paper.  
**Content**: Problem statement → core idea → main results (with numbers) → 1-2 contribution sentences.  
**Pitfalls**:
- Describes the method without reporting results — if you don't tell me how well it works, why should I read on?
- States motivation without the solution — what did you actually do?
- Hyperbolic language ("first-ever", "significant breakthrough") — reviewers will check this against your actual results

### Introduction

**Goal**: Establish that this is a real problem, existing methods fall short, and your approach is both reasonable and effective.  
**Content**: Problem background → limitations of existing work (cited) → your approach in 2-3 sentences → contribution list → paper organization.  
**Pitfalls**:
- Related work content leaking into the Introduction — makes it bloated and hard to read
- Contributions framed as a feature list — "We propose framework X" isn't a contribution; "Framework X beats Z by 5.2% on benchmark Y" is

### Related Work

**Goal**: Position your work in the literature and demonstrate your awareness of the field.  
**Content**: Grouped by topic (not chronological enumeration). Discuss representative methods and their limitations for each group.  
**Pitfalls**:
- Listing without commentary — a reference list disguised as a section, which signals a superficial understanding
- Claiming "nobody has done this" for something that has been published — reviewers in that subfield will catch this immediately

### Method

**Goal**: Enable a graduate student in the field to fully reproduce your approach.  
**Content**: Formal problem definition → model architecture (with diagram) → training objective → inference procedure → key implementation details.  
**Pitfalls**:
- Missing implementation details — learning rate, batch size, optimizer, warmup, dropout are considered "common knowledge" but missing one can cost 3-5 percentage points in reproduction
- Diagrams that are too simple or too complex — a good diagram should convey the architecture even without reading the text

### Experiments

**This is the most critical section and the one with the most problems.**

**Goal**: Prove that your method beats the baselines, and that you understand why.  
**Content**: Setup (datasets, metrics, implementation details) → main results (tables/figures) → analysis (ablation, visualizations, case studies).

**Key results table placement**: The NeurIPS 2026 author kit requires the key results table to **appear in the main paper, not the appendix**. This is common across top conferences — reviewers rarely consult appendices during the rebuttal phase, so a key table hidden in the appendix is effectively absent.

**Pitfalls** (each one is a red flag):
- Baselines more than 2 years old — the field moves fast; stale baselines signal cherry-picking
- Testing only on self-curated datasets — makes fair comparison impossible
- Reporting only the most favorable metric — selective reporting
- No error bars — results could be random noise
- Baselines run with default parameters while your method is carefully tuned — the most common unfair comparison
- Key results table in the appendix — effectively invisible to reviewers

### Limitations

**Goal**: Honestly discuss the boundaries of your method.  
**Content**: Scenarios where performance degrades, theoretical limitations, directions for improvement.  
**Pitfalls**:
- Framing limitations as future work — "Can be applied to domain X" is not a limitation
- Omitting the section entirely — this has become a red flag; reviewers will question your self-awareness

### Broader Impact

Required by NeurIPS since 2020. **Goal**: Discuss potential positive and negative societal impacts.  
**Content**: Potential for misuse, bias issues, environmental costs.  
**Pitfalls**:
- Only listing positives — signals superficial consideration
- Vague generic statements — "May impact society" is as good as saying nothing

## Experimental Design Standards: Two Checklists You Must Run

### NeurIPS ML Reproducibility Checklist

Required since 2022. The 2026 version has evolved into 16 **conditional questions** (each answer may reveal follow-up items):

| Area | Key Questions |
|------|---------------|
| **Data preparation** | Does the dataset have a persistent identifier? Standard benchmark or custom? Is the train/val/test split fully described? |
| **Code** | Is the code released? Can a commit hash or DOI pin the exact version? Does the README include complete reproduction steps? |
| **Hardware and environment** | Are GPU model, RAM, OS, and package versions disclosed? Is a reproduction script provided? |
| **Compute cost** | Are training duration and total compute reported? |
| **Experimental setup** | Is the hyperparameter search range and final values reported? How many random seeds? Are error bars or confidence intervals provided? |
| **Baseline comparison** | Are baselines recent (12-18 months)? Were they re-run or copied from another paper? Is the compute budget comparable? |
| **Ablation** | Is every key component ablated? |
| **Data leakage** | Was train-test separation enforced before preprocessing? Are there dependent samples (e.g., multiple records per patient) between splits? Is every feature legitimate (not a proxy for the outcome)? |
| **Limitations** | Are failure cases shown? Are limitations honestly discussed? |

The full checklist is at the [NeurIPS Paper Checklist Guidelines](https://neurips.cc/publication/PaperChecklistGuidelines). Answer every question before submission; don't just tick the box.

### REFORMS Framework (arXiv:2308.07832)

REFORMS (Reporting Standards for ML Based Science) was developed by 19 researchers at Princeton and published in *Science Advances* in 2024 (DOI: 10.1126/sciadv.adk3452). It targets **ML applied to scientific discovery** (not pure methodology papers). It has 8 modules and 32 items:

**Module 1: Study Goals (3 items)**
- 1a: Population or distribution about which the scientific claim is made
- 1b: Motivation for choosing this population
- 1c: Motivation for using ML methods in the study

**Module 2: Computational Reproducibility (5 items)**
- 2a: Permanent link or DOI to the exact dataset version
- 2b: Commit tag or DOI for the code
- 2c: Computing infrastructure (hardware, OS, package versions)
- 2d: README with complete reproduction steps
- 2e: Reproduction script that produces all results

**Module 3: Data Quality (7 items)**
- 3a: Data source details (time period, location, collection/annotation process)
- 3b: Sampling frame and method
- 3c: Justification for why this dataset suits the modeling task
- 3d: Outcome variable definition and descriptive statistics
- 3e: Sample counts (total + per class)
- 3f: Missing data percentage (stratified by class)
- 3g: Whether the evaluation dataset is representative of the population

**Module 4: Data Preprocessing (3 items)**
- 4a: Excluded data and rationale
- 4b: How impossible or corrupted samples are handled
- 4c: Complete sequence of all data transformations (imputation, normalization, augmentation) — **data-dependent transformations must be done after splitting**

**Module 5: Modeling (6 items)**
- 5a: Model description (inputs, outputs, type, loss function)
- 5b: Justification for the chosen model type
- 5c: Evaluation method (cross-validation, held-out, external)
- 5d: Model selection method
- 5e: Hyperparameter selection (search range + final values)
- 5f: Whether baselines are appropriate and fairly tuned

**Module 6: Data Leakage (3 items)**
- 6a: Whether train-test separation is maintained (preprocessing and modeling use only training data)
- 6b: Whether there are dependencies or duplicates between train and test sets
- 6c: Whether each feature is legitimate for the task, not a proxy for the outcome

**Module 7: Metrics and Uncertainty (3 items)**
- 7a: All performance metrics used, including intermediate decision metrics
- 7b: Uncertainty estimates for each metric (standard deviation, CI, bootstrap)
- 7c: Justification for statistical tests (if used)

**Module 8: Generalizability and Limitations (2 items)**
- 8a: External validation results (or acknowledgment of absence)
- 8b: Contexts in which findings are not expected to hold

The full REFORMS checklist is at [reforms.cs.princeton.edu](https://reforms.cs.princeton.edu).

### Using Both Checklists Together

The NeurIPS Checklist is your **minimum bar** — answer every question before submitting. REFORMS is a more detailed scientific reporting standard. If your paper is about ML applied to scientific discovery (rather than pure methodology), run both.

**Practical advice**: Start with the NeurIPS 16 questions to catch basic gaps, then use the REFORMS 8 modules for depth. If more than 3 items remain unchecked (per CodeSOTA's recommendation), treat the results as "preliminary and unverified."

## arXiv Submission: From Endorsement to Versioning

### Endorsement: The 2026 Update

arXiv has required endorsement for first-time submitters since 2004. On January 21, 2026, arXiv [updated the policy](https://blog.arxiv.org/2026/01/21/attention-authors-updated-endorsement-policy/): **an institutional email alone is no longer sufficient**.

New submitters now need one of the following:
1. **Institutional email + prior authorship in the same domain**: Both an academic/research email address AND a record of co-authorship on an existing arXiv paper in the same domain (claimed through the arXiv authority system)
2. **Personal endorsement**: An endorsement from an active arXiv author in the same domain, who must have a paper in that domain from 3 months to 5 years ago

For graduate students, the easiest path is to ask your advisor — as long as they have a paper in the relevant domain on arXiv.

Endorsement is **domain-specific** — an endorsement in cs does not apply to math.

### Category Selection

arXiv categories are hierarchical: major (cs, math, stat) → subcategories. AI/ML-related subcategories:

| Category | Best for |
|----------|----------|
| cs.AI | Expert systems, knowledge representation, planning, uncertainty in AI |
| cs.LG | Supervised/unsupervised/reinforcement learning, bandits, explainability, fairness, methodology |
| cs.CL | Natural language processing, language models, text processing |
| cs.CV | Computer vision |
| cs.IR | Information retrieval (including RAG) |
| cs.MA | Multi-agent systems |
| cs.RO | Robotics |
| stat.ML | Machine learning from a statistical perspective |

**Recommendation**: Choose one primary category and cross-list 2-3 related ones. Moderators may reclassify if they deem the category inappropriate (being moved to `cs.general` is considered a downgrade in the community).

### License Selection

arXiv offers several license options. The choice is **irrevocable**:

| License | When to Use |
|---------|-------------|
| arXiv non-exclusive license 1.0 | Safest default |
| CC BY 4.0 | Accepted by many publishers for preprints |
| CC BY-NC-SA 4.0 | Non-commercial use, share-alike for derivatives |
| CC BY-NC-ND 4.0 | Common for accepted manuscripts under embargo |
| CC0 (Public Domain) | Conflicts with most publishers' copyright transfer |

**Practical advice**: Most people use the arXiv non-exclusive license. If you're also submitting to a conference, check their preprint license requirements first.

### Version Management

| Operation | Rule |
|-----------|------|
| Replacement | Maximum once per week |
| After v5 | Still once per week, but no longer in daily email announcements |
| Same-day edits | Before 14:00 ET: no new version; after 14:00: announcement delayed |
| Withdrawal | Creates a "withdrawn" version; previous versions remain publicly accessible; no PDF download |
| Journal-ref | Add a journal DOI after acceptance (no new version needed) |

### Common Moderation Rejection Reasons

arXiv moderators are volunteer domain experts with terminal degrees. About 6% of submissions are held and about 2% are rejected ([Scientific American](https://www.scientificamerican.com/article/arxiv-org-reaches-a-milestone-and-a-reckoning)). Common reasons:

- Format violations (line numbers, watermarks, ads, margin notes, referee remarks)
- Non-scholarly content (coursework, project proposals, news commentary)
- Plagiarism or falsified data
- Offensive images (violence, pornography, the controversial "Lena" image)
- Undisclosed significant generative AI use
- AI listed as an author
- Excessive submission rate (max 3 per day)
- Copyright conflicts (copyright statements prohibiting arXiv distribution)

### HTML Generation

Since December 2023, arXiv auto-generates HTML versions for all TeX/LaTeX submissions (using NIST's LaTeXML). HTML offers far better readability and accessibility than PDF.

**Author recommendations**: Use LaTeXML-supported packages ([GitHub list](https://github.com/dginev/LaTeXML-packages)), avoid packages with limited support like tikz, add `alt` text to images, and set Overleaf's compiler to "stop on errors."

## Conference Submission vs. Direct arXiv: Policy Differences Across Five Top Venues

This is one of the most confusing questions for first-time submitters. arXiv cannot replace conferences, and conferences should not replace arXiv. All top conferences now allow arXiv preprints alongside submissions, but with varying restrictions.

### 2024-2026 Preprint Policy Comparison

| Aspect | NeurIPS | ICML | ICLR | CVPR | ACL |
|--------|---------|------|------|------|-----|
| arXiv during review? | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes, **anonymity period eliminated since 2024** |
| Advertising restriction | Cannot mark "Under review at NeurIPS" | Strictest — "under no circumstances" may advertise | Most permissive — OpenReview open discussion | Media embargo | No additional restrictions |
| Double-blind impact | Reviewers instructed not to search | Submission version must not cite non-anonymous version | Third-person self-citation OK | arXiv not considered prior art | Reviewers must disclose outside knowledge |
| Camera-ready | +1 page allowed | +1 page allowed | Same page limit | 2026: 2-week embargo | Footnote prior preprints |

**Key update**: ACL made a major change in January 2024 — **completely eliminated the anonymity period**. Authors can post non-anonymous preprints at any time. Reviewers must disclose outside knowledge, and tie-breaking favors anonymous submissions. This is currently the most open policy.

### arXiv vs. Conference Timeline

| Dimension | Conference | arXiv |
|-----------|------------|-------|
| Speed | 4-6 months | 1-3 business days (median 1 day) |
| Speed ratio | — | ~100-150x faster |
| Citation effect | Proceedings have higher median citations | Early arXiv posting can yield +65% more citations (Feldman et al., 2018) |
| Peer review | ~25% of seeded major errors detected (Godlee et al., 1998) | None |

### Recommended Strategy: Simultaneous Submission

For most papers, the optimal strategy is **simultaneous** conference + arXiv submission:

```
Day 0:       Submit to conference + post arXiv v1 (same version, anonymized for double-blind)
Review:      Incorporate community feedback → arXiv v2
Rebuttal:    Address reviewer concerns → arXiv v3 (if timing allows)
Acceptance:  Post camera-ready as final arXiv version (respect embargo)
Post:        Add conference DOI to arXiv Comments field
```

**arXiv's timestamp provides effective scooping protection**. The SiLU function (2016 arXiv) vs. Swish (2017 Google) is a classic case — the arXiv timestamp established priority (Paul Ginsparg).

### When to Only Post to arXiv

- Research that needs rapid dissemination (security flaws, new benchmarks, negative results)
- Missed conference deadlines
- Work that is a survey, replication, or preliminary study
- No career dependency on formal publication

## Rebuttal: Practical Principles for Responding to Reviewers

Conference rebuttals typically happen within a week of receiving reviews, with character limits (NeurIPS: per-reviewer limits; ICML: 5000 total). The principles below are drawn from official conference guidelines and experienced researchers' practical advice.

### Structure

```
All comments from Reviewer X
└─ Q1: "Unclear design choice for Y"
   └─ Thank the reviewer → clarify the original design, reference paper sections
   └─ (If necessary) add supplementary experimental results
└─ Q2: "Why not compare with Z"
   └─ Acknowledge this as a good suggestion → explain Z's applicability differences
   └─ (If time permits) add the experiment
```

**Core principles** (summarized from Niklas Elmqvist, Matt Might, and others):
- **Respond to every comment** — skipping one guarantees the reviewer will flag it
- **Don't fight the reviewer** — "You're wrong, our paper explains this clearly" is a disaster in a rebuttal
- **Distinguish clarify from experiments** — when misunderstood, prioritize clarification; when experiments are needed, be honest about whether you can complete them within the rebuttal window and commit to adding them in camera-ready
- **Don't overstate** — "We've completely solved this problem" will make the reviewer feel you didn't understand their criticism

## Camera-Ready Preparation

You typically have 3-5 weeks between acceptance and the camera-ready deadline. Main tasks:

- **Page limit**: NeurIPS/ICML allow +1 page; ICLR same as submission
- **Author list**: Restore from the anonymous version (some conferences restrict additions, e.g., CVPR 2026 allows at most 1 new author)
- **NeurIPS Checklist**: Upload alongside the main paper
- **Video**: ICLR and some others require a 5-minute presentation video
- **Code submission**: Some conferences encourage or require code
- **Syncing with arXiv**: Push the camera-ready version to arXiv — watch for any embargo period

## Putting It All Together

Writing an AI paper and successfully submitting it is a multi-stage engineering process. Each step — structure, experiments, review, versioning — has its own specification. The most efficient strategy is to align all checklists **before** you start writing, rather than going back to fill gaps after the paper is drafted.

The core proposition: **The NeurIPS Reproducibility Checklist is your minimum bar, REFORMS is your deep check, the arXiv official docs are your submission manual, and the conference policies are your strategic framework** — all four are indispensable.

## References

### arXiv Official Documents
- [The arXiv endorsement system](https://info.arxiv.org/help/endorsement.html)
- [Attention Authors: updated endorsement policy (Jan 2026)](https://blog.arxiv.org/2026/01/21/attention-authors-updated-endorsement-policy/)
- [arXiv Category Taxonomy](https://arxiv.org/category_taxonomy)
- [arXiv License Information](https://info.arxiv.org/help/license/index.html)
- [Submission Version Availability](https://info.arxiv.org/help/versions.html)
- [To replace an article](https://info.arxiv.org/help/replace.html)
- [Withdrawing an article](https://info.arxiv.org/help/withdraw.html)
- [arXiv moderation](https://info.arxiv.org/help/moderation/index.html)
- [LaTeX Markup Best Practices for Successful HTML Papers](https://info.arxiv.org/help/submit_latex_best_practices.html)
- [HTML papers on arXiv: why it's important, and how we made it happen (Feb 2024)](https://arxiv.org/html/2402.08954v1)

### Reproducibility and Reporting Standards
- [NeurIPS Paper Checklist Guidelines](https://neurips.cc/publication/PaperChecklistGuidelines)
- [REFORMS: Reporting Standards for ML Based Science (arXiv:2308.07832, Science Advances 2024)](https://arxiv.org/abs/2308.07832)
- [REFORMS Official Website](https://reforms.cs.princeton.edu)
- [ML Reproducibility Checklist 2026 (NeurIPS)](https://arxiv.org/html/2605.17273v1)
- [Questionable Practices in Machine Learning (arXiv 2407.12220)](https://arxiv.org/pdf/2407.12220v1)
- [Princeton Reproducibility Crisis in ML-based Science](https://reproducible.cs.princeton.edu)
- [CodeSOTA — How to Read an ML Paper](https://www.codesota.com/guides/reading-ml-papers)

### Conference Submission Policies
- [NeurIPS Call for Papers 2026](https://neurips.cc/Conferences/2026/MainTrackHandbook)
- [ICML 2026 Author Instructions](https://icml.cc/Conferences/2026/AuthorInstructions)
- [ICLR 2026 Author Guide](https://iclr.cc/Conferences/2026/CallForPapers)
- [CVPR 2026 Author Guidelines](https://cvpr.thecvf.com/Conferences/2026/AuthorGuidelines)
- [ACL Anonymity Policy (2024 Revision)](https://www.aclweb.org/adminwiki/index.php/ACL_Anonymity_Policy)

### Citation Impact and Conference vs. arXiv Research
- [Feldman, Lo, Ammar (2018) — 65% citation advantage for arXiv-first (arXiv:1805.05238)](https://arxiv.org/abs/1805.05238)
- [Elazar et al. (2024) — Causal effect of arXiving on acceptance <4% (arXiv:2306.13891)](https://arxiv.org/abs/2306.13891)
- [Mishkin, Tabb, Matas (2020) — arXiving helps everyone (arXiv:2010.05365)](https://arxiv.org/abs/2010.05365)
- [Gloire & Mitra (2026) — LLM de-anonymization 42% accuracy (arXiv:2608.05157)](https://arxiv.org/abs/2608.05157)

### Rebuttal and Writing Guides
- [How to Read a Paper — S. Keshav (ACM SIGCOMM CCR, 2007)](http://ccr.sigcomm.org/online/files/p83-keshavA.pdf)
- [Ten Simple Rules for Writing a Response to Reviewers — William Stafford Noble (PLOS CB, 2017)](https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005730)
- [Writing Rebuttals — Niklas Elmqvist (Medium, 2016)](https://medium.com/@elmqvist/writing-rebuttals-bb73e5f44a6e)
- [How to Write a Rebuttal Letter — Matt Might](http://matt.might.net/articles/how-to-rebut/)
- [Site: How to Read arXiv Papers: Methodology and Tool Landscape](/en/posts/ai/2026-05-23-how-to-read-arxiv-papers)
- [Site: arXiv Paper Quality Assessment Guide](/en/posts/ai/2026-05-28-arxiv-paper-quality-guide)
- [Site: How Others Use LLMs for Writing](/posts/ai/2026-05-10-llm-writing-pipeline-learnings) (zh-TW only)