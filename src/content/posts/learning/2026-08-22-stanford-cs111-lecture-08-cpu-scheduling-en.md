---
title: "Stanford CS111 Lecture 8: FIFO, Round Robin, Priorities, and Multicore Scheduling"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 9
tldr: "Lecture 8 moves from FIFO and round robin through the unimplementable SRPT ideal to adaptive priority queues and the multicore conflict among queue contention, core affinity, and work conservation."
description: "A slide-by-slide reading of Stanford CS111 Spring 2026 Lecture 8 on CPU scheduling metrics, time slices, SRPT, priority queues, the BSD scheduler, Unix nice, and multicore scheduling."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-08-cpu-scheduling)

This is part 9 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 8**. Mendel Rosenblum taught the lecture on 2026-04-15; its official title is [Scheduling](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

This lecture starts where dispatching left off. The dispatcher can save registers, switch stacks, and resume a thread; scheduling decides which thread should receive that mechanism next. Given ready threads and CPU cores, the policy chooses a thread for each core and how long it may run. The PDF develops the problem on one core before generalizing it to multiple cores. The recording is Canvas-only, so no unobserved spoken material is reconstructed here.

## 1. FIFO: a simple ready queue is already a policy

First-in-first-out scheduling, also called non-preemptive scheduling in the slides, keeps one ready queue. A thread that becomes ready joins the back; the dispatcher takes the front thread and runs it until exit or blocking. The structure and rule are simple, but arrival order lets an early long job determine every later job's delay.

The [official Lecture 8 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf) supposes A needs 100 ms, B needs 1 ms, and C needs 2 ms. FIFO runs A, B, C, producing completion times 100, 101, and 103 ms and an average of 101.3 ms. B and C need only milliseconds but sit behind A. This is the intuition behind the convoy problem. The PDF summarizes the consequences as starvation and high response time.

The slides use completion times when comparing these scenarios; that should not silently be relabeled as the time to a first interactive response. FIFO's strength here is low queueing complexity and little preemption, not a claim of optimal average response time.

## 2. Preemption and round robin: fairness costs context switches

Preemption prevents one thread from owning the CPU indefinitely. A hardware timer interrupts execution after a bounded **time slice**. The [official PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf) gives a 4 ms Linux time slice as an example; it is a lecture example, not a claim about every Linux version and scheduler configuration.

In the [same official PDF's round-robin example](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf), round robin runs the front thread for one slice and returns it to the back if it remains ready. Threads at the same level receive roughly equal CPU shares. With the 100, 1, and 2 ms jobs and a 1 ms slice, B completes at 2 ms, C at 5 ms, and A at 103 ms, reducing the average to 36.7 ms.

A shorter slice is not free. A long slice approaches FIFO and inherits its response-time problem. A very short slice spends too much time on timer interrupts and context switches. A rough utilization model is `q/(q+s)`, where `q` is useful slice time and `s` is switch cost; this explanatory model is not a benchmark supplied by the PDF.

Fair progress also need not minimize average completion. If all three jobs need 10 ms, FIFO completes them at 10, 20, and 30 ms for an average of 20 ms. With 1 ms round robin they finish near 28, 29, and 30 ms for an average of 29 ms. All advance together, but jobs that could have completed earlier are delayed.

## 3. Scheduling goals conflict

The PDF groups goals into minimizing response time; using resources efficiently by keeping cores and disks busy while limiting context-switch overhead; and distributing CPU cycles fairly enough to avoid starvation. No scheduler maximizes all three for every workload.

Fairness is a system value choice, not merely a formula. Shorter slices make turns more frequent but add overhead. Shortest-job preference improves the mean but may postpone long work forever. Interactive preference improves perceived latency by taking share from background computation. The slides explicitly call fairness versus average response time an interesting societal question because scarce-resource order distributes benefits.

One mean is therefore inadequate. Tail latency, starvation, CPU and I/O utilization, and scheduler overhead all matter. An average may be dominated by a few long jobs or hide a low-priority class that never runs.

## 4. SRPT: optimal average response requires the future

The [official Lecture 8 PDF's SRPT example](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf) shows that Shortest Remaining Processing Time runs the thread that will finish soonest and, in this slide deck's simplified presentation, runs it to completion. It is provably optimal for average response time. In the 100, 1, and 2 ms example, B, C, A finish at 1, 3, and 103 ms, averaging 35.7 ms. For three equal 10 ms jobs, SRPT ties FIFO at 20 ms.

The [same official PDF's workload figures](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf) show that SRPT can also improve resource utilization. An I/O-bound job tends to use a short CPU burst before waiting on disk or network; completing that burst starts the device while the CPU serves other work. The slides compare a large-file copy looping over a 5 ms read, 1 ms CPU burst, and 5 ms write; an editor waiting 100 ms for a character and using 0.1 ms of CPU; and a number-crunching job with an hours-long burst. Favoring short bursts keeps the human and devices from waiting behind computation.

The fatal problem is that the scheduler does not know a thread's future remaining time. Even the program may not know it. Moreover, an endless stream of short jobs can starve a long one. SRPT is both an optimum and an unimplementable oracle: it identifies the desired information so a practical scheduler can seek an observable proxy.

## 5. Predicting future CPU use from the past

The key approximation is that past behavior tends to predict future behavior. A thread that has run for a long time without blocking is likely CPU-bound and likely to keep running. A frequently blocking thread is probably interactive or I/O-bound and likely has another short CPU burst. This is a workload tendency, not a correctness theorem.

Recent CPU usage substitutes for unknowable remaining time. Giving higher priority to threads that recently consumed less CPU approximates SRPT on many workloads: editors and I/O-bound threads quickly return to waiting, while compute-bound work descends in priority.

The prediction can be wrong. A thread can switch phases, or block strategically to retain priority. An adaptive scheduler does not claim history perfectly predicts the future; it updates an imperfect estimate and separately prevents starvation.

## 6. Dispatcher, scheduler, and priority queues

The PDF corrects a common mental model: the dispatcher does not simply call a scheduler to perform an expensive fresh decision at every switch. Dispatcher and scheduler share a scheduling data structure. The dispatcher is a fast path that retrieves the next thread; scheduler code updates the structure in response to events so that later retrieval implements the policy.

Priority scheduling assigns every thread a priority. The dispatcher selects the highest-priority ready thread, using round robin to break ties. One ready queue per level, `P0 ... Pn`, makes the highest nonempty level cheap to find. Priority is therefore a mechanism for several policies: it can approximate SRPT or expose some scheduling control to users.

One feedback rule starts a newly ready thread at the highest level. Using an entire slice without blocking moves it down; blocking before the slice ends moves it upward. Interactive and I/O-bound threads remain high while CPU-bound work migrates downward. This is the multilevel-feedback idea shown by the deck, although the slides label the structures priority queues and do not specify every parameter of a modern MLFQ.

Its immediate problem is starvation: a continuing supply of high-priority work can prevent a CPU-bound thread at the bottom from ever running. A complete policy needs a way for waiting threads to regain priority.

## 7. The 4.4BSD scheduler and Unix nice

The early-1990s 4.4BSD example records recent CPU use from thread start and stop times, then gives highest priority to threads that used the least CPU recently. Interactive and I/O-bound threads spend time waiting and stay high; CPU-bound threads accumulate usage and move lower.

Aging prevents starvation: priority rises while a thread waits, so it eventually becomes highest priority. Under severe overload, no thread gets much CPU, usage differences shrink, and the system devolves toward round robin in the highest priority queue. The long-run allocation cannot be inferred from one instantaneous priority value.

Unix `nice` lets users influence the default. The slides show `0` as default, `+19` as most nice and therefore low priority, and `-20` as least nice and highest priority:

```bash
nice -n 19 ./background_script.sh
nice -n -20 ./run_with_highest_priority.sh
```

The conceptual point is relative: being nice to other work means competing less for CPU. Whether a user may set a negative nice value depends on privileges and system rules, which the PDF does not expand into a permissions specification.

## 8. Multicore scheduling: global order meets contention and affinity

The initial multicore design shares ready queues and a lock across cores; each core has its own dispatcher and timer interrupts. With `k` cores, it runs the `k` highest-priority threads. If a newly ready thread outranks the lowest-priority running thread, an inter-processor interrupt (IPI) asks that core to preempt.

A shared queue makes global choice easy but sends every core to one lock. At scale the central ready queue bottlenecks. The slides propose a ready queue per core, balancing over time, with work stealing so an idle core can take another core's work. The cost is that globally identifying the best `k` threads is no longer one cheap operation.

The second issue is **core affinity**. A thread builds cache state on the core where it runs; migration may require instructions and data to be reloaded. Perfectly balanced queue lengths may perform worse after lost locality. A scheduler therefore weighs imbalance, priority, and migration cost rather than moving every runnable thread immediately.

## 9. Work conservation is not free

A work-conserving CPU scheduler never leaves a core idle while runnable work exists. The property sounds unconditionally desirable, but contention and affinity make it costly. Finding remote work, acquiring locks, issuing an IPI, and migrating cache state can cost more than a short idle interval, making the whole system slower in order to satisfy the local property.

This is a central systems lesson: visible local waste does not prove lower global throughput. A thread about to unblock on its previous core may be cheaper to await; sustained imbalance may justify stealing. The property must be evaluated with implementation cost and workload.

## 10. When scheduler code runs, and the final contract

The scheduler is code invoked by events, **not a resident thread**. The PDF lists thread unblock, timer interrupt, and an IPI from another core. Each changes the ready set or invalidates a current choice, causing scheduler code to update shared structures before a dispatcher takes the next item.

Scheduling importance changes with hardware and workload. It was central under timesharing; on a single-user PC priorities could be left more to the user; abundant multicore CPU time can reduce sensitivity to the exact algorithm. Datacenters make it interesting again by scheduling across hundreds or thousands of servers and colocating latency-critical web services with CPU-heavy ML training.

The final contract is that a scheduling algorithm should not change the results a correct synchronized program produces, although it strongly changes efficiency and response time. Good schemes are adaptive, and strange-looking constants can materially affect behavior. True optimality would require predicting the future. Real systems use the past as an estimate and continually trade response time, utilization, overhead, fairness, and locality.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 8 slides: Scheduling](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/8/Lecture8.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [OSTEP: Scheduling Introduction](https://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf)
- [Linux manual: nice(1)](https://man7.org/linux/man-pages/man1/nice.1.html)
- [Linux kernel scheduler documentation](https://docs.kernel.org/scheduler/index.html)
