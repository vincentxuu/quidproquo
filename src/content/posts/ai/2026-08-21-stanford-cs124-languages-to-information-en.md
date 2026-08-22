---
title: "Stanford CS124: Numbered 100, Four Prerequisites Written Into the Catalog, and Not Offered at All Next Year"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs124, ai-course, stanford, nlp, retrieval, llm]
lang: en
series:
  name: "Reading Stanford CS124"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 8
tldr: "CS124 is the first course in Stanford's NLP branch. Its textbook is Jurafsky's own Speech and Language Processing, free online, and all nine assignment repos are public. But a banner sits on the course homepage: it will not be taught at all in AY 2026–27. And the chapter numbers the syllabus points at no longer match the August 2026 textbook."
description: "A full walkthrough of Stanford CS124: From Languages to Information — the prerequisite line quoted verbatim, the ten-week schedule, the nine assignment repos and the grade split, a chapter-by-chapter diff between the Winter 2026 syllabus and the August 2026 release of SLP3, and exactly what a self-learner can and cannot get."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs124-languages-to-information)

[CS124: From Languages to Information](https://web.stanford.edu/class/cs124/) is Stanford CS's introduction to language and information, taught by [Dan Jurafsky](https://web.stanford.edu/~jurafsky/) and cross-listed in Linguistics (LINGUIST 180/280). It is about turning unstructured text, speech and social links into things you can compute on: tokenizing, classifying, retrieving, recommending, transcribing. The course states its own position bluntly — it is the **undergraduate front door** to a whole row of graduate courses: CS224N, CS246, CS276, CS336.

On the [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map-en) this is the first cell in the NLP branch. That piece answers where the course sits on the ladder. This one answers what happens once you walk in: how the weeks are laid out, what the assignments look like, which one is the dividing line, and how much of it you can get without a Stanford login.

Scope first. **No slide-by-slide close reading, and no lecture-video content** — this offering's recordings live behind Canvas and are unavailable to non-enrolled students, and I say below exactly where that boundary falls. What follows is based on the Winter 2026 course site, the [ExploreCourses](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog) entry, the public assignment repos, and the textbook site itself.

## The hard facts

Winter 2026 meets Tuesday/Thursday afternoons in Hewlett 200, for three to four units, and satisfies the WAY-AQR general education requirement. The course site says enrollment runs to "almost 400" students a year, and there is **no cap** — the exact wording is "cs124 has no enrollment cap, so everyone is admitted!" The ExploreCourses listing for this section shows an enrollment of 350 (numbers in the appendix).

But the banner at the top of the homepage is the real news. The first parenthetical in the course description reads "which will not be taught in AY 2026-2027, so take it now!" The reason is stated, not left to guesswork: "because I will be on sabbatical".

The 2026–2027 ExploreCourses entry agrees. The CS 124 slot has no terms at all, just one line: "Last offered: Winter 2026." The page goes on to suggest that if you need this course before Winter 2028, this is the offering to take.

On auditing, the answer is "No and yes." You can't audit, because TA workload is allocated by enrollment and auditors would mean unpaid TA work. But **all course materials are public**: the site explicitly encourages non-enrolled people to watch the videos and do the assignments on their own, as long as they don't submit work or ask questions on the Ed forum. That stance matters for self-learners — it isn't tolerance, it's an invitation written into the FAQ.

One more rule that's easy to miss: this course **must be taken synchronously**, with no asynchronous option. Ten Tuesdays across the quarter carry either a live lecture or a lab; six of those days are mandatory attendance, and **the live portions are never recorded**. Medical reasons, or "I can't graduate without it this quarter," can be petitioned individually.

## The course number lies, and the evidence is on the same page

CS124 is numbered in the 100s, which makes it look like a sophomore course. The prerequisite field says otherwise:

> Prerequisites: CS106B, Python (at the level of CS106A), CS109 (or equivalent background in probability), and programming maturity and knowledge of UNIX equivalent to CS107 (or taking CS107 or CS1U concurrently).

Four things: data structures in C++, Python, probability, and UNIX plus programming maturity at the level of [CS107](https://explorecourses.stanford.edu/search?q=CS107&view=catalog). Both CS107 and [CS109](https://explorecourses.stanford.edu/search?q=CS109&view=catalog) are among the five CS core courses, and the department's degree requirements page has a hard rule about those five — students "must take it for 5 units". No reduced-unit version counts.

So: a three-to-four-unit course in the 100 series, with two five-unit courses standing in its prerequisite field that cannot be taken for fewer units.

More interesting still, **the prerequisite wasn't always written this way, and the course page explains the change itself**:

> In some previous years CS107 and CS109 were optional. Many students advised us that it would have been helpful to have 107 and 109 first. So now both are required.

Open the 2021 syllabus in the archive directory and the prerequisite is a single sentence: "CS106B. CS 107 can be helpful, but if you haven't had it we'll cover the required UNIX material." Back then CS107 wasn't required, and the course took responsibility for filling in the UNIX gap.

That responsibility now sits with the student. The FAQ hands you a [list of UNIX videos from an old CS107 offering](https://web.stanford.edu/class/archive/cs/cs107/cs107.1186/unixref/) and names the segments to watch: logging in, the first seven filesystem videos, the first seven common-commands videos, the first three shell videos, plus Vim.

The way "course number equals difficulty" fails here is very concrete: **the number never changed, the prerequisite field changed twice, and it was raised because students asked for it.** To judge a Stanford course's floor, read the `Prerequisites` field on ExploreCourses, not the digits.

## The textbook is free, and its author is the person at the lectern

The course has exactly one assigned book: [Speech and Language Processing, 3rd edition](https://web.stanford.edu/~jurafsky/slp3/), by Jurafsky and James H. Martin. It's online for free as per-chapter PDFs, plus a single merged PDF of the whole thing.

This is the largest asset a self-learner takes from this course. **It isn't a byproduct of the class — it is the field's widely adopted textbook, and one of its authors is the person teaching the class.**

The current state is the August 19, 2026 release. The update note on the site's front page says three things. First, this release has a Chapter 1 for the first time, with a lot of LLM material moved over from the old Chapter 7. Second, the interpretability chapter is currently an "about half" draft. Third, a sentence you don't often see on a textbook site:

> We used Claude Opus 5 to suggest more exercises for various chapters, and also to do a pass over the first 8 chapters to point out any bugs it could find. It found a lot.

Put that next to the course's extra-credit rules and it gets better. One of the ways CS124 students earn extra credit is **being the first to find a typo in the Jurafsky and Martin textbook**, figure-numbering errors excluded. Same book: a model sweeping the first eight chapters on one side, a bounty on student typo-hunting on the other.

One more thing worth writing down: Chapter 12 of the textbook is titled "Agents," and the index page marks it **[not written yet]**, with no link. The single heaviest-weighted assignment in this course asks students to build an agent.

## The chapter numbers in the syllabus no longer match the book

This is the first thing a self-learner hits when reading along with the CS124 syllabus today, and no page warns you about it.

The course site assigns "Chapter 7: Large Language Models (only pages 1-11 and page 17)" and "Chapter 8: The Transformer," linking to `slp3/7.pdf` and `slp3/8.pdf`. Those links still resolve, but the files behind them changed. I downloaded both and read the chapter title off page one:

| Syllabus says | Link points to | What you get today |
|---|---|---|
| Ch7 Large Language Models | [7.pdf](https://web.stanford.edu/~jurafsky/slp3/7.pdf) | Transformers and Pretraining |
| Ch8 The Transformer | [8.pdf](https://web.stanford.edu/~jurafsky/slp3/8.pdf) | Post-training |
| Ch10 (supplementary embeddings reading) | [10.pdf](https://web.stanford.edu/~jurafsky/slp3/10.pdf) | Interpretability (partial draft) |
| Ch14 Phonetics | [14.pdf](https://web.stanford.edu/~jurafsky/slp3/14.pdf) | RNNs and LSTMs |
| Ch15 Automatic Speech Recognition | [15.pdf](https://web.stanford.edu/~jurafsky/slp3/15.pdf) | Phonetics and Speech Feature Extraction |

The cause needs no speculation; the textbook site states it. The old Chapter 8 (Transformers) was merged with what remained of the old Chapter 7 into one new chapter. Every page-range assignment slid out of alignment along with it.

The course site targets the "third edition August 2025 release," and that release is still intact in the [`old_aug25/`](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) directory. I checked the files there: `7.pdf` is titled Large Language Models, `8.pdf` is Transformers, `14.pdf` is Phonetics, `15.pdf` is Automatic Speech Recognition — word for word what the syllabus assigns.

**So the correct way to self-study from the CS124 syllabus is: take chapter titles and page numbers from `old_aug25/`, and go back to the main directory when you want the newest material.** Mix the two and you will spend an evening arguing with the syllabus about what Chapter 8 is.

## How a 2026 NLP course teaches tf-idf and LLMs at the same time

The weekly table settles the ratio without guesswork. This is the ten-week skeleton for Winter 2026:

| Week | Topic | Assigned reading (chapter numbers as the syllabus gives them) |
|---|---|---|
| 1 | Introduction (live) | — |
| 2 | Tokenization and BPE, edit distance, n-gram language models | J+M Ch2, Ch3 |
| 3 | Logistic regression and text classification | J+M Ch4 |
| 4 | Information retrieval | J+M Ch11 (Information Retrieval and RAG) |
| 5 | Word embeddings + computational social science (live) | J+M Ch5, Ch10 |
| 6 | Neural networks + "LLMs and Transformers!" (live) | J+M Ch6 |
| 7 | Speech processing (live, optional extra credit) | J+M Ch7, Ch8 |
| 8 | Speech (Lab 4: PA7 and Git) | J+M Ch14, Ch15 |
| 9 | Collaborative filtering and LLM classroom ethics (Lab 5) | *Mining of Massive Datasets* Ch9 |
| 10 | PageRank and social networks (live) | *Introduction to Information Retrieval* Ch21, Easley & Kleinberg |

The answer: **LLMs did not push the front half out. They were appended to it.**

The first four weeks are still tokenization, edit distance, n-grams, logistic regression, inverted indexes. The last two weeks are still collaborative filtering and PageRank, still out of Leskovec's [*Mining of Massive Datasets*](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf) and Easley and Kleinberg's [*Networks, Crowds, and Markets*](https://www.cs.cornell.edu/home/kleinber/networks-book/). Transformers and LLMs sit in the two middle weeks, at the top of the embeddings → neural nets → transformers ramp, not at the bottom.

What actually got pushed out only shows up when you set the old syllabus alongside the new one. Three things present in the 2021 version are gone entirely: Naive Bayes and sentiment analysis (the course now starts straight at logistic regression), part-of-speech tagging and named entity recognition, and the ELIZA/PARRY chatbot-history readings.

**And two midterms.** There are now no midterms and no final; the syllabus says "There is no final exam and midterm." The last course requirement is the programming assignment.

One more sign of the times: the title of the Week 4 chapter is itself the change. J+M's Chapter 11 is now called "Information Retrieval and Retrieval-Augmented Generation." tf-idf wasn't retired — it became the first half of the RAG chapter.

## What the assignments look like, and which one is the dividing line

The syllabus lists seven programming assignments (PA1 through PA7) plus a setup assignment, PA0. In practice PA6 splits into 6a and 6b, so the starter code lives in nine public GitHub repos, all Python:

| Assignment | Topic | Starter code |
|---|---|---|
| PA0 | Setup and Jupyter tutorial | [pa0-jupyter-tutorial](https://github.com/cs124/pa0-jupyter-tutorial) |
| PA1 | Regular expressions and BPE tokenization | [pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) |
| PA2 | Logistic regression and text classification | [pa2-logistic-regression](https://github.com/cs124/pa2-logistic-regression) |
| PA3 | Information retrieval | [pa3-information-retrieval](https://github.com/cs124/pa3-information-retrieval) |
| PA4 | Word embeddings | [pa4-embeddings](https://github.com/cs124/pa4-embeddings) |
| PA5 | Neural networks | [pa5-neural-networks](https://github.com/cs124/pa5-neural-networks) |
| PA6a | Transformers | [pa6a-transformers](https://github.com/cs124/pa6a-transformers) |
| PA6b | Speech (TTS and STT) | [pa6b-speech](https://github.com/cs124/pa6b-speech) |
| PA7 | Agent | [pa7-agent](https://github.com/cs124/pa7-agent) |

The dividing line is **PA7**, and it behaves unlike anything before it.

PA1 through PA6 can be done alone or with one partner. PA7 **requires a team of three or four**, no solo work, and the syllabus is explicit about why: one purpose of the assignment is learning to run a team project. It carries double the weight of any other assignment, and **no late days may be used** (the other assignments share a four-day late budget).

The content pulls the whole quarter together. The README specifies part one as collaborative filtering for movie recommendations, and part two as an "LLM agent that can make tool calls to take on web search and memory functionalities." So the classic collaborative filtering algorithm from Week 9 and a tool-calling agent end up inside the same `agent.py`.

It is also the most expensive assignment in the course: the environment needs `dspy`, `together`, `mem0ai` and `serpapi`, and you have to get your own Together AI API key — the README says outright that "you may have to add some payment information to create an API key." PA6b is the same story, needing a Cartesia account for TTS and STT. **A self-learner can do both of these, but will be paying for the API calls.**

Worth recording too is where this course stands on LLMs, written into the honor code rather than glossed over:

> You should use language models like you use a TA, to improve your understanding. You may not paste code directly from an LLM into your programming assignment.

An archived snapshot of the same honor code has neither of those sentences — only the half-sentence saying that using ChatGPT to write your code violates the honor code. The teaching staff also includes a TA whose listed role is Ethics TA.

## What a self-learner actually gets, and what they don't

Item by item, not in generalities.

**Available:**

- **The entire textbook.** Per-chapter PDFs plus the merged edition, free, no registration. This is the big one.
- **Starter code for every assignment.** I opened all nine repos; all are public and cloneable.
- **Lab problems and solutions.** The problems *and* solutions for Labs 2, 3 and 5 are in the public [cs124/labs](https://github.com/cs124/labs) repo, and Lab 1's slides are a public PDF.
- **Four of the five live lectures' slides.** The pptx and pdf files for the introduction, LLMs and Transformers, speech, and the final lecture are all public under `web.stanford.edu/class/cs124/lec/`.

**Not available:**

- **All pre-recorded videos.** Every "Canvas Videos" cell in the schedule points at `canvas.stanford.edu` and needs a Stanford account.
- **The content of the five live lectures and five labs.** The course site is direct about it: "the 5 live lectures and the 5 labs are **not recorded**." You get the slides, not the two hours.
- **The computational social science lecture slides.** This is the one exception among the five — its files sit under `cs124/restricted/`, and I got a 403. The other four `lec/` files all return 200.
- **The nine quizzes and the autograders.** All on Gradescope, behind an enrolled account. Which also means nothing will tell you whether your assignment solution is correct.

One item sits between the two and deserves its own paragraph: **there is a full set of CS124 recordings on YouTube**, and the FAQ says plainly "we encourage you to watch the videos on YouTube." But the playlist titles on that [channel](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA) belong to a different syllabus: Week 2 is Naive Bayes, Week 4 is part-of-speech and named entity tagging, Week 6 is Chatbots and Dialogue Agents. None of those appear on the Winter 2026 schedule; all of them appear on the archived 2021 syllabus. **The public recordings cover this course's front half; the transformer and LLM weeks are not in them.** I found no official page stating what year these videos were recorded, which is listed among the unconfirmed items in the appendix.

## How to start

**What to do**: read the first twenty-six pages of [`old_aug25/2.pdf`](https://web.stanford.edu/~jurafsky/slp3/old_aug25/2.pdf) (Words and Tokens), then clone [pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) and finish the BPE tokenization problem. That is the full Week 2 load, and it fits in one evening. It also tells you something directly: if the UNIX and Python parts are where you get stuck, the CS107 in the prerequisite field is not decoration.

**What to do (faster version)**: open the public [Lab 1 slides](https://web.stanford.edu/class/cs124/lec/Lab1_UnixText_2026_upload.pdf), which are pure UNIX text-processing problems with the solution on the next slide. If you can't work through them, fill in the UNIX gap before going any further.

## Appendix: numbers, term codes, and unconfirmed items

- **Units and general education**: the 2025–2026 ExploreCourses entry lists 3-4 units, UG Reqs of WAY-AQR, and Grading of Letter or Credit/No Credit. Cross-listed as LINGUIST 180 (undergraduate) and LINGUIST 280 (graduate).
- **Enrollment**: the course FAQ says "almost 400 students" a year with no cap; the Winter 2026 ExploreCourses section (Class # 7010) shows 350 / 500. The two figures measure different things, and no page explains their relationship, so no inference is drawn here.
- **Grade split**: 3% attendance (the mandatory lectures and labs) + 97% assignments and quizzes. Within that 97%, assignments are 73% and quizzes 27%. The 73 points break down as 9 points each for PA1–PA6, 18 for PA7, and 1 for PA0. There are nine quizzes, the best eight of which count, with no late days.
- **What an A+ takes**: the syllabus says "It is very easy to get an A in this class but hard to get an A+", and an A+ requires all four of: full marks on every assignment and quiz, attendance on all ten Tuesdays (including the non-mandatory labs), at least five substantively helpful answers on the Ed forum, and earning extra credit at least three times across labs, quizzes and assignments. An A is 93% overall.
- **Late policy**: PA0–PA6 share four free late days; after that it's 20% off per day, and nothing is accepted more than four days late. PA7 cannot use late days.
- **Stanford term codes**: archive URLs take the form `web.stanford.edu/class/archive/cs/cs124/cs124.<code>/`, where the final digit is 2=autumn, 4=winter, 6=spring, 8=summer.
- **An archive directory whose label contradicts its contents**: `cs124.1254` is marked Winter 2025 by both its code and its page title, but what's inside is **an early draft of the Winter 2026 page** — the same "not taught in 2026–27" banner, the same January 6 start date, only with TAs still listed as TBD and no starter-code links on the assignments. Set the two side by side and two edits are visible: in that draft PA7 is named *Chatbot*, renamed to *Agent* in the released version; and the two honor-code sentences about using language models like a TA appear only in the released version. `cs124.1204` doesn't line up either: the title says Winter 2021, but the schedule runs from March 30 to June 3 and the staff email is `cs124-spr2021-staff`. **When citing an archived CS124 page, open it and check the contents; don't trust the directory code.** Where this piece refers to "the 2021 version," it means the content on the `cs124.1204` page, not its directory label.
- **How the chapter numbers were checked**: the "what you get today" column in the table above comes from downloading the PDFs from both the main `slp3/` directory and `old_aug25/` and comparing the chapter titles on page one. The main-directory versions are headed Draft of August 19, 2026; the `old_aug25/` versions are headed Draft of August 24, 2025. Separately, `12.pdf` in the main directory still exists and downloads, but its content is Machine Translation, headed Draft of January 6, 2026 — while the index page lists Chapter 12 as "Agents [not written yet]" with no link.
- **Unconfirmed items**: (1) the actual recording year of the YouTube videos — no official page states it, and this piece describes them only through the correspondence between playlist topics and archived syllabi, making no claim about the year. (2) Completion rates, grade distributions and average time spent on each Winter 2026 assignment — the course site publishes none of this, and neither does this piece. (3) Whether the course will keep the same syllabus after 2026–27 — the page says only that it isn't being offered and suggests when to take it, with nothing about future content.

## References

- [CS124: From Languages to Information (Winter 2026 course site)](https://web.stanford.edu/class/cs124/) — source for every prerequisite quotation, the schedule, the grade split, the auditing and synchronous-attendance rules, and the honor code quotations in this piece.
- [ExploreCourses: CS 124 (2026–2027 view)](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog) — shows "Last offered: Winter 2026" and no terms that academic year, plus the LINGUIST 180/280 cross-listing.
- [ExploreCourses: CS 124 (2025–2026 view)](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog&academicYear=20252026) — units, WAY-AQR, the 350/500 enrollment on Class # 7010, and the teaching staff list.
- [Speech and Language Processing, 3rd edition (online)](https://web.stanford.edu/~jurafsky/slp3/) — the August 19, 2026 update note, the chapter index, Chapter 12's "Agents [not written yet]," and the note about using Claude Opus 5 on the first eight chapters.
- [SLP3 `old_aug25/` archive directory](https://web.stanford.edu/~jurafsky/slp3/old_aug25/) — the release the syllabus targets, used to check the chapter-number drift.
- [cs124/pa7-agent](https://github.com/cs124/pa7-agent) — PA7's team rules, its two-part collaborative-filtering + LLM-agent structure, the package list, and the paid Together AI key.
- [cs124/pa1-regular-expressions](https://github.com/cs124/pa1-regular-expressions) — what the Week 2 assignment actually contains and what it needs installed.
- [cs124/pa4-embeddings](https://github.com/cs124/pa4-embeddings), [cs124/pa6b-speech](https://github.com/cs124/pa6b-speech) — used to confirm the starter code is public and to check external API requirements (PA6b needs a Cartesia account).
- [cs124/labs](https://github.com/cs124/labs) — the public source of lab problems and solutions.
- [CS124 archive `cs124.1204`](https://web.stanford.edu/class/archive/cs/cs124/cs124.1204/) — the older prerequisite wording, the Naive Bayes and chatbot-history readings, and the grade split with two midterms.
- [CS124 archive `cs124.1254`](https://web.stanford.edu/class/archive/cs/cs124/cs124.1254/) — the directory whose label contradicts its contents, and the comparison source for the older honor-code wording and PA7's former name.
- [Stanford CS BS Degree Requirements](https://www.cs.stanford.edu/bs-degree-requirements) — the rule that CS103, 107, 109, 111 and 161 must be taken for 5 units.
- [From Languages to Information YouTube channel](https://www.youtube.com/channel/UC_48v322owNVtORXuMeRmpA) — the playlist structure of the public recordings, used to establish their coverage.
- [Mining of Massive Datasets, Chapter 9 "Recommendation Systems"](http://infolab.stanford.edu/~ullman/mmds/ch9.pdf) — the Week 9 collaborative filtering reading, free PDF.
- [Networks, Crowds, and Markets](https://www.cs.cornell.edu/home/kleinber/networks-book/) — the Week 10 social networks reading; the authors' page carries the full pre-publication draft and per-chapter PDFs, also free.
- [Reading Stanford's CS Courses: Sorted by Prerequisite](/posts/learning/2026-08-20-stanford-cs-course-map-en) — the entry map for this series, and where CS124 sits in the NLP branch.
