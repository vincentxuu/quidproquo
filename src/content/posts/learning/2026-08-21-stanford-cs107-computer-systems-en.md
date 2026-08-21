---
title: "Stanford CS107: The Same Course Weights Assignments at 40% One Quarter and 20% the Next"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs107, ai-course, stanford, c-language, systems-programming, self-study]
lang: en
series:
  name: "Reading Stanford's Main-Line CS Courses"
  order: 3
tldr: "CS107 runs from Unix and C all the way to x86-64 and writing your own malloc, across seven assignments. But line up four archived syllabi and the course stops looking like one course: assignments are worth 40% in three quarters and 20% in Summer 2026, where in-class quizzes take 40%. The resubmission policy exists only in the quarters Cain taught; Troccoli's quarter has none. The one assignment that accepts no late days is the final heap allocator. And what blocks a self-learner isn't the autograder — it's that every starter repo lives on AFS."
description: "A walkthrough of Stanford CS107 built from the public site: seven assignment specs, seven lab handouts with published solutions, four archived syllabi and their announcement pages. Covers how grading and assignment policy shift between quarters, what each assignment actually asks for, where the real rule break is, and exactly what a self-learner can and cannot get."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs107-computer-systems)

[CS107: Computer Organization and Systems](https://web.stanford.edu/class/cs107/) is the last of Stanford's three-course introductory programming sequence, following CS106A and CS106B.

Its job is to dismantle a mental model. High-level languages let you believe a variable is a box; this course replaces that with a variable is a run of bytes at an address. Along the way you rewrite a batch of Unix utilities in C, read x86-64 assembly, and finally implement your own `malloc`.

This site's [map of Stanford's CS course sequence](/posts/learning/2026-08-20-stanford-cs-course-map-en) puts CS107 among the five undergraduate core courses and calls it the most painful and the most worth it. That's a judgment about where the course sits on the ladder. This piece is about what happens once you're inside: what each of the seven assignments does, and which one is the actual break. Plus a more practical question — someone with no SUNet ID following this public site, how many steps in do they hit a wall?

**Scope, up front.** Everything here comes from public web pages: the current quarter's course site, seven assignment specs, seven lab handouts with their solutions, three archived quarters (quarter codes and their terms are in the appendix), the ExploreCourses entry, and the Stanford Online for-credit page. **Not read: lecture recordings** (behind Canvas), **exams** (same), and the autograder's test suite (the course says explicitly it isn't released). So what follows is what's on those pages, not a report from someone who took the class.

## The hard facts

The instructor rotates. The [ExploreCourses entry for CS107](https://explorecourses.stanford.edu/search?q=CS+107&view=catalog) shows Jerry Cain teaching autumn and winter next academic year and Nick Troccoli teaching spring. Summer 2026 is listed under Adam Keppler and Yasmine Alonso.

Four offerings a year — unusually frequent for a Stanford CS course.

There is one prerequisite: CS106B or equivalent. But the syllabus spells "equivalent" out concretely — recursion, pointers, linked lists, trees, graphs, stacks, queues, sets, maps, searching, sorting, hashing. It asks for one more thing besides: that you already care whether your code reads well.

Units is the field most often misread. ExploreCourses says "3-5 units," while the [Stanford CS department's degree requirements page](https://www.cs.stanford.edu/bs-degree-requirements) mandates that the core courses be taken for five units — and scopes that mandate more broadly than most people assume, to "all undergraduate students (regardless of major)" (the course list is in the appendix).

The two don't contradict each other; ExploreCourses just doesn't put the condition in the main field. The syllabus states it: only enrolled graduate students may take fewer units, undergraduates always take five. And enrolling for fewer units doesn't mean doing less work — it means not getting a grade.

Two more details live only in the official fields: CS107 satisfies both the WAY-FR and GER:DB-EngrAppSci general-education requirements, and "CS 107 and CS 107E may not both be counted for credit." That second one catches people planning from lists they found online.

The assigned textbook is Bryant and O'Hallaron's *Computer Systems: A Programmer's Perspective*. The syllabus insists on the third edition, because the previous one still teaches IA32 rather than x86-64.

## What it dismantles is the assumption that your program runs on an abstract machine

CS106B teaches you to manipulate data structures as concepts. The entire course-objectives field of CS107 is about taking that back. The syllabus splits its outcomes into three tiers, and the top tier, "mastery," has only three items — all pointing the same direction. As listed: write C programs that manipulate memory and pointers in complex ways, hold an accurate model of a C program's address space, and understand a C program's compile-time and runtime behavior.

The lecture schedule is that line, implemented. It opens with integers, bits and bytes, moves into C strings and pointers, then the heap and function pointers, then turns to assembly. Six straight lectures in the middle sit in x86-64: arithmetic and logic, condition codes and control flow, the runtime stack, alignment and optimization. The last of them is called "Managing the Heap" — precisely the setup for the final assignment.

One lecture deserves a note of its own. The Summer 2026 schedule slots a **Sockets** lecture in just before the final review. The official course description on ExploreCourses lists no networking topics. I can point at a page for each of those facts, but no page connects them — whether that lecture is unique to that quarter, I could not verify (see the appendix). Anyone trying to infer from a syllabus whether CS107 covers networking should first check which offering's schedule they're reading.

## The seven assignments, one by one

They run from `assign0` to `assign6` — seven in all, each done individually, no partners.

| Assignment | What you build |
|---|---|
| [Assign0: Intro to Unix and C](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign0/) | Investigate a simulated intrusion using Unix commands, then rework a C program that draws a Sierpinski triangle so it takes command-line arguments |
| [Assign1: A Bit of Fun](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign1/) | Simulate a cellular automaton with bit vectors, hand-assemble UTF-8 bit patterns, detect addition overflow, plus a case study of the Ariane 5 overflow failure |
| [Assign2: C Strings](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign2/) | Rewrite `printenv` and `which`, and implement a tokenizer better than `strtok` (with `getenv` and `strtok` off-limits) |
| [Assign3: A Heap of Fun](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign3/) | Rewrite `uniq` and `tail` on top of your own automatically growing `read_line` |
| [Assign4: Into the void*](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign4/) | Rewrite `ls` and `sort`, with a generic binary insertion routine that works on any type in between; `versionsort` and `alphasort` are banned |
| [Assign5: Banking on Security](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign5/) | Find three vulnerabilities in a fictional ATM program, de-anonymize bank users from public check-in data, then reverse-engineer a vault binary you get only as an executable |
| [Assign6: Heap Allocator](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign6/) | Implement two allocators, implicit free list and explicit free list — your own `malloc`, `realloc` and `free` |

There's a clear rhythm to the first five: take a Unix command you use every day and rewrite it from the implementer's side. The Assign2 spec turns that into a statement of the course's position — C was invented to write Unix and its command-line tools, so rewriting them in C is the most natural exercise there is.

Assign5 changes genre. It isn't a rewrite of some tool; it hands you a binary with no source and asks you to reverse it — and that `vault` executable is **generated per student**, so your classmate's password is not your password. The spec also puts "using AI tools to do the reverse-engineering for you" on the honor-code list of prohibited things.

Assign6 changes genre again. The first six all ship a solution binary you can compare behavior against; the seventh doesn't. An allocator isn't a runnable program, it's a set of functions other programs call. Instead you get a test harness plus a batch of script files, and the scripts contain exactly three kinds of request: `a` (allocate), `r` (reallocate), `f` (free). You chase three goals that fight each other: correct, memory-efficient, fast. The spec lays the tradeoff out:

> "A bump allocator can be crazy-fast but chews through memory with no remorse. Alternatively, an allocator might pursue aggressive recycling and packing to squeeze into a small memory footprint, but execute a lot of instructions to achieve it."

## The same course, four quarters, four grading schemes

Put four archived syllabi side by side and the most robust finding about this course isn't its difficulty. It's that **the grading scheme changes when the instructor changes.**

| Component | [Spring 2025](https://web.stanford.edu/class/archive/cs/cs107/cs107.1256/syllabus.html) (Troccoli) | [Autumn 2025](https://web.stanford.edu/class/archive/cs/cs107/cs107.1262/syllabus.html) (Cain) | [Winter 2026](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/syllabus.html) (Cain) | [Summer 2026](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/syllabus.html) (Keppler and Alonso) |
|---|---|---|---|---|
| Assignments | 40% | 40% | 40% | 20% |
| Lab participation | 5% | 10% | 10% | 5% |
| Lecture points / quizzes | 5% (lecture points) | none | none | 40% (in-class quizzes) |
| Midterm | 20% | 20% | 20% | 15% |
| Final | 30% | 30% | 30% | 20% |

The summer offering turns the quiz at the start of each lecture into the single largest component, and says outright that the quizzes double as attendance. The three regular quarters have no quiz component at all.

None of this affects a self-learner's grade — you were never being graded. But it affects how you read other people's accounts: **"CS107 is an assignments course" is true for three quarters and one-fifth true for the fourth.** Whatever write-up you find, check which offering the author took first.

## Assignment policy changes with the instructor too, including a resubmission rule

The same set of pages hides a second layer of difference, and this one is easier to plan around badly.

**Both of Cain's quarters have a resubmission policy.** The Winter 2026 syllabus has a section titled Assignment Resubmission Policy:

> "For all assignments except `assign6`, I will allow anyone who pulled less than 85% of the functionality points to re-submit their work to get to up to that 85% mark."

The same section goes on: your original score has to be at least 25%, otherwise the ceiling is three times what you originally earned; and resubmission re-runs the automated tests only, not the code review. The Autumn 2025 syllabus carries the same section with the same wording.

**Troccoli's Spring 2025 has no such section.** That syllabus doesn't address whether you can submit again after seeing a grade at all.

Its late-day tiers differ from Cain's too, and it allows two days instead of three (both scales are in the appendix).

So "you can resubmit in CS107" has no general answer; it depends on who taught that quarter. **To check, open that quarter's archived `syllabus.html` and search for `Resubmission`.** It's there or it isn't — no need to guess.

## Every quarter's announcements put the median at the ceiling

Stanford's archives preserve a full quarter of announcements, and CS107's grade-release announcements report the median functionality score. That's rare public data, worth copying down.

Of the five [Autumn 2025](https://web.stanford.edu/class/archive/cs/cs107/cs107.1262/) assignments with a published median, three are perfect scores and the other two are off by one point and three points.

[Spring 2025](https://web.stanford.edu/class/archive/cs/cs107/cs107.1256/) published all seven; assign4 was a perfect score and the other six all sit near the top, including the final heap allocator (raw numbers in the appendix).

Worth emphasizing that these two quarters had **different instructors and different assignment policies** — one with resubmission, one without — and the medians pin to the ceiling either way.

**None of these pages explains why.** The announcements report numbers, the syllabi state rules, and nothing connects the two. So this stops at an observation: along the autograder axis, CS107's score distribution is flat and high. That doesn't match the reputation of the most painful of the five foundational courses, and the public material doesn't say why it doesn't.

What is certain is that functionality points aren't the course's only axis of discrimination. Code review is graded into five buckets — `+` / `ok` / `–` / `––` / `0` — with no numbers, and there are two closed-book written exams on top.

## assign6 is the one assignment with no safety net in the rules

This isn't inferred from scores; it's written into three separate pages.

The resubmission policy says "all assignments except `assign6`." The [assign6 spec](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign6/) says no late submissions are accepted and the deadline is firm without exception (barring OAE accommodations and Head TA–granted extensions). The Spring 2025 syllabus, the one with no resubmission policy at all, still carves out the same exception specifically for assign6.

It's also split into two deadlines, neither extendable, with a rule between them. You can keep changing the implicit allocator after submitting it at the checkpoint, but the change is only adopted if it passes a discounted comparison: your new score, after the discount, still isn't below your checkpoint score (the discount factor is in the appendix).

To be clear, **this is a break in the rules, not in the scores** — the Spring 2025 assign6 median is high like the rest. So the next sentence is my advice, not the course's: **if you want one assignment to gauge whether you can survive CS107, pick the seventh.** Not because the scores are lowest, but because it's the only one where submitting is final.

## What a self-learner actually gets

Item by item.

**Available, and complete:** eighteen lecture slide decks as PDFs, all seven assignment specs, all seven lab handouts. Every one of these sits at a public URL with no login.

**Available, and this is what makes CS107 unusual for self-learners:** the **solutions to all seven labs are public too.** And they aren't answer keys — they walk through the reasoning problem by problem. The [Lab 1 solutions](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab1/solutions.html), explaining what causes one infinite loop, spell out that right-shifting a signed value propagates the sign bit, and then show how to locate it by interrupting with GDB's `Ctl-c` and inspecting variables. Even the in-lab check-off questions come with model answers. The lab topics, in order: bits and integers, C strings, pointers and the heap, `void *` and function pointers, assembly, the runtime stack, and finally profiling for performance plus an ethics discussion. **These seven handouts plus solutions are the only part of CS107's public material where you get both the problems and the worked answers.**

**Not available, and this is the real wall:** the starter code. Step one of every assignment and every lab is the same command — `git clone` from somewhere under `/afs/ir/class/cs107/repos/...`. That's Stanford's AFS filesystem; it needs a SUNet ID, and you operate from the `myth` machines. Which is to say the first step the assignment page itself lists requires a Stanford account: what blocks you isn't the autograder, it's that **you can't even get the skeleton files for the problem**. All those instructions about not modifying `util.c` or checking behavior against `samples/mysort_soln` point at files you don't have.

**Not available, and the course explains why:** the autograder's test suite. The [grading page](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assignment-grading.html) is unambiguous —

> "Note that we do not give out test cases as part of maintaining a level playing field for future students."

The same page splits the suite into four tiers and explains that the `sanitycheck` published to students is only the most basic sanity tier; the other three (comprehensive, robustness, stress) aren't released. So **even with sanitycheck in hand, you're only validating the shallowest tier**. On this axis, enrolled students get less over a self-learner than you'd think — that last sentence is my judgment; the page lists the tiers and makes no such comparison.

**Not available:** lecture recordings and exams, both inside Canvas. The free electronic copy of CSAPP is in Canvas too. But this one has a public substitute: Chris Gregg's [CS107 reader](https://web.stanford.edu/~cgregg/cgi-bin/107-reader/) sits at a public URL and covers the whole course.

**One correction to the syllabus:** it also recommends Nick Parlante's Essential C, linking to the Stanford CS Library (`cslibrary.stanford.edu/101`). That URL now returns 404; the entire cslibrary site is down to one empty shell page, and the link on the author's own page is dead as well. Anyone hunting for that reader shouldn't circle the official site — it no longer has a live home at Stanford.

**One more thing to note:** the bottom of the course homepage carries a copyright notice explicitly prohibiting redistribution, reproduction, transmission or storage of the page contents in any form. Reading it yourself is fine; mirroring the whole handout set into your own repo is not.

## How to start

Something you can do tonight, no SUNet ID required: open the [Lab 5: Assembly](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab5/) handout and read just the "new GDB commands" section and the x86-64 reference table. Then write a ten-line C function on your own machine, disassemble it with `objdump -d`, and match it line by line against the C you wrote. When you're done, open that lab's solutions page and check yourself.

Lab 5 isn't a random pick: it's the one where the problems, the worked solutions, and the required tools (`objdump` and `gdb`) all sit outside Stanford's starter code. If doing that feels interesting rather than painful, you can probably handle this course. If you find the disassembly completely unreadable — that's exactly why CS107 exists.

To go the whole way, use the seven labs as the spine (problems and solutions both public), the slide decks as supplement, and the assignment specs as reading material — **read the assignments as specifications and build each project from scratch, instead of waiting to fill in blanks.** That's harder than taking the class, but `mywhich`, `myuniq`, `mysort` and the heap allocator are specified thoroughly enough to rebuild without any starter code.

## Appendix: numbers and how they were checked

Everything here comes from official pages fetched on 2026-08-21. Archived URLs follow the pattern `web.stanford.edu/class/archive/cs/cs107/cs107.<quarter code>/`, where 1256 is Spring 2025, 1262 is Autumn 2025, 1264 is Winter 2026, and 1268 is Summer 2026. Each code's term name comes from the title the archived page itself displays, not from decoding the number.

- **Autumn 2025 median functionality scores** (from grade-release announcements on that quarter's archived homepage): assign0 26/26, assign1 90/90, assign3 95 (the announcement says "a perfect 95"), assign4 106/107, assign5 116/119. The assign2 announcement gives no median, and instead reminds anyone below 85% of the functionality points about the resubmission policy, noting that many students reinvented the wheel by implementing `strspn`, `strcspn` and even `strncmp` themselves. No assign6 median appears in that quarter's announcements.
- **Spring 2025 median functionality scores** (from grade-release announcements on that quarter's archived homepage; all seven present): assign0 26/26, assign1 98/100, assign2 95/96, assign3 96/97 (the announcement notes this excludes extra credit), assign4 107/107, assign5 115/119, assign6 113/119. This is the only one of the four quarters that published a median for assign6.
- **Autumn 2025 and Winter 2026 grade composition** (identical): assignments 40%, lab participation 10%, midterm 20%, final 30%. Winter 2026 adds that if an exam median falls below 80, the whole distribution is curved up.
- **Spring 2025 grade composition**: assignments 40%, lab participation 5%, lecture points 5%, midterm 20%, final 30%.
- **Summer 2026 grade composition**: assignments 20%, lab participation 5%, midterm 15%, final 20%, quizzes 40%. The threshold for a C- is guaranteed to be no higher than 70%.
- **Late-submission ceilings (Cain's two quarters)**: 95% within 24 hours, 90% at 24–48 hours, 85% at 48–72 hours, nothing accepted past three days.
- **Late-submission ceilings (Spring 2025)**: 95% within 24 hours, 87.5% at 24–48 hours, two days only.
- **Resubmission policy**: appears only in the Assignment Resubmission Policy section of the Autumn 2025 and Winter 2026 syllabi. Anyone below 85% of the functionality points may resubmit up to that 85% mark, but the original score must be at least 25%, otherwise the ceiling is three times the original; the code review is not redone; it applies to every assignment except assign6. The Spring 2025 syllabus has no such section.
- **assign6 accepts no late submissions**: consistent across all four quarters, except for Head TA–granted extensions and OAE accommodations.
- **assign6 checkpoint rule**: if the implicit allocator submitted at the end differs from the checkpoint version, the new functionality score is multiplied by 0.85 and adopted only if the result is not below the checkpoint score; otherwise the checkpoint version is graded.
- **Code review grades**: five levels, `+` / `ok` / `–` / `––` / `0`; the course says most submissions land at `ok`.
- **Lecture and assignment counts**: Summer 2026 has 18 lectures (including the final review), 7 assignments, 7 labs.
- **Course structure**: lectures Monday, Wednesday and Friday, plus one lab a week. The Summer 2026 final runs three hours.
- **Scope of the five-unit rule**: the degree requirements page reads "In the Core section, all undergraduate students (regardless of major) enrolling in CS 103, 107, 109, 111 or 161 must take it for 5 units." — all undergraduates regardless of major, not just CS majors.
- **CS107ACE**: a separate one-unit supplementary section (also called CS107A or Pathfinders), by application, taken concurrently with CS107, graded satisfactory/no credit.
- **Tuition for the for-credit distance version**: the [Stanford Online CS107 page](https://online.stanford.edu/courses/cs107-computer-organization-and-systems) showed $7,875 for five units on 2026-08-21, running 2026-06-22 to 08-15, with a suggested 15–25 hours per week. Non-degree students must enroll for the maximum units, must take a letter grade, and must hold a B or better in each course to keep enrolling.

Three things I could not confirm. **First**, this site's Stanford CS course map recorded CS107 distance tuition as $8,110 on 2026-08-20, which differs from the $7,875 I read on August 21; that page only shows the currently open offering, and I can't go back to determine which offering $8,110 belonged to, so both readings are reported as read. **Second**, whether the Sockets lecture in the Summer 2026 schedule is unique to that quarter — I can confirm only that ExploreCourses' official description lists no networking topics, and I could not confirm whether other quarters' schedules include it, because the archive has no public index page and you can only try quarter codes one at a time. **Third**, I did not find a resubmission section in the Summer 2026 syllabus, but that isn't the same as the quarter not having one; all I can say is I didn't read it, not that it doesn't exist.

One more thing is deliberately left open: why the medians sit at the ceiling every quarter. Neither the announcements nor the syllabi explain it, and this piece offers no speculative mechanism. Quarters with a resubmission policy and quarters without have equally high medians, so any explanation linking the two needs evidence from outside these pages.

And one thing wasn't unavailable so much as not attempted: the assignment and lab starter code lives on AFS behind a SUNet ID, this piece made no attempt to obtain it, and every description of assignment content here comes from the public assignment specs themselves.

## References

- [CS107: Computer Organization & Systems course site (Summer 2026)](https://web.stanford.edu/class/cs107/) — entry point for the lecture schedule, seven assignments, seven labs and their solutions, plus the no-redistribution copyright notice at the bottom of the page
- [CS107 General Information and Syllabus (Summer 2026)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/syllabus.html) — the grade composition with quizzes at 40%, the expanded prerequisites, the five-unit rule
- [CS107 General Information and Syllabus (Winter 2026)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/syllabus.html) — the grade composition with assignments at 40%, the wording of the Assignment Resubmission Policy section, the late-day tiers, the five code-review grades, the textbook and AI-tool rules
- [CS107 General Information and Syllabus (Autumn 2025)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1262/syllabus.html) — same grade composition and resubmission policy as Winter 2026, showing this isn't a one-quarter anomaly
- [CS107 General Information and Syllabus (Spring 2025)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1256/syllabus.html) — no resubmission policy, late days capped at 87.5% and two days, an extra lecture-points component: the control case for this piece's claim that policy varies with instructor
- [CS107 Spring 2025 archived homepage](https://web.stanford.edu/class/archive/cs/cs107/cs107.1256/) — median functionality scores for assign4, assign5 and assign6, plus the announcement that assign6 takes no late submissions
- [CS107 Autumn 2025 archived homepage](https://web.stanford.edu/class/archive/cs/cs107/cs107.1262/) — median functionality scores per assignment, and the line in the assign2 announcement pointing at the resubmission policy
- [CS107 Assignment Grading](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assignment-grading.html) — the four tiers of the test suite and the stated reason test cases aren't released
- [Assign0: Intro to Unix and C](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign0/) — intrusion investigation and the Sierpinski triangle
- [Assign1: A Bit of Fun](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign1/) — bit vectors, UTF-8, saturating arithmetic and the Ariane 5 case study
- [Assign2: C Strings](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign2/) — rewriting `printenv` and `which` without `getenv` or `strtok`
- [Assign3: A Heap of Fun](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign3/) — an automatically growing `read_line` and two Unix filters
- [Assign4: Into the void*](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign4/) — generic binary insertion, `myls` and `mysort`
- [Assign5: Banking on Security](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign5/) — the per-student `vault` binary and the ban on AI tools for reverse engineering
- [Assign6: Heap Allocator](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/assign6/) — two allocators, two deadlines, no late submissions, and the tradeoff passage quoted above
- [CS107 Lab 1: Bits, Bytes, and Integers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab1/) and [Lab 1 solutions](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab1/solutions.html) — what the published solutions actually look like
- [CS107 Lab 5: Assembly](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab5/) — the starting exercise recommended here, `objdump` and disassembly under GDB
- [CS107 Lab 7: Optimizing, Profiling, and Ethics](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/lab7/) — Callgrind profiling, and the setup for assign6
- [CS107 Getting Started on Myth](https://web.stanford.edu/class/archive/cs/cs107/cs107.1268/getting-started.html) — the myth cluster and the SUNet ID access requirement
- [Stanford ExploreCourses: CS 107](https://explorecourses.stanford.edu/search?q=CS+107&view=catalog) — 3–5 units, GER designations, the three 2026-2027 offerings and their instructors, and the no-double-credit rule with CS 107E
- [Stanford Online: CS107](https://online.stanford.edu/courses/cs107-computer-organization-and-systems) — tuition, hours and non-degree rules for the for-credit distance version
- [Stanford CS BS Degree Requirements](https://www.cs.stanford.edu/bs-degree-requirements) — the five-unit rule verbatim: "In the Core section, all undergraduate students (regardless of major) enrolling in CS 103, 107, 109, 111 or 161 must take it for 5 units." (the old `www-cs.stanford.edu/bs-core-requirements` URL is dead)
- [Stanford Bulletin: CS-BS](https://bulletin.stanford.edu/programs/CS-BS) — backup source for the five-unit rule
- [CS107 Reader (Chris Gregg)](https://web.stanford.edu/~cgregg/cgi-bin/107-reader/) — the syllabus-recommended textbook substitute that is still publicly available (Essential C, recommended alongside it, has a dead `cslibrary.stanford.edu/101` link, so no link is given)
- On this site: [Reading Stanford's CS courses, ordered by prerequisites](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Stanford CS329A](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
