---
title: "Stanford CS107 Lecture 11: How void * Gives C Generics Without Pretending Types Still Exist"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, memory-management, generics]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 12
tldr: "CS107 Lecture 11 finishes the heap contracts of calloc, strdup, free, and realloc, then turns several typed swap functions into void * plus a byte count: C generics do not preserve an unknown type; they explicitly transfer responsibility for addresses, widths, and interpretation."
description: "A close reading of Stanford CS107 Winter 2026 Lecture 11: heap ownership, calloc, strdup, realloc, void pointers, memcpy, and generic swap."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-generics-void-pointer)

Separate `swap` functions for `int`, `double`, and string pointers are safe but repetitive. How can one function know how many bytes to move, or what type an address denotes? Stanford CS107 Lecture 11 gives a characteristically C answer: the function need not know the value's meaning if the caller supplies an address and byte count. `void *` erases the pointee type, `memcpy` copies raw bytes, and the interface contract and caller jointly preserve correctness.

This is not lightweight syntax comparable to Java generics. Once type information is erased, the compiler can check less. A wrong width, cast, or lifetime may compile. The lecture therefore closes the previous heap discussion before introducing generics. Both halves ask the same systems question: when the language does not remember a resource or type for you, how must the program restore that missing information in its contract?

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Term: Winter 2026
- Official session: Lecture 11, January 30, 2026
- Official title: Generics and `void *`
- Slide title: Heap Wrap, Generics – void *
- Instructor: the syllabus lists Jerry Cain; the lecture PDF does not separately identify a speaker
- Materials read: the official calendar, complete Lecture 11 slides, and POSIX Issue 8 specifications for `calloc`, `strdup`, `free`, `realloc`, and `memcpy`
- Material gaps: the calendar also mentions vulnerability disclosure, use-after-free, and partiality. The public slides fully support the heap and generics spine, but the Canvas recording, spoken ethics discussion, AFS lecture code, and starter repositories are unavailable

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) places this lecture at the end of Topic 3 and beginning of Topic 4. The [complete slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/11/Lecture11.pdf) proceed through a heap-allocation review; `calloc`, `strdup`, `free`, and `realloc`; stack/heap tradeoffs in lifetime, size, ownership, and cost; duplication caused by strongly typed data exchange; the evolution of typed `swap` into `void *` plus a byte count; `memcpy` as a byte replicator; and an incorrect `void *` call demonstrating the cost.

## The heap API is a state machine, not four unrelated functions

The previous lecture established `malloc`: success yields storage of at least the requested size, failure yields a null pointer, and successful storage is initially uninitialized. The program retains the returned base address and eventually releases it. Lecture 11's additional APIs are not merely conveniences; each changes initialization or ownership semantics.

```c
int *counts = calloc(26, sizeof *counts);
if (counts == NULL) {
    // handle allocation failure
}
```

Under the [POSIX `calloc` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/calloc.html), it allocates enough storage for member count times member size and initializes all bits to zero. The slides use 26 integers, so each starts at zero. They also illustrate common false and null-pointer outcomes. Precise code should retain the specification's “all bits zero” wording rather than generalize one machine's representation to every C implementation.

`sizeof *counts` stays correct if the pointed-to type changes. It does not eliminate every multiplication-overflow risk or guarantee success; a null check remains part of the control flow.

```c
char *copy = strdup("disinformation");
if (copy != NULL) {
    copy[0] = 'D';
    free(copy);
}
```

[POSIX `strdup`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strdup.html) allocates enough space and copies the source through its terminating null byte. This distinguishes a string literal from a modifiable heap copy. Convenience does not cancel ownership: a successful duplicate still requires `free`.

## free ends an allocation lifetime; it does not clear every alias

```c
int *numbers = malloc(8 * sizeof *numbers);
int *alias = numbers;
free(numbers);
numbers = NULL;
```

Setting `numbers` to `NULL` is a useful local practice but does not update `alias`. `free` ends the allocated object's lifetime; it does not scan for every variable holding the same bits. The [POSIX `free` contract](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html) requires an as-yet-unfreed pointer previously returned by an allocator; `free(NULL)` does nothing. An interior pointer, stack address, or already-freed address violates that contract.

Memory leaks, use-after-free, and double-free are distinct states. A leak loses the last usable owner while the allocation remains live. Use-after-free accesses through a dangling alias after lifetime ends. Double-free passes the same allocation to `free` again. Adding a `free` near a function's end cannot indiscriminately repair all three.

A practical discipline is to record, on successful allocation, who owns the result, whether ownership transfers, and where every early return cleans up. A borrowing function must not release the object; a taking function should state the transfer in its name, comment, or API documentation.

## realloc is difficult because the old pointer's validity changes

```c
size_t new_count = count * 2;
int *grown = realloc(numbers, new_count * sizeof *numbers);
if (grown != NULL) {
    numbers = grown;
    count = new_count;
}
```

The [POSIX `realloc` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/realloc.html) allows either in-place growth or movement to a new location while preserving the common extent. On success the old object is released and the old pointer must not be used, even if the new address happens to compare equal. On failure it returns null and leaves the old allocation intact.

That is why assigning directly to `numbers` is unsafe: failure overwrites the sole owner with null and leaks the still-live block. A temporary lets the program inspect the result before committing the ownership transition. Capacity arithmetic must be checked before the call; an allocator sees only the byte count it receives.

Interior pointers must also be reconsidered. If `middle = &numbers[3]` was saved before resizing, it does not follow a moved block. Save an index and recompute from the new base after success.

## Choose stack or heap by lifetime and ownership, not slogans

The slides compare several axes. Stack allocation follows function activation, has automatic cleanup, and is limited by the implementation's stack. Heap objects can outlive the allocating function and take runtime-determined sizes, but allocation failure and cleanup belong to the program.

“Stack is fast; heap is slow” is not an adequate design rule. Automatic storage is direct when data is local and reasonably sized. Heap storage supplies a necessary capability when a result must outlive its creating call, size is known only at runtime, or object lifetime diverges from the call stack. Ask how many bytes are needed, how long they live, and who ends the lifetime.

## C generics begin with repetitive strongly typed swap functions

```c
void swap_int(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}

void swap_double(double *a, double *b) {
    double tmp = *a;
    *a = *b;
    *b = tmp;
}
```

The algorithm is identical: save the first region, overwrite it with the second, then restore the saved content into the second. Only width and the compiler's interpretation differ. Strong typing lets the compiler validate calls and scale pointer arithmetic, but duplicates the movement logic.

Before generalizing, identify what the algorithm truly needs. Swap needs two storage addresses and a common length. It does not require integer arithmetic, floating comparison, or struct fields. If an algorithm must decide ordering, bytes alone are insufficient: the same representation has different meaning as an integer, floating value, or string. Lecture 11 handles movement; the next lecture restores policy with a callback.

## void * means an unknown pointee type, not a universal value

```c
void swap(void *a, void *b, size_t nbytes);
```

An object pointer can convert to `void *` and back to a compatible original type, allowing one interface to receive different object addresses. But `void *` has no element size and cannot itself be dereferenced into a meaningful C value. Standard C does not give it ordinary object-pointer arithmetic; byte traversal first converts to `unsigned char *` or `char *`.

All three arguments matter. `a` and `b` identify starts; `nbytes` identifies extent. The callee cannot infer allocation size or prove both sides hold the same type. Passing `sizeof(int)` for a `double` may still compile and exchange only part of an object.

`void *` does not extend lifetime. Saving a local address through it still leaves a dangling pointer after return, and casting away `const` creates no right to modify. Type erasure changes static information, not lifetime, alignment, bounds, or mutability.

## memcpy is a byte replicator, and its contract matters

```c
void swap(void *a, void *b, size_t nbytes) {
    unsigned char tmp[nbytes];
    memcpy(tmp, a, nbytes);
    memcpy(a, b, nbytes);
    memcpy(b, tmp, nbytes);
}
```

Under [POSIX `memcpy`](https://pubs.opengroup.org/onlinepubs/9799919799/functions/memcpy.html), the function copies a byte count from a source object to a destination; overlapping ranges have undefined behavior. This suits two non-overlapping complete objects of equal size. It knows no integer, double, or struct and invokes no constructor.

The variable-length temporary makes the three copies visible. Production code must consider size, overlap, and whether a stack temporary is appropriate; the alias relationship of all three operations must be analyzed together.

```c
int x = 17;
int y = 42;
swap(&x, &y, sizeof x);

double p = 3.14;
double q = 2.71;
swap(&p, &q, sizeof p);
```

Using `sizeof` on the actual object avoids a handwritten width. If operands differ in type or size, choosing the smaller width merely turns an explicit error into quieter corruption.

## The incorrect demo: compiling is not satisfying a contract

```c
short small = 7;
long large = 99;
swap(&small, &large, sizeof large); // wrong
```

The signature accepts two object pointers and a count, but the first copy may read beyond `small`. Erasure leaves the compiler insufficient information to reject it. Equal size does not imply equal meaning either: exchanging an `int` and `float` representation is not numeric conversion.

C's generic tradeoff is now explicit. Reuse comes from depending only on a common low-level operation, not from every type acquiring a common high-level meaning. Swap can move complete representations. Sorting cannot derive ordering from bytes, so the next lecture adds a function pointer supplied by the caller.

## A framework to carry forward

For heap APIs, draw the allocation states: absent, successfully allocated, possibly reallocated, and freed. Label each pointer owner or borrower. Does failure retain the original owner? Can any alias survive beyond lifetime? This turns vague “memory trouble” into inspectable transitions.

For generic APIs, list erased information and its replacement. `void *` erases pointee type, so byte movement adds a size. Sorting also erases ordering meaning, so it adds a comparator. A container managing element lifetime may need copy or destructor callbacks. Every fact removed from compile-time knowledge needs a runtime argument, typed wrapper, or documented contract.

Lecture 11 is therefore not primarily a list of five library functions. Abstraction moves responsibility. Heap storage moves lifetime from the call stack to an owner; `void *` moves type knowledge from callee to caller; `memcpy` lowers a value operation to a byte operation. More general interfaces demand more precise size, lifetime, and operation contracts.

## Further exercises

Write `append` for a growing `int` buffer, receive `realloc` through a temporary, and identify the owner on every failure path. Then replace typed swaps with a generic core and record what the compiler can no longer check. Finally ask what information a generic bubble sort still lacks after receiving a base, element count, and width.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 11: Heap Wrap, Generics – void * (PDF)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/11/Lecture11.pdf)
- [POSIX Issue 8: calloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/calloc.html)
- [POSIX Issue 8: strdup and strndup](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strdup.html)
- [POSIX Issue 8: free](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html)
- [POSIX Issue 8: realloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/realloc.html)
- [POSIX Issue 8: memcpy](https://pubs.opengroup.org/onlinepubs/9799919799/functions/memcpy.html)
