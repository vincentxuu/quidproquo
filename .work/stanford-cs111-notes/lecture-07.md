# Lecture 7: Deadlock

- Date: 2026-04-13
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/7/Lecture7.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: the four necessary deadlock conditions, resource graphs, and avoidance

## Extracted agenda cues

- Deadlock
- Why do we have multiple locks?
- ●   Reduce contention (fine grain locking vs coarse grain locking)
- ●   Enable modularity (lock per structure)
- ●   Threads often need multiple locks simultaneously
- Hazard: Deadlock
- Simple Deadlock Example
- std::mutex m1;
- std::mutex m2;
- Thread A:                                   Thread B:
- m1.lock();                                  m2.lock();
- m1.lock();
- m2.lock();
- m1.unlock();
- m2.unlock();
