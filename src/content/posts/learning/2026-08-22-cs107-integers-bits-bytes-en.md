---
title: "Stanford CS107 Lecture 3: Integers, Bytes, and Two's Complement"
date: 2026-08-22
category: learning
tags: [cs107, stanford, c-language, systems-programming, binary, integer-overflow]
lang: en
type: deep-dive
series:
  name: "Reading Stanford CS107"
  order: 4
tldr: "Lecture 3 starts with 32/64-bit address spaces, derives the ranges of unsigned and two's-complement signed integers, inversion-plus-one, and shared addition hardware, then separates unsigned modular arithmetic from C signed overflow and tests the model against four failure cases."
description: "A slide-by-slide reading of Stanford CS107 Winter 2026 Lecture 3: fixed-width integers, two's complement, binary addition, unsigned and signed overflow, and real systems failures."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-cs107-integers-bits-bytes)

A bit string has no intrinsic sign. `1011` can be unsigned 11 or 4-bit two's-complement -5. The storage does not change; the interpretation does. CS107 Lecture 3 builds precisely that distinction: establish a width, define an encoding, and only then interpret arithmetic results.

This article follows the [official Winter 2026 Lecture 3 deck](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/03/Lecture03.pdf) in full. Its organizing question is how a finite bit pattern can support unsigned values, signed values, and addition. By the end, you should be able to decode small patterns by hand and explain why “the processor appears to wrap” does not mean “C promises signed overflow will wrap.”

## Lecture metadata and source limits

- Course: Stanford CS107: Computer Organization and Systems
- Term: Winter 2026
- Official unit: Lecture 3, *Integers, Bits and Bytes*; the slide cover says *Bits and Bytes, Integer Representations*
- Date: January 9, 2026
- Instructor: Jerry Cain
- Official material: [course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html), [Lecture 3 slides](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/03/Lecture03.pdf), [SEI CERT C signed-overflow rule](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/integers-int/int32-c/), and [SEI CERT C integer-conversion rule](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/integers-int/int31-c/)
- Assigned reading: skim Bryant and O'Hallaron, Sections 2.2–2.3

The complete 28-page PDF is public. The recording is available only through Canvas, so this article cannot verify live elaborations, questions, or verbal caveats. The deck fully supports the main line through type widths, unsigned representation, two's complement, addition, and overflow. Its four closing examples are treated here as applications of the representation model; this article does not invent causal details absent from the deck.

## Complete agenda

1. Type widths, pointers, and theoretical address spaces on 32-bit and 64-bit systems.
2. Binary interpretation, range, and the odometer model for unsigned integers.
3. A first signed proposal: use the most significant bit for sign and the remaining bits for magnitude.
4. Positive and negative zero, wasted representation, and complicated addition in sign-and-magnitude.
5. Deriving two's complement by asking which pattern added to a positive number produces zero.
6. Invert-and-add-one, negation, a unique zero, and one binary addition mechanism.
7. Fixed-width binary arithmetic, unsigned overflow, and unsigned underflow.
8. Discontinuities on signed and unsigned number wheels, plus C's restriction on signed overflow.
9. PSY's view counter, Pac-Man level 256, and Donkey Kong level 22.
10. The Boeing 787 control-unit and Delta crew-scheduling examples.

## 32-bit and 64-bit: first ask what is that wide

The deck begins with the 32-bit machines common in the early 2000s. When a pointer is 32 bits, or four bytes, it can distinguish addresses from `0` through `2^32 - 1`. If each address names one byte, that gives `2^32` addressable bytes, about 4GB of theoretical address space.

A 64-bit pointer can distinguish `2^64` byte addresses, theoretically 16 exabytes. This number describes the capacity of pointer patterns. It does not say that a 64-bit computer contains 16EB of RAM, nor that hardware and operating systems expose a full 64-bit virtual address. The lecture's point is simpler: every additional bit doubles the number of distinguishable patterns.

Nor does “64-bit system” mean that every C type automatically becomes 64 bits. The deck specifically notes that pointers grew and that `long` often grew. Exact widths still depend on the platform and data model. C programmers cannot infer that `int`, `long`, and pointers all have the same width merely from the machine label. Every range formula in this lecture has the same prerequisite: know the actual width `w` first.

## Unsigned integers: every pattern represents a nonnegative value

An unsigned integer represents zero or a positive whole number. Interpretation follows the positional binary system from Lecture 2: each position carries a power-of-two weight. For four-bit patterns:

```text
0101₂ = 5₁₀
1011₂ = 11₁₀
1111₂ = 15₁₀
```

A width of `w` provides `2^w` patterns. All-zero is the minimum; all-one is the maximum. The range is therefore:

```text
0 ... 2^w - 1
```

Four bits cover 0 through 15. “Sixteen values” and “maximum 15” are consistent because the count begins at zero. Likewise, the largest 32-bit unsigned value is `2^32 - 1`, while the number of patterns is `2^32`.

The slides use an odometer-like number wheel for finite width. A four-bit wheel advances from `0000` to `1111`; one more step has no fifth bit in which to store the carry, so it returns to `0000`. The circle is not decorative. It is the core model of unsigned arithmetic: fixed width retains the remainder modulo `2^w`.

## The first signed proposal: dedicate the top bit to sign

The most intuitive way to make the same patterns represent positive numbers, negative numbers, and zero is to use the most significant bit as a sign. Let `0` mean positive, `1` mean negative, and treat the remaining bits as magnitude:

```text
0110 = +6
1110 = -6

0011 = +3
1011 = -3
```

Humans can read this sign-and-magnitude scheme easily, and positive/negative pairs look natural. Zero exposes the first flaw: `0000` means `+0`, while `1000` means `-0`. Sixteen patterns encode only fifteen distinct values because one encoding is spent on a duplicate zero.

Addition is the more important flaw. If sign and magnitude are separate, hardware cannot simply add every bit column. It must inspect both signs. Equal signs may require magnitude addition; different signs may require subtraction. It then needs magnitude comparison, borrow handling, and a decision about the result's sign. The lecture cares less about awkward human conversion than about special cases in something as fundamental as addition.

The design goal is now visible: a good signed representation should keep one zero, preferably preserve a quick sign indication in the most significant bit, and let the same addition circuit process every mixture of positive and negative operands.

## Deriving two's complement by adding to zero

Rather than begin with a memorized rule, the deck asks an engineering question: in a four-bit world, which pattern can be added to `0101` to produce `0000`? The answer is:

```text
  0101
+ 1011
------
 10000
```

The mathematical result has a fifth carry bit, but a four-bit container cannot retain it. Dropping the leftmost `1` leaves `0000`. If `0101` is +5, then `1011` is an excellent encoding for -5. The same experiment with +3 gives:

```text
  0011
+ 1101
------
 10000
```

So `1101` can encode -3. Zero pairs with itself: `0000 + 0000 = 0000`. The common rule is now apparent: invert every bit, then add one.

```text
Invert 0101 to get 1010; add 1 to get 1011
Invert 0011 to get 1100; add 1 to get 1101
```

Why does this work? A pattern plus its bitwise inverse produces all ones because each column is `0 + 1`. Adding one creates a carry through every position, yielding a leading `1` followed by `w` zeroes. Fixed width discards that leading carry, leaving exactly zero. The representation used in practice is two's complement.

## Reading two's complement and deriving its range

Positive values retain their ordinary binary form. A negative value is the invert-plus-one form of its positive counterpart. Applying the same operation to a negative pattern returns the positive pattern, so the procedure works in either direction at fixed width.

The complete four-bit mapping is:

```text
0000 =  0      1000 = -8
0001 =  1      1001 = -7
0010 =  2      1010 = -6
0011 =  3      1011 = -5
0100 =  4      1100 = -4
0101 =  5      1101 = -3
0110 =  6      1110 = -2
0111 =  7      1111 = -1
```

The general `w`-bit signed range is:

```text
-2^(w-1) ... 2^(w-1) - 1
```

The range is asymmetric. Four bits include -8 but not +8. Zero occupies one position in the nonnegative half; patterns whose top bit is `1` make up the negative half. The minimum pattern `1000` also has no representable positive counterpart. Inverting it and adding one returns `1000`. In real code, negating a signed minimum therefore requires a range check; mechanical application of the bit rule does not make an out-of-range mathematical result valid.

There are two convenient ways to decode a pattern whose top bit is `1`. First, invert and add one to recover the magnitude, then add a minus sign. For `1011`, inversion gives `0100`, and adding one gives `0101`, so the value is -5. Second, treat the top bit's weight as `-2^(w-1)` and all remaining weights as positive. Then `1011` is `-8 + 2 + 1 = -5`. The former is approachable for initial conversion; the latter makes mental decoding and the range easier to see.

## Why the same addition hardware handles both signs

The central design benefit of two's complement is not merely a neat encoding of negative values. Addition need not first split into positive-positive, positive-negative, and negative-negative cases. A processor can add columns, preserve the low `w` bits that fit the container, and discard the carry beyond it. Whenever the mathematical result is representable, the encoding makes those bits agree with signed arithmetic.

For example, four-bit 5 plus -3 is:

```text
  0101   (+5)
+ 1101   (-3)
------
 10010
```

Keeping the low four bits gives `0010`, or +2. For -5 plus -2:

```text
  1011   (-5)
+ 1110   (-2)
------
 11001
```

Keeping `1001` gives -7. Hardware performs the same column-wise addition. Signed versus unsigned meaning enters through operand interpretation, condition checks, and—critically—which results the programming language lets software rely upon.

That boundary matters. A shared adder does not make every out-of-range result valid. A bit pattern is still produced, but C gives unsigned and signed overflow different contracts.

## Unsigned overflow: explicit arithmetic modulo `2^w`

When fixed-width unsigned addition exceeds its largest value, the result wraps to the zero end. With six bits:

```text
111111 + 000001 = 000000
```

Numerically, `63 + 1 = 64`, and `64 mod 64 = 0`. Subtraction below zero wraps from the top as well. Nine-bit zero minus one produces nine ones, or 511. This is not merely behavior that common processors happen to exhibit; unsigned arithmetic can be understood as arithmetic modulo `2^w`.

The unsigned number wheel has one discontinuity: the transition from the largest positive value to zero. Values rise along the direction of increment, then abruptly fall at the boundary. This is the unsigned-overflow point in the deck's wheel exercise.

Defined behavior is not automatically correct product behavior. Modular arithmetic can be intentional in counters or circular sequences. But a view count, monetary value, or array size silently returning to zero is still an application bug even when the language rule is unambiguous. Before adding unsigned values, test whether `max - a < b`; do not wait until after the operation and infer overflow from a surprising result.

## Signed overflow: bits may turn, but C makes no wraparound promise

The two's-complement signed wheel is ordered differently. `000...000` is zero, and increments reach `011...111`, the largest positive value. The next pattern, `100...000`, represents the most negative value. From -1, the next step returns to zero. Viewed only as a wheel, signed values have a discontinuity between the positive maximum and negative minimum.

The deck gives an essential caveat. Hardware still preserves the low bits modulo `2^w`, so on real two's-complement machines +7 plus one commonly appears to become -8. C, however, does not define signed overflow as reliable wraparound. A program must not depend on that observation.

This difference affects optimization. If a compiler may assume that valid C execution does not incur signed overflow, it can transform or eliminate checks that rely on “the result turns negative.” This pattern is therefore not reliable:

```c
int sum = a + b;
if (sum < a) {
    /* too late: a + b may already have overflowed */
}
```

The safe direction is to validate operands before the operation or use a sufficiently wide type with the intended semantics. If the requirement truly is modular arithmetic, choose an unsigned type explicitly rather than asking signed arithmetic to imitate the same circle.

## Four cases: width choices eventually reach the product surface

The deck closes with four groups of examples that move the number wheel into systems. They are not four new representations. They are four manifestations of one mismatch: the field width does not cover the lifetime of the value it stores.

The first is the view count for PSY's “Gangnam Style.” The deck reproduces YouTube's public message that its system had not expected a video to exceed the 32-bit integer limit of `2,147,483,647` views and upgraded to a 64-bit integer. It also includes YouTube's clarification that the team saw the threshold coming and had updated its systems months earlier. The example shows a limit becoming publicly visible; it should not be simplified into a claim that the video crashed YouTube's counter on the spot.

The second is the original Pac-Man's Map 256 glitch. The slides attribute it to an eight-bit level counter. After level 255, the counter cannot directly encode 256, and the right half of the maze contains garbled tiles and incomplete dots, preventing normal progression. The key is not merely that the game is old. An eight-bit unsigned field has 256 patterns, and the boundary can eventually be reached.

The third is the original Donkey Kong's level 22 kill screen. The slides give the timer formula as `10 × (level + 4)`, which produces 260 for level 22. In binary this is `1 0000 0100`, but an eight-bit field retains only `0000 0100`. Mario receives four time units instead of the intended 260. This one can be checked directly as a modular-arithmetic exercise: `260 mod 256 = 4`.

The fourth group concerns operational systems. The deck describes a signed 32-bit counter in 2015 Boeing 787 generator control units that could trigger shutdown after about 248.5 days of continuous power; if all four units reached the boundary together, all could become unavailable. It also describes Delta's 2004 crew-scheduling software using a signed 16-bit counter for crew changes. Severe weather pushed the count beyond 32,767 and into a negative value, compromising crew availability counts amid extensive delays and cancellations.

The shared lesson is not “replace everything with 64 bits.” Greater width postpones some boundaries; it does not prove that no boundary can be reached during the system's life. The engineering action is to write down a field's unit, update frequency, maximum reasonable value, and reset condition, then choose its type and test immediately around each boundary: one below maximum, maximum, one beyond, and the region around minimum.

## Three layers for organizing the lecture

The **representation layer** asks how a pattern is decoded. Unsigned representation assigns only positive positional weights. Two's complement gives the most significant bit a negative weight. `1011` is just bits until a type makes it 11 or -5.

The **arithmetic layer** asks which bits survive fixed width. An adder works column by column, and carry beyond the destination is not stored. Unsigned arithmetic defines the result modulo `2^w`. Signed patterns often show the same truncation in hardware, but a C program may not treat out-of-range behavior as guaranteed.

The **systems layer** asks whether the field's range covers reality. Video traffic, game levels, uptime, and schedule changes can all drive abstract counters to their boundaries. A type is not merely a way to save bytes. It records an assumption about value range and lifetime.

A useful exercise for tonight is to draw a four-bit wheel and label every pattern with both its unsigned and signed values. Then calculate `7 + 1`, `-8 - 1`, and `15 + 1`, recording four separate answers each time: the retained pattern, its unsigned interpretation, its signed interpretation, and whether C permits a program to rely on that result. If those columns remain distinct, the lecture's essential model is in place.

## What should remain after this lecture

1. Width `w` determines the number of patterns; an encoding determines their values.
2. The `w`-bit unsigned range is `0` through `2^w - 1`.
3. The `w`-bit two's-complement signed range is `-2^(w-1)` through `2^(w-1) - 1`.
4. Invert-and-add-one finds the fixed-width additive inverse, allowing one addition mechanism to process positive and negative operands.
5. Unsigned arithmetic has explicit modular semantics. C signed overflow is not a wraparound contract.
6. Overflow is a value-range design problem. Beyond choosing a type, define limits, check boundaries, and test long-term accumulation.

The next lecture turns bit patterns from passive number representations into fields that programs actively manipulate: AND, OR, XOR, NOT, and masks. Without a clean separation between signed and unsigned interpretation, that material degenerates into a truth table. Once the same bits can be seen under multiple numeric meanings, bitwise operators become tools that can be reasoned about.

## References

- [Stanford CS107 Winter 2026 course calendar](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/calendar.html)
- [Stanford CS107 Winter 2026 Lecture 3 slides: Bits and Bytes, Integer Representations](https://web.stanford.edu/class/archive/cs/cs107/cs107.1264/lectures/03/Lecture03.pdf)
- [SEI CERT C INT32-C: Ensure that operations on signed integers do not result in overflow](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/integers-int/int32-c/)
- [SEI CERT C INT31-C: Ensure that integer conversions do not result in lost or misinterpreted data](https://cmu-sei.github.io/secure-coding-standards/sei-cert-c-coding-standard/rules/integers-int/int31-c/)
