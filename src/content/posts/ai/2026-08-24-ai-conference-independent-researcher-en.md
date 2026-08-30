---
title: "Submitting to Top AI Conferences as an Independent Researcher: A Reality Check"
date: 2026-08-24
category: ai
type: deep-dive
tags: [ai-conference, independent-research, solo-author, academic-career, peer-review]
lang: en
tldr: "Publishing at a top conference as an independent researcher is possible, but the numbers are harsh: single-author papers have fallen to a single-digit share, the average author count has risen from 3 to 5, and the top 20 institutions account for 35-50% of authorships. Andreas Madsen spent eight months working without pay, earned an ICLR Spotlight, and still ended up returning for a PhD. This article examines real cases, evidence of review bias, and viable paths for researchers without a large lab behind them."
description: "An evidence-based assessment of how feasible it is for independent researchers to publish at NeurIPS, ICML, ICLR, or ACL: trends in single-author papers, the costs and outcomes behind cases such as Andreas Madsen's, whether double-blind review removes affiliation bias, and which tracks and research directions remain viable without large-lab resources."
draft: false
series:
  name: "AI 頂會導讀"
  order: 5
glossary:
  - term: "Spotlight"
    definition: "A conference presentation tier above a standard Poster but below an Oral, usually representing the top 3-5% of papers. Usage varies by conference."
    context: "Andreas Madsen received an ICLR 2020 Spotlight as an independent researcher, an exceptionally rare result for someone without an institutional affiliation."
  - term: "Prestige bias"
    definition: "The tendency for reviewers to give higher scores, often unconsciously, when they see or infer that an author comes from a prestigious institution or is a well-known scholar."
    context: "Both WSDM 2017's randomized controlled experiment and research on ICLR's switch from single- to double-blind review found statistical evidence of prestige bias."
---

> 🌏 [中文版](/posts/ai/2026-08-24-ai-conference-independent-researcher)

> 🌏 Part 5 of the [AI Top Conference Guide](/en/tags/ai-conference) series

"Can I submit to a top conference without an institution, an advisor, or compute resources?" The question appears repeatedly on Reddit's r/MachineLearning and across ML communities. The answer is that nothing prohibits it. None of the major AI conferences—NeurIPS, ICML, ICLR, or ACL—requires an institutional affiliation. Anyone can create an OpenReview account, and a submission system will not reject a paper merely because its author enters "Independent Researcher."

Being allowed to submit and having a viable path are two different things. This article uses data, case studies, and research on review bias to assemble a more realistic picture.

## Start with the Numbers: Do Single-Author Papers Still Exist?

Historical NeurIPS data shows a clear decline in the share of single-author papers. A paper had about three authors on average in 2014; by 2023, that figure had reached 4.98, and it continued to rise in 2024. The average increased by more than 50% in a decade. A few enormous collaborations did not create the change on their own—the entire distribution shifted to the right.

ICML 2026 accepted 6,341 papers representing 1,979 distinct institutions. One statistical category, "NON," covers authors without a clear institutional affiliation. It appeared on 129 papers, or about 2% of the total. That is a reasonable upper bound on the visible presence of "independent researchers" at a top conference.

Concentration offers another view. A 2024 study by Azad et al. analyzed 87,137 papers published over a decade at 11 leading AI conferences. It found that **1% of authors contributed more than 50% of CVPR 2023 papers**. At NeurIPS 2023, one author published more than 80 papers across 11 conferences in a single year. The top 20 institutions accounted for 35-50% of authorships at NeurIPS, ICML, and ICLR. Academia accounted for roughly 65-70%, industry for 20-30%, and academic-industry collaboration for about 31%.

These numbers do not mean that an independent researcher cannot get a paper accepted. They do show that the scale and concentration of today's top AI conferences were not designed around individuals working alone.

## The Most-Cited Case: Andreas Madsen's ICLR 2020 Spotlight

In April 2019, Danish researcher Andreas Madsen made a decision: he would stop looking for work and spend up to eight months on research full time. If he had not published at a top conference by January 2020, he would go back to writing JavaScript.

Why did he reach that point? Every PhD program, research position, and ML Engineer role he wanted required "one or two top-conference publications." He had a master's degree from a technical university, a Distill publication, and industry experience, yet nobody offered him an interview.

> "To start a PhD in ML, without insider referral, you need to do work equivariant to half of a PhD."

His strategy was concrete:

1. **Find a peer for regular discussion.** The person did not have to be an expert; what mattered was having someone who would challenge the work. Madsen met with his colleague Alexander every week.
2. **Publish a workshop paper first to establish the experimental framework.** He presented a reproduction study of DeepMind's NALU model at the NeurIPS 2019 SEDL workshop. His full submission therefore did not have to justify both the experimental design and a new model at once.
3. **Use side projects to reduce single-point risk.** If the main project failed, the entire period would not have been wasted.
4. **Submit to ICLR after NeurIPS 2019 rejected the paper.** Acceptance on the first attempt is not the norm.

His eventual paper, "Neural Arithmetic Units," improved DeepMind's NALU by a factor of 3-20 and received an ICLR 2020 Spotlight, placing it in the top 3-5%. After the news spread on Twitter, he received nearly 2,000 messages.

The aftermath gets much less attention:

- Even after the Spotlight, he did not get any of the jobs he had originally wanted in research engineering or industrial research.
- Nine months later, he published a follow-up titled "9 months after my ICLR spotlight award," describing broken promises and crushed expectations.
- He ultimately entered the PhD program at Mila in Montreal, researched interpretability in NLP, and completed the degree in 2024.

Madsen's story is the most frequently cited success case for an independent researcher publishing at a top conference. Yet even this "success" ended with a return to graduate school.

## Other Cases: A Spectrum of Success

### Success at a High Cost

**Sole author at IJCAI 2022 (anonymous blog):** A researcher placed a sole-authored paper in the IJCAI 2022 main track, which had a 15% acceptance rate, and the paper was selected for a Long Oral, placing it in the top 3.75%. The author wrote that the result "felt unreal for a while (imposter syndrome)" and published detailed submission advice. It remains an extreme case at a CORE A* conference.

**Eric Martin (ICLR 2018):** Martin was an independent researcher who wrote "Parallelizing Linear Recurrent Neural Nets Over Sequence Length." NeurIPS 2017 first rejected it because the "experiments were too weak." After improving the work, he submitted it to ICLR 2018 and was accepted. Because he also held a full-time job, he often worked on the research late at night. His verdict: "While I'm glad for the experience, I wouldn't do it again unless it was a full-time job."

**Victor May (three papers in 2025):** An industry engineer without a PhD, May found collaborators through open-source communities including LAION and Ontocord. Three of his papers were accepted in one year, including one in the ICSE main track. The core of his strategy was not to work alone, but to use open-source communities to connect with experienced researchers.

### The Workshop and TinyPapers Route

**Jade Abbott and Laura Jane Martinus (NeurIPS 2018 Workshop):** The two South African researchers met at Deep Learning Indaba and completed a submission in ten days. They used the workshop route, not the main track. Their advice is to start with workshops and practice the processes of submitting, writing, and responding to reviews.

**Jordan Rubin (ICLR 2026 Workshop):** Rubin had no formal research training and came from systematic finance. He wrote his first workshop paper "over the course of ~4 Lyft rides." AI tools made it possible for him to produce the work in extremely limited time.

**The author of Smart Media Cutter (2024):** After one year of independent research, the author secured only a TinyPapers acceptance. Conference admission cost unaffiliated attendees $1,000, and the author's financial-assistance request was denied. The conclusion was blunt: "there is no payoff for any of this work unless you are already inside the academic system." The author subsequently abandoned research altogether.

Together, these cases show that independent researchers can publish, but the usual path is workshop → smaller track → main track over time, not a direct leap into the main program. The costs in time, money, and psychological strain often exceed the benefits.

## Double-Blind Review: Is Affiliation Really Invisible?

Major AI conferences use double-blind review, in which authors and reviewers do not know one another's identities. It is an important protection for independent researchers: if reviewers truly do not know that you lack an affiliation, the paper should, in theory, be judged on its quality alone.

The research evidence shows a more complicated reality.

### Natural and Randomized Experiments at ICLR and WSDM

ICLR switched from single-blind to double-blind review in 2018. Sun et al. (2022) analyzed 5,027 submissions from before and after the change and found that:

- Scores for the best-known authors, measured by citation count, **fell significantly** after the switch to double-blind review.
- Because those papers were already above the acceptance threshold, however, the change had no significant effect on their final acceptance rate.

WSDM 2017 ran a stricter randomized controlled experiment (Tomkins et al.): the same paper was scored by both single-blind and double-blind reviewers. The results were:

- Papers by well-known authors scored higher in the single-blind group ✓
- Papers from elite universities scored higher in the single-blind group ✓
- Papers from leading companies such as Google, Microsoft, and Meta scored higher in the single-blind group ✓
- The difference for women authors was not significant
- The conference adopted double-blind review in full the following year

### How "Blind" Is Double-Blind Review?

- **ICML 2021 and EC 2021 surveys:** In anonymous self-reports, 36% and 42% of reviewers, respectively, said they **actively searched online** for papers they were reviewing.
- **Preprints reveal identities:** More than half of NeurIPS 2019 submissions were also posted to arXiv, and at least one reviewer saw the preprint for 21% of those papers. After ACL removed its anonymity-period rule in 2024, allowing unrestricted preprint posting during review, research found that prestigious institutions posted preprints more often (52% versus 36%). Reviewer awareness of author identity produced significant score inflation for top institutions (Cohen's d = 0.43, p < 0.001), but not for other institutions.
- **Inferring authors from the paper:** Across three anonymized conferences, 70-86% of reviewers said they could not guess the authors. Among reviewers who did make a guess, however, 72-85% correctly identified at least one author.

### What This Means for Independent Researchers

Double-blind review does reduce prestige bias; experimental evidence supports that conclusion. It does not eliminate the bias entirely. Reviewers search, preprints expose identities, and writing style carries signals of its own. **The system does not directly discriminate against independent researchers, but neither do they receive the implicit boost that papers from elite institutions enjoy.** For a borderline paper, that difference may separate acceptance from rejection.

One counterintuitive result deserves mention. Chen et al. (2022) examined 5,313 borderline ICLR submissions from 2017 to 2022 and found that Area Chairs making final decisions were actually **slightly less likely to favor** borderline papers from institutions in the top 30% (odds ratio = 0.82). This could suggest some correction for prestige bias at the AC level, but the evidence is not strong enough to support a firm conclusion.

## Viable Paths Without a Large Lab

If you understand the constraints above and still want to try, the data and case studies support several practical strategies.

### Choose the Right Track

Not every track has the same threshold:

- **Workshop papers:** Acceptance rates are commonly 30-50%, far more forgiving than the main track. Most successful independent researchers begin here. NeurIPS 2025 had 58 workshops, while ICLR and ICML each had dozens.
- **Datasets & Benchmarks Track (NeurIPS):** This track explicitly welcomes work focused solely on benchmarks or evaluation methodology. It does not require a new model or beating baselines, as the official NeurIPS 2026 review guidelines state. For an independent researcher, its compute requirements are usually much lower than those of a main-track paper that trains a large model.
- **Findings (ACL/EMNLP/NAACL):** A secondary track between the main program and rejection. It still receives full peer review, with a quality threshold above workshops but broader than the main track.
- **TinyPapers / Tiny Paper Track:** Two-page papers designed especially for first-time or underrepresented authors. Academia generally does not treat them as "formal" publications.
- **Main Track:** Independent researchers can submit, but they should recognize that they are competing directly with teams from Google, DeepMind, and Tsinghua without the same compute, dataset access, or internal peer review.

### Choose the Right Research Direction

Not every research direction requires eight A100s:

- **Evaluation and benchmark papers:** These do not require training a model. They run existing models on public benchmarks and design an evaluation methodology. Compute costs are low, though the research question must be strong.
- **Analysis and position papers:** These analyze an existing phenomenon or argue for a position. ICML 2025 and NeurIPS 2026 both offered Position Paper tracks.
- **Prompt engineering and in-context learning research:** These require API calls rather than training a model from scratch.
- **Small-model research (7B-8B parameters):** Fine-tuning and DPO can run on a single consumer GPU.
- **Theoretical research:** The primary resource is mathematical ability, not compute. Reviewers often struggle to understand theoretical papers, though that is a separate problem.

By contrast, large-scale pretraining, RLHF for large models, work that requires proprietary datasets, and research requiring large-scale human annotation are nearly infeasible for an independent researcher.

### Available Compute Resources

| Resource | Free allowance | GPU | Limits |
|---|---|---|---|
| Google Colab Free | Limited, opaque quota | T4 | Unstable availability; sessions may be interrupted |
| Kaggle Notebooks | ~30 GPU hours/week | P100 | Notebook must be public |
| AWS SageMaker Studio Lab | Free | T4 | 12-hour session limit |
| Lightning AI | Free allowance | Various | Account required |
| Lambda Labs | Applications open to academic researchers | Various | Research proposal required |
| Thunder Compute A6000 | $0.35/hr | A6000 48GB | — |
| Thunder Compute A100 | $1.09/hr | A100 80GB | — |

One strategy is to combine several free resources: Google Colab and Kaggle together provide about 60 hours of free GPU time per week. New-user cloud credits add another option—$300 from Google Cloud and $200 from Azure—while students can also use the GitHub Student Developer Pack.

### Strategic Advice

1. **Find a collaborator; do not work alone.** This is the common thread across almost every success case. The collaborator need not be famous. What matters is having someone who can give feedback, question the work, and share experiments. Open-source communities such as LAION and EleutherAI, Shared Task participant groups, and regional communities such as Deep Learning Indaba are all places to meet collaborators.
2. **Build a presence with a workshop paper or preprint first.** Posting an arXiv preprint costs nothing, though moderators may place it on hold. Workshops let you practice the submission process at much lower cost than a main-track attempt. Andreas Madsen's workshop-paper strategy is a demonstrated path.
3. **Choose a problem where you have a domain advantage.** The worst contest for an independent researcher is a model-training race against DeepMind. Your advantage is insight that others lack in a particular domain—perhaps industry experience, a corpus in a specific language, or deep knowledge of an overlooked problem.
4. **Writing quality is a variable you can control.** Several independent researchers have said that rejection came not from a weak idea, but from writing that did not match the format and style a conference expected. Read Vered Schwartz's advice on writing NLP papers, study the structure and voice of accepted papers at the same venue, and ask someone to review the entire draft. All three are within your control.
5. **Expect failure.** Overall acceptance rates of 20-25% are already low. Independent researchers do not have internal peer review as a quality filter, so their actual odds may be lower still. NeurIPS rejected Andreas Madsen's first submission. That is normal, not exceptional.
6. **Calculate the full cost.** Conference registration for unaffiliated participants commonly costs $500-$1,000, before travel. Some workshops require in-person attendance; others do not. Financial assistance is not guaranteed. Include these costs before deciding to submit.

## An Honest Conclusion

From the aggregate data to individual cases, the picture is consistent: an independent researcher can publish at a top AI conference, but the cost is high, the odds are low, and even success may not produce the outcome you want.

- Main tracks are largely contests among institutions. The top 20 institutions account for 30-50% of publications, papers average five authors, and independent researchers are statistical outliers.
- Double-blind review offers genuine but imperfect protection. Reviewers search, preprints reveal identities, and writing carries institutional signals.
- Success stories exist, but follow-up accounts often point to the same conclusion: continuing in research ultimately requires entering some form of institutional system.
- Workshops and the D&B Track are more realistic starting points. TinyPapers has a lower threshold still, but all are real routes into publication.

Delip Rao's line may be the most useful one to sit with: "Don't confuse good writing/science with getting a paper accepted." Acceptance is a particular game with particular rules. It requires a particular writing style, conventional experimental design, and community signals. The question for an independent researcher is not "Can I do good research?" It is "Am I willing to learn this game's rules without a coach?"

If the answer is yes, the strategies and cases above show how others have made the attempt. If the answer is no, open-source projects, technical writing, and product development are all ways to build influence in AI without depending on anyone's accept-or-reject decision.

---

## References

- [Andreas Madsen — Becoming an Independent Researcher and getting published in ICLR with spotlight (Medium, 2019)](https://andreas-madsen.medium.com/becoming-an-independent-researcher-and-getting-published-in-iclr-with-spotlight-c93ef0b39b8b)
- [Andreas Madsen — 9 months after my ICLR spotlight award, as an Independent Researcher (Medium, 2020)](https://andreas-madsen.medium.com/9-months-after-my-iclr-spotlight-award-as-an-independent-researcher-9cfb0c808817)
- [Smart Media Cutter — My year as an independent AI researcher (2024)](https://smartmediacutter.com/blog/year-as-an-independent-ai-researcher/)
- [Victor May — How I Published Three Papers This Year — Without a PhD or Research Job (Medium, 2025)](https://medium.com/@mayvic/intro-889c3e6e40b7)
- [Jade Abbott — The Journey to NeurIPS (Medium, 2018)](https://medium.com/data-science/the-journey-to-neurips-ee1a197da538)
- [Jordan Rubin — Notes from ICLR 2026 (Substack, 2026)](https://jordanmrubin.substack.com/p/notes-from-iclr-2026)
- [Delip Rao — Publishing Tips for Free Radicals and Other Creatives (2023)](https://deliprao.com/2023/08/publishing-tips-for-free-radicals-and-other-creatives/)
- [Azad et al. — Publication Trends in Artificial Intelligence Conferences: The Rise of Super Prolific Authors (arXiv 2412.07793, 2024)](https://doi.org/10.48550/arxiv.2412.07793)
- [Sun, Danfa & Teplitskiy — Does double-blind peer review reduce bias? Evidence from a top computer science conference (arXiv 2101.02701, 2021)](https://arxiv.org/abs/2101.02701)
- [Tomkins, Zhang & Heavlin — Reviewer bias in single- versus double-blind peer review (PNAS, 2017)](https://doi.org/10.1073/pnas.1707323114)
- [Stelmakh, Shah & Singh — On Testing for Biases in Peer Review (NeurIPS 2019)](https://proceedings.neurips.cc/paper/2019/file/d3d80b656929a5bc0fa34381bf42fbdd-Paper.pdf)
- [Chen et al. — Association between author metadata and acceptance: A feature-rich, matched observational study of ICLR 2017-2022 (arXiv 2211.15849, 2022)](https://doi.org/10.48550/arxiv.2211.15849)
- [Shah — What to do about NeurIPS Reviewer #2? Unearthing Peer Review's Mysteries (NeurIPS 2023 Tutorial slides)](https://www.cs.cmu.edu/~nihars/tutorials/NeurIPS2023/TutorialSlides2023.pdf)
- [Frachtenberg & Kaner — Metrics and methods in the evaluation of prestige bias in peer review (PLOS ONE, 2022)](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0264131)
- [ACL 2026 Findings — The Double Bind: Revisiting Preprinting and Peer Review Two Years After the Removal of the ACL Anonymity Period](https://aclanthology.org/2026.findings-acl.222/)
- [Jie et al. — Beyond Content: How Author Network Centrality Drives Citation Disparities in Top AI Conferences (arXiv 2512.21832)](https://arxiv.org/html/2512.21832)
- [arXiv 2607.26280 — Bias at the Borderline: Who Gets the Benefit of the Doubt in Peer Review? Evidence from ICLR](https://arxiv.org/html/2607.26280v1)
- [NeurIPS 2026 Main Track Handbook (reviewer guidelines)](https://neurips.cc/Conferences/2026/MainTrackHandbook)
- [Nemanja Rakicevic — NeurIPS Conference: Historical Data Analysis (Medium)](https://medium.com/data-science/neurips-conference-historical-data-analysis-e45f7641d232)
- [Voxel51 — NeurIPS 2023 and the State of AI Research](https://voxel51.com/blog/neurips-2023-and-the-state-of-ai-research)
- [MTRI — Who really wrote ICML 2026?](https://www.mtri.co.jp/en/publications/icml-2026-report-blog)
- [Marten Lienen — ICML/NeurIPS/ICLR dataset (GitHub, papers + authors + affiliations 2006-2024)](https://github.com/martenlienen/icml-nips-iclr-dataset)
- [Shardul Junagade — ML Publication Trends (blog)](https://sharduljunagade.github.io/blog/posts/ml-publication-trends/ml_publication_trends.html)
