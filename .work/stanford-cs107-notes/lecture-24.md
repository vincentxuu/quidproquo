# Lecture 24 — Optimizations

- Date: 2026-03-04
- Instructor: Jerry Cain
- Source: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/24/Lecture24.pdf
- Supplement: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/guide/callgrind.html
- Gap: Canvas video and AFS demo code unavailable.

## Agenda and evidence

- Optimization begins with measurement; matrix multiplication motivates locating hot code.
- Callgrind provides instruction-level profiling rather than guessing from source shape.
- Compiler transformations: constant folding, common-subexpression elimination, dead-code elimination, strength reduction, code motion and tail-recursion optimization.
- Contrasts `-O0`/`-Og` with `-O2` assembly.
- Compiler optimization has aliasing and semantic limits; programmers still need clear algorithms and evidence from profiling.

