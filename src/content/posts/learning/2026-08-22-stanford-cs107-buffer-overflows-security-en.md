---
title: "Stanford CS107 Lecture 7: From String Search to Buffer Overflows—Input Validation Is Not Capacity Checking"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs107, stanford, c-language, systems-programming, buffer-overflow, security]
lang: en
series:
  name: "Reading Stanford CS107"
  order: 8
tldr: "CS107 Lecture 7 builds pointer-based string scanning with strchr, strstr, and strspn, then shows why valid content can still overflow a buffer: safety requires input rules, destination capacity, termination, and memory-error detection."
description: "A lecture-by-lecture reading of Stanford CS107 Winter 2026 Lecture 7: character and substring search, span functions, reverse search, password validation, buffer overflows, defenses, and Valgrind."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs107-buffer-overflows-security)

Lecture 6 defined a C string as a memory contract: starting from a `char *`, a program must encounter `\0` within valid storage. Lecture 7 first exploits that contract for richer searches, then turns to what happens when it breaks. A buffer overflow is not security magic detached from strings. It begins when code writes input into fixed storage without proving that it fits.

The distinction to retain is simple: **valid content does not imply a safe memory operation.** A password may contain only permitted characters and no forbidden fragment, yet still be too long for its destination. `strspn` and `strstr` answer policy questions; capacity reasoning answers a bounds question. Conflating them lets memory bugs hide inside ordinary business logic.

## Materials and complete agenda

- Course: Stanford CS107: Computer Organization & Systems
- Offering: Winter 2026
- Official unit: Lecture 7, January 21, 2026
- Calendar title: C-Strings, Buffer Overflows and Security
- Slide title: More C Strings
- Instructor: the syllabus lists Jerry Cain; the PDF does not separately identify a speaker
- Read in full: the official calendar, all 13 slides, three POSIX specifications, and MITRE CWE-120
- Missing: Canvas video, demo transcript, and lecture code. The last slide says only “Demo: Memory Errors,” so this article does not invent commands or output

The [official calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html) describes this as an extension of the previous lecture: more `string.h`, then why buffer overflows occur and how to reduce risk. The full slide agenda is `strchr`/`strrchr`/`strstr`, a reverse substring search, `strspn`/`strcspn`, string parameters and `const`, password validation, overflow mechanics and historical exploits, capacity reasoning, documentation, and a Valgrind demo.

## Search functions return an address inside the original string, not an index

```c
char laureate[] = "Katalin Kariko";
char *first = strchr(laureate, 'a');
printf("%s\n", first);  // atalin Kariko

char *second = strchr(first + 1, 'a');
printf("%s\n", second); // alin Kariko
```

The [POSIX `strchr` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strchr.html) says it locates the first occurrence and returns a pointer to that byte, or a null pointer on failure. The result is neither a new allocation nor an index; it aliases the original array. Printing with `%s` therefore prints its suffix.

The second search must begin at `first + 1`. Starting at `first` finds the same `'a'` forever. The increment is the progress condition: each iteration reduces the unsearched range.

```c
char *p = laureate;
while ((p = strchr(p, 'a')) != NULL) {
    printf("offset = %td\n", p - laureate);
    p++;
}
```

Test against `NULL` before pointer arithmetic. `strchr(...)+1` is invalid when search fails. One subtle boundary is explicit in POSIX: terminating NUL counts as part of the string, so `strchr(s, '\0')` returns the end position rather than `NULL`.

`strrchr` returns the last occurrence; in the slide example, the final `'a'` begins suffix `"ariko"`. Neither function copies storage, and its result expires when the original array does.

## `strstr` finds a substring, and the empty needle is a real boundary

```c
char laureate[] = "Carolyn Bertozzi";
char *only = strstr(laureate, "zz");
printf("%s\n", only);  // zzi
```

The [POSIX `strstr` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strstr.html) finds the first occurrence of the needle's byte sequence, excluding its terminator. It returns a pointer to the match or null on failure. An empty needle returns the haystack start.

That empty-needle rule matters in loops. Repeatedly calling `strstr(curr, "")` succeeds immediately; even with `curr++`, code may eventually search beyond the array. An interface implementing repeated or reverse search should explicitly define whether an empty pattern maps to the start, end, or invalid input.

Like `strchr`, `strstr` returns an interior pointer. Test `!= NULL` when only existence matters; subtract it from `haystack` for an offset while both point into the same array. Do not free it or assume writes through it are independent of the source.

## There is no `strrstr`: composition works, but its cost is visible

The slides implement “last substring occurrence” by repeatedly calling `strstr`:

```c
char *strrstr(char *haystack, char *needle) {
    char *curr = haystack;
    char *last = NULL;

    if (needle[0] == '\0') return haystack + strlen(haystack);

    while (true) {
        curr = strstr(curr, needle);
        if (curr == NULL) return last;
        last = curr;
        curr++;
    }
}
```

Advancing one byte, rather than `strlen(needle)`, preserves overlapping matches. Searching `"aaaa"` for `"aa"` has valid starts at 0, 1, and 2; jumping two bytes misses index 1.

The cost is rescanning. The slides ask about finding `"wwwww"` in a long run of `w` followed by `xyz`: each call restarts matching later, so repeated prefixes repeat work. The implementation is easy to verify but not asymptotically ideal for every input.

Reversing both strings is not free either. It requires storage or mutation, position mapping, and correct overlap handling. The lesson is to separate correctness from cost: composing APIs can produce an answer without producing the best large-input algorithm.

## `strspn` and `strcspn`: how long does the prefix satisfy a set rule?

`strspn(str, accept)` returns the maximum initial segment whose bytes all belong to `accept`. The [POSIX `strspn` specification](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strspn.html) emphasizes bytes and initial segment—not the number of matching characters anywhere in the string.

```c
char laureate[] = "Barry Sharpless";
size_t count = strspn(laureate, "Broad"); // 4: B a r r
```

`B`, `a`, `r`, `r` belong to the accepted set; `y` does not, so scanning stops. Later accepted characters do not count. Ordering and duplicates inside `accept` do not matter.

`strcspn(str, reject)` is the complement: it returns the initial length containing no rejected byte. The slide's `"Maryam Mirzakhani"` against `"Field"` returns 8 because the first rejected byte occurs at offset 8.

Both return lengths, but compose with pointers: `str + strcspn(str, reject)` points to the first rejected character. If the result equals `strlen(str)`, no rejection occurred before the terminator. That equality drives the validator next.

## Password validation: `const` describes dataflow; span expresses an allowlist

```c
bool validate(const char *candidate,
              const char *permitted,
              const char *forbidden[],
              size_t length) {
    if (strspn(candidate, permitted) != strlen(candidate)) {
        return false;
    }

    for (size_t i = 0; i < length; i++) {
        if (strstr(candidate, forbidden[i]) != NULL) {
            return false;
        }
    }
    return true;
}
```

The first condition is a strict allowlist: one byte outside `permitted` makes the initial span shorter than the whole string. The loop searches every prohibited fragment; it needs only null versus non-null, not the match address.

All strings are `const char *` because validation reads them. `forbidden` is an array of pointers to const characters; arrays travel as pointer plus length, so `length` supplies the loop bound. `const` neither validates size nor repairs a bad pointer, but lets the compiler reject accidental character writes.

This is a byte-based policy. An ASCII permitted set does not understand Unicode. An empty candidate makes both lengths zero and passes the first test; if policy rejects emptiness, add that rule explicitly.

## Content may pass validation and still overflow a buffer

Suppose `validate` returns true and code then does this:

```c
char saved[8];
strcpy(saved, candidate);
```

Anything over seven visible bytes cannot fit. It may use only permitted characters and contain no forbidden substring; policy passes while memory safety fails. Another precondition is required: `strlen(candidate) < sizeof saved`, with strict inequality reserving `\0`.

[MITRE CWE-120](https://cwe.mitre.org/data/definitions/120.html) defines classic buffer overflow as copying an input buffer to an output buffer without verifying that input size is less than output size. It lists memory modification, crashes, and—under exploitable conditions—unauthorized code execution. It also warns that `strncpy` may omit NUL when its bound equals source size.

Separate bug from exploit. An out-of-bounds write is already a defect. Reliable control-data corruption depends on layout, compiler, and runtime mitigations. Not every overflow guarantees arbitrary code execution, but a test that merely prints garbage does not make it harmless.

## Why an overflow can redirect control flow

Adjacent to a fixed array may be ordinary data, function pointers, return addresses, or allocator metadata. `strcpy` keeps writing until source NUL. Corrupt ordinary data and calculations may fail; corrupt a pointer and later accesses may target the wrong address; corrupt control data and execution may reach code it was never meant to run.

The slides use two historical examples: a malicious AOL Instant Messenger message and the 1988 Morris worm's exploitation of early network services. Their shared lesson is unchecked input entering fixed buffers and overwriting memory outside the message, affecting execution. I did not read an original advisory or primary worm analysis for this article, so I do not add exploit details beyond the slide summary.

Privilege also matters. A compromised process may carry account, file, or service permissions. Calling this “just a string-copy bug” misses the environment in which memory corruption executes.

## `gets` fails by interface design, not by insufficient caller caution

The slides quote the system manual's warning about an interface with only:

```c
char *gets(char *s);
```

There is nowhere to pass destination capacity. If input length is unknown, the function cannot decide where writing must stop. Caller vigilance cannot restore missing information. The slide's conclusion is direct: never use `gets`; use a bounded input function such as `fgets`.

A length parameter alone is still no proof. Documentation must say whether it includes a terminator, limits input or output, what truncation leaves behind, and how failure is reported. `strncpy` and `strncat` already show that adding `n` to a name does not perform contract reasoning for the caller.

## Defense is layered evidence, not one replacement function

The slides' recommendations form four layers.

First, design capacity. Write the worst-case output formula, including the terminator, before copy or append. If using `sizeof array`, ensure the expression is still an array; after parameter decay, `sizeof pointer` is not buffer capacity. Pass pointer and capacity together across interfaces.

Second, validate inputs and returns. Keep allowlist, length, syntax, and business rules distinct; inspect returns that report failure or truncation. CWE-120 recommends accepting known-good input rather than guessing every malicious pattern, while noting input validation is incomplete because not all overflows come from external strings.

Third, test boundaries: empty, exact fit, one byte short, oversized, unterminated raw buffers, and overlapping source and destination. Tests should demonstrate that overflow is impossible or rejected gracefully, not merely confirm happy-path output.

Fourth, use tools and environment hardening. The slides point to Valgrind for invalid reads and writes because memory bugs need not crash immediately. CWE-120 also lists compiler hardening, canaries, ASLR, and non-executable memory as defense in depth. They can detect or complicate exploitation; they do not excuse the out-of-bounds write.

## An actionable code-review order

Trace string input through these questions:

1. Where does input originate, and does the caller know length, capacity, or only a pointer?
2. Where is the first copy, and how is destination capacity obtained?
3. Does required-space arithmetic include `\0`, and can the arithmetic overflow?
4. Are content validation and capacity validation separately present?
5. Is truncation an accepted product behavior, or should input be rejected?
6. Is every search return checked against `NULL` before dereference or increment?
7. Do tests cross the boundary and run under a memory-error detector?

This turns “be careful about buffer overflow” into line-by-line work. It also explains why half the lecture concerns search: `strchr`, `strstr`, and spans return boundary-bearing results. Using them correctly requires progress, null checks, alias awareness, and termination. Security is not bolted on at the end; it extends the same pointer reasoning.

Lecture 7 reduces to one sentence: **validating what text says and proving that memory can hold it are different jobs.** Product policy needs the first; remaining within C's defined execution needs the second. Reliable systems code proves both.

## References

- [Stanford CS107 Winter 2026 Calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Lecture 7: More C Strings (PDF)](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/07/Lecture07.pdf)
- [POSIX Issue 8: strchr](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strchr.html)
- [POSIX Issue 8: strstr](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strstr.html)
- [POSIX Issue 8: strspn](https://pubs.opengroup.org/onlinepubs/9799919799/functions/strspn.html)
- [MITRE CWE-120: Buffer Copy without Checking Size of Input](https://cwe.mitre.org/data/definitions/120.html)
