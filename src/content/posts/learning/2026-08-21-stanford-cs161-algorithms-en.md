---
title: "Stanford CS161: The Algorithms Course That Lists Writing Clearly as Its Third Learning Goal"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs161, ai-course, stanford, algorithms, self-study, cs-course]
lang: en
series:
  name: "Reading Stanford CS161"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 6
tldr: "The first slide of CS161 names three goals: design, analysis, communication. The third one is why handwritten homework scores zero and why solutions have to read like a memo to a colleague. Of the eight problem sets, HW2 is the wall. The lecture notebooks exist to show that timing runs can't tell you which algorithm is faster. And the summer offering is a completely different course wearing the same number."
description: "A full walkthrough of Stanford CS161 Winter 2026 after reading all eighteen lecture notes, the eight problem sets and the course policies: where the course-title contradiction came from, what a Python notebook is actually for in an algorithms class, the embedded ethics problems, the LLM policy in full, and what a self-learner can and cannot get."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs161-algorithms)

[CS 161](https://stanford-cs161.github.io/winter2026/) is the required algorithms course for undergraduates in Stanford's CS department. It is also the department's most frequently cited prerequisite. From [CS 221](https://explorecourses.stanford.edu/search?q=CS+161&view=catalog), the AI entry point, through databases, combinatorial optimization and randomized algorithms, the prerequisite line points here (full list in the appendix). This site's [map of Stanford CS courses](/posts/learning/2026-08-20-stanford-cs-course-map-en) files it under the five courses that form the skeleton of the degree. What follows is about what happens once you are inside.

Start with the least obvious thing about it: the course has three stated goals, and the third is communication. The first lecture puts it on the same slide as design and analysis — **Communication: Learn to communicate clearly about algorithms**. That is not decoration. It is where the entire homework regime comes from, including why handwritten work scores zero from the second problem set onward.

This piece covers the Winter 2026 offering: eighteen sets of lecture notes, eight homework PDFs, the course policies and the embedded ethics material, plus the places where the primary sources disagree with the course's public reputation. It does **not** teach the algorithms — the notes do that themselves, and they are all public.

## The hard facts

Winter 2026 is co-taught by [Moses Charikar](https://profiles.stanford.edu/moses-charikar) and [Ellen Vitercik](https://profiles.stanford.edu/ellen-vitercik). Charikar holds the Donald E. Knuth professorship and works on search and indexing algorithms for high-dimensional data; Vitercik is an assistant professor in Management Science and Engineering and in CS. They alternate lectures, one each. Class meets in STLC 111, Monday and Wednesday afternoons.

The catalog lists a variable unit range, but the department pins it: undergraduates must take this course for five units regardless of major. That rule is [still posted on the BS degree requirements page](https://www.cs.stanford.edu/bs-degree-requirements). There are three prerequisites — programming and data structures, discrete math and proofs, and probability (exact wording in the appendix). Probability is listed for a reason; this course uses more of it than the title suggests.

Grades come from homework, a midterm and a final, with the lowest homework score dropped.

The offering frequency looks like it is contracting. ExploreCourses shows four offerings in the previous academic year; for the coming year only winter and spring are posted, winter taught by Aviad Rubinstein and spring by Vitercik.

No auditing, and no public recordings. The lectures page says "Lectures will be recorded and accessible in Canvas," and the Panopto links redirect to a login page.

One small contradiction is worth clearing up first. The registrar's system records Winter 2026 as meeting Monday, Wednesday and Friday, but the course site schedules only Monday and Wednesday. Friday is where the [review and ethics sessions](https://stanford-cs161.github.io/winter2026/schedule/) live — the pre-exam review sessions and the single EthiCS lecture all sit on Friday in the same room.

## That course-title contradiction has already been fixed

A claim circulates online, including in this site's own course map: that the department's undergraduate core requirements page calls CS161 *Data Structures and Algorithms*, contradicting the course's own name. Checking it out: **the contradiction was real, and it is not real any more.**

Every official source still up agrees on *Design and Analysis of Algorithms*. That includes the course site, the [ExploreCourses entry](https://explorecourses.stanford.edu/search?q=CS+161&view=catalog), the [Stanford Bulletin's CS161 page](https://bulletin.stanford.edu/courses/1056871), [Stanford Online's for-credit distance version](https://online.stanford.edu/courses/cs161-design-and-analysis-algorithms), and the title slide of the first lecture.

The page carrying the other name is gone. It now returns a 404 reading "We have a new site and things have moved around a bit." Its replacement, the [degree requirements page](https://www.cs.stanford.edu/bs-degree-requirements), keeps only the five-unit rule and no longer lists course titles. I went through the new site's degree requirements, BS track and undergraduate overview pages; neither title appears anywhere. The old wording survives only in a [Wayback Machine snapshot from May 2026](http://web.archive.org/web/20260510054742/https://www.cs.stanford.edu/bs-core-requirements).

That snapshot is still worth a look, because the title was the smaller problem. It said the course covers "several different classes of algorithms and data structures, including randomized algorithms, divide and conquer strategies, greedy algorithms, hashing, heaps, graph algorithms, and search algorithms (including blind and A\* search)." A\* search does not appear in a single lecture. That is CS 221 material.

**The thing to take away is not that the course had two names. It is that a department advising page can drift a long way from what the course actually teaches.** To find out what is on the syllabus this quarter, read the course site's lecture index, not the department's course blurb.

As for naming inconsistencies that are still live, I found exactly one, in the one-unit support section. ExploreCourses registers it as **CS 161ACE** (Problem-Solving Lab for CS161); the course site's nav calls it [CS 161A](https://stanford-cs161.github.io/winter2026/cs161a/). It belongs to the School of Engineering's ACE program, meets Thursday afternoons for two hours, requires attendance, and takes applications for a limited number of seats.

## The third goal: this is a writing course

Back to the opening. Design and analysis are goals any algorithms course would list. Communication is not — and CS161 turns it into enforceable rules.

The course's [resources page](https://stanford-cs161.github.io/winter2026/resources/) defines what a homework write-up should look like:

> "Think of them like memos you might write to a colleague. Better still, think of them as memos that you might write for a team of colleagues, who may be working quickly and also who have control over your grade."

The rules behind it are strict. Handwritten submissions get a 5% deduction on the first problem set, and from the second one on: "After the first homework, we will NOT be accepting or grading any handwritten submissions" — with the site adding that there will be no exceptions. The course strongly recommends LaTeX and releases the LaTeX source of every assignment so students can borrow the typesetting from the problem statements.

The problem statements themselves make the point better than the policy does. Every part ends with a `[We are expecting: ...]` block spelling out what will be graded. Where pseudocode is wanted, the standard is written out: clear enough that "a CS106B student (and certainly the grader) can understand what your algorithm is doing, and could implement it in a language of their choice, without thinking too hard."

The same line runs through the proof problems. One part of Homework 2 asks for "a formal argument by induction. Make sure you explicitly state the inductive hypothesis, base case, inductive step, and conclusion." What is being graded is the structure of the argument, not whether the final answer is right.

## What the notebooks are actually for

Python notebooks are unusual in an algorithms course, so it is worth looking at how they get used.

The answer is a little counterintuitive: **the notebooks are not for doing homework. They are there to show you that timing runs won't tell you which algorithm is faster.**

The first lecture's [Karatsuba notebook](https://github.com/stanford-cs161/winter2025-extra/blob/main/notebooks/lecture1_karatsuba/lecture1_karatsuba.ipynb) implements three multiplication algorithms in order — grade-school long multiplication, a four-way recursive divide and conquer, and Karatsuba — timing and plotting each one. After the second, the notebook draws its own conclusion:

> "Hmm...pretty hard to tell from this plot which one is asymptotically better. (And there's definitely something weird going on at powers of two in the divide-and-conquer implementation above). We'll need to turn to some mathematical analysis to understand how this algorithm behaves as n gets large."

So the notebook's job is to let you watch empirical measurement fail, and then hand off to asymptotic analysis. The hashing lecture uses the same move. It writes a "uniformly random hash function," gets wrong results, and drops in a cell reading **Whoops!** in large type — before explaining that the thing was never a function at all, since it returns a different value on every call.

The provenance of these notebooks carries information too. They live in [winter2025-extra](https://github.com/stanford-cs161/winter2025-extra), a public repo under the course's GitHub organization, MIT-licensed, with an ATTRIBUTION file noting they were "originally developed by Mary Wootters."

Note that Winter 2026 did not spin up a 2026 version: every notebook link points back to the previous year's repo. And that repo's README still opens with `# winter2021-extra`, the residue of five years of copy-forward. The footer of the first lecture's slides likewise reads "Slides originally created by Mary Wootters."

One easy-to-miss caveat sits on the resources page. The sample Homework 0 it links to includes coding exercises, but the course states plainly: "although this example problem set has code-based exercises, we will not be using iPython notebooks this quarter." **The notebooks are an accessory to the lectures and were never part of the homework.** That matches what the summer instructor says about the course: it "will have no actual programming component."

## One ethics lecture, four ethics problems

The EthiCS session on the schedule is a single Friday lecture, taught by Justin Shin, slides public, recording in Canvas. It looks like a bolt-on compliance item.

The homework says otherwise. Four of the eight problem sets carry a graded ethics part:

- **HW4**: when you rank faculty candidates by publication count and teaching evaluation scores, which one is the imperfect proxy?
- **HW6**: after a dynamic-programming problem about transit transfers, it asks what the algorithm idealizes by assuming every passenger transfers equally well, and which group that harms.
- **HW5**: it maps "design a tunnel network wide enough for the widest badger" onto urban road planning, then asks who gets left out when roads are optimized only for cars. Four outside articles are attached as reading.
- **HW8**: in the context of max flow, what follows downstream when a fiber company adds bandwidth and projected revenue together into a single edge weight? And why does the digital divide lack a stopping condition?

The last lecture's review slides collect the vocabulary onto one page: idealization, abstraction, measurement, and the distinction between wicked and tame problems. This is examinable material with its own terminology, not a reflection exercise — the HW4 part explicitly asks students to answer using terms introduced in class, and to define those terms first.

## The LLM policy

The policies page has a section on language models, worded considerably more firmly than most. The rules themselves are the usual ones: "It is a violation of the honor code to copy-paste the output of an LLM into your homework, just as it is not allowed to copy another group's write-up." There is a single carve-out — "Exception: You are allowed to use an LLM to correct your LaTeX syntax on problem sets (even if it involves copying and pasting LLM output), so long as it is not generating/modifying the substance of your solution." Exams are off limits entirely.

What is worth reading word for word is the advice that follows:

> "For the purposes of this class, we strongly recommend ignoring LLMs and coming to office hours or posting on Ed for help. Why? Employers increasingly value candidates who understand fundamentals deeply, have strong reasoning skills, and can work with AI (as opposed to being replacable by AI). If you rely on AI too early, you won't develop reasoning skills and you'll struggle in real-world problem solving."

That is a position, and the wording is one some readers will argue with, which is why it is quoted here in full. What makes it interesting is how well it lines up with where the course ends. The final lecture, on machine learning for algorithm design, puts [AlphaEvolve](https://deepmind.google/discover/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/) — a Gemini-powered algorithm-design agent — on the slide. Then it asks the quarter's own two questions of it, unchanged: Does it work? Is it fast? Underneath sits one more line: "Still need formal guarantees!"

**If you are evaluating AI-generated algorithms, those three lines are the ruler this course hands you.** It is not claiming models cannot design algorithms. It is saying somebody still has to supply the formal guarantee.

## What the homework looks like

Eight problem sets, released Wednesday and due at 11:59 pm the following Wednesday, running to the week before finals. Each splits into Exercises (do them yourself) and Problems (collaboration allowed). The first three are individual submissions; from the fourth on, pairs may submit one write-up. Read straight through, the workload curve is not linear:

| Homework | Topic | Points | Worth noting |
|---|---|---|---|
| HW1 | Complexity classes, big-O proofs, 2D terrain search | 43 | Two points are "did you read the course policies" and "did you take the prereq quiz" |
| HW2 | Recurrences, Fibonacci induction, fast exponentiation, quagga | 60 | **The wall** — see below |
| HW3 | Randomized algorithms, sorting lower bounds | 42 | Back to normal |
| HW4 | Red-black trees, tree operations | 38 | Pairs allowed from here; first ethics problem |
| HW5 | Graphs and BFS/DFS, widest path | 40 | First one after the midterm |
| HW6 | Floyd-Warshall, dynamic programming, negative edges | 65 | Highest point total and longest of the quarter |
| HW7 | Three ways to write the same DP | 38 | The same problem, once divide-and-conquer, once top-down, once bottom-up |
| HW8 | Minimum spanning trees, max flow, edge-disjoint paths | 49 | Last one before the final |

**The wall is the second one.** Three independent pieces of evidence point at it. It is worth nearly half again as much as the first. The only problem the course itself flags for difficulty all quarter is in it. And it lands inside the individual-submission window, so there is no partner to split it with.

The problem is called quagga. A zoo holds a group of animals, more than half of them zebras. Zebras always report correctly whether another animal is a zebra; quaggas may say anything; and your only move is to pair two animals and have them evaluate each other. The goal is to identify every quagga. Seven parts walk from a quadratic brute force to a linear-time recursive solution, with a formal inductive correctness proof in the middle and an explicit instruction on the counting step to "do this argument 'from scratch,' do not use the Master Theorem."

One part carries a footnote: "This is the trickiest part of the problem set! You may have to think a while." It is the only sentence like it all quarter. The same assignment also carries two zero-point bonus problems — a tight golden-ratio bound on the Fibonacci numbers, and an argument ruling out O(log log b) — and it is the only one designed that way.

HW6 is a peak in a different sense: the most points, the most pages, six full problems. But its difficulty comes from volume rather than the depth of any one problem, and by then you can submit in pairs.

## What a self-learner actually gets

By the standards of Stanford's main-line CS courses this one is unusually open, but the boundary is sharp.

**Available:**

- **Eighteen lectures' worth of notes, slides and pre-lecture exercises**, all direct PDF links on the course site, no login. Most lectures ship notes and slides both, and they don't duplicate each other — the math the slides skip is in the notes.
- **All eight homework PDFs and their LaTeX templates.** Each PDF's header carries the line "Please do not distribute this material on any public forum," which is a rule for enrolled students; downloading them to work through yourself is unaffected.
- **Nine sections with problems and solutions.** This is the single most valuable item — homework solutions are not public, but section problems and solutions are released as a pair.
- **The prereq quiz and its solutions**, four pages, split into induction, probability and asymptotics.
- **A concept-check question bank**, living in the public [winter2025-bank](https://github.com/stanford-cs161/winter2025-bank) repo, one interactive SVG set plus a solutions PDF per topic (for example, [the asymptotics set](https://stanford-cs161.github.io/winter2025-bank/asymptotics.pdf)). There is no index page; the only way in is through the links on each lecture page.
- **Thirteen Python notebooks**, MIT-licensed, one click to open in Colab.
- **The course site's full git history**, because the site itself is a [public repo on GitHub](https://github.com/stanford-cs161/winter2026).

**Not available:**

- **All recordings.** The Panopto links redirect to Stanford login. The course's own resources page offers the substitute: the recommended textbook [Algorithms Illuminated](https://www.algorithmsilluminated.org/) (Tim Roughgarden, cited heavily in the notes' "Additional reading" column) has a complete free video series by the author on YouTube.
- **Homework solutions.** Gradescope only, and self-learners have no account.
- **Exams.** Only the review handouts are public.
- **Ed and office hours.** Nobody will grade your proofs, which for a course that grades the quality of an argument is the loss that actually bites.

## The summer offering is a different course

This is the easiest trap to fall into.

`web.stanford.edu/class/cs161/` — the URL that looks most like the official entry point — currently hosts not a course site but a [CS 161 Summer 2026 Temporary FAQ](https://web.stanford.edu/class/cs161/) maintained by Matthew Sotoudeh. One passage in it is blunt:

The summer offering "is not 'the Fall/Winter/Spring quarter minus lectures X, Y, Z,' nor is it 'the Fall/Winter/Spring quarter plus lectures X, Y, Z.' Rather, it is based on complete different lecture notes, problem sets, etc." Even the shape of the term differs — three 1h45m lectures a week over eight weeks, against two to three 1h20m lectures over ten. So does the emphasis: the summer version leans toward analyzing algorithms rather than designing them, and toward sorting and searching rather than graphs.

The same FAQ spells out the only legitimate remote path: students enrolled through SCPD/CGOE/Stanford Online can take it fully remotely, but have to find a suitable exam proctor themselves. Everyone else attends in person. The Stanford Online listing prices that version at $7,875 — eight weeks, ten to twenty hours a week, five units, official transcript.

So "CS161 materials" is an ambiguous phrase for a self-learner. The set you can find online — the GitHub Pages notes, the notebooks, the section solutions — belongs to the winter/spring line. The summer line's materials live in Canvas.

## How to start

Do one thing tonight: download the [prereq quiz PDF](https://stanford-cs161.github.io/winter2026/assets/files/prereq_quiz_wi26.pdf) and work the eight problems in Section 1, Induction, without looking at a single solution.

Problem 1.5 goes like this: given n people, some pairs of whom are friends, prove that the number of people with an odd number of friends is even. It needs no algorithms knowledge at all — only that you pick the right quantity to induct on. When you're done, open the [solutions PDF](https://stanford-cs161.github.io/winter2026/assets/files/prereq_quiz_solution_wi26.pdf) — but not to check whether you got the answer. Check whether **a stranger could follow what you wrote**. Base case, inductive hypothesis, inductive step, conclusion: can you point at all four on your page?

If you can't, the course you need isn't CS161, it's CS 103. This one assumes from the first problem set that you can already write a proof; what it teaches is how to point proofs at algorithms.

## Appendix: the numbers and how they were checked

- **Grade breakdown**: eight homeworks at 40% total, midterm 25%, final 35%. The lowest homework is dropped, so each counted assignment is worth 5.714% — a figure the course site works out and prints itself.
- **Prerequisites, verbatim**: "CS 106B or CS 106X; CS 103 or CS 103B; CS 109 or STATS 116."
- **Downstream courses listing CS161 as a prerequisite** (from ExploreCourses search results for the 2026–2027 academic year): CS 221, CS 245, CS 256, CS 261, CS 265/CME 309, CS 354, CS 366. Four of them currently show as not offered, last taught in the order CS 261 (Winter 2026), CS 256 (Autumn 2025), CS 366 (Winter 2024), CS 354 (Winter 2022).
- **Late work**: six late days for the quarter, at most two on any single assignment, no credit past 48 hours. For HW4 and HW8 even OAE extensions are capped at two days, so that solutions can be released before the exams.
- **Exam times**: the Winter 2026 midterm is February 11, 6–9 pm; the final is March 18, 3:30–6:30 pm. This offering took part in the pilot proctoring program run by Stanford's Academic Integrity Working Group (AIWG).
- **Points per assignment**: 43 / 60 / 42 / 38 / 40 / 65 / 38 / 49, for 375 points across the quarter. I totaled these part by part from the eight PDFs; the course site doesn't publish the table. Ethics problems come to 22 points, roughly 6% (8 in HW4, 4 each in HW5 and HW6, 6 in HW8).
- **Lecture and material counts**: eighteen regular lectures plus one EthiCS lecture, nine sections plus three review sessions, thirteen Python notebooks.
- **Course staff**: two instructors, one course manager, one head CA, seven CAs, plus one CA dedicated to ACE.
- **The Stanford Online version**: five units, eight weeks, ten to twenty hours a week suggested, tuition $7,875 (the page notes it is subject to change), running June 22 to August 15 in 2026, and showing enrollment closed when I checked.
- **What I could not confirm**: first, enrollment numbers — neither the course site nor ExploreCourses publishes them, and I found no citable source. Second, whether autumn and summer offerings return in 2026–2027 — ExploreCourses currently lists only winter and spring, but future-year data fills in gradually, so it is too early to call it a reduction. Third, whether the full course sites for offerings before Winter 2026 are still up. The directory `web.stanford.edu/class/archive/cs/cs161/` returns a 404 outright, and I found no browsable archive index; the only old material I could confirm still exists is the year-by-year notebook repos on GitHub, going back to Winter 2021.

## References

- [Stanford CS 161 Winter 2026 course site](https://stanford-cs161.github.io/winter2026/) — primary source for the title, instructors, grade breakdown and prerequisites
- [CS 161 lecture index](https://stanford-cs161.github.io/winter2026/lectures/) — notes, slides, pre-lecture exercises and notebook links for all eighteen lectures, and the note that recordings are Canvas-only
- [CS 161 homework page](https://stanford-cs161.github.io/winter2026/homework/) — the eight PDFs and LaTeX templates, with release and due dates
- [CS 161 policies page](https://stanford-cs161.github.io/winter2026/policies/) — zero credit for handwritten work, the late-day rules, and the LLM policy in full
- [CS 161 resources page](https://stanford-cs161.github.io/winter2026/resources/) — the "memo to a colleague" wording, the textbook list, and the "not using iPython notebooks this quarter" line
- [CS 161 EthiCS page](https://stanford-cs161.github.io/winter2026/ethics/) — confirms there is exactly one ethics lecture all quarter
- [CS 161A / ACE page](https://stanford-cs161.github.io/winter2026/cs161a/) — what the one-unit section covers and its attendance requirement
- [ExploreCourses CS 161 entry](https://explorecourses.stanford.edu/search?q=CS+161&view=catalog) — official title, 3–5 units, terms offered, and the prerequisite fields of downstream courses
- [Stanford CS BS degree requirements (current)](https://www.cs.stanford.edu/bs-degree-requirements) — the five core courses must be taken for five units
- [Stanford Bulletin: CS161](https://bulletin.stanford.edu/courses/1056871) — the current official bulletin title is Design and Analysis of Algorithms
- [Stanford CS BS core requirements (Wayback snapshot, 2026-05-10)](http://web.archive.org/web/20260510054742/https://www.cs.stanford.edu/bs-core-requirements) — the retired page, and the only surviving record of "Data Structures and Algorithms (CS161)" and the A\* search description
- [Stanford Online: CS161 for credit](https://online.stanford.edu/courses/cs161-design-and-analysis-algorithms) — tuition, units, hours and dates
- [CS 161 Summer 2026 FAQ](https://web.stanford.edu/class/cs161/) — the summer offering is written from scratch, the remote-attendance conditions, and "no actual programming component"
- [winter2025-extra (notebook source)](https://github.com/stanford-cs161/winter2025-extra) — MIT license, the Mary Wootters attribution, and the README carried forward for five years
- [winter2026 (course site source)](https://github.com/stanford-cs161/winter2026) — the whole site's public git history
- [Concept-check bank: winter2025-bank](https://github.com/stanford-cs161/winter2025-bank) — per-topic interactive questions with solution PDFs
- [Algorithms Illuminated](https://www.algorithmsilluminated.org/) — the recommended textbook, with free videos from the author
- [Moses Charikar's faculty page](https://profiles.stanford.edu/moses-charikar), [Ellen Vitercik's faculty page](https://profiles.stanford.edu/ellen-vitercik) — titles and research areas of the two instructors
- On this site: [Map of Stanford CS courses](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Stanford CS329A deep dive](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
