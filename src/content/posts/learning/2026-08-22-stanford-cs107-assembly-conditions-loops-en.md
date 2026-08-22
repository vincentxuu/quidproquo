---
title: "Stanford CS107 Lecture 18: From Condition Codes to x86-64 Loops"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, assembly, x86-64, systems-programming, control-flow]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 19
tldr: "CS107 Lecture 18 connects ZF/SF/CF/OF to cmp, test, signed and unsigned conditional jumps, then reconstructs if statements, loops, dynamic instruction counts, setcc, and cmovcc."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 18: condition codes, cmp/test, conditional jumps, if and loop translation, setcc, and cmovcc."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-assembly-conditions-loops)

`cmp %rsi,%rdi` stores no subtraction result in a general-purpose register, yet a following `jge` can branch from it. Condition codes provide the bridge: a small set of CPU flags records important properties of the most recent arithmetic or logical operation. Stanford CS107 Lecture 18 starts from that hidden state and reconstructs C `if`, `while`, and `for` as fall-through paths and control-flow edges.

The crucial habit is not memorizing every `jg/jl/ja/jb`. Ask which instruction most recently wrote the flags, read a comparison in the `S2-S1` direction, and decide whether the values require signed or unsigned interpretation. A mistake in any one reverses the branch condition.

## Materials, gaps, and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Term: Winter 2026
- Official lecture: Lecture 18, February 18, 2026
- Calendar title: More Control Flow Operations
- Slide title: Assembly: Control Flow
- Instructor: the [complete PDF](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/18/Lecture18.pdf) metadata names Jerry Cain
- Assigned reading: Bryant and O'Hallaron, *Computer Systems: A Programmer's Perspective*, section 3.6
- Materials read: the official calendar, all 20 slide pages, GNU assembler's AT&T/Intel syntax documentation, and the 2025 AMD64 System V ABI
- Material gaps: the Canvas recording and AFS lecture code are not public; the assigned textbook is not among the public materials and is not represented as read

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) frames this lecture as completing control-flow operations. The [complete deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/18/Lecture18.pdf) covers conditional execution for `if/else` and loops; the `cmp` plus `jcc` pattern; complete conditional-jump families; four jump etudes; ZF/SF/CF/OF; three 8-bit flag exercises; tracing flags from `and/add/cmp`; avoiding overcomplicated flag explanations; `test` and non-`cmp` flag writers; `daisy`; two repeated `rose` pages; the `sum_array` loop; static versus dynamic counts; `setcc` and `is_small`; the full set table; and `cmovcc`, `max`, and the complete conditional-move table.

The lecture ends at conditional moves. It does not introduce function-call instructions, return-address storage, stack frames, or caller/callee-saved registers. Those belong to Lecture 19 and are not imported here. `ret` merely closes complete function listings; its mechanics remain outside this article.

## Conditional control combines fall-through with skipping blocks

A C `if/else` can be seen as two paths. When the test passes, block a runs and an unconditional jump skips b. When it fails, a conditional jump goes to b. A `while (k<n)` is similar: test first, jump beyond the body on failure, fall through on success, and jump unconditionally back to the test after the body.

Assembly has no single instruction containing all `if` or `while` semantics. The common form is:

```asm
cmp S1,S2
jcc label
```

`cmp S1,S2` computes `S2-S1` without retaining the subtraction result, updating flags instead. `jcc` consults a particular flag combination and either replaces `%rip` or falls through. Lecture 17 established that a jump changes the program counter; this lecture adds the decision of whether to do so.

The [GNU assembler comparison of AT&T and Intel syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html) confirms AT&T source,destination order. Thus `cmp $-5,%rax` means `%rax - (-5)`. A following `jle target` branches when signed `%rax` is at most -5. Reading it with Intel's destination-first habit reverses the conclusion.

## `jcc` has two orderings: greater/less for signed and above/below for unsigned

Equality and zero share `je/jz`; inequality and nonzero share `jne/jnz`. `js` tests negative and `jns` nonnegative. Ordered comparisons split into two families.

Signed relations are `jg`, `jge`, `jl`, and `jle`, with synonyms `jnle`, `jnl`, `jnge`, and `jng`. Unsigned relations are `ja`, `jae`, `jb`, and `jbe`, with `jnbe`, `jnb`, `jnae`, and `jna`.

```asm
cmp $0,%eax
jge 0x400300      # signed int eax >= 0

cmp %dx,%bx
je 0x400104       # 16-bit patterns equal

cmp $0x300,%r10
jbe 0x400148      # unsigned r10 <= 0x300
```

A bit pattern carries no intrinsic signedness. The jump family supplies the comparison interpretation. Pointers and addresses are generally ordered as unsigned values, so the deck's end-pointer etude uses `ja`, not `jg`.

The final etude, `cmp $0xffff,%cx; ja ...`, contains an impossibility: an unsigned 16-bit `%cx` can never be strictly above its maximum `0xffff`. The branch is never taken. Such impossible conditions are useful simplifications in reverse engineering.

## ZF, SF, CF, and OF compress properties of a subtraction

`cmp S1,S2` forms `S2-S1` and summarizes the result:

- ZF, the zero flag, says the result is zero.
- SF, the sign flag, says the high bit of the width-limited result is one.
- CF, the carry flag, records a subtraction borrow and supports unsigned relations.
- OF, the overflow flag, records that the signed two's-complement result does not fit the width.

The deck uses 8-bit arithmetic to force both interpretations. If `%bl=0x01`, `cmp $0xff,%bl` yields truncated `0x02`: ZF=0 and SF=0. Unsigned 1-255 borrows, so CF=1. Signed 1-(-1)=2 fits, so OF=0.

If `%bl=0x80`, the same comparison yields `0x81`: nonzero with sign bit one, so ZF=0 and SF=1. Unsigned 128-255 borrows, setting CF. Signed -128-(-1)=-127 fits, leaving OF clear.

If `%bl=0x00`, `cmp $0x80,%bl` yields `0x80`: ZF=0, SF=1, and the unsigned borrow sets CF. Signed 0-(-128)=128 exceeds the -128..127 range, so OF=1. This is why signed less-than cannot inspect SF alone: overflow can make the truncated sign disagree with the mathematical result.

## A branch reads the last flag writer, not necessarily an adjacent `cmp`

A conditional jump remembers no C expression; it reads current flags. `cmp` often appears first, but arithmetic and logical instructions also update them:

```asm
and $0x7,%ax
je target
```

`and` keeps the low three bits. For a multiple of eight the result is zero, ZF becomes one, and `je` is taken without any `cmp`.

```asm
sub %esi,%edx
jl target
```

`sub` stores `%edx-%esi` back into `%edx` and updates flags. `jl` asks whether that result is less than zero under signed comparison. Unlike `cmp`, the subtraction result is retained.

`test S1,S2` performs bitwise AND and updates flags without storing the AND result:

```asm
test %rdi,%rdi
jl target
```

ANDing a value with itself preserves its bit pattern, allowing zero or sign testing without changing `%rdi`. The deck notes that compilers often prefer this to `cmp $0,%rdi` because its encoding is shorter.

Do not inspect only the immediately previous line. `cmp %edi,%esi; mov %edi,%eax; cmovge %esi,%eax` works because ordinary `mov` does not change flags. Search upward for the most recent real flag writer, ensuring no intervening arithmetic or logical operation replaced its state.

## Flag equations are the foundation; comparison meaning is the readable explanation

`je` reads ZF. Signed `jge` requires SF=OF; `jl` requires SF≠OF; `jle` uses ZF=1 or SF≠OF. Unsigned `ja` requires CF=0 and ZF=0, while `jb` reads CF=1.

Those equations explain edge cases, but need not be expanded on every reading. In the deck's example:

```asm
sub $0x10,%rdi
cmp $0x4032,%rdi
jge 0x401930
```

The electrical-level account is that `jge` takes the branch when SF equals OF. The readable account is that the post-subtraction `%rdi`, interpreted as signed, is at least `0x4032`. Both are correct; the latter reconnects more directly to C.

It still matters which operation supplied the flags. The first `sub` updates them, but the following `cmp` overwrites them. `jge` judges only `%rdi-0x4032` from the comparison.

Another etude performs `and $0xf0,%rax`, then `cmp $0xc0,%al; je`. The AND clears the low nibble of the lowest byte; the comparison asks whether the retained high nibble is `0xc`. `je` consumes ZF from `cmp`, not the older flags from `and`.

## `daisy` and `rose`: draw taken and fall-through paths before naming branches

`daisy` is:

```asm
cmpl $10,%edi
je .L4
movl %edi,%eax
negl %eax
ret
.L4:
leal 1(%rdi),%eax
ret
```

When x==10, `je` goes to `.L4` and computes `x+1`. Otherwise execution falls through, copies x into the return register, and negates it. Equivalent C is:

```c
int daisy(int x) {
    if (x == 10) x++;
    else x = -x;
    return x;
}
```

Do not infer `if` versus `else` from vertical placement. Record the taken and fall-through edges, then trace each to `ret`.

`rose` is:

```asm
movq %rdi,%rax
subq %rsi,%rax
cmpq %rsi,%rdi
jge .L5
movq %rsi,%rax
subq %rdi,%rax
.L5:
ret
```

The default result is x-y. If x>=y, `jge` skips the replacement. If x<y, fall-through computes y-x. The function therefore returns the absolute difference. Slides 13 and 14 repeat essentially the same answer with only a wording change; this article records the material once rather than presenting duplicate pages as a new agenda item.

Under the [AMD64 System V ABI](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build), the first two INTEGER-class arguments use `%rdi/%rsi`, and return classification assigns an integer result to `%rax`. That evidence supports the etude's data-flow names. It does not mean `%rdi` retains original x forever; after any write, its new value must be traced.

## `sum_array`: a for loop is a forward test plus a conditional backward edge

```asm
sum_array:
    movq $0,%rax
    movl $0,%edx
    jmp .L8
.L9:
    addl (%rdi,%rax,4),%edx
    addq $1,%rax
.L8:
    cmpq %rsi,%rax
    jb .L9
    movl %edx,%eax
    ret
```

`%rax` is `size_t i` and `%rsi` is `size_t n`, so unsigned `jb` expresses i<n. The opening jump reaches `.L8`, ensuring the body never runs when n==0. On each successful test, a conditional backward edge reaches `.L9`; the body adds and increments, then falls naturally into the test again.

Equivalent C is:

```c
int sum_array(int arr[], size_t n) {
    int sum = 0;
    for (size_t i = 0; i < n; i++) sum += arr[i];
    return sum;
}
```

A backward jump alone is not sufficient evidence of this loop. Also find induction-variable initialization, test, update, and body memory access. Missing pieces may indicate a different control structure.

## Dynamic instruction count: equal static counts can have unequal execution costs

The slides compare two layouts with nine static instructions each. The shown loop executes `addl`, `addq`, `cmpq`, and `jb` each iteration—four instructions. A hand-written top-tested version needs a trailing unconditional `jmp` as well, making five per iteration.

For a large array, five versus four is about 25% more instructions per loop iteration. That percentage describes only the deck's dynamic instruction-count comparison, not a guarantee of 25% more wall-clock time. Branch prediction, pipelines, caches, and other microarchitectural factors also matter and are outside this lecture.

Static count asks how many instructions exist in the binary. Dynamic count asks how many one execution traverses. Entering the test through one initial forward jump lets the compiler remove an unconditional jump from the steady-state path.

To estimate work, count initialization once, multiply the per-iteration path by the iteration count, and count the exit path once. That is more reliable than declaring two nine-line listings equally efficient.

## `setcc`: materialize a condition as one byte containing zero or one

`setcc D` uses the same suffix conditions as `jcc`, but does not branch. It writes 1 to the destination byte when true and 0 otherwise. The destination may be a byte subregister or memory.

```asm
is_small:
    cmp $255,%rdi
    setbe %al
    movzbl %al,%eax
    ret
```

For `bool is_small(unsigned long x) { return x < 256; }`, `setbe` asks whether unsigned x<=255. It changes only `%al`; the other `%rax` bytes remain. `movzbl` then cleanly zero-extends the byte so full `%eax/%rax` contains canonical 0 or 1.

The family mirrors jumps: `sete/setne`, `sets/setns`, signed `setg/setge/setl/setle`, and unsigned `seta/setae/setb/setbe`, plus synonyms such as `setz/setnz`. The mnemonic's signedness must agree with the source type.

`setcc` creates a Boolean value instead of changing the control-flow graph. Trace how its destination byte is extended, masked, or stored rather than searching for a nonexistent branch target.

## `cmovcc`: stage a default and overwrite the register only when true

`cmovcc S,R` copies source to destination register when its condition is true; otherwise the old destination remains. `cmovge` uses the same predicate as `jge` without splitting `%rip`.

```asm
max:
    cmp %edi,%esi
    mov %edi,%eax
    cmovge %esi,%eax
    retq
```

The comparison computes y-x. The code stages x as the default return in `%eax`; if y>=x, `cmovge` replaces it with y. This implements `return x > y ? x : y`. The intervening `mov` does not update flags, so `cmovge` still reads the comparison result.

The complete family again mirrors equality, sign, signed relations, and unsigned relations: `cmove/cmovne`, `cmovs/cmovns`, `cmovg/ge/l/le`, and `cmova/ae/b/be`. The destination must be a register.

The slides call the four-instruction form often fast, but that is not a universal rule. Branchless replacement is safe only when both candidates can be computed safely.

## A complete tracing process that stops before Lecture 19

1. Locate a conditional transfer, `setcc`, or `cmovcc`.
2. Search upward for the last instruction that actually writes flags; do not assume an adjacent `cmp`.
3. For `cmp S1,S2`, write down `S2-S1` first.
4. Establish width from suffixes and signedness from the `g/l` or `a/b` family.
5. For a jump, draw taken and fall-through edges before naming blocks.
6. For a loop, add initialization, test, update, back edge, and exit edge.
7. For `setcc`, trace byte extension; for `cmovcc`, trace the default and replacement values.
8. When comparing cost, separate static instruction count from the dynamic path.

Lecture 18 fully answers when to jump and how to produce a conditional result without jumping. It does not answer how a function transfers control or stores a return address. Keeping that boundary clear preserves the role of condition codes: a compressed summary of the latest operation, shared by jumps, sets, and moves to choose what happens next.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 18: Assembly — Control Flow (PDF)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/18/Lecture18.pdf)
- [GNU assembler: AT&T Syntax versus Intel Syntax](https://sourceware.org/binutils/docs/as/i386_002dVariations.html)
- [System V Application Binary Interface: AMD64 Architecture Processor Supplement (PDF)](https://gitlab.com/x86-psABIs/x86-64-ABI/-/jobs/artifacts/master/raw/x86-64-ABI/abi.pdf?job=build)
