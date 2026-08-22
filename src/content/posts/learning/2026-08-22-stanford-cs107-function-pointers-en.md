---
title: "Stanford CS107 Lecture 12: Function Pointers Inject Ordering into Generic C"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, generics, function-pointers]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 13
tldr: "CS107 Lecture 12 first uses char * for byte-wise generic swap and rotate, then uses a function pointer to separate bubble sort's traversal mechanism from its ordering rule: void * abstracts data types, while callbacks abstract behavior."
description: "A lecture-by-lecture reading of Stanford CS107 Winter 2026 Lecture 12: void pointers, byte-wise pointer arithmetic, memmove, generic rotate, function pointers, callbacks, and bubble sort."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-function-pointers)

C has no templates or method dispatch, but an algorithm does not need to be copied once per type. Lecture 12 separates “generic” into two questions: how wide the data is and where its next element begins, and which rule should order two elements. A `void *` plus an element width answers the first question; a function pointer lets the caller inject the second answer.

That decomposition matters more than the syntax. A generic function does not pretend to know every type. It retains only the common mechanism and turns unknown facts into parameters. The cost is that `void *` does not preserve full type information. Length, width, writability, and the comparator contract must be maintained jointly by the interface and caller.

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official unit: Lecture 12, February 2, 2026
- Calendar title: Generics, `void *`, and Function Pointers
- Slide title: C Generics and Function Pointers
- Instructor: the PDF names no individual speaker; its copyright line names Stanford CS, Lisa Yan, Nick Troccoli, and Katie Creel
- Read in full: official calendar, all 32 slides, the POSIX `memmove` specification, and cppreference pages for pointers, `memmove`, and `qsort`
- Missing: Canvas video and lecture code are not public; repeated animation slides are not treated as extra topics

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) places C generics, function pointers, and callbacks in this lecture. The complete route is to generalize `swap_ends_int`, address elements through a byte pointer, build generic `rotate`, identify overlapping ranges, distinguish `memcpy` from `memmove`, implement integer bubble sort, and finally turn ordering policy into a caller-supplied function. The element type of the sort becomes fully generic only in the next lecture.

## Find the invariant mechanism in typed `swap_ends_int`

Begin with an integer-only function:

```c
void swap_ends_int(int arr[], size_t len) {
    int tmp = arr[0];
    arr[0] = arr[len - 1];
    arr[len - 1] = tmp;
}

int nums[] = {7, 2, 3, 4, 5, 6, 1};
size_t len = sizeof(nums) / sizeof(nums[0]);
swap_ends_int(nums, len);
// nums[0] == 1, nums[6] == 7
```

Although it appears full of `int`, its mechanism has only two parts: compute the first and last element addresses, then exchange equally wide byte ranges. Given a generic `swap(void *a, void *b, size_t size)` from the previous lecture, the typed wrapper becomes one line:

```c
void swap_ends_int(int arr[], size_t len) {
    swap(&arr[0], &arr[len - 1], sizeof(arr[0]));
}
```

Replace `int` with `short`, `float`, `fraction`, or `const char *`, and the structure remains unchanged. Only `sizeof(arr[0])` and the byte distance represented by `arr + 1` vary. The algorithm does not need element meaning, but it does need element width.

An unstated precondition remains: `len` must be nonzero. With `len == 0`, unsigned `size_t` underflows in `len - 1`, and no endpoint exists. A robust implementation can return when `len < 2`, or the API can explicitly reject empty arrays. Generalization does not remove bounds; it exposes assumptions that typed syntax previously hid.

## `void *` preserves an address while deliberately forgetting stride

The first intuitive version is not valid standard C:

```c
void swap_ends(void *arr, size_t len, size_t size) {
    swap(arr, arr + len - 1, size); // invalid in standard C
}
```

A `void *` can carry an object pointer and naturally means “the start of data whose element type is irrelevant.” But `void` has no size and cannot be dereferenced. The compiler scales `int *p + 1` by `sizeof(int)`; it has no stride for `void *`. Some compilers accept byte-wise `void *` arithmetic as an extension, but portable C cannot rely on that behavior.

The [cppreference pointer page](https://en.cppreference.com/w/c/language/pointer.html) distinguishes object pointers, function pointers, and `void *`, and describes the round trip between object pointers and `void *`. That conversion provides a generic address carrier, not runtime type information. A `void *` stores no element count, width, alignment guarantee for a proposed cast, lifetime, or ownership. An algorithm that needs those facts must receive them separately.

The portable implementation converts to a byte pointer and applies the width itself:

```c
void swap_ends(void *base, size_t len, size_t elem_size) {
    if (len < 2) return;
    char *bytes = base;
    void *last = bytes + (len - 1) * elem_size;
    swap(base, last, elem_size);
}
```

A `char` is one byte by definition, so incrementing `char *` moves byte by byte. The last address is `base + (len - 1) * elem_size`, with arithmetic performed after conversion to a byte address. The slides call this the CS107 “`char *` hack.” It is not mysterious type-system evasion; it explicitly changes the address unit to bytes.

The caller still has the typed array and should supply its width:

```c
fraction ratios[] = {{5, 7}, {11, 18}, {13, 27}};
swap_ends(ratios,
          sizeof(ratios) / sizeof(ratios[0]),
          sizeof(ratios[0]));
```

The operation exchanges complete object representations without understanding `num` or `denom`. For a pointer array, it exchanges pointer values, not the strings they designate. Generic byte copying derives its power from not interpreting data. Its limitation follows directly: when the caller supplies the wrong width, the function cannot detect the mistake and faithfully moves bytes at the wrong boundaries.

## Generic `rotate`: state the data shape as half-open ranges

The second exercise rotates `[front, end)` so `[front, separator)` moves to the rear while internal order in both portions is preserved:

```c
int array[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
rotate(array, array + 3, array + 10);
// {4, 5, 6, 7, 8, 9, 10, 1, 2, 3}
```

A half-open range makes `end` one-past rather than the final element. Prefix width is `separator - front`, suffix width is `end - separator`, and both values are byte counts. All three pointers must belong to one contiguous block with `front <= separator <= end`. Relational comparisons are not generally meaningful for pointers into unrelated objects, so an assertion can check a caller already obeying the same-array precondition; it cannot make arbitrary addresses safe.

The operation needs three conceptual moves: prefix to temporary storage, suffix toward the front, and saved prefix to the rear.

```c
void rotate(void *front, void *separator, void *end) {
    size_t width = (char *)end - (char *)front;
    size_t prefix_width = (char *)separator - (char *)front;
    size_t suffix_width = width - prefix_width;

    if (prefix_width == 0 || suffix_width == 0) return;

    char temp[prefix_width];
    memcpy(temp, front, prefix_width);
    memmove(front, separator, suffix_width);
    memcpy((char *)end - prefix_width, temp, prefix_width);
}
```

The independent `temp` range cannot overlap the original range, so the first and third copies may use `memcpy`. The second move shifts the suffix to a lower address; its source and destination commonly overlap. That is the logical defect in the initial version that uses `memcpy` three times.

The slides use a variable-length array for clarity. Production code must also consider input size: a large prefix can exhaust the stack, and some C modes do not support VLAs. Alternatives include heap storage, buffering the smaller portion, or reversal/cycle algorithms that avoid proportional temporary space. Those are engineering extensions; they do not change the lecture's overlap argument.

## `memcpy` versus `memmove` is a contract distinction, not luck

Both functions copy an explicit byte count and return the destination. Their difference is whether ranges may overlap. The [POSIX `memmove` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/memmove.html) defines the result with a precise abstraction: copy the source bytes to a nonoverlapping temporary array, then copy that array to the destination. An implementation need not allocate that complete array, but its result must be as if it did.

The [cppreference `memmove` page](https://en.cppreference.com/w/c/string/byte/memmove.html) also notes that invalid pointers or access beyond valid objects remain undefined. `memmove` solves overlap only. It does not check capacity, append a terminator, or extend object lifetime.

The slides convert a Pascal string to a C string in place. Byte zero holds the length and characters begin at index one, so source `s + 1` overlaps destination `s`:

```c
void pascal_to_c_string(char *s) {
    size_t len = (unsigned char)s[0];
    memmove(s, s + 1, len);
    s[len] = '\0';
}
```

Using `memcpy` is not justified because one observed implementation happened to copy forward. Overlap violates its precondition, and an optimizer may exploit the nonoverlap promise. Conversely, when nonoverlap is proven, `memcpy` expresses that contract clearly and leaves room for optimization. The choice is not that `memmove` is universally safer; it should match the known range relationship.

The Pascal example also requires enough capacity to write `s[len]`. Interpreting `s[0]` deserves care because signed `char` can turn a large byte length into a negative value and then a huge `size_t`. The slide constrains length to one byte, while a real interface should still carry capacity or use an explicitly unsigned byte type.

## Keep the data type fixed first and locate bubble sort's hard-coded policy

Bubble sort repeatedly scans adjacent pairs and swaps pairs that are out of order. A complete pass with no swaps terminates the algorithm. The first pass places the largest element at the end, and subsequent passes fix at least one more trailing position, so an array of length `n` needs at most `n - 1` productive passes plus the no-swap observation used for early termination.

```c
void bubble_sort_int(int arr[], size_t n) {
    while (true) {
        bool swapped = false;
        for (size_t i = 1; i < n; i++) {
            if (arr[i - 1] > arr[i]) {
                swap(&arr[i - 1], &arr[i], sizeof(arr[0]));
                swapped = true;
            }
        }
        if (!swapped) return;
    }
}
```

Traversal, adjacent addressing, and exchange are common mechanism. The hard-coded part is `>`: it assumes both `int` elements and ascending order. A Boolean `ascending` merely chooses between two policies. An enum continues adding library cases for odd-before-even, absolute-value order, or a structure field, moving client policy back into common mechanism.

Extracting a globally named `should_swap` is not enough either. It separates a function syntactically, but each call still gets the one global behavior. To sort three arrays three different ways within one executable, the algorithm must accept the function to invoke for this call as a value.

## Function pointers turn behavior into a parameter

The third parameter can be a pointer to a function taking two `int` values and returning `bool`:

```c
void bubble_sort_int(
    int arr[],
    size_t n,
    bool (*should_swap)(int, int)
) {
    while (true) {
        bool swapped = false;
        for (size_t i = 1; i < n; i++) {
            if (should_swap(arr[i - 1], arr[i])) {
                swap(&arr[i - 1], &arr[i], sizeof(arr[0]));
                swapped = true;
            }
        }
        if (!swapped) return;
    }
}
```

The parentheses matter. `bool *should_swap(int, int)` declares a function returning `bool *`; `bool (*should_swap)(int, int)` declares a pointer to a function. A typedef can reduce declarator noise:

```c
typedef bool (*int_swap_predicate)(int, int);

void bubble_sort_int(int arr[], size_t n,
                     int_swap_predicate should_swap);
```

A function designator converts to a function pointer in this context, so passing `sort_ascending` does not require `&sort_ascending`. Calling `should_swap(a, b)` likewise need not be written as `(*should_swap)(a, b)`. Both forms describe the same operation; the concise forms are conventional.

This callback's contract is not a conventional three-way comparator. It answers whether this pair is out of order and should be exchanged. An ascending callback therefore returns true when the left value is greater:

```c
bool sort_ascending(int one, int two) {
    return one > two;
}

bool sort_descending(int one, int two) {
    return one < two;
}

bool sort_abs(int one, int two) {
    return abs(one) > abs(two);
}
```

Names and contracts must be read together or the polarity between “comes before” and “should swap” is easy to reverse. `sort_abs` also has an integer edge case: the magnitude of the minimum representable negative `int` cannot be represented as positive `int`. Inputs that may include it require an overflow-safe magnitude comparison rather than copying the classroom example unchanged.

## A callback separates mechanism from policy, but types must still match

The sorting function owns mechanism: traversal, adjacent pairs, exchange, and termination. The callback owns policy: the meaning of out of order. A caller chooses a different function per invocation without editing the sort. “Callback” captures the control flow: when the library reaches a domain-specific decision, it calls back into client-supplied code.

A function pointer is not an untyped address accepting arbitrary functions. Parameter and return types must be compatible. Casting an incompatible function and calling it does not become portable merely because the machine address exists. Object pointers and function pointers are distinct categories as well; `void *` is a generic object address, not therefore a standard-C generic function pointer.

A callback can read global state, perform I/O, or even mutate the array, but capability is not permission. If results vary for the same pair, bubble sort may fail to converge. A sound ordering callback should be consistent, avoid side effects on the array, and return false for equivalent elements. The function type checks the shape of parameters and result, not those semantic rules, so documentation must carry them.

## Compare with standard-library `qsort`: the other half arrives next lecture

The final lecture version generalizes ordering policy while data remains `int[]`. Standard-library [`qsort`](https://en.cppreference.com/w/c/algorithm/qsort.html) shows the shape of fully generic C sorting: the base is `void *`, the caller supplies element count and width, and a comparator receives two `const void *` values and returns a negative, zero, or positive integer.

```c
void qsort(void *ptr, size_t count, size_t size,
           int (*comp)(const void *, const void *));
```

Its comparator contract differs from the lecture's Boolean predicate. A negative `qsort` result places the first element before the second, zero marks equivalence, and a positive result places it after. A `bool should_swap` function cannot be substituted directly. Implementing the result as `a - b` can also overflow; relational comparisons build the three-way result safely:

```c
int compare_ints(const void *lhs, const void *rhs) {
    int a = *(const int *)lhs;
    int b = *(const int *)rhs;
    return (a > b) - (a < b);
}
```

The comparison places both generic axes side by side. `void * + count + size` lets an algorithm locate an arbitrary object sequence, while a function pointer asks the client how to order two objects. Lecture 12 develops both ingredients but intentionally stops at integer bubble sort; the next lecture combines byte-wise element addressing with a generic comparator.

## From a type-safety perspective, this is a deliberate trade

Typed `swap_ends_int` lets the compiler check pointer types, scale arithmetic correctly, and tell a reader what elements are present. Generic `swap_ends` removes duplicated code but moves proof obligations to the caller: `base` must designate writable live contiguous storage, `len * elem_size` must not overflow, the final address must stay within the object, and width must match the actual element.

Function pointers make the same trade. The compiler checks callback signature but cannot establish that the predicate is stable or defines a sortable relationship. A good C API therefore documents more than a prototype: whether units are bytes or elements, whether an end pointer is inclusive or one-past, whether true means “before” or “swap,” and whether ranges may overlap.

A practical exercise is to take one typed array helper and mark the three forms of knowledge it uses: element address, element width, and element-specific policy. Byte pointers plus width can compute addresses; byte copies can move data; callbacks can inject policy. If a condition cannot be derived from the prototype, promote it to a parameter, assertion, or explicit contract instead of expecting `void *` to remember the type.

## The mental model worth keeping

1. `void *` is the address of an object with unknown type, not an iterator over unknown-width elements. Traversal requires a separate width and byte-pointer arithmetic.
2. Generic byte algorithms move object representations. They do not understand fields, string contents, or ownership, so width, range, and lifetime remain caller obligations.
3. `memcpy` requires nonoverlapping ranges; `memmove` defines the overlapping case. Select by a proven relationship, not one observed copy direction.
4. A function pointer turns client-specific behavior into a parameter. Callbacks prevent mechanism from enumerating every policy, but signatures and semantic contracts must match.
5. Fully generic C sorting needs both abstractions: `void * + size` abstracts data and a comparator callback abstracts behavior. Each removes type information and therefore demands a more precise interface.

Lecture 12 is not primarily a clever bubble-sort demonstration. It shows how C builds reusable boundaries without language-level generics: retain common work in the library and return unknowable width and decisions to the caller. The less the type system preserves automatically, the less vague the contract may be.

## References

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 12: C Generics and Function Pointers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/12/Lecture12.pdf)
- [cppreference: Pointer declaration](https://en.cppreference.com/w/c/language/pointer.html)
- [POSIX: memmove](https://pubs.opengroup.org/onlinepubs/9799919799/functions/memmove.html)
- [cppreference: memmove](https://en.cppreference.com/w/c/string/byte/memmove.html)
- [cppreference: qsort](https://en.cppreference.com/w/c/algorithm/qsort.html)
