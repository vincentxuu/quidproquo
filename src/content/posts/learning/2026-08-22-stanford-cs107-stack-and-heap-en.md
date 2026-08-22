---
title: "Stanford CS107 Lecture 10: Stack vs. Heap Is About Lifetime and Ownership, Not Just Speed"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, memory-management, heap]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 11
tldr: "CS107 Lecture 10 moves from sizeof and pointer arithmetic to stack-frame lifetime: returning a local array leaves a dangling pointer; malloc crosses function returns but makes NULL handling, size arithmetic, ownership, free, and leaks the programmer's responsibility."
description: "A lecture-by-lecture reading of Stanford CS107 Winter 2026 Lecture 10: stack frames, dangling pointers, the Mayday case, malloc, calloc, strdup, free, and heap ownership."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-stack-and-heap)

Lecture 10 asks how long data must live and who ends its lifetime. A local array lives with its function frame; a heap allocation survives the function, but the program must preserve ownership and call `free`.

`create_string` really creates `"aaaa"` and returns its current address, but the pointee's lifetime has ended when that pointer reaches the caller. Heap storage repairs lifetime, not capacity, initialization, allocation failure, or cleanup.

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official unit: Lecture 10, January 28, 2026
- Official title: Stack and Heap
- Instructor: the syllabus lists Jerry Cain; the PDF names no separate speaker
- Read in full: calendar, 46 slides, and four POSIX Issue 8 allocation specifications
- Missing: the PDF reconstructs stack animation but not narration; Canvas video and lecture code are unavailable

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) starts Topic 3 here. The agenda is array `sizeof`, pointer arithmetic, memory segments, stack frames, the Mayday dangling pointer, `malloc`, a dynamic-memory etude, heap use cases, `calloc`/`strdup`, and `free`.

## Before the heap, separate array and pointer scales

```c
char fruit[6];
strcpy(fruit, "grape");
size_t bytes = sizeof fruit; // 6
```

In its declaring scope, `sizeof fruit` measures the whole array. After parameter adjustment:

```c
void func(char *str) {
    size_t bytes = sizeof str; // pointer size; 8 on myth in the slides
}
```

The function receives only a first-element address; capacity is absent. The slides show eight bytes on 64-bit myth, but portable code neither hardcodes that size nor reconstructs capacity from it.

Pointer arithmetic scales by pointee type:

```c
int numbers[] = {52, 23, 12, 34, 16, 45};
int *nums1 = numbers + 1;
int *nums3 = nums1 + 2;
printf("%td\n", nums3 - nums1); // 2
```

`+ 1` advances `sizeof *numbers`. Pointer subtraction within one array yields an element distance, while `len` integers require `len * sizeof(int)` bytes.

## A memory-segment diagram is a model, not a portable address promise

The slides divide a process into stack, heap, data, BSS, text, and kernel regions: frames use stack, dynamic allocation uses heap, globals use data or BSS according to initialization, and machine code uses text.

The drawing's downward-growing stack and upward-growing heap are a common implementation model, not a C guarantee. Programs cannot infer lifetime from one local address being numerically above another. They can rely on contracts: automatic objects exist during their block/function execution; allocated objects persist from successful allocation until deallocation or reallocation.

“A stack variable disappears” does not promise immediate zeroing. It means its lifetime ends and the old pointer no longer authorizes access. Bytes may remain temporarily or be reused immediately; neither revives a dangling pointer.

## Stack frames provide automatic lifetime

```c
void func2(void) {
    int d = 0;
}

void func1(void) {
    int c = 99;
    func2();
}

int main(void) {
    int a = 42;
    int b = 17;
    func1();
    func2();
}
```

`main` has a frame; `func1` adds another; nested `func2` adds another. Returning ends inner local lifetimes and makes that storage reusable. The animation shows `main`'s later call to `func2` overlaying space previously used by `func1`.

Stack cleanup follows control flow automatically. The cost is that data cannot naturally outlive its declaring activation. Passing its pointer downward is fine while the owner lives; retaining it beyond return exceeds lifetime. Recursion similarly gets distinct locals because every invocation is a separate activation.

## Mayday: the address remains, the object does not

```c
char *create_string(char ch, int num) {
    char new_str[num + 1];
    for (size_t i = 0; i < num; i++) {
        new_str[i] = ch;
    }
    new_str[num] = '\0';
    return new_str;
}

int main(void) {
    char *str = create_string('a', 4);
    printf("%s\n", str);
}
```

During `create_string`, `new_str` is writable and large enough. It receives four `'a'` bytes and NUL; on return its array expression converts to a first-element address, and that value reaches the caller correctly.

The failure occurs at return. The array lifetime ends with its frame and `str` becomes dangling. Dereferencing it in `printf` is undefined. Sometimes printing `aaaa` is not success—it merely means bytes have not yet been overwritten. Another call, optimization level, or logging statement can reveal the defect.

Stack reuse makes the bug visible but is not its root. Even unchanged bytes belong to no live object accessible through that pointer. If the caller knows the size, it can allocate and pass buffer plus capacity. Dynamic allocation is appropriate when the callee determines size and data must cross return.

## `malloc` allocates raw bytes and does not know their intended type

```c
void *malloc(size_t size);
```

The [POSIX `malloc` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/malloc.html) allocates `size` bytes whose values are unspecified. Success returns a suitably aligned starting address; failure returns null. It does not know whether bytes will represent an integer array, string, or node.

```c
int *arr = malloc(n * sizeof *arr);
char *text = malloc(strlen(source) + 1);
struct node *node = malloc(sizeof *node);
```

C converts `void *` to object pointers without a C++-style cast. `sizeof *arr` keeps allocation synchronized with declaration type.

Multiplication can overflow. If `n * sizeof *arr` wraps in `size_t`, `malloc` may successfully allocate the wrongly small buffer while a loop writes `n` elements. Prove `n <= SIZE_MAX / sizeof *arr` first or use an interface that checks multiplication. Zero-size allocation is implementation-defined in POSIX and any non-null result must not be used to access an object.

## The heap version repairs lifetime and creates ownership

```c
char *create_string(char ch, size_t num) {
    if (num == SIZE_MAX) return NULL;
    char *new_str = malloc(num + 1);
    if (new_str == NULL) return NULL;

    for (size_t i = 0; i < num; i++) new_str[i] = ch;
    new_str[num] = '\0';
    return new_str;
}

int main(void) {
    char *str = create_string('a', 4);
    if (str == NULL) return 1;
    printf("%s\n", str);
    free(str);
}
```

The allocated object is not part of `create_string`'s frame, so it survives return. The caller receives both pointer and ownership: success requires exactly one eventual release. An interface must document whether a return is borrowed or owned.

The slides use `assert(new_str != NULL)` during development. Production APIs may instead return failure so callers clean up or propagate errors. Ignoring the return and immediately writing is never valid. Nor does heap allocation guarantee success or a particular OS commitment strategy; the portable contract is usable storage on success, null on failure.

## Dynamic-memory etude: convert element count to bytes

```c
int *array_of_multiples(int mult, size_t len) {
    if (len > SIZE_MAX / sizeof(int)) return NULL;
    int *arr = malloc(len * sizeof *arr);
    if (len != 0 && arr == NULL) return NULL;

    for (size_t i = 0; i < len; i++) {
        arr[i] = mult * (int)(i + 1);
    }
    return arr;
}
```

The slide answer is `malloc(len * sizeof(int))`, not local `int arr[len]`. A local array dies on return; one `sizeof(int)` allocates one element; an integer array needs no C-string terminator slot.

The API must also preserve `len`. A heap pointer knows no element count, and `sizeof arr` is pointer size. Losing the count loses application-level bounds. Element arithmetic `mult * (i + 1)` can separately overflow; successful allocation does not solve value arithmetic.

## When heap allocation makes sense

The slides list four cases: data must outlive the current call; a list, tree, hash table, or growing array changes at runtime; size is large or hard to predict; or multiple functions/modules must share data that no convenient outer scope owns.

Runtime size alone does not force heap—C has variable-length arrays, still constrained by stack lifetime and capacity. Conversely, a small node can belong on the heap because it participates in a long-lived structure.

Ask who uses the object last, which scope naturally covers it, whether maximum size is bounded, and whether ownership is unique. Caller-allocated buffers often avoid allocation; callee-determined size and lifetime make an owned heap return natural.

## `calloc`: allocate an element array and set all bits to zero

```c
int *counts = calloc(26, sizeof *counts);
bool *answers = calloc(n, sizeof *answers);
```

The [POSIX `calloc` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/calloc.html) separates element count and size and initializes all bits to zero. Issue 8 explicitly fails allocation when `nelem * elsize` overflows, protection plain `malloc(n * size)` does not provide by itself.

Do not translate all-bits-zero into every type's semantic zero without checking representation guarantees. For byte buffers and appropriate integer arrays, it combines allocation and clearing. Like `malloc`, it may return `NULL`, and successful storage eventually goes to `free`; it does not remember the application owner.

## `strdup`: convenient string copying with ownership transfer

```c
char *news = strdup("disinformation");
if (news == NULL) return 1;
news[0] = 'm';
free(news);
```

The [POSIX `strdup` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strdup.html) returns a newly allocated duplicate on success, suitable for `free`, or null on failure. Unlike `const char *p = "..."`, the successful duplicate occupies mutable allocated storage.

Convenience does not cancel ownership. Overwriting `news` with another `strdup` result without freeing the first loses the last route to the old allocation and leaks it. Receive a replacement in a temporary, check success, then release and replace.

## `free` ends allocation lifetime but does not clear every alias

```c
void free(void *ptr);
```

The [POSIX `free` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html) makes storage available for reuse. `free(NULL)` does nothing. Any other argument must match a still-live pointer returned by a compatible allocator. Double free, freeing stack storage, or freeing an interior pointer is undefined.

```c
char *text = strdup("earth");
char *alias = text;
free(text);
text = NULL;
```

Nulling `text` can prevent reuse through that variable, but `alias` remains dangling. `free` does not discover and clear pointer copies. Ownership rules must determine who releases and when borrowers stop.

A leak leaves unwanted storage allocated or loses its last pointer. Use-after-free accesses storage after release. Both reflect lifetime and ownership missing from dataflow.

## An ownership checklist you can apply tonight

For every allocation, record five answers:

1. What is the byte-size formula, and can multiplication or addition overflow?
2. How is allocation failure handled, and what is the zero-size policy?
3. Is the returned pointer owned, borrowed, or shared?
4. Who calls `free` on every success and error path?
5. Which aliases might survive after `free`?

Then draw lifetimes separately: automatic objects until scope/activation ends; allocated objects until `free`; literals with static duration but no mutation. Separate pointer lifetime from pointee lifetime and Mayday becomes obvious—the caller's `str` lives, but its local-array pointee does not.

Lecture 10 is not ultimately a segment-map quiz. It binds an address to the interval in which access is legal. Stack storage ties lifetime to control flow. Heap storage unties it from calls and replaces that convenience with ownership. Choosing the heap does not obtain permanent memory; it accepts a cleanup obligation.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 10: Stack and Heap (PDF)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/10/Lecture10.pdf)
- [POSIX Issue 8: malloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/malloc.html)
- [POSIX Issue 8: free](https://pubs.opengroup.org/onlinepubs/9799919799/functions/free.html)
- [POSIX Issue 8: calloc](https://pubs.opengroup.org/onlinepubs/9799919799/functions/calloc.html)
- [POSIX Issue 8: strdup and strndup](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strdup.html)
