---
title: "Stanford CS103: A Math Course Whose First Assignment Is Installing a C++ Compiler"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs103, ai-course, stanford, discrete-math, theory-of-computation, self-study]
lang: en
series:
  name: "Reading Stanford's Main-Line CS Courses"
  order: 2
tldr: "CS103 teaches you how to write proofs, then teaches you what can't be proven — but the part nobody mentions is that it ships C++ programming assignments, starting with PS0: install Qt Creator. Its real asset is a shelf of homegrown 'Guide to X' handouts and a Proofwriting Checklist that graders actually deduct points against, all public. Solutions and practice exams sit behind Stanford login, and the Honor Code page explains why."
description: "A full walkthrough of Stanford CS103: Mathematical Foundations of Computing, written after reading the current course site, all eight problem sets, twenty-odd homegrown handouts and two archived offerings — what the course is really about, the programming assignments nobody mentions, which problem set is the difficulty cliff, how far the summer offering falls short of a regular quarter, and exactly what a self-learner can and can't get."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs103-math-foundations)

[CS103: Mathematical Foundations of Computing](https://web.stanford.edu/class/cs103/) is the first theory course in Stanford's undergraduate CS skeleton. The name sounds like discrete math, and for the first half it is — logic, sets, functions, graphs, induction. Then the course changes tracks entirely: finite automata, regular languages, context-free grammars, Turing machines, decidability, the halting problem, and finally P versus NP.

The syllabus frames it as a course about whether computing has laws of physics. The discrete math is tooling. The course describes itself as "a course in both art appreciation and practice" — first a tour through the prettiest results of the last hundred and fifty years, then you pick up the paintbrush yourself.

This piece was written after going page by page through the current course site, eight problem sets, twenty-odd homegrown handouts, the Honor Code page and two archived offerings. The question it answers is what actually happens once you're inside: what the course is really about, what the assignments look like, where the difficulty turns, and what someone not enrolled can get. Where the course sits on the prerequisite ladder is already covered in [Reading Stanford's CS Courses](/posts/learning/2026-08-20-stanford-cs-course-map-en), so I won't repeat it. What this does **not** include is worked solutions — the solutions aren't public either, and the reason is below.

## The hard facts

The prerequisite is CS106B (or CS106X, or equivalent), and **you can take it concurrently**. ExploreCourses puts it bluntly: `Prerequisite: CS106B or equivalent. CS106B may be taken concurrently with CS103.`

The math prerequisite is lower than anyone believes. The first line of the course's own "Mathematical Prerequisites" handout sets the bar: "The most advanced level of mathematics you'll need for this course is high school algebra." Trigonometry, complex numbers, calculus, limits, and "especially" graphing functions on a coordinate plane — none of it comes up. The two skills it does list are expanding polynomials and rearranging equations.

The number says 100-level, but graduate students take it too. The syllabus adds a floor on units: undergraduates and CGOE (online) students must enroll for five units, no reductions, citing department and university policy. Only matriculated graduate students get flexibility, and the content and requirements are identical regardless — the flexibility is purely an enrollment-paperwork convenience.

The most counterintuitive line sits at the end of the course description: **the course talks some people out of taking it.**

> Students with significant proofwriting experience are encouraged to instead take [CS154](https://explorecourses.stanford.edu/search?view=catalog&q=CS154).

If you already know how to write proofs, the official advice is to go straight to [CS154: Introduction to the Theory of Computation](https://explorecourses.stanford.edu/search?view=catalog&q=CS154). CS154 lists this course as its prerequisite, but the two overlap heavily on computability. The difference is that CS103 spends an extra half quarter teaching you to write proofs someone else can read.

There's no single instructor. Robyn Reiss taught the summer 2026 offering; for 2026–27, autumn goes to Sean Szumlanski and spring to Keith Schwarz. That has practical consequences for self-learners, which the "what you actually get" section returns to.

## The first half teaches you to prove; the second teaches you what can't be proven

The pivot in the lecture schedule is easy to spot. In the current summer offering, the first seven lectures are set theory and intro to proofs, negations, propositional logic and quantifiers, functions, graphs, the pigeonhole principle, and induction. Then everything changes: finite automata, regular expressions, NFA conversions, context-free grammars, Turing machines, R versus RE, decidability and the halting problem, closing on P versus NP and complexity theory.

The course marks the turn itself, in the problem set intros, and marks it clearly. Problem Set 4 opens with "This problem set – the last one purely on discrete mathematics –"; Problem Set 5 opens with "This will be your first foray into computability theory, and I hope you find it fun and exciting!"

That structure tells you what the course is actually about. **The first half isn't teaching discrete math for its own sake. It's teaching you to convert "I believe this is true" into "you have no choice but to agree."** The second half points that skill at a new class of question — not "how do I write this program" but "does this program exist at all." The halting problem isn't a hard problem; it's a problem with **no solution**, and you have to be able to prove there isn't one.

Practically, that splits two audiences. If all you want is to patch up your discrete math — Big-O, graphs, recursion, the interview refresher — the first half is enough and the second half is a different course. If what you actually want is computability theory, CS154 is the better course, and the first half of CS103 is the stepping stone you're missing.

## A math course whose first assignment is installing a C++ compiler

Here's the thing nearly every writeup of CS103 leaves out: **it has programming assignments.**

Problem Set 0 contains no math. It asks you to download and install [Qt Creator](https://web.stanford.edu/dept/cs_edu/resources/qt/), import a project ZIP the course provides, and compile and run a little Honor Code quiz program. The program emits a completion-code file, and you submit that. The syllabus doesn't hedge: "You will need to download and install Qt Creator to complete the coding assignments."

The code isn't decoration. It runs the whole quarter, and it keeps changing shape:

- **Sets 1 and 2** use C++ as a runtime for first-order logic. You get four Boolean predicates — `Person`, `Cat`, `Robot`, `Loves` — and get asked to implement a formula like `∃x. (Person(x) ∧ Loves(x, x))` as a C++ function taking a `std::set<Entity>` and returning `bool`. It's a device for turning "I think I understood that formula" into "the compiler agrees that I understood it."
- **Sets 5 and 6** switch to graphical tools. The starter project ships an automaton editor; you drag states and transitions to build DFAs and NFAs, save, and submit for autograding. Regular expressions and CFGs each get their own answer-file format and local test harness.
- **Set 7** still has a coding portion in the Turing machines unit — and it's the only part of that assignment graded normally.

So the lived experience of CS103 isn't a quarter of pencil-and-paper proofs. It's **half the problems having an autograder that can tell you you're wrong, and half having nothing of the kind**. That asymmetry is the design: when the syllabus covers grading, it points out that proofs have no compiler, so you have to read your own work before submitting.

## The handouts are the course; the problems are just the door

The sidebar on the CS103 home page carries a whole shelf of homegrown handouts, all titled "Guide to" something. They aren't supplementary reading — they're the spine. Every problem set intro names which ones to read before you're allowed to start writing.

They fall into three groups. **Writing guides**: Guide to Proofs, Guide to Proofs on Sets, Guide to Proofs on Discrete Structures, Guide to Induction. **Line-item checklists**: the Proofwriting Checklist, the Induction Proofwriting Checklist, the Discrete Structures Proofwriting Checklist, the Logic Translation Checklist. **Animated single-theorem walkthroughs**, built as page-by-page unfolding PDFs: Guide to Negation, Guide to the Subset Construction, Guide to Self-Reference, Guide to Cantor's Theorem, Guide to the Lava Diagram.

The one worth pulling out on its own is the [Proofwriting Checklist](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/proofwriting_checklist). It isn't a one-page list — it's a document closer to a paper in length, laying out eight guidelines, each with counterexamples and exercises. And the Problem Set 3 intro settles its status: "We will be applying the items on this checklist when grading your work, so it's worthwhile to apply this checklist to your work before submitting." That's a grading rubric, not advice.

The eight items cover: stating your assumptions and your goal explicitly, making every sentence carry weight, introducing variables properly and scoping them, making specific claims about specific variables, using definitions rather than restating them, writing in complete sentences and paragraphs, keeping quantifier and connective symbols out of prose — and one name I haven't seen anywhere else, the **"Contradiction Sandwich"**: a proof wrapped in "suppose the opposite… contradiction," where the entire middle is a complete direct proof that stands on its own once you delete the first and last sentences. The course's verdict is that such a proof is logically correct and stylistically bad, because the wrapper does no work.

For a self-learner these handouts are worth far more than the lecture slides. Slides you can replace out of any textbook; "someone who has taught this course for over a decade writing down, line by line, the specific ways students wreck a proof" you cannot.

## It bans generative AI outright, for the same reason the solutions are locked

Not many courses still had a blanket written ban on AI in 2026. CS103 is one of them, and the Honor Code page leaves no room:

> University guidance on the use of generative AI in classroom settings treats use of generative AI analogously to receiving assistance from another human. As a result, using ChatGPT or other generative AI tools on any graded work is a violation of the Honor Code, regardless of whether that use is disclosed.

That last clause is the one that matters. Disclosing it doesn't make it fine; using it is the violation.

More interesting is that the rule shares its reasoning with something else. Rule 1 on the same page defines looking at solutions that aren't yours as a violation, and names past-quarter solution sets specifically: the course says many of the violations it has seen involve old solutions, so even "checking my idea against someone else's approach" counts. In the CS103 worldview, AI and past-quarter solutions are the same category of thing — both **do the getting-unstuck-to-figuring-it-out part for you**, and that part is the course.

There's also a relatively unusual remediation clause, explicitly modeled on [Harvard's CS50](https://www.thecrimson.com/article/2019/12/18/computer-science-50-report/): if you do violate the policy and turn yourself in within 72 hours of that assignment's late deadline, the only penalty is a zero on that assignment — no further grade reduction, no referral to the university's Community Standards office. It applies to assignments only, not exams.

## What the assignments look like

Taking the current summer offering (eight sets, PS0 through PS7), the difficulty curve reads like this:

| Set | Topic | What stands out |
|---|---|---|
| PS0 | Dev environment | No math; install Qt Creator, run the Honor Code quiz, individual work required |
| PS1 | Set theory and intro to proofs | Five parts, with the intro scheduling which part to finish by which day |
| PS2 | Propositional and first-order logic | The most problems of any set; C++ implementation, logic translation, Yablo's paradox |
| PS3 | Functions and graphs | Injections/surjections/bijections, independent and dominating sets, left and right inverses, bipartite graphs |
| PS4 | Induction | "The last one purely on discrete mathematics"; relaxed grading right after the midterm |
| PS5 | Finite automata | "Your first foray into computability theory"; submissions move to the automaton editor |
| PS6 | Regular expressions and CFGs | Two starter projects to download; includes Myhill-Nerode and Brzozowski |
| PS7 | Turing machines and undecidability | No late days allowed; written problems graded on effort, coding problems graded normally |

There are two watersheds, and they aren't the same one. **The content watershed is PS5**, where the subject matter changes tracks. **The workload watershed is PS2** — nine required problems plus an optional one, asking you to write C++, translate English sentences into first-order logic, and prove that every statement in Yablo's paradox is neither true nor false. The first two sets come with heavy scaffolding; at PS2 the scaffolding comes down.

Two more things visible only from the assignment pages:

**The course adjusts its grading rules to shield students during exam weeks.** PS4 lands after the midterm and PS7 before the final, and both carry their own grading notice. PS7 is the explicit case: the written portion gets full credit for a good-faith attempt, while the same page reminds you the material is still on the final and "we recommend treating it as you would any other problem set."

**Every assignment ships a day-by-day timeline.** The regular-quarter assignment pages have a section literally called Timeline, spelling out "problem one by Saturday night, problem two by Sunday night… problem seven by Thursday night." That's the most honest official answer to "how long does one of these take": a problem set is a six-day span, not an evening.

One easter egg worth knowing. The last problem on the last assignment of the regular-quarter offering is the Grand Challenge Problem: prove or disprove that P = NP, annotated

> (Worth an A+, $1,000,000, and a Ph.D)

Below that it tells you to give it an honest fifteen minutes, and if you can't crack it, submit the funniest answer you can think of.

## The same course, and the summer offering is nearly half the size

This is the trap self-learners fall into most easily, and nothing will warn you.

The URL `web.stanford.edu/class/cs103/` always points at **whichever offering is currently running**. When I read it, that was summer 2026: fifteen lectures, eight problem sets, one midterm and one final. But the spring offering that same year ran twenty-eight lectures and ten problem sets, broken down far more finely — finite automata alone gets three lectures, Turing machines three, undecidable problems three, plus a wrap-up session at the end.

In other words, **if you plan your self-study around the lecture list on today's home page, you may be working from a compressed version.** The two offerings cover nearly the same set of topics, but the granularity differs a lot, and granularity is exactly what matters in a course like this.

Telling them apart is easy: the last digit of the code at the end of an archive URL is the quarter, and summer is 8. **To plan a schedule, pick an offering ending in 2 (autumn) or 6 (spring).** The full code mapping is in the appendix.

Worth noting in passing: the summer offering actually adds a few handouts the regular quarter doesn't have — Guide to Elements and Subsets, Guide to Cantor's Theorem, and a Timeline of CS103 Results laying out the theorems the course covers in chronological order, from the Rhind Papyrus around 1550 BCE to the present. So the sensible move is: **lecture schedule from a regular quarter, handout list from the current offering**.

## What a self-learner actually gets

Item by item, the line between available and not is sharp.

**Available:**

- **Every lecture slide deck.** Each lecture page carries a PDF, downloadable, no login.
- **Every problem set.** Eight to ten of them, with the problems, the hints, and the "if you want to go deeper, take this course" line after each one.
- **Every starter file.** The ZIPs download publicly, automaton editor and local test harness included. Which means **you can grade yourself on all the autograded problems** — DFAs, regular expressions, CFGs, first-order logic translations all run their tests locally.
- **Every homegrown handout and checklist.** The whole shelf described above.
- **Sixteen archived offerings, with the instructor's own notes on what he changed.** This is the most underrated item: Keith Schwarz maintains a personal archive at [keithschwarz.com/cs103](https://www.keithschwarz.com/cs103/) collecting every CS103 site he has taught, and **writes a paragraph under each one about why he redesigned it that way**. The note on autumn 2021, for instance, describes two blind spots he found students shared — not distinguishing "assuming a universal statement" from "proving a universal statement," and having to absorb set theory definitions while learning to write proofs for the first time — and then explains how he resequenced the course to attack both. An instructor publishing his own teaching post-mortems is not easy to find.
- **One handout that has since vanished from the live site.** The autumn 2020 materials folder is an **open directory listing** (`cs103.1212/materials/`), and it holds a handout the current site doesn't have: [Ten Techniques to Get Unstuck](https://web.stanford.edu/class/archive/cs/cs103/cs103.1212/materials/Handouts/060%20Ten%20Techniques%20to%20Get%20Unstuck.pdf). It opens by puncturing a myth — beginners imagine proof writing goes "read the problem, contemplate, flash of insight, produce masterpiece," while the real process is "read the problem, panic a little, write down what you're assuming and what you're proving, crumple up a lot of paper, return to step three" — and then gives ten moves: clarify start and end, write down the relevant definitions, draw a picture, try small cases, work backwards, find a similar proof, change the assumptions, change the conclusion, switch proof techniques, go to sleep. The same directory also holds that quarter's four midterm exams and the weekly tutorial handouts.

**Not available:**

- **Solutions.** Everything under `restricted/` — solutions for every assignment, the practice midterm, the practice final — redirects to Stanford WebLogin and won't open for anyone outside. That's not an oversight; it's a direct consequence of Honor Code Rule 1. I tried earlier archives too (autumn 2019, for example) and the solution PDFs are locked there as well.
- **Lecture recordings.** Every lecture page carries the same sentence: "The complete archive of this quarter's lecture recordings is available on Canvas." The video runs through Panopto inside Canvas, and there's no way in from outside. I found no officially public recordings of any offering; the 2012 page has a video link, but it points at Stanford's long-since-retired online course platform.
- **A human reading your proofs.** This is the one part of the course you cannot self-serve, and it happens to be the heart of it: three quarters of the grade comes from two closed-book exams, and assignments are only a fifth. The half you can grade yourself is the autograded half. The half that needs a human reader has no reader.

**How to compensate for that third one**: the course's own How to Succeed handout offers a method that needs nobody else — finish a proof, set it aside for a day, and read it again the next morning; if you can't follow what you wrote, neither can a TA. It also suggests a pure self-test: cover the proof of a theorem in the handout and rewrite it yourself.

## How to start

Something you can do tonight: open [Guide to Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/guide_to_proofs), read as far as the section on direct proofs, then take a blank sheet, split it into two columns — "what I'm assuming" on the left, "what I'm proving" on the right — and use it on any proof problem from the first problem set.

Don't worry yet about whether you can finish the proof. That two-column move is the first thing the course's first handout teaches, and most people get stuck not because they can't prove it but because they never separated the starting point from the destination on paper. Once you've written something, open the Proofwriting Checklist and run those eight items over it — you'll catch at least one on the first try.

## Appendix: numbers and how they were checked

- **Units**: the ExploreCourses entry lists 3–5 units. The syllabus adds that undergraduates and CGOE students must enroll for five; only matriculated graduate students may pick between 3 and 5, and content and requirements don't change with unit count.
- **Grade composition** (summer 2026 syllabus): assignments 20%, exams 75%, participation 5%. Assignment scores use "sum of the square roots of your scores divided by the sum of the square roots of the maximums," which lifts an 81% to a 90%; no lowest score is dropped. Exam weights are 7/15 on the higher score, 5/15 on the lower, plus an extra 3/15 on the final, so the final carries more real weight than the midterm. Participation runs on PollEv attendance; you can miss three and still get full credit, and online students are exempt with the weight redistributed proportionally.
- **Passing thresholds**: assignments and exams must *each* reach a passing level independently. The syllabus's rough guide is around 60% on assignments and around 50% on exams, while stating the instructor sets the final standard after the quarter ends. Historical grade medians sit near the B/B+ boundary.
- **Late policy**: three free late days, at most one per assignment; past that, late work is multiplied by 0.7; nothing is accepted more than 24 hours late. PS7 permits no late days.
- **Lecture and assignment counts**: summer 2026 ran 15 lectures, 8 assignments (PS0–PS7), one midterm and one final; spring 2026 ran 28 lectures and 10 assignments (PS0–PS9). The autumn 2020 archive directory contains 4 midterm exams.
- **Handout lengths**: the web version of the Proofwriting Checklist runs roughly 14,000 words with exercises attached to each of the eight guidelines; Guide to Proofs on Sets, Guide to Induction and Guide to the Myhill-Nerode Theorem are each around 10,000. These are my own word counts from the scraped pages, not official figures.
- **Archive URL encoding**: `cs103.1268` → academic year ending 2026, quarter code 8 (summer). Quarter codes are 2 = autumn, 4 = winter, 6 = spring, 8 = summer. I derived this rule by testing codes `1212` through `1268` one at a time and comparing against the quarter each page states about itself; Stanford publishes no explanation page.
- **Three things I could not confirm**: (1) I found no officially public lecture recordings for any CS103 offering, but "couldn't find" isn't "doesn't exist," and unofficial reuploads aren't ruled out. (2) Stanford's course archive has no browsable index (`web.stanford.edu/class/archive/cs/cs103/` returns 404), so "which is the earliest archived offering" could only be probed code by code; I stopped once autumn 2020 still resolved and didn't exhaust anything earlier. (3) The ExploreCourses description for CS 103 tells readers to enroll in CS103A, but searching for CS103A only returns CS 103 itself; the companion course that actually exists in the catalog is CS 103ACE (one unit, Satisfactory/No Credit, taken alongside CS103). I found no official statement on how those two codes relate.

## References

- [CS103 course site (always the current offering)](https://web.stanford.edu/class/cs103/) — the entry point for lectures, assignments and handouts; evidence that it tracks whichever offering is running
- [CS103 Summer 2026 archive (cs103.1268)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/) — the compressed 15-lecture, 8-assignment version; the syllabus and assignment pages quoted here come from it
- [CS103 Spring 2026 archive (cs103.1266)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/) — the 28-lecture, 10-assignment regular-quarter version; evidence for the gap between offerings
- [CS103 Syllabus (Summer 2026)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/syllabus) — the unit requirement, grade formula, late policy and Qt Creator requirement
- [CS103 and the Honor Code](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/honor_code) — the blanket generative-AI ban, the past-solutions rule and the Regret Clause in the original wording
- [Mathematical Prerequisites](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/prereqs) — evidence that the math prerequisite stops at high school algebra
- [How to Succeed in CS103](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/how_to_succeed) — the course's official position on study method, plus collected advice from past students
- [Proofwriting Checklist](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/proofwriting_checklist) — the eight grading guidelines and the original source of the "Contradiction Sandwich"
- [Guide to Proofs](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/guide_to_proofs) — the starting point recommended in the "How to start" section
- [Problem Set 4 (Summer 2026)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/psets/ps4/) — "the last one purely on discrete mathematics" and the post-midterm grading notice
- [Problem Set 5 (Summer 2026)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/psets/ps5/) — "your first foray into computability theory" and the automaton editor
- [Problem Set 7 (Summer 2026)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1268/psets/ps7/) — no late days, written problems graded on effort
- [Problem Set 9 (Spring 2026)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/psets/ps9/) — the P versus NP Grand Challenge in the original wording
- [ExploreCourses: CS 103](https://explorecourses.stanford.edu/search?q=CS+103&view=catalog) — prerequisites, unit range, terms and instructors, and the line sending experienced proof writers to CS154
- [Keith Schwarz's CS103 archive](https://www.keithschwarz.com/cs103/) — sixteen offerings' worth of course sites plus the instructor's own redesign notes
- [Ten Techniques to Get Unstuck (Fall 2020)](https://web.stanford.edu/class/archive/cs/cs103/cs103.1212/materials/Handouts/060%20Ten%20Techniques%20to%20Get%20Unstuck.pdf) — ten moves for getting unstuck, gone from the current site
- [Stanford's Qt Creator install guide](https://web.stanford.edu/dept/cs_edu/resources/qt/) — the dev environment for the coding assignments
- On this site: [Reading Stanford's CS Courses: One Pass Down the Prerequisite Ladder](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Stanford CS329A walkthrough](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
