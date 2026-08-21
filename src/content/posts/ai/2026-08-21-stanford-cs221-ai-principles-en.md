---
title: "Stanford CS221: The AI Intro Course Whose Prerequisites Field Reads CS103, CS106B, CS109, CS161"
date: 2026-08-21
category: ai
type: deep-dive
tags: [cs221, ai-course, stanford, search, logic, reinforcement-learning]
lang: en
series:
  name: "Reading Stanford's Main-Line CS Courses"
  order: 7
tldr: "CS221 lays AI out along one axis, and reflex models — deep learning — sit in the lowest slot, with states, variables and logic above them. When Percy Liang took over in Autumn 2025 he replaced the slides with runnable Python and wrote 'Cut constraint satisfaction problems :(' into the source of the first lecture — yet ExploreCourses and Stanford Online both still advertise constraint satisfaction as a course topic. The project has gone from 20% of the grade in 2019 to extra credit only."
description: "A full walkthrough of Stanford CS221: Artificial Intelligence: Principles and Techniques — three official pages that disagree about the prerequisites, the course's own definition of AI in terms of resource limits, the reflex/states/variables/logic spine, what Autumn 2025 cut and what it replaced the slides with, where the eight assignments turn, and exactly which primary materials a self-learner can get."
draft: false
---

> 🌏 [中文版](/posts/ai/2026-08-21-stanford-cs221-ai-principles)

[CS221: Artificial Intelligence: Principles and Techniques](https://stanford-cs221.github.io/) is Stanford CS's introduction to AI. It runs twice a year, carries a 200-level number, and is the entry point to the whole AI track. It teaches search, Markov decision processes, games, Bayesian networks and logic. Deep learning is one lecture.

In 2026, when everyone is talking about LLMs, a course still teaching A\* and resolution deserves the question "why is this still here?" This piece isn't a defense of it. It's a reading of how the course answers that question in its own lecture notes — and the answer is blunter than you'd expect. CS221 puts all of these methods on a single axis, and deep learning lands in the **lowest** slot. Not because it doesn't matter, but because it's the one kind of model that never backtracks: run the computation once, emit the answer.

What follows covers the hard facts, how the course defines AI, the four-layer spine, what Autumn 2025 cut, what the eight assignments actually ask for, and how much primary material you can get without enrolling. It does **not** teach the material lecture by lecture — that's the lecture notes' job, and they're public; paths at the end. The series entry point is [Reading Stanford's CS Courses](/posts/learning/2026-08-20-stanford-cs-course-map-en), which places this course on the ladder.

## The hard facts

Instructors rotate. [Autumn 2025](https://stanford-cs221.github.io/autumn2025/) was taught by [Percy Liang](https://cs.stanford.edu/~pliang/); [Spring 2025](https://stanford-cs221.github.io/spring2025/) by Moses Charikar and Zachary Robertson. Per the [ExploreCourses entry for CS221](https://explorecourses.stanford.edu/search?q=CS+221&view=catalog), the 2026–2027 autumn section goes to Liang and the spring section to Charikar. Units and meeting times are in the appendix.

The prerequisites are the spine of this piece, and **there are three versions of them in circulation**. ExploreCourses states them most firmly:

> Prerequisites: CS 103 or CS 103B/X, CS 106B or CS 106X, CS 109, and CS 161 (algorithms, probability, and object-oriented programming in Python). We highly recommend comfort with these concepts before taking the course, as we will be building on them with little review.

That sentence is the official rebuttal to skipping the foundations and going straight at AI. Discrete math and proofs, programming abstractions, probability, algorithms — four courses named outright, with a closing note that there will be almost no review.

As for auditing: there isn't a path. Non-degree students go through CGOE (formerly SCPD), and the [Stanford Online CS221 page](https://online.stanford.edu/courses/cs221-artificial-intelligence-principles-and-techniques) sets the bar at a completed bachelor's degree with an undergraduate GPA of 3.0 or above. Lecture recordings live in Canvas; the Panopto links on the module pages ask you to sign in.

## Three official pages, three prerequisite lists

Line the three pages up and they don't agree:

| Item | ExploreCourses | Course site (Autumn 2025) | Stanford Online / CGOE |
|---|---|---|---|
| [CS103](https://web.stanford.edu/class/cs103/) discrete math | Required | Required | Listed |
| [CS106B](https://web.stanford.edu/class/cs106b/) programming abstractions | Required | Required (with CS106A) | Replaced by an intro programming sequence |
| [CS109](https://web.stanford.edu/class/cs109/) probability | Required | Required | Listed |
| [Math 51](https://web.stanford.edu/class/math51/textbook.html) linear algebra | Not listed | **Required** | Listed |
| [CS161](https://web.stanford.edu/class/cs161/) algorithms | **Required** | Recommended | Not listed |
| [CS107](https://web.stanford.edu/class/cs107/) systems | Not listed | Recommended | Not listed |

The course site marks CS161 `(Recommended)`. ExploreCourses puts it inside the `Prerequisites` line. Two official pages for the same course give opposite answers to "is CS161 required?", and linear algebra appears on only two of the three. None of the pages says which one wins.

**What to do**: take the union. Cover the four foundations plus linear algebra and you don't have to bet on which page was updated last.

On how deep to go, the course site offers a criterion more useful than the list itself. What matters isn't whether you know one specific thing, but whether you've done enough related work to be comfortable with it. Its own example: this course never uses eigenvectors, even though they're a pillar of linear algebra. Put differently, getting your hands dirty with CS109 problem sets gets you closer to the state it wants than finishing the textbook does.

## How the course defines AI: not against humans, against resource limits

The first lecture of Autumn 2025 is a public Python file — you can read [welcome.py](https://github.com/stanford-cs221/autumn2025-lectures/blob/main/welcome.py) directly. It opens by asking what AI is, then refuses to use humans as the yardstick: `artificial` means "runs on a computer," `intelligence` is followed by a literal `???`, and then it says it wants a definition that starts from general principles.

The definition it lands on is four capabilities under one constraint: **perceive, reason, act, learn — all under resource limits**. And resources come in exactly two kinds: computation (runtime, memory, communication) and information (data, experience, whatever input you have at hand).

This isn't a definition invented that year. The course description on ExploreCourses has carried it for years:

> AI is the mathematics of making good decisions given incomplete information (hence the need for probability) and limited computation (hence the need for algorithms).

Incomplete information means you need probability; limited computation means you need algorithms. Both of the course's technical through-lines grow out of that one sentence, and CS109 and CS161 on the prerequisite list are exactly those two words. **The prerequisites field isn't administrative. It's a direct consequence of the definition.**

The lecture then hangs every algorithm in the syllabus off one of the four capabilities. Under reasoning: uniform cost search, value iteration, minimax, probabilistic inference on Bayesian networks. Under learning: gradient descent, Q-learning, EM. It's a lookup table, and it's what the course is really selling — not the algorithms, but the taxonomy that tells you which slot a problem belongs in.

## The spine: deep learning is one of four slots

One diagram runs through the whole quarter, and the [course-content lecture](https://stanford-cs221.github.io/spring2025-extra/modules/general/course-content.pdf) unpacks it most completely. Four model families along an axis from low-level to high-level:

```
                Search problems       Constraint satisfaction problems
            Markov decision processes        Markov networks
               Adversarial games            Bayesian networks

    Reflex          States                    Variables            Logic
  Low-level ────────────────────────────────────────────────────► High-level
                      Machine learning (supports all of them)
```

**Reflex models** are linear classifiers and deep neural networks. The lecture's definition is one line: the computation is fully feed-forward, "one doesn't backtrack and consider alternative computations." Inference is easy precisely because it is just running the fixed computation.

**State-based models** handle anything that needs forethought. In search problems you control everything; in Markov decision processes your opponent is called randomness; in adversarial games there is an actual opponent working against you.

**Variable-based models** handle problems where order doesn't matter. The lecture's example is Sudoku: the order in which you fill the squares has no bearing on the evaluation criteria, so the solution shouldn't be described as a sequence of moves. This layer is declarative — you declare what you want rather than micro-managing how the solution gets found.

**Logic** is the top slot. The course is explicit about how logic relates to statistics: people often contrast logical AI with statistical AI, and this course treats "the two as not contradictory but rather complementary." The same page carries a sharper comparison worth remembering — LLMs are "well-known for their hallucinations, whereas the logic-based system is 100% internally consistent." That isn't a claim that logic wins. The very next sentence concedes that logic "still needs to be supported by the groundedness to real data that machine learning offers."

Finally, when the concluding lecture summarizes all four layers, the "Learning" cell for the logic row contains three question marks. **The course admits the slot is empty.** Not many syllabi have a cell like that.

## What Autumn 2025 cut

Percy Liang made three changes when he took over, and he listed them in the source of the first lecture:

> Changes this year:
> - Tensor-native: from deep learning to value iteration to Bayesian network inference
> - Cut constraint satisfaction problems :(
> - Deep dive into societal impact (e.g., copyright, supply chains, policy)

The emoticon is verbatim. The cut left marks on the assignment table too. `scheduling` (course scheduling, a CSP) and `car` (object tracking with HMM particle filters) appeared in every offering from 2022 through Spring 2025. Both vanished in Autumn 2025, replaced by `bayesian` and `society`.

**The problem is that the other two official pages are still selling constraint satisfaction.** The ExploreCourses description lists `constraint satisfaction`; the Stanford Online page has it as the first item under `Topics Include`, and that page was updated as recently as August 2026. Anyone who comes for CSP because of the course description will find it isn't in the latest offering's notes.

The second change is about form. The old lecture notes were a slide system; Spring 2025 sliced the material into more than a hundred short modules, each with slides and a script. Autumn 2025 replaced all of it: [the entire quarter's notes are a public GitHub repo](https://github.com/stanford-cs221/autumn2025-lectures), MIT-licensed, consisting of Python files you can run, generated with Liang's own [edtrace](https://github.com/percyliang/edtrace). The README calls them "executable lectures" — a program that teaches the course by running. Three reasons are given in the notes: lectures inherit the hierarchical structure of code, code is more precise than either English or math, and you'll have to write code to build AI anyway.

## What the assignments look like

Autumn 2025 runs eight weekly assignments, each worth a share of the grade, each with written and coding parts, and [all the zips are public](https://stanford-cs221.github.io/autumn2025/):

| # | Name | What it does |
|---|---|---|
| 1 | [foundations](https://stanford-cs221.github.io/autumn2025/assignments/hw1_foundations/index.html) | Linear algebra, probability and complexity warm-up; NumPy and einsum |
| 2 | sentiment | Sentiment classification with linear classifiers and feature design |
| 3 | [route](https://stanford-cs221.github.io/autumn2025/assignments/hw3_route/index.html) | Route planning over an OpenStreetMap map of Stanford, UCS and A\* |
| 4 | [mountaincar](https://stanford-cs221.github.io/autumn2025/assignments/hw4_mountaincar/index.html) | MDPs and reinforcement learning on Gymnasium's Mountain Car |
| 5 | [pacman](https://stanford-cs221.github.io/autumn2025/assignments/hw5_pacman/index.html) | Multi-agent Pac-Man, minimax and expectimax |
| 6 | bayesian | Bayesian networks |
| 7 | [logic](https://stanford-cs221.github.io/autumn2025/assignments/hw7_logic/index.html) | Translating English sentences into logic, plus inference by resolution |
| 8 | [society](https://stanford-cs221.github.io/autumn2025/assignments/hw8_society/index.html) | A full societal-impact audit of an AI product, entirely written |

**Assignment 5 is where it turns.** That's not my difficulty ranking — it's the only assignment page carrying this warning:

> The `grader.py` included is useful to verify whether or not your solution crashes due to bugs or to verify Pac-Man behavior, but will not give reliable information on whether your submission will time out on any of the tests.

For the first four, running `grader.py` locally tells you whether you passed. At Pac-Man the local grader stops being enough: the timeout tests run only on Gradescope, and they're zero-point tests that tell you nothing except whether you time out. This is the first assignment where "correct" and "passing" come apart — the minimax tree expands to arbitrary depth, and controlling the cost of that search is on you. By contrast, the logic assignment page says the opposite: there are no hidden tests, so passing what you can see is full marks.

There's one more thing that's hard not to notice: **two questions on the first assignment are answered with a link to an AI chat transcript.**

> Learn basic NumPy operations with an AI tutor! [...] Provide a link to the chat session transcript with the AI tutor. The session should be ~15–20 minutes and interactive!

The problem ships with a full tutor prompt template, and instructs the AI not to solve the assignment outright. Meanwhile the same course's integrity policy says you may **not** use generative AI to "check" your own answers, even answers you wrote yourself. Learning the basics with AI is an assignment; verifying your answers with AI is a violation — both live on pages from the same quarter. The course doesn't explain where it draws the line.

## This is now an exam course

Line up the grade weights across offerings and you see a six-year drift: the project disappeared from the grade.

In Autumn 2019 the project was 20% of the total. By Autumn 2025 the [project page](https://stanford-cs221.github.io/autumn2025/project.html) states flatly that "the project is ungraded (except for potential extra credit)" — a couple of points at most, with the bulk of the grade sitting on one final exam. Year-by-year weights are in the appendix.

Plenty of CS221 self-study guides written a few years ago still treat the project as the centerpiece of the course. That description has expired. The course site doesn't explain the change.

One method from the project guide is worth taking away on its own, though. **What to do**: before you reach for anything fancy, implement a baseline and an oracle. The first gives you a floor, the second a ceiling; if the gap between them is small, the problem you picked was a bad one. This rule has nothing to do with any algorithm CS221 teaches, and it may be the single most portable paragraph in the whole guide.

## What a self-learner actually gets

Item by item, because this course is more open than most people assume — and the missing piece is very specific.

**Available (Autumn 2025)**: all the lecture material. The [GitHub repo](https://github.com/stanford-cs221/autumn2025-lectures) is MIT-licensed executable Python, and you can also [step through it line by line in a browser](https://stanford-cs221.github.io/autumn2025-lectures/?trace=welcome), from welcome all the way to society. All eight assignment zips download, complete with `submission.py` skeletons, the local `grader.py`, LaTeX templates for the written parts, and the full game code for Pac-Man.

**Available (Spring 2025)**: the slides. The previous offering's [module index](https://stanford-cs221.github.io/spring2025/modules/index.html) cuts the course into more than a hundred short modules whose PDFs sit on a public GitHub Pages path. The index only links ten of them; for the rest you have to assemble the URL yourself. It's worth doing — **these PDFs aren't just slides; every page carries the instructor's full spoken script underneath**, which makes them a complete set of lecture notes. If you want both the slides and the runnable code, take half from each offering.

**What to do**: the URL pattern is `spring2025-extra/modules/<group>/<name>.pdf`, and both values are visible on the module index page. For the map of the whole course, grab `general/course-content.pdf`; for the history of AI that traces the symbolic, neural and statistical lineages, grab `general/history.pdf`.

**Not available**: lecture recordings. Every Panopto link requires SUNet sign-in, and the official notice says recordings live in Canvas. Hidden tests aren't available either — the local grader only runs the visible ones, and the Pac-Man timeout tests exist solely on Gradescope. Neither are solutions. The integrity policy lists consulting past solutions as a violation, whether they're official, someone else's, or found online, and the course states that it runs similarity checks against submissions from previous offerings.

## Where to start

**What to do**: open Problem 1 of [the route assignment](https://stanford-cs221.github.io/autumn2025/assignments/hw3_route/index.html). It's pure pen and paper — nothing to install. The setup is an infinite grid city where moving east costs more as your x coordinate grows. It asks for the minimum cost from the origin to (m, n), then poses three true/false questions about how uniform cost search behaves — including whether UCS fails to terminate because the state space is infinite.

Once you've written your answers, read [the ucs\_astar lecture](https://stanford-cs221.github.io/autumn2025-lectures/?trace=ucs_astar). Three for three, and you can move quickly through the search portion of the course. If you stall on the first question because you can't say how this differs from Dijkstra, the CS161 line in the prerequisites field is about you.

For a fuller entry point, run [welcome](https://stanford-cs221.github.io/autumn2025-lectures/?trace=welcome) from top to bottom. In twenty minutes it will hand you the course's worldview, emoticon included.

## Appendix: numbers and how they were checked

- **Offering details**: the ExploreCourses entry lists 3–4 units, noting "May be taken for 3 units by graduate students." The 2026–2027 autumn section (class #1903) is taught by Percy Liang, Tuesdays and Thursdays 15:00–16:20 in Hewlett Teaching Center 200, with the final exam on 2026-12-10; the spring section (class #1890) is taught by Moses Charikar, Mondays and Wednesdays 10:30–12:20. Autumn 2025 met in NVIDIA Auditorium, with a single in-person exam on 2025-11-19 from 6 to 9 pm worth 60% of the grade.
- **Grade weights across offerings**: Autumn 2019 was 60% assignments, 20% exams, 20% project; Autumn 2021 was 55% assignments and 40% exams (two open-book exams, 100 minutes each, distributed via Gradescope); Autumn 2022 was 60% assignments and 40% exams, with the project dropped to at most 2% extra credit; from Autumn 2023 it became 40% assignments and 60% exams; Autumn 2024 and Spring 2025 were 40% assignments and 59.5% exams (the extra 0.5% is a prerequisite quiz), with the project worth up to 1.5% extra credit; Autumn 2025 is 40% assignments and one 60% exam, with up to 1.5% extra credit for the project and up to 1% for Ed participation. Each figure comes from the grading section of `stanford-cs221.github.io/<quarter>/`.
- **Module count and what's public**: the Spring 2025 module registry (`modules/course-data.js`) lists 111 modules, 32 of them carrying Panopto video links and 10 linked directly to PDFs from the index. Those 10 are five prerequisite-review modules and five embedded-ethics modules. The remaining modules' slide PDFs aren't listed on the index but sit at the same `spring2025-extra/modules/<group>/<name>.pdf` path and download fine when tested one by one.
- **Lecture count for Autumn 2025**: the schedule runs to lecture 20. Lectures 17 (language models), 18 (AI and society) and 19 are marked `[New]` on the course site. Lecture 19 is titled "AI Supply Chains" on the course site and "Economics of AI" in the lecture repo's README, and the two link to different material (the former has no separate link; the latter is a Google Slides deck).
- **Assignment lineup across offerings**: Autumn 2022 was foundations, blackjack, pacman, scheduling, car, logic; Autumn 2023 swapped blackjack for sentiment; Autumn 2024 and Spring 2025 added route and mountaincar for a total of eight; Autumn 2025 removed scheduling and car and added bayesian and society.
- **Late policy**: 7 late days for the quarter, at most 2 on any single assignment; past that, the cap drops 25% per additional day, and nothing is accepted more than 2 days late.
- **What could not be confirmed**: (1) which of the three official pages takes precedence when they disagree on prerequisites — none of them says; this piece can only suggest taking the union, not settle the ordering. (2) Why constraint satisfaction was cut — the first lecture records the outcome and an emoticon, no reason. (3) Why the project dropped from a graded component to extra credit — no course site across the offerings explains it. (4) The assignment policy page says submitted code has "no guarantee of support for packages beyond the standard library" and tells you not to use numpy, scikit-learn or pandas, yet the setup steps for the first assignment tell you to run `uv add numpy einops`; I can't determine from the pages themselves which scope each rule applies to. (5) Autumn 2025 enrollment is not published.

## References

- [CS221 offering index](https://stanford-cs221.github.io/) — links to 15 quarters of course sites from Autumn 2019 through Autumn 2025; every cross-offering comparison here starts from this page.
- [CS221 Autumn 2025 course site](https://stanford-cs221.github.io/autumn2025/) — source for the prerequisite wording, grade weights, the eight-assignment list, the 20-lecture schedule, and the integrity and generative-AI policies.
- [CS221 Spring 2025 course site](https://stanford-cs221.github.io/spring2025/) — the previous module system, the two-exam format, and the assignment table that still included scheduling and car.
- [ExploreCourses: CS 221](https://explorecourses.stanford.edu/search?q=CS+221&view=catalog) — the official `Prerequisites` text naming CS103, CS106B, CS109 and CS161, plus instructors and meeting times for the 2026–2027 autumn and spring sections.
- [Stanford Online: CS221 course page](https://online.stanford.edu/courses/cs221-artificial-intelligence-principles-and-techniques) — the third prerequisite list, and the bachelor's-degree and GPA bar for non-degree students.
- [CS221 Autumn 2025 executable lecture repo](https://github.com/stanford-cs221/autumn2025-lectures) — MIT-licensed, the evidence that the full quarter's notes are published as runnable Python, with the file for each lecture.
- [welcome.py (source of lecture 1)](https://github.com/stanford-cs221/autumn2025-lectures/blob/main/welcome.py) — the course's definition of AI, the four-capabilities-under-resource-limits frame, and the source of the three "Cut constraint satisfaction problems :(" change notes.
- [edtrace](https://github.com/percyliang/edtrace) — the tool that generates the executable lectures.
- [Spring 2025 module index](https://stanford-cs221.github.io/spring2025/modules/index.html) — the listing of 111 modules, and the evidence that the Panopto video links require sign-in.
- [course-content lecture PDF](https://stanford-cs221.github.io/spring2025-extra/modules/general/course-content.pdf) — the reflex/states/variables/logic spine, the modeling–inference–learning triad, and the original wording on logic and statistics being complementary.
- [AI history lecture PDF](https://stanford-cs221.github.io/spring2025-extra/modules/general/history.pdf) — the narrative of AI's symbolic, neural and statistical lineages, used here to explain why the course presents everything through a statistical lens.
- [conclusion lecture PDF](https://stanford-cs221.github.io/spring2025-extra/modules/conclusion/conclusion.pdf) — the summary table of all four model layers, including the empty "Learning: ???" cell for logic, and the course's list of suggested follow-ons.
- [HW1 Foundations page](https://stanford-cs221.github.io/autumn2025/assignments/hw1_foundations/index.html) — the original text of the two questions requiring an AI tutor transcript link, and the NumPy/einsum warm-up.
- [HW3 Route Planning page](https://stanford-cs221.github.io/autumn2025/assignments/hw3_route/index.html) — Problem 1, the pen-and-paper starter recommended here, and the UCS modeling problem on the Stanford map.
- [HW5 Pac-Man page](https://stanford-cs221.github.io/autumn2025/assignments/hw5_pacman/index.html) — the original warning that the local grader can't tell you about timeouts, and the basis for calling this the turning point.
- [HW7 From Language to Logic page](https://stanford-cs221.github.io/autumn2025/assignments/hw7_logic/index.html) — the knowledge-base API, the liar puzzles, and the note that this assignment has no hidden tests.
- [HW8 Society page](https://stanford-cs221.github.io/autumn2025/assignments/hw8_society/index.html) — the fully written AI product audit, including the rule against picking ChatGPT or Gemini.
- [CS221 homework policy page](https://stanford-cs221.github.io/autumn2025/homework.html) — late days, the Gradescope submission flow, hidden tests, and the package restrictions on submitted code.
- [CS221 project page](https://stanford-cs221.github.io/autumn2025/project.html) — the "project is ungraded" wording, and the baseline/oracle test for whether a problem is worth doing.
- [CS221 sample student projects repo](https://github.com/stanford-cs221/sample-projects) — the public project samples the course points students to.
- [Stanford Honor Code](https://communitystandards.stanford.edu/policies-guidance/honor-code) — the university policy the course's integrity terms cite.
- On this site: [Reading Stanford's CS Courses (series map)](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Stanford CS329A](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
- On this site: [Stanford CS230 series, part one](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en)
