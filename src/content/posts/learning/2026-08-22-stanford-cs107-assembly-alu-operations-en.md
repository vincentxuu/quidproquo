---
title: "Stanford CS107 Lecture 16: From Subregisters to x86-64 Arithmetic and Logic"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, alu]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 17
tldr: "CS107 Lecture 16 connects b/w/l/q data widths, subregisters, movs/movz, lea, calling conventions, arithmetic and logic, and shifts through one method: establish operand width before tracing sources, destinations, and real memory accesses."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 16: x86-64 widths, subregisters, sign and zero extension, lea, special-purpose registers, ALU operations, and shifts."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-assembly-alu-operations)

The same `%rax` storage can be named `%eax`, `%ax`, or `%al`. The same short bit pattern can also become very different 64-bit values after zero extension and sign extension. Stanford CS107 Lecture 16 is not merely another mnemonic list. It adds two dimensions to the previous lecture's addressing modes: **how many bytes this operation touches, and how the ALU interprets and rewrites those bits.**

For every instruction, ask four questions in order: what is the operand width, where is the source, where is the destination, and does a parenthesized expression merely calculate an address or actually dereference it? That procedure explains `movzbl`, `leaq`, `addq`, and `sar` without treating the names of subregisters as independent storage.

## Materials, gaps, and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Term: Winter 2026
- Official lecture: Lecture 16, February 11, 2026
- Calendar title: Introduction to ALU Operations
- Slide title: Assembly: Arithmetic and Logic Operations
- Instructor: the [complete PDF](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/16/Lecture16.pdf) metadata names Jerry Cain
- Assigned reading: Bryant and O'Hallaron, *Computer Systems: A Programmer's Perspective*, sections 3.5–3.6
- Materials read: the official calendar, all 14 slide pages, GNU assembler's AT&T/Intel syntax documentation, and the 2025 AMD64 System V ABI
- Material gaps: the Canvas recording and AFS lecture code are not public; the assigned textbook is not among the public materials and is not represented as read

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) places this lecture after assembly addressing modes and before control flow. The complete slide agenda is data-size names and `b/w/l/q` suffixes; registers and subregisters; partial-width writes; `movz` and `movs`; exhaustive extension tables; another look at `movslq` in `sum_array`; `lea` versus `mov`; special-purpose registers; the `dolores_park` reverse-engineering etude; unary and binary arithmetic and logic; and finally logical and arithmetic shifts plus the `%cl` restriction.

The public deck contains no classroom narration, live questions, or extra code, so this article does not reconstruct them. One source defect should also be explicit: slide 5 repeats `movzwq` as a sign-extension example. The complete `movs` table on the following slide and the mnemonic rule establish that signed 16-to-64 extension is `movswq`. This article follows that table rather than reproducing the typo.

## `b/w/l/q`: the instruction suffix establishes how much data is touched

x86 retains historical names: a byte is one byte, a word two, a double word four, and a quad word eight. AT&T syntax encodes those widths in mnemonic suffixes: `b`, `w`, `l`, and `q` identify 8-, 16-, 32-, and 64-bit operations.

```asm
movb $0x41,%al
subb $1,(%rax)
xorw %dx,%dx
leaq (%rdi,%rsi,8),%rax
pushq %rbp
```

The [GNU assembler comparison of AT&T and Intel syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html) likewise states that AT&T's final mnemonic character determines memory-operand size, whereas Intel syntax commonly uses prefixes such as `byte ptr` and `dword ptr`. The dialect differs; the processor operation does not.

A suffix can sometimes be omitted because a register name already fixes the width. `%al` is one byte and `%edx` is 32 bits. By contrast, the destination of `movq $5,8(%rsp)` is only a memory address expression. An address does not say how many bytes to write, so the suffix is required. Address width and data width are separate: the use of 64-bit `%rsp` does not prove that `8(%rsp)` stores eight bytes.

This yields a useful review action. When an immediate is written to memory, locate the suffix first. No register operand can infer the size, so omitting or misreading it either prevents assembly or makes a reader trace the wrong neighboring bytes.

## Subregisters are views into the same storage

`%rax` names all 64 bits, `%eax` the low 32, `%ax` the low 16, and `%al` the low 8. The same pattern applies to `%rbx/%ebx/%bx/%bl`, `%rcx/%ecx/%cx/%cl`, and `%rdx/%edx/%dx/%dl`; the other general-purpose registers also expose 64-, 32-, 16-, and 8-bit names.

These are not four independent registers. Suppose `%rax` initially contains `0x1122334455667788`:

```asm
movb $0xff,%al
```

Only the lowest byte is replaced, producing `0x11223344556677ff`. Writing `%ax` changes the lowest two bytes. Writing `%eax` invokes a special x86-64 rule: a 32-bit register write clears the upper 32 bits of the corresponding 64-bit register. Therefore:

```asm
movl $0xaabbccdd,%eax
```

makes `%rax` equal `0x00000000aabbccdd`, not `0x11223344aabbccdd`. Compilers can use a 32-bit instruction to produce a clean unsigned 64-bit result. Conversely, once `%eax` is written, a reverse engineer must discard any assumption about the old upper half of `%rax`.

## `movz` and `movs`: widening requires a rule for the new high bits

Copying an 8- or 16-bit source into a wider destination cannot leave the new high bits unspecified. `movz` fills them with zero, matching an unsigned interpretation. `movs` replicates the source's most significant bit, matching a two's-complement signed interpretation.

```asm
movzbl %al,%eax       # byte → 32-bit, zero-extend
movzwq (%rdi),%rax    # 16-bit → 64-bit, zero-extend
movsbl %al,%eax       # byte → 32-bit, sign-extend
movswq (%rdi),%rax    # 16-bit → 64-bit, sign-extend
```

If `%al == 0xff`, `movzbl` produces `0x000000ff`, or 255. `movsbl` produces `0xffffffff`, which is -1 as a signed 32-bit value. The original eight bits are identical; the distinction lies in the rule used to create the high bits.

The mnemonic encodes both widths: `movzbl` means zero-extend byte-to-long, and `movswq` means sign-extend word-to-quad. The complete zero-extension set shown is `movzbw`, `movzbl`, `movzwl`, `movzbq`, and `movzwq`. The sign-extension set is `movsbw`, `movsbl`, `movswl`, `movsbq`, `movswq`, and `movslq`. The source must be memory or a register; the destination must be a register.

`cltq` is a dedicated in-place form that sign-extends the signed 32-bit value in `%eax` into `%rax`. The slides preview its use in preparing a dividend for signed division. The complete division sequence belongs to a later lecture; this one establishes why a narrow signed value must first occupy the wider representation correctly.

## `sum_array`: `movslq` bridges an index into a 64-bit address expression

The slides revisit `sum_array`:

```asm
mov    $0x0,%eax
mov    $0x0,%edx
cmp    %esi,%eax
jge    done
movslq %eax,%rcx
add    (%rdi,%rcx,4),%edx
add    $0x1,%eax
jmp    loop
```

`%eax` holds `int i`, but an x86-64 memory operand forms its base and index with 64-bit registers. `movslq %eax,%rcx` widens the signed index first. Then `(%rdi,%rcx,4)` computes `arr + i * 4`, reads an `int`, and `add` accumulates it in `%edx`.

This should not be dismissed as a compiler's unnecessary move. Incorrectly zero-extending a negative index would turn `-1` into a huge positive offset; sign extension preserves the signed numeric value. Valid C should not use a negative index for this array read, but the assembly must still represent the source-level signed calculation faithfully.

## `lea` delivers an effective address without reading from it

`lea src,dst` uses a memory-shaped source and requires a register destination. It places the effective-address calculation in the destination without dereferencing it:

```asm
leaq 8(%rsp),%rax
leaq (%rdi,%rsi),%rax
leaq 16(%rdi,%rsi,4),%rax
leaq -0x20(%rbp,%rcx,8),%r10
```

The first computes `%rsp + 8`; the last computes `%rbp + 8 * %rcx - 32`. The result need not even be a valid memory address when `lea` is used as arithmetic, because no memory is read.

The contrast makes the rule concrete:

```asm
movslq 4(%rsi,%rcx,8),%rbx
leaq   4(%rsi,%rcx,8),%rbx
```

The first calculates an address, reads four bytes there, and sign-extends them. The second places `%rsi + 8 * %rcx + 4` in `%rbx`. Given `struct fract { int num; int denom; };`, the former might implement the value `fractions[i].denom`; the latter might implement `&fractions[i].denom`. Parentheses alone do not guarantee a memory access. The instruction decides whether dereferencing occurs.

Compilers also use `lea` as a constrained but convenient adder. `leaq (%rsi,%rdx,2),%rax` computes `x + 2*y` in one instruction. This is not an abuse: effective-address hardware already supports addition and scales 1, 2, 4, and 8, while `lea` explicitly requests the result without memory access.

## Special-purpose register roles come from an execution contract, not a hardware type

The slides list familiar roles: `%rax` typically carries an integer return value; `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, and `%r9` carry the first six integer or pointer parameters; further parameters normally move to the stack; `%rip` identifies the next instruction; and `%rsp` points to the current stack top.

Most parameter roles are ABI contracts. The parameter-passing section of the [AMD64 System V ABI](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build) explicitly assigns INTEGER-class arguments through `%rdi` to `%r9`, while its return-value section chooses registers according to return classification. `%rdi` is not physically typed as a first-argument register; conforming callers and callees agree to use it that way.

`%rip` and `%rsp` are tied more directly to instruction execution and stack discipline, but reverse engineering still should not over-name registers. A function can later reuse a caller-saved register for a temporary. Parameter and return interpretations are strongest at the corresponding procedure and ABI boundaries.

## `dolores_park`: record each effect before reconstructing two lines of C

The slides provide:

```asm
dolores_park:
    leaq (%rsi,%rdx,2),%rax
    movq %rax,(%rdi)
    movq (%rdi,%rsi,8),%rax
    subq %rdx,%rax
    ret
```

The ABI places the three parameters in `%rdi/%rsi/%rdx`. With signature `long dolores_park(long arr[], long x, long y)`, the first instruction computes `x + 2*y`, and the second stores it in `arr[0]`. The third loads `arr[x]` into the return register, and the fourth subtracts `y`. Equivalent C is:

```c
long dolores_park(long arr[], long x, long y) {
    arr[0] = x + 2 * y;
    return arr[x] - y;
}
```

Order matters. The function writes `arr[0]` before reading `arr[x]`. If `x == 0`, the return expression sees the newly stored value. Reversing the two C statements might pass many tests but is not equivalent. Reverse engineering must preserve the temporal order of side effects as well as recognize expressions.

## Unary and binary ALU operations: the second operand is also the destination

Four unary instructions accept one register or memory destination: `inc D` computes `D+1`, `dec D` computes `D-1`, `neg D` performs two's-complement negation, and `not D` complements every bit.

```asm
incq %rax
decq 8(%rsi)
negq (%rbx,%rcx,8)
notw %dx
```

Binary forms retain AT&T source,destination order. `add S,D`, `sub S,D`, `imul S,D`, `xor S,D`, `or S,D`, and `and S,D` overwrite the second operand. The source may be an immediate, and at most one operand may be memory.

```asm
addq %rsi,%rax
subq %rax,8(%rdi)
imulq $4,(%rsi,%rdx,8)
xorl %eax,%eax
orq $1,%rax
andq $-8,%rsp
```

`xorl %eax,%eax` uses `x ^ x == 0`, then benefits from the 32-bit-write rule to clear all of `%rax`. `orq $1,%rax` sets the lowest bit. Under a two's-complement mask, `andq $-8,%rsp` clears the lowest three bits and can round the stack pointer down to an eight-byte boundary.

That final example also distinguishes effect from intent. The instruction guarantees masking. “Alignment” is a higher-level interpretation supported by the operand, constant, and surrounding context.

## Shifts: left shift agrees, but right shift needs a signed or unsigned story

A shift has amount `k` and modified operand `D`. `sal` and `shl` both shift left and fill low bits with zero. `shr` is logical right shift and fills high bits with zero. `sar` is arithmetic right shift and replicates the sign bit.

```asm
shlq $1,%rax
shrq $2,%rbx
sarq $5,%rcx
sarq $3,8(%rdi)
```

Without overflow, a one-bit left shift can correspond to multiplication by two. `shr $2` can correspond to unsigned division by four. `sar $5` often has the shape of signed division by 32, but negative rounding and source-language rules may require a larger compiler sequence. One shift must not be translated unconditionally into `/`.

When the amount is not an immediate, x86 requires `%cl`, not an arbitrary register:

```asm
movq %rsi,%rcx
shlq %cl,%rax
```

The shift reads `%cl` and masks the count for destination width. In the slides' `%cl = 0xff` example, `shlb` shifts by 7 and `shlw` by 15.

## Trace

1. Establish width from the suffix or register.
2. Map a subregister to its portion of the full register, marking the special zeroing effect of a 32-bit write.
3. Classify immediate, register, and memory operands; calculate any effective address first.
4. Decide whether the instruction reads memory like `mov` or only retains an address like `lea`.
5. When width grows, mark zero or signed extension.
6. For a binary ALU form, calculate `D op S` and write it back to the second operand.
7. For a shift, distinguish `sar` from `shr` and check whether the count is immediate or `%cl`.
8. Only then use the ABI and neighboring instructions to name semantics.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 16: Assembly — Arithmetic and Logic Operations (PDF)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/16/Lecture16.pdf)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
- [System V Application Binary Interface: AMD64 Architecture Processor Supplement (PDF)](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)
