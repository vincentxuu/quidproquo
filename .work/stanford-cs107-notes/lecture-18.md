# Lecture 18 — More Control Flow Operations

- Date: 2026-02-18
- Instructor: Jerry Cain
- Source: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/18/Lecture18.pdf
- Gap: Canvas video and AFS lecture code unavailable.

## Agenda and evidence

- Condition codes and how `cmp`/arithmetic establish them.
- Conditional jump families encode signed/unsigned comparisons; examples translate if statements and loops.
- Branches do not always immediately follow `cmp`; readers must trace the instruction that last wrote flags.
- Dynamic instruction count makes loop cost visible at machine level.
- `setcc` materializes a Boolean byte; `cmovcc` avoids a branch when both candidate values are safe to compute.

