---
title: "Stanford CS103 Lecture 23: Unsolvable Problems, Part I"
date: 2026-08-22
category: learning
type: deep-dive
tags: [cs103, discrete-mathematics, stanford, theory-of-computation]
lang: en
series:
  name: "Stanford CS103 導讀"
  order: 25
tldr: "This lecture connects returning from r, re, and utm to three self-reference warm-ups, following the official examples and proof obligations."
description: "A deck-aligned CS103 guide to returning from r, re, and utm, three self-reference warm-ups, and the limits of the public lecture materials."
draft: false
---

> 🌏 [中文版](/posts/learning/2026-08-22-stanford-cs103-lecture-24-unsolvable-problems-1)

This is article 25 in the [Stanford CS103 guide](/series/stanford-cs103), corresponding to **official Lecture 23, Spring 2026 (2026-05-22)**. The course team was Cynthia Bailey Lee and Alex Aiken. The public page does not name a speaker for each meeting, so this article does not guess. The [lecture page](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/23/) and [complete slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/23/Lecture%20Slides.pdf) are public; recordings and transcripts require Canvas/Panopto access and were not used.

The official topic is **Unsolvable Problems, Part I**. CS103 is not best read as a vocabulary list. For each topic, ask how the object is defined, which inputs are legal, what the claim demands, and what argument could support the conclusion. This article follows the definitions and examples visible in the deck and does not invent spoken material.

## Returning from R, RE, and UTM

A recognizer satisfies “M accepts w iff \(w\in L\).” Members must be accepted; a nonmember may be rejected or may cause a loop. Recognizability is therefore the weak form of solving a problem, and RE contains all recognizable languages. A decider must additionally halt on every input, so it rejects every nonmember. R contains the decidable languages.

UTM faithfully simulates M on \(\langle M,w\rangle\): it accepts, rejects, or loops exactly when M does. Consequently it recognizes

\[
A_{\mathrm{TM}}=\{\langle M,w\rangle\mid M\text{ is a TM and M accepts }w\},
\]

but it is not a decider because of the looping case. The major theorem of this lecture says more than “UTM happens not to decide it”: no decider for \(A_{\mathrm{TM}}\) can exist.

## Three self-reference warm-ups

The previous lecture established that TMs can be constructed to perform arbitrary computations on their own source. The deck calibrates this with three bird-named programs. `cormorant()` prints its own source, `curlew(input)` tests whether input equals its source, and `avocet()` counts occurrences of `a` in its source. None reads an external source file; each uses the self-reference construction.

The examples move from outputting `me`, to comparing `me` with an input, to computing a property of `me`. The later trickster merely performs a different computation involving `me`. Without this theorem, the source-code input in the contradiction would be an unjustified trick.

## The structure of a self-defeating object

The deck defines a self-defeating object as one whose essential properties ensure that it cannot exist. Consider a largest integer n. Its own value lets us construct n+1; since \(n<n+1\), n immediately loses the property of being largest.

This is proof by contradiction: showing `x exists → false` establishes that x does not exist. Showing `x exists → true` establishes nothing about existence. The purported argument “assume x is largest; observe \(x>x-1\); no contradiction occurred” does not prove a largest integer exists. It assumes the desired conclusion and checks only one consequence. Failure to find a contradiction is not proof that none exists.

## How the fortune teller is trapped by an answer

The trickster first agrees to pay $42 if the fortune teller says yes and $137 if the answer is no. Then the trickster asks, “Am I going to pay you $137?” The payment rule gives

\[
\text{SaysYes}\leftrightarrow\text{Pays42},
\]

while a correct prediction requires

\[
\text{SaysYes}\leftrightarrow\text{Pays137}.
\]

Together they equate two mutually exclusive payments. If the answer is yes, the trickster pays $42, falsifying the prediction of $137. If the answer is no, the trickster pays $137, again falsifying the answer. The issue is not poor forecasting accuracy. The claimed power to answer every yes/no question about everyone's future can be targeted by behavior chosen to oppose the answer.

The crucial move is coupling: the trickster binds future behavior to the fortune teller's output in advance. The fortune teller's overly broad specification thus makes it a self-defeating object.

## Are infinite loops accidents or inherent?

Programs sometimes loop in practice, and Turing machines explicitly may neither accept nor reject. The theoretical question is not whether an engineer can repair a particular bug. It is whether one general procedure can correctly determine acceptance for every code/input pair.

UTM shows that \(A_{\mathrm{TM}}\) is recognizable. This lecture proves \(A_{\mathrm{TM}}\notin R\). Some universal-simulation inputs must therefore wait forever. Looping is not merely a defect in UTM's implementation: any always-halting, correct replacement would be the decider the theorem rules out.

## The complete contract of a hypothetical decider

Represent a decider D as

```text
bool willAccept(string function, string input)
```

If `function(input)` returns true, it returns true. If the program returns false, it returns false. If the program loops, it must still halt and return false. The last two cases are both outside \(A_{\mathrm{TM}}\). This differs from UTM precisely in its demanded response to a looping simulation.

The deck's examples can be read directly from this contract. A function f that checks whether a nonempty string starts with `a` returns true on `abbababba`, so willAccept returns true. A function g containing an unconditional `while(true)` requires willAccept to return false rather than loop. For a hailstone program on an input of 10,137 a's, the hypothetical decider must return the correct Boolean result; “unknown” is not allowed by its specification.

## Why that simple interface absorbs hard mathematics

The deck notes that an integer solution of \(x^3+y^3+z^3=33\) was not found until 2019 and displays one enormous triple. As of the deck's May 2025 timestamp, the case 114 remained open. Define

\[
L=\{a^n\mid \exists x,y,z\in\mathbb Z.\ x^3+y^3+z^3=n\}.
\]

A recognizer `hasTriple(n)` enumerates boxes \([-max,max]^3\) for max=0,1,2,... . If a solution exists, some box contains it and the program returns true. If none exists, the search continues forever. Passing that code and 114 to willAccept would return true exactly when a solution exists and false otherwise. An ATM decider would therefore settle this open instance.

Likewise, one can write a recognizer that runs a hailstone sequence and accepts upon reaching 1, then ask D about it. These examples are intuition, not the undecidability proof: a problem being difficult today does not imply that no algorithm exists. They show how the apparently narrow acceptance problem contains many other unbounded searches.

## Translating the fortune teller into trickster

Assume willAccept exists and use the own-source theorem to construct

```text
bool trickster(string input) {
    string me = /* source code of trickster */;
    return !willAccept(me, input);
}
```

willAccept plays the fortune teller; the negation is the precommitted opposing behavior. Correctness of willAccept gives, for every input,

\[
\text{willAccept(me,input)=true}
\leftrightarrow
\text{trickster(input) returns true}.
\]

The body of trickster gives

\[
\text{trickster(input) returns true}
\leftrightarrow
\text{willAccept(me,input) is false}.
\]

Combining them yields P iff not P. The input itself need not equal `me`; `me` occupies the function-code position, and the contradiction holds for every input.

## The theorem: ATM is undecidable

Formally, assume for contradiction that \(A_{\mathrm{TM}}\in R\). Then a decider D exists and can be represented by willAccept with the stated contract. The self-reference theorem supplies trickster and its own code `me`. Correctness of D says that willAccept(me,input) is true iff trickster(input) returns true. The return statement says the latter is true iff willAccept(me,input) is false. A proposition cannot be equivalent to its negation.

The assumption is false, so \(A_{\mathrm{TM}}\notin R\). Together with \(A_{\mathrm{TM}}\in RE\), this makes ATM recognizable but undecidable and proves \(R\subsetneq RE\). Every decider is a recognizer, and now there is a concrete recognizable language that no decider handles.

The argument excludes every implementation of D, not just a particular approach. Static analysis, simulation, theorem proving, or future hardware do not evade it. Any system claiming the total, correct contract on all encoded programs and inputs supports the same trickster construction.

## Three proof obligations that are easy to miss

First, willAccept must halt; otherwise `!willAccept(...)` need not produce a Boolean, and a mere recognizer cannot support the equivalence. Second, `me` must actually encode trickster; that comes from the preceding self-reference theorem, not from reading a file and hoping it is unchanged. Third, D's domain must include the valid trickster encoding and arbitrary string inputs. A tool for a restricted family of programs is not a decider for \(A_{\mathrm{TM}}\).

Also distinguish “returns false” from “does not return true.” willAccept itself always halts, so it has only the two Boolean outcomes. The analyzed function may return false or loop; both map to false. That total Boolean answer makes executable negation possible and drives the contradiction.

## Executable self-test

Make a table whose rows are member and nonmember and whose columns list possible recognizer and decider outcomes. Then use the n+1 argument to explain why `x exists → false`, but not `x exists → true`, can refute existence. Trace both yes and no answers through the fortune teller's payment rule.

Next record what hypothetical willAccept must report for f, the infinite-looping g, and the hailstone h. Finally, without looking back, reconstruct the ATM proof through four links: D's correctness, trickster's own source, negation, and contradiction. Explain why “UTM is not a decider” alone does not establish that \(A_{\mathrm{TM}}\notin R\).

## Material limits

The public deck explicitly supports the sections on returning from r, re, and utm and three self-reference warm-ups. It does not preserve spoken transitions or class discussion, so those details are left unattributed rather than reconstructed.

## Update log

- 2026-08-22: Rechecked returning from r, re, and utm against the official deck, removed dead handout links, and revised metadata and wording after clean review.

## References

- [Stanford CS103 Spring 2026 Lecture 23: Unsolvable Problems, Part I](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/23/)
- [Official Lecture 23 slides](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/lectures/23/Lecture%20Slides.pdf)
- [Alan Turing, On Computable Numbers (1936)](https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf)
- [MIT OpenCourseWare: Recognizability and Undecidability](https://ocw.mit.edu/courses/18-404j-theory-of-computation-fall-2020/resources/mit18_404f20_lec6/)
- [Stanford CS103 Spring 2026 archive](https://web.stanford.edu/class/archive/cs/cs103/cs103.1266/)
