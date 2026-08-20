---
title: "A Reading Guide to Stanford's CS Courses: Which Ones You Can Actually Self-Study, and in What Order"
date: 2026-08-20
category: learning
tags:
  - stanford
  - cs-course
  - learning-path
  - self-study
  - ai-course
  - computer-systems
lang: en
type: guide
tldr: "Stanford's CS department offers enough courses to paralyze anyone trying to start, but the degree has only five load-bearing ones: CS103, CS107, CS109, CS111, CS161. This piece lays out two dozen courses with public materials as a ladder, marks what you can actually get from each (notes? assignments? video?), and names the four things that really stop self-learners — not difficulty, but gated starter code, undistributable recordings, GPU bills, and nobody grading your work."
description: "A ladder through Stanford CS courses from CS106A to CS336, built on the department's official core requirements: what each course teaches, what its public materials actually contain, where self-study breaks down, and three routes through the list depending on your goal."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-20-stanford-cs-course-map)

Stanford's computer science department runs more than three hundred courses a year, and a large batch of them put lectures, assignments, and even past exams at a public URL — no registration, no login, no payment. That fact helps self-learners almost not at all, because it doesn't tell you where to start, or which of those URLs open onto an empty shell.

This is that map. It's ordered by when you'd take each course, from the first programming class to the LLM course that only started existing in 2026, and each rung marks three things: what the course teaches, what its public materials actually contain, and where someone not enrolled for credit hits a wall.

Scope first: **this only covers courses whose materials are public enough to learn from**. Stanford CS also runs a large number of seminar-style, lab-style, and cross-listed courses — HCI, graphics, biocomputation, computational law each have a whole row of them — that publish a syllabus and keep everything else behind Canvas. Self-learners get nothing from those, so they're not on the list. This site also has two series that walk single courses week by week — [CS146S](/posts/ai/2026-08-16-cs146s-course-map-en) and [CS230](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en) — and this piece sits one layer above them rather than repeating them.

## First, kill one assumption: the number is not the difficulty

Plenty of people read CS106B as easier than CS103, or CS336 as harder than CS229, because of the digits. That inference doesn't hold at Stanford, and it's the university that says so. The academic advising handbook's page on the course catalog puts it flatly:

> Stanford does not have a standardized course numbering system. This means that each department is free to number its courses in its own way.

The same page offers a "common though not universal" convention (full ranges in the appendix); roughly, a bigger number means more assumed background. CS follows it loosely, so treat the number as **a rough indicator of what the course assumes you already know**, not as a difficulty ranking. Concretely: CS106B is the second intro course and CS103 is a core course, yet people routinely take them in the same quarter — while CS336 sits in the graduate range and its barrier isn't the math, it's whether you can finish five assignments with almost no scaffolding.

What you should treat as the skeleton isn't the numbering. It's the five courses two sections down.

## Rung one: intro programming, two courses and two languages

**CS106A: Programming Methodology** teaches Python, starting with Karel, a robot that can only move forward, turn, and pick things up. The assignments run Karel, a Khan-Academy-style practice system, image manipulation, text generation, and finally writing a search engine. It assumes no programming background at all — the only course in the department that genuinely starts from zero.

**CS106B: Programming Abstractions** switches to C++ and is where most people actually start learning computer science. Its lecture index reads like a standard data structures syllabus: stacks and queues, sets and maps, Big-O, recursion and backtracking, sorting, pointers and dynamic memory, linked lists, binary search trees, Huffman coding, hashing, graphs and Dijkstra. Finish it and you have the tools for most technical interview questions.

Wedged between them is **CS106L: Standard C++ Programming** — one unit, seven very short assignments, no exams, graded satisfactory/no-credit. It fills in what CS106B deliberately skips in order to teach concepts: initialization, references, iterators, templates, lambdas, move semantics, RAII, smart pointers. If your goal is to write C++ that looks like C++ rather than Java with pointers, that one unit pays well.

**What to do**: open the CS106B lecture index, find "Big O and Algorithmic Analysis," read the slides, then close them and write down every complexity class you remember with an example for each. The gaps are the parts you only thought you understood.

## Rung two: the degree's skeleton is these five

This is the most important section here. Stanford CS's official core requirements page pins the undergraduate skeleton to five courses, with one hard rule attached: **CS103, CS107, CS109, CS111, and CS161 must be taken for five units**. Not recommended — the reduced-unit version isn't accepted.

| Number | Title | The intuition it replaces |
|---|---|---|
| CS103 | Mathematical Foundations of Computing | "It runs, so it's correct" → prove it |
| CS107 | Computer Organization and Systems | "A variable is a box" → it's bytes at an address |
| CS109 | Probability for Computer Scientists | "The average is enough" → distributions, independence, Bayes |
| CS111 | Principles of Computer Systems | "Programs run start to finish" → processes, scheduling, virtual memory |
| CS161 | Design and Analysis of Algorithms | "Fast enough" → why, how fast, and could it be faster |

Things worth knowing:

**CS111 is the old CS110.** The official page flags it: "Formerly known as CS110." The many "Stanford CS110 self-study guides" floating around describe the same course; those resources aren't dead, the name just moved.

**CS103's second half matters more than its first.** The first half is discrete math and proof technique; the second goes straight into finite automata, regular expressions, context-free grammars, Turing machines, decidability, the halting problem, and closes on P versus NP. It's the course that settles what a computer can compute.

**CS107 is the most painful and the most worthwhile.** The assignments start at Unix and C and work up through C strings, the heap, generic operations with `void *`, function pointers, x86-64 assembly, and end with writing your own memory allocator. Even the lab handouts ship with solutions.

**CS111's assignment list is an operating system.** Lambdas, threads and processes; synchronization; a thread dispatcher; implementing locks and condition variables; memory-mapped encrypted files; page replacement with the clock algorithm; reading Unix v6 filesystems; and a journaling filesystem.

**CS109's 2026 edition has something new.** Next to the slides, each lecture's "outside class" column carries an *LLM Learning Guide*. A probability course shipping official guidance on how to study a lecture with a language model is a signal in itself.

**CS161 comes with a small trap.** The department's core requirements page calls it "Data Structures and Algorithms," while ExploreCourses, the summer session, and the course's own site all call it "Design and Analysis of Algorithms." Go with the course site. Two official pages at the same university disagreeing is normal, and the latter name is the one that finds you material.

**What to do**: if you already program but have never taken a systems course, download the first CS107 assignment handout and finish `Assign0`. It will tell you quickly how much of your model of "what an integer looks like in memory" is guesswork.

## Rung three: systems and theory electives, three that suit self-study

After the core five, the elective list is too long to walk. Judged on how complete the public materials are, three stand out:

**CS143: Compilers** is the ceiling for self-study friendliness. Five programming assignments, four written assignments with solutions, the Cool language reference manual and runtime documentation, eighteen lecture decks, and the last three years of midterms and finals with solutions — all on the same page. The project builds a compiler for Cool, a language designed for teaching, from lexing and parsing through semantic analysis and type checking to code generation and optimization.

**CS144: Introduction to Computer Networking** is famous for its assignment design. Seven checkpoints take you from "build reliability out of unreliability" through implementing TCP, down the stack to the network interface, then an IP router, and finally a checkpoint called "making an Internet." Lecture notes and slides are public; the lab instructions live on their own site.

**CS149: Parallel Computing** covers multi-core CPUs, GPUs and CUDA, scheduling DNNs on GPUs, and hardware specialization. Its five programming assignments run from analyzing quad-core performance to "make the world's fastest CUDA kernels," with one targeting the Trainium2 accelerator. It carries one caveat, covered in the next section.

## Rung four: the AI courses, pick two out of ten

This rung gets asked about most and over-consumed most. The lay of the land:

| Number | Title | When it fits |
|---|---|---|
| CS221 | Artificial Intelligence: Principles and Techniques | You want to see the AI that isn't deep learning |
| CS229 | Machine Learning | You want the math filled in |
| CS230 | Deep Learning | You want speed and don't mind Coursera as the textbook |
| CS231n | Deep Learning for Computer Vision | You want an entry through vision, with notes to read |
| CS224n | NLP with Deep Learning | You want to understand where language models came from |
| CS234 | Reinforcement Learning | Supervised learning is solid, RL is the gap |
| CS236 | Deep Generative Models | You want the math behind diffusion and VAEs |
| CS224W | Machine Learning with Graphs | Your data is a network of relationships |
| CS246 | Mining Massive Data Sets | Your data doesn't fit on one machine |
| CS330 | Deep Multi-Task and Meta Learning | You're doing few-shot or multi-task work |

The practical advice is **pick two**: one for foundations (CS229 or CS221) and one for the area you actually touch (usually CS224n or CS231n). The reason is unglamorous — these workloads are designed for someone taking three courses total that quarter, and you are not a full-time student.

Four worth expanding:

**CS229** publishes a several-hundred-page set of notes as a single PDF, running from linear regression through self-supervised learning and foundation models. Stanford Online's YouTube channel has long carried Andrew Ng's 2018 edition — one of the most-watched machine learning courses anywhere — and the spring 2026 edition is now up as well. If you want notes, video, and assignments as a set, this one is the most complete.

**CS231n**'s notes site is where a lot of people first genuinely understood backpropagation. The spring 2026 assignments now reach diffusion models, CLIP, and DINO by the third one — the course is still named for computer vision, but the content stopped being only that a while ago.

**CS224n**'s site does something unusual: it keeps every edition back to 2000. You can open the 2019 version, see how the course taught the Transformer when it was new, and set it against today's — same course, same people, and the difference in framing is right there.

**CS230** is shaped differently from the rest: it's a flipped classroom, with videos and programming assignments on the deeplearning.ai Coursera specialization and only lectures and project meetings in the room. That cuts two ways — the core material is unusually available to self-learners, because it was always on Coursera, but the differentiated part, the project feedback, is exactly what you can't get. This site's [CS230 series](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en) unpacks those lectures one by one.

## Rung five: the three that only exist in 2026

What these three have in common is that their subject matter didn't exist five years ago.

**CS336: Language Modeling from Scratch** (Tatsunori Hashimoto, Percy Liang) is the hardest of the set. Across five assignments you implement a tokenizer, write a Transformer, write Triton kernels, do multi-machine parallelism, run scaling laws, build evaluation, handle data, and finish with SFT and RLVR post-training. The site is blunt about the prerequisites:

> The amount of code you will write will be at least an order of magnitude greater than for other classes.

Its lectures ship in an unusual form — **executable lectures**. In the GitHub `lectures` repo, a lecture is a file like `lecture_01.py`; running it produces a full trace that renders to a web page. The repo has thousands of stars, and the assignment starter code and handouts are public.

**CS25: Transformers United** is a seminar, not a course. Each week brings in someone from industry or research; the spring 2026 speakers came from Mistral AI, Hugging Face, and DeepMind, covering pretraining data ordering, 5D parallelism, and multi-agent systems for scientific research. No assignments, no prerequisites, all videos public — a way to track the field, not to learn the foundations.

**CS146S: The Modern Software Developer** is a three-unit for-credit course that teaches not how to write code but how to direct a coding agent: MCP, agent skills, spec-driven development, loop engineering, the software factory. The listed prerequisite is programming experience equivalent to CS111/CS161, with CS221 or CS229 recommended. This site has a [week-by-week series](/posts/ai/2026-08-16-cs146s-course-map-en) on it, including a diff of the two syllabus editions.

## Where self-study actually breaks down

Everything above is about what exists. This section is about what you can't get, and none of these four have anything to do with your ability.

**One: starter code gets gated behind classroom process.** CS106B's fall 2025 announcements say it plainly — the fourth assignment's starter code unlocks after you complete the mid-quarter survey. That design is common in intro courses because staff use it to track progress. The workaround is to go backwards: archived editions of past quarters are usually already unlocked.

**Two: video is the least reliable piece.** CS149's site states outright that it can't distribute this year's recordings publicly, then links the 2023 edition on Stanford's official YouTube channel. CS330 does the same: current recordings on Canvas, previous offerings public. So "this course has no video" is usually the wrong conclusion; the right question is which edition has video.

**Three: some assignments require you to buy GPU time.** CS336 is the clearest case — the whole point is making models run fast across multiple GPUs. That's not a limit free Colab routes around, so price it before you start.

**Four: nobody will grade your work.** This one gets underestimated. Most autograders are wired to Gradescope, which self-learners can't reach. CS143 is the rare exception: it publishes exams *and* solutions, so you can at least check yourself.

**What to do**: Stanford course sites are archived at URLs shaped like `web.stanford.edu/class/archive/cs/<number>/<number>.<term code>/`. There's no browsable index (I tried; that directory returns a 404), so the practical route is the "Previous offerings" block on the current course site — CS224n, CS224W, and CS246 all list their past editions right on the front page.

## Three routes — pick one

**If you're switching into software engineering**: CS106B → CS107 → CS161. Three courses, that's it. CS106B gives you data structures, CS107 gives you how a program actually runs on a machine, CS161 gives you the composure not to panic at an algorithms question. CS103 can wait; skipping it doesn't hurt the first three.

**If you already program but feel a layer is missing**: CS111 plus one of CS143 or CS144. Choose by what you spend your time debugging. If it's performance and memory, take CS143 and find out what the compiler has been doing to your code. If it's connections, timeouts, and retries, take CS144 — those seven checkpoints move your understanding of TCP from "I know it exists" to "I wrote one."

**If the goal is LLMs**: one of CS229 or CS224n for foundations, then straight to CS336. The middle courses can wait, but be honest about CS336's prerequisites: what it asks isn't a list of completed courses, it's whether you can write a large amount of PyTorch with no scaffolding. If you're unsure, finish the CS231n assignments first — their scaffolding density is precisely the opposite of CS336's.

All three routes share one condition: **pick one and do its assignments**. Downloading the notes for two dozen courses is the failure mode this map most easily produces.

## Appendix: numbers and how they were checked

The course information here comes from official course sites fetched on 2026-08-20, not from recall. These are the numbers held back from the body for readability:

- **Units**: each of the five core courses is five units (and won't be accepted at fewer); CS106L is one unit; CS146S is three.
- **Paying for credit**: in Stanford Online's remote-credit versions, CS107 is $8,110 in tuition and CS161 and CS336 are $7,875 each, all five units. Free materials, expensive credit — that gap is the premise of this whole map.
- **CS231n grade breakdown**: assignments 45%, midterm 20%, final project 35%.
- **CS336 lecture repo**: roughly 3.6k stars and 757 forks on GitHub (read on 2026-08-20).
- **Numbering convention**: 1–99 introductory for all students, 100–199 primarily for majors, 200–299 for advanced undergraduates and beginning graduate students, 300 and above for graduate students. The university states explicitly that this is a common guideline, not a standard.

One thing could not be confirmed: Stanford's course archive has no public index page, so there's no way to say how many courses keep past editions online. That's a structural limit, not a gap in the search.

## References

- [Stanford CS BS Core Requirements](https://www-cs.stanford.edu/bs-core-requirements) — the official five-course core, the five-unit rule, and the note that CS111 was formerly CS110
- [Understanding the Course Catalog | Stanford Academic Advising](https://advising.stanford.edu/current-students/advising-student-handbook/course-catalog) — the numbering convention and the "no standardized numbering system" statement
- [Stanford Explore Courses: Course Catalog Numbering](https://explorecourses.stanford.edu/about) — a second official source on the numbering ranges
- [CS106A: Programming Methodology](https://web.stanford.edu/class/cs106a/) — Summer 2026 lectures and assignments
- [CS106B: Programming Abstractions](https://web.stanford.edu/class/cs106b/) — Summer 2026 overview and lecture index
- [CS106B Fall 2025 archive](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1256/) — the survey-gated starter code announcement, and a working example of the archive URL format
- [CS106L: Standard C++ Programming](https://web.stanford.edu/class/cs106l/) — one unit, seven assignments, S/NC
- [CS103: Mathematical Foundations of Computing](https://web.stanford.edu/class/cs103/) — course overview and lecture list
- [CS107: Computer Organization & Systems](https://web.stanford.edu/class/cs107/) — assignments, labs, and lab solutions
- [CS109: Probability for Computer Scientists](https://web.stanford.edu/class/cs109/) — the lecture table with per-lecture LLM Learning Guides
- [CS111: Operating Systems Principles](https://web.stanford.edu/class/cs111/) — the full nine-assignment list
- [CS161: Design and Analysis of Algorithms (Winter 2026)](https://stanford-cs161.github.io/winter2026) — the course's own title and description
- [CS143: Compilers](https://web.stanford.edu/class/cs143/) — programming and written assignments with solutions, past exams, and the Cool manual
- [CS144: Introduction to Computer Networking](https://cs144.github.io/) — the seven-checkpoint lab design
- [CS149: Parallel Computing (Fall 2025)](https://gfxcourses.stanford.edu/cs149/fall25) — five assignments, plus the note that recordings can't be distributed publicly this year
- [CS221: Artificial Intelligence: Principles and Techniques](https://stanford-cs221.github.io/) — index of past course sites
- [CS229: Machine Learning](https://cs229.stanford.edu/) — course description and public materials
- [CS229 lecture notes PDF](https://cs229.stanford.edu/main_notes.pdf) — linear regression through foundation models
- [Stanford CS229 Spring 2026 Lecture 1 (YouTube)](https://www.youtube.com/watch?v=DATnpGoGhM8) — the public recording of the 2026 spring edition
- [CS230: Deep Learning](https://cs230.stanford.edu/) — the flipped-classroom format and its relationship to the Coursera specialization
- [CS231n: Deep Learning for Computer Vision](https://cs231n.stanford.edu/) — Spring 2026 logistics and grade breakdown
- [CS231n notes site](https://cs231n.github.io/) — Spring 2026 assignment contents
- [CS224n: NLP with Deep Learning](https://web.stanford.edu/class/cs224n/) — index of past course sites and lecture videos
- [CS224W: Machine Learning with Graphs](https://web.stanford.edu/class/cs224w/) — archived past offerings
- [CS234: Reinforcement Learning (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule and assignments
- [CS236: Deep Generative Models](https://deepgenerativemodels.github.io/) — prerequisites and the self-contained notes
- [CS246: Mining Massive Data Sets](https://web.stanford.edu/class/cs246/) — past sites and Colab assignments
- [CS330: Deep Multi-Task and Meta Learning](https://cs330.stanford.edu/) — prerequisites and how to get recordings
- [CS336: Language Modeling from Scratch](https://cs336.stanford.edu) — Spring 2026 lectures, assignments, and the prerequisite text quoted above
- [CS336 lectures repo](https://github.com/stanford-cs336/lectures) — the executable-lecture format and star count
- [CS25: Transformers United V6](https://web.stanford.edu/class/cs25/) — spring 2026 speakers and topics
- [CS146S: The Modern Software Developer](https://themodernsoftware.dev/) — units, prerequisites, and course description
- Stanford Online: [CS107](https://online.stanford.edu/courses/cs107-computer-organization-and-systems), [CS161](https://online.stanford.edu/courses/cs161-design-and-analysis-algorithms), [CS336](https://online.stanford.edu/courses/cs336-language-modeling-scratch) — tuition and schedule for the remote-credit versions
- Related on this site: [Which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide), [CS146S syllabus diff](/posts/ai/2026-08-16-cs146s-course-map-en), [the CS230 series, part one](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en)
