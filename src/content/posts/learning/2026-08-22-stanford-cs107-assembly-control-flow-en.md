---
title: "Stanford CS107 Lecture 17: From Multiply and Divide to x86-64 Control Flow"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, control-flow]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 18
tldr: "CS107 Lecture 17 completes full-width x86-64 multiplication and division, traces %rip through instruction bytes, and uses direct and indirect jmp to show how execution leaves its default sequential path."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 17: imul/mul, idiv/div, cqto, two reverse-engineering exercises, the program counter, instruction encoding, and unconditional jumps."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-assembly-control-flow)

An `addq` result still fits in one 64-bit register, but multiplying two 64-bit values can require 128 bits. Division is stranger still: the dividend spans `%rdx:%rax`, and the quotient and remainder return to those two registers. Stanford CS107 Lecture 17 first completes this family of ALU operations—one written operand with several implicit register effects—then asks a more fundamental question: how does the CPU know where the next instruction is?

The answer is `%rip`. Ordinarily it advances by the encoded length of the current instruction; at a `jmp`, it becomes the named target. This lecture deliberately stops at unconditional jumps. It does not yet introduce condition codes or conditional branches. Importing later flags, `cmp`/`test`, `jcc`, or function-call stack mechanics would obscure the basic model built here from instruction bytes.

## Materials, gaps, and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Term: Winter 2026
- Official lecture: Lecture 17, February 13, 2026
- Calendar title: Introduction to Control Flow Operations
- Slide title: Assembly: Arithmetic and Logic Wrap, Control Flow
- Instructor: the [complete PDF](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/17/Lecture17.pdf) metadata names Jerry Cain
- Assigned reading: Bryant and O'Hallaron, *Computer Systems: A Programmer's Perspective*, sections 3.5–3.6
- Materials read: the official calendar, all 19 slide pages, GNU assembler's AT&T/Intel syntax documentation, and the 2025 AMD64 System V ABI
- Material gaps: the Canvas recording and AFS lecture code are not public; the assigned textbook is not among the public materials and is not represented as read

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) says this lecture will finish ALU operations and introduce control flow and unconditional jumps. The [complete deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/17/Lecture17.pdf) proceeds through two- and one-operand multiplication; signed and unsigned division and remainder; `cqto`; the `div_and_mod` reverse-engineering exercise, whose answer page appears twice; the `tinker_toy` etude; instructions as bytes in memory; five snapshots tracing `%rip`; default advancement by instruction length; `jmp` replacing the program counter; reconstruction of an infinite loop from a backward jump; and finally direct versus indirect jumps.

The boundary matters. Slide 19 ends by asking how to jump conditionally and does not answer. Conditional control, condition codes, and loop translation belong to later material and are not supplied here. The listing contains `push %rbp` and depicts a stack region, but the lecture does not explain call frames, so this article does not turn the example into a stack-frame lesson.

## Multiplication has two shapes: truncate the result or retain all 128 bits

Lecture 16 introduced two-operand `imul S,D`:

```asm
imulq %rsi,%rax       # %rax = low64(%rax * %rsi)
```

It truncates the product to destination width and writes it back to the second operand. That form is direct when C needs only a machine-width result. A complete 64×64 product, however, can require 128 bits and cannot fit in one 64-bit register.

The one-operand form uses implicit registers:

```asm
imulq %rsi            # signed:   %rdx:%rax = %rax * %rsi
mulq  %rsi            # unsigned: %rdx:%rax = %rax * %rsi
```

The written operand supplies only the other factor; the first factor always comes from `%rax`. The low 64 product bits go to `%rax`, and the high 64 go to `%rdx`, together written `%rdx:%rax`. The colon means concatenation into one 128-bit quantity. It is neither memory-address syntax nor division of `%rdx` by `%rax`.

The low-half bit pattern from `imulq` and `mulq` can agree, while the high half differs according to signed or unsigned interpretation. If later code ignores `%rdx`, many inputs make the instructions appear interchangeable. Determining whether the program needs the full product requires tracing whether the high half remains live.

Instruction arity therefore cannot mean only “how many values participate.” One-operand multiply writes only `S` in the disassembly, yet implicitly reads `%rax` and overwrites both `%rax` and `%rdx`. Manual tracing and liveness analysis must record both hidden effects.

## Division prepares a 128-bit dividend and produces quotient and remainder together

`idivq S` performs signed division; `divq S` performs unsigned division. Both treat `%rdx:%rax` as a 128-bit dividend and the written 64-bit `S` as divisor:

```text
%rax = quotient
%rdx = remainder
```

It is therefore insufficient to place x in `%rax` and immediately divide. The high `%rdx` half is part of the dividend; stale bits from prior work would produce a different input. A signed 64-bit dividend commonly uses:

```asm
movq %rdi,%rax
cqto
idivq %rsi
```

`cqto` extends `%rax`'s sign bit across `%rdx`: a nonnegative value makes `%rdx` all zero, and a negative value makes it all one, so `%rdx:%rax` is the same signed value represented at 128 bits. It reads no memory and has no written operand.

Unsigned preparation differs. If the dividend is truly 64 bits, `%rdx` is normally cleared before `divq`. `cqto` cannot substitute, because an unsigned value with its top bit set is not negative, yet `cqto` would fill the high half with ones.

Both division forms must treat a zero divisor and a quotient that does not fit the destination as error conditions. The deck does not develop exception mechanics, so this article does not invent signal or operating-system behavior. The supported contract is narrower: prepare the dividend correctly, supply the divisor as the only written operand, and expect both `%rax` and `%rdx` to be overwritten.

## `div_and_mod`: preserve a pointer before an implicit output overwrites it

The deck provides:

```asm
div_and_mod:
    movq %rdi,%rax
    movq %rdx,%rcx
    cqto
    idivq %rsi
    movq %rdx,(%rcx)
    ret
```

Under the [AMD64 System V ABI](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build), the first three INTEGER-class arguments arrive in `%rdi`, `%rsi`, and `%rdx`. For `long div_and_mod(long x, long y, long *p_mod)`, `%rdx` initially holds `p_mod`, but `idivq` must also place its remainder in `%rdx`.

The second instruction copies the pointer to `%rcx` before it is lost. This is not a redundant move but a solution to a register-role collision. `cqto` immediately overwrites `%rdx` to prepare the dividend; `idivq` then writes the remainder there. After division, `movq %rdx,(%rcx)` can store through the saved pointer, while `%rax` already occupies the integer-return location.

Equivalent C is:

```c
long div_and_mod(long x, long y, long *p_mod) {
    long quotient = x / y;
    long remainder = x % y;
    *p_mod = remainder;
    return quotient;
}
```

Slides 4 and 5 repeat the same etude and answer; they are not two distinct examples. Complete coverage should record that duplication rather than invent another `div_and_mod` behavior to make the source appear larger.

## `tinker_toy`: argument width and address width can differ

The second etude is:

```asm
tinker_toy:
    movslq %edx,%rdx
    movl %edi,%eax
    addl (%rsi,%rdx,4),%eax
    ret
```

It corresponds to:

```c
int tinker_toy(int x, int arr[], int y) {
    int sum = x;
    sum += arr[y];
    return sum;
}
```

Because `x` and `y` are `int`, the meaningful argument portions are the low 32 bits `%edi` and `%edx`; `%eax` also backs `sum`. A memory address expression needs a 64-bit index, however, so the first instruction sign-extends `%edx` into `%rdx`. This is not a source-level assignment converting y to `long`; it prepares a wide temporary for address calculation.

The scale 4 in `(%rsi,%rdx,4)` agrees with `int` element width, and `addl` confirms a 32-bit load and sum. Reverse engineering combines evidence: the ABI locates arguments, suffixes establish operation widths, address scale supports element size, and `%eax`'s final value supports the return expression.

## Instructions are variable-length bytes stored in memory

The deck now shifts from data in memory to code in memory. Its listing is:

```asm
4004ed: 55                      push %rbp
4004ee: 48 89 e5                mov  %rsp,%rbp
4004f1: c7 45 fc 00 00 00 00    movl $0x0,-0x4(%rbp)
4004f8: 83 45 fc 01             addl $0x1,-0x4(%rbp)
4004fc: eb fa                   jmp  4004f8
```

The left column is each instruction's starting address, the middle is its encoded bytes, and the right is disassembly. x86-64 instructions are not fixed at four bytes: these occupy 1, 3, 7, 4, and 2 bytes. “Next instruction” cannot mean address plus one or a fixed plus four. The decoder must know the current instruction's length.

The listing again shows that a disassembler does not recover unique source. It decodes bytes into equivalent instruction syntax. The symbol `<loop+0xb>` comes from the address and available symbol information; a high-level `while`, local-variable name, and source formatting are absent from the instruction bytes.

## `%rip` holds the address of the next instruction

The x86-64 program counter is `%rip`. Across successive slides, it moves from `0x4004ed` to `0x4004ee`, `0x4004f1`, `0x4004f8`, and `0x4004fc`, exactly the starting addresses in the listing.

The default rule is:

```text
next_rip = current_instruction_address + encoded_instruction_length
```

This is the precise version of sequential execution. “Run the next line” is only a convenience supplied by disassembly layout. The CPU fetches bytes at an address, decodes their instruction length and meaning, then establishes the next `%rip`. Labels and comments inserted into a listing consume no runtime addresses.

The `movl` begins at `0x4004f1` and occupies seven bytes through `0x4004f7`, so its successor starts at `0x4004f8`. The four-byte `addl` makes the next `%rip` `0x4004fc`. Comparing address differences with byte counts is a basic way to detect misalignment or data incorrectly interpreted as code in an object dump.

The diagram divides main memory into stack, heap, data, and text regions to locate instruction bytes in code/text. It does not define a complete process memory map in this lecture. This article uses only the supported claim: code consists of addressable bytes, and `%rip` identifies the instruction to execute.

## `jmp` replaces the default next `%rip` with a target

At `0x4004fc`, bytes `eb fa` decode as:

```asm
jmp 0x4004f8
```

The default successor would be `0x4004fe`, but unconditional `jmp` directly makes `%rip = 0x4004f8`. The `addl` therefore executes and jumps back to itself indefinitely. The slides approximately reverse-compile this as:

```c
int n = 0;
while (true) n++;
```

That C captures the control structure and local increment; it does not claim unique source reconstruction. The assembly places n at `-0x4(%rbp)`, but its source name is gone. Nor should the short etude be stretched into unsupported conclusions about signed overflow under C language rules.

Two meanings of “advance” must stay separate. Normal completion sets `%rip` just after the current encoding. A jump selects a target, which may be a smaller address for a loopback or a larger address that skips code. “Unconditional” means no condition is checked; it does not mean the target must be backward.

## Direct and indirect jumps: encode the target or obtain it from an operand

The final slide divides `jmp` into:

```asm
jmp label       # direct
jmp *%rax       # indirect
```

A direct jump expresses its target in the instruction encoding, so disassembly can show a concrete destination or label. The example `jmp 4004f8` is direct and has the shape commonly used for a loopback or skipping a block.

An indirect jump obtains its target from a register or memory operand. `jmp *%rax` treats the current value in `%rax` as the next `%rip`. The [GNU assembler documentation comparing AT&T and Intel syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html) explains that AT&T prefixes absolute jump and call operands with `*`. The star is the dialect's indirect-control-transfer notation, not something that can be mechanically translated into a C dereference expression.

The slides only mention large `switch` statements and function pointers as motivations; they show no jump table or indirect call. A direct jump gives a fixed edge, while an indirect jump also requires tracing the target's data flow.

## Tracing

1. Identify one- versus two-operand multiplication.
2. Write down all implicit `%rax/%rdx` reads and writes.
3. Before division, inspect how `%rdx:%rax` is prepared; use `cqto` only for a signed dividend.
4. After division, label `%rax` quotient and `%rdx` remainder.
5. If `%rdx` was a live argument, find where it was preserved.

For control flow:

1. Use listing addresses to calculate instruction length.
2. Without a jump, `%rip` points to the next instruction.
3. At `jmp`, replace that default successor with the target.
4. Record a fixed edge for a direct jump; trace the target value for an indirect jump.
5. Reconstruct only loops or skips supported by those edges; do not assume an unseen condition.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 17: Arithmetic and Logic Wrap, Control Flow (PDF)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/17/Lecture17.pdf)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
- [System V Application Binary Interface: AMD64 Architecture Processor Supplement (PDF)](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)
