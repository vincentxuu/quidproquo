---
title: "Asking AI to Review Your Paper Before Submission: The King and Worthington Experiment, Its Prompts, and Its Limits"
date: 2026-10-24
type: deep-dive
category: ai
tags: [peer-review, prompt-engineering, llm-as-judge, evaluation, claude]
lang: en
tldr: "King and Worthington compared 134 paid expert pre-reviews of 124 manuscripts with Claude Opus 4.8 reviews: the GPT-5.5 judge chose the AI review in all 132 decided pairs, and three former journal editors chose it in 26 of 30 judgments. The result covers constructive pre-submission feedback, not journal refereeing."
description: "A walkthrough of Harvard's King and Worthington preprint on AI manuscript review: how the experiment was designed, how the two prompts in Appendices B and C differ, how to apply them to your own draft, and where the conclusion stops."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-10-24-ai-pre-submission-review-king-worthington)

If you want your draft read closely before you submit it and you don't have a colleague with the time to read the whole thing, an AI reviewer is worth considering. On October 22, 2026, Harvard's Gary King and Steven Worthington released a preprint that pits unusually good human pre-reviews against AI reviews, and the AI won in every area they measured. This post covers how the experiment was run, which prompt is worth borrowing, and where the conclusion stops applying.

## What the experiment compared

The human side comes from rapidPeer, a service at Harvard's IQSS. Reviewers are chosen by field experts, work at institutions other than the author's, review blind, are paid, and are asked to read the full paper and write 1.5 to 2 pages of constructive feedback. These are not weak baselines: 74 authors answered a survey a week after delivery, and 88% rated their review high or very high quality. The corpus is every eligible submission from 2019 to 2026: 124 manuscripts and 134 human reviews (10 manuscripts had two), spanning statistical analyses, mathematical models, and purely qualitative work.

For the AI side, Claude Opus 4.8 at maximum reasoning effort wrote one review per manuscript under two conditions:

- **matched**: the anonymized manuscript plus the verbatim rapidPeer reviewer guidelines (Appendix B), no tools.
- **tuned**: the same manuscript with a prompt written specifically for AI (Appendix C) and web retrieval enabled. Each review averaged 12.4 searches.

The judge was GPT-5.5, a different model family, so author and judge share no lineage. Every comparison ran in both presentation orders, and a win counted only if the same review was preferred both times. Three former editors of major journals also judged 10 randomly chosen, blinded pairs without knowing which review was AI. For background on using one model to grade another, see the site's [Self-Reflection + LLM-as-Judge](/posts/ai/2026-03-12-self-reflection-llm-as-judge).

## Results

Overall, under the tuned condition the GPT-5.5 judge chose the AI review in all 132 decided pairs; two more pairs flipped when the order changed and were not counted. The three editors chose the AI review in 26 of 30 judgments (87%), individually 8, 8, and 10 out of 10. Editors agreed with each other 80% of the time and with the AI's judgment 87% of the time on average.

By area, the gaps are widest on figures and sources:

| Review area | Human mean | AI (tuned) mean | AI win rate: matched → tuned |
|---|---|---|---|
| Additional sources | 4.73 | 9.55 | 62% → 100% |
| Weaknesses | 7.49 | 9.10 | 100% → 100% |
| Methods | 7.01 | 9.02 | 98% → 100% |
| Theory and idea | 6.97 | 8.81 | 88% → 92% |
| Framing | 6.76 | 8.70 | 92% → 92% |
| Communication | 5.68 | 8.18 | 92% → 92% |
| Figures and tables | 2.95 | 7.57 | 99% → 99% |

Scores run 0 to 10 and come from the GPT-5.5 judge, counting only the areas relevant to each manuscript. A review silent on a relevant area got a 0, so some of the humans' low figure score reflects not discussing figures at all. Restricting to pairs where both reviews addressed the area, the AI still scored higher in every area; the figures gap narrowed from 4.54 to 3.40 points.

Accuracy favored the AI too. The judge checked each review's claims against the manuscript and flagged 5.5% of the AI's claims as contradicted, against 15.9% for the humans. All 651 DOI or arXiv identifiers the AI cited resolved to real works. The AI reviews were not clean, though: 46 of 124 (37.1%) had at least one flagged error, compared with 86 of 134 (64.2%) for the human reviews.

The authors ran several checks against the usual objections:

- **Length**: on the 44 pairs with similar word counts, the AI still won every one.
- **Style**: they had the model rewrite the human reviews in the AI's register with the content unchanged; the human mean went from 5.93 to 5.87, no improvement.
- **Training-data hindsight**: the AI's mean score was essentially flat across submission years (8.2, 8.1, 8.1).
- **Different model and prompt**: a replication with a different prompt and rubric, two AI reviews each from Claude Opus and GPT, and judges from both families gave 97.1% (Opus judge) and 94.2% (GPT judge) across 416 comparisons.

## How the two prompts differ

The supplementary appendix contains two prompts with different roles.

**Appendix B** is rapidPeer's guide for human reviewers: a short preamble and 13 questions covering whether the theory fits, whether the methods could be improved, whether the author identified the paper's own weaknesses, whether the research question could be pitched to resonate more, whether figures convey the key results, what sources to add, and which journals to try. It ends by asking the reviewer to focus on the current research and not recommend additional work. Used verbatim as the AI's system prompt, it is the matched condition.

**Appendix C** was written for AI. The authors say it was written before any judging, never tuned against judges' scores, and does not contain the judging rubric. Several design choices are worth borrowing:

1. **Advisor, not gatekeeper.** There is no accept quota; value is measured by how much the feedback helps the author.
2. **Read first, search heavily, then write.** Identify the two or three issues that would most change the paper and lead with them.
3. **Verify every citation by search, never from memory.** Give a DOI or URL for each; if you can't confirm a work exists, don't cite it. The prompt notes that models' recall of specific references is unreliable and one fabricated citation destroys credibility.
4. **Cover both levels.** Framing and positioning as well as methods, identification, robustness, and figures. Only nitpicking or only philosophizing is weak.
5. **Be calibrated and selective.** Separate load-bearing problems from minor ones, don't flatter, and don't pad the list. Three references that bear on the argument beat fifteen that touch the topic.
6. **Attach a fix to every problem**: a concrete change, a check the author can already run, or a specific work to engage.
7. **Stay within the current research**; don't commission new studies.
8. **Fixed six-part output**: Summary, Strengths, Key claims, Specific comments, Literature and data to engage, Overall assessment (with a recommendation and a one-to-three-sentence rationale).

Read the full text in Appendix C of the [supplementary PDF](https://gking.harvard.edu/files/peerless-supp.pdf); it is not reproduced here.

## Using it on your own draft

The paper doesn't offer a how-to for authors. This is the order I would follow, mirroring the experimental conditions:

1. **Use a setup that can search the web.** In the experiment, matched won only 62% on "additional sources" and reached 100% once web retrieval was on. Without search, discount the literature advice.
2. **Give it the full manuscript with figures and tables.** The experiment used the anonymized PDF with figures and tables, without supplementary files.
3. **Paste Appendix C, then append the target journal's instructions to contributors.** The paper suggests journals combine the rapidPeer prompt with their published instructions; authors can do the same, since AI follows long lists of detailed requirements better than people do.
4. **Check the citations yourself.** In the experiment, all 651 identifiers were real; in a sample of 20 reviews with 112 citations, 99 of the 100 the judge could decide were on-topic, and 23 of 24 attributions of specific findings held up. Those figures come from a search-enabled setup. If your tool doesn't search, they don't apply, so click through every link.
5. **Run several rounds and write a reply.** The paper suggests iterating until no resolvable issues remain, then writing a letter explaining where you disagree with the AI. Late rounds tend to get absurdly pedantic: "yes 2+2 = 4, but you never defined the + sign."
6. **Leave "where to submit" and "is it worth submitting" to yourself and the editor.** The paper also leaves framing, importance, and journal fit to editors.

## Where the conclusion stops

- **It is a preprint.** It hasn't been peer reviewed and the numbers may change with revisions.
- **The baseline is constructive pre-review, not journal refereeing.** rapidPeer reviewers are asked to help authors revise, not decide acceptance. The paper itself says its results speak to improving papers, not to how editors should make publication decisions.
- **One source.** All manuscripts came from a single service, submitted by university faculty.
- **Most judging was done by a model.** The human editors contributed 3 people and 30 judgments, a small sample, and most conclusions come from GPT-5.5. The authors' checks (restyling, claim-by-claim verification against the manuscript) did not overturn the result.
- **Whether papers actually improved wasn't measured.** The authors state they did not measure how much revisions improved the paper or the collective consequences of switching to AI reviewing.
- **Homogenization.** If everyone reviews with the same few models, arguments may converge; if journals publish their prompts, authors may optimize for the prompt rather than the science.
- **Confidentiality.** Before sending an unpublished manuscript to any service, check whether it trains on your data. The paper's own runs used enterprise licenses that prevent training.

## Bottom line

For a thorough pre-submission check, this evidence supports using AI, provided it can search the literature and you verify the citations yourself. For predicting acceptance or replacing the judgment of editors and colleagues, the experiment shows nothing. A practical use is to treat it as a first-round review you can run after every revision, then hand the draft to a person for the second.

## References

- [AI Article Reviews Dominate Human Peer Reviews at Their Best: Evidence and Policy Choices](https://gking.harvard.edu/peerless/) (paper page, Gary King and Steven Worthington, 2026)
- [Paper PDF](https://gking.harvard.edu/files/peerless.pdf)
- [Supplementary appendix PDF](https://gking.harvard.edu/files/peerless-supp.pdf) (Appendix B reviewer guidelines, Appendix C tuned AI reviewer prompt, Appendix F robustness checks)
- [Self-Reflection + LLM-as-Judge: Letting AI Evaluate Its Own Answers](/posts/ai/2026-03-12-self-reflection-llm-as-judge) (related post on this site, in Chinese)
