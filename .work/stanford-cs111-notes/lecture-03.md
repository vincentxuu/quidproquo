# Lecture 3: Threads, Processes, and Dispatching, Continued

- Date: 2026-04-03
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/3/Lecture3.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: kernel threads, user threads, context switching, and dispatchers

## Extracted agenda cues

- Threads, Processes, and Dispatching,
- Continued
- Execution abstractions review
- ●   Thread - Smallest unit of execution
- ●   Process - One or more threads and their execution state
- int child_pid_or_zero = fork();
- if (child_pid_or_zero == 0) {
- execvp(“ls”, argv);
- Linux process create:        // Not reached
- } else {
- Single thread
- waitpid(child_pid_or_zero, &status, options);
- fork - create new process with new thread
- Parent
- Process
- x     y       z
- fork()                        std:cin       std:cout
- x       y       z
- std:cin       std:cout                                                 Child
- std:cin       std:cout
- Slide 21
- Thread Creation
- ●   Processes typically start with a single thread
- ●   A system call used to start an additional thread
- ○ Linux: clone;
- ○ MacOS: thread_create_running
- ○ Windows: NtCreateThreadEx
- ●   A process with more than one thread is called multithreaded
- Thread creation system calls
- ●   Required information:
- ○ Starting program counter for thread (e.g. routine to call)
- ○ Starting thread stack region in memory and initial stack pointer
- ○ Usually some way of passing parameters to initial routine
- ●   Examples:
