---
title: "Stanford CS107 Lecture 9: An Array Is Not a Pointer, but They Cooperate in Expressions"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, pointers, arrays]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 10
tldr: "CS107 Lecture 9 uses seven C-string rules to separate array objects, pointer variables, and string literals: arrays often convert to first-element pointers in expressions, but storage, assignment, mutability, and sizeof remain different."
description: "A lecture-by-lecture reading of Stanford CS107 Winter 2026 Lecture 9: arrays and pointers, array-to-pointer conversion, string literals, pointer arithmetic, suffixes, and cross-function aliasing."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-pointers-and-arrays)

“An array is a pointer” is a half-truth. `arr[i]` and `*(arr + i)` select the same element, and a function parameter receives only the first-element address. Yet an array owns element storage while a pointer variable stores an address. The array is not assignable, and `sizeof` in its declaring scope measures the whole array; the pointer behaves differently.

Lecture 9 organizes the traps as “Seven Commandments of C Strings.” For every expression, ask whether it is an array object or pointer value, where the characters live, whether storage is mutable, and whether the pointer may be redirected.

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official unit: Lecture 9, January 26, 2026
- Calendar title: Pointers and Arrays
- Slide title: Arrays and Pointers
- Instructor: the syllabus lists Jerry Cain; the PDF names no separate speaker
- Read in full: calendar, 26 slides, three cppreference pages, and SEI CERT STR30-C
- Missing: Canvas video and lecture code; classroom discussion is not reconstructed

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) covers array/pointer conversion and contiguous memory. Seven rules structure the lecture: local `char[]` is mutable; array names are not assignable; arrays usually convert to pointers; literals are immutable; pointers are assignable; offsets form suffixes; and mutation through an aliasing parameter persists.

## Separate three things first: array object, pointer variable, string literal

```c
char fruit[] = "apple";
char *food = fruit;
const char *label = "apple";
```

`fruit` is a six-element array object containing five letters and `\0`; its declaration reserves all element storage. `food` is a separate pointer variable storing `&fruit[0]`. `label` is another pointer, this time to an array created by a string literal with static storage duration.

The [cppreference array page](https://en.cppreference.com/w/c/language/array.html) defines an array as a contiguously allocated, nonempty sequence of one element type whose element count does not change during its lifetime. A pointer value instead designates an object or a position one past an array; a pointer variable may later store another address.

Confusion arises because `fruit` converts to a first-element pointer in most expressions, often yielding the same address value as `food`. Equal results in one expression do not make the objects the same kind.

## Rule one: local `char[]` owns mutable elements

```c
char str[6];
strcpy(str, "apple");

char other[] = "apple";

str[0] = 'A';
other[4] = 'y';
```

Both declarations create modifiable arrays. In the second, a literal initializes a new array including its terminator; `other` does not remain a pointer to the literal. The slides place these local bytes in the declaring function's stack frame.

More generally, mutability follows the actual object and qualifiers, not a guessed segment. Local non-`const` arrays are the clean example, while static arrays and heap allocations may also be writable. `char str[] = "apple"` infers capacity 6. A five-element declaration leaves no terminator; writable storage does not remove bounds.

## Rule two: an array name cannot be reassigned

```c
char good[12];
strcpy(good, "Dr. Jekyll");

char evil[] = "Mr. Hyde";
good = evil; // compile-time error
```

`good` is not a pointer variable awaiting a new address; it is an allocated twelve-element object. The [cppreference array assignment section](https://en.cppreference.com/w/c/language/array.html) states that array objects are not modifiable lvalues and cannot be direct operands of assignment, although an array inside a structure is copied with the whole structure.

Copy contents with a capacity-proven operation. To redirect a name, use a pointer:

```c
char *current = good;
current = evil;
```

This changes only `current`'s address. It neither moves nor copies characters; both arrays remain fixed-size objects.

## Rule three: array-to-pointer conversion happens in most expressions, not all

```c
void fun_times(char *str) {
    /* str stores an address */
}

int main(void) {
    char local_str[5] = "rice";
    fun_times(local_str);
}
```

The call does not copy five elements. `local_str` converts to a first-element pointer, whose address value is passed to `str`. Writing the parameter as `char str[]` changes nothing; function parameter array declarators adjust to pointer type.

The [cppreference conversion rules](https://en.cppreference.com/w/c/language/array.html) are more precise: except in contexts such as operands of `&`, `sizeof`, and `typeof`/`typeof_unqual`, or a literal initializing a character array, an array expression converts to a non-lvalue pointer to its first element. The exceptions disprove “always a pointer.”

```c
char local_str[5] = "rice";

sizeof local_str; // 5
&local_str;       // char (*)[5], pointer to whole array
local_str + 2;    // pointer to local_str[2]
```

`local_str` and `&local_str[0]` yield the same start address in value contexts. `&local_str` usually has the same numeric address but a different type and stride: adding one crosses the entire array. That is why the slide calls `char *food = &fruit;` misleading—the type difference must not be erased.

## `sizeof` is the practical counterexample: before and after a call differ

```c
void inspect(char items[]) {
    printf("%zu\n", sizeof items); // sizeof(char *)
}

int main(void) {
    char items[40];
    printf("%zu\n", sizeof items); // 40
    inspect(items);
}
```

In `main`, `items` remains an array operand and `sizeof` measures all bytes. In `inspect`, `char items[]` was adjusted to `char *items`; only pointer size remains. Capacity was not lost dynamically—the function type never carried it.

A bounds-aware interface must receive a count or byte capacity:

```c
void inspect(char *items, size_t capacity);
```

The caller can pass `sizeof items` while it still has the array object. Never reconstruct capacity with `sizeof parameter`.

## Rule four: a string literal creates an array, but modifying it is undefined

```c
char salutation[] = "Good day!";
char *greeting = "Hello, world!";

salutation[3] = 'f'; // valid
greeting[0] = 'h';   // undefined behavior
```

C may compile the second write, but that grants no permission. The [cppreference string-literal page](https://en.cppreference.com/w/c/language/string_literal.html) says modifying a literal-created array is undefined and whether identical literals share storage is unspecified. [SEI CERT STR30-C](https://wiki.sei.cmu.edu/confluence/display/c/STR30-C.+Do+not+attempt+to+modify+string+literals) therefore recommends assigning literals only to pointers to `const char`.

```c
const char *greeting = "Hello, world!";
```

Now the compiler rejects the write. Undefined behavior does not guarantee a segmentation fault, and no reliable runtime probe universally decides whether an arbitrary `char *` points to writable storage.

This property follows interior pointers. CERT notes that if `strchr`, `strrchr`, or `strstr` receives a literal, its returned pointer still addresses the same unmodifiable storage. A historically non-const return type does not grant mutation rights.

## A mutating function must state mutability as a precondition

```c
void capitalize(char *text) {
    text[0] = (char)toupper((unsigned char)text[0]);
}
```

`capitalize` cannot inspect an address and reliably distinguish a writable array, heap buffer, or literal hidden behind non-const `char *`. Its contract must require at least one writable character with a valid lifetime; empty strings need a terminator check.

A read-only function accepts `const char *`, allowing mutable arrays and literals while preventing writes through that parameter. If output must change without requiring mutable input, accept source, destination, and capacity explicitly.

## Rule five: pointer variables are assignable because they store addresses

```c
const char *elphaba = "Idina Menzel";
const char *understudy = "Shoshana Bean";
elphaba = understudy;
```

After assignment both pointers store the same address. No characters in `"Idina Menzel"` were overwritten and no string copy occurred; only navigation changed.

```c
char fruit[] = "apple";
char *food = fruit;
char *same = &fruit[0];
```

Both pointers alias `fruit[0]`. Writing a valid index changes the array. Redirecting a pointer does not. Keep two operations separate: `food = other` modifies the pointer value; `food[0] = 'A'` modifies the pointee.

## Rule six: pointer arithmetic scales by element type and stays within one array

```c
const char *a = "peach";
const char *b = a + 1;
const char *c = a + 3;

printf("%s\n", a); // peach
printf("%s\n", b); // each
printf("%s\n", c); // ch
```

Adding one to `char *` moves one `char`; adding one to `int *` moves one `int`. The [cppreference pointer-arithmetic rules](https://en.cppreference.com/w/c/language/operator_arithmetic.html) require results to designate an element of the same array object or exactly one-past its end. One-past is useful as an endpoint but cannot be dereferenced.

`a + 5` points to the terminator and prints an empty suffix. `a + 6` is one-past the whole array and is not a C string: no readable terminator belongs to the array from that start. Arithmetic farther away exceeds the same-array rule.

A suffix offset must land on a visible character or terminator while the original object remains alive. Pointer values carry no capacity; other information must prove the offset.

## `arr[i]` equals `*(arr + i)` without making arrays and pointers one type

```c
const char *str = "booze";
char ch1 = str[4];
char ch2 = *(str + 4);
char ch3 = *(4 + str);
char ch4 = 4[str];
```

All four retrieve `'e'`. Subscripting is defined through pointer addition and dereference, so commutative addition even permits the bizarre `4[str]`. The slides advise against it: valid syntax is not clear syntax.

This equivalence explains element access only. It does not turn an array object into a pointer variable or erase `sizeof`, assignment, and `&array` behavior. Think of the array as providing a first-element pointer when an expression needs one; the original array remains an array.

## Rule seven: a parameter copies an address, so mutation through the alias persists

```c
void func(char *s) {
    s[4] = 'k';
}

int main(void) {
    char str[] = "spare";
    func(str);
    printf("%s\n", str); // spark
}
```

C remains pass-by-value. The value copied is `&str[0]`, not the whole array. Callee `s` and caller `str` designate the same elements, so `s[4]` changes the original byte. Destroying the local pointer parameter on return does not undo the write.

If the callee executes `s = other`, it changes only its pointer copy. Changing the caller's pointer variable requires pointer-to-pointer—another indirection, distinct from modifying a pointee.

Lifetime still matters. A function may use a passed local-array address during the call; retaining it after the declaring function returns creates a dangling pointer. Aliasing does not extend object lifetime.

## Reduce seven rules to three decisions

First, identify expression type and conversion. Is the source an array object, pointer variable, or literal-created array? Does this context trigger conversion? `sizeof` and `&` are common exceptions.

Second, identify storage and mutability. An assignable pointer does not imply a writable pointee, and `char *` cannot erase a literal's status. A mutating API requires caller-provided writable storage.

Third, prove bounds and lifetime. Pointer arithmetic is defined only within one array and one-past; one-past cannot be dereferenced. A suffix must reach a terminator within valid storage while the object remains alive.

During review, annotate each `char *` with source object, mutability, known capacity, and lifetime. If one field is guesswork, the interface lacks information or a documented precondition.

Lecture 9 does not erase the array-pointer distinction; it explains their cooperation. An array provides contiguous storage, conversion provides a first-element address, pointer arithmetic navigates, and dereference accesses an element. Separating those steps keeps `arr[i]` convenience from hiding its memory contract.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 9: Arrays and Pointers (PDF)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/09/Lecture09.pdf)
- [cppreference: Array declaration](https://en.cppreference.com/w/c/language/array.html)
- [cppreference: String literals](https://en.cppreference.com/w/c/language/string_literal.html)
- [cppreference: Arithmetic operators and pointer arithmetic](https://en.cppreference.com/w/c/language/operator_arithmetic.html)
- [SEI CERT STR30-C: Do not attempt to modify string literals](https://wiki.sei.cmu.edu/confluence/display/c/STR30-C.+Do+not+attempt+to+modify+string+literals)
