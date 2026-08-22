---
title: "Stanford CS107 Lecture 6: A C String Is Not a Type but a Memory Contract"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, c-strings]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 7
tldr: "CS107 Lecture 6 reduces C strings to character arrays, a terminator, and an address: every convenience in strlen, strcmp, strcpy, strncpy, and strcat depends on the caller preserving capacity and termination invariants."
description: "A lecture-by-lecture reading of Stanford CS107 Winter 2026 Lecture 6: char, ASCII, ctype.h, null-terminated strings, string functions, suffix pointers, and the string-diamond exercise."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-chars-c-strings)

Lecture 6 reduces text to its memory representation. C has no built-in string type: a string is a `char` sequence plus an agreement that zero marks the end.

The programmer owns length, bounds, and capacity. Miss one `\0` and the array still exists but string functions cannot safely consume it. Whenever `char *` appears, ask where the string ends, how large the destination is, and who may modify it.

## Materials and scope

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official unit: Lecture 6, January 16, 2026
- Official title: Chars and C-Strings
- Instructor: the syllabus lists Jerry Cain; the PDF names no separate speaker
- Read in full: calendar, 20 slides, and the listed POSIX Issue 8 specifications
- Missing: Canvas video, classroom demos, and AFS code; this is not a transcript

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) opens Topic 2 here. The agenda is `char`, escapes, ASCII, `ctype.h`, null termination, length and capacity, comparison/copy/concatenation, parameter passing, suffix pointers, and the string diamond.

## A `char` is a small integer; “character” is our interpretation

```c
char letter = 'M';
char plus = '+';
char space = ' ';
char newline = '\n';
char tab = '\t';
char quote = '\'';
char backslash = '\\';
```

Single quotes form character constants. Backslash escapes represent newline, tab, quotes, and a backslash itself. In the lecture's ASCII model, the underlying `char` is a one-byte integer: `'A'` is 65, `'a'` is 97, and `'0'` is 48. Uppercase letters, lowercase letters, and digits occupy contiguous ranges.

ASCII is a 7-bit set, and this lecture teaches the C-string contract rather than Unicode. Chinese and emoji break “one `char` per glyph”; `strlen` counts bytes, not user-perceived characters.

`ctype.h` supplies `isalpha`, `islower`, `isupper`, `isspace`, `isdigit`, `toupper`, and `tolower`, avoiding hand-coded ASCII ranges. The [POSIX character-classification contract](https://pubs.opengroup.org/onlinepubs/9799919799/functions/isalnum.html) adds two boundaries: classification depends on the current locale, and the argument must be representable as `unsigned char` or equal to `EOF`. For a possibly negative plain `char`, cast first:

```c
unsigned char ch = (unsigned char)text[i];
if (isalpha(ch)) {
    text[i] = (char)toupper(ch);
}
```

The slides stay with ASCII letters and do not digress into locale or signedness. The specification still reminds us that even a convenience API has preconditions.

## The substance of a C string: a `char` array and a sentinel

The essential part of `"Hello"` is not merely its five visible letters. A zero-valued `\0` follows them:

```text
index   0    1    2    3    4     5
value  'H'  'e'  'l'  'l'  'o'  '\0'
```

`\0` is the null character, null byte, or zero byte. It is not `'0'`, whose ASCII value is 48, and it is not a null pointer. One is a terminating byte inside a string; the other is a pointer value that points to no object.

This is the lecture's “agreement.” Given `char *`, the type says only “address of a character.” It carries neither capacity nor a stored length. A function treats subsequent bytes as a string because the caller promises that a `\0` occurs within readable storage. Thus `char data[5] = {'H', 'e', 'l', 'l', 'o'};` is a valid array but not a C string. `printf("%s", data)` cannot infer that index 4 is the boundary.

Capacity follows immediately. Five visible characters need at least six slots:

```c
char exact[6] = "hello";
char roomy[12] = "hello";
```

Both strings currently have length 5; their capacities are 6 and 12. The spare space in `roomy` might hold later concatenation, but it does not make `strlen(roomy)` return 12. String length, allocated capacity, and bytes required including the terminator are separate quantities.

## `strlen` reads no length field; it searches for zero

The [POSIX `strlen` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strlen.html) says it computes the bytes in the string, excluding the terminating NUL. Read backward, the input must already be a NUL-terminated string. `strlen` receives no capacity and reserves no error return. If no terminator exists in readable bounds, it continues beyond the array and behavior is undefined.

```c
char text[9] = "Hi earth";
text[2] = '\0';
printf("%s, %zu\n", text, strlen(text));
```

This prints `Hi, 2`. The `earth` bytes were not erased; the first `\0` merely shortened the visible string. C-string length is the distance from the starting pointer to the first zero byte, not the total amount of meaningful data in the array.

Because length is not stored, `strlen` scans linearly. Calling it in every loop condition repeats that scan:

```c
for (size_t i = 0; i < strlen(text); i++) {
    /* use text[i] */
}
```

If the loop cannot move the terminator, cache the result:

```c
size_t length = strlen(text);
for (size_t i = 0; i < length; i++) {
    /* use text[i] */
}
```

This is a direct cost of the representation: without a length field, consumers must scan or retain the answer themselves.

## `strcmp` compares contents; `==` on `char *` compares addresses

C strings often appear as pointers, so `left == right` asks whether two addresses are equal, not whether two byte sequences spell the same text. Distinct arrays may both contain `"cat"`. Use `strcmp` for contents:

```c
int cmp = strcmp(left, right);
if (cmp == 0) {
    /* equal contents */
} else if (cmp < 0) {
    /* left comes first */
} else {
    /* right comes first */
}
```

The [POSIX `strcmp` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcmp.html) promises only less than, equal to, or greater than zero. The sign comes from the first differing pair of bytes interpreted as `unsigned char`. Code that tests `strcmp(a, b) == -1` assumes a particular magnitude the contract never guarantees.

The slides call this lexicographic order, but it is not full natural-language collation. It compares byte sequences until the first difference or terminator; it does not supply locale-aware ordering for Chinese or accented text.

## `strcpy` copies the terminator but knows nothing about destination capacity

```c
char orig[6];
strcpy(orig, "hello");

char clone[6];
strcpy(clone, orig);
clone[0] = 'c';
```

`orig` remains `"hello"`; `clone` becomes `"cello"`. The bytes were copied into separate storage. The [POSIX `strcpy` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcpy.html) explicitly includes the terminating NUL and says overlapping source and destination objects produce undefined behavior.

The danger is visible in `strcpy(dst, src)`: there is no capacity argument. The function cannot know how many slots `dst` owns. It trusts the caller to provide at least `strlen(src) + 1` bytes:

```c
char tiny[6];
strcpy(tiny, "hello, world!");
```

This does not truncate. It writes outside the array—a buffer overflow. The write may corrupt adjacent data, other locals, or information later used for control flow. The portable conclusion is not which value will break on one run; it is that once the first out-of-bounds write occurs, C no longer guarantees normal behavior.

## `strncpy` is not an automatically safe `strcpy`

The name invites a dangerous shortcut. `strncpy(dst, src, n)` handles at most `n` bytes, but if no `\0` occurs among those source bytes, it writes no terminator:

```c
char tight[8];
strncpy(tight, "continue", 8);  // no '\0' in tight

char snug[8];
strncpy(snug, "persist", 8);   // includes '\0'

char roomy[8];
strncpy(roomy, "endure", 8);   // pads remaining bytes with zero
```

The first result is eight letters, not a C string; passing it to `strlen` or `%s` is still undefined. The third shows the other behavior: when the source ends early, `strncpy` pads the requested range with zero bytes. Therefore `n` is neither a magic destination-capacity parameter nor a promise about visible output length.

The string-diamond solution uses it deliberately: copy exactly `i` visible prefix characters, then explicitly write `prefix[i] = '\0'`. Limiting a copy and establishing a terminator are separate operations. Without the second, the result is merely an array fragment.

## Concatenation means finding the old `\0` and overwriting it

```c
char greeting[13];
strcpy(greeting, "hello ");
strcat(greeting, "world!");
```

`strcat` finds the destination terminator, overwrites it with the source's first byte, and copies the rest plus a new terminator. The [POSIX `strcat` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcat.html) also makes overlap undefined. The call therefore has two preconditions: `dst` is already terminated, and its total capacity covers old length, source length, and the final NUL.

For `strncat(dst, src, n)`, `n` limits non-NUL characters appended from the source; it is not total destination capacity. Since the function adds a terminator, derive the bound from remaining room:

```c
size_t used = strlen(alert);
if (used < sizeof alert) {
    strncat(alert, source, sizeof alert - used - 1);
}
```

The final `- 1` reserves the new `\0`. Seeing an `n` parameter is not enough to declare an API safe; determine whether it limits source characters, total output, or inspected input.

## Passing a string passes the address of its first character

The slides use `mockmeme` to alternate the case of letters. Calling `mockmeme(reprimand)` passes the same address as `&reprimand[0]`; no array copy occurs, so writes through `text[i]` change the caller's array.

```c
void mockmeme(char *text) {
    bool upper = true;
    size_t length = strlen(text);
    for (size_t i = 0; i < length; i++) {
        unsigned char ch = (unsigned char)text[i];
        if (isalpha(ch)) {
            text[i] = (char)(upper ? toupper(ch) : tolower(ch));
            upper = !upper;
        }
    }
}
```

`char *` permits mutation. A read-only interface should use `const char *` and let the compiler enforce that promise. Also distinguish a modifiable array, `char reprimand[] = "...";`, from a string literal. The slides choose the former because the example writes into its characters.

## Suffix pointers: treat the middle of one array as a string without copying

```c
char word[8];
strcpy(word, "racecar");

char *all = word;
char *some = word + 4;
printf("%s\n", all);   // racecar
printf("%s\n", some);  // car
```

`some` creates no new string and moves no characters. It changes the starting address to index 4. The original `\0` remains reachable from there, so `%s` sees a valid suffix. Pointer arithmetic and termination fit together: a C string need not begin at array index 0; it needs a reachable terminator after the current pointer.

Aliasing also makes edits nonlocal. Put `"potatoes"` in a nine-slot array and set `fruit = veggie + 2`. `strcpy(fruit, "mag")` writes `m`, `a`, `g`, and NUL starting at index 2, so `veggie` prints `"pomag"`. Old bytes may remain after the new terminator, but they are invisible. Replace that call with `strncpy(fruit, "mid", 2)` and only `m`, `i` are overwritten; no NUL is added, the old suffix continues, and the result is `"pomitoes"`.

Do not solve such examples by intuition. Draw each index and byte, mark both pointer targets, then apply the function contract one byte at a time.

## String diamond: prefixes require copies; suffixes only move the start

`diamond("doris")` prints growing prefixes, then indented shrinking suffixes:

```text
d
do
dor
dori
doris
 oris
  ris
   is
    s
```

```c
void diamond(const char *str) {
    size_t length = strlen(str);

    for (size_t i = 1; i < length; i++) {
        char prefix[i + 1];
        strncpy(prefix, str, i);
        prefix[i] = '\0';
        printf("%s\n", prefix);
    }

    printf("%s\n", str);

    for (size_t i = 1; i < length; i++) {
        for (size_t j = 0; j < i; j++) {
            printf(" ");
        }
        printf("%s\n", str + i);
    }
}
```

A prefix cannot merely move the start because every line must end earlier. The solution allocates `i + 1` slots, copies `i` characters, and stamps its own NUL. Suffixes share the original ending, so `str + i` is enough. This small exercise joins capacity, `strncpy`, manual termination, pointer arithmetic, and aliasing.

Its assumptions are visible too. It uses a variable-length array and emits each row afresh; production code should define behavior and resource limits for empty or enormous inputs. With UTF-8, byte-wise offsets may split a multibyte character. Those are outside the slide's exercise, but they define where its model applies.

## The checklist to keep after this lecture

Before choosing a C string function, answer five questions:

1. Does the start point to a readable `char` sequence?
2. Is a `\0` guaranteed within readable bounds?
3. For writes, is the destination modifiable, and what is its capacity?
4. Does the worst-case output reserve the final terminator slot?
5. Can source and destination overlap, or alias the same array?

That checklist is more reliable than “`strncpy` is safer,” which is simply false as a general rule. Each C function performs a narrow job. None carries capacity or repairs a broken contract. `strlen` trusts termination, `strcpy` trusts space, and `strcat` trusts both an existing terminator and spare capacity.

Lecture 6 does not ultimately deliver an API cheat sheet. It teaches a systems habit: when type information is insufficient, restore the implicit contract in your mental memory diagram. Buffer overflows and security issues in the next lecture do not arrive from nowhere. They are what happens when this lecture's capacity, terminator, and pointer relationships are violated.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 6: Chars and C-Strings (PDF)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/06/Lecture06.pdf)
- [POSIX Issue 8: strlen](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strlen.html)
- [POSIX Issue 8: strcmp](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcmp.html)
- [POSIX Issue 8: strcpy](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcpy.html)
- [POSIX Issue 8: strcat](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strcat.html)
- [POSIX Issue 8: isalnum and the character-classification contract](https://pubs.opengroup.org/onlinepubs/9799919799/functions/isalnum.html)
