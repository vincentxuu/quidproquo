# Lecture 16: Demand Paging

- Date: 2026-05-04
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/16/Lecture16.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: page-fault mechanism, page sources, prefetch, replacement policy, Clock, global allocation, and thrashing

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
- Demand fetching starts with no resident user pages; executable code/data come from the executable, zero-filled regions need no read, and modified anonymous pages use backing store.
- Prefetch comparison: disk fault 5–10 ms versus fast extra page 0.04 ms; SSD fault 50–100 µs versus 10–20 µs; DRAM 50–100 ns. These are deck-era illustrative magnitudes.
- Replacement policies: Random, FIFO, future-oracle MIN/Optimal, and past-looking LRU.
- Four-frame trace `A B C D A B E A B C D E`: FIFO 10 faults, Optimal 6, LRU 8.
- Exact LRU metadata is impractical; referenced/accessed and dirty bits support approximation.
- Clock/second chance: referenced=1 means clear and skip; referenced=0 supplies a victim; dirty victims require writeback.
- Clock-hand speed diagnoses pressure: slow with adequate memory/few faults, fast with insufficient memory/many faults.
- Global replacement improves flexible allocation but permits cross-process interference; per-process replacement requires an explicit frame-allocation rule. The deck generalizes that most systems use global replacement.
- Thrashing occurs when concurrently active pages do not fit, causing active pages to evict one another.
- Artifact anomaly: the deck states one fault per 100 references and gives result 100,099 ns, but prints coefficient `.1`; the consistent coefficient is `.01`: `.99 × 100 + .01 × 10,000,000 = 100,099 ns`.
- Response to thrashing: suspend some processes / schedule only a set whose active memory fits, close applications, or add memory.

## Coverage decision

- Because Lecture16.pdf and Lecture17.pdf are byte-identical, the article deliberately covers only the page-fault path, restartable instructions, page sources, and prefetch timings; Lecture 17 owns replacement, Clock, global allocation, and thrashing.
- The PDF informally describes actively used pages but does not introduce a formal working-set algorithm; the article therefore avoids attributing such an algorithm to this lecture.
- Canvas/Panopto recording remains inaccessible and no claims are attributed to unseen video.
