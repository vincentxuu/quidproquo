---
title: "Stanford CS111: Nine Assignments Build an Operating System, and the Exams Don't Test Them"
date: 2026-08-21
category: learning
type: deep-dive
tags: [cs111, ai-course, stanford, operating-systems, self-study, c-language]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 1
additionalSeries:
  - name: "Reading Stanford's Main-Line CS Courses"
    order: 5
tldr: "CS111's nine assignments run from lambdas to crash recovery in a journaling file system. Reading the site page by page turns up three things the syllabus blurb never mentions: assignment 3 is the point of no return, because assignment 4 compiles your assignment 3 code; a whole block of the final exam asks for definitions of ethics terms, and the public practice sheet ships with answers; and pasting your own code into an AI tool to ask about it is written down, in plain words, as an Honor Code violation."
description: "A page-by-page read of the Spring 2026 CS111 site — nine assignment handouts, 28 lecture PDFs, the public exam archive, and the Honor Code page — covering the real difficulty curve, the content gap behind the CS110 rename story, and exactly what someone without a SUNet ID can get."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-21-stanford-cs111-operating-systems)

[CS111: Operating Systems Principles](https://web.stanford.edu/class/cs111/) is the systems slot in Stanford's five-course undergraduate core, sitting directly after CS107. What it teaches fits in one sentence: your program has never actually had this machine to itself, and this course shows you how the layer in the middle keeps up the illusion.

The site's [map of Stanford's CS courses](/posts/learning/2026-08-20-stanford-cs-course-map-en) already made the case that CS111's assignment list *is* an operating system. That was a judgment at the level of the ladder. This piece answers what happens once you're inside: what each of the nine assignments actually asks of you, which one you can't walk back from, why an OS course spends two lectures on trust, and how much of the widely repeated "CS111 is just the old CS110" holds up.

**Scope first.** Everything here comes from public web pages: the Spring 2026 course site, the nine assignment handouts, all the lecture PDFs, the public exam archive with solutions, the Honor Code page, the ExploreCourses entry, and a second CS111 site that David Mazières put up in 2021 and that is still live. **Not read: the lecture recordings** (behind Canvas), **the weekly section handouts** (behind Stanford login), and **the starter code** (on the campus myth cluster). So the difficulty claims below are inferred from assignment specs, dependency chains, and grading rules — they are not a student's account of taking the course.

## The hard facts

The instructor is [Mendel Rosenblum](https://stanford.edu/~mendel). One line from his bio is worth holding onto: co-founder of VMware, and its chief scientist for the company's first decade. That fact pays off in lecture 27.

The [ExploreCourses entry](https://explorecourses.stanford.edu/search?q=CS+111&view=catalog) lists autumn, winter and spring offerings, and gives a range in the units field. That range is a trap. The [CS department's BS degree requirements page](https://www.cs.stanford.edu/bs-degree-requirements) adds a hard rule: every undergraduate taking CS103, CS107, CS109, CS111 or CS161 must take it for 5 units, major or not. The [syllabus](https://web.stanford.edu/class/cs111/syllabus) is blunter still — an undergraduate not enrolled for five units will not receive a grade, and dropping units removes no course requirement. The range is for graduate students (exact figures in the appendix).

There is one prerequisite, CS107, but the syllabus spells out what "or equivalent" means: writing complex memory manipulation with `malloc`/`free`/`new`/`delete`, working in a Unix environment with `make`, `gcc`, `valgrind` and `gdb`, and a basic understanding of x86-64.

Auditing is answered in the [FAQ](https://web.stanford.edu/class/cs111/faq), and the answer is looser than most people assume — its own section below.

## The spine of the course: history first, principles second

Page two of the [first lecture](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf) puts the teaching method on the table: "operating system" is a hard term to define, the field grew out of a pile of concrete problems, and the easiest way in is therefore through its history.

The next dozen slides really are a chronicle. In the 1940s one person at a time sat at the console. The IBM 701's operating system was a shared deck of cards. The IBM 7094 got memory relocation and protection, and multiprogramming and the kernel followed from that. By the mid-1960s systems had grown past anyone's control, and the Multics and OS/360 disasters gave birth to software engineering as a discipline.

Only after that line is drawn does a slide say **"Then extract principles."** This is where the course parts ways with the other common approach. It doesn't hand you kernel source and peel it apart layer by layer. It makes you watch each mechanism get invented in response to a specific problem.

The same deck has a slide called "Why OS is Interesting," and its last item is a pair of philosophical questions: is fairness more important than overall happiness? Can the past predict the future? Neither is decoration. The first is what a scheduling algorithm has to answer; the second is the entire bet the clock-algorithm assignment is making.

The course splits into three blocks: concurrency (four programming assignments), memory management (two), file systems (two). The last two lectures land on virtual machines and review. Rosenblum teaches lecture 27 on virtual machines himself, and the [calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar) gives the reason as using virtual machines to review the topics of the course — because fooling an entire operating system means virtualizing every mechanism of the previous nine weeks all over again. Having the person who wrote VMware close that loop is a fairly direct piece of scheduling.

## What the assignments look like: nine of them, with the divide at number 3

The nine assignments (assign0 through assign8) run on a rhythm of due Thursday, next one out the same day. One by one:

| # | Title | What you're actually doing |
|---|---|---|
| [assign0](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign0/) | Welcome to CS111 | Reading code, short answers, a little writing — checking your C/C++ hasn't rusted |
| [assign1](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign1/) | Lambdas, Threads, and Processes | Managing execution three different ways, with atomics along the way |
| [assign2](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign2/) | Synchronization | The monitor pattern applied to two problems: Caltrain boarding and party grouping |
| [assign3](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign3/) | Thread Dispatcher | **Implementing threads yourself, in user space**: separate stacks, timer interrupts, round-robin scheduling |
| [assign4](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign4/) | Locks and Condition Variables | Mutexes and condition variables on top of your own threads, plus seven ethics questions |
| [assign5](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign5/) | Memory-Mapped Encrypted Files | Catching page faults, loading on demand, simulating the hardware dirty bit with page protections |
| [assign6](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign6/) | Page Replacement with the Clock Algorithm | Dropping the assumption that physical pages are plentiful, and writing page replacement |
| [assign7](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign7/) | Reading Unix V6 Filesystems | Rebuilding all four layers of the 1975 Unix V6 file system in C, well enough to read files out |
| [assign8](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign8/) | Journaling File System | Crashing a file system on purpose, then repairing it from a write-ahead log |

Three of these come in pairs, each second half built on the first. The first two pairs are welded especially tight: the first thing assign4 tells you to do is run `make copy_thread_sources`, which copies your assign3 code over as the foundation, and assign5-to-assign6 works the same way. Both handouts carry the same warning — if the previous assignment isn't fully working, you may need to go back and finish it first.

**The divide is assign3.** Not because it's the longest, but because it changes who you are. In assign1 and assign2 you're a user of threads and mutexes; from assign3 on you're the implementer, and every assignment after that stands on your own implementation. The handout names this itself. It calls the assignment an example of virtualization — you take one system thread and use it to implement many user-level threads — and adds:

> Your code to implement user-level threads will be very similar to the code that implements system threads in an operating system running on a single core.

The other candidate is assign8, but its difficulty lives somewhere else. You write roughly ten to fifteen lines — three methods that replay log entries, a few lines each. The hard part comes before that: understanding a complete file system written in heavy modern C++, block cache and freemap bitmap and FUSE mount included. It tests whether you can find where those fifteen lines go inside a large unfamiliar codebase, which is a different kind of pain from growing a mechanism from nothing in assign3.

Worth noting, too: assign8 has a pedigree. The assignment and the V6 FUSE implementation come from [David Mazières](https://www.scs.stanford.edu/~dm/), and John Ousterhout is on the list of people who modified it. The canonical paper on journaling file systems, [The Design and Implementation of a Log-Structured File System](https://web.stanford.edu/~ouster/cgi-bin/papers/lfs.pdf), was written by Rosenblum and Ousterhout. The last assignment of this course is taught by one of the two authors of that paper, with the other one editing the handout.

## An OS course that gives two lectures and a chunk of the final to "trust"

Stanford's CS department drops short ethics units into many of its courses. CS111 drew **trust**. This isn't a line on a bulletin board; it has three checkable landing spots.

First, two lectures on the calendar: lecture 12, "Trust and Operating Systems," and lecture 25, "Truth, Trust, and Technology." [Lecture 12](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf) opens with the definition of trust from Google DeepMind's [The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244) (arXiv:2404.16244), then sorts the ways trust gets established into three: assumption, inference, substitution. The slide on software delivers a hard verdict — "Assumption: ineffective, not used," and "Inference: the path to trust is through distrust," meaning testing, verification and instrumentation.

Second, assign4 turns it into something you hand in. In the same assignment where you finish implementing mutexes and condition variables, you answer seven questions in `questions.txt`: how you'd get another student to trust your assign3 and assign4 code; what you could do beyond `sanitycheck` to raise your own confidence in it; and then, after reading a write-up of a 2020 race condition in Google Duo — the bug was found by Natalie Silvanovich of Google Project Zero — using the trust framework from lecture to analyze where the developers over-trusted and what concrete harm reached users.

Third, it's on the exam. The exams directory holds a [Final-Exam-Ethics-Practice.pdf](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/exams/Final-Exam-Ethics-Practice.pdf) with matching solutions, downloadable by anyone. The first question hands you a race condition in a calendar app and asks what agential gullibility is and where the company displayed it. The second asks what trust by substitution is and why file system permissions are an example. A course that teaches paging and inodes asks you to define terms from ethics on paper in the final — and I have not seen that mentioned in a single secondhand write-up of CS111.

## The CS110 rename story is only half true

The source of "CS111 is just the old CS110" is real: the CS department's core requirements page once carried, right under the CS111 entry, "Note: Formerly known as CS110." So the huge pile of CS110 self-study guides online must be about the same course — a safe-looking inference that doesn't hold.

Start with the sentence's own situation: **the page it lived on is gone.** Stanford's CS department moved to a new site and the old URL now 404s. The [degree requirements page](https://www.cs.stanford.edu/bs-degree-requirements) that replaced it kept the five-unit rule and dropped any mention of CS110. The original sentence now survives only in an [archived snapshot](https://web.archive.org/web/20260113002433/https://www.cs.stanford.edu/bs-core-requirements) from January 2026. No live official page uses the word "renamed."

Three other things don't line up.

**One: ExploreCourses says something different.** The last line of the CS111 entry reads "Available as a substitute for CS110 that fulfills any requirement satisfied by CS110." That is *substitute*, not *is*. And [the CS110 entry is still there](https://explorecourses.stanford.edu/search?q=CS+110&view=catalog), with its own description and a scheduled section in spring 2026–2027.

**Two: the content is far apart.** [The CS110 archive](https://web.stanford.edu/class/archive/cs/cs110/cs110.1204/) is still up — I checked, the Winter 2020 version opens fine — and its assignment list runs: file systems, multiprocessing, a Stanford Shell, an RSS news aggregator, a ThreadPool, an HTTP proxy with caching, MapReduce. The lecture schedule has three full lectures on networking, one on MapReduce, one on systems design principles.

Today's CS111? **Not one lecture on networking.** No shell, no HTTP, no MapReduce. In their place: virtual memory, demand paging, page replacement, disks, directories and links, crash recovery, flash memory, virtual machines. All the two courses still share is the concurrency block.

**Three: the residue is visible.** The CS111 exams directory still holds a past paper named `CS110Win19Final4f.pdf`, plus two practice sheets with "CS110 Practice Midterm" printed on them. Go back further and the 2012 one is headed CS 140 — Stanford's earlier operating systems course.

So the accurate statement is this: **the course number was inherited officially; the content was not.** That matters practically for a self-learner. Follow a CS110 study guide and you'll build an HTTP proxy and a MapReduce, neither of which is in CS111 today; you also won't touch paging, replacement or crash recovery, which are half of what CS111 is now. Both sets of material are worth something, but they aren't two versions of one course.

## Where the points are: assignments are a third, and the exams don't test them

The first lecture deck has a slide comparing CS111 to CS106 and CS107. It's three lines, and those three lines decide how a self-learner should budget time:

> - Earlier courses (CS106 & CS107) lectures focus on assignments
> - CS111 lectures focus on operating systems principles and concepts
>   - Sections focus on the assignments
>   - Exams focus on lecture material

Put that next to the syllabus grade breakdown and it gets sharper: assignments are a little over a third, and the two exams together are more than half (full weights in the appendix). Which means someone who only works through the nine assignments has earned the lighter half of the course. The lecture half — those 28 PDFs — is what the exams are actually about.

For a self-learner that's good news, because the lecture half is the public half. It's the assignment half that's locked.

## What a self-learner can actually get

Item by item, not lumped together.

**28 lecture PDFs: yes.** All of them sit in the archive directory, no login.

**Nine assignment handouts: yes.** Full specs, API documentation, milestone breakdowns and learning goals are all on the web pages.

**Starter code: no, unless you can log into myth.** Every assignment is obtained by running `git clone /afs/ir/class/cs111/repos/assignN/$USER` on Stanford's myth cluster, which is a campus path. But the FAQ carries a rule almost nobody quotes: auditors are welcome to use the course website materials, and "to access assignments, you can access them using `guest` instead of `$USER` in the cloning command for assignments." That route still needs SSH access to myth, which still needs a SUNet ID — I don't have an account and could not test whether the `guest` path still works.

**Lecture recordings: no in principle, but the FAQ leaves a door open.** The recordings live in Canvas. The last sentence of that same FAQ answer: if you want access to lecture recordings, email the course staff for access.

**Past exams with solutions: yes, and lots of them.** The exams directory has midterms and finals from 2022, 2023 and 2024, every one with solutions, plus practice sheets, review decks, and the ethics practice sheet and solutions mentioned above. It is the densest part of the public material.

**Section handouts: no.** The pages for the eight sections are public, but the "Section Slides" link points at `restricted/labdocs/` and bounces you to Stanford WebLogin. It's the only genuinely locked directory on the whole site.

**Textbook: you buy it.** The calendar lists [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/) (Anderson and Dahlin, second edition), and every week's reading is marked optional. The course doesn't assume you own it.

**And there's a public source most people don't know about.** David Mazières taught CS111 in spring 2021 and put his section material on his own server: [scs.stanford.edu/21sp-cs111](https://www.scs.stanford.edu/21sp-cs111/). The site is still live, with eight project handouts, section slides, and **demo code tarballs you can download directly**. The most interesting thing on it is the license line in the footer:

> Permission hereby granted for anyone to copy, modify, and redistribute any lecture note material from this class that belongs to the instructor(s) or Stanford.

Compare that with the copyright notice at the bottom of every page of the current CS111 site — "This content is protected and may not be shared, uploaded, or distributed." Same school, same course, two sites, exactly opposite terms on reproduction. Anyone quoting CS111 material is on safer ground with Mazières's.

(One honest caveat: some project starter code on that page is handed out over public HTTPS URLs of the form `https://web.stanford.edu/class/cs111/starters/*.git`. I tried each one, and those repos all 404 now, so any self-study guide citing that path is broken. The section demo tarballs themselves are still there.)

## One rule about AI, worth reading before you start typing

The [Honor Code page](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/collaboration.html) has a section called "Use of Generative AI Tools." Its first sentence is the usual one — don't use AI tools to write code or responses for you. The second sentence is not usual at all:

> For example, you should not use AI tools to write code/responses for you on assignments or any graded work. Another example is you should not input your code to AI tools to ask questions about it. Doing so is a violation of the Stanford Honor Code.

Most AI policies govern output. This one rules out even asking about code you wrote yourself. Read in 2026 it stings a little, because the same university runs [CS146S](/posts/ai/2026-08-16-cs146s-course-map-en), a whole quarter on directing coding agents to write software. The two courses coexist without contradiction — CS111 states its reason plainly, that in this course the process is worth more than the product — and if you're working through the public material on your own, the rule doesn't govern you. It's worth reading because it tells you where this course believes the learning happens.

The same page carries an uncommon mechanism: a withdrawal and retroactive citation form. Within five days of a deadline you can withdraw a submission, no reason required. That assignment scores zero, and the course will not investigate you over it. A certain zero, traded for an uncertain Honor Code case.

## How to start

One thing you can do tonight, with no account:

```bash
curl -O https://www.scs.stanford.edu/21sp-cs111/notes/p2demo.tar.gz
tar xzf p2demo.tar.gz && cd p2demo
g++ -std=c++17 -o tvp thread-v-process.cc -lpthread
./tvp
```

(`make` will fail, because the Makefile tries to clone the starter repo that now 404s; compiling this one file directly is unaffected. I ran the lines above on macOS.)

You'll see two processes each count from 0 to 9. Then open `thread-v-process.cc`, change the `#if 1` in `main` to `#if 0`, recompile and run again — this time two threads take turns pushing a single shared counter to 19.

Same `count` function, same global variable; one character of difference turns "shared address space" into numbers on your screen. That's the question the first exercise of assign1 asks, and the foundation for the eight assignments after it.

When you're done, the next step isn't hunting for starter code. Go to the exams directory, grab the [Spring 2024 midterm and its solutions](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/exams/Spr2024Midterm.pdf), and take it once. The exams test the lectures, and the lectures are entirely public — the friendliest thing about this course for a self-learner, and the easiest to overlook.

## Appendix: numbers and how they were checked

- **Grade weights** (Spring 2026 syllabus): assignments 35%, section attendance 5%, lecture participation 5%, midterm 20%, final 35%. The midterm is two hours, closed-book, with two double-sided A4 pages of notes allowed; the final is three hours.
- **Units**: ExploreCourses and the Stanford Bulletin both say 3–5 units; the CS degree requirements page mandates 5 units for CS103/107/109/111/161; the syllabus adds that only enrolled Stanford graduate students may take 3–5 units, and undergraduates below five units are not graded. All three agree — they're just cutting the same rule from different angles.
- **A source that moved**: while this was being checked, Stanford CS's `www-cs.stanford.edu/bs-core-requirements` came down (301 to `www.cs.stanford.edu/bs-core-requirements`, then 404). The five-unit rule is now cited to the current degree requirements page, and "Formerly known as CS110" to a January 2026 archive snapshot. Older articles citing that line all need their links replaced.
- **Size and schedule**: Spring 2026 meets in Nvidia Auditorium, three 50-minute lectures a week, 28 total (one cancelled for a holiday). Eight sections, eight programming assignments plus one warm-up.
- **Future offerings**: autumn, winter and spring of 2026–2027; Nick Troccoli teaches autumn and winter, Rosenblum teaches spring (per the ExploreCourses entry, checked August 2026).
- **Archive URL format**: `web.stanford.edu/class/archive/cs/cs111/cs111.1266/` (1266 = Spring 2026). The CS110 archive is `cs110.1204` (Winter 2020), reachable at the time of writing.
- **A mislabeled holiday**: the Spring 2026 calendar marks May 25 as Presidents' Day; that date is actually Memorial Day (Presidents' Day is in February). The cancellation is right, the label isn't.
- **Three things I could not confirm**: (1) whether the auditor clone path with `guest` in place of `$USER` still works — I have no SUNet ID and couldn't test it; (2) how often the email request for recording access is actually granted; (3) the Winter 2026 offering (`cs111.1264`) numbers its assignments differently from Spring 2026 (V6 file systems is assign1, the journaling file system is assign2). I could only reach those two archived handouts, not that quarter's full calendar, so I can't tell whether the whole sequence was reordered.

## References

- [CS111: Operating Systems Principles course site](https://web.stanford.edu/class/cs111/) — Spring 2026 announcements, staff, exam times and locations
- [CS111 Syllabus](https://web.stanford.edu/class/cs111/syllabus) — grade weights, the concrete definition of the prerequisite, the five-unit rule, the official description of the course's three parts
- [CS111 course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar) — 28 lectures, the OSPP reading for each, release and due dates for all nine assignments
- [CS111 FAQ](https://web.stanford.edu/class/cs111/faq) — the auditing policy verbatim, including `guest` in place of `$USER` and emailing for recording access
- [CS111 Honor Code and collaboration policy](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/collaboration.html) — the generative AI clause verbatim, and the withdrawal / retroactive citation mechanism
- [assign3: Thread Dispatcher](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign3/) — the full spec for the pivotal assignment and the "example of virtualization" framing
- [assign4: Locks, Condition Variables, and Trust](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign4/) — the `make copy_thread_sources` dependency and the seven trust questions
- [assign8: Journaling File System](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign8/) — the "roughly 10-15 lines" figure and the Mazières / Ousterhout attribution
- [Lecture 1: Introduction](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf) — the history-then-principles method, the course's three parts, and the three lines about what exams test
- [Lecture 12: Trust and Operating Systems](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/12/Lecture12.pdf) — the three ways trust is established, and "the path to trust is through distrust"
- [Final exam ethics practice sheet](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/exams/Final-Exam-Ethics-Practice.pdf) — evidence that the ethics unit really reaches the final, with solutions attached
- [ExploreCourses: CS 111](https://explorecourses.stanford.edu/search?q=CS+111&view=catalog) — the units range, three quarters a year, and instructors for the next three
- [ExploreCourses: CS 110](https://explorecourses.stanford.edu/search?q=CS+110&view=catalog) — the CS110 entry still exists, still scheduled, and describes something different from CS111
- [Stanford CS BS Degree Requirements](https://www.cs.stanford.edu/bs-degree-requirements) — the current page and the source for the five-unit rule ("all undergraduate students (regardless of major) enrolling in CS 103, 107, 109, 111 or 161 must take it for 5 units")
- [Archived CS BS Core Requirements, January 2026](https://web.archive.org/web/20260113002433/https://www.cs.stanford.edu/bs-core-requirements) — the only readable source left for "Note: Formerly known as CS110."; the live URL is gone
- [Stanford Bulletin: CS111 course entry](https://bulletin.stanford.edu/courses/2228601) — the current official description says only "substitute for CS110," with no mention of a rename
- [CS110 archive, Winter 2020](https://web.stanford.edu/class/archive/cs/cs110/cs110.1204/) — the old CS110 assignment and lecture lists, used here to measure the content gap
- [CS111 lab page, Spring 2021, David Mazières](https://www.scs.stanford.edu/21sp-cs111/) — freely redistributable section material and demo code tarballs
- [Mendel Rosenblum's page](https://stanford.edu/~mendel) — the VMware co-founder and chief scientist bio
- [The Design and Implementation of a Log-Structured File System](https://web.stanford.edu/~ouster/cgi-bin/papers/lfs.pdf) — the Rosenblum and Ousterhout LFS paper (ACM TOCS 1992, DOI 10.1145/146941.146943), the origin of the assign8 thread
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/) — the site for the textbook the course lists as optional
- [The Ethics of Advanced AI Assistants](https://arxiv.org/abs/2404.16244) — the source of the trust definition quoted in lecture 12
- On this site: [Stanford's CS courses, ordered by prerequisite](/posts/learning/2026-08-20-stanford-cs-course-map-en)
- On this site: [Reading Stanford CS329A](/posts/ai/2026-08-20-stanford-cs329a-self-improving-agents-en)
- On this site: [Stanford CS146S, two syllabi compared](/posts/ai/2026-08-16-cs146s-course-map-en)
