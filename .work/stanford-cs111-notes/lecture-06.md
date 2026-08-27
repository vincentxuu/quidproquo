# Lecture 6: Implementing Locks

- Date: 2026-04-10
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/6/Lecture6.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: interrupt masking, atomic instructions, spinlocks, and blocking locks

## Extracted agenda cues

- Lock Implementation
- Operating Systems: Principles and Practice: Section 5.7
- How to implement locks and condition variables (inside the operating system)?
- Starting with uniprocessor (single core):
- ●   Only traps or interrupts can cause a thread to be switched out
- ●   Disabling interrupts give us a critical section
- Uniprocessor Lock Implementation
- class Lock {                                         void Lock::unlock() {
- Lock() {}                                            intrDisable();
- bool locked = false;                                 if (q.empty()) {
- ThreadQueue q;                                           locked = false;
- };                                                       } else {
- unblockThread(q.remove());
- void Lock::lock() {
- intrDisable();
- intrEnable();
- if (!locked) {
- locked = true;
- } else {
- q.add(currentThread);
- blockThread();                                                Dispatcher function
- Slide 4
- Why must blockThread be invoked with interrupts disabled?
- class Lock {                                               void Lock::unlock() {
- Lock() {}                                                  intrDisable();
- bool locked = false;
- if (q.empty()) {
- ThreadQueue q;
- locked = false;
- intrDisable();                                             }
- if (!locked) {                                             intrEnable();
