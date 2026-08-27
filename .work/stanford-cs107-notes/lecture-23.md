# Lecture 23 — Managing the Heap, Take III

- Date: 2026-03-02
- Instructor: Jerry Cain
- Source: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/23/Lecture23.pdf
- Gap: Canvas video and AFS lecture code unavailable.

## Agenda and evidence

- Coalescing etudes test physical adjacency versus free-list adjacency.
- In-place `realloc` can shrink, consume adjacent free space or fall back to allocate-copy-free.
- Each mutation must preserve alignment, block metadata and free-list invariants.
- Worked cases expose update ordering hazards and stale-link bugs.
- Connects the design directly to the final explicit-allocator assignment milestone.

