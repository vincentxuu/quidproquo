---
title: "What Is an AI 'Top Conference': Why CCF, CORE and h5-index Disagree"
date: 2026-08-23
category: ai
type: deep-dive
tags: [ai-conference, ccf-ranking, core-ranking, peer-review, neurips, iclr]
lang: en
tldr: "There's no official certificate for being an 'AI top conference.' It's a community consensus built from four independent signals — CCF-A, CORE-A*, a high Google Scholar h5-index, and a low acceptance rate — and those four signals frequently disagree. ICLR being completely absent from CCF's list is a live example."
description: "Breaking down how 'AI top conference' status actually gets decided: the methodological differences and contradictions between CCF, CORE, and Google Scholar Metrics h5-index; five-year submission and acceptance trends across nine major conferences; the submission-to-decision review pipeline; what it means for academic tenure and industry hiring; and the latest controversy over reviewer-pool strain and AI-generated reviews."
draft: false
glossary:
  - term: "h5-index"
    definition: "Google Scholar Metrics' citation measure: a venue's h5-index is h if h of its papers published in the last 5 complete years have each been cited at least h times. It measures citation velocity only, ignoring acceptance rate or review rigor."
    context: "ICLR ranks extremely high on h5-index but is completely absent from CCF's official list."
  - term: "OpenReview"
    definition: "A public peer-review platform where submissions, reviews, and author rebuttals are mostly visible. NeurIPS, ICLR, and others run their entire review pipeline on it."
    context: "The review mechanism section explains how a submission moves from review to decision on OpenReview."
  - term: "rebuttal"
    definition: "The period after reviews are posted during which authors respond to reviewer concerns. Reviewers may adjust scores based on the rebuttal, but rarely reverse their overall stance."
    context: "A key step between submission and decision."
---

> 🌏 [中文版](/posts/ai/2026-08-23-what-is-ai-top-conference)

"Top conference" gets used constantly in AI and CS circles, but no institution has ever issued a "top conference certificate." It's actually a community consensus stacked on top of three independent ranking systems with completely different methodologies — and those three systems can give opposite answers about the same conference. This piece breaks down how "top conference" status actually gets decided, what the representative venue list looks like, what the submission-to-publication pipeline involves, and what pressures this whole apparatus is currently under.

## Nobody Issues a "Top Conference" Certificate

CS/AI differs from most other academic fields: the primary publication channel is conference papers, not journals. The reason is straightforward — conferences run on short cycles, a hard annual deadline with results in a few months, which keeps pace with how fast the field moves. Journal review routinely takes over a year, which doesn't fit fast-moving AI research.

But that also means there's no single number like a "journal impact factor" to fall back on. Academia developed three independent judgment systems instead, each solving a different problem:

- **CCF's recommended catalog**: A tiered list (A/B/C) maintained by China Computer Federation (CCF). This is the system Chinese universities most directly cite for tenure and graduation requirements. CCF's own announcement explicitly states this catalog is "not recommended as a basis for academic evaluation by any institution" — yet in practice, a large number of university regulations write CCF-A/B/C directly into graduation requirements.
- **CORE ranking**: An international ranking led by Australian academia, also using A*/A/B/C tiers, with broader coverage than CCF. Conferences must actively apply and be reviewed by a committee to be rated.
- **Google Scholar Metrics h5-index**: A purely data-driven citation measure. It ignores acceptance rate and review rigor, looking only at citation velocity over the past 5 years.

The three systems actually measure three different things: CCF is one committee's subjective judgment of "is this worth universities counting," CORE is a different committee's assessment of "computing disciplines venue quality," and h5-index is an algorithmic calculation of how fast papers spread. They all use the same word to describe what they're doing ("conference ranking"), but the actual criteria are completely different — which is the root of the contradictions below.

## Representative Conferences and Scale

Across the four major categories — general machine learning, NLP, computer vision, and general AI — the largest and highest-volume conferences, with their CCF/CORE tiers:

| Conference | Field | CCF | CORE |
|---|---|---|---|
| NeurIPS | ML general | A | A* |
| ICML | ML general | A | A* |
| ICLR | ML general | **Not listed** | A* |
| CVPR | Computer vision | A | A* |
| ICCV | Computer vision | A | A* |
| ECCV | Computer vision | B | A* |
| ACL | NLP | A | A* |
| EMNLP | NLP | **B** | **A\*** |
| AAAI | AI general | A | A* |
| IJCAI | AI general | A | A* |

Submission volume and acceptance rate are the most direct measure of "how hard is it to get in," but a single year can be misleading (a temporary tightening of standards, for example), so here's the full five-year trend (2021–2025, main-track figures). The primary sources are third-party aggregators OpenAccept.org and CS Conf Stats, cross-checked against official figures wherever available (marked ✅):

| Conference | 2021 | 2022 | 2023 | 2024 | 2025 |
|---|---|---|---|---|---|
| NeurIPS | 9,122 / 2,334 (25.6%) ✅ | 10,411 / 2,672 (25.7%) ✅ | 12,343 / 3,218 (26.1%) ✅ | 15,671 / 4,037 (25.8%) ✅ | 21,575 / 5,290 (24.5%) ✅ |
| ICML | 5,513 / 1,184 (21.5%) | 5,630 / 1,235 (21.9%) | 6,538 / 1,827 (27.9%) | 9,473 / 2,609 (27.5%) ✅ | 12,107 / 3,260 (26.9%) ✅ |
| CVPR | 7,093 / 1,661 (23.6%) ✅ | 8,161 / 2,064 (25.3%) ✅ | 9,155 / 2,359 (25.8%) ✅ | 11,532 / 2,719 (23.6%) ✅ | 13,008 / 2,878 (22.1%) ✅ |
| ACL (main) | 3,350 / 710 (21.2%) ✅ | 3,378 / 701 (20.8%) ✅ | 4,864 / 1,074 (22.1%) ✅ | 4,407 / 940 (21.3%) ✅ | 8,360 / 1,699 (20.3%) ✅ |
| EMNLP (main) | 3,600 / 840 (23.3%) ✅ | 4,190 / 829 (19.8%) ✅ | 4,909 / 1,047 (21.3%) ✅ | 6,105 / 1,271 (20.8%) ✅ | 8,174 / 1,811 (22.2%) ✅ |
| AAAI | 7,911 / 1,692 (21.4%) ✅ | 9,020 / 1,349 (15.0%) ✅ | 8,777 / 1,721 (19.6%) ✅ | 9,862 / 2,342 (23.8%) ✅ | 12,957 / 3,032 (23.4%) ✅ |
| IJCAI | 4,204 / 587 (14.0%) | 4,537 / 679 (15.0%) ✅ | 4,566 / 643 (14.1%) ✅ | 5,651 / 791 (14.0%) | 5,806 / 1,023 (17.6%) ✅ |

(Format: submissions / accepted (acceptance rate))

All five NeurIPS years now have official primary-source confirmation. 2021 and 2023 are each confirmed by NeurIPS's own official Fact Sheet PDF, as is 2025. 2024's accepted-paper count originally read 4,043 (the figure both trackers agreed on). Cross-checking against NeurIPS 2024's official Fact Sheet (media.neurips.cc) found the official figure is "4,037 main conference track," so it's been corrected to 4,037 — an example of both trackers happening to share the same small error, which shows "the two trackers agree" isn't the same as "it's been verified." 2022 was more tangled: NeurIPS 2022's own official Fact Sheet PDF states "2,905 accepted papers / 9,634 full paper submissions / 20% acceptance" — well off from the two trackers' 10,411 / 2,672 / 25.7%. But two separate official NeurIPS blog posts, published at different times, corroborate each other and contradict the Fact Sheet: the November 2022 post "Getting Ready for NeurIPS (3)" states plainly that the "Main Conference track... has 2,672 accepted papers," and the December 2023 post "Reflections on the NeurIPS 2023 Ethics Review Process" includes a table listing 2022's "Main track" submission count as 10,411. Two independently timed official blog posts agreeing with each other confirms 10,411 / 2,672 / 25.7% is correct, and the Fact Sheet PDF is the outlier — likely a stale or erroneous figure within NeurIPS's own documentation (possibly copied from a mid-review preliminary count in July and never updated).

ICML is the one conference where three years — 2021, 2022, 2023 — still have no official primary source: ICML's Fact Sheet PDF convention appears to only start in 2024 (the `media.icml.cc/Conferences/ICML2021/…`, `ICML2022/…`, and `ICML2023/…` Fact Sheet URLs all 404), and neither the official conference homepages nor any process page for those years post final statistics. OpenAccept and CS Conf Stats agree with each other for all three years, but Paper Copilot's accepted-paper counts differ by 1–2 papers every year (1,183 vs. 1,184 in 2021, 1,233 vs. 1,235 in 2022, 1,828 vs. 1,827 in 2023) — the three trackers don't all line up, so these three years stay third-party-sourced without a ✅. 2024 and 2025 are both confirmed by ICML's official Fact Sheet: it states "main conference track: Over 2600, acceptance rate: 27.5%," which matches OpenAccept's 9,473 / 2,609 / 27.5% almost exactly (2,609 is indeed "over 2,600," and 27.5% matches precisely). This confirms Paper Copilot's 9,653 / 2,944 / 30.5% is either an error or a different counting basis (possibly folding in this year's newly introduced Position Paper track).

CVPR 2022 through 2025 are all officially confirmed — the official chairs' opening-message PDF, IEEE Computer Society press releases, and CVPR's own Accepted Papers pages all match the table. **2021 is the exception, and needed a correction**: CVPR 2021's official proceedings front matter on IEEE Xplore ("Message from the General and Program Chairs") states "a record number of 7093 submissions... select 1661 papers... final acceptance rate is 23.6%," a small but real difference from the two trackers' 7,015 / 1,663 / 23.7%. It's been corrected to 7,093 / 1,661 / 23.6% — this figure is more trustworthy than the trackers' old numbers because the IEEE Xplore front matter is the final, formally published version, while the trackers likely sourced an earlier, non-final CVPR announcement page.

ACL is now fully confirmed across all five years: 2021 and 2023 are each confirmed by an official chair blog post and the official Conference Handbook respectively, and 2025 by the official ACL Anthology Findings front matter. **2024 needed a correction**: the official ACL Anthology proceedings front matter ("Message from the Program Chairs") states the accepted count is **940** (not 943), giving an acceptance rate of 940/4,407 = 21.3% (not 21.4%); ACL's own Admin Wiki General Chair Report independently states the same thing — "940 regular papers... were selected and accepted from around 4,835 submissions." Two official documents corroborating each other, so it's been corrected to 4,407 / 940 / 21.3%.

EMNLP is now fully confirmed across all five years, and the sourcing here is unusually clean: every year's official ACL Anthology proceedings front matter spells out the submission count, acceptance count, and the exact denominator methodology (the same kind of document as the EMNLP 2024 official page already cited above), and the 2021, 2022, 2023, and 2025 front-matter figures all match what's already in the table exactly — no corrections needed.

AAAI has primary or near-primary support across all five years: 2025 is Fact-Sheet-grade; 2021–2024 don't have a statistics page posted on aaai.org itself, but each year has at least one source that clearly quotes an official organizer announcement — 2021 comes from a direct tweet by the AAAI-21 program co-chair (relayed by a tech-news outlet), 2022 and 2023 from University of Oxford CS department news posts relaying figures announced at the AAAI opening ceremony, and 2024 from multiple universities (CUHK, UCSB, Purdue, and others) independently citing the identical figures without any single organizer statement behind them — a notch weaker than "the organizer's own page," but solid enough to mark as verified.

IJCAI has 2022 and 2023 now officially confirmed: 2022's official proceedings preface PDF, signed by that year's Program Chairs, states plainly, "The main track features 679 papers that have carefully been selected from 4537 full paper submissions (an acceptance rate of 15%)." 2023 has no findable preface, so this piece used the same paper-ID-counting technique directly on the official proceedings table of contents — the Main Track's main body runs 639 papers, plus a separate "Late Papers" section adds 4 more, and 639 + 4 = 643, matching the article's existing number exactly. **2021 and 2024 still have no official primary figure**: both years' preface PDF links return 404, but running the same paper-ID-counting technique on the official proceedings table of contents shows the Main Track's actual published count is 586 (2021) and 790 (2024) — both one paper short of the article's current "accepted" figures (587, 791), consistent with the same "accepted count slightly exceeds the final published count" pattern seen repeatedly elsewhere (IJCAI 2025, CVPR, ECCV). That's strong circumstantial evidence, but not a direct official figure, so these two years stay unmarked.

IJCAI 2025 also originally had two trackers disagreeing (CS Conf Stats: 5,806 / 1,023 / 17.6%; OpenAccept: 5,404 / 1,042 / 19.28%), and this one got resolved directly. No public link to an official proceedings Preface PDF could be found, but the official proceedings table of contents itself (www.ijcai.org/proceedings/2025/) lists every published paper individually, with sequential IDs broken into sections (Main Track runs paper1 through paperN, followed by AI4Tech, AI and Social Good, AI Arts & Creativity, Human-Centred AI, Survey Track, and so on). Fetching the full page HTML and counting by ID directly: **the Main Track runs from paper1 to paper1014, and paper1015 — the very next ID — is already the first paper of the AI4Tech special track**, with no gaps or duplicates and a clean boundary. In other words, the Main Track's final published count is 1,014 papers — 9 fewer than CS Conf Stats' "1,023 accepted" and 28 fewer than OpenAccept's "1,042 accepted." This same pattern — a handful more "accepted" than the number that ends up in the final published proceedings — showed up earlier with CVPR (2,878 accepted vs. the official 2,872) and ECCV (2,395 PC-recommended vs. 2,387 finally published), usually because a small number of accepted papers get withdrawn or never submit a camera-ready version after the decision. CS Conf Stats' 1,023 (only 9 off) is clearly closer to the ground truth than OpenAccept's 1,042 (28 off), so this piece uses CS Conf Stats' 5,806 / 1,023 / 17.6% as the primary figure.

ICCV and ECCV are biennial (ICCV in odd years, ECCV in even years). Recent editions: ICCV 2021 6,236 / 1,617 (25.9%), ICCV 2023 8,088 / 2,160 (26.7%), **ICCV 2025 11,239 / 2,698 (24.0%)** — the last figure is cross-confirmed by ICCV 2025's official Main Program PDF (which states 2,701 papers were ultimately selected at a 24% acceptance rate, a 3-paper difference from the third-party tracker's 2,698 — consistent at the order-of-magnitude level ✅). ECCV's last two editions: ECCV 2022 roughly 6,773 / 1,645 (24.3%, single source, Paper Copilot only, not further verified); **ECCV 2024 8,585 / 2,387 (27.8%) ✅** — now confirmed by three independent sources: Springer's official published proceedings state plainly, "The 2387 papers presented in these proceedings were carefully reviewed and selected from a total of 8585 submissions"; RIKEN AIP's official announcement and a Zhihu answer quoting the official notification email both cite "2,395 papers recommended by the PC, 8,585 submissions, 27.9%" (2,395 is the PC's pre-final-withdrawal recommendation count, an 8-paper gap from Springer's final published 2,387 — the same "recommended vs. finalized" pattern seen at CVPR and ICCV). Paper Copilot's 2,595 (30.2%) has no supporting source elsewhere and is judged an error; it isn't used.

Growth rates over five years vary widely: NeurIPS +136% (9,122→21,575), ACL main track +150% (3,350→8,360), EMNLP main track +127% (3,600→8,174), and ICML +120% (5,513→12,107) — all four more than doubled their submission volume in five years. AAAI grew more slowly at +64% (7,911→12,957), and IJCAI slowest at +38% (4,204→5,806). Measured from NeurIPS's own 2020 official figure (9,467), the five-year growth rate is 128% — a number that comes directly from the full text of NeurIPS's own blog post, and it's the direct cause of the "reviewing system under strain" issue discussed later.

## Why CCF, CORE, and h5-index Disagree

Look closely at the table above and two clear contradictions jump out:

**ICLR is completely absent from CCF's AI catalog at any of the A/B/C tiers** — confirmed by checking the full text of CCF's official AI catalog line by line (27 conferences total). Yet that same ICLR is A* (the top tier) in CORE, and ranks #2 across Google Scholar Metrics' entire top-venues list, with an h5-index higher than most top-tier journals. The three systems flatly disagree on the same conference.

A reasonable guess is that this relates to ICLR's publication format: the rest of CCF's A-tier conferences are mostly run by traditional societies or publishers — AAAI, IEEE, ACL, Morgan Kaufmann. ICLR (founded 2013) self-publishes its proceedings via PMLR/OpenReview, bypassing traditional publishers entirely; getting into CCF's catalog requires a proposal and committee review process, so newer conferences with non-traditional publication formats may simply stay off the list for a long time. But this is speculation — it could just as easily be an oversight in the catalog's revision process; CCF has recently launched another round of catalog revisions, and ICLR may or may not still be missing once that's done.

**EMNLP is CCF-B but CORE-A\*.** This isn't really a "conflict" — it's a direct expression of methodological difference: two different committees applying different standards to the same conference can reasonably reach different conclusions.

Google Scholar Metrics' "Artificial Intelligence" subcategory leaderboard makes this clearer:

| Rank | Venue | h5-index | h5-median |
|---|---|---|---|
| 1 | NeurIPS | 371 | 637 |
| 2 | ICLR | 362 | 652 |
| 3 | ICML | 272 | 471 |
| 4 | AAAI | 232 | 358 |
| 14 | IJCAI | 136 | 207 |
| 15 | JMLR | 130 | 214 |

ICLR's h5-index (362) trails only NeurIPS, and is far ahead of fellow CCF-A venues AAAI (232) and IJCAI (136) — by pure citation velocity, ICLR is one of the top one or two publication channels in the field. But it's simply not on CCF's list. These contradictions point to one thing: the correct way to use "top conference" status is to treat CCF-A / CORE-A* / high h5-index / low acceptance rate as four independent signals viewed together — no single one of them constitutes a complete definition of "top conference" on its own. CCF itself refuses to let its own catalog be treated as the sole standard of evaluation — and that statement deserves to be taken seriously, not dismissed as boilerplate.

## Submission to Publication: How Review Actually Works

The review pipeline at mainstream AI conferences is now highly standardized. Most major conferences (NeurIPS, ICLR, ICML) run their entire process on **OpenReview**, a public review platform:

1. **Submission**: Authors submit before a fixed deadline, typically anonymized for double-blind review.
2. **Review**: Each paper is assigned multiple reviewers, who independently score it and write review comments.
3. **Rebuttal / Discussion**: Once reviews are posted, authors get a window (usually 1–2 weeks) to respond to concerns; reviewers may adjust scores based on the rebuttal, but rarely reverse their overall stance.
4. **Meta-review / Decision**: An **Area Chair (AC)** synthesizes the reviews and rebuttal into a meta-review, deciding accept/reject/borderline. Larger conferences add two more layers of oversight above that: **Senior Area Chair (SAC)** and **Program Chair (PC)**. NeurIPS 2025 alone deployed 20,518 reviewers, 1,663 ACs, and 199 SACs.

Most major conferences run both a **main track** and a **workshop track**: workshops have a lower bar and a faster publication cycle, suited to early-stage or exploratory work; submission and acceptance-rate statistics generally refer only to the main track. The ACL family of conferences is a special case, using a cross-conference, rolling review process called **ARR (ACL Rolling Review)**: papers first enter a shared submission pool for review, authors pick a "preferred venue," and only after review decide whether to "commit" to a specific conference. ACL itself openly acknowledges that this process produces two different acceptance-rate calculations that can differ by nearly a factor of two: for ACL 2022, using "accepted / (papers that selected ACL as preferred venue)" gives 701/3,378 = 20.75%, while using "accepted / papers actually committed to ACL" gives 701/1,918 = 36.54%. This means comparing ACL's acceptance rate directly against NeurIPS/CVPR-style single-deadline, single-denominator rates requires first confirming both sides use the same calculation method — otherwise the gap can be artificially inflated or shrunk by the method itself.

## What It Means for Academia and Industry

**Academically**: A top-conference paper in CS/AI roughly occupies the position a top journal paper holds in other fields, directly affecting PhD graduation requirements and tenure/promotion review. This isn't a single-school quirk — checking the official regulations of multiple Chinese university CS departments (Beijing Jiaotong University, Harbin Institute of Technology, Zhejiang University of Technology, University of Chinese Academy of Sciences, Fuzhou University, Nankai University, Fudan University, and University of Electronic Science and Technology of China) turns up explicit rules that directly equate or convert CCF-tiered conference papers into journal-tier publication requirements (e.g., UESTC's CS school: 1 CCF-A paper converts to 2 CCF-B papers, 1 CCF-B converts to 2 CCF-C). But **the exact conversion ratios differ by school** — there's no unified national standard, so a ratio from one school can't be assumed to apply anywhere else. CCF itself also runs a doctoral dissertation incentive program, which indirectly reinforces the real-world use of "CCF tier = quantified research output," even though CCF's own official position discourages that use.

**In industry**: Top-conference papers are commonly used directly as a screening signal when hiring for AI research roles — many research job postings explicitly list "publication experience at ICML/NeurIPS/ICLR preferred," and recruiting-firm hiring guides list top-conference publications as a core metric for evaluating researchers. This is more direct than looking at journal publications, for a simple reason: the field's best results already appear at conferences first, and by the time the journal version comes out, it's often old news.

## Scale Pressure and Review Controversy

The top-conference review system is currently under two kinds of pressure. The first is scale: NeurIPS's submission volume grew 128% in five years, and every major conference is rapidly expanding its pool of reviewers and ACs — bringing with it long-running complaints about "diluted reviewer expertise" and "declining review quality." A 2025 position paper published at ICML directly titled itself around a "peer review crisis," arguing for author feedback mechanisms and reviewer reward systems as a response.

The second, newer pressure: AI-detection company Pangram Labs analyzed roughly 70,000 reviews from the ICLR 2026 review cycle (analysis dated November 2025) and found about 21% (nearly 15,900) were judged to be "fully AI-generated." This figure currently comes from a single first-party analysis by Pangram, though it has been shared and cited by researchers in the field on social platforms — worth watching for independent replication.

## Traps to Watch For

- Don't substitute a ranking for peer review when judging a single paper's quality — CCF itself opposes this use, and quality variance within a single conference is already enormous.
- Before comparing "acceptance rate" across conferences, confirm the statistical basis is the same: ACL's ARR rolling-submission system and NeurIPS/CVPR's single-deadline system aren't the same statistical foundation, and putting them in the same table can mislead.
- "Top-conference-for-journal" or "top-conference-credit-conversion" rules vary by school; when you see a specific number, confirm which school's official regulations it comes from before treating it as a national standard.

## Bottom Line

"AI top conference" is a useful but inherently imprecise community label: it bundles four independent signals — CCF-A, CORE-A*, high h5-index, low acceptance rate — into one term, and no single one of them alone constitutes a complete definition. The four signals sometimes flatly disagree — ICLR and EMNLP are live examples. Treating it as a quick coarse filter is fine; recruiters, funders, and cross-field readers all need that kind of shortcut. But once you need to judge a single paper's actual quality, or need a precise comparison of how hard different conferences are to get into, you have to go back to the paper itself and its review record — not stop at the ranking table.

---

## References

- [China Computer Federation (CCF) Recommended International Conference and Journal Catalog — Artificial Intelligence](https://www.ccf.org.cn/Academic_Evaluation/AI)
- [ICORE Conference Portal](https://portal.core.edu.au/conf-ranks)
- [Google Scholar Metrics — Artificial Intelligence](https://scholar.google.com/citations?view_op=top_venues&vq=eng_artificialintelligence)
- [NeurIPS Blog — Reflections on the 2025 Review Process from the Program Committee Chairs](https://blog.neurips.cc/2025/09/30/reflections-on-the-2025-review-process-from-the-program-committee-chairs/)
- [NeurIPS 2025 Fact Sheet (official PDF)](https://media.neurips.cc/Conferences/NeurIPS2025/press/NeurIPS2025-Fact_Sheet.pdf)
- [NeurIPS 2023 Fact Sheet (official PDF)](https://media.neurips.cc/Conferences/NeurIPS2023/NeurIPS2023-Fact_Sheet.pdf)
- [NeurIPS 2022 Fact Sheet (official PDF; this piece notes where it diverges from NeurIPS's own blog posts)](https://media.neurips.cc/Conferences/NeurIPS2022/NeurIPS_2022_Fact_Sheet.pdf)
- [NeurIPS 2021 Fact Sheet (official PDF)](https://neurips.cc/media/Press/NeurIPS_2021-Fact_Sheet.pdf)
- [NeurIPS Blog — Getting Ready for NeurIPS (3): 2022 Conference Highlights](https://blog.neurips.cc/2022/11/22/getting-ready-for-neurips-3-2022-conference-highlights/)
- [NeurIPS Blog — Reflections on the NeurIPS 2023 Ethics Review Process (includes a 2022/2023 submission comparison table)](https://blog.neurips.cc/2023/12/09/reflections-on-the-neurips-2023-ethics-review-process/)
- [ICML 2025 Fact Sheet (official PDF)](https://media.icml.cc/Conferences/ICML2025/ICML2025_Fact_Sheet.pdf)
- [ICML 2024 Fact Sheet (official PDF)](https://media.icml.cc/Conferences/ICML2024/ICML2024_Fact_Sheet.pdf)
- [CVPR 2021 official proceedings front matter (IEEE Xplore, signed by the General and Program Chairs)](https://doi.org/10.1109/CVPR46437.2021.01669)
- [Springer — Computer Vision ECCV 2024 Proceedings (front matter with official submission/acceptance figures)](https://link.springer.com/book/10.1007/978-3-031-72855-6)
- [Paper Digest — IJCAI 2025 Papers & Highlights (independent all-tracks count from the actual proceedings)](https://www.paperdigest.org/2025/08/ijcai-2025-papers-highlights/)
- [IJCAI 2025 official proceedings table of contents (sequentially numbered, used to directly count Main Track papers)](https://www.ijcai.org/proceedings/2025/)
- [IJCAI 2022 official proceedings preface (PDF, signed by the Program Chairs, states 4,537/679/15%)](https://www.ijcai.org/proceedings/2022/preface.pdf)
- [EMNLP 2024 official acceptance-rate methodology](https://2024.emnlp.org/program/)
- [ICCV 2025 Main Program (official PDF, with submission and acceptance figures)](https://media.eventhosts.cc/Conferences/ICCV2025/iccv25_main_program.pdf)
- [ACL 2022 Chair Blog Post — Rolling Review (official explanation of the two acceptance-rate methods)](https://2022.aclweb.org/post/acl-2022-chair-blog-post-rolling-review)
- [ACL Anthology — 2024.acl-long official proceedings front matter (Message from the Program Chairs, states 940 papers accepted)](https://aclanthology.org/2024.acl-short.0.pdf)
- [ACL Admin Wiki — 2024Q3 General Chair Report (independently corroborates the 940 figure)](https://www.aclweb.org/adminwiki/index.php/2024Q3_Reports:_General_Chair)
- [CVPR 2025 Technical Program](https://cvpr.thecvf.com/Conferences/2025/News/Technical_Program)
- [ACL Wiki — Conference acceptance rates](https://www.aclweb.org/aclwiki/Conference_acceptance_rates)
- [OpenAccept.org — historical submission/acceptance statistics aggregator](https://openaccept.org/)
- [CS Conf Stats — historical submission/acceptance statistics aggregator](https://csconfstats.xoveexu.com/)
- [Kim, Lee & Lee (2025) "Position: The AI Conference Peer Review Crisis Demands Author Feedback and Reviewer Rewards", PMLR v267](https://proceedings.mlr.press/v267/kim25am.html)
- [Pangram Labs — "Pangram Predicts 21% of ICLR Reviews are AI-Generated"](https://www.pangram.com/blog/pangram-predicts-21-of-iclr-reviews-are-ai-generated)
- [University of Electronic Science and Technology of China, School of Computer Science and Engineering — PhD degree innovation-achievement requirements](https://www.scse.uestc.edu.cn/info/1042/15266.htm)
