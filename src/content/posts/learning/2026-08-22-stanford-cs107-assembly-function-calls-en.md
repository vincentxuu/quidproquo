---
title: "Stanford CS107 Lecture 19: Understanding x86-64 Function Calls and Calling Conventions"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, calling-convention]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 20
tldr: "CS107 Lecture 19 traces %rsp, push/pop, call/ret, parameters, return values, stack locals, and caller/callee register discipline to build the ABI contract that preserves data and control across functions."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 19: the stack pointer, push/pop, call/ret, function pointers, parameter passing, local storage, and register-saving conventions."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-assembly-function-calls)

A function call is not merely a jump to another label. The caller must make parameters available, preserve the instruction address at which execution should resume, provide necessary stack space, and ensure that neither side destroys registers whose values remain live. Across 57 incrementally animated slides, Stanford CS107 Lecture 19 reduces those jobs to `call`, `ret`, `%rsp`, and a calling convention.

The contract enables separate compilation. A caller need not understand every callee instruction. If both obey the same ABI, they can exchange data, restore control, and know which registers may change.

## Materials, gaps, and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Term: Winter 2026
- Official lecture: Lecture 19, February 20, 2026
- Calendar title: Introduction to Function Call and Return
- Slide title: Assembly: Function Call
- Instructor: the [complete PDF](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/19/Lecture19.pdf) metadata names Jerry Cain
- Assigned reading: Bryant and O'Hallaron, *Computer Systems: A Programmer's Perspective*, section 3.7
- Materials read: the official calendar, all 57 slide pages, GNU assembler's AT&T/Intel syntax documentation, and the 2025 AMD64 System V ABI
- Material gaps: the Canvas recording, AFS lecture code, and the `rfact.c`/`rfact` demo named on slide 56 are not public; this article does not invent the recursion trace

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) identifies function call and return as the topic. The [complete deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/19/Lecture19.pdf) covers transfer control/pass data/manage memory; five animation pages for `%rsp` and stack growth; `pushq/popq` effects, expansions, and an etude; five return-address animation pages; `call/ret`; function pointers; six register parameters and stack parameters; four reasons for local storage plus `swap_add`; a 20-page trace of an eight-argument `func`; register interference; relative caller/callee roles; two register-ownership groups; nested calls; a recursion-demo prompt; and a final `sum_array` synthesis.

The lecture does not cover heap allocation or Lecture 20's privacy topic. Although the memory diagram includes heap, data, and text, this article uses only the stack and code/control-flow material actually explained here.

## `%rsp` identifies the active stack top, and calls must restore balance

The deck draws the stack toward lower addresses. When `foo` calls `bar`, the newer frame appears below the older one and `%rsp` decreases. “Top” means the newest allocated location, not the top edge of the page.

The central invariant is that after a normal return, the caller must observe `%rsp` at its pre-call position. A callee can temporarily lower it for a frame and nested calls can lower it further, but its changes must be undone before exit. Otherwise the caller interprets locals, stack arguments, and the return address at wrong offsets.

A stack frame has no mandatory visual template. If all locals fit in registers and no extra alignment is needed, a compiler may allocate none. Trace actual `%rsp` arithmetic instead of assuming a `%rbp` prologue.

## `pushq` and `popq`: ordering the pointer movement and memory access matters

`pushq S` means:

```text
%rsp = %rsp - 8
memory[%rsp] = S
```

Equivalent instructions are:

```asm
subq $8,%rsp
movq S,(%rsp)
```

`popq D` reads the current top before moving upward:

```text
D = memory[%rsp]
%rsp = %rsp + 8
```

It expands to `movq (%rsp),D; addq $8,%rsp`. Pop does not erase old bytes; it only marks the slot inactive and available for overwrite.

The etude begins with `%rax=0x123`, `%rdx=0`, and `%rsp=0x108`. `pushq %rax` first changes `%rsp` to `0x100` and stores `0x123` there. `popq %rdx` loads `0x123` and restores `%rsp` to `0x108`. This is a minimal proof of stack balance.

## `call` stores a return address; `ret` restores `%rip` from it

If main simply replaces `%rip` to enter foo, it loses where to return. `call target` pushes the address immediately following the call and sets `%rip` to the callee. `ret` pops eight bytes from the stack into `%rip`, resuming at the caller's successor.

```asm
call label       # direct call
call *%rax       # indirect call
ret
```

The [GNU assembler comparison of AT&T and Intel syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html) explains that AT&T prefixes absolute jump/call operands with `*`, so `call *%rax` obtains its target from a register. A function pointer, such as a comparator passed to `qsort`, lets the callee be chosen at runtime.

Return address and return value are distinct. The former is a code address pushed by `call` and restored to `%rip` by `ret`. The latter is computed data, often placed in `%rax` or a subregister. `ret` does not calculate the function's result.

The animation moves `%rsp` from `0xff20` to `0xff18`, stores return address `0x3026`, and enters foo; foo's frame can lower `%rsp` further. Frame teardown and `ret` recover `0x3026`, then restore the caller's stack position. The particular addresses illustrate a trace; push/transfer and pop/resume are the invariant operations.

## Parameters and return values occupy ABI-defined locations

The parameter-passing rules in the [AMD64 System V ABI](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build) place the first six INTEGER-class arguments in `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, and `%r9`. Arguments not assigned registers enter the stack argument area. Return locations depend on type classification; ordinary integer and pointer results commonly use `%rax`.

“The seventh argument is at `%rsp`” is too vague. `call` itself pushes a return address, alignment must be maintained, and the actual callee-entry offset follows the ABI layout. Use stores and `%rsp` state before and after call as evidence instead of memorizing a time-independent offset.

An argument register guarantees an entry location only at the call boundary. The callee can immediately move, overwrite, or reuse it. Reverse engineering must follow data flow rather than permanently naming `%rdi` after the first source variable.

## Why locals sometimes require stack storage

The deck gives four reasons: registers run out; live values need protection across a call; applying `&` requires a real address; or an array/struct aggregate belongs naturally in contiguous memory.

```c
long caller() {
    long arg1 = 534;
    long arg2 = 1057;
    long sum = swap_add(&arg1, &arg2);
}
```

The corresponding fragment is:

```asm
subq $0x10,%rsp
movq $0x216,0x8(%rsp)
movq $0x421,(%rsp)
movq %rsp,%rsi
leaq 0x8(%rsp),%rdi
callq swap_add
```

The stores construct arg1 and arg2. `mov %rsp,%rsi` supplies arg2's address; `lea` computes arg1's address for the first parameter without dereferencing, matching C `&`. Although the slide ends at call, the function must eventually add the 16 frame bytes back to `%rsp`.

A stack local's lifetime belongs to its frame. Retaining its address after return violates C lifetime. This example passes pointers only during the active call and introduces neither heap allocation nor cross-lifetime ownership.

## The eight-argument trace: allocate four locals, then split register and stack arguments

Slides 28–47 animate:

```c
func(&i1,&i2,&i3,&i4,i1,i2,i3,i4)
```

`main` first executes `sub $0x18,%rsp` and stores four `int` locals at offsets `0xc/0x8/0x4/0`. Arguments 7 and 8, v3=3 and v4=4, are then pushed in reverse preparation order. Arguments 5 and 6, v1=1 and v2=2, enter `%r8d/%r9d`.

The first four pointer arguments are computed with `lea` only after the two pushes. Since `%rsp` has fallen 16 bytes, the old locals now appear at offsets `0x1c/0x18/0x14/0x10` from current `%rsp`; their addresses enter `%rdi/%rsi/%rdx/%rcx`. Using pre-push offsets would point at the wrong stack slots.

`callq func` pushes the return address again, making callee-entry `%rsp` lower than the two stack arguments. When func returns to `0x40059b`, the caller executes `add $0x10,%rsp` to discard the 16 bytes it pushed for arguments 7 and 8. Its local frame still requires teardown later.

These 20 pages are not 20 separate concepts but an instruction-by-instruction visualization of one invariant: every push changes subsequent stack-relative addresses. This article condenses repeated frames while preserving each kind of state transition, register assignment, and return-address effect.

## Caller and callee are relative roles on each call edge

When main calls function1, main is caller and function1 callee. When function1 calls function2, function1 is simultaneously callee on the first edge and caller on the second. No function is permanently categorized as caller or callee.

All functions share one hardware register file. If function1 holds a live value in `%r10`, then calls function2 which also writes `%r10`, the value disappears. The ABI therefore divides registers into those a callee must preserve and those it may clobber.

The slides call registers preserved for the caller “caller-owned”: a callee must save and restore any it uses. Common ABI terminology calls them **callee-saved**. The slides call registers freely overwritten by the callee “callee-owned”: the caller must preserve any live values itself. Common terminology calls them **caller-saved**. The perspectives reverse the labels; the required effect is what matters.

## Save/restore discipline makes nested calls composable

If function1 uses callee-saved `%rbx/%rbp`, a typical sequence is:

```asm
pushq %rbp
pushq %rbx
...
popq %rbx
popq %rbp
retq
```

Restoration reverses save order because the stack is LIFO. Function1 can assume function2 follows the same contract, so values held in callee-saved registers survive a nested call.

For caller-saved `%r10/%r11`, function1 preserves a value itself if it needs it after calling function2:

```asm
pushq %r10
pushq %r11
callq function2
popq %r11
popq %r10
```

A compiler may spill into an allocated frame instead of using push/pop. The contract is not a fixed instruction sequence: callee-saved registers equal their entry values on return, while caller-saved registers carry no preservation promise.

The ABI table also constrains `%rsp` discipline and assigns parameter roles. This article uses the deck's ownership pedagogy, but interoperability across object files is governed by the ABI document.

## Recursion and the `sum_array` synthesis: the public slides stop before the demo

Slide 56 announces a recursion trace with `rfact.c`, `rfact`, and GDB, but the public PDF supplies no code, trace, or result. Known mechanics imply that every recursive `call` needs its own return address and necessary saved state. The demo's particular frame layout cannot be reconstructed faithfully, so this article stops at the evidence boundary.

The final slide returns to `sum_array`: arguments arrive in `%rdi/%esi`; index and sum occupy `%eax/%edx`; `movslq` prepares a 64-bit index; conditional and unconditional jumps implement the loop; `mov %edx,%eax` places the return value; and `retq` restores caller control. No new opcode appears. It demonstrates that Lectures 14–19 now combine into a complete function.

## A function-call tracing checklist

1. Before call, record `%rsp`, the return successor, and every parameter location.
2. Expand each push as decrement then store, recalculating all later stack offsets.
3. For `call`, add both a return-address push and a control edge to the callee.
4. In the callee, distinguish return value `%rax` from the return address on the stack.
5. Mark every value live across a nested call and determine whether caller or callee preserves it.
6. At `ret`, load stack top into `%rip`, then verify caller cleanup restores `%rsp` balance.
7. For a function pointer, trace the indirect target through register or memory data flow.

Lecture 19's core is three simultaneous contracts: control reconnects through a return address, data crosses through parameter and return locations, and memory/register state follows ownership rules. Those contracts explain how separately compiled functions interoperate. Heap and later privacy topics need not be imported early.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 19: Assembly — Function Call (PDF)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/19/Lecture19.pdf)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
- [System V Application Binary Interface: AMD64 Architecture Processor Supplement (PDF)](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)
