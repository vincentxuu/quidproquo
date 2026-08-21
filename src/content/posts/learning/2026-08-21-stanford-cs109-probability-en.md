---
title: "Stanford CS109: A Probability Course That Turned \"How to Read This Lecture With an LLM\" Into Official Coursework"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs109, ai-course, stanford, probability, machine-learning, self-study]
lang: en
series:
  name: "Reading Stanford's Main-Line CS Courses"
  order: 4
tldr: "Every lecture in CS109's Summer 2026 offering ships with an official LLM Learning Guide — six concepts, a Learn prompt and a Test me prompt for each, written week by week across the quarter for a total of 23 PDFs. The same course's honor code Rule 4 forbids asking an LLM to solve your homework, and 65% of the grade sits in proctored exam rooms. Those two facts are halves of one design."
description: "A deep read of Stanford CS109: Probability for Computer Scientists, based on the official LLM Learning Guide PDFs, the honor code, the syllabus and the lecture pages: the course's hard rules, what the official AI coursework actually looks like, what it forbids, where the problem sets get steep, and which materials a self-learner can and cannot get."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs109-probability)

[CS109: Probability for Computer Scientists](https://web.stanford.edu/class/cs109/) is one of the five courses that form the spine of Stanford's undergraduate CS degree. The material sounds conventional enough: counting, conditional probability, random variables, the normal distribution, the central limit theorem, with the last third turning into machine learning. The official description is blunt about the shape of it — the course "starts by providing a fundamental grounding in combinatorics, and then quickly moves into the basics of probability theory."

The thing worth looking at isn't the syllabus. It's the column next to it. On the Summer 2026 schedule, every lecture's "Outside Class" cell links to an official document called the **LLM Learning Guide**. It isn't a policy notice. It's a per-lecture, copy-paste-ready prompt handout: a probability course that turned "how to prep for this lecture with a language model" into formal courseware.

This piece was written after downloading those PDFs and reading them page by page, then cross-checking the course website, the [honor code handout](https://web.stanford.edu/class/cs109/handouts/honorCode.html), the syllabus, the lecture pages and the ExploreCourses entry. It covers the course's hard rules, the actual shape of that AI coursework and what it explicitly forbids, what the problem sets look like, and how much a self-learner really gets. It does **not** teach probability — that's the course's job, not a reading guide's. The layer above this one is the [Stanford CS course map](/posts/learning/2026-08-20-stanford-cs-course-map); this piece doesn't repeat that map's ordering.

## The hard facts

Summer 2026 is taught by [Chris Gregg](https://web.stanford.edu/~cgregg/chris-gregg/), Monday through Thursday mornings in CoDa B80. The course runs again in all three quarters of the coming academic year, under three different instructors: Gregg in autumn, [Chris Piech](https://stanford.edu/~cpiech/bio/index.html) in winter, Jerry Cain in spring. The autumn section has an enrollment cap of **999** (all from the ExploreCourses entries; the query method and the other two caps are in the appendix). With the summer offering, that's four times a year. Nobody is stuck waiting for a seat.

The prerequisites are looser than people assume. The syllabus asks for CS106B plus calculus at the MATH 21 level, and adds that "past students have managed to take CS106B concurrently with CS109 and have done just fine." The strictness lives elsewhere:

- **You can't take it for fewer units.** Undergraduates enroll for five units, and the syllabus adds the parenthetical "this is by department and university policy, no exceptions." Graduate students may reduce units for administrative reasons, but not one course requirement goes away with them.
- **No overlapping classes.** The syllabus poses it as a Q&A: "Can you take CS109 if you have another Stanford class at the same time? Answer: No." The reason given is that overlapping classes usually mean overlapping finals.
- **No alternate final.** The official line is that if you can't make it, you should plan on taking CS109 in a different quarter.
- **Add by the end of Week 2 at the latest**, and joining late buys you no extra time on the first problem set.

There's also a companion course that's easy to miss: **CS109ACE (Problem-solving Lab for CS109)** — one unit, capped at thirty, instructor consent required, and it must be taken concurrently with CS109. It isn't remedial. The official description frames it as helping students go deeper, collaborate, and master the material.

## What the LLM Learning Guide actually is

Start with the physical form, because the form carries information. The files live under the course site's `worksheets/` directory, named `LectureNN-LLMPrompts.pdf`, sitting alongside that day's in-class worksheet and its answer key. The directory timestamps show they were **written week by week across the quarter**, from mid-June through early August — **23** of them. This is not a policy attachment posted once in week one. It's teaching material that moved with the course.

(Incidentally, the same artifact goes by three names on the site: the schedule calls it "LLM Learning Guide," the lecture pages link to it as "LLM Questions," and the filename says `LLMPrompts`. Naming that hasn't settled usually means the thing is new.)

Open any of them and the structure is identical. Take [the one for Lecture 1](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf). It opens by dividing the labor: read the assigned stretch of that day's slides, then "open your favorite LLM and work through the concepts below in order." Each concept gets a Learn prompt for the explanation and a Test me prompt to check it stuck — and the handout is emphatic that you **don't just read the replies**: "try to answer the 'Test me' questions yourself first, then ask the LLM to grade you."

Then six concepts, each with two prompts you can paste in verbatim. What's striking is how specific the prompts are. For the equally-likely-outcomes model, the Learn prompt asks the model to explain when P(E) = |E|/|S| is valid and when it fails, and it names the example to use: "contrast the correct 36-outcome sample space with the tempting-but-wrong idea that the 11 possible sums (2 through 12) are equally likely." The Test me prompt goes further — pose a two-dice problem, check whether the student used the right sample space, and "call out the 'sums are equally likely' trap if I fell into it."

**The course isn't teaching you how to use AI. It's treating AI as an oral examiner that's available at any hour.** Each guide closes with a wrap-up prompt asking the model for a single multi-part problem spanning the day's concepts, then: "grade each part, tell me which concept each part tested, and tell me which one concept I should review most before the next lecture."

The guides also expect the model to pull students off course, and they name the specific risk. [The one for Lecture 22, on deep learning](https://web.stanford.edu/class/cs109/worksheets/Lecture22-LLMPrompts.pdf), opens with a warning written for that day only:

> A warning specific to today: this is the one lecture where you are asking an LLM to explain how LLMs work, and there is an enormous amount of deep learning content on the internet written at a completely different level of abstraction than CS109 uses. Insist on the CS109 framing — maximum likelihood estimation, log-likelihood, gradient ascent, the sigmoid derivative — and push back if it starts talking about optimizers, PyTorch, or transformer architectures. You want the derivation, not the ecosystem.

"You want the derivation, not the ecosystem" is the sharpest piece of AI-usage guidance anywhere in the material. It doesn't tell you to think critically. It tells you which direction the model will drift and how to pull it back.

The same document closes by saying why the course was worth finishing:

> Note: this is the last new machine learning content of the quarter, and it is worth pausing on what just happened. Nine weeks ago we defined probability with three axioms. Today we derived, from those axioms, the training algorithm behind essentially every modern AI system — including the one you have been prompting all quarter.

## What it explicitly forbids

The guide's own prohibitions are "don't just read the replies" and "answer first, then let it grade you." The real red line is in a different document. The honor code handout lists four rules, and the fourth is titled **"Don't ask an LLM to solve homework for you"**:

> What a time to be alive! Large language models (LLMs) such as GPT4 are able to do wonderful things. Learn how to learn with these tools! You can ask an LLM to teach you a concept, and you can ask for clarification on what a question is asking. However, you should not ask an LLM to actually solve a problem for you or help you write up your homework solutions. You should know that LLMs do leave tell tail probabilistic distributions in their output.

The first three rules cover the traditional version of the same concern: don't look at solutions that aren't yours (including past-year answers and solutions found online), don't share your solutions, and cite any help you received when you submit. The syllabus restates it in harder terms, saying the honor code policy "specifically prohibits you from soliciting or taking solutions from other students or websites like ChatGPT, Stack Overflow and Chegg."

**Read the two documents together and the position is perfectly consistent: an LLM can be your tutor, not your ghostwriter.** And the line isn't held by good intentions. It's held by the grading structure.

## The grade structure bets on the exam room

The syllabus publishes this breakdown:

| Component | Share of final grade |
|---|---|
| Problem sets (psetapp) | 10% |
| Two midterms combined | 30% |
| Final | 35% |
| In-class work | 25% |

Which means **the part you can do at home is worth one tenth**. Everything else happens with someone watching.

One more line says even more about the direction. The course is taking part in a proctoring pilot run by Stanford's Academic Integrity Working Group (AIWG); the official wording is that "the purpose of this pilot is to determine the efficacy of proctoring and develop effective practices for proctoring in-person exams at Stanford." At a school whose honor code has long specified that faculty don't proctor, that alone is news.

So in a single quarter this course did two things that look opposed: it shipped AI study tools as official coursework, and it moved the weight of assessment back into physical exam rooms while joining a pilot to reintroduce proctoring. **The two aren't in tension. They're halves of one judgment** — models are welcome in the learning process, and proof of ability has to happen in a room without them. If you're designing any assessment scheme meant to coexist with AI, this is the most complete worked example currently available.

## Why the AI track can't route around it

On paper this is just an undergraduate requirement, but it shows up in downstream prerequisite fields with unusual frequency. Three commonly cited advanced courses, in their own words:

| Course | How its prerequisites name CS109 |
|---|---|
| [CS336: Language Modeling from Scratch](https://cs336.stanford.edu/) | "Basic Probability and Statistics (e.g. CS 109 or equivalent)" |
| [CS234: Reinforcement Learning](https://web.stanford.edu/class/cs234/) | "Basic Probability and Statistics (e.g. CS 109 or other stats course)" |
| [CS224W: Machine Learning with Graphs](https://web.stanford.edu/class/cs224w/) | ExploreCourses says "Prerequisites: CS109, any introductory course in Machine Learning" |

That last row has a gap worth spelling out. **ExploreCourses lists CS109 as a prerequisite, but the course's own site says it is "sufficient but not necessary."** Two official pages for the same course disagreeing is normal at Stanford; when you cite one, say which one you're citing.

The direction is consistent all the same. None of these three want *the course* — they want *the level*. Their prerequisite fields care whether you can move comfortably through Gaussians, expectation, variance and maximum likelihood estimation, which is exactly the back half of CS109. Skipping it doesn't blow up in the next course. It shows up slowly, in every paper afterward that you can't quite get through.

## What the problem sets look like

The course runs on **psetapp**, a homegrown web app written by Chris Piech. The syllabus is clear about the mechanics, and they differ from a typical homework system in ways worth noticing:

- **You can check your work as you go**, with unlimited retries and no penalty for a wrong attempt.
- **There's no save button and no submit button** — it autosaves continuously, and at the deadline your current saved work is what gets graded.
- Every problem demands that you show your work: math solutions need "a detailed enough explanation beyond just the math itself that someone who is fluent in CS109 would understand how to solve it," and code needs enough comments and style to make the approach clear. The syllabus's phrasing: "Never write down just the answer."
- The late policy has three tiers: an automatic two-hour grace period, up to two late days per problem set, and a conversation with the Head TA past five total late days. The reason given is disarmingly direct — it isn't a penalty, they want to catch problems early.

**The topic sequence tells you where the difficulty cliff is.** The first three sets cover core probability plus discrete and continuous random variables, where getting the arithmetic right is mostly the whole job. The fourth moves into probabilistic models and uncertainty theory, where you have to translate the problem into a model before there's anything to compute. The last two are machine learning and logistic regression outright. Students who fall behind usually do so on the fourth — the step from applying formulas to building models — which lands almost exactly where the first midterm sits on the schedule.

There's also the **Challenge**: a fully optional extra-credit project, a probability-driven piece of work plus a short write-up. The handout spends a whole paragraph insisting it is "completely optional (and in the genuine sense of the word optional – not in some mischievous 'this is extra credit but if you don't do it, your grade will suffer' sort of way)." Bonuses are applied only after final grades have been computed. The scoring formula is public:

```
score = sophistication × (1 + creativity + impact)
```

All three dimensions run from 0 to 1. Note where the multiplication sits — **academic sophistication is the multiplier; creativity and impact are only additive**. A project that's very cool but uses nothing from CS109 scores zero. Past entries, with their PDFs, are posted on the [Challenge page](https://web.stanford.edu/class/cs109/handouts/challenge.html), ranging from Bessel's correction to a poker simulator to "why ad A/B tests lie to you."

## What a self-learner actually gets

This course is unusually open by Stanford CS standards, but there's one strange break in the middle. Everything below was checked on 2026-08-21:

**Available:**

- **The course reader**: [Probability for Computer Science](https://probabilitycoders.stanford.edu/spr26), by Piech and Gregg — free, no login, and interactive. It ships nine runnable applications covering algorithmic art, guessing age from a name, poker, diffusion models, pyramid chamber detection and more, plus a [full 2024 PDF](https://chrispiech.github.io/probabilityForComputerScientists/en/ProbabilityForComputerScientists.pdf) for download.
- **In-class worksheets and answer keys**: the Worksheet and AnswerKey PDFs under `worksheets/` are public, running through Lecture 28 (with a few lectures missing).
- **All 23 LLM Learning Guides**, public.
- **Slide PDFs for Lectures 1 through 14.**

**Not available:**

- **Slides from Lecture 15 onward.** The links are still on the lecture pages; clicking them returns 404. So you get the LLM Learning Guide for Lecture 20, "Logistic Regression," and its first instruction is to read the Lecture 20 slides — which you cannot download. **A guide, but no map.**
- **The problem sets.** psetapp sits behind Stanford SUNet single sign-on. Archived quarters (for example the [Winter 2021 offering](https://web.stanford.edu/class/archive/cs/cs109/cs109.1214/schedule.html)) still have their problem statements up as public HTML, which works as a substitute, but there's no autograder.
- **Lecture recordings.** The syllabus says "This term CS109 is recorded," but they're published on Canvas, invisible from outside.

Two more traps. First, the page on the course site called `courseReader.html` is **not** the current reader — it's stamped with a 2017 update date and contains the table of contents for that era's draft; the live reader is on the `probabilitycoders.stanford.edu` domain above. Second, the syllabus page is still stuck on a different quarter: it lists lectures as Monday/Wednesday/Friday afternoons in NVIDIA Auditorium, while the schedule says Monday through Thursday mornings in CoDa B80. **When you cite course logistics, trust the schedule and the lecture pages; the syllabus page is stale.**

## How to start

**Do this**: download the [Lecture 1 LLM Learning Guide](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf), skip the Learn prompts, and paste the **Test me** prompt from Concept 3 into any language model. It'll hand you a two-dice problem. Grind it out yourself first, on the 36-outcome sample space, and only then let the model grade you.

That prompt hard-codes an instruction to check whether you used the right sample space and to call you out on the spot if you fell for "all sums are equally likely." Which is the whole design in miniature: **it doesn't give you the answer, it gives you something that will catch you.** Ten minutes later you'll know whether you need to start from Lecture 1.

To keep going, treat the `worksheets/` directory as your main line: for each lecture, work the Worksheet yourself, use the LLM Learning Guide to have a model quiz you, then check against the AnswerKey. Where the slides break after Lecture 15, fill the gap with the interactive reader.

## Appendix: numbers and how they were checked

- **How to query ExploreCourses**: the web interface now requires a login, but the XML endpoint is still open: `https://explorecourses.stanford.edu/search?view=xml-20200810&q=CS109`. The CS109 entry gives the title as *Introduction to Probability for Computer Scientists* (one word longer than the course site's *Probability for Computer Scientists*), a 3-to-5 unit range, Letter or Credit/No Credit grading, and the GER:DB-EngrAppSci, WAY-AQR and WAY-FR requirement tags.
- **Instructors and enrollment caps for the three 2026–2027 quarters**: autumn Gregg (999), winter Piech (350), spring Cain (500). The numbers come from the `maxEnrolled` field on each quarter's LEC section, which is a cap, not actual enrollment.
- **Grade weights**: problem sets 10%, midterms combined 30%, final 35%, in-class work 25%. These come from the syllabus page, whose other fields (lecture times, location, number of problem sets) have already been contradicted by the schedule — so the weights may not be the current summer numbers either. The sourcing limit is flagged in the body.
- **The 23 LLM Learning Guides**: counted file by file from the `worksheets/` directory listing. Filenames run `Lecture01` through `Lecture22` plus `Lecture25`, with timestamps from 2026-06-19 to 2026-08-05. Lectures 23, 24, 26, 27 and 28 have no corresponding file.
- **Slides breaking at Lecture 15**: requested `lectures/<dirname>/<dirname>.pdf` one at a time. Lectures 1 through 14 return 200; Lecture 15 onward returns 404 (`28-Future` is the exception, returning 200). Checked 2026-08-21. The same directory still holds folders numbered for older quarters (for example `17-Sampling`, `22-Optimization`); those 404 as well.
- **The honor code Rule 4 quote**: the original reads "LLMs do leave tell tail probabilistic distributions in their output." `tell tail` is presumably `tell-tale`; the quote is reproduced above exactly as published.
- **A date typo on the homepage schedule**: the homepage's "This Week in CS109" labels June 25 as Tue, while the schedule lists that same lecture on Thu. Trust the schedule.
- **Three things that could not be confirmed**: (1) whether Summer 2026 has six or seven problem sets — the schedule lists through Pset #6, while the syllabus and the sidebar menu both say seven, and psetapp requires a login so it can't be checked; (2) which quarter the LLM Learning Guide first appeared in — the archived Autumn 2024, Winter 2025 and Summer 2025 pages have no such column, but the archives are incomplete, so Summer 2026 can't be declared the first; (3) what the 25% in-class work is actually made of — the syllabus paragraphs on discussion sections and one-on-one pre-exam meetings are commented out on the live page, and it's unclear whether the summer offering still runs them.

## References

- [CS109 course site (Summer 2026)](https://web.stanford.edu/class/cs109/) — instructor, meeting times and place, exam dates, and the LLM Learning Guide column on the homepage schedule
- [CS109 schedule](https://web.stanford.edu/class/cs109/schedule.html) — the twenty-eight-lecture topic sequence and the release/due dates for six problem sets
- [CS109 syllabus](https://web.stanford.edu/class/cs109/handouts/syllabus.html) — prerequisites, the unit rule, the overlapping-class rule, grade weights, psetapp mechanics, late policy, the AIWG proctoring pilot
- [CS109 honor code handout](https://web.stanford.edu/class/cs109/handouts/honorCode.html) — the four rules, the fourth being "Don't ask an LLM to solve homework for you"
- [Lecture 1 LLM Learning Guide (PDF)](https://web.stanford.edu/class/cs109/worksheets/Lecture01-LLMPrompts.pdf) — a full sample of the six-concept Learn/Test me structure
- [Lecture 9 LLM Learning Guide (PDF)](https://web.stanford.edu/class/cs109/worksheets/Lecture09-LLMPrompts.pdf) — the Gaussian one, showing the structure holds through the back half
- [Lecture 22 LLM Learning Guide (PDF)](https://web.stanford.edu/class/cs109/worksheets/Lecture22-LLMPrompts.pdf) — the day-specific LLM warning, and the closing passage running from three axioms to modern AI
- [Lecture 1 worksheet (PDF)](https://web.stanford.edu/class/cs109/worksheets/Lecture01-Worksheet.pdf) — evidence of the split: prep with an LLM before class, work problems in class
- [CS109 worksheets directory listing](https://web.stanford.edu/class/cs109/worksheets/) — the filenames and week-by-week timestamps of all 23 LLM Learning Guides
- [Probability for Computer Science interactive reader](https://probabilitycoders.stanford.edu/spr26) — the free, public current course reader with nine interactive applications
- [Course reader, 2024 PDF](https://chrispiech.github.io/probabilityForComputerScientists/en/ProbabilityForComputerScientists.pdf) — the complete offline version
- [CS109 Challenge page](https://web.stanford.edu/class/cs109/handouts/challenge.html) — the scoring formula for the optional extra-credit project and the list of past entries
- [CS109 Winter 2021 archived schedule](https://web.stanford.edu/class/archive/cs/cs109/cs109.1214/schedule.html) — public past problem sets and the corresponding Sheldon Ross chapters
- [CS336 course site](https://cs336.stanford.edu/) — prerequisite text: "Basic Probability and Statistics (e.g. CS 109 or equivalent)"
- [CS234 course site](https://web.stanford.edu/class/cs234/) — prerequisite text: "Basic Probability and Statistics (e.g. CS 109 or other stats course)"
- [CS224W course site](https://web.stanford.edu/class/cs224w/) — prerequisite text: "CS109 or Stat116 are sufficient but not necessary," which disagrees with ExploreCourses
- [Stanford ExploreCourses](https://explorecourses.stanford.edu/) — official titles, unit ranges, offering quarters and enrollment caps for CS109 and CS109ACE
- On this site: [Reading Stanford's CS Courses: the map](/posts/learning/2026-08-20-stanford-cs-course-map) (in Chinese)
- On this site: [Stanford CS329A deep dive](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
