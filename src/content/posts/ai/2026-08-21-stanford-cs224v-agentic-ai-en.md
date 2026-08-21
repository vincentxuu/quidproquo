---
title: "Stanford CS224V: Renamed to Agentic AI in 2026, but What It Teaches Is Formal Methods Against Hallucination"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs224v, ai-course, stanford, agentic-ai, rag, llm]
lang: en
series:
  name: "Reading Stanford's Main-Line CS Courses"
  order: 13
tldr: "CS224V only became Agentic AI in the 2026–2027 catalog, and the rename changed nothing underneath: the course still translates natural language into formal semantics and constrains agents with SMT solvers and knowledge graphs instead of wiring frameworks together. Seven of the eleven mandatory readings come out of the instructor's own lab. Every slide deck is public, and the course site says outright that they are deliberately incomplete."
description: "A full walkthrough of Stanford CS224V: Agentic AI, written after reading the course site, four academic years of ExploreCourses entries, all fourteen public lecture decks, and both assignment PDFs — the official descriptions before and after the rename, why the prerequisites include a linguistics course, the computational-thinking spine, where the assignments actually get hard, and exactly what a self-learner can and cannot get."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs224v-agentic-ai)

[CS 224V](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) is a three- to four-unit autumn course in Stanford's CS department, and for the 2026–2027 academic year its title is **Agentic AI**. Go back one year and the same course number reads *Conversational Virtual Assistants with Deep Learning*. The [2025–2026 ExploreCourses entry](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20252026) still carries the old name, and the description attached to it had run three years without a single edit. The rename so far lives only in ExploreCourses — the course website's own title is still the old one.

A rename like that reads as chasing the agent wave. Put the two official descriptions side by side, though, and what got swapped out is the subject matter, not the route. This course has been working the same problem from the start: **a next-word-prediction model gets seventy percent of the answers right almost for free, and cannot get close to all of them.** The prescription is to translate natural language into formal semantics and constrain the model with database queries, knowledge graphs, and SMT theorem provers — not to reach for a different orchestration framework.

This piece was written after reading the course site, four academic years of ExploreCourses entries, all fourteen public lecture decks, and both assignment PDFs. It covers what the rename did and didn't change, what the course argues, where the assignments actually get hard, and how much of this a self-learner can reach. It does **not** include a paper-by-paper close reading, and it does not cover the new academic year's syllabus — that isn't online yet. For where this course sits on the whole Stanford CS ladder, go back to the [map post](/posts/learning/2026-08-20-stanford-cs-course-map-en).

## The hard facts

The instructor is [Monica Lam](https://suif.stanford.edu/~lam/), a Stanford CS professor, member of the National Academy of Engineering, ACM Fellow, and co-author of the compiler "dragon book." She directs the [Open Virtual Assistant Lab (OVAL)](https://oval.cs.stanford.edu/), and the course materials are close to a catalog of that lab's output. The course has run every autumn since 2022, with her as PI throughout.

The prerequisites are written loosely: LINGUIST 180/280, CS 124, CS 224N, CS 224S, or CS 224U — **any one of the five**. Three to four units, letter grade or credit/no-credit. The next offering is autumn 2026, Monday and Wednesday afternoons; exact dates are in the appendix.

Two things set it apart from the other agent course in the department. First, **it takes auditors** — the [course site](https://web.stanford.edu/class/cs224v/) says to email the course staff address with the subject line `audit cs224v request`, whereas [CS329A states plainly that auditing is not allowed](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en). Second, it is capped and has been oversubscribed for years; the autumn 2025 announcement page says so directly:

> We apologize that we cannot accommodate all the students wishing to take the course this year.

Enrollment history is public on ExploreCourses. Twenty-nine students the first year, then over the cap for three straight years, most recently 138. Year-by-year numbers are in the appendix.

## Three official descriptions, two rewrites

One course number, three distinct catalog descriptions over the years.

**Version one** ran in 2022–2023 and described a virtual-assistant architecture: parsing dialogue semantics into ThingTalk, a "virtual assistant programming language"; generating semantic parsers from database schemas and API signatures; federated, privacy-preserving assistants. That was the world before LLMs.

**Version two** appeared in 2023–2024 and then ran three years without an edit. It swapped in LLMs: letting models acquire knowledge on their own, using external corpora to suppress hallucination, handling structured and unstructured data, evaluating dialogue assistants. The list ended with three topics that read as very much of their moment — **persuasive LLMs, multilingual assistants, and combining voice with graphical interfaces**.

**Version three** went up for 2026–2027 and dropped all three of those, replacing them with:

> (3) AI-driven knowledge curation and discovery for scientific research; (4) improving the accuracy and interpretability of decision-making agents through formal methods; and (5) automated techniques for improving the accuracy and efficiency of long-horizon agents.

The direction is unambiguous: from "build an assistant that doesn't make things up" to "build an agent that can do scientific research," with **formal methods** written into the catalog copy in so many words.

The same line shows up inside the course's own materials. The first [lecture deck](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf) splits the course material into two stages: Stage 1 is "computational thinking → general research assistant," Stage 2 is "computational thinking → scientific research assistant." **The course drew that boundary at 2025; the title didn't change until the following academic year.** No official page explains how the two relate, or why the rename happened at all.

## The course's claim: 70% is easy, near-100% is out of reach

The first lecture spends a full slide setting up the problem. The heading is "**THE 70% ACCURACY PROBLEM**," and three lines sit under it: deceptively easy; impossible to approach full accuracy with a next-word-prediction LLM; requires humans to filter, and therefore does not scale.

The course's answer is **computational thinking**: formalize human cognitive processes into step-by-step instructions. The LLM handles simple subroutines only, and an algorithmic engine composes them. The deck demonstrates why the model can't be trusted directly with a compositional question. Ask "who is Benjamin Harrison's wife" and "who is Caroline Harrison's grandfather" separately, and the model answers each. Fuse them into "who is the grandfather of Benjamin Harrison's wife" and it produces a third name. The deck's own conclusion is blunt: do not use an LLM to answer complex questions.

The distance between this and the industry habit of assembling agents from frameworks is measurable on the reading list. The [official reading list](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf) has eleven sections, and the one named **Tools** holds exactly two entries — a tool-use benchmark and a commercial coding agent. Formal representation and formal reasoning, meanwhile, each get a section of their own, filled with SMT, knowledge graphs, SATLM, and Logic-LM. Nothing on the list teaches you to chain an orchestration framework together; the word LangChain appears once in the whole course, in the "further reading" field of the second assignment, as a contrast case for Genie Worksheets.

## A linguistics prerequisite tells you who the course expects

LINGUIST 180/280 sits in the five-way prerequisite alongside CS 224N, CS 224S, and CS 224U. That is not decoration. CS 224S is speech, CS 224U is natural language understanding, and LINGUIST 180 is Stanford's dialogue and language technology course. All five entrances are on the **language** side. Not one is a machine learning systems course or an optimization course.

Put differently, the course assumes you arrive with experience handling language, not experience training models. The structure agrees. Of the fourteen public lecture decks, the only one about how models get trained lands in the second-to-last week of the quarter, filed under "Misc" next to multimodal applications. This course does not intend to teach you to train a model. It takes the model as given and asks how you connect it to a real source of knowledge.

## Eleven mandatory readings, seven from one lab

Eleven entries on the reading list are marked `[Mandatory]`. Cross-checked against OVAL's output, Monica Lam is an author on seven of them: [STORM](https://github.com/stanford-oval/storm), Co-STORM, [WikiChat](https://github.com/stanford-oval/WikiChat), [SUQL](https://github.com/stanford-oval/suql), SPINACH, [Genie Worksheets](https://github.com/stanford-oval/genie-worksheets), and ReactGenie. The remaining four are Attention, Chain-of-Thought, ColBERT, and Mind2Web.

How to read that depends on what you want. Every one of these systems has public code and a live demo, and none of them is vaporware. The STORM repo has thirty thousand stars, WikiChat won the Wikimedia Foundation's annual research award, and SUQL and SPINACH were accepted at NAACL and EMNLP respectively. You can try STORM, WikiChat, SPINACH, and a conversational interface over FEC campaign-finance data in one sitting at [wwknowledge.org](https://wwknowledge.org/), no signup.

But what you get is the best version of one specific research line, not a survey of the field. The list has no post-RLHF agent training, no multi-agent communication protocols, no production observability. For the other half — what happens to a model after it ships — the [CS329A post](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en) in this series covers a different route through the same territory.

## What the assignments look like

There are only two, both in the first four weeks, together worth under thirty percent, done in pairs. The [course site](https://web.stanford.edu/class/cs224v/) says outright that their job is to get everyone to the same starting line; the project is the main event.

**[Assignment 1](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW1.pdf): turn deep research into investigative journalism.** The topic is the evolution of military strategy in the Russia–Ukraine war, and you fill in two components in a given skeleton: a DSPy signature that generates investigative angles, and a pipeline that synthesizes evidence into a report. RAG retrieval, web crawling, chunking, reranking, and queries against the ACLED conflict database are all handed to you. The difficulty isn't in the code. Half of the seven Action Items ask you to answer "what is this system missing" — coverage gaps, source diversity, research depth — and then propose three concrete fixes.

**[Assignment 2](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf) is where it splits.** The first half has you hold at least eight turns of conversation with an investment-advisor agent and then report whether it forgot what you told it and how often it fabricated information. The second half has you write your own ride-hailing agent in Genie Worksheets, implementing dialogue logic with branches and loops — check available vehicles, quote a price, ask whether to book, and if not, collect preferences and search again.

Genie Worksheets is the course's central tool and an expression of its position: you don't write a dialogue tree, which would be imperative. You declare which fields the task needs, under what conditions it should fire, and what action runs once the fields are filled; the framework handles the prompting and state tracking. The assignment handout puts both styles side by side and adds a design rule — give fields semantically meaningful names, because the LLM reads them directly.

The project is worth over sixty percent, done in pairs: a proposal in week four, a written update plus a mentor meeting every week from five through ten, a poster session in week eleven, and finally a paper of at least six pages in ACL format together with fully runnable code. The lecture deck lists what the course projects have produced: two papers in 2023, five in 2024, six in 2025.

## What a self-learner actually gets

**Available, and more generously than most Stanford courses:**

- **Fourteen lecture decks as PDFs**, one set each for 2023, 2024, and 2025, all under `web.stanford.edu/class/cs224v/lectures*/`, no login.
- **The full reading list PDF**, fifty-odd entries with the eleven mandatory ones marked.
- **Both assignment handouts in full**, including the spec for every Action Item.
- **The systems the course is built on**: STORM, WikiChat, SUQL, and Genie Worksheets are all open source, and the demos are all live.
- **The project grading spec**: how many pages the report needs, which sections, and the penalty if the code doesn't run, all on the [projects page](https://web.stanford.edu/class/cs224v/projects.html).

**Not available:**

- **Lecture recordings.** The course site dispenses with this in one line: video is on Canvas. Nothing is published.
- **Complete slides.** This is the one to watch, because the site says it itself: "Posted lecture slides are missing important details to facilitate student participation. Please make sure you watch the lectures." The public decks are **deliberately gapped**, and the recordings that fill the gaps are not public. That explains why reading the PDFs directly so often lands you on a page with a heading and nothing under it.
- **The credentials the two assignments actually need to run.** Assignment 1's model quota is issued through a LiteLLM portal the course hosts itself — the handout's wording is "We provide each enrolled student with free credits" — and Assignment 2 needs a connection to an OVAL machine plus a course-issued Azure OpenAI key. The download links for starter code and notebooks point at internal course paths too.
- **Student project work.** The 2025 Project Gallery lives at `cs224v-2025-projects.genie.stanford.edu` and accepts only `@stanford.edu` Google logins.
- **The autumn 2026 syllabus.** As of this writing, the course site's front page still sits on Fall 2025, and the schedule and readings are last year's.

## How to start

One thing you can do tonight: open the [November 10 deck](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf), which covers satisfying natural-language constraints with SMT, using clinical-trial matching as the case study. Then pick three questions your own RAG system has gotten wrong and ask, one at a time: did retrieval fail to find it, or did retrieval find it and the model reason badly? If it's the latter, the deck's approach — translate the documents and the conditions into formal predicates and let a theorem prover decide — is the alternative this course is offering. If all three failed on the retrieval side, the back half of this course won't help you much.

To get a feel for the whole spine first, read four decks in order: Introduction (computational thinking) → Grounding on Free Text (WikiChat) → SUQL (structured plus unstructured) → Satisfying NL Constraints with SMT. Those four give you the skeleton of the course.

## Appendix: numbers and how they were checked

- **Next offering**: autumn 2026–2027, September 22 to December 4, 2026, Monday and Wednesday 3:00–4:20 p.m., room CODAB80, final exam slot the morning of December 8, 2026.
- **Enrollment**: autumn 2022–2023, 29 (Turing Auditorium, no cap listed); autumn 2023–2024, 94 against a cap of 75; autumn 2024–2025, 139 against 120; autumn 2025–2026, 138 against 120. All four come from the Schedule block on the corresponding academic year's ExploreCourses page. The 2026–2027 entry currently lists only the meeting time and room (CODAB80), with no enrollment figure.
- **The two official documents disagree on grade weights**: the course site's front page says Participation 15%, Homeworks 20%, Final Project 65%; the table in the first lecture deck says Participation 15%, Assignment 25%, Final Project 60%. Both are official Fall 2025 materials. This post uses the website's numbers in the body text (homework worth under thirty percent holds either way). The course does not say which one governs.
- **How participation breaks down**: 5% for attendance and in-class participation for local students, with the other 10% (local) or 15% (remote SCPD) for the weekly written update and mentor meeting.
- **Reading list size**: eleven topic sections, 54 entries counted one by one, of which 11 are marked `[Mandatory]`. The numbering inside the PDF is scrambled in sections four and five (8 and 7 appear after 1, 3, 2), so the count is by entry, not by number.
- **Attribution of the mandatory readings**: Monica Lam is an author on 7 of the 11 (STORM, Co-STORM, WikiChat, SUQL, SPINACH, Genie Worksheets, ReactGenie), determined by checking the author field of each entry's citation on the reading list.
- **System numbers cited in the lectures** (all from the first deck, not independently verified here): WikiChat at 97% factual accuracy in English across 25 supported languages; SPINACH deployed on the Wikidata query forum with 1,700 conversations and a 78% success rate on 198 sampled ones; Genie Worksheets at 80% accuracy against 0–10% for GPT-4 function calling; STORM with 800,000 organic users and 1.4 million articles written.
- **The NLP building blocks lecture on November 12**: it covers CHURRO, a 3B-parameter vision-language model for recognizing historical documents, published at [EMNLP 2025](https://aclanthology.org/2025.emnlp-main.1763/).
- **Unconfirmed**: (1) the official reason for the rename — ExploreCourses, the course site, and the OVAL site all say nothing about it; (2) whether autumn 2026 reuses the 2025 assignments and reading list, since the new syllabus is not up; (3) the 2026–2027 entry lists only Monica Lam, with no course staff yet, so there is no way to tell whether the team changed.

## References

- [ExploreCourses: CS 224V (2026–2027, titled Agentic AI)](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) — primary source for the new title, new description, next meeting time and room
- [ExploreCourses: CS 224V (2025–2026)](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20252026) — the old title and description, plus the 138/120 enrollment
- [ExploreCourses: CS 224V (2024–2025)](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20242025) — the 139/120 enrollment and that year's course staff
- [ExploreCourses: CS 224V (2023–2024)](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20232024) — the year the second description first appeared, 94/75
- [ExploreCourses: CS 224V (2022–2023)](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog&academicYear=20222023) — the ThingTalk-era first description, 29 students
- [CS224V course site (Fall 2025)](https://web.stanford.edu/class/cs224v/) — grade weights, the auditing rule, the enrollment-cap notice, and the "slides are deliberately incomplete" sentence
- [CS224V schedule and lecture index](https://web.stanford.edu/class/cs224v/schedule.html) — public links to all fourteen lecture PDFs and each session's topic
- [CS224V project spec page](https://web.stanford.edu/class/cs224v/projects.html) — pairs, poster, six-page ACL-format report, code submission requirements
- [CS224V reading list PDF](https://web.stanford.edu/class/cs224v/CS224V_Readings.pdf) — source for the eleven sections and the Mandatory marks
- [CS224V lecture 1: Introduction](https://web.stanford.edu/class/cs224v/lectures/l-introduction.pdf) — the 70% accuracy problem, computational thinking, the Stage 1/Stage 2 split, the count of papers the course has produced
- [CS224V Assignment 1 PDF](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW1.pdf) — the two DRLite components left to the student, and the note about course-issued API keys
- [CS224V Assignment 2 PDF](https://web.stanford.edu/class/cs224v/assignments/CS_224V_HW2.pdf) — the declarative Genie Worksheets spec, the ride-hailing dialogue flow, and the LangChain contrast passage
- [CS224V lecture 11: Satisfying NL Constraints Using SMT](https://web.stanford.edu/class/cs224v/lectures/l-semantics.pdf) — the clinical-trial matching case study for formal methods
- [Monica Lam's homepage](https://suif.stanford.edu/~lam/) — the instructor's background, research direction, and OVAL's position
- [Stanford OVAL lab](https://oval.cs.stanford.edu/) — the lab output and paper timeline the course materials track
- [WWKnowledge](https://wwknowledge.org/) — public entry point for STORM, WikiChat, SPINACH, and the FEC data system
- [STORM (GitHub)](https://github.com/stanford-oval/storm) — the open-source implementation and star count behind a mandatory reading
- [WikiChat (GitHub)](https://github.com/stanford-oval/WikiChat) — implementation of the seven-stage anti-hallucination pipeline
- [SUQL (GitHub)](https://github.com/stanford-oval/suql) — implementation of the structured-plus-unstructured query language
- [Genie Worksheets (GitHub)](https://github.com/stanford-oval/genie-worksheets) — the framework Assignment 2 is built on
- [Genie Worksheets project page](https://ws.genie.stanford.edu/) — capability comparison against plain LLMs and dialogue trees
- [CHURRO (EMNLP 2025)](https://aclanthology.org/2025.emnlp-main.1763/) — the paper behind the November 12 lecture
- [STORM live demo](https://storm.genie.stanford.edu/) — a course system you can try without signing up
- On this site: [Reading Stanford's CS courses: the map](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Reading Stanford CS329A](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
