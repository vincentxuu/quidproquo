# Lecture 27: Virtual Machines

- Date: 2026-06-01
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/27/Lecture27.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Artifact audit: Lecture27 SHA-256 `4243e46bdcfa194ba21980bd41429e849c8ef7b5f626fa9083c7aea0c11a9e85` differs from adjacent Lectures 26 and 28; no duplicate.
- Editorial focus: trap-and-emulate, hypervisors, hardware virtualization, and isolation

## Extracted agenda cues

- Virtual Machines
- Operating System
- Virtual Memory                               Scheduler
- Operating
- System
- System Calls                                     File System
- Physical
- Memory
- Set                                                              I/O Devices
- Registers                           MMU
- Process
- Process Abstraction
- OS Process Abstraction
- ●   Memory:
- ○ Linear array of virtual memory pages                      Process interface
- ●   CPU:
- ○ All non-privileged instructions and registers                                 OS Kernel
- ●   System calls:                                               Hardware interface
- ○ FIle I/O (e.g. open/read/write)                                               Hardware
- ○ Process operations (e.g fork, thread create, wait, exit)
- ○ Few other calls
- ●   Overall: a subset of the facilities of the underlying machine
- ○ Some close (e.g. CPU), other pretty different (e.g. Memory, Files)
- What if we made process look like hardware?
- Simulation versus direct execution and trap-and-emulate.
- CLI and guest syscall/sysret state transitions.
- Virtual I/O and paravirtualization.
- Guest virtual→physical→machine translation, shadow maps, and hardware second-stage tables.
- VM encapsulation, historical arc, development use, data-center consolidation, and cloud computing.
- ○ All instructions and registers, privileged and non-privileged
