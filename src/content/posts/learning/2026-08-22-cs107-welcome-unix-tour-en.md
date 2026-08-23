---
title: "Stanford CS107 Lecture 1: From the Course Map to the Unix Command Line"
date: 2026-08-22
category: learning
tags: [cs107, stanford, c-language, systems-programming, unix, self-study]
lang: en
type: deep-dive
series:
  name: "Reading Stanford CS107"
  order: 2
tldr: "Winter 2026 opens by explaining why CS107 goes below programming-language abstractions: from bytes and memory through assembly and heap allocators. It then lays out the 40/10/20/30 grading structure and closes with a first tour of the Unix command line."
description: "A lecture-by-lecture reading of Stanford CS107 Winter 2026 Lecture 1: course goals, six major topics, grading and resubmission rules, help and Honor Code boundaries, and the first Unix commands."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-cs107-welcome-unix-tour)

Stanford CS107 does not begin by rushing into C syntax. Lecture 1 first changes the question. CS106B asks how to solve problems with a high-level language; CS107 asks why programs actually work. What do an `int`, a string, and a structure look like in hardware? How does an executable enter memory? Who manages the heap behind `malloc`? Together, these questions dismantle abstractions that normally feel automatic.

This article covers [the official Winter 2026 Lecture 1](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/01/Lecture01.pdf), not the entire course. It follows the slide order: the course's point of view, topics and learning goals, assignments, labs, exams and support, and finally the Unix command line. Even outside Stanford, the lecture is useful because it supplies a map for the next twenty-five lectures: a controlled descent through layers of abstraction.

## Lecture metadata and source limits

- Course: Stanford CS107: Computer Organization and Systems
- Term: Winter 2026
- Official unit: Lecture 1, *Welcome to CS107!*
- Date: January 5, 2026
- Instructor: Jerry Cain
- Official material: [course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html), [33-page Lecture 1 slide deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/01/Lecture01.pdf), [Winter 2026 syllabus](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/syllabus), and [Assignment 0](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/assign0/)
- Assigned reading: course syllabus, Honor Code and Collaboration Page, and a skim of Bryant and O'Hallaron Chapter 1

The limits matter. The recording is behind Canvas/Panopto, and the live terminal demonstration has no public transcript. AFS lecture code and assignment starter projects are not public either. This article can reconstruct the concepts, policies, and commands in the deck, but it cannot verify Cain's spoken elaborations or invent output for a demo that was not published.

## Complete agenda

1. CS107's how-and-why perspective and its relationship to CS106B.
2. Programming, debugging, and systems-level learning goals.
3. Six topics: bits and bytes, C strings, pointers and memory, generics, assembly, and heap allocators.
4. Teaching staff, CS107ACE, textbooks, and the lecture/lab/assignment rhythm.
5. Grading, style buckets, late work, and resubmission.
6. Exams, support channels, the Honor Code, and collaboration boundaries.
7. Unix, the CLI/GUI comparison, and an initial command set.
8. The purpose of `assign0` and the lecture recap.

## Turning “how to write it” into “why it runs”

The slides use CS106B as the contrast. That course teaches problem solving with high-level languages; CS107 digs into how programs work. This is more than rewriting the same solution in harder syntax. It changes the unit of observation. A variable that looked like a typed box becomes bytes beginning at an address, while its type tells the compiler how those bytes should be interpreted.

Lecture 1 names five questions. How is data represented in hardware? How does a computer execute code? How does an executable map onto memory and hardware? How is the heap implemented? Why does code do something different from what its author expects? The last question is crucial. The machine model is not trivia; it is a debugging instrument. Instead of editing near a bad output at random, a programmer can ask whether a representation, address, lifetime, or control-flow assumption is false.

That explains the emphasis on coding mileage. Understanding one memory diagram does not mean that you can locate an out-of-bounds write in a real C program. The deck groups outcomes into fluency, competency, and exposure. Students should become fluent with pointers, memory, executable address spaces, and runtime behavior. They should become competent at translating between C and assembly, respecting the limits of computer arithmetic, finding performance bottlenecks, navigating Unix, and applying ethical frameworks. Computer architecture, compilers, and assemblers appear at an introductory level.

“Exposure” does not mean unimportant. It means the course is not trying to produce compiler specialists in one quarter. Its central deliverable is an operational model: when you see C source, you should be able to reason about what may happen in memory and machine instructions.

## Six topics form one continuous descent

The six blocks are not independent survey units.

Bits and bytes come first. Integers and floating-point values do not live in a computer as mathematical objects; they occupy finite bit patterns. Once representation is finite, overflow and precision are properties of the model rather than rare accidents.

Characters and C strings follow. Text is more structured than one integer, but it is still bytes underneath. A C string lacks the automatic boundary protection of many higher-level languages, leading directly to buffer overflow and security.

Pointers, stack memory, and heap memory come next. Pointers store and manipulate addresses. The stack and heap use different allocation and lifetime rules. Many C failures that look unrelated reduce to one question: who owns a region of memory, and when is it still valid?

Generics build on representation and addresses. C does not provide the full generic system found in Java or C++, but `void *` and function pointers can produce tools that work over arbitrary data. Abstraction has not vanished; the programmer now assembles it explicitly.

Assembly then explains C in x86-64 terms. Function calls, conditionals, and loops stop being language keywords and become registers, instructions, and jumps.

Heap allocators close the path. `malloc` and `free` are no longer black-box APIs. How does an allocator track free blocks? How does it trade speed, utilization, and fragmentation? Are built-in implementations right for every workload? The allocator project combines bytes, pointers, data structures, and performance.

The course is therefore not simply “C, then assembly.” Each lower layer explains why the preceding layer works. Bytes explain strings, pointers explain C-style generic code, assembly explains C control flow, and all earlier material explains `malloc`.

## The rhythm: lectures model, labs rehearse, assignments integrate

The slides assign different jobs to the three activities. Lectures explain concepts and present demonstrations. Labs teach tools, study code, and support peer discussion. Assignments synthesize lecture and lab material into programs completed individually. That structure exposes a self-study trap: reading slides completes only the first layer of the course.

A typical topic spans Wednesday, Friday, and the following Monday, while Thursday labs digest the preceding week's material. `assign0` is released on the first Wednesday and due the next Wednesday, so it draws on Monday, Wednesday, and some Friday material. Students do not wait for a topic to be perfectly complete before touching it. The assignment is part of the mechanism that converts fragments of understanding into skill.

The main text is the third edition of Bryant and O'Hallaron's *Computer Systems: A Programmer's Perspective*. The slides explicitly say the edition matters. Stanford provides selected scans in Canvas under fair use, but those scans are not public. For C, students may use Kernighan and Ritchie's *The C Programming Language* or another reference. The point is not to memorize a book cover to cover; it is to verify function contracts and language behavior while programming.

CS107ACE adds a one-unit discussion section with extra instruction and practice by application. Its existence is an important reminder for independent learners: the official design does not assume everyone understands a lecture in one pass. Rehearsal and live clarification are normal components, not remedial exceptions.

## Grading separates “works” from “maintainable”

Winter 2026 weights assignments at 40%, lab participation at 10%, the midterm at 20%, and the final at 30%. Seven programming assignments are completed individually with Unix command-line tools and supplied starter projects. Automated tools produce the functionality score with limited CA review. Style is assessed through code review and occasional automated checks, then assigned a bucket.

The style buckets range from `+` through `ok`, `-`, `--`, and `0`. A `+` is outstanding and rare, especially early in the course. `ok` is solid work with room to improve. `-` shows effort and understanding but still has issues that would block entry into a professional repository. `--` contains many issues and is minimally passing. `0` means no submission or almost no change to starter code.

This split is meaningful. Passing behavioral tests says that a program produced expected results for those cases. It does not automatically establish naming, decomposition, commentary, or maintainable control flow. Attractive code cannot compensate for incorrect results either. Professional-grade programming requires both.

An independent learner can imitate the distinction with two passes. Test behavior first, including boundaries and errors. Put the program away for a day, then review only structure: does each function have one job, can names replace explanatory comments, and can duplicated logic converge? Debugging a crash while renaming everything mixes two different tasks.

## Late work and resubmission are recovery mechanisms

Assignments are due one minute before midnight, Stanford time. A submission less than 24 hours late receives a functionality cap of 95%; between 24 and 48 hours, 90%; between 48 and 72 hours, 85%. Work later than 72 hours is generally not accepted without prior arrangements. A cap lowers only scores above the threshold; it is not a flat deduction applied to everyone.

Resubmission applies to every assignment except `assign6`. A first functionality score below 85% but at least 25% may be resubmitted within seven calendar days after reports are released, with recovery capped at 85%. Below 25%, the maximum is three times the original score. Only automated tests are rerun; style and short answers are not rereviewed.

The policy permits correction but still requires a substantive first attempt. It also repairs only what automated functionality tests can measure. If you borrow this model for self-study, preserve your first report and write one sentence after the repair: “I originally confused X with Y.” Otherwise the score can improve while the faulty mental model survives.

## Exams, support, and collaboration boundaries

The midterm and final are pencil-and-paper, closed-book, closed-notes, and closed-device. Students receive a sheet of common prototypes and other details not worth memorizing. The design points away from API recall and toward reasoning about programs and memory without compiler feedback.

Support channels are divided by need. Ed Discussion fits conceptual, policy, debugging, and general assignment questions, but assignment code must not be posted. Office hours fit longer discussions and debugging with course staff. Private grading or accommodation issues go to the staff email. A useful debugging question includes a reproducible case, observed behavior, expected behavior, and hypotheses already tested rather than an entire unexplained codebase.

The Stanford Honor Code forbids giving or accepting unpermitted aid. CS107 additionally requires transparent disclosure of assistance and prohibits viewing, sharing, or publishing solutions. The Winter 2026 slides explicitly prohibit using LLMs to generate assignment code because that replaces the intellectual work under assessment. A student who believes they made a mistake may retract a submission by emailing Cain before the final exam.

For a public lecture guide, the responsible boundary is similar: explain public concepts and practice methods without reconstructing assignment solutions or pretending that restricted starter code is public courseware.

## The Unix command line begins with location awareness

Unix supplies operating-system conventions and a family of software-development tools. macOS and Linux inherit that tradition; CS107 uses Stanford's Myth machines. A command-line interface is a text interface for navigating files and launching executables, while a graphical interface presents analogous operations through windows and icons.

Both ask the same questions: where am I, what is here, where should I go, and what should happen to a file? A CLI does not draw that state, which makes it initially intimidating. In return, commands are repeatable and composable and work unchanged on remote machines.

The first command set includes:

```bash
pwd                 # print the current working directory
ls                  # list directory contents
cd path/to/project  # change directory
mkdir scratch       # create a directory
cp source.c copy.c  # copy a file
mv copy.c old.c     # move or rename a file
cat old.c           # print a text file
man printf          # read a manual page
rm old.c            # remove a file
```

The slides call out `rm` as irreversible. Practice inside a dedicated disposable `scratch` directory, not among valuable files. Before each command, predict what the next `ls` will show, then verify it. That builds a location model more effectively than copying a list of command names.

The course uses `ssh` to enter Myth, `emacs` to edit, `make` to compile, and `./myprogram` to run. Lecture 1 does not yet unpack the full workflow; Lecture 2 will. The early lesson is that a C program does not magically run “inside the editor.” Files, compiler output, executables, and the shell are distinct layers where failures can occur.

## What assign0 is testing

`assign0: Intro to Unix and C` contains five parts: survey the website and learn Unix commands, clone the starter project, answer questions in `readme.txt`, compile and modify a supplied C program, and submit. It is not an algorithmic filter. It verifies that everyone can operate the shared environment before pointers and memory arrive.

An outsider without the complete starter project should not manufacture an “equivalent assignment.” Preserve the skill target instead. Create `hello.c` and complete directory creation, editing, compilation, execution, renaming, and output cleanup from the command line. Close the terminal, sign in again, and repeat without notes. Any step that still blocks the second run deserves deliberate practice.

## Three durable lessons

First, CS107 is not merely a C syntax course. C exposes representation, addresses, execution, and allocation. Syntax alone will fail to explain every later unit.

Second, correctness, maintainability, and debugging are connected but distinct. Tests, style review, labs, and exams observe different parts of understanding; no one metric substitutes for the others.

Third, Unix is not opening-week administration. Every later edit, compilation, test, debugging session, and profile runs in this environment. Thirty minutes building muscle memory for `pwd`, `cd`, `ls`, and file operations reduces the cognitive load of every later failure.

The next lecture turns the map into a first C program: headers, `main`, `printf`, command-line arguments, and the source-to-executable workflow. Its second half begins at one bit and unifies decimal, binary, and hexadecimal as positional notation.

## Further reading and practice

### Minimum route

1. Run every Unix command listed above inside a disposable directory.
2. Predict the current directory and next `ls` output before each operation.
3. Read the Lecture 1 slides and draw dependency arrows among the six topics.

### Standard route

1. Skim Chapter 1 of *Computer Systems: A Programmer's Perspective*, focusing on the compilation system and hardware overview.
2. Build a tiny C project directory and manage it entirely through the shell.
3. Write a help-request template containing environment, reproduction steps, expected result, observed result, and tested hypotheses.

### Deep route

1. Compare GUI file operations with shell commands and note which actions become repeatable or composable.
2. Locate source, build product, and executable for one compiled program without yet reverse-engineering it.
3. Turn each of the six course topics into a testable question and revise the answers after later lectures.

## Update log

- 2026-08-22: Corrected the Lecture 1 deck length to 33 pages from the official PDF.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Winter 2026 Lecture 1 Slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/01/Lecture01.pdf)
- [Stanford CS107 Winter 2026 General Information and Syllabus](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/syllabus)
- [Stanford CS107 Winter 2026 Assignment 0: Intro to Unix and C](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/assign0/)
