---
title: "Stanford CS107 Lecture 13: From Comparators to a Fully Generic Bubble Sort"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, generics, function-pointers]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 14
tldr: "CS107 Lecture 13 upgrades a Boolean callback to a three-way comparator, then combines void *, element width, and const void * callbacks into a fully generic bubble sort before mapping the design to qsort, bsearch, lfind, and lsearch."
description: "A lecture-by-lecture reading of Stanford CS107 Winter 2026 Lecture 13: three-way comparators, generic callbacks, byte-wise addressing, qsort, bsearch, lfind, and lsearch."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-function-pointers-continued)

Lecture 12 separated data width from ordering policy but still left an `int[]`. Lecture 13 completes the abstraction. The algorithm retains only a base address, element count, and width, then gives adjacent element addresses to a client comparator. The library does not know whether an element is an integer, string pointer, or structure; the caller knows how to recover the type and compare it.

This is the skeleton behind generic C library APIs such as `qsort` and `bsearch`. The important part is not merely function-pointer syntax. It is the division between the library view and client view, and the three-way result that forms a stable protocol between them.

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official unit: Lecture 13, February 4, 2026
- Calendar title: Function Pointers, Continued
- Slide title: C Generics and Function Pointers, Take II
- Instructor: the PDF identifies no individual speaker
- Read in full: official calendar and slides, POSIX specifications for `qsort`, `bsearch`, `lfind`/`lsearch`, and cppreference `qsort`
- Missing: video and lecture code are not public

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) assigns function pointers, generic sorting/searching, and the `qsort`, `lfind`, and `bsearch` manual pages. The lecture builds a three-way comparator, revises integer bubble sort, generalizes addresses and width, passes elements through `const void *`, and maps the resulting interface to the standard library.

## Replace the Boolean predicate with a standard comparator

The preceding callback answered whether two elements should be swapped, so `bool` sufficed. A standard comparator provides three results:

- A value below zero means the first element precedes the second.
- A value above zero means the first element follows the second.
- Zero means they are equivalent under this ordering.

While elements remain integers, the function-pointer type is:

```c
int (*compare_fn)(int, int)
```

Bubble sort no longer understands ascending or descending directly. It swaps only when the left element should follow the right according to the comparator:

```c
void bubble_sort_int(int arr[], size_t n,
                     int (*cmp_fn)(int, int)) {
    while (true) {
        bool swapped = false;
        for (size_t i = 1; i < n; i++) {
            if (cmp_fn(arr[i - 1], arr[i]) > 0) {
                swap(&arr[i - 1], &arr[i], sizeof(arr[0]));
                swapped = true;
            }
        }
        if (!swapped) return;
    }
}
```

“Less than” is no longer fixed numerical comparison. It may mean case-insensitive string order, structure timestamp, or even-before-odd. The algorithm asks only whether the first element belongs after the second.

The third result preserves equivalence. Search functions need zero to detect a match, and a sorting algorithm can avoid swapping equivalent elements. A Boolean callback cannot cleanly distinguish first-before-second, equivalent, and first-after-second.

## The subtraction shortcut can overflow

The slides use this integer comparator to demonstrate casting and dereferencing:

```c
int sort_ascending(const void *first, const void *second) {
    return *(const int *)first - *(const int *)second;
}
```

It is readable for small examples but unsafe across the full `int` range. Subtracting a negative value from `INT_MAX` can exceed the signed range, and signed overflow is undefined behavior. A comparator promises only the sign, not the arithmetic difference:

```c
int compare_ints(const void *first, const void *second) {
    int a = *(const int *)first;
    int b = *(const int *)second;
    return (a > b) - (a < b);
}
```

The result is `1`, `0`, or `-1`, sufficient for the protocol without dangerous subtraction. The [cppreference `qsort` page](https://en.cppreference.com/w/c/algorithm/qsort.html) likewise warns that returning an integer subtraction may overflow and requires consistent results for the same objects.

A comparator must also form a usable ordering. Equivalent values return zero, reversing arguments reverses the sign, and the relation should be transitive. A comparator driven by changing global state can make a sort repeatedly exchange the same data without converging.

## Three prototypes expose the remaining data abstraction

The first version knows both array data and callback values are integers:

```c
void bubble_sort(int arr[], size_t n,
                 int (*cmp_fn)(int, int));
```

The second changes the base to `void *` and adds a width but still passes two integers to the callback. The interface contradicts itself: the library claims not to know the element type while being asked to produce integer values.

```c
void bubble_sort(void *base, size_t n, size_t width,
                 int (*cmp_fn)(int, int));
```

The third passes generic element addresses instead:

```c
void bubble_sort(void *base, size_t n, size_t width,
                 int (*cmp_fn)(const void *, const void *));
```

The library cannot dereference `void *`, but it can calculate every element's address. The client knows the actual element type and can cast each pointer back before reading it. The boundary is clean: sorting knows where; the comparator knows what and which comes first.

Adding `const` says that a comparator observes rather than modifies its elements. Early slide prototypes use `void *`; standard-library interfaces use `const void *`, making the restriction compiler-checkable. The sorting base remains writable `void *` because swaps mutate the array.

## Byte-wise addressing in the complete generic bubble sort

```c
typedef int (*compare_fn)(const void *, const void *);

void bubble_sort(void *base, size_t n, size_t width,
                 compare_fn cmp) {
    char *bytes = base;

    while (true) {
        bool swapped = false;
        for (size_t i = 1; i < n; i++) {
            void *first = bytes + (i - 1) * width;
            void *second = bytes + i * width;

            if (cmp(first, second) > 0) {
                swap(first, second, width);
                swapped = true;
            }
        }
        if (!swapped) return;
    }
}
```

`base` is element zero. After converting to `char *`, index `i` is `bytes + i * width`; the preceding adjacent element is `(i - 1) * width`. No typed dereference appears. The implementation performs address calculation, callback invocation, and byte-wise swapping.

Preconditions remain. Width must match the real element and be nonzero; `n * width` must not overflow; base must designate writable, suitably aligned, live storage spanning the entire range. Comparator casts must match the actual array elements. A `void *` enables common code but does not make a false cast safe.

Bubble sort is a teaching vehicle with quadratic time. A reusable generic interface does not make that algorithm suitable for large data; production programs normally call standard `qsort`.

## Client view and implementation view

Suppose a caller has:

```c
int nums[] = {4, 2, 12, -5, 56, 14};
bubble_sort(nums,
            sizeof(nums) / sizeof(nums[0]),
            sizeof(nums[0]),
            compare_ints);
```

The client knows there are six integers, their meaning, and the desired ascending order. `bubble_sort` sees only an address, count, width, and callback address. It can calculate the byte address of `nums[3]` but cannot itself produce an `int` value.

The `const void *` received by the comparator points to an array element. Casting does not convert the data representation. It tells the compiler that the address already designates an `int`, after which `*(const int *)first` reads it. Pairing a float array with `compare_ints` makes that assertion false, and the generic interface cannot protect the caller.

This information split is the core of generic C. The implementation retains enough structural knowledge to traverse; the client callback owns domain knowledge. They exchange only element addresses and comparator signs.

## Why a string array requires `char * const *`

```c
const char *words[] = {
    "sabotage", "bumfuzzle", "winsome",
    "ablution", "gravamen", "crepuscular"
};
```

The array element type is `const char *`, not `char`. A comparator therefore receives an address of a pointer element, conceptually `const char * const *`. Dereference once to obtain each string pointer before calling `strcmp`:

```c
int compare_strings(const void *first, const void *second) {
    const char *one = *(const char * const *)first;
    const char *two = *(const char * const *)second;
    return strcmp(one, two);
}

bubble_sort(words,
            sizeof(words) / sizeof(words[0]),
            sizeof(words[0]),
            compare_strings);
```

Casting directly to `const char *` would interpret the bytes of the pointer object as characters. Because the sort rearranges pointers, comparator arguments contain one more indirection. A mechanical rule helps: write the array element type as `T`; the argument points to an element, so cast it to `const T *`.

`strcmp` already returns a negative, zero, or positive value and needs no normalization. It requires each pointer to designate a valid null-terminated string that remains live during comparison.

## `qsort`: the same skeleton in the standard library

The [POSIX `qsort` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/qsort.html) has almost the same prototype as the completed lecture function:

```c
void qsort(void *base, size_t nmemb, size_t size,
           int (*compar)(const void *, const void *));
```

It orders `nmemb` elements of `size` bytes using a three-way comparator. The specification does not promise an internal sorting algorithm. Its historical name is not permission to rely on quicksort recursion, pivot selection, or stability.

POSIX also says the comparator must not alter elements and must return consistent results for the same objects. The relative order of equivalent elements is unspecified, so `qsort` is not a stable-sort contract. Encode a secondary order in the comparator when suitable, or choose an implementation that promises stability when original order must be retained.

The standard routine provides a shared ABI and extensively tested range mechanism. The caller still owns width, count, casts, and ordering correctness. Standardization transfers mechanism to the library; it does not remove generic C's proof obligations.

## `bsearch`: the same comparator plus a sorted-array precondition

The [POSIX `bsearch` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/bsearch.html) accepts a key, sorted base, count, width, and comparator:

```c
void *bsearch(const void *key, const void *base,
              size_t nmemb, size_t size,
              int (*compar)(const void *, const void *));
```

It returns a pointer to a matching element or `NULL`. If several elements compare equal, which one is returned is unspecified. The critical precondition is that the array is already sorted under this comparator. Sorting under one ordering and searching under another invalidates binary search's partition decisions.

The first comparator argument is the key and the second an array element. They may share a representation, but the two `const void *` parameters do not require identical hidden types. A heterogeneous key comparator must cast each side according to its actual object.

The result is an interior array address, not a copy. It becomes invalid when the array is freed, leaves its lifetime, or is reallocated. Retaining the result requires preserving container lifetime or copying the value.

## `lfind` and `lsearch`: search and insertion differ in mutability

The [POSIX `lfind`/`lsearch` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/lsearch.html) applies the pattern to linear search. `lfind` scans existing elements and returns `NULL` on failure without modifying the base. `lsearch` copies the key to the end when absent and increments the element count.

```c
void *lfind(const void *key, const void *base,
            size_t *nelp, size_t width,
            int (*compar)(const void *, const void *));

void *lsearch(const void *key, void *base,
              size_t *nelp, size_t width,
              int (*compar)(const void *, const void *));
```

Two differences carry meaning. `lsearch` has a non-const base because it may append, and `nelp` is a pointer because the function may update the count. Yet the prototype cannot represent capacity; the specification requires the caller to reserve enough room. With a full array, no extra parameter lets `lsearch` prevent an overrun.

Linear search needs no prior ordering and fits small or unsorted data. `bsearch` trades a sorting requirement for faster repeated lookup. Their shared comparator shows that function pointers abstract more than sorting: any algorithm can let the library own traversal while the client defines equality or order.

## The API contract matters more than function-pointer syntax

Seeing `int (*)(const void *, const void *)` reveals the mechanical type but not the whole meaning. Before a call, establish:

1. The hidden element or key type behind each callback argument.
2. That the result is three-way order, not an arbitrary score or Boolean.
3. That width measures one element in bytes and count measures elements.
4. That base has sufficient range, alignment, capacity, and lifetime.
5. Whether the algorithm mutates the array and how long a returned pointer remains valid.

A practical check is to annotate every `void *` with its hidden `T`. For `record[]`, callback arguments become `const record *`; for `char *[]`, they become pointers to pointer elements. Keep `sizeof(array[0])` beside the same array at the call site to avoid a manually duplicated width.

## The complete model from this lecture

A generic algorithm owns base, count, and width, enough to compute element addresses with `char *`; it may not guess element type. A comparator owns the domain type, recovers it from `const void *`, and returns an ordering sign; it does not manage traversal or swapping. `qsort`, `bsearch`, `lfind`, and `lsearch` apply this division to different control flows.

This design eliminates typed copies but converts relationships previously preserved by the compiler into API contracts. Reliable generic C is not merely correct casting. It means stating what each address designates, how many bytes are readable or writable, what the callback sign means, and how long a result pointer lives.

## References

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 13: C Generics and Function Pointers, Take II](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/13/Lecture13.pdf)
- [POSIX: qsort](https://pubs.opengroup.org/onlinepubs/9799919799/functions/qsort.html)
- [POSIX: bsearch](https://pubs.opengroup.org/onlinepubs/9799919799/functions/bsearch.html)
- [POSIX: lfind and lsearch](https://pubs.opengroup.org/onlinepubs/9799919799/functions/lsearch.html)
- [cppreference: qsort](https://en.cppreference.com/w/c/algorithm/qsort.html)
