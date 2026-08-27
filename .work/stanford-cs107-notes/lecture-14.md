# Lecture 14 — Introduction to Assembly and x86-64

- Date: 2026-02-06
- Instructor: Jerry Cain
- Source: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/14/Lecture14.pdf
- Calendar: https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html
- Gap: Canvas video and AFS lecture code unavailable.

## Agenda and evidence

- Topic 5 asks how C is compiled and executed; assembly is the human-readable form of machine code.
- Course goal is reading/reverse-engineering compiler output, not authoring assembly.
- Compilation pipeline and `objdump -d`; worked `sum_array` translation connects C statements to instructions.
- x86-64 abstraction: program counter, register file, condition codes, memory; registers are small CPU storage named with `%r` prefixes.
- Introduces AT&T syntax and the role of `gcc`; stresses that types and high-level aggregates mostly disappear.

