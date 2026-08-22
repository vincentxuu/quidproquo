---
title: "Stanford CS107 Lecture 5: Bit Shifts, Bit Tricks, and GDB"
date: 2026-08-22
category: learning
tags: [cs107, stanford, c-language, systems-programming, bitwise-operators, gdb]
lang: en
type: deep-dive
series:
  name: "Reading Stanford CS107"
  order: 6
tldr: "Lecture 5 extends masks to shifts, power-of-two and popcount tricks, then uses an absolute-value example to expose signed intermediate overflow at INT_MIN. Its second half establishes a GDB workflow around breakpoints, execution control, formatted printing, memory examination, and backtraces."
description: "A slide-by-slide reading of Stanford CS107 Winter 2026 Lecture 5: shift semantics, bit-manipulation idioms, the absolute-value boundary, and GDB commands and workflow."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-cs107-shifts-and-gdb)

A mask selects positions; a shift moves positions where they are needed. Together they can extract a byte, toggle fields, find adjacent ones, recognize powers of two, and even construct absolute value without a relational operator. The code is short, but its preconditions are not: type width, signedness, right-shift fill, and a valid shift count.

CS107 Lecture 5 also formally brings GDB into the everyday workflow. The goal is not to memorize abbreviations. It is to establish a repeatable observation loop: stop at a breakpoint, control the next transition, view values in several formats, inspect memory and the call stack, then return to the source. This article follows the [official Winter 2026 Lecture 5 deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/05/Lecture05.pdf) in full.

## Lecture metadata and source limits

- Course: Stanford CS107: Computer Organization and Systems
- Term: Winter 2026
- Official unit: Lecture 5, *Bitwise Operators, Take II*
- Date: January 14, 2026
- Lecturer: not independently identified by the public PDF
- Official material: [course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html), [Lecture 5 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/05/Lecture05.pdf), [Stanford CS107 GDB guide](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/resources/gdb), and [Stanford Lab 1](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lab1/)
- Assigned reading: Bryant and O'Hallaron, Chapter 2.1

The public PDF has 14 pages, and its copyright and contributor credits do not identify the day's lecturer. Page 13 contains only the title “Demo: Bitmasks and GDB.” Lecture code, command sequence, inputs, and terminal output are not public, so this article does not reconstruct the demo. The GDB map centers on the deck and also includes `x`, `backtrace`, and `quit` from the research notes without presenting them as a live transcript.

## Complete agenda

1. Four mask warm-ups over 32-bit `int` and `unsigned long` values.
2. Recognizing nonzero powers of two with `(value & (value - 1)) == 0`.
3. Left shift, zero fill, discarded high bits, and shift-count boundaries.
4. Right shift, logical versus arithmetic fill, and unsigned versus signed operands.
5. Building absolute value from shift, XOR, and subtraction.
6. The boundary that `INT_MIN` creates for an absolute-value contract.
7. Two set-bit counters and why `1UL` is necessary.
8. GDB breakpoints and `run`, `next`, `step`, and `continue`.
9. `print` formats, `info args`, `info locals`, `x`, and `backtrace`.
10. The unavailable bitmask/GDB demo and a two-terminal workflow.

## Four mask warm-ups

The slides begin by emphasizing that masks are not limited to eight-bit `char` values. They apply to `short`, `int`, and `long` as well. Assuming 32-bit `int` variables `j` and `k`, preserve only the lowest byte of `j` with:

```c
k = j & 0xFF;
```

The low eight bits of `0xFF` are ones and all higher positions are zero. AND passes the low byte and clears everything else. To toggle the first and last bytes of `j`:

```c
k = j ^ 0xFF0000FF;
```

The mask has ones only in the outer bytes, so XOR toggles those positions and preserves the middle bytes.

For `unsigned long` variables `m` and `n`, invert every bit directly:

```c
n = ~m;
```

The XOR identity provides another form:

```c
n = m ^ (~0L);
```

`~0L` creates an all-one pattern at `long` width. The suffix matters; a narrower mask can interact with promotion and extension in ways that depart from the intended layout.

The last warm-up tests whether `n` contains adjacent one bits:

```c
(n & (n >> 1)) != 0
```

Shifting `n` right aligns formerly adjacent positions. AND leaves a one only where the original contained `11`; a nonzero result therefore proves that at least one pair exists.

## Powers of two: clear the lowest set bit

A positive power of two has exactly one one in binary: `1`, `10`, `100`, or `1000`. If `value` is `1000000₂`, subtracting one produces `0111111₂`: the sole one becomes zero, and every lower zero becomes one. Their AND is zero.

```c
bool is_power_of_2(unsigned long value) {
    return value != 0 && (value & (value - 1)) == 0;
}
```

If the original has several ones, subtracting one clears only the lowest set bit and changes positions below it; at least one higher one survives the AND. The `value != 0` guard is essential because zero has no set bits and also satisfies the AND equality, despite not being a power of two.

The idiom has broader value. Assignment `value &= value - 1` clears one lowest set bit per iteration. The later population-count example repeatedly applies that invariant.

## Left shift: move weights and possibly discard information

`x << k` shifts a pattern left by `k`, fills low positions with zeroes, and discards bits that leave the left edge. `x <<= k` updates the original variable. The deck shows eight-bit patterns:

```text
00110111 << 2  -> 11011100
01100011 << 4  -> 00110000
10010101 << 5  -> 10100000
```

When no high one is discarded, unsigned left shift often corresponds to multiplication by `2^k`. Once a one leaves the container, only the fixed-width pattern remains; ordinary integer multiplication is no longer an adequate model.

The slides explicitly advise relying on this bit-pattern effect only for unsigned values. Signed left shift interacts with representability and language rules; observed machine behavior is not a contract. The count must also be less than the operand width. Shifting an eight-bit value by nine is undefined, not guaranteed to yield zero.

Mask construction often uses `1UL << i`. The suffix makes the left operand an `unsigned long` before the shift. A plain, commonly 32-bit `1` shifted by 33 is already invalid before assignment to a wider destination could rescue it.

## Right shift: do not collapse logical and arithmetic shift

`x >> k` shifts right and discards bits leaving the low edge. What fills new high positions depends on type and implementation semantics. Unsigned right shift fills with zeroes and is called logical shift. It commonly corresponds to division by `2^k` with remainder discarded.

The deck demonstrates arithmetic shift by replicating the sign bit in signed eight-bit patterns:

```text
01011101 >> 1  -> 00101110
01111110 >> 4  -> 00000111
11111110 >> 4  -> 11111111
11011011 >> 7  -> 11111111
```

A positive sign bit is zero, so the result resembles logical shift. For a negative value it is one, so high positions fill with ones. This roughly preserves division-by-a-power-of-two meaning for negative two's-complement values.

This article keeps the deck's campus-machine premise: the absolute-value trick below assumes arithmetic signed right shift, and the course machines provide it. Portable library code should verify its target and C contract explicitly or reformulate the operation in unsigned representation instead of hiding an implementation choice inside the algorithm.

## The absolute-value bit trick is not a complete working C implementation

The ordinary implementation is direct:

```c
unsigned int absolute_value(int value) {
    return value < 0 ? -value : value;
}
```

The deck asks for no relational operator or runtime multiplication and shows this bit expression:

```c
unsigned int absolute_value_bitwise(int value) {
    int mask = value >> (sizeof(value) * CHAR_BIT - 1);
    return (value ^ mask) - mask;
}
```

`sizeof(value) * CHAR_BIT` calculates the type width. Subtracting one gives the distance needed to move the sign bit to the low edge and fill all high positions. Under arithmetic right shift, a nonnegative value produces an all-zero mask; a negative value produces all ones, or `~0`, equivalent to -1.

The nonnegative path is `(value ^ 0) - 0`, leaving the value unchanged. The negative path intends `(value ^ ~0) - (-1)` to synthesize two's-complement negation. That algebra explains the bit pattern, but it is not a valid C implementation for every input: both operands are `int`, so subtraction occurs as signed `int` before conversion to the unsigned return type.

## `INT_MIN`: a correct formula can exceed its type

The slides leave a thought question: what does `absolute_value_bitwise(INT_MIN)` return? The two's-complement signed range is asymmetric. For a 32-bit `int`, the minimum is `-2^31`, while positive `2^31` does not fit in signed `int` but does fit in an equally wide `unsigned int`.

The unsigned return type does not rescue the earlier operation. For `INT_MIN`, `(value ^ mask)` produces `INT_MAX`, and subtracting `-1` requests `INT_MAX + 1`, which is unrepresentable as `int` and therefore signed-overflow undefined behavior. [SEI CERT INT32-C](https://wiki.sei.cmu.edu/confluence/display/c/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow) explicitly requires avoiding signed operations whose results cannot be represented. This article therefore does not call the slide function a working implementation.

Under an explicitly fixed-width, two's-complement bit-pattern premise, arithmetic must first move into the unsigned domain: convert `value` to `unsigned int`, derive a mask as `0U - sign` from its high bit, and then evaluate `(bits ^ mask) - mask`. Unsigned modulo arithmetic makes the boundary defined. A production API should still state its representation premise and test `0`, `INT_MAX`, `-1`, and `INT_MIN`. When Lecture 26 revisits the early example, it remains a representation exercise rather than overriding this C-language caveat.

More generally, bit tricks compress branches while hiding representation requirements. Unless a benchmark establishes value in a sensitive path, the explicit conditional is usually easier to maintain. If the trick remains, document two's complement, arithmetic shift, and the boundary contract alongside it.

## Two popcounts and why `1UL` is necessary

The deck's `mystery` scans every position of an `unsigned long`:

```c
size_t mystery(unsigned long ul) {
    size_t count = 0;
    for (size_t i = 0; i < sizeof(ul) * CHAR_BIT; i++) {
        if ((ul & (1UL << i)) != 0) count++;
    }
    return count;
}
```

`1UL << i` builds a one-position mask, and nonzero AND increments the count. `UL` is essential because plain `1` is commonly a 32-bit `int`; shifting beyond that width incurs undefined behavior before it ever becomes an `unsigned long`.

`enigma` uses the lowest-set-bit idiom:

```c
size_t enigma(unsigned long ul) {
    size_t count = 0;
    while (ul != 0) {
        count++;
        ul &= ul - 1;
    }
    return count;
}
```

Both count one bits. The first loops once per type position. The second clears exactly one set bit per iteration, so its loop count equals the population count and is lower for sparse values. This algorithm is derived from representation rather than memorized as opaque magic.

## GDB's role: stop the program and ask questions

GDB is a command-line debugger. It sets breakpoints, controls execution line by line, displays variables in binary or hexadecimal, and identifies the call path behind a crash. Unlike adding `printf`, it does not require recompiling a new set of output statements for every question and can inspect several expressions at the paused failure state.

Start it with the executable:

```text
gdb myprogram
```

The argument is the compiled program, not the `.c` source. Source lines, variables, and useful stack information also require the debug information enabled by the course Makefile.

## Breakpoints and execution control

`break`, abbreviated `b`, sets a breakpoint at a function or line:

```text
break main
b 42
```

`run` or `r` starts the program and accepts command-line arguments:

```text
run 82
r 82
```

After a stop, `next`/`n` executes the current source line but treats a call as one step. `step`/`s` enters a called function. `continue`/`c` runs to the next breakpoint or termination. The deck highlights an important detail: when GDB points at a source line, that line has not executed yet. It runs only after `next` or another forward command. Treating the highlighted line as already complete makes values appear one step behind.

## Inspect with `print`, `x`, information, and the call stack

`print` or `p` displays a variable or evaluates an expression:

```text
p varname
p 3L << 10
p/t varname
p/x varname
p/d varname
p/u varname
p/c varname
```

`/t` is binary, `/x` hexadecimal, `/d` signed decimal, `/u` unsigned decimal, and `/c` character. Viewing one pattern through several formats directly tests the previous lectures' distinction between bits and interpretation. The slides also recommend `p + <expression>` as a fast C-expression sandbox for trying a shift or mask before copying it into the `.c` file.

`info args` shows current-frame arguments and `info locals` shows local variables. The research notes additionally list `x` for examining memory, `backtrace` for the call stack, and `quit` for leaving GDB:

```text
x/16xb address
backtrace
quit
```

The `x` format selects count, display format, and unit; this example reads 16 hexadecimal bytes from an address. `backtrace` is especially useful after a crash because it first answers which calls led here. These commands become knowledge through use, not through memorizing abbreviations.

## The unavailable demo and a repeatable two-terminal workflow

Page 13 announces a bitmask/GDB demo without publishing its code or transcript. The next page does provide the workflow: open two terminal windows and SSH to Myth in both. Keep the editor in one and GDB plus the command line in the other so source lines and runtime values remain visible together.

After every `.c` change, run `make` and restart or rerun GDB against the updated executable. Forgetting to rebuild leaves the debugger attached to an old binary while the visible source is new, creating an artificial mystery.

A minimal repeatable loop is `make` → `gdb myprogram` → `break main` → `run ...` → `next`/`step` → `p/t value` → `backtrace` when needed → `quit`. Give each step one question; ten simultaneous breakpoints make causality harder to preserve.

## Three layers for organizing the lecture

The **pattern layer** handles positions. Masks select bits, shifts align bits, and XOR or AND performs the change. Adjacent-one and power-of-two tricks both begin by observing a footprint and designing an alignment.

The **language-contract layer** decides which effects are dependable. Confirm unsignedness, operand width, and a legal count. Signed left shift, signed right shift, and `INT_MIN` cannot be waived by hardware intuition.

The **observation layer** connects reasoning to execution through GDB. A breakpoint preserves a state, stepping controls transitions, formatted print changes interpretation, and memory examination plus backtrace widens the view to bytes and calls.

For an immediate exercise, use `0xB4`: calculate `<< 1`, unsigned `>> 2`, and `x & (x - 1)` by hand, then verify them with GDB's `p/t`, `p/x`, and `p/u`. If results differ, inspect operand type and width before assuming either paper or debugger is wrong.

## What should remain after this lecture

1. Masks work at any integer width, but literal suffixes must match the intended width.
2. `n & (n - 1)` clears the lowest set bit and supports power-of-two tests and popcount.
3. Left shift fills low positions with zeroes; unsigned right shift fills high positions with zeroes, while arithmetic right shift replicates the sign bit.
4. A shift count may not reach or exceed operand width, and signed shifts cannot be treated casually as unsigned pattern operations.
5. The slide's branchless absolute-value expression explains a bit pattern, but its signed intermediate overflows for `INT_MIN`; working code must move the arithmetic into the unsigned domain first.
6. GDB's core loop is breakpoint, run, next/step, inspect, and backtrace; source changes require a rebuild.

The next lecture moves into `char` and C strings. GDB's `x` command and `/c` display will become especially useful: a string is no longer merely visible text, but a representation made of contiguous bytes, a terminating null, and an address.

## Update log

- 2026-08-22: Corrected the `INT_MIN` analysis of the branchless absolute-value example; the original expression has signed overflow and is not a complete working implementation.

## References

- [Stanford CS107 Winter 2026 course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Winter 2026 Lecture 5 slides: Bitwise Operators, Take II](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/05/Lecture05.pdf)
- [Stanford CS107 GDB and Debugging Guide](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/resources/gdb)
- [Stanford CS107 Lab 1: Bits, Bytes, and Integers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lab1/)
- [SEI CERT C INT32-C: Ensure that operations on signed integers do not result in overflow](https://wiki.sei.cmu.edu/confluence/display/c/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)
