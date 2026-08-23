---
title: "Stanford CS107 Lecture 14: From C to x86-64, Reading Disassembly for the First Time"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, compiler]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 15
tldr: "CS107 Lecture 14 dissects the ten x86-64 instructions for sum_array: addresses and machine bytes appear on the left, AT&T assembly on the right, and the reader's job is to recover C-level effects from opcodes, operands, registers, and control flow—not to write assembly from scratch."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 14: the compilation pipeline, objdump, x86-64 registers, AT&T syntax, and reconstructing C from the disassembly of sum_array."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-assembly-x86-64)

To a processor, a C `for` loop no longer has variable names, an `int` type, or array syntax. It consists of bytes at addresses, values in registers, and jumps that change the location of the next instruction. Stanford CS107 Lecture 14 marks the course's transition from C's memory model to machine-level execution. It does not ask students to author assembly from a blank page. It teaches them to inspect compiler-generated x86-64 and identify which pieces collectively implement the original C.

This lecture establishes only the first layer of that reading skill. The disassembly of `sum_array` contains ten instructions. The slides first explain the columns in that output, then connect assembly to machine code, introduce the processor's sixteen general-purpose registers, and show how a compiler lowers high-level work into loading, operating, and storing. The official calendar also previews addressing modes, data widths, and variants of `mov`, but the public slides only begin those subjects here; Lecture 15 carries most of that detail forward.

## Materials, scope, and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Term: Winter 2026
- Official lecture: Lecture 14, February 6, 2026
- Official title: Introduction to Assembly and `x86-64`
- Slide title: Introduction to Assembly
- Instructor: the course materials list Jerry Cain; this PDF names no guest speaker
- Assigned reading: Bryant and O'Hallaron, *Computer Systems: A Programmer's Perspective*, sections 3.1–3.4
- Materials read: the official calendar, the complete Lecture 14 deck, GCC's output-stage documentation, GNU `objdump` documentation, and GNU assembler's comparison of AT&T and Intel syntax
- Material gaps: the Canvas recording, AFS lecture code, the executable used in the live demo, and starter repositories are not public; the assigned textbook is not among the public materials and is not presented here as a source read

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) opens Topic 5 with the question, “How does a computer interpret and execute C programs?” The [complete slide deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/14/Lecture14.pdf) proceeds through why CS107 reads assembly; the relationship among C, assembly, and machine code; inspecting an executable with `objdump -d`; labeling the function symbol, instruction addresses, raw bytes, opcodes, and operands in `sum_array`; recognizing immediates and registers; contrasting the C and assembly abstractions; and finally introducing the sixteen 64-bit x86-64 registers and the compiler's load-operate-store picture.

The calendar additionally previews the powerful `mov` instruction, addressing modes, data layout, and access to variables of different types. This deck only exposes their outlines through `mov` and one indexed-memory operand. This article interprets only what the example requires and leaves the systematic rules to Lecture 15. That is a boundary in the available lecture material, not a silently omitted agenda item.

## Three representations of one intent

The slides begin with a useful direction of travel:

```text
idea  →  C source  →  assembly  →  machine code
          human-written  compiler-generated  CPU-executed
```

C lets people express intent through named variables, types, functions, arrays, and control structures. Hardware does not directly consume those abstractions. A compiler selects instruction encodings, register assignments, and data layouts for a target architecture. Assembly is a textual representation of machine instructions that lets people read opcodes and operands; the processor still fetches encoded bytes.

These layers are not related by line-for-line substitution. One C statement may require several instructions, while one instruction may combine address calculation and memory access. A compiler can also reshape control flow, remove redundant work, or avoid giving a source variable one permanent storage location. Reading assembly therefore means recovering the state and effect maintained by a group of instructions, not mechanically replacing every instruction with one line of C.

The [GCC output-options documentation](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html) describes up to four ordered stages: preprocessing, compilation proper, assembly, and linking. `gcc` is a driver that coordinates them. Saying “GCC turns C into an executable” must not be mistaken to mean that no assembler, object file, or linker exists in between. You can stop early to inspect those representations:

```bash
gcc -E sum.c -o sum.i   # stop after preprocessing
gcc -S sum.c -o sum.s   # stop after compilation proper; preserve assembly
gcc -c sum.c -o sum.o   # create an object file without linking
gcc sum.c -o sum        # link an executable
```

Each artifact answers a different question. `sum.i` reveals expanded macros and included headers. `sum.s` reveals the compiler's textual instruction choices. `sum.o` contains machine code but can retain relocations and unresolved symbols for the linker. `sum` is the executable that the operating system can load. The lecture demo works backward from an executable because the course's action is reverse engineering, not preparing input for an assembler.

## `objdump -d` is not merely “ugly C”

According to the [GNU `objdump` documentation](https://sourceware.org/binutils/docs/binutils/objdump.html), `-d` or `--disassemble` prints assembler mnemonics for sections expected to contain instructions and can optionally begin at a named symbol. The slides run:

```bash
objdump -d sum
```

and focus on this output:

```asm
0000000000401136 <sum_array>:
  401136: b8 00 00 00 00        mov    $0x0,%eax
  40113b: ba 00 00 00 00        mov    $0x0,%edx
  401140: 39 f0                 cmp    %esi,%eax
  401142: 7d 0b                 jge    40114f <sum_array+0x19>
  401144: 48 63 c8              movslq %eax,%rcx
  401147: 03 14 8f              add    (%rdi,%rcx,4),%edx
  40114a: 83 c0 01              add    $0x1,%eax
  40114d: eb f1                 jmp    401140 <sum_array+0xa>
  40114f: 89 d0                 mov    %edx,%eax
  401151: c3                    retq
```

Do not begin by memorizing `movslq` or `jge`. From left to right, each line carries at least three kinds of information: an instruction address, machine-code bytes, and a textual assembly instruction. On the first line, `401136` is the memory address of the instruction, `b8 00 00 00 00` is the byte encoding decoded by the processor, and `mov $0x0,%eax` is the human-readable form. The next instruction begins at `40113b` because the previous encoding occupies five bytes.

This explains why addresses do not advance by a fixed four or eight bytes per line. x86-64 has variable-length instruction encodings. The example's `cmp` occupies two bytes, whereas its first `mov` occupies five. Addresses give branches concrete destinations and let debuggers, symbol tables, and disassemblers point to the same code. They are neither source line numbers nor array indexes.

`<sum_array>` is a symbol that helps a human recognize the function entry. `<sum_array+0x19>` displays a target as an offset from that entry. The name generally comes from symbol information retained in the executable; the CPU is not searching for a C identifier named `sum_array` while executing. The hardware follows addresses.

## Split each instruction into opcode and operands

The slides next label two basic parts. `mov`, `cmp`, `jge`, `add`, `jmp`, and `retq` are operation names—opcodes or mnemonics. The values after them are operands. An operand can denote a constant, register, memory location, or branch target. Recognize the shape before interpreting the semantics:

- `$0x0` and `$0x1`: the `$` prefix marks an immediate value encoded in the instruction.
- `%eax`, `%edx`, and `%esi`: the `%` prefix marks a register name, not C's remainder operator.
- `(%rdi,%rcx,4)`: a memory operand whose effective address combines a base, index, and scale.
- `40114f`: a control-flow target that can become the next instruction address.

These shapes belong to AT&T syntax. The [GNU assembler comparison of AT&T and Intel syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html) explains that AT&T prefixes immediates with `$`, prefixes registers with `%`, and usually orders a two-operand instruction as `source, destination`. Intel syntax normally reverses that order. Thus:

```asm
add $0x1,%eax
```

means “add the immediate value 1 to `%eax`,” not “write `%eax` into a constant.” If another disassembler prints `add eax, 1`, the processor has not acquired a different addition operation; the tool is displaying Intel syntax. The `objdump` documentation lists `-M att` and `-M intel` as display choices. Confirming the syntax before reading is more robust than memorizing the sides of a comma without context.

AT&T mnemonics often use a suffix for operand width: `b`, `w`, `l`, and `q` indicate 8-, 16-, 32-, and 64-bit work. The example does not print a suffix everywhere because register names can make the width unambiguous. `movslq` sign-extends a 32-bit long into a 64-bit quadword. This lecture only asks readers to recognize those clues; later lectures systematize the width rules.

## A register is not merely a faster variable name

The slides define a register as a fast read/write storage slot on the CPU and emphasize that it is not located in ordinary memory. The x86-64 general-purpose register names introduced here are:

```text
%rax  %rbx  %rcx  %rdx
%rsi  %rdi  %rbp  %rsp
%r8   %r9   %r10  %r11
%r12  %r13  %r14  %r15
```

Each full register listed is 64 bits, but narrower names address portions of the same hardware storage. The low 32 bits of `%rax` are `%eax`, and the low 32 bits of `%rdx` are `%edx`. That is why code running on x86-64 can contain many names beginning with `e`: `sum_array` computes C `int` values and does not need every arithmetic operation to be 64 bits wide.

Do not create a permanent one-to-one mapping between a C variable and a register. `%eax` behaves like `i` during the loop and receives the return value just before the function exits. That is register reuse. A different build, optimization level, or compiler release can assign different registers while preserving the same observable behavior. The stable evidence is the instruction dataflow: which operands are read, where a result is written, and which conditions redirect control flow.

Registers also serve more than ordinary arithmetic. The slides preview their use for passing function arguments and returning values, while names such as the stack pointer have conventional roles. Those behaviors arise from the architecture together with a calling convention. This lecture does not yet present the full function-call protocol. For now, `sum_array` provides two observations: its arguments are available through `%rdi` and `%esi` at entry, and its result is placed in `%eax` before return.

## Reconstructing `sum_array` from ten instructions

The original C is:

```c
int sum_array(int arr[], int nelems) {
    int sum = 0;
    for (int i = 0; i < nelems; i++) {
        sum += arr[i];
    }
    return sum;
}
```

The most effective way to read the disassembly is not to translate downward from its first line. Find the control-flow skeleton first. This example has a conditional `jge`, a backward `jmp`, and a final `retq`: a likely “check before entry, run the body, update an index, return to the check” loop. Then assign data roles to its parts.

### 1. Initialize two pieces of accumulated state

```asm
mov $0x0,%eax
mov $0x0,%edx
```

Both 32-bit registers are cleared. Their later uses identify the roles: `%eax` is incremented and compared with the bound, so it corresponds to `i`; `%edx` receives each array element, so it corresponds to `sum`. Those roles come from the use-definition chain. `eax` is not inherently an index register.

### 2. Check `i < nelems` before the body

```asm
cmp %esi,%eax
jge 40114f <sum_array+0x19>
```

With AT&T operand order, `cmp source,destination` establishes condition information corresponding to destination minus source. The following `jge` exits when `%eax >= %esi`. In other words, the body continues under the complementary condition `i < nelems`.

This is more precise than treating `cmp` as a function that returns a Boolean. Assembly creates no C `bool` variable here. The comparison updates processor condition state, and the adjacent conditional jump consumes that state. Lecture 14 does not yet enumerate the condition codes, so this article uses only the local control effect demonstrated by the pair.

### 3. Widen a 32-bit index for 64-bit address calculation

```asm
movslq %eax,%rcx
```

`i` is an `int`, so `%eax` holds a 32-bit value. x86-64 address calculation uses a 64-bit register. `movslq` sign-extends the signed 32-bit value into `%rcx`. In a valid loop-body execution, the index grows upward from zero, but its representation still has to be converted to the width needed for address calculation.

This line is a reminder that source-level width and type rules can become explicit instructions even when the C appears to do nothing. Conversely, some assignments visible in C can be merged by the compiler and leave no separately named trace.

### 4. Read an element with base + index × scale and accumulate it

```asm
add (%rdi,%rcx,4),%edx
```

This is the densest line in the example. `%rdi` holds the base address of `arr`, `%rcx` holds widened `i`, and the scale of `4` matches the byte width of an `int` in this environment. Parentheses make this a memory operand: the source is not the numeric address but the 32-bit element stored at that effective address. The total effect is to add `arr[i]` to `%edx`.

It also shows that assembly need not follow a textbook sequence of “calculate address, load, then add” as three separate lines. x86-64 allows some arithmetic instructions to read a memory operand directly. The later slide that describes loading x, loading y, adding, and storing is a conceptual model of processor data movement, not a promise that every compiler emits exactly four instructions.

### 5. Update the index and return to the condition

```asm
add $0x1,%eax
jmp 401140 <sum_array+0xa>
```

The first instruction implements `i++`; the second unconditionally returns to `cmp`. Machine code has no opcode named `for`. A loop emerges from comparison, conditional exit, body, increment, and backward jump. A `while` source loop could compile to the same shape, so reverse engineering usually recovers an equivalent loop, not the exact C keyword originally used.

### 6. Put the accumulator in the return register

```asm
mov %edx,%eax
retq
```

After the loop, the sum in `%edx` is copied into `%eax`, and control returns to the caller. This is further evidence that a register name is not a fixed variable name: `%eax` first holds the index, then the function result. If `nelems <= 0`, the first `jge` immediately reaches this block. `%edx` was initialized to zero, so the function returns zero, matching a C loop whose body never executes.

## C types disappear, but not without leaving evidence

The slides say that machine code has no variable names, types, or safety checks. Read that claim precisely. The CPU does not run a C type checker to verify that `%rdi` really is an `int *`; instructions operate on registers, flags, and memory according to their encodings. Yet source types still affect compiler choices: `int` leads to 32-bit operations, the element size leads to scale 4, and signed comparison and sign extension reflect how the compiler interpreted the source values.

Reverse engineering therefore gathers representation evidence rather than guessing types from nothing. An indexed address scale suggests an element width, but should be combined with load/store width, later arithmetic, extension instructions, and caller behavior. A four-byte stride may describe an `int`, a `float`, or a four-byte record. Assembly supplies constraints; it does not restore typedef names, field names, or programmer intent automatically.

Similarly, arrays and pointers often converge to a base address plus an offset at the machine-access level, but that does not erase every distinction they had in C. The compiler has already applied type checking and semantics such as `sizeof` at earlier stages. Disassembly shows the translated result. Saying that high-level names are absent from the output is not the same as saying that source types never affected the output.

**Use a state table instead of translating line by line.**

For an unfamiliar function, make four columns on paper: location, reads, writes, and tentative role. Applied to the first half of this example:

| Location | Reads | Writes | Tentative role |
|---|---|---|---|
| `401136` | immediate 0 | `%eax` | candidate index |
| `40113b` | immediate 0 | `%edx` | candidate accumulator |
| `401140` | `%esi`, `%eax` | condition state | boundary check |
| `401142` | condition state | program counter | exit edge |
| `401144` | `%eax` | `%rcx` | widened index |
| `401147` | `%rdi`, `%rcx`, memory, `%edx` | `%edx` | array accumulation |

Keep roles tentative until later evidence confirms them. Next, draw jump targets as basic blocks: two initialization instructions, a loop header, a loop body, and a return block. Only then rewrite the effect as readable C. This prevents two common mistakes: naming `%eax` `result` on sight, or translating `jge` into an isolated `if` without noticing that it and the backward jump form a loop.

You can reproduce the minimum workflow without the unpublished AFS code:

```bash
gcc -O1 -S sum.c -o sum.s
gcc -O1 sum.c -o sum
objdump -d sum
objdump -d --disassemble=sum_array sum
objdump -d -M intel --disassemble=sum_array sum
```

Your output may differ from the slides. Compiler version, optimization level, position-independent code, platform ABI, and executable format can all change instruction selection and addresses. That does not make the experiment a failure. Verify control effects inside one binary first, then compare AT&T and Intel display styles; this teaches more than trying to reproduce every slide byte.

**What this lecture deliberately leaves unfinished.**

Lecture 14 is an orientation map, not an x86-64 reference manual. It lists registers but does not fully teach subregister-write rules. It exposes function arguments and a return value but does not present the calling convention. It uses `cmp` and `jge` but does not define every flag. It shows a base-index-scale memory operand but does not systematize addressing modes. Later lectures develop each subject.

The slides also describe registers as very fast, typically accessible in a single clock cycle. That establishes intuition for the memory hierarchy; it should not be expanded into a fixed latency claim for every processor and dependency chain. The needed distinction at this point is location: the register file is on the processor, ordinary memory is accessed through addresses, and compiler-generated instructions move data and apply ALU operations to available operands.

Finally, `objdump` text is not the whole source of truth. A disassembler decodes bytes according to architecture and syntax settings; symbols, debug information, and section boundaries improve readability. Instructions can still be decoded without symbols, but function names become harder to recover. Treating data as code or selecting the wrong architecture can produce plausible-looking but incorrect mnemonics. Tool output must still be checked against executable structure and control flow.

## The skill this lecture actually establishes

The point is not to memorize sixteen register names. It is to change the unit in which you read a program. C organizes work around statements, variables, and types. Assembly organizes it around instructions, operands, registers, memory addresses, and control-flow edges. The two views do not align line by line, but they do align by observable effect.

For `sum_array`, locate the loop through `jge` and the backward `jmp`; identify the index through updates to `%eax`; identify the sum through accumulation into `%edx`; reconstruct array access from `(%rdi,%rcx,4)`; and finally detect the return value from `%eax`'s last role. The sequence scales to more complex compiler output: draw control flow first, trace dataflow second, and name roles last.

If you do only one exercise, compile five lines of C to both a `.s` file and an executable tonight, then inspect them with `gcc -S` and `objdump -d`. Annotate every instruction with “what it reads, what it writes, and where execution goes next” before looking up a complete C answer. High-level abstractions were not erased by magic; they were decomposed into another set of traceable machine-state transitions.

## References

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 14 slides: Introduction to Assembly](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/14/Lecture14.pdf)
- [GCC: Options Controlling the Kind of Output](https://gcc.gnu.org/onlinedocs/gcc/Overall-Options.html)
- [GNU Binutils: objdump](https://sourceware.org/binutils/docs/binutils/objdump.html)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
