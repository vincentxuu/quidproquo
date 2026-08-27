# Lecture 24: File System Crash Recovery, Continued — research notes

- Date/instructor: 2026-05-22, Mendel Rosenblum
- PDF: https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/24/Lecture24.pdf
- Recording unavailable; article claims derive from the PDF.

## Duplicate-artifact audit

- Lecture23 SHA-256: `a099b49ac2be90356272ebc1493b729c0e6d8db60808c86de9ce5bea96e73c54`
- Lecture24 SHA-256: `ec9781e6326f0e9dd3504af48fa331d5a53b69345ae90dde0bdde14ce40bd624`
- Both contain 23 pages titled `Crash Recovery`. Extracted text has identical headings, bullets, examples, and ordering; differences are `/lost+found` and four periods.
- Editorial consequence: disclose duplication. Lecture 23 owns pages 1–15; Lecture 24 owns pages 16–23, making “Continued” an explicit editorial split.

## Page agenda

1–15: handled in Lecture 23. 16: logical/physical entries and idempotence. 17–18: complete groups and Assignment 8 transactions. 19: checkpoint and logging scope. 20–22: trade-offs, delayed log writes, fsync, device failure. 23: performance/durability/consistency.

## External checks

- ext4 docs confirm commit → checkpoint → replay and distinguish `data=ordered`, `data=journal`, `data=writeback`: https://docs.kernel.org/filesystems/ext4/journal.html
- `fsync(2)` flushes modified data and metadata; directory entry durability needs directory fsync: https://man7.org/linux/man-pages/man2/fsync.2.html
- Treat 5 TB/8 hours/weeks as lecture examples, not current universal benchmarks. Transaction means crash-consistency grouping here, not full database semantics.
