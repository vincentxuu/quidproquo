---
title: "Stanford CS107 Lecture 8: A Pointer Is Not Magic, but a Copyable Address"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, pointers]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 9
tldr: "CS107 Lecture 8 starts with address-of and dereference, explains why C pointer parameters are still passed by value, and shows how int *, char *, and char ** can modify caller-owned ints, chars, and pointers respectively."
description: "A section-by-section reading of Stanford CS107 Winter 2026 Lecture 8: memory addresses, pointer declarations, aliases, pointer parameters, char **, typed swaps, and rotation."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-pointer-introduction)

C pointers are often taught as punctuation: add a star to a declaration, add `&` at the call site, and add `*` when using the result. That does not answer the important questions. Which memory location changed? Why can a pointer parameter still fail to update the caller's pointer?

Lecture 8 of Stanford CS107 Winter 2026 restores the simplest useful model: a pointer is a value, and that value is the memory address of an object. C passes every parameter by value. Passing a pointer copies an address rather than the target object, so the callee can follow that copied address back to caller-owned storage. The lecture's path from `int *` to `char **` keeps asking one question: are you trying to modify a value, a pointer, or the value designated by a pointer?

## Lecture metadata and scope

- Course: Stanford CS107: Computer Organization & Systems
- Term: Winter 2026
- Official lecture: Lecture 8, 2026-01-23
- Official title: Introduction to Pointers
- Instructor: the course archive lists Jerry Cain; this lecture PDF does not separately identify a speaker, so this article makes no further attribution
- Materials read: the official calendar, all 22 pages of the lecture slides, the GNU C Language Manual sections on pointers and dereferencing, and the SEI CERT C null-pointer rule
- Missing materials: Canvas recordings, in-class demo code, AFS lecture code, and starter repositories are not public; this article reconstructs the complete public-slide agenda and is not a transcript

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) places this lecture after C strings and buffer overflows and before pointers and arrays. That ordering matters: the previous lectures used `char *` repeatedly, and this one finally disassembles it. According to the [official Lecture 8 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/08/Lecture08.pdf), the full route is a C++ reference review, C pointer memory diagrams, pointer-parameter exercises, modifying a pointer through `char **`, and finally strongly typed swaps and rotation.

## From a C++ reference back to C

The slides first revisit C++ pass-by-reference. A helper that changes the caller's `x` from 2 to 3 can declare a reference parameter:

```cpp
void func(int& num) {
    num = 3;
}

int main() {
    int x = 2;
    func(x);
    // x is now 3
}
```

Inside the function, `num` behaves like another name for `x`. The caller does not spell out an address, and the function does not explicitly dereference one. C lacks this C++ reference syntax, but the need to modify an existing caller-owned object remains. C makes the location part of the interface:

```c
void func(int *num) {
    *num = 3;
}

int main(void) {
    int x = 2;
    func(&x);
    printf("%d\n", x);  // 3
    return 0;
}
```

`x` is an `int` object. `&x` is its address and has type `int *`. `num` receives a copy of that address. Only `*num` denotes the destination `int`. The assignment does not store 3 inside the pointer; it follows the pointer to `x` and stores 3 there.

## `&` produces an address; `*` follows one to an object

The [GNU C Language Manual pointer chapter](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointers.html) describes a pointer as a value that records where data is stored and emphasizes that its type includes the type of the referenced data. A minimal example separates four operations:

```c
int score = 17;
int *p = &score;
int observed = *p;
*p = 29;
```

The first line creates an `int` object. The second applies address-of to `score` and stores the result in `p`. The third reads the object designated by `p`, so `observed` receives 17. The fourth changes that same object to 29; reading `score` directly now also yields 29.

Both objects have storage and addresses of their own:

```text
address      object      stored value
0x1f0        score       17
0x310        p           0x1f0
```

`p` is not a free-floating arrow. It is a variable, perhaps at `0x310`, whose contents happen to be `score`'s address, `0x1f0`. Thus `p`, `&p`, and `*p` ask different questions: `p` evaluates to `0x1f0`; `&p` produces the pointer object's own location, `0x310`; and `*p` denotes the `int` at `0x1f0`.

The same star has different grammatical jobs in a declaration and an expression:

```c
int *p;         // declaration: p has type pointer to int
int value = *p; // expression: read the int designated by p
```

Read outward from the name: `p` is a pointer to `int`. The [GNU pointer declaration chapter](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Declarations.html) also notes that placing the star next to the type or the name is merely formatting; `int *p` and `int* p` mean the same thing. A multiple declaration is the real trap:

```c
int *first, second;
```

Only `first` is an `int *`; `second` is an `int`. Declaring one variable per line, or writing a star for every pointer declarator, is safer than inferring types from visual grouping.

## Aliasing: two pointers can lead to one object

Pointer assignment copies an address, not the target object:

```c
int total = 5;
int *left = &total;
int *right = left;

*right = 12;
printf("%d %d\n", total, *left); // 12 12
```

`left` and `right` are distinct pointer variables, but both contain `total`'s address. Multiple access paths to one object are aliases. `*right = 12` changes their shared target, so later reads through `total` or `*left` both see 12. By contrast, `right = NULL` changes only `right`; it does not erase `total`, and `left` retains the original address.

For each assignment, say which level appears on the left:

```c
right = left;   // copy an address into a pointer variable
*right = *left; // copy an int into an int object
```

The first changes a pointer value. The second changes an object designated by a pointer. Two stars separate memory effects that are entirely different.

## A pointer parameter is still passed by value

The lecture's central statement is that all C parameters are passed by value. `func(&x)` does not activate another parameter-passing mode. It evaluates `&x` and copies the resulting address into `num`.

If `x` lives at `0x1f0`, the call can be drawn this way:

```text
main frame                     func frame
x at 0x1f0: 2                 num at 0x010: 0x1f0
```

`num` and `x` do not share a cell and do not even have the same type: the former is an `int *`, the latter an `int`. What they share is a relationship—the contents of `num` equal the location of `x`. Executing `num = NULL` changes only the callee's parameter copy. Executing `*num = 3` follows the address and changes the caller's `x`.

This gives a practical interface rule. Pass a small value directly when a helper only needs to read it. Pass an object's location when the helper must modify that specific existing object. A pointer parameter is not an exotic calling convention; it is an ordinary value that carries a shared access path.

## First etude: modifying the caller's character with `char *`

The slides' `flip_case` changes one caller-owned character in place:

```c
void flip_case(char *cp) {
    if (isupper((unsigned char)*cp)) {
        *cp = (char)tolower((unsigned char)*cp);
    } else if (islower((unsigned char)*cp)) {
        *cp = (char)toupper((unsigned char)*cp);
    }
}

int main(void) {
    char ch = 'g';
    flip_case(&ch);
    printf("%c\n", ch); // G
}
```

The three syntactic choices follow from types. The object to modify is `char ch`, so the caller supplies `&ch`. That expression has type `char *`, so the parameter is `char *cp`. The target character must be classified and written, so the function uses `*cp`. This derivation is sturdier than memorizing where stars go: name the object to share, take its address, and receive it with the matching type.

## Second etude: why `char *` cannot update the caller's `char *`

The slides then deliberately present a broken `skip_spaces`:

```c
void skip_spaces(char *s) {
    s += strspn(s, " ");
}

int main(void) {
    char *str = "            hello";
    skip_spaces(str);
    printf("%s\n", str); // still includes spaces
}
```

The `strspn` calculation may be completely correct while the program still misses its goal. `s` receives a copy of the address stored in `str`. Advancing `s` changes only the callee's local pointer. That copy disappears at return, and the caller's `str` was never written.

This does not contradict `func(int *num)`. That example modified an `int`, so `int *` provided a path to it. This example must modify an object whose type is itself `char *`. The address of `char *str` therefore has type `char **`:

```c
void skip_spaces(char **p_str) {
    *p_str += strspn(*p_str, " ");
}

int main(void) {
    char *str = "            hello";
    skip_spaces(&str);
    printf("%s\n", str); // hello
}
```

Now `&str` identifies the caller's pointer object, `p_str` stores that location, and `*p_str` denotes the original `char *str`. The compound assignment changes the address stored in `str`. One more dereference, `**p_str`, would reach a `char`. Star count is not a badge of difficulty; it counts the indirections between the current value and the intended object.

The rule can be summarized by type:

| Function parameter | Caller-owned object it can modify through that parameter |
|---|---|
| `int *` | `int` |
| `char *` | `char` |
| `char **` | `char *` |

This table does not say a function must modify the object, nor that every supplied address is valid. It only states the access level permitted by the type.

## Dereference has preconditions

The beginner's model says a pointer stores an address, but not every bit pattern is safe to use as one. The [GNU pointer dereference chapter](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Dereference.html) distinguishes the pointer value from the object it designates: `*` may read or write only when the pointer leads to accessible data of the appropriate type.

The clearest counterexample is a null pointer:

```c
int *p = NULL;
*p = 42; // invalid
```

The [SEI CERT C EXP34-C rule](https://wiki.sei.cmu.edu/confluence/display/c/EXP34-C.+Do+not+dereference+null+pointers) requires validation before dereferencing when null is possible. Null does not designate an `int` object whose value is zero; it is a pointer value deliberately indicating no object. A pointer into expired storage, one outside its permitted array range, or one forced into an incompatible interpretation is likewise not made valid merely because the syntax compiles.

```c
void set_score(int *score) {
    if (score != NULL) {
        *score = 42;
    }
}
```

Whether null is accepted belongs to the function's interface. If it is valid input, check it and define the behavior. If it is forbidden, callers must maintain that precondition. Either way, `*p` is not an unconditional “fetch” instruction. It asserts that `p` currently designates an accessible object.

## Strongly typed swap changes targets, not parameter copies

The lecture closes by using the model in a useful function:

```c
void swap_ints(int *one, int *two) {
    int temp = *one;
    *one = *two;
    *two = temp;
}

int x = 17;
int y = 29;
swap_ints(&x, &y);
```

`one` and `two` are still copied addresses, but `*one` and `*two` designate the caller's integers. If the temporary were mistakenly a pointer, or an assignment lost its star, the function would move local addresses instead of swapping target integers.

The string example swaps `char *` variables rather than copying string contents:

```c
void swap_strings(char **one, char **two) {
    char *temp = *one;
    *one = *two;
    *two = temp;
}
```

For `swap_strings(&h, &w)`, the parameters point to the caller's pointer variables. The function exchanges two address values, so `h` and `w` end up designating each other's original strings; no string bytes move. This is a typed swap: exchanging `int` needs `int *`, exchanging `char *` needs `char **`, and the temporary has the target type.

Two swaps then build a three-way rotation:

```c
void rotate(char **p, char **q, char **r) {
    swap_strings(p, q);
    swap_strings(p, r);
}
```

Starting with `p -> Fred`, `q -> Wilma`, and `r -> Pebbles`, the first swap yields `Wilma, Fred, Pebbles`; the second swaps `p` and `r`, yielding `Pebbles, Fred, Wilma`. Rather than simulating names mentally, write down which address each pointer holds after each step. That prevents “moving strings” from being confused with rewiring pointers.

Strong typing tells the compiler how many bytes a dereference accesses and lets it reject incompatible arguments. Its cost is a different swap for `int`, `double`, structures, and pointers. That is the problem later `void *` generics inherit: what can code do when it knows a location and size, and what type information does it lose?

## A practical pointer-tracing method

Use this process on the next pointer exercise:

1. List each object's name and type, such as `x: int`, `p: int *`, and `pp: int **`.
2. Draw a separate storage cell for every object; a pointer gets its own cell too.
3. At `&x`, write “produce x's address,” not “turn x into a pointer.”
4. At `*p`, first verify which valid address `p` contains, then move to that target cell.
5. At a function call, create a new cell for each parameter and copy the argument value into it.
6. At an assignment, identify whether the left side is a pointer variable or the object it designates.

## What to retain from Lecture 8

First, a pointer is a typed address value and an independent variable. `p` stores a destination, `&p` is the pointer's own location, and `*p` denotes the destination object.

Second, C does not switch to pass-by-reference merely because a parameter is a pointer. A function receives an address copy. It can alter caller state because that copy still leads to the same object. Changing the local pointer and changing its target are separate operations.

Third, pass the address of the caller-owned object you actually need to modify. Modifying an `int` uses `int *`; modifying a `char` uses `char *`; modifying a `char *` itself uses `char **`.

Fourth, dereferencing is a validity claim, not just syntax. The address must designate an accessible, live object that may be accessed with that type. A null pointer cannot be dereferenced.

Finally, swap and rotation show the concrete power of pointers: a function can precisely modify objects selected by its caller. The cost is equally precise. Caller and callee must jointly maintain the contract for type, lifetime, and address validity. When the next lecture connects pointers to arrays, tracing storage one cell at a time will remain more dependable than any slogan.

## References

- [Stanford CS107 Winter 2026 calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 8: Introduction to Pointers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/08/Lecture08.pdf)
- [GNU C Language Manual: Pointers](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointers.html)
- [GNU C Language Manual: Pointer Declarations](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Declarations.html)
- [GNU C Language Manual: Pointer Dereference](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Dereference.html)
- [SEI CERT C: EXP34-C. Do not dereference null pointers](https://wiki.sei.cmu.edu/confluence/display/c/EXP34-C.+Do+not+dereference+null+pointers)
