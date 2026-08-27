# Lecture 22 — Managing the Heap, Take II

- Date: 2026-02-27
- Instructor: Jerry Cain
- Source: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/22/Lecture22.pdf
- Gap: Canvas video and AFS lecture code unavailable.

## Agenda and evidence

- Identifies implicit-list cost: allocation scans occupied as well as free blocks.
- Explicit free list stores links inside free payloads, so searches visit only reusable blocks.
- Compares implicit and explicit designs against utilization and throughput rather than declaring one universally best.
- Coalescing requires locating adjacent physical blocks while maintaining the logical free-list links.
- Worked diagrams cover unlink/merge/reinsert cases and their invariants.

