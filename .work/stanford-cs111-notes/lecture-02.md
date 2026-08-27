# Lecture 2: Threads, Processes, and Dispatching

- Date: 2026-04-01
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/2/Lecture2.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: process and thread execution abstractions, state, and switching

## Extracted agenda cues

- Threads, Processes, and Dispatching
- Operating Systems: Principles and Practice: Chapter 4
- CS Fundamental Concept
- ● What is the most fundamental concept in all of CS?
- Problem decomposition
- Given hard problem, chop it up into several simpler problems that can
- be thought about separately
- Concurrency Motivation
- ●   How to manage concurrency
- Need some way to decompose this activity into units that are manageable.
- Thread Definition
- ●   Thread: a piece of code executing sequentially on single core
- ○ Executes a series of instructions in order
- ■ Easy to reason about: Only one thing happens at a time
- ○ Decomposition: Concurrent activities can be implemented with a collection of threads
- ■ Each of which is easy to reason about
- Hardware executes instructions concurrently
- ●   Exports an illusion of sequential execution
- ○ Example of virtualization
- Execution State
- Can't compute in a vacuum: need state for the computation to operate on
- ●   Execution state: everything that can affect, or be affected by, a thread:
- ○ Code, data, registers, call stack
- ○ Open files, network connections
- ○ Time of day, …
- Thread example from CS106B: Word Count
- #include <iostream>
- #include <fstream>
- #include <map>
- using namespace std;
- int main() {
- ifstream input("input.txt");
- map<string, int> counts;
- string word;
