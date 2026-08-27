# Lecture 20: File Systems, Continued

- Date: 2026-05-13
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/20/Lecture20.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: contiguous allocation, linked allocation, multilevel indexes, and large files

## Extracted agenda cues

- File Systems, Continued
- Multi-level indexes (4.3 BSD Unix)
- ●   Disk divided into 4 Kbytes blocks; Files divided into 4 Kbytes blocks
- ●   Inode is the root node of a tree block pointers (similar to page tables)
- ○   Inode has 14 block pointers (0 value means no block)
- ●   First 12 block pointers are direct blocks: point to first 12 blocks of the file
- ●   For files more than 12 blocks, 13th block pointer points to an indirect block
- ●   For files more than 1036 blocks, 14th block points is a doubly-indirect block
- ○   Doubly-indirect blocks point to 1024 indirect block
- ●   Maximum file length is fixed, but large. Indirect blocks only allocated if needed.
- BSD Inode Example: Growing a file
- 0   1   2   3    4      5     6     7     8          9   10 11
- Direct Blocks
- 12      13        ...    1035
- Indirect Block
- Double-Indirect Block
- Example: Read Block 23
- 0   1   3   4    5      6     7     8     9      10 11 12
- 13      14        .23. .   1036
- Example: Read Block 5
- 0   1   2   3    5      5
- 6     7     8     9      10 11 12
- 13      14        ...   1036
- Example: Read Block 1040
- 0   1   3    4    5      6     7     8     9      10 11 12
- 13      14        ...          1036
- > 1035
- BSD Inode evaluation
- ●   Advantages
- ○   Simple, easy to implement (e.g Assignment 7)
- ○   No need to pre-declare file sizes
- ○   Indirect blocks and double-indirect blocks allocated only needed
- ○   Fast access for small files
- ○   Less memory than FAT
- ●   Drawbacks
- Block cache: LRU retention of inode/indirect blocks; shared DRAM budget with virtual memory.
- Synchronous versus delayed writes; “30 seconds?” is illustrative and delayed writes expose crash-loss windows.
- Free bitmap arithmetic: 1 TiB / 4 KiB = 2^28 blocks = 32 MiB bitmap; reserve 10% slack in the deck policy.
- Block-size tradeoff, 4.3BSD fragments, larger modern blocks, repacking, and delayed allocation.
- Disk scheduling: FIFO, SPTF/starvation, SCAN, and CSCAN.

## Coverage decision

- All 37 PDF pages are covered through the scheduling diagrams.
- Artifact anomalies: “4GB (4TB with triple)” exceeds the pictured 14-pointer direct/single/double layout; “30 seconds?” is uncertain; extracted request labels merge as “71,” so no exact path is inferred.
- Canvas/Panopto recording remains inaccessible.
