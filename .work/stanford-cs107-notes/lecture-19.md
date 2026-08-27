# Lecture 19 — Introduction to Function Call and Return

- Date: 2026-02-20
- Instructor: Jerry Cain
- Source: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/19/Lecture19.pdf
- Gap: Canvas video and AFS lecture code unavailable.

## Agenda and evidence

- Tracks `%rsp`, stack growth and the exact effects of `push` and `pop`.
- `call` saves a return address and transfers control; `ret` restores control.
- Calling convention divides registers into argument/return, caller-saved and callee-saved roles.
- Covers function pointers, parameter passing, return values and stack storage for locals.
- Worked nested-call traces explain why register-saving discipline makes separately compiled functions interoperate.

