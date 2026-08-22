---
title: "Stanford CS107 Lecture 15: Reading x86-64 Addressing Modes Without Confusing Addresses and Values"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, memory-addressing]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 16
tldr: "CS107 Lecture 15 decomposes x86-64 mov operands into immediate, register, absolute, indirect, displacement, indexed, and scaled-indexed forms, then unifies pointer dereference and array access with D + R[b] + R[i]×s."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 15: mov source/destination constraints, AT&T operand forms, the general address expression, and reconstructing C pointer and array expressions from assembly."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-assembly-addressing-modes)

`mov $0x42,%rax` and `mov 0x42,%rax` differ by one `$`, yet do completely different work. The first puts the number `0x42` in a register; the second reads a value from memory address `0x42`. Stanford CS107 Lecture 15 begins with this easy-to-miss distinction and turns x86-64 addressing modes into one expression that can be calculated.

The point is not to memorize seven arrangements of punctuation. For every operand, ask two questions: does it produce a value or an address? If it produces an address, does the instruction use the address itself or the contents stored there? Once those questions become routine, `(%rdi,%rcx,8)` stops looking like punctuation and starts looking like C's `arr[index]`.

## Materials, scope, and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Term: Winter 2026
- Official lecture: Lecture 15, February 9, 2026
- Official title: Introduction to Assembly and `x86-64`, Take II
- Slide title: Introduction to Assembly, Take II
- Instructor: the course materials list Jerry Cain; the PDF names no guest speaker
- Assigned reading: Bryant and O'Hallaron, *Computer Systems: A Programmer's Perspective*, sections 3.1–3.4
- Materials read: the official calendar, the complete Lecture 15 deck, GCC's output-stage documentation, GNU `objdump` documentation, and GNU assembler's AT&T/Intel syntax comparison
- Material gaps: the Canvas recording, AFS lecture code, and starter repositories are not public; the assigned textbook is not among the public materials and is not represented as a source read

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) says the class will finish generics before introducing x86-64. The [complete slide deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/15/Lecture15.pdf), however, is entirely about assembly. Its agenda is `mov src,dst` constraints; immediate, register, and absolute-address operands; indirect, base-plus-displacement, indexed, and scaled-indexed forms; the general address expression; four operand-tracing exercises; another look at `sum_array`; reconstruction of C from assembly; three etudes; and a final preview that swaps the values addressed by two pointers.

The public deck contains no generics pages, so there are no public details with which to reconstruct the calendar's “catchup.” This article does not invent that classroom discussion. It covers the `mov` and addressing-mode material supported by the slides.

## `mov src,dst`: copy bytes; do not move an object away

The slides define `mov` as copying bytes from one location to another. It resembles C assignment, but AT&T syntax orders its arguments as source, destination:

```asm
mov source,destination
```

The [GNU assembler documentation comparing AT&T and Intel syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html) confirms this order and explains the `%` prefix on AT&T registers and `$` prefix on immediates. Intel syntax normally uses destination, source instead, so identify the dialect before interpreting the comma.

The source can be an immediate, a register, or memory. The destination can be a register or memory, but never an immediate. One ordinary `mov` can contain at most one memory operand; x86-64 does not provide an arbitrary memory-to-memory move:

```asm
mov %rbx,%rcx       # register → register
mov (%rbx),%rcx     # memory → register
mov %rcx,(%rbx)     # register → memory
```

The first two instructions both write `%rcx`, but read from different places. The third stores the bits from `%rcx` at the memory address held in `%rbx`. `mov` copies; it does not clear the source, just as C's `x = y` does not empty `y`.

Copying or swapping between memory locations therefore commonly uses registers as temporaries. The lecture's final swap preview first loads `*xp` and `*yp` into registers and only then stores them in the opposite locations.

## The three basic operands: immediate, register, and absolute memory

### An immediate is a constant inside the instruction

```asm
mov $0x104,%rax
```

`$0x104` denotes the number itself. After execution, `%rax == 0x104`; the instruction does not read the contents of address `0x104`. An immediate can be a source but not a destination because a constant is not a writable storage location.

### A register operand accesses the register file

```asm
mov %rbx,%rcx
```

This copies the value in `%rbx` to `%rcx`. Neither operand has parentheses, so these operands do not access ordinary memory. Even if `%rbx` happens to contain a valid pointer, this instruction copies the pointer value without dereferencing it.

### A bare number without `$` can denote absolute memory

```asm
mov 0x104,%rax
```

Here `0x104` is a memory location. The instruction reads from address `0x104` into `%rax`. Reversing the operands, `mov %rax,0x104`, stores there. This is the opening distinction: `$0x42` is the value 66, whereas `0x42` is address 66.

The first exercise states that address `0x42` contains 5 and `%rbx` contains 8:

```asm
mov $0x42,%rax   # %rax = 0x42
mov 0x42,%rax    # %rax = 5
mov %rbx,0x55    # memory[0x55] = 8
```

Marking each operand I (immediate), R (register), or M (memory) before copying helps prevent hexadecimal notation from obscuring its role.

## Parentheses mean indirect access through a register-held address

```asm
mov (%rbx),%rax
mov %rax,(%rbx)
```

`%rbx` means the value in the register. `(%rbx)` treats that value as an address and accesses the memory it identifies. If `%rbx` corresponds to C variable `ptr`, the first instruction resembles `x = *ptr`; the second resembles `*ptr = x`.

Parentheses do not mean “take the address.” C's `&x` produces an address; parentheses in this assembly operand cause a memory access after the effective address has been calculated. Expand `(%rbx)` into two steps:

```text
address = R[%rbx]
operand = memory[address]
```

That distinction supports every later addressing mode. The components inside parentheses calculate an address; the parenthesized operand denotes contents at that address.

## Base plus displacement: the shape behind fixed offsets

```asm
mov 0x10(%rax),%rcx
```

The effective address is `R[%rax] + 0x10`, and the instruction loads from that location. `mov %rcx,0x10(%rax)` stores at the same location. A displacement may be positive or negative; when omitted, it contributes zero.

If `%rax` holds the base of an object or array, a fixed displacement can correspond to a field offset, constant index, or stack-frame location. Yet `0x10(%rax)` alone does not prove that the source used a struct field. Assembly establishes “access at base plus 16 bytes”; surrounding evidence must recover the higher-level name.

## Indexed addressing: two registers form an address

```asm
mov (%rax,%rdx),%rcx
mov 0x10(%rbx,%rdx),%rcx
```

The first address is `R[%rax] + R[%rdx]`; the second adds displacement `0x10`. The slides summarize `Imm(rb,ri)` as:

```text
address = Imm + R[rb] + R[ri]
```

“Base” and “index” describe positions in an address expression, not guaranteed source-level variable names. Both contribute register values to the addition; the names also correspond to encoding roles and extend naturally to the scaled form.

One exercise gives `%rax = 0x100`, `%rdx = 0x3`, memory `0x104 = 0xAB`, and memory `0x10C = 0x11`:

```asm
mov $0x42,(%rax)          # memory[0x100] = 0x42
mov 4(%rax),%rcx          # %rcx = memory[0x104] = 0xAB
mov 9(%rax,%rdx),%rcx     # address = 9 + 0x100 + 3 = 0x10C; %rcx = 0x11
```

The third line tests the full distinction. `9` is a displacement, not a memory value. Add both register values first; dereference only after obtaining the effective address.

## Scaled indexed addressing: the characteristic array form

```asm
mov (%rcx,%rax,8),%rdx
mov %rdx,(%rdi,%rsi,4)
```

The first loads from `R[%rcx] + R[%rax] * 8`; the second stores `%rdx` at `R[%rdi] + R[%rsi] * 4`. The scale must be 1, 2, 4, or 8 and defaults to 1. These values suit common element widths: a `char` occupies one byte, a four-byte `int` uses 4, and an eight-byte `long` or pointer uses 8.

The scale is not a type label. A scale of 8 says that the index is multiplied by 8 and is compatible with eight-byte elements; instruction width, neighboring operations, and caller behavior must support a stronger type inference. Compilers can also use the address hardware for arithmetic that is not an array access.

The slides unify all forms as:

```text
D(rb,ri,s)
effective address = D + R[rb] + R[ri] * s
```

`D`, base, and index can be omitted. A missing displacement or register contribution is zero; a missing scale is 1. Apply it to the practice instruction:

```asm
mov $0x42,0xfc(,%rcx,4)
```

If `%rcx = 1`, the address is `0xfc + 1 * 4 = 0x100`, so the instruction stores immediate `0x42` in memory at `0x100`. The empty base position is valid syntax and contributes zero.

```asm
mov (%rax,%rdx,4),%rbx
```

If `%rax = 0x100` and `%rdx = 3`, the address is `0x10C`. Given memory there contains `0x11`, `%rbx` receives `0x11`. Keep effective address separate from loaded value; `%rbx` does not receive `0x10C`.

## Revisiting `sum_array`: scale 4 reconnects pointer arithmetic to C

This lecture revisits a slightly different build of `sum_array`:

```asm
mov    $0x0,%edx
mov    $0x0,%eax
jmp    4005cb
movslq %edx,%rcx
add    (%rdi,%rcx,4),%eax
add    $0x1,%edx
cmp    %esi,%edx
jl     4005c2
repz retq
```

Here `%edx` is the index and `%eax` the sum, reversing their roles in Lecture 14's listing. Register names are not source-variable identities. The reliable evidence is that `%edx` is incremented and compared with `%esi`, while `%eax` accumulates a memory element.

Expand `(%rdi,%rcx,4)` as `R[%rdi] + R[%rcx] * 4`. If `%rdi` is the base of `arr`, `%rcx` is the widened index, and an `int` occupies four bytes, this calculates `&arr[i]`. Because it is a memory source to `add`, the instruction consumes `arr[i]`, not merely its address. Address calculation and dereference must be read together.

The slides also remind us that instructions execute sequentially unless a jump changes the program counter. Addressing modes explain where data comes from; `jmp`, `jl`, and `cmp` explain when work repeats. Both are necessary to reconstruct the loop.

## From assembly back to C: several sources can be equivalent

The slides give four basic correspondences:

```asm
mov $0x0,%rdx             # long y = 0;
mov %rdx,%rcx             # long offset = y;
mov $0x42,(%rdi)          # arr[0] = 66;
mov (%rdi,%rcx,8),%rax    # long w = arr[offset];
```

These are plausible C, not uniquely recoverable source. The last can also be written `long w = *(arr + offset)`. Array indexing compiles through pointer arithmetic and dereference, so reverse engineering recovers effects but often cannot determine whether the programmer wrote `[]` or `*()`.

Extra Practice 1 puts `x` in `%ecx` and `ptr` in `%rax`:

```asm
mov %ecx,(%rax)
```

The corresponding effect is `*ptr = x`. Missing the parentheses would incorrectly suggest changing the pointer variable itself.

Extra Practice 2 provides `long *arr` in `%rdi` and the value 3 in `%rcx`:

```asm
mov (%rdi,%rcx,8),%rax
```

Plausible answers include `long num = arr[3]`, `long num = *(arr + 3)`, or `arr[y]` if an earlier `long y = 3` exists. Assembly retains current values and computation, not the original variable name.

Extra Practice 3 uses `movb`:

```asm
movb $0x63,(%rcx,%rdx,1)
```

If `%rcx` is `char *str` and `%rdx` is `i`, scale 1 and a byte-width store support `str[i] = 'c'`. `0x63` encodes ASCII `c`. The conclusion combines the immediate, effective address, instruction width, and supplied source context rather than relying on one symbol alone.

## Swap preview: four `mov` instructions show load and store direction

The final `foo` receives two `long *` values in `%rdi` and `%rsi`:

```asm
mov (%rdi),%rax
mov (%rsi),%rdx
mov %rdx,(%rdi)
mov %rax,(%rsi)
```

The first two instructions load old values into temporary registers; the last two store them crosswise. Equivalent C is:

```c
void foo(long *xp, long *yp) {
    long a = *xp;
    long b = *yp;
    *xp = b;
    *yp = a;
}
```

The ordering matters. Writing `*yp` directly into `*xp` without preserving old `*xp` destroys a value needed to finish the swap. Beyond the lack of an arbitrary memory-to-memory `mov`, the dataflow itself requires both old values to survive until the stores.

## A reliable solving order

For any operand, use four steps:

1. Identify AT&T or Intel syntax and mark source and destination.
2. Use `$`, `%`, and parentheses to classify immediate, register, and memory operands.
3. For memory, calculate `D + base + index × scale` and write down the effective address.
4. Perform the load or store in the instruction's direction, respecting the width implied by the mnemonic or registers.

Do not collapse `mov 9(%rax,%rdx),%rcx` into mental arithmetic. Write `EA = 9 + R[%rax] + R[%rdx]`, then `%rcx = memory[EA]`. Two lines take longer but keep address and value separate and reveal whether a wrong answer came from address arithmetic or dereferencing.

The [GNU `objdump` documentation](https://sourceware.org/binutils/docs/binutils/objdump.html) explains that `-d` displays assembler mnemonics for machine instructions and that x86 output can select `-M intel` or `-M att`. [GCC's output options](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html) let `-S` preserve compiler-generated assembly. Displaying one short C expression in both syntaxes is a direct exercise in holding semantics constant while notation changes.

Lecture 15 reduces to one sentence: components inside parentheses calculate an address; the entire parenthesized operand accesses memory at that address. Combine that with `$` for immediates, `%` for registers, and source-first AT&T order, and dense punctuation becomes checkable pointer arithmetic.

## References

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 15 slides: Introduction to Assembly, Take II](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/15/Lecture15.pdf)
- [GCC: Options Controlling the Kind of Output](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)
- [GNU Binutils: objdump](https://sourceware.org/binutils/docs/binutils/objdump.html)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
