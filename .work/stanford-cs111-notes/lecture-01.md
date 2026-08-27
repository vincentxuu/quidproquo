# Lecture 1: Welcome to CS111!

- Date: 2026-03-30
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/1/Lecture1.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: operating-system history, abstraction, and the course’s three major threads

## Extracted agenda cues

- Operating Systems Principles
- Introduction
- What is an Operating System?
- ●   “Operating system” is a hard term to define
- ●   The discipline arose historically from a set of problems
- ●   It’s easiest to introduce OS’es by discussing their history
- Learn OS Through History
- ●   OS evolved to solve real problems
- ●   We’ll trace how features emerged
- ●   Then extract principles
- 1940s Operating Systems
- ●         Started with first computers, 1940s.
- ●         One user at a time, working directly at console
- ●         First “operating systems”: shared code for things like reading and writing
- devices (e.g. input/output libraries)
- ○         Reasons: convenience, efficiency
- 1952 - IBM Model 701 - First commercial computer
- Vacuum Tubes, OS was shared cards
- IBM System 360 Console - Debug interface
- Slide 5
- Phase 1: Hardware Expensive, Humans Cheap
- ●   Goal: maximize machine utilization
- ○ Get user out of the loop
- ●   Simple batch monitor:
- ○   User submits deck of punched cards describing a series of operations (job)
- ○   Output is given back as a print out
- ■ Program output
- ■ Print out of memory contents on errors (core dump)
- ●   OS = program to load and run user programs and take memory dumps after
- crashes
- ○   Makes better use of hardware, but more difficult to debug.
- 1960s Improving Efficiency (machine utilization)
- ●   Overlap of input/output (I/O) and computation
- ○   Hardware: data channel & interrupts
- ●   Buffering and interrupt handling in OS
