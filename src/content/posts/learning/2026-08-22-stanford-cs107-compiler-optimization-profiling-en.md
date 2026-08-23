---
title: "Stanford CS107 Lecture 24: Profile with Callgrind, Then Read What GCC Optimized"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, systems-programming, optimization, gcc, callgrind]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 25
tldr: "CS107 Lecture 24 builds a measurement workflow with matrix multiplication and Callgrind, then examines GCC constant folding, common-subexpression elimination, dead-code elimination, strength reduction, code motion, and recursion-to-loop conversion. Optimization starts with bottleneck evidence."
description: "A guided reading of Stanford CS107 Winter 2026 Lecture 24: Callgrind instruction counts, -O0/-Og/-O2, six compiler transformations, aliasing limits, and a repeatable profiling workflow."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-compiler-optimization-profiling)

“This line looks faster” is a dangerous start to performance work. Lecture 24 separates two responsibilities. The programmer chooses a reasonable algorithm and measures the real hotspot. The compiler removes, moves, or replaces low-level work when doing so preserves observable semantics. Both matter, but neither substitutes for the other.

The lecture first compares unoptimized and `-O2` builds of a triple-loop matrix multiply, then introduces Callgrind's dynamic instruction counts. It next examines constant folding, common-subexpression elimination, dead-code elimination, strength reduction, code motion, and tail-recursion optimization. Repeated `strlen` calls finally show why a compiler sometimes lacks knowledge available to the programmer.

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official session: Lecture 24, March 4, 2026
- Official title: Optimizations
- Instructor: Jerry Cain
- Assigned reading: Bryant & O'Hallaron, Chapter 5
- Materials read: the official calendar and Lecture 24 slides, GCC optimization options, and the Valgrind Callgrind manual
- Material gaps: the Canvas recording, AFS examples, and live `limitations.c` demo are not public; this article explains the public snippets without inventing demo results

The [official Lecture 24 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/24/Lecture24.pdf) proceed through optimization goals, GCC's `-O0`/`-Og`/`-O2` levels, matrix multiplication, a Callgrind workflow, six compiler transformations, `-Og` versus `-O2` factorial assembly, and compiler limitations around possible mutation and aliasing.

## Begin with scale, frequency, and asymptotic cost

The slides reduce most decisions to three rules. For infrequent work on small inputs, choose the simplest implementation. For frequent work or large inputs, keep the main algorithm's asymptotic cost reasonable. Leave low-level micro-optimization until measurement demonstrates a need, and first let GCC perform transformations it already handles well.

This avoids polishing a cold path that barely changes total runtime and saving one instruction inside a quadratic or cubic algorithm whose growth dominates everything. A concrete first step is to record a release-build baseline with fixed input, command, compiler version, and metric before changing code.

Efficiency is also multidimensional. Runtime, peak memory, binary size, tail latency, and energy can conflict. Lecture 24 focuses on instruction count and execution time, but fewer instructions do not imply every platform is faster; cache misses, branches, vectorization, and I/O alter cycle cost.

## GCC optimization levels are pass bundles, not a speed dial

The slides contrast `-O0`, which mostly preserves source structure, with `-O2`, which enables most reasonable optimizations. The course also uses `-Og` to retain a friendlier debugging experience with some optimization. Other levels include more aggressive `-O3`, size-oriented `-Os`, and `-Ofast`, which may relax standards compliance.

[GCC's optimization-options documentation](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html) explains that each level enables a collection of passes and that the exact set depends on target and GCC release. Reproducible claims therefore need the full command. `gcc -Q --help=optimizers` can reveal which switches a particular configuration enables.

Assembly that resembles C at `-O0` is not the sole truth of C semantics, and transformed `-O2` assembly is not necessarily unauthorized behavior. Both obey language rules. If source relies on undefined behavior, optimization may expose that mistake; the optimizer is not required to preserve an invalid assumption.

## Matrix multiplication demonstrates the size of compiler effects

The slides use a conventional `i-j-k` loop nest:

```c
void mm(double a[][DIM], double b[][DIM], double c[][DIM], size_t n) {
    for (size_t i = 0; i < n; i++) {
        for (size_t j = 0; j < n; j++) {
            for (size_t k = 0; k < n; k++) {
                c[i][j] += a[i][k] * b[k][j];
            }
        }
    }
}
```

The classroom measurements show fewer cycles under `-O2`; for the 25-by-25 case, the slide reports roughly 1.32M versus 0.19M. That number describes one program, machine, and measurement. It is not evidence that every C program becomes seven times faster. It demonstrates that build mode can invalidate a baseline: measuring a debug build does not answer a production-performance question.

Matrix multiplication also exposes memory-access effects beyond asymptotic complexity. Loop order and blocking can change locality even when Big-O remains cubic. Cache optimization is not this lecture's main subject, so no arrangement should be attributed to the slides as a universal answer. The method is layered: choose the algorithm, profile the cost, then inspect compiler and hardware behavior.

## Callgrind locates where dynamic work occurs

The [official Valgrind Callgrind manual](https://valgrind.org/docs/manual/cl-manual.html) presents Callgrind as a call-graph profiler. A typical workflow produces `callgrind.out.<pid>` and then annotates instruction references by function and source line:

```bash
valgrind --tool=callgrind ./program arg1
callgrind_annotate --auto=yes callgrind.out.<pid>
```

Static instruction count describes instructions present in a binary; dynamic count describes instructions executed by one run. A loop body can occupy a few static lines yet dominate dynamic cost after a billion iterations. Callgrind therefore answers more than “which function is large.”

The [Valgrind Callgrind manual](https://valgrind.org/docs/manual/cl-manual.html) documents default instruction-access collection and optional cache and branch-prediction simulation. Simulation adds substantial overhead. Wall time under the profiler is not production latency; the report is useful for locating relative cost, followed by a native benchmark.

## A repeatable profiling workflow

Run the unchanged program on representative input and preserve its command, binary identity, and report. Follow the largest inclusive-cost path: an expensive function may perform work itself or repeatedly invoke an expensive callee. Change one mechanism in an actionable leaf or loop, repeat the same profile, then confirm native wall time.

When startup and parsing hide the target region, the [official option reference](https://valgrind.org/docs/manual/cl-manual.html#cl-manual.options) documents `--toggle-collect=<function>` to restrict collection. This aligns the measurement with the question, but too narrow a boundary omits caller or callee cost. Record that boundary with the result.

Do not guess a hot loop from source and then profile only that loop to validate the guess. Inspect the whole run before narrowing collection. The actual cost may be allocation, string scanning, or conversion rather than the conspicuous mathematical function.

## Constant folding: compile-time work need not survive to runtime

Constant folding precomputes pure constant expressions. In `60 * 60 * 24 * n_days`, the constant factor need not be recomputed. The slides' elaborate `fold` example includes fixed `sizeof`, string length, and arithmetic. A lengthy `-O0` sequence becomes a constant multiply and add under `-O2`.

```c
int seconds = 60 * 60 * 24 * n_days;
```

Programmers need not replace that expression with the magic number `86400`. The readable unit derivation can still fold. Whether folding is legal depends on compile-time knowledge and the absence of observable side effects that must remain.

A second slide builds masks with `~0U / UCHAR_MAX` and a shift; `-O2` embeds the constants in `lea` and `and`. Portable C can express intent while target-specific instruction selection remains the compiler's job.

## Common-subexpression elimination: reuse a proven identical value

When the same expression recurs in a region where its operands provably do not change, the compiler can compute it once. The slides reuse `param2 + 0x107` and algebraically simplify later multiply-add work.

This is not text matching. A call, volatile access, or aliasing write between similar expressions may invalidate a prior value. Conversely, source expressions that look different can be combined when they are algebraically equivalent under the language rules.

Name meaningful intermediate values for readers, not to cache every repeated expression manually. If profiling shows important work remains, restructure the data flow and inspect assembly or an optimization report to verify an actual effect.

## Dead-code elimination: work without observable effect may vanish

The slides include an impossible condition, an empty loop, identical branches, and a return test equivalent to returning its argument. `-O0` retains much of the control flow; `-O2` reduces the function to an increment and return.

Dead code is broader than `if (false)`. An unused computation without observable side effects can disappear. A poorly constructed benchmark can therefore measure an empty function if it never consumes the result.

Make benchmark results observable in a controlled way, such as a checked checksum, and inspect generated assembly. Marking everything `volatile` is not the answer. Volatile has specific semantics and constrains legal optimization, but it is neither general synchronization nor benchmarking magic.

## Strength reduction: replace expensive operations with cheaper equivalents

When semantics permit, strength reduction replaces multiplication, division, or modulo with addition, shifts, or bitwise work. Slide examples include multiplying by 32 and 7, division by 3, modulo 2, and induction-variable arithmetic.

```c
int a = param2 * 32;
int d = param2 % 2;
```

That does not justify manually replacing every `x * 32` with `x << 5`. Signed values, overflow, and negatives can affect meaning and readability; the compiler knows the target cost model. Express correct types and intent, and intervene only where profiling demonstrates a remaining cost.

Fewer instructions also need not mean fewer cycles. A modern CPU can overlap operations, multiplication may be inexpensive, and a chain of dependent adds can lengthen the critical path. The transformation is vocabulary for reading assembly, not a universal source-rewrite rule.

## Code motion: move loop-invariant work out

If an expression has the same result on every iteration and no required repeated side effect, the compiler can move it outside the loop. In the slides, `foo * (bar + 3)` does not depend on `i`. Unlike common-subexpression elimination, the expression appears once in source; its repetition is dynamic.

```c
for (int i = 0; i < n; i++) {
    sum += arr[i] + foo * (bar + 3);
}
```

Code motion requires proof that operands do not change. Global state, unknown calls, pointer aliasing, and potentially trapping operations can prevent it. A manual hoist can communicate domain knowledge, but only after proving the value is invariant.

## Recursion becomes a loop only when assembly says it did

The slide factorial uses `n * factorial(n - 1)`. At `-Og`, assembly retains a recursive `callq`; at `-O2`, it becomes a multiply-and-decrement loop without per-level frames. The slides place this under tail-recursion optimization to illustrate recognition of recursive patterns.

Because multiplication occurs after the source-level recursive call returns, this is not the most literal tail-call form. Reading assembly is more reliable than memorizing a label. Removing the call also does not repair mathematics: if unsigned wraparound or a bad condition prevents reaching the base case, optimization turns infinite recursion into an infinite loop.

The optimizer is not a correctness tool. Prove termination, overflow, and boundaries first. If bounded stack use is a requirement, an explicit iterative algorithm is more portable than expecting a particular compiler release to perform the conversion.

## Compiler limits: it cannot assume your unstated domain guarantee

The final slides compare two `strlen` loops. In read-only `char_sum`, the compiler may hoist `strlen(s)`. In `lower1`, each iteration modifies `s[i]`; the compiler may not prove that string length stays fixed. The programmer knows that ASCII uppercase-to-lowercase conversion does not create `\0`, but source-level mutation and aliasing may not convey that guarantee.

```c
void lower1(char *s) {
    size_t n = strlen(s);
    for (size_t i = 0; i < n; i++) {
        if (s[i] >= 'A' && s[i] <= 'Z') {
            s[i] -= ('A' - 'a');
        }
    }
}
```

Computing length once explicitly states the invariant and replaces repeated linear scans with one. This is evidence-backed and readable, unlike indiscriminate bit tricks. Reprofile dynamic instructions and test empty strings, non-ASCII bytes, and boundaries afterward.

Aliasing commonly blocks transformations. Two pointers may name the same storage, so a write through one can invalidate a value read through the other. The compiler stays conservative unless type rules, local analysis, or an explicit contract exclude that possibility. Programmers can narrow mutation and expose invariants with clear locals instead of expecting the compiler to guess.

## A practical optimization checklist

Freeze correctness tests and establish a baseline at the production optimization level. Use Callgrind to identify dynamic-instruction hotspots and native timing to confirm relevance to the target metric. Choose one explainable change: lower asymptotic cost, remove a repeated scan, improve layout, or expose an invariant.

Repeat the same workload and inspect both inclusive and self cost. Moving work to another function is not a win. Check binary size, memory, and edge behavior; preserve compiler version and flags. Do not present one laptop result as a cross-platform law.

If a rewrite only obscures source while `-O2` assembly was already identical, remove it. Constant folding, common-subexpression elimination, and strength reduction show why manually helping the compiler often has no payoff. Save human attention for algorithms, data, and contracts the compiler cannot know.

## The real conclusion: evidence determines work order

Lecture 24 is not a catalog of six syntax tricks. It establishes a chain: avoid structural waste with a reasonable algorithm, establish a credible release-like baseline, locate dynamic cost with Callgrind, and inspect assembly to understand work the compiler already removed. Manual changes address only the remaining bottleneck.

Compilers are powerful because they track constants, data flow, and target instructions precisely. They are limited because they must preserve every observable behavior allowed by the language and cannot adopt unwritten domain knowledge. Good optimization is not a contest in bit tricks; it places the right information at the right layer.

The next time code feels slow, do not edit immediately. Profile fixed input, record where cost accumulates, and inspect `-O2` output. If the compiler already implemented the clever rewrite, retain the readable source. If aliasing or mutation blocks it, then restructure the code to express an invariant you can prove.

## Update log

- 2026-08-22: Replaced the dead Stanford Callgrind guide with the live official Valgrind manual for the workflow and option claims.

## References

- [Stanford CS107 Winter 2026 — Course Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 24 — Optimizations](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/24/Lecture24.pdf)
- [GCC — Options That Control Optimization](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html)
- [Valgrind — Callgrind Manual](https://valgrind.org/docs/manual/cl-manual.html)
