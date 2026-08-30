---
title: "What Happens to a Top-Conference Paper from Submission to Publication"
date: 2026-08-24
category: ai
type: guide
tags: [ai-conference, peer-review, openreview, submission, rebuttal]
lang: en
tldr: "An AI conference paper passes through anonymized submission, format screening, reviewer bidding and assignment, independent scores from 3-4 reviewers, an author rebuttal, AC/SAC/PC decisions, and camera-ready revision—a process lasting about 4-5 months. ACL-family conferences add ARR's rolling-review model, in which review comes before the author commits the paper to a venue."
description: "A step-by-step guide to top AI conference review: anonymization, desk rejection, reviewer matching through bidding, TPMS, and COI rules, the different NeurIPS, ICML, and ICLR rating scales, the roughly 20% of borderline acceptances helped by rebuttal, AC/SAC/PC decisions, camera-ready revision, and ACL Rolling Review. Includes full timelines for major conferences."
draft: false
series:
  name: "AI 頂會導讀"
  order: 3
glossary:
  - term: "Area Chair (AC)"
    definition: "A senior researcher responsible for a group of papers who synthesizes reviewer comments and the author rebuttal into a meta-review and an initial accept-or-reject recommendation."
    context: "The AC is the pivotal middle layer of review: reviewers offer assessments, while the AC makes a judgment."
  - term: "desk rejection"
    definition: "Rejection before a paper is assigned to reviewers, usually for formatting violations, exceeding the page limit, breaking double-blind rules, or falling outside the conference's scope."
    context: "A NeurIPS 2020 experiment found that about 6% of desk-rejected papers would have been accepted after full review, prompting the conference to eliminate subjective desk rejection."
  - term: "TPMS"
    definition: "The Toronto Paper Matching System, an automated assignment system that measures semantic similarity between a submitted paper and a reviewer's past publications."
    context: "Combining reviewer bids with TPMS matching scores is now standard practice for reviewer assignment at major conferences."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-submission-to-publication)

> This is Part 3 of the [AI Top Conference Guide](/posts/ai/2026-08-23-what-is-ai-top-conference-en) series. The previous article explained how a conference earns "top" status and introduced the major venues. This one follows a paper from the moment its authors press submit to final publication.

The previous article compressed review into four steps: submission → review → rebuttal → decision. The real process is much more intricate. Every stage brings specific rules, deadline pressure, and opportunities for mistakes. This guide unpacks each stage using the actual 2025-2026 processes at NeurIPS, ICML, ICLR, and CVPR.

## Step 1: Submission

### Anonymization Rules

Nearly every top AI conference uses **double-blind review**: authors do not know the reviewers, and reviewers do not know the authors. A submission must remove every detail that could identify its authors, including names, affiliations, acknowledgments, institutional names in demo videos, and non-anonymized paths in supplementary material.

The CVPR 2026 author guide states: "Do not provide information that may identify the authors in the acknowledgments (e.g., co-workers and grant IDs) nor in the supplementary material (e.g., author/institution names in demo videos, or non-anonymized code)." NeurIPS, ICML, and ICLR have similar rules, but are more permissive on one important point: **authors may post a preprint to arXiv**. Double-blind means reviewers cannot see author names in OpenReview. If a reviewer independently finds the same paper on arXiv, the conferences' dual-submission policies do not treat that discovery as a violation.

### Format and Page Limits

Page limits vary by conference:

| Conference | Main-text limit | Appendix | Notes |
|---|---|---|---|
| NeurIPS 2025 | No strict submission limit stated, but a template applies | Unlimited; reviewers need not read it | Camera-ready may add 1 page |
| ICML 2025 | 8 pages, excluding references | Unlimited | — |
| ICLR 2026 | 9 pages at submission; 10 for rebuttal/camera-ready | Unlimited | More than 9 pages triggers desk rejection |
| CVPR 2026 | 8 pages, excluding references | Uploaded separately | Rebuttal limited to 1 page |

References do **not** count toward the limit at any major conference. Supplementary material—additional experiments, code, video, and so on—is usually unrestricted, but reviewers are not required to read it. The central argument must therefore stand on its own in the main paper.

### Code and Data

More conferences now encourage or request code. The NeurIPS paper checklist asks, "Is the code and data made available?" ICLR requires a reproducibility checklist, while ICML has also promoted code submission in recent years. These remain strong recommendations rather than hard requirements. Omitting code does not directly cause desk rejection, although reviewers may lower a reproducibility assessment because of it.

## Step 2: Format Screening and Desk Rejection

After submission, a paper passes through format screening. Failure means immediate rejection before formal review. Common reasons include:

- **Exceeding the page limit:** ICLR 2026 explicitly says that main text longer than nine pages "will be desk-rejected."
- **Breaking anonymization:** The paper contains an author's name or an institutional logo.
- **Falling outside the conference scope:** For example, submitting a purely hardware paper to an NLP conference.
- **Violating dual-submission policy:** The same paper is simultaneously under review at another archival venue.

Desk rejection has an instructive history. In a 2020 experiment, NeurIPS found that **about 6% of desk-rejected papers would have been accepted if they had completed formal review**. That result led the NeurIPS 2021 Program Chairs to sharply reduce subjective desk rejection. Since then, the conference has reserved it for clear violations such as page-limit or submission-rule breaches, rather than letting ACs reject papers directly based on perceived quality.

## Step 3: Reviewer Assignment

This is the most technically elaborate stage because it must satisfy three competing goals: subject expertise, conflict avoidance, and balanced workloads.

### Bidding

After the deadline, registered reviewers receive a paper list, usually showing only titles and abstracts, and mark preferences such as "eager to review," "willing to review," "not willing," or "conflict." This process is called **bidding**.

The NeurIPS 2025 bidding window ran from May 17 to 21—only four days. Reviewers had to scan their assigned subset and record preferences in that period. The official guidelines warned: "If we have a reason to suspect that a reviewer is engaged in deceitful bidding to influence reviewing outcomes, we will request an ethics investigation." The warning exists because malicious bidding has occurred.

### Automated Matching with TPMS

Bids are only one input. Conferences also use **TPMS (Toronto Paper Matching System)** or a similar algorithm to compare the semantic content of a submission with a reviewer's past publications and produce a match score. The final assignment optimizes a weighted combination of bid preferences, TPMS scores, and load-balancing constraints.

### Conflicts of Interest (COI)

NeurIPS 2025 defined conflicts precisely. They include:

- A current or former advisor/advisee relationship
- A joint paper within the last three years
- Current employment at the same institution
- A family relationship or close personal relationship

COI is bidirectional in OpenReview: if you have a conflict with any author of a paper, you cannot see that paper. The system detects some conflicts automatically from OpenReview profile histories, but authors and reviewers must also declare them.

### How Many Reviewers Does Each Paper Get?

The number varies slightly, but is usually **three or four**:

- NeurIPS: usually 4 reviewers + 1 AC
- ICML: usually 3-4 reviewers + 1 AC
- ICLR: usually 3-4 reviewers + 1 AC
- CVPR: usually 3 reviewers + 1 AC

NeurIPS 2025 used 20,518 reviewers, 1,663 ACs, and 199 SACs to handle 21,575 submissions. Each reviewer handled about 4.2 papers on average.

## Step 4: Review

### Review Period

Reviewers usually have four to six weeks:

- NeurIPS 2025: assignment on May 29 → reviews due July 2, about five weeks
- CVPR 2026: assignment on December 15 → reviews due January 12, about four weeks
- ICLR 2026: reviews released to authors on November 11, about seven weeks after the September 24 deadline

### Rating Scales Across the Three Major ML Conferences

The scales differ substantially.

**NeurIPS 2025:** Overall score from 1 to 6

- 6 Strong Accept: technically flawless, with groundbreaking impact
- 5 Accept: technically solid, high impact
- 4 Borderline Accept: arguments lean toward acceptance
- 3 Borderline Reject: arguments lean toward rejection
- 2 Reject: technical flaws or weak evaluation
- 1 Strong Reject: known result or serious ethical issue

Quality, Clarity, Significance, and Originality each receive a 1-4 score, while Confidence uses 1-5.

**ICML 2025:** Overall score from 1 to 5

- 5 Strong Accept
- 4 Accept
- 3 Weak Accept, leaning positive but still rejectable
- 2 Weak Reject, leaning negative but still acceptable
- 1 Reject

Soundness, Significance, Novelty, and Clarity also receive 1-4 scores.

**ICLR 2026:** Overall score from 1 to 10

- 10 Top 5% of all papers: groundbreaking
- 8 Top 15%: clear acceptance
- 6 Marginally above threshold
- 5 Marginally below threshold
- 3 Clear reject
- 1 Trivial or wrong

It adds Soundness (1-4), Presentation (1-4), Contribution (1-4), and Confidence (1-5).

ICLR's ten-point scale looks more precise than NeurIPS's six-point scale, but many ICLR papers cluster between five and seven, leaving similar effective resolution. Paper Copilot reports that the mean reviewer score across all ICLR 2024 submissions was 5.11, with a standard deviation of 1.26, while accepted papers averaged 6.44. A single point separates acceptance from rejection.

### What Reviewers Evaluate

Whatever the scale, review forms cover roughly the same dimensions:

1. **Technical Soundness / Quality:** Is the method correct? Are the proofs valid and the experiments properly designed?
2. **Significance / Impact:** How important is the contribution to the community? Will others use it or build on it?
3. **Originality / Novelty:** What is new relative to existing work? NeurIPS 2025 specifically notes that "originality does not necessarily require introducing an entirely new method"; a new insight produced with existing methods can qualify.
4. **Clarity / Presentation:** Is the writing clear and the structure sound? Could an expert reproduce the results from the paper?
5. **Reproducibility:** Does the paper provide enough experimental detail, code, and data?

Each reviewer also writes a **Strengths and Weaknesses** assessment and specific **Questions** for the authors. These comments directly shape the response strategy during rebuttal.

## Step 5: Rebuttal / Author Response

After reviews appear, authors receive time to respond. Rules differ considerably:

| Conference | Rebuttal period | Format limit | Interaction |
|---|---|---|---|
| NeurIPS 2025 | 1 week, July 24-30 | No strict page limit | Reviewer-author discussion follows, July 31-August 6 |
| ICML 2025 | About 1 week | No strict page limit | OpenReview comments |
| ICLR 2026 | About 3 weeks, the full November 11-December 3 discussion period | No strict page limit; main text may gain 1 page | Public multi-party discussion among reviewers, AC, and authors |
| CVPR 2026 | 1 week, January 22-29 | **1-page PDF** | CVPR rebuttal template |

CVPR's one-page limit is the strictest. Authors must choose their responses with extreme care and cannot answer every point at length. ICLR's three-week open discussion is the most permissive, allowing several rounds of exchange.

### Can a Rebuttal Reverse the Decision?

A 2025 analysis of ICLR 2024 and 2025 review data (arXiv:2511.15462) provides the clearest numbers so far:

- **Rebuttal mainly affects borderline papers**, those with mean reviewer scores between five and six.
- **About 20% of ultimately accepted papers crossed the threshold because their scores rose during rebuttal.**
- Initial scores and co-reviewer scores are the strongest predictors of post-rebuttal changes. A reviewer who sees high scores from peers is more likely to raise their own score after rebuttal, a peer-influence effect.
- Disagreement among reviewers narrows after rebuttal but does not disappear.

In plain language, rebuttal is unlikely to rescue a paper whose initial reviews are uniformly negative. For a highly rated paper, it is largely procedural. Its real leverage lies with borderline papers where reviewers disagree—which is also the largest group.

## Step 6: Decision (Meta-review / AC Decision)

### The AC → SAC → PC Structure

Once rebuttal and discussion end, authority shifts from reviewers to a three-tier committee:

1. **Area Chair (AC):** Reads all reviews and the rebuttal, writes a meta-review, and recommends acceptance or rejection. The AC is the pivotal role, resolving disagreement and, when necessary, overruling the reviewer majority. The NeurIPS 2025 PCs wrote: "Many ACs fought for papers they thought were good even if reviewers disagreed, and often we followed their lead."
2. **Senior Area Chair (SAC):** Supervises a group of ACs, checks consistency, and addresses calibration differences. SACs do not read every paper directly, but check whether each meta-review makes a sufficient case.
3. **Program Chair (PC):** Performs final oversight. PCs commonly inspect every outlier—for example, a highly rated paper that an AC recommends rejecting or a poorly rated one recommended for acceptance.

CVPR adds an unusual stage: the **AC triplet meeting**. Three ACs covering related topics form a group and discuss borderline papers online to align standards within a subfield. For CVPR 2026, triplet meetings ran February 6-16, with final AC meta-reviews due February 17.

### How Consistent Are Decisions?

NeurIPS ran a famous consistency experiment in 2014. From about 1,678 submissions, it randomly selected 10%, roughly 170 papers, and sent each to two entirely independent review committees. The result:

- **23% received inconsistent decisions**, accepted by one committee and rejected by the other.
- **More than half of Spotlight recommendations were rejected by the other committee.**
- Given an accepted paper, its probability of rejection under independent re-review was close to **50%**.

The finding, later called the "NeurIPS lottery," remains one of the most cited results in discussions of peer-review reliability. It does not mean review is random. It means the gap between acceptance and rejection is far narrower for borderline papers than most people assume.

## Step 7: Camera-Ready

After acceptance, authors usually have four to six weeks to prepare the final version. They may:

- Remove anonymization and restore names, affiliations, and acknowledgments
- Revise in response to reviews, commonly with one extra page of main text
- Add a funding disclosure, which NeurIPS requires
- Upload final code and supplementary material

They may not substantially change the paper's central contribution or experimental results. Camera-ready is revision in response to review, not a rewrite.

The NeurIPS 2025 camera-ready deadline was October 23, about five weeks after the September 18 acceptance notification.

## The ACL Family's Distinctive System: ARR Rolling Review

Since late 2021, ACL, EMNLP, NAACL, and other NLP conferences have used **ACL Rolling Review (ARR)**. It differs fundamentally from the single-deadline process above.

### Two Stages: Review First, Commit Later

ARR separates review from publication:

1. **Submit to ARR:** Authors submit to a shared platform with a deadline each month. Reviewers and an Action Editor, equivalent to an AC, conduct a standard cycle of review, author response, and meta-review.
2. **Commit to a venue:** After receiving reviews, the authors decide whether to commit the paper to a specific conference, such as ACL 2025. The reviews travel with it, and that venue's SACs and PCs make the final decision.

Authors may choose a "preferred venue" when submitting to ARR, but the choice is used only for acceptance-rate accounting. Selecting ACL does not obligate an ACL commitment, and authors who did not select ACL may still commit there.

### Resubmission Is Allowed

ARR also permits revision and resubmission. If the first reviews are poor, authors can revise for a later monthly deadline. Since December 2024, a resubmission must include a revision summary explaining how it addresses the previous reviews or risk desk rejection. Reviewers reassigned from the previous round can see the revision history.

### Reviewer Obligations

ARR tightened reviewer obligations in May 2025. All authors are expected to review unless exempt because they are new, insufficiently experienced, or already serving in another role. A reviewer's papers may be desk-rejected in the current and following cycle if ARR deems the reviewer "highly irresponsible" for missing reviews, using an LLM to generate them, or behaving grossly unprofessionally. This collective penalty is stricter than the policies at other conferences.

### Why Acceptance Rates Become Ambiguous

ARR's two-stage model makes the denominator unclear. ACL 2022 officially offered two calculations:

- Using submissions that named ACL as the preferred venue: 701/3,378 = **20.75%**
- Using papers actually committed to ACL: 701/1,918 = **36.54%**

Directly comparing an ACL acceptance rate with NeurIPS or CVPR is therefore hazardous because the statistics use different populations.

## Full Timeline Comparison

From submission to conference presentation, the major timelines look like this:

**NeurIPS 2025**

| Date | Event |
|---|---|
| May 11 | Abstract submission deadline |
| May 15 | Full paper submission deadline |
| May 22 | Supplementary material deadline |
| May 17-21 | Reviewer bidding |
| May 29 | Papers assigned; review begins |
| July 2 | Reviews due |
| July 24-30 | Author rebuttal |
| July 31-August 6 | Reviewer-author discussion |
| August 7-13 | Reviewer-AC discussion |
| September 18 | Author notification |
| October 23 | Camera-ready deadline |
| December | Conference |

**Submission to notification: about four months. Submission to camera-ready: about five months.**

**ICLR 2026**

| Date | Event |
|---|---|
| September 19 | Abstract submission deadline |
| September 24 | Full paper submission deadline |
| November 11 | Reviews released |
| November 11-December 3 | Author-reviewer-AC discussion |
| January 25 | Paper decision notification |
| April 23-25 | Main conference |

**Submission to notification: about four months.**

**CVPR 2026**

| Date | Event |
|---|---|
| November 6 | Abstract deadline |
| November 13 | Paper submission deadline |
| December 15 | Papers assigned |
| January 12 | Reviews due |
| January 12-22 | Emergency review period |
| January 22 | Reviews released |
| January 29 | Author rebuttal due |
| January 30-February 5 | AC-reviewer discussion |
| February 6-16 | AC triplet meetings |
| February 17 | Final AC meta-review due |
| February 20 | Final decisions sent to authors |
| June | Conference |

**Submission to notification: about three months, the fastest among the major conferences.**

## OpenReview: The Platform Everyone Uses

NeurIPS, ICML, ICLR, and CVPR all use **OpenReview** for submission and review. OpenReview is built around transparency, but each conference defines "open" differently:

- **ICLR:** The most open. Submissions, reviews, author responses, and meta-reviews are visible to the public before decisions. Anyone, not only assigned reviewers, may leave a public comment.
- **NeurIPS:** Partially open. During review, only assigned reviewers, ACs, and SACs have access. After decisions, reviews and meta-reviews for accepted papers become public with anonymous reviewers; authors of rejected papers may choose whether to publish their records.
- **CVPR:** The most closed. "Reviews and author responses will never be made public, and we will not be soliciting comments from the general public during the reviewing process."

ICLR's public-review model is one of its sharpest distinctions. Anyone can inspect a submission's complete history on OpenReview: original comments, point-by-point author responses, the AC meta-review, and even discussion among reviewers. These records have become an important dataset for research on peer review itself.

## Overall

The typical path from submission to publication is: anonymized submission → format screening → reviewer bidding plus automated matching → independent scores from three or four reviewers over four to six weeks → author rebuttal over one to three weeks → reviewer-AC discussion → AC meta-review → SAC calibration → final PC decision → camera-ready revision. The full process takes about four to five months, compressed to roughly three at CVPR.

Several features are worth remembering:

- **Scales vary by conference.** A six at NeurIPS is not directly comparable to a six at ICLR; each scale places its borderline range differently.
- **Rebuttal is not a cure-all.** It chiefly affects borderline papers, and about 20% of accepted papers benefit. A paper facing strong initial consensus against it is very unlikely to reverse the result.
- **Review consistency has a ceiling.** The NeurIPS 2014 experiment found that 23% of decisions reversed under an independent review.
- **The ACL family follows another path.** ARR's review-first, commit-later model is more flexible, but makes cross-conference acceptance-rate comparisons difficult.

Understanding this machinery matters beyond submitting your own paper. When you read a top-conference paper, knowing the selection process helps calibrate your expectations: the work passed rigorous peer review, but peer review itself has structural limits.

---

## References

- [NeurIPS 2025 Call for Papers](https://neurips.cc/Conferences/2025/CallForPapers)
- [NeurIPS 2025 Reviewer Guidelines (including the full review form)](https://neurips.cc/Conferences/2025/ReviewerGuidelines)
- [NeurIPS Blog — Reflections on the 2025 Review Process from the Program Committee Chairs](https://blog.neurips.cc/2025/09/30/reflections-on-the-2025-review-process-from-the-program-committee-chairs/)
- [NeurIPS Blog — NeurIPS 2021: Changes to the Review Process (desk-rejection experiment)](https://blog.neurips.cc/2021/04/09/neurips-2021-changes-to-the-review-process)
- [ICML 2025 Reviewer Instructions](https://icml.cc/Conferences/2025/ReviewerInstructions)
- [ICML 2025 Peer Review FAQ](https://icml.cc/Conferences/2025/PeerReviewFAQ)
- [ICML 2026 Reviewer Instructions](https://icml.cc/Conferences/2026/ReviewerInstructions)
- [ICLR 2026 Author Guide](https://iclr.cc/Conferences/2026/AuthorGuide)
- [ICLR 2026 Call for Papers](https://iclr.cc/Conferences/2026/CallForPapers)
- [ICLR 2026 Dates and Deadlines](https://iclr.cc/Conferences/2026/Dates)
- [CVPR 2026 Author Guidelines](https://cvpr.thecvf.com/Conferences/2026/AuthorGuidelines)
- [CVPR 2026 Reviewer Guidelines](https://cvpr.thecvf.com/Conferences/2026/ReviewerGuidelines)
- [CVPR 2026 Reviewer Training Material (full timeline)](https://cvpr.thecvf.com/Conferences/2026/ReviewerTrainingMaterial)
- [CVPR 2026 SAC Guide (including the AC triplet-meeting process)](https://cvpr.thecvf.com/Conferences/2026/SACGuides)
- [ACL Rolling Review — Call for Papers](https://aclrollingreview.org/cfp)
- [ACL Rolling Review — Authors Guidelines](https://aclrollingreview.org/authors)
- [ACL Rolling Review — Changes to reviewer volunteering requirement and incentives in May 2025 cycle](https://aclrollingreview.org/incentives2025)
- [ACL 2025 Call for Papers (ARR and commit process)](https://groups.google.com/g/ml-news/c/9pXrq63VQ6c)
- [ACL 2022 Chair Blog Post — Rolling Review (official explanation of two acceptance-rate calculations)](https://2022.aclweb.org/post/acl-2022-chair-blog-post-rolling-review)
- [Insights from the ICLR Peer Review and Rebuttal Process (arXiv:2511.15462)](https://arxiv.org/abs/2511.15462)
- [Paper Copilot — ICLR 2025 Statistics](https://papercopilot.com/statistics/iclr-statistics/iclr-2025-statistics)
- [The NeurIPS Experiment (NeurIPS 2014 consistency experiment)](https://inverseprobability.com/talks/notes/the-neurips-experiment-snsf.html)
