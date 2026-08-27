# Lecture 17: Demand Paging, Continued

- Date: 2026-05-06
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/17/Lecture17.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Duplicate artifact: Lecture16.pdf and Lecture17.pdf are byte-identical, SHA-256 `65091d9719674258175c2dcf29e1ad82bca8ff8a82d3b66d73b9e40ad3287d9e`; editorial division is mechanism/fetching (L16) versus replacement/thrashing (L17), not distinct deck evidence.
- Editorial focus: FIFO, LRU, Clock, thrashing, and replacement policy

## Extracted agenda cues

- Demand Paging
- Paging
- Demand Paging Overview
- Goal: allow programs to run without all of their information in memory
- ●   Keep in memory physical pages being used
- ○ Idle pages kept on disk
- ●   Pages stored on disk in a paging file
- ○ Also called backing store, or swap space
- ●   Move information back and forth as needed
- ●   Works because of Locality of Reference:
- ○ Most programs spend most of their time using a small fraction of their code and data
- True "Virtual" Memory
- Each page can be either:
- ● In memory (physical page frame)
- ○ DRAM is 100,000x faster than disk
- ○ DRAM is 1000x faster than SSD (flash memory)
- ●   On disk (backing store)
- ○ Disk cost is ~100x less than DRAM
- ○ SSDs cost is ~100x less than DRAM
- We would like to have a virtual memory that is cheap as disk, and as fast as DRAM
- Page Faults - the mechanism
- ●   Present bit in page map 0 for pages in the backing store
- ●   CPU references to virtual addresses with present bit off trap to OS
- ○ Called a page fault trap
- ●   Page fault handling
- ○ Checks to see if valid page (could be error)
- ○ Finds a free page in memory
- ○ Read the page from backing store
- ○ Update the page map entry to point at allocated page and set present bit
- ○ Resumes execution of the thread
- Hardware support for paging
- ●   Latch faulting address on a page table
- ○ X86-64 has a privileged register CR2
- ●   Instructions need to be restartable
- ○   Typically undo any changes so instruction can be restarted.

## Coverage decision

- Because Lecture16.pdf and Lecture17.pdf are byte-identical, this article retains only a concise mechanism/fetching recap and owns the replacement-policy agenda: trace counts, exact-LRU cost, reference/dirty bits, Clock and hand speed, global/local pools, and thrashing.
- The thrashing example is described as a 1% memory-reference page-fault rate, not “1% less memory”; the slide's printed `.1` coefficient is corrected to `.01` consistently in both languages.
- Canvas/Panopto recording remains inaccessible, so no distinct spoken-deck boundary is claimed.
