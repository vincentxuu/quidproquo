---
title: "A Reading Guide to Stanford's CS Courses: Ordered by Prerequisites, from CS106A to CS336"
date: 2026-08-20
category: learning
tags:
  - stanford
  - cs-course
  - learning-path
  - ai-course
  - self-study
  - llm
lang: en
type: guide
tldr: "Stanford CS runs three hundred-plus courses a year, but the skeleton is five: CS103, CS107, CS109, CS111, CS161 — and CS221's prerequisite field names four of them outright. This guide orders the whole ladder by official prerequisites, from intro programming to research-level seminars, across five branches, and handles two things course maps usually skip: the four places self-study actually breaks down (gated starter code, undistributable video, GPU bills, nobody grading you), and which widely cited advanced courses haven't been offered in years."
description: "A prerequisite-ordered ladder through Stanford CS from CS106A to CS336 and CS329A, built on the department's official core requirements and ExploreCourses entries, covering NLP/LLM, vision, reinforcement learning, graphs, and systems, with public-material status, self-study limits, and recent offering records."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-20-stanford-cs-course-map)

Stanford's computer science department runs more than three hundred courses a year, and a large batch of them put lectures, assignments, and even past exams at a public URL — no registration, no login, no payment. That fact helps self-learners almost not at all: it doesn't tell you where to start, or which of those URLs open onto an empty shell.

This is that map. It's ordered by **official prerequisites**, from the first programming class to an LLM course you have to apply to take, and each rung marks what the course teaches and what its public materials actually contain. The second half handles two things course maps usually skip: where someone not enrolled for credit hits a wall, and the fact that **several widely cited advanced courses haven't run in years.**

Scope first: **this only covers courses whose materials are public enough to learn from**. Stanford CS also runs many seminar-style, lab-style, and cross-listed courses — HCI, graphics, biocomputation, computational law each have a whole row — that publish a syllabus and keep everything else behind Canvas, so they're not on the list. This site also has two series that walk single courses week by week — [CS146S](/posts/ai/2026-08-16-cs146s-course-map-en) and [CS230](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en) — and this piece sits one layer above them.

## First, kill one assumption: the number is not the difficulty

Plenty of people read CS106B as easier than CS103, or CS336 as harder than CS229, because of the digits. That inference doesn't hold at Stanford, and it's the university that says so. The academic advising handbook's page on the course catalog puts it flatly:

> Stanford does not have a standardized course numbering system. This means that each department is free to number its courses in its own way.

The same page offers a "common though not universal" convention (full ranges in the appendix); roughly, a bigger number means more assumed background. CS follows it loosely, so treat the number as **a rough indicator of what a course assumes you know**, not as a difficulty ranking.

Counterexamples are everywhere: CS221 sits at the 200 level but is the entry point to AI; CS124 sits at 100 yet wants CS109 and roughly CS107's level behind you; CS336 sits in the graduate range, and its barrier isn't the math, it's whether you can finish five assignments with almost no scaffolding.

So this guide uses a different test: **what each course's ExploreCourses `Prerequisites` field actually says.** That's the dependency graph the university wrote down, and it beats any impression.

## Rung one: intro programming, two courses and two languages

**CS106A: Programming Methodology** teaches Python, starting with Karel, a robot that can only move forward, turn, and pick things up. The assignments run Karel, a Khan-Academy-style practice system, image manipulation, text generation, and finally writing a search engine. It assumes no programming background — the only course in the department that genuinely starts from zero.

**CS106B: Programming Abstractions** switches to C++ and is where most people actually start learning computer science. Its lecture index reads like a standard data structures syllabus: stacks and queues, sets and maps, Big-O, recursion and backtracking, sorting, pointers and dynamic memory, linked lists, binary search trees, Huffman coding, hashing, graphs and Dijkstra. Finish it and you have the tools for most technical interview questions.

Wedged between them is **CS106L: Standard C++ Programming** — one unit, seven very short assignments, no exams, satisfactory/no-credit. It fills in what CS106B deliberately skips to teach concepts: initialization, references, iterators, templates, lambdas, move semantics, RAII, smart pointers. If your goal is C++ that looks like C++ rather than Java with pointers, that unit pays well.

**What to do**: open the CS106B lecture index, find "Big O and Algorithmic Analysis," read the slides, then close them and write down every complexity class you remember with an example for each. The gaps are the parts you only thought you understood.

## Rung two: the degree's skeleton is these five

This is the most important section here. Stanford CS's official core requirements page pins the undergraduate skeleton to five courses, with one hard rule: **CS103, CS107, CS109, CS111, and CS161 must be taken for five units**. Not recommended — the reduced-unit version isn't accepted.

What makes their status clearer is something else: **CS221's prerequisite field names four of them outright** — CS103, CS106B, CS109, CS161 — adding that the staff highly recommend comfort with these concepts first. People heading for AI often want to skip this rung, but the AI entry course disagrees.

| Number | Title | The intuition it replaces |
|---|---|---|
| CS103 | Mathematical Foundations of Computing | "It runs, so it's correct" → prove it |
| CS107 | Computer Organization and Systems | "A variable is a box" → it's bytes at an address |
| CS109 | Probability for Computer Scientists | "The average is enough" → distributions, independence, Bayes |
| CS111 | Principles of Computer Systems | "Programs run start to finish" → processes, scheduling, virtual memory |
| CS161 | Design and Analysis of Algorithms | "Fast enough" → why, how fast, could it be faster |

Things worth knowing:

**CS111 is the old CS110.** The official page flags it: "Formerly known as CS110." The many "Stanford CS110 self-study guides" out there describe the same course; those resources aren't dead, the name moved.

**CS103's second half matters more than its first.** The first half is discrete math and proof technique; the second goes into finite automata, regular expressions, context-free grammars, Turing machines, decidability, the halting problem, and closes on P versus NP. It's the course that settles what a computer can compute.

**CS107 is the most painful and the most worthwhile.** The assignments start at Unix and C and work up through C strings, the heap, generic operations with `void *`, function pointers, x86-64 assembly, and end with writing your own memory allocator. Even the lab handouts ship with solutions.

**CS111's assignment list is an operating system.** Lambdas, threads and processes; synchronization; a thread dispatcher; implementing locks and condition variables; memory-mapped encrypted files; page replacement with the clock algorithm; reading Unix v6 filesystems; a journaling filesystem.

**CS109 is the one you can least afford to skip.** Its 2026 edition also carries something new: next to the slides, each lecture's "outside class" column has an *LLM Learning Guide*. A probability course shipping official guidance on studying a lecture with a language model is a signal in itself.

Skipping CS109 doesn't cost you in the next course, it costs you in every course after: CS224W lists CS109 plus any introductory ML, CS234 wants basic probability, CS336 wants CS109-level probability and statistics.

**CS161 comes with a small trap.** The department's core requirements page calls it "Data Structures and Algorithms," while ExploreCourses, the summer session, and the course's own site call it "Design and Analysis of Algorithms." Go with the course site — two official pages disagreeing is normal, and the latter name is the one that finds you material.

**What to do**: if you already program but have never taken a systems course, download the first CS107 assignment handout and finish `Assign0`. It will tell you quickly how much of your model of "what an integer looks like in memory" is guesswork.

## Rung three: three entry points, take at least two

Past the base, the way into AI isn't one course — it's three doors facing different directions.

**CS221: Artificial Intelligence: Principles and Techniques** is the standard one. It frames AI as making good decisions given incomplete information (hence probability) and limited computation (hence algorithms), covering search, constraint satisfaction, game playing, Markov decision processes, graphical models, machine learning, and logic. It's the only entry course that shows you the AI that isn't deep learning.

**CS124: From Languages to Information** is the language-and-information door and the formal start of the NLP line. The official description runs from regular expressions through logistic regression and gradient descent to transformers and large language models, with applications in chatbots, information retrieval, social computing, and recommender systems. Its prerequisites are stiffer than the number suggests: CS106B, Python at CS106A level, CS109, plus CS107-level UNIX and programming maturity.

**CS238: Decision Making under Uncertainty** (cross-listed as AA228) is the decision-and-uncertainty door — the smoothest way in for reinforcement learning, planning, or autonomous systems.

## Rung four: the trunk, CS229 and CS230

Past the entry courses comes the work of building modelling ability.

**CS229** is the theory side, laying the statistical assumptions bare. It publishes a several-hundred-page set of notes as a single PDF, from linear regression through self-supervised learning and foundation models; Stanford Online's YouTube channel has long carried Andrew Ng's 2018 edition, and the spring 2026 edition is now up too. If you want notes, video, and assignments as a set, this one is most complete.

**CS230** is the practice side, run as a flipped classroom: videos and programming assignments on the deeplearning.ai Coursera specialization, with only lectures and project meetings in the room. That cuts two ways — the core material is unusually available to self-learners, because it was always on Coursera, but the differentiated part, the project feedback, is exactly what you can't get. This site's [CS230 series](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en) unpacks those lectures one by one.

They aren't either/or; they're complementary.

**CS228: Probabilistic Graphical Models** fills in probabilistic reasoning: Bayesian and Markov networks, hidden Markov models, dynamic Bayesian networks, exact and approximate inference. Its stated prerequisites are only "basic probability theory and algorithm design and analysis" — lower than most people assume.

**What to do**: if you can't decide between CS229 and CS230, read chapter one of CS229's public notes PDF. If it doesn't go down, start with CS230. That beats any self-assessment.

## Rung five: five branches

### A. NLP / LLM / agents

This branch has the most complete prerequisite chain of the five — you can follow it end to end.

| Number | Title | Official prerequisites |
|---|---|---|
| CS124 | From Languages to Information | CS106B, Python, CS109, CS107-level |
| CS224N | Natural Language Processing with Deep Learning | calculus and linear algebra; CS124, CS221, or CS229 |
| CS224U | Natural Language Understanding | CS224N or CS224S |
| CS224V | Agentic AI | one of LINGUIST 180/280, CS124, CS224N, CS224S, CS224U |
| CS329X | Human Centered NLP | — |
| CS329A | Self-Improving AI Agents | CS224N or CS229S |
| CS336 | Language Modeling from Scratch | Python, PyTorch, systems concepts, calculus and linear algebra, CS109-level probability |

**CS224N's site does something unusual**: it keeps every edition back to 2000. Open the 2019 version, see how the course taught the Transformer when it was new, and set it against today's — same course, same people, and the difference in framing is right there.

**CS224V is now called Agentic AI** — a 2026 name. It works directly on RAG and formal task descriptions, hybrid reasoning across databases and knowledge bases, AI-driven knowledge curation for scientific research, improving the accuracy and interpretability of decision-making agents through formal methods, and efficiency for long-horizon agents. If you want to build agents and would rather have a real course, this one is underrated.

**CS329X: Human Centered NLP** covers human-centered design, human-in-the-loop algorithms, fairness, and accessibility. Easy to write off as a soft elective, but it handles exactly the class of problems that blows up first when a model becomes a product.

### B. Vision

**CS231A: Computer Vision** covers cameras and projection models, filtering and edge detection, segmentation and clustering, stereo reconstruction, and object and scene recognition. Its old number was CS223B, and the prerequisites are only linear algebra and basic probability and statistics.

**CS231N: Deep Learning for Computer Vision** is the deep learning side. Its notes site is where a lot of people first genuinely understood backpropagation, and the spring 2026 assignments reach diffusion models, CLIP, and DINO by the third one — still named for computer vision, but that stopped being all of it a while ago. Note the title is no longer "Convolutional Neural Networks for Visual Recognition," which many course maps still use.

On ordering, having CS229 or CS230 before CS231N makes it much smoother; CS231A can run alongside or after.

### C. Reinforcement learning and robotics

`CS221 → CS238 → CS234 → CS223A → CS333`.

**CS234: Reinforcement Learning** states its prerequisites plainly: proficiency in Python, CS229 or equivalent, linear algebra, basic probability. **CS223A** is the robotics foundation course, taught by Oussama Khatib. **CS333** is a project-based graduate course pulling robotics, machine learning, and control theory into human-AI interaction; officially it only recommends an introductory AI course.

### D. Graphs and networks

**CS224W: Machine Learning with Graphs** asks for CS109 plus any introductory machine learning course — a low bar for this tier. It covers representation learning and graph neural networks, web algorithms, reasoning over knowledge graphs, influence maximization, and social network analysis. Next to it, **CS246: Mining Massive Data Sets** handles the case where the data doesn't fit on one machine.

### E. Systems and performance

This branch doesn't grow out of AI, it grows out of CS107 — but anyone doing AI engineering rather than only reading models will want it. Judged on how complete the public materials are, three stand out:

**CS143: Compilers** is the ceiling for self-study friendliness. Five programming assignments, four written assignments with solutions, the Cool language reference manual and runtime documentation, eighteen lecture decks, and the last three years of midterms and finals with solutions — all on one page.

**CS144: Introduction to Computer Networking** is famous for its assignment design. Seven checkpoints take you from "build reliability out of unreliability" through implementing TCP, down the stack to the network interface, then an IP router, and finally a checkpoint called "making an Internet."

**CS149: Parallel Computing** covers multi-core CPUs, GPUs and CUDA, scheduling DNNs on GPUs, and hardware specialization. Its five programming assignments run from analyzing quad-core performance to "make the world's fastest CUDA kernels," with one targeting the Trainium2 accelerator.

## Rung six: research level

What these have in common isn't teaching models again, it's demanding that you do research, build systems, or run a whole pipeline from zero.

**CS336: Language Modeling from Scratch** (Tatsunori Hashimoto, Percy Liang) is the only one flagged **Application required**. Across five assignments you implement a tokenizer, write a Transformer, write Triton kernels, do multi-machine parallelism, run scaling laws, build evaluation, handle data, and finish with SFT and RLVR post-training. The site is blunt about prerequisites:

> The amount of code you will write will be at least an order of magnitude greater than for other classes.

Its lectures ship in an unusual form — **executable lectures**. In the GitHub `lectures` repo, a lecture is a file like `lecture_01.py`; running it produces a full trace that renders to a web page. The repo has thousands of stars, and the assignment starter code and handouts are public.

**CS312** takes a different line. It argues that knowledge and math ability alone aren't enough — inventing the next generation of architectures takes running very many experiments — so the course walks students through gaining mastery in computationally tractable domains via efficient experimentation and predicting experiment outcomes. It's taught by Hashimoto, who also co-teaches CS336.

**CS329A: Self-Improving AI Agents** is a graduate seminar covering constitutional AI, learned verifiers, scaling test-time compute, combining search with LLMs, tool use and retrieval, multimodal web interaction, multi-step reasoning and planning, and robust evaluation and orchestration frameworks. All nine lectures are public on Stanford Online's YouTube channel.

**CS329Z: Engineering AI Agents** teaches compound AI systems: students first build the core components — RAG, tool use, agent loops — from scratch, then learn how frameworks like DSPy abstract those patterns.

The safety and reliability group is the most notable shift in this tier, because it has stopped being peripheral. **CS221M: Mechanistic Interpretability** covers probing, steering, causal abstraction, and sparse autoencoders, with emphasis on causal methods and large language models. **CS329H: Machine Learning from Human Preferences** handles preference heterogeneity and aggregation, interpretation of human feedback, and privacy. **CS329T** runs from foundation models, prompting, and RAG through agent architectures and evaluation.

One more course sits off this line but is worth knowing separately: **CS146S: The Modern Software Developer**, a three-unit for-credit course that teaches not how to write code but how to direct a coding agent. The listed prerequisite is programming experience equivalent to CS111/CS161, with CS221 or CS229 recommended. This site has a [week-by-week series](/posts/ai/2026-08-16-cs146s-course-map-en) on it.

## Where self-study actually breaks down

Everything above is about what exists. This section is about what you can't get, and none of these four have anything to do with your ability.

**One: starter code gets gated behind classroom process.** CS106B's fall 2025 announcements say it plainly — the fourth assignment's starter code unlocks after you complete the mid-quarter survey. Common in intro courses, because staff use it to track progress. The workaround is to go backwards: archived editions of past quarters are usually already unlocked.

**Two: video is the least reliable piece.** CS149's site states outright that it can't distribute this year's recordings publicly, then links the 2023 edition on Stanford's official YouTube channel. CS330 does the same: current recordings on Canvas, previous offerings public. So "this course has no video" is usually the wrong conclusion; the right question is which edition has video.

**Three: some assignments require you to buy GPU time.** CS336 is the clearest case — the whole point is making models run fast across multiple GPUs. That's not a limit free Colab routes around, so price it before you start.

**Four: nobody will grade your work.** This one gets underestimated. Most autograders are wired to Gradescope, which self-learners can't reach. CS143 is the rare exception: it publishes exams *and* solutions, so you can at least check yourself.

**What to do**: Stanford course sites are archived at URLs shaped like `web.stanford.edu/class/archive/cs/<number>/<number>.<term code>/`. There's no browsable index (I tried; that directory returns a 404), so the practical route is the "Previous offerings" block on the current course site — CS224N, CS224W, and CS246 all list past editions on the front page.

## Check whether it runs before you check prerequisites

There's one more obstacle, earlier than those four and the likeliest to void a whole plan: **the course you scheduled may not have been offered in years.**

Stanford AI course maps circulating online routinely list a batch of advanced courses as offered this year. Checked course by course against ExploreCourses, several look like this:

| Number | Title | Last offered, per ExploreCourses |
|---|---|---|
| CS329S | Machine Learning Systems Design | Winter 2022 |
| CS324 | Advances in Foundation Models | Winter 2023 |
| CS329D | Machine Learning Under Distributional Shifts | Spring 2023 |
| CS229S | Systems for Machine Learning | Autumn 2024 |
| CS329A | Self-Improving AI Agents | Autumn 2025 |

There's a small knot in there: **CS329A lists CS224N or CS229S as prerequisites, and CS229S hasn't run in two years.** For an enrolled student that just means "take the CS224N route," but for a self-learner building a plan off an online map, this kind of detail is where the plan quietly dies.

Not offered doesn't mean not useful. CS324's course site and CS329A's nine recorded lectures are still up, and the content hasn't aged out. But **"is this course still running" and "can I still learn from its materials" are two different questions, and merging them produces a plan made of courses you can't take.**

**What to do**: search any course number on ExploreCourses and look at whether it shows "2026-2027 Autumn/Winter/Spring" or "Last offered: …". The first means it runs this year; the second means it doesn't, and the year tells you how long it's been. That check takes ten seconds.

## Five routes — pick one

**If you're switching into software engineering**: CS106B → CS107 → CS161. Three courses. CS106B gives you data structures, CS107 gives you how a program actually runs on a machine, CS161 gives you the composure not to panic at an algorithms question. CS103 can wait; skipping it doesn't hurt the first three.

**If you already program but feel a layer is missing**: CS111 plus one of CS143 or CS144. Choose by what you spend your time debugging. If it's performance and memory, take CS143 and find out what the compiler has been doing to your code. If it's connections, timeouts, and retries, take CS144 — those seven checkpoints move your understanding of TCP from "I know it exists" to "I wrote one."

**If you're going for general AI research**: the five base courses → CS221 → CS229 → CS230 → CS228 → one branch → CS312 or CS221M. The closest thing to full foundations before going research-directed.

**If the goal is LLMs and agents**: the five base courses → CS124 → CS221 → CS229 → CS224N → CS224U or CS224V → CS329X → CS329Z → CS336. Every step is backed by an official prerequisite relationship — the most complete dependency chain of the five routes. You can skip courses in the middle, but be honest about CS336's prerequisites: what it asks isn't a list of completed courses, it's whether you can write a large amount of PyTorch with no scaffolding. If you're unsure, finish the CS231N assignments first — their scaffolding density is precisely the opposite of CS336's.

**If you're going for vision or robotics**: vision is the five base courses → CS229 → CS230 → CS231A → CS231N; robotics is the five base courses → CS221 → CS238 → CS234 → CS223A → CS333.

All five routes share one condition: **pick one and do its assignments.** Downloading the notes for two dozen courses is the failure mode this map most easily produces.

One more warning: **don't make CS329A, CS329Z, or CS336 your first stop.** Read the prerequisite structure and these assume you already have machine learning, deep learning, NLP or LLM work, and systems and evaluation behind you. The five base courses look far from AI, but they're the only part with no shortcut.

## Appendix: numbers and how they were checked

Course information comes from official course sites and Stanford ExploreCourses entries for the 2026-2027 academic year, read on 2026-08-20. Prerequisites and offering records follow what those pages display; secondary summaries were not taken on trust. These are the numbers held back from the body for readability:

- **Units**: each of the five core courses is five units (and won't be accepted at fewer); CS106L is one; CS146S is three; CS221M, CS329H, CS329X, CS329T, CS329Z are three each; CS224V, CS224W, CS228, CS231A are 3–4; CS312 and CS336 are 3–5.
- **CS221's official prerequisites**: CS103 (or CS103B/X), CS106B (or CS106X), CS109, CS161.
- **Paying for credit**: in Stanford Online's remote-credit versions, CS107 is $8,110 and CS161 and CS336 are $7,875 each, all five units. Free materials, expensive credit — that gap is the premise of this map.
- **CS231N grade breakdown**: assignments 45%, midterm 20%, final project 35%.
- **CS336 lecture repo**: roughly 3.6k stars and 757 forks on GitHub (read 2026-08-20).
- **Advanced courses offered in 2026-27**: CS221M (spring), CS224N (winter), CS224U (spring), CS224V (autumn), CS224W (autumn), CS228 (winter), CS223A (winter), CS231A (winter), CS329H (autumn), CS329T (spring), CS329X (autumn), CS329Z (autumn), CS312 (autumn), CS333 (winter), CS336 (spring, application required).
- **Numbering convention**: 1–99 introductory for all students, 100–199 primarily for majors, 200–299 for advanced undergraduates and beginning graduate students, 300 and above for graduate students. The university states explicitly that this is a common guideline, not a standard.
- **CS231A's old number**: CS223B. **CS111's former name**: CS110.

Three items could not be fully confirmed, and none for lack of searching. Stanford's course archive has no public index page, so there's no way to say how many courses keep past editions online. CS312's title did not render as a heading in ExploreCourses search results, though searching the exact phrase "Deep Learning Alchemy" returns that entry. CS238's own entry likewise failed to render; its existence and the AA228 cross-listing are inferred from CS239's prerequisite field, "AA 228/CS 238 or CS 221." The latter two don't affect the ordering conclusions.

## References

- [Stanford CS BS Core Requirements](https://www-cs.stanford.edu/bs-core-requirements) — the five-course core, the five-unit rule, and the note that CS111 was formerly CS110
- [Understanding the Course Catalog | Stanford Academic Advising](https://advising.stanford.edu/current-students/advising-student-handbook/course-catalog) — the numbering convention and the "no standardized numbering system" statement
- [Stanford Explore Courses](https://explorecourses.stanford.edu/) — source for every prerequisite, unit count, and offering record here
- [Stanford Explore Courses: Course Catalog Numbering](https://explorecourses.stanford.edu/about) — a second official source on the numbering ranges
- [CS106A: Programming Methodology](https://web.stanford.edu/class/cs106a/) — Summer 2026 lectures and assignments
- [CS106B: Programming Abstractions](https://web.stanford.edu/class/cs106b/) — Summer 2026 overview and lecture index
- [CS106B Fall 2025 archive](https://web.stanford.edu/class/archive/cs/cs106b/cs106b.1256/) — the survey-gated starter code announcement, and a working example of the archive URL format
- [CS106L: Standard C++ Programming](https://web.stanford.edu/class/cs106l/) — one unit, seven assignments, S/NC
- [CS103: Mathematical Foundations of Computing](https://web.stanford.edu/class/cs103/) — overview and lecture list
- [CS107: Computer Organization & Systems](https://web.stanford.edu/class/cs107/) — assignments, labs, and lab solutions
- [CS109: Probability for Computer Scientists](https://web.stanford.edu/class/cs109/) — the lecture table with per-lecture LLM Learning Guides
- [CS111: Operating Systems Principles](https://web.stanford.edu/class/cs111/) — the full nine-assignment list
- [CS161: Design and Analysis of Algorithms (Winter 2026)](https://stanford-cs161.github.io/winter2026) — the course's own title and description
- [CS 221: Artificial Intelligence: Principles and Techniques](https://explorecourses.stanford.edu/search?q=Artificial+Intelligence+Principles+and+Techniques&view=catalog) — the four prerequisites, named officially
- [CS 124: From Languages to Information](https://explorecourses.stanford.edu/search?q=CS+124&view=catalog) — description running from regex to large language models, plus prerequisites
- [CS143: Compilers](https://web.stanford.edu/class/cs143/) — assignments with solutions, past exams, and the Cool manual
- [CS144: Introduction to Computer Networking](https://cs144.github.io/) — the seven-checkpoint lab design
- [CS149: Parallel Computing (Fall 2025)](https://gfxcourses.stanford.edu/cs149/fall25) — five assignments, plus the note that recordings can't be distributed publicly this year
- [CS229: Machine Learning](https://cs229.stanford.edu/) — course description and public materials
- [CS229 lecture notes PDF](https://cs229.stanford.edu/main_notes.pdf) — linear regression through foundation models, and chapter one for the self-assessment above
- [Stanford CS229 Spring 2026 Lecture 1 (YouTube)](https://www.youtube.com/watch?v=DATnpGoGhM8) — the public recording of the 2026 spring edition
- [CS 229S: Systems for Machine Learning](https://explorecourses.stanford.edu/search?q=CS+229S&view=catalog) — description and "Last offered: Autumn 2024"
- [CS230: Deep Learning](https://cs230.stanford.edu/) — the flipped-classroom format and its relationship to the Coursera specialization
- [CS 228: Probabilistic Graphical Models](https://explorecourses.stanford.edu/search?q=Probabilistic+Graphical+Models&view=catalog) — scope and prerequisites
- [CS231n: Deep Learning for Computer Vision](https://cs231n.stanford.edu/) — Spring 2026 logistics and grade breakdown
- [CS231n notes site](https://cs231n.github.io/) — Spring 2026 assignment contents
- [CS 231A: Computer Vision](https://explorecourses.stanford.edu/search?q=CS+231A&view=catalog) — the old CS223B number and prerequisites
- [CS224n: NLP with Deep Learning](https://web.stanford.edu/class/cs224n/) — index of past course sites and lecture videos
- [CS 224N official entry](https://explorecourses.stanford.edu/search?q=Natural+Language+Processing+with+Deep+Learning&view=catalog) — 2026-27 winter offering and prerequisites
- [CS 224U: Natural Language Understanding](https://explorecourses.stanford.edu/search?q=CS+224U&view=catalog) — prerequisite CS224N or CS224S
- [CS 224V: Agentic AI](https://explorecourses.stanford.edu/search?q=CS+224V&view=catalog) — the renamed course's description and prerequisite list
- [CS224W: Machine Learning with Graphs](https://web.stanford.edu/class/cs224w/) — archived past offerings
- [CS 224W official entry](https://explorecourses.stanford.edu/search?q=CS+224W&view=catalog) — prerequisite CS109 plus any introductory ML
- [CS234: Reinforcement Learning (Winter 2026)](https://web.stanford.edu/class/cs234/) — schedule and assignments
- [CS 234 official entry](https://explorecourses.stanford.edu/search?q=CS+234&view=catalog) — prerequisites and scope
- [CS236: Deep Generative Models](https://deepgenerativemodels.github.io/) — prerequisites and self-contained notes
- [CS246: Mining Massive Data Sets](https://web.stanford.edu/class/cs246/) — past sites and Colab assignments
- [CS330: Deep Multi-Task and Meta Learning](https://cs330.stanford.edu/) — prerequisites and how to get recordings
- [CS 312](https://explorecourses.stanford.edu/search?q=Deep+Learning+Alchemy&view=catalog) — the mastery-through-experiments stance and instructors
- [CS 324: Advances in Foundation Models](https://explorecourses.stanford.edu/search?q=CS+324&view=catalog) — description and "Last offered: Winter 2023"
- [CS 329A: Self-Improving AI Agents](https://explorecourses.stanford.edu/search?q=CS+329A&view=catalog) — full topic list, prerequisite CS224N or CS229S, "Last offered: Autumn 2025"
- [Stanford CS329A Self-Improving AI Agents, Part 1 (YouTube)](https://www.youtube.com/watch?v=6YnLB0XbTnI) — the public nine-lecture recordings
- [CS 329D](https://explorecourses.stanford.edu/search?q=CS+329D&view=catalog) and [CS 329S](https://explorecourses.stanford.edu/search?q=CS+329S&view=catalog) — "Last offered" of Spring 2023 and Winter 2022 respectively
- [CS 329H: Machine Learning from Human Preferences](https://explorecourses.stanford.edu/search?q=CS+329H&view=catalog) — description and 2026-27 autumn offering
- [CS 329T](https://explorecourses.stanford.edu/search?q=CS+329T&view=catalog) — prerequisite CS229-level ML plus deep learning
- [CS 329X: Human Centered NLP](https://explorecourses.stanford.edu/search?q=CS+329X&view=catalog) — description and 2026-27 autumn offering
- [CS 329Z: Engineering AI Agents](https://explorecourses.stanford.edu/search?q=Engineering+AI+Agents&view=catalog) — compound AI systems and DSPy in the course description
- [CS 333](https://explorecourses.stanford.edu/search?q=CS+333&view=catalog) — project-based course on human-AI interaction
- [CS221M: Mechanistic Interpretability](https://explorecourses.stanford.edu/search?q=CS+221M&view=catalog) — probing, steering, causal abstraction, sparse autoencoders
- [CS336: Language Modeling from Scratch](https://cs336.stanford.edu) — lectures, assignments, and the prerequisite text quoted above
- [CS 336 official entry](https://explorecourses.stanford.edu/search?q=Language+Modeling+from+Scratch&view=catalog) — the application-required note and 2026-27 spring offering
- [CS336 lectures repo](https://github.com/stanford-cs336/lectures) — the executable-lecture format and star count
- [CS25: Transformers United V6](https://web.stanford.edu/class/cs25/) — spring 2026 speakers and topics
- [CS146S: The Modern Software Developer](https://themodernsoftware.dev/) — units, prerequisites, and course description
- Stanford Online: [CS107](https://online.stanford.edu/courses/cs107-computer-organization-and-systems), [CS161](https://online.stanford.edu/courses/cs161-design-and-analysis-algorithms), [CS336](https://online.stanford.edu/courses/cs336-language-modeling-scratch) — tuition and schedule for the remote-credit versions
- Related on this site: [Which AI courses to take in 2026](/posts/ai/2026-07-10-ai-courses-2026-guide), [CS146S syllabus diff](/posts/ai/2026-08-16-cs146s-course-map-en), [the CS230 series, part one](/posts/ai/2026-08-16-cs230-when-prompting-stops-working-en)
