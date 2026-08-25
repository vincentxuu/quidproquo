---
title: "Stanford CS111 Lecture 2: Threads, Processes, and Dispatching"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 3
tldr: "Lecture 2 defines shared and private process/thread state, then uses fork, execvp, waitpid, and thread creation to show how the kernel creates execution units."
description: "A guide to Stanford CS111 Spring 2026 Lecture 2, covering processes, threads, system calls, and the fork/exec execution model."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-02-threads-processes-dispatching)

This is part 3 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 2**. Mendel Rosenblum taught the lecture on 2026-04-01; its official title is [Threads, Processes, and Dispatching](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/2/Lecture2.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Lecture 2 first answers what an OS schedules and isolates. The slides define a thread as sequential execution, divide registers, stacks, code, variables, and open files into private or shared state, and then connect object lifecycles through `fork`, `execvp`, `waitpid`, and thread creation.

## Read this lecture from the execution unit outward

The dispatcher is deliberately deferred. First separate a program, a process, and a thread. Then see how system calls ask the kernel to create or replace a process. Finally identify the program counter, stack, and argument required to start a thread. That vocabulary makes context switching in the next lecture intelligible.

## Problem decomposition comes before threads

The slides first ask for the most fundamental concept in computer science and answer with problem decomposition: turn a hard problem into smaller problems that can be considered separately. Concurrent activity is difficult because several things can progress at once. A thread decomposes it into control flows that each execute sequentially.

The definition has two boundaries. A thread is a piece of code executing in order on one core. Within that thread, instructions have a tractable sequence. A program may contain several threads, so sequential behavior per thread does not mean that the whole program does one thing at a time. Hardware operates concurrently while exporting the illusion of sequential execution to each thread; the lecture identifies this as virtualization.

## Execution state is more than registers

Computation cannot proceed in a vacuum. The slides define execution state broadly as everything that can affect, or be affected by, a thread: code, data, registers, call stack, open files, network connections, and even time of day. Saving registers in a context switch therefore does not imply that every observable input has been copied or isolated.

A process organizes this state: **one or more threads plus their execution state**. Code, variables, open files, and connections are generally shared by threads in the same process. Registers and call stacks are private to each thread. Time is a shared external input rather than a private thread snapshot.

Most processes begin with one thread, and early systems allowed no more than one. Multiple threads help exploit several cores and decompose an application by activity. The price is already visible: cheap communication through shared state makes correctness depend on interleavings. Lectures 4 and 5 develop that consequence.

## A system call crosses an authority boundary

Process creation cannot be implemented as an ordinary user function because the OS owns isolation domains, address spaces, and accounting. An application asks the kernel through a system call. Lecture 2 uses Linux [`fork`](https://man7.org/linux/man-pages/man2/fork.2.html), [`execvp`](https://man7.org/linux/man-pages/man3/exec.3.html), and [`waitpid`](https://man7.org/linux/man-pages/man2/wait.2.html) to show a complete lifecycle.

`fork()` duplicates the current process. The parent receives the child PID, while the child receives zero, and both return from the same call site. That unusual return convention lets one source program assign different work after the branch. It also shows that process creation is not merely starting a function: the child initially carries the parent’s process state.

`execvp()` does not create another process. It overwrites the current process with a new program’s code and data and does not return on success. `waitpid()` lets the parent wait for a particular child and collect status. A shell can therefore fork, adjust the child’s environment or file descriptors—implementing a redirection such as `ls > ls.out`—and then exec the target program, while the parent chooses whether to wait or continue.

## Why copy and then overwrite

The benefit of fork/exec is a programmable setup interval before exec: change the environment, reconnect standard streams, and close descriptors that should not be inherited. The cost is apparent too: when the child immediately calls exec, most of the copied state is discarded.

The slides contrast this split with the many parameters of Windows `CreateProcess`. The comparison is about where an interface places policy, not which API is aesthetically superior. Unix separates duplication from loading, allowing setup through ordinary process operations. Windows centralizes many creation choices in one call. macOS shells may use `posix_spawn`, while Linux implementation techniques make fork sufficiently fast. API semantics must not be confused with eager physical copying.

## The minimum information needed to create a thread

A process normally starts with its first thread. Creating another requires at least a starting program counter, a stack region and initial stack pointer, and usually an argument for the initial routine. Linux, macOS, and Windows expose different low-level calls; language libraries wrap them in safer interfaces.

C++ `std::thread t(func)` begins a control flow concurrent with the caller, and `t.join()` waits for completion. C `pthread_create`, Go `go func(arg)`, and Python `threading.Thread(...).start()` differ syntactically but answer the same questions: which instruction begins execution, where the stack lives, what arguments are supplied, and which process state is shared.

This gives a direct process/thread contrast. Fork creates a new process abstraction whose state is logically separated. A new thread enters the same process and shares variables and open resources. Processes provide stronger isolation and require boundary-crossing communication; threads make sharing easy and synchronization necessary.

## Where Lecture 2 stops

This lecture defines execution abstractions but does not yet fully explain how an OS runs more threads than cores. It prepares the objects: a thread is sequential execution, a process contains private and shared state, and system calls ask the kernel to create those objects.

The next lecture puts threads on cores and introduces ready, running, and blocked states, the process control block, the dispatcher, and context switching. The order matters: first establish what is scheduled, then explain scheduling. Otherwise a scheduler can be mistaken for a queue that merely selects functions.

## Check yourself with a shared-state table

Draw two columns comparing a new process with a new thread inside one process. For code, variables, registers, stacks, and open files, mark what is shared. Then explain which row `fork`, `execvp`, and `waitpid` changes; return to the execution-state list when an answer is unclear.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 2 slides: Threads, Processes, and Dispatching](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/2/Lecture2.pdf)
- [CS111 Assignment 1: Lambdas, Threads, and Processes](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/assign1/)
- [Linux `fork(2)` manual page](https://man7.org/linux/man-pages/man2/fork.2.html)
- [Linux `execve(2)` manual page](https://man7.org/linux/man-pages/man2/execve.2.html)
- [Linux `waitpid(2)` manual page](https://man7.org/linux/man-pages/man2/wait.2.html)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
