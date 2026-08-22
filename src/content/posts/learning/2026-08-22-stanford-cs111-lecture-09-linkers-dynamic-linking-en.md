---
title: "Stanford CS111 Lecture 9: Linkers and Dynamic Linking"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs111, operating-systems, stanford, systems]
lang: en
series:
  name: "Reading Stanford CS111"
  order: 10
tldr: "Lecture 9 follows source through assembly, object, executable, and process, explaining the linker's three passes and how a dynamic loader resolves shared-library addresses through a jump table at startup."
description: "A slide-by-slide reading of Stanford CS111 Spring 2026 Lecture 9 on process memory layout, object sections, symbols, unresolved references, linker passes, static linking, and jump-table dynamic linking."
draft: true
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs111-lecture-09-linkers-dynamic-linking)

This is part 10 of [Reading Stanford CS111](/series/stanford-cs111), covering **Stanford CS111, Spring 2026, Lecture 9**. Mendel Rosenblum taught the lecture on 2026-04-17; its official title is [Linkers and Dynamic Linking](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf). This article uses the public PDF and the [course calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar). The recording is behind Canvas/Panopto and is not treated as a source read for this article.

Lecture 9 marks a course transition. The first third on CPU issues—threads, processes, synchronization, and scheduling—is complete. The next third addresses process memory layout, virtual memory, and paging, before the final third turns to storage and file systems. A linker looks like a compiler tool, but it connects source code to the memory image of a running process.

## 1. Main memory and the process-layout questions

The [official Lecture 9 PDF](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf) first fixes the hardware scale. Main memory is usually volatile DRAM. It is byte addressable but transferred in roughly 64-byte cache lines, with slide examples of 60–100 ns or 200–300 CPU cycles. Example capacities range from 16–64 GB for laptops through 32–256 GB for desktops to 512–4096 GB NUMA servers. These are Spring 2026 slide snapshots, not universal machine specifications.

A C++ example contains a global, a global pointer, a function parameter, stack locals, and a heap object from `new int(42)`. The next diagram simplifies process memory into low-address code/text and data plus a stack near high addresses. Source order is not copied directly into memory: compiler, assembler, linker, and loader successively choose representations and positions.

The figure leaves questions for later lectures. If two processes are loaded, who gets address 0? Where do OS code and data live? Multiple threads need private stacks. How can more code be added to a running application? Virtual memory answers the earlier questions; linking begins answering the last.

## 2. Five stages from source to running process

The official pipeline is:

```text
x.c --gcc--> x.s --as--> x.o \
y.c --gcc--> y.s --as--> y.o  --ld--> a.out --OS loader--> process
z.c --gcc--> z.s --as--> z.o /
```

The compiler translates source to assembly. The assembler encodes assembly into an object file. The linkage editor—`ld` on Linux and `LINK` on Windows—combines objects with runtime libraries into an executable. The OS loader places executable sections in memory, creates the initial layout, and jumps to the code segment's start location.

The roles are not interchangeable. An assembler knows instruction encodings and offsets within one object but not where other objects will land. A linker sees all input objects and can combine sections and resolve external references. A loader operates in the execution environment and creates a process. A `gcc main.c` command only appears to be one step because the driver invokes the tools in sequence.

## 3. Runtime libraries in the process

The linker incorporates runtime libraries. The PDF names memory allocators such as C `malloc` and C++ `new`, which can call the OS to grow the data area, and system-call stubs that enter the kernel. Stack segments usually grow on demand rather than storing space for every future call in the executable.

Consequently, “linked” does not mean that every future process byte already exists. The executable supplies code, initial data, and metadata; the loader creates a layout; execution grows stack, heap, or mappings as needed. This distinction also explains why object-file data and the runtime stack are different: stack locals are allocated by calls, so the object file begins with an empty stack.

## 4. Why an object file is deliberately incomplete

The assembler cannot know final addresses for external calls and data, so it leaves a placeholder—shown as zero in the slides—and relocation information. An object file is not intended to run by itself; it faithfully carries known bytes and unresolved link requirements.

The PDF lists four contents:

1. **Sections:** code/text and data, each with size, starting address, and optional initial contents; the stack starts empty.
2. **Symbol table:** externally interesting routines and non-stack variables, recording names and current section-relative locations.
3. **Unresolved references:** the location that needs a symbol address.
4. **Debug information:** source lines, structure layouts, and variable locations for breakpoints and inspection.

A symbol's current location is commonly relative to its object section, not its final process address. The linker must choose section placement, translate `section + offset` into executable locations, and patch every reference.

## 5. The `main.o`, `stdio.o`, and `math.o` example

The example `main.c` declares external `sin`, `printf`, and `scanf`, reads a number, computes its sine, and prints it. `stdio.c` defines `stdin`, `stdout`, `printf`, and `scanf`, while referring to `fputc` and `fgetc`; `math.c` defines `sin`.

The [official Lecture 9 PDF's object example](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf) places `main.o` text offsets 30 and 86 call `printf`, offset 52 calls `scanf`, and offset 60 calls `sin`. Data offsets 0, 14, and 17 hold three format strings. Symbols place `main` at `T[0]` and `_s1/_s2/_s3` at `D[0]/D[14]/D[17]`. The unresolved list identifies call and string-reference locations that still require addresses.

In the [same official object example](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf), `stdio.o` `printf` begins at text offset 44 and `scanf` at 232; `stdin` and `stdout` occupy data offsets 0 and 8. This object is also open: offset 118 loads `stdout`, 122 calls `fputc`, 306 loads `stdin`, and 310 calls `fgetc`. Each object declares definitions and references; the linker constructs one consistent namespace over all inputs.

## 6. The linker's three scans

The slides simplify the linkage editor into three passes.

Following the [official Lecture 9 PDF's three-pass example](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf), **Pass 1 reads section sizes and computes the memory layout.** In the example, `main.o text` occupies 0–95, `stdio.o text` 96–507, `math.o text` 508–719, `main.o data` 720–759, and `stdio.o data` 760–835. The values demonstrate how a base follows preceding section sizes, not a mandated layout for every real ELF linker.

The [official three-pass example](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf) then **Pass 2 reads symbols and creates a complete in-memory symbol table.** `main` remains address 0. `_s1`, originally `main.o D[0]`, becomes 720; `_s2` becomes 734 and `_s3` 737. `printf` is `stdio.o T[44]`, so its base 96 produces address 140. `scanf` becomes 328, `stdin/stdout` 760/768, and `sin`, at `math.o T[0]`, becomes 508.

The [official three-pass example](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf) finally **Pass 3 reads sections and unresolved references, updates addresses, and writes the executable.** At `main.o` text offset 30, a placeholder `call 0` has a `printf T[30]` relocation. The complete table says `printf=140`, so the output becomes `call 140`. Other calls and data references follow the same contract.

The dependencies explain the passes: sizes precede layout; layout precedes final symbol addresses; a complete symbol table precedes reference resolution. Real formats add alignment, relocation types, and architecture-specific encodings, but the model explains why linking is more than concatenating bytes.

## 7. Static linking: completeness and duplication

Everything so far is **static linking**. Each executable is complete and all references are resolved at link time. Startup need not discover those library functions, and the executable carries the required code. As language libraries grew, however, programs each embedded the same code and could place multiple copies in memory.

Duplication affects more than disk size. A statically linked executable does not automatically adopt a later library fix and generally must be relinked; conversely, pinning code can make deployment more predictable. The PDF explicitly emphasizes wasted memory. The versioning observations clarify the boundary but are not presented as direct slide claims.

## 8. Dynamic linking defers address choice

Shared libraries allow processes to map a single in-memory library copy. The library's location is not known until load time, so every reference cannot be fixed during ordinary static linking. Dynamic linking defers some resolution to program startup or the runtime environment.

The slides explain one design with a **jump table**. A `call printf` in the main program targets a table entry rather than the final `stdio` address. The entry records a function name such as `printf`, the shared-library filename containing it, and a jump instruction whose target is initially unknown. The table resides in the data section.

Before `main`, dynamic-loader code scans the table, maps its named shared libraries, and fills `JMP XXX` with the actual `JMP printf` target. The original call site stays unchanged and reaches the shared function through one indirection. Address knowledge is concentrated in a patchable entry instead of duplicated at every call site.

## 9. The jump-table contract and boundary

Static linking now knows that `printf` is needed and which entry to call. The loader knows where this process maps the library. The CPU later follows a completed jump instruction. This separation provides late binding and permits one library code page to be mapped into multiple processes.

Costs include startup mapping and resolution, an extra indirection on a call, and dependency on compatible library names and interfaces. The official PDF shows eager startup scanning; it does not cover ELF PLT/GOT details, lazy binding, symbol interposition, ASLR, or hardening. Those modern mechanisms should not be retrofitted into the simplified algorithm.

A practical debugging order follows the model: verify that a definition exists in the input objects or libraries; check symbol name and visibility; inspect the reference section and offset; confirm that base plus offset yields the expected address; and, dynamically, confirm that the loader can find the named library. Each check corresponds to object metadata or a linker pass.

## 10. Returning from linking to the OS sequence

The lecture delivers a representation pipeline rather than a list of `ld` flags. The compiler lowers source names and structure into assembly. The assembler emits relocatable objects with placeholders. The linker uses section sizes, symbols, and unresolved references to construct an executable. Only the loader turns that executable into a process memory image. Each layer decides only after it has enough information.

Static linking resolves at build time, producing a self-contained but potentially duplicated executable. Dynamic linking defers library placement, enabling sharing while adding runtime contracts for the loader, table, and compatible library. The coming virtual-memory and paging lectures can now explain why two processes both see their own address 0 and how shared code pages can exist beneath those private views.

## References

- [Stanford CS111 Spring 2026 calendar](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/calendar)
- [Lecture 9 slides: Linkers and Dynamic Linking](https://web.stanford.edu/class/archive/cs/cs111/cs111.1266/lectures/9/Lecture9.pdf)
- [Operating Systems: Principles and Practice](https://ospp.cs.washington.edu/)
- [System V ABI: Object Files](https://refspecs.linuxfoundation.org/elf/gabi4+/ch4.intro.html)
- [GNU `ld` manual](https://sourceware.org/binutils/docs/ld/)
- [Linux manual: dynamic linker/loader](https://man7.org/linux/man-pages/man8/ld.so.8.html)
