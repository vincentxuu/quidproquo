# Lecture 21 — Managing the Heap, Take I

- Date: 2026-02-25
- Instructor: Jerry Cain
- Source: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/21/Lecture21.pdf
- Gap: Canvas video and AFS lecture code unavailable.

## Agenda and evidence

- Allocator goals: correct alignment and bookkeeping while balancing throughput and utilization.
- Internal/external fragmentation explain why requested bytes and occupied heap diverge.
- Bump allocator case study: extremely simple and fast but cannot reclaim freed space.
- Implicit free list: blocks carry headers and the allocator walks all blocks to find a fit.
- Placement and splitting policies change fragmentation and speed; closes with coalescing and in-place realloc previews.

