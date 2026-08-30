---
title: "Main Track, Findings, and D&B Track: Three Publication Routes at Top AI Conferences"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, peer-review, neurips, acl, findings-track, datasets-benchmarks]
lang: en
tldr: "A paper submitted to a major conference can follow three very different routes: the Main Track is the highest-threshold formal publication, Findings is the ACL family's companion venue for solid work that misses the main program, and NeurIPS created the D&B Track specifically for datasets and evaluation methodology. Their review standards, prestige, and career signals differ enough that understanding the route matters before writing the paper."
description: "A guide to two alternatives to the Main Track at top AI conferences: ACL and EMNLP Findings, and the NeurIPS Datasets & Benchmarks Track. It covers why they were created, review standards, acceptance-rate trends, prestige differences, the role of workshop papers, and a framework for choosing where to submit."
draft: false
series:
  name: "AI 頂會導讀"
  order: 2
glossary:
  - term: "Findings"
    definition: "A companion publication created by ACL, EMNLP, and NAACL in 2020 for papers judged solid but below the Main Track threshold. Papers receive full peer review, but carry less prestige than Main Track publications."
    context: "The second section explains why Findings was created and how its acceptance rate has changed."
  - term: "D&B Track"
    definition: "The NeurIPS Datasets and Benchmarks track, created in 2021 for papers on datasets, benchmarks, and evaluation methodology. It permits single-blind submissions."
    context: "The third section explains the D&B Track's review criteria and evolving prestige."
  - term: "Area Chair (AC)"
    definition: "The middle-layer gatekeeper who synthesizes reviews, writes the meta-review, and recommends acceptance or rejection. Senior Area Chairs (SACs) and Program Chairs (PCs) sit above the AC."
    context: "Main Track and D&B Track use the same hierarchical AC review structure."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-tracks-main-findings-db)

> 🌏 Series: [What Is a Top AI Conference?](/posts/ai/2026-08-23-what-is-ai-top-conference-en) (Part 0) → this article (Part 1)

The [previous article](/posts/ai/2026-08-23-what-is-ai-top-conference-en) explained how three independent ranking systems sustain the label "top AI conference." Knowing which conferences qualify is not enough. Within a single conference, publication routes form a visible prestige hierarchy. A NeurIPS Main Track paper and a NeurIPS D&B paper send different signals to academics. An ACL Main Track paper and a Findings paper also carry different weight on a CV.

This article examines the three major routes—Main Track, Findings, and D&B Track—and positions workshop papers alongside them, so authors can decide where their work belongs before submitting.

## Main Track: The Only Default Route

The Main Track is the core program shared by every top AI conference and the most prestigious publication route. Whether the venue is NeurIPS, ICML, ICLR, ACL, EMNLP, or CVPR, "top-conference paper" means a Main Track paper unless someone says otherwise.

**Review:** Double-blind review, independent scores from three or four reviewers, an author rebuttal, and an Area Chair meta-review leading to the decision. The NeurIPS 2025 Main Track used 20,518 reviewers, 1,663 ACs, and 199 SACs.

**Acceptance rate:** Over the last five years, major Main Tracks have generally accepted 20-27% of submissions, with a systematic gap across conference families. The three major ML venues—NeurIPS, ICML, and ICLR—remain near 25-27%, while the two major NLP venues, ACL and EMNLP, sit lower at 19-22%. Nikos Aletras, an NLP professor at the University of Sheffield, publicly noted in 2026 that NLP acceptance rates run five to eight percentage points below ML rates. He argued that the gap more often pushes adequately scored NLP papers out of the main program and into Findings.

**Prestige:** Main Track ranks highest. NeurIPS, ICML, and ICLR further distinguish Oral, roughly the top 1-3%, from Spotlight, roughly the top 3-5%, and Poster, the remaining accepted papers. An Oral is a career-milestone result; receiving even a few over an entire research career is exceptional. ACL and EMNLP do not use an Oral/Spotlight hierarchy: Main Track acceptance is simply Main Track acceptance.

## Findings: The ACL Family's "Solid but Not Main Track" Companion

The ACL conference family—ACL, EMNLP, and NAACL—introduced Findings in 2020 under the formal name "Findings of the Association for Computational Linguistics." The first volume appeared with EMNLP 2020.

### Why Findings Exists

Submission volume exploded: ACL grew from 1,045 submissions in 2018 to 12,148 in 2026, an increase of 1,063% in eight years. That left many sound papers without a home after a hard cutoff near a 20% acceptance rate. The EMNLP 2020 Program Chairs defined Findings as work "not accepted for publication in the main conference, but nonetheless ... assessed by the programme committee as solid work with sufficient substance, quality and novelty to warrant publication."

In plain terms, reviewers do not think the paper deserves rejection, but limited space keeps it out of the main program, so Findings provides a formal publication outlet.

### Findings Acceptance-Rate Trends

The rates have moved considerably as ACL's community continues to define the venue.

**ACL Findings**

| Year | Submissions | Findings acceptances | Rate |
|---|---|---|---|
| 2021 | 3,350 | 361 | 10.8% |
| 2022 | 3,378 | 331 | 9.8% |
| 2023 | 4,864 | 901 | 18.5% |
| 2024 | 4,407 | 976 | 22.2% |
| 2025 | 8,360 | 1,392 | 16.7% |
| 2026 | 12,148 | 2,164 | 17.8% |

**EMNLP Findings**

| Year | Submissions | Findings acceptances | Rate |
|---|---|---|---|
| 2020 | 3,359 | 447 | 13.3% |
| 2021 | 3,600 | 419 | 11.6% |
| 2022 | 4,190 | 549 | 13.1% |
| 2023 | 4,909 | 1,060 | 21.6% |
| 2024 | 6,105 | 1,029 | 16.9% |
| 2025 | 8,174 | 1,418 | 17.4% |

(Submission totals refer to original ARR submissions, not the number committed to a particular conference. Sources: OpenAccept.org and CS Conf Stats.)

Two trends stand out. First, Findings expanded sharply around 2023: ACL rose from 9.8% to 18.5%, while EMNLP rose from 13.1% to 21.6%. Second, the combined Main Track plus Findings "total acceptance rate" has approached 35-40%. Roughly one in three submissions to ACL or EMNLP now appears in some form.

### The Prestige Gap Between Findings and Main Track

This is the most sensitive and practical question. The prevailing community view is:

- **Is it a formal publication? Yes.** Findings papers receive full peer review, have DOIs, appear in the ACL Anthology, are indexed by Google Scholar and Semantic Scholar, and can be cited normally.
- **Is it as prestigious as Main Track? No.** That is the instinctive answer for most academics. Findings inherently signals that the paper missed the main program. It is not an independent submission venue, but a product of the Main Track review process.
- **Is the work necessarily worse by citation impact? No.** Reviewers have noted publicly that the best Findings papers by citation count often outperform papers in the lower half of the Main Track. Some land in Findings because reviewers disagreed sharply and novelty that "breaks new ground" worked against them.
- **How do universities count it? It varies.** Some Chinese universities classify Findings as CCF-B or lower rather than giving it the Main Track's CCF-A credit. There is no universal conversion.

**Practical advice:** If your goal is a PhD graduation requirement or faculty review, check whether the target institution counts Findings and Main Track equally. On a job CV, write "Findings of ACL" or "Findings of EMNLP" explicitly rather than the ambiguous "ACL 2024." Experienced recruiters can tell, and ambiguity can count against you.

## D&B Track: NeurIPS's Dedicated Route for Datasets and Evaluation

NeurIPS created the Datasets and Benchmarks (D&B) Track in 2021 for a very different reason. Findings addresses scarce Main Track capacity; D&B addresses review criteria that do not fit papers devoted to datasets or evaluation.

### Why Main Track Review Struggles with Dataset Papers

Traditional Main Track criteria center on new methods, new models, and state-of-the-art results. A paper contributing a high-quality dataset or evaluation method without a new algorithm can be rejected for "no algorithmic contribution," even if the dataset later receives thousands of citations. ImageNet was itself a CVPR 2009 paper. Judged today as "only a dataset" under a NeurIPS Main Track frame, its outcome might be less favorable.

The official NeurIPS 2026 D&B reviewer guidelines explicitly state that "pure-benchmark/pure-evaluation-methodology papers are in scope" and that "Beating a baseline is not required." Neither sentence fits traditional Main Track review culture.

### D&B Growth and Evolving Prestige

D&B submissions have grown faster than Main Track volume, reflecting stronger consensus that datasets and evaluation deserve serious treatment:

| Year | D&B submissions | D&B acceptances | D&B rate | Main Track rate |
|---|---|---|---|---|
| 2021 | 484 | 174 | 36.0% | 25.6% |
| 2022 | 447 | — | — | 25.7% |
| 2023 | 987 | — | — | 26.1% |
| 2024 | 1,820 | ~460 | 25.3% | 25.8% |
| 2025 | 1,995 | — | — | 24.5% |

(The 2021 acceptance count comes from the official NeurIPS accepted-papers page; the 2024 rate comes from the official D&B Chairs blog. NeurIPS did not publish separate acceptance counts for 2022, 2023, or 2025.)

Several changes matter:

1. **Submissions rose from 484 to 1,995, a 312% increase in four years**, much faster than the Main Track's 136% growth over the same period.
2. **The acceptance rate is converging with Main Track.** D&B accepted 25.3% in 2024, nearly identical to Main Track's 25.8%. The D&B Chairs wrote in the official 2025 blog that this was deliberate alignment: D&B papers should face the same rigor as Main Track papers.
3. **Since 2022, D&B papers have appeared directly in the main NeurIPS Proceedings**, rather than a separate companion volume. The publication format no longer separates them from Main Track papers.
4. **D&B has had its own Best Paper Award** since its first year in 2021.

**Prestige assessment:** D&B is still generally regarded as less prestigious than Main Track. That community instinct will not disappear quickly, but the gap is narrowing. The Chairs' strategy is clear: align review rigor, merge publication formats, and equalize acceptance rates to erode the "second-class" label. The NeurIPS 2024 CFP even asks, "My work is in scope for this track but possibly also for the main conference. Where should I submit it?" NeurIPS itself recognizes a gray area that authors must navigate.

## Workshop Papers: Do Not Confuse Them with the Other Three Routes

Workshop papers operate at a different level from Main Track, Findings, and D&B. Because they appear at the same conference and carry its name, outsiders—including VCs, recruiters, and non-academic readers—often confuse them.

| | Main Track | Findings | D&B Track | Workshop |
|---|---|---|---|---|
| Review rigor | Highest: double-blind, 3-4 reviewers, AC/SAC/PC tiers | Same Main Track process; a byproduct of it | High; aligned with Main Track since 2024 | Low; usually 1-2 reviewers, sometimes abstract only |
| Acceptance rate | 20-27% | 10-22% | 25-36% | 40-60%+ |
| Work cycle | 5-6 months | Same as Main Track; no initial routing | 5-6 months | 3-4 weeks |
| Publication | Formal Proceedings | Formal ACL Anthology volume | Formal NeurIPS Proceedings | Usually informal; some appear in PMLR |
| Length | 8-10 pages | Same as Main Track | 8-10 pages | 4-6 pages, often an extended abstract |
| Anonymous? | Double-blind | Double-blind | May be single-blind | Usually not required |

**Prestige order** by academic consensus: Main Track >> D&B Track ≥ Findings >> Workshop.

An industry observer summarized the distinction accurately: "VCs and recruiters seem unaware that a NeurIPS workshop paper is not the same as a NeurIPS main conference paper. Workshop = 3-4 weeks of work, 20-40% rejection rate. Main conf = 5-6 months of work, 70-80% rejection rate." Listing a workshop paper beside a Main Track paper without identifying it looks like padding to an experienced recruiter.

**The real value of workshops:** A workshop paper is not an "inferior paper." Workshops were not designed to compete with the Main Track. They showcase exploratory work—early ideas, work in progress, and cross-disciplinary projects. The threshold is intentionally lower to build a community, not to gatekeep. For a PhD student, a workshop paper is an early signal that "you are doing research," not a milestone proving a major contribution. Those roles are compatible, but they are not the same.

## Which Route Fits a Paper?

Authors cannot choose every route. Findings is assigned by an AC after Main Track review, not selected at submission. Choosing Main Track versus D&B or Main Track versus Workshop, however, requires an active decision.

1. **What is the central contribution?** A new algorithm, model, or theory points to Main Track. A new dataset, evaluation method, or systematic analysis of an existing benchmark suggests D&B at NeurIPS. An early idea, preliminary result, or interdisciplinary exploration fits a Workshop.
2. **How complete is the paper?** Main Track and D&B both require a complete 8-10 page paper, full experiments, and complete related work. Preliminary results or a proof of concept fit a Workshop better.
3. **What is the goal?** For PhD requirements, verify whether the institution counts D&B or Findings. For employment, Main Track sends the strongest signal, followed by D&B, Findings, and Workshop. For community building, collaborators, or feedback on an early idea, Workshops exist for precisely that purpose.
4. **Is the paper in scope for both NeurIPS D&B and Main Track?** NeurIPS advises authors to consider which track is more likely to review the work fairly. A dataset paper may lose points from a Main Track reviewer for "no new method"; a D&B reviewer will not apply that criterion.

**One important trap:** ACL and EMNLP authors cannot choose Findings. They submit to the Main Track, then an AC may "route down" the paper to Findings. Its denominator is therefore every Main Track submission, including papers eventually accepted there, not a population submitted specifically to Findings. A 17% Findings rate and a 20% Main Track rate should not be treated as independent rates. They share one submission pool; together, they mean 37% of submissions appeared in some form.

## Overall

Prestige within a single top conference is more finely layered than most outsiders assume. Main Track is the only default route. Findings is the ACL family's formal companion publication for solid papers displaced by limited Main Track capacity: quality is assured, but prestige is lower. The NeurIPS D&B Track gives datasets and evaluation methodology a fair review and is rapidly converging with Main Track without yet becoming equivalent. Workshops occupy an entirely different tier and should not be conflated with the other three.

Authors should understand these routes—especially how a target institution counts them—before writing the paper, not after submitting to the wrong one.

---

## References

- [EMNLP 2020 Findings launch announcement (reported by Paper Digest)](https://www.paperdigest.org/2020/11/emnlp-2020-findings-track-highlights)
- [EMNLP 2024 official acceptance-rate methodology and Findings definition](https://2024.emnlp.org/program/)
- [NeurIPS Blog — Reflecting on the 2025 Review Process from the Datasets and Benchmarks Chairs](https://blog.neurips.cc/2025/09/30/reflecting-on-the-2025-review-process-from-the-datasets-and-benchmarks-chairs)
- [NeurIPS Blog — Datasets & Benchmarks Track: From Art to Science in AI Evaluations](https://blog.neurips.cc/2025/12/05/neurips-datasets-benchmarks-track-from-art-to-science-in-ai-evaluations)
- [NeurIPS Blog — Reflections on the NeurIPS 2023 Ethics Review Process (2022/2023 D&B submissions: 447/976)](https://blog.neurips.cc/2023/12/09/reflections-on-the-neurips-2023-ethics-review-process/)
- [NeurIPS 2021 Datasets and Benchmarks Accepted Papers (484 submissions, 174 acceptances)](https://nips.cc/Conferences/2021/DatasetsBenchmarks/AcceptedPapers)
- [NeurIPS 2025 Datasets & Benchmarks Track Call for Papers](https://neurips.cc/Conferences/2025/CallForDatasetsBenchmarks)
- [NeurIPS 2024 Call For Datasets & Benchmarks (FAQ on choosing D&B or Main Track)](https://neurips.cc/Conferences/2024/CallForDatasetsBenchmarks)
- [OpenAccept.org — Historical ACL submission and acceptance data](https://openaccept.org/c/ai/acl)
- [OpenAccept.org — Historical EMNLP submission and acceptance data](https://openaccept.org/c/ai/emnlp)
- [CS Conf Stats — Historical ACL data](https://csconfstats.xoveexu.com/conferences/acl)
- [CS Conf Stats — Historical EMNLP data](https://csconfstats.xoveexu.com/conferences/emnlp)
- [ACL Wiki — Conference acceptance rates, including Findings routing](https://www.aclweb.org/aclwiki/Conference_acceptance_rates)
- [GitHub lixin4ever/Conference-Acceptance-Rate (annual ACL/EMNLP Findings data)](https://github.com/lixin4ever/conference-acceptance-rate)
- [Nikos Aletras (2026) — Public comment on systematically lower NLP acceptance rates](https://www.linkedin.com/posts/nikos-aletras-6b797422_i-find-really-bizarre-that-main-conference-activity-7450524387339907072-b1a6)
- [Abhishek Divekar — Public comment on Workshop versus Main Conference prestige](https://www.linkedin.com/posts/ardivekar_vcs-and-recruiters-seem-unaware-that-a-neurips-activity-7452849973957832704--xky)
- [NeurIPS Proceedings homepage (D&B joined the main proceedings in 2022)](https://papers.nips.cc)
- [NeurIPS Blog — Announcing the NeurIPS 2022 Datasets & Benchmarks Track](https://blog.neurips.cc/tag/datasets)
