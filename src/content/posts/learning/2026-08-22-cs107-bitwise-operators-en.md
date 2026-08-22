---
title: "Stanford CS107 Lecture 4: Bitwise Operators, Conversions, and Masks"
date: 2026-08-22
category: learning
tags: [cs107, stanford, c-language, systems-programming, bitwise-operators, bitmask]
lang: en
type: deep-dive
series:
  name: "Reading Stanford CS107"
  order: 5
tldr: "Lecture 4 first shows that signed/unsigned conversion can preserve bits while changing meaning, that mixed comparisons may surprise, and how sign extension, zero extension, and truncation alter width. It then derives AND, OR, NOT, XOR, and bitmask idioms for testing, setting, clearing, and combining fields."
description: "A slide-by-slide reading of Stanford CS107 Winter 2026 Lecture 4: integer conversion and truncation, bitwise operators, bit vectors, set operations, and composable mask idioms."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-cs107-bitwise-operators)

A bitwise operator does not treat an integer as a merely small number. It temporarily sets aside the aggregate value and treats each position as an independent field. `&` can preserve selected bits, `|` can set them, and `^` can toggle them. Before manipulating a pattern, however, one must know whether C conversion changed its width and whether the same bits are being interpreted as signed or unsigned.

CS107 Lecture 4 therefore does not begin immediately with truth tables. It first closes the representation thread from Lecture 3: casts, mixed-signedness comparison, extension, and truncation. Only after tracking which bits remain, appear, or disappear does it introduce AND, OR, NOT, XOR, bit vectors, and bitmasks. This article follows all 27 pages of the [official Winter 2026 Lecture 4 deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/04/Lecture04.pdf).

## Lecture metadata and source limits

- Course: Stanford CS107: Computer Organization and Systems
- Term: Winter 2026
- Official unit: Lecture 4, *Bitwise Operators*; the slide cover says *Bits and Bytes Wrap-up, Bitwise Operators*
- Date: January 12, 2026
- Lecturer: not independently identified by the public PDF
- Official material: [course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html), [Lecture 4 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/04/Lecture04.pdf), [SEI CERT C integer-conversion guidance](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/recommendations/integers-int/int02-c/), and [Stanford Lab 1](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lab1/)
- Assigned reading: Bryant and O'Hallaron, Chapter 2.1

The copyright line names Stanford Computer Science, while the credits list Cynthia Lee, Chris Gregg, Nick Troccoli, Lisa Yan, Jerry Cain, and other historical contributors. That list does not establish which person delivered this particular class. This article therefore does not infer the lecture's speaker from the course's primary instructor or the slide contributors. The complete public PDF supports every example covered here. The Canvas recording, live elaboration, and classroom questions are unavailable.

## Complete agenda

1. Signed and unsigned casts: the bit pattern stays while the type controls interpretation.
2. The `U` suffix, C-style casts, and negative patterns interpreted as large unsigned values.
3. Implicit conversion and counterintuitive results in mixed signed/unsigned comparisons.
4. Sign extension from a narrower signed type to a wider type.
5. Zero extension from a narrower unsigned type to a wider type.
6. Truncation and value changes when converting from wider to narrower types.
7. Per-bit semantics of `&`, `|`, `~`, and `^`.
8. Aligned operations over multiple bits and the distinction between bitwise and logical operators.
9. The purpose of a bitmask and Boolean compression with bit vectors.
10. Course-set examples of union, intersection, setting, clearing, and testing bits.

## A cast may preserve every bit while changing the value completely

The deck begins by converting a signed `int` to an unsigned `int`:

```c
int v = -12345;
unsigned int uv = v;
printf("v = %d, uv = %u\n", v, uv);
```

Under the deck's 32-bit `int` assumption, the output is:

```text
v = -12345, uv = 4294954951
```

All 32 bits are identical before and after:

```text
11111111111111111100111111000111
```

Interpretation changes. A signed `int` decodes the pattern in two's complement, where the most significant bit contributes negative weight, producing -12345. An unsigned `int` gives every position positive weight, so the same pattern becomes 4294954951. In modular terms, conversion to 32-bit unsigned gives `2^32 - 12345`.

A C-style cast can express the same reinterpretation at the point of use:

```c
printf("v = %d, uv = %u\n", v, (unsigned int)v);
```

The cast does not erase a minus sign or compute absolute value. In this equal-width example, it preserves bits and changes the decoding rule. If source and destination widths differ, extension or truncation also enters the operation. “A cast never changes bits” is therefore not a general rule.

## The `U` suffix and mixed comparison: small syntax, large conversion

A numeric literal can carry a `U` suffix to make it unsigned, as in `12345U`. The deck uses `-12345U` to emphasize a form that is easy to misread. The minus sign is a unary operator, while the literal has unsigned type; the result lives in unsigned arithmetic. It is not an “unsigned value with a negative type.” Determine the literal's type first and then apply operators rather than trusting the surface sign.

The dangerous case is mixing signed and unsigned operands in a comparison. The deck summarizes its examples by saying that the signed operand is converted to unsigned and the comparison then treats both values as nonnegative. Thus:

```c
0 == 0U        // true
-1 < 0         // true
-1 < 0U        // false under the slide's 32-bit int model
```

The third expression is mathematically true, but `0U` takes the comparison into the unsigned domain. The all-one pattern for -1 becomes a large positive value, so the comparison is false. The slides also list:

```c
2147483647 > -2147483648       // true as signed comparison
2147483647U > -2147483648      // false in the shown model
-1 > -2                         // true as signed comparison
(unsigned long)-1 > -2          // true after conversion
```

The point is not to memorize six answers. Use three steps: annotate each operand's type, apply the conversion rules to determine the common comparison type, and only then decode the bits. The complete C integer-conversion rules also account for rank and representable range. The lecture table builds intuition around common-platform cases; it is not a license to reduce every mixed-width combination to one sentence.

Do not use a cast merely to suppress a compiler warning. If a value is semantically nonnegative, validate that precondition before converting it to unsigned. If it may be negative, perform range checks in the signed domain. Allowing signed and unsigned values to meet silently usually hides a precondition inside a conversion rule.

## Sign extension: replicate the sign bit to preserve a signed value

When a narrower signed integer enters a wider signed integer, C needs the original value to survive in more bits. The deck uses 16-bit `short` and 32-bit `int`:

```c
short s = 4, t = -4;
int i = s, j = t;
```

The 16-bit pattern for +4 is:

```text
0000 0000 0000 0100
```

Widening fills the left side with zeroes:

```text
0000 0000 0000 0000 0000 0000 0000 0100
```

The 16-bit two's-complement pattern for -4 is:

```text
1111 1111 1111 1100
```

Filling the new positions with zeroes would turn it into a large positive number. Instead, the original most significant bit—the sign bit—is replicated into every new position:

```text
1111 1111 1111 1111 1111 1111 1111 1100
```

This is sign extension. It is not a disconnected list saying “fill negative with ones, positive with zeroes.” The single rule is to replicate the sign bit. The top-bit-as-negative-weight model also proves the result: the new negative weight and the series of added positive weights cancel in a way that preserves the original value.

## Zero extension: widening unsigned values fills the left with zeroes

Unsigned values have no sign bit; every position has nonnegative weight. When an `unsigned short` widens to `unsigned int`, every new high position can be zero:

```c
unsigned short us = 0b1111111111110010;
unsigned int ui = us;
```

The deck draws the change as:

```text
                1111 1111 1111 0010
0000 0000 0000 0000 1111 1111 1111 0010
```

Leading zeroes add no weight, so the value remains unchanged. Sign and zero extension are not unique to `short`: `char` can widen to `short`, `int`, or `long`, and `int` can widen to `long`. Ask about the source signedness, destination width, and conversion rules rather than assuming behavior from type names alone.

Thinking of extension as mere data movement misses its purpose. It constructs a wider representation while preserving the value. Signed and unsigned values use different fills because their high-order weights follow different encodings.

## Truncation: retaining low bits does not mean retaining the value

In the reverse direction, placing a 32-bit `int` into the deck's assumed 16-bit `short` cannot squeeze four bytes into two. The most significant 16 bits are removed and the least significant 16 remain:

```c
int i = 50000, j = 100000, k = -32769;
short s = i, t = j, v = k;
```

The results shown in the deck are:

```text
50000   -> 1100 0011 0101 0000 -> -15536
100000  -> 1000 0110 1010 0000 -> -31072
-32769  -> 0111 1111 1111 1111 ->  32767
```

The low bits survive exactly, but the destination `short` now treats the retained top bit as its sign bit. The numerical value can even change sign. This is fundamentally different from widening. A widening conversion can usually preserve the source value; if a value lies outside the destination range during narrowing, no representation can preserve all information.

The deck demonstrates truncation with particular platform widths. Portable C code should not assume without qualification that `short` is always 16 bits and `int` is always 32, nor depend on one cross-platform result for an out-of-range signed destination. The engineering practice is to check against the destination type's limits before conversion and convert only after proving representability.

## Four bitwise operators: repeat one rule at every position

Once representation is understood, the question becomes how to manipulate selected bits directly. The deck lists six bitwise operators: `&`, `|`, `~`, `^`, `<<`, and `>>`. This lecture fully develops the first four and leaves shifts for the continuation.

AND `&` is binary and returns one only when both input bits are one:

```text
0 & 0 = 0    0 & 1 = 0
1 & 0 = 0    1 & 1 = 1
```

AND with one lets a bit pass; AND with zero clears it.

OR `|` returns one if either input bit is one:

```text
0 | 0 = 0    0 | 1 = 1
1 | 0 = 1    1 | 1 = 1
```

OR with one sets a bit; OR with zero leaves it unchanged.

NOT `~` is unary and inverts every bit. XOR `^` returns one exactly when one of its two inputs is one. XOR with one toggles a bit; XOR with zero leaves it unchanged. These four verbs—pass, clear, set, and toggle—translate into mask operations more directly than memorized truth tables do.

## Multiple bits: align positions instead of reducing to truth

When applied to multi-bit integers, each corresponding column independently receives the same rule:

```text
  0110       0110       0110      ~1100
& 1100     | 1100     ^ 1100       ----
  ----       ----       ----        0011
  0100       1110       1010
```

The first AND column does not affect the second, and there is no carry. OR does not first coerce two integers to Boolean. XOR does not mean “the integers differ.” The output remains a full bit pattern that can subsequently be decoded as an integer or a collection of fields.

This is the dividing line between bitwise and logical operators. `6 & 12` computes `0110 & 1100`, producing `0100`, or 4. `6 && 12` merely asks whether both operands are nonzero; both are true, so it produces logical true. Likewise, `6 | 12` produces 14, while `6 || 12` is true. `~12` inverts the entire integer representation, while `!12` is false because 12 is nonzero.

In code review, a lone `&` or `|` in a condition deserves a check: is the author testing a bit, or did one character go missing? Conversely, when the requirement is to combine flags, `&&` and `||` destroy the individual fields and cannot replace bitwise operators.

## Bit vectors: positions represent set membership

A bit vector treats each bit as a Boolean slot. The deck mentions the conceptual motivation behind C++ `vector<bool>`: 24 Boolean states can fit in three eight-bit `char` values instead of allocating a full ordinary element for each state. Compression saves space and allows one machine operation to process many states together.

The classroom example uses the eight positions of a `char` to indicate whether a student is taking each core CS course this quarter. Every course owns a fixed position. One means the course belongs to the set; zero means it does not. Pattern `00100011` is not primarily intended to mean decimal 35. In this domain, it is an enrollment map.

This yields the central habit of bit-level programming: write the layout first. Specify which bit means what, what one and zero mean, and whether unused bits must remain zero. Without a layout, hexadecimal constants become unreviewable magic numbers.

## Set operations: OR is union and AND is intersection

When two schedules use the same bit layout, set operations map directly to bitwise operations. The deck shows union as:

```text
  00100011
| 01100001
----------
  01100011
```

If a course appears in either schedule, OR sets the corresponding result bit. That is exactly set union.

Intersection uses AND:

```text
  00100011
& 01100001
----------
  00100001
```

Only courses present in both schedules remain. XOR can similarly represent symmetric difference—the items appearing in exactly one set. That extension follows directly from the lecture's XOR truth table, although the set slides explicitly demonstrate only union and intersection, so it should be kept distinct from the deck's stated examples.

The advantage of a bit vector is alignment between representation and operation. No loop is needed to compare eight Boolean values individually; one OR or AND completes the set operation. The cost is that readability depends on stable names and masks. Scattering raw values such as `0x20` quickly strips the program of domain meaning.

## Bitmasks: construct a pattern that selects positions

A bitmask is a deliberately constructed pattern whose ones and zeroes choose positions to affect. The slides define one-bit masks for eight courses:

```c
#define CS106A  0x01  /* 0000 0001 */
#define CS106B  0x02  /* 0000 0010 */
#define CS106AX 0x04  /* 0000 0100 */
#define CS107   0x08  /* 0000 1000 */
#define CS111   0x10  /* 0001 0000 */
#define CS103   0x20  /* 0010 0000 */
#define CS109   0x40  /* 0100 0000 */
#define CS161   0x80  /* 1000 0000 */
```

Each mask contains a single one, and its position names a course. The comment exposes the binary layout, while the symbolic name restores domain meaning. `1 << n` can also construct the mask for bit `n`. The lecture lists that notation but has not yet developed full shift semantics, so here it means only “move the sole one into the designated position.”

Masks compose. `CS107 | CS111` creates a pattern selecting both courses. Provided the layout is shared, the same operations work whether fields represent courses, permissions, hardware registers, or feature flags.

## Set, clear, test, and toggle: four composable idioms

**Set a bit** with OR. A one in the mask forces the target to one, while every other position is ORed with zero and stays unchanged:

```c
schedule = schedule | CS107;
schedule |= CS107;
```

**Clear a bit** with AND and an inverted mask. `~CS103` has zero only at the CS103 position and ones everywhere else, so AND clears only the target:

```c
schedule &= ~CS103;
```

**Test a bit** with AND. A nonzero result means the target position was one:

```c
if (schedule & CS106B) {
    /* taking CS106B */
}
```

To test whether *all* bits in a multi-bit mask are present, a nonzero result is insufficient; compare `(schedule & required) == required`. A nonzero test is correct when the requirement is “at least one.”

**Toggle a bit** with XOR. Positions selected by ones in the mask flip; all others remain unchanged:

```c
schedule ^= CS107;
```

This idiom follows directly from the lecture's XOR truth table, although its final slide focuses on the enrollment test. Viewed together, the operations need not be memorized as isolated syntax: OR sets, AND-NOT clears, AND tests, and XOR toggles.

## Three layers for organizing the lecture

The **type layer** controls how one pattern is interpreted and whether an implicit conversion occurs before comparison. A negative signed value that meets an unsigned operand may become a large nonnegative value before the comparison runs.

The **width layer** controls how bits enter a different-sized container. Signed widening uses sign extension; unsigned widening uses zero extension. Narrowing retains low bits and may lose both information and numerical value.

The **field layer** temporarily stops treating all bits as one number and instead assigns each position an independent state. Bitwise operators and masks select positions; bit vectors turn union, intersection, and membership into single machine operations.

The layers cannot be collapsed. `schedule & CS106B` has a field-level purpose. If promotion, signedness, or truncation has already changed `schedule`'s representation, return to the type and width layers. A reliable reading order is to write down width and signedness, draw the pattern, and only then apply the operator.

## A hand exercise you can do immediately

Assume an eight-bit schedule begins as `00100011`. Predict these steps without running the program:

```c
schedule |= CS107;
schedule &= ~CS103;
bool has_b = schedule & CS106B;
schedule ^= CS106A;
```

Write the mask before each operation and work column by column. The results should be `00101011`, `00001011`, true, and `00001010`. Then replace `schedule & CS106B` with `schedule && CS106B` and explain why it loses nearly all membership-test meaning: whenever both integers are nonzero, logical AND is true without isolating the CS106B position.

For a type exercise, decode eight-bit pattern `11111011` as both unsigned and two's-complement signed, then sign-extend and zero-extend it to sixteen bits. Do not provide only decimal answers; draw the eight newly created high positions. Distinguishing “change interpretation” from “change width” prevents casts, extension, and masks from collapsing into one vague operation.

## What should remain after this lecture

1. Equal-width signed/unsigned conversion can preserve bits while changing numerical interpretation.
2. Mixed-signedness comparison requires finding a common type before applying mathematical intuition.
3. Sign extension replicates the top bit, zero extension adds zeroes, and truncation preserves low bits without guaranteeing preservation of value.
4. `&`, `|`, `~`, and `^` operate position by position, unlike the aggregate truth tests `&&`, `||`, and `!`.
5. A bit vector carries Boolean meaning by position; OR and AND directly implement set union and intersection.
6. The four core mask idioms—set, clear, test, and toggle—can all be derived from truth tables rather than memorized.

The next lecture continues bitwise operators, especially left and right shifts, and observes representations in `gdb`. This lecture establishes the mask-selection rule first: ones indicate positions to affect, while zeroes preserve positions. Shifts will add a way to create and move those selections.

## References

- [Stanford CS107 Winter 2026 course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Winter 2026 Lecture 4 slides: Bits and Bytes Wrap-up, Bitwise Operators](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/04/Lecture04.pdf)
- [SEI CERT C INT02-C: Understand integer conversion rules](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/recommendations/integers-int/int02-c/)
- [Stanford CS107 Lab 1: Bits, Bytes, and Integers](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lab1/)
