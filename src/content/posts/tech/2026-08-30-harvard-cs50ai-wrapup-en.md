---
title: "Course Retrospective and Next Steps: What Seven Weeks Taught, What They Left Out, What to Read Next | Harvard CS50 AI Topic Guide"
date: 2026-08-30
category: tech
type: deep-dive
tags: [harvard-cs50ai, cs50, ai, wrapup, learning-path, python]
lang: en
series:
  name: "Reading Harvard CS50 AI"
  order: 10
tldr: "The last post in the series: one table reviewing what each of the seven weeks taught and which projects it had; in 2023 the course replaced Week 6 with a new version that reaches attention and the Transformer, while the other six weeks remain 2020 recordings; the lectures do not teach how to use today's language models. The second half links to this site's overviews of nine follow-up courses, by where you want to go. Includes three review self-check questions."
description: "Retrospective and next steps for the Harvard CS50 AI series: a one-page review of the seven weeks and twelve projects (linked to the weekly guides), what Week 6 replaced in 2023, which topics common today none of the seven recordings covers, what the free self-study route has and lacks, and which of this site's nine follow-up course overviews to pick up from. Course content follows this series' rewritten weekly guides and the course site; the choice of follow-up path is this site's judgment. This post is this site's own review, not any week's lecture."
draft: false
---

> 🌏 [中文版](/posts/tech/2026-08-30-harvard-cs50ai-wrapup)

**Video status: Official entry or recording index only.** This post is a course retrospective written by this site, not any week's lecture, and there is no official video for it; each week's lecture recording and time links are in the weekly guides. [Source details](#course-video-sources)

> ⚠️ **Version note**: Of the lecture recordings in this series, Weeks 0–5 are titled **2020** and Week 6 is titled **2023**; project specs follow the 2026 course site.

## TL;DR

CS50 AI spends four weeks on methods that do not learn from data (search, logic, probability, optimization) and three weeks on machine learning, neural networks, and language, with twelve projects so that you write each topic once yourself. Of the seven weeks only Week 6 has changed versions: the new 2023 version reaches attention and the Transformer, and its project changed from Questions to Attention. What the lectures do not teach is how to use today's language models.

This post has two kinds of content. The first four sections are about the course itself, following the weekly guides and the course site, with a link for every item. The fifth, "What to read next", is this site's judgment: which follow-up course overviews exist on this site and where each fits.

## What the seven weeks taught

Each row is taken from that week's guide; the details, examples, and time links into the recording are in the linked post.

| Week | What the lecture teaches | Projects |
|---|---|---|
| [Week 0 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en) | Writing a problem as states, actions, and a goal; DFS, BFS, greedy best-first, A\*; Minimax and alpha-beta pruning when there is an opponent | [Degrees](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#project-0a-degrees--bfs-for-actor-degrees-of-separation), [Tic-Tac-Toe](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en#project-0b-tic-tac-toe--minimax-optimal-play) |
| [Week 1 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en) | Propositional logic; model checking, which enumerates every truth assignment; inference rules and resolution; first-order logic | [Knights](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#project-1a-knights--logic-puzzle-solver), [Minesweeper](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en#project-1b-minesweeper--minesweeper-ai) |
| [Week 2 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en) | Conditional probability and Bayes' rule; Bayesian networks; inference by enumeration and sampling; Markov chains and hidden Markov models | [Heredity](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#project-2a-heredity--inferring-genes-and-traits-with-a-bayesian-network), [PageRank](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en#project-2b-pagerank--sampling-and-iterative-algorithms) |
| [Week 3 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en) | Hill climbing and simulated annealing; linear programming; AC-3 and backtracking search for constraint satisfaction problems | [Crossword](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en#project-3-crossword--csp-crossword-puzzle-generation) |
| [Week 4 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en) | Nearest neighbor, the perceptron, support vector machines, regression; remedies for overfitting; Q-learning; k-means | [Shopping](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#project-4a-shopping--k-nn-purchase-intent-prediction), [Nim](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en#project-4b-nim--q-learning-learns-to-play) |
| [Week 5 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en) | Units and activation functions; gradient descent; hidden layers and backpropagation; CNNs; RNNs | [Traffic](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en#project-5-traffic--cnn-training-for-traffic-sign-classification) |
| [Week 6 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en) | Context-free grammar; n-grams and Naive Bayes; word2vec; the RNN encoder–decoder; attention and the Transformer | [Parser](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#project-6a-parser--parsing-sentences-with-a-cfg-and-extracting-noun-phrases), [Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#project-6b-attention--predicting-a-masked-word-with-bert-and-drawing-every-attention-head) |

How the weeks connect and which methods are replaced by later ones is laid out in [cross-week review 1](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en); the comparison of the twelve projects is in [cross-week review 2](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en).

In 2026 the course site still uses the 2020 recordings of Weeks 0–5 as its current material, and the 2026 for-credit Harvard Summer School section, CSCI S-80, also uses the 2020 recordings (see this site's [Harvard AI/ML course map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en)).

## What the course changed in 2023

Of the seven weeks only Week 6 has changed versions. The three points below follow the [Week 6 guide](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en) and the course site:

- **Lecture**: the official notes state that the new Week 6 lecture was released on 2023-08-14. It reaches [attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#attention-letting-the-decoder-decide-where-in-the-input-to-look) and [the Transformer](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#the-transformer-encoder-parallel-processing-positional-encoding-and-self-attention) and does not teach TF-IDF.
- **Projects**: the 2020 edition's Week 6 project Questions (TF-IDF question answering) is no longer listed on the current site; it was replaced by [Attention](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#project-6b-attention--predicting-a-masked-word-with-bert-and-drawing-every-attention-head), which uses a pre-trained BERT to predict a masked word and draws each attention head as a diagram. The Parser project remains.
- **The other six weeks**: the lecture recordings stay at the 2020 version. The projects' distribution code downloads from a `2023/x` path and the check50 slugs are `ai50/projects/2024/x/...`, so always use the download URL and commands on the official spec page when doing a project.

## What the course does not teach

These are topics common today that this site checked against the transcripts of the seven recordings and confirmed the lecturer does not cover. The claim is "not in these recordings"; it is not a judgment about how important the topics are.

- **How to use language models**: writing prompts, RAG, fine-tuning. The course site's introduction mentions large language models; the corresponding lecture content is the Transformer architecture in Week 6, and it stops at the architecture.
- **Week 2**: exact inference methods faster than enumeration, such as variable elimination. The lecturer only mentions that enumeration can be sped up by avoiding repeated computation, without giving a method or a name, and then moves on to sampling.
- **Week 4**: kernels for support vector machines. The lecturer says an SVM can work in higher dimensions to find a boundary, for example separating data that is not linearly separable with a circle; the word "kernel" and the actual method do not appear.
- **Week 5**: the calculus of backpropagation. The lecturer says explicitly that he will not cover it and gives only the procedure.
- **Used by projects but not taught in lecture**: PageRank's iterative formula, Shopping's sensitivity and specificity, and Attention's BERT are all on the spec pages.

## What the free self-study route has and lacks

**What it has** (per the course site and the project spec pages):

1. **The materials are public**: each week's lecture page has video, audio, slides, notes, lecture source code, subtitles, a transcript, and a quiz; each project has a spec page and distribution code.
2. **Autograding**: `check50` runs on your own machine; after you submit with `submit50`, the spec pages say work should be graded within five minutes, with progress shown in the Gradebook. Submitting requires an edX account and a GitHub account.
3. **The certificate is free**: score at least 70% on every project and you can claim a free CS50 Certificate. Knights is the exception: the spec says it must be 100% correct to pass.
4. **There is somewhere to ask**: the course site lists the course's communities, and the spec pages also say you can ask questions on Ed.

**What it lacks** (met while this series ran and checked the material):

1. **Packages keep changing; the recordings and specs do not follow**: Week 6's Attention project, installed straight from the official `requirements.txt`, did not run on 2026-10-13; the [Week 6 guide](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en#project-6b-attention--predicting-a-masked-word-with-bert-and-drawing-every-attention-head) records a combination of versions that works. The spec pages state that the latest Python to use in this course is 3.12.
2. **The recordings do not introduce the projects**: none of the seven lecture recordings mentions that week's project assignment, so what a project asks for can only be read from the spec page.
3. **The math stays conceptual**: the official prerequisite lists no math; probability is taught from its definitions in Week 2, and Week 5 skips the calculus.
4. **No applications of language models**: see the previous section.

## What to read next

This section is this site's suggestion, checked on 2026-10-13: on that day both language versions of the nine posts below were confirmed to exist, and each description was checked against that post's own summary. They are course overviews already written on this site; what each course teaches and which materials are public follows each post's own account. "Where it fits after CS50 AI" is this site's arrangement by topic, not the official prerequisite statement of any of these courses; for each course's actual prerequisites, see its overview.

**To cover the same range again, in more depth**

- [Berkeley CS188 course overview](/posts/learning/2026-08-22-berkeley-cs188-sp26-overview-en): also an introductory AI course; four of its six projects are set in Pacman.
- [Stanford CS221 course overview](/posts/ai/2026-08-21-stanford-cs221-ai-principles-en): arranges AI in four layers (reflex, states, variables, logic), with public notes and eight assignments.

**To fill in the math behind Weeks 2, 4, and 5**

- [Stanford CS229 course overview](/posts/ai/2026-08-21-stanford-cs229-machine-learning-en): works through the mathematical derivations of machine learning; follows Weeks 4 and 5.
- [Stanford CS228 course overview](/posts/ai/2026-08-21-stanford-cs228-graphical-models-en): probabilistic graphical models; follows Week 2's Bayesian networks and inference.

**To head toward reinforcement learning**

- [Stanford CS234 course overview](/posts/ai/2026-09-30-cs234-course-overview-en): from planning in an MDP with a known model to policy gradients; follows Week 4's Markov decision process and Q-learning.

**To head toward language models**

- [Stanford CS224N course overview](/posts/ai/2026-08-21-stanford-cs224n-nlp-deep-learning-en): from word vectors and backpropagation to the Transformer, with an assignment in which you write a decoder-only Transformer yourself; follows Week 6.
- [Stanford CME295 course overview](/posts/ai/2026-09-29-cme295-course-overview-en): nine lectures from the Transformer to agents, with no assignments.
- [Stanford CS336 course overview](/posts/ai/2026-08-21-stanford-cs336-language-modeling-from-scratch-en): building a language model from scratch; five assignments with no starter skeleton, and from the second one on you supply your own compute.

**To take a course taught in Mandarin**

- [NTU Hung-yi Lee Machine Learning course overview](/posts/ai/2026-09-30-ntu-ml2026-course-overview-en): the Spring 2026 edition starts from AI agents; slides, recordings, and assignments are public.

How open each school's courses are and how their prerequisites relate is laid out in the [global AI/CS course map](/posts/learning/2026-08-21-global-ai-cs-course-map-en).

## Review self-check

All three questions were made up for this post, and each answer can be found in this post or in the posts it links to.

**Check yourself. Write your answer down before opening the fold.** Which of these six do the CS50 AI lectures teach, and in which week? A\* search, RAG, dropout, TF-IDF, k-means, writing prompts.

<details>
<summary>Answer</summary>

Three are taught: A\* search in Week 0, k-means in Week 4, dropout in Week 5.

Three are not: RAG and writing prompts appear in none of the seven recordings. TF-IDF was only in the 2020 edition of Week 6; the current 2023 lecture does not teach it, and the corresponding Questions project has been replaced by Attention.

</details>

**Check yourself. Write your answer down before opening the fold.** Someone scores 80% on eleven of the twelve projects and 90% on Knights. By the official statements, can they claim the CS50 Certificate?

<details>
<summary>Answer</summary>

Not yet. The certificate page's condition is at least 70% on every project, but the Knights spec page separately says that this one must be 100% correct to pass, an exception to the course's usual 70%. They need to get Knights fully correct. "Knights not passed means the certificate condition is not met" is this site's conclusion from reading the two pages together.

</details>

**Check yourself. Write your answer down before opening the fold.** Before doing Week 3's Crossword you find an old set of starter code under a `2020` path. Should you use it? Why?

<details>
<summary>Answer</summary>

No. The current project's distribution code downloads from a `2023/x` path, and check50 uses the slug `ai50/projects/2024/x/...`, so grading is against the current spec. The practice is to use the download URL and check50 command on each project's official spec page, and not to piece things together with files from another year.

</details>

## Series Links

This series has eleven posts in all: the course overview, seven weekly guides, two cross-week reviews, and this one. The lectures are given by Brian Yu; the header of the course site shows his name alongside David J. Malan's, and the edX course page lists both as instructors. The materials and autograding are made public and maintained by the CS50 team.

- [Course overview](/posts/ai/2026-08-26-harvard-cs50-ai-guide-en)
- [Week 0 Search](/posts/tech/2026-08-27-harvard-cs50ai-w00-search-en)
- [Week 1 Knowledge](/posts/tech/2026-08-30-harvard-cs50ai-w01-knowledge-en)
- [Week 2 Uncertainty](/posts/tech/2026-08-30-harvard-cs50ai-w02-uncertainty-en)
- [Week 3 Optimization](/posts/tech/2026-08-30-harvard-cs50ai-w03-optimization-en)
- [Week 4 Learning](/posts/tech/2026-08-30-harvard-cs50ai-w04-learning-en)
- [Week 5 Neural Networks](/posts/tech/2026-08-30-harvard-cs50ai-w05-neural-networks-en)
- [Week 6 Language](/posts/tech/2026-08-30-harvard-cs50ai-w06-language-en)
- [Cross-week review 1: how ideas connect and replace one another](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-1-en)
- [Cross-week review 2: which lecture material each of the twelve projects uses](/posts/tech/2026-08-30-harvard-cs50ai-synthesis-2-en)
- **Course retrospective and what to read next (this post)**

## Course video sources

This post is a course retrospective written by this site; it corresponds to no particular week and embeds no video. Wherever it discusses a week's content it links to that week's guide, where the player and time links are. The official CS50 YouTube playlist (8 videos: an introduction plus the Week 0–6 lectures) was checked live on 2026-10-10 and contains no course retrospective video.

Course and recording entries:

- [CS50 AI — official course playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- [CS50 AI — official course page](https://cs50.harvard.edu/ai/)

Checked: 2026-10-10.

## Update Log

- 2026-10-10: Added explicit video status and checked recording sources and access notes.
- 2026-10-10: Rechecked video status. The official playlist was checked live; no recording corresponds to this post, so the status stays official entry only.
- 2026-10-13: Brought the Week 6 description in line with the current course: the projects are Parser and Attention, and TF-IDF and the Questions project are in the 2020 edition only; "CFG / CYK" in the comparison table is now "CFG", since the course does not teach CYK.
- 2026-10-13: Rewritten from scratch against the rewritten weekly guides and the course site. The "What's Timeless" section listed many things the lectures do not cover (D-separation, conditional independence, variational inference, the chain rule and computation graphs, various optimizers, translation invariance, ablation studies) and is now a review table written from the weekly guides. The "superseded" comparison table was removed in full, including its TF-IDF row: its statements about current industry practice carried no sources (for example "dense retrieval fully replaces sparse vectors"), and the current course does not teach TF-IDF. The former roadmap, external resource list, and "advice by goal" table were removed, since their tool names, week counts, and month counts had no basis; they are replaced with links to this site's overviews of nine follow-up courses, marked as this site's judgment. Corrections: the recordings did not "miss the Transformer", since Week 6 covers it; the certificate condition now notes the 100% exception for Knights; "ten posts" corrected to eleven; removed "an experience usually reserved for paid courses", "countless GitHub reference implementations", and the invented closing quotation. Added three review self-check questions. The title now states what the post actually contains; the scope label stays "Topic Guide".
- 2026-10-13: Fixes from independent review: the lectures are given by Brian Yu (the post said both instructors taught); the variable elimination item now notes that the lecturer mentions enumeration can avoid repeated computation; the subheading under "What to read next" now reads Weeks 2, 4, and 5; the tags career and llm were removed.
- 2026-10-14: Fixes from re-review: the statement about instructors now follows the course site header and the edX course page (the header shows both names, and the edX course page lists both as instructors). The tag retrospective was also removed.

## References

- [CS50 AI course site](https://cs50.harvard.edu/ai/) — Course introduction, how to take the course, communities
- [Week 0 Search lecture page](https://cs50.harvard.edu/ai/weeks/0/) — The kinds of material each weekly lecture page provides
- [Week 6 Language lecture page](https://cs50.harvard.edu/ai/weeks/6/) — The current Week 6 lecture and projects
- [CS50 Certificate Info](https://cs50.harvard.edu/ai/certificate/) — Free certificate conditions
- [Knights project spec](https://cs50.harvard.edu/ai/projects/1/knights/) — The 100%-to-pass exception, grading within five minutes, asking on Ed
- [CS50 AI YouTube Playlist](https://www.youtube.com/playlist?list=PLhQjrBD2T381PopUTYtMSstgk-hsTGkVm)
- On this site: [Global AI/CS Course Map](/posts/learning/2026-08-21-global-ai-cs-course-map-en) — A3 Tier Definition
- On this site: [Harvard AI/ML Course Map](/posts/learning/2026-08-22-harvard-ai-ml-course-map-en) — CSCI S-80 Version Mapping
