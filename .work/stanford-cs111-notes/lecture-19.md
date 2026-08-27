# Lecture 19: File Systems

- Date: 2026-05-11
- Instructor: Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/19/Lecture19.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar
- Material gap: Canvas recording unavailable; notes derive from the public PDF.
- Editorial focus: the file abstraction, block allocation, inodes, and access patterns

## Extracted agenda cues

- File Systems
- ●   Chapter 11
- ●   Section 13.3 (up through page 567)
- Key challenge for file systems: Disks
- ●   Disk attributes: high latency, fast sequential access
- Problems addressed by modern file systems
- ●   Disk space management: How do we organize files on disk?
- ○ Sharing disk space between users
- ○ Fast access to files (minimize seeks)
- ○ Efficient use of disk space
- ●   Naming: How do users select files?
- ○ Going from a file name to the location of its blocks on disk
- ●   Reliability: Want to never lose data
- ○ Permanent storage, unlike most other memory OS manages
- ○ Information must survive OS crashes and hardware failures. Recovery important.
- ●   Protection: isolation between users, controlled sharing
- What is a file?
- ●   User's view of file:
- ○ Named collection of bytes
- ○ Stored durably
- ●   OS Kernel's view of file:
- ○ Collection of disk blocks
- ○ Some attribute storage (metadata)
- File access patterns
- ●   Sequential: information is processed in order, one byte after another
- ○ By far most common pattern (~90%) on today's machines
- ○ Examples: editor reads and writes, compiler reads and reads, etc.
- ●   Random Access: can address any byte in the file by position
- ○ Data set for demand paging
- ○ Database systems
- ●   Keyed (or indexed): search for blocks with particular contents
- ○ Examples: hash table, associative database, dictionary
- ○ Usually provided by databases, not operating system
- Issues to consider
- Inodes: one per file, memory-resident while open and stored on disk; size, sectors, timestamps, owner/group, rwx.
- Contiguous/extent allocation: first sector plus length; excellent locality, but prediction, extension, and external fragmentation problems.
- Linked allocation: first-block inode and next pointer in each block; easy growth, expensive random access and seeks.
- FAT: all next pointers in a normally memory-resident table; entries also encode end/free, so the table doubles as free list.
- FAT history: simplified 16-bit/512-byte 32 MB model; FAT32 uses 28 address bits and clusters.

## Coverage decision

- All public PDF agenda through the FAT evaluation is represented; naming, recovery, and protection are stated as goals only because this deck does not develop their algorithms.
- Slide anomalies are explicit: “4096 bytes?” is uncertain, FAT capacity figures are a simplified model, and “original IBM PC (1983)” conflicts with the IBM 5150's 1981 introduction.
- Canvas/Panopto recording remains inaccessible; no video-only claims are inferred.
