# Lecture 5: Locks and Condition Variables

- Date: 2026-04-08
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/5/Lecture5.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: mutexes, condition variables, predicates, and Mesa semantics

## Extracted agenda cues

- Locks and Condition Variables
- Locks and Conditional Variables
- Operating Systems: Principles and Practice: Sections 5.2-5.4.
- Too-much-milk solution is too complicated
- Needed: higher-level synchronization mechanism that provides
- Mutual exclusion: easy to create critical sections
- Blocking: delay a thread until some desired event occurs
- Naming aside: Lock
- ●   The word lock is both a noun and a verb
- ○ Bike lock, Combo lock, Pad lock, Deadbolt lock.
- ○ Lock the door. Lock the bike. Lock the car.
- ●   Lock the lock?
- ●   C++ language designers disliked lock.lock(); …; lock.unlock()
- ○ Want something to create critical sections
- ■ Need a mutual exclusion mechanism (mutex)
- Locks (C++ class std::mutex)
- ●   lock()
- ○   Block until the lock is free
- ○   Mark the lock as held by the calling thread
- ●   unlock()
- ○   Mark the lock as free
- ○   Unblock a waiting thread
- ●   try_lock() - Like lock() except return error rather than blocking if lock held
- Too much milk solution with locks
- Both threads:
- std::mutex mutex;
- mutex.lock();
- if (milk == 0) {
- buy_milk();
- milk = 1;
- mutex.unlock();
- Producer/Consumer (a pipe)
- Producer/Consumer, v1 broken
- Pipe() : count(0), nextPut(0), nextGet(0) {}                             char c;
- void put(char c);                                                        mutex.lock();
