---
title: "Stanford CS111 Lecture 5: Mutexes, Condition Variables, and Mesa Semantics"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 6
tldr: "Lecture 5 uses an eight-slot circular Pipe to prove that a mutex supplies exclusion, while a condition variable atomically releases the lock and blocks when a predicate is false; under Mesa semantics, wait must return to a while loop that rechecks the predicate."
description: "A lecture-by-lecture reading of Stanford CS111 Spring 2026 Lecture 5: lock ownership, circular-buffer invariants, four broken Pipes, condition variables, Mesa semantics, and monitors."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-05-locks-condition-variables)

This is part 6 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 5**. Mendel Rosenblum taught it on 2026-04-08; the official title is [Locks and Condition Variables](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/5/Lecture5.pdf). This article uses only the public PDF and [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The Canvas/Panopto recording is not treated as a source read here.

The previous lecture's Too Much Milk solutions forced exclusion out of flags and carefully enumerated interleavings, but were too complicated. This lecture asks for two higher-level capabilities: **mutual exclusion**, to express critical sections, and **blocking**, to delay a thread without wasting a CPU. A mutex solves the first problem and a condition variable the second. The PDF repeatedly repairs one producer/consumer `Pipe` to establish why both are necessary.

## From Too Much Milk to a mutex

Because `lock` is both noun and verb, a class and method with that name would produce `lock.lock()`. C++ calls the mutual-exclusion object `std::mutex`. The lecture begins with three operations:

- `lock()` blocks while held, then marks the mutex as held by its caller.
- `unlock()` frees it and gives a waiter an opportunity to proceed.
- `try_lock()` reports failure instead of blocking when it is held.

Only the thread that successfully acquires a mutex may release it, and at most one thread owns it at a time. A mutex also cannot discover which variables form one shared state. The programmer must require every access to that group to hold the same mutex.

```cpp
std::mutex mutex;
mutex.lock();
if (milk == 0) {
    buy_milk();
    milk = 1;
}
mutex.unlock();
```

The interval from successful `lock()` through `unlock()` is the critical section. Two threads cannot execute this check and update together, so both cannot observe `milk == 0`. The cost is visible too: with `buy_milk()` inside the section, another thread waits through the purchase. Exclusion provides atomicity; it does not make a critical section short or automatically guarantee fairness.

## Pipe shared state and circular invariants

`Pipe` is a bounded producer/consumer queue with `SIZE = 8`. Producers call `put(c)` and consumers call `get()` for the oldest character:

```cpp
char buffer[SIZE];
int count;
int nextPut;
int nextGet;
std::mutex mutex;
```

`nextPut` names the next write slot and `nextGet` the next read slot; each wraps to zero at `SIZE`. `count` distinguishes equal indices meaning empty from equal indices meaning full. A correct implementation preserves six invariants:

1. `0 <= count <= SIZE`.
2. `0 <= nextPut, nextGet < SIZE`.
3. `count` equals the number of unconsumed characters.
4. If `count > 0`, `buffer[nextGet]` is the next character returned.
5. If `count < SIZE`, `buffer[nextPut]` is the next slot safe to overwrite.
6. Updates to `count`, both indices, and the relevant slot occur under the same mutex.

The PDF executes `put('A')`, adds B and C, and returns A with `get()`. It then inserts D through I so the index crosses the end and wraps. This is more than modulo arithmetic: physical slots are reused, but the logical order of unread characters must survive.

## Pipe v1: critical sections exist, preconditions fail

In v1, `put` and `get` update under the mutex, so their critical sections cannot overlap. Yet a mutex answers whether someone is changing state, not whether put or get is legal.

The overflow trace starts with eight unread characters and `count == 8`. Another `put('J')` still increments count to 9 and overwrites `buffer[nextPut]`. An unread character disappears, breaking both the count bound and FIFO order; J overwrites B in the PDF.

The underflow trace starts empty with `count == 0`. `get()` still decrements count to -1, reads undefined data, and advances `nextGet`. The mutex perfectly protects a sequence of incorrect operations. Absence of a data race does not imply algorithmic correctness.

The put predicate is `count < SIZE`; the get predicate is `count > 0`. A predicate is a Boolean statement about shared state and is meaningful only while holding the mutex protecting it. When false, the thread cannot proceed, but it cannot spin while retaining the lock because the opposite side must enter to change `count`.

## Pipe v2: waiting while locked deadlocks

v2 waits inside the critical section:

```cpp
mutex.lock();
while (count == SIZE) {
}
// put
```

The check and update cannot be separated, but a producer on a full queue holds the mutex forever. Only `get()` can lower `count`, and its first step is acquiring the same mutex. Producer waits for consumer; consumer waits for producer to unlock. A consumer spinning with the mutex on an empty queue is the symmetric deadlock.

After finding a false predicate, a waiter must release the mutex, and release-plus-sleep must be indivisible. If separated, state can change and notification can occur in the gap before the waiter sleeps.

## Pipe v2.5: checking outside the lock races

v2.5 moves the loop before `mutex.lock()`:

```cpp
while (count == SIZE) {
}
mutex.lock();
// put
```

This avoids holding the mutex while waiting but separates check from update. At `count == SIZE - 1`, two producers can both observe “not full.” A fills the queue; B acquires the mutex next but does not recheck and produces `SIZE + 1`.

An ordinary C++ `int count` read outside the lock while another thread writes it is itself a data race, not merely a stale read. Making it atomic removes that language-level race but does not make check-then-act one transaction; the logical race remains.

## Pipe v2.9: closer to correct, but busy-waiting

v2.9 unlocks and relocks before each recheck:

```cpp
mutex.lock();
while (count == SIZE) {
    mutex.unlock();
    mutex.lock();
}
// put
```

Each check is locked, and the thread holds the mutex after leaving the loop, eliminating v2.5's check/update race. The other side can change `count`. But the waiter never sleeps: it repeatedly contends for CPU and the mutex cache line. If both sides are not scheduled together, it can burn a core without completing work.

The failures are distinct: v1 lacks flow-control predicates; v2 holds the mutex and deadlocks; v2.5 checks outside it and races; v2.9 retains atomicity but busy-waits excessively. The missing operation is “atomically release the mutex and sleep, then compete for it after state may have changed.”

## Condition variables signal possible state change

A `std::condition_variable` is usefully modeled as a queue on which threads sleep:

- `wait(lock)` atomically releases the lock and blocks, then reacquires it before returning.
- `notify_one()` wakes one sleeper, if any.
- `notify_all()` wakes all sleepers.

A condition variable does not store that a condition is true and is not an event counter. A notification with no waiter saves no ticket. The real conditions are `count > 0` and `count < SIZE`, determined by mutex-protected state. The condition variable means only, “Relevant state may have changed; wake and check.”

Consumers wait on `charAdded` for `count > 0`; producers wait on `charRemoved` for `count < SIZE`. Successful put notifies consumers, and successful get notifies producers:

```cpp
mutex.lock();
while (count == 0) {
    charAdded.wait(mutex);
}
count--;
char c = buffer[nextGet];
nextGet = (nextGet + 1) % SIZE;
charRemoved.notify_one();
mutex.unlock();
```

The PDF first uses a simplified mutex argument. The final C++ version uses `std::unique_lock<std::mutex>`, because standard `condition_variable::wait` needs an object it can unlock and relock. Its scope also releases the mutex on return, avoiding a forgotten `unlock()` on a return or exception path.

## Mesa semantics: notify does not hand off the mutex

A notified thread might not reacquire the mutex immediately. Under **Mesa-style condition-variable semantics**, the notifier may continue holding it; the waiter merely becomes runnable and later competes with other threads. By the time `wait` returns, the original predicate may be false again.

The contract is not “the condition is guaranteed true when you wake.” It is “after waking and reacquiring the mutex, shared state can be checked safely.” The predicate therefore belongs in `while`, not `if`.

## Why wait must be inside while

The PDF expands the broken `if` version through three threads:

1. Consumer `T1` acquires the mutex, sees `count == 0`, and waits. Wait atomically unlocks and puts T1 to sleep.
2. Producer `T2` puts A, sets `count == 1`, notifies T1, and unlocks. Notification does not transfer the mutex.
3. Before T1 reacquires it, consumer `T3` gets it, consumes A, returns count to zero, notifies a producer, and unlocks.
4. T1 reacquires and returns from wait. With `if`, it passes the old check, decrements count to -1, and reads undefined data.

With `while (count == 0)`, step four checks again and waits because the queue is empty. The same form handles spurious wakeups: regardless of why wait returns, state cannot be used before the predicate is true.

```text
hold mutex → while (predicate is false) wait → mutate state while predicate is true
```

The loop is a correctness requirement under Mesa semantics, not conservative style.

## notify_one, notify_all, and wakeup contention

The PDF changes v3 to `notify_all()` and asks whether it works. Correctness survives when every waiter rechecks in while. Each awakened thread reacquires the mutex; the first may consume the resource, and later threads see a false predicate and sleep again.

`notify_all()` can nevertheless create a thundering herd: one transition permits one operation, while many threads wake and contend before most sleep again. `notify_one()` normally matches one put creating one consumable item. If a transition can satisfy several waiters' predicates, the choice should be reconsidered. The criterion is the predicate and transition, not a universal ranking.

## Lock granularity and monitor style

More locks can reduce contention and permit unrelated operations concurrently. They also complicate ownership, acquisition order, and state partitioning, increasing race and deadlock risk; acquisition itself costs time. The PDF calls the endpoints coarse- and fine-grained locking. Its direction is to use as few locks as possible while keeping contention acceptable and to associate one lock with related variables.

A monitor contains shared data, methods operating on it, one lock, and condition variables. Each method acquires the lock at entry, holds it for shared-data access, and releases it before return; waits temporarily release that lock. Java's `synchronized` is the PDF's language-support example.

Pipe is a monitor: its buffer, count, and indices are shared state; put and get are operation boundaries; both use one mutex; `charAdded` and `charRemoved` represent two predicates. Review can now ask whether any method touches state without the lock.

## v4: unique_lock expresses the final contract

The final version uses `std::unique_lock<std::mutex>`:

```cpp
void Pipe::put(char c) {
    std::unique_lock<std::mutex> lock(mutex);
    while (count == SIZE) {
        charRemoved.wait(lock);
    }
    count++;
    buffer[nextPut] = c;
    nextPut = (nextPut + 1) % SIZE;
    charAdded.notify_one();
}
```

`get()` symmetrically waits for `count > 0` and notifies `charRemoved`. The contracts are visible together: `unique_lock` represents ownership; while rechecks after every wakeup; wait atomically releases and reacquires; circular-state updates stay in the critical section; notify says only that state may have changed.

Five questions audit any condition-variable program: What is shared state? Which mutex protects it? What is each operation's predicate? Is wait inside a locked while loop? Which state transition notifies which waiter? If any answer is missing, successful runs are not yet a synchronization proof.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 5 slides: Locks and Condition Variables](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/5/Lecture5.pdf)
- [cppreference: `std::condition_variable`](https://en.cppreference.com/w/cpp/thread/condition_variable)
- [cppreference: `std::mutex`](https://en.cppreference.com/w/cpp/thread/mutex)
- [cppreference: `std::unique_lock`](https://en.cppreference.com/w/cpp/thread/unique_lock)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
