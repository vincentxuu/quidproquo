---
title: "Stanford CS107 Lecture 2: A First C Program, Binary, and Hexadecimal"
date: 2026-08-22
category: learning
tags: [cs107, stanford, c-language, systems-programming, binary, hexadecimal]
lang: en
type: deep-dive
series:
  name: "Reading Stanford CS107"
  order: 3
tldr: "Lecture 2 puts C back into its Unix history and development environment: headers, main, printf, argc/argv, ssh, emacs, make, and executables. It then derives 8 bits = 1 byte, 256 byte patterns, and reliable conversion among decimal, binary, and hexadecimal."
description: "A lecture-by-lecture reading of Stanford CS107 Winter 2026 Lecture 2: C's design tradeoffs, the first program, command-line arguments and compilation workflow, then bits, bytes, binary, and hexadecimal."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-cs107-unix-and-c)

CS107 Lecture 2 joins two lines that may initially look separate: writing a first C program with Unix tools and representing numbers with bit patterns. The first half asks what happens between a source file and an executable. The second asks what a program value becomes in memory. Together, they form the real starting point of a systems course.

This article follows the [official Winter 2026 Lecture 2 deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/02/Lecture02.pdf) in full. It does not treat C as a smaller C++, nor binary conversion as an isolated arithmetic puzzle. The organizing question is consistent: when a language removes some high-level protection, which layers must the programmer manage directly?

## Lecture metadata and source limits

- Course: Stanford CS107: Computer Organization and Systems
- Term: Winter 2026
- Official unit: Lecture 2, *Unix and C*; the slide cover says *Unix, C, Bits and Bytes Intro*
- Date: January 7, 2026
- Instructor: Jerry Cain
- Official material: [course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html), [Lecture 2 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/02/Lecture02.pdf), [Assignment 0](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/assign0/), and the [POSIX Shell and Utilities introduction](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap01.html)
- Assigned reading: skim Bryant and O'Hallaron, Sections 2.2–2.3

The recording, lecture code, and complete terminal-demo transcript are not public. The deck provides only the AFS copy command for the `lect02` demo. This article therefore does not reconstruct the “unexpected behavior” program or claim to know its output. The public PDF fully supports the program structure, workflow, positional notation, and conversion exercises; gaps remain gaps rather than being patched with another term's material.

## Complete agenda

1. C's history: Bell Labs, Unix, B, and the capabilities C introduced.
2. Shared syntax, limitations, and language philosophies across C, C++, Java, and Python.
3. A first C program: comments, headers, `main`, `printf`, and return values.
4. Familiar control flow, `stdbool.h`, `bool`, and command-line arguments.
5. The everyday `ssh`, `emacs`, `make`, execution, and cleanup workflow.
6. Motivation for Bits and Bytes and the unavailable unexpected-behavior demo.
7. Bits, bytes, byte addressability, and positional notation.
8. Decimal/binary conversion and the multiply-or-divide-by-the-base pattern.
9. Hex digits, `0x`/`0b` prefixes, and four-bit binary/hex grouping.
10. The handoff to unsigned, signed, and floating-point representations.

## C was not designed as a reduced teaching language

The slides place C's creation between 1969 and 1972. Dennis Ritchie developed it at Bell Labs, with a stable form emerging around 1972, partly to implement Unix. Early Unix used assembly, which was difficult to maintain and impossible to port, and B, which lacked strong types, arrays, and records. C extended B with characters, long integers, pointers, arrays, records, and pointer arithmetic.

This history is not warm-up trivia. C grew around practical systems-engineering constraints, so its capabilities and dangers often come from the same feature. Pointer arithmetic gives operating systems and runtimes precise control over layouts, and it also lets ordinary programs step beyond an array. Proximity to hardware gives control; it does not automatically provide guardrails.

C, C++, and Java share primitive types, operators, `for`, `switch`, `if/else`, and functions. Much of the surface looks familiar to someone coming from CS106B. C lacks operator overloading, default arguments, true pass-by-reference, and object orientation, and its native library set is small. More importantly, its runtime model is minimal and performs almost no runtime error checking by default.

The deck calls C procedural: the primary act is writing functions rather than defining classes and invoking methods. Python is dynamically typed and multi-paradigm. C++ retains procedural programming and adds objects. Java is primarily object-oriented. These labels do not select a winner; they show where each language places work. C's small footprint and speed leave more checking and resource responsibility with the programmer.

Why still learn it? First, memory, pointers, and layouts are explicit. Second, operating systems, compilers, databases, drivers, and embedded firmware are commonly implemented in C. Third, many high-level languages and runtimes rest on C, so it helps explain their performance and limits. Rust and Go are easier to interpret after seeing the problems that C exposes directly.

## A first C program: every line establishes a contract

The slide deck's `hello.c` is short:

```c
/*
 * hello.c
 * This program prints a welcome message
 * to the user.
 */
#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("Hello, world!\n");
    return 0;
}
```

The opening block is a comment; C also supports `//` line comments. Good comments state purpose or reasoning that is not obvious from the code. They need not translate the next line into prose.

`#include <stdio.h>` exposes the declaration of `printf`. Standard-library headers use angle brackets, while project headers generally use quotes, as in `#include "wordle-utils.h"`. The slides casually call these imports, but this is not Python's runtime module mechanism. At the level needed today, the header provides declarations used for compilation checks. Preprocessing, compilation, and linking will be refined later.

`main` is the entry point. Its `int` return type supplies a small status code, with zero denoting success. That value is not a user-facing message; it goes back to the environment that launched the process. A shell or script can use it to decide what happens next.

`printf("Hello, world!\n")` writes to standard output, and `\n` is a newline. C statements end with semicolons. A missing semicolon is normally a compile-time error rather than something the runtime guesses about.

Even this tiny program establishes four contracts: a header provides an interface, `main` defines an entry point, `printf` defines formatted output, and the return code reports process status. A small language does not imply a small number of interfaces.

## `printf`: the format string carries type responsibility

The lecture summarizes formatted output as:

```c
printf(control, arg1, arg2, arg3, ...);
```

Placeholders in the control string consume later arguments in order. Lecture 2 introduces `%s` for a string and `%d` for an integer:

```c
char *department = "CS";
int number = 107;
printf("You are in %s%d\n", department, number);
```

The output is `You are in CS107`. From the beginning, count placeholders against arguments and verify each type. C's minimalist runtime does not turn every mismatch into a friendly exception; a format/argument mismatch may produce incorrect behavior. Even before the underlying mechanism is covered, compiler warnings should be treated as actionable evidence.

The familiar-syntax slide shows `int`, `double`, `char`, arithmetic, `for`, `if`, `while`, logical operators, and a function call. Its purpose is not a complete control-flow tutorial. It tells students with C++ or Java experience that the surface transfers while the major differences concentrate around types, memory, and library boundaries.

The slide's first line, `int x = 23`, lacks a semicolon. Compiled literally, it fails. That makes a useful exercise: do not switch off the compiler because code appears in lecture material. Place a fragment into a minimal program and compile with warnings enabled, distinguishing an illustrative snippet from a complete runnable program.

## Boolean syntax needs a header; truth comes from expressions

To use `bool`, the deck includes `stdbool.h`:

```c
#include <stdio.h>
#include <stdbool.h>

int main(int argc, char *argv[]) {
    bool x = argc > 2 && argv[argc - 1][0] != 'A';
    if (x) {
        printf("Hello, world!\n");
    } else {
        printf("Greetings, traveler!\n");
    }
    return 0;
}
```

The condition requires more than two arguments and requires the first character of the final argument not to be `A`. `argv[argc - 1][0]` previews a later memory model: select the final string, then its first character.

Dense expressions become easier to inspect when decomposed:

```c
bool has_extra_arguments = argc > 2;
bool last_starts_with_a = has_extra_arguments && argv[argc - 1][0] == 'A';
bool should_say_hello = has_extra_arguments && !last_starts_with_a;
```

This is not a performance claim. It makes the precondition for each memory access visible. If `argc` is too small, the program must not first access a nonexistent extra argument.

## `argc` and `argv`: how the shell hands off a launch

The standard skeleton is:

```c
int main(int argc, char *argv[])
```

`argc` is the argument count, and `argv` is the argument vector. The slides run:

```bash
./args 1 2 "3 4" five
```

The program receives five arguments. Argument zero is `./args`, followed by `1`, `2`, `3 4`, and `five`. Quotes cause the shell to preserve `3 4` as one token. This tokenization occurs before the program begins; C receives an array after shell parsing.

The loop uses `size_t i` and `%zu`:

```c
for (size_t i = 0; i < argc; i++) {
    printf("Argument %zu: %s\n", i, argv[i]);
}
```

In a full build, `argc` is an `int` while `i` is the unsigned `size_t`; direct comparison may trigger a signedness warning depending on flags. Do not add arbitrary casts merely to silence it. Understand each range and select consistent types. Systems programming treats warnings as early clues about the machine model, not noise to disable.

Compile `args.c` and test no extra arguments, one argument, a quoted argument containing spaces, and the empty string `""`. Predict `argc` and every `argv[i]` before running. The distinction between shell parsing and C strings becomes immediately visible.

## The everyday path from text file to executable

The customary workflow is:

1. Use `ssh` to log into Myth remotely.
2. Edit C source with `emacs`; save with `Ctrl-x Ctrl-s` and quit with `Ctrl-x Ctrl-c`.
3. Run `make` with the supplied `Makefile`.
4. Execute the resulting program as `./myprogram`, possibly with arguments.
5. Run `make clean` to remove executables and compiler products.

`make` is not itself the C compiler. It reads dependency and command rules, decides which targets need rebuilding, and invokes compilation tools. Supplied Makefiles keep flags consistent across students. If the final line says that make failed, read upward for the actual compiler diagnostic.

The `./` in `./myprogram` is meaningful. It explicitly selects a file in the current directory. The shell searches `PATH` for ordinary commands and does not necessarily search the current directory. Also separate “compiled successfully” from “ran successfully”: compilation only produced an executable; inputs, runtime behavior, and exit status come next.

The deck previews `gdb` for debugging and Valgrind for memory errors and efficiency in the following week. It does not teach their operation here. For now, establish a clean loop: edit, save, compile, read the first diagnostic, fix, rebuild, run, and inspect process status.

## From unexpected behavior into bits and bytes

Topic 1 asks how a computer represents integers and floating-point values. The deck supplies three motivations: representation explains limits of computer arithmetic, enables efficient operations, and supports compact encodings.

The live class included an unexpected-behavior demo copied with:

```bash
cp -r /afs/ir/class/cs107/lecture-code/lect02 .
```

That Stanford AFS path does not give public readers enough material to verify source or output. We can say the demo bridges intuitive C behavior and finite representation. We cannot responsibly label the exact overflow or failure demonstrated. A source gap is a stopping point, not permission to improvise.

## One bit has two states; combinations create capacity

A bit is a binary digit with value zero or one. Combining bits creates more patterns, just as combining decimal digits creates more numbers. Eight bits make one byte, so a byte has:

```text
2^8 = 256
```

patterns. Interpreted as an unsigned integer, those range from zero through 255. The maximum is either the sum from `2^7` down through `2^0` or, more compactly, `2^8 - 1`.

Memory is a large array of bytes and is byte-addressable: an ordinary memory address identifies a byte, not an isolated bit. Computers still operate on bits, while images, audio, video, and text define different interpretations of bit patterns.

Keep pattern and meaning separate. Bits do not intrinsically carry an “unsigned integer,” character, or pixel label. Types, instructions, and file formats determine interpretation. Much of CS107 consists of holding a pattern fixed while changing the interpretation lens.

## Positional notation unifies decimal and binary

Decimal `5934` means:

```text
5 × 10^3 + 9 × 10^2 + 3 × 10^1 + 4 × 10^0
```

Each position is weighted by a power of the base, and each digit ranges from zero to `base - 1`. Binary is identical with base two:

```text
0b1011 = 1 × 2^3 + 0 × 2^2 + 1 × 2^1 + 1 × 2^0 = 11
```

The leftmost bit is the most significant bit and the rightmost is the least significant bit. These names describe positional weight. They do not say that the MSB always has one semantic role; signed representations will reinterpret it later.

To convert binary to decimal, add the weights wherever the bit is one. `0b1010` is eight plus two, or ten. To convert decimal to binary, repeatedly choose the largest power of two no greater than the remainder. Fourteen takes eight, then four, then two, producing `0b1110`.

Appending a zero multiplies a positional numeral by its base; removing the final digit with integer division divides by the base. Decimal `7453 × 10` becomes `74530`; binary `0b1100 × 0b10` becomes `0b11000`. This is not a binary trick but a property of positional notation.

## Hexadecimal is human-readable compression for binary

Writing 32- or 64-bit values in full binary is cumbersome. Hexadecimal uses base sixteen, with digits `0`–`9` and `a`–`f` for ten through fifteen. Because sixteen is `2^4`, one hex digit maps exactly to four bits and two hex digits map to one byte.

In C and related tools, `0x` marks hexadecimal and `0b` commonly marks binary. The lecture example is:

```text
0xF5 = 0b11110101 = 245
```

For hex to binary, expand each digit independently into four bits:

```text
1    7    3    A
0001 0111 0011 1010
```

For binary to hex, group from the right in sets of four and pad only the leftmost group. `0b1111001010` becomes `0011 1100 1010`, or `0x3CA`. Grouping from the right preserves the least-significant position.

The deck compares one byte in three forms. Decimal `165` is familiar but hides individual bits. Binary `0b10100101` exposes every bit but is hard to scan. Hex `0xA5` preserves fast binary correspondence in a shorter notation. Hex does not change the value; it changes the human-facing representation.

## A conversion process that does not depend on guessing

For binary to decimal, label positions with powers of two from the right and add only the weights with a one. Verify by decomposing the result back into powers.

For decimal to binary, choose the greatest power of two no larger than the target, subtract it, and continue. Fill unselected positions with zero. Adding selected weights should recover the original.

For binary to hex, group four bits from the right, convert each group to zero through fifteen, and map it to a digit. Pad the leftmost group if necessary.

For hex to binary, expand every digit to exactly four bits. Keep separators until the conversion is checked; leading zeros may be removed afterward when representing a number.

Do not stop at recognizing an answer. Take one byte such as `0xA5` through hex → binary → decimal → binary → hex. If the loop does not close, positional weights or grouping still need repair.

## What this lecture has not yet established

The closing slide names unsigned integers, signed integers, and floating-point numbers. Lecture 2 fully builds only the entry point: finite bit patterns and the unsigned range. Negative encoding, reinterpretation as signed values, and floating-point precision are future topics.

Likewise, the lecture uses `char *`, array indexing, and `size_t` without yet supplying the complete memory model. The examples are usable, but they do not mean that pointers have been explained. CS107 first makes syntax and tools operational, then dismantles every familiar-looking construct in later lectures.

## Joining the two halves

The C workflow and number representation are not arbitrary roommates. When `make` compiles source, the compiler translates language-level types and control flow into an executable. When that executable runs, variables must occupy finite bit patterns. The first half teaches how to make a program run; the second begins explaining the physical limits it has while running.

This also provides a debugging hierarchy. If the compiler rejects the program, inspect syntax, declarations, and type diagnostics. If launching fails, inspect shell parsing, paths, and arguments. If execution succeeds but arithmetic surprises you, investigate finite representation, types, and runtime behavior. Calling all three “C is broken” destroys the search boundary.

The next lecture continues through integer representations, unsigned and signed interpretation, overflow, and fixed width. Before moving on, conversion speed matters less than explaining each step with positional weights and seeing shell tokens, C types, and bit patterns as connected but distinct layers.

## Further reading and practice

### Minimum route

1. Compile and run `hello.c`, then inspect its exit status from the shell.
2. Write `args.c` and predict `argc` and `argv` for four different invocations.
3. Close the conversion loop among `0b10100101`, `0xA5`, and decimal 165.

### Standard route

1. Introduce one wrong `printf` placeholder, compile with warnings, study the diagnostic, and repair it.
2. Compare the first `make`, a second `make` without changes, and `make` after editing source.
3. Choose five byte values and write each in decimal, binary, and hexadecimal.

### Deep route

1. Use `man printf` to verify the argument types for `%d`, `%s`, and `%zu` against your code.
2. Test unquoted text, double quotes, an empty string, and a wildcard as shell arguments; record what happens before program launch.
3. Draw a source → preprocessing/compilation/linking → executable → process troubleshooting map, marking details not supplied by this lecture for later verification.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Winter 2026 Lecture 2 Slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/02/Lecture02.pdf)
- [Stanford CS107 Winter 2026 Assignment 0: Intro to Unix and C](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/assign0/)
- [The Open Group Base Specifications: Shell and Utilities Introduction](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/V3_chap01.html)
