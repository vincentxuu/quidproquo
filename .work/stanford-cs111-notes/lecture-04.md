# Lecture 4: Concurrency

- Date: 2026-04-06
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/4/Lecture4.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: interleavings, race conditions, atomicity, and critical sections

## Extracted agenda cues

- Concurrency
- Operating Systems: Principles and Practice:
- Chapter 5 up through Section 5.1
- Independent Threads                                                     /bin/tcsh
- ●   No shared state
- ○   Thread cannot affect other threads
- ○   Thread cannot be affected by other threads                          x     y       z
- ○   Deterministic
- ■ Depends only on input
- ○   Reproducible                                                   ls
- ○   Scheduling order doesn’t matter
- ●   Give examples of independent threads
- ○   Are they common?
- x     y       z
- std:cin       std:cout
- multithread
- Cooperating threads
- ●   Share state
- x       y       z
- ○   Behavior is nondeterministic
- ○   May be irreproducible
- ○   Depends on execution order
- ○   Scheduling matters
- Cooperating Threads Example
- Thread #1                                           Thread #2
- cout << 'A' << 'B' << 'C';                          cout << 'C' << 'B' << 'A';
- ●   What outputs could we get?
- ●   Can get different outputs, depending on execution order:
- ABCCBA
- ABCBCA
- ●   Is this possible?
- AABBCC
- Why permit threads to cooperate?
- ●   Resource sharing
