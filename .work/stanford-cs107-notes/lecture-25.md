# Lecture 25 — Caching and Memory Hierarchies

- Date: 2026-03-06
- Instructor: Jerry Cain
- Source: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/25/Lecture25.pdf
- Gap: Public deck is unusually short; Canvas video and AFS examples unavailable. Article must stay concise and avoid importing another offering.

## Agenda and evidence

- Introduces caching as keeping likely-to-be-reused data in a smaller, faster layer.
- Memory hierarchy makes access latency nonuniform.
- Temporal locality: recently accessed data is likely to be accessed again.
- Spatial locality: nearby addresses are likely to be accessed soon.
- Performance consequence is to organize traversal and data layout for locality; slides provide only this conceptual treatment.

