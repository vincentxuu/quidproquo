---
title: "Stanford CS229: Notes Rewritten Every Year, Public Problem Sets Frozen at 2020, and an Official Self-Test From 2008"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs229, ai-course, stanford, machine-learning, deep-learning, self-study]
lang: en
series:
  name: "Reading Stanford CS229"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 9
tldr: "The three things you need to self-study CS229 run on three different clocks. The lecture notes are 278 pages and were recompiled in August 2026. The newest problem sets you can download are from summer 2020. The self-assessment Stanford Online tells you to attempt before enrolling is a PDF created in 2008. Seventeen lectures from spring 2026 are public, and the last three are mislabeled."
description: "A full walkthrough of Stanford CS229: Machine Learning — what the 278-page notes actually cover and where chapter 1 gets hard, how the 2018 and 2026 syllabi diverge, the three problem sets still downloadable, how Stanford itself positions CS229 against CS230, and exactly what a self-learner can get."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs229-machine-learning)

[CS229: Machine Learning](https://cs229.stanford.edu/) is Stanford CS's main machine learning course, three to four units, cross-listed with statistics as STATS 229. It is not an AI survey and it is not a deep learning course. It is the course that walks through the **mathematical derivations** behind supervised learning, unsupervised learning, learning theory, and reinforcement learning.

It also has the most complete public self-study materials of any Stanford course: the notes are a public PDF, the lectures are on YouTube, and the problem sets and starter code are still sitting on the server. That is why it deserves its own post — **an abundance of material is not the same as consistent material**. Those four resources are frozen at four different years, and nothing on any page tells you so.

This piece was written after reading through the notes PDF chapter by chapter, putting the 2018 and 2026 syllabi side by side, and downloading and working through every problem set still reachable. It covers what the course teaches, where chapter 1 gets hard, what changed between the two syllabi, what the assignments look like, and how much someone without a Stanford account can actually get. It does **not** include a lecture-by-lecture listen — that is a different order of work, and the [CS329A post](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en) in this series is the one that does it. For where this course sits on the prerequisite ladder, see the [map post](/posts/learning/2026-08-20-stanford-cs-course-map-en) that opens the series.

## The hard facts

The prerequisites are spelled out concretely on the course site, in three parts. You can write non-trivial Python/NumPy (CS106A or CS106B level); probability to the level of CS109 or MATH151; multivariable calculus and linear algebra to the level of MATH51 or CS205L. All three are phrased as "equivalent to" — you do not need to have taken those course numbers.

What fewer people notice is that **the course runs four times a year, taught by a different team each time**. The [ExploreCourses entry for CS 229](https://explorecourses.stanford.edu/search?q=CS+229&view=catalog) lists autumn, winter, spring, and summer for 2025–2026. Autumn is Moses Charikar, Carlos Guestrin, and Andrew Ng; winter is Sanmi Koyejo; spring is Tengyu Ma and Chris Ré; summer is Jehangir Amjad and Anand Avati. So "what does CS229 teach" is strictly a question you have to ask about a specific quarter. The course summaries floating around online rarely say which one.

On auditing, the site leaves no room:

> All links will require you to be logged into your Stanford email to access. Course documents are only shared with Stanford University affiliates.

The current syllabus, assignments, and FAQ all live behind Google Drive and Canvas, locked to a Stanford account. The official route for non-degree students is SCPD, and the [Stanford Online CS229 page](https://online.stanford.edu/courses/cs229-machine-learning) requires a bachelor's degree and an undergraduate GPA of 3.0 or higher to apply. This term adds one more thing: the course is part of a Stanford academic integrity task force pilot for proctored in-person exams.

## The notes: 278 pages, recompiled two days ago

[main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf) is the most valuable public asset this course has. It currently runs 278 pages, the title page credits Tengyu Ma and Andrew Ng, and the date reads August 18, 2026 — three days before this post. The `Last-Modified` header the server returns falls in the same week. This is not a stale document gathering dust.

It is organized into six parts: supervised learning, deep learning, generalization and regularization, unsupervised learning, generative models and foundation models, reinforcement learning and control, followed by an appendix on Gaussians and KL divergence plus a bibliography. The map post described it as running "all the way through self-supervised learning and foundation models" — **that description is now an understatement**. Part V contains diffusion models, LoRA, contrastive learning, semantic retrieval and RAG, tokenization, the transformer architecture, attention variants, MoE, in-context learning, and SFT. The final chapter is called Reasoning in LLMs and covers chain-of-thought and long-reasoning training under RLVR. In the RL part, the policy gradient chapter has grown from REINFORCE alone to REINFORCE plus PPO.

None of this is a scattering of small additions. Pull down the [frozen autumn 2022 notes](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) and the picture is unambiguous: back then, "self-supervised learning and foundation models" was a single eight-page chapter. The same material today occupies five chapters and nearly fifty pages. **Almost all of the sixty-odd pages added over four years land in that one block.** The chapters on linear regression, GLMs, SVMs, EM, and PCA are essentially unchanged apart from shifted page numbers.

One aside: the header on the 2026 table of contents still prints "CS229 Spring 2022". That is a leftover string from an old layout template and has nothing to do with the content — don't use it to date the file.

### What chapter 1 covers, and where it gets hard

The map post uses "can you get through chapter 1 of the notes" as the dividing line between CS229 and CS230. Concretely, chapter 1 is **linear regression**, twelve pages, starting from the square footage and sale price of 47 houses in Portland. It has four parts: the LMS update rule with batch and stochastic gradient descent, the closed-form normal equations, the probabilistic interpretation of least squares, and locally weighted linear regression.

What stops people is not gradient descent — anyone can read that section. It is the two things that come next.

**The first is §1.2.1, matrix derivatives.** To avoid having to "write reams of algebra and pages full of matrices of derivatives," the notes define the gradient of a function mapping matrices to real numbers. They then use two identities — `∇x bᵀx = b`, and `∇x xᵀAx = 2Ax` when A is symmetric — to reduce the gradient of `J(θ)` to `XᵀXθ − Xᵀy` in about five lines. Neither identity is proved; you get one sentence: "for more details, see Section 4.3 of Linear Algebra Review and Reference." That [linear algebra review](https://cs229.stanford.edu/section/cs229-linalg.pdf) is public and sits on the same server. If you cannot verify those five lines yourself, every later chapter moves at the same density.

**The second is §1.3, the probabilistic interpretation.** This section assumes the error terms are i.i.d. zero-mean Gaussian, writes down the likelihood, takes logs, and lets the least-squares cost function fall out on its own. On a single page it asks you to juggle conditional probability notation, why `p(y|x; θ)` uses a semicolon rather than a comma, and why maximizing likelihood can be swapped for maximizing log-likelihood. This is the grammar lesson for the whole course: GLMs, GDA, EM, and diffusion models are all variations on it.

**Something you can do tonight**: open the notes at §1.2.2 and derive `∇θ J(θ)` from `½(Xθ − y)ᵀ(Xθ − y)` down to `XᵀXθ − Xᵀy` on paper. If it comes out, you can carry this course's mathematical load. If it doesn't, go finish CS230 or a linear algebra course first. That test beats any self-assessment rubric.

## 2018 and 2026 are not the same course

Most people self-studying CS229 are still watching Andrew Ng's version. [Stanford CS229: Machine Learning led by Andrew Ng](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU) is the autumn 2018 playlist, and lecture 1 alone has over four million views. The recordings are good, but what they teach diverges from today's CS229 more than most people assume.

Put the [autumn 2018 syllabus](https://web.archive.org/web/20190704115541/http://cs229.stanford.edu/syllabus-autumn2018.html) (Wayback capture) next to the [spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw):

| | Autumn 2018 | Spring 2026 |
|---|---|---|
| Neural networks | 2 lectures (basics, training) | 2 lectures (architecture, backprop) |
| Generative models | none | 1 lecture on diffusion |
| Representation learning | none | 1 lecture |
| Large language models | none | at least 3 lectures (next-token prediction, transformers and in-context learning, attention variants and SFT) |
| Reinforcement learning | 4 lectures, ending at POMDPs | 2 lectures, ending at PPO and RLVR for long chains of thought |
| Decision trees and ensembles | 1 lecture | none |
| Factor analysis | 1 lecture | none |
| Extra resources section | still listing Matlab and Octave tutorials | — |

Eight years ago, CS229 was a tour of machine learning algorithms with deep learning as a two-lecture guest. Today the first half is nearly untouched and the second half has been replaced by a single line running from representation learning to transformers to training reasoning models with RL. **Decision trees, ensemble methods, and factor analysis vanished from the syllabus and the notes together** — if you came for gradient boosting, this course no longer teaches it.

In the lecture on attention variants, the speaker is candid about how the remaining sessions are arranged: "the rest of the lectures are a bunch of small topics which are pretty kind of almost trivial but I have to mention all of them in some sense to clarify the concept" (from the YouTube auto-generated captions, unpunctuated; spring is split between Ma and Ré, and neither the video titles nor their descriptions identify who teaches which lecture, so which of them said this cannot be confirmed from public information).

### Two traps in the 2026 recordings

First, **the playlist is incomplete**. It has 17 videos, numbered 1 through 14 in the titles, then jumping to 16, 18, 20. The lectures in between were never posted.

Second, **the last three titles do not match their contents**. Three videos share the title "GMM (EM), PCA" — number 10 really is about GMMs and PCA, the other two are not. Open the one labeled "Lecture 18: GMM (EM), PCA" and the opening line is "Starting from this week, we're going to talk about uh reinforcement learning." Open "[Lecture 20: GMM (EM), PCA](https://www.youtube.com/watch?v=J7CossjMvEg)" and the speaker says this is the last lecture of the quarter, then covers PPO and training long chains of thought with RL. And the one labeled "Lecture 16: Basic Concept in RL, Policy Gradient" opens by reviewing the previous week's material on attention. The titles have slipped roughly one slot behind. Stanford Online offers no explanation.

Practically, this means **you cannot build a study plan off the titles in this playlist — you have to open each video and listen to the first thirty seconds.** Worth knowing too is how unevenly the views are distributed: the transformer lecture is close to a hundred thousand, the k-means lecture is a rounding error next to it. Same course, same uploader, same week.

## What the assignments look like

The current term's assignments are out of reach. But three problem sets from the summers of 2019 and 2020 are still on the server, PDFs and starter code archives both downloadable, with the datasets, `util.py`, and LaTeX answer templates included. Taking the [summer 2020 batch](https://cs229.stanford.edu/summer2020/ps1.pdf) as the reference:

- **PS1 (five problems)**: linear classifiers (derive and implement logistic regression and GDA, each twice over), an incomplete-labeling problem where only positives are labeled, Poisson regression, a proof that the negative log-likelihood of a GLM is convex, and polynomial regression with different feature maps.
- **PS2 (six problems)**: training stability of logistic regression, spam SMS classification with naive Bayes, proving the validity of eight kernel constructions, a kernelized perceptron, MNIST handwritten digit recognition, and the Bayesian interpretation of regularization.
- **PS3 (six problems)**: reinforcement learning on the inverted pendulum, KL divergence and maximum likelihood, k-means image compression, semi-supervised EM, PCA, and solving the cocktail party problem with ICA.

Each set is built on the same two-track structure — derive first, then implement — with the written and coding parts graded separately. **The watershed is problem 5 of PS2**: it is the only one that asks you to write the forward pass and backprop of a single-hidden-layer network from scratch, run it on fifty thousand MNIST training images, and then repeat the run with L2 regularization as a control. Most of the implementation work before that is translating a closed form or an iterative rule into NumPy. This one asks you to derive the chain rule yourself.

You can't route around it, because of one hard rule on the first page of every assignment: "For the coding problems, you may not use any libraries except those defined in the provided environment.yml file. In particular, ML-specific libraries such as scikit-learn are not permitted." And `environment.yml` contains only NumPy, SciPy, matplotlib, and Pillow. **No scikit-learn, no PyTorch, no TensorFlow.** This is the biggest felt difference between CS229 and CS230, and it isn't in the notes — it's in a dependency list.

One trap to know going in: that `environment.yml` pins Python 3.6.6 and NumPy 1.15.0, both long out of maintenance. The starter code doesn't reach for anything obscure, so modern versions usually run fine, but you are on your own to sort it out. Nobody is updating this for you.

## CS229 and CS230: the official line is complementary, not either-or

The map post says these two are "not either-or, they're complementary." There are two layers of official evidence behind that, and both are more explicit than the usual secondhand version.

**The first layer is the prerequisites field on ExploreCourses.** CS 230's prerequisites read: "Familiarity with programming in Python and Linear Algebra (matrix / vector multiplications). CS 229 may be taken concurrently." Note the wording — not "CS229 recommended first," but "may be taken concurrently." The division of labor is written into the course catalog.

**The second layer is in CS230's own public recordings.** In the Q&A of [autumn 2025 lecture 1](https://www.youtube.com/watch?v=_NLHFoVNlbg), a student asks outright whether the two can be taken together. Per the transcript, Ng says yes, and adds that "we designed the two curricula to be relatively low in overlap." In the same Q&A he ranks the three entry-level courses: CS129 is the most applied and the easiest to start with; CS229 is "much more mathematical and theoretical, very high-paced, very intense"; CS230 does one thing, deep learning, and does almost no mathematical proofs all quarter.

So the complementarity is real, but **it works in the opposite direction from what many people assume**. It isn't the upstream-downstream arrangement where CS229 teaches theory and CS230 teaches practice. CS229 covers a far broader range of algorithms; CS230 picks one class and drills down. The overlap is small because the two courses cut along different axes. There's a companion piece on this site about [where prompt engineering stops working](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en), written from CS230.

While we're here, one common misreading: CS229 is not a prerequisite for CS230. Nor the reverse.

## Stanford's own placement test is not the one the map post uses

The map post suggests self-assessing on whether you can get through chapter 1 of the notes. Stanford's own criterion is harsher — the Stanford Online CS229 page states it directly under the prerequisites:

> Please review the first problem set before enrolling. If this material looks too challenging, you may find this course too difficult.

That "first problem set" is a link to a [four-page PDF on see.stanford.edu](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf). The PDF was created in **October 2008**. Which is to say: Stanford Online is still using an eighteen-year-old open-courseware assignment as the entrance self-test for a 2026 course.

The interesting part is that it still works as a test. Problem 1 of that PS1 asks you to prove that Newton's method applied to least squares converges to the optimum in one iteration — which requires computing the Hessian of the cost function yourself. Problem 2 asks you to implement the Newton-Raphson iteration for locally weighted logistic regression. Between them they hit exactly the two hard points from chapter 1 of the notes: matrix derivatives and a probabilistically framed objective. **It hasn't been replaced in eighteen years because the bar itself never moved.**

You can use both criteria together: read chapter 1 to find out whether you can **keep up**, and do the 2008 PS1 to find out whether you can **actually work**. The second one hurts more, and tells you more.

## What a self-learner actually gets

Item by item, the have and have-not columns are cleanly separated:

| Material | Status | Frozen at |
|---|---|---|
| Main notes PDF | ✅ Public, 278 pages | 2026 (actively updated) |
| Linear algebra / probability / convex optimization / Gaussians review notes | ✅ Public | Older versions, but the content doesn't expire |
| 2018 Andrew Ng recordings | ✅ Complete | 2018 |
| Spring 2026 recordings | ⚠️ Only 17 videos, later titles mislabeled | 2026 |
| Problem sets 1–3 plus starter code and datasets | ✅ Public | 2020 |
| Problem set 4 and the midterm | ❌ | — |
| Official solutions | ❌ | — |
| Autograder | ❌ Ran on private Gradescope test sets at the time | — |
| Current syllabus, schedule, project handouts | ❌ Locked to a Stanford account | — |
| Final project showcase | ❌ No public entry point for recent terms | — |

The most painful item is **no solutions and no grader**. CS229's assignments are heavy on derivation, and derivations are exactly where you most need to hear "is this step right?" You can get the problems and the data, but nobody is going to read your proof. The coding problems fare a little better — the datasets ship with valid and test splits, and the starter code writes predictions to a file, so you can at least see whether your accuracy is in a sane range.

The second most painful is that **the other half of the course is simply absent**. The final project carries real weight in every syllabus, and it is where CS229 turns knowledge into ability. What a self-learner gets is the notes plus the assignments — half of the course.

## How to start

If you have one hour tonight, do this: download the [four-page PS1 from 2008](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf) and finish problem 1 — compute the Hessian of `J(θ)`, then prove that the first Newton iteration lands on `θ* = (XᵀX)⁻¹Xᵀy`. If you can do it, go straight into CS229. If you stall at the Hessian, shore up matrix calculus first; section 4 of the [linear algebra review](https://cs229.stanford.edu/section/cs229-linalg.pdf) was written for exactly this.

Once you've decided to go, sequence it like this. Read parts I through IV of the notes alongside Ng's 2018 recordings — **the first half has barely changed in eight years, and Ng's spoken explanations are still the best available**. When you reach part V (generative models and foundation models), switch to the spring 2026 playlist, because the 2018 version contains none of that material. For assignments, use the three from 2020: after each part of the notes, go back and do the corresponding problems. Don't skip the MNIST one.

The one-line version: **old recordings with new notes, assignments with the starter code, and a 2008 PDF as the placement test.**

## Appendix: numbers and how they were verified

- **Notes version**: `https://cs229.stanford.edu/main_notes.pdf` fetched 2026-08-21, `Last-Modified: Wed, 19 Aug 2026`, internal PDF `CreationDate` 2026-08-18 (PDT), 278 pages, produced by pdfTeX-1.40.21. The title page credits Tengyu Ma and Andrew Ng in that order; an older version cached by search engines credits Andrew Ng and Tengyu Ma and is dated June 11, 2023. The header string on the table of contents reads "CS229 Spring 2022".
- **2022 comparison version**: `https://cs229.stanford.edu/notes2022fall/main_notes.pdf`, 216 pages, `CreationDate` 2022-05-18. Its chapter 14, "Self-supervised learning and foundation models," spans pp.167–174. The corresponding part V in the 2026 version, "Generative models and Foundation Models," spans pp.179–225 and contains chapter 14 on diffusion models, 15 on the foundation model overview (including LoRA), 16 on representation learning (including semantic retrieval and RAG), 17 on large language models, and 18 on reasoning in LLMs (chain-of-thought and RLVR).
- **Chapter 1 page numbers**: in the 2026 version, chapter 1, Linear regression, runs pp.9–20, with four sections: LMS algorithm, The normal equations, Probabilistic interpretation, Locally weighted linear regression. The housing example uses 47 data points from Portland.
- **Offering records**: ExploreCourses shows CS 229 offered in all four quarters of 2025-2026, 3–4 units, cross-listed as STATS 229. For 2026-2027 it currently lists winter (Emily Fox) and spring (Tengyu Ma, Chris Ré). The course site currently shows Summer 2026 (Jehangir Amjad, Anand Avati).
- **Spring 2026 playlist**: `PLaqpC4kq8Gpw`, 17 videos, last updated 2026-07-31. Title numbering runs 1–14, 16, 18, 20. Three videos are titled "GMM (EM), PCA" and sit at positions 10, 16, and 17 in the list. The view-count spread comes from the playlist page on 2026-08-21: Lecture 14 (Transformers) around 99K, Lecture 9 (K-Means and GMM) around 1.5K.
- **2018 syllabus**: `syllabus-autumn2018.html` as captured by the Wayback Machine on 2019-07-04. Twenty lectures, grouped as Introduction (1), Supervised learning (6), Learning theory (2), Deep Learning (2), Unsupervised learning (5), Reinforcement learning and control (4). Assignments were ps0 plus ps1–ps4, along with a take-home midterm and a final project with four deliverables (proposal, milestone, poster, final writeup).
- **Assignment availability**: `summer2019/ps1–ps3.pdf`, `summer2020/ps1–ps3.pdf`, and the matching `.zip` files all return 200; `ps0`, `ps4`, and `ps5` return 404. PS1 is 14 pages / 5 problems / 135 points, PS2 is 13 pages / 6 problems / 120 points, PS3 is 14 pages / 6 problems / 125 points. `environment.yml` specifies python=3.6.6, numpy=1.15.0, matplotlib=2.2.2, scipy, pillow. The MNIST problem uses a 50,000 train / 10,000 dev split, plus 10,000 test.
- **Review notes still downloadable**: `section/cs229-linalg.pdf`, `section/cs229-prob.pdf`, `section/cs229-cvxopt.pdf`, and `section/cs229-gaussians.pdf` all return 200; the older per-topic notes listed on the 2018 syllabus, such as `notes/cs229-notes1.pdf`, all return 404.
- **Self-test problem set**: `https://see.stanford.edu/materials/aimlcs229/problemset1.pdf`, 4 pages, PDF `CreationDate` 2008-10-06. The header reads "CS 229, Public Course".
- **Not confirmed**: (1) why lectures 15, 17, and 19 are missing from the spring 2026 recordings, and why the last three titles are misaligned — neither the Stanford Online page nor the playlist description says anything; (2) the grade breakdown (assignments / midterm / project) for any quarter of CS229 — the current syllabus is locked behind a Stanford account and this post obtained no official breakdown for any term, so it does not discuss grade weighting at all; (3) whether a public showcase of recent final projects exists anywhere — none found; (4) whether problem sets from years other than 2019 and 2020 remain on the server — only the summer2019 and summer2020 paths were tested.

## References

- [CS229: Machine Learning course site (Summer 2026)](https://cs229.stanford.edu/) — the prerequisites text, the statement that materials are for Stanford affiliates only, and the index of past offerings
- [CS229 Spring 2026 course page](https://cs229.stanford.edu/index.html-spr26) — the Tengyu Ma and Chris Ré quarter, the one the 2026 recordings come from
- [CS229 Fall 2022 course page](https://cs229.stanford.edu/syllabus-fall2022.html) — the older course description and the link to the frozen 2022 notes
- [CS229 lecture notes, main_notes.pdf](https://cs229.stanford.edu/main_notes.pdf) — 278 pages; the six-part structure, chapter 1's content and difficulty, and the LLM chapters in part V
- [CS229 frozen autumn 2022 notes](https://cs229.stanford.edu/notes2022fall/main_notes.pdf) — 216 pages, used to locate where the four years of additions landed
- [Linear Algebra Review and Reference](https://cs229.stanford.edu/section/cs229-linalg.pdf) — the supplementary material chapter 1's matrix derivative lines point to
- [ExploreCourses: CS 229](https://explorecourses.stanford.edu/search?q=CS+229&view=catalog) — four offerings a year, four different teaching teams, the STATS 229 cross-listing, and the "CS 229 may be taken concurrently" line in CS 230's prerequisites
- [Stanford Online: CS229 course page](https://online.stanford.edu/courses/cs229-machine-learning) — the SCPD admission bar and the official "review the first problem set before enrolling" advice
- [SEE open course Problem Set 1](https://see.stanford.edu/materials/aimlcs229/problemset1.pdf) — the self-test itself, 4 pages, created in 2008
- [CS229 Summer 2020 Problem Set 1](https://cs229.stanford.edu/summer2020/ps1.pdf) — the problem structure and the source of the "no scikit-learn" rule
- [CS229 Summer 2020 Problem Set 2](https://cs229.stanford.edu/summer2020/ps2.pdf) — the hand-written MNIST backprop problem
- [CS229 Summer 2020 Problem Set 3](https://cs229.stanford.edu/summer2020/ps3.pdf) — inverted pendulum RL, semi-supervised EM, ICA and the cocktail party
- [CS229 Autumn 2018 syllabus (Wayback capture)](https://web.archive.org/web/20190704115541/http://cs229.stanford.edu/syllabus-autumn2018.html) — the full twenty-lecture grouping and assignment schedule, the source for the 2018/2026 comparison
- [Stanford CS229 Machine Learning, Spring 2026 playlist](https://www.youtube.com/playlist?list=PLaqpC4kq8Gpw) — 17 videos, gaps in the numbering, three identical titles
- [Spring 2026 "Lecture 20: GMM (EM), PCA"](https://www.youtube.com/watch?v=J7CossjMvEg) — actually the final lecture, on PPO and RLVR for long chains of thought
- [Stanford CS229: Machine Learning led by Andrew Ng, Autumn 2018 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU) — the version most self-learners watch
- [Stanford CS230 Autumn 2025 Lecture 1](https://www.youtube.com/watch?v=_NLHFoVNlbg) — the Q&A where Andrew Ng positions CS129, CS229, and CS230, and answers that the two can be taken together
- On this site: [Reading Stanford's CS courses: the map](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Reading Stanford CS329A](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
- On this site: [CS230: when prompt engineering stops working](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en)
