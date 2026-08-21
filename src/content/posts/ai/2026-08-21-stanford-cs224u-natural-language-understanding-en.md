---
title: "Stanford CS224U: The Course Site Stopped in Spring 2023, but You Can Clone the Whole Thing"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs224u, ai-course, stanford, nlp, evaluation, dspy]
lang: en
series:
  name: "Reading Stanford CS224U"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 13
tldr: "CS224U's teaching material isn't a slide deck — it's an Apache-2.0 GitHub repo holding the lecture notebooks, all three assignments, and the grading document for the final project. But the on-campus course has skipped three straight academic years since Spring 2023, and ExploreCourses has it back on the books for Spring 2026-27. The official description still lists relation extraction and semantic parsing; the 2023 syllabus covers neither. And the data-loading cell in the first assignment breaks in a fresh environment today, on a Hugging Face compatibility change."
description: "A full walkthrough of Stanford CS224U: Natural Language Understanding, built from the course site, the GitHub repo, the slide PDFs, and ExploreCourses' raw data: how it splits work with CS224N, what the three assignments actually ask for, what the final-project grading document demands, and what a self-learner can get hold of and run today."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs224u-natural-language-understanding)

[CS224U: Natural Language Understanding](https://web.stanford.edu/class/cs224u/) is Stanford's project-driven NLP course, cross-listed under Linguistics and Symbolic Systems and taught by linguistics professor [Christopher Potts](https://web.stanford.edu/~cgpotts/). The official prerequisite is a single line: CS224N or CS224S.

Its reputation among self-learners comes less from lecture videos than from its [GitHub repo](https://github.com/cgpotts/cs224u/). A full quarter of lecture notebooks, all three assignments, the model code, and even the long document explaining how to run a final project — all of it sits in the repo under Apache 2.0, one `git clone` away. That is rare for a Stanford AI course; most of them keep assignment starter code behind Canvas or Gradescope.

This piece is about what happens once you're inside. How the course divides labor with CS224N, what each of the three assignments asks you to build, what the final-project grading document locks down, and whether a fresh clone still runs **today**.

It does **not** do a paper-by-paper close reading, and it does not cover the course materials inside XCS224U, the paid online version — those live behind a login I don't have.

## The hard facts

Start with the thing people get wrong most often: **the course site is frozen in Spring 2023.** Open it and the header says "Spring 2023" — teaching staff, syllabus, and due dates are all from that quarter. `cs224u.stanford.edu` just redirects to the same page.

Stanford's archive holds exactly [one snapshot](https://web.stanford.edu/class/archive/cs/cs224u/cs224u.1236/) of the course, and it's that quarter. Every archive URL for the years since returns a 404.

ExploreCourses' public data points the same way. Query CS 224U year by year through its XML interface and the catalog entry is always there — but the `sections` element is **empty for three consecutive academic years**. Listed in the catalog, never actually taught. Not until 2026-27 does a spring section reappear, with the instructor field currently blank.

Potts' own [teaching page](https://web.stanford.edu/~cgpotts/teaching.html) agrees. The last year he lists the on-campus CS 224u is 2022-23. Every year after that, the only entry is the online XCS 224u, run through the Stanford Center for Professional Development.

The rest of the facts: 3 to 4 units, Letter or Credit/No Credit. The course page states up front that it can be completed entirely online and asynchronously, and the [intro slides](https://web.stanford.edu/class/cs224u/slides/cs224u-intro-2023-handout.pdf) say every session is recorded with no attendance requirement. That's an offer to enrolled students, though — the recordings sit behind Canvas and Panopto.

Nothing on the official pages mentions auditing from outside. The only paid door is [XCS224U](https://online.stanford.edu/courses/xcs224u-natural-language-understanding), whose most recent cohort ran in spring 2025 and which currently shows enrollment closed.

## The official description describes a different course

The CS 224U [course description](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog) on ExploreCourses (2026-27 edition, verbatim) lists these topics:

> Topics include lexical semantics, distributed representations of meaning, relation extraction, semantic parsing, sentiment analysis, and dialogue agents

Hold that list up against the 2023 syllabus and it doesn't match. That quarter had five unit titles: Domain adaptation for supervised sentiment, Retrieval augmented in-context learning, Advanced behavioral evaluation, Analysis methods, NLP methods — then a stretch of project time. No relation extraction. No semantic parsing. No dialogue agents.

The list isn't invented, though. Open the [2019 course site on the same domain](https://web.stanford.edu/class/cs224u/2019/) and the syllabus spells them out: distributed word representations, supervised sentiment analysis, relation extraction with distant supervision, NLI models, grounded language understanding, semantic parsing, contextual word representations.

**The course description describes the course as it was four years ago** — and it is still the text attached to the 2026-27 catalog entry.

Anyone planning around a catalog listing should take note: **the description field does not track the syllabus.** To learn what a Stanford course actually teaches, read the syllabus on its course site, not the catalog.

## What it adds on top of CS224N

The description doesn't say how the two courses divide the work. Potts does, in the first lecture:

> CS224n is a prerequisite for this course, so we are going to skip a lot of the fundamentals we have covered in past years.

That sentence left a physical trace in the repo. The [README](https://github.com/cgpotts/cs224u/) annotates each directory with its purpose, and a whole batch carries the same label: `This is now considered background material for the course`. It covers `vsm_*` (vector space models, PMI, LSA, GloVe), `sst_*` (supervised learning on the Stanford Sentiment Treebank), `finetuning.ipynb`, and the pure-NumPy `np_*.py` implementations.

**This material used to be the core of the course.** Distributed word representations was the second lecture in 2019. It has since been demoted to "read it if you need a refresher."

The space that freed up became the five units of 2023. The course's own [background materials page](https://web.stanford.edu/class/cs224u/background.html) draws the cleanest line: everything on that page is something CS224N already covers and CS224U no longer spends time on.

The interesting part is that the boundary is moving in the other direction too. [CS224N's current site](https://web.stanford.edu/class/cs224n/), taught by Diyi Yang and Yejin Choi, has a lecture called "Agents, Tool Use, and RAG" and another called "Benchmarking and Evaluation" — two of the five directions CS224U staked out in 2023.

**Both things are simply true at the same time.** No official page connects them, and no page anywhere explains why CS224U went three years without an offering. All I found is the phenomenon: a course whose site stopped in 2023, while over the same period its prerequisite broadened its topic range. The cause isn't written down.

## The most counterintuitive lecture: a zero hiding under 83%

If you read only one piece of the public material, make it the [advanced behavioral evaluation](https://web.stanford.edu/class/cs224u/slides/cs224u-behavioraleval-2023-handout.pdf) slides. What they do is take the question "what did this model score on the benchmark" apart entirely.

The lecture puts up a table of COGS results. COGS is a compositional generalization test: show the model an English sentence, ask it to emit a logical form. The generalization items split into lexical (swap a word) and structural (swap a structure). The overall column looks like an ordinary leaderboard, some models higher, some lower.

Break out the structural columns, though, and two of them — `Obj PP → Subj PP` and `CP Recursion` — are **zero for nearly every model**, including T5, which sits near the top on overall. The lexical column, meanwhile, is mostly above 90. One average had blended "does this perfectly" and "cannot do this at all" into "does this reasonably well."

The lecture then turns to follow-up work from Potts' own lab, [ReCOGS](https://arxiv.org/abs/2303.13716) (arXiv:2303.13716), whose claim is more counterintuitive still: a substantial share of those zeros aren't a failure to understand meaning, they're the model tripping over the **notational conventions** of the logical form. COGS numbers its variables by each word's linear position in the sentence, and carries a batch of redundant tokens that can simply be deleted.

The slides mark this explicitly as a Hypothesis plus a Result. The hypothesis: the training data taught models that prepositional phrases only ever appear at particular variables and positions. The result: change those conventions and both LSTM and Transformer scores rise sharply. Even after the fix the task is not easy — the course's phrasing is that ReCOGS remains challenging.

**The measuring stick from this lecture transfers directly.** Next time you see a benchmark's headline number, ask whether some column underneath it is a flat zero, and how much of the score is measuring output formatting rather than capability. The course uses one of its own papers to demonstrate how to separate the two.

## What the assignments look like

Three of them, each an assignment plus a bake-off: the assignment carries most of the points, and throwing your original system into a class-wide competition earns one more. **The highest-weighted question in every assignment is "Your original system"** — and the grading rule is blunt.

The [policy page](https://web.stanford.edu/class/cs224u/requirements.html) says that a creative, well-motivated system earns full marks even if it does poorly on the bake-off data: "Systems that are very creative and well-motivated will be given full credit even if they do not perform well on the bakeoff data. We want to encourage creative exploration!" The reverse is locked down just as firmly: download someone else's code, retrain, submit, and you get nothing, however handsome the bake-off score. That rule appears twice — once on the policy page and once in the intro slides — one of the few things this course repeats.

Assignment by assignment (the notebooks all live in the repo root):

**[hw_sentiment.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_sentiment.ipynb): multi-domain sentiment analysis.** The data is two rounds of DynaSent plus SST. Question 1 is scikit-learn feature functions and a linear classifier; Question 2 moves into Transformer fine-tuning (tokenize, pull contextual representations, write a fine-tuning module). Question 1 is doable on CPU alone.

**[hw_openqa.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_openqa.ipynb): few-shot OpenQA with [DSPy](https://dspy.ai). This is the watershed.** It asks you to line up three things at once: an OpenAI API key, ColBERTv2 pretrained weights, and a prebuilt ColBERT index (the one on the course site is a 600 MB archive). The notebook says the quiet part out loud — at this model scale you either pay for the API, pay for a cluster, or pay in time on a smaller machine. Neither of the other two assignments asks you to spend money. This one does.

**[hw_recogs.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_recogs.ipynb): compositional generalization.** The counterpart to the lecture above. It opens with something modest — write a comparison function that surfaces the proper nouns the model struggles with — then swings back to DSPy for in-context learning.

The original-system question here offers four routes: write a DSPy program, keep training the model the course supplies, adapt a pretrained model, or train a seq2seq model from scratch.

## The final project: what that grading document actually wants

The project is half the grade, submitted in three stages: literature review, experiment protocol, final paper. The requirements live in the repo, in [projects.md](https://github.com/cgpotts/cs224u/blob/main/projects.md) — a document of nearly forty thousand characters that doubles as a course on how to run a research project in NLP.

The line most worth quoting:

> We will never evaluate a project based on how "good" the results are.

The document then names three real axes: whether the metrics suit the problem, whether the method is sound, and **how clearly the paper states the limits of its own findings**. The stated reason is that publication venues favor positive results because page space is finite; a course has no such constraint, so positive results, negative results, and everything in between count equally.

Other rules it fixes in place:

- **The number of papers in the literature review scales with team size**: 5 for one person, 7 for two, 9 for three. The material reviewed doesn't have to be NLP papers — books, sufficiently good blog posts, and government reports all qualify.
- All three submissions use ACL formatting, and the final paper **must** use the designated template.
- The final paper carries two sections peculiar to this course: `Known project limitations` (imagine a well-meaning practitioner about to use your data or model — what do they need to know?) and `Authorship statement` (required even for a single author, because the course wants to know whether the project involved collaborators from outside Stanford).
- The experiment protocol is **not a preregistration**. The document says outright that plans change all the time — but that you talk to your mentoring TA when they do.
- A final project too close to one submitted for another course is a failing offense, handled by having both submissions sent in for the teaching team to judge.

The document ends with a list of papers that grew out of CS224u projects — and Potts appends his own caveat underneath: every one of them was heavily revised before acceptance, and every one already exceeded what the course expected at submission time, so **they are not the bar for a final project.** Secondhand write-ups almost never mention that caveat, and it is the only correct way to read the list.

## What a self-learner can actually get

Item by item, with the gettable and the ungettable kept apart:

**Available: the whole [repo](https://github.com/cgpotts/cs224u/).** Apache 2.0 plus CC BY-SA 4.0, over two thousand stars. Three assignment notebooks, every lecture notebook, the model code, the pytest suite under `test/`, and projects.md.

**Available: the slide PDFs.** Every handout in the course site's `slides/` directory is a public direct link, including the two cited above.

**Available: a full set of recordings — but not of the on-campus class.** Stanford Online has posted the [complete XCS224U Spring 2023 playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp) on YouTube: fifty videos, screen recordings chopped into short segments (Contextual Word Representations alone is split across ten). These are the online version's materials, not classroom footage, so there's no live Q&A.

**Available: the [podcast](https://web.stanford.edu/class/cs224u/podcast/index.html).** A dozen-odd interviews Potts recorded — Douwe Kiela, Omar Khattab, Percy Liang, Sam Bowman are all in there. The last episode is from February 2023.

**Not available: classroom recordings, the Canvas quizzes, and the exemplary final papers from past years.** The course page states plainly that the sample papers are "link restricted to enrolled students."

**Not available: XCS224U's course materials and TAs.** That version is paid, and enrollment is currently closed.

**Worth knowing: the repo is now maintained by someone else, and the first assignment doesn't run as-is.** The most recent batch of commits clusters in early 2025, authored by a TA from an XCS224U online cohort, with messages about bumping the torch version and updating the openai package. The version strings embedded in the three assignment notebooks don't match the course site either; the newest says Fall 2024 (notebook-by-notebook comparison in the appendix).

The thing that will actually stop you is data loading in `hw_sentiment.ipynb`. It calls `load_dataset("dynabench/dynasent", ..., trust_remote_code=True)`, but the [Hugging Face `datasets` 4.0.0 release notes](https://github.com/huggingface/datasets/releases/tag/4.0.0) state that `trust_remote_code` is no longer supported — and `dynabench/dynasent` on the Hub has only a 2021 Python loading script, no parquet version. [HF's API](https://huggingface.co/api/datasets/dynabench/dynasent/parquet) answers directly: "the dataset viewer doesn't support this dataset because it runs arbitrary Python code." The repo's `requirements.txt` doesn't pin `datasets`, so a fresh install gets the newest release. I have not run this myself, but the three public facts point one way: **to work on this assignment you will have to downgrade datasets yourself, or convert DynaSent to parquet yourself.**

The other line in `requirements.txt` worth knowing about is `dspy-ai==2.4.13`, with a comment reading pin down dspy-ai during the cohort. It is pinned, so it installs — but DSPy's current major version is 3.x, and the `dspy.OpenAI(...)` style the notebooks use is no longer how you write it. **You'll learn how DSPy thinks; you won't learn DSPy's current API.**

## How to start

One thing you can finish tonight:

```bash
git clone https://github.com/cgpotts/cs224u.git
cd cs224u
```

Don't touch `hw_sentiment.ipynb` first — that's the pothole from the previous section. Open `projects.md`, jump straight to the `Experiment protocol` section, and copy down its six subheadings: Hypotheses, Datasets, Metrics, Models, General reasoning, Summary of progress so far. Then take anything you currently have in flight — a model at work, a side project, a blog post you want to write — and fill in all six.

The `Hypotheses` section is written for one situation in particular: you don't actually have a hypothesis, you just want to see how some new model does on some task. The document's answer is to force that into a precise hypothesis — name a specific component of the new model, claim that component is the one doing the work — because only then can you decide what to compare against (something with that component, and something identical except for it).

If you can't name the baseline that belongs in the `Models` box, that's what tonight was really worth.

## Appendix: numbers and how they were checked

- **The three skipped academic years**: queried year by year through ExploreCourses' public XML interface (`https://explorecourses.stanford.edu/search?view=xml-20200810&academicYear=<year>&q=Natural+Language+Understanding&filter-departmentcode-CS=on`). CS 224U has an entry in 20232024, 20242025, and 20252026, and `<sections>` is empty in all three; 20222023 has one 2022-2023 Spring section, and 20262027 has a 2026-2027 Spring lecture and discussion section, classId 25499 and 25500, instructor field blank. **I could not retrieve the HTML version of ExploreCourses** — hitting its `view=catalog` page with curl or a scraping tool returns only "Please login to view this page," so I never read the "Last offered" line in its original form; the conclusions above come from the XML output of the same dataset cross-checked against Potts' teaching page.
- **Version strings in the assignment notebooks**: `hw_sentiment.ipynb` says `CS224u, Stanford, Spring 2023`, `hw_recogs.ipynb` says Spring 2024, `hw_openqa.ipynb` says Fall 2024. The course site is still on Spring 2023.
- **The COGS table**: nine model rows, overall scores between 48 and 88; the T5 mentioned above is 83. Across the three structural columns, `Obj PP → Subj PP` is 0 for all nine rows, `CP Recursion` is nonzero in only two, and `PP Recursion` in four; six rows are above 90 in the lexical column.
- **Repo status** (GitHub API, checked 2026-08-21): 2,192 stars, 911 forks, 3 open issues, last push 2025-02-28, `archived` false. The oldest open issue is #127 from August 2023, reporting that the first cell of `hw_sentiment.ipynb` fails (something to do with `charset_normalizer`); Potts replied the same day and it is still open. There is no `.github/workflows` directory in the repo, and the CI badge in the README was removed on 2025-02-27 in a commit titled remove failed badge.
- **Grade weights**: quizzes 15%, assignments and bake-offs 35%, literature review 10%, experiment protocol 10%, final paper 30%. The policy page also carries a non-curved score-to-grade table (≥94 is an A, ≥90 an A−, <60 is not passing) and gives everyone 4 free late days — except that the final paper is never accepted late.
- **Conditions on that COGS table**: the slides note the table is reproduced from ReCOGS (Wu, Manning & Potts 2023). Three rows carry an additional note that their results come from Yao and Koller (2022), and the top-scoring row is marked as using pretrained weights with hyperparameters tuned on samples from the generalization set.
- **Assignment points**: all three assignments are 9 + 1 (one point for entering the bake-off), and the original-system question is worth 3 points in each. The bake-off winner gets another 0.5 bonus point; late entries are accepted but forfeit the bonus.
- **File sizes**: the ColBERTv2 checkpoint is about 406 MB and the course's prebuilt index about 600 MB; both links still downloaded (HTTP 200) on 2026-08-21.
- **Things I could not confirm**: (1) who teaches the Spring 2026-27 offering — the ExploreCourses instructor field is empty, and Potts' teaching page currently goes no further than 2024-25; (2) why the course went three years without an offering — no official page explains it; (3) whether people outside Stanford can audit the on-campus class — no public page addresses it; (4) the data-loading problem above, which I inferred from three public documents rather than by building the environment and running it.

## References

- [CS224U: Natural Language Understanding course site](https://web.stanford.edu/class/cs224u/) — evidence that the site is frozen at Spring 2023, plus the syllabus, teaching staff, and links to past years' sites
- [CS224U Policies and requirements](https://web.stanford.edu/class/cs224u/requirements.html) — grade weights, the original-system grading rule, the late policy, and the citation rules for AI writing tools
- [CS224U Projects page](https://web.stanford.edu/class/cs224u/projects.html) — formatting requirements for the three submissions and the original wording of the final paper's two distinctive sections
- [CS224U Background materials](https://web.stanford.edu/class/cs224u/background.html) — what the course says CS224N covers and it no longer teaches
- [CS224U Podcast](https://web.stanford.edu/class/cs224u/podcast/index.html) — the public episode list and dates, last episode February 2023
- [CS224U 2019 course site](https://web.stanford.edu/class/cs224u/2019/) — evidence that relation extraction, semantic parsing, and grounded language understanding were once syllabus topics
- [CS224U archived version cs224u.1236](https://web.stanford.edu/class/archive/cs/cs224u/cs224u.1236/) — the only archived snapshot, corresponding to spring of 2022-23
- [cgpotts/cs224u GitHub repo](https://github.com/cgpotts/cs224u/) — the README labels marking which units are now background material, the licenses, and the directory layout
- [projects.md (the full final-project guide)](https://github.com/cgpotts/cs224u/blob/main/projects.md) — the "never evaluate a project based on how good the results are" line, the three grading axes, the literature-review counts, and the caveat under the publication list
- [hw_sentiment.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_sentiment.ipynb) — the structure of the first assignment and how it loads DynaSent and SST
- [hw_openqa.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_openqa.ipynb) — the DSPy + ColBERT setup steps and the "you're going to pay somehow" passage
- [hw_recogs.ipynb](https://github.com/cgpotts/cs224u/blob/main/hw_recogs.ipynb) — the four questions of the compositional generalization assignment and the four routes for the original system
- [requirements.txt](https://github.com/cgpotts/cs224u/blob/main/requirements.txt) — the `dspy-ai==2.4.13` pin and its comment, and the unpinned `datasets`
- [GitHub issue #127](https://github.com/cgpotts/cs224u/issues/127) — the first-cell failure reported in 2023 and still open
- [Course intro slides (Spring 2023)](https://web.stanford.edu/class/cs224u/slides/cs224u-intro-2023-handout.pdf) — the "CS224n is a prerequisite" line, the course's seven themes, and the original-system grading principle
- [Advanced behavioral evaluation slides (Spring 2023)](https://web.stanford.edu/class/cs224u/slides/cs224u-behavioraleval-2023-handout.pdf) — the COGS table, the ReCOGS hypothesis and result, and five open questions in behavioral testing
- [ReCOGS: How Incidental Details of a Logical Form Overshadow an Evaluation of Semantic Interpretation](https://arxiv.org/abs/2303.13716) — the paper those slides draw on
- [ExploreCourses: the CS 224U entry](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog) — the official course description and prerequisite text (the HTML version requires a login; this post used its public XML interface)
- [Stanford CS224N course site (Winter 2026)](https://web.stanford.edu/class/cs224n/) — the current syllabus, including the Agents/Tool Use/RAG and Benchmarking and Evaluation lectures
- [Christopher Potts' teaching record](https://web.stanford.edu/~cgpotts/teaching.html) — the last year the on-campus CS224u appears, and the XCS224u-only entries after it
- [XCS224U (the paid Stanford Online version)](https://online.stanford.edu/courses/xcs224u-natural-language-understanding) — tuition, hours, most recent cohort dates, and the current closed-enrollment status
- [XCS224U Spring 2023 YouTube playlist](https://www.youtube.com/playlist?list=PLoROMvodv4rOwvldxftJTmoR3kRcWkJBp) — fifty public recordings
- [Hugging Face datasets 4.0.0 release notes](https://github.com/huggingface/datasets/releases/tag/4.0.0) — the statement that `trust_remote_code` is no longer supported
- [Hugging Face API: dynabench/dynasent parquet endpoint](https://huggingface.co/api/datasets/dynabench/dynasent/parquet) — evidence that the dataset has no parquet version
- On this site: [A map of Stanford's CS courses](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Stanford CS329A, in depth](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
